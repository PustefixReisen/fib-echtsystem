# UX und Informationsarchitektur – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 3.0 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für öffentliche Benutzerführung, Informationsarchitektur, grundlegende Darstellungsregeln und responsive/barrierearme UX des FIB-Echtsystems.

Ergänzende Primärquellen:

- Themen- und Vorgangslogik: `docs/Themen-und-Vorgangslogik.md`
- „Mehr wissen?“: `docs/Mehr-wissen.md`
- Fachlichkeit: `docs/Fachkonzept.md`
- SEO: `docs/SEO-und-Auffindbarkeit.md`
- visuelle Identität: `docs/Visuelle-Identitaet-und-Bildkonzept.md`
- fachliches Datenmodell: `docs/Datenmodell.md`

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

## 4. Einstiegswege und Rücksprung zur GRÜNEN-Homepage

Mögliche Einstiege:

- direkter FIB-Aufruf bzw. installierte PWA,
- Aufruf aus der Website der GRÜNEN Feldkirchen,
- Suchmaschine,
- geteilter Direktlink,
- QR-Code,
- Push,
- später Newsletter und weitere Kanäle.

Daraus folgt:

> **Jede öffentliche Inhaltsseite muss als eigenständiger Einstieg funktionieren.**

Die Startseite darf nicht vorausgesetzt werden. Meldungen, Vorgänge, Themen und Sitzungen erhalten stabile Identitäten und eigenständige URLs.

FIB bleibt unabhängig vom Einstiegsweg dieselbe Anwendung.

Beim **direkten Einstieg** – insbesondere PWA, Direktlink, QR-Code oder Suchmaschine – erscheint auf der Startseite unmittelbar **unter dem Banner** eine kompakte, visuell untergeordnete Leiste:

> **Zur Website der GRÜNEN in Feldkirchen**

Die Leiste gehört weder zum Banner noch zur FIB-Hauptnavigation. Sie kann das Sonnenblumenlogo der GRÜNEN enthalten und verwendet einen ruhigen grünen Hintergrund mit ausreichend kontrastierender Schrift.

Wird FIB **bereits innerhalb bzw. aus der Website der GRÜNEN Feldkirchen aufgerufen**, entfällt diese Leiste, weil die übergeordnete Website-Navigation bereits vorhanden ist.

## 5. Hauptnavigation

Verbindliche öffentliche Hauptnavigation:

- **Neues**
- **Im Blick**
- **Sitzungen**
- **Suche**

Diese Begriffe sind bewusst nutzerorientierte Navigationsbezeichnungen. Die internen fachlichen Objekttypen bleiben **Meldung**, **Vorgang**, **Thema** und **Sitzung**.

**„Aktuell“** ist kein eigener Hauptbereich, sondern eine zeitliche Hervorhebung.

### 5.1 Neues

Enthält die vollständige Liste veröffentlichter Meldungen. „Neues“ bezeichnet den öffentlichen Einstieg in die Meldungsebene und bedeutet nicht, dass nur heute oder erst kürzlich veröffentlichte Inhalte auffindbar sind.

Icon: **fünf gelbe strahlen-/blattartige Formen im Bogen**, ohne Text und ohne Hintergrund; keine volle Sonne und kein zusätzlicher Halbkreis.

### 5.2 Im Blick

Zeigt eine gemeinsame Liste aus:

- übergeordneten Themen,
- konkreten länger laufenden Vorgängen.

Die Bezeichnung „Im Blick“ beschreibt die Nutzerfunktion: **Zusammenhänge und länger laufende Entwicklungen verstehen**. Die interne Unterscheidung zwischen Thema und Vorgang bleibt verbindlich, wird öffentlich aber nicht überbetont. Dezente Labels sind möglich, wenn sie helfen.

Ein Vorgang darf auch ohne übergeordnetes Thema erscheinen.

Icon: **Auge**.

### 5.3 Sitzungen

