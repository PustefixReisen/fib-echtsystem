-- Allow only the existing fib_runtime role to access RIS resume cursors through RLS.
-- Table grants remain restricted; anon and authenticated receive no access.
create policy ris_scan_cursors_runtime on fib.ris_scan_cursors
  for all to fib_runtime using (true) with check (true);
