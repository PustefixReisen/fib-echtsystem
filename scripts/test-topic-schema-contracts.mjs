import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const sql=readFileSync(new URL('../supabase/migrations/20261020160000_fib_topic_contribution_lifecycle.sql',import.meta.url),'utf8');

test('draft status and backwards-compatible topic statuses',()=>{
 assert.match(sql,/status in \('draft','active','deferred','archived','dormant'\)/);
 assert.match(sql,/alter table fib\.topics alter column status set default 'draft'/);
});
test('separate work drafts, history, publications and currency checks',()=>{
 for(const name of ['topic_contribution_drafts','topic_revisions','topic_contribution_versions','topic_publications','topic_currency_checks'])
  assert.match(sql,new RegExp('create table if not exists fib\\.'+name));
 assert.match(sql,/topic_one_current_publication/);
});
test('approved content is immutable and publication requires active approval',()=>{
 assert.match(sql,/topic_approval_immutability/);
 assert.match(sql,/approved version content is immutable/);
 assert.match(sql,/topic_publication_approval_guard/);
 assert.match(sql,/publication requires a valid non-revoked topic approval/);
 assert.match(sql,/for update/);
});
test('protected history cannot be deleted by runtime role',()=>{
 assert.match(sql,/grant select,insert,update on fib\.topic_contribution_versions/);
 assert.doesNotMatch(sql,/grant select,insert,update,delete on fib\.topic_contribution_drafts,\s*fib\.topic_revisions,fib\.topic_contribution_versions/);
});
test('RLS is enabled and browser roles are not granted access',()=>{
 for(const name of ['topic_contribution_drafts','topic_revisions','topic_contribution_versions','topic_publications','topic_currency_checks']){
  assert.match(sql,new RegExp('alter table fib\\.'+name+' enable row level security'));
 }
 assert.doesNotMatch(sql,/grant\s+[^;]+to\s+(?:anon|authenticated)/i);
});

test('PL/pgSQL trigger bodies have paired tagged delimiters',()=>{
 const token = '$topic_guard$';
 assert.equal(sql.split('language plpgsql as '+token).length-1,2);
 assert.equal(sql.split('end '+token+';').length-1,2);
 assert.doesNotMatch(sql,/language plpgsql as \$\s*\n/);
});
