# Regressionstestkorpus – Demonstratortransfer → FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.2 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument beschreibt die fachlichen Referenzfälle, mit denen überprüft wird, ob zentrale Erkenntnisse des Demonstrator- und Testbetriebs im Echtsystem erhalten bleiben.

Die Tests sind zunächst fachlich beschrieben. In G3–G10 werden sie schrittweise in Datenmodell-, Workflow-, Integrations-, UI- und Abnahmetests übersetzt.

Grundsatz:

> **Eine Demonstrator-Erkenntnis gilt nicht allein deshalb als übertragen, weil sie irgendwo dokumentiert ist. Das Echtsystem muss den zugehörigen Referenzfall fachlich korrekt verarbeiten können.**

## 2. Teststatus

- **fachlich definiert** – erwartetes Verhalten ist dokumentiert,
- **datenmodellseitig abbildbar** – benötigte Objekte/Felder/Beziehungen sind vorhanden,
- **workflowseitig abbildbar** – redaktionelle Entscheidung ist vorgesehen,
- **technisch automatisiert** – Test kann gegen Implementierung ausgeführt werden,
- **bestanden** – erwartetes Verhalten wurde nachgewiesen.

Während G2.5 genügt für das Transfer-Gate, dass die fachlich kritischen Fälle definiert und die erforderlichen Regeln in kanonischen Dokumenten verankert sind. Technische Automatisierung folgt in den späteren Gründungs- und Umsetzungsphasen.

## 3. Referenzfälle

### RT-001 – Autonomer On-Demand-Verkehr München

**Prüft:** erweiterten Suchraum, mögliche zukünftige Bedeutung, technische Zukunftsrelevanz, Themenbezug, „Mehr wissen?“.

**Erwartung:** externe Entwicklung wird nur mit nachvollziehbarem Feldkirchen-Bezug aufgenommen; „Mehr wissen?“ bleibt quellengebunden.

### RT-002 – ADFC-Fahrradklima-Test / Beteiligungsaufruf

**Prüft:** Beteiligung als eigenständige Entwicklung.

**Erwartung:** öffentlicher Beteiligungsaufruf wird als möglicher eigener Nachrichtenwert geprüft.

### RT-003 – Parkraumkonzept / Direktprüfung bekannter Quellen

**Prüft:** Quellenbeobachtung unabhängig von Suchmaschinen.

**Erwartung:** bekannte Quellen werden technisch beobachtet; neue öffentliche Sachstände können Meldung/Aktualisierung auslösen.

### RT-004 – Hundewiese / RIS-Vorlage und Datumslogik

**Prüft:** Beschlussvorlage ≠ Beschluss, Datumsarten, Linkprüfung, Aktualisierung.

**Erwartung:** Vorlage, Sitzung und tatsächliche Entscheidung bleiben getrennt; Datums- und Linklogik bleibt korrekt.

### RT-005 – Kiesgrund

**Prüft:** themenunabhängige Entdeckung und redaktionell ausgelöste Recherche.

**Erwartung:** redaktioneller Hinweis kann Suchkontext schärfen und Rückblick auslösen.

### RT-006 – Ausbau Autobahnkreuz München-Ost

**Prüft:** Großvorgang und `Bedeutung für das Thema`.

**Erwartung:** `prägend/relevant/ergänzend` wird redaktionell bestätigt und nicht mechanisch berechnet.

### RT-007 – Radwegenetz im selben Mobilitätsthema

**Prüft:** unterschiedliche Bedeutung verschiedener Vorgänge ohne Wirkungsrollen-Taxonomie.

### RT-008 – Bürgerinitiative mit substanziellem Anliegen

**Prüft:** Resonanz- und Gegenpositionssuche.

### RT-009 – Geteilter Direktlink zu einer Aktualisierung

**Prüft:** Treffgenauigkeit und stabilen Einstieg.

### RT-010 – Bezugsobjekt B471 / Oberndorfer Straße

**Prüft:** Alias und geprüfte Objektbeziehung.

### RT-011 – „Mehr wissen?“ / Hintergrundantwort

