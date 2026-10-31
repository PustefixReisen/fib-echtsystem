# U4 RIS – sichere Aktivierung (Runbook)

Status: **Vorbereitung, keine Betriebsfreigabe**. Stand 30.10.2026. Issue #336.

## Nachgewiesener Ist-Stand

Shared-Apps Supabase: Vault `supabase_vault` 0.3.1 ist installiert;
`pg_cron` und `pg_net` sind noch nicht installiert. Manuelle Funktion
`fib-u4-ris-pilot` ist vorhanden, JWT-Verifikation aktiviert.
`fib-u4-ris-scheduled` ist noch **nicht** bereitgestellt.

## Sicherheitsgrenze

- Der Cron darf nur `fib-u4-ris-scheduled` per POST aufrufen.
- `FIB_RIS_AUTOMATION_ENABLED` ist standardmäßig **nicht** `true`.
- Das zufällig generierte Secret `FIB_RIS_SCHEDULER_TOKEN` muss serverseitig
  verwaltet werden (mindestens 32 Zeichen, Empfehlung: mindestens 32 Bytes
  kryptographische Zufallsdaten). Geheimnisse weder in Git noch in
  Cron-SQL im Klartext, GitHub Actions, Browser-JavaScript oder Logs speichern.
- Ein separater RIS-Secret ist kein Supabase `service_role`-Schlüssel und
  darf nicht anderweitig verwendet werden.
- Der technische Scheduler hält eine Postgres-Advisory-Sitzungssperre,
  verarbeitet maximal acht Pakete und startet nach 90 Sekunden kein neues
  Paket. `409` bedeutet Belegung, `503` eine notwendige Wiederholung.
- Shared-Apps ist mit Memorix geteilt: Extensions, Jobs und Deployments
  dürfen Memorix nicht beeinträchtigen.

## Vorbereitende Prüfungen (lesen, keine Betriebsänderung)

Die maschinenlesbare Vorprüfung kann mit `npm run u4:ris:preflight`
und einer ausschließlich serverseitig gesetzten `FIB_DATABASE_URL` gestartet
werden. Sie verwendet `BEGIN READ ONLY`, liest nur installierte Erweiterungen
und das Vorhandensein der FIB-Tabellen; sie legt **keine** Jobs, Secrets oder
Erweiterungen an. Ihr Ergebnis `schedulerReadyForCommissioning` bedeutet
nur, dass die erforderlichen Erweiterungen installiert sind – **keine**
Betriebsfreigabe oder erfolgreich nachgewiesene Cron-/Secret-Konfiguration.


1. Prüfen, ob die drei Erweiterungen vorhanden sind:
   `select extname,extversion from pg_extension where extname in ('pg_cron','pg_net','supabase_vault');`
2. Prüfen, ob beide RIS-Endpunkte deployt sind und ob die JWT-Gateway-Einstellung
   tatsächlich nur beim Scheduler-Endpunkt ausgeschaltet ist.
3. Nach Installation von Cron vor jeder Veränderung vorhandene Jobs
   identifizieren; ausschließlich mit dem Präfix `fib-ris-` verwalten.
4. Nur kontrollierte Einmaltests mit synthetischem RIS-HTTP und isolierter
   Testdatenbank durchführen, bevor zeitgesteuerte produktive Aufrufe erfolgen.
5. Free-Plan-Budgets, mögliche Timeouts und Datum-/Zeitzonen-Grenzen prüfen.

## Prüffähiger Zeitplanentwurf

`npm run u4:ris:cron-plan` erzeugt einen unveränderlichen, maschinenlesbaren
Plan für die zwei namentlich begrenzten RIS-Jobs in UTC, mit festen Cadences
und dem festgelegten Commit-Body. Dieser Befehl **stellt keine Verbindung zu
Supabase her**, enthält kein Secret und erzeugt keinen Cron-Job. Die Zeiten
sind Entwurfswerte und vor Aktivierung mit vorhandenen Jobs abzugleichen.

## Geplanter Aktivierungspfad (erst nach Betriebsfreigabe)

