# Betrieb und Wiederherstellung – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Integrationsquelle für **G7 – Betrieb**.

Es legt die betrieblichen Anforderungen für Verfügbarkeit, Backup/Wiederherstellung, Monitoring, technische Aufbewahrung/Löschung, KI-Kosten-/Providerbetrieb und Störungsbehandlung fest. Fachliche Regeln, Rollen und Schutzklassen werden nicht neu definiert.

Verbindliche Grundlagen insbesondere:

- `docs/Zielarchitektur.md`
- `docs/Rollen-Rechte-und-Workflow.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md`
- `docs/KI-Betrieb-und-Kosten.md`
- `docs/decisions/ADR-003-Publikations-und-Deploymentprozess.md`
- `docs/decisions/ADR-005-AI-Tasks-Scheduler-und-Queue.md`
- `docs/decisions/ADR-007-KI-Router-und-Providerintegration.md`
- `docs/decisions/ADR-008-CI-CD-und-Deployment.md`

## 2. Betriebsprinzipien

1. **Öffentliche Verfügbarkeit und Redaktionsbetrieb sind entkoppelt.** Der zuletzt erfolgreich veröffentlichte K0-Stand bleibt auch bei Ausfall von Supabase, KI-Providern oder internem Speicher öffentlich lesbar.
2. **Kein einzelner externer Dienst ist alleinige Wiederherstellungsstrategie.** Backup und Reproduzierbarkeit werden zusätzlich außerhalb des laufenden Systems abgesichert.
3. **Wiederherstellbarkeit wird getestet, nicht nur behauptet.** Backups gelten erst als belastbar, wenn Restore-Verfahren regelmäßig geprüft werden.
4. **Betrieb folgt Datenminimierung.** Logs, Telemetrie und technische Zwischenstände werden zweckbezogen und begrenzt gespeichert.
5. **KI-Betrieb ist messbar.** Qualität, Kosten, Fehler und Fallbacks werden je Aufgabenklasse beobachtet.
6. **Fehler führen möglichst zu kontrollierter Degradation statt Datenverlust.** Bei Unsicherheit wird eine Aktion gestoppt oder in den bestehenden funktionierenden Zustand zurückgefallen.
7. **Produktive Abhängigkeiten sind organisationskontrolliert.** Mindestens zwei administrativ handlungsfähige Personen müssen im Zielbetrieb vorhanden sein.

## 3. Verfügbarkeitsklassen

FIB benötigt keine hochverfügbare 24/7-Redaktionsplattform. Die Anforderungen werden nach Wirkung unterschieden.

### A – öffentliche Website

Ziel: sehr hohe praktische Verfügbarkeit durch statische Auslieferung.

- letzter erfolgreicher Release bleibt online,
- kein laufender Datenbank- oder KI-Zugriff für normales Lesen,
- fehlerhafter neuer Build ersetzt niemals den bestehenden Stand,
- Rollback auf vorherigen Release muss möglich sein.

### B – Redaktion / Fachservices / Supabase

Ein zeitweiser Ausfall ist tolerierbar, darf aber keinen Datenverlust verursachen.

Vorläufiges Betriebsziel für den MVP:

- **RPO:** höchstens 24 Stunden Verlust seit letztem extern gesicherten Datenstand,
- **RTO:** Wiederaufnahme des Redaktionsbetriebs innerhalb eines Arbeitstags als Zielgröße.

Diese Werte sind vor Go-live anhand Pilotbetrieb und realem Redaktionsbedarf zu bestätigen.

### C – KI-Provider / Recherche

Ein einzelner KI-Provider ist nicht kritisch für die öffentliche Verfügbarkeit.

- zulässiger Fallback auf freigegebenen alternativen Betriebsweg,
- andernfalls Aufgabe verzögern und sichtbar als gestört markieren,
- niemals Schutz-/Datenschutzanforderungen zur Aufrechterhaltung des Betriebs absenken.

## 4. Backup-Strategie

FIB benötigt mehrere Sicherungsebenen.

