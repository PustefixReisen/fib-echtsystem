# FIB – Entscheidungsorientierte Merge-Regel

Stand: 12.10.2026 – vom Projektverantwortlichen bestätigt.

## Grundsatz

Technische Entwicklung, CI-Prüfung und Merge erfolgen durch die KI eigenständig, wenn die Änderungen bestehende FIB-Festlegungen eindeutig umsetzen und keine wesentliche fachliche, sicherheitsrelevante oder wirtschaftliche Entscheidung erfordern. **Keine pauschale Benutzerfreigabe für jeden PR.**

## Eigenständig mergebar

- Wartung, Fehlerbehebung, Dokumentation, Tests, klar abgegrenzte technische Infrastrukturkorrekturen.
- Kleine UI-Korrekturen und Umsetzung bereits verbindlich beschlossener Gestaltungsregeln, soweit keine neue fachliche Navigation oder Arbeitslogik entschieden wird.
- Ausreichende Checks sind erfolgreich, Merge-Konflikte sauber gelöst, Auswirkungen auf bestehende Funktionen geprüft.
- Dokumentation und Bericht unterscheiden ausdrücklich *implementiert*, *CI erfolgreich*, *gemergt* und *nachweislich produktiv deployed*.

## Zustimmung vor dem Merge

- Wesentliche Veränderungen am FIB-Fachkonzept, den Freigabe-/Arbeitsabläufen, der Informationsarchitektur oder den redaktionellen Zuständigkeiten.
- Sicherheitsrelevante Berechtigungsänderungen, Auth-/MFA-Sicherheitsregeln, Änderungen mit Risiko für produktive Daten oder Datenschutz.
- Irreversible Aktionen, produktive Datenmigrationen und Löschvorgänge.
- Wesentliche Änderungen an Hosting, Datenhaltung, KI-Einsatz oder laufenden Kosten.
- Ungeklärte Mehrdeutigkeit, hohe Ausfallrisiken, fehlgeschlagene Qualitätsprüfungen.

## Preview und Deployment

Preview/Sichtprüfung wird bei sichtbaren oder riskanten UI-Änderungen nach Ermessen vorgesehen; es ist keine generelle Merge-Sperre für kleine Gestaltungsanpassungen mehr. Das etablierte FIB-Fachkonzept und dessen Primärdokumente werden durch diese Prozessregel nicht ersetzt.

**Wichtig:** Separates Preview-Verzeichnis bedeutet derzeit noch keine isolierte Supabase-Datenbank. Änderungen an Backend, MFA und Schreibprozessen erfordern besondere Sicherheitsprüfung vor produktiver Bereitstellung. Bei externen produktiven Aktionen bleibt die jeweils nötige Berechtigung bestehen.
