# Fachliche Datenanforderungen und logisches Datenmodell – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 01.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

## 3. Wissenskern

Die fachliche Grundstruktur lautet:

> **Ereignis → Meldung → Vorgang → Thema**

Diese Struktur ist keine starre Hierarchie. Insbesondere können Vorgänge mehreren Themen zugeordnet sein, Meldungen direkt themenrelevant sein und Sitzungen quer zu mehreren Ebenen liegen.

### 3.1 Ereignis

Ein **Ereignis** ist ein fachlich relevantes Geschehen oder eine relevante Entwicklung in der Wirklichkeit.

Beispiele:

- eine Beschlussvorlage wird veröffentlicht,
- ein Gemeinderat fasst einen Beschluss,
- ein Planungsstand ändert sich,
- ein Vorhabenträger veröffentlicht neue Unterlagen,
- eine neue belastbare Information verändert den Stand eines laufenden Sachverhalts.

Ein Ereignis ist damit von seiner redaktionellen Darstellung zu unterscheiden.

### 3.2 Meldung

Eine **Meldung** ist die redaktionelle FIB-Darstellung eines eigenständigen berichtenswerten Ereignisses.

Verbindliche Entscheidung:

> **Ereignis und Meldung sind getrennte fachliche Objekte.**

Daraus folgt:

- Ein Ereignis kann erkannt und gespeichert werden, ohne zwingend eine eigene veröffentlichte Meldung zu erzeugen.
- Eine Meldung setzt ausreichenden Nachrichtenwert voraus.
- Neue Informationen zum selben Ereignis aktualisieren grundsätzlich die bestehende Meldung.
- Ein neues eigenständiges Ereignis mit ausreichendem Nachrichtenwert erzeugt grundsätzlich eine neue Meldung.
- Die Entscheidung „neues Ereignis oder Aktualisierung“ bleibt eine fachlich wirksame, redaktionell zu bestätigende Entscheidung.

Diese Trennung erlaubt insbesondere die saubere Unterscheidung zwischen:

1. **Was ist tatsächlich passiert?** → Ereignis
2. **Welche neuen Informationen liegen dazu vor?** → Quellen/Fundstellen und Aktualisierung
3. **Was veröffentlicht FIB dazu?** → Meldung

### 3.3 Noch zu klärende Kernbeziehungen

Als nächster Modellierungsschritt werden die Kardinalitäten und fachlichen Regeln geklärt für:

- Ereignis ↔ Meldung,
- Ereignis/Meldung ↔ Vorgang,
- Vorgang ↔ Thema,
- direkte Meldung/Ereignis ↔ Thema,
- Sitzung/TOP ↔ Ereignis/Meldung/Vorgang/Thema.

Dabei wird ausdrücklich geprüft, welche Beziehungen zwingend, optional, einfach oder n:m sind und welche Beziehungen eigene fachliche Attribute benötigen, z. B. Wirkungsrollen.

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

1. Welche Kardinalität gilt zwischen Ereignis und Meldung?
2. Gehört eine Meldung immer genau zu einem Vorgang oder kann sie ohne Vorgang bestehen?
3. Können mehrere Vorgänge dasselbe Ereignis fachlich berühren?
4. Wie werden direkte Beziehungen von Meldungen/Ereignissen zu Themen modelliert?
5. Welche Beziehungen benötigen eigene Attribute wie Wirkungsrolle, Gewichtung, Gültigkeitszeitraum oder redaktionelle Bestätigung?
6. Welche Status gehören zu Ereignis, Meldung, Vorgang, Thema und Sitzung?
7. Welche Änderungen werden versioniert, welche nur protokolliert?
8. Welche Daten gehören zur fachlichen Persistenz und welche nur zum technischen Betrieb?

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 01.10.2026 | G3-Primärdokument angelegt; Trennung von Ereignis und Meldung verbindlich festgelegt; weitere Modellbereiche und nächste Klärungsschritte aufgenommen. |
