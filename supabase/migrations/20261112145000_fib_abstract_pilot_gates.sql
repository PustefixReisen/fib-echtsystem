-- Issue #440: FIB-only, fail-closed pilot controls. NOT part of a live release.
-- Immutable operator decision per finding version. Runtime may read only.
create table fib.finding_abstract_permissions (
 finding_version_id uuid primary key references fib.finding_versions(id) on delete restrict,
 source_kind text not null check(source_kind in ('ris','press','municipality','other')),
 permitted boolean not null default false,
 rights_basis text not null check(length(btrim(rights_basis)) between 10 and 1500),
 privacy_basis text not null check(length(btrim(privacy_basis)) between 10 and 1500),
 external_ai_allowed boolean not null default false,
 reviewed_by uuid not null references fib.app_users(user_id) on delete restrict,
 reviewed_at timestamptz not null default now(),
 expires_at timestamptz not null,
 check(expires_at>reviewed_at),
 check(not external_ai_allowed or permitted)
);
comment on table fib.finding_abstract_permissions is
 'Operator-reviewed per-version permissions. No runtime grant/update; missing row means deny.';
alter table fib.finding_abstract_permissions enable row level security;
revoke all on fib.finding_abstract_permissions from public,anon,authenticated,service_role,fib_runtime;
grant select on fib.finding_abstract_permissions to fib_runtime;
create policy abstract_permission_runtime_read on fib.finding_abstract_permissions
 for select to fib_runtime using(true);

-- All monetary amounts in euro cents. Never silently reset reservations.
create table fib.abstract_pilot_budget (
 id integer primary key check(id=1),
 max_cents integer not null check(max_cents between 1 and 500),
 consumed_cents integer not null default 0 check(consumed_cents>=0),
 held_cents integer not null default 0 check(held_cents>=0),
 check(consumed_cents+held_cents<=max_cents)
);
insert into fib.abstract_pilot_budget(id,max_cents) values(1,500);
create table fib.abstract_pilot_reservations (
 request_key text primary key check(request_key ~ '^[a-f0-9]{64}$'),
 reserved_cents integer not null check(reserved_cents between 1 and 500),
 billed_cents integer check(billed_cents>=0),
 status text not null check(status in ('reserved','uncertain','settled','released')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (
  (status in ('reserved','uncertain') and billed_cents is null)
  or (status='settled' and billed_cents between 0 and reserved_cents)
  or (status='released' and billed_cents=0)
 )
);
alter table fib.abstract_pilot_budget enable row level security;
alter table fib.abstract_pilot_reservations enable row level security;
revoke all on fib.abstract_pilot_budget,fib.abstract_pilot_reservations
 from public,anon,authenticated,service_role,fib_runtime;
grant select,update on fib.abstract_pilot_budget to fib_runtime;
grant select,insert,update on fib.abstract_pilot_reservations to fib_runtime;
create policy abstract_budget_runtime on fib.abstract_pilot_budget
 for all to fib_runtime using(true) with check(true);
create policy abstract_reservation_runtime on fib.abstract_pilot_reservations
 for all to fib_runtime using(true) with check(true);
comment on table fib.abstract_pilot_reservations is
 'An ambiguous paid request remains held; never reissue a used request_key.';
