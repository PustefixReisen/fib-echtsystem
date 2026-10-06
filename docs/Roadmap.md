# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 4.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Statusmodell

Es gelten die zentralen Status aus `PustefixReisen/pustivo/docs/governance/Dokumentenpflege.md`:

- Geplant
- In Arbeit
- Teilweise umgesetzt
- Blockiert
- Abgeschlossen
- Zurückgestellt
- Entfallen

## 1. Aktueller Stand – Gründungsphase

| Phase | Status | Ergebnis / nächster Schritt |
|---|---|---|
| Projektbasis / Repository | **Abgeschlossen** | separates Repository und initiale Dokumentationsstruktur vorhanden |
| G1 Produktumfang / MVP | **Abgeschlossen** | MVP, Ausbaustufen, Nicht-Ziele und Aufwandstreiber festgelegt |
| G2 UX / Informationsarchitektur / Fachfunktionen | **Abgeschlossen** | öffentliche und redaktionelle Zielbilder fachlich geklärt |
| G2.5 Transfer-Audit Demonstrator → Echtsystem | **Abgeschlossen** | fachliche Regeln, sichtbare Inhaltsbausteine und Redaktionsfunktionen transfergesichert |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Abgeschlossen** | Echtsystem ist Dokumentationshoheit; Transferlücken geschlossen |
| G3 Datenanforderungen / Datenmodell | **Abgeschlossen** | Datenmodell v3.0 und G3-Audit abgeschlossen |
| G4 Schutzbedarf / Datenschutz / Offline | **Abgeschlossen** | K0–K3, Löschlogik, KI-/Provider-Prüfrahmen und Offline/PWA-Grundsätze festgelegt |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Abgeschlossen** | Zielarchitektur v1.0, ADR-001 bis ADR-009 und G5-Audit abgeschlossen |
| G6 Rollen / Rechte / Workflow | **Abgeschlossen** | Rollen-/Rechtematrix, MFA, S0–S3, Fachservice-/RLS-Grenzen festgelegt |
| G7 Betrieb | **Abgeschlossen** | Backup/Restore, Monitoring, RPO/RTO, Retention und KI-Kosten-/Providerbetrieb festgelegt |
| G8 Governance / Repository / Dokumentation | **Abgeschlossen** | Dokumentationslandkarte, zentrale Governance und Wiederaufnahme-Kriterien konsolidiert |
| G9 Migration | **Abgeschlossen** | Migrationsstrategie und ausführbares Runbook festgelegt |
| G10 Go-live-Abnahme | **Abgeschlossen** | messbare Abnahmekriterien und harte Go-live-Blocker festgelegt |
| Gründungsaudit | **Abgeschlossen** | G1–G10 übergreifend geprüft; eine Statusinkonsistenz in `Projektgruendung.md` korrigiert; keine blockierende Grundsatzfrage offen |

## 2. Umsetzungsphasen

Nach bestandenem Gründungsaudit beginnt die technische Produktentwicklung.

| Umsetzungsphase | Status | Ziel / Produkt |
|---|---|---|
| U1 Technischer FIB-Kern | **Geplant** | Datenbankschema, Migrationen, gemeinsame Fachservice-Schicht, Auth-/RLS-Grundlage, Datei-/Bildspeicher-Anbindung, KI-Router-Grundlage, gemeinsame Konfiguration und Testbasis |
| U2 Redaktions-App | **Geplant** | interne Web-App für Rechercheeingang, Ereignisse/Meldungen, Vorgänge, Themen, Sitzungen, Bilder, „Mehr wissen?“, Freigaben, FIB-Chat und Administration |
| U3 Öffentliche FIB-Seite / PWA | **Geplant** | Besucheroberfläche mit `Neues | Im Blick | Sitzungen | Suche`, Detailseiten, PWA, Teilen, Transparenz und Neuigkeitsstatus |
| U4 Recherche / AI Tasks / KI-Funktionen | **Geplant** | Quellenbeobachtung, Quellenentdeckung, Rechercheläufe, Ereigniserkennung, Entwurfserstellung, Routing und Qualitätskontrollen |
| U5 Veröffentlichung / Deployment / Betrieb | **Geplant** | S3-Publish-Prozess, statischer Build, Deployment, Monitoring, Backup/Restore und betriebliche Automatisierung |
| U6 Integration / Pilot / Go-live-Vorbereitung | **Geplant** | End-to-End-Tests, Demonstrator-Regressionen, Usability-Feinschliff, Datenmigration, Pilotbetrieb und Vorbereitung der realen Go-live-Abnahme |

## 3. Nächster konkreter Schritt

