# RIS #404 – genehmigte Entwicklungsbereitstellung, technischer Teilstand

Stand: 08.11.2026. Ziel: Shared-Apps `apaubomxffcwtzjimori` und
https://fib.pustivo.de/redaktion/. **Vor Sicherung/Deployment gestoppt.**
Freigegebener Merge-Commit: `09a7ec003430f444d53ecd3d9ea78550b1ceda6e`.

## Freigabe und unveränderter Umfang

Der Betreiber hat den begrenzten Entwicklungsrelease aus PR #404 einschließlich
aktueller Sicherung, gezieltem Backend-/Frontend-Deployment und Live-Nachprüfung
explizit freigegeben. Keine erneute fachliche Freigabe notwendig. Kein Auftrag zu
Migration, Datenbereinigung, Cron, Quellenaktivierung, Memorix-/Auth-/Secretänderung,
PDF-/Volltextspeicherung oder weiterer Fachentwicklung. Die acht erfolgreichen
CI-Workflows am geprüften PR-Head werden wiederverwendet, nicht nochmals gestartet.
Der Merge ist bestätigt; origin/main entsprach bei der Prüfung dem freigegebenen Commit.

## Tatsächlich ausgeführte lesende Prüfungen

| Prüfung | Ergebnis / Grenze |
|---|---|
| Shared-Apps | SQL erreichbar, PostgreSQL 17.6, 49 reguläre Tabellen im Schema fib. |
| RIS-/Manifesttabellen | Alle 19 vorhanden, jeweils RLS aktiv und SELECT für fib_app; INSERT für die vorgesehenen 18 Tabellen vorhanden. development_batches benötigt hier nur SELECT. Dies ist eine Katalogprüfung, kein Nachweis der tatsächlichen Edge-DSN-Rolle. |
| Referenzsitzung 15.10. | Weiterhin drei TOPs. Kein Import oder Schreibtest ausgeführt. Vollständige reale 19-TOP-Erfassung bleibt offen. |
| fib-editorial-write | ACTIVE v20, verify_jwt=false, Bundlehash 849ee0668cef37aa4ac56c0d08cddd4dc1693a710968595e827104c345f683c6. |
| fib-u4-ris-pilot | ACTIVE v21, verify_jwt=true, Bundlehash b7e3478b4c70b3bc607d3008e664504203f487d943e0bd3583588fa2223d9c20. |
| Tatsächlicher Function-Code | Über vorhandenen Supabase-Connector gelesen. Entrypoints und unveränderte relative Dateien stimmen textgleich mit dem Zielcommit überein. Die drei geänderten Shared-Module im Editorial-Bundle und ris-structure.ts im RIS-Pilot stimmen noch mit dem Release-Elterncommit überein. Keine abweichende Nebenänderung in diesen exportierten Dateien festgestellt; #404 ist darin noch nicht bereitgestellt. |
| Importabhängigkeiten | TypeScript-AST verfolgt relative Laufzeitimporte; reine Typimporte ausgeschlossen. Von den vorhandenen Functions sind genau editorial-write und u4-ris-pilot betroffen. u4-pilot benötigt kein Update. Der Quellcode-Einstieg fib-u4-ris-scheduled hängt ebenfalls davon ab, ist aber nicht im aktuellen Function-Inventar und wird weder neu deployt noch aktiviert. |
| Frontend | Lesender HTTPS-Aufruf scheitert mit CONNECT-403 vom Envoy-Ausgangsproxy. Host nicht in der Cloud-Netzfreigabe; kein Nachweis eines IONOS-/Anwendungsfehlers. Live-Dateistand/Releasekennung nicht unabhängig prüfbar. |
| GitHub Actions per CLI | Lesender Aufruf der Complete-FIB-backup-Laufliste liefert Forbidden. GH_TOKEN-Präsenz beweist keine Actions-Berechtigung. Der Connector kann konkrete Läufe lesen, stellt aber keinen Workflow-Dispatch bereit. Kein anderer Zugang zum Start eines neuen Laufs nachgewiesen. |

Die zwei Function-Quellvergleiche sind **keine vollständige private Release-Sicherung**:
Es wurden weder alle FIB-Functions zu einem versiegelten Bundle zusammengestellt
noch das Ergebnis in die geschützte Backupablage übertragen und zurückgelesen.

## Sicherungsprüfung und konkrete Blocker

Bestehende Verfahren gelesen: scripts/ris-shared-apps/backup.mjs,
scripts/backup/create.sh, run.py, components.py, bundle.mjs, frontend.py,
frontend-run.py sowie die Workflows Complete FIB backup und Backup published
editorial frontend. Geschützte Werte wurden weder ausgegeben noch aus GitHub-Secrets
extrahiert. Im Executor fehlen die bestehenden Maintenance-, Supabase-Management-,
SFTP-/Hostschlüssel- und rclone-Backupzugänge sowie ein vorhandener AAL2-Prüftoken.
Nur öffentliche Frontend-Konfiguration und ein für den geprüften Actions-Aufruf
nicht ausreichender GitHub-Zugang stehen bereit.

