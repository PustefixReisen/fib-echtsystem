# KI-Betrieb und Kosten – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

### Redaktion und Recherche: Hybridprinzip

FIB unterscheidet drei Arten von KI-Einsatz:

1. **verpflichtende Entdeckungs-/Eingangs-KI** für Aufgaben, die ohne semantische KI nicht zuverlässig automatisiert werden können,
2. **bedarfsgesteuerte Recherche-KI** für konkrete Wissenslücken oder offene Recherchefragen,
3. **optionale Redaktions-KI** für Komfort, Zeitersparnis und Formulierungshilfe.

Verpflichtende KI-Kosten entstehen insbesondere für:

- aktive Entdeckung bislang unbekannter relevanter Quellen,
- semantische Analyse neuer oder geänderter Fundstellen,
- Erkennung möglicher relevanter Ereignisse,
- Vorschlag „neues Ereignis oder Aktualisierung“,
- erste Einordnung zu bestehendem oder möglichem neuem Vorgang, soweit dies für den Ereigniskandidaten erforderlich ist.

Bedarfsgesteuerte oder optionale KI-Kosten können entstehen für:

- gezielte Rechercheaufträge bei Wissenslücken,
- Erkennung und Strukturierung von Wirkungen,
- Zuordnung zu Zielbereichen und Prüfkriterien,
- „Mehr wissen?“-Generierung,
- strukturierte Abwägung und „Unsere Einordnung“,
- Qualitätsprüfung und semantische Plausibilitätsprüfung,
- Textentwürfe und Überarbeitungen.

Formularstruktur, Fragemuster, Antwortoptionen, Prozessschritte, Zustandslogik, technische Validierungen und die Anzeige des strukturierten Redaktionsstands gehören zur Anwendung selbst und verursachen keine KI-Kosten.

## 4. Kostenprinzip

Kosteneffizienz bedeutet bei FIB nicht, für eine notwendige KI-Aufgabe möglichst das billigste Modell einzusetzen.

Verbindliche Reihenfolge:

1. **Prüfen, ob KI für den Arbeitsschritt überhaupt erforderlich ist.**
2. Wenn nein: Aufgabe technisch oder redaktionell ohne KI erledigen.
3. Wenn ja: erforderliche Ergebnisqualität festlegen.
4. Nur Modelle einsetzen, die diese Qualitätsanforderung im FIB-Test nachweislich erfüllen.
5. Erst unter den geeigneten Modellen Kosten und weitere Betriebskriterien optimieren.

Für die qualitätskritische Eingangskette – Quellenentdeckung, Fundstellenanalyse und Ereigniserkennung – steht die Ergebnisqualität an erster Stelle, weil FIB von der Vollständigkeit und Verlässlichkeit dieses Inputs abhängig ist.

## 5. Kostenbegrenzungsprinzip

Zielarchitektur:

1. bekannte Quellen direkt und möglichst ohne KI abrufen,
2. Inhalte persistent speichern,
3. Änderungen technisch erkennen,
4. bei unveränderten bekannten Quellen keine KI aufrufen,
5. nur neue oder fachlich relevante Änderungen semantisch analysieren,
6. neue Quellen in geeigneten Intervallen aktiv KI-gestützt suchen,
7. strukturierte Zwischenergebnisse persistent speichern und wiederverwenden,
8. vorbereitete Vertiefungsfragen und Antworten vorab erzeugen und speichern, soweit sie im jeweiligen Ausbaustand eingesetzt werden,
9. Antworten mit Informationsstand und Quellen versehen,
10. nur bei fachlichem Anlass neu erzeugen,
11. für jede FIB-Aufgabe nur die tatsächlich nötigen Kontextdaten an das Modell übergeben,
12. optionale KI-Unterstützung nur dort auslösen, wo sie redaktionell benötigt oder bewusst angefordert wird,
13. Budgets und Rate Limits technisch erzwingen.

Damit sollen Besucherzahlen weitgehend von KI-Kosten entkoppelt und die zwingenden API-Kosten auf die semantisch erforderlichen Eingangsfunktionen konzentriert werden.

## 6. Persistente KI-Ergebnisse

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

## 7. Kostenprotokollierung

Für KI-Aufrufe sollen intern mindestens erfasst werden:

- Zeitpunkt,
- FIB-Funktionsart,
- Kategorie verpflichtend / bedarfsgesteuert / optional,
- KI-Leistungsklasse,
- Provider und Modell,
- Ein-/Ausgabevolumen bzw. verfügbare Nutzungsmetriken,
- externe Tool-/Rechercheaufrufe,
- geschätzte bzw. gemeldete Kosten,
- Cache-/Wiederverwendungsstatus,
- technische Referenz auf das FIB-Objekt.

