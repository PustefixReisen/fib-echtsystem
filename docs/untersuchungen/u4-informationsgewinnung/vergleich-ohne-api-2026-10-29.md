# U4 – Vergleich ohne API, 29.10.2026

## Kurzbericht
Drei Websuchbatches mit jeweils 10 Suchanfragen und Fokus auf Veröffentlichungen vom 1.–28.10.2026, Gebiet Feldkirchen bei München plus begründete funktionale Beziehungen. A: starre allgemeine Ort-/Themensuchen. B: im Voraus erweiterte Quellen-/Themensuchen. C: anschließend nach ausgewerteten Treffern vertiefte Suchen. **Kein verblindeter oder unabhängiger Vergleich**: alle Läufe teilen Chat-Kontext, B/C können von vorangegangenen Sichtungen profitieren; die Trefferlisten wurden nicht vollständig als Rohresultate gespeichert. Kein Anspruch auf genaue Recall-/Precision-Zahlen oder Überlegenheit im statistischen Sinn.

## Überprüfbare Fallbelege
| Quelle | URL | Datum | Bezug | Ergebnis |
|---|---|---|---|---|
| AFK-Geothermie | https://afk-geothermie.de/giga-m-fuehrt-seismische-messungen-im-versorgungsgebiet-durch/ | 09.10.2026 | Messungen in Feldkirchen, Kirchheim und Aschheim | B und C finden bzw. bestätigen diese Fachquelle |
| Gemeinde Kirchheim | https://www.kirchheim-heimstetten.de/verkehrsbeeintraechtigung/ | 12.10.2026 | Richtung Feldkirchen und MVV-Buslinie 263 betroffen | B und C finden bzw. bestätigen den funktionalen Bezug |
| Gemeinde Grasbrunn | https://app.grasbrunn.de/de/Neuigkeiten/Neuigkeit?id=3376&item=article&view=publish | 07.10.2026 | B304-Umleitung ausdrücklich via Feldkirchen | B und C finden bzw. bestätigen den Verkehrsbezug |
| Wochenanzeiger | https://www.wochenanzeiger.de/buergerversammlung-der-gemeinde-feldkirchen/cnt-id-ps-59392d67-71ef-4b55-9dfe-1e641c71ccba | 08.10.2026 | lokale Bürgerversammlung | C bestätigt zusätzliche Quelle |
| SZ | https://www.sueddeutsche.de/muenchen/landkreismuenchen/haar-autobahnparallele-a99-b471-entlastungsstrasse-li.3559573 | 07.10.2026 | Straßenplanung mit regionalem Bezug | B liefert direkten Suchtreffer |
| Gemeinde Feldkirchen | https://feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/vereinsvorstaendetreffen-im-herbst | 07.10.2026 | direkter Ortsbezug, unpolitisch | A und B liefern Ortsmeldungen aus Pflichtquelle |

## Schlussfolgerung
1. Thematisch/räumlich erweiterte Suche ist praktisch nützlich; bekannte Pflichtquellen allein reichen nicht für die offene Entdeckung.
2. Mehrstufiges Nachsuchen hat in diesem Durchgang **keinen belegten exklusiven Treffer** gegenüber B erzeugt.
3. Aus dem Test lässt sich eine **vorläufige Designentscheidung** ableiten: klassische Suche als Baseline, einmalige KI-geplante Horizonterweiterung zuerst; mehrstufige Suche nur bei konkret erkennbaren Lücken oder offenen Fragestellungen vertiefen.
4. Nicht gemessen: belastbare Wiederfindungsquote gegen blind gehaltenen Referenzbestand, Präzision aller Treffer, modellbezogene Nutzungskosten, reproduzierbare unabhängige Wiederholungen.
5. Kein zusätzlicher API-Zugang benötigt oder verwendet. Frühere API-Testimplementierung PR #278 bleibt optional und ist **keine Voraussetzung** der konzeptionellen Empfehlung.

**Empfehlung:** Dieses Ergebnis als pragmatische Vorentscheidung für die spätere U4-Umsetzung verwenden, aber nicht als abschließenden empirischen Rangvergleich deklarieren. Keine Änderung an Fachhandbuch 03.
