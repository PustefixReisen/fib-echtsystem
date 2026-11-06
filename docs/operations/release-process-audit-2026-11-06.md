# FIB – Bereitstellungsprozess: Bestandsprüfung und risikogerechter Zielablauf

**Stand 06.11.2026 · Issue #398 · Bestandsprüfung, keine operative Freigabe.**

## Geltung und Abgrenzung

Dies ist der erste, rein dokumentierende Arbeitsschritt des allgemeinen Entwicklungs-, Test- und Bereitstellungsprozesses. **Issue #375 ist nicht dieses Paket:** Es betrifft ausschließlich die spätere Bereinigung einmaliger RIS-Schalter **nach der RIS-Nutzerabnahme**. Die Abnahme am 08.11.2026 wird nicht vorgezogen oder ersetzt.

Der [konkrete RIS-Shared-Apps-Releaseplan](u4-shared-apps-release-plan.md) und die [FIB-Release-Sicherung](fib-release-backup.md) bleiben für betroffene Releases maßgeblich. Dieser Überblick deaktiviert kein Gate und erlaubt keine Veränderung an Shared-Apps, Auth, Memorix, Secrets, Storage oder produktivem Frontend.

## Nachgewiesene bestehende Pfade (Repository, nicht Live-Nachweis)

| Pfad | Existierender Workflow | Nach Repo-Stand erkennbare Wirkung / Grenze |
|---|---|---|
| Isolierte Core-/Frontend-/SQL-Tests | `core-services-ci.yml`, `editorial-web-ci.yml`, `u4-postgres-integration.yml`, RIS-/Topic-/Source-CI | Prüfung ohne produktives Deployment; unterschiedliche Testtiefe je Feature |
| Frontend-Preview | `editorial-web-preview.yml` | Baut Branch in `/redaktion-preview/`; keine Änderung von `/redaktion/`, aber separates IONOS Preview-Environment und Schreibzugang benötigt |
| Frontend-only | `editorial-web-frontend-only.yml` | nur Dispatch auf `main` mit `FRONTEND`, Environment `fib-release`; statische Dateien ohne Remote-Delete; explizit keine DB-/Edge-Änderung; SFTP-Hostfingerprint geprüft |
| Vollständiger Frontend-Release | `editorial-web-deploy.yml` | Dispatch mit `DEPLOY`, geprüftem privatem Release-Backup, Manifest/Commit und `FIB_BACKUP_READY`; Remote-Delete, strenger Ablauf für Pilot/Produktion |
| FIB-Edge-Funktionen | `fib-edge-functions-deploy.yml` | Dispatch mit `DEPLOY`, Environment `fib-shared-apps`; deployt derzeit eine explizite Liste von vier Funktionen; keine allgemeine automatische Vollständigkeitsprüfung |
| DB-/RIS-Änderungen | Isolierte SQL-/PG-Tests, explizite Ablaufpläne und bestehende Sicherungsskripte | Kein allgemeiner als sicher belegter Automatikpfad für Shared-Apps-Migrationen; explizite Bestands-/Freigabeprüfung vor Anwendung |

**Wichtige Abweichungen / Verbesserungsbedarf:**
1. Zwei Frontend-Workflows mit unterschiedlichen Gate-Anforderungen: korrekt für unterschiedliche Risikoklassen, aber Benutzer brauchen eine klare Entscheidungshilfe. `editorial-web-deploy.yml` verwendet `mirror --delete`, `editorial-web-frontend-only.yml` tut dies nicht.
2. Der vollständige Frontend-Workflow benutzt `set sftp:auto-confirm yes`; der Frontend-only-Pfad prüft dagegen einen festgelegten Host-Key-Fingerprint. Vor Änderung des strengeren Release-Pfades ist zu klären, ob die Hostidentität dort ausreichend unabhängig verifiziert wird. **Keine automatische Freigabe für Änderungen.**
3. `editorial-web-preview.yml` benutzt ebenfalls `sftp:auto-confirm yes`; ein Preview-Verzeichnis ist keine Rechtfertigung für ungeprüfte Hostauthentizität. Vor produktiver Verwendung/Änderung unabhängig prüfen.
4. `fib-edge-functions-deploy.yml` verwendet `supabase/setup-cli@v1` mit `version: latest` und `--no-verify-jwt` für die explizite Liste. Funktionsspezifische Gateway/JWT-Einstellungen und Versionen vor jedem Release abgleichen; Konfiguration nicht blind vereinheitlichen.
5. Kein vorhandener automatischer End-to-End-Rollback darf aus vorhandenen Backup-/Restore-Skripten unterstellt werden. Schema-Rücknahme braucht wegen Datenverlust-/Shared-Apps-Risiken einen gesonderten geprüften Plan.
6. CI-Erfolg belegt technische Prüfungen, nicht Veröffentlichung, Live-Funktion oder fachliche Abnahme.

