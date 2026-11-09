# RIS-Nachabnahme: gebündelte Freigabe und Bereitstellung (#403 / PR #416)

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
