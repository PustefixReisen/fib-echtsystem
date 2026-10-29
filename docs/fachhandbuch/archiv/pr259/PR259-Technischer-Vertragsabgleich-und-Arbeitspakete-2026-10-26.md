# PR #259 – Technischer Vertragsabgleich und Entwicklungsaufträge

**26.10.2026 · Repository-Inspektion (statische Quellprüfung).** Grundlage: `supabase/schema/core.sql`, migrations `20261020160000_fib_topic_contribution_lifecycle.sql`, `20261021170000_local_link_status_model.sql`, Fachservice `supabase/functions/fib-topic-editor/index.ts`, Redaktionsoberfläche `apps/editorial-web/src/App.tsx`, Datenmodell und Rechtequelle. **Kein Beleg für den produktiven DB-Iststand, keine ausgeführten API-/Browser-/SQL-Tests.** `schema/core.sql` nennt sich selbst **technischer Entwurf, keine ausgeführte Migration**.

## 1. Vertragsabweichungen (Fachanforderung ↔ Repository)

| Priorität | Fachliche Anforderung | Im Repository tatsächlich beobachteter Anhaltspunkt | Konsequenz |
|---|---|---|---|
| P0 | KI darf vorläufige Ereignisse reversibel anlegen; bestätigte Inhalte schützen | `supabase/schema/core.sql`: `fib.events.status` nur `confirmed/withdrawn/merged`, Default `confirmed`; neue Vorläufigkeitsabbildung nicht aus dieser Basistabelle ableitbar | Status-/Schreibvertrag der **tatsächlich angewandten** Migrationen und Services prüfen; vorläufigen Zustand ohne Freigabeeskalation modellieren; Datenmigration erst danach |
| P0 | Vorgangsbeitrag mit redaktioneller Fassung, Freigabe und eigener Veröffentlichung | `fib.processes` im Basisschema: Beschreibung und `current_state`, aber keine ausgewiesenen Versionen/Freigaben/Publikationshistorie; Themen haben dagegen `topic_contribution_drafts/versions/publications` in einer separaten Migration | Eigenen fachlichen Vorgangsbeitragsvertrag entwerfen, inklusive Fassungsidentität, Sperren, Rechte, Audit und Zugriff |
| P0 | Themenanalyse mit Teilfreigabe und eigener fachlicher Gültigkeit | Themen-Beitragsmigration implementiert `topic_revisions` und beitragsbezogene Versionen; aus den eingesehenen Tabellen ergibt sich **kein vollständiger eigenständiger Analyse-Teilfreigabevertrag** | Analysebausteine, Referenzen, Teilfreigabe, Änderungs-/Gültigkeitsstände definieren und nach DB/Service-Check umsetzen |
| P0 | „Mehr wissen?“ auch an Vorgang, genau ein primärer Kontext | `docs/Mehr-wissen-Modell.md` §2 und §8 kennen als primären Kontext ausschließlich Meldung oder Thema; das Basisschema enthält keine Vertiefungsfrage-/Antworttabellen | Fachmodell erweitern, persistente Zuordnung und Autorisierung ergänzen; danach Editor und öffentliches Angebot |
| P1 | Öffentliche Meldungsliste mit bedarfsabhängiger Vorgangsgruppen-Darstellung | `apps/public-web/` enthält im geprüften Default-Branch ein README, keine fertige Besucheranwendung; `apps/editorial-web/src/App.tsx` ist die Redaktions-UI | Öffentliche UI separat planen; eine Meldung bleibt eine Identität, Gruppierung ausschließlich in der Darstellung |
| P1 | RIS-Überwachung plus Sitzungs-/Beschlussaufbereitung | Im Basisschema sind Events/Fundstellen, aber nicht alle Sitzungs-/TOP-/Beschlusspunkttypen des `docs/Sitzungs-und-Beschlussmodell.md` enthalten | Migrationsstand separat prüfen; RIS-Quellenabruf und fachliche Session-Verarbeitung sauber trennen |
| P1 | Vier Bereiche im Themeneditor: Definition – Bezüge – Analyse – Beitrag | `App.tsx` enthält Themenbearbeitung und Beitragsbereich; aus bisherigen API-/UI-Dateien folgt noch keine verifizierte vollständige eigenständige Analysefreigabe | UI- und API-Vertrag gegen vier Bereiche und Analysefreigabe prüfen, erst anschließend umsetzen |
| P1 | Geplante Veröffentlichung mit erneuter Sicherheitsprüfung | `fib-topic-editor/index.ts` kennt serverseitige Beitragspublikationsaktionen; eigenständiger Zeitplan- und Revalidierungsnachweis wurde in dieser Sichtung nicht gefunden | Transaktion, explizite Bestätigung, Veröffentlichungszeitpunkt und Revalidation implementierungsseitig verifizieren |
| P1 | 4 Fundstellen-Prüfstatus und Quellenstatus mit Pflichtquellen-Kennzeichen | Basisschema `fib.sources.active:boolean`, `fib.findings` ohne entsprechendes vierstufiges Prüfstatusfeld | Live-/Migrationsstand und Fachservices gegen normatives Statusmodell prüfen, dann neue Felder/Übergänge planen |
| P1 | K0-Publikation der Themenbeiträge | Die Redaktionsoberfläche enthält Hinweis: „Öffentliche Veröffentlichung wird erst mit dem K0-Publikationsprozess verfügbar.“ | Interne Publikationsmarkierung ist **nicht gleich** nachgewiesene öffentliche Ausspielung. Öffentlichen K0-Prozess getrennt testen |

