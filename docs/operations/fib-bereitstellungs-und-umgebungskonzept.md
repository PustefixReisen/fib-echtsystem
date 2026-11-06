# FIB – Bereitstellungs-, Umgebungs- und Betriebskonzept

| Version | Stand | Status | Verantwortung |
|---|---|---|---|
| 0.1 | 06.11.2026 | Konsolidierter Konzeptentwurf zur fachlichen Prüfung; keine technische Betriebsfreigabe | Auftraggeber, mit KI-Unterstützung |

## 1. Zweck und Dokumentenhierarchie

Dieses Konzept beschreibt **wie** FIB entwickelt, getestet, bereitgestellt und betrieben wird. Es konsolidiert vorhandene Entscheidungen; es ersetzt **nicht** die detaillierten Sicherheits-, Backup-, Migrations- und Go-live-Anleitungen.

Führende bestehende Quellen:
- `docs/Roadmap.md` (U5, U6 und aktueller Phasenstand);
- `docs/Zielarchitektur.md` und `docs/decisions/ADR-008-CI-CD-und-Deployment.md`;
- `docs/Betrieb-und-Wiederherstellung.md` (RPO/RTO, Sicherung, Monitoring);
- `docs/Go-live-Abnahmekriterien.md` (verbindliche Produktiv-Gates);
- `docs/operations/u4-shared-apps-release-plan.md` (konkreter RIS-Release, bestehende Entwicklungs-Ausnahme);
- `docs/operations/fib-release-backup.md` (privates Release-Bundle, Restore-Grenzen);
- `.github/workflows/editorial-web-deploy.yml` und `.github/workflows/frontend-backup.yml`.

Bei Widerspruch gilt die spezifischere bereits freigegebene Schutz- und Betriebsregel. Fachliche Regeln bleiben in den jeweiligen Fachhandbuchkapiteln. Dieses Dokument führt keine stillschweigende Freigabe bisher gesperrter Betriebsänderungen herbei.

## 2. Festlegungen und Ist-Zustand

1. **Shared-Apps ist die vorgesehene Supabase-Plattform**; FIB verwendet das isolierte Datenbankschema `fib`. Memorix, `public`, gemeinsame `auth`-Konfiguration, projektweite Secrets und gemeinsame Ressourcen dürfen nicht ohne gesonderte Freigabe geändert werden.
2. Die Redaktionsoberfläche unter `https://fib.pustivo.de/redaktion/` ist **derzeit Entwicklungsbetrieb**. Sie ist nicht gleichbedeutend mit einem fachlich abgenommenen Pilot- oder Produktivbetrieb. Die Ausnahmeregel zur risikogerechten Entwicklungsbereitstellung aus dem U4-Release-Plan bleibt gültig.
3. GitHub ist Versions- und Prüfquelle. IONOS liefert die statische Redaktionsoberfläche aus. Die spätere öffentliche PWA soll gemäß Zielarchitektur einen freigegebenen statischen K0-Stand unabhängig vom laufenden Supabase-/KI-Betrieb liefern.
4. Vorhandene Supabase-, IONOS-, GitHub-, Nextcloud-/rclone-crypt- und lokale Back-in-Time-Komponenten werden bevorzugt weitergenutzt. Kein neues kostenpflichtiges Projekt und kein neuer Hostingdienst allein für dieses Konzept.
5. **Logical isolation ist keine physische Isolation.** Schema-, RLS-, Rollen- und Anwendungsgrenzen werden technisch geprüft; projektweite Ausfälle, Kontingente, Auth-Konfiguration und privilegierte Zugänge bleiben gemeinsame Risiken.
6. Ein späterer Wechsel von FIB in ein eigenes Supabase-Projekt muss durch versionierte Migrationen, explizite Konfigurationsschnittstellen, dokumentierte Storage-/Auth-Abhängigkeiten und getesteten Restore möglich bleiben. Er wird nicht vorweggenommen.

## 3. Umgebungsmodell

