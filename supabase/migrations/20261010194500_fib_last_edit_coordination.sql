-- Redaktionelle Koordination: abgeleitete Information "Letzte Bearbeitung".
-- Die Tabelle wird ausschließlich durch FIB-Fachfunktionen nach fachlich relevanten
-- Änderungen aktualisiert; reine Lesezugriffe und Locks ändern sie nicht.

create table if not exists fib.object_last_edits (
  object_type text not null check (object_type in ('finding', 'event', 'message', 'process', 'topic')),
  object_id uuid not null,
  user_id uuid not null references fib.app_users(user_id) on delete restrict,
  edited_at timestamptz not null default now(),
  primary key (object_type, object_id)
);

create index if not exists idx_fib_object_last_edits_user
  on fib.object_last_edits (user_id, edited_at desc);

alter table fib.object_last_edits enable row level security;

revoke all on fib.object_last_edits from anon, authenticated, service_role;
grant select, insert, update, delete on fib.object_last_edits to fib_runtime;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='fib'
      and tablename='object_last_edits'
      and policyname='fib_runtime_all'
  ) then
    create policy fib_runtime_all on fib.object_last_edits
      for all to fib_runtime using (true) with check (true);
  end if;
end
$$;
