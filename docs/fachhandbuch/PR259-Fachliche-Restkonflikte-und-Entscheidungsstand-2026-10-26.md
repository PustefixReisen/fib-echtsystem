# PR #259 – Fachliche Restkonflikte und Entscheidungsstand

**26.10.2026 · fachlicher Quellabgleich (keine technische Abnahme).** Ziel ist, die verbleibenden fachlichen Normkonflikte von bloß später zu gestaltenden Datenbank-/UI-Aufgaben zu trennen.

## 1. Bereits entschieden: Nicht erneut zur Entscheidung stellen

| Fachfrage | Geltendes gemeinsames Zielmodell | Kapitel |
|---|---|---|
| Automatische Fundstellensichtung | Sämtliche einschlägigen Funde bleiben sichtbar; keine verpflichtende menschliche Einzelprüfung bei jedem Fund; begründete Prüfaufgaben statt pauschaler Abnahme | 03/04 |
| Vorläufige Ereignisse und Vorgänge | KI darf reversible, vorläufige Sachstände vorbereiten; bestätigte Inhalte nicht eigenmächtig überschreiben | 04/05/11 |
| Themenstatus | Eigenständige Analysefreigabe ohne Statuswechsel; erst erste Beitragsfreigabe macht Entwurf → Aktiv | 06/08/11 |
| Beobachtungsauftrag | Für Themenanalyse/erste Beitragsfreigabe nicht generell erforderlich; gezielte Recherche bei Wissensbedarf | 03/06 |
| Öffentliche Vorgangsansicht | Sachstand, Hintergründe und Erkenntnisse als eigener redaktioneller Vorgangsbeitrag; Meldungen/Verlauf ergänzend | 05/09 |
| „Mehr wissen?“ | Öffentlich bei Meldung, Vorgang oder Thema; pro Frage genau ein primärer Kontext | 09 |
| Inhaltskette und RIS | Dokument/Vorlage, tatsächliche Sitzung, Beschluss und Meldung getrennt, ihre Beziehungen nachvollziehbar | 02/07 |
| Blocker | Nachgewiesener schwerwiegender Fehler blockiert; bloßer unbewiesener KI-Verdacht löst Prüfhinweis aus | 10 |

## 2. Beschlossene Fachfragen und verbleibende normative Harmonisierung

### F-01: Terminierte Veröffentlichung – **fachlich entschieden am 26.10.2026**

Die Redaktion darf die automatische Veröffentlichung **einer genau bezeichneten freigegebenen Beitragsfassung zu einem genau bezeichneten Termin** ausdrücklich bestätigen. Diese **an Fassung und Termin gebundene S3-Bestätigung bei der Terminierung** genügt; eine erneute manuelle Bestätigung unmittelbar zum Termin ist nicht erforderlich.

**Verbindliche Grenzen:** Vor der technischen Ausführung prüft FIB erneut Rolle/Berechtigung, unveränderte freigegebene Fassung, gültigen Termin und sämtliche sonstigen Rechte- und Qualitätsbedingungen. Liegt eine Voraussetzung nicht mehr vor, **unterbleibt die Veröffentlichung** und die Redaktion erhält einen Hinweis beziehungsweise eine Aufgabe. Bei Änderung des Termins oder des Inhalts ist erneut ausdrücklich zu bestätigen. Die Ausnahme betrifft ausschließlich die so terminierte Veröffentlichung; für sonstige S3-Aktionen bleibt die unmittelbare Bestätigung maßgeblich.

**Migration:** Die ältere Formulierung in [Rollen, Rechte und Workflow](../Rollen-Rechte-und-Workflow.md), §6.4, ohne Ausnahme „unmittelbar vor Ausführung“ ist **für diesen eng beschriebenen Spezialfall fachlich überholt**. Kapitel 08 und 11 enthalten das beschlossene Zielmodell. Der alte Primärwortlaut wird vor finaler normativer Ablösung nachvollziehbar harmonisiert, ohne das bestehende Rechte-/Sicherheitsverfahren vorzeitig technisch zu verändern.

### F-02: Vorläufig angelegter Vorgang – bestehender Mindestbezug

**Quellen:** [Datenmodell](../Datenmodell.md), Kapitel 05. Das ältere Fachmodell verlangt grundsätzlich eine Ereignisbeziehung `Vorgang → Ereignis 1..n`; das neue Modell erlaubt frühe vorläufige Anlage.

