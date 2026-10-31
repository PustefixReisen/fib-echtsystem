import pg from 'pg';
import {readFileSync} from 'node:fs';
import {options,privateOutput,target} from './io.mjs';
import {parseRisStructure,persistRisStructure,persistRisDocument} from '../../supabase/functions/_shared/ris-structure.ts';
import {adapter,datasetKeys,registerCreatedRows,reference,fingerprint} from './datasets.ts';
async function main(){
const connection=process.env.FIB_MAINTENANCE_DATABASE_URL??process.env.U4_TEST_DATABASE_URL;
target(connection);if(typeof options.bundle!=='string'||typeof options.out!=='string')throw Error('--bundle and private --out required');
const b=JSON.parse(readFileSync(options.bundle,'utf8'));
if(b.kind!=='fib-shared-ris-bundle-v1'||b.batch!=='ris-abnahme-20261031'||b.sessions?.length!==2||b.documents?.length!==6)throw Error('Invalid reference bundle');
const minutes=b.documents.find((d:any)=>d.url.endsWith('id=75785'));
const provenance=JSON.parse(readFileSync('tests/u4/fixtures/ris-1031-provenance.json','utf8'));
if(minutes?.hash!==provenance.pdfSha256||b.documents.some((d:any)=>!d.originalBytes||!d.text?.trim()))throw Error('Original provenance mismatch');
const bundleHash=fingerprint(b),apply=options.apply===true;
if(apply&&(options['bundle-sha']!==bundleHash||typeof options.approval!=='string'||!options.approval.trim()))throw Error('Apply needs reviewed --bundle-sha and --approval reference');
const db=new pg.Client({connectionString:connection});await db.connect();const tx=adapter(db);
try{
 await db.query(apply?'begin':'begin read only');
 const required=['ris_sessions','development_batches','development_objects'];
 const present=[];for(const t of required)present.push((await tx.unsafe('select to_regclass($1) r',['fib.'+t]))[0].r);
 const sources=await tx.unsafe("select id,homepage_url,active from fib.sources where homepage_url in ('https://buergerinfo-feldkirchen.digitalfabrix.de','https://www.feldkirchen.de') order by homepage_url");
 const report:any={batch:b.batch,bundleSha256:bundleHash,mode:apply?'apply':'read_only_plan',requiredPresent:present.every(Boolean),sourceCount:sources.length,sourcesActive:sources.length===2&&sources.every(s=>s.active),scope:'reduced HTML reference excerpts; six privately captured original PDFs; no decisions/events/messages created'};
 if(!apply){privateOutput(options.out,JSON.stringify(report,null,2)+'\n');await db.query('rollback');console.log('Read-only data plan written. Approval and preparation migrations required before apply.');}
 else{
  if(!report.requiredPresent||!report.sourcesActive)throw Error('Migrations and explicit two-source activation required');
  await tx.unsafe("select pg_advisory_xact_lock(hashtextextended('fib-ris-acceptance-import',0))");
  const old=await tx.unsafe('select status from fib.development_batches where id=$1',[b.batch]);if(old.length&&old[0].status!=='active')throw Error('Dataset closed; never silently reactivate');
  await tx.unsafe("insert into fib.development_batches(id,purpose,approval_reference) values($1,'RIS reference source acceptance; not published',$2) on conflict do nothing",[b.batch,options.approval]);
  const before=await datasetKeys(tx);
  for(const s of b.sessions){const parsed=await parseRisStructure(s.html,s.url,b.capturedAt);(parsed as any).capture={scope:s.scope,fixture:s.fixture,bundleSha256:bundleHash};await persistRisStructure(tx,parsed);}
  for(const d of b.documents)await persistRisDocument(tx,d.url,d.hash,d.text,d.method,b.capturedAt);
  const scopes=await tx.unsafe("select id from fib.source_scopes where scope_key='gemeinde-nachrichten' and status='candidate'");if(scopes.length!==1)throw Error('Expected existing candidate news scope');
  const obs=await tx.unsafe('select scope_id,external_id from fib.source_observations where scope_id=$1 and canonical_url=$2',[scopes[0].id,b.newsUrl]);
  if(obs.length!==1)throw Error('Expected existing Parkraumkonzept observation; refresh approved news scanner separately, never invent it');
  await registerCreatedRows(tx,b.batch,before);
  await reference(tx,b.batch,'source_observations',obs[0]);
  for(const scope of await tx.unsafe("select id from fib.source_scopes where scope_key in ('ris-dokumentliste','gemeinde-nachrichten') and status='candidate'"))await reference(tx,b.batch,'source_scopes',{id:scope.id});
  const committees=await tx.unsafe("select distinct committee_id id from fib.ris_sessions where source_url in ($1,$2)",b.sessions.map((s:any)=>s.url));
  for(const c of committees)if(c.id)await reference(tx,b.batch,'ris_committees',{id:c.id});
  const counts=await tx.unsafe('select table_name,ownership,count(*)::int n from fib.development_objects where batch_id=$1 group by table_name,ownership order by table_name,ownership',[b.batch]);
  report.objects=counts;
  // Write a receipt before commit; the durable authoritative ownership ledger commits with the data.
  privateOutput(options.out,JSON.stringify({...report,commitStatus:'verify database ledger after successful process exit'},null,2)+'\n');
  await db.query('commit');console.log('Reference intake committed with dataset ledger; no editorial confirmation or publication created.');
 }
}catch(e:any){await db.query('rollback');console.error('Reference preparation aborted:',e.code??e.message);process.exitCode=1;}finally{await db.end();}

}
main().catch(e=>{console.error(e.code??e.message);process.exitCode=1;});
