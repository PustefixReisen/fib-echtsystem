# G2.5 – Transfer-Audit Inhaltsbausteine & Redaktionsfunktionen

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.2 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

Zusätzlich wird nun eine fünfte Prüffrage verwendet:

5. **bewusste Abweichung** – wurde eine im Demonstrator vorhandene Funktion im Echtsystem absichtlich verändert, zurückgestellt oder verworfen? Eine solche Abweichung gilt nur dann als geschlossen, wenn sie ausdrücklich dokumentiert ist.

## 3. Statuslegende

- **VOLLSTÄNDIG** – fachliche Logik und benötigte Folgeebenen sind im Echtsystem geregelt.
- **TEILWEISE** – wesentliche Teile sind vorhanden, mindestens eine notwendige Ebene fehlt oder ist zu unscharf.
- **LÜCKE** – Demonstrator-Funktion ist im Echtsystem nicht ausreichend abgebildet.
- **BEWUSST NICHT ÜBERNEHMEN / SPÄTER** – Funktion wurde geprüft und ausdrücklich verworfen oder auf eine spätere Ausbaustufe verschoben.

## 4. Transfer-Matrix

| ID | Demonstrator-Baustein / Funktion | Aktueller Echtsystem-Stand | Status | Nacharbeit |
|---|---|---|---|---|
| IA-001 | Themen: **Offene Fragen** | Themendetailseite enthält „Was ist noch offen? – Wissenslücken/offene Fragen“; Wissenslücke/offene Wissensfrage im Datenmodell noch nicht abschließend modelliert | **TEILWEISE** | G3: persistente offene Frage/Wissenslücke samt Herkunft, Status und Auflösung modellieren; Workflow ergänzen |
| IA-002 | Themen: relevante Ereignisse/Beispiele aus Nachbargemeinden | zusätzliche relevante Ereignisse außerhalb ausgewählter Vorgänge sind fachlich möglich; überregionaler Kontext ist vorgesehen | **TEILWEISE** | ausdrücklich regeln, dass konkrete Entwicklungen aus Nachbargemeinden als Themenbestandteil/Beispiel sichtbar benannt werden können, wenn Feldkirchen-Bezug belegt ist |
| IA-003 | Meldungen: **Was bisher passiert ist** | Vorgangsverlauf vorhanden; Folgemeldung kennt „Bisheriger Stand“, aber kein verbindlicher eigener verlinkter Verlaufsbaustein wie im Demonstrator | **LÜCKE** | UX + Daten-/Beziehungslogik: frühere relevante Ereignisse/Meldungen als kompakter verlinkter Verlauf |
| IA-004 | Meldungen: **Bezüge** | Zusammenhang zu Vorgang, Thema, Sitzung und Bezugsobjekten sowie Bezugsobjektlogik vorhanden | **TEILWEISE** | öffentliche Bezeichnung/Funktion „Bezüge“ und Anordnung auf Meldungsdetailseite präzisieren |
| IA-005 | Meldungen: **Offene Fragen** | kein eigener verbindlicher Baustein auf Meldungsdetailseite | **LÜCKE** | fachliche Abgrenzung zu „Mehr wissen?“; persistente offene Fragen; UX/Workflow ergänzen |
| IA-006 | Meldungen: **Mehr wissen?** | eigenständiges Fachkonzept und Meldungsdetail-Baustein vorhanden | **VOLLSTÄNDIG** | Konsistenz mit offenen Fragen und Querverweisen weiter prüfen |
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
| IA-017 | Bildbibliothek: **Primärzuordnung, weitere geeignete Verwendung, Nicht verwenden für, Schlagworte** | im Demonstrator ausdrücklich vorgesehen; im Echtsystem nicht vollständig als strukturierte Bildmetadaten beschrieben | **LÜCKE** | Datenmodell/Bildkonzept ergänzen; explizite Zuordnungen und Ausschlüsse müssen Vorrang vor automatischen Vorschlägen haben |
| IA-018 | Bilder: **Meldungen strenger als Themen** | Demonstrator verlangt bei Meldungen konkreten Vorgangs-/Orts-/Objektbezug; bei Themen darf ein zentraler Themenaspekt genügen | **LÜCKE** | Bildkonzept als verbindliche Verwendungsschwelle übernehmen |
| IA-019 | Bilder: **Projekt-/Objektidentität vor allgemeinem Themenbezug** | Demonstrator priorisiert das konkrete Projekt vor generischer Themenzuordnung | **LÜCKE** | Bildkonzept und Vorschlagslogik ergänzen |
| IA-020 | Bilder: **Mehrfachverwendung und Ausschlüsse** | Demonstrator erlaubt Mehrfachverwendung bei jeweils belastbarem Sachbezug und kennt ausdrückliche Ausschlüsse bei Verwechslungsgefahr | **LÜCKE** | strukturierte Bild-Beziehungen und Ausschlüsse modellieren |
| IA-021 | Bilder: **kein Bild ist besser als ein falsches/missverständliches Bild** | im Echtsystem implizit angelegt, aber nicht als harte Auswahlregel formuliert | **TEILWEISE** | als verbindliche Negativregel im Bildkonzept festlegen |
| IA-022 | Bilder: **proportionale Darstellung ohne erzwungenen Beschnitt** | Demonstrator regelt dies für Beitragsbilder; Echtsystem noch nicht als Inhaltsbildregel festgelegt | **LÜCKE / spätere UI-Umsetzung** | UX/Bildkonzept übernehmen, konkrete technische Umsetzung später validieren |
| IA-023 | Bilder: **Themen/Sitzungen nur bei klarem konkretem Bezug; Priorität zunächst Meldungen** | Demonstrator ausdrücklich geregelt | **LÜCKE / zu prüfen** | Echtsystem-Zielbild prüfen und ggf. übernehmen |
| IA-024 | „Mehr wissen?“: **Eigene Frage stellen / Live-KI** | Demonstrator bereits live erprobt; Echtsystem-MVP sieht vorbereitete Fragen/Antworten vor und verschiebt freie Besucherfragen ausdrücklich auf später | **BEWUSST SPÄTER** | keine Transferlücke, aber als bewusste Produktabweichung im Audit festhalten |
| IA-025 | „Mehr wissen?“: begrenzte sichere Formatierung von KI-Antworten | Demonstrator erlaubt nur sichere Darstellungselemente und kein beliebiges KI-HTML | **TEILWEISE / technische Sicherheitsanforderung** | für spätere Frontend-/Sicherheitsumsetzung ausdrücklich sichern |
| IA-026 | Meldung: expliziter Link zur zugehörigen Sitzung / „Mehr zum Thema“ | Echtsystem besitzt strukturierte Zusammenhänge zu Sitzung, Vorgang und Thema, aber die konkrete öffentliche Darstellungsform ist allgemeiner gefasst | **TEILWEISE** | beim UX-Abgleich prüfen, ob eigenständige sichtbare Links beibehalten oder in „Bezüge/Zusammenhang“ integriert werden |

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
10. kein Bildzwang: fehlt ein geeignetes Bild, bleibt die Meldung ohne Bild,
11. Primärzuordnung: ein Bild kann einem konkreten Objekt, Projekt, Vorgang oder einer Meldung primär zugeordnet sein,
12. weitere Verwendung: zusätzliche zulässige Verwendungen können strukturiert hinterlegt werden,
13. Ausschluss: bei Verwechslungsgefahr kann ausdrücklich hinterlegt werden, wofür das Bild nicht verwendet werden darf,
14. Strenge: für Meldungen ist ein konkreter Sach-/Orts-/Objektbezug erforderlich; Themen können bei klarem Erkenntniswert auch einen zentralen Themenaspekt bebildern,
15. Priorität: Projekt-/Objektidentität geht vor einer nur allgemeinen Themenähnlichkeit,
16. automatische Vorschläge dürfen explizite redaktionelle Zuordnungen oder Ausschlüsse nicht überschreiben.

