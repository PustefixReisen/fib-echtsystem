# Issue #136 – technischer Abgleich: Themenbeziehungen und redaktionelle Bestätigung

**Stand:** 19.10.2026  
**Status:** Entwicklungsanalyse, keine produktive Änderung

## Verbindlicher fachlicher Bezug

- `docs/Themen-und-Vorgangslogik.md` §5.4: „Bedeutung für das Thema“ mit *prägend*, *relevant*, *ergänzend*. KI schlägt vor; erst die Redaktion prüft und bestätigt die Bedeutung.
- `docs/Begriffe.md` §3: Wirkungsrolle ist **kein** eigenständiges Merkmal; Bedeutung und konkrete Perspektiven/Wirkungen bleiben getrennt.
- `docs/Datenmodell.md`: konsolidierter Integrationsbezug.

## Live-Schema geprüft, ohne Datenänderungen

- `fib.topics`: 0 Zeilen.
- `fib.processes`: 4 als Entwicklung gekennzeichnete Vorgänge, darunter `demo-20261013-kreuz-ost`.
- `fib.process_topics`: 0; Primärschlüssel `(process_id, topic_id)`.
- `fib.event_topics`: 0; Primärschlüssel `(event_id, topic_id)`.
- Beide Beziehungstabellen erzwingen `significance NOT NULL` und `CHECK (significance IN ('defining','relevant','supplementary'))`. `significance_rationale` ist optional.
- **Lücke:** Keine Spalten für Vorschlag, Prüfung, bestätigende Person oder Zeitpunkt. Ein unbestätigter KI-Vorschlag dürfte deshalb keinesfalls unmittelbar in `significance` gespeichert werden.

## Vorgehen für den ersten Umsetzungsschnitt

1. Zuerst technische Datenmodell-Erweiterung für **Entwurf/Vorschlag versus verbindliche Bestätigung** festlegen; bestehende Primärdokumente auf Widersprüche prüfen.
2. Serverautorisierter API-Schreibpfad nur für aktive FIB-Redaktionsmitglieder mit bestätigter MFA (AAL2); keine direkten Browser-Schreibrechte. Statusprüfung serverseitig.
3. Redaktion soll einen KI-Vorschlag sehen, prüfen, ändern, begründen und ausdrücklich bestätigen können. Vor Bestätigung keine aktive Themenbeziehung und keine automatische öffentliche Ausspielung.
4. Im Redaktionssystem Thema „Mobilitätsentwicklung Feldkirchen“ als **Entwicklungsdaten** anlegen bzw. auswählen und vorhandenen Vorgang `demo-20261013-kreuz-ost` ohne Duplikat zuordnen.
5. Tests für Statusübergänge, Fachwerte, Rechte, Wiederholungsaufrufe, Dubletten und Nichtveröffentlichung; anschließend CI, PR-Review, Merge, gesonderte Bereitstellung.

## Offene technische Entscheidung

Zwei grundsätzlich mögliche Modelle:
- separate Vorschlagstabelle mit redaktionellem Bestätigungsereignis und anschließender Übernahme in die bestehenden Beziehungen;
- zusätzliche Workflow-Spalten in beiden Beziehungstabellen, einschließlich expliziter Bestätigungsmetadaten.

**Entscheidung noch nicht getroffen.** Vor der produktiven Migration ist die Konsistenz mit dem FIB-Audit-/Versionskonzept zu prüfen. Keine stillschweigende Vorbelegung vorhandener Beziehungen als „bestätigt“.
