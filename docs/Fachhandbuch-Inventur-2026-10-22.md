# Fachhandbuch – erste Quellinventur und Übernahmeplan

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 (Erstinventur) | 22.10.2026 | Projektverantwortung – erstellt mit KI-Unterstützung |

## 1. Vorgehen und Geltung

Das Repository enthält bei Beginn der Reorganisation **84 Markdown-Dateien in `docs/`** (inkl. Audits, technischen ADRs, Tests). Die folgende Tabelle ist eine erste **dokumentbezogene Sichtung**, **noch keine vollständige abschnittsbezogene Regelübernahme**. Fachliche Regeln in gemischten Technikdokumenten werden bei der weiteren Inventur abschnittsweise erfasst. Keine bestehende Primärquelle verliert allein durch diese Zuordnung ihre Gültigkeit.

Kategorien: **F** fachliche Primärinhalte zur Übernahme; **T** technischer/betrieblicher Primärinhalt – erhalten, fachliche Doppelregelung prüfen; **S** sekundäre Erschließung – später ableiten; **H** historischer Entwurf/Audit/Entscheidungsnachweis; **G** Governance/Projektsteuerung – erhalten.

## 2. Fachnahe Quellen und Zielkapitel

| Ausgangsquelle | Typ | Ziel / Behandlung | Status |
|---|---|---|---|
| `Fachkonzept.md` | F | Kap. 01–11; Ausgangsstruktur | offen |
| `Begriffe.md` | F/S | Fachdefinitionen in jeweilige Primärkapitel; spätere Begriffs-Sekundärsicht | offen |
| `Themen-und-Vorgangslogik.md` | F | Kap. 05–06 | offen |
| `Fachentwurf-Themenbearbeitung-2026-10-20.md` | H/F | Beschlossene Punkte in Kap. 06 und 08; nicht mehr offene Entscheidung als offen darstellen | offen |
| `Fachliche-Plausibilitaets-und-Freigaberegeln.md` | F | Kap. 08 und 10 | offen |
| `Fundstellenzuordnung-Begruendung.md` | F | Kap. 03 und 10 | offen |
| `Beobachtungs-und-Recherchemodell.md` | F | Kap. 03 | offen |
| `Recherche-und-Quellenmonitor.md` | F | Kap. 03 | offen |
| `Recherchearchitektur-und-Referenzrahmen.md` | F/T | Kap. 03; technische Architektur in Technikquelle belassen | offen |
| `Sitzungs-und-Beschlussmodell.md` | F | Kap. 07 | offen |
| `Wirkungsmodell.md` | F | Kap. 02, 05–06 | offen |
| `Mehr-wissen.md` / `Mehr-wissen-Modell.md` | F | Kap. 09 und 10 | offen |
| `Redaktionsworkflow.md` | F | Kap. 08 | offen |
| `MVP-Fachfunktionen.md` | F/G | Kap. 01/08 und Roadmap-Abgleich | offen |
| `KI-Leitfaden.md` | F | Kap. 03, 08, 10 | offen |
| `KI-Zugangswege-und-Fachfunktionen.md` | F/T | Kap. 03 und 08; technische Anbindung separat | offen |
| `KI-Qualitaet-und-Modellunabhaengigkeit.md` | F/T | Kap. 10; technische Test-/Providerdetails separat | offen |
| `Sprachleitfaden.md` | F | Kap. 10 | offen |
| `Gruene-Werte-und-politische-Ziele.md` | F | Kap. 01 und 10; politische Einordnung getrennt von Fakten | offen |
| `UX-und-Informationsarchitektur.md` | F/T | Kap. 09; technische UI-Details separat | offen |
| `Navigation-Inhalte-Redaktion-Recherche.md` | F | Kap. 08–09 | offen |
| `Rollen-Rechte-und-Workflow.md` | F/T | Fachliche Befugnisse Kap. 08/11, Auth/MFA technisch | offen |
| `Datenmodell.md` | F/T | Fachobjektdefinitionen Kap. 02; Persistenz und SQL bleiben technisch | offen |
| `Persistenz-und-Lebenszyklusmodell.md` | F/T | Fachlicher Lebenszyklus Kap. 04–08; Persistenz technisch | offen |
| `Redaktionssystem-UI-Konzept.md` | F/T | Fachlicher Bedienablauf Kap. 08, UI-Implementierung separat | offen |
| `Marketing-und-Kommunikation.md`, `SEO-und-Auffindbarkeit.md` | F/G | Kap. 09, operative Kommunikationsplanung separat | offen |
| `Leitprinzipien-FIB.md` | F | Kap. 01 | offen |

