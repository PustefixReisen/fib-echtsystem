# G9-Gesamtaudit – Migration

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument prüft den Abschluss von G9 – Migration – gegen die bereits festgelegte Zielarchitektur, Betriebsregeln, Governance und Go-live-Vorbereitung.

## 2. Prüfergebnis

G9 ist konzeptionell vollständig und widerspruchsfrei. Die reale Migration ist **nicht** Bestandteil der Gründungsphase; sie wird erst nach U1–U6 im Go-live-Kontext ausgeführt.

## 3. Geprüfte Punkte

### Zielinfrastruktur

Abgedeckt sind organisationskontrollierte Zielkomponenten für:

- Webhosting,
- Supabase,
- Datei-/Bildspeicher,
- Repository/CI-CD,
- KI-Provider,
- Backup,
- Monitoring/Warnkanal,
- Domains/Redirects,
- Adminzugänge.

### Portabilität

Das Runbook setzt voraus und prüft:

- keine hart codierten persönlichen Infrastrukturwerte,
- reproduzierbares Schema/Backend aus Repository,
- externe Konfiguration/Secrets,
- austauschbare Storage-/Provideranbindung,
- keine notwendige persönliche Accountbindung nach Übergabe.

### Datenmigration

Abgedeckt sind:

- finaler konsistenter Datenbankexport,
- Schema-/Datenimport,
- Auth-/Rollenherstellung,
- Datei-/Bildübernahme,
- Referenz-/Integritätsprüfung,
- kontrollierte Behandlung offener Queue-/Task-Zustände.

### Sicherheits- und Betriebsübergabe

Abgedeckt sind:

- MFA/RLS/Fachrechte,
- Secrets,
- KI-Routing/Providerfreigaben,
- Backup,
- Monitoring und Warnkanäle,
- mindestens zwei Zieladmins,
- Restore-Test als Go-live-Gate.

### Go-live und Rückfall

Abgedeckt sind:

- Prüfgates vor Umschaltung,
- finaler Datenabgleich,
- kein paralleler Schreibbetrieb,
- öffentlicher Rollback auf letzten gültigen Stand,
- keine unkontrollierte Rückkehr zur alten Umgebung nach neuen produktiven Schreibvorgängen.

## 4. Abgrenzung zu G10

G9 definiert **wie** migriert wird. G10 definiert **unter welchen messbaren Bedingungen** FIB produktiv gehen darf.

Daher bleiben insbesondere folgende Nachweise G10 bzw. U6 vorbehalten:

- erfolgreich ausgeführter Restore-Test,
- reale End-to-End-Tests,
- reale Pilotkosten und Qualitätsmessungen,
- Datenschutz-/DSFA-Abschluss,
- erfolgreiche Demonstrator-Regressionen,
- tatsächliche organisationskontrollierte Zielkonten und Zugänge.

## 5. Abschlussbewertung

**G9 bestanden.**

Verbindliche Quellen:

- `docs/Migrationsstrategie.md` v1.1
- `docs/Migrations-Runbook.md` v1.0

Die reale Migration wird erst nach Implementierung/Pilotierung ausgeführt und anhand dieses Runbooks protokolliert.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G9 gegen Zielarchitektur, G7-Betrieb, G8-Governance und spätere G10-Abnahme geprüft; G9 als konzeptionell abgeschlossen bewertet. |
