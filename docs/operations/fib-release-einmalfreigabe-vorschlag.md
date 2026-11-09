# FIB-Releases mit einer bewussten Freigabe – Umsetzungsvorschlag

Stand: 08.11.2026. **Nur Untersuchung, keine neue Automatisierung implementiert.**
Fortführung von #398 und den Konzeptentwürfen [PR #399](https://github.com/PustefixReisen/fib-echtsystem/pull/399)
und [PR #400](https://github.com/PustefixReisen/fib-echtsystem/pull/400).
Kein neues Infrastrukturmodell, kein paralleles Betreiberwerkzeug. Konkreter Anlass:
[Release #404](ris-404-release-status-2026-11-08.md). Bestehende Betriebsregeln gelten
bis zur gesonderten Prüfung/Freigabe einer Umsetzung unverändert.

## Empfehlung und Bedienung

Die vorhandenen GitHub-Actions-, Supabase-, IONOS- und rclone-crypt-Bausteine zu einem
überschaubaren Release-Ablauf verbinden. Keine neue dauerhafte Plattform. Der Betreiber
wählt den geprüften Release und liest eine kurze Zusammenfassung: Änderungen,
Betriebsphase, betroffene Komponenten, Daten-/Memorix-Auswirkung, Sicherungs-/Rücknahmeweg,
bekannte Risiken und persönliche Retestfälle. Danach **eine** bewusste Environment-Freigabe
für genau diesen unveränderlichen Commit und Umfang. Technische IDs/Prüfsummen werden
maschinell weitergereicht; keine manuelle Übertragung zwischen Formularen.

```text
Vorbereitung ohne Live-Schreiben -> verständlicher gebundener Releaseplan
-> eine Freigabe -> frische Sicherung + Integrität -> Driftvergleich
-> nur betroffene Edge Functions -> Frontend -> lesender Smoke
-> Erfolg oder begrenzte Rücknahme -> Betreiberbericht + persönliche Nachabnahme
```

Die Sicherung erst nach der Freigabe aufnehmen, damit die Ein-Stunden-Frist nicht
während einer längeren Genehmigungswartezeit abläuft. Vor der Freigabe werden Zugang,
Machbarkeit und vorgesehener Rücknahmeweg geprüft; nachher die tatsächlichen frischen
Belege erzeugt. Fehlende Zugänge oder abgelaufene Belege führen zu einem klaren Stopp,
nicht zu weiteren technischen Bestätigungsdialogen oder stillen Schutzabsenkungen.
Eine inhaltlich geänderte Planung benötigt eine neue Freigabe; ein unveränderter
wiederholbarer technischer Schritt innerhalb der gültigen Freigabe nicht.

## Wiederverwendung und konkrete Lücken

| Vorhanden | Gezielte spätere Anpassung |
|---|---|
| Git-Diff, acht relevante CI-Workflows, feste Commits | Laufzeit-Importgraph für Edge einschließlich Shared-Modulen; Typimporte ignorieren. Nur bereits vorhandene Functions auswählen. Neue Entrypoints, Migrationen, Secrets/Auth oder Cron als ausdrücklich zu prüfenden Zusatzumfang ausweisen. |
| Snapshot-Dump und Bundle-Prüfung | Bestehende Routinen weiterverwenden; Quittung/Commit/Alter/Hashes automatisch binden. Keine private Sicherung als öffentliches Artifact. |
| Complete FIB backup | Geprüften Exportadapter für tatsächliche Edge-Dateien und selektive FIB-Konfiguration ergänzen. Der heutige frische private Inputs-Export bleibt bis dahin eine echte manuelle Voraussetzung. Keine gemeinsamen Secretwerte auslesen. |
| Getrennte Backend-/Frontend-Workflows | Bestehende Jobs wiederverwendbar machen und im selben genehmigten Ablauf verbinden. Der heutige allgemeine Edge-Workflow ist für #404 ungeeignet: falsche Slugliste und pauschal deaktiviertes Gateway-JWT. |
| Strenger Release-Deploy und Entwicklungsfrontend ohne Remote-Löschung | Risikoklasse auswerten, passenden vorhandenen Weg nutzen, JWT pro Function erhalten; Hostschlüssel überall prüfen. Deployment und Rücknahme serialisieren, damit FIB-Läufe nicht ineinandergreifen. |
| Isolierte E2E-Tests und bestehender MFA-Zugang | Unverändernde Live-Prüfungen und Releasekennung ergänzen; Ergebnisse von simulierten Quellantworten trennen. Fehlender menschlicher AAL2-Kontext ist sichtbar, kein Anlass zu Tokenminting oder MFA-Umgehung. |
| Gesicherte Vorversionen und Rücknahmevertrag | Rücknahme zunächst für Backend-/Frontend-Dateien automatisieren und testen; DB/Auth bleiben davon ausdrücklich ausgeschlossen. |

Für #404 zeigt die Analyse den Nutzen: nur zwei vorhandene Functions plus Frontend,
keine Migration. Ein nicht bereitgestellter Scheduler-Einstieg darf durch reine
Abhängigkeitsanalyse nicht automatisch neu aktiviert werden.

## Fünf überschaubare Arbeitspakete

1. **Plan und Vorprüfung:** vorhandene Skripte/Workflows inventarisieren, Änderungsklassen
   aus PR #400 übernehmen; Commit, Phase, CI und erwartete Live-Versionen in einem
   nicht vertraulichen Manifest binden. Akzeptanz: #404 wird als zwei aktive Functions
   plus Frontend erkannt, neue/risikoreiche Änderungen führen zum Plan-Stopp.
2. **Sicherungslücke schließen:** bestehende Zugänge und Actions-Berechtigungen prüfen,
   tatsächlichen Function-Export und selektive FIB-Zustandsaufnahme testen; privaten
   Inputs-Handschritt ablösen. Akzeptanz: fehlender Export, unvollständige Abhängigkeit,
   Drift, ungültige Prüfsumme oder Rücklesefehler verhindert Deployment. Vorhandene
   Restorebelege nicht erneut verlangen, wenn die freigegebene Risikoklasse das erlaubt;
   heutige strengere Validatoren bis zur geprüften Änderung unverändert lassen.
3. **Ablauf verbinden:** bestehende Capture-/Deploy-Jobs nach einer Environment-Freigabe
   sequenzieren, Quittungen intern weiterreichen, exakt freigegebenen Stand auschecken.
   Akzeptanz: keine händischen Backup-IDs/Hashes, keine fremden Slugs, keine JWT-Drift,
   kein automatischer Quellenlauf und keine neue Migration durch einen gewöhnlichen Release.
4. **Smoke und Rücknahme:** lesende Health-/Versions-/RIS-Prüfungen mit begrenzten Timeouts;
   geprüfte Vorversionen rückspielbar machen. Akzeptanz: injizierter Upload-/Smoke-Fehler
   führt zu nachvollziehbarem Stopp oder nur zur freigegebenen Komponentenrücknahme.
   Rückgespielter Edge-Code erhält die vorherigen JWT-Einstellungen; seine numerische
   Deploymentversion kann steigen. Keine falsche Zusage eines Datenbank-One-Click-Restore.
5. **Betreiberbericht und Erprobung:** eine Seite mit bereitgestelltem Commit, Ergebnissen,
   Sicherungsquittung ohne Inhalte, Rücknahme und kurzen Retestfällen. Zuerst isolierter
   Test, dann separat freigegebener Entwicklungsrelease; Pilot/Produktion erst nach den
   bestehenden Go-live-Gates. Akzeptanz: Betreiber benötigt für einen normalen Release
   nur Auswahl/Lesen/Freigabe, danach die persönliche Funktionsprüfung.

Keine dieser Anpassungen ist mit diesem Dokument bereits implementiert oder freigegeben.
Bestehendes Issue #398 genügt zur Planung; kein doppeltes Automatisierungs-Issue nötig.

## Sicherheit, Aufwand und Kosten

| Variante | Bewertung |
|---|---|
| Heutige getrennte Formulare/Exports | Wenig neue Technik, aber hoher Bedienaufwand, fehleranfällige Übergabe und Alterung privater Belege; aktuelle Blocker bleiben. |
| Bestehende Bausteine verbinden (Empfehlung) | Hoher Automatisierungsgrad bei mittlerem einmaligem Prüf-/Implementierungsaufwand; geringer späterer Bedienaufwand. Fehlerbehandlung/Exportadapter brauchen echte Integrationsnachweise. Keine neue dauerhaft betriebene Infrastruktur. |
| Neuer Deploydienst oder eigenes Betreiberportal | Zusätzlicher Integrations-/Pflegeaufwand und mögliche laufende Kosten; für den nachgewiesenen Bedarf nicht erforderlich. |

0 Euro zusätzliche laufende Infrastrukturkosten bleibt Planungsgrenze. Vorhandene
Actions-Minuten, Supabase-Ressourcen und verschlüsselter Backupspeicher werden trotzdem
verbraucht; Kontingente und Aufbewahrung prüfen. Keine unbelegte Zusage unbegrenzter
kostenloser Nutzung. Keine automatische Remote-Bereinigung oder neue Zeitpläne.

Entwicklung darf die vorhandene risikogerechte Ausnahme nutzen: reine statische Änderungen
brauchen keinen pauschalen DB-Restore. Backend-/Datenänderungen benötigen passende aktuelle
Sicherungen. Der konkrete aktuelle #404-Auftrag verlangt eine Gesamtsicherung und wird
durch diesen Zukunftsvorschlag nicht erleichtert. Pilot/Produktion behalten strengere
Go-live-, Datenisolations- und Recovery-Nachweise.

Memorix bleibt laufend und unverändert: nur explizite FIB-Slugs, Schema fib und der
Redaktionspfad; keine Projekt-Resets, Auth-/DSN-/Secretänderungen oder fremden Policies.
Gemeinsame Rechenressourcen und Kontingente bleiben gekoppelt. Bei ungeklärter Drift,
Kosten oder zusätzlichem Umfang abbrechen. Statische Veröffentlichung ist heute nicht
als atomar bewiesen; IONOS-Verzeichniswechsel erst nach Machbarkeitstest vorsehen,
ansonsten Manifest-basierte Wiederherstellung mit Schutz fremder Änderungen. Kein
blindes mirror --delete als allgemeine Rücknahme.

Persönliche MFA und fachliche Abnahme bleiben bewusst menschliche Schritte; eine
Deploymentfreigabe ist weder deren Ersatz noch eine fachliche Gesamtfreigabe.
