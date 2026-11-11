# RIS-Fachabnahme – Dokumentationsabgleich vom 11.11.2026

## Grundlage und Geltungsbereich

Auftrag ist [Issue #427](https://github.com/PustefixReisen/fib-echtsystem/issues/427). Der Betreiber hat den RIS-Funktionsumfang am 11.11.2026 nach Desktop- und Firefox-Prüfung bei 412 px fachlich abgenommen. Die Implementierungsgrundlagen sind PR #422, #424 und #426 sowie die Nacharbeiten #423 und #425. Ausgangspunkt dieses Dokumentationsabgleichs ist `main` mit Commit `7aee21c94b10e9616653790819bec5639ce10e17`.

Die Prüfung dieses Pakets betrifft den Text, die Fachbeziehungen und die Verweise. Sie ersetzt oder wiederholt keine Anwendungs-, Datenbank- oder Bereitstellungsabnahme. Aktuelle Programmdateien wurden nur lesend als Umsetzungsnachweis herangezogen, insbesondere RIS-Import, Sitzungsansicht und der Schutz von TOP-Ereignissen.

## Ersetzte Regeln und fachlicher Abgleich

| Akzeptanzfall | Neuer verbindlicher Stand | Prüfergebnis |
|---|---|---|
| RIS-Bearbeitung | Importierte Angaben und automatisch erzeugte Beziehungen sind redaktionell unveränderlich. Auch die allgemeine Ereignisverwaltung eröffnet keinen Schreibweg. | Bestätigt im Kapitel- und Rechteabgleich. |
| Ereignisidentität | Genau ein eigenes automatisches TOP-Ereignis je TOP. Keine Sitzungsereignisse, zusätzlichen TOP-Ereignisse oder Zuordnungen fremder Ereignisse an TOPs. | Bestätigt in Strukturdiagrammen, Kardinalitäten, Ereignis- und Sitzungsprozess. |
| Fundstellen | TOP-Dokumente werden automatisch ihrem TOP-Ereignis zugeordnet. Die Niederschrift ist gemeinsame Fundstelle aller TOP-Ereignisse der Sitzung. | Bestätigt im Recherche-, Daten- und Sitzungsmodell. |
| Beschlussergebnis | Belegter Status und mehrere getrennte Abstimmungen aus verfügbaren amtlichen Nachweisen. Fehlende Ergebnisse werden nicht erfunden. | Bestätigt in Prozess, Qualitätsregeln und Darstellungsbeschreibung. |
| Bedienung | Eine Sitzungsseite mit Sitzungsübersicht und öffentlichen TOPs, amtlichen Links und Ergebnissen. Live-Suche, zusammengehörige Links und Navigation, Desktop und 412 px. | Beschreibung gegen die abgenommene UI abgeglichen. Keine erneute Browserabnahme in diesem Dokumentationsauftrag. |
| Redaktionelle Folgeobjekte | Meldungen, Vorgänge und Themen folgen ihren eigenen Regeln. Sie ändern keine RIS-Importdaten und entstehen nicht allein durch den Import automatisch. | Bestätigt in Kapiteln 04–06, 08, 09 und 11. |
| Paket B | Strukturierte Inhaltsanalyse ist Zukunftskonzept und noch nicht implementiert. Keine manuelle RIS-Analysefreigabe geplant. | In Primärkapitel, Übergaben, Lesefassung und Roadmap ausdrücklich abgegrenzt. |
| Testdaten | Der bisherige fachliche Bestand ist Testbestand. Kontrollierter Neuaufbau nach Zugehörigkeitsprüfung, technische Wiederherstellbarkeit und Schutz von Shared-Apps. | Persistenz-, Entwicklungsdaten- und Administrationsregeln abgeglichen. |
| Originaltexte | Nachvollziehbare Fundstellen und Provenienz. Dauerhafte Speicherung nur mit dokumentiertem Speicherrecht, öffentliche Nutzung separat prüfen. | Pauschale Volltext-Vorhaltepflicht entfernt. ADR-012 auf die weiter geltende Speicherentscheidung begrenzt. |
| Herkunft | Frühere Fachstände bleiben nachvollziehbar, aktuelle Regeln stehen im Handbuch. | Historisches Sitzungsmodell durch Weiterleitung ersetzt. Datierten technischen Berichten wird keine aktuelle Fachgeltung zugeschrieben. |

Primärstelle ist [Kapitel 07](../fachhandbuch/07-Sitzungen-und-Beschluesse-Entwurf-2026-10-26.md). Die dort erstmals zusammengeführten fünf RIS-Regelkennungen dienen der Nachverfolgung dieser bereits abgenommenen Festlegungen. Die bestehenden 54 Recherche- und 32 Themen-Regelkennungen bleiben erhalten.

## Aktualisierte Dateien

| Gruppe | Dateien und Zweck |
|---|---|
| Handbuchkapitel 01–03 | [01 Grundlagen](../fachhandbuch/01-Grundlagen-und-Zielsetzung-Entwurf-2026-10-26.md) mit korrigierter Geltungsangabe. [02 Strukturmodell](../fachhandbuch/02-Struktur-und-Wissensmodell-Leseentwurf-2026-10-26.md) mit 1:1-TOP-Ereignis. [03 Recherche](../fachhandbuch/03-Recherche.md) mit automatischer RIS-Übergabe und getrennten Pressefundstellen. |
| Handbuchkapitel 04–06 | [04 Ereignisse und Meldungen](../fachhandbuch/04-Ereignisse-und-Meldungen-Entwurf-2026-10-26.md), [05 Vorgänge](../fachhandbuch/05-Vorgaenge-und-Vorgangsanalysen-Entwurf-2026-10-26.md), [06 Themen](../fachhandbuch/06-Themen.md) mit geschütztem TOP-Ereignis und begrenztem Umsetzungsnachweis. |
| Handbuchkapitel 07–09 | [07 Sitzungen](../fachhandbuch/07-Sitzungen-und-Beschluesse-Entwurf-2026-10-26.md) als vollständiger aktueller RIS-Prozess. [08 Redaktion](../fachhandbuch/08-Redaktion-und-Veroeffentlichung-Entwurf-2026-10-26.md) und [09 Besuchersystem](../fachhandbuch/09-Oeffentliches-FIB-Angebot-Entwurf-2026-10-26.md) mit getrennten Folgeprozessen und öffentlichem Zielbild. |
| Handbuchkapitel 10–11 | [10 Qualität](../fachhandbuch/10-Qualitaetssicherung-Entwurf-2026-10-26.md) mit Import-/Rechteprüfung. [11 Fachrechte](../fachhandbuch/11-Fachliche-Rollen-und-Rechte-Entwurf-2026-10-26.md) mit unveränderlichem RIS-Bestand auch für Administratoren. |
| Handbucheinstieg | [README](../fachhandbuch/README.md), [Arbeitsstand](../fachhandbuch/ARBEITSSTAND-UND-WIEDEREINSTIEG.md), [Gesamtlesefassung](../fachhandbuch/FIB-Fachkonzept-Gesamtlesefassung-2026-10-27.md) mit aktueller Geltung und Abnahme sowie reparierten Kapitelverweisen. |
| Fachmodell und Herkunft | [Datenmodell](../Datenmodell.md), [Begriffe](../Begriffe.md), [Fachkonzept](../Fachkonzept.md), [Sitzungsmodell als Weiterleitung](../Sitzungs-und-Beschlussmodell.md), [Persistenzmodell](../Persistenz-und-Lebenszyklusmodell.md). |
| Recherche, Redaktion und Rechte | [Quellenmonitor](../Recherche-und-Quellenmonitor.md), [KI-Leitfaden](../KI-Leitfaden.md), [MVP-Fachfunktionen](../MVP-Fachfunktionen.md), [Redaktionsworkflow](../Redaktionsworkflow.md), [Rollen und Rechte](../Rollen-Rechte-und-Workflow.md), [Plausibilitätsregeln](../Fachliche-Plausibilitaets-und-Freigaberegeln.md). |
| Darstellung und Betriebseinordnung | [Redaktions-UI](../Redaktionssystem-UI-Konzept.md), [öffentliche UX](../UX-und-Informationsarchitektur.md), [Go-live-Kriterien](../Go-live-Abnahmekriterien.md), [Entwicklungs-/Echtdaten](../Entwicklungs-Referenz-und-Echtdaten.md), [ADR-012](../decisions/ADR-012-RIS-Originale-und-Ereignisbeziehungen.md). |
| Dokumentationssteuerung | [Dokumentationslandkarte](../Dokumentation.md), [Roadmap](../Roadmap.md), dieser Änderungsnachweis. |
| Dokumentationsprüfung | [Documentation CI](../../.github/workflows/documentation-ci.yml) prüft geänderte Markdown-Dateien auf lokale Linkziele, vollständige Code-/Details-Blöcke, Konfliktmarker und erhaltene Regelkennungen. |

## Prüfverfahren und Ergebnis

- Kapitelübergreifender Textabgleich gegen jede Vorgabe aus #427 und den unveränderlichen Import-/UI-Umfang aus PR #422, #424 und #426.
- Abgleich der Strukturdiagramme und Kardinalitäten sowie der Beispiele für Vorlage, Niederschrift und mehrere Abstimmungen. Die Referenzsitzungen bleiben mit 19 und 12 öffentlichen TOPs dokumentiert.
- Prüfung lokaler Markdown-Linkziele und vollständiger Markdown-/Details-Blöcke. Regelkennungen werden gegen den Ausgangsstand geprüft.
- `git diff --check` und Prüfung des Dateiumfangs. Geändert werden Markdown-Dokumente und der ausschließlich lesende Dokumentations-Prüfworkflow.
- CI-Ergebnis und Merge sind im zu #427 gehörigen Pull Request nachgewiesen. Die erfolgreiche Dokumentationsprüfung bestätigt diese Dokumentationsänderung.

## Verbleibender Umfang

Für die abgenommenen RIS-Grundregeln ist im Abgleich keine neue fachliche Entscheidung erforderlich. Paket B zur strukturierten Inhaltsanalyse erhält eine gesonderte Konkretisierung. Die automatische Auswirkung auf Meldungen, Vorgänge und Themen muss dort anhand der bestehenden Folgeprozesse beschrieben werden. Der allgemeine demokratisch-gesellschaftliche Referenzrahmen bleibt eine bereits zuvor benannte offene Fachfrage außerhalb dieses RIS-Pakets.

Offene ältere Dokumentations-PRs, insbesondere #392 zur früheren RIS-Konzeption und #415 zur allgemeinen IG-1-Automatik, wurden als parallele Arbeiten geprüft. Beim späteren Übernehmen dürfen sie den hier dokumentierten, jüngeren RIS-Stand nicht überschreiben. Sie werden durch dieses Paket nicht zusammengeführt.
