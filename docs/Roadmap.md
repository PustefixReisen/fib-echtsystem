# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 3.4 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring, KI-Kostenmessung, Routing-Betrieb, Budgets, Warnschwellen sowie technische Aufbewahrungs-/Löschregeln definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Echtsystem als Dokumentationshoheit etabliert; G2.5–G6 abgeschlossen; zentrale Standards und späterer Gründungsaudit weiterführen |
| G9 Migration | **Geplant** | Übergang auf GRÜNEN-Infrastruktur nach `docs/Migrationsstrategie.md`; wiederholbares Migrations-Runbook statt separatem Migrations-Probelauf |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen, einschließlich Qualität der verpflichtenden Quellen-/Ereignisentdeckung, Transfer-Regressionstests, Datenschutz-/Schutzbedarfsanforderungen und belastbarer Betriebskostenmessung |
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

### Prüfquellen

Der Audit berücksichtigt fünf Quellenklassen:

1. kanonische Dokumentation des Demonstrators,
2. Demonstrator-Datenbestand und sichtbares Verhalten,
3. Betriebs-, Update- und Fehlerprotokolle,
4. Spezial- und Übergabedokumente,
5. relevante frühere FIB-Chats als **Lückenfinder**, nicht als kanonische Wahrheit.

Zusätzlich wurde am 04.10.2026 eine zweite Prüfschicht abgeschlossen:

> **sichtbare Inhaltsbausteine und redaktionelle Funktionen des Demonstrators → fachliche Bedeutung → Datenhaltung → Redaktionsworkflow → öffentliche Darstellung → bewusste Produktabweichung**

### Ergebnis

Die erste Prüfschicht hat insbesondere abgesichert:

- erweiterter Suchraum und mögliche zukünftige Bedeutung,
- dynamischer Suchkontext aus Themen und Vorgängen,
- sechsmonatiger Rückblick bei neuem oder wesentlich geschärftem Suchkontext,
- 30-%-Warnschwelle als Qualitätskontrolle für ausschließlich mittelbar relevante veröffentlichte Beiträge,
- Persistenzschutz,
- Quellenpflicht bei „Mehr wissen?“,
- RIS-Link-, Datums- und Statuslogik,
- Folgerecherche aus internen Hintergrundquellen,
- PWA-Neuigkeitslogik,
- Ablösung der alten Wirkungsrollen durch **Bedeutung für das Thema** + Perspektiven/Wirkungen,
- Dokumentationshoheit des Echtsystems gegenüber ODT-/Exportkopien.

Die zweite Prüfschicht hat zusätzliche Demonstrator-Funktionen nachgezogen, insbesondere:

- Meldungsbaustein **„Was bisher passiert ist“**,
- **Offene Fragen** auf Meldungs- und Themenebene samt persistenter Modellierung,
- explizite Sichtbarkeit relevanter Ereignisse aus Nachbargemeinden in Themen,
- Trennung von **„Zusammenhänge“** (Vorgang/Thema/Sitzung-TOP) und **„Bezüge“** (konkrete Objekte/Orte),
- vollständiger Bildaufnahme-/Auswahl-/Freigabeworkflow,
- Bildbibliothek mit Primärzuordnung, weiteren zulässigen Verwendungen und Nutzungsausschlüssen,
- konkrete Verwendungslogik von Inhaltsbildern einschließlich Rechte-, Alt-Text- und Nachweislogik,
- bewusste spätere Produktentscheidung zu **„Mehr zum Bild“** und freien Live-Fragen,
- sichere Ausgabe dynamischer KI-Antworten als spätere technische Sicherheitsanforderung,
- Ausbau des Regressionstestkorpus auf 28 Referenzfälle.

Verbindliche Detailquellen:

- `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`
- `docs/Regressionstests-Demonstratortransfer.md`

## 4. Nächster konkreter Schritt

**G7 – Betrieb:** Backup/Restore, Monitoring, technische Aufbewahrung/Löschung, Sitzungs-/Recoveryregeln, KI-Kosten- und Routingbetrieb, Budgets, Warnschwellen sowie betriebliche Verantwortlichkeiten festlegen. Die konkrete technische Implementierung erfolgt später in U1/U5.

