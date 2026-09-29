# UX und Informationsarchitektur – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.4 | 29.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für öffentliche Benutzerführung, Informationsarchitektur und grundlegende UX-Prinzipien des FIB-Echtsystems.

Der Demonstrator dient als Referenz, ist aber kein unveränderlicher UI-Blueprint.

## 2. Leitidee

> **FIB soll nicht primär Dokumente oder Beiträge präsentieren, sondern den aktuellen Wissensstand zu einem Sachverhalt erschließen.**

Die öffentlichen Ebenen haben unterschiedliche Aufgaben:

- **Beitrag:** Was ist neu?
- **Thema:** Wo stehen wir?
- **Sitzung:** Was wird beraten oder entschieden?
- **Mehr wissen?:** Was steckt dahinter?

Diese Funktionen sollen fachlich und gestalterisch klar unterscheidbar bleiben.

## 3. Zentrale Nutzeraufgaben

FIB muss insbesondere folgende Nutzerfragen unterstützen:

1. Was gibt es Neues in Feldkirchen?
2. Was ist bei einem bestimmten Thema der aktuelle Stand?
3. Was wird demnächst beraten oder entschieden?
4. Warum ist diese Meldung wichtig?
5. Ich möchte es genauer verstehen.
6. Ich möchte künftig nichts dazu verpassen.
7. Ich suche etwas Bestimmtes.

## 4. Einstiegswege

Nutzer können FIB auf unterschiedlichen Wegen betreten:

- direkter Aufruf von FIB,
- Suchmaschine,
- geteilter Direktlink,
- QR-Code,
- Push-Benachrichtigung,
- später gegebenenfalls Newsletter oder weitere Verbreitungskanäle.

Daraus folgt:

> **Jede einzelne Inhaltsseite muss als eigenständiger Einstieg funktionieren.**

Die Startseite darf nicht vorausgesetzt werden.

Beiträge, Themen und Sitzungen benötigen daher stabile Identitäten, eigenständige URLs und verständlichen Kontext auch bei direktem Einstieg.

## 5. Vorgesehene öffentliche Grundstruktur

Als Ausgangspunkt für die weitere G2-Konzeption gelten vier Hauptzugänge:

- **Aktuell**
- **Themen**
- **Sitzungen**
- **Suchen**

Die konkrete Menügestaltung wird erst nach Durcharbeitung der Nutzerwege endgültig festgelegt.

### 5.1 Aktuell

Der Einstieg „Aktuell“ soll nicht nur eine endlose chronologische Beitragsliste zeigen.

Er soll mindestens unterscheiden können zwischen:

- neu seit dem letzten Besuch,
- wichtigen aktuellen Entwicklungen,
- zuletzt aktualisierten Vorgängen,
- weiteren aktuellen Meldungen.

Wichtige Aktualisierungen älterer Vorgänge dürfen nicht allein wegen des ursprünglichen Veröffentlichungsdatums weit nach unten rutschen.

### 5.2 Themen

Themenseiten sollen primär die Frage beantworten:

> **Wo stehen wir bei diesem Thema?**

Vorgesehene Informationsbausteine sind insbesondere:

- aktueller Stand,
- wichtigste Entwicklungen,
- offene Punkte,
- relevante Entscheidungen,
- zugehörige Beiträge,
- Quellen und Bezüge,
- „Mehr wissen?“.

Die genaue Struktur wird in G2 weiterentwickelt.

### 5.3 Sitzungen

Die Sitzungsebene soll transparent zeigen:

- was ansteht,
- welche Unterlagen vorliegen,
- was beraten wurde,
- was beschlossen wurde,
- was noch offen ist.

Tagesordnung, Beschlussvorlage, Beratung, Beschluss und spätere Niederschrift müssen fachlich und visuell klar unterscheidbar sein.

### 5.4 Suchen

Für Nutzer soll möglichst eine einfache gemeinsame Suche angeboten werden.

Intern kann sie strukturierte Felder nutzen, insbesondere:

- Volltext,
- Thema,
- Ort,
- Kategorie,
- Bezugsobjekt.

Die technische Umsetzung wird später festgelegt.

## 6. Beitrag als Einstiegsknoten

Ein Beitrag soll nicht nur Nachrichtentext sein, sondern als Einstieg in den gesamten Sachzusammenhang funktionieren.

Als Ausgangspunkt gilt folgende Informationshierarchie:

1. Überschrift,
2. Kurzfassung,
3. Was ist neu?,
4. Sachinformation,
5. Quellen,
6. Unsere Einordnung,
7. Mehr wissen?,
8. Zusammenhang / zugehörige Themen, Sitzungen und Bezüge.

