# Dokumentation früh und laufend – verbindlicher FIB-Grundsatz

Stand: 15.10.2026, bestätigt durch die Projektleitung.

**Wesentliche fachliche Festlegungen, Architekturentscheidungen, Sicherheitsgrenzen, UI-Standards und operative Änderungen werden so früh wie möglich dokumentiert – idealerweise im selben Arbeitsblock wie die Entscheidung und immer vor dem Abschluss der dazugehörigen Implementierung.**

- Die GitHub-Projektdokumentation ist die dauerhafte maßgebliche Quelle, nicht die Chat-Historie.
- Vor der Umsetzung bestehende Regelwerke prüfen; neue Entscheidungen und Auswirkungen unmittelbar einarbeiten, einschließlich Begriffsdefinition, Konsequenzen, Versions-/Datumsstand und offene Punkte.
- Jeder PR mit fachlicher oder technischer Bedeutung enthält die erforderliche Dokumentationsänderung oder einen begründeten Verweis auf gültige Regelwerke.
- Klare Unterscheidung zwischen **vereinbart**, **implementiert**, **getestet** und **produktiv nachgewiesen**.
- Dokumente für Plattform und Projekt getrennt pflegen und Änderungen über GitHub nachvollziehbar halten. Frühere Regeln nicht stillschweigend überschreiben.
- Für FIB werden Benutzerfreundlichkeit, mobile Standards, redaktionelle Prüfbarkeit, KI-Austauschbarkeit und die strikte Trennung von Entwicklungs-, Referenz- und Echtdaten besonders beachtet.

## Vereinbarte mobile Kartenregeln (15.10.2026)

- Kartenüberschrift bleibt stabil; der aktive Bearbeitungsmodus wird kompakt markiert.
- Kurze Hilfetexte direkt im Kartenkopf **nur bei Bedarf**; längere Hilfen ausschließlich kontextbezogen am jeweiligen Control. Kein dauerhaft langer Anleitungstext.
- Nur der wichtigste Status im Kartenkopf: Speicherfehler vor Pflichtfeldfehler, fehlende Pflichtfelder vor ungespeicherten Änderungen; unvollständige Pflichtangaben mit kleinem Warndreieck, möglichst ohne zusätzliche Zeile.
- Pflichtfelder direkt kennzeichnen, ungültige Pflichtangaben lokal erläutern. Backend muss fachlich verbindliche Pflichtangaben durchsetzen.
- Fundstellenzuordnungen sollen künftig nur mit einer Begründung gespeichert werden; vorhandene Vorgängerbegründung übernehmen und sichtbar machen. **Backend-Validierung hierfür ist noch umzusetzen.**
- Filter zurücksetzen als zugänglich beschriftetes Icon, nur wenn ein Filter aktiv ist.
- Navigationsstruktur für geplante Ausbaustufe erhalten; auf kleinen Bildschirmen Menü schließbar und unabhängig scrollbar.
- Technische Importkennungen nicht prominent als redaktionelle Inhalte darstellen; Importprovenienz erhalten.
- Formularmodus („Speichern/Abbrechen“) und Direktbearbeitung mit unmittelbarer Speicherung weiterhin unterscheiden.
- Mobile Verbesserungen müssen Desktop-Verhalten und Schutzmechanismen bewahren.

Umsetzung erfolgt schrittweise in gesonderten PRs; diese Regeln allein gelten nicht als abgeschlossene Implementierung.

## Umsetzungsschritt: mobile Navigation und Ereignisfilter (15.10.2026)

- Die Navigationsleiste bleibt vollständig (auch geplante Funktionen); mobil erhält sie einen eindeutig benannten Schließen-Button, lässt sich weiterhin durch Tippen auf den Hintergrund schließen und scrollt unabhängig vom Hauptinhalt.
- Der Ereignisfilter verwendet die kompakte Beschriftung „Titel oder Beschreibung“; ein durchgestrichenes Filtersymbol erscheint **nur** bei aktivem Filter und hat `aria-label` und Tooltip zum Zurücksetzen. Die bestehende Live-Filterlogik wird beibehalten.
- Die allgemeine Suchfunktion bleibt erhalten, auch wenn sie noch nicht implementiert ist.
- Dies ist ein weiteres UI-Inkrement; Pflichtbegründung bei Fundstellen und übrige mobile Verbesserungen bleiben gesonderte offene Implementierungen.

## Pflichtbegründung beim Zuordnen (Implementierungsstand 15.10.2026)

Die neue Ereignis-Fundstellen-Beziehung darf nur gemeinsam mit einer nicht leeren, auf maximal 2.000 Zeichen begrenzten redaktionellen Begründung gespeichert werden. Eine für dieselbe Beziehung zuvor gespeicherte Begründung wird als editierbarer Vorgängerwert vorgeschlagen; andernfalls ist ein Pflichtfeld mit kontextbezogenem Hinweis sichtbar. Der Button „Zuordnen“ wird erst bei gültigem Feld freigeschaltet. Die Edge Function validiert dieselbe Pflicht serverseitig und protokolliert die Begründung. Beim Bearbeiten vorhandener Zuordnungen kann die Begründung nicht vollständig entfernt werden. Bestehende Entwicklungsbeziehungen ohne Begründung bleiben zunächst erhalten, müssen aber bei Bearbeitung nachbegründet werden; keine automatische Umschreibung der Altbestände.

**Abgrenzung:** Eine formale Datenbank-`NOT NULL`-Umstellung ist wegen vorhandener Testdatensätze nicht Teil dieses Schritts. Die Prüfung gilt für die FIB-Schreib-API. Künftige alternative Schreibwege müssen die Fachregel ebenfalls durchsetzen.

## Umsetzungsschritt: kompakter Ereigniskopf (15.10.2026)

In Ereignisliste, Ereignisüberschrift und lesender Titelanzeige wird das technische Präfix `[ENTWICKLUNG ...]` ausgeblendet; der zugrunde liegende Titel in der Datenbank bleibt unverändert. In der Kopf-Zusammenfassung werden vorhandene technische Importvorspänne ausschließlich für die Anzeige ausgeblendet. Die bisherige Platzhalterkachel „Nächster Schritt: Bearbeitung im Ereignis fortsetzen“ entfällt zugunsten des unmittelbaren Karteninhalts; der tatsächliche Ereignisstatus bleibt sichtbar. Auf mobilen Bildschirmen reduziert der Kartenkopf Abstände und die Statuskachel ihre Höhe. Dies ist keine Migration oder Löschung von Entwicklungsdaten.

## Weiterer UI-Inkrement: Pflichtfeldstatus beim Bearbeiten einer Zuordnung (17.10.2026)

Auch die bereits bestehende Fundstellenbegründung wird beim Bearbeiten lokal mit `*`, Inline-Hinweis und `aria-invalid` validiert. Im Kopf der Quellenkarte erscheint nach Prioritätsregel bei fehlender Begründung „⚠ Pflichteingaben unvollständig“, andernfalls bei verändertem Inhalt „Ungespeicherte Änderungen“ bzw. „Unverändert“. Speichern bleibt bei leerem Feld deaktiviert. Serverseitige Pflichtprüfung aus PR #112 bleibt unverändert.
