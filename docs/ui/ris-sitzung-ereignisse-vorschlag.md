# UI-Vorschlag – Sitzung und TOP: Ereignisse getrennt

**Stand:** 03.11.2026 · Issue #383 · Vorschlag zur persönlichen UI-Abnahme
**Gültige Fachregel:** Externe Presseberichte zur Gemeinderatssitzung werden **nur der Sitzung** zugeordnet; kein Pressebericht darf TOP-Status, Beschlusswortlaut oder Abstimmungsverhalten begründen.

## A. Sitzungsseite (unterhalb der Tagesordnung)

```text
Gemeinderat · 29.10.2026                       [Zurück zur Liste]
┌ RIS-Gesamtübersicht ────────────────────────────────────────────┐
│ ↗ Gemeinderat · 29.10.2026 · Tagesordnung (Original im RIS)    │
└─────────────────────────────────────────────────────────────────┘
┌ Tagesordnung ──────────────────────────────────────────────────┐
│ TOP 2 · Wegfall Elternbeitragszuschuss                   [→]  │
│    Vorlage 5395/2026                                           │
│ TOP 3 · Anpassung Kita-Beiträge                          [→]  │
│    Vorlage 5397/2026                                           │
└─────────────────────────────────────────────────────────────────┘
┌ Ereignisse zur Sitzung ───────────────── [Ereignis zuordnen] ──┐
│ Sitzung zusammengefasst / Presseberichterstattung  30.10. [→] │
│   Meldung: Bericht Gemeinderatssitzung                          │
│   Vorgang: Kita-Finanzierung · Thema: Bildung                   │
│                                                               │
│ Keine Zuordnung zu einem einzelnen TOP durch Pressebericht!   │
└─────────────────────────────────────────────────────────────────┘
```

- **Sitzung**: 0..n unabhängige Ereignisse, manuell pflegbar, künftig nur auf überprüfbarer Grundlage automatisch zuordenbar. Keine unmittelbare automatische TOP-Zuordnung.
- **Meldungen, Vorgänge, Themen** sind **nur abgeleitete Anzeigen** auf Grundlage bestätigter Beziehungen der Sitzungsereignisse. Keine zweite Pflege.
- Ereigniszuordnung nutzt den einheitlichen begrenzten Dialog mit fixierter Aktionsleiste; vorhandenes Ereignis wählen oder neues erstellen.
- Sitzung und Tagesordnung behalten alle bewährten RIS-Original-Links.

## B. TOP-Detailseite (Beispiel TOP 2)

```text
Gemeinderat · 29.10.2026     [Zurück zur Tagesordnung] [Liste]
┌ TOP 2 · Wegfall des Elternbeitragszuschusses ──────────────────┐
│ Niederschrift noch nicht verfügbar                             │
└─────────────────────────────────────────────────────────────────┘
┌ Beschlussvorschlag / Dokumente ────────────────────────────────┐
│ Beschlussvorlage 5395/2026   ↗ RIS-Original [Fundstelle öffnen] │
└─────────────────────────────────────────────────────────────────┘
┌ Ereignis zum TOP ──────────────────────── [Ereignis zuordnen] ─┐
│ Noch kein Hauptereignis ausgewählt.                            │
│ (Nach Zuordnung: EIN Ereignis anzeigen; entfernen/öffnen.)     │
└─────────────────────────────────────────────────────────────────┘
┌ Weitere Ereignisse zum TOP ────────────── [Ereignis zuordnen] ─┐
│ Bereits bestehendes fachlich verwandtes Ereignis        [→]   │
│ ...                                                           │
└─────────────────────────────────────────────────────────────────┘
```

- **Hauptereignis**: genau 0 oder 1 redaktionell ausgewähltes Ereignis. Kann aus dem TOP neu erstellt oder als bestehendes Ereignis zugeordnet werden. Keine automatisch erzeugte Beschlussbestätigung.
- **Weitere TOP-Ereignisse**: 0..n manuell zugeordnete fachliche Entwicklungen (nicht automatisch aus Presse oder Sitzung).
- Weitere Verfahrensereignisse zu Vorlage, Beschluss, Niederschrift bleiben fachlich eigenständig. Das Hauptereignis ersetzt sie nicht.

## C. Dialog – gemeinsamer Bedienablauf

```text
┌ Ereignis zum TOP zuordnen ────────────────────────────── (✕) ┐
│ Vorhandenes Ereignis suchen  [                         ][Suchen]│
│ ○ Ereignis 1                                                   │
│ ○ Ereignis 2                                                   │
│                ... eigener Scrollbereich ...                   │
├────────────────────────────────────────────────────────────────┤
│ [Zuordnen] [Neu: Ereignis] [Abbrechen]      immer sichtbar       │
└────────────────────────────────────────────────────────────────┘
```

Abbrechen aus der **Neuanlage** führt zur Auswahl zurück; aus der **Auswahl** führt es in die auslösende TOP- bzw. Sitzungsansicht. Speichern erzeugt das Ereignis und die bewusst ausgewählte Beziehung in einer Datenbanktransaktion.

## D. Rechte, Pflege und Nachvollziehbarkeit

- Rolle `main_event` am TOP mit Eindeutigkeit je TOP; getrennte bestehende Rolle `local_reference`.
- Sitzungsweite Zuordnungen in eigenständiger `fib.ris_session_events`-Tabelle; `origin` dokumentiert `manual` oder `automatic`. Im ersten Implementierungspaket gibt es **keine neue automatische Zuordnungsroutine**. Die fachlichen Kriterien für Automatik müssen vor Aktivierung messbar und nachgewiesen sein.
- Presseberichte werden nicht direkt einem TOP zugeordnet und haben niemals amtliche Beweiskraft.
- Automatische Ableitung der Anzeige `Meldungen/Vorgänge/Themen` beruht auf bestätigten Ereignisbeziehungen.
- Keine PDF-/Versionsfunktionen; die Rechteentscheidung aus #380 bleibt unverändert.

## Technischer Lieferumfang / Abnahme

- Additive, **noch nicht live angewandte** FIB-Migration.
- FIB-Redaktionsfunktion, Datenzugriffsaktion, UI mit separaten Sitzung-/TOP-Karten.
- Browser-, Rechte-, Integrations- und Wiederanlauftests; persönliche UI-Abnahme erst nach expliziter Freigabe und geplantem Deployment.
- Shared-Apps/Memorix/andere Funktionen unangetastet.
