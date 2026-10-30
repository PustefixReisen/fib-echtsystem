# U4 – RIS-Überwachung: technischer Stand (30.10.2026)

## Ziel und fachliches Verfahren
FIB beobachtet zwei unterschiedliche Informationsströme:
1. **Sitzungsüberwachung:** Sitzungen, Tagesordnungspunkte und Vorlagen werden entsprechend ihrer RIS-Struktur erfasst.
2. **Dokumentfreigabeüberwachung:** Neu veröffentlichte oder nachträglich ergänzte Dokumente werden **unabhängig von Sitzungsterminen** anhand der RIS-Freigabelisten beobachtet. Anschließend werden sie nur bei ausreichendem Quellenbeleg Sitzungen, TOPs und Vorlagen zugeordnet.

Ein „Zeitfenster“ des technischen RIS-Piloten ist derzeit eine abgerufene, per RIS-Datumsnavigation adressierte **Ansicht der Dokumentfreigabeliste**, nicht die Zeit zwischen zwei Sitzungen und nicht zwingend ein einheitlich langer Kalenderabschnitt. Die Bezeichnung „Historisch vollständig“ ist aktuell missverständlich: Sie bedeutet technisch lediglich, dass in dem untersuchten Navigationsgraphen keine weiteren Seiten zum Abruf vorgemerkt sind.

