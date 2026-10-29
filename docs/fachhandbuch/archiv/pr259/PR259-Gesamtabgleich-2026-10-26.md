# PR #259 – Kapitelübergreifender Konsistenz- und Vollständigkeitsabgleich

**26.10.2026 · Prüfstand 2 · vier fachliche Entscheidungen bestätigt; keine Gesamtabnahme**

## 1. Prüfgegenstand und Reichweite

Geprüft wurden die sechs Migrationsentwürfe zu Kapitel 03, 04, 05, 06, 08 und 10 auf gegenseitige Begriffs-, Prozess-, Zuständigkeits- und Freigabekonsistenz. Gegenübergestellt wurden bereits im Repository geprüfte Bestandsabschnitte aus Fachkonzept, Datenmodell, Themen-/Vorgangslogik, bisherigem Fachhandbuch 03 und 06, Redaktionsworkflow, Rollen-/Rechtemodell, Qualitätsregeln, Sprachleitfaden und Persistenzmodell.

**Nicht geleistet:** vollständige abschnittsweise Quellinventur sämtlicher alter Fachregeln, technischer DB-/API-Vertragstest, UI-Erprobung, Regressionstests oder fachliche Freigabe. Daher keine Aussage „vollständig migriert“.

## 2. Übergreifend stimmige Festlegungen

| Bereich | Konsistenter fachlicher Kern |
|---|---|
| Objekte | Fundstelle belegt Ereignis; Meldung ist optional und publikationsbezogen; Vorgänge und Themen arbeiten auf Ereignissen, nicht auf Meldungen |
| Recherche | offene und wissensgeleitete Standardsuche; gezielte Erkenntnisrecherche mit redaktionell genehmigtem Umfang |
| Analysen | Analyse gehört zu Vorgang oder Thema; Themenanalyse liefert eigenständigen übergreifenden Erkenntnisgewinn |
| KI/Redaktion | KI darf vorläufige Inhalte und Vorschläge erzeugen, nicht bestätigte Inhalte eigenmächtig verändern und nicht veröffentlichen |
| Änderungen | gezielte Auswirkungsprüfung, überprüfbare Änderungspakete, partielle redaktionelle Entscheidungen |
| Veröffentlichungen | Textentwurf, fachliche Prüfung, fixierte Freigabe und gesonderte (auch geplante) Publikation |
| Dashboard | nur handlungsrelevante Aufgaben, dringende Korrekturen auch bei abgeschlossenen/archivierten Bezugsobjekten |

## 3. Entscheidungsbedürftige Punkte (vor Freigabe)

### E-01: Analysefreigabe versus Themenstatus Aktiv – FACHLICHE FOLGEENTSCHEIDUNG
Kapitel 06/08 des Entwurfs verlangen eine eigenständige Freigabe einer Themenanalyse. In den bisherigen Bestandsregeln löst **die erste Beitragsfreigabe** den Übergang des Themenstatus Entwurf → Aktiv aus. **Widerspruch entsteht nur, falls Analysefreigabe fälschlich den Status Aktiv auslösen soll.**

**Prüfvorschlag:** Analysefreigabe ist ein eigenständiger fachlicher Versions-/Freigabestand **ohne automatische Statusänderung des Themas**. Der vorhandene Übergang Entwurf → Aktiv bei erster Beitragsfreigabe bleibt zunächst erhalten. Diese Lösung fachlich bestätigen, dann Rechte/Implementierung prüfen.

### E-02: Themenanalyse vs. ausgewerteter Beobachtungsauftrag – BESTANDSREGEL ERSETZEN
Bestandskapitel 06 erfordert vor erster fachlicher Themenfreigabe einen ausgewerteten Beobachtungsauftrag. Neuer Konsens: geprüfte Themenanalyse ist die Voraussetzung, zusätzlicher Auftrag nur bei Wissensbedarf. In Entwurf 06 klar formuliert, in Bestandsregel **noch nicht** umgesetzt.

**Prüfschritt:** Alte Bedingung mit Regelstellen und Testbezügen identifizieren und kontrolliert durch Analyseprüfung ersetzen; bisherige Recherchelauf-Provenienz unverändert erhalten.

### E-03: Vier Bereiche vs. alter Dreischritt – UI/KONZEPT
Neues Themenmodell: Definition – Bezüge – Analyse – Beitrag. Bestandskapitel 06 und existierende UI: drei Bereiche. Vier Bereiche sind **Navigation**, keine vier obligatorischen Freigaben.

**Prüfschritt:** bestehende Fachkonzeptstellen aktualisieren und zukünftige UI im Echtsystem erproben. Kein unnötiger vierter Status oder erzwungener Stepperabschluss.

