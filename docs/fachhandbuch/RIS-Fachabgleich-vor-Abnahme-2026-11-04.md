# RIS – Konsolidierter Fachabgleich vor Nutzerabnahme (04.11.2026)

> **Status: Entwurf zur Prüfung, nicht fachlich endabgenommen.** Dieser Abgleich sammelt die jüngsten, ausdrücklich bestätigten Entscheidungen. Die persönliche RIS-Fachabnahme ist für **Sonntag, 08.11.2026** vorgesehen. Der Entwurf ändert keine produktiven Daten, Berechtigungen oder Funktionen und ersetzt bis zur Abnahme keine gültigen Fachhandbuchkapitel.

## 1. Fachliche Struktur und Belege

- Gremium → Sitzung → Tagesordnungspunkt (TOP) → Vorlage/Dokument, Beschlussvorschlag, tatsächlicher Beschluss, Niederschrift und Anlagen fachlich unterscheiden.
- Eine Vorlage oder ein Beschlussvorschlag ist **kein** bestätigter Beschluss. Beschlussstatus, Wortlaut und Abstimmungsergebnisse dürfen ausschließlich geeignete amtliche RIS-Belege bestätigen.
- RIS-Dokumente werden als einzeln identifizierbare Fundstellen mit Herkunft und Beziehungen geführt; Dokument-Fundstelle, Ereignis und TOP sind unterschiedliche Fachobjekte. Ein Ereignis kann mehrere Fundstellen haben; ein TOP hat höchstens ein Hauptereignis im vereinbarten Modell.
- Vorlagen und Anlagen können beim **bewussten Festlegen** des TOP-Hauptereignisses transaktional und ohne zweiten Bestätigungsdialog als dessen Fundstellen verbunden werden. Wiederholungen dürfen keine Dubletten erzeugen. Keine automatische Meldung/Beschlussbestätigung.

