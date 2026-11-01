# RIS-Kalender: Integrationsabnahme für PR #371 (Vorbereitung)

Stand: 2026-11-01. **Nur Vorbereitungsplan, keine Produktionsfreigabe.**

## Ausgangslage

- PR #371 / Branch `fix/ris-unresolved-proposal-370`, zuletzt lokal geprüfter Commit `8455c19`.
- Lokaler U4-Teststand: vollständig grün auf `c987de4`; gezielter historischer Cursor-/Fault-Injection-Test grün auf `8455c19`.
- RIS-Kalender Oktober 2026: Live-IDs 1030, 1031, 1078, 1032 nachgewiesen. November: Seite erreichbar, keine Sitzungen gefunden.
- Shared-Apps-Projekt `apaubomxffcwtzjimori`, ausschließlich Schema `fib`. Inventur lesend: `ris_sessions=2`, `ris_agenda_items=5`, `ris_proposals=5`, `ris_scan_cursors=1` (Prüfung 01.11.2026). RIS-Dokumentlisten-Scope `candidate`, letzter gespeicherter erfolgreicher Lauf 30.10.2026 16:49:22 UTC.
- Bisherige Referenzsitzungen sind keine Vollständigkeitsbestätigung. RIS-Feature derzeit aus; keine Automation.

## Freigabefähiger Testumfang (Vorschlag)

Nach gesonderter Freigabe und frischer Release-Sicherung **nur** das FIB-eigene `fib-u4-ris-pilot`-Backend am genehmigten, gemergten Commit bereitstellen; Gateway-JWT und Shared-Auth unverändert lassen. Erst einen authentifizierten Admin-Dry-run ohne Commit durchführen und Logs/Status prüfen. Bei HTTP 502, unerwarteten Cursorfehlern oder fehlender Quellenabdeckung stoppen und Feature aus belassen.

Erst nach erfolgreichem Dry-run einen **explizit begrenzten** `commit:true`-Durchlauf anstoßen, danach einen zweiten zur Fortsetzung. Ausschließlich im Schema `fib`, Scope `ris-dokumentliste`, keine veröffentlichten redaktionellen Objekte und keine Benutzer-/MFA-/Memorix-Änderungen. Im Entwurfs-PR existiert dafür nun der ausdrücklich gesperrte Einzeltest `integrationSession: "1032"` zusammen mit `commit: true`. Er ist ausschließlich im interaktiven AAL2-Adminpfad erlaubt und benötigt zusätzlich `FIB_RIS_INTEGRATION_TEST_ENABLED=true`. Dieser gesondert freizugebende FIB-Schalter steht **nicht** automatisch im Echtsystem auf true. Andere Sitzungs-IDs, Dry-run und Scheduler-Zugriff werden abgewiesen. Dieser Pfad ruft ausschließlich die Sitzungsseite 1032 ab und schreibt die darauf basierenden Sitzungs-/TOP-/Vorlagen- und Dokumentreferenzen innerhalb einer Transaktion; er verändert weder RIS-Scan-Cursor noch Dokumentlistenbeobachtungen und lädt keine PDF-Inhalte. **Der neue Pfad ist noch nicht gehostet getestet.** Vor Nutzung ist die neue Funktion samt Schalter in der konkreten Freigabe ausdrücklich aufzuführen, anschließend den Schalter wieder deaktivieren.

## Messpunkte vor und nach jedem Lauf

1. Anzahl und Identitäten `fib.ris_sessions` nach `source_url`, `fib.ris_agenda_items` nach `session_id,source_key`, `fib.ris_proposals` nach `agenda_id,source_url`, `fib.ris_documents` und `fib.ris_document_versions`. Referenzbatch unverändert.
2. Versionierung `fib.ris_session_versions` (`session_id,revision,content_hash`): gleicher Quellinhalt erzeugt keine zusätzliche Revision; geänderter Inhalt wird als neue Revision festgehalten.
3. `fib.ris_scan_cursors.cursor_state`: `pending`, `failures`, `structureState.queue`, `structureState.sessions`, `structureState.historyNext`; Commit muss den Checkpoint fortsetzen und Fehlerlücken sichtbar halten. Dry-run darf keinen Wert verändern.
4. `fib.source_runs` und `fib.source_scopes`: Status, Fehlermeldung, letzte erfolgreiche Prüfung. **Kalenderabdeckung** und **Dokumentenlistenabdeckung** getrennt interpretieren.
5. Doppelzählung/Drift: keine Duplikate in fachlichen Schlüsseln, keine Löschung oder Überschreibung redaktionell bestätigter Werte, keine externen Rechteänderungen.

## Fehler- und Stop-Kriterien

- Der `do0040.asp?smcmode=32832`-Einstieg war zeitweise nicht erreichbar. Ein fehlgeschlagener Lauf darf **nicht** als vollständig bestätigt werden; offener Cursor/Fehler muss erhalten bleiben. Keine ungeprüfte historische Ersatz-URL verwenden.
- Historisches Monats-Backfill derzeit technisch begrenzt bis Januar 2024. Fachlicher Umfang und Vollständigkeitsgrenze offen; kein "alle Sitzungen erfasst" ausgeben.
- HTTP-5xx, unvollständige Sitzungsstruktur, PDF-Ausfall, Konflikt bei Cursor-Aktualisierung oder unerwartete Datenbankänderungen: sofort stoppen, Feature deaktiviert lassen bzw. deaktivieren, Daten sichern und kontrolliert rücknehmen. Keine stille Wiederholung mit höher privilegiertem Konto.
- Bestehende FIB-Benutzer/MFA, Memorix, `public`/`auth`, Scheduler, Cron, automatische Veröffentlichungen und Frontend sind **nicht Bestandteil** dieses Schreibtests.

## Verbindliche Gates vor einem Schreibtest

1. PR #371 fachlich/technisch prüfen, CI-Nachweise und finalen Merge-Commit dokumentieren.
2. Freigabe des konkreten aktualisierten Pakets (alte Freigabe `7a73db...` reicht nicht).
3. Nach `docs/operations/u4-shared-apps-release-plan.md` eine **neue** vollständige Release-Sicherung mit Restore-/Rücklese-Nachweis und Sicherung der aktuellen Edges/IONOS-Versionen erstellen; Rollbackweg bereitstellen.
4. Berechtigter vorhandener Admin-Zugang mit AAL2, `fib_app`-Readiness und unveränderte JWT-Gatewayparameter nachweisen.
5. Erst dann explizit genehmigten Release-/Testschritt durchführen und Nachher-Sicht abgleichen.

**Status:** Vorbereitungsplan fertig; echter PostgreSQL-Test nicht begonnen, PR ungemergt, Feature aus.
