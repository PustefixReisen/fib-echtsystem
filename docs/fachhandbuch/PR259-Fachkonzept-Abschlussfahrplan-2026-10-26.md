## Bildverwaltung: Quelltransfer (27.10.2026)

Die vorhandenen Festlegungen aus `docs/Visuelle-Identitaet-und-Bildkonzept.md` §14 wurden in Kapitel 08 (Bildbibliothek, Primärzuordnungen, weitere geeignete Nutzungen, Nutzungsausschlüsse, Einzelprüfung, Rechte und Freigaben) und Kapitel 09 (öffentliche Bildunterschriften, Nachweise, Alternativtexte, sachgerechte Darstellung) explizit eingearbeitet. Die optionale Funktion „Mehr zum Bild“ bleibt **nicht beschlossen für das MVP**.

Für das spätere eigenständige Administrationskonzept sind die Bestandsverwaltung der Bildbibliothek und übergreifende Metadatenpflege vorzusehen. Eine konkrete Admin-Oberfläche oder neue Bildfreigabe-Rolle wird damit nicht vorweggenommen. Einzelne Rechte- und Statusregeln der bisherigen Primärquelle bleiben bis zur normativen Gesamtprüfung verbindlich.

## Regelkennungen: erster konkreter Einzelnachweis (27.10.2026)

Die [Migrationsmatrix](PR259-Regelkennungen-Migrationsmatrix-2026-10-26.md) unterscheidet nun anhand von vier tatsächlich geprüften Originalkennungen zwischen **fachlich überholtem Originalwortlaut**, **inhaltlicher Abbildung in neuen Kapiteln** und **nicht aufgelöster Kennung**. Wichtigster offener Normwechsel ist die ausdrücklich beschlossene Ablösung der Pflicht-Einzelsichtung in `FIB-RECH-SICHTUNG-001`. `FIB-RECH-ABLAUF-001` wurde am 27.10. in Kapitel 03 (Bestand), Zeile 487 als eigenständiger Regelabsatz gefunden; die Übernahme in die endgültige Regelreferenz bleibt nachzuweisen. Die Prüfung der übrigen Regelkennungen ist damit **nicht** als erledigt ausgewiesen.

## Quelltransfer: Fachliche Persistenz (27.10.2026)

Kapitel 02 erläutert jetzt aus `docs/Persistenz-und-Lebenszyklusmodell.md` §§2–12 die stabilen Identitäten, das Verbot spurlosen Löschens bestätigter Objekte und wirksamer Beziehungen, die Trennung von historisch dokumentierten Sachverhalten und technischen Betriebsdaten, die Herkunft von Fundstellen auch bei ausgefallenen URLs sowie die Historisierung von Analysen über bestätigte Gesamtstände gemäß F-03.

Die Einzelprüfung sämtlicher Status- und Übergangsregeln der Fachobjekte bleibt bis zur normativen Gesamtabnahme gesondert nachzuweisen.

## Quellabgleich Kapitel 11: Benutzer und Rechteentzug (27.10.2026)

Kapitel 11 integriert nun zusätzliche fachliche Vorgaben aus `docs/Rollen-Rechte-und-Workflow.md` §§9–9.2: interne Einladung ohne Selbstregistrierung, Benutzerdeaktivierung vor Löschung mit Historienprüfung, zeitnahe serverseitige Wirksamkeit von Rollenentzug, erneute Berechtigungsprüfung vor S2-/S3-Handlungen sowie die Trennung von Federführung, Bearbeitungssperre und tatsächlicher Rollenberechtigung. Die Auditpflicht für Administratoren bei Aufhebung fremder verwaister Sperren bleibt erhalten.

Dies ist ein Teilabgleich; die Gesamtmigration und Leseabnahme sind noch nicht abgeschlossen.

## Quellabgleich: Fakten-Rückprüfung (27.10.2026)

Kapitel 10 enthält jetzt die konkrete Rückprüfung wesentlicher Aussagen einer Textfassung gegen bestätigte Fakten und Fundstellen gemäß `docs/KI-Leitfaden.md` §§13 und 16. Besonders geprüft werden Beträge, Daten, Abstimmungsergebnisse, Entscheidungsstände, Zuständigkeiten, Kausalbehauptungen und rechtliche Zuschreibungen. Unbelegte Aussagen müssen belegt, abgeschwächt, zugeschrieben oder entfernt werden. Ein Abnahmebeispiel unterscheidet eine bloße Beschlussvorlage von einer tatsächlich nachgewiesenen Entscheidung.

