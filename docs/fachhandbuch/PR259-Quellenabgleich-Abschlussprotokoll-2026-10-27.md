# PR #259 – Quellenabgleich: geprüfter Abschlussstand

**Stand: 27.10.2026.** Gilt für den Entwurfsbranch von PR #259. **Dieses Protokoll ist eine überprüfbare Zwischenbilanz, keine Behauptung einer vollständig nachgewiesenen Normmigration oder einer erteilten Fachfreigabe.**

## Methode und Abgrenzung

Verglichen wurden die fachlichen Kapitelüberschriften und relevanten Originalregelpassagen der vorhandenen Primärdokumente mit der elfteiligen Lesefassung, den beiden inventarisierten Fachregelreferenzen und den vorhandenen Migrationsnachweisen. „Inhaltlich vorhanden“ bedeutet: Zieltext im neuen Fachkonzept auffindbar. Es bedeutet **nicht**, dass jede Ausnahme und jeder Wortlaut einzeln normativ freigegeben oder technisch getestet wurde.

Reine technische Details wie SQL, physische Schlüssel, RLS-Ausführung, UI-Komponenten oder Anbieterbetrieb werden nach fachlicher Entscheidung gesondert umgesetzt. Deren **fachliche Wirkung** muss trotzdem in den Kapiteln verständlich sein.

## Quellregister mit Abschnittszuordnung und Prüfstatus