| Ebene | Zweck und Daten | Infrastrukturvorgabe | Freigabe |
|---|---|---|---|
| Lokal / isolierte CI | Entwicklung, Unit-, Integration-, RLS-, Migrations- und Regressionstests; ausschließlich synthetische/anonymisierte Daten | lokale isolierte PostgreSQL/Supabase-Testinstanz, temporäre CI-Dienste; keine Schreibverbindung zu Shared-Apps | technische Tests, kein Fach-Go-live |
| Gemeinsame Entwicklung | End-to-End-Integration und sichtbare UI-Erprobung mit markierten Testdaten | bestehende Shared-Apps-`fib`-Umgebung und IONOS-`/redaktion/`; klare Testdatensätze und begrenzte Rechte | vereinfachtes, risikogerechtes Entwicklungsgate nach bestehender Ausnahme |
| Pilotbetrieb | fachliche Realitätsprüfung mit kontrollierten Echtdaten und benannten Redakteuren | vor Start bewertete Isolation; vorzugsweise vorhandene Plattform, aber **keine unkontrollierte Vermischung** von Test- und Pilotdaten | Pilotfreigabe, Berechtigungs-, Backup- und Rücknahmetest |
| Produktion | verlässlicher Redaktionsbetrieb und öffentliche Veröffentlichung | Shared-Apps grundsätzlich zulässig, wenn Isolation, Sicherungen, Performance und Abnahme nachgewiesen sind; öffentliche Auslieferung getrennt | formale Produktivfreigabe nach G10 |

**Wichtige offene Umsetzungsvoraussetzung:** Entwicklungs- und Pilot-/Produktivdaten dürfen nicht allein durch einen UI-Schalter getrennt werden. Bevor Pilot- oder Echtdaten verwendet werden, ist ein nachgewiesenes Daten-/Rechte-/Prozess-Trennkonzept mit begrenztem Störungsradius umzusetzen. Ob dies innerhalb eines bestehenden Projekts mit getrennter Datenhaltung ausreichend möglich ist oder eine temporäre separate Testinstanz erforderlich wird, entscheidet ein technischer Isolationstest. Die Entscheidung für Shared-Apps als Produktionsplattform bleibt davon unberührt.

Es werden **nicht pauschal drei permanent laufende Supabase-Projekte** gefordert. Testisolierung hat Vorrang vor möglichst geringer Projektzahl; Kosten werden erst anhand eines konkreten Bedarfs ausgelöst.

## 4. Gemeinsamer Entwicklungs- und Freigabeablauf

```text
Roadmap / Issue / Fachregel
   -> Änderung auf Branch / Pull Request
   -> automatisierte Prüfungen
   -> Review der fachlichen und technischen Risiken
   -> Merge nach main (Nachweis des konkreten Commits)
   -> Bereitstellungsentscheidung nach Betriebsphase und Risiko
   -> Sicherung / Vorprüfung / kontrolliertes Deployment
   -> Smoke-Test + ggf. fachliche Nutzerabnahme
   -> Nachweis oder Rücknahme / Folge-Issue
```

### 4.1 Änderungsklassen

| Klasse | Beispiele | Mindestvorgehen |
|---|---|---|
| K1 – rein dokumentarisch / lokal | Dokumentation, Tests ohne Laufzeitänderung | PR, Review, passende CI; kein Produktions-Deployment |
| K2 – geringes Laufzeitrisiko | isolierte UI-Korrektur ohne Daten-/Rechteänderung | CI, Wirkungskontrolle, gezielter Hosted-Smoke-Test; im Entwicklungsbetrieb vereinfachte Freigabe |
| K3 – erhöhtes Risiko | Edge Function, FIB-Schema-Migration, Storage/Originale, Berechtigungen, Quellenaktivierung | exakter Scope, geprüfter Ist-Zustand, aktuelle anwendungsspezifische Sicherung, technische Rücknahme-/Vorwärtsreparaturstrategie, Integrationstest und dokumentierte Freigabe |
| K4 – kritisch / projektübergreifend | gemeinsame Auth-/Secrets-/DSN-Änderungen, Löschung, Veröffentlichung von Echtdaten, globale Policies, Wechsel der Infrastruktur | eigene explizite Freigabe, Prüfung der Memorix-Auswirkung, vollständige Wiederherstellungs-/Notfallvorsorge; nicht im Rahmen gewöhnlicher FIB-Deployments |

Die Klasse wird nach **tatsächlichem Änderungsrisiko**, nicht nach Größe des Pull Requests, festgelegt. Im Pilot-/Produktivbetrieb gelten die strengeren Anforderungen aus den vorhandenen Release- und Go-live-Dokumenten unabhängig von dieser vereinfachten Übersicht. Ein CI-Erfolg ersetzt keine fachliche Abnahme.

