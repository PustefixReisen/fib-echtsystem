# ADR-012 – RIS-Originale und getrennte Ereignisbeziehungen

Status der Originalspeicherung wie am 02.11.2026 dokumentiert. Der fachliche Ereignis- und Beziehungsvertrag ist seit 11.11.2026 durch [Kapitel 07](../fachhandbuch/07-Sitzungen-und-Beschluesse-Entwurf-2026-10-26.md) ersetzt. Die folgenden Speicherregeln sind kein Nachweis einer allgemeinen Betriebsfreigabe.

## Entscheidung

Der Import legt pro kanonischer Dokumentadresse eine Fundstelle an und verbindet die Dokumentfassungen nachvollziehbar mit ihren Fundstellenfassungen. Originaltitel, TOP-Titel, automatisch gebildeter Anzeigetitel, Sitzungsdatum und Herkunft bleiben unterscheidbar.

Die frühere redaktionelle Beziehungspflege über lokale TOP-Bezüge und manuelle Ereignisanlage ist ersetzt. Der Import erzeugt je TOP genau ein geschütztes Ereignis und die automatischen Dokumentzuordnungen nach Kapitel 07. Die technische Speicherentscheidung im Folgenden wird dadurch nicht erweitert.

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
