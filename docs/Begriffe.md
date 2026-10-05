# Begriffsregister – FIB Echtsystem

## Dokumentstand

**Stand:** 05.10.2026, 23:45 Uhr  
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

Themen können durch KI als Kandidaten vorgeschlagen oder redaktionell neu angelegt werden. Eine redaktionelle Neuanlage wird vor dem Speichern auf gleiche oder ähnliche vorhandene Themen geprüft.

Beispiel: Ein Thema zur Mobilitätsentwicklung kann mehrere konkrete Vorgänge wie Radwegenetz, Parkraum oder Ausbau des Autobahnkreuzes München Ost verbinden.

## 3. Beziehung Themenbestandteil ↔ Thema

### `Bedeutung für das Thema`

**Benutzer-Label in der App:** Wie wichtig ist dieser Bestandteil für das Thema?  
**Kontextbezogene Frage:** Wie wichtig ist dieser Vorgang / dieses Ereignis für das Thema?

Redaktionell bestätigte Einstufung, wie stark ein ausgewählter Vorgang oder ein direkt in das Thema aufgenommenes einzelnes Ereignis das Verständnis oder die Entwicklung eines Themas prägt.

Stufen:

- prägend – ohne diesen Themenbestandteil lässt sich das Thema derzeit kaum sinnvoll erklären,
- relevant – der Themenbestandteil trägt wesentlich zum Verständnis bei,
- ergänzend – der Themenbestandteil liefert zusätzlichen Kontext, ist aber nicht zentral.

Beispiel: Ein Großprojekt wie der Ausbau des Autobahnkreuzes München Ost kann für ein Mobilitätsthema prägend sein; ein einzelnes zusätzlich aufgenommenes Ereignis kann ergänzend sein.

Die KI schlägt die Bedeutung für das Thema vor; die Redaktion muss sie verpflichtend prüfen und bestätigen oder ändern.

Nicht zu verwechseln mit Wirkung. Die Bedeutung für das Thema beschreibt die Stellung eines Vorgangs oder Ereignisses im Thema insgesamt; eine Wirkung beschreibt eine konkrete sachliche Folge unter einer Perspektive.

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

Eine sachlich belegbare oder begründet erwartbare Folge, die fachlich an einem Ereignis verankert ist. Eine Wirkung kann in einem Vorgangs- oder Themenkontext angelegt werden; dieser Herkunftskontext bestimmt, wo sie später geändert werden darf.

Beispiel: „zusätzliche Flächeninanspruchnahme“ oder „durchgängige sichere Radverbindung“ sind getrennte Wirkungen und sollten auch getrennt erfasst werden.

Wirkungen gehören zur Sachinformation. Sie können unterschiedliche oder auch widersprüchliche Folgen beschreiben; die politische Bewertung erfolgt getrennt über den Bewertungsprozess.

Nicht zu verwechseln mit Bewertung. Wirkung beschreibt, was geschieht oder voraussichtlich geschieht; Bewertung beschreibt, wie die GRÜNEN Feldkirchen diese Wirkung politisch einordnen.

### `Referenzmaßstab`

**Benutzer-Label in der App:** Referenzmaßstab

Ein dokumentierter, versionierter Maßstab, den FIB verwendet, um Recherchefragen, Relevanzprüfungen, Qualitätsprüfungen oder politische Einordnungen nachvollziehbar auszurichten.

Ein Referenzmaßstab ist **keine Tatsachenbehauptung über den konkreten Sachverhalt** und darf die Tatsachenbasis nicht verändern. Er macht vielmehr transparent, welche Fragen gestellt und nach welchen Maßstäben Ergebnisse geprüft oder eingeordnet werden.

FIB unterscheidet dabei drei Ebenen:

- allgemeine FIB-Qualitätsmaßstäbe, etwa Quellenbezug oder nachvollziehbare Ableitung,
- demokratisch-gesellschaftliche Maßstäbe,
- grün-politische Maßstäbe einschließlich dokumentierter lokaler Positionen der GRÜNEN Feldkirchen.

