# Fachliche Datenanforderungen und logisches Datenmodell – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.2 | 02.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

### 3.3 Beziehung Ereignis ↔ Meldung

Verbindliche Kardinalität:

> **Ein Ereignis kann keine oder genau eine Meldung haben. Eine Meldung gehört immer genau zu einem Ereignis.**

Damit gilt fachlich:

- **Ereignis → Meldung:** `0..1`
- **Meldung → Ereignis:** `1`

Begründung:

- Ein erkanntes Ereignis kann fachlich relevant sein, ohne genügend eigenen Nachrichtenwert für eine öffentliche Meldung zu besitzen.
- Wird ein Ereignis als berichtenswert bestätigt, erhält es genau eine Meldung.
- Zusätzliche Quellen oder neue Informationen zum selben Ereignis erzeugen keine zweite Meldung, sondern können die bestehende Meldung aktualisieren.
- Erst ein neues eigenständiges Ereignis kann eine weitere Meldung erzeugen.
- Ein zunächst nicht berichtetes Ereignis kann später aufgrund neuer Erkenntnisse doch eine Meldung erhalten.

Beispiel:

- Veröffentlichung einer neuen Beschlussvorlage zur Hundewiese → Ereignis A → Meldung A.
- Später gefundener Pressebericht zur selben Vorlage → kein neues Ereignis; gegebenenfalls Aktualisierung von Meldung A.
- Spätere Beratung und Beschlussfassung im Gemeinderat → Ereignis B → Meldung B.

Damit bleiben Ereignisfolge und redaktionelle Veröffentlichung voneinander unterscheidbar.

### 3.4 Noch zu klärende Kernbeziehungen

Als nächster Modellierungsschritt werden die Kardinalitäten und fachlichen Regeln geklärt für:

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

1. Gehört ein Ereignis bzw. eine Meldung immer genau zu einem Vorgang oder kann es ohne Vorgang bestehen?
2. Können mehrere Vorgänge dasselbe Ereignis fachlich berühren?
3. Wie werden direkte Beziehungen von Meldungen/Ereignissen zu Themen modelliert?
4. Welche Beziehungen benötigen eigene Attribute wie Wirkungsrolle, Gewichtung, Gültigkeitszeitraum oder redaktionelle Bestätigung?
5. Welche Status gehören zu Ereignis, Meldung, Vorgang, Thema und Sitzung?
6. Welche Änderungen werden versioniert, welche nur protokolliert?
7. Welche Daten gehören zur fachlichen Persistenz und welche nur zum technischen Betrieb?

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.2 | 02.10.2026 | Kardinalität Ereignis ↔ Meldung verbindlich festgelegt: ein Ereignis hat 0..1 Meldungen, eine Meldung gehört genau zu einem Ereignis. |
| 0.1 | 01.10.2026 | G3-Primärdokument angelegt; Trennung von Ereignis und Meldung verbindlich festgelegt; weitere Modellbereiche und nächste Klärungsschritte aufgenommen. |
