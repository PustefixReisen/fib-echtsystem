-- Applied to Shared-Apps production as Supabase migration
-- version: 20261010074421
-- name: fib_coordination_users_locks

alter table fib.app_users
  add column if not exists full_name text not null default '',
  add column if not exists call_name text,
  add column if not exists setup_status text not null default 'setup_pending';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'fib.app_users'::regclass
      and conname = 'fib_app_users_setup_status_check'
  ) then
    alter table fib.app_users
      add constraint fib_app_users_setup_status_check
      check (setup_status in ('invited', 'setup_pending', 'active', 'deactivated'));
  end if;
end
$$;

create table if not exists fib.lead_responsibilities (
  object_type text not null check (object_type in ('finding', 'event', 'message', 'process', 'topic')),
  object_id uuid not null,
  user_id uuid not null references fib.app_users(user_id) on delete restrict,
  assigned_at timestamptz not null default now(),
  primary key (object_type, object_id)
);

create table if not exists fib.edit_locks (
  object_type text not null check (object_type in ('finding', 'event', 'message', 'process', 'topic')),
  object_id uuid not null,
  user_id uuid not null references fib.app_users(user_id) on delete restrict,
  acquired_at timestamptz not null default now(),
  renewed_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key (object_type, object_id),
  check (expires_at > renewed_at)
);

create table if not exists fib.handover_requests (
  id uuid primary key default gen_random_uuid(),
  object_type text not null check (object_type in ('finding', 'event', 'message', 'process', 'topic')),
  object_id uuid not null,
  requested_by_user_id uuid not null references fib.app_users(user_id) on delete restrict,
  requested_user_id uuid not null references fib.app_users(user_id) on delete restrict,
  message text,
  status text not null default 'open'
    check (status in ('open', 'accepted', 'declined', 'done', 'void')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requested_by_user_id <> requested_user_id)
);

create index if not exists idx_fib_lead_responsibilities_user
  on fib.lead_responsibilities (user_id);
create index if not exists idx_fib_edit_locks_expires_at
  on fib.edit_locks (expires_at);
create index if not exists idx_fib_handover_requests_recipient_status
  on fib.handover_requests (requested_user_id, status, created_at desc);

alter table fib.lead_responsibilities enable row level security;
alter table fib.edit_locks enable row level security;
alter table fib.handover_requests enable row level security;

revoke all on fib.lead_responsibilities, fib.edit_locks, fib.handover_requests
  from anon, authenticated, service_role;

grant select, insert, update, delete
  on fib.lead_responsibilities, fib.edit_locks, fib.handover_requests
  to fib_runtime;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='fib' and tablename='lead_responsibilities' and policyname='fib_runtime_all'
  ) then
    create policy fib_runtime_all on fib.lead_responsibilities
      for all to fib_runtime using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='fib' and tablename='edit_locks' and policyname='fib_runtime_all'
  ) then
    create policy fib_runtime_all on fib.edit_locks
      for all to fib_runtime using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='fib' and tablename='handover_requests' and policyname='fib_runtime_all'
  ) then
    create policy fib_runtime_all on fib.handover_requests
      for all to fib_runtime using (true) with check (true);
  end if;
end
$$;
