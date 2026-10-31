# U4 – Integrierte technische RIS-Abnahme

| Version | Stand | Bearbeitung |
|---|---|---|
| 1.0 | 31.10.2026 | Entwicklung mit KI-Unterstützung, Auftrag Josef Walter |

## Auftrag und Abnahmegrenze

Issue #352 verbindet die bisher getrennten Nachweise aus PR #346–#350. Die technische
Prüfung muss einen zusammenhängenden Weg durch die authentifizierte Gesamt-App,
HTTP-Handler und Datenbank belegen. Eine Addition bestandener Komponentenprüfungen
reicht nicht. Fachliche Grundlage bleiben die Kapitel 03, 06 und 07; keine neue Fachregel.

**Prüfstand:** Integrationsablauf implementiert; abschließender erfolgreicher CI-Nachweis
wird im PR #353 und Issue #352 festgehalten. Eine fehlgeschlagene Phase ist kein bestandener
Akzeptanzfall. Maßgeblich sind `results.json` und der erfolgreiche Workflow des geprüften Heads.

## Prüfaufbau

`tests/ris-e2e/` verbindet:

1. vollständigen Build von `apps/editorial-web` einschließlich regulärer Navigation,
   Anmeldung, MFA, SourceWorkspace und vorhandenem Ereigniseditor;
2. echten lokalen GoTrue-Dienst `v2.197.0`, TOTP-Challenge/Verify und kurzlebige synthetische
   Admin-/Redakteur-/Nichtmitglied-Konten; Browser-Login erfolgt mit Passwort und TOTP,
   nicht durch Einsetzen eines vorgefertigten AAL2-Claims in den Browser;
3. echte Handler `fib-session-context`, `fib-get-event`, `fib-coordination`,
   `fib-editorial-write`, `fib-u4-ris-pilot` und `fib-u4-pilot`, direkt aus dem Repository
   importiert und unter Deno `2.9.6` ausgeführt, ohne Umschreiben ihres Codes;
4. PostgreSQL 16 in eigener Datenbank `fib_u4_test`, reale FIB-Basistabellen und benannte
   Bestandsmigrationen. Handler verbinden sich als tatsächlicher Login `fib_app` mit
   geerbtem `fib_runtime`, ohne Superuser/BYPASSRLS. Die Runtime kann `auth.users` nicht lesen.

Der Test-Gateway ersetzt ausschließlich die lokale Bereitstellungs-/CORS-Hülle und den
externen Quellentransport. Seine Auth-Weiterleitung geht zum tatsächlichen lokalen GoTrue.
FIB-Endpunkte werden nicht simuliert; SQL-Resultate und Mitgliedschaftsantworten sind echt.
Der Browser darf nur Loopback erreichen; Deno-Netzwerkrechte sind auf die drei lokalen
Dienstports begrenzt. Nicht aufgeführte externe Quelladressen werden abgewiesen.

Nicht Bestandteil dieses Nachweises: gehosteter Supabase-Edge-Gateway/Worker, produktive
CORS-/Domainkonfiguration, PostgREST, produktiver historischer Migrationsstand und echte
Live-Vollständigkeit der Referenzquellen. Die Datenbank-Nebenwegprüfung erfolgt über echte
SQL-Rollen `anon`, `authenticated`, `service_role`, nicht über eine vorgetäuschte Data API.
Der komplette historische Produktiv-Migrationspfad wird nicht behauptet; die verwendeten
Dateien stehen im Artefakt `migrations.json`.

## Referenzdaten und ausdrücklich simulierte Teile

