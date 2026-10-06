# Migrations-Runbook – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Runbook beschreibt den wiederholbaren Übergang von der Entwicklungs-/Pilotinfrastruktur auf die organisationskontrollierte Zielumgebung der GRÜNEN Feldkirchen. Es wird in G9 erstellt; die tatsächliche Ausführung erfolgt erst nach U1–U6 im Go-live-Kontext.

## 2. Grundprinzipien

- Migration erfolgt auf eine zunächst wegwerfbare Zielumgebung.
- Vor Go-live darf eine fehlerhafte Zielumgebung vollständig neu aufgebaut werden.
- Kein produktiver Schreibbetrieb parallel auf Quell- und Zielsystem.
- Jede Teilmigration erhält eine Prüfstufe.
- Go-live erst nach bestandenem Gesamtcheck.
- Bei Zweifel bleibt der bisherige öffentliche Stand aktiv.
- Persönliche Entwicklerkonten dürfen nach Übergabe keine notwendige Betriebsabhängigkeit mehr sein.

## 3. Voraussetzungen vor Start

### 3.1 Organisationskontrollierte Zugänge vorhanden

Mindestens vorhanden bzw. vorbereitet:

- Ziel-Webserver/Hosting,
- Ziel-Domain/DNS-Zugriff,
- Ziel-Supabase-Projekt,
- Ziel-Datei-/Bildspeicher,
- GitHub-/Repository-/CI/CD-Zugriff,
- KI-Providerkonten/API-Zugänge,
- E-Mail-/Warnkanal,
- Backupziel,
- mindestens zwei administrative Personen im Zielbetrieb.

### 3.2 Quellstand eingefroren

Vor der finalen Übernahme:

- redaktionelle Änderungen stoppen,
- AI Tasks/automatische Schreibläufe pausieren,
- letzten konsistenten Datenbank-Dump erzeugen,
- letzten Datei-/Bildbestand sichern,
- aktuellen Release und Quellcommit festhalten,
- offene Jobs/Queues prüfen.

### 3.3 Repository reproduzierbar

Vor Migration müssen im Repository vorhanden sein:

- Datenbankmigrationen,
- Fachservices/Backend-Code,
- Edge Functions soweit genutzt,
- öffentliche und interne Anwendung,
- Build-/Deploymentdefinition,
- Konfigurationsschema ohne Secrets,
- Tests,
- dokumentierte externe Abhängigkeiten.

## 4. Phase A – Zielumgebung vorbereiten

1. Ziel-Webserver und Deploymentziel anlegen.
2. Ziel-Supabase-Projekt anlegen.
3. Auth-/Redirect-/MFA-Grundkonfiguration vorbereiten.
4. Ziel-Datei-/Bildspeicher anlegen.
5. Deployment-Secrets sicher hinterlegen.
6. KI-Provider-/Routing-Zugänge konfigurieren.
7. Monitoring-/Warnkanal konfigurieren.
8. Backupziel konfigurieren.
9. Ziel-Domain/temporäre Testdomain bzw. Hostname vorbereiten.

### Prüfgate A

- alle Zielsysteme erreichbar,
- keine Secrets im Repository,
- mindestens zwei Admins handlungsfähig,
- noch keine öffentliche Umschaltung.

## 5. Phase B – Anwendung und Schema herstellen

1. Zielrepository/CI/CD mit dem freigegebenen Quellstand verbinden.
2. Datenbankschema und Migrationen ausführen.
3. RLS/Policies/Funktionen/Trigger herstellen.
4. Fachservices/Edge Functions deployen.
5. Redaktions-App deployen.
6. öffentliche FIB-App testweise bauen und auf Testziel ausliefern.

### Prüfgate B

- Build erfolgreich,
- Schema entspricht erwarteter Version,
- Security-/RLS-Tests bestehen,
- Redaktions-App startet,
- öffentliche Testseite lädt.

## 6. Phase C – Daten übertragen

1. finalen konsistenten Datenbankexport aus Quellprojekt verwenden.
2. Daten in Zielprojekt importieren.
3. notwendige Auth-/Benutzer-/Rolleninformationen herstellen bzw. neu anlegen.
4. Datei-/Bildbestand übertragen.
5. Referenzen zwischen Datenbank und Storage prüfen.
6. Queue-/Task-Zustände nur übernehmen, wenn fachlich erforderlich; sonst sauber neu initialisieren.

### Prüfgate C

- Objektzahlen/Plausibilitätskennzahlen stimmen,
- Stichproben zu Meldungen, Ereignissen, Vorgängen, Themen und Quellen stimmen,
- Benutzer/Rollen stimmen,
- Bilder/Dateien sind erreichbar und korrekt zugeordnet,
- keine verwaisten kritischen Referenzen.

## 7. Phase D – externe Dienste und Betrieb aktivieren

