# FIB – wiederverwendbare Release-Sicherung

Version 1.1 · 31.10.2026 · Josef Walter, mit KI-Unterstützung

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
Für Actions einen **geprüften rclone-crypt-Remote** namens `fib-backup-crypt` auf dieser
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


## Ergänzung: konkrete Sicherung und wiederverwendbare Erfassung

Der Auftraggeber hat die konkrete 29-Tabellen-Datei inzwischen verschlüsselt über
`fib-backup-crypt` (Basis `fib-nextcloud`) übertragen und zurückgeladen. Identische
SHA-256-Werte belegen den bitgenauen Dateitransport, noch keinen Datenbank-Restore.
Die bisherige Aussage über den offenen Restore bleibt bestehen.

Einmalig Docker auf dem Ubuntu-Rechner bereitstellen und anschließend im ausgecheckten
PR-Zweig folgenden Befehl ausführen (die bekannte Prüfsumme stammt aus dem bestätigten
Rückübertragungstest):

```bash
python3 scripts/backup/restore-local.py \
  "$HOME/FIB-Backups/fib-vor-ris-20261031.dump" \
  --sha256=091dbbd8322b538c6a570e51583d34604583df61ef7bdc869c62ab44026789f4 \
  --report="$HOME/FIB-Backups/restore-pruefung-20261031.json"
```

Der Bericht muss 29 Tabellen, aktivierte RLS und vorhandene Runtime-Leserechte zeigen.
Er enthält Tabellenzählungen für den Vergleich mit der Quelle. Der Container hat kein
Netzwerk, keine Host-Ports und wird samt Volumes auch bei Fehlern entfernt. Das Skript
akzeptiert ausschließlich eine vertrauenswürdige eigene Sicherung; PostgreSQL-Dumps
können ausführbaren SQL-Code enthalten. Es stellt zunächst Struktur/Daten wieder her,
legt ausschließlich lokale Auth-FK-Platzhalter aus diesen Daten an und validiert danach
Constraints und ACLs. Keine Verbindung zu Shared-Apps wird aufgebaut. Ohne Docker oder
bei fehlenden Rollen/Abhängigkeiten: Abbruch, keine Ersatz-Wiederherstellung in Shared-Apps.

`frontend.py PRIVATE_BUNDLE/frontend` lädt die tatsächlich veröffentlichte Redaktion
lesend mit den bestehenden IONOS-SFTP-Variablen. Zusätzlich ist
`FIB_SFTP_KNOWN_HOSTS` mit unabhängig geprüftem Hostschlüssel erforderlich; unbekannte
Schlüssel werden nicht automatisch akzeptiert. Keine vollständigen lftp-Ausgaben in
öffentliche Logs. Fehlerhafte Teilverzeichnisse nicht versiegeln oder wiederverwenden.

Für Edge-Funktionen weiterhin vollständige bereitgestellte Dateien über den bestehenden
Supabase-Verwaltungszugang exportieren: mindestens fib-editorial-write,
fib-u4-ris-pilot und fib-u4-pilot samt relativen Modulen/Import-Maps. Der Bundle-Validator
prüft diese drei Einträge und ihre Einstiegspunkte; Vollständigkeit transitiver Module
bleibt eine explizite Operatorprüfung. Kein ungeprüfter CLI-/API-Downloader wird als
fertiger automatischer Export ausgegeben. Featurezustände ebenfalls nur mit bestehendem
berechtigtem Zugang erfassen, keine unbekannten Werte als false erfinden.

Für ältere Rücknahmen `restore-verify` statt `verify` verwenden, weiterhin mit extern
bekanntem `FIB_BACKUP_MANIFEST_SHA256`; nur die Ein-Stunden-Grenze entfällt. Zielcommit,
Komponenten und Hashs werden weiterhin geprüft. Dieser Schritt führt noch keine
Wiederherstellung aus.

