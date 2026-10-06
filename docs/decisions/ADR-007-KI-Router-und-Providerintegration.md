# ADR-007 – KI-Router und Providerintegration

## Status

**Angenommen** – 06.10.2026

## Kontext

FIB soll mehrere KI-Anbieter und Modelle nutzen können. Die Fachfunktionen dürfen weder an einen konkreten Anbieter noch an einen Modellnamen gekoppelt sein. Gleichzeitig müssen Qualität, Kosten, Datenschutz/Schutzklasse, Ausfallsicherheit und spätere Austauschbarkeit berücksichtigt werden.

G4 hat bereits festgelegt:

- K3 darf niemals an externe KI übermittelt werden.
- K2 darf nur über ausdrücklich dafür freigegebene Betriebswege verarbeitet werden.
- Schutzklasse und Personenbezug werden getrennt betrachtet.
- Providerfreigaben müssen sich auf konkrete Verarbeitungswege beziehen.

Außerdem gilt für FIB:

> KI wird nur dort eingesetzt, wo sie fachlich erforderlich ist oder einen klaren zusätzlichen Nutzen bringt. Wird KI eingesetzt, hat die erforderliche Ergebnisqualität Vorrang vor dem niedrigsten Preis.

## Entscheidung

FIB erhält einen zentralen **KI-Router**. Alle produktiven KI-Aufrufe aus Fachservices, FIB-Chat und AI Tasks laufen über diesen Router.

Die Fachfunktion beschreibt nur die fachlichen Anforderungen an den KI-Aufruf; der Router wählt daraus einen zulässigen Betriebsweg.

### 1. Routing nach Aufgabenklasse

Mindestens folgende Aufgabenklassen werden unterschieden:

- Quellenentdeckung,
- Fundstellen-/Dokumentanalyse,
- Relevanz- und Ereigniserkennung,
- Zuordnungs-/Strukturierungsvorschläge,
- Recherche/Vertiefung,
- Zusammenfassung/RAG,
- redaktionelle Textentwürfe,
- Plausibilitäts-/Qualitätsprüfung,
- FIB-Chat-Orchestrierung.

Weitere Klassen können später ergänzt werden, ohne Fachfunktionen an konkrete Provider zu koppeln.

### 2. Routingparameter

Der Router berücksichtigt mindestens:

- Aufgabenklasse,
- erforderliche Qualitäts-/Leistungsklasse,
- Schutzklasse K0–K3,
- Personenbezug und ggf. Art.-9-Relevanz,
- für diese Verarbeitung freigegebene Provider/Modelle/Betriebswege,
- erforderliche Fähigkeiten, z. B. strukturiertes Outputformat, Toolnutzung, große Kontexte,
- Kosten- bzw. Tokenrahmen,
- zulässige Fallbacks,
- notwendige Review-/Freigabestufe.

### 3. Qualitätsklassen statt Modellnamen

Fachfunktionen fordern keine festen Modellnamen an, sondern eine fachliche Leistungs-/Qualitätsklasse.

Beispielhafte Klassen:

- **Q1 – leicht:** Klassifikation, Extraktion, einfache Formatierung, kostensensitive Massenaufgaben,
- **Q2 – anspruchsvoll:** Zuordnung, Zusammenfassung, strukturierte Analyse, normale Recherche,
- **Q3 – hoch:** komplexe fachliche Abwägung, schwierige Quellenlage, anspruchsvolle Synthese oder Qualitätsprüfung.

Die konkrete Zuordnung von Modellen zu Q1–Q3 ist Konfiguration und kann nach Regressionstests geändert werden.

### 4. Mehranbieterbetrieb

Mindestens zwei Provider müssen technisch parallel konfigurierbar sein.

Dabei gilt:

- Ein Provider kann Primärweg für bestimmte Aufgaben sein und für andere nicht.
- Ein günstigeres Modell darf für geeignete Q1/Q2-Aufgaben eingesetzt werden.
- Für Q3 hat die erforderliche Qualität Vorrang vor Kostenoptimierung.
- Ein Providerwechsel darf keine Änderung des Fachmodells oder der Fachfunktionen erfordern.
- Fallbacks dürfen nur auf ebenfalls datenschutz- und schutzklassenkonforme Betriebswege erfolgen.

### 5. Providerfreigabe als Betriebsweg

Freigegeben wird nicht pauschal „Provider X“, sondern ein konkreter Betriebsweg, mindestens beschrieben durch:

- Provider,
- Region/Endpoint soweit relevant,
- Modell oder Modellgruppe,
- Aufgabentypen,
- zulässige Schutzklassen,
- zulässige Arten personenbezogener Daten,
- Aufbewahrungs-/Loggingbedingungen,
- vertragliche/DSGVO-relevante Voraussetzungen,
- Status aktiv / gesperrt / Testbetrieb.

