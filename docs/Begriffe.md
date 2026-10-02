# Begriffsregister – FIB Echtsystem

## Dokumentstand

**Stand:** 02.10.2026, 15:17 Uhr  
**Verantwortlich:** Josef Walter – erstellt mit KI-Unterstützung

Dieses Dokument wird im Normalfall über das **Stand-Datum einschließlich Uhrzeit** fortgeschrieben. Eine neue Versionsnummer wird nur eingeführt, wenn sich die Struktur oder das Grundkonzept des Dokuments wesentlich ändert.

## 1. Zweck und Pflege

Dieses Dokument ist die verbindliche Primärquelle für die Bedeutung und Abgrenzung zentraler FIB-Begriffe.

Es soll insbesondere verhindern, dass fachlich ähnliche Begriffe im Datenmodell, in der Redaktion oder in der KI-Logik unterschiedlich verwendet werden.

Für die Hervorhebung gilt:

- Ein definierter Fachbegriff wird als `Code-Begriff` nur dort hervorgehoben, wo er unmittelbar anschließend erklärt, abgegrenzt oder als Gegenstand einer Definition behandelt wird.
- In normalem Fließtext werden bereits definierte Fachbegriffe nicht routinemäßig als Code formatiert.
- Die Hervorhebung dient der Definition, nicht der allgemeinen typografischen Kennzeichnung.

Für die Pflege gilt:

- Neue fachlich relevante Begriffe, die im Projektchat oder in der Projektdokumentation entstehen und eine eigenständige Bedeutung für Modell, Redaktion, Recherche, Bewertung oder Betrieb haben, werden automatisch in dieses Register aufgenommen.
- Besteht Unsicherheit, ob ein Ausdruck bereits ein eigener Fachbegriff oder nur eine vorläufige Formulierung ist, wird vor der Aufnahme nachgefragt bzw. die Begriffsklärung im Dialog fortgeführt.
- Eine Aufnahme ins Begriffsregister ersetzt nicht die fachliche Regelung im jeweils zuständigen Primärdokument.

Für fachliche Regeln und Kardinalitäten bleiben die jeweiligen Primärdokumente maßgeblich, insbesondere `docs/Datenmodell.md` und `docs/Themen-und-Vorgangslogik.md`.

## 2. Wissenskern

### `Ereignis`

Ein fachlich relevantes Geschehen oder eine relevante Entwicklung in der Wirklichkeit.

Nicht zu verwechseln mit Meldung. Das Ereignis beschreibt, was passiert; die Meldung beschreibt, was FIB darüber veröffentlicht.

### `Meldung`

Die redaktionelle FIB-Darstellung eines eigenständigen berichtenswerten Ereignisses.

Eine Meldung gehört genau zu einem Ereignis. Nicht jedes Ereignis muss eine Meldung erzeugen.

### `Vorgang`

Ein konkreter länger laufender Sachverhalt, der mehrere Ereignisse bündeln kann und einen eigenen aktuellen Stand, Verlauf, Status, offene Punkte und nächste belegte Schritte besitzt.

Nicht zu verwechseln mit Thema. Ein Vorgang ist konkret; ein Thema ist eine übergeordnete Fragestellung.

### `Thema`

Eine übergeordnete Fragestellung, die mehrere Vorgänge, Ereignisse, Perspektiven oder Rahmenbedingungen verbindet und dadurch zusätzlichen Erklärungsgewinn schafft.

Themen entstehen bottom-up aus dem vorhandenen Wissen und werden redaktionell bestätigt.

## 3. Beziehung Vorgang ↔ Thema

### `Bedeutung für das Thema`

Redaktionell bestätigte Einstufung, wie stark ein Vorgang das Verständnis oder die Entwicklung eines Themas prägt.

Stufen:

- prägend – ohne diesen Vorgang lässt sich das Thema derzeit kaum sinnvoll erklären,
- relevant – der Vorgang trägt wesentlich zum Verständnis bei,
- ergänzend – der Vorgang liefert zusätzlichen Kontext, ist aber nicht zentral.

Die KI schlägt die Bedeutung für das Thema vor; die Redaktion muss sie verpflichtend prüfen und bestätigen oder ändern.

Nicht zu verwechseln mit Wirkung. Die Bedeutung für das Thema beschreibt die Stellung eines Vorgangs im Thema insgesamt; eine Wirkung beschreibt eine konkrete sachliche Folge unter einer Perspektive.

### `Wirkungsrolle` – nicht mehr verwendet

Die frühere Taxonomie „Treiber / Gestaltungsbeitrag / Betroffenheit / Rahmenbedingung / Indikator“ wird nicht mehr als eigenes strukturiertes FIB-Merkmal verwendet.

