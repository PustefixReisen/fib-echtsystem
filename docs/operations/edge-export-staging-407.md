# Issue #407 – geschützter Export bereits bereitgestellter Edge Functions

## Verschlüsselter PreReview-Snapshot – Betreiberbeleg vom 09.11.2026

Der Betreiber hat den bereits bestehenden lokalen Snapshot unverändert über
das vorhandene `rclone`-Crypt-Remote `fib-backup-crypt:` nach Nextcloud
übertragen und vollständig zurückgelesen.

- **Kennung:** `snapshot-20261109T104910Z-4f8e54d609ec6bf4`
- **Ablage:** `fib-backup-crypt:PreReview/snapshot-20261109T104910Z-4f8e54d609ec6bf4`
- **Umfang:** 32 Dateien, darunter neun FIB-Edge-Bundles und private
  Quellen-/Featureflag-Aufnahmen; keine neu erzeugte Datenbank-/Frontend-Sicherung.
- **Nachweis:** 32 Originaldateien gegen 32 zurückgelesene Dateien geprüft,
  SHA-256-Inventare vollständig gleich; verschlüsselte Kopie bestätigt.
- **Klassifikation:** ausdrücklich **Teil-Snapshot mit unvollständigem
  Konfigurationsreview**, keine geprüfte `input_id`, kein vollständiger
  verschlüsselter Release-Backup-Receipt, kein isolierter neuer DB-Restore,
  kein Edge-Wiederherstellungstest und keine RIS-Bereitstellungsfreigabe.
- Die ursprüngliche lokale Kopie und der private Rückleseordner bleiben
  erhalten. Keine Bereinigung von PreReview ohne gesonderte Inventur.

Dieser Betriebsnachweis beruht auf der vom Betreiber zurückgemeldeten
lokalen Terminalausgabe und ist **kein unabhängig durch GitHub Actions
erzeugter Release-Receipt**.

## Betreiberbefund 09.11.2026 – private Ist-Aufnahme, Restore-Grenze

Auf Ubuntu `fib-private-backup/review-gesamt-0911/` liegt eine **unreviewte**
private Ist-Aufnahme (nicht im Repository):

- `input/edge/`: neun per Supabase-CLI heruntergeladene FIB-Funktionen,
  neun durch zwei identische API-Abrufe bestätigte ESZIP-Pakete und
  unverändert mitgesicherte Live-Metadaten; lokale SHA-256-Prüfung **9/9**,
  **19** relative Modulabhängigkeiten geprüft. Die lokale Exportdatei-Prüfung
  ist kein unabhängiger Funktions-Wiederherstellungstest.
- `review/source.json`: drei Quellen, drei Scopes, lesend erfasst.
- `review/features.json`: `status=incomplete`.
  `FIB_RIS_STRUCTURE_ENABLED` existiert, sein Wert ist **unverified**.
  `FIB_RIS_AUTOMATION_ENABLED` und
  `FIB_RIS_INTEGRATION_TEST_ENABLED` sind **missing**, nicht `false`.

Der Betreiber hat die Anzeige in Supabase **Edge Functions → Secrets**
geprüft: Dort kann ein einmal gespeicherter Secret-Wert nicht erneut
eingesehen werden. Das angezeigte Eingabefeld enthält nur einen Platzhalter.
Es erfolgte **keine** Secret-Änderung.

**Freigabeentscheidung: GESPERRT.** Die bisherige Erfassung ist ein
verifizierter *Datei*-Snapshot mit bekannten Grenzen, aber keine
vollständig bestätigte wiederherstellbare Konfiguration. Weder
`featureStatesReviewed=true` noch
`completeFunctionExportsReviewed=true` ist daraus ableitbar;
`configuration/state.json` und `configuration/capture.json` dürfen
nicht fingiert werden. Keine gültige `input_id`, kein verschlüsselter
vollständiger Restore-/Readback-Receipt, keine RIS-Bereitstellung.

