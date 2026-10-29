# U4 – Gesamtuntersuchung Such- und Quellenstrategie: Ergebnis und Entscheidungsvorlage

**Stand:** 29.10.2026  
**Status:** Abschluss der mit vorhandenen Werkzeugen ausführbaren Machbarkeits- und qualitativen Vergleichsuntersuchung; **keine empirisch belegte vollständige Trefferquoten- oder Betriebskostenmessung**. Fachkonzept 03 unverändert.  
**Prüffenster für historische Quellen:** 01.–28.10.2026.

## Zusammenfassung für die Redaktion

| Frage | Ergebnis | Verbindlichkeitsgrad |
|---|---|---|
| Welche Quellen lassen sich direkt beobachten? | Gemeinde-Nachrichten und RIS sowie Merkur-Feldkirchen- und SZ-Landkreisübersicht sind über öffentliche HTML-Seiten zugänglich. | Nachgewiesen |
| Ist RSS bereits als Ersatz geeignet? | Merkur-RSS wird als XML vom Webleser wegen nicht unterstütztem Content-Type abgewiesen; SZ-Feed dort nicht abrufbar. Separater Netzwerkabruf der Laufzeitumgebung scheitert an DNS. **Kein Beleg für einen Defekt bei den Anbietern.** | Ungeklärt |
| Findet offene Suche zusätzliche relevante Zusammenhänge? | Ja: SZ-Bericht vom 07.10. zur A99/B471 ohne Feldkirchen im Titel ist ein konkreter Kandidat mit mittelbarem Ortsbezug. | Nachgewiesen für diesen Fall, keine Häufigkeitsquote |
| Findet KI mehr als Suche? | **Nicht nachgewiesen.** Kein kontrollierter unabhängiger KI-vs.-ohne-KI Vergleich wurde durchgeführt. | Offen |
| Können wir Recall, Precision und Euro je Zusatztreffer beziffern? | Nein: historischer Gesamtbestand, getrennte standardisierte Suchläufe, RSS-Snapshots und instrumentierte API-Kosten fehlen. | Offen |
| Empfohlene U4-Strategie | Quellenbezogenes Basissystem: RIS + Gemeinde + lokale HTML-/RSS-Zugänge (nach technischem Nachweis), ergänzende offene Suche, KI vor allem zur semantischen Prüfung räumlicher/inhaltlicher Beziehungen. | **Vorläufige Designempfehlung, nicht empirisch als überlegen belegt** |

## A – Technische Zugangsprüfung

| Quelle | Positiver Nachweis | Grenze |
|---|---|---|
| Gemeinde | https://feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen – Rubriken, Meldungen und Archiv | Archiv-/PDF-Vollerhebung nicht durchgeführt; nicht jede Rubrik über diesen Einstieg zugänglich |
| RIS | https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031 – 15.10.2026, öffentliche TOPs einschließlich Hundewiese, Radverkehr, Rechenzentrum | Tabellen-/PDF- und Freigabedatums-Vollständigkeit nicht geprüft. Sitzung/TOP/Vorlage/Beschluss strikt unterscheiden |
| Merkur | https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/ – ortsspezifische Meldungsübersicht | Rollierende Seite, keine bewiesene Vollständigkeit für gesamten Oktober |
| SZ | https://www.sueddeutsche.de/muenchen/landkreismuenchen – datierte Landkreis-Artikel | Breiter Regionalraum, nicht alle örtlich relevanten Artikel zwingend in dieser Rubrik |
| Merkur RSS | https://www.merkur.de/rssfeed.rdf | Leser meldet `Unsupported content-type: application/rss+xml`; kein negativer Feed-Funktionstest |
| SZ RSS | https://rss.sueddeutsche.de/lkrmuenchen | im Webleser nicht zugänglich; Funktions-/Abdeckungsprüfung offen |

Die direkt ausgeführte Python-HTTP-Prüfung schlug bei allen externen Domains wegen DNS-Auflösung der Laufzeitumgebung fehl. Daraus dürfen keine Aussagen über die Anbieter abgeleitet werden.

## B – Qualitativer Suchvergleich anhand konkreter Treffer

| Prüffall | Direktquelle | Offene Suchmethode | Erkenntnis |
|---|---|---|---|
| Hundewiese | RIS-TO 15.10. / Merkur-Lokalübersicht | SZ 26.10. und Merkur 25.10. auffindbar | Zwei Pressefundstellen, ein gemeinsamer Sachverhaltskomplex; RIS-Vorlage ist keine Abstimmungsbestätigung |
| Gewerbesteuerrückgang / Grundstückskauf | Merkur-Lokalübersicht | Artikel vom 08.10. auffindbar; enthält Grundstückskauf von rund 7 Mio € | Breitere Artikelerfassung als nur Titelsuche notwendig |
| A99/B471-Planung | keine Feldkirchen-Titelmarkierung | SZ 07.10. gefunden | Dynamischer räumlich-funktionaler Recherchehorizont ist erforderlich |
| Vereinsvorständetreffen | Gemeinde-Nachricht 07.10. | allgemeine Quellensuche findet Veröffentlichung | direkte örtliche Meldung trotz fehlender kommunalpolitischer Schlagwörter |
| Rechenzentrum | RIS-TO 15.10. | Merkur 22.10. | Vorlagen und Presse ergänzen einander; Veröffentlichung/Abstimmung getrennt interpretieren |
| Tempo 30 B471 | Merkur-Ortsseite | Merkur 23.10. | unmittelbarer Ortsbezug leicht suchbar |

