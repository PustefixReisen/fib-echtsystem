# 08 – Redaktion und Veröffentlichung – Integrationsentwurf

Stand: 26.10.2026. Status: Entwurf, keine Abnahme. Bisherige Primärregeln behalten ihre Gültigkeit.

## 08.1 Ziel und Verantwortung
FIB übernimmt Recherche, Auswertung und Vorbereitung. Die Redaktion trifft verbindliche fachliche Entscheidungen und veröffentlicht. KI darf keine Veröffentlichung selbst freigeben. Redakteure dürfen nach bestehendem Rollenmodell freigeben und publizieren; die administrative Rolle behält Sonderrechte. Federführung und temporäre Bearbeitungssperren sind zu unterscheiden.

## 08.2 Aufgabensteuerung
Ein gemeinsames Dashboard zeigt nur offene menschliche Entscheidungen, nicht jede KI-Aktivität. Die Aufgabe benennt Anlass, betroffenen Vorgang/Thema/Meldung, Dringlichkeit und direkten Bearbeitungszugang. Berechtigte Redakteure können Aufgaben selbst übernehmen, koordinierende Personen zuweisen. Aufgaben bei abgeschlossenen Vorgängen oder archivierten Themen bleiben sichtbar, wenn veröffentlichte Inhalte dringend korrigiert werden müssen.

Dringlichkeit ist nicht politische Relevanz. Vorgesehen sind **dringend** (zentrale veröffentlichte Aussage möglicherweise falsch), **erhöht** (wichtige neue Entwicklung) und **normal**. KI begründet Priorität, Redaktion kann sie korrigieren. Dringendes muss auch ohne Farberkennung erkennbar sein. Push- und E-Mail-Alarme sind nicht beschlossen.

## 08.3 Fachliche Entscheidungen
Gezielte Recherche: Redaktion genehmigt einmalig Ziel und Grenzen, KI führt danach autonom innerhalb des genehmigten Rahmens aus; Erweiterungen benötigen neue Genehmigung. Vorgänge und Themen bieten direkte Nachfragen und Zugang zu Fragen, Belegen und Recherchen.

Analyse: Die KI bündelt Änderungen und Belege in Änderungspaketen. Änderungen dürfen einzeln bestätigt, bearbeitet, zurückgestellt oder abgelehnt werden. Eine **Teilfreigabe** der Analyse ist möglich. Bestätigte Inhalte bleiben geschützt. Folgewirkungen zwischen Vorgängen und Themen werden gezielt geprüft.

## 08.4 Bearbeiten und Korrigieren
KI erstellt sachliche Meldungs- und Themenbeitragsentwürfe, Redaktion wählt und gewichtet Aussagen. Ein gemeinsames inhaltliches und sprachliches Korrektorat verarbeitet frei formulierte Änderungswünsche. Kleine sprachliche Korrekturen an noch unveröffentlichten Entwürfen darf KI automatisch durchführen, wenn sie nachvollziehbar und umkehrbar sind. Inhaltliche Änderungen erfordern Bestätigung; nicht belegte neue Aussagen lösen Prüf-/Recherchebedarf aus.

## 08.5 Schlussprüfung
Vor Beitragsfreigabe werden fachliche Belege, Widersprüche, Unsicherheiten, Verständlichkeit und redaktioneller Schwerpunkt geprüft. Schwerwiegende und belegbare fachliche Fehler blockieren die Veröffentlichung bis zur Korrektur. Nicht blockierende Hinweise verbleiben in der Verantwortung der Redaktion. Harte Status-/Rechte-Invarianten sind weiterhin serverseitig durchzusetzen; diese dürfen nicht mit semantischen KI-Einschätzungen verwechselt werden.

## 08.6 Freigabe und Veröffentlichung
**Entwurf → fixierte redaktionell freigegebene Fassung → gesonderte sofortige oder zeitgesteuerte Veröffentlichung**. Vor dem Veröffentlichungstermin kann die Planung verschoben oder aufgehoben werden. Veröffentlichtes wird nicht stillschweigend überschrieben. Eine inhaltliche Änderung erfordert neue Fassung, Freigabe und Publikationsentscheidung. Historie und Belege bleiben erhalten. Bestehende Rechte zur Rücknahme und erneuten Veröffentlichung unveränderter weiterhin gültiger Fassungen müssen beim Zeitplanungsmodell erhalten bleiben.

