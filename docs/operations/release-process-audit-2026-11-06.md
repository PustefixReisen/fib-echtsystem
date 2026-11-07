# FIB – Bereitstellungsprozess: Bestandsprüfung und risikogerechter Zielablauf

**Stand 07.11.2026 · Issue #398 · Fachlich abgestimmtes Zielkonzept und technischer Bestandsabgleich; keine operative Freigabe.**

## Geltung und Abgrenzung

Dies ist der erste, rein dokumentierende Arbeitsschritt des allgemeinen Entwicklungs-, Test-, Produktions- und Bereitstellungskonzepts. **Issue #375 ist nicht dieses Paket:** Es betrifft ausschließlich die spätere Bereinigung einmaliger RIS-Schalter **nach der RIS-Nutzerabnahme**. Die Abnahme am 08.11.2026 wird nicht vorgezogen oder ersetzt.

Der [konkrete RIS-Shared-Apps-Releaseplan](u4-shared-apps-release-plan.md) und die [FIB-Release-Sicherung](fib-release-backup.md) bleiben für betroffene Releases maßgeblich. Dieser Überblick deaktiviert kein Gate und erlaubt keine Veränderung an Shared-Apps, Auth, Memorix, Secrets, Storage oder produktivem Frontend.

## Zielbild: drei fachlich getrennte Umgebungen (Konzeptentwurf, noch keine Architekturfreigabe)

Die Umgebungsgrenzen werden **logisch und bezüglich ihrer Daten-/Schreibrechte** festgelegt. Es sind nicht automatisch drei dauerhaft kostenpflichtige Cloud-Installationen nötig. Ziel ist ein reproduzierbarer Entwicklungs- und Testprozess mit klar getrennter späterer Produktion.

| Umgebung | Ziel / mögliche Umsetzung | Sicherheits- und Kostenprinzip | Offene Entscheidung |
|---|---|---|---|
| **Entwicklung** | Lokaler Rechner + GitHub-Branch/PR; lokal oder kurzlebig isoliertes PostgreSQL/Supabase für FIB-Migrationen; synthetische Daten | Kein Entwicklungszugriff auf Produktivdaten erforderlich; minimale laufende Cloud-Kosten | Für welche Integrationsfälle genügt PGLite/PG17, wann wird der volle Supabase-Stack gebraucht? |
| **Test und fachliche Abnahme** | GitHub Actions mit isolierten FIB-Schema-/RLS-Tests, UI- und Edge-Contract-Tests; bei Bedarf zeitlich begrenzte integrierte Testumgebung/Frontend-Preview | Testdaten unabhängig von echten produktiven Datensätzen; gezielter Testabruf statt dauerhafter zweiter Instanz, wenn möglich | Benötigen Auth/MFA, echte Edge-Läufe oder Browser-E2E eine dauerhaft getrennte Supabase-Testinstanz? |
| **Produktion** | Bewertetes Ziel aus vorhandenen IONOS-, Shared-Apps-`fib`-, Storage- und Auth-Komponenten; abgesicherte Benutzer-/Release-Zugriffe | Verfügbarkeit, Isolation und Datenschutz vor Kostenvorteil; Memorix und gemeinsamer Auth-Bestand geschützt | Reicht Schema-/RLS-Trennung in Shared-Apps langfristig aus oder sind getrennte Projektgrenzen fachlich/operativ notwendig? |

### Zu klärende Rahmenbedingungen

- **Heute ≠ Ziel:** Die bestehende Shared-Apps-Redaktion ist bisher Entwicklungs-/Abnahmebetrieb. Daraus folgt **nicht**, dass Entwicklungsdaten schon belastbar von einer künftigen produktiven FIB-Installation getrennt sind.
- **Testdaten:** Möglichst synthetische oder gezielt freigegebene Daten, deterministische Testfälle und nachvollziehbarer Reset. Produktivkopien nur mit eigener Zweck-/Datenschutzprüfung und Schutzmaßnahmen.
- **Migrationen:** Lokal/isoliert erproben, bei Testlauf gegen den vorgesehenen Ausgangsstand verifizieren, erst danach risikogerecht für die Zielumgebung freigeben.
- **Integrationsprüfung:** Browser, Session/MFA, Rollen/RLS, Edge Functions, Storage und echte Rechte werden in der notwendigen Kombination nachgewiesen. Reine Unit-Tests ersetzen dies nicht.
- **Kostenvergleich:** Laufende Hostingkosten, Verwaltungsaufwand, Sicherheitsrisiko und Aufwand bei Fehlersuche gemeinsam betrachten. Neue Cloud-Projekte nur bei konkret belegtem Bedarf.
- **Übergang:** Entwicklung und CI → integrationsnahe Tests → fachliche Abnahme → freigegebener Deploy mit dokumentiertem Zielcommit → Live-Smoke/Überwachung → Rücknahmeplan.
- **Entscheidungsbedarf:** Vor der Implementierung dieses Zielbild mit bestehender `docs/Zielarchitektur.md`, `docs/Betrieb-und-Wiederherstellung.md`, ADR-011, Datenschutz-/RLS-Vorgaben und operativer Roadmap abgleichen. Kein stillschweigender Architekturwechsel.

