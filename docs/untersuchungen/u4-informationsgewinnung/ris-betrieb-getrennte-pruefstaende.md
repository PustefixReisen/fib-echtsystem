# U4 – RIS-Betriebsprüfung: täglicher und wöchentlicher Prüfstand

Stand: 30.10.2026. **Pilotbetrieb ohne Zeitsteuerung oder automatische Veröffentlichung.**

## Ziel
Die tägliche 30-Tage-Prüfung und wöchentliche 120-Tage-Prüfung besitzen getrennte Zustände für offene Freigabeansichten, besuchte Ansichten, Abruffehler, belegte Startdaten und letzten vollständigen Abschluss. Bekannte RIS-Dokumentverweise und PDF-Inhaltsfingerabdrücke sind weiterhin quellenweit gemeinsam gespeichert.

## Prüfverfahren
- Beim erstmaligen Speichern eines Modus wird ein bestehender Pilot-Cursor als Übergangsstand verwendet; sobald getrennte Zustände vorhanden sind, beginnt der andere, bisher uninitialisierte Modus an der aktuellen Freigabeliste.
- Bei unvollständigem Lauf wird nur der zugehörige Modus fortgesetzt; es erfolgt kein Neustart und keine pauschale Löschung seiner Fehlermeldungen.
- Bei vollständigem Lauf beginnt die nächste manuell ausgelöste Prüfung desselben Modus wieder am aktuellen Einstieg. Die Alt-Ansichten werden anhand der RIS-Navigationslinks entdeckt.
- Der Run-Log enthält die Kennzeichnung `daily` oder `weekly`; ältere Protokolle haben weiterhin `cadence = NULL`. Pro Lauf bleibt der ursprüngliche Status `partial`, `failed` oder `succeeded`.
- Quellenweite Fehler bleiben angezeigt, wenn **mindestens einer** der gespeicherten Modi offene Abruffehler hat; ein erfolgreicher Lauf des anderen Modus darf sie nicht verdecken.
- Eine offene Navigationsliste ist noch kein Fehler; eine früh genug datierte RIS-Freigabeansicht ist nur ein Reichweitenindiz, kein Vollständigkeitsbeweis.
- PDF-Fehler führen zu keinem Commit für den fehlgeschlagenen Teilabruf. Kein Zeitplan ist aktiviert.

## Noch offene Abnahme
Nach Deployment beide Modi separat in echten RIS-Läufen prüfen, insbesondere Wiederaufnahme nach Abruffehler, überlappende Prüfläufe, absichtlich ausfallende Quelle und Aufholung versäumter Zeitpläne. Es existiert noch kein zeitgesteuerter Orchestrator. Vor der Aktivierung muss außerdem die fachliche Datenabdeckung validiert werden.

## Einmalige Betriebsprüfung
Die Redaktion besitzt zusätzlich eine ausdrücklich manuell auslösbare Gesamtprüfung für beide Pläne. Ein Administrator bestätigt einmal; anschließend werden je Plan höchstens vier Teilaufrufe (maximal zwei RIS-Freigabeansichten je Aufruf) sequenziell durchgeführt. Ein Fehler beendet die Kette sofort; gespeicherte Zwischenstände bleiben bestehen. Die Gesamtprüfung richtet weder einen Cron-Job ein noch erteilt sie automatisch eine Betriebsfreigabe.