| Primärquelle / zu prüfender fachlicher Bestandteil | Zielkapitel | Befund und noch fehlender Abschluss |
|---|---|---|
| [Fachkonzept](../Fachkonzept.md) §§1–3: Zweck, lokaler und regionaler Bezug | 01, 03 | Grundsätze lesbar abgebildet; Relevanz-Grenzfälle gegen 03er Originalregeln prüfen |
| Fachkonzept §§4–5: Inhaltstypen, politische Einordnung, Beziehungsmodell | 02, 04–09 | Objekte unterscheidbar; Definitionen und Ableitungsbeziehungen gegen Begriffsregister und Datenmodell abnehmen |
| Fachkonzept §§6–12: Recherche, Aktualität, öffentliche Zugänge, Suche, Redaktion, Transparenz | 03, 08–10 | Prozesse vorhanden; Detailanforderungen für Suche/Aktualität und öffentliche Darstellung prüfen |
| [Datenmodell](../Datenmodell.md) §§2–5: Ereignis, Meldung, Vorgang, Thema, Wirkungen, Fundstellen | 02, 04–06 | Kardinalitäten E→M 0..1 und V→E 1..n geklärt; Wirkung von übergreifender Analyseerkenntnis getrennt; übrige Beziehungen, Status und Ausnahmen noch nicht vollständig einzeln zertifiziert |
| Datenmodell §§6–9 und folgende: Beobachtung, Recherchelauf, Fragen, RIS, Rechtebezüge | 02–03, 07, 11 | Grundstruktur übernommen; individuelle Feld-/Übergangsinvarianten nicht vollständig normativ auditiert |
| [Begriffe](../Begriffe.md) §§2–4: Ereignis, Meldung, Vorgang, Thema, Bezug, Wirkung, Bewertung | 02, 05–06, 10 | Hauptabgrenzungen erläutert; Definitionen der Referenzmaßstäbe, Wertungsmerkmale und Fachlabels noch nicht vollständig gegen jeden Zieltext gegengezeichnet |
| Begriffe §§5 ff.: Recherche, Redaktion, KI, „Mehr wissen?“ | 03, 08–09, 11 | Fachrollen und Vertiefungsfunktion erläutert; vollständiger Glossarabgleich bleibt nötig |
| [Themen- und Vorgangslogik](../Themen-und-Vorgangslogik.md) §§2–12 | 05–06, 08 | Bottom-up-Erkennung, Themenkandidat, Bezüge, Perspektiven, Analyse/Beitrag enthalten; veraltete Editor-/Freigabeaussagen gegen jüngere F-03-Entscheidungen kennzeichnen |
| [Wirkungsmodell](../Wirkungsmodell.md) §§2–12 | 02, 05–06 | Ereignisanker für Fachobjekt Wirkung, Herkunftskontext und übergreifende Analyseerkenntnis abgegrenzt; Einzelaussagen zu Doppelzählung, Pflege und Historie noch nachzuweisen |
| [Recherche- und Quellenmonitor](../Recherche-und-Quellenmonitor.md) §§2–15 sowie Regeltests | 03, 10; RIS in 07 | Direktprüfung, Quellenentdeckung, erweiterter Suchraum, Fehler- und KI-Regellogik in 03; Original **dieses eigenständigen Dokuments** noch nicht Satz für Satz übernommen |
| [Bisheriges Handbuch 03](03-Recherche.md), 54 Originalkennungen | 03–04, 10–11 | 53 Kennungen in detaillierter [Regelreferenz](03-Recherche-Fachregelreferenz-Migration-2026-10-26.md) plus die am 27.10. ergänzte FIB-RECH-ABLAUF-001. Zielzuordnung vorhanden; normative Einzelabnahme offen |
| [Bisheriges Handbuch 06](06-Themen.md), 32 Originalkennungen | 06, 08, 11 | 32 Kennungen in [Regelreferenz](06-Themen-Fachregelreferenz-Migration-2026-10-26.md) mit Zielzuordnung. Einzelne Status-/Rechteausnahmen noch nicht normativ abgenommen |
| [Sitzungs- und Beschlussmodell](../Sitzungs-und-Beschlussmodell.md) §§2–10 | 07, 09 | Vorlage, Sitzung, TOP, Verfahrensschritte, Beschlussfassung und Niederschrift getrennt; vollständige Prüfung von TOP-Status, Fassungen, mehreren Abstimmungen und Nachweisregeln offen |
| [Redaktionsworkflow](../Redaktionsworkflow.md) §§2–11 und Folgeteile | 03–06, 08, 11 | Aufgaben, KI-Vorschläge, redaktionelle Bestätigungen und Sperren abgebildet; spezifische Entscheidungsmatrizen und Korrekturfälle noch im Einzelabgleich |
| [Fachliche Plausibilitäts- und Freigaberegeln](../Fachliche-Plausibilitaets-und-Freigaberegeln.md) §§2–9 | 08, 10–11 | Harte Invarianten von semantischen Hinweisen getrennt; Medienrechte, separate Bereitstellungszustände, S3 und Auditangaben erläutert; Detailcheck der harten Invarianten offen |
| [„Mehr wissen?“-Modell](../Mehr-wissen-Modell.md) §§2–10 | 09, 10–11 | Freigegebene Frage/Antwort und eindeutiger Primärkontext erklärt. **Absichtliche Fachänderung:** Vorgang als dritter Primärkontext. Weitere Status-/Versionsdetails prüfen |
| [UX- und Informationsarchitektur](../UX-und-Informationsarchitektur.md) §§2 ff. | 09; UI-Details später | „Neues“, „Im Blick“, Sitzungen, Suche, mobile Darstellung und Navigationswege im Grundsatz. Offene konkrete UI-Lösungen nicht als beschlossene Fachregeln ausgeben |
| [Rollen/Rechte/Workflow](../Rollen-Rechte-und-Workflow.md) §§2–10 | 08, 11 | Rollen, S0–S3, Federführung, Rechteentzug, MFA-Fachwirkung und Sperren abgebildet. **Absichtliche F-01-Abweichung:** S3 bei fassungs-/termingebundener Planung; alte universelle Unmittelbarkeit überholt. Vollständige Funktionsmatrix nicht einzeln abgenommen |
| Rollen/Rechte/Workflow §§11–13: RLS, Fachservices, Audits | 11 für Fachwirkungen; Technik gesondert | Rechte dürfen nicht durch technische Umgebung umgangen werden; konkrete Enforcement-Implementierung ist kein Bestandteil der Fachhandbuch-Leseabnahme |
| [Persistenz-/Lebenszyklusmodell](../Persistenz-und-Lebenszyklusmodell.md) §§2–12 | 02, 05–06, 09 | Identitäten, Beziehungen, Gesamtversionen, Archivierung erläutert; Einzelverträge der Status-/Beziehungshistorisierung offen |
| [Sprachleitfaden](../Sprachleitfaden.md) §§1–12 | 09–10 | Bürgernähe, klare Trennung von Tatsachen und Einordnung, fachlicher Roter Faden, respektvolle Wertungen eingeflossen; vollständige Detailkriterien nicht normativ gegengezeichnet |
| [KI-Leitfaden](../KI-Leitfaden.md) §§2–16 | 03–10 | KI als Vorbereitungsrolle, Quellenpflicht, Rückprüfung und Freigabegrenzen enthalten; detaillierter Prompt-/Arbeitsmodusabgleich bleibt offen |
| [KI-Qualität/Modellunabhängigkeit](../KI-Qualitaet-und-Modellunabhaengigkeit.md) §§2–10 | 03, 10; Routing später | Aufgabenspezifische Güte, Zwei-KI-Prinzip, 5-%-Kontrollstichprobe und Kosten nach Mindestqualität übernommen; Modellvergleichsausgestaltung erst im Betrieb |
| [Redaktionsnavigation](../Navigation-Inhalte-Redaktion-Recherche.md) | 08 und spätere UI | Fachliche Trennung internes Arbeits- und öffentliches Angebot berücksichtigt; konkrete Menü-/Screenentscheidungen nach Fachabnahme |
| [Visuelle Identität/Bildkonzept](../Visuelle-Identitaet-und-Bildkonzept.md) §14 | 08–10; Bildverwaltung später | Bildbibliothek, Einzelverwendung, Rechte und Öffentlichkeit berücksichtigt; komplette Rechte-/Statusfälle einzeln prüfen. Gestaltungsvorgaben bleiben in Designquelle |

