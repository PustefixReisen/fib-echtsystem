-- Applied to Shared-Apps project fib schema on 2026-10-29.
-- This schema change extends existing fib.sources and fib.findings.
create table fib.source_scopes (
 id uuid primary key default gen_random_uuid(),
 source_id uuid not null references fib.sources(id) on delete restrict,
 scope_key text not null,
 scope_label text not null,
 entry_url text not null,
 access_method text not null check (access_method in ('rss','html','ris')),
 status text not null default 'candidate' check (status in ('candidate','active','paused','ended','rejected')),
 required boolean not null default false,
 last_success_at timestamptz,
 last_attempt_at timestamptz,
 gap_since timestamptz,
 last_error text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(source_id,scope_key)
);
create table fib.source_runs (
 id uuid primary key default gen_random_uuid(),
 scope_id uuid not null references fib.source_scopes(id) on delete restrict,
 started_at timestamptz not null default now(),
 completed_at timestamptz,
 status text not null default 'running' check (status in ('running','succeeded','failed','partial')),
 items_seen integer not null default 0 check (items_seen >= 0),
 items_new integer not null default 0 check (items_new >= 0),
 items_changed integer not null default 0 check (items_changed >= 0),
 error_detail text,
 check (completed_at is null or completed_at >= started_at)
);
create index source_runs_scope_started_idx on fib.source_runs(scope_id,started_at desc);
create table fib.finding_versions (
 id uuid primary key default gen_random_uuid(),
 finding_id uuid not null references fib.findings(id) on delete restrict,
 revision integer not null check (revision > 0),
 fingerprint text not null,
 observed_at timestamptz not null default now(),
 source_run_id uuid references fib.source_runs(id) on delete set null,
 original_url text not null,
 metadata jsonb not null default '{}'::jsonb,
 unique(finding_id,revision)
);
create index finding_versions_observed_idx on fib.finding_versions(finding_id,observed_at desc);
alter table fib.source_scopes enable row level security;
alter table fib.source_runs enable row level security;
alter table fib.finding_versions enable row level security;
revoke all on fib.source_scopes,fib.source_runs,fib.finding_versions from public,anon,authenticated,service_role;
grant select,insert,update,delete on fib.source_scopes,fib.source_runs,fib.finding_versions to fib_runtime;
create policy source_scopes_runtime on fib.source_scopes for all to fib_runtime using (true) with check (true);
create policy source_runs_runtime on fib.source_runs for all to fib_runtime using (true) with check (true);
create policy finding_versions_runtime on fib.finding_versions for all to fib_runtime using (true) with check (true);
