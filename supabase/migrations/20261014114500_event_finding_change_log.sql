-- Audit of manually removed event-to-finding relationships.
-- An event-finding link is a relationship, not the finding itself.
create table if not exists fib.event_finding_change_log (
  id bigint generated always as identity primary key,
  event_id uuid not null references fib.events(id) on delete restrict,
  finding_id uuid not null references fib.findings(id) on delete restrict,
  action text not null check (action = 'unlinked'),
  actor_id uuid not null,
  previous_evidence_role text,
  previous_note text,
  changed_at timestamptz not null default now()
);
revoke all on fib.event_finding_change_log from anon, authenticated;
