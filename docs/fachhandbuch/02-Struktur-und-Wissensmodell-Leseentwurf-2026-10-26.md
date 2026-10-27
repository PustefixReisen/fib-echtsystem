# 02 – Strukturmodell und Wissensmodell (Leseentwurf)

**Stand:** 26.10.2026 · **Status:** Zur fachlichen Durchsicht, keine normative Ablösung des bisherigen Datenmodells.

## 02.1 Wozu FIB die Informationen strukturiert

FIB beobachtet Entwicklungen, gewinnt und prüft Erkenntnisse und bereitet ausgewählte Inhalte zur Veröffentlichung auf. Dafür muss das System unterscheiden zwischen **Quellen und ihren Aussagen**, **Geschehen in der Wirklichkeit**, **längerfristigen Sachverhalten**, **übergreifenden Fragestellungen**, **Analysen** und **öffentlichen Beiträgen**.

Das folgende Modell zeigt die fachlichen Gegenstände und ihre wesentlichen Beziehungen. Es beschreibt **keine Datenbanktabellen** und **keinen starren Ablauf**: Nicht jeder Fund wird ein Ereignis, nicht jedes Ereignis eine Meldung und nicht jede Erkenntnis stammt aus genau einem Ereignis.

## 02.2 Fachliches Strukturmodell auf einen Blick

```mermaid
flowchart TB
  subgraph INF["Quellen und Recherche"]
    RIS["RIS Feldkirchen (Quellsystem)"]
    Q["Weitere Quellen"]
    F["Fundstellen / Dokumente"]
    RIS -->|"Beschlussvorlagen, Niederschriften, Anlagen"| F
    Q --> F
  end
  subgraph RAT["Sitzungen und Beschlüsse"]
    S["Sitzung"] --> TOP["Tagesordnungspunkt (TOP)"]
    TOP --> BS["Beschluss / Beschlusspunkte"]
  end
  RIS -->|"Sitzungsdaten"| S
  F -->|"Vorlage / Niederschrift als Nachweise"| TOP
  subgraph W["Fachlicher Wissenskern"]
    E["Ereignis"]
    V["Vorgang"] --> AV["Vorgangsanalyse"]
    T["Thema"] --> AT["Themenanalyse"]
    E <-->|"mindestens 1 Ereignis je Vorgang"| V
    V <-->|"0 bis viele"| T
    E <-->|"zusätzlicher Bezug"| T
  end
  F -->|"belegt Ereignis (z. B. Vorlage oder Niederschrift)"| E
  TOP <-->|"Behandlung / Beschlussereignisse"| E
  BS -.->|"belegte Beschlussereignisse"| E
  AV -.->|"Erkenntnisbeitrag"| AT
  AT -.->|"Rückfragen / neue Zusammenhänge"| AV
  subgraph PUB["Öffentliches FIB-Angebot: freigegebene Informationen"]
    M["Meldungen"]
    OV["Vorgangsübersicht und Verlauf"]
    OT["Themenbeiträge und Themenübersicht"]
    OS["Sitzungs- und Beschlussansicht"]
  end
  E -->|"0 oder 1 Meldung"| M
  V -.->|"Vorgangsbeitrag und Verlauf"| OV
  AV -.->|"Grundlage des Vorgangsbeitrags"| OV
  T -.-> OT
  AT -.->|"freigegebener Beitrag"| OT
  S --> OS
  TOP --> OS
  BS --> OS
```

**Wichtig:** Das öffentliche FIB-Angebot ist **kein einzelnes Datenobjekt**, sondern der Zweck und die Besuchersicht des Systems: Meldungen, Vorgänge, Themen sowie Sitzungen und Beschlüsse sind miteinander navigierbar. Öffentliche Vorgangsansichten enthalten einen redaktionell freigegebenen **Vorgangsbeitrag** auf Grundlage der Analyse sowie den Verlauf. Das RIS ist ein externes Quellsystem; Sitzung, TOP und Beschluss sind eigene fachliche Objekte in FIB, nicht nur gewöhnliche Fundstellen.

