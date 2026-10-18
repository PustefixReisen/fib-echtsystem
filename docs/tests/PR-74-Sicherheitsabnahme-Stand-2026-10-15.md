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

## Nachtrag: Browserbeobachtung 18.10.2026, circa 19:28 MESZ

**Nutzerbeobachtung:** Aufruf der regulären FIB-Redaktions-App `https://fib.pustivo.de/redaktion/` zeigte die Anmeldemaske, E-Mail-Adresse des Testbenutzers war vorausgefüllt; Passwortfeld leer. Der Nutzer bestätigte anschließend, dass das betreffende Firefox-Fenster länger als 24 Stunden offen war, **ohne während dieser Zeit eine Seitenaktualisierung oder Interaktion vorzunehmen**.

**Bewertung:** Der Bildschirm beweist weder eine fortbestehende gültige Auth-Sitzung bis zum Test noch einen gezielten serverseitigen 24-Stunden-Reauth-Zwang. Token-Ablauf, unterbliebene Erneuerung und weitere Ursachen sind damit nicht ausgeschlossen. PR #74 ist ungemergt; der reguläre Produktivpfad darf nicht als Live-Ausführung der PR-#74-Implementierung ausgegeben werden. **Kein Abnahmeerfolg** für die gealterte, weiterhin gültige Sitzung; kein Login oder Sicherheitskonfigurationswechsel aus dieser Beobachtung veranlasst.

**Präzisierung des Prüfziels:** Laut PR-#74-Testbericht ist „Secure password change“ aktiv; dort bedeutet die 24-Stunden-Grenze die Anforderung einer *frischen Authentifizierung bei Passwortänderungen*, nicht notwendig einen zwangsweisen allgemeinen Logout nach 24 Stunden. Die nächsten Nachweise sind deshalb getrennt zu führen:

1. **Sitzungsbestand/Token-Gültigkeit** separat nachweisen (keine Gleichsetzung mit einem bloß geöffneten Firefox-Fenster).
2. **Gezielte Passwortänderungs-Reauth**: im tatsächlich für PR #74 bereitgestellten Prüfstand mit autorisiertem Testkonto eine gültige, aber älter als 24 Stunden authentifizierte Sitzung nachweisen; anschließend Passwortänderung ohne erneute frische Anmeldung ablehnen lassen und geschützten Wiederanmeldepfad prüfen. Vorher den technischen Geltungsbereich von Supabase „Secure password change“ und die tatsächlichen Einsatzbedingungen abgleichen. Keine Zeitstempelmanipulation, keine Änderung an Shared-Apps-Auth-Policies, keine Token in Testprotokollen.
3. **AAL1/API-Negativtest** und aktuelle Membership/AAL2-Checks separat abschließen.
4. **PR-Integration** gegen aktuellen `main` einschließlich Issue #115 (administrativ initiierte Einladungen) sicherheitsfachlich prüfen, bevor ein Merge überhaupt erwogen wird.

**Status nach Nachtrag:** PR #74 und die Sicherheitsabnahme bleiben **OFFEN**. Nächster sinnvoller technischer Schritt: Testdesign und gültigen PR-#74-Prüfstand klären; erst anschließend neue Browsermitwirkung anfordern.
