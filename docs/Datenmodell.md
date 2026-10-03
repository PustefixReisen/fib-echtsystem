# Fachliche Datenanforderungen und logisches Datenmodell – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
- Herkunft einer Quelle, konkrete Fundstelle bzw. Datei, technischer Speicherort und öffentliche Sichtbarkeit werden getrennt modelliert.
- Abgeleitete redaktionelle Texte dürfen bei Analysen nicht als zusätzliche unabhängige Tatsachenbelege für denselben Sachverhalt gezählt werden.
- Wirkungen werden an Ereignissen verankert; ihr fachlicher Herkunftskontext bestimmt, wo sie geändert werden dürfen.
- Gleichbedeutende Wirkungen dürfen in einer übergeordneten Analyse nicht mehrfach gewichtet werden.
- Fachlich wirksame Zuordnungen zwischen Wirkungen und Themenperspektiven werden persistent gespeichert und nur bei konkretem Änderungsanlass neu geprüft.

## 3. Wissenskern

Die fachliche Grundstruktur lautet:

> **Ereignis → Meldung → Vorgang → Thema**

Diese Struktur ist keine starre Hierarchie. Insbesondere können Vorgänge mehreren Themen zugeordnet sein, Ereignisse mehrere Vorgänge berühren, einzelne Ereignisse zusätzlich direkt einem Thema zugeordnet werden und Sitzungen quer zu mehreren Ebenen liegen.

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

### 3.5 Beziehungen `Vorgang ↔ Thema` und `Ereignis ↔ Thema`

Ein `Vorgang` kann keinem, einem oder mehreren `Themen` zugeordnet sein. Ein `Thema` umfasst in der Regel mehrere `Vorgänge`. Die Beziehung ist damit grundsätzlich n:m.

Verbindliche Entscheidung für die Themenredaktion:

> **Vorgänge sind der bevorzugte Auswahlweg eines Themas. Mit der Auswahl eines Vorgangs werden dessen zugehörige Ereignisse automatisch in die Themenanalyse einbezogen. Zusätzlich können einzelne weitere relevante Ereignisse direkt einem Thema zugeordnet werden.**

Direkte `Ereignis ↔ Thema`-Beziehungen dienen ausschließlich zusätzlichen Einzelereignissen, die nicht bereits über einen ausgewählten Vorgang im Thema enthalten sind oder bewusst unabhängig von einem Vorgang aufgenommen werden sollen.

Damit gilt fachlich:

- `Vorgang → Thema`: `0..n`
- `Thema → Vorgang`: `0..n`
- `Ereignis → Thema`: `0..n` als direkte Zusatzbeziehung
- ein über einen ausgewählten Vorgang enthaltenes Ereignis benötigt keine redundante zusätzliche direkte Themenzuordnung.

Für die Herkunft im Thema muss erkennbar bleiben, ob ein Ereignis:

1. über einen ausgewählten Vorgang enthalten ist oder
2. als einzelnes weiteres relevantes Ereignis direkt aufgenommen wurde.

Meldungen werden nicht separat einem Thema zugeordnet. Hat ein im Thema enthaltenes Ereignis eine Meldung, wird diese über die Ereignisbeziehung als Analysekontext erschlossen.

Für einen ausgewählten Vorgang werden als Analysegegenstände berücksichtigt:

- seine zugehörigen Ereignisse,
- die Quellen/Fundstellen dieser Ereignisse,
- der aktuelle Vorgangstext bzw. Sachstand als redaktionelle Verdichtung,
- die über Ereignisse erschlossenen Meldungstexte,
- vorhandene redaktionell bestätigte bzw. veröffentlichte „Unsere Einordnung“ dieser Meldungen,
- weitere bestätigte strukturierte Angaben, soweit thematisch relevant.

Dabei gilt:

> **Quelle/Fundstelle und Ereignis bilden die Tatsachenbasis. Meldungs- und Vorgangstexte sind redaktionelle Verdichtungen. „Unsere Einordnung“ ist eine politische Bewertung. Mehrfache textliche Vorkommen desselben Sachverhalts dürfen nicht als voneinander unabhängige Belege oder zusätzliche Gewichtung behandelt werden.**

Die frühere vorgesehene Wirkungsrolle entfällt als eigenes strukturiertes Merkmal. An ihre Stelle tritt die redaktionell bestätigte `Bedeutung für das Thema`.

