# Ausgewählte Demonstrator-Entwicklungsdaten

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 13.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ergebnis und Umfang

**Abgeschlossen:** Der Batch `demo-20261013` wurde am 13.10.2026 im bestehenden Shared-Apps-Projekt ausschließlich in `fib` gespeichert und geprüft. Er ist Entwicklungsbestand, kein freigegebener Echtbestand. Alle sieben Meldungen sind Entwürfe ohne Freigabe-/Veröffentlichungsdatum. Es wurde keine Supabase-Instanz angelegt und kein Frontend oder Backend deployed.

Separater Branch: `data/demonstrator-development-sample`, Basis `52a81b61bb5d7edf4562af373d09a15a71dfb7a9` von `main`. PR #74 wurde weder übernommen noch verändert oder gemergt. Insbesondere wurden dessen Sitzung, Vorschau, Auth-/MFA-Code und Benutzerkonten nicht berührt.

| Fallgruppe / Vorgang | Ereignisse / Meldungsentwürfe | Zuordnung |
|---|---|---|
| Hundewiese östlich des Friedhofs | R069: Vorlage; R069-update-20261007: angekündigte Beratung am 15.10. | Zwei getrennte Ereignisse, derselbe Vorgang; kein neuer Beschluss |
| Parkraumkonzept | R026: Ergänzungsbedarf am 12.03.; R068: Veröffentlichung am 09.09. | Entwicklung eines gemeinsamen Vorgangs |
| Ausbau Autobahnkreuz München-Ost mit A99/A94 und M18/EBE4 | R052: Haarer Ablehnung; R008: Feldkirchner Variante 5 | Verbundene Kreisstraßenplanung im Großvorgang; keine Vermischung mit separatem B304-Brückenersatz |
| Tempo 30 B471 / Aschheimer Straße | R094: dokumentierte Stellungnahme zum Bürgerantrag | Vorlage und Stellungnahme, kein zusätzlich unterstellter Ratsbeschluss |

Gespeichert: **3 Quellen, 13 Fundstellen, 4 Vorgänge, 7 Ereignisse, 7 Meldungsentwürfe, 7 Ereignis–Vorgang- und 14 Ereignis–Fundstelle-Beziehungen**. Dieselbe Niederschrift (`id=74927`) wird einmal gespeichert und von Hundewiese sowie Parkraumkonzept referenziert.

## Verbindliche Grundlagen und geprüfte Implementierung

Geprüft: `Fachkonzept.md`, `Begriffe.md`, `Datenmodell.md`, `Themen-und-Vorgangslogik.md`, `Regressionstests-Demonstratortransfer.md`, Migrationsstrategie/-Runbook und Merge-Regel; physisches Schema `supabase/schema/core.sql`, tatsächliche Shared-Apps-Tabellen, Constraints, Trigger und vorhandene Fachservices/Edge Functions.

Das aktuelle physische Schema unterstützt den Wissenskern und Quellenbezüge, aber noch keine operativen Sitzungs-/TOP-/Beschluss-, Referenzwissen-, Wirkungs-, Bild-, Fragen- und Versionsobjekte. Reguläre Bearbeitung bleibt Fachservice-Aufgabe. Dieser begrenzte technische Erstimport erfolgt als Wartungs-/Datenübernahmeoperation; es wird kein neuer regulärer SQL-Arbeitsweg für Redaktion oder KI eröffnet.

Die Planung in offenem PR #71 bevorzugt ein isoliertes Testprojekt. Der ausdrückliche Auftrag vom 13.10.2026 entscheidet für diesen begrenzten Batch stattdessen die Übernahme in das bestehende Echtsystem ohne zusätzliche Instanz. Die konkrete Absicherung besteht hier aus exaktem Manifest, nur anlegender Transaktion, Konfliktabbruch und unveröffentlichten Entwicklungsdaten. **Es handelt sich nicht um ein isoliertes Backend.** Die in PR #71 geplante Reset-/Löschfunktion wurde nicht umgesetzt oder ausgeführt.

## Quellstand und fachliche Entscheidungen

Demonstrator-Commit: `4ed213ef04dfde97984a29c9f6ec0a8b8f7af781`.

