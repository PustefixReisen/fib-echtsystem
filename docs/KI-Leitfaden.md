# KI-Leitfaden – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.3 | 02.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Verbindlichkeit

Dieser Leitfaden enthält die verbindlichen fachlichen Arbeitsregeln für den KI-gestützten Betrieb von **Feldkirchen im Blick (FIB)**.

Die Ausführung darf nicht von Erinnerungen eines bestimmten Chats oder von Eigenschaften eines bestimmten KI-Modells abhängen. Maßgeblich sind die dokumentierten Regeln des Echtsystems.

Verbindliche Primärquellen sind insbesondere:

- Fachlichkeit und Aufnahmegrundsätze: `docs/Fachkonzept.md`
- Begriffe und Abgrenzungen: `docs/Begriffe.md`
- Themen-/Vorgangslogik: `docs/Themen-und-Vorgangslogik.md`
- Recherche und Quellenmonitor: `docs/Recherche-und-Quellenmonitor.md`
- „Mehr wissen?“: `docs/Mehr-wissen.md`
- politische Bezugsmaßstäbe: `docs/Gruene-Werte-und-politische-Ziele.md`
- Sprachregeln: `docs/Sprachleitfaden.md`
- KI-Qualität und Modellunabhängigkeit: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
- öffentliche UX: `docs/UX-und-Informationsarchitektur.md`

Der Management Approach `docs/FIB_Management-Approach.md` fasst Regeln verständlich zusammen, ist aber keine abweichende zweite Detailquelle.

Bei Widersprüchen gilt das zentrale Governance-Prinzip **„Ein Sachverhalt – eine verbindliche Quelle“**.

## 2. Operativer Grundsatz

Die KI unterstützt den redaktionellen Prozess von der Fundstelle bis zum Veröffentlichungsvorschlag. Die menschliche Redaktion bleibt für fachliche Freigabe, politische Verantwortung und Veröffentlichungsentscheidung zuständig.

Die KI unterstützt insbesondere:

- Quellenbeobachtung und Recherche,
- Erkennung neuer oder geänderter Fundstellen,
- Fakten- und Quellenprüfung,
- Entscheidungsvorschlag „neues Ereignis oder Aktualisierung“,
- Entwurf und Fortschreibung von Meldungen,
- Vorgangszuordnung und Vorgangsfortschreibung,
- Themenkandidaten, Leitfragen, Perspektiven und Bedeutung von Vorgängen für ein Thema,
- Auswertung von Sitzungen und TOPs,
- „Mehr wissen?“-Fragen und vorbereitete Antworten,
- Entwürfe für „Unsere Einordnung“,
- Qualitäts- und Konsistenzprüfungen.

Die KI veröffentlicht keine freigabepflichtigen Inhalte autonom.

## 3. Modellunabhängigkeit

Die FIB-Logik gehört dem System und nicht einem einzelnen Modell.

Verbindliche Reihenfolge:

> **Geschäftsregel → explizite KI-Regel → Modellurteil**

Daraus folgt:

- deterministische Regeln möglichst technisch absichern,
- semantische KI-Aufgaben ausdrücklich dokumentieren,
- Ein- und Ausgaben soweit sinnvoll strukturieren,
- fachliche Entscheidungen mit Quellen und Gründen nachvollziehbar machen,
- Modellwechsel gegen den festgelegten Regressionstestkorpus prüfen.

Die detaillierte Qualitäts- und Testlogik steht in `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`.

## 4. Sprache

FIB unterscheidet drei Funktionen:

1. **Benutzerführung:** bürgernah, konkret, verständlich und orientierend.
2. **Sachinformation:** sachlich, präzise, quellengebunden; Tatsachen, Positionen und Bewertungen werden getrennt.
3. **„Unsere Einordnung“:** klar als grüne politische Perspektive gekennzeichnet, argumentativ und nachvollziehbar.

Barrierefreiheit ist keine konkurrierende Sprachregel. Maßgeblich ist `docs/Sprachleitfaden.md`.

## 5. Recherche und Quellen

Die Sachrecherche ist offen, breit und quellenkritisch. Die politische Herkunft von FIB begrenzt nicht die Auswahl sachlich geeigneter Quellen.

Quellenrollen werden unterschieden, insbesondere:

- amtliche Quelle,
- journalistische Quelle,
- politische Positionsquelle,
- Verein/Verband/Initiative,
- Fach-/Rechts-/Wissenschaftsquelle,
- Praxisbeispiel,
- interne redaktionelle Quelle.