Die neue PG16/17-Matrix führt das lokale Restore-Skript zusätzlich am synthetischen
Dump aus. Das ist ausdrücklich kein Restore der beim Auftraggeber liegenden Datei.
PR #359 bleibt bis zu tatsächlichem lokalem Restore, vollständigen Exporten und Prüfung
der Actions-Environment-/Secretberechtigungen **nicht betrieblich einsatzbereit**.
Die neue Routine wird nicht aktiviert; externe Ablagezugänge werden nicht verändert.

## Manueller Workflow: veröffentlichte Redaktion sichern

`Backup published editorial frontend` (`frontend-backup.yml`) ist ausschließlich
workflow_dispatch, ohne Zeitplan, Deployment, Supabase-Zugriff oder Artifact-Upload.
Er verwendet denselben Concurrency-Schlüssel wie der IONOS-Deploy. Neues Skript
`frontend-run.py` verwendet den vorhandenen `frontend.py`-Capture; der Release-Bundle-
Validator bleibt für vollständige Releases maßgeblich. Ein Frontend-Nachweis allein
entsperrt keinen Release mit fehlender Datenbank-/Edge-/Konfigurationssicherung.

**Betriebsstand laut Auftraggeber:** Die konkrete Shared-Apps-Datei wurde inzwischen
mit PostgreSQL17 im isolierten netzlosen Container erfolgreich wiederhergestellt:
29 Tabellen, 29 RLS-Tabellen, restore=passed. Das ist ein vom Auftraggeber bestätigter
konkreter Restore, kein in Work ausgeführter Restore. Frühere Hinweise „Restore offen“
in dieser Datei sind dadurch für genau diese Sicherung überholt.

### Fehlende Secrets geschützt einrichten

Die vorhandenen drei IONOS-Secrets sind vom Auftraggeber bestätigt. Ihre Werte werden
weiterverwendet. Unter Repository Settings → Secrets and variables → Actions beziehungsweise
im geschützten Environment `fib-release` ergänzen:

1. `FIB_SFTP_KNOWN_HOSTS`: vollständige known_hosts-Zeile des IONOS-SFTP-Hosts.
   Fingerprint über IONOS-Verwaltung/Support oder einen anderen unabhängigen Kanal
   bestätigen. Ein ungeprüftes ssh-keyscan-Ergebnis ist kein Identitätsnachweis.
2. `FIB_BACKUP_RCLONE_CONFIG`: ausschließlich die beiden Abschnitte `fib-nextcloud`
   und `fib-backup-crypt`. Nicht die gesamte private rclone.conf hochladen.
   Im privaten Editor eine separate Konfiguration erstellen; niemals hier einfügen.
   Der WebDAV-URL muss direkt auf das bestehende Verzeichnis `FIB-Backups` enden,
   HTTPS verwenden und darf keine Zugangsdaten/Query enthalten. `fib-nextcloud`:
   type=webdav, url, bestehender user, rclone-obscured pass, optional vendor.
   `fib-backup-crypt`: type=crypt, remote=fib-nextcloud:, bestehende password/password2,
   filename_encryption=standard, directory_name_encryption=true. Keine Schlüssel ändern!
   **Wenn das vorhandene crypt-Remote auf einen anderen Unterordner zeigt**, nicht
   einfach remote umstellen: zuerst dessen identischen Zielpfad privat abgleichen und
   die Konfiguration fachgerecht für die bereits verwendete verschlüsselte Ablage
   prüfen. Das Skript akzeptiert absichtlich nur den hier dokumentierten Vertrag.
3. Environment `fib-release`, dessen Freigaberegeln und Secretzugriffe prüfen. Variable
   `FIB_BACKUP_READY` erst nach dieser Prüfung bewusst auf true setzen. Dieser Auftrag
   richtet weder Secrets noch Environment/Variable ein und startet keinen Lauf.

