# KI-Zugangswege und gemeinsame Fachfunktionen – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.4 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für die fachlich-technische Zugriffsarchitektur zwischen Redaktions-Web-App, dialogorientiertem KI-Zugang, automatischen KI-Aufgaben und dem FIB-Datenbestand.

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

Der Chat darf beispielsweise Ereignisse, Meldungen, Vorgänge, Themen, Referenzwissen, Referenzmaßstäbe oder Beobachtungsaufträge analysieren und – soweit Rolle und Workflow dies erlauben – Daten an den dafür vorgesehenen fachlichen Stellen vorbereiten, ergänzen, fachlich wirksam ändern oder veröffentlichen.

Für den Nachrichtenstrang `Ereignis → Meldung → Vorgang → Thema` gilt insbesondere:

> **Der Chat darf diese Inhalte nicht an den vorgesehenen Qualitäts-, Referenz-, Status- oder Freigaberegeln vorbei verändern. Er kann jedoch dieselben vorgesehenen Bearbeitungs-, Freigabe- und Veröffentlichungsfunktionen wie ein berechtigter Redakteur nutzen.**

Der FIB-Chat kann zur Erfüllung eines fachlich eindeutigen Benutzerauftrags mehrere Fachfunktionen nacheinander orchestrieren. Jede Teilfunktion wird dabei separat serverseitig auf Rolle, Objektzustand, Regeln, Version und gegebenenfalls Bestätigung geprüft. Der Chat fasst anschließend das fachliche Gesamtergebnis zusammen, statt dem Benutzer unnötig die technische Funktionsfolge aufzubürden.

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

Die drei Zugangswege greifen fachlich relevante Daten nicht über beliebige direkte Tabellenmanipulationen oder freies SQL ab oder verändern sie auf diesem Weg.

Verbindlicher Architekturgrundsatz:

> **Alle regulären fachlichen Lese- und Schreibzugriffe von Web-App, FIB-Chat und AI Tasks auf den FIB-Datenbestand erfolgen über die gemeinsame Fachfunktions-/Service-Schicht.**

Dies gilt sowohl für Änderungen als auch für fachliche Lesezugriffe. Dadurch werden insbesondere Berechtigungen, Sichtbarkeit, Objektzustände und fachliche Ableitungsregeln an einer gemeinsamen Stelle durchgesetzt.

Rein technische Betriebszugriffe – insbesondere Datenbankmigrationen, Backup, Wiederherstellung, Wartung oder technische Diagnose – dürfen auf einer darunterliegenden technischen Ebene direkt mit der Datenbank arbeiten. Sie sind kein regulärer fachlicher Benutzerzugang und dürfen nicht als alternativer Weg zur Umgehung der Fachlogik verwendet werden.

Die Fachfunktions-/Service-Schicht stellt mindestens sicher:

- Berechtigungsprüfung,
- fachliche Validierung,
- Qualitäts- und Referenzregeln,
- Dubletten- und Plausibilitätsprüfungen, soweit vorgesehen,
- Status- und Lebenszyklusregeln,
- Freigabeanforderungen,
- Historisierung und Auditierbarkeit,
- für Lesezugriffe die jeweils zulässige Sicht auf öffentliche bzw. interne Daten.

Damit darf kein produktiver Zugangsweg die fachliche Logik umgehen.

Eine fachliche Aktion soll möglichst genau eine definierte Fachfunktion bzw. Funktionsfamilie besitzen. Der verbindliche MVP-Katalog wird in `docs/MVP-Fachfunktionen.md` geführt und nicht in diesem Architekturdokument dupliziert.

Ob eine Aktion aus Web-App, FIB-Chat oder automatischer KI-Aufgabe kommt, ändert nicht ihre fachlichen Regeln. Der Zugangsweg ist jedoch für Berechtigung, Bestätigungspflicht und Audit mitzuführen.

## 7. Rollenmodell

FIB verwendet für den MVP drei menschliche Rollen:

1. **Besucher** – öffentliche Nutzung ohne redaktionelle Schreib-, Freigabe- oder Administrationsrechte,
2. **Redakteur** – Recherche, Prüfung, Bearbeitung, fachlich wirksame Änderungen sowie Freigabe und Veröffentlichung im vorgesehenen Workflow,
3. **Admin** – besitzt zusätzlich zu den Redaktionsrechten administrative Rechte für Benutzer-/Rollenverwaltung, systemweite Konfigurationen und besonders geschützte fachliche Grundlagen.

Eine zusätzliche Rolle `Publisher` bzw. „Veröffentlicher“ ist nicht vorgesehen. **Ein Redakteur darf veröffentlichen.**

