# U4 – Einmaliger, getrennter Suchstrategien-Vergleich

**Status: Testwerkzeug bereitgestellt, Live-Durchlauf nicht gestartet.** Dieses Testwerkzeug verändert weder FIB-Anwendung noch Supabase.

Verglichen werden drei Strategien mit jeweils zehn Suchmaschinen-Anfragen und zwei Wiederholungen:
- **A klassisch:** zehn feste Anfragen.
- **B KI-Suchplan:** zehn vorab von einem Modell generierte Anfragen.
- **C mehrstufige KI:** drei Anfangsanfragen, dann drei und vier aus Ergebnissen desselben Arms weiterentwickelte Anfragen.

Die Suchmaschine ist für alle drei Strategien dieselbe (Google über Serper), ebenso das OpenAI-Modell für B/C. Ergebnisse und Referenzliste der jeweils anderen Strategie werden dem Modell nicht übergeben. A/B/C laufen dennoch nacheinander, sodass zeitliche Indexänderungen möglich sind.

## Voraussetzungen

Python 3.9+, zwei **gesonderte** API-Schlüssel: `OPENAI_API_KEY` und `SERPER_API_KEY`. Der Suchdienst Serper ist nicht im OpenAI-Abonnement enthalten; seine Preiskonditionen vorab prüfen. Bevor die Schlüssel angelegt und freigegeben sind, erzeugt das Werkzeug **keine** Kosten.

Schlüssel ausschließlich lokal als Umgebungsvariablen oder in gesicherten GitHub-Secrets verwenden, **nie** ins Repository, Chat oder Log schreiben.

## Ausführung

```bash
python tools/u4-search-benchmark/benchmark.py --dry-run
export OPENAI_API_KEY='...'
export SERPER_API_KEY='...'
python tools/u4-search-benchmark/benchmark.py resultate-u4
```

Erwarteter Bedarf: **60 Suchabfragen und acht Modellaufrufe** (2 × [B:1 + C:3]). Dies sind Testannahmen, **keine bereits gemessenen API-Kosten**. Die Resultate enthalten Roh-URLs, Titel, Suchsnippets, Positionen, Zeitpunkte und Tokenverbrauch. Keine Ergebnisse automatisch öffentlich committen.

## Auswertung und Abnahme

Der bisherige Referenzbestand enthält nur neun unvollständig geprüfte URL-Kandidaten. Für eine belastbare Ergebnisquote müssen vor einem Live-Durchlauf URL-genaue, im Veröffentlichungsfenster 01.–28.10.2026 tatsächlich erschienene relevante **zusätzliche Quellen** bestätigt und als vorher festgelegter Referenzbestand gespeichert werden. Veröffentlichungen der definierten Pflichtquellen separat auswerten.

Aus den Rohdaten: gefundene Referenz-URLs, neue Fundstellen, mögliche Dubletten, falsche Orte, falsch datierte Veröffentlichungen und belegbare indirekte Bezüge unabhängig prüfen. Reine URL-Wiederfindung ist **keine** absolute Internet-Vollständigkeit. Die reine Suchtreffer-Anzahl ist noch keine Relevanzquote.

**Einschränkung:** Dieser Lauf verwendet die OpenAI-API für die Query-Planung und Serper für die Suche. Er ist nicht über ChatGPT-Plus finanziert. Die Modelle Anthropic und Mistral werden erst in einem späteren, separaten Qualitäts-/Kostenvergleich betrachtet. Kein Mehrtages-Paralleltest notwendig.

**Bisheriger Teststand:** Der Code für getrennte Suchläufe liegt im Repository. Ohne die API-Zugänge wurde noch kein reproduzierbarer Live-Vergleich ausgeführt, deshalb gibt es auch keine verlässliche Siegerstrategie.
