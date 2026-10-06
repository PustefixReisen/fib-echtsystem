# FIB – Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.3 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Zweck

Dieses Repository enthält das Echtsystem von **„Feldkirchen im Blick (FIB)”**.

Der bisherige Demonstrator ist abgeschlossen und dient ausschließlich als historische, fachliche und visuelle Referenz. Die laufende Dokumentationshoheit liegt vollständig in diesem Repository.

## Aktuelle Phase

Die Projektgründungsphase G1–G10 einschließlich Gründungsaudit ist abgeschlossen.

Die technische Umsetzung hat mit **U1 – Technischer FIB-Kern** begonnen. Der erste Schritt ist die Monorepo-/Paketstruktur gemäß ADR-009; anschließend folgen Supabase-Schema/Migrationen, gemeinsame Verträge, Fachservices, Auth/RLS, Storage-/KI-Adapter und Testbasis.

## Leitprinzipien

- so einfach wie möglich, aber so tragfähig wie nötig,
- persistenter PostgreSQL-Datenbestand,
- gemeinsame serverseitige Fachservice-Schicht für Web-App, FIB-Chat und AI Tasks,
- fachliche Regeln technisch absichern,
- KI modellunabhängig einsetzen,
- **Ereignis → Meldung → Vorgang → Thema** als vereinfachte zentrale Wissensstruktur,
- Sitzung als Beratungs- und Entscheidungskontext,
- Sachinformation und „Unsere Einordnung“ klar trennen,
- `Bedeutung für das Thema` (`prägend | relevant | ergänzend`) redaktionell bestätigen,
- „Mehr wissen?“ als kontext- und quellengebundene Vertiefung,
- öffentliche Auslieferung Static-first,
- organisationsgebundene Produktivkonten und mindestens zwei technische Administratoren,
- Mobile First und WCAG 2.2 AA.

## Technische Struktur

```text
apps/
  public-web/       öffentliche FIB-Seite / PWA
  editorial-web/    Redaktions-App inkl. FIB-Chat
packages/
  domain-contracts/ gemeinsame Typen/Schemas
  fachservices/     serverseitige Fachlogik
  ai-router/        providerunabhängiges KI-Routing
  storage-adapter/  austauschbarer Datei-/Bildspeicher
  publish/          K0-Release-/Buildvorbereitung
  ui/               tatsächlich gemeinsame UI-Bausteine
supabase/            Migrationen, Funktionen und versionierbare Konfiguration
tests/               Regression, Integration, E2E
scripts/             Publish, Deploy, Maintenance
assets/              Produktions-/Markenassets
docs/                verbindliche Projektdokumentation
```

Die Verantwortungsgrenzen sind in `docs/decisions/ADR-009-Repository-und-Anwendungsstruktur.md` verbindlich beschrieben.

## Dokumentation

Zentrale Einstiegspunkte:

- Dokumentationslandkarte: `docs/Dokumentation.md`
- Roadmap: `docs/Roadmap.md`
- Projektgründung: `docs/Projektgruendung.md`
- Gründungsaudit: `docs/Gruendungsaudit.md`
- Datenmodell: `docs/Datenmodell.md`
- Zielarchitektur: `docs/Zielarchitektur.md`
- Rollen/Rechte/Workflow: `docs/Rollen-Rechte-und-Workflow.md`
- Betrieb/Wiederherstellung: `docs/Betrieb-und-Wiederherstellung.md`
- Go-live-Abnahmekriterien: `docs/Go-live-Abnahmekriterien.md`
- Transfer-Regressionstests: `docs/Regressionstests-Demonstratortransfer.md`

Weitere verbindliche Primärquellen sind in `docs/Dokumentation.md` aufgeführt.

Zentrale projektübergreifende Governance-Regeln liegen in `PustefixReisen/pustivo`.

## Verhältnis zum Demonstrator

Repository des abgeschlossenen Demonstrators:

`PustefixReisen/presseschau-feldkirchen-demo`

Seine Dokumente sind keine laufenden Primärquellen mehr. Er bleibt Referenz für historische Entscheidungen, Beispiele, Testfälle, visuelle Erfahrungen und zu migrierende Daten.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.3 | 06.10.2026 | Gründungsphase als abgeschlossen nachgezogen; U1 als aktive Umsetzungsphase und initiale Monorepo-/Paketstruktur dokumentiert. |
| 1.2 | 03.10.2026 | Projektstatus nach G2.5 aktualisiert: G2 und Transfer-Audit abgeschlossen, Dokumentationsübernahme erneut verifiziert, G3 aktiv. |
| 1.1 | 30.09.2026 | Dokumentationshoheit des Echtsystems, aktuelle Projektphase, neue Wissensstruktur und zentrale Dokumente aufgenommen. |
| 1.0 | 29.09.2026 | Projektbasis für das neue FIB-Echtsystem angelegt. |
