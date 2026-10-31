import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import pg from 'pg';
import {acceptReviewedObservation, type SourceIntakeDatabase} from '../../packages/fachservices/src/u4-reviewed-finding.js';
import {confirmEvent} from '../../packages/fachservices/src/editorial-write.js';
import type {FibActorContext} from '@fib/domain-contracts';
const connection=process.env.U4_TEST_DATABASE_URL;
if(!connection)throw Error('U4_TEST_DATABASE_URL required');
const target=new URL(connection);
if(!['localhost','127.0.0.1'].includes(target.hostname)||target.pathname!=='/fib_u4_test')throw Error('isolated_test_database_required');
const pool=new pg.Pool({connectionString:connection});
const uid='22222222-2222-4222-8222-222222222222';
const actor:FibActorContext={actorKind:'human',userId:uid,role:'editor',active:true,mfaLevel:'aal2'};
const sql=(c:pg.PoolClient)=>({queryOne:async<T>(q:string,p:readonly unknown[])=>((await c.query(q,[...p])).rows[0]??null) as T|null});
let abort=false;
const db:SourceIntakeDatabase={transaction:async work=>{const c=await pool.connect();try{await c.query('begin');const result=await work(sql(c));if(abort)throw Error('injected_rollback');await c.query('commit');return result;}catch(e){await c.query('rollback');throw e;}finally{c.release();}}};
async function count(table:string){return Number((await pool.query('select count(*) from fib.'+table)).rows[0].count);}
async function main(){
 await pool.query('drop schema if exists fib cascade; create schema if not exists auth; create table if not exists auth.users(id uuid primary key)');
 for(const role of ['anon','authenticated','service_role','fib_runtime'])await pool.query(`do $$ begin if not exists(select 1 from pg_roles where rolname='${role}') then create role ${role}; end if; end $$`);
 await pool.query('insert into auth.users values($1) on conflict do nothing',[uid]);
 await pool.query(readFileSync('supabase/schema/core.sql','utf8'));
 await pool.query(readFileSync('supabase/migrations/20261029200933_fib_u4_source_monitor_persistence.sql','utf8'));
 await pool.query(readFileSync('supabase/migrations/20261030093000_fib_u4_source_observations.sql','utf8'));
 await pool.query("insert into fib.app_users(user_id,role,setup_status) values($1,'editor','active')",[uid]);
 const sourceId=(await pool.query("insert into fib.sources(name,homepage_url) values ('RIS','https://buergerinfo-feldkirchen.digitalfabrix.de') returning id")).rows[0].id;
 const scopeId=(await pool.query("insert into fib.source_scopes(source_id,scope_key,scope_label,entry_url,access_method) values($1,'test','Test','https://buergerinfo-feldkirchen.digitalfabrix.de','ris') returning id",[sourceId])).rows[0].id;
 const url='https://buergerinfo-feldkirchen.digitalfabrix.de/vo0050.asp?__kvonr=8640';
 await pool.query('insert into fib.source_observations values($1,$2,$2,$3,now(),now(),1)',[scopeId,url,'hash1']);
 const input={scopeId,sourceId,externalId:url,revision:1,fingerprint:'hash1',title:'TOP 2: veröffentlichte Vorlage',approval:true as const};
 await assert.rejects(()=>acceptReviewedObservation({...actor,actorKind:'ai_task'},input,db),/forbidden/);
 await assert.rejects(()=>acceptReviewedObservation({...actor,mfaLevel:'aal1'},input,db),/forbidden/);
 await assert.rejects(()=>acceptReviewedObservation(actor,{...input,revision:2},db),/stale_review/);
 abort=true;await assert.rejects(()=>acceptReviewedObservation(actor,input,db),/injected_rollback/);abort=false;
 assert.equal(await count('findings'),0);assert.equal(await count('finding_versions'),0);
 const [one,two]=await Promise.all([acceptReviewedObservation(actor,input,db),acceptReviewedObservation(actor,input,db)]);
 assert.equal(one.findingId,two.findingId);assert.equal(await count('findings'),1);assert.equal(await count('finding_versions'),1);
 for(const table of ['events','messages','processes','topics'])assert.equal(await count(table),0);
 await pool.query("update fib.source_observations set revision=2,content_fingerprint='hash2'");
 await assert.rejects(()=>acceptReviewedObservation(actor,input,db),/stale_review/);
 await acceptReviewedObservation(actor,{...input,revision:2,fingerprint:'hash2'},db);
 assert.equal(await count('finding_versions'),2);
 assert.equal((await pool.query('select title from fib.findings')).rows[0].title,input.title);
 const result=await db.transaction(async tx=>{const r=await confirmEvent(actor,{findingId:one.findingId,title:'Veröffentlichung eines Beschlussvorschlags'},tx);if(!r.ok)throw Error(r.reason);return r;});
 assert.equal(result.ok,true);assert.equal(await count('events'),1);assert.equal(await count('event_findings'),1);assert.equal(await count('messages'),0);
 // Schema-only downstream navigation: fixtures represent already approved process/topic objects.
 const processId=(await pool.query("insert into fib.processes(title) values('Existing process') returning id")).rows[0].id;
 const topicId=(await pool.query("insert into fib.topics(title) values('Existing topic') returning id")).rows[0].id;
 await pool.query('insert into fib.event_processes(event_id,process_id) values($1,$2)',[result.eventId,processId]);
 await pool.query("insert into fib.process_topics(process_id,topic_id,significance) values($1,$2,'relevant')",[processId,topicId]);
 assert.equal((await pool.query('select pt.topic_id from fib.event_findings ef join fib.event_processes ep using(event_id) join fib.process_topics pt using(process_id) where ef.finding_id=$1',[one.findingId])).rows[0].topic_id,topicId);
 await assert.rejects(()=>pool.query('insert into fib.event_processes(event_id,process_id) values($1,$2)',[result.eventId,processId]),/duplicate key/);
 await assert.rejects(()=>pool.query("insert into fib.event_topics(event_id,topic_id,significance) values($1,$2,'invented')",[result.eventId,topicId]),/check constraint/);
 // Native n:m relationships and FK integrity, without bypassing editorial service to claim UI integration.
 await assert.rejects(()=>pool.query('insert into fib.event_findings values(gen_random_uuid(),$1,null,null,now())',[one.findingId]),/foreign key/);
 const c=await pool.connect();try{await c.query('begin');await c.query('set local role anon');await assert.rejects(()=>c.query('select * from fib.findings'),/permission denied/);await c.query('rollback');}finally{c.release();}
 console.log('Existing schema: reviewed source → versioned finding → explicit confirmEvent, concurrency, rollback, stale review, FK and anon denial passed');
}
main().finally(()=>pool.end()).catch(e=>{console.error(e);process.exitCode=1});
