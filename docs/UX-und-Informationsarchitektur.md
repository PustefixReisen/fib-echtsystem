# UX und Informationsarchitektur – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.4 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für öffentliche Benutzerführung, Informationsarchitektur und grundlegende UX-Prinzipien des FIB-Echtsystems.

Für die fachliche Erkennung, Abgrenzung und Pflege von Themen und Vorgängen gilt ergänzend `docs/Themen-und-Vorgangslogik.md` als verbindliche fachliche Primärquelle.

Der Demonstrator dient als Referenz, ist aber kein unveränderlicher UI-Blueprint.

## 2. Leitidee

> **FIB soll nicht primär Dokumente oder Beiträge präsentieren, sondern den aktuellen Wissensstand zu einem Sachverhalt erschließen.**

Die fachlichen Ebenen haben unterschiedliche Aufgaben:

- **Beitrag / Meldung:** Was ist konkret neu passiert?
- **Vorgang:** Wie entwickelt sich ein konkreter länger laufender Sachverhalt und wo steht er aktuell?
- **Thema:** Welche übergeordnete Fragestellung verbindet mehrere Vorgänge, Perspektiven und Rahmenbedingungen?
- **Sitzung:** Was wird beraten oder entschieden?
- **Mehr wissen?:** Was steckt dahinter?

Intern bleiben Beitrag, Vorgang und Thema klar getrennte Objekttypen. Öffentlich wird diese interne Differenzierung nur so stark sichtbar gemacht, wie sie dem Verständnis dient.

## 3. Zentrale Nutzeraufgaben

FIB muss insbesondere folgende Nutzerfragen unterstützen:

1. Welche Meldungen gibt es in Feldkirchen?
2. Was beschäftigt Feldkirchen länger und wie ist der aktuelle Stand?
3. Wie hat sich ein konkreter Sachverhalt entwickelt?
4. Welche übergeordneten Zusammenhänge gibt es?
5. Was wird demnächst beraten oder entschieden?
6. Warum ist eine Meldung oder Entwicklung wichtig?
7. Ich möchte es genauer verstehen.
8. Ich möchte künftig nichts dazu verpassen.
9. Ich suche etwas Bestimmtes.

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

Meldungen, Themen, Vorgänge und Sitzungen benötigen stabile Identitäten, eigenständige URLs und verständlichen Kontext auch bei direktem Einstieg.

## 5. Öffentliche Grundstruktur und Hauptnavigation

Die vorläufig verbindliche öffentliche Hauptnavigation lautet:

- **Meldungen**
- **Themen**
- **Sitzungen**
- **Suchen**

Der Begriff **„Aktuell“** ist kein eigener Hauptbereich. Er beschreibt ausschließlich eine zeitliche Auswahl bzw. Hervorhebung, insbesondere auf der Startseite.

### 5.1 Meldungen

Der Navigationspunkt **Meldungen** führt zur vollständigen Liste der veröffentlichten Beiträge/Meldungen. Die Liste enthält also nicht nur aktuelle Meldungen.

„Aktuell“ wird innerhalb der Startseite oder anderer Ansichten verwendet, wenn tatsächlich nur neue bzw. fachlich relevant aktualisierte Inhalte gemeint sind.

### 5.2 Themen

Der öffentliche Bereich **Themen** führt eine gemeinsame Liste aus:

- übergeordneten **Themen** und
- konkreten länger laufenden **Vorgängen**.

Die fachliche Unterscheidung bleibt intern verbindlich, wird öffentlich aber nicht überbetont. Besucher sollen nicht zuerst die Datenmodell-Terminologie verstehen müssen.

Ein dezenter Hinweis wie „Übergeordnetes Thema“ oder „Konkreter Vorgang“ kann angezeigt werden, wenn er dem Verständnis hilft. Er ist jedoch kein dominantes Gestaltungselement.

Vorgänge dürfen auch dann in dieser gemeinsamen Liste erscheinen, wenn sie noch keinem übergeordneten Thema zugeordnet sind.

### 5.3 Sitzungen

Die Sitzungsebene zeigt transparent:

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
- Vorgang,
- Ort,
- Kategorie,
- Bezugsobjekt.

Die technische Umsetzung wird später festgelegt.