Automatische AI Tasks sind keine menschliche Benutzerrolle. Sie handeln als technische Akteure mit separat festgelegten, grundsätzlich engeren Rechten.

## 8. Aktions- und Freigabestufen

FIB unterscheidet vier fachliche Aktionsstufen. Sie sind keine Benutzerrollen, sondern kennzeichnen die Tragweite einer Aktion:

- **S0 – Lesen / Analysieren:** keine fachliche Datenänderung,
- **S1 – Vorschlag / Entwurf:** Arbeits- oder KI-Ergebnis ohne verbindliche fachliche Wirkung,
- **S2 – fachlich wirksam ändern:** der bestätigte interne FIB-Datenstand wird verändert,
- **S3 – freigeben / veröffentlichen / normativ aktivieren:** öffentliche oder systemweit regelwirksame Wirkung.

Das Berechtigungsprinzip lautet:

> **Berechtigung ergibt sich aus Rolle × Fachaktion × Objektzustand × erforderlicher Freigabestufe. Der Zugangsweg allein bestimmt die Berechtigung nicht.**

Für denselben angemeldeten Redakteur sollen Web-App und FIB-Chat grundsätzlich dieselben fachlichen Rechte bereitstellen. Unterschiede können aus Bestätigungs-, Bedien- oder Sicherheitsanforderungen entstehen, nicht aus einer pauschalen Beschränkung des Chats.

## 9. Grundmatrix der Berechtigungen

### 9.1 Besucher

Besucher dürfen ausschließlich öffentliche Inhalte und öffentliche Funktionen nutzen. Sie besitzen keine internen Lese-, Schreib-, Freigabe- oder Administrationsrechte.

### 9.2 Redakteur

Ein Redakteur darf im vorgesehenen Workflow insbesondere:

- interne FIB-Daten lesen und analysieren,
- Kandidaten, Vorschläge und Entwürfe erzeugen,
- Meldungsentwürfe bearbeiten,
- Ereignisse bestätigen,
- Vorgänge und Themen bearbeiten,
- Beobachtungsaufträge anlegen und ändern,
- Referenzwissen bestätigen,
- Referenzmaßstäbe vorschlagen und – soweit kein Adminvorbehalt besteht – fachlich bearbeiten,
- Meldungen freigeben und veröffentlichen,
- veröffentlichte Meldungen korrigieren oder zurückziehen, soweit der jeweilige Workflow dies vorsieht.

Diese Rechte gelten grundsätzlich sowohl in der Web-App als auch im FIB-Chat.

### 9.3 Admin

Der Admin besitzt alle Redaktionsrechte und zusätzlich insbesondere Rechte für:

- Benutzer- und Rollenverwaltung,
- administrative Systemkonfiguration,
- Aktivierung oder Deaktivierung besonders geschützter Fachregeln,
- Freigabe besonders geschützter Bestandteile des Referenzrahmens,
- Aktivierung oder Änderung systemweiter Routing-/AI-Task-Konfigurationen,
- sicherheitsrelevante Einstellungen.

Welche Referenzmaßstäbe oder Fachregeln einem ausdrücklichen Adminvorbehalt unterliegen, wird im jeweiligen Fachworkflow festgelegt.

### 9.4 AI Tasks

AI Tasks dürfen insbesondere:

- lesen und analysieren,
- recherchieren,
- Kandidaten und Vorschläge erzeugen,
- Entwürfe vorbereiten,
- Kosten-, Qualitäts- und Plausibilitätsprüfungen ausführen.

AI Tasks dürfen nicht selbstständig:

- Ereignisse fachlich bestätigen,
- fachlich bestätigte redaktionelle Inhalte eigenmächtig überschreiben,
- Meldungen freigeben oder veröffentlichen,
- aktive Fachregeln normativ ändern,
- Benutzer- oder Rollenrechte verändern.

Verbindliches Prinzip:

> **AI Tasks dürfen vorbereiten und vorschlagen, aber keine redaktionelle Entscheidung ersetzen.**

## 10. Bestätigungslogik im FIB-Chat

Die Bestätigungslogik soll Sicherheit gewährleisten, ohne den freien Dialog unnötig zu unterbrechen.

### S0 – Lesen / Analysieren

Keine zusätzliche Bestätigung erforderlich.

### S1 – Vorschlag / Entwurf

Wenn der Benutzer die Erstellung eindeutig beauftragt hat, ist keine zusätzliche Bestätigung erforderlich. Das Ergebnis bleibt Vorschlag oder Entwurf.

### S2 – fachlich wirksame Änderung

Eine klare, eindeutige Handlungsanweisung des berechtigten Redakteurs kann bei risikoarmen S2-Aktionen selbst als ausdrückliche Bestätigung gelten.

Eine zusätzliche Bestätigung ist erforderlich, wenn insbesondere:

- die beabsichtigte Änderung mehrdeutig ist,
- mehrere fachliche Objekte betroffen sind,
- bestätigte bestehende Information überschrieben oder zurückgenommen wird,
- relevante Folgewirkungen entstehen,
- die Aktion aufgrund ihrer Tragweite ausdrücklich als bestätigungspflichtig definiert ist.

In diesen Fällen zeigt der FIB-Chat vor der Ausführung kurz den beabsichtigten Änderungsumfang bzw. den fachlich relevanten Vorher-/Nachher-Zustand.

### S3 – Veröffentlichung / normative Aktivierung

S3-Aktionen erfordern grundsätzlich eine unmittelbare explizite Bestätigung vor der Ausführung.

Dies gilt insbesondere für:

- Veröffentlichung einer Meldung,
- öffentliche Bereitstellung einer zuvor nur intern sichtbaren Fundstelle/Datei,
- Freigabe eines fachlich neuen strukturierten Gesamtstands zur öffentlichen Nutzung, soweit dies den öffentlichen Stand verändert,
- Rücknahme einer veröffentlichten Meldung,
- Aktivierung oder wesentliche Änderung einer Fachregel,
- Aktivierung besonders geschützter Referenzmaßstäbe,
- andere systemweit normative Änderungen.

## 11. Besonders geschützte Aktionen

Unabhängig vom Zugangsweg erhalten fachlich oder administrativ besonders folgenreiche Aktionen eine erhöhte Sicherung. Dazu gehören insbesondere:

- Veröffentlichung und Rücknahme veröffentlichter Inhalte,
- öffentliche Freigabe bislang interner Dateien/Fundstellen,
- Zusammenführung von Ereignissen oder Vorgängen mit fachlichen Folgewirkungen,
- Änderung aktiver Fachregeln,
- Änderung von Benutzerrechten,
- wesentliche Änderung besonders geschützter Bestandteile des Referenzrahmens.

Für solche Aktionen gilt grundsätzlich der Ablauf:

1. Änderung vorbereiten,
2. fachlich relevanten Diff bzw. Wirkung anzeigen,
3. ausdrückliche Bestätigung einholen,
4. serverseitige Rechte-, Regel- und Zustandsprüfung wiederholen,
5. Änderung ausführen,
6. Audit-/Historieneintrag erzeugen.

## 12. Schutz vor konkurrierenden Änderungen

Fachlich wirksame Änderungen dürfen aktuelle Daten nicht stillschweigend durch einen veralteten Bearbeitungsstand überschreiben.

Daher wird für änderbare fachliche Objekte eine Versions- bzw. Optimistic-Concurrency-Prüfung vorgesehen:

- eine Änderung bezieht sich auf einen bekannten Objektstand,
- vor dem Speichern wird geprüft, ob dieser Stand noch aktuell ist,
- bei zwischenzeitlicher Änderung wird nicht blind überschrieben,
- der Benutzer erhält den aktuellen Stand und kann Änderungen prüfen bzw. zusammenführen.

Dieses Prinzip gilt für Web-App und FIB-Chat gleichermaßen.

## 13. Serverseitige Durchsetzung

Benutzeroberfläche oder Sprachmodell entscheiden nicht abschließend über die Zulässigkeit einer Aktion.

Verbindliches Prinzip:

> **Der Benutzer entscheidet fachlich, die KI unterstützt, und die FIB-Fachfunktionen erzwingen serverseitig Rechte, Regeln, Objektzustände, Bestätigungsanforderungen, Versionierung und Audit.**

Jede schreibende oder statusändernde Fachfunktion validiert daher serverseitig mindestens:

- Identität und Rolle des Akteurs,
- erlaubte Fachaktion,
- Objektzustand,
- erforderliche Bestätigungs-/Freigabestufe,
- fachliche Vorbedingungen,
- erwartete Objektversion, soweit relevant.

Auch fachliche Lesezugriffe werden serverseitig auf Rolle, Sichtbarkeit und zulässigen Datenumfang begrenzt.

Die KI darf niemals allein aufgrund eigener Interpretation annehmen, dass eine Aktion zulässig ist.

## 14. KI-Router und Modellunabhängigkeit

Web-App, FIB-Chat und AI Tasks verwenden dieselbe Routinglogik für KI-Aufrufe.

Die Fachfunktion legt die erforderliche Qualitätsklasse fest; der Router wählt daraus ein freigegebenes Modell bzw. einen Provider. Dadurch bleibt die Benutzeroberfläche von konkreten Modellen entkoppelt.

Modelle und Provider können anhand von Qualitätsmessungen, Kosten, Datenschutz, Verfügbarkeit und Fallback-Regeln ausgetauscht werden, ohne den fachlichen Workflow neu zu gestalten.

