# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 3.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Dokumentationslandkarte für das Repository `PustefixReisen/fib-echtsystem`.

Es legt fest, **wo dauerhaft relevante fachliche, technische, organisatorische und betriebliche Sachverhalte verbindlich dokumentiert werden** und welche Quelle bei Überschneidungen maßgeblich ist.

## 2. Zentrale Dokumentationsregel

Es gilt:

> **Ein Sachverhalt – eine verbindliche Quelle.**

Andere Dokumente dürfen zusammenfassen oder referenzieren, aber keine abweichende zweite Festlegung enthalten.

Projektübergreifende Regeln bleiben im zentralen Repository `PustefixReisen/pustivo` verbindlich und werden hier nicht dupliziert. Insbesondere gilt `pustivo/docs/governance/Dokumentenpflege.md`.

Daraus folgt für FIB:

- verbindliche Entscheidungen werden unmittelbar in der zuständigen Primärquelle dokumentiert,
- zurückgestellte Funktionen/Ausbaustufen werden mit Wiederaufnahme-Kriterium in Roadmap oder GitHub-Issue gesichert,
- potenziell dauerhaft relevante, aber noch nicht entschiedene Erkenntnisse werden aktiv auf Dokumentationsbedarf geprüft,
- Chats sind Arbeitsraum und Lückenfinder, aber keine kanonische Projektquelle.

## 3. Zentrale Governance

Für FIB gelten insbesondere:

- `pustivo/docs/governance/Dokumentenpflege.md`
- `pustivo/docs/governance/Dokumentationsstruktur.md`
- `pustivo/docs/governance/Projektgruendung.md`
- `pustivo/docs/governance/Projektmoderation.md`
- die projektspezifischen Arbeitsregeln in `AGENTS.md`.

## 4. Thematische Gliederung

Die FIB-Dokumentation ist logisch in sechs Bereiche gegliedert. Diese Gliederung ist die Navigationsstruktur; sie muss nicht zwingend als physische Ordnerhierarchie umgesetzt werden.

### 4.1 Leitbild und Governance

Leitfrage: **Warum gibt es FIB, welche Grundprinzipien gelten und wie wird das Projekt geführt?**

Primär- und Steuerungsquellen:

- `README.md`
- `docs/FIB_Management-Approach.md`
- `docs/Leitprinzipien-FIB.md`
- `docs/Projektgruendung.md`
- `docs/Dokumentation.md`
- `docs/Roadmap.md`
- `docs/Fachkonzept.md`
- phasenbezogene Gesamtaudits `docs/G*-Gesamtaudit.md`.

### 4.2 Recherche, Wissen und Referenzrahmen

Leitfrage: **Was soll FIB wissen, wo und wie wird recherchiert und nach welchen Maßstäben werden Informationen geprüft und eingeordnet?**

Dazu gehören insbesondere:

- `docs/Recherchearchitektur-und-Referenzrahmen.md`
- `docs/Recherche-und-Quellenmonitor.md`
- `docs/Beobachtungs-und-Recherchemodell.md`
- `docs/Gruene-Werte-und-politische-Ziele.md`
- `docs/KI-Leitfaden.md`
- `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`.

### 4.3 Fachliches Wissens- und Datenmodell

Leitfrage: **Welche fachlichen Objekte kennt FIB und wie hängen sie zusammen?**

Konsolidierte Integrationsquelle:

- `docs/Datenmodell.md`.

Spezialisierte Primärquellen liefern Detailregeln, insbesondere:

- `docs/Themen-und-Vorgangslogik.md`
- `docs/Sitzungs-und-Beschlussmodell.md`
- `docs/Wirkungsmodell.md`
- `docs/Persistenz-und-Lebenszyklusmodell.md`
- `docs/Mehr-wissen-Modell.md`
- `docs/Beobachtungs-und-Recherchemodell.md`
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`
- `docs/Begriffe.md`.

`docs/Datenmodell.md` v3.0 ist seit Abschluss von G3 die konsolidierte Integrationsquelle. Teilmodelle dürfen keine abweichenden Grundregeln definieren.

### 4.4 Redaktion und Veröffentlichung

Leitfrage: **Wie wird aus recherchiertem Wissen ein geprüfter und veröffentlichbarer FIB-Inhalt?**

Dazu gehören insbesondere:

- `docs/Redaktionsworkflow.md`
- `docs/MVP-Fachfunktionen.md`
- `docs/KI-Zugangswege-und-Fachfunktionen.md`
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`
- `docs/Rollen-Rechte-und-Workflow.md`
- `docs/Sprachleitfaden.md`
- `docs/Mehr-wissen.md`
- `docs/Mehr-wissen-Modell.md`.

