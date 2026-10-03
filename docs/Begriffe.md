# Begriffsregister – FIB Echtsystem

## Dokumentstand

**Stand:** 03.10.2026, 10:30 Uhr  
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
- Beispiele werden nur ergänzt, wenn sie das Verständnis oder die Abgrenzung eines Begriffs tatsächlich erleichtern.
- Zu jedem Fachbegriff wird soweit sinnvoll das in der App verwendete Benutzer-Label dokumentiert. Das Benutzer-Label darf vom internen Fachbegriff abweichen, wenn dadurch die Bedienung verständlicher wird. Bei kontextbezogenen Eingaben kann statt eines statischen Labels eine konkrete Frage verwendet werden.

Für fachliche Regeln und Kardinalitäten bleiben die jeweiligen Primärdokumente maßgeblich, insbesondere `docs/Datenmodell.md` und `docs/Themen-und-Vorgangslogik.md`.

## 2. Wissenskern

### `Ereignis`

**Benutzer-Label in der App:** Ereignis

Ein fachlich relevantes Geschehen oder eine relevante Entwicklung in der Wirklichkeit.

Beispiel: Eine neue Beschlussvorlage zur Hundewiese wird veröffentlicht oder der Gemeinderat fasst dazu später einen Beschluss.

Nicht zu verwechseln mit Meldung. Das Ereignis beschreibt, was passiert; die Meldung beschreibt, was FIB darüber veröffentlicht.

### `Meldung`

**Benutzer-Label in der App:** Meldung

Die redaktionelle FIB-Darstellung eines eigenständigen berichtenswerten Ereignisses.

Eine Meldung gehört genau zu einem Ereignis. Nicht jedes Ereignis muss eine Meldung erzeugen.

Beispiel: Die Veröffentlichung einer neuen Beschlussvorlage kann als Meldung veröffentlicht werden; ein kleiner interner Planungsschritt desselben Vorgangs muss dagegen keine eigene Meldung erhalten.

### `Vorgang`

**Benutzer-Label in der App:** Vorgang

Ein konkreter länger laufender Sachverhalt, der mehrere Ereignisse bündeln kann und einen eigenen aktuellen Stand, Verlauf, Status, offene Punkte und nächste belegte Schritte besitzt.

Beispiel: „Hundewiese“ ist ein Vorgang, zu dem Veröffentlichung einer Vorlage, Beratung und spätere Beschlussfassung verschiedene Ereignisse sein können.

Nicht zu verwechseln mit Thema. Ein Vorgang ist konkret; ein Thema ist eine übergeordnete Fragestellung.

### `Thema`

**Benutzer-Label in der App:** Thema

Eine übergeordnete Fragestellung, die mehrere Vorgänge, Ereignisse, Perspektiven oder Rahmenbedingungen verbindet und dadurch zusätzlichen Erklärungsgewinn schafft.

Themen entstehen bottom-up aus dem vorhandenen Wissen und werden redaktionell bestätigt.

Beispiel: Ein Thema zur Mobilitätsentwicklung kann mehrere konkrete Vorgänge wie Radwegenetz, Parkraum oder Ausbau des Autobahnkreuzes München Ost verbinden.

## 3. Beziehung Vorgang ↔ Thema

### `Bedeutung für das Thema`

**Benutzer-Label in der App:** Wie wichtig ist dieser Vorgang für das Thema?

Redaktionell bestätigte Einstufung, wie stark ein Vorgang das Verständnis oder die Entwicklung eines Themas prägt.

Stufen:

- prägend – ohne diesen Vorgang lässt sich das Thema derzeit kaum sinnvoll erklären,
- relevant – der Vorgang trägt wesentlich zum Verständnis bei,
- ergänzend – der Vorgang liefert zusätzlichen Kontext, ist aber nicht zentral.

Beispiel: Ein Großprojekt wie der Ausbau des Autobahnkreuzes München Ost kann für ein Mobilitätsthema prägend sein; eine einzelne vorübergehende Umleitung eher ergänzend.

Die KI schlägt die Bedeutung für das Thema vor; die Redaktion muss sie verpflichtend prüfen und bestätigen oder ändern.