- `data/development/demo-20261013/source-snapshot.json` enthält die ausgewählten Originaldatensätze einschließlich Quellen, ursprünglicher Datumsarten/-sicherheiten, Einordnungen und Beziehungen sowie relevante HTML-/Skriptausschnitte. SHA-256-Werte und Quellcommit identifizieren die Eingangsversion.
- `manifest.json` enthält alle erzeugten Objekt-IDs, sämtliche Beziehungsschlüssel und die Zuordnung zum Demonstrator. Stabile UUIDv5-IDs identifizieren diesen Batch; sie ersetzen keine fachliche Dublettenprüfung.
- Ereignis und Meldung bleiben getrennt, genau eine Meldung je Ereignis. Sachinformation und politische Einordnung werden getrennt gespeichert. Es wird keine frühere Demonstrator-Veröffentlichung als Freigabe im Echtsystem interpretiert.
- Ereignisse verwenden den bestehenden Status `confirmed`, weil das aktuelle Schema keinen Entwicklungs-/Kandidatenstatus anbietet. Das ist eine technische Abbildung des Demonstratorfalls, **keine neue redaktionelle Bestätigung**; `confirmed_at` bleibt leer. Sichtbare Titelkennzeichnung und Manifest gelten zusätzlich. Vor Übernahme in Echtbestand ist ein eigener fachlicher Prüf- und Freigabeschritt nötig.
- Tagesangaben werden technisch auf 00:00 Europe/Berlin abgebildet; die Genauigkeit bleibt im Manifest ausdrücklich `day`. Das ist keine belegte Ereignisuhrzeit. Technische Erstellungszeiten zeigen den Import, nicht ein fiktives ursprüngliches Anlagedatum.
- Ungeprüfte Quellpublikationsdaten (`migrated_unique`, Sitzungs-/Ereignisdatum als Ersatz, bloßer Veröffentlichungskontext) werden nicht zu gesicherten `findings.published_at` aufgewertet. Das Original bleibt vollständig in Snapshot und Belegnotiz erhalten. Live-Erreichbarkeit und Nutzungsrechte wurden nicht neu behauptet.
- **Hundewiese:** Der aktuelle JSON-/HTML-Quellstand nennt 15.09.; die frühere 17.09.-Korrektur ist dort nicht eingearbeitet. 15.09. wird als übernommene Quellangabe mit sichtbarem Prüfhinweis erhalten, nicht als neu recherchierte Gewissheit. Der am 07.10. dokumentierte Tagesordnungsschritt wird als eigenes Ereignis angelegt. Die ältere Aussage „Sitzungstermin nicht nachgewiesen“ bleibt zeitlich dem Vorlagenstand zugeordnet. Beschlusspunkt oder Abstimmung wurden nicht erzeugt.
- **Parkraumkonzept:** `app-base-20260831.js` überschreibt die wiederverwendete ID R068 mit einem Bäckerei-/Postfilialtext. Dieser semantische ID-Konflikt wird nicht importiert. Für den Parkraumfall gilt der konsistente JSON-Datensatz einschließlich der später ergänzten Niederschrift; Skriptkonflikt im Snapshot dokumentiert.
- **Autobahnkreuz:** T012 des Demonstrators ist nach Echtsystem-Begriffen primär ein konkreter Großvorgang, kein automatisch bestätigtes übergeordnetes Thema. Die A99/A94-/M18-Bezüge bleiben im Vorgang und im Quellkontext erhalten.

## Bewusst nicht vorgetäuschte Übernahmen

Sitzungs-/TOP-Kontext, ältere Verlaufsverweise außerhalb dieser Auswahl, Referenzobjekte, offene Fragen, Bildverweise und Demonstrator-Themen bleiben im Quellpaket nachvollziehbar. Sie sind noch **keine operativen Objekte** dieser Fachbausteine. Es werden keine leeren Platzhalter oder erfundenen Bestätigungen angelegt.

Es wurden keine Themenbeziehungen als fachlich wirksam gesetzt: Die notwendige redaktionelle Bestätigung der „Bedeutung für das Thema“ liegt für die neue Zuordnung nicht vor. T006 und T012 werden auch nicht zugleich als namensgleiche Themen dupliziert. Weitere passende Themen sind im späteren Arbeitsablauf zu prüfen.

## Import- und Schutzverfahren

1. Vorbestand und aktive technische Struktur lesen; im Ziel existierte ein anderes Live-Testereignis, die übrigen betroffenen Fachtabellen waren leer. Keine Schreibtrigger auf `fib` vorhanden.
2. Lokal im eingebetteten PostgreSQL testen; dafür weder Supabase-Projekt noch Benutzer anlegen.
3. `dry-run.sql` im tatsächlichen Ziel ausführen: alle INSERTs mit anschließender Transaktionsrücknahme. Danach unverändert 1 Ereignis, 0 Meldungen, 0 Quellen.
4. `import.sql` vollständig in einer Transaktion ausführen. Kurzes Lock-Timeout und Tabellenlocks verhindern parallele konkurrierende Import-Schreibvorgänge. Keine Änderung an Auth-/Koordinationstabellen.
5. Erneut ausführen: identische Datensätze bleiben einschließlich Zeitstempeln unangetastet. Abweichende IDs/Feldstände und erkannte natürliche Schlüsselkonflikte führen zum vollständigen Abbruch; es gibt kein blindes Upsert.
6. Sollzahlen und Bestandsschutz prüfen; detaillierter bereinigter Nachweis in `live-verification.json`.

