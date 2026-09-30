# Dokumentationsübernahme Demonstrator → Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument dokumentiert die einmalige Übernahme der für das Echtsystem weiterhin erforderlichen Dokumentation aus `PustefixReisen/presseschau-feldkirchen-demo` und aus den bislang gemeinsam verwendeten Bibliotheksgrundlagen.

> **Der Demonstrator bleibt historische Referenz. Die laufende Dokumentationshoheit liegt ausschließlich im Repository `PustefixReisen/fib-echtsystem`.**

## 2. Klassifikationslogik

Jede bisherige Grundlage wird einer von vier Klassen zugeordnet:

1. **übernehmen und aktualisieren**,
2. **in bestehende Echtsystem-Dokumentation integrieren**,
3. **nur historisch referenzieren**,
4. **entfallen**.

Eine 1:1-Kopie erfolgt nur, wenn Inhalt und Struktur weiterhin passen. Veraltete Terminologie, Demonstrator-Provisorien und überholte Fachlogik werden nicht konserviert.

## 3. Übernahmematrix

| Bisherige Grundlage | Echtsystem-Ziel | Status | Hinweis |
|---|---|---|---|
| `FIB_Management-Approach.md` | `docs/FIB_Management-Approach.md` | **übernommen / aktualisiert** | Presseschau-Begriff bereinigt; Meldung/Vorgang/Thema/Sitzung aktualisiert |
| `FIB-Inhaltliches-Konzept.md` + fachliche ODT | `docs/Fachkonzept.md` | **übernommen / aktualisiert** | aktuelle Wissensstruktur und Aufnahmegrundsätze maßgeblich |
| `KI-Leitfaden_Homepage-Presseschau` | `docs/KI-Leitfaden.md` | **übernommen / aktualisiert** | Demonstratorpfade und Testlauf-Provisorien entfernt |
| `FIB_Modellunabhaengigkeit_und_Qualitaetspruefung.md` | `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | **übernommen / aktualisiert** | eigener Qualitäts- und Regressionstestbereich |
| `FIB-Quellenmonitor.md` | `docs/Recherche-und-Quellenmonitor.md` | **übernommen / konsolidiert** | fachliche Funktion statt Demo-Implementierung |
| `FIB-Quellenmonitor-Architektur.md` | `docs/Recherche-und-Quellenmonitor.md` | **integriert** | Zielanforderungen übernommen |
| `FIB_Mehr_wissen_Assistent.md` | `docs/Mehr-wissen.md` | **übernommen / aktualisiert** | Meldung/Vorgang/Thema differenziert; Live-Fragen nicht MVP |
| `FIB_Marketing-und-Kommunikation.md` | `docs/Marketing-und-Kommunikation.md` | **übernommen / aktualisiert** | digitaler/analoger Raum, Reichweite und Bindung erhalten |
| `FIB_SEO-und-Auffindbarkeit.md` | `docs/SEO-und-Auffindbarkeit.md` | **übernommen / aktualisiert** | Vorgang zusätzlich als dauerhafter Wissensknoten |
| `FIB_KI-Kosten_und_Betriebsmodell.md` | `docs/KI-Betrieb-und-Kosten.md` | **übernommen / aktualisiert** | dauerhafte Betriebsregeln von zeitabhängigen Preislisten getrennt |
| `FIB_Frontend_und_Darstellung.md` | `docs/UX-und-Informationsarchitektur.md` v2.5 | **integriert** | gültige Frontendregeln konsolidiert; alte Navigation/Archiv-/Demo-Technik verworfen |
| `FIB_Uebergabe_Echtsystem.md` | Projektgründung, Roadmap, diese Matrix | **historisch referenziert / integriert** | aktueller Echtsystem-Stand ersetzt Übergabeannahmen |
| Demonstrator-`Dokumentation.md` | `docs/Dokumentation.md` | **nicht übernommen** | eigenes Echtsystem-Dokument vorhanden |
| `Gruene_Werte_und_politische_Ziele.md` | `docs/Gruene-Werte-und-politische-Ziele.md` | **übernommen / aktualisiert** | Presseschau-Terminologie entfernt; politischer Bezugsrahmen bleibt eigenständige Quelle |
| `Merkblatt_Wissenschaftlich-Politische_Sprache.md` | `docs/Sprachleitfaden.md` | **übernommen / aktualisiert** | mit bürgernaher Sprache und Barrierefreiheitsabgrenzung konsolidiert |

## 4. Visuelle Referenzen und Bilder

Die vorhandenen im bisherigen Projekt-/Bibliotheksbestand erzeugten FIB-Bilder werden **nicht als fachliche Dokumente kopiert**.

Sie bleiben Referenzmaterial für den noch offenen G2-Punkt **Visuelles Identitäts- und Bildkonzept**. Dort wird entschieden:

- welche Motive als Standardmotive übernommen werden,
- welche Rechte-/Provenienzinformationen dauerhaft gespeichert werden müssen,
- wie Logo/Wortmarke und Fallback-Bildpool aussehen,
- welche Bilder nur Entwicklungsreferenz bleiben.

## 5. Frontend-/Darstellungsdokument

`FIB_Frontend_und_Darstellung.md` lebt nicht als zweite Datei weiter. Die weiterhin gültigen Anforderungen sind in `docs/UX-und-Informationsarchitektur.md` v2.5 integriert, insbesondere:

- mobile-first und responsive Darstellung,
- semantische/barrierearme UI,
- Bilder/Alttexte/Rechte,
- Dialog- und Navigationsprinzipien,
- strukturierte Suche statt Rekonstruktion aus gerendertem Text,
- Quellen-, Aktualisierungs- und Vertiefungsdarstellung.

Nicht übernommen wurden demonstratorspezifische JavaScript-/GitHub-Pages-Provisorien, alte Navigation und überholte Archivlogik.

## 6. Noch offene Abschlussarbeiten

Die inhaltliche Übernahme der identifizierten erforderlichen Grundlagen ist erfolgt.

Vor Status **Abgeschlossen** stehen noch:

1. Querverweisprüfung zwischen allen kanonischen Echtsystem-Dokumenten,
2. Suche nach veralteter Terminologie wie „Presseschau“ in der laufenden Echtsystem-Dokumentation,
3. Widerspruchsprüfung insbesondere zwischen Fachkonzept, Themen-/Vorgangslogik, KI-Leitfaden und UX,
4. Prüfung, ob bei der visuellen Konzeption noch ein eigenständiges Bild-/Rechtedokument erforderlich wird,
5. Aktualisierung der Dokumentationslandkarte und Roadmap nach Abschlussprüfung.

## 7. Abschlusskriterium

Die Dokumentationsübernahme ist abgeschlossen, wenn:

1. alle erforderlichen Grundlagen klassifiziert sind,
2. alle weiterhin benötigten Inhalte in einer kanonischen Echtsystem-Quelle liegen,
3. die Dokumentationslandkarte diese Quellen ausweist,
4. keine laufende Weiterentwicklung mehr im Demonstrator dokumentiert wird,
5. Widerspruchs- und Vollständigkeitsprüfung abgeschlossen sind.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 30.09.2026 | Quellenmonitor, Mehr wissen, KI-Qualität, Marketing, SEO, KI-Betrieb, Frontend/UX sowie Werte- und Sprachgrundlagen als übernommen markiert; visuelle Referenzen und verbleibende Abschlussprüfung ergänzt. |
| 1.0 | 30.09.2026 | Übernahmematrix für den bekannten Demonstrator-Dokumentbestand angelegt. |
