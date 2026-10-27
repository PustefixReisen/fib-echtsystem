# PR #259 – Abschlussprüfung der dokumentarischen Konsolidierung

**Stand:** 26.10.2026 · **Ergebnis:** Elf Kapitel als durchgängiger Leseentwurf und die Bestandsregeln aus 03/06 als gruppierte Referenzen vorhanden. **Keine technische oder normative Gesamtabnahme. PR bleibt Draft.**

## 1. Was ist jetzt nachvollziehbar vorhanden?

| Gegenstand | Ergebnis | Quelle |
|---|---|---|
| Kapitel 01–11 | Elf zusammenhängende Leseentwürfe verlinkt | [Handbuch-Einstieg](README.md) |
| Recherche-Regelbestand | 53 Regeldefinitionen in der Referenz erfasst; weitere Ablaufregel im Original nachgewiesen | [Recherche-Regelreferenz](03-Recherche-Fachregelreferenz-Migration-2026-10-26.md) |
| Recherche-Sonderfall | **FIB-RECH-ABLAUF-001** in Kapitel 03 (Bestand), Zeile 487 als eigenständiger Regelabsatz gefunden; Referenzmigration noch ausstehend | [Quellstellenabgleich](PR259-Regelmigration-Quellstellenabgleich-2026-10-26.md) |
| Themen-Regelbestand | 32 eigenständig definierte Originalregeln textlich erfasst | [Themen-Regelreferenz](06-Themen-Fachregelreferenz-Migration-2026-10-26.md) |
| Fundstellensichtung | Keine generelle menschliche Pflicht-Einzelprüfung; stattdessen alle Fundstellen sichtbar, gezielte Prüfaufgaben | [Recherche-Neufassung §03.5a](03-Recherche-Neufassung-Entwurf-2026-10-26.md) |
| Themenfreigabe | Analysestand ohne Themenstatuswechsel; erste Beitragsfreigabe Entwurf → Aktiv; Veröffentlichung getrennt | [Themen-Neufassung §06.8a](06-Themen-und-Themenanalysen-Entwurf-2026-10-26.md) |
| Öffentliche Vorgänge | Eigener freizugebender Vorgangsbeitrag mit Erkenntnissen/Hintergründen; „Mehr wissen?“; Meldungsverdichtung unter „Neues“ | [Öffentliches FIB-Angebot](09-Oeffentliches-FIB-Angebot-Entwurf-2026-10-26.md) |

**Wichtig:** Der bisherige normative Regelbestand ist **noch nicht** durch diese neuen Texte abgelöst. Die 85 übernommenen Regeldefinitionen sind zum Prüfen gesichert, **nicht** vollständig gleichwertig als neue aktive Primärnorm freigegeben.

## 2. Abgleich der geänderten Fachregeln – keine stille Umdeutung

| Gegenstand | Alter Stand | Beschlossene Zielregel | Nachweis offen |
|---|---|---|---|
| FIB-RECH-SICHTUNG-001 | Jede unmittelbare Feldkirchen-Fundstelle redaktionell durchgehen | Sichtbarkeit sämtlicher Fundstellen; menschliche Pflichtprüfung nur bei erkennbarem Entscheidungsbedarf | Regelwortlaut in künftiger normativer Quelle ersetzen, abhängige Tests aktualisieren |
| Vorläufige Ereignisse | Kandidatenübergabe an Redaktion, verbindliche Bestätigung menschlich | KI darf vorläufige Ereignisse anlegen/weiterverarbeiten; bestätigte Daten geschützt | Datenmodell, S0/S1-Abgrenzung, RLS/Fachservice |
| Beobachtungsauftrag vor Themenfreigabe | Mindestens ein ausgewerteter Beobachtungsauftrag verpflichtend | Geprüfte Themenanalyse erforderlich; zusätzliche Recherche bedarfsabhängig | alle alten Normstellen/Testabhängigkeiten suchen und ablösen |
| Themeneditor | drei Arbeitsbereiche | vier Arbeitsbereiche: Definition, Bezüge, Analyse, Beitrag; keine vier Pflichtfreigaben | UI-Konzept/Implementierung prüfen |
| Analysefreigabe | keine getrennte Analysefreigabedimension im alten Themenstatus | Analysefreigabe ohne Statuswechsel; erste Beitragsfreigabe aktiviert | Versions-/Teilfreigabemodell und Rechte prüfen |
| Öffentlicher Vorgang | Vorgangsübersicht und Meldungsfolge | eigenständiger, freizugebender Vorgangsbeitrag inkl. Erkenntnisse | Daten-/Version-/Freigabe-/Publishmodell ergänzen |
| Mehr wissen? | primärer Kontext Meldung oder Thema | zusätzlich Vorgang; genau ein primärer Kontext je Frage | Bestandsmodell, Rechte und öffentliche UI ändern |

## 3. Konkrete fachliche Regressionstests

Die folgenden **prüfbaren Testszenarien** sind Abnahmeanforderungen, **keine bereits ausgeführten Tests**.

