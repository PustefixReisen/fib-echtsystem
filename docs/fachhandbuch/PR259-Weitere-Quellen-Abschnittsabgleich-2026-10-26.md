# PR #259 – Weitere Primärquellen: abschnittsorientierter Übernahmeabgleich

**Stand 26.10.2026 · Textprüfung mehrerer Bestandsquellen · keine Gesamtabnahme.** Die bisherigen Primärquellen bleiben gültig. Diese Zuordnung ist die Arbeitsgrundlage für den späteren **abschnittsweisen** Umzug, nicht allein ein dokumentbezogener Ersatz.

## Leseprinzip

Jede Primärquelle wird nach ihrem **fachlichen Gehalt** zugeordnet. Reine technische Berechtigungen, SQL-/RLS-Entwürfe, Implementierung, Betriebs- und Security-Verfahren verbleiben in den technischen Dokumenten. Kapitel 01–11 erklären Zweck und Arbeitsablauf und führen die zuständigen Detailregeln, nicht beliebige Kopien anderer Primärquellen.

## Quellen und zugehörige Abschnitte

| Ursprüngliche Primärquelle und geprüfter Abschnitt | Ziel im Fachhandbuch | Übernahmestand / Prüfung |
|---|---|---|
| [Fachkonzept](../Fachkonzept.md) §§1–3: Zweck, Zielbild, direkter/mittelbarer Feldkirchen-Bezug | 01; operative Suchabdeckung 03 | Ziel als Fachtext vorhanden, quantitative Detailregeln in 03-Referenz; Grenzfälle prüfen |
| Fachkonzept §§4–5: Inhaltsobjekte, „Unsere Einordnung“, Beziehungen | 02; Ausgaben 04–09 | Grundstruktur vorhanden; Begriffe Meldung/Beitrag/Vorgangsbeitrag bereinigen |
| [Begriffe](../Begriffe.md) §§2–4: Objekte, Perspektive, Wirkung, Bewertung | 02, 05, 06; sprachliche Grenzen 10 | Noch keine überprüfte eins-zu-eins Übernahme aller Definitionen |
| Begriffe §§5–9: Redaktion, Rollen, Recherche/AI, „Mehr wissen?“ | 03, 08, 09, 11 | Wortlaute und Haupt-/Nebenbegriffe abgleichen; spätere automatisch ableitbare Sekundärsicht |
| [Themen- und Vorgangslogik](../Themen-und-Vorgangslogik.md): Abgrenzung/Entdeckung, Bezüge, Bedeutung und Lebenszyklus | 05/06, Publikationsübergabe 08 | Ziele beschrieben, Detailregeln 06-Referenz; Statusmatrix prüfen |
| [Wirkungsmodell](../Wirkungsmodell.md) §§2–9: ereignisbezogene Wirkung, Perspektive, Anti-Doppelzählung | 02, 05, 06 | Einzelwirkung am Ereignis behalten; unabhängige analytische Erkenntnis nicht künstlich an Ereignis binden |
| Wirkungsmodell §§10–12: Versionierung/Belege/Persistenz | 05, 06; technische Persistenz separat | Versionierungsentscheidung im neuen Analysemodell offen |
| [Recherche- und Quellenmonitor](../Recherche-und-Quellenmonitor.md) §§2–15: Wege, Pflichtquellen, Suche, Fundstellen, Relevanz, Fehler | 03, Ausnahme-Sitzungen 07 | 53 RECH-Regeln in Referenz übernommen; **nicht** vollständiger Abschnittsabgleich dieses anderen Dokuments |
| Recherche- und Quellenmonitor: Regelverwaltung und Regeltests | 03, 10 | Bewertungs- und Entdeckungswirkung getrennt prüfen; operativen Regelstand versionieren |
| [Sitzungs- und Beschlussmodell](../Sitzungs-und-Beschlussmodell.md) §§3 ff.: Vorlage, Sitzung, TOP, Beschluss, Niederschrift | 07; öffentliche Ansicht 09 | Fachliche Trennung vorhanden; exakte Daten-/Statusübergänge noch nicht migriert |
| [Redaktionsworkflow](../Redaktionsworkflow.md): Recherchebezüge, Analysen, Entscheidungen, Freigabe, Rollen | 03–08/11 | Kapitelorientierung vorhanden; genaue Teilfreigaben, Korrekturen und Sperren offen |
| [Plausibilitäts-/Freigaberegeln](../Fachliche-Plausibilitaets-und-Freigaberegeln.md) §§2–8: harte und weiche Prüfungen, Dateien und Bilder | 08, 10, 11 | Schwerer nachgewiesener Fehler als Sperre; ungesicherte KI-Warnung als Hinweis; technische Enforcement-Kriterien offen |
| [„Mehr wissen?“-Modell](../Mehr-wissen-Modell.md) §§1–10: Vertiefungsfrage und Antwort | 09; Rechte 11; Quellen 10 | **Abweichung bestätigt:** alter Primärkontext nur Meldung/Thema, künftig auch Vorgang; Freigabe-/Quellen-/Versionspflicht erhalten |
| [UX- und Informationsarchitektur](../UX-und-Informationsarchitektur.md): „Neues“, „Im Blick“, Sitzungen, Suche, „Mehr wissen?“ | 09 | Einstiegstypen erhalten; verdichtete Meldungsgruppen und Vorgangsbeitrag neu; UI erst später erproben |
| [Rollen/Rechte/Workflow](../Rollen-Rechte-und-Workflow.md) §§2–9: Rolle, Stufen, Rechte, Bestätigungen, Sperren | 11, Prozesszusammenhänge 08 | Grundmodell vorhanden; S0/S1 vorläufige Ereignisse und S3 geplanter Publish noch abgleichen |
| Rollen/Rechte/Workflow §§10–13: MFA, RLS, Fachservice, Audit | fachliche Wirkung 11; technische Primärquelle bleibt | Kein paralleles Auth-/RLS-Regelwerk im Fachhandbuch errichten |
| [Persistenz-/Lebenszyklusmodell](../Persistenz-und-Lebenszyklusmodell.md) §§2–11: Identität, Status, Beziehungen, Korrekturen | 02, 04–09 | Fachliches Ziel in Entwürfen; Datenverträge und Analyse-/Vorgangsbeitrags-Versionierung noch offen |
| [Sprachleitfaden](../Sprachleitfaden.md): bürgernahe Erläuterung und Einordnung | 10 | Qualitätsanforderungen lesbar; Detailkriterien vor normativer Übernahme prüfen |
| [KI-Leitfaden](../KI-Leitfaden.md) und [KI-Qualität](../KI-Qualitaet-und-Modellunabhaengigkeit.md) | 03/08/10; technischer Betrieb separat | KI-Aufgaben, Transparenz und Mindestqualität im Grundsatz; providerbezogene Technik bleibt außerhalb des Fachhandbuchs |
| [Navigation Redaktion/Recherche](../Navigation-Inhalte-Redaktion-Recherche.md) | 08; öffentliche Navigation 09 getrennt | Arbeits-/Zugangskontext und Trennung interne/öffentliche Navigation berücksichtigen |