Personenbezogene Inhalte werden nicht unnötig in Kosten-/Telemetriedaten übernommen.

Die Kosten sollen nicht nur monatlich, sondern soweit sinnvoll auch pro FIB-Funktion, Vorgang und KI-Kategorie auswertbar sein.

## 8. Vorläufiger monatlicher Planungsrahmen

Bis reale Betriebsdaten aus Pilot und Echtsystem vorliegen, wird für die Entwicklungs- und Managementplanung mit einem bewusst gerundeten Kostenkorridor gearbeitet.

### 8.1 Annahmen

Der Planungsrahmen setzt voraus:

- bekannte Quellen werden technisch überwacht und nur bei Änderungen an KI übergeben,
- die aktive Quellenentdeckung läuft periodisch und nicht permanent,
- Analyseergebnisse werden persistent wiederverwendet,
- die verpflichtenden Eingangsfunktionen werden mit ausreichend qualifizierten Modellen ausgeführt,
- optionale Redaktions-KI wird nur bei tatsächlichem Bedarf eingesetzt,
- keine Besucher-Live-KI im MVP.

### 8.2 Planungswerte

| Kostenbereich | vorläufiger Normalbetrieb pro Monat |
|---|---:|
| verpflichtende Quellenentdeckung und Eingangsanalyse | **ca. 3–8 €** |
| bedarfsgesteuerte/optionale Redaktions-KI | **ca. 0–5 € zusätzlich** |
| erwarteter Gesamtkorridor | **ca. 3–13 €** |
| vorläufiger Planungs-/Warnrahmen | **15 € / Monat** |

Diese Werte sind **keine Preiszusage und kein festes Budget**. Sie sind eine Entwicklungsannahme auf Basis des derzeit erwarteten kleinen kommunalen Recherchevolumens und der aktuellen API-Preisgrößen. Vor Go-live werden sie mit dem FIB-Testkorpus und anschließend mit realen Betriebsdaten neu kalibriert.

Der wirtschaftliche Erfolg der Hybridarchitektur wird daran gemessen, ob die verpflichtende KI zuverlässig hohe Eingangsqualität liefert, während vermeidbare KI-Aufrufe tatsächlich unterbleiben.

## 9. Budgetsteuerung

Vorzusehen sind:

- Monatsbudget,
- Warnschwellen,
- harte Kosten-/Nutzungslimits, soweit technisch möglich,
- optionale Kostenrahmen pro Vorgang oder FIB-Funktion,
- getrennte Auswertung nach verpflichtender Eingangsanalyse, bedarfsgesteuerter Recherche, optionaler Redaktionsassistenz und späteren Besucher-Livefragen,
- Erkennung ungewöhnlicher Nutzung oder Fehlerloops.

Der vorläufige Planungs-/Warnrahmen aus Abschnitt 8 wird vor Go-live durch einen auf Pilotmessungen gestützten Wert ersetzt.

## 10. Anbieter-/Modellvergleich

Die wirtschaftliche Entscheidung erfolgt nie nur über den Preis und nie nur über maximale Ergebnisqualität ohne Bezug zur konkreten Aufgabe.

Verbindlich ist:

- zuerst Qualitätsanforderung je FIB-Aufgabe bestimmen,
- nur Modelle berücksichtigen, die diese Anforderung zuverlässig erfüllen,
- danach unter den geeigneten Modellen Kosten und Betriebsmerkmale vergleichen.

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

## 11. KI-Leistungsklassen

FIB ordnet KI-Aufgaben zunächst fachlich einer Leistungsklasse zu, nicht direkt einem konkreten Modell.

Arbeitstitel:

- **Klasse A – Routine**,
- **Klasse B – Analyse**,
- **Klasse C – komplexe Bewertung**.

Die Klassen werden in `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` fachlich beschrieben. Welche konkreten Modelle diese Klassen erfüllen, wird durch Modelltests bestimmt und kann sich mit neuen Modellen, Preisen oder Erfahrungen ändern.

## 12. Routing-Matrix im laufenden Betrieb

Der produktive Betrieb verwendet eine konfigurierbare Routing-Matrix. Sie ordnet einer FIB-Aufgabe mindestens zu:

- ob KI verpflichtend, bedarfsgesteuert oder optional ist,
- erforderliche KI-Leistungsklasse,
- Standard-Provider und Standardmodell,
- zulässige Reasoning-/Leistungsstufe, soweit der Anbieter dies unterstützt,
- Kontext- bzw. Tokenrahmen,
- Erlaubnis für externe Recherche/Tools,
- Fallback- bzw. Hochstufungsregel,
- gegebenenfalls Kostenrahmen.

