# PR #74 – Sicherheits- und Funktionstest

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 13.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ergebnis

**Isolierte Abnahme erfolgreich; administrativer Einladungsweg implementiert und mit 14 zusätzlichen Fällen geprüft. Der echte Admin-Zugang scheitert vor Kontoanlage/Versand mit HTTP 403. Vollständige Live-Abnahme und appübergreifende Freigabe bleiben offen. PR #74 nicht gemergt.**

Der Nutzer hat den Merge am 12.10.2026 unter der Bedingung autorisiert, dass sämtliche Sicherheitsanforderungen erfüllt sind. Diese Bedingung ist derzeit noch nicht vollständig nachgewiesen. Eine weitere pauschale Merge-Freigabe wird nicht verlangt.

Aktuell geprüfter Anwendungs-/Teststand: `ff40282cb50097a9e0c57b03ec63f6fa6792c7d6`. Isolated Auth Security #15, Editorial Web CI #64 und Core Services CI #27 sind erfolgreich: 138 Prüfungen insgesamt. Die Passwortanzeige erforderte eine gezielte Erweiterung und erneute isolierte Prüfung. Die nachfolgende Ergebnisdokumentation ändert nur Dokumente; keine weiteren erfolgreichen Live-Tests wurden wiederholt. Vor einem Merge sind aktueller Head, geltende Pflichtchecks und abgeschlossene Live-Nachweise erneut abzugleichen.

## Nachweise

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Handler-Regressionen | 23/23 erfolgreich | Editorial Web CI #64, Run 38384360113 |
| Echte Auth-API und abgefangene SMTP-Mails | 41/41 erfolgreich | Isolated Auth Security #15, Run 38384360164 |
| Profil-/Recovery-Browserprüfungen | 21/21 erfolgreich | gleicher Run |
| Einladungs-/Freischaltungsprüfungen | 30/30 erfolgreich | gleicher Run; tatsächlicher Session-Context-Handler |
| Build und TypeScript | erfolgreich | Editorial Web CI #64; Core Services CI #27, Run 38384360120 |
| Vorhandene Fachservice-Fälle | 23/23 erfolgreich | Core Services CI #27 |
| Bestehendes Administratorkonto | unverändert | keine Änderungen am Admin-Konto; einzige Auth-Schreibaktion ist die unten dokumentierte Testkonto-Einladung |
| Auth-/SMTP-Grundkonfiguration | nachgewiesen | Nutzerkommentar vom 13.10.2026 zu Dashboard-/Zustellnachweisen vom 12.10.2026; Details unten |
| Produktiver Session-Context-Code | identisch zum geprüften Handler | Edge Function Version 2, SHA-256 unten |
| Live-MFA / Recovery / Warteansicht | **bestanden im dokumentierten Umfang** | Nutzer-Screenshots, Metadaten und erneute Anmeldung; siehe Live-Nachweise unten |
| Live-Ersteinladung / Reauth / direkte API-Negativtests | **offen** | vollständige Erstpasswortkette und verbleibende Restmatrix noch nicht nachgewiesen |

Run: https://github.com/PustefixReisen/fib-echtsystem/actions/runs/38384360164

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

## Produktionsabgleich vom 13.10.2026

### Bereits anerkannte Nachweise

