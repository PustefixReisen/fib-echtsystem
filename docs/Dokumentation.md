# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.7 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

## 4. Thematische Gliederung der FIB-Dokumentation

Die FIB-Dokumentation wird fachlich in sechs übergeordnete Bereiche gegliedert. Diese Gliederung dient Menschen und KI als gemeinsame Navigationsstruktur. Sie wird zunächst logisch in dieser Dokumentationslandkarte geführt und soll nach Abschluss der Gründungs- und Konsolidierungsarbeiten auch in der GitHub-Ordnerstruktur abgebildet werden.

### 4.1 Leitbild und Governance

Leitfrage: **Warum gibt es FIB, welche Grundprinzipien gelten und wie wird das Projekt geführt?**

Dazu gehören insbesondere:

- `docs/FIB_Management-Approach.md`
- `docs/Leitprinzipien-FIB.md`
- `docs/Projektgruendung.md`
- `docs/Dokumentation.md`
- `docs/Roadmap.md`
- `docs/Fachkonzept.md`
- `docs/G3-Gesamtaudit.md`

### 4.2 Recherche, Wissen und Referenzrahmen

Leitfrage: **Was soll die KI wissen, wo und wie soll sie recherchieren und nach welchen Maßstäben soll sie Informationen hinterfragen und einordnen?**

Dazu gehören insbesondere:

- `docs/Recherchearchitektur-und-Referenzrahmen.md`
- `docs/Recherche-und-Quellenmonitor.md`
- `docs/Beobachtungs-und-Recherchemodell.md`
- `docs/Gruene-Werte-und-politische-Ziele.md`
- künftige Konkretisierung des demokratisch-gesellschaftlichen Grundrahmens,
- `docs/KI-Leitfaden.md`
- `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`

### 4.3 Fachliches Wissens- und Datenmodell

Leitfrage: **Welche fachlichen Objekte kennt FIB und wie hängen sie zusammen?**

Konsolidierte Integrationsquelle:

- `docs/Datenmodell.md`

Spezialisierte Primärquellen für Detailbereiche:

- `docs/Themen-und-Vorgangslogik.md`
- `docs/Sitzungs-und-Beschlussmodell.md`
- `docs/Wirkungsmodell.md`
- `docs/Persistenz-und-Lebenszyklusmodell.md`
- `docs/Mehr-wissen-Modell.md`
- `docs/Beobachtungs-und-Recherchemodell.md`
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`
- `docs/Begriffe.md`

Mit Abschluss von G3 gilt `docs/Datenmodell.md` v3.0 als konsolidierte Integrationsquelle. Die spezialisierten Teilmodelle liefern Detailregeln, ohne parallel abweichende Grundmodelle zu definieren.

### 4.4 Redaktion und Veröffentlichung

Leitfrage: **Wie wird aus recherchiertem Wissen ein geprüfter und veröffentlichbarer FIB-Inhalt?**

Dazu gehören insbesondere:

- `docs/Redaktionsworkflow.md`
- `docs/MVP-Fachfunktionen.md`
- `docs/KI-Zugangswege-und-Fachfunktionen.md`
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`
- `docs/Sprachleitfaden.md`
- `docs/Mehr-wissen.md`
- `docs/Mehr-wissen-Modell.md`

### 4.5 Nutzererlebnis und Kommunikation

Leitfrage: **Wie erleben Besucherinnen und Besucher FIB und wie wird das Angebot sichtbar und verständlich?**

Dazu gehören insbesondere:

- `docs/UX-und-Informationsarchitektur.md`
- `docs/Visuelle-Identitaet-und-Bildkonzept.md`
- `docs/Marketing-und-Kommunikation.md`
- `docs/SEO-und-Auffindbarkeit.md`

### 4.6 Technik und Betrieb

Leitfrage: **Wie wird FIB technisch umgesetzt und dauerhaft betrieben?**

Dazu gehören insbesondere:

- `docs/Schutzbedarf-Datenschutz-und-Offline.md`,
- künftige Architektur-Primärquelle,
- Deployment / Betrieb,
- Backup / Restore,
- Administration,
- `docs/KI-Betrieb-und-Kosten.md`
- `docs/KI-Zugangswege-und-Fachfunktionen.md`
- `docs/Migrationsstrategie.md`
- Architekturentscheidungen unter `docs/decisions/`.

