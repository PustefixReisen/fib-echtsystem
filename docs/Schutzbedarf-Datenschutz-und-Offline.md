# Schutzbedarf, Datenschutz und Offline – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.3 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Integrationsquelle für **G4 – Schutzbedarf / Datenschutz / Offline** des FIB-Echtsystems.

Es legt fest:

- Schutzklassen für FIB-Daten,
- Anforderungen an personenbezogene und vertrauliche Daten,
- Regeln für KI-Übermittlung,
- Offline-/PWA-Grundsätze,
- Anforderungen an Bilder, Dateien, Push und Logs,
- Übergaben an G5–G7.

Detailquelle für personenbezogene Verarbeitungen und Löschlogik:

- `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md`

Konkrete technische Umsetzung von Verschlüsselung, RLS, Authentifizierung, Storage, Log-Rotation oder Löschjobs folgt erst in G5–G7.

## 2. Rechts- und Schutzrahmen

G4 orientiert sich insbesondere an:

- DSGVO Art. 5: Rechtmäßigkeit, Transparenz, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung sowie Integrität und Vertraulichkeit,
- DSGVO Art. 6: Rechtsgrundlage je personenbezogener Verarbeitung,
- DSGVO Art. 9: besonderer Schutz u. a. politischer Meinungen,
- DSGVO Art. 13/14: Informationspflichten,
- DSGVO Art. 16/17: Berichtigung und Löschung,
- TDDDG § 25: Speicherung bzw. Zugriff auf Informationen im Endgerät grundsätzlich nur mit Einwilligung, soweit keine gesetzliche Ausnahme – insbesondere technische Erforderlichkeit für einen ausdrücklich gewünschten Dienst – greift.

Diese Einordnung ersetzt keine abschließende rechtliche Prüfung des Produktivbetriebs.

## 3. Grundprinzipien

### 3.1 Schutzbedarf hängt vom Inhalt ab

> **Schutzbedarf wird anhand des konkreten Dateninhalts und seiner vorgesehenen Nutzung bestimmt, nicht allein anhand des Fachobjekttyps.**

Dasselbe Objekt kann unterschiedliche Schutzstände besitzen: veröffentlichte Meldung K0, Entwurf K1; öffentlich freigegebenes Bild K0, ungeklärtes Personenbild K2.

### 3.2 Datenminimierung

FIB speichert und übermittelt nur Daten, die für die jeweilige Funktion erforderlich sind.

Insbesondere:

- keine personenbezogene Vorratsspeicherung,
- keine Besucherprofile,
- KI erhält nur benötigten Kontext,
- Telemetrie/Logs enthalten keine unnötigen Inhaltskopien,
- technischer Datenzugriff allein rechtfertigt keine KI-Übermittlung.

### 3.3 Öffentliche Quelle ≠ freie Weiterverarbeitung

Öffentliche Auffindbarkeit bedeutet nicht automatisch freie Speicherung, Vervielfältigung, Veröffentlichung oder KI-Übermittlung. Datenschutz, Urheberrecht, Persönlichkeits- und Nutzungsrechte bleiben getrennt zu prüfen.

### 3.4 Integrität ist besonders wichtig

Neben Vertraulichkeit ist für FIB die Integrität zentral:

- veröffentlichte Inhalte dürfen nicht unbemerkt verändert werden,
- bestätigte Fakten/Bewertungen bleiben nachvollziehbar,
- Rollen/Freigaben/Audit dürfen nicht umgangen werden,
- KI-Ergebnisse werden nicht automatisch fachlich wirksam.

## 4. Schutzklassen

### K0 – öffentlich

Bestimmungsgemäß öffentlich bereitgestellte Daten, z. B. veröffentlichte Meldungen, öffentliche Vorgangs-/Themenstände, Sitzungsdaten, freigegebene Vertiefungen, Bilder und Dateien.

- öffentlich lesbar,
- öffentlicher Offline-Cache grundsätzlich möglich,
- an freigegebene KI-Provider übermittelbar, soweit für die Aufgabe erforderlich,
- Integritäts-/Aktualitätsschutz bleibt nötig.