**Für das vereinbarte Zielmodell festgehalten:** Auch die automatische vorläufige Vorgangsanlage setzt mindestens ein identifiziertes, gegebenenfalls noch vorläufiges Ereignis voraus. Eine Ausnahme für Vorgänge ohne jeden Ereignisbezug wurde nicht beschlossen. Die genaue technische Verankerung des Bezugs ist nachgelagert.

### F-03: Teilfreigaben – **beschlossen am 26.10.2026**

**Quellen:** [Persistenz-/Lebenszyklusmodell](../Persistenz-und-Lebenszyklusmodell.md) §9; [Wirkungsmodell](../Wirkungsmodell.md) §10; Kap. 05/06/08.

**Verbindliche Entscheidung:** Eine redaktionell bestätigte Teilfreigabe erzeugt einen neuen gültigen bestätigten Gesamtstand aus dem vorigen bestätigten Gesamtstand und ausschließlich den angenommenen Änderungen. Offene und zurückgestellte Vorschläge bleiben davon getrennt erhalten; frühere bestätigte Gesamtstände bleiben rekonstruierbar. Die Ausgestaltung im physischen Datenmodell ist nachgelagert.

## 3. Reine Implementierungs-/Bedienfragen – keine weitere Fachentscheidung nötig

- Speicherform von Analysebausteinen und Versionen, API-Endpunkte, Freigabeaktion und Sperrtechnik.
- Konkreter Schritt-/Dialogaufbau im Themeneditor und Darstellung von Änderungspaketen.
- Scheduling-Infrastruktur für Publikationen, auf Basis des nun festgelegten fassungs- und termingebundenen Bestätigungspunkts.
- Technische Metadaten/Statusspalten zu vorläufigen Ereignissen, wenn ihre fachlichen Grenzen erhalten bleiben.

## 4. Vor Abschluss der Fachkonzeptmigration

- Jede bisher verbindliche **fachliche Primärquellsektion** erhalten, in die Zielkapitel integrieren oder begründet als Technik-/Governancequelle weiterführen.
- Entgegenstehende ältere Regelwortlaute ausdrücklich als geändert markieren; nicht zwei gegensätzliche Regeln zugleich für neu verbindlich erklären.
- Quellen, Querverweise und Entscheidungsnachweise vollständig prüfen.
- F-01 und F-03 als beschlossen behandeln, F-02 ohne erfundene Ausnahme am bestehenden Mindestbezug ausrichten. In der Leseabnahme die konsistente Umsetzung der Beschlüsse kontrollieren, keine bereits gefällten Entscheidungen neu zur Abstimmung stellen.

**Status:** Präzise fachliche Restfragen sichtbar; keine Behauptung einer abgeschlossenen Gesamtregelübernahme.

## 5. Quellengestützte Präzisierung der drei Restfragen

**F-01 ist am 26.10.2026 entschieden:** Die ausdrücklich bestätigte Terminierung einer konkreten freigegebenen Fassung ist die erforderliche gebundene S3-Bestätigung. Vor automatischer Veröffentlichung erfolgt die erneute Gültigkeitsprüfung; eine zweite manuelle Bestätigung ist nicht nötig. Die ältere Primärquelle muss diese fachliche Ausnahme bei der endgültigen Übernahme explizit aufnehmen.

**F-02:** Das ältere Datenmodell nennt für die Beziehung Vorgang zu Ereignis `1..n`. Die neue automatische **vorläufige** Vorgangsanlage ist mit einer solchen Mindestverknüpfung vereinbar, wenn sie aufgrund mindestens eines bereits identifizierten Ereignisses erfolgt. Einen Ereignisbezug vollständig entbehrlich zu machen, ist aus der bisherigen Fachentscheidung **nicht ableitbar**. Daher bleibt die Mindestbeziehung als fachlicher Ausgangspunkt erhalten; technische Anlagezeitpunkte sind später zu modellieren.

**F-03:** Das Persistenzmodell, §9, historisiert die Analysebestandteile über den **bestätigten strukturierten Gesamtstand** des jeweiligen Vorgangs bzw. Themas; eigene unabhängige Versionen für einzelne Wirkungen/Perspektiven sind nicht vorgesehen. Die später bestätigte Möglichkeit, **einzelne Änderungen anzunehmen oder zurückzustellen**, hebt diese Regel nicht automatisch auf. Fachlich naheliegende Lesart ist eine neue Gesamtfassung mit ausschließlich übernommenen Änderungen und eindeutig ausgewiesenen offenen Vorschlägen. Diese Regel wurde am 26.10.2026 verbindlich angenommen.

