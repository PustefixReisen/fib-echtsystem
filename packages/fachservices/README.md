# fachservices

Serverseitige FIB-Fachlogik und primäre Autorisierungs-/Regeldurchsetzung.

Hierher gehören insbesondere Statusübergänge, Rechte-/Bestätigungsprüfung, Schutzklassenprüfung, Audit, Plausibilitätsregeln und die koordinierte Nutzung von Storage, KI und Publish.

## Aktueller U1-Stand

Das Paket enthält zunächst die zentrale Autorisierungsbasis:

- aktive FIB-Zuordnung erforderlich,
- menschliche Identität/Rolle für menschliche Aktionen erforderlich,
- Admin-Anforderungen zentral prüfbar,
- MFA-Step-up (`aal2`) zentral prüfbar,
- S3 verlangt explizite Bestätigung,
- AI Tasks sind technisch auf S0/S1 begrenzt.

Die konkreten Fachfunktionen aus `docs/MVP-Fachfunktionen.md` werden anschließend schrittweise auf diese gemeinsame Schranke aufgesetzt. Frontends dürfen keine eigene, abweichende Autorisierungslogik etablieren.
