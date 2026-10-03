# Dokumentationsübernahme Demonstrator → Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.3 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument dokumentiert die einmalige Übernahme der für das Echtsystem weiterhin erforderlichen Dokumentation aus `PustefixReisen/presseschau-feldkirchen-demo` und aus den bislang gemeinsam verwendeten Bibliotheksgrundlagen.

> **Der Demonstrator bleibt historische Referenz. Die laufende Dokumentationshoheit liegt ausschließlich im Repository `PustefixReisen/fib-echtsystem`.**

**Status der ursprünglichen Übernahme: weitgehend erfolgt, unter G2.5 erneut in Vollständigkeitsprüfung.**

Die frühere formale Abschlussfeststellung vom 30.09.2026 war auf den damals bekannten Dokumentbestand bezogen. Der G2.5-Transfer-Audit hat gezeigt, dass zusätzlich Betriebs-/Fehlererkenntnisse, spätere Demonstratorentscheidungen, Versionsdrift und relevante frühere Chats als Lückenfinder berücksichtigt werden müssen.

## 2. Klassifikationslogik

Jede bisherige Grundlage wurde einer von vier Klassen zugeordnet:

1. **übernehmen und aktualisieren**,
2. **in bestehende Echtsystem-Dokumentation integrieren**,
3. **nur historisch referenzieren**,
4. **entfallen**.

Eine 1:1-Kopie erfolgte nur dort, wo Inhalt und Struktur weiterhin passten. Veraltete Terminologie, Demonstrator-Provisorien und überholte Fachlogik wurden nicht konserviert.

G2.5 ergänzt diese dokumentenbezogene Klassifikation um eine erkenntnisbezogene Prüfung:

`Demonstrator-Erkenntnis → fachliche Echtsystem-Regel → Datenmodell/Prozess → Umsetzungsauftrag → Regressionstest`

## 3. Übernahmematrix

| Bisherige Grundlage | Echtsystem-Ziel | Status | Hinweis |
|---|---|---|---|
| `FIB_Management-Approach.md` | `docs/FIB_Management-Approach.md` | **übernommen / aktualisiert** | Meldung/Vorgang/Thema/Sitzung und Aufnahmelogik aktualisiert |
| `FIB-Inhaltliches-Konzept.md` + fachliche ODT | `docs/Fachkonzept.md` | **übernommen / unter G2.5 nachgepflegt** | aktuelle Wissensstruktur, Navigation und Aufnahmegrundsätze maßgeblich |
| `KI-Leitfaden_Homepage-Presseschau` | `docs/KI-Leitfaden.md` | **übernommen / unter G2.5 nachgepflegt** | Persistenzschutz, Suchraum- und Quellenpflicht ergänzt |
| `FIB_Modellunabhaengigkeit_und_Qualitaetspruefung.md` | `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | **übernommen / aktualisiert** | eigener Qualitäts- und Regressionstestbereich |
| `FIB-Quellenmonitor.md` | `docs/Recherche-und-Quellenmonitor.md` | **übernommen / unter G2.5 erweitert** | Suchraum, Rückblick, 30-%-Warnschwelle und Folgerecherche ergänzt |
| `FIB-Quellenmonitor-Architektur.md` | `docs/Recherche-und-Quellenmonitor.md` | **integriert** | Zielanforderungen übernommen |
| `FIB_Mehr_wissen_Assistent.md` | `docs/Mehr-wissen.md` | **übernommen / unter G2.5 nachgepflegt** | harte Quellenpflicht gegen ungesichertes Modellwissen ergänzt |
| `FIB_Marketing-und-Kommunikation.md` | `docs/Marketing-und-Kommunikation.md` | **übernommen / aktualisiert** | digitaler/analoger Raum, Reichweite und Bindung erhalten |
| `FIB_SEO-und-Auffindbarkeit.md` | `docs/SEO-und-Auffindbarkeit.md` | **übernommen / aktualisiert** | Vorgang zusätzlich als dauerhafter Wissensknoten |
| `FIB_KI-Kosten_und_Betriebsmodell.md` | `docs/KI-Betrieb-und-Kosten.md` | **übernommen / aktualisiert** | dauerhafte Betriebsregeln von zeitabhängigen Preislisten getrennt |
| `FIB_Frontend_und_Darstellung.md` | `docs/UX-und-Informationsarchitektur.md` | **integriert / G2.5-Konsistenzprüfung läuft** | gültige Frontendregeln konsolidiert; Restbegriffe nach G3-Änderungen prüfen |
| `FIB_Uebergabe_Echtsystem.md` | Projektgründung, Roadmap, Transfer-Audit | **historisch referenziert / erneut ausgewertet** | aktueller Echtsystem-Stand ersetzt Übergabeannahmen; Transfererkenntnisse bleiben Prüfquelle |
| Demonstrator-`Dokumentation.md` | `docs/Dokumentation.md` | **nicht übernommen** | eigenes Echtsystem-Dokument vorhanden |
| `Gruene_Werte_und_politische_Ziele.md` | `docs/Gruene-Werte-und-politische-Ziele.md` | **übernommen / aktualisiert** | politischer Bezugsrahmen bleibt eigenständige Quelle |
| `Merkblatt_Wissenschaftlich-Politische_Sprache.md` | `docs/Sprachleitfaden.md` | **übernommen / aktualisiert** | mit bürgernaher Sprache und Barrierefreiheitsabgrenzung konsolidiert |
| Betriebs-/Update-/Fehlererkenntnisse | zuständige Primärdokumente + `docs/Regressionstests-Demonstratortransfer.md` | **G2.5 neu ergänzt** | z. B. Persistenzschutz, Cache-/Deployment-Verlässlichkeit |
| relevante frühere FIB-Chats | zuständige Primärdokumente + Transfer-Audit | **nur Lückenfinder** | keine kanonische Quelle; erst nach Prüfung übernehmen |

## 4. Visuelle Referenzen und Bilder

Die vorhandenen FIB-Bilder wurden nicht als fachliche Dokumente kopiert. Sie bleiben historische Referenz; verbindliche visuelle Entscheidungen stehen inzwischen in `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

