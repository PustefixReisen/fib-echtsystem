# G2.5 – Transfer-Audit Inhaltsbausteine & Redaktionsfunktionen

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Anlass

Der erste Transfer-Audit Demonstrator → Echtsystem hat vor allem fachliche Regeln, Recherchelogik, Persistenzanforderungen und zentrale UX-Grundsätze geprüft. Eine erneute Gegenprüfung am 04.10.2026 zeigte, dass einzelne im Demonstrator sichtbare Inhaltsbausteine und redaktionelle Funktionen nicht als eigene Prüfpunkte inventarisiert worden waren.

Dieser zweite Audit ergänzt deshalb ausdrücklich die Perspektive:

> **Welche sichtbaren Inhaltsbausteine und redaktionellen Funktionen existieren im Demonstrator – und wo sind sie im Echtsystem fachlich, im Datenmodell, im Workflow und in der UX wiederzufinden?**

## 2. Prüfmaßstab

Für jeden Demonstrator-Baustein werden fünf Ebenen getrennt geprüft:

1. **fachliche Bedeutung** – wozu dient der Baustein?
2. **Datenhaltung** – welche persistenten Daten/Beziehungen werden benötigt?
3. **Redaktionsworkflow** – wie entstehen, ändern und bestätigen Redakteure den Inhalt?
4. **öffentliche Darstellung** – wo und wie erscheint er für Besucher?
5. **bewusste Abweichung** – wurde eine Demonstrator-Funktion absichtlich verändert, zurückgestellt oder verworfen?

Ein Baustein gilt erst als vollständig übertragen, wenn alle notwendigen Ebenen geregelt oder bewusst als spätere technische bzw. produktseitige Umsetzung klassifiziert sind.

## 3. Statuslegende

- **VOLLSTÄNDIG** – fachliche Logik und benötigte Folgeebenen sind im Echtsystem geregelt.
- **VOLLSTÄNDIG / spätere technische Umsetzung** – fachlich gesichert, technische Realisierung folgt planmäßig später.
- **BEWUSST SPÄTER** – Funktion wurde geprüft und ausdrücklich auf eine spätere Ausbaustufe verschoben.

## 4. Transfer-Matrix – Abschlussstand