Zeigt transparent, was ansteht, welche Unterlagen vorliegen, was beraten bzw. beschlossen wurde und was offen bleibt.

Tagesordnung, Vorlage, Beratung, Beschluss und Niederschrift bleiben unterscheidbar.

Icon: **Personengruppe/Gremium**.

### 5.4 Suche

Eine zentrale Suche erschließt die öffentlichen Inhalte über Text und strukturierte Beziehungen.

Icon: **Lupe**.

## 6. Startseite

Drei feste Inhaltsblöcke:

1. **Neue Entwicklungen** – neue und fachlich relevant aktualisierte Meldungen.
2. **Anstehende Sitzungen** – nächste tatsächlich bevorstehende Sitzungen.
3. **Im Blick** – fachlich relevante Themen und Vorgänge mit neuem bzw. geändertem Wissensstand.

Die Begriffe dürfen in der konkreten UI geringfügig verkürzt werden, solange die fachliche Logik unverändert bleibt.

„Seit letztem Besuch“ wird innerhalb dieser Blöcke angezeigt, nicht als vierter Block.

> **Startseite = Orientierung und Auswahl**  
> **Listenansicht = Überblick und Vergleich**  
> **Detailseite = Verständnis und Vertiefung**

### 6.1 Banner auf Smartphone/PWA

Das Smartphone ist das voraussichtlich wichtigste Nutzungsgerät.

Der mobile Banner enthält:

- Wortmarke **„Feldkirchen im Blick“**,
- Claim **„Mehr Überblick. Besser verstehen.“**,
- Kurzbeschreibung **„Aktuelles aus Rathaus, Presse und weiteren Quellen – verständlich zusammengeführt.“**,
- die freigegebene Bannerillustration als Hintergrund-/Bildbestandteil.

Text und Illustration bleiben technisch getrennt. Der Text liegt auf einer sehr hellen halbtransparenten Fläche über der etwas tiefer positionierten Illustration. Das Bild bleibt sichtbar; der Banner soll den ersten mobilen Bildschirm nicht dominieren.

Die kompakte GRÜNEN-Leiste folgt bei direktem Einstieg unmittelbar unter dem Banner.

### 6.2 Banner auf Tablet/Desktop

Der Banner wird als echter responsiver Zwei-Spalten-Banner aufgebaut:

- links Wortmarke, Claim und ausführlicher Erklärungstext,
- rechts die freigegebene Illustration.

Der Container besitzt eine begrenzte Maximalbreite; Richtwert **1280 px**. Auf sehr breiten Bildschirmen wird nicht unbegrenzt vergrößert. Zusätzlicher Raum bleibt seitlich frei.

Richtwerte:

- Tablet ca. **48 % Text / 52 % Illustration**,
- Desktop ca. **45 % Text / 55 % Illustration**.

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

Die Meldungsdetailseite trennt den aktuellen Sachstand, den Verlauf, noch offene Sachfragen, Vertiefung und Beziehungen zu anderen FIB-Inhalten.

### 9.1 Gemeinsame Bausteine

Je nach Inhalt können folgende Bausteine erscheinen:

1. Titel
2. Datum
3. Kurzfassung
4. Worum geht es? / Sachinformation
5. Quellen
6. **Was bisher passiert ist**
7. **Offene Fragen**
8. Unsere Einordnung
9. Mehr wissen?
10. **Zusammenhänge**
11. **Bezüge**

Nicht jeder optionale Baustein muss bei jeder Meldung erscheinen. Fehlt ein fachlicher Inhalt, wird kein leerer Abschnitt erzeugt.

### 9.2 „Was bisher passiert ist“

Dieser Baustein zeigt frühere **fachlich relevante Ereignisse bzw. daraus entstandene Meldungen**, die zum Verständnis der aktuellen Meldung beitragen.

Er ist kein Ersatz für den vollständigen Vorgangsverlauf. Er ist eine kompakte, meldungsbezogene Orientierung und wird aus den strukturierten Beziehungen zum zugrunde liegenden Vorgang bzw. zu früheren Ereignissen erzeugt.

