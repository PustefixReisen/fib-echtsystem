# G3-Gesamtaudit – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument prüft vor Abschluss von G3, ob die fachlichen Daten- und Teilmodelle des FIB-Echtsystems widerspruchsfrei, vollständig und ausreichend eindeutig für die anschließende technische/physische Modellierung sind.

Geprüft werden insbesondere:

- Wissenskern `Ereignis → Meldung → Vorgang → Thema`,
- Wirkungs- und Bewertungsmodell,
- Sitzung/TOP/Beschluss,
- Quellen/Fundstellen,
- Recherche und Beobachtungsaufträge,
- Referenzwissen und Referenzmaßstäbe,
- offene Fragen/Wissenslücken,
- Bilder und öffentliche Dateinutzung,
- „Mehr wissen?“,
- Lebenszyklus und Historisierung,
- Fachfunktionen und Zugriffsarchitektur,
- Rollen, Freigaben und Plausibilitätslogik.

## 2. Auditmaßstab

G3 gilt fachlich als konsolidierbar, wenn:

1. jeder zentrale Sachverhalt genau eine verbindliche Primärquelle besitzt,
2. spezialisierte Teilmodelle dem aktuellen Gesamtkonzept nicht widersprechen,
3. alle MVP-Fachobjekte und wesentlichen Beziehungen fachlich beschrieben sind,
4. Status-, Freigabe-, Rücknahme- und Historisierungslogik hinreichend bestimmt ist,
5. alle regulären fachlichen Zugriffe über die gemeinsame Fachfunktionsschicht abbildbar sind,
6. verbleibende offene Punkte ausschließlich technische/physische Umsetzung betreffen.

## 3. Gefundene und bereits behobene Inkonsistenzen

### 3.1 Meldung ↔ Sitzung/TOP

**Befund:** Das ältere Sitzungsmodell erlaubte eigenständige Beziehungen `Meldung ↔ Sitzung` und `Meldung ↔ TOP`, während das konsolidierte Datenmodell diese Information aus `Meldung → Ereignis → TOP/Sitzung` ableitet.

**Bewertung:** Redundante zweite fachliche Wahrheit.

**Korrektur:** `docs/Sitzungs-und-Beschlussmodell.md` v1.1 und `docs/Persistenz-und-Lebenszyklusmodell.md` v1.1 wurden auf die abgeleitete Beziehung konsolidiert.

**Status:** behoben.

### 3.2 Verankerung von Wirkungen

**Befund:** `docs/Wirkungsmodell.md` v1.0 ordnete Wirkungen ausschließlich Vorgang/Thema zu. Das neuere `docs/Datenmodell.md` und `docs/Redaktionsworkflow.md` verankern Wirkung dagegen am Ereignis und speichern zusätzlich den Herkunftskontext.

**Bewertung:** Struktureller Widerspruch mit Auswirkungen auf Datenmodell, Themenanalyse und Fachfunktionen.

**Korrektur:** `docs/Wirkungsmodell.md` v1.1 wurde an die konsolidierte Entscheidung angepasst:

> Wirkung ist am Ereignis verankert; der Herkunftskontext bestimmt, wo sie fachlich geändert werden darf.

**Status:** behoben.

### 3.3 Beobachtungsauftrag und Recherchelauf

**Befund:** Die Recherchearchitektur war fachlich geklärt, im zentralen Datenmodell jedoch noch als offen markiert.

**Korrektur:** `docs/Beobachtungs-und-Recherchemodell.md` v1.0 definiert Beobachtungsauftrag und Recherchelauf als getrennte Objekte, genau einen Primärbezug je Beobachtungsauftrag sowie die Provenienzkette über Fundstellen.

**Status:** fachlich geklärt; im zentralen `Datenmodell.md` noch redaktionell nachzuziehen.

### 3.4 „Mehr wissen?“

**Befund:** Das Feature war fachlich vorgesehen, aber Frage, Antwort, Quellenbindung, Aktualität, Versionierung und Freigabe waren nicht als geschlossenes Datenmodell beschrieben.

**Korrektur:** `docs/Mehr-wissen-Modell.md` v1.0 definiert Vertiefungsfrage und Vertiefungsantwort als getrennte, quellengebundene Fachobjekte.

**Status:** fachlich geklärt; im zentralen `Datenmodell.md` noch redaktionell nachzuziehen.

### 3.5 Blockierende Regeln versus Plausibilitätsprüfung

**Befund:** Das Datenmodell führte die Abgrenzung als offene G3-Frage.

**Korrektur:** `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md` v1.0 legt fest:

- objektiv unzulässiger Zustand → blockierende serverseitige Fachregel,
- semantische Auffälligkeit mit Entscheidungsspielraum → sichtbarer Prüfhinweis und redaktionelle Entscheidung.

**Status:** behoben.

### 3.6 Rechte/Freigabe für Dateien und Bilder

**Befund:** Öffentliche Bereitstellung und Rechte waren grundsätzlich getrennt, aber der minimale fachliche Freigabemechanismus war noch offen.

**Korrektur:** `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md` v1.0 definiert positive Rechteklärung als zwingende Voraussetzung für öffentliche Bereitstellung und öffentliche Bildverwendung. Öffentliche Freigabe ist S3.

**Status:** fachlich behoben; konkrete technische Rechtefelder folgen im physischen Modell.

## 4. Bereiche ohne festgestellten konzeptionellen Bruch

Im bisherigen Audit sind folgende Kernentscheidungen miteinander vereinbar:

