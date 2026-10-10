# Projektgründung – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.5 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument führt die verbindlichen Entscheidungen der Projektgründungsphase des FIB-Echtsystems. Vor Beginn der Programmierung werden die wesentlichen Grundentscheidungen getroffen und dokumentiert. Danach folgt ein Gründungsaudit.

## 2. Ausgangslage

Der Demonstrator ist abgeschlossen und dient nur noch als historische, fachliche und visuelle Referenz.

Die für das Echtsystem weiterhin erforderlichen fachlichen und organisatorischen Grundlagen werden ausschließlich in den kanonischen Dokumenten dieses Repositories fortgeschrieben.

Verbindliche Übersichten:

- `docs/Dokumentation.md`
- `docs/Dokumentationsuebernahme-Demonstrator.md`
- `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- `docs/Regressionstests-Demonstratortransfer.md`

Der historische Übergabestand im Demonstrator bleibt Referenz, ist aber keine laufende Primärquelle des Echtsystems mehr.

Der G2.5-Transfer-Audit hat die ursprüngliche Dokumentationsübernahme gegen Demonstrator-Dokumente, Daten-/Fehlererkenntnisse, Spezialdokumente und relevante frühere Chats als Lückenfinder erneut geprüft. Das Transfer-Gate ist bestanden; fachliche Transferlücken gelten als geschlossen.

## 3. Grundsatz zur Weiterentwicklung

Fachliche Parität mit dem Demonstrator ist Mindestanforderung, aber nicht vollständiges Zielbild.

Das Echtsystem entwickelt insbesondere weiter:

- Wissensstruktur,
- UX und Informationsarchitektur,
- Suche und Vertiefung,
- Redaktionsworkflow,
- Quellenbeobachtung und KI-gestützte Quellenentdeckung/Aufbereitung,
- technische Persistenz und Betrieb.

UX- und Fachentscheidungen werden darauf geprüft, welche Anforderungen daraus für Datenmodell, Geschäftsregeln, Redaktion und Migration entstehen.

## 4. Bereits gesetzte Leitplanken

- separates Echtsystem-Repository,
- persistente PostgreSQL-Datenhaltung statt Demonstrator-JSON,
- Supabase als Backend-/Datenbank-Basis gemäß `docs/Zielarchitektur.md`,
- Redaktions-Web-App mit Freigabeprozess,
- öffentliche Website ohne notwendiges Benutzerkonto,
- PWA,
- gerätebezogenes „Neu seit letztem Besuch“,
- Web Push nur nach Opt-in,
- modellunabhängige KI-Anbindung,
- organisationsgebundene Produktivkonten,
- mindestens zwei technische Administratoren,
- fachliche Regeln möglichst technisch absichern,
- Wissensstruktur **Ereignis → Meldung → Vorgang → Thema** als vereinfachtes Lesemodell; konkrete Beziehungen/Kardinalitäten in `docs/Datenmodell.md`,
- Sitzung als querliegender Beratungs- und Entscheidungskontext,
- Sachinformation und „Unsere Einordnung“ klar trennen,
- `Bedeutung für das Thema` (`prägend | relevant | ergänzend`) statt früherer Wirkungsrollen-Taxonomie,
- Perspektiven und Wirkungen zur sachlichen Erklärung von Themenbezügen,
- „Mehr wissen?“ als quellengebundene kontextbezogene Vertiefung,
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
- aktiv neue relevante Quellen entdecken,
- den gestaffelten und thematisch erweiterten Suchraum berücksichtigen,
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

- Ereignisse als fachliche Basis und Meldungen als öffentliche Darstellung berichtenswerter Ereignisse,
- Vorgänge,
- Themen,
- Sitzungen und TOPs,
- Quellen und strukturierte Quellenrollen,
- Bezugsobjekte und explizit geprüfte Beziehungen,
- Kategorien, Orte, Aliase und fachliche Schlagworte,
- Aktualisierungs- und Versionshistorie,
- stabile öffentliche URLs und Direktlinks,
- responsive, mobil optimierte und barrierearme Oberfläche,
- öffentliche Hauptnavigation **`Neues | Im Blick | Sitzungen | Suche`**,
- zentrale Suche und grundlegende Filter,
- Redaktionssystem,
- Benutzerkonten, Rollen und Freigabeworkflow für die Redaktion,
- automatische Quellenbeobachtung und KI-gestützte Quellenentdeckung,
- KI-gestützte Relevanzprüfung, Ereigniserkennung und Zuordnung,
- automatische Entwurfserstellung für Meldungen und Aktualisierungen,
- KI-gestützte Vorgangs- und Themenfortschreibung,
- `Bedeutung für das Thema` mit verpflichtender redaktioneller Bestätigung,
- KI-Vorschläge für „Unsere Einordnung“ mit zwingender redaktioneller Freigabe,
- vorbereitete „Mehr wissen?“-Fragen und gespeicherte, quellengebundene Antworten,
- strukturierte Trennung von Sachinformation und „Unsere Einordnung“,
- Bilder und Bildmetadaten,
- PWA-Grundfunktion,
- „Neu seit letztem Besuch“ ohne Benutzerkonto; neue Meldungen und fachlich relevante Aktualisierungen zählen,
- Web Push nach Opt-in,
- Teilen, Social Preview und Drucken/PDF,
- Info-/Transparenzfunktion je öffentlicher Detailseite und zentrale Seite „Über FIB“,
- technische SEO-Grundlagen einschließlich sprechender URLs, Meta-Daten, Canonical, Sitemap und strukturierter Daten,
- grundlegende datensparsame Erfolgsmessung,
- Marketing-/Verbreitungssteuerung,
- kompaktes internes Dashboard für Betrieb, Nutzung und Kosten,
- modellunabhängige KI-Abstraktionsschicht,
- Regressionstests für kritische FIB-Regeln einschließlich des Demonstrator-Transferkorpus,
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
2. Erkennung „neues Ereignis versus Aktualisierung“ und Ereignis-/Vorgangszuordnung,
3. Vorgangs- und Themenfortschreibung sowie n:m-Beziehungen, `Bedeutung für das Thema`, Perspektiven und Wirkungen,
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

G2 ist **abgeschlossen**.

Verbindlich festgelegt sind insbesondere:

- öffentliche Hauptnavigation **Neues | Im Blick | Sitzungen | Suche**,
- Startseite,
- Meldungs-/Aktualisierungslogik,
- gemeinsame öffentliche Themen-/Vorgangsliste,
- Detailseiten für Meldung, Vorgang, Thema und Sitzung,
- Suche und Filter,
- „Mehr wissen?“,
- PWA / Neu seit letztem Besuch / Push,
- Teilen, Drucken und Social Preview,
- Transparenz / Über FIB / Disclaimer,
- visuelle Identität und responsive Bannerlogik,
- Mobile First und WCAG 2.2 AA.

Primärquellen: `docs/UX-und-Informationsarchitektur.md` und `docs/Visuelle-Identitaet-und-Bildkonzept.md`.

## 6.1 G2.5 – Transfer-Audit Demonstrator → Echtsystem

G2.5 ist **abgeschlossen**. Das Transfer-Gate wurde am 03.10.2026 fachlich bestanden.

Geprüft wurden:

- Demonstrator-Dokumentation,
- Datenbestand und sichtbares Verhalten,
- Betriebs-/Update-/Fehlererkenntnisse,
- Spezial- und Übergabedokumente,
- relevante frühere FIB-Chats als Lückenfinder.

Gefundene fachliche Lücken wurden in die zuständigen Echtsystem-Primärquellen übernommen. Wesentliche Referenzfälle sind in `docs/Regressionstests-Demonstratortransfer.md` dokumentiert.

Die daraus entstandenen fachlichen Folgeaufträge sind in G3–G10 übernommen und dort abgeschlossen bzw. als Umsetzungs-/Go-live-Aufgaben weitergeführt.

## 7. Weitere Gründungspakete

G3 bis G10 sind abgeschlossen. Die verbindlichen Detailentscheidungen stehen ausschließlich in den jeweiligen Primär- und Abschlussdokumenten; dieses Projektgründungsdokument führt nur den konsolidierten Status.

- **G3 – Datenanforderungen / Datenmodell:** abgeschlossen; `docs/Datenmodell.md` v3.0 und `docs/G3-Gesamtaudit.md`.
- **G4 – Schutzbedarf / Datenschutz / Offline:** abgeschlossen; `docs/Schutzbedarf-Datenschutz-und-Offline.md` v1.0.
- **G5 – Zielarchitektur / Stack / Hosting / Deployment:** abgeschlossen; `docs/Zielarchitektur.md` v1.0 und `docs/G5-Gesamtaudit.md`.
- **G6 – Rollen / Rechte / Workflow:** abgeschlossen; `docs/Rollen-Rechte-und-Workflow.md` v1.0 und `docs/G6-Gesamtaudit.md`.
- **G7 – Betrieb:** abgeschlossen; `docs/Betrieb-und-Wiederherstellung.md` und `docs/G7-Gesamtaudit.md`.
- **G8 – Governance / Repository / Dokumentation:** abgeschlossen; `docs/Dokumentation.md` v3.0 und `docs/G8-Governance-und-Dokumentationsaudit.md`.
- **G9 – Migration:** abgeschlossen; `docs/Migrationsstrategie.md` v1.1, `docs/Migrations-Runbook.md` v1.0 und `docs/G9-Gesamtaudit.md`.
- **G10 – Go-live-Abnahme:** abgeschlossen; `docs/Go-live-Abnahmekriterien.md` v1.0 und `docs/G10-Gesamtaudit.md`.

Nach dem Gründungsaudit wird zusätzlich ein **Umsetzungs-Vollständigkeitsaudit** geführt. Es prüft dokumentierte Fachregeln nicht erneut fachlich, sondern auf vollständige operative Übertragung in Datenhaltung, Fachfunktionen, Ausführung/UI und Tests. Die technische Umsetzung darf parallel dort fortgesetzt werden, wo keine offene fachbereichsspezifische Lücke besteht.

## 8. Dokumentationsübernahme Demonstrator → Echtsystem

Die erforderlichen fachlichen Dokumentationen wurden in kanonische Echtsystem-Dokumente übernommen oder integriert und unter G2.5 erneut auf Vollständigkeit und Konsistenz geprüft.

Verbindliche Quellen:

- `docs/Dokumentationsuebernahme-Demonstrator.md`
- `docs/Transfer-Audit-Demonstrator-Echtsystem.md`
- `docs/Regressionstests-Demonstratortransfer.md`

Die Dokumentationsübernahme ist **abgeschlossen**.

## 9. Hosting- und Eigentumsgrundsatz

Das Repository liegt während der Entwicklung zunächst im persönlichen GitHub-Konto `PustefixReisen`.

Vor Produktivbetrieb wird die technische Eigentümerschaft so organisiert, dass keine persönliche Einzelperson einen Single Point of Failure bildet.

Das öffentliche Echtsystem soll gemäß Zielarchitektur und Migrationsstrategie auf organisationskontrollierter GRÜNEN-Infrastruktur betrieben werden.

## 10. Reihenfolge und Status

1. G1 Produktumfang und MVP – **abgeschlossen**
2. G2 UX / Informationsarchitektur / Fachfunktionen – **abgeschlossen**
3. G2.5 Transfer-Audit Demonstrator → Echtsystem – **abgeschlossen**
4. G3 Datenanforderungen / Datenmodell – **abgeschlossen**
5. G4 Schutzbedarf / Datenschutz / Offline – **abgeschlossen**
6. G5 Zielarchitektur / Stack / Hosting / Deployment – **abgeschlossen**
7. G6 Rollen / Rechte / Workflow – **abgeschlossen**
8. G7 Betrieb – **abgeschlossen**
9. G8 Governance / Repository / Dokumentation – **abgeschlossen**
10. G9 Migration – **abgeschlossen**
11. G10 Go-live-Abnahme – **abgeschlossen**
12. Gründungsaudit – **in Arbeit**
13. technische Umsetzung U1–U6 – **noch nicht begonnen**

## 11. Abschlusskriterium

Die Projektgründungsphase ist abgeschlossen, wenn die wesentlichen Grundentscheidungen dokumentiert, vertagte Entscheidungen mit Auslöser benannt, zentrale Standards klassifiziert, die Roadmap aktuell und keine für den Entwicklungsstart blockierende Grundsatzfrage mehr offen ist.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.5 | 06.10.2026 | G3–G10 auf abgeschlossenen Stand konsolidiert; veraltete Phasenstände entfernt; Gründungsaudit als aktiven nächsten Schritt gesetzt. |
| 1.4 | 03.10.2026 | Projektgründung nach G2-/G2.5-Abschluss konsolidiert: aktuelle Navigation, Ereignis-/Meldungslogik, Bedeutung-für-das-Thema-Modell, Transfer-Audit, Regressionstestkorpus und aktiven G3-Stand übernommen; alte Wirkungsrollen- und G2-Offenstände entfernt. |
| 1.3 | 30.09.2026 | Dokumentationshoheit des Echtsystems und aktuelle Meldungs-/Vorgangs-/Themenlogik übernommen; alte Presseschau-Terminologie im MVP entfernt; G2-Stand und Dokumentationsübernahme aktualisiert. |
| 1.2 | 29.09.2026 | G1 abgeschlossen: MVP-/Ausbaustufen-Abgrenzung, Nicht-Ziele und Aufwandstreiber festgelegt. |
| 1.1 | 29.09.2026 | G1-Kernentscheidungen ergänzt. |
| 1.0 | 29.09.2026 | Projektgründungsdokument angelegt. |