| ID | Szenario und erwartetes Ergebnis | Primärbereich |
|---|---|---|
| R01 | Neue direkte Feldkirchen-Fundstelle wird ohne manuelle Einzelbestätigung gespeichert, bleibt filterbar und auditierbar; KI-Einschätzung ändert ihren Prüfstatus nicht heimlich auf „Geprüft“. | 03 |
| R02 | Relevanter Widerspruch erzeugt eine begründete Prüfaufgabe; keine automatische finale Zurückstellung. | 03/08 |
| R03 | Technisch fehlgeschlagener RIS-Abruf wird als Abruffehler, **nicht** als „keine neue Entscheidung“, dokumentiert. | 03/07 |
| R04 | Identischer unveränderter Medienfund aus mehreren Suchläufen wird einmal geführt; eine relevante Korrektur wird als neue Fundstellenfassung nachvollziehbar. | 03 |
| R05 | Quellenstatus **Kandidat → Aktiv → Pausiert → Aktiv** ist bei berechtigter redaktioneller Entscheidung nachvollziehbar; „Pflichtquelle“ bleibt unabhängig. | 03/11 |
| R06 | Anteil ausschließlich mittelbarer neu veröffentlichter Beiträge wird über **90 Tage** korrekt berechnet; erst **über 30 %** Warnung, nie pauschale Publikationssperre. | 03/09/10 |
| R07 | KI legt vorläufiges Ereignis zu einer Fundstelle an, Redaktion muss nicht jedes Ereignis einzeln bestätigen; bereits bestätigtes Ereignis wird nicht still überschrieben. | 04/11 |
| R08 | Ereignisbezogene einmalige Nachfrage funktioniert ohne künstlichen dauerhaften Beobachtungsauftrag. | 03/04 |
| R09 | Neue Vorgangsanalyse entsteht zunächst aus vorhandenem Wissen; gezielte Recherche erst bei Wissenslücken. | 05 |
| R10 | Ein Thema erhält eine fachlich geprüfte Analyse **ohne ausgewerteten Beobachtungsauftrag**; Analysefreigabe belässt Status „Entwurf“. | 06 |
| R11 | Erst die Freigabe einer Themenbeitragsfassung führt **Entwurf → Aktiv**; die Veröffentlichung erfolgt nicht automatisch. | 06/08 |
| R12 | KI schlägt Thema-Bezug als Kandidat vor; „Bedeutung für das Thema“ wird erst nach redaktioneller Bestätigung verbindlich. | 06 |
| R13 | Eine freigegebene Themenbeitragsfassung bleibt unverändert sichtbar, wenn ein neuer Arbeitsentwurf angelegt wird; Öffnen allein erzeugt noch keine persistente Fassung. | 06/08 |
| R14 | Ein öffentlicher Vorgang zeigt eigenen **Vorgangsbeitrag** mit Hintergründen/Erkenntnissen und Meldungsverlauf, nicht bloß eine Meldungsliste. | 05/09 |
| R15 | „Mehr wissen?“ ist bei Meldung, Vorgang und Thema aufrufbar; Frage hat genau einen primären Kontext. | 09 |
| R16 | Drei aktuelle Meldungen eines Vorgangs können in „Neues“ verdichtet erscheinen; jede ist separat erreichbar. | 09 |
| R17 | RIS-Vorlage wird nicht als bereits gefasster Beschluss angezeigt; tatsächliches Ergebnis erfordert getrennten Nachweis. | 07/09 |
| R18 | Geplante Veröffentlichung prüft unmittelbar vor Ausführung erneut Freigabe, Rechte und harte Qualitätsbedingungen. | 08/10/11 |
| R19 | Eine unsichere KI-Plausibilitätswarnung kann begründet redaktionell beurteilt werden; belegter schwerwiegender Fehler verhindert Veröffentlichung. | 10 |
| R20 | In fremdgesperrtem Bearbeitungskontext bleibt die Ansicht lesbar, aber nicht überschreibbar; Admin-Entsperrung wird auditiert. | 08/11 |

## 4. Fachliche Abnahme und technische Abnahme sind getrennt

**Derzeit nicht belegt:**
1. Gesamter Quellabschnitts-Nachweis auch für Fachkonzept, Datenmodell, UX, RIS, Redaktion, Rollen/Rechte, Qualität und KI-Leitfaden; zwei bisherige Kapitel allein genügen nicht.
2. Vollständige Einzelregel-Harmonisierung einschließlich jetzt lokalisierter **FIB-RECH-ABLAUF-001** und der veränderten Pflichtsichtung.
3. **Erst nach der Fachkonzept-Abnahme:** Datenbankschema-, API- und Rechteabgleich in der iterativen Entwicklung.
4. **Erst nach der Fachkonzept-Abnahme:** UI-Abgleich und gemeinsame Erprobung; fachlich vereinbart sind Anforderungen, keine fertigen Screens.
5. **Erst bei der technischen Abnahme:** Regressionstests R01–R20 und bestehende Tests ausführen und protokollieren.
6. Fachliche Gesamtabnahme und Freigabe zur Ablösung alter Primärquellen; danach erst etwaige Umstellung auf nicht-Draft und Merge.

**Wichtig:** Die fachliche Abnahme des Handbuchs ist nicht von fertig implementierten Datenbank-, UI- oder Teständerungen abhängig. Die technische Abnahme folgt als eigener Meilenstein.

## 5. Überleitung in die Implementierung

Die nächsten Arbeitspakete sind (a) normativer Vollständigkeitsabgleich der alten Quellen, (b) Daten-/API-/RLS-Vertragsvergleich, (c) UI- und Freigabeimplementierung, (d) Regressionstests. Die beiden neuen Referenzdateien und alle elf Leseentwürfe sind der **konzeptionelle Ausgangspunkt**, nicht Beweis einer fertig geänderten Anwendung.

**Mergeentscheidung:** PR #259 als **Draft** belassen; alte Primärquellen nicht entfernen oder überschreiben.