- Ereignis und Meldung bleiben getrennt; Meldung gehört genau zu einem Ereignis.
- Ereignis kann ohne Vorgang bestehen; Vorgangszwang bei Ereignisbestätigung besteht nicht.
- Vorgang↔Thema ist n:m; zusätzliche direkte Ereignis↔Thema-Beziehung bleibt für Einzelereignisse möglich.
- Themen entstehen bottom-up und werden nicht stillschweigend durch KI angelegt.
- strukturierter Redaktionsstand ist fachliche Quelle; Textfassung ist abgeleitet.
- Vorgang/Thema werden über bestätigte strukturierte Gesamtstände versioniert; Analysebestandteile erhalten keine parallelen Versionsketten.
- offene Frage/Wissenslücke ist von „Mehr wissen?“ getrennt.
- Referenzwissen bleibt schlank und FIB-spezifisch; allgemeines Weltwissen wird nicht dupliziert.
- Referenzmaßstäbe steuern Fragen und Einordnung, nicht die Tatsachenbasis.
- AI Task, AI Task Run, Beobachtungsauftrag und Recherchelauf sind fachlich getrennt.
- Web-App, FIB-Chat und AI Tasks verwenden dieselbe Fachfunktionsschicht.
- AI Tasks dürfen vorbereiten und vorschlagen, aber keine redaktionelle Entscheidung ersetzen.
- S0–S3, Optimistic Concurrency, serverseitige Durchsetzung und Audit sind mit den Fachfunktionen vereinbar.
- der konsolidierte MVP-Fachfunktionskatalog deckt die notwendigen redaktionellen Fachaktionen ab.

## 5. Noch offene Konsolidierungsarbeit vor G3-Abschluss

### 5.1 Zentrales `Datenmodell.md` nachziehen

`docs/Datenmodell.md` v2.1 enthält noch einen veralteten Abschnitt „Offene G3-Fragen“. Mehrere dieser Punkte sind inzwischen in spezialisierten Primärquellen entschieden.

Vor formellem G3-Abschluss muss eine neue konsolidierte Fassung des Datenmodells mindestens:

- Beobachtungsauftrag/Recherchelauf als geklärtes Teilmodell referenzieren,
- „Mehr wissen?“ als geklärtes Teilmodell referenzieren,
- Plausibilitäts- und Freigaberegeln referenzieren,
- fachliche Persistenz vs. technische Betriebsdaten als geklärt markieren,
- nur tatsächlich verbleibende technische/physische Fragen offen lassen.

Dies ist primär Dokumentenkonsolidierung; derzeit ist daraus keine neue fachliche Grundsatzentscheidung erkennbar.

### 5.2 Dokumentationslandkarte aktualisieren

Die neu entstandenen G3-Primärquellen müssen in `docs/Dokumentation.md` aufgenommen werden:

- `docs/Beobachtungs-und-Recherchemodell.md`,
- `docs/Mehr-wissen-Modell.md`,
- `docs/MVP-Fachfunktionen.md`,
- `docs/KI-Zugangswege-und-Fachfunktionen.md`,
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`,
- dieses Auditdokument.

### 5.3 Begriffsregister prüfen

Vor G3-Abschluss ist zu prüfen, ob mindestens folgende inzwischen verbindliche Begriffe im `docs/Begriffe.md` vorhanden und aktuell definiert sind:

- Beobachtungsauftrag,
- Recherchelauf,
- AI Task / AI Task Run,
- Vertiefungsfrage / Vertiefungsantwort,
- Referenzmaßstab,
- Fachfunktion,
- Aktionsstufen S0–S3.

Fehlende Begriffe sind nachzuziehen; die fachlichen Definitionen selbst werden nicht im Glossar neu erfunden.

## 6. Nicht mehr als G3-Fachfrage zu behandeln

Folgende Punkte gehören nach dem Audit in die nachfolgende technische/physische Modellierung bzw. in Betrieb/Sicherheit:

- PostgreSQL-/Supabase-Tabellen und Datentypen,
- Primär-/Fremdschlüssel und technische Relationstabellen,
- Indizes und Such-/Vector-Strukturen,
- konkrete API-/JSON-Schemas,
- RLS/Policies und technische Authentifizierung,
- konkrete Admin-Service-Endpunkte,
- technische Aufbewahrungsfristen für Logs/Caches,
- Deployment, Backup/Restore und Monitoring,
- konkrete Provider-/Modellkonfiguration des KI-Routers.

Diese Punkte dürfen G3 nicht künstlich offen halten, solange die fachlichen Anforderungen dafür eindeutig sind.

## 7. Vorläufiges Auditurteil

> **Das fachliche G3-Modell ist inhaltlich weitgehend geschlossen. Es wurden zwei erhebliche Alt-Widersprüche gefunden und behoben. Die zuvor offenen Teilmodelle Beobachtung/Recherche, „Mehr wissen?“, Plausibilitätslogik und Medienfreigabe sind inzwischen fachlich entschieden.**

Ein formeller G3-Abschluss sollte noch **nicht** erklärt werden, bevor die drei Konsolidierungsarbeiten aus Abschnitt 5 erledigt und anschließend ein kurzer Schlusscheck durchgeführt sind.

Es ist derzeit **keine neue Grundsatzentscheidung des Nutzers** erkennbar, die für diese Restarbeiten erforderlich wäre.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 05.10.2026 | G3-Gesamtaudit gestartet; zentrale Teilmodelle gegeneinander geprüft; Widersprüche bei Meldung↔Sitzung/TOP und Wirkung identifiziert und behoben; Beobachtung/Recherche, „Mehr wissen?“, Plausibilitätslogik und Medienfreigabe als fachlich geklärt bewertet; verbleibende Konsolidierungsarbeiten vor G3-Abschluss festgelegt. |
