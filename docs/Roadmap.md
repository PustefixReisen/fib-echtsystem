# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 3.7 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G9 Migration | **Geplant** | Übergang auf GRÜNEN-Infrastruktur nach `docs/Migrationsstrategie.md`; wiederholbares Migrations-Runbook konkretisieren |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen, einschließlich Qualität der verpflichtenden Quellen-/Ereignisentdeckung, Transfer-Regressionstests, Datenschutz-/Schutzbedarfsanforderungen, Restore-Test und belastbarer Betriebskostenmessung |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit aller Gründungspakete prüfen; danach beginnt die eigentliche Produktentwicklung |

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
| U6 Integration / Pilot / Go-live-Vorbereitung | End-to-End-Tests, Demonstrator-Regressionen, Usability-Feinschliff von Redaktion und Besucherseite, Datenmigration, Pilotbetrieb, Fehlerkorrektur und Vorbereitung der G9/G10-Abnahme |

### 2.1 Redaktions-App

Die **Redaktions-App ist ein eigenständiges zentrales Produkt** und wird in U2 umgesetzt. G2 und G3 haben bereits fachlich beschrieben, welche Funktionen und Daten sie benötigt; G5/G6 legen die technische Architektur und die Rechte dafür fest.

Zum MVP der Redaktions-App gehören insbesondere:

- Login und rollenabhängiger Arbeitsbereich,
- Rechercheeingang und Ereigniskandidaten,
- Bearbeitung von Ereignis und Meldung,
- Vorgangs- und Themenpflege,
- Sitzungen/TOPs,
- strukturierte Wirkungen, Perspektiven und Einordnung,
- offene Fragen und Beobachtungsaufträge,
- Bilder und Bildverwendungen,
- „Mehr wissen?“-Inhalte,
- Freigabe/Veröffentlichung/Rücknahme,
- FIB-Chat als dialogorientierter Zugang zu denselben Fachfunktionen,
- kompakter Betriebs-/Redaktionsüberblick.

Die konkrete Bediengestaltung der Redaktions-App wird während U2 iterativ mit realen Arbeitsfällen geprüft. Die bereits festgelegten Fachregeln und Workflows sind dabei verbindlich; Bildschirmaufteilung und Bedienkomfort dürfen weiter optimiert werden.

### 2.2 Öffentliche FIB-Seite / PWA

Die **öffentliche Besucheroberfläche ist ebenfalls ein eigener Produktstrang** und wird in U3 umgesetzt.

G2 hat Informationsarchitektur, Navigation, Detailseiten, Bildsprache und wesentliche UX-Regeln bereits konzipiert. U3 übersetzt diese Vorgaben in die tatsächlich nutzbare Website/PWA und verfeinert sie anhand realer Geräte und Inhalte.

Zum MVP gehören insbesondere:

- Startseite,
- `Neues`, `Im Blick`, `Sitzungen`, `Suche`,
- Meldungs-, Vorgangs-, Themen- und Sitzungsdetailseiten,
- Bilder und Bildunterschriften,
- Quellen, Zusammenhänge, Bezüge und Verlauf,
- „Mehr wissen?“,
- Transparenz/Disclaimer,
- Teilen, Drucken und Social Preview,
- responsive/mobile Darstellung und WCAG-2.2-AA-Ziel,
- PWA,
- gerätebezogenes „Neu seit letztem Besuch“,
- Web Push nach Opt-in,
- technische SEO-Grundlagen.

Die öffentliche Gestaltung ist damit **nicht mit G2 abgeschlossen**: G2 definiert das fachliche/gestalterische Zielbild; U3 ist die eigentliche Umsetzung und der iterative visuelle und ergonomische Feinschliff.

## 3. G2.5 – Transfer-Audit Demonstrator → Echtsystem

G2.5 sichert ab, dass der aufwändige Demonstrator- und Testbetrieb vollständig in das Echtsystem einfließt und nicht nur die bereits sichtbaren Hauptdokumente übernommen werden.

Verbindliche Detailquellen:

- `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`
- `docs/Regressionstests-Demonstratortransfer.md`

## 4. Nächster konkreter Schritt

**G9 – Migration:** Die bereits festgelegte Migrationsstrategie in ein konkret ausführbares, wiederholbares Migrations-Runbook überführen. Dabei werden Datenbank, Auth, Dateien/Bilder, Provider-/Secrets-Konfiguration, Domain/Deployment, Validierung und Rückfallmöglichkeit so beschrieben, dass der Übergang von Entwickler-/Pilotinfrastruktur auf die GRÜNEN-Infrastruktur nachvollziehbar durchgeführt werden kann.

## 5. Fachlich/UX bereits geklärt

- öffentliche Hauptnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- zentrale Fachobjekte sind Ereignis, Meldung, Vorgang, Thema, Sitzung/TOP sowie Recherche-, Referenz-, Vertiefungs- und Medienobjekte.
- Meldung, Vorgang und Thema sind fachlich getrennte Objekttypen.
- Themen und Vorgänge erscheinen öffentlich gemeinsam unter **„Im Blick“**.
- „Mehr wissen?“ ist als quellengebundenes Vertiefungsangebot modelliert.
- Web-App, FIB-Chat und AI Tasks verwenden dieselbe Fachfunktionsschicht.
- PWA, Neuigkeitsstatus, Push, Teilen, Drucken, Social Preview und zielgenaue Links sind fachlich geklärt.
- Mobile First und **WCAG 2.2 AA** sind technisches Ziel.