## Beschlossenes fachliches Zielbild und ökonomische Leitplanke (07.11.2026)

**Konzeptstatus:** Fachliches Zielbild und die Priorität **0 EUR zusätzliche laufende Infrastrukturkosten** sind vom Auftraggeber bestätigt. Der Umsetzungs- und Sicherheitsnachweis je Workflow steht aus. Dieses Dokument ist *keine* technische Betriebsfreigabe. Die aus der verbindlichen G5/G7-Architektur stammenden Anforderungen an Sicherheit, Verfügbarkeit und Wiederherstellbarkeit gelten fort.

### Grundprinzipien

1. **0 EUR zusätzlich pro Monat als verbindliches Planungsziel:** Bestehende IONOS-, Nextcloud-, Shared-Apps-, GitHub- und lokale Ressourcen nutzen. Bereits bestehende Grundkosten sowie verbrauchsabhängige KI-/Entwicklungsagent-Kosten sind *nicht* null. Neue laufende Gebühren, Mehrverbrauch über Gratislimits oder kostenpflichtige Projekte sind nur nach ausdrücklicher Genehmigung zulässig. Deshalb vor Aktivierung Kontingente und Ist-Rechnung prüfen, Warnungen/Stopps für Zusatzverbrauch vorsehen, soweit technisch möglich. Sicherheitsanforderungen nicht aus Kostengründen absenken; falls die Nullkostenvariante sie nicht erfüllt, vor Produktivstart mit benannter Alternative und Kostenfolge entscheiden.
2. **Drei logisch und in ihren Daten getrennte Umgebungen; nicht drei ständige Cloud-Installationen.** Entwicklungs- und Testdaten sind zurücksetzbar und nicht gleichzeitig produktive Echtdaten. Keine unkontrollierten schreibenden CI-/Testzugriffe auf Shared-Apps.
3. **Ein gemeinsamer fachlicher Code- und Migrationsstand:** Git-Branch und Commit, reproduzierbarer Build, versionierte Konfiguration ohne Geheimnisse und kontrollierte Datenmigration. Umgebungsbesonderheiten werden konfiguriert.
4. **Wiederverwenden vor Neubauen:** GitHub Actions, PostgreSQL-17-Tests, bisherige Supabase-/FIB-Skripte, die verschlüsselte Backupkette und IONOS verwenden; keine neue CI-Plattform, kein dauernder Worker und keine zweite Backuparchitektur.
5. **Schutz proportional zum Änderungsrisiko:** Keine vollständige DB-Restoresimulation für reine Text- oder UI-Korrekturen. DB-/RLS-/Auth-Eingriffe dagegen nur mit isoliertem Test, risikogerechter Sicherung, Freigabe und Rücknahmeplanung.
6. **Agenten statt Betreiber-Kleinschritte:** Entwicklungsagent führt technische Tests, Fehlerbehebung und Nachweisprüfung im zusammenhängenden Auftrag aus; Nutzer prüft sichtbare Fachfunktionen und genehmigt substanzielle Architektur-/Datenrisiken. Keine autonome Änderung der geschützten Produktivumgebung nur aufgrund dieser Konzeptfreigabe.

### Sicherheit: erforderlicher Mindestumfang

