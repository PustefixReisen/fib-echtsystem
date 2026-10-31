# Roadmap – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 5.1 | 31.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Statusmodell

Es gelten die zentralen Status aus `PustefixReisen/pustivo/docs/governance/Dokumentenpflege.md`:

- Geplant
- In Arbeit
- Teilweise umgesetzt
- Blockiert
- Abgeschlossen
- Zurückgestellt
- Entfallen

## 1. Aktueller Stand – Gründungsphase

| Phase | Status | Ergebnis / nächster Schritt |
|---|---|---|
| Projektbasis / Repository | **Abgeschlossen** | separates Repository und initiale Dokumentationsstruktur vorhanden |
| G1 Produktumfang / MVP | **Abgeschlossen** | MVP, Ausbaustufen, Nicht-Ziele und Aufwandstreiber festgelegt |
| G2 UX / Informationsarchitektur / Fachfunktionen | **Abgeschlossen** | öffentliche und redaktionelle Zielbilder fachlich geklärt |
| G2.5 Transfer-Audit Demonstrator → Echtsystem | **Abgeschlossen** | fachliche Regeln, sichtbare Inhaltsbausteine und Redaktionsfunktionen transfergesichert |
| Dokumentationsübernahme Demonstrator → Echtsystem | **Abgeschlossen** | Echtsystem ist Dokumentationshoheit; Transferlücken geschlossen |
| G3 Datenanforderungen / Datenmodell | **Abgeschlossen** | Datenmodell v3.0 und G3-Audit abgeschlossen |
| G4 Schutzbedarf / Datenschutz / Offline | **Abgeschlossen** | K0–K3, Löschlogik, KI-/Provider-Prüfrahmen und Offline/PWA-Grundsätze festgelegt |
| G5 Zielarchitektur / Stack / Hosting / Deployment | **Abgeschlossen** | Zielarchitektur v1.0, ADR-001 bis ADR-009 und G5-Audit abgeschlossen; ADR-011 konkretisiert Shared-Apps-/pustivo-Betrieb |
| G6 Rollen / Rechte / Workflow | **Abgeschlossen** | Rollen-/Rechtematrix, MFA, S0–S3, Fachservice-/RLS-Grenzen festgelegt |
| G7 Betrieb | **Abgeschlossen** | Backup/Restore, Monitoring, RPO/RTO, Retention und KI-Kosten-/Providerbetrieb festgelegt; ADR-011 konkretisiert schema-spezifisches FIB-Backup |
| G8 Governance / Repository / Dokumentation | **Abgeschlossen** | Dokumentationslandkarte, zentrale Governance und Wiederaufnahme-Kriterien konsolidiert |
| G9 Migration | **Abgeschlossen** | Migrationsstrategie und ausführbares Runbook festgelegt; Umzug auf GRÜNEN-Infrastruktur ist optional, nicht zwingend |
| G10 Go-live-Abnahme | **Abgeschlossen** | messbare Abnahmekriterien und harte Go-live-Blocker festgelegt |
| Gründungsaudit | **Abgeschlossen** | G1–G10 übergreifend geprüft; keine blockierende Grundsatzfrage offen |
| Umsetzungs-Vollständigkeitsaudit | **In Arbeit** | erste Gesamtprüfung abgeschlossen; G2.5-Status bereinigt; Koordination/Benutzer in PR #45 fachlich operationalisiert; weitere rote/gelbe Befunde fachbereichsweise schließen |

## Planungsweg für neue Fachfunktionen (verbindlich)

Für neue fachliche Funktionen gilt der Ablauf **Roadmap → Issue → Fachplanung/Fachkonzept → technische Planung und Implementierung → Abnahme**:

1. **Roadmap:** Arbeitspaket, Priorität, Umsetzungsphase und Status festhalten. Die Roadmap allein ist keine fachliche Freigabe.
2. **GitHub-Issue:** Auftrag mit Ziel, offenen Fachfragen, Abhängigkeiten und Abnahmekriterien anlegen. Erste verpflichtende Aufgabe: **bestehendes Fachkonzept prüfen und nötige fachliche Ergänzungen erarbeiten**.
3. **Fachplanung:** Regeln, Begriffe, Bedienabläufe, Datenanforderungen, KI-Kontext, Zuständigkeiten und Auswirkungen auf bestehende Funktionen in den **zuständigen versionierten Primärdokumenten** festlegen; keine konkurrierenden Konzeptkopien. Entscheidungen und verbleibende Fragen im Issue nachvollziehbar machen.
4. **Fachliches Freigabegatter:** Mit dem Issue prüfen und dokumentieren, ob die relevanten fachlichen Fragen geklärt, dokumentiert und für die geplante Ausbaustufe abgenommen sind. Nur dann beginnt die Umsetzung der betreffenden Fachfunktion. Technische Grundlagenarbeit ohne vorweggenommene Fachentscheidung kann unabhängig fortlaufen.
5. **Implementierung und Abnahme:** Datenmodell, Fachservices, KI-Anbindung, UI, Rechte, Tests und Dokumentation umsetzen; PR und Issue verknüpfen, Roadmap-Status anhand nachgewiesenen Fortschritts aktualisieren.

Ein Issue darf mehrere Umsetzungsschritte auslösen. Bei umfangreichen Vorhaben werden nach der Fachplanung getrennte technische Issues erstellt; die fachlichen Primärdokumente bleiben verbindlich.

**Beispiel:** Issue #145 (versionierte WP-Sprachprofile) startet zunächst den Abgleich des Bibliotheks-Merkblatts v2.2 mit `docs/Sprachleitfaden.md` und die Fachplanung. Die Datenbank- und UI-Umsetzung folgt **erst nach fachlicher Klärung**; U1/U2/U4 bleiben dafür die Roadmap-Zuordnung.

## 2. Umsetzungsphasen

