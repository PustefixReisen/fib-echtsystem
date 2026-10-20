-- FIB topic contribution lifecycle – DRAFT migration, NOT applied
-- Only fib schema. Review and test against existing development data before use.
begin;

alter table fib.topics drop constraint if exists topics_status_check;
alter table fib.topics add constraint topics_status_check
 check (status in ('draft','active','deferred','archived','dormant'));
alter table fib.topics alter column status set default 'draft';
-- Existing records retain their status. A later audited migration may map dormant to deferred.

create table if not exists fib.topic_contribution_drafts (
 topic_id uuid primary key references fib.topics(id) on delete restrict,
 body text not null default '',
 editorial_assessment text,
 revision bigint not null default 1 check (revision > 0),
 updated_by uuid references fib.app_users(user_id) on delete restrict,
 updated_at timestamptz not null default now()
);

create table if not exists fib.topic_revisions (
 id uuid primary key default gen_random_uuid(),
 topic_id uuid not null references fib.topics(id) on delete restrict,
 revision_no integer not null check (revision_no > 0),
 snapshot jsonb not null,
 changed_by uuid references fib.app_users(user_id) on delete restrict,
 changed_at timestamptz not null default now(),
 reason text,
 unique(topic_id,revision_no),
 unique(id,topic_id)
);

create table if not exists fib.topic_contribution_versions (
 id uuid primary key default gen_random_uuid(),
 topic_id uuid not null references fib.topics(id) on delete restrict,
 version_no integer not null check (version_no > 0),
 topic_revision_id uuid,
 body text not null,
 editorial_assessment text,
 approved_by uuid not null references fib.app_users(user_id) on delete restrict,
 approved_at timestamptz not null default now(),
 revoked_by uuid references fib.app_users(user_id) on delete restrict,
 revoked_at timestamptz,
 constraint topic_contribution_revocation_complete check
  ((revoked_by is null) = (revoked_at is null)),
 unique(topic_id,version_no),
 unique(id,topic_id),
 foreign key (topic_revision_id,topic_id) references fib.topic_revisions(id,topic_id) on delete restrict
);

create table if not exists fib.topic_publications (
 id uuid primary key default gen_random_uuid(),
 topic_id uuid not null references fib.topics(id) on delete restrict,
 contribution_version_id uuid not null,
 published_by uuid not null references fib.app_users(user_id) on delete restrict,
 published_at timestamptz not null default now(),
 ended_at timestamptz,
 ended_by uuid references fib.app_users(user_id) on delete restrict,
 ended_reason text check (ended_reason in ('replaced','deferred','archived','withdrawn')),
 constraint topic_publication_end_consistent check
  ((ended_at is null and ended_by is null and ended_reason is null)
   or (ended_at is not null and ended_by is not null and ended_reason is not null)),
 constraint topic_publication_time_consistent check
  (ended_at is null or ended_at >= published_at),
 foreign key (contribution_version_id,topic_id) references fib.topic_contribution_versions(id,topic_id) on delete restrict
);
create unique index if not exists topic_one_current_publication
 on fib.topic_publications(topic_id) where ended_at is null;

create table if not exists fib.topic_currency_checks (
 id uuid primary key default gen_random_uuid(),
 topic_id uuid not null references fib.topics(id) on delete restrict,
 contribution_version_id uuid not null,
 checked_by uuid not null references fib.app_users(user_id) on delete restrict,
 checked_at timestamptz not null default now(),
 result text not null check (result in ('current','revision_required')),
 rationale text,
 foreign key (contribution_version_id,topic_id) references fib.topic_contribution_versions(id,topic_id) on delete restrict
);

-- A published snapshot is never allowed to lose its approval.
create or replace function fib.prevent_published_topic_approval_revocation()
returns trigger language plpgsql as $
begin
 if (new.revoked_at is distinct from old.revoked_at or new.revoked_by is distinct from old.revoked_by)
    and exists(select 1 from fib.topic_publications p where p.contribution_version_id=old.id) then
   raise exception 'published approval cannot be revoked';
 end if;
 if (new.body,new.editorial_assessment,new.topic_id,new.version_no,new.approved_at,new.approved_by)
    is distinct from (old.body,old.editorial_assessment,old.topic_id,old.version_no,old.approved_at,old.approved_by) then
   raise exception 'approved version content is immutable';
 end if;
 return new;
end $;
create trigger topic_approval_immutability before update on fib.topic_contribution_versions
 for each row execute function fib.prevent_published_topic_approval_revocation();

-- A revoked approval can never be published. Lock the referenced version
-- to serialize concurrent revocation and publication operations.
create or replace function fib.validate_topic_publication_insert()
returns trigger language plpgsql as $
declare approval record;
begin
 select topic_id,revoked_at into approval
 from fib.topic_contribution_versions where id=new.contribution_version_id for update;
 if not found or approval.topic_id <> new.topic_id or approval.revoked_at is not null then
   raise exception 'publication requires a valid non-revoked topic approval';
 end if;
 return new;
end $;
create trigger topic_publication_approval_guard before insert on fib.topic_publications
 for each row execute function fib.validate_topic_publication_insert();

-- Only the existing server-side runtime database role can access these objects.
-- No GRANT to anon/authenticated; service must enforce AAL2, editor role and transitions.
alter table fib.topic_contribution_drafts enable row level security;
alter table fib.topic_revisions enable row level security;
alter table fib.topic_contribution_versions enable row level security;
alter table fib.topic_publications enable row level security;
alter table fib.topic_currency_checks enable row level security;

create policy fib_runtime_all on fib.topic_contribution_drafts to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.topic_revisions to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.topic_contribution_versions to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.topic_publications to fib_runtime using (true) with check (true);
create policy fib_runtime_all on fib.topic_currency_checks to fib_runtime using (true) with check (true);

grant select,insert,update,delete on fib.topic_contribution_drafts,
 fib.topic_revisions,fib.topic_currency_checks to fib_runtime;
grant select,insert,update on fib.topic_contribution_versions,
 fib.topic_publications to fib_runtime;

commit;
