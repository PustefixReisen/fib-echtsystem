# G10-Gesamtaudit – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Audit prüft, ob G10 die für FIB notwendigen Go-live-Abnahmekriterien vollständig, widerspruchsfrei und messbar genug festlegt.

Verbindliche Primärquelle: `docs/Go-live-Abnahmekriterien.md` v1.0.

## 2. Prüfgrundlagen

Geprüft wurden insbesondere:

- `docs/Projektgruendung.md`
- `docs/Fachkonzept.md`
- `docs/Datenmodell.md`
- `docs/Regressionstests-Demonstratortransfer.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/Zielarchitektur.md`
- `docs/Rollen-Rechte-und-Workflow.md`
- `docs/Betrieb-und-Wiederherstellung.md`
- `docs/Migrationsstrategie.md`
- `docs/Migrations-Runbook.md`
- `docs/KI-Betrieb-und-Kosten.md`

## 3. Vollständigkeit

G10 deckt die notwendigen Abnahmedimensionen ab:

- fachlicher Kern,
- Demonstrator-Regressionen,
- Recherche-/Ereignisentdeckung,
- Redaktionsworkflow/Rechte,
- Datenschutz/Schutzbedarf,
- öffentliche Website/PWA,
- Barrierefreiheit/Bedienbarkeit,
- Betrieb/Backup/Restore,
- Migration/organisatorische Übergabe,
- KI-Qualität/Provider/Kosten,
- Sicherheit,
- Demonstrator-Datenmigration,
- Dokumentation/Betriebsfähigkeit.

Ergebnis: **vollständig für den Gründungsstand.**

## 4. Blockerlogik

Die Blockerlogik ist eindeutig:

- keine offenen kritischen fachlichen Regressionen,
- kein fehlender Restore-Test,
- keine offenen kritischen Sicherheitslücken,
- keine ungeklärten Datenschutz-/DSFA-/Providerblocker,
- keine unkontrollierten persönlichen Produktivabhängigkeiten,
- keine unvollständige oder nicht validierte Zielmigration,
- keine unprüfbaren Pflichtkriterien.

Nichtkritische Komfortabweichungen dürfen dokumentiert nach Go-live verschoben werden.

Ergebnis: **konsistent mit G1–G9.**

## 5. Messbarkeit

Messbare bzw. nachweisbare Kriterien sind vorhanden.

Besonders wichtig:

- kritische Referenzfälle: 100 % bestanden,
- Pflichtquellen-/kritische Ereignisfälle dürfen nicht systematisch übersehen werden,
- konkrete Precision-/Recall-Schwellen werden aus dem realen Pilotkorpus abgeleitet statt vorab erfunden,
- Backup/Restore, Rollback, MFA, Rechte, Migration und Monitoring müssen praktisch nachgewiesen werden,
- Kostenbudget basiert auf Pilotmessungen.

Damit vermeidet G10 sowohl rein qualitative Freigabe als auch Scheingenauigkeit ohne Datenbasis.

## 6. Zeitliche Einordnung

G10 der Gründungsphase **definiert** die Abnahmekriterien. Die operative Anwendung kann erst nach U1–U6, Pilotbetrieb und realer Zielmigration erfolgen.

Die Gründungsphase wird deshalb nicht dadurch blockiert, dass Nachweise wie Restore-Test, Sicherheitsprüfung oder Migration heute noch nicht ausführbar sind. Sie werden als spätere Go-live-Pflichtkriterien geführt.

## 7. Offene Folgepunkte

Vor realer Go-live-Abnahme sind insbesondere noch auszuführen:

- Regressionstestkorpus technisch automatisieren und Kritikalität kennzeichnen,
- repräsentativen Recherche-/Qualitätstestkorpus aufbauen,
- konkrete Pilot-Qualitätsschwellen kalibrieren,
- Restore-Test nach Issue #3 durchführen,
- tatsächliche Datenschutz-/Provider-/DSFA-Prüfung abschließen,
- Sicherheitsprüfungen ausführen,
- Demonstratordaten migrieren/validieren,
- reale Zielmigration durchführen,
- Produktivkosten und Budget kalibrieren.

Diese Punkte sind Umsetzungs-/Go-live-Aufgaben, keine offenen G10-Grundsatzfragen.

## 8. Auditergebnis

**G10 ist bestanden.**

Es bestehen keine bekannten offenen Grundsatzfragen zur Go-live-Abnahme. Die Kriterien sind hinreichend vollständig und verbindlich, um nach der Umsetzung eine belastbare Go-live-Entscheidung zu ermöglichen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G10 gegen G1–G9 geprüft; Abnahmedimensionen, Blockerlogik, Messbarkeit und zeitliche Einordnung bestätigt; G10-Audit bestanden. |
