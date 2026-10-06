# Schutzbedarf, Datenschutz und Offline – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.2 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche Primärquelle für **G4 – Schutzbedarf / Datenschutz / Offline** des FIB-Echtsystems.

Es leitet aus dem abgeschlossenen fachlichen Datenmodell ab,

- wie FIB-Daten nach Schutzbedarf klassifiziert werden,
- welche Daten öffentlich, intern oder besonders geschützt verarbeitet werden dürfen,
- welche Daten an externe KI-Dienste übermittelt werden dürfen,
- welche Daten auf Endgeräten bzw. offline gespeichert werden dürfen,
- welche fachlichen Anforderungen sich daraus für G5 Zielarchitektur und G6 Rollen/Rechte ergeben.

Dieses Dokument beschreibt noch **keine konkrete technische Umsetzung** von Verschlüsselung, RLS, Authentifizierung, Storage oder Gerätesicherheit. Diese wird in den nachfolgenden Gründungsphasen aus den hier festgelegten Anforderungen abgeleitet.

## 2. Rechts- und Schutzrahmen

G4 orientiert sich insbesondere an folgenden aktuellen Grundsätzen:

- DSGVO Art. 5: Rechtmäßigkeit, Transparenz, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung sowie Integrität und Vertraulichkeit,
- DSGVO Art. 9: besonderer Schutz personenbezogener Daten, aus denen u. a. politische Meinungen hervorgehen,
- TDDDG § 25: Speicherung von Informationen auf Endgeräten bzw. Zugriff darauf grundsätzlich nur mit Einwilligung, soweit keine gesetzliche Ausnahme – insbesondere technische Erforderlichkeit für einen ausdrücklich gewünschten digitalen Dienst – greift.

Diese Nennung ersetzt keine spätere konkrete Datenschutzprüfung des produktiven Betriebs. Sie legt den fachlichen Rahmen fest, aus dem G5–G7 die technische Umsetzung ableiten.

## 3. Grundprinzipien

### 3.1 Schutzbedarf hängt vom konkreten Inhalt ab

Ein fachlicher Objekttyp besitzt nicht zwingend immer dieselbe Schutzklasse.

Beispiele:

- eine veröffentlichte Meldung ist öffentlich,
- ihr interner Entwurf ist intern,
- eine zugrunde liegende nicht öffentliche Datei kann vertraulich sein,
- ein API-Schlüssel ist sicherheitskritisch.

Deshalb gilt:

> **Schutzbedarf wird anhand des konkreten Dateninhalts und seiner vorgesehenen Nutzung bestimmt, nicht allein anhand des Tabellennamens oder Fachobjekttyps.**

### 3.2 Minimierungsprinzip

FIB speichert und übermittelt nur Daten, die für die jeweilige fachliche Funktion erforderlich sind.

Insbesondere gilt:

- personenbezogene Daten werden nicht vorsorglich gesammelt,
- KI-Modelle erhalten nur den für die konkrete Aufgabe erforderlichen Kontext,
- Telemetrie und Kostenprotokolle enthalten keine unnötigen Inhaltskopien,
- öffentliche Nutzung erzeugt möglichst keine personenbezogenen Nutzerprofile,
- ein vorhandener technischer Datenzugriff ist keine Begründung dafür, Daten in einen KI-Kontext aufzunehmen.

### 3.3 Öffentliche Quelle bedeutet nicht automatisch freie Weiterverarbeitung

Die öffentliche Auffindbarkeit einer Information oder Datei bedeutet nicht automatisch, dass FIB sie beliebig speichern, vervielfältigen, veröffentlichen oder an externe Dienste übermitteln darf.

Urheberrecht, Persönlichkeitsrechte, Datenschutz, Nutzungsrechte und die konkrete Verarbeitungsnotwendigkeit bleiben getrennt zu prüfen.

### 3.4 Schutz von Integrität ist für FIB besonders wichtig

FIB verarbeitet überwiegend öffentlichkeitsbezogene politische und kommunale Informationen. Deshalb ist neben Vertraulichkeit insbesondere die **Integrität** wesentlich:

- veröffentlichte Inhalte dürfen nicht unbemerkt verändert werden,
- redaktionell bestätigte Fakten und Bewertungen müssen nachvollziehbar bleiben,
- Rollen, Freigaben und Audit dürfen nicht umgangen werden,
- KI-Ergebnisse dürfen nicht automatisch zu fachlich verbindlichen Aussagen werden.

## 4. Schutzklassen

FIB verwendet für G4 vier fachliche Schutzklassen.

### K0 – öffentlich

Daten, die bestimmungsgemäß öffentlich über FIB bereitgestellt werden dürfen.

Beispiele:

- veröffentlichte Meldungen,
- öffentlich freigegebene Vorgangs- und Themenstände,
- veröffentlichte Vertiefungsfragen und -antworten,
- öffentliche Sitzungs-/TOP-Daten,
- öffentlich freigegebene Bilder und Dateien,
- öffentliche Quellenangaben und Links.

Grundsatz:

- öffentlich lesbar,
- Offline-Cache auf Besuchergeräten grundsätzlich zulässig, soweit die konkrete lokale Speicherung für die gewünschte Funktion zulässig und transparent ist,
- Übermittlung an freigegebene KI-Dienste grundsätzlich möglich, soweit für eine FIB-Aufgabe erforderlich,
- Integritäts- und Aktualitätsschutz bleibt erforderlich.

### K1 – intern

Redaktionelle oder betriebliche Daten ohne besonderen Vertraulichkeitsbedarf, die aber nicht für Besucher bestimmt sind.

Beispiele:

- Meldungsentwürfe,
- KI-Kandidaten und Vorschläge,
- interne Beobachtungsaufträge,
- offene redaktionelle Fragen,
- noch nicht freigegebene strukturierte Redaktionsstände,
- interne Bearbeitungshinweise,
- nicht öffentliche AI-Task-Ergebnisse ohne besonders sensible Inhalte.

Grundsatz:

- nur für berechtigte Redakteure/Admins bzw. technisch berechtigte AI Tasks,
- keine öffentliche Auslieferung oder öffentlicher Cache,
- KI-Übermittlung nur im Rahmen einer vorgesehenen Fachfunktion,
- Offline-Speicherung auf Redaktionsgeräten nicht automatisch erlaubt; nur bei später ausdrücklich definiertem sicheren Offline-Konzept.

### K2 – vertraulich / personenbezogen

Daten, deren Offenlegung für Personen, Organisation oder Redaktion nachteilig sein kann oder die personenbezogene Informationen enthalten, die nicht bereits bestimmungsgemäß öffentlich verarbeitet werden.

Beispiele können sein:

- nicht öffentliche Dokumente oder interne GRÜNEN-Unterlagen,
- Kontaktdaten,
- nicht öffentliche personenbezogene Angaben,
- Bilder mit noch ungeklärtem Persönlichkeits-/Veröffentlichungsrecht,
- interne Quellen oder Dateien mit Zugangsbeschränkung,
- redaktionelle Informationen, aus denen vertrauliche politische Vorbereitung oder interne Positionierungsprozesse hervorgehen,
- personenbezogene Inhalte in Chat-/Recherchekontexten, soweit für die Aufgabe erforderlich.

Grundsatz:

- Zugriff nur bei fachlicher Erforderlichkeit,
- keine öffentliche Bereitstellung,
- keine Übermittlung an einen KI-Provider allein deshalb, weil der Inhalt technisch verfügbar ist,
- KI-Übermittlung nur, wenn die konkrete Aufgabe dies erfordert und Provider/Betriebsweg für diese Schutzklasse ausdrücklich freigegeben ist,
- möglichst Minimierung, Redaktion oder Pseudonymisierung vor externer Übermittlung,
- keine ungeschützte Offline-Speicherung.

### K3 – sicherheitskritisch

Daten, deren Offenlegung oder Manipulation unmittelbar die Sicherheit oder Kontrolle des FIB-Systems gefährden kann.

