# Migrationsstrategie – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 01.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für die spätere technische Überführung des FIB-Echtsystems von der Entwicklungs-/Pilotinfrastruktur auf die Infrastruktur der GRÜNEN Feldkirchen.

## 2. Zielbild

FIB wird zunächst vollständig produktionsreif auf der Infrastruktur des Entwicklers aufgebaut und erprobt.

Die spätere Zielumgebung besteht aus:

- einem Webserver unter Verantwortung der GRÜNEN,
- einem eigenen Supabase-Projekt unter Verantwortung der GRÜNEN,
- den für FIB erforderlichen Domains, Redirects, Secrets und Betriebszugängen unter Organisationskontrolle.

Eine selbst gehostete Supabase-Installation ist ausdrücklich **nicht** vorgesehen.

## 3. Architekturgrundsatz

FIB muss von Beginn an so entwickelt werden, dass die Anwendung ohne fachliche oder technische Neuentwicklung auf eine andere Träger-Infrastruktur übertragen werden kann.

Daraus folgt:

- keine hart codierten persönlichen Domains,
- keine hart codierten Supabase-Projekt-URLs oder Projekt-IDs,
- keine persönliche Accountbindung in Geschäftslogik oder Datenmodell,
- Konfiguration über Umgebungsvariablen bzw. gleichwertige externe Konfiguration,
- Datenbankschema, Funktionen, Policies, Trigger und sonstige Datenbanklogik versioniert und reproduzierbar,
- Edge Functions und sonstiger ausführbarer Backend-Code im Repository,
- Storage-Struktur und Zugriffsregeln dokumentiert,
- Auth-, Redirect-, Mail-, Push- und vergleichbare Projekteinstellungen dokumentiert,
- Secrets niemals fest im Quellcode.

## 4. Entwicklungs- und Zielbetrieb

Bis zur Übergabe kann FIB auf der Infrastruktur des Entwicklers vollständig produktionsreif entwickelt und getestet werden.

Die spätere GRÜNEN-Umgebung wird vor dem Go-live als neue, noch wegwerfbare Zielumgebung aufgebaut. Solange dort keine eigenständigen produktiven Daten oder redaktionellen Änderungen entstanden sind, kann eine fehlgeschlagene Migration verworfen und wiederholt werden.

Nach dem Go-live gilt dieses Reset-Prinzip nicht mehr.

## 5. Migrationsverfahren

Die Migration wird als wiederholbarer Prozess geplant und dokumentiert. Sie umfasst mindestens:

1. Ziel-Webserver vorbereiten,
2. neues Supabase-Zielprojekt anlegen,
3. Datenbankschema und Datenbanklogik aus dem Repository herstellen,
4. produktive Daten übertragen,
5. Auth-Daten soweit erforderlich übertragen,
6. Storage-Dateien übertragen,
7. Edge Functions bzw. Backend-Funktionen deployen,
8. Umgebungsvariablen und Secrets setzen,
9. Domains, Redirect-URLs, Mail-, Push- und sonstige projektspezifische Einstellungen konfigurieren,
10. technische und fachliche Abnahme durchführen,
11. erst danach die GRÜNEN-Umgebung produktiv schalten.

## 6. Kein separater Migrations-Probelauf

Ein eigener Migrations-Probelauf auf einer zusätzlichen Testzielumgebung ist nicht verbindlich erforderlich.

Stattdessen gilt:

> **Die eigentliche Migration muss reproduzierbar, dokumentiert und bis zum Go-live wiederholbar sein.**

Wenn die erste Migration in die GRÜNEN-Zielumgebung nicht korrekt verläuft, kann die Zielumgebung vor dem Go-live zurückgesetzt und die korrigierte Migration erneut ausgeführt werden.

## 7. Migrations-Runbook

Vor G9-Abschluss wird ein konkretes Runbook erstellt. Es enthält mindestens:

- Voraussetzungen und Zugänge,
- Reihenfolge aller Migrationsschritte,
- benötigte Exporte und Importverfahren,
- Konfigurationswerte, die neu gesetzt werden müssen,
- Prüfschritte nach jedem Teilabschnitt,
- Abbruch- und Wiederholungslogik,
- Go-live-Checkliste,
- Verantwortlichkeiten auf Entwickler- und GRÜNEN-Seite.

## 8. Abnahme nach Migration

Vor der Produktivschaltung werden mindestens geprüft:

- öffentliche Inhalte vollständig und korrekt,
- stabile URLs und Routing,
- Benutzerkonten und Rollen,
- RLS/Policies und Freigabeworkflow,
- Storage und Bilder,
- Quellenmonitor und KI-Funktionen,
- PWA und Push,
- Mail-/Benachrichtigungsfunktionen,
- SEO-/Sitemap-Funktionen,
- Logging, Monitoring, Backup und Restore,
- Secrets und Administrationszugänge,
- keine verbliebene Abhängigkeit von persönlichen Entwicklerkonten.

## 9. Bezug zu G5 und G9

G5 muss die Zielarchitektur so festlegen, dass diese Migrationsstrategie technisch unterstützt wird.

G9 konkretisiert dieses Dokument zu einem ausführbaren Migrations-Runbook und führt die tatsächliche Überführung auf die GRÜNEN-Infrastruktur durch.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 01.10.2026 | Grundsatz festgelegt: produktionsreife Entwicklung auf Entwickler-Infrastruktur, späterer Umzug auf GRÜNEN-Webserver plus eigenes Supabase-Projekt, kein Supabase-Self-Hosting, keine persönliche technische Bindung, wiederholbare Migration mit Runbook statt separatem Migrations-Probelauf. |
