# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 4.5 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Statusmodell

Es gelten die zentralen Status aus `PustefixReisen/pustivo/docs/governance/Dokumentenpflege.md`:

- Geplant
- In Arbeit
- Teilweise umgesetzt
- Blockiert
- Abgeschlossen
- Zurückgestellt
- Entfallen

## 1. Aktueller Stand – Gründungsphase

| Phase | Status | Ergebnis / nächster Schritt |
|---|---|---|
| Projektbasis / Repository | **Abgeschlossen** | separates Repository und initiale Dokumentationsstruktur vorhanden |
| G1 Produktumfang / MVP | **Abgeschlossen** | MVP, Ausbaustufen, Nicht-Ziele und Aufwandstreiber festgelegt |
| G2 UX / Informationsarchitektur / Fachfunktionen | **Abgeschlossen** | öffentliche und redaktionelle Zielbilder fachlich geklärt |
| G2.5 Transfer-Audit Demonstrator → Echtsystem | **Abgeschlossen** | fachliche Regeln, sichtbare Inhaltsbausteine und Redaktionsfunktionen transfergesichert |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Abgeschlossen** | Echtsystem ist Dokumentationshoheit; Transferlücken geschlossen |
| G3 Datenanforderungen / Datenmodell | **Abgeschlossen** | Datenmodell v3.0 und G3-Audit abgeschlossen |
| G4 Schutzbedarf / Datenschutz / Offline | **Abgeschlossen** | K0–K3, Löschlogik, KI-/Provider-Prüfrahmen und Offline/PWA-Grundsätze festgelegt |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Abgeschlossen** | Zielarchitektur v1.0, ADR-001 bis ADR-009 und G5-Audit abgeschlossen; ADR-011 konkretisiert Shared-Apps-/pustivo-Betrieb |
| G6 Rollen / Rechte / Workflow | **Abgeschlossen** | Rollen-/Rechtematrix, MFA, S0–S3, Fachservice-/RLS-Grenzen festgelegt |
| G7 Betrieb | **Abgeschlossen** | Backup/Restore, Monitoring, RPO/RTO, Retention und KI-Kosten-/Providerbetrieb festgelegt; ADR-011 konkretisiert schema-spezifisches FIB-Backup |
| G8 Governance / Repository / Dokumentation | **Abgeschlossen** | Dokumentationslandkarte, zentrale Governance und Wiederaufnahme-Kriterien konsolidiert |
| G9 Migration | **Abgeschlossen** | Migrationsstrategie und ausführbares Runbook festgelegt; Umzug auf GRÜNEN-Infrastruktur ist optional, nicht zwingend |
| G10 Go-live-Abnahme | **Abgeschlossen** | messbare Abnahmekriterien und harte Go-live-Blocker festgelegt |
| Gründungsaudit | **Abgeschlossen** | G1–G10 übergreifend geprüft; keine blockierende Grundsatzfrage offen |
| Umsetzungs-Vollständigkeitsaudit | **In Arbeit** | erste Gesamtprüfung abgeschlossen; G2.5-Status bereinigt; Koordination/Benutzer in PR #45 fachlich operationalisiert; weitere rote/gelbe Befunde fachbereichsweise schließen |

## 2. Umsetzungsphasen

