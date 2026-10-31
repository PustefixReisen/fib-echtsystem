# FIB – wiederverwendbare Release-Sicherung

Version 1.0 · 31.10.2026 · Josef Walter, mit KI-Unterstützung

Diese Routine erweitert PR #358 für alle FIB-Releases. Sie ist vorbereitet,
aber weder auf Shared-Apps noch IONOS ausgeführt. Der Deployment-Workflow bleibt
manuell und zusätzlich über `FIB_BACKUP_READY` gesperrt. Diesen PR zunächst prüfen;
kein Merge und kein Workflow-Aufruf sind Teil einer Betriebsaktivierung.

## Komponenten und privater Ablauf

Ein Operator arbeitet im Repository mit PostgreSQL-17-Client und bestehenden
Verwaltungszugängen. Alle Ausgaben außerhalb Git, Verzeichnis 0700/Dateien 0600.
Keine Dumps, Funktionskonfigurationen oder Exportdaten in Actions-Artefakte laden.

Ein privates Bundle enthält:

- `database/`: unverändertes Snapshot-Dumpwerkzeug aus PR #358; fib.dump,
  manifest.json, auth-ids.json. Daten, ACLs und RLS, keine Auth-Geheimnisse.
- `edge/inventory.json`: Liste aller tatsächlich bereitgestellten FIB-Funktionen
  mit slug, version, verify_jwt. Pro Funktion `edge/SLUG/index.ts` und sämtliche
  relativen Module/Import-Maps exportieren. Keine Memorix-Funktionen exportieren.
- `frontend/`: vollständiger lesender SFTP-Download von `redaktion/`, einschließlich
  versteckter Dateien und aller Assets; mindestens index.html. Remote-Verzeichnis
  und Hostschlüssel vorher prüfen. Öffentlicher HTTP-Abruf ersetzt diesen Export nicht.
- `configuration/state.json`: bisherige FIB-Featurezustände und amtliche Quellenflags;
  keine gemeinsamen Secrets oder Passwörter exportieren. Fehlende Zugänge: stoppen.
- `configuration/evidence.json`: voller Ziel-Release-Commit unter `commit` und
  `databaseRestore`, `edgeExport`, `frontendExport`, `configurationCapture` jeweils
  true **erst nach tatsächlicher Prüfung**. Privates ergänzendes Operatorprotokoll
  mit Zeit, Quellversionen, Umfang, Restore-Ziel und Prüfer beifügen.

Edge-/Frontend-/Konfigurationsexporte sind in dieser Version bewusst manuelle,
verpflichtende Operator-Schritte. Die Routine behauptet keine automatisierte
Erfassung oder unabhängige Prüfung ihrer Vollständigkeit. Alle Bundle-Dateien
werden anschließend einzeln gehasht; die Release-Prüfsumme bindet das Manifest.

Nach Vorbereitung dieser privaten Exporte:

```bash
export FIB_BACKUP_ROOT=/privater/pfad/release-bundle
export FIB_RELEASE_COMMIT=VOLLSTAENDIGER_ZIEL_COMMIT
# Maintenance-Verbindung privat aus bestehendem Passwortmanager bereitstellen.
bash scripts/backup/create.sh
```

Das Skript erzeugt den Datenbankteil und versiegelt das Bundle. Bei jedem Fehler
kein Deployment. Fehlgeschlagene Bundles nicht wiederverwenden; neue leere Ablage
und neue Exporte verwenden. Ein Hash ist kein tatsächlicher Restore-Nachweis.

## Externe Ablage und Actions

Vorhandene private Nextcloud-/Back-In-Time-Kette nach ADR-010/011 weiterverwenden.
Für Actions einen **geprüften rclone-crypt-Remote** namens `fibbackup` auf dieser
Ablage konfigurieren; keine neue Cloud nötig. Schreibzugang beim Operator,
Actions möglichst nur lesend. Schlüssel/Remote-Konfiguration im Secret
`FIB_BACKUP_RCLONE_CONFIG`, nie im Repository. Upload mit rclone copy, anschließend
in ein anderes privates Verzeichnis zurückladen und SHA-256-Prüfung ausführen.
Erst danach Backup-ID und SHA-256 von release.json für den Workflow verwenden.