## 6. Startseite

Die Startseite dient primär der Orientierung und Auswahl. Sie besteht aus drei festen inhaltlichen Blöcken:

1. **Aktuelle Meldungen**
   - neue Beiträge,
   - fachlich relevant aktualisierte Beiträge.
2. **Anstehende Sitzungen**
   - die nächsten tatsächlich bevorstehenden Sitzungen,
   - unabhängig davon, ob sich an ihren Datensätzen zuletzt etwas geändert hat.
3. **Aktuelle bzw. geänderte Themen und Vorgänge**
   - Themen, deren Wissensrahmen sich fachlich verändert hat,
   - Vorgänge, deren Sachstand sich fachlich verändert hat.

Der Besuchskontext „seit dem letzten Besuch“ wird nicht als eigener vierter Block geführt, sondern innerhalb dieser Blöcke angezeigt.

Als übergreifendes UX-Modell gilt:

> **Startseite = Orientierung und Auswahl**  
> **Listenansicht = Überblick und Vergleich**  
> **Detailseite = Verständnis und Vertiefung**

## 7. Meldung als Einstiegsknoten

Ein Beitrag soll nicht nur Nachrichtentext sein, sondern als Einstieg in den gesamten Sachzusammenhang funktionieren.

Als Grundhierarchie gilt:

1. Überschrift,
2. Kurzfassung,
3. Was ist neu?, soweit erforderlich,
4. Sachinformation,
5. Quellen,
6. Unsere Einordnung,
7. Mehr wissen?,
8. Zusammenhang / zugehörige Vorgänge, Themen, Sitzungen und Bezüge.

## 8. Aktualisierungen von Meldungen

Bei aktualisierten Beiträgen soll der neue Informationswert unmittelbar erkennbar sein.

> **Neu seit 17. September:** Die veröffentlichte Beschlussvorlage enthält jetzt konkrete Angaben zu Schallschutzkosten und einer Park-Alternative.

Nutzer sollen nicht selbst alte und neue Textfassungen vergleichen müssen.

### 8.1 Technische Änderung, redaktionelle Aktualisierung, fachliche Neuigkeit

FIB unterscheidet drei Ebenen:

- **technische Änderung** – z. B. Tippfehler, Linkkorrektur oder interne Metadatenänderung; erzeugt keine öffentliche Neuigkeit,
- **redaktionelle Aktualisierung** – z. B. Präzisierung oder zusätzliche Quelle ohne neuen Sachstand; wird historisiert, aber normalerweise nicht als „neu“ hervorgehoben,
- **fachliche Aktualisierung** – z. B. neue Vorlage, neuer Beschluss, neue Kostenangabe oder geänderter Planungsstand; kann öffentlich als neue Entwicklung erscheinen.

Für „Neu seit letztem Besuch“, Sortierung und Push ist daher nicht das technische Änderungsdatum maßgeblich, sondern die fachlich relevante Aktualisierung.

### 8.2 Aktualisierung oder neuer Beitrag

Verbindliche Grundregel:

> **Ein Beitrag steht für ein eigenständiges berichtenswertes Ereignis. Neue Informationen zum selben Ereignis aktualisieren den bestehenden Beitrag. Ein neues eigenständiges Ereignis mit ausreichendem Nachrichtenwert erzeugt einen neuen Beitrag.**

Die Entscheidung erfolgt zweistufig:

1. Ist es ein neues Ereignis?
2. Hat dieses Ereignis eigenen Nachrichtenwert für FIB?

Mehrere Beiträge zu demselben konkreten länger laufenden Sachverhalt werden über einen Vorgang miteinander verbunden.

## 9. Gemeinsame Themen-/Vorgangsliste

Die öffentliche Themenliste zeigt Themen und Vorgänge gemeinsam. Sie soll Orientierung darüber geben, **was Feldkirchen länger beschäftigt**, ohne die interne Objektlogik in den Vordergrund zu stellen.

### 9.1 Gemeinsame Grunddarstellung

Jeder Listeneintrag enthält grundsätzlich:

- Titel,
- sehr kurze Beschreibung,
- Datum der letzten fachlich relevanten Änderung,
- gegebenenfalls einen knappen Hinweis auf einen übergeordneten Zusammenhang.

