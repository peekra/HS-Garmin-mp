# GasDefizit XMas – Demo-Shop

Statische Demo-Webseite einer Studienarbeit (THA Augsburg, „Design und Implementierung e-Shop“). Sie verkauft die
Freischaltung der Garmin-Watch-Face **GasDefizit XMas**. Bezahlt wird über **Dodo Payments im Testmodus**.

**Testmodus, kein echter Shop.** Es wird nur mit Testkarten bezahlt.

## Inhalt

| Datei | Zweck |
|---|---|
| `demo/index.html` | Produktseite: Vorschau, gesperrt/frei, Funktionen, 25 Szenen, Preis, „Buy now“ |
| `demo/erfolg.html` | Seite nach der Zahlung: zeigt `license_key` aus der Adresse mit „Schlüssel kopieren“ |
| `demo/datenschutz.html` | Datenschutz und Impressum (Platzhaltertext) |
| `demo/config.js` | `PAYMENT_LINK` (Dodo Payment Link), optional `STORE_URL` |
| `demo/app.js`, `demo/erfolg.js`, `demo/style.css` | Verhalten und Aussehen |
| `demo/assets/` | Bilder (WebP) und selbst gehostete Schriften (OFL, Lizenztexte daneben) |
| `tools/render_web_assets.swift` | erzeugt die Uhrenbilder aus `../Weinachten_GasDefizit/design/promo_captures` |

Nur HTML, CSS und JavaScript: kein Build, kein Server, keine API-Schlüssel. Alle Links sind relativ.

## Dodo Payments einrichten (Testmodus)

1. Im Dodo-Dashboard (Test Mode) ein Einmal-Produkt anlegen, Preis **2,49 USD**.
2. Dem Produkt eine **License-Key**-Berechtigung geben: automatische Ausgabe, **Activations Limit 2**.
3. Den Payment Link des Produkts in `demo/config.js` als `PAYMENT_LINK` eintragen.
   Aktuell: `https://test.checkout.dodopayments.com/buy/pdt_0Nso99dTIRu8KDlkyHrUO?quantity=1`
4. `redirect_url` muss nicht im Link stehen: `app.js` hängt die Adresse von `erfolg.html` neben der aktuellen Seite an.
   Steht `redirect_url` schon im Link, bleibt er unverändert.

Nach der Zahlung hängt Dodo `payment_id`, `status`, `email` und `license_key` an die Adresse von `erfolg.html`.
Die Seite zeigt den Schlüssel, entfernt die E-Mail-Adresse aus der Adresszeile und speichert nichts.

`erfolg.html` ist **kein Kaufnachweis**: Die Adresse lässt sich von Hand tippen. Geprüft wird der Schlüssel auf der
Uhr (ab Version 1.1.0 der Watch-Face).

## Lokal ansehen

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Dann http://127.0.0.1:8765/demo/ öffnen. Direkt als Datei (`file://`) funktioniert die Seite auch, nur die
Weiterleitung nach der Zahlung braucht eine `http(s)`-Adresse.

Fälle der Erfolgsseite zum Ausprobieren:

- `erfolg.html?status=succeeded&payment_id=pay_test&license_key=LK-TEST-1234`
- `erfolg.html?status=succeeded&license_key=LK-A%2CLK-B` (zwei Schlüssel)
- `erfolg.html?status=failed`, `erfolg.html?status=processing`, `erfolg.html` (ohne Parameter)

## Auf GitHub Pages veröffentlichen

1. Repo auf GitHub anlegen und diesen Ordner hochladen.
2. Settings › Pages › Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
3. Die Seite liegt dann unter `https://<name>.github.io/<repo>/demo/`.
4. Optional: In `demo/index.html` `og:image` auf die volle Adresse des Bildes setzen, damit Link-Vorschauen das Bild
   zeigen (manche Dienste lesen keine relativen Pfade).

Vor einer Veröffentlichung die Platzhalter in `demo/datenschutz.html` (Impressum, Rechtsgrundlagen) ausfüllen.

## Bilder neu erzeugen

```bash
swiftc -O tools/render_web_assets.swift -o /tmp/render_web_assets && /tmp/render_web_assets
cd demo/assets/img && for f in watch_hero watch_free watch_unlocked; do cwebp -q 82 -alpha_q 90 -m 6 $f.png -o $f.webp && rm $f.png; done
```

Die Szenenbilder (`scenes/sceneNN.webp`, 240 px, Santa 520 px breit), das Vorschaubild `og_1200x630.jpg`
(aus `../Weinachten_GasDefizit/design/website/de/06_social_1200x630.png`) und `favicon.png` sind mit `cwebp` bzw.
`sips` aus den Bildern der Watch-Face erzeugt.

## Rechtliches

Garmin, Connect IQ und die Gerätenamen sind Marken von Garmin Ltd. Diese Seite steht in keiner Verbindung zu Garmin.
Schriften: Big Shoulders Display und Atkinson Hyperlegible, SIL Open Font License 1.1.