| Umsetzungsphase | Status | Ziel / Produkt |
|---|---|---|
| U1 Technischer FIB-Kern | **In Arbeit** | Datenbankschema, Migrationen, gemeinsame Fachservice-Schicht, Auth-/RLS-Grundlage, Datei-/Bildspeicher-Anbindung, KI-Router-Grundlage, gemeinsame Konfiguration und Testbasis |
| U2 Redaktions-App | **Geplant** | interne Web-App für Rechercheeingang, Ereignisse/Meldungen, Vorgänge, Themen, Sitzungen, Bilder, „Mehr wissen?“, Freigaben, FIB-Chat und Administration |
| U3 Öffentliche FIB-Seite / PWA | **Geplant** | Besucheroberfläche mit `Neues | Im Blick | Sitzungen | Suche`, Detailseiten, PWA, Teilen, Transparenz und Neuigkeitsstatus |
| U4 Recherche / AI Tasks / KI-Funktionen | **Geplant** | Quellenbeobachtung, Quellenentdeckung, Rechercheläufe, Ereigniserkennung, Entwurfserstellung, Routing und Qualitätskontrollen |
| U5 Veröffentlichung / Deployment / Betrieb | **Geplant** | S3-Publish-Prozess, statischer Build, Deployment, Monitoring, Backup/Restore und betriebliche Automatisierung |
| U6 Integration / Pilot / Go-live-Vorbereitung | **Geplant** | End-to-End-Tests, Demonstrator-Regressionen, Usability-Feinschliff, Datenmigration, Pilotbetrieb und Vorbereitung der realen Go-live-Abnahme |

## 3. U1 – aktueller Stand

### U1.1 Monorepo-/Paketstruktur – umgesetzt

Gemäß ADR-009 angelegt:

- npm-Workspace-Grundlage in `package.json`,
- gemeinsame strikte TypeScript-Basis in `tsconfig.base.json`,
- `apps/public-web`,
- `apps/editorial-web`,
- `packages/domain-contracts`,
- `packages/fachservices`,
- `packages/ai-router`,
- `packages/storage-adapter`,
- `packages/publish`,
- `packages/ui`,
- `supabase/`,
- `tests/`,
- `scripts/`.

### U1.2 Supabase-Schema und Isolation – umgesetzt, Ausbau läuft weiter

Im bestehenden Supabase-Projekt `Shared-Apps` wurden die ersten FIB-Migrationen ausgeführt:

- Schema `fib` angelegt,
- Kernobjekte `app_users`, `events`, `messages`, `processes`, `topics`, Quellen/Fundstellen und zentrale n:m-Beziehungen angelegt,
- RLS auf allen FIB-Kerntabellen aktiviert,
- `anon`, `authenticated` und `service_role` besitzen keinen Schema-/Tabellenzugriff auf `fib`,
- Rollen `fib_runtime` und `fib_app` mit Least Privilege angelegt,
- `fib_app` erbt ausschließlich `fib_runtime`, besitzt kein `BYPASSRLS` und keine Superuser-Rechte,
- RLS-Policies ausschließlich für `fib_runtime` angelegt,
- Default Privileges für künftige FIB-Objekte abgesichert,
- FIB-spezifische Objektprivilegien in `public` ausgeschlossen,
- Beispielprüfung gegen `public.events`: `fib_app` besitzt dort weder SELECT, INSERT, UPDATE noch DELETE; auf `fib.events` bestehen die erwarteten Rechte,
- Supabase Security Advisor meldet nach Policy-Ergänzung keine FIB-spezifische `RLS enabled no policy`-Warnung mehr,
- fehlender Index auf `fib.events.merged_into_event_id` ergänzt.

Der vollständige Login-Test mit echten `fib_app`-Credentials folgt, sobald das Runtime-Secret auf pustivo gesetzt werden kann.

### Legacy-Ausnahme im Schema `public`

`public.fib_ai_daily_usage` ist laut Datenbankkommentar ein Zähler des alten öffentlichen FIB-„Mehr wissen?“-Demonstrators und gehört nicht zum Echtsystem. Die Tabelle bleibt solange unverändert, wie der Demonstrator sie benötigt. Bereinigung/Wiederaufnahme ist in GitHub Issue #5 dokumentiert.

### U1.3 Runtime- und Fachservice-Grundgerüst – begonnen

Umgesetzt:

- `.env.example` als verbindlicher Konfigurationsvertrag ohne echte Secrets,
- `docs/Betrieb-FIB-Runtimezugang.md` für `fib_app`, Secret-Regeln und Live-Isolationstest,
- `@fib/domain-contracts` mit Akteurs-, Rollen-, MFA- und S0–S3-Verträgen,
- `@fib/fachservices` mit zentraler Autorisierungsbasis,
- AI Tasks technisch auf S0/S1 begrenzt,
- S3 verlangt explizite Bestätigung,
- Admin- und MFA-Step-up-Anforderungen sind zentral prüfbar,
- offener manueller pustivo-Schritt separat dokumentiert.

