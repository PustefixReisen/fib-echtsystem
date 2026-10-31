# U4 – Technische Vorbereitung der persönlichen Nutzerabnahme

| Version | Stand | Verantwortung |
|---|---|---|
| 1.0 | 31.10.2026 | Josef Walter – vorbereitet mit KI-Unterstützung |

## Ergebnis und Bereitstellungsstatus

Folgeauftrag #354 nach #352 / PR #353. Der Integrationsaufbau ist als lokale,
wiederaufnehmbare Abnahmeumgebung vorbereitet. Die einzige fachliche Anleitung ist
[Persönliche Nutzerabnahme](u4-persoenliche-nutzerabnahme.md). Dieses Dokument richtet
sich an die Person, die die technische Einrichtung übernimmt.

**Noch keine beim Nutzer eingerichtete oder extern erreichbare Umgebung.**
Ein GitHub-CI-Runner oder eine Sandbox ist kein persönlicher Testzugang.
Die lokale Einrichtung auf dem Nutzerrechner und die anschließende menschliche
Abnahme stehen aus. Ein externer Testzugang wurde weder angelegt noch veröffentlicht.

## Entscheidung für den Zugang

| Möglichkeit | Kosten / Aufwand | Sicherheitsaspekte | Empfehlung |
|---|---|---|---|
| Bestehender Ubuntu-Rechner, nur Loopback | Kein zusätzliches Hostingentgelt; lokale Ressourcen, Download/Einrichtung von Docker, Node und Testwerkzeugen | Keine offenen Netzwerkports; eigener PostgreSQL-/Auth-Bestand; private Dateien außerhalb Git/Cloud | **Bevorzugter erster Weg** |
| Eigener bereits vorhandener Linux-Testrechner, privater SSH-Tunnel | Kein neues Hostingentgelt, sofern vorhandene Kapazität reicht; Einrichtung von Tunnel und Zugriff | Nur SSH erreichbar; lokale Dienste bleiben Loopback; getrenntes Testsystem, Schlüsselzugriff und Löschtermin erforderlich | Alternative, wenn lokale Ressourcen nicht reichen; tatsächliche Bereitstellung separat freigeben |
| Neuer EU-Testserver | Neues laufendes Hosting-/ggf. Sicherungsentgelt nach konkretem Anbieterangebot, zusätzlich Einrichtung und Wartung | Eigene Maschine, kein Shared-Apps; Firewall/SSH-Tunnel, Aufbewahrung, Zugriffsprüfung und Abschaltung planen | Für diese einzelne Abnahme zunächst kein belegter Bedarf; keinen Server bestellen |

Es werden keine nicht verifizierten Tarifbeträge zugesichert. Für eine kostenpflichtige
Alternative sind vor Freigabe Anbieter, EU-Standort, benötigte Ressourcen, Bruttopreis,
Laufzeit/Abrechnung und Löschtermin konkret festzulegen. Die lokale Variante benötigt
keinen neuen Cloud-Dienst. Vorhandensein und Kapazität des Nutzerrechners sind noch zu prüfen.

## Lokale Voraussetzungen und Einrichtung

Geprüfter Zielablauf: Linux/Ubuntu, Docker Engine mit Compose, Node.js 22 oder neuer,
Python 3 mit `venv`, Git und freier lokaler Speicher für Container/Abhängigkeiten.
Für einen einzelnen Prüfer zunächst 4 GB freier RAM und 5 GB freier Speicher als
Planungsreserve vorsehen; dies ist keine gemessene Mindestanforderung. Die aktuelle
Ubuntu-Installation des Nutzers wurde nicht ferngesteuert geprüft.

