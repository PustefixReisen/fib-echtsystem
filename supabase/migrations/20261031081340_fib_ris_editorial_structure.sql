-- PREPARED ONLY: no production application without separate approval.
-- FIB-only additive objects. No extensions, scheduler, credentials or public/Memorix changes.
begin;
create table fib.ris_committees (
 id uuid primary key default gen_random_uuid(),
 source_key text not null unique,
 name text not null check(length(btrim(name))>0),
 source_url text not null,
 identity_basis text not null check(identity_basis in ('ris_id','observed_label'))
);
create table fib.ris_sessions (
 id uuid primary key default gen_random_uuid(),
 source_url text not null unique check(source_url ~ '^https://buergerinfo-feldkirchen[.]digitalfabrix[.]de/si[0-9]+[.]asp[?]__ksinr=[0-9]+$'),
 committee_id uuid references fib.ris_committees(id),
 reference text, session_date date,
 current_revision integer not null default 0 check(current_revision>=0),
 last_observed_at timestamptz not null,
 minutes_approval text not null default 'unknown' check(minutes_approval in ('unknown','pending','approved'))
);
create table fib.ris_session_versions (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references fib.ris_sessions(id) on delete restrict,
 revision integer not null check(revision>0),
 content_hash text not null check(content_hash ~ '^[a-f0-9]{64}$'),
 observed_at timestamptz not null,
 source_url text not null,
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object'),
 unique(session_id,revision), unique(id,session_id)
);
create table fib.ris_agenda_items (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references fib.ris_sessions(id) on delete restrict,
 source_key text not null, number text, title text not null,
 treatment_status text not null default 'unknown' check(treatment_status in ('unknown','announced','deferred','treated','withdrawn')),
 latest_snapshot_id uuid not null,
 foreign key(latest_snapshot_id,session_id) references fib.ris_session_versions(id,session_id),
 unique(session_id,source_key), unique(id,session_id)
);
create table fib.ris_proposals (
 id uuid primary key default gen_random_uuid(),
 agenda_id uuid not null references fib.ris_agenda_items(id) on delete restrict,
 source_url text not null, reference text,
 unique(agenda_id,source_url)
);
create table fib.ris_documents (
 id uuid primary key default gen_random_uuid(),
 source_url text not null unique check(source_url ~ '^https://buergerinfo-feldkirchen[.]digitalfabrix[.]de/getfile[.]asp[?]id=[0-9]+$'),
 latest_version_id uuid, last_observed_at timestamptz,
 finding_id uuid references fib.findings(id) on delete restrict
);
create table fib.ris_document_versions (
 id uuid primary key default gen_random_uuid(),
 document_id uuid not null references fib.ris_documents(id) on delete restrict,
 content_hash text not null check(content_hash ~ '^[a-f0-9]{64}$'),
 extracted_text text, extraction_method text not null,
 observed_at timestamptz not null,
 unique(document_id,content_hash), unique(id,document_id)
);
alter table fib.ris_documents add foreign key(latest_version_id,id) references fib.ris_document_versions(id,document_id);
create table fib.ris_document_links (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references fib.ris_sessions(id) on delete restrict,
 agenda_id uuid,
 document_id uuid not null references fib.ris_documents(id) on delete restrict,
 kind text not null default 'unknown' check(kind in ('unknown','proposal','minutes','decision','attachment')),
 status text not null default 'candidate' check(status in ('candidate','confirmed','rejected')),
 snapshot_id uuid not null,
 reviewed_by uuid references fib.app_users(user_id), reviewed_at timestamptz,
 foreign key(agenda_id,session_id) references fib.ris_agenda_items(id,session_id),
 foreign key(snapshot_id,session_id) references fib.ris_session_versions(id,session_id),
 check(kind<>'minutes' or agenda_id is null),
 check((status='candidate' and reviewed_by is null and reviewed_at is null) or (status<>'candidate' and reviewed_by is not null and reviewed_at is not null))
);
create unique index ris_document_link_top_unique on fib.ris_document_links(session_id,agenda_id,document_id) where agenda_id is not null;
create unique index ris_document_link_session_unique on fib.ris_document_links(session_id,document_id) where agenda_id is null;
create table fib.ris_agenda_events (
 agenda_id uuid not null references fib.ris_agenda_items(id) on delete restrict,
 event_id uuid not null references fib.events(id) on delete restrict,
 role text not null check(role in ('proposal_publication','treatment','decision','minutes_publication')),
 rationale text not null check(length(btrim(rationale))>0),
 reviewed_by uuid not null references fib.app_users(user_id),
 reviewed_at timestamptz not null default now(),
 primary key(agenda_id,event_id), unique(agenda_id,event_id,role)
);
create table fib.ris_suggestions (
 id uuid primary key default gen_random_uuid(),
 agenda_id uuid not null references fib.ris_agenda_items(id) on delete restrict,
 document_version_id uuid not null references fib.ris_document_versions(id) on delete restrict,
 kind text not null check(kind in ('proposal_text','decision')),
 origin text not null check(origin in ('ai','editor')),
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 status text not null default 'pending' check(status in ('pending','confirmed','rejected','deferred')),
 created_by uuid references fib.app_users(user_id), created_at timestamptz not null default now(),
 reviewed_by uuid references fib.app_users(user_id), reviewed_at timestamptz,
 check((status='pending' and reviewed_by is null and reviewed_at is null) or (status<>'pending' and reviewed_by is not null and reviewed_at is not null))
);
create table fib.ris_proposal_texts (
 id uuid primary key default gen_random_uuid(),
 proposal_id uuid not null references fib.ris_proposals(id),
 document_version_id uuid not null references fib.ris_document_versions(id),
 wording text not null check(length(btrim(wording))>0),
 suggestion_id uuid not null unique references fib.ris_suggestions(id)
);
create table fib.ris_decision_points (
 id uuid primary key default gen_random_uuid(), agenda_id uuid not null,
 event_id uuid not null, event_role text not null default 'decision' check(event_role='decision'),
 point_key text not null check(length(btrim(point_key))>0),
 foreign key(agenda_id,event_id,event_role) references fib.ris_agenda_events(agenda_id,event_id,role),
 unique(agenda_id,event_id,point_key)
);
create table fib.ris_decision_versions (
 id uuid primary key default gen_random_uuid(),
 point_id uuid not null references fib.ris_decision_points(id) on delete restrict,
 document_version_id uuid not null references fib.ris_document_versions(id) on delete restrict,
 wording text not null check(length(btrim(wording))>0),
 suggestion_id uuid not null unique references fib.ris_suggestions(id),
 created_at timestamptz not null default now()
);
create table fib.ris_votes (
 id uuid primary key default gen_random_uuid(),
 decision_version_id uuid not null references fib.ris_decision_versions(id),
 result text not null default 'unknown' check(result in ('unknown','accepted','rejected','no_vote')),
 yes_count integer check(yes_count>=0), no_count integer check(no_count>=0), abstention_count integer check(abstention_count>=0),
 evidence_quote text not null check(length(btrim(evidence_quote))>0)
);
create index on fib.ris_sessions(committee_id);
create index on fib.ris_session_versions(session_id,observed_at desc);
create index on fib.ris_document_links(document_id);
create index on fib.ris_document_links(agenda_id);
create index on fib.ris_suggestions(agenda_id,status);
create index on fib.ris_suggestions(document_version_id);
create index on fib.ris_agenda_events(event_id);
create index on fib.ris_proposal_texts(proposal_id);
create index on fib.ris_decision_versions(point_id);
create index on fib.ris_votes(decision_version_id);
create table fib.ris_relation_suggestions (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references fib.events(id),
 process_id uuid references fib.processes(id), topic_id uuid references fib.topics(id),
 significance text check(significance in ('defining','relevant','supplementary')),
 origin text not null check(origin in ('ai','editor')), rationale text not null check(length(btrim(rationale))>0),
 status text not null default 'pending' check(status in ('pending','confirmed','rejected','deferred')),
 created_by uuid not null references fib.app_users(user_id), created_at timestamptz not null default now(),
 reviewed_by uuid references fib.app_users(user_id), reviewed_at timestamptz,
 check ((process_id is not null)::int+(topic_id is not null)::int=1),
 check (topic_id is null or significance is not null),
 check ((status='pending' and reviewed_by is null and reviewed_at is null) or
        (status<>'pending' and reviewed_by is not null and reviewed_at is not null))
);
create index on fib.ris_relation_suggestions(event_id,status);
create table fib.ris_review_log (
 id uuid primary key default gen_random_uuid(), actor_id uuid not null references fib.app_users(user_id),
 action text not null, object_id uuid not null, detail jsonb not null,
 created_at timestamptz not null default now()
);
create index on fib.ris_review_log(object_id,created_at);
-- Exact FIB-only table list; no default/global grants and no SECURITY DEFINER.
do $$
declare t text;
begin
 foreach t in array array['ris_relation_suggestions','ris_review_log','ris_committees','ris_sessions','ris_session_versions','ris_agenda_items','ris_proposals','ris_documents','ris_document_versions','ris_document_links','ris_agenda_events','ris_suggestions','ris_proposal_texts','ris_decision_points','ris_decision_versions','ris_votes'] loop
  execute format('alter table fib.%I enable row level security',t);
  execute format('revoke all on fib.%I from public,anon,authenticated,service_role,fib_runtime',t);
  execute format('grant select,insert on fib.%I to fib_runtime',t);
  execute format('create policy ris_runtime_read on fib.%I for select to fib_runtime using(true)',t);
  execute format('create policy ris_runtime_insert on fib.%I for insert to fib_runtime with check(true)',t);
 end loop;
 foreach t in array array['ris_relation_suggestions','ris_committees','ris_sessions','ris_agenda_items','ris_documents','ris_document_links','ris_suggestions'] loop
  execute format('grant update on fib.%I to fib_runtime',t);
  execute format('create policy ris_runtime_update on fib.%I for update to fib_runtime using(true) with check(true)',t);
 end loop;
end $$;
commit;
