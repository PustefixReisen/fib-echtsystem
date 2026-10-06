# ADR-005 – AI Tasks, Scheduler und Queue

## Status

**Entschieden** – 06.10.2026

## Kontext

FIB benötigt automatische Aufgaben wie Quellenbeobachtung, Quellenentdeckung, Rechercheläufe, periodische Qualitäts-/Kostenprüfungen und spätere Publikationsfolgeaufgaben.

Diese Aufgaben müssen auch dann nachvollziehbar bleiben, wenn ein externer Dienst kurzzeitig ausfällt oder ein einzelner Lauf fehlschlägt.

Ein einzelner lang laufender Serverprozess wäre für den MVP unnötig komplex und passt schlecht zu den Laufzeitgrenzen von serverlosen Funktionen.

## Entscheidung

Für den MVP verwendet FIB eine **Postgres-nahe, durable Jobarchitektur** auf Supabase-Basis:

```text
AI Task Definition
      ↓
Supabase Cron / fachlicher Trigger
      ↓
AITaskRun anlegen
      ↓
Job in durable Queue
      ↓
Edge-Function Worker
      ↓
FIB-Fachfunktionen / Recherche / KI-Router
      ↓
Ergebnis + Status + Kosten + Fehler
```

## 1. Scheduler

Zeitgesteuerte Aufgaben werden im MVP über Supabase Cron/`pg_cron` ausgelöst.

Der Scheduler führt nicht selbst die vollständige Recherche aus. Er erzeugt bzw. startet lediglich den fachlichen Run und stellt einen Job in die Queue.

Damit bleiben Zeitplanung und eigentliche Verarbeitung getrennt.

## 2. Durable Queue

Für asynchrone Arbeit wird eine persistente Queue verwendet, bevorzugt Supabase Queues/`pgmq`.

Gründe:

- Jobs gehen bei kurzzeitigem Worker-/Providerausfall nicht verloren,
- fehlgeschlagene Nachrichten können erneut verarbeitet werden,
- Verarbeitung ist unabhängig vom auslösenden Browser/Chat,
- geringe zusätzliche Infrastruktur,
- Queue liegt im bestehenden Postgres/Supabase-Betrieb.

Die Queue ist eine technische Transportkomponente. Fachlicher Zustand bleibt in `AITask`, `AITaskRun`, `Recherchelauf` und den jeweiligen Fachobjekten nachvollziehbar.

## 3. Worker

Ein Edge-Function-Worker liest Jobs aus der Queue und ruft ausschließlich freigegebene FIB-Fachfunktionen auf.

Der Worker:

- prüft Run-/Jobstatus,
- berücksichtigt Schutzklasse und Berechtigungen,
- verwendet den FIB-KI-Router für externe KI-Aufrufe,
- protokolliert Laufstatus, Kosten und Fehler,
- löscht/acknowledgt einen Queue-Job erst nach erfolgreicher Verarbeitung,
- darf keine S2-/S3-Aktion eigenmächtig ausführen.

## 4. Lange Aufgaben werden zerlegt

FIB behandelt längere Recherche-/KI-Prozesse nicht als einen einzigen ununterbrochenen Edge-Function-Lauf.

Stattdessen werden sie bei Bedarf in wiederaufnehmbare Schritte zerlegt, z. B.:

```text
Quellen finden
   ↓
Fundstellen prüfen
   ↓
Inhalte analysieren
   ↓
Kandidaten erzeugen
   ↓
Ergebnisse konsolidieren
```

Jeder Schritt kann seinen Zustand speichern und den nächsten Job erzeugen.

Das macht die Verarbeitung robuster gegenüber Laufzeitlimits, Netzfehlern und Providerproblemen.

## 5. Retry und Fehler

Es gilt:

- technische/transiente Fehler dürfen automatisch wiederholt werden,
- fachliche Ablehnungen oder Regelverletzungen werden nicht durch Retry umgangen,
- maximale Wiederholungen und Wartezeiten werden in G7 parametrisiert,
- dauerhaft fehlgeschlagene Runs erhalten einen sichtbaren Fehlerstatus,
- die Redaktion kann einen zulässigen Lauf erneut anstoßen.

## 6. Idempotenz

Ein erneuter technischer Versuch darf nicht unbeabsichtigt doppelte Ereignisse, Meldungen oder sonstige Fachobjekte erzeugen.

Deshalb erhalten Jobs/Run-Schritte eindeutige Identitäten und Fachfunktionen müssen Wiederholungen erkennen können.

## 7. Manuelle und ereignisgesteuerte Auslösung

Nicht jeder Run benötigt einen Zeitplan.

Dasselbe Queue-/Worker-Modell unterstützt:

- geplante Runs,
- manuell vom Redakteur gestartete Runs,
- Folgeaufträge aus einer offenen Frage,
- Rückblick nach neuem/geschärftem Thema,
- technische Folgejobs nach anderen fachlichen Aktionen.

## 8. Abgrenzung zu Background Tasks

Kurze technische Nebenarbeiten innerhalb einer Edge Function können als Background Task ausgeführt werden.

Fachlich wichtige oder wiederholbare Arbeit wird jedoch nicht ausschließlich an die Lebensdauer einer Function-Instanz gebunden, sondern als persistenter Run/Queue-Job geführt.

## 9. Externer Worker nur bei nachgewiesenem Bedarf

Ein eigener dauerhaft laufender Worker-/Serverdienst ist für den MVP nicht vorgesehen.

Er wird erst geprüft, wenn Pilotmessungen zeigen, dass:

- Laufzeit-/Ressourcenlimits regelmäßig nicht ausreichen,
- sehr lange Crawler-/Rechercheprozesse benötigt werden,
- Queue + Edge Functions unnötig komplexe Zerlegung erzwingen,
- oder Zuverlässigkeit/Kosten dadurch nachweislich besser werden.

## Folgen

### Vorteile

- robust gegen kurzzeitige Ausfälle,
- kein eigener Serverprozess im MVP,
- klare Trennung Scheduler/Run/Queue/Worker,
- Wiederholbarkeit und Auditierbarkeit,
- passt zu bestehendem Supabase-Kern,
- später erweiterbar.

### Nachteile

- mehr Zustandslogik als ein einfacher Cron-Aufruf,
- längere Aufgaben müssen ggf. in Schritte zerlegt werden,
- Queue-/Retry-Monitoring muss in G7 vorgesehen werden.

## Abgrenzung

Konkrete Cron-Zeiten, Retry-Zahlen, Queue-Aufbewahrung, Monitoring-Schwellen und Kostenlimits werden erst in G7 festgelegt.
