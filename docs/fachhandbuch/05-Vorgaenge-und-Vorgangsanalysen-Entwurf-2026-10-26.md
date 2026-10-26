# 05 – Vorgänge und Vorgangsanalysen (Migrationsentwurf)

| Stand | Status | Grundlage |
|---|---|---|
| 26.10.2026 | **Entwurf – keine fachliche Freigabe** | Modellerprobung 25.–26.10.; Datenmodell, Themen- und Vorgangslogik, Persistenzmodell, Fachhandbuch-Entwürfe Kap. 03/04 |

> **Normativer Hinweis:** Dieses Dokument beschreibt die neu vereinbarten Anforderungen und ihre Anknüpfung an das bestehende Fachmodell. Es ersetzt noch keine bisherigen Primärregeln. Vor einer normativen Übernahme sind Status, Rechte, Kardinalitäten, Datenmodell, Auditierung und Tests konsistent abzugleichen. Keine automatische Einführung neuer Datenbankobjekte.

## 05.1 Aufgabe und Gegenstand

Ein **Vorgang** verfolgt einen zusammenhängenden konkreten Sachverhalt über einen längeren Zeitraum. Er verbindet seine Ereignisse und die daraus gewonnenen Erkenntnisse zu einem aktuellen, nachvollziehbaren **Sachstand mit eigener Vorgangsanalyse**. Ein Vorgang ist weder eine veröffentlichte Meldung noch ein Thema. **Seine interne Existenz und fachliche Bearbeitung setzen keine Veröffentlichung voraus.** Für die öffentliche Darstellung ist jedoch ein **eigener, getrennt freizugebender Vorgangsbeitrag** vorgesehen; die Veröffentlichung bleibt eine gesonderte Entscheidung. Ein unveröffentlichter Vorgang kann somit eine gültige Analyse besitzen, ohne bereits öffentlich sichtbar zu sein.

Beispiel **„Grundstückskauf der Gemeinde Feldkirchen“**: Verhandlungsaufnahme, Vertragsabschluss und später eine Nutzungsentscheidung können verschiedene Ereignisse sein, die zur selben langfristigen Entwicklung gehören. Die Meldungen darüber sind optional und werden aus Ereignissen abgeleitet.

Die Aufgabe der Vorgangsbearbeitung besteht darin, die zeitliche Entwicklung fachlich richtig abzubilden, Hintergrund und mögliche Folgen verständlich zu untersuchen, Wissenslücken zu bearbeiten und bestätigte Erkenntnisse auch für zugehörige Themen nutzbar zu machen.

## 05.2 Gesamtmodell und Verbindungen

- **Ereignisse** beschreiben nachgewiesene Veränderungen. Ein Ereignis kann ohne Vorgang bestehen. Ein Vorgang verbindet grundsätzlich ein oder mehrere Ereignisse; die bisherige logische Kardinalität Vorgang → Ereignis `1..n` ist in `docs/Datenmodell.md` dokumentiert und vor automatischer Vorgangsanlage gegen vorläufige Bearbeitungszustände zu prüfen.
- **Fundstellen** sichern die zugrunde liegenden Informationsnachweise, einschließlich ergänzender und widersprechender Belege.
- **Vorgangsanalyse** ist ein abhängiger fachlicher Bestandteil des Vorgangs, keine unabhängig verwaltete allgemeine Wissensdatenbank.
- **Gezielte Rechercheaufträge** können aus Fragen zum Vorgang entstehen; längerfristige Form ist der Beobachtungsauftrag. Die Ergebnisse erzeugen bei Bedarf nachvollziehbare Änderungsvorschläge für die Analyse.
- **Themen** können den Vorgang als fachlichen Bezug übernehmen. Die Themenanalyse verarbeitet seine Ereignisse und Erkenntnisse, entwickelt jedoch eine eigene, übergreifende Sicht. Meldungen sind kein zusätzlicher Pfad der fachlichen Zuordnung.

