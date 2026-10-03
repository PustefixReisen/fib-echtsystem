# G2.5 – Transfer-Audit Demonstrator → Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieser Audit stellt sicher, dass Erkenntnisse aus Demonstrator, Testbetrieb und späteren Korrekturen nicht beim Neuaufbau des Echtsystems verloren gehen.

Prüfquellen:

1. kanonische Demonstrator-Dokumentation,
2. Demonstrator-Datenbestand und sichtbares Verhalten,
3. Betriebs-, Update- und Fehlererkenntnisse,
4. Spezial- und Übergabedokumente,
5. relevante frühere FIB-Chats als **Lückenfinder**, nicht als kanonische Quelle.

## 2. Transfer-Gate

G2.5 gilt als abgeschlossen, wenn:

1. relevante Erkenntnisse inventarisiert sind,
2. jede einen Transferstatus besitzt,
3. fachlich kritische Lücken geschlossen oder bewusst verworfen sind,
4. gültige Regeln in den zuständigen kanonischen Echtsystem-Dokumenten stehen,
5. Datenmodell und Redaktionsworkflow die benötigten Zustände/Entscheidungen abbilden können oder als klarer G3/G6-Auftrag geführt werden,
6. wesentliche Demonstratorfälle als Regressionstests beschrieben sind,
7. konkurrierende/veraltete Dokumentstände nicht als gleichwertige Primärquelle erscheinen,
8. eine abschließende Widerspruchs- und Terminologieprüfung erfolgt ist.

## 3. Statuslegende

- **GESCHLOSSEN** – fachliche Regel ist im Echtsystem kanonisch verankert.
- **GESCHLOSSEN / spätere technische Umsetzung** – fachlich vollständig übertragen; technische Realisierung gehört planmäßig in eine spätere Phase.
- **OFFEN** – Transfer ist fachlich noch nicht vollständig geklärt oder dokumentiert.
- **NICHT ÜBERNEHMEN** – bewusst verworfenes Demonstrator-Provisorium.

## 4. Transfer-Matrix

