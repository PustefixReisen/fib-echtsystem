# RIS-Niederschrift: fehlende Beschlussinhalte – Befund 09.11.2026

Bezug: #403, #377, persönliche RIS-Abnahme am 09.11.2026.
Kein Live-Datenimport, kein PDF-/Volltextarchiv, keine Secretänderung.

## Tatsächlicher Ist-Zustand

Nach genehmigtem Entwicklungsrelease #404 und persönlichem Screenshot aus
`Gemeinderat · 15.10.2026 · TOP 2` fehlen in der Karte
`Niederschrift der Sitzung` der tatsächlich protokollierte
Behandlungs-/Beschlussinhalt und die zugehörigen Abstimmungen.

Read-only-SQL in Shared-Apps auf `fib` am 09.11.2026: Für die erfassten
TOPs 2, 3 und 6 derselben Sitzung enthalten die verknüpften
`ris_decision_points`, `ris_decision_versions` und `ris_votes`
**jeweils null Datensätze**. Die Frontendansicht
`RisSessionView.tsx` hat bisher `decisions` ausschließlich aus
`result` und Stimmenzahlen gerendert und `v.wording` nicht verwendet.
Die bestehende API-Abfrage in
`supabase/functions/_shared/ris-editorial.ts` liefert zwar
`v.wording`, kann aber keine nicht gespeicherten Beschlüsse liefern.

Die vorhandene **historische Testreferenz**
`tests/u4/fixtures/ris-1031-minutes-excerpts.txt` enthält im Original:
- TOP 2: Antrag zurückgezogen, auf Abstimmung verzichtet.
- TOP 3: Parkanlagen-Antrag abgelehnt, 7 Ja / 13 Nein.
- TOP 6: zwei getrennte Rechenzentrums-Entscheidungen; 17 Ja / 2 Nein
  für die erste, 19 Ja / 0 Nein für die zweite; Hinweis auf
  Abwesenheit bei der zweiten Abstimmung.

Das sind vorhandene Quell-/Testbelege, **keine** positiv geprüften
produktiven `ris_decision_versions` oder `ris_votes`.
Nicht durch stilles Kopieren in die produktive Datenbank fälschen.

## Änderungen dieses begrenzten UI-Entwurfs

- Entfernt den sachlich irreführenden pauschalen Satz
  `Veröffentlichter RIS-Stand; keine redaktionelle Beschlussbestätigung`.
- Gibt bei fehlenden geprüften Daten einen **verständlichen, überprüfbaren
  Hinweis auf die fehlende Übernahme** statt `Keine geprüften ...` aus.
- Bei `abgesetzt` wird ausdrücklich **keine erfundene Abstimmung**
  dargestellt.
- Wenn bereits geprüfte `decisions` vorhanden sind, werden die
  Abstimmungsergebnisse je Beschlusspunkt zusammengefasst, während der
  noch nicht rechtlich freigegebene Beschlussinhalt als fehlend
  gekennzeichnet bleibt.
- Keine wörtliche Übernahme von `wording` oder `evidence_quote`,
  bevor Dokument- und Wiedergaberechte fachlich bestätigt sind.

**Diese UI-Korrektur erfüllt die zentrale Nutzeranforderung noch nicht**:
Der tatsächliche Beschlussinhalt ist weiterhin nicht verfügbar.
Deshalb nur Draft und keine automatische Produktivbereitstellung.

## Verbindliche technische Nacharbeit zur eigentlichen Abnahme

1. Für reale Niederschrift `15.10.2026` (RIS-Sitzung 1031)
   die tatsächlich vollständige Originalquelle über den regulär
   zugelassenen Quellenweg erschließen. Kein Proxy-Bypass; bisher
   blockierte Umgebung und bereits belegte 3/19 TOPs getrennt behandeln.
2. Sachliche Entscheidungstexte für jeden TOP **inhaltsgetreu und
   quellenbelegt** strukturieren; mehrere Entscheidungen/Abstimmungen
   getrennt, aber jeweils mit ihrem Beschlussinhalt.
3. Rechteentscheidung für **wörtliche Niederschriftdarstellung**
   ausdrücklich dokumentieren. Vorher nur rechtlich zulässige sachliche
   Paraphrase mit amtlichem RIS-Link. Keine PDF-/Originalvolltexte in FIB
   speichern und keine ungeprüften Rechteannahmen.
4. Geeigneten bereits bestehenden redaktionellen Prüf-/Freigabeweg
   für die getrennten Beschlussdaten verwenden oder gezielt ergänzen.
   Keine Ableitung aus bloßen Vorlagen, RIS-Status oder Pressebeiträgen.
5. PostgreSQL17-/API-/Browser-Tests: TOP 2 ohne Abstimmung, TOP 3 mit
   7:13, TOP 6 mit zwei getrennten 17:2- und 19:0-Abstimmungen,
   Nachträge/Versionen, unbekannte Enthaltungen, Quellenänderung,
   Handy/PC und Rechtefreigaben. Persönliche Abnahme anschließend
   ausdrücklich vom Nutzer bestätigen lassen.

## Abnahmegrenze

Die Entwicklungssicherung und der Release #404 sind nachgewiesen.
**Die RIS-Niederschriftanzeige bleibt fachlich nicht abgenommen**,
solange der Beschlussinhalt samt Abstimmungsergebnissen für belegte
TOPs nicht vollständig und zulässig angezeigt wird.