### E-04: Vorläufige automatische Ereignisse vs. redaktionelle Sichtung – GRENZE
Bestandskapitel 03 verlangt Sichtbarkeit aller unmittelbaren Feldkirchen-Fundstellen und redaktionelle Entscheidung über verbindliche Zurückstellung. Entwürfe 03/04 erlauben automatische vorläufige Ereignisse.

**Prüfvorschlag:** Fundstellensichtungsrecht bleibt bestehen; vorläufige Ereigniserfassung ist **keine** Bestätigung und keine verbindliche Zurückstellung. Die Bestands-Statusliste für bestätigte Ereignisse (`bestätigt`, `zurückgenommen`, `zusammengeführt`) allein beantwortet noch nicht die Modellierung des Vorläufigkeitsmerkmals. Prüfung gegen DB/Services notwendig.

### E-05: Wirkung am Ereignis vs. themenweite Erkenntnis – DATENMODELL
Bestandsdatenmodell verankert einzelne Wirkungen an Ereignissen und historisiert Analysebestandteile über den strukturierten Gesamtstand. Neu ist ein Analysebestandteil, dessen fachliche Aussage rein übergreifend sein kann.

**Prüfvorschlag:** Begrifflich **konkrete Wirkung eines Ereignisses** und **übergreifende analytische Schlussfolgerung** unterscheiden. Keinen künstlichen Einzelvorgang oder ein fiktives Ereignis erzwingen. Die Datenmodellierung dieser Unterscheidung bedarf technischer Prüfung und ggf. gesonderter fachlicher Entscheidung.

### E-06: Teilfreigabe vs. strukturierte Gesamtversion – VERSIONIERUNG
Neue Anforderung: Teilbereiche von Analysen können bestätigt, andere zurückgestellt werden; Änderungspakete einzeln entscheiden. Bestand historisiert strukturierte Analysebestandteile grundsätzlich über den Gesamtstand.

**Prüfvorschlag:** eine konsistente Gesamtversion mit **aussage-/abschnittsbezogenem bestätigtem Geltungsstand** und klarer Herkunft; keine unkontrollierte eigenständige Versionsmaschine je Wirkung. Fachliche Granularität, Persistenz und Rollback noch nicht technisch entschieden.

### E-07: Schwerwiegender sachlicher Blocker vs. semantischer Hinweis – QUALITÄT
Neuer Konsens: klar belegter zentraler Widerspruch verhindert Veröffentlichung. Alte Norm trennt objektive serverseitige Invarianten von KI-Plausibilität.

**Prüfvorschlag:** Server sperrt nur auf Grundlage einer **klar definierten, nachprüfbaren, fachlich belegten Voraussetzung**. Zweifelhafte KI-Feststellungen erzeugen Hinweis/Prüfaufgabe, keinen ungeprüften autonomen Blocker. Fehlende Pflichtquellen und Rechte sind bereits harte Invarianten.

### E-08: Geplante Veröffentlichung und spätere neue Befunde – BEACHTEN
Neu möglich: freigegebene Fassung später veröffentlichen. Entwurf 08 weist bereits darauf hin, dass vor einem späteren Termin neue Erkenntnisse aufgetreten sein können.

**Prüfvorschlag:** Unmittelbar vor dem geplanten Veröffentlichungszeitpunkt die fortbestehende Freigabe und harten Publikationsvoraussetzungen **erneut validieren**; einen inzwischen belegten schwerwiegenden Fehler nicht automatisiert veröffentlichen. Relevanz/Unsicherheit/Fristen/Benachrichtigungsweg im Echtsystem erproben; nicht ungefragt neue Freigabestufe schaffen.

## 4. Inhaltliche und strukturelle Verbesserungen vor Migration

1. Kapitel 03 ist noch **zu breit**: §§03.3.3–03.3.6 enthalten ausführliche Meldungs-, Vorgangs-, Themen- und Publikationsregeln. Für die verbindliche Fassung auf **kurze Übergaben mit Querverweisen** kürzen; Detailnormen bleiben in 04/05/06/08/10.
2. Die Kapitel 04, 05, 06 sind prozessorientiert und ausreichend differenziert, benötigen aber gegenwärtig teils **wiederholte** Definitionen von Freigabe, KI-Autonomie und Korrektorat. Jede Definition nur einmal als Primärregel führen.
3. Kapitel 08 ist gegenüber 03/05/06 merklich **kompakter** und benötigt später konkrete Aufgaben- und Freigabezuständigkeiten aus dem Rollen-/Rechtemodell. Die vereinbarten Anforderungen sind vorhanden, die Rechte-/Ablaufmatrix **noch nicht vollständig migriert**.
4. Kapitel 10 trennt Qualitätsaspekte nachvollziehbar; hier vor Merge klare Priorisierung zwischen objektiver Sperre und unsicherem KI-Urteil definieren.
5. **Fehlende Primärkapitel 02, 07, 09, 11:** Ein vollständiges Fachhandbuch kann aus den sechs Entwürfen noch **nicht** abgenommen werden. Nicht alle müssen sofort neu konzipiert werden, aber mindestens Kapitel 02 und 11 sowie Schnittstellen zu 07/09 sind für vollständige Migration systematisch zu berücksichtigen.
6. Alte Quellen behalten Geltung bis zur **Quellabschnitts-zu-Zielregel-Matrix**, bereinigten Querverweisen und Tests; die hier genannten Überschriften sind **keine fertigen verbindlichen Regelkennungen**.