## 15. Externe KI-Systeme / MCP

Eine zusätzliche MCP-kompatible Anbindung externer KI-Systeme bleibt architektonisch möglich, ist aber **keine MVP-Abhängigkeit** und kein vierter notwendiger Zugangsweg.

Die FIB-Fach-API bzw. Fachfunktionsschicht bleibt die maßgebliche technische Schnittstelle. Ein späterer MCP-Zugang wäre lediglich ein Adapter auf dieselben Funktionen und Sicherheitsregeln.

Die Wiederaufnahme ist im GitHub-Issue **#2 „MCP-Anbindung externer KI-Systeme nach MVP prüfen“** mit konkreten Auslösern dokumentiert.

## 16. Nachvollziehbarkeit

Für fachlich relevante Änderungen muss mindestens nachvollziehbar sein:

- wer bzw. welcher technische Akteur die Aktion ausgelöst hat,
- über welchen Zugangsweg (`web`, `chat`, `automation`) sie erfolgte,
- welche Fachfunktion ausgeführt wurde,
- welches Objekt betroffen war,
- welcher vorherige und neue Objektstand relevant war, soweit vorhanden,
- welche Regel-/Workflow-Version maßgeblich war, soweit relevant,
- ob eine ausdrückliche menschliche Bestätigung erforderlich und erfolgt war,
- Zeitpunkt und Ergebnisstatus.

KI-Aufrufe des FIB-Chats und automatischer AI Tasks werden zusätzlich im gemeinsamen Kosten- und Qualitätsmonitoring erfasst.

Lesezugriffe können gegenüber fachlichen Änderungen mit geringerer Detailtiefe protokolliert werden; sicherheits- oder datenschutzrelevante Zugriffe müssen dennoch nachvollziehbar bleiben.

## 17. Nächster Klärungsschritt

Der fachliche MVP-Funktionskatalog wird in `docs/MVP-Fachfunktionen.md` konsolidiert. Vor der technischen API-/Service-Spezifikation werden noch bestehende Modellinkonsistenzen geschlossen und der Katalog anschließend gegen das konsolidierte Datenmodell auditiert.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.4 | 05.10.2026 | Gemeinsame Fachfunktions-/Service-Schicht als verbindlicher regulärer Lese- und Schreibzugang für Web-App, FIB-Chat und AI Tasks festgelegt; rein technische Betriebszugriffe abgegrenzt. Chat-Orchestrierung mehrerer Fachfunktionen ergänzt, Sichtbarkeitsprüfung für Lesezugriffe sowie öffentliche Fundstellen-/Dateifreigabe und Freigabe strukturierter Gesamtstände in die S3-Logik aufgenommen. Fachfunktionskatalog in eigene Primärquelle `MVP-Fachfunktionen.md` verwiesen. |
| 1.3 | 05.10.2026 | Sicherheits- und Freigabelogik verbindlich festgelegt: Aktionsstufen S0–S3, Grundmatrix für Besucher/Redakteur/Admin/AI Tasks, Bestätigungslogik des FIB-Chats, besonders geschützte Aktionen, Optimistic Concurrency sowie serverseitige Durchsetzung von Rechten, Regeln, Freigaben und Audit. |
| 1.2 | 05.10.2026 | Rollenmodell auf Besucher, Redakteur und Admin konkretisiert. Redakteure dürfen veröffentlichen; zusätzliche Publisher-Rolle verworfen. FIB-Chat darf bei entsprechender Rolle dieselben regulären Freigabe-/Veröffentlichungsfunktionen wie die Web-App nutzen; AI Tasks bleiben davon ausgeschlossen. |
| 1.1 | 05.10.2026 | Drei produktive Zugangswege verbindlich konkretisiert: Redaktions-Web-App, eigener anbieterunabhängiger FIB-Chat und automatische AI Tasks. Gemeinsamer KI-Router, Kosten-/Qualitätsmonitoring und Kostenoptimierung als AI Task ergänzt. MCP als optionale spätere Adapter-Schnittstelle und nicht als MVP-Abhängigkeit abgegrenzt. Entwicklungsarbeit in externen KI-Arbeitsräumen vom produktiven Zugangsmodell getrennt. |
| 1.0 | 05.10.2026 | Drei Arbeitsweisen (automatisch, strukturiert, dialogorientiert) und gemeinsame Fachfunktionsschicht verbindlich festgelegt. Chat als kontrollierter Redaktionszugang definiert; Inhaltsbeschränkung zugunsten aktions- und workflowbezogener Berechtigungen verworfen; direkter unkontrollierter Tabellen-/SQL-Zugriff ausgeschlossen. |
