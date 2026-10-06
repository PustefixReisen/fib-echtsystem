# ADR-004 – Suche und RAG

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB benötigt drei unterschiedliche Suchsituationen:

1. öffentliche Suche für Besucher,
2. interne Suche für Redaktion und FIB-Chat,
3. kontextbezogene Retrieval-Funktionen für KI/RAG.

Diese Anforderungen sind ähnlich, aber nicht identisch. Eine einheitliche „alles über Vektorsuche“-Lösung wäre unnötig komplex und würde strukturierte FIB-Beziehungen entwerten.

## Entscheidung

FIB verwendet eine **mehrstufige Sucharchitektur** mit dem Prinzip:

> **Struktur vor Text, Text vor Semantik.**

Vektorsuche ist eine ergänzende Technik, keine Grundvoraussetzung für jede Suche.

## 1. Öffentliche Suche

Die öffentliche Suche arbeitet ausschließlich auf dem veröffentlichten K0-Stand.

Beim Static Build wird ein öffentlicher Suchindex erzeugt. Er enthält nur Daten, die ohnehin öffentlich sind, insbesondere:

- Titel,
- Teaser/Kurztext,
- relevante veröffentlichte Textfelder,
- Objekttyp,
- Datum/Aktualität,
- Kategorien/Orte,
- stabile öffentliche URL,
- ggf. weitere öffentliche Filtermerkmale.

Die Suche kann dadurch im Browser bzw. aus statischen Suchartefakten funktionieren, ohne direkten Zugriff auf Supabase.

Für das MVP ist für die öffentliche Suche **keine Vektorsuche erforderlich**.

## 2. Interne strukturierte Suche

Redaktion und FIB-Chat nutzen `search_fib_context` bzw. darauf aufbauende Fachfunktionen.

Die interne Suche kombiniert zunächst:

1. **explizite fachliche Beziehungen** – Ereignis, Vorgang, Thema, Sitzung/TOP, Bezugsobjekte, Quellen/Fundstellen, Beobachtungsaufträge usw.,
2. **strukturierte Filter** – Status, Datum, Typ, Schutzklasse, Rollen-/Zugriffsrechte,
3. **PostgreSQL-Volltextsuche** für Textfelder.

Die Schutzklasse und Berechtigung werden vor Ausgabe der Treffer berücksichtigt.

## 3. RAG / KI-Kontextbeschaffung

RAG bedeutet in FIB nicht, dass beliebige Dokumente ungefiltert an ein Sprachmodell gegeben werden.

Die Kontextbeschaffung erfolgt gestuft:

```text
Fachlicher Ausgangskontext
   ↓
explizite FIB-Beziehungen
   ↓
strukturierte Filter / Zeit / Status / Schutzklasse
   ↓
Volltextsuche
   ↓
optional semantische Suche
   ↓
begrenzter, quellengebundener KI-Kontext
```

Dadurch werden bekannte fachliche Beziehungen höher gewichtet als bloße semantische Ähnlichkeit.

## 4. Semantische Suche / Vektoren

Supabase/PostgreSQL mit `pgvector` kann semantische oder hybride Suche technisch bereitstellen. Sie wird für FIB jedoch nur dort eingeführt, wo Tests einen messbaren Mehrwert zeigen.

Geeignete spätere Einsatzfälle können sein:

- Auffinden sprachlich anders formulierter, aber sachlich ähnlicher Fundstellen,
- Unterstützung bei Quellen-/Ereignisentdeckung,
- Suche in längeren unstrukturierten Dokumenten,
- RAG-Fallback, wenn strukturierte Beziehungen und Volltextsuche nicht ausreichen.

Nicht vorgesehen ist:

- Embedding jeder Datenbankzeile nur „weil es möglich ist“,
- Ersetzen expliziter FIB-Beziehungen durch Ähnlichkeitssuche,
- direkte semantische Suche über K2-Daten ohne Schutzklassenprüfung,
- automatische fachliche Zuordnung allein aufgrund eines Vektorscores.

## 5. Hybrid Search

Wenn semantische Suche eingeführt wird, soll für relevante Anwendungsfälle grundsätzlich **hybride Suche** geprüft werden: Volltexttreffer plus semantische Treffer, kombiniert in einem gemeinsamen Ranking.

Dies reduziert das Risiko, dass exakte Namen, Beschlussnummern, Straßen oder Fachbegriffe durch eine rein semantische Suche schlechter gefunden werden.

## 6. Embeddings und Modellunabhängigkeit

Embeddings sind abgeleitete technische Suchdaten.

Deshalb gilt:

- Quelltext/Fachobjekt bleibt die fachliche Wahrheit,
- Embeddings dürfen jederzeit neu erzeugt werden,
- das Datenmodell hängt nicht von einem bestimmten Embedding-Modell ab,
- Embedding-Modell und Dimension werden konfigurierbar behandelt,
- Wechsel des Modells darf keine fachliche Migration erzwingen,
- Schutzklasse der zugrunde liegenden Inhalte gilt mindestens auch für Embeddings und Suchindex.

## 7. Öffentliche und interne Indizes bleiben getrennt

Der öffentliche Suchindex enthält ausschließlich K0.

Interne Such-/RAG-Indizes dürfen K1/K2 nur entsprechend Berechtigung und Schutzklasse verarbeiten.

Es gibt keinen gemeinsamen Index, aus dem lediglich per Frontend „versteckt“ wird.

## 8. Konsequenzen

### MVP verbindlich

- öffentlicher statischer K0-Suchindex,
- interne strukturierte Suche,
- PostgreSQL-Volltextsuche,
- RAG auf Basis von Fachbeziehungen + Filtern + Volltext,
- klare Schutzklassentrennung.

### Optional nach Qualitätstest

- pgvector,
- semantische Suche,
- hybride Suche,
- Embeddings für ausgewählte Inhalte.

## Begründung

Supabase/PostgreSQL unterstützt sowohl Volltextsuche als auch `pgvector` und hybride Suche. Für FIB ist aber die fachliche Struktur bereits sehr reichhaltig. Deshalb soll Semantik ergänzen, nicht die vorhandene Wissensstruktur ersetzen.

## Abgrenzung

Die konkrete Bibliothek für den statischen öffentlichen Suchindex, die Gewichtung einzelner Felder und ein mögliches Embedding-Modell werden erst in der Umsetzung bzw. nach Qualitätsmessung festgelegt.