Die `Bedeutung für das Thema` beschreibt, wie stark ein ausgewählter `Vorgang` oder ein direkt ergänztes einzelnes `Ereignis` das Verständnis oder die Entwicklung eines `Themas` prägt. Es gelten drei Stufen:

- `prägend` – ohne diesen Themenbestandteil lässt sich das Thema derzeit kaum sinnvoll erklären,
- `relevant` – der Themenbestandteil trägt wesentlich zum Verständnis bei,
- `ergänzend` – der Themenbestandteil liefert zusätzlichen Kontext, ist aber nicht zentral.

Die Einstufung gilt sowohl für `Vorgang ↔ Thema` als auch für direkte `Ereignis ↔ Thema`-Beziehungen. Sie wird von der KI vorgeschlagen und muss durch die Redaktion verpflichtend geprüft, bestätigt oder geändert werden, bevor sie fachlich wirksam wird.

Die Bedeutung wird nicht automatisch aus der Zahl der `Meldungen`, `Perspektiven` oder Quellen berechnet. Die KI kann ihren Vorschlag u. a. aus Tragweite, Dauer, Auswirkungen, Einfluss auf andere Vorgänge, Aktualität und Bedeutung für die Leitfrage ableiten; die redaktionelle Entscheidung bleibt maßgeblich.

Die fachliche Erklärung, **warum** ein Vorgang oder Ereignis für ein Thema relevant ist, erfolgt über `Perspektiven` und die darunter ausgewerteten `Wirkungen`.

### 3.6 Themenentstehung und Dublettprüfung

Ein Thema kann aus einem KI-generierten Themenkandidaten oder durch direkte redaktionelle Anlage entstehen.

Bei einer redaktionellen Neuanlage muss vor dem fachlich wirksamen Speichern eine Ähnlichkeits-/Dublettprüfung gegen den bestehenden Themenbestand erfolgen. Sie prüft nicht nur den Titel, sondern insbesondere Leitfrage, Abgrenzung, bereits zugeordnete Vorgänge und Ereignisse, Perspektiven und sachlichen Erklärungszweck.

Das Prüfergebnis muss mindestens unterscheiden können:

- kein ähnliches Thema gefunden,
- ähnliches Thema vorhanden – Zusammenführung oder Abgrenzung prüfen,
- gleiches Thema wahrscheinlich vorhanden – bewusste redaktionelle Entscheidung erforderlich.

Die Herkunft des Themas (`KI-Vorschlag` oder `redaktionelle Anlage`) sowie das Ergebnis einer erforderlichen Dublettprüfung müssen nachvollziehbar gespeichert werden. Die KI darf eine Empfehlung geben, entscheidet aber nicht autonom über Identität, Zusammenführung oder Abgrenzung von Themen.

### 3.7 `Perspektive`, `Wirkung` und `Bewertung`

Für die weitere Modellierung werden folgende Begriffe getrennt:

- `Perspektive` – fachlicher Betrachtungsaspekt innerhalb eines `Themas`, z. B. Lärm, Verkehrssicherheit, Flächenverbrauch oder kommunaler Handlungsspielraum.
- `Wirkung` – sachlich belegbare oder begründet erwartbare Folge, die fachlich an einem `Ereignis` verankert ist.
- `Bewertung` – politische Beurteilung einer `Wirkung` im Rahmen von „Unsere Einordnung“.
- `Begründung` – nachvollziehbare Herleitung der `Bewertung`.
- `politischer Bezug` – grüner Wert, politisches Ziel oder dokumentierte grüne Position, auf die sich die `Begründung` stützt.

#### 3.7.1 Verankerung und Herkunft einer Wirkung

Verbindliche Entscheidung:

> **Jede Wirkung ist einem Ereignis zugeordnet. Zusätzlich wird ihr fachlicher Herkunftskontext gespeichert.**

Als Herkunftskontext kommen insbesondere ein konkreter `Vorgang` oder ein `Thema` in Betracht. Der Herkunftskontext bezeichnet den Bearbeitungszusammenhang, in dem die Wirkung fachlich angelegt und bestätigt wurde.

Damit gilt:

- Ein Ereignis kann keine, eine oder mehrere Wirkungen besitzen.
- Ein Ereignis benötigt weder eine Meldung noch eine Vorgangszuordnung, damit eine Wirkung zu ihm erfasst werden kann.
- Mehrere Wirkungen desselben Ereignisses sind zulässig, wenn sie eigenständige sachliche Aussagen darstellen.
- Eine bereits bestehende Wirkung bleibt fachlich ihrem Herkunftskontext zugeordnet.
- Eine Wirkung darf nur in diesem Herkunftskontext fachlich geändert werden.
- Andere Bearbeitungskontexte dürfen die Wirkung verwenden und analysieren, aber nicht stillschweigend verändern oder durch eine konkurrierende Fassung derselben Aussage ersetzen.

Beispiel:

`Ereignis E1 → Wirkung W1 → Herkunftskontext Vorgang V1`

Ein späteres Thema T1 kann W1 in seiner Analyse berücksichtigen. Soll W1 fachlich geändert werden, muss die Änderung im Vorgang V1 erfolgen.

#### 3.7.2 Mehrere und widersprüchliche Wirkungen

Ein Vorgang bündelt über seine Ereignisse unterschiedliche Wirkungen. Diese können sich ergänzen, in unterschiedliche Richtungen weisen oder scheinbar widersprechen.

Ein solcher Widerspruch ist nicht automatisch ein Datenfehler. Er kann insbesondere entstehen durch:

- gleichzeitig bestehende unterschiedliche Folgen,
- unterschiedliche räumliche oder sachliche Bedingungen,
- zeitliche Veränderungen,
- unterschiedliche Prognosen oder unsichere Erkenntnislagen,
- tatsächliche Inkonsistenzen.

Widersprüchliche oder auffällig gegensätzliche Wirkungen müssen in der Vorgangs- bzw. Themenanalyse als Prüfkonstellation erkennbar sein. Eine automatische Löschung, Überschreibung oder Zusammenführung ist nicht zulässig.

#### 3.7.3 Gleichbedeutende Wirkungen und Analyse-Dubletten

Mehrere Wirkungen desselben Ereignisses können in unterschiedlichen Herkunftskontexten entstanden sein. Sind sie sachlich gleichbedeutend und nur unterschiedlich formuliert, dürfen sie in einer übergeordneten Analyse nicht als mehrere unabhängige Wirkungen gewichtet werden.

Die KI führt deshalb bei neuen oder gemeinsam analysierten Wirkungen eine semantische Plausibilitätsprüfung durch. Eine erkannte mögliche Dublette wird der Redaktion zur Entscheidung vorgelegt.

Die redaktionelle Entscheidung unterscheidet mindestens:

- gleiche Auswirkung,
- unterschiedliche Auswirkungen,
- unsicher.

Bei als gleich bestätigten Wirkungen bleiben die einzelnen Wirkungsdatensätze und ihre Herkunft erhalten. Für Themenanalyse, Abwägung und Textformulierung werden sie jedoch als eine sachliche Aussage behandelt, damit keine künstliche Mehrfachgewichtung entsteht.

#### 3.7.4 Zuordnung `Wirkung ↔ Perspektive`

Für ein Thema werden die Wirkungen aller enthaltenen Ereignisse automatisch berücksichtigt. Eine vorhandene Wirkung wird deshalb nicht erneut für das Thema ausgewählt oder abgewählt.

Die Zuordnung einer Wirkung zu einer oder mehreren bestätigten Perspektiven des Themas ist eine fachlich persistente Zuordnung. Sie wird beim ersten fachlich wirksamen Zuordnen gespeichert und bei späteren Themenanalysen wiederverwendet.

Damit gilt:

- `Wirkung → Perspektive`: `1..n` innerhalb eines konkreten Themas, sofern die Wirkung im Thema berücksichtigt wird,
- eine Perspektive kann `0..n` Wirkungen enthalten,
- eine Wirkung kann mehreren Perspektiven desselben Themas zugeordnet sein,
- eine bestehende Zuordnung wird nicht bei jedem Analyselauf neu erzeugt,
- die KI darf eine erstmalige oder zusätzlich erforderlich gewordene Zuordnung vorschlagen,
- die Redaktion kann die Zuordnung korrigieren,
- eine erneute Prüfung erfolgt nur bei fachlichem Anlass.

Als fachlicher Anlass gelten insbesondere:

- Änderung der zugrunde liegenden Wirkung,
- Umbenennung, Zusammenführung oder Entfernung einer Perspektive,
- neue Perspektive mit möglicher zusätzlicher Relevanz,
- auffällige oder widersprüchliche Zuordnung in einer Plausibilitätsprüfung,
- ausdrückliche redaktionelle Neubewertung.