## Vorgeschlagene Standardentscheidung vor einem Release

**A – Dokumentation/CI-only:** PR, Review und CI; keine Betriebsänderung, keine produktive Sicherung erforderlich.

**B – Statisches Frontend-only:** Sicherstellen, dass Migration, Edge/API und Konfiguration bereits kompatibel bereitstehen. Review/CI, unabhängige SFTP-Hostprüfung, bestehender nichtlöschender Frontend-only-Workflow, kurzes Live-Smoke nach kontrolliertem Dispatch. Bei Fehlfunktion geprüften vorherigen Frontendstand zurückspielen; vorhandenes Sicherungsverfahren nicht überspringen, wenn der Stand noch nicht reproduzierbar ist.

**C – FIB-Edge-Funktionen:** Geänderte Funktionen und unveränderte Gateway-/JWT-Einstellungen dokumentieren; bestehende Versionen und Shared-Imports vorab erfassen, isolierte Tests, Auth-/RLS-Grenzen und fachliche Freigabe kontrollieren. Nach kontrolliertem Deploy gezielte authenticated Smoke-Tests; bei Fehler geordnet auf gesicherte Vorversion zurück.

**D – FIB-Schema/Daten:** Migrationen isoliert (PostgreSQL und relevante FIB-Rollen) testen, betroffene Tabellen und Auswirkungen auf Memorix/Auth ausschließen, vorab aktuellen FIB-Snapshot mit Integritätsprüfung nach bestehender Routine erstellen und einen Rücknahmeplan prüfen. Nach kontrollierter Migration gezielte Leserechte/RLS/Smoke-Tests. Keine automatische destruktive Down-Migration.

**E – Gemeinsame Supabase-/Auth-/Secrets-Eingriffe:** Nicht als gewöhnlicher FIB-Release ausführen; eigener gesondert genehmigter und gemeinsam risikoabgestimmter Eingriff.

**Bei Kombinationen gilt die strengere Klasse**, soweit sie den gefährdeten Teil schützt. Ein Frontend-Deploy nach Schemaänderung ist kein Frontend-only-Release.

## Standardnachweis eines abgeschlossenen Arbeitspakets

- Issue/PR, Zielcommit, Risikoklasse, verantwortliche Freigabe und CI-Status.
- Betroffene Objekte/Services und überprüfte Abhängigkeiten.
- Sicherungsnachweis und verifizierter Rücknahmeweg entsprechend der Risikoklasse.
- Tatsächlicher Workflow-Run/Deploymentversion, Zeitpunkt, Zielumgebung.
- Ergebnis gezielter Live-Smoke-Tests und fachliche Abnahme; fehlende Nachweise explizit offen.

## Nächste Umsetzungsschritte (nicht durch diese Datei erledigt)

1. Widersprüche der Hostidentitätsprüfung im vollen Frontend- und Preview-Workflow beseitigen – vorher technischen Test und Freigabegates abstimmen.
2. Live-/isolierte E2E-Prüfungen und eine gemeinsame lesbare Release-Evidenz normieren, ohne vorhandene Sicherung neu zu bauen.
3. Edge-CLI-Versionen und Gateway-Flags pro Funktion prüfen und sichere deterministische Bereitstellung entwickeln.
4. Workflow-Auswahl für Entwickler/Redaktion so vereinfachen, dass sie nach Risikoklasse eindeutig ist.
5. **#375 erst nach tatsächlich abgeschlossener RIS-Nutzerabnahme** bearbeiten.

**Abnahmegrenze:** Dieses Dokument ist eine Bestandsaufnahme und Zielskizze, kein bereits technisch validierter neuer Bereitstellungsprozess.
