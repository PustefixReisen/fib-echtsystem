# Zielarchitektur – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Integrationsquelle für **G5 – Zielarchitektur / Stack / Hosting / Deployment**.

Es beschreibt die technische Gesamtidee so, dass die wesentlichen Entscheidungen fachlich nachvollziehbar bleiben. Technische Detailentscheidungen stehen in den zugehörigen ADRs unter `docs/decisions/`.

Grundlage sind insbesondere:

- `docs/Datenmodell.md`
- `docs/MVP-Fachfunktionen.md`
- `docs/KI-Zugangswege-und-Fachfunktionen.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/KI-Provider-und-DSFA-Pruefrahmen.md`
- `docs/Migrationsstrategie.md`
- `docs/KI-Betrieb-und-Kosten.md`

Zugehörige Architekturentscheidungen:

- `ADR-001-Web-und-Service-Stack.md`
- `ADR-002-Datei-und-Bildspeicher.md`
- `ADR-003-Publikations-und-Deploymentprozess.md`
- `ADR-004-Suche-und-RAG.md`
- `ADR-005-AI-Tasks-Scheduler-und-Queue.md`
- `ADR-006-Authentifizierung-und-Rechtearchitektur.md`
- `ADR-007-KI-Router-und-Providerintegration.md`
- `ADR-008-CI-CD-und-Deployment.md`
- `ADR-009-Repository-und-Anwendungsstruktur.md`

## 2. Gesamtidee

FIB wird technisch in drei Bereiche getrennt:

1. **Redaktion und Automatisierung** – Redaktions-App, FIB-Chat und AI Tasks,
2. **interner FIB-Kern** – Fachservices, Datenbank, Dateispeicher und KI-Router,
3. **öffentliche FIB-Seite** – fertig erzeugte, freigegebene Seiten für Besucher.

```text
Redaktions-App / FIB-Chat / AI Tasks
                │
                ▼
        gemeinsame Fachservices
        ┌───────┼─────────┐
        ▼       ▼         ▼
    Supabase  Storage   KI-Router
                         │
                         ▼
                   KI-Provider

              S3-Freigabe
                   │
                   ▼
          öffentlicher K0-Stand
                   │
                   ▼
          Build + Validierung
                   │
                   ▼
          öffentlicher Webserver
                   │
                   ▼
                Besucher
```

Der wichtigste Grundsatz lautet:

> **FIB arbeitet intern dynamisch mit Datenbank und KI, veröffentlicht nach außen aber einen stabilen, freigegebenen Informationsstand.**

## 3. Gemeinsame Fachservices

Web-App, FIB-Chat und AI Tasks dürfen nicht jeweils eigene fachliche Regeln entwickeln.

Alle regulären fachlichen Lese- und Schreibzugriffe laufen über dieselbe Fachservice-Schicht.

Dort werden insbesondere erzwungen:

- Rollen und Berechtigungen,
- Schutzklassen,
- Statusübergänge,
- S2-/S3-Bestätigungen,
- Plausibilitäts- und Freigaberegeln,
- Audit,
- KI-Routing,
- Publish-Auslösung.

Direkter Datenbankzugriff bleibt technischen Betriebsaufgaben vorbehalten.

## 4. Datenbank und Authentifizierung

### Supabase/PostgreSQL

Supabase/PostgreSQL bleibt der strukturierte Kern des MVP.

Dort liegen insbesondere:

- fachliche FIB-Daten und Beziehungen,
- Status und Historie,
- Auditdaten,
- Benutzeridentitäten,
- technische Suchdaten,
- AI-Task-/Run-Daten,
- Queue-/Cron-nahe Betriebsdaten soweit passend.

### Authentifizierung

Besucher benötigen kein Konto.

Nur Redakteure und Admins werden authentifiziert. Konten werden administrativ angelegt oder eingeladen; eine öffentliche Selbstregistrierung ist nicht vorgesehen.

Die eigentliche fachliche Rechteprüfung geschieht serverseitig in den Fachservices. **RLS** dient zusätzlich als zweite Sicherheitsbarriere.

Privilegierte Schlüssel und Secrets dürfen niemals im Browser oder öffentlichen Build landen.

MFA/2FA wird technisch unterstützt; konkrete Pflichten je Rolle/Aktion werden in G6 festgelegt.

