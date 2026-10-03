# Regressionstestkorpus – Demonstratortransfer → FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

**Ausgangslage:** Eine reale Erprobung findet in München statt, nicht in Feldkirchen.

**Erwartung:**

- Fundstelle kann über themenbezogene Quellenentdeckung gefunden werden, obwohl Feldkirchen nicht primärer Veröffentlichungsort ist.
- Aufnahme erfordert konkrete plausible Bedeutung für eine Feldkirchner Mobilitätsfragestellung; bloße technische Neuigkeit reicht nicht.
- aktuelle Wirkung, mögliche zukünftige Wirkung und bloße Möglichkeit werden getrennt.
- „Mehr wissen?“-Aussagen zu Reife, Rechtsrahmen und Übertragbarkeit benötigen geeignete Quellen.
- der Fall kann als `ergänzend`, `relevant` oder in Ausnahmefällen `prägend` für ein Thema vorgeschlagen werden; die Redaktion bestätigt die Bedeutung verpflichtend.

### RT-002 – ADFC-Fahrradklima-Test / Beteiligungsaufruf

**Prüft:** Beteiligung als eigenständige Entwicklung.

**Erwartung:**

- ein öffentlicher Mitwirkungs- oder Beteiligungsaufruf wird als Recherchekandidat geprüft,
- er wird nicht allein deshalb verworfen, weil kein kommunaler Beschluss vorliegt,
- Feldkirchen-Bezug und tatsächliche Beteiligungsmöglichkeit werden verifiziert.

### RT-003 – Parkraumkonzept / Direktprüfung bekannter Quellen

**Prüft:** Quellenbeobachtung unabhängig von Suchmaschinen.

**Erwartung:**

- neue oder geänderte bekannte Projekt-/Gemeindeseiten können auch ohne Suchmaschinentreffer erkannt werden,
- unveränderte Quellen lösen keine unnötige semantische Neuanalyse aus,
- ein neuer öffentlich belegter Sachstand kann Meldung oder Aktualisierung auslösen.

### RT-004 – Hundewiese / RIS-Vorlage und Datumslogik

**Prüft:** Beschlussvorlage ≠ Beschluss, Datumsarten, Linkprüfung, Aktualisierung.

**Erwartung:**

- Dokumentdatum, öffentliche Freigabe, geplanter Sitzungstermin, veröffentlichte Tagesordnung und tatsächliche Beratung/Entscheidung werden getrennt geführt,
- eine freigegebene Vorlage erzeugt nicht automatisch einen bestätigten Sitzungstermin oder Beschluss,
- ein Vorlagenlink wird nur als Vorlage bezeichnet, wenn Ziel und Zuordnung geprüft sind,
- ist ein Direktlink nicht erreichbar, wird er nicht als funktionierend ausgegeben,
- reine redaktionelle Fehlerkorrektur erzeugt keinen fachlichen Aktualisierungshinweis.

### RT-005 – Kiesgrund

**Prüft:** themenunabhängige Entdeckung und redaktionell ausgelöste Recherche.

**Erwartung:**

- ein bislang nicht etablierter Begriff kann durch redaktionellen Hinweis als Rechercheauftrag eingebracht werden,
- der Suchkontext wird um Namen, Ort, Akteure und sachliche Varianten ergänzt,
- bei neuem oder wesentlich geschärftem Suchkontext wird grundsätzlich ein sechsmonatiger Rückblick ausgelöst,
- das Ergebnis kann eine bestehende Themendefinition verändern; wesentliche Änderung wird versioniert und erneut bestätigt.

### RT-006 – Ausbau Autobahnkreuz München-Ost

**Prüft:** Großvorgang und `Bedeutung für das Thema`.

**Erwartung:**

- der Ausbau kann als eigener Vorgang modelliert werden,
- die KI darf `prägend` für das Mobilitätsthema vorschlagen,
- die Redaktion muss die Einstufung verpflichtend bestätigen oder ändern,
- die Einstufung wird nicht automatisch aus Meldungs- oder Quellenanzahl abgeleitet,
- Perspektiven und Wirkungen erklären fachlich, warum der Vorgang wichtig ist.

### RT-007 – Radwegenetz im selben Mobilitätsthema

**Prüft:** unterschiedliche Bedeutung verschiedener Vorgänge ohne Wirkungsrollen-Taxonomie.

**Erwartung:**

- Radwegenetz kann im selben Thema `prägend`, `relevant` oder `ergänzend` sein,
- die Bedeutung wird separat vom BAB-Kreuz bewertet,
- dieselbe Perspektive, z. B. Verkehrssicherheit, muss nicht unter mehreren Wirkungsrollen dupliziert werden,
- sachliche Wirkungen und Bedeutung bleiben getrennte Konzepte.

### RT-008 – Bürgerinitiative mit substanziellem Anliegen

**Prüft:** Resonanz- und Gegenpositionssuche.

**Erwartung:**

- substanzielle Aussagen/Forderungen lösen gezielte Suche nach Reaktionen und Gegenpositionen aus,
- BI-Aussagen werden als zugeordnete Positionen behandelt,
- überprüfbare Tatsachen werden nach Möglichkeit unabhängig verifiziert.

