# ADR-001 – Web- und Service-Stack für FIB

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB benötigt gleichzeitig:

- sehr robuste, schnelle und SEO-taugliche öffentliche Seiten,
- PWA-Funktionen ohne Besucherlogin,
- eine authentifizierte Redaktions-Web-App,
- einen produktiven FIB-Chat,
- automatische AI Tasks,
- eine gemeinsame Fachfunktionsschicht,
- Supabase/PostgreSQL als strukturierten Kern,
- späteren Umzug vom Entwicklerbetrieb auf GRÜNEN-Infrastruktur,
- möglichst geringen Betriebs- und Wartungsaufwand.

Der öffentliche Betrieb soll nicht davon abhängen, dass bei jedem Seitenaufruf Datenbank oder KI erreichbar sind.

## Entscheidung

### 1. Sprache und Build-System

Der Anwendungscode wird grundsätzlich in **TypeScript** entwickelt.

Für Frontend-Build und lokale Entwicklung wird das moderne Vite-Ökosystem genutzt.

### 2. Öffentliche Anwendung: Astro static-first

Die öffentliche FIB-Anwendung wird mit **Astro** als statisch erzeugte Website/PWA aufgebaut.

Grundprinzip:

> **Veröffentlichung erzeugt einen freigegebenen öffentlichen Datenstand; daraus werden statische öffentliche Seiten und Indizes gebaut und deployt.**

Damit werden insbesondere erzeugt:

- Startseite,
- Meldungsseiten,
- Vorgangsseiten,
- Themenseiten,
- Sitzungsseiten,
- stabile URLs,
- Suchindex für öffentliche Inhalte,
- Sitemap,
- strukturierte Daten/SEO-Metadaten,
- Social-Preview-Metadaten,
- PWA-Manifest/Assets und geeignete Cacheinformationen.

Der Build bezieht den öffentlichen K0-Datenstand über eine dafür vorgesehene FIB-Fachfunktion bzw. Exportfunktion. Der Build greift nicht beliebig direkt auf Fachtabellen zu.

### 3. Interaktive Bereiche

Astro wird nur dort mit clientseitigen Komponenten ergänzt, wo echte Interaktion nötig ist.

Für komplexere interaktive Bereiche wird **React mit TypeScript** als UI-Komponentenbibliothek verwendet, insbesondere für:

- Redaktionsoberfläche,
- FIB-Chat,
- komplexere Formulare/Prüfdialoge,
- ggf. dynamische interne Dashboards.

Einfache öffentliche Interaktionen sollen nicht unnötig mit React hydratisiert werden.

### 4. Redaktions-Web-App

Die Redaktionsanwendung wird als statisch ausgelieferte Browser-Anwendung unter einem getrennten Bereich, z. B. `/redaktion/`, bereitgestellt.

Sie enthält keine internen FIB-Daten im Build-Artefakt.

Nach Anmeldung ruft sie ausschließlich die gemeinsame FIB-Service-/Fachfunktionsschicht auf.

### 5. Serverseitige Fachservice-Schicht

Die produktive Fachfunktionsschicht wird im MVP primär als **TypeScript auf Supabase Edge Functions** umgesetzt.

Dabei gilt:

- Browser greifen nicht direkt fachlich auf FIB-Fachtabellen zu,
- Edge Functions validieren Authentifizierung, Rolle, Schutzklasse, Objektzustand, Bestätigung und Fachregel,
- die eigentliche Geschäftslogik liegt in gemeinsam nutzbaren Service-Modulen,
- Funktionen werden fachlich organisiert, nicht als CRUD-Spiegel jeder Tabelle,
- öffentliche Export-/Lesefunktionen liefern ausschließlich freigegebene K0-Daten,
- privilegierte technische DB-Zugriffe bleiben serverseitig.

### 6. Datenbankzugriff

FIB-Fachtabellen werden möglichst nicht als frei vom Browser nutzbare Data-API-Oberfläche behandelt.

RLS/Policies bleiben **Defense in Depth** und müssen auf allen exponierten Tabellen korrekt gesetzt sein. Sie ersetzen die Fachservices nicht.

Wenn Tabellen nicht für direkte Clientabfragen benötigt werden, sollen sie technisch so weit wie sinnvoll aus dem direkten öffentlichen Datenzugriff herausgehalten werden.

### 7. Authentifizierung

Redakteur/Admin-Authentifizierung erfolgt mit **Supabase Auth**.

Autorisierungsdaten werden nicht aus benutzerveränderbaren Profilmetadaten abgeleitet. Die konkrete Rollenabbildung folgt in G6.

### 8. AI Tasks

Zeitgesteuerte bzw. anlassbezogene AI Tasks werden im MVP bevorzugt über **Supabase Cron/pg_cron plus Edge Functions** ausgelöst, soweit Laufzeit und Zuverlässigkeitsanforderungen passen.