**Kleinster nächster tatsächlicher Nachweis:**
1. Betreiberseitig prüfen, ob der exakte ursprüngliche Wert von
   `FIB_RIS_STRUCTURE_ENABLED` bereits in einer zugelassenen lokalen
   Geheimnisverwaltung oder privaten Betriebsdokumentation hinterlegt ist.
   Den Wert **nicht** in GitHub, Chat, Logs oder unverschlüsselte
   Snapshotdateien übertragen. Fehlende Flags als fehlend beibehalten.
2. Falls keine autorisierte Originalkopie existiert, lässt sich der
   ursprüngliche Zustand nicht rückwirkend durch API/Dashboard rekonstruieren.
   Eine Festlegung eines **neuen** bekannten Werts wäre eine gesondert
   zu genehmigende produktive Konfigurationsänderung und gehört nicht zur
   laufenden read-only Sicherung.
3. Unabhängige Prüfung der Edge-Quellvollständigkeit und
   Wiederherstellbarkeit vor positiver Reviewer-Bestätigung.
   Erst danach bestehendes `stage-reviewed-input.py` und den geschützten
   `Complete FIB backup` verwenden.

Nicht erneut herunterladen oder die vorhandenen privaten Dateien löschen,
solange keine tatsächliche Änderung der Live-Inventare sie überholt.

### Codeprüfung des nicht lesbaren RIS-Flags (09.11.2026)

Das Flag ist **aktiv im Programmcode verwendet** und darf nicht als Altlast
eingestuft werden:

- `supabase/functions/fib-u4-ris-pilot/index.ts` prüft
  `Deno.env.get('FIB_RIS_STRUCTURE_ENABLED') === 'true'` (im
  Repository-Stand bei Zeile 114). Bei `true` wird beim RIS-PDF-Durchlauf
  `persistRisDocument(...)` ausgeführt; bei anderen/fehlenden Werten
  ist dieser zusätzliche Struktur-/Originalspeicherpfad nicht eingeschaltet.
- `FIB_RIS_AUTOMATION_ENABLED` steuert gesondert den Scheduler-Zugang
  (nur explizites `true` aktiviert); `FIB_RIS_INTEGRATION_TEST_ENABLED`
  steuert gesondert den integrierten Test-Schreibpfad (ebenfalls nur
  explizites `true` aktiviert). Beide sind laut Management-API derzeit
  nicht angelegt; ihr Fehlen bleibt als Fehlen dokumentiert.
- `docs/operations/u4-ris-persistence.md` bestätigt, dass
  `FIB_RIS_STRUCTURE_ENABLED=true` die RIS-Fachstruktur einschaltet.
  `u4-shared-apps-release-plan.md` sieht ausdrücklich eine
  kontrollierte Aktivierung *nach* gesonderter Freigabe vor und betont,
  dass der bisherige Wert nicht ausgelesen wurde. Diese Planangabe
  ist **kein Beleg**, dass der aktuelle produktive Wert `true` oder
  `false` ist.

**Befund:** Das Secret ist funktional relevant, aber sein genauer
produktiver Inhalt lässt sich weder aus dem Secret-API noch aus dem
Supabase-Dashboard noch aus der privaten KeePass-Dokumentation
rekonstruieren. Eine reine Quellcodeanalyse beweist nicht den aktuell
eingestellten Wert. Daher keine Umdeutung in `false` und kein positives
`featureStatesReviewed`.

**Entscheidungsgrenze:** Vor einer vollständig wiederherstellbaren
Konfigurationssicherung müsste der bisherige autorisierte Wert aus einer
anderen verifizierbaren geschützten Quelle nachgewiesen werden; falls
nicht möglich, ist eine gesondert freigegebene, kontrollierte Neusetzung
mit vorheriger Wirkungs-/Rollback-Prüfung notwendig. Solch eine Änderung
gehört **nicht** in den read-only Sicherungsauftrag. Eine separat
verschlüsselte Beweissicherung des unvollständigen Ist-Zustands wäre
allenfalls als eingeschränkter Snapshot, nicht als vollständiger
Release-Backup-Receipt zu kennzeichnen.