| ID | Erkenntnis / Testfall | Kanonischer Zielort | Status | Bemerkung |
|---|---|---|---|---|
| TA-001 | GitHub ist Dokumentationshoheit; ODT/Exportkopien keine gleichwertige Wahrheit | `Dokumentation.md` | **GESCHLOSSEN** | Versionsdrift explizit geregelt |
| TA-002 | Erweiterter Suchraum inkl. München/Bayern/Bund bei konkretem Feldkirchen-Bezug | `Recherche-und-Quellenmonitor.md` | **GESCHLOSSEN** | gestaffelter Suchraum verankert |
| TA-003 | mögliche zukünftige Bedeutung | `Fachkonzept.md`, `Recherche-und-Quellenmonitor.md`, `KI-Leitfaden.md` | **GESCHLOSSEN** | bloße abstrakte Möglichkeit reicht nicht |
| TA-004 | dynamischer Suchkontext aus bestätigten Themen/Vorgängen | `Recherche-und-Quellenmonitor.md`, `KI-Leitfaden.md` | **GESCHLOSSEN** | Redaktionshinweise können Suchraum schärfen |
| TA-005 | sechsmonatiger Rückblick bei neuem/wesentlich geschärftem Suchkontext | `Recherche-und-Quellenmonitor.md` | **GESCHLOSSEN** | Regelbetrieb bleibt inkrementell |
| TA-006 | ca. 30 % Arbeits-/Warnschwelle für ausschließlich mittelbar relevante Beiträge | `Recherche-und-Quellenmonitor.md` | **GESCHLOSSEN** | Qualitätskontrolle, keine Recherchequote |
| TA-007 | themenunabhängige Entdeckung / Kiesgrund | `Recherche-und-Quellenmonitor.md`, `Fachkonzept.md` | **GESCHLOSSEN** | Referenztest RT-005 |
| TA-008 | Direktprüfung bekannter Quellen statt allein Suchmaschine | `Recherche-und-Quellenmonitor.md` | **GESCHLOSSEN** | Quellenbeobachtung technisch ohne KI vorgesehen |
| TA-009 | Beteiligungsaufrufe als mögliche eigenständige Entwicklung | `Recherche-und-Quellenmonitor.md` | **GESCHLOSSEN** | Referenztest RT-002 |
| TA-010 | Bürgerinitiativen: Resonanz-/Gegenpositionssuche | `Recherche-und-Quellenmonitor.md` | **GESCHLOSSEN** | Referenztest RT-008 |
| TA-011 | interne Hintergrundquellen dürfen Recherche auslösen, aber nicht öffentliche Quelle vortäuschen | `Recherche-und-Quellenmonitor.md`, `KI-Leitfaden.md` | **GESCHLOSSEN** | Referenztest RT-015 |
| TA-012 | RIS: Vorlage ≠ Beschluss, Datumsarten trennen, Linkziel prüfen | `KI-Leitfaden.md`, Fach-/UX-Regeln | **GESCHLOSSEN** | Referenztest RT-004 |
| TA-013 | Primärquellen-Terminologie korrekt verwenden | `KI-Leitfaden.md` | **GESCHLOSSEN** | Link/Dokument muss korrekt benannt sein |
| TA-014 | Meldung vs. Aktualisierung nach eigenständigem Ereignis | `Datenmodell.md`, `Fachkonzept.md`, `KI-Leitfaden.md`, UX | **GESCHLOSSEN** | Ereignis und Meldung getrennt |
| TA-015 | fachlich relevante Aktualisierung zählt als „neu“, technische Änderung nicht | `Fachkonzept.md`, UX | **GESCHLOSSEN** | PWA/Push-Grundlage |
| TA-016 | Persistenzschutz: bestehende Objekte dürfen bei neuem Lauf nicht verschwinden | `KI-Leitfaden.md` | **GESCHLOSSEN / spätere technische Umsetzung** | technische Geschäftsregel; RT-012 |
| TA-017 | Wirkungsrollen-Taxonomie entfällt; Bedeutung für das Thema + Perspektiven/Wirkungen | `Datenmodell.md`, `Themen-und-Vorgangslogik.md`, `Begriffe.md`, `KI-Leitfaden.md` | **GESCHLOSSEN** | UX-Restbegriffe noch zu bereinigen, siehe O-01 |
| TA-018 | Bedeutung für das Thema: prägend/relevant/ergänzend, redaktionell verpflichtend | `Datenmodell.md`, `Themen-und-Vorgangslogik.md`, `Begriffe.md` | **GESCHLOSSEN** | für Vorgang und direktes Ereignis |
| TA-019 | „Mehr wissen?“ adaptiv, nicht redundant, keine starre Fragezahl | `Mehr-wissen.md` | **GESCHLOSSEN** | MVP zeigt zunächst ca. 4–6 |
| TA-020 | „Mehr wissen?“: keine scheinbar gesicherte Antwort nur aus Modellwissen | `Mehr-wissen.md`, `KI-Leitfaden.md` | **GESCHLOSSEN** | RT-011 |
| TA-021 | Quellenrollen / präzise Fundstellen | `Mehr-wissen.md` | **GESCHLOSSEN** | Sammeldokumente mit konkreter Fundstelle soweit möglich |
| TA-022 | Bezugsobjekte mit Aliasen und explizit geprüften Beziehungen | UX / Datenmodell-G3 | **GESCHLOSSEN / G3-Umsetzung** | RT-010 |
| TA-023 | Suche trennt Kategorie, Schlagwort, Ort und Volltext | UX / spätere technische Umsetzung | **GESCHLOSSEN / spätere technische Umsetzung** | RT-016 |
| TA-024 | stabile Direktlinks / zielgenaue Updates / Browser-Zurück | UX | **GESCHLOSSEN / spätere technische Umsetzung** | RT-009 |
| TA-025 | Info-/Disclaimer-Zugang je Inhalt, Footer nicht alleiniger Zugang | UX | **GESCHLOSSEN / spätere technische Umsetzung** | übernommen |
| TA-026 | PWA, lokaler Neuigkeitsstatus, Push Opt-in, Badge ergänzend | UX | **GESCHLOSSEN / spätere technische Umsetzung** | RT-013 |
| TA-027 | Cache-/Deployment-Verlässlichkeit | `Regressionstests-Demonstratortransfer.md`; G5-Auftrag | **GESCHLOSSEN als Anforderung / spätere technische Umsetzung** | RT-014; konkrete Strategie in G5 |
| TA-028 | SEO: stabile URLs, Open Graph, Canonical, Sitemap etc. | `SEO-und-Auffindbarkeit.md` | **GESCHLOSSEN / spätere technische Umsetzung** | Übernahme dokumentiert |
| TA-029 | analoger + digitaler Raum für Reichweite/Bindung | `Marketing-und-Kommunikation.md` | **GESCHLOSSEN** | Multiplikatoren/persönliche Kontakte bleiben Bestandteil |
| TA-030 | Modellunabhängigkeit / fester Testkorpus | `KI-Qualitaet-und-Modellunabhaengigkeit.md`, Regressionstests | **GESCHLOSSEN** | Transferfälle werden Testkorpus |
| TA-031 | produktive Banner-/Navigations-/Mobile-Regeln | UX + visuelle Identität | **GESCHLOSSEN** | aktuelle Echtsystem-Regeln maßgeblich |

