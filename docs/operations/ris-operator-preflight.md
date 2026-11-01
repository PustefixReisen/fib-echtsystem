# RIS-Betreiberablauf – erster sicherer Vorabcheck (#368)

Dieses erste Teilpaket ist absichtlich **nur lesend**. Es führt weder Migrationen noch Änderungen an Secrets, Edge Functions, Quellen oder Frontend aus.

## Nutzung

Benötigt Python 3.10+, `git` und eine bereits angemeldete `supabase`-CLI. Die Parameter werden **aus einem unabhängig verifizierten privaten Release-Backup-Receipt** entnommen; die Werte in diesem Dokument sind keine gültige künftige Sicherung.

```bash
python3 scripts/ris-shared-apps/operator-preflight.py \
  --backup-id '<geprüfte-release-id>' \
  --backup-manifest-sha256 '<geprüfte-64-stellige-sha256>' \
  --backup-created-at '<ISO-8601-UTC-Zeitpunkt>' \
  --backup-commit '7a73db6178f17103c6802bd78ee6392e690b88da' \
  --output "$HOME/FIB-Backups/ris-preflight-$(date -u +%Y%m%dT%H%M%SZ).json"
```

Die Prüfung kontrolliert den exakten freigegebenen Commit in `origin/main` (auch wenn das Prüfsystem auf einem anderen Entwicklungszweig liegt), einen sauberen Arbeitsbaum, das Alter und die Commit-Angabe des übergebenen Sicherungsbelegs, das live gelistete Funktionsinventar und die erwarteten drei RIS-Funktionsversionen/JWT-Einstellungen sowie das Fehlen der beiden RIS-Migrationen und des Feature-Schalters.

**Nicht geprüft** werden hier kryptografische Authentizität des übergebenen Backup-Receipts, tatsächliche Wiederherstellbarkeit oder Nextcloud-Rücklesung, Datenbanktabellen/Quellenidentitäten, private Wartungsumgebung oder die FIB-MFA/AAL2-Sitzung. Diese Prüfungen sind verpflichtend vor jeglichem Schreibschritt; ein erfolgreicher Lauf **ist keine Deploy-Berechtigung**.

Bis die weiteren Schritte aus Issue #368 implementiert und separat getestet sind, gilt für die eigentliche RIS-Bereitstellung ausschließlich `docs/operations/u4-shared-apps-release-plan.md`. Der bisherige freigegebene Commit bleibt `7a73db6`; durch Merge dieses PR ändert sich `main` und die Commit-Bindung eines weiteren Release-Backups muss neu bewertet werden.
\n## Negativtests (ohne Netzwerk)\n\n`python3 -m unittest discover -s scripts/ris-shared-apps -p 'test_operator_preflight.py'`\n\nDie Tests decken fehlerhaften Sicherungs-Commit, veraltete Sicherung, Migrations- und Feature-Drift sowie geänderte Edge-Versionen ab. Der Gate prüft nur Metadaten; er darf nicht allein zum Deployment verwendet werden.\n
## Zusätzlicher lesender Datenbank-Istvergleich

Der separate Befehl `python3 scripts/ris-shared-apps/operator-db-inventory.py` verwendet ausschließlich `FIB_MAINTENANCE_DATABASE_URL`, `PGSSLROOTCERT` und den vorhandenen `psql`-Client. Der PostgreSQL-Zugriff läuft innerhalb einer `READ ONLY`-Transaktion mit TLS `verify-full`; der Zugang wird über die Umgebung und nicht über Kommandozeilenparameter weitergereicht. Er verlangt genau 29 FIB-Tabellen, fehlende RIS-/Manifesttabellen und die beiden amtlichen Quellen mit erwarteter URL und `active=false`.

Dieser Baustein erzeugt **keine produktiven Änderungen**. Er prüft nicht die externe Sicherungsquittung oder Benutzer-MFA und ist allein keine Ermächtigung zur Bereitstellung. Tests: `python3 -m unittest discover -s scripts/ris-shared-apps -p 'test_operator*.py'`.

## Unabhängige verschlüsselte Sicherungsprüfung

`operator-backup-verify.py` lädt nach privater Bereitstellung von `FIB_BACKUP_RCLONE_CONFIG` die Quittung und das verschlüsselte Sicherungspaket aus dem separaten Nextcloud-Backupbereich zurück. Er verifiziert Release-Modus, exakte Backup-ID, den freigegebenen Commit und den extern vorgegebenen Manifest-SHA-256-Wert und prüft das vollständige Bundle über `scripts/backup/bundle.mjs verify`. Er verwendet temporäre Dateien außerhalb des Repositories, zeigt keine Secrets an und führt keine Produktionsschreibvorgänge aus.

Beispiel (nur mit unabhängig geprüftem aktuellem Release):

```bash
python3 scripts/ris-shared-apps/operator-backup-verify.py \
  --backup-id 'release-<id>' \
  --manifest-sha256 '<aus-geprüftem-release-receipt>'
```

**Wichtig:** Die Quittung selbst wird aus dem Backupbereich gelesen. Der Manifest-SHA-256-Wert muss aus einer unabhängigen vertrauenswürdigen Prüfinstanz stammen und darf nicht ungeprüft derselben Quittung entnommen werden. Danach zusätzlich den Alterscheck direkt vor dem ersten Schreibschritt ausführen. Der Verifier setzt nichts in Supabase oder GitHub.

## Gemeinsamer, strikt lesender Startbefehl

Der Einstiegspunkt `operator-readiness.py` führt **in einem Lauf** die unabhängige entschlüsselte Nextcloud-Rücklesung und Bundle-Verifikation, den PostgreSQL-Istvergleich und den GitHub/Supabase-Preflight aus. Er verwendet bestehende private Umgebungsvariablen `FIB_BACKUP_RCLONE_CONFIG`, `FIB_MAINTENANCE_DATABASE_URL` und `PGSSLROOTCERT`; der geprüfte Backup-Manifest-Digest muss unabhängig aus dem erfolgreichen GitHub-Sicherungslauf stammen. Es gibt keine automatische RIS-Aktivierung und keinen Secret-Upload. Der private Bericht enthält keine Zugangsdaten.

```bash
python3 scripts/ris-shared-apps/operator-readiness.py \\
  --backup-id 'release-<id>' \\
  --manifest-sha256 '<unabhängig-geprüfte-sha256>' \\
  --output "$HOME/FIB-Backups/ris-readiness-$(date -u +%Y%m%dT%H%M%SZ).json"
```

Dieser Bericht ist **kein Freigabetoken für produktive Schreibschritte**. Besonders der Gültigkeitszeitraum der Sicherung muss *unmittelbar* vor einem künftigen Deployment erneut geprüft werden, und die persönliche gültige FIB-AAL2-Sitzung bleibt eine noch nicht automatisierte Voraussetzung. Das Release-Paket bleibt an den zuvor ausdrücklich freigegebenen Commit gebunden; weder ein neuer PR noch ein Check-Artefakt ändern den freigegebenen Payload.