Der Import enthält **nur INSERTs in sieben ausdrücklich benannte `fib`-Fachtabellen**, keine UPDATEs, DELETEs, TRUNCATEs, DDLs, Grants oder Auth-Aufrufe. Quellen werden inaktiv angelegt. Benutzern werden weder Federführungen noch redaktionelle Bearbeitungen zugeschrieben. Vorhandene Identitäten, Rollen und Sitzungen bleiben unverändert.

Bestandsschutz: Anzahl und vollständige Zeilen-Fingerprints aller nicht zum Batch gehörenden FIB-Daten wurden vor/nach Import verglichen: identisch, einschließlich Benutzerzuordnung, Live-Testereignis, Federführung, letzter Bearbeitung und Sperre. Von Memorix/`public` und `auth` wurden keine Nutzdaten gelesen oder geschrieben. Aussage zu deren Schutz beruht auf dem eng begrenzten SQL-Schreibumfang und fehlenden FIB-Triggern, nicht auf einem neuen Memorix-/Auth-Audit.

Kein Löschskript: Titelpräfix oder Slug allein dürfen nie als Bereinigungsfilter dienen. Der aktuelle Bestand wird nicht automatisch zurückgesetzt. Spätere Bereinigung benötigt exakte Manifest-IDs, Abhängigkeits-/Bearbeitungsprüfung und gesonderte Freigabe. Bei einer fehlgeschlagenen laufenden Transaktion wird `ROLLBACK` ausgeführt; ein bereits erfolgreich übernommener und später bearbeiteter Bestand wird nicht ungeprüft entfernt.

## Nachweise

- Lokale SQL-Prüfungen erfolgreich: Dry-Run-Rollback, Sollzahlen/Fremdschlüssel, Schutz vorhandener Zeile, idempotente Wiederholung inklusive Zeitstempel, Entwurfsstatus, keine Quellenveröffentlichung, keine automatischen Themen, Schutz nach redaktioneller Änderung, atomarer Abbruch bei spätem Dublettenkonflikt, gemeinsame Fundstelle, begrenzter Schreibumfang.
- Live: Probelauf zurückgerollt; Import committed; Wiederholung ohne Konflikte; alle Sollzahlen erfüllt; Nicht-Batch-Bestand unverändert.
- Alle FIB-Tabellen weiterhin mit RLS; `anon` und `authenticated` weiterhin ohne `USAGE` auf `fib`; keine Policies oder Berechtigungen verändert.
- CI `Development data import` prüft ausschließlich lokal und hat keine Shared-Apps-Secrets. Sie erzeugt das Paket reproduzierbar und prüft das Transaktionsverhalten. CI-/Merge-Status steht am zugehörigen PR; er wird hier nicht vorweggenommen.
- Kein Anwendungsdeploy und kein Browser-End-to-End-Nachweis: `App.tsx` verwendet weiterhin das feste Live-Testereignis. Die neuen Objekte sind in der DB, aber noch nicht über eine Auswahl in der Oberfläche erreichbar.

## Roadmap-Ergänzung und nächster Schritt

| Arbeitspaket | Status | Ergebnis / nächster Schritt |
|---|---|---|
| Begrenzte Entwicklungsdatenübernahme | Abgeschlossen | Dieser Bericht und versionierter Batch mit Live-Nachweis |
| U2: Zugriff auf die ausgewählten Fälle | Geplant | Autorisierter Lese-/Auswahlpfad im bestehenden UI-Konzept; Quellen, Datumsarten, Entwicklungskennzeichnung und Vorgangsbeziehungen gemeinsam anzeigen; keine neue Menüstruktur ohne fachliche Abstimmung |
| Fehlende Fachbausteine / Bestätigung | Geplant | Sitzungs-/TOP- und Referenzwissen sowie redaktionelle Themenzuordnung nach bestehendem Modell operativ ergänzen; erhaltenen Snapshot als Regression verwenden |
| PR #74 Sicherheitsabnahme | Blockiert durch ausstehende Nachweise | Separate bestehende Prüfung fortsetzen; kein Bestandteil dieses Blocks |

Empfohlen ist zunächst der U2-Lesepfad für diese sieben Fälle. So können die Daten fachlich nachvollzogen und Datums-/Zuordnungsfragen geklärt werden, bevor weitere Imports oder KI-Automatisierung hinzukommen. U1/U2 bleiben insgesamt in Arbeit. Die zentrale `Roadmap.md` wird in diesem unabhängigen Block bewusst nicht gleichzeitig mit PR #74 geändert; diese verlinkte Ergänzung führt den Batchstatus bis zur nächsten Roadmap-Konsolidierung.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 13.10.2026 | Auswahl, Quellkonflikte, Abbildung, Import, Live-Nachweise, Grenzen und nächste Schritte dokumentiert. |
