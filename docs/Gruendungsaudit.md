# Gründungsaudit – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist der übergreifende Abschlussaudit der FIB-Projektgründung. Es prüft G1 bis G10 nicht nur einzeln, sondern insbesondere ihre Übergänge:

`Produkt/MVP → UX/Fachfunktionen → Datenmodell → Schutz/Datenschutz → Architektur → Rechte/Workflow → Betrieb → Governance → Migration → Go-live-Abnahme`.

Ziel ist die Frage, ob die technische Umsetzung U1–U6 beginnen kann, ohne dass noch eine blockierende Grundsatzentscheidung fehlt oder widersprüchlich dokumentiert ist.

## 2. Prüfgrundlagen

Geprüft wurden insbesondere:

- `docs/Projektgruendung.md`
- `docs/Roadmap.md`
- `docs/Dokumentation.md`
- G2.5-Transfer-Audits und `docs/Regressionstests-Demonstratortransfer.md`
- `docs/Datenmodell.md` und G3-Audit
- G4-Schutz-/Datenschutzdokumente
- `docs/Zielarchitektur.md`, ADR-001 bis ADR-010 und G5-Audit
- `docs/Rollen-Rechte-und-Workflow.md` und G6-Audit
- `docs/Betrieb-und-Wiederherstellung.md` und G7-Audit
- `docs/G8-Governance-und-Dokumentationsaudit.md`
- `docs/Migrationsstrategie.md`, `docs/Migrations-Runbook.md` und G9-Audit
- `docs/Go-live-Abnahmekriterien.md` und G10-Audit
- offene GitHub-Issues mit Wiederaufnahme-Kriterien.

## 3. Ergebnis der Übergangsprüfungen

### 3.1 Produktumfang → Fachmodell

Bestanden.

Die MVP-Funktionen aus G1/G2 besitzen fachliche Entsprechungen im G3-Datenmodell bzw. in den spezialisierten Teilmodellen. Kritische Demonstrator-Erkenntnisse sind zusätzlich als Regressionstestfälle dokumentiert.

### 3.2 Fachmodell → Architektur

Bestanden.

Die G5-Zielarchitektur unterstützt die fachlichen Kernobjekte, n:m-Beziehungen, Versionierung/Audit, Medien, Rechercheläufe, AI Tasks, Vertiefungsinhalte und den Static-first-Publish. Es besteht keine bekannte Architekturentscheidung, die das fachliche Modell unzulässig vereinfacht.

### 3.3 Schutz/Datenschutz → Architektur/KI

Bestanden.

Schutzklassen K0–K3 sind in KI-Routing, Storage, Auth/RLS, öffentliche Auslieferung und Betriebsregeln überführt. K3 wird nicht an KI übermittelt; K2 benötigt freigegebene Betriebswege. Besucher benötigen kein Konto, und die öffentliche Seite greift nicht direkt auf interne Datenhaltung zu.

### 3.4 Rollen/Rechte → Fachfunktionen

Bestanden.

Besucher, Redakteur und Admin sind ausreichend abgegrenzt. AI Tasks bleiben technische Akteure mit S0/S1-Grenze. Fachservices sind primäre Autorisierungsinstanz; RLS ist zusätzliche technische Schutzschicht. S3 bleibt explizit bestätigungspflichtig.

### 3.5 Architektur → Betrieb

Bestanden.

Static-first-Auslieferung, versionierte Releases, Backup/Restore, Monitoring, Provider-/Kostenbetrieb und Secret-Betrieb sind betrieblich anschlussfähig. Die Pilot-Backupkette Supabase → Nextcloud → PC → Back In Time ist entschieden; der Restore-Nachweis bleibt bewusst Go-live-Pflicht.

### 3.6 Betrieb → Migration

Bestanden.

Das Migrations-Runbook umfasst nicht nur Datenbank und Webserver, sondern auch Storage, Repository/CI-CD, Providerkonten, Secrets, Backup, Monitoring/Mail, Domains und Adminzugänge. Ein paralleler unkontrollierter Produktiv-Schreibbetrieb auf Quelle und Ziel ist ausgeschlossen.

### 3.7 Migration/Betrieb → Go-live

Bestanden.

G10 enthält harte Blocker für fehlenden Restore-Nachweis, kritische Regressionen, Sicherheits-/Datenschutzblocker, unvalidierte Migration und persönliche Produktivabhängigkeiten.

