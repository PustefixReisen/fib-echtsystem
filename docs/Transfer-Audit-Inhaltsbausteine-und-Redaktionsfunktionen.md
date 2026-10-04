# G2.5 – Transfer-Audit Inhaltsbausteine & Redaktionsfunktionen

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Anlass

Der erste Transfer-Audit Demonstrator → Echtsystem hat vor allem fachliche Regeln, Recherchelogik, Persistenzanforderungen und zentrale UX-Grundsätze geprüft. Eine erneute Gegenprüfung am 04.10.2026 zeigte, dass einzelne im Demonstrator sichtbare Inhaltsbausteine und redaktionelle Funktionen nicht als eigene Prüfpunkte inventarisiert worden waren.

Dieser zweite Audit ergänzt deshalb ausdrücklich die Perspektive:

> **Welche sichtbaren Inhaltsbausteine und redaktionellen Funktionen existieren im Demonstrator – und wo sind sie im Echtsystem fachlich, im Datenmodell, im Workflow und in der UX wiederzufinden?**

Bis zum Abschluss dieses Audits gilt G2.5 erneut als **offen**.

## 2. Prüfmaßstab

Für jeden Demonstrator-Baustein werden vier Ebenen getrennt geprüft:

1. **fachliche Bedeutung** – wozu dient der Baustein?
2. **Datenhaltung** – welche persistenten Daten/Beziehungen werden benötigt?
3. **Redaktionsworkflow** – wie entstehen, ändern und bestätigen Redakteure den Inhalt?
4. **öffentliche Darstellung** – wo und wie erscheint er für Besucher?

Ein Baustein gilt erst als vollständig übertragen, wenn alle für ihn notwendigen Ebenen geregelt oder bewusst als spätere technische Umsetzung klassifiziert sind.

## 3. Statuslegende

- **VOLLSTÄNDIG** – fachliche Logik und benötigte Folgeebenen sind im Echtsystem geregelt.
- **TEILWEISE** – wesentliche Teile sind vorhanden, mindestens eine notwendige Ebene fehlt oder ist zu unscharf.
- **LÜCKE** – Demonstrator-Funktion ist im Echtsystem nicht ausreichend abgebildet.
- **BEWUSST NICHT ÜBERNEHMEN** – Funktion wurde geprüft und ausdrücklich verworfen.

## 4. Startmatrix

