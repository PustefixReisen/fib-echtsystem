-- Isolated disposable database only; never applied to Shared-Apps.
create schema if not exists auth;
alter database auth_test set search_path to auth, public;
