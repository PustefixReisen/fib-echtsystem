# Umsetzungs-Vollständigkeitsaudit – FIB Echtsystem

## Dokumentstand

| Version | Stand | Status |
|---|---|---|
| 0.2 | 10.10.2026 | G2.5-Statusinkonsistenz bereinigt; UV-006 bis UV-010 nach PR #45 von rot auf gelb gesetzt, da fachliche Operationalisierung erfolgt und nur technische Umsetzung/Tests offen bleiben. |
| 0.1 | 10.10.2026 | erste systematische Prüfung |

## 1. Zweck

Dieser Audit prüft nicht erneut, ob FIB fachlich ausreichend beschrieben ist. Er prüft, ob dokumentierte fachliche Regeln und Funktionen **vollständig in die operative Umsetzungsplanung übertragen** sind.

Verbindlicher Maßstab aus der zentralen pustivo-Governance:

> **Eine fachliche Regel gilt erst dann als vollständig in die Umsetzungsplanung übertragen, wenn geklärt ist, wo sie operativ gespeichert wird, welche Fachfunktion sie verwendet und über welchen Arbeits- oder KI-Prozess sie wirksam wird.**

Für jede relevante Funktion werden – soweit einschlägig – folgende Ebenen geprüft:

1. fachliche Primärdokumentation,
2. operative Datenhaltung / Regelquelle,
3. Fachfunktion bzw. Serviceaktion,
4. Auslöser und Ausführungsweg,
5. KI-Kontext,
6. Redaktions-/Admin-UI,
7. Rechte / Bestätigung / Audit,
8. Test- bzw. Abnahmekriterium,
9. Zuordnung zu einer Umsetzungsphase.

## 2. Ergebnisübersicht

Die bisherige Gründungs- und Transferdokumentation ist fachlich umfangreich, aber der Abgleich zeigt mehrere Stellen, an denen eine dokumentierte Funktion **noch nicht vollständig auf alle Umsetzungsebenen abgebildet** ist.

Es handelt sich überwiegend nicht um fehlende Fachideen, sondern um fehlende Verbindungen zwischen Dokumentation, Datenmodell, Fachfunktionen, UI und Roadmap.

### Status

- **GRÜN** – operative Kette ausreichend beschrieben.
- **GELB** – wesentliche Teile vorhanden, mindestens eine Umsetzungsebene muss noch explizit ergänzt werden.
- **ROT** – zentrale dokumentierte Funktion besitzt noch keine ausreichend vollständige operative Abbildung.

## 3. Prüfmatrix

