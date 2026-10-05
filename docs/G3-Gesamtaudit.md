# G3-Gesamtaudit – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

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

G3 gilt fachlich als abgeschlossen, wenn:

1. jeder zentrale Sachverhalt genau eine verbindliche Primärquelle besitzt,
2. spezialisierte Teilmodelle dem aktuellen Gesamtkonzept nicht widersprechen,
3. alle MVP-Fachobjekte und wesentlichen Beziehungen fachlich beschrieben sind,
4. Status-, Freigabe-, Rücknahme- und Historisierungslogik hinreichend bestimmt ist,
5. alle regulären fachlichen Zugriffe über die gemeinsame Fachfunktionsschicht abbildbar sind,
6. verbleibende offene Punkte ausschließlich technische/physische Umsetzung betreffen.

## 3. Gefundene und behobene Inkonsistenzen

### 3.1 Meldung ↔ Sitzung/TOP

**Befund:** Das ältere Sitzungsmodell erlaubte eigenständige Beziehungen `Meldung ↔ Sitzung` und `Meldung ↔ TOP`, während das konsolidierte Datenmodell diese Information aus `Meldung → Ereignis → TOP/Sitzung` ableitet.

**Bewertung:** Redundante zweite fachliche Wahrheit.

**Korrektur:** `docs/Sitzungs-und-Beschlussmodell.md` und `docs/Persistenz-und-Lebenszyklusmodell.md` wurden auf die abgeleitete Beziehung konsolidiert.

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

**Status:** fachlich geklärt; die veraltete Offen-Markierung im zentralen `Datenmodell.md` ist noch redaktionell zu entfernen.

### 3.4 „Mehr wissen?“

**Befund:** Das Feature war fachlich vorgesehen, aber Frage, Antwort, Quellenbindung, Aktualität, Versionierung und Freigabe waren nicht als geschlossenes Datenmodell beschrieben.

**Korrektur:** `docs/Mehr-wissen-Modell.md` v1.0 definiert Vertiefungsfrage und Vertiefungsantwort als getrennte, quellengebundene Fachobjekte.

**Status:** fachlich geklärt; im zentralen `Datenmodell.md` noch als konsolidierter Teilmodellverweis nachzuziehen.

### 3.5 Blockierende Regeln versus Plausibilitätsprüfung

**Befund:** Das Datenmodell führte die Abgrenzung als offene G3-Frage.

**Korrektur:** `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md` v1.0 legt fest:

- objektiv unzulässiger Zustand → blockierende serverseitige Fachregel,
- semantische Auffälligkeit mit Entscheidungsspielraum → sichtbarer Prüfhinweis und redaktionelle Entscheidung.

**Status:** behoben; im zentralen `Datenmodell.md` ist nur noch die alte Offen-Markierung zu bereinigen.

### 3.6 Rechte/Freigabe für Dateien und Bilder

**Befund:** Öffentliche Bereitstellung und Rechte waren grundsätzlich getrennt, aber der minimale fachliche Freigabemechanismus war noch offen.

**Korrektur:** `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md` v1.0 definiert positive Rechteklärung als zwingende Voraussetzung für öffentliche Bereitstellung und öffentliche Bildverwendung. Öffentliche Freigabe ist S3.

**Status:** fachlich behoben; konkrete technische Rechtefelder folgen im physischen Modell.

### 3.7 Beschlussvorlage und Beschluss als Ereignis

**Befund:** Das Sitzungs- und Beschlussmodell behandelte eine Beschlussvorlage und die spätere Beschlussfassung noch als dasselbe übergeordnete Ereignis in unterschiedlichen Zuständen. Das widersprach dem allgemeinen Ereignisbegriff und dem zentralen Datenmodell, nach denen Veröffentlichung einer Vorlage und spätere Behandlung/Beschlussfassung getrennte reale Entwicklungen sind.

**Bewertung:** Struktureller Widerspruch; außerdem Vermischung von Dokument/Fundstelle und Ereignis.

**Korrektur:** `docs/Sitzungs-und-Beschlussmodell.md` v1.2 legt fest:

- Beschlussvorlage = Dokument/Fundstelle,
- Veröffentlichung einer fachlich relevanten Vorlage = mögliches eigenes Ereignis,
- spätere Beratung, Vertagung/Absetzung und Beschlussfassung = spätere reale Entwicklungsschritte/Ereignisse,
- Beschlusspunkte und Abstimmungen gehören zum späteren Behandlungs-/Beschlussereignis,
- der ursprüngliche Beschlussvorschlag bleibt als Vergleichsgrundlage erhalten.