| Fall | Grundlage | Testtransformation / Grenze |
|---|---|---|
| GR 29.10.2026, Sitzung 1032, TOP 2/3 | bestehende reale reduzierte HTML-Fixture, Vorlage 5395/2026 und 5397/2026, Dokumente 75714/75790 | PDF-Transporttexte ausdrücklich synthetisch; keine Behauptung eines tatsächlichen Beschlusses |
| GR 15.10.2026, Sitzung 1031, TOP 2/3/6 | reale reduzierte HTML-Fixture und dokumentierte Textauszüge der Niederschrift 75785 | ReportLab erzeugt reproduzierbare PDF-Hüllen mit diesen Auszügen; unpdf extrahiert tatsächlich. Die Bytes/Hashes sind **nicht** der Original-PDF-Hash aus `ris-1031-provenance.json` |
| Weitere Vorlagen in 1031 | reale Links 74647/75243/75379 | ausdrücklich synthetische Transporttexte; kein inhaltlicher Beschlussnachweis |
| Parkraumkonzept | reale reduzierte Detail-Fixture und `gemeinde-provenance.json` | Nachrichtenlisten auf diesen einen Artikel reduziert; kein vollständiger Listen-/Archivabruf behauptet |
| Nachveröffentlichung / Genehmigung | gesteuerter Testzustand des externen Quellentransports | Dokument 99001 und Genehmigungstext ausdrücklich synthetisch; spätere Sitzung als Datums-/Beziehungsfall, keine Aussage über reale Genehmigung |
| Geänderte Vorlage/Nachricht und Quellenausfall | gesteuerter Testzustand | synthetische Änderungen/Ausfälle; echte Scanner, Hashes, Versionierung und Wiederanläufe |
| Vorgang und Thema | vorhandene synthetische Zielobjekte aus Bootstrap | keine automatische Zielobjektanlage, keine reale redaktionelle Zuordnung behauptet |

`source-transport.jsonl` hält URLs und SHA-256 der tatsächlich gelieferten Testantworten
fest. Herkunft des Originalauszugs und Herkunft der PDF-Testhülle dürfen nicht gleichgesetzt
werden. Vollständige Rohantworten, Auth-Tokens und Testpasswörter werden nicht als Artefakte
veröffentlicht. Die Redaktion muss die Originale bei der fachlichen Abnahme selbst prüfen.

## Technischer Ablauf und Akzeptanzfälle

Der eine Workflow `Integrated RIS acceptance` führt zuerst die Quellenaufnahme aus und
verwendet anschließend genau diesen Datenbankbestand im echten Browser. Positive
Prüfungen werden erst nach erfolgreicher HTTP-Antwort bzw. Datenbankkontrolle protokolliert.