Lang laufende oder betrieblich ungeeignete Aufgaben dürfen später auf einen separaten Worker ausgelagert werden, ohne die Fachfunktionsschnittstelle zu verändern.

### 9. Öffentliche Veröffentlichung / Deployment

Eine S3-Veröffentlichung verändert zunächst den verbindlichen öffentlichen Stand in FIB.

Danach wird ein Deploymentprozess ausgelöst:

```text
S3-Freigabe
  → öffentlicher K0-Stand/version
  → Static Build
  → Tests
  → atomarer/robuster Upload auf Webserver
  → Cache-/Version-Aktualisierung
```

Die Veröffentlichung gilt fachlich bereits im FIB-Datenstand; der technische Auslieferungsstatus wird separat überwacht. Ein fehlgeschlagenes Deployment darf den fachlichen Stand nicht unbemerkt verfälschen.

### 10. Hosting

Die statischen öffentlichen und redaktionellen Web-Artefakte benötigen produktiv **keinen Node-Server**. Sie können auf normalem Webspace/Webserver ausgeliefert werden.

Damit bleibt die Anwendung mit dem vorhandenen IONOS-/späteren GRÜNEN-Webhosting kompatibel.

Supabase bleibt verwalteter Backenddienst; Supabase-Self-Hosting ist nicht vorgesehen.

## Gründe

### Static-first öffentlich

Vorteile:

- sehr gute Verfügbarkeit,
- geringe Betriebskosten,
- hervorragende Cachebarkeit,
- kein Datenbankzugriff pro Besucheraufruf,
- Datenbank-/KI-Ausfälle beeinträchtigen bereits veröffentlichte Inhalte nicht,
- gute SEO-Basis,
- einfach auf normalem Webspace betreibbar,
- klarer öffentlicher Freigabeschnitt: nur K0 gelangt in den Build.

Nachteil:

- veröffentlichte Änderungen benötigen einen neuen Build/Deploy.

Dieser Nachteil ist für FIB akzeptabel, wenn der Deploymentprozess zuverlässig automatisiert wird.

### Astro

Astro ist auf statische und inhaltsorientierte Websites ausgerichtet und erzeugt Seiten standardmäßig beim Build. Interaktive Komponenten können gezielt ergänzt werden, ohne die gesamte öffentliche Anwendung als große SPA auszuliefern.

### React nur für komplexe Interaktion

React wird nicht als Pflicht für jede Seite eingesetzt, sondern gezielt dort, wo Zustands- und Formularlogik den zusätzlichen Rahmen rechtfertigt. So bleibt die öffentliche Anwendung schlank, während Redaktionssystem und Chat auf eine verbreitete Komponentenarchitektur zurückgreifen können.

### Supabase Edge Functions

Die Fachservices benötigen serverseitige Authentifizierung, Secret-Zugriff, KI-/Storage-Anbindung und kontrollierten Datenbankzugriff. Supabase Edge Functions bieten dafür TypeScript und direkte Integration in die bereits gesetzte Supabase-Architektur.

## Verworfene bzw. nicht bevorzugte Alternativen

### Reine Browser-SPA für die öffentliche Anwendung

Nicht bevorzugt, weil SEO, initiale Auslieferung, Cache- und Ausfallsicherheit schlechter zum FIB-Zielbild passen.

### Permanenter eigener Node-Server für die öffentliche Website

Nicht erforderlich und erhöht Hosting-, Betriebs- und Migrationsaufwand.

### Fachlogik überwiegend im Browser

Verworfen, weil Rechte, Schutzklassen, Freigaben und Integrität serverseitig erzwungen werden müssen.

### Fachlogik ausschließlich als PostgreSQL-Funktionen

Nicht bevorzugt. Datenbank-Constraints und einzelne atomare Operationen dürfen in PostgreSQL liegen; die gesamte Geschäfts-/Providerlogik soll jedoch nicht an Datenbankprozeduren gebunden werden.

## Konsequenzen

- öffentliches FIB ist auch bei Backendstörungen weiter lesbar,
- Veröffentlichung benötigt einen robusten automatischen Build-/Deploypfad,
- G5 muss als Nächstes den öffentlichen Export, Deploymenttrigger, Storage-Adapter und Projektstruktur konkretisieren,
- G6 konkretisiert Auth/Rollen und serverseitige Autorisierung,
- G7 definiert Monitoring für fehlgeschlagene Builds/Deployments und Schedulerläufe,
- Repository erhält eine gemeinsame TypeScript-Struktur für Web, Services und gemeinsame Typen/Validierungen.

## Verifikation vor Umsetzung

Vor tatsächlicher Implementierung werden die dann aktuellen Astro-, Vite- und Supabase-Dokumentationen erneut geprüft und Abhängigkeiten versioniert/pinned. Supabase-spezifische Sicherheitsregeln werden insbesondere für RLS, Auth, Edge Functions und Secrets nochmals anhand der aktuellen Dokumentation verifiziert.
