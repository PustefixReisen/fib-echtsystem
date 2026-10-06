# ADR-006 – Authentifizierung und Rechtearchitektur

## Status

Angenommen – 06.10.2026

## Kontext

FIB benötigt keine Besucher-Konten. Authentifizierung ist ausschließlich für Redaktion und Administration erforderlich. Die fachlichen Rollen Besucher, Redakteur und Admin sowie die Aktionsstufen S0–S3 sind bereits in G3 fachlich festgelegt. G5 muss daraus eine technische Architektur ableiten, ohne die fachliche Rollenlogik neu zu definieren.

Zugleich gilt aus der Zielarchitektur:

- reguläre fachliche Zugriffe laufen über die gemeinsame Fachfunktions-/Service-Schicht,
- Supabase/PostgreSQL ist der strukturierte Kern,
- öffentliche Besucher erhalten keinen regulären direkten Zugriff auf FIB-Fachtabellen,
- RLS dient als zusätzliche technische Schutzschicht,
- K2/K3-Daten benötigen besonderen Schutz.

Supabase Auth unterstützt JWT-basierte Authentifizierung, RLS und MFA. Supabase weist darauf hin, dass RLS in exponierten Schemas aktiviert werden muss, dass `user_metadata` nicht für Sicherheitsentscheidungen verwendet werden darf und dass privilegierte Schlüssel niemals im Browser liegen dürfen.

## Entscheidung

### 1. Keine Besucher-Konten im MVP

Die öffentliche FIB-Seite bleibt ohne Anmeldung nutzbar. Besucher greifen auf den veröffentlichten statischen K0-Stand zu und erhalten keinen Auth-Zugang zur FIB-Datenbank.

Damit besteht die technische Benutzerverwaltung im MVP nur aus:

- Redakteuren,
- Admins.

### 2. Supabase Auth als Identitätsdienst

Supabase Auth wird für Redakteur- und Admin-Anmeldung verwendet.

Konten werden nicht durch offene Selbstregistrierung erzeugt. Sie werden administrativ eingerichtet/eingeladen und anschließend einer fachlichen Rolle zugeordnet.

### 3. Rolle nicht aus frei änderbaren Benutzerdaten ableiten

Fachliche Berechtigungen dürfen nicht aus vom Benutzer selbst veränderbaren Profil-/`user_metadata`-Feldern abgeleitet werden.

Die verbindliche fachliche Rolle wird serverseitig verwaltet, vorzugsweise in einer FIB-eigenen Benutzer-/Rollenzuordnung. Für technische Beschleunigung dürfen nicht benutzeränderbare Claims bzw. `app_metadata` verwendet werden; die serverseitige Fachprüfung bleibt maßgeblich.

### 4. Fachservice bleibt primäre Autorisierungsinstanz

Bei jeder fachlich wirksamen Aktion prüft der Fachservice mindestens:

1. gültige authentifizierte Identität,
2. aktive Benutzer-/Rollenzuordnung,
3. fachliche Berechtigung für die aufgerufene Fachfunktion,
4. Objektzustand und Schutzklasse,
5. erforderliche Bestätigung bei S2/S3,
6. optimistic version check bzw. vergleichbaren Konfliktschutz,
7. Auditierbarkeit der Aktion.

Die Benutzeroberfläche darf Bedienoptionen ausblenden, aber die eigentliche Berechtigungsprüfung erfolgt serverseitig.

### 5. RLS als Defense in Depth

RLS wird als zusätzliche Sicherheitsbarriere verwendet und ersetzt die Fachservices nicht.

Grundsätze:

- RLS auf allen über die Supabase Data API erreichbaren FIB-Tabellen,
- Least Privilege,
- keine pauschale Freigabe allein aufgrund `authenticated`,
- keine fachlichen Schreibrechte für `anon`,
- öffentliche Besucher benötigen grundsätzlich keinen Data-API-Zugriff auf FIB-Fachtabellen,
- Views und Funktionen werden so angelegt, dass RLS nicht unbeabsichtigt umgangen wird,
- `SECURITY DEFINER` nur in begründeten Ausnahmefällen und nicht als allgemeiner Ausweg bei Berechtigungsproblemen.