**Versuchsgrenze:** Diese Ergebnisse stammen aus iterativen, nicht randomisierten Prüfungen; Suchbegriffe, Sichtungszeitpunkte und Suchraum waren nicht symmetrisch. Deshalb keine Trefferquoten, Konfidenzintervalle oder kausalen Leistungsaussagen pro Verfahren.

## C – KI-gestützte Recherche (Untersuchungsstand)

Die semantische Einschätzung von SZ A99/B471 ist ein Beispiel einer KI-gestützten *Auswertung* eines bereits ermittelten Treffers, **kein isolierter KI-Entdeckungslauf**. Es fehlt die Gegenprobe ohne KI mit gleichem Suchraum, Suchbudget, Datum und Entscheidungsregel.

Für U4 ist als prüfbare Hypothese zu vermerken: KI könnte indirekte Ortsbezüge besser erkennen, die Evidenzbasis für technische Einrichtung eines dauerhaften KI-Recherchekanals reicht derzeit nicht.

## D – Kosten und Betrieb

Direkter HTML-Zugang und Suchmaschinenzugang sind in diesem Untersuchungslauf erreichbar; daraus folgt noch **keine Kostenaussage** für produktive automatisierte Nutzung. API-Lizenzen, Nutzungsbedingungen, Abrufzahlen, Rate Limits, KI-Token, Laufzeit, manuelle Sichtungsminuten und Fehlerraten wurden nicht als vergleichbare Werte erhoben.

**Belastbare ökonomische Empfehlung:** Ein einfaches Quellenmonitoring zuerst instrumentiert erproben; kostenpflichtige Such-/KI-Zugänge erst anhand messbarer zusätzlicher relevanter Treffer bewerten. Keine erfundenen Eurobeträge.

## Vorläufige U4-Entscheidungsvorlage

1. RIS, Gemeinde, Merkur-Ortsbereich und SZ-Regionalbereich als **Prioritätsquellen** für einen Pilot berücksichtigen.
2. Pro Quelle Zugangsart nach realer technischer Prüfung wählen: RSS wenn verwertbar, sonst HTML, Dokumentliste/RIS separat.
3. Offene Suche ergänzend zum bekannten Quellenbestand; nicht ausschließlich genaue Ereignisnamen verwenden.
4. KI zunächst für Orts-/Funktionsbezug, Relevanzvorschläge und gezielte Wissenslücken als **prüfbaren Zusatz**, nicht automatisch als überall laufenden Abfragedienst.
5. Quellenfehler und Zeitlücken nicht als Nichtfunde zählen; Freigabe-/Relevanzregeln des Kapitels 03 bleiben unberührt.
6. Qualitäts- und Kostenüberlegenheit einer Kombination **noch nicht beschlossen**.

## Was zur endgültigen empirischen Entscheidung fehlt

Ein kleiner, prospektiver Vergleich mit identischer Laufzeit und festem Prüffeld: Zugänge aus einem normal netzfähigen Client, RSS-Snapshots, HTML-/Suchtreffer, Stichproben-Vollerhebung, KI-Versuchsarm, protokollierte URLs/Zeiten/Kosten. Dieser Versuch muss nicht zwingend sieben Tage dauern; Umfang und Stopkriterien sollen sich an der Zahl neuer Funde orientieren. **Ohne einen solchen Test lassen sich die expliziten Projektziele „Trefferquote“ und „Kosten je Zusatztreffer“ nicht abschließend beantworten.**

## Empfehlung zur fachlichen Behandlung

Den hier abgeschlossenen **Desk-Research-/Machbarkeitsblock** als Untersuchungsergebnis abnehmen und die normative Entscheidung für produktive U4-Strategie mit Kennzahlen zurückstellen. Das ist keine offene Grundsatzdiskussion, sondern eine nachprüfbare Evidenzgrenze.

## Beispielquellen

- https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/
- https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/gewerbesteuer-bricht-ein-gemeinde-feldkirchen-kuerzt-und-streicht-projekte-94529507.html
- https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/rechenzentrum-in-feldkirchen-70-bis-80-prozent-des-grundstuecks-sollen-versiegelt-werden-94551845.html
- https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/feldkirchner-fordern-erneut-tempo-30-auf-b471-landratsamt-lehnte-es-schon-ab-94553770.html
- https://www.sueddeutsche.de/muenchen/landkreismuenchen/haar-autobahnparallele-a99-b471-entlastungsstrasse-li.3559573
- https://feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/vereinsvorstaendetreffen-im-herbst
- https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031