### 4.5 Nutzererlebnis und Kommunikation

Leitfrage: **Wie erleben Besucher FIB und wie wird das Angebot sichtbar und verständlich?**

Dazu gehören insbesondere:

- `docs/UX-und-Informationsarchitektur.md`
- `docs/Visuelle-Identitaet-und-Bildkonzept.md`
- `docs/Marketing-und-Kommunikation.md`
- `docs/SEO-und-Auffindbarkeit.md`.

### 4.6 Technik und Betrieb

Leitfrage: **Wie wird FIB technisch umgesetzt, geschützt und dauerhaft betrieben?**

Verbindliche Hauptquellen:

- `docs/Zielarchitektur.md` – technische Zielarchitektur, Stack, Komponenten, Hosting-/Deploymentgrundsätze,
- `docs/Schutzbedarf-Datenschutz-und-Offline.md` – Schutzklassen, Datenschutz- und Offlinegrundsätze,
- `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md` – personenbezogene Verarbeitung und Löschlogik,
- `docs/Rollen-Rechte-und-Workflow.md` – Rollen, Rechte, MFA, Aktionsstufen und Policy-Grenzen,
- `docs/Betrieb-und-Wiederherstellung.md` – Backup, Restore, Monitoring, Retention, Störungen und Betriebsziele,
- `docs/KI-Betrieb-und-Kosten.md` – KI-Kosten-, Qualitäts- und Routingbetrieb,
- `docs/Migrationsstrategie.md` – Übergang Entwickler-/Pilotbetrieb → GRÜNEN-Infrastruktur,
- `docs/decisions/` – dauerhafte Architekturentscheidungen (ADR).

## 5. Verbindliche Quellen und Status

| Themenbereich | Verbindliche Quelle | Status |
|---|---|---|
| Projektüberblick / Einstieg | `README.md` | vorhanden |
| Dokumentationslandkarte | `docs/Dokumentation.md` | aktuell – G8 konsolidiert |
| Projektgründung / Gründungsentscheidungen | `docs/Projektgruendung.md` | laufende Integrationsquelle bis Gründungsaudit |
| Roadmap / nächster Schritt | `docs/Roadmap.md` | aktuell |
| Demonstrator-Transfer | `docs/Transfer-Audit-Demonstrator-Echtsystem.md` | abgeschlossen – G2.5 |
| Regressionstestkorpus | `docs/Regressionstests-Demonstratortransfer.md` | vorhanden; technische Umsetzung folgt |
| Fachkonzept | `docs/Fachkonzept.md` | vorhanden |
| Begriffe / Glossar | `docs/Begriffe.md` | G3-konsolidiert |
| Datenmodell | `docs/Datenmodell.md` | abgeschlossen – G3 v3.0 |
| G3 Abschluss | `docs/G3-Gesamtaudit.md` | abgeschlossen |
| Schutzbedarf / Datenschutz / Offline | `docs/Schutzbedarf-Datenschutz-und-Offline.md` | abgeschlossen – G4 |
| Datenschutz / Löschlogik | `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md` | abgeschlossen – G4 |
| Zielarchitektur | `docs/Zielarchitektur.md` | abgeschlossen – G5 v1.0 |
| G5 Abschluss | `docs/G5-Gesamtaudit.md` | abgeschlossen |
| Rollen / Rechte / Workflow | `docs/Rollen-Rechte-und-Workflow.md` | abgeschlossen – G6 v1.0 |
| G6 Abschluss | `docs/G6-Gesamtaudit.md` | abgeschlossen |
| Betrieb / Backup / Restore / Monitoring | `docs/Betrieb-und-Wiederherstellung.md` | abgeschlossen – G7 |
| Backup-Pilotentscheidung | `docs/decisions/ADR-010-Backup-Pilotbetrieb.md` | beschlossen |
| G7 Abschluss | `docs/G7-Gesamtaudit.md` | abgeschlossen |
| KI-Betrieb / Kosten | `docs/KI-Betrieb-und-Kosten.md` | vorhanden; Pilotwerte später kalibrieren |
| Migrationsstrategie | `docs/Migrationsstrategie.md` | vorhanden; G9 konkretisiert Runbook |
| Architekturentscheidungen | `docs/decisions/` | ADR-001 ff., fortlaufend |
| Arbeitsregeln KI-/Entwicklungsarbeit | `AGENTS.md` | vorhanden; zentrale Governance gilt ergänzend |

