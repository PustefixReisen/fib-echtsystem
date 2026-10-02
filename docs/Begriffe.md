# Begriffsregister – FIB Echtsystem

## Dokumentstand

**Stand:** 02.10.2026  
**Verantwortlich:** Josef Walter – erstellt mit KI-Unterstützung

Dieses Dokument wird im Normalfall über das **Stand-Datum** fortgeschrieben. Eine neue Versionsnummer wird nur eingeführt, wenn sich die Struktur oder das Grundkonzept des Dokuments wesentlich ändert.

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für die Bedeutung und Abgrenzung zentraler FIB-Begriffe.

Es soll insbesondere verhindern, dass fachlich ähnliche Begriffe im Datenmodell, in der Redaktion oder in der KI-Logik unterschiedlich verwendet werden.

Definierte FIB-Fachbegriffe werden in diesem Dokument und, soweit sinnvoll, in den Fachdokumenten als `Code-Begriffe` hervorgehoben. Dadurch sollen sie als festgelegte Begriffe des Modells von normalem Fließtext unterscheidbar sein.

Für fachliche Regeln und Kardinalitäten bleiben die jeweiligen Primärdokumente maßgeblich, insbesondere `docs/Datenmodell.md` und `docs/Themen-und-Vorgangslogik.md`.

## 2. Wissenskern

### `Ereignis`

Ein fachlich relevantes Geschehen oder eine relevante Entwicklung in der Wirklichkeit.

**Nicht zu verwechseln mit:** `Meldung`. Das `Ereignis` beschreibt, was passiert; die `Meldung` beschreibt, was FIB darüber veröffentlicht.

### `Meldung`

Die redaktionelle FIB-Darstellung eines eigenständigen berichtenswerten `Ereignisses`.

Eine `Meldung` gehört genau zu einem `Ereignis`. Nicht jedes `Ereignis` muss eine `Meldung` erzeugen.

### `Vorgang`

Ein konkreter länger laufender Sachverhalt, der mehrere `Ereignisse` bündeln kann und einen eigenen aktuellen Stand, Verlauf, Status, offene Punkte und nächste belegte Schritte besitzt.

**Nicht zu verwechseln mit:** `Thema`. Ein `Vorgang` ist konkret; ein `Thema` ist eine übergeordnete Fragestellung.

### `Thema`

Eine übergeordnete Fragestellung, die mehrere `Vorgänge`, `Ereignisse`, `Perspektiven` oder Rahmenbedingungen verbindet und dadurch zusätzlichen Erklärungsgewinn schafft.

`Themen` entstehen bottom-up aus dem vorhandenen Wissen und werden redaktionell bestätigt.

## 3. Beziehung `Vorgang ↔ Thema`

### `Bedeutung für das Thema`

Redaktionell bestätigte Einstufung, wie stark ein `Vorgang` das Verständnis oder die Entwicklung eines `Themas` prägt.

Stufen:

- `prägend` – ohne diesen `Vorgang` lässt sich das `Thema` derzeit kaum sinnvoll erklären,
- `relevant` – der `Vorgang` trägt wesentlich zum Verständnis bei,
- `ergänzend` – der `Vorgang` liefert zusätzlichen Kontext, ist aber nicht zentral.

Die KI schlägt die `Bedeutung für das Thema` vor; die Redaktion muss sie verpflichtend prüfen und bestätigen oder ändern.

**Nicht zu verwechseln mit:** `Wirkung`. Die `Bedeutung für das Thema` beschreibt die Stellung eines `Vorgangs` im `Thema` insgesamt; eine `Wirkung` beschreibt eine konkrete sachliche Folge unter einer `Perspektive`.

### `Wirkungsrolle` – nicht mehr verwendet

Die frühere Taxonomie „Treiber / Gestaltungsbeitrag / Betroffenheit / Rahmenbedingung / Indikator“ wird **nicht mehr als eigenes strukturiertes FIB-Merkmal verwendet**.

Die dahinterliegenden fachlichen Aussagen werden über `Bedeutung für das Thema`, `Perspektiven` und konkrete `Wirkungen` abgebildet.

## 4. `Perspektive`, `Wirkung` und politische Einordnung

