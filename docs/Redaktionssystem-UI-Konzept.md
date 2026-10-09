# Redaktionssystem – UI- und Dashboard-Konzept

## Dokumentstand

| Version | Stand | Status |
|---|---|---|
| 0.1 | 08.10.2026 | abgestimmter Konzeptstand |

## 1. Zweck

Dieses Dokument beschreibt die grundlegende Informationsarchitektur und Bedienlogik des **FIB-Redaktionssystems**. Es ergänzt die öffentliche UX in `docs/UX-und-Informationsarchitektur.md`.

Begriffe:

- **Redaktionssystem** = interne Arbeitsoberfläche für Redaktion und Administration.
- **Besuchersystem** = öffentliche FIB-Oberfläche für Bürgerinnen und Bürger.

Grundsatz:

> Das Redaktionssystem zeigt nicht das Datenmodell, sondern konkrete Arbeitsgegenstände, Entscheidungen und den jeweils nächsten sinnvollen Schritt.

## 2. Rollen und gemeinsames System

Es gibt keine getrennte Admin-Anwendung.

Redaktion und Administration arbeiten in **einer gemeinsamen Anwendung**. Der Admin erhält zusätzliche Bereiche und Rechte.

MVP-Rollen:

- Redakteur
- Admin

Die Oberfläche ist rollenabhängig. Admin-Funktionen werden nur dort sichtbar, wo sie benötigt werden.

## 3. Hauptnavigation

Verbindliche Grundstruktur:

- Dashboard
- Arbeitskorb
- Inhalte
  - Meldungen
  - Vorgänge
  - Themen
  - Sitzungen
- Recherche
  - Funde
  - Quellen
  - Beobachtungsaufträge
- Veröffentlichung
  - Freigaben
  - Medien & Dateien
  - Kommunikation
  - Besucherführung
- Auswertung
  - Besucher & Wirkung
  - Inhalte
  - Recherche
  - Redaktion
- FIB-Assistent
- Administration
  - Tasks & Läufe
  - KI & Kosten
  - Referenzsystem
  - Benutzer & Rollen
  - System
  - Audit

## 4. Icon-Regeln

Gleiche fachliche Objekte verwenden im Redaktionssystem und Besuchersystem dasselbe Grundsymbol.

Aktuell verbindlich:

- Meldung / öffentlich „Neues“ = aufgeschlagene Zeitung
- Vorgang = Zeitung mit kleiner Uhr
- Thema = Knoten-/Netzwerkstruktur
- Sitzungen = bestehendes freigegebenes Sitzungs-Icon
- Suche = bestehendes Lupen-Icon
- FIB-Assistent = Sprechblase mit „KI“
- keine generellen Blatt-Zusätze an Redaktions-Icons

Die Produktionsassets liegen unter `assets/brand/icons/`.

## 5. Dashboard-Ziel

Das Dashboard beantwortet beim Öffnen in wenigen Sekunden:

1. Was ist neu?
2. Was muss ich als Nächstes tun?
3. Was wartet auf Freigabe?
4. Gibt es einen relevanten System- oder Recherchehinweis?

Es ist **kein Statistik-Dashboard** und kein technisches Monitoring.

## 6. Dashboard-Struktur

### 6.1 Kopfbereich

Enthält:

- FIB-Logo
- Kennzeichnung „Redaktionssystem“
- globale interne Suche
- Benutzer und Rolle

Die Suche ist ausdrücklich als **„In FIB suchen …“** gekennzeichnet.

Sie durchsucht den internen FIB-Bestand, insbesondere:

- Meldungen
- Vorgänge
- Themen
- Sitzungen und TOPs
- Funde
- Quellen
- Beobachtungsaufträge
- geeignete offene Fragen und Vertiefungsinhalte

Externe Web- oder Quellenrecherche ist **nicht** Bestandteil dieser Suche. Sie wird über Recherche oder den FIB-Assistenten gestartet.

### 6.2 Statuskarten

Vier kompakte Statuskarten:

- Neue Funde
- Meine Aufgaben
- Freigaben
- Systemhinweise

Die Karten zeigen nur handlungsrelevante Mengen und Zustände.

### 6.3 „Als Nächstes bearbeiten“

Dieser Bereich ist der **zentrale Hauptbereich des Dashboards**.

Er zeigt nicht primär Objekte, sondern konkrete nächste Entscheidungen bzw. Arbeitsschritte, zum Beispiel:

- Fund prüfen
- Relevanz bewerten
- Zuordnung zu Vorgang/Thema bestätigen
- Plausibilitätskonflikt klären
- Meldungsentwurf bearbeiten
- Medienrechte prüfen
- Meldung freigeben

Sortierung nach redaktioneller Priorität und Handlungsbedarf.

### 6.4 Neue Funde

Neue Funde bleiben sichtbar, sind aber gegenüber dem Arbeitsbereich nachgeordnet.

Angezeigt werden insbesondere:

- Quelle
- Kurzbeschreibung
- KI-Relevanzvorschlag
- vorgeschlagener nächster Schritt

Ein Fund wird dann im Hauptarbeitsbereich priorisiert, wenn daraus eine konkrete redaktionelle Entscheidung entsteht.

### 6.5 Freigaben

Zeigt Inhalte mit anstehender S2-/S3-Entscheidung.

Wesentlich sind:

- betroffener Inhalt
- relevante Änderung / Diff
- fachlicher Status
- klarer Freigabeschritt

Veröffentlichungen benötigen eine bewusste redaktionelle Bestätigung.

### 6.6 FIB-Assistent

Der FIB-Assistent bleibt auf dem Dashboard sichtbar und schnell erreichbar, verdrängt aber nicht den Hauptarbeitsbereich.

Einstieg:

> Was möchtest du klären?

Typische Fragen:

- Warum wurde hierfür keine Meldung erzeugt?
- Ist dieser Fund bereits berücksichtigt?
- Gehört das zu einem vorhandenen Vorgang?
- Fehlt eine Quelle oder eine frühere Meldung?
- Ist das ein neues Ereignis oder eine Aktualisierung?

Grundregel:

> Frage → KI analysiert und erklärt → KI schlägt Handlung vor → Redaktion bestätigt → reguläre Fachfunktion führt die Änderung aus.

Keine stillen fachlichen Schreiboperationen.

### 6.7 Recherche-Status

Für Redakteure wird der technische Begriff „automatische Läufe“ im Dashboard nicht in den Vordergrund gestellt.

Stattdessen wird ein kompakter **Recherche-Status** angezeigt.

Nur handlungsrelevante Informationen erscheinen, z. B.:

- neue relevante Ergebnisse
- Pflichtquelle nicht erreichbar
- Beobachtungsauftrag mit Auffälligkeit
- Recherche wartet auf Prüfung

Technische Laufdetails bleiben im Admin-Bereich **Tasks & Läufe**.

### 6.8 Zuletzt verändert

Ermöglicht den schnellen Wiedereinstieg in zuletzt bearbeitete:

- Meldungen
- Vorgänge
- Themen
- Sitzungen

### 6.9 Systemhinweise

Nur tatsächlicher Handlungsbedarf wird auf dem Dashboard gezeigt, z. B.:

- Pflichtquelle ausgefallen
- Veröffentlichung blockiert
- Authentifizierungs-/Berechtigungsproblem
- fachlich relevante Verarbeitung fehlgeschlagen

Normale technische Protokolle und erfolgreiche Hintergrundläufe werden hier nicht angezeigt.

## 7. Informationshierarchie des Dashboards

Verbindliche Reihenfolge der Aufmerksamkeit:

> **1. Handeln → 2. Neues erkennen → 3. Freigeben → 4. Klären → 5. Systemzustand beobachten**

Daraus folgt:

- „Als Nächstes bearbeiten“ ist visuell am stärksten.
- Neue Funde unterstützen die Orientierung, dominieren aber nicht.
- Freigaben sind klar sichtbar.
- FIB-Assistent ist präsent, aber kein Ersatz für den strukturierten Workflow.
- System- und Recherchehinweise bleiben kompakt.

## 8. Arbeitskorb

Der Arbeitskorb bündelt offene oder zurückgestellte Fälle, die eine menschliche Entscheidung benötigen.

Er ist **kein verpflichtender Zwischenstopp für jede redaktionelle Handlung**. Wenn die Redaktion bereits in einem Objekt arbeitet und der nächste sinnvolle Schritt dort direkt erledigt werden kann, erfolgt die Bearbeitung unmittelbar im aktuellen Kontext.

Ein Fall gelangt insbesondere dann in den Arbeitskorb, wenn:

- die Bearbeitung bewusst auf später verschoben wird,
- die Redaktion den aktuellen Bearbeitungskontext verlässt, bevor der nächste Schritt erledigt ist,
- eine neue Entscheidung außerhalb des aktuell geöffneten Objekts entsteht,
- ein automatischer Prozess oder eine Recherche einen neuen Prüfbedarf erzeugt.

