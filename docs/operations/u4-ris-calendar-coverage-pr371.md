# RIS-Erfassung: Betriebsgrenzen und Prüfnachweise (PR #371)

Stand: 2026-11-01. Dieser Entwurf ist **nicht** freigegeben oder deployed.

## Sitzungsorientierter Einstieg
Der öffentliche Monatskalender `si0040.asp?__cjahr=YYYY&__cmonat=M&__canz=1&__cselect=0` liefert direkte Links auf Sitzungen `si0057.asp?__ksinr=...`. Der Oktober 2026 wurde am Betreiberrechner mit den IDs 1030, 1031, 1078 und 1032 live bestätigt. Ein Termin ohne TOPs bzw. eine unvollständige RIS-Strukturseite wird nicht als vollständig verarbeitet ausgegeben.

## Monatsabdeckung
Bei aktiviertem RIS-Strukturfeature prüft der Scanner pro Aufruf den aktuellen und den vorherigen Monat und zusätzlich genau **einen historischen Monat**. Der historische Cursor beginnt zwei Monate vor dem aktuellen Monat und läuft rückwärts bis einschließlich Januar 2024. Sein `historyNext`-Wert wird nur bei erfolgreichem Abruf innerhalb der normalen Cursortransaktion gespeichert. Fehlgeschlagene Monate werden erneut geprüft. Die begrenzte Historie ab Januar 2024 ist eine technische Übergangsgrenze, **keine fachlich bestätigte Vollständigkeitsgrenze**. Vor einer offiziellen Vollständigkeitszusage Zeitraum und Ausschlüsse redaktionell entscheiden.

## Dokumentliste / Timeout
Die bestehende Dokumentenliste `do0040.asp?smcmode=32832` bleibt eigenständig. Ihr Abruf ist vereinzelt nicht erreichbar; der Scanner erhält bei Fehlern seinen offenen `pending`-Eintrag, schreibt eine Prüflücke und prüft erneut. Die historische Direktseite `do0040.asp?smcadat=2461292&smcmode=32832` war lesbar, ist aber kein nachgewiesener verlässlicher Ersatz für die aktuelle Einstiegsseite. **Keine Fallback-URL ohne verifizierte Reichweite und Freigabelogik**; eine Prüflücke darf nicht als vollständige Erfassung gelten.

## Abnahmegates
- U4 und neue Historien-/Fehlerfälle am letzten Branch-Commit erneut testen.
- Echtes PostgreSQL: mindestens zwei Schreibläufe mit gesichertem Cursor, Wiederanlauf und unveränderten Stammdaten, keine doppelten Sitzungen/TOPs/Dokumente, dokumentierte Änderungen.
- Vorbereitete gemeinsame FIB-Sicherung, aktuelle Edges/Frontend-Exporte, Rollback-Gates und konkrete Freigabe nach `docs/operations/u4-shared-apps-release-plan.md`.
- Bis dahin `FIB_RIS_STRUCTURE_ENABLED=false` und `FIB_RIS_AUTOMATION_ENABLED` unverändert aus; PR Draft, kein Merge oder Deployment.
