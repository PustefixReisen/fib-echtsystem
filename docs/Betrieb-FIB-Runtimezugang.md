# Betrieb – FIB-Runtimezugang auf pustivo

## Dokumentstand

| Version | Stand |
|---|---|
| 1.0 | 06.10.2026 |

## Zweck

Dieses Dokument beschreibt den technischen Runtime-Zugang des FIB-Echtsystems zur gemeinsamen Supabase-Datenbank `Shared-Apps`.

Es konkretisiert ADR-011. Ziel ist, dass der normale FIB-Betrieb ausschließlich mit einem eigenen, auf das Schema `fib` begrenzten Datenbankzugang arbeitet.

## Rollenmodell

- `fib_runtime`: NOLOGIN-Rolle; besitzt die erforderlichen Rechte auf `fib`.
- `fib_app`: LOGIN-Rolle; erbt ausschließlich `fib_runtime`.
- `service_role`: kein normaler FIB-Fachzugang.
- `postgres`: ausschließlich Administration/Migration/Betrieb.

## Secret-Regel

Das Passwort von `fib_app` wird niemals in Git gespeichert.

Auf pustivo wird die vollständige Verbindungszeichenfolge als Server-Secret gesetzt:

`FIB_DATABASE_URL`

Die Beispielstruktur steht in `.env.example`.

Das Secret darf nicht:

- im öffentlichen Web-Build landen,
- an den Browser ausgeliefert werden,
- in Logs vollständig ausgegeben werden,
- in KI-/Chat-Kontexte kopiert werden,
- in GitHub committed werden.

## Einmalige Einrichtung auf pustivo

1. Starkes zufälliges Passwort für `fib_app` erzeugen.
2. Passwort administrativ in PostgreSQL für `fib_app` setzen.
3. `FIB_DATABASE_URL` mit diesem Passwort in der geschützten Server-Konfiguration hinterlegen.
4. Serverprozess/Runtime so konfigurieren, dass nur der serverseitige Fachservice darauf zugreifen kann.
5. Verbindungstest durchführen.

## Verbindlicher Isolationstest

Mit dem echten `fib_app`-Login muss nachgewiesen werden:

- Verbindung zu `Shared-Apps` möglich,
- `SELECT`/Schreiboperationen auf ausdrücklich dafür vorgesehenen `fib`-Objekten möglich,
- keine Tabellenrechte auf `public`/Memorix,
- kein Zugriff auf spätere fremde Anwendungsschemata,
- kein Superuser,
- kein `BYPASSRLS`,
- keine Mitgliedschaft in projektweit privilegierten Rollen.

Der Test darf keine produktiven Fachinhalte verändern; für Schreibtests ist eine Testtransaktion mit Rollback oder eine explizite Testtabelle/-fixture zu verwenden.

## Rotation

Das Passwort wird mindestens bei folgenden Ereignissen rotiert:

- Verdacht auf Kompromittierung,
- unzulässige Offenlegung,
- Wechsel der Hosting-/Deploymentverantwortung,
- Migration der produktiven Umgebung,
- sonstige sicherheitsrelevante Betriebsentscheidung.

## Abgrenzung Auth

`fib_app` ist ein technischer Datenbankzugang und kein menschlicher FIB-Benutzer.

Menschliche Redakteure/Admins authentifizieren sich über Supabase Auth. Ihre FIB-Zuordnung liegt in `fib.app_users`. Die Fachservices prüfen Identität, Rolle, MFA und Aktionsstufe zusätzlich zur Datenbankisolation.