## 5. Fachlich/UX bereits geklärt

- öffentliche Hauptnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- zentrale Fachobjekte sind Ereignis, Meldung, Vorgang, Thema, Sitzung/TOP sowie die in G3 ergänzten Recherche-, Referenz-, Vertiefungs- und Medienobjekte.
- „Aktuell“ ist ausschließlich zeitliche Hervorhebung.
- Ereignis und Meldung sind getrennte fachliche Objekte.
- Dokument/Fundstelle und reales Ereignis sind getrennt; Veröffentlichung einer Vorlage und spätere Beschlussfassung sind verschiedene Entwicklungsschritte.
- Meldung, Vorgang und Thema sind fachlich getrennte Objekttypen.
- Themen und Vorgänge erscheinen öffentlich gemeinsam unter **„Im Blick“**.
- Vorgänge besitzen eigenen aktuellen Stand, Verlauf und Status.
- Themen erklären übergeordnete Zusammenhänge und gewichten Vorgänge bzw. direkt ergänzte Ereignisse nach **Bedeutung für das Thema**: prägend, relevant oder ergänzend.
- Perspektiven und Wirkungen erklären die fachliche Relevanz; eine eigene Wirkungsrollen-Taxonomie wird nicht geführt.
- Wirkung ist am Ereignis verankert; ihr Herkunftskontext bestimmt die fachliche Änderbarkeit.
- Meldungs-, Vorgangs-, Themen- und Sitzungsdetailseiten sind festgelegt; Demonstrator-Inhaltsbausteine sind nach dem zweiten Transfer-Audit synchronisiert.
- Meldungen trennen öffentlich **Zusammenhänge** zu Vorgang/Thema/Sitzung-TOP von **Bezügen** zu konkreten Objekten/Orten.
- zentrale Suche und schlanke Filterlogik sind festgelegt.
- „Mehr wissen?“ ist als Vertiefungsfrage plus quellengebundene Vertiefungsantwort modelliert und von internen offenen Fragen/Wissenslücken getrennt.
- Beobachtungsauftrag, Recherchelauf, AI Task und AI Task Run sind getrennte fachliche/operative Objekte.
- Web-App, FIB-Chat und AI Tasks verwenden dieselbe Fachfunktionsschicht; reguläre fachliche Datenzugriffe umgehen diese Schicht nicht.
- PWA umfasst lokalen Neuigkeitsstatus, optionale Push-Abonnements und ergänzende Badge-Unterstützung; fachlich relevante Aktualisierungen zählen als Neuigkeit.
- Teilen, Drucken, Social Preview und zielgenaue Update-Links sind fachlich geklärt.
- Transparenz, „Über Feldkirchen im Blick“ und Disclaimer sind geklärt.
- Mobile First und **WCAG 2.2 AA** sind technisches Ziel.
- Barrierefreiheit ergänzt die bestehende bürgernahe FIB-Sprache und ersetzt sie nicht.

## 6. G3 – Abschluss

Verbindlicher Abschlussnachweis: `docs/G3-Gesamtaudit.md` v1.2.

Das Audit hat insbesondere drei erhebliche Alt-Widersprüche bereinigt:

1. redundante Meldung↔Sitzung/TOP-Beziehungen,
2. widersprüchliche Verankerung von Wirkungen,
3. Vermischung von Beschlussvorlage/Fundstelle und späterem Beschlussereignis.

`docs/Datenmodell.md` v3.0 ist die konsolidierte Integrationsquelle. Es bestehen keine bekannten offenen fachlichen G3-Grundsatzfragen.

## 7. G4 – Abschluss

