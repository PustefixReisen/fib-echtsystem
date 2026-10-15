# Begründung einer Fundstellenzuordnung

Stand: 15.10.2026 – fachlich vereinbart.

Jede Beziehung Fundstelle ↔ Ereignis erhält eine redaktionelle **Begründung der Zuordnung**: „Warum ist diese Fundstelle dem Ereignis zugeordnet?“ Sie beschreibt den tatsächlichen Informationsbeitrag zum Ereignis. Während der Bearbeitung ist sie optional; vor einer späteren redaktionellen Freigabe soll die Begründung geprüft und bestätigt werden.

Keine Pflichtklassifikation nach Belegcharakter oder Belegzweck. Die historische technische `evidence_role` bleibt für Kompatibilität und Herkunft erhalten, wird aber nicht als redaktionelles Feld angezeigt.

Die Begründung wird im separaten Feld `fib.event_findings.justification` gespeichert. Das bisherige Feld `note` bleibt unverändert; es enthält bei Entwicklungsimporten technische Metadaten und darf nicht als Begründung missbraucht oder überschrieben werden. Änderungen an Begründungen werden protokolliert.

Die KI kann die Begründung möglichst im bestehenden Recherche-API-Aufruf vorschlagen. Bei manueller Zuordnung erfolgt ein gesonderter KI-Aufruf nur auf ausdrücklichen Wunsch. Wenn der Quelleninhalt nicht ausreicht, muss sie Unsicherheit benennen. KI-Vorschläge werden durch die Redaktion geprüft, nicht automatisch freigegeben.

Die „Bedeutung für das Thema“ gehört weiterhin zur Beziehung Ereignis ↔ Thema.

Die Oberfläche verwendet im Kartenkopf „Fundstellen bearbeiten“, was Zuordnen, Bearbeiten und Aufheben umfasst. Für späteres erneutes Zuordnen soll optional die letzte aufgehobene Zuordnung wiederherstellbar sein, keine komplexe Versionsauswahl; ein technisches Änderungsprotokoll bleibt erhalten. Wiederherstellungsmechanismus ist noch gesondert umzusetzen.
