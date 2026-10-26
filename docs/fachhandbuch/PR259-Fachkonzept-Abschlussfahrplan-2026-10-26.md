# PR #259 – Fachkonzept: fachliche Abschlussprüfung und Abnahmeweg

**Stand 26.10.2026 · Fokus ausschließlich Fachkonzept.** Diese Übersicht trennt strikt die **fachliche Fertigstellung** von späteren Datenmodell-, Bedienoberflächen- und Implementierungsarbeiten. Die fünf Umsetzungsissues #260–#264 sind **nachgelagert** und begründen keine fachliche Sperre.

## Was bedeutet „Fachkonzept fertig“?

Ein fachlich fertiges Handbuch erklärt für jeden wesentlichen Arbeitsprozess verständlich:
1. **Zweck und Auslöser:** Warum gibt es die Aufgabe, wie beginnt sie?
2. **Eingaben und fachliche Begriffe:** Welche Informationen werden verwendet und wie unterscheiden sie sich?
3. **Ablauf und Ergebnis:** Was tut FIB automatisch, worüber entscheidet die Redaktion, welches Ergebnis wird gespeichert oder veröffentlicht?
4. **Geschäftsregeln und Ausnahmen:** Welche Zustände, Grenzen, Belege und fachlichen Voraussetzungen gelten?
5. **Übergaben:** Wo geht die Arbeit in den nächsten Prozess über?

Technische Tabellen, Endpunkte, Bildschirmdetails, Farben und exakte Datenbankfelder werden **nicht** zur Voraussetzung für die fachliche Abnahme erklärt. Eine später nötige fachliche Anpassung erfolgt kontrolliert am Fachkonzept.

## Bereits entschiedene Fachregeln – nicht nochmals offen stellen

- Gesamter Recherchehorizont: wissensgeleitet und offen; alle direkten Feldkirchen-Fundstellen erreichbar; erweiterte Relevanz begründen.
- Fundstellensichtung: keine verpflichtende manuelle Einzelprüfung jeder Fundstelle; alle Funde sichtbar, gezielte Prüfaufgaben bei Entscheidungserfordernis.
- KI darf vorläufige Ereignisse und Vorgänge vorbereiten; bestätigte Fakten nicht eigenmächtig überschreiben; keine automatische Veröffentlichung.
- Themendefinition redaktionell; KI schlägt Kandidaten und Teilfragen vor.
- Analyse = fachliche Auswertung von Fakten, Erklärungen, Hintergründen und Folgen bei Vorgang oder Thema, kein eigenständiger kontextfreier Wissensbestand.
- Beobachtungsauftrag nach Bedarf statt Pflicht für die Erstfreigabe eines Themas.
- Vier fachliche Arbeitsbereiche: Definition, Bezüge, Analyse, Beitrag; keine vier Pflichtfreigaben.
- Analysefreigabe ohne Thema-Statuswechsel; erste Beitragsfreigabe aktiviert Entwurf → Aktiv; Veröffentlichung gesondert.
- Öffentlicher Vorgang besitzt einen eigenen redaktionell freizugebenden Vorgangsbeitrag mit Erkenntnissen und Hintergründen.
- „Mehr wissen?“ bei Meldung, Vorgang, Thema; offene interne Wissensfragen sind davon verschieden.
- „Neues“ enthält alle veröffentlichten Meldungen; Verdichtung gleicher Vorgänge nur in der Darstellung, nicht als Datenverlust.
- RIS: Dokument/Vorlage, Behandlung und tatsächlich gefasster Beschluss getrennt.
- Schwerwiegende eindeutig belegte Sachfehler sperren Publikation, unbestätigte KI-Zweifel sind redaktionelle Hinweise.

## Noch notwendige **fachliche Dokumentationsarbeit**

