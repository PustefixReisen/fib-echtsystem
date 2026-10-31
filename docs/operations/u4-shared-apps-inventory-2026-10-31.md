# RIS – lesender Bestandsabgleich Shared-Apps

| Version | Stand | Verantwortung |
|---|---|---|
| 1.0 | 31.10.2026 | Josef Walter – mit KI-Unterstützung |

## Aussage und Nachweis

Auftrag #357, Folge von #353/#355/#356, Basis `main`:
`36efc0f0ae991725c637104152abbaae9e815041`. Ausschließlich lesende Zugriffe auf
Projektmetadaten, Migrationen, Funktionsdateien, PostgreSQL-Kataloge/Bestandszählungen,
Advisories und öffentlich ausgelieferte Frontenddateien. **Keine Änderung an Shared-Apps.**
Die [maschinenlesbare Bestandszusammenfassung](evidence/shared-apps-ris-inventory-2026-10-31.json)
enthält Metadaten und Zählungen, keine Konten, Kennwörter, MFA-Schlüssel oder Artikel-/PDF-Texte.

## Implementiert – getestet – bereitgestellt

| Gegenstand | Repository / isoliert getestet | Tatsächlich bereitgestellt / noch erforderlich |
|---|---|---|
| Plattform | Shared-Apps, Schema `fib` nach ADR-011 | `apaubomxffcwtzjimori`, Region eu-west-3, ACTIVE_HEALTHY, PostgreSQL **17.6.1.155** |
| FIB-Basis / U4 | Basis, Koordination, Quellenbeobachtungen, Cursor, Tages-/Wochenkadenz | 29 FIB-Tabellen mit RLS; Quellen-/Cursor-/Kadenzmigrationen vorhanden |
| Persistente RIS-Struktur | Migration `20261031081340_fib_ris_editorial_structure.sql`, 17 Tabellen | **Fehlt**; `fib.ris_sessions` nicht vorhanden |
| Testdatenmanifest | neue Migration `20261031132655_fib_development_dataset_manifest.sql` mit 2 FIB-Tabellen | **Fehlt**, nur vorbereitet; keine neue Benutzer-/Loginrolle |
| Redaktioneller Quellen-/RIS-Workflow | PR #348–#353 und neue Markierung/Readiness in #358 | `fib-editorial-write` v8 ist älter; Update erforderlich, `verify_jwt=false` wie bisher mit eigener serverseitiger Auth/MFA |
| RIS-Scanner | Persistenz, Änderungen und Markierung vorbereitet | `fib-u4-ris-pilot` v12 ist älter; Update erforderlich, `verify_jwt=true` beibehalten |
| Gemeinde-Scanner | aktueller gemeinsamer Artikelpfad plus Markierung vorbereitet | `fib-u4-pilot` v2 ist älter; Update erforderlich, `verify_jwt=true` beibehalten |
| Bestehende Auth-/Koordinationsanbindung | vorhandene FIB-Funktionen | `fib-session-context` v3, `fib-coordination` v2 und `fib-get-event` v13 einschließlich `shared.ts` **bytegleich** mit Basis-main; kein Redeployment dafür erforderlich |
| Redaktionsoberfläche | Sitzungen/Fundstellen/Übergänge in main implementiert | IONOS liefert `index-B1BmuZ81.js`; enthält weder `source_list` noch `ris_read`, neues Frontend erforderlich. Erwarteter Projektbezug vorhanden. |
| Amtliche Quellen | bestehende Entwicklungsquellen wiederverwenden | RIS und Gemeinde stehen auf `active=false`; genau zwei bewusste FIB-Flagänderungen erforderlich |
| Automatisierung | gesondertes Arbeitspaket #336 | kein `pg_cron` und keine Relation `cron.job`; keine GitHub-Cron-Definition im Repository; Scheduler-Function nicht bereitgestellt. Externe fremde Scheduler wurden nicht inventarisiert. Keine Aktivierung vorgesehen. |

Die globale Migrationshistorie enthält auch Memorix. Einige tatsächlich angewendete
FIB-Versionen unterscheiden sich im Zeitstempel von den Repository-Dateinamen:
beispielsweise Quellenbeobachtungen `20261030103007` statt `20261030093000`, Cursor
`20261030132007`, Cursor-RLS `20261030133940` und Kadenz `20261030161632`.
Die zugehörigen Tabellen/Spalten und Policies sind vorhanden. Diese Einträge dürfen
nicht als pauschal fehlende Migrationen gewertet werden. **Kein ungeprüftes `db push`,
keine komplette Migration-/Runtime-Neuinstallation und keine globale History-Reparatur.**

