# RIS-Redaktion #377 – technischer Abschluss und Bereitstellung

Stand: 02.11.2026. Führender Betriebsablauf bleibt
[u4-shared-apps-release-plan.md](u4-shared-apps-release-plan.md).
Diese Ergänzung beschreibt ausschließlich das Paket aus PR #378.

## Ergebnis und fachliche Grenzen

- Markierbare TOP-/Dokument-/Ereignistitel; getrennte zugängliche Navigations-,
  Vorschau- und Entfernen-Icons, responsive Tagesordnung und lokale Ereignissuche.
- Eigenständige Such-/Erfassungsansichten ohne Pflichtbegründung oder Pflichttyp für
  lokale Bezüge. Vorhandene Ereignisse und neue Ereignisse werden direkt verbunden.
- Dokument-Fundstelle und TOP haben getrennte Ereignisbeziehungen. Mehrfachzuordnung,
  Entfernen ohne Ereignislöschung und Rückkehr zum ursprünglichen TOP sind implementiert.
- Automatische, wiederholbare Fundstellenanlage ohne automatische Ereignis-, Meldungs-
  oder Beschlussanlage. Dokumenttyp, Sitzungsdatum, Vorlagennummer und RIS-Titel bilden
  einen Anzeigetitel; Originalmetadaten bleiben getrennt erhalten.
- Berechtigte Original-PDFs und extrahierter Text werden je konkreter Fassung gespeichert.
  Private Vorschau aus FIB-Speicher; Original-RIS-Ausfall verhindert ihren Abruf nicht.
  Ungeklärte/fremde Urheberschaft erlaubt ausschließlich Metadaten und Originallink.

Architektur, Alternativen und Rechtevertrag:
[ADR-012](../decisions/ADR-012-RIS-Originale-und-Ereignisbeziehungen.md).

## Migration und Ressourcen

`20261102221038_fib_ris_originals_and_editorial_links.sql` wurde mit der Supabase-CLI
angelegt. Sie ergänzt Originaltitel, fassungsspezifische Rechte-/Storage-Metadaten,
Constraints/Unveränderlichkeitsschutz und enge Runtime-Rechte. Lokale TOP-Bezüge
werden optional begründet und dürfen gezielt entfernt werden. Neuer privater
Bucket: `fib-ris-originals`, PDF-MIME-Typ und 25-MB-Limit, keine direkten Browser-Policies.
Keine Änderung an `public`, Auth, Memorix, `event-media`, Cron oder gemeinsamen Secrets.

**Vor Anwendung:** aktuelle vollständige private Sicherung und tatsächliche
Restoreprüfung nach dem Release-Plan. Die Migration entfernt bestehende
`extracted_text`-Werte ohne dokumentierten fassungsspezifischen Rechtenachweis.
Identitäten, Hashes und Beziehungen bleiben erhalten. Dieser Schritt ist keine
verlustfreie additive Migration und wurde auf Shared-Apps nicht ausgeführt.

Die Bestandsaufnahme ergab sechs RIS-Dokumente/sechs Fassungen ohne PDF-Storage-
Metadaten; `finding_id` war jeweils leer. Der vorhandene Bucket `event-media` gehört
nicht diesem RIS-Speicher. Vor der Bereitstellung eine frische Inventur erstellen.

## Konkrete Reihenfolge nach technischer Prüfung und Betriebsfreigabe

1. Geprüften Merge-Commit festhalten; vorhandenes FIB-Wartungsfenster und Backup/Restore
   nach dem führenden Plan. FIB-RIS-Schreibwege sperren, gemeinsame Anwendungen erhalten.
2. Nur die oben genannte neue Migration anwenden; keine pauschale gemeinsame Migration,
   kein Schema-Reset. Privaten Bucket und fehlende anon/authenticated-Policies prüfen.
