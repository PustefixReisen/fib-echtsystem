# U4 RIS – Vorbereitung des automatisierten Betriebs

Status: **nicht aktiviert** (30.10.2026). Grundlage: Issue #336 und PR #337.

## Zweck und Grenzen

Der FIB-Quellenmonitor prüft die RIS-Dokumentliste mit zwei getrennten Zeitfenstern:
- täglich: 30 Tage Rückblick;
- wöchentlich: 120 Tage Rückblick.

Die Prüfung erfolgt ausschließlich durch FIB. Aus einem frühesten erfassten
Freigabedatum folgt **kein Nachweis der historischen Vollständigkeit**.

## Zwei getrennte Zugänge

- Interaktiver Administrationszugang `fib-u4-ris-pilot`: persönliche Supabase-
  Anmeldung mit AAL2 (MFA), FIB-Adminrolle; bestehende Kontrollen unverändert.
- Technischer Zugang `fib-u4-ris-scheduled`: RIS-spezifisches langlebiges Secret,
  kein persönliches Benutzerkonto, kein globaler Supabase-Service-Role-Schlüssel.
  Der Endpunkt ist standardmäßig durch
  `FIB_RIS_AUTOMATION_ENABLED != true` gesperrt.
  Ohne Secret (mindestens 32 Zeichen) werden keine Prüfungen verarbeitet.

**Nicht freigeben:** Header-Secret in Browsercode, öffentlichem Repository,
CI-Protokollen oder Abfrageprotokollen; statische Benutzer-JWTs für Cron.
Der Scheduler-Endpunkt wird erst nach gesonderter Sicherheitseinrichtung
bereitgestellt. Die Konfiguration `verify_jwt=false` gilt nur für den speziellen
Scheduler-Endpunkt; die eigene Zweckprüfung muss vor jedem Datenbankzugriff
erfolgen.

## Vor der Inbetriebnahme technisch abschließen

1. Vertrauenswürdigen Scheduler innerhalb der Supabase-Umgebung auswählen und
   tatsächliche Bereitstellung von pg_cron/pg_net/Vault prüfen.
2. Hochentropisches Secret serverseitig erzeugen, sicher verwahren, an beiden
   Seiten bereitstellen und Rotation/Widerruf testen. Niemals als Klartext in SQL
   oder CI-Dateien einchecken.
3. **Mehrpaket-Verarbeitung:** Der RIS-Kern verarbeitet maximal zwei Ansichten
   pro Prüfpaket. Der technische Scheduler-Endpunkt verarbeitet bis zu acht
   Pakete je Aufruf. Ein offener Rest liefert `ris_continuation_needed` (HTTP 503),
   ein RIS-Fehler `ris_retry_needed` (HTTP 503). Dies ist **keine** erfolgreiche
   vollständige Überwachung. Der spätere Zeitplan muss diese Zustände erkennen
   und kontrolliert nachholen.
4. **Fehlernachholung:** Bei RIS-Ausfall muss der gespeicherte Rückstand bestehen
   bleiben und zeitnah erneut abgearbeitet werden. PDF-Fehler dürfen weder den
   Cursor noch die erfolgreiche Laufmarkierung weiterschieben.
5. **Parallelität:** Gleichzeitige Prüfläufe auf demselben RIS-Cursor ausschließen
   oder mit transaktionaler Sperre sicher serialisieren. Bestehende
   `cursor_changed_retry`-Erkennung allein ist kein Auftrag zur grenzenlosen
   Wiederholung.
6. Laufgrenzen, Laufprotokolle, Warnungen und eine Pause-Funktion mit
   isolierten Tests nachweisen; Kosten/Limits des Free-Plans prüfen.
7. Nach Ende des manuellen Tests einmalige technische Betriebsabnahme;
   **keine automatische Aktivierung ohne eigene Freigabe**.

## Bis dahin

Keinen Cron-Job anlegen und keine produktiven Supabase-Secrets hinzufügen.
Die manuelle RIS-Prüfung bleibt verwendbar. Der neue Scheduler-Zugang wird nicht
automatisch deployt und bleibt ohne den ausdrücklichen Aktivierungsparameter
wirkungslos. Status nach PR #337 / Issue #336 nachvollziehbar dokumentieren.
