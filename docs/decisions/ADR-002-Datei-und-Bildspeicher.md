# ADR-002 – Datei- und Bildspeicherarchitektur

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB benötigt Speicher für:

- recherchierte Dokumente/Fundstellen,
- interne Dateien,
- Bildoriginale,
- Rechte-/Nachweisdateien,
- öffentlich freigegebene Bilder und ggf. Dokumente.

G3 trennt fachliche Bild-/Dateimetadaten von der konkreten Verwendung. G4 unterscheidet K0–K3 und verlangt, dass K1/K2 nicht unbeabsichtigt öffentlich ausgeliefert werden.

Für Entwicklungs-/Pilotbetrieb steht eine verwaltete Nextcloud als naheliegender Speicher zur Verfügung. Die spätere Produktivarchitektur darf jedoch nicht an ein persönliches Konto oder einen konkreten Storage-Anbieter gebunden sein.

## Entscheidung

### 1. Drei getrennte Ebenen

FIB trennt technisch:

1. **Metadaten/Fachstatus** – PostgreSQL/Supabase,
2. **Original-/Arbeitsdatei** – geschützter Datei-/Bildspeicher,
3. **öffentliche Auslieferungsdatei** – statisches K0-Deployment auf dem öffentlichen Webserver.

```text
Original / interne Datei
        ↓
 geschützter Storage
        ↓
FIB-Metadaten + Rechte + Schutzklasse + Freigabe
        ↓ S3-Freigabe
öffentliche Kopie / optimierte Ableitung
        ↓
Static Build / Webserver
        ↓
Besucher
```

### 2. Nextcloud als geeigneter Pilot-/Originalspeicher

Eine vorhandene verwaltete Nextcloud kann in Entwicklungs-/Pilotphase für Originale und interne Arbeitsdateien verwendet werden.

Die Anbindung erfolgt gekapselt über den FIB-Storage-Adapter, vorzugsweise über standardisierte Nextcloud-/WebDAV-Schnittstellen.

Die Datenbank speichert keine persönlich gebundene vollständige Nextcloud-URL als fachliche Identität, sondern einen FIB-internen Storage-Identifier und technische Adapterdaten.

### 3. Keine direkte öffentliche Abhängigkeit von Nextcloud

Öffentliche Besucher erhalten grundsätzlich **keine direkten internen Nextcloud-Datei-URLs**.

Bei öffentlicher S3-Freigabe wird eine freigegebene Datei bzw. Bildableitung in den öffentlichen Deploymentbestand übernommen.

Vorteile:

- K1/K2 bleiben vom öffentlichen Web getrennt,
- kein öffentlicher Zugriff auf persönliche/organisationsinterne Storage-Instanz nötig,
- öffentliche Dateien funktionieren auch bei Nextcloud-Ausfall weiter,
- Medien können für Web/PWA optimiert werden,
- Cache/CDN/Webserver können öffentliche Dateien effizient ausliefern,
- spätere Storage-Migration verändert öffentliche URLs nicht zwangsläufig.

### 4. Öffentliche Bildableitungen

Für Bilder darf die öffentliche Variante vom Original abweichen, z. B. durch:

- Größenanpassung,
- WebP/AVIF/JPEG-Optimierung,
- Entfernung unnötiger EXIF-/Metadaten,
- definierte Qualität/Abmessungen,
- ggf. Beschnitt für konkrete Bildverwendung.

Das Original bleibt unverändert bzw. nachvollziehbar im geschützten Storage.

Die fachliche `Bildverwendung` verweist auf die freigegebene Verwendung, nicht auf eine zufällige physische URL.

### 5. Öffentliche Dokumente

Wenn FIB eine Datei selbst öffentlich bereitstellen darf, wird eine freigegebene K0-Kopie in den öffentlichen Deploymentbestand übernommen.

Wenn FIB nur auf eine externe Quelle verweisen darf/soll, wird keine öffentliche Kopie erzeugt; die öffentliche Darstellung enthält stattdessen den geprüften externen Link.

### 6. Schutzklassen

- **K0:** darf nach S3-Freigabe Bestandteil des öffentlichen Deployments sein.
- **K1:** nur geschützter Storage, nicht öffentlich deployen.
- **K2:** nur ausdrücklich geeigneter geschützter Storage und restriktiver Zugriff; keine öffentliche Kopie ohne bewusste rechtliche/fachliche Freigabe und daraus entstehenden eigenständigen K0-Stand.
- **K3:** nicht in normalem Datei-/Bildspeicher verwalten; Secret-Infrastruktur.

### 7. Storage-Adapter

Der Adapter kapselt mindestens:

- `store`
- `read`
- `replace/version`
- `delete/lock` soweit zulässig
- `getMetadata`
- `createPublicDerivative` bzw. Bereitstellung für den Build

Die Fachfunktionen kennen keine WebDAV-Pfade oder anbieterspezifischen APIs.

### 8. Migration

Die Produktionsumgebung der GRÜNEN erhält einen organisationskontrollierten Storage-Betriebsweg.

Mögliche spätere Zielsysteme:

- organisationsgebundene Nextcloud,
- Supabase Storage,
- anderer geeigneter EU-/organisationskontrollierter Objektspeicher.

Der Wechsel betrifft den Storage-Adapter und die technische Migration der Originaldateien, nicht das fachliche Datenmodell.

## Nicht gewählt

### Binärdateien direkt in PostgreSQL

Nicht gewählt wegen unnötiger Datenbankgröße, Backup-/Transferaufwand und schlechter Trennung von Fachdaten und Blob-Speicher.

### Öffentliche Nextcloud-Sharelinks als primäre FIB-Medien-URLs

Nicht als Standard gewählt, weil dadurch öffentliche Darstellung, Berechtigungen, Cache und Migration unnötig an den Storage-Anbieter gekoppelt würden.

### Persönliche Nextcloud als dauerhafte Produktivabhängigkeit

Aus Governance- und Migrationsgründen ausgeschlossen.

## Konsequenzen

- öffentliche Website bleibt statisch und storage-unabhängig,
- bestehende Nextcloud kann ohne Architekturbindung sinnvoll genutzt werden,
- S3-Publikation/Deployment erhält einen Medienexport-Schritt,
- G5 konkretisiert als Nächstes Adaptervertrag und Dateinamens-/Assetstrategie,
- G7 definiert Backup/Restore und Retention des Originalspeichers,
- G9 migriert Originale getrennt vom öffentlichen statischen Deployment.
