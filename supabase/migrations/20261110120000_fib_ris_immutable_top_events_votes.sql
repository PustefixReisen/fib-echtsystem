-- RIS is immutable imported source metadata; editorial event is a separate derived object.
-- All operations run inside the existing scanner transaction.
create table if not exists fib.ris_top_events (
 agenda_id uuid primary key references fib.ris_agenda_items(id) on delete restrict,
 event_id uuid not null unique references fib.events(id) on delete restrict,
 created_at timestamptz not null default now()
);
comment on table fib.ris_top_events is
 'One automatically linked FIB event per imported RIS TOP; original RIS metadata never edited by editors.';
create table if not exists fib.ris_top_vote_results (
 agenda_id uuid not null references fib.ris_agenda_items(id) on delete restrict,
 vote_index integer not null check(vote_index between 1 and 100),
 result text not null check(result in ('accepted','rejected','no_vote','unknown')),
 yes_count integer check(yes_count>=0),
 no_count integer check(no_count>=0),
 abstention_count integer check(abstention_count>=0),
 source_document_url text not null,
 source_sha256 text not null check(source_sha256 ~ '^[a-f0-9]{64}$'),
 observed_at timestamptz not null default now(),
 primary key(agenda_id,vote_index)
);
comment on table fib.ris_top_vote_results is
 'Only factually extracted vote status and counts per RIS TOP. No copyrighted wording, paraphrases or editorial decisions.';
revoke all on fib.ris_top_events from anon,authenticated;
revoke all on fib.ris_top_vote_results from anon,authenticated;
grant select on fib.ris_top_events to authenticated;
grant select on fib.ris_top_vote_results to authenticated;
alter table fib.ris_top_events enable row level security;
alter table fib.ris_top_vote_results enable row level security;
-- Follow the established role-gated API read path; no direct client RLS policies.

grant select,insert,update,delete on fib.ris_top_events to fib_runtime;
grant select,insert,update,delete on fib.ris_top_vote_results to fib_runtime;
drop policy if exists ris_top_events_runtime on fib.ris_top_events;
create policy ris_top_events_runtime on fib.ris_top_events
 for all to fib_runtime using (true) with check (true);
drop policy if exists ris_top_votes_runtime on fib.ris_top_vote_results;
create policy ris_top_votes_runtime on fib.ris_top_vote_results
 for all to fib_runtime using (true) with check (true);

-- Permit the two new RIS objects in the scoped development ownership ledger.
alter table if exists fib.development_objects drop constraint development_objects_table_name_check;
alter table if exists fib.development_objects add constraint development_objects_table_name_check check(table_name in (
 'ris_committees','ris_sessions','ris_session_versions','ris_agenda_items','ris_proposals',
 'ris_documents','ris_document_versions','ris_document_links','ris_agenda_events',
 'ris_top_events','ris_top_vote_results','ris_suggestions','ris_proposal_texts','ris_decision_points','ris_decision_versions',
 'ris_votes','ris_relation_suggestions','ris_minutes_approvals','ris_review_log',
 'findings','finding_versions','events','event_findings','event_processes','event_topics',
 'event_finding_change_log','event_finding_metadata_log','event_finding_justification_log',
 'lead_responsibilities','object_last_edits','source_observations','source_scopes'));
