import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api=readFileSync(new URL('../supabase/functions/fib-topic-editor/index.ts',import.meta.url),'utf8');
const schema=readFileSync(new URL('../supabase/migrations/20261020160000_fib_topic_contribution_lifecycle.sql',import.meta.url),'utf8');

test('new actions stay behind existing AAL2 and FIB role gates',()=>{
  const gate=api.indexOf('const actor = await resolveAal2User(req)');
  const role=api.indexOf("['admin', 'editor'].includes(allowed[0].role)");
  const action=api.indexOf("body.action === 'save_contribution_draft'");
  assert.ok(gate>=0 && role>gate && action>role);
});
test('topic writes use database transactions and pessimistic row locks',()=>{
 for(const action of ['save_contribution_draft','approve_contribution','revoke_contribution','publish_contribution','defer_topic','archive_topic','reactivate_topic']){
  assert.ok(api.includes("body.action === '"+action+"'"),action);
 }
 assert.ok(api.includes('sql.begin(async tx =>'));
 assert.match(api,/from fib\.topics where id=\$1::uuid for update/);
 assert.match(api,/revision_conflict/);
});
test('reactivation is checked against actual draft and published version',()=>{
 assert.match(api,/const unchanged = lastVersion\.length > 0/);
 assert.match(api,/drafts\[0\]\.body === lastVersion\[0\]\.body/);
 assert.doesNotMatch(api,/unchangedContent:true/);
});
test('topic publication uses explicit confirmation and current approval',()=>{
 assert.match(api,/explicitConfirmation:body\.confirmation === true/);
 assert.match(api,/decideTopicAction\(action/);
 assert.match(api,/topic_publications/);
});
test('migration trigger delimiters valid and paired',()=>{
 const tag='$topic_guard$';
 assert.equal(schema.split('language plpgsql as '+tag).length-1,2);
 assert.equal(schema.split('end '+tag+';').length-1,2);
 assert.doesNotMatch(schema,/language plpgsql as \$\s*\n/);
});