Die dahinterliegenden fachlichen Aussagen werden über Bedeutung für das Thema, Perspektiven und konkrete Wirkungen abgebildet.

## 4. Perspektive, Wirkung und politische Einordnung

### `Perspektive`

Ein sachlicher Betrachtungsaspekt innerhalb eines Themas, unter dem relevante Vorgänge und ihre Folgen untersucht werden.

Beispiele:

- Lärm,
- Verkehrssicherheit,
- Verkehrsströme,
- Flächenverbrauch,
- Erreichbarkeit,
- kommunaler Handlungsspielraum.

Eine Perspektive ist zunächst wertungsfrei.

Nicht zu verwechseln mit Akteursperspektive oder politischer Bewertung. „Lärm“ ist eine fachliche Perspektive; „Autobahn GmbH“ oder „GRÜNE Feldkirchen“ sind Akteure bzw. politische Träger.

### `Wirkung`

Eine sachlich belegbare oder begründet erwartbare Folge eines Vorgangs unter einer bestimmten Perspektive.

Wirkungen gehören zur Sachinformation. Sie können positiv, negativ, gemischt, unklar oder von Bedingungen abhängig sein; diese Beschreibung ist noch keine politische Bewertung.

Nicht zu verwechseln mit Bewertung. Wirkung beschreibt, was geschieht oder voraussichtlich geschieht; Bewertung beschreibt, wie die GRÜNEN Feldkirchen diese Wirkung politisch einordnen.

### `Zielbereich`

Ein Bestandteil des grünen politischen Referenzrahmens, der einen politischen Maßstab mit Beschreibung und Prüfkriterien bereitstellt, anhand dessen konkrete Wirkungen eingeordnet werden können.

Ein Zielbereich besitzt keine feste Rangstufe gegenüber anderen Zielbereichen. Seine Bedeutung für die Einordnung entsteht erst im konkreten Vorgang und in Bezug auf konkrete Wirkungen.

### `Wirkungsrichtung`

Die fallbezogene Aussage, ob eine konkrete Wirkung einen zugeordneten Zielbereich unterstützt, beeinträchtigt oder ob die Richtung noch unklar ist.

Die Wirkungsrichtung wird von der KI vorgeschlagen und redaktionell geprüft. Sie ist keine feste Eigenschaft der Wirkung unabhängig vom Zielbereich.

### `Bedeutung der Wirkung`

Die sachliche Tragweite einer Wirkung im konkreten Fall.

Sie beschreibt nicht, wie stark die Wirkung politisch gewichtet wird. Eine sachlich kleine Wirkung kann politisch stark gewichtet werden und umgekehrt.

### `Verlässlichkeit`

Einschätzung, wie belastbar die Aussage ist, dass eine angenommene oder beschriebene Wirkung tatsächlich zutrifft oder eintreten wird.

Die Verlässlichkeit kann insbesondere von Quellenlage, Datenqualität, Planungsstand, Abhängigkeiten und Unsicherheiten beeinflusst werden. Im UI kann dafür eine verständlichere Bezeichnung wie „Verlässlichkeit der Aussage“ verwendet werden.

### `Politisches Gewicht`

Fallbezogene Einschätzung, wie stark eine konkrete Wirkung in der grünen Abwägung berücksichtigt wird.

Das politische Gewicht ist keine feste Eigenschaft eines Zielbereichs. Es wird für die konkrete Wirkung im konkreten Vorgang bestimmt. Die KI darf es anhand dokumentierter Kriterien und Referenzen vorschlagen; fachlich wirksam wird es nach redaktioneller Bestätigung.

### `Bewertung`

Die politische Beurteilung einer Wirkung im Rahmen von „Unsere Einordnung“.

Die strukturierte Bewertungssicht in FIB ist die von BÜNDNIS 90/DIE GRÜNEN Feldkirchen. Positionen anderer Akteure können als Sachinformation dokumentiert werden, bilden aber kein paralleles FIB-Bewertungssystem.

Die Bewertung kann durch Wirkungsrichtung, politisches Gewicht und Begründung strukturiert werden. Ob dafür zusätzlich ein eigenes Bewertungsfeld erforderlich ist, wird im weiteren G3-Modell noch abschließend geklärt.

### `Begründung`

Die nachvollziehbare Herleitung, warum eine Wirkung politisch so bewertet und gewichtet wird.

Die Begründung soll, soweit für das Verständnis erforderlich, den politischen Maßstab offenlegen und darf nicht nur ein unbegründetes Werturteil wiederholen.

### `Gestaltungsoption`

Eine fallbezogene Möglichkeit, einen konkreten Vorgang anders auszugestalten, negative Wirkungen zu vermeiden oder zu mindern oder zusätzliche positive Wirkungen zu erzeugen.

