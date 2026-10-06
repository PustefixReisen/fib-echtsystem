# Schutzbedarf, Datenschutz und Offline – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Integrationsquelle für **G4 – Schutzbedarf / Datenschutz / Offline** des FIB-Echtsystems.

Es legt fest:

- Schutzklassen und Schutzbedarfsprinzipien,
- Anforderungen an personenbezogene und vertrauliche Daten,
- Regeln für KI-/Cloud-Übermittlung,
- Offline-/PWA-Grundsätze,
- Anforderungen an Bilder, Dateien, Push und Logs,
- Übergaben an G5–G7.

Detailquellen:

- personenbezogene Verarbeitungen und Löschlogik: `docs/Datenschutz-Verarbeitungen-und-Loeschlogik.md`
- Providerfreigabe und DSFA-Prüfrahmen: `docs/KI-Provider-und-DSFA-Pruefrahmen.md`

Konkrete technische Umsetzung von Verschlüsselung, RLS, Authentifizierung, Storage, Providerwahl, Log-Rotation oder Löschjobs folgt erst in G5–G7.

## 2. Rechts- und Schutzrahmen

G4 orientiert sich insbesondere an:

- DSGVO Art. 5: Rechtmäßigkeit, Transparenz, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung sowie Integrität und Vertraulichkeit,
- DSGVO Art. 6: Rechtsgrundlage je personenbezogener Verarbeitung,
- DSGVO Art. 9: besonderer Schutz u. a. politischer Meinungen,
- DSGVO Art. 13/14: Informationspflichten,
- DSGVO Art. 16/17: Berichtigung und Löschung,
- DSGVO Art. 28: Anforderungen an Auftragsverarbeiter,
- DSGVO Art. 35: Datenschutz-Folgenabschätzung bei voraussichtlich hohem Risiko,
- DSGVO Art. 44 ff.: Drittlandübermittlungen,
- TDDDG § 25: Speicherung bzw. Zugriff auf Informationen im Endgerät.

Diese Einordnung ersetzt keine abschließende rechtliche Prüfung des Produktivbetriebs.

## 3. Grundprinzipien

### 3.1 Schutzbedarf hängt vom konkreten Inhalt ab

> **Schutzbedarf wird anhand des konkreten Dateninhalts und seiner vorgesehenen Nutzung bestimmt, nicht allein anhand des Fachobjekttyps.**

Dasselbe Objekt kann unterschiedliche Schutzstände besitzen: veröffentlichte Meldung K0, Entwurf K1; öffentlich freigegebenes Bild K0, ungeklärtes Personenbild K2.

### 3.2 Schutzklasse und Personenbezug sind getrennt

> **K0 bedeutet öffentlich, nicht personenbezogen-frei.**

Auch öffentliche Inhalte können personenbezogene Daten enthalten. Für Datenschutz- und Providerprüfung sind daher Schutzklasse und Personenbezug bzw. Art.-9-Relevanz getrennt zu bewerten.

### 3.3 Datenminimierung

FIB speichert und übermittelt nur Daten, die für die jeweilige Funktion erforderlich sind.

Insbesondere:

- keine personenbezogene Vorratsspeicherung,
- keine Besucherprofile,
- keine zentrale Lese-/Interessenhistorie,
- KI erhält nur den für die konkrete Aufgabe benötigten Kontext,
- Telemetrie/Logs enthalten keine unnötigen Inhaltskopien,
- technischer Datenzugriff allein rechtfertigt keine KI-Übermittlung.

### 3.4 Öffentliche Quelle ist nicht freie Weiterverarbeitung

Öffentliche Auffindbarkeit bedeutet nicht automatisch freie Speicherung, Vervielfältigung, Veröffentlichung oder KI-Übermittlung. Datenschutz, Urheberrecht, Persönlichkeits- und Nutzungsrechte bleiben getrennt zu prüfen.

### 3.5 Integrität ist besonders wichtig

Neben Vertraulichkeit ist für FIB die Integrität zentral:

- veröffentlichte Inhalte dürfen nicht unbemerkt verändert werden,
- bestätigte Fakten und Bewertungen bleiben nachvollziehbar,
- Rollen, Freigaben und Audit dürfen nicht umgangen werden,
- KI-Ergebnisse werden nicht automatisch fachlich wirksam.

## 4. Schutzklassen

### K0 – öffentlich

Bestimmungsgemäß öffentlich bereitgestellte Daten.

Beispiele: veröffentlichte Meldungen, öffentliche Vorgangs-/Themenstände, Sitzungsdaten, freigegebene Vertiefungen, Bilder und Dateien.

- öffentlich lesbar,
- öffentlicher Offline-Cache grundsätzlich möglich,
- an freigegebene KI-Provider übermittelbar, soweit für die Aufgabe erforderlich,
- Datenschutzpflichten bleiben bei personenbezogenen K0-Inhalten bestehen.

### K1 – intern

Nicht öffentliche Redaktions-/Betriebsdaten ohne besonderen Vertraulichkeitsbedarf.

Beispiele: Entwürfe, KI-Vorschläge, Beobachtungsaufträge, interne Bearbeitungsstände.

- nur berechtigte Redaktion/Admin bzw. zulässige AI Tasks,
- kein öffentlicher Cache,
- KI-Übermittlung nur über vorgesehene FIB-Funktion und freigegebenen Betriebsweg,
- kein dauerhafter Redaktions-Offlinebestand im MVP.

### K2 – vertraulich / personenbezogen

Nicht öffentliche personenbezogene oder anderweitig vertrauliche Daten.

Beispiele: Benutzerkonten, einzelne interne GRÜNEN-Unterlagen, zugangsbeschränkte Quellen, ungeklärte Personenbilder, sensible Recherchekontexte.

- Zugriff nur bei fachlicher Erforderlichkeit,
- keine öffentliche Bereitstellung,
- externe Verarbeitung nur über ausdrücklich für K2 freigegebenen Betriebsweg,
- Datenminimierung, Redaktion oder Pseudonymisierung vor Übermittlung,
- keine ungeschützte Offline-Speicherung.

### K3 – sicherheitskritisch

Secrets, Passwörter, API-Schlüssel, private Schlüssel, Session-/Recovery-Geheimnisse und vergleichbare Sicherheitsdaten.

- außerhalb normaler FIB-Fachdatenhaltung,
- niemals an Sprachmodelle übermitteln,
- nicht in Logs, Prompts oder fachliche Audittexte kopieren,
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

Verbindlich gilt:

- Rechtsgrundlage wird je konkreter Verarbeitung festgelegt, nicht pauschal für FIB,
- Art.-9-Daten benötigen besondere Prüfung,
- Fachhistorie rechtfertigt nicht automatisch unbegrenzte personenbezogene Speicherung,
- historischer Sachverhalt und identifizierende Zusatzinformation werden soweit möglich entkoppelt,
- Konten werden bei Rollenverlust deaktiviert; Audit-Historie darf davon getrennt erhalten bleiben,
- technische Logs werden kurz und zweckgebunden gehalten,
- Push-Subscriptions werden bei Abmeldung/Ungültigkeit gelöscht,
- interne K2-Dateien werden nach Wegfall ihres Zwecks auf Löschung/Redaktion/Metadatenreduktion geprüft,
- FIB archiviert nicht standardmäßig vollständige KI-Dialoge oder Rohkontexte.

Konkrete technische Retentionwerte in Tagen/Monaten werden erst in G7 anhand Architektur und Risiko parametrisiert.

## 9. KI-/Cloud-Provider und DSFA

Detailquelle: `docs/KI-Provider-und-DSFA-Pruefrahmen.md`.

### 9.1 Providerfreigabe

- K0: grundsätzlich zulässig bei freigegebenem Provider und Erforderlichkeit; Personenbezug bleibt gesondert zu prüfen.
- K1: nur über ausdrücklich für interne FIB-Daten freigegebenen Betriebsweg.
- K2: eigenständige strengere Freigabe; K1-Freigabe reicht nicht aus.
- K3: niemals an KI-Provider.

