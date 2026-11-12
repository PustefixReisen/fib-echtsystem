# Mistral-Adapter für gemeinsame Fundstellenabstracts – technisch vorbereitet, gesperrt

**Issue #440 · Stand 12.11.2026 · keine Real-KI-Freigabe**

Das neue Modul `supabase/functions/_shared/finding-abstract-mistral.ts` ergänzt die gemeinsame Pipeline um einen **nur bei gesonderter technischer und fachlicher Freigabe nutzbaren** Provider-Adapter. Er enthält keine API-Zugangsdaten, Netzwerkbibliothek, Endpunktbereitstellung, Worker-Aktivierung oder persistente Budgetverwaltung.

### Technischer Vertrag

- Grundlage: Mistral Chat Completions `POST /v1/chat/completions` mit `response_format: {type:'json_object'}`; kein Streaming, kein Toolaufruf, maximale Ausgabelänge und strukturierte Pflichtfelder. Die Adapterantwort wird **erneut** gegen den vorhandenen FIB-Fundstellenabstract-Vertrag und Quellen-/TOP-Grenzen geprüft. Antworten werden ohne Belege verworfen.
- Vor dem ersten externen Aufruf müssen *vier* unabhängige Schalter freigegeben sein: `enabled`, `operatorApproved`, `privacyApproved` und `rightsApproved`; zusätzlich braucht es den externen Rechtemechanismus der gemeinsamen Pipeline. Die Schalter sind **keine** eigenständige Rechteentscheidung; eine echte Quelle benötigt einen konkreten rechtlichen und datenschutzrechtlichen Verarbeitungsnachweis.
- Tokenpreise und Modellkennung werden nur aus **geprüfter Betreiberkonfiguration** übernommen; keine veralteten Preise im Code hinterlegt. Der Pilot besitzt einen maximalen kumulativen EUR-Gegenwert von **500 Cent** (5 €).
- **Wichtig: Der Adapter implementiert keine transaktionssichere Budgetverwaltung.** Er verlangt ein externes `BudgetGate.reserve(key,maxCents)`, das über alle Worker hinweg atomar den verbleibenden Rahmen inklusive bereits reservierter oder ungeklärter Beträge prüft. Ein späterer Live-Budgetdienst muss einen stabilen, über alle Wiederholungen identischen Reservierungsschlüssel anhand Quellenfassung, TOP-Scope, Modell-/Prompt-Version und Vorgang erzeugen und durchsetzen; Wiederholung nach unbekanntem Transaktionsausgang darf nicht erneut berechnet werden.
- Bei gemeldeter Nutzung: Kosten trotz später fehlerhafter JSON-Inhalte verbindlich berücksichtigen. Bei unklarem Provider-Ausgang: Reservierung **nicht** freigeben, sondern gesondert mit Provider-/Rechnungsdaten abgleichen. Keine automatische Wiederholung kostenpflichtiger Requests.
- Vor einem echten Pilot muss das Limitverfahren auch seltene Token-/Preisabweichungen, Providerfehler, Reservierungsabläufe und Abbruch zwischen API-Aufruf und Abrechnung sicher behandeln; die derzeitige Tokenabschätzung ist nur eine zusätzliche Vorabgrenze und **keine harte Garantie tatsächlicher Providerkosten**.
- Das Prompt bezeichnet Quellentext als untrusted data, verlangt Quellenbelege und erzeugt keine bestätigten Beziehungen. Prompting allein beweist keine faktische Richtigkeit: Seiten-/Spannenbelege und konkrete Aussagen benötigen noch eine nachgelagerte Textverifikation.

### Verifikation

`node --import tsx tests/ris-analysis/mistral-adapter.spec.mts` über den bestehenden Analysis-CI-Workflow, ausschließlich mit **simuliertem Transport**. Prüft: Standard-Sperre, unabhängige Freigaben, Budgetreservierung vor Sendung, Kosten trotz ungültiger Antwort, unbekannte Gebühren, strukturierte Antwort, Beleg-/TOP-Schutz und unzulässige Publikationsfreigaben. **Keine Verbindung zur Mistral-API.**

### Betreiberfreigabe vor jedem realen Aufruf – noch offen

1. Quellenspezifische Rechte-, Veröffentlichungs- und TDM-Prüfung, Personendaten-/Datenminimierungsregeln.
2. Aktuelle Mistral-Verträge (AVV/DPA), Unterauftragsverarbeiter, Serverstandorte, Lösch-/Retention-Regeln, Freigabe für externe Übermittlung.
3. Explizite Modell-, Schema-/Prompt- und Tokenpreisfreigabe inklusive Währungsumrechnung und Echtkostenkontrolle.
4. Transaktionssicherer Datenbank-Budgetdienst, Reservierungs-/Idempotenzprotokoll und Kostenreconciliation.
5. Fachlicher Abnahmetest mit erlaubtem, repräsentativem Quellenmaterial und einem Belegprüfer. Erst danach eigene Freigabe für einen streng begrenzten Pilot.

**Sicherheit:** Der Code enthält keine aktive Netzwerkschnittstelle, keine API-Schlüssel, keine Gebührenbelastung und keine Änderung am Supabase-Echtsystem. Die bestehenden RIS-Fakten-/Abstimmungsregeln bleiben unverändert.

**Dokumentation Mistral:** https://docs.mistral.ai/api ; https://docs.mistral.ai/inference/conversations/structured-output/json_mode ; https://mistral.ai/pricing/api/