| ID | Demonstrator-Baustein / Funktion | Ergebnis im Echtsystem | Status |
|---|---|---|---|
| IA-001 | Themen: **Offene Fragen** | persistentes Objekt offene Frage/Wissenslücke mit Bezug, Herkunft, Status, Auflösung und Historie in `Datenmodell.md`; Workflow/UX getrennt von „Mehr wissen?“ | **VOLLSTÄNDIG** |
| IA-002 | Themen: relevante Ereignisse/Beispiele aus Nachbargemeinden | Workflow und UX erlauben externe Ereignisse bei belegtem Erklärungswert; fremder Ort und Feldkirchen-Bezug bleiben transparent | **VOLLSTÄNDIG** |
| IA-003 | Meldungen: **Was bisher passiert ist** | eigener UX-Baustein; grundsätzlich aus Ereignis-/Meldungs-/Vorgangsbeziehungen abgeleitet; Auswahl kann gespeichert werden | **VOLLSTÄNDIG** |
| IA-004 | Meldungen: **Bezüge** | eigener öffentlicher Abschnitt für geprüfte Bezugsobjekte; Quellen und Bezüge ausdrücklich getrennt | **VOLLSTÄNDIG** |
| IA-005 | Meldungen: **Offene Fragen** | eigener Meldungsbaustein plus persistentes Datenobjekt und Workflowabgrenzung | **VOLLSTÄNDIG** |
| IA-006 | Meldungen: **Mehr wissen?** | eigenständiges Fachkonzept, Meldungs-/Themenbaustein, Quellenpflicht und neue Rechts-/Querverweislogik vorhanden | **VOLLSTÄNDIG** |
| IA-007 | Bilder: Aufnahme/Auswahl im Redaktionsworkflow | Herkunft, KI-Vorschlag, redaktionelle Prüfung, Rechte, Datenschutz, Alt-Text, Freigabe, Austausch geregelt | **VOLLSTÄNDIG** |
| IA-008 | Bilder: Verwendungslogik | konkrete Auswahlpriorität, Sachbezug, Aktualität, Wiederverwendung und Negativregel im Bildkonzept | **VOLLSTÄNDIG** |
| IA-009 | Bilder: Bildunterschrift, Alt-Text, Urheber-/Rechtehinweis | Pflichtmetadaten in Bildkonzept und Datenmodell | **VOLLSTÄNDIG** |
| IA-010 | Bilder: „Mehr zum Bild“ / Motivwissen | als optionale spätere Funktion im Datenmodell gesichert; kein MVP-Zwang | **BEWUSST SPÄTER** |
| IA-011 | Meldungen: fachlich relevante Aktualisierung + Änderungshistorie | verbindlich geregelt | **VOLLSTÄNDIG** |
| IA-012 | Themen: Chronologie / „Alle Entwicklungen zum Thema“ | ausdrücklich vorgesehen | **VOLLSTÄNDIG** |
| IA-013 | Vorgänge: bisheriger Verlauf | ausdrücklich vorgesehen | **VOLLSTÄNDIG** |
| IA-014 | Quellen als eigener sichtbarer Inhaltsbaustein | Meldung, Thema und Mehr-wissen-Logik quellengebunden | **VOLLSTÄNDIG** |
| IA-015 | Teilen / Direktlink / zielgenaue Navigation | fachlich geregelt | **VOLLSTÄNDIG / spätere technische Umsetzung** |
| IA-016 | Info-/Disclaimer-Zugang je Inhalt | fachlich geregelt | **VOLLSTÄNDIG / spätere technische Umsetzung** |
| IA-017 | Bildbibliothek: Primärzuordnung, weitere Verwendung, Nicht verwenden für, Schlagworte | Bildkonzept + Datenmodell bilden diese Beziehungen ab | **VOLLSTÄNDIG** |
| IA-018 | Bilder: Meldungen strenger als Themen | ausdrücklich verbindlich im Bildkonzept | **VOLLSTÄNDIG** |
| IA-019 | Bilder: Projekt-/Objektidentität vor allgemeinem Themenbezug | ausdrücklich verbindlich im Bildkonzept | **VOLLSTÄNDIG** |
| IA-020 | Bilder: Mehrfachverwendung und Ausschlüsse | Bildverwendung eigenständig modelliert; Mehrfachverwendung/Ausschlüsse geregelt | **VOLLSTÄNDIG** |
| IA-021 | Bilder: kein Bild ist besser als falsches Bild | harte Negativregel im Bildkonzept | **VOLLSTÄNDIG** |
| IA-022 | Bilder: proportionale Darstellung ohne erzwungenen Beschnitt | als Darstellungsanforderung gesichert; konkrete CSS-Umsetzung später | **VOLLSTÄNDIG / spätere technische Umsetzung** |
| IA-023 | Bilder bei Themen/Sitzungen nur mit klarem Bezug | unterschiedliche Verwendungsschwellen im Bildkonzept geregelt | **VOLLSTÄNDIG** |
| IA-024 | „Mehr wissen?“: Eigene Frage stellen / Live-KI | Demonstrator-Funktion bewusst nicht im MVP; freie Besucherfragen spätere Ausbaustufe | **BEWUSST SPÄTER** |
| IA-025 | „Mehr wissen?“: sichere Formatierung dynamischer KI-Antworten | als expliziter Regressionstest/Sicherheitsanforderung gesichert; technische Sanitizing-/Rendering-Lösung in G5 | **VOLLSTÄNDIG / spätere technische Umsetzung** |
| IA-026 | Meldung: Link zu zugehöriger Sitzung / „Mehr zum Thema“ | öffentliche Darstellung in `UX-und-Informationsarchitektur.md` v3.0 entschieden: **Zusammenhänge** für Vorgang/Thema/Sitzung-TOP, **Bezüge** für konkrete Objekte/Orte; Links werden aus strukturierten Beziehungen erzeugt | **VOLLSTÄNDIG** |

## 5. Fachliche Abgrenzung: Offene Fragen vs. „Mehr wissen?“

- **Offene Frage / Wissenslücke** = am Sachverhalt selbst ist etwas noch nicht geklärt, entschieden, belegt oder bekannt.
- **„Mehr wissen?“-Frage** = zusätzlicher Erkenntnisweg für Besucher.

Beispiel Hundehaltungsverordnung / Hundewiese:

- offene Frage: **Welche Auswirkungen hätte eine beschlossene Hundehaltungsverordnung auf Bedarf, Funktion oder Ausgestaltung von Freilaufflächen?**
- „Mehr wissen?“-Frage: **Warum kann eine Leinenregelung die Diskussion über Hundewiesen und andere Freilaufflächen beeinflussen?**

## 6. Nachbarentwicklungen als Themenbestandteil

Ein Feldkirchen-Thema darf konkrete Ereignisse aus Nachbargemeinden oder dem regionalen Umfeld sichtbar einbeziehen, wenn sie einen belegten Erklärungswert für die Feldkirchner Leitfrage haben. Fremder Ort und Feldkirchen-Bezug werden transparent genannt; reine Ähnlichkeit reicht nicht.