| Akzeptanzfall | Nachweis im zusammenhängenden Ablauf |
|---|---|
| Login/MFA/Mitgliedschaft | GoTrue prüft Passwort/TOTP; reguläre App zeigt vor MFA keine Fachnavigation; echte AAL1-, Nichtmitglied- und ungültige Tokens werden serverseitig abgewiesen |
| RIS-Scanner → persistente Struktur | HTML/PDF-Testantwort → tatsächlicher Parser/unpdf → Sitzung/TOP/Vorlagen/Dokumentversionen unter Runtime-Login; kein anfänglicher Beschluss und keine Fundstelle ohne Übernahme |
| Reguläre Fundstelle → Ereignis | Übernahme im Browser, gesonderte Ereignisanlage, Öffnen des vorhandenen Ereigniseditors und Rücknavigation zur selben Fundstelle |
| Mehrere Bearbeiter | zweites echtes Testkonto hält Ereignissperre; Browserzuordnung scheitert ohne Änderung; nach Freigabe erfolgreiche Zuordnung |
| Vorlage ≠ tatsächlicher Beschluss | Vorlagen-PDF als Entscheidungsbeleg abgewiesen; keine Beschlusspunkte in Sitzung 1032; erfundene KI-Herkunft abgewiesen |
| Nachveröffentlichung / Änderung | späteres Dokument wird vom Scanner derselben Sitzung hinzugefügt; geänderte Fassung versioniert; alte Browserbestätigung wird zurückgewiesen |
| Transaktionsfehler | temporärer Test-Trigger bricht Snapshot-Schreiben ab; Snapshot-Anzahl und Checkpoint unverändert; nach Entfernen Wiederanlauf mit tatsächlichen Handlern |
| Unterschiedliche Beschlüsse | vier bestätigte Punkte aus Niederschriftsauszügen: keine Abstimmung; 7/13 abgelehnt; TOP 6 mit 17/2 und 19/0. Unbekannte Werte bleiben `null` |
| Dialog Verfahrensstand (#350) | Browser bestätigt zurückgezogenen TOP anhand wortgetreuen Belegs; Status und Prüfspur werden in SQL kontrolliert |
| Dialog Niederschriftsgenehmigung (#350) | fehlender exakter Beleg hält Status unbekannt; ausdrücklich synthetischer späterer Beleg wird getrennt geprüft und gespeichert |
| Gemeinde → Fundstelle → Ereignis → Vorgang/Thema | derselbe Scanner-/Fundstellenweg; bestehendes und neues Ereignis; getrennte Vorschlagsanlage und Bestätigung zu bestehenden Zielen |
| Wiederholung / Konkurrenz | geänderte Nachrichtenrevision, veraltete Bestätigung, parallele aktuelle Übernahmen: dieselbe Fundstelle, genau eine neue Version |
| Keine unbeabsichtigte Veröffentlichung | Meldungsanzahl bleibt null; Vorgangs-/Themenanzahl bleibt beim vorbereiteten Bestand; keine öffentlichen Endpunkte oder Deployments |
| Laufende Autorisierung | deaktivierte FIB-Mitgliedschaft sperrt bereits bestehende echte AAL2-Sitzung beim nächsten API-Aufruf |

Unabhängige Komponenten-, Datenbank- und Auth-Regressionsprüfungen bleiben bestehen.
Sie ergänzen diesen Gesamtpfad, ersetzen ihn aber nicht. Ein erfolgreicher Gesamtpfad
belegt nur diese Fälle, nicht alle Funktionen des Fachhandbuchs oder alle denkbaren
Sitzungs-/Quellenformen.

## Reproduktion und Artefakte

Die ausführbare Reihenfolge steht in `.github/workflows/ris-integrated-e2e.yml`:
Docker Compose starten, Abhängigkeiten installieren, `bootstrap.mjs`, `pdfs.py`,
Deno-Gateway, regulären App-Build/Preview und `run.mjs` ausführen. Erforderlich sind
Docker Compose, Node 22, Python 3 und die gepinnten Testwerkzeuge. Die Umgebung darf
keine produktiven Zugangsdaten enthalten. `RUNNER_TEMP` nimmt die kurzlebigen Testidentitäten
und den kontrollierten externen Quellenzustand auf; der Test akzeptiert keinen frei
konfigurierbaren entfernten Datenbank-/Auth-Endpunkt.

Der Workflow erzeugt isolierte Zufallskennwörter und schreibt die lokalen Variablen in
`GITHUB_ENV`. Es sind keine GitHub-Produktions-Secrets erforderlich. Zur lokalen Nutzung
kann derselbe Ablauf mit einer temporären `GITHUB_ENV`-Datei als reiner Umgebungsdatei
nachvollzogen werden; Werte niemals veröffentlichen. Ports 4173, 54321, 54323 und 9999
müssen frei sein. Nach dem Test immer:

```bash
docker compose -f tests/ris-e2e/compose.yml down --volumes --remove-orphans
```

Das CI-Artefakt `integrated-ris-acceptance` enthält Ergebnisse, Migrationsliste,
Quellentransport-Hashes, HTTP-Statusfolge, Datenbankzusammenfassung und Screenshots.
Ein fehlgeschlagener Lauf enthält nur die bis dahin erreichten Nachweise; der
Fehlerstatus bleibt erhalten. Testkonten, Mail und Datenbankvolumes werden auch nach
Fehlern zerstört. Keine Browsertraces mit Authorization-Headern werden hochgeladen.

## Sicherheits-/Betriebsstatus und fachliche Nutzerabnahme

Kein produktives Deployment, keine Migration in Shared-Apps, kein Cron, keine Änderung
produktiver Secrets/Flags/Rollen und keine Memorix-Änderung. Der RIS-Schalter ist nur in
der isolierten CI-Umgebung aktiviert. Eine Produktivfreigabe ist nicht erforderlich,
um diesen technischen Gesamtpfad zu prüfen, und wurde nicht aus dem Auftrag abgeleitet.

Nächster Schritt ist die fachliche Nutzerabnahme nach dem
[redaktionellen Prüfdurchgang](u4-editorial-ui-acceptance.md): Originalbelege mit
Darstellung vergleichen, passende Ereignisidentität/Rolle und Vorgangs-/Themenbezug
beurteilen, Verständlichkeit von unbekannt/unsicher/bestätigt prüfen und die beiden
Belegdialoge bewerten. Das positive Genehmigungsbeispiel darf dabei ausschließlich
als synthetischer Testfall behandelt werden. Bereitstellung einer erreichbaren
Abnahmeumgebung und jede spätere produktive Bereitstellung sind gesonderte Schritte.

#281 bleibt offen für KI-Produzenten, automatische vorläufige Ereignisse, vollständige
Quellenabdeckung, OCR, Langzeitqualität und weitere dort dokumentierte U4-Arbeit.

## Änderungshistorie

| Version | Änderung |
|---|---|
| 1.0 | Zusammenhängenden Prüfaufbau, Akzeptanzfälle, Transportgrenzen und Nutzerabnahme dokumentiert |
