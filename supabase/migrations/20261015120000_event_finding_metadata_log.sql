-- Preserve a history of changes to evidence role and editorial note.
create table if not exists fib.event_finding_metadata_log (
  id bigint generated always as identity primary key,
  event_id uuid not null references fib.events(id) on delete restrict,
  finding_id uuid not null references fib.findings(id) on delete restrict,
  actor_id uuid not null,
  old_evidence_role text,
  old_note text,
  new_evidence_role text,
  new_note text,
  changed_at timestamptz not null default now()
);
revoke all on fib.event_finding_metadata_log from anon,authenticated;
