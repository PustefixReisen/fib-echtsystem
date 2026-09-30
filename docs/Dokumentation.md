# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.6 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Dokumentationslandkarte für das Repository `PustefixReisen/fib-echtsystem`.

Es legt fest, wo dauerhaft relevante fachliche, technische, organisatorische und betriebliche Sachverhalte verbindlich dokumentiert werden.

## 2. Zentrale Dokumentationsregel

Es gilt:

> **Ein Sachverhalt – eine verbindliche Quelle.**

Andere Dokumente dürfen zusammenfassen oder referenzieren, aber keine abweichende zweite Festlegung enthalten.

Projektübergreifende Regeln bleiben im zentralen Repository `PustefixReisen/pustivo` verbindlich und werden hier nicht dupliziert.

## 3. Zentrale Governance

Für FIB gelten insbesondere:

- `pustivo/docs/governance/Dokumentenpflege.md`
- `pustivo/docs/governance/Dokumentationsstruktur.md`
- `pustivo/docs/governance/Projektgruendung.md`
- `pustivo/docs/governance/Projektmoderation.md`

## 4. Verbindliche Quellen im Projekt

| Themenbereich | Verbindliche Quelle | Status |
|---|---|---|
| Projektüberblick / Einstieg | `README.md` | vorhanden |
| Dokumentationslandkarte | `docs/Dokumentation.md` | vorhanden |
| Projektgründung / Gründungsentscheidungen | `docs/Projektgruendung.md` | in Arbeit |
| Roadmap / nächster Schritt | `docs/Roadmap.md` | vorhanden |
| Fachkonzept | `docs/Fachkonzept.md` | vorhanden |
| Management Approach | `docs/FIB_Management-Approach.md` | vorhanden |
| KI-Arbeitsregeln | `docs/KI-Leitfaden.md` | vorhanden |
| KI-Qualität / Modellunabhängigkeit | `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | vorhanden |
| Grüne Werte / politische Ziele | `docs/Gruene-Werte-und-politische-Ziele.md` | vorhanden |
| Sprachregeln | `docs/Sprachleitfaden.md` | vorhanden |
| Themen- und Vorgangslogik | `docs/Themen-und-Vorgangslogik.md` | vorhanden |
| Recherche / Quellenmonitor | `docs/Recherche-und-Quellenmonitor.md` | vorhanden |
| „Mehr wissen?“ | `docs/Mehr-wissen.md` | vorhanden |
| UX / Informationsarchitektur / Benutzerführung | `docs/UX-und-Informationsarchitektur.md` | in Arbeit – fachlich weitgehend konsolidiert |
| Marketing / Kommunikation | `docs/Marketing-und-Kommunikation.md` | vorhanden |
| SEO / Auffindbarkeit | `docs/SEO-und-Auffindbarkeit.md` | vorhanden |
| KI-Betrieb / Kosten | `docs/KI-Betrieb-und-Kosten.md` | vorhanden |
| Übernahme Demonstrator-Dokumentation | `docs/Dokumentationsuebernahme-Demonstrator.md` | Abschlussprüfung offen |
| Architektur | noch anzulegen | offen |
| Datenmodell | noch anzulegen | offen |
| Sicherheit / Datenschutz | noch anzulegen | offen |
| Deployment / Betrieb | noch anzulegen | offen |
| Backup / Restore | noch anzulegen | offen |
| Administration | noch anzulegen | offen |
| Architekturentscheidungen | `docs/decisions/` | bei Bedarf |
| Arbeitsregeln für KI-/Entwicklungsarbeit | `AGENTS.md` | vorhanden |

## 5. Dokumentationshoheit gegenüber dem Demonstrator

> **Der Demonstrator ist historische, fachliche und visuelle Referenz. Die weitere fachliche, redaktionelle, UX-bezogene und technische Entwicklung von FIB wird ausschließlich im Repository `PustefixReisen/fib-echtsystem` dokumentiert.**

Daraus folgt:

- Demonstrator-Dokumente werden nicht mehr als laufende Primärdokumentation fortgeschrieben.
- Relevante Inhalte wurden einmalig übernommen, bereinigt und aktualisiert.
- Nach der Übernahme bleibt die Demonstrator-Fassung historischer Stand.
- Widersprüche werden zugunsten der kanonischen Echtsystem-Dokumentation aufgelöst.

Die detaillierte Zuordnung steht in `docs/Dokumentationsuebernahme-Demonstrator.md`.

## 6. Stand der Übernahme

Die inhaltliche Übernahme der identifizierten erforderlichen Dokumentationsgrundlagen ist durchgeführt.

Ins Echtsystem überführt wurden insbesondere:

- Management Approach,
- Fachkonzept,
- KI-Leitfaden,
- KI-Qualität und Modellunabhängigkeit,
- Quellenmonitor und Recherchelogik,
- Mehr-wissen-Konzept,
- Frontend-/Darstellungsregeln in die UX-Primärquelle,
- Marketing und Kommunikation,
- SEO und Auffindbarkeit,
- KI-Betrieb und Kosten,
- grüne Werte und politische Ziele,
- wissenschaftlich-politische und bürgernahe Sprachregeln.

Nicht als eigene Echtsystem-Dokumente übernommen wurden Demonstrator-Dokumente, deren Funktion bereits durch eine kanonische Echtsystem-Quelle erfüllt wird, sowie demonstratorspezifische technische Provisorien.

Vor dem formalen Status **Abgeschlossen** stehen noch:

1. Querverweis- und Terminologieprüfung,
2. Widerspruchs- und Vollständigkeitsprüfung,
3. Klärung, ob aus dem noch offenen visuellen Identitäts-/Bildkonzept ein eigenes dauerhaftes Bild-/Rechtedokument entsteht.

## 7. Pflegepflicht

Bei jeder verbindlichen fachlichen, technischen, architektonischen, Sicherheits-, Datenmodell-, Prozess- oder Designentscheidung wird geprüft:

1. welches Dokument die verbindliche Quelle ist,
2. welche anderen Dokumente betroffen sind,
3. ob Widersprüche oder veraltete Aussagen entstehen,
4. ob Roadmap und Issues angepasst werden müssen,
5. ob Dokumentstand und Änderungshistorie fortzuschreiben sind.

Bei vorhandenem GitHub-Zugriff erfolgt die Dokumentationspflege unmittelbar im Projekt.

## 8. Dokumentationsstruktur

Für dauerhaft gepflegte Dokumente gilt grundsätzlich:

1. Titel
2. Dokumentstand
3. Inhalt
4. Änderungshistorie als letzter inhaltlicher Abschnitt

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.6 | 30.09.2026 | Frontendregeln in UX v2.5 integriert; Werte- und Sprachgrundlagen ins Echtsystem übernommen; Übernahmestatus auf inhaltlich durchgeführt mit offener Abschlussprüfung gesetzt. |
| 1.5 | 30.09.2026 | Recherche, Mehr wissen, KI-Qualität, Marketing, SEO und KI-Betrieb übernommen; Übernahmematrix aufgenommen. |
| 1.4 | 30.09.2026 | Fachkonzept und KI-Leitfaden als kanonische Primärquellen aufgenommen. |
| 1.3 | 30.09.2026 | Management Approach als kanonische Echtsystem-Fassung aufgenommen. |
| 1.2 | 30.09.2026 | Dokumentationshoheit des Echtsystems festgelegt; Demonstrator als eingefrorene Referenz definiert. |
| 1.1 | 29.09.2026 | UX- und Informationsarchitektur als verbindliche Primärquelle aufgenommen. |
| 1.0 | 29.09.2026 | Dokumentationslandkarte angelegt. |