**Leseschlüssel:** Durchgezogene Linien zeigen stabile fachliche Grundbeziehungen. Gestrichelte Linien zeigen mögliche Erkenntnis-, Recherche- und Bearbeitungsbezüge. Die Bezeichnung `0 bis viele` meint optionale Mehrfachbeziehungen, nicht automatisch bestätigte Zuordnungen. Abweichend gilt für den Vorgang mindestens ein identifiziertes Ereignis, das bei vorläufiger Anlage selbst vorläufig sein darf (F-02). Meldungen sind eigene redaktionelle Darstellungen, nicht die Grundlage der Vorgangs- und Themenanalyse.

### Die Objekte in Alltagssprache

| Objekt | Aufgabe | Beispiel |
|---|---|---|
| **Quelle** | Herkunft von Informationen | Gemeinderats-RIS, Presse, Fachbehörde |
| **Fundstelle** | konkrete auffindbare Information bzw. Dokument mit Nachweis | Beschlussvorlage, Presseartikel, Fachstudie |
| **Ereignis** | sachlich relevante Entwicklung | Gemeinde fasst einen Beschluss |
| **Meldung** | optionaler öffentlicher Bericht über genau ein Ereignis; ein Ereignis hat höchstens eine zugehörige Meldung, spätere Folgemeldungen beruhen auf eigenen Folgeereignissen | Kurzmeldung zum Beschluss |
| **Vorgang** | länger andauernder konkreter Sachverhalt, verbindet Ereignisse | Parkraumkonzept Feldkirchen |
| **Vorgangsbeitrag** | freigegebener öffentlicher Erkenntnistext über Sachstand, Hintergründe, Erklärungen, Wirkungen und offene Fragen | Öffentliche Erklärung zum Autobahnkreuz-Umbau |
| **Vorgangsanalyse** | erklärt und bewertet den überprüfbaren Sachstand eines Vorgangs | Ziele, Ursachen, Wirkungen, Unsicherheiten |
| **Thema** | übergreifende Fragestellung mit eigenen Erkenntniszielen | Mobilität in Feldkirchen |
| **Themenanalyse** | verknüpft Erkenntnisse aus Vorgängen, Belegen und Hintergrundwissen; gewinnt eigenständige Schlüsse | Wechselwirkungen verschiedener Verkehrsprojekte |
| **Themenbeitrag** | redaktionell ausgewählte, öffentliche Darstellung auf Grundlage der Themenanalyse | Bürgernaher Überblick mit optionaler Einordnung |

## 02.2a Dauerhafte Identität und nachvollziehbare Beziehungen

FIB unterscheidet einen **fachlich gültigen Stand** von seiner Änderungsgeschichte. Bestätigte Objekte und Beziehungen verschwinden nicht spurlos, wenn sie später zurückgenommen, zusammengeführt, archiviert oder ersetzt werden. Ihre früheren Stände und Gründe bleiben nachvollziehbar. Technisch gelöscht werden dürfen grundsätzlich nur noch nie fachlich wirksame Zwischenstände oder technische Dubletten.

**Stabile Identitäten** benötigen insbesondere Ereignisse, Meldungen, Vorgänge, Themen, Sitzungen, TOPs, Fundstellen, Beobachtungsaufträge, Rechercheläufe und Vertiefungsinhalte. Auch die Historie wirksamer Beziehungen wie Ereignis–Vorgang, Vorgang–Thema, TOP–Ereignis und Recherchelauf–Fundstelle muss nachvollziehbar bleiben.

**Nicht jeder Fachgegenstand benötigt eigene Lebenszyklusstatus.** Beispielsweise sind Beschlusspunkte, Abstimmungen, Rechercheläufe, Perspektiven und Wirkungen keine selbstständig zu archivierenden Vorgänge. Analysebestandteile werden über den bestätigten Gesamtstand ihres Vorgangs oder Themas historisiert; die beschlossene Teilfreigabe F-03 erzeugt bei Annahme einzelner Änderungen einen neuen solchen Gesamtstand.

Eine nicht mehr erreichbare Internetadresse ist **kein Löschgrund** für eine Fundstelle. Fachliche Existenz, aktuelle Erreichbarkeit, vorhandene Kopie und Rechte zur öffentlichen Bereitstellung sind zu unterscheiden. Eine erfolglose erneute Recherche entwertet frühere bestätigte Nachweise nicht.

