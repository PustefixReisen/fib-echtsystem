# Recherche und Quellenmonitor – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für Quellenbeobachtung, Entdeckungslogik und technische Übergabe neuer oder geänderter Fundstellen in den redaktionellen FIB-Prozess.

Der Demonstrator-Quellenmonitor wird **nicht technisch 1:1 übernommen**. Übernommen wird seine fachliche Funktion.

## 2. Grundprinzip

Der Quellenmonitor ist ein vorgelagerter Erfassungsbaustein. Er:

- erkennt neue oder geänderte Fundstellen,
- speichert sie persistent als Recherchekandidaten,
- veröffentlicht nichts selbst,
- trennt technische Erfassung, KI-Auswertung, redaktionelle Prüfung und Veröffentlichung.

## 3. Zwei komplementäre Recherchewege

FIB kombiniert verbindlich:

1. **themen- und vorgangsbezogene Recherche** zu bekannten Sachzusammenhängen,
2. **themenunabhängige Entdeckung** über Pflichtquellen, Ortsbezug, breite Übersichten und periodische Rückblicke.

Neue relevante Sachverhalte dürfen nicht davon abhängen, dass ihre Begriffe bereits im FIB-Bestand bekannt sind. Der Referenzfall hierfür ist „Kiesgrund“.

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

## 5. Pflichtquellen und Direktprüfung

Pflichtquellen werden unabhängig von Suchmaschinen direkt geprüft. Dazu gehören insbesondere zentrale Gemeinde- und RIS-Einstiege sowie weitere regelmäßig relevante Übersichtsseiten.

Der Echtbetrieb muss auch Änderungen erkennen können, wenn:

- eine Datei unter derselben URL ersetzt wird,
- eine neue Unterseite ohne Suchmaschinenindexierung erscheint,
- ein Dokument im RIS freigegeben wird, bevor oder ohne dass es in einer Tagesordnung auffällt.

RIS-Dokumentfreigaben werden deshalb unabhängig von Tagesordnungen als Recherchekandidaten erfasst. Eine Dokumentfreigabe allein beweist noch keinen konkreten TOP oder Sitzungstermin.

## 6. Technische Erkennungslogik

Das Echtsystem muss mindestens unterstützen:

- konfigurierbare Quellen und Suchachsen,
- persistente Speicherung des zuletzt bekannten Zustands,
- Erkennung neuer Links und Dokumente,
- Erkennung geänderter Dokumente, möglichst auch per Inhalts-Hash,
- Deduplizierung,
- dauerhaften Recherche- und Verarbeitungsstatus,
- Zuordnung zu Orten, Bezugsobjekten, Vorgängen und Themen,
- Protokollierung von Fehlern und nicht abschließend prüfbaren Quellen.

## 7. Orts- und Themenabdeckung

Die Recherche arbeitet mindestens auf zwei Achsen:

- **Ortsabdeckung:** Feldkirchen, relevante Nachbargemeinden, Landkreis und funktional verbundene Räume,
- **Themenabdeckung:** Suchbegriffe und Quellenbeziehungen aus laufenden Vorgängen und bestätigten Themen.

Beide Achsen ergänzen sich; keine ersetzt die andere.

## 8. Presse

Presseübersichten dienen der Kandidatenerkennung, nicht der automatischen Veröffentlichung.

Bei formalen Entscheidungsständen werden amtliche Primärquellen bevorzugt. Presse kann Kontext, Resonanz, Reaktionen und zusätzliche Tatsachen erschließen.

## 9. Bürgerinitiativen, Vereine und politische Akteure

Bei substanziellen Aussagen oder Forderungen wird gezielt nach Reaktionen und Gegenpositionen gesucht.

Parteiquellen und Stellungnahmen von Interessengruppen werden als Positionsquellen behandelt. Überprüfbare Sachangaben werden möglichst unabhängig oder amtlich verifiziert.

## 10. Recherchekandidat → redaktioneller Prozess

Der Übergang lautet:

`Fundstelle → Kandidat → KI-Analyse → Relevanzprüfung → Ereignis/Update → Vorgangs-/Themenbezug → Entwurf → redaktionelle Prüfung → Veröffentlichung`

Eine Fundstelle erzeugt nicht automatisch eine Meldung.

## 11. Fehlerbehandlung

Technische Fehler werden als solche protokolliert. Aus einem Abruffehler oder fehlenden Suchtreffer darf nicht geschlossen werden, dass keine neue Information existiert.

Bei Pflichtquellen muss ein wiederkehrender Abruffehler sichtbar eskaliert werden. Spätere technische Fallbacks, z. B. Browserautomation, werden in G5 entschieden.

## 12. Modellunabhängigkeit

Die Quellen- und Statuslogik ist soweit möglich als technische Geschäftsregel umzusetzen. KI wird für semantische Einordnung eingesetzt, nicht für Basispersistenz, Statusverwaltung oder technische Änderungsfeststellung.

## 13. Abgrenzung

- Fachliche Aufnahme- und Relevanzregeln: `docs/Fachkonzept.md`
- KI-Arbeitsregeln: `docs/KI-Leitfaden.md`
- spätere technische Architektur: G5 / Architekturdokumentation
- konkrete Datenstrukturen: G3 / Datenmodell

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 30.09.2026 | Demonstrator-Dokumente `FIB-Quellenmonitor.md` und `FIB-Quellenmonitor-Architektur.md` fachlich konsolidiert und auf Echtsystem-Zielbild überführt. |