Die konkrete UI- und Bestätigungslogik wird im Redaktionsworkflow festgelegt. Das Datenmodell muss die persistente Zuordnung und ihre nachvollziehbare Änderung unterstützen.

#### 3.7.5 Strukturierte Bewertungswerte

Für die strukturierte Bewertung einer Wirkung werden vier getrennte Felder mit festen fachlichen Wertemengen verwendet. Die Trennung verhindert, dass Richtung, sachliche Tragweite, Erkenntnissicherheit und politisches Gewicht miteinander vermischt werden.

**Wirkungsrichtung** – Wirkung auf den gewählten Zielbereich:

- unterstützt die Zielerreichung,
- behindert die Zielerreichung,
- keine erkennbare Auswirkung auf die Zielerreichung,
- unklar.

**Bedeutung der Wirkung** – sachliche Tragweite im konkreten Fall:

- hoch,
- mittel,
- gering,
- unklar.

**Verlässlichkeit** – Belastbarkeit der Einschätzung:

- hoch,
- mittel,
- gering,
- unklar.

**Politisches Gewicht** – Bedeutung in der redaktionellen Abwägung:

- hoch,
- mittel,
- gering,
- offen.

Dabei gilt:

- Wirkungsrichtung und Bedeutung der Wirkung sind getrennt; die Richtung enthält keine Intensitätsstufe.
- `unklar` kennzeichnet eine noch nicht ausreichend geklärte fachliche bzw. sachliche Einschätzung.
- `offen` beim politischen Gewicht kennzeichnet dagegen eine noch nicht getroffene redaktionelle Abwägungsentscheidung.
- Die Werte werden nicht mechanisch ineinander übersetzt. Insbesondere bestimmt eine hohe sachliche Tragweite nicht automatisch ein hohes politisches Gewicht und eine geringe Verlässlichkeit nicht automatisch ein geringes politisches Gewicht.
- Benutzernahe Fragen und Darstellung werden im Redaktionsworkflow und Begriffsregister festgelegt.

### 3.8 Strukturierter Redaktionsstand und Textfassung

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

### 3.9 Bestätigung und Plausibilitätsprüfung

Für den strukturierten Redaktionsprozess werden drei Sicherungsebenen unterschieden:

1. **Pflichtbestätigung** – für Angaben, die die fachliche oder politische Kernaussage unmittelbar prägen.
2. **sichtbarer KI-Vorschlag** – für Angaben, die die KI vorschlagen darf und die vom Redakteur sichtbar geprüft und bei Bedarf geändert werden können, ohne dass zwingend eine eigene Bestätigungsaktion erforderlich ist.
3. **Plausibilitätsprüfung über mehrere Felder oder Wirkungen** – zur Erkennung auffälliger, widersprüchlicher oder semantisch doppelter Kombinationen im strukturierten Stand.

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
- `Wirkungsrichtung = behindert die Zielerreichung`, aber positive Gesamtbewertung derselben Wirkung ohne erkennbare Begründung → Inkonsistenzhinweis.
- Eine bestätigte `Wirkung` wurde geändert, die `Abwägung` blieb aber unverändert → erneute Prüfung der Abwägung erforderlich.
- Eine `Gestaltungsoption` erzeugt erwartete neue `Wirkungen`, diese fehlen aber in der Abwägung → Prüfhinweis.
- Eine manuell geänderte `Textfassung` verschiebt eine Bewertung oder Gewichtung, ohne dass sich der strukturierte Redaktionsstand geändert hat → Konsistenzwarnung.
- Zwei Wirkungen desselben Ereignisses sind semantisch möglicherweise gleichbedeutend → redaktionelle Dublettenprüfung.
- Mehrere Wirkungen innerhalb eines Vorgangs widersprechen sich auffällig → Konflikthinweis mit Prüfung auf tatsächlichen Wirkungskonflikt, zeitliche Veränderung, unterschiedliche Bedingungen, unsichere Erkenntnislage oder Inkonsistenz.

Plausibilitätsprüfungen sind keine automatische politische Entscheidung. Sie markieren Konstellationen, bei denen die Redaktion die fachliche Herleitung gezielt prüfen muss.

Die sprachliche Fassung der `Abwägung` wird von der KI erzeugt. Pflichtbestätigt wird die strukturierte Abwägung, nicht jeder einzelne Satz der daraus formulierten Textfassung.

