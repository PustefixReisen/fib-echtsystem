# G7-Gesamtaudit – Betrieb

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck

Dieses Dokument prüft den Abschluss von **G7 – Betrieb** gegen die verbindlichen Grundlagen aus G4–G6 sowie den KI-Betrieb.

Geprüfte Hauptquellen:

- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md`
- `docs/Zielarchitektur.md`
- `docs/G5-Gesamtaudit.md`
- `docs/Rollen-Rechte-und-Workflow.md`
- `docs/G6-Gesamtaudit.md`
- `docs/KI-Betrieb-und-Kosten.md`
- `docs/Betrieb-und-Wiederherstellung.md`
- `docs/decisions/ADR-010-Backup-Pilotbetrieb.md`

## 2. Prüffelder

### 2.1 Backup und Wiederherstellung

**Bestanden.**

- strukturierte Daten werden mindestens täglich extern gesichert,
- Pilotkette Supabase → Nextcloud → lokaler PC → Back In Time ist festgelegt,
- Datei-/Bildspeicher und Datenbank werden getrennt betrachtet,
- Restore-Test ist vor Produktivstart verpflichtend,
- GitHub Issue #3 stellt den Restore-Test als offenen Go-live-Arbeitspunkt sicher,
- Backup-Erfolg wird überwacht.

Es besteht kein Widerspruch zur Static-first-Architektur: Ein Backend-Ausfall beeinträchtigt nicht automatisch den bereits veröffentlichten K0-Stand.

### 2.2 Datenschutz und Retention

**Bestanden.**

- technische Logs werden begrenzt aufbewahrt,
- detaillierte KI-Kosten-/Nutzungsmetadaten werden nach 12 Monaten aggregiert oder gelöscht, soweit kein anderer Zweck besteht,
- tägliche DB-Dumps werden in Nextcloud rollierend 35 Tage gehalten,
- lokale Back-In-Time-Stände unterliegen derselben Datenschutz-/Zugriffsschutzlogik,
- Fachhistorie wird weiterhin von unnötig persistierenden personenbezogenen Zusatzdaten getrennt,
- keine generelle Langzeitarchivierung vollständiger KI-Dialoge wird eingeführt.

Die endgültige Datenschutzprüfung der konkret eingesetzten Provider und Verarbeitungstätigkeiten bleibt Go-live-Voraussetzung und ist kein offener G7-Architekturpunkt.

### 2.3 Monitoring und Störungsbehandlung

**Bestanden.**

- öffentliche Website, Fachservices, Backup, Datei-/Bildspeicher, Queue/AI Tasks, Provider, Auth-Fehler, Quoten und Kosten sind als Monitoringgegenstände definiert,
- P1/P2/P3 unterscheiden Wirkung und Reaktionsbedarf,
- Pilot-Warnweg Redaktionsübersicht + E-Mail ist ausreichend schlank,
- P1/P2 werden unmittelbar gemeldet,
- P3 bleibt sichtbar und wird erst bei Wiederholung/Häufung eskaliert,
- im Zielbetrieb müssen mindestens zwei administrativ handlungsfähige Personen Warnungen empfangen bzw. bearbeiten können.

### 2.4 Rollen, Secrets und Sicherheitsbetrieb

**Bestanden.**

- G6-Rollenmodell wird nicht durch technische Betriebszugriffe aufgeweicht,
- Secrets bleiben außerhalb Repository, Browsercode, Logs und KI-Prompts,
- Schlüsselrotation ist vorgesehen,
- kompromittierte Konten/Secrets sind P1,
- produktive Providerkonten sollen organisationskontrolliert sein,
- mindestens zwei Admins müssen Wiederherstellungs-/Providerinformationen erreichen können.

### 2.5 KI-Kosten und Providerbetrieb

**Bestanden.**

- Nutzung und Kosten werden je Aufgabenklasse/Provider/Modell beobachtet,
- Budgetwarnungen und Fehlerloops sind vorgesehen,
- optionale/wiederholbare KI-Aufgaben werden vor fachlich notwendigen Funktionen gedrosselt,
- Kostenüberschreitung führt nicht automatisch zu einem qualitativ schlechteren Modell,
- Fallbacks bleiben auf freigegebene Betriebswege beschränkt,
- Datenschutz-/Schutzklassenregeln bleiben harte Grenzen.

Der konkrete produktive Budgetwert bleibt bewusst Pilot-/Go-live-Kalibrierung und ist kein offener G7-Grundsatz.

### 2.6 Verfügbarkeit und Wiederanlauf

**Bestanden.**

Für das MVP gelten:

- RPO Redaktionsdaten: maximal 24 Stunden,
- RTO Redaktionsbetrieb: innerhalb eines Arbeitstags als Zielgröße,
- öffentlicher Stand bleibt bei internen Störungen auf letztem gültigem Release verfügbar,
- strengere Werte können nach Pilotbetrieb festgelegt werden, ohne Architekturänderung.

## 3. Erkannte Restaufgaben für spätere Phasen

Folgende Punkte sind bewusst keine offenen G7-Grundsatzfragen:

1. tatsächlichen Restore-Test durchführen – GitHub Issue #3, spätestens U6/G10,
2. konkrete produktive Empfängeradressen/Verantwortliche festlegen – vor Go-live,
3. konkrete Provider-/Tarife und Budgetwerte anhand Pilotdaten festlegen – G10/Betriebsfreigabe,
4. Datenschutz-/AVV-/DSFA-Prüfung der real eingesetzten Betriebswege finalisieren – vor Go-live,
5. technische Umsetzung von Backupjobs, Monitoring und Warnversand – U1/U5.

## 4. Ergebnis

**G7 ist fachlich und architektonisch abgeschlossen.**

Es wurden keine Widersprüche zu G4, G5, G6 oder dem KI-Betriebsmodell festgestellt. Die verbleibenden Punkte sind Umsetzungs- bzw. Go-live-Aufgaben und werden in den dafür vorgesehenen späteren Phasen behandelt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G7-Schlussaudit gegen Datenschutz, Zielarchitektur, Rollen/Rechte, Backup/Restore, Monitoring und KI-Betrieb durchgeführt; G7 ohne offene Grundsatzwidersprüche abgeschlossen. |