Weitere fachliche und UX-Primärquellen aus den Bereichen 4.2–4.5 bleiben verbindlich und werden nicht durch diese Statusübersicht ersetzt.

## 6. Abgrenzung wichtiger Integrationsquellen

### 6.1 Datenmodell und Teilmodelle

`docs/Datenmodell.md` beschreibt das konsolidierte fachliche/logische Gesamtmodell. Spezialisierte Teilmodelle erläutern Detailregeln und dürfen das Gesamtmodell nicht parallel neu definieren.

### 6.2 UX und visuelle Identität

`docs/UX-und-Informationsarchitektur.md` ist Primärquelle für Informationsarchitektur, Navigation, Seiten-/Funktionslogik, responsive Bedienung und Barrierefreiheit.

`docs/Visuelle-Identitaet-und-Bildkonzept.md` ist Primärquelle für visuelle Grundhaltung, Logo/Bildmarke, Farbrollen, Bildsprache, Banner, Icons und konkrete gestalterische Anwendung.

Visuelle Mockups dürfen die fachliche UX-Struktur nicht eigenständig verändern.

### 6.3 Zielarchitektur und ADRs

`docs/Zielarchitektur.md` ist die konsolidierte Integrationsquelle für G5. ADRs dokumentieren einzelne dauerhafte Architekturentscheidungen einschließlich Alternativen und Folgen. Bei Widersprüchen muss die Integrationsquelle nachgezogen werden; ein ADR bleibt historischer Entscheidungsnachweis.

### 6.4 Betrieb

`docs/Betrieb-und-Wiederherstellung.md` integriert die G7-Betriebsregeln. Spezialisierte Quellen wie `docs/KI-Betrieb-und-Kosten.md` bleiben für ihren Detailbereich maßgeblich.

## 7. Dokumentationshoheit gegenüber Demonstrator, Chats und Kopien

> **Der Demonstrator ist historische, fachliche und visuelle Referenz. Die laufende Entwicklung von FIB wird ausschließlich im Repository `PustefixReisen/fib-echtsystem` dokumentiert.**

Daraus folgt:

- Demonstrator-Dokumente werden nicht mehr als laufende Primärdokumentation fortgeschrieben.
- Widersprüche werden zugunsten der kanonischen Echtsystem-Dokumentation aufgelöst.
- Bibliotheks-, ODT-, Export- oder sonstige Kopien sind keine gleichwertige Primärquelle.
- Ein neueres Dateidatum allein begründet keine Dokumentationshoheit.
- Frühere und laufende Chats können Erkenntnisse liefern, sind aber keine kanonische Wahrheit.
- Dauerhaft relevante Chat-Ergebnisse werden erst durch Übernahme in eine zuständige Primärquelle oder ein Issue verbindlich bzw. nachverfolgbar.

## 8. Issues für bewusst vertagte Punkte

Bewusst vertagte oder optionale Entwicklungen werden nicht als unspezifisches „später“ geführt. Sie erhalten ein nachvollziehbares Wiederaufnahme-Kriterium.

Aktuell insbesondere:

- Issue #1 – Referenzwissen: Ausbaustufe 2 nach MVP/Pilot prüfen,
- Issue #2 – MCP-Anbindung externer KI-Systeme nach MVP prüfen,
- Issue #3 – Restore-Test vor Produktivstart durchführen.

Neue vertagte Punkte werden nach demselben Muster erfasst, wenn sie später relevant werden können.

## 9. Physische Dokumentationsstruktur

Die logische Sechs-Bereiche-Struktur reicht derzeit als Navigationsmodell aus. Eine physische Umordnung aller Dokumente in nummerierte Unterordner wird **nicht allein aus Ordnungsgesichtspunkten durchgeführt**, da sie zahlreiche Pfad-/Linkänderungen erzeugen würde, ohne den fachlichen Stand zu verbessern.