Die eigenständige Analyse enthält Fakten, Erklärungswissen sowie Hintergründe, Zusammenhänge, Zielkonflikte und eine Wirkungs-/Folgenanalyse. **Eigene übergreifende Erkenntnisse und begründete Schlussfolgerungen** gehören unmittelbar zur Vorgangsanalyse und müssen nicht künstlich als Wirkung eines einzelnen Ereignisses abgelegt werden. Sie bleiben durch Belege oder nachvollziehbare Herleitungen prüfbar. Aussagen unterscheiden Belegtes, Annahmen, Unsicherheiten und offene Fragen. Das bisherige Wirkungsmodell verankert einzelne **Wirkungen fachlich an Ereignissen** und historisiert strukturierte Analysebestandteile über den **Gesamtstand** des Vorgangs bzw. Themas. Die technische Ausgestaltung neuer Analyseinhalte muss damit abgeglichen werden, statt eine konkurrierende Wirkungsstruktur anzulegen.

## 05.3 Von der Ereigniserkennung zum Vorgang

### 05.3.1 Vorgang anlegen

FIB erkennt aus Ereignissen, ob ein längerfristiger zusammenhängender Sachverhalt vorliegt. Bei eindeutigem Bedarf darf FIB einen **vorläufigen Vorgang automatisch** anlegen und die zugehörigen Ereignisse beiziehen. Eine redaktionelle Einzelbestätigung der Anlage ist nicht notwendig; vorläufige Fachzuordnungen sind nachvollziehbar. Bei unsicherer Abgrenzung recherchiert FIB zunächst im erlaubten Rahmen und legt nötigenfalls eine Entscheidungsfrage vor.

Auch die Redaktion darf aus einem bekannten Sachverhalt unmittelbar einen Vorgang anlegen. Dubletten und konkurrierende Abgrenzungen werden geprüft; künstliche Vorgänge für einmalige Ereignisse sind zu vermeiden.

**Automatische Erstanalyse:** Jeder neu angelegte Vorgang erhält eine erste Analyse auf Basis bereits vorhandener Fundstellen und Ereignisse. Diese ist **noch keine zusätzliche Erkenntnisrecherche**. Dabei entdeckte Wissenslücken dürfen zu vorgeschlagenen Fragen und gezielten Rechercheaufträgen führen. Ein neuer Auftrag wird erst durch redaktionelle Freigabe des Rechercheziels zur selbstständigen Ausführung berechtigt.

### 05.3.2 Neue Ereignisse und geänderte Sachstände

FIB prüft neue Ereignisse und Korrekturen auf die Zugehörigkeit zu bestehenden Vorgängen. Eindeutige Zuordnungen darf es vorläufig setzen; unklare Zuordnungen werden anhand vorhandenen Wissens oder freigegebener Recherche selbstständig geklärt und bei verbleibender entscheidungsrelevanter Unsicherheit vorgelegt.

**Jede fachlich relevante Sachstandsänderung löst automatisch die Auswirkungsprüfung der Vorgangsanalyse aus.** FIB prüft nicht zwingend alles neu, sondern zunächst unmittelbar betroffene Aussagen und danach mögliche Widersprüche und Folgewirkungen in anderen Bereichen. Auch die Bedeutung des Vorgangs für bestehende Themen wird auf Aktualisierungsbedarf geprüft.

Beispiel: Ein neuer Beschluss klärt die zuvor offene Grundstücksnutzung. FIB prüft, welche Aussagen der Vorgangsanalyse (Nutzungszweck, Kosten, Flächenwirkung, Folgen) überholt sind und ob betroffene Themenanalysen aktualisiert werden sollten.

## 05.4 Fragen und gezielte Recherche im Bearbeitungskontext

Ein Redakteur kann **direkt beim Vorgang eine natürlichsprachliche Nachfrage** stellen, ohne den allgemeinen Recherchebereich aufrufen zu müssen. FIB versucht die Frage zunächst aus den vorhandenen Informationen zu beantworten und zeigt Belege sowie Unsicherheiten. Erst wenn weitere Informationen erforderlich sind, bereitet FIB einen gezielten Rechercheauftrag mit geeigneten Teilfragen vor.

Mit **einer redaktionellen Freigabe** darf FIB den Auftrag innerhalb des genehmigten Ziels selbstständig ausführen, Teilfragen ergänzen und Resultate auswerten. Eine Erweiterung des Rechercheziels bedarf erneuter Genehmigung. Beobachtungsaufträge dürfen innerhalb ihres Rahmens längerfristig wiederholt werden; Aktivierung, Pausierung und Beendigung sind redaktionelle Entscheidungen.

