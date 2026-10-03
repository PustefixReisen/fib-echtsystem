# KI-Qualität und Modellunabhängigkeit – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Ziel

FIB soll fachlich und technisch so weit wie sinnvoll **unabhängig vom jeweils eingesetzten KI-Modell und Anbieter** funktionieren.

Ziel ist nicht vollständige Modellunabhängigkeit um jeden Preis, sondern eine möglichst geringe, transparente und prüfbare Modellabhängigkeit.

Leitsatz:

> **Die FIB-Logik gehört dem System – nicht einem bestimmten KI-Modell.**

Für den KI-Einsatz gilt zusätzlich:

> **Kosteneffizienz bedeutet zuerst, KI nur dort einzusetzen, wo sie fachlich erforderlich ist oder einen klaren zusätzlichen Nutzen bringt. Wird KI eingesetzt, hat die erforderliche Ergebnisqualität Vorrang vor dem niedrigsten Preis. Kosten werden erst innerhalb der Lösungen optimiert, die die festgelegte Qualitätsanforderung zuverlässig erfüllen.**

## 2. Drei Ebenen der Logik

### 2.1 Modellunabhängige Geschäftsregeln

Soweit möglich außerhalb des Modells technisch absichern, insbesondere:

- stabile IDs und Persistenz,
- Pflichtfelder und Statuswerte,
- Datumsarten und Datumslogik,
- Vorlage versus Beschluss,
- Quellenpflicht,
- Freigabestatus,
- Versions- und Änderungslogik,
- Objektbeziehungen und Aliase,
- technische Linkprüfungen,
- Sichtbarkeits- und Veröffentlichungsregeln,
- Redaktionsworkflow, Formularstruktur, Fragemuster und Antwortoptionen.

### 2.2 Explizite KI-Regeln

Semantische Aufgaben werden durch dokumentierte, modellübergreifend formulierte Regeln gesteuert, insbesondere:

- Relevanzprüfung für Feldkirchen,
- Ereignis versus Aktualisierung,
- Vorgangszuordnung,
- Themenkandidaten,
- Erkennung und Trennung von Wirkungen,
- Zuordnung zu Zielbereichen und Prüfkriterien,
- Auswahl von Hintergrundquellen,
- „Mehr wissen?“-Fragen,
- sprachliche Regeln,
- „Unsere Einordnung“.

### 2.3 Modellurteil

Ein Restbereich bleibt semantisches Urteil. Auch dort gilt: dokumentierte Kriterien, Quellenbindung und redaktionelle Nachvollziehbarkeit.

Beispiele:

- substanzieller oder beiläufiger Orts-/Objektbezug,
- gleicher oder unterschiedlicher Vorgang,
- konkrete Relevanz eines externen Beispiels,
- Auswahl wesentlicher Aspekte umfangreicher Unterlagen,
- verständliche Verdichtung komplexer Sachverhalte,
- fallbezogene Abwägung mehrerer Wirkungen und Zielkonflikte.

## 3. Grundsatz für neue Funktionen

Bei jeder neuen Funktion wird in dieser Reihenfolge geprüft:

1. Kann sie deterministisch als Geschäftsregel umgesetzt werden?
2. Falls nein: Kann sie als explizite modellübergreifende KI-Regel beschrieben werden?
3. Ist KI für diesen Arbeitsschritt überhaupt fachlich erforderlich oder bringt sie einen klaren zusätzlichen Nutzen?
4. Welcher Rest bleibt echtes Modellurteil?
5. Welche strukturierten Daten, Gründe und Testfälle sichern Nachvollziehbarkeit?

Bevorzugte Reihenfolge:

> **Geschäftsregel → explizite KI-Regel → Modellurteil**

## 4. Regressionstestkorpus

Mindestens folgende FIB-Referenzfälle werden dauerhaft gepflegt:

- Hundewiese: Vorgang, nicht automatisch Thema,
- Kiesgrund: unbekannter bedeutender Vorgang muss durch themenunabhängige Entdeckung auffindbar sein,
- Autobahnkreuz München-Ost: komplexer Vorgang mit mehreren Wirkungen und Zielkonflikten,
- Radwegenetz: Gestaltungsoptionen und mehrere Zielbereiche,
- einzelne Sperrung/Umleitung: begrenzte Wirkung ohne automatische Übergewichtung,
- RIS-Vorlage mit späterem Beschluss,
- externer Inhalt mit mittelbarer Relevanz,
- Aliasfall Straße/Infrastruktur,
- Beitrag mit „Unsere Einordnung“,
- „Mehr wissen?“-Fall mit mehreren sinnvollen Fragen,
- Vertiefungsantwort mit lokaler Quelle plus Fach-/Rechtsrahmen,
- Fall, bei dem mangels belastbarer Quellen eine Antwort offen bleiben muss.

