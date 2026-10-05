# MVP-Fachfunktionen – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für den fachlichen Katalog der MVP-Fachfunktionen von FIB.

Es beschreibt **nicht erneut das fachliche Datenmodell**. Entitäten, Felder, Kardinalitäten, Status und fachliche Datenregeln werden ausschließlich in den dafür zuständigen Primärdokumenten – insbesondere `docs/Datenmodell.md` – definiert.

Verbindlicher Grundsatz:

> **Fachfunktionen referenzieren das Datenmodell; sie definieren dessen Datenstruktur nicht erneut.**

Damit gilt „ein Sachverhalt – eine verbindliche Quelle“ auch für die Schnittstellenbeschreibung.

Für eine Fachfunktion werden deshalb nur die Aspekte beschrieben, die für ihr Verhalten erforderlich sind:

1. welche bereits definierten FIB-Daten sie liest,
2. welche bereits definierten FIB-Daten bzw. Zustände sie verändert,
3. welche fachliche Aktion sie auslöst,
4. welche fachlich verständliche Rückgabe sie liefert,
5. welche Rollen, Aktions-/Freigabestufen und Bestätigungsregeln gelten.

Technische JSON-Schemas, konkrete API-Endpunkte und Datenbankabbildungen werden erst in der technischen Modellierung festgelegt und aus diesem Fachvertrag sowie dem Datenmodell abgeleitet.

## 2. Stellung der Fachfunktionen in der Architektur

Die Fachfunktionen sind **keine Chat-spezifische Schnittstelle**. Sie bilden die gemeinsame fachliche Service-Schicht des produktiven FIB-Systems.

Reguläre fachliche Lese- und Schreibzugriffe aus

- Redaktions-Web-App,
- FIB-Chat und
- AI Tasks

werden über diese gemeinsame Fachfunktions-/Service-Schicht ausgeführt. Dadurch gelten dieselben fachlichen Regeln unabhängig vom Zugangsweg.

Direkte technische Datenbankzugriffe bleiben für rein technische Betriebsaufgaben wie Migration, Backup, Wiederherstellung oder Wartung möglich. Sie sind kein regulärer fachlicher Benutzerzugriff und dürfen die fachlichen Regeln nicht als alternativen Arbeitsweg umgehen.

## 3. Gemeinsame Rückgaberegel

Schreibende oder statusändernde Fachfunktionen geben nicht nur Erfolg oder Fehler zurück. Die Rückgabe enthält eine für Web-App und FIB-Chat verständliche Änderungszusammenfassung, insbesondere soweit zutreffend:

- neu angelegt / geändert / unverändert / verworfen,
- fachlich relevante Vorher-/Nachher-Änderungen,
- betroffene Objekte und Beziehungen,
- erkannte Konflikte, Dubletten oder Unsicherheiten,
- ggf. notwendige oder sinnvolle nächste Schritte.

Der FIB-Chat darf mehrere Fachfunktionen zu einem Benutzerauftrag verketten. Die einzelnen Funktionen bleiben dabei separat berechtigungs-, regel- und zustandsgeprüft; der Chat fasst die Teilergebnisse anschließend fachlich verständlich zusammen.

## 4. Lesezugriffe

Für fachliche Lesezugriffe gelten zwei komplementäre Muster:

1. `search_fib_context` für offene, semantische und objektübergreifende Kontextfragen,
2. strukturierte `get_*`- und `list_*`-Funktionen für eindeutige Detail- und Listenabfragen.

Die `get_*`-/`list_*`-Funktionen werden nicht als jeweils eigenständige fachliche Konzepte modelliert, sondern konsistent aus den vorhandenen Fachobjekten abgeleitet. Für alle im MVP redaktionell oder betrieblich relevanten Objekte muss mindestens ein strukturierter Detailzugriff möglich sein; für bestandsorientierte Objekte zusätzlich ein geeigneter Listenzugriff.

Typische Familien sind insbesondere Ereignisse, Meldungen, Vorgänge, Themen, Beobachtungsaufträge, offene Fragen, Quellen, Fundstellen, Sitzungen/TOPs, Bilder, Referenzwissen, Referenzmaßstäbe, AI Tasks und AI Task Runs.

Die genaue technische Aufteilung, Filterung und Benennung wird erst in der API-Spezifikation festgelegt.

