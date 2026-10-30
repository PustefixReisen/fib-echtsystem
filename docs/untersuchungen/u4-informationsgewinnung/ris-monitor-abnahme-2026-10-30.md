# U4 – RIS-Überwachung: technischer Abnahmestand (30.10.2026)

## Ziel und Abgrenzung
Automatische Erfassung der RIS-Dokumentfreigaben und zuverlässige Beziehung zu Sitzung, TOP und Vorlage. Eine Linkbeziehung allein ist keine Aussage über Beschlüsse oder Abstimmungsergebnisse.

## Nachgewiesen
- Live-Sitzung 29.10.2026: TOP 2–10, neun Vorlagen, acht zeilengleiche PDF-Beziehungen (PR #300).
- Datumsnavigation der RIS-Freigabeliste wird erkannt; PDF-Verweise werden über untersuchte Fenster dedupliziert (PR #301–303).
- Test mit vier Live-Fenstern: 93 unterschiedliche PDF-Adressen, null Abruffehler; weiterer Rückblick offen.
- Ein begrenzter Scan meldet bei noch vorhandener Navigation **unvollständige Abdeckung** (PR #302).

## Nicht nachgewiesen – Sperrkriterien für automatische Aktivierung
1. **Definierter historischer Startpunkt und bewiesene Abdeckung:** Die RIS-Navigation kann zeitlich weiterreichen als das aktuelle Abrufbudget. Ein einzelner technisch erfolgreicher Scan ist kein historischer Vollständigkeitsbeleg.
2. **Persistenz und Wiederanlauf:** RIS-Scope benötigt einen tatsächlichen produktionsnahen Erst- und Zweitlauf mit stabilen Dokumentidentitäten, geprüfter Transaktion, gespeichertem Checkpoint und Wiederaufnahme nach Unterbrechung. Bisher wurden die Datenbank-Live-Läufe nur für Gemeinde-Nachrichten durchgeführt.
3. **Zeitliche Überlappung:** Eine feste Wiederholungsfrist und das Verfahren zum Nachholen bei Ausfällen sind noch mit realen Änderungsfällen zu verifizieren.
4. **Zuordnungen:** TOP/Vorlage-Paarungen sind anhand von Tabellenzeilen belegt; Dokumentfreigaben müssen bei fehlender eindeutiger RIS-Referenz zunächst unverknüpft bleiben. Niederschriften/Beschlüsse nur aus expliziter Quellenaussage.
5. **Betrieb:** Quelle vorerst Kandidat; kein Zeitplan/Cron und keine Veröffentlichung.

## Betriebsentscheidung
**Keine Freigabe für automatischen Produktivbetrieb.** Zunächst kontrollierten RIS-Persistenzlauf implementieren und testen, Abdeckungsgrenze fachlich festlegen, anschließend vollständigen Nachlauf und Wiederholungslauf prüfen. Bis dahin darf weder ein Erfolgscursor für historisch vollständige Abdeckung noch ein inhaltlicher Beschluss behauptet werden.
