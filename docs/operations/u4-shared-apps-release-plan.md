# RIS – Bereitstellung in der bestehenden Shared-Apps-Entwicklungsumgebung

| Version | Stand | Verantwortung |
|---|---|---|
| 1.0 | 31.10.2026 | Josef Walter – mit KI-Unterstützung |

## Entscheidung und Grenze

Auftrag #357, PR #358, persönliche Abnahme #356. Verbindlicher Zielweg nach ADR-011:
**Shared-Apps / Schema `fib` / bestehende Konten und MFA / IONOS-Redaktion**.
Keine lokale Installation, neue Supabase-Instanz oder neuer Hostingdienst erforderlich.
Die lokale Empfehlung aus #355 ist als Standard für die persönliche Abnahme zurückgenommen;
isolierte technische Tests bleiben notwendig.

**Status: nur vorbereitet und isoliert geprüft. Keine Bereitstellungsfreigabe erteilt.**
Der [Istbericht](u4-shared-apps-inventory-2026-10-31.md) unterscheidet die bereits laufenden
Komponenten vom implementierten Stand. Diese Datei ist die führende technische Ablaufquelle;
die [Anwenderanleitung](u4-persoenliche-nutzerabnahme.md) ist die führende persönliche Anleitung.

## Umfang einer einzigen späteren Bereitstellungsentscheidung

| Bestandteil | Genau vorgesehene Änderung | Schutz / Rücknahme |
|---|---|---|
| Migration 1 | `20261031081340_fib_ris_editorial_structure.sql`: 17 additive RIS-Tabellen, Constraints, Indizes, enge FIB-Runtime-Policies | kein public/Auth, keine neue Rolle oder Default-Grants; bei Rücknahme Daten/Schema erhalten |
| Migration 2 | `20261031132655_fib_development_dataset_manifest.sql`: zwei append-only FIB-Manifesttabellen | Runtime liest Batches und liest/ergänzt Objektmarkierungen; keine Runtime-DELETE-/UPDATE-Rechte darauf |
| Backend | nur `fib-editorial-write`, `fib-u4-ris-pilot`, `fib-u4-pilot` mit aktuellen relativen Shared-Modulen | vorhandene JWT-Gatewayeinstellung false/true/true beibehalten; private Vorversionen für Rücknahme sichern |
| Auth / Berechtigungen | bestehende FIB-Mitgliedschaft, MFA und `fib_app`/`fib_runtime` verwenden | **keine** Konten/Faktoren/Passwörter, Mitgliedschaften oder gemeinsamen Auth-Einstellungen ändern |
| Quellen | genau vorhandene amtliche RIS-/Gemeinde-Quelle von inaktiv auf aktiv setzen | privater Vor-/Nachher-Beleg; bei Drift keine blinde Rücknahme; Merkur und alle übrigen Quellen unverändert |
| Referenzdaten | eigener markierter Batch `ris-abnahme-20261031`, zwei reduzierte Sitzungsansichten, sechs Original-PDF-Texte, vorhandene Parkraum-Beobachtung wiederverwenden | exakte Objektzuordnung; keine automatische Ereignis-/Beschluss-/Meldungsbestätigung; keine Stammdatenduplikate |
| Feature | FIB-eigenen Wert `FIB_RIS_STRUCTURE_ENABLED` kontrolliert erst am Ende auf `true` setzen | vorherigen Zustand privat erfassen; bei Störung auf aus, keine anderen Secretwerte ändern |
| Frontend | regulären Build unter `/redaktion/` bereitstellen; `shared_development=true` zeigt Entwicklungsbestand | vorherigen vollständigen statischen Stand privat sichern; rückspielbar ohne DB-Löschung |

Nicht enthalten: Cron, `FIB_RIS_AUTOMATION_ENABLED`, Scheduler-Deployment, Erweiterungen
wie pg_cron/pg_net/Vault, neue Schlüssel, Änderung einer gemeinsamen DB-URL, neue Benutzer,
öffentliche Meldung oder irgendeine Memorix-/`public`-Migration. Der FIB-Featurewert liegt
technisch in der Projektkonfiguration und benötigt daher die ausdrückliche Freigabe,
obwohl ausschließlich FIB-Code ihn auswertet. Keine Credential-Rotation erforderlich.

