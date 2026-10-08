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

## 16. Nächste UI-Schritte

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
