# U4 – Technische Abnahme der Referenzquellen

| Version | Stand | Bearbeitung |
|---|---|---|
| 3.0 | 31.10.2026 | Entwicklung mit KI-Unterstützung, Auftrag Josef Walter |

**Gesamturteil: technische Teilabnahme bis zum redaktionellen Backend.**
PRs #346/#347 sind integriert. PR #348 ergänzt persistente RIS-Fachobjekte,
Scanner-Anbindung und ausdrückliche redaktionelle Übergänge. Der Nachweis umfasst
isolierte PostgreSQL-Transaktionen und den tatsächlichen Handlercode, jedoch keine
produktive Aktivierung oder vollständige Nutzerabnahme der Redaktionsoberfläche.
Keine Änderung an Shared-Apps/Memorix. Details und API-Vertrag:
[Persistente RIS-Struktur](u4-ris-persistence.md).

## Was der Nachweis bedeutet

Ein bestandener Parser-Test belegt noch keinen gespeicherten Fachgegenstand.
Ein Datenbanktest beweist nur die ausgeführten Transaktionen und Beziehungen.
Ein isoliert geprüfter Service ist noch kein bedienbarer Redaktionsablauf.
Diese Grenzen werden für jedes Ergebnis ausdrücklich benannt. Die technische
Abnahme erfolgt durch reproduzierbare Tests; eine fachliche Nutzerabnahme setzt
die vorgesehenen Redaktionsansichten voraus.

## 1. Technisch nachgewiesen und abgenommen

### RIS: beobachtete Struktur und technische Überwachung

- Reale Sitzung `1032`, Gemeinderat, `GR/440/2026`, 29.10.2026:
  TOP 2 verweist auf Vorlage `8640` und Dokument `75714`;
  TOP 3 auf Vorlage `8642` und Dokument `75790`.
- `tests/u4/fixtures/ris-1032-top-2-3.html` enthält unveränderte ausgewählte
  Metadatenfelder und die beiden HTML-Zeilen. `provenance.json` benennt URL,
  Abrufdatum, Transformation und Hash der dekodierten Ausgangsantwort.
  Der Ausschnitt ist **nicht** die vollständige Tagesordnung.
- `risSessionSnapshot` hält Sitzungsidentität, Gremium, Datum, Herkunft,
  Hash und beobachtete TOP/Vorlagen/Dokumentbeziehungen zusammen. Fehlende
  Metadaten bleiben `null`; fehlende oder mehrdeutige TOP-Nummern sind markiert.
- `same-html-row` bleibt ein Strukturhinweis, keine gesicherte redaktionelle
  Beziehung. Eine Vorlage an mehreren TOPs bleibt mehrfach zugeordnet;
  doppelte gleiche Beziehungen werden zusammengeführt, Dokumentlinks erhalten.
- Fremde RIS-Hosts und leere Sitzungskennungen werden abgewiesen. Dokumente
  bleiben unklassifiziert; Beschlussstatus bleibt `not_verified`.
  Ereignis, Meldung, Vorgang und Thema werden nicht automatisch erzeugt.
- Bestehende U4-Regressionen prüfen PDF-Hashes, Änderungen unter gleicher URL,
  Rückblickfenster, Cursor, Fehlernachholung, Batch-Limits und Scheduler-Sperren.
  Die PostgreSQL-Tests unterscheiden Rollback und sitzungsgebundene Sperren.

Die früheren Tests mit Dokument `75854` sind synthetische Vertragsfälle. Sie
belegen **nicht** die tatsächliche Dokumentzuordnung der Sitzung vom 29.10.2026.

### RIS: dauerhafte Fachstruktur und redaktioneller Backend-Ablauf

Die vorbereitete Migration und die gemeinsamen Module `ris-structure.ts` und
`ris-editorial.ts` ergänzen den bisherigen Kandidatennachweis:

- Gremium, Sitzung mit Snapshots, TOP, Vorlage, Vorschlagstext, Dokumentversionen,
  Niederschrift/Anlagen sowie mehrere Beschlusspunkte und Fassungen sind relational
  gespeichert. Fehlende Ergebnisse/Stimmen bleiben unbekannt; ursprüngliche
  Fassungen und exakte Textbelege bleiben erhalten.
- Reale Niederschrift `75785` zur Sitzung `1031` vom 15.10.2026: TOP 2 ohne
  Abstimmung, TOP 3 abgelehnt, TOP 6 mit zwei unterschiedlich abgestimmten Punkten.
  Reduzierte Originalausschnitte samt PDF-Hash liegen in `fixtures/ris-1031-*`.
  Synthetische Änderungen, unbekannte Resultate und Genehmigungsfälle sind im Test
  ausdrücklich als solche gekennzeichnet.
