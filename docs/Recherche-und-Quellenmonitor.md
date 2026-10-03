# Recherche und Quellenmonitor – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 03.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für Quellenbeobachtung, Quellenentdeckung, Entdeckungslogik und technische Übergabe neuer oder geänderter Fundstellen in den redaktionellen FIB-Prozess.

Der Demonstrator-Quellenmonitor wird **nicht technisch 1:1 übernommen**. Übernommen wird seine fachliche Funktion.

## 2. Grundprinzip

Der Quellenmonitor ist ein vorgelagerter Erfassungsbaustein. Er:

- überwacht bekannte Quellen technisch auf neue oder geänderte Fundstellen,
- sucht zusätzlich aktiv nach bislang unbekannten relevanten Quellen,
- speichert neue oder geänderte Fundstellen persistent als Recherchekandidaten,
- veröffentlicht nichts selbst,
- trennt technische Erfassung, KI-Auswertung, redaktionelle Prüfung und Veröffentlichung.

Der Quellenmonitor besteht damit verbindlich aus zwei komplementären Teilen:

1. **Quellenbeobachtung** – bekannte Quellen und Adressen werden möglichst ohne KI technisch auf Veränderungen überwacht; erst neue oder geänderte Inhalte werden semantisch durch KI analysiert.
2. **Quellenentdeckung** – FIB sucht aktiv nach bislang nicht bekannten relevanten Quellen. Diese offene semantische Suche benötigt KI-Unterstützung.

Beide Teile gehören fachlich zum Quellenmonitor. Neue geeignete Quellen aus der Quellenentdeckung können nach redaktioneller Prüfung in den Bestand bekannter Quellen übernommen und künftig technisch beobachtet werden.

## 3. Zwei komplementäre Recherchewege

FIB kombiniert verbindlich:

1. **themen- und vorgangsbezogene Recherche** zu bekannten Sachzusammenhängen,
2. **themenunabhängige Entdeckung** über Pflichtquellen, Ortsbezug, breite Übersichten und periodische Rückblicke.

Neue relevante Sachverhalte dürfen nicht davon abhängen, dass ihre Begriffe bereits im FIB-Bestand bekannt sind. Der Referenzfall hierfür ist „Kiesgrund“.

Diese fachlichen Recherchewege können sowohl in der Beobachtung bekannter Quellen als auch bei der Entdeckung neuer Quellen eine Rolle spielen.

## 4. Quellenklassen

Mindestens unterstützt werden:

- Gemeinde Feldkirchen,
- Ratsinformationssystem / SessionNet,
- Landkreis, Behörden und öffentliche Einrichtungen,
- regionale und lokale Presse,
- relevante Nachbargemeinden,
- Vorhabenträger und kommunale Unternehmen,
- Vereine, Verbände, Initiativen und Bürgerinitiativen,
- Parteien und Wählervereinigungen,
- Fach-, Rechts- und Wissenschaftsquellen,
- dokumentierte Praxisbeispiele anderer Kommunen.

Quellen werden als **Pflichtquelle** oder **themen-/vorgangsabhängige Quelle** klassifiziert.

## 5. Quellenbeobachtung: bekannte Quellen und Direktprüfung

Pflichtquellen und andere bekannte Quellen werden unabhängig von Suchmaschinen direkt geprüft. Dazu gehören insbesondere zentrale Gemeinde- und RIS-Einstiege sowie weitere regelmäßig relevante Übersichtsseiten.

Der Echtbetrieb muss auch Änderungen erkennen können, wenn:

- eine Datei unter derselben URL ersetzt wird,
- eine neue Unterseite ohne Suchmaschinenindexierung erscheint,
- ein Dokument im RIS freigegeben wird, bevor oder ohne dass es in einer Tagesordnung auffällt.

RIS-Dokumentfreigaben werden deshalb unabhängig von Tagesordnungen als Recherchekandidaten erfasst. Eine Dokumentfreigabe allein beweist noch keinen konkreten TOP oder Sitzungstermin.

Für bekannte Quellen gilt der Grundsatz:

> **Technische Änderungsfeststellung ohne KI, semantische Analyse nur bei neuer oder geänderter Fundstelle.**

Ein unveränderter bekannter Quellenbestand löst grundsätzlich keinen erneuten KI-Aufruf aus.

## 6. Quellenentdeckung: neue Quellen finden

Neben der Beobachtung bekannter Adressen muss FIB aktiv nach bislang unbekannten Quellen suchen. Ziel ist, neue relevante Informationsräume zu entdecken, die durch reine Änderungsüberwachung nicht auffindbar wären.

Mögliche Ergebnisse sind zum Beispiel:

- neue Projektseiten eines Vorhabenträgers,
- neue Unterseiten von Behörden oder Kommunen,
- neue Bürgerinitiativen oder Verbände,
- neu veröffentlichte Fachstudien oder Planungsunterlagen,
- relevante Presse- oder Fachquellen, die bisher nicht beobachtet wurden.

Die Quellenentdeckung arbeitet offen genug, dass nicht nur bereits bekannte FIB-Begriffe wiedergefunden werden. Sie nutzt Ortsbezug, Such- und Beobachtungsfelder, bestehende Vorgänge und Themen sowie periodische breite Suchläufe.

Für die Quellenentdeckung ist KI ein verpflichtender Bestandteil, weil Relevanz, Neuheit und möglicher Feldkirchen-Bezug semantisch bewertet werden müssen.

Ablauf:

`offener Suchauftrag → KI-gestützte Suche → Quellenkandidat → Relevanz-/Qualitätsprüfung → redaktionelle Bestätigung → ggf. Aufnahme als bekannte Quelle`

Die Aufnahme als bekannte Quelle ist keine automatische Folge eines Suchtreffers.

## 7. Technische Erkennungslogik

Das Echtsystem muss mindestens unterstützen:

- konfigurierbare Quellen und Suchachsen,
- persistente Speicherung des zuletzt bekannten Zustands,
- Erkennung neuer Links und Dokumente,
- Erkennung geänderter Dokumente, möglichst auch per Inhalts-Hash,
- Deduplizierung,
- dauerhaften Recherche- und Verarbeitungsstatus,
- Zuordnung zu Orten, Bezugsobjekten, Vorgängen und Themen,
- Protokollierung von Fehlern und nicht abschließend prüfbaren Quellen,
- Kennzeichnung, ob ein Recherchekandidat aus Quellenbeobachtung oder Quellenentdeckung stammt.

## 8. Orts- und Themenabdeckung

Die Recherche arbeitet mindestens auf zwei Achsen:

- **Ortsabdeckung:** Feldkirchen, relevante Nachbargemeinden, Landkreis und funktional verbundene Räume,
- **Themenabdeckung:** Suchbegriffe und Quellenbeziehungen aus laufenden Vorgängen und bestätigten Themen.

Beide Achsen ergänzen sich; keine ersetzt die andere.

## 9. Presse

Presseübersichten dienen der Kandidatenerkennung, nicht der automatischen Veröffentlichung.

Bei formalen Entscheidungsständen werden amtliche Primärquellen bevorzugt. Presse kann Kontext, Resonanz, Reaktionen und zusätzliche Tatsachen erschließen.

## 10. Bürgerinitiativen, Vereine und politische Akteure

Bei substanziellen Aussagen oder Forderungen wird gezielt nach Reaktionen und Gegenpositionen gesucht.

Parteiquellen und Stellungnahmen von Interessengruppen werden als Positionsquellen behandelt. Überprüfbare Sachangaben werden möglichst unabhängig oder amtlich verifiziert.

## 11. Recherchekandidat → redaktioneller Prozess

Der Übergang lautet:

`Fundstelle → Kandidat → KI-Analyse → Relevanzprüfung → Ereignis/Update → Vorgangs-/Themenbezug → Entwurf → redaktionelle Prüfung → Veröffentlichung`

Eine Fundstelle erzeugt nicht automatisch eine Meldung.

Für qualitätskritische Eingangsschritte – insbesondere Quellenentdeckung, semantische Analyse neuer/geänderter Fundstellen und Ereigniserkennung – gilt: KI wird gezielt eingesetzt, weil sie fachlich erforderlich ist. Die Modellauswahl richtet sich zuerst nach der nachgewiesenen Ergebnisqualität; Kosten werden erst innerhalb ausreichend qualifizierter Modelle optimiert.

## 12. Fehlerbehandlung

Technische Fehler werden als solche protokolliert. Aus einem Abruffehler oder fehlenden Suchtreffer darf nicht geschlossen werden, dass keine neue Information existiert.

Bei Pflichtquellen muss ein wiederkehrender Abruffehler sichtbar eskaliert werden. Spätere technische Fallbacks, z. B. Browserautomation, werden in G5 entschieden.

Auch ein erfolgloser Lauf der Quellenentdeckung beweist nicht, dass keine neue relevante Quelle existiert. Suchläufe werden deshalb wiederholbar, nachvollziehbar und mit Suchraum bzw. Informationsstand protokolliert.

## 13. Modellunabhängigkeit und Kosteneffizienz

Die Quellen- und Statuslogik ist soweit möglich als technische Geschäftsregel umzusetzen. KI wird für semantische Einordnung und offene Quellenentdeckung eingesetzt, nicht für Basispersistenz, Statusverwaltung oder technische Änderungsfeststellung.

Kosteneffizienz wird primär dadurch erreicht, dass:

- unveränderte bekannte Quellen keine KI-Analyse auslösen,
- nur neue oder geänderte Fundstellen semantisch analysiert werden,
- offene Quellenentdeckung in geeigneten Intervallen und Suchräumen erfolgt,
- Ergebnisse persistent gespeichert und nicht ohne fachlichen Anlass erneut erzeugt werden.

Wo KI fachlich erforderlich ist, hat die geforderte Ergebnisqualität Vorrang vor dem niedrigsten Modellpreis.

## 14. Abgrenzung

- Fachliche Aufnahme- und Relevanzregeln: `docs/Fachkonzept.md`
- KI-Arbeitsregeln: `docs/KI-Leitfaden.md`
- KI-Qualität und Modellwahl: `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
- KI-Kosten und Routing: `docs/KI-Betrieb-und-Kosten.md`
- spätere technische Architektur: G5 / Architekturdokumentation
- konkrete Datenstrukturen: G3 / Datenmodell

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 03.10.2026 | Quellenmonitor verbindlich in Quellenbeobachtung bekannter Quellen und KI-gestützte Entdeckung neuer Quellen gegliedert; KI-Einsatz auf semantisch erforderliche Schritte begrenzt und Qualitätsvorrang bei diesen Eingangsschritten festgelegt. |
| 1.0 | 30.09.2026 | Demonstrator-Dokumente `FIB-Quellenmonitor.md` und `FIB-Quellenmonitor-Architektur.md` fachlich konsolidiert und auf Echtsystem-Zielbild überführt. |