Als nächstes:

1. Datenbankzugriffsadapter im Fachservice anbinden,
2. Auth-Token serverseitig prüfen und gegen `fib.app_users` autorisieren,
3. erste konkrete FIB-Fachfunktion über den gemeinsamen Autorisierungspfad implementieren,
4. automatisierte Tests für die Autorisierungsbasis ergänzen,
5. bei eingerichtetem pustivo-Serverprozess `FIB_DATABASE_URL` sicher setzen und echten Credential-Isolationstest durchführen,
6. Spezialbereiche des Datenmodells modular ergänzen,
7. schema-spezifischen FIB-Dump/Restore-Pfad vorbereiten.

Parallel gilt für Storage gemäß ADR-011:

- Nextcloud auf pustivo als möglicher dauerhafter Storage,
- eigener technischer FIB-Storage-Zugang,
- separater FIB-Backup-Zugang,
- normaler FIB-Anwendungszugang erhält keinen Schreib-/Löschzugriff auf Backup-Dateien,
- DB speichert logische Storage-Referenzen statt fest verdrahteter Nextcloud-URLs.

### U1.4 Koordination/Benutzer – Implementierung begonnen

Auf Basis des fachlichen Vertrags sind SQL-Strukturen und Fachservices für Benutzerprofil, Federführung, Bearbeitungssperren und Übernahmeanfragen umgesetzt. Die Migration `20261010074421_fib_coordination_users_locks` wurde am 10.10.2026 auf Shared-Apps angewendet und anschließend geprüft: drei neue Benutzerprofilfelder, drei Koordinationstabellen und drei Runtime-RLS-Policies sind vorhanden; `authenticated` und `service_role` besitzen weiterhin keinen direkten Tabellenzugriff. Offen bleiben Integrationstests und die UI-Anbindung.

### U1.5 Operative Vollständigkeit der Fachbereiche – querschnittlicher Gate

Recherche-/Relevanzregeln werden als versionierter operativer Regelbestand umgesetzt. U4 muss sowohl Bewertungswirkung auf bekannten Fällen als auch Entdeckungswirkung durch Probe-Recherche unterstützen; U6 übernimmt die Abnahme gegen den Testkorpus.


Vor Implementierung eines Fachbereichs in U2–U4 wird anhand von `docs/Umsetzungs-Vollstaendigkeitsaudit.md` geprüft:

`Fachregel → operative Speicherung → Fachfunktion → Auslöser/KI-Kontext → UI/Arbeitsprozess → Rechte/Audit → Test → Umsetzungsphase`.

Offene rote Befunde sind für den jeweils betroffenen Fachbereich vor dessen Umsetzung zu schließen. Die technische U1-Basis kann parallel weitergeführt werden.

## 4. Verbindliche Abschlussquellen der Gründung und Architekturkonkretisierung

