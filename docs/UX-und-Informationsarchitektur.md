# UX und Informationsarchitektur – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 29.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

## 8. UX-Grundsätze

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

## 9. Datenmodell-Auswirkungen

Bereits aus den bisherigen UX-Entscheidungen ergeben sich voraussichtlich Anforderungen an:

- stabile IDs und URLs für Beiträge, Themen und Sitzungen,
- strukturierten aktuellen Stand eines Themas,
- strukturierte Aktualisierungsereignisse,
- offene Punkte,
- relevante Entscheidungen,
- explizite Beziehungen zwischen Inhalten,
- Lesestatus bzw. gerätebezogene Information für „Neu seit letztem Besuch“,
- Such- und Filtermetadaten.

Diese Punkte werden in G3 fachlich präzisiert und in ein logisches Datenmodell überführt.

## 10. Nächste G2-Arbeit

Als nächstes werden mindestens diese typischen Nutzerwege im Detail durchgespielt:

1. regelmäßiger Besucher: „Was ist seit meinem letzten Besuch neu?“
2. thematisch Interessierter: „Was ist der aktuelle Stand bei der Hundewiese?“
3. externer Einstieg: „Ich habe einen Link zu einem einzelnen Beitrag bekommen.“
4. Push-Einstieg: „Ich wurde über eine Aktualisierung informiert.“

Aus den Nutzerwegen werden weitere Anforderungen an UI, Fachlogik und Datenmodell abgeleitet.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 29.09.2026 | G2-Primärquelle mit Leitidee, Nutzeraufgaben, Grundstruktur, Beitragshierarchie und ersten Datenmodell-Auswirkungen angelegt. |
