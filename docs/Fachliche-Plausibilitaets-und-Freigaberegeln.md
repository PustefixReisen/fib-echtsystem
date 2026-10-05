# Fachliche Plausibilitäts- und Freigaberegeln – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 05.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche fachliche Primärquelle für die Unterscheidung zwischen **blockierenden Fachregeln** und **unterstützenden Plausibilitätsprüfungen** sowie für die fachliche Freigabelogik öffentlich bereitgestellter Dateien und Bilder.

Es definiert keine Datenbankfelder und keine technische Rechteverwaltung. Diese werden später aus den hier festgelegten fachlichen Zuständen und Regeln abgeleitet.

## 2. Zwei Arten von Prüfregeln

FIB unterscheidet verbindlich:

### 2.1 Harte fachliche Invarianten

Eine harte Invariante beschreibt einen Zustand, der fachlich nicht zulässig ist. Eine Fachfunktion darf die Änderung nicht wirksam speichern oder veröffentlichen, solange die Verletzung besteht.

Typische Fälle sind insbesondere:

- fehlende Berechtigung oder erforderliche Bestätigung,
- unzulässiger Objektstatus oder Statusübergang,
- Verletzung einer festgelegten Kardinalität,
- Veröffentlichung ohne erforderliche Freigabe,
- öffentliche Tatsachenbehauptung ohne erforderliche Quellenbasis,
- öffentliche Datei-/Bildnutzung ohne geklärtes Nutzungsrecht,
- konkurrierende Änderung bei veraltetem Objektstand,
- Aktivierung eines Referenzmaßstabs mit ungelöstem Widerspruch zum aktiven Referenzrahmen.

> **Harte Invarianten werden serverseitig durchgesetzt und können nicht durch ein KI-Modell überstimmt werden.**

### 2.2 Semantische Plausibilitätsprüfungen

Eine Plausibilitätsprüfung erkennt fachlich auffällige, widersprüchliche, redundante oder ungewöhnliche Konstellationen, bei denen mehrere sachlich vertretbare Entscheidungen möglich sein können.

Typische Fälle sind insbesondere:

- mögliche Dublette von Ereignis, Vorgang, Thema oder Wirkung,
- mehrere plausible Zuordnungen,
- auffällige Kombination strukturierter Bewertungswerte,
- widersprüchliche Wirkungen oder Quellen,
- ungewöhnliche Themenabgrenzung,
- unsichere TOP-/Ereignis- oder Beschlusspunkt-Zuordnung,
- möglicher Widerspruch oder Überlappung eines vorgeschlagenen Referenzmaßstabs.

Eine Plausibilitätsprüfung erzeugt grundsätzlich einen **sichtbaren Prüfhinweis** und verhindert automatische fachliche Übernahme, wenn die Entscheidung nicht eindeutig ist. Sie ersetzt aber keine redaktionelle Entscheidung.

## 3. Entscheidungsregel

> **Deterministisch feststehende fachliche Unzulässigkeit = blockierende Regel. Semantische Auffälligkeit mit möglichem Entscheidungsspielraum = Plausibilitätsprüfung mit redaktioneller Entscheidung.**

Kann eine bisher semantische Regel später zuverlässig deterministisch formuliert werden, soll sie in eine harte Geschäftsregel überführt werden.

## 4. Verhältnis zur KI

Die KI darf:

- Auffälligkeiten erkennen,
- Konflikte und Dubletten begründen,
- Lösungsvorschläge machen,
- Unsicherheit ausweisen.

Die KI darf nicht:

- harte Invarianten umgehen,
- bei mehrdeutiger Plausibilitätsprüfung stillschweigend eine fachlich wirksame Entscheidung treffen,
- fehlende Rechte oder Quellen durch eigene Annahmen ersetzen.

## 5. Öffentliche Bereitstellung von Dateien

Für eine in FIB gespeicherte Fundstelle/Datei sind mindestens folgende fachlichen Zustände unterscheidbar:

- **nur redaktionell** – interne Nutzung zulässig, keine öffentliche Bereitstellung über FIB,
- **öffentlich freigabefähig** – Nutzungsrecht bzw. Bereitstellungsbefugnis ist geklärt; Veröffentlichung ist noch nicht erfolgt,
- **öffentlich bereitgestellt** – Datei ist über FIB öffentlich verfügbar,
- **öffentliche Bereitstellung gesperrt/zurückgezogen** – öffentliche Nutzung ist nicht mehr zulässig oder wurde redaktionell beendet.

Zusätzlich muss der Rechte-/Klärungsstand erkennbar sein. Für das MVP genügt fachlich mindestens:

- `geklärt / öffentliche Nutzung zulässig`,
- `ungeklärt`,
- `öffentliche Nutzung nicht zulässig`.

> **Nur ein geklärter positiver Rechtezustand erlaubt die öffentliche Bereitstellung über FIB.**

Eine ursprünglich öffentlich im Internet verfügbare Datei ist dadurch nicht automatisch zur erneuten öffentlichen Bereitstellung durch FIB freigegeben.

## 6. Öffentliche Verwendung von Bildern

Für Bilder gilt derselbe Grundsatz, erweitert um gegebenenfalls erforderliche Urheber-, Lizenz-, Datenschutz- und Persönlichkeitsrechte.

Eine konkrete öffentliche Bildverwendung ist nur zulässig, wenn:

- das Asset selbst für die beabsichtigte Nutzung rechtlich freigegeben ist,
- die konkrete Bildverwendung fachlich passend bestätigt ist,
- erforderliche Urheber-/Lizenzangaben vorhanden sind,
- gegebenenfalls notwendige Datenschutz-/Persönlichkeitsrechtsprüfung positiv abgeschlossen ist.

`Bild` und `Bildverwendung` bleiben getrennt: Ein grundsätzlich nutzbares Bild ist nicht automatisch für jeden FIB-Inhalt fachlich passend.

## 7. Freigabestufe

Die erstmalige öffentliche Bereitstellung einer Datei oder konkrete öffentliche Bildverwendung ist eine **S3-Aktion** und benötigt die allgemeinen unmittelbaren Bestätigungs- und serverseitigen Revalidierungsregeln.

Interne Erfassung oder Rechteklärung ohne öffentliche Wirkung bleibt je nach Aktion S1 oder S2.

## 8. Audit und Änderung

Bei Freigabe, Sperrung oder Rücknahme öffentlicher Mediennutzung muss nachvollziehbar bleiben:

- wer entschieden hat,
- welcher Rechte-/Freigabestand zugrunde lag,
- wann die Änderung erfolgte,
- welches Objekt bzw. welche konkrete Verwendung betroffen war,
- warum eine frühere öffentliche Nutzung gegebenenfalls beendet wurde.

## 9. Verbindliche Kurzregel

> **FIB blockiert objektiv unzulässige Zustände serverseitig. Semantische Auffälligkeiten werden sichtbar gemacht und redaktionell entschieden. Dateien und Bilder werden nur öffentlich bereitgestellt, wenn die dafür erforderlichen Rechte positiv geklärt und die konkrete Nutzung freigegeben sind.**

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 05.10.2026 | Im G3-Gesamtaudit blockierende Fachregeln von semantischen Plausibilitätsprüfungen abgegrenzt sowie Mindestlogik für Rechte- und öffentliche Freigabestatus von Dateien und Bildern verbindlich festgelegt. |
