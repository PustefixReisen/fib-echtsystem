# U4 – Offene Suche: erster Vergleichslauf ohne API

**Stand:** 29.10.2026 · **Publikationsfenster:** 01.–28.10.2026 · **Ziel:** drei Strategien anhand realer Funde ausprobieren. **Evidenzgrad: explorativer sequenzieller Methodenvergleich**, kein unabhängiger KI-Modell-Benchmark.

## Rahmen und tatsächliche Durchführung
Alle Suchanfragen zielten auf Feldkirchen bei München, Landkreis München Ost und Oktober 2026. Keine ereignisspezifischen bekannten Kontrollfälle als Suchbegriff. Es wurde derselbe Websuchdienst und dasselbe aktuelle KI-System verwendet; ein externer Modellaufruf fand nicht statt.

- **A Klassisch:** drei allgemeine vorformulierte Abfragen `Feldkirchen bei München Oktober 2026 Nachrichten Gemeinde Entwicklungen`, `Landkreis München Ost Oktober 2026 Projekte Verkehr Gemeinde Feldkirchen`, `Feldkirchen München 2026 Oktober Nachrichten Politik Kultur Vereine`. Ein Batch mit drei Suchabfragen.
- **B KI-gesteuert / erweiterter Horizont:** vier im Voraus vorgeschlagene Querschnittsanfragen `"Feldkirchen" "Oktober 2026" -site:feldkirchen.de -site:merkur.de -site:sueddeutsche.de`, `"Kirchheim" "Aschheim" "Feldkirchen" Oktober 2026`, `"München Ost" "Oktober 2026" Verkehr Infrastruktur Kommunen`, `site:wochenanzeiger.de Feldkirchen Oktober 2026`. Ein Batch mit vier Abfragen.
- **C Mehrstufige Nachsuche:** aus B und thematischen Randtreffern vier abgeleitete neue Suchen `site:afk-geothermie.de/aktuelles Oktober 2026 Feldkirchen geothermie seismik`, `site:wochenanzeiger.de/orte/Feldkirchen 2026 Oktober`, `site:landkreis-muenchen.de oktober 2026 Feldkirchen Infrastruktur`, `site:deutschebahn.com Oktober 2026 S2 Erding Markt Schwaben Feldkirchen`. Ein Batch mit vier Abfragen.

**Methodische Grenzen:** B wurde nach Sichtung von A, C nach Sichtung von A+B konzipiert. Deshalb Lern-/Informationsübertrag, ungleiche Anfragezahl und kein echter geblindeter A/B/C-Vergleich. Ergebnisse sind Suchbeispiele und Hinweis auf Erweiterungspotenziale, keine verlässlichen Trefferquoten/Leistungsrangfolge.

## Neu- und Zusatzfunde, mit Originalbeleg

| Beleg | Quelle und Veröffentlichungsdatum | Bedeutung | Relevanz |
|---|---|---|---|
| https://www.wochenanzeiger.de/orte/Feldkirchen-%28Landkreis-M%C3%BCnchen%29 | Wochenanzeiger: Bürgerversammlung 08.10.; Ramadama 10.10. | Lokale Meldungen außerhalb Merkur/SZ/Gemeinde | Ja, unmittelbarer Ortsbezug, genaue Originaleinzelartikel gesondert sichern |
| https://aschheim-feldkirchen-kirchheim.bund-naturschutz.de/termine/termin/monatstreffen-oktober-2026-1 | BN-Ortsgruppe, Veranstaltung 19.10. | Potenzielle Quelle aus regionaler Verbandsstruktur | Kandidat; Termine nach redaktionellen Regeln bewerten |
| https://bayern.vdk.de/vor-ort/veranstaltungen-kv-ov/einladung-kleines-oktoberfest-am-15102026/ | VdK AFK, Veranstaltung 15.10. | Überörtliche Organisation mit örtlichem Bezug | Kandidat; Publikationszeitpunkt nicht mit Veranstaltungsdatum verwechseln |
| https://afk-geothermie.de/giga-m-fuehrt-seismische-messungen-im-versorgungsgebiet-durch/ | AFK, 09.10. | Geophysikalische Messungen 15.10.–14.11. einschließlich Feldkirchen | Ja, direkter funktional-räumlicher Bezug |
| https://afk-geothermie.de/author/heyland/ | AFK, 13.10. Baustellenupdate | Neue Entwicklung beim gemeinsamen Geothermievorhaben | Ja, lokaler Funktionsbezug; kanonischen Artikel abrufen |
| https://www.landkreis-muenchen.de/artikel/bundesstrasse-304-fahrbahnsanierung-und-laermsanierung-in-der-ortsdurchfahrt-haar-zwischen-der-landkreisgrenze-und-der-b-471-unter-abschnittsweiser-vollsperrung/ | Landkreis München, Sanierung B304, Bauphase Oktober | Ausgewiesene Umleitung über B471 nach Feldkirchen | Ja, indirekte Verkehrsbetroffenheit; **Veröffentlichung laut Suchindex im September** – deshalb NICHT in Oktober-Publikationsnenner zählen, als Bestands-/Änderungsbezug führen |
| https://www.deutschebahn.com/de/presse/presse-regional/pr-muenchen-de/aktuell/presseinformationen/Herbstbaustellen-im-Grossraum-Muenchen-Aenderungen-im-Regional-und-S-Bahnverkehr--14049638 | DB, 30.09.2026 | Oktober-Baumaßnahmen, S2 und Stammstrecke | Betroffenheit Feldkirchens kontextabhängig; **September-Veröffentlichung**, nicht Oktober-Publikationsnenner |