Grundsatz:

> Aktuellen Schritt direkt im Objekt bearbeiten, wenn möglich. Nur offene oder zurückgestellte Entscheidungen in den Arbeitskorb übernehmen.

Er wird nach **Entscheidungsart**, nicht nach technischen Objekttypen strukturiert.

Beispiele:

- neue Funde
- Ereignisse prüfen
- Zuordnungen prüfen
- Plausibilitätskonflikte
- Meldungsentwürfe
- freigabebereite Inhalte
- offene Medienrechte

Jeder Eintrag zeigt:

- worum es geht
- warum eine Entscheidung nötig ist
- KI-Vorschlag
- kurze Begründung
- nächsten möglichen Schritt

## 9. Navigationsprinzip für Fachobjekte

Für alle bearbeitbaren Fachobjekte gilt grundsätzlich:

> **Bereich → Liste/Auswahl → Detail-/Bearbeitungsansicht**

Beispiele:

- Meldungen → Meldungsliste → Meldungsdetail
- Vorgänge → Vorgangsliste → Vorgangsdetail
- Themen → Themenliste → Themendetail
- Sitzungen → Sitzungsliste → Sitzungsdetail
- Funde → Fundliste → Fundprüfung
- Quellen → Quellenliste → Quellendetail
- Beobachtungsaufträge → Liste → Auftragsdetail
- Freigaben → Freigabeliste → konkrete Freigabe
- Medien & Dateien → Medienliste → Mediendetail
- Tasks & Läufe → Taskliste → Task-/Laufdetail

Direkteinstiege in eine Detailansicht sind ausdrücklich erlaubt, zum Beispiel aus Dashboard, Arbeitskorb, Suche, FIB-Assistent oder über Querverweise.

Damit trotz Direkteinstieg jederzeit erkennbar bleibt, **wo sich die Redaktion befindet**, verwendet jede Detail- und Bearbeitungsansicht eine Breadcrumb-Navigation, zum Beispiel:

> Inhalte › Vorgänge › Ausbau BAB Kreuz München Ost

Die Breadcrumbs dienen sowohl der Orientierung als auch dem direkten Rücksprung auf übergeordnete Ebenen. Zusätzlich soll der Rückweg zur jeweiligen Listen-/Auswahlansicht klar erreichbar bleiben.

## 10. Objektkopf: Zustand/Status und nächste Schritte trennen

Der Objektkopf zeigt den Redakteuren auf einen Blick sowohl den **aktuellen Zustand bzw. Status** eines Objekts als auch den **nächsten redaktionellen Schritt**. Diese beiden Informationen werden visuell und begrifflich getrennt dargestellt.

Grundregel:

> **Zustand/Status beschreibt, was das Objekt derzeit ist. Nächster Schritt beschreibt, was als Nächstes damit getan werden soll.**

Beispiele:

- Thema: **Zustand: Weiterverfolgen** · **Nächster Schritt: Themenprüfung durchführen**
- Meldung: **Status: Fachlich geprüft** · **Nächster Schritt: Veröffentlichung vorbereiten**
- Vorgang: **Zustand: laufender Sachverhalt** · **Nächster Schritt: neue Auswirkung prüfen**

Die Trennung soll auch im Kopfbereich sichtbar sein, zum Beispiel in zwei getrennten Feldern oder Gruppen:

- **Zustand / Status**
- **Nächster Schritt**

Ein nächster Schritt kann direkt im aktuellen Objekt bearbeitet werden. Erst wenn er zurückgestellt oder außerhalb des aktuellen Kontexts weiterbearbeitet werden soll, entsteht daraus ein Eintrag im Arbeitskorb.

Bei Themen werden Zustand und Pflegeentscheidung zusätzlich sauber unterschieden:

- dauerhafte Zustände: **Weiterverfolgen**, **Archiviert**
- mögliche nächste Schritte bzw. Prüfentscheidungen: **Ausschärfen**, **Zusammenführen**, **Themenprüfung durchführen**

Listenansichten dürfen sowohl nach Zuständen/Status als auch nach offenem Handlungsbedarf filtern.

## 11. Objektlisten

Jeder bearbeitbare Objekttyp besitzt eine Listen-/Auswahlansicht. Diese dient nicht nur der Navigation, sondern auch der gezielten Auswahl und Pflege des jeweiligen Objektbestands.

Für Objektlisten gelten folgende UI-Regeln:

- **Zustand/Status und To do** werden je Eintrag kompakt und unmittelbar zusammen dargestellt, damit der Unterschied sichtbar bleibt, ohne die Liste unnötig zu verbreitern. In Listen wird der nächste Arbeitsschritt mit dem kurzen Label **„To-do:“** gekennzeichnet.
- Datumsangaben erhalten immer ein sichtbares Label. Wenn zwei Angaben in einer Zeile inhaltlich getrennt werden, wird als Standard das **Mittelpunkt-Zeichen „·“** verwendet, z. B. **„Geändert: 08.10.2026 · Nächste Prüfung: 15.01.2027“**. Das Pipe-Zeichen „|“ wird in der normalen Oberfläche nicht als Trenner verwendet.
- Unbeschriftete Navigationszeichen wie **„>“** werden vermieden. Stattdessen ist der Eintrag selbst klar anklickbar oder erhält bei Bedarf eine eindeutige Aktion **„Öffnen“**.
- Neben Filtern besitzt jede Objektliste eine **auf diese Liste beschränkte Suche**. Sie durchsucht nur die aktuell angezeigte Objektart und ist von der globalen Suche **„In FIB suchen …“** zu unterscheiden.
- Aktionen zum Anlegen eines neuen Objekts werden systemweit nach dem Muster **„Neue/Neuer/Neues <Objekt>“** beschriftet, z. B. **„Neues Thema“**, **„Neue Meldung“**, **„Neuer Vorgang“**. Dies ist kürzer und über alle Bereiche konsistent.

## 12. UI-Statusbegriffe

Technische Workflowstufen wie S0–S3 bleiben Teil des internen Regelwerks, der Fachlogik und des Audits. In der normalen Redaktionsoberfläche werden stattdessen verständliche Klartextbegriffe verwendet.

Beispiele:

- Entwurf
- Fachlich geprüft
- Zur Veröffentlichung bereit
- Veröffentlicht
- Veröffentlichung blockiert

Technische Statuscodes werden nur dort gezeigt, wo sie für Administration, Audit oder technische Diagnose erforderlich sind.

## 13. Status- und Farblogik

Farben unterstützen die Bedeutung, sind aber nie alleiniger Informationsträger.

- Blau = neutral / in Arbeit / Information
- Grün = erfolgreich / vollständig / betriebsbereit
- Gelb/Orange = Aufmerksamkeit / Prüfung nötig
- Rot = Fehler / blockierend / kritisch
- Grau = inaktiv / pausiert / nachgeordnet

Jeder Status verwendet zusätzlich Icon und Text.

Fachlicher Status und technischer Status werden nicht vermischt.

## 14. Nicht Teil des Dashboards

Nicht vorgesehen:

- umfangreiche Besucherstatistik
- vollständige Task-Run-Logs
- KI-Kosten-Detailansicht
- technische Fehlermeldungslisten
- große Schnellstart-Sammlung mit vielen Aktionsbuttons

Diese Inhalte gehören in die jeweiligen Fach- oder Admin-Bereiche.

## 15. Recherche – Fundliste und Schnellentscheidungen

Die Fundliste bleibt bewusst schlank. Die obere Auswahl trennt die Recherche-Objekttypen:

- **Funde (Anzahl)**
- **Quellen (Anzahl)**
- **Beobachtungsaufträge (Anzahl)**

Darunter folgen jeweils nur die für die gewählte Liste passenden lokalen Filter und die lokale Suche.

Für **Funde** gilt:

- einfache, offensichtliche Entscheidungen dürfen direkt in der Liste getroffen werden, insbesondere **„Nicht relevant“** und **„Zurückstellen“**;
- komplexere fachliche Entscheidungen erfolgen in der Funddetailansicht;
- bei direkten Entscheidungen kann eine **kurze Begründung** erfasst werden;
- das System bietet dafür **Begründungsschablonen** an, die der Redakteur übernehmen, anpassen oder ergänzen kann;
- Beispiele für Schablonen: **„Kein erkennbarer Feldkirchen-Bezug“**, **„Bereits vollständig durch bestehenden Vorgang abgedeckt“**, **„Nur Wiederholung ohne neuen Sachstand“**;
- die Herkunft eines Fundes wird direkt am Fund angezeigt, z. B. **„Gefunden durch: Quellenmonitor · Merkur“**, **„Gefunden durch: offene Recherche“** oder **„Gefunden durch: Beobachtungsauftrag ‚Kiesgrund‘“**.

