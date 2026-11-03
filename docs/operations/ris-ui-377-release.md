# RIS-Redaktion #377 – technischer Abschluss und Bereitstellung

Stand: 03.11.2026 (Europe/Berlin), Auftrag vom 02.11.2026. Führender Betriebsablauf bleibt
[u4-shared-apps-release-plan.md](u4-shared-apps-release-plan.md).
Diese Ergänzung beschreibt ausschließlich das Paket aus PR #378.

## Entwicklungsbetriebsregel und ausdrückliche Freigabe – 03.11.2026

Der [Auftraggeber hat das Entwicklungsverfahren bestätigt](https://github.com/PustefixReisen/fib-echtsystem/pull/378#issuecomment-6597723230) und Merge sowie Entwicklungsbereitstellung von PR #378 ausdrücklich genehmigt. Es liegen noch keine produktiven redaktionellen Echtdaten vor. Für diese Bereitstellung werden die vorhandenen 10/10 erfolgreichen CI-Workflows genutzt; reine Dokumentationsänderungen verlangen keine neue vollständige Testserie.

Eine **aktuelle FIB-Sicherung mit vorhandener Routine und Integritätsprüfung** genügt vor der gezielten Migration. Kein erneuter vollständiger Restore ohne konkreten Anlass, kein aufwendiges Wartungsfenster und keine zusätzlichen Zwischenfreigaben. Die Entfernung ungeklärter historischer extrahierter Texte ist nach Sicherung ausdrücklich zulässig. Ein kurzer gezielter Hosted-Funktionstest genügt zunächst; die persönliche fachliche UI-Abnahme bleibt beim Auftraggeber.

Die Unterscheidung **Entwicklung / Pilot / Produktiv** und die weitergeltenden strengeren Anforderungen für Pilot/Produktiv stehen verbindlich im [führenden Release-Plan](u4-shared-apps-release-plan.md#verbindliche-entwicklungsfreigabe-für-pr-378--03112026). Die Vereinfachung betrifft nur FIB. Schutz von Memorix/anderen Anwendungen, unveränderte gemeinsame Auth-/MFA-Regeln, private Storage-Zugriffe und bestehende Berechtigungsgrenzen bleiben bestehen.

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

**Vor Anwendung im Entwicklungsbetrieb:** aktuelle private FIB-Sicherung und Integritätsprüfung mit vorhandener Routine; erneuter vollständiger Restore nur bei begründetem Risiko. Für Pilot/Produktiv gilt der strengere Release-Plan. Die Migration entfernt bestehende
`extracted_text`-Werte ohne dokumentierten fassungsspezifischen Rechtenachweis.
Identitäten, Hashes und Beziehungen bleiben erhalten. Dieser Schritt ist keine
verlustfreie additive Migration und wurde auf Shared-Apps nicht ausgeführt.

Die Bestandsaufnahme ergab sechs RIS-Dokumente/sechs Fassungen ohne PDF-Storage-
Metadaten; `finding_id` war jeweils leer. Der vorhandene Bucket `event-media` gehört
nicht diesem RIS-Speicher. Vor der Bereitstellung eine frische Inventur erstellen.

## Konkrete Reihenfolge nach technischer Prüfung und Betriebsfreigabe

1. Geprüften Merge-Commit festhalten; aktuelle FIB-Sicherung und Integrität nach der Entwicklungsregel prüfen. Kein aufwendiges Wartungsfenster. Bei konkreter Schreibkonkurrenz FIB-Aktionen kurz koordinieren; gemeinsame Anwendungen erhalten.
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
   über den vorhandenen manuellen, nichtlöschenden Frontend-only-Workflow bereitstellen; strengere Pilot-/Produktiv-Gates nicht deaktivieren. Kein Scheduler/Cron.
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

Implementierungsstand `011bfc86d783e39e6e3acb70c5de352da5071471`: **10/10 CI-Workflows erfolgreich**.
Der nachfolgende Dokumentationsstand ändert keine Laufzeitfunktionen.
Merge-Commit und Betriebsfreigabe werden am [bestehenden PR #378](https://github.com/PustefixReisen/fib-echtsystem/pull/378)
nachgeführt; das Issue bleibt bis zur persönlichen Abnahme offen. Die Prüfarten bleiben getrennt:

| Prüfumfang | Beleg / Grenze |
|---|---|
| Fachservices/Verträge | Bestehende U4-/Core-Tests und TypeScript-Prüfung |
| Datenbank | Reale isolierte PostgreSQL-Tests mit FIB-Runtime/RLS, Wiederholung, Versionen, Original/Text-Paar, Fehler/Rollback/Widerruf und Fremdschema-Sentinel |
| Komponentenbrowser | Echte React-Komponenten in Chromium, simulierte API-/Sperrdienste; getrennte Beziehungen, neue Ereignisse, Rücknavigation, Blob-Vorschau, mobile Darstellung |
| Gesamt-App | Isolierter echter Auth-/TOTP-Login, reale Deno-Handler und PostgreSQL; RIS- und Storage-Transport kontrolliert simuliert |
| Shared-Apps / Hosting | Neue Migration, Bucket, Funktionen und Frontend noch nicht bereitgestellt; keine reale Storage-Prüfung behauptet |
| Firefox, native PDF-Vorschau | Bestätigt im vorhandenen CI: echtes Firefox, native PDF.js-Anzeige der FIB-Bytes bei simuliertem RIS-Ausfall, Textauswahl, Zoom sowie Seiten-/Druckbedienelemente. PDF-Anzeige im Browserprofil ausdrücklich aktiviert; keine zusätzliche Viewer-Bibliothek |
| Zwischenablage / tatsächlicher Druck / fachliche Abnahme | Betriebssystem-Zwischenablage und tatsächlicher Druckauftrag nicht bestätigt; persönliche Prüfung am Zielsystem erforderlich |

Konkrete CI-Belege dieses Implementierungsstands:

- [Gesamt-App in Chromium und Firefox, einschließlich n:m-Beziehungen und Originalvorschau](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541919995)
- [PostgreSQL 16/17, Ownership, Originalrechte, Sicherung und Restore](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541919804)
- [RIS-Datenbank-/Handlerintegration](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541919932)
- [UI-Komponenten, Navigation und mobile Aktionsleiste](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541920091)
- [Tatsächliche Auth-/MFA-Sicherheit](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541920027)
- [Lokaler Abnahmestarter mit Wiederaufnahme](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541919783)
- [Release-Bundle und Originalexport-Verträge](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41541919794)

Zusätzlich lokal bestanden: 24 bestehende U4-Testskripte, Core-Typecheck/Fachservices,
17 mobile UI-/Admin-Sicherheitsverträge, Frontend-Build/Assetprüfung und Deno-Typechecks.
Die Sichtprüfung nutzte Desktop und 390 px Breite. Der Browser-Build enthält keine
privilegierte Service-Role-Konfiguration oder vollständigen Secret-Key-Literale.

Die lesend abgerufenen Sicherheitsadvisories enthalten bereits vorhandene Hinweise in
`public` sowie zwei FIB-Funktionen mit veränderlichem Suchpfad. Keine fremden Objekte
wurden geändert. Die neue Guard-Funktion verwendet `search_path=''`, kein
`SECURITY DEFINER`, keine öffentlichen Ausführungsrechte.

**Betriebliche Voraussetzung:** Die Merge-/Entwicklungsfreigabe liegt seit dem Auftrag vom 03.11.2026 vor. Es werden keine weiteren fachlichen Zwischenbestätigungen verlangt. Aktuelle FIB-Sicherung und Integritätsprüfung sowie bestehende autorisierte Zugriffe müssen tatsächlich verfügbar sein. Eine fehlende Workflow-/Maintenance-/AAL2-Berechtigung ist gegebenenfalls als konkreter technischer Blocker auszuweisen, ohne unabhängige Merge-/Dokumentationsarbeiten einzustellen. Die persönliche fachliche Abnahme wird durch keinen automatisierten Test ersetzt.

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