## 5. Bewertungsdimensionen

Modellvergleiche prüfen mindestens:

1. Faktentreue,
2. Aussage-Quellen-Deckung,
3. Quellenpräzision und Quellenfunktion,
4. Vollständigkeit,
5. Umgang mit Unsicherheit,
6. Trennung Sachinformation / Position / Einordnung,
7. Feldkirchen-Bezug und Kontextverständnis,
8. Ereignis-/Vorgangs-/Themenlogik,
9. Erkennung und Trennung von Wirkungen,
10. Zuordnung zu Zielbereichen und Prüfkriterien,
11. Datums- und Sitzungslogik,
12. Fragequalität und Nicht-Redundanz bei „Mehr wissen?“,
13. Verständlichkeit und Regeltreue,
14. Konsistenz strukturierter Abwägungen,
15. technische Eignung für strukturierte Ein-/Ausgaben,
16. tatsächliche Kosten für die jeweilige FIB-Aufgabe.

Kritische fachliche Fehler dürfen nicht durch gute Durchschnittswerte verdeckt werden.

## 6. Durchführung von Modellvergleichen

Für einen fairen Vergleich erhalten Modelle möglichst denselben:

- Ausgangsinhalt,
- FIB-Kontext,
- Quellenbestand,
- Informationsstand,
- Regelstand,
- erwartete Pflichtaussagen und bekannte Fehlerfallen.

Wo praktikabel, werden Ergebnisse ohne sichtbare Modellbezeichnung redaktionell beurteilt.

Ein Modell gilt nicht allein wegen sprachlich ansprechender Texte als geeignet. Maßgeblich ist die reproduzierbare Erfüllung der FIB-Regeln.

### 6.1 Qualität und Kosten gemeinsam bewerten

Der Modellvergleich dient nicht der Suche nach einem einzigen allgemein „besten“ Modell. Bewertet wird je FIB-Aufgabentyp, welche Modelle die festgelegte Qualitätsanforderung zuverlässig erfüllen und welche davon wirtschaftlich sinnvoll betrieben werden können.

Die Reihenfolge ist verbindlich:

1. fachliche Qualitätsanforderung je FIB-Aufgabe festlegen,
2. Modelle gegen diese Mindestanforderung testen,
3. ungeeignete Modelle unabhängig vom Preis ausschließen,
4. erst unter den fachlich geeigneten Modellen Kosten, Geschwindigkeit, Betriebsstabilität und weitere Kriterien vergleichen.

Dazu werden für jeden relevanten Aufgabentyp mindestens gemeinsam betrachtet:

- erreichte fachliche Qualität,
- Fehler- und Unsicherheitsverhalten,
- Reproduzierbarkeit und Konsistenz,
- Eignung für strukturierte Ausgaben,
- Geschwindigkeit, soweit betrieblich relevant,
- Input-/Output-Volumen,
- zusätzliche Recherche-/Toolkosten,
- beobachtete Gesamtkosten pro typischem FIB-Fall.

Ein günstigeres Modell wird nur dann bevorzugt, wenn es die für die konkrete Aufgabe festgelegte Qualitätsanforderung zuverlässig erfüllt. Bei qualitätskritischen Aufgaben – insbesondere Quellenentdeckung, Ereigniserkennung und Erstbewertung – darf eine Kostenersparnis nicht durch höhere fachliche Ausfall- oder Fehlerrisiken erkauft werden.

### 6.2 Vergleich nach FIB-Aufgaben statt nach Modellnamen

Modelle werden auf konkrete FIB-Aufgaben abgebildet, zum Beispiel:

- neue Quellen entdecken,
- neue oder geänderte Fundstellen semantisch analysieren,
- Ereigniskandidaten erkennen,
- Dokumentinformationen extrahieren,
- Wirkungen erkennen und trennen,
- Zielbereiche vorschlagen,
- Prüfkriterien auswählen,
- Tragweite oder Verlässlichkeit einschätzen,
- Gestaltungsoptionen vorschlagen,
- komplexe Abwägungen erstellen,
- Einordnungstexte aus strukturiertem Stand formulieren,
- Konsistenz- und Plausibilitätsprüfungen durchführen.

