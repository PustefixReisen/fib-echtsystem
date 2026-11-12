# RIS-Dokumentanalyse: synthetischer A/B-Test – Ergebnisse

**Stand:** 12.11.2026 · **Issue:** #437 · **Methode:** vollständig fiktive, manuell formulierte Vorlagentexte im Speicher, keine echten RIS-PDFs.

## Durchführung

- **A:** Bestehende `analyzeRis`-Regeln auf Agenda-Titel und strukturierte Metadaten ohne Dokumenttexte.
- **B:** Dieselbe, unveränderte `analyzeRis`-Funktion erhält zusätzlich fiktive Vorlagentexte (keine neuen Regeln).
- Reproduzierbar mit `node --import tsx tests/ris-analysis/synthetic-ab.spec.mts`; über die vorhandene RIS-Analysis-CI in den PostgreSQL-16/17-Jobs.
- Goldstandard: 20 *vorab festgelegte* Schlüssel (einfache Strukturmerkmale **und** komplexere Sachverhalte). Treffer nur bei exakter normalisierter Kennung.
- Keine Online-Abfragen, keine PDF-Downloads, keine Datenbankänderungen, keine Mistral-Anfrage, keine neuen Berechtigungen.

## Messwerte der tatsächlich gelaufenen CI-Prüfung

| Fall | Gold | A Treffer | B Treffer | In B weiter fehlend |
| --- | ---: | ---: | ---: | --- |
| Hundewiese, 15.10. TOP 2 | 6 | 3 | 4 | Schallschutzbeurteilung; Standortalternative |
| Rechenzentrum, 15.10. TOP 6 | 6 | 4 | 5 | Inhalt der Investoren-Kostenbeteiligung |
| Elternbeitragszuschuss, 29.10. TOP 2 | 4 | 1 | 3 | Konkrete Auswirkung des Förderwegfalls |
| Kita-Beiträge, 29.10. TOP 3 | 4 | 1 | 3 | Konkrete Beitragssteigerung |
| **Summe** | **20** | **9 (45 %)** | **15 (75 %)** | **5 komplexe Aussagen** |

Die sechs zusätzlichen Treffer stammen aus einfachen, expliziten Erwähnungen von Orten, Organisationen oder rechtlichen Referenzbegriffen, **nicht** aus einem verlässlichen Verständnis von Entscheidungszusammenhängen. Der A/B-Test beweist keine generelle Modellpräzision und eignet sich nicht zur Schätzung einer produktiven Recall-Rate.

### Qualitäts- und Sicherheitsgrenzen

- Auf hypothetischen synthetischen Texten wurden erwartete Schlüssel gezählt, **keine repräsentative Precision-Messung** durchgeführt.
- Alle A/B-Aussagen beziehen sich auf reine regelbasierte Extraktion; **kein Mistral-Vergleich** hat stattgefunden.
- Fiktive Inhaltsaussagen dürfen niemals als amtliche Aussagen übernommen werden.
- Der Test prüft, dass bei `analyzeRis` der vorgelegte Rohtext nicht im Ergebnis gespeichert und für erzeugte Erkenntnisse ein Quellenbezug mitgegeben wird.
- Der Text ist im Test bereits in Abschnitte eingegeben; dieser Test belegt **nicht** die Zuverlässigkeit der PDF-Extraktion oder der TOP-Segmentierung einer realen Niederschrift (separate vorhandene Integrationsprüfungen).
- Der A/B-Test setzt keine rechtliche Zulässigkeit für echte Dokumente voraus und dokumentiert keine Nutzungserlaubnis.

## Empfehlung und Entscheidungsvorbehalt

1. **B bringt zusätzlichen Wert** durch Orte/Organisationen/Gesetzesreferenzen. Für tatsächliche inhaltliche Interpretation (Beschlussgegenstand, Kostenbeteiligung, Folgewirkungen) reicht B allein **noch nicht**.
2. **Keine neuen festen Regeln ausschließlich auf Basis dieser vier erfundenen Texte** einbauen. Sonst besteht Overfitting-Gefahr.
3. Vor einem Echtdaten-Vergleich: Rechte-/Datenschutzprüfung nach Dokumentklasse und belastbare Freigabe; insbesondere Anlagen Dritter gesondert bewerten.
4. Nach Freigabe: isolierter, vorab begrenzter Real-Pilot mit Goldstandard und Qualitätsmessung einschließlich falscher/unbelegter Aussagen.
5. Erst **danach** kann ein optionaler Mistral-Test unter maximal 5 € sinnvoll bewertet werden. Mistral bleibt deaktiviert, keine kostenpflichtigen API-Aufrufe ohne Freigabe.

**Auswirkung auf RIS-Entwicklungsbetrieb:** keine. Live-Dokumentanalyse bleibt deaktiviert.