Dadurch kann derselbe Anbieter beispielsweise für K0/K1 erlaubt, für K2 aber gesperrt sein.

### 6. EU-/Datenschutzanforderungen

Für K1/K2 wird ein Betriebsweg nur freigegeben, wenn die in G4 definierten Datenschutzanforderungen erfüllt und dokumentiert sind.

Aktuelle Providermerkmale dürfen nicht als dauerhafte Architekturannahme hart codiert werden. Beispielsweise bieten Anbieter unterschiedliche EU-Residenz-/Verarbeitungsoptionen und Subprozessorregime; diese können sich ändern. Die Freigabe wird deshalb regelmäßig überprüfbar dokumentiert.

### 7. Fallbacklogik

Fallback erfolgt gestuft:

1. bevorzugtes freigegebenes Modell,
2. alternatives Modell desselben freigegebenen Betriebswegs,
3. alternativer freigegebener Provider/Betriebsweg,
4. kein zulässiger Fallback → Run endet kontrolliert bzw. wird zur redaktionellen Bearbeitung markiert.

Ein Fallback darf niemals Schutzklasse, Personenbezug oder Freigaberegeln abschwächen.

### 8. Qualitätsprüfung und Regressionstests

Die Zuordnung von Aufgaben zu Modellen/Providern wird nicht nur nach Preis entschieden.

Verbindlich:

- feste FIB-Referenzfälle/Regressionstests,
- Bewertung nach fachlicher Qualität, Quellenbindung, Strukturtreue und Fehlerverhalten,
- Kostenmessung pro Aufgabenklasse,
- Modell-/Providerwechsel erst nach erfolgreicher Qualitätsprüfung,
- Pilotmessung zur Kalibrierung der Routingmatrix.

### 9. Logging und Kosten

Pro KI-Aufruf werden nur die für Betrieb und Nachvollziehbarkeit erforderlichen technischen Metadaten erfasst, insbesondere:

- Aufgabenklasse,
- Betriebsweg/Provider/Modell,
- Lauf-/Korrelations-ID,
- Zeitpunkt und Dauer,
- Token-/Kostenwerte soweit verfügbar,
- Ergebnisstatus und Fehlerklasse,
- verwendete Qualitätsklasse,
- Schutzklasseneinstufung des übertragenen Kontextes.

Vollständige Prompts und Antworten werden nicht pauschal dauerhaft als technisches Log archiviert. Fachlich relevante Ergebnisse werden über die vorgesehenen FIB-Objekte persistiert.

### 10. Kostensteuerung

Der Router unterstützt:

- Kostenrahmen je Aufgabenklasse,
- Warnschwellen,
- bevorzugte kostengünstige Wege bei gleichwertiger Qualität,
- Eskalation auf leistungsstärkere Modelle bei Bedarf,
- Messbarkeit realer Monatskosten.

Der bestehende Planungs-/Warnrahmen aus `docs/KI-Betrieb-und-Kosten.md` bleibt Grundlage bis zur Pilotkalibrierung.

## Konsequenzen

### Vorteile

- Fachlogik bleibt provider- und modellunabhängig.
- Zwei oder mehr Anbieter können parallel genutzt werden.
- Kostenoptimierung erfolgt kontrolliert, ohne Qualität pauschal abzusenken.
- Datenschutz-/Schutzklassenregeln greifen zentral.
- Provider- oder Modellwechsel werden technisch einfach.
- Ausfälle einzelner Anbieter können abgefedert werden.

### Nachteile / zusätzlicher Aufwand

- Routingmatrix und Providerfreigaben müssen gepflegt werden.
- Regressionstests und Qualitätsmessung sind Voraussetzung für sinnvolle Wechsel.
- Mehranbieterbetrieb erhöht Konfigurations- und Betriebsaufwand leicht.

## Nicht Teil dieser Entscheidung

Noch nicht festgelegt werden:

- konkrete Modellnamen je Aufgabenklasse,
- endgültige Verteilung OpenAI/Mistral/weitere Anbieter,
- konkrete Preisgrenzen je Einzelaufruf,
- endgültige K2-Freigabe eines Providers.

Diese Werte werden in Pilotbetrieb und G7 anhand aktueller Verträge, Datenschutzbedingungen, Qualität und gemessener Kosten festgelegt.

## Bezug

- `docs/Zielarchitektur.md`
- `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md`
- `docs/KI-Betrieb-und-Kosten.md`
- `docs/KI-Provider-und-DSFA-Pruefrahmen.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
