import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import pg from 'pg';
import {parseRisStructure,persistRisStructure,persistRisDocument,risHash} from '../../supabase/functions/_shared/ris-structure.ts';
import {runRisAnalysis,readRisAnalysis,analysisInput,type AnalysisDatabase} from '../../supabase/functions/_shared/ris-analysis-worker.ts';
import {appendFindingAbstract,readCurrentFindingAbstract} from '../../supabase/functions/_shared/finding-abstract-storage.ts';
import {processFindingAbstract,syntheticExtractiveGenerator} from '../../supabase/functions/_shared/finding-abstract-pipeline.ts';
import {databaseAbstractRights,databasePilotBudget} from '../../supabase/functions/_shared/finding-abstract-pilot-gates.ts';
const connection=process.env.U4_TEST_DATABASE_URL;
if(!connection)throw Error('isolated_test_database_required');
const u=new URL(connection);
if(!['localhost','127.0.0.1'].includes(u.hostname)||u.pathname!=='/fib_u4_test')throw Error('isolated_test_database_required');
const pool=new pg.Pool({connectionString:connection});
const owner=new pg.Client({connectionString:connection});
await owner.connect();
const db:AnalysisDatabase={
 unsafe:async(q,p)=>{
  const c=await pool.connect();
  try {await c.query('begin');await c.query('set local role fib_runtime');const r=(await c.query(q,p)).rows;await c.query('commit');return r;}
  catch(e){await c.query('rollback');throw e;}finally{c.release();}
 },
 transaction:async work=>{
  const c=await pool.connect();
  try {await c.query('begin');await c.query('set local role fib_runtime');const r=await work({unsafe:async(q,p)=>(await c.query(q,p)).rows});await c.query('commit');return r;}
  catch(e){await c.query('rollback');throw e;}finally{c.release();}
 },
};
const query=async(q:string,p:unknown[]=[]) => (await owner.query(q,p)).rows;
const options={documentPolicy:[],extractPages:async()=>{throw Error('Unexpected document retrieval');}};
try {
 await query('drop schema if exists fib cascade; create schema if not exists auth; create table if not exists auth.users(id uuid primary key)');
 await query("do $$ begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon;end if;if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated;end if;if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role;end if;end $$;");
 await query('drop schema if exists storage cascade;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);');
 for(const [,path] of readFileSync('tests/ris-e2e/bootstrap.mjs','utf8').matchAll(/"((?:schema|security|migrations)\/[^"\n]+\.sql)"/g))
  await query(readFileSync('supabase/'+path,'utf8'));
 await query(readFileSync('supabase/migrations/20261111083118_fib_ris_automatic_analysis.sql','utf8'));
 await query(readFileSync('supabase/migrations/20261112140000_fib_finding_abstract_versions.sql','utf8'));
 await query(readFileSync('supabase/migrations/20261112145000_fib_abstract_pilot_gates.sql','utf8'));
 await query('create table if not exists public.memorix_analysis_sentinel(value text);truncate public.memorix_analysis_sentinel;insert into public.memorix_analysis_sentinel values(\'unchanged\')');
 await query("insert into fib.sources(name,homepage_url) values('RIS','https://buergerinfo-feldkirchen.digitalfabrix.de')");
 const indexed=JSON.parse(readFileSync('tests/u4/fixtures/ris-1031-public-agenda-indexed-20261109.json','utf8'));
 const html='<html><body><div class="smc-table-cell siname">GR/439/2026</div><div class="smc-table-cell sigrname">Gemeinderat</div><div class="smc-table-cell sidat">15.10.2026</div><table>'+indexed.agenda.map((a:any)=>'<tr class="smc-t-r-l"><td class="tofnum"><span class="badge">Ö '+a.number+'</span></td><td class="tolink"><div class="margin-bottom smc-card-header-title-simple">'+a.title+'</div></td></tr>').join('')+'</table></body></html>';
 for(const [text,url] of [[html,indexed.source_url],[readFileSync('tests/u4/fixtures/ris-1032-top-2-3.html','utf8'),'https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1032']])
  await db.transaction(async tx=>persistRisStructure(tx,await parseRisStructure(text,url,new Date().toISOString())));
 const [{id:agendaId}]=await query("select a.id from fib.ris_agenda_items a join fib.ris_sessions s on s.id=a.session_id where s.reference='GR/440/2026' and a.number='2'");
 const [{id:documentId,source_url:documentUrl}]=await query('select d.* from fib.ris_documents d join fib.ris_document_links l on l.document_id=d.id where l.agenda_id=$1',[agendaId]);
 const bytes=new TextEncoder().encode('%PDF-1.4\n synthetic only');
 const hash=await risHash(bytes);
 await db.transaction(tx=>persistRisDocument(tx,documentUrl,hash,null,'synthetic',new Date().toISOString()));
 await query("insert into fib.processes(title) values('Hundewiese in Feldkirchen')");
 await query("insert into fib.topics(title) values('Kita-Finanzierung')");
 const original=JSON.stringify(await query('select id,title,status from fib.events order by id'));
 await runRisAnalysis(db,options);await runRisAnalysis(db,options);
 assert.equal((await query('select count(*)::int n from fib.ris_analysis_versions'))[0].n,21);
 const initial=(await query('select id from fib.ris_analysis_versions order by id')).map(r=>r.id);
 await runRisAnalysis(db,options);await runRisAnalysis(db,options);
 assert.deepEqual((await query('select id from fib.ris_analysis_versions order by id')).map(r=>r.id),initial,'Unchanged input is processed once');
 const read=await db.transaction(tx=>readRisAnalysis(tx,agendaId)) as any;
 assert.equal(read.status,'current');assert.equal(read.payload.relations[0].status,'candidate');
 assert.equal(JSON.stringify(read.payload).includes('rights_evidence'),false);
 await assert.rejects(()=>db.unsafe("update fib.ris_analysis_versions set payload='{}'"),/permission denied/);
 await assert.rejects(()=>db.unsafe('select * from public.memorix_analysis_sentinel'),/permission denied/);
 await query('begin');await query('set local role authenticated');
 await assert.rejects(()=>query('select * from fib.ris_analysis_versions'),/permission denied/);await query('rollback');
 // Catalogue and document policy changes invalidate previous versions immediately.
 await query("update fib.topics set title='Kindertageseinrichtungen und Gebühren'");
 assert.equal((await db.transaction(tx=>readRisAnalysis(tx,agendaId)) as any).status,'pending_or_stale');
 await runRisAnalysis(db,options);await runRisAnalysis(db,options);
 assert.equal((await db.transaction(tx=>readRisAnalysis(tx,agendaId)) as any).status,'current');
 const [{version_id:versionId}]=await query('select latest_version_id version_id from fib.ris_documents where id=$1',[documentId]);
 const [{id:reviewer}]=await query('insert into auth.users(id) values(gen_random_uuid()) returning id');
 await query("insert into fib.app_users(user_id,role,setup_status) values($1,'admin','active')",[reviewer]);
 await query("update fib.ris_document_versions set content_author='municipality',rights_evidence='Synthetic test permission',rights_reviewed_by=$2,rights_reviewed_at=now() where id=$1",[versionId,reviewer]);
 const prioritize=async()=>query("update fib.ris_analysis_state set last_checked_at=case when agenda_id=$1 then 'epoch'::timestamptz else now() end",[agendaId]);
 await prioritize();
 let fetchCount=0;
 const allowed={documentPolicy:['verified-rights'],fetchDocument:async()=>{fetchCount++;return {bytes:bytes.slice(),hash};},extractPages:async()=>['Kindertageseinrichtungen BayKiBiG AFK. TRANSIENT_PRIVATE_SENTINEL']};
 const failure=await runRisAnalysis(db,{...allowed,extractPages:async()=>{throw Error('TRANSIENT_PRIVATE_SENTINEL api-key=do-not-log');}});
 assert.equal(failure.failed,1);
 const [failed]=await query('select * from fib.ris_analysis_state where agenda_id=$1',[agendaId]);
 assert.equal(failed.error_code,'analysis_failed');
 const count=fetchCount;await prioritize();await runRisAnalysis(db,allowed);assert.equal(fetchCount,count,'Failed work uses bounded backoff');
 await query("update fib.ris_analysis_state set next_attempt_at=now()-interval '1 minute' where agenda_id=$1",[agendaId]);
 await prioritize();await runRisAnalysis(db,allowed);
 const enriched=await db.transaction(tx=>readRisAnalysis(tx,agendaId,['verified-rights'])) as any;
 assert.equal(enriched.status,'current');assert.equal(enriched.payload.coverage[0].status,'analyzed');
 assert.ok(enriched.payload.insights.some((i:any)=>i.value==='BayKiBiG'));
 assert.equal(JSON.stringify(await query('select payload from fib.ris_analysis_versions')).includes('TRANSIENT_PRIVATE_SENTINEL'),false);
 // Modified source during a fetch cannot be published as current.
 await query("update fib.ris_document_versions set rights_evidence='Changed permission' where id=$1",[versionId]);
 await prioritize();
 const changed=await runRisAnalysis(db,{...allowed,extractPages:async()=>{
  await query("update fib.ris_document_versions set rights_evidence='Changed during extraction' where id=$1",[versionId]);return ['BayKiBiG'];
 }});
 assert.ok(changed.changed>=1);
 assert.equal((await db.transaction(tx=>readRisAnalysis(tx,agendaId,['verified-rights'])) as any).status,'pending_or_stale');
 await prioritize();await runRisAnalysis(db,allowed);
 // Reclaim an expired worker after a crash; concurrent workers cannot own the same lease.
 await query("update fib.ris_document_versions set rights_evidence='Crash retry' where id=$1",[versionId]);
 await query("update fib.ris_analysis_state set status='running',lease_token=gen_random_uuid(),lease_until=now()-interval '1 minute' where agenda_id=$1",[agendaId]);
 await prioritize();
 let release!:()=>void;let entered!:()=>void;
 const ready=new Promise<void>(r=>{entered=r});const gate=new Promise<void>(r=>{release=r});
 const first=runRisAnalysis(db,{...allowed,extractPages:async()=>{entered();await gate;return ['BayKiBiG'];}});
 await ready;const second=await runRisAnalysis(db,allowed);assert.ok(second.skipped>=1);release();await first;
 assert.equal((await db.transaction(tx=>readRisAnalysis(tx,agendaId,['verified-rights'])) as any).status,'current');
 assert.equal(JSON.stringify(await query('select id,title,status from fib.events order by id')),original,'Analysis does not mutate imported events');
 assert.equal((await query('select value from public.memorix_analysis_sentinel'))[0].value,'unchanged');
 // Shared abstract storage – isolated, never real documents or models.
 const [{id:sourceId}]=await query("select id from fib.sources limit 1");
 const docUrl='https://example.invalid/synthetic-press';
 const [{id:findingId}]=await query('insert into fib.findings(source_id,title,original_url) values($1,$2,$3) returning id',
   [sourceId,'Synthetischer Pressetext',docUrl]);
 const [{id:abstractVersionId}]=await query(`insert into fib.finding_versions(
   finding_id,revision,fingerprint,observed_at,original_url,metadata)
   values($1,1,$2,now(),$3,'{}'::jsonb) returning id`,
   [findingId,'a'.repeat(64),docUrl]);
 const ctx={findingId,findingVersionId:abstractVersionId,fingerprint:'a'.repeat(64),
   sourceUrl:docUrl,sourceKind:'press' as const,model:'rules',modelVersion:'test-1',
   schemaVersion:'v1'};
 const raw={summary:'Fiktiver Testfall ohne Quelle.',claims:[{
   kind:'fact',statement:'Ein synthetischer Sachverhalt.',certainty:'supported',
   evidence:[{url:docUrl,versionId:abstractVersionId}]}],relations:[],limitations:[]};
 const permit=async()=>true;const deny=async()=>false;
 await assert.rejects(()=>db.transaction(tx=>appendFindingAbstract(tx,ctx,raw,deny)),/not_authorized/);
 const abstractFirst=await db.transaction(tx=>appendFindingAbstract(tx,ctx,raw,permit));
 assert.equal(abstractFirst.existing,false);
 const abstractRepeat=await db.transaction(tx=>appendFindingAbstract(tx,ctx,raw,permit));
 assert.equal(abstractRepeat.existing,true);assert.equal(abstractFirst.id,abstractRepeat.id);
 assert.equal((await db.transaction(tx=>readCurrentFindingAbstract(tx,ctx,permit)))?.summary,
   raw.summary);
 await assert.rejects(()=>db.transaction(tx=>readCurrentFindingAbstract(tx,ctx,deny)),/not_authorized/);
 await assert.rejects(()=>db.transaction(tx=>appendFindingAbstract(tx,ctx,{...raw,rawText:'secret'},permit)),
   /invalid_abstract/);
 await assert.rejects(()=>db.transaction(tx=>appendFindingAbstract(tx,
   {...ctx,fingerprint:'b'.repeat(64)},raw,permit)),/source_changed/);
 await assert.rejects(()=>db.unsafe("update fib.finding_abstract_versions set result='{}'::jsonb"),
   /permission denied/);
 await assert.rejects(()=>db.unsafe('delete from fib.finding_abstract_versions'),
   /permission denied/);
 const [{id:abstractNextVersion}]=await query(`insert into fib.finding_versions(
   finding_id,revision,fingerprint,observed_at,original_url,metadata)
   values($1,2,$2,now(),$3,'{}'::jsonb) returning id`,
   [findingId,'b'.repeat(64),docUrl]);
 assert.equal(await db.transaction(tx=>readCurrentFindingAbstract(tx,ctx,permit)),null);
 await assert.rejects(()=>db.transaction(tx=>appendFindingAbstract(tx,ctx,raw,permit)),
   /source_not_current/);
 const abstractNextCtx={...ctx,findingVersionId:abstractNextVersion,fingerprint:'b'.repeat(64)};
 const abstractNextRaw={...raw,claims:raw.claims.map(c=>({...c,evidence:[{url:docUrl,versionId:abstractNextVersion}]}))};
 const abstractNext=await db.transaction(tx=>appendFindingAbstract(tx,abstractNextCtx,abstractNextRaw,permit));
 assert.equal(abstractNext.existing,false);
 assert.equal((await query('select count(*)::int n from fib.finding_abstract_versions'))[0].n,2,
   'Old derived versions are immutable history');
 await query('begin');await query('set local role authenticated');
 await assert.rejects(()=>query('select * from fib.finding_abstract_versions'),/permission denied/);
 await query('rollback');
 console.log('PASS shared abstract PostgreSQL: rights gate, source-version binding, idempotence, immutable history, stale suppression and restricted roles');
 // End-to-end synthetic pipeline across a real PostgreSQL transaction.
 let loads=0,generations=0,rightsChecks=0;
 const abstractPipelineContext={...abstractNextCtx,modelVersion:'synthetic-pipeline-v1'};
 const abstractPipeline={
   rights:async()=>{rightsChecks++;return true;},
   load:async()=>{loads++;return {fingerprint:abstractPipelineContext.fingerprint,
      segments:[{page:1,text:'FIKTIVE Pressemitteilung. Die Gemeinde bespricht Radverkehr.'}]};},
   generate:async(input:Parameters<typeof syntheticExtractiveGenerator>[0])=>{
     generations++;return syntheticExtractiveGenerator(input);
   },
   transaction:db.transaction,
 };
 const processed=await processFindingAbstract(abstractPipelineContext,abstractPipeline);
 assert.equal(processed.kind,'created');
 assert.ok(processed.result.summary.startsWith('FIKTIVE Pressemitteilung'));
 assert.equal(processed.result.relations.length,0);
 assert.equal(processed.result.claims[0].evidence[0].versionId,abstractNextVersion);
 const reprocessed=await processFindingAbstract(abstractPipelineContext,abstractPipeline);
 assert.equal(reprocessed.kind,'cached');
 assert.equal(loads,1);assert.equal(generations,1);
 assert.ok(rightsChecks>=3,'Authorization is checked before load and persistence');
 await assert.rejects(()=>processFindingAbstract({...abstractPipelineContext,modelVersion:'denied'},
   {...abstractPipeline,rights:async()=>false}),/not_authorized/);
 assert.equal(loads,1,'No loading when authorization fails');
 await assert.rejects(()=>processFindingAbstract({...abstractPipelineContext,modelVersion:'changed'},
   {...abstractPipeline,load:async()=>({fingerprint:'c'.repeat(64),
      segments:[{page:1,text:'Only fictional'}]})}),/source_changed/);
 await assert.rejects(()=>processFindingAbstract({...abstractPipelineContext,modelVersion:'wrong-top',scopeTop:2},
   {...abstractPipeline,load:async()=>({fingerprint:abstractPipelineContext.fingerprint,
      segments:[{page:1,top:3,text:'Wrong TOP'}]})}),/top_scope_unverified/);
 await assert.rejects(()=>processFindingAbstract({...abstractPipelineContext,modelVersion:'oversize'},
   {...abstractPipeline,load:async()=>({fingerprint:abstractPipelineContext.fingerprint,
      segments:[{page:1,text:'x'.repeat(12001)}]})}),/resource_limit/);
 assert.equal((await query('select count(*)::int n from fib.finding_abstract_versions'))[0].n,3,
   'Fail-closed cases never store a result');
 console.log('PASS synthetic pipeline: source rights before access, bounded segments, TOP isolation, repeat cache, immutable PostgreSQL insert');
 // Operator-owned rights: missing decision must deny, runtime cannot grant itself.
 const checkRights=databaseAbstractRights(db.transaction,false);
 const checkExternalAi=databaseAbstractRights(db.transaction,true);
 const identity={findingId,findingVersionId:abstractNextVersion,sourceKind:'press' as const};
 assert.equal(await checkRights(identity),false);
 assert.equal(await checkExternalAi(identity),false);
 await assert.rejects(()=>db.unsafe(`insert into fib.finding_abstract_permissions(
   finding_version_id,source_kind,permitted,rights_basis,privacy_basis,reviewed_by,expires_at)
   values($1,'press',true,'synthetic permission','synthetic privacy',$2,now()+interval '1 day')`,
   [abstractNextVersion,reviewer]),/permission denied/);
 await query(`insert into fib.finding_abstract_permissions(
   finding_version_id,source_kind,permitted,rights_basis,privacy_basis,
   external_ai_allowed,reviewed_by,expires_at)
   values($1,'press',true,'Synthetic authored-by-test permission',
     'Synthetic test only no personal data',false,$2,now()+interval '1 day')`,
   [abstractNextVersion,reviewer]);
 assert.equal(await checkRights(identity),true);
 assert.equal(await checkExternalAi(identity),false,'Local rights do not grant external AI transmission');
 await query('update fib.finding_abstract_permissions set external_ai_allowed=true where finding_version_id=$1',
   [abstractNextVersion]);
 assert.equal(await checkExternalAi(identity),true);
 await query('update fib.finding_abstract_permissions set expires_at=now()-interval \'1 second\' where finding_version_id=$1',
   [abstractNextVersion]);
 assert.equal(await checkExternalAi(identity),false,'Expired approvals fail closed');
 // All requests serialized against one budget row, including multiple workers.
 const money=databasePilotBudget(db.transaction);
 const reserve1='1'.repeat(64),reserve2='2'.repeat(64),reserve3='3'.repeat(64);
 const concurrent=await Promise.allSettled([money.reserve(reserve1,350),money.reserve(reserve2,350)]);
 assert.equal(concurrent.filter(r=>r.status==='fulfilled').length,1,'Atomic cap permits one of two simultaneous 350-cent requests');
 const winningKey=concurrent[0].status==='fulfilled'?reserve1:reserve2;
 const losingKey=winningKey===reserve1?reserve2:reserve1;
 await assert.rejects(()=>money.reserve(winningKey,1),/duplicate_request/);
 const winner=concurrent[0].status==='fulfilled'?concurrent[0].value:(concurrent[1] as PromiseFulfilledResult<Awaited<ReturnType<typeof money.reserve>>>).value;
 await winner.uncertain();
 await assert.rejects(()=>winner.releaseUnsent(),/reservation_final/,
   'Ambiguous requests cannot reclaim held funds');
 await assert.rejects(()=>money.reserve(losingKey,151),/budget_exhausted/);
 const lower=await money.reserve(reserve3,149);
 await lower.settle(21);
 await lower.settle(21); // same billed amount idempotent
 await assert.rejects(()=>lower.settle(22),/reservation_final/);
 await assert.rejects(()=>money.reserve(reserve3,1),/duplicate_request/);
 const [{held_cents:held,consumed_cents:used}]=await query('select held_cents,consumed_cents from fib.abstract_pilot_budget where id=1');
 assert.equal(Number(held),350);
 assert.equal(Number(used),21);
 await assert.rejects(()=>money.reserve('4'.repeat(64),130),/budget_exhausted/);
 await assert.rejects(()=>db.unsafe('delete from fib.finding_abstract_permissions'),/permission denied/);
 await query('begin');await query('set local role authenticated');
 await assert.rejects(()=>query('select * from fib.abstract_pilot_reservations'),/permission denied/);
 await query('rollback');
 // A fake model may cite the right URL but a page it never received.
 await assert.rejects(()=>processFindingAbstract({...abstractPipelineContext,modelVersion:'wrong-page'},
   {...abstractPipeline,generate:async()=>({summary:'Invented page',claims:[{
     kind:'fact',statement:'Invented page',certainty:'supported',
     evidence:[{url:docUrl,versionId:abstractNextVersion,page:90}]}],relations:[],limitations:[]})}),
   /evidence_not_in_loaded_segments/);
 console.log('PASS pilot gates: operator-only versioned rights, independent external-AI approval, expired rights, concurrent atomic EUR 5 cap and uncertain charges');
 console.log('PASS actual PostgreSQL: 21 reference TOPs, version reuse, stale suppression, policy/catalog changes, immutable outputs, RLS, backoff, source races, expired leases, competing workers, no stored text and unchanged original events');
} finally {await owner.end();await pool.end();}