Verbindliche Integrationsquelle: `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0.

Festgelegt sind insbesondere:

- Schutzklassen K0–K3,
- Datenminimierung und K2-Minimierung,
- Trennung von Schutzklasse und Personenbezug,
- Lösch-/Aufbewahrungsgrundsätze,
- schutzklassenabhängige KI-/Providerfreigabe,
- keine K3-Übermittlung an KI,
- DSFA-Vorprüfung vor Go-live,
- Besucher-PWA ohne zentrale Besucherprofile,
- keine Offline-Redaktionsdatenbank im MVP,
- Regeln für Bilder/Dateien, Push und Logs.

## 8. G5 – Abschluss

Verbindliche Integrationsquelle: `docs/Zielarchitektur.md` v1.0.

Verbindlicher Abschlussnachweis: `docs/G5-Gesamtaudit.md` v1.0.

Festgelegt sind insbesondere:

- TypeScript/Astro und Static-first für die öffentliche Seite,
- gemeinsame serverseitige Fachservice-Schicht,
- Supabase/PostgreSQL als strukturierter Kern,
- austauschbarer Datei-/Bildspeicher mit Nextcloud als Pilotkandidat,
- versionierter K0-Publish mit Validierung und Rollback,
- strukturierte Suche/Volltext vor optionaler Vektorsuche,
- RAG auf Basis des FIB-Kontexts,
- Supabase Cron/Queue/Worker für AI Tasks,
- Supabase Auth + serverseitige Rechteprüfung + RLS als Defense in Depth,
- zentraler KI-Router mit Mehranbieterbetrieb und Qualitätsklassen,
- GitHub Actions für CI/CD,
- hosterunabhängiger Build mit SFTP/SSH-Pilotdeployment auf IONOS,
- FIB-Monorepo mit getrennten Anwendungen für öffentliche Seite und Redaktion.

Die konkrete Rollen-/Policy-Matrix ist bewusst G6 zugeordnet; Backup/Monitoring/Kosten-/Providerbetrieb folgen in G7, das konkrete Migrationsrunbook in G9.

## 9. G6 – Abschluss

Verbindliche Integrationsquelle: `docs/Rollen-Rechte-und-Workflow.md` v1.0.

Verbindlicher Abschlussnachweis: `docs/G6-Gesamtaudit.md` v1.0.

Festgelegt sind insbesondere:

- genau drei menschliche Rollen: Besucher, Redakteur, Admin,
- AI Tasks als technische Akteure mit maximal S0/S1,
- Fachfunktionsrechte und S0–S3-Bestätigungslogik,
- S3 immer mit unmittelbarer expliziter Bestätigung,
- Adminvorbehalte für Sicherheits-, Rechte- und systemweite normative Änderungen,
- verpflichtende MFA/TOTP für Redakteure und Admins,
- keine erneute MFA-Eingabe bei jeder normalen Veröffentlichung,
- Step-up-Authentifizierung für besonders kritische Adminaktionen,
- Fachservices als primäre Rechteinstanz und RLS als zusätzliche technische Sperrschicht,
- serverseitige Rollenprüfung bei S2/S3 sowie Optimistic Concurrency und Auditpflicht.

Konkrete SQL-/RLS-Policies werden erst in U1 implementiert. Sitzungs-/Tokenlebensdauer, MFA-Recovery und Notfallverfahren gehören zu G7.

## 10. Hybrid-KI – Entwicklungsprinzip

Für das Echtsystem gilt verbindlich:

> **KI wird nur dort eingesetzt, wo sie fachlich erforderlich ist oder einen klaren zusätzlichen Nutzen bringt. Wird KI eingesetzt, hat die erforderliche Ergebnisqualität Vorrang vor dem niedrigsten Preis.**

Die Zielarchitektur unterscheidet verpflichtende Entdeckungs-/Eingangs-KI, bedarfsgesteuerte Recherche-KI, optionale Redaktions-KI und den modellunabhängigen FIB-Kern.

Der in G5 festgelegte KI-Router ordnet FIB-Aufgaben nicht fest an Modellnamen, sondern an Aufgabenklasse, Qualitätsklasse, Schutzklasse, zulässigen Provider-/Modell-/Regionsweg, Fallback und Kostenrahmen.

## 11. Visuelle Identität – geklärt

Verbindliche Primärquelle: `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

