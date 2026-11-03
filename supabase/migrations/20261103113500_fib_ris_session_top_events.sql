-- FIB only. Prepared migration: never apply to Shared-Apps without a separate release gate.
-- Preserve chapter 07: press reports about a meeting are associated with the
-- session as a whole, never automatically with an agenda item.
begin;
create table fib.ris_session_events (
  session_id uuid not null references fib.ris_sessions(id) on delete restrict,
  event_id uuid not null references fib.events(id) on delete restrict,
  origin text not null default 'manual'
    check (origin in ('manual','automatic')),
  evidence text,
  reviewed_by uuid references fib.app_users(user_id),
  reviewed_at timestamptz not null default now(),
  primary key (session_id,event_id),
  check (
    (origin='manual' and reviewed_by is not null)
    or (origin='automatic' and evidence is not null and length(btrim(evidence))>0)
  )
);
create index ris_session_events_event_idx on fib.ris_session_events(event_id);
alter table fib.ris_session_events enable row level security;
revoke all on fib.ris_session_events from public,anon,authenticated,service_role,fib_runtime;
grant select,insert,delete on fib.ris_session_events to fib_runtime;
create policy ris_session_events_runtime_read on fib.ris_session_events
  for select to fib_runtime using (true);
-- Insertion of automatic links is not exposed by an API; no automatic
-- inference from press material is part of this migration.
create policy ris_session_events_runtime_insert on fib.ris_session_events
  for insert to fib_runtime with check (origin='manual');
create policy ris_session_events_runtime_delete on fib.ris_session_events
  for delete to fib_runtime using (origin='manual');

-- A TOP can have at most one specifically chosen primary editorial event.
-- Procedure-related events remain separate and unchanged.
alter table fib.ris_agenda_events drop constraint ris_agenda_events_role_check;
alter table fib.ris_agenda_events
  add constraint ris_agenda_events_role_check
  check (role in ('proposal_publication','treatment','decision','minutes_publication','local_reference','main_event'));
create unique index ris_agenda_one_main_event
  on fib.ris_agenda_events(agenda_id) where role='main_event';
drop policy ris_local_reference_delete on fib.ris_agenda_events;
create policy ris_editorial_event_delete on fib.ris_agenda_events
  for delete to fib_runtime using (role in ('local_reference','main_event'));
commit;
