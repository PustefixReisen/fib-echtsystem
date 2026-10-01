# FIB Markenassets

Dieser Ordner ist die verbindliche Ablage für produktionsfähige grafische Assets von **Feldkirchen im Blick**.

Die fachlichen und gestalterischen Regeln stehen in `docs/Visuelle-Identitaet-und-Bildkonzept.md`. Dieser Ordner enthält die daraus abgeleiteten Einzeldateien für Web, PWA, Social Preview und Druck.

## Verzeichnisstruktur

```text
assets/brand/
├── logo/
│   ├── fib-logo-horizontal.svg
│   ├── fib-logo-horizontal.png
│   ├── fib-logo-kompakt.svg
│   ├── fib-logo-kompakt.png
│   ├── fib-logo-monochrom.svg
│   └── fib-logo-monochrom.png
├── banner/
│   ├── fib-banner-mobile.svg
│   ├── fib-banner-mobile.webp
│   ├── fib-banner-wide.svg
│   └── fib-banner-wide.webp
├── icons/
│   ├── nav-neues.svg
│   ├── nav-im-blick.svg
│   ├── nav-sitzungen.svg
│   ├── nav-suche.svg
│   ├── sonnenblumenblaetter.svg
│   └── gruene-homepage-link.svg
├── pwa/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-192.png
│   ├── icon-maskable-512.png
│   ├── icon-monochrome.svg
│   └── favicon.ico
├── social/
│   ├── social-default-1200x630.png
│   └── social-default-1200x630.webp
└── reference/
    ├── styleguide-visuelle-identitaet.png
    └── styleguide-responsive.png
```

## Master- und Exportprinzip

- **SVG ist das Masterformat** für Logo, Bildmarke, Navigationsicons und dekorative Vektorelemente.
- **WebP** ist das bevorzugte Rasterformat für Banner und Webdarstellung.
- **PNG** wird dort zusätzlich vorgehalten, wo Transparenz, PWA-Manifest, Social-/Drittsysteme oder hohe Kompatibilität dies erfordern.
- **ICO** wird ausschließlich für das klassische Browser-Favicon erzeugt.
- Druckfähige Ableitungen werden aus den SVG-Masterdateien erzeugt; keine getrennt gepflegte zweite Gestaltung.

## Verbindliche Exporte

### Logo

- horizontal: SVG + PNG transparent, mindestens 1600 px Breite
- kompakt/gestapelt: SVG + PNG transparent, mindestens 1200 px Breite
- monochrom: SVG + PNG transparent, mindestens 1200 px Breite

### Banner

Es gibt zwei verbindliche Bannerkompositionen:

1. **Mobile/PWA:** kompakte Wortmarke plus reduzierte Illustration; platzsparend, aber nicht bildlos.
2. **Tablet/Desktop:** flache Split-Komposition; Wortmarke, Claim und Erklärung links, Illustration rechts. Das Banner darf auf großen Bildschirmen nicht unnötig hoch werden.

Exporte:

- mobile: SVG + WebP; Referenzbreite 1080 px
- wide: SVG + WebP; Referenzbreite 1920 px

### PWA/Favicon

- 192 × 192 PNG
- 512 × 512 PNG
- maskable 192 × 192 PNG
- maskable 512 × 512 PNG
- monochrome SVG
- favicon.ico mit üblichen Größen

### Social Preview

- 1200 × 630 px PNG und WebP

## Inhaltliche Gestaltungsregeln

- Öffentlicher Produktname immer **„Feldkirchen im Blick“**; `FIB` nur intern bzw. nach Einführung auf „Über Feldkirchen im Blick“.
- Claim: **„Mehr Überblick. Besser verstehen.“**
- Dreiklang **„Informieren · Verstehen · Nachfragen“** bleibt als sekundäre Kommunikationsform verfügbar und muss nicht im Banner erscheinen.
- Rathausdarstellung: charakteristischer linker Gebäudeteil, Ziegelbau ohne weiße Fassadeneinfassung, Pultdach erkennbar, **vier Fahnenmasten** vor der Fassade und über das Gebäude hinausragend.
- Kirche gehört zur Bildmarke; der Maibaum gehört zum Logo, nicht zum Banner.
- Sonnenblumenblätter sind der visuelle rote Faden; bei „Neues“ werden reduzierte Halbkreis-Strahlen verwendet, keine volle Sonne.
- Banner-Hintergrund verwendet keine Bergsilhouette; nur abstrakte weiche Flächen sowie Himmel-/Wolkenformen.
- Primärnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- „Im Blick“ verwendet das Auge.
- Link zur GRÜNEN-Homepage darf das Sonnenblumenlogo tragen und bevorzugt eine ruhige grüne Fläche. Er erscheint beim direkten/PWA-Einstieg, aber **nicht**, wenn Feldkirchen im Blick bereits aus der GRÜNEN-Homepage heraus geöffnet wurde.
- Blau ist funktionale Akzentfarbe. Große Marken- oder Bannerflächen bleiben grün/hell; Claim oder einzelne Informationshinweise dürfen gezielt blau hervorgehoben werden, sofern die Gesamtwirkung ruhig bleibt.

## Versionsregel

Änderungen an Masterassets und Designregeln werden gemeinsam versioniert. Bei einer visuellen Änderung ist zu prüfen, ob `docs/Visuelle-Identitaet-und-Bildkonzept.md` ebenfalls angepasst werden muss.

## Status

Die Struktur und Exportanforderungen sind verbindlich. Die finalen produktionsfähigen Einzeldateien werden aus der freigegebenen Gestaltung erzeugt und unter den oben festgelegten Dateinamen abgelegt.
