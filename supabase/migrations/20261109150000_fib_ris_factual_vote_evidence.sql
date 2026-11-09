-- Complete independently formulated RIS decisions need document/version provenance,
-- but must not manufacture an alleged verbatim evidence quote.
-- All previous non-empty quotations are preserved; new factual decisions may use NULL.
alter table fib.ris_votes alter column evidence_quote drop not null;
alter table fib.ris_votes drop constraint if exists ris_votes_evidence_quote_check;
alter table fib.ris_votes add constraint ris_votes_evidence_quote_check
  check (evidence_quote is null or length(btrim(evidence_quote)) > 0);