Nur Maßstäbe, die für einen konkreten Recherche-, Prüf- oder Bewertungsschritt tatsächlich relevant sind, sollen dort referenziert werden; nicht der gesamte Referenzrahmen.

Nicht zu verwechseln mit Referenzwissen: Referenzwissen hilft, Sachverhalte, Orte, Objekte, Akteure oder Zusammenhänge zu erkennen und zuzuordnen. Ein Referenzmaßstab beschreibt dagegen, **nach welchem Qualitäts-, demokratischen oder politischen Maßstab FIB prüft oder einordnet**.

### `Zielbereich`

**Benutzer-Label in der App:** Zielbereich

Ein Bestandteil des grünen politischen Referenzrahmens, der einen politischen Maßstab mit Beschreibung und Prüfkriterien bereitstellt, anhand dessen konkrete Wirkungen eingeordnet werden können.

Beispiel: „Nachhaltige Mobilität und Verkehrssicherheit“ oder „Flächensparen und nachhaltige Ortsentwicklung“.

Ein Zielbereich besitzt keine feste Rangstufe gegenüber anderen Zielbereichen. Seine Bedeutung für die Einordnung entsteht erst im konkreten Vorgang und in Bezug auf konkrete Wirkungen.

Im übergeordneten Modell ist ein Zielbereich eine fachliche Ausprägung bzw. Strukturierung grün-politischer Referenzmaßstäbe; der Begriff Referenzmaßstab umfasst darüber hinaus auch allgemeine FIB-Qualitätsmaßstäbe und demokratisch-gesellschaftliche Maßstäbe.

### `Prüfkriterium`

**Benutzer-Label in der App:** Prüfkriterium

Ein strukturierter, möglichst neutral formulierter und beobachtbarer oder prüfbarer Aspekt eines Zielbereichs, anhand dessen eine konkrete Wirkung dem Zielbereich nachvollziehbar zugeordnet werden kann.

Beispiel: Im Zielbereich „Nachhaltige Mobilität und Verkehrssicherheit“ können Verkehrssicherheit, Erreichbarkeit oder Durchgängigkeit einer Radverkehrsverbindung Prüfkriterien sein.

Ein Prüfkriterium beschreibt, **was geprüft wird**, nicht bereits, **wie die Wirkung politisch bewertet werden muss**. Seine Herkunft aus dem Referenzbestand und sein Gültigkeitsstand sollen nachvollziehbar bleiben.

### `Wirkungsrichtung`

**Benutzer-Label in der App:** Wirkung auf das Ziel  
**Kontextbezogene Frage:** Wie wirkt sich diese Auswirkung auf das Ziel aus?

Die fallbezogene Aussage, wie eine konkrete Wirkung die Erreichung eines zugeordneten Zielbereichs beeinflusst.

Antwortwerte in der App:

- unterstützt die Zielerreichung,
- behindert die Zielerreichung,
- keine erkennbare Auswirkung auf die Zielerreichung,
- unklar.

Beispiel: Zusätzliche Flächeninanspruchnahme kann die Erreichung des Ziels Flächensparen behindern; eine durchgängige sichere Radverbindung kann die Erreichung des Ziels nachhaltige Mobilität unterstützen.

Die Wirkungsrichtung wird von der KI vorgeschlagen und redaktionell geprüft. Sie ist keine feste Eigenschaft der Wirkung unabhängig vom Zielbereich.

### `Bedeutung der Wirkung`

**Benutzer-Label in der App:** Tragweite der Auswirkung  
**Kontextbezogene Frage:** Wie bedeutend bzw. weitreichend ist diese Auswirkung?

Die sachliche Tragweite einer Wirkung im konkreten Fall.

Antwortwerte in der App:

- hoch,
- mittel,
- gering,
- unklar.