Vor Freigabe eines Betriebswegs sind insbesondere zu prüfen:

- datenschutzrechtliche Rolle und ggf. Auftragsverarbeitung,
- technische/organisatorische Garantien,
- Datenstandort und Drittlandbezug,
- Unterauftragnehmer,
- Training/Eigennutzung,
- Retention/Logging und Löschmöglichkeiten,
- Zugriffsschutz,
- zulässige Schutzklasse und zulässige FIB-Aufgaben.

Der KI-Router darf später nur ausdrücklich freigegebene Kombinationen aus Aufgabe, Schutzklasse und Provider auswählen.

### 9.2 DSFA

Für FIB als MVP ist derzeit keine generelle DSFA-Pflicht für das Gesamtsystem festgestellt.

Diese Bewertung beruht insbesondere darauf, dass FIB bewusst vermeidet:

- Besucherprofile,
- Personen-Scoring,
- automatisierte Entscheidungen mit erheblicher Wirkung für Personen,
- systematische großflächige Personenüberwachung,
- große zentrale Bestände sensibler Personendaten.

Vor Go-live wird für die tatsächlich umgesetzten personenbezogenen Verarbeitungsvorgänge eine dokumentierte DSFA-Vorprüfung durchgeführt.

Eine erneute Prüfung ist insbesondere bei späterer Einführung von Profiling, umfangreicher Art.-9-Verarbeitung, systematischer Datensatzverknüpfung, Personen-Scoring oder deutlich erweiterter externer K2-KI-Verarbeitung erforderlich.

## 10. Offline / lokale Speicherung

### 10.1 Besucher-PWA

K0-Inhalte dürfen technisch gecacht werden, soweit Aktualität, Invalidierung und Endgerätespeicherung rechtlich sauber gelöst sind.

Dazu können gehören:

- App-Shell und statische Assets,
- öffentliche Inhalte und Bilder,
- lokaler Gerätestand für „neu seit letztem Besuch“.

Der Neuigkeitsstatus bleibt gerätebezogen und erzeugt kein zentrales Besucherprofil.

TDDDG § 25 ist in G5 für jede lokale Speicherfunktion zu prüfen.

### 10.2 Redaktion

> **Im MVP keine eigenständige Offline-Redaktionsdatenbank und keine dauerhafte lokale Spiegelung von K1/K2.**

Die Redaktions-Web-App ist online orientiert. Ein echter späterer Offline-Redaktionsmodus wäre eine eigene Sicherheits-/Synchronisationsfunktion.

## 11. Push und Newsletter

### Push

Falls Push im MVP technisch aktiviert wird, gelten:

- pseudonyme technische Subscription,
- keine Verknüpfung mit Name/E-Mail,
- keine Lese-/Interessenakte,
- nur notwendige Zustelldaten,
- einfache Abmeldung/Löschung.

Die konkrete Push-Technik und der Dienst werden erst in G5 ausgewählt.

### Newsletter

Newsletter-Daten sollen vorzugsweise in einem spezialisierten Dienst verarbeitet werden; FIB baut keine zweite Mailinglistenverwaltung auf.

## 12. Bilder, Dateien und externer Storage

- Speicherung und öffentliche Bereitstellung sind getrennt.
- Öffentliche Bereitstellung setzt positiv geklärte Rechte voraus.
- identifizierbare Personen können K2 erzeugen.
- Originaldatei kann stärker geschützt sein als öffentliche Ableitung.
- Metadaten werden vor Veröffentlichung minimiert.

Ein externer Datei-/Bildspeicher muss für die dort gespeicherten Schutzklassen freigegeben sein. Bei K2 sind insbesondere Auftragsverarbeitung, Datenstandort, Zugriffsschutz und private Bereitstellung zu prüfen.

Die konkrete Wahl zwischen Nextcloud, Supabase Storage oder einem anderen geeigneten Speicher ist eine G5-Architekturentscheidung.

## 13. Audit und Datenschutz-Adminworkflow