- Der Scanner verarbeitet bekannte Sitzungen erneut, versioniert Änderungen und
  speichert Struktur und Checkpoint atomar. Ausfälle oder Transaktionsabbrüche
  überspringen keine Strukturarbeit. Ein nachgereichtes PDF erzeugt keinen Beschluss.
- Bestätigte Dokumentversion → Fundstelle → reguläres `confirmEvent` → ausdrücklich
  geprüfter TOP/Ereignisbezug → Vorschlags-/Bestätigungsweg zu bestehendem Vorgang
  und Thema. Der vorherige reine Schema-Navigationsnachweis wird damit um echte
  Fachservice-Transaktionen ergänzt. Es entsteht keine automatische Meldung.
- Niederschriftsverfügbarkeit, Verfahrensstand und spätere Genehmigung werden
  getrennt geführt. Genehmigung benötigt den Beleg einer späteren Sitzung.
- `fib_runtime` führt die neuen Transaktionen aus; anonyme, authentifizierte
  Browser- und `service_role`-Direktzugriffe bleiben gesperrt. Historische Fassungen
  und Prüfvermerke sind für die Runtime nicht überschreibbar/löschbar.
- Der vorbereitete redaktionelle HTTP-Adapter prüft MFA/Mitgliedschaft und lehnt
  vorgetäuschte KI-Herkunft ab. Vorschläge aus KI sind interne Testkandidaten;
  eine angebundene KI-Auswertung ist damit noch nicht nachgewiesen.

### Gemeinde-Nachrichten: derselbe Code im Pilot und im Test

`fib-u4-pilot` verwendet `supabase/functions/_shared/u4-news.ts`:

- aktuelle Liste und Nachrichtenarchiv; bekannte Seitennavigation mit
  Schleifenerkennung, maximal 20 Listenseiten und 200 Artikel;
- unbekannte Seitennavigation, externe Folgeseiten, leere Listen und erreichte
  Grenzen ergeben einen Fehler, keinen erfolgreichen Vollständigkeitsnachweis;
- gleiche kanonische URLs werden dedupliziert; widersprüchliche Inhalte unter
  gleicher kanonischer Identität brechen den Lauf ab;
- Titel und vorhandenes Veröffentlichungsdatum werden aus dem Artikel gelesen;
  fehlende Datumsangaben bleiben unbekannt; reine Navigation außerhalb des
  Artikelinhalts ändert den Inhaltsvergleich nicht;
- Quellenbeobachtungen, Revisionen und Erfolgslauf werden atomar gespeichert;
  ein fehlgeschlagener Commit hinterlässt keine Teilbeobachtungen;
- Fehlerläufe erhalten bei verfügbarer Datenbank einen separaten Fehlereintrag
  und eine Lückenmarkierung. Der letzte Erfolg bleibt erhalten; Wiederanlauf
  hebt die Lücke erst nach erfolgreichem Gesamtcommit auf;
- Dry Run schreibt nichts. Fehlendes Login, fehlende MFA und fehlende Adminrolle
  werden abgewiesen. Weiterleitungen werden beim Abruf nicht automatisch verfolgt.

Der reale Referenzabruf vom 31.10.2026 ergab 15 aktuelle und 23 Archivlinks
(einschließlich möglicher Überschneidung). Der Artikel zum Parkraumkonzept lieferte
„Neues Parkraumkonzept in Feldkirchen“ und `2026-09-10`. Reduzierte reale HTML-Fixtures
und ihre Transformationen stehen unter `tests/u4/fixtures/gemeinde-*`.
Das ist eine Momentaufnahme, kein historischer Vollständigkeitsnachweis.

### Quellenbeobachtung → Fundstelle → ausdrückliche Ereignisbestätigung

`acceptReviewedObservation` verwendet ausschließlich vorhandene Tabellen:
`source_scopes`, `source_observations`, `sources`, `findings`, `finding_versions`.
Es ist ein **manuell ausgelöster Übergabeweg**, keine neue Pflichtprüfung jeder
Fundstelle und kein Ersatz der noch offenen automatischen vorläufigen Verarbeitung
in Issue #260.

- Aktive FIB-Mitgliedschaft, menschlicher Akteur, MFA und explizite Bestätigung
  sind für diesen Service erforderlich. KI-Akteure können ihn nicht ausführen.
- Scope und Quelle müssen zusammenpassen; Quelle und beobachtete URL müssen
  denselben zugelassenen Referenzursprung haben.
- Revision und Fingerprint werden innerhalb der Transaktion gegen die aktuelle
  Beobachtung geprüft. Eine veraltete Bestätigung wird zurückgewiesen.