## Technische Präzisierung 09.11.2026 – ESZIP-Integrität

Der bisherige Vergleich `SHA256(GET /functions/<slug>/body) == ezbr_sha256`
war fachlich falsch: Der Live-Endpunkt liefert einen **ESZIP**-Körper,
während `ezbr_sha256` die Prüfsumme eines ursprünglich hochgeladenen
**EZBR + Brotli**-Payloads bezeichnet. Eine erneute Brotli-Komprimierung
garantiert kein Bytegleichnis.

Das Exportskript bewahrt nun das unveränderte Metadatum `ezbr_sha256`
im Inventar, ruft den echten ESZIP-Funktionskörper **zweimal** je Funktion
ab und verlangt identische Antworten. Die gelesenen Bytes werden als
`input/edge/_deployed_bundles/<slug>.eszip` geschützt mitgesichert.
`inventory.json` enthält zusätzlich `download_eszip_sha256`; der
vorhandene Validierer `components.exports` prüft diesen SHA-256
gegen die tatsächlich gesicherten ESZIP-Dateien und der vorhandene
Staging-/Gesamtbackup-Readback prüft den vollständigen Datei-Bestand.

**Grenze dieser Prüfung:** Metadaten-/Versionsdrift, zweifache
Live-Byteidentität und SHA-256-Readback beweisen die **stabile Sicherung des
über die API gelieferten Funktionskörpers**. Sie beweisen *nicht*, dass die
rekonstruierten CLI-Quelldateien bytegleich dem ursprünglich hochgeladenen
Bundle sind oder dass ein späteres Deployment sofort gelingt. Diese
Restore-/Quellvollständigkeitsprüfung bleibt vor positiven
`completeFunctionExportsReviewed`-Belegen eine unabhängige
Betreiberaufgabe. Keine Produktionsbereitstellung, keine künstliche
Reviewfreigabe. Ein fehlerfreier Offline-CI-Lauf ist kein Live-Backup.

Die Featureflag-Aufnahme speichert vorhandene Nicht-Boolean-Werte
ausschließlich als `unverified` (niemals den Rohwert). Fehlende Flags
bleiben `missing`; ein `incomplete`-Snapshot ist **nicht** freigegeben.
Die zugehörigen echten Werte müssen vor positivem Review unabhängig
geklärt werden.


## Einmalige Vorbereitung am geschützten Ubuntu-Betreiberrechner (09.11.2026)

Statt der bisherigen drei getrennten Exportschritte genügt **ein**
lokaler Befehl aus dem ausgecheckten PR-#408-Stand. Er verwendet die
bereits vorhandenen geschützten Umgebungswerte
`SUPABASE_ACCESS_TOKEN` und `FIB_MAINTENANCE_DATABASE_URL`.
Die Zugangsdaten werden **nicht** als Argumente übergeben. Die
Zieladresse muss unter einem bereits vorhandenen privaten Ordner
mit Berechtigung 0700 liegen, **außerhalb** des Git-Repositories.

```bash
umask 077
mkdir -p -m 700 "$HOME/fib-private-backup"
python3 scripts/backup/prepare-private-review.py \
  --private-root "$HOME/fib-private-backup/review-erstlauf"
```

Das Skript ruft die bereits vorhandenen Lese-Exporte nacheinander auf.
Es erstellt ausschließlich
`review-erstlauf/input/edge/` (neun FIB-Funktionen und
`inventory.json`),
`review-erstlauf/review/source.json`,
`review-erstlauf/review/features.json` und das **leere**
`review-erstlauf/input/configuration/`. Keine echten Secrets oder
Quellinhalte werden nach GitHub übertragen oder ausgegeben.
Falls ein Teilschritt scheitert, wird nur das gerade neu erstellte
Arbeitsverzeichnis wieder entfernt.

