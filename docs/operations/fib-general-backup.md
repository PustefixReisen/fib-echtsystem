# Allgemeine FIB-Sicherung – Betriebsvertrag

| Version | Stand | Verantwortung |
|---|---|---|
| 1.0 | 01.11.2026 | Josef Walter – mit KI-Unterstützung |

Ergänzt [Release-Sicherung](fib-release-backup.md); dort gelten unverändert Verschlüsselung,
Hostschlüssel, private Ablage und komponentenbezogene Rücknahme. Ausgangspunkt c12b70d6.
Der neue manuelle Workflow ist vorbereitet und wurde nicht gegen Betriebszugänge gestartet.
Keine Änderung an Shared-Apps, IONOS, Memorix oder Auth. Keine Zeitpläne eingerichtet.

## Gemeinsamer Ablauf

`python3 scripts/backup/run.py` verwendet dieselben Komponenten für release, manual und
regular. Aktuelle DB-Aufnahme mit Snapshot, vollständiger isolierter PG17-Restore,
lesender SFTP-Capture, gesamtes Live-FIB-Function-Inventar, versiegeltes Release-Manifest,
rclone-crypt-Upload und exakter Rücklesevergleich. Erst nach zusätzlicher Rückleseprüfung
der separat unter Receipts/ abgelegten Quittung wird Erfolg ausgegeben. Keine vertraulichen
Artefakte. Temporäre Dateien werden auch bei Exceptions entfernt; GitHub always-Cleanup
ergänzt dies. Nur kurzlebige Runner verwenden. Harte Runnerabbrüche bleiben eine Plattformgrenze.
Ein abgebrochener Upload hat keinen erfolgreichen Nachweis; Remote-Teilpakete bleiben erhalten.

Datenbank und SFTP sind keine gemeinsame atomare Sicht. Wartungsfenster und bestehende
Deployment-Concurrency verhindern FIB-Deploy-Konkurrenz; externe Bearbeitung muss organisatorisch
ruhen. Der Komponentenzeitpunkt darf nicht durch späteres Versiegeln als frisch dargestellt werden.

## Geschützter Export als verbleibende Voraussetzung

Derzeit kein geprüfter universeller Management-Exportadapter für alle Deploymentformate.
Deshalb bleibt ein **frischer privater Export** von Code und Konfiguration erforderlich.
Unter `fib-backup-crypt:Inputs/INPUT_ID/` liegen ausschließlich edge/ und configuration/:

- edge/inventory.json: vollständiges Array aller tatsächlich bereitgestellten fib-Functions
  mit slug, version, verify_jwt, ezbr_sha256; Code unter edge/SLUG/index.ts, relative Shared-Dateien
  unter edge/_shared/. Nicht aus Git anstelle des laufenden Stands kopieren.
- configuration/state.json: ausschließlich FIB-Featurezustände, Quellenaktivierung und relevante
  Metadaten; keine DB-URL, JWTs, Supabase-Secrets, Passwörter oder gemeinsamen Auth-Einstellungen.
- configuration/capture.json: capturedAt als UTC-ISO-Zeitpunkt, featureStatesReviewed=true,
  completeFunctionExportsReviewed=true. Dies ist eine ehrliche Operatorbestätigung, kein
  selbständiger Beweis eines unverändert vollständigen Serverexports.

Der Runner liest das aktuelle Management-Inventar und verweigert fehlende/zusätzliche Functions,
Versions-/JWT-/Bundlehashdrift, fehlende relative Dateien und mehr als eine Stunde alte
Exportbestätigungen. Import-Map-Deployments werden bis zu einem geprüften Adapter abgewiesen.
Remote npm/HTTPS-Imports bleiben externe Abhängigkeiten; ihre langfristige Verfügbarkeit ist
kein gesicherter Bestandteil des lokalen Sourceexports. Wiederherstellung benötigt Zugriff auf
passende Dependencies. Ein gepackter Runtime-Export ist deshalb nicht ohne Prüfung ersetzbar.

## Zugänge und Aktivierung

Bestehende IONOS-Secrets, FIB_SFTP_KNOWN_HOSTS und FIB_BACKUP_RCLONE_CONFIG weiterverwenden.
Zusätzlich erforderlich: FIB_MAINTENANCE_DATABASE_URL mit verifizierter TLS-Verbindung und
den bestehenden SUPABASE_ACCESS_TOKEN für **lesenden** Zugriff auf das Function-Inventar des bekannten
Projekts. Keine Secrets über Management-API lesen. Der Auftraggeber hat die Existenz von SUPABASE_ACCESS_TOKEN bestätigt; seine tatsächlichen
Berechtigungen und die DB-Secret-Konfiguration wurden nicht ausgelesen. Einen zu weit berechtigten Zugang nicht ungeprüft in Actions übernehmen.
FIB_BACKUP_DATABASE_CA mit dem unabhängig verifizierten PEM-CA-Zertifikat bereitstellen;
der Workflow schreibt es privat und übergibt denselben PGSSLROOTCERT-Pfad an pg und pg_dump.
Einrichtungsanleitung: [Datenbank/TLS](fib-backup-database-tls.md).

