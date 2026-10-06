# G6-Gesamtaudit – Rollen, Rechte und Workflow

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument prüft den Abschluss von **G6 – Rollen / Rechte / Workflow** gegen die bereits verbindlichen fachlichen, Datenschutz- und Architekturgrundlagen.

Geprüfte Primärquellen insbesondere:

- `docs/Rollen-Rechte-und-Workflow.md` v1.0
- `docs/KI-Zugangswege-und-Fachfunktionen.md`
- `docs/MVP-Fachfunktionen.md`
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/Zielarchitektur.md` v1.0
- `docs/decisions/ADR-006-Authentifizierung-und-Rechtearchitektur.md`

## 2. Prüffragen und Ergebnis

### 2.1 Rollenmodell konsistent?

**Bestanden.**

Es gibt weiterhin genau drei menschliche Rollen: Besucher, Redakteur und Admin. Eine zusätzliche Publisher-Rolle wurde nicht eingeführt. AI Tasks bleiben technische Akteure und keine menschliche Rolle.

### 2.2 Aktionsstufen S0–S3 konsistent?

**Bestanden.**

Die bereits fachlich festgelegten Stufen werden unverändert verwendet. G6 konkretisiert lediglich Rechte-, Bestätigungs- und Sicherheitsfolgen.

### 2.3 Fachfunktionskatalog vollständig abgedeckt?

**Bestanden.**

Alle MVP-Fachfunktionsfamilien sind in der Berechtigungsmatrix berücksichtigt. Es wurde keine zusätzliche G6-spezifische Fachfunktion eingeführt.

### 2.4 AI-Task-Grenzen konsistent?

**Bestanden.**

AI Tasks bleiben auf S0/S1 beschränkt und können keine menschliche S2-/S3-Entscheidung, Veröffentlichung, normative Aktivierung oder Rechteadministration ersetzen.

### 2.5 S3-Bestätigungsregel konsistent?

**Bestanden.**

Jede S3-Aktion benötigt weiterhin eine unmittelbare explizite Bestätigung vor der Ausführung. Dies gilt unabhängig davon, ob die Aktion aus Web-App oder FIB-Chat ausgelöst wird.

### 2.6 MFA-/Step-up-Regel angemessen und widerspruchsfrei?

**Bestanden.**

MFA ist für Redakteure und Admins verpflichtend. Normale redaktionelle Veröffentlichungen erfordern keinen neuen Authenticator-Code je Vorgang. Kritische administrative Sicherheits-/Rechteänderungen können dagegen eine aktuelle Step-up-Authentifizierung verlangen.

Damit wird Sicherheit erhöht, ohne den normalen Redaktionsablauf unverhältnismäßig zu belasten.

### 2.7 Schutzklassen berücksichtigt?

**Bestanden.**

K2-Zugriffe unterliegen weiterhin G4-Datenschutz-/Schutzregeln. K3 wird nicht als normaler fachlicher KI-/Redaktionskontext behandelt. Schutzklassen ergänzen die Rollenentscheidung, ersetzen sie nicht.

### 2.8 Fachservices und RLS sauber abgegrenzt?

**Bestanden.**

Die Fachservices bleiben die primäre fachliche Autorisierungsinstanz. RLS bildet eine zusätzliche robuste technische Sperrschicht. Komplexe Fachregeln werden nicht vollständig doppelt in RLS nachmodelliert; dadurch entsteht kein konkurrierendes zweites Regelwerk.

### 2.9 Rollenentzug / veraltete Sitzungen abgesichert?

**Bestanden.**

S2-/S3-Aktionen prüfen den aktuellen serverseitigen Rollen-/Kontostatus erneut. Eine alte Browser-/JWT-Sitzung darf einen bereits entzogenen Zugriff nicht fortschreiben.

### 2.10 Audit und Concurrency ausreichend berücksichtigt?

**Bestanden.**

S2/S3 und geschützte Adminaktionen sind auditpflichtig. Optimistic Concurrency verhindert stilles Überschreiben durch veraltete Bearbeitungsstände.

## 3. Abgrenzung zu Folgephasen

Nicht in G6 festgelegt und bewusst verschoben:

- konkrete SQL-/RLS-Policies und API-Schemas → U1,
- Sitzungsdauer, Refresh-/Tokenlebensdauer, MFA-Recovery und Notfallzugänge → G7,
- Backup/Restore, Monitoring und Betriebsalarmierung → G7,
- konkrete Migrations-/Recovery-Verfahren beim Infrastrukturwechsel → G9,
- End-to-End-Abnahme der Rechte-/MFA-/Workflowregeln → G10/U6.

Diese Punkte sind keine offenen G6-Grundsatzfragen.

## 4. Auditfazit

**G6 ist bestanden und fachlich/architektonisch abgeschlossen.**

Es bestehen keine bekannten offenen Grundsatzwidersprüche zwischen Rollenmodell, Fachfunktionen, Schutzklassen, Auth-/RLS-Architektur und Workflowregeln.

Nächster Gründungsschritt: **G7 – Betrieb**.
