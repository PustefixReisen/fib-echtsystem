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

`python3 -m unittest discover -s tests/backup -p 'export-deployed-edge.test.py'`

Offline-Fälle: erfolgreicher Export ohne fingierten Review-Beleg,
Inventaränderung während des Downloads, fehlendes Shared-Modul,
bestehendes privates Zielverzeichnis wird nicht überschrieben.
Echte Cloud-Downloads und private Secure-Runner-Freigabe bleiben
gesonderte Betriebsnachweise.
