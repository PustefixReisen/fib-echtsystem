# UX und Informationsarchitektur – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.5 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für öffentliche Benutzerführung, Informationsarchitektur, grundlegende Darstellungsregeln und responsive/barrierearme UX des FIB-Echtsystems.

Ergänzende Primärquellen:

- Themen- und Vorgangslogik: `docs/Themen-und-Vorgangslogik.md`
- „Mehr wissen?“: `docs/Mehr-wissen.md`
- Fachlichkeit: `docs/Fachkonzept.md`
- SEO: `docs/SEO-und-Auffindbarkeit.md`

Der Demonstrator ist Referenz, aber kein unveränderlicher UI-Blueprint. Das frühere Demonstrator-Dokument `FIB_Frontend_und_Darstellung.md` wird nicht als zweite Primärquelle fortgeführt; weiterhin gültige Regeln sind hier integriert.

## 2. Leitidee

> **FIB soll nicht primär Dokumente oder einzelne Meldungen präsentieren, sondern den aktuellen Wissensstand zu einem Sachverhalt erschließen.**

Die Ebenen beantworten unterschiedliche Nutzerfragen:

- **Meldung:** Was ist konkret neu passiert?
- **Vorgang:** Wie entwickelt sich ein konkreter Sachverhalt und wo steht er heute?
- **Thema:** Welche übergeordnete Frage verbindet mehrere Vorgänge, Perspektiven und Rahmenbedingungen?
- **Sitzung:** Was wird beraten oder entschieden?
- **Mehr wissen?:** Was steckt dahinter?

Intern bleiben Meldung, Vorgang und Thema getrennte Objekttypen. Öffentlich wird diese Differenzierung nur so stark sichtbar gemacht, wie sie dem Verständnis dient.

## 3. Zentrale Nutzeraufgaben

FIB unterstützt insbesondere:

1. aktuelle Meldungen finden,
2. länger laufende Sachverhalte und ihren aktuellen Stand verstehen,
3. den Verlauf eines konkreten Vorgangs nachvollziehen,
4. übergeordnete Zusammenhänge verstehen,
5. anstehende und vergangene Sitzungen erschließen,
6. erkennen, was an einer Entwicklung neu ist,
7. Hintergründe vertiefen,
8. künftig relevante Änderungen nicht verpassen,
9. gezielt suchen.

## 4. Einstiegswege

Mögliche Einstiege:

- direkter FIB-Aufruf,
- Suchmaschine,
- geteilter Direktlink,
- QR-Code,
- Push,
- später Newsletter und weitere Kanäle.

Daraus folgt:

> **Jede öffentliche Inhaltsseite muss als eigenständiger Einstieg funktionieren.**

Die Startseite darf nicht vorausgesetzt werden. Meldungen, Vorgänge, Themen und Sitzungen erhalten stabile Identitäten und eigenständige URLs.

## 5. Hauptnavigation

Verbindliche öffentliche Hauptnavigation:

- **Meldungen**
- **Themen**
- **Sitzungen**
- **Suchen**

**„Aktuell“** ist kein eigener Hauptbereich, sondern eine zeitliche Hervorhebung.

### 5.1 Meldungen

Enthält die vollständige Liste veröffentlichter Meldungen, nicht nur aktuelle.

### 5.2 Themen

Zeigt eine gemeinsame Liste aus:

- übergeordneten Themen,
- konkreten länger laufenden Vorgängen.

Die interne Unterscheidung bleibt verbindlich, wird öffentlich aber nicht überbetont. Dezente Labels sind möglich, wenn sie helfen.

Ein Vorgang darf auch ohne übergeordnetes Thema erscheinen.

### 5.3 Sitzungen

Zeigt transparent, was ansteht, welche Unterlagen vorliegen, was beraten bzw. beschlossen wurde und was offen bleibt.

Tagesordnung, Vorlage, Beratung, Beschluss und Niederschrift bleiben unterscheidbar.

### 5.4 Suchen

Eine zentrale Suche erschließt die öffentlichen Inhalte über Text und strukturierte Beziehungen.

## 6. Startseite

Drei feste Blöcke:

1. **Aktuelle Meldungen** – neue und fachlich relevant aktualisierte Meldungen.
2. **Anstehende Sitzungen** – nächste tatsächlich bevorstehende Sitzungen.
3. **Aktuelle bzw. geänderte Themen und Vorgänge** – fachlich veränderte Wissensstände.

„Seit letztem Besuch“ wird innerhalb dieser Blöcke angezeigt, nicht als vierter Block.

> **Startseite = Orientierung und Auswahl**  
> **Listenansicht = Überblick und Vergleich**  
> **Detailseite = Verständnis und Vertiefung**

## 7. Meldungsliste

Pro Eintrag grundsätzlich:

- Überschrift,
- sehr kurze Zusammenfassung,
- Ereignis-/Ursprungsdatum,
- bei fachlich relevanter Änderung zusätzlich Aktualisierungsdatum,
- Vorgang/Sachkontext, sofern vorhanden,
- Thema, sofern hilfreich.

Interne Relevanzwerte werden nicht öffentlich angezeigt.

Sortierung: nach letzter **fachlich relevanter Neuigkeit**, nicht nach technischem Änderungszeitpunkt.

Darstellung bei Aktualisierung:

> **17.09.2026 · aktualisiert 29.09.2026**

## 8. Meldungslogik und Aktualisierungen

Verbindlicher Grundsatz:

> **Eine Meldung steht für ein eigenständiges berichtenswertes Ereignis. Neue Informationen zum selben Ereignis aktualisieren die bestehende Meldung. Ein neues eigenständiges Ereignis mit ausreichendem Nachrichtenwert erzeugt eine neue Meldung.**

Es werden unterschieden:

- technische Änderung,
- redaktionelle Aktualisierung,
- fachlich relevante Aktualisierung.

Nur fachlich relevante Aktualisierungen zählen für Sortierung, „Neu seit letztem Besuch“ und mögliche Push-Relevanz.

Bei aktualisierten Meldungen wird der neue Informationswert unmittelbar sichtbar, z. B.:

> **Neu seit 17. September:** Die veröffentlichte Vorlage enthält jetzt konkrete Angaben zu Schallschutzkosten und einer Park-Alternative.

Frühere fachliche Aktualisierungen bleiben über **„Frühere Aktualisierungen anzeigen“** nachvollziehbar.

> **Der aktuelle Beitrag zeigt den heutigen Wissensstand; die Aktualisierungshistorie erklärt, wie sich dieser Wissensstand verändert hat.**

## 9. Meldungsdetailseite

### 9.1 Erstmeldung

1. Titel
2. Datum
3. Kurzfassung
4. Worum geht es?
5. Sachinformation
6. Quellen
7. Unsere Einordnung
8. Mehr wissen?
9. Zusammenhang zu Vorgang, Thema, Sitzung und Bezugsobjekten

### 9.2 Folgemeldung

1. Titel
2. Datum
3. Kurzfassung
4. **Was ist neu?**
5. **Bisheriger Stand** – nur notwendiger Kontext
6. Sachinformation
7. Quellen
8. Unsere Einordnung
9. Mehr wissen?
10. Zusammenhang

### 9.3 Aktualisierte bestehende Meldung

Unter Datumszeile und Kurzfassung wird die neue fachliche Information prominent dargestellt, danach der aktuelle Gesamtstand.

## 10. Gemeinsame Themen-/Vorgangsliste

Die Liste zeigt Themen und Vorgänge gemeinsam und beantwortet: **Was beschäftigt Feldkirchen länger?**

Jeder Eintrag enthält grundsätzlich:

- Titel,
- kurze Beschreibung,
- Datum der letzten fachlich relevanten Änderung,
- gegebenenfalls übergeordneten Zusammenhang.

Bei einem zugeordneten Vorgang kann erscheinen:

> **Gehört zu:** Regionale Mobilität und Verkehrsverflechtungen Feldkirchens

Keine harte Standardtrennung in zwei Blöcke und kein notwendiger Standardfilter „Themen | Vorgänge“.

Sortierung primär nach letzter fachlich relevanter Änderung.

## 11. Vorgangsdetailseite

Zweck: **Entwicklung eines konkreten Sachverhalts nachvollziehen.**

Grundstruktur:

1. Titel + Kurzbeschreibung
2. Aktueller Stand
3. Letzte relevante Entwicklung
4. Bisheriger Verlauf – automatisch aus verknüpften Meldungen/Ereignissen
5. Wichtige Entscheidungen
6. Offene Punkte / nächste belegte Schritte
7. Zuständigkeiten und Beteiligte
8. Zugehörige Themen
9. Mehr wissen?
10. Unsere Einordnung

Status wie aktiv / ruhend / abgeschlossen gehört zum Vorgang, nicht zum Thema.

## 12. Themendetailseite

Zweck: **übergeordnete Zusammenhänge verstehen.**

Grundstruktur:

1. **Kopfbereich** – Titel, Leitfrage, Feldkirchen-Bezug, fachlicher Stand.
2. **Warum ist das für Feldkirchen relevant?**
3. **Was prägt das Thema derzeit?** – wichtige Vorgänge mit Rolle, Stand und letzter Entwicklung.
4. **Perspektiven des Themas** – themenspezifisch, nicht global starr.
5. **Was wissen wir derzeit?** – kompakte Synthese.
6. **Was ist noch offen?** – Wissenslücken/offene Fragen.
7. **Hintergrund und Kontext** – nur bei Erklärungsgewinn.
8. **Mehr wissen?**
9. **Unsere Einordnung**
10. **Neueste Entwicklungen** – kompakte Meldungsliste.

Nicht alle Vorgänge werden gleichrangig dargestellt; ihre Wirkungsrolle beeinflusst Gewichtung.

Zusätzlich gibt es **„Alle Entwicklungen zum Thema“** als automatisch erzeugte Chronologie aus zugehörigen Vorgängen und direkten Themenmeldungen.

## 13. Sitzungslisten und -details

### 13.1 Liste

Pro Eintrag:

- Gremium/Sitzungstitel,
- Datum und Uhrzeit,
- `TOPs:` mit ausgewählten FIB-relevanten Punkten und `…`.

Ort und Verfahrensstatus werden in der Liste nicht gezeigt. Anstehende Sitzungen werden nach Termin sortiert.

### 13.2 Abschlusslogik

Eine Sitzung gilt als abgeschlossen, sobald die Genehmigung der Niederschrift öffentlich belegt ist.

Genehmigung und öffentliche Verfügbarkeit werden getrennt geführt.

Beispiel:

> **Niederschrift genehmigt · öffentlich nicht auffindbar**

### 13.3 Detailseite

TOP-zentriert:

- Gremium, Datum, Zeit, Ort, Niederschriftsstatus,
- alle öffentlichen RIS-TOPs,
- amtliche Unterlagen,
- verknüpfte FIB-Meldungen, Vorgänge und Themen,
- Presseberichte getrennt von amtlichen Quellen,
- vollständiger Beschlusstext und Abstimmungsergebnis, wenn belastbar aus lesbarer Niederschrift verfügbar.

## 14. Suche und Filter

### 14.1 Zentrale Suche

Ein Suchfeld durchsucht bzw. erschließt:

- Meldungen,
- Themen,
- Vorgänge,
- Sitzungen,
- TOPs/Entscheidungen,
- Bezugsobjekte/Orte,
- geeignete Quelleninhalte.

Ergebnisse werden primär nach **Relevanz**, nicht nur nach Datum sortiert und mit Inhaltstyp gekennzeichnet.

### 14.2 Beziehungs- und Aliaslogik

Suche berücksichtigt strukturierte Beziehungen und Aliase, z. B. B471 ↔ Oberndorfer Straße.

Wer nach einem Objekt sucht, soll auch den zugehörigen Vorgang, relevante Themen, Sitzungen/TOPs und Meldungen finden können, selbst wenn der Suchbegriff nicht in jedem Text wörtlich vorkommt.

Wenn viele ähnliche Meldungen zu demselben Vorgang gehören, soll die Suche den Vorgang als Wissensknoten bevorzugen und nur ausgewählte Meldungen ergänzen.

### 14.3 Globale Filter im MVP

Wenige verständliche Filter:

- Inhaltstyp,
- Zeitraum,
- Kategorie/Sachbereich, sofern beibehalten,
- optional Ort/Bezugsobjekt.

Nicht öffentlich gefiltert werden interne Relevanz, KI-Sicherheit, Freigabestatus oder redaktioneller Status.

