# ADR-011 – Shared-Apps, Schema-Isolation und pustivo-Betrieb

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB soll nicht in einem eigenen Supabase-Projekt betrieben werden. Für pustivo steht das bestehende Supabase-Projekt `Shared-Apps` zur Verfügung. Dort liegt Memorix historisch im Schema `public`; diese bestehende Struktur wird während der laufenden Entwicklung nicht ohne konkreten Nutzen umgebaut.

FIB soll auf dem pustivo-Webspace so aufgebaut werden, dass die Umgebung bereits produktionsnah bzw. dauerhaft produktionsfähig ist. Ein späterer Umzug auf Infrastruktur der GRÜNEN bleibt möglich, ist aber keine Voraussetzung für den produktiven Betrieb.

Zugleich gelten folgende Schutzanforderungen:

- FIB und Memorix dürfen sich fachlich oder technisch nicht unbeabsichtigt beeinflussen,
- spätere pustivo-Anwendungen sollen gleichartig isoliert werden,
- FIB-Daten müssen unabhängig sicherbar und wiederherstellbar sein,
- Authentifizierung darf gemeinsam genutzt werden, Autorisierung bleibt anwendungsspezifisch,
- Datei-/Bildspeicher und Datenbank-Backups müssen voneinander getrennte Zugriffswege besitzen.

## Entscheidung

### 1. Shared-Apps als gemeinsame Supabase-Plattform

FIB verwendet das bestehende Supabase-Projekt `Shared-Apps`.

Es wird **kein separates FIB-Supabase-Projekt** vorausgesetzt.

Die Anwendungstrennung erfolgt innerhalb PostgreSQL über eigene Anwendungsschemata und Least-Privilege-Rechte.

### 2. Schema-Regel für pustivo-Anwendungen

Für neue pustivo-Anwendungen gilt:

> **Jede Anwendung erhält grundsätzlich ein eigenes PostgreSQL-Schema.**

Für FIB lautet dieses Schema:

`fib`

Memorix verbleibt bis auf Weiteres im bestehenden Schema `public`. Eine Migration von Memorix aus `public` erfolgt nur bei einem später nachgewiesenen fachlichen, sicherheitsbezogenen oder betrieblichen Nutzen.

Spätere Anwendungen erhalten eigene Schemas und dürfen nicht standardmäßig auf `fib` oder andere Anwendungsschemata zugreifen.

**Legacy-Ausnahme:** `public.fib_ai_daily_usage` gehört zum alten öffentlichen FIB-„Mehr wissen?“-Demonstrator und nicht zum Echtsystem. Sie bleibt solange unangetastet, wie der Demonstrator sie noch benötigt. Die Bereinigung ist in GitHub Issue #5 mit Wiederaufnahme-Kriterium dokumentiert. Neue Echtsystem-FIB-Objekte werden ausschließlich im Schema `fib` angelegt.

### 3. Keine fachlichen Querabhängigkeiten

Zwischen `fib` und `public`/Memorix werden grundsätzlich keine fachlichen Kopplungen angelegt.

Insbesondere nicht vorgesehen sind:

- Foreign Keys von `fib` nach `public` oder umgekehrt,
- FIB-Views über Memorix-Tabellen,
- Memorix-Views über FIB-Tabellen,
- Trigger einer Anwendung auf Tabellen einer anderen Anwendung,
- gemeinsam genutzte fachliche Funktionen mit Schreibzugriff auf mehrere Anwendungsschemata,
- implizite Abhängigkeiten über Tabellen- oder Sequenznamen anderer Anwendungen.

Gemeinsame Supabase-Systemschemas wie `auth` bleiben davon unberührt.

### 4. Technische Rechte-Isolation

Ein eigenes Schema allein genügt nicht als Sicherheitsgrenze.

FIB erhält deshalb einen eigenen serverseitigen Datenbankzugang bzw. eine eigene technische Rolle mit Least Privilege. Dieser Zugang erhält ausschließlich die für FIB erforderlichen Rechte auf `fib` und ausdrücklich benötigte Supabase-Systemfunktionen.