Die vollständige normative Inventur aller Primärquellen und die abschließende gemeinsame Leseabnahme stehen weiterhin aus.

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

## Prozessdurchlauf Kapitel 05 (26.10.2026)

**Kapitel 05** führt einen vollständigen exemplarischen Vorgang von der ersten Fundstelle über vorläufige Vorgangsanlage, automatische Erstanalyse, Fragen und nachweisbaren Beschluss bis zu Änderungspaketen, gesonderter Beitragsfreigabe/Publikation und späterer Fortschreibung. Darin wird ausdrücklich gezeigt, **wo keine manuelle Einzelentscheidung nötig ist** und wo redaktionelle Freigabe erforderlich bleibt. Das Grundstückskaufbeispiel ist hypothetisch und keine Tatsachendarstellung. Noch offen bleiben vollständiger Quellregelabgleich und gemeinsame Gesamtleseabnahme.

## Primärquellenabgleich: Medienfreigabe und Plausibilität (26.10.2026)

- Bestandsquelle `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md` §§2–8 gegen Kapitel 10 geprüft.
- In Kapitel 10 ergänzt: **Beitragsfreigabe ist keine Dokument-/Bildfreigabe**; öffentliche Dateien benötigen positiv geklärte Rechte; konkrete Bildverwendung braucht eigene Prüfung; S3-Bestätigung und Audit bleiben erforderlich.
- Beispiel RIS: öffentlich abrufbare PDF ist nicht schon zur erneuten Veröffentlichung durch FIB freigegeben.
- Die detaillierte Quelle bleibt bis zur vollständigen Übernahme aller ihrer Status- und Entscheidungsregeln verbindlich. Kein produktiver Medienzugriff geändert.

## Abgleich mit dem bestehenden Redaktionsworkflow (26.10.2026)

Die Primärquelle `docs/Redaktionsworkflow.md` wurde hinsichtlich der Abschnitte zu kontextbezogenen Entscheidungsfragen, Transparenz, KI-Begründungen, Prüfkriterien, Rücksprüngen sowie Bildredaktion gesichtet. In **Kapitel 08** wurden übernommen:

1. Gemeinsame Bearbeitung redaktioneller Eingaben und KI-Vorschläge unter erkennbarer Herkunft, Belegen und Unsicherheit.
2. Nachvollziehbare Prüfung statt verdeckter KI-Vorauswahl oder abstrakter Formularsprache.
3. Rückkehr zu früheren Bearbeitungsschritten ohne stillschweigende Überschreibung bestätigter Angaben.
4. Gesonderte Bildredaktion: fachliche Eignung, Nutzungsrechte, Alt-Text, Bildunterschrift, Eignung nach Inhaltsänderung und nachvollziehbarer Bildwechsel.

**Offen:** Vollständige Abschnitts-/Regelzuordnung der übrigen Primärdokumente; diese Sichtung darf nicht als abgeschlossene Gesamtmigration gelten.

## Quelltransfer: Öffentliche Suche und Aktualitätsanzeige (26.10.2026)

Aus `docs/UX-und-Informationsarchitektur.md` wurden in Kapitel 09 die verbindlichen fachlichen Anforderungen zur Suche mit Alias-/Beziehungslogik, verständlichen Filtern einschließlich Beteiligung, lokaler Neuigkeitsanzeige ohne Anmeldung, optionalem Push/Badge, teilbaren Direktlinks, zielgenauer Aktualisierungsanzeige, Druckausgabe und inhaltsnahem Transparenzzugang übernommen. Die Gestaltung der Oberfläche und technischen PWA-Mechanismen bleiben offen.

**Nicht als erledigt vermerkt:** Andere UX-Detailanforderungen (Bildsprache, einzelne Seitenelemente, responsive Bedienung und spezifische Listenregeln) müssen noch Abschnitt für Abschnitt einer Fachregel oder späteren UI-Gestaltungsaufgabe zugeordnet werden.

## Fachentscheidung F-01: Terminierte Veröffentlichung (26.10.2026)