| Bereich | Ausstehender Nachweis | Keine Voraussetzung |
|---|---|---|
| 01/02 Begriffe und Struktur | Endgültige Begriffsabgrenzungen in einem Primärtext; Beispielabläufe und Beziehungen konsistent | physisches DB-Schema |
| 03 Recherche | Quell- und Statusregeln vollständig in Prozesskontext integrieren; widersprechende alte Pflichtsichtung ausdrücklich ersetzen; Kennung `FIB-RECH-ABLAUF-001` auflösen | neue Recherche-Edge-Function |
| 04 Ereignisse/Meldungen | Übergabe Fundstelle → vorläufiges Ereignis → optionale Meldung samt Varianten und Prüfbedarf verständlich darstellen | neue Event-Statusspalte |
| 05 Vorgänge | Anlass, Erstanalyse, fortlaufende Aktualisierung, eigener Vorgangsbeitrag und Rückwirkung konkret durchspielen | Vorgangsbeitragstabellen |
| 06 Themen | Originalregeln und neue Analysefreigabe normativ abgleichen; Beitrag/Status/Archivierung inklusive Ausnahmen konsolidieren | vierstufige UI |
| 07 Sitzungen | Lebenslauf einer Vorlage, TOP, Behandlung und Ergebnis mit Quellen nachvollziehbar beschreiben | RIS-Scraper |
| 08 Redaktion | Zuständigkeit, Aufgabensteuerung, Sperre, Korrektorat, Freigabe, Publikation als Verfahren konsistent verknüpfen | neue Bildschirmmaske |
| 09 Öffentliches Angebot | Inhalt/Navigation/Bezug zwischen Meldungen, Vorgängen, Themen, Sitzungen und Mehr-wissen umfassend beschreiben | fertige öffentliche Website |
| 10 Qualität | Prüfarten, Grenzfälle, Beleg-/Unsicherheitskommunikation, Blocker logisch widerspruchsfrei | programmierte Prüf-Engine |
| 11 Rechte | Fachliche Matrix mit Rollen und Entscheidungen inkl. KI-Autonomie eindeutig | veränderte RLS-Policies |
| Gesamtinventur | Alle älteren fachlichen Primärabschnitte auf einen neuen Zielabschnitt oder begründeten Verbleib prüfen; Regelkennungen und Querverweise systematisch abgleichen | Regressionstests in der App |

## Prüfmethodik

- Alte Quellen **nicht stillschweigend umdeuten**; Quelle/Ziel/Nichtübernahme mit Grund vermerken.
- Was entschieden ist, als Entscheidung schreiben, nicht als erneut zu genehmigenden Vorschlag.
- Fachliche Erläuterung **vor** der zugehörigen Regelgruppe; keine reine Ansammlung von Regelkennungen.
- Regeln dort primär führen, wo der Prozess verantwortet wird. Andere Kapitel verweisen darauf.
- Statusübergänge und Rechte in nachvollziehbaren Tabellen, mit klar unterscheidbaren Entscheidungsarten.
- Jeder Prozess benötigt mindestens ein alltagsnahes FIB-Beispiel und negative Grenzfälle.

## Fortschritt: Prozessintegration und Querverweisprüfung (26.10.2026)

- **Kapitel 03:** Recherchegrundsätze, Suchraum, Relevanz, Rechercheaufträge, Quellen/Fundstellen, Referenzwissen und Qualität als verständliche Regelgruppen bei den Abläufen verankert. Detailfassungen der 53 Regeln weiterhin in der historischen Referenz; Originalkennung `FIB-RECH-ABLAUF-001` noch zu lokalisieren.
- **Kapitel 06:** Themendefinition, lokale Bezüge, Beitrag/Versionierung und Status/Rechte als fachliche Regelgruppen mit Beispielen direkt am jeweiligen Arbeitsprozess erläutert; die 32 Originalregeln bleiben vergleichbar. Analysefreigabe und erste Beitragsfreigabe sind weiterhin getrennt.
- **Kapitel 05:** Eindeutig klargestellt: Ein intern existierender Vorgang erfordert keine Publikation, besitzt für seine *öffentliche* Darstellung jedoch einen eigenständig freizugebenden Vorgangsbeitrag.
- **Kapitel 08:** Analysefreigabe, konkrete Beitragsfreigabe und öffentliche Publikation als drei getrennte redaktionelle Entscheidungen erläutert.
- **Verweiskontrolle:** Alle elf Kapitel-Leseentwürfe auf relative Markdown-Dateiverweise gegen den aktuellen GitHub-Dateibaum geprüft; **keine fehlenden Dateiziele in diesen elf Entwürfen gefunden**. Ankerziele und andere Bestandsdateien sind damit noch nicht automatisch geprüft.

