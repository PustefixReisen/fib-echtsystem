# RIS-Nachabnahme: gebündelte Freigabe und Bereitstellung (#403 / PR #416)

## Aktuelle Betreiberentscheidung 09.11.2026 – gilt vorrangig für die Entwicklungsbereitstellung

Der Betreiber hat die drei offenen fachlichen Entscheidungen bestätigt:
**Mistral AI** als vorgesehener KI-Anbieter; **5 EUR Höchstbudget
für die Erprobung**; **gebündelte Übernahme ins vorhandene
FIB-Echtsystem** auf Shared-Apps/IONOS. Der derzeitige Zustand
ist ausdrücklich **Entwicklung ohne wichtige fachliche
Bestandsdaten** und niedriger Kritikalität. Für diesen konkreten
Entwicklungsrelease gelten deshalb folgende abgestuften Regeln
anstelle der oben beschriebenen strengeren Pilot-/Produktivgates:

- **Kurze Sicherung reicht:** Vor einer FIB-Schema-Migration
  einmal die vorhandene FIB-Snapshot-Routine mit privater Ablage
  ausführen, Prüfsumme und lesbares Archiv verifizieren.
  Rückfallweg und vorhandenen Frontendstand dokumentieren.
  Kein zusätzlicher vollständiger isolierter Restore, kein
  mehrstufiges Release-Bundle und kein aufwendiges
  Wartungsfenster allein wegen fehlender wertvoller Echtdaten.
  **Die bestehende Workflow-/Migrations-Sicherungssperre darf
  nicht stillschweigend abgeschaltet werden.** Bei technisch
  erzwungenen strengeren Anforderungen muss die
  Bereitstellung darauf Rücksicht nehmen.
- **Keine neue Authentifizierung oder öffentliche Lesefreigabe:**
  Die öffentlich erreichbare Webadresse ist nicht mit
  öffentlicher Datenfreigabe gleichzusetzen; vorhandene
  angemeldete Benutzer behalten ihre gewohnten Rechte.
- **Redaktionelle Freigabe genau abgrenzen:**
  „Keine automatische Veröffentlichung“ bedeutet lediglich:
  Ein KI-generierter Entwurf ist fachlich noch nicht
  `confirmed`, bis die Redaktion ihn bei Bedarf korrigiert
  und bestätigt. Es ist **kein** zusätzliches Login-Gate
  gemeint. Automatisches Vorbefüllen von Entwürfen für
  bereits angemeldete Redakteure ist ausdrücklich erwünscht.
- **KI-Test:** Mistral als vorgesehener Anbieter und
  5 EUR Budget genehmigt. Kein automatischer
  kostenpflichtiger Aufruf ohne vorhandenen API-Schlüssel,
  nachgewiesene datenschutzgerechte Konfiguration und
  messbare Verbrauchsbegrenzung. Die 5 EUR sind keine
  technische API-Hard-Limit-Funktion und dürfen nicht so
  behauptet werden. Originalniederschriften können
  personenbezogene Inhalte enthalten; Übermittlung nur nach
  geklärter Aufbewahrung/Vertragsgrundlage.
- **Freigabeumfang:** Gebündelte RIS-Entwicklungsbereitstellung
  ist fachlich gewünscht, mit vorhandener Schutztechnik,
  konkreter Änderungsversion, gezielten Tests und
  Wiederanlauf. **Keine** Freigabe zur Änderung anderer
  Apps, gemeinsamen Secrets oder Cron; keine
  Behauptung, KI-Erstellung sei produktiv fertig, solange
  der Redaktions-HTTP-Pfad und Anbieterzugang fehlen.

Die abgenommenen Beschlussdarstellungen bleiben unverändert;
Beschlusskorrekturen sind ein eingeklappter, selten
benötigter Vorgang. Ein einzelner gemeinsamer
Nachabnahmetest reicht nach erfolgreicher Bereitstellung.

**Stand:** 09.11.2026. Diese Arbeitsanweisung stellt keine Produktivfreigabe dar.

## Ziel

Ein technisch zusammenhängender Release ohne erneute Serie isolierter UI-Vorschauen.
Die bereits persönlich abgenommenen Fachentscheidungen bleiben eingefroren:

- Beschlussdarstellung: je Beschlusspunkt **vollständige sachliche und eigenständig
  formulierte Inhaltswiedergabe**, unmittelbar danach zutreffendes
  Abstimmungsergebnis. Kein wortgetreues Originalarchiv.
- Bedienung: vom System vorbefüllter Entwurf, Redakteur prüft und korrigiert nur
  ausnahmsweise; fachliche Entscheidung bleibt bei der Redaktion.
- Keine zusätzliche Pflichtbegründung für rein deterministische RIS-Dokumentbezüge.
- Keine überflüssigen Infotexte und keine Vermischung von TOP-Status mit Abstimmung.

## Ein gemeinsamer Korrektur- und Abnahmeblock

| Abnahmebefund aus #403/#377 | Maßgeblicher Stand | Nachweis/Rest |
|---|---|---|
| TOP-Titel/Status sowie Referenzausschnitt | PR #404 bereits in main und Edge + Frontend veröffentlicht | Sichtbefund TOP 2 vom 09.11.; nur 3/19 der Sitzung 1031 belegt |
| Beschlussinhalt, mehrere Abstimmungen, TOP 2 ohne Abstimmung | PR #416, eigenständig formulierte Vollständigkeit nach neuer Nutzerentscheidung | Isolierte TOP-2/3/6-Tests; echte Quelle/Prüfung/Freigabe fehlt |
| Redaktionsmaske und KI-Vorbefüllung | PR #416: vereinfachter Prüf-/Bestätigungsdialog, parserbasierte Stimmen, providerneutraler KI-Entwurfskontrakt | Dialog in Vorschau; **kein** real konfigurierter KI-Provider und kein vollständiger TOP-Text |
| Fremdereignisse ausschließen, Suche bei jeder Eingabe; mobil Titel/Datum/Kurzbeschreibung | PR #404 veröffentlicht | Browser-/isolierte Authprüfung positiv; persönliche Smartphone-Retest noch offen |
| TOP-Hauptereignis und automatisch verknüpfte zugehörige RIS-Fundstellen | PR #404 veröffentlicht | PG17: mehrfache TOPs, Nachträge, Idempotenz, Undo; realer Nutzer-Retest offen |
| Zuordnen/Aufheben sofort, keine globale Speichern-Aktion | Bereits main/PR #404 | Desktop am 08.11. erfolgreich; erneute mobile Kontrolle im Gesamttest |
| Ereignis bearbeiten/Lock/Koordination/Federführung | PR #404 veröffentlicht | Isolierte Zwei-Akteur-Prüfung und reale Browserfälle; Gerätetest offen |
| Sachliche Dokumentlinks statt portalweiter Navigationslinks | PR #404 veröffentlicht | Klassifizierung vorhanden, reale gezielte Sichtprobe nötig |
| „GEÄNDERT 14.10.“ | Gespeicherter redaktioneller Freitext, kein nachgewiesener Generator | Keine automatische Bereinigung oder Datenmutation; Ursprung nur nach gesondertem Nachweis |
| Reale 19 TOPs vom 15.10.2026 | Produktions-Referenzbestand enthält 3 TOPs | **Externer Blocker**: Cloud CONNECT-403 zum RIS-Host; nachweisbarer vollständiger regulärer Zugriff fehlt |
| Rechte und Speicherung der RIS-PDFs | Nach #380/#267 zurückgestellt | Keine Voll-PDF-/Extraktarchivierung, keine fingierten Nutzungsrechte |

## Release muss als ein Paket und in dieser Reihenfolge erfolgen

1. **Änderungsstand einfrieren**: PR #416 gegen main; nur gewollte Änderungen, keine
   Änderung von Auth/Memorix/Cron/Secrets. Vollständige CI inkl. PostgreSQL,
   Browser, MFA/RLS und U4-Echtvertragsprüfungen mit erfolgreichen Ergebnissen.
   PR #404 nicht noch einmal deployen.
2. **Sicherung und Rückkehrweg**: bereits erfolgreiche Entwicklungssicherung
   (09.11.) als Ausgangspunkt, für echtes Produktivrelease jedoch frische,
   datensatzkonsistente FIB-Schema-Sicherung mit isoliertem PG17-Restore,
   Frontend-Sicherung/Readback und Funktionsversions-Inventur nach verbindlichem
   Releaseplan. Sicherungen nicht mit Test-Preview verwechseln.