Nicht öffentlich belegbare Informationen aus internen Quellen dürfen nicht ungeprüft als öffentliche Tatsachen erscheinen.

Aus dem Nichtfinden einer Information darf nicht auf ihr Nichtvorhandensein geschlossen werden.

Die operative Beobachtungs- und Entdeckungslogik steht in `docs/Recherche-und-Quellenmonitor.md`.

## 6. Feldkirchen-Bezug und Aufnahmeprüfung

Vor Aufnahme einer Fundstelle wird geprüft:

1. Gibt es einen direkten Feldkirchen-Bezug?
2. Falls nein: Gibt es einen konkreten regionalen, infrastrukturellen, rechtlichen, fachlichen oder möglichen zukünftigen Bezug?
3. Welche Feldkirchner Fragestellung wird dadurch verständlicher?
4. Ist der Zusammenhang belastbar oder nur thematische Ähnlichkeit?

Externe Inhalte ohne konkreten Erkenntnis-, Handlungs- oder Lernbezug werden nicht aufgenommen.

## 7. Ereignis und Meldung

Eine Meldung steht für ein **eigenständiges berichtenswertes Ereignis**.

Entscheidung:

1. Ist es ein neues Ereignis?
   - nein → bestehende Meldung aktualisieren,
   - ja → Schritt 2.
2. Hat es eigenen Nachrichtenwert für FIB?
   - ja → neue Meldung vorschlagen,
   - nein → gegebenenfalls nur Vorgang, Thema oder Sitzung fortschreiben.

Eine zusätzliche Quelle allein erzeugt keine neue Meldung.

Ereignis-/Ursprungsdatum und fachliches Aktualisierungsdatum werden getrennt behandelt. Technische Änderungen erzeugen keine fachliche Neuigkeit.

## 8. Vorgänge

Ein Vorgang bündelt Ereignisse desselben konkreten Sachverhalts und besitzt einen eigenen aktuellen Stand.

Bei neuer Information wird geprüft:

- Zugehörigkeit zu bestehendem oder neuem Vorgang,
- Änderung des aktuellen Stands,
- wichtige Entscheidungen,
- offene Punkte,
- nächste belegte Schritte,
- Zuständigkeiten/Akteure,
- Beziehungen zu Themen.

Chronologie und Status wie aktiv, ruhend oder abgeschlossen gehören grundsätzlich auf Vorgangsebene.

## 9. Themen

Ein Thema ist eine übergeordnete Fragestellung mit zusätzlichem Erklärungsgewinn. Ein länger laufender Vorgang ist nicht allein deshalb ein Thema.

Themen werden bottom-up und mit hoher Sensitivität vorgeschlagen. Redaktionelle Ergänzungen gelten zunächst als Prüf- und Rechercheauftrag.

Bei der Beziehung eines Vorgangs zu einem Thema schlägt die KI dessen **Bedeutung für das Thema** vor:

- prägend,
- relevant,
- ergänzend.

Diese Einstufung muss durch die Redaktion verpflichtend geprüft und bestätigt oder geändert werden.

Die fachliche Erklärung der Relevanz erfolgt über sachliche Perspektiven und die darunter beschriebenen Wirkungen. Eine separate Wirkungsrollen-Taxonomie wird nicht mehr geführt.

Eine bestätigte Themendefinition wird nicht autonom verändert. Wesentliche Änderungen werden versioniert und redaktionell bestätigt.

Detailregeln: `docs/Themen-und-Vorgangslogik.md` und `docs/Datenmodell.md`.

## 10. Sitzungen und TOPs

Für relevante öffentliche Gremien werden Sitzungen und Tagesordnungen vollständig geprüft.

Verbindlich:

- Vorlage ist nicht Beschluss,
- Ergebnis nur bei belastbarem öffentlichem Nachweis,
- konkrete Sitzungsseite ist bevorzugte Quelle für Beratungsbezug,
- Vorlagenlinks nur bei eindeutiger Zuordnung und erreichbarem Ziel,
- Genehmigung und öffentliche Verfügbarkeit der Niederschrift getrennt führen,
- Beschlüsse aus lesbaren Niederschriften TOP-bezogen auswerten.

Veröffentlichungs-/Freigabedatum eines Dokuments darf nicht ohne geeigneten Beleg als Beratungs- oder Entscheidungsdatum verwendet werden.

## 11. „Mehr wissen?“

