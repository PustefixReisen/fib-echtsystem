# KI-Betrieb und Kosten – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 02.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für die betriebliche und wirtschaftliche Nutzung von KI im FIB-Echtsystem.

Es trifft **keine dauerhafte Anbieter- oder Modellentscheidung**. Anbieter, Modelle und aktuelle Preise werden im Rahmen der technischen Zielarchitektur und des laufenden Qualitäts-/Kostenvergleichs bestimmt.

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
- Erkennung und Strukturierung von Wirkungen,
- Zuordnung zu Zielbereichen und Prüfkriterien,
- „Mehr wissen?“-Generierung,
- strukturierte Abwägung und „Unsere Einordnung“,
- Qualitätsprüfung und gezielte Recherche.

Formularstruktur, Fragemuster, Antwortoptionen, Prozessschritte und Zustandslogik gehören zur Anwendung selbst und verursachen keine KI-Kosten.

### Recherche

Bekannte Quellen werden soweit möglich direkt technisch erfasst. Kostenpflichtige KI-Websuche wird nur eingesetzt, wenn der eigene Quellenbestand nicht ausreicht oder zusätzliche Fach-/Rechts-/Wissenschafts-/Praxisquellen benötigt werden.

## 4. Kostenbegrenzungsprinzip

Zielarchitektur:

1. bekannte Quellen direkt abrufen,
2. Inhalte persistent speichern,
3. Änderungen technisch erkennen,
4. KI nur auf neue oder fachlich relevante Änderungen anwenden,
5. strukturierte Zwischenergebnisse persistent speichern und wiederverwenden,
6. vorbereitete Vertiefungsfragen und Antworten vorab erzeugen und speichern,
7. Antworten mit Informationsstand und Quellen versehen,
8. nur bei fachlichem Anlass neu erzeugen,
9. für jede FIB-Aufgabe nur die tatsächlich nötigen Kontextdaten an das Modell übergeben,
10. günstige geeignete Modelle für Routineaufgaben verwenden,
11. leistungsstärkere Modelle nur bei Qualitätsbedarf einsetzen,
12. Live-KI auf spätere freie Fragen und ausdrücklich angeforderte Redaktionstätigkeit begrenzen,
13. Budgets und Rate Limits technisch erzwingen.

Damit sollen Besucherzahlen weitgehend von KI-Kosten entkoppelt und redaktionelle KI-Kosten kontrollierbar gehalten werden.

## 5. Persistente KI-Ergebnisse

Gespeicherte KI-Ergebnisse erhalten mindestens:

- Erstellungszeitpunkt,
- Informationsstand,
- verwendete Quellen,
- bezogenes FIB-Objekt,
- Provider/Modell,
- zugeordnete FIB-Aufgabe bzw. KI-Leistungsklasse,
- Regel-/Prompt-Version, soweit relevant,
- redaktionellen Prüfstatus.

Eine erneute Prüfung wird ausgelöst, wenn sich relevante Quellen, Meldungen, Vorgänge, Themen oder Regeln ändern oder eine sachverhaltsabhängige Gültigkeit überschritten wird.

## 6. Kostenprotokollierung

Für KI-Aufrufe sollen intern mindestens erfasst werden:

- Zeitpunkt,
- FIB-Funktionsart,
- KI-Leistungsklasse,
- Provider und Modell,
- Ein-/Ausgabevolumen bzw. verfügbare Nutzungsmetriken,
- externe Tool-/Rechercheaufrufe,
- geschätzte bzw. gemeldete Kosten,
- Cache-/Wiederverwendungsstatus,
- technische Referenz auf das FIB-Objekt.

Personenbezogene Inhalte werden nicht unnötig in Kosten-/Telemetriedaten übernommen.

Die Kosten sollen nicht nur monatlich, sondern soweit sinnvoll auch pro FIB-Funktion und Vorgang auswertbar sein.

## 7. Budgetsteuerung

Vorzusehen sind:

- Monatsbudget,
- Warnschwellen,
- harte Kosten-/Nutzungslimits, soweit technisch möglich,
- optionale Kostenrahmen pro Vorgang oder FIB-Funktion,
- getrennte Auswertung nach Redaktion, Vorabgenerierung und späteren Besucher-Livefragen,
- Erkennung ungewöhnlicher Nutzung oder Fehlerloops.

## 8. Anbieter-/Modellvergleich

Die wirtschaftliche Entscheidung erfolgt nie nur über den Preis und nie nur über maximale Ergebnisqualität.

Gemeinsam bewertet werden:

- Faktentreue und FIB-Regeltreue,
- Quellenqualität,
- Kontextverständnis,
- Modellunabhängigkeit,
- Datenschutz und Datenresidenz,
- technische Integration,
- Betriebsstabilität,
- beobachtete reale Kosten am FIB-Testkorpus,
- erreichbare Qualität je FIB-Aufgabe im Verhältnis zu den dafür entstehenden Kosten.

Die Qualitäts- und Testregeln stehen in `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`.