## 5. Vorgeschlagene nächste Arbeitsfolge

1. Die Empfehlungen E-01, E-04, E-05 und E-07 in kurzen fachlichen Entscheidungen klären, ohne den Nutzer mit vielen Detailfragen gleichzeitig zu belasten.
2. Entwürfe 03–10 auf eindeutig primär platzierte Fachregeln und schlanke Verweise reduzieren.
3. Noch benötigte Kapitel 02 (Objekte/Analyse), 11 (Fachrechte) und Schnittstellen 07/09 erfassen.
4. Jede ältere Primärregel einem Zielabschnitt zuordnen und Konflikte/Verweise dokumentieren.
5. SQL/API, UI und automatisierte Tests gegen das konsolidierte Modell abgleichen. Erst danach normative Ablösung und Merge.

**Status:** Konsistenzprüfung der sechs Entwürfe auf Textebene durchgeführt. Acht besonders prüfbedürftige Punkte identifiziert. **Keine fachliche Gesamtabnahme.**

## 6. Fachliche Entscheidungen vom 26.10.2026 (nach Prüfstand 1)

**B-01 zu E-01 – Themenstatus:** Die Freigabe der Themenanalyse ist vom Themenstatus unabhängig und bewirkt **keinen** Wechsel von Entwurf nach Aktiv. Wie bisher führt erst die **erste Beitragsfreigabe** zu Aktiv. Die spätere Veröffentlichung ist separat. **Fachlich geklärt**, technische Freigabe-/Versionsabbildung noch offen.

**B-02 zu E-04 – Vorläufige Ereignisse:** FIB darf Ereignisse automatisch als **vorläufig** anlegen, fachlich weiterverarbeiten und bei eindeutigem Bezug vorläufig Vorgängen/Themen zuordnen. Es besteht **keine verpflichtende redaktionelle Einzelprüfung jedes Ereignisses**. Sämtliche Fundstellen und Ereignisse bleiben redaktionell sichtbar; wichtige Unsicherheiten und Widersprüche erzeugen Prüfaufgaben. Redaktionell bestätigte Ereignisse dürfen nicht durch KI eigenmächtig verändert werden. **Fachlich geklärt**, Status-/Rechteabbildung und Vereinbarkeit mit Fundstellensichtung noch technisch und normativ zu prüfen.

**B-03 zu E-05 – Übergreifende Erkenntnisse:** Vorgangs- und Themenanalysen umfassen neben Tatsachen und konkreten Ereigniswirkungen auch Erklärungs- und Hintergrundwissen sowie **eigenständige übergreifende Erkenntnisse** und Schlussfolgerungen. Solche Inhalte gehören unmittelbar zur jeweiligen Analyse; ein einzelnes Ereignis wird nicht künstlich als Anker erzeugt. Konkrete Ereigniswirkungen behalten ihre sachliche Ereignisbindung. Jede Erkenntnis benötigt Belege oder eine nachvollziehbare Herleitung und redaktionelle Bestätigung für verbindliche Nutzung. **Fachlich geklärt**, Modellierung der Analysebausteine noch offen.

**B-04 zu E-07 – Qualitätssperren:** Eindeutig **belegbare schwerwiegende fachliche Fehler** verhindern die Veröffentlichung bis zu Korrektur und neuer Prüfung. Bei **begründetem, noch nicht abschließend belegtem Verdacht** erscheint ein auffälliger Prüfhinweis; die Redaktion darf nach eigener Prüfung trotzdem freigeben. **Geringfügige Unsicherheiten** erzeugen einen normalen Hinweis ohne Sperre. Unabhängige harte Rechte-/Status-/Quellen-Invarianten bleiben serverseitig verbindlich. **Fachlich geklärt**, Nachweisstandard und technische Durchsetzung noch offen.

**Verbleibend:** E-02/E-03 (Bestandsregel und UI-Migration), E-06 (Teilfreigabe und Versionierung), E-08 (Validierung geplanter Veröffentlichungen), Quellabschnittsmatrix, technische Prüfung und Regressionstests. Die vier Entscheidungen sind **keine vollständige PR-Abnahme**.
