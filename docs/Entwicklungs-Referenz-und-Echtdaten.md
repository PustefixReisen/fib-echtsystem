# Entwicklungs-, Referenz- und Echtdaten – FIB Echtsystem

**Status:** Fachlich vereinbart am 15.10.2026. **Umsetzung:** nach redaktioneller Betriebsfähigkeit, soweit unten nicht bereits vorhanden.

## Verbindliche Umgebung

Der am 13.10.2026 vereinbarte Weg bleibt verbindlich: reguläre persönliche Erprobung auf
Shared-Apps im Schema `fib`, bestehende Benutzer/MFA, vorhandene Redaktion. Primärstelle:
[ADR-011](decisions/ADR-011-Shared-Apps-Schema-Isolation-und-pustivo-Betrieb.md).
Isolierte technische Tests ersetzen diesen persönlichen Zugang nicht.

## Fachlicher Testbestand seit RIS-Abnahme

**Stand 11.11.2026.** Sämtliche bisherigen fachlichen FIB-Daten gelten als Testdaten. Nach Prüfung ihrer Zugehörigkeit zu FIB dürfen sie kontrolliert zurückgesetzt oder neu aufgebaut werden. Sie sind kein dauerhaft aufzubewahrender Echtdatenbestand. Eine aufwendige Gesamtsicherung dieser fachlichen Testdaten ist dafür nicht erforderlich. Technische Wiederherstellbarkeit muss vor einer Bereitstellung sichergestellt sein.

Die Zuordnung über exakte Objekt-/Beziehungsmanifeste und die Prüfung fremder Referenzen bleiben wichtig. Authentifizierung, Zugangsdaten, gemeinsam genutzte Infrastruktur und Daten anderer Anwendungen in Shared-Apps, insbesondere Memorix, bleiben geschützt. Ein Reset benötigt seinen konkreten autorisierten Betriebsauftrag.

Die importierten RIS-Daten und ihre TOP-Ereignisse bleiben auch als Testdaten gemäß [Fachhandbuch Kapitel 07](fachhandbuch/07-Sitzungen-und-Beschluesse-Entwurf-2026-10-26.md) redaktionell unveränderlich. Die Berechtigung zu einem kontrollierten technischen Neuaufbau ist kein redaktionelles Bearbeitungsrecht.

## Begriffe und Trennung

| Bestand | Zweck | Sichtbarkeit | Bearbeitbarkeit |
| --- | --- | --- | --- |
| Entwicklungsdaten | Freie Erprobung aller redaktionellen Funktionen; auch bereits aus dem Demonstrator übernommene Beispiele | Normaler redaktioneller Arbeitsbereich | Nach Fachobjekt und FIB-Berechtigung. Importierte RIS-Daten bleiben schreibgeschützt. |
| Referenzdaten | Eingefrorener Demonstrator-Stand als Vergleichsgrundlage | **Nicht** in normalen Ereignis-, Fundstellen- oder Themenlisten; nur spätere getrennte Vergleichsansicht | Nein |
| Echtdaten | Regulär recherchierter, redaktionell geprüfter FIB-Bestand | Regulärer redaktioneller Arbeitsbereich | Ja, nach regulärem Workflow |

Die Herkunft aus dem Demonstrator macht bereits übernommene Entwicklungsdatensätze **nicht** zu unveränderlichen Referenzdaten. Redaktionell bearbeitbare Entwicklungsdaten dürfen im zulässigen Ablauf bearbeitet, verknüpft und bereinigt werden. Für importierte RIS-Daten gilt stattdessen der kontrollierte technische Neuaufbau. Technische Herkunftsinformationen bleiben unabhängig von der sichtbaren Titelanzeige nachvollziehbar.

## Referenz-Snapshot

- Vor dem Vergleich wird ein **versionierter, unveränderlicher Export** des Demonstrators mit den nötigen Fundstellen, Ereignissen, Beziehungen, Quellen und Datumsangaben erstellt und außerhalb des aktiven FIB-Redaktionsbestandes gesichert (z. B. als kontrolliertes GitHub-Artefakt).
- Referenzdaten werden **nicht** als zusätzliche operative Objekte ins Redaktionssystem importiert und stehen nicht für redaktionelle Schreibaktionen zur Verfügung.
- Der Snapshot muss nachvollziehbar datiert und anhand einer Prüfsumme identifizierbar sein. Datenschutz- und Lizenzfragen bei exportierten Inhalten sind vor der Ablage zu prüfen.
- Für die Trennung ist **keine zusätzliche Supabase-Instanz** vorgesehen. Bestehende Konten und Daten anderer Shared-Apps-Anwendungen, besonders Memorix, dürfen nicht berührt werden.

## Vorgehen zur Echtdatengewinnung

1. Zuerst die **redaktionelle Betriebsfähigkeit** von FIB fertigstellen: Recherche, Fundstellen- und Ereignisverwaltung, Vorgänge, Themen, Beziehungen, Prüfung, Freigabe und geeignete Anzeige.
2. Den vollständigen redaktionellen Ablauf mit veränderbaren Entwicklungsdaten prüfen. Kleine Recherchetests sind vorher erlaubt.
3. Einen eigenständigen Demonstrator-Referenz-Snapshot sichern.
4. Danach das zurückliegende Jahr nach den gültigen FIB-Regeln **unabhängig neu recherchieren**; der Demonstrator darf die Ergebnisse nicht als versteckte Recherchevorlage beeinflussen.
5. Neu erzeugte Fundstellenzuordnungen erhalten nachvollziehbare Begründungen. KI-Vorschläge dürfen möglichst im vorhandenen Rechercheaufruf erstellt werden, sind aber redaktionell zu prüfen. Bei unzureichender Quellenlage keine erfundene Begründung.
6. Vergleich auf Vollständigkeit, Relevanz, Ereignisbildung, fachliche Beziehungen und Nachvollziehbarkeit. Der Demonstrator ist Referenz, aber kein unfehlbarer Wahrheitsmaßstab.

## Umsetzung und Abgrenzung

Diese Dokumentation ist eine fachliche Entscheidung, **keine** Behauptung, dass Snapshot, Datenbestandstrennung, Qualitätsvergleich oder vollständige Jahresrecherche schon implementiert seien. Für den vorhandenen fachlichen Bestand gelten die vorstehenden Testdatenregeln und der RIS-Schreibschutz. Die Fachabnahme ist keine allgemeine Betriebs-/Sicherheitsfreigabe.
