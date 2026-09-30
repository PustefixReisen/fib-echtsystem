# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.7 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G2 UX / Informationsarchitektur / Fachfunktionen | **In Arbeit** | UX v2.5 konsolidiert; Suche, Mehr wissen, PWA, Teilen, Transparenz und WCAG-Ziel dokumentiert; visuelles Identitäts-/Bildkonzept und Abschlussprüfung verbleiben |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Teilweise umgesetzt** | alle identifizierten fachlich erforderlichen Demonstrator-Dokumente übernommen oder in kanonische Echtsystem-Quellen integriert; formale Abschluss-/Widerspruchsprüfung steht noch aus |
| G3 Datenanforderungen / Datenmodell | **Geplant** | aus Fach- und UX-Konzept ableiten; eigenständige Entitäten für Meldung/Vorgang/Thema, n:m-Beziehungen, Wirkungsrollen, Versionierung, Rechercheaufträge, Such-/PWA-/Mehr-wissen-Daten berücksichtigen |
| G4 Schutzbedarf / Datenschutz / Offline | **Geplant** | Schutzklassen und Betriebsanforderungen festlegen |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Geplant** | technische Zielarchitektur entscheiden; modellunabhängige KI-Regelschicht und Modelltests berücksichtigen |
| G6 Rollen / Rechte / Workflow | **Geplant** | konkretes Berechtigungs- und Freigabemodell festlegen |
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring und Kostenkontrolle definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Echtsystem als Dokumentationshoheit etabliert; Demonstrator-Übernahme durchgeführt; zentrale Standards und Abschlussaudit weiterführen |
| G9 Migration | **Geplant** | Demonstratordaten prüfen, transformieren und validieren |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit prüfen |
| Technische Umsetzung | **Geplant** | beginnt erst nach abgeschlossenem Gründungsaudit |

## Nächster konkreter Schritt

**G2 visuelles Identitäts- und Bildkonzept festlegen; anschließend G2 und Dokumentationsübernahme gemeinsam auf Widerspruchsfreiheit prüfen.**

## Fachlich/UX bereits geklärt

- Hauptnavigation: **Meldungen | Themen | Sitzungen | Suchen**.
- „Aktuell“ ist ausschließlich zeitliche Hervorhebung.
- Meldung, Vorgang und Thema sind fachlich getrennte Objekttypen.
- Themen und Vorgänge erscheinen öffentlich in einer gemeinsamen Themenliste.
- Vorgänge besitzen eigenen aktuellen Stand, Verlauf und Status.
- Themen erklären übergeordnete Zusammenhänge und gewichten Vorgänge nach Wirkungsrolle.
- Meldungs-, Vorgangs-, Themen- und Sitzungsdetailseiten sind festgelegt.
- zentrale Suche und schlanke Filterlogik sind festgelegt.
- „Mehr wissen?“ unterscheidet Ereignis-, Vorgangs- und Themenvertiefung.
- PWA umfasst lokalen Neuigkeitsstatus, optionale Push-Abonnements und ergänzende Badge-Unterstützung.
- Teilen, Drucken, Social Preview und zielgenaue Update-Links sind fachlich geklärt.
- Transparenz/Über FIB/Disclaimer sind geklärt.
- Mobile First und **WCAG 2.2 AA** sind technisches Ziel.
- Barrierefreiheit ergänzt die bestehende bürgernahe FIB-Sprache und ersetzt sie nicht.

## Dokumentationsübernahme – aktueller Stand

Übernommen bzw. konsolidiert sind:

1. Management Approach → `docs/FIB_Management-Approach.md`
2. Inhaltliches Fachkonzept → `docs/Fachkonzept.md`
3. KI-Leitfaden → `docs/KI-Leitfaden.md`
4. KI-Modellunabhängigkeit/Qualität → `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
5. Quellenmonitor/Recherche → `docs/Recherche-und-Quellenmonitor.md`
6. Mehr wissen → `docs/Mehr-wissen.md`
7. Frontend/Darstellung → in `docs/UX-und-Informationsarchitektur.md` integriert
8. Marketing/Kommunikation → `docs/Marketing-und-Kommunikation.md`
9. SEO/Auffindbarkeit → `docs/SEO-und-Auffindbarkeit.md`
10. KI-Kosten/Betrieb → `docs/KI-Betrieb-und-Kosten.md`
11. Grüne Werte/politische Ziele → `docs/Gruene-Werte-und-politische-Ziele.md`
12. wissenschaftlich-politische/bürgernahe Sprachregeln → `docs/Sprachleitfaden.md`

Die Zuordnung steht vollständig in `docs/Dokumentationsuebernahme-Demonstrator.md`.

Vor formellem Abschluss der Übernahme erfolgen noch:

- Querverweisprüfung zwischen den neuen Primärquellen,
- Prüfung auf veraltete Begriffe wie „Presseschau“ in Echtsystem-Dokumenten,
- Widerspruchsprüfung gegen Fachkonzept, Themen-/Vorgangslogik und UX,
- Aktualisierung der Dokumentationslandkarte bei gefundenen Restpunkten.

## Modellunabhängigkeit der KI

Die fachlichen FIB-Regeln werden in der Projektdokumentation und nicht in einem einzelnen Modell oder Chat verankert.

Verbindliche Qualitätsquelle: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`.

Für die spätere technische Umsetzung ist vorzusehen:

- zentrale modellunabhängige Regel-/Prompt-Schicht,
- strukturierte Ein- und Ausgaben,
- Regressionstests mit festen FIB-Referenzfällen,
- Modellwechsel nur nach Qualitätsprüfung.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.7 | 30.09.2026 | Demonstrator-Dokumentation weitgehend vollständig ins Echtsystem überführt; UX v2.5 konsolidiert; Werte- und Sprachgrundlagen übernommen; nächster Schritt auf visuelles Konzept plus gemeinsame Abschlussprüfung gesetzt. |
| 1.6 | 30.09.2026 | Fachkonzept und KI-Leitfaden als kanonische Grundlagen markiert; G2-Status aktualisiert. |
| 1.5 | 30.09.2026 | Dokumentationsübernahme als eigener Arbeitsschritt aufgenommen. |
| 1.4 | 30.09.2026 | G2 nach UX-Konsolidierung aktualisiert. |
| 1.3 | 30.09.2026 | Themen-/Vorgangslogik konsolidiert. |
| 1.2 | 29.09.2026 | G1 abgeschlossen; G2 begonnen. |
| 1.1 | 29.09.2026 | G1-Kernentscheidungen dokumentiert. |
| 1.0 | 29.09.2026 | Initiale Roadmap angelegt. |