Die endgültige Reihenfolge und Darstellung wird anhand der Nutzerwege geprüft.

## 7. Aktualisierungen

Bei aktualisierten Beiträgen soll der neue Informationswert unmittelbar erkennbar sein.

Beispielprinzip:

> **Neu seit 17. September:** Die veröffentlichte Beschlussvorlage enthält jetzt konkrete Angaben zu Schallschutzkosten und einer Park-Alternative.

Nutzer sollen nicht selbst alte und neue Textfassungen vergleichen müssen.

Daraus folgt als Anforderung für G3:

- Aktualisierungen müssen strukturiert und historisierbar modelliert werden,
- ein bloßes Änderungsdatum reicht voraussichtlich nicht aus.

### 7.1 Technische Änderung, redaktionelle Aktualisierung, fachliche Neuigkeit

FIB unterscheidet drei Ebenen:

- **technische Änderung** – z. B. Tippfehler, Linkkorrektur oder interne Metadatenänderung; erzeugt keine öffentliche Neuigkeit,
- **redaktionelle Aktualisierung** – z. B. Präzisierung oder zusätzliche Quelle ohne neuen Sachstand; wird historisiert, aber normalerweise nicht als „neu“ hervorgehoben,
- **fachliche Aktualisierung** – z. B. neue Vorlage, neuer Beschluss, neue Kostenangabe oder geänderter Planungsstand; kann öffentlich als neue Entwicklung erscheinen.

Für „Neu seit letztem Besuch“, Sortierung und Push ist daher nicht das technische Änderungsdatum maßgeblich, sondern die fachlich relevante Aktualisierung.

### 7.2 Aktualisierung oder neuer Beitrag

Verbindliche Grundregel:

> **Ein Beitrag steht für ein eigenständiges berichtenswertes Ereignis. Neue Informationen zum selben Ereignis aktualisieren den bestehenden Beitrag. Ein neues eigenständiges Ereignis mit ausreichendem Nachrichtenwert erzeugt einen neuen Beitrag.**

Die Entscheidung erfolgt zweistufig:

1. **Ist es ein neues Ereignis?**
   - Nein: bestehenden Beitrag aktualisieren.
   - Ja: weiter zu Schritt 2.
2. **Hat dieses Ereignis eigenen Nachrichtenwert für FIB?**
   - Ja: neuer Beitrag.
   - Nein: bestehenden Beitrag, Sitzungseintrag oder Themenstand aktualisieren.

Beispiele:

- zusätzliche Kostenangabe zu derselben veröffentlichten Vorlage → bestehenden Beitrag aktualisieren,
- Korrektur eines Links → technische Änderung, keine öffentliche Neuigkeit,
- Gemeinderat fasst später einen Beschluss → neues eigenständiges Ereignis, in der Regel neuer Beitrag,
- Umsetzung beginnt Monate später → neues eigenständiges Ereignis, in der Regel neuer Beitrag,
- reine Terminverschiebung ohne weiteren Nachrichtenwert → meist Aktualisierung statt neuer Beitrag.

Mehrere Beiträge zu demselben länger laufenden Sachverhalt bleiben über Thema/Vorgang und Ereignisbeziehungen miteinander verbunden.

## 8. Nutzerweg 2 – aktueller Stand eines Themas

Eine Themenseite ist keine bloße Sammlung verknüpfter Beiträge, sondern eine eigenständige Sachstandsseite.

Sie beantwortet zuerst:

- worum geht es,
- wo stehen wir aktuell,
- was ist zuletzt passiert,
- was ist noch offen.

Vorgesehene Struktur:

1. Themenkopf mit Kurzbeschreibung,
2. aktueller Stand,
3. letzte wesentliche Entwicklung,
4. Verlauf wichtiger Ereignisse,
5. offene Punkte / nächste belegte Schritte,
6. wichtige Entscheidungen,
7. zugehörige Beiträge und Sitzungen,
8. themenbezogenes „Mehr wissen?“,
9. themenbezogene „Unsere Einordnung“.

Der aktuelle Stand ist der kumulierte Wissensstand und nicht einfach der jüngste Beitrag.

„Offene Punkte“ und „nächste Schritte“ dürfen nur aus belegbaren Informationen abgeleitet werden. Vermutungen werden nicht als offene oder bevorstehende Schritte dargestellt.

Neue relevante Ereignisse lösen automatisch einen KI-Vorschlag zur Fortschreibung des aktuellen Stands, der offenen Punkte, der nächsten Schritte und gegebenenfalls der themenbezogenen Einordnung aus. Veröffentlichung erfolgt erst nach redaktioneller Prüfung und Freigabe.

Beitragsbezogene und themenbezogene politische Einordnungen werden getrennt behandelt:

- **beitragsbezogen:** Bewertung einer konkreten neuen Entwicklung,
- **themenbezogen:** grundsätzliche politische Position zum länger laufenden Thema.

## 9. Nutzerweg 3 – direkter Einstieg über einen Beitrag

Jeder Beitrag muss ohne vorherigen Besuch der Start- oder Themenseite verständlich sein.

Dabei wird zwischen Erst- und Folgebeitrag unterschieden:

- **Erstbeitrag:** erklärt den Grundkontext ausführlicher.
- **Folgebeitrag:** fokussiert auf die neue Entwicklung und enthält nur den unmittelbar nötigen Rückblick.
- **Themenseite:** enthält den vollständigen Sachzusammenhang und Verlauf.

Ein Folgebeitrag soll den Nutzer mit einem kurzen Kontextblock orientieren und einen klaren Übergang zur vollständigen Themenseite bieten.

Nicht alle Beziehungen eines Beitrags werden gleich prominent dargestellt. Im Beitrag erscheint nur der für das Verständnis unmittelbar nötige Zusammenhang; der vollständige Verlauf bleibt auf der Themenseite.

## 10. Nutzerweg 4 – Einstieg über Push

Push dient als gezielter Einstieg in eine konkrete neue Entwicklung.

Grundregeln:

- Push enthält Thema bzw. Sachverhalt und die neue Entwicklung knapp,
- ein Tipp öffnet direkt den betroffenen Beitrag bzw. die relevante Aktualisierung,
- der Zielinhalt zeigt sofort „Was ist neu?“,
- bei Folgebeiträgen folgt ein kurzer Kontextblock,
- von dort führt ein klarer Weg zur vollständigen Themenseite.

Nicht jede fachliche Aktualisierung erzeugt automatisch einen Push. Beiträge bzw. Ereignisse benötigen eine eigene Benachrichtigungsrelevanz, die getrennt vom Marketing-/Verbreitungsranking geführt wird.

Wesentliche Aktualisierungen bestehender Beiträge müssen so adressierbar sein, dass ein Push direkt zur relevanten Aktualisierung führen kann.

## 11. Startseite, Listenansicht und Detailansicht

Die Startseite dient primär der Orientierung und Auswahl. Sie besteht aus drei festen inhaltlichen Blöcken:

1. **Aktuelle Meldungen**
   - neue Beiträge,
   - fachlich relevant aktualisierte Beiträge.
2. **Anstehende Sitzungen**
   - die nächsten tatsächlich bevorstehenden Sitzungen,
   - unabhängig davon, ob sich an ihren Datensätzen zuletzt etwas geändert hat.
3. **Geänderte Themen**
   - Themen, deren aktueller Sachstand sich zuletzt relevant verändert hat.

Der Besuchskontext „seit dem letzten Besuch“ wird nicht als eigener vierter Block geführt, sondern innerhalb der drei bestehenden Blöcke angezeigt. Bei Wiederholungsbesuchern können z. B. Hinweise erscheinen wie „2 neu seit deinem letzten Besuch“ oder „1 Thema seit deinem letzten Besuch aktualisiert“. Bei Erstbesuchern entfallen diese Hinweise.

Die Startseite bleibt dadurch strukturell stabil; nur die Hervorhebung innerhalb der Blöcke passt sich an den Besuchskontext an.

Wählt der Nutzer einen Block bzw. ein Element daraus, wechselt er in die jeweilige Listenansicht:

- Aktuelle Meldungen → Beitragsliste,
- Sitzungen → Sitzungsliste,
- Themen → Themenliste.

Die Listenansichten übernehmen die Grundidee des Demonstrators, werden aber für das Echtsystem weiter optimiert, insbesondere hinsichtlich Kennzeichnung von Neuigkeit, Aktualisierung, Bedeutung und Sachkontext.

Als übergreifendes UX-Modell gilt:

> **Startseite = Orientierung und Auswahl**  
> **Listenansicht = Überblick und Vergleich**  
> **Detailseite = Verständnis und Vertiefung**

## 12. Listenansichten – Meldungen

Die Meldungsliste dient Auswahl und Einordnung, nicht der vollständigen Erklärung.

Pro Eintrag werden grundsätzlich gezeigt:

- Überschrift,
- sehr kurze Zusammenfassung,
- fachliches Ursprungs-/Ereignisdatum,
- bei fachlich relevanter späterer Änderung zusätzlich das Aktualisierungsdatum,
- zugehöriges Thema bzw. Sachkontext, sofern vorhanden,
- bei Folgebeiträgen ein knapper Hinweis auf den laufenden Vorgang.

