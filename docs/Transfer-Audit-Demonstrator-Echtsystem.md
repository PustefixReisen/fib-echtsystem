# G2.5 – Transfer-Audit Demonstrator → Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.3 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieser Audit stellt sicher, dass Erkenntnisse aus Demonstrator, Testbetrieb und späteren Korrekturen nicht beim Neuaufbau des Echtsystems verloren gehen.

Prüfquellen:

1. kanonische Demonstrator-Dokumentation,
2. Demonstrator-Datenbestand und sichtbares Verhalten,
3. Betriebs-, Update- und Fehlererkenntnisse,
4. Spezial- und Übergabedokumente,
5. relevante frühere FIB-Chats als **Lückenfinder**, nicht als kanonische Quelle.

Seit 04.10.2026 wird der Audit um eine zweite Prüfschicht ergänzt: sichtbare Inhaltsbausteine und redaktionelle Funktionen werden systematisch gegen das Echtsystem gespiegelt. Diese Ergänzung steht in `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`.

## 2. Transfer-Gate

G2.5 gilt als abgeschlossen, wenn:

1. relevante Erkenntnisse inventarisiert sind,
2. jede einen Transferstatus besitzt,
3. fachlich kritische Lücken geschlossen oder bewusst verworfen sind,
4. gültige Regeln in den zuständigen kanonischen Echtsystem-Dokumenten stehen,
5. Datenmodell und Redaktionsworkflow die benötigten Zustände/Entscheidungen abbilden können oder als klarer G3/G6-Auftrag geführt werden,
6. wesentliche Demonstratorfälle als Regressionstests beschrieben sind,
7. konkurrierende/veraltete Dokumentstände nicht als gleichwertige Primärquelle erscheinen,
8. eine abschließende Widerspruchs- und Terminologieprüfung erfolgt ist,
9. die im Demonstrator sichtbaren Inhaltsbausteine und redaktionellen Funktionen vollständig inventarisiert und gegen Fachlogik, Datenmodell, Workflow und UX geprüft sind.

**Status:** Am 03.10.2026 war das Transfer-Gate nach der ersten Prüfschicht als fachlich bestanden bewertet worden. Am 04.10.2026 wurde es nach einer Gegenprüfung sichtbarer Inhaltsbausteine und Redaktionsfunktionen **wieder geöffnet**. Die frühere Abschlussbewertung war insoweit zu weit gefasst.

## 3. Statuslegende

- **GESCHLOSSEN** – fachliche Regel ist im Echtsystem kanonisch verankert.
- **GESCHLOSSEN / spätere technische Umsetzung** – fachlich vollständig übertragen; technische Realisierung gehört planmäßig in eine spätere Phase.
- **NICHT ÜBERNEHMEN** – bewusst verworfenes Demonstrator-Provisorium.
- **ERNEUT OFFEN** – erste Prüfschicht war abgeschlossen, zweite Prüfschicht hat eine zusätzliche Transferlücke oder unvollständige Übernahme gezeigt.

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
| TA-017 | Wirkungsrollen-Taxonomie entfällt; Bedeutung für das Thema + Perspektiven/Wirkungen | `Datenmodell.md`, `Themen-und-Vorgangslogik.md`, `Begriffe.md`, `KI-Leitfaden.md`, UX | **GESCHLOSSEN** | UX v2.8 synchronisiert |
| TA-018 | Bedeutung für das Thema: prägend/relevant/ergänzend, redaktionell verpflichtend | `Datenmodell.md`, `Themen-und-Vorgangslogik.md`, `Begriffe.md` | **GESCHLOSSEN** | für Vorgang und direktes Ereignis |
| TA-019 | „Mehr wissen?“ adaptiv, nicht redundant, keine starre Fragezahl | `Mehr-wissen.md` | **GESCHLOSSEN** | MVP zeigt zunächst ca. 4–6 |
| TA-020 | „Mehr wissen?“: keine scheinbar gesicherte Antwort nur aus Modellwissen | `Mehr-wissen.md`, `KI-Leitfaden.md` | **GESCHLOSSEN** | RT-011 |
| TA-021 | Quellenrollen / präzise Fundstellen | `Mehr-wissen.md` | **GESCHLOSSEN** | Sammeldokumente mit konkreter Fundstelle soweit möglich |
| TA-022 | Bezugsobjekte mit Aliasen und explizit geprüften Beziehungen | UX / Datenmodell-G3 | **GESCHLOSSEN / spätere technische Umsetzung** | RT-010 |
| TA-023 | Suche trennt Kategorie, Schlagwort, Ort und Volltext | UX / spätere technische Umsetzung | **GESCHLOSSEN / spätere technische Umsetzung** | RT-016 |
| TA-024 | stabile Direktlinks / zielgenaue Updates / Browser-Zurück | UX | **GESCHLOSSEN / spätere technische Umsetzung** | RT-009 |
| TA-025 | Info-/Disclaimer-Zugang je Inhalt, Footer nicht alleiniger Zugang | UX | **GESCHLOSSEN / spätere technische Umsetzung** | übernommen |
| TA-026 | PWA, lokaler Neuigkeitsstatus, Push Opt-in, Badge ergänzend | UX | **GESCHLOSSEN / spätere technische Umsetzung** | RT-013 |
| TA-027 | Cache-/Deployment-Verlässlichkeit | `Regressionstests-Demonstratortransfer.md`; G5-Auftrag | **GESCHLOSSEN als Anforderung / spätere technische Umsetzung** | RT-014; konkrete Strategie in G5 |
| TA-028 | SEO: stabile URLs, Open Graph, Canonical, Sitemap etc. | `SEO-und-Auffindbarkeit.md` | **GESCHLOSSEN / spätere technische Umsetzung** | Übernahme dokumentiert |
| TA-029 | analoger + digitaler Raum für Reichweite/Bindung | `Marketing-und-Kommunikation.md` | **GESCHLOSSEN** | Multiplikatoren/persönliche Kontakte bleiben Bestandteil |
| TA-030 | Modellunabhängigkeit / fester Testkorpus | `KI-Qualitaet-und-Modellunabhaengigkeit.md`, Regressionstests | **GESCHLOSSEN** | Transferfälle werden Testkorpus |
| TA-031 | produktive Banner-/Navigations-/Mobile-Regeln | UX + visuelle Identität | **GESCHLOSSEN** | aktuelle Echtsystem-Regeln maßgeblich |
| TA-032 | sichtbare Inhaltsbausteine und redaktionelle Funktionen vollständig gespiegelt | `Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md` + jeweilige Primärdokumente | **ERNEUT OFFEN** | u. a. offene Fragen bei Meldungen, verlinkter bisheriger Verlauf und Bildworkflow/-logik nachzuarbeiten |

