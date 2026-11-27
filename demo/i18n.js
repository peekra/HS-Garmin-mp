// Two languages. German stays in the HTML (the page also works without JavaScript); this file holds English.
//   data-i18n="key"                 inner HTML of the element, from EN[key]
//   data-i18n-attr="alt:key|..."    attributes, from EN[key]; "{name}" is replaced by data-i18n-name
// On the first switch the German content of each element is kept, so switching back restores it exactly.
// Elements with listeners or state (buy buttons, checkboxes, meter, scene tiles) never carry data-i18n; their texts
// come from MSG via I18N.t() in app.js and erfolg.js, which relabel on the "cb:lang" event from prefs.js.
// All strings here are fixed and written by us: they may contain markup. Nothing from the address or the user
// ever goes through innerHTML.
(function () {
  "use strict";

  var EN = {
    // ---------- shared ----------
    "skip": "Skip to content",
    "tm.title": "Test mode, not a real shop",
    "tm.text": "Student project. You pay with test cards, no real money changes hands.",
    "brand.home": "CodeBear, to the shop home page",
    "nav.main": "Main navigation",
    "nav.compare": "Locked / unlocked",
    "nav.features": "Features",
    "nav.scenes": "Scenes",
    "nav.how": "How it works",
    "nav.buy": "Buy",
    "nav.pages": "Pages",
    "nav.home": "To the home page",
    "store.cta": "On Garmin Connect IQ",
    "consent": "I have read the <a href=\"datenschutz.html\">privacy notice</a>. I only use test data.",
    "board.tag": "Advertisement",
    "board.title": "Watch faces in the Garmin Connect IQ Store",
    "board.intro": "Designed by CodeBear. Take a look at our watch faces for your Garmin watch.",
    "board.open": "Open {name} in the Garmin Connect IQ Store (new tab)",
    "foot.study": "<strong>Test mode, not a real shop.</strong> Student project at the Technische Hochschule Augsburg (Augsburg Technical University of Applied Sciences), course “Design und Implementierung e-Shop” (design and implementation of an e-shop).",
    "foot.legalLabel": "Legal",
    "foot.home": "Home",
    "foot.terms": "Terms of use and license",
    "foot.privacy": "Privacy",
    "foot.imprint": "Imprint",
    "foot.marks": "Not an official Garmin product. Garmin, Connect IQ, Forerunner, fēnix, epix, Venu and vívoactive are trademarks of Garmin Ltd. or its subsidiaries. No cookies, no analytics.",

    // ---------- index.html ----------
    "index.title": "GasDefizit XMas – Unlock · CodeBear demo shop",
    "index.desc": "Christmas Garmin watch face with a roller counter time, VO2max in an Advent wreath and 25 flying scenes. Demo shop in test mode.",
    "hero.eyebrow": "Garmin watch face · Unlock",
    "hero.tagline": "Christmas on the meter.",
    "hero.lead": "The time runs on a roller counter with a snow cap, the seconds sit in red boxes. Above it a needle in an Advent wreath shows your VO2max, and every morning a new Christmas picture flies across the dial.",
    "hero.chipsLabel": "In short",
    "hero.chips": "<li>25 Christmas scenes</li><li>5 data fields</li><li>40 round AMOLED watches</li>",
    "hero.watchAlt": "The watch face on a round watch with a black band: Advent wreath with VO2 needle, counter 10:08 with red seconds 36, four data fields, flying Santa, date 24-12-2026.",
    "price.amount": "2.49 <small>€</small>",
    "price.list": "<li>Pay once, unlock all settings</li><li>License key for 2 activations</li><li>The watch face itself is free</li>",
    "price.testdata": "<strong>Test mode:</strong> Do not enter a real name, a real address or a real card. Test card: <code>4242 4242 4242 4242</code>, <code>06/32</code>, CVC <code>123</code>.",
    "price.fineprint": "Payment runs through Dodo Payments in test mode. Afterwards the next page shows your license key. Copy it there: with a made-up e-mail address no e-mail arrives. The <a href=\"nutzungsbedingungen.html\">terms of use</a> and the <a href=\"datenschutz.html\">privacy notice</a> apply.",

    "cmp.num": "01 · Locked or unlocked",
    "cmp.title": "One key, everything unlocked",
    "cmp.lead": "Installing costs nothing. Without a key you get the full Christmas dial with the default fields. With a key you set up everything yourself.",
    "cmp.freeAlt": "Locked: run km, heart rate, steps and calories, Santa with reindeer in the band.",
    "cmp.freeCap": "Locked <small>free</small>",
    "cmp.unlockedAlt": "Unlocked: other fields such as training, climbing, steps and heart rate, the nerd snowman in the band.",
    "cmp.unlockedCap": "Unlocked <small>with license key</small>",
    "cmp.caption": "What works locked and what works unlocked",
    "cmp.colFeature": "Feature",
    "cmp.colLocked": "Locked",
    "cmp.colFree": "Unlocked",
    "cmp.r1": "Time as a roller counter with seconds",
    "cmp.r2": "VO2max in the Advent wreath, date, status icons",
    "cmp.r3": "Run km, heart rate, steps, calories",
    "cmp.r4": "A new scene every day at 6:00",
    "cmp.r5": "Pick 5 fields from 8 data types",
    "cmp.r6": "Scene by time of day or hourly",
    "cmp.r7": "Show or hide every element",
    "yes": "yes",
    "no": "no",

    "feat.num": "02 · Features",
    "feat.title": "What's on it",
    "feat.1": "<h3>Time as a roller counter</h3><p>24 hours on rollers with a snow cap, the seconds in red.</p>",
    "feat.2": "<h3>VO2max in the Advent wreath</h3><p>Your running VO2max as a needle in the middle of the wreath. Touch and hold opens the VO2max view of the watch.</p>",
    "feat.3": "<h3>25 Christmas scenes</h3><p>Santa, reindeer and nerd icons fly through the band after you raise your wrist.</p>",
    "feat.4": "<h3>Heart rate with an ECG line</h3><p>Current heart rate, next to it a small ECG line ticks every second.</p>",
    "feat.5": "<h3>Five data fields <span class=\"badge badge--accent\">With key</span></h3><p>Run, bike, swim, climb, training, heart rate, steps, calories.</p>",
    "feat.6": "<h3>Three scene modes <span class=\"badge badge--accent\">With key</span></h3><p>Daily at 6:00, by time of day or every hour.</p>",
    "feat.7": "<h3>Show what you need <span class=\"badge badge--accent\">With key</span></h3><p>Hide VO2, scene, date, Bluetooth or alarm.</p>",
    "feat.8": "<h3>Made for AMOLED</h3><p>40 round AMOLED watches. With always-on active the watch shows only the time.</p>",

    "sc.num": "03 · Scenes",
    "sc.title": "25 Christmas pictures",
    "sc.lead": "At 6:00 the next picture of the series arrives, starting with Santa and his reindeer. With a key the scene also changes by time of day or every hour. Tap a picture and it flies through the band above.",
    "sc.modesLabel": "Scene modes",
    "sc.modes": "<li>Daily at 6:00</li><li>Time of day <span class=\"badge badge--accent\">With key</span></li><li>Hourly <span class=\"badge badge--accent\">With key</span></li>",
    "sc.pick": "Pick a scene",

    "how.num": "04 · How it works",
    "how.title": "Unlocked in four steps",
    "how.1": "<h3>Buy</h3><p>Tap “Buy now” and pay with a test card in test mode.</p>",
    "how.2": "<h3>Copy the key</h3><p>After the payment the page shows your license key. Copy it right away: with a made-up e-mail address no e-mail arrives.</p>",
    "how.3": "<h3>Enter it in Connect IQ</h3><p>In the Connect IQ app, open the settings of GasDefizit XMas and paste the key into <span class=\"path\">Activation code</span>.</p>",
    "how.4": "<h3>Save and sync</h3><p>Keep the phone online and connected to the watch until the watch has checked the key. This can take up to 5 minutes. After that it stays unlocked, also offline.</p>",

    "faq.num": "05 · Good to know",
    "faq.title": "Questions",
    "faq.list":
      "<details><summary>Is this a real shop?</summary><p>No. The page belongs to a student project at the Technische Hochschule Augsburg (course “Design und Implementierung e-Shop”). Dodo Payments runs in test mode, you pay with a test card and nothing is charged.</p></details>" +
      "<details><summary>Which card do I pay with?</summary><p>Use the Dodo Payments test card: card number <code>4242 4242 4242 4242</code>, expiry date <code>06/32</code>, CVC <code>123</code>. Do not enter a real card. Test mode rejects real cards (“Your card was declined”). Source: <a href=\"https://docs.dodopayments.com/miscellaneous/testing-process\">Dodo documentation on testing</a>.</p></details>" +
      "<details><summary>Which details do I enter at checkout?</summary><p>Only made-up details. Do not enter a real name, a real e-mail address or a real postal address. This is a student project in test mode, not a real purchase. The page shows your license key after the payment. Copy it there.</p></details>" +
      "<details><summary>Which watches does the watch face run on?</summary><p>On 40 round Garmin AMOLED watches with Connect IQ 5.2 or newer, for example Forerunner 165, 265 and 965, Venu 3, vívoactive 5 and 6, fēnix 8 and epix Pro. Watches with a MIP display are not included.</p></details>" +
      "<details><summary>How many watches can I unlock?</summary><p>One key is good for 2 activations. Every watch that checks it uses one; a reinstall counts as well. After that the watch reports “Device limit reached”.</p></details>" +
      "<details><summary>I copied the watch face by USB. Does that work too?</summary><p>No. You enter the key in the settings of the Connect IQ app, and those only exist when the watch face is installed from the Connect IQ Store or as a beta.</p></details>" +
      "<details><summary>How do I know the watch is unlocked?</summary><p>On the watch, in the “Customize” menu of the watch face. The “Status” entry shows “Unlocked” or “Locked”, during the check also “Checking”, “No connection”, “Invalid code” or “Device limit reached”.</p></details>" +
      "<details><summary>I lost my key.</summary><p>The page after the payment shows it only once. With a made-up e-mail address you get no e-mail. In test mode simply buy again with the test card. It costs nothing.</p></details>",

    "wf.num": "06 · More from CodeBear",
    "wf.title": "Our watch faces",
    "wf.lead": "More watch faces by CodeBear for round Garmin watches, free in the Garmin Connect IQ Store.",
    "wf.alt": "Preview of {name} on a round watch",
    "wf.note": "Preview with sample data.",
    "wf.free": "Free",
    "wf.open": "Open {name} on Garmin Connect IQ (new tab)",
    // short descriptions: word for word from design/store/listing_en.md of each project
    "wf.gd.short": "Your watch as an analogue electricity meter: time as a roller counter, VO2 max and freely selectable fields for sport and everyday.",
    "wf.gd.tags": "<li>Roller counter</li><li>VO2 max gauge</li><li>Up to 5 data fields</li><li>Light or dark</li>",
    "wf.nf.short": "Big neon digits for the time, a seconds ring, 8 colors and 5 fields you pick yourself, on the watch or in the Connect IQ app.",
    "wf.nf.tags": "<li>Neon digits</li><li>Seconds ring</li><li>8 colors</li><li>Black or white</li>",
    "wf.cf.short": "Futuristic HUD watch face: second dial with a moving dot, large time, big weather and two progress rings.",
    "wf.cf.tags": "<li>HUD style</li><li>Seconds dial with dot</li><li>Big weather</li><li>5 accent colours</li>",
    "wf.nc.short": "A cyborg officer under glowing neon digits, two data fields with goal lines, the time in 24 h and 8 neon colors.",
    "wf.nc.tags": "<li>Cyborg officer</li><li>Goal lines</li><li>Beating heart</li><li>8 neon colors</li>",
    "wf.fr.short": "Bold two-tone time, six data fields you choose, eight colours, light or dark.",
    "wf.fr.tags": "<li>Two-tone time</li><li>6 data fields</li><li>Progress rings</li><li>Light or dark</li>",

    "cta.badge": "Designed by CodeBear",
    "cta.title": "Merry Christmas <span class=\"x\">on your wrist</span>",
    "cta.text": "One key, all settings, two activations.",

    // ---------- erfolg.html ----------
    "ok.title": "Your license key – GasDefizit XMas · CodeBear demo shop",
    "ok.thanks": "Thank you for your purchase",
    "ok.paid": "Payment successful",
    "ok.nokey": "The address contains no license key. In test mode simply buy again with the test card. It costs nothing.",
    "ok.wait": "One moment",
    "ok.pendingTitle": "Payment is still being processed",
    "ok.pendingText": "Dodo Payments has not completed the payment yet. Wait a moment and reload the page. If no key arrives, buy again in test mode with the test card.",
    "ok.noBuy": "No purchase",
    "ok.failedTitle": "Payment not completed",
    "ok.failedText": "The payment failed or expired. Nothing was charged. Try again on the home page with the test card <code>4242 4242 4242 4242</code>, <code>06/32</code>, CVC <code>123</code>.",
    "ok.keyLabel": "License key",
    "ok.noneTitle": "No key in the address",
    "ok.noneText": "This page shows the key only right after the payment. In test mode simply buy again with the test card.",
    "ok.nextTitle": "Next steps",
    "ok.steps":
      "<li class=\"step\"><h3>Install the watch face</h3><p>Install GasDefizit XMas from the Connect IQ Store on your watch, if you have not done so yet.</p></li>" +
      "<li class=\"step\"><h3>Enter the key</h3><p>In the Connect IQ app, open the settings of GasDefizit XMas and paste the key into <span class=\"path\">Activation code</span>.</p></li>" +
      "<li class=\"step\"><h3>Save and sync</h3><p>Keep the phone online and connected to the watch until the watch has checked the key. This can take up to 5 minutes. After that it stays unlocked, also offline.</p></li>" +
      "<li class=\"step\"><h3>Check the status</h3><p>On the watch: “Customize” menu of the watch face › “Status” shows “Unlocked”. One key is good for 2 activations.</p></li>",
    "ok.home": "Back to the home page",
    "ok.retry": "Try again",

    // ---------- datenschutz.html ----------
    "privacy.title": "Privacy and imprint – GasDefizit XMas · CodeBear demo shop",
    "privacy.article":
      "<h1>Privacy</h1>" +
      "<p class=\"placeholder\">Draft for a student project. It is not legal advice and must be replaced by a checked privacy policy before any real operation.</p>" +
      "<p>This notice applies to this website and to the watch face <strong>GasDefizit XMas</strong> (Garmin Connect IQ), both by CodeBear.</p>" +
      "<h2>1. Controller</h2>" +
      "<p>The controller is CodeBear, contact see <a href=\"#impressum\">imprint</a>.</p>" +
      "<h2>2. Hosting</h2>" +
      "<p>The site is hosted on GitHub Pages (GitHub, Inc.). When you open it, GitHub processes technically necessary data such as the IP address, date and time and the requested file, to deliver the site and to protect it against abuse. The legal basis is our legitimate interest in delivering the site securely (Art. 6(1)(f) GDPR). How long GitHub keeps this data is decided by GitHub. GitHub's privacy statement applies.</p>" +
      "<h2>3. No cookies, no tracking</h2>" +
      "<p>The site sets no cookies and uses no analytics or advertising services. Fonts and images are on the same server; no content is loaded from other servers.</p>" +
      "<p><strong>Color mode and language:</strong> When you switch between light and dark or between German and English, the site stores this choice in your browser's storage (localStorage, entries “cb-theme” and “cb-lang”) so that it applies on all pages of the shop. Nothing is stored without a click on one of the switches. The choice is not sent anywhere. You delete it by deleting this site's data in your browser.</p>" +
      "<p><strong>Links to the Connect IQ Store:</strong> The watch face cards and the “Advertisement” box at the bottom of every page link to CodeBear watch faces in the Garmin Connect IQ Store (apps.garmin.com). Loading this page sends nothing to Garmin. Only when you click such a link does your browser open Garmin's page; Garmin's privacy policy applies there.</p>" +
      "<h2 id=\"testmodus\">4. Test mode: no real data</h2>" +
      "<p>This shop is a student project in test mode. There is no real purchase, and no money is charged.</p>" +
      "<ul>" +
      "<li>At checkout, do <strong>not enter a real name, a real e-mail address, a real postal address or a real card</strong>.</li>" +
      "<li>Use made-up details and the Dodo Payments test card: <code>4242 4242 4242 4242</code>, expiry date <code>06/32</code>, CVC <code>123</code>.</li>" +
      "<li>With a made-up e-mail address you get no e-mail. The page shows your license key after the payment.</li>" +
      "</ul>" +
      "<p>If you still enter real data, Dodo Payments processes it as described in section 5.</p>" +
      "<h2>5. Payment through Dodo Payments</h2>" +
      "<p>“Buy now” leads to the Dodo Payments checkout. Dodo Payments is the seller of the order (merchant of record) and processes the data entered there, such as name, e-mail address and payment details, under its own responsibility. The Dodo Payments privacy policy applies.</p>" +
      "<p><strong>Checkbox before buying:</strong> Before “Buy now” you confirm with a checkbox that you have read this privacy notice and use only test data. Only then does the button lead to Dodo Payments. The tick stays in your browser. The site neither stores nor sends it.</p>" +
      "<h2>6. Page after the payment</h2>" +
      "<p>After the payment Dodo Payments redirects to <a href=\"erfolg.html\">erfolg.html</a> and adds the payment status, payment ID, e-mail address and license key to the address. The page reads these values only in the browser. The e-mail address is removed from the address bar at once, and no referrer is passed on to other sites. The website stores none of it.</p>" +
      "<h2 id=\"watch-face\">7. Watch face GasDefizit XMas</h2>" +
      "<p><strong>Health and activity data</strong> (heart rate, steps, calories, VO2max, weekly distances and training times) is read by the watch face only to show it on the watch. It never leaves the watch and is not sent to CodeBear or third parties.</p>" +
      "<p><strong>Activation code:</strong> The fixed activation code is checked only on the watch. Nothing is sent.</p>" +
      "<p><strong>License key:</strong> Only if you enter a license key in the settings does the watch send a request to Dodo Payments (<code>test.dodopayments.com</code>) through the Garmin Connect app on your phone to activate the key. It sends:</p>" +
      "<ul>" +
      "<li>the license key,</li>" +
      "<li>a device ID: the identifier Garmin gives the watch face on this watch (different for every app, not the serial number). If it is missing, a random ID created once on the watch.</li>" +
      "</ul>" +
      "<p>As with any internet connection, Dodo Payments sees your phone's IP address. Dodo Payments creates an activation entry with this device ID for the key; the Dodo Payments privacy policy applies to it. The reply from Dodo Payments also contains the name and e-mail address from the purchase. The watch face only evaluates the product number and does not store the reply.</p>" +
      "<p><strong>Stored on the watch</strong> are the entered key (in the watch face settings, which Garmin syncs between phone and watch), the state of the check, whether the watch is unlocked and, if created, the random ID. Everything is deleted when you uninstall the watch face. We delete the activation entry at Dodo Payments on request: write an e-mail to the address in the <a href=\"#impressum\">imprint</a>. We then delete the entry in the Dodo Payments dashboard.</p>" +
      "<p>The legal basis for checking the key is the performance of the contract for the unlock (Art. 6(1)(b) GDPR). For the transfer between watch, phone and internet, Garmin's privacy policy also applies.</p>" +
      "<h2>8. Your rights</h2>" +
      "<p>You have the right of access, rectification, erasure and restriction of processing, to data portability and to object, and the right to lodge a complaint with a data protection supervisory authority. To do so, write to us at the e-mail address in the imprint.</p>" +
      "<h2 id=\"impressum\">Imprint</h2>" +
      "<p>Student project in the course “Design und Implementierung e-Shop” at the Technische Hochschule Augsburg. Not a commercial offer, no real sale.</p>" +
      "<address>CodeBear (project name)<br>Technische Hochschule Augsburg<br>Contact: <a href=\"mailto:peeter.der@gmail.com\">peeter.der@gmail.com</a></address>",

    // ---------- nutzungsbedingungen.html ----------
    "terms.title": "Terms of use and license – GasDefizit XMas · CodeBear demo shop",
    "terms.article":
      "<h1>Terms of use</h1>" +
      "<p class=\"placeholder\">Draft for a student project. It is not legal advice. For a real sale, among other things a cancellation policy and a checked refund rule are missing. Values in square brackets are placeholders.</p>" +
      "<h2>1. Provider</h2>" +
      "<p>The watch face GasDefizit XMas and this site are by CodeBear, contact see <a href=\"datenschutz.html#impressum\">imprint</a>. The seller of the unlock is Dodo Payments as merchant of record; its terms also apply to the purchase and the payment.</p>" +
      "<h2>2. What you get</h2>" +
      "<ul>" +
      "<li>The watch face itself is free in the Connect IQ Store. Without an unlock it shows the default fields and the daily scene.</li>" +
      "<li>The <strong>unlock</strong> (EUR 2.49, one-time, demo) unlocks all settings: data fields, scene modes and showing or hiding the elements.</li>" +
      "<li>You get a <strong>license key</strong>. It does not expire and is good for <strong>2 activations</strong>. Every watch that checks the key uses one activation. A reinstall of the watch face or the beta version also counts as a new activation.</li>" +
      "<li>For the check the watch needs a connection to a phone with internet once. After that it stays unlocked, also offline.</li>" +
      "<li>The key is entered only in the settings of the Connect IQ app. This only works when the watch face is installed from the Connect IQ Store or as a beta.</li>" +
      "</ul>" +
      "<h2 id=\"erstattung\">3. Refund</h2>" +
      "<p>This is a student project in <strong>test mode</strong>. Payment is made only with test cards; no money is charged. Therefore there is nothing to refund. An unlock stays on the watch.</p>" +
      "<h2 id=\"lizenz\">4. License</h2>" +
      "<p>© 2026 CodeBear. All rights reserved.</p>" +
      "<p>You may use the watch face on your own Garmin watches for private purposes. Not allowed: copying, modifying, passing on or selling the watch face or its images, passing on or selling license keys, and circumventing the unlock.</p>" +
      "<p>The images of the watch face (Christmas scenes, Advent wreath, background, frames) were created with the AI tools Claude and Gemini and edited by CodeBear. The fonts of this website are licensed under the SIL Open Font License 1.1.</p>" +
      "<h2>5. Liability and health data</h2>" +
      "<p>The watch face is provided without warranty. Heart rate, VO2max and the ECG line are for information and decoration only. It is not a medical device.</p>" +
      "<h2>6. Trademarks</h2>" +
      "<p>Not an official Garmin product. Garmin, Connect IQ and the device names are trademarks of Garmin Ltd. or its subsidiaries.</p>" +
      "<h2>7. Contact</h2>" +
      "<p>Questions about the unlock: <a href=\"mailto:peeter.der@gmail.com\">peeter.der@gmail.com</a></p>"
  };

  // Texts set by scripts, in both languages. {name} placeholders are filled by t().
  var SCENES = [
    ["Santa mit Rentieren", "Santa & reindeer"], ["Santa am Laptop", "Santa on the laptop"],
    ["Rentier mit Kopfhörern", "Reindeer with headphones"], ["Santa am Computer", "Santa at the computer"],
    ["Rentier mit VR-Brille", "VR reindeer"], ["Santa am Switch", "Santa at the switch"],
    ["Platinen-Baum", "Circuit-board tree"], ["Router-Kugel", "Router bauble"], ["USB-Stiefel", "USB stocking"],
    ["Power-Geschenk", "Power gift"], ["Rentier am Laptop", "Reindeer on the laptop"], ["Nerd-Schneemann", "Nerd snowman"],
    ["Zahnrad-Schneeflocke", "Gear snowflake"], ["Laterne", "Lantern"], ["Server-Rack", "Server rack"],
    ["Binärkerze", "Binary candle"], ["Kaffee „Loading“", "Coffee “Loading”"],
    ["Lebkuchenhaus", "Gingerbread house"], ["Code-Kalender", "Code calendar"], ["Handschuhe", "Mittens"],
    ["Zuckerstange", "Candy cane"], ["Raketenschlitten", "Rocket sleigh"], ["Notenbuch", "Songbook"],
    ["Cloud-Sack", "Cloud sack"], ["Brief an Santa", "Letter to Santa"]
  ];

  var MSG = {
    de: {
      "buy.missing": "Der Payment Link fehlt noch: bitte in config.js eintragen.",
      "buy.invalid": "Der Payment Link in config.js ist keine gültige Adresse.",
      "buy.https": "Der Payment Link in config.js muss mit https:// beginnen.",
      "buy.consent": "Bitte setze zuerst den Haken: Datenschutzerklärung gelesen, nur Testdaten.",
      "meter.label": "Zählwerk mit der aktuellen Uhrzeit {time} Uhr",
      "ok.titleSuccess": "Zahlung erfolgreich – GasDefizit XMas · CodeBear Demo-Shop",
      "ok.introOne": "Dein Lizenzschlüssel für GasDefizit XMas. Er gilt für 2 Aktivierungen. Kopiere ihn jetzt: Mit erfundener E-Mail-Adresse kommt keine E-Mail an.",
      "ok.introMany": "Deine Lizenzschlüssel für GasDefizit XMas. Jeder gilt für 2 Aktivierungen. Kopiere sie jetzt: Mit erfundener E-Mail-Adresse kommt keine E-Mail an.",
      "ok.keyOne": "Dein Lizenzschlüssel",
      "ok.keyN": "Lizenzschlüssel {n}",
      "ok.copy": "Schlüssel kopieren",
      "ok.copyN": "Schlüssel {n} kopieren",
      "ok.copied": "Kopiert. Jetzt in der Connect-IQ-App einfügen.",
      "ok.selected": "Markiert. Mit Strg+C bzw. ⌘+C kopieren.",
      "ok.paymentId": "Zahlungs-ID: {id}"
    },
    en: {
      "buy.missing": "The payment link is missing: please add it to config.js.",
      "buy.invalid": "The payment link in config.js is not a valid address.",
      "buy.https": "The payment link in config.js must start with https://.",
      "buy.consent": "Please tick the box first: privacy notice read, test data only.",
      "meter.label": "Roller counter showing the current time {time}",
      "ok.titleSuccess": "Payment successful – GasDefizit XMas · CodeBear demo shop",
      "ok.introOne": "Your license key for GasDefizit XMas. It is good for 2 activations. Copy it now: with a made-up e-mail address no e-mail arrives.",
      "ok.introMany": "Your license keys for GasDefizit XMas. Each is good for 2 activations. Copy them now: with a made-up e-mail address no e-mail arrives.",
      "ok.keyOne": "Your license key",
      "ok.keyN": "License key {n}",
      "ok.copy": "Copy key",
      "ok.copyN": "Copy key {n}",
      "ok.copied": "Copied. Now paste it into the Connect IQ app.",
      "ok.selected": "Selected. Copy with Ctrl+C or ⌘+C.",
      "ok.paymentId": "Payment ID: {id}"
    }
  };
  for (var s = 0; s < SCENES.length; s++) {
    MSG.de["scene." + s] = SCENES[s][0];
    MSG.en["scene." + s] = SCENES[s][1];
  }

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "de";
  }

  function fill(text, vars) {
    return String(text).replace(/\{(\w+)\}/g, function (all, k) {
      return vars && vars[k] !== undefined ? String(vars[k]) : all;
    });
  }

  function t(key, vars) {
    var table = MSG[lang()];
    var text = key in table ? table[key] : (key in MSG.de ? MSG.de[key] : key);
    return fill(text, vars);
  }

  function apply(next) {
    var en = next === "en";
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      if (!(key in EN)) {
        continue;
      }
      if (el.__i18nDe === undefined) {
        el.__i18nDe = el.innerHTML;
      }
      var html = en ? EN[key] : el.__i18nDe;
      if (el.innerHTML !== html) {
        el.innerHTML = html;
      }
    }
    var withAttr = document.querySelectorAll("[data-i18n-attr]");
    for (var j = 0; j < withAttr.length; j++) {
      var node = withAttr[j];
      var name = node.getAttribute("data-i18n-name");
      if (!node.__i18nDeAttr) {
        node.__i18nDeAttr = {};
      }
      var pairs = node.getAttribute("data-i18n-attr").split("|");
      for (var p = 0; p < pairs.length; p++) {
        var part = pairs[p].split(":");
        var attr = part[0], k = part[1];
        if (!attr || !(k in EN)) {
          continue;
        }
        if (node.__i18nDeAttr[attr] === undefined) {
          node.__i18nDeAttr[attr] = node.getAttribute(attr);
        }
        node.setAttribute(attr, en ? fill(EN[k], { name: name }) : node.__i18nDeAttr[attr]);
      }
    }
    document.documentElement.lang = en ? "en" : "de";
  }

  window.I18N = { apply: apply, t: t, lang: lang, keys: function () { return Object.keys(EN); } };

  // German is already in the HTML; only switch when English was chosen (prefs.js set <html lang> in <head>).
  if (lang() === "en") {
    apply("en");
    // the swap replaced the element an address like datenschutz.html#impressum points to: jump to the new one
    // (after "load", when the browser's own jump to the old element is done; no smooth scrolling here)
    if (location.hash.length > 1) {
      window.addEventListener("load", function () {
        var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
          target.scrollIntoView({ behavior: "instant", block: "start" });
        }
      });
    }
  }
})();
