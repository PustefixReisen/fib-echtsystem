# PR #74 – Sicherheits- und Funktionstest

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.3 | 12.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ergebnis

**Isolierte Auth- und Einladungsabnahme erfolgreich; Merge und produktiver Rollout bleiben wegen fehlendem Nachweis der produktiven Auth-Konfiguration blockiert.**

Der Nutzer hat den Merge am 12.10.2026 unter der Bedingung autorisiert, dass sämtliche Sicherheitsanforderungen erfüllt sind. Diese Bedingung ist derzeit noch nicht vollständig nachgewiesen. Eine weitere pauschale Merge-Freigabe wird nicht verlangt.

Geprüfter Implementierungsstand: `db27419826f2287e26d7768f8720bb10cfe24d06`. Der Abschlussstand ergänzt die Dokumentation, ein Dependency-Lockfile, reproduzierbare CI-Installation und präzisere AAL1-/Metadata-Testvorbedingungen. Er wird erneut durch dieselben CI-Prüfungen abgesichert; deren Ergebnisse stehen am PR. Maßgeblich sind die Checks des aktuellen PR-Commits.

## Nachweise

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Handler-Regressionen | 23/23 erfolgreich | Editorial Web CI #59, Run 38282928760 |
| Echte Auth-API und abgefangene SMTP-Mails | 41/41 erfolgreich | Isolated Auth Security #10, Run 38282928919 |
| Profil-/Recovery-Browserprüfungen | 13/13 erfolgreich | gleicher Run |
| Einladungs-/Freischaltungsprüfungen | 27/27 erfolgreich | gleicher Run; tatsächlicher Session-Context-Handler |
| Build und TypeScript | erfolgreich | Editorial Web CI #59; Core Services CI #22, Run 38282929072 |
| Vorhandene Fachservice-Fälle | 23/23 erfolgreich | Core Services CI #22 |
| Bestehendes Administratorkonto | unverändert | keine schreibenden Aufrufe an produktive Auth oder Datenbank |
| Produktionsparameter vollständig | **offen** | Dashboard verlangt Anmeldung; vorhandener MCP-Zugang stellt Auth-Konfiguration nicht bereit |

Run: https://github.com/PustefixReisen/fib-echtsystem/actions/runs/38282928919

Der Workflow erzeugt `auth-results.json/md`, `browser-results.json/md`, `invitation-results.json/md`, `profile-mobile.png` und `invitation-pending.png` als auf sieben Tage begrenztes GitHub-Artifact. Dieser Prüfbericht und die reproduzierbaren Tests bleiben im Repository erhalten. Keine Passwörter, JWTs, TOTP-Secrets oder E-Mail-Linktokens werden als Artifact gespeichert.

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

Die Auth-Aufrufe und E-Mail-Bestätigungslinks sind echt. Seit der Einladungserweiterung führt der Test-Gateway den unveränderten produktiven `fib-session-context`-Handler aus. Dafür werden nur Deno-Import/Umgebungszugriff an Node angepasst; Auth-Validierung und Mitgliedschaftsprüfung bleiben der echte Handlercode. Die Datenbank enthält eine minimale synthetische `fib.app_users`-Tabelle mit passenden Spalten und Rollenconstraint. Ereignis-/Koordinationsantworten bleiben synthetisch und werden durch dieselbe Mitgliedschaftsprüfung geschützt. Dies ist keine Abnahme sämtlicher FIB-RLS-Regeln, Laufzeit-DB-Privilegien oder des produktiven Edge-Deployments.

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

## Erweiterung: sichere Einladungsannahme

Fachliche Grundlage ist Abschnitt 9.1 in `docs/Rollen-Rechte-und-Workflow.md`; der betriebliche Ablauf steht in Abschnitt 12.2 von `docs/Betrieb-und-Wiederherstellung.md`.

Implementiert:

- Einladung öffnet eine separate, tabgebundene Auth-Sitzung, ohne vorhandene normale Kontositzungen zu überschreiben.
- Ein eingeladener Benutzer legt zuerst ein Passwort mit identischer Wiederholung fest; vor der Änderung wird die Auth-Identität erneut serverseitig gelesen. Die serverseitige Passwortpolicy wird nicht umgangen.
- Danach TOTP-Einrichtung und Codebestätigung. Bereits vorhandene bestätigte Faktoren bleiben erforderlich. Wiederaufnahme ersetzt ausschließlich den vom Tab zuvor erzeugten unbestätigten Faktor.
- Ungültige/abgelaufene/verbrauchte Links zeigen einen generischen Fehler und entfernen Fehlerdetails aus der URL. Eine manipulierte Invite-Kennung öffnet keine Passwortmaske für eine bestehende normale Sitzung.
- Nach MFA gibt es bei fehlender oder inaktiver Mitgliedschaft eine Warteansicht. Ein erneuter Prüfknopf kann nur den Status lesen. Erst der erfolgreiche `fib-session-context`-Aufruf öffnet den Redaktionsbereich und startet die Fachdatenabfragen.
- Keine automatische Mitgliedschaftserzeugung, Aktivierung oder Rollenvergabe. Einrichtungsfortschritt in Session Storage ist ausschließlich Benutzerführung. Er ist weder ein serverseitiger Nachweis der Passwortfestlegung noch ein Freischaltungsmerkmal.
- Anmeldemaske enthält keine vorausgefüllte persönliche Administratoradresse mehr. Abmelden betrifft die aktuelle Sitzung.

