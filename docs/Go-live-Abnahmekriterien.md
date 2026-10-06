# Go-live-Abnahmekriterien – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument ist die verbindliche Primärquelle für **G10 – Go-live-Abnahme**.

Es definiert die Bedingungen, die vor einem produktiven Go-live von FIB nachweislich erfüllt sein müssen, sowie harte Blocker, bei denen eine Produktivschaltung nicht zulässig ist.

Die Abnahme erfolgt erst nach technischer Umsetzung, Pilotbetrieb und realer Zielmigration. G10 in der Gründungsphase legt die Kriterien fest; die spätere operative Abnahme wendet sie an.

## 2. Grundsatz

> **Go-live-Freigabe erfolgt nur auf Basis nachgewiesener Kriterien. Kritische fachliche, sicherheitsrelevante, datenschutzbezogene oder betriebliche Mängel blockieren den Go-live.**

Nichtkritische Komfort- oder Optimierungspunkte dürfen mit dokumentiertem Folgeauftrag nach Go-live verschoben werden, wenn Kernfunktion, Korrektheit, Sicherheit, Datenschutz und Betriebssicherheit dadurch nicht beeinträchtigt werden.

## 3. Abnahmestatus

Jedes Kriterium erhält einen Status:

- **nicht geprüft**
- **bestanden**
- **bestanden mit nichtkritischer Restabweichung**
- **nicht bestanden / Blocker**
- **nicht anwendbar** – nur mit dokumentierter Begründung

Für die Go-live-Freigabe darf kein anwendbares Pflichtkriterium den Status `nicht bestanden / Blocker` oder `nicht geprüft` haben.

## 4. Fachliche Kernfunktion

Vor Go-live muss nachgewiesen sein, dass der fachliche Kern korrekt funktioniert.

Pflichtkriterien:

1. Ereignis, Meldung, Vorgang, Thema und Sitzung/TOP werden gemäß Datenmodell getrennt und korrekt verknüpft.
2. Neue Information wird korrekt als neues Ereignis oder Aktualisierung bestehender Meldung behandelt.
3. Beschlussvorlage, Beratung und Beschlussereignis werden nicht vermischt.
4. `Bedeutung für das Thema` wird nur nach redaktioneller Bestätigung fachlich wirksam.
5. Perspektiven/Wirkungen und „Unsere Einordnung“ bleiben von Sachinformation unterscheidbar.
6. Quellen- und Provenienzbezug bleibt für öffentliche Tatsachenbehauptungen nachvollziehbar.
7. „Mehr wissen?“ ist quellengebunden und von internen offenen Fragen getrennt.
8. Rücknahme, Aktualisierung, Historisierung und Persistenzschutz funktionieren ohne unbeabsichtigten Datenverlust.
9. Bilder werden nur mit passender Rechte-/Freigabe- und Verwendungslogik veröffentlicht.
10. stabile öffentliche Links und Aktualisierungsanker funktionieren reproduzierbar.

## 5. Demonstrator-Transfer und Regressionstests

Der Regressionstestkorpus `docs/Regressionstests-Demonstratortransfer.md` ist verpflichtender Bestandteil der Abnahme.

Go-live-Bedingung:

- **100 % der als kritisch eingestuften Referenzfälle müssen bestanden sein.**
- Alle übrigen für den MVP anwendbaren Referenzfälle müssen entweder bestanden sein oder eine ausdrücklich als nichtkritisch begründete Restabweichung besitzen.
- Keine bekannte Regression darf eine im Demonstrator bereits bewährte fachliche Schutzregel verschlechtern.

Vor U6 wird der Korpus um eine Kennzeichnung `kritisch / nichtkritisch` ergänzt und soweit sinnvoll automatisiert.

## 6. Recherche- und Ereignisentdeckung

Da automatische Quellenbeobachtung und KI-gestützte Ereignisentdeckung Kernfunktion des MVP sind, reicht ein rein technischer Funktionstest nicht aus.