Dadurch kann dasselbe Modell für einzelne Aufgaben geeignet und für andere ungeeignet sein.

## 7. KI-Leistungsklassen und Routing-Grundsatz

FIB verwendet fachlich definierte KI-Leistungsklassen statt fest verdrahteter Modellnamen. Die Klassen beschreiben die für einen Aufgabentyp erforderliche Leistungsstufe, nicht einen bestimmten Anbieter.

Arbeitstitel:

- **Klasse A – Routine**: stark strukturierte, relativ klar begrenzte Aufgaben,
- **Klasse B – Analyse**: anspruchsvollere semantische Analyse mit mehreren Abhängigkeiten,
- **Klasse C – komplexe Bewertung**: besonders anspruchsvolle Abwägungs-, Konsistenz- oder Konfliktfälle.

Die konkrete Zuordnung eines Providers und Modells zu einer Leistungsklasse erfolgt konfigurierbar und basiert auf dem aktuellen Modellvergleich.

Ein Anbieter- oder Modellwechsel soll daher nach Möglichkeit nur die Routing-Konfiguration ändern, nicht den fachlichen Workflow.

## 8. Qualitäts- und Architekturprüfung

Bei Audits wird geprüft:

- welche Ergebnisse noch vom Modellverhalten abhängen,
- ob diese Abhängigkeit notwendig ist,
- ob Regeln in Datenmodell oder Workflow verschoben werden können,
- ob KI-Regeln ausreichend konkret sind,
- ob für kritische Regeln Testfälle existieren,
- ob Entscheidungen strukturiert nachvollziehbar bleiben,
- ob die zugeordnete KI-Leistungsklasse noch angemessen ist,
- ob ein wirtschaftlicheres Modell die geforderte Qualität inzwischen ebenfalls zuverlässig erreicht.

## 9. Modellwechsel

Ein produktiver Modell- oder Anbieterwechsel erfolgt erst nach erfolgreichem Vergleich gegen den aktuellen Testkorpus.

Die Auswahl berücksichtigt neben Qualität auch:

- Datenschutz und Datenresidenz,
- technische Integrationsfähigkeit,
- Betriebsstabilität,
- tatsächliche Kosten,
- Anbieterabhängigkeit.

Ein Modellwechsel darf nicht dazu führen, dass FIB-Formulare, Prozesslogik oder fachliche Regeln an ein bestimmtes Modell angepasst werden müssen.

## 10. Dokumentationspflicht

Wird festgestellt, dass eine zentrale FIB-Regel nur durch implizites Modellverhalten funktioniert, wird dies als Qualitäts- und Architekturrisiko dokumentiert und nach Möglichkeit in eine explizite Regel, Datenstruktur, Validierung oder einen Regressionstest überführt.

Ergebnisse von Modellvergleichen sollen so dokumentiert werden, dass erkennbar bleibt, warum ein Modell für eine bestimmte FIB-Aufgabe bzw. Leistungsklasse freigegeben wurde.

## 11. Abgrenzung

- operative KI-Arbeitsregeln: `docs/KI-Leitfaden.md`
- Fachlichkeit: `docs/Fachkonzept.md`
- Kosten/Betrieb und Routing-Matrix: `docs/KI-Betrieb-und-Kosten.md`
- technische Umsetzung der KI-Schicht: G5

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 03.10.2026 | Kostenprinzip präzisiert: KI zunächst vermeiden, wenn sie fachlich nicht erforderlich ist; bei erforderlichem KI-Einsatz gilt die Qualitätsanforderung als Ausschlusskriterium vor der Kostenoptimierung. Quellenentdeckung und Ereigniserkennung als qualitätskritische Aufgaben ergänzt. |
| 1.1 | 02.10.2026 | Modellvergleich auf konkrete FIB-Aufgaben ausgerichtet; Qualität und reale Kosten gemeinsam als Auswahlkriterium festgelegt; KI-Leistungsklassen als modellunabhängige Grundlage für das spätere Routing ergänzt. |
| 1.0 | 30.09.2026 | Demonstrator-Dokument `FIB_Modellunabhaengigkeit_und_Qualitaetspruefung.md` auf aktuelle Echtsystem-Logik und Referenzfälle konsolidiert. |