## 5. Konsolidierter MVP-Funktionskatalog

Der Katalog wird nach fachlichen Arbeitsbereichen strukturiert. Eine Funktionsfamilie kann später technisch aus mehreren Endpunkten oder Serviceoperationen bestehen; umgekehrt ist nicht jedes interne Hilfsverfahren eine eigene Fachfunktion.

### 5.1 Recherche, Quellen und Fundstellen

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `search_fib_context` | vorhandenen fachlichen FIB-Kontext semantisch lesen und zusammenstellen |
| `run_research` | einen manuellen, beobachtungsbezogenen oder offenen Recherchelauf nach den geltenden Recherche- und Relevanzregeln ausführen und dessen Herkunft nachvollziehbar halten |
| `manage_source` | Quelle anlegen/ändern und ihren fachlichen Beobachtungsstatus pflegen |
| `register_finding` | konkrete Fundstelle bzw. neuen/geänderten Recherchefund erfassen oder bestehenden Fund erkennen |
| `manage_finding_access` | Sichtbarkeit und öffentliche Bereitstellung einer gespeicherten Fundstelle/Datei kontrolliert ändern; öffentliche Freigabe ist eine S3-Aktion |

`run_research` erzeugt nicht unmittelbar bestätigte Ereignisse oder Veröffentlichungen. Ergebnisse durchlaufen weiterhin Fundstellen-, Relevanz- und Ereigniskandidatenlogik.

### 5.2 Ereignis und Meldung

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `propose_event` | aus bereits registrierten Fundstellen einen Ereigniskandidaten bzw. eine sachliche Präzisierung vorschlagen |
| `confirm_event` | Ereigniskandidat fachlich bestätigen, verwerfen oder einen bestätigten Ereignisstand nach den geltenden Regeln korrigieren/zurücknehmen |
| `edit_message_draft` | Meldungsentwurf erstellen oder sprachlich bearbeiten, ohne verdeckte Änderung des strukturierten Fachstands |
| `approve_message` | Meldungsentwurf fachlich/redaktionell in den Status `freigegeben` überführen bzw. Freigabe zurücknehmen |
| `publish_message` | freigegebene Meldung veröffentlichen, eine veröffentlichte Fassung aktualisieren oder eine Veröffentlichung kontrolliert zurückziehen |

`approve_message` und `publish_message` bleiben getrennt, weil das Datenmodell `freigegeben` und `veröffentlicht` ausdrücklich als unterschiedliche Zustände definiert.

### 5.3 Vorgang, Thema und strukturierte Einordnung

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `manage_process` | Vorgang anlegen/ändern, Status und fachliche Beziehungen pflegen; Zusammenführung nur als besonders geschützter Sonderfall |
| `manage_topic` | Thema anlegen/ändern, Abgrenzung und fachliche Beziehungen pflegen; Dublettprüfung vor Neuanlage |
| `manage_editorial_assessment` | strukturierten Redaktionsstand und seine fachlichen Bestandteile entsprechend dem Datenmodell bearbeiten |
| `release_editorial_state` | einen bestätigten strukturierten Gesamtstand eines Vorgangs oder Themas als aktuellen freigegebenen Stand aktivieren; erforderlichenfalls neue Gesamtversion erzeugen |
| `manage_open_question` | offene Frage/Wissenslücke anlegen, präzisieren und ihren fachlichen sowie Bearbeitungsstatus ändern |
| `manage_observation_task` | Beobachtungsauftrag anlegen, ändern, aktivieren, pausieren oder beenden |

`release_editorial_state` ist von der Bearbeitung getrennt, weil fachliche Bearbeitung und der öffentlich bzw. redaktionell maßgebliche freigegebene Gesamtstand unterschiedliche Wirkungen haben.

### 5.4 Referenzwissen und Referenzrahmen

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `propose_reference_change` | neues oder geändertes FIB-spezifisches Referenzwissen als Vorschlag anlegen |
| `review_reference_change` | Referenzwissensvorschlag bestätigen, verwerfen oder bestätigtes Referenzwissen kontrolliert zurücknehmen |
| `propose_reference_measure` | neuen oder geänderten Referenzmaßstab nach Konsistenz-, Abgrenzungs-, Redundanz- und Widerspruchsprüfung vorschlagen |
| `manage_reference_measure_status` | vorgeschlagenen Referenzmaßstab aktivieren, versioniert ersetzen oder außer Kraft setzen; geschützte normative Änderungen unterliegen S3/Admin-Regeln |