**Fragen und Antworten bleiben beim Vorgang nachvollziehbar**, mit möglicher Verbindung zu Rechercheauftrag, Fundstellen und Analyseänderungen. Wichtige Fragen dürfen hervorgehoben werden. Nicht jede Nachfrage muss eine dauerhafte Analyseänderung erzeugen. Jede neue Antwort wird jedoch darauf geprüft, ob sie bestehende Aussagen berührt.

**Offene Fragen** werden bei neuen fachlich passenden Informationen aus der regulären Recherche und bei wesentlichen Analyseaktualisierungen erneut bewertet: beantwortet, weiterhin offen, neue Teilfragen oder veränderte Bedeutung. Dies erzeugt **nicht automatisch einen neuen ungenehmigten Rechercheauftrag**.

## 05.5 Erkenntnisse und Änderungspakete

Neue oder korrigierte Erkenntnisse aus Ereignissen, Rechercheaufträgen und redaktionellen Nachfragen können bestätigte Aussagen **ergänzen, korrigieren oder widerlegen**.

FIB legt bei Änderungsbedarf ein **zusammenhängendes Änderungspaket** vor. Es zeigt:
- Ausgangsanlass und neue Erkenntnisse;
- betroffene alte Aussagen und vorgeschlagene neue Fassung;
- Belege, Unsicherheiten und Begründung;
- mögliche Konsequenzen in anderen Analysebereichen;
- offenen Prüf- und Recherchebedarf.

Die Redaktion kann **jede einzelne Änderung** übernehmen, bearbeiten, zurückstellen oder ablehnen. Bereits freigegebene Inhalte werden nicht stillschweigend überschrieben. Ein Paket darf **teilweise abgeschlossen** werden; ungeklärte Aspekte bleiben als offener Prüfbedarf erhalten.

**Wechselseitige Auswirkungsprüfung:** Sobald eine Änderung redaktionell übernommen wird, prüft FIB ihre fachliche Bedeutung für verknüpfte Themenanalysen und bei konkretem Bezug für weitere Vorgangsanalysen. Von Themenanalysen kommende neue Erkenntnisse werden umgekehrt ebenfalls auf Relevanz für Vorgänge geprüft. Derselbe bereits verarbeitete Erkenntnisstand darf keine sich wiederholenden Änderungsketten auslösen. Vorschläge verändern andere bestätigte Analysen nie automatisch.

## 05.6 Fachliche Analyseprüfung und Freigabe

Die KI kann vorläufige Analysen eigenständig erstellen, auf neue Informationen prüfen und **Entwurfsinhalte** fortschreiben. Wenn Aussagen als fachlich bestätigte Grundlage weiterer redaktioneller Entscheidungen dienen sollen, sind sie redaktionell zu prüfen und freizugeben.

Zur Prüfung stellt FIB eine **kompakte fachliche Qualitätsbeurteilung** bereit: Beleglage, Widersprüche, Unsicherheiten und wesentliche Wissenslücken.

**Teilfreigabe:** Ausreichend belegte Inhalte können freigegeben werden, während andere als vorläufig, ungeklärt oder zurückgestellt erhalten bleiben. Freigegebene Analysen bleiben auch bei weiter aktivem Vorgang gültig, bis eine redaktionell genehmigte neue Fassung sie fortschreibt. Ein Vorgangsabschluss darf nicht mit einer Analysefreigabe verwechselt werden.

**Grenze:** Unzureichend geprüfte Aussagen dürfen nicht als gesicherte Erkenntnisse in einen öffentlichen Beitrag gelangen. Redaktionell freigegebene und hinreichend abgesicherte vorläufige Einschätzungen können nur mit erkennbarer Unsicherheit dargestellt werden, wenn die hierfür geltenden Qualitäts- und Publikationsregeln das zulassen.

## 05.6a Der Vorgangsbeitrag

**Fachlich vereinbart:** Ein öffentlich dargestellter Vorgang enthält einen eigenständigen **Vorgangsbeitrag**. Dieser ist analog zum Themenbeitrag ein redaktionell freigegebener öffentlicher Text auf Grundlage der Vorgangsanalyse – nicht lediglich ein Sachstandsbericht und keine bloße Zusammenstellung von Meldungen.

