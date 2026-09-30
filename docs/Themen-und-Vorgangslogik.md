# Themen- und Vorgangslogik – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche fachliche Primärquelle für die Erkennung, Abgrenzung, redaktionelle Entwicklung und laufende Pflege von **Themen** und **Vorgängen** im FIB-Echtsystem.

Es konkretisiert die in `docs/UX-und-Informationsarchitektur.md` begonnene Themenlogik. Die dort noch enthaltenen älteren, als vorläufig gekennzeichneten Annahmen, die Thema und länger laufenden Vorgang gleichsetzen, sind durch dieses Dokument überholt und werden bei der nächsten Konsolidierung der UX-Dokumentation bereinigt.

## 2. Begriffe

### 2.1 Ereignis / Beitrag

Ein Beitrag steht für ein eigenständiges berichtenswertes Ereignis. Neue Informationen zum selben Ereignis aktualisieren den Beitrag; ein neues eigenständiges Ereignis mit ausreichendem Nachrichtenwert erzeugt in der Regel einen neuen Beitrag.

### 2.2 Vorgang / Sachverhalt

Ein Vorgang bündelt mehrere Ereignisse, die zu demselben konkreten Sachverhalt gehören.

Beispiele:

- Hundewiese,
- Parkraumkonzept,
- Kinderhaus St. Jakob,
- Entwicklung des Gebietes „Kiesgrund“.

Ein Vorgang kann beginnen, fortgeschrieben, zurückgestellt, wieder aufgenommen und abgeschlossen werden. Eine Statuslogik wie **aktiv / ruhend / abgeschlossen** gehört deshalb grundsätzlich zum Vorgang und nicht zum übergeordneten Thema.

### 2.3 Thema

Ein Thema ist eine übergeordnete Fragestellung, die mehrere unterschiedliche Vorgänge, Ereignisse, Perspektiven oder Rahmenbedingungen zusammenführt und dadurch einen zusätzlichen Erklärungsgewinn erzeugt.

Ein Thema ist keine feste Kategorie und keine bloße Sammlung ähnlich benannter Beiträge.

Beispiele können sein:

- Wohnen und kommunale Entwicklung,
- kommunale Wärmeversorgung / Wärmeplanung und Geothermie,
- Klimaanpassung im Lebensumfeld,
- Ortsentwicklung.

Ein Vorgang kann mehreren Themen zugeordnet sein. Umgekehrt umfasst ein Thema in der Regel mehrere Vorgänge.

## 3. Themen entstehen bottom-up

Themen werden nicht von oben vorgegeben. Die KI untersucht den Bestand aus Ereignissen, Beiträgen und Vorgängen auf mögliche übergeordnete Zusammenhänge.

Mögliche Indikatoren sind insbesondere:

- dauerhafte oder wiederkehrende kommunale Fragestellung,
- mehrere voneinander unabhängige Vorgänge,
- gemeinsames Problem oder gemeinsames Ziel,
- wiederkehrender Zielkonflikt,
- gemeinsame kommunale Handlungsebene,
- gemeinsame externe Rahmenbedingungen,
- wiederkehrende Akteure oder Zuständigkeiten,
- räumlicher Zusammenhang,
- zeitliche Wiederkehr,
- mehrere relevante Perspektiven oder Dimensionen,
- externe Erkenntnisse oder Beispiele mit konkretem Erklärungswert für Feldkirchen,
- Erklärungsgewinn durch Zusammenführung,
- Fortbestehen der Fragestellung auch nach Abschluss einzelner Vorgänge.

Diese Indikatoren sind Hinweise und keine harten Schwellenwerte. Für die automatische Kandidatenerkennung gilt bewusst eine hohe Sensitivität:

> **Lieber ein plausibler Themenvorschlag zu viel als ein relevantes Thema übersehen.**

## 4. Themenkandidat

Ein KI-generierter Themenkandidat soll mindestens enthalten:

- vorgeschlagenen Thementitel,
- erkannte gemeinsame Fragestellung,
- auslösende Vorgänge und Beiträge,
- erkannte Muster, Gemeinsamkeiten und Zielkonflikte,
- Begründung, warum der Zusammenhang über einen Einzelvorgang hinausgeht,
- möglichen Erklärungsgewinn,
- vorgeschlagene Kontextdimensionen,
- mögliche externe Beispiele oder Rahmenbedingungen,
- Unsicherheiten und Gegenargumente.

Ein Themenkandidat ist kein veröffentlichtes Thema.

## 5. Redaktionelle Bearbeitung und fehlende Aspekte

Die Redaktion kann einen Themenkandidaten nicht nur bestätigen oder verwerfen, sondern insbesondere:

- Aspekte ergänzen,
- Aspekte streichen,
- Aspekte unterschiedlich gewichten,
- die Leitfrage verändern,
- die Abgrenzung schärfen,
- unbekannte oder bislang nicht erfasste Vorgänge nennen,
- gezielte Rechercheaufträge auslösen.