**Quellen:** `docs/Rollen-Rechte-und-Workflow.md` §6.4; `docs/Persistenz-und-Lebenszyklusmodell.md` §9; `docs/Datenmodell.md`; aktuelle Kapitel 05, 06, 08 und 11.


## 6. Integration in die Prozesskapitel

**F-02:** In Kapitel 05 ist nun ausdrücklich klargestellt, dass eine automatische vorläufige Vorgangsanlage auf **mindestens einem bereits identifizierten, gegebenenfalls selbst noch vorläufigen Ereignis** basiert. Das bewahrt den fachlichen Mindestbezug des Bestandsmodells. Ob es darüber hinaus begründete Fälle einer vorläufigen Anlage *ohne jedes Ereignis* geben soll, ist durch die bisherige Entscheidung nicht gedeckt und wird **nicht stillschweigend zugelassen**. Die technische Umsetzung ist nachgelagert.

**F-03:** Kapitel 05 und 06 trennen bestätigte Aussagen von offenen Vorschlägen und knüpfen die Historisierung weiter an den **bestätigten Gesamtstand**. Die Regel zur neuen gültigen Gesamtfassung nach Teilfreigabe ist am 26.10.2026 beschlossen; die technische Abbildung bleibt offen. Es wird keine zusätzliche eigenständige Teilobjekt-Versionierung eingeführt.

**Priorität:** F-02 ist durch Wahrung der bestehenden Mindestbeziehung für den beschriebenen Regelfall konsistent erläutert; die Entscheidung über mögliche Ausnahmen bleibt nur relevant, wenn solche tatsächlich gewünscht werden. **F-03 wurde am 26.10.2026 entschieden.** F-01 wurde bereits gesondert entschieden.


## 7. Konkrete Entscheidungsgrundlage für F-03

Die bisherigen Entscheidungen tragen bereits folgende Anforderungen: Eine redaktionelle Freigabe darf **einzelne Änderungen** eines Analyse-Änderungspakets annehmen und die übrigen zurückstellen. Bestätigte Aussagen sind geschützt; Analysebestandteile werden über den bestätigten **Gesamtstand des zugehörigen Vorgangs oder Themas** historisiert.

**Fachlich naheliegende, aber noch nicht abgenommene Konsolidierungsregel:**

1. Die Redaktion prüft die einzeln vorgeschlagenen Änderungen anhand ihres Beleg- und Unsicherheitsstands.
2. Bei einer Teilfreigabe entsteht ein **neuer bestätigter Gesamtstand**, der den bisherigen bestätigten Stand mit **ausschließlich den angenommenen Änderungen** verbindet.
3. Nicht angenommene Vorschläge bleiben als offene Änderungen mit Begründung und Bezug zum Ausgangsstand erhalten; sie sind **nicht Bestandteil des bestätigten Stands**.
4. Jede spätere Annahme erzeugt wieder einen nachvollziehbaren bestätigten Gesamtstand. Die Historie früherer Gesamtstände bleibt lesbar.
5. Ein öffentlicher Vorgangs- oder Themenbeitrag kann nur bestätigte, für seine konkrete Aussage ausreichende Erkenntnisse verwenden; fachlich offene Einschätzungen müssen ausdrücklich als ungesichert behandelt werden.

**Prüffall:** Die bisher bestätigte Aussage A bleibt richtig. Das Änderungspaket enthält neue Aussagen B und C. Die Redaktion bestätigt B, stellt C zurück. Der neue bestätigte Gesamtstand umfasst A+B; C verbleibt als offener Vorschlag. Es entsteht keine eigenständige verbindliche „Version von B“, die das Gesamtversionsmodell unterläuft.

**Entscheidungspunkt für die gemeinsame Leseabnahme:** Soll dieser Grundsatz in Kapitel 05, 06 und 08 als endgültige fachliche Regel gelten? Die genaue Speicherung ist ausdrücklich nicht Teil der Entscheidung.



**Entscheidung 26.10.2026:** F-03 angenommen. Bei Teilfreigabe entsteht ein neuer bestätigter Gesamtstand mit den angenommenen Änderungen; offene Vorschläge bleiben getrennt.