### K1 – intern

Nicht öffentliche Redaktions-/Betriebsdaten ohne besonderen Vertraulichkeitsbedarf, z. B. Entwürfe, KI-Vorschläge, Beobachtungsaufträge, interne Bearbeitungsstände.

- nur berechtigte Redaktion/Admin bzw. zulässige AI Tasks,
- kein öffentlicher Cache,
- KI-Übermittlung nur über vorgesehene FIB-Funktion,
- kein dauerhafter Redaktions-Offlinebestand im MVP.

### K2 – vertraulich / personenbezogen

Nicht öffentliche personenbezogene oder anderweitig vertrauliche Daten, z. B. Benutzerkonten, interne GRÜNEN-Unterlagen, Zugangsbeschränkte Quellen, ungeklärte Personenbilder oder sensible Recherchekontexte.

- Zugriff nur bei fachlicher Erforderlichkeit,
- keine öffentliche Bereitstellung,
- KI-Übermittlung nur über ausdrücklich für K2 freigegebenen Betriebsweg,
- Datenminimierung/Pseudonymisierung vor Übermittlung,
- keine ungeschützte Offline-Speicherung.

### K3 – sicherheitskritisch

Secrets, Passwörter, API-Schlüssel, private Schlüssel, Session-/Recovery-Geheimnisse und vergleichbare Sicherheitsdaten.

- außerhalb normaler FIB-Fachdatenhaltung,
- niemals an Sprachmodelle übermitteln,
- nicht in Logs/Prompts/Audittexte kopieren,
- nur geeignete Secret-/Credential-Infrastruktur.

## 5. Typischer Schutzbedarf

| Datenbereich | typischer Schutzbedarf |
|---|---:|
| veröffentlichte Meldung | K0 |
| Meldungsentwurf | K1 |
| Ereignis / Sachinformation | K0/K1 |
| Vorgang / Thema | K0/K1 |
| strukturierte Einordnung | K0/K1, ggf. K2 |
| Quelle / Fundstelle / Datei | K0–K2 |
| Bild | K0–K2 |
| offene Frage / Wissenslücke | K0–K2 |
| Beobachtungsauftrag / Recherchelauf | K1, ggf. K2 |
| Referenzwissen / Referenzmaßstab | K0/K1 |
| Vertiefungsinhalte | K0/K1 |
| AI Task / Run | K1, ggf. K2 |
| Benutzerkonto / Rolle | K2 |
| Push-Subscription | K2 |
| technische Logs | K1/K2 |
| Secrets | K3 |

Die Klassifikation erfolgt im Einzelfall nach Inhalt und Nutzung.

## 6. K2-Minimierung im MVP

FIB ist kein CRM, Bürgerregister, Mitgliederverwaltungssystem oder allgemeines Archiv interner Parteidokumente.

Im MVP voraussichtlich erforderliche K2-Daten:

- Redakteur-/Admin-Konten,
- einzelne konkret benötigte interne GRÜNEN-Fundstellen,
- Rechte-/Nachweisdaten zu Bildern/Dateien,
- noch ungeklärte Personenbilder,
- technische Push-Subscriptions, falls Push aktiviert wird,
- einzelne erforderliche Recherche-/Chatkontexte.

Bewusst nicht vorgesehen:

- Besucher-Benutzerkonten,
- personenbezogene Besuchs-/Interessenprofile,
- zentrale Lesehistorien,
- Mitglieder-/Bürgerdatenbanken,
- Bürgerdossiers,
- öffentliche Kommentarprofile,
- private Adresssammlungen,
- allgemeine E-Mail-/Nachrichtenarchive,
- personenbezogene Vorratsspeicherung.

Interne GRÜNEN-Unterlagen dürfen nur bei konkretem FIB-Recherchezweck aufgenommen werden. Sie bleiben intern und werden nicht durch Aufnahme in FIB öffentlich.

## 7. Schutzklassen-Metadaten und Vererbung

Für Datenbereiche mit variablem Schutzbedarf muss die Schutzklasse technisch eindeutig bestimmbar sein.

Mindestens betroffen:

- Fundstelle/gespeicherte Datei,
- Bild,
- importierte Dokumentinhalte,
- AI-Task-/Recherche-Kontext,
- Chat-/KI-Aufruf.

> **Ein abgeleiteter interner Arbeitsinhalt übernimmt mindestens den höchsten Schutzbedarf seiner Eingabedaten, solange nicht durch bewusste Redaktion/Redaktionierung ein eigenständiger geringer geschützter Inhalt entstanden und freigegeben ist.**

K0 entsteht nicht automatisch, sondern durch den vorgesehenen Freigabe-/Veröffentlichungsprozess.

## 8. Personenbezogene Daten und Löschlogik

Detailquelle: `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md`.

Verbindliche Kernaussagen:

- Rechtsgrundlage wird je konkreter Verarbeitung festgelegt, nicht pauschal für FIB.
- Politische Meinungen und andere Art.-9-Daten benötigen besondere Prüfung.
- Fachhistorie rechtfertigt nicht automatisch unbegrenzte personenbezogene Speicherung.
- Historischer Sachverhalt und identifizierende Zusatzinformation werden soweit möglich entkoppelt.
- Konten werden bei Rollenverlust deaktiviert; Audit-Historie darf davon getrennt erhalten bleiben.
- technische Logs werden kurz und zweckgebunden gehalten,
- Push-Subscriptions werden bei Abmeldung/Ungültigkeit gelöscht,
- interne K2-Dateien werden nach Wegfall ihres konkreten Zwecks auf Löschung/Redaktion/Metadatenreduktion geprüft,
- FIB archiviert nicht standardmäßig vollständige KI-Dialoge oder Rohkontexte.

Konkrete technische Retentionwerte in Tagen/Monaten werden erst in G7 anhand Architektur und Risiko parametrisiert.

## 9. KI-Übermittlung

> **An einen KI-Provider wird nur der für die konkrete Aufgabe erforderliche Kontext übermittelt.**

- K0: grundsätzlich zulässig bei freigegebenem Provider und Erforderlichkeit.
- K1: nur im vorgesehenen FIB-KI-Workflow mit produktiv freigegebenem Provider.
- K2: nur bei ausdrücklicher Freigabe des konkreten Providers/Betriebswegs für K2 und fachlicher Erforderlichkeit.
- K3: niemals.

Für K1/K2 sind vor Freigabe mindestens zu prüfen:

- vertragliche Rolle/Auftragsverarbeitung,
- Datenstandort/Drittlandübermittlung,
- Training/sonstige Eigennutzung,
- Provider-Retention/Logging,
- Löschmöglichkeiten,
- Unterauftragnehmer/Empfänger,
- technische Zugriffssicherheit,
- zulässige Schutzklasse.

Der FIB-Chat/AI Task erhält niemals pauschal den vollständigen Datenbestand. Die Fachfunktionsschicht bleibt Datenschutz- und Sicherheitsgrenze.

## 10. Offline / lokale Speicherung

### 10.1 Besucher-PWA

K0-Inhalte dürfen technisch gecacht werden, soweit Aktualität, Invalidierung und Endgerätespeicherung rechtlich sauber gelöst sind. Dazu können App-Shell, öffentliche Inhalte/Bilder und lokaler Stand „neu seit letztem Besuch“ gehören.

Der Neuigkeitsstatus bleibt gerätebezogen und erzeugt kein zentrales Besucherprofil.

TDDDG § 25 ist in G5 für jede lokale Speicherfunktion zu prüfen.

### 10.2 Redaktion

> **Im MVP keine eigenständige Offline-Redaktionsdatenbank und keine dauerhafte lokale Spiegelung von K1/K2.**

Die Redaktions-Web-App ist online orientiert. Ein echter späterer Offline-Redaktionsmodus wäre eine eigene Sicherheits-/Synchronisationsfunktion.

## 11. Push und Newsletter

### Push

Wenn Push umgesetzt wird:

- pseudonyme technische Subscription,
- keine Verknüpfung mit Name/E-Mail,
- keine Lese-/Interessenakte,
- nur notwendige Zustelldaten,
- einfache Abmeldung/Löschung.