### 4.2 Pflichtprüfungen vor Merge/Deployment

- Relevante Typecheck-, Lint-, Unit-, Integrations-, Migrations-, RLS-, E2E- und Regressionstests je geändertem Bereich.
- Bei Datenbankänderungen: Isolation zum Schema `fib`, explizite Rollen/Grants, RLS und Konkurrenz-/Wiederanlaufszenarien prüfen. Keine pauschale Reinitialisierung von Shared-Apps oder der gemeinsamen Migrationshistorie.
- Bei Frontend-Änderungen: Build, Navigation und wichtige Schreib-/Lesepfade im Browser; keine K1/K2-Daten oder Secrets im öffentlichen Bundle.
- Bei Quellen-/KI-Änderungen: idempotente Erfassung, Herkunft, Dubletten, Kosten-/Fehlergrenzen, keine automatische fachliche Freigabe.
- Prüfnachweise, konkreter Commit, Risikoklasse und bekannte Restabweichungen im PR/Releaseprotokoll.

## 5. Bereitstellungsverfahren

1. **Scope erfassen:** konkreter Git-Commit, betroffene Komponenten, Migrationsreihenfolge, erwartete Zustände, Betriebsphase und Risikoklasse dokumentieren.
2. **Ist-Zustand lesen:** aktive FIB-Features, FIB-Tabellen/Versionen, relevante FIB-Edge-Funktionen, IONOS-Frontend, Quellflags und konkurrierende Änderungen vergleichen; bei Drift stoppen.
3. **Sicherung risikoangemessen:** Entwicklung gemäß ausdrücklich genehmigter Ausnahme; für Pilot/Produktion vollständige nachweisbare Bundle-/Restore-Anforderungen aus `fib-release-backup.md` und dem konkreten Release-Plan. Dumps und Credentials nie ins Repo/öffentliche Actions-Artefakte.
4. **Freigabe prüfen:** nachvollziehbare Entscheidung zur exakten Änderung; technische Workflow-Eingaben sind **kein Ersatz** für organisatorische Freigabe.
5. **Reihenfolge:** migrationsbedingte Schreibkonflikte unterbinden, additive DB-Änderungen kontrolliert anwenden, FIB-Backend/Edge aktualisieren, Konfigurations-/Quelländerungen gezielt ausführen, Frontend deployen, Feature schrittweise freischalten. Die konkrete Reihenfolge ist abhängig vom Paket und wird vorab dokumentiert.
6. **Nachkontrolle:** Health, Anmeldung/MFA, Rechte, markierte Kernfunktionen, Versions-/Releasekennung, keine Auswirkungen auf Memorix, Monitoring und Backup-Funktion prüfen; fachliche Prüfung separat protokollieren.
7. **Abschluss:** Releaseprotokoll mit erfolgreichem Zustand oder Blocker/Teilstand, nächsten Maßnahmen und Verknüpfung zu PR/Issue. Bei Fehler Feature deaktivieren/Frontend zurückspielen/Backend zurücknehmen, aber **keine** blinde destruktive DB-Rückmigration.

### Bestehender Workflow und bekannter Prüfbedarf

`.github/workflows/editorial-web-deploy.yml` fordert derzeit `DEPLOY`, Backup-ID, SHA-256, `fib-release`, `FIB_BACKUP_READY` und prüft das private Bundle. Es nutzt für den IONOS-Upload `mirror --reverse --delete`. Deshalb ist ein verifizierter vollständiger Frontend-Vorstand erforderlich. Der separate `frontend-backup.yml` existiert.

**Prüfauftrag vor produktivem Standardbetrieb:** bestehende Hostschlüsselprüfung des tatsächlichen **Deploy**-Workflows und die Atomizität der Veröffentlichung gesondert technisch untersuchen; `sftp:auto-confirm yes` und direktes Spiegeln mit `--delete` sind keine hinreichenden allgemeinen Sicherheits-/Rollbackgarantien. Sollbild: geprüfter Hostschlüssel, Release-Verzeichnis oder sicherer atomarer Wechsel soweit IONOS dies unterstützt, Integritäts-/HTTP-Smoke-Test, eindeutige Vorversion. Keine ungetestete Umstellung am laufenden System.