Sie beschreibt nicht, wie stark die Wirkung politisch gewichtet wird. Eine sachlich kleine Wirkung kann politisch stark gewichtet werden und umgekehrt.

### `Verlässlichkeit`

**Benutzer-Label in der App:** Verlässlichkeit der Einschätzung  
**Kontextbezogene Frage:** Wie gut ist diese Einschätzung belegt?

Einschätzung, wie belastbar die Aussage ist, dass eine angenommene oder beschriebene Wirkung tatsächlich zutrifft oder eintreten wird.

Antwortwerte in der App:

- hoch,
- mittel,
- gering,
- unklar.

Beispiel: Ein bereits planfestgestellter Flächenbedarf kann eine hohe Verlässlichkeit haben; ein nur vermuteter Verlagerungseffekt des Verkehrs eine geringere.

Die Verlässlichkeit kann insbesondere von Quellenlage, Datenqualität, Planungsstand, Abhängigkeiten und Unsicherheiten beeinflusst werden.

### `Politisches Gewicht`

**Benutzer-Label in der App:** Gewicht in der Abwägung  
**Kontextbezogene Frage:** Wie stark soll diese Auswirkung in der Abwägung zählen?

Fallbezogene Einschätzung, wie stark eine konkrete Wirkung in der grünen Abwägung berücksichtigt wird.

Antwortwerte in der App:

- hoch,
- mittel,
- gering,
- offen.

„Offen“ bedeutet hier, dass die redaktionelle Abwägungsentscheidung noch nicht getroffen ist; es bezeichnet keine Unsicherheit über die Tatsachenlage.

Das politische Gewicht ist keine feste Eigenschaft eines Zielbereichs. Es wird für die konkrete Wirkung im konkreten Vorgang bestimmt. Die KI darf es anhand dokumentierter Kriterien und Referenzen vorschlagen; fachlich wirksam wird es nach redaktioneller Bestätigung.

Beispiel: Eine räumlich kleine, aber irreversible Beeinträchtigung kann ein hohes politisches Gewicht erhalten, obwohl ihre quantitative Bedeutung begrenzt ist.

### `Bewertung`

**Benutzer-Label in der App:** Politische Bewertung

Die politische Beurteilung einer Wirkung im Rahmen von „Unsere Einordnung“.

Die strukturierte Bewertungssicht in FIB ist die von BÜNDNIS 90/DIE GRÜNEN Feldkirchen. Positionen anderer Akteure können als Sachinformation dokumentiert werden, bilden aber kein paralleles FIB-Bewertungssystem.

Die Bewertung wird durch die strukturierten Angaben zu Wirkungsrichtung, Bedeutung, Verlässlichkeit, politischem Gewicht und Begründungen nachvollziehbar hergeleitet. Ein zusätzliches pauschales Gesamturteil positiv/negativ ist nicht Bestandteil des Modells.

### `Begründung`

**Benutzer-Label in der App:** Begründung

Die nachvollziehbare Herleitung eines strukturierten Bewertungsurteils. FIB führt getrennte Begründungen insbesondere für Wirkungsrichtung, Bedeutung der Wirkung, Verlässlichkeit und politisches Gewicht.

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

Die Abwägung ist keine rechnerische Addition von Plus- und Minuspunkten. Die KI erstellt einen nachvollziehbaren Vorschlag; die strukturierte Abwägung wird redaktionell bestätigt und bildet die Grundlage für die sprachliche Einordnung. FIB leitet daraus kein abschließendes Gesamturteil über Vorgang oder Thema ab.

### `Politischer Bezug`

**Benutzer-Label in der App:** Politischer Bezug

Ein dokumentierter grüner Wert, ein politisches Ziel oder eine konkrete grüne Position, auf die sich eine Begründung stützt.

Ein politischer Bezug wird zusätzlich verwendet, wenn eine einschlägige dokumentierte Position vorhanden ist. Fehlt eine konkrete lokale Position, blockiert dies die Bewertung nicht; der einschlägige Zielbereich kann als allgemeiner politischer Maßstab dienen.