Quellen: [#377](https://github.com/PustefixReisen/fib-echtsystem/issues/377), [#383](https://github.com/PustefixReisen/fib-echtsystem/issues/383), [#387](https://github.com/PustefixReisen/fib-echtsystem/issues/387).

## 2. Sitzungsereignisse, TOP-Hauptereignisse und weitere Ereignisse

- **Sitzungsereignisse** werden in der Karte „Ereignisse zur Sitzung“ unterhalb der Tagesordnung dargestellt; ihre Zuordnung bezieht sich auf die gesamte Sitzung.
- Externe Presseberichte über Gemeinderatssitzungen sind **nur der Sitzung insgesamt** zugeordnet, niemals einzelnen TOPs oder Beschlusspunkten. Presse ist kein amtlicher Beschluss- oder Abstimmungsnachweis.
- Eine **automatische** Zuordnung von Ereignissen zur Sitzung ist **nicht freigegeben**. Vor einer Umsetzung sind Kriterien, Belege, Fehlerraten und redaktionelle Korrekturwege gesondert zu entscheiden ([#385](https://github.com/PustefixReisen/fib-echtsystem/issues/385)).
- Die Wahl eines TOP-Hauptereignisses akzeptiert nur Ereignisse mit einem fachlich passenden RIS-Fundstellenbezug **zur aktuellen Sitzung**. Bei Ereignis-Neuanlage oder -Bearbeitung aus diesem Kontext bleibt die Sitzung erhalten; Rückkehr zum selben TOP.
- „Weitere Ereignisse zuordnen“ darf **keine** Sitzungsereignisse, TOP-Hauptereignisse, RIS-Ereignisse derselben Sitzung oder bloße Demo-/Testsitzungstagsfälle ohne unabhängigen Quellenbeleg anbieten. Es sollen nur eigenständige, fachlich passende **externe** Ereignisse zur Auswahl stehen. Keine automatische Neuanlage als Nebenwirkung und keine stille Datenlöschung.
- Fundstellensuche innerhalb der sitzungsbezogenen Ereignisbearbeitung wird serverseitig auf die RIS-Fundstellen **dieser** Sitzung eingeschränkt; fehlender Scoping-Nachweis führt zu keiner unbeschränkten Auswahl.

Quellen: [#383](https://github.com/PustefixReisen/fib-echtsystem/issues/383), [#385](https://github.com/PustefixReisen/fib-echtsystem/issues/385), [#387](https://github.com/PustefixReisen/fib-echtsystem/issues/387).

## 3. Darstellung und Bedienung

- Die RIS-Sitzung bietet eine Sitzungsübersicht und TOP-Navigation als Tabs; auch umfangreiche Tagesordnungen müssen mobil bedienbar sein. Navigation, Kontext und Rückweg dürfen keine falschen Bereiche öffnen.
- Externe RIS-Dokumente: erkennbares Link-Icon **unmittelbar vor** dem nicht als Link gestalteten Dokumenttitel. Nur die **Dokumentart** ist hervorgehoben; Datum, Nummer und Titel bleiben normal lesbar.
- Redundante Navigation „Fundstelle öffnen“ im TOP-Kontext beziehungsweise im hier beanstandeten Ereignisformular entfällt; vorhandene fachliche Bearbeitungswege bleiben erhalten.
- Fachliche Textinhalte müssen auswähl- und kopierbar bleiben. Aktionen (z. B. Speichern, Bearbeiten, Verbindung entfernen) sind von Navigation zu unterscheiden. „Entfernen“ einer Verbindung löscht nicht das Fachobjekt.
- Einheitliche Live-Suche **systemweit**: Filteraktualisierung nach jeder Eingabe, bei serverseitiger Abfrage kurzes Debounce und Ignorieren veralteter Antworten; angezeigte relevante Felder durchsuchen. Bei Ereignissen **Titel, Datum und Kurzbeschreibung**; kompakte Trefferliste nur mit diesen Kerninformationen, ohne Importmarker oder technische Metadaten. Filter löschen und verständlicher Leerzustand.
- Allgemeine Bedienkonventionen gelten auch außerhalb RIS; technische Umsetzung außerhalb der RIS-Auswahl bleibt Gegenstand von [#391](https://github.com/PustefixReisen/fib-echtsystem/issues/391).

Quellen: [#379](https://github.com/PustefixReisen/fib-echtsystem/issues/379), [#383](https://github.com/PustefixReisen/fib-echtsystem/issues/383), [#387](https://github.com/PustefixReisen/fib-echtsystem/issues/387), [#391](https://github.com/PustefixReisen/fib-echtsystem/issues/391).

## 4. RIS-Originale, Volltexte und Rechte

- **Aktuelle Entscheidung vom 03.11.2026 hat Vorrang vor älteren UI-Entwürfen:** vorerst **keine eigene Speicherung** von RIS-Original-PDFs und extrahierten Volltexten, **kein interner PDF-Viewer und keine Versionsanzeige** in der Redaktion; stattdessen externe RIS-Links.
- Herkunft und redaktionelle Nutzung beziehungsweise Veröffentlichungs-/Speicherrechte sind getrennt zu behandeln. RIS-Erreichbarkeit bedeutet nicht automatisch eine Erlaubnis zur eigenen dauerhaften Speicherung.
- Das Datenmodell und vorhandene technische Vorarbeit nicht ohne Not abbauen. Eine spätere Neubewertung der eigenen Speicherung erfolgt nach vorzeigbarer RIS-App und tatsächlicher Bedarfsprüfung; ggf. danach Gemeinde kontaktieren. Keine Rechtsfreigabe fingieren.

Quellen: [#379](https://github.com/PustefixReisen/fib-echtsystem/issues/379), [#380](https://github.com/PustefixReisen/fib-echtsystem/issues/380), [#267](https://github.com/PustefixReisen/fib-echtsystem/issues/267).

## 5. Stand und Prüfprogramm für Sonntag, 08.11.2026

**Nicht als erledigt oder live abgenommen markieren, nur weil ein PR gemergt oder CI erfolgreich war.**

1. Sitzung 29.10.2026, TOP 2/3 im mobilen Browser prüfen: Tagesordnung, Tabs, Dokumenttitel, Originalverweise, Rücknavigation.
2. Hauptereignis wählen/anlegen: passende RIS-Fundstellen derselben Sitzung, korrekte Zuordnung von Vorlage und Anlagen, keine Doppelbestätigung, keine Dubletten.
3. „Weitere Ereignisse zuordnen“: keine Sitzungs-/Hauptereignisse und keine ungeeigneten Testfälle; externe Ereignisse mit eigenständigem Quellenbeleg möglich.
4. Live-Suche: pro Eingabe filtern; Titel, Datum und Kurzbeschreibung; kompakte Ergebnisliste, Löschfunktion und Leerzustand. Systemweite Übertragung gesondert überprüfen ([#391](https://github.com/PustefixReisen/fib-echtsystem/issues/391)).
5. Navigation: keine überflüssige „Fundstelle öffnen“-Aktion; Bearbeiten und Zurück funktionieren ohne Kontextverlust.
6. PDF/Volltext: keine eigenen Viewer-/Versionsaktionen anbieten; externen RIS-Zugriff prüfen.
7. Nach Sichtabnahme: Befunde protokollieren, kanonische Fachhandbuchstellen und UI-Konventionen auf den bestätigten Stand konsolidieren. Erst dann Issues fachlich schließen.

**Technische Momentaufnahme laut [#387](https://github.com/PustefixReisen/fib-echtsystem/issues/387):** PR #390 in main, Backend `fib-editorial-write` v20 aktiv; Frontend-Deploy und persönliche Sichtprüfung für diese Korrektur waren zuletzt noch offen. Der Status ist vor Sonntag erneut zu verifizieren.

## 6. Abgrenzung zur folgenden Roadmap-Arbeit

- Zunächst RIS-Fachabnahme abschließen, danach überholte Release-Gates und manuelle Bereitstellungsschritte risikogerecht vereinfachen ([#375](https://github.com/PustefixReisen/fib-echtsystem/issues/375)).
- Vor größeren neuen Datenbankänderungen isolierte Entwicklungs-/Test- und Migrationsprüfung sowie reproduzierbare Bereitstellung festlegen; kein zusätzliches gehostetes Supabase-Projekt voraussetzen.
- Anschließend Informationsgewinnung mit den dokumentierten Demonstrator-Lücken, Blindtests und Quellenmonitor priorisieren ([#265](https://github.com/PustefixReisen/fib-echtsystem/issues/265), [#281](https://github.com/PustefixReisen/fib-echtsystem/issues/281)).
- Dies ist **noch keine Umsetzung der Roadmap** und keine Freigabe für Echtsystem-Migrationen.