### 14.4 Listenspezifische Filter

Meldungen: Suchwort, Zeitraum, Thema/Vorgang, Kategorie, **Beteiligung**, ggf. neu/aktualisiert seit letztem Besuch.

Themen/Vorgänge: Suchwort, ggf. seit letztem Besuch aktualisiert.

Sitzungen: Gremium, Zeitraum, Suchwort/TOP.

## 15. „Mehr wissen?“

Grundsatz:

> **„Mehr wissen?“ vertieft den konkreten Inhalt dort, wo der Nutzer gerade ist.**

Rollen:

- Meldung: Ereignis verstehen,
- Vorgang: Entwicklung verstehen,
- Thema: Zusammenhänge verstehen.

Zunächst werden etwa 4–6 besonders hilfreiche Fragen sichtbar; weitere können aufgeklappt werden.

Antworten zeigen kurze direkte Antwort, notwendigen Kontext, Quellen und Unsicherheit. Sachliche Vertiefung und „Unsere Einordnung“ bleiben getrennt.

Im MVP werden Fragen/Antworten vorbereitet und redaktionell geprüft. Freie Live-Fragen sind spätere Ausbaustufe.

Details: `docs/Mehr-wissen.md`.

## 16. PWA und „Neu seit letztem Besuch“

Drei getrennte Funktionen:

### 16.1 Neu seit letztem Besuch

- ohne Anmeldung,
- geräte-/browsergebunden,
- lokaler Besuchs-/Lesestatus,
- nur fachlich relevante Neuigkeiten zählen,
- Hinweise innerhalb der bestehenden Startseitenblöcke.

### 16.2 Push

- ausschließlich Opt-in,
- mindestens: wichtige FIB-Neuigkeiten und Beobachtung ausgewählter Themen/Vorgänge,
- nicht jede Meldung oder Aktualisierung erzeugt Push,
- Push öffnet direkt den betroffenen Inhalt und macht die neue Information sofort sichtbar.

### 16.3 Badge

Optional, soweit Plattform/Browser zuverlässig unterstützen. Badge zählt ungesehene fachlich relevante Neuigkeiten, ist aber keine MVP-Kernabhängigkeit.

Einstellungen bleiben einfach: Push an/aus, wichtige Meldungen, ausgewählte Themen/Vorgänge beobachten.

## 17. Teilen, Direktlinks, Druck und Social Preview

Alle öffentlichen Detailseiten sind teilbar:

- Meldung,
- Vorgang,
- Thema,
- Sitzung.

Native Teilen-Funktion wird mobil bevorzugt.

### 17.1 Zielgenauigkeit bei Aktualisierungen

Wird eine fachlich relevante Aktualisierung geteilt, muss der Empfänger unmittelbar erkennen, **was neu ist**, und darf nicht nur generisch auf einer langen Seite landen.

### 17.2 Social Preview

Vorschau enthält:

- Titel,
- kurze Zusammenfassung,
- FIB als Absender,
- geeignetes Inhaltsbild oder neutrales FIB-Motiv.

Vorgangs-/Themenvorschauen dürfen aktuellen Stand stärker betonen; Meldungsvorschauen das konkrete Ereignis.

### 17.3 Druck

Druckansicht enthält wesentliche Sachinformation, Datum/Aktualisierungsstand, Quellen, Einordnung und notwendigen Kontext – ohne Navigation, Push/PWA-Steuerung oder dekorative UI.

## 18. Transparenz / Über FIB / Disclaimer

Jede Meldung, jeder Vorgang, jedes Thema und jede Sitzung erhält einen kleinen, inhaltlich erreichbaren Transparenzzugang, bevorzugt als **i-Icon** wie im Demonstrator.

Eine zentrale Seite **„Über FIB“** erläutert:

- Zweck,
- Verantwortlichkeit,
- Quellenprinzip,
- KI-Unterstützung,
- redaktionelle Freigabe,
- Unsicherheiten/Korrekturen,
- Trennung Sachinformation / Einordnung,
- Kontakt.

Kurzprinzip:

> FIB bereitet öffentliche Informationen mit KI-Unterstützung auf. Veröffentlichungen werden redaktionell geprüft; Fehler oder Lücken sind trotzdem möglich. Maßgeblich bleiben die verlinkten Originalquellen.