Festgelegt sind insbesondere visuelle Grundhaltung, Logos/Bildmarke, Claim **„Mehr Überblick. Besser verstehen.“**, responsive Bannerlogik, Navigation, PWA-/Icon-Anwendung und Produktionsassets.

## 12. Migrationsgrundsatz – Entwickler → GRÜNEN-Infrastruktur

Verbindliche Primärquelle: `docs/Migrationsstrategie.md`.

Festgelegt ist:

- produktionsreife Entwicklung zunächst auf Entwickler-Infrastruktur,
- späterer Zielbetrieb auf GRÜNEN-Webserver plus eigenem Supabase-Projekt,
- kein Supabase-Self-Hosting,
- keine persönliche Bindung von Architektur oder Geschäftslogik,
- reproduzierbare Datenbank-/Backend-/Deployment-Konfiguration,
- wiederholbare Migration mit Runbook.

## 13. Neue Echtsystem-Dokumentation

Zu den neu aufgebauten Primär- und Detailquellen gehören inzwischen insbesondere:

- `docs/Datenmodell.md`
- `docs/G3-Gesamtaudit.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md`
- `docs/KI-Provider-und-DSFA-Pruefrahmen.md`
- `docs/Zielarchitektur.md`
- `docs/G5-Gesamtaudit.md`
- `docs/Rollen-Rechte-und-Workflow.md`
- `docs/G6-Gesamtaudit.md`
- `docs/decisions/ADR-001-Web-und-Service-Stack.md`
- `docs/decisions/ADR-002-Datei-und-Bildspeicher.md`
- `docs/decisions/ADR-003-Publikations-und-Deploymentprozess.md`
- `docs/decisions/ADR-004-Suche-und-RAG.md`
- `docs/decisions/ADR-005-AI-Tasks-Scheduler-und-Queue.md`
- `docs/decisions/ADR-006-Authentifizierung-und-Rechtearchitektur.md`
- `docs/decisions/ADR-007-KI-Router-und-Providerintegration.md`
- `docs/decisions/ADR-008-CI-CD-und-Deployment.md`
- `docs/decisions/ADR-009-Repository-und-Anwendungsstruktur.md`

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 3.4 | 06.10.2026 | G6 mit `Rollen-Rechte-und-Workflow.md` v1.0 und bestandenem G6-Gesamtaudit abgeschlossen; MFA für Redakteure/Admins, Step-up für kritische Adminaktionen und Fachservice-/RLS-Grenzen festgelegt; G7 Betrieb als nächsten Schritt gesetzt. |
| 3.3 | 06.10.2026 | G6 gestartet; `Rollen-Rechte-und-Workflow.md` v0.1 mit Rollen-/Aktionsmatrix, Fachfunktionsrechten, Bestätigungslogik und MFA-Entscheidungspunkt angelegt; G6 auf in Arbeit gesetzt. |
| 3.2 | 06.10.2026 | G5 nach Zielarchitektur v1.0 und bestandenem G5-Gesamtaudit abgeschlossen; ADR-001 bis ADR-009 verankert; G6 Rollen/Rechte/Workflow als nächsten konkreten Gründungsschritt gesetzt. |
| 3.1 | 06.10.2026 | Roadmap in Gründungs- und Umsetzungsphasen gegliedert; Redaktions-App und öffentliche FIB-Seite/PWA als eigene Produktstränge U2/U3 sichtbar gemacht; technische Umsetzung in U1–U6 konkretisiert; G4 auf abgeschlossen und G5 auf in Arbeit synchronisiert. |
| 3.0 | 06.10.2026 | G4 gestartet; Schutzbedarf/Datenschutz/Offline als aktive Phase und neue Primärquelle verankert; G5–G7/G10 um Folgeanforderungen aus G4 ergänzt. |
| 2.9 | 05.10.2026 | G3 nach bestandenem G3-Gesamtaudit abgeschlossen; Datenmodell v3.0 und neue Teilmodelle/Fachfunktionsarchitektur verankert; G4 Schutzbedarf/Datenschutz/Offline als nächsten konkreten Gründungsschritt gesetzt. |