3. Die tatsächlich betroffenen FIB-Funktionen mit allen relativen Modulen bereitstellen:
   `fib-editorial-write`, `fib-u4-ris-pilot`, `fib-u4-pilot` (letztere verwendet ebenfalls
   die gemeinsame Dataset-Unterstützung; zusätzlich präzisierte Typisierung).
   Tatsächliche vorherige `verify_jwt`-Einstellungen beibehalten. Keine Auth-Änderung.
4. Bestehende Dokument-Fundstellen über den vorhandenen Importdienst nachtragen:

   ```bash
   node --import tsx scripts/ris-shared-apps/backfill-ris-findings.ts --out=/privat/ris-fundstellen-plan.json
   node --import tsx scripts/ris-shared-apps/backfill-ris-findings.ts --apply --approval=FREIGABE --plan-sha=GEPRUEFTER_HASH --out=/privat/ris-fundstellen-angewendet.json
   ```

   Vorhandene Quellen/Fundstellen werden wiederverwendet, Mehrdeutigkeiten brechen ab.
   Neue Zeilen erhalten die bestehenden Entwicklungsbatch-Marker, soweit ihre
   Ausgangsfassung einem aktiven Batch zugeordnet ist.
5. Readiness v2 prüfen: bestehende 19 Tabellen, `fib_app`, neue Rechte-/Storage-Spalten
   und Runtime-Rechte. Erst dann FIB-Funktion freischalten und geprüften Frontend-Build
   über den vorhandenen manuellen Workflow bereitstellen. Kein Scheduler/Cron.
6. In der normalen Redaktion die konkrete Speicherberechtigung der Referenzfassung
   dokumentieren. „Bestätigtes Original speichern“ lädt und verifiziert genau diesen
   Hash und speichert PDF/Text zusammen. Bei geänderter Quelle abbrechen und aktuellen
   Import prüfen; keine fremde Fassung stillschweigend übernehmen.
7. Hosted Smoke-Test mit bestehendem Konto/MFA, wirklichem privaten Storage und
   Referenzsitzung durchführen; danach persönliche fachliche UI-Abnahme.

Das frühere private Capture-Skript verlangt nun `FIB_RIS_RIGHTS_MANIFEST`: eine private
Liste mit `url`, `sha256`, `contentAuthor` (`municipality`/`licensed`) und `evidence`.
Eine RIS-Adresse oder der Dokumenttyp allein genügt nicht. Der historische
`prepare-data`-Weg importiert ohne entsprechende Byte-/Rechtezuordnung nur Metadaten.

## Sicherung, Rücknahme und Bereinigung

Die SQL-Sicherung führt `risOriginals` aus derselben exportierten Sicht wie `fib.dump`.
Für jede referenzierte Originaldatei muss das private Release-Bundle
`originals/Dokument-ID/Versions-ID/Hash.pdf` mit passendem Hash und Umfang enthalten.
`scripts/backup/ris-originals.mjs --bundle=/privat/bundle` exportiert über die bestehende
AAL2-Schnittstelle; Token nur privat als `FIB_ACCEPTANCE_USER_TOKEN`, Publishable-Key wie
bisher. Der automatische Gesamtbackup akzeptiert diese Dateien als geprüften privaten
Input; fehlende/abweichende Originale sperren die Versiegelung. Kein RIS-Neuabruf.

Rücknahme: FIB-RIS-Funktion sperren, vorherige FIB-Funktionen und statische Redaktion
zurückspielen. Keine DB-/Storage-Löschung, kein Projekt-Restore und keine Rücknahme auf
Code, der unkontrolliert Volltexte speichert. Additive Metadaten und berechtigte
Originale erhalten; entfernte ungeklärte Volltexte nicht ohne Rechtsprüfung restaurieren.

Vor einer gezielten Entwicklungsbatch-Bereinigung die betreffenden Originalfassungen
über den geschützten Rechtewiderruf entfernen. Die SQL-Bereinigung blockiert andernfalls,
auch für möglicherweise nach SQL-Rollback vorhandene Originaldateien. Keine pauschale
Bucket-Löschung oder Übernahme fremder Stammdaten.

## Technische Nachweise und Grenzen

