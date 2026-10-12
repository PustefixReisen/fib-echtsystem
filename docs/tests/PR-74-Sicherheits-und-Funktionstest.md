# PR #74 – Sicherheits- und Funktionstest

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.2 | 12.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ergebnis

**Isolierte Auth-Abnahme erfolgreich; Merge und produktiver Rollout bleiben wegen fehlendem Nachweis der produktiven Auth-Konfiguration blockiert.**

Der Nutzer hat den Merge am 12.10.2026 unter der Bedingung autorisiert, dass sämtliche Sicherheitsanforderungen erfüllt sind. Diese Bedingung ist derzeit noch nicht vollständig nachgewiesen. Eine weitere pauschale Merge-Freigabe wird nicht verlangt.

Geprüfter Implementierungsstand: `dccafb8bbd675e94270f01a67239d65f8e9c31cd`. Nachfolgende Dokumentations- und Hinweistexte werden zusätzlich am abschließenden PR-Stand durch dieselben CI-Prüfungen abgesichert. Maßgeblich sind die Checks des aktuellen PR-Commits.

## Nachweise

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Handler-Regressionen | 16/16 erfolgreich | Editorial Web CI #55, Run 38269619014 |
| Echte Auth-API und abgefangene SMTP-Mails | 31/31 erfolgreich | Isolated Auth Security #6, Run 38269619114 |
| Chromium mit echter lokaler Auth | 13/13 erfolgreich | gleicher Run; Browser-Ergebnisbericht und mobile Vorschau |
| Build und TypeScript | erfolgreich | Editorial Web CI #55; Core Services CI #18, Run 38269619124 |
| Vorhandene Fachservice-Fälle | erfolgreich | Core Services CI #18 |
| Bestehendes Administratorkonto | unverändert | keine schreibenden Aufrufe an produktive Auth oder Datenbank |
| Produktionsparameter vollständig | **offen** | Dashboard verlangt Anmeldung; vorhandener MCP-Zugang stellt Auth-Konfiguration nicht bereit |

Run: https://github.com/PustefixReisen/fib-echtsystem/actions/runs/38269619114

Der Workflow erzeugt `auth-results.json/md`, `browser-results.json/md` und `profile-mobile.png` als auf sieben Tage begrenztes GitHub-Artifact. Dieser Prüfbericht und die reproduzierbaren Tests bleiben im Repository erhalten. Keine Passwörter, JWTs, TOTP-Secrets oder E-Mail-Linktokens werden als Artifact gespeichert.

## Isolierung und Testzugang

Der Workflow `.github/workflows/auth-security.yml` baut auf einem kurzlebigen GitHub-Runner eine vollständig getrennte Testumgebung auf:

- GoTrue `v2.197.0`, identisch zur am 12.10.2026 rein lesend beobachteten Shared-Apps-Auth-Version;
- eigener PostgreSQL-Container und eigenes Auth-Schema, ohne produktive Migrationen oder Daten;
- Mailpit als lokaler SMTP-Empfänger; ausschließlich synthetische Adressen unter `example.test`, keine externen Test-E-Mails;
- Ports ausschließlich an `127.0.0.1` gebunden;
- pro Lauf zufällige Datenbank-, JWT-, Benutzerpasswörter und TOTP-Secrets;
- synthetische Testkonten pro Szenario; Browserkonto hat in den FIB-Service-Fixtures nur die Rolle `editor`;
- keine Supabase-Management-, Service-Role- oder Produktiv-Secrets aus GitHub eingebunden;
- Konten, Mailbox und Datenbank werden im abschließenden `always()`-Cleanup zerstört, der Runner danach verworfen.

Es entsteht kein dauerhafter Testzugang im Produktivprojekt. Die Testzugänge werden bei jedem Lauf automatisch neu erzeugt und sind für wiederholbare Abnahmen bestimmt.

Die Auth-Aufrufe und E-Mail-Bestätigungslinks sind echt. Nur die drei FIB-Datenservices hinter Dashboard/Profil verwenden in der Browserprüfung ausdrücklich synthetische Antworten. Damit ist dies keine erneute Abnahme sämtlicher FIB-RLS- oder Fachservice-Berechtigungen.

