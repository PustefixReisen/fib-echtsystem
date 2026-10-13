# Scripts

Technische Hilfsskripte, getrennt nach Zweck:

- `publish/` – Erzeugung/Prüfung öffentlicher Release-Artefakte,
- `deploy/` – Auslieferung auf Zielumgebungen,
- `maintenance/` – Backup, Wartung und kontrollierte Betriebsaufgaben.

Fachregeln gehören nicht in Skripte, sondern in die Fachservice-Schicht.

## Begrenzte Entwicklungsdatenübernahme

`development-data/build.py` erzeugt aus dem geprüften Snapshot das ausschließlich
anlegende SQL-Paket `data/development/demo-20261013/`. Es verbindet sich nicht mit
einer Datenbank. `test.mjs` prüft es in eingebettetem PostgreSQL; der zugehörige
CI-Workflow besitzt keine Produktivzugänge.

Ausführung, Schutzmaßnahmen, Live-Ergebnis und Roadmap-Ergänzung stehen in
[`docs/tests/Demonstrator-Entwicklungsdaten-2026-10-13.md`](../docs/tests/Demonstrator-Entwicklungsdaten-2026-10-13.md).
Das Paket ist kein allgemeiner Import-/Reset-Service und wird nicht automatisch deployed.