Verbindlich gilt:

- die aktuelle Meldung selbst erscheint nicht im eigenen Rückblick,
- nur tatsächlich relevante frühere Schritte werden gezeigt,
- Einträge sind nach Möglichkeit direkt mit der früheren Meldung oder dem entsprechenden Ereignis/Vorgang verlinkt,
- eine Folgemeldung kann zusätzlich einen knappen **Bisherigen Stand** im Fließtext enthalten; dieser ersetzt den verlinkten Rückblick nicht, wenn mehrere frühere relevante Schritte vorhanden sind.

### 9.3 „Offene Fragen“

**Offene Fragen** zeigen, was am Sachverhalt selbst noch ungeklärt, noch nicht entschieden, noch nicht belastbar belegt oder noch nicht bekannt ist.

Sie sind von „Mehr wissen?“ zu unterscheiden:

- **Offene Frage** = offene Sachfrage des Ereignisses/Vorgangs/Themas,
- **Mehr wissen?** = zusätzlicher Erkenntnisweg für Besucher.

Eine offene Frage darf auch eine plausible, noch nicht geklärte Wechselwirkung zu einem anderen Vorgang benennen, wenn sie ausdrücklich als offen bzw. bedingt gekennzeichnet ist. Beispiel: mögliche Auswirkungen einer Hundehaltungsverordnung auf Bedarf oder Ausgestaltung von Freilaufflächen.

Aufgelöste offene Fragen verschwinden nicht spurlos aus der fachlichen Historie; öffentlich wird grundsätzlich nur der aktuelle offene Stand gezeigt, sofern die frühere Frage nicht für den Verlauf erklärungsrelevant bleibt.

### 9.4 „Zusammenhänge“

Der Abschnitt **„Zusammenhänge“** zeigt die fachliche Einordnung der Meldung in die FIB-Wissensstruktur. Er enthält nur tatsächlich vorhandene strukturierte Beziehungen, insbesondere:

- **Vorgang** – der konkrete länger laufende Sachverhalt, zu dem das zugrunde liegende Ereignis gehört,
- **Thema** – übergeordnete Fragestellungen, in denen das Ereignis über einen Vorgang oder als zusätzlich relevantes Ereignis berücksichtigt wird,
- **Sitzung/TOP** – die konkrete Sitzung bzw. der Tagesordnungspunkt, wenn das Ereignis damit fachlich verknüpft ist.

Diese Einträge sind als direkte Links zu den jeweiligen FIB-Detailseiten auszugeben. Fehlt eine Beziehung, wird dafür kein Platzhalter gezeigt.

`Meldung → Vorgang` und `Meldung → Thema` werden nicht als eigenständige parallele Fachbeziehungen gespeichert, sondern aus den Beziehungen des zugrunde liegenden Ereignisses abgeleitet. Die öffentliche Darstellung darf diese Ableitung für Besucher vereinfachen, ohne das Datenmodell zu verfälschen.

### 9.5 „Bezüge“

Der öffentliche Abschnitt **„Bezüge“** ist enger definiert. Er bündelt geprüfte strukturierte Beziehungen der Meldung zu wiederkehrenden konkreten **Bezugsobjekten und Orten**, z. B. B471/Oberndorfer Straße, A99 oder A94.

Damit gilt die Trennung:

- **Zusammenhänge** → Vorgang, Thema, Sitzung/TOP,
- **Bezüge** → konkrete wiederkehrende Objekte/Orte,
- **Quellen** → Belege für Aussagen.

Reine Volltextnennungen erzeugen weder einen Zusammenhang noch einen Bezug. Die zugrunde liegende fachliche Beziehung muss jeweils vorhanden bzw. geprüft sein.