Audit protokolliert Akteur, Aktion/Fachfunktion, Objekt, Zeitpunkt, Ergebnis/Bestätigung, soweit erforderlich Vorher/Nachher – aber keine Secrets und keine unnötigen Inhaltskopien.

Betroffenenanfragen werden über einen kontrollierten Adminworkflow bearbeitet, nicht über freies SQL. Der Workflow muss Auffinden, Berichtigung, Löschprüfung, ggf. Einschränkung/Sperrung sowie getrennte Behandlung öffentlicher Veröffentlichung und interner Persistenz ermöglichen.

## 14. Anforderungen an G5–G7

### G5 – Zielarchitektur

- öffentliche/interne Zugriffswege trennen,
- Storage-/Zugriffsstrategie für K0–K2,
- konkreten Datei-/Bildspeicher gegen G4-Anforderungen prüfen,
- Secret-Infrastruktur für K3,
- schutzklassen- und personenbezugsbewusster KI-Router,
- Providerfreigabematrix umsetzen,
- keine Datenbank-Dumps an KI,
- Schutzklasse bei variablen Daten technisch bestimmbar,
- PWA-Cache nur für K0,
- TDDDG-konforme lokale Speicherung,
- sichere Session-/Tokenhaltung,
- technisch mögliche Löschung/Anonymisierung.

### G6 – Rollen/Rechte

- Besucher nur K0,
- Redakteur K0/K1 und erforderliche K2-Daten,
- Admin zusätzliche administrative Funktionen,
- AI Tasks nur explizit freigegebene Daten/Funktionen,
- S3-Freigabe serverseitig erzwingen,
- Datenschutz-Adminworkflow.

### G7 / Go-live

- konkrete Log-/Audit-/Backup-Retention parametrisieren,
- tatsächliche Provider/Empfänger und Verträge dokumentieren,
- Datenschutzerklärung anhand tatsächlich eingesetzter Dienste,
- Rechtsgrundlagen/Informationspflichten je Verarbeitung dokumentieren,
- Verarbeitungsinventar bzw. erforderliches Verzeichnis von Verarbeitungstätigkeiten,
- DSFA-Vorprüfung für tatsächlich umgesetzte personenbezogene Verarbeitungen,
- ggf. vollständige DSFA vor Beginn einer Hochrisikoverarbeitung.

## 15. G4-Abschlusskriterien

G4 gilt fachlich als abgeschlossen, weil festgelegt sind:

1. Schutzklassen K0–K3,
2. Trennung von Schutzklasse und Personenbezug,
3. K2-Minimierung und bewusst ausgeschlossene Datenbestände,
4. Schutzklassenvererbung und technische Bestimmbarkeit,
5. Grundregeln für personenbezogene Daten, Rechtsgrundlagen und Löschung,
6. Providerfreigabe- und Drittlandprüfrahmen,
7. DSFA-Screening und Wiederanlasstrigger,
8. Offline-/PWA-Grundsätze,
9. Anforderungen an Push, Newsletter, Bilder und Dateien,
10. Übergaben an G5–G7.

Konkrete Anbieter-, Speicher-, Push-, Auth-, RLS-, Verschlüsselungs- und Retentionentscheidungen sind bewusst Folgeaufgaben und halten G4 nicht offen.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G4 konsolidiert und fachlich abgeschlossen; Schutzklasse und Personenbezug getrennt; Provider-/DSFA-Prüfrahmen integriert; konkrete Anbieter-/Storage-/Push-/Retentionentscheidungen in G5–G7 abgegrenzt. |
| 0.3 | 06.10.2026 | Hauptquelle konsolidiert; Detailquelle für personenbezogene Verarbeitungen/Löschlogik eingebunden; Löschlogik als G4-Grundsatz geklärt. |
| 0.2 | 06.10.2026 | K2-Minimierung, Schutzklassenvererbung, Push/Newsletter-Abgrenzung, Rechtsanker und Provider-Mindestprüfung ergänzt. |
| 0.1 | 06.10.2026 | G4 gestartet; Schutzklassen und erste Matrix festgelegt. |