Abnahmematrix:

| Grenze | Prüfung |
|---|---|
| Auth-Einladung | echter Versand an Mailpit, gültiger/verbrauchter/abgelaufener Link, AAL1, Passwortpolicy und erste Anmeldung |
| Bestehendes Konto | erneute Einladung an bestätigtes Konto abgewiesen; Passwort unverändert; normale Browsersitzung bei anderem Invite unverändert |
| Passwortmaske | falsche Wiederholung, Serverablehnung, Netzwerkfehler, Identitätswechsel, Doppelklick, erfolgreiche Bereinigung |
| MFA | falscher Code bleibt gesperrt; bestätigter Faktor erreicht AAL2; unterbrochene Einrichtung sicher wiederaufnehmbar |
| Freischaltung | echter Handler: ohne Mitgliedschaft, inaktiv, nur `active=true`, manipulierte `user_metadata`, aktivierter Redakteur, AAL1 trotz Aktivierung, spätere Deaktivierung |
| Benutzerführung | Passwort → MFA → Freischaltung; Neuladen; keine FIB-Serviceaufrufe vor Passwort/MFA; mobile Warteansicht |

Ergebnis: **104 Auth-/Funktionsprüfungen erfolgreich**, zusätzlich alle 23 bestehenden Fachservice-Fälle. Die mobile Warteansicht wurde anhand des gespeicherten Screenshots geprüft. Im ersten Lauf waren alle 41 Auth-API-Tests und 13 bisherigen Browsertests erfolgreich; die Einladungsprüfung fand einen vorzeitigen Session-Context-Aufruf: Das Entfernen des Auth-Fragments löste `popstate` und damit einen Datenladeversuch aus. Der Server wies ihn ab. Der Aufruf wurde durch eine explizite AAL2-/Einrichtungsprüfung und die Entkopplung von Navigation und Datenladen verhindert. Der korrigierte Ablauf besteht die explizite Prüfung, dass vor Passwort und MFA kein FIB-Service aufgerufen wird. Die Testumgebung wurde im erfolgreichen Cleanup wieder entfernt.

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
6. Einladungsziel und Einladungstemplate müssen zum getesteten Standard-ConfirmationURL-Ablauf passen; erstmalige Passwortfestlegung und MFA dürfen nicht an fehlender FIB-Mitgliedschaft scheitern. Produktive Zustellung auch für Einladungen nachweisen.
7. Auswirkungen möglicher Konfigurationsänderungen auf weitere Shared-Apps-Anwendungen bewerten. Projektweite Einstellungen nicht stillschweigend verändern.

Der produktive Parameterabgleich benötigt einen schreibgeschützten Einblick nach Supabase-Dashboard-Anmeldung oder gleichwertige vom Nutzer bereitgestellte Konfigurationsnachweise. Keine Zugangsdaten im Chat anfordern. Erst nach Schließen dieser Punkte darf die vorhandene bedingte Merge-Erlaubnis genutzt werden.

## Technische Referenzen und Reproduzierbarkeit

- Supabase: `auth.admin.inviteUserByEmail`, `auth.updateUser`, `auth.onAuthStateChange`; offizielle Referenz unter https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail.
- Installierte Auth-Bibliothek und GoTrue-Version wurden gegen die aktuelle Dokumentation geprüft. Der Changelog vom 12.10.2026 enthält eine zukünftige TLS-Cipher-Abkündigung, aber keine Änderung dieses Browser-Einladungsablaufs.
- Root-Lockfile hält den geprüften Anwendungs-Abhängigkeitsstand fest; reguläre CI verwendet `npm ci`. Zusätzliche Testwerkzeuge Playwright 1.56.1 und Postgres-Client 3.4.7 sind im isolierten Workflow fest versioniert.

## Wiederholung

Automatisch bei einschlägigen PR-Änderungen: `Isolated Auth Security`, `Editorial Web CI`, `Core Services CI`.

Lokal mit Docker: ausschließlich die Dateien unter `tests/auth-sandbox/` verwenden und die im Workflow dokumentierten Schritte ausführen. Der Testcode akzeptiert keine externen Auth-Endpunkte. Kein `supabase link`, keine Produktivmigration und kein Produktionssecret erforderlich.

## Nächster Schritt

Produktive Auth-Konfiguration und Zustellbarkeit abgleichen, offene Abweichungen entscheiden und erst dann PR #74 mergen. Danach die gesicherte Administratoroberfläche für Einladen und getrenntes Freischalten mit Bestätigung und Audit ergänzen; anschließend sicherer MFA-Faktorwechsel und dokumentierte Notfallwiederherstellung, ohne die verpflichtende MFA abzusenken.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.3 | 12.10.2026 | Einladungsannahme, Passwort-Erstfestlegung, MFA-Wiederaufnahme und tatsächliche serverseitige Mitgliedschaftsprüfung in isolierter Umgebung ergänzt; produktive Einladungsnachweise als Merge-Bedingung festgehalten. |
| 0.2 | 12.10.2026 | Isolierte reale Auth-/SMTP- und Browserprüfung aufgebaut, Recovery-Weg ergänzt, Ergebnisse und verbleibenden Produktionsnachweis getrennt dokumentiert; bedingte Merge-Erlaubnis berücksichtigt. |
| 0.1 | 12.10.2026 | Initialreview, reproduzierte Fehler, Handler-Tests und offene Live-Abnahme dokumentiert. |