## 3. Nicht ins Fachhandbuch umziehen, aber auf fachliche Regeln prüfen

| Gruppen/Beispiele | Typ | Behandlung |
|---|---|---|
| `Zielarchitektur.md`, `Technischer-Datenmodellentwurf-Themen-2026-10-20.md` | T/H | technische Primärdokumentation oder historischer Entwurf; Fachregel-Duplikate auflösen |
| `Schutzbedarf-Datenschutz-und-Offline.md`, `Datenschutz-Verarbeitungen-und-Loeschlogik.md`, `Administratorgesteuerte-Einladung.md` | T/F | technische/security Quelle; fachlich relevante Handlungsrechte auf Kap. 11 verweisen |
| `Betrieb-*.md`, `Migrations*.md`, `KI-Betrieb-und-Kosten.md` | T | Betrieb, Technik und Kosten separat |
| `UI-Karten-Bearbeitungsmodus-und-Tabs.md`, `Visuelle-Identitaet-und-Bildkonzept.md` | T/F | UI-Standard und fachliche Benutzerwirkung trennen |
| `Projektgruendung.md`, `Roadmap.md`, `Dokumentation.md`, `FIB_Management-Approach.md` | G | projektbezogene Governance/Planung |
| `G*-Gesamtaudit.md`, `Gruendungsaudit.md`, `Transfer-Audit-*.md`, `DB-Pruefergebnis-Themen.md` | H | historische Prüf- und Entscheidungsnachweise |
| `docs/decisions/ADR-*.md` (11 Dateien) | T/H | technische Architekturentscheidungen |
| `docs/tests/*.md`, `Regressionstests-Demonstratortransfer.md` | H/T | Prüf- und Referenznachweise |
| sonstige Dateien in `docs/` | noch offen | bei abschnittsbezogener Inventur vollständig klassifizieren |

## 4. Sofort erkannte Inkonsistenz: Status lokaler Themenbezüge

- **Fachliche Entscheidung:** Kandidat / Zugeordnet / Zurückgestellt / Fachlich unpassend; KI-Herkunft ist eine separate Eigenschaft. Siehe [Issue #164](https://github.com/PustefixReisen/fib-echtsystem/issues/164) und [PR #172](https://github.com/PustefixReisen/fib-echtsystem/pull/172).
- `Begriffe.md` bezeichnet die Zustandsmaschine noch als vor Implementierung abzugleichen.
- `Fachentwurf-Themenbearbeitung-2026-10-20.md` bezeichnet sie noch als offen.
- **Behandlung:** Diese Quellen bis zur Übernahme markieren, Zielprimärstelle Kap. 06; keine automatische stillschweigende Entscheidung über widersprüchliche Detailregeln. KI-Herkunft getrennt; Bedeutung prägend/relevant/ergänzend bleibt redaktionell zu bestätigen.
- Historische PRs/Issues begründen Änderungen, ersetzen aber das Fachhandbuch nicht.

## 5. Abnahmekriterien der Konsolidierung

1. Jeder bisher verbindliche fachliche Abschnitt ist einer Zielregel zugeordnet; nicht übernommene Fälle begründet.
2. Zwei Nachschlageperspektiven festgelegt: **Begriffe** und **Status/Rechte**; technische Ableitbarkeit gesondert geprüft.
3. Widersprüche und ungeklärte Abgrenzungen sind als Klärungspunkte sichtbar; keine stillschweigende Normsetzung.
4. Querverweise funktionieren; alte fachliche Quellen erst nach vollständiger Abnahme zu historischen Verweisen machen.
5. Neue PRs mit fachlicher Änderung aktualisieren die neue Primärquelle, sobald die jeweilige Domäne migriert ist.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 22.10.2026 | Erste dokumentbezogene Inventur und Zielzuordnung; offene abschnittsbezogene Migration gekennzeichnet. |
