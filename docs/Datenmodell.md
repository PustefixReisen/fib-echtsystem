# Fachliche Datenanforderungen und logisches Datenmodell – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.6 | 02.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für die fachlichen Datenanforderungen und das logische Datenmodell des FIB-Echtsystems.

Es beschreibt zunächst fachliche Entitäten, Beziehungen, Kardinalitäten, Status und Historisierung. Konkrete PostgreSQL-/Supabase-Tabellen, Datentypen, Indizes und technische Implementierungsdetails folgen erst in späteren Schritten.

Ziel ist ein robustes und langfristig tragfähiges Modell, das für einen kleinen Ortsverband mit begrenztem Redaktionsaufwand praktisch betreibbar bleibt.

## 2. Modellierungsgrundsätze

- Fachliche Objekte werden nicht vorschnell mit Datenbanktabellen gleichgesetzt.
- Ein Sachverhalt erhält nur eine verbindliche fachliche Primärquelle.
- Historisierung wird dort vorgesehen, wo fachlich relevante Veränderungen nachvollziehbar bleiben müssen.
- Technische Änderungen dürfen nicht automatisch als fachliche Änderungen gelten.
- Sachinformation und „Unsere Einordnung“ bleiben fachlich und technisch unterscheidbar.
- Das Modell unterstützt KI-gestützte Arbeit, bleibt aber modellunabhängig.
- Redaktionelle Bestätigung bleibt für veröffentlichungsrelevante und fachlich wirksame Entscheidungen vorgesehen.
- Für KI-formulierte Einordnungen ist der strukturierte Redaktionsstand die fachliche Quelle; die Textfassung ist eine daraus abgeleitete Darstellung.
- Fachlich-politische Qualität wird nicht nur über Einzelwerte, sondern auch über Plausibilitätsprüfungen zwischen mehreren strukturierten Angaben abgesichert.

## 3. Wissenskern

Die fachliche Grundstruktur lautet:

> **Ereignis → Meldung → Vorgang → Thema**

Diese Struktur ist keine starre Hierarchie. Insbesondere können Vorgänge mehreren Themen zugeordnet sein, Ereignisse mehrere Vorgänge berühren und Sitzungen quer zu mehreren Ebenen liegen.

### 3.1 `Ereignis`

Ein `Ereignis` ist ein fachlich relevantes Geschehen oder eine relevante Entwicklung in der Wirklichkeit.

Beispiele:

- eine Beschlussvorlage wird veröffentlicht,
- ein Gemeinderat fasst einen Beschluss,
- ein Planungsstand ändert sich,
- ein Vorhabenträger veröffentlicht neue Unterlagen,
- eine neue belastbare Information verändert den Stand eines laufenden Sachverhalts.

Ein `Ereignis` ist damit von seiner redaktionellen Darstellung zu unterscheiden.

### 3.2 `Meldung`

Eine `Meldung` ist die redaktionelle FIB-Darstellung eines eigenständigen berichtenswerten `Ereignisses`.

Verbindliche Entscheidung:

> **`Ereignis` und `Meldung` sind getrennte fachliche Objekte.**

Daraus folgt:

- Ein `Ereignis` kann erkannt und gespeichert werden, ohne zwingend eine eigene veröffentlichte `Meldung` zu erzeugen.
- Eine `Meldung` setzt ausreichenden Nachrichtenwert voraus.
- Neue Informationen zum selben `Ereignis` aktualisieren grundsätzlich die bestehende `Meldung`.
- Ein neues eigenständiges `Ereignis` mit ausreichendem Nachrichtenwert erzeugt grundsätzlich eine neue `Meldung`.
- Die Entscheidung „neues Ereignis oder Aktualisierung“ bleibt eine fachlich wirksame, redaktionell zu bestätigende Entscheidung.

Diese Trennung erlaubt insbesondere die saubere Unterscheidung zwischen:

1. **Was ist tatsächlich passiert?** → `Ereignis`
2. **Welche neuen Informationen liegen dazu vor?** → Quellen/Fundstellen und Aktualisierung
3. **Was veröffentlicht FIB dazu?** → `Meldung`