Primärnachweis: [GitHub-Kommentar des Projekteigentümers vom 13.10.2026, 08:08 UTC](https://github.com/PustefixReisen/fib-echtsystem/pull/74#issuecomment-6141195395). Er dokumentiert die gemeinsame Dashboard-Prüfung und Nutzer-Screenshots vom 12.10.2026, ausdrücklich noch keine Live-Flow-Abnahme. Die Screenshots wurden in diesem Arbeitsblock nicht erneut erhoben.

| Gegenstand | Nachgewiesener Stand |
|---|---|
| Secure Email Change | aktiviert |
| Secure Password Change / Mindestlänge | aktiviert / 12 Zeichen, im Kommentar nach Nutzerbestätigung |
| Redirects | exakte FIB-Ziele `https://fib.pustivo.de/redaktion/` und `https://fib.pustivo.de/redaktion-preview/` hinterlegt; keine Aussage über Vollständigkeit aller übrigen Allowlist-Einträge |
| Site URL | `https://fib.pustivo.de/redaktion/`, gilt projektweit |
| Bestätigung / E-Mail-Änderung / Recovery | Templates verwenden `{{ .ConfirmationURL }}` |
| E-Mail-OTP | 3600 Sekunden, Länge 8 |
| SMTP | Custom SMTP aktiv, `system@pustivo.de`, `smtp.ionos.de:465` |
| Tatsächliche Zustellung | Einladung an korrigierte Gmail-Testadresse eingegangen, Absender Pustivo System; Link `type=invite`, Redirect zur Redaktion |

Damit entfallen SMTP-Grundversand und erneute Erhebung dieser Einstellungen als offene Aufgaben. Eine neue Einladung ist nur wegen Ablauf und korrektem Vorschauziel nötig, nicht als Wiederholung des Zustell-Grundtests. Der vollständige Einladungstemplate-Text ist nicht neu geprüft; das zugestellte Standardlink-Format ist belegt. Der zuvor nicht belegte Current-password-Schalter wurde anschließend am 13.10.2026 direkt lesend geprüft: „Require current password when updating“ ist ausgeschaltet. „Secure password change“ ist eingeschaltet; die Oberfläche erläutert eine frische Anmeldung innerhalb von 24 Stunden als Voraussetzung für Änderung ohne zusätzliche Reauthentifizierung. Es wurde nichts gespeichert oder umgestellt.

### Zusätzliche rein lesende Prüfung

Projekt: `Shared-Apps`, Ref `apaubomxffcwtzjimori`. Keine produktiven Einstellungen, Konten, Faktoren, Mitgliedschaften oder Fachdaten wurden verändert.

- Der produktiv aktive `fib-session-context` Version 2 ist bytegleich zum isoliert geprüften Repository-Handler. SHA-256 beider Quellen: `4c7ac02776e798c7b27cdd94cee1c4d7e8dd9852b60ce3304119cc0ca8e9350f`. Er validiert das Token über Auth `/user`, prüft passende Benutzer-ID und AAL2 und verlangt anschließend `active=true` und `setup_status='active'`. Die eigene Prüfung ist relevant, da `verify_jwt=false` gesetzt ist.
- `fib.app_users`: RLS aktiviert; keine in den geprüften Grants ausgewiesenen Tabellenrechte für `anon` oder `authenticated`. `fib_runtime` besitzt SELECT/INSERT/UPDATE/DELETE und eine ALL-Policy. Die Edge-Funktion muss daher ihre eigene Identitäts-/MFA-/Mitgliedschaftsprüfung erzwingen. Rollenconstraint erlaubt ausschließlich `editor` und `admin`; Setup-Constraint umfasst `invited`, `setup_pending`, `active`, `deactivated`. Dies ist ein gezielter Katalogabgleich, keine vollständige Prüfung aller Funktionen, vererbten Rechte oder FIB-Fachservices.
- Unter den seit 12.10.2026 eingeladenen Benutzern ist genau ein Kandidat vorhanden: Einladung am 12.10.2026 um 16:54 UTC, E-Mail unbestätigt, keine Anmeldung, kein bestätigter MFA-Faktor, keine FIB-Mitgliedschaft. Die Metadaten allein belegten die Testidentität nicht; sie wurde anschließend vom Nutzer ausdrücklich bestätigt (siehe unten). Keine E-Mail-Adresse oder Auth-ID wird öffentlich dokumentiert.
- Frühere Bestandsaufnahme vor Bereitstellung: Ausgelieferte Assets: `/redaktion/assets/index-CVyBjoDX.js` und `/redaktion-preview/assets/index-Bk0EhNRQ.js`. Beide enthalten weder die neue Einladungssitzung (`fib-invitation-storage-key`) noch die Warteansicht „Freischaltung ausstehend“. Zu diesem Prüfzeitpunkt war die Vorschau noch keine PR-74-Testoberfläche; dieser Blocker ist durch den unten belegten Preview-Lauf inzwischen geschlossen.
- Der vorhandene Workflow `.github/workflows/editorial-web-preview.yml` kann den geprüften Commit über `preview_ref` ausschließlich in `redaktion-preview` bereitstellen. Er wird manuell gestartet. Die verfügbare GitHub-Anbindung bietet keinen Workflow-Dispatch. Die ausdrückliche Browser-Erlaubnis des Nutzers vom 13.10.2026 liegt inzwischen vor; der Workflow wurde über die GitHub-Oberfläche gestartet. Kein alternativer Trigger oder produktiver Merge wurde eingerichtet.
- Die zielgerichtete Suche im verbundenen Gmail nach Einladungen vom dokumentierten Absender am 12.–13.10. lieferte keinen Treffer. Daraus folgt keine Aussage über die bereits nachgewiesene Zustellung an das andere Testpostfach. Ein verwendbarer Link beziehungsweise eine Testkonto-Sitzung liegt hier nicht vor. Der gestrige Link ist bei der dokumentierten Gültigkeitsdauer für den anstehenden Test zu alt; er wurde nicht verbraucht oder aus der Datenbank rekonstruiert.

### Fortschritt nach sicherer Browser-Anmeldung

- Die zunächst nicht bedienbare manuelle Browserübernahme wurde für die Anmeldung durch `browserAuth` ersetzt. GitHub-Passwort, Gerätebestätigung und Supabase-Anmeldemethode wurden über geschützte Eingaben verarbeitet; keine Werte in Chat, Bericht oder Repository übernommen. Beide Verwaltungsoberflächen zeigen eine erfolgreich angemeldete Sitzung.
- [Preview Editorial Web #14](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/38375232331), gestartet am 13.10.2026 um 09:17 UTC: Build und Deploy erfolgreich, insgesamt 36 Sekunden. Der Build-Job `115221829796` bestätigt Checkout des geprüften Anwendungscommits `7b67129f1fa54aca827e79c246e5f4a42992cd1c`. Der in der Laufübersicht angezeigte `main`-Commit `52a81b6` bezeichnet den Workflowstand, nicht den über `preview_ref` ausgecheckten Anwendungscode.
- Die geöffnete Vorschau `https://fib.pustivo.de/redaktion-preview/` zeigt die Anmeldemaske einschließlich Recovery-Einstieg und lädt `/redaktion-preview/assets/index-BZhdxKli.js`, identisch zum Build-Log. Nur der bestehende Vorschau-Workflow wurde ausgeführt; kein Produktionsdeploy, keine Änderung von Auth oder Fachdaten. Die Vorschau verwendet weiterhin Shared-Apps als Backend.
- Dashboard-MFA: TOTP **Enabled**, maximal 10 Faktoren pro Benutzer, SMS-MFA deaktiviert, „Limit duration of AAL1 sessions“ **an**; angegebene Grenze 15 Minuten bis zur Faktorbestätigung. Das Aktivieren von TOTP allein ist keine appweite Zugriffsfreigabe; der FIB-Handler erzwingt weiterhin AAL2. Die 15-Minuten-Grenze ist ein zusätzlicher Produktionsparameter, dessen Zeitablauf nicht durch die bisherigen isolierten Tests nachgewiesen ist. Bei der Live-Einrichtung auf Wiederanmeldung nach Ablauf achten; keine künstliche Alterung produktiver Sessions.
- Im Dashboard-Einladungsdialog sind ausschließlich Empfänger-E-Mail, Abbrechen und Einladen vorhanden, kein `redirectTo`-Feld. In diesem ersten Prüfschritt wurde der Versand nicht ausgelöst: Mit der nachgewiesenen Standard-Site-URL würde die Einladung die noch nicht freigegebene Produktionsoberfläche statt der Vorschau öffnen. Site URL/Templates wurden nicht verändert. Ein autorisierter Einladungsweg mit explizitem Vorschauziel beziehungsweise eine sichere manuelle Übergabe dieses Links ist weiterhin erforderlich.
- Neue Passwörter und MFA-Zugangsmittel dürfen nach der Browser-Sicherheitsregel nicht durch den Agenten im Browser festgelegt werden. Die erstmalige Festlegung muss durch die Testperson bei einer funktionsfähigen sicheren Übernahme erfolgen; `browserAuth` ist nur für bestehende Anmeldung vorgesehen. Der fehlgeschlagene manuelle Eingabeweg ist für diesen Schritt noch nicht als behoben nachgewiesen.

### Bestätigtes Testkonto und erneuerte Einladung

**Historischer Versuch; nicht erneut anwenden:** Der nachfolgende manuelle Vorschau-Linkweg lieferte keinen vollständigen Erstpasswortnachweis. Neue Einladungen müssen bereits beim Erzeugen das erlaubte Preview-Redirect enthalten. Verbrauchte Links nicht bearbeiten oder erneut öffnen; das inzwischen bestätigte MFA-Testkonto nicht zurücksetzen oder löschen.

Am 13.10.2026 hat der Nutzer das gestern eingeladene Googlemail-Konto ausdrücklich als Testkonto bestätigt. Damit ist die Empfängerzuordnung abgeschlossen. Über den Dashboard-Einladungsdialog wurde ausschließlich für dieses bestehende, noch unbestätigte Testkonto eine neue Einladung ausgelöst. Rein lesender Nachweis: `invited_at` und `confirmation_sent_at` sind nun **13.10.2026, 09:36:53 UTC (11:36:53 Europe/Berlin)**; E-Mail weiterhin unbestätigt, keine Anmeldung, keine FIB-Mitgliedschaft. Kein neues Konto, keine Rollenvergabe, keine Änderung an bestehenden Administratorkonten oder projektweiten Einstellungen. Die tatsächliche Ankunft dieser neuen Nachricht ist noch nicht durch das Testpostfach bestätigt.

Der Dashboard-Versand verwendet weiterhin das Produktions-Rücksprungziel. Für die begrenzte Vorschau-Abnahme übernimmt die Testperson die Navigation selbst: Link aus der neuen E-Mail in die Adresszeile kopieren, **vor dem Aufruf** nur den Zielpfad im `redirect_to`-Parameter von `/redaktion/` auf `/redaktion-preview/` ändern (bei URL-Encoding entsprechend `%2Fredaktion%2F` auf `%2Fredaktion-preview%2F`). Auth-Host, Token und `type=invite` unverändert lassen. Nur ausführen, wenn das Ziel eindeutig erkennbar ist; bei abweichendem Linkformat abbrechen. Keine Links oder Secrets im Chat übergeben. Erst auf der erkennbaren Vorschau das Passwort festlegen und anschließend MFA selbst einrichten. Dies ist ein manueller Vorschau-Testweg, keine Abnahme einer automatisch mit Preview-Redirect erzeugten Einladung und keine dauerhafte Benutzeranleitung für den Produktivbetrieb.

### Memorix-Auswirkungen

Rein lesende Prüfung des Memorix-Stands `522d1380fd807ac3d38464a470f1616f70e3c709`:

- `docs/02-sicherheit-und-datenschutz.md`: gemeinsame Authentifizierung ersetzt keine appbezogene Autorisierung; Memorix bleibt im Schema `public`. Keine Memorix-Daten oder -Policies wurden für diese Abnahme verändert.
- `src/services/supabase-client.ts`: regulärer und ephemerer Client verwenden `detectSessionInUrl:false`. `src/services/supabase-metadata-smoke-test.ts` meldet den Testbenutzer direkt mit `signInWithPassword` an; dieser geprüfte Einstieg nutzt keinen E-Mail-Redirect. Die Site URL ist daher für genau diesen Passwortlogin kein Rücksprungziel. Das ist eine Codebewertung, kein ausgeführter Android-/Memorix-Livetest.
- Projektweite Passwort-, E-Mail- und MFA-Kontoeigenschaften gelten auch bei Verwendung desselben Auth-Kontos durch Memorix. Passwortänderungen können andere Sitzungen betreffen. **Korrektur gegenüber v1.1:** FIB vergibt zwar keine Memorix-Mitgliedschaft; daraus folgt aber keine vollständige Memorix-Zugangssperre. Die nachfolgend geprüften vorhandenen Memorix-Regeln erlauben bereits authentifizierten Konten eigene Logbücher.
- Ergänzender Codeabgleich am 13.10.2026: Zusätzlich existiert ein eigenständiges Expo-Router-Paket unter `app/`. `app/src/lib/supabase.ts` erzeugt einen Client ohne explizite Auth-Optionen; `app/src/app/index.tsx` ruft `signUp({ email, password })` ohne `emailRedirectTo` sowie `signInWithPassword` auf. Dieser Registrierungsweg hat somit kein eigenes Memorix-Rücksprungziel und fällt bei der gemeinsamen Konfiguration auf die FIB-Site-URL zurück. Die Aussage zum Root-Client mit `detectSessionInUrl:false` gilt ausdrücklich nicht für dieses zweite Paket. In dem geprüften Formular ist keine MFA-Challenge implementiert.
- `docs/01-architektur.md` bezeichnet den Repository-Stand ausdrücklich als Entwicklungs-/Testbetrieb, nicht Produktivbetrieb; `docs/08-betrieb-und-reproduzierbarkeit.md` gibt produktive geräteübergreifende Synchronisation weiterhin nicht frei. Root-`package.json`/`App.tsx` starten `expo/AppEntry.js` mit `EventsScreen`, während `app/package.json` einen zweiten Router-Einstieg enthält. Daraus lässt sich der tatsächlich installierte Test-Build nicht sicher bestimmen. Vor einer gemeinsamen Auth-Freigabe muss dieser Einstieg abgegrenzt und ein unterstützter E-Mail-/MFA-Weg festgelegt werden. Kein Memorix-Smoke-Test wurde ausgeführt, weil diese Tests Remote-Daten schreiben würden.
- Ein E-Mail-Flow ohne explizites erlaubtes Memorix-Ziel würde auf die FIB-Site-URL zurückfallen. Der geprüfte Defaultclient verarbeitet solche URL-Sitzungen nicht. Deshalb ist keine pauschale Freigabe von Memorix-Bestätigung/Recovery/Einladung ableitbar. Vor Abschluss ist der tatsächlich unterstützte Memorix-Auth-Umfang einschließlich benötigter Callback-Ziele zu bestätigen; andernfalls bleibt diese Kompatibilitätsgrenze offen. Keine projektweite Einstellung allein für FIB ändern.

### Ergebnis der vertieften Memorix-Prüfung (13.10.2026)

Repository-Head `522d1380fd807ac3d38464a470f1616f70e3c709` unverändert bestätigt. Rein lesend wurden `pg_policies`, Tabellenprivilegien/RLS, die referenzierten Rechtefunktionen und Triggerdefinitionen in Shared-Apps geprüft; keine privaten Memorix-Fachzeilen gelesen und keine Memorix-Objekte geändert.

- `public.logbooks`: RLS aktiv, `authenticated` besitzt INSERT, Policy `logbooks_insert` hat `WITH CHECK true`. Der BEFORE-INSERT-Trigger `set_logbook_owner_id_from_auth` setzt den Eigentümer zwingend auf `auth.uid()`. Ein neuer authentifizierter FIB-Testnutzer kann damit grundsätzlich ein eigenes Memorix-Logbuch anlegen; hierfür gibt es in den geprüften Regeln keine zusätzliche App-Freischaltung und keine AAL2-Bedingung.
- Vorhandene Logbücher/Ereignisse: `user_can_read_logbook` / `user_can_write_logbook` prüfen Eigentümer bzw. aktive Mitgliedschaften/Rollen; `can_read_event` / `can_edit_event` prüfen Eigentümer oder akzeptierte Freigaben. Eine FIB-Einladung allein gewährt dadurch keinen Zugriff auf fremde vorhandene Inhalte. Dies ist ein gezielter Regelabgleich, kein vollständiger Memorix-Sicherheitsaudit.
- `public.profiles` erlaubt dem angemeldeten Nutzer ein eigenes Profil. Die Triggerabfrage zeigte keinen nichtinternen Trigger auf `auth.users`, der bei Kontoanlage automatisch Memorix-Fachobjekte erzeugt. Es wurden keinerlei Logbücher/Profile/Testdaten in `public` angelegt.
- Die zwei Auth-Einstiege bleiben unterschiedlich: Root-Development-Client mit direktem Passwortlogin und deaktivierter URL-Sitzungserkennung; zusätzliches `app/`-Registrierungsformular ohne `emailRedirectTo` und ohne MFA-Challenge. Die globale FIB-Site-URL ist für dessen Bestätigung daher ein konkretes Fehlleitungsrisiko. Gleiche Shared-Apps-Identität bedeutet gemeinsames Passwort und gemeinsame Faktoren; das Aktivieren von MFA in FIB ist keine nur FIB-interne Kontoänderung. Der bekannte AAL1-Zeitrahmen kann eine Memorix-Sitzung ohne MFA-Challenge beeinträchtigen.

**Bewertung:** Die Abhängigkeit ist technisch identifiziert und dokumentiert. Unveränderte globale Konfiguration und neue getrennte Testidentität vermeiden Eingriffe in bestehende Memorix-Konten. Eine uneingeschränkte Kompatibilitätsfreigabe für dieselbe Identität in beiden Apps ist aber nicht belegt. Vor appübergreifendem Regelbetrieb sind App-Freischaltung, eigene Callback-Ziele und MFA-Unterstützung im zuständigen Memorix-/Plattform-Arbeitsblock zu entscheiden. Diese Abnahme verändert Memorix ausdrücklich nicht und erklärt die gefundenen Grenzen nicht stillschweigend für akzeptiert.

### Noch ausstehende Sicherheitsabnahme

| Punkt | Konkreter Restnachweis | Status |
|---|---|---|
| Prüfoberfläche | geprüften PR-Commit in separater Vorschau bereitstellen; ausgelieferten Stand verifizieren | **erledigt**, Preview #14 und ausgeliefertes Asset belegt |
| Testidentität | Testkonto bestätigt, Einladung um 11:36 erneuert; manuelle sichere Navigation zur Vorschau ohne FIB-Aktivierung | Identität, Zustellung und verwendeter Link belegt; vollständige Erstpasswortkette offen |
| Einladung und erstes Passwort | gültiger Link → isolierte Einladungssitzung → Passwort setzen → normale Anmeldung; keine Bestandskontositzung ersetzen | Live offen; isoliert bestanden |
| MFA und serverseitige Sperre | MFA einrichten; gültige AAL1-Sitzung des Testkontos am Session-Context abweisen; AAL2 ohne FIB-Mitgliedschaft ebenfalls abweisen | Live-MFA bestanden; direkte produktive API-Negativtests offen; Codeabgleich und isolierte Prüfung bestanden |
| Getrennte Freischaltung | Warteansicht und fehlende Mitgliedschaft vor/nach Setup bestätigen; Testkonto produktiv **nicht** zum Redakteur aktivieren | Live-Warteansicht und weiterhin fehlende Mitgliedschaft belegt; positive Aktivierung bereits isoliert bestanden |
| Recovery / Reauth | Recovery nur am Testkonto bis Passwortneuvergabe mit MFA; neue Anmeldung nach Reauth-Ablehnung belegen; Current-password-Konfiguration abgeglichen | Live-Recovery einschließlich Neuanmeldung bestanden; gealterte Reauth-Sitzung live offen; Current-password-Schalter aus; isoliert bestanden |
| Memorix | unterstützte Auth-Einstiege und Rücksprungziele bestätigen, keine unbeabsichtigte FIB-Umleitung eines unterstützten Memorix-Flows | Code- und tatsächliche Policy-/Triggerbewertung abgeschlossen; uneingeschränkte gemeinsame Konto-/MFA-/Callback-Nutzung nicht freigegeben |

Erfolgreiche isolierte Fehler-, Replay-, Ablauf-, SMTP- und Freischaltungstests werden ohne Codeänderung oder konkrete Abweichung nicht wiederholt. Für Live-Nachweise nur Ergebniscode, Zeitpunkt, Buildstand und anonymisierte Testfallkennung dokumentieren; keine Einladungslinks, Passwörter, Tokens oder QR-Secrets in Chat/Repository/Artifacts. Bestehendes Admin-Konto und produktive Freischaltungen bleiben unberührt. Die bedingte Merge-Erlaubnis wird erst nach vollständigem Abschluss dieser Matrix genutzt.

## Technische Referenzen und Reproduzierbarkeit

- Supabase: `auth.admin.inviteUserByEmail`, `auth.updateUser`, `auth.onAuthStateChange`; offizielle Referenz unter https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail.
- Installierte Auth-Bibliothek und GoTrue-Version wurden gegen die aktuelle Dokumentation geprüft. Der Changelog vom 12.10.2026 enthält eine zukünftige TLS-Cipher-Abkündigung, aber keine Änderung dieses Browser-Einladungsablaufs.
- Root-Lockfile hält den geprüften Anwendungs-Abhängigkeitsstand fest; reguläre CI verwendet `npm ci`. Zusätzliche Testwerkzeuge Playwright 1.56.1 und Postgres-Client 3.4.7 sind im isolierten Workflow fest versioniert.

## Wiederholung

Automatisch bei einschlägigen PR-Änderungen: `Isolated Auth Security`, `Editorial Web CI`, `Core Services CI`.

Lokal mit Docker: ausschließlich die Dateien unter `tests/auth-sandbox/` verwenden und die im Workflow dokumentierten Schritte ausführen. Der Testcode akzeptiert keine externen Auth-Endpunkte. Kein `supabase link`, keine Produktivmigration und kein Produktionssecret erforderlich.

## Live-Beobachtung und Kontozuordnung am 13.10.2026

- Rein lesender Metadatenabgleich um 11:43 Europe/Berlin: Das ausschließlich verwendete Testkonto wurde um 11:40:50 bestätigt; im selben Zeitpunkt wurde eine Anmeldung registriert. Kein verifizierter MFA-Faktor, keine FIB-Mitgliedschaft. Dies belegt die serverseitige Verwendung der Einladung, jedoch weder den auslösenden Browser noch eine erfolgreiche Erstpasswortfestlegung.
- Nutzer-Screenshots 11:52/11:55: „Link nicht verwendbar“ beziehungsweise keine nutzbare isolierte Einladungssitzung. Nach „Zur Anmeldung“ erschien um 11:56 dagegen die MFA-Einrichtung einer normalen Sitzung. Deren Identität ist aus dem bisherigen Bildschirm nicht erkennbar. Die Annahme, alle Sitzungen seien verloren, ist damit widerlegt; eine Zuordnung zum Testkonto ist noch nicht belegt.
- Vor einer MFA-Schreibaktion wird die Kontoadresse sichtbar gemacht. Der Client zeigt in beiden AAL1-MFA-Ansichten die bereits durch `auth.getUser()` serverseitig geprüfte E-Mail-Adresse an. Keine neue Auth-Anfrage, keine Änderung der Sitzungsablage, MFA-Prüfung, Mitgliedschaft oder Berechtigung. Bei abweichender Adresse nicht fortfahren.
- TypeScript und Produktionsbuild dieser Anzeigeänderung lokal erfolgreich mit isolierten Platzhalter-Einstellungen geprüft. Die Änderung am Client begründet neue CI-Prüfungen; die bisherigen 127 erfolgreichen Fälle bleiben Nachweise des Stands `7b67129`. Vorschauaktualisierung und aktuelle CI-Ergebnisse gesondert prüfen, keine vollständige Sicherheitsabnahme behaupten.
- Noch kein Recovery-Link angefordert und keine MFA eingerichtet. Wiederherstellung wäre ein eigener Test und ersetzt nicht den offenen vollständigen Einladungstest. Keine erneute Einladung an das inzwischen bestätigte Konto; kein Löschen oder Zurücksetzen des Kontos.

## Live-Nachweis MFA und getrennte Freischaltung, 12:05 Europe/Berlin

Der Nutzer bestätigte um 12:03 die angezeigte Testadresse nach Bereitstellung der Identitätsanzeige. Anschließend richtete er den Authenticator selbst ein. Sein Screenshot um 12:05 zeigt am Testkonto „Freischaltung ausstehend“, „Dein zweiter Faktor ist bestätigt“ und den Hinweis auf die gesonderte Administratorfreischaltung. Rein lesender Abgleich um 12:05:56: genau ein verifizierter MFA-Faktor, E-Mail bestätigt, weiterhin keine FIB-Mitgliedschaft. Damit sind Live-MFA-Einrichtung und die Warteansicht ohne automatische Redaktionsfreischaltung nachgewiesen. Es wurden keine Mitgliedschaft, Rolle oder Produktivdaten geändert. Der Agent hat keine MFA-Secrets oder Codes erfasst.

Die normale Testsitzung wurde genutzt; die vollständige Kette Einladung → Erstpasswort → MFA bleibt daher offen. Ein separat aufgezeichneter direkter produktiver AAL1/AAL2-API-Negativtest ist damit nicht ersetzt. Nächster interaktiver Test: ausschließlich das Testkonto lokal abmelden, über die Vorschau einen Recovery-Link anfordern und Passwortneuvergabe erst nach bestehender MFA prüfen. Kein Kontolöschen oder Admin-Reset.

Vorschau #15 (Run 38380411833) hat Commit `a359ea51922fee53fe71502c5138c718d0697588` erfolgreich gebaut und bereitgestellt; Asset `index-CUeT6dDR.js` anhand Browser-DOM und Buildlog abgeglichen. Alle drei zugehörigen CI-Läufe sind erfolgreich: Editorial Web CI #61 (38380357657), Core Services CI #24 (38380357598), Isolated Auth Security #12 (38380357597). Die erneute CI war durch die Änderung der MFA-Kontoanzeige begründet. Keine vollständige Sicherheitsabnahme, kein Merge.

## Live-Nachweis Passwortwiederherstellung, 12:10–12:16 Europe/Berlin

Ausschließlich am bestätigten Testkonto, Vorschau mit Anwendungsstand `a359ea5`:

1. Nutzer wurde zum lokalen Abmelden und Anfordern eines Recovery-Links über „Passwort vergessen?“ angeleitet.
2. Screenshot 12:10: identifiziertes Testkonto, bestehende MFA wird vor der Passwortneuvergabe abgefragt.
3. Screenshot 12:12: nach MFA-Bestätigung erscheinen die Felder zur Passwortneuvergabe in „Freischaltung ausstehend“.
4. Screenshot 12:14: „Passwort aktualisiert“; Passwortfelder entfernt, keine Redaktionsfreischaltung.
5. Nutzer bestätigt um 12:16 nach erneutem Abmelden die erfolgreiche Anmeldung mit neuem Passwort plus Authenticator und Rückkehr zur Warteansicht.

Ergebnis: positiver Live-Recovery-Ablauf einschließlich MFA, Passwortänderung und anschließender Neuanmeldung bestanden. Die Screenshots und Nutzerbestätigung sind UI-/Funktionsnachweise; sie ersetzen keinen separat protokollierten direkten API-Negativtest. Passwort, Recovery-Link und TOTP-Code wurden nicht über den Chat übermittelt. Vor der Passwortänderung wurde die Reichweite erläutert: Das Passwort gehört zum Shared-Apps-Auth-Konto und kann bei Nutzung derselben Identität auch andere angeschlossene Apps betreffen; es ist weder ein Googlemail-Passwort noch eine Änderung am separaten Administratorkonto.

Der Arbeitsblock endet ohne Merge. Offen bleiben vollständige Live-Ersteinladung mit Erstpasswort vor MFA, produktiver Reauth-Nachweis mit gealterter Sitzung, direkte produktive AAL1/AAL2-Negativnachweise und die Memorix-Kompatibilitätsgrenze. Keine erneute Einladung, Löschung oder Rücksetzung des inzwischen bestätigten und MFA-gesicherten Testkontos. Keine weiteren erfolgreichen Tests ohne konkreten Grund wiederholen.

## Passwortanzeige aus PR-Kommentar vom 13.10.2026

Anforderung: https://github.com/PustefixReisen/fib-echtsystem/pull/74#issuecomment-6143409528

Alle sieben Passwortfelder verwenden eine gemeinsame Komponente: Anmeldung, beide Erstpasswortfelder, beide Recovery-Felder ohne FIB-Mitgliedschaft sowie beide Profilfelder für Passwortänderung/Recovery. Voreinstellung verdeckt; Auge aus dem bestehenden FIB-Asset `nav-im-blick.svg`, bei sichtbarem Passwort mit Durchstreichung. Der Schalter besitzt `type=button`, dynamisches feldbezogenes `aria-label`/`title`, `aria-controls`, `aria-pressed` und sichtbaren Tastaturfokus. Die Umschaltung verändert nur den lokalen Input-Typ; keine Speicherung, kein Logging und keine Auth-Anfrage. Leeren, deaktivieren oder erneutes Einblenden eines Formulars setzt die Anzeige zurück auf verdeckt.

TypeScript/Build lokal erfolgreich. Die bestehende isolierte Browserabnahme wurde um Funktionstests in Login, Profil, Recovery und Einladung erweitert: Mausklick, Leertaste/Enter, Feldunabhängigkeit, erhaltene Eingabe, Verbergen nach Leeren sowie unveränderte Browserablage und keine Auth-Anfrage beim Umschalten. Abschlusslauf #15 ist erfolgreich: 21 Profil-/Recovery- und 30 Einladungsprüfungen, einschließlich elf zusätzlicher Anzeigenachweise; 41 Auth-/SMTP-Prüfungen ebenfalls erfolgreich. Beide anderen CI-Workflows sind grün; Cleanup erfolgreich. Wegen der geänderten Passwortfelder ist diese gezielte Erweiterung der bestehenden Abnahme erforderlich; keine erneuten manuellen Produktions-Recoverytests allein für das Auge-Icon.

### Bereitgestellte Vorschau

Preview #16 (Run 38384743011) hat exakt `ff40282cb50097a9e0c57b03ec63f6fa6792c7d6` ausgecheckt und erfolgreich ausschließlich nach `/redaktion-preview/` bereitgestellt. Das im Browser geladene `assets/index-Da3-QLGj.js` stimmt mit dem Build-Log überein. Am leeren Loginfeld wurden Voreinstellung `password`, Mausklick zu `text` und Leertaste zurück zu `password` sowie sichtbarer Tastaturfokus geprüft. Kein Passwort wurde dafür eingegeben und keine Anmeldung ausgelöst. Produktionsverzeichnis, bestehende Konten, Auth-Einstellungen, Mitgliedschaften und Fachdaten wurden in diesem Arbeitsblock nicht verändert.

### Einordnung der fehlgeschlagenen Zwischenläufe

- Auth Security #13 (`a44a007`, Run 38383244363): Timeout nach der Recovery-MFA; die damalige Diagnose enthielt nur die Fehlerklasse, daher ist die genaue Ursache nicht belegt. Keine Vorschau dieses ungeprüften Stands deployed.
- #14 (`cec56aa`, Run 38384001413): Recovery einschließlich Passwortwechsel und anschließendem Login erfolgreich; eine unmittelbare Anzeigeabfrage im neuen Test meldete FAIL. Der Test wartet seither ausdrücklich auf den gerenderten Input-Typ nach jeder Umschaltung (maximal fünf Sekunden), ohne Auth-/MFA-Prüfungen zu entfernen oder Fehler zu ignorieren. Allowlist-Diagnosen geben nur Prüfphase, HTTP-Status und boolesche UI-Zustände aus, keine Secrets.
- #15 (`ff40282`): sämtliche 92 Auth-/Browserprüfungen erfolgreich, darunter vollständige Recovery und Einladung. Zusammen mit 23 Handler- und 23 Fachservice-Prüfungen sind 138 Prüfungen erfolgreich. Der erste Timeout wurde in den beiden folgenden Läufen nicht reproduziert; er ist keine nachgewiesene serverseitige Sicherheitslücke. Kein zusätzlicher Lauf nur zur Erhöhung der Zahl grüner Ergebnisse.

## Nächster Schritt

Am 13.10.2026 wurde außerdem die Projektentscheidung aus PR-Kommentar 6143540141 berücksichtigt: kein zusätzliches Supabase-Testprojekt in der Aufbauphase. Vorschau und Echtsystem nutzen Shared-Apps; isolierte CI bleibt bestehen. Das Fehlen veröffentlichter FIB-Fachdaten senkt den Schutz vorhandener Auth-Konten und von Memorix nicht. Keine neue Infrastruktur eingerichtet.

### Konkreter Einladungs-Testweg und verbleibende Voraussetzung

Der bisher nur beschriebene Operator-Weg ist jetzt als `scripts/admin/preview-invite.mjs` und getrennte Operation im bestehenden Workflow `Deploy FIB Edge Functions` implementiert. Verbindliches Betriebsverfahren: `docs/Betrieb-und-Wiederherstellung.md`, Abschnitt „Administrativer Preview-Einladungsversand“. Festes Projekt und exaktes Preview-Redirect, exakter geprüfter Workflow-SHA, explizite Bestätigung, keine Paketinstallation im privilegierten Schritt, keine Ausgabe/Persistenz von Schlüsseln. Zuerst atomare Neuanlage ohne Passwort/Bestätigung, dann Einladung ausschließlich derselben neu angelegten Identität. Bestehende bestätigte und unbestätigte Konten werden vorher abgewiesen. Keine automatische Wiederholung, Rücksetzung, Löschung oder Rollenvergabe.

**Neue Prüfung:** `Preview Invitation Operator Tests #1`, Run 38390164977, Commit `8518497`: zehn lokale/CI-Guards und vier echte isolierte Auth-/Mailpit-Prüfungen erfolgreich; Cleanup erfolgreich. Sie belegen Schutz beider Bestandskontotypen, genau einen Versand mit explizitem Vorschauziel und sichere Abweisung einer Wiederholung. Die bestehenden 138 Fälle wurden nicht manuell erneut gestartet. GitHub löst bei einem neuen Commit im bestehenden PR seine kumulativen Path-Checks automatisch aus; auch Editorial Web CI #66, Core Services CI #29 und Isolated Auth Security #17 dieses Stands sind erfolgreich. Keine Workflow-Sicherheitsprüfung wurde zum Vermeiden dieser automatischen Läufe deaktiviert.

**Echter administrativer Lesetest:** Run 38390465908 (`check-invite-access`, 13:28 Europe/Berlin) ist vor jeder Kontooperation mit `read-existing-admin-key`, HTTP 403 abgebrochen. Der eigentliche `deploy`-Job wurde übersprungen. Das vorhandene Management-Credential berechtigt diesen Schlüsselzugriff nicht. Kein privilegierter Schlüssel wurde ausgelesen, kein Konto angelegt, keine Einladung versandt, keine Funktion deployed. Der Fehler wurde nicht wiederholt oder durch einen anderen privilegierten Zugriff umgangen.

**Tatsächlich erforderliche Mitwirkung:** neue vom Nutzer bestätigte unbenutzte Testadresse; außerdem ausdrückliche Freigabe und sichere Bereitstellung eines geeigneten administrativen Credentials. Ein separat projektbegrenzter PAT kann nach Betreiberentscheidung als `FIB_INVITE_ACCESS_TOKEN` in der bestehenden GitHub-Umgebung hinterlegt werden; bestehender Deployment-Zugang bleibt unverändert. API-Key-Leserechte geben Zugriff auf mächtige projektweite Schlüssel und müssen deshalb bewusst genehmigt werden. Keine Schlüssel/Passwörter/Einmallinks im Chat. Bis dahin ist der neue Versandweg implementiert und isoliert geprüft, aber im Echtsystem noch nicht betriebsbereit.

Live-Erstpasswort/MFA erfolgen anschließend durch die Testperson. Direkte API-Negativnachweise werden ausschließlich an dieser Testsitzung erhoben. Für eine tatsächlich gealterte Reauth-Sitzung muss das neue Testkonto eine entsprechend alte Anmeldung haben; weder Auth-Sitzungszeitstempel noch projektweite Zeitgrenzen werden manipuliert. Die vorhandenen isolierten 25-Stunden-Reauth-Nachweise bleiben gültig, ersetzen aber keinen noch verlangten Live-Altersnachweis. Die Wartezeit wird nicht durch eine unbemerkte Absenkung des Merge-Gates ersetzt.

Cleanup-Liste dieses Arbeitsblocks: isolierte neue Konten/Mails/DB vollständig entfernt; im Echtsystem keine neuen Konten, Fachobjekte, Funktionen, Rollen, Secrets oder Einstellungen erzeugt/geändert. Kein produktives Cleanup erforderlich. Eine spätere neue Testkontoanlage wird über eine zufällige geschützte `app_metadata.fib_pr74_test_case`-Kennung erfasst; Löschung nur nach gesonderter Freigabe.

Einen verlässlichen Einladungs-Testweg mit explizitem Vorschauziel ohne manuelles Bearbeiten von Einmallinks herstellen, dafür eine unbenutzte bestätigte Testadresse verwenden und die vollständige Erstpasswortkette nachweisen. Parallel im nächsten Arbeitsblock die verbleibenden API-/Reauth-Nachweise und Memorix-Kompatibilitätsgrenze schließen. Erst nach vollständiger Abnahme PR #74 mergen. Danach die gesicherte Administratoroberfläche für Einladen und getrenntes Freischalten mit Bestätigung und Audit ergänzen; anschließend sicherer MFA-Faktorwechsel und dokumentierte Notfallwiederherstellung, ohne die verpflichtende MFA abzusenken.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 13.10.2026 | Admin-Einladungsweg implementiert und mit 14 neuen Fällen geprüft; realen HTTP-403-Berechtigungsblock und erforderliche Mitwirkung dokumentiert; Memorix-Policies/Trigger abgeglichen und zu weitgehende Zugangsaussage korrigiert. |
| 1.1 | 13.10.2026 | 138 erfolgreiche Prüfungen, fehlgeschlagene Zwischenläufe und Test-Synchronisierung dokumentiert; zweiten Memorix-Auth-Einstieg und konkrete Redirect-/MFA-Grenzen ergänzt. |
| 1.0 | 13.10.2026 | Einheitliche Passwortanzeige gemäß PR-Kommentar umgesetzt; isolierte Browserprüfungen für Maus-/Tastaturumschaltung und erneutes Verbergen ergänzt. |
| 0.9 | 13.10.2026 | Live-Recovery nach MFA, Passwortaktualisierung und erfolgreiche Neuanmeldung durch Nutzer belegt; Restmatrix und Abschluss ohne Merge präzisiert. |
| 0.8 | 13.10.2026 | Testkontozuordnung durch Nutzer bestätigt; Live-MFA und ausstehende getrennte Freischaltung per Screenshot und lesenden Metadaten belegt; Vorschau #15 und drei erfolgreiche CI-Läufe dokumentiert. |
| 0.7 | 13.10.2026 | Verbrauchte Einladung und getrennte Sitzungszustände dokumentiert; serverseitig geprüfte Kontoadresse vor MFA sichtbar gemacht, Identitätsprüfung bleibt vor Live-Schreibaktion erforderlich. |
| 0.6 | 13.10.2026 | Testkonto durch Nutzer bestätigt, Einladung ausschließlich dafür erneuert; Versandmetadaten und manuellen Vorschau-Testweg ohne Änderung der Site URL dokumentiert. |
| 0.5 | 13.10.2026 | Preview #14 mit geprüftem Commit bereitgestellt und verifiziert; MFA-/Current-password-Parameter ergänzt; verbleibende Einladungsziel- und sichere Übernahmegrenzen dokumentiert. |
| 0.4 | 13.10.2026 | Nutzer-Nachweise zur produktiven Auth-/SMTP-Konfiguration übernommen; produktiven Handler, Mitgliedschaftsgrenzen, ausgelieferten Client und Memorix-Einstiege lesend abgeglichen; konkrete Live-Blocker statt überholter SMTP-/Konfigurationsblocker festgehalten. |
| 0.3 | 12.10.2026 | Einladungsannahme, Passwort-Erstfestlegung, MFA-Wiederaufnahme und tatsächliche serverseitige Mitgliedschaftsprüfung in isolierter Umgebung ergänzt; produktive Einladungsnachweise als Merge-Bedingung festgehalten. |
| 0.2 | 12.10.2026 | Isolierte reale Auth-/SMTP- und Browserprüfung aufgebaut, Recovery-Weg ergänzt, Ergebnisse und verbleibenden Produktionsnachweis getrennt dokumentiert; bedingte Merge-Erlaubnis berücksichtigt. |
| 0.1 | 12.10.2026 | Initialreview, reproduzierte Fehler, Handler-Tests und offene Live-Abnahme dokumentiert. |