## Konkret erkennbarer Qualitätsunterschied
Die stärker auf bekannte Ortsnamen fokussierte Variante A erzeugt vor allem direkte Quellen- und Ortsseitenfunde, aber auch **falsche Homonyme**: `feldkirchen-gemeinde.de` verweist auf Feldkirchen in Niederbayern, nicht auf 85622 Feldkirchen bei München. Dies ist ein überprüfbarer Fall für negative Relevanzentscheidungen. B erweitert die Quellenlandschaft um Vereine/Verbände und Wochenanzeiger. C findet sehr spezifische Inhalte in einer fachlichen Quelle (AFK) und amtliche räumliche Sekundärfolgen (B304-Umleitung). Für die Gegenprobe muss A bei gleichem Abfragebudget ebenfalls Gelegenheit zur Entdeckung dieser Funde bekommen.

## Bewertung gegen bekannten Referenzbestand
**Nicht numerisch durchgeführt.** Der vorhandene Referenzbestand enthält gemischte Artikel, Sitzungs-Container und Fundstellen; damit fehlt vor einer Prozentrechnung die Bereinigung zu URL-genauen, datumsvalidierten, ausschließlich offenen Recherchezielen. Außerdem würden Funde aus Pflichtquellen nicht ohne weiteres in die Kennzahl „zusätzlicher Nutzen offene Recherche“ eingehen. Keine Scheintrefferquote.

## Suchaufwand (nur beobachtbar)
- A: 3 Suchanfragen, B: 4, C: 4 (C baut auf A+B auf, effektiv **11 Suchanfragen kumulativ**).
- Gebühren: Websuchzugang in diesem Chat liefert keine API-Preise/Token-Kosten; kein verlässlicher Euro-Wert pro Lauf.
- Textauswertung KI wurde innerhalb dieser Unterhaltung durchgeführt; keine gesondert abrechenbaren API-Token erfasst.

## Vorläufige fachliche Folgerungen
1. Es gibt nützliche Entdeckungen über benannte Quellen hinaus: lokale Verbände, Wochenanzeiger, Fachunternehmen, Landkreis, Verkehrsbetriebe.
2. Geografischer Bezug (Feldkirchen bei München), Quellenidentität und **Veröffentlichungsdatum** müssen ausdrücklich geprüft werden.
3. Themenorientierte Erweiterung ist praktisch nützlich, aber eine generelle Überlegenheit von B oder C ist **nicht nachgewiesen**.
4. Die Strategien bleiben modellunabhängig beschreibbar; die konkrete Suchleistung und Kosten müssen in späteren reproduzierbaren Läufen gemessen werden.
5. Die dokumentierte Pilotdurchführung ersetzt nicht den verblindeten Vergleich mit fixem Budget und geprüften Fundstellen. **Kein siebentägiger Paralleltest erforderlich.**

## Empfehlung
Die Suchstrategien A/B/C als untersuchte Kandidaten beibehalten. Als nächste Messung einen *einmaligen* reproduzierbaren Vergleich mit 20–30 URL-eindeutigen Referenzfundstellen und einem strikt identischen Abfragebudget durchführen; Kosten nur mit instrumentiertem Modell-/Such-API-Zugang. Bis dahin weder fertige Prozentzahlen noch API-Anbieterentscheidungen behaupten.
