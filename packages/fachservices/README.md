# fachservices

Serverseitige FIB-Fachlogik und primäre Autorisierungs-/Regeldurchsetzung.

Hierher gehören insbesondere Statusübergänge, Rechte-/Bestätigungsprüfung, Schutzklassenprüfung, Audit, Plausibilitätsregeln und die koordinierte Nutzung von Storage, KI und Publish.

## Aktueller U1-Stand

Das Paket enthält die zentrale Autorisierungsbasis:

- aktive FIB-Zuordnung erforderlich,
- menschliche Identität/Rolle für menschliche Aktionen erforderlich,
- Admin-Anforderungen zentral prüfbar,
- MFA-Step-up (`aal2`) zentral prüfbar,
- S3 verlangt explizite Bestätigung,
- AI Tasks sind technisch auf S0/S1 begrenzt.

Zusätzlich ist der erste vollständige menschliche Zugriffspfad implementiert:

```text
Supabase Access Token
  -> serverseitige Prüfung mit Auth.getClaims()
  -> verifizierte auth.users-ID aus JWT-Claim `sub`
  -> Lookup in fib.app_users
  -> aktiver FIB-Akteur mit Rolle editor/admin
  -> zentrale authorize()-Prüfung
  -> Fachfunktion
  -> Zugriff über fib_app/fib_runtime auf fib.*
```

Dabei gilt ausdrücklich:

- ein gültiges Supabase-Login allein verleiht keine FIB-Berechtigung,
- FIB-Rollen werden nicht aus `user_metadata` oder anderen benutzeränderbaren Claims übernommen,
- die FIB-Rolle stammt ausschließlich aus `fib.app_users`,
- anonyme Auth-Benutzer werden für den Redaktionszugriff abgewiesen,
- bei fehlender oder inaktiver FIB-Mitgliedschaft wird vor jedem FIB-Fachdatenzugriff abgebrochen.

Mit `authenticatedGetEvent()` existiert der erste durchgängige S0-Pfad bis zur Fachfunktion `getEvent()`.
Regressionstestfälle liegen unter `tests/fachservices/authenticated-get-event.spec.ts`.

Die weiteren Fachfunktionen aus `docs/MVP-Fachfunktionen.md` werden schrittweise auf dieselbe gemeinsame Schranke aufgesetzt. Frontends dürfen keine eigene, abweichende Autorisierungslogik etablieren.