Ein Bezugsobjekt kann seinerseits zu weiteren passenden Meldungen, Vorgängen und Themen führen. Dadurch entsteht Navigation über ein konkretes Objekt, ohne dass das Objekt selbst als Vorgang oder Thema behandelt wird.

### 9.6 Erstmeldung

Eine Erstmeldung kann in kompakter Form erscheinen. „Was bisher passiert ist“ entfällt, wenn es keinen relevanten Vorlauf gibt. Offene Fragen, Mehr wissen?, Zusammenhänge und Bezüge werden nur angezeigt, wenn entsprechende Inhalte vorhanden sind.

### 9.7 Folgemeldung

Zusätzlich zum gemeinsamen Aufbau wird die neue Entwicklung prominent dargestellt:

1. Titel
2. Datum
3. Kurzfassung
4. **Was ist neu?**
5. **Bisheriger Stand** – nur notwendiger Kontext im Fließtext
6. aktueller Sachstand
7. Quellen
8. optional **Was bisher passiert ist** als verlinkter Rückblick
9. optional **Offene Fragen**
10. Unsere Einordnung
11. Mehr wissen?
12. Zusammenhänge
13. Bezüge

### 9.8 Aktualisierte bestehende Meldung

Unter Datumszeile und Kurzfassung wird die neue fachliche Information prominent dargestellt, danach der aktuelle Gesamtstand. Frühere fachliche Aktualisierungen bleiben über die Aktualisierungshistorie nachvollziehbar.

## 10. Gemeinsame Themen-/Vorgangsliste

Die unter **„Im Blick“** erreichbare Liste zeigt Themen und Vorgänge gemeinsam und beantwortet: **Was beschäftigt Feldkirchen länger – und wie hängen Entwicklungen zusammen?**

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
4. Bisheriger Verlauf – automatisch aus verknüpften Ereignissen und daraus abgeleiteten Meldungen
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
3. **Was prägt das Thema derzeit?** – wichtige Vorgänge und direkt ergänzte Ereignisse mit ihrer **Bedeutung für das Thema**, Stand und letzter Entwicklung.
4. **Perspektiven des Themas** – themenspezifisch, nicht global starr.
5. **Was wissen wir derzeit?** – kompakte Synthese.
6. **Was ist noch offen?** – Wissenslücken/offene Fragen.
7. **Hintergrund und Kontext** – nur bei Erklärungsgewinn.
8. **Mehr wissen?**
9. **Unsere Einordnung**
10. **Neueste Entwicklungen** – kompakte Meldungsliste.

Nicht alle Themenbestandteile werden gleichrangig dargestellt; ihre redaktionell bestätigte **Bedeutung für das Thema** (`prägend`, `relevant`, `ergänzend`) beeinflusst die Gewichtung. Perspektiven und Wirkungen erklären sachlich, warum ein Vorgang oder direkt ergänztes Ereignis für das Thema relevant ist. Eine separate Wirkungsrollen-Taxonomie wird nicht verwendet.

Zusätzlich gibt es **„Alle Entwicklungen zum Thema“** als automatisch erzeugte Chronologie aus Ereignissen der zugehörigen Vorgänge sowie direkt dem Thema zugeordneten weiteren Ereignissen und den daraus abgeleiteten Meldungen.

Konkrete Entwicklungen aus Nachbargemeinden oder dem regionalen Umfeld können sichtbar als Themenbestandteil bzw. Beispiel erscheinen, wenn ihr Erklärungswert für die Feldkirchner Leitfrage belegt ist. Fremder Ort und Feldkirchen-Bezug müssen transparent bleiben; eine externe Entwicklung wird nicht als Feldkirchner Ereignis umetikettiert.

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

Antworten zeigen kurze direkte Antwort, notwendigen Kontext, Quellen und Unsicherheit. Sachliche Vertiefung und „Unsere Einordnung“ bleiben getrennt. Fehlende Quellenbasis wird nicht durch scheinbar sicheres allgemeines Modellwissen ersetzt; verbindliche Detailregel in `docs/Mehr-wissen.md`.

