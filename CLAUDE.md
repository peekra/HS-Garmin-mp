# CLAUDE.md – Demo-Shop „GasDefizit XMas“

Statische Demo-Webseite für eine Studentenarbeit (THA Augsburg, „Design und Implementierung e-Shop“). Sie verkauft
die Freischaltung der Watch-Face **GasDefizit XMas** (Projekt `../Weinachten_GasDefizit`). Bezahlt wird über
**Dodo Payments im Testmodus**. Wenn etwas hier nicht geregelt ist: den User fragen, nichts erfinden.

Sprache: Kommunikation, diese Datei und die Webseite **Deutsch**; Code-Kommentare und Commits Englisch.
Eigenes lokales Git (Branch `main`, kein Remote, kein Push). Veröffentlichen auf GitHub macht der User.

## Ablauf

1. `demo/index.html`: Produktseite mit Vorschau, Funktionen, Preis, Button „Buy now“ = Link auf den Dodo Payment Link.
2. Dodo leitet nach der Zahlung auf `demo/erfolg.html` weiter (`redirect_url`).
3. `erfolg.html` liest `license_key` (bei mehreren durch Komma getrennt) und `status` aus der Adresse, zeigt den
   Schlüssel mit „Schlüssel kopieren“ und erklärt die nächsten Schritte.

## Vorgaben (User, 27.11.2026)

- Nur HTML, CSS, JavaScript. Kein Server, kein Build, keine API-Schlüssel im Code.
- GitHub Pages, Ordner `/demo`, relative Links im Shop. Ausnahme: `og:image`/`og:url` mit voller Adresse
  `https://peekra.github.io/HS-Garmin-mp/demo/…` (sonst laden manche Dienste die Vorschau nicht).
- Payment Link als **eine Konstante oben in `demo/config.js`** (`PAYMENT_LINK`).
- Mobil lesbar. Seit 27.11.2026 im **CodeBear-Stil** (User): Logo und Tokens aus
  `../../Garmin Dashboard` (Grafit, Körnung, Big Shoulders Display, Instrument Sans, JetBrains Mono).
  **Hauptfarbe ist das Logo-Orange `#ff4d0a`** (User, 27.11.2026), nicht das Grün `#c8f53c` des Dashboards.
  Vorherige Fassung „Winternacht“: Tag `design-winternacht`.
- Auf jeder Seite: **„Testmodus, kein echter Shop“**.
- `datenschutz.html` mit Entwurfstext, Abschnitt Watch-Face (`#watch-face`) und Impressum (`#impressum`). Anbieter
  **CodeBear**. Impressum **kurz** als Studienprojekt der THA: Projektname, Hochschule, Kontakt-E-Mail (vom User, 27.11.2026). Bilder laut User mit Claude und Gemini erzeugt.
  Kein Name, keine Anschrift (User, 27.11.2026). Ob das reicht, klärt der User mit der Lehrperson.
- `nutzungsbedingungen.html` (seit Watch-Face 1.1.0): Leistung, 2 Aktivierungen, Erstattung (`#erstattung`, Testmodus),
  Lizenz (`#lizenz`, proprietär, Bilder KI-erzeugt). Im Footer jeder Seite verlinkt. Datenschutz und Nutzungsbedingungen
  sind der Link für den Connect-IQ-Store-Eintrag.
- Preis: **2,49 € (Demo)** (User, 27.11.2026, ersetzt 2,49 USD). Schlüssel gilt für **2 Aktivierungen** (Activations Limit im
  Dodo-Dashboard); auch Neuinstallation und Beta verbrauchen je eine.
- **Nur Testdaten** (User, 27.11.2026): Testkarte von Dodo (`4242 4242 4242 4242`, `06/32`, CVC `123`) in „Fragen“,
  in der Preiskarte, auf `erfolg.html` (fehlgeschlagen) und in `datenschutz.html#testmodus`. Hinweis: keine echten
  Namen und Daten. Mit erfundener E-Mail kommt keine E-Mail, die Texte sagen „Schlüssel sofort kopieren“.
  Der Hinweis nimmt dem Anbieter die Verantwortung für den Datenschutz **nicht** ab (dem User gesagt).
- **Haken vor dem Kauf** (User, 27.11.2026): je Kauf-Button ein Haken „Datenschutzerklärung gelesen, nur Testdaten“
  (`data-consent`, `app.js` `setupConsent`). Ohne Haken zeigt der Button auf `#kaufen` und meldet den Hinweis. Nicht
  gespeichert, nicht gesendet. Der direkte Payment Link umgeht ihn (ohne Server nicht zu verhindern).
- `erfolg.html` zeigt **nur den Dodo-Schlüssel**. Der feste Code der Watch-Face steht **nirgends** auf der Webseite.
- Schriften und Bären-Logo selbst gehostet (`demo/assets/fonts/`, OFL; `demo/assets/img/brand/`), keine Anfragen an fremde Server außer dem Dodo-Checkout.

## Erweiterung (User, 27.11.2026, Plan freigegeben)