**Status:** behoben.

## 4. Bereiche ohne festgestellten konzeptionellen Bruch

Nach den Korrekturen sind folgende Kernentscheidungen miteinander vereinbar:

- Ereignis und Meldung bleiben getrennt; Meldung gehört genau zu einem Ereignis.
- Dokument/Fundstelle und Ereignis sind getrennt; die Veröffentlichung eines Dokuments kann selbst ein Ereignis sein.
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

## 5. Konsolidierungsarbeiten vor formellem G3-Abschluss

### 5.1 Zentrales `Datenmodell.md` redaktionell konsolidieren – noch offen

`docs/Datenmodell.md` v2.1 enthält noch den inzwischen veralteten Abschnitt „Offene G3-Fragen“. Die dort genannten fachlichen Punkte sind inzwischen in spezialisierten Primärquellen entschieden.

Vor dem formellen G3-Abschluss ist eine neue konsolidierte Fassung des Datenmodells erforderlich, die mindestens:

- Beobachtungsauftrag/Recherchelauf als geklärtes Teilmodell referenziert,
- „Mehr wissen?“ als geklärtes Teilmodell referenziert,
- Plausibilitäts- und Freigaberegeln referenziert,
- fachliche Persistenz vs. technische Betriebsdaten als geklärt markiert,
- nur tatsächlich verbleibende technische/physische Fragen offen lässt.

Dies ist Dokumentenkonsolidierung; daraus ist derzeit keine neue fachliche Grundsatzentscheidung erkennbar.

### 5.2 Dokumentationslandkarte aktualisieren – erledigt

`docs/Dokumentation.md` v2.5 enthält nun die neuen G3-Primärquellen und dieses Auditdokument.

**Status:** erledigt.

### 5.3 Begriffsregister prüfen – erledigt

`docs/Begriffe.md` wurde ergänzt bzw. aktualisiert um insbesondere:

- Beobachtungsauftrag,
- Recherchelauf,
- AI Task / AI Task Run,
- Vertiefungsfrage / Vertiefungsantwort,
- Fachfunktion,
- Aktionsstufen S0–S3.

Zusätzlich wurden überholte Offenformulierungen bei Bewertung und politischem Bezug an den aktuellen G3-Stand angepasst.

**Status:** erledigt.

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

## 7. Aktuelles Auditurteil

> **Das fachliche G3-Modell ist inhaltlich geschlossen. Im Audit wurden drei erhebliche Alt-Widersprüche gefunden und fachlich behoben. Die zuvor offenen Teilmodelle Beobachtung/Recherche, „Mehr wissen?“, Plausibilitätslogik und Medienfreigabe sind entschieden. Dokumentationslandkarte und Begriffsregister sind konsolidiert.**

Ein formeller G3-Abschluss wird noch nicht erklärt, solange `docs/Datenmodell.md` v2.1 seine inzwischen veralteten Offen-Markierungen enthält. Diese verbleibende Arbeit ist redaktionelle Konsolidierung der zentralen Primärquelle, keine neue fachliche Modellentscheidung.

Nach dieser Konsolidierung genügt ein letzter Querverweis-/Statuscheck. Wenn dabei kein neuer Widerspruch auftritt, kann G3 als **Abgeschlossen** markiert und die technische/physische Modellierung vorbereitet werden.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 05.10.2026 | Zweiten Auditdurchgang dokumentiert: zusätzlicher struktureller Widerspruch Vorlage/Beschluss als dasselbe Ereignis erkannt und im Sitzungsmodell v1.2 behoben; Dokumentationslandkarte und Begriffsregister konsolidiert; Auditurteil auf „fachlich geschlossen, zentrale Datenmodell-Konsolidierung noch offen“ präzisiert. |
| 1.0 | 05.10.2026 | G3-Gesamtaudit gestartet; zentrale Teilmodelle gegeneinander geprüft; Widersprüche bei Meldung↔Sitzung/TOP und Wirkung identifiziert und behoben; Beobachtung/Recherche, „Mehr wissen?“, Plausibilitätslogik und Medienfreigabe als fachlich geklärt bewertet; verbleibende Konsolidierungsarbeiten vor G3-Abschluss festgelegt. |