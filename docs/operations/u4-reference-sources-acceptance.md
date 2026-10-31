# U4 – Technischer Abnahmebefund der Referenzquellen (31.10.2026)

**Status:** Teilnachweis; keine vollständige fachliche Abnahme und keine
Produktivfreigabe. Referenzquellen: RIS Feldkirchen und Gemeinde-Nachrichten.

## Abnahmeprinzip

Die Entwicklung weist die Technik anhand automatisierter und reproduzierbarer
Tests nach. Die Redaktion soll keine nicht sichtbare Datenstruktur abnehmen.
Bereitstellung, Vollständigkeit und Relevanz werden mit Referenzbestand und
redaktionellem Feedback iterativ gemessen.

Drei ausdrücklich getrennte Aussagen sind zu protokollieren:
1. **Nachgewiesen:** Ein konkreter, wiederholbarer Test besteht.
2. **Technisch noch offen:** Implementierung/Test oder ein Integrationsnachweis fehlt.
3. **Iterativ:** Trefferquote, rechtzeitige Bereitstellung, Relevanz und tatsächliche
   Vollständigkeit über viele Veröffentlichungen.

## RIS – geprüfte Fähigkeiten und Grenzen

| Prüfgegenstand | Befund | Konkreter Anker |
|---|---|---|
| Veröffentlichtes RIS-PDF erkennen und Inhalt vergleichen | Technisch nachgewiesen im Piloten, nicht historisch vollständig | `fib-u4-ris-pilot`, `ris-pdf-fingerprint.spec.ts`, `ris-pdf-change-check.spec.ts` |
| Veröffentlichungsansichten und Rückblickzeitfenster | Testabdeckung vorhanden | `ris-release-history.spec.ts`, `ris-window-scan.spec.ts`, `ris-coverage-verification.spec.ts` |
| Fehlerbehandlung und transaktionaler Wiederanlauf | Testabdeckung vorhanden | `ris-handler-fault-injection.spec.ts`, `ris-postgres-recovery.spec.ts` |
| Gleichzeitige automatische Aufrufe | PostgreSQL-Test vorhanden | `ris-postgres-advisory-lock.spec.ts` |
| Sitzung → verlinkte Vorlage/Dokumente | Teilnachweis: nur Linkbeziehung `page-link-only` | `u4-ris-link-evidence.ts`, `ris-evidence.spec.ts` |
| TOP → einzelne Vorlage und zugehörige Dokumente | Teilnachweis: konservativ nur bei einer Vorlage in derselben HTML-Zeile; unklare Zeilen werden nicht zugeordnet | `u4-ris-agenda-evidence.ts`, `ris-agenda-evidence.spec.ts` |
| Sitzung, TOP, Beschlussvorlage und tatsächlicher Beschluss als persistierte Fachobjekte | **Nicht nachgewiesen** durch die oben genannten Parser- und Monitor-Tests | Gesonderter Modell-/Persistenz-/Integrationstest erforderlich |
| Beschlussvorschlag vs. tatsächlicher Beschluss | **Nicht nachgewiesen**; Link bzw. PDF darf nicht automatisch als tatsächlicher Beschluss gelten | Differenzierte Status-/Dokumenttypen und reale Belegbeispiele erforderlich |
| Weitergabe an Fundstelle → Ereignis → Vorgang/Thema | **Nicht nachgewiesen** durch die untersuchten U4-Monitor-Tests | Schnittstellen- und End-to-End-Nachweis erforderlich |
| Vollständigkeit/Relevanz auf realem Referenzbestand | **Iterativ, nicht einmalig abnehmbar** | Blindtest und Fehlertrefferliste aufbauen |

**Strenge Regel:** Ein RIS-Dokumentfund oder eine Sitzungsverlinkung darf keinen
Beschluss, keine Abstimmung und keine TOP-Zuordnung ohne entsprechenden Beleg
behaupten. Presseberichte sind keine verlässliche Primärquelle für einzelne
Abstimmungsergebnisse.

## Gemeinde-Nachrichten – geprüfte Fähigkeiten und Grenzen

Der bestehende Pilot `fib-u4-pilot` ruft die Nachrichtenliste und verlinkte
Detailseiten ab, prüft HTML, bildet SHA-256-Fingerprints und schreibt
`fib.source_observations` und `fib.source_runs` transaktional. Die
MFA-/Adminprüfung ist im Edge-Handler vorgesehen.

- **Nachweisumfang:** Technisches Listing und Wiedererkennen einer Änderung.
- **Noch offen:** nachweisbar vollständige Archiv-/Paginierungsabdeckung,
  stabile Artikelmetadaten und Zuordnung in die geplante Fundstellenstruktur.
- **Nicht gleichsetzen:** `source_observations` sind zunächst
  technische Beobachtungen, keine vollständig redaktionell erschlossenen
  Fundstellen oder fertigen Meldungen.

## Verbindliche nächste Abnahmeprüfungen

1. Datenmodell in `main` gegen Kapitel 03/06 systematisch abgleichen:
   Fachobjekte Sitzung, TOP, Vorschlag, Beschluss, Fundstelle, Ereignis,
   Vorgang und Thema einschließlich Kardinalitäten und Herkunftsbelegen.
2. Tatsächliche RIS-Sitzung als reproduzierbare Fixture erfassen (z. B.
   29.10.2026), einschließlich TOP 2/3 und Dokumentlinks. Prüfung soll auch
   *nicht* veröffentlichte Beschlüsse korrekt als unbekannt markieren.
3. Persistenz- und Übergabetest: RIS-Seite → Sitzung/TOP/Vorlage/Beschlussstatus
   → Fundstelle → redaktionell auswählbares Ereignis, ohne automatisch
   Meldung, Vorgang oder Thema zu erfinden.
4. Gemeinde-Referenzbestand mit veröffentlichten Nachrichten, Updates,
   Archivfällen und Fehlertreffern erstellen.
5. Fachhandbuch Kapitel 03/06, Regeln, Datenmodell, Tests und Bedienoberfläche
   je Anforderung rückverfolgbar verbinden; widersprüchliche Aussagen
   korrigieren, nicht durch einen vermeintlichen „grünen Gesamtstatus“ verdecken.
6. Ergebnisübersicht im vorgesehenen Redaktionsmodell sichtbar machen,
   bevor eine fachliche Nutzerabnahme beansprucht wird.

**Abnahmeentscheidung:** Die technische Dokumentenüberwachung der beiden
Referenzquellen ist als *Teilfunktion* nachgewiesen. Die vollständige
fachliche Datenstruktur und ihre redaktionelle Weiterverarbeitung sind
damit **noch nicht abgenommen**. RIS-Cron/Secret/Aktivierung sind gesonderte
Betriebsfreigabepunkte; dieses Dokument aktiviert nichts.