KI-Transparenz erfolgt auf Systemebene, nicht mit einem KI-Hinweis an jedem Absatz.

Ein Footer ist nicht der einzige Transparenzzugang, weil er auf langen mobilen Listen zu leicht unsichtbar bleibt.

## 19. Bilder und visuelle Identität

### 19.1 Inhaltliche Bilder

- nur mit geklärten Nutzungsrechten,
- sachliche Bildunterschrift und Urheber-/Rechtehinweis,
- motivbezogener Alt-Text,
- keine wichtige Information ausschließlich im Bild.

### 19.2 Dekorative Standardmotive

Für Inhalte ohne eigenes Bild soll ein kleiner Pool dauerhaft nutzbarer, monochrom-grüner Feldkirchen-Motive entstehen. Dekorative Motive erhalten keinen unnötigen Screenreader-Text.

### 19.3 Offener G2-Punkt

Das verbindliche visuelle Identitäts- und Bildkonzept bleibt noch festzulegen:

- Logo oder typografische Wortmarke,
- Auswahl und Rollen mehrerer Standardmotive,
- Regeln Inhaltsfoto vs. Standardmotiv vs. kein Bild,
- Zuschnitt/Kontrast/mobile Nutzung,
- Social-Preview-Regeln,
- Rechte/Provenienz.

Ein Logo besteht derzeit noch nicht.

## 20. Responsive und barrierearme UX

### 20.1 Grundsatz

FIB wird **mobile first** konzipiert. Tablet und Desktop erweitern das Layout, verändern aber nicht die Informationslogik.

Technisches Ziel: **WCAG 2.2 AA**.

### 20.2 Verbindliche Anforderungen

- einspaltige Kernstruktur auf Smartphones,
- keine wichtigen Funktionen nur per Hover,
- keine horizontale Scrollbarkeit für normale Inhalte,
- ausreichend große Touch-/Klickziele,
- sichtbarer Tastaturfokus,
- vollständige Tastaturbedienbarkeit,
- semantisches HTML und korrekte Überschriftenhierarchie,
- ausreichender Kontrast,
- keine Information ausschließlich über Farbe oder Icon,
- skalierbare Schrift und robuste Vergrößerung,
- verständlich beschriftete Formulare/Filter,
- zugängliche Dialoge mit Fokusführung und Schließen per Tastatur,
- Alt-Texte für relevante Bilder.

### 20.3 Sprache

Barrierefreiheit erzeugt **keine konkurrierende zweite Sprachregel**. Maßgeblich bleiben die festgelegten bürgernahen und wissenschaftlich-politischen Sprachregeln in `docs/Sprachleitfaden.md`.

### 20.4 Verdichtung langer Seiten

Geeignet zum Einklappen:

- frühere Aktualisierungen,
- ältere Ereignisse eines Vorgangs,
- längere Quellenlisten,
- zusätzlicher Hintergrund,
- weitere „Mehr wissen?“-Fragen.

Nicht standardmäßig verstecken:

- aktuellen Sachstand,
- wesentliche neue Entwicklung,
- Kernquellen,
- zentrale Unsicherheiten,
- „Unsere Einordnung“.

## 21. Navigation und Dialogverhalten

Strukturierte Dialoge und modale Inhalte müssen auf kleinen Bildschirmen innerhalb des Viewports scrollbar bleiben; Schließen bleibt erreichbar.

Browser-Zurück soll bei tiefen Interaktionen möglichst nachvollziehbar zum vorherigen FIB-Zustand zurückführen. Demonstrator-spezifische JavaScript-History-Tricks werden nicht ungeprüft übernommen; das UX-Prinzip bleibt jedoch erhalten.

## 22. Bezugsobjekte

Bezugsobjekte wie B471/Oberndorfer Straße sind keine eigene Hauptnavigation.

Sie werden aus explizit geprüften Beziehungen erzeugt und können Meldungen, Vorgänge und Themen verknüpfen. Reine Volltexttreffer erzeugen keine Objektbeziehung.

Aliasnamen und räumliche Zuordnungen unterstützen Suche und Navigation.

