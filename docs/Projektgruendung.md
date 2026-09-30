# Projektgründung – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.3 | 30.09.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument führt die verbindlichen Entscheidungen der Projektgründungsphase des FIB-Echtsystems. Vor Beginn der Programmierung werden die wesentlichen Grundentscheidungen getroffen und dokumentiert. Danach folgt ein Gründungsaudit.

## 2. Ausgangslage

Der Demonstrator ist abgeschlossen und dient nur noch als historische, fachliche und visuelle Referenz.

Die für das Echtsystem weiterhin erforderlichen fachlichen und organisatorischen Grundlagen werden nicht mehr im Demonstrator fortgeschrieben, sondern in kanonische Dokumente dieses Repositories übernommen und aktualisiert.

Verbindliche Übersicht:

- `docs/Dokumentation.md`
- `docs/Dokumentationsuebernahme-Demonstrator.md`

Der historische Übergabestand im Demonstrator bleibt Referenz, ist aber keine laufende Primärquelle des Echtsystems mehr.

## 3. Grundsatz zur Weiterentwicklung

Fachliche Parität mit dem Demonstrator ist Mindestanforderung, aber nicht vollständiges Zielbild.

Das Echtsystem entwickelt insbesondere weiter:

- Wissensstruktur,
- UX und Informationsarchitektur,
- Suche und Vertiefung,
- Redaktionsworkflow,
- Quellenbeobachtung und KI-gestützte Aufbereitung,
- technische Persistenz und Betrieb.

UX- und Fachentscheidungen werden darauf geprüft, welche Anforderungen daraus für Datenmodell, Geschäftsregeln, Redaktion und Migration entstehen.

## 4. Bereits gesetzte Leitplanken

- separates Echtsystem-Repository,
- persistente PostgreSQL-Datenhaltung statt Demonstrator-JSON,
- Supabase als bevorzugte Backend-/Datenbank-Basis; konkrete Produktivarchitektur noch offen,
- Redaktions-Web-App mit Freigabeprozess,
- öffentliche Website ohne notwendiges Benutzerkonto,
- PWA,
- gerätebezogenes „Neu seit letztem Besuch“,
- Web Push nur nach Opt-in,
- modellunabhängige KI-Anbindung,
- organisationsgebundene Produktivkonten,
- mindestens zwei technische Administratoren,
- fachliche Regeln möglichst technisch absichern,
- Wissensstruktur **Ereignis → Meldung → Vorgang → Thema**,
- Sitzung als querliegender Beratungs- und Entscheidungskontext,
- Sachinformation und „Unsere Einordnung“ klar trennen,
- „Mehr wissen?“ als kontextgebundene Vertiefung,
- SEO, Erfolgsmessung und Kommunikation als Bestandteile des Zielsystems,
- Dashboard „small and simple“,
- digitaler und analoger Raum als gemeinsame Verbreitungslogik,
- Mobile First und WCAG 2.2 AA als technisches Ziel.

## 5. G1 – Produktumfang und MVP

Das MVP ist die erste wirklich produktiv betreibbare FIB-Version. Es wird nicht auf Kosten von Datenqualität, Quellenbindung, Redaktionsworkflow, Sicherheit, stabilen URLs oder fachlicher Struktur verkleinert.

### 5.1 MVP-Grundsatz

Zum MVP gehören Funktionen und Strukturen, die:

- den Kernnutzen von FIB ausmachen,
- die laufende Redaktion wesentlich entlasten,
- Datenmodell oder langfristige Informationsarchitektur prägen,
- für sicheren und nachvollziehbaren Produktivbetrieb erforderlich sind,
- oder später nur mit unverhältnismäßigem Umbau nachgerüstet werden könnten.

Nach dem Go-live werden vor allem Komfortfunktionen, zusätzliche Kanäle und Automatisierungen ergänzt, sofern sie die Grundarchitektur nicht verändern.

### 5.2 Quellenmonitor und KI-gestützte Inhaltserstellung

Die automatische Erstellung redaktioneller Entwürfe aus Fundstellen ist ein Kernfeature und Bestandteil des MVP.