Der Vorgangsbeitrag vermittelt den aktuellen Stand, die Entwicklung, Ursachen, Hintergründe, Erklärungen, rechtliche oder fachliche Rahmenbedingungen, Wirkungen, Folgen, Zielkonflikte und offene Fragen, soweit relevant. Das Erkenntnisinteresse betrifft den konkreten Vorgang; ein Themenbeitrag erschließt dagegen den Zusammenhang verschiedener Vorgänge.

**Ablauf:** Analyse → Vorgangsbeitragsentwurf → redaktionelles Korrektorat → Freigabe einer fixierten Fassung → gesonderte Veröffentlichung. Fachlich wirksame Aktualisierungen brauchen eine neue nachvollziehbare Fassung. Analysefreigabe und Beitragsfreigabe sind getrennte Entscheidungen.

**Technisch noch zu klären:** Status- und Versionsmodell für Vorgangsbeiträge, Freigaberechte und Rücknahme; bisher sind diese Regeln für Themenbeiträge weiter ausgearbeitet. Keine stillschweigende Übernahme des Themenstatusmodells.

**„Mehr wissen?“ am Vorgang:** Der freigegebene Vorgangsbeitrag kann durch eigene weiterführende Fragen und quellengebundene Antworten ergänzt werden. Sie erklären relevante Hintergründe und Zusammenhänge, ohne den Vorgangsbeitrag nur zu wiederholen. Die Detailregeln für Vertiefungsfragen und ihre Freigabe gehören zu Kapitel 09.

## 05.7 Lebenszyklus: aktiv, ruhend, abgeschlossen, archiviert

Das bestehende logische Datenmodell nennt für Vorgänge die Status **`aktiv`, `ruhend`, `abgeschlossen`, `archiviert`**. Diese bestehenden fachlichen Begriffe bleiben zur Prüfung erhalten; der neue Entwurf führt keine weiteren Status ein.

- **Aktiv:** Der Sachverhalt wird aktuell verfolgt.
- **Ruhend:** Vorübergehend keine wesentliche Entwicklung oder Bearbeitung.
- **Abgeschlossen:** Der konkrete Sachverhalt gilt formal als beendet. **Die Redaktion entscheidet den formellen Abschluss**; FIB darf ihn vorschlagen und begründen.
- **Archiviert:** Historisch erhalten und entsprechend verwaltet; keine Löschung der Nachweise.

Bei späteren Entwicklungen darf FIB eine **Wiederaufnahme** oder die Anlage eines eigenständigen, verbundenen Vorgangs vorschlagen. Bei fachlich eindeutiger Zuordnung dürfen neue Ereignisse vorläufig verarbeitet werden; die Statusänderung eines formell abgeschlossenen Vorgangs ist gesondert auf redaktionelle Zuständigkeit abzugleichen. Frühere Ereignisse, Analysen und Quellen bleiben erhalten.

**Wichtig:** Auch bei abgeschlossenen oder archivierten Vorgängen kann ein öffentlich zugänglicher Beitrag eine dringend erforderliche fachliche Korrektur benötigen. Solche Aufgaben müssen im Dashboard angezeigt werden.

## 05.8 Anforderungen an die Bedienung

Die Vorgangsbearbeitung soll in der bestehenden Redaktionsanwendung einen **kontextbezogenen Zugang** zu Sachstand, Ereignissen, Analyse, Fragen/Antworten, Rechercheaufträgen und Änderungspaketen bieten.

Die konkrete Oberfläche ist **noch nicht abschließend festgelegt**. Insbesondere ist **kein vierstufiger Pflichtworkflow für Vorgänge** beschlossen. Die vier Arbeitsbereiche Definition–Bezüge–Analyse–Beitrag betreffen die vereinbarte künftige **Themenbearbeitung**, nicht zwingend Vorgänge.

Redaktionelle Entscheidungen werden in der gemeinsamen Aufgabenübersicht sichtbar, mit Anlass, zugehörigem Vorgang und direktem Zugang zur Bearbeitung. Berechtigte Redakteure können nicht zugewiesene Aufgaben selbst übernehmen; eine koordinierende Person kann sie zuweisen. Systemaktivitäten ohne Entscheidungsbedarf sollen nicht als eigene redaktionelle Pflichtaufgaben erscheinen.

