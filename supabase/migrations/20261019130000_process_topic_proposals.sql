-- FIB Issue #136: Internal, reviewable process/topic significance proposals.
-- Deliberately NO browser/API GRANT; access only through FIB's AAL2-checked backend.
create table if not exists fib.process_topic_proposals (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references fib.processes(id) on delete restrict,
  topic_id uuid not null references fib.topics(id) on delete restrict,
  suggested_significance text not null check (suggested_significance in ('defining','relevant','supplementary')),
  suggested_rationale text not null check (length(btrim(suggested_rationale)) > 0),
  origin text not null check (origin in ('ai','editor')),
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  reviewed_by uuid references fib.app_users(user_id) on delete restrict,
  reviewed_at timestamptz,
  confirmed_significance text check (confirmed_significance in ('defining','relevant','supplementary')),
  confirmed_rationale text,
  created_at timestamptz not null default now(),
  constraint proposal_review_coherent check (
    (status = 'pending' and reviewed_by is null and reviewed_at is null and confirmed_significance is null and confirmed_rationale is null)
    or
    (status = 'rejected' and reviewed_by is not null and reviewed_at is not null and confirmed_significance is null and confirmed_rationale is null)
    or
    (status = 'confirmed' and reviewed_by is not null and reviewed_at is not null and confirmed_significance is not null and confirmed_rationale is not null and length(btrim(confirmed_rationale)) > 0)
  )
);
create index if not exists process_topic_proposals_pair_created_idx
  on fib.process_topic_proposals (process_id, topic_id, created_at desc);
create unique index if not exists process_topic_proposals_one_pending_idx
  on fib.process_topic_proposals (process_id, topic_id) where status = 'pending';
alter table fib.process_topic_proposals enable row level security;
revoke all on fib.process_topic_proposals from public, anon, authenticated;
comment on table fib.process_topic_proposals is
  'Internal review queue. Only confirmed process_topics rows are editorially effective; never treat a pending proposal as published.';
