# Fachliche Konsistenzprüfung und Kapitelzuordnung – PR #259

**Stand:** 26.10.2026 · **Status:** Prüfnotiz, keine fachliche Freigabe

## 1. Ergebnis der Strukturprüfung

Der Neufassungsentwurf zu Kapitel 03 stellt den Gesamtprozess verständlicher dar als eine reine Sammlung von Fachregeln. Er übergreift absichtlich mehrere Domänen. Für die abschließende Fachhandbuch-Migration ist dennoch sicherzustellen, dass **jede verbindliche Detailregel nur an einer primären Stelle** definiert wird. Kapitel 03 enthält andere Abläufe nur als sachliche Prozessschnittstelle.

**Empfohlene Leseführung:** Auftrag/Ziele → Gesamtmodell → Rechercheeinstiege → Fundstelle/Ereignis → Erkenntnisrecherche/Analyse → redaktionelle Entscheidung → Wirkung auf Veröffentlichungen. Objektprofile und Status-/Rechte-Details werden über Querverweise erschlossen. Das Gesamtmodell darf nicht den Eindruck einer starren Verarbeitungskette erzeugen: Meldungen sind optional, Ereignisse können ohne Vorgänge bestehen, Erkenntnisse können neue Recherchen und umgekehrt auslösen.

## 2. Zuordnung der Anforderungen zu fachlichen Primärkapiteln

| Anforderungsbereich | Primärkapitel | Kapitel 03 enthält künftig nur |
|---|---|---|
| Begriff und Beziehungen von Quelle, Fundstelle, Ereignis, Meldung, Vorgang, Thema und Analyse | 02 Wissensmodell | Vereinfachtes Gesamtmodell und Verweise |
| Recherchehorizont, Quellenabdeckung, offene/wissensgeleitete Sachverhaltsrecherche | 03 Recherche | Vollständige Prozess- und Regelbeschreibung |
| Redaktionelle Nachfragen, gezielter Rechercheauftrag, Teilfragen, Beobachtungsauftrag, Nachrecherche | 03 Recherche | Vollständige Prozess- und Regelbeschreibung, Verweise auf Analyse |
| Gesicherte Fundstelle, Ereigniserkennung, Ereigniskorrektur | 04 Ereignisse und Meldungen; Fundstellenprofil 02/03 | Schnittstelle mit Übergabe und Belegbezug |
| Meldungsentwurf, Folgemeldung, Rückblick, Korrekturhinweis, seltene politische Einordnung | 04 Ereignisse und Meldungen | Kurzer Ablaufüberblick |
| Vorläufige Vorgangsanlage, Erstanalyse, Sachstandsfortschreibung, Abschluss und Wiederaufnahme | 05 Vorgänge | Auslösung und Rückwirkung der Recherche |
| Aufbau und Freigabe der Vorgangsanalyse, Folgenanalyse, Änderungspakete | 05 Vorgänge, übergreifende Analysebegriffe 02 | Recherche-Anknüpfung und Ergebnis |
| Themenanlage, Bezüge, Bedeutung für das Thema, Themenanalyse, Vollständigkeitsprüfung | 06 Themen | Übergabe von Fundstellen/Ereignissen und Rechercheergebnissen |
| Vier Arbeitsbereiche des Themeneditors, getrennte Analyse-/Beitragsfreigaben | 06 Themen und 08 Redaktion | Prozessschnittstelle, keine zusätzliche UI-Pflicht |
| Redaktionsaufgaben, Übernahme/Zuweisung, Dringlichkeit, Veröffentlichungsplanung | 08 Redaktion | Verweis auf Entscheidungsanlässe |
| Inhaltliches/sprachliches Korrektorat, Belegdeckung, Schlussprüfung, Blocker | 10 Qualität; Freigabeprozess 08 | Kurzverweis |
| Öffentliche Darstellung und Verknüpfung von Meldungen und Themenbeiträgen | 09 Öffentliches Angebot | Keine konkurrierenden öffentlichen Gestaltungsregeln |
| Fachliche Rollen und Befugnisse | 11 Fachliche Rechte | Verweis auf autorisierte Entscheidungen |

**Hinweis:** Für Analyse-/Erkenntnisregeln muss beim Aufbau von Kapitel 02, 05 und 06 eine einheitliche gemeinsame Definition mit jeweils kontextbezogener Konkretisierung sichergestellt werden. Die Tabelle ist ein redaktioneller Migrationsplan, kein Datenmodellbeschluss.

## 3. Erkannte Widersprüche und Prüfung vor Regelersetzung

### K-01 Automatisch vorläufige Ereignisse
Alt: Kapitel 03 v3.0 §03.2/§03.3 beschreibt P4 „Rechercheergebnisse redaktionell übernehmen“, ohne automatisches Ereignisbestätigen.
Neu: FIB darf vorläufige Ereignisse automatisch erfassen und bearbeiten; redaktionell bestätigte Ereignisse dürfen nicht stillschweigend korrigiert werden.
**Prüfung:** Bestehende Sichtungsregel FIB-RECH-SICHTUNG-001 (direkte Feldkirchen-Fundstellen bleiben sichtlich und redaktionell prüfbar) ausdrücklich erhalten; automatische vorläufige Ereigniserfassung darf sie **nicht** umgehen oder als automatische endgültige Zurückstellung interpretieren.