Zielprozess:

`Quelle → Fundstelle → automatische Analyse → KI-gestützter Entwurf → redaktionelle Prüfung/Korrektur → Freigabe → Veröffentlichung`

Der Quellenmonitor muss zum Go-live mindestens:

- bekannte Pflichtquellen sowie definierte Orts- und Themenquellen automatisch überwachen,
- neue und geänderte Fundstellen persistent erkennen,
- Fundstellen deduplizieren,
- relevante Zusammenhänge und vorhandene FIB-Objekte berücksichtigen,
- Relevanz und mögliche Zuordnung zu Vorgängen, Themen, Sitzungen und Bezugsobjekten voranalysieren,
- aus geeigneten Fundstellen automatisch einen Meldungsentwurf oder Aktualisierungsvorschlag erzeugen,
- Quellen und Quellenrollen strukturiert mitführen,
- Sachinformation und politische Einordnung getrennt behandeln,
- Unsicherheiten und nicht ausreichend belegte Aussagen kennzeichnen,
- die Redaktion vor jeder Veröffentlichung prüfen und freigeben lassen.

Die Redaktion soll im Normalfall nicht bei einem leeren Text beginnen, sondern einen prüfbaren Entwurf erhalten.

Dieser Grundsatz gilt analog für:

- Anlage und Fortschreibung von Vorgängen,
- neue oder fortzuschreibende Themen,
- Vorschläge für „Unsere Einordnung“,
- geeignete „Mehr wissen?“-Fragen und vorbereitete Antworten.

„Unsere Einordnung“ bleibt trotz KI-Unterstützung eine ausdrücklich politische, redaktionell verantwortete Ebene und wird nicht automatisch ohne Freigabe veröffentlicht.

### 5.3 Funktionsstaffelung

#### MVP – erster produktiver Go-live

- Meldungen,
- Vorgänge,
- Themen,
- Sitzungen und TOPs,
- Quellen und strukturierte Quellenrollen,
- Bezugsobjekte und explizit geprüfte Beziehungen,
- Kategorien, Orte, Aliase und fachliche Schlagworte,
- Aktualisierungs- und Versionshistorie,
- stabile öffentliche URLs und Direktlinks,
- responsive, mobil optimierte und barrierearme Oberfläche,
- öffentliche Hauptnavigation `Meldungen | Themen | Sitzungen | Suchen`,
- zentrale Suche und grundlegende Filter,
- Redaktionssystem,
- Benutzerkonten, Rollen und Freigabeworkflow für die Redaktion,
- automatische Quellenbeobachtung und Fundstellenerkennung,
- KI-gestützte Relevanzprüfung, Ereigniserkennung und Zuordnung,
- automatische Entwurfserstellung für Meldungen und Aktualisierungen,
- KI-gestützte Vorgangs- und Themenfortschreibung,
- KI-Vorschläge für „Unsere Einordnung“ mit zwingender redaktioneller Freigabe,
- vorbereitete „Mehr wissen?“-Fragen und gespeicherte Antworten,
- strukturierte Trennung von Sachinformation und „Unsere Einordnung“,
- Bilder und Bildmetadaten,
- PWA-Grundfunktion,
- „Neu seit letztem Besuch“ ohne Benutzerkonto,
- Web Push nach Opt-in,
- Teilen, Social Preview und Drucken/PDF,
- Info-/Transparenzfunktion je öffentlicher Detailseite und zentrale Seite „Über FIB“,
- technische SEO-Grundlagen einschließlich sprechender URLs, Meta-Daten, Canonical, Sitemap und strukturierter Daten,
- grundlegende datensparsame Erfolgsmessung,
- Marketing-/Verbreitungssteuerung,
- kompaktes internes Dashboard für Betrieb, Nutzung und Kosten,
- modellunabhängige KI-Abstraktionsschicht,
- Regressionstests für kritische FIB-Regeln,
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
- differenziertere Push-Präferenzen,
- App-Icon-Badge soweit technisch unterstützt,
- eigener FIB-Newsletter bzw. weitergehende Newsletter-Integration,
- Mastodon-Integration und automatisierte Teaser,
- weitergehende Automatisierung von Vorgangs-/Themenfortschreibung,
- erweiterte Kanal- und Nutzungsauswertung,
- weitergehende Erfolgsmessung auf Basis realer Nutzung,
- zusätzliche Komfortfunktionen im Redaktionssystem,
- weitergehende automatische Qualitäts- und Konsistenzprüfungen,
- begrenztes Offline-Lesen bereits geladener Inhalte, sofern mit vertretbarem Aufwand möglich.