### `Perspektive`

Ein sachlicher Betrachtungsaspekt innerhalb eines `Themas`, unter dem relevante `Vorgänge` und ihre Folgen untersucht werden.

Beispiele:

- Lärm,
- Verkehrssicherheit,
- Verkehrsströme,
- Flächenverbrauch,
- Erreichbarkeit,
- kommunaler Handlungsspielraum.

Eine `Perspektive` ist zunächst wertungsfrei.

**Nicht zu verwechseln mit:** Akteursperspektive oder politischer `Bewertung`. „Lärm“ ist eine fachliche `Perspektive`; „Autobahn GmbH“ oder „GRÜNE Feldkirchen“ sind `Akteure` bzw. politische Träger.

### `Wirkung`

Eine sachlich belegbare oder begründet erwartbare Folge eines `Vorgangs` unter einer bestimmten `Perspektive`.

`Wirkungen` gehören zur Sachinformation. Sie können positiv, negativ, gemischt, unklar oder von Bedingungen abhängig sein; diese Beschreibung ist noch keine politische `Bewertung`.

**Nicht zu verwechseln mit:** `Bewertung`. `Wirkung` beschreibt, was geschieht oder voraussichtlich geschieht; `Bewertung` beschreibt, wie die GRÜNEN Feldkirchen diese `Wirkung` politisch einordnen.

### `Bewertung`

Die politische Beurteilung einer `Wirkung` im Rahmen von **„Unsere Einordnung“**.

Die strukturierte Bewertungssicht in FIB ist die von **BÜNDNIS 90/DIE GRÜNEN Feldkirchen**. Positionen anderer `Akteure` können als Sachinformation dokumentiert werden, bilden aber kein paralleles FIB-Bewertungssystem.

Eine `Bewertung` kann neben ihrer Richtung auch die politische Bedeutung bzw. Gewichtung einer `Wirkung` berücksichtigen.

### `Begründung`

Die nachvollziehbare Herleitung, warum eine `Wirkung` politisch so `bewertet` und gewichtet wird.

Die `Begründung` soll, soweit für das Verständnis erforderlich, den politischen Maßstab offenlegen und darf nicht nur ein unbegründetes Werturteil wiederholen.

### `Politischer Bezug`

Ein grüner Wert, ein politisches Ziel oder eine dokumentierte grüne `Position`, auf die sich die `Begründung` einer `Bewertung` stützt.

Der `Politische Bezug` kann insbesondere aus folgenden Ebenen stammen:

- dokumentierte lokale `Position` der GRÜNEN Feldkirchen,
- `Position` einer höheren grünen Ebene als Referenz für eine redaktionelle Ableitung,
- allgemeiner grüner Wert oder `Zielbereich` als Bewertungsmaßstab.

Die konkrete Modellierung dieses Referenzsystems wird in G3 gesondert festgelegt.

## 5. `Akteur` und `Position`

### `Akteur`

Eine Organisation, Institution, Gruppe oder gegebenenfalls Person, die für einen Sachverhalt relevant ist, z. B. Gemeinde, Landkreis, Autobahn GmbH, Bürgerinitiative, Verein oder Partei.

`Akteure` können insbesondere zuständig, beteiligt, betroffen, Quelle einer Aussage oder Träger einer dokumentierten `Position` sein.

### `Dokumentierte Position`

Eine einem `Akteur` belegbar zuordenbare Aussage, Forderung, `Bewertung` oder Zielsetzung.

`Positionen` anderer `Akteure` gehören zur Sachinformation und werden als solche zugeschrieben. Sie werden nicht mit der strukturierten grünen `Bewertung` in „Unsere Einordnung“ vermischt.

## 6. Noch zu ergänzende Begriffe

Dieses Register wird im Verlauf von G3 und den folgenden Gründungspaketen erweitert, insbesondere um:

- `Quelle`,
- `Fundstelle`,
- `Quellenrolle`,
- `Sitzung`,
- `TOP`,
- `Aktualisierungsereignis`,
- `Version / Historisierung`,
- `Rechercheauftrag`,
- `Wissenslücke`,
- `Freigabestatus`,
- `Pflichtbestätigung`.