Wenn ein Vorgang einem Thema zugeordnet ist, kann angezeigt werden:

> **Gehört zu:** Regionale Mobilität und Verkehrsverflechtungen Feldkirchens

Eine harte Trennung in zwei Listenblöcke „Themen“ und „Vorgänge“ erfolgt nicht.

Ein Filter „Themen | Vorgänge“ ist technisch möglich, wird im MVP aber nicht als notwendiger Standard vorausgesetzt.

### 9.2 Sortierung

Standardmäßig orientiert sich die Liste an der letzten **fachlich relevanten Änderung**. Technische Änderungen beeinflussen die Reihenfolge nicht.

Abgeschlossene oder länger unveränderte Vorgänge können weiter unten erscheinen, ohne dass Themen selbst einen Status „aktiv / ruhend / abgeschlossen“ erhalten.

### 9.3 Hierarchie und Navigation

Die gemeinsame Liste darf Hierarchien sichtbar machen, ohne sie starr darzustellen:

- Vorgang → zugehöriges Thema bzw. zugehörige Themen,
- Thema → wichtige zugehörige Vorgänge.

Ein Vorgang kann mehreren Themen zugeordnet sein. Ein Thema umfasst in der Regel mehrere Vorgänge.

## 10. Themendetailseite

Die Themenseite dient dem **Verständnis eines übergeordneten Zusammenhangs** und ist keine bloße Chronologie.

Sie beantwortet insbesondere:

- Was ist die Leitfrage?
- Warum ist sie für Feldkirchen relevant?
- Welche Perspektiven gehören zum Thema?
- Welche Vorgänge prägen den lokalen Stand und welche Rolle spielen sie?
- Was wissen wir derzeit?
- Was ist noch offen?
- Welcher externe Kontext hilft beim Verständnis?

### 10.1 Grundstruktur

1. **Kopfbereich**
   - Thementitel,
   - Leitfrage,
   - kurzer Feldkirchen-Bezug,
   - fachlicher Stand / zuletzt aktualisiert.
2. **Warum ist das für Feldkirchen relevant?**
   - kurzer erklärender Abschnitt ohne Chronologie.
3. **Was prägt das Thema derzeit?**
   - wichtige Vorgänge mit kurzer Beschreibung,
   - fachlicher Rolle bzw. Gewichtung,
   - aktuellem Vorgangsstand,
   - letzter relevanter Entwicklung,
   - Link zum Vorgang.
4. **Perspektiven des Themas**
   - themenspezifische, nicht global fest vorgegebene Perspektiven.
5. **Was wissen wir derzeit?**
   - kompakte Synthese des aktuellen Wissensstands.
6. **Was ist noch offen?**
   - belegte Wissenslücken und offene Fragen.
7. **Hintergrund und Kontext**
   - nur erklärungsrelevanter rechtlicher, technischer, regionaler, gesellschaftlicher oder fachlicher Kontext.
8. **Mehr wissen?**
   - vertiefende Fragen aus Perspektiven, Wissenslücken, Begriffen, möglichen Folgen und Handlungsmöglichkeiten.
9. **Unsere Einordnung**
   - klar von der Sachinformation getrennt.
10. **Neueste Entwicklungen**
   - kompakte Liste jüngster zugehöriger Meldungen.

### 10.2 Gewichtung von Vorgängen im Thema

Nicht alle Beziehungen eines Vorgangs zu einem Thema haben dieselbe Bedeutung. Die in `docs/Themen-und-Vorgangslogik.md` definierte Wirkungsrolle beeinflusst Reihenfolge und Hervorhebung.

Ein prägender Treiber darf nicht gleichrangig mit einer bloßen Betroffenheit oder einem einzelnen Indikator erscheinen.

Die fachlichen Rollen können intern verwendet werden, ohne dass ihre technischen Bezeichnungen zwingend als öffentliche Labels erscheinen müssen. Öffentlich entscheidend ist eine verständliche Gewichtung und Gruppierung.

### 10.3 Chronologie zum Thema

Die Themenseite selbst bleibt primär erklärend. Zusätzlich wird ein Zugang **„Alle Entwicklungen zum Thema“** vorgesehen.

