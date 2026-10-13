-- Isolated disposable database only; never applied to Shared-Apps.
create schema if not exists auth;
alter database auth_test set search_path to auth, public;

-- Minimal synthetic fixture for the unchanged production session-context handler.
create schema fib;
create table fib.app_users (
  user_id uuid primary key,
  full_name text not null,
  call_name text,
  role text not null check (role in ('editor','admin')),
  active boolean not null default false,
  setup_status text not null default 'invited'
);