Gestaltungsoptionen werden nicht als fertiger Maßnahmenvorrat im politischen Referenzsystem hinterlegt. Sie werden im konkreten Fall durch KI, Redaktion, externe Akteure oder Quellen eingebracht und über ihre erwarteten Wirkungen bewertet.

### `Abwägung`

Strukturierte Zusammenschau der für einen konkreten Vorgang relevanten Wirkungen, Zielbereiche, Wirkungsrichtungen, Bedeutungen, Verlässlichkeiten, politischen Gewichte, Gestaltungsoptionen und Zielkonflikte.

Die Abwägung ist keine rechnerische Addition von Plus- und Minuspunkten. Die KI erstellt einen nachvollziehbaren Vorschlag; die strukturierte Abwägung wird redaktionell bestätigt und bildet die Grundlage für die sprachliche Einordnung.

### `Politischer Bezug`

Ein grüner Wert, ein politisches Ziel oder eine dokumentierte grüne Position, auf die sich die Begründung einer Bewertung stützt.

Der politische Bezug kann insbesondere aus folgenden Ebenen stammen:

- dokumentierte lokale Position der GRÜNEN Feldkirchen,
- Position einer höheren grünen Ebene als Referenz für eine redaktionelle Ableitung,
- allgemeiner grüner Wert oder Zielbereich als Bewertungsmaßstab.

Die konkrete Modellierung dieses Referenzsystems wird in G3 gesondert festgelegt.

## 5. Redaktion und Konsistenz

### `Strukturierter Redaktionsstand`

Die fachlich maßgebliche, versionierte Gesamtheit der redaktionell bestätigten oder bearbeiteten strukturierten Angaben, aus denen insbesondere „Unsere Einordnung“ erzeugt wird.

Er ist die fachliche Quelle gegenüber der späteren sprachlichen Textfassung.

### `Textfassung`

Die sprachliche Darstellung, die aus einem bestimmten strukturierten Redaktionsstand erzeugt und anschließend redaktionell nachbearbeitet werden kann.

Eine Textänderung darf eine fachliche Änderung nicht verdeckt einführen. Fachliche Abweichungen müssen in den strukturierten Redaktionsstand zurückgeführt oder zurückgenommen werden.

### `Plausibilitätsprüfung`

Prüfung mehrerer strukturierter Angaben in ihrem Zusammenhang, um auffällige oder widersprüchliche Kombinationen zu erkennen.

Beispiel: geringe Verlässlichkeit einer Wirkung bei gleichzeitig hohem politischem Gewicht. Eine Plausibilitätsprüfung erzeugt einen Prüfhinweis, ersetzt aber nicht die redaktionelle Entscheidung.

### `Pflichtbestätigung`

Explizite redaktionelle Bestätigung einer strukturierten Angabe, wenn diese die fachliche oder politische Kernaussage unmittelbar prägt.

Nicht jedes KI-vorgeschlagene Feld benötigt eine eigene Pflichtbestätigung; unterstützende Angaben können sichtbar vorgeschlagen und durch Plausibilitätsprüfungen abgesichert werden.

## 6. Rollen

### `Admin`

Die fachlich und technisch verantwortliche Rolle im FIB-System.

Der Admin ist nicht nur für technische Administration zuständig, sondern verantwortet insbesondere auch den freigegebenen Stand des politischen Referenzsystems. KI- oder redaktionell vorgeschlagene Änderungen am Referenzsystem werden erst durch Admin-Freigabe fachlich wirksam.

Die detaillierte Rechteausgestaltung wird im Gründungspaket G6 festgelegt.

## 7. Akteur und Position

### `Akteur`

Eine Organisation, Institution, Gruppe oder gegebenenfalls Person, die für einen Sachverhalt relevant ist, z. B. Gemeinde, Landkreis, Autobahn GmbH, Bürgerinitiative, Verein oder Partei.

Akteure können insbesondere zuständig, beteiligt, betroffen, Quelle einer Aussage oder Träger einer dokumentierten Position sein.

### `Dokumentierte Position`

Eine einem Akteur belegbar zuordenbare Aussage, Forderung, Bewertung oder Zielsetzung.

Positionen anderer Akteure gehören zur Sachinformation und werden als solche zugeschrieben. Sie werden nicht mit der strukturierten grünen Bewertung in „Unsere Einordnung“ vermischt.

## 8. Noch zu ergänzende Begriffe

Dieses Register wird im Verlauf von G3 und den folgenden Gründungspaketen erweitert, insbesondere um:

- Quelle,
- Fundstelle,
- Quellenrolle,
- Sitzung,
- TOP,
- Aktualisierungsereignis,
- Version / Historisierung,
- Rechercheauftrag,
- Wissenslücke,
- Freigabestatus.
