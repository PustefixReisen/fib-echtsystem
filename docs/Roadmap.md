# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 3.9 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G1 Produktumfang / MVP | **Abgeschlossen** | MVP, unmittelbare Ausbaustufe, spätere Erweiterungen, Nicht-Ziele und Aufwandstreiber verbindlich festgelegt |
| G2 UX / Informationsarchitektur / Fachfunktionen | **Abgeschlossen** | UX, öffentliche Navigation, Screenlogik, visuelle Identität, Claim, responsive Bannerlogik, GRÜNEN-Rücksprung und Assetstruktur sind konsolidiert; Abschlussprüfung durchgeführt |
| G2.5 Transfer-Audit Demonstrator → Echtsystem | **Abgeschlossen** | zwei Prüfschichten abgeschlossen: fachliche Regeln/Recherche/Persistenz sowie sichtbare Inhaltsbausteine/Redaktionsfunktionen; Transfer-Gates bestanden |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Abgeschlossen** | Hauptdokumente sowie sichtbare Inhaltsbausteine und Redaktionsfunktionen erneut gegengeprüft; erkannte Lücken geschlossen oder als bewusste spätere Produktentscheidung dokumentiert |
| G3 Datenanforderungen / Datenmodell | **Abgeschlossen** | fachliches/logisches Datenmodell v3.0 konsolidiert; G3-Gesamtaudit bestanden; drei Alt-Widersprüche bereinigt; keine offenen fachlichen G3-Grundsatzfragen |
| G4 Schutzbedarf / Datenschutz / Offline | **Abgeschlossen** | Schutzklassen K0–K3, K2-Minimierung, Löschlogik, KI-/Provider-Prüfrahmen, Offline/PWA-Grundsätze und DSFA-Vorprüfung festgelegt |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Abgeschlossen** | Zielarchitektur v1.0 und ADR-001 bis ADR-009 konsolidiert; G5-Gesamtaudit bestanden; Static-first, Fachservices, Storage, Suche/RAG, AI Tasks, Auth/RLS, KI-Router, CI/CD und Monorepo-Struktur verbindlich festgelegt |
| G6 Rollen / Rechte / Workflow | **Abgeschlossen** | Rollen-/Aktions- und Fachfunktionsmatrix v1.0, verpflichtende MFA für Redakteure/Admins, Step-up-Regeln, Adminvorbehalte sowie Fachservice-/RLS-Grenzen festgelegt; G6-Gesamtaudit bestanden |
| G7 Betrieb | **Abgeschlossen** | Betriebsrahmen v0.2 und G7-Gesamtaudit v1.0 abgeschlossen; Pilot-Backup Supabase → Nextcloud → PC → Back In Time, Restore-Pflicht, Monitoring/Warnwege, RPO/RTO, Retention sowie KI-Kosten-/Providerbetrieb festgelegt |
| G8 Governance / Repository / Dokumentation | **Abgeschlossen** | Dokumentationslandkarte v3.0 konsolidiert, zentrale pustivo-Dokumentationsregel erweitert, Issues mit Wiederaufnahme-Kriterien geprüft und G8-Governanceaudit bestanden |
| G9 Migration | **Abgeschlossen** | Migrationsstrategie v1.1 präzisiert; ausführbares Runbook v1.0 mit Zielvorbereitung, Daten-/Storage-/Providerübernahme, Prüfgates, Go-live- und Rückfalllogik erstellt; G9-Gesamtaudit bestanden |
| G10 Go-live-Abnahme | **Abgeschlossen** | Go-live-Abnahmekriterien v1.0 mit harten Blockern, Regressionen, Recherchequalität, Sicherheit/Datenschutz, Restore, Migration, Betrieb, KI-Kosten und organisatorischer Übergabe festgelegt; G10-Gesamtaudit bestanden |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit aller Gründungspakete G1–G10 prüfen; danach beginnt die eigentliche Produktentwicklung |

