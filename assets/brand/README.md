# Feldkirchen im Blick – Markenassets

Dieser Ordner enthält die verbindlichen Produktionsassets und die freigegebenen visuellen Referenzen für **Feldkirchen im Blick**.

Maßgebliche fachliche Quelle für Gestaltung, Einsatzregeln, Farben, Typografie und responsive Nutzung ist:

`docs/Visuelle-Identitaet-und-Bildkonzept.md`

## Produktionsassets

### `logo/`

Freigegebene Rasterreferenzen des Logo-Systems:

- `fib-logo-primary-approved.png` – Primärlogo
- `fib-logo-compact-approved.png` – Kompaktlogo
- `fib-logo-monochrome-approved.png` – monochrome Variante

Die Dateien wurden visuell geprüft. Eine spätere echte Vektorisierung darf die freigegebene Gestaltung nicht neu interpretieren.

### `banner/`

- `fib-banner-illustration-approved.png` – finale Illustration für den responsiven Startseitenbanner

Der produktive Banner ist **kein zusammengesetztes Bild**. Text und Illustration werden in der Anwendung getrennt aufgebaut:

- Tablet/Desktop: Text links, Illustration rechts
- Smartphone/PWA: Text als UI-Text mit hellem halbtransparentem Overlay über der tiefer positionierten Illustration

### `icons/`

Produktive SVG-Master:

- `meldung.svg` – verbindliches Icon für das fachliche Objekt **Meldung**: aufgeschlagene Zeitung; wird im Redaktionssystem und im Besuchersystem verwendet
- `nav-neues.svg` – identisches Meldungs-Symbol für die Besuchernavigation **Neues**; bleibt aus Kompatibilitätsgründen als Navigationsasset bestehen
- `nav-im-blick.svg` – Auge
- `nav-sitzungen.svg` – Personengruppe/Gremium
- `nav-suche.svg` – Lupe
- `sonnenblumenblaetter.svg` – grafisches Grundelement

Vorhandene `*-approved.png`-Dateien dienen als visuelle Rasterreferenzen, nicht als bevorzugtes Web-Masterformat. Bei einer ausdrücklich beschlossenen Icon-Änderung ist die SVG-Masterdatei maßgeblich; zugehörige Rasterreferenzen müssen anschließend auf denselben Stand gebracht werden.

### `pwa/`

- `fib-pwa-icon-approved.png` – freigegebene Rasterreferenz des PWA-Icons

Noch zu erzeugen sind die produktiven PWA-Exports, mindestens 192×192 und 512×512 px sowie maskable Varianten.

### `elements/`

- `sonnenblumenblaetter-approved.png` – Rasterreferenz des verbindenden grafischen Elements

## Referenzen

`reference/` enthält Styleguide- und Mockup-Referenzen. Diese Dateien dokumentieren die gewünschte Gesamtwirkung, sind aber nicht unmittelbar als zusammengesetzte Produktionsassets zu verwenden.

Dazu gehören insbesondere:

- `styleguide-approved.png`
- `responsive-approved.png`
- `fib-banner-mobile-approved.png`
- `fib-banner-wide-approved.png`

## Arbeitsregel

Ein freigegebenes Asset wird nicht erneut gestalterisch verändert, solange keine ausdrückliche neue Designentscheidung getroffen wird. Technische Aufbereitung, Vektorisierung oder Exporte müssen gegen die freigegebene Referenz geprüft werden.
