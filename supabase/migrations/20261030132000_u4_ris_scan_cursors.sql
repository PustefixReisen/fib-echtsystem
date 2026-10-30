create table if not exists fib.ris_scan_cursors (
 scope_id uuid primary key references fib.source_scopes(id) on delete cascade,
 cursor_state jsonb not null default '{"pending":[],"visited":[],"documents":[],"failures":[]}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint ris_scan_cursors_object_check check (jsonb_typeof(cursor_state)='object')
);
alter table fib.ris_scan_cursors enable row level security;
revoke all on fib.ris_scan_cursors from public, anon, authenticated;
grant select, insert, update on fib.ris_scan_cursors to fib_runtime;
