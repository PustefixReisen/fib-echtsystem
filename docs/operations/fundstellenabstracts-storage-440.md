# Gemeinsame Speicherung abgeleiteter Fundstellenabstracts (Issue #440)

**Implementierungsstand:** Migration und Repository-Zugriff in PR; nur im isolierten PostgreSQL-Test angewendet, **nicht** im Supabase-Echtsystem bereitgestellt.

## Tabellenvertrag

`fib.finding_abstract_versions` hängt ausschließlich an `fib.findings` und `fib.finding_versions` und kann damit quellenübergreifend genutzt werden (RIS, Presse, Gemeinde, Sonstige). Speichert getrennte, nicht redaktionelle Ergebnisse mit folgenden Invarianten:

- Versionierter Herkunftsbezug (Fundstellen-ID und Fundstellenfassungs-ID), 64-stelliger Eingabehash; optionale TOP-Nummer für TOP-spezifische Sicht einer gemeinsamen Sitzungsniederschrift.
- Erzeugungsverfahren / Modellversion, Schemacode, generierter strukturierter Payload, `derived_unreviewed`.
- Einzigartiger Verarbeitungsschlüssel pro Fundstellenfassung, TOP-Scope und Inputhash. Alte Ergebnisse bleiben als historische Fassungen bestehen; neue Quellversion verlangt Neuberechnung.
- Keine Berechtigung für Browserrollen `anon`, `authenticated`, `service_role`; `fib_runtime` darf lesen und anhängen, **nicht ändern oder löschen**. RLS aktiviert.
- Keine RIS-Originaldaten, keine Änderungen an RIS-Ereignissen, Quellen, Beschlüssen oder redaktionellen Freigaben.

## Repository-Zugriff und Sicherheitsgrenzen

`supabase/functions/_shared/finding-abstract-storage.ts` bietet `appendFindingAbstract` und `readCurrentFindingAbstract`. Vor jeder Aktion prüft ein **verpflichtend vom späteren Aufrufer bereitzustellender, quellspezifischer Rechteprüfer** den Zugriff; Modelloutputs dürfen diese Prüfung nicht steuern. Der Rechteprüfer ist hier **noch nicht** an reale Rechte- und Datenschutzmetadaten angeschlossen. Daher ist die Repository-API **noch keine Freigabe** zur Verarbeitung echter Quellentexte.

Vor dem Anfügen werden die Fundstellenfassung, aktuelle Revisionsnummer, Fingerprint und Original-URL gegen die DB abgeglichen; danach validiert der quellenübergreifende Abstractvertrag alle Strukturen und Belege. Bereits gespeicherte identische Ergebnisse werden wiederverwendet. Alte Revisionen werden nicht mehr als aktuell zurückgegeben.

Wichtig: Das Prüfen der Existenz von Quellenverweisen in einem KI-Ergebnis stellt noch **keinen semantischen Beleg** dar. Beleg-/Faktenprüfung und die sichere Zuordnung von Sammelniederschriften müssen vor produktiver KI-Verarbeitung zusätzlich implementiert werden.

## Verifikation / Bereitstellung

Isolierte PostgreSQL-16/17-Tests prüfen Rollen-/RLS-Zugriff, Rechte-Fehlpfad, zweifachen Import, Immutabilität, Revisionswechsel, Fehler bei unbestätigter Quelle und Quellenabgleich. Keine Produktivdaten, keine Provider-Aufrufe, keine Kosten.

Produktivfreigabe benötigt eine eigene Prüfung/Backups und kontrollierte Ausführung der Migration. Der bestehende Release-Workflow `RIS-ANALYSIS-428` führt **diese neue Migration nicht aus**; nicht ohne angepassten Release-Plan verwenden. Produktive KI, Mistral, Rechte-Automatismen und Textspeicherung bleiben aus.
