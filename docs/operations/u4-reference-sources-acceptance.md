# U4 – Technische Abnahme der Referenzquellen

| Version | Stand | Bearbeitung |
|---|---|---|
| 2.0 | 31.10.2026 | Entwicklung mit KI-Unterstützung, Auftrag Josef Walter |

**Gesamturteil: Teilabnahme.** PR #346 ist nach fünf erfolgreichen CI-Prüfungen
zusammengeführt. PR #347 erweitert die Nachweise. Die vollständige RIS-Fachstruktur
mit persistenten Sitzungen, TOPs und tatsächlichen Beschlüssen ist weiterhin
**nicht abgenommen**. Keine Produktivfreigabe, keine Änderung an Shared-Apps/Memorix.

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
| Persistente Sitzung/TOP/Gremium-Identitäten und fachliche Beziehungen | U4.4 in #281: eigenständiger Schema-/Fachservice-Slice mit Migration **nur nach separater Produktionsfreigabe** |
| Vorschlagstext, tatsächliche Beschlusspunkte/Fassungen/Abstimmungen | RIS-Niederschriften erschließen, originale Textbelege, abweichende und mehrere Beschlüsse je TOP testen; keine Ableitung aus PDF-Existenz |
| Laufzeitverbindung RIS-Scanner → Strukturkandidaten | Snapshot-Funktion ist getestet, aber noch nicht im RIS-Edge-Lauf angeschlossen oder dauerhaft gespeichert |
| Runtime/UI-Verbindung der neuen Fundstellenübergabe | Service ist isoliert integriert getestet, noch ohne neuen öffentlich erreichbaren Endpunkt und ohne UI-Aufruf |
| Quelle → RIS-Kontext → Ereignis → Vorgang/Thema als vollständiger Fachworkflow | Fundstelle/Ereignis ist geprüft; persistenter RIS-Kontext und vollständige Zuordnungs-/Vorschlags-/Freigabeservices fehlen |
| Aktuelles Gesamtschema und Runtime-Rollen | Neue Übergabe gegen Basis plus U4-Migrationen getestet, kein Neuaufbau aller historischen Migrationen und kein produktiver `fib_runtime`-Rechtenachweis |
| Artikelidentität bei geänderter URL ohne kanonischen Rückverweis | URL-Alias-/Dublettenprüfung; gleiche Überschrift allein ist kein Identitätsbeweis |
| Dauerhafte Artikelmetadaten und Texterschließung | Pilot speichert weiterhin technische Beobachtungen/Hashes; komplette Artikeltexte und RIS-Textbelege benötigen den vorgesehenen Speicher-/Rechtepfad |
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
| Kapitel 07, 07.2–07.4 Sitzung/Vorschlag/Beschluss | realer RIS-Ausschnitt, Snapshot und Negativverträge | Strukturkandidaten statt persistenter Beschlussobjekte |
| Kapitel 06, FIB-THEMA-BEZUG-001 bis -008 | keine automatische Themenanlage; Schema-Navigation | fachliche Vorschläge/Freigaben nicht durch diese Tests vollständig abgenommen |
| Rechte und Herkunft | MFA/Mitgliedschaft, Herkunftsprüfung, Transaktion, Versionsmetadaten | keine neue Runtime-/Browserfreigabe |

Die bisherigen fachlichen Regeln bleiben erhalten. Offene Umsetzung wird in #281,
#260, #93 und #264 verfolgt; Betriebsintegration bleibt #336. Fehlende Funktionen
sind keine stillschweigend neu entschiedenen Fachregeln.

## Betriebsgrenze und Änderungshistorie

Keine produktive Migration, kein Cron, kein Secret, kein Deployment und keine
Memorix-Änderung wurden für dieses Paket vorgenommen. Die neue Gemeinde-Funktion
und der Übergabeservice werden erst nach gesonderter Betriebsfreigabe bereitgestellt.

| Version | Änderung |
|---|---|
| 2.0 | Reale Referenzfixtures, isolierte Integration, explizite vier Abnahmekategorien und verbleibende Implementierungslücken |
| 1.0 | Erste Teilabnahmematrix zu RIS und Gemeinde-Nachrichten |
