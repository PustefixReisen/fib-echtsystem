# PR #74 – Sicherheitsabnahme: Stand 15.10.2026

**Status: OFFEN – keine Freigabe zum Merge.** Dieser Prüfvermerk dokumentiert Beobachtungen, nicht eine erfolgreich abgeschlossene Sicherheitsabnahme.

## Bereits nachgewiesen
- Einladungsablauf implementiert und isoliert geprüft; SMTP-Zustellung über IONOS produktiv nachgewiesen.
- Umfangreiche automatisierte Tests waren erfolgreich (Prüfzahl abhängig vom jeweiligen Branch-Stand).
- Nicht für FIB freigeschalteter Testbenutzer `pustefix.reisen@gmail.com`: Live-API-Negativtests `fib-session-context` und `fib-get-event` mit HTTP 403 am 15.10.2026 beobachtet. Positive Admin-Nutzung separat erprobt.
- Kein zusätzlicher Supabase-Administrator und keine neuen weitreichenden Berechtigungen eingerichtet. Shared-Apps wird auch von Memorix genutzt.

## Nicht abgeschlossene Tests
- **Reauthentifizierung einer tatsächlich weiterbestehenden Sitzung nach mehr als 24 Stunden:** nicht nachgewiesen.
- Am 15.10.2026 gegen 17:29 MESZ erschien beim Aufruf von `https://fib.pustivo.de/redaktion/` im privaten Firefox-Kontext die Anmeldung. Anschließend wurde bestätigt, dass der PC zwischenzeitlich neu gestartet wurde. Eine private Firefox-Sitzung kann dadurch beendet worden sein; diese Beobachtung ist **kein Beleg** für einen serverseitig erzwungenen 24-Stunden-Reauth.
- Direkter Negativtest für AAL1 ohne erfolgreiche MFA bleibt offen, soweit nicht anderweitig protokolliert.
- Wegen Abweichungen der Branches ist PR #74 vor einem eventuellen Merge gegen aktuellen `main` einschließlich aller neuen Mitgliedschaftsprüfungen zu prüfen.

## Sicherer nächster Test
1. Neuen Testlauf mit einem **weiterbestehenden**, MFA-bestätigten Testkontext beginnen; Anfangszeit dokumentieren.
2. Testprofil und Browser während der Alterungsphase nicht schließen oder durch PC-Neustart zerstören; keine Cookies, Web-Storage oder Sitzungsdaten löschen.
3. Erst nach >24 Stunden prüfen, ob PR-#74-Logik erneute Authentifizierung fordert. Nachweis mit Zeit, AAL, Response und tatsächlichem Frontend-Verhalten protokollieren, ohne Zugangsdaten/Token zu speichern.
4. Negativtests für nicht freigeschaltete Benutzer und AAL1 erneut verifizieren; keine Änderungen an gemeinsamen Auth-Einstellungen oder Memorix-Daten.
5. Erst nach Sicherheitsreview, Integrationsprüfung und bestandenen Tests Mergeentscheidung treffen.

**Abgrenzung:** Laufende Mobile-UI-Arbeiten sind unabhängig und dürfen PR #74 nicht stillschweigend verändern.