Auf der Fundliste werden **kein separater Recherche-Status** und **keine zusätzliche Seitenliste „Beobachtungsaufträge mit Treffer“** angezeigt. Zustände von Quellen und Beobachtungsaufträgen gehören in deren jeweilige Listen-/Detailansichten.

Der **FIB-Assistent** übernimmt auf der Fundliste den Kontext **Recherche › Funde + aktuelle Filterung**. Geeignete Hinweise sind z. B.:

- „Sind unter diesen Funden wahrscheinlich Dubletten?“
- „Warum werden diese Funde als hoch relevant eingestuft?“
- „Welche Funde sollte ich zuerst prüfen?“

Erst in der Funddetailansicht bezieht sich der Assistent auf einen konkreten Fund.

Ergonomie für lange Listen:

- Bereichs-/Objekttyp-Auswahl, lokale Suche und Filter bleiben beim Scrollen sichtbar (**sticky**).
- Der kontextbezogene FIB-Assistent steht vor der Liste, scrollt aber normal mit und ist nicht sticky.
- Die Listenfußzeile bleibt am Listenende und ist nicht sticky.
- Die Standardsortierung wird oben in der Nähe der Filter **dezent sichtbar** gemacht, z. B. **„Sortiert nach: Handlungsbedarf, dann Funddatum“**. Sie ist zunächst Information; eine Änderung der Sortierung kann über eine kleine Auswahl erfolgen.
- Für die Fundliste lautet die Standardsortierung: **zuerst Handlungsbedarf/Relevanz, innerhalb dessen neueste Funde zuerst**.


## 16. Funddetail – geführter Entscheidungsablauf

Das Funddetail führt die Redaktion schrittweise durch die fachliche Prüfung:

1. **Fund verstehen**
2. **Ereignis entscheiden**
3. **Meldungsentscheidung**
4. **Zuordnung**
5. **Abschluss**

Die Schritte zeigen ihren Bearbeitungszustand sichtbar an, z. B.:

- **erledigt**
- **aktuell**
- **offen**
- **nicht erforderlich**

Der Objektkopf zeigt immer nur den **aktuell offenen nächsten Arbeitsschritt** als To-do. Eine bestätigte Zuordnung bleibt kein dauerhaftes To-do.

Für Zuordnungen gilt:

- KI-Vorschläge zu Vorgang und Thema werden direkt im Schritt **„Zuordnung“** angezeigt.
- Die Redaktion kann einen Vorschlag **bestätigen**, **ändern** oder mit **„Keine Zuordnung“** verwerfen. Diese Optionen gelten für Vorgang und Thema gleichermaßen.
- Nach Bestätigung ist der Zuordnungsschritt erledigt, bis sich durch neue Informationen erneut ein Prüfbedarf ergibt.

Ein separater Seitenkasten **„Bereits erkannte Zusammenhänge“** entfällt, weil er die Informationen aus dem Zuordnungsschritt doppelt.

Für Quellen gilt:

- Der Fund verweist zunächst auf seine konkrete Fundquelle.
- Die Einordnung **Primärquelle / Sekundärquelle** ist eine Eigenschaft der Quelle.
- Zusätzliche Quellen zu demselben Sachverhalt werden als eigene Quellenbelege erfasst und später dem Ereignis bzw. der Meldung zugeordnet.
- Ein separater Kasten **„Quellenlage“** im Funddetail entfällt.
- In **„Fund verstehen“** kann bei Bedarf die Aktion **„Weitere Quelle suchen“** angeboten werden.

Der FIB-Assistent bleibt im Funddetail kontextbezogen auf den aktuell geöffneten Fund.

## 17. Quellenliste

Die Quellenliste ist die zentrale Pflegeansicht für den **gesamten hinterlegten Recherchequellenbestand**. Sie enthält Pflichtquellen, Regelquellen und ergänzende Quellen unabhängig davon, ob aktuell Handlungsbedarf besteht.

Für die Darstellung gilt:

- Die Liste soll **stark verdichtet, tabellenartig und vertikal gut scanbar** sein.
- Pro Quelle genügen grundsätzlich **zwei Zeilen**: eine Titelzeile und eine kompakte Ergebniszeile.
- Erläuternde Beschreibungstexte zur Quelle werden in der Liste weggelassen und gehören ins Quellendetail.
- In der Ergebniszeile stehen Rolle, Zustand sowie Prüfzeitpunkt und Prüfintervall kompakt nebeneinander, z. B. **„Pflichtquelle · Prüfung fehlgeschlagen · Geprüft: heute 09:46 · täglich“**.
- Ein separates To-do wird in der Quellenliste nicht wiederholt, wenn es eindeutig aus dem Zustand hervorgeht. Der konkrete nächste Schritt wird im Quellendetail gezeigt.
- Die Aktion zum Öffnen/Bearbeiten soll platzsparend in die Titelzeile integriert werden. Bevorzugt wird ein eindeutiges Bearbeiten-Symbol (Bleistift) mit Tooltip/Accessible Label **„Quelle öffnen“** statt einer zusätzlichen Aktionsspalte.
- Quellen mit Handlungsbedarf stehen standardmäßig vor unauffälligen Quellen; innerhalb gleicher Priorität folgt die Sortierung nach Quellenname.
- Zähler in Tabs werden generell **semantisch beschriftet**, damit klar ist, was gezählt wird, z. B. **„Funde (8 offen)“**, **„Quellen (2 Hinweise)“**, **„Beobachtungsaufträge (6 aktiv)“**. Dieses Prinzip gilt systemweit, wenn Tab-Zähler unterschiedliche Bedeutungen haben können.

## 18. Bedienelemente: Buttons und Tabs

Buttons und Tabs werden im Redaktionssystem als unterschiedliche UI-Komponenten behandelt.

### Buttons

Buttons lösen **Aktionen** aus.

Verbindliche Grundtypen:

- **Primärbutton**: wichtigste Aktion im aktuellen Kontext, z. B. **„Speichern“**, **„Prüfung abschließen“**, **„Veröffentlichen“**. Visuell deutlich hervorgehoben.
- **Sekundärbutton**: alternative oder ergänzende Aktion, z. B. **„Zurückstellen“**, **„Anderen wählen“**, **„Weitere Quelle suchen“**.
- **Icon-Button**: platzsparende, häufig wiederkehrende Aktion mit eindeutigem Symbol. Er besitzt eine sichtbare Buttonfläche, Hover-/Focus-Zustand, Tooltip und Accessible Label. Ein nacktes Symbol ohne erkennbare Interaktionsfläche wird vermieden.
- **Kritische Aktion**: irreversible oder folgenreiche Aktion, z. B. Löschen oder endgültiges Verwerfen. Sie erhält eine eigene Warn-/Bestätigungslogik und wird nicht mit normalen Primäraktionen vermischt.

Für Listen kann ein Icon-Button direkt in der Titelzeile stehen, wenn dadurch eine zusätzliche Aktionsspalte vermieden wird. Beim Quellenkatalog wird dafür ein Bearbeiten-/Öffnen-Icon verwendet. Das konkrete Produktions-Icon wird aus dem verbindlichen FIB-Icon-Stil abgeleitet; das Bleistiftzeichen im Wireframe ist nur Platzhalter.

### Tabs

Tabs sind **keine normalen Aktionsbuttons**, sondern dienen dem Wechsel zwischen gleichrangigen Ansichten innerhalb eines Bereichs.

Beispiele:

- **Funde**
- **Quellen**
- **Beobachtungsaufträge**

Für Tabs gilt:

- genau ein Tab ist als aktuell ausgewählt erkennbar;
- Tabs verändern die angezeigte Ansicht, führen aber keine fachliche Aktion aus;
- Zähler werden semantisch beschriftet, wenn ihre Bedeutung sonst unklar wäre, z. B. **„Quellen (2 Hinweise)“**;
- Tab-Design und Button-Design bleiben visuell verwandt, aber klar unterscheidbar.

## 19. Konsistenz innerhalb Recherche

Die drei Recherchelisten **Funde**, **Quellen** und **Beobachtungsaufträge** verwenden dieselbe visuelle Grundstruktur.

Verbindlich:

- gleiche Tab-Darstellung mit semantischen Zählern;
- gleiche lokale Suche, Filterlogik und dezente Sortierinformation;
- kompakte, tabellenartig scanbare Listeneinträge;
- möglichst **Titelzeile + Ergebniszeile** je Eintrag;
- gleicher Icon-Button-Stil zum Öffnen/Bearbeiten;
- gleiche Darstellung des kontextbezogenen FIB-Assistenten vor langen Listen.

Der FIB-Assistent soll innerhalb des Redaktionssystems **nicht je Bereich anders gestaltet** werden. Unterschiede ergeben sich nur aus Kontext und Beispieltext, nicht aus der visuellen Komponente.

Für die Fundliste gilt zusätzlich:

- Titelzeile = Fundtitel;
- Ergebniszeile = Herkunft, Relevanz, Zuordnungshinweis und kompaktes To-do;
- offensichtliche Schnellentscheidungen wie **„Nicht relevant“** und **„Zurückstellen“** bleiben direkt in der Liste möglich, werden aber visuell nachgeordnet;
- komplexe Entscheidungen bleiben im Funddetail.

## 20. Veröffentlichung: Freigaben

Die Freigabeliste übernimmt die etablierten Listenstandards des Redaktionssystems.

Verbindlich:

- Tabs mit semantisch eindeutigen Zählern, z. B. **„Freigaben (3 offen)“**, **„Medien & Dateien (2 Hinweise)“**, **„Kommunikation (1 offen)“**, **„Besucherführung (0 Hinweise)“**;
- lokale Suche, Filter und dezente Sortierinformation;
- kompakte Darstellung je Eintrag mit Titelzeile und Ergebniszeile;
- Ergebniszeile kombiniert Freigabestatus, relevante Prüfergebnisse und das nächste To-do;
- Einträge mit höchster Entscheidungsreife bzw. dringendem Handlungsbedarf stehen zuerst;
- die direkte Aktion **„Freigeben“** wird nur angeboten, wenn alle fachlichen und technischen Voraussetzungen erfüllt sind;
- blockierte oder unvollständige Inhalte werden geöffnet und im Detail weiterbearbeitet;
- der kontextbezogene FIB-Assistent verwendet dieselbe visuelle Komponente wie in anderen Bereichen und bezieht sich auf die aktuelle Filterung.

## 21. Veröffentlichung: Medien & Dateien

Der Bereich **Medien & Dateien** verwaltet Bilder, Dokumente und sonstige veröffentlichungsrelevante Dateien einschließlich Rechte- und Verwendungsstatus.

Verbindlich:

- dieselbe Listenstruktur wie in Freigaben und Recherche: semantische Tabs, lokale Suche, Filter, Sortierhinweis, kompakte Titel- und Ergebniszeile;
- die Liste zeigt nur Informationen, die für Auswahl, Prüfung und Veröffentlichung relevant sind;
- erläuternde Metadaten gehören ins Detail;
- pro Medium werden mindestens Typ, Rechte-/Freigabestatus, Verwendung und gegebenenfalls Handlungsbedarf sichtbar;
- Rechteprobleme oder ungeklärte Nutzung stehen in der Sortierung vor unauffälligen Medien;
- Medien können einem oder mehreren Inhalten zugeordnet sein. Die Zuordnungen zu Meldungen, Vorgängen und Themen werden im Mediendetail gepflegt und als aktuelle Verwendungen angezeigt;
- das Mediendetail unterscheidet **Verwendung** und **Bindungsregel**. Eine Bindungsregel kann z. B. festlegen, dass ein Bild exklusiv für einen bestimmten Beitrag bzw. Inhalt vorgesehen ist und nicht automatisch anderweitig angeboten wird;
- die konkrete Entscheidung, ob und wie ein Medium in einer Meldung verwendet wird, erfolgt zusätzlich im jeweiligen Inhaltsobjekt (insbesondere in der Meldung). Dort wird z. B. Bildauswahl, Position bzw. Veröffentlichungsverwendung bestätigt;
- jede bestätigte Verwendung wird zum Medium zurückgespiegelt, sodass dort sichtbar ist, **wo** das Medium aktuell verwendet wird und ob die Verwendung exklusiv oder mehrfach zulässig ist;
- ein Medium mit ungeklärten Rechten darf eine Veröffentlichung blockieren;
- das Öffnen/Bearbeiten erfolgt über den standardisierten Icon-Button;
- der FIB-Assistent bleibt visuell identisch und arbeitet mit dem aktuellen Listen-/Filterkontext.

## 22. Veröffentlichung: Kommunikation

Der Bereich **Kommunikation** steuert die aktive Weitergabe bereits fachlich freigegebener FIB-Inhalte nach außen. Er ist kein zweiter Ort für die inhaltliche Bearbeitung einer Meldung.

Verbindlich:

- Kommunikationsobjekte beziehen sich auf einen bereits vorhandenen FIB-Inhalt, in der Regel eine Meldung;
- mögliche Ausspielungen sind z. B. **Link mit Teaser**, **Social-Teaser**, **Hinweis an Multiplikatoren** oder andere definierte Kommunikationskanäle;
- der Kommunikationsbereich zeigt kompakt **Ziel/Kanal**, **bezogenen Inhalt**, **Status** und **nächsten Schritt**;
- Inhalte werden nicht hier neu formuliert, wenn dadurch eine abweichende Parallelfassung entsteht. Kommunikation verwendet freigegebene Inhalte bzw. daraus erzeugte, nachvollziehbare Kurzfassungen;
- Statusbeispiele sind **Vorbereitung offen**, **Zur Freigabe bereit**, **Freigegeben**, **Versendet/Veröffentlicht**, **Zurückgestellt**;
- Versand oder Veröffentlichung nach außen ist eine explizite Aktion und darf nicht durch bloßes Speichern ausgelöst werden;
- ein Kommunikationsobjekt kann mehrere Ausspielungen desselben Inhalts bündeln, wenn diese fachlich zusammengehören;
- Verknüpfungen zur späteren Wirkungsanalyse bleiben erhalten, damit Reichweite und Reaktionen je Kanal ausgewertet werden können;
- die Liste verwendet die allgemeinen Standards: semantische Tabs, lokale Suche, Filter, kompakte Titel-/Ergebniszeile, Icon-Button und kontextbezogenen FIB-Assistenten;
- zur Anlage einer neuen Ausspielung gibt es den Primärbutton **„Neue Kommunikation“**. Der Begriff folgt dem Bereichsnamen; im Detail wird anschließend der konkrete Kanal bzw. die Ausspielungsart gewählt;
- die Beispiel-Fragen des FIB-Assistenten beziehen sich auf die aktuell sichtbaren Kommunikationsobjekte und deren nächste Entscheidungen, z. B. **„Welche offene Kommunikation sollte ich zuerst bearbeiten?“**, **„Wo fehlt noch eine Freigabe?“** oder **„Bei welchen Meldungen ist noch keine vorgesehene Ausspielung angelegt?“**.

## 23. Zusammenarbeit: Federführung und Transparenz

FIB verwendet für den kleinen Redaktionsbetrieb **keine restriktive Zuständigkeits- oder Besitzlogik**. Ziel ist Transparenz und Kontinuität, nicht Exklusivität.

### Gemeinsamer Arbeitskorb

- Der Arbeitskorb bleibt **für alle Redakteure gemeinsam**.
- Es gibt keine personenbezogenen Arbeitskörbe.
- Ein Filter **„Meine Federführungen“** bzw. **„Von mir bearbeitet“** darf die gemeinsame Sicht ergänzen, ersetzt sie aber nicht.
- Offene Einträge ohne Federführung bleiben für alle sichtbar und können von jedem Redakteur übernommen werden.

### Federführung

- Für länger laufende Objekte, insbesondere **Vorgänge**, kann eine **Federführung** hinterlegt werden.
- Federführung bedeutet: **Wer behält diesen Vorgang hauptsächlich im Blick?**
- Sie erzeugt keine Sperre und keine exklusiven Bearbeitungsrechte.
- Andere Redakteure dürfen jederzeit einzelne Arbeitsschritte übernehmen.
- Die Federführung kann freiwillig übernommen, gewechselt oder abgegeben werden.
- Zugehörige Funde, Meldungen oder Aufgaben können die Federführung des Vorgangs anzeigen, ohne dadurch automatisch exklusiv zugewiesen zu sein.

### Aktuelle Bearbeitung

- Ein Eintrag im Arbeitskorb kann durch **„Übernehmen“** sichtbar in Bearbeitung genommen werden.
- Die Anzeige lautet z. B. **„in Bearbeitung durch Maria Keller“** oder **„Federführung: Maria Keller“**.
- Diese Kennzeichnung dient nur der Koordination.
- Eine bestehende Bearbeitung blockiert andere Redakteure nicht.

### Historie und Einzelaktionen

- Jede fachlich relevante Aktion wird mit **Person und Zeitpunkt** protokolliert.
- In der Historie ist dadurch sichtbar, wer einen einzelnen Arbeitsschritt tatsächlich ausgeführt hat, auch wenn die Federführung bei einer anderen Person liegt.
- Beispiel: **„Einordnung geändert · Josef Walter · 08.10.2026, 18:42“**.
- Federführung, aktuelle Bearbeitung und Historie bleiben als drei unterschiedliche Informationen erkennbar.

### Übernahme anfragen