**Prüft:** Quellenrollen, Anti-Redundanz, Wissenslücken.

### RT-012 – Persistenzschutz über mehrere Update-Läufe

**Prüft:** keine unbeabsichtigte Löschung.

### RT-013 – PWA „Neu seit letztem Besuch“

**Prüft:** einheitliche Neuigkeitslogik.

### RT-014 – Cache-/Deployment-Verlässlichkeit

**Prüft:** Auslieferung des aktuellen Stands.

### RT-015 – Interner grüner Antrag als Hintergrundquelle

**Prüft:** Herkunft, Sichtbarkeit und Folgerecherche.

### RT-016 – Suche „Beteiligung“

**Prüft:** Trennung Kategorie, Schlagwort und Volltext.

### RT-017 – Meldung mit „Was bisher passiert ist“

**Prüft:** kompakter meldungsbezogener Verlauf zusätzlich zum vollständigen Vorgangsverlauf.

**Ausgangslage:** Eine aktuelle Meldung gehört zu einem Vorgang mit mehreren früheren relevanten Ereignissen/Meldungen.

**Erwartung:**

- die aktuelle Meldung erscheint nicht im eigenen Rückblick,
- nur fachlich relevante frühere Schritte werden gezeigt,
- Einträge sind nach Möglichkeit direkt verlinkt,
- der Baustein wird aus bestehenden Ereignis-/Meldungs-/Vorgangsbeziehungen erzeugt,
- ein knapper Fließtext „Bisheriger Stand“ ersetzt den verlinkten Verlauf nicht automatisch.

### RT-018 – Meldung mit offenen Fragen

**Prüft:** Trennung offene Sachfrage ↔ „Mehr wissen?“.

**Erwartung:**

- offene Frage wird als eigener fachlicher Gegenstand gespeichert,
- Status und spätere Auflösung bleiben nachvollziehbar,
- öffentliche Darstellung zeigt den aktuellen offenen Stand,
- eine gelöste Frage wird nicht weiterhin als offen ausgegeben,
- „Mehr wissen?“ kann dieselbe Sachlage vertiefen, bleibt aber ein anderes Objekt.

### RT-019 – Thema mit relevantem Ereignis aus Nachbargemeinde

**Prüft:** sichtbare Einbeziehung externer Ereignisse in ein Feldkirchen-Thema.

**Erwartung:**

- externer Ort bleibt transparent,
- Feldkirchen-Bezug wird begründet,
- reine Ähnlichkeit reicht nicht,
- Ereignis kann als zusätzlicher Themenbestandteil oder Vergleichs-/Lernkontext aufgenommen werden,
- es wird nicht als Feldkirchner Ereignis umetikettiert.

### RT-020 – Meldungsbild mit vollständiger Freigabe

**Prüft:** Bildimport, Rechte, Metadaten und konkrete Verwendung.

**Erwartung:**

- Herkunft, Urheber, Nutzungsrecht und ggf. Nachweis sind vorhanden,
- Alt-Text und sachliche Bildunterschrift sind vorhanden,
- konkreter Sachbezug zur Meldung ist bestätigt,
- Bild und konkrete Verwendung sind redaktionell freigegeben,
- explizite Zuordnung hat Vorrang vor automatischem Vorschlag.

### RT-021 – Meldung ohne geeignetes Bild

**Prüft:** kein Bildzwang.

**Erwartung:**

- ein nur ungefähr passendes oder missverständliches Bild wird nicht verwendet,
- die Meldung bleibt ohne Bild, wenn kein geeignetes Motiv verfügbar ist,
- das System erzeugt keinen Pflichtfehler allein wegen fehlendem Bild.

### RT-022 – Bild mit Primärzuordnung und weiterer zulässiger Verwendung

**Prüft:** strukturierte Bildbibliothek und Mehrfachverwendung.

**Erwartung:**

- Primärzuordnung bleibt erhalten,
- weitere fachlich passende Verwendung kann separat freigegeben werden,
- jede Verwendung wird eigenständig geprüft,
- allgemeine Schlagwortähnlichkeit überschreibt keine explizite Zuordnung.

