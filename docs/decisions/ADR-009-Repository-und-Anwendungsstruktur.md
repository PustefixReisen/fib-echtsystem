# ADR-009 – Repository- und Anwendungsstruktur

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB besteht technisch aus mehreren zusammengehörigen Teilen:

- öffentliche FIB-Seite/PWA,
- Redaktions-Web-App,
- FIB-Chat als produktiver Redaktionszugang,
- gemeinsame Fachservices,
- KI-Router,
- AI-Task-Worker,
- Supabase-Datenbank/Migrationen,
- Build-/Publish-/Deploymentlogik,
- gemeinsame Tests und Dokumentation.

Diese Teile sollen unabhängig genug sein, um sauber entwickelt und deployt werden zu können, aber nicht in viele separate Repositories zerfallen.

## Entscheidung

### 1. Ein Monorepo für FIB

Das bestehende Repository `PustefixReisen/fib-echtsystem` bleibt das zentrale Repository für Anwendungscode, Datenbankmigrationen, Tests, Assets und verbindliche Projektdokumentation.

Vorteile:

- ein gemeinsamer Änderungsstand,
- gemeinsame Tests und Typen,
- einfache Nachvollziehbarkeit von Änderungen über mehrere Komponenten,
- einheitliche CI/CD-Pipeline,
- geringerer Verwaltungsaufwand,
- Migration auf andere Infrastruktur ohne Repository-Zerlegung.

Separate Repositories werden nur eingeführt, wenn später ein klarer organisatorischer oder technischer Grund entsteht.

### 2. Zielstruktur

Die technische Umsetzung soll sich ungefähr an folgender Struktur orientieren:

```text
fib-echtsystem/
├── apps/
│   ├── public-web/          # öffentliche Astro-Seite / PWA
│   └── editorial-web/       # Redaktions-App inkl. FIB-Chat-Oberfläche
│
├── packages/
│   ├── fachservices/        # serverseitige FIB-Fachlogik
│   ├── domain-contracts/    # gemeinsame Typen/Schemas/Verträge
│   ├── ai-router/           # providerunabhängiges KI-Routing
│   ├── storage-adapter/     # Nextcloud/anderer Storage gekapselt
│   ├── publish/             # K0-Export-/Buildvorbereitung
│   └── ui/                  # tatsächlich gemeinsame UI-Bausteine
│
├── supabase/
│   ├── migrations/          # reproduzierbares Datenbankschema
│   ├── functions/           # Edge-Function-Endpunkte / Worker
│   └── config...            # versionierbare Supabase-Konfiguration
│
├── tests/
│   ├── regression/          # FIB-Referenz-/Transferfälle
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── publish/
│   ├── deploy/
│   └── maintenance/
│
├── assets/                  # Marken-/Produktionsassets
├── docs/                    # verbindliche Projektdokumentation
└── .github/workflows/       # CI/CD
```

Die endgültigen Paketnamen dürfen sich in der Umsetzung noch geringfügig ändern; die Trennung der Verantwortlichkeiten ist verbindlich.

### 3. Öffentliche Website und Redaktions-App sind getrennte Anwendungen

`public-web` und `editorial-web` werden getrennt gebaut.

**Öffentliche Website:**

- erhält nur freigegebenen K0-Buildinput,
- kann vollständig statisch ausgeliefert werden,
- enthält keine Redaktions-Secrets und keine internen Daten,
- kann unabhängig von der Redaktions-App ausfallen/aktualisiert werden.

**Redaktions-App:**

- authentifiziert Redakteure/Admins,
- arbeitet mit Fachservices,
- enthält FIB-Chat als eigenen Arbeitszugang/Screen bzw. Funktionsbereich,
- wird nicht Bestandteil des öffentlichen Static Builds.