| ID | Demonstrator-Baustein / Funktion | Aktueller Echtsystem-Stand | Status | Nacharbeit |
|---|---|---|---|---|
| IA-001 | Themen: **Offene Fragen** | Themendetailseite enthält „Was ist noch offen? – Wissenslücken/offene Fragen“; Wissenslücke/offene Wissensfrage im Datenmodell noch nicht abschließend modelliert | **TEILWEISE** | G3: persistente offene Frage/Wissenslücke samt Herkunft, Status und Auflösung modellieren; Workflow ergänzen |
| IA-002 | Themen: relevante Ereignisse/Beispiele aus Nachbargemeinden | zusätzliche relevante Ereignisse außerhalb ausgewählter Vorgänge sind fachlich möglich; überregionaler Kontext ist vorgesehen | **TEILWEISE** | ausdrücklich regeln, dass konkrete Entwicklungen aus Nachbargemeinden als Themenbestandteil/Beispiel sichtbar benannt werden können, wenn Feldkirchen-Bezug belegt ist |
| IA-003 | Meldungen: **Was bisher passiert ist** | Vorgangsverlauf vorhanden; Folgemeldung kennt „Bisheriger Stand“, aber kein verbindlicher eigener verlinkter Verlaufsbaustein wie im Demonstrator | **LÜCKE** | UX + Daten-/Beziehungslogik: frühere relevante Ereignisse/Meldungen als kompakter verlinkter Verlauf |
| IA-004 | Meldungen: **Bezüge** | Zusammenhang zu Vorgang, Thema, Sitzung und Bezugsobjekten sowie Bezugsobjektlogik vorhanden | **TEILWEISE** | öffentliche Bezeichnung/Funktion „Bezüge“ und Anordnung auf Meldungsdetailseite präzisieren |
| IA-005 | Meldungen: **Offene Fragen** | kein eigener verbindlicher Baustein auf Meldungsdetailseite | **LÜCKE** | fachliche Abgrenzung zu „Mehr wissen?“; persistente offene Fragen; UX/Workflow ergänzen |
| IA-006 | Meldungen: **Mehr wissen?** | eigenständiges Fachkonzept und Meldungsdetail-Baustein vorhanden | **VOLLSTÄNDIG** | nur Konsistenz mit neuen offenen Fragen/Querverweisen weiter prüfen |
| IA-007 | Bilder: Aufnahme/Auswahl im Redaktionsworkflow | kein verbindlicher Workflow für Upload, Auswahl, Vorschlag, Rechteprüfung, Freigabe und Austausch | **LÜCKE** | Redaktionsworkflow ergänzen |
| IA-008 | Bilder: Verwendungslogik | allgemeine Bildsprache vorhanden; konkrete Einsatzentscheidung pro Meldung fehlt | **LÜCKE** | Bildkonzept um Auswahlpriorität, Sachbezug, Wiederverwendung, Aktualität und Nichtverwendung ergänzen |
| IA-009 | Bilder: Bildunterschrift, Alt-Text, Urheber-/Rechtehinweis | Demonstrator regelt diese Punkte; Echtsystem-Bildkonzept bislang nur teilweise | **LÜCKE** | Bildkonzept + Datenmodell/Workflow ergänzen |
| IA-010 | Bilder: „Mehr zum Bild“ / Motivwissen | im Demonstrator als optionaler Erkenntnisbaustein erprobt; im Echtsystem nicht ausdrücklich inventarisiert | **LÜCKE / zu entscheiden** | prüfen, ob als Echtsystem-Funktion übernommen wird; bei Übernahme Motivwissen persistent modellieren |
| IA-011 | Meldungen: fachlich relevante Aktualisierung + Änderungshistorie | im Echtsystem verbindlich geregelt | **VOLLSTÄNDIG** | keine Transferlücke |
| IA-012 | Themen: Chronologie / „Alle Entwicklungen zum Thema“ | im Echtsystem ausdrücklich vorgesehen | **VOLLSTÄNDIG** | keine Transferlücke |
| IA-013 | Vorgänge: bisheriger Verlauf | im Echtsystem ausdrücklich vorgesehen | **VOLLSTÄNDIG** | keine Transferlücke |
| IA-014 | Quellen als eigener sichtbarer Inhaltsbaustein | Meldung, Thema und Mehr-wissen-Logik quellengebunden | **VOLLSTÄNDIG** | weitere Detailprüfung nur für Reihenfolge/Quellenrollen |
| IA-015 | Teilen / Direktlink / zielgenaue Navigation | aus erstem Audit übernommen | **VOLLSTÄNDIG / spätere technische Umsetzung** | technische Umsetzung später |
| IA-016 | Info-/Disclaimer-Zugang je Inhalt | aus erstem Audit übernommen | **VOLLSTÄNDIG / spätere technische Umsetzung** | technische Umsetzung später |

## 5. Fachliche Abgrenzung: Offene Fragen vs. „Mehr wissen?“

Die erneute Prüfung macht eine verbindliche Trennung erforderlich:

- **Offene Frage / Wissenslücke** = am Sachverhalt selbst ist etwas noch nicht geklärt, entschieden, belegt oder bekannt.
- **„Mehr wissen?“-Frage** = ein zusätzlicher Erkenntnisweg für Besucher, obwohl die Frage nicht zwingend als offene Sachfrage des Vorgangs/Themas bestehen muss.

