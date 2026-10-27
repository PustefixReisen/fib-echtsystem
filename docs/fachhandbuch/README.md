# FIB-Fachhandbuch – Einstieg und Migrationsstand

**[Fachliche Restkonflikte und Entscheidungsstand](PR259-Fachliche-Restkonflikte-und-Entscheidungsstand-2026-10-26.md)** – Drei echte fachliche Restfragen sind von späteren Datenmodell- und UI-Aufgaben abgegrenzt; die bereits beschlossenen Regeln bleiben unberührt.

**[Fachkonzept-Abschlussfahrplan und Abnahmekriterien](PR259-Fachkonzept-Abschlussfahrplan-2026-10-26.md)** – Aktueller Fokus: fachliche Konsolidierung und gemeinsame Leseabnahme. Datenmodell, Bedienoberfläche und Implementierung folgen anschließend iterativ; die Issues #260–#264 sind nur nachgelagerte Vormerkungen.


**[Wegweiser zur gemeinsamen Leseabnahme](PR259-Leseabnahme-Wegweiser-2026-10-27.md)** – Lesereihenfolge der elf Kapitel, bereits getroffene Entscheidungen, konkrete Abschlussprüfungen und Grenze zur späteren technischen Umsetzung.

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 (Aufbau) | 22.10.2026 | Projektverantwortung – erstellt mit KI-Unterstützung |

## Ziel und Verbindlichkeit

Hier entsteht die **einzige fachliche Primärdokumentation** des FIB-Echtsystems. Menschen navigieren über fachliche Kapitel; KI, PRs und Tests können eindeutige Regelkennungen verwenden. **Während der Übernahme bleiben die bisherigen Primärquellen verbindlich**; dieses Verzeichnis führt noch keine konkurrierenden Regeln ein. Erst nach vollständiger, überprüfter Übernahme werden die alten Quellen auf historische Belege/Verweise umgestellt.