Produktionsassets werden ausschließlich im Echtsystem weitergeführt. Zusammengesetzte Demonstrator-Mockups bleiben Referenz und dürfen die aktuelle visuelle Primärquelle nicht überschreiben.

## 5. Frontend-/Darstellungsdokument

`FIB_Frontend_und_Darstellung.md` lebt nicht als zweite Datei weiter. Die weiterhin gültigen Anforderungen sind in `docs/UX-und-Informationsarchitektur.md` integriert, insbesondere:

- Mobile First und responsive Darstellung,
- semantische/barrierearme UI,
- Bilder/Alttexte/Rechte,
- Dialog- und Navigationsprinzipien,
- strukturierte Suche,
- Quellen-, Aktualisierungs- und Vertiefungsdarstellung,
- PWA und Neuigkeitsstatus,
- stabile Direktlinks und Social Preview.

Nicht übernommen werden demonstratorspezifische JavaScript-/GitHub-Pages-Provisorien als technische Zielarchitektur. Aus realen Demonstratorfehlern abgeleitete Anforderungen – z. B. Cache-/Deployment-Verlässlichkeit – bleiben jedoch als fachlich-technische Anforderungen erhalten.

## 6. Befund des G2.5-Transfer-Audits

Die erneute Prüfung hat bereits mehrere Punkte gefunden, die nach dem ursprünglichen Abschluss nachgearbeitet werden mussten:

- erweiterter Suchraum war im Demonstrator dokumentiert, im Echtsystem aber nicht vollständig operationalisiert,
- sechsmonatiger Rückblick und 30-%-Warnschwelle fehlten an der operativen Stelle,
- „Mehr wissen?“ benötigte eine explizite Regel gegen scheinbar gesicherte Antworten nur aus Modellwissen,
- Persistenzschutz gegen unbeabsichtigtes Verschwinden bestehender Objekte war nicht ausdrücklich geregelt,
- ältere Begriffe wie `Wirkungsrolle` wirkten nach der G3-Umstellung auf `Bedeutung für das Thema` noch in einzelnen Dokumenten fort,
- eine Bibliotheks-/ODT-Fassung war trotz späterem Datum fachlich hinter dem GitHub-Stand zurückgeblieben.

Die Referenzfälle werden in `docs/Regressionstests-Demonstratortransfer.md` geführt.

## 7. Abschlusskriterium

Die Dokumentationsübernahme gilt erst dann wieder als vollständig abgeschlossen, wenn das G2.5-Transfer-Gate erfüllt ist:

1. relevante Demonstrator-Erkenntnisse einschließlich Betriebs-/Fehlerwissen sind inventarisiert,
2. jede relevante Erkenntnis ist übernommen, angepasst, bewusst verworfen oder als späterer Umsetzungsauftrag gekennzeichnet,
3. fachlich kritische Regeln stehen in der zuständigen kanonischen Echtsystem-Quelle,
4. Datenmodell und Workflow können die erforderlichen Zustände und Entscheidungen abbilden oder führen sie als klaren G3/G6-Auftrag,
5. wesentliche Demonstratorfälle sind als Regressionstests beschrieben,
6. konkurrierende Dokumentstände erscheinen nicht als gleichwertige Primärquelle,
7. eine abschließende Widerspruchsprüfung wurde durchgeführt.

Bis dahin bleibt der Status **teilweise umgesetzt / G2.5 in Arbeit**.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.3 | 03.10.2026 | Frühere Abschlussfeststellung unter G2.5 revidiert; zusätzliche Prüfquellen und G2.5-Befunde aufgenommen; Abschlusskriterium an Transfer-Gate gebunden. |
| 1.2 | 30.09.2026 | Querverweis-, Terminologie- und Konsistenzprüfung abgeschlossen; README, Projektgründung und KI-Leitfaden bereinigt; Dokumentationsübernahme formal abgeschlossen. |
| 1.1 | 30.09.2026 | Quellenmonitor, Mehr wissen, KI-Qualität, Marketing, SEO, KI-Betrieb, Frontend/UX sowie Werte- und Sprachgrundlagen als übernommen markiert. |
| 1.0 | 30.09.2026 | Übernahmematrix für den bekannten Demonstrator-Dokumentbestand angelegt. |