### K-02 Themenfreigabe
Alt: Kapitel 06 verlangt die Auswertung mindestens eines Beobachtungsauftrags vor fachlicher Erstfreigabe.
Neu: Fachlich geprüfte Themenanalyse ist erforderlich; gesonderter Beobachtungsauftrag nur bei tatsächlichem längerfristigem Informationsbedarf.
**Prüfung:** Kapitel 06, Status-/Freigaberegeln, Tests und UI-Abnahmekriterien synchronisieren.

### K-03 Themeneditor
Alt: Kapitel 06 und bestehender Themeneditor mit drei Arbeitsbereichen.
Neu: Vier fachliche Bereiche **Definition – Bezüge – Analyse – Beitrag**; das sind keine vier Pflichtfreigaben.
**Prüfung:** Architektur- und UI-Umsetzung iterativ im Echtsystem; festgelegt sind **Anforderungen**, keine fertig spezifizierte Interaktion.

### K-04 Erkenntnisse und Beobachtungsaufträge
Alt: Kapitel 06 weist Beobachtungsaufträgen teilweise Erkenntnisgrundlagen zu, die wie selbstständiger Wissensbestand wirken.
Neu: Erkenntnisse liegen als strukturierte Inhalte in der Analyse von Vorgang/Thema. Beobachtungsaufträge dienen der Recherche und erzeugen Änderungsvorschläge.
**Prüfung:** Terminologie und Datenmodell vor Schemaänderung konsistent entscheiden.

### K-05 Themenbezugsstatus
Alt: Kapitel 06 FIB-THEMA-BEZUG-002 führt Kandidat/Zugeordnet/Zurückgestellt/Fachlich unpassend; FIB-THEMA-BEZUG-003 verlangt redaktionelle Bestätigung der Bedeutung.
Neu: FIB darf eindeutige Beziehungen **vorläufig** herstellen.
**Prüfung:** Vorläufige KI-Zuordnung auf bestehenden Kandidatenstatus abbilden, soweit fachlich zulässig; keine neuen Statuswerte ohne gesonderte Entscheidung. Bedeutungsvorschlag bleibt von redaktioneller Bedeutung getrennt.

### K-06 Begriff „Recherchelauf“
Alt: Kapitel 03 enthält expliziten Nachweis konkreter Ausführungen als Recherchelauf (z. B. FIB-RECH-LAUF-001).
Neu: „Rechercheauftrag“ ist fachlich ein Auftrag, einmalig oder längerfristig; **nicht** jede Ausführung setzt einen solchen Auftrag voraus.
**Prüfung:** Recherchelauf als nachweisbare Ausführung vom Auftrag unterscheiden; keine pauschale Löschung des technischen/betrieblichen Ausführungsnachweises.

### K-07 Rollen und Freigaben
Alt: Die bisherige Redaktion sichtet viele Fundstellen und bestätigt Zuordnungen; Altregeln und Rechte sind teils auf ältere Statusmodelle ausgerichtet.
Neu: KI darf mehr Vorarbeit eigenständig erledigen, jedoch keine verbindliche fachliche Freigabe und keine automatische Veröffentlichung.
**Prüfung:** Konkrete Berechtigungsmatrix, Versions-/Auditregeln und Tests vor Merge prüfen; nicht stillschweigend aus KI-Autonomie auf Rechte schließen.

## 4. Migrationsreihenfolge

1. Fachmodell und Begriffe in Kapitel 02 vereinheitlichen, ohne schon neue Datenbankobjekte anzulegen.
2. Kapitel 03 von bestehenden Regeln und §03.1-Suchhorizont auf das neue Prozessmodell abgleichen; P1–P5 und Regel-IDs erhalten bzw. nachvollziehbar umzuordnen.
3. Kapitel 04 für Fundstelle → Ereignis → Meldung und Kapitel 05 für Vorgang/Analyse präzisieren.
4. Kapitel 06 für Analysepflicht, vier Arbeitsbereiche, Teilfreigaben und Beitragsverarbeitung aktualisieren.
5. Kapitel 08 und 10 für Aufgabensteuerung, Korrektorat, Freigaben und Qualitätsblocker prüfen.
6. Querverweise, Regelkennungen, Rollen/Statusmatrix und Regressionstests abgleichen; erst danach bisherige Normstellen ersetzen.

**Abnahmebedingung:** Kein altes Primärkapitel verliert vor dokumentiertem Quellabschnittsabgleich seine normative Rolle. PR #259 bleibt bis zur Abnahme ein Entwurf.

## 5. Noch offene Lösungsentscheidungen

- Oberfläche zur Bearbeitung zusammenhängender Änderungspakete und zur Teilfreigabe einer Analyse
- Darstellung und erneute Prüfung offener Fragen ohne übermäßige Aufgabenlast
- Direkte kontextbezogene Nachfragen und differenzierte Recherchefreigabe
- Statusabbildung bei vorläufigen Vorgängen/Ereignissen/Themenbezügen
- Konkrete technische Auswirkungsprüfung mit Schleifen-/Duplikatschutz
- Genaues Verhalten blockierender Qualitätsmängel bei Veröffentlichungen

Diese Punkte sind für die Umsetzung **offen**, nicht als ungeklärte Ziele zu verstehen. Ihre fachlichen Anforderungen sind dokumentiert; konkrete Bedienlösungen werden iterativ in der bestehenden Anwendung erprobt.