## Datenbestand und Kennzeichnung

Gemessen: 3 Quellen, 13 Fundstellen, 8 Ereignisse, 4 Vorgänge, 1 Thema und 7 Meldungen.
Keine Meldung hat ein Veröffentlichungsdatum. 13 Fundstellen und 7 Ereignisse tragen
die bisherige Entwicklungskennzeichnung; das zusätzliche Ereignis wird nicht allein
aufgrund der fachlichen Testdaten-Einordnung als löschbar adoptiert.

Quellenscopes bleiben Kandidaten: Gemeinde-Archiv 0 Beobachtungen, Gemeinde-Nachrichten
14, RIS-Dokumentliste 94. Die Parkraumkonzept-Beobachtung ist bereits vorhanden und
wird wiederverwendet. Vorhandene Beobachtungen werden nicht mit einem älteren
Referenzfingerprint überschrieben. Quellen, Vorgänge, Themen und Benutzer werden nicht
als neue Stammdaten dupliziert. Der neue RIS-Batch legt zunächst Quellenstruktur und
Belege an, **keine automatisch bestätigten Beschlüsse, Ereignisse oder Meldungen**.

## Rechte, Auth und Memorix

`fib_runtime` ist NOLOGIN, ohne Superuser/BYPASSRLS. `fib_app` ist LOGIN, ebenfalls ohne
Superuser/BYPASSRLS, und Mitglied von `fib_runtime`. Gemessen für `fib_app`: kein
SELECT/INSERT auf öffentliche Tabellen und kein SELECT auf `auth.users`. `anon`,
`authenticated` und `service_role` haben keine Schema-USAGE auf `fib`.
Neue Rechte sind auf die 17 RIS-Tabellen und das append-only FIB-Manifest begrenzt;
keine Erweiterung nach `public`, `auth`, keine neue Rollenmitgliedschaft oder Default-Grants.

Aggregiert geprüft: ein aktiver FIB-Admin und ein aktiver FIB-Editor, jeweils mit
verifiziertem MFA-Faktor. Es wurden keine Identitäten oder Faktorwerte ausgelesen.

Bestehende Konten, Passwörter, Faktoren, Auth-Konfiguration und gemeinsame Schlüssel
werden unverändert verwendet. Die drei bytegleichen FIB-Funktionen bestätigen die
Code-Kontinuität. Ein tatsächlicher persönlicher Login wurde bei dieser lesenden
Inventur ohne Zugangsdaten **nicht** durchgeführt. Die tatsächlich konfigurierte
Runtime-DSN ist nicht ausgelesen; nach genehmigtem Funktionsupdate prüft die neue
Admin-Aktion `source_readiness`, dass die Verbindung wirklich als `fib_app` läuft.

## Vorbestehende Advisories und offene Betriebsnachweise

Der Security-Advisor meldet vorbestehende Befunde: Security-Definer-View
`public.v_keepalive_status`, öffentliche Security-Definer-Routinen, zwei FIB-Trigger
mit veränderlichem `search_path`, weitere öffentliche Suchpfade, fehlende Policies auf
zwei gesperrten öffentlichen Tabellen und deaktivierte Leaked-Password-Prüfung.
Diese Bestandsbefunde sind **nicht durch RIS neu entstanden und nicht hier repariert**.
Änderungen in `public` oder Auth könnten Memorix betreffen und benötigen eigene Prüfung/Freigabe.

Primäre Hinweise:
[Definer-Views](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view),
[Suchpfade](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable),
[Definer-RPC-Rechte](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable),
[Passwortprüfung](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
Die Freigabe bewertet den unveränderten Bestand mit; sie ist keine pauschale Sicherheitsfreigabe
für alle Anwendungen des Projekts.

Nicht nachgewiesen: bestehende Secretwerte, aktuelle private IONOS-/Nextcloud-Zugänge,
eine tatsächliche aktuelle Shared-Apps-Sicherung sowie gehostete neue Edge-Ausführung.
Diese werden nicht durch isolierte CI-Ergebnisse ersetzt. Der nächste Schritt ist die
[begrenzte Bereitstellungsentscheidung](u4-shared-apps-release-plan.md), keine neue Testinstallation.
