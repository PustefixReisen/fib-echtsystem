# FIB Abstract-Pilot – technische Sicherheitsgates (Issue #440)

**Status: vorbereitet und isoliert getestet; keine Freigabe für Echtdaten, KI-Aufrufe oder produktive Datenbankmigration.**

## 1. Rechte- und Datenschutzentscheidung pro Fundstellenfassung

Die Migration `20261112145000_fib_abstract_pilot_gates.sql` sieht `fib.finding_abstract_permissions` vor. Für jede Fassungs-ID werden separat dokumentiert: Quelle/Quellenart, dokumentierte Rechtsgrundlage, Datenschutzbeurteilung, Prüfer, Ablaufdatum, Erlaubnis der lokalen Textverarbeitung und unabhängig davon Erlaubnis externer KI-Übermittlung. Eine fehlende, abgelaufene oder nicht zur aktuellen Fassung passende Entscheidung **verhindert die Verarbeitung**.

Nur die Datenbankadministration kann diese Entscheidungen erfassen oder ändern; `fib_runtime` darf sie ausschließlich lesen. Im neuen Laufzeit-Gate `databaseAbstractRights(transaction,externalAi)` reicht die Freigabe zur lokalen Auswertung **nicht** für eine externe Mistral-Übermittlung aus. Der Adapter muss explizit mit `externalAi=true` autorisiert werden. Es sind **keine** Freigabezeilen für reale Quellen angelegt.

**Offen:** Die rechtliche/DSGVO-Fachprüfung und Erfassung durch einen berechtigten Betreiber sowie ein nachvollziehbarer Prüf-/Widerrufsprozess. Die Datenbankprüfung ist ein Gate, keine automatisierte juristische Entscheidung.

## 2. Kumulierter Kostenrahmen 5 €

`fib.abstract_pilot_budget` besitzt eine Budgetzeile mit höchstens 500 Euro-Cent. `fib.abstract_pilot_reservations` dokumentiert *jede* Anfrage über einen eindeutigen 64-stelligen Request-Key. Der Datenbankcode sperrt zuerst die Budgetzeile per `FOR UPDATE`; dadurch werden gleichzeitige Worker serialisiert. Nur wenn `verbraucht + reserviert + gewünschte Reservierung <= 500` gilt, wird eine neue Anfrage zugelassen.

Statuswechsel:
- `reserved` → `settled`: bestätigte Kosten abziehen und Rest freigeben; Wiederholung nur exakt gleicher Abrechnung ist idempotent.
- `reserved` → `uncertain`: Betrag bleibt reserviert; keine automatische Wiederholung oder Rückgabe.
- `reserved` → `released`: nur wenn vor dem Senden sicher keine zahlungspflichtige Anfrage erfolgt ist.

Ein bereits benutzter Request-Key wird unabhängig vom Ausgang nie erneut reserviert. Keine automatische Auflösung unklarer Abrechnungen. Anpassung/Erhöhung des Budgetrahmens ist **nicht** vorgesehen. Es gibt keine aktive Provideranbindung, keine Secrets und keinen tatsächlichen Budgetverbrauch.

**Risiko/Hinweis:** Die Grenze ist eine interne FIB-Pilotbegrenzung; unterschiedliche Providerpreise, Währungsumrechnung, Überschreitung der vorab begrenzten Tokens oder nachträgliche externe Abrechnungen müssen vor einem Real-Pilot vertraglich/technisch abgeklärt werden. Das allein ist noch keine absolute Garantie gegen Providergebühren oberhalb des Limits.

## 3. Engere Belegprüfung

Die gemeinsame Pipeline prüft nun zusätzlich, ob jede Seiten-/TOP-Angabe eines Modelloutputs tatsächlich in den **geladenen** Textsegmenten vorhanden ist. Falsche Seitenzahlen werden vor dem Speichern abgelehnt. Das verhindert nicht jede inhaltliche Halluzination; eine Aussage kann zu einer vorhandenen Seite inhaltlich falsch sein. Eine semantische Prüfung (Aussage ↔ belegte Textstelle) bleibt vor einem Real-Pilot erforderlich.

## 4. Test / Betrieb

Isolierte PostgreSQL-Tests (16/17) prüfen:
- Fehlende oder abgelaufene Rechte, getrennte lokale/externe Freigabe, Runtime darf Freigaben nicht selbst setzen.
- Zwei gleichzeitig reservierende Worker; einer muss bei Budgetüberlauf scheitern.
- Unerledigte/unklare Providerkosten bleiben reserviert, Wiederholungsschlüssel bleiben gesperrt, doppelte Abrechnung wird verhindert.
- Unzulässige Datenbankzugriffe durch Browserrollen, Quellen-/Seiten-Fehlbelege.

**Nicht live ausführen:** Die produktive Migration `20261112145000_fib_abstract_pilot_gates.sql` und die zuvor vorbereitete `20261112140000_fib_finding_abstract_versions.sql` müssen in einem späteren explizit freigegebenen, gesicherten FIB-only-Release aufgenommen werden. Der bestehende RIS-Release führt diese Migrationen nicht aus. KI und Dokumentvolltext bleiben aus.