## 5. Noch offene G2.5-Punkte

### O-01 – UX-Restbegriffe aus alter Wirkungsrollen-Logik

`docs/UX-und-Informationsarchitektur.md` enthält in älteren Abschnitten noch einzelne Begriffe/Modellannahmen aus der G2-Zeit, insbesondere `Wirkungsrolle`, obwohl G3 inzwischen verbindlich `Bedeutung für das Thema` verwendet. Außerdem sind in den Datenmodell-Auswirkungen noch ältere direkte Meldungsbeziehungen genannt.

**Erforderlich:** UX-Datei terminologisch an das aktuelle G3-Modell anpassen, ohne die abgeschlossene G2-Nutzerlogik zu verändern.

### O-02 – Datenmodellseitige Persistenz-/Löschlogik konkretisieren

Der fachliche Persistenzschutz ist im KI-Leitfaden geschlossen. In G3 ist noch zu prüfen, welche Status/Historienfelder eine explizite Rücknahme, Archivierung, Löschung oder Aufhebung einer Beziehung abbilden.

**Bewertung:** Kein fachlicher Transferverlust mehr; verbleibender G3-Modellierungsauftrag.

### O-03 – Cache-/Deployment-Strategie

Die Demonstratorerkenntnis ist als Anforderung und Regressionstest gesichert. Konkrete Versionierungs-/Invalidierungsstrategie gehört in G5.

**Bewertung:** Kein G2.5-Fachentscheid erforderlich; späterer technischer Umsetzungsauftrag.

## 6. Regressionstestkorpus

Verbindliche Referenzfälle stehen in `docs/Regressionstests-Demonstratortransfer.md`.

Aktuell enthalten:

- autonomer On-Demand-Verkehr München,
- ADFC-Beteiligung,
- Parkraumkonzept,
- Hundewiese/RIS,
- Kiesgrund,
- BAB-Kreuz München-Ost,
- Radwegenetz,
- Bürgerinitiative,
- geteilter Direktlink,
- B471/Oberndorfer Straße,
- „Mehr wissen?“,
- Persistenzschutz,
- PWA-Neuigkeitsstatus,
- Cache-/Deployment-Verlässlichkeit,
- interne Hintergrundquelle,
- Suche „Beteiligung“.

## 7. Aktuelle Bewertung

Der G2.5-Audit hat die wesentlichen zuvor erkannten fachlichen Lücken inzwischen in die kanonischen Echtsystem-Dokumente überführt.

**G2.5 ist noch nicht abgeschlossen**, solange O-01 nicht bereinigt und die abschließende Widerspruchsprüfung nicht durchgeführt wurde.

O-02 und O-03 sind nach erfolgter fachlicher Sicherung reguläre Folgeaufträge für G3 bzw. G5 und blockieren den fachlichen Abschluss von G2.5 nicht, sofern sie in Roadmap und Regressionstestkorpus erhalten bleiben.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 03.10.2026 | Transfer-Matrix im Echtsystem angelegt; bereits geschlossene Regeln und verbleibende Restpunkte nach erster G2.5-Nachpflege dokumentiert. |
