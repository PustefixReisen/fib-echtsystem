# G5-Gesamtaudit – Zielarchitektur / Stack / Hosting / Deployment

## Dokumentstand

| Version | Stand | Ergebnis |
|---|---|---|
| 1.0 | 06.10.2026 | **Bestanden** |

## 1. Zweck

Dieses Audit prüft, ob die in G5 festgelegte Zielarchitektur vollständig, untereinander widerspruchsfrei und mit den verbindlichen Ergebnissen aus G1–G4 vereinbar ist.

Geprüfte Primärquelle:

- `docs/Zielarchitektur.md` v1.0

Geprüfte Architekturentscheidungen:

- ADR-001 Web- und Service-Stack
- ADR-002 Datei- und Bildspeicher
- ADR-003 Publikations- und Deploymentprozess
- ADR-004 Suche und RAG
- ADR-005 AI Tasks, Scheduler und Queue
- ADR-006 Authentifizierung und Rechtearchitektur
- ADR-007 KI-Router und Providerintegration
- ADR-008 CI/CD und Deployment
- ADR-009 Repository- und Anwendungsstruktur

Zusätzlich gegengeprüft wurden insbesondere die G3-Fachservice-/Datenmodellentscheidungen und die G4-Schutz-/Datenschutzregeln.

## 2. Prüfergebnis

**G5 ist bestanden.**

Es wurden keine offenen widersprüchlichen Architekturgrundsätze gefunden. Die für eine spätere technische Umsetzung erforderlichen Systemgrenzen, Hauptkomponenten und Verantwortlichkeiten sind ausreichend festgelegt.

## 3. Konsistenzprüfungen

### 3.1 Gemeinsame Fachservices

**Bestanden.**

Web-App, FIB-Chat und AI Tasks verwenden dieselbe Fachservice-Schicht. Damit bleibt die G3-Regel erhalten, dass reguläre fachliche Zugriffe nicht über alternative Direktpfade erfolgen.

RLS ergänzt diese Schicht als technische Absicherung und ersetzt sie nicht.

### 3.2 Öffentliche Static-first-Architektur

**Bestanden.**

Die öffentliche Website erhält ausschließlich einen freigegebenen K0-Stand. Normales Lesen benötigt weder Datenbank noch KI.

Dies ist mit den bisherigen UX-Anforderungen vereinbar. Öffentliche interaktive Funktionen wie lokaler Neuigkeitsstatus oder Push ergänzen die statische Inhaltsauslieferung, ohne interne FIB-Daten öffentlich zugänglich zu machen.

### 3.3 Publikation und CI/CD

**Bestanden.**

Fachliche S3-Freigabe und technische Auslieferung sind getrennt, aber nachvollziehbar verbunden.

ADR-003 und ADR-008 sind konsistent:

- S3 erzeugt einen versionierten K0-Stand,
- daraus wird ein geprüftes Buildartefakt erzeugt,
- ein fehlerhafter Build ersetzt den bisherigen Stand nicht,
- dasselbe geprüfte Artefakt wird auf die jeweilige Zielumgebung deployt,
- Rollback ist vorgesehen.

Ein Code-Commit ist keine fachliche Veröffentlichung und eine Inhaltsveröffentlichung benötigt keinen Code-Commit.

### 3.4 Datei-/Bildspeicher und öffentliche Medien

**Bestanden.**

Interne Originale und freigegebene öffentliche Kopien sind getrennt. Der Storage ist über einen Adapter austauschbar.

Damit sind Nextcloud als Pilotkandidat, spätere organisationsgebundene Storage-Lösungen und die G4-Schutzklassen vereinbar.

### 3.5 Datenschutz und Schutzklassen

**Bestanden.**

Die Architektur übernimmt die G4-Regeln:

- K0 darf veröffentlicht/gecachet werden,
- K1/K2 bleiben aus öffentlichen Builds/Caches heraus,
- K2-KI-Nutzung nur über ausdrücklich freigegebene Betriebswege,
- K3 niemals an externe KI,
- Secrets ausschließlich serverseitig,
- kein Offline-Spiegel interner K1/K2-Redaktionsdaten im MVP.

### 3.6 Authentifizierung und Rollen

**Bestanden mit bewusstem Folgeauftrag an G6.**

Besucher benötigen kein Konto. Redakteur/Admin werden authentifiziert, Fachservices prüfen Berechtigungen serverseitig, RLS bildet Defense in Depth.

Nicht in G5 festgelegt werden bewusst:

- konkrete Rollen-/Policy-Matrix,
- konkrete S2-/S3-Berechtigungen je Rolle,
- MFA-Pflicht je Rolle/Aktion.

Diese Punkte gehören sachlich in G6.

### 3.7 Suche und RAG

**Bestanden.**

Die Sucharchitektur nutzt vorhandene FIB-Strukturen zuerst. Volltext ergänzt, semantische/Vektorsuche bleibt optional nach Qualitätsnachweis.

Der öffentliche Suchindex enthält ausschließlich K0. RAG erhält Kontext aus zulässigen FIB-Daten und respektiert Schutzklassen.

Es entsteht keine unnötige zweite Wissenshaltung neben dem fachlichen FIB-Datenbestand.

### 3.8 KI-Router und Modellunabhängigkeit

**Bestanden.**

Fachfunktionen enthalten keine festen Modellnamen. Aufgaben werden nach Aufgabenklasse, Qualitätsanforderung, Schutzklasse, Kosten und freigegebenem Betriebsweg geroutet.

Mindestens zwei Provider sind technisch parallel konfigurierbar. Fallbacks dürfen keine Datenschutz-/Schutzanforderungen abschwächen.

Konkrete Modelle bleiben austauschbare Betriebskonfiguration.

### 3.9 AI Tasks und Automatisierung

**Bestanden.**

Zeitplanung, Run und Verarbeitung sind getrennt. Persistente Queue und wiederaufnehmbare Schritte vermeiden eine Abhängigkeit von einzelnen langen Funktionsaufrufen.

AI Tasks erhalten keine eigenständigen S2-/S3-Rechte.

### 3.10 Repository-/Anwendungsstruktur

**Bestanden.**

Ein Monorepo hält gemeinsame Dokumentation, Tests, Migrationen und Anwendungen zusammen. Öffentliche Website und Redaktions-App bleiben technisch getrennt.

Der FIB-Chat kann im MVP als eigener geschützter Arbeitsbereich innerhalb der Redaktions-App umgesetzt werden, ohne seine fachliche Eigenständigkeit oder die gemeinsame Fachservice-Regel zu verletzen.

### 3.11 Migration Entwickler → GRÜNEN-Infrastruktur

**Bestanden.**

Die Architektur enthält keine notwendige Bindung an persönliche Domains, Projekt-IDs, konkrete KI-Anbieter oder IONOS.

Der öffentliche Build ist transportabel. Supabase-Schema/Funktionen werden reproduzierbar versioniert. Storage und Provider sind über Konfiguration/Adapter austauschbar.

Das konkrete Migrationsrunbook bleibt korrekt in G9.

## 4. Bewusst nicht in G5 entschiedene Punkte

Folgende Punkte sind keine G5-Lücken, sondern gehören in nachfolgende Phasen:

### G6 – Rollen / Rechte / Workflow

- technische Rechte-/Policy-Matrix,
- MFA-Pflichten je Rolle/Aktion,
- konkrete Umsetzung der fachlichen S0–S3-Regeln.

### G7 – Betrieb

- Backup-/Restore-Regeln,
- Monitoring/Alarmierung,
- konkrete Log-/Audit-Retention,
- KI-Kostenbudgets und Warnschwellen,
- laufende Provider-/Modellfreigabe und Qualitätskalibrierung,
- Secret-Rotation und Betriebsroutinen.

### G9 – Migration

- konkretes Migrationsrunbook,
- Zielserver-/Zielkonto-Konfiguration,
- wiederholbarer Umzugs- und Abnahmeablauf.

### Umsetzungsphase

- konkrete Workflow-YAML-Dateien,
- konkrete SQL-Policies/Migrationen,
- konkrete SFTP-/SSH-Kommandos,
- konkrete UI-Komponenten,
- Feintuning der Package-/Verzeichnisnamen.

## 5. G5-Abschlusskriterium

Das G5-Abschlusskriterium ist erfüllt:

> Die technische Zielarchitektur definiert die Systemgrenzen, Anwendungen, gemeinsamen Services, Daten-/Storage-/KI-/Publish-Wege, Sicherheitsgrenzen, Deploymentstrategie und Reproduzierbarkeit so weit, dass G6/G7 darauf aufbauen und die spätere Umsetzung ohne grundlegende Architekturentscheidung beginnen kann.

## 6. Ergebnis

**G5 – Zielarchitektur / Stack / Hosting / Deployment: ABGESCHLOSSEN.**

Nächste Gründungsphase ist **G6 – Rollen / Rechte / Workflow**.
