# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Dokumentationslandkarte für das Repository `PustefixReisen/fib-echtsystem`.

Es legt fest, wo dauerhaft relevante fachliche, technische, organisatorische und betriebliche Sachverhalte verbindlich dokumentiert werden.

## 2. Zentrale Dokumentationsregel

Es gilt das Prinzip:

> **Ein Sachverhalt – eine verbindliche Quelle.**

Andere Dokumente dürfen Sachverhalte zusammenfassen oder referenzieren, aber keine abweichende zweite Festlegung enthalten.

Projektübergreifende Regeln werden nicht in dieses Repository kopiert. Sie bleiben im zentralen Repository `PustefixReisen/pustivo` verbindlich. Dieses Projekt dokumentiert nur Geltungsumfang, Ergänzungen, Abweichungen oder Nichtanwendbarkeit.

## 3. Zentrale Governance

Für FIB gelten insbesondere die zentralen Regeln aus:

- `pustivo/docs/governance/Dokumentenpflege.md`
- `pustivo/docs/governance/Dokumentationsstruktur.md`
- `pustivo/docs/governance/Projektgruendung.md`
- `pustivo/docs/governance/Projektmoderation.md`

Weitere zentrale Governance-Dokumente werden während der Projektgründung geprüft und in der Übernahmematrix klassifiziert als:

- übernommen,
- übernommen mit projektspezifischer Ergänzung,
- abweichend,
- nicht anwendbar.

## 4. Verbindliche Quellen im Projekt

| Themenbereich | Verbindliche Quelle | Status |
|---|---|---|
| Projektüberblick / Einstieg | `README.md` | vorhanden |
| Dokumentationslandkarte | `docs/Dokumentation.md` | vorhanden |
| Projektgründung / Gründungsentscheidungen | `docs/Projektgruendung.md` | in Arbeit |
| Roadmap / nächster Schritt | `docs/Roadmap.md` | vorhanden |
| Fachkonzept | aus Demonstrator-Grundlagen zu überführen und auf Echtsystem-Stand zu konsolidieren | offen |
| Management Approach / redaktionelles Betriebsmodell | aus Demonstrator-Grundlagen zu überführen und auf Echtsystem-Stand zu konsolidieren | offen |
| KI-Leitfaden / modellunabhängige Fachregeln | aus Demonstrator-Grundlagen zu überführen und auf Echtsystem-Stand zu konsolidieren | offen |
| Themen- und Vorgangslogik | `docs/Themen-und-Vorgangslogik.md` | vorhanden |
| UX / Informationsarchitektur / Benutzerführung | `docs/UX-und-Informationsarchitektur.md` | in Arbeit |
| Architektur | noch anzulegen | offen |
| Datenmodell | noch anzulegen | offen |
| Sicherheit / Datenschutz | noch anzulegen | offen |
| Deployment / Betrieb | noch anzulegen | offen |
| Backup / Restore | noch anzulegen | offen |
| Administration | noch anzulegen | offen |
| Architekturentscheidungen | `docs/decisions/` | bei Bedarf |
| Arbeitsregeln für KI-/Entwicklungsarbeit | `AGENTS.md` | vorhanden |

Dokumente werden erst angelegt, wenn ein eigener verbindlicher Dokumenttyp tatsächlich benötigt wird. Kleine Sachverhalte dürfen zusammengeführt werden, solange die Zuständigkeit eindeutig bleibt.

## 5. Übergabe und Dokumentationshoheit gegenüber dem Demonstrator

Ausgangsquelle für die Übernahme ist insbesondere:

`PustefixReisen/presseschau-feldkirchen-demo/docs/FIB_Uebergabe_Echtsystem.md`

Zusätzlich werden die fachlich relevanten Demonstrator-Dokumente einmalig darauf geprüft, ob ihre Inhalte im Echtsystem weiterhin benötigt werden. Relevante Inhalte werden in kanonische Echtsystem-Dokumente übernommen, bereinigt und auf den aktuellen Entwicklungsstand gebracht.

Verbindliche Regel ab Beginn der Echtsystem-Entwicklung:

> **Der Demonstrator ist historische, fachliche und visuelle Referenz. Die weitere fachliche, redaktionelle, UX-bezogene und technische Entwicklung von FIB wird ausschließlich im Repository `PustefixReisen/fib-echtsystem` dokumentiert.**

Daraus folgt:

- Demonstrator-Dokumente werden nicht mehr als laufende Primärdokumentation des Echtsystems fortgeschrieben.
- Erkenntnisse aus dem Demonstrator dürfen übernommen und referenziert werden, werden aber im Echtsystem konsolidiert.
- Wenn ein Demonstrator-Dokument für das Echtsystem weiterhin benötigt wird, entsteht im Echtsystem eine kanonische Fassung oder der Inhalt wird in eine bereits bestehende kanonische Quelle integriert.
- Nach der Übernahme bleibt das Demonstrator-Dokument als historischer Entwicklungsstand unverändert erhalten.
- Widersprüche zwischen Demonstrator und Echtsystem werden zugunsten der kanonischen Echtsystem-Dokumentation aufgelöst.

Besonders zu übernehmen bzw. zu konsolidieren sind derzeit mindestens:

- Management Approach,
- inhaltliches Fachkonzept,
- KI-Leitfaden und modellunabhängige Qualitätsregeln,
- Quellenmonitor und Recherchelogik,
- Mehr-wissen-Konzept,
- Frontend-/Darstellungsregeln, soweit sie nicht bereits in der UX-Dokumentation aufgegangen sind,
- Marketing-/Kommunikationskonzept einschließlich Reichweite, Bindung und analogem Raum,
- SEO/Auffindbarkeit,
- KI-Kosten- und Betriebsregeln, soweit sie für das Echtsystem weiter gelten.

Die Übernahme ist keine 1:1-Kopie. Veraltete Demonstrator-Annahmen werden dabei entfernt oder an die aktuelle Logik angepasst, insbesondere die Trennung von **Beitrag, Vorgang und Thema** sowie die daraus folgenden redaktionellen Ebenen.

## 6. Pflegepflicht

Bei jeder verbindlichen fachlichen, technischen, architektonischen, Sicherheits-, Datenmodell-, Prozess- oder Designentscheidung wird geprüft:

1. welches Dokument die verbindliche Quelle ist,
2. welche anderen Dokumente betroffen sind,
3. ob Widersprüche oder veraltete Aussagen entstehen,
4. ob Roadmap und Issues angepasst werden müssen,
5. ob Dokumentstand und Änderungshistorie fortzuschreiben sind.

Bei vorhandenem GitHub-Zugriff erfolgt die Dokumentationspflege unmittelbar im Projekt.

## 7. Dokumentationsstruktur

Für dauerhaft gepflegte Dokumente gilt grundsätzlich:

1. Titel
2. Dokumentstand
3. Inhalt
4. Änderungshistorie als letzter inhaltlicher Abschnitt

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.2 | 30.09.2026 | Dokumentationshoheit des Echtsystems festgelegt; Demonstrator als eingefrorene Referenz definiert; Übernahme und Konsolidierung der weiterhin benötigten Demonstrator-Dokumente als verbindlicher Übergabeschritt aufgenommen. |
| 1.1 | 29.09.2026 | `docs/UX-und-Informationsarchitektur.md` als verbindliche Primärquelle für G2 aufgenommen. |
| 1.0 | 29.09.2026 | Dokumentationslandkarte für das FIB-Echtsystem angelegt. |