Diese chronologische Sicht wird aus den zugehörigen Vorgängen und Meldungen erzeugt und ermöglicht die Rückverfolgung aller relevanten Ereignisse, ohne die Themenseite selbst in eine Chronologie zu verwandeln.

Einzelne themenrelevante Meldungen dürfen direkt einem Thema zugeordnet sein, auch wenn daraus noch kein eigener Vorgang entstanden ist.

## 11. Vorgangsdetailseite

Die Vorgangsseite dient dem **Nachvollziehen eines konkreten Sachverhalts und seiner Entwicklung**.

Ein Vorgang ist ein eigenständiges redaktionelles Objekt. Er ist mehr als eine bloße Beitragsliste, weil er einen eigenen aktuellen Sachstand besitzt.

### 11.1 Grundstruktur

1. **Titel + Kurzbeschreibung**
   - Worum geht es konkret?
2. **Aktueller Stand**
   - Wo steht der Vorgang heute?
3. **Letzte relevante Entwicklung**
   - Was hat sich zuletzt fachlich geändert?
4. **Bisheriger Verlauf**
   - chronologische Folge der zugehörigen Beiträge/Ereignisse.
5. **Wichtige Entscheidungen**
   - Beschlüsse, Variantenentscheidungen, Freigaben, Ablehnungen oder andere wesentliche Entscheidungspunkte.
6. **Offene Punkte / nächste belegte Schritte**
   - nur aus belastbaren Quellen abgeleitete Angaben.
7. **Zuständigkeiten und Beteiligte**
   - relevante Behörden, Träger, Betreiber, Initiativen oder andere Akteure.
8. **Zugehörige Themen**
   - Verbindung zu einem oder mehreren Themen; fachliche Wirkungsrolle intern strukturiert.
9. **Mehr wissen?**
   - Hintergrundfragen zum konkreten Vorgang.
10. **Unsere Einordnung**
   - klar getrennt von der Sachinformation.

### 11.2 Verlauf aus Meldungen

Der Abschnitt **„Bisheriger Verlauf“** wird aus den verknüpften Meldungen/Ereignissen erzeugt und nicht als zweite, manuell gepflegte Chronologie geführt.

Der Vorgang enthält zusätzlich den jeweils aktuellen Sachstand. Damit gilt:

> **Meldungen dokumentieren Ereignisse; der Vorgang verdichtet daraus den aktuellen Stand und Verlauf eines konkreten Sachverhalts.**

### 11.3 Status

Eine Statuslogik wie **aktiv / ruhend / abgeschlossen** gehört zum Vorgang, nicht zum Thema.

Statusänderungen und insbesondere der Abschluss eines Vorgangs werden redaktionell bestätigt.

## 12. Meldungsliste

Die Meldungsliste dient Auswahl und Einordnung, nicht der vollständigen Erklärung.

Pro Eintrag werden grundsätzlich gezeigt:

- Überschrift,
- sehr kurze Zusammenfassung,
- fachliches Ursprungs-/Ereignisdatum,
- bei fachlich relevanter späterer Änderung zusätzlich das Aktualisierungsdatum,
- zugehöriger Vorgang oder Sachkontext, sofern vorhanden,
- zugehöriges Thema, sofern dies dem Verständnis hilft.

Die interne Relevanzbewertung wird nicht als öffentlicher Wert oder Label angezeigt.

### 12.1 Datumsdarstellung und Sortierung

Ursprungs-/Ereignisdatum und Aktualisierungsdatum sind fachlich unterschiedliche Informationen und werden getrennt gespeichert.

Verbindliche Darstellungsregel bei aktualisierten Beiträgen:

> **17.09.2026 · aktualisiert 29.09.2026**

Für die Standard-Sortierung der Meldungsliste ist das Datum der **letzten fachlich relevanten Neuigkeit** maßgeblich. Technische oder rein redaktionelle Änderungen verändern diese Sortierung nicht.

## 13. Explizit zu bestätigende Felder

Bestimmte fachlich besonders wirksame Angaben müssen von der Redaktion ausdrücklich bestätigt werden, auch wenn sie den KI-Vorschlag unverändert übernimmt.

Als Ausgangspunkt gelten insbesondere:

- Vorgangsstatus,
- aktueller Stand eines Vorgangs,
- offene Punkte,
- nächste Schritte,
- wichtige Entscheidungen,
- Zuordnung Beitrag ↔ Vorgang,
- Zuordnung Vorgang ↔ Thema,
- Wirkungsrolle eines Vorgangs innerhalb eines Themas,
- Themendefinition bzw. wesentliche Änderung der Themendefinition,
- Entscheidung „neues Ereignis oder Aktualisierung“,
- fachliche Aktualisierungsrelevanz,
- „Unsere Einordnung“,
- Abschluss eines Vorgangs.

Welche Felder eine explizite Bestätigung erfordern, soll als **schlanke Admin-Stammdatenpflege** geführt werden. Im MVP ist dafür ausschließlich die Eigenschaft **„explizite Bestätigung erforderlich: ja/nein“** konfigurierbar.

Nicht Bestandteil des MVP ist eine frei konfigurierbare Prüfregel-Engine mit komplexen Bedingungen, Abhängigkeiten oder feldspezifischen Workflows.

## 14. Sitzungsliste

Die Sitzungsliste bleibt bewusst knapp und dient vor allem der zeitlichen Orientierung.

Pro Eintrag werden grundsätzlich angezeigt:

- Sitzungstitel bzw. Gremium,
- Datum und Uhrzeit,
- **TOPs:** wenige für FIB relevante Tagesordnungspunkte; die verkürzte Auswahl endet mit „…“.

Ort und Verfahrensstatus werden in der Listenansicht nicht angezeigt.

Bevorstehende Sitzungen werden strikt nach Sitzungstermin sortiert.

Eine Sitzung gilt in FIB als abgeschlossen, sobald die Genehmigung ihrer Niederschrift öffentlich belegt ist.

Dabei werden getrennt geführt:

- **Niederschrift genehmigt**,
- **Niederschrift öffentlich einsehbar**.

Ist die Niederschrift genehmigt, aber öffentlich nicht auffindbar, wird dies wertungsfrei angezeigt, z. B. **„Niederschrift genehmigt · öffentlich nicht auffindbar“**.

## 15. Sitzungsdetailseite

Die Sitzungsdetailseite ist TOP-zentriert aufgebaut.

### 15.1 Titelblock

Der Titelblock enthält:

- Gremium,
- Datum und Uhrzeit,
- Ort,
- bei vergangenen Sitzungen den Status der Niederschrift.

### 15.2 TOPs

Auf der Detailseite werden alle öffentlichen TOPs aus dem RIS aufgeführt.

Zu jedem TOP können unmittelbar angezeigt bzw. verknüpft werden:

- TOP-Nummer und Bezeichnung,
- Beschlussvorlage und weitere amtliche Unterlagen,
- verknüpfte FIB-Themen oder Vorgänge,
- verknüpfte FIB-Meldungen,
- Presseberichte zum TOP,
- nach Vorliegen einer lesbaren Niederschrift der vollständige Beschlusstext,
- Abstimmungsergebnis, sofern in der Niederschrift angegeben.

Amtliche Unterlagen und journalistische Berichterstattung werden klar getrennt dargestellt.

## 16. Meldungsdetailseite

Die Meldungsdetailseite unterscheidet zwischen Erstbeitrag, Folgebeitrag und aktualisiertem bestehenden Beitrag.

### 16.1 Erstbeitrag

Grundstruktur:

1. Titel,
2. Datum,
3. Kurzfassung,
4. kurzer Grundkontext „Worum geht es?“,
5. Sachinformation,
6. Quellen,
7. Unsere Einordnung,
8. Mehr wissen?,
9. Zusammenhang zu Vorgang, Thema, Sitzung und weiteren relevanten Inhalten.

### 16.2 Folgebeitrag

Grundstruktur:

1. Titel,
2. Datum,
3. Kurzfassung,
4. **Was ist neu?** – 1 bis 3 Sätze,
5. **Bisheriger Stand** – nur so viel Kontext wie zum Verständnis nötig,
6. Sachinformation,
7. Quellen,
8. Unsere Einordnung,
9. Mehr wissen?,
10. Zusammenhang.

### 16.3 Aktualisierter bestehender Beitrag