### RT-023 – Bild mit Nutzungsausschluss

**Prüft:** ausdrückliches „Nicht verwenden für“.

**Erwartung:**

- Nutzungsausschluss wird gespeichert,
- automatische Bildvorschläge respektieren ihn,
- Verwechslungsgefahr führt nicht zu irreführender Bebilderung.

### RT-024 – Hundehaltungsverordnung ↔ Hundewiese

**Prüft:** offene mögliche Wechselwirkung zwischen getrennten Vorgängen.

**Erwartung:**

- Vorgänge bleiben getrennt,
- mögliche Wechselwirkung kann als offene Frage/Querverweis gespeichert werden,
- sie wird als bedingt/offen gekennzeichnet,
- sie wird nicht als bereits eingetretene Wirkung oder gesicherte Kausalität behandelt.

### RT-025 – Rechtliche Vertiefung ohne Rechtsberatung

**Prüft:** Rechtsbezug in „Mehr wissen?“ und Herkunft rechtlicher Aussagen.

**Erwartung:**

- notwendiger Rechtskontext kann im Haupttext erscheinen,
- vertiefende Rechtsfragen werden bevorzugt über „Mehr wissen?“ angeboten,
- Rechtsquelle, amtliche Erläuterung und rechtliche Einschätzung eines Akteurs bleiben unterscheidbar,
- FIB nimmt keine eigene verbindliche rechtliche Würdigung vor.

### RT-026 – Fachbegriff aus Quelle

**Prüft:** bürgernahe Erläuterung von Fachsprache.

**Ausgangslage:** Quelle verwendet z. B. „verfahrensfrei“.

**Erwartung:**

- relevanter Fachbegriff wird beim ersten notwendigen Auftreten knapp und kontextbezogen erklärt,
- Regel gilt nicht nur für Recht, sondern auch für Verwaltung, Planung, IT, Wissenschaft, Wirtschaft usw.,
- „Mehr wissen?“ ist nicht Voraussetzung dafür, den Haupttext zu verstehen.

### RT-027 – Freie „Mehr wissen?“-Frage als bewusste MVP-Abweichung

**Prüft:** bewusste Produktentscheidung statt versehentlichem Funktionsverlust.

**Erwartung:**

- vorbereitete/persistente Fragen und Antworten funktionieren im MVP,
- freie Live-Fragen sind ausdrücklich spätere Ausbaustufe,
- die Demonstrator-Funktion wird nicht fälschlich als bereits verpflichtende MVP-Anforderung behandelt.

### RT-028 – Sichere Darstellung dynamischer KI-Antworten

**Prüft:** keine Ausführung beliebigen KI-generierten HTMLs.

**Erwartung:**

- dynamische Antworten werden nur über eine begrenzte sichere Darstellungsschicht ausgegeben,
- Links und einfache Formatierung können erlaubt sein,
- beliebiges HTML/Script aus Modellantworten wird nicht direkt ausgeführt.

## 4. Transfer-Gate-Bezug

G2.5 kann fachlich geschlossen werden, wenn:

- die Referenzfälle die relevanten Demonstrator-Erkenntnisse hinreichend abdecken,
- die dafür nötigen Regeln in kanonischen Echtsystem-Dokumenten stehen,
- G3/G5/G6/G10 die noch technisch zu realisierenden Prüfpunkte als Anforderungen übernehmen,
- kein fachlich kritischer Fall ausschließlich auf Chat-Erinnerung oder Demonstrator-Code angewiesen bleibt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.2 | 04.10.2026 | Zweiten Transfer-Audit in Regressionstests überführt: Meldungsverlauf, offene Fragen, Nachbarereignisse, Bildworkflow/-bibliothek, Nutzungsausschlüsse, Wechselwirkung Hundehaltung↔Hundewiese, rechtliche Vertiefung, Fachbegriffserklärung, bewusste Live-Fragen-Abweichung und sichere KI-Ausgabe ergänzt. |
| 0.1 | 03.10.2026 | Referenzfälle aus Demonstratorbetrieb und Chat-Erinnerungs-Audit als fachlichen Regressionstestkorpus angelegt. |
