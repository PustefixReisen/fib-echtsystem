alter table fib.event_findings add column if not exists justification text;
create table if not exists fib.event_finding_justification_log (id bigint generated always as identity primary key, event_id uuid not null references fib.events(id), finding_id uuid not null references fib.findings(id), actor_id uuid not null, old_justification text, new_justification text, changed_at timestamptz not null default now());
revoke all on fib.event_finding_justification_log from anon, authenticated;
