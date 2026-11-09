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

## Implementierter zusätzlicher Anzeigepfad im Draft

Die bestehende bestätigte RIS-Vorschlagsverwaltung verfügt über das
JSON-Feld `ris_suggestions.payload` und die Beziehung
`ris_decision_versions.suggestion_id`. Ohne Schemaänderung ist jetzt
ein **separat von wörtlichem Quelleninhalt verfasster**
`factualSummary`-Wert optional erfassbar:

- `ris_suggest` validiert den redaktionell verfassten Wert (bis
  4.000 Zeichen) und speichert ihn mit dem bestehenden, weiterhin
  nach exakter RIS-Quelle prüfbaren Vorschlag.
- Erst bei `ris_review_suggestion` mit `confirmed` und dem
  bestehenden FIB-/RIS-Prüfverfahren wird das sachliche
  Zusammenfassungsfeld über `suggestion_id` in der Sitzungs-API als
  `factual_summary` lesbar. Ein noch offener/abgelehnter Vorschlag
  erscheint dort nicht als bestätigter Beschlussinhalt.
- Die UI zeigt diese geprüfte sachliche Zusammenfassung **zusammen
  mit** dem zugeordneten Ergebnis und den explizit bekannten
  Ja-/Nein-/Enthaltungszahlen. Bei Quellversionsänderung wird die
  Zusammenfassung vorsichtshalber nicht ausgegeben und eine erneute
  Prüfung verlangt.
- Das historische `v.wording` (wörtlicher Belegtext) wird **nicht**
  im Browser ausgegeben. Weder PDF-Archivierung noch neue SQL-Tabellen
  oder Produktivdatenänderungen.
- Isolierte Browser-Fälle prüfen, dass eine synthetische
  Sachzusammenfassung einschließlich Abstimmungswerten angezeigt
  wird, ohne HTML-Quelltext zu rendern.

**Offen:** Es existieren für Sitzung 1031 bisher noch keine
bestätigten Beschluss-/Abstimmungsdatensätze. Die FIB-Oberfläche hat
zudem noch keinen eigenen vollständigen redaktionellen Eingabedialog
für diese neuen Sachzusammenfassungen. Diese Eingabe/Bestätigung sowie
die rechtskonforme fachliche Erfassung der tatsächlichen
Niederschrift bleiben Voraussetzung für die gewünschte reale
Beschlusstextanzeige. Die Änderung darf nicht als fertige
RIS-Nachabnahme bezeichnet werden.

## Verbindliche Nutzerentscheidung vom 09.11.2026: vollständiger Beschlusswortlaut

Die statische Testvorschau wurde fachlich mit **„passt“** abgenommen:
pro Beschlusspunkt **vollständiger protokollierter Wortlaut zuerst**,
**Abstimmungsergebnis unmittelbar danach**. Keine sachliche
Zusammenfassung als Ersatz. PDF-Zeilenenden und weiche Worttrennungen
dürfen nur lesefreundlich bereinigt werden, ohne Inhalt zu kürzen.

Die frühere Entwicklungslösung `factualSummary` genügt dieser
Anforderung nicht und wurde als Anzeigepfad verworfen.

### Neuer geschützter Datenweg in diesem Draft

- In der TOP-Detailansicht steht für bestehende **manuell gewählte
  TOP-Hauptereignisse** mit einer sitzungsweiten Niederschrift ein
  Dialog `Beschluss aus Niederschrift erfassen` zur Verfügung.
- Vollständigen Beschlusswortlaut und einen konkreten Originalbeleg
  erfassen; je Punkt Abstimmung und Zahlen getrennt eingeben.
  Unbekannte Enthaltungen bleiben null, nicht null Stimmen.
- Vor Einreichen muss der Redakteur das amtliche Dokument tatsächlich
  prüfen und **pro Fassung** eine Wiedergabeberechtigung benennen und
  dokumentieren. Die Auswahl einer Rechtsgrundlage allein ist kein
  allgemeiner Freibrief.
- Mit `ris_suggest` wird nur ein **offener** Vorschlag gespeichert.
  Die zweite bewusste Aktion `ris_review_suggestion` bestätigt oder
  verwirft den Vorschlag unter bestehendem AAL2-/Rollen-/Edit-Lock-
  und Auditverfahren; der Backend-Validator verlangt aktuelle
  Dokumentversion, passenden Sitzungskontext und ein bestätigtes
  RIS-Dokument. Die sachlich unpassende Vorlage gilt nie als Beschluss.
- `ris_read` gibt den Originalwortlaut ausschließlich als
  `display_wording` weiter, wenn der verknüpfte Vorschlag bestätigt,
  die Dokumentversion aktuell und der dokumentierte Rechtsgrund
  `official_work_5_urhg` oder `explicit_permission` vorhanden ist.
  Alte bestätigte Beschlussdaten ohne gesonderte Rechtebewertung
  bleiben für wörtliche Anzeige gesperrt.
- Die für die statische Vorschau verwendete Schaltlogik bleibt
  ausschließlich dort aktiv. Keine SQL-Migration, kein
  Datenimport, keine PDF-/Volltextarchivierung oder automatische
  Rechtefestlegung im Live-Bestand.
- Der Freigabe-Dialog ist kein automatischer Import aus der Niederschrift.
  Ein neuer, echter Vollständigkeitsnachweis der Sitzung bleibt offen.

### Rechtsprüfung und Quellen (kein pauschaler Freigabevermerk)

[§ 5 UrhG](https://www.gesetze-im-internet.de/urhg/__5.html)
unterscheidet die in Absatz 1 genannten amtlichen Werke und andere
amtliche Werke nach Absatz 2; bei Absatz 2 sind insbesondere
Änderungsverbot und Quellenangabe zu beachten. Aus bloßer
RIS-Abrufbarkeit darf nicht automatisch die Ausnahme für jede
Niederschrift oder enthaltene Drittinhalte abgeleitet werden.
Das [BVerwG, Urteil vom 25.06.2015, 7 C 2.14](https://www.bverwg.de/250615U7C2.14.0)
unterscheidet Informationszugang vom spezifischen allgemeinen
Verbreitungsinteresse nach § 5 Abs. 2 UrhG.

Vor produktiver Erfassung vollständiger Texte muss die
dokumentbezogene Einordnung und die Möglichkeit unveränderter
Wiedergabe bzw. die ausdrückliche Erlaubnis positiv geklärt werden.
Eine pauschale Erlaubnis wird durch diesen Entwicklungs-PR
**nicht** behauptet.

**Offene Restarbeiten**: echter Quellenabruf/Erfassungsumfang für
Sitzung 1031, rechtliche Freigabe einzelner Niederschriftfassungen,
persönliche Testabnahme des neuen redaktionellen Dialogs und
gesondertes Release/Backup. Die zuvor abgenommene reine
Vorschau-Darstellung ist davon unabhängig.