### 3.3 Beziehung `Ereignis ↔ Meldung`

Verbindliche Kardinalität:

> **Ein `Ereignis` kann keine oder genau eine `Meldung` haben. Eine `Meldung` gehört immer genau zu einem `Ereignis`.**

Damit gilt fachlich:

- `Ereignis → Meldung`: `0..1`
- `Meldung → Ereignis`: `1`

Begründung:

- Ein erkanntes `Ereignis` kann fachlich relevant sein, ohne genügend eigenen Nachrichtenwert für eine öffentliche `Meldung` zu besitzen.
- Wird ein `Ereignis` als berichtenswert bestätigt, erhält es genau eine `Meldung`.
- Zusätzliche Quellen oder neue Informationen zum selben `Ereignis` erzeugen keine zweite `Meldung`, sondern können die bestehende `Meldung` aktualisieren.
- Erst ein neues eigenständiges `Ereignis` kann eine weitere `Meldung` erzeugen.
- Ein zunächst nicht berichtetes `Ereignis` kann später aufgrund neuer Erkenntnisse doch eine `Meldung` erhalten.

Beispiel:

- Veröffentlichung einer neuen Beschlussvorlage zur Hundewiese → `Ereignis A` → `Meldung A`.
- Später gefundener Pressebericht zur selben Vorlage → kein neues `Ereignis`; gegebenenfalls Aktualisierung von `Meldung A`.
- Spätere Beratung und Beschlussfassung im Gemeinderat → `Ereignis B` → `Meldung B`.

Damit bleiben Ereignisfolge und redaktionelle Veröffentlichung voneinander unterscheidbar.

### 3.4 Beziehung `Ereignis ↔ Vorgang`

Die fachliche Zuordnung zu einem konkreten länger laufenden Sachverhalt erfolgt über das `Ereignis`, nicht über eine parallele eigenständige Meldung-Vorgang-Beziehung.

Verbindliche Entscheidung:

> **Ein `Ereignis` kann keinem, einem oder mehreren `Vorgängen` zugeordnet sein. Ein `Vorgang` umfasst mindestens ein fachlich zugeordnetes `Ereignis`.**

Damit gilt fachlich:

- `Ereignis → Vorgang`: `0..n`
- `Vorgang → Ereignis`: `1..n`

Der Normalfall ist die Zuordnung eines `Ereignisses` zu genau einem `Vorgang`. Mehrfachzuordnungen sind zulässig, wenn dasselbe `Ereignis` mehrere konkrete Sachverhalte tatsächlich berührt. Bloße thematische Ähnlichkeit reicht dafür nicht aus.

`Meldungen` erhalten keine zusätzliche unabhängige Vorgangszuordnung. Ihre Zugehörigkeit zu einem `Vorgang` wird über das zugrunde liegende `Ereignis` abgeleitet:

`Meldung → Ereignis → Vorgang`

Dadurch werden widersprüchliche Doppelzuordnungen vermieden.

Beispiel „Hundewiese“:

- `Ereignis A`: neue Beschlussvorlage veröffentlicht → `Vorgang` „Hundewiese“ → `Meldung A`.
- `Ereignis B`: Beratung/Beschluss im Gemeinderat → `Vorgang` „Hundewiese“ → `Meldung B`.
- `Ereignis C`: kleiner weiterer Planungsschritt → `Vorgang` „Hundewiese“ → keine eigene `Meldung`.

Damit erzählt der `Vorgang` die Entwicklung des konkreten Sachverhalts, `Ereignisse` bilden die fachlichen Schritte ab, und `Meldungen` sind die veröffentlichten redaktionellen Darstellungen der berichtenswerten `Ereignisse`.

### 3.5 Beziehung `Vorgang ↔ Thema`

Ein `Vorgang` kann keinem, einem oder mehreren `Themen` zugeordnet sein. Ein `Thema` umfasst in der Regel mehrere `Vorgänge`. Die Beziehung ist damit grundsätzlich n:m.

Verbindliche Entscheidung:

> **Die bisher vorgesehene Wirkungsrolle entfällt als eigenes strukturiertes Merkmal. An ihre Stelle tritt die redaktionell bestätigte `Bedeutung für das Thema`.**