## 6. G3 – Abschluss

Verbindlicher Abschlussnachweis: `docs/G3-Gesamtaudit.md` v1.2. `docs/Datenmodell.md` v3.0 ist die konsolidierte Integrationsquelle.

## 7. G4 – Abschluss

Verbindliche Integrationsquelle: `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0. Schutzklassen K0–K3, K2-Minimierung, Datenschutz-/Löschgrundsätze und KI-/Provider-Prüfrahmen sind festgelegt.

## 8. G5 – Abschluss

Verbindliche Integrationsquelle: `docs/Zielarchitektur.md` v1.0. Abschlussnachweis: `docs/G5-Gesamtaudit.md` v1.0.

## 9. G6 – Abschluss

Verbindliche Integrationsquelle: `docs/Rollen-Rechte-und-Workflow.md` v1.0. Abschlussnachweis: `docs/G6-Gesamtaudit.md` v1.0.

## 10. G7 – Abschluss

Verbindliche Integrationsquelle: `docs/Betrieb-und-Wiederherstellung.md` v0.2. Abschlussnachweis: `docs/G7-Gesamtaudit.md` v1.0.

## 11. G8 – Abschluss

Verbindliche Dokumentationslandkarte: `docs/Dokumentation.md` v3.0.

Verbindlicher Abschlussnachweis: `docs/G8-Governance-und-Dokumentationsaudit.md` v1.0.

Festgelegt bzw. bestätigt sind insbesondere:

- GitHub-Echtsystemrepository als Dokumentationshoheit,
- „Ein Sachverhalt – eine verbindliche Quelle“,
- aktive Dokumentationspflege durch ChatGPT bei vorhandenem GitHub-Zugriff,
- weit gefasste Dokumentationsprüfung auch für potenziell dauerhaft relevante Ergebnisse,
- Roadmap-Pflege und Phasenabschluss nur nach dokumentiertem Ergebnis,
- Issues mit Wiederaufnahme-Kriterien für bewusst vertagte Punkte,
- ADRs für dauerhafte Architekturentscheidungen,
- keine automatische physische Dokumentenumordnung ohne konkreten Nutzen,
- Chats, Demonstrator und Exportkopien nicht als parallele Primärquellen.

## 12. Hybrid-KI – Entwicklungsprinzip

Für das Echtsystem gilt verbindlich:

> **KI wird nur dort eingesetzt, wo sie fachlich erforderlich ist oder einen klaren zusätzlichen Nutzen bringt. Wird KI eingesetzt, hat die erforderliche Ergebnisqualität Vorrang vor dem niedrigsten Preis.**

## 13. Visuelle Identität – geklärt

Verbindliche Primärquelle: `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

## 14. Migrationsgrundsatz – Entwickler → GRÜNEN-Infrastruktur

Verbindliche Primärquelle: `docs/Migrationsstrategie.md`.

Festgelegt ist:

- produktionsreife Entwicklung zunächst auf Entwickler-Infrastruktur,
- späterer Zielbetrieb auf GRÜNEN-Webserver plus eigenem Supabase-Projekt,
- kein Supabase-Self-Hosting,
- keine persönliche Bindung von Architektur oder Geschäftslogik,
- reproduzierbare Datenbank-/Backend-/Deployment-Konfiguration,
- wiederholbare Migration mit Runbook.

## 15. Wichtige Echtsystem-Dokumentation

Die aktuelle Dokumentationslandkarte und Zuordnung der Primärquellen steht in `docs/Dokumentation.md` v3.0. Architekturentscheidungen liegen unter `docs/decisions/`.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 3.7 | 06.10.2026 | G8 nach Konsolidierung der Dokumentationslandkarte und zentralen Dokumentationsregeln abgeschlossen; G8-Governanceaudit bestanden; G9 Migration als nächsten konkreten Gründungsschritt gesetzt. |
| 3.6 | 06.10.2026 | G7 nach Festlegung der Pilot-Backupkette, Restore-Pflicht, RPO/RTO, Retention und Monitoring-/Warnwege abgeschlossen; G7-Gesamtaudit bestanden; G8 Governance/Dokumentation als nächsten konkreten Gründungsschritt gesetzt. |
| 3.5 | 06.10.2026 | G7 gestartet; Betriebsrahmen angelegt. |
| 3.4 | 06.10.2026 | G6 abgeschlossen; G7 gestartet. |
| 3.3 | 06.10.2026 | G6 gestartet. |
| 3.2 | 06.10.2026 | G5 abgeschlossen; G6 als nächsten Schritt gesetzt. |
| 3.1 | 06.10.2026 | Roadmap in Gründungs- und Umsetzungsphasen gegliedert. |
| 3.0 | 06.10.2026 | G4 gestartet. |
| 2.9 | 05.10.2026 | G3 abgeschlossen; G4 als nächsten Schritt gesetzt. |
