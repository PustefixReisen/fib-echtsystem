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
