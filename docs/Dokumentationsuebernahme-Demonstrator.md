# Dokumentationsübernahme Demonstrator → Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument dokumentiert die einmalige Übernahme der für das Echtsystem weiterhin erforderlichen Dokumentation aus `PustefixReisen/presseschau-feldkirchen-demo` und aus den bislang gemeinsam verwendeten Bibliotheksgrundlagen.

> **Der Demonstrator bleibt historische Referenz. Die laufende Dokumentationshoheit liegt ausschließlich im Repository `PustefixReisen/fib-echtsystem`.**

**Status der Übernahme: abgeschlossen.**

## 2. Klassifikationslogik

Jede bisherige Grundlage wurde einer von vier Klassen zugeordnet:

1. **übernehmen und aktualisieren**,
2. **in bestehende Echtsystem-Dokumentation integrieren**,
3. **nur historisch referenzieren**,
4. **entfallen**.

Eine 1:1-Kopie erfolgte nur dort, wo Inhalt und Struktur weiterhin passten. Veraltete Terminologie, Demonstrator-Provisorien und überholte Fachlogik wurden nicht konserviert.

## 3. Übernahmematrix

| Bisherige Grundlage | Echtsystem-Ziel | Status | Hinweis |
|---|---|---|---|
| `FIB_Management-Approach.md` | `docs/FIB_Management-Approach.md` | **übernommen / aktualisiert** | Meldung/Vorgang/Thema/Sitzung und Aufnahmelogik aktualisiert |
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
| `Gruene_Werte_und_politische_Ziele.md` | `docs/Gruene-Werte-und-politische-Ziele.md` | **übernommen / aktualisiert** | politischer Bezugsrahmen bleibt eigenständige Quelle |
| `Merkblatt_Wissenschaftlich-Politische_Sprache.md` | `docs/Sprachleitfaden.md` | **übernommen / aktualisiert** | mit bürgernaher Sprache und Barrierefreiheitsabgrenzung konsolidiert |

## 4. Visuelle Referenzen und Bilder

Die vorhandenen FIB-Bilder wurden nicht als fachliche Dokumente kopiert. Sie bleiben Referenzmaterial für den offenen G2-Punkt **Visuelles Identitäts- und Bildkonzept**.

Dort wird entschieden:

- welche Motive als Standardmotive übernommen werden,
- welche Rechte-/Provenienzinformationen dauerhaft gespeichert werden,
- wie Logo/Wortmarke und Fallback-Bildpool aussehen,
- welche Bilder nur Entwicklungsreferenz bleiben.

Falls daraus ein eigenes dauerhaftes Bild-/Rechtedokument erforderlich wird, wird dieses im Echtsystem neu angelegt. Das ist eine neue G2-Entscheidung und keine offene Alt-Dokumentationsübernahme.

## 5. Frontend-/Darstellungsdokument

`FIB_Frontend_und_Darstellung.md` lebt nicht als zweite Datei weiter. Die weiterhin gültigen Anforderungen sind in `docs/UX-und-Informationsarchitektur.md` v2.5 integriert, insbesondere:

- Mobile First und responsive Darstellung,
- semantische/barrierearme UI,
- Bilder/Alttexte/Rechte,
- Dialog- und Navigationsprinzipien,
- strukturierte Suche,
- Quellen-, Aktualisierungs- und Vertiefungsdarstellung.

Nicht übernommen wurden demonstratorspezifische JavaScript-/GitHub-Pages-Provisorien, alte Navigation und überholte Archivlogik.

## 6. Abschlussprüfung

Die Abschlussprüfung ergab:

- alle identifizierten weiterhin erforderlichen Grundlagen besitzen eine kanonische Echtsystem-Heimat,
- README und Projektgründung wurden auf die Dokumentationshoheit des Echtsystems umgestellt,
- der KI-Leitfaden verweist ausschließlich auf die neuen kanonischen Echtsystem-Quellen,
- die alte Bezeichnung „Presseschau“ ist keine aktuelle Produkt- oder Inhaltsbezeichnung mehr; historische Nennungen in Dateinamen, Repository-Namen oder Änderungshistorien bleiben zulässig,
- die aktuelle Wissensstruktur **Ereignis → Meldung → Vorgang → Thema** ist in Fachkonzept, Management Approach, KI-Leitfaden, UX und Projektgründung konsistent verankert,
- Sitzung bleibt querliegender Beratungs- und Entscheidungskontext,
- die alte Frontend-Dokumentation wurde in die UX-Primärquelle integriert statt dupliziert.

## 7. Abschlusskriterium

Die Kriterien sind erfüllt:

1. alle erforderlichen Grundlagen sind klassifiziert,
2. alle weiterhin benötigten Inhalte liegen in kanonischen Echtsystem-Quellen,
3. die Dokumentationslandkarte weist diese Quellen aus,
4. laufende Weiterentwicklung erfolgt nicht mehr im Demonstrator,
5. Querverweis-, Terminologie- und Widerspruchsprüfung wurden durchgeführt.

Die Dokumentationsübernahme ist damit **abgeschlossen**.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 30.09.2026 | Querverweis-, Terminologie- und Konsistenzprüfung abgeschlossen; README, Projektgründung und KI-Leitfaden bereinigt; Dokumentationsübernahme formal abgeschlossen. |
| 1.1 | 30.09.2026 | Quellenmonitor, Mehr wissen, KI-Qualität, Marketing, SEO, KI-Betrieb, Frontend/UX sowie Werte- und Sprachgrundlagen als übernommen markiert. |
| 1.0 | 30.09.2026 | Übernahmematrix für den bekannten Demonstrator-Dokumentbestand angelegt. |
