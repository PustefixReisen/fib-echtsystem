# FIB – Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Zweck

Dieses Repository enthält das neu aufzubauende Echtsystem von **„Feldkirchen im Blick (FIB)”**.

Der bisherige Demonstrator ist abgeschlossen und dient ausschließlich als historische, fachliche und visuelle Referenz. Er wird weder technisch noch dokumentarisch als Produktivbasis weiterentwickelt.

Die laufende Dokumentationshoheit liegt vollständig in diesem Repository.

## Aktuelle Phase

Das Projekt befindet sich in der **Projektgründungsphase**.

- G1 Produktumfang/MVP: abgeschlossen
- G2 UX/Informationsarchitektur/Fachfunktionen: in Arbeit, fachlich weitgehend konsolidiert
- Dokumentationsübernahme Demonstrator → Echtsystem: inhaltlich durchgeführt, Abschlussprüfung offen
- G3 Datenmodell und folgende Gründungspakete: noch ausstehend

Vor Beginn der technischen Umsetzung werden insbesondere Datenmodell, Schutzbedarf, Zielarchitektur, Rollen/Rechte, Betrieb, Migration und Go-live-Kriterien verbindlich geklärt. Danach folgt ein Gründungsaudit.

## Leitprinzipien

- so einfach wie möglich, aber so tragfähig wie nötig,
- persistenter Datenbestand statt Demonstrator-JSON,
- fachliche Regeln möglichst als technische Geschäftsregeln absichern,
- KI modellunabhängig einsetzen,
- **Meldung → Vorgang → Thema** als zentrale Wissensstruktur,
- Sitzung als Beratungs- und Entscheidungskontext,
- Sachinformation und „Unsere Einordnung“ klar trennen,
- „Mehr wissen?“ als kontextgebundene Vertiefung,
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
- Fachkonzept: `docs/Fachkonzept.md`
- Management Approach: `docs/FIB_Management-Approach.md`
- KI-Leitfaden: `docs/KI-Leitfaden.md`
- UX/Informationsarchitektur: `docs/UX-und-Informationsarchitektur.md`
- Übernahmematrix Demonstrator: `docs/Dokumentationsuebernahme-Demonstrator.md`

Weitere verbindliche Primärquellen sind in `docs/Dokumentation.md` aufgeführt.

Zentrale projektübergreifende Governance-Regeln liegen in `PustefixReisen/pustivo` und werden hier nur referenziert bzw. projektspezifisch ergänzt.

## Verhältnis zum Demonstrator

Repository des abgeschlossenen Demonstrators:

`PustefixReisen/presseschau-feldkirchen-demo`

Seine Dokumente sind **keine laufenden Primärquellen** mehr. Er bleibt Referenz für historische Entscheidungen, Beispiele, Testfälle, visuelle Erfahrungen und zu migrierende Daten.

## Technischer Stand

Noch keine Produktivprogrammierung. Architektur, Datenmodell und Stack werden erst nach Abschluss der jeweiligen Gründungspakete verbindlich festgelegt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 30.09.2026 | Dokumentationshoheit des Echtsystems, aktuelle Projektphase, neue Wissensstruktur und zentrale Dokumente aufgenommen; Übergabedokument als alleinige Ausgangsreferenz abgelöst. |
| 1.0 | 29.09.2026 | Projektbasis für das neue FIB-Echtsystem angelegt. |
