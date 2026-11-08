# RIS-Korrektur #404 – gezielte Bereitstellung, vorhandene Zugangsgrenzen

Stand: 08.11.2026. Der genehmigte Fachcode ist in `main` unter
`09a7ec003430f444d53ecd3d9ea78550b1ceda6e` übernommen,
**nicht** in Shared-Apps/IONOS bereitgestellt. Der reguläre Live-19-TOP-
Nachweis ist nach IG-1 #401 verschoben.

## Prüfbefund
- GitHub-Actions-Workflows für DB-/Frontend-/Gesamtbackup existieren.
- Das bisherige `fib-edge-functions-deploy.yml` deployt vier fest eingetragene
  Functions, **aber nicht** `fib-u4-ris-pilot`; für #404 ist es daher nicht
  passend (zu breite und zugleich unvollständige Auswahl).
- Der hier neu vorgeschlagene `ris-targeted-edge-deploy.yml` deployt ausschließlich
  `fib-editorial-write` und `fib-u4-ris-pilot` und nur bei
  `workflow_dispatch`, `DEPLOY`, eindeutigem Main-Commit und dem
  erfolgreichen Abruf/Integritätscheck eines privaten verschlüsselten
  vollständigen Release-Bundles. Vorhandene Umgebungsfreigaben bleiben in Kraft.
- Das vorhandene Frontend-Deployment verwendet ebenfalls geprüfte
  Backup-ID/Manifest-SHA. Der risikoärmere Frontend-only-Workflow ersetzt
  **nicht** den erforderlichen Backend-Release.
- Der letzte Codex-Kontext meldete `Forbidden` beim Actions-Zugriff und keinen
  Zugriff auf die bestehenden Maintenance-/SFTP-/Backup-Kontexte. Der GitHub-
  Connector dieses Chats bietet keinen Workflow-Dispatch. **Deshalb kann in
  diesem Kontext kein produktiver Release-Lauf ausgeführt oder bestätigt werden.**

## Vor der ersten Ausführung des neuen Workflows
1. Im bestehenden berechtigten Betreiber-/Actions-Kontext vollständiges,
   aktuelles FIB-Release-Bundle erstellen, verschlüsselt speichern und
   Integrität sowie Wiederherstellungsumfang anhand des bestehenden
   Sicherungsplans prüfen. Vorversionen der beiden Edge Functions und
   des IONOS-Frontends für Rollback nachweisbar sichern.
2. Genehmigten Commit und Backup-Metadaten kontrollieren. Nach Merge **dieses**
   Workflow-PRs gilt für den Actions-Checkout ein neuer `main`-Commit: die
   Backup-Manifeste müssen an den tatsächlich auszuführenden
   Workflow-Commit gebunden sein. Nicht die alte #404-SHA als
   `approved_commit` einer späteren Workflow-Ausführung ausgeben.
   Die Freigabe von #404 deckt den fachlichen Inhalt ab; neue
   Workflow-/Releaseänderungen erst nach Review und Freigabe aktivieren.
3. Versionen/Secrets/Variablen in GitHub **nur auf Vorhandensein** prüfen,
   nicht offenlegen. `fib-release` braucht `FIB_BACKUP_READY` und
   `FIB_BACKUP_RCLONE_CONFIG`; `fib-shared-apps` benötigt
   `SUPABASE_ACCESS_TOKEN`. Fehlende Berechtigung nicht umgehen.
4. Workflow als manuellen Run auf `main` starten. Der Backup-Job muss vor
   dem Deploy-Job erfolgreich sein. Auf Ausschlüsse (keine Migration,
   kein Scheduler, keine Dokumentvolltexte, kein Memorix-Eingriff) achten.
5. Danach Frontend nur mit bestehendem Backup-geprüften Workflow
   bereitstellen, Hosted-Smoke und MFA durchführen.
6. Bei Fehlern die Vorversionen gezielt wiederherstellen und **keinen**
   automatischen DB-Restore auf redaktionelle Live-Daten anwenden.

## Grenzen und offene Punkte
- Ein grüner neuer Workflow-PR beweist noch keine Zugänglichkeit von
  GitHub Actions oder der privaten Sicherungsquellen.
- Werden bei sequenzieller Function-Bereitstellung nur Teile erfolgreich,
  ist eine gezielte manuelle Rücknahme anhand der gesicherten Versionen nötig.
- Keine RIS-19-TOP-Vollständigkeitsbehauptung; persönlicher Mobilt-Test folgt
  auf die tatsächliche Bereitstellung.
- Der vollständige Einmalfreigabe-Ablauf gehört weiterhin zur bestehenden
  Bereitstellungsplanung #398 und dem Dokumentations-PR #405; dieser
  fokussierte PR ersetzt **nicht** die langfristige Automation.