### 4.1 Repository / Code / Konfiguration

GitHub ist die versionierte Quelle für:

- Anwendungscode,
- Datenbankmigrationen,
- Policies/Constraints/Funktionen,
- CI/CD,
- dokumentierte Konfigurationsschemas,
- Tests,
- Projektdokumentation.

Secrets und produktive personenbezogene Daten gehören nicht in GitHub.

### 4.2 Strukturierte FIB-Daten / Supabase PostgreSQL

Mindestens täglich muss ein unabhängiger wiederherstellbarer Datenbankstand verfügbar sein.

Für einen Supabase-Free-Betrieb gilt ausdrücklich:

- keine Annahme automatischer Plattform-Backups,
- externer automatisierter logischer Datenbankexport mindestens täglich,
- Sicherung außerhalb des laufenden Supabase-Projekts,
- Fehler des Backup-Jobs erzeugen eine Warnung,
- Wiederherstellung anhand dokumentiertem Runbook regelmäßig testen.

Bei einem späteren Plan mit verwalteten Plattform-Backups bleiben unabhängige Export-/Restore-Fähigkeit und Restore-Tests trotzdem erhalten.

### 4.3 Interner Datei-/Bildspeicher

Originale, interne Dokumente, Rechte-Nachweise und andere nicht reproduzierbare Dateien benötigen eine Sicherung getrennt von PostgreSQL.

- Speicher darf nicht nur in einer einzigen Nextcloud-/Storage-Instanz existieren,
- Sicherung umfasst Dateiinhalt und erforderliche Zuordnung/Metadaten,
- bei Wiederherstellung müssen DB-Referenzen und Dateiablage wieder konsistent zusammenpassen,
- öffentliche K0-Medien im Web-Release ersetzen kein Backup der Originale.

### 4.4 Öffentliche Releases

Jeder erfolgreiche öffentliche Deploy besitzt eine Releasekennung und bleibt für Rollback rekonstruierbar. Mindestens der aktuelle und mehrere vorherige Releases müssen kurzfristig verfügbar sein.

## 5. Restore und Restore-Test

Ein Backup ohne getesteten Restore gilt nicht als ausreichende Betriebssicherung.

Vor Go-live ist ein Restore-Runbook zu erstellen für mindestens:

1. neues/leeres Supabase-Zielprojekt bereitstellen,
2. Schema/Migrationen aus Repository herstellen,
3. gesicherten Datenbestand einspielen,
4. Datei-/Bildspeicher anbinden/wiederherstellen,
5. Secrets und externe Konfiguration setzen,
6. Fachservice-/Integritätstests ausführen,
7. Redaktionszugriff prüfen,
8. öffentlichen Build testweise erzeugen,
9. Ergebnis dokumentieren.

Vor Produktivstart muss mindestens ein vollständiger Restore-Test erfolgreich durchgeführt werden. Danach Wiederholung mindestens jährlich sowie nach wesentlichen Architekturänderungen.

## 6. Supabase Free / Pausierung

Free-Projekte dürfen für Entwicklung/Pilot verwendet werden, wenn der Betriebsweg dies zulässt.

Verbindlich:

- Pausierungsstatus bzw. Aktivität wird überwacht,
- Warnmails dürfen nicht alleinige Erkennung sein,
- ein technischer Keepalive kann Pausierung vermeiden, ist aber **keine** Backup- oder Hochverfügbarkeitsmaßnahme,
- Pausierung darf nicht zu Datenverlust oder Verlust der öffentlichen Website führen,
- vor Produktivstart wird anhand Pilotdaten entschieden, ob Free mit externer Sicherung und Monitoring genügt oder ein kostenpflichtiger Plan betrieblich sinnvoller ist.

Die Entscheidung erfolgt nach realem Nutzen/Kosten-Verhältnis, nicht aus Prinzip pro oder contra Bezahlplan.

## 7. Monitoring

FIB benötigt ein schlankes Betriebsmonitoring, kein komplexes Enterprise-Monitoring.