## 8. Weitere neu erkannte bewusste Abweichung

Der Demonstrator hatte „Eigene Frage stellen …“ bereits an eine Live-KI angebunden. Für das Echtsystem wurde inzwischen bewusst entschieden, dass freie Besucherfragen **nicht Bestandteil des MVP** sind. Das ist kein verlorener Transfer, sondern eine dokumentierte Produktentscheidung: vorbereitete, persistente und redaktionell geprüfte Fragen/Antworten bilden zunächst den Regelbetrieb; Live-Fragen bleiben eine spätere Erweiterung.

Diese Art bewusster Abweichung wird künftig im Audit genauso ausdrücklich dokumentiert wie eine Übernahme oder eine Lücke.

## 9. Nächste Arbeitsschritte

1. IA-001 bis IA-010 sowie IA-017 bis IA-023 und IA-025/026 in den zuständigen Primärdokumenten schließen oder bewusst entscheiden.
2. Anschließend Demonstrator-Oberfläche und Demonstrator-Dokumentation erneut systematisch nach weiteren sichtbaren Inhaltsbausteinen durchsuchen.
3. Datenmodell- und Workflowfolgen gegen G3 abgleichen.
4. Regressionstestkorpus um mindestens folgende Fälle erweitern:
   - Meldung mit „Was bisher passiert ist“,
   - Meldung mit offenen Fragen,
   - Thema mit externem Nachbarereignis,
   - Meldung mit Bild inkl. Rechte-/Alt-Text-/Nachweislogik,
   - Meldung ohne geeignetes Bild,
   - Bild mit Primärzuordnung und weiterer zulässiger Verwendung,
   - Bild mit ausdrücklichem Nutzungsausschluss,
   - Wechselwirkung Hundehaltungsverordnung ↔ Hundewiese als offene Frage,
   - bewusste MVP-Abweichung bei freien „Mehr wissen?“-Fragen.
5. Erst nach Abschluss dieser zweiten Prüfschicht G2.5 erneut schließen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.2 | 04.10.2026 | Zweite Prüfschicht erweitert: strukturierte Bildbibliothek, Primär-/Mehrfachzuordnung, Nutzungsausschlüsse, strengere Bildschwelle für Meldungen, proportionale Inhaltsbilddarstellung, sichere „Mehr wissen?“-Ausgabe und bewusste Verschiebung freier Besucherfragen auf spätere Ausbaustufe als zusätzliche Transferpunkte aufgenommen. |
| 0.1 | 04.10.2026 | Zweite Transfer-Prüfschicht für sichtbare Inhaltsbausteine und Redaktionsfunktionen gestartet; erste 16 Prüfpunkte inventarisiert und Transferstatus bewertet. |