Ein vom Redakteur ergänzter Aspekt wird nicht automatisch als Tatsache oder Bestandteil des veröffentlichten Themas übernommen. Er wird zunächst als **Prüf- und Rechercheauftrag** behandelt.

Die KI prüft dabei mindestens:

1. Gibt es einen konkreten Feldkirchen-Bezug?
2. Welche lokalen Quellen, Vorgänge oder Daten sind vorhanden?
3. Welcher übergeordnete Kontext ist tatsächlich erklärungsrelevant?
4. Trägt der Aspekt zur Leitfrage bei oder weitet er das Thema unnötig aus?
5. Welche Wissenslücken bleiben bestehen?

### 5.1 Rolle eines Vorgangs oder Ereignisses innerhalb eines Themas

Eine Zuordnung zu einem Thema beschreibt nicht nur **dass** ein Vorgang oder Ereignis relevant ist, sondern auch **welche fachliche Rolle** er für das Thema spielt.

Die KI soll deshalb bei der Zuordnung mindestens unterscheiden können zwischen:

- **Treiber / prägender Vorgang** – verändert die Entwicklung oder Rahmenbedingungen des Themas wesentlich; Beispiel: ein großes Infrastruktur- oder Entwicklungsprojekt, das Verkehrsströme, Flächennutzung oder Handlungsmöglichkeiten nachhaltig verändert.
- **Umsetzung / Gestaltungsbeitrag** – setzt eine im Thema erkennbare Zielrichtung oder Strategie konkret um; Beispiel: Aufbau oder Ausbau eines Radwegenetzes innerhalb einer Mobilitätsstrategie.
- **Betroffenheit / Auswirkung** – zeigt, wie Feldkirchen oder ein Teilbereich von einer extern oder anderweitig getriebenen Entwicklung betroffen ist, ohne selbst deren Haupttreiber zu sein.
- **Rahmenbedingung / Kontext** – erklärt rechtliche, technische, räumliche, finanzielle oder gesellschaftliche Bedingungen, die für das Thema relevant sind.
- **Indikator / Beobachtung** – liefert ein Signal über eine Entwicklung, ohne selbst deren Ursache oder wesentliche Umsetzung zu sein.

Diese Rollen sind keine starre abschließende Taxonomie. Ein Vorgang kann mehrere Rollen gleichzeitig haben; eine Rolle kann sich im Zeitverlauf ändern.

Für die Themenanalyse gilt:

> **Ähnliche Sachgebiete bedeuten nicht automatisch gleiche thematische Bedeutung. Entscheidend ist die Wirkungsrolle im Zusammenhang der Leitfrage.**

Beispiel Mobilität:

- der Ausbau des Autobahnkreuzes München-Ost kann als **Treiber / prägender Vorgang** erhebliche Auswirkungen auf Verkehrsströme, Flächen, Lärm, regionale Verkehrsführung und kommunale Handlungsspielräume haben;
- der Ausbau eines Radwegenetzes kann als **Umsetzung / Gestaltungsbeitrag** die lokalen und regionalen Mobilitätsmöglichkeiten verändern;
- eine einzelne Sperrung oder Umleitung kann vor allem **Betroffenheit / Auswirkung** eines übergeordneten Infrastrukturvorgangs zeigen.

Damit soll verhindert werden, dass auf einer Themenseite alle verknüpften Ereignisse und Vorgänge gleichrangig erscheinen. Die thematische Darstellung muss erkennen lassen, **was das Thema prägt, was eine Reaktion oder Umsetzung darstellt und wo lediglich Auswirkungen sichtbar werden**.

## 6. Iterative Themendefinition

Nach Auswahl eines Themenkandidaten formuliert die KI einen ersten Thementext und eine interne Themendefinition.

Die interne Themendefinition enthält mindestens:

- Thementitel,
- Leitfrage,
- lokalen Bezug zu Feldkirchen,
- einbezogene Perspektiven bzw. Dimensionen,
- ausdrückliche Abgrenzung,
- relevante übergeordnete Kontexte,
- zugehörige bzw. auslösende Vorgänge und Beiträge,
- Unsicherheiten und offene Abgrenzungsfragen.

Der Arbeitsprozess ist iterativ:

> **Themenkandidat → Entwurf → redaktionelle Ergänzung/Korrektur → gezielte Recherche → Kontextschärfung → bestätigte Themendefinition → laufende Weiterentwicklung**

Eine bestätigte Themendefinition ist **kein eingefrorener Endzustand**. Sie kann auch später ausgeschärft werden, wenn:

- neue Vorgänge entstehen,
- neue Quellen oder Erkenntnisse auftauchen,
- die KI eine bislang fehlende Perspektive erkennt,
- die Redaktion einen bislang nicht erkannten Aspekt oder Vorgang ergänzt.

Änderungen an einer bestätigten Themendefinition werden versioniert und erneut redaktionell bestätigt. Die KI ändert eine veröffentlichte Themendefinition nicht selbstständig.

## 7. Kalibrierung der KI

Die wiederkehrende redaktionelle Arbeit an Themen dient zugleich der Kalibrierung der Erkennungslogik.