**Archivierung** erhält Identität, Beziehungen und Historie. Sie darf nicht an die Stelle einer fachlich gebotenen Korrektur oder Rücknahme treten. Technische Caches und temporäre Betriebsdaten unterliegen anderen Aufbewahrungsregeln als fachlich relevante Informationen.

Quelle: [Persistenz- und Lebenszyklusmodell](../Persistenz-und-Lebenszyklusmodell.md), §§2–12. Die konkrete Datenspeicherung wird erst nach der Fachkonzept-Abnahme gestaltet.

## 02.2b RIS als Quellsystem und eigenständiger Sitzungsbereich

**Fachliche Aufgabenteilung:** Das RIS wird wie andere Quellen durch die **gemeinsame Recherche** laufend auf neue oder geänderte Inhalte beobachtet (Kapitel 03). Die anschließende fachliche Erschließung von Sitzungen, TOPs, Beschlussvorschlägen, tatsächlichen Beschlüssen und Abstimmungen erfolgt als **eigenständiger Sitzungs- und Beschlussprozess** (Kapitel 07). Die öffentliche Besuchersicht gehört in Kapitel 09. Es entsteht **keine zweite unabhängige RIS-Rechercheinfrastruktur**.

Im bisherigen Fachmodell sind **Sitzung, Tagesordnungspunkt (TOP), Beschlussvorschlag, Beschlusspunkt, Beschlussfassung, Abstimmung und Niederschrift** bereits ausdrücklich definiert. Die Vorlage ist als Dokument eine Fundstelle; deren Veröffentlichung kann ein Ereignis auslösen. Die spätere Beratung und ein tatsächlicher Beschluss sind davon getrennte Ereignisse. Aus diesen Beziehungen ergeben sich die Navigationswege **Sitzung → TOP → Ereignis → Vorgang/Thema** und zurück. Grundlage: `docs/Sitzungs-und-Beschlussmodell.md`.

Die öffentliche Ansicht sollte erkennbar machen, wie ein Beschluss zu einem laufenden Vorgang gehört und welche Entwicklung ihm vorausging. Auch ein Vorgang soll von seiner öffentlichen Übersicht zu verbundenen Meldungen, Sitzungen, Quellen und Themen führen können. Bereits im bestehenden Navigationskonzept sind **Meldungen, Vorgänge, Themen und Sitzungen** als eigenständige Inhaltsbereiche vereinbart. Die genaue Gestaltung und die notwendige öffentliche Freigabe der Vorgangsinhalte sind in Kapitel 09 noch zu präzisieren.

### Öffentlichkeitslogik: Meldung und Vorgang

**Fachlich vereinbart am 26.10.2026:** Eine veröffentlichte Meldung, die zu einem Vorgang gehört, wird **nicht ausschließlich im Vorgang versteckt**. Sie ist über die aktuelle Meldungsübersicht auffindbar und zugleich im chronologischen Verlauf der öffentlichen Vorgangsansicht eingebunden. Das ist **eine Meldung mit zwei Zugangswegen**, keine Verdoppelung des Datensatzes; die Beziehung wird über Meldung → Ereignis → Vorgang abgeleitet. Mehrere Meldungen desselben Vorgangs können in der aktuellen Übersicht zugunsten der Übersichtlichkeit gruppiert werden. Die konkrete öffentliche Listen- und Gruppierungslogik wird erst bei der UI-Konzeption des Benutzer-Systems in Kapitel 09 festgelegt.

### RIS: Ausgangsinformationen, Fundstellen und FIB-Objekte

Das externe **RIS** liefert einerseits **Sitzungsdaten** (Sitzung, Gremium, TOP/Agenda), andererseits **Dokumente als Fundstellen** (Beschlussvorlage, Niederschrift, gegebenenfalls weitere Unterlagen). Die strukturierten FIB-Objekte **Sitzung, TOP, Beschlusspunkt und Abstimmung** beruhen auf diesen nachgewiesenen Angaben.

