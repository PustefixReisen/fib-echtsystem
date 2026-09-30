# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.5 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| Themen- und Vorgangslogik | `docs/Themen-und-Vorgangslogik.md` | vorhanden |
| Recherche / Quellenmonitor | `docs/Recherche-und-Quellenmonitor.md` | vorhanden |
| „Mehr wissen?“ | `docs/Mehr-wissen.md` | vorhanden |
| UX / Informationsarchitektur / Benutzerführung | `docs/UX-und-Informationsarchitektur.md` | in Arbeit |
| Marketing / Kommunikation | `docs/Marketing-und-Kommunikation.md` | vorhanden |
| SEO / Auffindbarkeit | `docs/SEO-und-Auffindbarkeit.md` | vorhanden |
| KI-Betrieb / Kosten | `docs/KI-Betrieb-und-Kosten.md` | vorhanden |
| Übernahme Demonstrator-Dokumentation | `docs/Dokumentationsuebernahme-Demonstrator.md` | in Arbeit |
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
- Relevante Inhalte werden einmalig übernommen, bereinigt und aktualisiert.
- Nach der Übernahme bleibt die Demonstrator-Fassung historischer Stand.
- Widersprüche werden zugunsten der kanonischen Echtsystem-Dokumentation aufgelöst.

Die detaillierte Übernahmematrix steht in `docs/Dokumentationsuebernahme-Demonstrator.md`.

## 6. Noch offene Übernahmepunkte

Nach der aktuellen Übernahmerunde bleiben insbesondere:

1. die noch relevanten Regeln aus `FIB_Frontend_und_Darstellung.md` in `docs/UX-und-Informationsarchitektur.md` zu integrieren,
2. die außerhalb des Demo-`docs`-Ordners liegenden fachlichen Grundlagen eindeutig zu überführen bzw. zu referenzieren, insbesondere:
   - `Gruene_Werte_und_politische_Ziele.md`,
   - `Merkblatt_Wissenschaftlich-Politische_Sprache`,
   - gegebenenfalls Bild-/Rechte- und weitere tatsächlich verwendete redaktionelle Grundlagen,
3. danach eine Widerspruchs- und Vollständigkeitsprüfung durchzuführen.

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
| 1.5 | 30.09.2026 | Übernahme der Demonstrator-Dokumente zu Recherche, Mehr wissen, KI-Qualität, Marketing, SEO und KI-Betrieb dokumentiert; Übernahmematrix als eigene Quelle aufgenommen; verbleibende Punkte auf UX-Integration und externe fachliche Grundlagen eingegrenzt. |
| 1.4 | 30.09.2026 | `docs/Fachkonzept.md` und `docs/KI-Leitfaden.md` als kanonische Echtsystem-Primärquellen aufgenommen. |
| 1.3 | 30.09.2026 | `docs/FIB_Management-Approach.md` als kanonische Echtsystem-Fassung aufgenommen. |
| 1.2 | 30.09.2026 | Dokumentationshoheit des Echtsystems festgelegt; Demonstrator als eingefrorene Referenz definiert. |
| 1.1 | 29.09.2026 | `docs/UX-und-Informationsarchitektur.md` als verbindliche Primärquelle für G2 aufgenommen. |
| 1.0 | 29.09.2026 | Dokumentationslandkarte für das FIB-Echtsystem angelegt. |
