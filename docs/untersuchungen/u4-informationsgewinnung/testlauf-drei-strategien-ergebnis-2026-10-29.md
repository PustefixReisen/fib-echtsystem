# U4 – Kontrollierter Suchvergleich: Durchführungsbericht (29.10.2026)

**Status:** Drei Suchvarianten mit je zehn Websuchanfragen explorativ ausgeführt; **der geplante verblindete, zweimal wiederholte und numerisch auswertbare Vergleich ist nicht abgeschlossen**. Gründe: keine voneinander isolierten KI-Kontexte, kein vollständig unabhängig geprüfter 25–30-URL-Referenzbestand, kein vollständiges einheitliches Resultatprotokoll des Suchanbieters, kein API-Kostenzugang. Es wird keine Siegerstrategie behauptet.

## Durchführung
Festgelegtes Fenster: Veröffentlichungsdatum 01.–28.10.2026; Feldkirchen bei München 85622 und fachlich begründete räumliche Beziehungen.

- **A:** Alle zehn fixierten klassischen Anfragen aus `vergleichsprotokoll-offene-suche-v1-2026-10-29.md` in einem Websuch-Batch durchgeführt.
- **B:** Zehn vom KI-Assistenten abgeleitete, breiter angelegte Anfragen (Nachbargemeinden, Verkehrsnetze, AFK, Nachbarschaft, thematische Rubriken, Wochenanzeiger) in einem Batch ausgeführt.
- **C:** Zehn nach Analyse der vorherigen Ergebnisse gezielte Anfragen (Kirchheim-Umleitung, Geothermie, weitere Orts-/Pressequellen und amtliche Verbindungen) in einem Batch ausgeführt.
- **Verbrauch:** Jeweils 10 Abfragen in einem einzelnen Batch. B/C wurden im selben Chat-Kontext wie A erzeugt, C kannte die Suchrichtungen von B. Deshalb ist die Sequenz gerade **keine gleichwertige unabhängige A/B/C-Gegenprobe**; erzwungene Trennung technisch nicht verfügbar.
- **Wiederholung:** Keine; die vorgesehenen zwei unabhängigen Wiederholungen pro Strategie wurden nicht durchgeführt.
- **Referenzbestand:** 9 frühere Kandidaten, nicht auf 25–30 verifizierte unverwechselbare Veröffentlichungs-URLs ausgebaut. Keine Recall-Quote ausgewiesen.

## Nachprüfbare Einzelbefunde

| Funde / Typ | Nachweis | Aussage |
|---|---|---|
| Unterschiedliche Orte namens Feldkirchen | https://www.feldkirchen-gemeinde.de/veranstaltungen/kategorien/veranstaltung/ | Klassische Ortsname-Suche enthält Fremdort; Gemeinde bei München ist `feldkirchen.de`. Geografische Identität explizit prüfen. |
| Gemeinde: Vereinsvorständetreffen | https://feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/vereinsvorstaendetreffen-im-herbst | 07.10.2026; direkt örtlich und nicht kommunalpolitisch. Pflichtquelle: nicht als offener Mehrwert verbuchen. |
| Gemeinde: Bahnhof | https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/neuerungen-am-bahnhof | 28.10.2026; Pflichtquelle, neue Veröffentlichung |
| Merkur: Hundewiese | https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/feldkirchen-hundewiese-gescheitert-spd-zieht-antrag-nach-sieben-jahren-zurueck-auch-park-plaene-vom-tisch-94555516.html | 25.10.2026; Pflichtquelle |
| Kirchheim: Gashochdruckleitung | https://www.kirchheim-heimstetten.de/verkehrsbeeintraechtigung/ | 12.10.2026; veränderte Verkehrsführung Richtung Feldkirchen und Linie 263; konkrete mittelbare Relevanz prüfen, außerhalb vier Pflichtquellen |
| AFK: Seismische Messungen | https://afk-geothermie.de/giga-m-fuehrt-seismische-messungen-im-versorgungsgebiet-durch/ | 09.10.2026; direkt Feldkirchen betroffen, außerhalb vier Pflichtquellen |
| Grasbrunn: B304-Umleitung | https://app.grasbrunn.de/de/Neuigkeiten/Neuigkeit?id=3376&item=article&view=publish | Veröffentlichung vom 07.10.2026; Umleitungsweg ausdrücklich Feldkirchen; ergänzende regionale Quelle |
| Amtliche Baustraßen-Quellen | https://www.stbafs.bayern.de/service/medien/pressemitteilungen/2026/202-31/index.html | Verweist ebenfalls auf B471–Feldkirchen; dortige ursprüngliche Mitteilung September, nicht in Oktober-Veröffentlichungsnenner |
| SZ-Kreisübersicht | https://www.sueddeutsche.de/muenchen/landkreismuenchen | Funde und Titel aus regionaler Pflichtquelle, nicht exklusiv als offener Mehrwert zählen |

## Was aus dem Lauf folgt – und was nicht
1. **Nachweis:** Allgemeine Suche liefert unpassende Ortsnamens-Dubletten; regionale und thematische Suche kann Berichte mit klaren indirekten Verkehrsbeziehungen und AFK-Fachmitteilungen erreichen.
2. **Keine Zuordnung exklusiver Treffer nach Strategie:** Suchergebnislisten waren unterschiedlich lang und nicht vollständig als URL-/Ranking-Rohdaten exportiert; spätere Sichtung ähnlicher Quellen überlagert frühere Funde.
3. **Keine Aussage über Überlegenheit A/B/C:** Alle Läufe in demselben KI-Kontext, C hatte Vorkenntnisse; kein blindes Gegentesten.
4. **Kosten nicht gemessen:** Chat-Websuche hat keine separat abgerechneten Query- und Token-Kosten veröffentlicht. Nur Query-Anzahl 10/10/10 dokumentiert.
5. **Erforderliche Alternative:** kleiner skriptbarer, isolierter Einmaltest gegen vorher geprüften Referenzkorpus. Weder sieben Tage Beobachtung noch Implementierung von U4 erforderlich.
6. **Zum Referenzkorpus:** Gegenwärtig neun Kandidaten. Referenzbestand kann auch kleiner beginnen, aber muss vor den Läufen fixiert und in jedem Fall blind bleiben. In diesem Chat sind diese Kandidaten dem Assistenzmodell bereits bekannt, daher keine wirksame Blindheit.

## Fachliches Fazit
Diese Untersuchung bestätigt **Möglichkeit und Wert von indirekten lokalen Bezügen sowie zusätzliche Quellenarten**, nicht die Leistungsrangfolge der drei Suchverfahren. Die Behauptung eines „vollständig abgeschlossenen sauberen Vergleichs“ wäre falsch. Die früheren Dokumentationen dürfen deshalb nicht als quantitative Evaluierung ausgelegt werden.

**Keine normative Regeländerung und keine U4-Implementierung.**