| ID | Funktion / Regel | Datenhaltung | Fachfunktion | UI / Ausführung | Test / Phase | Status / Befund |
|---|---|---|---|---|---|---|
| UV-001 | Recherche- und Relevanzregeln | strukturierter, versionierter operativer Regelbestand ist im Datenmodell verankert | Regelpflege/-test wird als geschützte Adminfunktion mit KI-Unterstützung geführt | Admin-Regelpflege per KI-Dialog + Differenzansicht | Regression bekannter Fälle und Probe-Recherche zur Entdeckungswirkung in U4/U6 | **GELB – fachliche Operationalisierung geschlossen; technische DB-/Service-Umsetzung und Tests offen** |
| UV-002 | Persistenz nicht relevanter Fundstellen / negativer Testkorpus | Fundstelle vorhanden; Lösch-/Lebenszyklusregel muss negative Fälle ausdrücklich schützen | register_finding/run_research vorhanden | Fundprüfung vorhanden | Regression alter/neuer Regeln + negative Fälle ergänzen | **GELB** |
| UV-003 | Redaktionell eingebrachte Quellen/Dateien ohne öffentliche URL | Quelle/Fundstelle, Speicherort, Sichtbarkeit und Rechte sind modelliert | register_finding + manage_finding_access vorhanden | konkreter Einstieg „Quelle/Datei hinzufügen“ ist im UI-Konzept nicht ausreichend explizit | U2/U4 End-to-End-Test mit internem PDF ergänzen | **GELB** |
| UV-004 | Beobachtungsaufträge | Beobachtungsauftrag + Recherchelauf modelliert | manage_observation_task + run_research | Recherche-UI vorhanden | U2/U4 zugeordnet, Roadmap sollte Objekt explizit nennen | **GELB** |
| UV-005 | Offene Fragen / Wissenslücken | eigenes Datenobjekt vorhanden | manage_open_question vorhanden | fachlich beschrieben; im U2-Umfang nicht ausdrücklich genannt | Regression vorhanden/erweiterbar | **GELB** |
| UV-006 | Federführung | fachlich modelliert; SQL-Abbildung im Implementierungs-PR vorbereitet | `manage_lead_responsibility` implementiert | UI-Regeln + Objektanzeige vorhanden | produktive Migration und Integrationstest offen | **GELB – Implementierung begonnen** |
| UV-007 | Letzte Bearbeitung / Bearbeitungssperre / Lock | SQL-Locktabelle vorbereitet | Acquire/Renew/Release/Force-Release implementiert | detailliert im UI-Konzept | Konkurrenz- und Admin-Force-Release-Test ergänzt; DB-Integration offen | **GELB – Implementierung begonnen** |
| UV-008 | Übernahmeanfrage zwischen Redakteuren | SQL-Abbildung vorbereitet | `request_handover` / `respond_handover` implementiert | UI-Ablauf vorhanden | Mailauslösung und End-to-End-Test bleiben U2 | **GELB – Implementierung begonnen** |
| UV-009 | Rufname | SQL-Feld `call_name` vorbereitet | über `manage_app_user` pflegbar | Benutzer-&-Rollen-UI + Wireframe vorhanden | produktive Migration und UI-Anbindung offen | **GELB – Implementierung begonnen** |
| UV-010 | Benutzer anlegen/einladen/deaktivieren/löschen | `app_users` um Namen/Rufname/Setupstatus vorbereitet | `manage_app_user` und `deactivate_app_user` implementiert; Auth-Einladung und sichere Endlöschung noch offen | vollständiger UI-/Wireframe-Stand vorhanden | Rollen-/MFA-Tests ergänzt; Auth-Orchestrierung und Löschprüfung offen | **GELB – Teilimplementierung** |
| UV-011 | Referenzobjekte / Referenzrahmen | Datenmodell verwendet teilweise ältere Begriffe Referenzwissen/Referenzmaßstab | Fachfunktionen verwenden ebenfalls ältere Begriffe | UI verwendet neue Begriffe | Terminologie und Objektabbildung synchronisieren | **GELB** |
| UV-012 | Schwellenwerte & Statusregeln | eigenes Fachobjekt vorhanden | Pflege-/Aktivierungsfunktion im MVP-Katalog nicht ausdrücklich ausgewiesen | Admin-UI vorhanden | Audit-/Versionstest nötig | **GELB** |
| UV-013 | Kommunikation | detaillierter UI-Bereich vorhanden | kein klarer Fachfunktionsvertrag | UI vorhanden | Roadmap/Datenhaltung offen | **ROT – Klassifikation erforderlich:** operative FIB-Funktion oder nur redaktionelle Arbeitshilfe |
| UV-014 | Besucherführung | detaillierter UI-Bereich vorhanden | kein klarer Fachfunktionsvertrag | UI vorhanden | Roadmap/Datenhaltung offen | **ROT – Klassifikation erforderlich** |
| UV-015 | Auswertung: Besucher & Wirkung / Inhalte / Recherche / Redaktion | fachliche Kennzahlen beschrieben; technische Datenquellen nur teilweise zugeordnet | kein eigener Auswertungs-Funktionsvertrag | vier UI-Sichten vorhanden | U2/U5/U6-Zuordnung und Messdaten-Vertrag schärfen | **GELB** |
| UV-016 | „Unsere Einordnung“ | strukturierter Redaktionsstand/Bewertung modelliert | manage_editorial_assessment + release_editorial_state | Redaktionsworkflow vorhanden | Freigaberegeln vorhanden | **GRÜN** |
| UV-017 | Mehr wissen? | eigenes Modell vorhanden | manage_deep_dive_content | Redaktion + öffentliche UX beschrieben | Regression/Go-live geregelt | **GRÜN** |
| UV-018 | Bilder/Rechte/Verwendung | Datenmodell und Bildmodell vorhanden | manage_image_use | Redaktions- und öffentliche UX vorhanden | Transfer-/Go-live-Tests vorhanden | **GRÜN** |
| UV-019 | Sitzungen/TOP/Beschlusslogik | detailliert modelliert | manage_meeting_context | öffentliche und interne UX vorgesehen | Regression/Go-live vorhanden | **GRÜN** |
| UV-020 | PWA / Neu seit letztem Besuch / Push | technische Persistenz überwiegend client-/servicebezogen | technische Funktionen später abzuleiten | öffentliche UX vorhanden | U3/U6 klar zugeordnet | **GRÜN / technische Detailplanung später** |
| UV-021 | Audit | Auditbedarf fachlich und sicherheitsseitig beschrieben | querschnittliche Fachservice-/Auditlogik vorgesehen | Admin-Audit detailliert | U1/U2/U6 | **GELB**, konkrete Eventabdeckung beim Implementieren verifizieren |
| UV-022 | FIB-Assistent | Kontext- und Bestätigungsprinzip dokumentiert | nutzt reguläre Fachfunktionen statt eigener Schreibrechte | global + kontextuell beschrieben | U2; End-to-End-Tests fehlen noch | **GELB** |

