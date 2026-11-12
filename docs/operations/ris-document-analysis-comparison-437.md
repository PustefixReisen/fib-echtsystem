# RIS-Dokumentanalyse – begrenzter Vergleichstest (Issue #437)

Stand: 12.11.2026. **Vorbereitung, keine Freigabe zur Verarbeitung echter RIS-Volltexte und keine KI-Aktivierung.**

## Gesicherter Ausgangspunkt

Nach Release #26 sind 31 TOPs mit Analyseversion `rules-3` erfasst, 104 strukturierte Merkmale und 3 Kandidatenbeziehungen. Bisher: 0 inhaltlich analysierte RIS-Dokumente. Live-Prüfung der Tabelle `fib.ris_document_versions`: 6 Dokumentversionen, 0 dokumentierte Rechtefreigaben und 0 gespeicherte Extraktionstexte. Diese Zahlen sind eine Momentaufnahme und ersetzen keine Laufzeitdiagnose bei einer späteren Freigabe.

## Rechte- und Verarbeitungsgate

| Klasse | Was vor Echtdaten-Test nachgewiesen werden muss | Bis dahin |
| --- | --- | --- |
| Öffentliche Bekanntmachung/Tagesordnung | Veröffentlichungstyp, verantwortliche Stelle, rechtmäßiger Zugriff, TDM-Vorbehalt, personenbezogene Bestandteile | Metadatenanalyse |
| Amtliche Niederschrift | Zuständigkeit, öffentliche Fassung, mögliche Anlagen/Drittbeiträge, Datenschutz, TOP-sichere Segmentierung | Nur synthetische Abschnitte |
| Kommunale Beschlussvorlage | Urheberschaft, amtliche Zweckbestimmung, fremde Zitate/Anlagen, rechtmäßiger Zugang, Nutzungsvorbehalt | Nur synthetische Vorlagen |
| Gutachten/Anlage Dritter | Rechteinhaber und Erlaubnis oder konkret tragfähige gesetzliche Schranke, personenbezogene Daten, Nutzungsbedingungen | Keine Echtdaten-Textanalyse |

**Rechtsgrundlagen als Prüfansatz, keine pauschale Freigabe:** § 5 UrhG (amtliche Werke) und § 44b UrhG (Text und Data Mining, Rechtmäßigkeit des Zugangs, Nutzungsvorbehalte, Löschung temporärer Kopien). Bei Unklarheit ist fachliche/rechtliche Prüfung erforderlich. Alle öffentlich verfügbaren PDFs als schutzfrei zu behandeln wäre falsch.

**Technisches Gate:** `FIB_RIS_ANALYSIS_DOCUMENTS_ENABLED=false` bleibt bestehen. Nie Rechtsnachweise oder Klassifikationen automatisch in Produktivdaten setzen. `analysisDocumentPolicy` und Rechte-Metadaten müssen vor Zugriff wirken; kein dauerhaftes Speichern von PDF-Texten oder Prompts. Die extrahierten Abschnitte einer Sitzungsniederschrift dürfen nicht zwischen TOPs vermischt werden.

## Vergleichsdesign (vier RIS-Referenzen)

| Fall | Goldstandard-Fragen | Kritischer Negativtest |
| --- | --- | --- |
| 15.10. TOP 2 Hundewiese | Hundewiese, Grundstück 630, Friedhof, Schallschutz/Alternativen, abgesetzt | Keine Entscheidung als angenommen ausgeben |
| 15.10. TOP 6 Rechenzentrum | Standortparzellen 597/5 und 598/2, Bauleitplanung, gesonderte Beschlüsse mit 17/2 und 19/0 | Keine pauschale Einstimmigkeit |
| 29.10. TOP 2 Elternbeitragszuschuss | Entfall 100 €, Auswirkungen/Kontext nur bei Quellenbeleg, Querverweis TOP 3 als Kandidat | Keine Beschlussfassung ohne Niederschrift erfinden |
| 29.10. TOP 3 Kita-Beiträge | Geplante Beitragsanpassung 01.01.2027, Beziehung TOP 2 | Keine automatische Gleichsetzung mit Mittagsbetreuung TOP 4 |

Für jeden Fall drei Messstufen: **A** bestehende Regeln nur mit RIS-Metadaten; **B** identische Regeln mit freigegebenem, temporär extrahiertem Dokumenttext; **C** optional strukturiertes Mistral-Ergebnis auf *demselben* Text, nur bei separat genehmigter Rechts-, Datenschutz- und Kostenprüfung. Bis dahin alle Schritte mit bereits vorhandenen **synthetischen Fixtures** reproduzierbar testen; keine echten RIS-Originale an Drittanbieter übermitteln.

### Bewertungsbogen je erkanntem Sachverhalt

| Feld | Bedeutung |
| --- | --- |
| Erwarteter Sachverhalt | vor dem Test festgelegter Referenzbefund |
| Gefundene Aussage | konkrete normalisierte Antwort, kein unkontrollierter Freitext |
| Klasse | Amtlicher Fakt / algorithmische Ableitung / ungesicherter Kandidat |
| Beleg | RIS-Sitzung, TOP, Dokumentversion, ggf. Seite |
| Bewertung | korrekt / unbelegt / falsch / fehlt |
| Auswirkungen | Nutzen für Meldung, Vorgang oder Thema |

Kennzahlen: relevante Treffer / erwartete Treffer (Recall), korrekte Treffer / alle Treffer (Precision), Anzahl unbelegter Tatsachenbehauptungen, TOP-übergreifende Fehltreffer, Verarbeitungskosten und Zeit. Zusätzliche Schlagworte allein gelten **nicht** als Qualitätsgewinn.

## Mistral: nur vorbereitete Option

Ein eventueller Pilot erfordert ausdrückliche Betreiberfreigabe, belastbare Verarbeitungsrechte, Prüfung des DPA, Speicherort und Unterauftragsverarbeiter, personenbezogene Datenminimierung, feste Nutzungsobergrenze von höchstens 5 €, idempotente Abrechnung und überprüfbares JSON-Schema. Es gibt **keine** aktuelle Freigabe für einen externen API-Aufruf. Aktuelle Vertragsbedingungen und Aufbewahrungsfristen unmittelbar vor einem Test noch einmal prüfen.

Quellen:
- https://www.gesetze-im-internet.de/urhg/__5.html
- https://www.gesetze-im-internet.de/urhg/__44b.html
- https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data
- https://legal.mistral.ai/terms/data-processing-addendum/
- https://legal.mistral.ai/terms/privacy-policy/

## Nächste Entscheidung

1. Nachweise für die konkreten Dokumentklassen und ihren Inhalt sammeln; keine automatische Pauschalfreigabe.
2. A/B auf denselben synthetischen Goldstandard-Fällen nachvollziehbar messen, dann falls rechtlich geklärt mit echten Dokumenten isoliert prüfen.
3. Erst dann entscheiden, ob B genügt oder C einen ausreichenden Zusatznutzen erwarten lässt. Kein weiterer Service/keine neue Infrastruktur.
