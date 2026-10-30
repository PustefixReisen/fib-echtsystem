-- Observation identities are needed before content is judged relevant.
-- Permanent fib.findings and fib.finding_versions remain editorially selected.
create table fib.source_observations (
  scope_id uuid not null references fib.source_scopes(id) on delete cascade,
  external_id text not null,
  canonical_url text not null,
  content_fingerprint text not null,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  revision integer not null default 1 check (revision > 0),
  primary key (scope_id, external_id)
);
create index source_observations_last_seen_idx
  on fib.source_observations (scope_id,last_seen_at desc);
alter table fib.source_observations enable row level security;
revoke all on fib.source_observations from public,anon,authenticated,service_role;
grant select,insert,update,delete on fib.source_observations to fib_runtime;
create policy source_observations_runtime on fib.source_observations
  for all to fib_runtime using (true) with check (true);