Der Workflow verlangt Environment `fib-release` mit geprüften Berechtigungen und
Variable `FIB_BACKUP_READY=true`. Ohne sie bleibt er gesperrt. Environment-Schutz
und Secretzugriff organisatorisch prüfen. Download wird privat temporär gehalten
und auch bei Fehlern entfernt; keine Artifact-Uploads. Bundle muss zum exakten
Workflow-Commit passen und höchstens eine Stunde alt sein. Während Erfassung,
Prüfung und Deployment FIB-Wartungsfenster einhalten; konkurrierende Deployments
werden durch die bestehende Workflow-Concurrency verhindert. Andere Operatoren
müssen ebenfalls das Wartungsfenster beachten.

Bestehende Secret-Referenzen geprüft: IONOS_SFTP_HOST/USER/PASSWORD für Veröffentlichung;
VITE_SUPABASE_URL/PUBLISHABLE_KEY für öffentlichen Frontend-Build. Werte nicht gelesen.
Tatsächliche Secret-Namen/Verfügbarkeit kann der GitHub-Connector nicht administrativ
auflisten; daher kein Nachweis, dass neue oder bestehende Secrets bereitstehen.
Neu erforderlich: private Backup-Remote-Konfiguration, Environment/Variable,
bestehender Maintenance-Zugang beim Operator und vollständiger SFTP-Lesezugriff.
Keine Secrets angelegt oder geändert. Fehlende Rechte/Verbindungen stoppen den Ablauf.

## Komponentenweise Wiederherstellung

Jede Wiederherstellung benötigt konkrete Freigabe und geprüftes Bundle. Erst
FIB-Schreibzugriffe stoppen und aktuellen Zustand sichern. Niemals Shared-Apps
insgesamt zurücksetzen oder Auth/Memorix wiederherstellen.

Frontend: `frontend/` nach geprüftem SFTP-Ziel redaktion/ zurückspielen, erst nach
vollständiger Bestandsprüfung spiegeln/löschen. Quellen und Featurewerte nur anhand
des privaten Vorzustands und nach Driftprüfung zurücknehmen.

Edge: jeweils gesicherte FIB-Dateien inklusive Shared-Modulen bereitstellen und
verify_jwt exakt aus inventory.json erhalten. Auth-/Runtime-Secrets nicht ändern.

Datenbank: zunächst Custom-Dump mit pg_restore --list prüfen. Danach ausschließlich
in isolierter PostgreSQL-17-Datenbank wiederherstellen, Rollen ohne echte Passwörter
und Auth-FK-Platzhalter verwenden. Prüfverfahren in
`tests/u4/fib-schema-restore.mjs` aus PR #358: Tabellenzählungen, Runtime-ACL/RLS und
unveränderte fremde Daten prüfen. Dieses Testskript ist kein Shared-Apps-Recoverybefehl.
Erst danach fachlich eingegrenzten FIB-Recoveryplan erstellen; kein automatisches
--clean oder DROP SCHEMA gegen Shared-Apps. auth-ids.json ist keine Auth-Sicherung.

## Nachweise und Grenzen

Automatisierte Bundle-Tests prüfen Manipulation, fehlende Komponenten, Symlinks,
Hashabweichungen, falschen Commit und Ablaufzeit. Bestehende PG16/17-CI prüft weiterhin
Dump/Restore sowie fehlende Runtime-Rechte. Neue Transfer-/SFTP-/Secretfehler sind
fail-closed im Workflow, aber mangels Zugängen nicht gegen reale Dienste getestet.

Die vorhandene Datei `~/FIB-Backups/fib-vor-ris-20261031.dump` liegt nur beim Auftraggeber:
29 Tabellen, PG17, SHA-256 laut Auftrag geprüft; tatsächlicher Restore noch offen.
Sie ist kein vollständiges Release-Bundle und hier nicht zugänglich. Nicht erneut
als bereits wiederhergestellt ausgeben. Für die aktuelle RIS-Bereitstellung fehlen
weiterhin vollständige private Exporte, tatsächlicher Restore und externe Ablageprüfung.