Nicht zu verwechseln mit Wirkung. Die Bedeutung für das Thema beschreibt die Stellung eines Vorgangs im Thema insgesamt; eine Wirkung beschreibt eine konkrete sachliche Folge unter einer Perspektive.

### `Wirkungsrolle` – nicht mehr verwendet

**Benutzer-Label in der App:** keines; Begriff wird nicht mehr verwendet

Die frühere Taxonomie „Treiber / Gestaltungsbeitrag / Betroffenheit / Rahmenbedingung / Indikator“ wird nicht mehr als eigenes strukturiertes FIB-Merkmal verwendet.

Die dahinterliegenden fachlichen Aussagen werden über Bedeutung für das Thema, Perspektiven und konkrete Wirkungen abgebildet.

## 4. Perspektive, Wirkung und politische Einordnung

### `Perspektive`

**Benutzer-Label in der App:** Perspektive

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

**Benutzer-Label in der App:** Auswirkung

Eine sachlich belegbare oder begründet erwartbare Folge eines Vorgangs unter einer bestimmten Perspektive.

Beispiel: „zusätzliche Flächeninanspruchnahme“ oder „durchgängige sichere Radverbindung“ sind getrennte Wirkungen und sollten auch getrennt erfasst werden.

Wirkungen gehören zur Sachinformation. Sie können positiv, negativ, gemischt, unklar oder von Bedingungen abhängig sein; diese Beschreibung ist noch keine politische Bewertung.

Nicht zu verwechseln mit Bewertung. Wirkung beschreibt, was geschieht oder voraussichtlich geschieht; Bewertung beschreibt, wie die GRÜNEN Feldkirchen diese Wirkung politisch einordnen.

### `Zielbereich`

**Benutzer-Label in der App:** Zielbereich

Ein Bestandteil des grünen politischen Referenzrahmens, der einen politischen Maßstab mit Beschreibung und Prüfkriterien bereitstellt, anhand dessen konkrete Wirkungen eingeordnet werden können.

Beispiel: „Nachhaltige Mobilität und Verkehrssicherheit“ oder „Flächensparen und nachhaltige Ortsentwicklung“.

Ein Zielbereich besitzt keine feste Rangstufe gegenüber anderen Zielbereichen. Seine Bedeutung für die Einordnung entsteht erst im konkreten Vorgang und in Bezug auf konkrete Wirkungen.

### `Prüfkriterium`

**Benutzer-Label in der App:** Prüfkriterium

Ein strukturierter, möglichst neutral formulierter und beobachtbarer oder prüfbarer Aspekt eines Zielbereichs, anhand dessen eine konkrete Wirkung dem Zielbereich nachvollziehbar zugeordnet werden kann.

Beispiel: Im Zielbereich „Nachhaltige Mobilität und Verkehrssicherheit“ können Verkehrssicherheit, Erreichbarkeit oder Durchgängigkeit einer Radverkehrsverbindung Prüfkriterien sein.

Ein Prüfkriterium beschreibt, **was geprüft wird**, nicht bereits, **wie die Wirkung politisch bewertet werden muss**. Seine Herkunft aus dem Referenzbestand und sein Gültigkeitsstand sollen nachvollziehbar bleiben.

### `Wirkungsrichtung`

**Benutzer-Label in der App:** Wirkung auf das Ziel  
**Kontextbezogene Frage:** Wie wirkt sich diese Auswirkung auf das Ziel aus?

Die fallbezogene Aussage, ob eine konkrete Wirkung einen zugeordneten Zielbereich unterstützt, beeinträchtigt oder ob die Richtung noch unklar ist.

Beispiel: Zusätzliche Flächeninanspruchnahme kann den Zielbereich Flächensparen beeinträchtigen; eine durchgängige sichere Radverbindung kann den Zielbereich nachhaltige Mobilität unterstützen.

Die Wirkungsrichtung wird von der KI vorgeschlagen und redaktionell geprüft. Sie ist keine feste Eigenschaft der Wirkung unabhängig vom Zielbereich.

