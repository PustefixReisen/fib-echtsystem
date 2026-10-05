# Technische Namenskonvention – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für technische Benennungen im FIB-Echtsystem.

Die Regel gilt für technische Tabellen-, Feld-, Funktions- und vergleichbare Implementierungsnamen. Fachliche Begriffe, UI-Texte, Statusanzeigen und redaktionelle Bezeichnungen können deutsch bleiben.

## 2. Sprache

Verbindliche Regel:

> **Technische Tabellen-, Feld- und Funktionsnamen werden auf Englisch benannt. Fachliche Anzeige- und Statuswerte dürfen deutsch bleiben.**

Beispiele:

- Tabelle: `Events`
- Datensatz/Fachobjekt: Ereignis
- Tabelle: `Messages`
- Datensatz/Fachobjekt: Meldung
- Tabelle: `Processes`
- Datensatz/Fachobjekt: Vorgang
- Tabelle: `Topics`
- Datensatz/Fachobjekt: Thema

## 3. Singular und Plural

Verbindliche Regel:

> **Persistente Mengen bzw. Tabellen werden im Plural benannt; der einzelne Datensatz bzw. das einzelne Fachobjekt wird im Singular bezeichnet.**

Beispiele:

- `AITasks` → einzelne KI-Aufgabe
- `AITaskRuns` → einzelner KI-Aufgabenlauf
- `ObservationTasks` → einzelner Beobachtungsauftrag
- `ReferenceMeasures` → einzelner Referenzmaßstab

Die genaue endgültige englische Übersetzung einzelner Fachbegriffe wird im technischen Datenmodell festgelegt; die hier definierte Sprach- und Numerusregel bleibt davon unberührt.

## 4. Schlüssel- und Referenznamen

Soweit keine spätere technische Entscheidung entgegensteht, gilt die bereits projektübergreifend verwendete Konvention:

- Primärschlüssel: `<SingularEntityName>ID`, z. B. `FindingID`,
- Fremdschlüssel: `ref` + referenzierter Primärschlüssel, z. B. `refTopicID`,
- virtuelle bzw. ausschließlich abgeleitete UI-Felder können mit `v` beginnen, sofern eine solche Feldklasse technisch verwendet wird.

Diese Detailregel wird bei der physischen Datenmodellierung nochmals auf Eignung für PostgreSQL/Supabase geprüft; die Grundidee konsistenter englischer technischer Namen ist bereits verbindlich.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 05.10.2026 | Englische technische Benennungen sowie Plural für Tabellen/Mengen und Singular für einzelne Fachobjekte als verbindliche Namensregel festgelegt. Bestehende Schlüsselkonvention dokumentiert. |