- Für Funde, Meldungen, Vorgänge und andere geeignete Arbeitsobjekte gibt es die Aktion **„Übernahme anfragen“**.
- Der anfragende Redakteur wählt einen anderen Redakteur und kann eine kurze Nachricht ergänzen.
- FIB versendet eine E-Mail mit direktem Link zum betreffenden Objekt.
- Die Anfrage erzeugt **keine automatische Zuweisung**. Der Empfänger kann das Objekt öffnen und anschließend freiwillig **„Übernehmen“**.
- Versand der Anfrage und spätere Übernahme werden in der Historie protokolliert.

### UI-Grundsatz

Der **Arbeitskorb ist die zentrale Koordinationsansicht der Redaktion**. Nur hier wird Federführung/Bearbeitung zu einem primären Ordnungs- und Filterkriterium. In den normalen Objektlisten bleibt dagegen der fachliche Zustand des jeweiligen Objekts das Hauptkriterium.

Jeder Arbeitskorbeintrag zeigt weiterhin die bereits vereinbarten Sachinformationen:
- worum es geht;
- warum eine Entscheidung nötig ist;
- KI-Vorschlag und kurze Begründung, soweit vorhanden;
- nächster möglicher Schritt / To-do;
- fachlicher Zustand bzw. Entscheidungsart.

Zusätzlich zeigt er klar getrennt die Koordinationsinformationen:
- **Federführung**;
- **aktuelle Bearbeitung**;
- letzte relevante Aktion mit Person und Zeitpunkt.

Die Zuständigkeitsinformationen **ersetzen keine Sachinformationen**, sondern ergänzen sie.

Darstellungsvorschlag je Arbeitskorbeintrag:
1. **Titelzeile:** Objektart + Titel.
2. **Sachzeile:** Entscheidungsart / fachlicher Zustand · warum Handlungsbedarf besteht · To-do.
3. **Koordinationszeile:** **Federführung: Maria Keller · Letzte Bearbeitung: Josef Walter · Quelle geprüft · heute 13:42**. Die Formulierung **„Letzte Bearbeitung“** wird gegenüber „aktuelle Bearbeitung“ bevorzugt, weil sie keine exklusive oder noch laufende Sperrwirkung suggeriert.
4. Aktionen: Öffnen, Übernehmen bzw. Übernahme anfragen; nur kontextabhängig weitere Aktionen.

- Federführung wird dezent, aber gut sichtbar im Objektkopf und im Arbeitskorb angezeigt.
- **Farben kennzeichnen keine Personen oder Zuständigkeiten.** Die Koordinationszeile ist visuell neutral (vorzugsweise Grau bzw. zurückhaltendes Blau als Informationsfarbe).
- Die bestehende FIB-Farblogik bleibt ausschließlich fachlichen Zuständen vorbehalten: Grün = vollständig/erledigt, Gelb/Orange = Aufmerksamkeit/Prüfung nötig, Rot = blockierend/kritisch, Blau = neutrale Information/in Arbeit, Grau = nachgeordnet/inaktiv.
- In einem Arbeitskorbeintrag erhält daher primär der **fachliche Zustand bzw. Handlungsbedarf** eine Statusfarbe; Federführung, letzte Bearbeitung und Historieninformation werden typografisch gegliedert, nicht farblich codiert.
- Bei nicht übernommenen Einträgen erscheint **„noch ohne Federführung“** mit der Aktion **„Übernehmen“**.
- Eine Federführung darf nie wie eine Berechtigungsschranke wirken.

## 24. Benutzerverwaltung: Rufname

Für Benutzer wird zusätzlich zum vollständigen Namen ein optionaler **Rufname** geführt.

Verbindlich:

- Der vollständige Name bleibt für Benutzerverwaltung, Audit und formale Historie erhalten.
- Der Rufname dient der kompakten Darstellung in kooperativen UI-Bereichen.
- In Arbeitskorb, Federführung, Übernahmeanfragen und vergleichbaren Koordinationsanzeigen wird bevorzugt der **Rufname** verwendet.
- Beispiele: **„Federführung: Maria“**, **„Letzte Bearbeitung: Josef“**.
- Falls kein Rufname hinterlegt ist, wird der vollständige Anzeigename verwendet.
- In Audit-/Historienansichten kann zusätzlich der vollständige Name erscheinen, damit die Zuordnung eindeutig bleibt.
- Der Rufname ist kein Login-Name und hat keine Berechtigungswirkung.

## 25. Federführung vererben und Bearbeitung sperren

### Federführung aus Ursprung ableiten

- Wird ein Fund aufgegriffen und daraus ein **Ereignis** erzeugt, erhält dieses Ereignis zunächst die Federführung des bearbeitenden Redakteurs.
- Entstehen aus einem Ereignis neue **Meldungen, Vorgänge oder Themen**, übernehmen diese initial die Federführung des Ereignisses.
- Sobald an einem Zielobjekt erstmals eine eigene Federführung gespeichert wurde, wird sie **nicht mehr automatisch überschrieben**.
- Die Federführung kann jederzeit manuell geändert oder abgegeben werden.
- Werden Ereignisse mit Meldungen, Vorgängen oder Themen verknüpft, deren Federführung abweicht, zeigt FIB einen **Hinweis auf die unterschiedliche Federführung**.
- Die App erzwingt keine Angleichung. Der Redakteur kann die Abweichung bewusst beibehalten oder eine Federführung ändern.

### Schreibsperre

Federführung bleibt organisatorisch weich. Die technische Bearbeitung kann dagegen exklusiv gesperrt werden.

- Eine Sperre wird **nicht bereits beim Öffnen** eines Objekts gesetzt.
- Die Sperre wird beim **ersten Editierversuch** gesetzt, also sobald ein Redakteur tatsächlich eine Änderung vornehmen möchte.
- Betroffen sind mindestens **Funde, Ereignisse, Meldungen, Vorgänge und Themen**. Weitere bearbeitbare Objekttypen werden später nach demselben Prinzip geprüft.
- Ist ein Objekt bereits durch einen anderen Redakteur gesperrt, bleibt die Ansicht lesbar; Änderungen sind bis zur Freigabe der Sperre nicht möglich.
- Eigene Sperren und fremde Sperren werden überall dort angezeigt, wo ein Objekt bearbeitet werden kann.

### Sperranzeige

Die Anzeige bleibt bewusst kompakt:

- eigene Sperre: **grünes Schloss + Rufname + Uhrzeit**, z. B. **🔒 Josef (09:14)**;
- fremde Sperre: **rotes Schloss + Rufname + Uhrzeit**, z. B. **🔒 Maria (09:14)**.

Die Farbe unterstützt die Bedeutung, das Schloss-Symbol bleibt der primäre Informationsträger.

### Lebensdauer der Sperre

- Die Sperre wird beim aktiven Bearbeiten regelmäßig erneuert.
- Beim regulären Verlassen bzw. Beenden der Bearbeitung wird sie freigegeben.
- Bleibt die Erneuerung aus, verfällt die Sperre nach einer kurzen Sicherheitsfrist automatisch.
- Admins können offensichtlich verwaiste Sperren manuell aufheben.
- Das Aufheben einer fremden Sperre wird protokolliert.

### Getrennte Koordinationsinformationen

FIB unterscheidet klar:

- **Federführung** = wer behält den Sachverhalt hauptsächlich im Blick;
- **Letzte Bearbeitung** = wer zuletzt fachlich daran gearbeitet hat;
- **Bearbeitungssperre** = wer gerade exklusiven Schreibzugriff besitzt;
- **Historie** = wer welchen konkreten Schritt wann ausgeführt hat.

## 26. Veröffentlichung: Besucherführung

Der Bereich **Besucherführung** steuert kontextbezogene Hinweise im öffentlichen FIB. Ziel ist Orientierung und Vertiefung ohne aufdringliche oder wiederholte Ansprache.

Verbindlich:

- Besucherführung basiert auf **Regeln und Ausspielbedingungen**, nicht auf frei schwebenden Marketinghinweisen.
- Mögliche Anlässe sind insbesondere:
  - **neu seit letztem Besuch**;
  - erster oder wiederkehrender Besuch;
  - Einstieg über einen extern geteilten Link;
  - bereits erkennbare Nutzung eines Themas oder Vorgangs;
  - PWA-Angebot nach erkennbarem Interesse;
  - Hinweise auf passende Vertiefung oder „Mehr wissen?“.
- Pro Besuch wird grundsätzlich höchstens **ein proaktiver Hinweis** gezeigt.
- Hinweise besitzen einen **Cooldown**, damit sie nicht bei jedem Aufruf erneut erscheinen.
- Die Besucherführung darf keine Anmeldung voraussetzen; gerätebezogene Informationen wie „neu seit letztem Besuch“ werden lokal bzw. gerätebezogen behandelt.
- Jeder Hinweis besitzt mindestens:
  - Anlass / Ausspielregel;
  - Zielgruppe bzw. Kontext;
  - Zielinhalt oder Aktion;
  - Status;
  - letzte Änderung;
  - optionale Laufzeit.