## 2. Umsetzungsphasen nach dem Gründungsaudit

Die Gründungsphasen G1–G10 legen fest, **was FIB können soll und wie es sicher, wartbar und migrierbar aufgebaut wird**. Sie ersetzen nicht die eigentliche Produktentwicklung.

Nach bestandenem Gründungsaudit beginnt die technische Umsetzung in sichtbar getrennten Produktsträngen. Diese dürfen technisch parallelisiert werden, soweit ihre Abhängigkeiten geklärt sind.

| Umsetzungsphase | Ziel / Produkt |
|---|---|
| U1 Technischer FIB-Kern | Datenbankschema, Migrationen, gemeinsame Fachservice-Schicht, Auth-Grundlage, Datei-/Bildspeicher-Anbindung, KI-Router, gemeinsame Konfiguration und Testgrundlage |
| U2 Redaktions-App | interne Web-App für Rechercheeingang, Ereignisse/Meldungen, Vorgänge, Themen, Sitzungen, Bilder, „Mehr wissen?“, Freigaben, FIB-Chat und redaktionelle Administration |
| U3 Öffentliche FIB-Seite / PWA | konkrete Besucheroberfläche mit `Neues | Im Blick | Sitzungen | Suche`, Detailseiten, Bildern, „Mehr wissen?“, Transparenz, Teilen, PWA, Neuigkeitsstatus und Web Push |
| U4 Recherche / AI Tasks / KI-Funktionen | Quellenbeobachtung, Quellenentdeckung, Rechercheläufe, Ereigniserkennung, Entwurfserstellung, KI-gestützte Einordnung, Routing und Qualitätskontrollen |
| U5 Veröffentlichung / Deployment / Betrieb | S3-Publish-Prozess, statischer öffentlicher Build, Medienübernahme, Sitemap/SEO, Deployment, Cache/Invalidierung, Monitoring, Backup/Restore und betriebliche Automatisierung |
| U6 Integration / Pilot / Go-live-Vorbereitung | End-to-End-Tests, Demonstrator-Regressionen, Usability-Feinschliff von Redaktion und Besucherseite, Datenmigration, Pilotbetrieb, Fehlerkorrektur und Vorbereitung der realen G10-Abnahme |

## 3. G2.5 – Transfer-Audit Demonstrator → Echtsystem

Verbindliche Detailquellen:

- `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`
- `docs/Regressionstests-Demonstratortransfer.md`

## 4. Nächster konkreter Schritt

**Gründungsaudit:** G1–G10 als Gesamtsystem auf Vollständigkeit, Widerspruchsfreiheit, Doppelregelungen, offene Grundsatzfragen und saubere Übergabe an U1–U6 prüfen. Erst nach bestandenem Gründungsaudit beginnt die eigentliche Produktentwicklung.

## 5. G3 – Abschluss

Verbindlicher Abschlussnachweis: `docs/G3-Gesamtaudit.md` v1.2. `docs/Datenmodell.md` v3.0 ist die konsolidierte Integrationsquelle.

## 6. G4 – Abschluss

