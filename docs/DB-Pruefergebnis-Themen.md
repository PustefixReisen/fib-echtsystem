# Prüfung Themen-Datenbank

Stand: 20.10.2026. Nur lesende Prüfung.

Für `fib.topics`, `fib.process_topics`, `fib.event_topics` und `fib.process_topic_proposals` gilt RLS mit der Policy `fib_runtime_all` ausschließlich für die Rolle `fib_runtime`. Die Redaktion nutzt den Themenservice mit MFA-Prüfung; Browserzugriffe auf Tabellen sind nicht vorgesehen.

Das Entwicklungsthema besitzt zwei bestätigte Vorgangsbezüge und zwei Vorschläge. Ein einfaches Löschen scheitert an restriktiven Fremdschlüsseln. Bei einer eventuellen Bereinigung zuerst die eigenen Bezüge behandeln; Vorgänge und Ereignisse behalten.

Nächster Schritt: Schemaänderungen in separatem Migrations-PR entwerfen und vor Ausführung prüfen.