### 3.10 Noch zu klärende Kernbeziehungen

Als nächste Modellierungsschritte werden geklärt:

- `Sitzung/TOP ↔ Ereignis/Meldung/Vorgang/Thema`,
- Modellierung von `Bewertung`, `Begründung`, `Gestaltungsoption`, `Verlässlichkeit`, `politischem Gewicht` und politischem Referenzsystem,
- genaue Versionierungs- und Vergleichslogik zwischen strukturiertem Redaktionsstand und Textfassung,
- konkrete fachliche Plausibilitätsregeln für den Redaktionsprozess.

## 4. Weitere Modellbereiche

### 4.1 Entscheidungskontext

- Sitzung
- TOP
- Tagesordnung
- Beschlussvorlage und weitere Unterlagen
- Beratung / Verfahrensstand
- Beschluss / Ergebnis
- Niederschrift

### 4.2 Wissensbasis und Quellen

Für Quellen und Fundstellen gilt folgende fachliche Trennung:

- `Quelle` – Herkunft bzw. Träger der Information, z. B. Gemeinde, Autobahn GmbH, Pressemedium, Bürgerinitiative oder GRÜNE Feldkirchen.
- `Fundstelle` – konkrete Seite, Dokument, Datei oder sonstige Einheit, in der die relevante Information enthalten ist.
- `Quellenrolle` – fachliche Funktion der Quelle, z. B. amtliche Quelle, journalistische Quelle oder politische Positionsquelle.
- `Bereitstellung` – Art, wie die Fundstelle technisch in FIB verfügbar ist, z. B. externe URL oder in FIB gespeicherte Datei.
- `Sichtbarkeit` – Regel, ob eine gespeicherte Fundstelle öffentlich über FIB zugänglich oder nur redaktionell sichtbar ist.
- Belegbeziehung – Verknüpfung einer Fundstelle mit Aussagen, Ereignissen oder anderen FIB-Inhalten, die sie fachlich stützt.

Verbindliche Entscheidung:

> **Ursprüngliche Internetverfügbarkeit und öffentliche Bereitstellung über FIB sind getrennte Eigenschaften.**

Eine redaktionell eingebrachte Datei kann daher öffentlich als Quelle bereitgestellt werden, obwohl sie zuvor nicht frei im Internet verfügbar war, sofern eine entsprechende redaktionelle Freigabe und Berechtigung zur Veröffentlichung vorliegt.

Mindestens zu unterstützen sind:

1. externe öffentlich erreichbare Fundstelle per URL,
2. redaktionell hochgeladene Datei mit öffentlicher Bereitstellung über FIB,
3. redaktionell hochgeladene Datei nur für interne/redaktionelle Nutzung,
4. dokumentierte Quelle ohne öffentliche URL oder Datei.

Für hochgeladene Dateien sind mindestens nachvollziehbar zu speichern:

- Herkunft/Quelle,
- Dokumenttitel bzw. Bezeichnung,
- Dateityp,
- Speicherreferenz,
- Sichtbarkeit,
- Freigabestatus für öffentliche Bereitstellung,
- gegebenenfalls ursprüngliche URL,
- relevante Metadaten wie Datum/Stand,
- fachliche Verknüpfungen zu Ereignissen, Vorgängen oder belegten Aussagen.

### 4.3 Redaktion, Historisierung und Vertiefung

- Rechercheauftrag
- Aktualisierungsereignis
- Version / Historisierung
- „Unsere Einordnung“
- „Mehr wissen?“-Frage
- gespeicherte Antwort
- Quellen einer Antwort
- Wissenslücke / offene Wissensfrage

Die noch nicht abschließend modellierten Begriffe werden im weiteren G3-Verlauf einzeln geprüft.

## 5. Offene G3-Fragen