## Erfolgreich nachgewiesen
- Sitzung 29.10.2026: TOP 2–10, neun Vorlagen, acht zeilengleiche PDF-Beziehungen (PR #300). Keine Ableitung von Abstimmungsergebnissen.
- RIS-Datumsnavigation und Deduplizierung technischer PDF-Verweise (PR #301–305).
- In Supabase Shared-Apps (Schema `fib`) insgesamt **93 eindeutige RIS-Dokumentverweise** gespeichert; drei Prüfläufe haben den ersten gefundenen Navigationsgraphen abgearbeitet.
- Dauerhafte Speicherung des Prüfcursors, Fortsetzung nach erneutem Aufruf, keine erneuten Beobachtungsdatensätze für bekannte URLs (PR #308–313, Live-Nachweis vom 30.10.2026).
- Ein vierter RIS-Prüflauf begann nach abgeschlossenem Rückblick wieder an der aktuellen Freigabeliste: 93 bekannte Verweise, 0 neue; zwei Ansichten geprüft, drei noch offene (PR #314).

## Offene Aufgaben vor einem regelmäßigen Betrieb
1. **Fachlich definierte Erfassungsgrenze:** RIS-Datumsnavigation und tatsächliche Dokumentveröffentlichungsdaten auswerten. „Keine offenen Links“ nicht mit historischer Vollständigkeit verwechseln.
2. **Wiederkehrender Betrieb:** Prüffrequenz, Rückblick/Überlappung und Nachholregel für Ausfälle festlegen. Neue Zyklen müssen aktuelle Freigaben und ältere relevante Ansichten erneut kontrollieren.
3. **Dokumentänderungen:** Bisher ist für die RIS-Dokumentverweise primär die Adresse wiedererkannt worden; eine verlässliche Änderungserkennung über Dokumentinhalte/PDF-Bytes im regelmäßigen Betrieb muss separat geprüft werden.
4. **Fachliche Zuordnung:** Nachträglich veröffentlichte Niederschriften, Beschlüsse und Anlagen nur bei eindeutigen Belegen den Sitzungen/TOPs/Vorlagen zuordnen; offene Verweise als unverknüpft behandeln.
5. **Betriebsüberwachung:** Fehler, unvollständige Durchläufe, Nachholen und Benachrichtigungen als überprüfbare administrative Zustände abbilden.

## UI-Bezeichnungen
Statt „Noch offene Zeitfenster“: **„Noch zu prüfende RIS-Freigabeansichten“** (gegebenenfalls ergänzt um den konkreten Datumsbereich, sofern aus der Quelle verlässlich bekannt).
Statt „Historisch vollständig“: **„Alle gefundenen Freigabeansichten geprüft“**. Ein separater Nachweis „Historische Abdeckung ab [Datum]“ ist erst bei tatsächlicher Datumsprüfung zulässig.

## Entscheidung
Die technische Pilotintegration und der Wiederanlauf sind erfolgreich erprobt. **Eine regelmäßige automatische RIS-Überwachung bleibt deaktiviert**, bis Überlappung, Inhaltsänderungserkennung, historische Abdeckungsgrenze und fachliche Verknüpfung ausreichend geprüft sind. Keine Veröffentlichung aus diesem Pilotbetrieb.


## Ermittlung der Betriebsregeln – Evidenzprüfung 30.10.2026

### Vorhandene Nachweise
- Fünf gespeicherte RIS-Freigabeansichten (eine aktuelle Einstiegsliste und vier datumsparametrisierte Navigationsadressen).
- 94 unterschiedliche PDF-Verweise; für alle 94 wurde ein SHA-256-Inhalts-Fingerabdruck gespeichert.
- Erstbeobachtung in FIB am 30.10.2026. Das ist **nicht** gleichbedeutend mit dem Veröffentlichungsdatum im RIS.
- Kein geprüfter Nachweis, dass ein Navigationsparameter `smcadat` unmittelbar ein Kalenderdatum codiert. Die Bedeutung darf nicht aus der Zahl geraten werden.
- Keine hinreichende Stichprobe nachträglicher Freigaben oder PDF-Austausche, aus der eine verlässliche Überlappungsfrist berechnet werden kann.

### Betriebsregeln (vorläufig; keine Freigabe für Zeitsteuerung)
1. Eine Quelle erhält einen eigenständigen Zustand für **Scan vollständig durchlaufen**, **historisch abgedeckt ab Datum** und **Inhalte vollständig geprüft**. Diese Zustände dürfen nicht vermischt werden.
2. Die aktuelle Freigabeliste wird bei jedem neuen Zyklus erneut aufgerufen. In der RIS-Navigation gefundene frühere Ansichten werden nach einer dokumentierten, nachweislich ausreichenden Überlappungsregel erneut geprüft.
3. Die Intervallwahl „täglich“ und „30 Tage Rückblick“ ist zunächst eine **zu testende Hypothese**, keine geprüfte Betriebsvorgabe.
4. Neue und bekannte PDF-Verweise werden auf Inhaltsänderung geprüft. Abruffehler erzeugen keinen positiven Inhaltsprüfungs-Nachweis und dürfen den betroffenen Checkpoint nicht überschreiben.
5. Nicht vollständig bearbeitete, aber fehlerfreie Prüfpakete tragen den Status `partial`, echte Fehler `failed`; versäumte Läufe müssen bis zur erfolgreichen Nachholung als Lücke erkennbar bleiben.
6. Vollständigkeitsangaben erfordern verifizierte Veröffentlichungsdaten sowie eine bestätigte untere Erfassungsgrenze. Die aktuelle UI-Aussage „Historisch vollständig“ darf ausschließlich als technischer Abschluss aller gefundenen Ansichten interpretiert und soll ersetzt werden.
7. Sitzungsüberwachung und Dokumentfreigabeüberwachung bleiben getrennt; Zuordnungen zu Sitzung/TOP/Vorlage benötigen einen Beleg.

### Nächste Abnahmeprüfung
An mindestens zwei zeitlich versetzten RIS-Prüfständen Veröffentlichungs- und Änderungsdaten aus den RIS-Quellen ermitteln; ältere Nachträge gezielt als Referenzfälle erfassen. Erst danach eine konkrete Rückblickfrist und Wiederholungsfrequenz als verbindliche Betriebseinstellung festlegen. Bis dahin **kein Cron und keine automatische Veröffentlichung**.


## RIS-Freigabezeitraum – live geprüfter Quellenbeleg
Am 30.10.2026 hat die lesende GitHub-U4-Diagnose auf `do0040.asp?smcmode=32832` (HTTP 200) die sichtbare Überschrift **„Dokumente mit Freigabe seit 23.10.2026“** ausgegeben. Die RIS-Navigation weist ausdrücklich Links „1 Tag zurück“, „1 Monat zurück“ und „120 Tage zurück“ aus. Die Diagnose zeigte auch verschiedene Sitzungsdaten auf derselben Freigabeseite.

**Folgerung:** Die Seite nennt eine untere Grenze des **angezeigten Freigabezeitraums**. Sie ist nicht mit dem Sitzungsdatum oder dem Freigabedatum eines einzelnen PDFs gleichzusetzen. Die bisher gespeicherten fünf Navigationsadressen sind kein geprüfter historischer Abdeckungsnachweis; konkrete Datumstexte der tatsächlich abgerufenen Ansichten müssen separat geprüft und gespeichert werden.

Der Parameter `smcadat` wird weiterhin nicht ohne ausdrücklichen Quellenbeleg als Datum interpretiert. Die UI soll künftig den aus einer RIS-Seitenüberschrift tatsächlich erkannten Freigabestart ausweisen (mit Abrufdatum und Quelladresse); bei fehlendem Nachweis bleibt die Abdeckung „nicht bestimmt“.