**Danach ist eine tatsächliche Betreiberprüfung erforderlich:**
Die `review/`-Dateien samt etwaigen fehlenden Featureflags gegen
den wirklichen FIB-Konfigurationsstand prüfen, den vollständigen
`input/edge/`-Baum auf originale Runtime-Dateien und kritische
Shared-Abhängigkeiten prüfen. Die geprüften Ergebnisse als
`input/configuration/state.json` und den wahrheitsgemäß
bestätigten Freigabebeleg `input/configuration/capture.json`
erfassen. **Das Skript setzt keinerlei Reviewflag und erzeugt keine
`input_id`.** Bei fehlenden Nachweisen bleibt die Freigabe
gesperrt. `review/` selbst darf nicht in das gesicherte
`input/` übernommen werden.

Erst danach:
```bash
python3 scripts/backup/stage-reviewed-input.py \
  "$HOME/fib-private-backup/review-erstlauf/input"
```

Das bestehende Staging validiert den Inhalt gegen die aktuellen
Live-Deployments, verschlüsselt ihn, prüft die Rücklesung und gibt
erst bei Erfolg eine **echte** `input_id` aus. Diese ist die
Eingabe für genau einen geschützten `Complete FIB backup`-Run
(`mode=release`). Der gesamte Ablauf berührt keine
Produktionsdaten durch schreibende Befehle.

**Grenze:** Ohne die lokalen, bestehenden Management- und
Datenbankzugänge kann ChatGPT diesen privaten Erstlauf nicht
stellvertretend ausführen. Der Betreiber muss die Eingangsdaten
nicht an den Chat schicken.

> **Verbindlicher Betriebsstand – 09.11.2026 (ersetzt widersprechende historische Aussagen unten):**
>
> **Noch nicht startbereit:** Eine **echt geprüfte private**
> `reviewed_input_id` ist nicht belegt. Der Workflow darf deshalb
> nicht mit einer erfundenen ID oder künstlichen Review-Flags gestartet
> werden. Vier grüne PR-CI-Workflows sind kein Beweis einer vollständigen
> verschlüsselten Sicherung.
>
> **Einmaliger, notwendiger Betreiberablauf:** Im bestehenden geschützten
> Ausführungskontext zuerst `export-deployed-edge.py` für **alle neun**
> aktiven FIB-Edge-Functions ausführen. Den vollständigen privaten
> `edge/`-Baum inklusive `_shared` und `inventory.json` sowie
> Runtime/Imports und das separate Live-Bundle-Digest-Ergebnis prüfen.
> Danach die tatsächlichen FIB-Quellen-/Featurezustände über
> `capture-source-state.mjs` und `capture-feature-flags.py`
> erfassen, fehlende Flags ausdrücklich als **ungeklärt** behandeln
> und nur aus tatsächlich geprüften Werten
> `configuration/state.json` und `configuration/capture.json`
> erstellen. **Nur nach echter Review** dürfen
> `featureStatesReviewed` und `completeFunctionExportsReviewed`
> wahr sein. Anschließend `stage-reviewed-input.py` ausführen:
> Dieses Skript validiert und verschlüsselt den Input, liest ihn
> zurück und gibt die echte `input_id` aus.
>
> **Dann genau ein echter vollständiger Sicherungslauf:**
> Geschützter Workflow `Complete FIB backup` mit
> `mode=release` und dieser `input_id`; nach erfolgreichem
> DB-Restore, Quellen-/Frontend-/Konfigurationsinventar,
> Nextcloud-Crypt-Upload und Rückleseprüfung muss eine verifizierte
> Backup-Quittung vorliegen. **Erst anschließend** den gesondert
> genehmigten RIS-Release in Betracht ziehen.
>
> **Nicht mehr notwendig:** Wiederholungen des alten roten
> Read-only-Workflows allein wegen des optionalen, isolierten
> Deno-Typechecks. Der erfolgreiche Quell-Download-/Importteil
> des echten Laufs ist dokumentiert. Das unabhängige Deno-Diagnosewerkzeug
> bleibt verfügbar, ist jedoch **kein Backup-Gate**. Ein vollständig
> durchgespielter Edge-Runtime-Rollback ist weiterhin offen und darf
> nicht als erfolgreich bezeichnet werden.
>
> **Grenze dieser Chat-Anbindung:** Der private Runner, seine
> verschlüsselten Eingangsdaten und geschützten GitHub-Actions-Secrets
> sind hier nicht für eine echte `reviewed_input_id`-Erstellung
> verfügbar. Der Chat kann daher den produktiven vollständigen
> Sicherungslauf nicht ehrlich als durchgeführt kennzeichnen.

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