## Geprüfte Sicherheitseigenschaften

### E-Mail

- Ohne Bestätigung wird keine Sitzung ausgestellt; Anmeldung wird abgewiesen.
- Gültiger Link führt nur zum erlaubten lokalen Callback.
- Ungültige, bereits verwendete und abgelaufene Bestätigungslinks werden abgewiesen.
- Secure Email Change verlangt Bestätigung der alten und neuen Adresse.
- Nach nur einer Bestätigung bleibt die bisherige Adresse aktiv.
- Nach beiden Bestätigungen funktioniert die neue Adresse; die alte nicht mehr.
- Ein nicht erlaubtes Redirect-Ziel wird durch das erlaubte Site-Ziel ersetzt.
- Die Browseroberfläche bestätigt nur die Anforderung, keine vorzeitige Aktivierung.

### Passwort und Sitzungen

- Server lehnt Passwörter unter zwölf Zeichen ab; der Browser prüft zusätzlich identische Wiederholung.
- AAL2-Passwortwechsel funktioniert; altes Passwort funktioniert danach nicht mehr.
- Neue Anmeldung startet weiterhin mit AAL1 und verlangt den zweiten Faktor.
- Refresh der anderen Testsitzung wird nach Passwortwechsel abgewiesen. Dies bedeutet keine sofortige kryptografische Ungültigkeit jedes bereits ausgestellten Access-JWTs.
- Eine künstlich auf 25 Stunden gealterte AAL2-Testsitzung darf ohne erneute Authentifizierung das Passwort nicht ändern.
- API-Ablehnung, geworfene Anfragefehler und MFA-Fehler lassen die Bedienelemente wieder bedienbar; Passworteingaben werden geleert.
- Profil verlassen und Abmelden bereinigen die sichtbaren Passworteingaben.

### Wiederherstellung

- „Passwort vergessen?“ ist auf der Anmeldeseite ergänzt.
- Anfrage gibt keinen Rückschluss auf das Vorhandensein eines Kontos.
- Der echte Recovery-Link wird im Browser verarbeitet; bei eingerichtetem TOTP bleibt MFA notwendig.
- Nach MFA öffnet sich das Profil mit Aufforderung zur Passwortneuvergabe.
- Passwortneuvergabe funktioniert; das vorherige Passwort wird anschließend abgewiesen.
- Verbrauchte und abgelaufene Recovery-Links werden abgewiesen.
- Verlust des zweiten Faktors wird damit bewusst nicht umgangen; MFA-Faktorwechsel/Notfallverfahren bleibt ein gesonderter Entwicklungsschritt.

### Serverseitige MFA

Für Testkonten mit verifiziertem TOTP-Faktor wurden direkte `PUT /user`-Anfragen unter AAL1 ausgeführt, also ohne die FIB-Oberfläche. E-Mail- und Passwortänderung werden vom Auth-Server mit `insufficient_aal` abgewiesen. Ein falscher TOTP-Code wird abgewiesen; gültige Verifikation erzeugt AAL2. Auch eine Recovery-Sitzung mit AAL1 kann vor MFA das Passwort nicht ändern.

Diese Aussage gilt ausdrücklich für Konten mit eingerichtetem Faktor. FIB-Zulassung/Aktivstatus und die MFA-Pflicht für redaktionelle Fachservices bleiben gemäß `docs/Rollen-Rechte-und-Workflow.md` zusätzlich erforderlich.

## Fehler und Korrekturen

