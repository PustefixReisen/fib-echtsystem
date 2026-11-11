-- Derived products only. No changes to RIS originals, events or their relationships.
create table fib.ris_analysis_state (
 agenda_id uuid primary key references fib.ris_agenda_items(id) on delete cascade,
 input_hash text,
 analyzer_version text,
 status text not null default 'pending' check(status in ('pending','running','complete','failed')),
 lease_token uuid,
 lease_until timestamptz,
 attempts integer not null default 0 check(attempts>=0),
 next_attempt_at timestamptz not null default now(),
 last_checked_at timestamptz not null default 'epoch',
 error_code text check(error_code is null or error_code in ('analysis_failed','source_changed')),
 check ((lease_token is null) = (lease_until is null))
);
create table fib.ris_analysis_versions (
 id uuid primary key default gen_random_uuid(),
 agenda_id uuid not null references fib.ris_agenda_items(id) on delete cascade,
 input_hash text not null check(input_hash ~ '^[a-f0-9]{64}$'),
 analyzer_version text not null,
 generated_at timestamptz not null default now(),
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 unique(agenda_id,input_hash,analyzer_version)
);
comment on table fib.ris_analysis_versions is
 'Automatic, immutable derived insights. No original PDF/text, editorial confirmation or authoritative relationships.';
alter table fib.ris_analysis_state enable row level security;
alter table fib.ris_analysis_versions enable row level security;
revoke all on fib.ris_analysis_state,fib.ris_analysis_versions from public,anon,authenticated,service_role;
-- Override existing default table privileges. Runtime can append versions, not edit them.
revoke all on fib.ris_analysis_state,fib.ris_analysis_versions from fib_runtime;
grant select,insert,update on fib.ris_analysis_state to fib_runtime;
grant select,insert on fib.ris_analysis_versions to fib_runtime;
create policy ris_analysis_state_runtime on fib.ris_analysis_state
 for all to fib_runtime using(true) with check(true);
create policy ris_analysis_versions_read on fib.ris_analysis_versions
 for select to fib_runtime using(true);
create policy ris_analysis_versions_append on fib.ris_analysis_versions
 for insert to fib_runtime with check(true);
create index ris_analysis_poll on fib.ris_analysis_state(last_checked_at,agenda_id);