## Rekonstruktionsprüfung im isolierten Deno-Prozess (08.11.2026)

Im Draft-PR #408 steht nun `scripts/backup/check-edge-isolated.py`.
Der Prüfer erhält einen privaten Gesamtexport und alle tatsächlich
inventarisierten Funktions-Slugs und führt für deren `index.ts`
einen reinen `deno check --no-config --no-lock` aus:

- kein Funktionsaufruf, keine Abfrage von Datenbanken, kein Deploy;
- Deno bekommt ausschließlich `PATH`, ein separates temporäres
  `HOME`, `DENO_DIR`, `DENO_NO_PROMPT` und `NO_COLOR`.
  Supabase-/DB-/IONOS-/Nextcloud-Tokens und GitHub-Variablen
  werden explizit **nicht** an den Deno-Unterprozess weitergegeben;
- Kompilations-/Dependency-Fehler beenden den Sicherungsworkflow,
  **bevor** der Live-Datenbankdump beginnt. Deno-Compiler-Output
  mit möglicherweise privaten Pfaden/Quellfragmenten bleibt
  aus den GitHub-Protokollen heraus;
- der vollständige Backup-Workflow installiert Deno 2.5.6 und
  verlangt den Preflight zusätzlich zum CLI-Quellbestand und
  dem separaten Live-Bundle-Digest.

Die CI enthält einen tatsächlich ausgeführten Deno-Check an einer
**künstlich erzeugten** Edge-Funktion ohne Produktivquellen sowie
Unit-Tests für Fehler, Symlinks, unzulässige Slugs und
Geheimnisisolation. Der isolierte Test ist im GitHub-Runner
erfolgreich. Es sind **keine** produktiven Edge-Quelltexte in
Testartefakten abgelegt.

**Einschränkung:** `deno check` ist Typechecking, keine ausgeführte
Supabase-Edge-Runtime und kein Rollback. Es kann für
externe `npm:`-/`https:`-Module Netzwerkzugriffe benötigen;
ohne Lockfile ist die Reproduzierbarkeit zukünftiger Abhängigkeiten
nicht garantiert. Vor einer Betriebsgenehmigung sind
die tatsächlichen Live-Quellen mit ihren Imports und
Konfigurations-/Runtime-Anforderungen in einem isolierten
Testkontext zu prüfen. Der sichere Rückweg muss außerdem an einer
vom Produktivsystem getrennten Laufzeit praktisch ausprobiert werden.
Bis dahin kein `completeFunctionExportsReviewed=true`
aufgrund dieser Teilprüfung allein.


## Live-Deno-Preflight unabhängig bereitgestellt (PR #414)

