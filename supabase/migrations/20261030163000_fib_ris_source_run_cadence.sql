alter table fib.source_runs add column if not exists cadence text;
alter table fib.source_runs drop constraint if exists source_runs_cadence_check;
alter table fib.source_runs add constraint source_runs_cadence_check check (cadence is null or cadence in ('daily','weekly'));
create index if not exists source_runs_scope_cadence_finished_idx on fib.source_runs(scope_id,cadence,completed_at desc);
