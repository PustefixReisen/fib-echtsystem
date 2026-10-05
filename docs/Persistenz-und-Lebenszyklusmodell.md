# Persistenz- und Lebenszyklusmodell – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.1 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für die Persistenz-, Rücknahme-, Archivierungs- und Lebenszyklusregeln fachlicher Objekte und Beziehungen im FIB-Echtsystem.

Es konkretisiert die allgemeinen Grundsätze aus `docs/Datenmodell.md` und gilt ergänzend zu den spezialisierten Teilmodellen.

## 2. Gemeinsamer Persistenzgrundsatz

> **Ein fachlich bestätigtes Objekt oder eine fachlich bestätigte Beziehung wird nicht spurlos gelöscht, nur weil sie später nicht mehr aktuell, relevant oder auffindbar ist.**

Je nach Objekt oder Beziehung kommen stattdessen insbesondere fachliche Änderung, Rücknahme, Zusammenführung, Archivierung, Aufhebung einer Beziehung, nachvollziehbare Korrektur oder Historisierung über einen übergeordneten Gesamtstand in Betracht.

Ein echtes technisches Löschen ist nur für Inhalte zulässig, die noch nie fachlich wirksam waren, z. B. verworfene technische Zwischenstände oder unbeabsichtigte technische Dubletten vor Bestätigung.

## 3. Statusmodelle nur bei echtem Lebenszyklus

Nicht jedes Fachobjekt erhält einen künstlichen eigenen Lebenszyklusstatus.

### 3.1 Objekte mit eigenem Statusmodell

| Objekt | Fachliche Statuslogik |
|---|---|
| Ereignis | `bestätigt / zurückgenommen / zusammengeführt` |
| Meldung | `Entwurf / freigegeben / veröffentlicht / zurückgezogen` |
| Vorgang | `aktiv / ruhend / abgeschlossen / archiviert` |
| Thema | `aktiv / ruhend / archiviert` |
| Sitzung | `angekündigt / stattgefunden / abgeschlossen / abgesagt` |
| TOP | angekündigt, behandelt, vertagt, abgesetzt/nicht behandelt |
| offene Frage / Wissenslücke | `offen / teilweise geklärt / geklärt / gegenstandslos`; Bearbeitung zusätzlich `aktiv / zurückgestellt` |
| Beobachtungsauftrag | `aktiv / pausiert / beendet` |
| Referenzwissen | `vorgeschlagen / bestätigt / nicht mehr gültig bzw. zurückgenommen` |
| Vertiefungsfrage | `Entwurf/Vorschlag / freigegeben / zurückgezogen` |
| Vertiefungsantwort | `Entwurf / freigegeben / veröffentlicht / zurückgezogen` |
| Bild | Freigabe-/Rechte-/Verfügbarkeitsstatus nach Bildmodell |
| Bildverwendung | Gültigkeit/Freigabe der konkreten Verwendung |
| AI Task | aktiver, pausierter oder beendeter betrieblicher Zustand gemäß AI-Task-Modell |

Die endgültigen technischen Enum-Bezeichnungen werden erst im physischen Datenmodell festgelegt.

### 3.2 Objekte ohne künstlichen Lebenszyklusstatus

Insbesondere Wirkung, Perspektive, Bewertung, Begründung, Gestaltungsoption, Beschlusspunkt, Beschlusspunkt-Fassung, Abstimmung und Recherchelauf erhalten keinen allgemeinen Aktiv-/Archiviert-Lebenszyklus.

Analysebestandteile werden über den versionierten strukturierten Gesamtstand des zuständigen Vorgangs bzw. Themas historisiert. Beschluss- und Rechercheobjekte bleiben als historische Tatsachen bzw. Provenienz erhalten und werden bei Fehlern nachvollziehbar korrigiert.

## 4. Stabile fachliche Identitäten

Fachliche Objekte, auf die dauerhaft verwiesen wird, benötigen stabile Identitäten. Dies gilt insbesondere für Ereignis, Meldung, Vorgang, Thema, Sitzung, TOP, Beschlusspunkt, Quelle, Fundstelle, Bild, offene Frage, Beobachtungsauftrag, Recherchelauf, Referenzobjekt, Vertiefungsfrage und Vertiefungsantwort.

Eine spätere Korrektur verändert die Identität grundsätzlich nicht. Nur eine fachlich falsche Identitätsannahme kann nach den jeweiligen Spezialregeln zu Rücknahme oder Zusammenführung führen.

## 5. Persistenz fachlicher Beziehungen

Auch fachlich wirksame Beziehungen dürfen bei späterer Änderung nicht spurlos verschwinden. Dies betrifft insbesondere:

- `Ereignis ↔ Vorgang`,
- `Vorgang ↔ Thema`,
- direkte `Ereignis ↔ Thema`-Beziehungen,
- `Ereignis ↔ Wirkung` und Herkunftskontext einer Wirkung,
- `Wirkung ↔ Perspektive`,
- `TOP ↔ Ereignis`,
- `Beobachtungsauftrag → Primärbezug`,
- `Beobachtungsauftrag → Recherchelauf`,
- `Recherchelauf → Fundstelle`,
- Referenzbeziehungen,
- Quellen-/Belegbeziehungen,
- Bildverwendungen,
- Vertiefungsantwort ↔ Fundstelle.

**Nicht** als eigenständige autoritative Beziehungen geführt werden `Meldung ↔ Sitzung` oder `Meldung ↔ TOP`. Diese Bezüge werden aus `Meldung → Ereignis → TOP/Sitzung` abgeleitet.

