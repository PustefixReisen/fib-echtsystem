# Administratorgesteuerte Einladung – FIB-Redaktionszugang

**Entscheidungsstand:** 15.10.2026, fachlich vereinbart. **Implementierungsstand:** Zielkonzept, noch nicht vollständig umgesetzt.

## Grundsatz
Zugang zum FIB-Redaktionssystem erfolgt **ausschließlich auf Einladung eines dazu berechtigten FIB-Administrators**. Es gibt keine öffentliche Selbstregistrierung und keinen öffentlichen Antrag auf redaktionelle Freischaltung. Kenntnis der URL berechtigt weder zur Registrierung für FIB noch zur Mitgliedschaft.

## Soll-Ablauf
1. Ein Administrator legt im FIB-Administrationsbereich die eingeladene Person mit **Name, E-Mail-Adresse und vorgesehener FIB-Rolle** an. Nur FIB-berechtigte Administrierende dürfen Einladungen auslösen.
2. Das System versendet eine personenbezogene, zeitlich begrenzte Einladung. Einladungsstatus und erneuter Versand werden nachvollziehbar angezeigt.
3. Die eingeladene Person akzeptiert den Link, legt selbst ein Passwort fest und richtet verpflichtend MFA/TOTP ein.
4. Erst nach erfolgreich geprüfter Identität, abgeschlossenem Setup und administrativ autorisierter Rollenfestlegung wird die FIB-Mitgliedschaft aktiviert. Ein eigenständiger zweiter Freigabeschritt ist im Regelfall nicht erforderlich.
5. Einladungen können ablaufen oder administrativ zurückgezogen werden. Doppelte Einladungen und E-Mail-Konflikte müssen sicher behandelt werden.

## Sicherheitsgrenzen
- **Supabase Auth ist nicht gleich FIB-Mitgliedschaft.** Authentifiziert sein allein gewährt keinerlei FIB-Redaktionsrechte.
- Keine Rollenvergabe aus URL-Parametern, unbestätigten Browserzuständen oder selbst setzbaren Nutzermetadaten.
- Bestehende Anforderungen an serverseitige Mitgliedschaftsprüfung, MFA/AAL2, Audit und Bearbeitungssperren bleiben gültig.
- Supabase-Projekt `Shared-Apps` wird auch von Memorix verwendet: **keine ungeprüfte globale Abschaltung der Supabase-Sign-ups**, keine neuen weitreichenden Schlüssel/Administratoren, keine Beeinträchtigung anderer Anwendungen.
- Auch wenn Shared-Apps technisch Supabase-Auth-Konten anderer Herkunft kennt, akzeptiert FIB nur nachweislich administrativ autorisierte Mitglieder.

## Verhältnis zu PR #74
PR #74 enthält die sichere Annahme von Einladungen, erste Passwortfestlegung und MFA-Schritte. Die neue Entscheidung betrifft insbesondere den **administrativen Initiierungsweg**, die Benutzerverwaltung und die fachliche Aktivierung nach Einladungsannahme.

PR #74 bleibt bis zur ausstehenden Sicherheitsabnahme **offen**. Die Entscheidung wird als separate Aufgabe umgesetzt; vor einem Merge ist die sichere Vereinbarkeit mit dem neuen Einladungsverfahren und dem aktuellen `main` nachzuweisen. Ohne diese Integrationsprüfung keine Freigabe.

## Offene technische Prüfung
- Konkretes Rechte-/Rollenmodell für das Erstellen, Zurückziehen und Wiederholen von Einladungen.
- Robustheit für Personen, die bereits ein Auth-Konto bei Shared-Apps besitzen.
- Serverseitige Freigabegrenzen und Statuswechsel, zeitliche Gültigkeit, Audit, Fehlerbehandlung.
- End-to-End-Prüfung einschließlich Negativfällen und Schutz anderer Shared-Apps-Anwendungen.

Dieser Beschluss ist **noch keine implementierte, getestete oder produktiv freigegebene Einladungssperre**.
