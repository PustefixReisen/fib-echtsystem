# KI-Betrieb und Kosten – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für die betriebliche und wirtschaftliche Nutzung von KI im FIB-Echtsystem.

Es trifft **keine Anbieter- oder Modellentscheidung**. Anbieter, Modelle und aktuelle Preise werden erst im Rahmen der technischen Zielarchitektur und des Qualitätsvergleichs entschieden.

## 2. Betriebsverantwortung

Produktive Dienste dürfen nicht dauerhaft von privaten Konten einer einzelnen Person abhängen.

Zielbild:

- organisationskontrollierte Accounts für produktive Dienste,
- produktive API-Schlüssel und Secrets ausschließlich in kontrollierten Betriebsumgebungen,
- mindestens zwei administrativ handlungsfähige Personen,
- keine privaten Entwicklerkonten als Single Point of Failure,
- getrennte Entwicklungs-/Test- und Produktivzugänge.

Die konkrete Organisations- und Rechtegestaltung wird in G5–G7 festgelegt.

## 3. Wo KI-Kosten entstehen

### Öffentliche Nutzung

1. normales Lesen: keine KI-Kosten,
2. gespeicherte vorbereitete „Mehr wissen?“-Antwort: keine Kosten pro Abruf,
3. spätere freie Live-Frage: Modell- und ggf. Recherchekosten.

### Redaktion

Kosten entstehen insbesondere für:

- Analyse neuer Fundstellen,
- Entwürfe und Überarbeitungen,
- Vorgangs-/Themenzuordnung,
- Themenkandidaten und Wirkungsrollen,
- „Mehr wissen?“-Generierung,
- „Unsere Einordnung“,
- Qualitätsprüfung und gezielte Recherche.

### Recherche

Bekannte Quellen werden soweit möglich direkt technisch erfasst. Kostenpflichtige KI-Websuche wird nur eingesetzt, wenn der eigene Quellenbestand nicht ausreicht oder zusätzliche Fach-/Rechts-/Wissenschafts-/Praxisquellen benötigt werden.

## 4. Kostenbegrenzungsprinzip

Zielarchitektur:

1. bekannte Quellen direkt abrufen,
2. Inhalte persistent speichern,
3. Änderungen technisch erkennen,
4. KI nur auf neue oder fachlich relevante Änderungen anwenden,
5. vorbereitete Vertiefungsfragen und Antworten vorab erzeugen und speichern,
6. Antworten mit Informationsstand und Quellen versehen,
7. nur bei fachlichem Anlass neu erzeugen,
8. Live-KI auf spätere freie Fragen und ausdrücklich angeforderte Redaktionstätigkeit begrenzen,
9. Budgets und Rate Limits technisch erzwingen.

Damit sollen Besucherzahlen weitgehend von KI-Kosten entkoppelt werden.

## 5. Persistente KI-Ergebnisse

Gespeicherte KI-Ergebnisse erhalten mindestens:

- Erstellungszeitpunkt,
- Informationsstand,
- verwendete Quellen,
- bezogenes FIB-Objekt,
- Provider/Modell,
- Regel-/Prompt-Version, soweit relevant,
- redaktionellen Prüfstatus.

Eine erneute Prüfung wird ausgelöst, wenn sich relevante Quellen, Meldungen, Vorgänge, Themen oder Regeln ändern oder eine sachverhaltsabhängige Gültigkeit überschritten wird.

## 6. Kostenprotokollierung

Für KI-Aufrufe sollen intern mindestens erfasst werden:

- Zeitpunkt,
- Funktionsart,
- Provider und Modell,
- Ein-/Ausgabevolumen bzw. verfügbare Nutzungsmetriken,
- externe Tool-/Rechercheaufrufe,
- geschätzte bzw. gemeldete Kosten,
- Cache-/Wiederverwendungsstatus,
- technische Referenz auf das FIB-Objekt.

Personenbezogene Inhalte werden nicht unnötig in Kosten-/Telemetriedaten übernommen.

## 7. Budgetsteuerung

Vorzusehen sind:

- Monatsbudget,
- Warnschwellen,
- harte Kosten-/Nutzungslimits, soweit technisch möglich,
- getrennte Auswertung nach Redaktion, Vorabgenerierung und späteren Besucher-Livefragen,
- Erkennung ungewöhnlicher Nutzung oder Fehlerloops.

## 8. Anbieter-/Modellvergleich

Die wirtschaftliche Entscheidung erfolgt nie nur über den Preis.

Gemeinsam bewertet werden:

- Faktentreue und FIB-Regeltreue,
- Quellenqualität,
- Kontextverständnis,
- Modellunabhängigkeit,
- Datenschutz und Datenresidenz,
- technische Integration,
- Betriebsstabilität,
- beobachtete reale Kosten am FIB-Testkorpus.

Die Qualitätsregeln stehen in `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`.

## 9. Preisangaben

Konkrete Anbieterpreise sind zeitabhängig und werden **nicht als dauerhafte fachliche Regel** in diesem Dokument festgeschrieben.

Vor jeder Anbieterentscheidung wird eine aktuelle Preisaufnahme aus offiziellen Anbieterquellen erstellt und mit den FIB-Nutzungsprofilen gerechnet.

Die historischen Preisbeispiele des Demonstrators bleiben ausschließlich Referenzstand vom September 2026.

## 10. Nutzungsprofile für Vergleiche

Für Kostenvergleiche werden reproduzierbare FIB-Profile genutzt, mindestens:

- freie Besucherfrage mit externer Recherche,
- redaktionelle Überarbeitung ohne externe Recherche,
- Vorabgenerierung mehrerer „Mehr wissen?“-Antworten,
- automatische Analyse einer neu erkannten Fundstelle.

Die Profile werden nach realen Betriebsdaten fortgeschrieben.

## 11. Abgrenzung

- KI-Qualität: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
- operative KI-Regeln: `docs/KI-Leitfaden.md`
- Quellenmonitor: `docs/Recherche-und-Quellenmonitor.md`
- Datenschutz/Sicherheit: G4
- technische Architektur: G5
- Betrieb/Monitoring: G7

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 30.09.2026 | Demonstrator-Kostenmodell übernommen; zeitabhängige Preislisten aus der kanonischen Echtsystem-Regel entfernt und Betriebs-/Kostenprinzipien dauerhaft formuliert. |