Beispielhafte Logik:

> **FIB-Aufgabe → KI-Bedarf → Qualitätsanforderung/KI-Leistungsklasse → Routing-Konfiguration → konkreter Provider / konkretes Modell**

Die Routing-Matrix ist Konfiguration und darf nicht als fest im Anwendungscode verdrahtete Zuordnung einzelner FIB-Aufgaben zu konkreten Modellnamen umgesetzt werden.

### 12.1 Hochstufung und Fallback

Eine Aufgabe kann an eine höhere Leistungsklasse weitergegeben werden, wenn beispielsweise:

- das Standardmodell relevante Unsicherheit meldet,
- Plausibilitätsprüfungen scheitern,
- strukturierte Ergebnisse widersprüchlich oder unvollständig sind,
- Quellenlage oder Zielkonflikte die für die Klasse vorgesehene Komplexität überschreiten.

Eine Hochstufung soll gezielt erfolgen und nicht dazu führen, dass vorsorglich alle Aufgaben mit dem leistungsstärksten Modell bearbeitet werden.

Ein Fallback kann außerdem einen anderen Provider bzw. ein anderes freigegebenes Modell derselben Klasse nutzen, wenn das Standardmodell technisch nicht verfügbar ist oder betriebliche Regeln dies verlangen.

### 12.2 Pflege der Routing-Matrix

Die Routing-Matrix wird nach neuen Modelltests, Preisänderungen, Qualitätsbeobachtungen oder Betriebserfahrungen angepasst.

Änderungen an der Routing-Matrix dürfen den fachlichen Redaktionsworkflow nicht verändern. Ein Modell- oder Providerwechsel soll aus Sicht des Redakteurs möglichst transparent bleiben.

## 13. Preisangaben

Konkrete Anbieterpreise sind zeitabhängig und werden **nicht als dauerhafte fachliche Regel** in diesem Dokument festgeschrieben.

Vor jeder Anbieterentscheidung wird eine aktuelle Preisaufnahme aus offiziellen Anbieterquellen erstellt und mit den FIB-Nutzungsprofilen gerechnet.

Für die Planungsrechnung vom 03.10.2026 wurden die aktuellen offiziellen API-Preisgrößen als Plausibilitätsgrundlage herangezogen. Der Planungsrahmen wird bewusst in Euro gerundet und ist nicht an einen einzelnen Anbieter oder ein einzelnes Modell gebunden.

## 14. Nutzungsprofile für Vergleiche

Für Kostenvergleiche werden reproduzierbare FIB-Profile genutzt, mindestens:

- aktive Entdeckung neuer Quellen,
- automatische Analyse einer neu erkannten oder geänderten Fundstelle,
- Ereigniserkennung einschließlich Ereignis/Update-Vorschlag,
- gezielte Recherche bei einer Wissenslücke,
- redaktionelle Überarbeitung ohne externe Recherche,
- Vorabgenerierung mehrerer „Mehr wissen?“-Antworten,
- Wirkungserkennung und Zuordnung zu Zielbereich/Prüfkriterien,
- komplexe strukturierte Abwägung.

Für jedes Profil werden Qualität und reale Kosten gemeinsam ausgewertet. Die Profile werden nach realen Betriebsdaten fortgeschrieben.

## 15. Abgrenzung

- KI-Qualität und Leistungsklassen: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
- operative KI-Regeln: `docs/KI-Leitfaden.md`
- Quellenmonitor: `docs/Recherche-und-Quellenmonitor.md`
- Datenschutz/Sicherheit: G4
- technische Architektur und Umsetzung der Routing-Schicht: G5
- Betrieb/Monitoring: G7

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 03.10.2026 | Hybridprinzip verbindlich eingeführt: verpflichtende Entdeckungs-/Eingangs-KI, bedarfsgesteuerte Recherche-KI und optionale Redaktions-KI; Kostenprinzip auf „KI nur wo nötig, dann Qualität vor Preis“ umgestellt; vorläufigen monatlichen Planungsrahmen 3–13 € und Warnrahmen 15 € ergänzt. |
| 1.1 | 02.10.2026 | KI-Leistungsklassen und konfigurierbare Routing-Matrix für den laufenden Betrieb ergänzt; Modellvergleich explizit auf Qualitäts-Kosten-Verhältnis je FIB-Aufgabe ausgerichtet; Hochstufungs-, Fallback- und Kostenprotokollierungsregeln präzisiert. |
| 1.0 | 30.09.2026 | Demonstrator-Kostenmodell übernommen; zeitabhängige Preislisten aus der kanonischen Echtsystem-Regel entfernt und Betriebs-/Kostenprinzipien dauerhaft formuliert. |
