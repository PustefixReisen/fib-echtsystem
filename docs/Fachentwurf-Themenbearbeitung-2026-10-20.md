# Fachentwurf: Themenauswahl und Themenbearbeitung

**Stand:** 20.10.2026 · **Status:** Fachentwurf zur Abstimmung, keine Freigabe zur technischen Umsetzung

## 1. Herkunft und Geltung

Ausgangsbasis: redaktionelle Skizze `Themenbearbeitung.md` vom 20.10.2026 sowie die anschließende fachliche Abstimmung zu Beitrag, Freigabe, Versionierung und Wiederaufnahme. Abgleich mit `docs/Themen-und-Vorgangslogik.md` v1.5, `docs/Datenmodell.md` v3.0 und `docs/Begriffe.md`. Dieser Entwurf ändert die Primärdokumente **noch nicht**; abweichende Regeln sind ausdrücklich als klärungsbedürftig ausgewiesen.

Die Themenbearbeitung ist eine dauerhaft wieder aufrufbare Objektbearbeitung, kein linear verpflichtender Workflow. Das Bedienprinzip soll später auf Vorgänge, Meldungen und ggf. Sitzungen übertragbar sein.

## 2. Themenauswahl (Navigation „Themen“)

- Liste aller für den Benutzer zugänglichen Themen, filter- und durchsuchbar nach dem bereits vereinbarten Filterschema; neue Filter werden hier nicht vorweggenommen.
- Auswahl eines Eintrags führt zur dauerhaften Themenbearbeitung.
- Aktion „Neues Thema“ im Kartenkopf führt zur Themenbearbeitung eines neuen Entwurfs; fachliche Dublettprüfung bleibt erforderlich.
- Zurück über Breadcrumb oder Zurück-Aktion zur Themenliste.

## 3. Themenbearbeitung: drei dauerhaft erreichbare Bereiche

### 3.1 Themadefinition

- Titel, Leitfrage, Erläuterung/Beschreibung; Ausgestaltung der bereits dokumentierten internen Themendefinition (u. a. lokaler Bezug, Perspektiven, Abgrenzung) gemäß Primärdokument, nicht stillschweigend weglassen.
- Themenstatus und redaktionelle Koordination/Zuständigkeit bearbeiten.
- Änderung einer bestätigten Themendefinition auch später möglich, fachliche Historie erhalten.
- Bei bislang nie veröffentlichten Themen ohne aktuell wirksame Freigabe: Aktion „Thema löschen“, mit expliziter Bestätigung. Die zugehörigen Vorgänge/Ereignisse bleiben unverändert; Lösch-/Auditregeln im Datenmodell präzisieren.

### 3.2 Lokale Bezüge (Oberflächenbegriff statt „Beziehungen“)

- Gemeinsame Liste der dem Thema zugehörigen, vorgeschlagenen oder ausgewählten **Vorgänge und direkten zusätzlichen Ereignisse**; Objekttyp über Icon unterscheidbar.
- Primärregel bleibt: Vorgangsauswahl übernimmt zugehörige Ereignisse in die Themenanalyse; einzelne Ereignisse nur als direkte **Zusatzbezüge**; keine doppelte faktische Gewichtung.
- Listeneintrag: Objektbezeichnung/-typ, knappe Begründung, Zuordnungsstatus, Bearbeitungsaktion (Dialog „Zuordnung bearbeiten“).
- Im Kartenkopf Aktion „Bezug auswählen“ öffnet Suche nach vorhandenen Vorgängen und Ereignissen, nicht deren Neuanlage.
- Im Zuordnungsdialog: fachliche Entscheidung über Bezug, editierbare verbindliche redaktionelle Begründung; KI-Vorschlag im eigenen persistenten Feld mit Provenienz; KI erneut auf ausdrückliche Aktion anfordern, neues Ergebnis zunächst zur Übernahme anbieten. Einordnung der **Bedeutung für das Thema** getrennt vom **Zuordnungsstatus**: prägend / relevant / ergänzend.
- KI-generierte Kandidaten nur auf ausdrückliche Funktion „Weitere Bezüge vorschlagen“ (neben regulärer Recherche); gespeicherte Kandidaten ohne neue KI-Anfrage anzeigen.
- Ablehnungsgründe und Nachvorschläge bei neuen Sachlagen nach Issue #149 fachlich berücksichtigen.

