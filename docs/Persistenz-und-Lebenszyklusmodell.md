# Persistenz- und Lebenszyklusmodell – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 04.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für die Persistenz-, Rücknahme-, Archivierungs- und Lebenszyklusregeln fachlicher Objekte und Beziehungen im FIB-Echtsystem.

Es konkretisiert die allgemeinen Grundsätze aus `docs/Datenmodell.md` und gilt ergänzend zu spezialisierten Teilmodellen wie `docs/Sitzungs-und-Beschlussmodell.md` und `docs/Wirkungsmodell.md`.

## 2. Gemeinsamer Persistenzgrundsatz

> **Ein fachlich bestätigtes Objekt oder eine fachlich bestätigte Beziehung wird nicht spurlos gelöscht, nur weil sie später nicht mehr aktuell, relevant oder auffindbar ist.**

Je nach Objekt oder Beziehung kommen stattdessen insbesondere in Betracht:

- fachliche Änderung,
- Rücknahme,
- Zusammenführung,
- Archivierung,
- Aufhebung einer Beziehung,
- nachvollziehbare Korrektur,
- Historisierung über den übergeordneten Gesamtstand.

Ein echtes technisches Löschen ist nur für Inhalte zulässig, die noch nie fachlich wirksam waren, z. B. verworfene KI-Kandidaten, unbeabsichtigte technische Dubletten vor Bestätigung oder rein technische Zwischenstände ohne fachliche Bedeutung.

## 3. Statusmodelle nur bei echtem Lebenszyklus

Nicht jedes Fachobjekt erhält einen eigenen Lebenszyklusstatus.

Statusmodelle werden nur dort verwendet, wo das Objekt selbst einen fachlich eigenständigen Lebenszyklus besitzt.

### 3.1 Objekte mit eigenem Statusmodell

| Objekt | Statuslogik |
|---|---|
| Ereignis | `bestätigt / zurückgenommen / zusammengeführt` |
| Meldung | `Entwurf / freigegeben / veröffentlicht / zurückgezogen` |
| Vorgang | `aktiv / ruhend / abgeschlossen / archiviert` |
| Thema | `aktiv / ruhend / archiviert` |
| Sitzung | `angekündigt / stattgefunden / abgeschlossen / abgesagt` |
| TOP | angekündigt/aktiv, behandelt, vertagt/zurückgestellt, abgesetzt/nicht behandelt |
| offene Frage / Wissenslücke | `offen / teilweise geklärt / geklärt / gegenstandslos`; zusätzlich Bearbeitungsstatus `aktiv / zurückgestellt` |
| Bild | Freigabe-/Rechte-/Verfügbarkeitsstatus nach Bildmodell |
| Bildverwendung | aktuelle Gültigkeit/Freigabe der konkreten Verwendung |

Die endgültigen technischen Enum-Bezeichnungen werden erst im physischen Datenmodell festgelegt. Die fachlichen Zustände müssen unterscheidbar bleiben.

### 3.2 Objekte ohne eigenen Lebenszyklusstatus

Folgende Objekte erhalten grundsätzlich keinen künstlichen eigenen Lebenszyklusstatus:

- Wirkung,
- Perspektive,
- Bewertung,
- Begründung,
- Gestaltungsoption,
- Beschlusspunkt,
- Beschlusspunkt-Fassung,
- Abstimmung.

Für Analysebestandteile wie Wirkung, Perspektive, Bewertung, Begründung und Gestaltungsoption erfolgt die historische Nachvollziehbarkeit über den versionierten strukturierten Gesamtstand des zugehörigen Vorgangs oder Themas.

Beschlusspunkte, Fassungen und Abstimmungen sind dagegen historische Verfahrens- bzw. Entscheidungstatsachen. Sie bleiben als solche erhalten und werden bei später erkannten Fehlern nachvollziehbar korrigiert, nicht durch einen allgemeinen Aktiv/Archiviert-Lebenszyklus geführt.

## 4. Stabile fachliche Identitäten

Fachliche Objekte, auf die andere Objekte dauerhaft verweisen können, benötigen eine stabile Identität.

Dies gilt insbesondere für:

- Ereignis,
- Meldung,
- Vorgang,
- Thema,
- Sitzung,
- TOP,
- Beschlusspunkt,
- Quelle/Fundstelle,
- Bild,
- offene Frage/Wissenslücke.

Eine spätere Korrektur verändert diese Identität grundsätzlich nicht. Nur wenn sich herausstellt, dass die frühere fachliche Identitätsannahme falsch war, kommen Rücknahme oder Zusammenführung nach den jeweiligen Spezialregeln in Betracht.

## 5. Persistenz fachlicher Beziehungen

Auch fachlich bestätigte Beziehungen dürfen nicht spurlos verschwinden, wenn sie später aufgehoben oder korrigiert werden.

Dies betrifft insbesondere:

- `Ereignis ↔ Vorgang`,
- `Vorgang ↔ Thema`,
- direkte `Ereignis ↔ Thema`-Beziehung,
- `Wirkung ↔ Ereignis` als Tatsachengrundlage,
- `Wirkung ↔ Perspektive`,
- `Meldung ↔ Sitzung`,
- `Meldung ↔ TOP`,
- `TOP ↔ Ereignis`,
- weitere fachlich wirksame Zuordnungen.

Für eine Beziehung muss fachlich rekonstruierbar bleiben:

- dass sie bestand,
- wann sie fachlich wirksam wurde,
- ob und wann sie aufgehoben oder ersetzt wurde,
- aus welchem Grund dies geschah,
- auf welcher redaktionellen Entscheidung bzw. welchem Beleg die Änderung beruhte.

Die konkrete technische Umsetzung kann z. B. über Gültigkeitskennzeichen, Zeitpunkte und Änderungsgrund oder über eine allgemeine Beziehungshistorie erfolgen; dies wird erst im physischen Datenmodell festgelegt.

## 6. Quellen und Fundstellen

Quellen und Fundstellen bleiben erhalten, wenn sie als Beleg verwendet wurden, auch wenn ihre technische Erreichbarkeit später entfällt.

Insbesondere gilt:

> **„URL nicht mehr erreichbar“ ist kein Löschgrund.**

Getrennt zu behandeln sind mindestens:

- fachliche Existenz der Quelle/Fundstelle,
- aktuelle technische Erreichbarkeit,
- ursprüngliche öffentliche Verfügbarkeit,
- öffentliche Bereitstellung über FIB,
- gegebenenfalls gespeicherte lokale oder interne Kopie,
- Rechte zur öffentlichen Bereitstellung.

Eine als Beleg verwendete Fundstelle darf nicht dadurch fachlich entwertet werden, dass der ursprüngliche Weblink später verschwindet.

## 7. Korrekturen historischer Tatsachen

Historische Tatsachenobjekte wie Beschlusspunkte, Beschlusspunkt-Fassungen und Abstimmungen werden nicht über einen normalen Lebenszyklus archiviert.

Wird später ein Erfassungs- oder Quellenfehler erkannt, gilt:

- der aktuelle fachlich richtige Wert wird berichtigt,
- die Korrektur bleibt mit Zeitpunkt, Grund und Beleg nachvollziehbar,
- frühere falsche Angaben werden nicht stillschweigend aus der Auditspur entfernt.

Beispiel:

- zunächst erfasst: Abstimmung `12 : 8`,
- später aus genehmigter Niederschrift korrigiert: `13 : 7`,
- Korrekturgrund und Fundstelle bleiben nachvollziehbar.

## 8. Analysebestandteile und Gesamtversionierung

Für Wirkungen, Perspektiven, Bewertungen, Begründungen, Gestaltungsoptionen und vergleichbare Analysebestandteile gilt:

> **Sie werden nicht eigenständig versioniert, sondern über den bestätigten strukturierten Gesamtstand ihres Vorgangs bzw. Themas historisiert.**

Daraus folgt:

- fachlich geänderte Analysebestandteile werden im aktuellen Stand angepasst,
- entfallene Analysebestandteile gehören nicht mehr zum neuen aktuellen Stand,
- frühere Fassungen bleiben über die vorherige Gesamtversion rekonstruierbar,
- gleichzeitig fachlich unterschiedliche Wirkungen bleiben eigenständige Wirkungen und sind keine Versionen voneinander.

Damit werden unnötige parallele Status- und Versionsketten vermieden.

## 9. Archivierung und Wiederaufnahme

Archivierung ist nur für Objekte vorgesehen, bei denen ein Herausnehmen aus dem laufenden öffentlichen Bestand fachlich sinnvoll ist, insbesondere Vorgänge und Themen.

Dabei gilt:

- Archivierung löscht keine fachlichen Inhalte oder Beziehungen,
- archivierte Objekte bleiben im Redaktionssystem vollständig erhalten,
- historische Bezüge und Auditfähigkeit bleiben bestehen,
- eine spätere Reaktivierung ist möglich, wenn neue fachliche Relevanz entsteht.

Archivierung darf nicht als Ersatz für fachliche Rücknahme oder Korrektur verwendet werden.

## 10. Grundregel für technische Implementierung

Das spätere physische Datenmodell muss sicherstellen, dass:

1. bestätigte fachliche Identitäten stabil bleiben,
2. fachlich wirksame Beziehungen nicht spurlos gelöscht werden,
3. Rücknahmen, Zusammenführungen, Aufhebungen und Korrekturen nachvollziehbar sind,
4. technische Nichtverfügbarkeit keine fachliche Löschung auslöst,
5. Analysehistorie über Vorgangs-/Themen-Gesamtversionen rekonstruiert werden kann,
6. technische Betriebsdaten von fachlicher Persistenz getrennt bleiben.

## 11. Abgrenzung zum technischen Betrieb

Dieses Dokument regelt fachliche Persistenz.

Rein technische Betriebsdaten wie Cache-Einträge, temporäre KI-Ausgaben, Job-Logs, technische Retry-Informationen, Performance-Metriken oder abgelaufene Session-Daten unterliegen nicht automatisch denselben Aufbewahrungsregeln.

Ob solche Daten gespeichert, verdichtet oder gelöscht werden, wird im späteren technischen Betriebs- und Datenschutzkonzept geregelt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 04.10.2026 | Gemeinsamen Persistenzgrundsatz festgelegt; Statusmodelle auf Objekte mit echtem Lebenszyklus begrenzt; stabile fachliche Identitäten und nachvollziehbare Aufhebung fachlicher Beziehungen geregelt; Quellen/Fundstellen gegen Verlust bei Linkausfall abgesichert; Korrektur historischer Tatsachen sowie Gesamtversionierung von Analysebestandteilen abgegrenzt; Archivierung und technische Betriebsdaten getrennt. |