- **Beschlussvorlage:** Fundstelle; ihre Veröffentlichung ist gegebenenfalls ein eigenes Ereignis, **nicht** der später tatsächlich gefasste Beschluss.
- **Niederschrift:** Fundstelle der Sitzung, aus der FIB die tatsächliche TOP-Behandlung, abgestimmte Beschlussfassung und Abstimmungsergebnisse erschließt. Diese Informationen gehören zu entsprechenden Behandlungs-/Beschlussereignissen.
- **Öffentliche Sitzungs-/Beschlussansicht:** stellt Sitzung, TOP, tatsächlich beschlossenen Text, Abstimmung, Beziehung zu Vorgang/Thema und den Originalvorschlag zusammen. Eine Datei wird nicht allein aufgrund ihrer Auffindbarkeit im RIS von FIB erneut öffentlich bereitgestellt; dafür gelten die bestehenden Rechteprüfungen.
- **Navigation:** Sitzung → TOP → Ereignis → Vorgang/Thema und zurück. Öffentliche Meldungsbezüge werden über das Ereignis abgeleitet, nicht als eigenständige doppelte Zuordnung an TOP oder Sitzung gespeichert.

**Fundstellen sind Belege, keine doppelt geführte Sitzungsinformation.** Insbesondere die Beschlussvorlage und die Niederschrift sowie gegebenenfalls Anlagen sind eigenständige Fundstellen. Ihre Inhalte werden einmal als Dokumentnachweis erfasst und daraus zusätzlich für die Sitzungs-/Beschlussansicht fachlich erschlossen. Sitzungsdatum, Gremium und TOP-Nummer werden als strukturierte Merkmale der Sitzungsobjekte geführt; sie müssen nicht als künstliche weitere Fundstellen verdoppelt werden. Auch eine RIS-Webseite kann Fundstelle sein, sofern sie als konkreter Nachweis einer Aussage verwendet wird. Verweise zu den Originalfundstellen bleiben nachvollziehbar; öffentliches Wiederbereitstellen der Dateien verlangt eine gesonderte Rechteprüfung.

Die Linien zu Sitzung und TOP im Diagramm sind deshalb bewusst **durchgezogen**, wo das RIS strukturierte Sitzungsdaten liefert und Dokumente den TOP belegen. Das ist eine fachliche Informationsherkunft, keine Behauptung, dass FIB jede RIS-Information unverändert übernehmen darf.

### Fachliche Begriffsgrenzen für Entscheidungen und Analysen

Die Objekte sind nicht allein nach ihrer Darstellung zu unterscheiden, sondern nach ihrer **fachlichen Funktion**. Die folgenden Grenzen gelten über die Kapitel hinweg; die jeweiligen Arbeitsabläufe werden in den zuständigen Kapiteln erklärt.

| Begriffspaar | Fachliche Abgrenzung |
|---|---|
| **Fundstelle / Ereignis** | Die Fundstelle ist ein nachweisbarer Informationsinhalt samt Herkunft; das Ereignis beschreibt das tatsächliche Geschehen. Mehrere Fundstellen können ein Ereignis belegen, eine Fundstelle kann mehrere Ereignisse betreffen. |
| **Ereignis / Meldung** | Das Ereignis kann unabhängig von einer Veröffentlichung bestehen. Die Meldung ist eine bewusst freigegebene öffentliche Darstellung eines Ereignisses und keine zusätzliche unabhängige Tatsachenquelle. |
| **Vorgang / Thema** | Ein Vorgang verfolgt einen konkreten zusammenhängenden Sachverhalt; ein Thema beantwortet eine übergreifende Leitfrage und verbindet dafür gegebenenfalls mehrere Vorgänge und ergänzende Ereignisse. |
| **Analyse / Beitrag** | Die Analyse ist der interne, nachvollziehbare fachliche Erkenntnisstand; der Vorgangs- oder Themenbeitrag ist eine für Besucher ausgewählte und gesondert freigegebene Darstellung daraus. |
| **Wirkung / übergreifende Erkenntnis** | Eine konkrete nachgewiesene oder begründet erwartete Wirkung eines Ereignisses ist diesem zuordenbar. Eine analytische Schlussfolgerung über mehrere Ereignisse oder Vorgänge gehört ohne künstlichen Ereignisanker in die jeweilige Analyse. |
| **Offene Frage / „Mehr wissen?“-Frage** | Eine offene Frage dokumentiert internen Erkenntnis- und Recherchebedarf. „Mehr wissen?“ ist eine öffentliche, beantwortete und freigegebene Vertiefungsfrage bei Meldung, Vorgang oder Thema. |
| **Vorläufig / bestätigt / freigegeben / veröffentlicht** | Vorläufig beschreibt unverbindliche KI-Vorarbeit, bestätigt eine fachliche Entscheidung, freigegeben eine bestimmte Analyse-/Beitragsfassung und veröffentlicht deren tatsächliche öffentliche Sichtbarkeit. Diese Eigenschaften ersetzen einander nicht. |

