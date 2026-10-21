import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const service=readFileSync(new URL('../supabase/functions/fib-topic-editor/index.ts',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261020160000_fib_topic_contribution_lifecycle.sql',import.meta.url),'utf8');

test('every topic request passes verified AAL2 and active FIB role gate',()=>{
 assert.match(service,/const actor = await resolveAal2User\(req\)/);
 assert.match(service,/if \(!actor\) return json\(/);
 assert.match(service,/fib\.app_users where user_id=.*active=true and setup_status='active'/);
 assert.match(service,/\['admin', 'editor'\]/);
});
test('topic actions use a database transaction and row lock',()=>{
 for(const action of ['approve_contribution','revoke_contribution','publish_contribution','defer_topic','archive_topic','reactivate_topic','delete_topic']){
  const pos=service.indexOf("body.action === '"+action+"'");
  assert.ok(pos>=0,action);
 }
 for(const op of ["'approve'","'revoke'","'publish'","'defer'","'archive'","'reactivate'","'delete'"])
  assert.ok(service.includes(op),op);
 assert.match(service,/sql\.begin\(async tx/);
 assert.match(service,/for update/);
});
test('publish uses explicit confirmation and does not auto-publish on reactivate',()=>{
 assert.match(service,/explicitConfirmation:body\.confirmation === true/);
 assert.match(service,/update fib\.topic_publications/);
 assert.match(service,/insert into fib\.topic_publications/);
 const reactivateBlock=service.slice(service.indexOf("if (body.action === 'defer_topic'"),service.indexOf("if (body.action === 'delete_topic'"));
 assert.doesNotMatch(reactivateBlock,/insert into fib\.topic_publications/);
});
test('draft saving uses optimistic revision check',()=>{
 assert.match(service,/body\.expectedRevision/);
 assert.match(service,/actual !== body\.expectedRevision/);
 assert.match(service,/revision_conflict/);
});
test('delete is soft and requires never-published and no effective approval',()=>{
 assert.match(service,/decideTopicAction\('delete'/);
 assert.match(service,/select 1 from fib\.topic_publications where topic_id/);
 assert.match(service,/where topic_id=\$1::uuid and revoked_at is null/);
 assert.match(service,/set deleted_at=now\(\),deleted_by=/);
});
test('migration enforces one active public version and rejects revoked approvals',()=>{
 assert.match(migration,/topic_one_current_publication/);
 assert.match(migration,/topic_publication_approval_guard/);
 assert.match(migration,/topic_approval_immutability/);
});


test('confirmed topic links update inside a lock-protected transaction with revision audit',()=>{
 assert.match(service,/body\.action === 'update_confirmed_link'/);
 assert.match(service,/invalid_link_update/);
 assert.match(service,/select significance,significance_rationale from fib\.process_topics[^;]+for update/s);
 assert.match(service,/update fib\.process_topics set significance=/);
 assert.match(service,/insert into fib\.topic_revisions/);
});