Environment fib-release bleibt auf main und persönliche Freigabe beschränkt. Neue Variable
FIB_COMPLETE_BACKUP_READY standardmäßig nicht setzen. Erst nach Zugangsprüfung darf sie true
werden. Der vorhandene FIB_BACKUP_READY-Schalter allein aktiviert diesen Ablauf nicht.
GitHub-Workflow Complete FIB backup: mode und input_id angeben. PostgreSQL17-Client, Docker,
Node-Abhängigkeiten, rclone und lftp müssen verfügbar sein. Kein Upload von Klartextartefakten.

## Regelbetrieb, Alter, Aufbewahrung

regular ist vorerst manuell aufrufbar. **Unbeaufsichtigter Regelbetrieb noch nicht einsatzbereit**:
der geschützte Exportadapter und die selektive Featureaufnahme müssen zuerst automatisiert und
mit echten Betriebszugängen geprüft werden. Danach separate Freigabe für Zeitplan/Häufigkeit.
Kein kostenpflichtiger Dienst erforderlich.

Private Quittungen aus Receipts/ zurücklesen und `health.py PRIVATER_ORDNER --max-age-hours 24
--retention-days 30 --keep 7` ausführen. Fehlende/überfällige Nachweise führen zu Exit 1.
Die Aufbewahrung liefert ausschließlich einen Löschvorschlag; keine Remote-Löschung.
Letzte sieben erfolgreiche Sicherungen bleiben geschützt; Fristen konfigurierbar.
Bytes pro Paket stehen in der Quittung. Summen/Speichertrend privat überwachen; Quoten und
Alarmierung müssen vor Zeitplanaktivierung organisatorisch festgelegt werden. Automatische
Benachrichtigung und unabhängige Ausfallüberwachung sind noch offen. Wiederherstellungsprüfung
läuft bei jedem vollständigen Backup für die frisch aufgenommene DB; Frontend/Code-Restore
regelmäßig separat in isolierter Testumgebung üben.

## Wiederherstellung und Release-Übergabe

Restore ausschließlich komponentenweise nach gesonderter Freigabe. Private Quittung und
Manifesthash unabhängig aufbewahren. Bundle zurücklesen, bundle.mjs restore-verify mit bekanntem
Hash und Commit ausführen. DB nur über restore-local.py in isoliertem PG17 prüfen; keine globale
Shared-Apps-Wiederherstellung. Edge-Code pro gesichertem Slug mit ursprünglichen JWT-Einstellungen
und Abhängigkeiten zurückspielen; gemeinsame Secrets unverändert. Frontend nur redaktion/ nach
Diffprüfung zurückspielen. FIB-Konfiguration nur die explizit gesicherten eigenen Werte nach
Driftprüfung zurücksetzen. Kein Auth-, Rollen- oder Memorix-Restore.

Für RIS: frische Exporte und geprüftes Wartungsfenster, vollständigen Workflow nach separater
Betriebsprüfung starten, receipt.backupId und manifestSha256 für bestehenden manuellen Deploy
verwenden. Der Deploy verifiziert weiterhin Commit, Maximalalter eine Stunde und Komponentenhashs.
Der ältere Validator verlangt mindestens die drei RIS-Functions; der neue Capture prüft zusätzlich
alle Live-FIB-Functions. Alte Pakete erhalten dadurch keinen nachträglichen Vollständigkeitsnachweis.
RIS-Migrationen/Featureaktivierung bleiben ein eigenes Paket gemäß führendem Bereitstellungsplan.

## Prüfstatus und Wiederverwendung

Lokale Verträge prüfen Exportdrift, fehlende Functions/Dependencies, Alter, Retention und fehlende
Zugänge; vorhandene Transporttests simulieren Uploadabbrüche, falsche Hashs und Cleanup.
Diese Tests sind kein echter SFTP-/Management-/Nextcloud-Gesamtlauf. Bestehende PG16/17-CI
prüft synthetischen Backup/Restore; konkreter 29-Tabellen-Restore ist vom Auftraggeber bestätigt.
Neuer kompletter Betriebsdurchlauf und Edge-Redeployment-Restore sind noch offen.

components.py enthält anwendungsneutrale Alters-/Aufbewahrungsverträge; run.py kapselt FIB-Ziel,
Schema und Naming. Für weitere Anwendungen braucht es ein eigenes geprüftes Profil/Adapter.
Es wurden keine Memorix-Dateien, Berechtigungen oder Daten verändert.