**Beispiel:** Zur geplanten Umgestaltung einer Straße kann eine Beschlussvorlage als Fundstelle erfasst werden. Ihre Veröffentlichung kann ein Ereignis sein. Die tatsächlich beschlossene Maßnahme ist erst nach geeignetem Nachweis ein anderes Ereignis. Beide können einem Vorgang zugeordnet sein, dessen Analyse die Folgen erläutert. Ein öffentlicher Vorgangsbeitrag berichtet über den geprüften Sachstand; eine ergänzende „Mehr wissen?“-Antwort erklärt etwa die rechtlichen Zuständigkeiten. Keiner dieser Schritte darf aus einer noch nicht belegten Entscheidung einen schon gefassten Beschluss machen.

## 02.3 Drei Beziehungen, die man nicht verwechseln darf

**Ereignis ↔ Meldung:** Zu einem Ereignis kann es **keine oder genau eine Meldung** geben; die Meldung bezieht sich auf genau ein Ereignis. Das ist eine bereits geltende Kardinalitätsregel des bisherigen Datenmodells. Sie hindert nicht daran, dass ein späteres **neues Ereignis** eine eigene Folgemeldung erhält.

**Ereignis ↔ Vorgang:** Ein Ereignis kann mehreren konkreten Vorgängen zugeordnet sein, falls diese tatsächlich betroffen sind. Ein Vorgang umfasst grundsätzlich mehrere Ereignisse im Verlauf; das bisherige Modell erlaubt fachlich mindestens ein zugeordnetes Ereignis. Ein Vorgang ist **nicht** bloß eine Sammlung von Meldungen.

**Vorgang ↔ Thema:** Ein Thema kann mehrere Vorgänge verknüpfen; ein Vorgang kann mehrere Themen betreffen. Einzelne zusätzliche Ereignisse können direkt einem Thema zugeordnet werden. Fachlich relevante Ereignisse werden nicht doppelt gezählt, nur weil sie über mehrere Pfade sichtbar werden.

## 02.4 Wo das Wissen liegt

Wissen entsteht nicht erst mit einer öffentlichen Meldung: Die **Analyse** ist der interne fachliche Erkenntnisstand. Sie unterscheidet Fakten, Erklärungswissen, Hintergründe, konkrete Wirkungen, übergreifende Schlussfolgerungen sowie Unsicherheiten und offene Fragen.

Eine konkrete Wirkung wird – sofern zutreffend – mit ihrem Ereignisbezug dokumentiert. **Eine übergreifende Schlussfolgerung muss dagegen nicht künstlich an ein einzelnes Ereignis gebunden werden.** Sie gehört unmittelbar zur Vorgangs- oder Themenanalyse und wird durch Quellen und nachvollziehbare Herleitungen gestützt.

Beispiel: Einzelereignisse betreffen Autobahnkreuz, Parkraum und Radverkehr. Die Themenanalyse kann zusätzlich untersuchen, **wie diese Planungen zusammenwirken**. Diese Aussage ist mehr als die Wiederholung einer Einzelwirkung.

**Offener Modellierungsaspekt:** Die bestehende Struktur für ereignisbezogene Wirkungen muss um den fachlichen Platz für solche übergreifenden Erkenntnisse ergänzt oder mit ihm abgeglichen werden. Diese Vorschau legt keine neuen Tabellen oder technischen Schlüssel fest.

## 02.5 Recherche ist mit dem Wissensmodell verbunden