3. **Gesonderte produktive Freigabe** mit eindeutiger Commit-SHA, Migration und
   Versionen. Die informelle UI-Abnahme („passt“) ist **keine** pauschale
   Berechtigung für Produktionsschreiben.
4. **Eine kontrollierte technische Bereitstellung**: erforderliche FIB-Migration
   `20261109150000_fib_ris_factual_vote_evidence.sql` ausschließlich im
   vorgesehenen Schema; nur tatsächlich geänderten RIS-Backend-Handler
   `fib-editorial-write`/seine nötigen Shared-Module bereitstellen; bestehende
   JWT-Einstellungen beibehalten; anschließend das redaktionelle Frontend über
   den dedizierten Frontend-Workflow deployen. Kein neuer öffentlicher KI-Endpunkt.
5. **Abnahme in einem Durchgang**, Desktop und Smartphone: TOP 2/3/6,
   verständliche Sachfassung+Stimmen, Anpassung und Freigabe (mit ausdrücklich
   freigegebener Testquelle, nicht mit erfundener realer Lizenz);
   Suche/Fremdereignisse, Zwei-TOP-/Fundstellen-Beziehung, Back/Undo,
   Bearbeitung, konkurrierende Sperre, Links, Historie.
6. **Sonderblock Quellen**: Regulären RIS-Quellenzugang separat aktivieren und
   vollständige Sitzung 1031 inklusive aller 19 TOP-Identitäten und Niederschrift
   quellenseitig nachweisen. Bis dahin im UI weiterhin als unvollständige
   Referenz kennzeichnen; keine automatische produktive KI-Ableitung vortäuschen.

**Klarer Schnitt:** Die Funktionen der veröffentlichten PR #404 brauchen
keine Neuimplementierung. PR #416 soll die Beschlussdarstellung ergänzen.
Die **vollautomatische** Übernahme der Originalniederschrift ist nicht ehrlich
als Teil eines sofort einsatzbereiten Live-Releases auszuweisen, solange Quelle
und KI-Provider nicht angebunden sind. Sie bleibt ein separater technischer
Blocker, nicht Anlass für weitere UI-Entwurfsschleifen.

## Maßgebliche Freigabekriterien

- Keine unlizenzierte Originalkopie, keine fingierten Beschlussdaten,
  keine Autopublikation und keine Datenbereinigung der echten TOPs.
- Nur nachweislich tatsächlich grüne CI, überprüftes Backup/Restore,
  dokumentierter Commit und gesonderte Releasefreigabe produktiv ändern.
- Nach einem erfolgreichen Release nur ein gemeinsamer, kurzer persönlicher
  Retest; der Nutzer muss keine Einzelbestätigung je Programmschritt geben.
- Issue #403/PR #416 erst schließen, wenn die tatsächlich gelieferten
  Funktionen abgenommen und alle externen Blocker sauber in Folge-Issues
  dokumentiert sind.

## Zusätzlicher realer Strukturbeleg vom 09.11.2026

Die öffentlich von einem Suchindex erfasste offizielle RIS-Sitzungsseite
`https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031`
lieferte die **19 öffentlichen TOP-Nummern mit Bezeichnung und
Vorlagenreferenzen** der Sitzung GR/439/2026 vom 15.10.2026.
Die Metadaten sind mit ausdrücklicher Herkunftsbegrenzung unter
`tests/u4/fixtures/ris-1031-public-agenda-indexed-20261109.json`
als Regression erfasst. Dazu zählt ausdrücklich die Unterscheidung:

- **19 indexierte öffentliche TOP-Titel** nachgewiesen, nicht nur
  eine synthetische Tabelle.
- **Nur 3 reale TOP-Referenzobjekte (2/3/6) in FIB** nach der letzten
  lesenden Datenbankprüfung. Es erfolgte kein echter 19er-Import.
- Der Index ist weder ein ungefilterter RIS-HTTP-Abruf noch eine
  vollständige Niederschrift: die amtlichen Abstimmungen und
  Beschlussinhalte anderer TOPs sind damit nicht bestätigt.

