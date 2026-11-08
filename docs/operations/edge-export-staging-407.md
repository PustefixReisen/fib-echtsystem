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