Beispiele:

- Passwörter,
- API-Schlüssel und Secrets,
- private Schlüssel,
- Recovery-/Backup-Zugangsdaten,
- Authentifizierungs- und Session-Geheimnisse,
- hochprivilegierte administrative Zugangsdaten,
- sicherheitskritische Konfigurationswerte.

Grundsatz:

- nicht als normaler fachlicher Inhalt in FIB speichern,
- niemals an Sprachmodelle oder Recherche-KI übermitteln,
- nicht in Logs, Chatverläufe, Prompts oder fachliche Audittexte kopieren,
- nur in dafür geeigneter Secret-/Credential-Infrastruktur verwalten,
- Offline-Speicherung nur innerhalb ausdrücklich dafür vorgesehener sicherer Credential-Systeme.

## 5. Schutzbedarf nach FIB-Datenbereich

| Datenbereich | typischer Schutzbedarf | Anmerkung |
|---|---|---|
| veröffentlichte Meldung | K0 | Entwurf davor K1 |
| Ereignis / bestätigte Sachinformation | K0 oder K1 | abhängig davon, ob öffentlich dargestellt bzw. aus interner Quelle gewonnen |
| Vorgang / Thema | K0 oder K1 | veröffentlichter Stand K0, Arbeitsstand K1 |
| strukturierte politische Einordnung | K0/K1 | veröffentlichter Stand K0, Bearbeitungsstand K1; interne politische Vorbereitung kann im Einzelfall K2 sein |
| Quelle / Fundstelle | K0–K2 | Schutzklasse hängt von Herkunft, Inhalt, Rechten und Sichtbarkeit ab |
| gespeicherte Datei | K0–K2 | öffentliche Bereitstellung nur nach Rechte-/Freigabeprüfung |
| Bild | K0–K2 | Rechte-, Persönlichkeits- und Freigabestatus maßgeblich |
| offene Frage / Wissenslücke | K0–K2 | öffentliche Sachfrage kann K0 sein; interne Recherchefrage K1/K2 |
| Beobachtungsauftrag | meist K1 | bei vertraulichem Gegenstand K2 |
| Recherchelauf | K1, ggf. K2 | kann vertrauliche Such-/Quellenkontexte enthalten |
| Referenzwissen | K0/K1 | öffentliches/stabiles Wissen K0, interne Ergänzungen K1 |
| Referenzmaßstab | K0/K1 | aktive transparente Maßstäbe grundsätzlich öffentlich erklärbar; Entwurf K1 |
| „Mehr wissen?“-Inhalte | K0/K1 | Entwurf K1, veröffentlicht K0 |
| AI Task Definition/Run | K1 | Betriebs-/Kontextdaten können im Einzelfall K2 sein |
| KI-Kosten-/Qualitätsprotokoll | K1 | keine unnötigen personenbezogenen Inhaltskopien |
| Benutzerkonto / Rollen | K2 | Identitäts- und Kontodaten nicht öffentlich |
| Push-Abonnement | K2 | pseudonyme technische Subscription-Daten; nicht mit Besuchsprofilen verknüpfen |
| technische Logs | K1/K2 | abhängig vom Inhalt; Secrets müssen ausgeschlossen sein |
| Secrets / Zugangsdaten | K3 | außerhalb fachlicher FIB-Datenhaltung |

Diese Matrix beschreibt typische Fälle. Die konkrete Klassifikation kann innerhalb eines Datenbereichs höher ausfallen.

## 6. K2-Minimierung im MVP

### 6.1 Grundsatz

> **FIB soll im MVP K2-Daten nur speichern, wenn sie für Redaktion, Rechteklärung, Authentifizierung oder eine konkrete Recherchefunktion tatsächlich erforderlich sind.**

FIB ist kein CRM, kein Bürgerregister, kein Mitgliederverwaltungssystem und kein allgemeines Archiv interner Parteidokumente.

### 6.2 Im MVP voraussichtlich erforderliche K2-Daten