## 5. Folgeaufträge aus dem Transfer-Audit

Diese Punkte sind fachlich übertragen, werden aber planmäßig später konkretisiert:

### FA-01 – Datenmodellseitige Persistenz-/Löschlogik (G3)

Der fachliche Persistenzschutz ist verbindlich. G3 konkretisiert, welche Status-/Historienfelder Rücknahme, Archivierung, Löschung oder Aufhebung einer Beziehung abbilden.

### FA-02 – Cache-/Deployment-Strategie (G5)

Die Anforderung aus dem Demonstratorfehler ist als RT-014 gesichert. G5 legt Versionierungs-, Cache-Control-, Asset-Hash-/Invalidierungs- und Abnahmeverfahren fest.

### FA-03 – technische Regressionstests (G3–G10)

Die fachlichen Referenzfälle werden schrittweise in automatisierbare Datenmodell-, Workflow-, Integrations-, UI- und Go-live-Tests übersetzt.

### FA-04 – Inhaltsbausteine und Redaktionsfunktionen

Die zweite Prüfschicht wird in `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md` geführt. Festgestellte Lücken werden in den jeweils zuständigen Primärdokumenten geschlossen und anschließend als Regressionstest abgesichert.

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

Die zweite Prüfschicht ergänzt weitere Referenzfälle, insbesondere zu Meldungsverlauf, offenen Fragen, Nachbarereignissen und Bildredaktion.

## 7. Aktuelle Bewertung

Die erste Prüfschicht hatte wesentliche fachliche Transferregeln erfolgreich geschlossen. Die erneute Sichtung am 04.10.2026 hat jedoch gezeigt, dass der damalige Abschluss nicht ausreichend auf **sichtbare Inhaltsbausteine und redaktionelle Funktionen** geprüft hatte.

Insbesondere wurden folgende Punkte erneut geöffnet:

- eigener Meldungsbaustein „Was bisher passiert ist“,
- „Offene Fragen“ auf Meldungsebene und ihre persistente Modellierung,
- explizite Sichtbarkeit relevanter Ereignisse aus Nachbargemeinden in Themen,
- Bildaufnahme, Bildauswahl, Rechte-/Nachweisprüfung und Bildfreigabe im Redaktionsworkflow,
- konkrete Verwendungslogik von Inhaltsbildern,
- optionales Motivwissen/„Mehr zum Bild“ als noch zu treffende Übernahmeentscheidung.

**G2.5 ist deshalb seit 04.10.2026 wieder offen.**

Ein erneuter Abschluss erfolgt erst, wenn die zweite Transfer-Prüfschicht vollständig abgearbeitet, in den Primärdokumenten verankert und in Regressionstests abgesichert ist.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.3 | 04.10.2026 | Transfer-Gate aufgrund einer zweiten Prüfschicht für sichtbare Inhaltsbausteine und Redaktionsfunktionen wieder geöffnet; TA-032 und FA-04 ergänzt; frühere Abschlussbewertung präzisiert. |
| 0.2 | 03.10.2026 | UX-Restbegriffe bereinigt, abschließende Konsistenzprüfung durchgeführt, Transfer-Gate als bestanden bewertet und G2.5 fachlich abgeschlossen; verbleibende technische Punkte als G3/G5/G10-Folgeaufträge klassifiziert. |
| 0.1 | 03.10.2026 | Transfer-Matrix im Echtsystem angelegt; bereits geschlossene Regeln und verbleibende Restpunkte nach erster G2.5-Nachpflege dokumentiert. |