Der vollständige Backup-Workflow benötigt zusätzlich einen bekannten frischen
privaten input_id-Export mit allen FIB-Functions und geprüfter FIB-Konfiguration
unter fib-backup-crypt:Inputs/, das geprüfte Environment fib-release und
FIB_COMPLETE_BACKUP_READY=true. Weder Input-ID noch private Quittung/Manifest-SHA
für diesen Commit liegen hier vor. Die Verfügbarkeit der Actions-Secrets und
Environment-Freigaben ist nicht nachgewiesen; aus fehlenden Executor-Variablen
wird nicht behauptet, GitHub habe keine Secrets.

**Ergebnis: keine aktuelle Gesamtsicherung erstellt oder verifiziert.** Die
frühere erfolgreiche Wiederherstellungsprüfung wird anerkannt; kein Restore
wiederholt. Der bestehende Complete-Workflow führt bei tatsächlichem Aufruf einen
frischen isolierten Restore aus; seine Schutzlogik wurde nicht verändert oder
mit ungeprüften Nachweisen überbrückt. Alte Sicherungen wurden nicht als frisches
Bundle für diesen Release ausgegeben und nicht gelöscht.

## Bereitstellungswege geprüft, nicht ausgeführt

- Das bestehende allgemeine Edge-Workflow deployt pauschal coordination,
  editorial-write, session-context und admin-users mit --no-verify-jwt; der nötige
  RIS-Pilot ist nicht enthalten. Dieser Workflow passt daher nicht zum konkreten
  Release. Nach Sicherung sind die vorhandenen Supabase-Deploy-Mechanismen für
  genau die zwei betroffenen Functions mit bisherigen JWT-Einstellungen zu nutzen.
- Deploy Editorial Web fordert Backup-ID, Manifest-SHA, DEPLOY und
  shared_development=true; das Bundle wird auf Commit, Komponenten und maximal
  eine Stunde Alter geprüft. Der Workflow kann remote Dateien löschen; kein Start
  ohne vollständigen gesicherten Frontend-Vorstand.
- Deploy Editorial Web (frontend only) ist ein vorhandener nichtlöschender
  Entwicklungsweg mit Hostschlüsselprüfung, main-Bindung und FRONTEND-Bestätigung.
  Für dieses Backend-/Frontend-Paket ersetzt er weder aktuelle Gesamtsicherung noch
  vorangehendes Backend-Update. Keine neue Releaseprozedur implementiert.

## Tatsächlicher Abschlussstatus

| Bestandteil | Status |
|---|---|
| Merge-Commit und begrenzte Freigabe | bestätigt |
| Lesende Schema-/Rechte-/Edge-Abhängigkeitsprüfung | ausgeführt |
| Neue vollständige Sicherung und private Rückleseprüfung | blockiert / nicht ausgeführt |
| Edge- und Frontend-Deployment | nicht ausgeführt |
| Tatsächlich bereitgestellter Commit | für #404 keiner durch diesen Durchlauf nachgewiesen |
| Login/MFA, RIS-Anzeige, Zuordnung, Suche, Editor/Locks am Zielsystem | nicht geprüft; fehlender AAL2-Zugang und blockierter Frontend-Netzzugang |
| Rücknahme | keine erforderlich; kein Live-Eingriff |

## Konkrete Fortsetzung und persönliche Nachabnahme

Ein bereits berechtigter Betreiberkontext muss die bestehenden geschützten Zugänge
und den vorhandenen Workflow-Start verfügbar haben. Keine neuen Konten/Schlüssel
und keine Tokens im Chat. Aktuelle Bundle-Erfassung/Integrität/private Rückleseprüfung
abschließen, Quittung und Commitbindung kontrollieren, dann ausschließlich die
zwei Functions aktualisieren und anschließend den vorhandenen Frontend-Workflow
am genehmigten Stand ausführen. Bei zwischenzeitlicher Drift erneut lesend vergleichen.

Danach lesender Hosted-Smoke mit bestehendem Konto/MFA. Keine redaktionellen
Produktivdaten für Schreibtests verändern; schreibende Live-Fälle nur in bereits
geeignetem markiertem Testkontext oder durch die persönliche Nachabnahme. Keine
neuen Testkonten erzeugen. Bestehende isolierte Schreib-/Konkurrenztests bleiben
als solche gekennzeichnet.

Persönlich nach erfolgreichem Release im normalen Firefox prüfen:
1. Bekannte MFA-Anmeldung und Entwicklungskennzeichnung.
2. Sitzung/TOP öffnen: getrennter Titel/Status, ehrliche Teilreferenzkennzeichnung,
   sachliche Beschlusspunkte in der Niederschriftkarte und Original-Link.
3. Im geeigneten Entwicklungsbestand bewusst zuordnen, neu öffnen: direkte Persistenz,
   automatische eindeutige RIS-Fundstellen, keine Dubletten; Aufhebung erhält Daten.
4. Desktop/Handy: Titel-/Datums-/Kurzbeschreibungssuche, Bearbeiten, konkurrierende
   Sperre, Speichern/Abbrechen und Rücknavigation. Keine vollständigen 19 TOPs behaupten.
