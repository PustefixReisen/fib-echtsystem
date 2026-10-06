# Datenschutz-Verarbeitungen und Löschlogik – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die spezialisierte G4-Primärquelle für die **personenbezogenen Verarbeitungen sowie Aufbewahrungs-, Lösch- und Anonymisierungslogik** des FIB-Echtsystems. Es konkretisiert `docs/Schutzbedarf-Datenschutz-und-Offline.md`, ohne dessen Schutzklassen zu duplizieren.

> **Fachliche Historisierung rechtfertigt nicht automatisch die dauerhafte Speicherung personenbezogener Zusatzdaten. Personenbezogene Daten werden nur so lange identifizierbar gespeichert, wie dies für den jeweiligen Zweck erforderlich ist.**

Die konkrete technische Umsetzung von Löschjobs, Log-Rotation, Backup-Retention und Datenschutz-Workflows wird in G5–G7 festgelegt.

## 2. Rechtsrahmen

Maßgeblich sind insbesondere DSGVO Art. 5 (Datenminimierung und Speicherbegrenzung), Art. 6 (Rechtsgrundlagen), Art. 9 (besondere Kategorien, darunter politische Meinungen), Art. 13/14 (Informationspflichten einschließlich Speicherdauer bzw. Kriterien) sowie Art. 16/17 (Berichtigung/Löschung).

Für FIB werden deshalb keine pauschalen unbegrenzten personenbezogenen Aufbewahrungsfristen festgelegt. Jeder Verarbeitungstyp erhält einen Zweck und ein Lösch-/Prüfkriterium.

## 3. MVP-Verarbeitungsinventar

| Verarbeitung | Zweck | typischer Schutz | Speichergrundsatz |
|---|---|---:|---|
| Redakteur-/Admin-Konto | Authentifizierung, Berechtigung, Verantwortlichkeit | K2 | nur solange Konto/Rolle benötigt wird; danach deaktivieren und personenbezogene Kontodaten minimieren/löschen |
| Audit-Zuordnung | Nachvollziehbarkeit fachlich wirksamer und sicherheitsrelevanter Aktionen | K1/K2 | Handlung nachvollziehbar halten; Personenidentität nur soweit erforderlich |
| Push-Subscription | Zustellung abonnierter Benachrichtigungen | K2 | nur aktive Subscription; bei Abmeldung/technischer Ungültigkeit löschen |
| Bild-/Dateirechte-Nachweis | Nachweis von Nutzungs-/Veröffentlichungsrechten | K1/K2 | solange Asset genutzt wird bzw. Nachweis erforderlich ist |
| interne K2-Fundstelle | konkrete Recherche-/Belegfunktion | K2 | nur solange konkreter Recherchezweck besteht; anlassbezogen prüfen |
| personenbezogener Recherche-/Chatkontext | Bearbeitung eines konkreten Auftrags | K2 | nicht als separates Langzeitarchiv; nur fachlich notwendige Ergebnisse persistent übernehmen |
| öffentliche Personenangabe | Information über kommunalpolitischen/öffentlichen Vorgang | K0 trotz Personenbezug | solange für aktuellen oder historisch nachvollziehbaren Sachverhalt erforderlich; Richtigkeit/Aktualität beachten |
| technische Sicherheits-/Fehlerlogs | Betrieb, Missbrauchs-/Fehlererkennung | K1/K2 | kurz und zweckgebunden; keine Inhaltskopien auf Vorrat |

Nicht vorgesehen sind Besucherprofile, zentrale Lesehistorien, Mitglieder-/Bürgerdatenbanken, öffentliche Benutzerkonten oder allgemeine Kommunikationsarchive.

## 4. Rechtsgrundlagen pro Verarbeitung

FIB verwendet **keine pauschale Rechtsgrundlage für alle personenbezogenen Daten**.

Vor Produktivbetrieb wird je Verarbeitung dokumentiert:

- Verantwortlicher und Zweck,
- Datenkategorien/Personengruppen,
- Rechtsgrundlage nach Art. 6,
- bei Art.-9-Daten zusätzlich einschlägige Ausnahme nach Art. 9 Abs. 2,
- Empfänger/Auftragsverarbeiter und ggf. Drittlandübermittlung,
- Aufbewahrungs-/Löschkriterium,
- Informationspflicht bzw. einschlägige Ausnahme,
- technische/organisatorische Schutzmaßnahmen.

Diese Zuordnung wird vor Go-live Bestandteil des Datenschutz-/Verarbeitungsinventars.

## 5. Lösch- und Minimierungslogik

### 5.1 Konten

- Bei Ausscheiden/Rollenverlust produktiven Zugriff unverzüglich entziehen.
- Konto nicht allein zur Auditierbarkeit unbegrenzt aktiv halten.
- Historische Aktionen dürfen über stabile interne Akteursreferenz nachvollziehbar bleiben, ohne alle Kontodaten dauerhaft weiterzuführen.

### 5.2 Auditdaten

- keine Secrets,
- keine unnötigen vollständigen Prompt-/Dokumentkopien,
- Objekt-/Aktionsreferenzen statt redundanter Inhalte, soweit ausreichend,
- personenbezogene Akteursdaten soweit möglich von Fachhistorie trennen,
- konkrete Retention risikobasiert in G7 festlegen.

### 5.3 Technische Logs

- standardmäßig kurze Aufbewahrung,
- längere Aufbewahrung nur für konkreten Sicherheits-/Störungsfall oder zwingenden Betriebszweck,
- IP-Adressen, Request-Inhalte und personenbezogene Parameter nur soweit erforderlich,
- frühestmögliche Aggregation/Anonymisierung,
- automatische Rotation/Löschung technisch vorsehen.