**Abgeschlossen:** Die Redaktion bestätigt die automatische Veröffentlichung bei der Terminierung ausdrücklich für **eine bestimmte freigegebene Fassung und einen bestimmten Termin**. Vor tatsächlicher Ausführung prüft FIB Rechte, Freigabe, Fassungsidentität und übrige Voraussetzungen erneut. Entfallen Voraussetzungen, wird nicht veröffentlicht; die Redaktion erhält einen Hinweis. Eine geänderte Fassung oder ein geänderter Termin benötigt eine erneute Bestätigung. Die allgemeine alte S3-Regel ist nur für diese terminierte Spezialhandlung anzupassen; andere S3-Aktionen bleiben geschützt.

**Nachgeführt in Kapitel 08 und 11** sowie in der Restkonfliktliste. Fachlich offen bleiben F-02 und F-03; die übrige vollständige Quellmigration und gemeinsame Abnahme stehen noch aus.

## Fachliche Harmonisierung F-02/F-03 (26.10.2026)

- **Vorgang (Kapitel 05):** Vorläufige KI-Anlage setzt im beschriebenen Regelfall mindestens ein identifiziertes Ereignis voraus; dieses darf noch vorläufig sein. Eine ereignislose Vorgangsanlage ist damit nicht bereits genehmigt.
- **Vorgangs- und Themenanalyse (Kapitel 05/06):** Bestätigte Aussagen, noch offene Vorschläge und zurückgestellte Inhalte bleiben voneinander unterscheidbar; die bestehende Historisierung des bestätigten Gesamtstands wird beachtet.
- **Weiterhin fachlich offen:** Exakte Definition der gültigen Gesamtfassung nach einer Teilfreigabe (F-03). Bei F-02 nur eine mögliche, bisher nicht beschlossene Ausnahme von der Mindestbeziehung. F-01 ist abgeschlossen.
- **Keine Umsetzung vorgezogen:** Keine neuen Tabellen, Rollen, UI-Schritte oder automatischen Publikationen.

## Fortsetzung: F-03 und KI-Kalibrierung (26.10.2026)

- **F-03 entscheidungsreif, nicht eigenmächtig beschlossen:** konkrete vorgeschlagene Teilfreigaberegel mit Prüffall A+B bestätigt, C zurückgestellt; Historie auf Ebene der bestätigten Gesamtstände. Die noch nötige fachliche Leseentscheidung ist in der [Restkonfliktliste](PR259-Fachliche-Restkonflikte-und-Entscheidungsstand-2026-10-26.md) beschrieben.
- **Kapitel 06 ergänzt:** Redaktionell angenommene, abgeänderte und verworfene Vorschläge sowie korrigierte Bedeutungseinstufungen dienen als nachvollziehbare Grundlage für künftige FIB-spezifische KI-Vorschläge; keine automatische Übernahme als verbindliche Entscheidung. Ursprungsregel: `docs/Themen-und-Vorgangslogik.md` §7.
- **Dateiverweise:** Relative Markdown-Dateilinks der elf Kapitelleseentwürfe gegen den aktuellen Branch-Dateibaum erneut geprüft, **keine fehlenden Dateiziele**. Inhalts-/Anker- und normative Vollständigkeitsprüfung bleiben gesondert offen.

## Themenauswahl und Perspektiven: weiterer Quelltransfer

Aus `docs/Themen-und-Vorgangslogik.md` §§5.1–5.5 wurde in Kapitel 06 ergänzt:

- KI-Vorauswahl weiterer Ereignisse mit **jederzeitiger Suche im gesamten Ereignisbestand** als redaktionellem Sicherheitsnetz.
- Ereignisse ausgewählter Vorgänge automatisch berücksichtigen, ohne zusätzliche Vorgangszuordnung oder doppelte Gewichtung.
- Meldungen und Vorgangsverdichtungen als **Analysekontext**, nicht als neue unabhängige Tatsachenbelege behandeln.
- Perspektiven aus **allen bestätigten Bezügen** eines Themas entwickeln und redaktionell prüfen; danach Ereignisse/Vorgänge und Wirkungen zuordnen.
- Frühere fünf Rollenbezeichnungen nicht als konkurrierende fachliche Skala wiedereinführen.