## 05.9 Abnahmeszenarien

1. **Automatische Vorgangsanlage:** Eindeutiges Ereignis zur Aufnahme von Grundstücksverhandlungen erzeugt einen vorläufigen Vorgang und Erstanalyse, ohne nachgeschaltete zusätzliche Recherche.
2. **Ereignis ohne Vorgang:** Eine einmalige Nachricht bleibt eigenständiges Ereignis, ohne künstliche Vorgangsanlage.
3. **Sachstandsänderung:** Neuer Beschluss führt zur Analyseprüfung; direkt betroffene Aussage wird korrigiert, Folgeauswirkungen geprüft, bestätigte Fassung bleibt unverändert bis Freigabe.
4. **Nachfrage:** Redaktion fragt nach finanziellen Folgekosten; vorhandenes Wissen wird zuerst geprüft; fehlender Wissensstand führt zu einem genehmigungsfähigen Recherchevorschlag.
5. **Neue Erkenntnis:** Beobachtungsauftrag liefert neue Verkehrsprognose; Änderungspaket mit getrennt entscheidbaren Vorschlägen zu Verkehr, Lärm und Luft; offene Teilfrage bleibt erhalten.
6. **Rückkopplung:** Übernommene Vorgangsanalyse-Änderung führt zur Prüfung betroffener Themen, ohne Endlosschleifen oder automatische Überschreibung.
7. **Abschluss und spätere Entwicklung:** FIB empfiehlt formellen Abschluss; Redaktion entscheidet; neue Entwicklung löst Prüfung von Wiederaufnahme oder verbundenem neuen Vorgang aus.
8. **Alte öffentliche Meldung:** Auch nach Abschluss/Archivierung bleibt dringende Korrektur einer verknüpften öffentlichen Meldung redaktionell sichtbar.

## 05.10 Offene Konsistenz- und Lösungsfragen

1. **Status/Identität:** Wie „vorläufiger Vorgang“ auf das bestehende Vorgangsstatusmodell ohne neuen Dauerstatus abgebildet wird und wann `Vorgang → Ereignis 1..n` erfüllt sein muss, ist mit Schema und Tests abzugleichen.
2. **Analysemodell:** Neu beschlossene abhängige Vorgangsanalyse mit strukturierten Erkenntnissen, Teilfreigaben und Änderungspaketen darf nicht unkontrolliert mit der bisherigen **Ereignisverankerung einzelner Wirkungen** und der **Gesamtversionierung** kollidieren.
3. **Berechtigungen:** Fachliche Bestätigung, Teilfreigabe, Änderung von abgeschlossenen/archivierten Vorgängen sowie Reaktivierung müssen mit dem Status-/Rechtemodell abgestimmt werden.
4. **Belegbeziehungen:** Nachvollziehbarkeit einzelner Aussagen über Fundstellen, Ereignisse, Recherchefragen und ggf. Analysen anderer Objekte konkretisieren.
5. **Offene Fragen:** Erneute Prüfung bei neuen Fundstellen ohne unbeschränkte KI-Ausführung und ohne unkontrollierte Aufgabenflut.
6. **UI:** Anzeige partiell bestätigter Analysen, Änderungspakete und natürlichsprachlicher Nachfragen im Echtsystem iterativ entwickeln.
7. **Primärkapitel-Schnittstellen:** Ereignis und Meldung → Kap. 04; Themenbezug und Themenanalyse → Kap. 06; Rechercheauftrag und Beobachtung → Kap. 03; redaktionelle Aufgaben/Freigabe → Kap. 08; Qualitätsprüfung → Kap. 10; Definitionen → Kap. 02.

## Quellen

- `docs/Datenmodell.md`, insbesondere §3.1–3.4, §4 und §6–7
- `docs/Themen-und-Vorgangslogik.md`, besonders §2 und §5
- `docs/Persistenz-und-Lebenszyklusmodell.md`, besonders §§3–4, 7–9 und 11
- `docs/fachhandbuch/03-Recherche-Neufassung-Entwurf-2026-10-26.md`
- `docs/fachhandbuch/04-Ereignisse-und-Meldungen-Entwurf-2026-10-26.md`
- Fachdialog/Modellerprobung 25.–26.10.2026