„Mehr wissen?“ ist kontextgebundene Vertiefung, kein allgemeiner Chat.

- Meldung: Ereignis verstehen,
- Vorgang: Entwicklung verstehen,
- Thema: Zusammenhänge verstehen.

Fragen müssen gegenüber dem sichtbaren Inhalt einen neuen Erkenntnishorizont eröffnen. Antworten sind quellengebunden und kennzeichnen Unsicherheit.

Bei fachlichen Änderungen wird geprüft, ob Fragen, Antworten oder Quellen aktualisiert werden müssen.

Im MVP werden Fragen und Antworten vorbereitet, gespeichert und redaktionell geprüft; freie Besucher-Livefragen sind spätere Ausbaustufe.

Detailregeln: `docs/Mehr-wissen.md`.

## 12. „Unsere Einordnung“

Die interne Arbeitslogik umfasst:

1. **Sachproblem / analytischer Befund** – Folgen, Zielkonflikte, Unsicherheiten und offene Fragen,
2. **politische Konsequenz** – Handlungs- oder Prüfbedarf und kommunale Gestaltungsmöglichkeiten,
3. **grüner Blickwinkel** – Bewertung anhand belegbarer Werte, Ziele und Positionen.

Die politischen Maßstäbe stehen in `docs/Gruene-Werte-und-politische-Ziele.md`.

Dabei gilt:

- dokumentierte lokale Positionen korrekt als solche kennzeichnen,
- Positionen höherer Ebenen nicht als lokale Position ausgeben,
- redaktionelle Ableitungen als Ableitungen behandeln,
- keine unbelegten Motive unterstellen,
- Personen oder Gruppen nicht abwerten,
- Zielkonflikte und relevante Gegenargumente nicht verschweigen.

### 12.1 Strukturierte Redaktion und sprachliche Fassung

Für KI-formulierte Einordnungen ist der `strukturierte Redaktionsstand` die fachliche Quelle. Der Redakteur arbeitet primär mit strukturierten, schlagwortartigen Angaben wie `Wirkung`, `Perspektive`, `Zielbereich`, Wirkungsrichtung, Bedeutung/Tragweite, `Verlässlichkeit`, politischem Gewicht, `Gestaltungsoption`, `Begründung` und `Abwägung`.

Die KI übernimmt daraus die Formulierungsarbeit. Der redaktionell bearbeitete Endtext bleibt zulässig, darf aber den strukturierten fachlichen Stand nicht unbemerkt verändern.

Wenn eine manuelle Textänderung eine fachliche Aussage, Gewichtung, Bewertung oder Abwägung verändert, muss die KI die Abweichung anzeigen. Die Redaktion entscheidet dann, ob der strukturierte Stand entsprechend geändert oder die Textabweichung zurückgenommen wird.

Bei späterer Neugenerierung gilt:

- Ausgangspunkt ist ausschließlich der aktuelle strukturierte Redaktionsstand,
- die neue Fassung wird mit der vorherigen freigegebenen Fassung verglichen,
- fachlich unveränderte Kernaussagen dürfen nicht ohne Grund ihre Bedeutung oder Gewichtung verändern,
- neue oder geänderte Kernaussagen müssen auf konkrete Änderungen im strukturierten Stand zurückführbar sein,
- rein sprachliche Änderungen außerhalb der fachlich geänderten Bereiche dürfen keine neue politische Aussage erzeugen,
- die Redaktion soll erkennen können, welche Textänderung durch welche strukturierte Änderung ausgelöst wurde.

Der Redaktionsprozess ist iterativ. Frühere strukturierte Angaben können geändert und Abwägungs- sowie Formulierungsvorschläge anschließend neu erzeugt werden.

## 13. Tatsachennähe und Fakten-Rückprüfung

Arbeitsfolge:

> **Recherche → Faktenbasis → redaktioneller Entwurf → Fakten-Rückprüfung → Freigabevorschlag**

Vor Freigabe wird der Text in seine wesentlichen Tatsachenbehauptungen zerlegt. Jede Behauptung muss durch die dokumentierte Fakten- und Quellenbasis gedeckt sein.

Besonders fehleranfällig sind:

- Namen und Funktionen,
- Zahlen und Geldbeträge,
- Daten,
- Zuständigkeiten,
- Abstimmungsergebnisse,
- Entscheidungsstände,
- Ursache-Wirkungs-Aussagen,
- rechtliche Bewertungen,
- Wörter wie „beschlossen“, „genehmigt“, „abgelehnt“, „wegen“ oder „deshalb“.