K2 wird insbesondere benötigt für:

- Benutzer-/Redaktionskonten und Rollen,
- gegebenenfalls interne GRÜNEN-Dokumente, die als konkrete Recherchequelle fachlich benötigt werden,
- Rechte-/Nachweisinformationen zu Bildern oder Dateien, soweit diese personenbezogene oder vertrauliche Inhalte enthalten,
- noch nicht freigegebene Bilder mit identifizierbaren Personen bzw. ungeklärten Persönlichkeitsrechten,
- technische Push-Subscription-Daten, sofern Push im MVP aktiviert wird,
- einzelne Recherche-/Chatkontexte, wenn ihre fachlich erforderliche Bearbeitung nicht ohne personenbezogene oder vertrauliche Angaben möglich ist.

### 6.3 Im MVP bewusst nicht als FIB-Datenbestand vorsehen

Ohne gesonderte spätere Produktentscheidung speichert FIB insbesondere **nicht**:

- Besucher-Benutzerkonten,
- personenbezogene Besuchs- oder Interessenprofile,
- zentrale Historien darüber, welche Meldungen ein bestimmter Besucher gelesen hat,
- Mitgliederlisten oder allgemeine Parteikontaktdatenbanken,
- Bürgerdossiers,
- freie öffentliche Kommentar-/Diskussionsprofile,
- private Adresssammlungen,
- allgemeine E-Mail-Postfächer oder Nachrichtenarchive,
- personenbezogene Daten „auf Vorrat“ für mögliche spätere Nutzung.

### 6.4 Interne GRÜNEN-Dokumente

Nicht öffentliche GRÜNEN-Unterlagen können als K2-Fundstellen aufgenommen werden, wenn sie für einen konkreten FIB-Sachverhalt einen echten Recherchemehrwert besitzen.

Dabei gilt:

- sie bleiben intern und werden nicht allein durch Aufnahme in FIB öffentlich,
- sie dürfen Recherche, Einordnung und die Suche nach öffentlichen Belegen unterstützen,
- vertrauliche Inhalte werden nicht unbeabsichtigt in öffentliche Texte übernommen,
- für veröffentlichte Tatsachenbehauptungen soll nach Möglichkeit eine öffentlich nachvollziehbare Quellenbasis verwendet werden,
- eine interne Quelle wird nicht durch einen scheinbar öffentlichen Quellenhinweis verschleiert.

FIB baut damit kein zweites Vollarchiv interner Parteidokumente auf.

## 7. Schutzklassen-Metadaten und Vererbung

Nicht jedes fachliche Objekt benötigt zwingend ein manuell gepflegtes Schutzklassenfeld. Für Datenbereiche mit variablem Schutzbedarf muss die Schutzklasse jedoch technisch eindeutig bestimmbar sein.

Für G5 ist deshalb mindestens vorzusehen:

- `Fundstelle`/gespeicherte Datei: explizite oder eindeutig ableitbare Schutzklasse,
- `Bild`: explizite oder eindeutig ableitbare Schutzklasse,
- importierte Dokument-/Dateiinhalte: Schutzklasse der zugrunde liegenden Fundstelle,
- AI-Task-/Recherche-Kontext: effektive Schutzklasse aus den tatsächlich einbezogenen Daten,
- Chat-/KI-Aufruf: effektive Schutzklasse des übermittelten Kontexts.

Verbindliche Regel:

> **Ein abgeleiteter interner Arbeitsinhalt übernimmt mindestens den höchsten Schutzbedarf seiner verwendeten Eingabedaten, solange nicht durch eine bewusste Redaktion/Redaktionierung ein eigenständiger, geringer geschützter Inhalt entstanden und freigegeben ist.**

Eine Herabstufung auf K0 erfolgt nicht automatisch, sondern durch den vorgesehenen Freigabe-/Veröffentlichungsprozess.

## 8. Personenbezogene Daten

### 8.1 Öffentliche Personenbezüge

