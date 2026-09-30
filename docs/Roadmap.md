# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.5 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Statusmodell

Es gelten die zentralen Status aus `PustefixReisen/pustivo/docs/governance/Dokumentenpflege.md`:

- Geplant
- In Arbeit
- Teilweise umgesetzt
- Blockiert
- Abgeschlossen
- Zurückgestellt
- Entfallen

## Aktueller Stand

| Phase | Status | Ergebnis / nächster Schritt |
|---|---|---|
| Projektbasis / Repository | **Abgeschlossen** | separates Repository und initiale Dokumentationsstruktur vorhanden |
| G1 Produktumfang / MVP | **Abgeschlossen** | MVP, unmittelbare Ausbaustufe, spätere Erweiterungen, Nicht-Ziele und Aufwandstreiber verbindlich festgelegt |
| G2 UX / Informationsarchitektur / Fachfunktionen | **In Arbeit** | Kernnavigation, Meldungslogik, gemeinsame Themen-/Vorgangsliste sowie Meldungs-, Themen-, Vorgangs- und Sitzungsdetailseiten konsolidiert; verbleibende Querschnitts-UX abschließen |
| Dokumentationsübernahme Demonstrator → Echtsystem | **In Arbeit** | benötigte Demonstrator-Grundlagen einmalig in kanonische Echtsystem-Dokumente überführen, aktualisieren und danach nur noch im Echtsystem fortschreiben |
| G3 Datenanforderungen / Datenmodell | **Geplant** | aus Fach- und UX-Konzept ableiten; eigenständige Entitäten für Meldung/Vorgang/Thema, n:m-Beziehungen, Wirkungsrollen, Versionierung und Rechercheaufträge ausdrücklich berücksichtigen |
| G4 Schutzbedarf / Datenschutz / Offline | **Geplant** | Schutzklassen und Betriebsanforderungen festlegen |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Geplant** | technische Zielarchitektur nach Anforderungen entscheiden; modellunabhängige KI-Regelschicht und Modelltests berücksichtigen |
| G6 Rollen / Rechte / Workflow | **Geplant** | konkretes Berechtigungs- und Freigabemodell festlegen |
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring und Kostenkontrolle definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Dokumentationshoheit des Echtsystems festgelegt; zentrale Standards vollständig klassifizieren und Demonstrator-Altbestand konsolidieren |
| G9 Migration | **Geplant** | Demonstratordaten prüfen, transformieren und validieren |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit prüfen |
| Technische Umsetzung | **Geplant** | beginnt erst nach abgeschlossenem Gründungsaudit |

## Nächster konkreter Schritt

**Dokumentationsübernahme und G2 parallel konsolidieren**

Die fachliche und öffentliche Grundstruktur ist inzwischen konsolidiert:

- öffentliche Hauptnavigation: **Meldungen | Themen | Sitzungen | Suchen**,
- „Aktuell“ ist ausschließlich eine zeitliche Auswahl/Hervorhebung,
- Themen und Vorgänge werden öffentlich in einer gemeinsamen Themenliste geführt,
- Vorgang und Thema bleiben intern eigenständige Objekttypen,
- Vorgänge besitzen einen eigenen aktuellen Sachstand und Verlauf,
- Themen erklären übergeordnete Zusammenhänge und gewichten Vorgänge nach ihrer Wirkungsrolle,
- Meldungs-, Themen-, Vorgangs- und Sitzungsdetailseiten sind fachlich festgelegt.

Vor Abschluss von G2 bleiben insbesondere:

1. Suche und Filter,
2. „Mehr wissen?“ in den verschiedenen Detailseiten,
3. PWA-spezifische UX einschließlich „Neu seit letztem Besuch“, Push-Einstellungen und möglicher Badge-Anzeige,
4. Teilen / Drucken / Social Preview,
5. Transparenz / Über FIB / Disclaimer,
6. visuelles Identitäts- und Bildkonzept,
7. Barrierearmut und responsive Detailkonzeption,
8. abschließende Widerspruchs- und Vollständigkeitsprüfung von G2.

Parallel werden die im Echtsystem weiterhin benötigten Demonstrator-Dokumente nicht mehr dort fortgeschrieben, sondern in `fib-echtsystem` übernommen und auf den aktuellen Stand gebracht. Priorität haben:

1. Management Approach,
2. inhaltliches Fachkonzept,
3. KI-Leitfaden / modellunabhängige Qualitätsregeln,
4. Quellenmonitor / Recherchelogik,
5. Mehr-wissen-Konzept,
6. Frontend-/Darstellungsregeln, soweit noch nicht in der UX-Dokumentation enthalten,
7. Marketing / Kommunikation,
8. SEO / Auffindbarkeit,
9. KI-Kosten- und Betriebsmodell.

Bei der Übernahme werden keine veralteten Demonstrator-Annahmen konserviert. Insbesondere müssen Management Approach und Fachkonzept die aktuelle Trennung **Beitrag – Vorgang – Thema** und die daraus entstehenden redaktionellen Ebenen abbilden.

Nach Abschluss der Dokumentationsübernahme und der verbleibenden G2-Punkte kann G3 beginnen. Jede verbleibende UX- oder Fachentscheidung wird weiterhin ausdrücklich auf Auswirkungen auf das spätere Datenmodell geprüft.

## Modellunabhängigkeit der KI

Die fachlichen FIB-Regeln werden in der Projektdokumentation und nicht in einem einzelnen Modell oder Chat verankert. Für die spätere technische Umsetzung ist vorzusehen:

- zentrale modellunabhängige Regel-/Prompt-Schicht,
- strukturierte Ein- und Ausgaben für fachliche KI-Aufgaben,
- Regressionstests mit festen FIB-Referenzfällen,
- Modellwechsel nur nach Qualitätsprüfung gegen diese Referenzfälle.

Die konkrete technische Umsetzung wird in G5 festgelegt; die dafür nötigen fachlichen Strukturen werden bereits in G3 berücksichtigt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.5 | 30.09.2026 | Dokumentationsübernahme vom Demonstrator ins Echtsystem als eigener laufender Arbeitsschritt aufgenommen; Prioritäten und Repository-Grenze festgelegt; visuelles Identitäts- und Bildkonzept in offene G2-Punkte ergänzt. |
| 1.4 | 30.09.2026 | G2 nach UX-Konsolidierung aktualisiert; gemeinsame Themen-/Vorgangsliste, neue Navigation und Vorgangsdetailseite berücksichtigt; offene Querschnitts-UX als nächster Schritt festgelegt; Modellunabhängigkeit der KI als spätere technische Anforderung ergänzt. |
| 1.3 | 30.09.2026 | Themen-/Vorgangslogik konsolidiert; öffentliche Themendarstellung als nächster G2-Schritt festgelegt; G3 um Themenversionierung und Rechercheaufträge konkretisiert. |
| 1.2 | 29.09.2026 | G1 als abgeschlossen markiert; G2 UX/Informationsarchitektur/Fachfunktionen begonnen. |
| 1.1 | 29.09.2026 | G1-Kernentscheidungen zur KI-gestützten Inhaltserstellung, Web Push, freien Live-Fragen und Offline-Fähigkeit dokumentiert. |
| 1.0 | 29.09.2026 | Initiale Roadmap für die Projektgründungsphase angelegt. |