Bei einer fachlich relevanten Aktualisierung wird unmittelbar unter Kurzfassung und Datumszeile der neue Informationswert hervorgehoben.

Danach wird der Beitrag in seinem aktuellen Gesamtstand dargestellt.

### 16.4 Mehrere Aktualisierungen

Bei mehrfach fortgeschriebenen Beiträgen wird nur die neueste wesentliche Aktualisierung prominent angezeigt.

Frühere fachliche Aktualisierungen bleiben über **„Frühere Aktualisierungen anzeigen“** nachvollziehbar.

Verbindlicher Grundsatz:

> **Der aktuelle Beitrag zeigt den heutigen Wissensstand; die Aktualisierungshistorie erklärt, wie sich dieser Wissensstand verändert hat.**

## 17. Push und direkte Einstiege

Push dient als gezielter Einstieg in eine konkrete neue Entwicklung.

Grundregeln:

- Push enthält Sachverhalt bzw. Thema und neue Entwicklung knapp,
- ein Tipp öffnet direkt die betroffene Meldung bzw. Aktualisierung,
- der Zielinhalt zeigt sofort „Was ist neu?“,
- bei Folgebeiträgen folgt ein kurzer Kontextblock,
- von dort führt ein klarer Weg zum zugehörigen Vorgang und gegebenenfalls zum übergeordneten Thema.

Nicht jede fachliche Aktualisierung erzeugt automatisch einen Push.

## 18. UX-Grundsätze

- mobile Nutzung ist ein Primärfall,
- direkte Einstiege müssen ohne vorherige Navigation verständlich sein,
- aktueller Stand ist wichtiger als reine Chronologie,
- neue Information muss bei Aktualisierungen sofort erkennbar sein,
- Zusammenhänge sollen sichtbar, aber nicht überladen dargestellt werden,
- interne Datenmodell-Begriffe werden öffentlich nur verwendet, wenn sie dem Verständnis helfen,
- „Mehr wissen?“ vertieft optional und darf den Grundinhalt nicht unnötig verlängern,
- Sachinformation und politische Einordnung bleiben visuell klar getrennt,
- Navigation soll wenige, verständliche Hauptzugänge verwenden,
- die UI soll neugierig machen, ohne Informationen künstlich zu verstecken,
- Barrierearmut und verständliche Sprache werden bei der Detailkonzeption berücksichtigt.

## 19. Datenmodell-Auswirkungen für G3

Aus den bisherigen UX-Entscheidungen ergeben sich mindestens Anforderungen an:

- stabile IDs und URLs für Meldungen, Vorgänge, Themen und Sitzungen,
- eigenständige Entitäten für Beitrag/Meldung, Vorgang und Thema,
- Beziehung Ereignis → Beitrag,
- Beziehung Beitrag → Vorgang,
- n:m-Beziehung Vorgang ↔ Thema,
- optionale direkte Beziehung Beitrag ↔ Thema für einzelne themenrelevante Ereignisse ohne eigenen Vorgang,
- fachliche Wirkungsrolle und Gewichtung einer Vorgang-/Themenbeziehung,
- strukturierten aktuellen Stand eines Vorgangs,
- Vorgangsstatus einschließlich Historisierung,
- versionierte Themendefinitionen,
- strukturierte Perspektiven/Kontextdimensionen eines Themas,
- Wissenslücken und offene Fragen,
- strukturierte Aktualisierungsereignisse,
- Unterscheidung zwischen technischer Änderung, redaktioneller Aktualisierung und fachlicher Neuigkeit,
- Kennzeichnung, ob eine Änderung für „Neu seit letztem Besuch“ bzw. Push relevant ist,
- relevante Entscheidungen,
- explizite Beziehungen zwischen Inhalten,
- redaktionelle Pflichtbestätigungen,
- Lesestatus bzw. gerätebezogene Information für „Neu seit letztem Besuch“,
- Such- und Filtermetadaten.

Die konkrete Modellierung erfolgt in G3.

## 20. Noch offene G2-Punkte

Die Kernlogik für Navigation, Meldungen, gemeinsame Themen-/Vorgangsliste sowie Meldungs-, Themen-, Vorgangs- und Sitzungsdetailseiten ist fachlich festgelegt.