Diese Referenz darf **nicht** als produktiver Scanner-Ersatz oder
automatische SQL-Befüllung der `fib.ris_agenda_items` verwendet werden.
Sie erlaubt aber einen fachlich echten Soll-/Ist-Nummernvergleich und
die Feststellung, dass die fehlenden 16 TOPs nicht frei erfunden sind.

## Produktive Read-only-Inventur vom 09.11.2026

Direkt in Supabase Shared-Apps (`apaubomxffcwtzjimori`, Schema `fib`)
read-only verifiziert:

- `fib.source_scopes.scope_key='ris-dokumentliste'` hat
  `status='candidate'`, Zugangsmethode `ris`, letzter
  erfolgreicher und letzter versuchter Lauf jeweils
  **30.10.2026 16:49:22.875 UTC**.
- `fib.ris_scan_cursors.cursor_state->>'structureState'` ist
  **NULL**, letzter Cursorstand 30.10.2026 16:49:22.882 UTC.
  Ein produktiv ausgeführter vollständiger neuer
  Sitzungsstrukturimport ist damit **nicht** nachgewiesen.
- Edge-Inventar ist unverändert: `fib-editorial-write` v21 ACTIVE
  (JWT-Flag false), `fib-u4-ris-pilot` v22 ACTIVE
  (JWT-Flag true). Die Module aus Draft PR #416 sind dort
  noch **nicht** bereitgestellt.

**Betriebsentscheidung vor RIS-Scanneraktivierung:** Konfiguration,
Zugriffsrechte und tatsächlich erlaubten Netzweg des offiziellen
RIS-Hosts nach Sicherung/Releasefreigabe prüfen. Ein Statuswechsel
`candidate` nach `active`, neuer Cron, Datenbankbefüllung oder
Scannerlauf ist **nicht** Teil der vorliegenden read-only-Inventur.
Auch die öffentlichen 19 indexierten TOP-Titel sind kein Nachweis
für einen bereits erfolgten Live-Import.

## Schreibfreier Direktquellen-Test vor Scannerfreigabe (PR #416)

Der vorhandene AAL2-geschützte, nur für aktive FIB-Administratoren
zulässige Edge-Handler `fib-u4-ris-pilot` erhält den ausdrücklich
getrennten **Nur-Lesen-Aufruf**:

```json
{ "previewSession": "1031", "commit": false }
```

- Zulässig ausschließlich für die fest erlaubten Sitzungs-IDs
  `1031` (15.10.) und `1032` (29.10.). Ein ungeprüfter
  beliebiger Link wird nicht akzeptiert (kein SSRF-Proxy).
- Abgewiesen bei `commit=true`, `pdfBackfill=true` oder
  Kombination mit dem bestehenden Integrationsmodus.
- Die Funktion lädt **nur** die offizielle RIS-Sitzungsseite,
  prüft HTML-Content-Type und Größenobergrenze und liefert
  gelesene öffentliche TOP-Nummern, Titel, Status und
  Vorlagenreferenzen sowie einen **unverified**-Abdeckungsstatus.
- **Kein** PDF-Abruf, keine Niederschriftsextraktion,
  keine Datensatz-/Cursor-/Beobachtungsänderung und
  kein Verschieben des bestehenden Quellenscopes.
- Der isolierte echte PG-Integrationstest prüft, dass
  `ris_session_versions` und der Scanner-Cursor vor/nach dem
  Preview-Aufruf unverändert sind. Ungültige und kombinierte
  Schreibaufrufe werden abgewiesen.

Dies ist die sichere erste, separat freizugebende Betriebsdiagnose
nach echtem Edge-Deploy. Ihr Erfolg beweist nur den **direkten
technischen RIS-Sitzungszugang vom gehosteten Edge-Standort** und die
beobachtete Tagesordnungszahl, **nicht** PDF-Inhalte,
Beschlussentwürfe oder einen gespeicherten produktiven 19er-Import.
Ein fehlgeschlagener Abruf wird mit einer verständlichen Fehlermeldung
zurückgegeben und verändert keine Bestandsdaten. Den vorhandenen
Integrations-Schreibmodus `integrationSession=1032` nicht als
Ersatz für diese Diagnose verwenden.

## Echter RIS-End-to-End-Quellennachweis 09.11.2026 (GitHub-Runner, ohne Datenübernahme)

