-- FIB Echtsystem – technischer SQL-Entwurf für den fachlichen Kern
--
-- WICHTIG:
-- Diese Datei ist noch keine Supabase-Migration. Sie ist die versionierte SQL-Arbeitsgrundlage
-- für U1.2. Sobald ein eigenes FIB-Entwicklungsprojekt vorhanden ist, wird daraus mit dem
-- Supabase CLI eine Migration erzeugt, gegen die Ziel-Datenbank ausgeführt und verifiziert.
--
-- Fachliche Primärquelle: docs/Datenmodell.md v3.0
-- Architektur/Sicherheit: docs/Zielarchitektur.md, docs/Rollen-Rechte-und-Workflow.md

begin;

-- -----------------------------------------------------------------------------
-- Ereignisse
-- -----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'withdrawn', 'merged')),
  occurred_at timestamptz,
  confirmed_at timestamptz,
  merged_into_event_id uuid references public.events(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'merged' and merged_into_event_id is not null) or status <> 'merged'),
  check (merged_into_event_id is null or merged_into_event_id <> id)
);

-- -----------------------------------------------------------------------------
-- Meldungen: genau ein Ereignis; je Ereignis höchstens eine Meldung
-- -----------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events(id) on delete restrict,
  slug text unique,
  title text not null,
  teaser text,
  body text,
  editorial_assessment text,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'published', 'withdrawn')),
  approved_at timestamptz,
  published_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Vorgänge
-- -----------------------------------------------------------------------------
create table if not exists public.processes (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  current_state text,
  status text not null default 'active'
    check (status in ('active', 'dormant', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ereignis <-> Vorgang n:m
create table if not exists public.event_processes (
  event_id uuid not null references public.events(id) on delete restrict,
  process_id uuid not null references public.processes(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (event_id, process_id)
);

-- -----------------------------------------------------------------------------
-- Themen
-- -----------------------------------------------------------------------------
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  guiding_question text,
  description text,
  current_state text,
  status text not null default 'active'
    check (status in ('active', 'dormant', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Vorgang <-> Thema n:m, inklusive redaktionell bestätigter Bedeutung
create table if not exists public.process_topics (
  process_id uuid not null references public.processes(id) on delete restrict,
  topic_id uuid not null references public.topics(id) on delete restrict,
  significance text not null
    check (significance in ('defining', 'relevant', 'supplementary')),
  significance_rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (process_id, topic_id)
);

-- Direkte Zusatzbeziehung Ereignis <-> Thema n:m
create table if not exists public.event_topics (
  event_id uuid not null references public.events(id) on delete restrict,
  topic_id uuid not null references public.topics(id) on delete restrict,
  significance text not null
    check (significance in ('defining', 'relevant', 'supplementary')),
  significance_rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, topic_id)
);

-- -----------------------------------------------------------------------------
-- Quellen und Fundstellen
-- -----------------------------------------------------------------------------
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text,
  homepage_url text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.findings (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete restrict,
  title text,
  original_url text,
  published_at timestamptz,
  discovered_at timestamptz not null default now(),
  content_fingerprint text,
  storage_ref text,
  publicly_available boolean,
  currently_reachable boolean,
  public_via_fib boolean not null default false,
  publication_rights_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (public_via_fib = false or publication_rights_confirmed = true)
);

-- Belegbeziehung Fundstelle <-> Ereignis
create table if not exists public.event_findings (
  event_id uuid not null references public.events(id) on delete restrict,
  finding_id uuid not null references public.findings(id) on delete restrict,
  evidence_role text,
  note text,
  created_at timestamptz not null default now(),
  primary key (event_id, finding_id)
);

-- -----------------------------------------------------------------------------
-- Indizes für häufige fachliche Zugriffe
-- -----------------------------------------------------------------------------
create index if not exists idx_events_status_occurred_at
  on public.events (status, occurred_at desc);

create index if not exists idx_messages_status_published_at
  on public.messages (status, published_at desc);

create index if not exists idx_processes_status
  on public.processes (status);

create index if not exists idx_topics_status
  on public.topics (status);

create index if not exists idx_event_processes_process
  on public.event_processes (process_id, event_id);

create index if not exists idx_process_topics_topic
  on public.process_topics (topic_id, process_id);

create index if not exists idx_event_topics_topic
  on public.event_topics (topic_id, event_id);

create index if not exists idx_findings_source_published_at
  on public.findings (source_id, published_at desc);

create index if not exists idx_event_findings_finding
  on public.event_findings (finding_id, event_id);

-- -----------------------------------------------------------------------------
-- Security baseline
-- Alle Tabellen im exponierten public-Schema erhalten RLS.
-- Direkter anon/authenticated-Zugriff wird im Kern nicht freigegeben.
-- Fachzugriffe sollen später über die serverseitige Fachservice-Schicht erfolgen.
-- -----------------------------------------------------------------------------
alter table public.events enable row level security;
alter table public.messages enable row level security;
alter table public.processes enable row level security;
alter table public.event_processes enable row level security;
alter table public.topics enable row level security;
alter table public.process_topics enable row level security;
alter table public.event_topics enable row level security;
alter table public.sources enable row level security;
alter table public.findings enable row level security;
alter table public.event_findings enable row level security;

revoke all on table public.events from anon, authenticated;
revoke all on table public.messages from anon, authenticated;
revoke all on table public.processes from anon, authenticated;
revoke all on table public.event_processes from anon, authenticated;
revoke all on table public.topics from anon, authenticated;
revoke all on table public.process_topics from anon, authenticated;
revoke all on table public.event_topics from anon, authenticated;
revoke all on table public.sources from anon, authenticated;
revoke all on table public.findings from anon, authenticated;
revoke all on table public.event_findings from anon, authenticated;

-- Der technische Serverzugang wird explizit sichtbar gemacht.
grant select, insert, update, delete on table public.events to service_role;
grant select, insert, update, delete on table public.messages to service_role;
grant select, insert, update, delete on table public.processes to service_role;
grant select, insert, update, delete on table public.event_processes to service_role;
grant select, insert, update, delete on table public.topics to service_role;
grant select, insert, update, delete on table public.process_topics to service_role;
grant select, insert, update, delete on table public.event_topics to service_role;
grant select, insert, update, delete on table public.sources to service_role;
grant select, insert, update, delete on table public.findings to service_role;
grant select, insert, update, delete on table public.event_findings to service_role;

commit;