## 9. KI-Leistungsklassen

FIB ordnet KI-Aufgaben zunächst fachlich einer Leistungsklasse zu, nicht direkt einem konkreten Modell.

Arbeitstitel:

- **Klasse A – Routine**,
- **Klasse B – Analyse**,
- **Klasse C – komplexe Bewertung**.

Die Klassen werden in `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` fachlich beschrieben. Welche konkreten Modelle diese Klassen erfüllen, wird durch Modelltests bestimmt und kann sich mit neuen Modellen, Preisen oder Erfahrungen ändern.

## 10. Routing-Matrix im laufenden Betrieb

Der produktive Betrieb verwendet eine konfigurierbare Routing-Matrix. Sie ordnet einer FIB-Aufgabe mindestens zu:

- erforderliche KI-Leistungsklasse,
- Standard-Provider und Standardmodell,
- zulässige Reasoning-/Leistungsstufe, soweit der Anbieter dies unterstützt,
- Kontext- bzw. Tokenrahmen,
- Erlaubnis für externe Recherche/Tools,
- Fallback- bzw. Hochstufungsregel,
- gegebenenfalls Kostenrahmen.

Beispielhafte Logik:

> **FIB-Aufgabe → KI-Leistungsklasse → Routing-Konfiguration → konkreter Provider / konkretes Modell**

Die Routing-Matrix ist Konfiguration und darf nicht als fest im Anwendungscode verdrahtete Zuordnung einzelner FIB-Aufgaben zu konkreten Modellnamen umgesetzt werden.

### 10.1 Hochstufung und Fallback

Eine Aufgabe kann an eine höhere Leistungsklasse weitergegeben werden, wenn beispielsweise:

- das Standardmodell relevante Unsicherheit meldet,
- Plausibilitätsprüfungen scheitern,
- strukturierte Ergebnisse widersprüchlich oder unvollständig sind,
- Quellenlage oder Zielkonflikte die für die Klasse vorgesehene Komplexität überschreiten.

Eine Hochstufung soll gezielt erfolgen und nicht dazu führen, dass vorsorglich alle Aufgaben mit dem teuersten Modell bearbeitet werden.

Ein Fallback kann außerdem einen anderen Provider bzw. ein anderes freigegebenes Modell derselben Klasse nutzen, wenn das Standardmodell technisch nicht verfügbar ist oder betriebliche Regeln dies verlangen.

### 10.2 Pflege der Routing-Matrix

Die Routing-Matrix wird nach neuen Modelltests, Preisänderungen, Qualitätsbeobachtungen oder Betriebserfahrungen angepasst.

Änderungen an der Routing-Matrix dürfen den fachlichen Redaktionsworkflow nicht verändern. Ein Modell- oder Providerwechsel soll aus Sicht des Redakteurs möglichst transparent bleiben.

## 11. Preisangaben

Konkrete Anbieterpreise sind zeitabhängig und werden **nicht als dauerhafte fachliche Regel** in diesem Dokument festgeschrieben.

Vor jeder Anbieterentscheidung wird eine aktuelle Preisaufnahme aus offiziellen Anbieterquellen erstellt und mit den FIB-Nutzungsprofilen gerechnet.

Die historischen Preisbeispiele des Demonstrators bleiben ausschließlich Referenzstand vom September 2026.

## 12. Nutzungsprofile für Vergleiche

Für Kostenvergleiche werden reproduzierbare FIB-Profile genutzt, mindestens:

- freie Besucherfrage mit externer Recherche,
- redaktionelle Überarbeitung ohne externe Recherche,
- Vorabgenerierung mehrerer „Mehr wissen?“-Antworten,
- automatische Analyse einer neu erkannten Fundstelle,
- Wirkungserkennung und Zuordnung zu Zielbereich/Prüfkriterien,
- komplexe strukturierte Abwägung.

Für jedes Profil werden Qualität und reale Kosten gemeinsam ausgewertet. Die Profile werden nach realen Betriebsdaten fortgeschrieben.

## 13. Abgrenzung

- KI-Qualität und Leistungsklassen: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
- operative KI-Regeln: `docs/KI-Leitfaden.md`
- Quellenmonitor: `docs/Recherche-und-Quellenmonitor.md`
- Datenschutz/Sicherheit: G4
- technische Architektur und Umsetzung der Routing-Schicht: G5
- Betrieb/Monitoring: G7

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 02.10.2026 | KI-Leistungsklassen und konfigurierbare Routing-Matrix für den laufenden Betrieb ergänzt; Modellvergleich explizit auf Qualitäts-Kosten-Verhältnis je FIB-Aufgabe ausgerichtet; Hochstufungs-, Fallback- und Kostenprotokollierungsregeln präzisiert. |
| 1.0 | 30.09.2026 | Demonstrator-Kostenmodell übernommen; zeitabhängige Preislisten aus der kanonischen Echtsystem-Regel entfernt und Betriebs-/Kostenprinzipien dauerhaft formuliert. |