Bild- und Dokumentverwendung erfordern weiterhin die eigene Rechte- und Freigabeprüfung; Textfreigabe ersetzt diese nicht.

### Schnittstelle zu Analysen und Beiträgen

Der redaktionelle Prozess unterscheidet drei Entscheidungen, damit interne Erkenntnisarbeit nicht unbemerkt zu öffentlicher Verbindlichkeit wird:

| Gegenstand | Was wird entschieden? | Folge |
|---|---|---|
| **Analysefreigabe** | Welche belegten Aussagen der Vorgangs- oder Themenanalyse gelten fachlich als bestätigt? | Keine automatische Beitragsfreigabe und keine Publikation; bei Themen kein Statuswechsel nach „Aktiv“. |
| **Beitragsfreigabe** | Ist eine konkrete, fixierte öffentliche Fassung (Meldung, Vorgangsbeitrag, Themenbeitrag) fachlich freigegeben? | Noch keine öffentliche Sichtbarkeit. Bei Themen: erste Beitragsfreigabe aktiviert den Entwurf. |
| **Veröffentlichung** | Soll genau diese gültig freigegebene Fassung jetzt oder geplant öffentlich sichtbar werden? | Eigene, dokumentierte S3-Entscheidung; KI darf nicht selbst veröffentlichen. |

Eine Veröffentlichung setzt die für **ihre konkreten Aussagen** tragfähige Analyse-/Belegbasis voraus, nicht die vollständige Beantwortung aller offenen Fragen. Ein eindeutig belegter schwerwiegender Fehler verhindert die Freigabe zur Veröffentlichung, bis der Fehler behoben und die Fassung erneut geprüft ist. Unbestätigte KI-Zweifel führen zu einem sichtbaren Prüfhinweis und erlauben eine begründete redaktionelle Entscheidung.

**Grenzbeispiel:** Die KI ergänzt zur Grundstückskauf-Analyse belastbare Informationen. Daraus entsteht ein Änderungsvorschlag für den Vorgangsbeitrag, **nicht** automatisch eine neue Publikation. Ein bereits veröffentlichter Beitrag bleibt unverändert, bis die Redaktion eine neue Fassung freigibt und deren Veröffentlichung ausdrücklich bestätigt.

## 08.7 Aktualisierung
Neue Ereignisse und Erkenntnisse führen zur Prüfung veröffentlichter Inhalte. FIB schlägt gegebenenfalls Aktualisierungen, Folgemeldungen oder belegte Korrekturen vor. Bei wesentlichen Korrekturen muss öffentlich erkennbar sein, was und warum geändert wurde. Veröffentlichung bleibt redaktionelle Entscheidung.

## 08.8 Abgrenzung und offene Konsistenzprüfung
Primärdefinitionen zu Ereignis/Meldung in Kapitel 04, Vorgangsanalysen in 05, Themen/Analysen in 06, Qualitätskriterien in 10 sowie fachlichen Rechten in 11. Insbesondere offen: Verhältnis Analysefreigabe zu Themenstatus Aktiv, Teilfreigabe zu Gesamtversionierung, Terminplanung und Revalidierung vor Veröffentlichung, Status-/Rechtematrix, Bearbeitungssperren und Aufgabenzuweisung. Kein neuer Dauerstatus und keine technische Implementierung durch diesen Text.

## 08.9 Abnahmeszenarien
1. Viele automatische KI-Schritte, aber nur wenige entscheidungsrelevante Dashboard-Aufgaben.
2. Änderungspaket teilweise freigeben, Restfragen erhalten.
3. Sprachliche Änderung rückgängig machen; inhaltliche Änderung ausdrücklich bestätigen.
4. Widerspruch zu amtlicher Quelle blockiert Freigabe, nach Berichtigung erneut prüfen.
5. Beitrag freigeben, Veröffentlichung terminieren und vorher verschieben.
6. Dringliche Korrekturmeldung auch bei archiviertem Thema anzeigen.

Quellen: docs/Rollen-Rechte-und-Workflow.md, docs/Redaktionsworkflow.md, docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md, bestehendes Fachhandbuchkapitel 06 und Migrationsentwürfe 03–06.