Vor Go-live muss anhand eines repräsentativen Testzeitraums und Referenzkorpus nachgewiesen werden:

- bekannte Pflichtquellen werden zuverlässig direkt überwacht,
- neue bzw. geänderte Fundstellen werden persistent erkannt,
- Duplikate werden ausreichend sicher erkannt,
- erweiterter Suchraum und redaktionell geschärfte Suchkontexte werden berücksichtigt,
- relevante Ereigniskandidaten werden mit nachvollziehbarer Quelle erzeugt,
- Unsicherheit wird sichtbar gemacht,
- kein Ereignis wird ohne redaktionelle Bestätigung veröffentlicht.

### 6.1 Qualitätsmessung

Vor Pilotstart wird ein markierter Testkorpus aus bekannten positiven und negativen Fällen erstellt.

Für den Go-live gelten als Mindestanforderung:

- **kein bekannter kritischer Pflichtquellen-Fall darf systematisch übersehen werden**,
- alle im Testkorpus als besonders kritisch markierten Ereignisse müssen erkannt werden,
- Fehlalarme dürfen redaktionell handhabbar sein und keinen unverhältnismäßigen Prüfaufwand erzeugen,
- Qualitätswerte werden getrennt nach Aufgabenklasse dokumentiert und nicht zu einer einzigen irreführenden Gesamtquote verdichtet.

Konkrete Prozent-Schwellen für Precision/Recall werden erst aus dem Pilotkorpus abgeleitet, weil eine vorab erfundene Zahl ohne realistischen Datenbestand keine belastbare Qualitätsaussage wäre.

## 7. Redaktionsworkflow und Rechte

Pflichtkriterien:

- Redakteur und Admin können sich mit verpflichtender MFA anmelden.
- Besucher benötigen kein Konto.
- AI Tasks können keine S2-/S3-Aktion selbst bestätigen oder veröffentlichen.
- S3-Aktionen benötigen unmittelbare ausdrückliche Bestätigung.
- besonders kritische Admin-Aktionen erzwingen Step-up-MFA gemäß G6.
- Rollenentzug wirkt serverseitig ohne unzulässige Restrechte.
- Fachservices erzwingen Rechte unabhängig von UI-Sichtbarkeit.
- RLS/DB-Schutz verhindert unzulässige direkte Zugriffe.
- konkurrierende Änderungen werden durch Versions-/Konfliktprüfung erkannt.
- fachlich wirksame und sicherheitsrelevante Aktionen sind auditierbar.

## 8. Datenschutz und Schutzbedarf

Go-live ist blockiert, solange mindestens einer der folgenden Punkte offen ist:

- tatsächliches Verarbeitungsverzeichnis / Verarbeitungsinventar ist nicht finalisiert,
- Rechtsgrundlagen für realisierte personenbezogene Verarbeitungen sind nicht geprüft,
- erforderliche AV-Verträge/Providerbewertungen fehlen,
- DSFA-Vorprüfung ist nicht abgeschlossen oder eine erforderliche DSFA ist offen,
- Datenschutzerklärung bildet die realisierten Verarbeitungen nicht korrekt ab,
- K3 kann an externe KI übertragen werden,
- K2-Betriebswege sind nicht ausdrücklich freigegeben,
- Lösch-/Minimierungslogik ist technisch nicht umsetzbar,
- Secrets oder personenbezogene Daten werden unzulässig im Repository/Client/Logs geführt.

## 9. Öffentliche Website / PWA

Pflichtkriterien:

- statischer Build kann vollständig aus freigegebenem K0-Stand erzeugt werden,
- fehlerhafter Build ersetzt keinen funktionierenden öffentlichen Stand,
- Rollback auf vorherigen Release wurde getestet,
- keine K1/K2-Daten erscheinen im öffentlichen Artefakt,
- Navigation `Neues | Im Blick | Sitzungen | Suche` funktioniert auf Mobile und Desktop,
- wesentliche Detailseiten und Direktlinks funktionieren,
- „Neu seit letztem Besuch“ funktioniert gerätebezogen ohne zentrales Besucherprofil,
- PWA-Grundfunktionen funktionieren auf repräsentativen Browsern/Geräten,
- Web Push funktioniert nach Opt-in oder ist vor Go-live ausdrücklich aus dem MVP herausgenommen und dokumentiert,
- Teilen, Social Preview, Drucken/PDF und Sitemap/SEO-Grundlagen funktionieren,
- Transparenz-/Disclaimer-Inhalte sind erreichbar.

## 10. Barrierefreiheit und Bedienbarkeit

WCAG 2.2 AA bleibt technisches Ziel.

Vor Go-live müssen mindestens folgende Punkte geprüft sein:

- Tastaturbedienbarkeit der zentralen öffentlichen und redaktionellen Funktionen,
- ausreichende Kontraste,
- sinnvolle Fokusführung,
- strukturierte Überschriften und Landmarken,
- Alternativtexte für relevante Bilder,
- Bedienbarkeit bei Vergrößerung und kleinen Displays,
- Formulare/Fehlerhinweise verständlich und programmatisch zuordenbar,
- keine bekannten kritischen Barrierefreiheitsblocker im Hauptworkflow.

Nichtkritische Detailabweichungen dürfen nur mit dokumentiertem Folgeauftrag bestehen bleiben.

## 11. Betrieb, Backup und Wiederherstellung

Pflichtkriterien:

- täglicher externer Datenbank-Dump funktioniert automatisiert,
- Backupziel ist unabhängig vom laufenden Supabase-Projekt,
- Fehler des Backup-Jobs erzeugen eine Warnung,
- Datei-/Bildspeicher ist gesichert,
- Monitoring für Website, Fachservices, Backup, Storage, AI Tasks, Provider/Quoten und Kosten ist aktiv,
- Warnweg Redaktionsübersicht + E-Mail bzw. Zielbetriebsäquivalent funktioniert,
- **GitHub Issue #3 Restore-Test wurde erfolgreich abgeschlossen**, einschließlich Wiederherstellung in ein neues/leeres Zielprojekt,
- RPO/RTO-Ziele wurden im Pilot als realistisch bestätigt oder angepasst,
- Restore-/Notfall-Runbook ist aktuell.

Fehlender erfolgreicher Restore-Test ist ein harter Go-live-Blocker.

## 12. Migration und organisatorische Übergabe

Pflichtkriterien nach realer Migration:

- Migrations-Runbook vollständig abgearbeitet,
- Datenbestand und Datei-/Bildbestand vollständig und konsistent,
- Auth/Rollen/MFA geprüft,
- produktive Domains/Redirects korrekt,
- Deployment und Rollback in Zielumgebung getestet,
- produktive Secrets neu gesetzt und nur organisationskontrolliert gespeichert,
- GitHub/CI-CD, Supabase, Storage, KI-Provider, Mail/Monitoring und Domains organisatorisch übergeben,
- mindestens zwei technische Admins handlungsfähig,
- keine erforderliche produktive Funktion hängt von einem persönlichen Entwicklerkonto ab,
- alte/pilotbezogene Zugänge und Secrets sind nach Übergabe entfernt oder gesperrt.

## 13. KI-Qualität, Provider und Kosten

Pflichtkriterien:

- eingesetzte Provider-/Modellwege sind datenschutz- und schutzklassenbezogen freigegeben,
- Routing/Fallback respektiert Qualitätsklasse und Schutzklasse,
- Qualitätsvergleich für wesentliche Aufgabenklassen wurde mit Pilotdaten durchgeführt,
- ein Ausfall eines KI-Providers führt nicht zu unzulässigem Qualitäts-/Datenschutz-Fallback,
- Kostenmessung je Aufgabenklasse/Provider/Modell ist aktiv,
- Monatsbudget und Warnschwellen sind konfiguriert,
- Fehlerloops bzw. ungewöhnliche Nutzung können erkannt und begrenzt werden,
- Produktivbudget basiert auf Pilotmessungen und ist dokumentiert.