Der normale FIB-Fachbetrieb verwendet **nicht** den projektweit privilegierten `service_role` als allgemeines Datenbankkonto.

Der projektweite `service_role` bzw. vergleichbar privilegierte Zugänge bleiben auf notwendige technische Administrations-/Supabase-Sonderfälle beschränkt und dürfen nicht als normale FIB-Fachautorisierung dienen.

Implementiert sind:

- Gruppenrolle `fib_runtime` ohne Login, Superuser-, CreateDB-, CreateRole-, Replication- oder `BYPASSRLS`-Rechte,
- Loginrolle `fib_app`, die ausschließlich `fib_runtime` erbt,
- Objektprivilegien nur im Schema `fib`,
- keine FIB-spezifischen Tabellen-/Sequenz-/Funktionsrechte in `public`,
- keine Data-API-Rechte von `anon`, `authenticated` oder `service_role` auf `fib`,
- RLS auf den FIB-Tabellen mit expliziten Policies ausschließlich für `fib_runtime`.

PostgreSQL gewährt Schema-`USAGE` auf `public` projektweit über die Rolle `PUBLIC`. Dies allein erlaubt jedoch keinen Tabellenzugriff. Der Isolationstest prüft daher die tatsächlich sicherheitsrelevanten Objektprivilegien. Für `public.events` wurde verifiziert, dass `fib_app` weder `SELECT`, `INSERT`, `UPDATE` noch `DELETE` besitzt; für `fib.events` bestehen die vorgesehenen FIB-Rechte.

Ziel bleibt:

> **Ein Fehler in FIB-Code darf technisch nicht ausreichen, um Memorix-/`public`-Daten zu verändern.**

Ein echter Login-Laufzeittest mit `fib_app` wird nach sicherer Vergabe des Runtime-Secrets auf pustivo durchgeführt. Die Supabase-Connector-Administrationsverbindung kann nicht per `SET ROLE` in `fib_app` wechseln und ersetzt diesen späteren Credential-Test daher nicht.

### 5. Gemeinsames Supabase Auth, getrennte Autorisierung

`Shared-Apps` verwendet projektweit Supabase Auth. FIB nutzt denselben Identitätsdienst.

Ein Eintrag in `auth.users` bedeutet jedoch **keine FIB-Berechtigung**.

FIB führt eine eigene anwendungsspezifische Benutzer-/Rollenzuordnung im Schema `fib`, z. B. `fib.app_users`.

Nur Benutzer mit aktiver FIB-Zuordnung erhalten FIB-Zugriff.

Fachliche FIB-Rollen werden nicht aus benutzeränderbarem `user_metadata` abgeleitet.

Für FIB gilt im MVP:

- Anmeldung per E-Mail/Passwort,
- TOTP-MFA für Redakteure und Admins gemäß G6,
- keine offene Selbstregistrierung,
- keine Social-Login-Abhängigkeit als MVP-Voraussetzung.

Projektweite Auth-Einstellungen wie Redirect-Allowlist, Mailtemplates oder aktivierte Provider werden so verwaltet, dass andere Anwendungen nicht unbeabsichtigt gestört werden.

### 6. Nextcloud auf pustivo als möglicher dauerhafter Storage

Auf dem pustivo-Webspace soll eine Nextcloud als gemeinsamer technischer Storage für pustivo-Anwendungen betrieben werden, sofern der IONOS-Tarif und die technische Installation dies erlauben.

FIB erhält darin einen eigenen logisch und berechtigungsseitig getrennten Bereich.

Die FIB-Anwendung greift nicht über ein persönliches Nextcloud-Konto zu, sondern über einen eigenen technischen Zugang/App-Passwort.

Die Datenbank speichert logische Storage-Referenzen, keine dauerhaft fachlich bindenden vollständigen Nextcloud-URLs.

