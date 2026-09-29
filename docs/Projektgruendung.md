# Projektgründung – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 29.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

## 5. G1 – bisher verbindlich entschiedener MVP-Rahmen

Das MVP ist die erste wirklich produktiv betreibbare FIB-Version. Es wird nicht auf Kosten von Datenqualität, Quellenbindung, Redaktionsworkflow, Sicherheit, stabilen URLs oder fachlicher Struktur verkleinert. Gestaffelt werden vor allem Komfortfunktionen und zusätzliche Automatisierungen, soweit sie nicht zum Kernnutzen von FIB gehören.

### 5.1 Quellenmonitor und KI-gestützte Inhaltserstellung

Die automatische Erstellung redaktioneller Entwürfe aus Fundstellen ist ein **Kernfeature von FIB und Bestandteil des MVP**.

Der Zielprozess des MVP lautet:

`Quelle → Fundstelle → automatische Analyse → KI-gestützter Entwurf → redaktionelle Prüfung/Korrektur → Freigabe → Veröffentlichung`

Der Quellenmonitor muss zum Go-live mindestens:

- bekannte Pflichtquellen sowie definierte Orts- und Themenquellen automatisch überwachen,
- neue und geänderte Fundstellen persistent erkennen,
- Fundstellen deduplizieren,
- relevante Zusammenhänge und vorhandene FIB-Objekte berücksichtigen,
- Relevanz und mögliche Zuordnung zu Themen, Sitzungen, Bezugsobjekten oder bestehenden Beiträgen voranalysieren,
- aus geeigneten Fundstellen automatisch einen redaktionellen Beitragsentwurf oder einen Aktualisierungsvorschlag erzeugen,
- Quellen und Quellenrollen strukturiert mitführen,
- Sachinformation und politische Einordnung getrennt behandeln,
- Unsicherheiten und nicht ausreichend belegte Aussagen kenntlich machen,
- die Redaktion vor jeder Veröffentlichung prüfen und freigeben lassen.

Die Redaktion soll im Normalfall **nicht bei einem leeren Text beginnen**, sondern einen prüfbaren Entwurf erhalten.

Dieser Grundsatz gilt analog für:

- neue oder fortzuschreibende **Themen**,
- Vorschläge für **„Unsere Einordnung“**,
- geeignete **„Mehr wissen?“**-Fragen und vorbereitete Antworten.

„Unsere Einordnung“ bleibt trotz KI-Unterstützung eine ausdrücklich politische, redaktionell verantwortete Ebene und wird nicht automatisch ohne Freigabe veröffentlicht.

### 5.2 Freie Besucherfragen

Freie Live-KI-Fragen sind **kein zwingender Bestandteil des ersten Go-live**. Das MVP enthält vorbereitete „Mehr wissen?“-Fragen und gespeicherte Antworten. Die Architektur wird so angelegt, dass freie Fragen später ergänzt werden können.

### 5.3 Web Push

Web Push gehört zum **MVP**, weil freiwillige Bindung ein ausdrückliches Produktziel von FIB ist. Erweiterte Präferenzen und Komfortfunktionen können nach dem ersten Go-live ausgebaut werden.

### 5.4 Offline-Fähigkeit

Eine vollständige Offline-Anwendung mit bidirektionaler Synchronisation ist **kein MVP-Ziel**. Redaktion und Datenpflege bleiben online. Begrenztes Offline-Lesen bereits geladener öffentlicher Inhalte kann im Rahmen der PWA vorgesehen werden, sofern dies ohne unverhältnismäßige Zusatzkomplexität möglich ist.

## 6. Offene Gründungspakete

### G1 – Produktumfang und MVP
Die Kernentscheidungen sind getroffen. Die vollständige Funktionsliste wird noch abschließend den Stufen MVP, unmittelbar danach und spätere Ausbaustufe zugeordnet.

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

## 7. Hosting- und Eigentumsgrundsatz

Das Repository liegt während der Entwicklung zunächst im persönlichen GitHub-Konto `PustefixReisen`.

Vor dem Produktivbetrieb soll die technische Eigentümerschaft so organisiert werden, dass keine persönliche Einzelperson einen Single Point of Failure bildet.

Das öffentliche Echtsystem soll auf Infrastruktur der GRÜNEN betrieben werden, soweit dies technisch sinnvoll und mit der Zielarchitektur vereinbar ist. Die technischen Rahmenbedingungen des Webspace/Servers werden in der Architekturphase erhoben.

## 8. Reihenfolge

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

## 9. Abschlusskriterium

Die Projektgründungsphase ist abgeschlossen, wenn die wesentlichen Grundentscheidungen dokumentiert, vertagte Entscheidungen mit Auslöser benannt, zentrale Standards klassifiziert, die Roadmap aktualisiert und keine für den Entwicklungsstart blockierende Grundsatzfrage mehr offen ist.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 29.09.2026 | G1 konkretisiert: automatische Entwurfserstellung für Beiträge, Themen und Einordnungen als MVP-Kernfeature; Web Push im MVP; freie Live-Fragen und vollständige Offline-Synchronisation nicht im ersten Go-live. |
| 1.0 | 29.09.2026 | Projektgründungsrahmen für das FIB-Echtsystem angelegt. |