Im MVP werden Fragen/Antworten vorbereitet und redaktionell geprüft. Freie Live-Fragen sind spätere Ausbaustufe.

Details: `docs/Mehr-wissen.md`.

## 16. PWA und „Neu seit letztem Besuch“

Drei getrennte Funktionen:

### 16.1 Neu seit letztem Besuch

- ohne Anmeldung,
- geräte-/browsergebunden,
- lokaler Besuchs-/Lesestatus,
- neue Meldungen und **fachlich relevante Aktualisierungen** bestehender Meldungen zählen als Neuigkeit,
- rein technische oder redaktionelle Änderung zählt nicht,
- Hinweise innerhalb der bestehenden Startseitenblöcke.

### 16.2 Push

- ausschließlich Opt-in,
- mindestens: wichtige FIB-Neuigkeiten und Beobachtung ausgewählter Themen/Vorgänge,
- nicht jede Meldung oder Aktualisierung erzeugt Push,
- Push öffnet direkt den betroffenen Inhalt und macht die neue Information sofort sichtbar.

### 16.3 Badge

Optional, soweit Plattform/Browser zuverlässig unterstützen. Badge zählt ungesehene fachlich relevante Neuigkeiten, ist aber keine MVP-Kernabhängigkeit. Maßgeblich bleibt die FIB-interne Neuigkeitslogik; das Betriebssystem kann statt einer exakten Zahl auch nur einen Punkt oder anderen Hinweis unterstützen.

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
- Feldkirchen im Blick als Absender,
- geeignetes Inhaltsbild oder neutrales FIB-Motiv.

Vorgangs-/Themenvorschauen dürfen aktuellen Stand stärker betonen; Meldungsvorschauen das konkrete Ereignis.

### 17.3 Druck

Druckansicht enthält wesentliche Sachinformation, Datum/Aktualisierungsstand, Quellen, Einordnung und notwendigen Kontext – ohne Navigation, Push/PWA-Steuerung oder dekorative UI.

## 18. Transparenz / Über Feldkirchen im Blick / Disclaimer

Jede Meldung, jeder Vorgang, jedes Thema und jede Sitzung erhält einen kleinen, inhaltlich erreichbaren Transparenzzugang, bevorzugt als **i-Icon** wie im Demonstrator.

Eine zentrale Seite **„Über Feldkirchen im Blick“** erläutert:

- Zweck,
- Verantwortlichkeit,
- Quellenprinzip,
- KI-Unterstützung,
- redaktionelle Freigabe,
- Unsicherheiten/Korrekturen,
- Trennung Sachinformation / Einordnung,
- Kontakt.

Kurzprinzip:

> Feldkirchen im Blick bereitet öffentliche Informationen mit KI-Unterstützung auf. Veröffentlichungen werden redaktionell geprüft; Fehler oder Lücken sind trotzdem möglich. Maßgeblich bleiben die verlinkten Originalquellen.

KI-Transparenz erfolgt auf Systemebene, nicht mit einem KI-Hinweis an jedem Absatz.

Ein Footer ist nicht der einzige Transparenzzugang, weil er auf langen mobilen Listen zu leicht unsichtbar bleibt.

## 19. Bilder und visuelle Identität

