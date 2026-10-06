# G8 Governance- und Dokumentationsaudit – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist der Abschlussnachweis für **G8 – Governance / Repository / Dokumentation**.

Geprüft wird, ob die Projektführung nach Abschluss von G7 so organisiert und dokumentiert ist, dass verbindliche Entscheidungen, Primärquellen, offene/vertagte Punkte, Roadmap und Arbeitsregeln eindeutig nachvollziehbar bleiben.

## 2. Prüfgrundlagen

Insbesondere geprüft wurden:

- `AGENTS.md`,
- `docs/Dokumentation.md`,
- `docs/Roadmap.md`,
- `docs/Projektgruendung.md`,
- die Abschluss-/Auditdokumente G2.5 bis G7,
- `docs/decisions/`,
- offene GitHub-Issues,
- zentrale Governance in `PustefixReisen/pustivo/docs/governance/`.

## 3. Ergebnis

G8 ist bestanden.

Die Governance erfüllt die für die Gründungsphase erforderlichen Kriterien:

1. **Dokumentationshoheit ist eindeutig.** Das Repository `PustefixReisen/fib-echtsystem` ist die kanonische FIB-Projektquelle; Demonstrator, Chats und Exportkopien sind keine parallelen Primärquellen.
2. **„Ein Sachverhalt – eine verbindliche Quelle“ ist verbindlich.** Integrationsquellen und spezialisierte Primärquellen sind voneinander abgegrenzt.
3. **Dokumentationspflege ist aktiv geregelt.** Verbindliche Entscheidungen werden unmittelbar dokumentiert; bei potenziell dauerhaft relevanten offenen Ergebnissen wird aktiv geprüft bzw. nachgefragt.
4. **Roadmap-Pflege ist verbindlich.** Phasenstatus und nächster Schritt werden bei wesentlichen Änderungen aktualisiert.
5. **Vertagte Punkte gehen nicht verloren.** Sie werden mit Wiederaufnahme-Kriterien als Issues oder Roadmap-Punkte geführt.
6. **Architekturentscheidungen sind nachvollziehbar.** Dauerhafte technische Entscheidungen werden als ADR dokumentiert und in die Integrationsquellen zurückgeführt.
7. **Arbeitsregeln für KI-/Entwicklungsarbeit sind vorhanden.** `AGENTS.md` verweist auf die zentrale Governance und ergänzt nur projektspezifische Regeln.
8. **Phasenabschlüsse werden auditiert.** Für G3, G5, G6 und G7 bestehen dokumentierte Abschlussaudits; G2/G2.5 wurden bereits separat geprüft.
9. **Dokumentationslandkarte wurde auf aktuellen Stand gebracht.** Veraltete G4/G5/G7-Statusangaben wurden bereinigt.
10. **Physische Ordnerstruktur bleibt stabil, solange kein konkreter Nutzen entsteht.** Eine rein kosmetische Umordnung wird vermieden.

## 4. Offene Issues als Governance-Bestand

Zum G8-Abschluss sind insbesondere folgende bewusst offene Punkte vorhanden:

- **#1 Referenzwissen – Ausbaustufe 2 nach MVP/Pilot prüfen**,
- **#2 MCP-Anbindung externer KI-Systeme nach MVP prüfen**,
- **#3 Restore-Test vor Produktivstart durchführen**.

Alle drei besitzen konkrete Wiederaufnahme-Kriterien bzw. Auslöser. Sie sind deshalb keine unkontrollierte Dokumentationsschuld.

## 5. Änderungen aus dem G8-Audit

Im Rahmen von G8 wurden folgende Korrekturen vorgenommen:

- zentrale `pustivo`-Regel zur Dokumentationspflege auf v1.2 erweitert,
- weit gefasste aktive Dokumentationsprüfung ausdrücklich verankert,
- `docs/Dokumentation.md` auf v3.0 konsolidiert,
- G4–G7-Primärquellen und Abschlussstände nachgezogen,
- Issues als verbindliche Nachverfolgung bewusst vertagter Punkte aufgenommen,
- die frühere geplante automatische Ordnerumstellung durch eine bedarfsabhängige Regel ersetzt.

## 6. Keine offenen G8-Grundsatzfragen

Es bestehen keine bekannten offenen Governance-Grundsatzfragen, die G9 oder G10 blockieren.

Die eigentliche technische Umsetzung der Governance-Regeln – beispielsweise CI-Prüfungen, automatisierte Dokumentationschecks oder weitere Repository-Regeln – darf später ergänzt werden, ist aber keine Voraussetzung für den Abschluss der Gründungs-Governance.

## 7. Übergabe an Folgephasen

- **G9** konkretisiert die Migration auf die spätere GRÜNEN-Infrastruktur und das wiederholbare Migrations-Runbook.
- **G10** legt die messbaren Go-live-Abnahmekriterien fest.
- Danach folgt ein **Gründungsaudit über G1–G10**, bevor die eigentliche technische Produktentwicklung U1–U6 beginnt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G8-Governance- und Dokumentationsaudit durchgeführt; Dokumentationshoheit, Pflegepflicht, Issues/Vertagungen, Roadmap-/ADR-Regeln und Dokumentationslandkarte geprüft; G8 ohne offene Grundsatzfragen abgeschlossen. |