### Newsletter

Newsletter-Daten sollen vorzugsweise in einem spezialisierten Dienst verarbeitet werden; FIB baut keine zweite Mailinglistenverwaltung auf.

## 12. Bilder und Dateien

- Speicherung und öffentliche Bereitstellung sind getrennt.
- Öffentliche Bereitstellung setzt positiv geklärte Rechte voraus.
- identifizierbare Personen können K2 erzeugen.
- Originaldatei kann stärker geschützt sein als öffentliche Ableitung.
- Metadaten werden vor Veröffentlichung minimiert.

Ein Bild kann intern K2 und nach geklärter/rechtskonformer Freigabe in seiner öffentlichen Verwendung K0 sein.

## 13. Audit und Datenschutz-Adminworkflow

Audit protokolliert Akteur, Aktion/Fachfunktion, Objekt, Zeitpunkt, Ergebnis/Bestätigung, soweit erforderlich Vorher/Nachher – aber keine Secrets und keine unnötigen Inhaltskopien.

Betroffenenanfragen werden über einen kontrollierten Adminworkflow bearbeitet, nicht über freies SQL. Der Workflow muss Auffinden, Berichtigung, Löschprüfung, ggf. Einschränkung/Sperrung sowie getrennte Behandlung öffentlicher Veröffentlichung und interner Persistenz ermöglichen.

## 14. Anforderungen an G5–G7

### G5

- öffentliche/interne Zugriffswege trennen,
- Storage-/Zugriffsstrategie für K0–K2,
- Secret-Infrastruktur für K3,
- schutzklassenbewusster KI-Router,
- keine Datenbank-Dumps an KI,
- Schutzklasse bei variablen Daten technisch bestimmbar,
- PWA-Cache nur für K0,
- sichere Session-/Tokenhaltung,
- technisch mögliche Löschung/Anonymisierung der dafür vorgesehenen Daten.

### G6

- Besucher nur K0,
- Redakteur K0/K1 und erforderliche K2-Daten,
- Admin zusätzliche administrative Funktionen,
- AI Tasks nur explizit freigegebene Daten/Funktionen,
- S3-Freigabe weiter serverseitig erzwingen,
- Datenschutz-Adminworkflow.

### G7 / Go-live

- konkrete Log-/Audit-/Backup-Retention parametrisieren,
- Datenschutzerklärung anhand tatsächlicher Dienste,
- Rechtsgrundlagen/Informationspflichten je Verarbeitung dokumentieren,
- Verarbeitungsinventar/ggf. Verzeichnis von Verarbeitungstätigkeiten,
- tatsächliche Provider/Empfänger dokumentieren.

## 15. Noch offene G4-Punkte

Vor Abschluss von G4 sind noch zu klären:

1. Providerfreigabekriterien und zulässige Betriebswege für K1/K2,
2. ob für konkrete Verarbeitungen eine Datenschutz-Folgenabschätzung erforderlich ist,
3. ob Push im MVP tatsächlich aktiviert wird und welcher Dienst verwendet wird,
4. Datenschutz-/Auftragsverarbeitungsmodell des geplanten externen Datei-/Bildspeichers,
5. ob weitere Fachobjekte außer Datei/Fundstelle/Bild eine explizite Schutzklassenkennzeichnung benötigen oder Ableitung genügt.

Nicht mehr als offene G4-Grundsatzfrage gilt die Löschlogik; offen sind nur technische Retentionparameter in späteren Phasen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.3 | 06.10.2026 | Hauptquelle konsolidiert; Detailquelle für personenbezogene Verarbeitungen/Löschlogik eingebunden; Fachhistorie und personenbezogene Aufbewahrung getrennt; Löschlogik als G4-Grundsatz geklärt, konkrete technische Retentionwerte nach G7 verschoben. |
| 0.2 | 06.10.2026 | K2-Minimierung, Schutzklassenvererbung, Push/Newsletter-Abgrenzung, Rechtsanker und Provider-Mindestprüfung ergänzt. |
| 0.1 | 06.10.2026 | G4 gestartet; Schutzklassen und erste Matrix festgelegt. |