## 4. Auditfund und Korrektur

Während des Gründungsaudits wurde ein veralteter Statusblock in `docs/Projektgruendung.md` gefunden: G3 war dort noch als „in Arbeit“ geführt, obwohl G3–G10 bereits abgeschlossen waren.

Die Datei wurde auf v1.5 konsolidiert. Der Fund war eine Dokumentationsinkonsistenz, keine offene fachliche Grundsatzfrage.

## 5. Offene Punkte und eindeutige Zuordnung

Es bestehen weiterhin offene Arbeiten, sie blockieren den Entwicklungsstart jedoch nicht, weil sie eindeutig einer späteren Phase oder einem Auslöser zugeordnet sind.

| Offener Punkt | Zuordnung / Auslöser |
|---|---|
| Datenbankschema, Migrationen, Fachservices, Auth-/RLS-Grundlage | U1 |
| Redaktions-App und FIB-Chat | U2 |
| öffentliche Website/PWA | U3 |
| Quellenmonitor, Recherche, Ereigniserkennung, KI-Funktionen | U4 |
| Publish, Deployment, Monitoring, Backup-Automation | U5 |
| End-to-End-, Transfer- und Pilotprüfung | U6 |
| technische Automatisierung des Demonstrator-Regressionstestkorpus | U1–U6, spätestens G10-Nachweis |
| repräsentativer Recherche-/Qualitätstestkorpus und Pilot-Schwellen | U4/U6, spätestens Go-live |
| Restore-Test | GitHub Issue #3; spätestens U6/G10 |
| konkrete Provider-/DSFA-Prüfung | vor produktivem KI-Betrieb / G10 |
| reale Migration auf GRÜNEN-Infrastruktur | nach U1–U6 im Go-live-Kontext |
| Referenzwissen Ausbaustufe 2 | Issue #1; nur bei nachgewiesenem Bedarf nach Pilot |
| externe MCP-Anbindung | Issue #2; nur bei konkretem Nutzen nach MVP |

Damit existiert kein unspezifisches „später“ ohne Zuständigkeit oder Wiederaufnahme-Kriterium.

## 6. Bekannte bewusste Vorläufigkeiten

Folgende Punkte sind absichtlich noch nicht endgültig kalibriert und stellen keine Gründungsblocker dar:

- konkrete KI-Modelle/Providerzuordnung innerhalb der bereits festgelegten Routerregeln,
- endgültiges Produktiv-KI-Budget,
- konkrete Precision-/Recall-Schwellen für Recherchequalität,
- endgültiger Supabase-Tarif im Zielbetrieb,
- Detailgestaltung der Redaktions-App und visueller Feinschliff der öffentlichen Seite.

Diese Entscheidungen benötigen reale Pilotdaten oder Implementierungserfahrung; ihre Entscheidungsgrenzen sind bereits festgelegt.

## 7. Entwicklungsstart-Gates

Vor Beginn U1 müssen erfüllt sein:

- G1–G10 abgeschlossen,
- kanonische Dokumentationsquellen festgelegt,
- keine offene blockierende Grundsatzfrage,
- Roadmap benennt U1 als nächsten Umsetzungsschritt,
- offene Folgepunkte besitzen Phase oder Wiederaufnahme-Kriterium.

Diese Bedingungen sind erfüllt.

## 8. Auditergebnis

**Der Gründungsaudit ist bestanden.**

Die Projektgründungsphase ist fachlich, technisch und organisatorisch ausreichend abgeschlossen, um die eigentliche Produktentwicklung zu beginnen.

Es bestehen keine bekannten offenen Grundsatzfragen, die U1 blockieren. Spätere Nachweise und Kalibrierungen sind klar als Umsetzungs-, Pilot- oder Go-live-Aufgaben verankert.

Nächster Schritt:

> **U1 – Technischer FIB-Kern**

mit Datenbankschema/Migrationen, gemeinsamer Fachservice-Schicht, Auth-/RLS-Grundlage, Storage-Anbindung, KI-Router-Grundlage, gemeinsamer Konfiguration und Testbasis.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G1–G10 übergreifend auf Übergänge, Widersprüche und offene Folgepunkte geprüft; veralteten Projektgründungsstatus korrigiert; Entwicklungsstart freigegeben. |