Die laufende Recherche beobachtet Quellen und erkennt mögliche neue Fundstellen und Ereignisse. Daneben können **Vorgangs- oder Themenanalysen** neue Fragen auslösen. Daraus folgen gezielte Rechercheaufträge, deren Ziel und Umfang die Redaktion genehmigt. Wiederkehrende Beobachtungsaufträge sind davon zu unterscheiden; jeder konkrete Recherchelauf ist nachvollziehbar.

**Auch ohne neuen Rechercheauftrag** darf FIB vorhandene Informationen für eine erste Analyse eines neuen Vorgangs auswerten. Neue Erkenntnisse können bestehende Analysen und Veröffentlichungen zur erneuten Prüfung stellen.

## 02.6 Vorläufig, geprüft, freigegeben und veröffentlicht

Diese Begriffe bezeichnen **verschiedene Ebenen** und dürfen nicht als ein einziger Status vermischt werden.

- **Vorläufig:** Eine KI darf ein neues Ereignis erfassen, zuordnen und auswerten; nicht jedes Ereignis benötigt eine redaktionelle Einzelbestätigung.
- **Bestätigt:** Ein redaktionell bestätigtes Ereignis oder eine bestätigte Beziehung ist gegen eigenmächtiges KI-Überschreiben geschützt.
- **Analysefreigabe:** Die Redaktion bestätigt den geprüften Erkenntnisstand ganz oder teilweise; dadurch ändert sich **nicht** der Themenstatus.
- **Beitragsfreigabe:** Die Redaktion bestätigt eine konkrete Fassung eines öffentlichen Texts. Die **erste Beitragsfreigabe** führt beim Thema von Entwurf nach Aktiv.
- **Veröffentlichung:** Eine eigene Entscheidung macht genau diese Fassung öffentlich; sie kann nach den noch zu spezifizierenden Terminregeln zeitgesteuert erfolgen.

Jede öffentliche Korrektur erfolgt nachvollziehbar und nicht als stillschweigende Textüberschreibung.

## 02.7 So liest man dieses Modell zusammen mit dem Handbuch

- Kapitel **03 Recherche**: Wie entstehen Fundstellen, neue Informationen und gezielte Nachrecherchen?
- Kapitel **04 Ereignisse/Meldungen**: Wie wird Geschehen erkannt und gegebenenfalls berichtet?
- Kapitel **05 Vorgänge**: Wie wird ein konkreter Sachverhalt analysiert und fortgeschrieben?
- Kapitel **06 Themen**: Wie entstehen übergreifende Erkenntnisse und der Themenbeitrag?
- Kapitel **08 Redaktion**: Wer entscheidet wann?
- Kapitel **10 Qualität**: Was wird geprüft, wann blockiert FIB und wann weist FIB nur hin?

Das Strukturmodell gehört **an den Beginn des Handbuchs**, unmittelbar nach Zweck und Grundsätzen, und wird in den Prozesskapiteln nur noch **ausschnittweise** erläutert. Damit bleibt die Dokumentation prozessorientiert, ohne die Objektzusammenhänge zu verstecken.

**„Mehr wissen?“ gehört fachlich zu Meldungen, Vorgängen und Themen.** Öffentliche Vertiefungsfragen und ihre quellengebundenen Antworten haben jeweils einen nachvollziehbaren primären Kontext. Die bisherige Primärquelle kennt nur Meldung und Thema; der Vorgang wird im Zuge der Regelmigration ergänzt.

## 02.8 Noch abzugleichende Detailregeln

Dieses Kapitel ist eine **Lesefassung**, noch keine vollständige Übernahme von `docs/Datenmodell.md`, `docs/Persistenz-und-Lebenszyklusmodell.md` oder den spezialisierten Primärquellen. Vor normativer Ablösung sind insbesondere Analysebestandteile, Teilfreigaben, Vorläufigkeit der Ereignisse, Status-/Rechtekataloge, Veröffentlichungsversionen und Rechercheobjekte vollständig regelweise zu migrieren.

**Basisquellen:** `docs/Datenmodell.md`, `docs/Themen-und-Vorgangslogik.md`, `docs/fachhandbuch/README.md`; ergänzend die Migrationsentwürfe zu 03–06, 08 und 10 sowie die vier Fachentscheidungen vom 26.10.2026.