- Statusbeispiele: **Entwurf**, **Aktiv**, **Pausiert**, **Beendet**, **Hinweis prüfen**.
- Die Liste verwendet die allgemeinen UI-Standards: semantische Tabs, lokale Suche, Filter, kompakte Titel-/Ergebniszeile, Icon-Button und kontextbezogenen FIB-Assistenten.
- Wirkungsdaten werden später in **Auswertung → Besucher & Wirkung** betrachtet; die Besucherführung selbst bleibt eine Steuerungsansicht.

## 27. Auswertung: Besucher & Wirkung

Der Bereich **Besucher & Wirkung** beantwortet, ob FIB tatsächlich genutzt wird, welche Inhalte Interesse auslösen und über welche Wege Besucher erreicht werden. Er dient der redaktionellen Steuerung, nicht der möglichst vollständigen Webanalyse.

Verbindlich:

- Fokus auf wenige verständliche Kennzahlen mit redaktionellem Nutzen;
- Reichweite und Bindung werden getrennt betrachtet;
- persönliche und analoge Kontakte zu Multiplikatoren bleiben als eigener Wirkungskanal sichtbar;
- Datenschutz und Datensparsamkeit haben Vorrang vor detailliertem Nutzertracking;
- keine personenbezogenen Besucherprofile;
- Zeiträume und Vergleichswerte müssen eindeutig beschriftet sein;
- Kennzahlen werden immer mit fachlicher Bedeutung bzw. möglicher redaktioneller Konsequenz verknüpft.
- Wertende oder unklare Etiketten wie **„stabile Nutzung“**, **„stabile Bindung“**, **„gut“** oder **„schwach“** werden vermieden, wenn stattdessen eine konkrete beobachtete Veränderung beschrieben werden kann.

### Kernkennzahlen

**Reichweite**
- Besuche / Aufrufe im gewählten Zeitraum;
- erreichte Inhalte bzw. meistgesehene Meldungen/Themen;
- Zugangswege, z. B. Direktaufruf, geteilte Links und Social;
- **persönliche Rückmeldungen** werden als eigener Wirkungskanal ausgewiesen und nicht mit technischen Zugangswegen vermischt;
- PWA-Nutzung, soweit datenschutzkonform erfassbar.

**Bindung**
- wiederkehrende Nutzung;
- **weiterführende Nutzung**, z. B. Aufruf von **„Mehr wissen?“**, Wechsel von einer Meldung zu Vorgang oder Thema, Öffnen einer Hintergrundfrage oder einer weiteren Quelle;
- Nutzung von „neu seit letztem Besuch“;
- wiederholte Nutzung innerhalb eines geeigneten Zeitraums.

**Wirkung**
- welche Inhalte führen zu **weiterführender Nutzung**;
- welche Kommunikationswege bringen tatsächlich interessierte Besucher;
- welche Besucherführungs-Hinweise werden genutzt oder ignoriert;
- persönliche Rückmeldungen können manuell ergänzt werden, z. B. aus Vereinen, persönlichen Gesprächen, Telefonaten oder Veranstaltungen;
- für persönliche Rückmeldungen wird die Art zahlenmäßig dargestellt, mindestens **Zustimmung**, **Kritik**, **Hinweis** und **Ergänzung**.

### Darstellung

- Überblick mit wenigen Kennzahlkarten und verständlicher Veränderung zum Vergleichszeitraum;
- darunter tabellenartige Auswertung nach Inhalt, Kanal oder Besucherführung;
- keine technische Analytics-Oberfläche im Stil eines Rohdaten-Dashboards;
- auffällige Veränderungen werden konkret beschrieben, z. B. **„Aufrufe etwa auf Vorperiodenniveau“**, **„Wiederkehrende Nutzung +4 %“** oder **„hoher Aufruf, geringer Anteil weiterführender Nutzung“**; sie werden nicht automatisch als Erfolg oder Misserfolg bewertet;
- der FIB-Assistent kann die sichtbaren Daten erläutern und Hypothesen anbieten, muss Unsicherheiten und geringe Fallzahlen ausdrücklich benennen.

## 28. Auswertung: Inhalte

Der Bereich **Inhalte** zeigt, welche Meldungen, Vorgänge und Themen besonders häufig genutzt werden und welche davon zu weiterführender Nutzung führen. Ziel ist redaktionelle Orientierung, nicht eine Rangliste „guter“ oder „schlechter“ Inhalte.

Verbindlich:

- auswählbarer Zeitraum und klarer Vergleichszeitraum;
- Auswertung nach Meldungen, Vorgängen und Themen;
- mindestens **bereinigte Besuche/Aufrufe**, weiterführende Nutzung und Veränderung zum Vergleichszeitraum;
- Unterschiede zwischen hoher Reichweite und hoher weiterführender Nutzung werden sichtbar;
- keine automatische Erfolg-/Misserfolgsbewertung;
- geringe Fallzahlen und unsichere Aussagen werden kenntlich gemacht;
- **bereinigte Besuche** schließen offensichtliche Bots, Crawler und automatisierte Abrufe aus; die Kennzahl wird nicht als exakte Personenzahl interpretiert;
- persönliche Rückmeldungen können einem Inhalt zugeordnet und in aggregierter Form sichtbar gemacht werden;
- der FIB-Assistent erläutert auffällige Muster, weist aber ausdrücklich auf Unsicherheiten und alternative Erklärungen hin.

### Bereinigung menschlicher Nutzung

- bekannte Bot-/Crawler-Kennungen werden ausgeschlossen;
- auffällige, stark automatisierte Abrufmuster werden nicht als menschlicher Besuch gewertet;
- technische Abrufe ohne normale Nutzungssignale werden separat behandelt;
- Suchmaschinen- und KI-Crawler fließen nicht in die redaktionelle Reichweitenkennzahl ein;
- die Trennung erfolgt ohne personenbezogene Identifikation;
- eine vollständige Trennung Mensch/Maschine ist technisch nicht garantiert, daher bleibt die Kennzahl ausdrücklich eine **bereinigte Besuchszahl**;
- automatisierte Abrufe können separat in einer technischen Betriebs-/Admin-Auswertung dargestellt werden, gehören aber nicht in die redaktionelle Wirkungsanalyse.

Die Darstellung folgt einer kompakten tabellenartigen Logik. Sinnvolle Spalten sind:
- Inhalt;
- Typ;
- Aufrufe;
- weiterführende Nutzung;
- persönliche Rückmeldungen;
- Veränderung zum Vergleichszeitraum;
- beobachtbarer Hinweis.

## 29. Auswertung: Recherche

Der Bereich **Recherche** zeigt, wie gut die Quellen- und Suchlogik von FIB relevante Sachverhalte findet und wie viel davon tatsächlich redaktionell verwertbar ist.

Verbindlich:

- ausgewählter Zeitraum und klarer Vergleichszeitraum;
- Fokus auf redaktionell verständliche Qualitätskennzahlen statt technische Laufstatistik;
- getrennte Betrachtung von **Quellenmonitor**, **offener Recherche** und **Beobachtungsaufträgen**;
- Kennzahlen werden immer im Zusammenhang mit tatsächlicher redaktioneller Nutzung interpretiert;
- technische Fehlerdetails bleiben im Admin-Bereich **Tasks & Läufe**.

### Kernkennzahlen

- **Gefundene Funde** im Zeitraum;
- davon **relevant bestätigt**;
- davon **nicht relevant**;
- davon **zurückgestellt / ungeklärt**;
- aus Funden entstandene **Ereignisse**;
- daraus entstandene **Meldungen**;
- Treffer je Rechercheweg bzw. Quelle;
- Funde ohne redaktionelle Nutzung über längere Zeit;
- Quellen oder Beobachtungsaufträge mit auffällig geringer oder hoher Ausbeute.

### Qualitätsfragen

Die Auswertung soll insbesondere helfen zu erkennen:

- Finden wir relevante Entwicklungen früh genug?
- Welche Pflicht- und Regelquellen liefern tatsächlich verwertbare Funde?
- Welche Beobachtungsaufträge sind zu eng oder zu breit?
- Wo entstehen viele Funde, aber kaum Ereignisse oder Meldungen?
- Welche relevanten Entwicklungen wurden erst spät oder über Umwege entdeckt?

### Darstellung

- auf separate Kennzahlkarten für einen Gesamtüberblick wird verzichtet, wenn dieselben Aussagen in der Auswertung nach Recherchewegen verständlicher und differenzierter sichtbar sind;
- tabellenartige Auswertung nach Rechercheweg, Quelle oder Beobachtungsauftrag ist die zentrale Darstellung;
- auffällige Muster werden konkret beschrieben, nicht automatisch bewertet;
- geringe Fallzahlen werden kenntlich gemacht;
- der FIB-Assistent kann Muster erläutern und mögliche Anpassungen der Recherchelogik vorschlagen, Änderungen aber nicht ohne redaktionelle Bestätigung ausführen.

