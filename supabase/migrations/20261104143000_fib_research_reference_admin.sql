-- Issue #394: isolated first slice of administrative reference relationships.
-- Apply only after isolated migration/RLS tests and a separate release approval.
create table fib.research_reference_objects (
  id uuid primary key default gen_random_uuid(),
  object_kind text not null check (object_kind in ('place','infrastructure','actor','facility','subject')),
  label text not null check (length(trim(label)) between 2 and 180),
  normalized_label text generated always as (lower(btrim(label))) stored,
  created_at timestamptz not null default now(),
  unique (object_kind, normalized_label)
);
create table fib.research_reference_links (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references fib.research_reference_objects(id) on delete restrict,
  object_id uuid not null references fib.research_reference_objects(id) on delete restrict,
  relation_kind text not null check (relation_kind in ('located_in','crosses','connects','serves','functional_link','thematic_link')),
  evidence_url text not null check (evidence_url ~ '^https://[^[:space:]]+$' and length(evidence_url) <= 2000),
  rationale text not null check (length(btrim(rationale)) between 8 and 2000),
  status text not null default 'proposed' check (status in ('proposed','confirmed','rejected','withdrawn')),
  revision integer not null default 1 check (revision > 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  decided_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  updated_at timestamptz not null default now(),
  check (subject_id <> object_id),
  check ((status = 'proposed' and decided_at is null and decided_by is null)
      or (status <> 'proposed' and decided_at is not null and decided_by is not null))
);
create index research_reference_links_status_idx on fib.research_reference_links(status, created_at desc);
create index research_reference_links_subject_idx on fib.research_reference_links(subject_id);
create index research_reference_links_object_idx on fib.research_reference_links(object_id);
create unique index research_reference_links_confirmed_unique
on fib.research_reference_links(subject_id,object_id,relation_kind) where status = 'confirmed';

create table fib.research_reference_audit (
  id bigint generated always as identity primary key,
  link_id uuid not null references fib.research_reference_links(id) on delete restrict,
  actor_id uuid not null references auth.users(id) on delete restrict,
  action text not null check (action in ('propose','confirm','reject','withdraw')),
  revision integer not null check (revision > 0),
  snapshot jsonb not null,
  occurred_at timestamptz not null default now()
);

-- Version counter makes the active search context reproducible and invalidatable.
create table fib.research_context_state (
  singleton boolean primary key default true check (singleton),
  active_revision bigint not null default 0 check (active_revision >= 0),
  changed_at timestamptz not null default now()
);
insert into fib.research_context_state(singleton) values(true);

create view fib.research_active_reference_context
with (security_invoker=true)
as
select l.id, l.revision, s.object_kind as subject_kind, s.label as subject_label,
  l.relation_kind, o.object_kind as object_kind, o.label as object_label,
  l.evidence_url, l.rationale
from fib.research_reference_links l
join fib.research_reference_objects s on s.id=l.subject_id
join fib.research_reference_objects o on o.id=l.object_id
where l.status='confirmed';

alter table fib.research_reference_objects enable row level security;
alter table fib.research_reference_links enable row level security;
alter table fib.research_reference_audit enable row level security;
alter table fib.research_context_state enable row level security;
revoke all on fib.research_reference_objects, fib.research_reference_links, fib.research_reference_audit, fib.research_context_state from public, anon, authenticated, service_role;
revoke all on fib.research_active_reference_context from public, anon, authenticated, service_role;
grant select,insert,update on fib.research_reference_objects to fib_runtime;
grant select,insert,update on fib.research_reference_links to fib_runtime;
grant select,insert on fib.research_reference_audit to fib_runtime;
grant select,update on fib.research_context_state to fib_runtime;
grant usage,select on sequence fib.research_reference_audit_id_seq to fib_runtime;
grant select on fib.research_active_reference_context to fib_runtime;
create policy reference_objects_runtime on fib.research_reference_objects for all to fib_runtime using (true) with check (true);
create policy reference_links_runtime on fib.research_reference_links for all to fib_runtime using (true) with check (true);
create policy reference_audit_runtime on fib.research_reference_audit for all to fib_runtime using (true) with check (true);
create policy reference_context_runtime on fib.research_context_state for all to fib_runtime using (true) with check (true);

comment on table fib.research_reference_links is 'Editorial proposals/decisions; only confirmed links may enter the search context. Issue #394.';