### `Bedeutung der Wirkung`

**Benutzer-Label in der App:** Tragweite der Auswirkung  
**Kontextbezogene Frage:** Wie groß bzw. weitreichend ist diese Auswirkung?

Die sachliche Tragweite einer Wirkung im konkreten Fall.

Sie beschreibt nicht, wie stark die Wirkung politisch gewichtet wird. Eine sachlich kleine Wirkung kann politisch stark gewichtet werden und umgekehrt.

### `Verlässlichkeit`

**Benutzer-Label in der App:** Verlässlichkeit der Einschätzung  
**Kontextbezogene Frage:** Wie gut ist diese Einschätzung belegt?

Einschätzung, wie belastbar die Aussage ist, dass eine angenommene oder beschriebene Wirkung tatsächlich zutrifft oder eintreten wird.

Beispiel: Ein bereits planfestgestellter Flächenbedarf kann eine hohe Verlässlichkeit haben; ein nur vermuteter Verlagerungseffekt des Verkehrs eine geringere.

Die Verlässlichkeit kann insbesondere von Quellenlage, Datenqualität, Planungsstand, Abhängigkeiten und Unsicherheiten beeinflusst werden.

### `Politisches Gewicht`

**Benutzer-Label in der App:** Gewicht in der Abwägung  
**Kontextbezogene Frage:** Wie stark soll diese Auswirkung in der Abwägung zählen?

Fallbezogene Einschätzung, wie stark eine konkrete Wirkung in der grünen Abwägung berücksichtigt wird.

Das politische Gewicht ist keine feste Eigenschaft eines Zielbereichs. Es wird für die konkrete Wirkung im konkreten Vorgang bestimmt. Die KI darf es anhand dokumentierter Kriterien und Referenzen vorschlagen; fachlich wirksam wird es nach redaktioneller Bestätigung.

Beispiel: Eine räumlich kleine, aber irreversible Beeinträchtigung kann ein hohes politisches Gewicht erhalten, obwohl ihre quantitative Bedeutung begrenzt ist.

### `Bewertung`

**Benutzer-Label in der App:** Politische Bewertung

Die politische Beurteilung einer Wirkung im Rahmen von „Unsere Einordnung“.

Die strukturierte Bewertungssicht in FIB ist die von BÜNDNIS 90/DIE GRÜNEN Feldkirchen. Positionen anderer Akteure können als Sachinformation dokumentiert werden, bilden aber kein paralleles FIB-Bewertungssystem.

Die Bewertung kann durch Wirkungsrichtung, politisches Gewicht und Begründung strukturiert werden. Ob dafür zusätzlich ein eigenes Bewertungsfeld erforderlich ist, wird im weiteren G3-Modell noch abschließend geklärt.

### `Begründung`

**Benutzer-Label in der App:** Begründung

Die nachvollziehbare Herleitung, warum eine Wirkung politisch so bewertet und gewichtet wird.

Die Begründung soll, soweit für das Verständnis erforderlich, den politischen Maßstab offenlegen und darf nicht nur ein unbegründetes Werturteil wiederholen.

### `Gestaltungsoption`

**Benutzer-Label in der App:** Gestaltungsoption

Eine fallbezogene Möglichkeit, einen konkreten Vorgang anders auszugestalten, negative Wirkungen zu vermeiden oder zu mindern oder zusätzliche positive Wirkungen zu erzeugen.

Beispiel: Bei einer ohnehin vorgesehenen Straßenmaßnahme können ein begleitender Radweg oder ein Linienbiotop zusätzliche Gestaltungsoptionen sein.

Gestaltungsoptionen werden nicht als fertiger Maßnahmenvorrat im politischen Referenzsystem hinterlegt. Sie werden im konkreten Fall durch KI, Redaktion, externe Akteure oder Quellen eingebracht und über ihre erwarteten Wirkungen bewertet.

### `Abwägung`

**Benutzer-Label in der App:** Abwägung

Strukturierte Zusammenschau der für einen konkreten Vorgang relevanten Wirkungen, Zielbereiche, Wirkungsrichtungen, Bedeutungen, Verlässlichkeiten, politischen Gewichte, Gestaltungsoptionen und Zielkonflikte.