Vom GitHub-Actions-Runner über öffentliche RIS-Endpunkte tatsächlich geprüft,
**nicht** bloß synthetisch und **nicht** aus der produktiven Edge-Laufzeit:

- Sitzung `1031` vom 15.10.2026: **HTTP 200**, vollständige
  öffentliche Tagesordnung **19/19** korrekt durch FIB-Parser erkannt,
  **0 fehlende/überzählige** TOP-Nummern.
- Beide offiziellen URL-Varianten, mit und ohne `smcmode=32832`,
  ergeben **19/19**. Ein fehlender Navigationsparameter ist im Runner
  damit **nicht** die Ursache des produktiven 3/19-Bestands.
- Amtlicher PDF-Link `getfile.asp?id=75785`, vom selben
  tatsächlichen Sitzungs-HTML als `Niederschrift öffentlich` erkannt;
  Dokument ist im Runner als PDF **erreichbar** (1.999.578 Bytes).
- `unpdf` hat im temporären Arbeitsspeicher **85.884 Zeichen**
  extrahiert. Das Testprotokoll enthält keine Originaltexte, keine
  PDF-Datei, keine personenbezogenen Beschlusspassagen und keine
  FIB-Datenbankschreibvorgänge.
- Das tatsächliche Dokument enthält **19 eindeutig nummerierte
  TOP-Abschnitte (1 bis 19)** und insgesamt **29 Abstimmungsvermerke**.
  `splitRisMinutesByAgenda` trennt bei eindeutiger vollständiger
  Reihenfolge alle 19 Abschnitte. Fehlende/doppelte/umgeordnete
  Überschriften führen zur ausdrücklichen Ablehnung, nicht zu einer
  stillen Fehlzuordnung.
- Echte Regression anhand der **extrahierten amtlichen Abschnitte**:
  TOP 2 ein Vermerk *keine Abstimmung*, TOP 3 *abgelehnt, 7:13*,
  TOP 6 zwei getrennte Beschlüsse *angenommen, 17:2* und
  *angenommen, 19:0*.

**Neu abgenommener technischer Zwischenstand:** RIS-Tagesordnung
und PDF-Texterkennung funktionieren am offiziellen, tatsächlich
erreichbaren Quellmaterial **im GitHub-Runner**. Die KI darf daraus
später nur vorläufige eigenständig formulierte Vollständigkeitsentwürfe
machen, mit nachfolgender menschlicher Prüfung. Die Erkennung der
Stimmenzahlen beweist noch nicht die Vollständigkeit eines solchen
KI-Texts.

**Noch offen:** Die tatsächliche Erreichbarkeit derselben Quellen in
der **gehosteten Supabase-Edge-Umgebung**, die bewusst nicht aktivierte
Scanner-Konfiguration (`ris-dokumentliste` ist `candidate`) sowie
ein real konfigurierter KI-Provider für die nichtwortgetreue,
inhaltlich vollständige Beschlussfassung. Kein automatischer Import,
keine Speicherung von Original-PDF/-Volltext und keine Produktivänderung.
Die isolierte AAL2-Edge-Diagnose ist vorbereitet, noch nicht deployt.

Reproduzierbare Quellen-/Strukturdatenprüfungen laufen in der CI
`U4 public-source connectivity check`:
`scripts/u4-ris-public-1031-coverage.ts` und
`scripts/u4-ris-public-minutes-readability.ts`.

## KI-Anbieteradapter (Entwicklungsstand, keine produktive Datenübermittlung)

Der Draft enthält jetzt
`supabase/functions/_shared/ris-minutes-mistral-provider.ts`.
Er implementiert den bestehenden `RisMinutesDraftProvider` als
**ausdrücklich optionalen** Chat-Completions-Aufruf an die fest
konfigurierte Adresse `https://api.mistral.ai/v1/chat/completions`.
Modell- und Formatfestlegung: JSON-Objekt, Temperatur 0,1, feste
Größen-/Zeitlimits, kein dynamischer Fremdhost. Ein unvollständiges
oder manipuliertes Ergebnis wird abgelehnt bzw. als nicht verfügbar
gemeldet. Außerdem führt die bereits vorhandene Fachprüfung
`validateRisFactualDraft` zu einer zwingenden redaktionellen
Prüfung; kein KI-Datensatz gelangt automatisch in die FIB-Datenbank.