## 2. Risikobegrenzte Umsetzungsblöcke

### T1 ([Issue #260](https://github.com/PustefixReisen/fib-echtsystem/issues/260)): Ereignis-Vorläufigkeit und Fundstellenprüfung

**Ziel:** KI-basierte Erfassung vorläufiger Ereignisse ohne neue Verbindlichkeit oder automatische Fundstellenfreigabe.

- Aktuelle DB-Struktur und bestehende Runtime-Services prüfen; **keine** alleinige Ableitung aus `schema/core.sql`.
- Vorläufigkeit und bestätigte Ereignisse strikt unterscheiden.
- Schreibrechte an genaue Aktionen/Objektzustände und FIB-Anwendungsbenutzer binden.
- Regression: R01, R02, R04, R07 aus [Testplan](PR259-Abschlusspruefung-und-Regression-2026-10-26.md).
- **Isolation:** ausschließlich Schema `fib`, kein Eingriff in Shared-Apps-`public`/Memorix.

### T2 ([Issue #261](https://github.com/PustefixReisen/fib-echtsystem/issues/261)): Vorgangsbeitrag und Vorgangsanalyse

**Ziel:** Fachmodell Vorgangsanalyse → Vorgangsbeitrag → Beitragsfreigabe → Veröffentlichung. Der Beitrag enthält Hintergrund, Erklärungen, Erkenntnisse und Sachstand.

- Beitragsentwurf, fixierte Version und Publikationshistorie getrennt führen; Thema-Muster als technische Referenz, **nicht** blind kopieren.
- Alle freigegebenen Fassungen unveränderlich; spätere Änderung neue Fassung.
- Aktuell freigegebene, aktuell veröffentlichte und aktuelle Arbeitsfassung auseinanderhalten.
- Rechte, Sperren, Dokumentationsbelege und getrennte Veröffentlichung sichern.
- Regression: R09, R14, R18.

### T3 ([Issue #262](https://github.com/PustefixReisen/fib-echtsystem/issues/262)): Analyse- und Themenlebenszyklus

**Ziel:** Verschiedene Freigabeebenen bei unverändertem Thema-Statusmodell und ohne Pflicht-Beobachtungsauftrag.

- Analysebausteine, Erkenntnisse und begründete Wirkungen nachvollziehbar abbilden; Aussage-/Abschnittsbezogene Teilfreigabe prüfen.
- `topic_contribution_versions` und `topic_publications` mit aktuellen Serviceregeln auf Bestandskonformität prüfen.
- Die erste **Beitragsfreigabe** aktiviert das Thema; Analysefreigabe nicht.
- Vier Arbeitsbereiche in der UI konzeptionell erproben; keine künstlichen vier Pflichtfreigaben.
- Regression: R10–R13, R19.

### T4 ([Issue #263](https://github.com/PustefixReisen/fib-echtsystem/issues/263)): „Mehr wissen?“ für drei öffentliche Einstiege

- Bestehendes fachliches Modell um Vorgang erweitern, ohne offene interne Wissensfragen mit öffentlichen Vertiefungsfragen zu vermengen.
- Eine Vertiefungsfrage hat **genau einen** primären Bezug (Meldung, Vorgang oder Thema); Antworten quellen- und versionsgebunden.
- Redaktionelle Freigabe und S3-Veröffentlichung getrennt prüfen.
- Regression: R15.

### T5 ([Issue #264](https://github.com/PustefixReisen/fib-echtsystem/issues/264)): Öffentliche Ausgabe und RIS

- Öffentlichen Web-Ausgabepfad K0 und stabile URLs prüfen.
- Vorgangsbeitrag, Meldungsverlauf und verdichtete „Neues“-Liste konsistent aus **einer** Meldungsidentität ableiten.
- RIS: Fundstelle/Beschlussvorlage von Sitzung, TOP, tatsächlich gefasstem Beschluss und Niederschrift trennen.
- Regression: R03, R16, R17.

## 3. Abnahme- und Umsetzungsschutz

1. **Kein Deployment und keine produktive Datenmigration** nur aufgrund dieser statischen Dokumentenprüfung.
2. Für SQL vorab Schema-Diff gegen **echten** Shared-Apps-FIB-Stand, vorhandene Migrationshistorie und Tests; an anderen Anwendungen oder Auth nichts ändern.
3. Jede Fachservice-Änderung benötigt Rollen-/Zustandsprüfung, Concurrency- und Sperrkonzept sowie überprüfbare Rücknahmebedingungen.
4. T1–T5 in **separaten Implementierungs-PRs** mit zielgerichteten SQL-/Service-/UI-Tests; PR #259 bleibt ein Dokumentations-PR.
5. Dokumentation + Code + DB müssen fachlich konsistent werden, bevor eine Änderung als abgeschlossen gilt.
6. Jede Zeile im Testplan ist erst nach realer Testausführung und dokumentiertem Ergebnis „bestanden“; die Tabelle liefert noch keine Testergebnisse.
