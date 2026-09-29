# Projektgründung – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 29.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument führt die verbindlichen Entscheidungen der Projektgründungsphase des FIB-Echtsystems. Vor Beginn der Programmierung werden die wesentlichen Grundentscheidungen getroffen und dokumentiert. Danach folgt ein kurzer Gründungsaudit.

## 2. Ausgangslage

Der Demonstrator ist abgeschlossen und dient als fachliche, visuelle und historische Referenz.

Maßgeblicher Übergabestand:

`PustefixReisen/presseschau-feldkirchen-demo/docs/FIB_Uebergabe_Echtsystem.md`

Die dort dokumentierten fachlichen Entscheidungen sind Anforderungen an das Echtsystem und dürfen beim technischen Neubau nicht verloren gehen.

## 3. Grundsatz zur Weiterentwicklung

Fachliche Parität mit dem Demonstrator ist eine Mindestanforderung, aber nicht das vollständige Zielbild.

Das Echtsystem soll insbesondere UI, Benutzererlebnis, Informationsarchitektur, Navigation, Benutzerführung und Fachfunktionen weiterentwickeln.

UX- und Fachentscheidungen werden darauf geprüft, ob daraus neue Anforderungen an Datenmodell, Geschäftsregeln, Redaktion oder Migration entstehen.

## 4. Bereits gesetzte Leitplanken

- separates Echtsystem-Repository,
- persistente PostgreSQL-Datenhaltung statt Demonstrator-JSON,
- Supabase als bevorzugte Datenbank-/Backend-Basis; konkrete Produktivstruktur noch offen,
- Redaktions-Web-App mit Freigabeprozess,
- öffentliche Website ohne Benutzerkonto,
- PWA,
- gerätebezogenes „Neu seit letztem Besuch“,
- Web Push nur nach Opt-in,
- modellunabhängige KI-Anbindung,
- organisationsgebundene Produktivkonten,
- mindestens zwei technische Administratoren,
- fachliche Regeln möglichst technisch absichern,
- Sachinformation und „Unsere Einordnung“ trennen,
- „Mehr wissen?“ übernehmen,
- SEO, Erfolgsmessung und Marketing als Bestandteile des Zielsystems,
- Dashboard „small and simple“,
- digitaler und analoger Raum als gemeinsame Verbreitungslogik.

## 5. Offene Gründungspakete

### G1 – Produktumfang und MVP
Erste produktive Ausbaustufe, Nicht-Ziele, Aufwandstreiber und Abgrenzung späterer Funktionen.

### G2 – UX, Informationsarchitektur und Fachfunktionen
Nutzeraufgaben, Navigation, Beiträge, Themen, Sitzungen, Suche, Filter, „Mehr wissen?“, Aktualisierungen, Historie und mobile Bedienung.

### G3 – Fachliche Datenanforderungen und logisches Datenmodell
Entitäten, Beziehungen, Status, Historisierung, Quellen, Bezugsobjekte, Medien und Migrationsanforderungen.

### G4 – Schutzbedarf, Datenschutz und Offline-Modell
Datenarten, Sensitivität, Authentifizierung, Rollen, Logging, Verschlüsselung, lokale Speicherung und Offline-Fähigkeit.

### G5 – Zielarchitektur und Technologie-Stack
Frontend-/Backend-Aufteilung, Framework, Programmiersprache, Supabase-Rolle, KI-Anbindung, Hosting, Routing und Deployment.

### G6 – Rollen, Rechte und Freigabeworkflow
Rollenmodell, Statusmodell, Freigaben, Veröffentlichung und technische Administration.

### G7 – Betrieb
Entwicklungs-, Test- und Produktivumgebung, Backup, Restore, Monitoring, Kostenkontrolle und Updateverfahren.

### G8 – Governance, Repository und Dokumentation
Übernahmematrix zentraler Standards, Repository-Arbeitsweise, Dokumentationsstruktur, Audit und Issues.

### G9 – Migration
Datenqualitätscheck, Transformation, Validierung und Übernahme der Demonstratordaten.

### G10 – Go-live-Abnahme
Fachliche Parität, UX-/Funktionsabnahme, Sicherheitsprüfung, Restore-Test, Rollenprüfung, PWA/SEO, Migration und Redaktions-Probelauf.

## 6. Hosting- und Eigentumsgrundsatz

Das Repository liegt während der Entwicklung zunächst im persönlichen GitHub-Konto `PustefixReisen`.

Vor dem Produktivbetrieb soll die technische Eigentümerschaft so organisiert werden, dass keine persönliche Einzelperson einen Single Point of Failure bildet.

Das öffentliche Echtsystem soll auf Infrastruktur der GRÜNEN betrieben werden, soweit dies technisch sinnvoll und mit der Zielarchitektur vereinbar ist. Die technischen Rahmenbedingungen des Webspace/Servers werden in der Architekturphase erhoben.

## 7. Reihenfolge

1. G1 Produktumfang und MVP
2. G2 UX / Informationsarchitektur / Fachfunktionen
3. G3 Datenanforderungen / Datenmodell
4. G4 Schutzbedarf / Datenschutz / Offline
5. G5 Zielarchitektur / Stack / Hosting / Deployment
6. G6 Rollen / Rechte / Workflow
7. G7 Betrieb
8. G8 Governance / Repository / Dokumentation
9. G9 Migration
10. G10 Go-live-Abnahme
11. Gründungsaudit
12. technische Umsetzung

## 8. Abschlusskriterium

Die Projektgründungsphase ist abgeschlossen, wenn die wesentlichen Grundentscheidungen dokumentiert, vertagte Entscheidungen mit Auslöser benannt, zentrale Standards klassifiziert, die Roadmap aktualisiert und keine für den Entwicklungsstart blockierende Grundsatzfrage mehr offen ist.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 29.09.2026 | Projektgründungsrahmen für das FIB-Echtsystem angelegt. |
