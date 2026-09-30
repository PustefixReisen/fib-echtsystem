# SEO und Auffindbarkeit – Feldkirchen im Blick (FIB)

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für Suchmaschinenoptimierung und technische Auffindbarkeit von FIB.

SEO unterstützt die fachliche Struktur, bestimmt sie aber nicht.

## 2. Ziel

FIB soll vor allem bei konkreten lokalen Themen, Entscheidungen und Sachfragen rund um Feldkirchen auffindbar sein.

Leitfrage:

> **Findet jemand FIB, wenn er zu einem konkreten Feldkirchner Sachverhalt nach Informationen sucht?**

## 3. Seitentypen und Rollen

### Startseite

Einstieg in FIB insgesamt; aktuelle Meldungen, Themen/Vorgänge, Sitzungen und Erklärung des Angebots.

### Meldung

SEO-Ziel für ein konkretes berichtenswertes Ereignis oder eine aktuelle Entwicklung.

### Vorgang

Dauerhafter Wissensknoten für einen konkreten länger laufenden Sachverhalt. Bei vielen Meldungen zum selben Sachverhalt soll der Vorgang bei allgemeinen Suchanfragen bevorzugt erschlossen werden.

### Thema

Dauerhafter Wissensknoten für eine übergeordnete Fragestellung und deren Zusammenhänge.

### Sitzung

Auffindbarkeit konkreter Gremiensitzungen, TOPs und formal dokumentierter Beratungs-/Entscheidungsstände.

## 4. Stabile URLs

Öffentliche Objekte erhalten stabile, lesbare Direkt-URLs. Interne IDs bleiben stabil im Datenmodell, müssen aber nicht sichtbar Teil der URL sein.

Vorgesehenes Grundschema:

- `/meldungen/<slug>`
- `/vorgaenge/<slug>`
- `/themen/<slug>`
- `/sitzungen/<gremium>-<datum>`

URL-Änderungen erhalten Weiterleitungen. Fachlich relevante Aktualisierungen erzeugen nicht automatisch neue URLs.

## 5. Seitentitel und Meta-Description

Jede indexierbare Seite erhält:

- eindeutigen Seitentitel,
- eindeutige Meta-Description,
- natürlichen Feldkirchen-Bezug, sofern sachlich passend,
- keine Clickbait-Formulierungen.

Technische Fallbacks werden aus strukturierten Feldern erzeugt; KI darf sprachliche Varianten vorschlagen.

## 6. Überschriften und Semantik

- genau eine H1 je Seite,
- semantisch korrekte Überschriftenhierarchie,
- keine Überschriftsebenen nur für optische Gestaltung,
- strukturierte, zugängliche HTML-Ausgabe.

Die konkrete sichtbare Informationsarchitektur richtet sich nach `docs/UX-und-Informationsarchitektur.md`.

## 7. Interne Verlinkung

Links werden möglichst aus strukturierten Beziehungen erzeugt.

Insbesondere:

- Meldung → Vorgang/Thema/Sitzung/Bezugsobjekt,
- Vorgang → Meldungen/Themen/Sitzungen,
- Thema → prägende Vorgänge/Meldungen/Sitzungen,
- Sitzung/TOP → zugehörige Meldungen/Vorgänge/Themen.

Linktexte sollen beschreibend sein.

## 8. Canonical und Dubletten

Jede indexierbare Seite erhält eine kanonische URL.

Filter-, Such-, Druck- oder Share-Varianten sind nicht automatisch eigenständige indexierbare Inhalte.

Ein Sachverhalt wird nicht aus SEO-Gründen doppelt angelegt.

## 9. Strukturierte Daten

Soweit semantisch korrekt, werden strukturierte Daten technisch erzeugt, insbesondere:

- WebSite / Organization für das Gesamtangebot,
- Article/NewsArticle für Meldungen,
- WebPage/CollectionPage für Vorgänge und Themen,
- BreadcrumbList,
- Event nur für Sitzungen, wenn die Semantik tatsächlich passt.

Korrekte Semantik ist wichtiger als maximale Auszeichnung.

## 10. Social Preview

Für öffentliche Seiten werden Open-Graph-/Social-Metadaten erzeugt:

- Titel,
- Beschreibung,
- kanonische URL,
- Typ,
- geeignetes Bild.

Ist kein individuelles Bild vorhanden, wird ein passendes neutrales FIB-Standardmotiv aus dem visuellen Bildkonzept verwendet.

## 11. Aktualisierungen

- neues eigenständiges Ereignis → neue Meldung,
- fachliche Fortschreibung desselben Ereignisses → bestehende Meldung aktualisieren,
- Vorgang/Thema → aktuellen Wissensstand fortschreiben.

Ursprungsdatum und fachliches Aktualisierungsdatum bleiben getrennt.

## 12. Suche und Suchmaschinen

Die interne FIB-Suche und externe Suchmaschinen verfolgen unterschiedliche Ziele, greifen aber auf dieselbe strukturierte Fachlichkeit zurück.

Aliase, Bezugsobjekte und Beziehungen sollen auch dann Auffindbarkeit ermöglichen, wenn der gesuchte Begriff nicht in jedem Text wörtlich vorkommt.

## 13. Sitemap und Indexierung

Das Echtsystem erzeugt mindestens:

- XML-Sitemap für indexierbare öffentliche Inhalte,
- Robots-Regeln,
- Canonical-Tags,
- nachvollziehbare Regeln für nicht indexierbare technische Ansichten.

Nicht freigegebene oder interne Redaktionsinhalte werden nicht indexiert.

## 14. Modellunabhängigkeit

URL-Schema, Canonical, Sitemap, strukturierte Beziehungen, Indexierungsstatus und technische Metadaten-Fallbacks sind modellunabhängige Geschäftsregeln.

KI kann Formulierungen unterstützen, entscheidet aber nicht über die technische Grundstruktur.

## 15. Abgrenzung

- Fachliche Objektlogik: `docs/Fachkonzept.md`
- UX: `docs/UX-und-Informationsarchitektur.md`
- Kommunikation/Reichweite: `docs/Marketing-und-Kommunikation.md`

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 30.09.2026 | Demonstrator-Konzept auf aktuelle Meldungs-/Vorgangs-/Themenlogik des Echtsystems überführt; veraltete Themen-als-einzige-Dauerseiten-Logik korrigiert. |
