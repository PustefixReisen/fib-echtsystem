# Datenbankzugang und TLS für FIB-Sicherungen

| Version | Stand | Verantwortung |
|---|---|---|
| 1.0 | 01.11.2026 | Josef Walter – mit KI-Unterstützung |

Ergänzt den [allgemeinen Betriebsvertrag](fib-general-backup.md).
Keine Änderungen an Shared-Apps, Auth, Memorix, IONOS oder Zugangsdaten ausgeführt.
Kein Sicherungslauf gegen Betriebszugänge und keine Workflowaktivierung.

## Einmalige geschützte Einrichtung

Im geschützten Environment fib-release:

1. FIB_MAINTENANCE_DATABASE_URL: vorhandene berechtigte Verbindung, direkt oder Session-Pooler
   auf Port 5432 zum bekannten Projekt. Kein Transaktionspooler auf 6543: exportierte Snapshots
   benötigen dieselbe Sitzung. Passwort und Benutzername jeweils UTF-8-URL-kodieren (Prozentkodierung).
   Insbesondere @, :, /, ?, #, %, Leerzeichen dürfen nicht roh im Passwortteil stehen.
   Bereits kodierte Werte nicht erneut kodieren. Keine vollständige URL in Shellargumente oder Logs.
2. FIB_BACKUP_DATABASE_CA: PEM-CA-Zertifikat aus der authentifizierten Supabase-Projektverwaltung.
   Herkunft/Fingerprint unabhängig prüfen; kein Zertifikat blind vom Netzwerkserver übernehmen.
   Das Zertifikat ist kein Passwort, muss aber gegen unbemerkten Austausch geschützt sein.
   Hierfür wird ein zusätzlicher Secretname benötigt, weil die existierende DB-URL keinen
   vertrauenswürdig bereitgestellten CA-Dateiinhalt ersetzen kann. Keine privaten Schlüssel ablegen.
3. Vorhandenes SUPABASE_ACCESS_TOKEN wird unter dem internen Namen FIB_BACKUP_MANAGEMENT_TOKEN
   weitergereicht. Kein neues Token und keine Berechtigungserweiterung erforderlich. Der Runner
   verwendet ausschließlich GET /v1/projects/apaubomxffcwtzjimori/functions. Ob der bestehende
   Zugang diesen lesenden Aufruf erlaubt, ist erst im genehmigten Betriebsdurchlauf nachweisbar;
   bei 401/403 Abbruch und vorhandene Berechtigung prüfen, nicht automatisch erweitern.
   SUPABASE_ACCESS_TOKEN ist ein Management-Token, kein Datenbankpasswort und keine Browserkennung.

Sichere URL-Erstellung auf dem eigenen Rechner, ohne Ausgabe der URL; bekannten Host und
Benutzernamen im privaten Editor einsetzen (für Pooler postgres.PROJEKTREF):

```python
import getpass, os, pathlib
from urllib.parse import quote
os.umask(0o077)
host = input('Geprüfter DB-/Session-Pooler-Host: ').strip()
user = input('Bestehender Benutzer: ').strip()
password = getpass.getpass('DB-Passwort: ')
url = 'postgresql://' + quote(user, safe='') + ':' + quote(password, safe='') + '@' + host + ':5432/postgres?sslmode=verify-full'
p = pathlib.Path.home() / 'FIB-Backups' / 'maintenance-url.private'
with p.open('x') as f:
    f.write(url)
```

Das Zielverzeichnis muss bereits privat sein. Die Datei nicht in Nextcloud-Sync/Git legen.
Anschließend aus dem bestehenden angemeldeten gh-Client übertragen:

```bash
gh secret set FIB_MAINTENANCE_DATABASE_URL --repo PustefixReisen/fib-echtsystem --env fib-release < "$HOME/FIB-Backups/maintenance-url.private"
gh secret set FIB_BACKUP_DATABASE_CA --repo PustefixReisen/fib-echtsystem --env fib-release < /privater/pfad/projekt-ca.pem
```

Private URL-Datei nach erfolgreicher Einrichtung kontrolliert entfernen. Nicht im Chat zeigen.
Vorhandene gleichnamige Environment-/Repository-Secrets auf beabsichtigte Vorrangregel prüfen;
keine Secretwerte zur Prüfung ausgeben. FIB_COMPLETE_BACKUP_READY bleibt bis zum genehmigten
Gesamtlauf unverändert. Persönliche Environment-Freigabe bleibt bestehen.

## Technischer Vertrag

pg erhält die geprüfte URL ohne SSL-Dateiparameter; rejectUnauthorized=true ist ausdrücklich
gesetzt. libpq bekommt Host, Benutzer und genau einmal dekodiertes Passwort ausschließlich über
Kindprozess-Umgebungsvariablen, niemals Kommandoargumente. PGSSLMODE=verify-full erzwingt
CA-Kette und Hostnamenprüfung. Beide verwenden denselben vorher geprüften PGSSLROOTCERT-Pfad.
Der Workflow schreibt die CA mit 0600 unter Runner-Temp, validiert CA-Eigenschaft/Ablaufdatum
und entfernt sie im always-Cleanup. TLS-Handshake prüft anschließend die tatsächliche Serverkette.
Lokale isolierte fib_u4_test-Verbindungen behalten ihren bisherigen TLS-freien Testvertrag.
Ohne PGSSLROOTCERT bleiben lokale Operatoraufrufe mit dem bisherigen Systemvertrauen möglich;
der vollständige Actions-Workflow verlangt ausdrücklich die Projekt-CA.

URL-Protokoll, Ziel, Passwort, Port und erlaubte Queryparameter werden vor Verbindungsaufbau
geprüft. Fremde Hosts, host-Overrides, doppelte Parameter und Fragmente werden abgewiesen.
sslmode=disable und NODE_TLS_REJECT_UNAUTHORIZED=0 sind für Shared-Apps unzulässig.
Andere URL-SSL-Angaben können die ausdrücklich gesetzte Verifikation nicht abschwächen.
Geerbte libpq-PG-Overrides werden vor pg_dump entfernt; PG_CONTAINER bleibt ausschließlich
für den bestehenden isolierten CI-Clientwrapper erhalten. PostgreSQL17-Client weiter verwenden.

## Prüfungen und verbleibende Grenzen

Neue automatisierte Prüfungen: kodierte Sonderzeichen/Unicode/literales Prozentzeichen,
identische pg/libpq-Passwörter, fehlende Credentials, fremde Ziele/Protokolle, Poolerport,
Query-Overrides, kaputte Kodierung, ungültige/fehlende CA, TLS-Abschaltversuche und tatsächliche
lokale TLS-Handshakes mit vertrauenswürdigem Zertifikat, falschem Hostnamen und fehlendem Vertrauen.
Diese TLS-Tests verwenden synthetische lokale Zertifikate; sie sind kein Shared-Apps-Verbindungstest.
Bestehende PG16/17-CI prüft weiterhin Snapshot-Dump und Restore. Betriebliches Zusammenspiel mit
der konkreten Supabase-CA und vorhandenen Managementberechtigungen bleibt vor Aktivierung zu prüfen.