Die `Bedeutung für das Thema` beschreibt, wie stark ein `Vorgang` das Verständnis oder die Entwicklung eines `Themas` prägt. Es gelten zunächst drei Stufen:

- `prägend` – ohne diesen `Vorgang` lässt sich das `Thema` derzeit kaum sinnvoll erklären,
- `relevant` – der `Vorgang` trägt wesentlich zum Verständnis bei,
- `ergänzend` – der `Vorgang` liefert zusätzlichen Kontext, ist aber nicht zentral.

Die Einstufung wird von der KI vorgeschlagen und muss durch die Redaktion verpflichtend geprüft, bestätigt oder geändert werden, bevor sie fachlich wirksam wird.

Die Bedeutung wird nicht automatisch aus der Zahl der `Meldungen`, `Perspektiven` oder Quellen berechnet. Die KI kann ihren Vorschlag u. a. aus Tragweite, Dauer, Auswirkungen, Einfluss auf andere Vorgänge, Aktualität und Bedeutung für die Leitfrage ableiten; die redaktionelle Entscheidung bleibt maßgeblich.

Die fachliche Erklärung, **warum** ein `Vorgang` für ein `Thema` relevant ist, erfolgt über `Perspektiven` und die darunter beschriebenen `Wirkungen`. Dadurch wird auf eine parallele Rollen-Taxonomie wie „Treiber / Betroffenheit / Rahmenbedingung / Gestaltungsbeitrag / Indikator“ verzichtet.

### 3.6 `Perspektive`, `Wirkung` und `Bewertung` – Arbeitsstand

Für die weitere Modellierung werden folgende Begriffe getrennt:

- `Perspektive` – fachlicher Betrachtungsaspekt innerhalb eines `Themas`, z. B. Lärm, Verkehrssicherheit, Flächenverbrauch oder kommunaler Handlungsspielraum.
- `Wirkung` – sachlich belegbare oder begründet erwartbare Folge eines `Vorgangs` unter einer `Perspektive`.
- `Bewertung` – politische Beurteilung einer `Wirkung` im Rahmen von „Unsere Einordnung“.
- `Begründung` – nachvollziehbare Herleitung der `Bewertung`.
- `politischer Bezug` – grüner Wert, politisches Ziel oder dokumentierte grüne Position, auf die sich die `Begründung` stützt.

Diese Begriffe werden im Begriffsregister verbindlich abgegrenzt. Die konkrete Datenmodellierung von `Wirkung`, `Bewertung`, `Begründung` und `politischem Bezug` wird als nächster G3-Schritt anhand des grünen Referenzsystems geklärt.

### 3.7 Strukturierter Redaktionsstand und Textfassung

Für KI-formulierte Inhalte, insbesondere „Unsere Einordnung“, werden fachliche Struktur und sprachliche Darstellung getrennt behandelt.

Verbindliche Entscheidung:

> **Der `strukturierte Redaktionsstand` ist die fachliche Quelle. Die `Textfassung` ist eine daraus erzeugte sprachliche Darstellung.**

Der `strukturierte Redaktionsstand` umfasst die jeweils bestätigten bzw. redaktionell bearbeiteten fachlichen Angaben, insbesondere `Wirkungen`, `Perspektiven`, Zuordnungen zu `Zielbereichen`, `Wirkungsrichtungen`, `Bedeutung der Wirkung`, `Verlässlichkeit`, `politisches Gewicht`, `Gestaltungsoptionen`, `Begründungen` und `Abwägung`.

Für jede veröffentlichte oder freigabefähige `Textfassung` muss nachvollziehbar sein, auf welchem versionierten `strukturierten Redaktionsstand` sie beruht.

Es gelten folgende Konsistenzregeln:

- Eine manuelle sprachliche Änderung der `Textfassung` ändert nicht automatisch den `strukturierten Redaktionsstand`.
- Ändert eine manuelle Textbearbeitung eine fachliche Aussage, Gewichtung, Bewertung, Begründung oder Abwägung, muss die Abweichung erkannt und in den strukturierten Angaben nachvollzogen oder ausdrücklich zurückgenommen werden.
- Bei einer späteren Neugenerierung wird die neue `Textfassung` aus dem aktuellen strukturierten Stand erzeugt.
- Dabei muss ein inhaltlicher Vergleich zur vorherigen freigegebenen `Textfassung` erfolgen.
- Unveränderte strukturierte Kernaussagen dürfen durch die Neugenerierung nicht ohne fachlichen Grund ihre Bedeutung, Gewichtung oder politische Aussage verändern.
- Inhaltliche Änderungen der neuen `Textfassung` sollen grundsätzlich auf tatsächlich geänderte strukturierte Angaben zurückführbar sein.
- Sprachliche Änderungen außerhalb der geänderten fachlichen Bereiche sind zulässig, dürfen aber keine neue oder veränderte Kernaussage erzeugen.
- Der Redakteur muss erkennen können, welche Textänderungen aus welcher strukturierten Änderung entstanden sind.

Der Redaktionsprozess ist bewusst iterativ: Der Redakteur kann zu früheren strukturierten Angaben zurückkehren, sie ändern und anschließend einen neuen Abwägungs- oder Formulierungsvorschlag erzeugen. Die Historie der fachlich wirksamen Änderungen bleibt nachvollziehbar.

### 3.8 Bestätigung und Plausibilitätsprüfung

Für den strukturierten Redaktionsprozess werden drei Sicherungsebenen unterschieden:

1. **Pflichtbestätigung** – für Angaben, die die fachliche oder politische Kernaussage unmittelbar prägen.
2. **sichtbarer KI-Vorschlag** – für Angaben, die die KI vorschlagen darf und die vom Redakteur sichtbar geprüft und bei Bedarf geändert werden können, ohne dass zwingend eine eigene Bestätigungsaktion erforderlich ist.
3. **Plausibilitätsprüfung über mehrere Felder** – zur Erkennung auffälliger oder widersprüchlicher Kombinationen im strukturierten Stand.

Zur Pflichtbestätigung gehören grundsätzlich insbesondere:

- `Wirkung`,
- `Zielbereich`,
- `Wirkungsrichtung`,
- `Bedeutung der Wirkung`,
- `politisches Gewicht`,
- relevante `Gestaltungsoptionen`,
- die strukturierte `Abwägung`.

`Verlässlichkeit` kann grundsätzlich als sichtbarer KI-Vorschlag geführt werden. Eine ausdrückliche Prüfung wird erforderlich, wenn ihre Kombination mit anderen Angaben fachlich auffällig ist oder die Abwägung wesentlich beeinflusst.

Beispiele für Plausibilitätsprüfungen:

- `Verlässlichkeit = gering` und zugleich `politisches Gewicht = hoch` → gezielter Prüfhinweis.
- `Wirkungsrichtung = beeinträchtigt`, aber positive Gesamtbewertung derselben Wirkung ohne erkennbare Begründung → Inkonsistenzhinweis.
- Eine bestätigte `Wirkung` wurde geändert, die `Abwägung` blieb aber unverändert → erneute Prüfung der Abwägung erforderlich.
- Eine `Gestaltungsoption` erzeugt erwartete neue `Wirkungen`, diese fehlen aber in der Abwägung → Prüfhinweis.
- Eine manuell geänderte `Textfassung` verschiebt eine Bewertung oder Gewichtung, ohne dass sich der strukturierte Redaktionsstand geändert hat → Konsistenzwarnung.

Plausibilitätsprüfungen sind keine automatische politische Entscheidung. Sie markieren Konstellationen, bei denen die Redaktion die fachliche Herleitung gezielt prüfen muss.

Die sprachliche Fassung der `Abwägung` wird von der KI erzeugt. Pflichtbestätigt wird die strukturierte Abwägung, nicht jeder einzelne Satz der daraus formulierten Textfassung.

### 3.9 Noch zu klärende Kernbeziehungen

Als nächste Modellierungsschritte werden geklärt:

- direkte `Ereignis ↔ Thema`-Beziehungen,
- `Sitzung/TOP ↔ Ereignis/Meldung/Vorgang/Thema`,
- `Perspektiven` und `Wirkungen` innerhalb eines `Themas`,
- Modellierung von `Bewertung`, `Begründung`, `Gestaltungsoption`, `Verlässlichkeit`, `politischem Gewicht` und politischem Referenzsystem,
- genaue Versionierungs- und Vergleichslogik zwischen strukturiertem Redaktionsstand und Textfassung,
- konkrete fachliche Plausibilitätsregeln für den Redaktionsprozess.

## 4. Weitere Modellbereiche – noch nicht abschließend geklärt

Die folgenden Bereiche sind datenmodellrelevant, werden aber schrittweise und fachlich verständlich ausgearbeitet:

### 4.1 Entscheidungskontext

- Sitzung
- TOP
- Tagesordnung
- Beschlussvorlage und weitere Unterlagen
- Beratung / Verfahrensstand
- Beschluss / Ergebnis
- Niederschrift

### 4.2 Wissensbasis und Quellen

- Quelle
- Fundstelle
- Quellenrolle
- Belegbeziehung zu Aussagen bzw. FIB-Inhalten

### 4.3 Redaktion, Historisierung und Vertiefung

- Rechercheauftrag
- Aktualisierungsereignis
- Version / Historisierung
- „Unsere Einordnung“
- „Mehr wissen?“-Frage
- gespeicherte Antwort
- Quellen einer Antwort
- Wissenslücke / offene Wissensfrage

Diese Begriffe werden nicht als bereits abschließend modelliert betrachtet. Ihre genaue Bedeutung, Notwendigkeit und Abgrenzung wird im weiteren G3-Verlauf einzeln geprüft.

## 5. Offene G3-Fragen

1. Wie werden `Perspektiven` und `Wirkungen` fachlich strukturiert, ohne unnötige eigene Hauptobjekte zu schaffen?
2. Wie werden `Bewertungen` und ihre `Begründungen` mit dem grünen Referenzsystem verknüpft?
3. Wie werden direkte Beziehungen von `Ereignissen` zu `Themen` modelliert, wenn kein `Vorgang` dazwischen liegt?
4. Welche Status gehören zu `Ereignis`, `Meldung`, `Vorgang`, `Thema` und `Sitzung`?
5. Welche Änderungen werden versioniert, welche nur protokolliert?
6. Welche Daten gehören zur fachlichen Persistenz und welche nur zum technischen Betrieb?
7. Welche Plausibilitätsregeln sind verbindlich und welche nur unterstützende Hinweise?

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.6 | 02.10.2026 | Bestätigungslogik und feldübergreifende Plausibilitätsprüfung für den strukturierten Redaktionsprozess festgelegt; strukturierte Abwägung als fachlich zu bestätigender Stand von der KI-formulierten Textfassung getrennt. |
| 0.5 | 02.10.2026 | `strukturierter Redaktionsstand` als fachliche Quelle und `Textfassung` als daraus erzeugte Darstellung festgelegt; Konsistenz-, Versions- und Änderungsregeln zwischen beiden Ebenen ergänzt. |
| 0.4 | 02.10.2026 | Vorgang↔Thema konkretisiert: Wirkungsrollen-Taxonomie entfällt; „Bedeutung für das Thema“ mit prägend/relevant/ergänzend und verpflichtender redaktioneller Bestätigung eingeführt; Begriffe Perspektive, Wirkung, Bewertung, Begründung und politischer Bezug als nächster Modellierungsbereich abgegrenzt. |
| 0.3 | 02.10.2026 | Beziehung Ereignis ↔ Vorgang verbindlich festgelegt: Ereignis `0..n` Vorgänge, Vorgang `1..n` Ereignisse; Meldung-Vorgang-Zuordnung wird über das Ereignis abgeleitet. |
| 0.2 | 02.10.2026 | Kardinalität Ereignis ↔ Meldung verbindlich festgelegt: ein Ereignis hat 0..1 Meldungen, eine Meldung gehört genau zu einem Ereignis. |
| 0.1 | 01.10.2026 | G3-Primärdokument angelegt; Trennung von Ereignis und Meldung verbindlich festgelegt; weitere Modellbereiche und nächste Klärungsschritte aufgenommen. |