Vor Abschluss von G2 sind noch zu konkretisieren bzw. zu prüfen:

1. **Suche und Filter** – Umfang, Filterlogik und mobile Bedienung.
2. **Mehr wissen?** – Einbindung auf den verschiedenen Detailseiten, Fragenlogik und Übergang zu Quellen/Antworten.
3. **PWA-spezifische UX** – Installation, „Neu seit letztem Besuch“, Push-Einstellungen und mögliche Badge-Anzeige.
4. **Teilen / Drucken / Social Preview** – konsistente Bedienelemente und Direktlink-Verhalten.
5. **Transparenz / Über FIB / Disclaimer** – endgültige Platzierung und Interaktion im Echtsystem.
6. **Barrierearmut und responsive Detailkonzeption** – konkrete Anforderungen für mobile und Desktop-Darstellung.
7. **G2-Abschlussprüfung** – Widerspruchsfreiheit der Nutzerwege und vollständige Übergabe der Datenmodell-Anforderungen an G3.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 2.4 | 30.09.2026 | G2 konsolidiert: Hauptnavigation auf Meldungen/Themen/Sitzungen/Suchen geändert; Themen und Vorgänge in gemeinsamer öffentlicher Themenliste zusammengeführt; Vorgang als eigenständiges redaktionelles Objekt definiert; Themen- und Vorgangsdetailseite festgelegt; Themenstatuslogik bereinigt und auf Vorgänge verlagert; Datenmodell-Auswirkungen und offene G2-Punkte aktualisiert. |
| 2.3 | 29.09.2026 | Iterative Themendefinition ergänzt; redaktionelle Schärfung dient zugleich zur Kalibrierung der KI-Themenerkennung. |
| 2.2 | 29.09.2026 | Themen-Erkennung als indikatorenbasierte, bewusst sensitive Vorschlagslogik präzisiert; Erklärungsgewinn, gemeinsame Probleme/Ziele und weitere Zusammenhangssignale ergänzt. |
| 2.1 | 29.09.2026 | Themenbegriff korrigiert: Themen entstehen bottom-up aus Zusammenhängen mehrerer Ereignisse/Beiträge/Vorgänge; neue Themenlogik mit Erkennen, Abgrenzen, Kontextbestimmung und redaktioneller Bestätigung als vorgelagerter G2-Schritt festgelegt. |
| 2.0 | 29.09.2026 | Meldungsdetailseite mit Erst-/Folgebeitrag, Hervorhebung fachlicher Aktualisierungen und kompakter Aktualisierungshistorie festgelegt. |
| 1.9 | 29.09.2026 | Sitzungsdetailseite festgelegt: alle öffentlichen RIS-TOPs, Niederschriftsstatus im Titelbereich, TOP-nahe Verknüpfungen sowie getrennte Presseberichterstattung. |
| 1.8 | 29.09.2026 | Niederschriftenlogik präzisiert: Genehmigung und öffentliche Verfügbarkeit getrennt; wertungsfreier Transparenzhinweis; vollständige Beschlüsse TOP-bezogen nur in der Detailansicht. |
| 1.7 | 29.09.2026 | Bezeichnung in der Sitzungsliste auf „TOPs“ festgelegt. |
| 1.6 | 29.09.2026 | Sitzungsliste bewusst reduziert; Ort und Verfahrensstatus aus der Listenansicht entfernt. |
| 1.5 | 29.09.2026 | Frühere Themenlisten- und Statuslogik eingeführt; durch Version 2.4 hinsichtlich Thema/Vorgang grundlegend konsolidiert. |
| 1.4 | 29.09.2026 | Meldungsliste konkretisiert; Datumslogik mit getrenntem Ursprungs- und Aktualisierungsdatum festgelegt. |
| 1.3 | 29.09.2026 | Startseitenlogik mit drei festen Inhaltsblöcken sowie Zusammenspiel von Start-, Listen- und Detailansicht festgelegt. |
| 1.2 | 29.09.2026 | Nutzerwege 2–4 ergänzt. |
| 1.1 | 29.09.2026 | Aktualisierungslogik und Ereignisregel ergänzt. |
| 1.0 | 29.09.2026 | Initiale UX- und Informationsarchitektur angelegt. |
