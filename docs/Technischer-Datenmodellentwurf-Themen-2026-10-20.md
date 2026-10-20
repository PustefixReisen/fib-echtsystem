# Technischer Datenmodellentwurf – Themenbearbeitung (ohne Migration)

**Stand:** 20.10.2026  
**Status:** Technische Planung, ausdrücklich **nicht** zur produktiven Ausführung freigegeben  
**Referenzen:** Issue #153, #149; `docs/Themen-und-Vorgangslogik.md`, `docs/Datenmodell.md`, `docs/Begriffe.md`.

## 1. Überprüfter Iststand (Live-Schema, nur lesend)

Supabase-Projekt Shared-Apps; nur Schema `fib` geprüft. Datenbank nicht geändert.

- `fib.topics` (1 Datensatz): `id, slug, title, guiding_question, description, current_state, status, created_at, updated_at`; `status` aktuell `active/dormant/archived`, Default `active`.
- `fib.process_topics` (2): bestätigte Beziehungen `process_id/topic_id/significance/significance_rationale`.
- `fib.event_topics` (0): direkte zusätzliche Ereignisbezüge bereits vorgesehen.
- `fib.process_topic_proposals` (2): Vorgangskandidaten; Provenienz `ai/editor`; Entscheidung `pending/confirmed/rejected` und redaktionelle Freigabeattribute vorhanden.
- `fib.lead_responsibilities` (1): bestehende Federführung, nicht durch eigene Koordinationsrolle ersetzen.
- `fib.messages` (7): separate Ereignismeldungen mit `body/editorial_assessment` und Status `draft/approved/published/withdrawn`; **nicht** als Thementext-Tabelle zweckentfremden.
- Alle oben geprüften Tabellen sind RLS-aktiviert.
- Edge Function `fib-topic-editor`: `list,create_topic,propose,decide`; AAL2+aktive Rolle `editor/admin` vor DB-Zugriff; derzeit kein Freigabe-/Publikationsservice für Themen.

## 2. Datenmodell-Zielbild (konzeptionell; Tabellenbezeichnungen vor Umsetzung bestätigen)

### 2.1 Erweiterung `fib.topics`

- Bestehende `id`, Thema-Felder, Zeitstempel beibehalten.
- Statuswertemenge: `draft`, `active`, `deferred`, `archived` (UI: Entwurf/Aktiv/Zurückgestellt/Archiviert). Default **`draft`** für neu angelegte Themen.
- Bisheriges `dormant` semantisch nach `deferred` migrieren, *nicht* Änderungen in `fib.processes` durchführen.
- Bestehende Zeilen **nicht pauschal aktivieren/freigeben**: vor Migration Bestandsabgleich gegen Veröffentlichungs-/Freigabehistorie, die derzeit ggf. außerhalb dieses neuen Modells liegt. Die eine bestehende Entwicklungszeile benötigt eine dokumentierte Einzelfallregel.
- Keine künstliche Federführungsspalte: `fib.lead_responsibilities` verwenden.

### 2.2 Beitrags-Arbeitsfassung

Vorgeschlagene neue Tabelle `fib.topic_contribution_drafts`:
- `topic_id` eindeutig als FK auf `topics`; `body` (Thementext), `editorial_assessment` (optional), `updated_by`, `updated_at`, `revision` (optimistische Sperre).
- Aktuelle Arbeitsfassung getrennt von freigegebenen öffentlichen Snapshots; keine formale Beitragsversion pro Zwischenspeicherung.
- KI-Vorschläge separat, einschließlich Quelle/Modellkennung/Regelversion/Zeitpunkt/Zielfeld und Übernahmestatus; KI darf keine Freigabe auslösen.

### 2.3 Freigegebene Beitragsversionen

`fib.topic_contribution_versions`:
- `id`, `topic_id`, fortlaufende `version_no` je Thema, unveränderliche `body` und optionale `editorial_assessment`, `source_topic_revision_id`, `approved_by`, `approved_at`.
- Status `approved` oder `revoked_prepublication`, Rücknahme durch und Zeit; unveränderliche Text-Snapshots. Eine als öffentlich publizierte Version darf **nie** nachträglich als Freigabe zurückgenommen werden.
- Freigabe/Entzug als eigene Audit-Ereignisse, nicht durch stilles Überschreiben historischer Werte.

### 2.4 Publikationshistorie

`fib.topic_publications`: `id`, `topic_id`, `contribution_version_id`, `published_by`, `published_at`, `ended_at`, `ended_reason` (replaced/deferred/archived/withdrawn), `ended_by`.
- Maximal **ein aktiver Veröffentlichungszeitraum** pro Thema; Partial-Unique-Constraint `ended_at IS NULL` auf `topic_id`.
- Öffentlich sichtbar ist allein der aktive Publikationseintrag samt unverändertem Snapshot, **nicht** `topics.status='active'` oder die Arbeitsfassung.
- Bei Zurückstellung/Archivierung aktiven Zeitraum transaktional beenden. Wiederaufnahme dokumentiert Aktualitätsprüfung und erfordert **neue bewusste Publikationsaktion**, keine automatische Sichtbarkeit.

