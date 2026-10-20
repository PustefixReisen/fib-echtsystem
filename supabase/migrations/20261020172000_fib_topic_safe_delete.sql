-- Logical removal of never-published topics while preserving referential integrity.
-- FIB schema only. Existing rows remain unchanged.
begin;
alter table fib.topics add column if not exists deleted_at timestamptz;
alter table fib.topics add column if not exists deleted_by uuid references fib.app_users(user_id) on delete restrict;
alter table fib.topics add constraint topics_deletion_actor_check
  check ((deleted_at is null) = (deleted_by is null));
create index if not exists topics_visible_title_idx on fib.topics (lower(title)) where deleted_at is null;
commit;
