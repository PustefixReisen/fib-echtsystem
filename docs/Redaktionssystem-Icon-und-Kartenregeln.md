# Redaktionssystem – UI-Slice: Symbole, Aktionen und Kartenkopfzeilen

Status: **fachliche Gestaltungsentscheidungen bestätigt am 12.10.2026**; technische Umsetzung und sichtbare Abnahme ausstehend.

## Geltungsbereich und Abgrenzung

Dieses Dokument konkretisiert `docs/Redaktionssystem-UI-Konzept.md` und ersetzt weder dessen Informationsarchitektur noch Fach- und Datenmodell. Symbole visualisieren bestehende Fachobjekte, Funktionsbereiche und Aktionen; sie erzeugen keine neue fachliche Zuordnung oder zweite Wahrheit.

## Drei klar getrennte Symbolklassen

1. **Fachobjekte:** Ein verbindliches Grundsymbol pro Objekttyp, konsistent in Navigation, Listen, Detailüberschriften und verlinkten Objektbezügen. Verbindliche Bestandsassets: `meldung.svg` (Zeitung), `vorgang.svg` (Zeitung mit Uhr), `thema.svg` (Netzwerk) und das freigegebene Sitzungs-Icon. Öffentliche Navigations-Icons ersetzen diese internen Objektsymbole nicht.
2. **Funktionsbereiche:** Bestehende `redaktion-*.svg`-Assets für Dashboard, Arbeitskorb, Auswertung, Veröffentlichung und Administration. `redaktion-arbeitskorb.svg` ist **nicht** automatisch das Icon für „Meine Aufgaben“; Arbeitskorb und persönliche Aufgaben sind fachlich verschieden.
3. **Aktionen:** Einheitliche Aktionssymbole für wiederkehrende Befehle, unabhängig vom Objekttyp.

## Ereignis-Icon

Unter `assets/brand/icons/` existierte am 12.10.2026 noch **kein** Ereignis-Icon. Ein neues `ereignis.svg` wird im vorhandenen FIB-Stil gestaltet: einfaches dunkelgrünes Kalenderblatt mit gut erkennbarem kräftiggelbem Ereignispunkt und dezentem hellem Hof („Leuchten“); **keine Animation**. Lesbarkeit bei 16–20 px und Kontrast in hellen sowie leicht getönten Kopfbereichen sind Pflicht. Ereignisse erhalten **nicht** das Meldungs-/Zeitungssymbol.

Das Ereignissymbol steht vor dem Objekttitel (z. B. „FIB Live-Testereignis“), in Ereignislisten und bei Ereignisbezügen. Innenkarten „Ereignisdaten“ oder „Redaktionelle Koordination“ erhalten nicht erneut ein Fachobjektsymbol.

## Karten und Hierarchie

- **Variante A verbindlich:** Kartenkopfzeile mit dezent hellgrünem Hintergrund, dunkelgrüner, gegenüber dem Karteninhalt hervorgehobener Überschrift, klarer Trennung und einheitlichem Abstand.
- Kopfleiste links: Kartentitel; rechts optional die zugehörige Aktion (z. B. „Bearbeiten“).
- Karteninhalt bleibt ruhig und gut lesbar; Fußbereich nur bei tatsächlich notwendigen übergreifenden Aktionen.
- Nicht jede Karte erhält ein eigenes Symbol; Symbole kennzeichnen vorrangig die Fachobjekt-Ebene darüber oder eindeutig wiederkehrende Aktionen.

## Aktionssymbole

| Aktion | Symbol | Darstellung |
| --- | --- | --- |
| Öffnen / Detail | Pfeil nach rechts oben | mit Text oder kompakter Icon-Button |
| Bearbeiten | Bleistift | mit Text oder kompakter Icon-Button |
| Speichern | Diskette | **mit Text** |
| Löschen | Papierkorb | mit Text in kritischem Kontext; immer Schutzabfrage |
| Aktualisieren | Kreispfeil | mit Text oder kompakt |
| Zurück | Linkspfeil | mit Text |
| Suchen | Lupe | bestehendes Symbol |
| Filtern | Trichter | Text bei Bedarf |
| Informationen | Eingekreistes „i“ | Icon-Button mit Tooltip |
| Bestätigen | Häkchen | mit Text |
| Mein Profil | Zahnrad | im Benutzerbereich unten in Primärnavigation |
| Meine Aufgaben | Checkliste mit Häkchen | Kopfzeile, später mit **echter** persönlicher Aufgabenanzahl |
| Benachrichtigungen | Glocke | reserviert für **echte** Benachrichtigungen |

**Regel:** Beschriftete Aktionsbuttons enthalten im Regelfall auch das zugehörige Symbol. Für bewusst kurze Listen-/Toolbar-Aktionen darf der Text entfallen, *wenn* Icon und Kontext eindeutig sind; dann sind Tooltip, `aria-label`, Tastaturfokus und ausreichend große Klick-/Touchfläche verpflichtend. „Abbrechen“ sowie einfache Auswahlhandlungen dürfen reine Textbuttons sein. Keine uneinheitlichen Alternativicons für dieselbe Aktion.

## Kopfzeile und Benutzerbereich

- FIB-Logo und Titel „Redaktionssystem“ stehen visuell zusammen; der Titel ist klarer und prominenter als bislang.
- Unten links bleibt die Benutzeridentität mit Rufname, Rolle und Abmelden; „Mein Profil“ ist per Zahnrad erreichbar (späterer funktionaler Slice).
- Profil-Stammdaten stammen aus `fib.app_users`, Authentifizierung, Passwort und MFA aus Supabase Auth. Keine Schatten-Benutzerverwaltung.
- Persönliche Aufgaben und Benachrichtigungen bleiben getrennte Begriffe. Eine Zahl bei „Meine Aufgaben“ darf erst erscheinen, wenn die bestehende Aufgabenlogik eine **tatsächlich zugeordnete offene Arbeitsmenge** berechnet. Kein erfundener Zähler, kein Rückgriff auf bloße Federführungen.

## Umsetzung und Abnahme

Erster visueller UI-Slice: vorhandene Icons in der Navigation nutzen, Ereignis-Icon ergänzen, Kopfzeilen Variante A, Aktionsicons und kompakteres Branding. Änderungen an `App.tsx` auf offenen PR #65 abstimmen; keine Überschreibung seines Dashboard-Refreshs. Profilbearbeitung und echte Aufgabenindikatoren erhalten eigene spätere vertikale Slices.

**Freigabegrenze:** Dieser Text dokumentiert abgestimmte Gestaltungsregeln. Produktiv-Merge und Bereitstellung der anwenderwirksamen UI erfolgen erst nach Sichtprüfung und ausdrücklicher Freigabe.
