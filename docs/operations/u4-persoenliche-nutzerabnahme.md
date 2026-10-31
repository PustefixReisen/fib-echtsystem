# FIB – Anleitung zur persönlichen RIS-Nutzerabnahme

| Version | Stand | Verantwortung |
|---|---|---|
| 1.0 | 31.10.2026 | Josef Walter – vorbereitet mit KI-Unterstützung |

## Ziel und Zugang

Du prüfst, ob die Darstellung und Bearbeitung fachlich richtig, verständlich und für
deine redaktionelle Arbeit geeignet ist. Die technische Integration ist seit #352
geprüft. **Deine persönliche fachliche Abnahme steht noch aus.**

Der vorbereitete Zugang läuft auf deinem eigenen Rechner. Nach Einrichtung und Start
öffnest du **http://127.0.0.1:4173** im Browser. Diese Adresse funktioniert nur auf dem
Rechner, auf dem die Abnahme gestartet wurde. Es gibt derzeit **keinen bereitgestellten
externen Testzugang**. Die normale produktive Redaktionsadresse ist hierfür nicht vorgesehen.

Die einmalige technische Einrichtung übernimmt der Entwicklungs-/Betriebsverantwortliche
nach der [Einrichtungsanleitung](u4-user-acceptance-setup.md). Danach lautet der Start im
Projektordner:

```bash
npm run acceptance:ris
```

Das Terminal bleibt während der Prüfung offen. Es meldet „Lokale Abnahme bereit“ und
zeigt, wo deine private Datei `Zugang.txt` liegt. Standardmäßig ist das
`~/.local/state/fib-ris-acceptance/Zugang.txt`. In der Dateiverwaltung lassen sich
versteckte Ordner mit **Strg+H** anzeigen. Zugangsdaten, Einrichtungsschlüssel und
lokale Datenbankdateien bitte nicht in Chat, GitHub, Screenshots oder Cloud-Ordner kopieren.

## Anmeldung und erster Überblick

1. Öffne die lokale Browseradresse. Vor der Anmeldung muss der Hinweis
   **„Isolierte persönliche Abnahme“** sichtbar sein.
2. Trage E-Mail und Passwort aus deiner privaten Zugangsdatei ein. Verwende ausschließlich
   dieses Testkonto und kein produktives Passwort.
3. Füge den TOTP-Einrichtungsschlüssel aus der Datei als neues zeitbasiertes Konto in
   deiner Authenticator-App hinzu: sechs Stellen, 30 Sekunden. Nenne es beispielsweise
   „FIB lokale Abnahme“. Dein vorhandenes produktives FIB-Konto bleibt ein anderes Konto.
4. Klicke **Anmelden**, gib den aktuellen Zahlencode ein und bestätige MFA.
5. Prüfe den Hinweis nach der Anmeldung. Im Standardmodus sind Original-PDFs privat
   abgerufen. Die HTML-Ausschnitte und die Gemeinde-Nachricht sind ein begrenzter,
   dokumentierter Referenzbestand. Es wird keine Vollständigkeit der Website behauptet.

Steht dort **„Synthetische PDF-Testdaten“**, ist nur eine technische Bedienprobe möglich.
Der Inhalt von Vorlagen ist damit nicht fachlich abnehmbar. Diesen Modus bitte im
Abnahmeergebnis ausdrücklich angeben. Er wird nur mit `--fixtures` gestartet.

Die vorbereiteten Arbeitswege sind Sitzungen, Fundstellen und die verknüpften Ereignisse.
Vorgangs-/Themenbezüge prüfst du innerhalb dieser Ansichten; der vollständige Themeneditor
ist kein Bestandteil dieser lokalen Abnahmeumgebung.

Die Prüfung veröffentlicht nichts. Du darfst im lokalen Bestand Entscheidungen ausprobieren.
Der Ausgangsbestand enthält einen technischen Start-Eintrag, einen Prüf-Vorgang und ein
Prüf-Thema. Diese Objekte sind Arbeitshilfen, keine tatsächlichen redaktionellen Bewertungen.

