# editorial-web

Geschützte Redaktions-Web-App einschließlich FIB-Chat-Arbeitsbereich.

Verantwortung:
- authentifizierter Redaktionszugang,
- Bedienung der FIB-Fachservices,
- redaktionelle Arbeitsoberflächen und Statusanzeigen.

Nicht hierher gehören:
- verbindliche Fachregeln als alleinige Clientlogik,
- privilegierte Secrets,
- direkte fachliche Schreibzugriffe an der Fachservice-Schicht vorbei.

## Technischer Stand U1

Die App ist gemäß ADR-001 als statische **Vite + React + TypeScript**-Anwendung initialisiert und für den Pfad `/redaktion/` vorbereitet.

Der erste Auth-Pfad ist umgesetzt:

1. Anmeldung mit Supabase Auth per E-Mail/Passwort,
2. Prüfung des Authenticator Assurance Level (AAL),
3. bei fehlendem Faktor: TOTP-Einrichtung per QR-Code,
4. Challenge/Verifikation des Codes aus der Authenticator-App,
5. Redaktionszugang erst nach Erreichen von `aal2`.

Die FIB-Rolle wird nicht im Browser aus Metadaten bestimmt. Fachservices lösen die verifizierte `auth.users`-ID serverseitig gegen `fib.app_users` auf.

## Browser-Konfiguration

Siehe `.env.example`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Im Browser dürfen ausschließlich öffentliche Supabase-Konfigurationswerte verwendet werden. `service_role`, Secret Keys, Datenbankpasswörter und `fib_app`-Credentials dürfen niemals in die Redaktions-App gelangen.

## Erster praktischer MFA-Test

Für den ersten FIB-Admin `josef@kjwalter.de` ist die FIB-Mitgliedschaft vorhanden, aber noch kein verifizierter TOTP-Faktor registriert. Beim ersten lauffähigen Aufruf der Redaktions-App ist daher der Pfad `Login -> Authenticator einrichten -> QR-Code scannen -> TOTP bestätigen -> aal2` zu testen.