Ein neuer Referenzmaßstab wird nur vorgeschlagen, wenn er gegenüber dem bestehenden aktiven Referenzrahmen konsistent, hinreichend abgegrenzt und nicht redundant ist.

### 5.5 Sitzung und Entscheidungskontext

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `manage_meeting_context` | Sitzung, TOP und die dazugehörigen fachlichen Verfahrens-/Entscheidungszusammenhänge entsprechend dem Sitzungs- und Beschlussmodell pflegen |

Die Funktion bildet einen fachlichen Aggregatbereich. Sitzung, TOP, Beschlusspunkt, Fassung und Abstimmung müssen deshalb nicht vorsorglich jeweils eigene CRUD-Funktionsfamilien erhalten. Unsichere Zuordnungen oder semantische Ableitungen werden als Vorschlag behandelt und benötigen die im Sitzungsmodell vorgesehene redaktionelle Prüfung.

### 5.6 Bilder

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `manage_image_use` | Bild registrieren und seine konkrete Verwendung, Rechte-/Freigabestatus und Zuordnung entsprechend dem Bildmodell verwalten |

Bild und Bildverwendung bleiben getrennte Datenobjekte; die gemeinsame Funktionsfamilie darf beide in einem Benutzerauftrag orchestrieren.

### 5.7 Vertiefungsinhalte „Mehr wissen?“

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `manage_deep_dive_content` | redaktionell nutzbare „Mehr wissen?“-Fragen und gespeicherte, quellengebundene Antworten erzeugen, aktualisieren und freigeben |

Diese Funktion ist von `manage_open_question` zu unterscheiden: Eine offene Frage beschreibt eine Wissenslücke von FIB; eine „Mehr wissen?“-Frage ist ein öffentliches Vertiefungsangebot für Besucher.

Die endgültige fachliche Datenstruktur dieses Bereichs ist vor technischer Implementierung noch im Datenmodell zu vervollständigen.

### 5.8 AI Tasks

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `manage_ai_task` | AI Task anlegen/ändern/aktivieren/pausieren/beenden; konkrete Ausführungen bleiben getrennte `AI Task Runs` |

Die technische Ausführung und Orchestrierung eines AI Tasks ist Betriebslogik und keine zusätzliche redaktionelle Fachfunktion. Ein Task Run nutzt die ihm erlaubten Fachfunktionen und wird nachvollziehbar protokolliert.

## 6. Wichtige Abgrenzungen

- `register_finding` arbeitet auf der konkreten Fundstelle; `manage_source` auf der Quelle selbst.
- `manage_finding_access` ändert die öffentliche Bereitstellung einer Fundstelle, nicht deren sachlichen Inhalt.
- `propose_event` arbeitet nur mit bereits in FIB registrierten Fundstellen. Der FIB-Chat darf bei einer neuen URL/Datei automatisch zuerst `register_finding` und danach `propose_event` aufrufen.
- `confirm_event` bestätigt das Ereignis selbst. Beziehungen zu Meldung, Vorgang oder Thema sind davon fachlich getrennt und werden nur entsprechend Auftrag/Workflow zusätzlich gepflegt.
- `edit_message_draft`, `approve_message` und `publish_message` bilden Bearbeitung, redaktionelle Freigabe und öffentliche Veröffentlichung getrennt ab.
- `manage_editorial_assessment` verändert den strukturierten Fachstand; `release_editorial_state` bestimmt den maßgeblichen freigegebenen Gesamtstand; die Textfassung bleibt daraus abgeleitete Darstellung.
- `manage_open_question` betrifft interne fachliche Wissenslücken; `manage_deep_dive_content` das öffentliche Vertiefungsangebot „Mehr wissen?“.
- `propose_reference_change` und `review_reference_change` trennen KI-/Redaktionsvorschlag von fachlicher Wirksamkeit.
- `propose_reference_measure` und `manage_reference_measure_status` trennen Vorschlag von normativer Aktivierung.
- AI Tasks dürfen vorbereiten und vorschlagen, aber keine redaktionellen Entscheidungen ersetzen oder eigene Rechte/Kostenlimits selbst erweitern.

## 7. Vollständigkeitsprüfung

