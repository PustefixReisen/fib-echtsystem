# Visuelle Identität und Bildkonzept – Feldkirchen im Blick

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 2.1 | 01.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Verbindlichkeit

Dieses Dokument ist die verbindliche Primärquelle für die visuelle Identität von **Feldkirchen im Blick**. Es ergänzt `docs/UX-und-Informationsarchitektur.md` und `docs/Marketing-und-Kommunikation.md`.

Die produktionsfähigen Masterassets liegen unter `assets/brand/`. Das dortige `README.md` definiert Dateinamen, Formate und Exportgrößen.

## 2. Visuelle Grundhaltung

Feldkirchen im Blick wirkt:

- klar und ruhig,
- bürgernah und zugänglich,
- sachlich statt kampagnenhaft,
- lokal verankert,
- modern und PWA-tauglich,
- transparent und vertrauenswürdig,
- erkennbar an die GRÜNEN angeschlossen, aber als eigenständiges Informationsprodukt.

Große dunkle Flächen, aggressive Kontraste, überladene Illustrationen und dekorative Effekte ohne Informationswert werden vermieden.

## 3. Logo-System

### 3.1 Bildmarke

Die finale Bildmarke verbindet:

- das **Rathaus Feldkirchen** links,
- die **Kirche** rechts,
- Bäume und eine sehr reduzierte Boden-/Wasserlinie,
- drei gelbe abstrahierte Sonnenblumenblätter.

Der Maibaum ist **nicht** Bestandteil der finalen Bildmarke.

### 3.2 Rathausdarstellung

Das Rathaus orientiert sich an der tatsächlichen Architektur und wird in allen Markenassets konsistent dargestellt:

- dominanter linker Gebäudeteil,
- höher als breit,
- charakteristisches **Pultdach**,
- Ziegelfassade ohne weiße Einfassung an Dach oder Gebäudekante,
- Gebäudekante nur durch eine feine Haarlinie gekennzeichnet,
- große vertikale Fensterzone,
- Galerie-/Arkadenwirkung im Erdgeschoss,
- **vier Fahnenmasten**, die über das Gebäude hinausragen und dadurch klar als vorgelagerte Masten erkennbar bleiben,
- ruhige, leicht seitliche Perspektive, keine Froschperspektive.

### 3.3 Varianten

- **Primärlogo horizontal:** Bildmarke links, Wortmarke rechts; bevorzugte Standardform außerhalb des Startseitenbanners.
- **Kompaktlogo:** Bildmarke oberhalb der Wortmarke für quadratischere Flächen.
- **Monochrom:** einfarbige Sonderanwendung.
- **Bildmarke/Icon-only:** PWA, Favicon und sehr kleine Anwendungen.

Auf der **Startseite** wird das vollständige Bildlogo nicht zusätzlich neben dem Banner wiederholt. Der Banner übernimmt dort die Markenfunktion. Das Bildlogo wird vor allem dort eingesetzt, wo kein Banner erscheint.

## 4. Banner / Hero

Es gibt zwei verbindliche responsive Varianten.

### 4.1 Handy / PWA

Kompakter Banner mit:

- Wortmarke „Feldkirchen im Blick“,
- kleiner, platzsparender Illustration,
- Rathaus, Kirche und Sonnenblumenblättern,
- geringer Bauhöhe.

Das Bannerbild entfällt auf dem Handy **nicht**, sondern wird nur deutlich verkleinert.

### 4.2 Tablet / Desktop

Der Tablet-/Desktop-Banner wird **nicht als ein einziges vollflächiges Bild** umgesetzt, sondern als echter responsiver **Zwei-Spalten-Banner**.

**Linke Spalte:**

- Wortmarke „Feldkirchen im Blick“,
- Claim „Mehr Überblick. Besser verstehen.“,
- kurzer Erklärungstext.

**Rechte Spalte:**

- ausschließlich die freigegebene Bannerillustration,
- keine Wortmarke und kein Text innerhalb der Grafik,
- Illustration räumlich klar begrenzt.

Verbindliche responsive Regeln:

- Gesamtcontainer mit definierter Maximalbreite; Richtwert **1280 px**,
- zentrierte Darstellung mit `margin-inline: auto`,
- unterhalb der Maximalbreite flüssige Breite bis `width: 100%`,
- oberhalb der Maximalbreite **keine weitere proportionale Vergrößerung**,
- zusätzlicher Platz auf sehr breiten Bildschirmen bleibt als ruhiger Seitenraum erhalten,
- Tablet-Richtwert für die Spaltenaufteilung etwa **48 % Text / 52 % Illustration**,
- Desktop-Richtwert etwa **45 % Text / 55 % Illustration**,
- die Illustration nutzt `object-fit: contain` bzw. ein gleichwertiges Verhalten und wird nicht verzerrt,
- die Bannerhöhe ergibt sich aus dem Inhalt und bleibt bewusst flach,
- keine feste Pixelhöhe, die auf unterschiedlichen Text- oder Schriftgrößen zu Überlauf führt,
- auf schmalen Bildschirmen erfolgt der Wechsel zur separaten Mobile-/PWA-Variante.

