# Offener Punkt – pustivo FIB-Runtime-Secret

## Trigger

Sobald der FIB-Serverprozess auf pustivo eingerichtet wird bzw. die geschützte Server-Konfiguration verfügbar ist.

## Dann ausführen

1. starkes zufälliges Passwort für `fib_app` erzeugen,
2. Passwort administrativ in `Shared-Apps` setzen,
3. `FIB_DATABASE_URL` auf pustivo als Server-Secret hinterlegen,
4. Live-Verbindung mit `fib_app` herstellen,
5. Zugriff auf `fib` positiv testen,
6. Zugriff auf `public`/Memorix negativ testen,
7. Ergebnis dokumentieren,
8. Secret niemals in Git/Logs/Chat übernehmen.

## Erfolgskriterium

Der reale pustivo-Prozess arbeitet mit `fib_app` erfolgreich auf `fib`, besitzt aber keine Tabellenrechte auf `public`/Memorix und keine privilegierten Projektrollen.