### RT-009 – Geteilter Direktlink zu einer Aktualisierung

**Prüft:** Treffgenauigkeit und stabilen Einstieg.

**Erwartung:**

- Direktlink öffnet den beabsichtigten Inhalt,
- bei fachlich relevanter Aktualisierung ist unmittelbar sichtbar, was neu ist,
- Nutzer landen nicht nur unspezifisch auf einer langen Start-/Listenansicht,
- Browser-Zurück bleibt nachvollziehbar.

### RT-010 – Bezugsobjekt B471 / Oberndorfer Straße

**Prüft:** Alias und geprüfte Objektbeziehung.

**Erwartung:**

- B471 und Oberndorfer Straße können als Aliase desselben Bezugsobjekts behandelt werden,
- Beziehungen zu Meldungen/Vorgängen/Themen entstehen nur explizit geprüft,
- bloße Volltextnennung erzeugt keine Objektbeziehung,
- Suche kann über Alias strukturierte Zusammenhänge finden.

### RT-011 – „Mehr wissen?“ / Hintergrundantwort

**Prüft:** Quellenrollen, Anti-Redundanz, Wissenslücken.

**Erwartung:**

- Frage eröffnet einen zusätzlichen Erkenntnishorizont,
- Antwort wiederholt nicht lediglich Meldung oder Quellenliste,
- Tatsachenbehauptungen werden durch geeignete Quellen gestützt,
- fehlen Belege, wird nachrecherchiert oder die Lücke transparent gemacht,
- allgemeines Modellwissen ersetzt keine belastbare Quellenbasis.

### RT-012 – Persistenzschutz über mehrere Update-Läufe

**Prüft:** keine unbeabsichtigte Löschung.

**Ausgangslage:** Eine veröffentlichte Meldung bzw. ein bestätigter Vorgang wird im nächsten Recherchelauf nicht erneut gefunden.

**Erwartung:**

- das bestehende Objekt bleibt erhalten,
- fehlender erneuter Treffer ist kein Löschsignal,
- Beziehungen und Historie bleiben erhalten,
- Rücknahme/Löschung/Archivierung erfolgt nur durch expliziten protokollierten Vorgang.

### RT-013 – PWA „Neu seit letztem Besuch“

**Prüft:** einheitliche Neuigkeitslogik.

**Erwartung:**

- neue Meldung zählt als Neuigkeit,
- fachlich relevante Aktualisierung einer bestehenden Meldung zählt ebenfalls,
- rein technische oder redaktionelle Änderung zählt nicht,
- Status ist geräte-/browsergebunden und benötigt kein Benutzerkonto,
- Badge ist nur ergänzend; maßgeblich bleibt die FIB-interne Neuigkeitslogik.

### RT-014 – Cache-/Deployment-Verlässlichkeit

**Prüft:** Auslieferung des aktuellen Stands.

**Erwartung:**

- nach erfolgreicher Veröffentlichung darf ein regulärer Nutzer nicht dauerhaft aufgrund alter zentraler Assets einen veralteten FIB-Datenstand sehen,
- G5 muss eine reproduzierbare Cache-/Versionierungs-/Invalidierungsstrategie festlegen,
- Deployment und sichtbarer Inhaltsstand müssen prüfbar zusammenpassen.

### RT-015 – Interner grüner Antrag als Hintergrundquelle

**Prüft:** Herkunft, Sichtbarkeit und Folgerecherche.

**Erwartung:**

- nicht öffentliche Quelle kann Recherche und Einordnung steuern,
- sie wird nicht fälschlich als öffentlich zugänglicher Beleg dargestellt,
- bei vollständigen Rechercheläufen kann gezielt nach inzwischen öffentlichen Folgevorgängen gesucht werden,
- wird eine Quelle über FIB selbst öffentlich bereitgestellt, muss die Berechtigung dafür getrennt freigegeben sein.

### RT-016 – Suche „Beteiligung“

**Prüft:** Trennung Kategorie, Schlagwort und Volltext.

**Erwartung:**

- ein Wahlbeitrag erscheint nicht allein deshalb bei „Beteiligung“, weil seine Sammelkategorie den Begriff enthält,
- explizite Schlagworte und strukturierte Beziehungen bestimmen den thematischen Treffer,
- Kategorien, Orte und fachliche Schlagworte bleiben getrennte Metadaten.

## 4. Transfer-Gate-Bezug

G2.5 kann fachlich geschlossen werden, wenn:

- die Referenzfälle die relevanten Demonstrator-Erkenntnisse hinreichend abdecken,
- die dafür nötigen Regeln in kanonischen Echtsystem-Dokumenten stehen,
- G3/G5/G6/G10 die noch technisch zu realisierenden Prüfpunkte als Anforderungen übernehmen,
- kein fachlich kritischer Fall ausschließlich auf Chat-Erinnerung oder Demonstrator-Code angewiesen bleibt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 03.10.2026 | Referenzfälle aus Demonstratorbetrieb und Chat-Erinnerungs-Audit als fachlichen Regressionstestkorpus angelegt. |
