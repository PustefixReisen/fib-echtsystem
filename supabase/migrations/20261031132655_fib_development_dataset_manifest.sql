-- PREPARED ONLY. Additional approval required before Shared-Apps application.
-- Append-only ownership ledger; no user/Auth/public/extension/default-grant changes.
begin;
create table fib.development_batches (
 id text primary key check(id ~ '^[a-z0-9][a-z0-9-]{2,79}$'),
 purpose text not null check(length(btrim(purpose))>0),
 approval_reference text not null check(length(btrim(approval_reference))>0),
 status text not null default 'active' check(status in ('active','closed','purged')),
 created_at timestamptz not null default now()
);
create table fib.development_objects (
 batch_id text not null references fib.development_batches(id) on delete restrict,
 table_name text not null check(table_name in (
 'ris_committees','ris_sessions','ris_session_versions','ris_agenda_items','ris_proposals',
 'ris_documents','ris_document_versions','ris_document_links','ris_agenda_events',
 'ris_suggestions','ris_proposal_texts','ris_decision_points','ris_decision_versions',
 'ris_votes','ris_relation_suggestions','ris_minutes_approvals','ris_review_log',
 'findings','finding_versions','events','event_findings','event_processes','event_topics',
 'event_finding_change_log','event_finding_metadata_log','event_finding_justification_log',
 'lead_responsibilities','object_last_edits','source_observations','source_scopes')),
 row_key jsonb not null check(jsonb_typeof(row_key)='object' and row_key<>'{}'::jsonb),
 ownership text not null check(ownership in ('owned','reference')),
 check(ownership='reference' or table_name not in ('source_scopes','ris_committees')),
 initial_fingerprint text not null check(initial_fingerprint ~ '^[a-f0-9]{64}$'),
 created_at timestamptz not null default now(),
 primary key(batch_id,table_name,row_key)
);
create unique index development_object_owner on fib.development_objects(table_name,row_key) where ownership='owned';
create index development_object_lookup on fib.development_objects(table_name,row_key);
alter table fib.development_batches enable row level security;
alter table fib.development_objects enable row level security;
revoke all on fib.development_batches,fib.development_objects from public,anon,authenticated,service_role,fib_runtime;
grant select on fib.development_batches to fib_runtime;
grant select,insert on fib.development_objects to fib_runtime;
create policy development_batches_runtime_read on fib.development_batches for select to fib_runtime using(true);
create policy development_objects_runtime_read on fib.development_objects for select to fib_runtime using(true);
create policy development_objects_runtime_insert on fib.development_objects for insert to fib_runtime with check(exists(select 1 from fib.development_batches b where b.id=batch_id and b.status='active'));
commit;
