-- FIB – Integrationstest Schema-Isolation
-- Voraussetzung: fib-Schema, fib_runtime und fib_app existieren.
-- Test wird mit privilegiertem Adminzugang ausgeführt und schaltet per SET ROLE um.

begin;

-- Harte Struktur-/Rechte-Assertions.
do $$
begin
  if not has_schema_privilege('fib_app', 'fib', 'USAGE') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app hat keinen USAGE-Zugriff auf fib';
  end if;

  -- public besitzt projektweit USAGE über die PostgreSQL-Rolle PUBLIC.
  -- Entscheidend ist daher: keinerlei Objektprivilegien für FIB in public.
  if exists (
    select 1
    from information_schema.role_table_grants
    where grantee in ('fib_app','fib_runtime')
      and table_schema = 'public'
  ) then
    raise exception 'Isolationstest fehlgeschlagen: FIB-Rolle besitzt Tabellenrechte in public';
  end if;

  if has_table_privilege('fib_app', 'public.events', 'SELECT')
     or has_table_privilege('fib_app', 'public.events', 'INSERT')
     or has_table_privilege('fib_app', 'public.events', 'UPDATE')
     or has_table_privilege('fib_app', 'public.events', 'DELETE') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app kann auf public.events zugreifen';
  end if;

  if not has_table_privilege('fib_app', 'fib.events', 'SELECT')
     or not has_table_privilege('fib_app', 'fib.events', 'INSERT') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app besitzt nicht die erwarteten Rechte auf fib.events';
  end if;

  if (select rolbypassrls from pg_roles where rolname = 'fib_app') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app besitzt BYPASSRLS';
  end if;

  if (select rolsuper from pg_roles where rolname = 'fib_app') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app ist Superuser';
  end if;
end
$$;

-- Positiver Laufzeittest innerhalb fib. Wird durch ROLLBACK wieder entfernt.
set local role fib_app;
insert into fib.events (title, status)
values ('__fib_isolation_test__', 'confirmed');

select count(*)
from fib.events
where title = '__fib_isolation_test__';

reset role;

rollback;
