# PR #371 – technische Freigabevorlage (noch keine Freigabe)

Stand: 01.11.2026. Repository `PustefixReisen/fib-echtsystem`; Supabase Shared-Apps `apaubomxffcwtzjimori`, Schema `fib`.

## Verifizierter Entwicklungsstand

- Draft-PR #371, Branch `fix/ris-unresolved-proposal-370`, geprüfter Head `c569d026ca94b608e915de70c62a047df0d92ae1`.
- GitHub Actions am Head: **8/8 erfolgreich** (Core Services CI, Editorial Web CI, U4 PostgreSQL integration, Integrated RIS acceptance, Isolated Auth Security, RIS Shared-Apps deployment preparation, Personal RIS acceptance preparation, U4 public-source connectivity check).
- RIS-Beschaffung: Sitzungskalender → Sitzung → Tagesordnungspunkt → Vorlage → Dokument; zeitlich begrenzte historische Kalenderabdeckung bis 2024-01 mit fortsetzbarem Cursor; Timeout der Dokumentenliste wird als Prüflücke gespeichert.
- Der gesonderte Integrationspfad nimmt ausschließlich `integrationSession: "1032", commit: true` an, benötigt **interaktive AAL2-Adminberechtigung und** `FIB_RIS_INTEGRATION_TEST_ENABLED=true`. Er schreibt die daraus ermittelte Sitzungsstruktur in einer Transaktion, ohne Scanner-Cursor oder Dokumentlisten-Beobachtungen zu verändern.
- CI-Tests sind isoliert; sie ersetzen **keinen** produktiven PostgreSQL-Schreibtest.

## Ausstehende Freigaben und unveränderliche Grenzen

**Kein Merge, Deployment oder produktiver Schreibtest allein aufgrund dieser Vorlage.**
Die Freigabe muss den konkreten **gemergten** Commit, eine neue Sicherungs-ID und den präzisen Umfang (einzelne Sitzung 1032) nennen. Der bisher freigegebene Commit `7a73db6` ist hierfür nicht ausreichend.

- Bestehende Login/MFA/FIB-Admin-Mitgliedschaft, `fib_app`-Rolle und JWT-Gatewayparameter bleiben erhalten. Keine Änderungen an `auth`, `public`, Memorix, gemeinsamen Secrets oder anderen Services.
- Keine automatische RIS-Recherche, Cron, Scheduler oder Veröffentlichung, kein Frontend-Deployment als Bestandteil des isolierten Schreibtests.
- FIB-Produktivschalter `FIB_RIS_STRUCTURE_ENABLED` und `FIB_RIS_AUTOMATION_ENABLED` bleiben ausgeschaltet. Der zusätzliche Integrationsschalter wird erst im genehmigten Wartungsfenster kurzfristig eingeschaltet und danach ausgeschaltet.

## Sicherung vor der Freigabe

Gemäß `docs/operations/u4-shared-apps-release-plan.md` und `docs/operations/fib-release-backup.md` **nach ausdrücklicher Bereitstellungsfreigabe**:

1. Berechtigten Wartungszugang mit `FIB_MAINTENANCE_DATABASE_URL` und PostgreSQL-17-Client prüfen, TLS-Validierung unverändert; keinerlei Zugangsdaten im Repo oder Chat.
2. Neue **vollständige** Sicherung des bestehenden `fib`-Schemas mit Snapshot, Manifest, Prüfsummen, Tabellenzählungen, verschlüsselter privater Ablage und erfolgreichem Restore-/Rücklesenachweis erstellen; neue Backup-ID protokollieren.
3. Aktuelle FIB-Edge-Funktion(en) und vollständigen IONOS-Frontendstand privat mit Metadaten sichern. Frontend-Bereitstellung gehört nicht zum Sitzungstest.
4. Vorherige FIB-Schalterzustände, Quellstatus, Schemainventur, Cursor-JSON und konkrete Sitzungs-/TOP-/Vorlagen-/Versionen-Zählungen **lesend** sichern. Bei Abweichung zum Referenzstand stoppen.

## Reihenfolge des gesondert freizugebenden Einzeltests

1. Code nach Review mergen und **Merge-Commit** sowie vollständige CI-Nachweise überprüfen. Freigabe separat einholen.
2. Aktuell laufende FIB-Backend-Version sichern; nur das genehmigte `fib-u4-ris-pilot`-Bundle (mit aktuellen Shared-Modulen) bereitstellen, unveränderte JWT-Gatewayeinstellung verifizieren. Feature und Integrationsschalter bleiben zunächst OFF.
3. Authentifizierten Admin-Dry-run, Rechte und Datenbankverbindung prüfen; bei 5xx oder Drift: STOP. Der reguläre Dry-run zeigt nicht den Erfolg des Single-Session-Persistenzpfads.
4. Nur nach ausdrücklicher **Schreibfreigabe** `FIB_RIS_INTEGRATION_TEST_ENABLED=true` setzen; einziger Aufruf `{ "integrationSession": "1032", "commit": true }` über den authentifizierten interaktiven Adminpfad. Keine anderen Sitzungscodes.
5. Vorher-/Nachher-Abgleich der Sitzung 1032, ihrer TOPs, Vorlagen, Sitzungsrevisionen und Verlinkungen, sowie Unverändertheit von Cursor/Beobachtungen/unbeteiligten Datensätzen. Zweiter identischer Aufruf nur nach fehlerfreiem Erstabgleich (Idempotenz).
6. Testschalter **unmittelbar wieder OFF**, Status nachweisen. Bei unerwartetem Ergebnis STOP, Backendrollback anhand privater Sicherung; keine unkontrollierte DB-Löschung.

## Noch nicht nachgewiesen

- Frische produktive Release-Sicherung, erfolgreiche Wiederherstellung und private FIB-Edge-/Frontend-Exporte für **diesen** Release.
- Review und ausdrückliche Freigabe des konkreten gemergten Commits.
- Produktiver AAL2-Admin-Zugang/Testfenster und realer Einzel-Sitzungs-Commit im Shared-Apps-Schema.
- Fachliche Vollständigkeitsdefinition für RIS-Kalender vor 2024 und verlässliche Alternative für die zeitweise nicht erreichbare Dokumentliste.

**Entscheidungsstatus: Technische CI-Abnahme erfüllt. Produktivfreigabe gesperrt.**
