# GasDefizit XMas – Demo-Shop

Statische Demo-Webseite einer Studienarbeit (THA Augsburg, „Design und Implementierung e-Shop“). Sie verkauft die
Freischaltung der Garmin-Watch-Face **GasDefizit XMas**. Bezahlt wird über **Dodo Payments im Testmodus**.

**Testmodus, kein echter Shop.** Es wird nur mit Testkarten bezahlt.

## Inhalt

| Datei | Zweck |
|---|---|
| `demo/index.html` | Produktseite: Vorschau, gesperrt/frei, Funktionen, 25 Szenen zum Anklicken, Preis, „Buy now“, Karten der anderen CodeBear-Watch-Faces |
| `demo/erfolg.html` | Seite nach der Zahlung: zeigt `license_key` aus der Adresse mit „Schlüssel kopieren“ |
| `index.html` | leitet von der Repo-Adresse auf `demo/` weiter |
| `demo/datenschutz.html` | Datenschutz und Impressum (Entwurf für die Studienarbeit) |
| `demo/nutzungsbedingungen.html` | Nutzungsbedingungen und Lizenz |
| `demo/config.js` | `PAYMENT_LINK` (Dodo Payment Link), optional `STORE_URL` |
| `demo/prefs.js` | Hell/Dunkel und Sprache (im `<head>` jeder Seite), merkt die Wahl nach einem Klick im `localStorage` |
| `demo/i18n.js` | englische Texte (Deutsch steht im HTML), Texte der Skripte in beiden Sprachen |
| `demo/app.js`, `demo/erfolg.js`, `demo/style.css` | Verhalten und Aussehen |
| `demo/assets/` | Bilder (WebP) und selbst gehostete Schriften (OFL, Lizenztexte daneben) |
| `tools/web_assets/` | erzeugt die Uhrenbilder aus `../Weinachten_GasDefizit/design/promo_captures` |
| `tools/og.html` | Vorlage des Vorschaubilds `og_codebear_1200x630.jpg` |

Nur HTML, CSS und JavaScript: kein Build, kein Server, keine API-Schlüssel. Links innerhalb des Shops sind relativ,
nur die Vorschau-Angaben (`og:image`, `og:url`) nennen die volle GitHub-Pages-Adresse.

## Hell/Dunkel, Sprache, Schnee

- Beim ersten Besuch: Farbmodus wie das System (Dunkel ist Standard), Sprache nach Browser (`de…` = Deutsch, sonst
  Englisch). Die runden Knöpfe oben rechts schalten um; die Wahl gilt dann auf allen Seiten (`cb-theme`, `cb-lang`).
- Neue Texte: Deutsch ins HTML mit `data-i18n="schlüssel"` (bzw. `data-i18n-attr="alt:schlüssel"`), Englisch in
  `EN` in `demo/i18n.js`. Texte aus Skripten stehen in `MSG` (beide Sprachen).
- Zählwerk, Santa-Band, Szenen-Band und Szenen-Kacheln bleiben in beiden Modi dunkel (`.dark-zone`).
- Fallender Schnee (`.sky`): weiß auf Dunkel, grau auf Hell; bei „Weniger Bewegung“ steht er still.
- Die Store-Links der fünf Watch Faces (Karten und Board unten) stehen fest im HTML. Der Knopf „Auf Garmin Connect IQ“
  neben „Buy now“ erscheint erst, wenn `STORE_URL` in `demo/config.js` gefüllt ist.

## Dodo Payments einrichten (Testmodus)

1. Im Dodo-Dashboard (Test Mode) ein Einmal-Produkt anlegen, Preis **2,49 EUR** inklusive Steuern. Ein eigener
   Länderpreis unter „Lokalisierte Preisgestaltung“ würde diesen Preis für das Land überschreiben.
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
npm run dev
```

Das startet nur `python3 -m http.server 8765 --bind 127.0.0.1` (auch direkt ausführbar). `npm install` ist nicht
nötig, es gibt keine Abhängigkeiten und keinen Build. GitHub Pages nutzt `package.json` nicht.

Dann http://127.0.0.1:8765/demo/ öffnen. Direkt als Datei (`file://`) funktioniert die Seite auch, nur die
Weiterleitung nach der Zahlung braucht eine `http(s)`-Adresse.

Fälle der Erfolgsseite zum Ausprobieren:

- `erfolg.html?status=succeeded&payment_id=pay_test&license_key=LK-TEST-1234`
- `erfolg.html?status=succeeded&license_key=LK-A%2CLK-B` (zwei Schlüssel)
- `erfolg.html?status=failed`, `erfolg.html?status=processing`, `erfolg.html` (ohne Parameter)

## Auf GitHub Pages veröffentlichen

1. Repo auf GitHub anlegen und diesen Ordner hochladen.
2. Settings › Pages › Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
3. Die Seite liegt dann unter `https://<name>.github.io/<repo>/demo/`. Die Repo-Adresse ohne `demo/` leitet
   dorthin weiter (`index.html`). `.nojekyll` schaltet die Jekyll-Verarbeitung von GitHub ab.
4. `og:image` und `og:url` nennen die volle Adresse `https://peekra.github.io/HS-Garmin-mp/demo/…`. Bei anderem
   Repo-Namen dort anpassen (vier HTML-Dateien). Messenger speichern Vorschauen zwischen; ein neues Bild bekommt
   deshalb einen neuen Dateinamen.


## Bilder neu erzeugen

```bash
swiftc -O tools/web_assets/*.swift -o /tmp/web_assets && /tmp/web_assets
cd demo/assets/img && for f in watch_hero watch_free watch_unlocked; do cwebp -q 82 -alpha_q 90 -m 6 $f.png -o $f.webp && rm $f.png; done
```

Das Gehäuse (`tools/web_assets/WatchDraw.swift`) ist eine Kopie von `../design/drafts/store_tools/lib/WatchDraw.swift`,
wie bei den Store-Icons der anderen Watch Faces, mit schwarzem Armband.

Die Icons der Watch-Face-Karten (`faces/*.webp`, 400 px) sind mit `cwebp -resize 400 400` aus `design/store/icon_500.png`
der Projekte erzeugt: GasDefizit (`../design/store`), NeonFlow (`../NeonFlow`), Cyber Future
(`../../Watch Faces/Simple Skill`), Neon Cyborg (`../Robocop`), Neon Frosh (`../../Watch Faces/Neon Frosh`).

Vorschaubild: `tools/og.html` über `npm run dev` öffnen (http://127.0.0.1:8765/tools/og.html), Fenster 1200 × 630,
Bildschirmfoto als PNG, dann `sips -s format jpeg -s formatOptions 85 og.png --out demo/assets/img/og_codebear_1200x630.jpg`.

Die Szenenbilder (`scenes/sceneNN.webp`, 240 px, Santa 520 px breit) und `favicon.png` sind mit `cwebp` bzw. `sips`
aus den Bildern der Watch-Face erzeugt.

## Rechtliches

Garmin, Connect IQ und die Gerätenamen sind Marken von Garmin Ltd. Diese Seite steht in keiner Verbindung zu Garmin.
Design und Logo: CodeBear (aus dem Projekt Garmin Dashboard). Schriften: Big Shoulders Display, Instrument Sans,
JetBrains Mono, SIL Open Font License 1.1.