Der FIB-Chat benötigt im MVP kein drittes eigenständiges Webprojekt, solange er als eigener Zugang innerhalb derselben geschützten Redaktionsanwendung technisch sauber getrennt werden kann. Seine fachliche Eigenständigkeit bleibt erhalten, weil er dieselben Fachservices verwendet und keine Sonderlogik im UI bekommt.

### 4. Fachlogik nicht in UI-Anwendungen duplizieren

Die öffentlichen und redaktionellen Apps dürfen gemeinsame Darstellungslogik und Typen verwenden, aber verbindliche Fachregeln werden nicht in beiden Frontends kopiert.

Insbesondere gehören in die serverseitige Fachservice-Schicht:

- Statusübergänge,
- Rechte-/Bestätigungsprüfung,
- Freigaberegeln,
- Schutzklassenprüfung,
- Audit,
- fachliche Plausibilitätsregeln,
- Aufruf des KI-Routers,
- Publish-Auslösung.

Browsercode darf diese Regeln für UX-Zwecke spiegeln, ist aber niemals die maßgebliche Durchsetzungsinstanz.

### 5. Gemeinsame Pakete nur bei echtem gemeinsamen Nutzen

Nicht jede kleine Funktion wird sofort zu einem `package`.

Ein gemeinsames Paket entsteht nur, wenn Code tatsächlich von mehreren Komponenten genutzt wird oder eine klare technische Abgrenzung benötigt.

Damit wird ein überkomplexes Monorepo vermieden.

### 6. Abhängigkeiten

Die gewünschte Richtung lautet:

```text
public-web ────────────────→ freigegebener K0-Buildinput

editorial-web ────────────→ Fachservice-API
                               ↓
                         fachservices
                         ├─ domain-contracts
                         ├─ ai-router
                         ├─ storage-adapter
                         └─ publish
                               ↓
                         Supabase / Storage / KI
```

`public-web` erhält keinen regulären Zugriff auf interne Fachservices oder Fachtabellen für normales Lesen.

### 7. Supabase-Verzeichnis ist reproduzierbare Infrastrukturquelle

Unter `supabase/` werden soweit technisch möglich versioniert:

- Datenbankmigrationen,
- Policies,
- Constraints,
- Funktionen/Trigger,
- Edge Functions,
- lokale/standardisierte Konfiguration.

Dashboard-only-Einstellungen, die nicht als Code abbildbar sind, müssen im Betriebs-/Migrationsrunbook dokumentiert werden.

### 8. Tests sind eigener erstklassiger Bereich

Der bestehende Demonstrator-Transfer-/Regressionstestkorpus wird nicht nur dokumentarisch weitergeführt, sondern in der Umsetzung soweit möglich automatisiert.

Getrennt werden:

- fachliche Regressionstests,
- Integrations-/Service-Tests,
- End-to-End-Tests für Redaktions-App und öffentliche Seite.

### 9. Dokumentation bleibt im selben Repository

`docs/` bleibt verbindliche Projektdokumentation. Code und Dokumentation werden dadurch gemeinsam versioniert.

Die bereits konzipierte fachliche Untergliederung der Dokumentation kann später physisch umgesetzt werden, ohne die technische App-Struktur zu vermischen.

## Konsequenzen

### Vorteile

- übersichtliche Gesamtstruktur,
- klare Trennung zwischen öffentlich und intern,
- Fachlogik zentral statt mehrfach,
- gemeinsame Tests und CI/CD,
- leichter Übergang Entwickler → GRÜNEN-Infrastruktur,
- FIB-Chat benötigt keine unnötige zusätzliche Anwendung im MVP.

### Risiken/Aufwand

- Monorepo benötigt saubere Abhängigkeitsgrenzen,
- gemeinsame Pakete dürfen nicht zum unübersichtlichen Sammelbecken werden,
- UI-Code darf fachliche Serverlogik nicht schleichend übernehmen.

Diese Punkte werden durch klare Paketverantwortung, Tests und Architekturregeln kontrolliert.