## 7. Bildtransfer – Ergebnis

Die Demonstrator-Bildlogik ist fachlich in das Echtsystem überführt. Insbesondere gelten:

- konkrete Zuordnung vor generischem Motiv,
- Meldungen mit strengerem Sachbezug als Themen,
- kein Bildzwang,
- kein missverständliches Bild,
- Rechte-/Datenschutz-/Nachweisprüfung,
- Alt-Text und Bildunterschrift,
- Primärzuordnung, weitere Verwendung und Nutzungsausschlüsse,
- Mehrfachverwendung nur nach eigenständiger Prüfung,
- konkrete Verwendung wird redaktionell bestätigt.

`Mehr zum Bild` bleibt als bewusste spätere Erweiterung erhalten, nicht als verlorene MVP-Funktion.

## 8. Regressionstest-Abdeckung

`docs/Regressionstests-Demonstratortransfer.md` wurde auf 28 Referenzfälle erweitert. Neu abgesichert sind insbesondere:

- Meldungsrückblick „Was bisher passiert ist“,
- offene Fragen bei Meldungen,
- Nachbarereignisse im Thema,
- Bildfreigabe, Meldung ohne Bild, Primär-/Mehrfachzuordnung und Nutzungsausschlüsse,
- Wechselwirkung Hundehaltungsverordnung ↔ Hundewiese,
- Rechtsvertiefung ohne eigene Rechtsberatung,
- Erläuterung von Fachsprache,
- bewusste MVP-Abweichung bei freien „Mehr wissen?“-Fragen,
- sichere Darstellung dynamischer KI-Antworten.

## 9. Abschluss-Gegencheck 04.10.2026

Nach Nachpflege von UX, Datenmodell, Redaktionsworkflow, Bildkonzept und Regressionstestkorpus wurde die Demonstrator-Dokumentation erneut gegen die Echtsystem-Primärquellen gespiegelt.

Ergebnis:

- Es wurde **keine weitere fachlich kritische, vollständig unerkannte Funktionsgruppe** gefunden.
- Die wesentlichen zuvor übersehenen Bereiche waren Meldungsbausteine und redaktionelle Bildfunktionen.
- Bewusst abweichende Produktentscheidungen werden nun ausdrücklich als solche geführt und nicht mehr mit „vollständig übertragen“ vermischt.
- IA-026 wurde als letzter Restpunkt entschieden und in der UX geschlossen.

Damit ist der zweite Audit **formal abgeschlossen**.

## 10. Abschlussentscheidung

Das Transfer-Gate für sichtbare Inhaltsbausteine und Redaktionsfunktionen ist bestanden.

Damit gilt für G2.5 insgesamt:

> **Der Demonstrator wurde in zwei Prüfschichten gegen das Echtsystem gespiegelt: erstens fachliche Regeln und Recherche-/Persistenzlogik, zweitens sichtbare Inhaltsbausteine und redaktionelle Funktionen. Erkannte Lücken wurden in den zuständigen Primärdokumenten geschlossen oder ausdrücklich als bewusste spätere Produktentscheidung dokumentiert.**

Technische Realisierung und automatisierte Regressionstests folgen in den vorgesehenen späteren Phasen und ändern den fachlichen Abschluss dieses Transfer-Audits nicht.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 04.10.2026 | IA-026 geschlossen: „Zusammenhänge“ für Vorgang/Thema/Sitzung-TOP und „Bezüge“ für konkrete Objekte/Orte festgelegt; Abschluss-Gegencheck bestätigt; zweite Prüfschicht und Transfer-Gate formal abgeschlossen. |
| 0.3 | 04.10.2026 | Nachpflege bewertet: Meldungsbausteine, offene Fragen, Bildworkflow/-datenmodell und Regressionstests geschlossen; „Mehr zum Bild“ und freie Live-Fragen als bewusste spätere Funktionen klassifiziert; Abschluss-Gegencheck durchgeführt; IA-026 blieb als letzter offener Transferpunkt. |
| 0.2 | 04.10.2026 | Zweite Prüfschicht erweitert: strukturierte Bildbibliothek, Primär-/Mehrfachzuordnung, Nutzungsausschlüsse, strengere Bildschwelle für Meldungen, proportionale Inhaltsbilddarstellung, sichere „Mehr wissen?“-Ausgabe und bewusste Verschiebung freier Besucherfragen aufgenommen. |
| 0.1 | 04.10.2026 | Zweite Transfer-Prüfschicht gestartet; erste 16 Prüfpunkte inventarisiert. |