- **K0 öffentliche Inhalte:** Nur ausdrücklich freigegebene Stände ausliefern; keine redaktionellen Daten, Tokens oder Secrets in HTML, Build oder öffentlichem Cache.
- **Redaktionszugang K1/K2:** Sichere Anmeldung, rollen- und aktionsbezogene Fachservice-Autorisierung und RLS; MFA entsprechend bestehendem G6-Konzept; Audit für bestätigende und privilegierte Aktionen. Bestehende Schutzklassen gelten unverändert; **K3 nicht an externe KI**.
- **Shared-Apps-Grenze:** Keine pauschalen `db push`/Restore-/Schema-Drops in einer gemeinsamen Projektinstanz; Migrationen auf FIB-Scope begrenzen und übrige Anwendungen/Auth/Secrets unverändert lassen. Geteilte Ressourcen, Auth und administrative Projektbefugnisse sind zusätzliche Restrisiken und vor Echtbetrieb zu bewerten.
- **Datenintegrität:** Vor risikobehafteten Eingriffen aktuelle und geprüfte FIB-Sicherung, Restorefähigkeit nach bestehendem G7-Konzept, dokumentierte Daten-/Dateikonsistenz, keine unbeabsichtigte Überschreibung fachlich bestätigter Objekte.
- **Transport/Softwarelieferkette:** Hostidentität für SFTP unabhängig prüfen; Secrets nur in vorgesehenen Umgebungen; geprüfte Abhängigkeiten/CI, Build-Artefaktidentität und überprüfbare Release-Kennung.
- **Verfügbarkeit:** Für Redaktion gelten vorläufig die vorhandenen G7-Zielwerte RPO höchstens 24 h und RTO ein Arbeitstag. Öffentliche statische Seite soll letzten gültigen Stand weiter ausliefern. Mindestens eine funktionierende Betriebswarnung für fehlende Backups oder kritische Fehler.
- **Datenschutz:** Keine unkontrollierten Produktivkopien in Vorschau/Test/Logs/Artefakte, angemessene Lösch-/Aufbewahrungsfristen aus G4/G7.

Diese Anforderungen sind **Mindestbedingungen**, keine Aufforderung zu Enterprise-Infrastruktur. Ein öffentlich erreichbarer Echtbetrieb erfordert außerdem einen belegten End-to-End-Restore-/Notfalltest und die vorhandenen Go-live-Gates.

### Umgebungen konkret

| Dimension | Entwicklung | Test / Abnahme | Produktion (Zielbetrieb) |
|---|---|---|---|
| Ausführung | GitHub-Featurebranch; lokal oder abgeschottete Agenten-/CI-Workspace | CI für Einheiten und Integration; bedarfsweise separat bereitgestellte Preview und authentifizierter Testlauf | Versionierter und freigegebener Release auf IONOS + evaluiertem Supabase/Storage |
| Daten | Synthetisch, frei zurücksetzbar | Synthetisch; feste Regressionen; keine freie Schreibverbindung zu Echtdaten | Reale redaktionelle und Benutzer-/Betriebsdaten; keine automatischen Test-Resets |
| Datenbank | Isolierter PG17; bei Supabase-spezifischen Tests zeitweilig lokaler vollständiger Supabase-Stack | Isoliertes Schema/DB/Container, mit passenden FIB-Rollen und RLS; Auth/Edge/Storage integriert prüfen, wo relevant | Shared-Apps-`fib` nur solange dies ausdrücklich als Pilot/Entwicklungsbetrieb freigegeben ist; finale Produktionsentscheidung gesondert |
| Zugang | Entwicklungskonten ohne privilegierte produktive Credentials | Zweckgebundene Testidentitäten, möglichst kurzlebige Secrets; keine echten Fremdanwendungsdaten | Freigegebene Admin-/Redaktionskonten mit MFA, Audit, geringstmöglichen Rechten |
| Freigabe | Review/CI | Technische Tests und erforderliche fachliche Abnahme | Explizite Freigabe bei fachlich/operativ riskanten Änderungen |
| Kosten | lokal/bestehende GitHub-Kontingente | primär kurzlebig/lokal/CI | bereits bestehende Dienste, zusätzlicher Bedarf vorab genehmigt |

**Shared-Apps-Entscheidung:** Aktuell weiter als Entwicklungs-/Pilotplattform nutzen, kein voreiliger Umzug. **Vor Verarbeitung regulärer produktiver Echtdaten** anhand Schutzbedarf, geteilter Auth-/Administrationsgrenzen, Wiederherstellbarkeit, Ausfallfolgen, Kontingenten und Betriebskosten ausdrücklich entscheiden, ob eigenes Supabase-Projekt notwendig ist. Der langfristige organisationskontrollierte Zielbetrieb aus `docs/Zielarchitektur.md` (§13) wird nicht stillschweigend aufgehoben. Keine Behauptung, dass Shared-Apps aufgrund separatem Schema allein vollständige Isolation bietet.

