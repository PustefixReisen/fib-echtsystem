# RIS – technischer Fortsetzungsbericht vom 01.11.2026

Stand: 14:55 Uhr Europe/Berlin. Zielprojekt: Shared-Apps `apaubomxffcwtzjimori`, Schema `fib`.
Freigegebener Release-Commit: `7a73db6178f17103c6802bd78ee6392e690b88da`.
Grundlage: [Release-Plan](u4-shared-apps-release-plan.md) und ausdrücklicher Fortsetzungsauftrag des Betreibers.
Status: **Bereitstellung noch nicht abgeschlossen; vor Quellenaktivierung gestoppt.**

## Tatsächlich geprüft

| Akzeptanzfall | Ergebnis | Nachweis und Grenze |
|---|---|---|
| Release-Arbeitsstand | bestätigt | Lokaler HEAD entspricht dem freigegebenen Commit; vorhandene unversionierte Build-/Abhängigkeitsdateien unverändert belassen. |
| Migrationen | bestätigt | Supabase-Migrationsliste enthält 20261031081340 / fib_ris_editorial_structure und 20261031132655 / fib_development_dataset_manifest. Nicht erneut ausgeführt. |
| Edge-Versionen | bestätigt | API meldet ACTIVE: fib-editorial-write v10 / verify_jwt=false, fib-u4-ris-pilot v14 / true, fib-u4-pilot v4 / true. Kein Deployment; keine Aussage über vollständige Bytegleichheit der Bundles. |
| Tabellen und deklarierte Runtime-Rechte | bestätigt | Lesende Verwaltungs-SQL: alle 19 vertraglich verlangten Tabellen vorhanden, jeweils RLS aktiviert und SELECT für fib_app; INSERT für die 18 vorgesehenen Tabellen vorhanden. development_batches benötigt laut Readiness-Vertrag nur SELECT. |
| Tatsächliche Edge-Runtime und Featurewert | nicht geprüft | Verwaltungs-SQL läuft als postgres; dies belegt weder die DSN-Rolle der Edge Function noch deren Featurewert. Feature=false ist der vom Betreiber übergebene Ausgangsstand, kein unabhängig gemessener Wert. |
| Amtliche Quellen | bestätigt | Genau die vorhandenen Quellen https://buergerinfo-feldkirchen.digitalfabrix.de und https://www.feldkirchen.de sind weiterhin active=false. Merkur ebenfalls false, unverändert. |
| Abnahmebestand | bestätigt | 0 RIS-Sitzungen, 0 RIS-Dokumente, 0 development_batches; 0 veröffentlichte Meldungen. Kein Import ausgeführt. |
| Release-Sicherung / Restore | Betreiberangabe übernommen | Bereits vollständig abgeschlossen laut Auftrag; nicht wiederholt. Backup-ID, Manifest-SHA und aktuelle Ein-Stunden-Gültigkeit stehen dieser Sitzung nicht zur Verfügung. |
| Gehostete Readiness / RIS-Dry-run | nicht geprüft | Bestehender persönlicher AAL2-Prüftoken fehlt in dieser Sitzung. Keine Tokens erzeugt, keine MFA- oder Auth-Umgehung. |
| Frontend und authentifizierter Gesamtweg | nicht geprüft | Kein Deployment und kein persönlicher Login. Hostingstand nicht unabhängig abgerufen. Persönliche fachliche Abnahme bleibt im normalen Firefox des Betreibers. |

SQL- und Metadatenprüfungen wurden über die vorhandene Supabase-Anbindung ausgeführt.
Es wurden keine produktiven Daten oder Projektkonfigurationen geändert. Einzelne lesende
SQL-Vorabfragen mussten wegen einer unzutreffenden Spaltenannahme korrigiert werden;
die abschließende aggregierte Inventur war erfolgreich.

## Konkrete Zugriffsblocker

- `FIB_ACCEPTANCE_USER_TOKEN` und `FIB_MAINTENANCE_DATABASE_URL` sind in dieser Sitzung nicht gesetzt.
  Die vorhandenen öffentlichen Frontend-Variablen ersetzen diese Zugänge nicht.
  Der Release-Plan verlangt die menschliche AAL2-Probe mit `runtimeRole=fib_app`
  vor dem Import; ein SQL-Rechtecheck als postgres ist kein Ersatz.
- Es ist kein Supabase-Verwaltungstoken im Executor konfiguriert; die vorhandenen
  Supabase-Connector-Werkzeuge bieten keinen Feature-Secret-Schreibweg.
  Kein Redeployment als Ersatz für eine Featureumschaltung vorgenommen.
- Ein lesender GitHub-CLI-Aufruf auf die Deployment-Laufliste scheiterte am Proxyzugriff
  mit `socket: operation not permitted`. Der GitHub-Connector kann Dateien und
  vorhandene konkrete Läufe lesen, bietet aber keinen Workflow-Dispatch.
  Kein Netzwerkbypass und kein manueller Ersatz-Upload vorgenommen.
- Der bestehende Frontend-Workflow verlangt zusätzlich zu `confirmation=DEPLOY` und
  `shared_development=true` eine geprüfte `backup_id`, den
  `backup_manifest_sha256`, `FIB_BACKUP_READY=true` und das Environment
  `fib-release`. Das Bundle muss zum exakten Workflow-Commit passen und höchstens
  eine Stunde alt sein. Die bereits erledigte Sicherung wurde nicht neu angelegt;
  ihre momentane Deploy-Gültigkeit konnte hier nicht nachgewiesen werden.
- Die Executor-Netzwerkpolicy enthält die Supabase-, amtlichen Quellen- und
  fib.pustivo.de-Hosts nicht als erlaubte Ziele. Direkter HTTP-Capture/Smoke-Test
  ist damit kein verfügbarer Fortsetzungsweg.

## Nicht ausgeführt und nächster Schritt

Quellenaktivierung, Originalbeleg-Capture, Batchimport, Featureaktivierung,
enabled-Probe und Frontend-Deployment bleiben unvollzogen. Keine neuen Benutzer,
Passwörter, Rollen, Schlüssel, Betreiberwerkzeuge oder Scheduler angelegt.
Memorix und gemeinsame Authentifizierung wurden nicht verändert.

Nächster Schritt ist die staged-Probe aus dem freigegebenen Commit über den bestehenden
berechtigten Betreiberzugang mit privat bereitgestellter vorhandener AAL2-Sitzung.
Bei Erfolg die vorhandenen Quellen-/Capture-/Importskripte in Planreihenfolge verwenden.
Vor dem abschließenden Deployment die konkrete Backup-ID, Prüfsumme, Aktualität und
Commitbindung prüfen und den vorhandenen Workflow mit dessen vier Eingaben starten.
Keine erneute Freigabe des bereits autorisierten Pakets erforderlich; fehlende
technische Zugänge dürfen nicht durch neue Rechte oder persönliche Browser-MFA-Versuche
ersetzt werden. Keine Tokens in Chat oder Repository bereitstellen.
