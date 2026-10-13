# PR #74 – Sicherheits- und Funktionstest

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.7 | 13.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ergebnis

**Isolierte Abnahme erfolgreich; produktive Auth-/SMTP-Grundkonfiguration nachgewiesen. Die vollständige Sicherheitsabnahme bleibt wegen ausstehendem Live-Ablauf am Testkonto blockiert. Kein Merge.**

Der Nutzer hat den Merge am 12.10.2026 unter der Bedingung autorisiert, dass sämtliche Sicherheitsanforderungen erfüllt sind. Diese Bedingung ist derzeit noch nicht vollständig nachgewiesen. Eine weitere pauschale Merge-Freigabe wird nicht verlangt.

Geprüfter Implementierungsstand: `7b67129f1fa54aca827e79c246e5f4a42992cd1c`. Am 13.10.2026 erneut lesend bestätigt: Isolated Auth Security #11, Editorial Web CI #60 und Core Services CI #23 sind erfolgreich. Die Fortschreibungen v0.4 bis v0.6 ändern ausschließlich Dokumentation; Anwendung, Tests, Abhängigkeiten und Workflows bleiben unverändert. Bestehende erfolgreiche Tests wurden nicht erneut gestartet. Vor einem späteren Merge sind aktueller Head, geltende Pflichtchecks und abgeschlossene Live-Nachweise erneut abzugleichen.

## Nachweise

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Handler-Regressionen | 23/23 erfolgreich | Editorial Web CI #60, Run 38283422023 |
| Echte Auth-API und abgefangene SMTP-Mails | 41/41 erfolgreich | Isolated Auth Security #11, Run 38283422018 |
| Profil-/Recovery-Browserprüfungen | 13/13 erfolgreich | gleicher Run |
| Einladungs-/Freischaltungsprüfungen | 27/27 erfolgreich | gleicher Run; tatsächlicher Session-Context-Handler |
| Build und TypeScript | erfolgreich | Editorial Web CI #60; Core Services CI #23, Run 38283422045 |
| Vorhandene Fachservice-Fälle | 23/23 erfolgreich | Core Services CI #23 |
| Bestehendes Administratorkonto | unverändert | keine Änderungen am Admin-Konto; einzige Auth-Schreibaktion ist die unten dokumentierte Testkonto-Einladung |
| Auth-/SMTP-Grundkonfiguration | nachgewiesen | Nutzerkommentar vom 13.10.2026 zu Dashboard-/Zustellnachweisen vom 12.10.2026; Details unten |
| Produktiver Session-Context-Code | identisch zum geprüften Handler | Edge Function Version 2, SHA-256 unten |
| Live-Einladung / MFA / Recovery / Reauth | **offen** | PR #74 jetzt in Vorschau bereitgestellt; frischer Testkonto-Einladungszugang noch offen |

Run: https://github.com/PustefixReisen/fib-echtsystem/actions/runs/38283422018

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

Am 13.10.2026 hat der Nutzer das gestern eingeladene Googlemail-Konto ausdrücklich als Testkonto bestätigt. Damit ist die Empfängerzuordnung abgeschlossen. Über den Dashboard-Einladungsdialog wurde ausschließlich für dieses bestehende, noch unbestätigte Testkonto eine neue Einladung ausgelöst. Rein lesender Nachweis: `invited_at` und `confirmation_sent_at` sind nun **13.10.2026, 09:36:53 UTC (11:36:53 Europe/Berlin)**; E-Mail weiterhin unbestätigt, keine Anmeldung, keine FIB-Mitgliedschaft. Kein neues Konto, keine Rollenvergabe, keine Änderung an bestehenden Administratorkonten oder projektweiten Einstellungen. Die tatsächliche Ankunft dieser neuen Nachricht ist noch nicht durch das Testpostfach bestätigt.

Der Dashboard-Versand verwendet weiterhin das Produktions-Rücksprungziel. Für die begrenzte Vorschau-Abnahme übernimmt die Testperson die Navigation selbst: Link aus der neuen E-Mail in die Adresszeile kopieren, **vor dem Aufruf** nur den Zielpfad im `redirect_to`-Parameter von `/redaktion/` auf `/redaktion-preview/` ändern (bei URL-Encoding entsprechend `%2Fredaktion%2F` auf `%2Fredaktion-preview%2F`). Auth-Host, Token und `type=invite` unverändert lassen. Nur ausführen, wenn das Ziel eindeutig erkennbar ist; bei abweichendem Linkformat abbrechen. Keine Links oder Secrets im Chat übergeben. Erst auf der erkennbaren Vorschau das Passwort festlegen und anschließend MFA selbst einrichten. Dies ist ein manueller Vorschau-Testweg, keine Abnahme einer automatisch mit Preview-Redirect erzeugten Einladung und keine dauerhafte Benutzeranleitung für den Produktivbetrieb.

### Memorix-Auswirkungen

Rein lesende Prüfung des Memorix-Stands `522d1380fd807ac3d38464a470f1616f70e3c709`:

- `docs/02-sicherheit-und-datenschutz.md`: gemeinsame Authentifizierung ersetzt keine appbezogene Autorisierung; Memorix bleibt im Schema `public`. Keine Memorix-Daten oder -Policies wurden für diese Abnahme verändert.
- `src/services/supabase-client.ts`: regulärer und ephemerer Client verwenden `detectSessionInUrl:false`. `src/services/supabase-metadata-smoke-test.ts` meldet den Testbenutzer direkt mit `signInWithPassword` an; dieser geprüfte Einstieg nutzt keinen E-Mail-Redirect. Die Site URL ist daher für genau diesen Passwortlogin kein Rücksprungziel. Das ist eine Codebewertung, kein ausgeführter Android-/Memorix-Livetest.
- Projektweite Passwort-, E-Mail- und MFA-Kontoeigenschaften gelten auch bei Verwendung desselben Auth-Kontos durch Memorix. Passwortänderungen können andere Sitzungen betreffen. Ein neues Konto erhält durch FIB-Einladung keine Memorix-Freigabe.
- Ein E-Mail-Flow ohne explizites erlaubtes Memorix-Ziel würde auf die FIB-Site-URL zurückfallen. Der geprüfte Defaultclient verarbeitet solche URL-Sitzungen nicht. Deshalb ist keine pauschale Freigabe von Memorix-Bestätigung/Recovery/Einladung ableitbar. Vor Abschluss ist der tatsächlich unterstützte Memorix-Auth-Umfang einschließlich benötigter Callback-Ziele zu bestätigen; andernfalls bleibt diese Kompatibilitätsgrenze offen. Keine projektweite Einstellung allein für FIB ändern.

### Noch ausstehende Sicherheitsabnahme

| Punkt | Konkreter Restnachweis | Status |
|---|---|---|
| Prüfoberfläche | geprüften PR-Commit in separater Vorschau bereitstellen; ausgelieferten Stand verifizieren | **erledigt**, Preview #14 und ausgeliefertes Asset belegt |
| Testidentität | Testkonto bestätigt, Einladung um 11:36 erneuert; manuelle sichere Navigation zur Vorschau ohne FIB-Aktivierung | Identität und Versandmetadaten erledigt; Zustellung/Navigation offen |
| Einladung und erstes Passwort | gültiger Link → isolierte Einladungssitzung → Passwort setzen → normale Anmeldung; keine Bestandskontositzung ersetzen | Live offen; isoliert bestanden |
| MFA und serverseitige Sperre | MFA einrichten; gültige AAL1-Sitzung des Testkontos am Session-Context abweisen; AAL2 ohne FIB-Mitgliedschaft ebenfalls abweisen | Live offen; Codeabgleich und isolierte Prüfung bestanden |
| Getrennte Freischaltung | Warteansicht und fehlende Mitgliedschaft vor/nach Setup bestätigen; Testkonto produktiv **nicht** zum Redakteur aktivieren | Ausgangszustand geprüft; Live-Warteansicht offen; positive Aktivierung bereits isoliert bestanden |
| Recovery / Reauth | Recovery nur am Testkonto bis Passwortneuvergabe mit MFA; neue Anmeldung nach Reauth-Ablehnung belegen; Current-password-Konfiguration abgeglichen | Live offen; Current-password-Schalter aus; isoliert bestanden |
| Memorix | unterstützte Auth-Einstiege und Rücksprungziele bestätigen, keine unbeabsichtigte FIB-Umleitung eines unterstützten Memorix-Flows | gezielte Codebewertung erfolgt; vollständige Kompatibilität offen |

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

## Nächster Schritt

Die bereitgestellte Vorschau für den verbliebenen Testkonto-Liveablauf nutzen, einen frischen Einladungslink mit explizitem Vorschauziel und sichere manuelle Passwort-/MFA-Einrichtung ermöglichen und die Memorix-Kompatibilitätsgrenze schließen. Erst nach vollständiger Abnahme PR #74 mergen. Danach die gesicherte Administratoroberfläche für Einladen und getrenntes Freischalten mit Bestätigung und Audit ergänzen; anschließend sicherer MFA-Faktorwechsel und dokumentierte Notfallwiederherstellung, ohne die verpflichtende MFA abzusenken.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.7 | 13.10.2026 | Verbrauchte Einladung und getrennte Sitzungszustände dokumentiert; serverseitig geprüfte Kontoadresse vor MFA sichtbar gemacht, Identitätsprüfung bleibt vor Live-Schreibaktion erforderlich. |
| 0.6 | 13.10.2026 | Testkonto durch Nutzer bestätigt, Einladung ausschließlich dafür erneuert; Versandmetadaten und manuellen Vorschau-Testweg ohne Änderung der Site URL dokumentiert. |
| 0.5 | 13.10.2026 | Preview #14 mit geprüftem Commit bereitgestellt und verifiziert; MFA-/Current-password-Parameter ergänzt; verbleibende Einladungsziel- und sichere Übernahmegrenzen dokumentiert. |
| 0.4 | 13.10.2026 | Nutzer-Nachweise zur produktiven Auth-/SMTP-Konfiguration übernommen; produktiven Handler, Mitgliedschaftsgrenzen, ausgelieferten Client und Memorix-Einstiege lesend abgeglichen; konkrete Live-Blocker statt überholter SMTP-/Konfigurationsblocker festgehalten. |
| 0.3 | 12.10.2026 | Einladungsannahme, Passwort-Erstfestlegung, MFA-Wiederaufnahme und tatsächliche serverseitige Mitgliedschaftsprüfung in isolierter Umgebung ergänzt; produktive Einladungsnachweise als Merge-Bedingung festgehalten. |
| 0.2 | 12.10.2026 | Isolierte reale Auth-/SMTP- und Browserprüfung aufgebaut, Recovery-Weg ergänzt, Ergebnisse und verbleibenden Produktionsnachweis getrennt dokumentiert; bedingte Merge-Erlaubnis berücksichtigt. |
| 0.1 | 12.10.2026 | Initialreview, reproduzierte Fehler, Handler-Tests und offene Live-Abnahme dokumentiert. |