## Verbindlich erkannte Normänderungen gegenüber Altquellen

1. **FIB-RECH-SICHTUNG-001:** Keine obligatorische menschliche Prüfung jedes örtlichen Funds. Alle Funde bleiben nachvollziehbar zugänglich; bei notwendiger Fachentscheidung gezielte Aufgabe. Die alte universelle Pflicht muss vor Normumschaltung ersetzt werden.
2. **F-01:** Nur terminierte Veröffentlichung einer bestimmten freigegebenen Fassung benötigt S3 bereits bei Planung; keine zweite manuelle Bestätigung am Termin, wohl aber aktuelle serverseitige Voraussetzungenprüfung. Alte pauschale S3-Regel §6.4 ist insoweit überholt.
3. **F-02:** Ein auch vorläufiger Vorgang braucht mindestens ein identifiziertes (ggf. selbst vorläufiges) Ereignis.
4. **F-03:** Angenommene Teiländerungen erzeugen einen neuen bestätigten Gesamtstand. Zurückgestellte/offene Vorschläge werden nicht hineingemischt.
5. **„Mehr wissen?“:** Neben Meldung/Thema ist nun auch der Vorgang primärer Kontext. Keine stille Gleichsetzung mit internen offenen Forschungsfragen.
6. **Themenprozess:** Kein zwingend vorangegangener Beobachtungsauftrag; vier fachliche Bearbeitungsbereiche statt altem dreiteiligen Editor; erste Beitragsfreigabe statt Analysefreigabe aktiviert den Themenentwurf.
7. **Öffentlicher Vorgang:** Eigener Vorgangsbeitrag getrennt von Verlauf und Meldungen; gesonderte Freigabe und Veröffentlichungsentscheidung.

## Was dokumentarisch noch nicht als erledigt bescheinigt werden darf

Die Zuordnung der Primärquellen und die ausführliche Gesamtlesefassung sind vorhanden. **Nicht abgeschlossen ist der beweisbare vollständige Einzelnorm-Abgleich** jeder oben beschriebenen Quellensektion gegen alle Zielbedingungen, Ausnahmen und Tests. Besonders zu sichern: Berechtigungsmatrix, TOP-Verfahrensvarianten, Medienstatusübergänge, Begriffs-/Wertungsregister, Quellenmonitor-Grenzfälle und Detailregeln des KI-Leitfadens.

Eine vollständige fachliche Abnahme setzt außerdem bereinigte Querverweise und redaktionelle Konsistenz der elf Detailkapitel voraus. Das PR bleibt Entwurf; es dürfen weder alte Primärquellen stillgelegt noch Code oder Shared-Apps als durch das Fachhandbuch bereits abgenommen ausgegeben werden.

## Fachlich noch echter Entscheidungsbedarf

Die konkreten Kriterien des **demokratisch-gesellschaftlichen Referenzrahmens** sind weiterhin nicht beschlossen. Sie dürfen weder als fertige Bewertungskriterien formuliert noch unbemerkt als KI-Norm aktiviert werden. Die früher als offen formulierten Fragen F-01 bis F-03 sind dagegen verbindlich entschieden.

## Abnahmepfad

Fachlich ist zunächst die Lesefassung mit den Vertiefungskapiteln gemeinsam zu prüfen. Vor normativer Ablösung der Altquellen folgt der belegbare Einzelregelabgleich (insbesondere markierte Lücken) und die dokumentierte fachliche Freigabe. Erst danach beginnt die iterative Umsetzung von Datenmodell, UI, Fachservices und technischen Tests. 

## Ergänzender Migrationsstand 28.10.2026

Die fachliche Lesedurchsicht der Kapitel 01–11 ist vom Auftraggeber abgeschlossen. Die daraus resultierenden neuen Entscheidungen und Korrekturen sind in den Kapitelentwürfen dokumentiert. Das neue [Kennungsregister mit 86 eindeutigen Bestandsregeln](PR259-Regelmigration-Kennungsregister-2026-10-28.md) stellt nun den gezählten Bestand der beiden bisherigen Regelkapitel und den Vorrang der neu beschlossenen Abweichungen nachvollziehbar dar. **Die Sicherung eines Wortlauts oder die Bestätigung des Fachkapitels ist kein Nachweis, dass jede Einzelregel inklusive aller Ausnahmen widerspruchsfrei migriert wurde.** Insbesondere bleibt die Gegenüberstellung der vier Statusbezeichnungen lokaler Themenbezüge fachlich/technisch zu klären, bevor die Altquelle abgelöst wird.

