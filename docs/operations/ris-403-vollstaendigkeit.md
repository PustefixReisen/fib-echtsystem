# RIS-Vollständigkeit – Ergänzung zu PR #404

Stand: 08.11.2026. Auftrag #403 / Befunde #377. Keine produktiven Schreibaktionen.

## HTTP 403: konkrete Ursache

Geprüfte Adresse:
`https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031`.

Diagnose am 08.11.2026, 16:12:56 UTC (17:12:56 Europe/Berlin), über den
vorgegebenen HTTPS-Proxy, mit aktiver TLS-Verifikation und ohne Weiterleitungsfolge:

```text
curl: (56) CONNECT tunnel failed, response 403
HTTP/1.1 403 Forbidden
content-length: 16
content-type: text/plain
server: envoy
connection: close
```

**Der Proxy lehnt den CONNECT-Tunnel ab. Die Verbindung erreicht das RIS nicht.**
Die aktuelle Cloud-Netzwerkpolicy ist `restricted` / `enforced`; der RIS-Host
fehlt in ihrer Freigabeliste. Der vorherige Bericht war zu ungenau: Es ist kein
nachgewiesener HTTP-403 des RIS-Ursprungsservers. Im normalen Sandbox-Aufruf ist
bereits der Proxy-Port nicht erreichbar; der genehmigte Diagnoseaufruf außerhalb
dieser Sandbox erreicht den Proxy, erhält aber dessen CONNECT-Ablehnung.

Damit sind Pfad, Query, User-Agent, Cookies, Weiterleitungen und RIS-Serverkonfiguration
für diesen beobachteten Fehler nicht als Ursache belegt: Es findet noch keine
TLS-/HTTP-Kommunikation mit dem RIS statt. CONNECT richtet sich an Host/Port;
Pfadvarianten würden diese Diagnose nicht klären. Keine alternativen IPs,
Proxyumgehung, Browseridentitätsvortäuschung oder Weiterleitung über andere Dienste.
Keine Policyänderung vorgenommen.

## Vorhandene zulässige Wege und ihre Nachweisgrenze

| Weg | Befund |
|---|---|
| Konkrete Sitzungsseite `si0057.asp?__ksinr=1031` | Im Cloud-Executor durch CONNECT-Policy blockiert; kein aktueller Originalabruf. Historischer erlaubter Abruf vom 31.10. ist in `tests/u4/fixtures/ris-1031-provenance.json` dokumentiert. |
| Offizieller Monatskalender `si0040.asp?__cjahr=2026&__cmonat=10&__canz=1&__cselect=0` | Bereits vorhandener regulärer FIB-Entdeckungsweg; gleicher blockierter Host. Nach eindeutiger CONNECT-Ablehnung nicht als vermeintlicher Umgehungsweg erneut angefragt. Aktuelle Erreichbarkeit vom RIS aus hier unbekannt. |
| Offizielle Freigabeliste `do0040.asp?smcmode=32832` | Vorhandener regulärer FIB-Quellenweg. FIB-DB protokolliert zuletzt am 30.10. erfolgreiche/partielle Läufe mit 94 gesehenen Dokumenten. Das ist ein historischer Dokumentlisten-Nachweis, kein aktueller Vollständigkeitsnachweis der Sitzung. |
| Originalniederschrift `getfile.asp?id=75785` | Historischer Abruf mit SHA-256 im Provenienzbeleg dokumentiert; aktueller Download nicht ausgeführt. Keine PDF-/Volltextspeicherung, keine neue Extraktion. Die Nutzerangabe „19 TOPs“ ist kein hier erneut verifizierter Inhaltsbeleg. |
| Bestehende gehostete Edge-Funktion | Regulärer Scanner und begrenzter Integrationsweg existieren. Kein AAL2-Verwaltungstoken im Executor; kein gehosteter Lauf ausgelöst. Der vorhandene Integrationsweg ist ausdrücklich nur für Sitzung 1032 freigegeben, nicht für 1031; diese Grenze wird nicht erweitert. |
| Bestehende Supabase-Anbindung | Lesende FIB-SQL-Inventur erfolgreich. Keine Verwendung von SQL/Serverfunktionen als HTTP-Proxy; keine Konfigurations-/Auth-Änderung. |
| Persönlicher Firefox | Laut Abnahmebefund funktionieren externe RIS-PDF-Links. Dies ist Nutzerbeobachtung, kein eigener aktueller Netztest. Keine erneute persönliche Anmeldung versucht. |

Erforderlich für einen neuen Echtnachweis ist eine reguläre administrative
Netzfreigabe für den offiziellen RIS-Host im vorgesehenen Arbeitskontext oder
ein bereits regulär berechtigter Betreiberkontext. Es fehlt ein technischer Zugang,
keine Freigabe zur Umgehung. In dieser Sitzung ist kein unterstütztes Werkzeug zur
Beantragung einer Cloud-Policyänderung verfügbar. Es werden keine Zugangsdaten benötigt
oder im Chat angefordert.

## Tatsächlicher realer Bestand

Erneute lesende Shared-Apps-Abfrage am 08.11. bestätigt:

- Sitzung vom 15.10.2026, URL mit `__ksinr=1031`, Revision 1.
- Genau **3 gespeicherte TOPs: 2, 3, 6**.
- `snapshot.capture.scope = documented_reference_excerpt`,
  `fixture = ris-1031-top-2-3-6.html`.
- RIS-Scope `ris-dokumentliste`: letzter Versuch/Erfolg 30.10.2026 16:49:22.875 UTC;
  zu diesem Zeitpunkt kein Fehler. Kein späterer regulärer Strukturimport nachgewiesen.

