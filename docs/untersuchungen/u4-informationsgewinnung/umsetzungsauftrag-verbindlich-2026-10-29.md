# U4 – Verbindlicher fachlicher Umsetzungsauftrag Informationsgewinnung

**Beschluss:** 29.10.2026. **Fachquelle:** [Kapitel 03](../../fachhandbuch/03-Recherche.md), §03.1a. **Status:** Für die kommende U4-Umsetzung verbindliche Anforderungen; noch nicht implementiert. Keine Festlegung von KI-Anbieter, technischem Feed-Parser oder produktiven Zugangsdaten.

## 1. Zwei Arbeitswege, eine gemeinsame Fundstellenverarbeitung

| | Definierte Quellen | Offene Suche |
|---|---|---|
| Grundprinzip | Alle Inhalte aus vereinbartem Quellen-/Rubrikscope entdecken, inklusive spät publizierter und später geänderter Einträge | Relevant Neues auch außerhalb des Pflichtquellenbestands entdecken |
| KI für Entdeckung | Nicht vorgeschaltet | Ja, für Erweiterung und bedarfsweise Vertiefung |
| KI für Inhalt | Relevanz, Sachverhalte, Beziehungen und Änderungen (RIS: ohne Aufnahmeselektion) | Relevanz und Zuordnung |
| Qualitätsziel | Technische Erfassungsabdeckung im vereinbarten Scope, Nachholbarkeit, Änderungserkennung und keine stillen Lücken | Relevante zusätzliche Fundstellen, Aufwand, Fehlfunde |
| Betriebslogik | Robuste inkrementelle Erfassung mit Überlappung/Nachlauf, Versionierung, Fehlerwarteschlange | Klassisches Suchraster + standardmäßige KI-Sucherweiterung + optionale mehrstufige Nachsuche |

## 2. Quellenmonitor: funktionale Anforderungen
- Für jede festgelegte Quelle den **tatsächlich erfassten Bereich** (Rubriken, lokale Ausgaben, RIS-Objektarten), Zugangsverfahren, Prüftakt, letzte erfolgreiche Prüfung, Nachholfenster, Fehler und unverfügbare Bereiche explizit verwalten. Die Vollständigkeit nicht pauschal für eine gesamte Zeitung beanspruchen, wenn nur bestimmte Rubriken zugänglich sind.
- Neue Einträge über stabile Kennungen/URLs plus kanonische Zuordnung und ggf. Inhaltsfingerabdruck erkennen; das Veröffentlichungsdatum nicht als alleinigen Cursor verwenden.
- Bei Ausfall die nicht bestätigten Zeiträume nachholen und verspätete Veröffentlichung oder Rückdatierung durch überlappende bzw. bestandorientierte Prüfungen erkennen.
- Bekannte Fundstellen nach definierter Relevanz-/Quellenregel gezielt auf Änderungen überwachen; inhaltlich unveränderte Fundstellen nicht nochmals mit KI bearbeiten.
- Neue und geänderte Fundstellen erst sichern, dann KI-Relevanzprüfung (nicht politisch eingeschränkt), Ereigniszuordnung und redaktionelle Vorschläge.
- RIS: sechs Objektklassen **Sitzung, TOP, Beschlussvorlage, Beschluss, Niederschrift, Anlage** vollständig im vereinbarten öffentlichen Scope einschließlich Nachträgen, Freigaben, Links und Versionen erfassen; keine automatische Ausfilterung per KI; Sitzung/TOP/Presse und Beschlussnachweis nicht vermengen.
- tz und Hallo München online als Pflichtquellen im Quellenregister berücksichtigen; die Testphase mit Gemeinde/RIS, Merkur und SZ begrenzt nicht den späteren Pflichtquellenumfang.

## 3. Offene Suche: fachlicher Suchalgorithmus
1. Klassische Suche mit gepflegtem dynamischen Recherchehorizont (Orte, allgemeine Felder, Beziehungen, Zeitfenster).
2. KI entwickelt **ergänzend** neue Suchrichtungen zu regionalen Einrichtungen, Fachquellen und funktionalen Bezügen; Ergebnisse werden erfasst und bewertet.
3. Mehrstufige KI-Nachsuche bei begründeten Lücken, widersprüchlichen Quellen und konkreten Recherchehinweisen, nicht automatisch bei jedem Lauf.
4. Ergebnisse mit dem Bestand aus der Quellenbeobachtung zusammenführen, Mehrfachfunde erhalten denselben Quellen-Nachweis; zusätzliche eigenständige Fundstellen gesondert ausweisen.
5. Suchlaufbericht dokumentiert Suchfenster, Zugänge, Suchanfragen, neue/relevante/fragliche Fundstellen und Fehler.

## 4. Abnahmefälle (für Implementierung)
| ID | Prüffall | Erwartung |
|---|---|---|
| U4-QM-01 | Neue Gemeinde-Nachricht ohne politischen Inhalt | Fundstelle wird erfasst und auf unmittelbaren Ortsbezug geprüft |
| U4-QM-02 | Artikel ist früher datiert, aber erst später online sichtbar | Erfassung trotz älteren Publikationsdatums |
| U4-QM-03 | Quellenabruf scheitert, nächster Lauf erfolgreich | Lücke und Nachholung sichtbar; keine stille Zeitlücke |
| U4-QM-04 | Bereits bekannte relevante Fundstelle erhält inhaltlichen Nachtrag | Neue Fassung erkannt, Bedeutung erneut bewertet, Originalfassung nachvollziehbar |
| U4-QM-05 | Unveränderter Artikel erneut im Feed | Kein doppelter Fund und kein unnötiger KI-Aufruf |
| U4-RIS-01 | Sitzung/TOP mit Vorlage und Anlage vor Sitzung | Alle Dokumente und Beziehungen erfasst, kein erfundener Beschluss |
| U4-RIS-02 | Niederschrift und Beschluss nach Sitzung veröffentlicht | Nachträglich zugeordnet, Beschluss nur mit geeignetem RIS-Beleg |
| U4-OS-01 | AFK-Information außerhalb vier Test-Pflichtquellen | Offene Suche kann Fachquelle als Fundstelle liefern |
| U4-OS-02 | Verkehrsumleitung in Nachbarort mit Feldkirchen als Umleitungsort | Begründeter indirekter Ortseinfluss erkannt |
| U4-OS-03 | Gleicher Sachverhalt in Merkur und SZ | Zwei Fundstellen, keine künstliche Verdoppelung des Ereignisses |
| U4-OS-04 | Anderes Feldkirchen (nicht bei München) | Nicht fälschlich als direkte Feldkirchen-Relevanz eingestuft |

## 5. Ausdrücklich später zu entscheiden
Modell und Anbieter (OpenAI/Anthropic/Mistral), Tarif-/Tokenverbrauch, KI-Kaskade, technische Abrufverfahren (RSS/HTML/RIS), Laufintervall, Wartungs- und Abrufkosten. Diese Entscheidungen sollen anhand protokollierter Echtmessungen erfolgen.

**Nicht mehr offen:** die grundsätzliche Trennung der beiden Wege, das Ziel vollständiger Quellenbeobachtung innerhalb expliziter Scopes, RIS-Aufnahme ohne KI-Filter und die kombinierte offene Suche.
