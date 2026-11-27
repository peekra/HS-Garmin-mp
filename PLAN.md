# Plan: geplante Änderungen am Demo-Shop

Stand 27.11.2026. **A1 bis A4 sind umgesetzt und im Browser geprüft (27.11.2026).** Offen ist nur, was der User
selbst macht (siehe unten), und der Testkauf. Neue Wünsche aus dem Chat kommen in diese Datei.

## Ziel

- Besucher finden die Testkarte auf der Seite.
- Besucher geben keine echten Namen und Daten ein.
- Vor dem Kauf bestätigt der Besucher die Datenschutzerklärung mit einem Haken.

## Grenze (wichtig)

Der Hinweis „keine echten Daten“ verringert die Datenmenge. **Er nimmt dem Anbieter die Verantwortung für den
Datenschutz nicht ab.** Der Hoster sieht weiterhin die IP-Adresse. Besucher können trotz Hinweis echte Daten
eingeben. Die Seite darf deshalb keinen Haftungsausschluss versprechen. Das ist keine Rechtsberatung.

Alles dient einer Studienarbeit an der THA (User, 27.11.2026). Ob das für eine öffentlich erreichbare Seite etwas
an den Pflichten ändert, ist nicht geprüft. Das mit der Lehrperson klären.

## A1: Testkarte in „Fragen“ (`demo/index.html`, Abschnitt `#fragen`)

Neuer Eintrag direkt nach „Ist das ein echter Shop?“:

- Frage: „Mit welcher Karte bezahle ich?“
- Antwort: Testkarte `4242 4242 4242 4242`, Ablaufdatum `06/32`, CVC `123`. „Gib keine echte Karte ein.“
- Quelle (vor der Umsetzung erneut prüfen): https://docs.dodopayments.com/miscellaneous/testing-process

## A2: Hinweis „keine echten Daten“

- In „Fragen“ und direkt bei beiden Kauf-Buttons.
- Textvorschlag: „Testmodus: Gib keinen echten Namen, keine echte Adresse und keine echten Kartendaten ein.
  Nutze erfundene Angaben.“
- Folge: Mit erfundener E-Mail-Adresse kommt keine E-Mail an. Diese Texte anpassen: „per E-Mail kommt er auch“
  (Preisbereich), Schritt „Schlüssel kopieren“, Frage „Ich habe meinen Schlüssel verloren“, `erfolg.html` und
  `erfolg.js`.
- Offen: Ob der Dodo-Checkout eine erfundene E-Mail-Adresse annimmt, ist nicht geprüft.

## A3: Haken vor dem Kauf (`demo/index.html`, `demo/app.js`, `demo/style.css`)

- Ein Haken je Kauf-Button (zwei Stellen). Er ist beim Laden leer.
- Textvorschlag: „Ich habe die [Datenschutzerklärung](datenschutz.html) gelesen. Ich verwende nur Testdaten.“
- Ohne Haken führt „Buy now“ nicht zu Dodo. Ein Klick zeigt einen kurzen Hinweis.
- Mit Tastatur und Screenreader bedienbar.
- Die Seite speichert den Haken nicht.
- Grenze: Wer den Payment Link direkt öffnet, umgeht den Haken. Das lässt sich ohne Server nicht verhindern.

## A4: `demo/datenschutz.html` ausbauen

„Die Datei aufbauen“ meint die Datenschutzerklärung (User, 27.11.2026).

- Neuer Abschnitt „Testmodus: keine echten Daten“.
- Abschnitt 4 um den Haken ergänzen.
- Die übrigen Texte prüfen. Nichts erfinden.

## Das macht der User selbst

Die persönlichen Angaben trägt der User selbst in die Dateien ein, nicht über den Chat (User, 27.11.2026).

Erledigt am 27.11.2026: Alle Platzhalter sind gefüllt. Der User hat die E-Mail-Adresse und die KI-Werkzeuge
(Claude, Gemini) genannt und den Vorschlägen zugestimmt: Hosting nach Art. 6 Abs. 1 lit. f DSGVO (Speicherdauer
legt GitHub fest), Löschung der Aktivierung per E-Mail im Dodo-Dashboard. Keine Aufsichtsbehörde genannt (User), das allgemeine
Beschwerderecht bleibt im Text. Das Impressum
bleibt kurz: Studienprojekt der THA, ohne Name und Anschrift. Prüfen: Lehrperson.

## Entscheidungen zum Haken (User, 27.11.2026)

- Der Haken bestätigt die Datenschutzerklärung und die Nutzung von Testdaten.
- Er bestätigt **nicht** die Nutzungsbedingungen. Der vorhandene Link „Es gelten die Nutzungsbedingungen“ bleibt.

## Prüfung nach der Umsetzung

- Ohne Haken: kein Weg zu Dodo über beide Buttons (Maus und Tastatur).
- Mit Haken: Der Link führt zum Checkout, `redirect_url` ist korrekt.
- Haken wieder entfernt: Der Button ist wieder gesperrt.
- Nach „Zurück“ im Browser passen Haken und Button zusammen.
- Handybreite 360 px, keine Konsolenfehler.
- Testkauf mit Testkarte (führt der User aus).

## B: Hell/Dunkel, DE/EN, Schnee, Watch-Face-Karten, Board, neue Bilder (umgesetzt 27.11.2026)

Entscheidungen und Umfang: siehe CLAUDE.md, Abschnitt „Erweiterung (User, 27.11.2026)“. Im Browser geprüft:
Dunkel/Hell × DE/EN, 360 px und 1024 px ohne waagerechtes Scrollen, Wahl bleibt über Seiten und Neuladen, Seite läuft
mit gesperrtem Speicher, alle Fälle von `erfolg.html` auf Englisch (Sprachwechsel behält die Schlüssel), Haken-Sperre
an beiden Kauf-Buttons, Store-Knopf mit Testwert sichtbar und ohne Wert unsichtbar, Szenenauswahl (25 Kacheln,
Band bleibt beim Scrollen oben), keine Anfragen an fremde Server.

Offen (User):
- Store-Link von GasDefizit XMas in `demo/config.js` bei `STORE_URL` eintragen, dann erscheint der Knopf.
- Nach dem Push prüfen, ob die Link-Vorschau das neue Bild zeigt (Messenger speichern alte Vorschauen zwischen).