## 23. Explizit zu bestätigende Felder

Als Ausgangspunkt gelten insbesondere:

- Vorgangsstatus,
- aktueller Stand,
- offene Punkte,
- nächste Schritte,
- wichtige Entscheidungen,
- Meldung ↔ Vorgang,
- Vorgang ↔ Thema,
- Wirkungsrolle,
- Themendefinition und wesentliche Änderung,
- neues Ereignis oder Aktualisierung,
- fachliche Aktualisierungsrelevanz,
- „Unsere Einordnung“,
- Abschluss eines Vorgangs.

Im MVP wird dafür nur **„explizite Bestätigung erforderlich: ja/nein“** konfiguriert; keine frei konfigurierbare Regel-Engine.

## 24. Datenmodell-Auswirkungen für G3

Mindestens erforderlich:

- stabile IDs/URLs für alle öffentlichen Objekte,
- eigenständige Entitäten Meldung, Vorgang, Thema, Sitzung/TOP,
- Meldung → Vorgang,
- n:m Vorgang ↔ Thema,
- optionale direkte Meldung ↔ Thema,
- Wirkungsrollen,
- aktueller Vorgangsstand und Statushistorie,
- versionierte Themendefinition,
- Perspektiven/Kontextdimensionen,
- offene Fragen/Wissenslücken,
- Aktualisierungsereignisse mit technischer/redaktioneller/fachlicher Art,
- Relevanz für Neu-seit-letztem-Besuch/Push,
- Entscheidungen,
- Bezugsobjekte/Aliase,
- Such-/Filtermetadaten,
- Pflichtbestätigungen,
- gerätebezogener Lesestatus,
- gespeicherte „Mehr wissen?“-Fragen/Antworten und Quellenrollen,
- Share-/SEO-/Social-Metadaten.

## 25. Noch offene G2-Punkte

Nach dieser Konsolidierung sind die fachlichen UX-Grundregeln für Suche, „Mehr wissen?“, PWA, Teilen, Transparenz und Barrierearmut festgelegt.

Vor G2-Abschluss bleiben:

1. **Visuelles Identitäts- und Bildkonzept**,
2. abschließende **Widerspruchs- und Vollständigkeitsprüfung** der gesamten G2-Dokumentation.

Danach kann G3 beginnen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 2.5 | 30.09.2026 | Demonstrator-Frontendregeln in kanonische UX-Quelle integriert; Suche/Filter, Mehr wissen, PWA, Teilen/Druck/Social Preview, Transparenz, Bildregeln und WCAG-2.2-AA-Ziel dokumentiert; Sprachregel abgegrenzt; offene G2-Punkte auf visuelles Konzept und Abschlussprüfung reduziert. |
| 2.4 | 30.09.2026 | Navigation auf Meldungen/Themen/Sitzungen/Suchen geändert; Themen und Vorgänge gemeinsam dargestellt; Vorgangsdetail und Themenlogik konsolidiert. |
| 2.3 | 29.09.2026 | Iterative Themendefinition ergänzt. |
| 2.2 | 29.09.2026 | Themen-Erkennung als sensitive Vorschlagslogik präzisiert. |
| 2.1 | 29.09.2026 | Themenbegriff bottom-up korrigiert. |
| 2.0 | 29.09.2026 | Meldungsdetailseite konsolidiert. |
| 1.9 | 29.09.2026 | Sitzungsdetailseite festgelegt. |
| 1.8 | 29.09.2026 | Niederschriftenlogik präzisiert. |
| 1.7 | 29.09.2026 | Sitzungsliste: Bezeichnung TOPs. |
| 1.6 | 29.09.2026 | Sitzungsliste reduziert. |
| 1.5 | 29.09.2026 | Frühere Themenlisten-/Statuslogik; später konsolidiert. |
| 1.4 | 29.09.2026 | Meldungsliste und Datumslogik konkretisiert. |
| 1.3 | 29.09.2026 | Startseitenlogik festgelegt. |
| 1.2 | 29.09.2026 | Nutzerwege ergänzt. |
| 1.1 | 29.09.2026 | Aktualisierungs- und Ereignislogik ergänzt. |
| 1.0 | 29.09.2026 | Initiale UX- und Informationsarchitektur angelegt. |