FIB kann personenbezogene Informationen aus öffentlich zugänglichen kommunalpolitischen oder institutionellen Quellen benötigen, etwa Namen und öffentliche Funktionen von Mandatsträgern, Ansprechpartnern oder öffentlich auftretenden Akteuren.

Auch solche Informationen bleiben personenbezogene Daten. Ihre Verarbeitung wird auf den für den Informationszweck erforderlichen Umfang begrenzt.

FIB soll insbesondere vermeiden:

- private Kontaktinformationen ohne fachliche Notwendigkeit,
- private Adressen,
- private Lebensumstände ohne unmittelbaren Sachbezug,
- Profilbildung über Personen über den FIB-Zweck hinaus.

### 8.2 Besonders geschützte personenbezogene Daten

Daten, aus denen insbesondere politische Meinungen oder andere besondere Kategorien personenbezogener Daten im Sinne von DSGVO Art. 9 hervorgehen, werden nicht allein deshalb übernommen, weil sie in einer recherchierten Quelle vorkommen.

Bei solchen Inhalten ist vor Persistenz, KI-Übermittlung oder Veröffentlichung eine gesonderte Erforderlichkeits- und Zulässigkeitsprüfung erforderlich.

Das betrifft insbesondere den politischen Kontext von FIB: Eine redaktionelle Benutzerrolle, interne Parteikommunikation oder Mitgliedschaft darf nicht unnötig als öffentliches Personenmerkmal weiterverarbeitet werden.

### 8.3 Benutzer- und Redaktionskonten

Kontodaten von Redakteuren/Admins sind von den öffentlichen FIB-Inhalten getrennt zu behandeln. Öffentliche Beiträge müssen nicht unnötig mit persönlichen Kontodaten der Bearbeiter verknüpft werden.

Für Auditzwecke muss intern nachvollziehbar sein, welcher authentifizierte Akteur eine fachlich wirksame Aktion ausgeführt hat. Die öffentliche Anzeige dieser Identität ist daraus nicht automatisch abzuleiten.

## 9. KI-Übermittlung

### 9.1 Grundregel

> **An einen KI-Provider wird nur der für die konkrete FIB-Aufgabe erforderliche Kontext übermittelt.**

Die Schutzklasse wird vor dem KI-Aufruf berücksichtigt.

### 9.2 Zulässigkeit nach Schutzklasse

- **K0:** grundsätzlich an freigegebene Provider übermittelbar, wenn für die Aufgabe erforderlich.
- **K1:** übermittelbar, wenn die vorgesehene FIB-Funktion KI benötigt bzw. bewusst KI nutzt und der Provider für produktive FIB-Nutzung freigegeben ist.
- **K2:** nur bei ausdrücklicher technischer und organisatorischer Freigabe des Providers/Betriebswegs für diese Schutzklasse und nur bei fachlicher Erforderlichkeit; Datenminimierung hat Vorrang.
- **K3:** keine Übermittlung an KI-Provider.

### 9.3 Mindestanforderungen für K1/K2-Provider

Die konkrete Providerprüfung erfolgt in G5/G7. G4 verlangt jedoch mindestens, dass vor produktiver Nutzung geklärt und dokumentiert wird:

- vertragliche Rolle und Auftragsverarbeitung, soweit erforderlich,
- Datenstandort bzw. Drittlandübermittlung,
- Nutzung von Eingaben/Ausgaben für Anbietertraining oder andere eigene Zwecke,
- Aufbewahrung/Logging beim Provider,
- Lösch-/Retention-Möglichkeiten,
- Unterauftragnehmer bzw. relevante weitere Empfänger,
- technische Zugriffssicherheit,
- Eignung für die jeweils erlaubte Schutzklasse.

K2 darf nicht allein aufgrund einer allgemeinen Providerfreigabe für K1 übermittelt werden.

### 9.4 Kein implizites Gesamt-Datenbank-Sharing

Der FIB-Chat oder ein AI Task erhält nicht pauschal den vollständigen Datenbestand. Fachfunktionen stellen nur die jeweils zulässigen und erforderlichen Daten bereit.

