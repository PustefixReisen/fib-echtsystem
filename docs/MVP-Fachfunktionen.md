# MVP-Fachfunktionen – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

## 2. Gemeinsame Rückgaberegel

Schreibende oder statusändernde Fachfunktionen geben nicht nur Erfolg oder Fehler zurück. Die Rückgabe enthält eine für Web-App und FIB-Chat verständliche Änderungszusammenfassung, insbesondere soweit zutreffend:

- neu angelegt / geändert / unverändert / verworfen,
- fachlich relevante Vorher-/Nachher-Änderungen,
- betroffene Objekte und Beziehungen,
- erkannte Konflikte, Dubletten oder Unsicherheiten,
- ggf. notwendige oder sinnvolle nächste Schritte.

Der FIB-Chat darf mehrere Fachfunktionen zu einem Benutzerauftrag verketten. Die einzelnen Funktionen bleiben dabei separat berechtigungs-, regel- und zustandsgeprüft; der Chat fasst die Teilergebnisse anschließend fachlich verständlich zusammen.

## 3. Lesezugriffe

Neben schreibenden Fachfunktionen werden strukturierte Read-/List-Funktionen vorgesehen, soweit sie für Web-App und FIB-Chat sinnvoll sind.

- `search_fib_context` dient offenen, semantischen Kontextfragen.
- gezielte `get_*`- und `list_*`-Funktionen liefern strukturierte Detail- bzw. Listenansichten, z. B. für AI Tasks, Bilder, Vorgänge oder Themen.

Die genaue technische Aufteilung wird erst in der API-Spezifikation festgelegt; fachlich dürfen dadurch keine parallelen Datenmodelle entstehen.

## 4. Bisher geklärte MVP-Funktionsfamilien

| Funktionsfamilie | Fachliche Kernaktion |
|---|---|
| `search_fib_context` | vorhandenen fachlichen FIB-Kontext lesen und zusammenstellen |
| `register_finding` | registrierte Fundstelle anlegen bzw. neuen/geänderten Recherchefund erfassen |
| `propose_event` | aus bereits registrierten Fundstellen Ereigniskandidat / Aktualisierungsvorschlag ableiten |
| `confirm_event` | Ereigniskandidat fachlich bestätigen bzw. verwerfen |
| `edit_message_draft` | Meldungsentwurf erstellen oder sprachlich bearbeiten |
| `publish_message` | Meldung veröffentlichen, aktualisieren oder zurückziehen |
| `manage_process` | Vorgang anlegen/ändern; Dubletten-Zusammenführung nur als besonders bestätigungspflichtiger Sonderfall |
| `manage_topic` | Thema anlegen/ändern und fachliche Zuordnungen pflegen |
| `manage_observation_task` | Beobachtungsauftrag anlegen, ändern, pausieren oder beenden |
| `propose_reference_change` | FIB-spezifisches Referenzwissen vorschlagen bzw. ändern |
| `propose_reference_measure` | Referenzmaßstab vorschlagen; vor Vorschlag Konsistenz, Abgrenzung, Doppelung und Widerspruch prüfen |
| `manage_ai_task` | AI Task anlegen/ändern/aktivieren/pausieren/beenden; konkrete Läufe bleiben getrennte `AI Task Runs` |
| `manage_image_use` | Bild registrieren bzw. Bildverwendung, Rechte-/Freigabestatus und Zuordnung verwalten |
| `manage_editorial_assessment` | strukturierten Redaktionsstand der Einordnung ändern; Textfassung bleibt davon abgeleitet |
| `manage_open_question` | offene Frage/Wissenslücke anlegen, präzisieren oder als geklärt/verworfen schließen |
| `manage_source` | Quelle anlegen/ändern und Quellenbeobachtungsstatus pflegen |
| `manage_meeting_context` | Sitzung/TOP-Kontext und Zuordnung zu Ereignissen verwalten |

## 5. Wichtige Abgrenzungen

- `register_finding` arbeitet auf der konkreten Fundstelle; `manage_source` auf der Quelle selbst.
- `propose_event` arbeitet nur mit bereits in FIB registrierten Fundstellen. Der FIB-Chat darf bei einer neuen URL/Datei automatisch zuerst `register_finding` und danach `propose_event` aufrufen.
- `confirm_event` bestätigt das Ereignis selbst. Beziehungen zu Meldung, Vorgang oder Thema sind davon fachlich getrennt und werden nur entsprechend Auftrag/Workflow zusätzlich gepflegt.
- `manage_editorial_assessment` ist die fachliche Quelle für strukturierte Einordnung; `edit_message_draft` darf daraus Text erzeugen, aber keine fachlichen Änderungen verdeckt im Text einführen.
- Referenzmaßstäbe werden nur vorgeschlagen, wenn sie gegenüber dem aktiven Referenzrahmen konsistent, hinreichend abgegrenzt und nicht redundant sind.
- AI Tasks dürfen vorbereiten und vorschlagen, aber keine redaktionellen Entscheidungen ersetzen oder eigene Rechte/Kostenlimits selbst erweitern.

## 6. Noch zu konsolidieren

Vor Abschluss von G3 wird geprüft:

- ob alle Funktionsfamilien für das MVP tatsächlich benötigt werden,
- ob einzelne Familien zusammengelegt oder weiter abgegrenzt werden sollten,
- welche korrespondierenden `get_*`-/`list_*`-Funktionen fachlich nötig sind,
- ob `manage_meeting_context` im MVP ausreichend schlank bleibt,
- wie die Funktionsfamilien in der späteren API technisch benannt und in Schemas umgesetzt werden.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 05.10.2026 | Fachfunktionskatalog als eigene Primärquelle angelegt. Grundsatz „Fachfunktionen referenzieren das Datenmodell statt es zu duplizieren“, gemeinsame Rückgaberegel, Funktionsverkettung im FIB-Chat, Read-/List-Prinzip und bisher geklärte MVP-Funktionsfamilien dokumentiert. |