### Regelmäßiger Arbeitsablauf und geringe Benutzerbelastung

1. Fachlicher Auftrag/Issue und klare Abnahmekriterien.
2. Entwickler/Agent arbeitet auf separatem Branch, stellt PR bereit und prüft eigenständig Tests/Build/Änderungsumfang.
3. CI läuft automatisch, bei Fehlern erfolgt Korrektur ohne wiederkehrende Einzelfreigaben.
4. Bei Bedarf Integrationstest mit isolierten Testdaten, Browser/Session/RLS/Edge und geschützter Preview.
5. Fachliche Abnahme **nur bei** materieller Änderung oder ausdrücklich vereinbartem Prüffall.
6. Releaseklasse und Zielcommit dokumentieren. Nach Freigabe automatisierte Bereitstellung aus geprüftem Stand mit notwendiger Sicherung und Rücknahmemöglichkeit.
7. Gezielter Live-Smoke und Abschlussbericht (tatsächlicher Zielstand, Ergebnisse, Abweichungen); keine Erfolgsmeldung allein wegen PR-Merge.

**Für Nutzer normalerweise:** Auftrag formulieren, ggf. Fachfunktion ansehen, wesentliche Release-/Architekturentscheidung freigeben, Ergebnisbericht lesen. Kein manuelles Bedienen von Backups/Secrets/SQL als regelmäßiger Sollprozess. Für seltene Sicherheits-/Kontowechsel können bewusste Admin-Handlungen nötig bleiben.

### Umsetzung in der operativen Roadmap (Planung vom 07.11.2026)

Die folgenden Zeitfenster sind **Planungsziele**, keine festen Zusagen oder bereits ausgeführten Arbeiten. Wegen der RIS-Fachabnahme am **08.11.2026** laufen ausschließlich unabhängige Arbeiten parallel.

| Paket | Geplantes Zeitfenster | Phasen | Ergebnis / Abnahme |
|---|---|---|---|
| **B0 – Konzept und Roadmap** | 07.–08.11.2026 | U1/U5/U6 | Diese fachlichen Grundsätze, Risikoklassen, 0-EUR-Vorgabe, Umgebungsgrenzen und Prüfmaßstäbe sind konsolidiert; technische Änderungen noch nicht freigegeben. |
| **B1 – Sicherheits-/Ablaufkonsolidierung** | 09.–15.11.2026 | U1/U5 | GitHub-Workflow-Bestand gegen Zielbild, Host-Key-Checks (auch Preview/Full), feste CLI-Versionen/Funktions-JWT-Konfiguration, eindeutige Workflow-Auswahl, sparsame Release-Evidenz; alles ohne Produktivänderung CI-geprüft. |
| **B2 – Test-/Integrationsweg** | 16.–22.11.2026 | U1/U6 | Reproduzierbarer PG17-/Supabase-Testweg, synthetische Testdaten, RLS/Migrations-/Edge-/Browser-E2E für wesentliche FIB-Fälle; Kosten-/Kontingentscheck; CI-Nachweise. |
| **B3 – Bereitstellung und Rücknahme erproben** | 23.–29.11.2026 | U5/U6 | Risikoklassen A–E praktisch in isolierten/geeigneten Umgebungen belegt, Sicherung/Rücknahme und Smoke-Checks nachgewiesen; ggf. freigegebener einfacher Frontend-Release; keine ungenehmigten Shared-Apps-Eingriffe. |
| **B4 – Produktionsentscheidung vorbereiten** | vor nächstem Echtbetriebs-/Go-live-Gate; Planungsziel bis 06.12.2026 | U5/U6 | Shared-Apps vs. eigenes FIB-Projekt inklusive Trennung, Restore, Auth, Kosten, Kapazität und Migration vergleichen; Betreiberentscheidung vor echten Produktionsdaten. |

**Abhängigkeiten:** B1 kann parallel zur RIS-Fachabnahme vorbereitet werden; #375 erst nach dokumentierter RIS-Abnahme. B2/B3 erfordern jeweils funktionierende isolierte Tests und freigegebene risikoreiche Eingriffe. B4 ist keine Vorbedingung für weitere lokale Entwicklung, wohl aber für den verbindlichen Produktivbetrieb. Terminverschiebungen werden anhand tatsächlicher CI-/Abnahmeergebnisse nachvollzogen.

### Wirtschaftlichkeits-/Qualitätsgates

