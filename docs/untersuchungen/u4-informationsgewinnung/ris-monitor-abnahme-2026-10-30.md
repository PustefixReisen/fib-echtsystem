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