- Beobachtungssperre und transaktionale Sperre pro Quelle/URL verhindern doppelte
  Anlage bei konkurrierenden Aufrufen. Bereits mehrdeutige Fundstellenbestände
  werden nicht willkürlich aufgelöst.
- `finding_versions.metadata` dokumentiert Scope, externe Kennung,
  Ursprungsrevision, bestätigende Person und Zeitpunkt. Neue bestätigte Stände
  ergänzen die Versionierung; vorhandener redaktioneller Text wird nicht ersetzt.
- Erst der getrennte bestehende `confirmEvent`-Service erzeugt ein Ereignis samt
  Fundstellenbeziehung, Federführung und Änderungsvermerk. Auch dann entsteht
  **keine Meldung**. Der Test umfasst die gemeinsame Transaktion.
- Die anschließende Navigation über `event_processes` und `process_topics` wird
  auf Schemaebene mit ausdrücklich vorbereiteten Testobjekten geprüft. Das ist
  kein Nachweis der vollständigen Fachservices/UI zur Beziehungsbestätigung.

## Reproduzierbare Prüfungen und Reichweite

| Prüfung | Ausführung / Aussage |
|---|---|
| Typverträge | `npm run typecheck:core` |
| Bestehende Fachservices | `npm run test:fachservices`, 28 Fälle |
| U4-Verträge und reale HTML-Referenzen | `npm run test:u4`, einschließlich `reference-sources.spec.ts` |
| Monitor, RIS-Handler und Parallelität | vorhandene Tests im Workflow `u4-postgres-integration.yml` |
| Tatsächlicher Gemeinde-Edge-Handler | `news-postgres-integration.spec.ts`: HTTP/Auth simuliert, echte PostgreSQL-Transaktionen |
| Fundstellenübergabe und Ereignis | `reviewed-finding-postgres.spec.ts`: vorhandenes `core.sql` plus zwei U4-Migrationen; echte FK-/Unique-/Check-Constraints, Konkurrenz, Rollback, veraltete Bestätigung und anonyme Zugriffsverweigerung |
| Persistentes RIS-Modell und regulärer redaktioneller Workflow | `ris-persistence-postgres.spec.ts`: tatsächliche Migration und `fib_runtime`, mehrfache Beschlüsse/Fassungen, exakte Belege, Konflikt-/Fehlerfälle, Vorschlagsbestätigung und RLS |
| Scanner → Fachstruktur und redaktioneller HTTP-Adapter | `ris-scanner-structure-postgres.spec.ts`: echte Handler, PostgreSQL; externe HTTP/Auth/PDF-Resultate simuliert; nachträgliche Veröffentlichung und Checkpoint-Rollback |
| PDF-Texterschließung | `ris-persistent-contract.spec.ts`: reale HTML-Fixtures plus echte unpdf-Extraktion eines gültigen synthetischen PDFs |
| Übergreifende Regression | GitHub Core Services, Editorial Build, Auth Security und U4 Source Probe |

Die neuen Datenbanktests verweigern andere Ziele als `localhost`/`127.0.0.1`
mit Datenbankname `fib_u4_test`. Sie bauen das FIB-Schema dort neu auf.
Aufruf: `U4_TEST_DATABASE_URL=postgres://...@localhost:5432/fib_u4_test npx tsx tests/u4/<test>.ts`.
**Nie mit Produktionszugang ausführen.** Die CI stellt PostgreSQL 16 bereit.

Im Work-Sandbox wurde wegen nicht erlaubter TSX-CLI-IPC-Sockets ersatzweise
`node --import tsx <Testdatei>` verwendet. Dies führt dieselben Tests aus.
Die normalen npm-/tsx-Aufrufe werden zusätzlich unverändert in GitHub CI geprüft.

## 2. Technisch noch offen

| Lücke | Zuständiger nächster Schritt |
|---|---|
| Produktive Migration, Edge-Laufzeit und reale Runtime-Rechte | Vollständig vorbereiteter Code-/Teststand; Umsetzung und Smoke-Test erst nach separater Freigabe, keine Änderung von Memorix |
| Redaktionelle Oberflächen | API-Projektion/Aktionen vorbereitet, noch keine durchgängige Darstellung und Bedienung in der regulären UI |
| Vertrauenswürdige KI-Auftragsanbindung / vorläufige Ereignisse | Vorschlagsmodell und menschliche Bestätigung geprüft; tatsächlicher KI-Produzent und #260 weiter offen |
| Vollständige RIS-Abdeckung und Identitätswechsel | Weitere Seitentypen, Sitzungskalender-/historischer Einstieg, TOP-Umnummerierungen, Gremienumbenennungen und unbekannte Strukturfälle prüfen |
| OCR / gescannte PDFs | Text-Extraktion vorhanden, keine OCR; fehlender Text darf keinen erfundenen Beschluss erzeugen |
| Gesamter historischer Migrationspfad | Basis plus relevante Bestandsmigrationen, Runtime-Policies und neue Migration getestet; kein vollständiger Neuaufbau aller jemals angewendeten Produktivmigrationen |
| Artikelidentität bei geänderter URL ohne kanonischen Rückverweis | URL-Alias-/Dublettenprüfung; gleiche Überschrift allein ist kein Identitätsbeweis |
| Dauerhafte Artikelmetadaten und Texterschließung | Pilot speichert weiterhin technische Beobachtungen/Hashes; komplette Artikeltexte benötigen den vorgesehenen Speicher-/Rechtepfad; RIS-Belege sind im neuen internen Versionsspeicher vorbereitet |
| Archivabdeckung jenseits sichtbarer Links; Kosten | Referenzbestand und Begrenzungen weiter prüfen; der begrenzte Scan lädt aktuell alle entdeckten Details und ist noch keine kostenoptimierte Langzeitstrategie |