- **Hell- und Dunkelmodus** wie im Garmin Dashboard (Sonne/Mond-Knopf), Hauptfarbe bleibt Orange. Kleine orange
  Schrift im Hellmodus `#b83700` (`--accent-ink`). Zählwerk, Santa-Band, Szenen-Band und -Kacheln bleiben dunkel.
- **Zweisprachig DE/EN** mit Knopf „EN“/„DE“. Start: Farbmodus wie System, Sprache nach Browser (`de…` = DE, sonst EN).
  Die Wahl wird erst nach einem Klick im `localStorage` gemerkt (`cb-theme`, `cb-lang`, Satz in `datenschutz.html`).
  Deutsch steht im HTML, Englisch in `demo/i18n.js`. Rechtstexte sind übersetzt, ohne neue Klauseln.
- **Fallender Schnee** wie im ersten Design: weiß auf Dunkel, grau auf Hell, alle Seiten.
- **Karten der CodeBear-Watch-Faces** (Abschnitt `#watchfaces` nach „Fragen“, Aufbau wie watchdial.mosooapp.com),
  Knopf „Auf Garmin Connect IQ“ statt „Buy now“. Texte nur aus `design/store/listing_*.md` der Projekte, Icons aus
  `icon_500.png`. Dazu unten auf allen Seiten das **Board** wie im Dashboard („Werbung“, Logo, 5 Icons):
  GasDefizit `88c07f1d-4e6c-4d9b-85cf-b0678328d7af`, NeonFlow `804b047e-5084-45c7-acfe-28d45326b870`,
  Cyber Future `83641038-9e69-4d64-aabd-38426fa6fb5d`, Neon Cyborg `a1bdb5ef-a4bf-4a43-ad7c-d0df45ee26b5`,
  Neon Frosh `c3f1d717-676f-451a-ad0b-84d52e72ad90` (je `https://apps.garmin.com/apps/<ID>`).
- **XMas im Connect IQ Store:** Knopf „Auf Garmin Connect IQ“ neben beiden „Buy now“. Noch kein Store-Link: unsichtbar,
  bis `STORE_URL` in `demo/config.js` gefüllt ist.
- **Szenen anklickbar:** Klick auf eine der 25 Kacheln lässt das Bild im Band über den Kacheln laufen (nur das Band,
  User). Das Band bleibt beim Scrollen sichtbar.
- **Neue Bilder:** Uhren im Gehäuse der Store-Icons mit schwarzem Armband, neues Vorschaubild
  `og_codebear_1200x630.jpg` (deutsch, dunkel, CodeBear). Das alte `og_1200x630.jpg` ist gelöscht.

## Dodo (Testmodus, vom User, 27.11.2026)

- Produkt „Watch Face Aktivierung“, ID `pdt_0Nso99dTIRu8KDlkyHrUO` (Teil B: Watch-Face prüft diese ID bei `activate`).
- Payment Link: `https://test.checkout.dodopayments.com/buy/pdt_0Nso99dTIRu8KDlkyHrUO?quantity=1`
- Grundpreis im Dashboard: 2,49 EUR inklusive Steuern. Ein lokalisierter Länderpreis überschreibt ihn: Am 27.11.2026
  zeigte der Checkout für Deutschland 0,99 €, für Österreich 2,49 €. Der User hat das angepasst; danach zeigte der
  Checkout für Deutschland 2,49 € (geprüft am 27.11.2026).
- Im Dashboard noch zu prüfen (User): License-Key-Berechtigung mit Activations Limit 2.

## Grenzen (dem User gesagt)

- `erfolg.html` ist kein Kaufnachweis, die Adresse ist fälschbar. Geprüft wird später auf der Uhr.
- Die Watch-Face ab 1.1.0 prüft den Schlüssel online (`POST https://test.dodopayments.com/licenses/activate`), sendet
  Schlüssel und Geräte-ID, prüft die Produkt-ID. Die Prüfung kann bis zu 5 Minuten dauern.
- Freischalten geht nur bei Installation aus dem Store oder der Beta (Handy-Einstellungen).

## Dateien

```
demo/index.html, erfolg.html, datenschutz.html, nutzungsbedingungen.html
demo/config.js      PAYMENT_LINK (+ STORE_URL), sonst nichts
demo/prefs.js       Hell/Dunkel und Sprache, im <head> jeder Seite
demo/i18n.js        englische Texte (EN) und Texte der Skripte (MSG, beide Sprachen)
demo/app.js         Buy-Link (ergänzt redirect_url), Store-Knopf, Zählwerk-Uhr, Szenenauswahl
demo/erfolg.js      Parameter lesen, anzeigen, kopieren
demo/style.css
demo/assets/        img/ (watch_*, faces/, scenes/, og_codebear_1200x630.jpg), fonts/
tools/web_assets/   Uhrenbilder aus ../Weinachten_GasDefizit/design/promo_captures
tools/og.html       Vorlage des Vorschaubilds
```

Bilder neu erzeugen: siehe README.md („Bilder neu erzeugen“).
