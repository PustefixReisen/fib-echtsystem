# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.4 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G3 Datenanforderungen / Datenmodell | **In Arbeit** | Fachobjekte und strukturierter Redaktionsstand werden konkretisiert; Ereignis/Meldung/Vorgang/Thema, Wirkungen, Zielbereiche, Prüfkriterien, Abwägung, Versionierung, Rechercheaufträge sowie Quellenbeobachtung/-entdeckung berücksichtigen |
| G4 Schutzbedarf / Datenschutz / Offline | **Geplant** | Schutzklassen und Betriebsanforderungen festlegen |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Geplant** | Hybrid-KI technisch umsetzen: KI-fähiger, aber ohne optionale KI vollständig bedienbarer Redaktionskern; verpflichtende Entdeckungs-/Eingangs-KI; bedarfsgesteuerte Recherche-KI; optionale Redaktions-KI; konfigurierbare Routing-Matrix; produktionsreife Entwicklung auf Entwickler-Infrastruktur und späterer Umzug auf GRÜNEN-Webserver plus eigenes Supabase-Projekt; kein Supabase-Self-Hosting |
| G6 Rollen / Rechte / Workflow | **Geplant** | konkretes Berechtigungs- und Freigabemodell einschließlich Admin-Verantwortung für Referenzsystem und redaktioneller Pflichtbestätigungen festlegen |
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring, KI-Kostenmessung, Routing-Betrieb, Budgets und Warnschwellen definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Echtsystem als Dokumentationshoheit etabliert; Demonstrator-Übernahme abgeschlossen; zentrale Standards und späterer Gründungsaudit weiterführen |
| G9 Migration | **Geplant** | Übergang auf GRÜNEN-Infrastruktur nach `docs/Migrationsstrategie.md`; wiederholbares Migrations-Runbook statt separatem Migrations-Probelauf |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen, einschließlich Qualität der verpflichtenden Quellen-/Ereignisentdeckung und belastbarer Betriebskostenmessung |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit prüfen |
| Technische Umsetzung | **Geplant** | beginnt erst nach abgeschlossenem Gründungsaudit |

## Nächster konkreter Schritt

**G3 – Datenanforderungen / Datenmodell:** Den strukturierten Redaktionsworkflow am Referenzfall „Ausbau Autobahnkreuz München Ost“ vollständig durchspielen und anschließend gegen Datenmodell, Quellenmonitor und Hybrid-KI-Schnittstellen spiegeln. Dabei festlegen, welche Daten aus verpflichtender Entdeckungs-/Eingangs-KI stammen, welche ohne KI bearbeitet werden können und wo bedarfsgesteuerte bzw. optionale KI ansetzt.

## Fachlich/UX bereits geklärt

- öffentliche Hauptnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- interne Fachobjekte bleiben **Meldung | Vorgang | Thema | Sitzung**.
- „Aktuell“ ist ausschließlich zeitliche Hervorhebung.
- Meldung, Vorgang und Thema sind fachlich getrennte Objekttypen.
- Themen und Vorgänge erscheinen öffentlich gemeinsam unter **„Im Blick“**.
- Vorgänge besitzen eigenen aktuellen Stand, Verlauf und Status.
- Themen erklären übergeordnete Zusammenhänge und gewichten Vorgänge nach **Bedeutung für das Thema**: prägend, relevant oder ergänzend.
- Meldungs-, Vorgangs-, Themen- und Sitzungsdetailseiten sind festgelegt.
- zentrale Suche und schlanke Filterlogik sind festgelegt.
- „Mehr wissen?“ unterscheidet Ereignis-, Vorgangs- und Themenvertiefung.
- PWA umfasst lokalen Neuigkeitsstatus, optionale Push-Abonnements und ergänzende Badge-Unterstützung.
- Teilen, Drucken, Social Preview und zielgenaue Update-Links sind fachlich geklärt.
- Transparenz, „Über Feldkirchen im Blick“ und Disclaimer sind geklärt.
- Mobile First und **WCAG 2.2 AA** sind technisches Ziel.
- Barrierefreiheit ergänzt die bestehende bürgernahe FIB-Sprache und ersetzt sie nicht.
- der strukturierte Redaktionsworkflow verwendet feste, modellunabhängige Fragemuster und Antwortoptionen; die fallbezogenen Inhalte werden eingesetzt, nicht das Formular durch KI erfunden.
- alle vorhandenen Prüfkriterien eines Zielbereichs werden im Redaktionsworkflow sichtbar angeboten; KI-Empfehlungen werden nur vorausgewählt.

## Hybrid-KI – Entwicklungsprinzip

Für das Echtsystem gilt verbindlich:

> **KI wird nur dort eingesetzt, wo sie fachlich erforderlich ist oder einen klaren zusätzlichen Nutzen bringt. Wird KI eingesetzt, hat die erforderliche Ergebnisqualität Vorrang vor dem niedrigsten Preis.**

Die Zielarchitektur unterscheidet:

1. **Verpflichtende Entdeckungs-/Eingangs-KI** – aktive Suche nach neuen Quellen, semantische Analyse neuer oder geänderter Fundstellen, Ereigniserkennung und notwendige Erstzuordnung.
2. **Bedarfsgesteuerte Recherche-KI** – gezielte Bearbeitung konkreter Wissenslücken, die im Redaktionsworkflow entstehen.
3. **Optionale Redaktions-KI** – Vorschläge, Vorbefüllung, Plausibilitätsprüfung, Abwägungs- und Textentwürfe; der Redaktionsworkflow bleibt ohne diese Funktionen vollständig nutzbar.
4. **Modellunabhängiger FIB-Kern** – Datenmodell, Formulare, Fragemuster, Antwortoptionen, Zustandslogik, Validierungen, Versionierung und Freigaben gehören zur Anwendung.

Der Quellenmonitor besteht entsprechend aus:

- **Quellenbeobachtung** bekannter Adressen: technische Änderungsfeststellung ohne KI; KI erst bei neuer/geänderter Fundstelle,
- **Quellenentdeckung**: aktive KI-gestützte Suche nach bislang unbekannten relevanten Quellen.

Für G5 ist eine konfigurierbare Routing-Matrix vorzusehen. Sie ordnet FIB-Aufgaben nicht fest an Modellnamen, sondern an KI-Bedarf, Qualitätsanforderung/Leistungsklasse, Provider/Modell, Fallback und gegebenenfalls Kostenrahmen.

Vorläufiger Kostenrahmen für die Planung: **ca. 3–13 € KI-API-Kosten pro Monat im Normalbetrieb**, davon **ca. 3–8 €** für die verpflichtende Quellenentdeckung und Eingangsanalyse; **15 € pro Monat** dienen bis zur Pilotmessung als Planungs-/Warnrahmen. Verbindliche Details und spätere Ist-Kalibrierung: `docs/KI-Betrieb-und-Kosten.md`.

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

## Migrationsgrundsatz – Entwickler → GRÜNEN-Infrastruktur

Verbindliche Primärquelle: `docs/Migrationsstrategie.md`.

Festgelegt ist:

- FIB wird zunächst vollständig produktionsreif auf der Infrastruktur des Entwicklers aufgebaut und erprobt;
- Zielbetrieb ist ein GRÜNEN-Webserver plus eigenes Supabase-Projekt unter Organisationsverantwortung;
- Supabase-Self-Hosting ist ausgeschlossen;
- Architektur und Deployment dürfen keine persönliche Bindung an Domains, Projekt-IDs, Accounts oder Secrets enthalten;
- Datenbanklogik, Edge Functions und relevante Konfiguration werden reproduzierbar im Repository bzw. in einem Runbook abgebildet;
- ein separater zusätzlicher Migrations-Probelauf ist nicht erforderlich;
- die eigentliche Migration in die noch wegwerfbare GRÜNEN-Zielumgebung darf vor Go-live bei Bedarf verworfen und wiederholt werden;
- G9 erstellt hierfür ein vollständiges Migrations-Runbook und eine Abnahmecheckliste.

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

## Neue Echtsystem-Dokumentation

- Visuelle Identität / Logo / Bildsprache / UI-Stil → `docs/Visuelle-Identitaet-und-Bildkonzept.md`
- Migration Entwickler-Infrastruktur → GRÜNEN-Infrastruktur → `docs/Migrationsstrategie.md`
- strukturierter Redaktionsworkflow → `docs/Redaktionsworkflow.md`

## Modellunabhängigkeit der KI

Die fachlichen FIB-Regeln werden in der Projektdokumentation und nicht in einem einzelnen Modell oder Chat verankert.

Verbindliche Qualitätsquelle: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`.

Für die spätere technische Umsetzung ist vorzusehen:

- zentrale modellunabhängige Regel-/Prompt-Schicht,
- strukturierte Ein- und Ausgaben,
- Regressionstests mit festen FIB-Referenzfällen,
- Modellvergleich nach FIB-Aufgabe und Qualitätsanforderung,
- konfigurierbare Routing-Matrix,
- Modellwechsel nur nach Qualitätsprüfung.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 2.4 | 03.10.2026 | Hybrid-KI als Entwicklungsprinzip aufgenommen: verpflichtende Entdeckungs-/Eingangs-KI, bedarfsgesteuerte Recherche-KI, optionale Redaktions-KI und modellunabhängiger Kern; Quellenmonitor in Quellenbeobachtung und Quellenentdeckung gegliedert; G3/G5/G7/G10 sowie vorläufigen KI-Kostenrahmen angepasst. |
| 2.3 | 01.10.2026 | Migrationsgrundsatz verbindlich ergänzt: produktionsreife Entwicklung auf Entwickler-Infrastruktur, späterer Umzug auf GRÜNEN-Webserver plus eigenes Supabase-Projekt, kein Self-Hosting, reproduzierbare Migration mit Runbook statt separatem Probelauf. |
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