### 5.4 Push

Bei Abmeldung Subscription löschen/deaktivieren; dauerhaft ungültige Endpunkte bereinigen; keine Aufbewahrung zur Besucherprofilbildung.

### 5.5 Interne K2-Fundstellen/Dateien

Bei Wegfall des Recherchezwecks prüfen, ob weiterhin der interne Beleg erforderlich ist, eine minimierte Metadaten-/Belegreferenz oder redigierte Fassung genügt oder die Originaldatei gelöscht werden kann.

Eine öffentliche Sachinformation kann im Wissenskern fortbestehen, auch wenn eine zusätzlich intern gespeicherte personenbezogene Originaldatei später gelöscht wird.

### 5.6 Bilder

Asset, Rechte-Nachweis und Bildverwendung werden getrennt betrachtet. Entfällt eine Verwendung, muss das Asset nicht automatisch gelöscht werden, solange eine andere zulässige Verwendung oder ein erforderlicher Nachweis fortbesteht. Entfallen alle Zwecke, ist das Asset zu löschen. Personenbezogene Bildmetadaten werden minimiert.

### 5.7 Recherche-/Chatdaten

FIB archiviert nicht standardmäßig jeden vollständigen Dialog oder KI-Kontext. Persistiert werden vorzugsweise fachlich relevantes Ergebnis, Quellen-/Fundstellenreferenzen, erforderliche Provenienz, notwendiger Auditnachweis und ggf. KI-Metadaten. Rohprompts, vollständige Zwischenkontexte und personenbezogene Dialoginhalte werden nicht auf Vorrat gespeichert.

## 6. Fachhistorie und Datenschutz

Das G3-Persistenzprinzip bleibt bestehen. Ergänzend gilt:

> **Historischer Sachverhalt und identifizierende Zusatzinformation werden soweit möglich entkoppelt.**

Beispiele: Ein Beschluss bleibt historisch erhalten, unnötige private Kontaktdaten nicht. Eine frühere Freigabe bleibt auditierbar, ohne ein altes Benutzerkonto aktiv zu halten. Eine öffentliche Meldung kann erhalten bleiben, während eine interne Originaldatei nach Zweckfortfall gelöscht oder redigiert wird.

## 7. Datenschutz-Workflow

Betroffenenanfragen werden nicht durch freie Tabellenmanipulation erledigt. G5/G6 müssen einen kontrollierten Adminworkflow ermöglichen für:

- Auffinden relevanter personenbezogener Daten,
- Berichtigung,
- Prüfung der Löschbarkeit je Datenbestand,
- Einschränkung/Sperrung bei fortbestehender notwendiger Aufbewahrung,
- getrennte Behandlung öffentlicher Veröffentlichung und interner Persistenz,
- Protokollierung der Maßnahme ohne erneutes Kopieren gelöschter Inhalte.

## 8. Informationspflichten

Die Datenschutzerklärung vor Go-live bildet nur tatsächlich realisierte Verarbeitungen ab. Transparent zu beschreiben sind – soweit vorhanden – insbesondere Hosting/Logs, Website/PWA-Endgerätespeicherung, Redaktionskonten, Push, Newsletter-Dienst, KI-Provider, externe Datei-/Speicherdienste, Kontaktweg für Datenschutzanfragen sowie Speicherdauer oder Kriterien dafür.

Bei nicht direkt erhobenen personenbezogenen Daten ist Art. 14 einschließlich möglicher Ausnahmen gesondert zu prüfen.

## 9. Verarbeitungsverzeichnis

Spätestens vor Produktivbetrieb wird aus diesem Inventar ein tatsächliches Verzeichnis der Verarbeitungstätigkeiten abgeleitet, soweit rechtlich erforderlich bzw. als Governance-Instrument sinnvoll.

Neue personenbezogene Verarbeitung benötigt vor Aktivierung mindestens: Zweck, Datenkategorien, Schutzklasse, Rechtsgrundlage, Empfänger/Provider, Löschkriterium, Informations-/Einwilligungsbewertung und Schutzmaßnahmen.

## 10. Übergabe an G5–G7

- Fachhistorie technisch von löschbaren personenbezogenen Zusatzdaten trennen,
- Account-Deaktivierung unabhängig von Audit-Historie,
- Lösch-/Anonymisierungsfähigkeit für Push, Logs und K2-Dateien,
- Log-Rotation und Datenminimierung,
- kein Vollarchiv von KI-Dialogen als Default,
- Datenschutz-Adminworkflow statt Direkt-SQL,
- tatsächliche Datenempfänger/Provider nachweisbar halten,
- vor Go-live Rechtsgrundlagen, Datenschutzerklärung und Verarbeitungsinventar finalisieren.

## 11. Noch offene G4-Punkte

1. Providerfreigabekriterien und konkrete zulässige Betriebswege für K1/K2,
2. Prüfung, ob für konkrete Verarbeitungen eine Datenschutz-Folgenabschätzung erforderlich ist,
3. Entscheidung, ob Push im MVP tatsächlich aktiviert wird und welcher Dienst verwendet wird,
4. Abgleich mit externem Datei-/Bildspeicher und dessen Datenschutz-/Auftragsverarbeitungsmodell,
5. konkrete Retentionwerte in Tagen/Monaten erst nach Architektur/Risikobewertung in G7 parametrisieren.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G4-Verarbeitungsinventar sowie zweckbezogene Aufbewahrungs-, Lösch-, Minimierungs- und Datenschutzworkflow-Regeln festgelegt; Fachhistorie von personenbezogener Zusatzaufbewahrung getrennt. |
