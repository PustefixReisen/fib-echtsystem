# KI-Zugangswege und gemeinsame Fachfunktionen – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für die fachlich-technische Zugriffsarchitektur zwischen Redaktions-Web-App, dialogorientiertem KI-Zugang, automatischen KI-Aufgaben und dem FIB-Datenbestand.

Es regelt noch nicht die vollständige Rollen- und Berechtigungsmatrix. Diese wird im nächsten Schritt konkretisiert.

## 2. Drei Arbeitsweisen

FIB unterstützt drei gleichberechtigte Arbeitsweisen:

1. **automatisch** – wiederkehrende oder anlassbezogene KI-Aufgaben,
2. **strukturiert** – Redaktions-Web-App für geführte Bearbeitung, Übersicht, Prüfung und Freigabe,
3. **dialogorientiert** – freier KI-Dialog für Recherche, Analyse, exploratives Arbeiten und gezielte Übernahme strukturierter Ergebnisse.

Verbindliches Architekturprinzip:

> **Das Redaktionssystem ist nicht die einzige fachliche Benutzerschnittstelle von FIB. Strukturierte Web-Oberfläche, dialogorientierter KI-Zugang und automatische KI-Aufgaben greifen kontrolliert auf dieselben Fachfunktionen, Regeln und Daten zu.**

## 3. Kein direkter Tabellenzugriff als Fachschnittstelle

Die drei Zugangswege schreiben fachlich relevante Daten nicht über beliebige direkte Tabellenmanipulationen oder freies SQL.

Stattdessen verwenden sie definierte FIB-Fachfunktionen bzw. Services, die mindestens sicherstellen:

- Berechtigungsprüfung,
- fachliche Validierung,
- Qualitäts- und Referenzregeln,
- Dubletten- und Plausibilitätsprüfungen, soweit vorgesehen,
- Status- und Lebenszyklusregeln,
- Freigabeanforderungen,
- Historisierung und Auditierbarkeit.

Damit darf kein Zugangsweg die fachliche Logik umgehen.

## 4. Rolle des Chats

Der dialogorientierte KI-Zugang ist fachlich wie ein zusätzlicher Redaktionszugang zu behandeln, nicht wie ein unkontrollierter Datenbank-Client.

Die Einschränkung richtet sich deshalb grundsätzlich **nicht nach dem Inhaltstyp**, sondern nach der zulässigen Aktion und dem dafür vorgesehenen Fachworkflow.

Der Chat darf beispielsweise Ereignisse, Meldungen, Vorgänge, Themen, Referenzwissen, Referenzmaßstäbe oder Beobachtungsaufträge analysieren und – soweit Rolle und Workflow dies erlauben – Daten an den dafür vorgesehenen fachlichen Stellen vorbereiten, ergänzen oder zur Freigabe einreichen.

Für den Nachrichtenstrang `Ereignis → Meldung → Vorgang → Thema` gilt insbesondere:

> **Der Chat darf diese Inhalte nicht an den vorgesehenen Qualitäts-, Referenz-, Status- oder Freigaberegeln vorbei verändern. Er kann jedoch dieselben vorgesehenen Bearbeitungs- und Vorschlagsfunktionen wie ein Redakteur nutzen.**

## 5. Fachfunktionen statt Kanal-Sonderlogik

Eine fachliche Aktion soll möglichst genau eine definierte Fachfunktion besitzen. Beispielhaft:

- Referenzbezeichnung ergänzen,
- Referenzbeziehung vorschlagen,
- Beobachtungsauftrag anlegen oder ändern,
- Ereigniskandidat erzeugen,
- Meldungsentwurf ändern,
- Vorgangszuordnung vorschlagen,
- Referenzmaßstab als Kandidat anlegen,
- Freigabe anstoßen.

Ob eine Aktion aus Web-App, Chat oder automatischer KI-Aufgabe kommt, ändert nicht ihre fachlichen Regeln. Der Zugangsweg ist jedoch für Berechtigung, Bestätigungspflicht und Audit mitzuführen.

## 6. Grundprinzip für Schreibzugriffe

Für jede Fachfunktion wird später festgelegt, ob ein bestimmter Akteur und Zugangsweg sie:

- nur lesen/analysieren,
- als Vorschlag oder Entwurf erzeugen,
- nach ausdrücklicher Bestätigung fachlich wirksam ausführen,
- freigeben/veröffentlichen,
- administrativ ändern

dürfen.

Diese Rechte werden nicht pauschal an den Chat oder die Web-App gebunden, sondern an Rolle, Aktion, Objektzustand und erforderliche Freigabestufe.

Automatische KI-Aufgaben dürfen fachlich wirksame redaktionelle Freigaben nicht allein deshalb besitzen, weil sie systemseitig ausgeführt werden.

## 7. Nachvollziehbarkeit

Für fachlich relevante Änderungen muss mindestens nachvollziehbar sein:

- wer bzw. welcher technische Akteur die Aktion ausgelöst hat,
- über welchen Zugangsweg (`web`, `chat`, `automation`) sie erfolgte,
- welche Fachfunktion ausgeführt wurde,
- welches Objekt betroffen war,
- welche Regel-/Workflow-Version maßgeblich war, soweit relevant,
- ob eine ausdrückliche menschliche Bestätigung erforderlich und erfolgt war,
- Zeitpunkt und Ergebnisstatus.

## 8. Nächster Klärungsschritt

Als nächstes wird eine konkrete Sicherheits- und Berechtigungsmatrix festgelegt. Dabei werden Fachaktionen nach Risikoklasse und Freigabebedarf geordnet; insbesondere ist zu klären, welche Aktionen im Chat direkt nach Bestätigung ausgeführt werden dürfen und welche zusätzliche Freigabeschritte benötigen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 05.10.2026 | Drei Arbeitsweisen (automatisch, strukturiert, dialogorientiert) und gemeinsame Fachfunktionsschicht verbindlich festgelegt. Chat als kontrollierter Redaktionszugang definiert; Inhaltsbeschränkung zugunsten aktions- und workflowbezogener Berechtigungen verworfen; direkter unkontrollierter Tabellen-/SQL-Zugriff ausgeschlossen. |
