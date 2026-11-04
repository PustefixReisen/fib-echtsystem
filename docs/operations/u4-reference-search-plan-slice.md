# U4 – dynamische Suchplanung aus bestätigtem Referenzkontext

**Stand:** 04.11.2026 · **Feature-Branch / Draft PR #396**, keine produktive Einführung.

## Implementierter Vertrag

- In `fib.research_reference_links` können berechtigte Admins belegte Vorschläge erfassen und bestätigen/ablehnen. Der reine Vorschlag verändert den Suchkontext **nicht**.
- `fib.research_active_reference_context` enthält nur bestätigte Beziehungen. `fib.research_context_state.active_revision` macht Änderungen des aktiven Satzes sichtbar. Ein Suchlauf muss die konkret verwendete Revision dokumentieren.
- `packages/fachservices/src/u4-search-context.ts`: `buildU4SearchPlan(snapshot, locationName)` generiert einen unverzichtbaren allgemeinen Orts-Suchweg und zusätzliche Suchrichtungen aus bestätigten, direkt auf den Rechercheort bezogenen Beziehungen. Höchstens 24 Erweiterungen standardmäßig; Wiederholungen werden entfernt. Dies sind **Suchkandidaten**, keine bewerteten Fundstellen.
- `scripts/u4-plan-search.ts`: serverseitiges Diagnoseprogramm, liest Revision und bestätigte Beziehungen aus einer PostgreSQL-Transaktion mit konsistentem Snapshot und gibt den Suchplan aus. Keine automatische Suche und keine Änderung an Fachobjekten.
- `fib-reference-admin` `get_context`: versionierte Leseschnittstelle, weiterhin nur für berechtigte Admins mit MFA; zukünftiger Scheduler nutzt **nicht** einen im Frontend gespeicherten Admin-Token, sondern eine eigene eng berechtigte serverseitige Kontextlesefunktion.
- Direkte Quelle/Quellenmonitoring wird **niemals** über diese Suchplan-Kandidaten vorselektiert.

## Abgesicherte Fälle

In `tests/fachservices/u4-search-context.spec.ts`:
- bestätigter Radschnellweg ↔ Feldkirchen erweitert die Suche auch ohne den Ortsnamen im Suchbegriff;
- die grundlegende Ortssuche bleibt ohne Zusatzreferenz erhalten;
- nicht auf den Suchort bezogene Objekte erzeugen keinen fiktiven Ortsbezug;
- Dubletten und Budgetgrenzen ändern die verpflichtende Grundsuche nicht;
- ungültige Antwortdaten werden abgelehnt.

`tests/sql/research-reference-invariants.sql` und `.github/workflows/reference-admin-postgres.yml` prüfen zusätzlich per isoliertem PostgreSQL 17: Statusgrenze Vorschlag/Bestätigung, Kontextrevision, Datenbankrechte.

## Noch offen

1. Der **offene U4-Websuchdienst existiert bisher nicht als vollständiger produktiver End-to-End-Ausführer**. Ein Suchplan darf nicht mit einer tatsächlichen Trefferverbesserung verwechselt werden.
2. Weitere Horizontelemente (Themenfelder, räumliche Aliasnamen, indirekte mehrere Kanten lange Bezüge, Referenzfälle) fachlich und technisch ergänzen, ohne bestätigte Kontextbeziehungen mit Vermutungen zu vermischen.
3. Eigener, eng begrenzter Recherche-Worker mit regelgebundener Suchplanung und Suchanbietern; Quellenmonitor und offene Suche als getrennte Wege mit gemeinsamer Fundstellenverarbeitung.
4. Geprüfte, versionierte Erfassung von Suchanfragen, Laufzeit/Fehlern, Kosten und gefundenen Fundstellen; Regression mit unabhängigen Blindfällen.
5. Edge-Endpoint in lokaler isolierter Umgebung mit realen Postgres-/Auth-Annahmen prüfen. Review/Abnahme, kontrollierte Deploymentplanung. Keine Produktivmigration vor Freigabe.

**Grenze der bereits getesteten Funktion:** Sie erzeugt aktuell reproduzierbare Suchrichtungen auf Basis des bestätigten Kontexts. Sie führt weder eine externe Suche aus noch nimmt sie Relevanzbewertungen vor.
