# Tests – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 12.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ausführung

Abhängigkeiten mit `npm ci` aus dem eingecheckten Lockfile installieren. Die zusätzlichen isolierten Browser-Testwerkzeuge sind im Workflow versionsgenau angegeben.

- `npm run test:fachservices`: Fachservice-Regressionsfälle.
- `node --test tests/profile-security.test.mjs`: Kontoselbstservice- und Einladungs-Handler einschließlich Fehler- und Identitätswechseln.
- `npm run build --workspace @fib/editorial-web`: TypeScript und Produktionsbuild. Für einen nutzbaren Browserbuild müssen die beiden dokumentierten Vite-Umgebungsvariablen gesetzt sein.
- Workflow `.github/workflows/auth-security.yml`: vollständige isolierte Auth-/SMTP- und Chromium-Abnahme einschließlich Einladungsannahme. Die einzelnen Schritte und ausschließlich kurzlebigen Testvariablen sind dort reproduzierbar definiert. Erfordert Docker; kein Produktivprojekt verknüpfen.

## Sicherheitsgrenzen des Auth-Testaufbaus

`auth-sandbox/run.py` prüft echte GoTrue-Aufrufe und Mailpit-E-Mails. `browser.mjs` prüft Profil und Recovery, `invitation-browser.mjs` Passwort-Erstfestlegung, MFA und getrennte FIB-Freischaltung. `proxy.mjs` führt den tatsächlichen Session-Context-Handler mit synthetischer Mitgliedschaftstabelle aus; Ereignis-/Koordinationsdaten sind weiterhin Fixtures.

Der Testcode akzeptiert ausschließlich Loopback-Auth-Endpunkte. Passwörter, JWT-Schlüssel und Konten werden pro Runner erzeugt. Kein Aufruf verwendet Shared-Apps, vorhandene Konten oder produktive Daten. Fixture-Aktivierungen erfolgen ausschließlich im Testprozess per lokaler Datenbankoperation, niemals über einen öffentlich erreichbaren Freischaltungsendpunkt.

Sanitisierte JSON-/Markdown-Ergebnisse und mobile Ansichten liegen sieben Tage als Workflow-Artifact vor. Keine Auth-Tokens, Passwörter, E-Mail-Linktokens oder MFA-Einrichtungsschlüssel als Artifact ablegen. Der Workflow entfernt Testkonten, Mailbox und Datenbank auch bei Fehlschlag.

Verbindlicher Abnahmestand und verbleibende Produktionsnachweise: `docs/tests/PR-74-Sicherheits-und-Funktionstest.md`.

Weitere fachliche Referenzfälle und Infrastrukturtests werden schrittweise in U1–U6 automatisiert.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 12.10.2026 | Tatsächliche Testbefehle, isolierte Einladungsabnahme und Sicherheitsgrenzen dokumentiert. |
