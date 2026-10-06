# Rollen, Rechte und Workflow – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Integrationsquelle für **G6 – Rollen / Rechte / Workflow**.

Es konkretisiert die bereits festgelegten Rollen, Aktionsstufen, Schutzklassen und Fachfunktionsregeln zu einer technischen Berechtigungs-, Bestätigungs- und Workflow-Matrix. Es definiert keine neuen fachlichen Datenobjekte und dupliziert nicht die Detailregeln der jeweiligen Fachmodelle.

Verbindliche Grundlagen insbesondere:

- `docs/KI-Zugangswege-und-Fachfunktionen.md`
- `docs/MVP-Fachfunktionen.md`
- `docs/Fachliche-Plausibilitaets-und-Freigaberegeln.md`
- `docs/Schutzbedarf-Datenschutz-und-Offline.md`
- `docs/Zielarchitektur.md`
- `docs/decisions/ADR-006-Authentifizierung-und-Rechtearchitektur.md`

## 2. Rollen

FIB verwendet im MVP drei menschliche Rollen:

1. **Besucher** – öffentliche Nutzung ohne redaktionelle oder administrative Rechte,
2. **Redakteur** – interne Recherche, Bearbeitung, fachliche Entscheidungen sowie Freigabe und Veröffentlichung im vorgesehenen Workflow,
3. **Admin** – alle Redaktionsrechte plus Benutzer-/Rollenverwaltung, sicherheits- und systemweite Konfiguration sowie besonders geschützte normative Änderungen.

Eine eigene Publisher-Rolle wird nicht eingeführt. Ein Redakteur darf veröffentlichen.

**AI Tasks sind keine menschliche Rolle.** Sie sind technische Akteure mit eigenen, engeren Rechten.

## 3. Aktionsstufen

| Stufe | Bedeutung | Grundregel |
|---|---|---|
| S0 | Lesen / analysieren | keine fachliche Datenänderung |
| S1 | Vorschlag / Entwurf | keine verbindliche fachliche Wirkung |
| S2 | fachlich wirksam ändern | bestätigt internen FIB-Fachstand |
| S3 | freigeben / veröffentlichen / normativ aktivieren | öffentliche oder systemweit regelwirksame Wirkung |

Berechtigung ergibt sich aus:

> **Rolle × Fachaktion × Objektzustand × Schutzklasse × erforderliche Aktionsstufe × Zugangsweg/Bestätigungssituation.**

Der Zugangsweg allein erzeugt keine zusätzlichen Rechte.

## 4. Grundmatrix der Akteure

| Akteur | S0 | S1 | S2 | S3 |
|---|---:|---:|---:|---:|
| Besucher | nur K0-öffentliche Sicht | nein | nein | nein |
| Redakteur | ja, soweit fachlich/schutzrechtlich zulässig | ja | ja, nach Fachregeln | ja, mit unmittelbarer expliziter Bestätigung |
| Admin | ja | ja | ja | ja, einschließlich Adminvorbehalte |
| AI Task | ja, nur freigegebener Kontext | ja | nein | nein |

Für K2-Zugriffe gelten zusätzlich G4-Schutz- und Datenschutzregeln. K3 ist kein regulärer fachlicher Bearbeitungskontext und darf nicht an externe KI gelangen.

## 5. Berechtigungsmatrix der MVP-Fachfunktionen

Legende:
- **R** = Redakteur
- **A** = Admin
- **AI** = AI Task
- **B** = Besucher
- `–` = nicht zulässig