Beispiel Hundehaltungsverordnung / Hundewiese:

- offene Frage: **Welche Auswirkungen hätte eine beschlossene Hundehaltungsverordnung auf Bedarf, Funktion oder Ausgestaltung von Freilaufflächen?**
- „Mehr wissen?“-Frage: **Warum kann eine Leinenregelung die Diskussion über Hundewiesen und andere Freilaufflächen beeinflussen?**

Beide können aufeinander Bezug nehmen, dürfen aber nicht als dasselbe Datenobjekt behandelt werden.

## 6. Nachbarentwicklungen als Themenbestandteil

Ein Feldkirchen-Thema darf konkrete Ereignisse aus Nachbargemeinden oder dem regionalen Umfeld sichtbar einbeziehen, wenn sie einen belegten Erklärungswert für die Feldkirchner Leitfrage haben.

Dabei gilt:

- der fremde Ort und der Feldkirchen-Bezug werden transparent genannt,
- das Ereignis wird nicht als Feldkirchner Ereignis umetikettiert,
- die Aufnahme kann über einen ausgewählten Vorgang oder als zusätzliches relevantes Einzelereignis erfolgen,
- reine Ähnlichkeit oder allgemeine Interessantheit reicht nicht,
- Beispiele aus Nachbargemeinden können auch als Vergleichs- oder Lernkontext dienen.

## 7. Bildprüfung – Mindestumfang der Nacharbeit

Für Meldungsbilder muss das Echtsystem mindestens regeln:

1. Herkunft: redaktioneller Upload, vorhandene Bildbibliothek, zulässige externe Quelle oder anderes freigegebenes Asset,
2. Sachbezug: das Bild muss den konkreten Inhalt sinnvoll unterstützen und darf keine falsche Nähe suggerieren,
3. Auswahl: vorhandene konkrete lokale Bilder haben Vorrang vor generischen Motiven,
4. Rechte: Nutzungserlaubnis/Lizenz, Urheber und erforderlicher Nachweis müssen vor Veröffentlichung geklärt sein,
5. Metadaten: Bildunterschrift, Alt-Text, Urheber-/Rechtehinweis, ggf. Aufnahmeort/-datum,
6. Freigabe: Bild und konkrete Verwendung werden redaktionell bestätigt,
7. Aktualität: ein Bild darf bei verändertem Sachstand nicht irreführend werden,
8. Austausch: ein Bild kann ersetzt werden, ohne die fachliche Historie der Meldung zu verfälschen,
9. Wiederverwendung: zulässig nur bei weiterhin passendem Sachbezug und geklärten Rechten,
10. kein Bildzwang: fehlt ein geeignetes Bild, bleibt die Meldung ohne Bild.

## 8. Nächste Arbeitsschritte

1. IA-001 bis IA-010 in den zuständigen Primärdokumenten schließen.
2. Anschließend Demonstrator-Oberfläche und Demonstrator-Dokumentation erneut systematisch nach weiteren sichtbaren Inhaltsbausteinen durchsuchen.
3. Datenmodell- und Workflowfolgen gegen G3 abgleichen.
4. Regressionstestkorpus um mindestens folgende Fälle erweitern:
   - Meldung mit „Was bisher passiert ist“,
   - Meldung mit offenen Fragen,
   - Thema mit externem Nachbarereignis,
   - Meldung mit Bild inkl. Rechte-/Alt-Text-/Nachweislogik,
   - Meldung ohne geeignetes Bild,
   - Wechselwirkung Hundehaltungsverordnung ↔ Hundewiese als offene Frage.
5. Erst nach Abschluss dieser zweiten Prüfschicht G2.5 erneut schließen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 04.10.2026 | Zweite Transfer-Prüfschicht für sichtbare Inhaltsbausteine und Redaktionsfunktionen gestartet; erste 16 Prüfpunkte inventarisiert und Transferstatus bewertet. |
