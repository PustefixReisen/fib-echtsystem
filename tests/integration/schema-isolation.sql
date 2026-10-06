-- FIB – Integrationstest Schema-Isolation
-- Voraussetzung: fib-Schema, fib_runtime und fib_app existieren.
-- Test wird mit privilegiertem Adminzugang ausgeführt und schaltet per SET ROLE um.

begin;

set local role fib_app;

-- Muss funktionieren: Zugriff auf FIB-Schema.
select has_schema_privilege(current_user, 'fib', 'USAGE') as fib_schema_usage;

-- Muss fehlschlagen bzw. false liefern: fremdes public-Schema.
select has_schema_privilege(current_user, 'public', 'USAGE') as public_schema_usage;

reset role;

-- Harte Assertions.
do $$
begin
  if not has_schema_privilege('fib_app', 'fib', 'USAGE') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app hat keinen USAGE-Zugriff auf fib';
  end if;

  if has_schema_privilege('fib_app', 'public', 'USAGE') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app darf public nicht verwenden';
  end if;

  if exists (
    select 1
    from information_schema.role_table_grants
    where grantee in ('fib_app','fib_runtime')
      and table_schema = 'public'
  ) then
    raise exception 'Isolationstest fehlgeschlagen: FIB-Rolle besitzt Tabellenrechte in public';
  end if;

  if (select rolbypassrls from pg_roles where rolname = 'fib_app') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app besitzt BYPASSRLS';
  end if;

  if (select rolsuper from pg_roles where rolname = 'fib_app') then
    raise exception 'Isolationstest fehlgeschlagen: fib_app ist Superuser';
  end if;
end
$$;

rollback;
