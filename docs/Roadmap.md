# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.9 | 01.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G2 UX / Informationsarchitektur / Fachfunktionen | **In Arbeit** | UX v2.5 konsolidiert; visuelle Identität als eigene Primärquelle angelegt; Stilrichtung, Logo-/Bannerlogik, Bildsprache, PWA-Icon, Navigation und GRÜNEN-Rücksprung festgelegt; Bannertext, Produktionsdetails und G2-Abschlussprüfung verbleiben |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Abgeschlossen** | alle identifizierten weiterhin erforderlichen Grundlagen übernommen oder integriert; Querverweis-, Terminologie- und Konsistenzprüfung durchgeführt |
| G3 Datenanforderungen / Datenmodell | **Geplant** | aus Fach- und UX-Konzept ableiten; eigenständige Entitäten für Meldung/Vorgang/Thema, n:m-Beziehungen, Wirkungsrollen, Versionierung, Rechercheaufträge, Such-/PWA-/Mehr-wissen-Daten berücksichtigen |
| G4 Schutzbedarf / Datenschutz / Offline | **Geplant** | Schutzklassen und Betriebsanforderungen festlegen |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Geplant** | technische Zielarchitektur entscheiden; modellunabhängige KI-Regelschicht und Modelltests berücksichtigen |
| G6 Rollen / Rechte / Workflow | **Geplant** | konkretes Berechtigungs- und Freigabemodell festlegen |
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring und Kostenkontrolle definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Echtsystem als Dokumentationshoheit etabliert; Demonstrator-Übernahme abgeschlossen; zentrale Standards und späterer Gründungsaudit weiterführen |
| G9 Migration | **Geplant** | Demonstratordaten prüfen, transformieren und validieren |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit prüfen |
| Technische Umsetzung | **Geplant** | beginnt erst nach abgeschlossenem Gründungsaudit |

## Nächster konkreter Schritt

**G2 – visuelles Identitäts- und Bildkonzept abschließen: Banner-/Landingpage-Text aus dem Management Approach ableiten, finale Produktionsdetails festlegen und anschließend G2 auf Widerspruchsfreiheit und Vollständigkeit prüfen.**

## Fachlich/UX bereits geklärt

- Hauptnavigation: **Meldungen | Themen | Sitzungen | Suchen**; für die öffentliche mobile Darstellung werden verständlichere Bezeichnungen/Icons gemäß UX und visueller Identität verwendet.
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
- visuelle Grundhaltung: **klar, ruhig, bürgernah, sachlich, lokal verankert, modern und erkennbar grün geprägt**.
- Sonnenblumenblätter sind der gestalterische rote Faden.
- Logo basiert auf Rathaus, Kirche, Maibaum und abstrahierten Sonnenblumenblättern; horizontale Variante bevorzugt.
- Banner ist tonal/monochrom reduziert und verwendet Rathaus + Kirche, aber keinen Maibaum.
- Blau ist funktionale Akzentfarbe, keine dominante Marken-/Bannerfarbe.
- „Neues“ nutzt die Halbkreis-Strahlen; „Im Blick“ das Auge.
- FIB bietet einen klaren Rücksprung **„Zur Website der GRÜNEN in Feldkirchen“** und bleibt unabhängig vom Einstieg dieselbe Anwendung.
- visuelle Positionierung gegenüber Kommunikations-/Service-Apps und Beteiligungsplattformen ist dokumentiert: FIB verbindet aktuelle lokale Information mit Wissensstruktur und Zusammenhangserklärung.

## Dokumentationsübernahme – abgeschlossen

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

Die vollständige Zuordnung und Abschlussprüfung stehen in `docs/Dokumentationsuebernahme-Demonstrator.md`.

Der Demonstrator bleibt historische, fachliche und visuelle Referenz; laufende Dokumentation wird ausschließlich im Echtsystem fortgeschrieben.

## Neue Echtsystem-Dokumentation aus G2

- Visuelle Identität / Logo / Bildsprache / UI-Stil → `docs/Visuelle-Identitaet-und-Bildkonzept.md`

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
| 1.9 | 01.10.2026 | Visuelle Identität als eigene kanonische G2-Quelle dokumentiert; Stilrichtung, Logo/Banner, Navigation, PWA, Rücksprung zur GRÜNEN-Website und Plattformabgrenzung in Roadmap übernommen. |
| 1.8 | 30.09.2026 | Dokumentationsübernahme nach Querverweis-, Terminologie- und Konsistenzprüfung als abgeschlossen markiert; nächster Schritt auf visuelles Identitäts-/Bildkonzept und G2-Abschluss gesetzt. |
| 1.7 | 30.09.2026 | Demonstrator-Dokumentation weitgehend vollständig ins Echtsystem überführt; UX v2.5 konsolidiert; Werte- und Sprachgrundlagen übernommen. |
| 1.6 | 30.09.2026 | Fachkonzept und KI-Leitfaden als kanonische Grundlagen markiert; G2-Status aktualisiert. |
| 1.5 | 30.09.2026 | Dokumentationsübernahme als eigener Arbeitsschritt aufgenommen. |
| 1.4 | 30.09.2026 | G2 nach UX-Konsolidierung aktualisiert. |
| 1.3 | 30.09.2026 | Themen-/Vorgangslogik konsolidiert. |
| 1.2 | 29.09.2026 | G1 abgeschlossen; G2 begonnen. |
| 1.1 | 29.09.2026 | G1-Kernentscheidungen dokumentiert. |
| 1.0 | 29.09.2026 | Initiale Roadmap angelegt. |
