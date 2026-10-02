# Themen- und Vorgangslogik – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 02.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche fachliche Primärquelle für die Erkennung, Abgrenzung, redaktionelle Entwicklung und laufende Pflege von **Themen** und **Vorgängen** im FIB-Echtsystem.

Die konkrete logische Datenmodellierung steht in `docs/Datenmodell.md`.

## 2. Begriffe

### 2.1 Ereignis / Meldung

Ereignis und Meldung sind getrennte fachliche Objekte. Ein Ereignis ist ein relevantes Geschehen oder eine relevante Entwicklung; eine Meldung ist die redaktionelle FIB-Darstellung eines berichtenswerten Ereignisses. Die verbindliche Abgrenzung steht in `docs/Datenmodell.md` und `docs/Begriffe.md`.

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

Ein Thema ist keine feste Kategorie und keine bloße Sammlung ähnlich benannter Meldungen.

Beispiele können sein:

- Wohnen und kommunale Entwicklung,
- kommunale Wärmeversorgung / Wärmeplanung und Geothermie,
- Klimaanpassung im Lebensumfeld,
- Ortsentwicklung.

Ein Vorgang kann mehreren Themen zugeordnet sein. Umgekehrt umfasst ein Thema in der Regel mehrere Vorgänge.

## 3. Themen entstehen bottom-up

Themen werden nicht von oben vorgegeben. Die KI untersucht den Bestand aus Ereignissen, Meldungen und Vorgängen auf mögliche übergeordnete Zusammenhänge.

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
- auslösende Vorgänge und Meldungen,
- erkannte Muster, Gemeinsamkeiten und Zielkonflikte,
- Begründung, warum der Zusammenhang über einen Einzelvorgang hinausgeht,
- möglichen Erklärungsgewinn,
- vorgeschlagene Perspektiven bzw. Kontextdimensionen,
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

### 5.1 Bedeutung eines Vorgangs für ein Thema

Eine Zuordnung zu einem Thema beschreibt nicht nur, **dass** ein Vorgang relevant ist, sondern auch, **wie stark** er das Verständnis oder die Entwicklung des Themas prägt.

Dafür wird die **Bedeutung für das Thema** verwendet:

- **prägend** – ohne diesen Vorgang lässt sich das Thema derzeit kaum sinnvoll erklären,
- **relevant** – der Vorgang trägt wesentlich zum Verständnis bei,
- **ergänzend** – der Vorgang liefert zusätzlichen Kontext, ist aber nicht zentral.

Die KI schlägt die Einstufung vor. Die Redaktion muss sie verpflichtend prüfen und bestätigen oder ändern. Erst danach ist die Einstufung fachlich wirksam.

Die Bedeutung ist keine automatisch berechnete Kennzahl. Zahl der Meldungen, Quellen oder Perspektiven kann ein Hinweis sein, bestimmt die Einstufung aber nicht.

Die frühere Rollen-Taxonomie **Treiber / Gestaltungsbeitrag / Betroffenheit / Rahmenbedingung / Indikator** wird nicht mehr als eigenes strukturiertes Merkmal geführt. Ihre fachliche Aussage wird durch die konkreten Perspektiven und Wirkungen besser und ohne Redundanz beschrieben.

### 5.2 Perspektiven und Wirkungen

Ein Thema wird durch sachliche **Perspektiven** strukturiert. Eine Perspektive bezeichnet einen fachlichen Betrachtungsaspekt, z. B. Lärm, Verkehrssicherheit, Flächenverbrauch, Erreichbarkeit oder kommunalen Handlungsspielraum.

Unter einer Perspektive werden die sachlich belegbaren oder begründet erwartbaren **Wirkungen** relevanter Vorgänge beschrieben.

Perspektive und Wirkung sind keine politische Bewertung. Die politische Bewertung gehört ausschließlich in die getrennte Ebene **„Unsere Einordnung“**.

## 6. Iterative Themendefinition

Nach Auswahl eines Themenkandidaten formuliert die KI einen ersten Thementext und eine interne Themendefinition.

Die interne Themendefinition enthält mindestens:

- Thementitel,
- Leitfrage,
- lokalen Bezug zu Feldkirchen,
- einbezogene Perspektiven bzw. Dimensionen,
- ausdrückliche Abgrenzung,
- relevante übergeordnete Kontexte,
- zugehörige bzw. auslösende Vorgänge und Meldungen,
- Bedeutung der Vorgänge für das Thema,
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
- redaktionell korrigierte Einstufungen der Bedeutung eines Vorgangs für ein Thema,
- redaktionell ergänzte oder korrigierte Perspektiven.

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

- eigenständige Entitäten für Ereignis, Meldung, Vorgang und Thema,
- n:m-Beziehungen zwischen Vorgängen und Themen,
- redaktionell bestätigte **Bedeutung für das Thema** mit den Stufen prägend / relevant / ergänzend,
- strukturierte Perspektiven eines Themas,
- sachliche Wirkungen relevanter Vorgänge innerhalb dieser Perspektiven,
- versionierte Themendefinitionen,
- redaktioneller Bestätigungsstatus für Themendefinitionen,
- redaktionell ergänzte Aspekte und Prüfaufträge,
- Rechercheaufträge mit Status und Ergebnis,
- Herkunft einer Perspektive: KI erkannt / Redaktion ergänzt / Recherche bestätigt,
- nachvollziehbare Zuordnungs-, Bedeutungs- und Abgrenzungsentscheidungen,
- Kalibrierungsfeedback aus bestätigten, veränderten und verworfenen Vorschlägen.

Die konkrete Modellierung erfolgt in `docs/Datenmodell.md`.

## 11. Öffentliche Themendarstellung

Eine Themenseite muss insbesondere beantworten:

- Was ist die Leitfrage?
- Warum ist sie für Feldkirchen relevant?
- Welche Perspektiven gehören zum Thema?
- Welche konkreten Vorgänge prägen den lokalen Stand?
- Welche Bedeutung haben diese Vorgänge für das Thema?
- Welche sachlichen Wirkungen sind unter den relevanten Perspektiven erkennbar?
- Welcher externe Kontext hilft beim Verständnis?
- Was wissen wir, was ist offen und wo bestehen Wissenslücken?
- Welche neuen Entwicklungen haben die Themendefinition zuletzt verändert?

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 02.10.2026 | Wirkungsrollen-Taxonomie durch „Bedeutung für das Thema“ ersetzt; verpflichtende redaktionelle Bestätigung festgelegt; Perspektiven und sachliche Wirkungen von politischer Bewertung abgegrenzt. |
| 1.1 | 30.09.2026 | Themen-/Vorgangslogik konsolidiert und Wirkungsrollen eingeführt. |
