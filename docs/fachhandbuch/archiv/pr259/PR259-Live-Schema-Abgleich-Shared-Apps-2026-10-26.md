# PR #259 – Live-Schema-Abgleich Shared-Apps (nur lesend)

**Stand 26.10.2026.** Inspektion des bestehenden Supabase-Projekts **Shared-Apps** durch reine Metadatenabfragen (`information_schema.columns`, Tabellen-/Migrationsliste). **Keine Änderung an SQL-Schema, Daten, Benutzern, Rechten oder Memorix.** Die Prüfung umfasst Schema `fib`, keine Nutzdaten und keine API-/Browsertests.

## Ergebnis: tatsächliche FIB-Datenbankstruktur

- Die FIB-Tabellen existieren bereits, die bisherigen Themenbeitragsmigrationen sind **angewandt**: unter anderem `topic_contribution_drafts`, `topic_contribution_versions`, `topic_publications`, `topic_revisions`, `topic_currency_checks`.
- Auch `local_link_status_model`, `fib_topic_safe_delete` und `process_topic_proposals` erscheinen in der angewandten Migrationshistorie. Das bestätigt **nur den DB-Migrationsstand**, nicht die erfolgreiche funktionale Prüfung oder den vollständigen UI-Stand.
- `fib.events` besitzt nach Metadatenabfrage `id,title,summary,status,occurred_at,confirmed_at,merged_into_event_id,created_at,updated_at`. Ein eigenes `provisional`-Feld oder eigenständiger Vorläufigkeitsstatus ist in dieser Tabelle **nicht sichtbar**. Eine Vorläufigkeit über andere Modelle/Services ist vor Änderung weiter zu prüfen.
- `fib.processes` besitzt `id,slug,title,description,current_state,status,created_at,updated_at`. Die geprüfte Tabellenliste zeigt keine gesonderten Tabellen für **Vorgangsbeitragsentwürfe, -versionen und -publikationen**.
- Für `fib.findings` sind die Felder für Quelle und Publikationsrechte vorhanden, aber **kein eigenes vierstufiges Prüfstatusfeld** in der abgefragten Tabelle.
- `fib.sources` besitzt `active:boolean`; eine eigene vollständige Statusmaschine **Kandidat/Aktiv/Pausiert/Beendet/Abgelehnt** und getrennte Pflichtquellen-Eigenschaft ist in der Tabelle nicht abgebildet.
- Separate `Vertiefungsfrage`-/`Vertiefungsantwort`-Tabellen und ein eigenständiger Analysefreigabestand sind in der abgefragten Liste nicht vorhanden.
- Themenbeitrag und Themenstatus sind bereits **technisch realisiert**, aber dieser Bericht ist **keine** Bestätigung, dass die neue getrennte Themenanalyse-Teilfreigabe bereits existiert oder sämtliche Statusübergänge korrekt funktionieren.

## Daraus folgende Entwicklungspriorität

1. **Datenvertrag Ereignis-Vorläufigkeit** definieren und schreibseitig absichern, ohne bestehende bestätigte Ereignisse zu gefährden.
2. **Fundstellen-/Quellen-Prüfstatus** einschließlich Pflichtquellen und Audit nachvollziehbar ergänzen; Datenmigration alter Datensätze nur nach Prüfung.
3. **Vorgangsbeitrag** mit eigenständigen Arbeitsfassungen, Freigaben und öffentlicher Publikationshistorie ergänzen.
4. **Analysemodell/Teilfreigabe** für Vorgänge und Themen versionierbar umsetzen; vorhandene Themenbeitragsversionierung als bestehende, eigenständige Ebene respektieren.
5. **Mehr-wissen-Modell** mit Meldung/Vorgang/Thema als zulässigen exklusiven Kontexten umsetzen.
6. Öffentliche Ausspielung, RIS, KI-Recherche und UI nach geschütztem fachlichem Schema erweitern.

**Kontrollpunkt:** Vor jedem DDL die tatsächliche Tabellen-/Constraint-/Policy- und Funktionsstruktur erneut prüfen. Die bereits angewandten Migrationen nicht ersetzen, nachträglich umbenennen oder ohne Migrations- und Rollbackplan überschreiben. Alle neuen Tabellen/Policies ausschließlich in `fib`, minimale Rechte, keine Änderung von `public` oder gemeinsamem Auth-Projekt.

**Aussagegrenze:** Live-Schema **teilweise verifiziert**, bestehende Funktionsfähigkeit, Migrationseffekte und CI-Tests **nicht** nachgewiesen.