## 6. Daten, Sicherung und Wiederherstellung

- **DB:** täglicher externer, wiederherstellbarer Sicherungsstand als Betriebsziel; FIB-Schema einschließlich ACL/RLS und Referenzen nachvollziehbar sichern. Backup des Schemas ist **kein** automatisches Backup gemeinsamer Auth-Benutzer und Einstellungen.
- **Dateien:** Original-PDFs, private Buckets, Medien und Zuordnungen zusammen mit zeitlich konsistentem DB-Stand sichern; reine PostgreSQL-Dumps genügen nicht.
- **Anwendungsstand:** vollständige FIB-Edge-Vorversion, statischer IONOS-Vorstand, FIB-Feature- und Quellenzustände ohne Secretwerte sichern.
- **Ablage:** vorhandene verschlüsselte Nextcloud-/rclone-crypt-Kette und zusätzlich lokale versionierte Kopie nutzen. Zugriff, Verschlüsselung, Wiederauffindbarkeit und Rückleseprüfsumme protokollieren.
- **Restore:** regelmäßiger isolierter Restore-Test, besonders vor Produktionsstart; echte Wiederherstellung in Shared-Apps nur nach fachlich eingegrenztem Plan, niemals pauschal `DROP SCHEMA`, `--clean` oder projektweites Zurücksetzen.
- **Ziele:** laut `Betrieb-und-Wiederherstellung.md` zunächst RPO <= 24 Stunden und RTO innerhalb eines Arbeitstags für die Redaktion. Vor Go-live anhand realer Pilotwerte bestätigen.
- **Rollback:** statische Webstände und FIB-Edge-Funktionen gezielt zurücknehmen; bei irreversiblen DB-Migrationen Vorwärtskorrektur und isoliert getesteten Recoveryplan bevorzugen. Keine falsche Zusicherung eines One-Click-Rollbacks.

## 7. Betrieb, Monitoring und Sicherheit

Minimum:
- Öffentliche Site/Releasekennung und Redaktionszugriff prüfen; der letzte freigegebene öffentliche K0-Stand bleibt auch bei Supabase-/KI-Ausfall lesbar.
- Letzten erfolgreichen DB-/Datei-Backup-Lauf, Speicher-/Quota-/Kostenentwicklung, fehlgeschlagene Publikationen, Quellenläufe und KI-Queues/Providerfehler beobachten.
- Warnungen P1/P2 an administrativ betreute Adresse; P3 im Betriebsüberblick; keine zusätzliche komplexe Plattform ohne Bedarf.
- Rechte nach Least Privilege und MFA/AAL2 gemäß bestehender Rollenregel; mindestens zwei organisationskontrollierte Admins vor Produktivstart.
- Secrets ausschließlich in dafür vorgesehenen geschützten Bereichen und Passwortmanager; Rotation ist ein kontrollierter Betriebsprozess, keine automatische regelmäßige Änderung ohne Anlass.
- Datenschutzverzeichnis, AV-/Provider-Prüfung, Schutzklassen, Aufbewahrung/Löschung und externe KI-Verarbeitungen sind Go-live-Gates, keine durch dieses Konzept erledigten Nachweise.
- Incident-Runbook: Schreibzugriffe/Publikation bei kritischen Vorfällen stoppen, Bestand sichern, Ursache und Umfang ermitteln, komponentenweise Recovery, Integritätsprüfung, dokumentierte Wiederfreigabe.

## 8. Pilot- und Produktivüberführung

**Entwicklung -> Pilot:**
1. markierte Testdatenstrategie, Löschung/Archivierung und Migrations-/Echtdatenkonzept;
2. Isolation FIB/Memorix sowie Pilot-/Entwicklungsdaten technisch geprüft;
3. Auth/MFA/RLS, Recovery, Storage-Sicherung, reale CI-/Deploy-Gates und Warnwege wirksam;
4. benannte Pilotverantwortliche, Risikofenster, Pilotabnahme und dokumentierte Mängel.

**Pilot -> Produktion:** alle anwendbaren Kriterien aus `docs/Go-live-Abnahmekriterien.md` prüfen. Insbesondere vollständiger Restore-Test in neues/leeres Ziel, Datenschutz, organisatorische Admin-Übergabe, repräsentative Recherchequalität, S3-Publish/K0-Trennung, UI-/Fachregression und getesteter Rollback. **Kein** Go-live bei ungeprüftem oder nicht bestandenem Pflicht-Gate. Die bisherige RIS-Entwicklungsfreigabe umfasst keine automatische Pilot-/Produktivfreigabe.

