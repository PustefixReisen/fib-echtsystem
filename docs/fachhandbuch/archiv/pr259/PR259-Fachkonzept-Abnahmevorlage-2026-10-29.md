# FIB-Fachkonzept – Abschlussprüfung und Vorlage zur Fachabnahme

**Stand:** 29.10.2026 · **PR:** #259 · **Status:** Zur fachlichen Endabnahme vorgelegt, **noch nicht abgenommen und nicht gemergt**.

## 1. Abnahmegegenstand

- Elf im Fachdialog einzeln durchgesehene und fachlich bestätigte Prozesskapitel 01–11 in `docs/fachhandbuch/`.
- [Verbindliche Übernahme- und Vorrangregel](PR259-Normative-%C3%9Cbernahme-2026-10-28.md): Jüngere ausdrücklich bestätigte Regeln gehen widersprechenden Altformulierungen vor. Nicht widersprechende Detailregeln bleiben über die vollständigen alten Quellen und die 86 Regeln der Referenzanhänge einbezogen.
- [Quellen- und Konfliktabgleich](PR259-Konsolidierter-Quellenabgleich-2026-10-28.md), [Kennungsregister](PR259-Regelmigration-Kennungsregister-2026-10-28.md), [Abschnittsregister](PR259-Regelmigration-Abschnittsregister-2026-10-28.md).
- Altdateien werden **nicht** gelöscht und weder durch bloße Umbenennung noch stillschweigend als inhaltsleer erklärt. Das Referenzsystem ist Teil der dokumentarischen Geltung; ein vollständig ausformulierter Einzeltext-Neudruck in den elf Kapiteln ist nicht erforderlich.

## 2. Abschlussprüfung – Befunde

| Kontrollpunkt | Befund | Beurteilung |
|---|---|---|
| Fachliche Lesedurchsicht | 11/11 Kapitel mit Rückmeldungen und Bestätigung bearbeitet | erfüllt |
| Historische Regelkennungen | 54 Recherche + 32 Themen, Originaltexte in Referenzen gesichert | erfüllt als Quellensicherung |
| Sonstige Primärquellen | 18 eigenständige Fachquellen, 260 inhaltliche Hauptabschnitte verzeichnet | erfüllt als Inventar |
| Widersprüche | 30-%-Regel und vier Bezugsstatus kein Konflikt; Presseberichte **nur Sitzung**, TOP-Fakten **nur RIS**; weitere ausdrücklich ersetzte Altregeln dokumentiert | fachliche Vorrangregel festgelegt |
| Quellenverweise im Fachhandbuch | 11 Kapitel mit 32 relativen Verweisen auf 20 unterschiedliche Zieldateien inventarisiert; Stichprüfung kritischer Quellpfade durchgeführt | vollständige Zielprüfung durch GitHub nicht nachgewiesen |
| Vollständige Detailregel-Regression | Keine ausgeführten Tests der 86 Einzelregeln und der nicht nummerierten Nebenbedingungen dokumentiert | **nicht als bestanden behauptet** |
| Technische Umsetzung | Nicht Gegenstand der Fachkonzeptabnahme | gesonderte Entwicklung |
| GitHub PR-Status | PR #259 offen; Branch `docs/kap03-recherche-gesamtmodell-20261026` laut Vergleich 272 Commits vor und 1 Commit hinter `main` (Prüfzeitpunkt 29.10.2026) | vor Merge neu prüfen |
| CI | GitHub Combined Commit Status lieferte für geprüften Commit keine klassischen Statusmeldungen | **kein Nachweis bestandener Checks** |

**Unterscheidung:** Die fachliche Konsolidierung ist als Regelhierarchie mit ergänzenden Primärquellen dokumentiert. Sie ist **nicht** gleichbedeutend mit einem erfolgreichen programmgesteuerten Einzelnorm-Regressionstest.

## 3. Nicht blockierende Folgeaufgaben

- [#266 Demokratisch-gesellschaftlicher Referenzrahmen](https://github.com/PustefixReisen/fib-echtsystem/issues/266): konkrete Kriterien noch nicht beschlossen.
- [#267 RIS-Volltextnutzung](https://github.com/PustefixReisen/fib-echtsystem/issues/267): vor Umsetzung rechtliche Prüfung.
- [#268 RSS, Newsletter, Besucheranalyse](https://github.com/PustefixReisen/fib-echtsystem/issues/268): Planungsbeginn öffentlicher FIB-Teil.
- [#269 KI-Modellreview und Kosten](https://github.com/PustefixReisen/fib-echtsystem/issues/269): konkrete Admin-Auswertung/Betrieb.

Unabhängig davon ist die **Untersuchung der Informationsgewinnungsqualität** nach der fachlichen Konsolidierung und **vor Implementierung von U4** vereinbart; sie ist eine eigene Projektphase.

## 4. Was ist für den Abschluss noch erforderlich?

1. **Fachliche Endabnahme:** Nutzer bestätigt den in dieser Vorlage beschriebenen **konsolidierten Regelstand** mit den ergänzenden unveränderten Altregeln. Dies ist eine Gesamtbestätigung, keine neue Durchsicht der elf Kapitel.
2. **GitHub-Mergevoraussetzungen:** Branch gegen `main` aktualisieren beziehungsweise Abweichung bewerten, PR-Checks und Merge-Konflikte tatsächlich prüfen; erst bei positivem Befund den PR zusammenführen.
3. **Anschließend:** Altdokumente mit eindeutigen Status-/Vorrangverweisen versehen, keine verlustbehaftete Löschung; umsetzungsrelevante Regelabweichungen in Entwicklungs-Issues verfolgen.

## 5. Vorgeschlagene Fachabnahme

> Ich bestätige das FIB-Fachkonzept in der konsolidierten Fassung von PR #259 einschließlich der dokumentierten Regelhierarchie und der weiterhin ergänzend geltenden nicht widersprechenden Altregeln. Die vier gesonderten Folgeaufgaben sind nicht Bestandteil dieser Abnahme. Eine technische Umsetzung oder CI-Freigabe wird hierdurch nicht bestätigt.

**Noch keine Abnahmeerklärung erteilt.** Dokument für die Entscheidung vorbereitet.
