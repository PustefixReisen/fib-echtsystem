# ADR-008 – CI/CD und Deployment

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB veröffentlicht öffentliche Inhalte nach ADR-003 als versionierten, statischen K0-Stand. Zusätzlich werden Redaktions-App, Fachservices, Datenbankmigrationen, Edge Functions und Konfiguration weiterentwickelt. Für den Pilotbetrieb wird die öffentliche Seite zunächst auf Entwickler-/IONOS-Infrastruktur betrieben; später muss dieselbe Software ohne Architekturumbau auf die Infrastruktur der GRÜNEN Feldkirchen umziehen können.

Daraus ergeben sich zwei unterschiedliche Änderungsarten:

1. **Softwareänderung** – Code, Datenbankschema, Fachservices, Redaktions-App, Tests oder Buildlogik ändern sich.
2. **Inhaltsveröffentlichung** – fachlich freigegebene K0-Inhalte werden als neuer öffentlicher Stand veröffentlicht, ohne dass sich der Anwendungscode ändern muss.

Beide Wege müssen nachvollziehbar, reproduzierbar und fehlertolerant sein.

## Entscheidung

### 1. GitHub Actions als CI/CD-Zentrale

Für das MVP wird **GitHub Actions** als zentrale Automatisierungsplattform für Build, Test und Deployment verwendet.

Gründe:

- Repository und Projektdokumentation liegen bereits in GitHub,
- Workflows werden versioniert mit dem Code verwaltet,
- Tests und Build können vor einem Deployment zwingend vorgeschaltet werden,
- unterschiedliche Zielumgebungen lassen sich über Konfiguration und Secrets trennen,
- der erzeugte öffentliche Build bleibt vom konkreten Webhoster unabhängig.

Ein zusätzlicher eigener CI-Server wird im MVP nicht betrieben.

### 2. Trennung von Software-CI und Inhalts-Publish

#### A. Software-CI

Bei Pull Request bzw. Änderung am Hauptzweig werden mindestens ausgeführt:

1. Abhängigkeiten reproduzierbar installieren,
2. statische Prüfungen/Lint/Typecheck,
3. automatisierte Tests,
4. FIB-Regressionstests, soweit für die Änderung relevant,
5. Astro-/Anwendungs-Build,
6. Prüfung auf unbeabsichtigte Secrets bzw. ungeeignete öffentliche Konfiguration,
7. bei Datenbank-/Backendänderungen passende Migrations-/Serviceprüfungen.

Eine fehlerhafte Prüfung blockiert das zugehörige Deployment.

#### B. Inhalts-Publish

Eine S3-Freigabe erzeugt einen versionierten öffentlichen K0-Stand. Der Publish-Prozess stößt anschließend einen Build für genau diese Releasekennung an.

Der Workflow:

```text
S3-Freigabe
   ↓
versionierter K0-Snapshot / Release-ID
   ↓
GitHub-Actions-Publish-Workflow
   ↓
Snapshot + freigegebene Medien laden
   ↓
Astro Static Build
   ↓
öffentlicher Suchindex / Sitemap / PWA-Artefakte
   ↓
Validierung / Smoke Tests
   ↓
versioniertes Deployment-Paket
   ↓
Deploy auf Zielumgebung
   ↓
Nachprüfung
```

Der Workflow erhält nur den für den Build notwendigen freigegebenen K0-Stand. K1/K2-Inhalte dürfen nicht als Buildinput in ein öffentliches Deployment-Artefakt gelangen.

### 3. Build once, deploy the same artifact

Ein erfolgreich geprüfter öffentlicher Build wird als eindeutig versioniertes Deployment-Artefakt behandelt.

> **Dasselbe geprüfte Artefakt wird ausgeliefert; auf dem Zielserver wird kein zweiter unabhängiger Produktions-Build durchgeführt.**

Dadurch wird vermieden, dass Pilot-, Produktiv- oder Wiederherstellungsdeployment aufgrund unterschiedlicher Laufzeitumgebungen unterschiedliche Ergebnisse erzeugen.

Das Artefakt enthält nur öffentliche K0-Daten und öffentliche Assets.

### 4. Deploymentziele sind austauschbar

Das Deployment wird über einen kleinen Zieladapter bzw. klar gekapselten Workflow-Schritt ausgeführt.

Für den Pilotbetrieb ist vorgesehen:

- Übertragung des geprüften statischen Artefakts auf IONOS-Webspace über **SFTP/SSH** oder eine gleichwertig sichere unterstützte Methode.

Für den späteren GRÜNEN-Zielbetrieb:

- dasselbe Buildartefakt,
- andere Zielkonfiguration/Secrets,
- geeignete organisationskontrollierte Upload-/Deploymentmethode.

Fachlogik, Build und öffentliche URLs dürfen nicht an IONOS gebunden werden.

