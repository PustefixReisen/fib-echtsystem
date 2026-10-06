# Supabase-Schema – U1.2

## Zweck

Dieses Verzeichnis enthält die technische SQL-Arbeitsgrundlage für das FIB-Datenbankschema, solange noch kein eigenes FIB-Supabase-Entwicklungsprojekt vorhanden ist.

## Verbindliche Arbeitsweise

- Fachliche Quelle bleibt `docs/Datenmodell.md` und die dort referenzierten Teilmodelle.
- SQL in `supabase/schema/` ist technische Ableitung, keine zweite fachliche Quelle.
- Dateien in `supabase/schema/` sind **noch keine produktiven Migrationen**.
- Sobald ein eigenes FIB-Entwicklungsprojekt bereitsteht, werden Änderungen zunächst dort ausgeführt und geprüft.
- Vor Übernahme in `supabase/migrations/` werden Security-/Performance-Advisors geprüft.
- Die eigentliche Migration wird mit dem Supabase CLI erzeugt; Migrationsdateinamen werden nicht manuell erfunden.
- Danach wird die Migration gegen ein leeres bzw. definiertes Ziel reproduzierbar getestet.

## Sicherheitsgrundsatz

FIB nutzt im `public`-Schema standardmäßig:

- aktivierte RLS für jede Tabelle,
- keine pauschalen Rechte für `anon` oder `authenticated`,
- serverseitige Fachservices als regulären fachlichen Zugriffsweg,
- explizite Grants nur für tatsächlich benötigte technische Rollen.

## Aktueller Stand

`core.sql` enthält den ersten technischen Kern für:

- Ereignisse,
- Meldungen,
- Vorgänge,
- Themen,
- Ereignis↔Vorgang,
- Vorgang↔Thema,
- direktes Ereignis↔Thema,
- Quellen,
- Fundstellen,
- Fundstellen↔Ereignis als Belegbeziehung.

Noch nicht enthalten sind insbesondere:

- Benutzer-/Rollenabbildung,
- Sitzungen/TOPs/Beschlüsse,
- Wirkungen/Perspektiven/strukturierte Bewertung,
- offene Fragen und Beobachtungsaufträge,
- Rechercheläufe/AI Tasks,
- Referenzwissen,
- „Mehr wissen?“,
- Bilder/Dateien,
- Versionierungs-/Auditobjekte,
- konkrete RLS-Policies für spätere Fachservice-Endpunkte.