## 30. Auswertung: Redaktion

Der Bereich **Redaktion** zeigt, wie gut die redaktionelle Arbeit organisiert ist und wo sich Rückstände, Wartezeiten oder wiederkehrende Engpässe bilden. Er dient der Arbeitsorganisation und Prozessverbesserung, nicht der Bewertung einzelner Personen.

Verbindlich:

- keine Ranglisten oder Leistungsbewertungen von Redakteuren;
- personenbezogene Angaben nur dort, wo sie für Koordination und Nachvollziehbarkeit erforderlich sind;
- Schwerpunkt auf Arbeitsfluss, offenen Entscheidungen, Liegezeiten und Übergängen;
- Federführung, letzte Bearbeitung, Bearbeitungssperre und Historie bleiben fachlich getrennte Konzepte;
- technische Laufdaten bleiben im Admin-Bereich.

### Kernfragen

Die Auswertung soll insbesondere helfen zu erkennen:

- Wo stauen sich offene Entscheidungen?
- Welche Objekttypen oder Arbeitsschritte bleiben besonders lange offen?
- Wo entstehen wiederholt Rückfragen oder Nacharbeiten?
- Welche Freigaben warten ungewöhnlich lange?
- Wo fehlen Federführungen oder Übernahmen?
- Welche Arbeitsschritte werden häufig zurückgestellt?
- Wie entwickelt sich der offene Bestand über Zeit?

### Zentrale Kennzahlen und Darstellungen

- offene Arbeitskorb-Einträge nach Entscheidungstyp;
- Alter offener Einträge in sinnvollen Zeitklassen;
- mittlere bzw. typische Liegezeit je Arbeitsschritt;
- Anzahl der Einträge ohne Federführung;
- zurückgestellte Einträge und deren Alter;
- Freigaben, die auf fachliche Voraussetzungen warten;
- Wiedereröffnungen bzw. Nachbearbeitungen nach bereits erfolgter Bearbeitung;
- Entwicklung des offenen Bestands gegenüber dem Vergleichszeitraum.

### Darstellung

- keine pauschale Gesamtbewertung wie „Redaktion läuft gut/schlecht“;
- konkrete beobachtbare Aussagen statt Werturteile, zum Beispiel „5 Freigaben warten länger als 7 Tage“ oder „3 Funde ohne Federführung“;
- zentrale Darstellung nach Arbeitsschritt bzw. Entscheidungstyp;
- auffällige Liegezeiten werden hervorgehoben;
- **Alter offener Arbeit** wird bevorzugt als kompaktes Balkendiagramm nach Altersklassen dargestellt (z. B. 0–2, 3–7, 8–14, 15–30, >30 Tage);
- geringe Fallzahlen werden kenntlich gemacht;
- der FIB-Assistent kann Muster erläutern und organisatorische Verbesserungen vorschlagen, führt aber keine Änderungen ohne Bestätigung aus.


## 31. Zentrale Schwellenwerte und Statusregeln

Farbige Hervorhebungen und Warnstufen werden **nicht dezentral in einzelnen Listen oder Komponenten hart codiert**. Sie werden aus zentral gepflegten fachlichen Regeln abgeleitet und gelten systemweit für Dashboard, Arbeitskorb, Listen und Auswertungen.

### Grundsätze

- die semantische Bedeutung der Farben ist fest: neutral = kein besonderer Hinweis, gelb/orange = Aufmerksamkeit, rot = kritischer Handlungsbedarf, grün = positiver/erledigter Zustand;
- Farbe ist nie alleiniger Informationsträger; Text, Status oder Symbol bleibt zusätzlich sichtbar;
- numerische Grenzwerte werden zentral gepflegt, z. B. Alter eines offenen Fundes, Wartezeit einer Freigabe oder Zeit seit letzter Quellenprüfung;
- semantische Regeln ohne Zahlenwert bleiben davon getrennt, z. B. „Medienrechte ungeklärt“ oder „Prüfung fehlgeschlagen“;
- dieselbe Regel liefert in allen Ansichten dieselbe Warnstufe;
- zulässige Regeltypen werden durch das System vorgegeben; Admins pflegen nur fachliche Parameter und dürfen keine beliebige technische Logik definieren;
- Änderungen sind zu historisieren/auditieren.

### Administration

Unter **Administration → Referenzsystem → Schwellenwerte & Statusregeln** steht eine Admin-Tabelle zur Verfügung. Sie enthält mindestens:

- Regel / Bezeichnung;
- Objekt bzw. Bereich;
- Kennzahl oder Regeltyp;
- Warnschwelle (gelb/orange), soweit numerisch;
- kritische Schwelle (rot), soweit numerisch;
- Einheit, z. B. Tage oder Anzahl;
- Aktiv/Inaktiv;
- verständliche Beschreibung der Wirkung;
- Änderungsinformation.

Beispiel: Für „Wartende Freigabe“ kann fachlich gepflegt werden: neutral bis 3 Tage, gelb ab 4 Tagen, rot ab 8 Tagen. Diese Werte sind **Beispielwerte**, keine allgemein verbindlichen Standardgrenzen für andere Objekttypen.

## 32. Administration – Übersicht

Die **Administration** ist Teil derselben Anwendung wie das Redaktionssystem, aber nur für Admins sichtbar. Sie bündelt technische, sicherheitsrelevante und normative Verwaltungsaufgaben, die nicht in den normalen redaktionellen Arbeitsfluss gehören.

### Bereiche

- **Tasks & Läufe** – technische und fachliche Hintergrundverarbeitungen, Fehler, Wiederholungen und Laufhistorie;
- **KI & Kosten** – Provider, Modelle, Qualitätsklassen, Routing, Nutzung und Kostenkontrolle;
- **Referenzsystem** – Referenzwissen, fachliche Systemparameter sowie **Schwellenwerte & Statusregeln**;
- **Benutzer & Rollen** – Benutzer, Rufname, Rolle, Aktivstatus, MFA-/Zugangsstatus;
- **System** – betriebliche Konfiguration, Integrationen und technische Zustände;
- **Audit** – nachvollziehbare Änderungen, Freigaben, administrative Eingriffe und sicherheitsrelevante Aktionen.

### Admin-Startansicht

Die Admin-Startansicht ist **kein technisches Monitoring-Dashboard mit Rohlogs**, sondern ein kompakter Überblick über administrativen Handlungsbedarf.

Sie zeigt insbesondere:

- fehlgeschlagene oder blockierte Tasks/Läufe;
- sicherheits- oder zugangsrelevante Hinweise;
- ungewöhnliche KI-Kosten oder Budgethinweise;
- offene bzw. problematische Systemkonfigurationen;
- fällige Prüfungen im Referenzsystem;
- aktuelle Audit-Hinweise, soweit administrativ relevant.

Grundsatz:

> **Zuerst administrativen Handlungsbedarf zeigen, Details erst nach Öffnen des jeweiligen Bereichs.**

Erfolgreiche Routinevorgänge und vollständige Protokolle bleiben in den jeweiligen Detailansichten und dominieren die Übersicht nicht.

### Navigation

Die Administration folgt denselben Navigationsprinzipien wie das übrige Redaktionssystem:

> Administration → Bereich → Liste/Auswahl → Detail/Bearbeitung

Direkteinstiege aus Systemhinweisen sind erlaubt. Breadcrumbs bleiben verpflichtend.

## 33. Administration: Tasks & Läufe

Der Bereich **Tasks & Läufe** macht technische und fachliche Hintergrundverarbeitungen administrierbar. Er dient Diagnose und Betrieb, nicht der redaktionellen Tagesarbeit.

### Begriffe

- **Task** = persistente Definition einer automatisierten oder systemseitig ausgelösten Arbeit.
- **Lauf** = konkrete Ausführung eines Tasks zu einem bestimmten Zeitpunkt.
- fachliche Ergebnisse eines Laufs, z. B. neue Funde, werden in den zuständigen Fachbereichen weiterbearbeitet und nicht im Admin-Bereich fachlich entschieden.

### Listenansicht

Die Standardansicht zeigt die Tasks mit ihrem aktuellen Betriebszustand. Pro Task werden mindestens angezeigt:

- Bezeichnung;
- Zweck bzw. Task-Typ;
- Aktiv/Pausiert;
- Auslöser bzw. Rhythmus;
- letzter Lauf mit Ergebnis;
- nächster geplanter Lauf, soweit vorhanden;
- aktueller Handlungsbedarf;
- Fehlerstatus, wenn ein Lauf fehlgeschlagen ist.

Sinnvolle Filter:

- Alle;
- Fehler / Handlungsbedarf;
- Aktiv;
- Pausiert;
- manuell auslösbar;
- nach Task-Typ.

Die Standardsortierung priorisiert:

> **Fehler/Handlungsbedarf → blockierte Läufe → überfällige Läufe → übrige aktive Tasks**