**U1 – Technischer FIB-Kern starten.**

U1 beginnt nicht mit einer Vollimplementierung „auf einmal“, sondern mit einem belastbaren technischen Grundgerüst. Die erste Teilsequenz soll mindestens umfassen:

1. Monorepo-/Paketstruktur gemäß ADR-009 konkret anlegen,
2. Supabase-Projekt- und Migrationsstruktur für das fachliche Datenmodell vorbereiten,
3. gemeinsame Typen und Konfigurationsschema anlegen,
4. Fachservice-Grundgerüst und erste serverseitige Autorisierungsgrenzen umsetzen,
5. Auth-/MFA-/RLS-Grundlage vorbereiten,
6. Storage-Adapter und KI-Router-Schnittstellen als austauschbare Adapter definieren,
7. Testbasis und erste Regressionstests aufsetzen.

Die Umsetzung wird in kleinen, prüfbaren Schritten gegen die Gründungsdokumentation geführt.

## 4. Verbindliche Abschlussquellen der Gründung

- `docs/Projektgruendung.md` v1.5
- `docs/Dokumentation.md` v3.0
- `docs/Gruendungsaudit.md` v1.0
- `docs/Datenmodell.md` v3.0
- `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0
- `docs/Zielarchitektur.md` v1.0
- `docs/Rollen-Rechte-und-Workflow.md` v1.0
- `docs/Betrieb-und-Wiederherstellung.md`
- `docs/Migrationsstrategie.md` v1.1
- `docs/Migrations-Runbook.md` v1.0
- `docs/Go-live-Abnahmekriterien.md` v1.0
- G3-, G5-, G6-, G7-, G8-, G9- und G10-Abschlussaudits
- `docs/Regressionstests-Demonstratortransfer.md`
- Architekturentscheidungen unter `docs/decisions/`

## 5. Offene, aber nicht blockierende Folgepunkte

| Punkt | Wiederaufnahme / Phase |
|---|---|
| Referenzwissen Ausbaustufe 2 | GitHub Issue #1; nach Pilot nur bei nachgewiesenem Bedarf |
| externe MCP-Anbindung | GitHub Issue #2; nach MVP bei konkretem Nutzen |
| Restore-Test | GitHub Issue #3; spätestens U6 / reale G10-Abnahme |
| Recherche-/Qualitätsschwellen | U4/U6 anhand Pilotkorpus kalibrieren |
| konkrete Produktivprovider/-modelle und Budget | U4/U6 anhand Qualitäts-, Datenschutz- und Kostenmessung |
| reale Migration auf GRÜNEN-Infrastruktur | nach U1–U6 im Go-live-Kontext |

## 6. Entwicklungsprinzipien

- Fachliche Parität zum Demonstrator ist Mindestanforderung, nicht Endziel.
- Ein Sachverhalt besitzt eine verbindliche Dokumentationsquelle.
- Web-App, FIB-Chat und AI Tasks nutzen dieselbe Fachservice-Schicht.
- KI wird nur mit klarem Nutzen eingesetzt; erforderliche Qualität geht vor niedrigstem Preis.
- AI Tasks bleiben S0/S1; fachliche Bestätigung und Veröffentlichung bleiben menschlich verantwortlich.
- Öffentliche Auslieferung bleibt Static-first.
- Datenschutz-, Schutzklassen-, Rechte-, Audit- und Quellenregeln werden technisch abgesichert.
- Implementierung und Dokumentation werden gemeinsam fortgeschrieben.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 4.0 | 06.10.2026 | Gründungsaudit bestanden; G1–G10 und Gründungsphase abgeschlossen; U1 als nächsten technischen Umsetzungsschritt gesetzt; Roadmap auf Umsetzungsphasen umgestellt. |
| 3.9 | 06.10.2026 | G10 nach Festlegung der Go-live-Abnahmekriterien und bestandenem G10-Gesamtaudit abgeschlossen; Gründungsaudit als nächsten Schritt gesetzt. |
| 3.8 | 06.10.2026 | G9 nach Präzisierung der Migrationsstrategie, Erstellung des Migrations-Runbooks und bestandenem G9-Gesamtaudit abgeschlossen; G10 als nächsten Gründungsschritt gesetzt. |
| 3.7 | 06.10.2026 | G8 nach Konsolidierung der Dokumentationslandkarte und zentralen Dokumentationsregeln abgeschlossen; G9 als nächsten Gründungsschritt gesetzt. |
| 3.6 | 06.10.2026 | G7 nach Festlegung von Backup, Restore-Pflicht, RPO/RTO, Retention und Monitoring abgeschlossen; G8 als nächsten Schritt gesetzt. |