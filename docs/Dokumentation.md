# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 29.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| Fachkonzept | noch anzulegen bzw. aus Demonstrator-Primärquellen zu überführen | offen |
| UX / Informationsarchitektur / Benutzerführung | noch anzulegen | offen |
| Architektur | noch anzulegen | offen |
| Datenmodell | noch anzulegen | offen |
| Sicherheit / Datenschutz | noch anzulegen | offen |
| Deployment / Betrieb | noch anzulegen | offen |
| Backup / Restore | noch anzulegen | offen |
| Administration | noch anzulegen | offen |
| Architekturentscheidungen | `docs/decisions/` | bei Bedarf |
| Arbeitsregeln für KI-/Entwicklungsarbeit | `AGENTS.md` | vorhanden |

Dokumente werden erst angelegt, wenn ein eigener verbindlicher Dokumenttyp tatsächlich benötigt wird. Kleine Sachverhalte dürfen zusammengeführt werden, solange die Zuständigkeit eindeutig bleibt.

## 5. Übergabe vom Demonstrator

Maßgebliche Ausgangsquelle:

`PustefixReisen/presseschau-feldkirchen-demo/docs/FIB_Uebergabe_Echtsystem.md`

Der Demonstrator bleibt Referenz. Er ist keine zweite produktive Dokumentationsquelle des Echtsystems.

Übernommene fachliche Regeln werden im Verlauf der Projektgründung in die neuen kanonischen Echtsystem-Dokumente überführt oder ausdrücklich als weiterhin referenzierte Primärquelle gekennzeichnet.

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
| 1.0 | 29.09.2026 | Dokumentationslandkarte für das FIB-Echtsystem angelegt. |
