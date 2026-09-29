# Projektgründung – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.2 | 29.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

## 5. G1 – Produktumfang und MVP

Das MVP ist die erste wirklich produktiv betreibbare FIB-Version. Es wird nicht auf Kosten von Datenqualität, Quellenbindung, Redaktionsworkflow, Sicherheit, stabilen URLs oder fachlicher Struktur verkleinert.

### 5.1 MVP-Grundsatz

Zum MVP gehören alle Funktionen und Strukturen, die:

- den Kernnutzen von FIB ausmachen,
- die laufende Redaktion wesentlich entlasten,
- das Datenmodell oder die langfristige Informationsarchitektur prägen,
- für einen sicheren und nachvollziehbaren Produktivbetrieb erforderlich sind,
- oder später nur mit unverhältnismäßigem Umbau nachgerüstet werden könnten.

Nach dem Go-live ausgebaut werden vor allem Komfortfunktionen, zusätzliche Kanäle und Automatisierungen, deren spätere Ergänzung die Grundarchitektur nicht verändert.

### 5.2 Quellenmonitor und KI-gestützte Inhaltserstellung

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

### 5.3 Funktionsstaffelung

#### MVP – zum ersten produktiven Go-live

- öffentliche Presseschau / Beiträge,
- Themen,
- Sitzungen,
- Quellen und strukturierte Quellenrollen,
- Bezugsobjekte und explizit geprüfte Beziehungen,
- Kategorien, Orte und fachliche Schlagworte,
- Aktualisierungs- und Versionshistorie,
- stabile öffentliche URLs und Direktlinks,
- responsive und mobil optimierte Oberfläche,
- überarbeitete grundlegende UX und Informationsarchitektur,
- Suche und grundlegende Filter,
- Redaktionssystem,
- Benutzerkonten, Rollen und Freigabeworkflow,
- automatische Quellenbeobachtung und Fundstellenerkennung,
- KI-gestützte Relevanzprüfung und Zuordnung,
- automatische Entwurfserstellung für Beiträge und Aktualisierungen,
- KI-gestützte Themenanlage und Themenfortschreibung,
- KI-Vorschläge für „Unsere Einordnung“ mit zwingender redaktioneller Freigabe,
- vorbereitete „Mehr wissen?“-Fragen und gespeicherte Antworten,
- strukturierte Trennung von Sachinformation und „Unsere Einordnung“,
- Bilder und Bildmetadaten,
- PWA-Grundfunktion,
- „Neu seit letztem Besuch“ ohne Benutzerkonto,
- Web Push nach Opt-in,
- Teilen, Social Preview und Drucken/PDF,
- Info-/Transparenzfunktion je Beitrag und „Über FIB“,
- technische SEO-Grundlagen einschließlich sprechender URLs, Meta-Daten, Canonical, Sitemap und strukturierter Daten,
- grundlegende datensparsame Erfolgsmessung,
- Marketing-/Verbreitungsranking,
- kompaktes internes Dashboard für Betrieb, Nutzung und Kosten,
- modellunabhängige KI-Abstraktionsschicht,
- konfigurierbare Kostenlimits,
- Datenschutz-Grundkonzept,
- produktives Logging in erforderlichem und datensparsamem Umfang,
- Backup/Restore,
- technisches Monitoring,
- mindestens zwei technische Administratoren,
- organisationsfähige Eigentums- und Secrets-Struktur,
- Datenqualitätsprüfung und Migration des relevanten Demonstratorbestands.

#### Unmittelbare Ausbaustufe nach Go-live

- freie Besucherfragen mit Live-KI,
- differenziertere Push-Präferenzen nach Themen und Häufigkeit,
- App-Icon-Badge soweit technisch unterstützt,
- eigener FIB-Newsletter bzw. weitergehende Newsletter-Integration,
- Mastodon-Integration und automatisierte Teaser,
- weitergehende Automatisierung von Themenfortschreibung und Verknüpfungen,
- erweiterte Kanal- und Kampagnenauswertung,
- weitergehende Erfolgsmessung auf Basis der ersten Nutzungsdaten,
- zusätzliche Komfortfunktionen im Redaktionssystem,
- weitergehende automatische Qualitäts- und Konsistenzprüfungen,
- begrenztes Offline-Lesen bereits geladener öffentlicher Inhalte, sofern mit vertretbarem Aufwand möglich.

#### Spätere Erweiterungen / derzeit nicht MVP

