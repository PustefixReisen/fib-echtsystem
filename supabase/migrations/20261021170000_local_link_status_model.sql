-- FIB local-link editorial status model: Kandidat, Zugeordnet, Zurückgestellt, Fachlich unpassend.
-- Schema-only change. Existing rows remain unchanged.
alter table fib.process_topic_proposals
  drop constraint if exists process_topic_proposals_status_check;
alter table fib.process_topic_proposals
  add constraint process_topic_proposals_status_check
  check (status in ('pending','confirmed','deferred','rejected'));

alter table fib.process_topic_proposals
  drop constraint if exists proposal_review_coherent;
alter table fib.process_topic_proposals
  add constraint proposal_review_coherent check (
    (status = 'pending' and reviewed_by is null and reviewed_at is null and confirmed_significance is null and confirmed_rationale is null)
    or
    (status in ('deferred','rejected') and reviewed_by is not null and reviewed_at is not null and confirmed_significance is null and confirmed_rationale is null)
    or
    (status = 'confirmed' and reviewed_by is not null and reviewed_at is not null and confirmed_significance is not null and confirmed_rationale is not null and length(btrim(confirmed_rationale)) > 0)
  );