### 4.7 Künftige Ordnerstruktur

Nach der fachlichen Konsolidierung soll die logische Gliederung grundsätzlich auch physisch abgebildet werden, voraussichtlich in der Form:

```text
docs/
├── 01-governance/
├── 02-recherche-wissen-referenzrahmen/
├── 03-fachmodell/
├── 04-redaktion-veroeffentlichung/
├── 05-ux-kommunikation/
├── 06-technik-betrieb/
└── decisions/
```

Die Umstellung erfolgt bewusst erst dann, wenn dadurch keine laufende Gründungsarbeit unnötig durch Link- und Pfadänderungen gestört wird.

## 5. Verbindliche Quellen im Projekt

| Themenbereich | Verbindliche Quelle | Status |
|---|---|---|
| Projektüberblick / Einstieg | `README.md` | vorhanden |
| Dokumentationslandkarte | `docs/Dokumentation.md` | vorhanden |
| Projektgründung / Gründungsentscheidungen | `docs/Projektgruendung.md` | in Arbeit |
| Roadmap / nächster Schritt | `docs/Roadmap.md` | vorhanden |
| G2.5 Transfer-Audit | `docs/Transfer-Audit-Demonstrator-Echtsystem.md` | abgeschlossen |
| G3 Gesamtaudit | `docs/G3-Gesamtaudit.md` | abgeschlossen |
| Regressionstestkorpus | `docs/Regressionstests-Demonstratortransfer.md` | vorhanden / wird technisch weiter konkretisiert |
| Fachkonzept | `docs/Fachkonzept.md` | vorhanden |
| Begriffe / fachliches Glossar | `docs/Begriffe.md` | vorhanden / G3-konsolidiert |
| Management Approach | `docs/FIB_Management-Approach.md` | vorhanden |
| Leitprinzipien | `docs/Leitprinzipien-FIB.md` | vorhanden |
| Recherchearchitektur / Referenzrahmen | `docs/Recherchearchitektur-und-Referenzrahmen.md` | vorhanden |
| Beobachtungsauftrag / Recherchelauf | `docs/Beobachtungs-und-Recherchemodell.md` | vorhanden |
| KI-Arbeitsregeln | `docs/KI-Leitfaden.md` | vorhanden |
| KI-Qualität / Modellunabhängigkeit | `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | vorhanden |
| Grüne Werte / politische Ziele | `docs/Gruene-Werte-und-politische-Ziele.md` | vorhanden |
| Sprachregeln | `docs/Sprachleitfaden.md` | vorhanden |
| Themen- und Vorgangslogik | `docs/Themen-und-Vorgangslogik.md` | vorhanden |
| Recherche / Quellenmonitor | `docs/Recherche-und-Quellenmonitor.md` | vorhanden |
| „Mehr wissen?“ – redaktionelles Konzept | `docs/Mehr-wissen.md` | vorhanden |
| „Mehr wissen?“ – fachliches Datenmodell | `docs/Mehr-wissen-Modell.md` | vorhanden |
| MVP-Fachfunktionen | `docs/MVP-Fachfunktionen.md` | vorhanden / konsolidiert |
| KI-Zugangswege / Rollen / Fachfunktionsarchitektur | `docs/KI-Zugangswege-und-Fachfunktionen.md` | vorhanden |
| Plausibilitäts- und Freigaberegeln | `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md` | vorhanden |
| UX / Informationsarchitektur / Benutzerführung | `docs/UX-und-Informationsarchitektur.md` | vorhanden |
| Visuelle Identität / Logo / Bildsprache / UI-Stil | `docs/Visuelle-Identitaet-und-Bildkonzept.md` | vorhanden |
| Marketing / Kommunikation | `docs/Marketing-und-Kommunikation.md` | vorhanden |
| SEO / Auffindbarkeit | `docs/SEO-und-Auffindbarkeit.md` | vorhanden |
| KI-Betrieb / Kosten | `docs/KI-Betrieb-und-Kosten.md` | vorhanden |
| Schutzbedarf / Datenschutz / Offline | `docs/Schutzbedarf-Datenschutz-und-Offline.md` | in Arbeit – G4 |
| Migrationsstrategie Entwickler → GRÜNEN-Infrastruktur | `docs/Migrationsstrategie.md` | vorhanden |
| Übernahme Demonstrator-Dokumentation | `docs/Dokumentationsuebernahme-Demonstrator.md` | abgeschlossen / unter G2.5 erneut verifiziert |
| Architektur | noch anzulegen | offen – G5 |
| Datenmodell | `docs/Datenmodell.md` | abgeschlossen – G3 v3.0 |
| Sitzungs- und Beschlussmodell | `docs/Sitzungs-und-Beschlussmodell.md` | vorhanden / konsolidiert |
| Wirkungsmodell | `docs/Wirkungsmodell.md` | vorhanden / konsolidiert |
| Persistenz- und Lebenszyklusmodell | `docs/Persistenz-und-Lebenszyklusmodell.md` | vorhanden / konsolidiert |
| Deployment / Betrieb | noch anzulegen | offen – spätere Phase |
| Backup / Restore | noch anzulegen | offen – spätere Phase |
| Administration | noch anzulegen | offen – spätere Phase |
| Architekturentscheidungen | `docs/decisions/` | bei Bedarf |
| Arbeitsregeln für KI-/Entwicklungsarbeit | `AGENTS.md` | vorhanden |

## 6. Abgrenzung UX und visuelle Identität

`docs/UX-und-Informationsarchitektur.md` ist die Primärquelle für:

- Informationsarchitektur,
- Navigation und Funktionslogik,
- Seitenstruktur,
- responsive und barrierearme Bedienung.

`docs/Visuelle-Identitaet-und-Bildkonzept.md` ist die Primärquelle für:

- visuelle Grundhaltung,
- Logo und Bildmarke,
- Banner,
- Farbrollen,
- Bildsprache,
- PWA-Icon,
- Icon-Stil,
- konkrete gestalterische Anwendung der UX-Struktur.

Visuelle Mockups dürfen die fachliche UX-Struktur nicht eigenständig verändern.

## 7. Dokumentationshoheit gegenüber dem Demonstrator

> **Der Demonstrator ist historische, fachliche und visuelle Referenz. Die weitere fachliche, redaktionelle, UX-bezogene und technische Entwicklung von FIB wird ausschließlich im Repository `PustefixReisen/fib-echtsystem` dokumentiert.**

Daraus folgt:

- Demonstrator-Dokumente werden nicht mehr als laufende Primärdokumentation fortgeschrieben.
- Relevante Inhalte werden im Echtsystem übernommen, bereinigt und aktualisiert.
- Nach der Übernahme bleibt die Demonstrator-Fassung historischer Stand.
- Widersprüche werden zugunsten der kanonischen Echtsystem-Dokumentation aufgelöst.
- Bibliotheks-, ODT-, Export- oder sonstige Kopien sind keine gleichwertige Primärquelle. Ein neueres Dateidatum allein begründet keine Dokumentationshoheit.
- Frühere FIB-Chats dienen im G2.5-Audit als **Lückenfinder**, nicht als kanonische Wahrheit. Wiedergewonnene Erkenntnisse werden erst nach fachlicher Prüfung in eine kanonische Echtsystem-Quelle oder einen Regressionstest überführt.

Die detaillierte Zuordnung der ursprünglichen Dokumentationsübernahme steht in `docs/Dokumentationsuebernahme-Demonstrator.md`. Die abschließende Transferprüfung steht in `docs/Transfer-Audit-Demonstrator-Echtsystem.md`.

## 8. Stand der Übernahme

Die Dokumentationsübernahme ist nach erneuter G2.5-Prüfung **abgeschlossen**.

Der erneute Transfer-Audit wurde notwendig, weil sich gezeigt hatte, dass:

- einzelne Demonstrator-Regeln zwar dokumentiert waren, im Echtsystem aber nicht an der operativ zuständigen Stelle standen,
- eine Bibliotheks-/ODT-Fassung gegenüber dem kanonischen GitHub-Stand inhaltlich zurücklag,
- weitere Detailerkenntnisse nur in Betriebs-/Fehlerfällen oder früheren Chats auffindbar waren,
- ältere Begriffe nach späteren G3-Entscheidungen noch in einzelnen Echtsystem-Dokumenten fortwirkten.

Diese fachlichen Transferlücken wurden unter G2.5 geschlossen. Ins Echtsystem überführt bzw. nachgepflegt sind insbesondere:

- Management Approach,
- Fachkonzept,
- KI-Leitfaden,
- KI-Qualität und Modellunabhängigkeit,
- Quellenmonitor und Recherchelogik,
- Mehr-wissen-Konzept,
- Frontend-/Darstellungsregeln in der UX-Primärquelle,
- Marketing und Kommunikation,
- SEO und Auffindbarkeit,
- KI-Betrieb und Kosten,
- grüne Werte und politische Ziele,
- wissenschaftlich-politische und bürgernahe Sprachregeln,
- erweiterter Suchraum, Rückblickslogik und 30-%-Warnschwelle,
- Persistenzschutz,
- Quellenpflicht bei „Mehr wissen?“,
- aktuelle Bedeutung-für-das-Thema-Logik.

Die aus dem Audit verbliebenen technischen Folgeaufträge sind regulär in die späteren Gründungspakete übergeben und keine offenen Transferlücken mehr.

Das visuelle Identitäts- und Bildkonzept ist eine **neue G2-Primärquelle des Echtsystems** und keine übernommene Demonstrator-Dokumentation.

Das Begriffsregister `docs/Begriffe.md` ist eine **neue G3-Primärquelle** für die einheitliche Bedeutung und Abgrenzung zentraler FIB-Begriffe. Es wird grundsätzlich über das Stand-Datum fortgeschrieben; eine neue Versionsnummer ist nur bei strukturellen oder konzeptionellen Änderungen erforderlich.

## 9. G3-Abschluss

G3 ist mit `docs/G3-Gesamtaudit.md` v1.2 abgeschlossen.

Das zentrale `docs/Datenmodell.md` wurde auf v3.0 als konsolidierte Integrationsquelle fortgeschrieben. Die während G3 entstandenen spezialisierten Teilmodelle bleiben Primärquellen für ihre Detailregeln.

Es bestehen keine bekannten offenen fachlichen G3-Grundsatzfragen. G4 Schutzbedarf / Datenschutz / Offline ist gestartet.

## 10. G4-Start

G4 wird in `docs/Schutzbedarf-Datenschutz-und-Offline.md` geführt.

Die erste verbindliche Fassung legt eine vierstufige Schutzklassifikation K0–K3, eine Schutzbedarfsmatrix sowie Grundregeln für personenbezogene Daten, KI-Übermittlung, Offline/PWA, Bilder/Dateien und Audit fest. Die weitere G4-Konsolidierung konzentriert sich auf die tatsächlich benötigten K2-Daten, Provider-/KI-Zulässigkeit, rechtliche Pflichten, Aufbewahrung/Löschung und Push/Newsletter.

## 11. Pflegepflicht

Bei jeder verbindlichen fachlichen, technischen, architektonischen, Sicherheits-, Datenmodell-, Prozess- oder Designentscheidung wird geprüft:

1. welches Dokument die verbindliche Quelle ist,
2. welche anderen Dokumente betroffen sind,
3. ob Widersprüche oder veraltete Aussagen entstehen,
4. ob Roadmap und Issues angepasst werden müssen,
5. ob Dokumentstand und Änderungshistorie fortzuschreiben sind.

Bei vorhandenem GitHub-Zugriff erfolgt die Dokumentationspflege unmittelbar im Projekt.

## 12. Dokumentationsstruktur

Für dauerhaft gepflegte Dokumente gilt grundsätzlich:

1. Titel
2. Dokumentstand
3. Inhalt
4. Änderungshistorie als letzter inhaltlicher Abschnitt

Für laufend ergänzte Register oder Glossare kann statt einer fortlaufenden Versionsnummer primär ein Stand-Datum verwendet werden. Eine neue Versionsnummer ist dort nur bei strukturellen oder konzeptionellen Änderungen erforderlich.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 2.7 | 06.10.2026 | G4-Primärquelle `Schutzbedarf-Datenschutz-und-Offline.md` aufgenommen; G4-Start und Schutzklassifikation K0–K3 in der Dokumentationslandkarte verankert. |
| 2.6 | 05.10.2026 | G3-Abschluss synchronisiert: Datenmodell v3.0 als konsolidierte Integrationsquelle, G3-Gesamtaudit als abgeschlossen und G4 Schutzbedarf/Datenschutz/Offline als nächsten Gründungsschritt ausgewiesen. |
| 2.5 | 05.10.2026 | G3-Konsolidierung in der Dokumentationslandkarte nachgezogen: Beobachtungs-/Recherchemodell, Mehr-wissen-Modell, MVP-Fachfunktionen, KI-Zugangswege/Fachfunktionen, Plausibilitäts-/Freigaberegeln und G3-Gesamtaudit als kanonische Quellen aufgenommen; Status älterer G3-Teilmodelle konsolidiert und technische Folgephasen abgegrenzt. |
| 2.4 | 05.10.2026 | Dokumentation in sechs übergeordnete Themenbereiche gegliedert; spätere Abbildung dieser Gliederung in der GitHub-Ordnerstruktur nach fachlicher Konsolidierung festgelegt; neue G3-Primärquellen in die Landkarte aufgenommen. |
| 2.3 | 03.10.2026 | G2.5 nach bestandenem Transfer-Gate als abgeschlossen markiert; Dokumentationsübernahme erneut als abgeschlossen bestätigt; fachliche Nachpflege und Übergabe technischer Folgeaufträge dokumentiert. |
| 2.2 | 03.10.2026 | G2.5-Transfer-Audit in Dokumentationslandkarte aufgenommen; ursprünglichen Abschlussstatus der Demonstrator-Übernahme zurückgenommen; GitHub-Dokumentationshoheit gegenüber ODT/Exportkopien präzisiert; frühere Chats als Lückenfinder geregelt; Regressionstestkorpus als Projektquelle aufgenommen. |
| 2.1 | 02.10.2026 | `docs/Begriffe.md` als verbindliches Begriffsregister aufgenommen; Stand-Datum statt fortlaufender Versionsnummer für laufend ergänzte Register/Glossare zugelassen. |
| 2.0 | 01.10.2026 | `docs/Datenmodell.md` als G3-Primärquelle für fachliche Datenanforderungen und logisches Datenmodell aufgenommen. |
| 1.9 | 01.10.2026 | `docs/Migrationsstrategie.md` als Primärquelle für den späteren Übergang von Entwickler- auf GRÜNEN-Infrastruktur aufgenommen; G2-Dokumentstatus auf vorhanden konsolidiert. |
| 1.8 | 01.10.2026 | `docs/Visuelle-Identitaet-und-Bildkonzept.md` als eigene Primärquelle aufgenommen; Abgrenzung zu UX dokumentiert. |
| 1.7 | 30.09.2026 | Dokumentationsübernahme nach Querverweis-, Terminologie- und Konsistenzprüfung als abgeschlossen markiert; visuelles Konzept als neue G2-Entscheidung abgegrenzt. |
| 1.6 | 30.09.2026 | Frontendregeln in UX v2.5 integriert; Werte- und Sprachgrundlagen ins Echtsystem übernommen. |
| 1.5 | 30.09.2026 | Recherche, Mehr wissen, KI-Qualität, Marketing, SEO und KI-Betrieb übernommen; Übernahmematrix aufgenommen. |
| 1.4 | 30.09.2026 | Fachkonzept und KI-Leitfaden als kanonische Primärquellen aufgenommen. |
| 1.3 | 30.09.2026 | Management Approach als kanonische Echtsystem-Fassung aufgenommen. |
| 1.2 | 30.09.2026 | Dokumentationshoheit des Echtsystems festgelegt; Demonstrator als eingefrorene Referenz definiert. |
| 1.1 | 29.09.2026 | UX- und Informationsarchitektur als verbindliche Primärquelle aufgenommen. |
| 1.0 | 29.09.2026 | Initiale Dokumentationslandkarte angelegt. |