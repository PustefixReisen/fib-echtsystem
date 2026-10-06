-- FIB Echtsystem – technischer SQL-Entwurf für den fachlichen Kern
--
-- WICHTIG:
-- Diese Datei ist noch keine ausgeführte Supabase-Migration. Sie ist die versionierte
-- SQL-Arbeitsgrundlage für U1.2 im bestehenden Supabase-Projekt Shared-Apps.
--
-- FIB verwendet dort ausschließlich das eigene Anwendungsschema `fib`.
-- Memorix verbleibt unverändert in `public`; zwischen beiden Anwendungen entstehen keine
-- fachlichen Querabhängigkeiten.
--
-- Fachliche Primärquelle: docs/Datenmodell.md v3.0
-- Architektur/Sicherheit: docs/Zielarchitektur.md,
-- docs/Rollen-Rechte-und-Workflow.md,
-- docs/decisions/ADR-011-Shared-Apps-Schema-Isolation-und-pustivo-Betrieb.md

begin;

create schema if not exists fib;

-- Standardmäßig keine Data-API-/Browserrechte auf das FIB-Schema.
revoke all on schema fib from public, anon, authenticated;

-- Neue Objekte in `fib` sollen nicht versehentlich automatisch für Supabase-API-Rollen
-- freigegeben werden. Die endgültige Runtime-Rollen-/Grant-Matrix folgt separat in U1.
alter default privileges for role postgres in schema fib
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema fib
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema fib
  revoke execute on functions from public, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- FIB-Anwendungsbenutzer
-- Supabase Auth ist projektweit gemeinsam; FIB-Autorisierung bleibt anwendungsspezifisch.
-- Ein auth.users-Eintrag allein gewährt keinen FIB-Zugang.
-- -----------------------------------------------------------------------------
create table if not exists fib.app_users (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('editor', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Ereignisse
-- -----------------------------------------------------------------------------
create table if not exists fib.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'withdrawn', 'merged')),
  occurred_at timestamptz,
  confirmed_at timestamptz,
  merged_into_event_id uuid references fib.events(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'merged' and merged_into_event_id is not null) or status <> 'merged'),
  check (merged_into_event_id is null or merged_into_event_id <> id)
);

-- -----------------------------------------------------------------------------
-- Meldungen: genau ein Ereignis; je Ereignis höchstens eine Meldung
-- -----------------------------------------------------------------------------
create table if not exists fib.messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references fib.events(id) on delete restrict,
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
create table if not exists fib.processes (
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

create table if not exists fib.event_processes (
  event_id uuid not null references fib.events(id) on delete restrict,
  process_id uuid not null references fib.processes(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (event_id, process_id)
);

-- -----------------------------------------------------------------------------
-- Themen
-- -----------------------------------------------------------------------------
create table if not exists fib.topics (
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

create table if not exists fib.process_topics (
  process_id uuid not null references fib.processes(id) on delete restrict,
  topic_id uuid not null references fib.topics(id) on delete restrict,
  significance text not null
    check (significance in ('defining', 'relevant', 'supplementary')),
  significance_rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (process_id, topic_id)
);

create table if not exists fib.event_topics (
  event_id uuid not null references fib.events(id) on delete restrict,
  topic_id uuid not null references fib.topics(id) on delete restrict,
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
create table if not exists fib.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text,
  homepage_url text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fib.findings (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references fib.sources(id) on delete restrict,
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

create table if not exists fib.event_findings (
  event_id uuid not null references fib.events(id) on delete restrict,
  finding_id uuid not null references fib.findings(id) on delete restrict,
  evidence_role text,
  note text,
  created_at timestamptz not null default now(),
  primary key (event_id, finding_id)
);

-- -----------------------------------------------------------------------------
-- Indizes
-- -----------------------------------------------------------------------------
create index if not exists idx_fib_events_status_occurred_at
  on fib.events (status, occurred_at desc);
create index if not exists idx_fib_messages_status_published_at
  on fib.messages (status, published_at desc);
create index if not exists idx_fib_processes_status
  on fib.processes (status);
create index if not exists idx_fib_topics_status
  on fib.topics (status);
create index if not exists idx_fib_event_processes_process
  on fib.event_processes (process_id, event_id);
create index if not exists idx_fib_process_topics_topic
  on fib.process_topics (topic_id, process_id);
create index if not exists idx_fib_event_topics_topic
  on fib.event_topics (topic_id, event_id);
create index if not exists idx_fib_findings_source_published_at
  on fib.findings (source_id, published_at desc);
create index if not exists idx_fib_event_findings_finding
  on fib.event_findings (finding_id, event_id);

-- -----------------------------------------------------------------------------
-- Security baseline
-- RLS bleibt als Defense in Depth aktiviert, auch wenn `fib` zunächst nicht als Data-API-
-- Schema exponiert wird. Konkrete Policies und die Runtime-Rolle folgen in U1.
-- -----------------------------------------------------------------------------
alter table fib.app_users enable row level security;
alter table fib.events enable row level security;
alter table fib.messages enable row level security;
alter table fib.processes enable row level security;
alter table fib.event_processes enable row level security;
alter table fib.topics enable row level security;
alter table fib.process_topics enable row level security;
alter table fib.event_topics enable row level security;
alter table fib.sources enable row level security;
alter table fib.findings enable row level security;
alter table fib.event_findings enable row level security;

revoke all on all tables in schema fib from anon, authenticated, service_role;
revoke all on all sequences in schema fib from anon, authenticated, service_role;

-- WICHTIG: absichtlich kein pauschaler service_role-Grant.
-- Der normale FIB-Fachbetrieb soll über eine FIB-spezifische Runtime-Rolle mit minimalen
-- Schema-Rechten laufen. Deren konkrete Definition wird vor Ausführung dieses Schemas in
-- Shared-Apps festgelegt und separat getestet.

commit;
