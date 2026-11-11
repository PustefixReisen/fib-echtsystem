import { type RisSql } from './ris-structure.ts';
import { fetchRisOriginal } from './ris-originals.ts';
import { analyzeRis, analysisFingerprint, RIS_ANALYZER_VERSION,
  type AnalysisInput, type AnalysisDocument, type DocumentCoverage } from './ris-analysis.ts';

export type AnalysisDatabase = RisSql & {transaction<T>(work:(tx:RisSql)=>Promise<T>):Promise<T>};
export type AnalysisOptions = {
  documentPolicy:string[];
  extractPages:(bytes:Uint8Array)=>Promise<string[]>;
  fetchDocument?:typeof fetchRisOriginal;
};
/** A consistent caller-owned transaction reads only metadata, not stored original text. */
export async function analysisInput(tx:RisSql,agendaId:string,documentPolicy:string[]=[]):Promise<AnalysisInput|null> {
  const [agenda] = await tx.unsafe(`select a.id,a.session_id,a.number,a.title,s.source_url,
    a.treatment_status,(select item->>'observedTreatment' from jsonb_array_elements(v.snapshot->'agenda') item
      where item->>'key'=a.source_key limit 1) observed_treatment,te.event_id,s.session_date::text
    from fib.ris_agenda_items a join fib.ris_top_events te on te.agenda_id=a.id
    join fib.ris_sessions s on s.id=a.session_id
    join fib.ris_session_versions v on v.id=a.latest_snapshot_id where a.id=$1`,[agendaId]);
  if(!agenda)return null;
  const numbers = await tx.unsafe('select number from fib.ris_agenda_items where session_id=$1 order by number::integer',[agenda.session_id]);
  const documents = await tx.unsafe(`select distinct d.id,d.latest_version_id version_id,v.content_hash,
    d.source_url,d.finding_id,l.kind,v.content_author,v.rights_evidence
    from fib.ris_document_links l join fib.ris_documents d on d.id=l.document_id
    left join fib.ris_document_versions v on v.id=d.latest_version_id
    where l.session_id=$1 and l.status<>'rejected'
      and (l.agenda_id=$2 or (l.agenda_id is null and l.kind='minutes'))
    order by d.id,l.kind`,[agenda.session_id,agendaId]);
  const votes = await tx.unsafe(`select vote_index,result,yes_count,no_count,abstention_count,
    source_document_url,source_sha256 from fib.ris_top_vote_results where agenda_id=$1 order by vote_index`,[agendaId]);
  const targets = await tx.unsafe(`select id,'process' as kind,title from fib.processes
    union all select id,'topic' as kind,title from fib.topics order by kind,id`);
  // Missing imported versions get a dated live-observation fingerprint. Once
  // imported versions exist, only actual source/profile/catalogue changes rerun.
  const refreshKey=documents.some(d=>!d.content_hash && documentPolicy.includes(d.kind))
    ?new Date().toISOString().slice(0,10):null;
  return {refreshKey,documentPolicy,agenda,numbers:numbers.map(row=>Number(row.number)),documents,votes,targets} as AnalysisInput;
}
export async function readRisAnalysis(tx:RisSql,agendaId:string,documentPolicy:string[]=[]) {
  const input = await analysisInput(tx,agendaId,documentPolicy);
  if(!input)return {status:'not_found'};
  const inputHash = await analysisFingerprint(input);
  const [version] = await tx.unsafe(`select id,generated_at,payload from fib.ris_analysis_versions
    where agenda_id=$1 and input_hash=$2 and analyzer_version=$3`,[agendaId,inputHash,RIS_ANALYZER_VERSION]);
  // Never return stale assertions as current, even before the next polling run.
  if(version)return {status:'current',...version};
  const [state] = await tx.unsafe('select status,error_code,next_attempt_at from fib.ris_analysis_state where agenda_id=$1',[agendaId]);
  return {status:state?.status==='failed'?'failed':'pending_or_stale',error:state?.error_code??null,
    nextAttemptAt:state?.next_attempt_at??null};
}

