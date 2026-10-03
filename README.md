# FIB – Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Zweck

Dieses Repository enthält das neu aufzubauende Echtsystem von **„Feldkirchen im Blick (FIB)”**.

Der bisherige Demonstrator ist abgeschlossen und dient ausschließlich als historische, fachliche und visuelle Referenz. Er wird weder technisch noch dokumentarisch als Produktivbasis weiterentwickelt.

Die laufende Dokumentationshoheit liegt vollständig in diesem Repository.

## Aktuelle Phase

Das Projekt befindet sich in der **Projektgründungsphase**.

- G1 Produktumfang/MVP: abgeschlossen
- G2 UX/Informationsarchitektur/Fachfunktionen: abgeschlossen
- G2.5 Transfer-Audit Demonstrator → Echtsystem: abgeschlossen; Transfer-Gate bestanden
- Dokumentationsübernahme Demonstrator → Echtsystem: unter G2.5 erneut verifiziert und abgeschlossen
- G3 Datenanforderungen / Datenmodell: in Arbeit
- G4 bis G10 sowie Gründungsaudit: noch ausstehend bzw. geplant

Vor Beginn der technischen Umsetzung werden insbesondere Datenmodell, Schutzbedarf, Zielarchitektur, Rollen/Rechte, Betrieb, Migration und Go-live-Kriterien verbindlich geklärt. Danach folgt ein Gründungsaudit.

## Leitprinzipien

- so einfach wie möglich, aber so tragfähig wie nötig,
- persistenter Datenbestand statt Demonstrator-JSON,
- fachliche Regeln möglichst als technische Geschäftsregeln absichern,
- KI modellunabhängig einsetzen,
- **Ereignis → Meldung → Vorgang → Thema** als vereinfachte zentrale Wissensstruktur; konkrete Kardinalitäten im Datenmodell,
- Sitzung als Beratungs- und Entscheidungskontext,
- Sachinformation und „Unsere Einordnung“ klar trennen,
- Themenbestandteile über **Bedeutung für das Thema** (`prägend | relevant | ergänzend`) gewichten; keine eigene Wirkungsrollen-Taxonomie,
- „Mehr wissen?“ als kontextgebundene, quellengebundene Vertiefung,
- echtes Redaktionssystem mit Freigabeprozess,
- organisationsgebundene Produktivkonten,
- mindestens zwei technische Administratoren,
- PWA, Web Push, SEO, Erfolgsmessung und Kommunikation als Bestandteile des Zielsystems,
- digitaler und analoger Raum als gemeinsame Verbreitungslogik,
- Mobile First und WCAG 2.2 AA als technisches Ziel.

## Dokumentation

Zentrale Einstiegspunkte:

- Dokumentationslandkarte: `docs/Dokumentation.md`
- Projektgründung: `docs/Projektgruendung.md`
- Roadmap: `docs/Roadmap.md`
- Transfer-Audit: `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- Transfer-Regressionstests: `docs/Regressionstests-Demonstratortransfer.md`
- Fachkonzept: `docs/Fachkonzept.md`
- Management Approach: `docs/FIB_Management-Approach.md`
- KI-Leitfaden: `docs/KI-Leitfaden.md`
- Recherche/Quellenmonitor: `docs/Recherche-und-Quellenmonitor.md`
- UX/Informationsarchitektur: `docs/UX-und-Informationsarchitektur.md`
- Übernahmematrix Demonstrator: `docs/Dokumentationsuebernahme-Demonstrator.md`

Weitere verbindliche Primärquellen sind in `docs/Dokumentation.md` aufgeführt.

Zentrale projektübergreifende Governance-Regeln liegen in `PustefixReisen/pustivo` und werden hier nur referenziert bzw. projektspezifisch ergänzt.

## Verhältnis zum Demonstrator

Repository des abgeschlossenen Demonstrators:

`PustefixReisen/presseschau-feldkirchen-demo`

Seine Dokumente sind **keine laufenden Primärquellen** mehr. Er bleibt Referenz für historische Entscheidungen, Beispiele, Testfälle, visuelle Erfahrungen und zu migrierende Daten.

Erkenntnisse aus dem Demonstrator- und Testbetrieb wurden unter G2.5 erneut gegen das Echtsystem geprüft. Frühere FIB-Chats dienten dabei nur als Lückenfinder; verbindlich sind ausschließlich die geprüften und in diesem Repository dokumentierten Regeln.

## Technischer Stand

Noch keine Produktivprogrammierung. G3 konkretisiert derzeit das logische Datenmodell und den strukturierten Redaktionsstand. Architektur und Stack werden in G5 verbindlich festgelegt; technische Umsetzung beginnt erst nach abgeschlossenem Gründungsaudit.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 03.10.2026 | Projektstatus nach G2.5 aktualisiert: G2 und Transfer-Audit abgeschlossen, Dokumentationsübernahme erneut verifiziert, G3 aktiv; aktuelle Bedeutung-für-das-Thema- und Quellenlogik gespiegelt. |
| 1.1 | 30.09.2026 | Dokumentationshoheit des Echtsystems, aktuelle Projektphase, neue Wissensstruktur und zentrale Dokumente aufgenommen; Übergabedokument als alleinige Ausgangsreferenz abgelöst. |
| 1.0 | 29.09.2026 | Projektbasis für das neue FIB-Echtsystem angelegt. |
