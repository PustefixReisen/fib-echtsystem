# KI-Qualität und Modellunabhängigkeit – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Ziel

FIB soll fachlich und technisch so weit wie sinnvoll **unabhängig vom jeweils eingesetzten KI-Modell und Anbieter** funktionieren.

Ziel ist nicht vollständige Modellunabhängigkeit um jeden Preis, sondern eine möglichst geringe, transparente und prüfbare Modellabhängigkeit.

Leitsatz:

> **Die FIB-Logik gehört dem System – nicht einem bestimmten KI-Modell.**

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
- Sichtbarkeits- und Veröffentlichungsregeln.

### 2.2 Explizite KI-Regeln

Semantische Aufgaben werden durch dokumentierte, modellübergreifend formulierte Regeln gesteuert, insbesondere:

- Relevanzprüfung für Feldkirchen,
- Ereignis versus Aktualisierung,
- Vorgangszuordnung,
- Themenkandidaten und Wirkungsrollen,
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
- verständliche Verdichtung komplexer Sachverhalte.

## 3. Grundsatz für neue Funktionen

Bei jeder neuen Funktion wird in dieser Reihenfolge geprüft:

1. Kann sie deterministisch als Geschäftsregel umgesetzt werden?
2. Falls nein: Kann sie als explizite modellübergreifende KI-Regel beschrieben werden?
3. Welcher Rest bleibt echtes Modellurteil?
4. Welche strukturierten Daten, Gründe und Testfälle sichern Nachvollziehbarkeit?

Bevorzugte Reihenfolge:

> **Geschäftsregel → explizite KI-Regel → Modellurteil**

## 4. Regressionstestkorpus

Mindestens folgende FIB-Referenzfälle werden dauerhaft gepflegt:

- Hundewiese: Vorgang, nicht automatisch Thema,
- Kiesgrund: unbekannter bedeutender Vorgang muss durch themenunabhängige Entdeckung auffindbar sein,
- Autobahnkreuz München-Ost: möglicher prägender Treiber,
- Radwegenetz: Gestaltungsbeitrag,
- einzelne Sperrung/Umleitung: Betroffenheit/Auswirkung,
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
9. Wirkungsrollen,
10. Datums- und Sitzungslogik,
11. Fragequalität und Nicht-Redundanz bei „Mehr wissen?“,
12. Verständlichkeit und Regeltreue.

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

## 7. Qualitäts- und Architekturprüfung

Bei Audits wird geprüft:

- welche Ergebnisse noch vom Modellverhalten abhängen,
- ob diese Abhängigkeit notwendig ist,
- ob Regeln in Datenmodell oder Workflow verschoben werden können,
- ob KI-Regeln ausreichend konkret sind,
- ob für kritische Regeln Testfälle existieren,
- ob Entscheidungen strukturiert nachvollziehbar bleiben.

## 8. Modellwechsel

Ein produktiver Modell- oder Anbieterwechsel erfolgt erst nach erfolgreichem Vergleich gegen den aktuellen Testkorpus.

Die Auswahl berücksichtigt neben Qualität auch:

- Datenschutz und Datenresidenz,
- technische Integrationsfähigkeit,
- Betriebsstabilität,
- tatsächliche Kosten,
- Anbieterabhängigkeit.

## 9. Dokumentationspflicht

Wird festgestellt, dass eine zentrale FIB-Regel nur durch implizites Modellverhalten funktioniert, wird dies als Qualitäts- und Architekturrisiko dokumentiert und nach Möglichkeit in eine explizite Regel, Datenstruktur, Validierung oder einen Regressionstest überführt.

## 10. Abgrenzung

- operative KI-Arbeitsregeln: `docs/KI-Leitfaden.md`
- Fachlichkeit: `docs/Fachkonzept.md`
- Kosten/Betrieb: `docs/KI-Betrieb-und-Kosten.md`
- technische Umsetzung der KI-Schicht: G5

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 30.09.2026 | Demonstrator-Dokument `FIB_Modellunabhaengigkeit_und_Qualitaetspruefung.md` auf aktuelle Echtsystem-Logik und Referenzfälle konsolidiert. |