Die verbindliche gestalterische Primärquelle ist `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

### 19.1 Inhaltliche Bilder

- nur mit geklärten Nutzungsrechten,
- sachliche Bildunterschrift und Urheber-/Rechtehinweis,
- motivbezogener Alt-Text,
- keine wichtige Information ausschließlich im Bild.

### 19.2 Dekorative Standardmotive

Für Inhalte ohne eigenes Bild kann ein kleiner Pool dauerhaft nutzbarer Feldkirchen-Motive verwendet werden. Die visuelle Primärquelle legt Stil, Motivgruppen und Rollen fest. Dekorative Motive erhalten keinen unnötigen Screenreader-Text.

### 19.3 Gestalterische Grundrichtung

Verbindlich sind insbesondere:

- heller, warmer Grund,
- ruhige und sachliche Oberfläche,
- lokale Feldkirchen-Motive,
- Sonnenblumenblätter als wiederkehrender grafischer roter Faden,
- Primärgrün und Sonnenblumengelb; Blau nur als zurückhaltender funktionaler Akzent,
- FIB-Bildmarke mit abstrahiertem Rathaus, Kirche, Bäumen/Bodenlinie und drei Sonnenblumenblättern; **kein Maibaum**,
- Navigation „Neues“ mit fünf gelben Strahlen/Blättern im Bogen und „Im Blick“ mit Auge.

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

Der explizite Link **„Zur Website der GRÜNEN in Feldkirchen“** ist davon getrennt: Er verlässt FIB bewusst und führt zur übergeordneten Website. Seine Sichtbarkeit richtet sich nach dem Einstiegskontext gemäß Abschnitt 4.

## 22. Bezugsobjekte

Bezugsobjekte wie B471/Oberndorfer Straße sind keine eigene Hauptnavigation.

Sie werden aus explizit geprüften Beziehungen erzeugt und können Meldungen, Vorgänge und Themen verknüpfen. Reine Volltexttreffer erzeugen keine Objektbeziehung.

Aliasnamen und räumliche Zuordnungen unterstützen Suche und Navigation.

Öffentlich werden sie auf passenden Detailseiten im Abschnitt **„Bezüge“** angeboten. Ein Eintrag öffnet bzw. erschließt das konkrete Bezugsobjekt und die damit verknüpften FIB-Inhalte. Die Beziehung muss redaktionell bzw. fachlich explizit bestätigt sein; bloße Namensgleichheit reicht nicht.

## 23. Explizit zu bestätigende Felder

Als Ausgangspunkt gelten insbesondere:

- Vorgangsstatus,
- aktueller Stand,
- offene Punkte,
- nächste Schritte,
- wichtige Entscheidungen,
- Ereignis ↔ Vorgang,
- Vorgang ↔ Thema,
- direktes Ereignis ↔ Thema,
- **Bedeutung für das Thema** bei Vorgang bzw. direkt ergänztem Ereignis,
- Themendefinition und wesentliche Änderung,
- neues Ereignis oder Aktualisierung,
- fachliche Aktualisierungsrelevanz,
- „Unsere Einordnung“,
- Abschluss eines Vorgangs.

Im MVP wird dafür nur **„explizite Bestätigung erforderlich: ja/nein“** konfiguriert; keine frei konfigurierbare Regel-Engine.

## 24. Datenmodell-Auswirkungen für G3

Mindestens erforderlich:

- stabile IDs/URLs für alle öffentlichen Objekte,
- eigenständige Entitäten **Ereignis, Meldung, Vorgang, Thema, Sitzung/TOP**,
- Ereignis → Meldung `0..1`, Meldung → Ereignis genau `1`,
- n:m Ereignis ↔ Vorgang; Meldungszugehörigkeit zum Vorgang wird daraus abgeleitet,
- n:m Vorgang ↔ Thema,
- optionale direkte Ereignis ↔ Thema-Beziehung als Zusatzweg,
- redaktionell bestätigte **Bedeutung für das Thema** (`prägend`, `relevant`, `ergänzend`) für Vorgang ↔ Thema und direktes Ereignis ↔ Thema,
- keine separate Wirkungsrollen-Taxonomie,
- aktueller Vorgangsstand und Statushistorie,
- versionierte Themendefinition,
- Perspektiven und Wirkungen,
- **persistente offene Fragen/Wissenslücken mit Bezug zu Meldung, Vorgang oder Thema sowie Status und Auflösung**,
- **ableitbare bzw. gespeicherte Verlaufselemente für „Was bisher passiert ist“**,
- Aktualisierungsereignisse mit technischer/redaktioneller/fachlicher Art,
- Relevanz für Neu-seit-letztem-Besuch/Push,
- Entscheidungen,
- Bezugsobjekte/Aliase,
- **Bildbibliothek mit Bildmetadaten, Rechte-/Freigabestatus, Primärzuordnung, weiteren zulässigen Verwendungen und Nutzungsausschlüssen**,
- Such-/Filtermetadaten,
- Pflichtbestätigungen,
- gerätebezogener Lesestatus,
- gespeicherte „Mehr wissen?“-Fragen/Antworten und Quellenrollen,
- Share-/SEO-/Social-Metadaten.

Die fachlichen Kardinalitäten und Modellbegriffe werden verbindlich in `docs/Datenmodell.md` geführt; dieser Abschnitt benennt nur UX-Auswirkungen.

## 25. G2-Abschluss

Die fachlichen UX-Grundregeln, Navigation, responsive Bannerlogik, visuelle Grundrichtung, Claim, Rücksprung zur GRÜNEN-Homepage und wesentlichen Screenprinzipien sind konsolidiert und widerspruchsfrei dokumentiert.

Konzeptionelle G2-Offenpunkte bestehen nicht mehr.

Produktionsdetails wie exakte SVG-Vektorisierung der Logos, finale Webfont-Implementierung, optimierte Bannerformate, maskable App-Icons oder konkrete CSS-Feinwerte werden in der späteren technischen Umsetzung verifiziert und blockieren den G2-Abschluss nicht.

**G2 ist damit abgeschlossen.** Die G2.5-Korrekturen vom 03./04.10.2026 ändern keine UX-Grundentscheidung, sondern synchronisieren Terminologie, Demonstrator-Inhaltsbausteine und Datenmodellbezüge mit den späteren G3-Entscheidungen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 3.0 | 04.10.2026 | Zweiten Transfer-Audit abgeschlossen: öffentliche Meldungsbeziehungen in „Zusammenhänge“ (Vorgang/Thema/Sitzung-TOP) und „Bezüge“ (konkrete Objekte/Orte) getrennt; direkte Links zu strukturiert verbundenen FIB-Inhalten festgelegt; IA-026 geschlossen. |
| 2.9 | 04.10.2026 | Zweiter Demonstrator-Transfer-Audit: Meldungsbausteine „Was bisher passiert ist“, „Offene Fragen“ und „Bezüge“ verbindlich ergänzt; Abgrenzung „Offene Fragen“ zu „Mehr wissen?“ festgelegt; Nachbarereignisse als mögliche sichtbare Themenbestandteile präzisiert; G3-Auswirkungen für Wissenslücken, Verlauf und Bildbibliothek ergänzt. |
| 2.8 | 03.10.2026 | G2.5-Konsistenzkorrektur: alte Wirkungsrollen- und Meldung-Direktbeziehungen durch aktuelles G3-Modell ersetzt; „Bedeutung für das Thema“, direkte Ereignis-Thema-Beziehung, Ereignis-Meldung-/Ereignis-Vorgang-Logik und präzisierte Neuigkeitsregel für PWA gespiegelt; keine Änderung der abgeschlossenen G2-UX-Grundentscheidungen. |
| 2.7 | 01.10.2026 | G2 finalisiert: mobile und Desktop-Bannerlogik integriert, kontextabhängige GRÜNEN-Leiste korrigiert, „Neues“-Icon auf fünf gelbe Strahlen/Blätter umgestellt, Maibaum aus finaler Bildmarke entfernt und G2 nach Widerspruchsprüfung abgeschlossen. |
| 2.6 | 01.10.2026 | Öffentliche Navigation auf „Neues | Im Blick | Sitzungen | Suche“ konsolidiert; interne Fachbegriffe davon abgegrenzt; Rücksprung zur GRÜNEN-Website als UX-Regel ergänzt; visuelle Identität als Primärquelle eingebunden; offene G2-Punkte auf Bannertext und Abschlussprüfung reduziert. |
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