Die aktuelle lokale Konfiguration ist Work nicht zugänglich; ihre Eignung wird daher
nicht behauptet. Die Routine lehnt zusätzliche Remotes und unbekannte Optionen ab.
Eine URL-Beschränkung im Client verhindert versehentliche Zugriffe auf andere Ordner,
ist aber **keine serverseitige Rechtebeschränkung**: Ein normales Nextcloud-App-Passwort
kann weitere private Dateien freigeben. Vor Hinterlegung deshalb tatsächliche Kontorechte
prüfen und vorzugsweise den bestehenden getrennten Backupzugang verwenden. Falls der
Zugang das gesamte private Konto öffnet, nicht ungeprüft in GitHub übernehmen; die
fehlende Beschränkung als offene Zugangsvoraussetzung behandeln. Keine neue Infrastruktur
oder fremde private Dateien sind Bestandteil dieses Auftrags.

### Erster echter Lauf nach Zugangsprüfung

Nach Prüfung/gesonderter Aktivierung den geprüften PR-/Merge-Stand in Actions auswählen,
`Backup published editorial frontend` öffnen und einmal Run workflow auslösen.
Die Routine verwendet eine zufällige eindeutige Backup-ID unter
`fib-backup-crypt:Frontend/`. Dateien und frontend-manifest.json werden hochgeladen,
in ein neues privates Verzeichnis zurückgeladen und vollständig byteweise per SHA-256
verglichen. Erst danach entsteht receipt.json; auch diese wird übertragen/zurückgeprüft.
Das Manifest enthält Dateiliste, Hashs, Zeitpunkt und Git-Commit des Sicherungswerkzeugs
(kein behaupteter Build-Commit des vorhandenen Frontends). Logs zeigen nur Erfolg und
Backup-ID oder eine allgemeine Fehlermeldung. Bei Fehlern nicht blind wiederholen:
Zugang/Hostschlüssel/Teilübertragung privat prüfen. Pakete ohne erfolgreichen Nachweis
nicht zur Rücknahme verwenden. Fehlgeschlagene Teiluploads werden nicht automatisch
remote gelöscht.

Temporäre Klartextdateien liegen unter Runner-Temp mit 0700/0600; Python räumt im
Fehler-/Erfolgsfall auf, zusätzlich existiert ein always()-Cleanup. Ein harter Runner-
Abbruch kann den Cleanup verhindern; deshalb ausschließlich kurzlebige gehostete Runner,
keine dauerhafte Klartextablage oder öffentliches Artefakt. FIB-Wartungsfenster einhalten,
da SFTP keinen atomaren Snapshot gleichzeitig extern veränderter Dateien garantiert.

### Kontrollierte Frontend-Rücknahme

Nur nach gesonderter ausdrücklicher Freigabe: ausgewählte Backup-ID aus dem crypt-Remote
in ein privates Verzeichnis zurückladen. receipt/Manifesthash gegen den ursprünglichen
privaten Nachweis vergleichen, jede Datei und vollständige Dateiliste erneut prüfen.
Dann ausschließlich den Inhalt von frontend/ auf das geprüfte SFTP-Ziel redaktion/
zurückspielen, zunächst Unterschiede prüfen; Löschungen nur im freigegebenen Zielumfang.
Keine Rückübertragung anderer Bundle-Komponenten, kein Supabase-/Memorix-Restore.
Originalnachweise behalten. Für einen späteren vollständigen Release kann frontend/
in das gemeinsame Bundle übernommen werden; Erfassungszeit/Wartungsfenster und
Operatorprüfung müssen zum Release passen, anschließend gemeinsames Bundle neu versiegeln.

### Automatisierte Belege

Tests simulieren Transportantworten ausdrücklich: SFTP-Ausfall/unvollständiger Capture,
Uploadfehler, geänderte Rücklesedateien und geänderter Nachweis führen zum Abbruch;
private Tempverzeichnisse sind anschließend leer. Fehlende/falsche Remote-Konfiguration
und ein tatsächlich von ssh-keygen abgewiesener Hostschlüssel werden geprüft. Keine
Aussage über funktionierende echte GitHub-/IONOS-/Nextcloud-Zugänge ohne ersten echten Lauf.