#### Spätere Erweiterungen / derzeit nicht MVP

- vollständige Offline-Nutzung mit bidirektionaler Synchronisation,
- komplexe Personalisierung für öffentliche Nutzer,
- umfangreiche Besucher-Benutzerkonten,
- komfortables Admin-UI für Providerwechsel, sofern technisch zunächst einfacher lösbar,
- Signal-Integration, sofern später Nutzen und Aufwand passen,
- weitere Verbreitungs- oder Social-Media-Kanäle ohne belegten Mehrwert,
- zusätzliche Funktionen, die erst aus realer Nutzung abgeleitet werden.

### 5.4 Ausdrückliche Nicht-Ziele der ersten Version

Das MVP soll nicht:

- eine allgemeine regionale Nachrichtenplattform werden,
- vollständig autonom veröffentlichen,
- redaktionelle Verantwortung ersetzen,
- eine komplexe Social-Media-Suite werden,
- vollständige Offline-Synchronisation anbieten,
- öffentliche Benutzerkonten als Voraussetzung für Lesen benötigen,
- personenbezogene Nutzungsprofile für Marketing aufbauen,
- jede theoretisch mögliche KI-Funktion bereits zum Go-live enthalten.

### 5.5 Wichtigste Aufwandstreiber

1. automatische, qualitativ belastbare Entwurfserstellung aus heterogenen Quellen,
2. Erkennung „neues Ereignis versus Aktualisierung“ und Meldung ↔ Vorgang,
3. Vorgangs- und Themenfortschreibung sowie n:m-Beziehungen/Wirkungsrollen,
4. klare Trennung und redaktionelle Verantwortung von Sachinformation und politischer Einordnung,
5. UX/Informationsarchitektur mit Auswirkungen auf das Datenmodell,
6. Redaktionsworkflow mit Rollen und Rechten,
7. PWA und Web Push,
8. SEO-taugliche stabile öffentliche Seiten,
9. Migration und Datenqualitätsprüfung des Demonstratorbestands,
10. modellunabhängige KI-Schicht mit Qualitäts- und Kostenkontrolle,
11. produktiver Betrieb mit Backup, Restore, Monitoring und organisationsgebundener Administration.

### 5.6 Freie Besucherfragen

Freie Live-KI-Fragen sind kein zwingender Bestandteil des ersten Go-live. Das MVP enthält vorbereitete „Mehr wissen?“-Fragen und gespeicherte Antworten. Die Architektur wird für spätere Live-Fragen vorbereitet.

### 5.7 Web Push

Web Push gehört zum MVP, weil freiwillige Bindung ein ausdrückliches Produktziel ist. Erweiterte Präferenzen können später folgen.

### 5.8 Offline-Fähigkeit

Vollständige Offline-Synchronisation ist kein MVP-Ziel. Redaktion und Datenpflege bleiben online. Begrenztes Offline-Lesen kann später ergänzt werden.

### 5.9 Abschluss G1

G1 ist abgeschlossen.

## 6. G2 – UX, Informationsarchitektur und Fachfunktionen

G2 ist in Arbeit und fachlich weitgehend konsolidiert.

Bereits festgelegt sind insbesondere:

- Hauptnavigation,
- Startseite,
- Meldungs-/Aktualisierungslogik,
- gemeinsame öffentliche Themen-/Vorgangsliste,
- Detailseiten für Meldung, Vorgang, Thema und Sitzung,
- Suche und Filter,
- „Mehr wissen?“,
- PWA / Neu seit letztem Besuch / Push,
- Teilen, Drucken und Social Preview,
- Transparenz / Über FIB / Disclaimer,
- Mobile First und WCAG 2.2 AA.

