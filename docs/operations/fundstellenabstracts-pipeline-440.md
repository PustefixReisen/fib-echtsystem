# Gemeinsame Fundstellenabstract-Pipeline – synthetischer Durchstichtest

**Issue #440 · Stand 12.11.2026 · keine Live-Freigabe**

Das Modul `supabase/functions/_shared/finding-abstract-pipeline.ts` verbindet den bereits abgenommenen generischen Abstractvertrag und den append-only-Datenbankzugriff zu einem quellenneutralen Ablauf. Es implementiert keinen echten KI-Dienst, keinen HTTP-Endpoint und keinen Cronjob.

## Ablauf und Abgrenzung

1. Ein extern bereitgestellter, **nicht vom Modell beeinflussbarer** Rechte-/Datenschutzprüfer muss die Nutzung der konkreten Fundstellenfassung vor jeder Inhaltsanforderung erlauben.
2. Zunächst auf einen bereits gültigen, unveränderten Abstract-Schlüssel prüfen. Bei einem Treffer sind weder Textabruf noch erneute Modellnutzung erforderlich.
3. Nur bei Bedarf werden vom aufrufenden, fachlich geprüften Adapter begrenzte temporäre Textsegmente mit Seitenangabe und optionaler eindeutiger TOP-Nummer geladen. Ein anderer TOP oder unklare Abschnitte sind ein Fehler, kein hinzugedichteter Kontext.
4. Der allgemeine `AbstractGenerator` erhält ausschließlich diese geprüften Segmente. Jedes Ergebnis wird mit dem gemeinsamen Schema einschließlich Fundstellenversions-/TOP-Belegen validiert.
5. Vor dem append-only Insert prüft der Repository-Zugriff die Berechtigung erneut sowie die aktuelle Quelle, Fassung, URL und den Hash. Wiederholungen sind idempotent.

**Grenzen:** Quellenbeleg-Schema ersetzt keine semantische Prüfung. Keine personenbezogenen Inhalte ohne gesonderte Datenschutzprüfung. Die optionale synthetische Demonstrationsfunktion `syntheticExtractiveGenerator` akzeptiert ausschließlich `https://example.invalid/` und erzeugt nur einen kurzen, wörtlichen Auszug ohne neue Beziehungskandidaten. Sie ist **kein** KI-Modell, nicht für Echtdaten zugelassen und dient ausschließlich dem isolierten Integrationstest.

## Verifikation

Der bestehende PostgreSQL-Integrationstest `tests/ris-analysis/postgres.spec.mts` durchläuft mit synthetischen Texten Rechteprüfung, Textaufnahme, Generator, Schema, DB-Persistenz und Cache-Wiederverwendung. Negativfälle: verweigerte Rechte, abweichender Quellenhash, TOP-Vermischung, übergroßer Inhalt. Quelltexte werden nicht als Original in der Abstracttabelle gespeichert. Der CI-Workflow prüft auf PostgreSQL 16 und 17.

**Offen vor einem Realbetrieb:** produktiver Rechteprüfer für RIS/Presse/Gemeinde, konforme Textgewinnungsadapter mit geprüftem Zugriff, nachweisbare semantische Belegprüfung, bewilligter KI-Provider und harte Kostenkontrolle, gesonderter kontrollierter Migrations- und Releaseplan. Kein Workflow setzt die produktive Volltextanalyse oder Mistral frei.