Beispiel: Zusätzlicher Flächenverbrauch kann gegen Verbesserungen für Radverkehr oder Biotopvernetzung abgewogen werden, ohne die unterschiedlichen Wirkungen rechnerisch gegeneinander aufzurechnen.

Die Abwägung ist keine rechnerische Addition von Plus- und Minuspunkten. Die KI erstellt einen nachvollziehbaren Vorschlag; die strukturierte Abwägung wird redaktionell bestätigt und bildet die Grundlage für die sprachliche Einordnung.

### `Politischer Bezug`

**Benutzer-Label in der App:** Politischer Bezug

Ein grüner Wert, ein politisches Ziel oder eine dokumentierte grüne Position, auf die sich die Begründung einer Bewertung stützt.

Der politische Bezug kann insbesondere aus folgenden Ebenen stammen:

- dokumentierte lokale Position der GRÜNEN Feldkirchen,
- Position einer höheren grünen Ebene als Referenz für eine redaktionelle Ableitung,
- allgemeiner grüner Wert oder Zielbereich als Bewertungsmaßstab.

Die konkrete Modellierung dieses Referenzsystems wird in G3 gesondert festgelegt.

## 5. Redaktion und Konsistenz

### `Strukturierter Redaktionsstand`

**Benutzer-Label in der App:** Bearbeitungsstand

Die fachlich maßgebliche, versionierte Gesamtheit der redaktionell bestätigten oder bearbeiteten strukturierten Angaben, aus denen insbesondere „Unsere Einordnung“ erzeugt wird.

Er ist die fachliche Quelle gegenüber der späteren sprachlichen Textfassung.

Beispiel: Ändert der Redakteur nur das politische Gewicht einer Wirkung, darf eine neu erzeugte Textfassung nicht zugleich andere unveränderte Kernaussagen verschieben.

### `Textfassung`

**Benutzer-Label in der App:** Textfassung

Die sprachliche Darstellung, die aus einem bestimmten strukturierten Redaktionsstand erzeugt und anschließend redaktionell nachbearbeitet werden kann.

Eine Textänderung darf eine fachliche Änderung nicht verdeckt einführen. Fachliche Abweichungen müssen in den strukturierten Redaktionsstand zurückgeführt oder zurückgenommen werden.

### `Plausibilitätsprüfung`

**Benutzer-Label in der App:** Prüfhinweis

Prüfung mehrerer strukturierter Angaben in ihrem Zusammenhang, um auffällige oder widersprüchliche Kombinationen zu erkennen.

Beispiel: geringe Verlässlichkeit einer Wirkung bei gleichzeitig hohem politischem Gewicht. Eine Plausibilitätsprüfung erzeugt einen Prüfhinweis, ersetzt aber nicht die redaktionelle Entscheidung.

### `Pflichtbestätigung`

**Benutzer-Label in der App:** Bestätigung erforderlich

Explizite redaktionelle Bestätigung einer strukturierten Angabe, wenn diese die fachliche oder politische Kernaussage unmittelbar prägt.

Nicht jedes KI-vorgeschlagene Feld benötigt eine eigene Pflichtbestätigung; unterstützende Angaben können sichtbar vorgeschlagen und durch Plausibilitätsprüfungen abgesichert werden.

## 6. Rollen

### `Admin`

**Benutzer-Label in der App:** Admin

Die fachlich und technisch verantwortliche Rolle im FIB-System.

Der Admin ist nicht nur für technische Administration zuständig, sondern verantwortet insbesondere auch den freigegebenen Stand des politischen Referenzsystems. KI- oder redaktionell vorgeschlagene Änderungen am Referenzsystem werden erst durch Admin-Freigabe fachlich wirksam.

Die detaillierte Rechteausgestaltung wird im Gründungspaket G6 festgelegt.

## 7. Akteur und Position

### `Akteur`

**Benutzer-Label in der App:** Akteur