Offen bleiben:

1. visuelles Identitäts- und Bildkonzept,
2. abschließende Widerspruchs- und Vollständigkeitsprüfung.

Primärquelle: `docs/UX-und-Informationsarchitektur.md`.

## 7. Weitere Gründungspakete

### G3 – Fachliche Datenanforderungen und logisches Datenmodell
Entitäten, Beziehungen, Status, Historisierung, Quellen, Bezugsobjekte, Medien, Suche, Mehr-wissen-Daten und Migration.

### G4 – Schutzbedarf, Datenschutz und Offline-Modell
Datenarten, Sensitivität, Authentifizierung, Logging, Verschlüsselung, lokale Speicherung und Offline-Fähigkeit.

### G5 – Zielarchitektur und Technologie-Stack
Frontend-/Backend-Aufteilung, Framework, Programmiersprache, Supabase-Rolle, KI-Anbindung, Hosting, Routing und Deployment.

### G6 – Rollen, Rechte und Freigabeworkflow
Rollenmodell, Statusmodell, Freigaben, Veröffentlichung und technische Administration.

### G7 – Betrieb
Entwicklungs-, Test- und Produktivumgebung, Backup, Restore, Monitoring, Kostenkontrolle und Updateverfahren.

### G8 – Governance, Repository und Dokumentation
Zentrale Standards, Dokumentationsstruktur, Audit und Issues.

### G9 – Migration
Datenqualitätscheck, Transformation, Validierung und Übernahme der Demonstratordaten.

### G10 – Go-live-Abnahme
Fachliche Parität, UX-/Funktionsabnahme, Sicherheitsprüfung, Restore-Test, Rollenprüfung, PWA/SEO, Migration und Redaktions-Probelauf.

## 8. Dokumentationsübernahme Demonstrator → Echtsystem

Die identifizierten erforderlichen fachlichen Dokumentationen wurden in kanonische Echtsystem-Dokumente übernommen oder integriert.

Verbindliche Matrix: `docs/Dokumentationsuebernahme-Demonstrator.md`.

Vor dem formalen Abschluss stehen nur noch Querverweis-, Terminologie-, Widerspruchs- und Vollständigkeitsprüfung sowie die Frage, ob das visuelle Konzept ein eigenes Bild-/Rechtedokument benötigt.

## 9. Hosting- und Eigentumsgrundsatz

Das Repository liegt während der Entwicklung zunächst im persönlichen GitHub-Konto `PustefixReisen`.

Vor Produktivbetrieb wird die technische Eigentümerschaft so organisiert, dass keine persönliche Einzelperson einen Single Point of Failure bildet.

Das öffentliche Echtsystem soll auf Infrastruktur der GRÜNEN betrieben werden, soweit dies technisch sinnvoll und mit der Zielarchitektur vereinbar ist. Die Rahmenbedingungen werden in G5 erhoben.

## 10. Reihenfolge

1. G1 Produktumfang und MVP – **abgeschlossen**
2. G2 UX / Informationsarchitektur / Fachfunktionen – **in Arbeit**
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

## 11. Abschlusskriterium

Die Projektgründungsphase ist abgeschlossen, wenn die wesentlichen Grundentscheidungen dokumentiert, vertagte Entscheidungen mit Auslöser benannt, zentrale Standards klassifiziert, die Roadmap aktuell und keine für den Entwicklungsstart blockierende Grundsatzfrage mehr offen ist.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.3 | 30.09.2026 | Dokumentationshoheit des Echtsystems und aktuelle Meldungs-/Vorgangs-/Themenlogik übernommen; alte Presseschau-Terminologie im MVP entfernt; G2-Stand und Dokumentationsübernahme aktualisiert. |
| 1.2 | 29.09.2026 | G1 abgeschlossen: MVP-/Ausbaustufen-Abgrenzung, Nicht-Ziele und Aufwandstreiber festgelegt. |
| 1.1 | 29.09.2026 | G1-Kernentscheidungen ergänzt. |
| 1.0 | 29.09.2026 | Projektgründungsdokument angelegt. |