Eine Freigabe muss den **konkreten gemergten Commit** und dieses begrenzte Paket nennen.
`DEPLOY` oder `--approval=...` sind technische Bestätigungs-/Protokollfelder, keine
organisatorische Freigabe an sich. Ohne Freigabe bleiben alle folgenden Schreibschritte aus.

## Voraussetzungen und Stop-Kriterien

1. Frische lesende Inventur mit diesem Bericht vergleichen; bei neuen Tabellen,
   Änderungen an Quellen/Migrationshistorie/Edge-Versionen oder veröffentlichten Daten stoppen.
2. Bestehender berechtigter Verwaltungszugang und lokaler PostgreSQL-17-Client mit
   verifizierter TLS-Verbindung müssen vorliegen. Private Verbindungswerte ausschließlich
   in `FIB_MAINTENANCE_DATABASE_URL`, niemals in Git/Chat/CLI-Argumenten. Bei Bedarf die
   bestehende Projekt-CA über `PGSSLROOTCERT` verwenden; keine TLS-Prüfung abschalten.
3. Aktuelle `fib`-Sicherung und verifizierte private Backupablage sowie Backend-/Frontend-
   Vorversionen sichern. Eine aktuelle Shared-Apps-Sicherung wurde in dieser Vorbereitung
   **nicht** erstellt oder behauptet; nur der Sicherungs-/Restoreweg wurde isoliert geprüft.
4. Vorherige FIB-Featurezustände und genaue Funktionsmetadaten privat dokumentieren.
   Secretwerte und SFTP-/Backup-Zugangsdaten wurden nicht ausgelesen. Fehlende Zugänge
   nicht durch neue weitreichende Rollen oder Schlüssel umgehen.
5. Kurzes FIB-Wartungsfenster vereinbaren. Memorix bleibt in Betrieb. Die gemeinsame
   Rechen-/Verbindungsressource verlangt Beobachtung; „keine Datenänderung“ garantiert
   nicht mathematisch null zusätzliche Ressourcenlast.

Bei Abweichung oder fehlender Voraussetzung: keine Teilaktivierung, Privatprotokoll
prüfen und den Zustand erhalten. Die neue Readiness muss `runtimeRole=fib_app` zeigen.
Wenn die bisherige DSN tatsächlich anders gebunden ist, **stoppen**: eine DSN-/Schlüssel-
änderung ist nicht stillschweigend Bestandteil dieses Pakets.

## Sicherung vor dem ersten Schreibschritt

Nur nach erteilter Bereitstellungsfreigabe und mit privatem bestehendem Verwaltungszugang:

```bash
node scripts/ris-shared-apps/backup.mjs --out=/privater-pfad/fib-vor-ris
```

Das Werkzeug akzeptiert nur das bekannte Shared-Apps-Projekt oder `fib_u4_test` auf
Loopback. Es hält eine exportierte lesende Datenbanksicht offen und übergibt dieselbe
Snapshot-ID an `pg_dump`. Exportiert werden ausschließlich Schema `fib`, dessen Daten,
Constraints und ACLs, keine globalen Rollen/Passwörter und keine Daten aus `public` oder
`auth`. `auth-ids.json` enthält ausschließlich die von FIB referenzierten Benutzer-IDs
für **isolierte FK-Platzhalter**, keine Auth-Konten oder Faktoren. Alle Dateien privat,
0700/0600, mit SHA-256-Manifest und Tabellenzählungen. `pg_dump`-Hauptversion 17 verwenden.

Die vorhandene Sicherungskette nach ADR-010/011 verwenden: privater FIB-Backupbereich,
getrennter Backupzugang, Nextcloud-Synchronisation und Back In Time. Den erfolgreichen
Upload und die Prüfsummen kontrollieren; diese Prüfung ist kein automatischer Nachweis
über unbekannte Nextcloud-Zugangsdaten. Kein Upload von Dumps/Konten in GitHub-Artefakte.

Zusätzlich vor Deployment privat sichern:

- die vollständigen Dateien und Metadaten der drei laufenden FIB-Edge-Funktionen;
- den aktuellen IONOS-Inhalt von `redaktion/` einschließlich `index.html` und aller Assets;
- den eigenen unveränderten Featurezustand, ohne andere Schlüssel zu exportieren.

Der vorhandene Frontend-Workflow verwendet `mirror --delete`; ohne vorherigen vollständigen
statischen Backup darf er deshalb nicht ausgelöst werden.