## 5. Öffentliche FIB-Seite / PWA

Die öffentliche Seite wird **static-first** umgesetzt.

Vorgesehener Stack:

- TypeScript,
- Astro für die öffentliche Website,
- gezielte interaktive Komponenten statt vollständiger SPA-Abhängigkeit,
- PWA-Funktionen für Installation, lokalen Neuigkeitsstatus und Push.

Für Besucher bedeutet das:

- kein Login,
- normales Lesen ohne laufenden Datenbankzugriff,
- normales Lesen ohne laufenden KI-Aufruf,
- stabile URLs,
- gute SEO-Fähigkeit,
- robuste Auslieferung auch bei Ausfall interner Dienste.

Öffentliche K0-Inhalte dürfen kontrolliert lokal gecacht werden. K1/K2 dürfen nicht in öffentliche PWA-Caches gelangen.

## 6. Redaktions-App und FIB-Chat

Die Redaktions-App ist die strukturierte Arbeitsoberfläche für Redakteure und Admins.

Sie verwendet:

- Supabase Auth,
- gemeinsame Fachservices,
- Online-Betrieb im MVP,
- keine dauerhafte Offline-Spiegelung interner K1/K2-Daten.

Der **FIB-Chat** bleibt ein eigener produktiver Arbeitszugang, benötigt im MVP aber keine dritte separate Webanwendung. Er wird als eigener geschützter Bereich innerhalb der Redaktions-App umgesetzt.

Wichtig:

> Der Chat interpretiert natürliche Sprache, arbeitet aber mit denselben Fachfunktionen wie die strukturierte Redaktionsoberfläche.

Er besitzt keinen Sonderzugriff auf die Datenbank.

## 7. Datei- und Bildspeicher

Binärdateien wie Bilder und Dokumente werden nicht in PostgreSQL eingebettet.

Die Datenbank hält stattdessen:

- fachliche Identität,
- Herkunft,
- Rechte-/Lizenzstatus,
- Schutzklasse,
- Freigabestatus,
- Beziehungen zu FIB-Objekten,
- technische Speicherreferenz.

Der eigentliche Dateiinhalt liegt in einem austauschbaren Storage.

### Nextcloud

Nextcloud ist für den Pilotbetrieb ein geeigneter Kandidat, aber keine feste Systemvoraussetzung.

FIB arbeitet über einen Storage-Adapter, sodass später auch eine organisationsgebundene Nextcloud, Supabase Storage oder ein anderer geeigneter Speicher verwendet werden kann.

Öffentlich freigegebene Bilder/Dokumente werden bei der Veröffentlichung in den öffentlichen K0-Build übernommen. Besucher greifen nicht auf interne Nextcloud-/Storage-URLs zu.

## 8. Publikationsmodell

Eine fachliche S3-Freigabe veröffentlicht nicht direkt einzelne Dateien auf dem Webserver.

Ablauf:

```text
S3-Freigabe
   ↓
versionierter öffentlicher K0-Stand
   ↓
Static Build
   ├─ HTML
   ├─ Suchindex
   ├─ Sitemap / SEO
   ├─ PWA-Artefakte
   └─ freigegebene Medien
   ↓
Validierung
   ↓
Deployment
   ↓
öffentliche Seite
```

Verbindlich:

- nur freigegebene K0-Daten gehen in den Build,
- Besucher sehen keinen halbfertigen Mischstand,
- ein fehlgeschlagener Build ersetzt niemals den funktionierenden Stand,
- Deployments sind versioniert,
- Rollback auf den letzten funktionierenden Stand ist möglich,
- fachliche Freigabe und technische Auslieferung bleiben nachvollziehbar getrennt.

## 9. Suche und RAG

FIB folgt dem Grundsatz:

> **Struktur vor Text, Text vor Semantik.**

### Öffentliche Suche

Beim Build entsteht ein eigener öffentlicher K0-Suchindex. Besucher durchsuchen damit nur freigegebene Inhalte und greifen nicht direkt auf Supabase zu.

### Interne Suche

Redaktion und FIB-Chat verwenden zuerst:

1. vorhandene fachliche Beziehungen,
2. strukturierte Filter,
3. PostgreSQL-Volltextsuche.

### RAG