1. Wie werden `Bewertungen` und ihre `Begründungen` mit dem grünen Referenzsystem verknüpft?
2. Welche Status gehören zu `Ereignis`, `Meldung`, `Vorgang`, `Thema` und `Sitzung`?
3. Welche Änderungen werden versioniert, welche nur protokolliert?
4. Welche Daten gehören zur fachlichen Persistenz und welche nur zum technischen Betrieb?
5. Welche Plausibilitätsregeln sind verbindlich und welche nur unterstützende Hinweise?
6. Welche zusätzlichen Rechte- und Freigabestatus werden für öffentlich über FIB bereitgestellte Dateien benötigt?

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 03.10.2026 | Feste fachliche Wertemengen für Wirkungsrichtung, Bedeutung der Wirkung, Verlässlichkeit und politisches Gewicht festgelegt; Wirkungsrichtung als Unterstützung/Behinderung der Zielerreichung präzisiert und `unklar` von `offen` beim politischen Gewicht abgegrenzt. |
| 1.1 | 03.10.2026 | Persistente Wirkung-Perspektive-Zuordnung festgelegt: vorhandene Wirkungen eines im Thema enthaltenen Ereignisses werden automatisch berücksichtigt; Zuordnungen zu einer oder mehreren Themenperspektiven werden gespeichert und nur bei fachlichem Änderungsanlass, Plausibilitätskonflikt oder ausdrücklicher redaktioneller Neubewertung erneut geprüft. |
| 1.0 | 03.10.2026 | Wirkungsmodell konkretisiert: Wirkungen fachlich am Ereignis verankert; Herkunftskontext Vorgang/Thema bestimmt Änderungszuständigkeit; mehrere eigenständige Wirkungen je Ereignis zulässig; semantisch gleichbedeutende Wirkungen werden als Analyse-Dubletten erkannt und nicht mehrfach gewichtet; widersprüchliche Wirkungen erzeugen Prüfhinweise statt automatischer Bereinigung. |
| 0.9 | 03.10.2026 | Themenmodell ergänzt: direkt aufgenommene Einzelereignisse erhalten wie Vorgänge die Bedeutung für das Thema mit prägend/relevant/ergänzend; Themen können durch KI-Vorschlag oder redaktionelle Anlage entstehen; bei redaktioneller Neuanlage ist eine Ähnlichkeits-/Dublettprüfung gegen den Themenbestand verpflichtend. |
| 0.8 | 03.10.2026 | Themenmodell korrigiert: Vorgänge als bevorzugte Themenauswahl mit automatischer Mitnahme ihrer Ereignisse; direkte Ereignis-Thema-Beziehung für zusätzliche „Weitere relevante Ereignisse“ zugelassen; Meldungstext und vorhandene „Unsere Einordnung“ werden über Ereignisse als Analysekontext erschlossen; Herkunfts- und Anti-Doppelzählungsregel ergänzt. |
| 0.7 | 03.10.2026 | Quellenmodell konkretisiert: Herkunft, Fundstelle, Bereitstellung und Sichtbarkeit getrennt; öffentliche FIB-Bereitstellung redaktionell hochgeladener Dateien auch ohne ursprüngliche Internetverfügbarkeit ermöglicht; direkte Ereignis-Thema-Beziehung als parallele Zuordnung verworfen. |
| 0.6 | 02.10.2026 | Bestätigungslogik und feldübergreifende Plausibilitätsprüfung für den strukturierten Redaktionsprozess festgelegt; strukturierte Abwägung als fachlich zu bestätigender Stand von der KI-formulierten Textfassung getrennt. |
| 0.5 | 02.10.2026 | `strukturierter Redaktionsstand` als fachliche Quelle und `Textfassung` als daraus erzeugte Darstellung festgelegt; Konsistenz-, Versions- und Änderungsregeln zwischen beiden Ebenen ergänzt. |
| 0.4 | 02.10.2026 | Vorgang↔Thema konkretisiert: Wirkungsrollen-Taxonomie entfällt; „Bedeutung für das Thema“ mit prägend/relevant/ergänzend und verpflichtender redaktioneller Bestätigung eingeführt; Begriffe Perspektive, Wirkung, Bewertung, Begründung und politischer Bezug als nächster Modellierungsbereich abgegrenzt. |
| 0.3 | 02.10.2026 | Beziehung Ereignis ↔ Vorgang verbindlich festgelegt: Ereignis `0..n` Vorgänge, Vorgang `1..n` Ereignisse; Meldung-Vorgang-Zuordnung wird über das Ereignis abgeleitet. |
| 0.2 | 02.10.2026 | Kardinalität Ereignis ↔ Meldung verbindlich festgelegt: ein Ereignis hat 0..1 Meldungen, eine Meldung gehört genau zu einem Ereignis. |
| 0.1 | 01.10.2026 | G3-Primärdokument angelegt; Trennung von Ereignis und Meldung verbindlich festgelegt; weitere Modellbereiche und nächste Klärungsschritte aufgenommen. |