## Prüffall A – Gemeinderat 29.10.2026, TOP 2 und 3

**Worum es geht:** Eine Vorlage und ihr Beschlussvorschlag sind vom tatsächlich gefassten
Beschluss zu unterscheiden. Für diese beiden TOPs ist im vorbereiteten Bestand kein
Beschlussergebnis belegt. Das bedeutet weder „abgelehnt“ noch „kein Beschluss gefasst“.

1. Wähle **Sitzungen → GR/440/2026 → Sitzung öffnen**. Vergleiche Gremium und Datum mit
   [der amtlichen Sitzung](https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1032).
2. Wähle TOP 2. Erwartet: Wegfall des Elternbeitragszuschusses, Vorlage **5395/2026**,
   Dokument **75714**. Danach TOP 3: Beitragsanpassung der Kindertageseinrichtungen,
   Vorlage **5397/2026**, Dokument **75790**.
3. Prüfe **Vorlagen und Beschlussvorschläge**, **Tatsächliche Beschlüsse** sowie
   **Niederschriften und Anlagen**. Vorschlagstexte sind anfangs noch nicht als geprüfter
   Text erschlossen. Ein PDF-Link allein darf keinen tatsächlichen Beschluss belegen.
4. Öffne **Originalquelle öffnen** und **Dokumenttext und Herkunft**. Vergleiche die
   Textdarstellung mit dem amtlichen PDF. Prüfe Quellenadresse, Fassung, Zeitpunkt,
   Unsicherheit und den unveränderten Originalwortlaut. Unbestätigte Links müssen
   als unsicher erkennbar sein.
5. Öffne das Dokument über **In Fundstellenverwaltung öffnen**. Vergib einen eindeutigen
   Titel und übernimm die Fundstelle ausdrücklich. Erwartet: Fundstelle vorhanden;
   noch kein neu angelegtes Ereignis und keine Meldung.
6. Suche zuerst ein passendes bestehendes Ereignis. Für diese Vorlagenveröffentlichung
   kannst du anschließend ausdrücklich ein eigenes Ereignis bestätigen. Beschreibe
   die Veröffentlichung, beispielsweise „Veröffentlichung der Vorlage zum Elternbeitragszuschuss“.
   Begründe deine Entscheidung; bezeichne sie nicht als gefassten Beschluss.
7. Öffne den vorhandenen Ereigniseditor über **Ereignis öffnen**, prüfe den Quellenbezug
   und kehre über **Fundstelle öffnen → RIS-Kontext öffnen** zur Sitzung zurück.
8. Wähle denselben TOP. Begründe die nächste Entscheidung, wähle das Dokument und
   bestätige die passende Dokumentart **Vorlage**. Ordne den TOP dem Ereignis in der
   Rolle **Veröffentlichung einer Vorlage** zu.
9. Öffne **Belegten Text als Vorschlag erfassen**. Wähle **Beschlussvorschlag aus Vorlage**
   und die zugehörige Vorlage. Übernimm einen exakten Wortlaut sowie den passenden
   wortgetreuen Beleg aus dem Dokument. Speichere zunächst nur den Vorschlag.
   Prüfe den offenen Zustand und bestätige ihn erst in einer eigenen Aktion.
10. Erwartet: Der bestätigte Text steht als Beschlussvorschlag bei der Vorlage.
    **Tatsächliche Beschlüsse bleibt für diesen TOP ohne belegten Beschluss.** Herkunft
    und Prüfentscheidung müssen nachvollziehbar bleiben. Wiederhole die inhaltliche
    Prüfung für TOP 3; du musst nicht allein für den Test ein zweites Ereignis anlegen.

## Prüffall B – Gemeinderat 15.10.2026

**Worum es geht:** Unterschiedliche Ergebnisse, mehrere Beschlusspunkte und unbekannte
Informationen müssen zusammen verständlich dargestellt sein.