Für fachlich wirksame Beziehungen muss rekonstruierbar bleiben, wann sie wirksam wurden, ob und wann sie aufgehoben oder ersetzt wurden und warum.

## 6. Quellen und Fundstellen

Quellen und als Beleg verwendete Fundstellen bleiben erhalten, auch wenn ihre technische Erreichbarkeit später entfällt.

> **„URL nicht mehr erreichbar“ ist kein Löschgrund.**

Getrennt zu behandeln sind fachliche Existenz, aktuelle technische Erreichbarkeit, ursprüngliche öffentliche Verfügbarkeit, öffentliche Bereitstellung über FIB, gegebenenfalls gespeicherte Kopie und Rechte zur öffentlichen Bereitstellung.

## 7. Recherche- und Beobachtungshistorie

Beobachtungsaufträge werden bei Pause oder Ende nicht gelöscht. Rechercheläufe bleiben als Provenienz der gefundenen bzw. geänderten Fundstellen erhalten.

Ein ergebnisloser späterer Recherchelauf entwertet keine zuvor bestätigten Fundstellen, Ereignisse, Wirkungen oder Beziehungen.

Die Wiederaufnahme eines pausierten Beobachtungsauftrags setzt dessen bestehende Identität fort, sofern kein fachlich neuer Informationsbedarf entstanden ist.

## 8. Korrekturen historischer Tatsachen

Historische Tatsachenobjekte wie Beschlusspunkte, Fassungen und Abstimmungen werden bei später erkannten Fehlern nachvollziehbar berichtigt. Der frühere fehlerhafte Stand bleibt in der Auditspur rekonstruierbar.

Dasselbe Prinzip gilt für fachlich relevante Korrekturen an bereits verwendeten Fundstellen oder anderen historischen Belegen.

## 9. Analysebestandteile und Gesamtversionierung

Wirkungen, Perspektiven, Bewertungen, Begründungen, Gestaltungsoptionen und vergleichbare Analysebestandteile werden nicht eigenständig versioniert, sondern über den bestätigten strukturierten Gesamtstand ihres Vorgangs bzw. Themas historisiert.

Wirkungen sind fachlich am Ereignis verankert; ihr Herkunftskontext bestimmt, in welchem Vorgang oder Thema sie geändert werden dürfen. Frühere Fassungen bleiben über den früheren Gesamtstand rekonstruierbar.

## 10. Vertiefungsinhalte „Mehr wissen?“

Veröffentlichte Vertiefungsantworten werden bei fachlich relevanter Änderung nicht spurlos überschrieben. Es muss nachvollziehbar bleiben, welche Fassung zu welchem Zeitpunkt freigegeben bzw. veröffentlicht war.

Reine sprachliche Änderungen ohne Bedeutungsänderung benötigen keine neue fachliche Fassung. Zurückgezogene Fragen und Antworten bleiben intern nachvollziehbar.

## 11. Archivierung und Wiederaufnahme

Archivierung ist nur für Objekte vorgesehen, bei denen das Herausnehmen aus dem laufenden öffentlichen Bestand fachlich sinnvoll ist, insbesondere Vorgänge und Themen.

Archivierung löscht keine Inhalte oder Beziehungen. Reaktivierung bleibt möglich. Archivierung darf nicht als Ersatz für Rücknahme oder Korrektur verwendet werden.

## 12. Fachliche Persistenz versus technischer Betrieb

Fachlich dauerhaft bzw. nachvollziehbar zu halten sind insbesondere bestätigte Fachobjekte, Freigabestände, fachlich wirksame Beziehungen, Quellen-/Fundstellen-Provenienz, Rechercheläufe, relevante Statusänderungen und Auditinformationen zu fachlichen Änderungen.

Rein technische Betriebsdaten wie Cache-Einträge, temporäre KI-Rohantworten, Retry-Informationen, Performance-Metriken oder abgelaufene Sessions sind davon getrennt. Ihre Aufbewahrungsfristen werden im technischen Betriebs- und Datenschutzkonzept festgelegt.

Damit ist die fachliche Abgrenzung geklärt; die konkrete technische Aufbewahrungsdauer einzelner Betriebsdaten ist keine offene G3-Datenmodellfrage.

## 13. Grundregel für die technische Implementierung

Das physische Datenmodell muss sicherstellen, dass:

1. bestätigte fachliche Identitäten stabil bleiben,
2. fachlich wirksame Beziehungen nicht spurlos gelöscht werden,
3. Rücknahmen, Zusammenführungen, Aufhebungen und Korrekturen nachvollziehbar sind,
4. technische Nichtverfügbarkeit keine fachliche Löschung auslöst,
5. Analysehistorie über Vorgangs-/Themen-Gesamtversionen rekonstruierbar bleibt,
6. Rechercheprovenienz erhalten bleibt,
7. fachliche Persistenz von rein technischen Betriebsdaten getrennt bleibt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.1 | 05.10.2026 | G3-Gesamtaudit: veraltete direkte Meldung↔Sitzung/TOP-Beziehungen entfernt; Wirkungskonzept an Ereignisverankerung angepasst; Beobachtungsauftrag, Recherchelauf, Referenzwissen und „Mehr wissen?“ in Lebenszyklus/Persistenz aufgenommen; fachliche Persistenz von technischen Betriebsdaten abschließend abgegrenzt. |
| 1.0 | 04.10.2026 | Gemeinsamen Persistenzgrundsatz, Statusmodelle, stabile Identitäten, Beziehungshistorie, Quellenpersistenz, Gesamtversionierung und Archivierung festgelegt. |
