# U4 – Feldkirchen, geprüfte Quellenzugänge und offene Abdeckung

Stand: 30.10.2026. **Nicht** gleichzusetzen mit einem erfolgreichen automatisierten Live-Probelauf.

## Gemeinde: Veröffentlichungsscope ist größer als „Aktuelle Meldungen“
Öffentlich sichtbare Hauptnavigation der Gemeinde:
- Nachrichten: https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen
- Nachrichtenarchiv: über die Navigation unter Nachrichten erreichbar
- Bekanntmachungen
- Ausschreibungen
- Gemeindeblatt
- Nachrichten aus dem Bauamt
- Öffentliche Auslegungen unter Bebauungspläne

**Fachlicher Auftrag:** Diese einzelnen Bereiche als mögliche Kernquellen-Scopes separat sichten und konfigurieren. Die Existenz einer Navigation beweist noch keine technisch verlässliche Seitenerfassung, Paginierung oder vollständige Rückschau.

## RIS: Zeitparameter und Zugangsgrenzen
Eine indexierte, inhaltlich belegte Dokumentfreigabeliste ist unter
https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcadat=2461311&smcmode=32832
auffindbar; sie enthält nach Freigabedatum dokumentierte Einträge zur Sitzung am 29.10.2026 und weitere Vorlagen.

Der bisherige statische Einstieg ohne `smcadat` ist über den zur Verfügung stehenden Webabruf **nicht** verlässlich erreichbar. Daraus darf weder ein genereller Quellenausfall noch eine erfolgreiche automatisierte Erfassung abgeleitet werden. Der Datumsparameter wird als quellspezifisch behandelt und muss für Testläufe nachvollziehbar dokumentiert werden; keine aus einem Suchtreffer stammende historische URL als allgemeingültigen Endpunkt fest verdrahten.

## Freigabegatter für echten Lauf
1. Direkte, kontrollierte HTTP-Abrufe aus der vorgesehenen **serverseitigen FIB-Laufzeitumgebung**, einschließlich Header, Redirects, HTML/PDF-Binärantworten und Session-Verhalten.
2. Validierte HTML-Struktur für **alle** Seiten, Pagination/Archivnavigation, stabile externe Kennungen und RIS-Beziehungsdaten.
3. Prüftest gegen eine bekannte RIS-Sitzung mit TOPs, Vorlagen, Beschlüssen, Niederschrift und Anlagen sowie gegen neue und nachgetragene Veröffentlichungen.
4. Quellenprüflauf speichert überprüfbar Listeneinträge, Fehler und Checkpoints; fehlgeschlagener Teilabruf darf **keinen** Erfolgscursor setzen.
5. Solange obige Punkte fehlen, Quellenscopes auf **Kandidat** belassen, keine produktive Scheduler-Aktivierung.

Der hier dokumentierte Webzugriff diente der öffentlichen Sichtprüfung. Der Containerzugriff hatte keine DNS-Auflösung der Gemeindeseite; damit sind keine tatsächlich vom U4-Code automatisch erfassten Daten belegt.