Verbindliche Integrationsquelle: `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0.

## 7. G5 – Abschluss

Verbindliche Integrationsquelle: `docs/Zielarchitektur.md` v1.0. Abschlussnachweis: `docs/G5-Gesamtaudit.md` v1.0.

## 8. G6 – Abschluss

Verbindliche Integrationsquelle: `docs/Rollen-Rechte-und-Workflow.md` v1.0. Abschlussnachweis: `docs/G6-Gesamtaudit.md` v1.0.

## 9. G7 – Abschluss

Verbindliche Integrationsquelle: `docs/Betrieb-und-Wiederherstellung.md` v0.2. Abschlussnachweis: `docs/G7-Gesamtaudit.md` v1.0.

## 10. G8 – Abschluss

Verbindliche Dokumentationslandkarte: `docs/Dokumentation.md` v3.0. Abschlussnachweis: `docs/G8-Governance-und-Dokumentationsaudit.md` v1.0.

## 11. G9 – Abschluss

Verbindliche Primärquelle: `docs/Migrationsstrategie.md` v1.1. Ausführbares Runbook: `docs/Migrations-Runbook.md` v1.0. Abschlussnachweis: `docs/G9-Gesamtaudit.md` v1.0.

## 12. G10 – Abschluss

Verbindliche Primärquelle: `docs/Go-live-Abnahmekriterien.md` v1.0.

Verbindlicher Abschlussnachweis: `docs/G10-Gesamtaudit.md` v1.0.

Festgelegt sind insbesondere:

- keine Go-live-Freigabe mit offenen kritischen fachlichen Regressionen,
- 100 % der kritisch eingestuften Transfer-Referenzfälle müssen bestanden sein,
- Recherche-/Ereignisentdeckung wird mit realem Pilotkorpus bewertet; kritische Pflichtquellen- und Ereignisfälle müssen erkannt werden,
- keine erfundene globale Qualitätsquote ohne Datenbasis; Precision/Recall-Schwellen werden aus Pilotmessungen abgeleitet,
- MFA-/Rechte-/S3-/RLS-/Audit-Anforderungen müssen praktisch nachgewiesen sein,
- offene Datenschutz-/DSFA-/Providerblocker verhindern Go-live,
- Static-first-Build, Rollback, PWA, Links und K0-Abgrenzung müssen funktionieren,
- erfolgreicher Restore-Test aus GitHub Issue #3 ist zwingende Go-live-Bedingung,
- reale Migration und organisatorische Übergabe müssen vollständig validiert sein,
- KI-Providerwege, Qualität, Fallbacks, Kostenmessung und Produktivbudget müssen mit Pilotdaten geprüft sein,
- bekannte kritische Sicherheitslücken oder ungeschützte Secrets blockieren den Go-live,
- nichtkritische Komfortabweichungen dürfen nur dokumentiert nach Go-live verschoben werden.

## 13. Hybrid-KI – Entwicklungsprinzip

Für das Echtsystem gilt verbindlich:

> **KI wird nur dort eingesetzt, wo sie fachlich erforderlich ist oder einen klaren zusätzlichen Nutzen bringt. Wird KI eingesetzt, hat die erforderliche Ergebnisqualität Vorrang vor dem niedrigsten Preis.**

## 14. Visuelle Identität – geklärt

Verbindliche Primärquelle: `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

## 15. Wichtige Echtsystem-Dokumentation

Die aktuelle Dokumentationslandkarte und Zuordnung der Primärquellen steht in `docs/Dokumentation.md` v3.0. Architekturentscheidungen liegen unter `docs/decisions/`.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 3.9 | 06.10.2026 | G10 nach Festlegung der Go-live-Abnahmekriterien und bestandenem G10-Gesamtaudit abgeschlossen; Gründungsaudit als nächsten Schritt gesetzt. |
| 3.8 | 06.10.2026 | G9 nach Präzisierung der Migrationsstrategie, Erstellung des Migrations-Runbooks und bestandenem G9-Gesamtaudit abgeschlossen; G10 Go-live-Abnahme als nächsten Gründungsschritt gesetzt. |
| 3.7 | 06.10.2026 | G8 nach Konsolidierung der Dokumentationslandkarte und zentralen Dokumentationsregeln abgeschlossen; G8-Governanceaudit bestanden; G9 Migration als nächsten konkreten Gründungsschritt gesetzt. |
| 3.6 | 06.10.2026 | G7 nach Festlegung der Pilot-Backupkette, Restore-Pflicht, RPO/RTO, Retention und Monitoring-/Warnwege abgeschlossen; G7-Gesamtaudit bestanden; G8 Governance/Dokumentation als nächsten konkreten Gründungsschritt gesetzt. |