- vollständige Offline-Nutzung mit bidirektionaler Synchronisation und Konfliktlösung,
- komplexe Personalisierung für öffentliche Nutzer,
- umfangreiche Nutzerkonten für Besucher,
- komfortables Admin-UI für Providerwechsel, sofern die technische Umschaltung zunächst einfacher möglich ist,
- Signal-Integration, sofern später ein klarer fachlicher und technischer Nutzen nachgewiesen wird,
- weitere Verbreitungs- oder Social-Media-Kanäle ohne belegten Mehrwert,
- zusätzliche Funktionen, die erst aus realer Nutzung und Baseline-Messung abgeleitet werden.

### 5.4 Ausdrückliche Nicht-Ziele der ersten Version

Das MVP soll nicht:

- eine allgemeine regionale Nachrichtenplattform werden,
- vollständig autonom veröffentlichen,
- die redaktionelle Verantwortung ersetzen,
- eine komplexe Social-Media-Suite werden,
- vollständige Offline-Synchronisation anbieten,
- öffentliche Benutzerkonten als Voraussetzung für das Lesen benötigen,
- personenbezogene Nutzungsprofile für Marketing aufbauen,
- jede theoretisch mögliche KI-Funktion bereits zum Go-live enthalten.

### 5.5 Wichtigste Aufwandstreiber

Für die weitere Gründungsphase werden insbesondere folgende Aufwandstreiber berücksichtigt:

1. automatische, qualitativ belastbare Entwurfserstellung aus heterogenen Quellen,
2. Erkennung „neuer Beitrag versus Aktualisierung eines bestehenden Vorgangs“,
3. Themenfortschreibung und strukturierte Beziehungen,
4. klare Trennung und redaktionelle Verantwortung von Sachinformation und politischer Einordnung,
5. neue UX / Informationsarchitektur mit Auswirkungen auf das Datenmodell,
6. Redaktionsworkflow mit Rollen und Rechten,
7. PWA und Web Push,
8. SEO-taugliche stabile öffentliche Seiten,
9. Migration und Datenqualitätsprüfung des Demonstratorbestands,
10. modellunabhängige KI-Schicht mit Kosten- und Qualitätskontrolle,
11. produktiver Betrieb mit Backup, Restore, Monitoring und organisationsgebundener Administration.

### 5.6 Freie Besucherfragen

Freie Live-KI-Fragen sind **kein zwingender Bestandteil des ersten Go-live**. Das MVP enthält vorbereitete „Mehr wissen?“-Fragen und gespeicherte Antworten. Die Architektur wird so angelegt, dass freie Fragen später ergänzt werden können.

### 5.7 Web Push

Web Push gehört zum **MVP**, weil freiwillige Bindung ein ausdrückliches Produktziel von FIB ist. Erweiterte Präferenzen und Komfortfunktionen können nach dem ersten Go-live ausgebaut werden.

### 5.8 Offline-Fähigkeit

Eine vollständige Offline-Anwendung mit bidirektionaler Synchronisation ist **kein MVP-Ziel**. Redaktion und Datenpflege bleiben online. Begrenztes Offline-Lesen bereits geladener öffentlicher Inhalte kann nach dem Go-live ergänzt werden, sofern dies ohne unverhältnismäßige Zusatzkomplexität möglich ist.

### 5.9 Abschluss G1

G1 – Produktumfang und MVP ist abgeschlossen.

Die genaue Ausgestaltung einzelner MVP-Funktionen wird in den folgenden Gründungspaketen präzisiert, insbesondere in G2 UX/Fachfunktionen, G3 Datenmodell, G4 Sicherheit/Datenschutz und G5 Architektur.

## 6. Offene Gründungspakete

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

1. G1 Produktumfang und MVP – abgeschlossen
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
| 1.2 | 29.09.2026 | G1 abgeschlossen: vollständige MVP-/Ausbaustufen-Abgrenzung, Nicht-Ziele und zentrale Aufwandstreiber festgelegt. |
| 1.1 | 29.09.2026 | G1 konkretisiert: automatische Entwurfserstellung für Beiträge, Themen und Einordnungen als MVP-Kernfeature; Web Push im MVP; freie Live-Fragen und vollständige Offline-Synchronisation nicht im ersten Go-live. |
| 1.0 | 29.09.2026 | Projektgründungsrahmen für das FIB-Echtsystem angelegt. |
