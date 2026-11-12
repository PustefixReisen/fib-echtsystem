# FIB – Entscheidung: gemeinsamer Fundstellenabstract-Dienst

**Fachlich beschlossen:** 12.11.2026 · **Issue:** #440 · **Status:** Zielbild, nicht produktiv implementiert.

## Kernentscheidung

Eine **gemeinsame, quellunabhängige** automatische Analyse pro Fundstellenfassung statt einer gesonderten KI-RIS-Auswertung. Sie kann intern ein Abstract (Kurztext + strukturierte Erkenntnisse) erzeugen und mit nachvollziehbaren Quellenbelegen Beziehungskandidaten zu Ereignissen, Meldungen, Vorgängen und Themen ermitteln.

| Ebene | Verbindliche Trennung |
| --- | --- |
| Original | Fundstelle, Originaladresse, Versionshash und Rechts-/Herkunftsnachweis bleiben unverändert |
| Internes Abstract | Separates abgeleitetes Objekt, versioniert und als KI-/Regel-Ergebnis kenntlich |
| Beziehungen | Belegte, unbestätigte Kandidaten, keine automatische redaktionelle Zustimmung |
| Redaktion | Meldungs-/Publikationsfreigaben bleiben eigenständige Entscheidungen |
| RIS | Genau ein unveränderliches TOP-Ereignis je TOP, keinerlei neue redaktionelle RIS-Zuordnung |

## Minimales gemeinsames Ergebnisprofil (Soll)

- Fundstellen-ID und Fassungs-ID / Content-Hash; Verfahrens- und Modellversion.
- Neutraler Abstract, Fakten/Aussagen getrennt von Schlussfolgerungen, Unsicherheiten.
- Strukturierte Orte/Referenzobjekte, Organisationen, Personen soweit zulässig, Termine, Zahlen, Geldbeträge, Entscheidungen und Auswirkungen.
- Quellenbeleg je maßgeblicher Aussage: URL, Dokumentversion, ggf. Seite, TOP und Textspanne.
- Dokument-/Textabdeckung, Verarbeitungsstatus, Relevanzhinweise, Wiederholungsschutz und Kostenmetrik.
- Aktualisierung bei fachlich geänderter Fundstellenfassung. Keine Speicherung von Rohtext nur zur Analyse, soweit nicht rechtlich und technisch ausdrücklich vorgesehen.

**Spezialfall Sitzungsniederschrift:** eine Fundstelle, mehrere *abgeleitete* TOP-spezifische Abstract-Sichten. Fehlende sichere TOP-Segmentierung verhindert die entsprechende Zuordnung; keine fremden TOP-Passagen übernehmen. Amtliche TOP-Abstimmungen werden regelbasiert übernommen und sind nicht von KI-Ergebnissen abhängig.

## Verarbeitung

1. Fundstelle/versioniertes RIS-Original aus jeweiligem Import und Rechte-/Zugriffsgate.
2. Quelle nur bei zulässigem Zugriff temporär abrufen; im Fehlerfall Import fortführen.
3. Ein gemeinsamer Abstract-Analyseschritt, soweit aktiviert und budgetiert.
4. Strukturierte Ausgabe prüfen (Schema, Quellensicherung, Belegprüfung, faktische Widersprüche), speichern, ohne Quelle zu überschreiben.
5. Belegbasierte Verknüpfungen als Kandidaten; gezielte Prüffrage bei kritischem Widerspruch.
6. Keine Pflicht-Einzelfreigabe der internen Ergebnisse; öffentliche Freigaben unverändert.

## Aktueller technischer Stand / Grenzen

Release #26: RIS-Regelanalyse `rules-3`, 31 TOPs, 104 Erkenntnisse, 3 Beziehungskandidaten. Ein synthetischer A/B-Test mit vier frei erfundenen Vorlagentexten ergab 9/20 erwarteten Merkmalen nur aus Metadaten und 15/20 einschließlich Dokumenttext; **dies ist kein KI-Test und keine valide Genauigkeitsschätzung für echte Quellen**. Produktive RIS-Volltextanalyse: aus; Mistral: aus. Gesonderte rechtliche Nutzungsprüfung in Issue #437 und `docs/operations/ris-document-analysis-comparison-437.md`.

## Lieferreihenfolge

1. Fachhandbuch-Konsistenz und gemeinsame Daten-/API-Schnittstelle definieren; keine doppelte RIS-KI-Pipeline bauen.
2. Isolierte Tests mit synthetischen RIS-, Gemeinde- und Presse-Fundstellen sowie Mehrfach-TOP-Niederschrift. Prüfgrößen: Faktentreue, Belegdeckung, Falsch-/Fehlbeziehungen, Reanalyse, Kosten und Zugriffsrechte.
3. Rechts-/DSGVO-/Mistral-Vertragsprüfung je Quellenklasse einschließlich TDM-Vorbehalt und etwaiger Personendaten.
4. Erst nach expliziter Betreiberfreigabe und harter Kostenbegrenzung (bisheriger Budgetrahmen 5 €) ein minimierter Mistral-Pilot mit zulässigem Material. Kein großflächiger produktiver KI-Betrieb vor fachlicher Abnahme.

**Diese Datei ist eine Fachentscheidung, keine Freigabe für Kosten, Zugangsausweitung, Dokumentvolltextverarbeitung oder produktive Bereitstellung.**