### 7. Getrennte Storage- und Backup-Zugänge

Normale FIB-Dateizugriffe und Datenbank-Backups werden technisch getrennt.

Vorgesehen sind mindestens:

- ein FIB-Storage-Zugang für Originale, Bilder, Dokumente und Rechte-/Nachweisdateien,
- ein separater Backup-Zugang für Datenbank-Dumps.

Der normale FIB-Anwendungszugang erhält keinen Lösch-/Schreibzugriff auf den Backup-Bereich.

Damit kann ein kompromittierter oder fehlerhafter FIB-Anwendungsprozess nicht zugleich seine eigenen Backups verändern oder löschen.

### 8. Eigenständiges FIB-Backup

FIB-Daten werden schemaweise unabhängig von Memorix gesichert.

Für den Datenbank-Backupweg wird das Schema `fib` gezielt exportiert. Der Dump soll keine Memorix-/`public`-Fachdaten enthalten.

Zielkette:

```text
Shared-Apps / Schema fib
        ↓
 täglicher schema-spezifischer Dump
        ↓
 Nextcloud / FIB-Backupbereich
        ↓
 lokaler Nextcloud-Sync
        ↓
 Back In Time
```

Der Restore-Test muss nachweisen, dass `fib` eigenständig wiederherstellbar ist und andere Anwendungsschemata nicht Bestandteil des FIB-Restores sind.

### 9. pustivo als möglicher dauerhafter Produktivbetrieb

pustivo ist nicht nur Wegwerf-Pilotinfrastruktur.

FIB wird dort so betrieben, als könne diese Umgebung dauerhaft produktiv bleiben:

- reproduzierbares Deployment,
- Backup/Restore,
- Monitoring,
- Secrets-Trennung,
- isolierte Anwendungsschemata,
- anwendungsspezifische technische Zugänge,
- portabler Storage-Adapter,
- dokumentierte Betriebsverfahren.

Ein späterer Umzug auf GRÜNEN-Infrastruktur bleibt möglich und wird durch portable Architektur unterstützt, ist aber keine zwingende Voraussetzung für den Go-live.

## Nicht gewählt

### Eigenes Supabase-Projekt nur für FIB

Nicht erforderlich, solange Schema-, Rollen- und Zugriffsisolation in `Shared-Apps` technisch nachweisbar umgesetzt werden.

### Migration von Memorix aus `public` ohne konkreten Anlass

Nicht gewählt, da sie ein bestehendes System verändern würde, ohne für FIB unmittelbar notwendig zu sein.

### Ein gemeinsames technisches Konto für alle pustivo-Anwendungen

Nicht gewählt, weil dadurch ein Anwendungsfehler Zugriff auf Daten anderer Anwendungen ermöglichen könnte.

### Ein gemeinsamer Nextcloud-Zugang für FIB-Dateien und Backups

Nicht gewählt, weil ein kompromittierter Anwendungszugang sonst auch Backups verändern oder löschen könnte.

## Konsequenzen

- Das Schema `fib` und die grundlegende DB-Rollen-/Grant-Isolation sind in `Shared-Apps` angelegt.
- FIB-Auth-Zuordnungen liegen im Schema `fib`; `auth.users` bleibt projektweit gemeinsam.
- U1/U5 müssen schema-spezifische Backup-/Restore-Skripte bereitstellen.
- Storage-Adapter und Nextcloud-Zugang werden anwendungsspezifisch konfiguriert.
- G7/G9/G10 werden so interpretiert, dass pustivo selbst dauerhafter Produktivbetrieb sein kann; Migration auf GRÜNEN-Infrastruktur ist eine mögliche, nicht zwingende spätere Betriebsentscheidung.
- Isolation zwischen `fib`, `public` und späteren Anwendungsschemata bleibt Bestandteil technischer Integrations- und Sicherheitstests.
- GitHub Issue #5 verfolgt die spätere Bereinigung der Legacy-Demonstrator-Tabelle `public.fib_ai_daily_usage`.
