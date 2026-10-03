# Redaktionsworkflow – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.2 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für den fachlichen Ablauf der KI-gestützten redaktionellen Vorgangs- und Themenbearbeitung und die dafür erforderliche Prozesstransparenz.

Es beschreibt noch keine endgültige visuelle Gestaltung. Karten, Dialoge, Aufklappbereiche und Navigation sind zunächst ein zu erprobendes Interaktionskonzept.

Ergänzende Primärquellen:

- fachliches Datenmodell: `docs/Datenmodell.md`
- Themen- und Vorgangslogik: `docs/Themen-und-Vorgangslogik.md`
- politisches Referenzsystem: `docs/Gruene-Werte-und-politische-Ziele.md`
- Begriffe und Benutzer-Labels: `docs/Begriffe.md`
- öffentliche UX: `docs/UX-und-Informationsarchitektur.md`

## 2. Grundprinzipien

### 2.1 Strukturierte Bearbeitung statt Formularsprache

Die Redaktion arbeitet an einem konkreten Sachverhalt. Die App soll deshalb keine abstrakten Modellfelder ohne Kontext präsentieren, sondern verständliche, auf den konkreten Inhalt bezogene Fragen formulieren.

Beispiel:

- intern: Wirkungsrichtung
- App: „Wie wirkt sich die zusätzliche Flächeninanspruchnahme auf das Ziel ‚Flächensparen und nachhaltige Ortsentwicklung‘ aus?“

Die Antwortmöglichkeiten können standardisiert sein; die Frage wird aus Vorgang, Wirkung, Zielbereich und gegebenenfalls Prüfkriterium kontextbezogen formuliert.

### 2.2 Drei Transparenzebenen

Bei fachlich relevanten KI-Vorschlägen soll der Bearbeiter nachvollziehen können:

1. **Was soll ich entscheiden?** – konkrete, verständliche Frage.
2. **Warum schlägt die KI das vor?** – optional aufklappbare Begründung mit verwendeten Grundlagen/Quellen.
3. **Was bewirkt meine Entscheidung?** – kurze Erklärung, welche spätere Analyse, Abwägung oder Textaussage davon beeinflusst wird.

Die Begründung muss nicht ständig vollständig sichtbar sein, aber unmittelbar erreichbar bleiben.

## 3. Rollen im Bearbeitungsprozess

### KI

- recherchiert und strukturiert,
- schlägt Wirkungen, Zielbereiche, Prüfkriterien, Einordnungen und Gestaltungsoptionen vor,
- schlägt Themenkandidaten, passende Vorgänge und weitere relevante Ereignisse vor,
- begründet ihre Vorschläge,
- formuliert aus bestätigten strukturierten Angaben Abwägung und Textfassung.

### Redaktion

- prüft, korrigiert, ergänzt und bestätigt,
- kann Vorschläge aufteilen, zusammenführen oder verwerfen,
- kann eigene Wirkungen, Zielbereiche, Prüfkriterien und Gestaltungsoptionen ergänzen,
- kann Vorgänge und einzelne weitere relevante Ereignisse für ein Thema auswählen,
- verantwortet den strukturierten Stand des konkreten Vorgangs bzw. Themas.

### Admin

- verantwortet fachlich und technisch das Referenzsystem,
- prüft Änderungen und Ergänzungen am allgemeinen Referenzrahmen,
- gibt neue Referenzstände frei.

## 4. Bearbeitungsfolge Vorgang

Die Bearbeitung ist nicht als starrer linearer Assistent zu verstehen. Vor- und Zurückspringen sowie spätere Änderungen müssen möglich sein.

Typische Folge:

1. KI erkennt und schlägt Wirkungen vor.
2. Redaktion übernimmt, ändert, trennt, ergänzt oder verwirft Wirkungen.
3. KI schlägt zu einer Wirkung einen oder mehrere Zielbereiche vor.
4. Redaktion bestätigt, ändert oder ergänzt die Zielbereiche.
5. Für jeden gewählten Zielbereich werden die vorhandenen Prüfkriterien bearbeitet.
6. KI schlägt weitere strukturierte Einschätzungen vor; Redaktion prüft bzw. bestätigt die fachlich wirksamen Angaben.
7. KI kann Gestaltungsoptionen und offene Recherchefragen vorschlagen; Redaktion entscheidet über Aufnahme.
8. KI erstellt aus dem bestätigten strukturierten Stand einen Abwägungsvorschlag.
9. Redaktion bestätigt oder ändert die strukturierte Abwägung.
10. KI formuliert „Unsere Einordnung“.
11. Redaktion prüft und kann die Textfassung nachbearbeiten; fachliche Änderungen müssen in den strukturierten Stand zurückgeführt werden.

## 5. Bearbeitungsfolge Thema