## 4. Konsistenzstatus G2.5

Die zuvor festgestellte Statusdifferenz bei G2.5 wurde am 10.10.2026 bereinigt. Die zweite Prüfschicht war laut ihrem Abschlussdokument bereits vollständig abgeschlossen; der übergeordnete Transfer-Audit war lediglich nicht auf diesen späteren Stand nachgezogen worden.

Damit führen `Transfer-Audit-Demonstrator-Echtsystem.md`, `Transfer-Audit-Inhaltsbausteine-und-Redaktionsfunktionen.md`, `Projektgruendung.md` und `Roadmap.md` G2.5 nun konsistent als fachlich abgeschlossen.

## 5. Konsequenzen für die weitere Umsetzung

Der Audit führt nicht zu einem Neustart der Planungsphase. U1-Infrastruktur kann weitergeführt werden. Vor der Implementierung eines betroffenen Fachbereichs muss jedoch dessen operative Kette geschlossen sein.

Priorität vor bzw. zu Beginn von U2/U4:

1. Recherche-/Relevanzregeln einschließlich Regelversionierung und Regeltests vollständig operationalisieren.
2. Federführung, Letzte Bearbeitung, Locks und Übernahmeanfrage in Datenmodell + Fachfunktionen überführen.
3. Benutzer-&-Rollen-Administration vollständig ins Repository überführen.
4. Upload-/Erfassungsworkflow für nicht öffentliche redaktionelle Quellen explizit im UI und in Tests verankern.
5. Referenzbegriffe und Fachfunktionsnamen synchronisieren.
6. Kommunikation und Besucherführung fachlich klassifizieren und daraus Daten-/Funktionsbedarf ableiten.
7. Auswertungsbereiche den konkreten Messdatenquellen und Umsetzungsphasen zuordnen.
8. Roadmap und Go-live-Testkatalog entsprechend ergänzen.

## 6. Neue dauerhafte Auditregel

Künftige Dokumentations- und Umsetzungsprüfungen prüfen nicht nur Dokumentation gegen Code, sondern zusätzlich die Kette:

> **Fachregel → operative Speicherung → Fachfunktion → Auslöser/KI-Kontext → UI/Arbeitsprozess → Rechte/Audit → Test → Umsetzungsphase**

Eine Lücke in dieser Kette wird als Umsetzungs- bzw. Dokumentationsschuld geführt.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 10.10.2026 | Erste systematische Prüfung der dokumentierten FIB-Funktionen gegen operative Datenhaltung, Fachfunktionen, UI/Ausführung, Tests und Roadmap. |