Beim Wechsel vom bisherigen Vollseitenhash auf den Artikelinhalt kann die erste
Prüfung einmalig eine Änderung melden, obwohl der Artikel fachlich unverändert ist.
Das ist vor einem späteren Deployment einzuplanen. Die Erweiterung ist nicht deployt.

## 3. Fachlich erst anhand der Redaktionsoberfläche überprüfbar

- Sitzung, TOP, Vorlage und noch unbekannter Beschluss als getrennte Objekte sehen;
- Beleg, unsichere Verknüpfung und bestätigte Zuordnung unterscheiden;
- aus einer Fundstelle das richtige bestehende/neue Ereignis wählen;
- Bezüge zu Vorgang/Thema mit Bedeutung und Begründung prüfen;
- Vorschlag, bestätigte Analyse und freigegebene öffentliche Meldung unterscheiden.

Diese Ansichten sind keine Voraussetzung dafür, Tests auszuführen. Ihr Fehlen
verhindert aber eine vollständige fachliche Nutzerabnahme.

## 4. Im späteren Betrieb iterativ zu verbessern

Bereitstellungsgeschwindigkeit, verspätete Archivaufnahmen, reale Vollständigkeit,
Relevanz, indirekte Feldkirchen-Bezüge, Fehlertreffer, Quellenänderungen sowie
Kosten pro sinnvoller Fundstelle werden anhand von Referenzfällen und Feedback
gemessen. Ein einzelner grüner Testlauf kann diese Qualität nicht garantieren.

## Rückverfolgbarkeit zum Fachhandbuch

| Primärstelle | Implementierung / Nachweis | Grenze |
|---|---|---|
| Kapitel 03, 03.1a Quellenbestände und Änderungen | gemeinsamer News-Scanner, Monitor-/Recovery-Tests | Sichtbare verlinkte Bereiche, begrenzte Seitenzahl |
| Kapitel 03, 03.3.2 Fundstelle/Ereignis | geprüfte Übernahme, Versionen, `confirmEvent` | manueller Serviceweg; vorläufige KI-Ereignisse #260 offen |
| Kapitel 07, 07.2–07.4 Sitzung/Vorschlag/Beschluss | realer RIS-Ausschnitt, Snapshot und Negativverträge | persistente bestätigte Backend-Objekte; UI-/Produktionsabnahme offen |
| Kapitel 06, FIB-THEMA-BEZUG-001 bis -008 | keine automatische Themenanlage; Schema-Navigation | bestätigte Ereignisbezüge zu bestehenden Objekten geprüft; Themenentdeckung/KI-Produzent/UI offen |
| Rechte und Herkunft | MFA/Mitgliedschaft, Herkunftsprüfung, Transaktion, Versionsmetadaten, isolierte Runtime-Rolle | keine produktive Runtime-/Browserfreigabe |

Die bisherigen fachlichen Regeln bleiben erhalten. Offene Umsetzung wird in #281,
#260, #93 und #264 verfolgt; Betriebsintegration bleibt #336. Fehlende Funktionen
sind keine stillschweigend neu entschiedenen Fachregeln.

## Betriebsgrenze und Änderungshistorie

Keine produktive Migration, kein Cron, kein Secret, kein Deployment und keine
Memorix-Änderung wurden für dieses Paket vorgenommen. Die neue Gemeinde-Funktion
und der Übergabeservice werden erst nach gesonderter Betriebsfreigabe bereitgestellt.

| Version | Änderung |
|---|---|
| 3.0 | Reale Referenzfixtures, isolierte Integration, explizite vier Abnahmekategorien und verbleibende Implementierungslücken |
| 1.0 | Erste Teilabnahmematrix zu RIS und Gemeinde-Nachrichten |