Für KI-Antworten wird gezielt der passende FIB-Kontext zusammengestellt: Ereignisse, Vorgänge, Themen, Quellen und andere relevante Objekte.

Semantische/Vektorsuche ist im MVP **keine Pflicht**. Sie wird nur ergänzt, wenn Tests einen klaren Mehrwert zeigen.

## 10. AI Tasks und automatische Recherche

Automatische Aufgaben dürfen nicht von einem einzelnen langen Prozess abhängen.

Vorgesehen ist:

```text
AI Task
   ↓
Cron / fachlicher Trigger
   ↓
AITaskRun
   ↓
persistente Queue
   ↓
Worker
   ↓
Fachservices / Recherche / KI-Router
```

Damit können Läufe nach Fehlern kontrolliert wieder aufgenommen werden.

Verbindlich:

- Zeitplanung und Verarbeitung sind getrennt,
- Jobs sind nachvollziehbar und möglichst idempotent,
- lange Rechercheläufe werden in Schritte zerlegt,
- AI Tasks dürfen keine S2-/S3-Aktion eigenmächtig durchführen.

Für den MVP werden Supabase Cron, Queue/`pgmq` und Edge-Function-Worker verwendet. Ein eigener dauerhaft laufender Worker-Server ist zunächst nicht nötig.

## 11. KI-Router und Mehranbieterbetrieb

Alle produktiven KI-Aufrufe laufen über einen zentralen KI-Router.

Eine Fachfunktion verlangt nicht „OpenAI Modell X“ oder „Mistral Modell Y“, sondern beschreibt den Bedarf:

- Aufgabenklasse,
- Qualitätsklasse,
- Schutzklasse,
- Personenbezug,
- benötigte Fähigkeiten,
- Kostenrahmen,
- zulässige Fallbacks.

Der Router wählt daraus einen freigegebenen Betriebsweg.

Qualitätsklassen:

- **Q1:** einfache Extraktion, Klassifikation, Formatierung, kostensensitive Massenaufgaben,
- **Q2:** normale Analyse, Recherche, Zusammenfassung und Zuordnung,
- **Q3:** schwierige Quellenlagen, komplexe Synthesen und Qualitätsprüfung.

Verbindlich:

- mindestens zwei Provider müssen parallel konfigurierbar sein,
- Qualität hat Vorrang vor niedrigstem Preis, wenn die Aufgabe dies erfordert,
- günstigere Modelle werden bevorzugt, wenn sie nachweislich ausreichen,
- K3 geht niemals an externe KI,
- K2 nur über ausdrücklich dafür freigegebene Betriebswege,
- Fallbacks dürfen Schutz-/Datenschutzanforderungen nicht abschwächen,
- Modell-/Providerwechsel erfolgt über Konfiguration und Regressionstest.

Konkrete Modellzuordnungen werden im Pilotbetrieb kalibriert und gehören später zum Betrieb, nicht zur festen Architektur.

## 12. CI/CD und Deployment

GitHub Actions wird als zentrale CI/CD-Plattform verwendet.

Es gibt zwei getrennte Wege:

### Softwareänderung

Codeänderungen werden geprüft durch:

- Typecheck/Lint,
- automatisierte Tests,
- FIB-Regressionstests soweit relevant,
- Anwendungs-/Astro-Build,
- Sicherheits-/Konfigurationsprüfungen.

### Inhaltsveröffentlichung

Eine S3-Freigabe erzeugt einen versionierten K0-Stand und stößt für genau diesen Stand den Publish-Build an.

Wichtig:

> **Ein Code-Commit ist keine fachliche Veröffentlichung, und eine fachliche Veröffentlichung benötigt keinen Code-Commit.**

### Build once, deploy same artifact

Der erfolgreich geprüfte Build wird als versioniertes Paket erzeugt und genau dieses Paket ausgeliefert.

Pilot:

- Deployment auf IONOS-Webspace über SFTP/SSH bzw. gleichwertig sichere Methode.

Zielbetrieb:

- dasselbe Paket auf den späteren GRÜNEN-Webserver,
- nur Zielkonfiguration und Secrets ändern sich.

Dadurch bleibt FIB vom konkreten Webhoster unabhängig.

## 13. Umgebungen und Migration

Mindestens drei logisch getrennte Umgebungen sind vorgesehen:

1. lokale/Entwicklungsumgebung,
2. Pilot-/Entwicklerumgebung,
3. Produktivumgebung GRÜNE Feldkirchen.

Entwicklungs-/Pilotbetrieb und späterer Zielbetrieb verwenden dieselbe Software und dasselbe reproduzierbare Schema.

Domains, Projekt-IDs, Storage-Endpunkte, Provider und Secrets werden konfiguriert und nicht in Fachlogik eingebaut.

Zielbetrieb:

- GRÜNEN-Webserver,
- eigenes Supabase-Projekt der Organisation,
- organisationskontrollierter Storage,
- organisationskontrollierte Providerkonten, Domains und Secrets,
- mindestens zwei administrativ handlungsfähige Personen.

## 14. Repository- und Anwendungsstruktur

FIB bleibt ein **Monorepo**.

Zielstruktur:

```text
fib-echtsystem/
├── apps/
│   ├── public-web/          # öffentliche Astro-Seite / PWA
│   └── editorial-web/       # Redaktions-App + FIB-Chat
├── packages/
│   ├── fachservices/
│   ├── domain-contracts/
│   ├── ai-router/
│   ├── storage-adapter/
│   ├── publish/
│   └── ui/
├── supabase/
│   ├── migrations/
│   └── functions/
├── tests/
├── scripts/
├── assets/
├── docs/
└── .github/workflows/
```

Die öffentliche Website und die Redaktions-App werden getrennt gebaut. Fachlogik wird nicht in den Frontends dupliziert.

Gemeinsame Pakete entstehen nur, wenn tatsächlich gemeinsamer Nutzen besteht; unnötige technische Zergliederung wird vermieden.

## 15. Sicherheit und Cache

Verbindlich:

- keine ungeprüfte HTML-Ausgabe von KI-/Quelltext,
- kontrolliertes Rendering von Markdown/strukturierten Inhalten,
- Schutz vor XSS/Script-Injektion,
- keine Secrets in Repository oder öffentlichen Buildartefakten,
- K1/K2 niemals im öffentlichen Cache,
- statische Assets dürfen stark gecacht werden,
- HTML/Releaseinformationen müssen neue Veröffentlichungen zuverlässig sichtbar machen,
- jeder öffentliche Deploy besitzt eine prüfbare Releasekennung.

Damit soll insbesondere das im Demonstrator beobachtete Problem veralteter Browser-/PWA-Stände strukturell vermieden werden.

## 16. Ergebnis G5

Mit ADR-001 bis ADR-009 sind die wesentlichen Architekturgrundsätze für die technische Umsetzung festgelegt:

- Web-/Service-Stack,
- Storage,
- Publikation,
- Suche/RAG,
- AI Tasks,
- Authentifizierung/Rechtearchitektur,
- KI-Router/Providerintegration,
- CI/CD/Deployment,
- Repository-/Anwendungsstruktur.

Nicht mehr G5-Grundsatzfragen sind insbesondere:

- konkrete RLS-Policy-Matrix → G6,
- MFA-Pflichten je Rolle/Aktion → G6/G7,
- konkrete Modellzuordnung und Providerfreigabe → Pilotbetrieb/G7,
- Backup/Restore/Monitoring/Kostenwarnungen → G7,
- konkretes Migrationsrunbook → G9.

Vor dem formalen Abschluss von G5 erfolgt ein kurzer G5-Gesamtaudit auf Vollständigkeit und Widerspruchsfreiheit.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G5 nach ADR-001 bis ADR-009 vollständig konsolidiert; Static-first, Fachservices, Supabase-Kern, Storage, Publikation, Suche/RAG, AI Tasks, Auth/RLS, KI-Router, CI/CD und Monorepo-Struktur als verständliche Gesamtarchitektur zusammengeführt. |
| 0.6 | 06.10.2026 | KI-Router und Mehranbieterbetrieb integriert. |
| 0.5 | 06.10.2026 | Authentifizierung und Rechtearchitektur integriert. |
| 0.4 | 06.10.2026 | AI-Task-/Queue-Architektur integriert. |
| 0.3 | 06.10.2026 | Suche/RAG integriert. |
| 0.2 | 06.10.2026 | Web-/Service-Stack, Storage und Publikationsprozess integriert. |
| 0.1 | 06.10.2026 | G5 gestartet. |