Die Verwendung ist ausdrücklich **nicht** standardmäßig aktiviert:
Ein Aufruf ist nur möglich, wenn eine aufrufende Komponente
`enabled:true`, ein gültiges API-Geheimnis und ein Modell
explizit übergibt. Kein neues Secret wurde angelegt, keine
bestehenden Zugangsdaten ausgelesen, und der Provider ist noch
an keinen produktiven HTTP-Endpunkt oder Cron gebunden.

Der deterministische Vertrag wird mit einem simulierten
Netzwerkaufruf in
`tests/u4/ris-minutes-mistral-provider.spec.ts`
getestet: kein Provider → keine Datenübertragung; deaktivierte
Konfiguration → Fehler; erfolgreiche strukturierte Antwort →
`review_required`; veränderte Stimmen → Ablehnung;
API-Fehler → `unavailable`.

**Noch ausdrücklich offen:** Nutzungsentscheidung, Kostenkontrolle,
API-Zugang sowie Datenschutzbewertung für das Senden von
TOP-Originalpassagen an einen externen Anbieter. Eine
Standortangabe „EU“ allein genügt nicht für die erforderliche
Bewertung von Subprozessoren und Aufbewahrung. Aktuelle
Anbieterdokumentation:
[API Chat](https://docs.mistral.ai/api),
[Datenspeicherort](https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data),
[Datenspeicherung](https://legal.mistral.ai/terms/privacy-policy/),
[Zero Data Retention](https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr).
Vor diesem Schritt dürfen keine ungeprüften RIS-Originalpassagen
an die API übermittelt werden.

## In-Memory-Verarbeitungskette für echte RIS-Niederschriften

`supabase/functions/_shared/ris-minutes-pipeline.ts` verbindet jetzt:

1. Abgesicherte, ausschließlich offizielle URL `/getfile.asp?id=...`
   (HTTPS, zulässiger Host, passende Dokument-ID).
2. Größen- und Formatprüfung, `unpdf` im RAM, kein dauerhafter
   PDF-/Textspeicher.
3. Gegenprüfung aller erwarteten TOP-Nummern, Ablehnung bei
   unvollständiger/fehlerhafter Dokumentstruktur.
4. Einzelne Beschlusspunkte und Abstimmungsdaten je TOP mit dem
   freigeschalteten KI-Adapter zu unabhängigen Sachentwürfen.
5. Ausschließlich den **Status `review_required`** für
   syntaktisch akzeptierte Entwürfe; **keine**
   automatische FIB-Freigabe oder Speicherung in die Echtdatenbank.

Ohne freigegebenen Provider wird die Verarbeitung bereits
**vor einem PDF-Abruf** mit `draft_provider_not_configured`
beendet. Test `tests/u4/ris-minutes-pipeline.spec.ts`
prüft einen synthetischen offiziellen PDF-Abruf, eine gültige
vollständige Struktur, eine unvollständige Tagesordnung,
einen verbotenen Fremdhost und das Verbot impliziter
Quellenabrufe ohne Provider. Die Transporttests zur Mistral-API
verwenden ausschließlich künstliche Antworten und
keine echten Zugangsschlüssel.

**Noch kein Produktionsendpunkt und keine produktive KI-Freigabe.**
Für einen echten Aufruf muss zunächst die fachlich
verantwortete Datenübermittlung/Vertragsgrundlage,
ein aktivierter Provider mit geheimem Schlüssel,
Kostengrenze und die bestehende FIB-Rollen-/MFA-
Freigabe im HTTP-Handler nachgewiesen sein.
Eine Produktivbereitstellung der bestehenden UI
allein wäre deshalb **kein** Abschluss der
automatischen Beschlusserzeugung.

## Technisch geschlossener Redaktionsaufruf (09.11.2026)

Im Entwurf ergänzt `fib-editorial-write` den neuen Aufruf
`ris_prepare_minutes_draft` (nur angemeldete, aktive FIB-Editoren/
Administratoren mit MFA/AAL2 und freigeschaltetem RIS-Modul).
Der Button `KI-Entwurf vorbereiten` befindet sich ausschließlich
in der standardmäßig eingeklappten redaktionellen Korrekturmaske.

Vor einem externen KI-Aufruf prüft der Server:

- Explizite Schalter `FIB_RIS_MISTRAL_ENABLED=true`,
  `FIB_RIS_MISTRAL_BUDGET_CONFIRMED=true` und
  `FIB_RIS_MISTRAL_DPA_CONFIRMED=true`; ohne sie bleibt der
  gesamte Aufruf abgeschaltet. Die Schalter sind technische
  Belege **nach** tatsächlicher Einrichtung, keine
  eigenständige Kostenbegrenzung oder Datenschutzgarantie.
- Serverseitiges Secret `FIB_RIS_MISTRAL_API_KEY` (nicht im
  Frontend, Chat, GitHub oder Quelltext) und optional
  `FIB_RIS_MISTRAL_MODEL`; kein Secret wurde hier angelegt.
- Das angeforderte TOP muss in FIB gespeichert sein und
  zu genau einer **bestätigten** aktuellen, nicht TOP-fremden
  Niederschrift verknüpft sein. Die Versions-ID stammt
  aus dem echten Datenbestand, nicht aus einer freien URL.
- Die amtliche RIS-Sitzungsseite wird **frisch**
  abgerufen; nur eine eindeutige vollständige nummerierte
  Tagesordnung und ein dort aktuell verlinktes,
  identisches Niederschriftdokument gelten als Quelle.
- Der vollständige Niederschrifttext wird im RAM zu allen
  TOPs abgegrenzt, aber **nur der vom Redakteur
  ausgewählte TOP** wird an die KI übertragen.
  Ein TOP ohne Abstimmungsbeleg löst keinen kostenpflichtigen
  KI-Textaufruf aus.
- Die KI liefert eigenständig formulierte, nicht
  automatisch bestätigte Prüftexte. Bei mehreren
  Beschlusspunkten kann der Redakteur **jeden einzeln
  auswählen**, gegen die Originalquelle kontrollieren
  und anschließend über die bereits gesicherte
  `ris_suggest`/`ris_review_suggestion`-Strecke
  freigeben. Keine Original-PDFs im FIB-Speicher,
  keine automatische Veröffentlichung.

**Betriebsbereit erst nach Mistral-Einrichtung:**
Laut offizieller Mistral-Dokumentation sind API-Keys
erst nach Pay-as-you-go-Aktivierung verfügbar.
Im Mistral-Administrationsbereich einen getrennten
FIB-Workspace anlegen, sein **monatliches
Ausgabenlimit auf 5 EUR** setzen und die Begrenzung
nachprüfen. Das Limit wirkt auf den Workspace;
Org-Limit kann zusätzlich enger sein. Es ist ein
*monatliches* Limit, nicht automatisch ein
einmaliger Gesamtdeckel; nach der Probe ist
es zu reduzieren oder die Freigabeschalter
abzuschalten. Mistral weist auf mögliche
Abrechnungsverzögerungen/geringe Überziehungen hin.

Aktuelle Primärquellen:
[Billing](https://docs.mistral.ai/admin/billing-usage/billing),
[Usage limits](https://docs.mistral.ai/admin/billing-usage/usage-limits),
[Storage EU](https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data),
[Data Processing Addendum](https://legal.mistral.ai/terms/data-processing-addendum/).
Die Standardaufbewahrung von Chat-API-Daten
beträgt laut Mistral bis zu 30 Tage;
Zero Data Retention muss gesondert beantragt,
aktiviert und nachgewiesen werden.
Vor Übermittlung echter RIS-Texte sind
Datenschutzbedingungen, technisch konkrete
Aufbewahrungsregel und Ausgabenlimit zu
prüfen und die drei FIB-Schalter erst dann
zu setzen. Kein Key/Limit-Zugriff durch
den aktuellen GitHub-Connector.

**Aktuelle Live-Sperre:** Die einzige in
Shared-Apps lesend nachgewiesene Niederschrift
für Sitzung 1031 ist noch `candidate`,
nicht `confirmed`. Deshalb wäre die
Vorbefüllung selbst bei aktivierter Mistral-
Verbindung aktuell noch blockiert, bis die
amtliche Quelle redaktionell bestätigt
ist. Dies ist beabsichtigtes Fail-Closed-
Verhalten und kein Defekt der KI.
