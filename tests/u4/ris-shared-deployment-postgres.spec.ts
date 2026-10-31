import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import pg from 'pg';
import {parseRisStructure,persistRisStructure,persistRisDocument} from '../../supabase/functions/_shared/ris-structure.ts';
import {withDevelopmentDataset} from '../../supabase/functions/_shared/development-datasets.ts';
import {risEditorial} from '../../supabase/functions/_shared/ris-editorial.ts';
import {sourceEditorial} from '../../supabase/functions/_shared/source-editorial.ts';
import {sourceReadiness} from '../../supabase/functions/_shared/source-readiness.ts';
import {adapter,datasetKeys,registerCreatedRows,reference,cleanupPlan,cleanup} from '../../scripts/ris-shared-apps/datasets.ts';
async function main(){
const connection=process.env.U4_TEST_DATABASE_URL;if(!connection)throw Error('isolated_test_database_required');
const u=new URL(connection);if(!['localhost','127.0.0.1'].includes(u.hostname)||u.pathname!=='/fib_u4_test')throw Error('isolated_test_database_required');
const owner=new pg.Client({connectionString:connection}),other=new pg.Client({connectionString:connection});await owner.connect();await other.connect();
let runtime:pg.Client;
const first=async(q:string,p:any[]=[])=> (await owner.query(q,p)).rows[0];
async function transact<T>(client:pg.Client,work:(tx:any)=>Promise<T>){await client.query('begin');try{const r=await work(adapter(client));await client.query('commit');return r;}catch(e){await client.query('rollback');throw e;}}
try{
 await owner.query('drop schema if exists fib cascade;create schema if not exists auth;create table if not exists auth.users(id uuid primary key)');
 await owner.query("do $$ begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon;end if;if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated;end if;if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role;end if;end $$;");
 const files=[...readFileSync('tests/ris-e2e/bootstrap.mjs','utf8').matchAll(/"((?:schema|security|migrations)\/[^"\n]+\.sql)"/g)].map(m=>'supabase/'+m[1]);
 for(const f of files)await owner.query(readFileSync(f,'utf8'));
 await owner.query("create table public.memorix_sentinel(id int primary key,payload text);insert into public.memorix_sentinel values(1,'unchanged')");
 const actor=randomUUID(),source=randomUUID(),scope=randomUUID(),outside=randomUUID();
 await owner.query('insert into auth.users(id) values($1)',[actor]);
 await owner.query("insert into fib.app_users(user_id,full_name,role,setup_status) values($1,'Synthetic reviewer','admin','active')",[actor]);
 await owner.query("insert into fib.sources(id,name,homepage_url,active) values($1,'[ENTWICKLUNG ris-test] RIS','https://buergerinfo-feldkirchen.digitalfabrix.de',false)",[source]);
 await owner.query("insert into fib.source_scopes(id,source_id,scope_key,scope_label,entry_url,access_method) values($1,$2,'ris-dokumentliste','Synthetic scope','https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp','ris')",[scope,source]);
 const batch='ris-test-batch';
 await transact(owner,async tx=>{
  await tx.unsafe('insert into fib.development_batches(id,purpose,approval_reference) values($1,$2,$3)',[batch,'Isolated synthetic test','CI only']);
  const before=await datasetKeys(tx);
  const snap=await parseRisStructure(readFileSync('tests/u4/fixtures/ris-1032-top-2-3.html','utf8'),'https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1032','2026-10-31T10:00:00Z');
  await persistRisStructure(tx,snap);
  await persistRisDocument(tx,'https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=75714','a'.repeat(64),'Synthetischer Vorschlag, kein Beschluss.','explicit_synthetic_test','2026-10-31T10:00:00Z');
  await registerCreatedRows(tx,batch,before);
  await reference(tx,batch,'source_scopes',{id:scope});
  const c=await tx.unsafe('select committee_id from fib.ris_sessions');await reference(tx,batch,'ris_committees',{id:c[0].committee_id});
 });
 await owner.query("alter role fib_app password 'isolated_runtime_only'");
 const ru=new URL(connection);ru.username='fib_app';ru.password='isolated_runtime_only';runtime=new pg.Client({connectionString:ru.href});await runtime.connect();
 assert.equal((await sourceReadiness(adapter(runtime),true)).ready,true);
 assert.equal((await sourceReadiness(adapter(runtime),false)).ready,false);
 const doc=await first("select d.*,v.id version_id from fib.ris_documents d join fib.ris_document_versions v on v.id=d.latest_version_id where source_url like '%id=75714'");
 const human={userId:actor,kind:'human' as const,aal:'aal2' as const};
 const accept={action:'ris_accept_finding',versionId:doc.version_id,sourceId:source,title:'[ENTWICKLUNG ris-test] Vorlage'};
 await assert.rejects(()=>transact(runtime,tx=>withDevelopmentDataset(tx,accept,()=>risEditorial(tx,human,accept))));
 assert.equal((await first('select count(*) n from fib.findings')).n,'0');
 await owner.query('update fib.sources set active=true where id=$1',[source]);
 const finding=await transact(runtime,tx=>withDevelopmentDataset(tx,accept,()=>risEditorial(tx,human,accept)));
 const create={action:'source_create_event',findingId:finding.findingId,title:'[ENTWICKLUNG ris-test] Veröffentlichung',rationale:'Explicit synthetic CI decision',approval:true,requestId:randomUUID()};
 const event=await transact(runtime,async tx=>withDevelopmentDataset(tx,create,async()=>{
  await other.query("insert into fib.events(id,title) values($1,'Unmarked concurrent sentinel')",[outside]);
  return sourceEditorial(tx,human,create);
 }));
 assert.equal((await first("select count(*) n from fib.development_objects where table_name='events' and ownership='owned'")).n,'1');
 assert.equal((await first("select count(*) n from fib.development_objects where row_key=$1::jsonb",[JSON.stringify({id:outside})])).n,'0');
 // Unknown context/fields cannot opt unrelated writes into a dataset.
 const unsafe={action:'edit_event',versionId:doc.version_id,eventId:outside};
 let called=false;await transact(runtime,tx=>withDevelopmentDataset(tx,unsafe,async()=>{called=true;return true;}));assert.equal(called,true);
 // The ordinary runtime cannot alter ownership/history or delete data.
 await assert.rejects(()=>runtime.query('delete from fib.development_objects'));
 await assert.rejects(()=>runtime.query("update fib.development_batches set status='purged'"));
 await assert.rejects(()=>runtime.query('select * from auth.users'));
 await assert.rejects(()=>runtime.query('select * from public.memorix_sentinel'));
 // Closed batch stops test tagging. Cleanup is explicit, reviewed and concurrency protected.
 await owner.query("update fib.development_batches set status='closed' where id=$1",[batch]);
 const before=await cleanupPlan(adapter(owner),batch);assert.deepEqual(before.blockers,[]);
 await owner.query("update fib.findings set title=title||' edited' where id=$1",[finding.findingId]);
 await assert.rejects(()=>transact(owner,tx=>cleanup(tx,batch,before.sha256)),/stale_cleanup_plan/);
 await owner.query("insert into fib.event_findings(event_id,finding_id,justification) values($1,$2,'Unmarked reference must block cascade')",[outside,finding.findingId]);
 const blocked=await cleanupPlan(adapter(owner),batch);assert.ok(blocked.blockers.length);
 await assert.rejects(()=>transact(owner,tx=>cleanup(tx,batch,blocked.sha256)),/unmarked_reference_blocks_cleanup/);
 assert.equal((await first('select count(*) n from fib.events')).n,'2');
 await owner.query('delete from fib.event_findings where event_id=$1 and finding_id=$2',[outside,finding.findingId]);
 await owner.query('create table public.foreign_reference(id int primary key,finding_id uuid references fib.findings(id) on delete cascade)');
 await owner.query('insert into public.foreign_reference values(1,$1)',[finding.findingId]);
 const cross=await cleanupPlan(adapter(owner),batch);assert.ok(cross.blockers.some((b:any)=>b.table==='public.foreign_reference'));
 await assert.rejects(()=>transact(owner,tx=>cleanup(tx,batch,cross.sha256)),/unmarked_reference_blocks_cleanup/);
 assert.equal((await first('select count(*) n from public.foreign_reference')).n,'1');
 await owner.query('drop table public.foreign_reference');

 const current=await cleanupPlan(adapter(owner),batch);const result=await transact(owner,tx=>cleanup(tx,batch,current.sha256));assert.ok(result.removed>0);
 assert.equal((await first('select count(*) n from fib.events')).n,'1');
 assert.equal((await first('select id from fib.events')).id,outside);
 for(const t of ['ris_sessions','ris_document_versions','findings','finding_versions'])assert.equal((await first('select count(*) n from fib.'+t)).n,'0');
 assert.equal((await first('select count(*) n from fib.sources')).n,'1');
 assert.equal((await first('select count(*) n from fib.ris_committees')).n,'1');
 assert.equal((await first('select count(*) n from fib.app_users')).n,'1');
 assert.equal((await first('select payload from public.memorix_sentinel')).payload,'unchanged');
 assert.equal((await first('select status from fib.development_batches where id=$1',[batch])).status,'purged');
 console.log('PASS real PostgreSQL: active-source gate, exact transaction ownership, concurrent unmarked row protection, runtime/RLS restrictions, stale/foreign-reference refusal, cyclic FK cleanup and retained master data/Auth/public sentinel');
}finally{if(runtime!)await runtime.end();await other.end();await owner.end();}

}
main().catch(e=>{console.error(e.stack??e.message);process.exitCode=1;});
