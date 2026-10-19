# Abnahmeplan Themenbeziehungen – Issue #136 / PR #137

Stand: 19.10.2026. **Testfälle definiert, noch nicht als Integrationstests ausgeführt.**

## Sicherheits- und Integrationsprüfungen vor Merge

| Fall | Erwartung |
|---|---|
| Ohne Bearer-Token | HTTP 403, keine Datenänderung |
| Mit gültigem Token auf AAL1 | HTTP 403, MFA erforderlich |
| Aktiver FIB-Editor mit AAL2 | Nur dann erlaubte Redaktionsaktionen |
| Deaktivierter / fremder Shared-Apps-Auth-Benutzer | HTTP 403, keine Wirkung |
| Ungültige UUID oder Bedeutungsstufe | HTTP 400, kein DB-Schreibzugriff |
| Thema + bestehender Kreuz-Ost-Vorgang | Genau ein offener Vorschlag, keine wirksame Beziehung |
| Zweiter offener Vorschlag für dieselbe Beziehung | Keine Dublette; eindeutiger DB-Index greift |
| Redakteur verändert KI/Redaktionsvorschlag und bestätigt | Atomar: bestätigte Beziehung + Auditfelder zum Review |
| Gleichzeitige Doppelbestätigung | Höchstens einmal wirksame Beziehung |
| Ablehnung | Auditentscheidung, aber keine wirksame Beziehung |
| Wiederholte Bestätigung einer erledigten Vorlage | HTTP 409, kein weiterer Dateneffekt |
| Browser versucht origin='ai' | HTTP 400; nur vertraute KI-Integration darf später KI-Herkunft setzen |
| Nichtveröffentlichung | Entwicklungsdaten nicht öffentlich sichtbar |
| Bestehende Auth-/Event-Funktionen | Keine Regression |

## Vor Freigabe noch erforderlich

- Migration isoliert validieren (Constraints, Indizes, FK, Rollengrenzen und Berechtigungen).
- Sichern, dass `fib.process_topic_proposals.reviewed_by` den bestehenden FIB-Benutzer eindeutig referenziert.
- UI-Ablauf mit Rolle Redakteur und Admin testen; Fehlermeldungen, erneutes Laden und mobile Ansicht.
- Dokumentation und Code gemeinsam auf Fachkonsistenz prüfen.
- CI grün; PR als Entwurf belassen, bis reale Integrationstests und manuelle Abnahme erfolgt sind.
- Ein produktiver Deploy/Merge ist **nicht** durch den Erfolg des Frontend-Builds autorisiert.
