# ADR-012 – RIS-Originale und getrennte Ereignisbeziehungen

Status: umgesetzt zur technischen Prüfung in #377 / PR #378, 02.11.2026.
Betriebsfreigabe und persönliche fachliche Abnahme sind getrennte Schritte.

## Entscheidung

RIS bleibt eine unveränderte amtliche Quelle. Der Import legt pro kanonischer
Dokumentadresse automatisch eine Fundstelle an und verbindet jede Dokumentfassung
idempotent mit einer Fundstellenfassung. Originaltitel, TOP-Titel, automatisch
gebildeter Anzeigetitel, Sitzungsdatum und Herkunft werden getrennt erhalten.
Ein Import legt weder Ereignisse noch Meldungen oder Beschlüsse an.

`ris_agenda_events.role = local_reference` beschreibt einen lokalen Bezug zu einem
Ereignis außerhalb der Sitzung. Er benötigt weder Begründung noch Beziehungstyp
oder eine vorherige Dokument-Fundstellenzuordnung. Historische, beleggebundene
Behandlungs-/Beschlussrollen behalten ihren bisherigen Fachvertrag.
`event_findings` bleibt die eigenständige n:m-Beziehung für den Ereignisbezug einer
Dokument-Fundstelle. Ihre Begründung ist bei der Bearbeitung optional. Die vorhandene
`source_create_event`-Funktion wird für beide Ausgangskontexte wiederverwendet;
Anlage und Verbindung sind eine Transaktion. Entfernen einer Verbindung löscht
kein Ereignis.

Die Speicherung wird **für den exakten Byte-Hash einer Dokumentfassung** bestätigt:
Gemeinde als Urheberin oder anderweitige Speicherberechtigung, Nachweis, prüfendes
FIB-Mitglied und Zeitpunkt. Ein geändertes PDF erhält zunächst ungeklärte Rechte.
RIS-Herkunft, Dokumentidentität, Urheberschaft und redaktionelle Nutzung bleiben
verschiedene Eigenschaften. Es gibt keine pauschale Rechtefreigabe anhand des
Dokumenttyps oder der Veröffentlichung im RIS.

Zulässige Original-PDFs liegen im privaten Bucket `fib-ris-originals` unter
`Dokument-ID/Versions-ID/SHA256.pdf`. Unveränderte Bytes und daraus extrahierter Text
gehören zur selben `fib.ris_document_versions`-Zeile. Hash, Identität, ursprünglicher
Beobachtungszeitpunkt und ein bereits gespeichertes Original/Text-Paar dürfen nicht
überschrieben werden. Metadaten einer noch ungeklärten Fassung sind zulässig;
PDF und Volltext werden in diesem Zustand nicht gespeichert.

Der Upload nutzt `x-upsert: false`; ein Wiederholungsfall prüft vorhandene Bytes.
Ein erfolgreicher Upload mit anschließendem SQL-Rollback bleibt unter derselben
Versionsadresse wiederanlauffähig. Ein Rechtewiderruf entfernt auch diese eventuell
noch nicht referenzierte Datei und anschließend den Volltext. Die bestehende
Batch-Bereinigung verweigert das Löschen berechtigter Dokumentfassungen, bis ihre
Originale kontrolliert widerrufen wurden.

Der Abruf erfolgt ausschließlich durch `fib-editorial-write`: verifizierte
Auth-Sitzung mit AAL2, aktive FIB-Redaktionsrolle, Prüfung der konkreten Fassung,
privater Storage-Abruf und erneute Größen-/Hashprüfung. Der Browser erhält nur die
PDF-Bytes mit `no-store`, keine privilegierten Schlüssel, öffentlichen oder
signierten Storage-URLs. Bestehende Storage-/Memorix-Ressourcen bleiben unverändert.

Die Vorschau verwendet zunächst den integrierten PDF-Viewer des Browsers in einem
großen nativen Dialog. Eine Blob-URL stellt die von FIB gelieferten Bytes dar;
der Viewer fordert den RIS-Link nicht erneut an. Schließen erhält TOP und Fokus.
PDF.js wird erst erforderlich, wenn die praktische Browserabnahme eine Lücke belegt.
Die persönliche Firefox-Prüfung von Textauswahl/Kopieren/Drucken bleibt offen.

## Alternativen und Folgen

- Extrahierter Text allein erhält das Original-Layout nicht und genügt nicht.
- Erneutes Einbetten der RIS-Adresse erfüllt den Ausfall-/Firefox-Anwendungsfall nicht.
- Ein öffentlicher Bucket oder ein Rechte-Cache für ungeklärte Anlagen ist ausgeschlossen.
- Eine Freigabe pro Dokumentadresse würde geänderte Drittinhalte unbeabsichtigt übernehmen.
- Neue Ereignis-/Fundstellen-Sondermodelle oder ein zusätzlicher Viewer-Dienst sind unnötig.

Die neue Migration entfernt historische Volltexte ohne dokumentierten Rechtenachweis.
Deshalb gelten vor ihrer Anwendung der verbindliche Release-Sicherungs-/Restoreplan
und die Freigabe des konkreten Release-Commits. Hashes, Fassungsidentitäten und
bestehende Beziehungen bleiben erhalten. Die sechs derzeitigen Shared-Apps-Fassungen
haben noch keinen Rechtenachweis und kein gespeichertes Original-PDF.

Die bestehende Sicherung erhält eine zum SQL-Snapshot gehörende Originaldateiliste.
Ein Release-Bundle ist bei fehlenden oder abweichenden Originalbytes ungültig. Export
über die bestehende menschliche AAL2-Schnittstelle oder geprüfte private Inputs;
kein neuer Service-Schlüssel im Browser und keine automatische Veröffentlichung.
Bei Wiederherstellung Rechtewiderrufe respektieren; alte Backups sind keine erneute
Speicherberechtigung.