Die konkrete Policy-Matrix wird in G6 aus Rollen, Aktionen und Schutzklassen abgeleitet.

### 6. Privilegierte Schlüssel nur serverseitig

Service-/Secret-Schlüssel und sonstige K3-Zugangsdaten:

- niemals im Browser,
- niemals im öffentlichen Build,
- niemals in Chat-/KI-Kontexten,
- nur in geeigneter Server-/Secret-Infrastruktur.

Wo ein Fachservice mit erhöhten technischen Rechten arbeiten muss, muss er die fachliche Identität, Rolle und Aktion selbst strikt prüfen und auditieren. Ein privilegierter Schlüssel ist niemals selbst eine fachliche Berechtigung.

### 7. MFA-fähige Architektur

Die Redaktionsanmeldung muss technisch MFA unterstützen.

Für das MVP gilt als Architekturvorgabe:

- MFA muss für Admin-Konten durchsetzbar sein,
- für Redakteure muss MFA technisch unterstützt und in G6/G7 verbindlich geregelt werden,
- besonders kritische administrative bzw. sicherheitsrelevante Aktionen können zusätzlich einen aktuellen MFA-gestützten Sitzungsstatus verlangen.

Die konkrete Bedien- und Einführungsregel wird in G6/G7 festgelegt. Supabase unterstützt hierfür Authenticator-App/TOTP und Authenticator Assurance Levels (`aal1`/`aal2`).

### 8. Entzug von Rechten

Beim Ausscheiden oder Rollenentzug gilt:

- Fachrolle sofort deaktivieren,
- weitere fachliche Aktionen serverseitig blockieren,
- aktive Sessions bei Bedarf widerrufen bzw. für sensitive Aktionen gegen die aktuelle Session-/Rollengültigkeit prüfen,
- Audit-Historie bleibt unabhängig vom weiterhin aktiven Benutzerkonto nachvollziehbar.

Kurzlebige JWTs dürfen nicht dazu führen, dass ein Rollenentzug längere Zeit fachlich unwirksam bleibt. Die aktuelle serverseitige Rollenzuordnung bleibt deshalb maßgeblich für S2/S3 und sensible Zugriffe.

### 9. AI Tasks sind keine menschlichen Benutzer

AI Tasks erhalten keine menschliche Redakteur-/Adminrolle. Sie werden als technische Akteure mit explizit erlaubten Fachfunktionen ausgeführt.

Sie dürfen insbesondere nicht:

- S2/S3-Rechte aus menschlichen Rollen erben,
- Veröffentlichung selbst bestätigen,
- Benutzer/Rollen verwalten,
- Schutzklassengrenzen umgehen.

## Folgen

- Besucheroberfläche bleibt technisch einfacher und datensparsamer.
- Die eigentliche Autorisierung liegt zentral in den Fachservices.
- RLS schützt zusätzlich gegen Fehlkonfigurationen und unerwartete Zugriffspfade.
- Rollenänderungen müssen nicht allein auf möglicherweise veraltete JWT-Claims vertrauen.
- G6 kann auf einer klaren technischen Grundlage die konkrete Policy-/Rechtematrix ausarbeiten.
- MFA wird vorbereitet, ohne in G5 bereits alle Bedienregeln festzuschreiben.

## Übergabe an G6/G7

G6 legt insbesondere fest:

- konkrete Zuordnung der Fachfunktionen zu Redakteur/Admin,
- RLS-/Policy-Matrix je Datenbereich,
- S2-/S3-Bestätigungsabläufe,
- MFA-Pflicht je Rolle/Aktion,
- Adminworkflow für Konten und Rollen.

G7 legt insbesondere fest:

- Session-/Logout-/Widerrufsregeln,
- Recovery-/MFA-Betriebsverfahren,
- technische Kontenprüfung und regelmäßige Rechteprüfung.