Projektübergreifender Standard: [pustivo – Fachliches Dokumentationsmodell](https://github.com/PustefixReisen/pustivo/blob/main/docs/governance/Fachliches-Dokumentationsmodell.md).

## Fachkapitel und Arbeitsstand

Die frühere Planungstabelle mit überwiegend „geplant“ ist durch die nachstehende **Elf-Kapitel-Lesefassung** überholt. Alle elf Entwürfe sind vorhanden; ihre vollständige Quellmigration, sprachliche Konsolidierung und fachliche Abnahme sind noch offen. Die früheren Fachkapitel 03 und 06 bleiben während der Prüfung als Primärquellen bestehen.

## Zusammenhängende Lesefassung in PR #259 (26.10.2026)

**Alle elf Kapitel sind als einzelne Leseentwürfe vorhanden.** Diese Links führen zur neuen, noch **nicht verbindlich konsolidierten** Fassung. Die oben genannten bisherigen Primärkapitel 03 und 06 bleiben während der Migration bestehen.

| Kapitel | Leseentwurf |
|---|---|
| 01 Grundlagen | [01 – Grundlagen und Zielsetzung](01-Grundlagen-und-Zielsetzung-Entwurf-2026-10-26.md) |
| 02 Wissensmodell | [02 – Struktur- und Wissensmodell](02-Struktur-und-Wissensmodell-Leseentwurf-2026-10-26.md) |
| 03 Recherche | [03 – Recherche, Neufassung](03-Recherche-Neufassung-Entwurf-2026-10-26.md) |
| 04 Ereignisse und Meldungen | [04 – Ereignisse und Meldungen](04-Ereignisse-und-Meldungen-Entwurf-2026-10-26.md) |
| 05 Vorgänge | [05 – Vorgänge und Vorgangsanalysen](05-Vorgaenge-und-Vorgangsanalysen-Entwurf-2026-10-26.md) |
| 06 Themen | [06 – Themen und Themenanalysen](06-Themen-und-Themenanalysen-Entwurf-2026-10-26.md) |
| 07 Sitzungen und Beschlüsse | [07 – Sitzungen und Beschlüsse](07-Sitzungen-und-Beschluesse-Entwurf-2026-10-26.md) |
| 08 Redaktion | [08 – Redaktion und Veröffentlichung](08-Redaktion-und-Veroeffentlichung-Entwurf-2026-10-26.md) |
| 09 Öffentliches Angebot | [09 – Öffentliches FIB-Angebot](09-Oeffentliches-FIB-Angebot-Entwurf-2026-10-26.md) |
| 10 Qualität | [10 – Qualitätssicherung](10-Qualitaetssicherung-Entwurf-2026-10-26.md) |
| 11 Rechte | [11 – Fachliche Rollen und Rechte](11-Fachliche-Rollen-und-Rechte-Entwurf-2026-10-26.md) |

**Prüfstatus:** Kapitel 02 wurde im Fachdialog vom 26.10.2026 inhaltlich akzeptiert; Kapitel 09 wurde in wichtigen Einzelpunkten abgestimmt. Die übrigen Kapitel sind Leseentwürfe, keine Gesamtabnahme. Technische Umsetzbarkeit, Regel-/Quellmigration und Status-/Rechtekonsistenz sind gesondert nachzuweisen. Siehe [Gesamtabgleich](PR259-Gesamtabgleich-2026-10-26.md) und [Migrationsmatrix](PR259-Regelkennungen-Migrationsmatrix-2026-10-26.md).

## Abschluss- und Testnachweis für PR #259

Die [Abschlussprüfung mit Regeländerungsübersicht und 20 Regressionstests](PR259-Abschlusspruefung-und-Regression-2026-10-26.md) trennt ausdrücklich zwischen **vollständigem Leseentwurf**, **gesichertem Regelbestand** und der **noch offenen technischen bzw. normativen Abnahme**. Der PR bleibt bis zum vollständigen Quell-/Datenmodell-/Testabgleich Draft.

## Quell- und Technikabgleich (26.10.2026)

- [Weitere fachliche Primärquellen – abschnittsorientierter Übernahmeabgleich](PR259-Weitere-Quellen-Abschnittsabgleich-2026-10-26.md): Ausgangsabschnitte, geplante Zielkapitel und zu prüfende Fachregelabweichungen.
- [Technischer Vertragsabgleich und fünf Implementierungsblöcke](PR259-Technischer-Vertragsabgleich-und-Arbeitspakete-2026-10-26.md): statische Gegenüberstellung mit SQL-Entwurf, Migrationscode, Fachservice und UI.
- [Live-Schema-Abgleich Shared-Apps](PR259-Live-Schema-Abgleich-Shared-Apps-2026-10-26.md): reine Metadatenprüfung; Themenbeitragsmigrationen vorhanden, zusätzliche Analyse-/Vorgangsbeitrags-/Vertiefungsmodelle noch nicht nachgewiesen.

**Abnahmegrenze:** Die vorgenannten Prüfungen sind keine produktive Datenbankprüfung und kein Testlauf. Das Fachhandbuch ist noch nicht normative Primärquelle. PR #259 bleibt bis zur vollständigen Übernahme und überprüften Tests im Entwurfszustand.

## Sekundärsichten (nur diese beiden in der ersten Ausbaustufe)

1. **Begriffe:** möglichst automatisch aus den Primärdefinitionen abgeleitet.
2. **Status-/Rechteübersicht:** möglichst automatisch aus fachlichen Rollen- und Übergangsregeln abgeleitet.

Die erforderliche Strukturierung wird bei der Übernahme erprobt. Anwenderhandbuch, FAQ und PDF sind **nicht Bestandteil dieser Phase**.

## Übernahme und Vollständigkeitsnachweis

Die [Inventur und Zuordnung](../Fachhandbuch-Inventur-2026-10-22.md) erfasst Ausgangsquellen und künftige Primärkapitel. Jeder fachliche Abschnitt wird kontrolliert übernommen: Quelle → Zielregel/Kapitel → Widerspruchsprüfung → Verweisbereinigung. **Keine Löschung oder Umwidmung bisheriger Fachquellen vor erfolgreichem Nachweis.**

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 22.10.2026 | Fachhandbuch als Aufbauziel, geplante Kapitel, begrenzte Sekundärsichten und Migrationsregel angelegt. |