**Nächste fachliche Restarbeiten:** weitere Primärquellen abschnittsweise auf Vollständigkeit prüfen, alte abweichende Normtexte nachvollziehbar konsolidieren, Kapitel 01/02/04/05/07/09/10/11 in derselben Lesbarkeit prüfen und abschließende fachliche Leseabnahme vorbereiten. Keine Implementierung im Rahmen von PR #259.

## Weitere fachliche Prozessausarbeitung vom 26.10.2026 (Abend)

Die Arbeit wurde über Kapitel 03 und 06 hinaus auf die Übergänge zwischen den Hauptprozessen ausgedehnt:

- **04 Ereignisse/Meldungen:** Entscheidungstabelle von automatischer vorläufiger Erfassung über Widerspruchsbewertung bis zur gesonderten Meldungsfreigabe; keine generelle Einzelprüfpflicht.
- **05 Vorgänge:** Interner Vorgang ohne Veröffentlichungspflicht; eigenständiger öffentlich freizugebender Vorgangsbeitrag.
- **06 Themen:** 32 Bestandsregeldefinitionen nach Themendefinition, Bezügen, Beitrag und Status im passenden Ablauf verankert.
- **07 Sitzungen:** Verfahrensbeispiel vom Beschlussvorschlag über TOP und Sitzung bis zu Abstimmungen, Niederschrift und späterer Korrektur; unterschiedliche Quellenstände sichtbar.
- **08 Redaktion:** Analysefreigabe, Beitragsfreigabe und Veröffentlichung als drei ausdrückliche, getrennte Entscheidungen.
- **09 Öffentliches Angebot:** „Mehr wissen?“ mit genau einem Primärkontext (Meldung, Vorgang, Thema), Quellen-/Antwortversions- und Freigaberegeln; ältere MVP-Einschränkung zum Vorgang ausdrücklich als fachlich geändert markiert.
- **10 Qualität:** Publikationsblockade bei nachgewiesenem schwerwiegendem Fehler gegenüber lediglich ungeklärtem KI-Verdacht in einer Entscheidungs-/Grenzfalltabelle.

**Reststatus:** Fachliche Lesefassung weiter fortgeschritten; noch keine vollständige normative Quellmigration, insbesondere bei allen historischen Detailregeln außerhalb 03/06. Keine SQL-, UI- oder Produktionsänderungen. Die gemeinsam vorzunehmende Gesamtleseabnahme folgt erst nach dem Quellabgleich.

## Erweiterung des fachlichen Kernmodells und der Rechte (26.10.2026)

- **Kapitel 02:** sieben besonders verwechslungsanfällige Begriffspaare mit fachlicher Grenzziehung und einem durchgehenden Beispiel aus Quellen-/RIS-Verarbeitung, Vorgangsanalyse und öffentlichem Angebot ergänzt.
- **Kapitel 11:** handlungsorientierte Matrix für KI, Redakteure und Administratoren ergänzt, insbesondere für vorläufige Ereignisse, bestätigte Korrekturen, Themenbezüge, Analyse-Teilfreigabe, Beitragsfreigabe, Veröffentlichung, Sperren und Benutzerverwaltung.
- **Konsistenz:** Eine Analysefreigabe macht kein Thema aktiv; allein die erste Beitragsfreigabe führt Entwurf → Aktiv, Veröffentlichung bleibt getrennt. KI erfasst vorläufige Daten, nicht automatisch verbindliche Entscheidungen.
- **Offen:** Vollständige abschnittsweise Migration der übrigen Primärquellen und finale gemeinsame Leseabnahme; Datenmodell, UI und SQL sind bewusst noch keine Abnahmevoraussetzungen.

## Wann ist die fachliche Abnahme möglich?

Nach vollendetem Quell-/Regelabgleich, widerspruchsfreien Kapiteln, referenzierten Ausnahmen, funktionierenden internen Verweisen und einer letzten **gemeinsamen Leseprüfung**. Technische Umsetzbarkeit ist anschließend Gegenstand der iterativen Entwicklungsphase.

**PR #259 bleibt bis dahin Draft.** Kein Merge, keine Änderungen an Shared-Apps oder der Redaktionsanwendung aufgrund dieses Dokuments.