## Reihenfolge nach Freigabe

### 1. Zwei additive Migrationen einzeln anwenden

Nur die oben genannten beiden SQL-Dateien, in genau dieser Reihenfolge, auf dem geprüften
Projekt anwenden und protokollieren. Migrationen über die Supabase-Migrationsschnittstelle
mit diesen Namen registrieren. **Nicht** pauschal `supabase db push` auf die gemeinsame
Historie anwenden: mehrere ältere Zeitstempel unterscheiden sich semantisch bereits
vorhandener FIB-Migrationen. Keine Memorix-Historie reparieren oder alte Runtime-Skripte
neu ausführen. Bei bereits vorhandenen Objekten Vertrag vergleichen, nicht löschen/erzwingen.

### 2. Drei FIB-Edge-Funktionen aktualisieren, Feature noch aus

Vorgeprüften Commit verwenden; relative `_shared`-Dateien einschließlich
`development-datasets.ts` und `source-readiness.ts` mit bündeln. Bestehende Gateway-JWT-
Einstellung erhalten. Gemeinsame Session-/Koordinations-/Ereignislesefunktionen sind
bytegleich und müssen nicht redeployed werden. Keine Projekt-Auth-Konfiguration verändern.

Nach dem Funktionsupdate kann die vorhandene menschliche Admin-Sitzung (AAL2) mit einem
privat bereitgestellten kurzlebigen Token und dem bestehenden Publishable-Key prüfen:

```bash
node scripts/ris-shared-apps/probe.mjs --expect=staged --out=/privater-pfad/readiness-aus.json
```

Die Umgebungsvariablen `FIB_ACCEPTANCE_USER_TOKEN` und `VITE_SUPABASE_PUBLISHABLE_KEY`
bleiben privat; keine Service-Role im Browser. Dieser Probe führt ausschließlich lesende
HTTP-/SQL-Aktionen aus. Erwartet: alle 19 Tabellen und Rechte vorhanden, Runtime `fib_app`,
Feature aus. Andernfalls stoppen und Backend zurücknehmen.

### 3. Genau die zwei FIB-Quellen freischalten

```bash
node --import tsx scripts/ris-shared-apps/sources.ts --out=/privater-pfad/quellen-plan.json
node --import tsx scripts/ris-shared-apps/sources.ts --apply --approval=FREIGABE-ID --out=/privater-pfad/quellen-angewendet.json
```

Der erste Aufruf ist lesend. Der zweite ändert ausschließlich `active` der zwei bestehenden
inaktiven amtlichen Quellen. Anzahl/Identität/Status werden geprüft. Vollständige private
Vor-/Nachher-Belege erlauben eine driftgeschützte Rücknahme. Keine automatische Erfassung oder Planung starten.

### 4. Originalbelege privat erfassen und markierten Bestand übernehmen

```bash
node scripts/ris-shared-apps/capture.mjs --out=/privater-pfad/ris-bundle.json
node --import tsx scripts/ris-shared-apps/prepare-data.ts --bundle=/privater-pfad/ris-bundle.json --out=/privater-pfad/daten-plan.json
```

Capture lädt nur sechs fest erlaubte Original-PDFs, validiert den bekannten Hash der
Niederschrift 75785, extrahiert mit unpdf und dokumentiert die reduzierten HTML-Referenzen.
Die Vorbereitung führte diesen tatsächlichen privaten Capture erfolgreich durch. Kein
öffentlicher PDF-Spiegel und keine erfundenen Ergebnisse. Den privaten Bundle-Hash aus
`daten-plan.json` fachlich/technisch prüfen, dann ausdrücklich anwenden:

```bash
node --import tsx scripts/ris-shared-apps/prepare-data.ts --apply --approval=FREIGABE-ID --bundle=/privater-pfad/ris-bundle.json --bundle-sha=GEPRUEFTER_HASH --out=/privater-pfad/daten-angewendet.json
```

Die Transaktion legt Batch und neu entstandene Objekte gemeinsam an. Vorhandene Daten
werden als Referenz behandelt, nicht als löschbares Eigentum. Die Parkraum-Beobachtung
muss bereits genau einmal vorhanden sein; sonst Abbruch und gesonderte Aktualisierung
über den freigegebenen Nachrichtenscanner. Keine Übernahme eines veralteten Hashs auf
bestehende Beobachtungen. Keine neue Quelle, kein neuer Vorgang/Thema/Benutzer und keine
vorweggenommene persönliche Bestätigung. Privaten Datenbeleg und DB-Manifest nach Erfolg prüfen.