| Fachfunktionsfamilie | typische Stufe | B | R | A | AI | besondere Regel |
|---|---|---:|---:|---:|---:|---|
| `search_fib_context`, `get_*`, `list_*` | S0 | nur K0 | ja | ja | ja, freigegebener Kontext | Sichtbarkeit nach Schutzklasse und Objektstatus |
| `run_research` | S0/S1 | – | ja | ja | ja | erzeugt keine bestätigten Ereignisse oder Veröffentlichung |
| `manage_source` | S1/S2 | – | ja | ja | nur S1-Vorschlag | fachlich wirksame Quellenänderung durch Mensch |
| `register_finding` | S1/S2 | – | ja | ja | ja, soweit als Fund/Vorschlag | öffentliche Bereitstellung davon getrennt |
| `manage_finding_access` | S2/S3 | – | ja | ja | – | erstmalige öffentliche Bereitstellung = S3 |
| `propose_event` | S1 | – | ja | ja | ja | keine Ereignisbestätigung |
| `confirm_event` | S2 | – | ja | ja | – | bestätigtes Ereignis nur durch Mensch |
| `edit_message_draft` | S1 | – | ja | ja | ja | Textentwurf ohne verdeckte Änderung des Fachstands |
| `approve_message` | S2 | – | ja | ja | – | redaktionelle Freigabe, noch keine Veröffentlichung |
| `publish_message` | S3 | – | ja | ja | – | immer unmittelbare explizite Bestätigung |
| `manage_process` | S1/S2 | – | ja | ja | nur S1 | Merge/Zusammenführung besonders geschützt |
| `manage_topic` | S1/S2 | – | ja | ja | nur S1 | Dublettprüfung verpflichtend |
| `manage_editorial_assessment` | S1/S2 | – | ja | ja | nur S1 | strukturierter Fachstand maßgeblich |
| `release_editorial_state` | S2/S3 | – | ja | ja | – | S3, wenn öffentlicher Stand verändert wird |
| `manage_open_question` | S1/S2 | – | ja | ja | nur S1 | interne Wissenslücke |
| `manage_observation_task` | S1/S2 | – | ja | ja | nur Vorschläge/Folgejobs | Aktivierung fachlich wirksam, aber keine Veröffentlichung |
| `propose_reference_change` | S1 | – | ja | ja | ja | Vorschlag ohne Fachwirkung |
| `review_reference_change` | S2 | – | ja | ja | – | Bestätigung/Zurücknahme nur Mensch |
| `propose_reference_measure` | S1 | – | ja | ja | ja | normative Aktivierung getrennt |
| `manage_reference_measure_status` | S2/S3 | – | eingeschränkt | ja | – | besonders geschützte normative Aktivierung mit Adminvorbehalt |
| `manage_meeting_context` | S1/S2 | – | ja | ja | nur S1 bei unsicherer Ableitung | unsichere Beschluss-/TOP-Zuordnung benötigt Redaktionsprüfung |
| `manage_image_use` | S1/S2/S3 | – | ja | ja | nur S1 | erste öffentliche Bildverwendung = S3; Rechte müssen positiv geklärt sein |
| `manage_deep_dive_content` | S1/S2/S3 | öffentliche Ausgabe nur nach Release | ja | ja | nur S1 | Veröffentlichung quellengebundener Antwort = S3 |
| `manage_ai_task` | S1/S2 | – | ja, im fachlichen Rahmen | ja | – | systemweite Routing-/Grenzwerte mit Adminvorbehalt |

## 6. Bestätigungslogik

### 6.1 S0

Keine zusätzliche Bestätigung.

### 6.2 S1

Keine zusätzliche Bestätigung, wenn der Auftrag zur Erstellung eines Vorschlags/Entwurfs eindeutig ist.

### 6.3 S2

Eine klare Handlungsanweisung eines berechtigten Redakteurs kann bei risikoarmen Einzeländerungen als ausreichende Bestätigung gelten.

Eine zusätzliche explizite Bestätigung ist erforderlich, wenn mindestens einer der folgenden Fälle vorliegt:

- mehrdeutiger Auftrag,
- mehrere fachliche Objekte werden gleichzeitig wirksam geändert,
- bestätigte Information wird überschrieben, zurückgenommen oder zusammengeführt,
- erhebliche Folgebeziehungen werden verändert,
- eine Fachregel kennzeichnet den Vorgang ausdrücklich als besonders geschützt,
- K2-Inhalte oder sensible Personenbezüge erhöhen das Schadenspotenzial der Änderung.

Dann muss vor Ausführung ein kurzer fachlich relevanter Diff bzw. Vorher-/Nachher-Zustand angezeigt werden.

### 6.4 S3

**S3 benötigt immer eine unmittelbare explizite Bestätigung unmittelbar vor der Ausführung.**

Das gilt insbesondere für:

- Veröffentlichung oder Rücknahme einer Meldung,
- erstmalige öffentliche Bereitstellung einer internen Fundstelle/Datei,
- erste öffentliche Bildverwendung,
- Veröffentlichung/Freigabe von „Mehr wissen?“-Antworten,
- Aktivierung eines öffentlich wirksamen strukturierten Gesamtstands,
- Aktivierung oder wesentliche Änderung besonders geschützter Referenzmaßstäbe/Fachregeln,
- andere systemweit normative Änderungen.

