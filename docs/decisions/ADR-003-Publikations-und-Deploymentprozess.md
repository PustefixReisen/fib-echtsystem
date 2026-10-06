# ADR-003 – Publikations- und Deploymentprozess

## Status

**Entschieden** – 06.10.2026

## Kontext

Die öffentliche FIB-Seite soll robust, SEO-fähig, kostengünstig und unabhängig von der laufenden Verfügbarkeit von Supabase oder KI-Providern sein. Gleichzeitig muss nach einer redaktionellen S3-Freigabe zuverlässig genau der freigegebene öffentliche Stand sichtbar werden.

Die im Demonstrator beobachteten Cache-/Mehrfach-Reload-Probleme dürfen sich im Echtsystem nicht wiederholen.

## Entscheidung

FIB verwendet für öffentliche Inhalte einen **versionierten Static-Publish-Prozess**.

### Grundablauf

```text
Redaktioneller Arbeitsstand
        ↓
S3-Freigabe
        ↓
öffentlicher K0-Snapshot
        ↓
Build
  ├─ HTML-Seiten
  ├─ Suchindex
  ├─ Sitemap/SEO-Artefakte
  ├─ PWA-Manifest/Service-Worker-Daten
  └─ freigegebene Medienkopien
        ↓
Validierung
        ↓
atomarer Deploy
        ↓
öffentliche FIB-Seite
```

### 1. S3-Freigabe erzeugt einen veröffentlichten Stand

Eine Veröffentlichung schreibt nicht direkt in frei sichtbare Webdateien. Zuerst entsteht ein eindeutig versionierter öffentlicher K0-Stand.

Der Veröffentlichungsstand enthält nur Daten und Medien, die für die Öffentlichkeit freigegeben sind.

### 2. Build aus dem freigegebenen Stand

Der Static-Build liest ausschließlich den freigegebenen öffentlichen Stand und erzeugt daraus die vollständigen öffentlichen Artefakte.

K1/K2-Daten dürfen nicht als Build-Eingabe für die öffentliche Ausgabe verwendet werden, außer sie wurden zuvor bewusst redaktionell zu einem eigenständigen K0-Inhalt verarbeitet und freigegeben.

### 3. Validierung vor Veröffentlichung

Vor dem Live-Schalten werden mindestens geprüft:

- Build erfolgreich,
- keine fehlenden Pflichtseiten,
- interne Links auflösbar,
- keine K1/K2-Artefakte im öffentlichen Paket,
- Medienreferenzen vorhanden,
- Suchindex erzeugt,
- Sitemap/Metadaten erzeugt,
- keine offensichtlichen Renderingfehler,
- keine unsichere HTML-/Script-Ausgabe.

Ein fehlgeschlagener Build ersetzt niemals die bestehende öffentliche Version.

### 4. Atomarer Deploy

Der neue Stand wird zunächst vollständig in einen neuen Deployment-Ordner bzw. ein neues Release-Ziel geschrieben.

Erst wenn Build und Validierung erfolgreich sind, wird der öffentliche Zeiger/Release-Pfad auf den neuen Stand umgeschaltet.

Damit sieht ein Besucher entweder:

- den alten vollständigen Stand oder
- den neuen vollständigen Stand,

aber keinen halbfertigen Mischzustand.

### 5. Versionierung und Rollback

Jeder öffentliche Deploy erhält eine eindeutige Release-/Build-Version.

Mindestens der unmittelbar vorherige funktionierende Stand muss schnell wieder aktivierbar sein. Die genaue Anzahl aufbewahrter Releases wird in G7 festgelegt.

### 6. Cache-Strategie

- stabile Inhalts-URLs bleiben stabil,
- statische Assets erhalten versions-/hashbasierte Dateinamen und dürfen lange gecacht werden,
- HTML/öffentliche Inhaltsmanifeste werden deutlich kürzer bzw. revalidierbar gecacht,
- Service Worker/Manifest müssen neue Releases erkennen,
- eine neue Veröffentlichung darf nicht dauerhaft durch alten Browser-/PWA-Cache verdeckt werden,
- der öffentliche Build erhält eine sicht- bzw. technisch prüfbare Versionskennung.

### 7. Medien

Öffentlich freigegebene Bilder/Dateien werden als Teil des veröffentlichten K0-Stands in eine öffentliche Medienablage bzw. das Web-Deployment kopiert.

Der öffentliche Besucher benötigt dadurch keinen Zugriff auf Nextcloud oder einen anderen internen Speicher.

### 8. Auslösung des Publish-Prozesses

Eine fachliche S3-Veröffentlichung erzeugt einen Publish-Auftrag.

Dieser Auftrag kann technisch asynchron verarbeitet werden, muss aber nachvollziehbar sein:

- angefordert,
- in Bearbeitung,
- erfolgreich veröffentlicht,
- fehlgeschlagen.

Ein redaktionell veröffentlichter Fachstand gilt erst dann als öffentlich ausgeliefert, wenn der entsprechende Deploy erfolgreich abgeschlossen wurde.

Bei Fehler bleibt der bisherige öffentliche Stand erhalten und die Redaktion erhält einen sichtbaren Fehlerstatus.

### 9. Entkopplung vom konkreten Hoster

Der Build erzeugt ein transportables statisches Artefakt. Deployment-Ziele können deshalb insbesondere sein:

- IONOS-Webspace in der Entwicklungs-/Pilotphase,
- später der Webserver der GRÜNEN Feldkirchen,
- bei Bedarf ein anderer statischer Webhost.

Die Geschäftslogik darf nicht von einem speziellen Hostinganbieter abhängen.

## Folgen

### Vorteile

- öffentliche Seite bleibt bei Backend-/KI-Ausfall verfügbar,
- klarer Trennpunkt zwischen internem und öffentlichem Datenbestand,
- SEO-freundlich,
- geringe Hostinganforderungen,
- kontrollierbare Cache-Invalidierung,
- reproduzierbare Releases,
- Rollback möglich,
- öffentliche Medien unabhängig vom internen Speicher.

### Nachteile / Aufwand

- Veröffentlichung ist ein eigener technischer Prozess,
- Änderungen sind erst nach erfolgreichem Build/Deploy öffentlich,
- Fehler- und Retry-Handling wird benötigt,
- Suchindex/PWA/Sitemap müssen mit jedem Release konsistent erzeugt werden.

## Abgrenzung

Dieses ADR entscheidet nicht die endgültige CI/CD-Plattform oder die konkrete technische Upload-Methode zum Webserver. Diese Implementierungsdetails werden innerhalb G5 bzw. G7 festgelegt.
