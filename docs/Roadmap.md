# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.2 | 01.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G2 UX / Informationsarchitektur / Fachfunktionen | **Abgeschlossen** | UX, öffentliche Navigation, Screenlogik, visuelle Identität, Claim, responsive Bannerlogik, GRÜNEN-Rücksprung und Assetstruktur sind konsolidiert; Abschlussprüfung durchgeführt |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Abgeschlossen** | alle identifizierten weiterhin erforderlichen Grundlagen übernommen oder integriert; Querverweis-, Terminologie- und Konsistenzprüfung durchgeführt |
| G3 Datenanforderungen / Datenmodell | **In Arbeit** | aus Fach- und UX-Konzept ableiten; eigenständige Entitäten für Meldung/Vorgang/Thema, n:m-Beziehungen, Wirkungsrollen, Versionierung, Rechercheaufträge, Such-/PWA-/Mehr-wissen-Daten berücksichtigen |
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

**G3 – Datenanforderungen / Datenmodell:** Fachobjekte, Beziehungen, Versionierung, Aktualisierungsereignisse, Recherche-/Freigabedaten, Suche, PWA/Push und „Mehr wissen?“ in ein belastbares logisches Datenmodell überführen.

## Fachlich/UX bereits geklärt

- öffentliche Hauptnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- interne Fachobjekte bleiben **Meldung | Vorgang | Thema | Sitzung**.
- „Aktuell“ ist ausschließlich zeitliche Hervorhebung.
- Meldung, Vorgang und Thema sind fachlich getrennte Objekttypen.
- Themen und Vorgänge erscheinen öffentlich gemeinsam unter **„Im Blick“**.
- Vorgänge besitzen eigenen aktuellen Stand, Verlauf und Status.
- Themen erklären übergeordnete Zusammenhänge und gewichten Vorgänge nach Wirkungsrolle.
- Meldungs-, Vorgangs-, Themen- und Sitzungsdetailseiten sind festgelegt.
- zentrale Suche und schlanke Filterlogik sind festgelegt.
- „Mehr wissen?“ unterscheidet Ereignis-, Vorgangs- und Themenvertiefung.
- PWA umfasst lokalen Neuigkeitsstatus, optionale Push-Abonnements und ergänzende Badge-Unterstützung.
- Teilen, Drucken, Social Preview und zielgenaue Update-Links sind fachlich geklärt.
- Transparenz, „Über Feldkirchen im Blick“ und Disclaimer sind geklärt.
- Mobile First und **WCAG 2.2 AA** sind technisches Ziel.
- Barrierefreiheit ergänzt die bestehende bürgernahe FIB-Sprache und ersetzt sie nicht.

## Visuelle Identität – geklärt

Verbindliche Primärquelle: `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

Festgelegt sind insbesondere:

- visuelle Grundhaltung: **klar, ruhig, bürgernah, sachlich, lokal verankert, modern und erkennbar grün geprägt**;
- drei gelbe Sonnenblumenblätter als wiederkehrender grafischer roter Faden;
- Bildmarke mit Rathaus Feldkirchen, Kirche, Bäumen/Bodenlinie und Sonnenblumenblättern; **kein Maibaum** in der finalen Bildmarke;
- Rathausdarstellung mit charakteristischem Pultdach, Ziegelfassade und vier Fahnenmasten;
- Primärlogo horizontal, Kompaktlogo, monochrome Variante und PWA/Icon-Anwendung;
- finaler Claim **„Mehr Überblick. Besser verstehen.“**;
- ausführlicher Tablet-/Desktop-Erklärungstext und kompakte Mobile-Fassung;
- Tablet/Desktop: responsiver Zwei-Spalten-Banner mit echtem Text links und separater Illustration rechts;
- Smartphone/PWA: echte Textbestandteile mit hellem halbtransparentem Overlay über der tiefer positionierten Illustration;
- finale Bannerillustration als eigenes Produktionsasset;
- Blau nur als funktionale Akzentfarbe, nicht als dominante Markenfläche;
- Hauptnavigation mit **Neues** als fünf gelben strahlen-/blattartigen Formen im Bogen, **Im Blick** als Auge, **Sitzungen** als Gremium und **Suche** als Lupe;
- kompakte Leiste **„Zur Website der GRÜNEN in Feldkirchen“** direkt unter dem mobilen Banner bei direktem Einstieg; bei Einbettung in die GRÜNEN-Homepage entfällt sie;
- zusammengesetzte Bannerbilder dienen nur noch als Styleguide-/Mockup-Referenzen; produktiv werden Text und Illustration getrennt aufgebaut.

## Markenassets – aktueller Stand

Ablage: `assets/brand/`.

Bereits vorhanden bzw. freigegeben:

- Logo-Rasterreferenzen in `logo/`,
- finale Bannerillustration in `banner/`,
- produktive Navigations-SVGs in `icons/`,
- PWA-Rasterreferenz in `pwa/`,
- Styleguide-/Responsive-/Bannerreferenzen in `reference/`,
- Sonnenblumen-Grundelement in `elements/`.

Noch während der technischen Umsetzung zu erzeugen:

- echte vektorielle Logo-Master ohne gestalterische Neuinterpretation,
- produktive PWA-Exports 192×192, 512×512 und maskable,
- Social-Preview-Asset 1200×630,
- ggf. optimierte WebP-/SVG-Varianten der Bannerillustration.

Diese Produktionsdetails blockieren G2 nicht.

Die verbindliche Assetübersicht steht in `assets/brand/README.md`.

## Claim, Botschaften und Mission

Finaler Claim:

> **Mehr Überblick. Besser verstehen.**

Ausführlicher Erklärungstext:

> **Relevante Informationen aus Rathaus, Presse und weiteren Quellen – verständlich zusammengeführt und in ihren Zusammenhängen erklärt.**

Mobile Kurzfassung:

> **Aktuelles aus Rathaus, Presse und weiteren Quellen – verständlich zusammengeführt.**

Der Dreiklang

> **Informieren · Verstehen · Nachfragen**

bleibt als sekundäres Kommunikationselement verfügbar, ist aber kein Pflichtbestandteil des Banners.

Marketing- und Kommunikationsdetails stehen in `docs/Marketing-und-Kommunikation.md`.

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
| 2.2 | 01.10.2026 | G2 nach abschließender Widerspruchs- und Vollständigkeitsprüfung abgeschlossen; G3 als nächste aktive Phase gesetzt. |
| 2.1 | 01.10.2026 | G2 an finalisierte visuelle Identität angepasst: finaler Claim und Bannertexte, responsive Split-/Mobile-Overlay-Logik, finale Bannerillustration, Logo ohne Maibaum, aktuelle Navigationsicons und Assetstruktur übernommen; veraltete Banner-Arbeitsfassung entfernt. |
| 2.0 | 01.10.2026 | UX-Navigation auf „Neues | Im Blick | Sitzungen | Suche“ konsolidiert; Bannertext als Arbeitsfassung aufgenommen; G2-Offenpunkt auf Textfreigabe plus Abschlussprüfung reduziert. |
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
