# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.7 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G2.5 Transfer-Audit Demonstrator → Echtsystem | **In Arbeit** | erste fachliche Prüfschicht abgeschlossen; zweite Prüfschicht zu sichtbaren Inhaltsbausteinen und Redaktionsfunktionen seit 04.10.2026 offen; erkannte Lücken werden direkt in Primärdokumenten geschlossen |
| Dokumentationsübernahme Demonstrator → Echtsystem | **In Arbeit** | Hauptdokumente übernommen; Vollständigkeit sichtbarer Inhaltsbausteine und Redaktionsfunktionen wird unter G2.5 erneut geprüft |
| G3 Datenanforderungen / Datenmodell | **In Arbeit** | Fachobjekte und strukturierter Redaktionsstand sind weit fortgeschritten; Fortsetzung der Modellarbeit nach Schließen der aktuell relevanten G2.5-Transferlücken |
| G4 Schutzbedarf / Datenschutz / Offline | **Geplant** | Schutzklassen und Betriebsanforderungen festlegen |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Geplant** | Hybrid-KI technisch umsetzen; zusätzlich Cache-/Deployment-Verlässlichkeit aus RT-014 verbindlich berücksichtigen; produktionsreife Entwicklung auf Entwickler-Infrastruktur und späterer Umzug auf GRÜNEN-Webserver plus eigenes Supabase-Projekt; kein Supabase-Self-Hosting |
| G6 Rollen / Rechte / Workflow | **Geplant** | konkretes Berechtigungs- und Freigabemodell einschließlich Admin-Verantwortung für Referenzsystem und redaktioneller Pflichtbestätigungen festlegen |
| G7 Betrieb | **Geplant** | Backup, Restore, Monitoring, KI-Kostenmessung, Routing-Betrieb, Budgets und Warnschwellen definieren |
| G8 Governance / Repository / Dokumentation | **Teilweise umgesetzt** | Echtsystem als Dokumentationshoheit etabliert; G2.5 erneut in Arbeit; zentrale Standards und späterer Gründungsaudit weiterführen |
| G9 Migration | **Geplant** | Übergang auf GRÜNEN-Infrastruktur nach `docs/Migrationsstrategie.md`; wiederholbares Migrations-Runbook statt separatem Migrations-Probelauf |
| G10 Go-live-Abnahme | **Geplant** | messbare Abnahmekriterien festlegen, einschließlich Qualität der verpflichtenden Quellen-/Ereignisentdeckung, Transfer-Regressionstests und belastbarer Betriebskostenmessung |
| Gründungsaudit | **Geplant** | Vollständigkeit und Widerspruchsfreiheit prüfen |
| Technische Umsetzung | **Geplant** | beginnt erst nach abgeschlossenem Gründungsaudit |

## G2.5 – Transfer-Audit Demonstrator → Echtsystem

G2.5 sichert ab, dass der aufwändige Demonstrator- und Testbetrieb vollständig in das Echtsystem einfließt und nicht nur die bereits sichtbaren Hauptdokumente übernommen werden.

### Prüfquellen

Der Audit berücksichtigt fünf Quellenklassen:

1. kanonische Dokumentation des Demonstrators,
2. Demonstrator-Datenbestand und sichtbares Verhalten,
3. Betriebs-, Update- und Fehlerprotokolle,
4. Spezial- und Übergabedokumente,
5. relevante frühere FIB-Chats als **Lückenfinder**, nicht als kanonische Wahrheit.

Zusätzlich wird seit 04.10.2026 eine zweite Prüfschicht verwendet:

> **sichtbare Inhaltsbausteine und redaktionelle Funktionen des Demonstrators → fachliche Bedeutung → Datenhaltung → Redaktionsworkflow → öffentliche Darstellung im Echtsystem**

### Zwischenstand

Die erste Prüfschicht hat wesentliche Regeln erfolgreich übertragen, insbesondere:

- erweiterter Suchraum und mögliche zukünftige Bedeutung,
- dynamischer Suchkontext aus Themen und Vorgängen,
- sechsmonatiger Rückblick bei neuem oder wesentlich geschärftem Suchkontext,
- 30-%-Warnschwelle als Qualitätskontrolle für ausschließlich mittelbar relevante veröffentlichte Beiträge,
- Persistenzschutz,
- Quellenpflicht bei „Mehr wissen?“,
- RIS-Link-, Datums- und Statuslogik,
- Folgerecherche aus internen Hintergrundquellen,
- PWA-Neuigkeitslogik,
- Ablösung der alten Wirkungsrollen durch **Bedeutung für das Thema** + Perspektiven/Wirkungen,
- Dokumentationshoheit des Echtsystems gegenüber ODT-/Exportkopien.

Die zweite Prüfschicht hat jedoch zusätzliche Lücken sichtbar gemacht, unter anderem:

- Meldungsbaustein **„Was bisher passiert ist“**,
- **Offene Fragen** auf Meldungsebene und ihre persistente Modellierung,
- explizite Sichtbarkeit relevanter Ereignisse aus Nachbargemeinden in Themen,
- vollständiger Bildaufnahme-/Auswahl-/Freigabeworkflow,
- konkrete Verwendungslogik von Inhaltsbildern einschließlich Rechte-, Alt-Text- und Nachweislogik,
- Entscheidung über das Demonstrator-Konzept **„Mehr zum Bild“**.

Verbindliche Detailquellen:

- `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`
- `docs/Regressionstests-Demonstratortransfer.md`

Technische Folgeaufträge bleiben bewusst in späteren Phasen:

- G3: Persistenz-/Rücknahme-/Archivierungslogik konkret modellieren sowie neu erkannte persistente Inhaltsobjekte ergänzen,
- G5: Cache-/Versionierungs-/Invalidierungsstrategie,
- G3–G10: fachliche Referenzfälle schrittweise automatisierbar machen.

## Nächster konkreter Schritt

**G2.5 – zweite Transfer-Prüfschicht:** Die inventarisierten Lücken IA-001 bis IA-010 aus `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md` in den zuständigen Primärdokumenten schließen und anschließend Demonstrator-Oberfläche sowie Demonstrator-Dokumentation auf weitere sichtbare Inhaltsbausteine prüfen. Danach G2.5 erneut abschließen und G3 fortsetzen.

## Fachlich/UX bereits geklärt

- öffentliche Hauptnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- interne Fachobjekte bleiben **Meldung | Vorgang | Thema | Sitzung**; `Ereignis` ist eigenständiges fachliches Objekt unterhalb der Meldungsebene.
- „Aktuell“ ist ausschließlich zeitliche Hervorhebung.
- Ereignis und Meldung sind getrennte fachliche Objekte.
- Meldung, Vorgang und Thema sind fachlich getrennte Objekttypen.
- Themen und Vorgänge erscheinen öffentlich gemeinsam unter **„Im Blick“**.
- Vorgänge besitzen eigenen aktuellen Stand, Verlauf und Status.
- Themen erklären übergeordnete Zusammenhänge und gewichten Vorgänge bzw. direkt ergänzte Ereignisse nach **Bedeutung für das Thema**: prägend, relevant oder ergänzend.
- Perspektiven und Wirkungen erklären die fachliche Relevanz; eine eigene Wirkungsrollen-Taxonomie wird nicht geführt.
- Meldungs-, Vorgangs-, Themen- und Sitzungsdetailseiten sind grundsätzlich festgelegt; einzelne aus dem Demonstrator übernommene Inhaltsbausteine werden unter G2.5 nachgeschärft.
- zentrale Suche und schlanke Filterlogik sind festgelegt.
- „Mehr wissen?“ unterscheidet Ereignis-, Vorgangs- und Themenvertiefung und benötigt für Tatsachenbehauptungen eine belastbare Quellenbasis.
- PWA umfasst lokalen Neuigkeitsstatus, optionale Push-Abonnements und ergänzende Badge-Unterstützung; fachlich relevante Aktualisierungen zählen als Neuigkeit.
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

