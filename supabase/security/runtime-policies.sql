-- FIB Echtsystem – RLS-Policies für serverseitige Fachservices
--
-- fib_runtime erhält fachlich vollständigen Tabellenzugriff innerhalb des Schemas fib.
-- Autorisierung von Redakteur/Admin, S2/S3, Objektstatus und Schutzklasse wird in der
-- Fachservice-Schicht erzwungen. RLS verhindert zugleich Zugriff über andere DB-Rollen.

begin;

create policy fib_runtime_all on fib.app_users
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.events
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.messages
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.processes
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.event_processes
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.topics
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.process_topics
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.event_topics
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.sources
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.findings
  for all to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.event_findings
  for all to fib_runtime using (true) with check (true);

create index if not exists idx_fib_events_merged_into_event_id
  on fib.events (merged_into_event_id)
  where merged_into_event_id is not null;

commit;