Die Installation von Docker und Node muss aus den offiziellen Projektquellen erfolgen:
[Docker Ubuntu](https://docs.docker.com/engine/install/ubuntu/),
[Node.js](https://nodejs.org/en/download). Nicht ungeprüft die eventuell ältere
Ubuntu-Standardversion von Node verwenden. Der Launcher installiert keine Systempakete
und fordert keine administrativen Rechte an. Python-ReportLab wird nur beim ausdrücklich
gewählten Fixture-Modus in einer privaten virtuellen Umgebung installiert.

Im vorhandenen Repository:

```bash
git switch main
git pull --ff-only
npm install --ignore-scripts --no-package-lock --no-audit --no-fund
npm run acceptance:ris
```

Beim ersten Start sind Downloads von Container-Images, Deno und npm-Abhängigkeiten
sowie der sechs amtlichen PDFs erforderlich. Keine produktiven Zugangsdaten in die
Shell übernehmen. Der Launcher entfernt relevante geerbte Supabase-Variablen und setzt
alle Verbindungen auf die feste lokale Prüfumgebung. Auch Docker wird ausdrücklich
über `unix:///var/run/docker.sock` angesprochen; geerbte entfernte Docker-Hosts und
Kontexte werden verworfen. Für einen lokalen Rootless-Docker kann der Betreiber
`FIB_ACCEPTANCE_DOCKER_SOCKET` auf dessen absoluten lokalen Socketpfad setzen;
TCP-/SSH-Daemons sind nicht zulässig. Der gewählte Socket gehört zur Bestandsidentität.

Der Start:

1. verweigert belegte Ports 4173, 54321, 54323, 9999 und 54324;
2. erstellt `~/.local/state/fib-ris-acceptance` mit Verzeichnisrecht 0700, Dateien mit 0600;
3. ruft sechs fest erlaubte Original-PDFs privat ab, prüft PDF-Format und SHA-256;
   Niederschrift 75785 muss zum dokumentierten Referenzhash passen, sonst Abbruch;
4. startet das separate Compose-Projekt `fib-ris-acceptance` mit eigenem persistentem
   Datenvolume; keine Verbindung zum CI-Projekt `fib-ris-e2e` oder Shared-Apps;
5. verwendet dieselbe FIB-Basis, relevanten Migrationen, realen GoTrue-Konten/TOTP und
   eingeschränkten Runtime-Login wie #353;
6. führt tatsächliche Scanner und redaktionelle HTTP-Aktionen aus: 1032 bleibt ohne
   Beschluss, 1031 erhält vier gekennzeichnete Vorbereitungsentscheidungen, Gemeinde
   bleibt als Beobachtung zur eigenen Übernahme;
7. baut die Gesamt-App mit sichtbarem lokalem Abnahme-/Datenhinweis und legt Build,
   Auth-Daten, Quellenmanifest und Protokolle ausschließlich im privaten Zustandsordner ab;
8. meldet die Loopback-Adresse und den Pfad der privaten Zugangsdatei, ohne Kennwörter
   oder TOTP-Schlüssel auszugeben.

Der TOTP-Schlüssel wird nur lokal vorbereitet und vom Prüfer manuell in seinen
Authenticator übernommen. Die tatsächliche Anmeldung und MFA laufen durch GoTrue.
Es gibt keine Anmeldung per vorgetäuschtem Browser-Claim. Das Beispielkonto aus dem
CI und das produktive FIB-Konto sind nicht identisch mit diesem lokalen Konto.

**Wiederaufnahme:** Strg+C im Vordergrundprozess stoppt Anwendungsdienste und Container,
erhält jedoch das benannte Datenvolume und die privaten Konten. Derselbe Start verwendet
denselben Bestand und überschreibt keine Entscheidungen. Ein unvollständiger Erststart
wird nicht blind erneut befüllt. Bei einem harten Prozessabbruch erst laufende Prozesse/
Container prüfen, dann ausschließlich den privaten `running`-Ordner entfernen.

**Ausdrücklicher lokaler Neustart mit Datenverlust:** Nur wenn die Bearbeitungen nicht
mehr benötigt werden und kein Starter läuft:

```bash
npm run acceptance:ris -- reset --confirm=RESET_LOCAL_ACCEPTANCE
```

Dieser Befehl löscht ausschließlich das identifizierte lokale Compose-Volume und den
zugehörigen privaten Zustandsordner. Vorher Rückmeldungen gegebenenfalls bereinigt sichern.
Keine automatische Löschung nach persönlicher Prüfung.

## Referenzgrenzen und technische Tests

Originalmodus: Original-PDF-Bytes werden privat abgerufen und mit tatsächlichem unpdf
extrahiert. Der Hashvergleich von 75785 wurde lokal erfolgreich geprüft. Die vier
Originaltextbereiche sind eindeutig auffindbar. HTML-Sitzungsansichten und Nachricht
bleiben die bereits dokumentierten reduzierten Referenzen aus #353. Kein Live-Monitor,
keine vollständige RIS-/Archivabdeckung und kein aktuelles Beschlussergebnis für 1032
werden daraus behauptet. Neue Ergebnisse am Live-RIS sind getrennt zu erfassen.
Der Gateway stellt die für diese drei Arbeitswege geprüften Handler bereit, nicht alle
Administrations- oder Themeneditorfunktionen der Gesamtanwendung. Vorgangs-/Themenbezüge
werden innerhalb der Quellen-/Sitzungsansichten geprüft.

Der Fixture-Modus (`npm run acceptance:ris -- start --fixtures`) ist ein expliziter
zweiter Weg für technische Bedienproben ohne Originalabruf. Er erzeugt synthetische
PDF-Hüllen, kennzeichnet sie im Login und in der Anwendung und darf nicht als fachliche
Inhaltsabnahme der Vorlagen ausgegeben werden. Der Modus eines bestehenden Bestands
wird beim Wiederstart beibehalten. Ein Wechsel benötigt einen ausdrücklich gelöschten
und neu gestarteten Bestand.

Die persönliche Umgebung enthält keinen künstlichen Genehmigungsbeleg 99001; die
Genehmigung bleibt unbekannt. Der positive synthetische Genehmigungstest bleibt im
getrennten technischen Integrationsworkflow erhalten.

| Prüfung | Aussage / Grenze |
|---|---|
| `Personal RIS acceptance preparation` | Tatsächlicher persönlicher Launcher startet, erzeugt private Konten, Datenbank und Referenzen; Chromium meldet sich real mit Passwort/TOTP an; UI zeigt zwei TOP-6-Punkte; eine eigene Fundstellenübernahme bleibt nach vollständigem Stop/Start erhalten. Externe PDF-Bytes im CI ausdrücklich synthetisch. Kein Upload privater Zustände/Artefakte. |
| `Integrated RIS acceptance` | Bisheriger Gesamtpfad aus #353 bleibt unverändert prüfbar; Genehmigungs-Testdaten sind nur dort aktiv. |
| Lokaler Originalabruf / Extraktion | Sechs öffentliche Original-PDFs privat geladen; Hash 75785 und vier eindeutige Beschlussauszüge mit tatsächlichem unpdf geprüft. Kein behaupteter vollständiger Browser-/Datenbanklauf mit Original-PDFs im Work-Rechner ohne Docker. |
| Bestehende UI-/Auth-/Build-/DB-Regression | Prüfen die Auswirkungen auf die reguläre Anwendung; ersetzen keine persönliche fachliche Beurteilung. |

Am 31.10.2026 bestand Head `3da9f8da0b40e4394f98e7455fa65b01f337f7d0` **8/8 Checks**.
[Persönlicher Start-/Wiederaufnahmetest](https://github.com/PustefixReisen/fib-echtsystem/actions/runs/41199994518)
belegt tatsächlich erhaltene Bearbeitungen nach Stop/Start. Zusätzlich erfolgreich:
Gesamtintegration, PostgreSQL, reguläre UI, Build, Auth Security, Core Services und
Source Probe. Der abschließende PR-Head wird vor Merge nochmals geprüft.

| Akzeptanzfall der Vorbereitung | Status | Beleg / verbleibende Grenze |
|---|---|---|
| Persönlicher Launcher, echte Browser-Anmeldung/MFA, Referenzbestand | bestätigt | CI mit realen lokalen Diensten; PDF-Transport im CI synthetisch |
| Eigene Bearbeitung bleibt nach Stop/Start erhalten | bestätigt | dieselbe Fundstelle und dieselben Auth-Konten nach Neustart, keine Neubefüllung |
| Private Konten/Zustände und expliziter lokaler Reset | bestätigt | Dateirechte im CI, eigener Compose-Bestand; keine persönlichen Artefaktuploads |
| Original-PDF-Belege | teilweise bestätigt | sechs Originale privat geladen, 75785-Hash und vier eindeutige Text-/Abstimmungsbereiche mit unpdf geprüft; vollständiger Original-Browserlauf hier ohne Docker nicht ausgeführt |
| Bedienanleitung und Beanstandungsprotokoll | bestätigt | drei Fälle, erwartete Ergebnisse, private Rückmeldung und Abnahmekriterien im Repository |
| Einrichtung auf Nutzerrechner / Erreichbarkeit beim Nutzer | nicht geprüft | noch durchzuführen; kein externer Testzugang behauptet |
| Menschliche fachliche Abnahme | nicht geprüft | folgt gemeinsam mit Josef Walter |

Ein implementierter, aber fehlgeschlagener Start ist keine abgenommene Vorbereitung.
Die acht technischen Checks ersetzen weder Einrichtung beim Prüfer noch seine Bewertung.

## Externer Zugang – ausschließlich vorbereitetes Freigabepaket

Wenn der lokale Weg nicht praktikabel ist, wäre die konkrete nächste Variante ein
separater Linux-Testhost mit **privatem SSH-Tunnel**, ohne öffentliche App-/Auth-Ports.
Der Browser würde weiterhin dieselben lokalen Adressen verwenden. Ein Tunnel müsste
4173 und 54321 vom lokalen Loopback zum Loopback des Testhosts leiten; Datenbank und
Auth-Verwaltungsports werden nicht zum Prüfer weitergeleitet. Keine öffentliche Domain
oder Anpassung produktiver CORS-/Auth-Einstellungen notwendig.

Vor tatsächlicher Einrichtung sind gemeinsam festzuhalten:

- vorhandener Host oder ausdrücklich genehmigtes kostenpflichtiges Angebot;
- zuständiger Betreiber, eigener SSH-Zugang nur für den Prüfer und Zugriffsdauer;
- getrennte Maschine/Datenbank, zulässige Referenzdaten, private Übergabe der Testanmeldung;
- Firewall mit ausschließlich erforderlichem SSH-Zugang, Sicherung und Löschung;
- Start/Stop-Zeitfenster, Updateverantwortung und Rückbau nach Abnahme.

**Noch nicht freigegeben oder durchgeführt:** Beschaffung, externer Host, Tunnelzugang,
öffentlicher Testdienst und jede produktive Bereitstellung. Der Entwicklungsauftrag
allein ist keine Freigabe hierfür. Die vorbereiteten Dateien erzeugen keinen solchen Dienst.

## Betrieb und nächster Schritt

Keine Produktionsmigration, kein Deployment, kein Cron/Produktionsflag, keine Änderung
produktiver Schlüssel und keine Änderung von Memorix oder Shared-Apps. Die tatsächliche
fachliche Bewertung erfolgt anhand der persönlichen Anleitung und Originalbelege.
#281 bleibt für weitere Informationsgewinnung offen.

## Änderungshistorie

| Version | Änderung |
|---|---|
| 1.0 | Lokalen Zugriff, persistente Wiederaufnahme, Original-/Fixture-Grenzen, CI und externes Freigabepaket vorbereitet |