Die Themenredaktion kombiniert Vorgänge und einzelne zusätzliche Ereignisse.

### 5.1 Vorgänge auswählen

Die Redaktion wählt die für das Thema relevanten Vorgänge aus. Mit einem ausgewählten Vorgang werden dessen fachlich zugehörige Ereignisse automatisch für die Themenanalyse mitgeführt.

Damit muss die Redaktion die Ereignisse eines Vorgangs nicht einzeln auswählen.

Für die Analyse wird zusätzlich der aktuelle Vorgangstext bzw. Sachstand als redaktionelle Verdichtung berücksichtigt.

### 5.2 Weitere relevante Ereignisse

Zusätzlich zeigt die App eine KI-gestützte Vorauswahl unter der Bezeichnung:

> **Weitere relevante Ereignisse**

Dort erscheinen nur Ereignisse, die plausibel zum Thema passen und nicht bereits über einen ausgewählten Vorgang enthalten sind.

Die Redaktion kann Vorschläge übernehmen oder verwerfen. Zusätzlich muss sie den gesamten Ereignisbestand durchsuchen und ein Ereignis manuell hinzufügen können.

Damit bestehen drei Wege:

1. Vorgang auswählen → zugehörige Ereignisse automatisch enthalten,
2. vorgeschlagenes weiteres relevantes Ereignis übernehmen,
3. Ereignis manuell suchen und ergänzen.

### 5.3 Meldungen als Analysekontext

Meldungen werden im Themenworkflow nicht separat ausgewählt.

Hat ein ausgewähltes Ereignis eine Meldung, werden über die Ereignisbeziehung für die Themenanalyse berücksichtigt:

- Meldungstext,
- gegebenenfalls bestätigte bzw. veröffentlichte „Unsere Einordnung“,
- weitere relevante bestätigte strukturierte Angaben.

Dies gilt sowohl für Ereignisse, die über einen Vorgang in das Thema gelangen, als auch für direkt ergänzte weitere relevante Ereignisse.

### 5.4 Herkunft und Anti-Doppelzählung

Quelle/Fundstelle, Ereignis, Meldungstext, Vorgangstext und „Unsere Einordnung“ können denselben Sachverhalt auf unterschiedlichen Ebenen enthalten.

Deshalb gilt:

> **Mehrfache textliche Vorkommen desselben Sachverhalts erhöhen dessen fachliche Bedeutung nicht automatisch.**

Für die Themenanalyse sind die Ebenen getrennt zu behandeln:

- Quellen/Fundstellen und Ereignisse → Tatsachenbasis,
- Meldungs- und Vorgangstexte → redaktionelle Verdichtung und Zusammenhang,
- „Unsere Einordnung“ → bereits dokumentierte politische Bewertung.

Die KI muss die Herkunft der analysierten Aussage berücksichtigen und darf redaktionelle Ableitungen nicht als zusätzliche unabhängige Tatsachenbelege behandeln.

## 6. Auswahl von Prüfkriterien

Nach Auswahl eines Zielbereichs zeigt die App **alle aktuell vorhandenen Prüfkriterien dieses Zielbereichs unmittelbar an**.

Die KI markiert diejenigen Kriterien voraus, die sie für die konkrete Wirkung als einschlägig vorschlägt. Nicht vorausgewählte Kriterien bleiben sichtbar.

Dadurch kann die Redaktion auf einen Blick:

- KI-Vorschläge übernehmen oder abwählen,
- weitere vorhandene Prüfkriterien auswählen,
- erkennen, ob ein fachlich benötigtes Prüfkriterium im Referenzsystem fehlt.

Nur ausgewählte Prüfkriterien gehen für die konkrete Wirkung in die weitere strukturierte Analyse ein.

Ein typisches UI-Muster ist daher:

> **Welche Prüfkriterien sind für diese Wirkung relevant?**
>
> ☑ zusätzliche Flächeninanspruchnahme  
> ☑ Versiegelung  
> ☐ Zerschneidung von Flächen  
> ☐ langfristige Entwicklungsoptionen  
> ☐ Reversibilität
>
> **+ neues Prüfkriterium erfassen**

Die genaue visuelle Darstellung bleibt Gegenstand der Erprobung.

## 7. Neues Prüfkriterium im konkreten Fall

Kann die Redaktion einen benötigten Aspekt nicht unter den vorhandenen Prüfkriterien finden, kann sie ein neues Prüfkriterium erfassen.

Die KI prüft anschließend insbesondere:

- ob bereits ein inhaltlich gleiches oder sehr ähnliches Prüfkriterium vorhanden ist,
- ob das neue Prüfkriterium fachlich zum aktuell gewählten Zielbereich gehört,
- ob möglicherweise ein weiterer Zielbereich einschlägig ist.

Die KI darf eine alternative Zuordnung vorschlagen, verändert die Zuordnung aber nicht stillschweigend.

