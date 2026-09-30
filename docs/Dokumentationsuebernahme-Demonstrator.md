# Dokumentationsübernahme Demonstrator → Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument dokumentiert die einmalige Übernahme der für das Echtsystem weiterhin erforderlichen Dokumentation aus `PustefixReisen/presseschau-feldkirchen-demo`.

Es gilt die Regel:

> **Der Demonstrator bleibt historische Referenz. Die laufende Dokumentationshoheit liegt ausschließlich im Repository `PustefixReisen/fib-echtsystem`.**

## 2. Klassifikationslogik

Jedes relevante Demonstrator-Dokument wird einer von vier Klassen zugeordnet:

1. **übernehmen und aktualisieren**,
2. **in bestehende Echtsystem-Dokumentation integrieren**,
3. **nur historisch referenzieren**,
4. **entfallen**.

Eine 1:1-Kopie erfolgt nur, wenn Inhalt und Struktur weiterhin vollständig passen. Veraltete Terminologie, Demonstrator-Provisorien und überholte Fachlogik werden nicht konserviert.

## 3. Übernahmematrix

| Demonstrator-Dokument | Echtsystem-Ziel | Status | Hinweis |
|---|---|---|---|
| `FIB_Management-Approach.md` | `docs/FIB_Management-Approach.md` | **übernommen / aktualisiert** | Presseschau-Begriff bereinigt; Meldung/Vorgang/Thema/Sitzung aktualisiert |
| `FIB-Inhaltliches-Konzept.md` sowie kanonische fachliche Beschreibung | `docs/Fachkonzept.md` | **übernommen / aktualisiert** | aktuelle Wissensstruktur und Aufnahmegrundsätze maßgeblich |
| `KI-Leitfaden_Homepage-Presseschau` | `docs/KI-Leitfaden.md` | **übernommen / aktualisiert** | Demonstratorpfade und Testlauf-Provisorien entfernt; modellunabhängige Echtsystem-Regeln |
| `FIB_Modellunabhaengigkeit_und_Qualitaetspruefung.md` | `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | **übernommen / aktualisiert** | eigener Qualitäts- und Regressionstestbereich |
| `FIB-Quellenmonitor.md` | `docs/Recherche-und-Quellenmonitor.md` | **übernommen / konsolidiert** | fachliche Funktion statt heutiger Python/GitHub-Actions-Implementierung |
| `FIB-Quellenmonitor-Architektur.md` | `docs/Recherche-und-Quellenmonitor.md` | **integriert** | Zielarchitekturhinweise in fachliche Monitor-Anforderungen übernommen |
| `FIB_Mehr_wissen_Assistent.md` | `docs/Mehr-wissen.md` | **übernommen / aktualisiert** | Meldung/Vorgang/Thema differenziert; Live-Fragen nicht MVP |
| `FIB_Marketing-und-Kommunikation.md` | `docs/Marketing-und-Kommunikation.md` | **übernommen / aktualisiert** | digitaler und analoger Raum, Reichweite und Bindung erhalten |
| `FIB_SEO-und-Auffindbarkeit.md` | `docs/SEO-und-Auffindbarkeit.md` | **übernommen / aktualisiert** | Vorgang zusätzlich als dauerhafter Wissensknoten aufgenommen |
| `FIB_KI-Kosten_und_Betriebsmodell.md` | `docs/KI-Betrieb-und-Kosten.md` | **übernommen / aktualisiert** | dauerhafte Regeln von zeitabhängigen Preislisten getrennt |
| `FIB_Frontend_und_Darstellung.md` | `docs/UX-und-Informationsarchitektur.md` | **integrieren / G2-Konsolidierung** | keine zweite konkurrierende UX-Primärquelle; noch relevante Darstellungsdetails werden dort aufgenommen |
| `FIB_Uebergabe_Echtsystem.md` | Projektgründung, Roadmap und dieses Dokument | **historisch referenziert / integriert** | Übergabestand war Ausgangspunkt; aktuelle Echtsystem-Dokumente sind verbindlich |
| Demonstrator-`Dokumentation.md` | `docs/Dokumentation.md` | **nicht übernehmen** | Echtsystem besitzt eigene Dokumentationslandkarte |

## 4. Zusätzlich zu überführende Projektgrundlagen außerhalb des Demo-`docs`-Ordners

Folgende fachlichen Grundlagen werden weiterhin benötigt und müssen im Zuge der Echtsystem-Konsolidierung eine eindeutige kanonische Heimat erhalten:

- `Gruene_Werte_und_politische_Ziele.md`,
- `Merkblatt_Wissenschaftlich-Politische_Sprache`,
- gegebenenfalls Bild-/Rechtegrundlagen und weitere tatsächlich verwendete redaktionelle Referenzdokumente.

Bis zur Überführung dürfen sie als bestehende Referenz verwendet werden, aber neue Echtsystem-Regeln werden nicht mehr in Demonstrator-Dokumente zurückgeschrieben.

## 5. Frontend-/Darstellungsdokument

`FIB_Frontend_und_Darstellung.md` wird bewusst **nicht** als zweite Datei kopiert.

Grund: Das Echtsystem besitzt mit `docs/UX-und-Informationsarchitektur.md` bereits die kanonische Primärquelle für öffentliche Benutzerführung und Darstellung.

Bei der abschließenden G2-Konsolidierung werden aus dem Demonstrator-Dokument nur noch weiterhin gültige Details übernommen, insbesondere:

- semantische und barrierearme Darstellung,
- Bild-/Alttext-/Rechteregeln,
- responsive Regeln,
- Dialog-/History-Verhalten, soweit weiterhin sinnvoll,
- Trennung strukturierter Suche von Kategorien/Orten/Schlagworten,
- Darstellungsregeln für Quellen, Aktualisierungen und Vertiefungen.

Veraltete Navigation, Archivlogik und Demonstrator-spezifische Browserimplementierungen werden nicht übernommen.

## 6. Abschlusskriterium

Die Dokumentationsübernahme ist abgeschlossen, wenn:

1. alle für das Echtsystem erforderlichen Demonstrator-Dokumente klassifiziert sind,
2. alle weiterhin benötigten Inhalte in einer kanonischen Echtsystem-Quelle liegen,
3. die Dokumentationslandkarte diese Quellen ausweist,
4. keine laufende fachliche Weiterentwicklung mehr im Demonstrator dokumentiert wird,
5. eine Widerspruchs- und Vollständigkeitsprüfung durchgeführt wurde.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 30.09.2026 | Übernahmematrix für den bekannten Demonstrator-Dokumentbestand angelegt und aktuelle Echtsystem-Ziele dokumentiert. |
