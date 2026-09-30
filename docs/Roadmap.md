# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.3 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G2 UX / Informationsarchitektur / Fachfunktionen | **In Arbeit** | Themen-/Vorgangslogik konsolidiert; als nächstes öffentliche Themendarstellung an realen Fällen testen und anschließend verbleibende UX-/Fachfunktionen abschließen |
| G3 Datenanforderungen / Datenmodell | **Geplant** | aus Fach- und UX-Konzept ableiten; Themen/Vorgänge, Versionierung und Rechercheaufträge ausdrücklich berücksichtigen |
| G4 Schutzbedarf / Datenschutz / Offline | **Geplant** | Schutzklassen und Betriebsanforderungen festlegen |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Geplant** | technische Zielarchitektur nach Anforderungen entscheiden |
| G6 Rollen / Rechte / Workflow | **Geplant** | konkretes Berechtigungs- und Freigabemodell festlegen |
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring und Kostenkontrolle definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Basis vorhanden; zentrale Standards vollständig klassifizieren |
| G9 Migration | **Geplant** | Demonstratordaten prüfen, transformieren und validieren |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit prüfen |
| Technische Umsetzung | **Geplant** | beginnt erst nach abgeschlossenem Gründungsaudit |

## Nächster konkreter Schritt

**G2 – öffentliche Themendarstellung auf Basis der neuen Themen-/Vorgangslogik**

Die fachliche Trennung von Beitrag, Vorgang und Thema sowie der iterative Themenkreislauf sind in `docs/Themen-und-Vorgangslogik.md` konsolidiert.

Als nächstes wird anhand realer FIB-Fälle geprüft, wie ein bestätigtes Thema öffentlich dargestellt wird, ohne Thema und chronologischen Vorgang wieder gleichzusetzen.

Die Themenseite soll insbesondere vermitteln:

- Leitfrage und lokalen Bezug,
- relevante Perspektiven und Kontextdimensionen,
- zugehörige konkrete Vorgänge,
- erklärungsrelevanten externen Kontext,
- belegten Wissensstand und Wissenslücken,
- wesentliche neue Entwicklungen, die die Themendefinition verändert haben.

Erst nach diesem Test wird die Themenliste/Themendetailseite verbindlich festgelegt und die noch vorläufige alte Themenstatuslogik in der UX-Dokumentation bereinigt. Anschließend werden die verbleibenden G2-Funktionen abgeschlossen und G3 begonnen.

Jede relevante UX- oder Fachentscheidung wird weiterhin ausdrücklich auf Auswirkungen auf das spätere Datenmodell geprüft.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.3 | 30.09.2026 | Themen-/Vorgangslogik konsolidiert; öffentliche Themendarstellung als nächster G2-Schritt festgelegt; G3 um Themenversionierung und Rechercheaufträge konkretisiert. |
| 1.2 | 29.09.2026 | G1 als abgeschlossen markiert; G2 UX/Informationsarchitektur/Fachfunktionen begonnen. |
| 1.1 | 29.09.2026 | G1-Kernentscheidungen zur KI-gestützten Inhaltserstellung, Web Push, freien Live-Fragen und Offline-Fähigkeit dokumentiert. |
| 1.0 | 29.09.2026 | Initiale Roadmap für die Projektgründungsphase angelegt. |