Erfolgreiche Routinevorgänge dominieren die Liste nicht.

### Taskdetail

Das Taskdetail trennt klar zwischen:

1. **Definition** – was der Task tun soll;
2. **Betrieb** – ob und wann er läuft;
3. **Laufhistorie** – konkrete Ausführungen;
4. **Fehler/Diagnose** – technische Ursache und mögliche Abhilfe.

Mögliche Admin-Aktionen:

- pausieren / aktivieren;
- manuellen Lauf starten, falls für den Task vorgesehen;
- fehlgeschlagenen Lauf erneut anstoßen;
- technische Diagnose öffnen;
- bei zulässigen Task-Typen Rhythmus bzw. fachliche Parameter bearbeiten.

Kritische Aktionen benötigen Bestätigung. Änderungen werden auditiert.

### Laufdetail

Ein Laufdetail zeigt mindestens:

- Start und Ende;
- Status;
- auslösender Task;
- Auslöser;
- Laufdauer;
- fachlich erzeugte Ergebnisse in aggregierter Form, z. B. Zahl neuer Funde;
- technische Fehlermeldung, soweit vorhanden;
- Retry-/Wiederholungsinformation;
- Link zu relevanten Fachobjekten, wenn der Lauf dort Ergebnisse erzeugt hat.

Technische Logdetails dürfen ausführlicher sein als im normalen Redaktionssystem, bleiben aber auf das für Diagnose erforderliche Maß begrenzt.

## 34. Administration – KI & Kosten

Der Bereich **KI & Kosten** bündelt die administrative Steuerung des KI-Betriebs. Er setzt die fachlichen Regeln aus `docs/KI-Betrieb-und-Kosten.md` sowie `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` um, ohne den redaktionellen Workflow an konkrete Anbieter oder Modelle zu koppeln.

### Struktur

Die Ansicht trennt vier Sichten:

- **Übersicht** – aktueller Kostenstand, Warnungen, Eskalationsquote und Kontrollstichprobe;
- **Routing** – Zuordnung von FIB-Aufgaben zu KI-Bedarf, Leistungsklasse, Primär- und Review-Modell;
- **Provider & Modelle** – freigegebene Anbieter/Modelle, Betriebsstatus und Eignung je Leistungsklasse;
- **Budgets & Limits** – Monatsbudget, Warnschwellen, harte Limits und optionale Kostenrahmen.

### Übersicht

Die Übersicht zeigt nur administrativ relevante Kennzahlen und Abweichungen:

- bisherige Kosten im laufenden Monat;
- Planungs-/Warnrahmen und ggf. Budgetstatus;
- Kosten nach verpflichtender Eingangsanalyse, bedarfsgesteuerter Recherche und optionaler Redaktions-KI;
- Anteil regulär eskalierter Fälle;
- Anteil der Kontrollstichproben;
- auffällige Kostenentwicklungen oder Fehlerloops;
- ggf. Provider-/Modellstörungen.

Konkrete Anbieterpreise werden nicht als dauerhafte fachliche Regel behandelt.

### Routing

Die Routing-Matrix ist konfigurierbar und wird **nicht im Anwendungscode fest verdrahtet**.

Je FIB-Aufgabe werden mindestens gepflegt:

- KI-Bedarf: verpflichtend / bedarfsgesteuert / optional;
- erforderliche KI-Leistungsklasse A / B / C;
- Primärmodell;
- zulässiges Review-/Qualitätsmodell;
- externe Recherche/Tools erlaubt oder nicht;
- Fallback- bzw. Hochstufungsregel;
- optionaler Kostenrahmen.

Änderungen am Routing sind administrative Konfigurationsänderungen und werden auditiert.

### Provider & Modelle

Je Provider/Modell werden mindestens angezeigt:

- Anbieter und Modellbezeichnung;
- Freigabestatus;
- unterstützte Leistungsklassen;
- Rolle: Primär, Review oder beides;
- Betriebsstatus / letzte technische Prüfung;
- Ergebnis des letzten FIB-Modelltests bzw. Referenz darauf;
- Datenresidenz-/Datenschutzhinweis, soweit relevant.

Ein Modell darf produktiv nur verwendet werden, wenn es für die zugewiesene Aufgabe bzw. Leistungsklasse im FIB-Test als geeignet freigegeben ist.

### Budgets & Limits

Vorgesehen sind mindestens:

- Monatsbudget bzw. Planungsrahmen;
- Warnschwelle;
- hartes Limit, soweit technisch durchsetzbar;
- getrennte Kostenrahmen für verpflichtende, bedarfsgesteuerte und optionale KI;
- Erkennung ungewöhnlicher Nutzung oder Fehlerloops;
- verständliche Information, welche Funktionen bei Erreichen eines Limits betroffen wären.

Kostensteuerung darf qualitätskritische Pflichtfunktionen nicht stillschweigend auf ein ungeeignetes Billigmodell umleiten.

### Zwei-KI-Prinzip

Die Oberfläche bildet die getrennten Rollen **Primärmodell** und **Review-/Qualitätsmodell** sichtbar ab. Eskalationen und Kontrollstichproben werden getrennt ausgewertet. Der Startwert der Kontrollstichprobe beträgt gemäß KI-Konzept 5 %, bleibt aber administrativ bzw. regelbasiert anpassbar.

## 35. Administration – Referenzsystem

Der Bereich **Referenzsystem** bündelt dauerhaftes FIB-spezifisches Referenzwissen, politische bzw. fachliche Referenzmaßstäbe und zentrale fachliche Systemparameter. Er ist kein allgemeines Wissensarchiv.

### Struktur

Die Ansicht trennt drei Sichten:

- **Referenzobjekte** – stabile Bezugsobjekte, Bezeichnungen/Aliase und fachlich nützliche Beziehungen;
- **Referenzrahmen** – dokumentierte, versionierte Qualitäts-, demokratisch-gesellschaftliche und politische Maßstäbe;
- **Schwellenwerte & Statusregeln** – zentral administrierbare Warnschwellen und semantische Statusregeln.

### Referenzobjekte

Referenzobjekte dienen dazu, lokale oder FIB-spezifische Bezugsobjekte und Zusammenhänge zuverlässig und modellunabhängig verfügbar zu machen. Es enthält insbesondere:

- stabile Referenzobjekte, z. B. Orte, Räume, Infrastruktur oder Projekte;
- Hauptbezeichnungen und Aliase;
- Beziehungen wie „ist Teil von“, „liegt in/an“, „verbindet“, „erschließt/versorgt“ oder „steht in funktionalem Zusammenhang mit“;
- Herkunft bzw. Begründung, soweit erforderlich;
- Status: vorgeschlagen, bestätigt oder nicht mehr gültig/zurückgenommen.

Nur bestätigte Referenzobjekte und -beziehungen erweitern den verbindlichen Recherchekontext.

### Referenzrahmen

Der Referenzrahmen bündelt einzelne Referenzmaßstäbe. Diese werden nach drei Ebenen geführt:

1. allgemeine FIB-Qualitätsmaßstäbe;
2. demokratisch-gesellschaftliche Maßstäbe;
3. grün-politische Maßstäbe einschließlich dokumentierter lokaler Positionen.

Je Referenzmaßstab werden mindestens angezeigt:

- Bezeichnung;
- Ebene;
- Aussage / Kurzinhalt;
- Herkunft bzw. Quelle;
- Geltungsbereich;
- Status;
- Version;
- letzte Änderung.

Neue oder geänderte Maßstäbe werden auf Dubletten, Widersprüche, Abgrenzung, Ergänzung/Konkretisierung und ggf. notwendige neue Version geprüft.

### Schwellenwerte & Statusregeln

Dieser Unterbereich verwendet die bereits definierte zentrale Admin-Tabelle. Numerische Warnschwellen und semantische Regeln bleiben systemweit konsistent und werden nicht dezentral im UI-Code gepflegt.

### Arbeitsprinzip

Das Referenzsystem folgt einem zurückhaltenden Pflegeprinzip:

> **Nur Wissen und Regeln dauerhaft speichern, die für FIB wiederholt nützlich sind oder unabhängig vom eingesetzten KI-Modell zuverlässig verfügbar bleiben sollen.**

KI darf neue Referenzobjekte, Beziehungen oder Maßstäbe vorschlagen. Fachlich wirksam werden sie erst nach Bestätigung durch einen berechtigten Menschen. Änderungen und Rücknahmen werden historisiert bzw. auditiert.

## 36. Nächste UI-Schritte

Auf Basis dieses Konzepts werden schrittweise konkretisiert:

1. Dashboard
2. Arbeitskorb
3. Meldungsdetail / Freigabeworkflow
4. Vorgang
5. Thema
6. Recherche
7. Veröffentlichung
8. Auswertung
9. Besucherführung
10. Administration

Die Icon-Auswahl wird dabei systemweit konsistent fortgeführt.