Ein neu erfasstes Prüfkriterium kann zunächst fallbezogen verwendet werden. Zusätzlich kann die Redaktion vorschlagen, es in das allgemeine Referenzsystem zu übernehmen. Diese allgemeine Ergänzung wird erst durch Admin-Freigabe wirksam.

## 8. Benutzernahe Fragen statt abstrakter Feldnamen

Die App verwendet, soweit sinnvoll, kontextbezogene Fragen anstelle interner Fachbegriffe.

Beispielhafte Übersetzung:

| Fachbegriff | Benutzernahe Formulierung |
|---|---|
| Wirkungsrichtung | Wie wirkt sich diese Wirkung auf das Ziel aus? |
| Bedeutung der Wirkung | Wie groß bzw. weitreichend ist diese Auswirkung? |
| Verlässlichkeit | Wie gut ist diese Einschätzung belegt? |
| politisches Gewicht | Wie stark soll diese Auswirkung in der Abwägung zählen? |

Die endgültigen Benutzer-Labels werden im Begriffsregister geführt.

## 9. KI-Begründung

Zu einem KI-Vorschlag kann die Redaktion eine kurze Begründung öffnen.

Beispiel:

> **Warum schlägt die KI „hoch“ vor?**
>
> - dauerhafte zusätzliche Flächeninanspruchnahme,
> - nur eingeschränkt reversibel,
> - Planunterlagen belegen den Eingriff.
>
> **Verwendete Grundlagen:** Quelle/Fundstelle

Die Begründung soll sich auf den konkreten Vorschlag beziehen und keine allgemeine Modellbeschreibung wiederholen.

## 10. Zwischenstände und Orientierung

Nach fachlich zusammengehörigen Bearbeitungsschritten soll ein kompakter Zwischenstand sichtbar sein.

Bei Vorgängen zeigt er insbesondere:

- konkrete Wirkung,
- gewählten Zielbereich,
- ausgewählte Prüfkriterien,
- bisherige strukturierte Einschätzungen,
- offene Recherchefragen,
- gegebenenfalls Gestaltungsoptionen.

Bei Themen zeigt er insbesondere:

- ausgewählte Vorgänge,
- darüber automatisch enthaltene Ereignisse,
- zusätzlich ausgewählte weitere relevante Ereignisse,
- erschlossene Meldungen und vorhandene Einordnungen,
- offene Recherche- oder Abgrenzungsfragen.

Der Bearbeiter muss von dort zu früheren Angaben zurückkehren können. Änderungen erzeugen anschließend einen neuen Abwägungs-, Themen- bzw. Formulierungsvorschlag aus dem aktuellen strukturierten Stand.

## 11. Erprobungsstatus

Verbindlich sind die fachlichen Prinzipien:

- kontextbezogene Fragen,
- nachvollziehbarer Anlass jeder fachlich relevanten Frage,
- nachvollziehbare KI-Begründung,
- erkennbare Wirkung der redaktionellen Entscheidung,
- alle vorhandenen Prüfkriterien eines gewählten Zielbereichs sichtbar,
- KI-Vorauswahl statt versteckter Vorausfilterung,
- Ergänzung neuer Prüfkriterien möglich,
- iterative Bearbeitung mit Rücksprung,
- Themenauswahl über Vorgänge plus weitere relevante Ereignisse,
- automatische Mitnahme der Ereignisse eines ausgewählten Vorgangs,
- Meldungen als über Ereignisse erschlossener Analysekontext,
- Herkunftstrennung und Anti-Doppelzählung bei der Themenanalyse.

Noch experimentell sind insbesondere:

- Karten- oder Formularlayout,
- Platzierung und Darstellung von Hilfetexten,
- konkrete Navigation zwischen Bearbeitungsschritten,
- visuelle Hervorhebung von KI-Vorschlägen,
- Umfang und Darstellung von Quellenbegründungen,
- konkrete Darstellung der Vorauswahl „Weitere relevante Ereignisse“.

Diese Punkte werden an realen FIB-Vorgängen und Themen prototypisch getestet.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.2 | 03.10.2026 | Themenworkflow ergänzt: Vorgangsauswahl mit automatischer Mitnahme der Ereignisse, KI-Vorauswahl „Weitere relevante Ereignisse“, manuelle Ereignissuche, Meldungstext und „Unsere Einordnung“ als über Ereignisse erschlossener Analysekontext sowie Herkunfts-/Anti-Doppelzählungsregel. |
| 0.1 | 02.10.2026 | Primärquelle für KI-gestützten Redaktionsworkflow angelegt; Prozesstransparenz, kontextbezogene Fragen, vollständige Anzeige vorhandener Prüfkriterien, KI-Vorauswahl und Ergänzung neuer Prüfkriterien festgelegt. |