Wähle **Sitzungen → GR/439/2026 → Sitzung öffnen**. Für diesen Fall wurden vier
Beispielentscheidungen aus den dokumentierten Originalauszügen technisch vorbereitet.
Sie erscheinen als bestätigter lokaler Beispielbestand; im Prüfverlauf steht, dass
sie **keine persönliche Nutzerabnahme** sind. Du prüfst sie jetzt selbst am Original:
[amtliche Sitzung](https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031),
[Niederschrift 75785](https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=75785).

| Auswahl | Erwartete Darstellung |
|---|---|
| TOP 2 | Antrag zurückgezogen, auf Abstimmung verzichtet; Ergebnis „Keine Abstimmung“, Stimmen unbekannt statt erfundener Nullwerte |
| TOP 3 | Abgelehnt; Ja 7, Nein 13; nicht belegte Enthaltungen unbekannt |
| TOP 6, Beschlusspunkt 1 | Angenommen; Ja 17, Nein 2; eigener Wortlaut und Beleg |
| TOP 6, Beschlusspunkt 2 | Angenommen; Ja 19, Nein 0; eigener Wortlaut und Beleg; unbekannte Enthaltungen bleiben unbekannt |

1. Wähle nacheinander TOP 2, 3 und 6. Vergleiche Wortlaut, Ergebnis und Stimmen am
   Original. Öffne **Originalbeleg und Fassung**. Bei TOP 6 müssen zwei Beschlusspunkte
   getrennt erhalten bleiben; eine TOP-Überschrift ersetzt die einzelnen Ergebnisse nicht.
2. Prüfe, dass die sitzungsweite Niederschrift zu allen betreffenden TOPs nutzbar bleibt.
   Die Vorlagen dürfen nicht mit der Niederschrift oder einem Beschluss verwechselt werden.
3. Öffne aus einem Beschluss das zugehörige Ereignis und kontrolliere den Rückweg.
4. Prüfe unter **Herkunft und Prüfverlauf**, wer die Beispielentscheidung vorbereitet hat,
   auf welche Dokumentfassung sie sich bezieht und welche Begründung hinterlegt ist.
5. Prüfe bei TOP 2 **Verfahrensstand prüfen**: begründe deine Prüfung, wähle
   **Zurückgezogen**, die bestätigte Niederschrift als Beleg und den exakten Satz
   „Der Antrag wurde zurückgezogen und auf eine Abstimmung verzichtet.“.
   Bestätige ausdrücklich. Erwartet: Der Verfahrensstand wird nachvollziehbar geändert.
6. Wähle anschließend **Gesamte Sitzung**. Prüfe die Niederschriftsgenehmigung.
   Sie bleibt **unbekannt**: Die bloße Verfügbarkeit der Niederschrift ist keine
   Genehmigung. Im persönlichen Referenzbestand wird kein künstliches späteres
   Genehmigungsdokument eingefügt. Ohne geeigneten Beleg bitte keine Genehmigung bestätigen.

Ist ein bestätigter Beispielpunkt falsch, halte zunächst die Beanstandung fest.
Eine fachliche Korrektur muss als nachvollziehbare neue Entscheidung/Fassung erfolgen;
das Original und die ursprüngliche Fassung dürfen nicht still verschwinden.

## Prüffall C – Parkraumkonzept

**Worum es geht:** Eine Gemeinde-Nachricht wird über die reguläre Fundstellenverwaltung
redaktionell verwendet und mit bestehenden Vorgängen und Themen verbunden.

1. Wähle **Recherche → Fundstellen**. Suche **Gemeinde Feldkirchen** oder
   **parkraumkonzept**. Öffne die noch nicht übernommene Quellenbeobachtung.
2. Vergleiche die Herkunft mit der [Gemeinde-Nachricht](https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/parkraumkonzept-der-gemeinde-feldkirchen).
   Erwartet: Titel „Neues Parkraumkonzept in Feldkirchen“, Referenzdatum 10.09.2026.
   Die Ansicht weist darauf hin, dass kein vollständiger Artikeltext gespeichert ist.