1. Bereits im ersten Review: unbehandelte Anfrage-Ausnahmen ließen Busy-Zustand und Passworteingaben stehen; durch `try/catch/finally` und Regressionen behoben.
2. In diesem Arbeitsblock: fehlender Recovery-Einstieg und fehlende gezielte Rückkehr in die Passwortmaske ergänzt; mit echtem E-Mail-Link und TOTP im Browser geprüft.
3. Gemeinsamer Kontoumfang wird im Profil verständlich angezeigt: Zugangsdatenänderungen betreffen alle Apps, die dasselbe Auth-Konto verwenden.
4. Testaufbau: fehlendes Auth-Schema/Search-Path und Erreichbarkeit des Containerports korrigiert. Das waren Aufbaufehler, keine Anwendungssicherheitsbefunde.
5. Ablaufdatum-Test: Der rohe GoTrue-Default beträgt 24 Stunden. Zwei Stunden Alter waren deshalb noch nicht abgelaufen. Der Testaufbau setzt nun die Gültigkeit ausdrücklich auf 3600 Sekunden; zwei Stunden alte Links werden korrekt abgewiesen. Keine Änderung der produktiven Einstellung.
6. Mobile Testaufnahme: Beim Wechsel von Desktop auf Mobil wurde zunächst die laufende Navigationsanimation aufgenommen. Der Browsertest wartet jetzt ausdrücklich auf die vollständig geschlossene Navigation und prüft zusätzlich deren Position.

## Tatsächlicher Produktionsstand und offene Nachweise

Rein lesend geprüft:

- Projekt `Shared-Apps`, Ref `apaubomxffcwtzjimori`;
- GoTrue `v2.197.0`;
- E-Mail-Provider aktiv, `mailer_autoconfirm=false`;
- anonyme Anmeldung deaktiviert;
- Dashboard-Zugriff im verfügbaren Browser endet an der Anmeldeseite.

Vor Merge nachweisen:

1. Secure Email Change ist aktiviert; alte und neue Adresse müssen bestätigen.
2. Serverseitige Passwort-Mindestlänge und aktivierte Reauthentifizierungs-/Current-password-Anforderungen sind mit dem Clientablauf kompatibel.
3. Site URL und Redirect-Allowlist erlauben den exakten FIB-Callback; keine unnötig weiten Wildcards.
4. Gültigkeitsdauer und E-Mail-Templates für Bestätigung/Recovery sind geeignet; keine abweichenden Link-/Tokenpfade.
5. Produktive SMTP-Zustellung ist für die benötigten Auth-E-Mails nutzbar. Lokale SMTP-Erfolge belegen keine externe Zustellbarkeit.
6. Auswirkungen möglicher Konfigurationsänderungen auf weitere Shared-Apps-Anwendungen bewerten. Projektweite Einstellungen nicht stillschweigend verändern.

Der produktive Parameterabgleich benötigt einen schreibgeschützten Einblick nach Supabase-Dashboard-Anmeldung oder gleichwertige vom Nutzer bereitgestellte Konfigurationsnachweise. Keine Zugangsdaten im Chat anfordern. Erst nach Schließen dieser Punkte darf die vorhandene bedingte Merge-Erlaubnis genutzt werden.

## Wiederholung

Automatisch bei einschlägigen PR-Änderungen: `Isolated Auth Security`, `Editorial Web CI`, `Core Services CI`.

Lokal mit Docker: ausschließlich die Dateien unter `tests/auth-sandbox/` verwenden und die im Workflow dokumentierten Schritte ausführen. Der Testcode akzeptiert keine externen Auth-Endpunkte. Kein `supabase link`, keine Produktivmigration und kein Produktionssecret erforderlich.

## Nächster Schritt

Produktive Auth-Konfiguration und Zustellbarkeit abgleichen, offene Abweichungen entscheiden und erst dann PR #74 mergen. Danach sicherer MFA-Faktorwechsel und dokumentierte Notfallwiederherstellung, ohne die verpflichtende MFA abzusenken.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.2 | 12.10.2026 | Isolierte reale Auth-/SMTP- und Browserprüfung aufgebaut, Recovery-Weg ergänzt, Ergebnisse und verbleibenden Produktionsnachweis getrennt dokumentiert; bedingte Merge-Erlaubnis berücksichtigt. |
| 0.1 | 12.10.2026 | Initialreview, reproduzierte Fehler, Handler-Tests und offene Live-Abnahme dokumentiert. |