1. `pg_cron` und `pg_net` gezielt installieren; dafür vorab
   Kompatibilität und Wartungsfolgen für Shared-Apps klären.
2. Einmaliges RIS-spezifisches Secret sicher erzeugen und serverseitig
   verfügbar machen; im Supabase Vault für den Cron-Nutzer mit
   minimalen Leseprivilegien ablegen. Keine Klartextwerte in SQL-Protokollen.
3. Scheduler-Funktion deployen (`verify_jwt=false` ausschließlich dort),
   aber `FIB_RIS_AUTOMATION_ENABLED` deaktiviert lassen.
4. Negative Tests: deaktiviert => 503; falsches Secret => 403;
   gültiger Zugang kontrolliert, zunächst nicht zeitgesteuert.
5. Namen für die zwei getrennten Cron-Jobs:
   `fib-ris-daily`, `fib-ris-weekly`.
   Planung in UTC (beispielhaft täglicher Aufruf 04:20 UTC,
   wöchentlicher sonntags 05:20 UTC). Die genauen Zeiten sind erst
   nach Prüfung der übrigen Jobs verbindlich. Keine Überschneidungen.
6. Für jeden Job einen POST mit festem Body
   `{\"cadence\":\"daily\",\"commit\":true,\"pdfBackfill\":false}`
   bzw. `weekly`. Das Secret nur serverseitig aus Vault lesen.
   Bei `ris_continuation_needed` und `ris_retry_needed` ist ein
   weiterer kontrollierter Lauf notwendig; ein abgeschickter HTTP-Request
   ist kein Erfolgsnachweis.
7. Betriebskennzeichen aktivieren **erst nach eigener Freigabe**.
8. Prüfen: vollständige Fenster, Hashes, Fehlernachholung, Cron-History,
   Begrenzung externer Zugriffe, keine Abweichungen bei Memorix.

## Pause, Rotation, Rücknahme

- **Sofortpause:** `FIB_RIS_AUTOMATION_ENABLED` deaktivieren, danach nur
  FIB-eigene Jobs deaktivieren. Unabhängige Memorix-Jobs nie verändern.
- Secret rotieren: neuen Wert im Server-/Vault-Kontext vorbereiten,
  beide Seiten abgestimmt umstellen, alten Wert widerrufen,
  abgewiesenen Alt-Schlüssel prüfen.
- Bei Ausfall: FIB-Cron-Jobs deaktivieren, kein Eingriff in andere Jobs,
  `fib-u4-ris-pilot` bleibt für MFA-geschützte manuelle Prüfungen verfügbar.
- Für Zeitfenster-Status immer `cadenceStates` auswerten; sichtbare
  `partial`-Läufe nicht als vollständige Kontrolle ausgeben.

## Abnahme bleibt offen

Kein Deployment, keine Extension-Installation, kein Vault-Secret und kein
Cron-Job gehören zur vorbereitenden Dokumentation. Vor dem Start sind die
technischen Negativ-/Paralleltests und eine gesonderte Betriebsfreigabe Pflicht.

Quellen: https://supabase.com/docs/guides/cron
https://supabase.com/docs/guides/cron/quickstart

## Zusatzvoraussetzung: persistente Fachstruktur (PR #348)

`FIB_RIS_STRUCTURE_ENABLED` bleibt bis zu einer gesonderten Freigabe ausgeschaltet.
Die vorbereitete Migration `20261031081340_fib_ris_editorial_structure.sql` und die
zugehörigen Edge Functions dürfen nicht durch eine Cron-Freigabe implizit mit
aktiviert werden. Reihenfolge, Teststand, Rücknahme und verbleibende Grenzen:
[U4 RIS-Persistenz](u4-ris-persistence.md).

Keine pauschale erneute Ausführung der historischen Runtime-Grants: Die neuen
Versions-/Prüftabellen haben absichtlich engere Rechte. Produktive Rollenprüfung,
Sicherung und Migrations-/Deploymentfreigabe bleiben ausstehend. Dieses Arbeitspaket
hat weder produktive Datenbankobjekte noch Zugangsschlüssel oder Memorix geändert.