Dokumentierte lokale Positionen haben bei der Herleitung Vorrang vor allgemeineren grünen Bezugsebenen, soweit sie einschlägig und gültig sind.

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

Semantische oder feldübergreifende Prüfung, die eine fachlich auffällige, widersprüchliche oder möglicherweise doppelte Konstellation erkennt, ohne selbst eine politische oder redaktionelle Entscheidung zu treffen.

Eine Plausibilitätsprüfung erzeugt bei Entscheidungsspielraum einen sichtbaren Prüfhinweis. Objektiv unzulässige Zustände werden dagegen durch blockierende Fachregeln verhindert.

Beispiel: geringe Verlässlichkeit einer Wirkung bei gleichzeitig hohem politischem Gewicht kann einen Prüfhinweis auslösen.

### `Pflichtbestätigung`

**Benutzer-Label in der App:** Bestätigung erforderlich

Explizite redaktionelle Bestätigung einer strukturierten Angabe, wenn diese die fachliche oder politische Kernaussage unmittelbar prägt.

Nicht jedes KI-vorgeschlagene Feld benötigt eine eigene Pflichtbestätigung; unterstützende Angaben können sichtbar vorgeschlagen und durch Plausibilitätsprüfungen abgesichert werden.

### `Fachfunktion`

**Benutzer-Label in der App:** kein technisches Pflichtlabel

Eine definierte fachliche Serviceoperation, über die reguläre fachliche Lese- oder Schreibzugriffe auf FIB-Daten erfolgen. Web-App, FIB-Chat und AI Tasks verwenden dieselbe Fachfunktionsschicht; Berechtigungen, Fachregeln, Versionierung, Bestätigung und Audit werden dabei serverseitig durchgesetzt.

Fachfunktionen definieren nicht erneut die Datenstruktur, sondern arbeiten auf dem verbindlichen Datenmodell.

### `Aktionsstufe S0–S3`

**Benutzer-Label in der App:** im Normalfall kein sichtbares Kürzel

Klassifikation der Wirkung einer Fachaktion:

- **S0 – Lesen/Analysieren:** keine fachliche Änderung,
- **S1 – Vorschlag/Entwurf:** noch nicht fachlich oder öffentlich wirksam,
- **S2 – fachlich wirksame Änderung:** bestätigte interne FIB-Daten ändern sich,
- **S3 – Freigabe/Veröffentlichung/normative Aktivierung:** öffentliche oder systemweit normative Wirkung.

Die Aktionsstufe ist keine Benutzerrolle. Rechte ergeben sich aus Rolle, Aktion, Objektzustand und Freigabestufe.

## 6. Rollen

### `Besucher`

**Benutzer-Label in der App:** Besucher

Öffentliche Nutzerrolle ohne redaktionelle Schreib-, Freigabe- oder Administrationsrechte. Besucher können die für die Öffentlichkeit freigegebenen FIB-Inhalte und angebotenen öffentlichen Funktionen nutzen.

### `Redakteur`

**Benutzer-Label in der App:** Redakteur

Redaktionelle Rolle für Recherche, Prüfung, Bearbeitung, fachlich wirksame Änderungen und Veröffentlichung im Rahmen der dafür vorgesehenen FIB-Workflows.

Ein Redakteur darf Meldungen freigeben und veröffentlichen. Eine zusätzliche Rolle „Publisher“ bzw. „Veröffentlicher“ ist nicht vorgesehen.

Administrations- und systemweite Konfigurationsrechte sind davon getrennt und dem Admin vorbehalten.

### `Admin`

**Benutzer-Label in der App:** Admin

Die fachlich und technisch verantwortliche Administrationsrolle im FIB-System.

Der Admin besitzt zusätzlich zu den Redaktionsrechten administrative Rechte, insbesondere für Benutzer-/Rollenverwaltung, systemweite Konfigurationen und solche fachlichen Grundlagen, deren Änderung ausdrücklich einer Admin-Freigabe unterliegt.

