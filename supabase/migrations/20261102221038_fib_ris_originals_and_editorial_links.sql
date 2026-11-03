-- Apply only after the release backup/restore gate. Existing unlicensed full texts
-- are removed deliberately; hashes, identities and all metadata remain intact.
begin;
alter table fib.ris_documents add column original_title text;
alter table fib.ris_document_versions
 add column content_author text not null default 'unknown' check(content_author in ('unknown','external','municipality','licensed')),
 add column rights_evidence text,
 add column rights_reviewed_by uuid references fib.app_users(user_id),
 add column rights_reviewed_at timestamptz,
 add column pdf_storage_key text unique,
 add column pdf_size bigint check(pdf_size between 5 and 25000000);
update fib.ris_document_versions set extracted_text=null;
alter table fib.ris_document_versions add constraint ris_version_storage_rights check (
 (content_author in ('municipality','licensed') and rights_evidence is not null and length(btrim(rights_evidence))>0 and rights_reviewed_by is not null and rights_reviewed_at is not null)
 or (content_author in ('unknown','external') and extracted_text is null and pdf_storage_key is null and pdf_size is null)
);
alter table fib.ris_document_versions add constraint ris_pdf_text_version check (
 (pdf_storage_key is null and pdf_size is null and extracted_text is null)
 or (pdf_storage_key is not null and pdf_storage_key = document_id::text || '/' || id::text || '/' || content_hash || '.pdf' and pdf_size is not null)
);
create function fib.guard_ris_original_version() returns trigger language plpgsql set search_path='' as $$
begin
 if new.id<>old.id or new.document_id<>old.document_id or new.content_hash<>old.content_hash or new.observed_at<>old.observed_at then
  raise exception 'immutable_ris_version';
 end if;
 if old.pdf_storage_key is not null and new.pdf_storage_key is not null and
   (new.pdf_storage_key<>old.pdf_storage_key or new.pdf_size<>old.pdf_size or new.extracted_text is distinct from old.extracted_text) then
  raise exception 'immutable_ris_original';
 end if;
 return new;
end $$;
revoke all on function fib.guard_ris_original_version() from public,anon,authenticated,service_role;
create trigger ris_original_immutable before update on fib.ris_document_versions for each row execute function fib.guard_ris_original_version();
grant update on fib.ris_document_versions to fib_runtime;
create policy ris_version_runtime_update on fib.ris_document_versions for update to fib_runtime using(true) with check(true);
alter table fib.ris_agenda_events drop constraint ris_agenda_events_role_check;
alter table fib.ris_agenda_events add constraint ris_agenda_events_role_check check(role in ('proposal_publication','treatment','decision','minutes_publication','local_reference'));
alter table fib.ris_agenda_events drop constraint ris_agenda_events_rationale_check;
alter table fib.ris_agenda_events alter column rationale drop not null;
grant delete on fib.ris_agenda_events to fib_runtime;
create policy ris_local_reference_delete on fib.ris_agenda_events for delete to fib_runtime using(role='local_reference');
-- A separate private FIB bucket; existing event-media and its policies stay intact.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('fib-ris-originals','fib-ris-originals',false,25000000,array['application/pdf']);
-- No anon/authenticated policies: every read is authorized by fib-editorial-write.
commit;
