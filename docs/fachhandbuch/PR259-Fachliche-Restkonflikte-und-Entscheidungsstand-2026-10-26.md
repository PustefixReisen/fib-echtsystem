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

## 2. Offene **fachliche** Klärung bzw. normative Harmonisierung

### F-01: Veröffentlichung mit Termin versus unmittelbar bestätigter S3-Aktion

**Quelle:** [Rollen, Rechte und Workflow](../Rollen-Rechte-und-Workflow.md), insbesondere §6.4: „S3 benötigt immer eine unmittelbare explizite Bestätigung unmittelbar vor der Ausführung“. **Ziel:** Kap. 08 und 11 erlauben das *Planen* einer späteren Veröffentlichung samt erneuter Prüfung vor Ausführung.

**Widerspruch:** Eine menschliche Bestätigung bei der Terminplanung ist zeitlich nicht notwendigerweise „unmittelbar vor der Ausführung“. Es darf weder stillschweigend eine unautorisierte automatische Publikation eingeführt noch das fachlich vorgesehene Planen ausgeblendet werden.

**Bis zur Fachentscheidung:** Geplante Veröffentlichung als vorgesehenes Ziel dokumentieren; tatsächliche Ausführung nur mit erfüllten geltenden S3-Anforderungen. Der genaue gültige Bestätigungszeitpunkt muss fachlich widerspruchsfrei entschieden werden, bevor die neue Primärregel verbindlich wird. Dies ist **kein bloßes SQL-/UI-Thema**.

### F-02: Vorläufig angelegter Vorgang und ältere Kardinalität

**Quellen:** [Datenmodell](../Datenmodell.md), Kapitel 05. Das ältere Fachmodell verlangt grundsätzlich eine Ereignisbeziehung `Vorgang → Ereignis 1..n`; das neue Modell erlaubt frühe vorläufige Anlage.

**Klärungsbedarf:** Gilt der Mindestbezug bereits bei jedem automatischen vorläufigen Vorgang oder erst nach fachlicher Bestätigung? Solange offen, vorläufige Vorgänge grundsätzlich an mindestens einem **nachweisbaren Bezugsevent** ausrichten und fachliche Ausnahmen ausdrücklich nachweisen statt stillschweigend zuzulassen.

### F-03: Status- und Freigabewirksamkeit von Teilanalysen

**Quellen:** [Persistenz-/Lebenszyklusmodell](../Persistenz-und-Lebenszyklusmodell.md) §9; [Wirkungsmodell](../Wirkungsmodell.md) §10; Kap. 05/06/08.

**Bereits entschieden:** Aussagenbezogene redaktionelle Teilfreigabe möglich, Übernahme einzelner Änderungsvorschläge möglich, bestätigte Aussagen geschützt. **Offen:** Was ist bei teilweise bestätigter Analyse der für spätere öffentliche Beiträge verbindliche „gültige Gesamtstand“? Ein fachlicher Konsolidierungsgrundsatz (nachvollziehbare gültige Aussagen, ausdrücklich ausgeschlossene Entwurfsbehauptungen, historischer Bezug) ist vor der normativen Freigabe noch präzise festzulegen; konkrete Datenbankstruktur erst danach.

## 3. Reine Implementierungs-/Bedienfragen – keine weitere Fachentscheidung nötig

- Speicherform von Analysebausteinen und Versionen, API-Endpunkte, Freigabeaktion und Sperrtechnik.
- Konkreter Schritt-/Dialogaufbau im Themeneditor und Darstellung von Änderungspaketen.
- Scheduling-Infrastruktur für Publikationen, nachdem der fachliche S3-Bestätigungszeitpunkt geklärt wurde.
- Technische Metadaten/Statusspalten zu vorläufigen Ereignissen, wenn ihre fachlichen Grenzen erhalten bleiben.

## 4. Vor Abschluss der Fachkonzeptmigration

- Jede bisher verbindliche **fachliche Primärquellsektion** erhalten, in die Zielkapitel integrieren oder begründet als Technik-/Governancequelle weiterführen.
- Entgegenstehende ältere Regelwortlaute ausdrücklich als geändert markieren; nicht zwei gegensätzliche Regeln zugleich für neu verbindlich erklären.
- Quellen, Querverweise und Entscheidungsnachweise vollständig prüfen.
- Die drei offenen Fachpunkte **F-01 bis F-03** in der gemeinsamen Leseabnahme konkret und gebündelt entscheiden, nicht mit SQL-/UI-Rückfragen vermischen.

**Status:** Präzise fachliche Restfragen sichtbar; keine Behauptung einer abgeschlossenen Gesamtregelübernahme.