- Vor Aktivierung eines zusätzlichen Dienstes: **monatl. Zusatzkosten = 0 EUR?** Falls nein, Funktionsnotwendigkeit, kostenlose Alternative und ausdrückliche Entscheidung dokumentieren. Die Gesamtkosten sind nicht null (bestehende Verträge und KI-/Agentencredits).
- Neue dauerhafte Test- oder Produktionsinstallation nicht ohne Beleg ihres Mehrwerts gegenüber isolierten temporären Tests oder bisherigem Pilotbetrieb.
- **Kriterium für B1:** Frontend-only sicher und eindeutig auslösbar, kein Remote-Delete; Full/Preview Hostidentität geprüft, Edge-JWT-/Versionszustand geschützt; vorhandene Gates nicht ohne Freigabe entfernt.
- **Kriterium für B2:** Isolierte Migration/RLS/Backend-Tests wiederholbar, mindestens ein End-to-End-Test für tatsächlichen FIB-Zugriff mit Testidentität; dokumentierter Daten-/Zugriffsabschluss.
- **Kriterium für B3:** Release lässt sich mit unverändertem Commit nachweisen, Restore-/Rücknahmeschritt wurde risikogerecht real geprüft, Live-Smoke und Fehlerpfad dokumentiert.
- **Kriterium für B4:** Vor Echtdatenbetrieb ein eigenständiger signierter/akzeptierter Architektur- und Kostenentscheid, belastbarer Restore-/Datenschutzabgleich; keine unbelegte 0-EUR-Betriebsgarantie.

## Nachgewiesene bestehende Pfade (Repository, nicht Live-Nachweis)

| Pfad | Existierender Workflow | Nach Repo-Stand erkennbare Wirkung / Grenze |
|---|---|---|
| Isolierte Core-/Frontend-/SQL-Tests | `core-services-ci.yml`, `editorial-web-ci.yml`, `u4-postgres-integration.yml`, RIS-/Topic-/Source-CI | Prüfung ohne produktives Deployment; unterschiedliche Testtiefe je Feature |
| Frontend-Preview | `editorial-web-preview.yml` | Baut Branch in `/redaktion-preview/`; keine Änderung von `/redaktion/`, aber separates IONOS Preview-Environment und Schreibzugang benötigt |
| Frontend-only | `editorial-web-frontend-only.yml` | nur Dispatch auf `main` mit `FRONTEND`, Environment `fib-release`; statische Dateien ohne Remote-Delete; explizit keine DB-/Edge-Änderung; SFTP-Hostfingerprint geprüft |
| Vollständiger Frontend-Release | `editorial-web-deploy.yml` | Dispatch mit `DEPLOY`, geprüftem privatem Release-Backup, Manifest/Commit und `FIB_BACKUP_READY`; Remote-Delete, strenger Ablauf für Pilot/Produktion |
| FIB-Edge-Funktionen | `fib-edge-functions-deploy.yml` | Dispatch mit `DEPLOY`, Environment `fib-shared-apps`; deployt derzeit eine explizite Liste von vier Funktionen; keine allgemeine automatische Vollständigkeitsprüfung |
| DB-/RIS-Änderungen | Isolierte SQL-/PG-Tests, explizite Ablaufpläne und bestehende Sicherungsskripte | Kein allgemeiner als sicher belegter Automatikpfad für Shared-Apps-Migrationen; explizite Bestands-/Freigabeprüfung vor Anwendung |

**Wichtige Abweichungen / Verbesserungsbedarf:**
1. Zwei Frontend-Workflows mit unterschiedlichen Gate-Anforderungen: korrekt für unterschiedliche Risikoklassen, aber Benutzer brauchen eine klare Entscheidungshilfe. `editorial-web-deploy.yml` verwendet `mirror --delete`, `editorial-web-frontend-only.yml` tut dies nicht.
2. Der vollständige Frontend-Workflow benutzt `set sftp:auto-confirm yes`; der Frontend-only-Pfad prüft dagegen einen festgelegten Host-Key-Fingerprint. Vor Änderung des strengeren Release-Pfades ist zu klären, ob die Hostidentität dort ausreichend unabhängig verifiziert wird. **Keine automatische Freigabe für Änderungen.**
3. `editorial-web-preview.yml` benutzt ebenfalls `sftp:auto-confirm yes`; ein Preview-Verzeichnis ist keine Rechtfertigung für ungeprüfte Hostauthentizität. Vor produktiver Verwendung/Änderung unabhängig prüfen.
4. `fib-edge-functions-deploy.yml` verwendet `supabase/setup-cli@v1` mit `version: latest` und `--no-verify-jwt` für die explizite Liste. Funktionsspezifische Gateway/JWT-Einstellungen und Versionen vor jedem Release abgleichen; Konfiguration nicht blind vereinheitlichen.
5. Kein vorhandener automatischer End-to-End-Rollback darf aus vorhandenen Backup-/Restore-Skripten unterstellt werden. Schema-Rücknahme braucht wegen Datenverlust-/Shared-Apps-Risiken einen gesonderten geprüften Plan.
6. CI-Erfolg belegt technische Prüfungen, nicht Veröffentlichung, Live-Funktion oder fachliche Abnahme.