Somit **3 reale TOP-Referenzen historisch belegt, 0 neu abgerufene TOPs** in diesem
Durchlauf. Die vollständigen 19 realen TOPs und die übrigen 16 Identitäten bleiben
unverifiziert. Es wird weder „19 erfolgreich importiert“ noch ein RIS-Scannerverlust
von genau 16 TOPs behauptet. Die gespeicherten drei stammen aus absichtlich reduziertem
Referenzmaterial, nicht aus einem nachgewiesenen vollständigen Sitzungsabruf.

## Technische Korrektur und Abdeckung des vorhandenen Wegs

1. Der Parser las bisher die erste Tabellenzelle als TOP-Nummer und akzeptierte
   jede Zeile mit dem Wort `tofnum`. Eine Kopfzeile `th.tofnum` konnte dadurch als
   ungeklärter TOP gelten; eine zusätzliche erste Spalte störte die Nummernerkennung.
   Nun wird die tatsächliche `td.tofnum`-Zelle bevorzugt; reine Kopfzeilen werden ignoriert.
   Kein Zusammenhang dieses belegten Parserfehlers mit den drei Referenz-TOPs behauptet.
2. Kein Vorlagenfilter im regulären Parser/Import: Alle erkannten TOP-Zeilen werden
   übernommen, auch ohne Vorlage oder Dokument. Der ältere reine Beobachtungshelfer
   `risSessionSnapshot` erzeugt nur konservative Vorschlagsbeobachtungen und ist nicht
   der aktuelle Scanner-/DB-Importweg; er wird nicht als Vollständigkeitsnachweis verwendet.
3. Die vorhandene API liefert aus dem bestehenden Snapshot-JSON jetzt Herkunft,
   beobachtete/gespeicherte TOP-Zahlen, ungeklärte Nummern und aus älteren Fassungen
   erhaltene TOPs. Die UI benennt `reference_excerpt` ausdrücklich als reduzierte
   Referenz. Ein beobachteter Seitenbestand bleibt **unverified**, auch bei 19 Zeilen.
   Kein neues Schema, keine rückwirkende pauschale Datenbereinigung.
4. Die Parserfassung wird im vorhandenen Snapshot-JSON dokumentiert. Ein erneuter Abruf
   identischer HTML-Bytes aus einer älteren Parserfassung erzeugt eine neue abgeleitete
   Revision, statt die Korrektur wegen gleichen Quellhashs zu überspringen. Der Quellhash
   bleibt unverändert, die frühere Revision erhalten.
   Bestehende Revisions-/Hashprüfung bleibt erhalten: neue oder geänderte TOPs werden
   beim erneuten regulären Sitzungsabruf übernommen, stabile Identitäten und manuelle
   Beziehungen bleiben erhalten. Eine später nicht mehr beobachtete Zeile wird nicht
   gelöscht, sondern als ältere Fassung erkennbar. Der Scanner besucht bekannte Sitzungen
   in einem neuen abgeschlossenen Prüfzyklus erneut; Fehler bleiben im vorhandenen
   Cursor-/Fehlerweg wiederholbar. Keine neue Automation aktiviert.

## Tests und Unterscheidung der Belege

- **Echte Netzabfrage:** ausschließlich die CONNECT-Diagnose oben; kein neuer RIS-Inhalt.
- **Vorhandene reale Referenzen:** TOP 2/3/6 und Provenienz vom 31.10.; Parser prüft getrennte
  Titel/Status. Kein vollständiges Original-HTML und kein neuer Niederschriftvolltext.
- **Synthetische Daten:** vollständige 19-TOP-HTML-Tabelle ohne Vorlagen, einschließlich
  Kopfzeile und Zusatzspalte. Prüfung durch Parser, tatsächlichen regulären Edge-Handler
  mit simuliertem HTTP und echten isolierten PostgreSQL-Migrationen. Danach unveränderte
  Wiederholung, Titeländerung und späterer 20. TOP ohne Vorlage. Dies beweist den
  Softwareweg für die bereitgestellten Zeilen, ausdrücklich nicht 19 reale TOP-Titel.
- **Isolierter PG17-Import/API:** 19 → 20 TOPs, stabile ID bei Änderung, Wiederholbarkeit;
  Rückgang der zuletzt beobachteten Zeilen auf 19 erhält 20 gespeicherte Zeilen und
  meldet genau eine ältere, nicht erneut beobachtete Zeile. Kein Verlust vorhandener
  redaktioneller Daten. Vorhandene Rechte-/Zuordnungsregressionen bleiben erhalten.
- **UI:** explizite Teilreferenzkennzeichnung plus bisherige Desktop-/Mobile-Regression.
- Lokal ausgeführt: Core-/Frontend-Typecheck, komplette U4-Suite, regulärer Build,
  Chromium-Komponentenprüfung sowie PG17-Persistenz-/Scanner-/Importprüfungen.
  CI-Nachweise des ergänzten Commits stehen in den Checks von PR #404.

## Bereitstellungseignung

Die 403-Ursache ist technisch geklärt; reguläre Erfassung und Nachträge sind auf
kontrollierten Eingaben prüfbar. **Die vollständige reale Sitzung ist weiterhin
nicht nachgewiesen.** Für eine Bereitstellung mit dem Anspruch „Sitzung 15.10.
vollständig erfasst“ ist PR #404 deshalb noch nicht geeignet. Für das begrenzte
Korrekturpaket ist der technische Teststand anhand der finalen PR-Checks bewertbar;
jede Bereitstellung bleibt separat freizugeben. Der PR bleibt bis zur Bewertung
dieser Grenze Draft. Rechtsvorbehalt für Dokumentinhalte bleibt unverändert.