3. Übernimm sie mit aussagekräftigem Titel ausdrücklich als Fundstelle. Prüfe
   Herkunft, Übernahmeversion und Status. Es darf dadurch noch keine Meldung entstehen.
4. Suche ein passendes bestehendes Ereignis; alternativ bestätige ausdrücklich ein
   neues Ereignis zur Veröffentlichung des Parkraumkonzepts. Begründe die Wahl.
   Prüfe das Öffnen des Ereignisses und den Rückweg zur Fundstelle.
5. Öffne **Bestehenden Vorgang oder bestehendes Thema vorschlagen**. Wähle den
   vorbereiteten Prüf-Vorgang und begründe den Bezug. Speichere den Vorschlag.
   Erwartet: Er bleibt offen, bis du ihn separat bestätigst. Prüfe auch Zurückstellen
   oder Ablehnen an einem eigenen zusätzlichen Vorschlag, wenn du diesen Fall testen möchtest.
6. Wiederhole den Weg für das vorbereitete Prüf-Thema. Wähle eine passende Bedeutung
   und begründe sie. Bestätige separat. Erwartet: Der Bezug steht anschließend beim
   Ereignis; kein neuer Vorgang und kein neues Thema wurde automatisch angelegt.
7. Prüfe **Redaktioneller Zusammenhang**, Herkunft des Vorschlags, Begründung und
   Prüfentscheidung. Ein redaktioneller Vorschlag darf nicht als KI-Vorschlag ausgegeben sein.

## Unterbrechen, fortsetzen und Beanstandungen festhalten

Du kannst den Browser schließen. **Strg+C** im Start-Terminal beendet die lokalen
Dienste. Deine Bearbeitungen bleiben erhalten. Derselbe Startbefehl und dieselbe
Anmeldung setzen die Prüfung fort; es wird nicht automatisch neu befüllt.

Notiere Beanstandungen zunächst in deiner privaten Datei `Rueckmeldungen.md` im
Zustandsordner oder teile eine bereinigte Beschreibung hier im Chat mit:

- Prüffall und betroffener TOP beziehungsweise Fundstelle;
- konkrete Bedienhandlung;
- erwartet / tatsächlich gesehen;
- Auswirkung: verhindert Abnahme, erschwert Arbeit oder Verbesserung;
- optional Screenshot ohne Zugangsdaten und ohne vertrauliche Eingaben.

Gib außerdem Datenmodus, Datum und den geprüften Entwicklungsstand an. Die Datei wird
nicht automatisch versandt. Eine Veröffentlichung von Screenshots/Testdaten in GitHub
erfolgt erst nach bewusster Prüfung; private Zugangsdaten bleiben immer lokal.

## Entscheidung über die fachliche Abnahme

Bewerte jeden Prüffall als **bestätigt**, **teilweise bestätigt**, **abweichend** oder
**nicht geprüft**. Eine Abnahme ist erst sinnvoll, wenn:

- Vorlage, Beschlussvorschlag und tatsächlicher Beschluss verständlich getrennt sind;
- unbekannte Ergebnisse und unsichere Beziehungen eindeutig erkennbar bleiben;
- die dargestellten Ergebnisse den Originalbelegen entsprechen;
- Fundstelle, Ereignis, Vorgang und Thema passend verbunden und navigierbar sind;
- Vorschlag, Prüfung und Bestätigung mit Begründung nachvollziehbar sind;
- keine unbeabsichtigte Meldung oder Veröffentlichung entsteht;
- keine Beanstandung offen bleibt, die die fachlich richtige Verwendung verhindert.

Die Bewertung treffen wir anschließend gemeinsam. Eine erfolgreiche fachliche Prüfung
ist noch keine Freigabe für produktive Migration, Bereitstellung oder RIS-Automatisierung.

## Änderungshistorie

| Version | Änderung |
|---|---|
| 1.0 | Persönlichen Zugang, drei Prüffälle, erwartete Ergebnisse, Rückmeldung und fachliche Abnahmekriterien vorbereitet |