**Offene Statusentscheidung:** Die Skizze nennt „KI-Vorschlag“, „Kandidat“, „zugeordnet“, „zurückgestellt“, „fachlich unpassend“. Diese Status nicht ungeprüft an vorhandenes proposal/status-System koppeln. Klären, ob „KI-Vorschlag“ Provenienz statt Entscheidungsstatus sein sollte und wie „zurückgestellt“ bzw. „fachlich unpassend“ mit begründeter Ablehnung und Reaktivierung zusammenhängen.

### 3.3 Beitrag

- **Thementext**: sachlicher, öffentlicher Text.
- **Unsere Einordnung**: gesonderte optionale politische Bewertung; keine Vermischung mit Sachtext.
- Pro Feld initialer bzw. gezielt erneut anforderbarer KI-Vorschlag; KI-Entwurf getrennt von der bearbeiteten redaktionellen Fassung aufbewahren, mit Herkunft/Version.
- Die tägliche Oberfläche zeigt nur aktuelle Arbeitsfassung, kompakte kombinierte Status-/Aktionsanzeige und einen Link „Versionsverlauf“.
- Im Versionsverlauf sind fachlich maßgebliche Fassungen mit Freigabe und ggf. Veröffentlichungszeitraum schreibgeschützt einsehbar. Nicht jeder Speichervorgang erzeugt eine formale Version: verbindliche Version bei Freigabe.
- Bei Überarbeitung nach Veröffentlichung bleibt bisherige freigegebene Fassung öffentlich, bis die neue freigegebene Fassung veröffentlicht wird.

### Vereinbarung vom 20.10.2026: fachlich unpassende Bezüge

Die Redaktion kann einen lokalen Bezug als **fachlich unpassend** ablehnen. Ablehnung und Begründung bleiben dokumentiert und gelten bis zu einer neuen redaktionellen Entscheidung. Die KI darf einen solchen Bezug erneut zur Prüfung vorschlagen, **wenn neue Ereignisse oder Änderungen der Themendefinition konkrete neue Gründe liefern**. Die neue Sachlage und die frühere Ablehnung müssen im erneuten Vorschlag erkennbar sein. Die bisherige Entscheidung wird **nie automatisch aufgehoben**. Ein KI-Vorschlag beschreibt die Herkunft; der redaktionelle Zuordnungsstatus bleibt gesondert gespeichert. Die Bedeutungseinstufung (prägend / relevant / ergänzend) ist erst nach redaktioneller Bestätigung verbindlich.

## 4. Status als getrennte fachliche Dimensionen, aber gemeinsame Darstellung

| Dimension | Status / Regel |
| --- | --- |
| Thema (Lebenszyklus) | Entwurf, Aktiv, Zurückgestellt, Archiviert **als abgestimmtes Zielbild**; bestehendes Datenmodell nennt bisher aktiv, ruhend, archiviert (Migration und semantische Abgrenzung erforderlich). |
| Beitragsfreigabe **je Version** | Noch keine Freigabe; Freigegeben; Freigabe zurückgenommen (nur vor Veröffentlichung). |
| Öffentliche Publikation | Noch nicht veröffentlicht; Veröffentlicht; Zurückgezogen; genauer Status gilt für öffentliche Sichtbarkeit der Beitragsfassung. |

UX: **keine drei parallelen Statusregler**. Status verständlich als kombinierte Information zeigen; nur zulässige Aktionen anbieten: Freigeben, Freigabe zurücknehmen, Veröffentlichen, Zurückstellen, Wiederaufnehmen, Archivieren. Versions- und Freigabehistorie intern vollständig auditiert.