### 5. FIB-Funktion aktivieren und Frontend bereitstellen

FIB-eigenen Schalter bewusst auf `true` setzen, **keine** Automation aktivieren. Anschließend:

```bash
node scripts/ris-shared-apps/probe.mjs --expect=enabled --out=/privater-pfad/readiness-an.json
```

Erwartet: `ready=true`, `fib_app` und erfolgreicher RIS-**Dry-run ohne Commit**. Dieser
Dry-run beweist keine gehostete PDF-Schreibverarbeitung; diese ist erst mit einem separat
protokollierten, freigegebenen begrenzten Scanner-Commit nachweisbar. Ein solcher Lauf ist
Testdatenverarbeitung, kein Scheduler. Bei Laufzeitfehlern sofort Feature aus und Backend
zurücknehmen; kein behaupteter Hosted-Nachweis aus einem simulierten Test.

Erst danach vorhandenen manuellen Workflow `Deploy Editorial Web` mit `confirmation=DEPLOY`
und `shared_development=true` auslösen. Er verwendet vorhandene IONOS-/Supabase-Konfiguration.
Ein Code-Merge allein deployt weiterhin nichts. Erwartete Adresse bleibt
**https://fib.pustivo.de/redaktion/**. Keine lokale Nutzerinstallation und keine neuen Konten.

### 6. Smoke-Test und persönliche Abnahme

Vorhandenes Konto, gewohnte MFA, Entwicklungskennzeichnung, Sitzungs-/Fundstellenliste,
Originalbeleg und Rücknavigation prüfen. Eine ausdrücklich vorgenommene Fundstellenübernahme
und ihre Marker im Batch kontrollieren. Bestehende normalen Ereignis-/Themenwege und bei
Bedarf eine unveränderte Memorix-Standardansicht prüfen, ohne Testschreibzugriff auf Memorix.
Keine Veröffentlichung erzeugen. Benutzerprüfung anschließend nach #356 durchführen.

## Sichere Rücknahme

Normaler Rückweg bei Fehlern: FIB-Feature aus; neue RIS-Aktionen sperren; vorherige drei
FIB-Edge-Versionen mit identischer JWT-Einstellung und vorherigen IONOS-Stand zurückspielen.
Keine Auth-Änderung, kein Projekt-Restore, kein `DROP SCHEMA`, kein globaler Reset.
Die beiden additiven Migrationen und die Daten bleiben zunächst erhalten.

Bei unverändertem Quellenzustand kann die genau dokumentierte Aktivierung zurückgenommen werden:

```bash
node --import tsx scripts/ris-shared-apps/sources.ts --apply --rollback --approval=RUECKNAHME-ID --receipt=/privater-pfad/quellen-angewendet.json --out=/privater-pfad/quellen-zurueck.json
```

Bei Drift wird abgebrochen. Vorhandene redaktionelle Änderungen nicht blind mit einem
Snapshot überschreiben. Ein echter Datenreparaturfall benötigt einen gesonderten,
präzisen FIB-Recoveryplan aus dem vorher isoliert verifizierten Dump. `auth-ids.json`
ist ausdrücklich keine Erlaubnis zum Wiederherstellen oder Verändern gemeinsamer Auth-Konten.

## Gezielte Bereinigung des neuen Abnahmebatches

Quellen-/Gremien-/Benutzer-/Vorgangs-/Themenstammdaten werden nicht Eigentum dieses Batches.
Neue RIS-/Quellenaktionen und Scanner markieren nur tatsächlich in ihrer Transaktion neu
angelegte Objekte. `xmin` plus vorherige Schlüssel verhindert die Übernahme gleichzeitig
von anderen Transaktionen erzeugter Daten. Nicht verwendete Request-Felder bestimmen keinen
Batch. Bei mehrdeutigem Kontext wird abgebrochen. Alte `demo-20261013`-Manifeste bleiben
unverändert; sie werden nicht pauschal in die neue Bereinigung adoptiert. Das zusätzliche
unmarkierte Ereignis sowie bestehende Beobachtungen/Monitorhistorie werden nicht gelöscht.

