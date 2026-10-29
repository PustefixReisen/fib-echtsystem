# U4 – Untersuchung Informationsgewinnung: Testblock 1 (Quellenerschließung)

**Stand:** 29.10.2026 · **Status:** Untersuchungsprotokoll, keine neue Fachregel · **Basis:** fachlich abgenommenes Kapitel 03

## Ziel
Drei Quellengruppen zunächst auf geeignete Zugangswege, zeitliche Abdeckung, mögliche Erfassungslücken, Kosten und Nutzungsgrenzen prüfen. Keine U4-Implementierung vor der empirischen Auswertung.

## Untersuchungsquellen (Pilot)
| Quelle | Nachgewiesener Zugangsweg | Verifizierung / offener Punkt |
|---|---|---|
| Gemeinde Feldkirchen, `feldkirchen.de` | Nachrichten, Nachrichtenarchiv, Bekanntmachungen, Gemeindeblatt (PDF) | Weitere Seiten getrennt prüfen; nicht mit `feldkirchen-gemeinde.de` verwechseln. |
| RIS Feldkirchen (`buergerinfo-feldkirchen.digitalfabrix.de`) | SessionNet-Dokumentliste mit Freigabedaten und verknüpften Vorlagen | Stabilität, Datumsauswahl, PDF-Erfassung und Nachveröffentlichungen testen. Vorlagen ≠ Beschlüsse; TOP-Beschlüsse ausschließlich durch RIS belegen. |
| Münchner Merkur | Lokalseite `https://www.merkur.de/lokales/muenchen-lk/feldkirchen-ort28673/`; allgemeiner RSS `https://www.merkur.de/rssfeed.rdf` | Prüfen, welche lokalen Artikel im Feed fehlen und ob ein lokaler Feed existiert. |
| Süddeutsche Zeitung | Offizielle Übersicht `https://www.sueddeutsche.de/service/updates-mit-rss-uebersicht-aller-rss-feeds-fuer-sz-de-sz-magazin-und-jetzt-de-1.393950`; RSS Landkreis München `https://rss.sueddeutsche.de/lkrmuenchen` | XML-Feed lässt sich im Web-Werkzeug nicht als HTML öffnen; maschinellen XML-Abruf gesondert prüfen. Text-/Lizenzgrenzen beachten. |

## Testdefinition – Vorschlag
- **Historischer Prüfzeitraum**: 01.10.–28.10.2026, Veröffentlichungstage einschließlich. Beim RIS Freigabezeitpunkt und Sitzungs-/Dokumentdatum separat erfassen.
- **Test A1**: RSS-Feed-Treffer (Merkur allgemein, SZ Landkreis München). Historische Reichweite gesondert ausweisen; heutiger Feed darf nicht als rückwirkend vollständige Oktoberliste ausgegeben werden.
- **Test A2**: direkt zugängliche Website-/Lokalseiten, Archiv und Gemeindemeldungen.
- **Test A3**: RIS-Dokumentliste nach Freigabedatum; Dokumentart und Bezug zur Sitzung/TOP.
- **Test B**: unabhängige, nicht ereignisnamensbasierte Suchmaschinenabfrage nach Quelle, Raum und Zeitraum.
- **Test C**: unabhängige KI-/semantische Recherche mit dokumentiertem dynamischen Recherchehorizont, ohne die erwarteten Fallnamen.
- **D**: Vereinigung der Ergebnisse; Kosten und zusätzlicher relevanter Ertrag gegenüber A ermitteln.

## Messschema pro Fundstelle
`fund_id,quelle,url,artikel_datum,erst_entdeckt_am,freigabe_datum,zugang,verfahren,suchanfrage,ort_bezug,thematischer_bezug,relevanz_entscheidung,relevanz_begruendung,fachobjekt_klasse,duplikat_von,fehlerklasse,abrufdauer,ki_token,kosten_eur,pruefminuten`

Ergänzend pro Testlauf: Quellstatus, Antwortcode/Fehler, Abfragezeit, Abrufzahl, verarbeitete Einträge, Dauer, manuelle Nachprüfung, technische und nutzungsrechtliche Einschränkungen.

## Referenzbestand und Qualität
1. Bekannte Regressionstreffer nur für den Regressionstest; keine konkreten Ereignisbegriffe an die Blindtestverfahren geben.
2. Für abgegrenzte Quellen und Zeiträume unabhängige, möglichst vollständige Referenzsichtung.
3. Vereinigung der Treffer aller Verfahren, Dublettenprüfung, sachliche Relevanzbewertung und zusätzliche Nachsuche.
4. **Recall im Referenzbestand** = relevante gefundene / alle als relevant bestätigten Referenzfunde; ausdrücklich keine Behauptung einer vollständigen Internetabdeckung.
5. **Precision** = relevante gefundene / alle geprüften gefundenen Kandidaten. Nicht prüfbare/fehlgeschlagene Abrufe gesondert ausweisen.
6. **Marginaler Mehrwert** = gegenüber dem einfacheren Basisverfahren zusätzlich gefundene relevante Fundstellen, samt zusätzlicher Kosten und Sichtungszeit.
7. Nachvollziehbare Negativfälle, Unsicherheit und später entdeckte Referenzfunde nachtragen.

## Bereits verifizierte Beobachtungen
- Das RIS zeigt u. a. eine Beschlussvorlage „Wegfall des Elternbeitragszuschusses in Höhe von 100 €“, Freigabe 23.10.2026.
- Die Merkur-Lokalseite enthält u. a. Beiträge zu Hundewiese, Tempo 30 B471 und Parkraumkonzept. Der allgemeine RSS-Feed ist durch einen Feed-Dienst dokumentiert; lokale Vollständigkeit nicht belegt.
- Die SZ beschreibt ausdrücklich einen regionalen RSS-Feed „Lkr. München“. Die Feed-Adresse wurde über den offiziellen SZ-Link ermittelt. Die Nutzbarkeit als XML-Feed und seine Erfassungsreichweite sind noch zu messen.

## Entscheidungspunkt vor vergleichender Messung
Ersten Prüfzeitraum sowie Fall-/Fundstellen-Protokoll freigeben. Erst danach Lauf A/B/C mit gleicher Suchhorizontdefinition starten. Keine pauschale Behauptung, ein RSS-Feed biete ein vollständiges historisches Archiv.