Die tatsächlichen Ergebnisse und CI-Referenzen werden im Abschlussbericht zu PR #378
festgehalten. Die Prüfarten bleiben getrennt:

| Prüfumfang | Beleg / Grenze |
|---|---|
| Fachservices/Verträge | Bestehende U4-/Core-Tests und TypeScript-Prüfung |
| Datenbank | Reale isolierte PostgreSQL-Tests mit FIB-Runtime/RLS, Wiederholung, Versionen, Original/Text-Paar, Fehler/Rollback/Widerruf und Fremdschema-Sentinel |
| Komponentenbrowser | Echte React-Komponenten in Chromium, simulierte API-/Sperrdienste; getrennte Beziehungen, neue Ereignisse, Rücknavigation, Blob-Vorschau, mobile Darstellung |
| Gesamt-App | Isolierter echter Auth-/TOTP-Login, reale Deno-Handler und PostgreSQL; RIS- und Storage-Transport kontrolliert simuliert |
| Shared-Apps / Hosting | Neue Migration, Bucket, Funktionen und Frontend noch nicht bereitgestellt; keine reale Storage-Prüfung behauptet |
| Firefox / Druck / Kopieren | Nicht bestätigt. Browserdownload hier durch Netzwerkpolicy „Domain forbidden“ gesperrt; persönliche Prüfung am Zielsystem erforderlich |

Die lesend abgerufenen Sicherheitsadvisories enthalten bereits vorhandene Hinweise in
`public` sowie zwei FIB-Funktionen mit veränderlichem Suchpfad. Keine fremden Objekte
wurden geändert. Die neue Guard-Funktion verwendet `search_path=''`, kein
`SECURITY DEFINER`, keine öffentlichen Ausführungsrechte.

**Externe Betriebsgrenzen:** Es fehlen ein nachgewiesenes aktuelles vollständiges
Release-Backup samt Restore und der private bestehende Maintenance-/AAL2-Zugang für
Hosted-Prüfung und Einspielung. Der Release-Plan verlangt eine ausdrückliche
Betriebsfreigabe für den konkreten geprüften Merge-Commit. Eine persönliche
fachliche Abnahme wird durch keinen automatisierten Test ersetzt.

## Persönliche UI-Abnahme nach Bereitstellung

1. Mit dem vorhandenen Konto und MFA `https://fib.pustivo.de/redaktion/` öffnen.
   Sitzung 29.10.2026, TOP 2 und TOP 3 wählen. Titel mit der Maus markieren/kopieren;
   ausschließlich Pfeile öffnen Objekte. Vorlagen bleiben von Beschlüssen getrennt.
2. Zulässigerweise gespeichertes Original über das Vorschau-Icon öffnen. In Firefox
   lesen, blättern, zoomen, Text markieren/kopieren und drucken. In den
   Entwicklerwerkzeugen ausschließlich Anfragen an die RIS-Domain blockieren;
   erneut aus FIB öffnen. Schließen muss exakt zum aufrufenden TOP zurückführen.
3. „Neu: Lokaler Bezug“: suchen, ohne Begründung/Typ zuordnen, bereits zugeordneten
   Treffer erkennen, Verbindung entfernen und das fortbestehende Ereignis prüfen.
   Danach ein neues Ereignis auf der eigenen Erfassungsseite speichern.
4. Dokumentfassung/Fundstelle öffnen → „Neu: Ereignisbezug“: vorhandenes Ereignis
   verbinden; weitere Fundstelle demselben Ereignis zuordnen und ein neues Ereignis
   aus vorbelegten Dokumentdaten anlegen. TOP-Bezug bleibt eigenständig.
5. Rückkehr zum ursprünglichen TOP, Tastaturfokus und schmale/mobile Darstellung prüfen.
   Ungeklärte/fremde Fassung darf keine gespeicherte Volltext-/PDF-Vorschau anbieten.
   Ergebnis und eventuelle Abweichungen in #377 festhalten; keine Meldung veröffentlichen.