## 9. Zuständigkeiten und Nachweis

| Rolle | Verantwortung |
|---|---|
| Auftraggeber / fachliche Verantwortung | Fachregeln, Pilot-/Go-live-Freigabe, Prioritäten und kritische Abweichungen entscheiden |
| Entwicklung (auch KI-gestützt) | zusammenhängendes Paket, Tests, Risikoanalyse, PR, Migrations-/Releaseplan, technische Selbstprüfung und verständlichen Bericht liefern |
| Betreiber / Release-Verantwortung | Zugriffe, Backup-Nachweis, exakte Bereitstellungsfreigabe, Deployment, Monitoring und Wiederherstellbarkeit sicherstellen |
| Redaktion | gezielte fachliche Abnahme der realen Arbeitsabläufe; keine informelle technische Infrastrukturfreigabe |
| zweite Administration vor Go-live | unabhängige Handlungsfähigkeit im Störungs-/Recoveryfall |

Eine Person kann in der Entwicklungsphase mehrere Rollen wahrnehmen, sofern die jeweiligen Nachweise nicht miteinander verwechselt werden. Kritische Produktivmaßnahmen erfordern die bestehenden Schutz- und Freigaberegeln.

## 10. Umsetzungspakete (ohne voreilige technische Aktivierung)

**P1 – verbindliche Dokumentation:** dieses Konzept auf vorhandene Primärquellen abstimmen, Roadmap U5/U6 verknüpfen, Scope und Risikoklassen dokumentieren.

**P2 – Umgebungssicherheit:** tatsächlich aktive GitHub-Environments/Secrets/Branch-Regeln, Supabase-Rollen/RLS/Storage/Edge-Abhängigkeiten und die Trennung synthetischer von Pilotdaten lesend inventarisieren; Testmatrix und Minimallösung festlegen.

**P3 – Release-Prozess härten:** Hostschlüssel-/SFTP-Deployment, atomare Auslieferung/Releasekennung, expliziten Smoke-Test, Releaseprotokoll und sichere Rücknahme technisch umsetzen; bestehende Entwicklungs-Ausnahme erhalten, nicht stillschweigend Produktivgates abschalten.

**P4 – End-to-End-Sicherung:** DB plus Auth-Abhängigkeiten, Bucket-Objekte, Edge, Frontend und Konfiguration vollständig konsistent absichern, tatsächlich isoliert wiederherstellen und Abweichungen dokumentieren.

**P5 – Pilot/Go-live:** fachliche Nutzerabnahme, Datenschutz- und Betriebsprüfungen, Admin-Übergabe, Veröffentlichungsgates und konkrete Freigabe.

Alle Pakete erhalten eigene nachvollziehbare Issues/PRs, soweit noch nicht vorhanden. Zunächst nur dokumentarische Änderungen; **keine** Migration, Geheimnisänderung, Workflow-Ausführung oder Bereitstellung durch Annahme dieses Konzepts.

## 11. Entscheidungen und offene Nachweise

**Bereits entschieden:** Shared-Apps als geplante Produktionsplattform; kein eigenes Supabase-FIB-Projekt jetzt; kostensparende Infrastruktur; klare Umgebungs- und Freigabegrenzen; spätere technische Abtrennbarkeit.

**Technisch noch nachzuweisen:** wirksame Trennung zwischen Entwicklungs-/Pilotdaten; echte Supabase- und GitHub-Berechtigungs-/Secretskonfiguration; Auth-/Storage-Recovery jenseits von Schema-Dumps; deploysichere IONOS-Veröffentlichung; vollständiger Restore und Monitoring im späteren Zielbetrieb; tatsächliche Kosten-/Ressourcen- und Ausfallkopplung mit Memorix.

**Entscheidungszeitpunkte:** vor Pilotstart die konkrete Datentrennung; vor Go-live die überprüften Go-live-Kriterien; nur bei belegten Engpässen, Sicherheits-/Betriebsproblemen oder unverhältnismäßigen Kosten die Frage eines eigenen FIB-Supabase-Projekts erneut öffnen.