Die interne Relevanzbewertung wird nicht als öffentlicher Wert oder Label angezeigt. Sie kann intern Sortierung, Hervorhebung oder Verbreitungsentscheidungen unterstützen.

Für Metadaten werden keine unnötigen dekorativen Icons verwendet. Datum und Aktualisierungsstatus werden sprachlich bzw. typografisch klar dargestellt.

### 12.1 Datumsdarstellung und Sortierung

Ursprungs-/Ereignisdatum und Aktualisierungsdatum sind fachlich unterschiedliche Informationen und werden getrennt gespeichert.

Verbindliche Darstellungsregel bei aktualisierten Beiträgen:

> **17.09.2026 · aktualisiert 29.09.2026**

Bei einem nicht aktualisierten Beitrag wird nur das Ursprungs-/Ereignisdatum angezeigt.

Eine Aktualisierung ersetzt das Ursprungsdatum nicht.

Für die Standard-Sortierung der Meldungsliste ist dagegen das Datum der **letzten fachlich relevanten Neuigkeit** maßgeblich. Dadurch können ein neuer Beitrag und ein wesentlich aktualisierter älterer Beitrag gleichrangig nach Aktualität einsortiert werden. Technische oder rein redaktionelle Änderungen verändern diese Sortierung nicht.

Bei aktualisierten Beiträgen soll bereits die Kurzfassung möglichst den neuen Informationswert erkennen lassen.

## 13. UX-Grundsätze

- mobile Nutzung ist ein Primärfall,
- direkte Einstiege müssen ohne vorherige Navigation verständlich sein,
- aktueller Stand ist wichtiger als reine Chronologie,
- neue Information muss bei Aktualisierungen sofort erkennbar sein,
- Zusammenhänge sollen sichtbar, aber nicht überladen dargestellt werden,
- „Mehr wissen?“ vertieft optional und darf den Grundbeitrag nicht unnötig verlängern,
- Sachinformation und politische Einordnung bleiben visuell klar getrennt,
- Navigation soll wenige, verständliche Hauptzugänge verwenden,
- die UI soll neugierig machen, ohne Informationen künstlich zu verstecken,
- Barrierearmut und verständliche Sprache werden bei der Detailkonzeption berücksichtigt.

## 14. Datenmodell-Auswirkungen

Bereits aus den bisherigen UX-Entscheidungen ergeben sich voraussichtlich Anforderungen an:

- stabile IDs und URLs für Beiträge, Themen und Sitzungen,
- strukturierten aktuellen Stand eines Themas,
- strukturierte Aktualisierungsereignisse,
- eigenständige Ereignisse innerhalb eines Themas/Vorgangs,
- Beziehung Ereignis → Beitrag,
- Unterscheidung zwischen technischer Änderung, redaktioneller Aktualisierung und fachlicher Neuigkeit,
- Kennzeichnung, ob eine Änderung für „Neu seit letztem Besuch“ bzw. Push relevant ist,
- offene Punkte,
- relevante Entscheidungen,
- explizite Beziehungen zwischen Inhalten,
- Lesestatus bzw. gerätebezogene Information für „Neu seit letztem Besuch“,
- Such- und Filtermetadaten.

Diese Punkte werden in G3 fachlich präzisiert und in ein logisches Datenmodell überführt.

## 15. Nächste G2-Arbeit

Die vier zentralen Nutzerwege sind fachlich durchgearbeitet.

Als nächstes werden daraus die konkrete **Startseitenlogik und Navigationsstruktur** abgeleitet. Anschließend folgen Detailkonzeption von Suche/Filter, Sitzungen, „Mehr wissen?“ und den PWA-spezifischen Bedienelementen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.4 | 29.09.2026 | Meldungsliste konkretisiert; Datumslogik mit getrenntem Ursprungs- und Aktualisierungsdatum sowie kompakter Anzeige festgelegt. |
| 1.3 | 29.09.2026 | Startseitenlogik mit drei festen Inhaltsblöcken sowie Zusammenspiel von Start-, Listen- und Detailansicht festgelegt. |
| 1.2 | 29.09.2026 | Nutzerwege 2–4 ergänzt: Themenseite als Sachstandsseite, Erst-/Folgebeitragslogik und Push-Einstieg; Datenmodell-Auswirkungen erweitert. |
| 1.1 | 29.09.2026 | Aktualisierungslogik und verbindliche Ereignisregel „bestehenden Beitrag aktualisieren oder neuen Beitrag anlegen“ ergänzt; Datenmodell-Auswirkungen präzisiert. |
| 1.0 | 29.09.2026 | G2-Primärquelle mit Leitidee, Nutzeraufgaben, Grundstruktur, Beitragshierarchie und ersten Datenmodell-Auswirkungen angelegt. |