Mindestens zu überwachen:

- öffentliche Website erreichbar und gültige Releasekennung,
- letzter erfolgreicher Publish/Deploy,
- Supabase/Fachservices erreichbar,
- letzter erfolgreicher Datenbankbackup,
- Datei-/Bildspeicher erreichbar,
- Queue-/AI-Task-Stau und fehlgeschlagene Runs,
- KI-Providerfehler/Fallbackquote,
- ungewöhnliche Auth-/Berechtigungsfehler,
- Speicher-/Quota-Nutzung,
- Monatskosten und Budgetwarnungen.

Warnungen müssen an mindestens einen aktiv betreuten administrativen Kanal gehen; im Zielbetrieb sollen mindestens zwei Personen handlungsfähig sein.

## 8. Störungsprioritäten

### P1 – kritisch

Beispiele:
- öffentliche Website nicht erreichbar,
- Verdacht auf unberechtigte Veröffentlichung oder Sicherheitsvorfall,
- bestätigter Datenverlust/Korruption,
- kompromittiertes Secret/Admin-Konto.

Maßnahme: sofortige Sicherung des bestehenden Zustands, ggf. Veröffentlichung/Schreibzugriffe stoppen, Rollback/Secret-Rotation/Restore nach Runbook.

### P2 – erheblich

Beispiele:
- Redaktion/Fachservices nicht verfügbar,
- Supabase pausiert,
- Publish schlägt wiederholt fehl,
- Backup überfällig,
- Queue steht.

Maßnahme: zeitnah beheben; öffentliche Seite darf zunächst auf letztem gültigem Stand weiterlaufen.

### P3 – eingeschränkt

Beispiele:
- ein KI-Provider gestört, zulässiger Fallback vorhanden,
- einzelne automatische Recherche fehlgeschlagen,
- optionale Redaktions-KI nicht verfügbar.

Maßnahme: Fallback oder spätere Wiederholung; keine Absenkung fachlicher Qualitäts-/Sicherheitsregeln.

## 9. Technische Aufbewahrung / Löschung

Grundlage bleibt die G4-Löschlogik. Für G7 gelten folgende MVP-Betriebswerte als Ausgangspunkt:

| Datenart | MVP-Regel |
|---|---|
| technische normale Fehler-/Request-Logs | grundsätzlich 30 Tage, soweit kein konkreter Störungs-/Sicherheitsfall längere Aufbewahrung rechtfertigt |
| detaillierte KI-Nutzungs-/Kostenmetadaten ohne unnötige Inhaltskopien | 12 Monate für Kosten-/Qualitätsvergleich, danach aggregieren oder löschen, sofern kein anderer Zweck besteht |
| AI-Task-/Recherche-Run-Metadaten | fachlich relevante Provenienz nach Fachmodell; rein technische Debugdaten 30 Tage |
| Push-Subscriptions | bis Abmeldung oder technische Ungültigkeit; ungültige Endpunkte zeitnah löschen |
| deaktivierte Kontodaten | Zugriff sofort entziehen; identifizierende Daten nach Wegfall des Verwaltungs-/Nachweiszwecks minimieren |
| Backups | rollierend; vorläufig 35 Tage für tägliche externe DB-Sicherungen, danach automatisch löschen, soweit kein dokumentierter Anlass zur längeren Aufbewahrung besteht |
| öffentliche Releases | aktueller Stand plus ausreichende Rollback-Historie; keine unbegrenzte technische Releaseablage erforderlich, fachliche Historie bleibt im FIB-Datenbestand |

Diese Fristen sind technische Betriebswerte, keine pauschale Aussage zur fachlichen oder gesetzlichen Aufbewahrung. Vor Go-live werden sie mit dem tatsächlichen Verarbeitungsverzeichnis und den eingesetzten Providern gegengeprüft.

## 10. KI-Kosten- und Providerbetrieb

Die in `docs/KI-Betrieb-und-Kosten.md` festgelegten Grundsätze gelten weiter.

