import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const handler = readFileSync('supabase/functions/fib-topic-editor/index.ts', 'utf8');
const migration = readFileSync('supabase/migrations/20261019130000_process_topic_proposals.sql', 'utf8');

export function caseTopicEndpointRequiresVerifiedMfaAndMembership() {
  assert.match(handler, /claims\.aal === 'aal2'/);
  assert.match(handler, /\/auth\/v1\/user/);
  assert.match(handler, /active=true and setup_status='active'/);
  assert.match(handler, /\['admin', 'editor'\]/);
}

export function caseTopicProposalsCannotPretendToBeAi() {
  assert.match(handler, /body\.origin !== 'editor'/);
  assert.match(migration, /origin in \('ai','editor'\)/);
}

export function caseTopicDecisionIsAtomicAndNotReplayed() {
  assert.match(handler, /sql\.begin\(async tx =>/);
  assert.match(handler, /for update/);
  assert.match(handler, /proposal\[0\]\.status !== 'pending'/);
  assert.match(handler, /insert into fib\.process_topics/);
  assert.match(handler, /update fib\.process_topic_proposals/);
}

export function caseProposalsAreNotDirectlyAvailableInBrowser() {
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on fib\.process_topic_proposals from public, anon, authenticated/);
  assert.match(migration, /create unique index.*process_topic_proposals_one_pending_idx/);
}

export function caseReviewFieldsAndSignificanceAreConstrained() {
  assert.match(migration, /references fib\.app_users\(user_id\)/);
  assert.match(migration, /status = 'confirmed'.*reviewed_by is not null/);
  assert.match(migration, /confirmed_significance is not null/);
  assert.match(migration, /length\(btrim\(confirmed_rationale\)\) > 0/);
}
