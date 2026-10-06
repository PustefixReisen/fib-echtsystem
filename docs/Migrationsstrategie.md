# Migrationsstrategie – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für die spätere technische Überführung des FIB-Echtsystems von der Entwicklungs-/Pilotinfrastruktur auf die Infrastruktur der GRÜNEN Feldkirchen.

## 2. Zielbild

FIB wird zunächst vollständig produktionsreif auf der Infrastruktur des Entwicklers aufgebaut und erprobt.

Die spätere Zielumgebung besteht aus organisationskontrollierten Betriebsbestandteilen:

- Webserver unter Verantwortung der GRÜNEN,
- eigenes Supabase-Projekt unter Verantwortung der GRÜNEN,
- Datei-/Bildspeicher unter Organisationskontrolle,
- GitHub-/Repository-Zugriff so, dass Betrieb und Weiterentwicklung nicht von einem privaten Einzelkonto abhängen,
- KI-Providerkonten/API-Zugänge unter Organisationskontrolle,
- Backupziel und Wiederherstellungszugänge unter Organisationskontrolle,
- Monitoring-/Warn- und Mailkanäle unter Organisationskontrolle,
- Domains, Redirects, Secrets und Administrationszugänge unter Organisationskontrolle.

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
- Secrets niemals fest im Quellcode,
- produktive Abhängigkeiten austauschbar bzw. über klar dokumentierte Adapter/Konfiguration angebunden.

## 4. Entwicklungs- und Zielbetrieb

Bis zur Übergabe kann FIB auf der Infrastruktur des Entwicklers vollständig produktionsreif entwickelt und getestet werden.

Die spätere GRÜNEN-Umgebung wird vor dem Go-live als neue, noch wegwerfbare Zielumgebung aufgebaut. Solange dort keine eigenständigen produktiven Daten oder redaktionellen Änderungen entstanden sind, kann eine fehlgeschlagene Migration verworfen und wiederholt werden.

Nach dem Go-live gilt dieses Reset-Prinzip nicht mehr.

## 5. Migrationsverfahren

Die Migration wird als wiederholbarer Prozess geplant und dokumentiert. Sie umfasst mindestens:

1. Ziel-Webserver vorbereiten,
2. neues Supabase-Zielprojekt anlegen,
3. Ziel-Datei-/Bildspeicher vorbereiten,
4. Repository-/CI/CD-Zugänge organisationskontrolliert bereitstellen,
5. Datenbankschema und Datenbanklogik aus dem Repository herstellen,
6. produktive Daten übertragen,
7. Auth-Daten soweit erforderlich übertragen,
8. Storage-Dateien übertragen,
9. Edge Functions bzw. Backend-Funktionen deployen,
10. Umgebungsvariablen und Secrets setzen,
11. KI-Provider-/Routing-Konfiguration und API-Zugänge setzen,
12. Backup, Monitoring und Warnkanäle einrichten,
13. Domains, Redirect-URLs, Mail-, Push- und sonstige projektspezifische Einstellungen konfigurieren,
14. technische und fachliche Abnahme durchführen,
15. erst danach die GRÜNEN-Umgebung produktiv schalten.

## 6. Kein separater Migrations-Probelauf

Ein eigener Migrations-Probelauf auf einer zusätzlichen Testzielumgebung ist nicht verbindlich erforderlich.

Stattdessen gilt:

> **Die eigentliche Migration muss reproduzierbar, dokumentiert und bis zum Go-live wiederholbar sein.**

Wenn die erste Migration in die GRÜNEN-Zielumgebung nicht korrekt verläuft, kann die Zielumgebung vor dem Go-live zurückgesetzt und die korrigierte Migration erneut ausgeführt werden.

## 7. G9-Abgrenzung

G9 liegt in der Gründungsphase und findet **vor** der eigentlichen Produktentwicklung U1–U6 statt. Deshalb wird in G9 noch keine reale Migration durchgeführt.

G9 erstellt und prüft das ausführbare Migrations-Runbook einschließlich:

- Voraussetzungen und Zugänge,
- Reihenfolge aller Migrationsschritte,
- benötigte Exporte und Importverfahren,
- Konfigurationswerte, die neu gesetzt werden müssen,
- Prüfschritte nach jedem Teilabschnitt,
- Abbruch- und Wiederholungslogik,
- Go-live-Checkliste,
- Verantwortlichkeiten auf Entwickler- und GRÜNEN-Seite.

Die tatsächliche Migration erfolgt erst nach der technischen Umsetzung und Pilotierung im Go-live-Kontext von U6/G10.

## 8. Abnahme nach Migration

Vor der Produktivschaltung werden mindestens geprüft:

- öffentliche Inhalte vollständig und korrekt,
- stabile URLs und Routing,
- Benutzerkonten und Rollen,
- MFA, RLS/Policies und Freigabeworkflow,
- Storage und Bilder,
- Quellenmonitor und KI-Funktionen,
- KI-Router, Providerfreigaben und Kosten-/Routing-Konfiguration,
- PWA und Push, soweit im Produktivumfang aktiviert,
- Mail-/Benachrichtigungsfunktionen,
- SEO-/Sitemap-Funktionen,
- Logging, Monitoring, Backup und Restore,
- Secrets und Administrationszugänge,
- Repository/CI/CD organisationskontrolliert,
- keine verbliebene produktive Abhängigkeit von persönlichen Entwicklerkonten.

## 9. Bezug zu G5–G10

G5 legt die portable Zielarchitektur fest. G7 definiert Betrieb, Backup und Wiederherstellung. G9 konkretisiert daraus den Migrationsweg als ausführbares Runbook. U1–U6 implementieren und pilotieren das System. Die reale Migration und abschließende Abnahme erfolgen im Go-live-Kontext; G10 enthält die dafür erforderlichen Gates.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 06.10.2026 | G9 gegenüber realer Migration abgegrenzt; Organisationskontrolle auf Repository, Storage, KI-Provider, Backup, Monitoring/Mail und Adminzugänge erweitert; Migrationsumfang und Abnahmekriterien an G5–G7 angepasst. |
| 1.0 | 01.10.2026 | Grundsatz festgelegt: produktionsreife Entwicklung auf Entwickler-Infrastruktur, späterer Umzug auf GRÜNEN-Webserver plus eigenes Supabase-Projekt, kein Supabase-Self-Hosting, keine persönliche technische Bindung, wiederholbare Migration mit Runbook statt separatem Migrations-Probelauf. |
