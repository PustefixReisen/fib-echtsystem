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