Die detaillierte Rechteausgestaltung wird in der Sicherheits- und Berechtigungsmatrix festgelegt.

## 7. Akteur und Position

### `Akteur`

**Benutzer-Label in der App:** Akteur

Eine Organisation, Institution, Gruppe oder gegebenenfalls Person, die für einen Sachverhalt relevant ist, z. B. Gemeinde, Landkreis, Autobahn GmbH, Bürgerinitiative, Verein oder Partei.

Akteure können insbesondere zuständig, beteiligt, betroffen, Quelle einer Aussage oder Träger einer dokumentierten Position sein.

Ein breites eigenständiges Akteurs-Stammdatenmodell ist für den MVP nicht vorgesehen. Stabile, wiederkehrend relevante Akteure können bei konkretem FIB-Zusatznutzen als Referenzobjekte geführt werden.

### `Dokumentierte Position`

**Benutzer-Label in der App:** Dokumentierte Position

Eine einem Akteur belegbar zuordenbare Aussage, Forderung, Bewertung oder Zielsetzung.

Beispiel: Ein beschlossener Antrag des Ortsverbands oder eine öffentlich dokumentierte Stellungnahme kann eine dokumentierte Position sein; eine erst im Redaktionsprozess entwickelte Gestaltungsoption dagegen nicht automatisch.

Positionen anderer Akteure gehören zur Sachinformation und werden als solche zugeschrieben. Sie werden nicht mit der strukturierten grünen Bewertung in „Unsere Einordnung“ vermischt.

## 8. Recherche und KI-Betrieb

### `Quelle`

**Benutzer-Label in der App:** Quelle

Die Herkunft bzw. der Träger einer Information, zum Beispiel Gemeinde Feldkirchen, Autobahn GmbH, ein Pressemedium, eine Bürgerinitiative oder GRÜNE Feldkirchen.

Nicht zu verwechseln mit Fundstelle. Eine Quelle kann mehrere konkrete Fundstellen bereitstellen.

### `Fundstelle`

**Benutzer-Label in der App:** Fundstelle

Die konkrete Seite, das Dokument, die Datei oder sonstige Einheit, in der eine relevante Information enthalten ist.

Eine Fundstelle kann über eine externe URL erreichbar oder als Datei direkt in FIB gespeichert sein.

### `Bereitstellung`

**Benutzer-Label in der App:** Bereitstellung

Die Art, wie eine Fundstelle technisch verfügbar ist, zum Beispiel als externe URL oder als in FIB gespeicherte Datei.

Die Bereitstellung sagt noch nichts darüber aus, ob Besucher die Fundstelle sehen dürfen.

### `Sichtbarkeit`

**Benutzer-Label in der App:** Sichtbarkeit

Festlegung, ob eine in FIB gespeicherte Fundstelle öffentlich über FIB zugänglich oder nur für die Redaktion sichtbar ist.

Eine Datei darf öffentlich über FIB bereitgestellt werden, wenn ihre öffentliche Nutzung positiv als zulässig geklärt und redaktionell freigegeben ist. Ungeklärte Rechte reichen für eine öffentliche Bereitstellung nicht aus.

### `Beobachtungsauftrag`

**Benutzer-Label in der App:** Beobachtungsauftrag

Ein konkreter fachlicher Informationsbedarf, den FIB über einen Zeitraum beobachten oder klären soll. Jeder Beobachtungsauftrag besitzt genau einen Primärbezug auf einen Vorgang, ein Thema oder eine offene Frage/Wissenslücke.

Er beschreibt **was** beobachtet werden soll, nicht eine fest verdrahtete Suchstrategie. Status: aktiv, pausiert oder beendet.

### `Recherchelauf`

**Benutzer-Label in der App:** Recherchelauf