Vor Bereinigung: FIB-Feature aus, FIB-Wartungsfenster, frische Sicherung, **gesonderte
Bereinigungsfreigabe** mit konkretem privaten Plan. Zuerst Batch schließen, dann neu planen:

```bash
node --import tsx scripts/ris-shared-apps/cleanup.ts --batch=ris-abnahme-20261031 --apply --close --approval=BEREINIGUNGS-ID --out=/privater-pfad/batch-geschlossen.json
node --import tsx scripts/ris-shared-apps/cleanup.ts --batch=ris-abnahme-20261031 --out=/privater-pfad/loeschplan.json
```

Der lesende Plan enthält exakte markierte Zeilen, aktuelle Fingerprints, fehlende Zeilen
und blockierende unmarkierte Fremdverweise. Nach inhaltlicher Prüfung seines Hashs:

```bash
node --import tsx scripts/ris-shared-apps/cleanup.ts --batch=ris-abnahme-20261031 --apply --approval=BEREINIGUNGS-ID --plan-sha=GEPRUEFTER_HASH --out=/privater-pfad/bereinigung.json
```

Nur `owned`, niemals `reference`, wird entfernt. Alle eingehenden Fremdschlüssel – auch
CASCADE und schemübergreifende Verweise – werden geprüft. Veralteter Plan, fremder Verweis
oder ungeschütztes Ziel führt zu Rollback. Kurzzeitige exklusive FIB-Tabellensperren
verhindern Konkurrenz; keine unmarkierte CASCADE-Löschung. Die Dokument-/Versionsschleife
wird nur für eigene Dokumente gelöst. Historische Manifestmarkierungen bleiben als
Tombstones erhalten; der Batch wird `purged`. Spätere Echtdaten dürfen nicht unter einem
noch aktiven Entwicklungsbatch entstehen; Batch vor Umstieg ausdrücklich schließen.

## Prüfbelege und verbleibende Freigaben

Head `534e6b477af3831cd3b9965a8d7697d4e8378550` bestand **10/10 CI-Prüfungen**, einschließlich
[PostgreSQL 16/17 mit Sicherung/Restore](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41207745565)
und [tatsächlicher Auth/Deno-Gesamtintegration](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41207745562).
Nachfolgende Bedien-/Sicherheits-/Dokumentationskorrekturen werden vor Merge erneut geprüft.

| Akzeptanzfall | Status | Grenze |
|---|---|---|
| Tatsächlicher Istvergleich / Schema- und Rechteabgrenzung | bestätigt | ausschließlich lesende Inventur vom 31.10.; kein Login mit persönlichem Konto durchgeführt |
| Ownership, Konkurrenz, FK-/CASCADE-Schutz und sichere Bereinigung | bestätigt | reale isolierte PG16/17; keine Bereinigung in Shared-Apps ausgeführt |
| Snapshot-konsistenter FIB-Dump und isolierter Restore einschließlich ACL/RLS | bestätigt | synthetischer Datenbestand; aktuelle Shared-Sicherung erst vor genehmigter Änderung |
| Echte App-/Auth-/Deno-/DB-Integration und neue Marker | bestätigt | lokale echte Dienste, externe Quellenantworten kontrolliert simuliert |
| Originalbeleg-Capture | bestätigt | echte sechs PDFs privat geladen/extrahiert; HTML ist dokumentierter Referenzausschnitt |
| Bestehendes Shared-Apps-MFA wiederverwendbar | teilweise bestätigt | beide aktiven FIB-Mitglieder mit verifiziertem Faktor; Code unverändert; tatsächlicher Login/Smoke folgt nach Freigabe |
| Neue gehostete Funktionen / IONOS-Oberfläche / Datenübernahme | nicht geprüft | ausdrücklich noch nicht bereitgestellt |
| Persönliche fachliche Nutzerabnahme | nicht geprüft | #356 nach genehmigter Bereitstellung |

Die noch ausstehende Entscheidung ist die **ausdrückliche Freigabe dieses begrenzten
Bereitstellungspakets**, gebunden an den geprüften Merge-Commit und die oben genannten
Stop-Kriterien. Sie enthält weder eine fachliche Gesamtfreigabe noch eine automatische
Datenbereinigung oder RIS-Automatisierung. #281 und #336 bleiben offen.
