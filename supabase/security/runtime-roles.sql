-- FIB Echtsystem – Runtime-Rollen und Schema-Isolation
--
-- Zweck:
-- - FIB erhält ausschließlich Rechte im Schema fib.
-- - public/Memorix bleibt außerhalb des FIB-Runtime-Zugriffs.
-- - Ein LOGIN-Passwort wird bewusst NICHT im Repository hinterlegt.
--
-- ADR-011: Shared-Apps, Schema-Isolation und pustivo-Betrieb

begin;

-- Fachlich/technisch gekapselte Gruppenrolle ohne Login.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'fib_runtime') then
    create role fib_runtime nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
  end if;
end
$$;

-- Separater Login für die serverseitigen FIB-Fachservices.
-- Das Passwort wird außerhalb der Migration als Secret gesetzt.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'fib_app') then
    create role fib_app login inherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
  end if;
end
$$;

grant fib_runtime to fib_app;

-- Kein Zugriff auf fremde Anwendungsschemata.
revoke all on schema public from fib_runtime, fib_app;
revoke all on all tables in schema public from fib_runtime, fib_app;
revoke all on all sequences in schema public from fib_runtime, fib_app;
revoke all on all functions in schema public from fib_runtime, fib_app;

-- FIB-Schema: nur notwendiger Zugriff.
grant usage on schema fib to fib_runtime;
grant select, insert, update, delete on all tables in schema fib to fib_runtime;
grant usage, select, update on all sequences in schema fib to fib_runtime;

-- Zukünftige FIB-Objekte erben nur FIB-Rechte, keine globalen Rechte.
alter default privileges for role postgres in schema fib
  grant select, insert, update, delete on tables to fib_runtime;
alter default privileges for role postgres in schema fib
  grant usage, select, update on sequences to fib_runtime;

-- Kein Data-API-Zugriff als Nebenweg.
revoke all on schema fib from anon, authenticated, service_role;
revoke all on all tables in schema fib from anon, authenticated, service_role;
revoke all on all sequences in schema fib from anon, authenticated, service_role;
revoke all on all functions in schema fib from anon, authenticated, service_role;

commit;
