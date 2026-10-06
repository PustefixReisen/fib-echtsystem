# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 4.3 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

Die Bereiche enthalten zunächst nur Verantwortungsgrenzen und noch keine unnötige Framework-/Geschäftslogik.

### U1.2 Supabase-Schema und Migrationen – in Arbeit

Der erste technische SQL-Kern liegt in `supabase/schema/core.sql`.

Nach der Architekturkonkretisierung ADR-011 gilt nun verbindlich:

- FIB nutzt das bestehende Supabase-Projekt `Shared-Apps`,
- FIB erhält das eigene PostgreSQL-Schema `fib`,
- Memorix verbleibt unverändert in `public`,
- zwischen `fib` und `public` werden keine fachlichen Querabhängigkeiten angelegt,
- Supabase Auth wird projektweit gemeinsam genutzt,
- FIB-Autorisierung erfolgt ausschließlich über FIB-eigene Zuordnungen in `fib`,
- normale FIB-Fachzugriffe erhalten keinen pauschalen `service_role`-Zugang,
- `fib` wird standardmäßig nicht für `anon`/`authenticated` freigegeben,
- RLS bleibt Defense in Depth,
- FIB-Daten müssen schema-spezifisch sicherbar und wiederherstellbar sein.

`core.sql` wurde entsprechend bereits von `public.*` auf `fib.*` umgestellt und um `fib.app_users` als anwendungsspezifische Zuordnung zu `auth.users` ergänzt.

### U1.3 Nächster Schritt – Runtime-Rolle und Isolationstest

Bevor das Schema tatsächlich in `Shared-Apps` angelegt wird, wird die technische Isolation verbindlich umgesetzt und geprüft:

1. FIB-spezifische Runtime-/DB-Rolle mit Least Privilege definieren,
2. Rechte ausschließlich auf `fib` und ausdrücklich erforderliche Supabase-Systemfunktionen begrenzen,
3. sicherstellen, dass diese Rolle `public`/Memorix weder lesen noch schreiben kann, soweit nicht technisch unvermeidbar und ausdrücklich dokumentiert,
4. Default Privileges für spätere FIB-Objekte absichern,
5. Testfälle „FIB kann fib“ und „FIB kann public/andere App-Schemata nicht“ anlegen,
6. erst danach `fib` in `Shared-Apps` erzeugen und Schema/Advisors praktisch verifizieren,
7. anschließend schema-spezifischen Dump/Restore-Pfad vorbereiten.

Parallel gilt für Storage gemäß ADR-011:

- Nextcloud auf pustivo als möglicher dauerhafter Storage,
- eigener technischer FIB-Storage-Zugang,
- separater FIB-Backup-Zugang,
- normaler FIB-Anwendungszugang erhält keinen Schreib-/Löschzugriff auf Backup-Dateien,
- DB speichert logische Storage-Referenzen statt fest verdrahteter Nextcloud-URLs.

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
- Architekturentscheidungen unter `docs/decisions/`, insbesondere ADR-011 für Shared-Apps-/Schema-/pustivo-Betrieb

## 5. Offene, aber nicht blockierende Folgepunkte

| Punkt | Wiederaufnahme / Phase |
|---|---|
| Referenzwissen Ausbaustufe 2 | GitHub Issue #1; nach Pilot nur bei nachgewiesenem Bedarf |
| externe MCP-Anbindung | GitHub Issue #2; nach MVP bei konkretem Nutzen |
| Restore-Test | GitHub Issue #3; spätestens U6 / reale G10-Abnahme; zusätzlich schema-spezifischen `fib`-Restore nachweisen |
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
| 4.3 | 06.10.2026 | ADR-011 übernommen: Shared-Apps mit eigenem Schema `fib`, gemeinsames Supabase Auth bei FIB-eigener Autorisierung, getrennte Nextcloud-/Backup-Zugänge, pustivo als möglicher Dauerbetrieb; `core.sql` auf `fib` umgestellt; Runtime-Rollen-/Isolationstest als nächsten Schritt gesetzt. |
| 4.2 | 06.10.2026 | U1.2 begonnen; erstes SQL-Kernschema mit RLS-/Grant-Baseline angelegt. |
| 4.1 | 06.10.2026 | U1 gestartet; Monorepo-/Paketstruktur gemäß ADR-009 umgesetzt; nächster Schritt auf Supabase-Schema und Migrationen gesetzt. |
| 4.0 | 06.10.2026 | Gründungsaudit bestanden; G1–G10 und Gründungsphase abgeschlossen; U1 als nächsten technischen Umsetzungsschritt gesetzt. |
