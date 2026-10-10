-- Align handover status vocabulary with the canonical FIB data model.
-- Canonical values: open, accepted, declined, completed, obsolete.

alter table fib.handover_requests
  drop constraint if exists handover_requests_status_check;

alter table fib.handover_requests
  add constraint handover_requests_status_check
  check (status in ('open', 'accepted', 'declined', 'completed', 'obsolete'));