Damit bleibt die bereits festgelegte Fachfunktionsschicht zugleich eine zentrale Datenschutz- und Sicherheitsgrenze.

## 10. Offline und lokale Speicherung

### 10.1 Öffentliche Besucher-PWA

Für K0-Inhalte ist ein technischer Offline-/Cache-Betrieb grundsätzlich zulässig und erwünscht, soweit Aktualität, Cache-Invalidierung und die rechtliche Zulässigkeit der konkreten Endgerätespeicherung sauber gelöst sind.

Dazu können gehören:

- App-Shell und statische Assets,
- zuletzt geladene öffentliche Meldungen,
- öffentliche Vorgangs-/Themen-/Sitzungsinformationen,
- freigegebene öffentliche Bilder,
- lokaler Gerätestand für „neu seit letztem Besuch“.

Der gerätegebundene Neuigkeitsstatus benötigt keine Benutzeranmeldung und soll keine zentrale Nutzerprofilbildung erzeugen.

Für lokale Speicherung bzw. Auslesen auf dem Endgerät ist TDDDG § 25 in der konkreten Umsetzung zu berücksichtigen. G5 muss deshalb unterscheiden, welche lokalen Informationen für den vom Nutzer gewünschten PWA-Dienst unbedingt erforderlich sind und wo andernfalls eine Einwilligung erforderlich wäre.

### 10.2 Redaktionelle Daten

Für K1/K2-Redaktionsdaten gilt im MVP:

> **Keine eigenständige Offline-Redaktionsdatenbank und keine dauerhafte lokale Spiegelung des internen FIB-Bestands.**

Die Redaktions-Web-App ist im MVP grundsätzlich online orientiert. Kurzlebige technische Browser-/Session-Daten sind davon zu unterscheiden und sollen auf das notwendige Minimum begrenzt werden.

Ein späterer echter Offline-Redaktionsmodus wäre eine eigene Sicherheits- und Synchronisationsfunktion und wird nur bei nachgewiesenem Bedarf eingeführt.

### 10.3 Logout und Geräteverlust

Die spätere technische Umsetzung muss sicherstellen, dass besonders geschützte interne Daten nicht allein durch einen früheren Browserzugriff dauerhaft frei auf einem verlorenen Gerät verfügbar bleiben.

Konkrete Session-, Cache-, Token- und Löschregeln werden in G5/G6 technisch festgelegt.

## 11. Push und Newsletter

### 11.1 Push

Push soll im MVP, sofern umgesetzt, **ohne Besucherprofil** auskommen.

Vorzugsmodell:

- pseudonyme technische Subscription,
- keine Verknüpfung mit Namen/E-Mail,
- keine zentrale Lesefortschritts- oder Interessenakte,
- Speicherung nur der für Zustellung/Verwaltung notwendigen Subscription-Daten,
- einfache Abmeldung/Löschung.

Push-Subscription-Daten werden K2 zugeordnet.

### 11.2 Newsletter

Ein Newsletter ist kein notwendiger Bestandteil der FIB-Kerndatenbank.

Falls er eingeführt wird, sollen E-Mail-Adressen, Einwilligungsnachweise, Abmeldungen und Versandlisten vorzugsweise in einem dafür geeigneten spezialisierten Newsletter-Dienst verarbeitet werden. FIB benötigt dann nur die für die Integration erforderliche minimale Schnittstelle und baut keine zweite Mailinglistenverwaltung auf.

## 12. Bilder und Dateien

Für Bilder und Dateien gelten gemeinsam:

1. Speicherbarkeit ist von öffentlicher Bereitstellung zu unterscheiden.
2. Öffentliche Bereitstellung setzt positiv geklärte Rechte voraus.
3. personenbezogene oder identifizierbare Personen im Bild können zusätzlichen Schutzbedarf erzeugen.
4. Originaldateien können intern stärker geschützt sein als eine daraus freigegebene öffentliche Darstellung.
5. Metadaten dürfen keine unnötigen personenbezogenen oder sicherheitsrelevanten Informationen veröffentlichen.