Die KI soll aus folgenden Entscheidungen lernen:

- bestätigte Themenkandidaten,
- veränderte Themenkandidaten,
- verworfene Themenkandidaten,
- vom Redakteur ergänzte fehlende Aspekte,
- nachträglich entdeckte relevante Vorgänge,
- bewusste Abgrenzungen zwischen Thema und Vorgang,
- redaktionell korrigierte Rollen eines Vorgangs innerhalb eines Themas.

Ziel ist keine autonome Themenhoheit der KI, sondern eine zunehmend FIB-spezifische Vorschlagslogik unter redaktioneller Kontrolle.

## 8. Recherchelogik: bekannte Themen reichen nicht aus

Die Recherche darf nicht ausschließlich aus bereits bekannten Themenbegriffen abgeleitet werden. Sonst entsteht ein Zirkelschluss: Was noch nicht als Thema erkannt wurde, wird möglicherweise auch nicht gezielt gesucht.

FIB benötigt deshalb zwei komplementäre Recherchewege:

### 8.1 Themen- und vorgangsbezogene Recherche

Bekannte Themen und Vorgänge erzeugen gezielte Suchachsen, Quellenbeobachtung und Rechercheaufträge.

### 8.2 Themenunabhängige Entdeckung

Zusätzlich werden relevante lokale und regionale Quellen regelmäßig unabhängig von bereits bekannten Themen ausgewertet. Ziel ist, neue Vorgänge, bislang unbekannte Sachzusammenhänge und mögliche neue Themen zu erkennen.

Dazu gehören insbesondere:

- vollständige Sichtung definierter Pflichtquellen,
- ortsbezogene Recherche unabhängig von bestehenden Themenbegriffen,
- periodische rückblickende Recherche,
- Analyse breiter Sammelartikel und Übersichten auch dann, wenn ihr Titel kein bekanntes FIB-Schlagwort enthält.

Der Fall „Kiesgrund“ dient als Referenz- und Regressionstest: Ein relevantes Zukunftsprojekt darf nicht dauerhaft unsichtbar bleiben, nur weil es noch nicht als etablierter FIB-Begriff vorhanden war.

## 9. Referenzfall „Kiesgrund“

Der Redakteur hat im Test zum Themenkandidaten Wohnen auf den bislang im FIB-Bestand nicht ausreichend sichtbaren Vorgang „Kiesgrund“ hingewiesen.

Der Fall zeigt mehrere Anforderungen zugleich:

- Redakteure müssen fehlende Vorgänge ergänzen können.
- Daraus muss unmittelbar eine gezielte KI-Recherche entstehen können.
- Ein neu gefundener großer Vorgang kann eine bereits bestätigte Themendefinition verändern.
- Ein Vorgang kann gleichzeitig für mehrere Themen relevant sein, insbesondere Wohnen und Ortsentwicklung.
- Themenunabhängige Entdeckung muss solche Vorgänge künftig auch ohne redaktionellen Hinweis finden können.

## 10. Konsequenzen für G3

Für das Datenmodell sind mindestens vorzusehen:

- eigenständige Entitäten für Ereignis/Beitrag, Vorgang und Thema,
- n:m-Beziehungen zwischen Vorgängen und Themen,
- **fachliche Rolle einer Vorgang-/Ereignisbeziehung innerhalb eines Themas**,
- Möglichkeit mehrerer Rollen pro Beziehung bzw. einer späteren Rollenänderung,
- versionierte Themendefinitionen,
- redaktioneller Bestätigungsstatus für Themendefinitionen,
- strukturierte Perspektiven/Kontextdimensionen eines Themas,
- redaktionell ergänzte Aspekte und Prüfaufträge,
- Rechercheaufträge mit Status und Ergebnis,
- Herkunft einer Perspektive: KI erkannt / Redaktion ergänzt / Recherche bestätigt,
- nachvollziehbare Zuordnungs-, Rollen- und Abgrenzungsentscheidungen,
- Kalibrierungsfeedback aus bestätigten, veränderten und verworfenen Vorschlägen.

Die konkrete Modellierung erfolgt in G3.

## 11. Nächster G2-Schritt

Als nächstes wird geprüft, **wie ein bestätigtes Thema öffentlich dargestellt wird**, ohne wieder in die alte Logik „Thema = chronologischer Vorgang“ zurückzufallen.

Die Themenseite muss insbesondere beantworten:

- Was ist die Leitfrage?
- Warum ist sie für Feldkirchen relevant?
- Welche Perspektiven gehören zum Thema?
- Welche konkreten Vorgänge prägen den lokalen Stand?
- Welche Rolle spielen diese Vorgänge im Thema: Treiber, Umsetzung, Betroffenheit, Kontext oder Indikator?
- Welcher externe Kontext hilft beim Verständnis?
- Was wissen wir, was ist offen und wo bestehen Wissenslücken?
- Welche neuen Entwicklungen haben die Themendefinition zuletzt verändert?

Die konkrete UX der Themenseite wird anhand realer Themenfälle getestet, bevor sie verbindlich festgelegt wird.