## Vorgeschlagene Standardentscheidung vor einem Release

**A – Dokumentation/CI-only:** PR, Review und CI; keine Betriebsänderung, keine produktive Sicherung erforderlich.

**B – Statisches Frontend-only:** Sicherstellen, dass Migration, Edge/API und Konfiguration bereits kompatibel bereitstehen. Review/CI, unabhängige SFTP-Hostprüfung, bestehender nichtlöschender Frontend-only-Workflow, kurzes Live-Smoke nach kontrolliertem Dispatch. Bei Fehlfunktion geprüften vorherigen Frontendstand zurückspielen; vorhandenes Sicherungsverfahren nicht überspringen, wenn der Stand noch nicht reproduzierbar ist.

**C – FIB-Edge-Funktionen:** Geänderte Funktionen und unveränderte Gateway-/JWT-Einstellungen dokumentieren; bestehende Versionen und Shared-Imports vorab erfassen, isolierte Tests, Auth-/RLS-Grenzen und fachliche Freigabe kontrollieren. Nach kontrolliertem Deploy gezielte authenticated Smoke-Tests; bei Fehler geordnet auf gesicherte Vorversion zurück.

**D – FIB-Schema/Daten:** Migrationen isoliert (PostgreSQL und relevante FIB-Rollen) testen, betroffene Tabellen und Auswirkungen auf Memorix/Auth ausschließen, vorab aktuellen FIB-Snapshot mit Integritätsprüfung nach bestehender Routine erstellen und einen Rücknahmeplan prüfen. Nach kontrollierter Migration gezielte Leserechte/RLS/Smoke-Tests. Keine automatische destruktive Down-Migration.

**E – Gemeinsame Supabase-/Auth-/Secrets-Eingriffe:** Nicht als gewöhnlicher FIB-Release ausführen; eigener gesondert genehmigter und gemeinsam risikoabgestimmter Eingriff.

**Bei Kombinationen gilt die strengere Klasse**, soweit sie den gefährdeten Teil schützt. Ein Frontend-Deploy nach Schemaänderung ist kein Frontend-only-Release.

## Standardnachweis eines abgeschlossenen Arbeitspakets

- Issue/PR, Zielcommit, Risikoklasse, verantwortliche Freigabe und CI-Status.
- Betroffene Objekte/Services und überprüfte Abhängigkeiten.
- Sicherungsnachweis und verifizierter Rücknahmeweg entsprechend der Risikoklasse.
- Tatsächlicher Workflow-Run/Deploymentversion, Zeitpunkt, Zielumgebung.
- Ergebnis gezielter Live-Smoke-Tests und fachliche Abnahme; fehlende Nachweise explizit offen.

## Nächste Umsetzungsschritte (nicht durch diese Datei erledigt)

1. Widersprüche der Hostidentitätsprüfung im vollen Frontend- und Preview-Workflow beseitigen – vorher technischen Test und Freigabegates abstimmen.
2. Live-/isolierte E2E-Prüfungen und eine gemeinsame lesbare Release-Evidenz normieren, ohne vorhandene Sicherung neu zu bauen.
3. Edge-CLI-Versionen und Gateway-Flags pro Funktion prüfen und sichere deterministische Bereitstellung entwickeln.
4. Workflow-Auswahl für Entwickler/Redaktion so vereinfachen, dass sie nach Risikoklasse eindeutig ist.
5. **#375 erst nach tatsächlich abgeschlossener RIS-Nutzerabnahme** bearbeiten.

**Abnahmegrenze:** Dieses Dokument ist eine Bestandsaufnahme und Zielskizze, kein bereits technisch validierter neuer Bereitstellungsprozess.
