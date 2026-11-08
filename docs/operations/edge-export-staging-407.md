# Issue #407 – geschützter Export bereits bereitgestellter Edge Functions

Stand: 08.11.2026. Dieser Schritt automatisiert nur den **technischen
Download und die Prüfung**. Er gibt keine Release-Sicherung frei und
aktualisiert keine Live-Services.

## Grundlage

Supabase unterstützt offiziell:
`supabase functions download <slug> --project-ref <project-ref>`
(Documentation: Supabase, *Transfer edge functions from one project to another*,
https://supabase.com/kb/troubleshooting/transfer-edge-function-from-one-project-to-another).

**Wesentliche Einschränkung:** Nach der offiziellen Dokumentation werden
Import-Maps und `deno.json` nicht zuverlässig durch den CLI-Download
gesichert. Für FIB gilt daher: `import_map=true` führt zum Abbruch;
fehlende relative Shared-Module ebenfalls. Die anschließende ausdrückliche
Prüfung der Vollständigkeit aller benötigten Runtime-Dateien bleibt erforderlich.

## Read-only Stage 1: Staging, keine Freigabe

Nur auf einem bereits geschützten Betreiber-Runner mit Supabase-CLI,
bestehendem Management-Token und privatem Ausgabeverzeichnis:

```bash
umask 077
python3 scripts/backup/export-deployed-edge.py --private-output /PRIVAT/UNIQUE/export-20261108
```

Der Token steht nur als bereits vorhandenes, geschütztes
`SUPABASE_ACCESS_TOKEN` zur Verfügung. Nicht in Kommandozeile, Git oder
Workflow-Artefakte schreiben. Die Ausgabe liegt außerhalb des Repositories.

Das Skript:
- liest das **echte** aktive Supabase-Managementinventar,
- lädt jede bereitgestellte `fib-*`-Funktion in ein frisches
  temporäres Verzeichnis via offiziellem CLI herunter,
- prüft vorhandene Entrypoints, Dateitypen und alle relativen Importpfade,
- liest das Inventar erneut und stoppt bei Versions-/Hash-/JWT-Drift,
- stellt erst danach eine **unbestätigte** private `edge/`-Arbeitskopie
  mit Inventar zusammen; keine automatischen `reviewed=true`-Belege.

## Stage 2: unverändert manuell geschützt

Zusätzlich werden vor einer echten Komplettsicherung unverändert gebraucht:
- unabhängig geprüfte Vollständigkeit der Runtime-Bundles (Import-Map/
  `deno.json`, Shared-Abhängigkeiten und Rollback-Eignung),
- frische echte FIB-Feature-/Quellkonfiguration in
  `configuration/state.json`,
- geprüftes `configuration/capture.json` mit echter Reviewer-Bestätigung,
- verschlüsselte Ablage `fib-backup-crypt:Inputs/<input_id>`,
  Rücklesevergleich und Nachweis in der geschützten Release-Umgebung.

Der existierende `Complete FIB backup`-Workflow übernimmt danach wie
bisher Datenbankdump, isolierten Restore, Frontend-Sicherung,
Komplettbundle-Seal, verschlüsselten Upload und Rücklesetest.

**Nicht durch diesen PR gelöst:** sichere automatische Erfassung und
Review der Konfigurationswerte, GitHub-Actions-Dispatch aus diesem Chat
und vollständige Ende-zu-Ende-Automatisierung. Diese Punkte werden
nach #407 schrittweise umgesetzt, ohne die bisherigen Prüfungen zu
überspringen. Auch die RIS-Korrekturen #404 bleiben bislang unbereitgestellt.

## Tests

`python3 tests/backup/export-deployed-edge.test.py`

Offline-Fälle: erfolgreicher Export ohne fingierten Review-Beleg,
Inventaränderung während des Downloads, fehlendes Shared-Modul,
bestehendes privates Zielverzeichnis wird nicht überschrieben.
Echte Cloud-Downloads und private Secure-Runner-Freigabe bleiben
gesonderte Betriebsnachweise.


## Stage 3: geprüfte private Eingabe automatisch verschlüsselt ablegen

Nachdem die vollständigen Edge-Module und die **wirklichen** FIB-Featurezustände
privat überprüft wurden, liegt ein frisches Verzeichnis mit exakt diesen
beiden Unterverzeichnissen vor:

- `edge/` mit vollständigen runtimefähigen Dateien und `inventory.json`,
- `configuration/` mit `state.json` sowie `capture.json` (aktueller
  `capturedAt`, `featureStatesReviewed=true`,
  `completeFunctionExportsReviewed=true`, **nur nach echter Prüfung**).

Nur im bereits berechtigten privaten Betreiberkontext (kein öffentliches CI,
keine ungeschützten GitHub-Artefakte) kann dann ausgeführt werden:

```bash
umask 077
python3 scripts/backup/stage-reviewed-input.py /PRIVAT/GEPRUEFTES-VERZEICHNIS
```

Das Skript verwendet die vorhandenen geschützten Umgebungswerte
`FIB_BACKUP_MANAGEMENT_TOKEN` und `FIB_BACKUP_RCLONE_CONFIG`; die
passenden rclone-Remotes bleiben unverändert. Es prüft das tatsächliche
Managementinventar zweimal, alle Function-Versionen und -Hashs, die
vollständigen lokalen Abhängigkeiten, den frischen Freigabebeleg und den
exakten Verzeichnisumfang. Erst nach erfolgreichem verschlüsseltem
Upload unter `fib-backup-crypt:Inputs/input-<uuid>` und SHA-256-verifizierter
Rücklesung gibt es die zufällig erzeugte `input_id` aus.

**Folgeschritt:** Die ausgegebene `input_id` in der bestehenden GitHub
Action `Complete FIB backup`, `mode=release`, verwenden. Der Workflow
validiert die Quellinhalte erneut und erstellt erst dann den vollständigen
Release-Sicherungsnachweis. Ein erfolgreiches Staging ist **noch kein**
Release-Backup und keine Bereitstellungsfreigabe.

Wenn ein privater Upload/Readback fehlschlägt, kann ein unvollständiges,
verschlüsseltes `Inputs/<id>`-Verzeichnis zurückbleiben. Es wird niemals
als gültige Eingabe-ID ausgegeben. Eine spätere Bereinigung darf nur nach
gezielter Inventur erfolgen, keinesfalls durch breites Löschen.

**Offene Integrationsarbeiten:** Geschützte automatische Erfassung der
wirklichen FIB-Featurekonfiguration, belastbarer vollständiger
Edge-Runtime-Export trotz etwaiger CLI-Grenzen, Verkettung der geschützten
GitHub-Actions-Läufe und die eigentliche Einmal-Freigabe. Die im Screenshot
sichtbare `input_id`-Pflicht ist mit diesem Schritt noch nicht aus der
GitHub-Oberfläche entfernt. Die Codeprüfung mit simuliertem rclone-Transfer
beweist keine realen Cloud-Zugänge.

Zusätzliche Offline-Tests:

```bash
python3 tests/backup/stage-reviewed-input.test.py
```


## Stage 0: FIB-Quellenzustände lesend erfassen (neu)

Mit vorhandener, TLS-verifizierter Maintenance-Datenbankverbindung lassen sich
**nur die tatsächlichen FIB-Quellen- und Scope-Zustände** sichern:

```bash
umask 077
node scripts/backup/capture-source-state.mjs --out=/PRIVAT/FIB-Quellenzustand.json
```

Der neue Export liest mit einer Repeatable-Read-/Read-only-Transaktion aus
`fib.sources` und `fib.source_scopes`. Er erfasst ausschließlich
Identitäten, `active`, `homepage_url`, Scope-Schlüssel, Status und
Pflichtquellenkennzeichen. Freitext, Konten, API-Schlüssel und Zugangsdaten
werden nicht übernommen.

Die Ausgabe hält ausdrücklich `projectFeatures.status = not_captured`
und `operatorReview = false` fest. **Sie ersetzt nicht**
`configuration/state.json` oder die geschützte Prüfung der tatsächlich
wirksamen Supabase-Projekt-Featureflags. Sie darf nicht automatisch in einen
positiven Release-Review umgewandelt werden. Fehlende Project-Level-Flags
bleiben ein offener Stop-Punkt, kein Wert `false`.

Offline-Test:
`node tests/backup/capture-source-state.spec.mjs`

Der echte Zugriff aus dem Actions-Runner bleibt bis zum gesonderten
Betriebsnachweis ungeprüft; DB-Leseexporte werden nicht in öffentlichen CI-Logs
oder Actions-Artefakten gespeichert.


## Stage 0b: eng begrenzte Supabase-Featureflags prüfen (neu)

Supabase bestätigt für das Management-API `GET /v1/projects/{ref}/secrets`
eine **sensible** Antwort, die auch Geheimwerte enthalten kann
(siehe offizielle Management-API-Dokumentation: `List all secrets`,
https://supabase.com/docs/reference/api/v1-list-all-secrets).
Deshalb darf dieser Endpunkt **ausschließlich** in einem geschützten
Betreiberprozess abgefragt werden. Niemals vollständige Antwort oder
`supabase secrets list` in öffentlichem CI-Log/Issue/Chat protokollieren.

Der neue Export `scripts/backup/capture-feature-flags.py` verarbeitet
in einem eigenen, privaten Prozess ausschließlich folgende *bekannten*
booleschen FIB-RIS-Schalter:

- `FIB_RIS_STRUCTURE_ENABLED`
- `FIB_RIS_AUTOMATION_ENABLED`
- `FIB_RIS_INTEGRATION_TEST_ENABLED`

Andere Secret-Namen und **sämtliche** anderen Werte werden verworfen.
Nur exakt boolesche Werte `true`/`false` sind erlaubt.
Fehlende Flags werden ausdrücklich als `missing` bezeichnet – **nicht**
still auf `false` gesetzt. Die Ergebnisdatei enthält keine Tokens,
Passwörter oder andere Konfigurationswerte.

Privater Beispielablauf, nur mit vorhandener Berechtigung:

```bash
umask 077
mkdir -m 700 -p /PRIVAT/fib-review
node scripts/backup/capture-source-state.mjs --out=/PRIVAT/fib-review/source.json
# Bestehenden geschützten Management-Token nur als SUPABASE_ACCESS_TOKEN setzen.
python3 scripts/backup/capture-feature-flags.py \
  --source-capture /PRIVAT/fib-review/source.json \
  --out /PRIVAT/fib-review/features.json
```

**Nicht daraus abgeleitet:** ein vollständiger Export sämtlicher
Supabase-Projekteinstellungen oder eine wiederherstellbare Kopie von
Geheimnissen. `features.json` kennzeichnet ausdrücklich
`operatorReview=false`, `reviewRequired=true`.
Der geschützte unabhängige Abgleich und die Erstellung einer freigegebenen
`configuration/state.json` und `configuration/capture.json` bleiben
notwendig. Die Daten anderer Shared-Apps-Projekte und sämtliche geheimen
Werte sind von diesem Auftrag ausgeschlossen.

Offline-Test:
`python3 tests/backup/capture-feature-flags.test.py`.
Auch grüne Tests beweisen nicht, dass der Management-Token auf dem
geschützten Runner tatsächlich für den Endpoint berechtigt ist.


## Stage 4: Eine GitHub-Actions-Ausführung ab geprüfter privater input_id (neu)

Der neue **Entwurf** `.github/workflows/ris-correction-release.yml` fasst
drei zuvor getrennte Bedienhandlungen zu einem geschützten
`workflow_dispatch`-Lauf zusammen. Er benötigt exakt:

- `confirmation=DEPLOY` und den tatsächlich genehmigten
  40-stelligen `main`-Commit,
- `reviewed_input_id` aus dem bereits unabhängig geprüften,
  verschlüsselten Input-Staging (keine frei erfundene ID).

**Erforderliche Reihenfolge, ohne Bypass:**

1. `preflight`: Branch, Commit und Input-ID streng prüfen;
2. `backup`: den bestehenden `Complete FIB backup` als
   **reusable workflow** mit geschütztem `fib-release`-Environment
   aufrufen; PostgreSQL-17-Dump/isolierter Restore, Frontend/Edge/
   Konfiguration, Crypto-Upload, Rückleseprüfung und Quittung unverändert
   vor jedem Deployment. Die freigegebene Backup-ID, Manifest-Prüfsumme
   und tatsächliche Commit-SHA werden **erst nach Erfolg** über
   geschützte GitHub-Job-Outputs weitergegeben;
3. `deploy-edge`: bei erfolgreicher Sicherung ausschließlich
   `fib-editorial-write` (`verify_jwt=false`) und
   `fib-u4-ris-pilot` (`verify_jwt=true`) in bestehendem
   `fib-shared-apps`-Environment deployen;
4. `deploy-frontend`: nur bei erfolgreichem Edge-Job und nach **erneuter**
   unabhängiger Backup-Manifestprüfung das statische Frontend in
   `redaktion/` ohne Remote-Löschung mit geprüftem SFTP-Hostkey
   übertragen. Die vorhandenen geschützten Variablen/Secrets und
   Umgebungsfreigaben bleiben in Kraft.

GitHub-Workflow-Jobs werden niemals durch einen synthetischen
Backup-Erfolg oder durch das Setzen einer Readiness-Variable entsperrt.
Eine fehlende Secret-/Actions-Berechtigung bewirkt Abbruch, keine
Umgehung. Bei einem Teilfehler muss nach dem erhaltenen geprüften
Vorversionspaket gezielt zurückgenommen werden; **keine**
automatische Shared-Apps-Datenbankwiederherstellung.

Die Verknüpfung ist als **Draft** implementiert und mit Offline-Vertragstests
abgesichert; sie wurde **nicht** gegen echte GitHub-Environment-/Nextcloud-/
IONOS-/Supabase-Schreibzugänge ausgeführt und ist **keine** Erlaubnis,
jetzt den Workflow zu starten.

**Noch nicht gelöst:** Die unabhängige Prüfung der tatsächlich
wiederherstellbaren Feature-/Edge-Konfiguration vor Staging des
Inputpakets. Deshalb verlangt das Menü noch eine geprüfte
`reviewed_input_id`; eine echte *Ein-Freigabe-Bereitstellung ohne
technische Vorbereitung* ist noch nicht erreicht. Bei einem späteren
Merge aller Workflow-Änderungen muss die sichere Release-Sicherung
an die **neue** ausführende `main`-SHA gebunden werden. Die alte
#404-Implementierungs-SHA ist keine gültige Backup-Ziel-SHA
eines neuen Workflow-Commits.

Vor Einsatz eine gezielte Sicherheits-/Rollbackprüfung und
gesonderte Freigabe der neuen Orchestrierung durchführen;
die bisherige fachliche Freigabe von #404 ersetzt diesen
technischen Review nicht. Parallel bestehender Draft-PR #406
(deploy-only) nur nach Abstimmung konsolidieren, um keine
konkurrierenden Bereitstellungswege zu schaffen.

Offline-Tests:
`python3 tests/backup/orchestrated-release.test.py`.


## Release-Konsolidierung und Live-Drift-Schutz

Der neue verkettete Release-Workflow in PR #408 ist der bevorzugte
**einzige** künftige Weg für dieses RIS-#404-Korrekturpaket. Der separate
Entwurf #406 (`ris-targeted-edge-deploy.yml`) ist damit inhaltlich
überholt; er darf nicht parallel aktiviert werden.

Unmittelbar vor dem ersten Schreibzugriff auf Supabase verifiziert
`check-ris-deploy-drift.py` das aktuelle Management-API-Inventar
gegen den am 08.11.2026 lesend geprüften Live-Stand:

| Funktion | Erwartete Version | JWT-Verifikation |
|---|---:|---|
| `fib-editorial-write` | 20 | false |
| `fib-u4-ris-pilot` | 21 | true |

Auch die bekannten SHA-256-Bundle-Digests werden verglichen. Änderungen
an Version, Bundle oder JWT stoppen die Bereitstellung, statt ältere
oder fremde neue Deployments still zu überschreiben. Vor einer
späteren neuen Freigabe dürfen Referenzwerte nur mit dokumentierter
Live-Neuinventur und ausdrücklich neu geprüftem Umfang angepasst
werden. Der Guard löst kein Rollback aus.

**Einschränkung:** Ein Versionscheck vor dem Deploy schließt ein
Konkurrenzrennen *nach* der Prüfung nicht vollständig aus. Zusätzliche
Deployments außerhalb des bestehenden betrieblichen Wartungsfensters
müssen daher ausgeschlossen werden. Ein grüner CI-Test ersetzt weder
die Berechtigung zum GitHub-Actions-Dispatch noch einen tatsächlichen
verschlüsselten vollständigen Release-Backup- und Restore-Nachweis.


## Live-Quellabgleich und tatsächlicher RIS-Bundle-Befund (08.11.2026)

Eine **lesende** Inventur über die bestehende Supabase-Verwaltungsanbindung
hat am 08.11.2026 alle neun aktiven `fib-*`-Edge-Funktionen als
zugänglich bestätigt. Die drei für die RIS-Sicherung besonders wichtigen
Live-Versionen enthalten folgende bereitgestellte Dateimengen:

| Funktion | Version | Quelldateien | JWT |
|---|---:|---:|---|
| `fib-editorial-write` | 20 | 8 | false |
| `fib-u4-ris-pilot` | 21 | 5 | true |
| `fib-u4-pilot` | 11 | 3 | true |

Die verwendeten Shared-Module (`_shared/ris-structure.ts`,
`_shared/ris-originals.ts`, `_shared/development-datasets.ts`)
stimmen bei mehrfacher Bereitstellung in diesen drei konkreten
Live-Bundles **inhaltlich überein**. Das ist ein lesender
**Live-Quellinventarnachweis**, kein privater Backup-Readback und
kein erfolgreicher Wiederherstellungstest.

Der Exporter `export-deployed-edge.py` nutzt nun zusätzlich
den offiziellen Management-API-Abruf
`GET /v1/projects/{ref}/functions/{function_slug}` und vergleicht
nach dem offiziellen CLI-Download **jede einzelne Datei anhand
SHA-256 ihres Originalinhalts**. Die Liste muss exakt
übereinstimmen, einschließlich `_shared`-Dateien;
zusätzliche, fehlende oder abweichende Dateien führen zum Abbruch.
Versions-, JWT- und Bundle-Metadaten werden nochmals gegen den
ursprünglichen Live-Stand geprüft. Verschiedene Versionen eines
gleichnamigen Shared-Moduls in unterschiedlichen Live-Functions
führen bewusst zum Abbruch, statt eine beliebige Fassung zu sichern.

Der API-Abruf findet ausschließlich im geschützten Betreiberkontext
statt; niemals Live-Quelltexte oder vollständige API-Antworten
in GitHub-Logs, Issues oder Chat kopieren. **CLI-Download selbst,
private Ablage, vollständiger Restore und GitHub-Environment-Zugänge
sind weiterhin nicht live getestet.** Bei einem CLI-Export, der
`deno.json` oder Importmaps nicht liefert, muss der genaue
Live-Dateiabgleich stoppen, sofern diese Dateien Teil des
API-Inventars sind. Unbekannte nichtstatische Runtime-Imports
bleiben gesondert zu prüfen.


## Abgleich direkt während der Komplettsicherung (Ergänzung 08.11.2026)

Die in PR #408 vorgesehene vollständige Backup-Routine prüft seit dieser
Ergänzung **nicht nur** Version/JWT/Bundle-SHA und Dateiexistenz, sondern
liest bei ihrem eigenen, geschützten Durchlauf die echten Deploy-Quelldateien
**aller** aktiven `fib-*`-Functions erneut aus der Supabase-Management-API.
Die `edge/`-Dateien aus dem verschlüsselten, geprüften Input müssen
bytegenau mit diesem Live-Stand übereinstimmen (SHA-256 pro Datei);
`inventory.json` wird als Sicherungsmetadatei ausgenommen.
Fehlende, zusätzliche, widersprüchliche Shared-Module oder geänderte
Dateiinhalte führen **vor dem Datenbankdump und jedem Release** zum Abbruch.

Damit ist eine relevante zeitliche Lücke zwischen der Vorbereitung
und der abschließenden Versiegelung des Sicherungspakets geschlossen.
Die Live-Anbindung und die nötigen Geheimzugänge im echten GitHub-Runner
sind weiterhin nicht erprobt. Dies ist **kein** Beweis eines erfolgreichen
privaten Export-/Rücklese-/Restore-Laufs. Nichtliteral-dynamische Imports,
Runtime-Konfigurationsdateien und eine tatsächlich getestete gezielte
Rücknahme bleiben gesonderte Abnahmepunkte.


## Tatsächlicher Restore-Blocker: typisierte Abhängigkeit in `fib-u4-pilot` (08.11.2026)

Der **lesende, vollständige Management-API-Quelldateiabgleich aller neun
laufenden FIB-Funktionen** hat folgenden konkreten Sonderfall gezeigt:

- `fib-u4-pilot` v11: das Live-Datei-Inventar enthält
  `fib-u4-pilot/index.ts`, `_shared/development-datasets.ts`
  und `_shared/u4-news.ts`.
- `_shared/development-datasets.ts` enthält **`import type { RisSql } from
  "./ris-structure.ts";`**, aber das Live-Datei-Inventar dieser Funktion
  liefert **keine** `_shared/ris-structure.ts`.
- Die vollständige Datei `_shared/ris-structure.ts` ist dagegen bei
  den Live-Funktionen `fib-u4-ris-pilot` v21 und
  `fib-editorial-write` v20 vorhanden und in **diesen beiden**
  Deployments identisch.
- Die aktuelle Datei `supabase/functions/_shared/ris-structure.ts`
  auf `main` unterscheidet sich von der älteren, live deployten
  Datei. Eine Ergänzung aus `main` wäre deshalb **kein originalgetreuer
  Restore**. `development-datasets.ts` hingegen stimmt in den drei
  Live-Deployments untereinander sowie mit `main` überein.

**Bewertung:** Der fehlende Verweis ist ein `import type`, der für
die Laufzeit im transpilierten Bundle entfernt sein kann. Trotzdem
kann der zurückgelieferte Quellbestand nicht ohne Weiteres vollständig
zur erneuten Quelltextprüfung und Bereitstellung verwendet werden.
Der bestehende strenge Abhängigkeitsprüfer **muss** daher
`fib-u4-pilot` derzeit als nicht quellvollständig zurückweisen.
Eine grüne CI mit synthetischen Quellen ist **kein** E2E-Restorenachweis.

**Vorgeschlagene sichere Auflösung:**
1. Offiziellen CLI-Download dieser tatsächlich deployten Version in
   einem geschützten, isolierten Betreiberprozess durchführen und
   feststellen, ob er die fehlende rein typisierte Abhängigkeit liefert.
2. Falls nein, die Lücke in einem ausdrücklich versionierten,
   **separat gekennzeichneten** Wiederherstellungs-Adapter behandeln:
   die ältere Datei darf erst nach unabhängiger Prüfung der
   übereinstimmenden Quellstände aus mindestens zwei tatsächlich
   deployten RIS-Funktionen und dokumentierter Provenienz ergänzend
   verwendet werden. Nicht stillschweigend Repo-`main` substituieren.
3. Einen isolierten Deno-/Supabase-Kompilations- und
   Funktions-Wiederherstellungstest mit diesem Paket durchführen,
   ohne die Live-Funktionen zu überschreiben.
4. Erst danach das Review `completeFunctionExportsReviewed=true`
   und die verschlüsselte Gesamtsicherung freigeben.

Hier ist **noch keine** automatische Ergänzung eingebaut und
**keine** Restore-Freigabe erteilt. Ein Regressionstest erzwingt
den Abbruch bei fehlendem TypeScript-Typimport.


## Geschützter Live-CLI-Test ohne Deployment (neuer Diagnose-Workflow)

Der Entwurf `.github/workflows/fib-edge-source-readiness.yml`
ermöglicht **nach einer gesonderten Prüfung und Übernahme des PRs**
einen autorisierten, nur lesenden CLI-Exporttest direkt in GitHub Actions:

1. In **Actions → FIB Edge source recovery readiness (read-only)**
   den Workflow auf `main` auswählen und `confirmation=CHECK` eingeben.
2. GitHub `fib-release`-Environment-Freigabe und bereits vorhandene
   geschützte `SUPABASE_ACCESS_TOKEN`-Berechtigung verwenden.
3. Der bestehende Exporter lädt alle aktiven `fib-*`-Quellstände via
   offiziellen CLI und vergleicht sie Datei für Datei mit der
   Management-API. Fehler werden nur als generische
   Zugangs-/Vollständigkeitsfehler gemeldet; Quellcode bleibt im
   temporären Runner-Verzeichnis.
4. `if: always()` löscht die Exportdateien auch nach einem Fehler.
   Keine Datenbankmigration, keine neue Secret-Verwaltung, kein
   Deploy, keine Review-Freigabe und keine Sicherungsquittung.

**Status:** Die Workflow-Definition und die statische Syntaxprüfung
sind zunächst nur im Draft-PR #408 vorhanden. Es wurde **kein**
Live-Workflow gestartet. Es ist ausdrücklich möglich und auf Basis der
oben beschriebenen Typimport-Lücke sogar zu erwarten, dass dieser
strenge Vollständigkeitstest vorerst abbricht. Gerade dieses Ergebnis
hilft, einen unvollständigen Restore nicht freizugeben.

Eine Übernahme von PR #408 allein ist **keine** Freigabe zum
Schreib-Release. Vor dem ersten produktiven Einsatz ist die
Gesamtarchitektur gesondert zu prüfen.


## Entkoppelter schreibfreier Live-Test bereits in main (PR #409)

Am 08.11.2026 wurde der eigenständige, geschützte
`FIB Edge source readiness - read only`-Workflow mit vier grünen
CI-Prüfungen über PR #409 nach `main` übernommen
(Squash-Commit `6276868f73024b199d93fc01c9097ca4a2a0051b`).
Er liegt unter `.github/workflows/fib-edge-readonly.yml`,
verwendet `scripts/backup/read-only-edge-check.py` und benötigt
keinen Merge von PR #408.

**Der zuvor in diesem Entwurf erwähnte Workflow
`fib-edge-source-readiness.yml` ist veraltet und wurde entfernt.**
In GitHub unter **Actions → FIB Edge source readiness - read only**
`Run workflow` auf `main` wählen und `CHECK` eingeben.
Dies ist ausschließlich ein lesender Funktionsexporttest, noch keine
Rücknahme-/Release-Freigabe. Die GitHub-Verbindung in diesem Chat
kann `workflow_dispatch` nicht selbst auslösen; zur tatsächlichen
Ausführung ist ein berechtigter Betreiberstart in GitHub notwendig.


## Präzisierung 08.11.2026: gemeinsame statt einzelne Funktionsquellen

Die oben dokumentierte fehlende Typdatei in der **einzelnen**
`fib-u4-pilot`-API-Antwort ist **nicht zwangsläufig ein Blocker für
den vollständigen FIB-Gesamtexport**: Zwei andere tatsächlich
bereitgestellte RIS-Funktionen enthalten die gleichnamige historische
Datei `_shared/ris-structure.ts` in **identischer** Fassung. Der
Gesamtexport aller `fib-*`-Funktionen fasst Shared-Dateien nur dann
zusammen, wenn deren tatsächlich deployte Inhalte übereinstimmen,
und prüft deren Byte-Inhalte unabhängig gegen Supabase.

Die Abschlussvalidierung `components.exports` prüft nun ebenfalls
**alle** Unterdateien des gesamten `edge/`-Baums, einschließlich
transitiver relativer Imports aus `_shared`. Zuvor wurden dort
nur die Verzeichnisse unterhalb der einzelnen Funktionsnamen geprüft.
Damit scheitert die Sicherung bei fehlenden transitiven Typdateien,
auch wenn sie nicht direkt von einem Entrypoint importiert werden.

**Verbleibender Nachweis:** Der offizielle CLI-Download muss die
gemeinsame historische Datei tatsächlich in den Gesamtexport
übernehmen. Falls er sie nicht liefert, darf der Exporter nicht
automatisch Dateien aus `main` substituieren; stattdessen braucht
es einen separat dokumentierten, inhaltlich geprüften
Quell-Provenienz-Adapter sowie einen isolierten Deno-Build- und
Rollback-Versuch. Die bloße Quellinventur ist **kein**
vollständiger Wiederherstellungsnachweis.


## Korrektur nach echtem GitHub-Run vom 08.11.2026 (verbindlich)

**Wichtige Berichtigung zu früheren Textabschnitten:** Der öffentliche
Supabase-Management-Endpunkt `GET /v1/projects/{ref}/functions/{slug}`
liefert nur **Funktionsmetadaten**, ausdrücklich **keine**
`files`-Liste mit Source-Inhalten. Die im älteren Entwurf behauptete
bytegenaue Datei-für-Datei-Verifikation über diesen Endpunkt ist
technisch unmöglich und ist **kein** bereits erbrachter Nachweis.
Die im Chat verfügbare Supabase-Connector-Aktion `get_edge_function`
stellt zwar Datei-Inhalte bereit, deren kombinierte Antwort darf aber
nicht mit dem einzelnen öffentlichen HTTP-Endpunkt verwechselt werden.

Der echte geschützte Read-only-Run #42527253129 scheiterte daher
bei `LIVE_SOURCE_fib-admin-users`, nachdem alle CLI-Downloads
ohne unmittelbar gemeldeten Fehler durchlaufen waren.

**Verbindliche Fassung im Draft #408:** Offizieller CLI-Download
mit privatem vollständigen `edge/`-Baum, Verzeichnis-/
Abhängigkeitsprüfung, plus separater GET
`/v1/projects/{ref}/functions/{slug}/body`-Abruf des echten
EZBR-Funktionskörpers, Prüfung auf `EZBR`-Header und seines SHA-256
gegen das jeweilige Live-Metadatenfeld `ezbr_sha256`.
Nachgelagerter Live-Metadaten-Driftcheck bleibt verpflichtend.

**Grenze des Ergebnisses:** Selbst ein erfolgreicher EZBR-Abgleich
beweist noch **nicht**, dass die von der CLI extrahierten Textdateien
byteidentisch zu allen ursprünglich bereitgestellten Quellmodulen sind.
Ein sicherer isolierter Build-/Wiederherstellungsversuch und eine
nachvollziehbare Runtime-/Konfigurationsinventur bleiben deshalb
Pflicht für `completeFunctionExportsReviewed=true`. Keine
automatische Reviewer-Freigabe, kein Deployment.


## Verbindlicher Multipart-Binärabgleich, Stand 08.11.2026

**Echter geschützter Diagnose-Lauf
[#42528562354](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/42528562354):**
Alle 9 offiziellen CLI-Funktionsdownloads und die Abhängigkeitsprüfung
der gemeinsam heruntergeladenen Programmdateien haben bestanden.
Der unmittelbar folgende Binärcheck meldete dagegen
`DEPLOYED_BUNDLE_fib-admin-users_UNEXPECTED_FORMAT`.

Die Supabase-Management-API kann unter
`GET /functions/{slug}/body` eine **Multipart-Antwort mit eingebetteter
ESZIP-Datei** bereitstellen. Ein Vergleich des vier Zeichen langen
`EZBR`-Headers am Anfang der **gesamten HTTP-Antwort** ist somit
kein gültiger Beleg für einen defekten Funktionskörper. Der öffentliche
GET-API-Vertrag legt das genaue Antwortformat nicht fest. Der
Upload-Endpunkt dagegen dokumentiert das rohe EZBR-Format; die beiden
Endpunkte dürfen nicht verwechselt werden.

Mit [PR #413](https://github.com/PustefixReisen/fib-echtsystem/pull/413)
wird im isolierten, read-only Diagnose-Skript ein größenbegrenzter
Multipart-Wrapper ausgewertet und darin eine eindeutig erkannte
`EZBR`- oder `ESZIP`-Binärdatei gesucht. Nur der SHA-256-Wert
dieser Datei wird mit dem Live-Inventar verglichen. Bei fehlenden,
mehrdeutigen oder unerwarteten Binärdaten wird weiterhin abgebrochen.
Draft-PR #408 verwendet nun dieselbe begrenzte Bundle-Erkennung.

**Keine unzulässige Freigabe aus Teilnachweisen:** Der isolierte
CLI-Quellbaum wurde auf Dateien und relative Abhängigkeiten geprüft.
Die eingebettete Binärdatei wird zusätzlich gegen das
Live-Bundle-Metadatum geprüft. Eine **vollständige Rekonstruktion,
lokale Kompilierung und ausführbare Wiederherstellung** der
ursprünglichen Supabase-Funktion samt Runtime-/Konfigurationseinstellungen
ist weiterhin nicht nachgewiesen. Diese Freigabe darf erst nach
einem separaten Restore-Versuch mit unveränderten Produktionsdaten
und überprüfter Konfigurationsprovenienz erfolgen.

Bis dahin bleibt `completeFunctionExportsReviewed=true` eine
unabhängige, nicht automatisch gesetzte Betreiberentscheidung.