Technische Referenz:

```css
.fib-hero {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 45fr) minmax(0, 55fr);
  align-items: center;
}

.fib-hero__visual img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

@media (max-width: 900px) {
  .fib-hero {
    grid-template-columns: minmax(0, 48fr) minmax(0, 52fr);
  }
}
```

Die konkreten Breakpoints werden bei der Frontend-Implementierung anhand der tatsächlichen Inhaltsbreite und Lesbarkeit validiert; maßgeblich ist das Verhalten, nicht ein einzelner Gerätewert.

### 4.3 Bildsprache des Banners

Das Banner darf keine Landschaft suggerieren, die für Feldkirchen untypisch ist. Insbesondere entstehen **keine Bergsilhouetten**.

Hintergründe bestehen nur aus:

- hellen abstrakten Formen,
- weichen Wolken-/Himmelformen,
- reduzierten horizontalen Flächen.

Der Maibaum erscheint nicht im Banner.

## 5. Claim und Bannertext

Finaler Claim:

> **Mehr Überblick. Besser verstehen.**

Erklärungstext:

> **Relevante Informationen aus Rathaus, Presse und weiteren Quellen – verständlich zusammengeführt und in ihren Zusammenhängen erklärt.**

Der Claim darf im Banner stärker hervorgehoben werden. Dafür kann das funktionale Akzentblau verwendet werden, solange die Gesamtwirkung ruhig bleibt und Blau keine dominante Markenfläche bildet.

Der Dreiklang

> **Informieren · Verstehen · Nachfragen**

bleibt als sekundäres Kommunikationselement verfügbar, ist aber **kein Pflichtbestandteil des Banners**. Er kann z. B. in Kommunikationsmaterial, Styleguide, „Über Feldkirchen im Blick“ oder einzelnen Kampagnenflächen verwendet werden.

## 6. Sonnenblumenblätter

Die drei gelben Sonnenblumenblätter sind der **grafische rote Faden**.

Sie werden eingesetzt:

- in der Bildmarke,
- im Banner,
- im PWA-Icon,
- als Grundlage für das Navigationssymbol **„Neues“**,
- als kleine Abschnitts- oder Kommunikationsakzente.

Sie werden nicht inflationär verwendet. Die Blätter stehen für Offenheit, positive Entwicklung und die erkennbare Verbindung zu BÜNDNIS 90/DIE GRÜNEN.

## 7. Farben

Verbindliche Rollen:

| Rolle | Richtwert | Verwendung |
|---|---|---|
| Primärgrün | `#0F6B4F` | Marke, aktive Navigation, wichtige Buttons |
| Dunkelgrün | `#064E40` | Wortmarke, starke Headlines |
| Mintgrün | `#BFE3D1` | ruhige Flächen, Hintergründe |
| Akzentblau | `#7ECBF0` / dunklere lesbare Textvariante | Links, Fokus, Information, ausgewählte Hervorhebung |
| Ziegelrot | `#C86A3F` | Rathaus / lokale Architekturreferenz |
| Sonnenblumengelb | `#FFD84D` | Blätter, „Neues“, gezielte Akzente |
| Warmes Off-White | `#FAF8F3` | Haupt- und Leseflächen |

Blau ist **keine dominante Markenfarbe**. Es wird gezielt für Links, Interaktion, Informationszustände und einzelne kommunikative Hervorhebungen eingesetzt.

## 8. Typografie

Gestalterische Referenzschrift ist **Inter** bzw. eine technisch gleichwertige, gut lesbare Sans-Serif-Familie.

Verbindliche Prinzipien:

- hohe mobile Lesbarkeit,
- klare Hierarchie,
- großzügige Zeilenabstände,
- normaler Fließtext ohne kampagnenhafte Versal-/Schrägtypografie,
- technische Einbindung nur mit geklärter Lizenz bzw. geeigneter Webfont-/Systemfont-Strategie.

Schriftdateien selbst gehören nicht in die Markenasset-Ablage.

## 9. Navigation und Icons

Hauptnavigation:

- **Neues** – gelbe Strahlen/Blätter über einem angedeuteten Halbkreis; keine volle Sonne,
- **Im Blick** – Auge,
- **Sitzungen** – Personengruppe/Gremium,
- **Suche** – Lupe.

Die Icons sind als eigenständige SVG-Master unter `assets/brand/icons/` abgelegt. Information darf nie ausschließlich über Farbe vermittelt werden; Icon und Textlabel gehören in der Navigation zusammen.

## 10. Sekundärnavigation

Inhaltliche Hauptnavigation und organisatorische Navigation bleiben getrennt.

### Smartphone

Organisatorische Punkte erscheinen im Menü, insbesondere:

- Über Feldkirchen im Blick,
- Newsletter,
- Kontakt,
- Benachrichtigungen/Einstellungen,
- Datenschutz / Impressum soweit erforderlich.

