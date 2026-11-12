-- Shared, append-only derived abstracts for versioned FIB findings.
-- No original texts, edits to imported RIS data, or publication transitions.
-- APPLY ONLY IN A SEPARATELY APPROVED FIB RELEASE; no production execution from PR.
create table fib.finding_abstract_versions (
 id uuid primary key default gen_random_uuid(),
 finding_id uuid not null references fib.findings(id) on delete restrict,
 finding_version_id uuid not null references fib.finding_versions(id) on delete restrict,
 input_hash text not null check (input_hash ~ '^[a-f0-9]{64}$'),
 source_fingerprint text not null check (source_fingerprint ~ '^[a-f0-9]{64}$'),
 source_kind text not null check(source_kind in ('ris','press','municipality','other')),
 scope_top integer check (scope_top between 1 and 500),
 contract_version text not null check(length(contract_version) between 1 and 80),
 model text not null check(length(model) between 1 and 80),
 model_version text not null check(length(model_version) between 1 and 80),
 schema_version text not null check(length(schema_version) between 1 and 80),
 result jsonb not null check (
   jsonb_typeof(result) = 'object'
   and result->>'status' = 'derived_unreviewed'
   and result->>'contractVersion' = contract_version
   and result->>'findingId' = finding_id::text
   and result->>'findingVersionId' = finding_version_id::text
   and result->>'fingerprint' = source_fingerprint
   and jsonb_typeof(result->'claims') = 'array'
   and jsonb_typeof(result->'relations') = 'array'
   and jsonb_typeof(result->'limitations') = 'array'
   and length(result::text) <= 32000
 ),
 generated_at timestamptz not null default now()
);
create unique index finding_abstract_dedup
 on fib.finding_abstract_versions(finding_version_id,coalesce(scope_top,0),input_hash);
create index finding_abstract_history
 on fib.finding_abstract_versions(finding_id,generated_at desc);
comment on table fib.finding_abstract_versions is
 'Internal immutable, source-version-scoped derived abstract. Unreviewed; never raw original text or publication approval.';
alter table fib.finding_abstract_versions enable row level security;
revoke all on fib.finding_abstract_versions from public,anon,authenticated,service_role,fib_runtime;
grant select,insert on fib.finding_abstract_versions to fib_runtime;
create policy finding_abstract_runtime_select on fib.finding_abstract_versions
 for select to fib_runtime using (true);
create policy finding_abstract_runtime_append on fib.finding_abstract_versions
 for insert to fib_runtime with check (
   exists (select 1 from fib.finding_versions fv
      where fv.id=finding_version_id and fv.finding_id=finding_abstract_versions.finding_id)
 );