Eine ältere allgemeine Zustimmung oder eine bloße S1/S2-Bearbeitungsanweisung ersetzt diese S3-Bestätigung nicht.

## 7. Besonders geschützte Aktionen

Für besonders folgenreiche S2-/S3-Aktionen gilt zwingend:

1. Änderung vorbereiten,
2. fachlich relevanten Diff/Wirkung anzeigen,
3. ausdrückliche Bestätigung einholen,
4. serverseitig Rolle, Schutzklasse, Objektzustand, Version und Bestätigung erneut prüfen,
5. Aktion ausführen,
6. Audit-/Historieneintrag erzeugen.

Dazu zählen mindestens:

- Veröffentlichung/Rücknahme,
- öffentliche Freigabe interner Dateien/Fundstellen/Bilder,
- Zusammenführung bestätigter Ereignisse oder Vorgänge,
- Änderung aktiver Fachregeln,
- Benutzer-/Rollenänderungen,
- Änderung besonders geschützter Referenzmaßstäbe,
- Änderung systemweiter KI-/Routing-Sicherheitsgrenzen.

## 8. Adminvorbehalte

Ein Redakteur bleibt fachlich handlungsfähig und darf veröffentlichen. Adminrechte werden deshalb **nicht** für normale redaktionelle Arbeit verlangt.

Adminvorbehalt besteht mindestens für:

- Benutzer anlegen/deaktivieren,
- Rollen vergeben/entziehen,
- sicherheitsrelevante Auth-/MFA-Konfiguration,
- Secrets/Providerzugänge und systemweite technische Sicherheitskonfiguration,
- Aktivierung besonders geschützter Fachregeln/Referenzmaßstäbe,
- Änderung systemweiter KI-Routing-Grenzen, Providerfreigaben oder Schutzklassenregeln,
- technische Betriebsaktionen mit möglicher Umgehung regulärer Fachrechte.

## 9. Rollenentzug und Sitzungen

Rollenentzug bzw. Deaktivierung muss serverseitig kurzfristig wirksam werden. Eine noch nicht abgelaufene Browser-/JWT-Sitzung darf nicht allein darüber entscheiden, ob ein Benutzer weiter fachlich schreiben oder veröffentlichen kann.

Jede S2-/S3-Aktion prüft deshalb den aktuellen serverseitigen Benutzer-/Rollenstatus erneut.

## 10. MFA und Step-up-Authentifizierung

Für den produktiven FIB-Betrieb gilt verbindlich:

> **MFA/TOTP ist für alle Redakteure und Admins verpflichtend.**

Besucher benötigen keine Anmeldung und damit keine MFA.

Die normale erfolgreiche Anmeldung mit zweitem Faktor reicht für gewöhnliche redaktionelle S2-/S3-Aktionen einschließlich Veröffentlichung aus. Eine erneute Eingabe eines Authenticator-Codes bei jeder Veröffentlichung wird **nicht** verlangt.

Eine zusätzliche **Step-up-Authentifizierung** unmittelbar vor Ausführung wird dagegen für besonders kritische administrative Aktionen vorgesehen, insbesondere wenn sie Rechte oder Sicherheitsgrenzen verändern. Dazu gehören mindestens:

- Rollen-/Rechteänderungen,
- Deaktivierung/Aktivierung administrativer Konten,
- Änderung sicherheitsrelevanter Auth-/MFA-Konfiguration,
- Änderung von Secrets oder Providerzugängen,
- Änderung systemweiter KI-/Routing-Sicherheitsgrenzen,
- Änderung von Schutzklassen- oder vergleichbaren systemweiten Sicherheitsregeln.

Step-up bedeutet: Die bestehende Sitzung muss einen hinreichend aktuellen starken Authentifizierungsnachweis besitzen; andernfalls ist eine erneute MFA-Prüfung erforderlich.

Damit werden normale redaktionelle Abläufe nicht unnötig erschwert, während administrative Hochrisikoaktionen stärker geschützt sind.

## 11. RLS- und Policy-Grenzen

RLS ist in FIB **Defense in Depth** und nicht die alleinige fachliche Berechtigungslogik.

Verbindliche Aufgabenteilung:

### Fachservice-Schicht

Sie entscheidet pro Fachaktion insbesondere über:

- menschliche/technische Rolle,
- konkrete Fachfunktion,
- Objektzustand und erlaubten Statusübergang,
- Schutzklasse und Personenbezug,
- S0–S3,
- erforderliche Bestätigung,
- Versions-/Concurrency-Prüfung,
- fachliche Plausibilitäts- und Freigaberegeln,
- Adminvorbehalt.

### RLS / Datenbank-Policies

Sie bilden bewusst gröbere, robuste technische Grenzen und verhindern insbesondere:

- anonyme Schreibzugriffe auf Fachtabellen,
- fachliche Schreibzugriffe ohne authentifizierten internen Akteur,
- direkten Zugriff auf nicht für den jeweiligen internen Kontext freigegebene K1/K2-Daten,
- Benutzer-/Rollen- oder Sicherheitsadministration durch Redakteure,
- regulären Browserzugriff mit privilegierten Service-Schlüsseln,
- Umgehung der vorgesehenen Service-Schicht über exponierte Standard-Data-APIs.

Nicht jede einzelne fachliche Statusregel wird doppelt in RLS nachmodelliert. Komplexe Fachregeln bleiben in den Fachservices und Datenbank-Constraints/Transaktionen. Dadurch entsteht kein zweites konkurrierendes Regelwerk.

Für produktive Browserzugriffe gilt grundsätzlich **least privilege**. Privilegierte Service-Rollen sind nur serverseitig zulässig.

## 12. Workflow-Grundsätze

- Web-App und FIB-Chat besitzen für denselben Benutzer grundsätzlich dieselben Fachrechte.
- Die Web-App darf Bedienelemente rollen-/statusabhängig ausblenden; dies ersetzt keine serverseitige Prüfung.
- Der Chat darf mehrere Fachfunktionen zu einem eindeutigen Benutzerauftrag verketten; jede Teilaktion wird separat geprüft.
- Eine S3-Aktion darf in einer solchen Kette nicht stillschweigend mitausgeführt werden.
- AI Tasks dürfen S0/S1 durchführen, aber keine menschliche S2-/S3-Entscheidung simulieren.
- Fachlich wirksame Änderungen verwenden Optimistic Concurrency/Versionsprüfung; veraltete Bearbeitungsstände dürfen bestätigte Daten nicht still überschreiben.
- Fehlende Berechtigung, fehlende Pflichtbestätigung, unzulässiger Objektzustand oder Schutzklassenverstoß sind harte Blocker und keine übersteuerbaren Warnungen.
- Dasselbe fachliche Ergebnis muss unabhängig vom Zugangsweg denselben Status-/Rechte-/Bestätigungsregeln unterliegen.

## 13. Auditanforderung

Für S2/S3 und besonders geschützte administrative Aktionen wird mindestens nachvollziehbar protokolliert:

- wer bzw. welcher technische Akteur,
- Zeitpunkt,
- Zugangsweg,
- aufgerufene Fachfunktion,
- betroffenes Objekt,
- fachlich relevanter Vorher-/Nachher-Zustand,
- verwendete Workflow-/Regelversion,
- erforderliche und erteilte Bestätigung,
- MFA-/Step-up-Anforderung und deren Erfüllung, soweit relevant,
- Ergebnis bzw. Ablehnungsgrund.

## 14. G6-Abschlussstand

Mit Version 1.0 sind die G6-Grundsatzfragen geklärt:

- Rollen und technische Akteure,
- S0–S3,
- Fachfunktionsrechte,
- Bestätigungslogik,
- Adminvorbehalte,
- AI-Task-Grenzen,
- verpflichtende MFA für Redakteure und Admins,
- Step-up nur für besonders kritische administrative Aktionen,
- Aufgabenteilung zwischen Fachservices und RLS,
- Audit- und Concurrency-Anforderungen.

Die konkrete SQL-/RLS-Policy-Implementierung erfolgt in U1. Betriebsparameter wie Sitzungsdauer, Token-/MFA-Lebensdauer und konkrete Recovery-/Notfallverfahren gehören zu G7.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | MFA für Redakteure/Admins verpflichtend festgelegt; kein Step-up bei normalen Veröffentlichungen, Step-up für kritische Adminaktionen; RLS-/Fachservice-Aufgabenteilung konsolidiert; G6-Grundsatzfragen abgeschlossen. |
| 0.1 | 06.10.2026 | G6 gestartet; Rollen-/Aktionsmatrix, Fachfunktionsrechte, Bestätigungslogik, Adminvorbehalte, AI-Task-Grenzen und MFA-Entscheidungspunkt konsolidiert. |