Eine Organisation, Institution, Gruppe oder gegebenenfalls Person, die für einen Sachverhalt relevant ist, z. B. Gemeinde, Landkreis, Autobahn GmbH, Bürgerinitiative, Verein oder Partei.

Akteure können insbesondere zuständig, beteiligt, betroffen, Quelle einer Aussage oder Träger einer dokumentierten Position sein.

### `Dokumentierte Position`

**Benutzer-Label in der App:** Dokumentierte Position

Eine einem Akteur belegbar zuordenbare Aussage, Forderung, Bewertung oder Zielsetzung.

Beispiel: Ein beschlossener Antrag des Ortsverbands oder eine öffentlich dokumentierte Stellungnahme kann eine dokumentierte Position sein; eine erst im Redaktionsprozess entwickelte Gestaltungsoption dagegen nicht automatisch.

Positionen anderer Akteure gehören zur Sachinformation und werden als solche zugeschrieben. Sie werden nicht mit der strukturierten grünen Bewertung in „Unsere Einordnung“ vermischt.

## 8. Recherche und KI-Betrieb

### `Quellenbeobachtung`

**Benutzer-Label in der App:** Quellenbeobachtung

Technische Überwachung bereits bekannter Quellen und Adressen auf neue oder geänderte Inhalte. Die reine Änderungsfeststellung erfolgt soweit möglich ohne KI. Erst eine neue oder geänderte Fundstelle wird semantisch analysiert.

### `Quellenentdeckung`

**Benutzer-Label in der App:** Neue Quellen finden

Aktive, KI-gestützte Suche nach bislang nicht bekannten Quellen, die für FIB relevant sein könnten. Gefundene Quellenkandidaten werden redaktionell geprüft und können anschließend als bekannte Quellen in die Quellenbeobachtung übernommen werden.

### `Verpflichtende Entdeckungs-/Eingangs-KI`

**Benutzer-Label in der App:** KI-Eingangsanalyse

KI-Einsatz für qualitätskritische Eingangsfunktionen, die im automatisierten FIB-Betrieb ohne semantische KI nicht zuverlässig erfüllt werden können. Dazu gehören insbesondere Quellenentdeckung, semantische Analyse neuer oder geänderter Fundstellen und Ereigniserkennung.

„Verpflichtend“ bedeutet, dass die Funktion für den vorgesehenen automatisierten FIB-Betrieb KI benötigt; es bedeutet nicht, dass das KI-Ergebnis ohne redaktionelle Prüfung fachlich wirksam wird.

### `Bedarfsgesteuerte Recherche-KI`

**Benutzer-Label in der App:** KI-Recherche starten

Gezielter KI-Einsatz für eine konkrete Wissenslücke oder offene Recherchefrage, die im Redaktionsprozess entstanden ist. Statt einen gesamten Vorgang vorsorglich erneut analysieren zu lassen, wird nur der konkrete Recherchebedarf bearbeitet.

### `Optionale Redaktions-KI`

**Benutzer-Label in der App:** KI-Vorschlag erzeugen

Zuschaltbare KI-Unterstützung für Redaktionsschritte, die auch ohne KI vollständig bearbeitet werden können, etwa Wirkungen vorschlagen, Prüfkriterien vorauswählen, Plausibilität prüfen oder Textentwürfe erzeugen.

### `KI-Leistungsklasse`

**Benutzer-Label in der App:** KI-Leistungsklasse

Modellunabhängige Einordnung der für eine FIB-Aufgabe erforderlichen KI-Leistungsstufe. Die Leistungsklasse legt keinen bestimmten Anbieter oder Modellnamen fest.

### `Routing-Matrix`

**Benutzer-Label in der App:** KI-Routing

Konfigurierbare Zuordnung von FIB-Aufgaben zu KI-Bedarf, Qualitätsanforderung bzw. KI-Leistungsklasse, freigegebenem Provider/Modell, Fallback- und gegebenenfalls Kostenregeln. Die Routing-Matrix ermöglicht Modellwechsel, ohne Redaktionsworkflow oder fachliche Regeln umzubauen.

## 9. Noch zu ergänzende Begriffe

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