Eine reine Preisoptimierung darf keinen bekannten erheblichen Qualitätsverlust verursachen.

## 14. Sicherheit

Harte Go-live-Blocker sind insbesondere:

- bekannte kritische Sicherheitslücke,
- öffentlich erreichbarer privilegierter Schlüssel/Secret,
- fehlende RLS/Autorisierung an exponierten Datenpfaden,
- umgehbarer S3-Freigabeprozess,
- Administratorzugriff ohne verpflichtende MFA,
- unkontrollierter Zugriff auf K2/K3-Daten,
- nicht nachvollziehbare oder ungeschützte produktive Adminzugänge.

Vor Go-live werden die einschlägigen Supabase-/Anwendungs-Sicherheitsprüfungen und Abhängigkeitsscans ohne offene kritische Befunde durchgeführt.

## 15. Datenmigration aus dem Demonstrator

Vor Go-live muss der relevante Demonstratorbestand qualitätsgeprüft migriert sein.

Zu prüfen sind mindestens:

- Meldungen/Ereignisse,
- Vorgänge/Themen,
- Quellen/Links und Datumsarten,
- Sitzungs-/TOP-Bezüge,
- Bilder und Rechte-/Nutzungsinformationen,
- offene Fragen und „Mehr wissen?“-Inhalte,
- Referenzobjekte/Bezüge,
- historische Aktualisierungen und Status,
- stabile öffentliche Identifikatoren/Weiterleitungen soweit erforderlich.

Nicht übernommene Altbestände müssen bewusst dokumentiert sein; stiller Datenverlust ist nicht zulässig.

## 16. Dokumentation und Betriebsfähigkeit

Vor Go-live müssen aktuell und widerspruchsfrei sein:

- README/Einstieg,
- Dokumentationslandkarte,
- Datenmodell und Migrationen,
- Zielarchitektur,
- Rollen-/Rechte-/Workflow-Dokumentation,
- Betrieb-/Restore-Dokumentation,
- Migrationsstrategie/Runbook,
- Admin-/Notfallinformationen,
- tatsächliche Provider-/Umgebungs-/Betriebskonfiguration,
- offene Issues mit klarer Einstufung `vor Go-live` oder `nach Go-live`.

## 17. Go-live-Entscheidung

Die finale Produktivschaltung ist eine bewusste menschliche Freigabe.

Voraussetzung:

1. alle Pflichtkriterien geprüft,
2. keine offenen Blocker,
3. nichtkritische Restabweichungen dokumentiert und verantwortet,
4. letzter produktiver Datenstand/Backup gesichert,
5. Zielsystem vollständig validiert,
6. Verantwortliche auf Entwickler- und GRÜNEN-Seite bestätigen die Betriebsbereitschaft.

Die Freigabe und der zugrunde liegende Abnahmestand werden dokumentiert.

## 18. Bewusst spätere Punkte

Nicht automatisch Go-live-blockierend sind insbesondere bereits als spätere Ausbaustufe definierte Punkte wie:

- freie Besucher-Livefragen,
- erweiterte Push-Präferenzen,
- zusätzliche Social-/Messenger-Kanäle,
- komfortables Provider-Admin-UI,
- Referenzwissen-Ausbaustufe 2,
- externe MCP-Anbindung,
- zusätzliche Automatisierungen ohne MVP-Kernrelevanz.

Sie dürfen den Go-live nur blockieren, wenn im Pilot entgegen der ursprünglichen Annahme ein konkreter unverzichtbarer Bedarf nachgewiesen wird.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G10-Abnahmekriterien und harte Go-live-Blocker für Fachfunktion, Regression, Recherchequalität, Rechte, Datenschutz, öffentliche Seite/PWA, Barrierefreiheit, Betrieb/Restore, Migration, KI-Kosten/Qualität, Sicherheit und Dokumentation festgelegt. |