Eine physische Neuordnung wird nur wieder aufgenommen, wenn mindestens eines der folgenden Kriterien eintritt:

- die Dokumentationslandkarte reicht für zuverlässige Navigation nicht mehr aus,
- die Zahl der Dokumente führt regelmäßig zu Fehlablagen oder falschen Primärquellen,
- technische Dokumentationswerkzeuge profitieren nachweislich von einer Ordnerstruktur,
- ein größerer ohnehin notwendiger Dokumentationsumbau macht die Umstellung mit geringem Zusatzaufwand möglich.

Bis dahin bleibt die bestehende Pfadstruktur stabil.

## 10. Pflegepflicht

Bei jeder verbindlichen fachlichen, technischen, architektonischen, Sicherheits-, Datenmodell-, Prozess- oder Designentscheidung wird geprüft:

1. welches Dokument die verbindliche Quelle ist,
2. welche anderen Dokumente betroffen sind,
3. ob Widersprüche oder veraltete Aussagen entstehen,
4. ob Roadmap und Issues angepasst werden müssen,
5. ob Dokumentstand und Änderungshistorie fortzuschreiben sind.

Zusätzlich gilt die zentrale weit gefasste Dokumentationsprüfung aus `pustivo/docs/governance/Dokumentenpflege.md`.

Bei vorhandenem GitHub-Zugriff erfolgt die Dokumentationspflege unmittelbar im Projekt.

## 11. Dokumentationsstruktur einzelner Dateien

Für dauerhaft gepflegte Dokumente gilt grundsätzlich:

1. Titel,
2. Dokumentstand,
3. Inhalt,
4. Änderungshistorie als letzter inhaltlicher Abschnitt.

Für laufend ergänzte Register oder Glossare kann statt einer fortlaufenden Versionsnummer primär ein Stand-Datum verwendet werden. Eine neue Versionsnummer ist dort nur bei strukturellen oder konzeptionellen Änderungen erforderlich.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 3.0 | 06.10.2026 | G8-Konsolidierung: Dokumentationslandkarte auf Stand G4–G7 gebracht, Zielarchitektur/Rollen/Betrieb/ADRs als Primärquellen ergänzt, vertagte Punkte über Issues verankert und physische Ordnerumstellung nur noch bei konkretem Nutzen vorgesehen. |
| 2.7 | 06.10.2026 | G4-Primärquelle `Schutzbedarf-Datenschutz-und-Offline.md` aufgenommen; G4-Start und Schutzklassifikation K0–K3 in der Dokumentationslandkarte verankert. |
| 2.6 | 05.10.2026 | G3-Abschluss synchronisiert: Datenmodell v3.0 als konsolidierte Integrationsquelle, G3-Gesamtaudit als abgeschlossen und G4 Schutzbedarf/Datenschutz/Offline als nächsten Gründungsschritt ausgewiesen. |
| 2.5 | 05.10.2026 | G3-Konsolidierung in der Dokumentationslandkarte nachgezogen. |
| 2.4 | 05.10.2026 | Dokumentation in sechs übergeordnete Themenbereiche gegliedert; spätere physische Abbildung zunächst vorgesehen. |
| 2.3 | 03.10.2026 | G2.5 nach bestandenem Transfer-Gate als abgeschlossen markiert. |
| 2.2 | 03.10.2026 | G2.5-Transfer-Audit aufgenommen; GitHub-Dokumentationshoheit präzisiert; Chats als Lückenfinder geregelt. |
| 2.1 | 02.10.2026 | `docs/Begriffe.md` als verbindliches Begriffsregister aufgenommen. |
| 2.0 | 01.10.2026 | `docs/Datenmodell.md` als G3-Primärquelle aufgenommen. |
| 1.9 | 01.10.2026 | `docs/Migrationsstrategie.md` aufgenommen. |
| 1.8 | 01.10.2026 | `docs/Visuelle-Identitaet-und-Bildkonzept.md` aufgenommen. |
| 1.7 | 30.09.2026 | Dokumentationsübernahme konsolidiert. |
| 1.0–1.6 | 29.–30.09.2026 | Initiale Dokumentationslandkarte und schrittweise Übernahme der Demonstrator-/Projektquellen. |