### 5. Atomarer bzw. umschaltbarer Deploy

Ein Deployment darf die aktuell funktionierende öffentliche Seite nicht schrittweise überschreiben.

Vorzugsmodell:

1. neues Artefakt in separates Releaseverzeichnis übertragen,
2. Vollständigkeit/Releasekennung prüfen,
3. öffentlichen Zielpfad kontrolliert auf das neue Release umschalten,
4. vorheriges Release für Rollback vorhalten.

Falls der spätere Zielwebserver keine echte atomare Umschaltung unterstützt, wird ein technisch gleichwertiges Verfahren verwendet, das einen gemischten Alt-/Neustand verhindert.

### 6. Rollback

Mindestens das zuletzt funktionierende öffentliche Release muss schnell wieder aktivierbar sein.

Rollback verwendet ein bereits erfolgreich geprüftes Deployment-Artefakt und erzeugt keinen neuen fachlichen Datenstand.

Fachlich gilt weiterhin der im FIB-System gespeicherte Publikations-/Releaseverlauf als Nachweis.

### 7. Umgebungen

Es werden mindestens logisch getrennt:

- `development`,
- `pilot`,
- `production`.

Zieladressen, Supabase-Projekte, Storage-Zugänge und Secrets werden umgebungsbezogen konfiguriert.

Wo GitHub-Environment-Funktionen im jeweiligen Repository-/Tarifmodell verfügbar und sinnvoll sind, werden sie für Secret-Trennung und Deployment-Gates genutzt. Die FIB-Sicherheit darf jedoch nicht von kostenpflichtigen GitHub-Schutzfunktionen abhängen; notwendige Freigabe- und Prüfregeln müssen auch über Workflow, Branch-/Reviewprozess und FIB-eigene S3-Freigabe wirksam bleiben.

### 8. Secrets

Secrets gehören weder in Repositorydateien noch in erzeugte öffentliche Artefakte.

Insbesondere:

- KI-API-Schlüssel,
- Supabase Secret/Service-Schlüssel,
- SFTP-/SSH-Zugangsdaten,
- Webhook-/Deploytokens,
- interne Storage-Credentials

werden ausschließlich in geeigneter Secret-Verwaltung der jeweiligen Umgebung gehalten.

Öffentliche/publishable Konfigurationswerte werden ausdrücklich von echten Secrets getrennt.

### 9. Keine automatische Veröffentlichung nur wegen Code-Push

Ein Software-Commit ist keine fachliche Veröffentlichung.

Umgekehrt muss eine neue fachlich freigegebene Meldung keinen neuen Code-Commit erzeugen.

Damit bleiben zwei Verantwortlichkeiten sauber getrennt:

- **Codefreigabe** entscheidet über die Softwareversion,
- **S3-Freigabe** entscheidet über öffentliche Inhalte.

Der Publish-Workflow kombiniert jeweils eine freigegebene Softwareversion mit einem eindeutig freigegebenen K0-Inhaltsstand.

### 10. Nachprüfung

Nach einem öffentlichen Deploy werden mindestens automatisch geprüft:

- Website erreichbar,
- Releasekennung stimmt,
- zentrale Seiten/Navigation erreichbar,
- Suchindex/Manifest/Sitemap vorhanden,
- keine offensichtlichen Buildfehler,
- repräsentative Ziel-URLs funktionieren.

Schlägt die Nachprüfung fehl, wird der Deploy als fehlerhaft markiert und ein Rollback muss möglich sein.

## Konsequenzen

### Vorteile

- keine eigene CI-Infrastruktur nötig,
- klare Trennung von Code und redaktioneller Veröffentlichung,
- reproduzierbare Builds,
- IONOS bleibt austauschbares Pilotziel,
- einfacherer späterer Umzug auf GRÜNEN-Infrastruktur,
- fehlerhafte Builds beschädigen nicht den laufenden öffentlichen Stand,
- Rollback ist technisch und organisatorisch nachvollziehbar.

### Aufwand

- Workflows und Secrets müssen sauber gepflegt werden,
- Publish-Service und GitHub Actions benötigen einen kontrollierten Auslöseweg,
- atomare Umschaltung muss für den jeweiligen Webserver konkret umgesetzt werden,
- Datenbankmigrationen und Frontend-/Backend-Deployments benötigen in der Umsetzung zusätzliche Tests und Reihenfolgeregeln.

## Abgrenzung

Dieses ADR legt die Architektur und den Ablauf fest, nicht bereits die endgültigen Workflow-Dateien, SSH-Kommandos oder GitHub-Repository-Schutzregeln. Diese werden in der Umsetzungsphase erstellt und getestet.

Die konkrete Repository-/Package-Struktur wird in einer eigenen G5-Entscheidung festgelegt.
