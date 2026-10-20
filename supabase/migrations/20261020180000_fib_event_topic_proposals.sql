-- Supplemental event-to-topic proposals. This is not a duplicate source of facts
-- when an event is already included via a selected process.
begin;
create table fib.event_topic_proposals (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references fib.events(id) on delete restrict,
 topic_id uuid not null references fib.topics(id) on delete restrict,
 suggested_significance text not null check (suggested_significance in ('defining','relevant','supplementary')),
 suggested_rationale text not null check (length(btrim(suggested_rationale)) > 0),
 origin text not null check (origin in ('editor','ai')),
 status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
 reviewed_by uuid references fib.app_users(user_id) on delete restrict,
 reviewed_at timestamptz,
 confirmed_significance text check (confirmed_significance in ('defining','relevant','supplementary')),
 confirmed_rationale text,
 rejection_reason text check (rejection_reason in
  ('insufficient_topic_relation','already_covered','wrong_topic','insufficient_evidence','not_currently_relevant','other')),
 rejection_detail text,
 created_at timestamptz not null default now(),
 constraint event_proposal_decision_coherent check (
  (status='pending' and reviewed_by is null and reviewed_at is null
   and confirmed_significance is null and confirmed_rationale is null and rejection_reason is null)
  or (status='confirmed' and reviewed_by is not null and reviewed_at is not null
   and confirmed_significance is not null and length(btrim(confirmed_rationale))>0
   and rejection_reason is null)
  or (status='rejected' and reviewed_by is not null and reviewed_at is not null
   and confirmed_significance is null and confirmed_rationale is null
   and rejection_reason is not null
   and (rejection_reason <> 'other' or length(btrim(rejection_detail))>0))
 )
);
create unique index event_topic_one_pending
 on fib.event_topic_proposals(topic_id,event_id) where status='pending';

alter table fib.event_topic_proposals enable row level security;
create policy fib_runtime_all on fib.event_topic_proposals to fib_runtime
 using(true) with check(true);
grant select,insert,update,delete on fib.event_topic_proposals to fib_runtime;
commit;