### Tablet / Desktop

Die organisatorische Navigation kann als dezente Textnavigation im oberen rechten Bereich erscheinen.

## 11. Link zur GRÜNEN-Homepage

Beim direkten Einstieg in Feldkirchen im Blick – z. B. PWA, Direktlink, QR-Code oder Suchmaschine – erscheint deutlich, aber untergeordnet:

> **← Zur Website der GRÜNEN in Feldkirchen**

Gestaltung:

- ruhiger grüner Hintergrund,
- Sonnenblumenlogo der GRÜNEN darf enthalten sein,
- weiße bzw. ausreichend kontrastierende Schrift,
- keine konkurrierende zweite Hauptnavigation.

Wird Feldkirchen im Blick **bereits von der Website der GRÜNEN Feldkirchen aus aufgerufen bzw. dort eingebunden**, entfällt dieser Rücksprung, weil die übergeordnete Website-Navigation bereits sichtbar ist.

## 12. Responsive Screenprinzipien

### Smartphone

- einspaltig,
- kompakter Banner mit kleiner Illustration,
- Rücksprung zur GRÜNEN-Homepage nur bei direktem Einstieg,
- Hauptnavigation dauerhaft am unteren Bildschirmrand,
- Sekundärnavigation im Menü.

### Tablet

- echter responsiver Zwei-Spalten-Banner,
- zwei- bzw. mehrspaltige Inhaltsbereiche wo sinnvoll,
- Hauptnavigation gut sichtbar,
- Sekundärnavigation als Menü oder dezente Kopfzeile.

### Desktop

- echter responsiver Zwei-Spalten-Banner mit begrenzter Maximalbreite,
- größere Breite für mehrere Inhaltsblöcke nebeneinander,
- organisatorische Navigation oben rechts,
- bei Einbettung in die GRÜNEN-Homepage kein zusätzlicher Rücksprung-Link.

## 13. Beispielansichten

Die Styleguide-Referenzen zeigen exemplarisch:

- Startseite,
- Listenansicht,
- Detailansicht,
- mobile PWA,
- Tablet,
- Desktop / Einbettung in die GRÜNEN-Homepage.

Mockups konkretisieren das Design, überschreiben aber nicht die fachlichen UX-Regeln aus `docs/UX-und-Informationsarchitektur.md`.

## 14. Bildsprache für Inhalte

Reale, inhaltlich passende Feldkirchen-Fotos haben Vorrang vor allgemeinen Standardmotiven.

Geeignete Motive umfassen Rathaus/Gemeindezentrum, Kirche, Ortsbild, Mobilität, Natur, Infrastruktur und konkrete Orte eines Vorgangs. Bilder müssen sachlich passen, lokale Wiedererkennbarkeit bieten und dürfen keine falsche inhaltliche Nähe erzeugen.

## 15. Produktionsassets

Verbindlicher Ablageort:

`assets/brand/`

Unterordner:

- `logo/`
- `banner/`
- `icons/`
- `pwa/`
- `social/`
- `reference/`

SVG ist grundsätzlich das Masterformat für Logo, Banner und Icons. Rasterformate werden daraus reproduzierbar exportiert.

Für den Desktop-/Tablet-Banner sind Text und Illustration **getrennte technische Bestandteile**. Ein zusammengesetztes Rasterbild darf als Styleguide-/Mockup-Referenz erhalten bleiben, ist aber **nicht die bevorzugte Produktionsform** für die Web-App.

PWA-Rastergrößen umfassen mindestens 192×192 und 512×512 px sowie maskable Varianten. Social Preview: 1200×630 px.

## 16. Öffentlicher Name

Öffentlich wird grundsätzlich **„Feldkirchen im Blick“** ausgeschrieben. Die Abkürzung **FIB** ist intern. Auf der Seite **„Über Feldkirchen im Blick“** kann sie einmal als Kurzform eingeführt und dort verwendet werden.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 2.1 | 01.10.2026 | Tablet-/Desktop-Banner technisch als echter responsiver Zwei-Spalten-Banner festgelegt: Text links, Illustration rechts, maximale Containerbreite, keine unbegrenzte Skalierung auf breiten Bildschirmen, getrennte Produktionsbestandteile. |
| 2.0 | 01.10.2026 | Visuelles System finalisiert: Rathausdarstellung mit Pultdach und vier Fahnenmasten, Kirche und Sonnenblumenblätter; Maibaum aus finaler Bildmarke entfernt; zwei responsive Bannerformen, wolken-/abstrakter Hintergrund ohne Bergwirkung, finaler Claim, sekundärer Dreiklang, Farbrollen, Navigation, GRÜNEN-Rücksprung und Produktionsasset-Struktur verbindlich festgelegt. |
| 1.1 | 01.10.2026 | Banner-/Landingpage-Text als Arbeitsfassung ergänzt. |
| 1.0 | 01.10.2026 | Eigenständige visuelle Primärquelle angelegt. |