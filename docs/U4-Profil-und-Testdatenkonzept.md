# U4 – Persönliches Profil und kontrollierter Testdatenbetrieb

Status: Entwicklungskonzept vom 12.10.2026; ergänzt die bestehenden FIB-Primärdokumente, ohne diese zu ersetzen.

## Verbindliche Abgrenzung

Das Redaktionssystem setzt `docs/Redaktionssystem-UI-Konzept.md`, `docs/Datenmodell.md` und `docs/Persistenz-und-Lebenszyklusmodell.md` um. Fachlich bestätigte, wirksame Objekte bleiben historisiert und dürfen nicht regulär durch physisches Löschen verschwinden. Eine **rein technische, isolierte Testumgebung** ist von diesem Grundsatz getrennt; dort werden ausschließlich dafür erzeugte Fixture-Daten zurückgesetzt.

## U4a – „Mein Profil“

Einstieg im persönlichen Bereich **unten links** bei Name/Rolle, als Zahnrad mit beschriftetem Zugriff „Mein Profil“. Nicht unter Administration → Benutzer & Rollen; die Selbstverwaltung ist für Redakteure wie Admins verfügbar.

Persönliche Daten: voller Name und optionaler Rufname, beide im FIB-Mitgliedsprofil `fib.app_users`; aktueller Anmeldename (E-Mail) wird zunächst nur angezeigt. Role und Aktivstatus sind ausschließlich lesbar. Änderungen erfolgen nur für den angemeldeten `auth.uid()`-Benutzer über eine Backend-Funktion mit echter Auth-Tokenprüfung, nachgewiesenem MFA-AAL2 und aktiver FIB-Mitgliedschaft. Kein beliebiger `user_id`-Parameter, kein direkter Clientzugriff auf Datenbank-Verwaltungsrechte. Nach erfolgreichem Speichern werden Profilanzeige und Personennamen ohne erneuten Login aktualisiert. Eingaben werden validiert und begrenzt, Namen dürfen nicht leer sein.

**Passwort ändern:** mittels Supabase Auth unter bestehender Sitzung und erforderlicher erneuter Bestätigung nach den aktuellen Auth-Sicherheitsregeln; weder Passwort noch Wiederholungswert werden in FIB-Datenbank, Protokollen oder Fehlermeldungen gespeichert.

**MFA verwalten:** verifizierte Faktoren anzeigen, neuen TOTP-Faktor einrichten und prüfen, alten Faktor erst nach erfolgreicher Verifikation des neuen Faktors entfernen. Bei Auth-Sicherheitsgrenzen gegebenenfalls neue Anmeldung/erneute MFA verlangen. Nie ohne aktuell bestätigte Authentisierung den letzten verifizierten Faktor entfernen und Benutzer dadurch ungeschützt oder ausgesperrt zurücklassen. Wiederherstellung bei Geräteverlust als separater administrativ gesicherter Ablauf; kein „MFA deaktivieren“-Knopf.

Erster vertikaler Slice: Profil öffnen → eigenen Rufnamen bearbeiten → speichern → in Navigation und Koordination neuen Rufnamen sehen. Danach als gesondert überprüfter Security-Slice Passwort und TOTP-Wechsel.

## U4b – Repräsentative Testdaten aus dem Demonstrator

**Nicht** direkt den gesamten Demonstratorbestand als vermeintlich bestätigte Produktivdaten importieren. Stattdessen zusammenhängende, quellenbelegte Fallgruppen auswählen: Hundewiese, Autobahnkreuz München-Ost, Parkraumkonzept, Tempo 30 B471 und autonomes Fahren. Demonstrator-Inhalte sind Fixture-Ausgangsmaterial, kein automatisch freigegebener Echtbestand. Die jeweiligen Quelllinks, zeitlichen Beziehungen, fachlichen Freigabestufen und Aussagen müssen bei der Übertragung dem aktuellen Echtsystem-Datenmodell entsprechen.

### Sicherheits- und Bereinigungsregeln

1. Bevorzugt **eigenständiges Supabase-Testprojekt** mit getrennten Auth-/DB- und Storage-Ressourcen. Ein anderer Frontend-Pfad (`/redaktion-preview/`) alleine ist **keine Datenisolation**; aktuell verwendet diese Vorschau noch dieselbe Supabase-Instanz wie die Produktion.
2. Bis zur Trennung: kein Massenimport und kein pauschales Bereinigungskommando auf Shared-Apps. Aktuellen Live-Testdatensatz und Benutzerkonto nicht per „Alle Testdaten löschen“ erfassen.
3. Fixtures bekommen eine technisch nachweisbare Importlauf-Kennung (z. B. `fixture_batch_id`) in einem eigenen technischen Verwaltungsnachweis. Auch die **Identitäten aller erzeugten Objekte und Beziehungen** werden erfasst; eine bloße Bezeichnung oder Titelpräfix ist kein sicherer Löschfilter.
4. Die Bereinigung arbeitet auf **exakter Liste selbst erzeugter IDs** und überprüft sämtliche referenziellen Abhängigkeiten. Vor tatsächlichem Entfernen gibt es eine Vorschau der Anzahl und Objekttypen und eine ausdrückliche Bestätigung.
5. Der Löschvorgang ist nur in klar ausgewiesener Testumgebung erlaubt; selbst dort nur für die identifizierten Fixture-IDs. Fachlich bestätigte Echtdaten und Benutzer-/Rollen-/Auditdaten sind ausgeschlossen. Keine generischen `DELETE FROM fib.events`-Operationen oder Kaskaden über nicht markierte Echtobjekte.
6. Import ist idempotent oder kann kontrolliert zurückgerollt werden. Test des kompletten Zyklus: leer → Import → Bearbeiten/Verknüpfen → Bestandsprüfung → Reset → nur Fixtures verschwunden.
7. Testdatensätze und echte redaktionelle Bearbeitungen dürfen nicht ohne klaren Migrationsentscheid ineinander übergehen. Ein „Übernehmen in Echtbestand“ braucht einen eigenen fachlichen Prüf- und Freigabeprozess.

### Geplante Umsetzung

- T1: Ist-Datenmodell und Quellenbestand des Demonstrators erfassen; die minimale vollständige Fixture-Struktur pro Beispiel definieren.
- T2: Isoliertes Testbackend und Preview-Konfiguration realisieren; keine produktive Vermischung.
- T3: Gesicherten Import samt nachvollziehbarem Batch-Manifest entwickeln.
- T4: Administrator-Funktion „Testdaten verwalten“ mit Bestandsübersicht, Dry-Run und gezielter Bereinigung.
- T5: Import/Bearbeitung/Bereinigung gemeinsam am Datenbestand testen.

## Nach U4: Menünavigation Funde und Ereignisse

Den Einstieg **Recherche → Funde** sowie **Ereignisse** im redaktionellen Objekt- und Prüfablauf anschließend mit dem Nutzer besprechen. Vorab keine neue Menüstruktur festlegen: Funde haben bereits einen vorgesehenen Recherchepfad und Ereignisse sind als eigene Fachobjekte definiert; ihre endgültige Navigationsposition bleibt eine gemeinsame UI-Entscheidung.