Ein Bild kann damit z. B. intern K2 sein, bis Rechte und Personenbezug geklärt sind, und nach Freigabe in seiner öffentlichen Verwendung K0 werden.

## 13. Audit und Protokollierung

Auditdaten dienen Nachvollziehbarkeit und Sicherheit, dürfen aber nicht unnötig vollständige Fachinhalte vervielfältigen.

Für Audit gilt deshalb:

- Identität des handelnden Akteurs intern nachvollziehbar,
- Fachfunktion/Aktion, Objektbezug, Zeitpunkt, Ergebnis und Bestätigung nachvollziehbar,
- Vorher/Nachher soweit fachlich notwendig,
- keine Secrets,
- personenbezogene Inhaltsdaten nur soweit für Audit tatsächlich erforderlich.

Aufbewahrungsfristen und technische Logstruktur werden später festgelegt.

## 14. Konsequenzen für G5 und G6

Aus G4 sind mindestens folgende technische Anforderungen abzuleiten:

### G5 Zielarchitektur

- Trennung öffentlicher und interner Zugriffswege,
- geeignete Storage-/Zugriffsstrategie für K0–K2-Dateien,
- Secret-Infrastruktur für K3,
- KI-Router mit schutzklassenabhängiger Datenfreigabe,
- keine pauschalen Datenbank-Dumps an KI,
- technische Bestimmbarkeit der Schutzklasse bei variabel geschützten Daten,
- Cache-/PWA-Strategie nur für freigegebene öffentliche Inhalte,
- TDDDG-konforme Bewertung lokaler Endgerätespeicherung,
- sichere Session- und Tokenhaltung,
- Audit ohne Secret-/Inhaltsüberkopie.

### G6 Rollen/Rechte

- Besucher nur K0,
- Redakteur K0/K1 und fachlich erforderliche K2-Daten,
- Admin zusätzlich administrative K2/K3-Verwaltungsfunktionen, wobei K3-Secrets selbst nicht als normale FIB-Daten angezeigt werden sollen,
- AI Tasks nur explizit freigegebene Daten/Fachfunktionen,
- öffentliche Freigabe weiterhin S3,
- Rechteprüfung serverseitig über die Fachfunktionsschicht.

## 15. Noch zu klärende G4-Punkte

Vor Abschluss von G4 sind noch gezielt zu prüfen:

1. konkrete Rechtsgrundlagen/Informationspflichten der tatsächlich vorgesehenen personenbezogenen Verarbeitungen im Produktivbetrieb,
2. konkrete Aufbewahrungs-/Löschanforderungen für Benutzerkonten, Push-Subscriptions, Audit, technische Logs und K2-Fundstellen,
3. konkrete Providerfreigabekriterien und zulässige Anbieter/Betriebswege für K1/K2,
4. ob und wie Datenschutz-Folgenabschätzung bzw. vergleichbare Risikoprüfung für einzelne Verarbeitungen erforderlich ist,
5. ob weitere FIB-Fachobjekte außer Datei/Fundstelle/Bild eine explizite Schutzklassenkennzeichnung benötigen oder eine Ableitung aus Status/Quelle ausreicht.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.2 | 06.10.2026 | K2-Minimierung für MVP festgelegt; Besucherprofile, CRM-/Mitglieder-/Bürgerdatenbestände ausgeschlossen; interne GRÜNEN-Dokumente eingegrenzt; Schutzklassenvererbung und technische Bestimmbarkeit definiert; Push/Newsletter datensparsam abgegrenzt; aktuelle Rechtsanker DSGVO Art. 5/9 und TDDDG § 25 aufgenommen; Provider-Mindestprüfung für K1/K2 ergänzt. |
| 0.1 | 06.10.2026 | G4 gestartet; vier Schutzklassen K0–K3, erste Schutzbedarfsmatrix, Grundregeln für personenbezogene Daten, KI-Übermittlung, Offline/PWA, Bilder/Dateien, Audit sowie Anforderungen an G5/G6 festgelegt. |