export async function runRisAnalysis(db:AnalysisDatabase, options:AnalysisOptions) {
  const started=Date.now();
  const report={checked:0,analyzed:0,skipped:0,failed:0,changed:0};
  // Reconciliation runs separately from import. Round-robin also retries crashes
  // and discovers changed versions/catalog entries without an import trigger.
  await db.unsafe(`insert into fib.ris_analysis_state(agenda_id)
    select agenda_id from fib.ris_top_events on conflict do nothing`);
  const candidates=await db.unsafe(`select agenda_id from fib.ris_analysis_state
    order by last_checked_at,agenda_id limit 20`);
  const cache=new Map<string,Promise<{pages:string[];hash:string}>>();
  let worked=0;
  for(const candidate of candidates) {
    if(worked>=(options.documentPolicy.length?2:20) || Date.now()-started>45000)break;
    const agendaId=String(candidate.agenda_id);
    const token=crypto.randomUUID();
    const claimed=await db.transaction(async tx=>{
      const [state]=await tx.unsafe('select *,next_attempt_at<=now() due,lease_until>now() leased from fib.ris_analysis_state where agenda_id=$1 for update',[agendaId]);
      if(!state)return null;
      await tx.unsafe('update fib.ris_analysis_state set last_checked_at=now() where agenda_id=$1',[agendaId]);
      if(state.leased)return null;
      const input=await analysisInput(tx,agendaId,options.documentPolicy);
      if(!input)return null;
      const inputHash=await analysisFingerprint(input);
      const [existing]=await tx.unsafe('select id from fib.ris_analysis_versions where agenda_id=$1 and input_hash=$2 and analyzer_version=$3',
        [agendaId,inputHash,RIS_ANALYZER_VERSION]);
      if(existing)return null;
      const same=state.input_hash===inputHash && state.analyzer_version===RIS_ANALYZER_VERSION;
      if(same && !state.due)return null;
      await tx.unsafe(`update fib.ris_analysis_state set input_hash=$2,analyzer_version=$3,
        status='running',lease_token=$4,lease_until=now()+interval '5 minutes',
        attempts=case when input_hash=$2 and analyzer_version=$3 then attempts+1 else 1 end,
        error_code=null where agenda_id=$1`,[agendaId,inputHash,RIS_ANALYZER_VERSION,token]);
      return {input,inputHash};
    });
    report.checked++;
    if(!claimed){report.skipped++;continue;}
    worked++;
    try {
      const coverage:DocumentCoverage[]=[];
      const documents:Array<{document:AnalysisDocument;pages:string[]}>=[];
      let retrieved=0;
      for(const document of claimed.input.documents) {
        const verifiedRights=['municipality','licensed'].includes(document.content_author??'') && Boolean(document.rights_evidence);
        const permitted=options.documentPolicy.includes(document.kind) ||
          (options.documentPolicy.includes('verified-rights') && verifiedRights);
        const status=!options.documentPolicy.length?'metadata_only':!permitted?'rights_unverified':
          retrieved>=12?'resource_limit':null;
        if(status) {
          coverage.push({documentId:document.id,versionId:document.version_id,sha256:document.content_hash,status:status??'metadata_only'});
          continue;
        }
        retrieved++;
        const key=(document.version_id??document.source_url)+':'+document.content_hash;
        if(!cache.has(key))cache.set(key,(async()=>{
          const {bytes,hash}=await (options.fetchDocument??fetchRisOriginal)(document.source_url);
          try {
            if(bytes.length>12000000)throw Error('pdf_limit');
            if(document.content_hash && hash!==document.content_hash)throw Error('source_changed');
            const pages=await options.extractPages(bytes);
            if(pages.length>400 || pages.join('').length>800000 || pages.join('').trim().length===0)throw Error('text_limit');
            return {pages,hash};
          } finally {bytes.fill(0);}
        })());
        const {pages,hash}=await cache.get(key)!;
        documents.push({document:{...document,content_hash:hash},pages});
      }
      const payload=analyzeRis(claimed.input,documents,coverage);
      const outcome=await db.transaction(async tx=>{
        const [state]=await tx.unsafe('select lease_token from fib.ris_analysis_state where agenda_id=$1 for update',[agendaId]);
        if(state?.lease_token!==token)return 'superseded';
        const current=await analysisInput(tx,agendaId,options.documentPolicy);
        if(!current || await analysisFingerprint(current)!==claimed.inputHash) {
          await tx.unsafe(`update fib.ris_analysis_state set status='pending',lease_token=null,
            lease_until=null,next_attempt_at=now(),error_code='source_changed' where agenda_id=$1`,[agendaId]);
          return 'changed';
        }
        await tx.unsafe(`insert into fib.ris_analysis_versions(agenda_id,input_hash,analyzer_version,payload)
          values($1,$2,$3,$4::jsonb) on conflict do nothing`,[agendaId,claimed.inputHash,RIS_ANALYZER_VERSION,JSON.stringify(payload)]);
        await tx.unsafe(`update fib.ris_analysis_state set status='complete',lease_token=null,
          lease_until=null,next_attempt_at=now(),error_code=null where agenda_id=$1`,[agendaId]);
        return 'analyzed';
      });
      if(outcome==='analyzed')report.analyzed++;
      else report.changed++;
    }catch {
      // Never persist exception messages, URLs with credentials, source text or model responses.
      await db.unsafe(`update fib.ris_analysis_state set status='failed',lease_token=null,
        lease_until=null,error_code='analysis_failed',
        next_attempt_at=now()+least(86400,300*power(2,least(attempts-1,8))) * interval '1 second'
        where agenda_id=$1 and lease_token=$2`,[agendaId,token]);
      report.failed++;
    }
  }
  cache.clear();
  return report;
}
