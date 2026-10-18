# Administratorgesteuerte Einladung – FIB-Redaktionszugang

**Entscheidungsstand:** 15.10.2026. **Implementierungsstand:** 18.10.2026, Branch zu Issue #115.

## Grundsatz

Zugang zum FIB-Redaktionssystem erfolgt ausschließlich nach administrativer Vorautorisierung. Ein Supabase-Auth-Konto allein gewährt keinen FIB-Zugang.

Der FIB-Administrator erfasst **vollständigen Namen, E-Mail-Adresse und vorgesehene Rolle**. Die Rolle wird in `fib.app_users` festgelegt und niemals aus Auth-Metadaten, URL-Parametern oder Browserzuständen abgeleitet.

## Ablauf für neue Personen

1. Ein aktiver FIB-Administrator mit AAL2 öffnet **Administration → Benutzer & Rollen**.
2. Er erfasst Name, E-Mail-Adresse und Rolle.
3. Die Edge Function `fib-admin-users` prüft serverseitig erneut AAL2 und die aktive FIB-Adminrolle.
4. Für eine noch nicht vorhandene Shared-Apps-Identität wird über Supabase Auth eine Einladung an die FIB-Redaktions-App versendet.
5. Parallel wird ausschließlich im FIB-Schema eine Mitgliedschaft mit Status `setup_pending` und der administrativ festgelegten Rolle angelegt.
6. Die eingeladene Person legt ihr Passwort fest und richtet bzw. bestätigt TOTP-MFA.
7. Erst eine gültige AAL2-Sitzung darf `fib-session-context` eine zuvor administrativ angelegte Mitgliedschaft von `setup_pending` auf `active` setzen.
8. Erst danach sind FIB-Fachdienste zugänglich.

Ein eigenständiger zweiter administrativer Freigabeschritt nach erfolgreichem Setup ist damit nicht erforderlich: Die fachliche Freigabe liegt bereits in der vorherigen Admin-Vorautorisierung.

## Bereits vorhandenes Shared-Apps-Konto

Ist die E-Mail-Adresse bereits als Auth-Identität vorhanden, wird **kein Passwort gesetzt, zurückgesetzt oder geändert** und kein vorhandener MFA-Faktor verändert.

Stattdessen legt der Administrator ausschließlich die FIB-Vorautorisierung an. Die Person meldet sich mit ihrer bestehenden Shared-Apps-Identität an und muss für FIB AAL2 nachweisen. So bleiben insbesondere Memorix-Zugangsdaten unverändert.

## Status und Rücknahme

Die Benutzerverwaltung zeigt FIB-Mitglieder mit Rolle und Setup-Status an.

Eine noch nicht angenommene Einladung wird mit Versandzeitpunkt angezeigt und kann administrativ erneut versendet werden. Supabase koppelt die Gültigkeit des Einladungslinks an die projektweite Email-OTP-Ablaufzeit; deshalb speichert FIB keine abweichende eigene Link-Laufzeit. Bereits bestätigte Shared-Apps-Konten werden nicht erneut eingeladen, sondern verwenden ihre bestehende Anmeldung.

Eine noch offene FIB-Einladung kann administrativ zurückgenommen werden. Dabei wird nur die FIB-Mitgliedschaft auf `deactivated` gesetzt. Das gemeinsame Auth-Konto wird **nicht** gelöscht.

Bereits aktive Benutzer werden durch die Einladungsfunktion nicht automatisch deaktiviert. Eine allgemeine Deaktivierung aktiver Benutzer bleibt eine getrennte, bewusst bestätigte Administrationsaktion.

## Sicherheitsgrenzen

- Kein öffentlicher Registrierungsweg für FIB.
- Adminaktion nur mit aktiver FIB-Adminrolle und AAL2.
- Keine neue Supabase-Instanz.
- Keine neuen weitreichenden API-Schlüssel.
- Die neue Edge Function nutzt ausschließlich die von Supabase für Functions bereitgestellte serverseitige Service-Role-Umgebung; der Schlüssel wird weder an den Browser ausgegeben noch im Repository gespeichert.
- Keine Änderung globaler Auth-Einstellungen von Shared-Apps.
- Keine automatische Rollenvergabe aus `user_metadata` oder `app_metadata`.
- FIB-Mitgliedschaft und AAL2 werden weiterhin serverseitig geprüft.
- Rücknahme einer Einladung löscht keine gemeinsame Shared-Apps-Identität.

## Verhältnis zur Auth-Integration

Die Auth-/Einladungs-/Profilfunktionen aus dem früheren PR #74 wurden über PR #128 in den aktuellen Hauptzweig integriert. PR #74 selbst wurde nicht gemergt und ist geschlossen.

Issue #115 ergänzt darauf aufbauend den administrativen Initiierungsweg und die FIB-spezifische Vorautorisierung.

## Prüfung und Betriebsgrenze

Der Branch zu #115 enthält:

- Admin-UI „Person einladen“ und Statusübersicht,
- serverseitige Admin-/AAL2-Prüfung,
- sichere Behandlung neuer und vorhandener Shared-Apps-Konten,
- Vorautorisierung der FIB-Rolle,
- Aktivierung erst nach AAL2,
- Rücknahme offener Einladungen ohne Auth-Kontolöschung,
- Wiederholung noch nicht angenommener Einladungen,
- strukturiertes serverseitiges Audit für Einladung, Vorautorisierung, Wiederholung und Rücknahme,
- Regressionstests für diese Sicherheitsverträge.

Produktive Bereitstellung der neuen Edge Function und ein gezielter Live-Smoke erfolgen erst nach erfolgreicher CI und Merge.