## Dokumentationsübernahme – unter G2.5 erneut in Prüfung

Übernommen bzw. konsolidiert sind:

1. Management Approach → `docs/FIB_Management-Approach.md`
2. Inhaltliches Fachkonzept → `docs/Fachkonzept.md`
3. KI-Leitfaden → `docs/KI-Leitfaden.md`
4. KI-Modellunabhängigkeit/Qualität → `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
5. Quellenmonitor/Recherche → `docs/Recherche-und-Quellenmonitor.md`
6. Mehr wissen → `docs/Mehr-wissen.md`
7. Frontend/Darstellung → in `docs/UX-und-Informationsarchitektur.md` integriert; Vollständigkeit sichtbarer Inhaltsbausteine wird erneut geprüft
8. Marketing/Kommunikation → `docs/Marketing-und-Kommunikation.md`
9. SEO/Auffindbarkeit → `docs/SEO-und-Auffindbarkeit.md`
10. KI-Kosten/Betrieb → `docs/KI-Betrieb-und-Kosten.md`
11. Grüne Werte/politische Ziele → `docs/Gruene-Werte-und-politische-Ziele.md`
12. wissenschaftlich-politische/bürgernahe Sprachregeln → `docs/Sprachleitfaden.md`

Zusätzlich bestehen der Transfer-Audit, die zweite Prüfschicht für Inhaltsbausteine/Redaktionsfunktionen und ein Regressionstestkorpus. Frühere FIB-Chats bleiben ausschließlich Lückenfinder. Laufende Dokumentation wird ausschließlich im Echtsystem fortgeschrieben.

## Neue Echtsystem-Dokumentation

- Visuelle Identität / Logo / Bildsprache / UI-Stil → `docs/Visuelle-Identitaet-und-Bildkonzept.md`
- Migration Entwickler-Infrastruktur → GRÜNEN-Infrastruktur → `docs/Migrationsstrategie.md`
- strukturierter Redaktionsworkflow → `docs/Redaktionsworkflow.md`
- Transfer-Audit → `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- zweite Transfer-Prüfschicht Inhaltsbausteine/Redaktionsfunktionen → `docs/Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`
- Transfer-Regressionstests → `docs/Regressionstests-Demonstratortransfer.md`

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
| 2.7 | 04.10.2026 | G2.5 nach neu erkannter Lücke bei sichtbaren Inhaltsbausteinen und Redaktionsfunktionen wieder auf „In Arbeit“ gesetzt; zweite Transfer-Prüfschicht und neues Auditdokument verankert; G3-Fortsetzung hinter Abschluss der aktuellen Transfernacharbeit eingeordnet. |
| 2.6 | 03.10.2026 | G2.5 nach abgeschlossenem Transfer-Audit und bestandenen Transfer-Gate auf abgeschlossen gesetzt; Dokumentationsübernahme erneut als abgeschlossen markiert; G3 wieder als aktiven nächsten Schritt gesetzt; G3/G5/G10-Folgeaufträge aus dem Transfer-Audit verankert. |
| 2.5 | 03.10.2026 | G2.5 „Transfer-Audit Demonstrator → Echtsystem“ als laufenden Zwischenschritt zwischen G2 und vollständiger Fortsetzung von G3 aufgenommen; bisherige Aussage „Dokumentationsübernahme abgeschlossen“ wegen neu erkannter Versionsdrift und Transferlücken auf „teilweise umgesetzt“ zurückgenommen; Transfer-Gate, fünf Prüfquellen und unmittelbare Regelübernahme verankert. |
| 2.4 | 03.10.2026 | Hybrid-KI als Entwicklungsprinzip aufgenommen: verpflichtende Entdeckungs-/Eingangs-KI, bedarfsgesteuerte Recherche-KI, optionale Redaktions-KI und modellunabhängiger Kern; Quellenmonitor in Quellenbeobachtung und Quellenentdeckung gegliedert; G3/G5/G7/G10 sowie vorläufigen KI-Kostenrahmen angepasst. |