Der konsolidierte Katalog deckt für die fachlich relevanten MVP-Bereiche jeweils die erforderlichen Handlungskategorien ab:

- Lesen/Suchen,
- Recherche/Erfassung,
- fachliche Bestätigung,
- Bearbeitung,
- Beziehungen und Status/Lebenszyklus,
- Freigabe/Veröffentlichung,
- Historisierung/Audit über die gemeinsame Serviceschicht.

Nicht als eigene Fachfunktionsfamilien geführt werden:

- technische Migrationen, Backups und Wartungsoperationen,
- technische AI-Task-Orchestrierung,
- interne Hash-, Deduplizierungs- oder Crawler-Hilfsfunktionen,
- technische Benutzeroberflächenaktionen ohne eigene fachliche Wirkung,
- reine Audit-/Logging-Schreiboperationen, die automatisch aus Fachaktionen entstehen.

Benutzer-/Rollenverwaltung, Systemkonfiguration und Routingadministration gehören in eine getrennte administrative Servicefamilie und nicht in den fachlichen MVP-Katalog.

## 8. Noch offene G3-Punkte mit Einfluss auf die spätere Schnittstelle

### 8.1 Sitzungsmodell konsolidieren

Zwischen `docs/Datenmodell.md` und `docs/Sitzungs-und-Beschlussmodell.md` besteht derzeit eine Abweichung zur Frage, ob `Meldung ↔ Sitzung` bzw. `Meldung ↔ TOP` als eigenständige Beziehungen gespeichert werden oder ausschließlich über `Meldung → Ereignis → TOP → Sitzung` abgeleitet werden.

Da `docs/Sitzungs-und-Beschlussmodell.md` für seinen Teilbereich ausdrücklich Vorrang beansprucht, muss dieser Punkt vor Abschluss von G3 in die nächste konsolidierte Fassung des Gesamtdatenmodells übernommen oder bewusst korrigiert werden. Der Funktionskatalog legt diese Datenmodellentscheidung nicht eigenständig fest.

### 8.2 „Mehr wissen?“ im Datenmodell vervollständigen

`Mehr wissen?` ist fachlich vorgesehen, aber die persistente Struktur von Frage, gespeicherter Antwort, Quellenbezug, Aktualitätsstand und Freigabe ist noch nicht in derselben Tiefe modelliert wie die übrigen Kernobjekte. Dies ist vor technischer API-Spezifikation nachzuholen.

### 8.3 Beobachtungsauftrag in das Gesamtdatenmodell übernehmen

Die fachliche Konzeption des Beobachtungsauftrags ist in der Recherchearchitektur bereits geklärt. Das Gesamtdatenmodell führt diesen Punkt in Version 2.1 noch als offen. Vor Abschluss von G3 ist die bereits getroffene Entscheidung dort konsistent nachzuziehen.

## 9. Nächster Schritt

Der Funktionsumfang wird nicht weiter durch Einzelbesprechung technischer Funktionsnamen erweitert. Als nächster G3-Schritt werden die unter Abschnitt 8 genannten Modellinkonsistenzen geschlossen. Danach wird der MVP-Funktionskatalog gegen die konsolidierte Datenmodellfassung abschließend auditiert und für die technische API-/Service-Spezifikation eingefroren.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 05.10.2026 | Funktionskatalog systematisch aus Datenmodell, Recherche-/Quellenmodell, Redaktionsworkflow und Zugriffs-/Sicherheitsarchitektur abgeleitet. Fehlende Funktionen für Recherchelauf, Fundstellenfreigabe, Meldungsfreigabe, Freigabe strukturierter Redaktionsstände sowie Bestätigung von Referenzwissen/-maßstäben ergänzt. `Mehr wissen?` als eigene Funktionsfamilie aufgenommen. Read-/List-Prinzip vereinheitlicht, technische/administrative Funktionen abgegrenzt und drei offene G3-Konsolidierungspunkte dokumentiert. |
| 1.0 | 05.10.2026 | Fachfunktionskatalog als eigene Primärquelle angelegt. Grundsatz „Fachfunktionen referenzieren das Datenmodell statt es zu duplizieren“, gemeinsame Rückgaberegel, Funktionsverkettung im FIB-Chat, Read-/List-Prinzip und bisher geklärte MVP-Funktionsfamilien dokumentiert. |