| Umsetzungsphase | Status | Ziel / Produkt |
|---|---|---|
| U1 Technischer FIB-Kern | **In Arbeit** | Datenbankschema, Migrationen, gemeinsame Fachservice-Schicht, Auth-/RLS-Grundlage, Datei-/Bildspeicher-Anbindung, KI-Router-Grundlage, gemeinsame Konfiguration und Testbasis |
| U2 Redaktions-App | **In Arbeit** | vertikale Umsetzung begonnen: erster echter UI-Slice `Dashboard → Ereignisdetail → Koordination`; weitere Fachfunktionen werden jeweils zusammen mit ihrem UI-Arbeitsablauf angebunden |
| U3 Öffentliche FIB-Seite / PWA | **Geplant** | Besucheroberfläche mit `Neues | Im Blick | Sitzungen | Suche`, Detailseiten, PWA, Teilen, Transparenz und Neuigkeitsstatus |
| U4 Recherche / AI Tasks / KI-Funktionen | **Teilweise umgesetzt** | Quellenbeobachtung, Quellenentdeckung, Rechercheläufe, Ereigniserkennung, Entwurfserstellung, Routing und Qualitätskontrollen |
| U4 Informationsgewinnung – Untersuchungs-/Machbarkeitsschwerpunkt (#265) | **In Arbeit** | Pflichtquellen-Abdeckung technisch nachweisen, offene Suche mit systematischen Suchstrategien entwickeln, verblindeten Trefferquotentest durchführen und Kosten/Mehrtreffer vergleichen; Auswahl vor produktiver Implementierung |
| U5 Veröffentlichung / Deployment / Betrieb | **Geplant** | S3-Publish-Prozess, statischer Build, Deployment, Monitoring, Backup/Restore und betriebliche Automatisierung |
| U6 Integration / Pilot / Go-live-Vorbereitung | **Geplant** | End-to-End-Tests, Demonstrator-Regressionen, Usability-Feinschliff, Datenmigration, Pilotbetrieb und Vorbereitung der realen Go-live-Abnahme |

### Referenzquellen – Stand 31.10.2026

PRs #346/#347 sind integriert. PR #348 ergänzt die persistente RIS-Fachstruktur,
Scanner-Verarbeitung von Änderungen/Nachveröffentlichungen und die ausdrücklich
bestätigten Übergänge Fundstelle → Ereignis → bestehender Vorgang/Thema.
Mehrere Beschlusspunkte/Fassungen, unbekannte Resultate, Herkunft und unveränderliche
Belege sind Bestandteil des isolierten PostgreSQL-Nachweises mit `fib_runtime`.
Die [technische Abnahme](operations/u4-reference-sources-acceptance.md) bestätigt den
**integrierten Gesamtpfad der definierten Referenzfälle**. U4 bleibt insgesamt teilweise umgesetzt.
Automatisierte Browserabläufe prüfen Übernahme, Ereignisübergabe und Themenbezug;
[Prüfdurchgang und Grenzen](operations/u4-editorial-ui-acceptance.md). Umsetzung und vorbereitete Freigabeschritte stehen
in [U4 RIS-Persistenz](operations/u4-ris-persistence.md).
Der [integrierte Prüfstand zu #352](operations/u4-integrated-acceptance.md) führt
Gesamt-App, tatsächliche Anmeldung/MFA, Deno-Handler und PostgreSQL zusammen.
Sechs erfolgreiche CI-Prüfungen einschließlich des Gesamtpfads und die Grenzen kontrollierter Quellantworten sind gesondert
im Abnahmebericht ausgewiesen.

Die [persönliche Abnahme](operations/u4-persoenliche-nutzerabnahme.md) erfolgt verbindlich
in der bestehenden Redaktion mit Shared-Apps/fib und vorhandenen Konten/MFA.
PR #355 bleibt ein isolierter technischer Prüfstand; seine lokale Standardempfehlung
ist korrigiert. #357 / PR #358 bereiten die Bereitstellung vor:
[Istvergleich](operations/u4-shared-apps-inventory-2026-10-31.md) und
[Freigabe-/Sicherungs-/Rücknahmeplan](operations/u4-shared-apps-release-plan.md).
Noch keine Migration, Bereitstellung oder Aktivierung in Shared-Apps vorgenommen.

Nächste Schritte in #281: genehmigte Bereitstellung in Shared-Apps und fachliche Nutzerabnahme der integrierten Ansichten,
Bewertung der Belegdialoge aus PR #350, vertrauenswürdige
KI-Produzenten, weitergehende RIS-Abdeckung und Identitätswechsel. Vorläufige
Ereignisse (#260) und Langzeitqualität der Gemeinde-Archive bleiben offen.
Produktive Migration/Deployment/Feature-Aktivierung brauchen separate Freigabe;
#336 betrifft weiterhin die davon getrennte RIS-Automatisierung. Keine Änderungen
an produktivem Shared-Apps oder Memorix durch dieses Arbeitspaket.

## 3. U1 – aktueller Stand

### U1.1 Monorepo-/Paketstruktur – umgesetzt

Gemäß ADR-009 angelegt:

- npm-Workspace-Grundlage in `package.json`,
- gemeinsame strikte TypeScript-Basis in `tsconfig.base.json`,
- `apps/public-web`,
- `apps/editorial-web`,
- `packages/domain-contracts`,
- `packages/fachservices`,
- `packages/ai-router`,
- `packages/storage-adapter`,
- `packages/publish`,
- `packages/ui`,
- `supabase/`,
- `tests/`,
- `scripts/`.

### U1.2 Supabase-Schema und Isolation – umgesetzt, Ausbau läuft weiter

Im bestehenden Supabase-Projekt `Shared-Apps` wurden die ersten FIB-Migrationen ausgeführt:

- Schema `fib` angelegt,
- Kernobjekte `app_users`, `events`, `messages`, `processes`, `topics`, Quellen/Fundstellen und zentrale n:m-Beziehungen angelegt,
- RLS auf allen FIB-Kerntabellen aktiviert,
- `anon`, `authenticated` und `service_role` besitzen keinen Schema-/Tabellenzugriff auf `fib`,
- Rollen `fib_runtime` und `fib_app` mit Least Privilege angelegt,
- `fib_app` erbt ausschließlich `fib_runtime`, besitzt kein `BYPASSRLS` und keine Superuser-Rechte,
- RLS-Policies ausschließlich für `fib_runtime` angelegt,
- Default Privileges für künftige FIB-Objekte abgesichert,
- FIB-spezifische Objektprivilegien in `public` ausgeschlossen,
- Beispielprüfung gegen `public.events`: `fib_app` besitzt dort weder SELECT, INSERT, UPDATE noch DELETE; auf `fib.events` bestehen die erwarteten Rechte,
- Supabase Security Advisor meldet nach Policy-Ergänzung keine FIB-spezifische `RLS enabled no policy`-Warnung mehr,
- fehlender Index auf `fib.events.merged_into_event_id` ergänzt.

Der vollständige Login-Test mit echten `fib_app`-Credentials folgt, sobald das Runtime-Secret auf pustivo gesetzt werden kann.

### Legacy-Ausnahme im Schema `public`

`public.fib_ai_daily_usage` ist laut Datenbankkommentar ein Zähler des alten öffentlichen FIB-„Mehr wissen?“-Demonstrators und gehört nicht zum Echtsystem. Die Tabelle bleibt solange unverändert, wie der Demonstrator sie benötigt. Bereinigung/Wiederaufnahme ist in GitHub Issue #5 dokumentiert.

### U1.3 Runtime- und Fachservice-Grundgerüst – begonnen

Umgesetzt:

- `.env.example` als verbindlicher Konfigurationsvertrag ohne echte Secrets,
- `docs/Betrieb-FIB-Runtimezugang.md` für `fib_app`, Secret-Regeln und Live-Isolationstest,
- `@fib/domain-contracts` mit Akteurs-, Rollen-, MFA- und S0–S3-Verträgen,
- `@fib/fachservices` mit zentraler Autorisierungsbasis,
- AI Tasks technisch auf S0/S1 begrenzt,
- S3 verlangt explizite Bestätigung,
- Admin- und MFA-Step-up-Anforderungen sind zentral prüfbar,
- offener manueller pustivo-Schritt separat dokumentiert.

Als nächstes:

1. Datenbankzugriffsadapter im Fachservice anbinden,
2. Auth-Token serverseitig prüfen und gegen `fib.app_users` autorisieren,
3. erste konkrete FIB-Fachfunktion über den gemeinsamen Autorisierungspfad implementieren,
4. automatisierte Tests für die Autorisierungsbasis ergänzen,
5. bei eingerichtetem pustivo-Serverprozess `FIB_DATABASE_URL` sicher setzen und echten Credential-Isolationstest durchführen,
6. Spezialbereiche des Datenmodells modular ergänzen,
7. schema-spezifischen FIB-Dump/Restore-Pfad vorbereiten.

Parallel gilt für Storage gemäß ADR-011:

- Nextcloud auf pustivo als möglicher dauerhafter Storage,
- eigener technischer FIB-Storage-Zugang,
- separater FIB-Backup-Zugang,
- normaler FIB-Anwendungszugang erhält keinen Schreib-/Löschzugriff auf Backup-Dateien,
- DB speichert logische Storage-Referenzen statt fest verdrahteter Nextcloud-URLs.

### U1.4 Koordination/Benutzer – weitgehend umgesetzt, UI-Integration läuft

Auf Basis des fachlichen Vertrags sind SQL-Strukturen und Fachservices für Benutzerprofil, Federführung, Bearbeitungssperren, Übernahmeanfragen und `Letzte Bearbeitung` umgesetzt. Die produktiven Migrationen sind auf Shared-Apps angewendet. Federführung und Bearbeitungssperre wurden mobil gegen die Live-Redaktionsanwendung geprüft; Core-Services-Typecheck und Fachservice-Tests laufen automatisiert in GitHub Actions. Die Federführungsvererbung und `Letzte Bearbeitung` sind an erste konkrete Schreib-Fachfunktionen (`confirmEvent`, `editMessageDraft`, `manageProcess`, `manageTopic`) angebunden. Offen bleiben insbesondere der vollständige Übernahmeanfrage-Workflow, die automatische Lock-Erneuerung im echten Editor sowie weitere UI-/Integrationstests.

### U1.5 Operative Vollständigkeit der Fachbereiche – querschnittlicher Gate

Recherche-/Relevanzregeln werden als versionierter operativer Regelbestand umgesetzt. U4 muss sowohl Bewertungswirkung auf bekannten Fällen als auch Entdeckungswirkung durch Probe-Recherche unterstützen; U6 übernimmt die Abnahme gegen den Testkorpus.


Vor Implementierung eines Fachbereichs in U2–U4 wird anhand von `docs/Umsetzungs-Vollstaendigkeitsaudit.md` geprüft:

`Fachregel → operative Speicherung → Fachfunktion → Auslöser/KI-Kontext → UI/Arbeitsprozess → Rechte/Audit → Test → Umsetzungsphase`.

Offene rote Befunde sind für den jeweils betroffenen Fachbereich vor dessen Umsetzung zu schließen. Die technische U1-Basis kann parallel weitergeführt werden.


### U2.1 Erster vertikaler Redaktions-Slice – begonnen

Die Redaktions-App wird ab jetzt vertikal aus Anwendersicht entwickelt. Der erste Slice setzt die vorhandene UI-Konzeption bewusst nicht als isolierten Arbeitskorb um, sondern folgt der verbindlichen Informationshierarchie:

`Dashboard → konkreter Arbeitsbedarf → Fachobjekt/Detailansicht`.

Der Arbeitskorb bleibt nach dem Fachkonzept ein nachgeordneter Ort für offene oder zurückgestellte Entscheidungen und ist kein Pflicht-Zwischenschritt.

Erster sichtbarer Stand:

- produktionsnaher Redaktionsrahmen nach erfolgreicher MFA-Anmeldung,
- vollständiger sichtbarer Anwendungskontext mit Kopfzeile, globaler Suche, rollenabhängiger Benutzeranzeige und der im UI-Konzept festgelegten Hauptnavigation,
- Dashboard mit den konzeptionell vorgesehenen Statusbereichen,
- reales Ereignis aus dem bestehenden FIB-Fachservice als erster Arbeitsfall,
- Ereignisdetail mit Breadcrumb, getrenntem Zustand/Status und nächstem Schritt,
- bestehende Federführungs- und Lock-Funktionen im Ereigniskontext statt als separater Techniktest,
- mobile/responsive Grundstruktur.

Noch bewusst nicht vorgetäuscht werden Funktionen, deren Fachservice-/Datenweg noch fehlt. Insbesondere Statuskarten ohne operative Datenquelle bleiben als noch nicht angebunden gekennzeichnet. Der nächste Teil dieses Slices bindet tatsächliches Bearbeiten/Speichern und den Meldungsentwurf über die gemeinsame Fachservice-Schicht an.

### U1/U4 – Versionierte Sprachprofile und KI-Sprachsteuerung – Geplant

- **Verbindliches Arbeitspaket:** [Issue #145](https://github.com/PustefixReisen/fib-echtsystem/issues/145) – Sprachprofile als versionierte, in FIB pflegbare Konfiguration.
- **Fachliche Vorlage:** Bibliotheks-Merkblatt `Merkblatt_Wissenschaftlich-Politische_Sprache.md`, Version **2.2 vom 18.10.2026**. Den vorhandenen `docs/Sprachleitfaden.md` (v1.1 vom 04.10.2026) vor der technischen Umsetzung fachlich abgleichen und kontrolliert aktualisieren.
- **Primärprofil:** **WP-Öffentlichkeit** als Standard öffentlicher Bürgertexte; **WP-Kurz** übernimmt dieselben gemeinsamen Sprachgrundsätze und ergänzt Regeln für kurze Formate. WP-Fach und WP-Gremium bleiben weitere Arbeitsprofile.
- **U1:** versionierte Sprachprofile mit Entwurf/Freigabe, Audit, Quellenreferenz, fester Zuordnung der verwendeten Regelversion zu KI-Textfassungen, ohne Änderungen an Shared-Apps-Fremdanwendungen.
- **U4:** KI-Anbindung lädt freigegebene Profile providerunabhängig; Prompt-/Qualitätsregressionen einschließlich der verständlichen, quellengebundenen und bürgernahen Sprache.
- **U2:** pflegbare Bedienoberfläche für berechtigte FIB-Nutzer, voraussichtlich unter Administration → KI & Kosten → Sprachprofile; konkrete Verantwortlichkeit/Rollen vor Umsetzung klären.
- **Abnahme:** Eine Änderung an WP-Öffentlichkeit ist als Entwurf möglich und wird erst nach expliziter Freigabe wirksam. Frühere Veröffentlichungen behalten ihren historischen Regelstand.

## 4. Verbindliche Abschlussquellen der Gründung und Architekturkonkretisierung

- `docs/Projektgruendung.md` v1.5
- `docs/Dokumentation.md` v3.0
- `docs/Gruendungsaudit.md` v1.0
- `docs/Datenmodell.md` v3.0
- `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0
- `docs/Zielarchitektur.md` v1.0
- `docs/Rollen-Rechte-und-Workflow.md` v1.0
- `docs/Betrieb-und-Wiederherstellung.md`
- `docs/Migrationsstrategie.md` v1.1
- `docs/Migrations-Runbook.md` v1.0
- `docs/Go-live-Abnahmekriterien.md` v1.0
- `docs/Regressionstests-Demonstratortransfer.md`
- `docs/Umsetzungs-Vollstaendigkeitsaudit.md`
- Architekturentscheidungen unter `docs/decisions/`, insbesondere ADR-011

## 5. Offene, aber nicht blockierende Folgepunkte

| Punkt | Wiederaufnahme / Phase |
|---|---|
| Referenzwissen Ausbaustufe 2 | GitHub Issue #1; nach Pilot nur bei nachgewiesenem Bedarf |
| externe MCP-Anbindung | GitHub Issue #2; nach MVP bei konkretem Nutzen |
| Restore-Test | GitHub Issue #3; spätestens U6 / reale G10-Abnahme; zusätzlich schema-spezifischen `fib`-Restore nachweisen |
| Legacy-FIB-Tabelle in `public` | GitHub Issue #5; nach Abschaltung bzw. Entkopplung des Demonstrators bereinigen |
| pustivo Runtime-Secret / echter `fib_app`-Login | bei Einrichtung des FIB-Serverprozesses; Ablauf in `docs/Offener-Punkt-pustivo-FIB-Runtime-Secret.md` |
| Recherche-/Qualitätsschwellen | U4/U6 anhand Pilotkorpus kalibrieren |
| konkrete Produktivprovider/-modelle und Budget | U4/U6 anhand Qualitäts-, Datenschutz- und Kostenmessung |
| möglicher späterer Umzug auf GRÜNEN-Infrastruktur | nur bei tatsächlicher Betriebsentscheidung; pustivo darf dauerhafter Produktivbetrieb bleiben |

## 6. Entwicklungsprinzipien

- Fachliche Parität zum Demonstrator ist Mindestanforderung, nicht Endziel.
- Ein Sachverhalt besitzt eine verbindliche Dokumentationsquelle.
- Web-App, FIB-Chat und AI Tasks nutzen dieselbe Fachservice-Schicht.
- KI wird nur mit klarem Nutzen eingesetzt; erforderliche Qualität geht vor niedrigstem Preis.
- AI Tasks bleiben S0/S1; fachliche Bestätigung und Veröffentlichung bleiben menschlich verantwortlich.
- Öffentliche Auslieferung bleibt Static-first.
- Datenschutz-, Schutzklassen-, Rechte-, Audit- und Quellenregeln werden technisch abgesichert.
- Neue pustivo-Anwendungen erhalten grundsätzlich eigene PostgreSQL-Schemata und eigene technische Zugänge.
- FIB muss auch innerhalb von `Shared-Apps` technisch von Memorix und späteren Apps isoliert bleiben.
- pustivo wird nicht als Wegwerf-Pilot behandelt, sondern produktionsnah und dauerhaft betreibbar aufgebaut.
- Implementierung und Dokumentation werden gemeinsam fortgeschrieben.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 5.1 | 31.10.2026 | Verbindlichen Shared-Apps-Weg korrigiert; lesende Inventur, gezieltes Testdatenmanifest, Sicherungs-/Rücknahmeplan und Bereitstellungsfreigabe #357/#358 vorbereitet. |
| 5.0 | 31.10.2026 | Persönliche Nutzerabnahme #354/#355: lokaler wiederaufnehmbarer Zugang, Original-PDF-/Fixture-Grenzen und Prüfanleitung vorbereitet; Einrichtung und menschliche Bewertung stehen aus. |
| 4.9 | 31.10.2026 | Integrierten Prüfstand #352/#353 und Belegdialoge #350 verknüpft; produktive/fachliche Freigaben bleiben getrennt. |
| 4.8 | 31.10.2026 | PR #349: reguläre Quellen-/Sitzungsoberfläche, technische Browser-/Datenbankabnahme; Nutzerabnahme und produktive Bereitstellung bleiben offen. |
| 4.7 | 31.10.2026 | U2 auf `In Arbeit` gesetzt; vertikale Entwicklung aus Anwendersicht begonnen und ersten Slice `Dashboard → Ereignisdetail → Koordination` aufgenommen. U1.4 auf aktuellen Koordinations-/Teststand nach PR #54–#59 nachgezogen. |
| 4.5 | 06.10.2026 | U1.3 begonnen: Runtime-Konfigurationsvertrag, Secret-Regeln, Domain-Contracts und zentrale Fachservice-Autorisierungsbasis angelegt; pustivo-Live-Credentialtest als konkreten manuellen Schritt dokumentiert. |
| 4.4 | 06.10.2026 | `fib` in Shared-Apps angelegt; Runtime-Rollen, RLS-Policies, Default Privileges und Isolation praktisch geprüft; Advisor-Nacharbeiten durchgeführt; Legacy-Tabelle des Demonstrators über Issue #5 abgegrenzt. |
| 4.3 | 06.10.2026 | ADR-011 übernommen: Shared-Apps mit eigenem Schema `fib`, gemeinsames Supabase Auth bei FIB-eigener Autorisierung, getrennte Nextcloud-/Backup-Zugänge, pustivo als möglicher Dauerbetrieb; `core.sql` auf `fib` umgestellt. |
| 4.2 | 06.10.2026 | U1.2 begonnen; erstes SQL-Kernschema mit RLS-/Grant-Baseline angelegt. |
| 4.1 | 06.10.2026 | U1 gestartet; Monorepo-/Paketstruktur gemäß ADR-009 umgesetzt. |
| 4.0 | 06.10.2026 | Gründungsaudit bestanden; G1–G10 und Gründungsphase abgeschlossen; U1 als nächsten technischen Umsetzungsschritt gesetzt. |