## Ausdrückliche fachliche Abweichungen gegenüber den noch gültigen Quellen

1. **FIB-RECH-SICHTUNG-001:** keine menschliche Einzelprüfung aller örtlichen Fundstellen mehr; Fundstellen sichtbar, KI-Vorbewertung, Prüfauftrag nur bei entscheidungsrelevantem Anlass.
2. **Themenfreigabe:** ausgeführter Beobachtungsauftrag nicht mehr verpflichtend; geprüfte Analyse ist inhaltliche Grundlage; Analysefreigabe allein verändert Themenstatus nicht.
3. **Vier Arbeitsbereiche** statt altem dreiteiligen Themeneditor – kein zusätzlicher Pflichtstatus.
4. **Öffentlicher Vorgang:** eigener Vorgangsbeitrag (mit Sachstand, Hintergrund, Erklärungen, Erkenntnissen) samt getrennter Freigabe/Veröffentlichung.
5. **„Mehr wissen?“** zusätzlich beim Vorgang; jede Vertiefungsfrage weiterhin genau einem primären Kontext zugeordnet.
6. **Neues:** bei Bedarf Darstellung mehrerer Meldungen eines Vorgangs verdichten, keine Datenobjekte zusammenführen.
7. **Vorläufige Ereignisse** können automatisiert entstehen, bestätigte Ereignisse bleiben vor stillschweigender KI-Änderung geschützt.

Diese fachlichen Änderungen dürfen bei der endgültigen Normmigration **nicht als wortgetreue Übernahmen** verbucht werden.

## Freigabebedingung

Jede oben verzeichnete Ausgangssektion benötigt einen **nachgewiesenen Zieltext oder begründeten Ausschluss**, Prüfung ihrer Detailregeln und gültige Querverweise. Bis dahin bleibt die Quellspalte normative Primärstelle. Erst nach dem vollständigen Abgleich und geeigneten Tests darf dieses Dokument als Abnahmebeleg dienen. 
