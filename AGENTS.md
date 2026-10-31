# Arbeitsregeln – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 31.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Geltung zentraler Regeln

Für dieses Projekt gelten die zentralen Governance-Regeln aus dem Repository `PustefixReisen/pustivo`, insbesondere zu Dokumentationsstruktur, Dokumentenpflege, Projektgründung, Projektmoderation, Audit sowie Entwicklungs- und Entscheidungsprozess.

Zentrale Regeln werden hier nicht dupliziert.

## 2. Projektspezifische Arbeitsregeln

- Der Demonstrator ist Referenz, aber keine technische Produktivbasis.
- Vor Abschluss der Projektgründung wird keine eigentliche Anwendungsprogrammierung begonnen.
- Fachliche Parität zum dokumentierten Demonstrator ist Mindestanforderung.
- UI, Benutzerführung und Fachfunktionen dürfen gezielt verbessert werden.
- Jede UX-/Fachentscheidung wird auf Auswirkungen auf Datenmodell, Geschäftsregeln, Redaktion und Migration geprüft.
- Dauerhaft relevante Entscheidungen dürfen nicht nur im Chat verbleiben.
- Bei vorhandenem GitHub-Zugriff werden betroffene Projektdokumente unmittelbar fortgeschrieben.
- Roadmap und nächster Schritt werden nach wesentlichen Arbeitspaketen geprüft.
- Dauerhafte Architekturentscheidungen mit relevanten Alternativen werden als ADR dokumentiert.
- Produktive Zugangsdaten oder Schlüssel dürfen nicht im Repository oder in öffentlicher Dokumentation abgelegt werden.

## 3. Dokumentationsprinzip

> Ein Sachverhalt – eine verbindliche Quelle.

Vor einer verbindlichen Änderung ist zu prüfen, welche bestehende Quelle zuständig ist und ob andere Dokumente dadurch widersprüchlich oder veraltet werden.

## 4. Eigenständige Entwicklungsaufträge und Abnahme

Ergänzend gelten die zentralen Regeln aus `PustefixReisen/pustivo/docs/governance/Projektmoderation.md`, insbesondere **§6.3 KI-Entwicklungsaufträge und Auftragsautonomie**.

- Ein genehmigtes fachliches Arbeitspaket darf selbstständig in technische Schritte, Tests, Fehlerkorrekturen und PRs zerlegt werden; Routine-Zwischenschritte benötigen keine wiederholte Bestätigung.
- Vor Beginn aktuelle `main`-Version, offene PRs/Issues, zutreffende Fachhandbuch-Kapitel und Tests prüfen; laufende parallele Arbeiten nicht überschreiben.
- PRs und grüne CI-Prüfungen sind technische Nachweise, keine automatischen fachlichen Gesamtfreigaben.
- Der Abschlussbericht weist Akzeptanzfälle und Belege aus und unterscheidet isolierte Browser-Komponententests mit simuliertem Auth/API von echten authentifizierten Gesamt-App-Abläufen.
- Produktive Migrationen, Deployments, Cron-Aktivierungen, Secrets sowie Änderungen der gemeinsam mit Memorix genutzten Infrastruktur bleiben ausdrücklich gesondert freigabepflichtig.
- Interaktive UI-Vorschauen bei neuen komplexen Abläufen bevorzugt aus vorhandenen Wireframes/Komponenten ableiten. Keine neuen kostenpflichtigen Entwicklerwerkzeuge ohne belegten Bedarf.
- Nach 2–3 fachlichen FIB-Arbeitspaketen praktische Auswertung zu Nutzerinterventionen, Nacharbeit, Durchlaufzeit, Testbelegen und verfügbaren Kostenindikatoren durchführen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 31.10.2026 | Zentralen Standard zur KI-Auftragsautonomie, Gesamtabnahme und Erprobung für FIB verankert. |
| 1.0 | 29.09.2026 | Projektspezifische Arbeitsregeln und Verweis auf zentrale Governance angelegt. |