Die bislang nur in Draft-PR #408 vorgesehene
`check-edge-isolated.py`-Prüfung ist nun auch über
[PR #414](https://github.com/PustefixReisen/fib-echtsystem/pull/414)
eigenständig in `main` integriert
(Merge-Commit `47d7b5678b67b81cc2f7650cf9b8d5aba3618efc`).

Der geschützte Workflow `FIB Edge source readiness - read only`
führt beim nächsten manuellen `CHECK` nach Download und
Modulabhängigkeitsprüfung **auch für die tatsächlich deployten
neun Funktionen** einen isolierten `deno check` durch. Dafür
erhält Deno keine Supabase-/GitHub-/DB-/Backup-Zugangsdaten.
Ein Fehler wird allein als `ISOLATED_DENO_TYPECHECK`
angezeigt. Die temporären Originalquellen werden nicht als
GitHub-Artefakt veröffentlicht.

Auf dem Merge-Vorstand von PR #414 waren vier von vier
CI-Workflows erfolgreich; die tatsächliche Deno-CLI wurde an
einer künstlichen TypeScript-Datei getestet. Der Live-Deno-Test
selbst ist **noch nicht ausgeführt** und bleibt ein eigener
Abnahmeschritt, keine stillschweigende Freigabe. Die Prüfung
kann beim Auflösen externer `npm:`-/`https:`-Module Netzwerk
benötigen; für dauerhaft reproduzierbare Wiederherstellung
werden zusätzlich eindeutige Abhängigkeitsversionen,
Runtime-Eigenschaften und ein ausgeführter Restore-Test benötigt.


## Entscheidung 09.11.2026 – Datensicherung nicht durch Deno-Typecheck blockieren

Der reale, vom Betreiber autorisierte Read-only-Run
[#42571680641](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/42571680641)
ist beim ersten Versuch bereits während `supabase/setup-cli@v1` mit
HTTP 504 gescheitert. Der fehlgeschlagene Job wurde über die GitHub-
Anbindung **direkt erneut ausgeführt**, ohne weitere Betreiberhandlung.
Beim zweiten Versuch gelangen CLI-Installation, Deno-Installation,
CLI-Quelldownload und gemeinsame relative Modulprüfung; erst danach
brach der zusätzliche isolierte Deno-Typecheck mit
`ISOLATED_DENO_TYPECHECK` ab. Die echten Fehlerdetails werden aus
Geheimnisschutzgründen nicht öffentlich geloggt.

Die Bestandsfunktionen verwenden unter anderem `npm:`- und `jsr:`-
Abhängigkeiten; ein `deno check --no-config --no-lock` außerhalb der
ursprünglichen Deploy-Konfiguration ist kein verlässliches Kriterium
für die *Sicherbarkeit* bereits deployter Originalquellen. Daher ist
die zusätzliche Deno-Typprüfung **kein verpflichtendes Backup-Gate**
mehr: Sie wurde aus `scripts/backup/run.py` und der
`complete-backup.yml` entfernt, ebenso die redundante Deno-CI-
Fixture im Backup-Draft. Der separat bereitgestellte schreibfreie
Diagnoseworkflow und seine isolierten Tests bleiben verfügbar.

**Verbindlicher Backup-Mindestumfang:** Vollständiger CLI-Export aller
neun tatsächlich bereitgestellten FIB-Funktionen samt notwendiger
`_shared`-Module und Herkunfts-/Versionsinventar, relative
Abhängigkeitsprüfung, gesonderte Live-Binärdigestkontrolle (sofern
das tatsächlich gelieferte API-Format technisch valide geparst werden
kann), verschlüsselte Aufbewahrung samt vollständigem Rücklesen,
Datenbankdump mit isoliertem Restore, Frontend und Konfiguration.
Keine fiktive Freigabe von `completeFunctionExportsReviewed` und
kein automatisches Deploy. Ein laufzeitnaher Edge-Start-/Rollbacktest
bleibt als separates, klar benanntes Restrisiko offen, darf aber
eine vorhandene **Datensicherung** nicht pauschal verhindern.

Diese Entscheidung korrigiert die früheren Abschnitte dieser Datei,
die Deno-Typechecking ausdrücklich als zwingende Sperre bezeichnet
hatten. **Diese ältere Forderung gilt nicht mehr.**