Die konkrete Auswahl- und Dialogoberfläche bleibt der späteren iterativen UI-Phase vorbehalten. Der Regelbestand der anderen Primärquellen ist weiterhin im Migrationsabgleich.

## Quelltransfer Sitzungs- und Beschlussmodell (26.10.2026)

In Kapitel 07 wurden die fachlichen Detailregeln aus `docs/Sitzungs-und-Beschlussmodell.md`, Abschnitte 4–8, weiter integriert: TOP-Verfahrensstatus unabhängig von Abstimmung, mehrfache TOP-/Ereignisbezüge, keine vorzeitigen Beschlusspunkte aus Vorlagen, Fassung und Abstimmung, redaktionelle Pflichtprüfung unsicherer Zuordnungen sowie Trennung der Niederschriftgenehmigung von deren Dokumentverfügbarkeit.

**Offen:** Noch nicht jede historische Quellenregel ist normativ inventarisiert; insbesondere der verbleibende Quellabgleich zu Öffentlichkeitsdarstellung und anderen Primärquellen ist bis zur Abnahme nachzuführen.

## Ergänzender Abgleich Kapitel 07: Öffentliches Sitzungsangebot

Aus `docs/Sitzungs-und-Beschlussmodell.md` §§9–11 sind die abgeleiteten Navigationsbeziehungen Meldung → Ereignis → TOP/Sitzung und TOP → Ereignis → Vorgang/Thema in Kapitel 07 übertragen. Die öffentliche Beschlussansicht stellt den tatsächlichen Beschluss in den Vordergrund und lässt den ursprünglichen Vorschlag zum Vergleich zugänglich. Eine zusätzliche eigenständige Fachzuordnung von Meldungen zu Sitzungen oder TOPs wird ausgeschlossen.

Die bislang pauschal als fehlend bezeichneten TOP-, Fassungs- und Niederschriftregeln sind jetzt im Fachkapitel prozessorientiert erläutert. **Die Einzelinventur auf Ebene jeder bisherigen Detailaussage bleibt dennoch offen**; der Leseentwurf ersetzt die Primärquelle noch nicht.

## Quellabgleich Kapitel 04: Zeitliche Logik (27.10.2026)

Kapitel 04 erläutert jetzt aus `docs/Fachkonzept.md` §7 den Unterschied zwischen ursprünglichem Ereignisdatum, fachlichem Aktualisierungsdatum und technischen Bearbeitungen. Eine rein technische Änderung zählt nicht als fachliche Neuigkeit. Fachlich wesentliche Ergänzungen bleiben mitsamt dem ursprünglichen Ereigniszeitpunkt nachvollziehbar und können die öffentliche Neuigkeitsanzeige auslösen. Damit ist die fachliche Grundlage für die Regeln in Kapitel 09 verknüpft.

**Noch offen:** Die Einzelinventur der übrigen Primärregeln, Status- und Rechtebedingungen und gemeinsame Leseabnahme. F-01 und F-03 sind bereits fachlich entschieden; weitere Technik-/Schemafragen gehören in den folgenden Umsetzungsabschnitt.

## Wann ist die fachliche Abnahme möglich?

Nach vollendetem Quell-/Regelabgleich, widerspruchsfreien Kapiteln, referenzierten Ausnahmen, funktionierenden internen Verweisen und einer letzten **gemeinsamen Leseprüfung**. Technische Umsetzbarkeit ist anschließend Gegenstand der iterativen Entwicklungsphase.

**PR #259 bleibt bis dahin Draft.** Kein Merge, keine Änderungen an Shared-Apps oder der Redaktionsanwendung aufgrund dieses Dokuments.


## F-03: Beschluss in den Fachkapiteln umgesetzt (26.10.2026)

Die verbindlich beschlossene Gesamtstandsregel ist jetzt in Kapitel 05 (Vorgangsanalysen), Kapitel 06 (Themenanalysen) und Kapitel 08 (redaktioneller Freigabeprozess) eingetragen. Der separate [F-03-Beschluss](PR259-F03-Beschluss-2026-10-26.md) ist der Entscheidungsnachweis. Offene Änderungsvorschläge werden nicht Teil des gültigen bestätigten Gesamtstands. Verbleibende Aufgaben betreffen Detailmigration und technische Ausgestaltung, nicht die fachliche Grundentscheidung.