Verbindlich im Betrieb:

- Nutzung/Kosten je Aufgabenklasse, Provider/Modell und Primär-/Review-Rolle erfassen,
- ungewöhnliche Nutzung und Fehlerloops erkennen,
- Monatsbudget und Warnschwellen konfigurierbar halten,
- Routingänderungen erst nach Qualitätsprüfung,
- Provider-/Modellausfall nur auf bereits freigegebenen Betriebsweg umleiten,
- Preisänderung allein löst keinen automatischen Modellwechsel aus,
- Datenschutz-/Schutzklassenfreigaben sind harte Routinggrenzen.

Vorläufiger Planungsrahmen bleibt bis zur Pilotkalibrierung der vorhandene Korridor aus `KI-Betrieb-und-Kosten.md`; verbindliches Produktivbudget wird erst aus Pilotmessungen festgelegt.

## 11. Kostenwarnungen

Mindestens drei Zustände:

1. **normal** – innerhalb Plan,
2. **Warnung** – erkennbare Überschreitungstendenz,
3. **Limit/Eskalation** – konfiguriertes Budget/technisches Limit erreicht oder Fehlerloop vermutet.

Bei Limit/Eskalation werden zuerst optionale bzw. wiederholbare KI-Aufgaben gestoppt oder verzögert. Fachlich notwendige Funktionen werden nicht stillschweigend auf schlechtere Modelle umgestellt.

## 12. Provider- und Secret-Betrieb

- produktive Providerkonten organisationskontrolliert,
- Secrets ausschließlich in dafür vorgesehenem Secret-Store/Deployment-Umgebung,
- keine Secrets in Repository, Browsercode, Logs oder KI-Prompts,
- Schlüsselwechsel muss ohne Fachmodelländerung möglich sein,
- bei Verdacht auf Kompromittierung sofortige Sperrung/Rotation,
- Providerfreigaben und Regionen sind versionierte Betriebskonfiguration,
- mindestens zwei Admins müssen Zugriff auf notwendige Wiederherstellungs-/Providerinformationen haben.

## 13. Regelmäßige Betriebsprüfungen

### Automatisch / laufend

- Erreichbarkeit und Releasezustand,
- Backup-Erfolg,
- Queue-/Task-Fehler,
- Budget-/Quota-Werte,
- wesentliche Auth-/Sicherheitsfehler.

### Monatlich

- KI-Kosten und Fallback-/Fehlerquote,
- Speicher-/Quota-Trend,
- fehlgeschlagene/überfällige Automationen,
- ungültige Push-Endpunkte,
- auffällige Betriebsereignisse.

### Mindestens jährlich

- vollständiger Restore-Test,
- Admin-/Konten-/MFA-Prüfung,
- Provider-/AVV-/Datenschutzprüfung,
- Notfall-/Kontakt- und Runbook-Prüfung.

## 14. Noch offene G7-Punkte

Vor Abschluss von G7 sind insbesondere zu entscheiden bzw. zu prüfen:

1. Bestätigung der vorläufigen RPO-/RTO-Ziele (24 h / ein Arbeitstag),
2. Bestätigung der technischen Retentionwerte (insbesondere 30 Tage Logs, 35 Tage Backups, 12 Monate KI-Kostenmetadaten),
3. Festlegung der konkreten Warn-/Benachrichtigungskanäle im Zielbetrieb,
4. Schlussaudit gegen G4–G6 und `KI-Betrieb-und-Kosten.md`.

Konkrete Provider-/Tarifentscheidung für den Produktivbetrieb wird erst vor Go-live anhand Pilotdaten getroffen; sie ist kein dauerhaftes Architekturprinzip.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 06.10.2026 | G7 gestartet; Betriebsprinzipien, Verfügbarkeitsklassen, Backup/Restore, Free-Plan-Pausierung, Monitoring, Störungsprioritäten, Retention, KI-Kosten-/Providerbetrieb und regelmäßige Prüfungen konsolidiert. |
