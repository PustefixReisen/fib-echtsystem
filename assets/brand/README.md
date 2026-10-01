# FIB Markenassets

Dieser Ordner ist die verbindliche Ablage für produktionsfähige grafische Assets von **Feldkirchen im Blick**.

Die fachlichen und gestalterischen Regeln stehen in `docs/Visuelle-Identitaet-und-Bildkonzept.md`. Dieser Ordner enthält die daraus abgeleiteten Einzeldateien für Web, PWA, Social Preview und Druck.

## Grundsatz

**Keine Grafik wird durch eine vereinfachte manuelle Nachzeichnung ersetzt.** Maßgeblich ist die im Styleguide freigegebene Gestaltung. Neue Masterdateien werden erst dann als produktionsfähig eingecheckt, wenn sie visuell gegen diese Referenz geprüft wurden.

Die am 01.10.2026 zunächst erzeugten SVG-Nachzeichnungen für Logo, Banner und PWA-Icon entsprachen der freigegebenen Gestaltung nicht ausreichend und wurden deshalb wieder entfernt.

## Zielstruktur

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

- **SVG ist das Ziel-Masterformat** für Logo, Bildmarke, Navigationsicons und dekorative Vektorelemente.
- SVG-Master werden nur freigegeben, wenn sie die bestätigte Referenzgrafik tatsächlich wiedergeben.
- **WebP** ist das bevorzugte Rasterformat für Banner und Webdarstellung.
- **PNG** wird zusätzlich für PWA, Social-/Drittsysteme und hohe Kompatibilität verwendet.
- **ICO** wird ausschließlich für das klassische Browser-Favicon erzeugt.

## Verbindliche Bannerkompositionen

1. **Mobile/PWA:** kompakte Wortmarke plus reduzierte Illustration; platzsparend, aber nicht bildlos.
2. **Tablet/Desktop:** flache Split-Komposition; Wortmarke, Claim und Erklärung links, Illustration rechts. Das Banner darf auf großen Bildschirmen nicht unnötig hoch werden.

## Inhaltliche Gestaltungsregeln

- Öffentlicher Produktname immer **„Feldkirchen im Blick“**; `FIB` nur intern bzw. nach Einführung auf „Über Feldkirchen im Blick“.
- Claim: **„Mehr Überblick. Besser verstehen.“**
- Dreiklang **„Informieren · Verstehen · Nachfragen“** bleibt als sekundäre Kommunikationsform verfügbar und muss nicht im Banner erscheinen.
- Rathausdarstellung: charakteristischer linker Gebäudeteil, Ziegelbau ohne weiße Fassadeneinfassung, Pultdach erkennbar, **vier Fahnenmasten** vor der Fassade und über das Gebäude hinausragend.
- Zur freigegebenen Bildmarke gehören **Rathaus, Kirche und Sonnenblumenblätter**. Der Maibaum ist kein Bestandteil der finalen Bildmarke und erscheint auch nicht im Banner.
- Sonnenblumenblätter sind der visuelle rote Faden; bei „Neues“ werden reduzierte Halbkreis-Strahlen verwendet, keine volle Sonne.
- Banner-Hintergrund verwendet keine Bergsilhouette; nur abstrakte weiche Flächen sowie Himmel-/Wolkenformen.
- Primärnavigation: **Neues | Im Blick | Sitzungen | Suche**.
- „Im Blick“ verwendet das Auge.
- Link zur GRÜNEN-Homepage darf das Sonnenblumenlogo tragen und bevorzugt eine ruhige grüne Fläche. Er erscheint beim direkten/PWA-Einstieg, aber **nicht**, wenn Feldkirchen im Blick bereits aus der GRÜNEN-Homepage heraus geöffnet wurde.
- Blau ist funktionale Akzentfarbe. Große Marken- oder Bannerflächen bleiben grün/hell; Claim oder einzelne Informationshinweise dürfen gezielt blau hervorgehoben werden, sofern die Gesamtwirkung ruhig bleibt.

## Qualitätsregel für Grafikassets

Vor dem Einchecken eines Logo-, Banner- oder PWA-Masters wird geprüft:

1. stimmt die Rathausform einschließlich Pultdach und vier Fahnenmasten,
2. stimmt die Kirche,
3. stimmen Zahl, Form und Position der Sonnenblumenblätter,
4. stimmen Proportionen und Perspektive mit der freigegebenen Referenz überein,
5. enthält der Banner keine Bergsilhouette,
6. ist die responsive Komposition korrekt,
7. wurde keine zusätzliche oder vereinfachte Symbolik erfunden.

## Status

Die Designregeln und die Navigationsicons bleiben verbindlich. Die fehlerhaften rekonstruierten SVG-Master für **Logo, Banner und PWA-Icon wurden entfernt**. Sie werden erst wieder eingecheckt, wenn die technische Masterdatei die freigegebene Gestaltung visuell korrekt reproduziert.