- `docs/Projektgruendung.md` v1.5
- `docs/Dokumentation.md` v3.0
- `docs/Gruendungsaudit.md` v1.0
- `docs/Datenmodell.md` v3.0
- `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0
- `docs/Zielarchitektur.md` v1.0
- `docs/Rollen-Rechte-und-Workflow.md` v1.0
- `docs/Betrieb-und-Wiederherstellung.md`
- `docs/Migrationsstrategie.md` v1.1
- `docs/Migrations-Runbook.md` v1.0
- `docs/Go-live-Abnahmekriterien.md` v1.0
- `docs/Regressionstests-Demonstratortransfer.md`
- `docs/Umsetzungs-Vollstaendigkeitsaudit.md`
- Architekturentscheidungen unter `docs/decisions/`, insbesondere ADR-011

## 5. Offene, aber nicht blockierende Folgepunkte

| Punkt | Wiederaufnahme / Phase |
|---|---|
| Referenzwissen Ausbaustufe 2 | GitHub Issue #1; nach Pilot nur bei nachgewiesenem Bedarf |
| externe MCP-Anbindung | GitHub Issue #2; nach MVP bei konkretem Nutzen |
| Restore-Test | GitHub Issue #3; spätestens U6 / reale G10-Abnahme; zusätzlich schema-spezifischen `fib`-Restore nachweisen |
| Legacy-FIB-Tabelle in `public` | GitHub Issue #5; nach Abschaltung bzw. Entkopplung des Demonstrators bereinigen |
| pustivo Runtime-Secret / echter `fib_app`-Login | bei Einrichtung des FIB-Serverprozesses; Ablauf in `docs/Offener-Punkt-pustivo-FIB-Runtime-Secret.md` |
| Recherche-/Qualitätsschwellen | U4/U6 anhand Pilotkorpus kalibrieren |
| konkrete Produktivprovider/-modelle und Budget | U4/U6 anhand Qualitäts-, Datenschutz- und Kostenmessung |
| möglicher späterer Umzug auf GRÜNEN-Infrastruktur | nur bei tatsächlicher Betriebsentscheidung; pustivo darf dauerhafter Produktivbetrieb bleiben |

## 6. Entwicklungsprinzipien

- Fachliche Parität zum Demonstrator ist Mindestanforderung, nicht Endziel.
- Ein Sachverhalt besitzt eine verbindliche Dokumentationsquelle.
- Web-App, FIB-Chat und AI Tasks nutzen dieselbe Fachservice-Schicht.
- KI wird nur mit klarem Nutzen eingesetzt; erforderliche Qualität geht vor niedrigstem Preis.
- AI Tasks bleiben S0/S1; fachliche Bestätigung und Veröffentlichung bleiben menschlich verantwortlich.
- Öffentliche Auslieferung bleibt Static-first.
- Datenschutz-, Schutzklassen-, Rechte-, Audit- und Quellenregeln werden technisch abgesichert.
- Neue pustivo-Anwendungen erhalten grundsätzlich eigene PostgreSQL-Schemata und eigene technische Zugänge.
- FIB muss auch innerhalb von `Shared-Apps` technisch von Memorix und späteren Apps isoliert bleiben.
- pustivo wird nicht als Wegwerf-Pilot behandelt, sondern produktionsnah und dauerhaft betreibbar aufgebaut.
- Implementierung und Dokumentation werden gemeinsam fortgeschrieben.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 4.5 | 06.10.2026 | U1.3 begonnen: Runtime-Konfigurationsvertrag, Secret-Regeln, Domain-Contracts und zentrale Fachservice-Autorisierungsbasis angelegt; pustivo-Live-Credentialtest als konkreten manuellen Schritt dokumentiert. |
| 4.4 | 06.10.2026 | `fib` in Shared-Apps angelegt; Runtime-Rollen, RLS-Policies, Default Privileges und Isolation praktisch geprüft; Advisor-Nacharbeiten durchgeführt; Legacy-Tabelle des Demonstrators über Issue #5 abgegrenzt. |
| 4.3 | 06.10.2026 | ADR-011 übernommen: Shared-Apps mit eigenem Schema `fib`, gemeinsames Supabase Auth bei FIB-eigener Autorisierung, getrennte Nextcloud-/Backup-Zugänge, pustivo als möglicher Dauerbetrieb; `core.sql` auf `fib` umgestellt. |
| 4.2 | 06.10.2026 | U1.2 begonnen; erstes SQL-Kernschema mit RLS-/Grant-Baseline angelegt. |
| 4.1 | 06.10.2026 | U1 gestartet; Monorepo-/Paketstruktur gemäß ADR-009 umgesetzt. |
| 4.0 | 06.10.2026 | Gründungsaudit bestanden; G1–G10 und Gründungsphase abgeschlossen; U1 als nächsten technischen Umsetzungsschritt gesetzt. |