Eine konkrete, nachvollziehbare Ausführung von Recherche zu einem bestimmten Zeitpunkt oder Anlass. Ein Recherchelauf kann durch einen Beobachtungsauftrag, offene Recherche, einen manuellen Auftrag oder einen anlassbezogenen Rückblick ausgelöst werden.

Er dokumentiert die fachliche Herkunft neu erkannter oder geänderter Fundstellen. Ein Recherchelauf ist nicht dasselbe wie ein AI Task Run.

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

### `AI Task`

**Benutzer-Label in der App:** AI Task / KI-Aufgabe

Persistente operative Definition einer automatisierten KI-Arbeit: Zweck, Auslöser oder Zeitplan, erlaubte Fachfunktionen, Leistungs-/Routinganforderungen, Kostenrahmen und Status.

Ein AI Task ist nicht der fachliche Informationsbedarf selbst. Ein Beobachtungsauftrag kann Anlass für einen AI Task sein, bleibt aber ein getrenntes Objekt.

### `AI Task Run`

**Benutzer-Label in der App:** Ausführung / Lauf

Eine konkrete operative Ausführung eines AI Tasks mit Zeitpunkt, Ergebnis, verwendeter Routing-/Modellentscheidung, Kosten- und Fehlerinformationen soweit erforderlich.

Ein AI Task Run kann einen fachlichen Recherchelauf auslösen, ist mit diesem aber nicht identisch.

### `KI-Leistungsklasse`

**Benutzer-Label in der App:** KI-Leistungsklasse

Modellunabhängige Einordnung der für eine FIB-Aufgabe erforderlichen KI-Leistungsstufe. Die Leistungsklasse legt keinen bestimmten Anbieter oder Modellnamen fest.

### `Routing-Matrix`

**Benutzer-Label in der App:** KI-Routing

Konfigurierbare Zuordnung von FIB-Aufgaben zu KI-Bedarf, Qualitätsanforderung bzw. KI-Leistungsklasse, freigegebenem Provider/Modell, Fallback- und gegebenenfalls Kostenregeln. Die Routing-Matrix ermöglicht Modellwechsel, ohne Redaktionsworkflow oder fachliche Regeln umzubauen.

## 9. Offene Frage und öffentliche Vertiefung

### `Offene Frage / Wissenslücke`

**Benutzer-Label in der App:** Offene Frage

Ein noch nicht geklärter, noch nicht entschiedener, noch nicht belastbar belegter oder noch nicht bekannter Aspekt eines FIB-Sachverhalts. Die Frage besitzt einen fachlichen Erkenntnisstatus und getrennt davon einen Bearbeitungsstatus.

Sie beschreibt etwas, das FIB selbst noch nicht ausreichend weiß, und ist nicht mit einer öffentlich angebotenen Vertiefungsfrage gleichzusetzen.

### `Vertiefungsfrage`

**Benutzer-Label in der App:** Mehr wissen?

Eine redaktionell kontrollierte öffentliche Frage, die eine Meldung oder ein Thema um weiterführenden Kontext ergänzt und Besucher zum vertieften Verständnis führen soll.

Eine Vertiefungsfrage ist kein interner Rechercheauftrag und keine Wissenslücke von FIB.

### `Vertiefungsantwort`

**Benutzer-Label in der App:** Antwort

Die quellengebundene, redaktionell verantwortete Antwort auf eine Vertiefungsfrage. Öffentliche Tatsachenbehauptungen müssen auf nachvollziehbare Fundstellen zurückführbar sein; fachlich relevante frühere Fassungen bleiben nachvollziehbar.

## 10. Noch zu ergänzende Begriffe

Das Register wird weiter anlassbezogen gepflegt. Noch nicht zwingend als eigene Glossarbegriffe ausmodelliert sind insbesondere spezielle technische Begriffe der späteren physischen Datenbank-, Sicherheits- und Betriebsarchitektur. Diese werden erst aufgenommen, wenn ihre fachliche Bedeutung im Projekt festgelegt ist.