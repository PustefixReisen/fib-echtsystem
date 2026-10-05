# KI-Zugangswege und gemeinsame Fachfunktionen – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für die fachlich-technische Zugriffsarchitektur zwischen Redaktions-Web-App, dialogorientiertem KI-Zugang, automatischen KI-Aufgaben und dem FIB-Datenbestand.

Es regelt noch nicht die vollständige Rollen- und Berechtigungsmatrix. Diese wird im nächsten Schritt konkretisiert.

Die konzeptionelle und technische Weiterentwicklung von FIB in einem externen Entwicklungs-/Arbeitswerkzeug wie ChatGPT ist von diesen produktiven Zugangswegen zu unterscheiden. Entwicklungsarbeit kann weiterhin in einem geeigneten KI-Arbeitsraum mit GitHub-, Datei- und Recherchezugriff erfolgen; sie ist nicht selbst Bestandteil des produktiven FIB-Zugangsmodells.

## 2. Drei produktive Arbeitsweisen

FIB unterstützt drei gleichberechtigte produktive Arbeitsweisen:

1. **strukturiert – Redaktions-Web-App**: geführte Bearbeitung, Übersicht, Prüfung und Freigabe,
2. **dialogorientiert – FIB-Chat**: freier KI-Dialog für Recherche, Analyse, exploratives Arbeiten und gezielte Übernahme strukturierter Ergebnisse,
3. **automatisch – AI Tasks**: wiederkehrende oder anlassbezogene KI-Aufgaben ohne laufenden Dialog mit einem Menschen.

Verbindliches Architekturprinzip:

> **Das Redaktionssystem ist nicht die einzige fachliche Benutzerschnittstelle von FIB. Strukturierte Web-Oberfläche, dialogorientierter FIB-Chat und automatische AI Tasks greifen kontrolliert auf dieselben Fachfunktionen, Regeln und Daten zu.**

Alle drei produktiven Zugangswege verwenden dieselbe fachliche Service-/Funktionsschicht und denselben KI-Router, soweit für einen Arbeitsschritt KI erforderlich ist.

## 3. Redaktions-Web-App

Die Web-App ist der strukturierte Zugangsweg für standardisierte Bearbeitung, Übersichten, Statuspflege, Prüfung und Freigabe.

Nicht-KI-Funktionen der Web-App verursachen keine KI-Modellkosten. Nur Arbeitsschritte, die tatsächlich KI benötigen oder bewusst KI-Unterstützung anfordern, werden über den FIB-KI-Router an ein freigegebenes Modell weitergegeben.

## 4. FIB-Chat

Der FIB-Chat ist eine eigene FIB-Benutzerschnittstelle und nicht an einen bestimmten KI-Anbieter oder ein bestimmtes Sprachmodell gebunden.

Er ermöglicht freien Dialog insbesondere für:

- Recherche und Exploration,
- Analyse bestehender FIB-Daten,
- gemeinsames fachliches Durchdenken komplexer Sachverhalte,
- Vorbereitung strukturierter Änderungen,
- Aufruf zulässiger FIB-Fachfunktionen,
- Prüfung und Übernahme von Ergebnissen in den Datenbestand.

Der FIB-Chat verwendet den FIB-KI-Router. Auch reine Dialogbeiträge können deshalb Modellkosten verursachen. Die Modellwahl wird wie bei anderen FIB-KI-Funktionen nach Qualitätsanforderung, Kosten und Routing-Regeln gesteuert.

Der dialogorientierte KI-Zugang ist fachlich wie ein zusätzlicher Redaktionszugang zu behandeln, nicht wie ein unkontrollierter Datenbank-Client.

Die Einschränkung richtet sich deshalb grundsätzlich **nicht nach dem Inhaltstyp**, sondern nach der zulässigen Aktion und dem dafür vorgesehenen Fachworkflow.

Der Chat darf beispielsweise Ereignisse, Meldungen, Vorgänge, Themen, Referenzwissen, Referenzmaßstäbe oder Beobachtungsaufträge analysieren und – soweit Rolle und Workflow dies erlauben – Daten an den dafür vorgesehenen fachlichen Stellen vorbereiten, ergänzen oder zur Freigabe einreichen.

Für den Nachrichtenstrang `Ereignis → Meldung → Vorgang → Thema` gilt insbesondere:

> **Der Chat darf diese Inhalte nicht an den vorgesehenen Qualitäts-, Referenz-, Status- oder Freigaberegeln vorbei verändern. Er kann jedoch dieselben vorgesehenen Bearbeitungs- und Vorschlagsfunktionen wie ein Redakteur nutzen.**

## 5. Automatische AI Tasks

Automatische AI Tasks bearbeiten periodische oder anlassbezogene Aufgaben ohne laufenden Benutzer-Dialog.

Sie verwenden ebenfalls den FIB-KI-Router und werden im Kosten-, Qualitäts- und Laufmonitoring erfasst.

Typische Aufgaben sind beispielsweise:

- regelmäßige Quellen- und Rechercheläufe,
- Beobachtungsaufträge,
- Pflege- und Aktualisierungsprüfungen von Referenzwissen oder Referenzrahmen,
- Qualitätssicherungs- oder Kontrollstichproben,
- regelmäßige Auswertung von Kosten, Qualitätsindikatoren, Korrekturaufwand und Eskalationsquoten zur Optimierung der Routing-Matrix.

Für die Kostenoptimierung gilt unverändert:

> **FIB optimiert nicht auf die billigste Antwort, sondern auf die geringsten Kosten für ein ausreichend gutes Ergebnis.**

Automatische Optimierungsaufgaben dürfen Änderungen an der produktiven Routing-Matrix vorschlagen, aber nicht ohne die dafür vorgesehene Prüfung/Freigabe verbindlich aktivieren.

## 6. Gemeinsame Fachfunktionen statt Kanal-Sonderlogik

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

Eine fachliche Aktion soll möglichst genau eine definierte Fachfunktion besitzen. Beispielhaft:

- Referenzbezeichnung ergänzen,
- Referenzbeziehung vorschlagen,
- Beobachtungsauftrag anlegen oder ändern,
- Ereigniskandidat erzeugen,
- Meldungsentwurf ändern,
- Vorgangszuordnung vorschlagen,
- Referenzmaßstab als Kandidat anlegen,
- Freigabe anstoßen.

Ob eine Aktion aus Web-App, FIB-Chat oder automatischer KI-Aufgabe kommt, ändert nicht ihre fachlichen Regeln. Der Zugangsweg ist jedoch für Berechtigung, Bestätigungspflicht und Audit mitzuführen.

## 7. Grundprinzip für Schreibzugriffe

Für jede Fachfunktion wird festgelegt, ob ein bestimmter Akteur und Zugangsweg sie:

- nur lesen/analysieren,
- als Vorschlag oder Entwurf erzeugen,
- nach ausdrücklicher Bestätigung fachlich wirksam ausführen,
- freigeben/veröffentlichen,
- administrativ ändern

dürfen.

Diese Rechte werden nicht pauschal an den FIB-Chat oder die Web-App gebunden, sondern an Rolle, Aktion, Objektzustand und erforderliche Freigabestufe.

Automatische AI Tasks dürfen fachlich wirksame redaktionelle Freigaben nicht allein deshalb besitzen, weil sie systemseitig ausgeführt werden.

## 8. KI-Router und Modellunabhängigkeit

Web-App, FIB-Chat und AI Tasks verwenden dieselbe Routinglogik für KI-Aufrufe.

Die Fachfunktion legt die erforderliche Qualitätsklasse fest; der Router wählt daraus ein freigegebenes Modell bzw. einen Provider. Dadurch bleibt die Benutzeroberfläche von konkreten Modellen entkoppelt.

Modelle und Provider können anhand von Qualitätsmessungen, Kosten, Datenschutz, Verfügbarkeit und Fallback-Regeln ausgetauscht werden, ohne den fachlichen Workflow neu zu gestalten.

## 9. Externe KI-Systeme / MCP

Eine zusätzliche MCP-kompatible Anbindung externer KI-Systeme bleibt architektonisch möglich, ist aber **keine MVP-Abhängigkeit** und kein vierter notwendiger Zugangsweg.

Die FIB-Fach-API bzw. Fachfunktionsschicht bleibt die maßgebliche technische Schnittstelle. Ein späterer MCP-Zugang wäre lediglich ein Adapter auf dieselben Funktionen und Sicherheitsregeln.

Die Wiederaufnahme ist im GitHub-Issue **#2 „MCP-Anbindung externer KI-Systeme nach MVP prüfen“** mit konkreten Auslösern dokumentiert.

## 10. Nachvollziehbarkeit

Für fachlich relevante Änderungen muss mindestens nachvollziehbar sein:

- wer bzw. welcher technische Akteur die Aktion ausgelöst hat,
- über welchen Zugangsweg (`web`, `chat`, `automation`) sie erfolgte,
- welche Fachfunktion ausgeführt wurde,
- welches Objekt betroffen war,
- welche Regel-/Workflow-Version maßgeblich war, soweit relevant,
- ob eine ausdrückliche menschliche Bestätigung erforderlich und erfolgt war,
- Zeitpunkt und Ergebnisstatus.

KI-Aufrufe des FIB-Chats und automatischer AI Tasks werden zusätzlich im gemeinsamen Kosten- und Qualitätsmonitoring erfasst.

## 11. Nächster Klärungsschritt

Als nächstes wird eine konkrete Sicherheits- und Berechtigungsmatrix festgelegt. Dabei werden Fachaktionen nach Risikoklasse und Freigabebedarf geordnet; insbesondere ist zu klären, welche Aktionen im FIB-Chat direkt nach Bestätigung ausgeführt werden dürfen und welche zusätzliche Freigabeschritte benötigen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 05.10.2026 | Drei produktive Zugangswege verbindlich konkretisiert: Redaktions-Web-App, eigener anbieterunabhängiger FIB-Chat und automatische AI Tasks. Gemeinsamer KI-Router, Kosten-/Qualitätsmonitoring und Kostenoptimierung als AI Task ergänzt. MCP als optionale spätere Adapter-Schnittstelle und nicht als MVP-Abhängigkeit abgegrenzt. Entwicklungsarbeit in externen KI-Arbeitsräumen vom produktiven Zugangsmodell getrennt. |
| 1.0 | 05.10.2026 | Drei Arbeitsweisen (automatisch, strukturiert, dialogorientiert) und gemeinsame Fachfunktionsschicht verbindlich festgelegt. Chat als kontrollierter Redaktionszugang definiert; Inhaltsbeschränkung zugunsten aktions- und workflowbezogener Berechtigungen verworfen; direkter unkontrollierter Tabellen-/SQL-Zugriff ausgeschlossen. |
