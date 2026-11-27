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
- GitHub Pages, Ordner `/demo`, nur relative Links.
- Payment Link als **eine Konstante oben in `demo/config.js`** (`PAYMENT_LINK`).
- Deutsch, dunkles Design, mobil lesbar. Seit 27.11.2026 im **CodeBear-Stil** (User): Logo und Tokens aus
  `../../Garmin Dashboard` (Grafit, Körnung, Big Shoulders Display, Instrument Sans, JetBrains Mono).
  **Hauptfarbe ist das Logo-Orange `#ff4d0a`** (User, 27.11.2026), nicht das Grün `#c8f53c` des Dashboards.
  Vorherige Fassung „Winternacht“: Tag `design-winternacht`.
- Auf jeder Seite: **„Testmodus, kein echter Shop“**.
- `datenschutz.html` mit Entwurfstext, Abschnitt Watch-Face (`#watch-face`) und Impressum (`#impressum`). Anbieter
  **CodeBear**, Name/Anschrift/E-Mail bleiben Platzhalter (User, 27.11.2026).
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
demo/app.js         Buy-Link (ergänzt redirect_url), Zählwerk-Uhr, Santa-Flug
demo/erfolg.js      Parameter lesen, anzeigen, kopieren
demo/style.css
demo/assets/        img/ (aus tools/render_web_assets.swift), fonts/
tools/render_web_assets.swift   Bilder aus ../Weinachten_GasDefizit/design/promo_captures
```

Bilder neu erzeugen:

```bash
swiftc -O tools/render_web_assets.swift -o /tmp/render_web_assets && /tmp/render_web_assets
```