1. produktive Secrets setzen.
2. KI-Provider-/Routing-Matrix aktivieren.
3. Mail-/Warnkanal aktivieren.
4. Backupjob aktivieren.
5. Monitoring aktivieren.
6. automatische AI Tasks zunächst kontrolliert aktivieren.
7. Push/sonstige optionale Dienste nur aktivieren, wenn im Produktivumfang freigegeben.

### Prüfgate D

- Backupjob erfolgreich,
- Warnung testweise ausgelöst und empfangen,
- KI-Aufruf über mindestens einen freigegebenen Betriebsweg erfolgreich,
- Fallback nur auf zulässige Route,
- keine K3-Übermittlung an KI,
- keine persönlichen Entwickler-Secrets erforderlich.

## 8. Phase E – fachliche End-to-End-Prüfung

Mindestens prüfen:

- Login + MFA für Redakteur/Admin,
- S0/S1/S2/S3-Rechte,
- unmittelbare S3-Bestätigung,
- Recherche → Ereigniskandidat → Ereignis → Meldung,
- Vorgangs-/Themenzuordnung,
- Bilder/Rechteprüfung,
- „Mehr wissen?“-Veröffentlichung,
- Sitzungs-/TOP-Kontext,
- Veröffentlichung erzeugt gültigen statischen K0-Stand,
- stabile URLs und Teilen,
- Suche,
- PWA-Grundfunktionen,
- Demonstrator-Regressionstestkorpus,
- Datenschutz-/Schutzklassen-Gates,
- KI-Kosten-/Routingprotokollierung.

## 9. Phase F – Umschaltung / Go-live

Voraussetzungen:

- G10-Abnahmekriterien erfüllt,
- Restore-Test Issue #3 abgeschlossen,
- keine offenen P1/P2-Migrationsfehler,
- vollständiger finaler Datenabgleich,
- verantwortliche Zieladmins bestätigen Betriebsfähigkeit.

Ablauf:

1. finalen Quellstand einfrieren,
2. Delta bzw. finalen Export übernehmen,
3. letzten Integritätscheck durchführen,
4. öffentlichen Zielrelease erzeugen,
5. Domain/DNS bzw. produktiven Deploymentpfad auf Ziel umschalten,
6. Erreichbarkeit und Kernfunktionen unmittelbar prüfen,
7. alte Umgebung zunächst unverändert als Rückfallreferenz erhalten, aber Schreibbetrieb deaktiviert lassen.

## 10. Rückfall und Wiederholung

### Vor Go-live

Bei Fehlern:

- Zielumgebung verwerfen oder zurücksetzen,
- Ursache dokumentieren,
- Runbook/Automatisierung korrigieren,
- Migration vollständig wiederholen.

### Nach Umschaltung

Bei kritischem Fehler:

- neuen fehlerhaften Release nicht weiterverwenden,
- falls möglich auf letzten gültigen öffentlichen Stand zurückrollen,
- Schreibzugriffe bei Integritäts-/Sicherheitszweifel stoppen,
- Quelle und Ziel nicht parallel beschreibbar halten,
- Rückfallentscheidung dokumentieren.

Ein Rückfall auf die alte Entwicklungsumgebung nach bereits erfolgten produktiven Schreibvorgängen ist nur zulässig, wenn Datenkonsistenz und Verlustfreiheit explizit geklärt sind.

## 11. Verantwortlichkeiten

### Entwicklungsseite vor Übergabe

- reproduzierbaren Quellstand liefern,
- Migration/Runbook technisch unterstützen,
- Quell-Dumps und Konfigurationsinventar bereitstellen,
- Tests und Migrationsfehler analysieren.

### GRÜNEN-Seite / Zielbetrieb

- organisationskontrollierte Konten/Zugänge bereitstellen,
- mindestens zwei Admins benennen,
- Domain/Hosting/Providerzugänge kontrollieren,
- Zielbetrieb und laufende Kosten übernehmen,
- Go-live fachlich/betrieblich bestätigen.

### Gemeinsam

- Datenabgleich,
- End-to-End-Abnahme,
- Restore-/Backupnachweis,
- Übergabeprotokoll,
- Abschalten persönlicher produktiver Abhängigkeiten.

## 12. Übergabeprotokoll

Zum Abschluss werden mindestens dokumentiert:

- Datum/Uhrzeit der Umschaltung,
- Quellcommit/Release,
- Datenexportstand,
- Zielprojekt-/Umgebungsreferenzen ohne Secrets,
- verantwortliche Admins,
- Ergebnis aller Prüfgates,
- bekannte Restpunkte,
- Status alter Umgebung,
- Bestätigung, dass keine zwingende persönliche Betriebsabhängigkeit mehr besteht.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G9-Migrations-Runbook mit Zielvorbereitung, Schema-/Datenübernahme, Betriebsaktivierung, End-to-End-Prüfung, Go-live, Rückfall und Verantwortlichkeiten angelegt. |
