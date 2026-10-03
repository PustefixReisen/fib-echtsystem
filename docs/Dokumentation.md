# Dokumentationslandkarte – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.2 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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
| G2.5 Transfer-Audit | `docs/Transfer-Audit-Demonstrator-Echtsystem.md` | in Arbeit |
| Regressionstestkorpus | `docs/Regressionstests-Demonstratortransfer.md` | vorhanden / wird mit Umsetzung konkretisiert |
| Fachkonzept | `docs/Fachkonzept.md` | vorhanden |
| Begriffe / fachliches Glossar | `docs/Begriffe.md` | vorhanden |
| Management Approach | `docs/FIB_Management-Approach.md` | vorhanden |
| KI-Arbeitsregeln | `docs/KI-Leitfaden.md` | vorhanden |
| KI-Qualität / Modellunabhängigkeit | `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | vorhanden |
| Grüne Werte / politische Ziele | `docs/Gruene-Werte-und-politische-Ziele.md` | vorhanden |
| Sprachregeln | `docs/Sprachleitfaden.md` | vorhanden |
| Themen- und Vorgangslogik | `docs/Themen-und-Vorgangslogik.md` | vorhanden |
| Recherche / Suchraum / Quellenmonitor | `docs/Recherche-und-Quellenmonitor.md` | vorhanden |
| „Mehr wissen?“ | `docs/Mehr-wissen.md` | vorhanden |
| UX / Informationsarchitektur / Benutzerführung | `docs/UX-und-Informationsarchitektur.md` | vorhanden |
| Visuelle Identität / Logo / Bildsprache / UI-Stil | `docs/Visuelle-Identitaet-und-Bildkonzept.md` | vorhanden |
| Marketing / Kommunikation | `docs/Marketing-und-Kommunikation.md` | vorhanden |
| SEO / Auffindbarkeit | `docs/SEO-und-Auffindbarkeit.md` | vorhanden |
| KI-Betrieb / Kosten | `docs/KI-Betrieb-und-Kosten.md` | vorhanden |
| Migrationsstrategie Entwickler → GRÜNEN-Infrastruktur | `docs/Migrationsstrategie.md` | vorhanden |
| Übernahme Demonstrator-Dokumentation | `docs/Dokumentationsuebernahme-Demonstrator.md` | unter G2.5 erneut geprüft |
| Architektur | noch anzulegen | offen |
| Datenmodell | `docs/Datenmodell.md` | in Arbeit |
| Sicherheit / Datenschutz | noch anzulegen | offen |
| Deployment / Betrieb | noch anzulegen | offen |
| Backup / Restore | noch anzulegen | offen |
| Administration | noch anzulegen | offen |
| Architekturentscheidungen | `docs/decisions/` | bei Bedarf |
| Arbeitsregeln für KI-/Entwicklungsarbeit | `AGENTS.md` | vorhanden |

## 5. Abgrenzung UX und visuelle Identität

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

## 6. Dokumentationshoheit gegenüber dem Demonstrator

> **Der Demonstrator ist historische, fachliche und visuelle Referenz. Die weitere fachliche, redaktionelle, UX-bezogene und technische Entwicklung von FIB wird ausschließlich im Repository `PustefixReisen/fib-echtsystem` dokumentiert.**

Daraus folgt:

- Demonstrator-Dokumente werden nicht mehr als laufende Primärdokumentation fortgeschrieben.
- Relevante Inhalte werden im Echtsystem übernommen, bereinigt und aktualisiert.
- Nach der Übernahme bleibt die Demonstrator-Fassung historischer Stand.
- Widersprüche werden zugunsten der kanonischen Echtsystem-Dokumentation aufgelöst.
- Bibliotheks-, ODT-, Export- oder sonstige Kopien sind keine gleichwertige Primärquelle. Ein neueres Dateidatum allein begründet keine Dokumentationshoheit.
- Frühere FIB-Chats dienen im G2.5-Audit als **Lückenfinder**, nicht als kanonische Wahrheit. Wiedergewonnene Erkenntnisse werden erst nach fachlicher Prüfung in eine kanonische Echtsystem-Quelle oder einen Regressionstest überführt.

Die detaillierte Zuordnung der ursprünglichen Dokumentationsübernahme steht in `docs/Dokumentationsuebernahme-Demonstrator.md`. Die Vollständigkeits- und Transferprüfung wird unter G2.5 geführt.

## 7. Stand der Übernahme

Die ursprüngliche Dokumentationsübernahme ist **weitgehend erfolgt, aber durch G2.5 noch nicht endgültig abgeschlossen**.

Der erneute Transfer-Audit wurde notwendig, weil sich gezeigt hat, dass:

- einzelne Demonstrator-Regeln zwar dokumentiert waren, im Echtsystem aber nicht an der operativ zuständigen Stelle standen,
- eine Bibliotheks-/ODT-Fassung gegenüber dem kanonischen GitHub-Stand inhaltlich zurücklag,
- weitere Detailerkenntnisse nur in Betriebs-/Fehlerfällen oder früheren Chats auffindbar waren,
- ältere Begriffe nach späteren G3-Entscheidungen noch in einzelnen Echtsystem-Dokumenten fortwirkten.

Ins Echtsystem überführt bzw. integriert wurden insbesondere:

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

G2.5 prüft zusätzlich Demonstrator-Datenbestand, sichtbares Verhalten, Betriebs-/Update-/Fehlerprotokolle, Spezial-/Übergabedokumente sowie relevante frühere Chats.

Erst nach bestandenem Transfer-Gate wird der Gesamtstatus der Demonstrator-Übernahme wieder auf **abgeschlossen** gesetzt.

Das visuelle Identitäts- und Bildkonzept ist eine **neue G2-Primärquelle des Echtsystems** und keine übernommene Demonstrator-Dokumentation.

Das Begriffsregister `docs/Begriffe.md` ist eine **neue G3-Primärquelle** für die einheitliche Bedeutung und Abgrenzung zentraler FIB-Begriffe. Es wird grundsätzlich über das Stand-Datum fortgeschrieben; eine neue Versionsnummer ist nur bei strukturellen oder konzeptionellen Änderungen erforderlich.

## 8. Pflegepflicht

Bei jeder verbindlichen fachlichen, technischen, architektonischen, Sicherheits-, Datenmodell-, Prozess- oder Designentscheidung wird geprüft:

1. welches Dokument die verbindliche Quelle ist,
2. welche anderen Dokumente betroffen sind,
3. ob Widersprüche oder veraltete Aussagen entstehen,
4. ob Roadmap und Issues angepasst werden müssen,
5. ob Dokumentstand und Änderungshistorie fortzuschreiben sind.

Bei vorhandenem GitHub-Zugriff erfolgt die Dokumentationspflege unmittelbar im Projekt.

## 9. Dokumentationsstruktur

Für dauerhaft gepflegte Dokumente gilt grundsätzlich:

1. Titel
2. Dokumentstand
3. Inhalt
4. Änderungshistorie als letzter inhaltlicher Abschnitt

Für laufend ergänzte Register oder Glossare kann statt einer fortlaufenden Versionsnummer primär ein Stand-Datum verwendet werden. Eine neue Versionsnummer ist dort nur bei strukturellen oder konzeptionellen Änderungen erforderlich.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 2.2 | 03.10.2026 | G2.5-Transfer-Audit in Dokumentationslandkarte aufgenommen; ursprünglichen Abschlussstatus der Demonstrator-Übernahme zurückgenommen; GitHub-Dokumentationshoheit gegenüber ODT/Exportkopien präzisiert; frühere Chats als Lückenfinder geregelt; Regressionstestkorpus als Projektquelle aufgenommen. |
| 2.1 | 02.10.2026 | `docs/Begriffe.md` als verbindliches Begriffsregister aufgenommen; Stand-Datum statt fortlaufender Versionsnummer für laufend ergänzte Register/Glossare zugelassen. |
| 2.0 | 01.10.2026 | `docs/Datenmodell.md` als G3-Primärquelle für fachliche Datenanforderungen und logisches Datenmodell aufgenommen. |
| 1.9 | 01.10.2026 | `Migrationsstrategie.md` als Primärquelle für den späteren Übergang von Entwickler- auf GRÜNEN-Infrastruktur aufgenommen; G2-Dokumentstatus auf vorhanden konsolidiert. |
| 1.8 | 01.10.2026 | `Visuelle-Identitaet-und-Bildkonzept.md` als eigene Primärquelle aufgenommen; Abgrenzung zu UX dokumentiert. |
| 1.7 | 30.09.2026 | Dokumentationsübernahme nach Querverweis-, Terminologie- und Konsistenzprüfung als abgeschlossen markiert; visuelles Konzept als neue G2-Entscheidung abgegrenzt. |
| 1.6 | 30.09.2026 | Frontendregeln in UX v2.5 integriert; Werte- und Sprachgrundlagen ins Echtsystem übernommen. |
| 1.5 | 30.09.2026 | Recherche, Mehr wissen, KI-Qualität, Marketing, SEO und KI-Betrieb übernommen; Übernahmematrix aufgenommen. |
| 1.4 | 30.09.2026 | Fachkonzept und KI-Leitfaden als kanonische Primärquellen aufgenommen. |
| 1.3 | 30.09.2026 | Management Approach als kanonische Echtsystem-Fassung aufgenommen. |
| 1.2 | 30.09.2026 | Dokumentationshoheit des Echtsystems festgelegt; Demonstrator als eingefrorene Referenz definiert. |
| 1.1 | 29.09.2026 | UX- und Informationsarchitektur als verbindliche Primärquelle aufgenommen. |
| 1.0 | 29.09.2026 | Initiale Dokumentationslandkarte angelegt. |