- Freigabe kann bis vor Veröffentlichung widerrufen werden. War eine bestimmte Version einmal veröffentlicht, bleibt deren damalige Freigabe historisch unverändert; neue Inhalte benötigen neue Freigabe.
- Themenstatus Zurückgestellt führt zum Ende der öffentlichen Sichtbarkeit; Archiviert ebenso, jedoch als auf Dauer angelegte Zurückstellung. Keine harte Löschung nach erster Veröffentlichung.
- Wiederaufnahme unveränderter Inhalte: dokumentierte Aktualitätsprüfung mit Person und Datum reicht, keine neue Freigabe. Wenn Inhalt geändert, neue redaktionelle Freigabe erforderlich.
- Trennung „aktiv“ (redaktionelle Weiterbearbeitung) von „veröffentlicht“ (öffentliche Sichtbarkeit). Auch ein aktives Thema kann aktuell nicht veröffentlicht sein.
- Löschregel konkret: niemals veröffentlicht **und** aktuell keine wirksame Freigabe; Sicherheitsdialog; historische Freigaberücknahmen/Auditrechte im Datenmodell absichern.

### Vereinbarung vom 20.10.2026: erster Statuswechsel

Ein neu angelegtes Thema erhält zunächst den Themenstatus **Entwurf**. **Mit der ersten redaktionellen Freigabe** des zugehörigen Beitrags wechselt der Themenstatus zu **Aktiv**, unabhängig davon, ob die freigegebene Fassung bereits öffentlich veröffentlicht wird. Die getrennte Publikationsanzeige bleibt bis zur tatsächlichen Veröffentlichung **Noch nicht veröffentlicht**. Eine vor Veröffentlichung zurückgenommene Freigabe wird protokolliert; wird die erste Freigabe vor der ersten Veröffentlichung zurückgenommen, wechselt das Thema automatisch zurück zu **Entwurf**. Die Freigaberücknahme bleibt historisch protokolliert; es liegt keine wirksame Freigabe mehr vor. Die vier Zielstatus lauten **Entwurf, Aktiv, Zurückgestellt, Archiviert**; der bisherige Status `ruhend` wird fachlich durch `Zurückgestellt` abgelöst (Migration gesondert prüfen).

## 5. Klärungen vor verbindlicher Übernahme und Umsetzung

1. Abgleich der vier Themenstatus mit bisherigem `aktiv/ruhend/archiviert`; Definition von „Entwurf“ in Relation zu Freigabe, Koordination und Publikation; Migrationspfad.
2. Finale fachliche Zustandsmaschine der Zuordnungen, insbesondere KI-Provenienz versus Kandidatenstatus, fachliche Ablehnung, Zurückstellung, Wiedervorlage und Statuswechsel nach Themenänderung.
3. Vollständiger Inhalt der Themadefinition nach Primärkonzept: Perspektiven, Wirkungen und Kontext müssen erhalten bleiben, auch wenn zunächst nur Titel/Leitfrage/Erläuterung sichtbar sind.
4. Rechte- und Freigabematrix (wer darf freigeben, widerrufen, zurückziehen, archivieren, löschen); atomare Publikation und Sichtbarkeitsprüfung; Verhalten archivierter Themen beim Wiederaufnehmen.
5. Konsistenz von bisher veröffentlichter Fassung und neuer Arbeitsfassung sowie von KI-Entwürfen und redaktionellen Versionen.
6. Prüfung, ob die Bezeichnung „Beitrag“ in allen Objekttypen gleichermaßen gilt; keine vorzeitige Umbenennung von „Meldung“ oder „Vorgang“.
7. Abnahmekriterien und UX-Test anhand des vorhandenen Mobilitätsthemas sowie direkter Einzelereignisse.

## 6. Weiteres Vorgehen

Nach fachlicher Freigabe dieses Entwurfs die Änderungen gezielt in den jeweiligen Primärdokumenten (`Themen-und-Vorgangslogik`, `Datenmodell`, `Begriffe`) konsolidieren, dokumentierte Entscheidungen/Abweichungen festhalten und anschließend technische Teilaufgaben sowie UI-Migration des aktuellen Steppers ableiten. Dieser Entwurf ist **keine** implizite Entscheidung, den Prototyp unverzüglich umzubauen.