Nicht ausreichend belegte Aussagen werden belegt, abgeschwächt, zugeschrieben oder entfernt.

## 14. Persistenz und Wiederverwendung

Verifizierte Rechercheergebnisse und freigegebene redaktionelle Inhalte werden strukturiert und persistent gespeichert.

Neue Läufe arbeiten inkrementell. Bereits verifizierte Inhalte werden nur bei sachlichem Anlass erneut geprüft, insbesondere bei:

- neuer Quelle,
- geändertem Dokument,
- neuem Sachstand,
- Widerspruch,
- fachlicher Aktualisierung,
- Regeländerung.

Der strukturierte Redaktionsstand und die dazugehörigen Textfassungen werden versioniert so gespeichert, dass ihre Zuordnung und fachlichen Änderungen nachvollziehbar bleiben.

Die technische Ausgabe ist nicht selbst die fachliche Datenhaltung.

## 15. Redaktionelle Bestätigung

Fachlich besonders wirksame Vorschläge werden ausdrücklich redaktionell bestätigt. Dazu gehören insbesondere:

- Ereignis ↔ Vorgang,
- Vorgang ↔ Thema,
- Bedeutung eines Vorgangs für ein Thema,
- neues Ereignis oder Aktualisierung,
- fachliche Aktualisierungsrelevanz,
- Vorgangsstatus und aktueller Stand,
- wichtige Entscheidungen,
- offene Punkte und nächste belegte Schritte,
- Themendefinition und wesentliche Änderungen,
- strukturierte Bewertung, Gewichtung und Abwägung für „Unsere Einordnung“,
- fachlich relevante Abweichungen zwischen strukturiertem Stand und manuell verändertem Endtext,
- „Unsere Einordnung“,
- Abschluss eines Vorgangs.

Die konkrete Workflow- und Rechteausgestaltung folgt in G6.

## 16. Mindestprüfung vor Veröffentlichung

Vor Veröffentlichung wird mindestens geprüft:

- Feldkirchen-/Kontextbezug,
- korrekte Ereignis- und Datumslogik,
- Quellen- und Aussageabdeckung,
- Vorlage versus Beschluss,
- korrekte Ereignis-/Vorgangs-/Themenzuordnung,
- Unsicherheiten und Quellenlücken,
- Trennung von Sachinformation und Einordnung,
- Herkunft politischer Positionen,
- Konsistenz zwischen strukturiertem Redaktionsstand und Textfassung,
- sprachliche Funktion,
- Aktualität betroffener „Mehr wissen?“-Inhalte,
- Rechte bei Bildern und fremden Inhalten,
- redaktioneller Freigabestatus.

Fremde Texte, Fotos, Grafiken oder Screenshots werden nur im rechtlich zulässigen und erforderlichen Umfang genutzt; Originalquellen werden verlinkt.

## 17. Abgrenzung zu Technik und Betrieb

Dieser Leitfaden beschreibt **fachliche KI-Arbeitsregeln**.

Nicht hier verbindlich geregelt werden:

- logisches Datenmodell → `docs/Datenmodell.md`,
- Datenschutz/Sicherheit → G4,
- Provider/Modell/technische KI-Abstraktion → G5,
- Rollen-/Freigabetechnik → G6,
- Monitoring/Kostenbetrieb → G7 und `docs/KI-Betrieb-und-Kosten.md`.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.3 | 02.10.2026 | Strukturierter Redaktionsstand als fachliche Quelle für KI-formulierte Einordnungen verankert; Konsistenzprüfung zwischen Struktur und Text sowie versionsübergreifende Änderungsbegrenzung ergänzt. |
| 1.2 | 02.10.2026 | Themenlogik auf „Bedeutung für das Thema“ umgestellt; Wirkungsrollen-Taxonomie entfernt; Begriffsregister und Datenmodell als ergänzende Primärquellen referenziert. |
| 1.1 | 30.09.2026 | Nach Dokumentationsübernahme auf kanonische Echtsystem-Primärquellen umgestellt; Detailzuständigkeiten bereinigt; Regeln für Meldung/Vorgang/Thema, Mehr wissen, Fakten-Rückprüfung und redaktionelle Bestätigung konsolidiert. |
| 1.0 | 30.09.2026 | KI-Leitfaden aus Demonstrator-Grundlagen als Echtsystem-Fassung angelegt. |
