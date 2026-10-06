# FIB-Runtime-Secret und erster Edge-Function-Zugang

## Zweck

Der produktive FIB-Fachservice greift mit dem technischen PostgreSQL-Login `fib_app` auf das Schema `fib` zu. Dafür verwendet die Runtime das Secret `FIB_DATABASE_URL`.

`service_role`, `postgres` oder andere privilegierte Projektrollen dürfen dafür nicht als Ersatz verwendet werden.

## Aktueller Stand – 06.10.2026

- `fib_runtime` existiert als NOLOGIN-Rechterolle.
- `fib_app` existiert als LOGIN-Rolle und erbt `fib_runtime`.
- `fib_app` ist weder Superuser noch `BYPASSRLS`.
- `fib_app` besitzt die vorgesehenen Rechte auf `fib.*` und keine Tabellenrechte auf Memorix-Objekte in `public`.
- Passwort für `fib_app` wurde administrativ gesetzt; der konkrete Wert ist nicht dokumentiert.
- `FIB_DATABASE_URL` wurde als Edge-Function-Secret in Shared-Apps hinterlegt; der konkrete Wert ist nicht dokumentiert.
- Die erste Edge Function `fib-get-event` ist in Shared-Apps als Version 1 aktiv deployed.
- Die Funktion verwendet `@supabase/server` mit `auth: 'user'`. Deshalb ist die ältere Plattformoption `verify_jwt` für diese Funktion bewusst deaktiviert; die Benutzer-JWT-Prüfung erfolgt innerhalb des aktuellen Supabase-Server-Wrappers.
- Die Funktion löst nach erfolgreicher Authentifizierung die Benutzer-ID gegen `fib.app_users` auf und greift anschließend über `fib_app` auf `fib.events` zu.

## Noch ausstehender Live-Nachweis

Der vollständige End-to-End-Nachweis benötigt eine echte Benutzer-Session der Redaktions-App:

1. Anmeldung mit `josef@kjwalter.de`,
2. TOTP/MFA einrichten und `aal2` erreichen,
3. `fib-get-event` mit dem echten Benutzer-JWT aufrufen,
4. aktiven FIB-Admin über `fib.app_users` bestätigen,
5. positiven Zugriff auf `fib.events` nachweisen,
6. negativen Zugriff auf `public.events`/Memorix weiterhin bestätigen,
7. Ergebnis in Roadmap/Betriebsdokumentation festhalten.

## Erfolgskriterium

Die Edge Function arbeitet mit `fib_app` erfolgreich auf `fib`, besitzt keine Tabellenrechte auf `public`/Memorix und benötigt weder `service_role` noch `postgres` für reguläre FIB-Fachzugriffe. Die Benutzerautorisierung erfolgt zusätzlich über Supabase Auth, MFA und `fib.app_users`.