### 2.5 Fachliche Historie und redaktionelle Prüfung

- Vorhandene Gesamtversionierungsanforderung (§4.6 Datenmodell) respektieren: vorgeschlagene `fib.topic_revisions` mit Snapshot/Änderungsgrund/Akteur/Zeitpunkt für wesentliche Änderungen an Definition und bestätigten lokalen Bezügen. Eine Beitragsversion referenziert diesen Fachstand.
- `fib.topic_currency_checks`: `topic_id`, `contribution_version_id`, `checked_by`, `checked_at`, Ergebnis (aktuell/Überarbeitung nötig), optional begründender Kommentar; Freigabe bleibt für unveränderte Fassung wirksam.
- `fib.topic_lifecycle_events`: auditiertes Ereignis für Statusübergänge inkl. Begründung/Akteur/Zeitpunkt; auch Ausnahme `archived→active`.
- Vorhandenen zentralen Audit-Mechanismus vor Neuanlage weiterer Audit-Tabellen recherchieren und vorrangig verwenden; diese Objekte sind fachliche Konzepte, keine Pflicht zur Verdoppelung.

### 2.6 Lokale Bezüge und KI

- `process_topics` und `event_topics` weiterverwenden; deren kombinierte UI-Sicht hat Kennzeichen Vorgang/Ereignis.
- Prüfen, ob Vorschlagstabelle nach generischem Objekttyp erweitert oder zusätzliche Ereignisvorschläge modelliert werden sollen. Keinesfalls ungetestete `process_id`-Nullability-Migration.
- Redaktioneller Zuordnungsstatus getrennt von KI-Herkunft und Bedeutung; Ablehnungsgrund/erneuter Vorschlag bei konkret geändertem Sachstand, Historie behalten.
- **Anti-Doppelzählung** für Ereignisse eines bereits zugeordneten Vorgangs in Fachfunktionen auswerten.

## 3. Serverseitige Invarianten / Testmatrix

1. Jeder Schreibaufruf: verifizierter Benutzer, AAL2, aktive FIB-Rolle; getrennte Adminrechte nicht stillschweigend einführen.
2. Erste Freigabe: `draft→active`; vor Veröffentlichung widerrufene erste Freigabe: `active→draft` (nur sofern nie zuvor veröffentlicht).
3. Publizieren nur explizit mit freigegebener, nicht widerrufener Version; Aktion auditieren. Selbstfreigabe/Selbstpublikation erlaubt.
4. Versionen, die einmal veröffentlicht waren, behalten ihre historische Freigabe; Änderungen nur über neue Version.
5. `active→deferred/archived`: aktive Publikation atomar beenden; spätere Wiederaufnahme aus `archived` explizit bestätigen und Aktualität prüfen.
6. Löschen nur wenn **noch nie publiziert** und keine wirksame Freigabe; FK-Bezüge/Vorschläge bereinigen ohne verknüpfte Vorgänge/Ereignisse zu löschen; Auditvorgaben berücksichtigen.
7. Nur eine aktive Themenpublikation; keine öffentliche Draft-/KI-Ausgabe; Veröffentlichung ersetzt letzten veröffentlichten Snapshot atomar.
8. Optimistic-locking/Transaktion schützt parallele Bearbeitung, Freigabe und Statusänderung.
9. RLS und Grants für neue FIB-Tabellen standardmäßig geschlossen; Services sind regulärer Zugang.

## 4. Ausführungsplan

A. SQL-Bestand/Constraints/Policies und Abhängigkeiten gezielt read-only überprüfen; Datenmigration für bestehendes `fib.topics` planen.  
B. Transaktionale Migration auf eigenem GitHub-Branch **mit Tests, ohne Live-Anwendung** erarbeiten.  
C. Fachservice-API und Zustandsübergangstests, anschließend Oberfläche und mobile Abnahme.  
D. Deployment mit gesonderter Prüfung/Sicherheitsfreigabe; keine Änderungen an Memorix oder Supabase Auth.

## 5. Offene technische Entscheidungen

- Vorhandene Audit-Tabellen/Funktionsschnittstellen und konsistente Abgrenzung von Fachrevision versus Beitragsversion identifizieren.
- Konsequenzen der bestehenden `dormant`-Wertemenge und alter Entwicklungsdaten testen.
- Endgültiger Vorschlags-/Zuordnungsstatus sowie Lösch-/Restore- und Veröffentlichungsschnittstelle vor DDL festlegen.
- Klären, ob ein Thema eine aktuell freigegebene, aber unveröffentlichte Version neben einer veröffentlichten Version besitzt (als getrennte Fälle unterstützen).
