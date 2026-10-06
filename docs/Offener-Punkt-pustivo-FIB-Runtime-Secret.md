# Offener Punkt – FIB-Runtime-Secret

## Zweck

Der produktive FIB-Fachservice soll mit dem technischen PostgreSQL-Login `fib_app` auf das Schema `fib` zugreifen. Dafür benötigt die Runtime das Secret `FIB_DATABASE_URL`.

`service_role`, `postgres` oder andere privilegierte Projektrollen dürfen dafür nicht als Ersatz verwendet werden.

## Aktueller Stand

- `fib_runtime` existiert als NOLOGIN-Rechterolle.
- `fib_app` existiert als LOGIN-Rolle und erbt `fib_runtime`.
- `fib_app` ist weder Superuser noch `BYPASSRLS`.
- `fib_app` besitzt die vorgesehenen Rechte auf `fib.*` und keine Tabellenrechte auf Memorix-Objekte in `public`.
- Die erste Edge Function `fib-get-event` ist im Repository vorbereitet und erwartet `FIB_DATABASE_URL`.
- Das verbundene Supabase-Werkzeug darf reale Passwörter/Secrets nicht über SQL setzen oder verwalten. Dieser eine Schritt muss deshalb im Supabase-Dashboard bzw. über eine lokale administrative CLI/psql-Sitzung erfolgen.

## Einmaliger manueller Schritt

1. Im Passwortmanager ein starkes zufälliges Passwort für `fib_app` erzeugen. Das Passwort nicht in Git, Chat oder Dokumentation einfügen.
2. In **Shared-Apps** im Supabase SQL Editor als Projektadministrator ausführen:

```sql
alter role fib_app with password '<PASSWORT-AUS-PASSWORTMANAGER>';
```

3. Im Supabase-Dashboard die für Shared-Apps geeignete PostgreSQL-Verbindungsadresse aus **Connect** übernehmen. Benutzername auf `fib_app` setzen und das neue Passwort URL-sicher einsetzen. Für eine serverlose Edge Function ist die von Supabase empfohlene Pooler-Verbindung zu verwenden, sofern der Connect-Dialog dies für diesen Einsatzfall anbietet.
4. Unter **Edge Functions → Secrets** ein Secret anlegen:

```text
FIB_DATABASE_URL=<vollständige PostgreSQL-Verbindungs-URL für fib_app>
```

5. Das Secret niemals in Quellcode, `.env.example`, GitHub-Issues, Logs oder Chat übernehmen.

## Danach automatisiert fortsetzen

Nach gesetztem Secret:

1. `fib-get-event` mit JWT-Prüfung deployen,
2. Anmeldung mit einem aktiven Eintrag in `fib.app_users` testen,
3. positiven Zugriff auf `fib.events` testen,
4. negativen Zugriff auf `public.events`/Memorix bestätigen,
5. MFA-/`aal2`-Pfad mit dem ersten FIB-Admin testen,
6. Ergebnis in Roadmap/Betriebsdokumentation festhalten.

## Erfolgskriterium

Die Edge Function arbeitet mit `fib_app` erfolgreich auf `fib`, besitzt keine Tabellenrechte auf `public`/Memorix und benötigt weder `service_role` noch `postgres` für reguläre FIB-Fachzugriffe.
