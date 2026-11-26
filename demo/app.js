// Product page: buy link from config.js, live roller counter, scene gallery, scroll reveal.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Buy link ----------

  // Returns the payment link with redirect_url set to erfolg.html next to this page, or null with a reason.
  function buildBuyUrl() {
    var raw = typeof PAYMENT_LINK === "string" ? PAYMENT_LINK.trim() : "";
    if (!raw || raw.indexOf("DEIN_PRODUKT") !== -1) {
      return { url: null, reason: "Der Payment Link fehlt noch: bitte in config.js eintragen." };
    }
    var url;
    try {
      url = new URL(raw);
    } catch (e) {
      return { url: null, reason: "Der Payment Link in config.js ist keine gültige Adresse." };
    }
    if (url.protocol !== "https:") {
      return { url: null, reason: "Der Payment Link in config.js muss mit https:// beginnen." };
    }
    if (!url.searchParams.has("redirect_url") && /^https?:$/.test(location.protocol)) {
      url.searchParams.set("redirect_url", new URL("erfolg.html", location.href).href);
    }
    return { url: url.href, reason: null };
  }

  function setupBuyButtons() {
    var result = buildBuyUrl();
    var buttons = document.querySelectorAll("[data-buy]");
    var notes = document.querySelectorAll("[data-buy-note]");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (result.url) {
        btn.href = result.url;
        btn.removeAttribute("aria-disabled");
      } else {
        btn.removeAttribute("href");
        btn.setAttribute("role", "link");
        btn.setAttribute("aria-disabled", "true");
        btn.addEventListener("click", function (ev) { ev.preventDefault(); });
      }
    }
    for (var j = 0; j < notes.length; j++) {
      notes[j].hidden = !result.reason;
      notes[j].textContent = result.reason || "";
    }
  }

  function setupStoreLink() {
    var url = typeof STORE_URL === "string" ? STORE_URL.trim() : "";
    var box = document.querySelector("[data-store]");
    var link = document.querySelector("[data-store-link]");
    if (!box || !link || !/^https:\/\//.test(url)) {
      return;
    }
    link.href = url;
    box.hidden = false;
  }

  // ---------- Roller counter (live clock, HH:MM and seconds) ----------

  function setupMeter() {
    var meter = document.querySelector("[data-meter]");
    if (!meter) {
      return;
    }
    var wheels = [];
    var all = meter.querySelectorAll("[data-wheel]");
    for (var i = 0; i < all.length; i++) {
      var strip = all[i].querySelector(".strip");
      // digits 0..9 and a second 0, so 9 -> 0 rolls forward and then snaps back
      var html = "";
      for (var d = 0; d <= 10; d++) {
        html += "<span>" + (d % 10) + "</span>";
      }
      strip.innerHTML = html;
      strip.classList.add("no-anim");
      wheels[Number(all[i].getAttribute("data-wheel"))] = { strip: strip, value: -1 };
      strip.addEventListener("transitionend", onRollEnd);
    }

    function onRollEnd(ev) {
      var strip = ev.currentTarget;
      if (strip.style.getPropertyValue("--i") === "10") {
        strip.classList.add("no-anim");
        strip.style.setProperty("--i", "0");
        void strip.offsetHeight;   // apply the jump before the next transition
        strip.classList.remove("no-anim");
      }
    }

    function show(index, digit, animate) {
      var w = wheels[index];
      if (!w || w.value === digit) {
        return;
      }
      var target = digit;
      if (animate && w.value === 9 && digit === 0) {
        target = 10;
      } else if (animate && digit < w.value) {
        // e.g. 23 -> 00 or 5 -> 0 in the tens of minutes: roll forward through the extra 0
        target = digit === 0 ? 10 : digit;
      }
      w.value = digit;
      w.strip.style.setProperty("--i", String(target));
    }

    function tick(animate) {
      var now = new Date();
      var parts = [now.getHours(), now.getMinutes(), now.getSeconds()];
      for (var p = 0; p < 3; p++) {
        show(p * 2, Math.floor(parts[p] / 10), animate);
        show(p * 2 + 1, parts[p] % 10, animate);
      }
      var label = pad(parts[0]) + ":" + pad(parts[1]);
      meter.setAttribute("aria-label", "Zählwerk mit der aktuellen Uhrzeit " + label + " Uhr");
    }

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    tick(false);
    void meter.offsetHeight;
    for (var k = 0; k < wheels.length; k++) {
      if (wheels[k] && !reduceMotion) {
        wheels[k].strip.classList.remove("no-anim");
      }
    }
    // aligned to the full second
    setTimeout(function () {
      tick(!reduceMotion);
      setInterval(function () { tick(!reduceMotion); }, 1000);
    }, 1000 - (Date.now() % 1000) + 5);
  }

  // ---------- Scene gallery (the first tile, Santa, is in the HTML) ----------

  var SCENES = [
    "Santa am Laptop", "Rentier mit Kopfhörern", "Santa am Computer", "Rentier mit VR-Brille",
    "Santa am Switch", "Platinen-Baum", "Router-Kugel", "USB-Stiefel", "Power-Geschenk", "Rentier am Laptop",
    "Nerd-Schneemann", "Zahnrad-Schneeflocke", "Laterne", "Server-Rack", "Binärkerze", "Kaffee „Loading“",
    "Lebkuchenhaus", "Code-Kalender", "Handschuhe", "Zuckerstange", "Raketenschlitten", "Notenbuch",
    "Cloud-Sack", "Brief an Santa"
  ];

  function setupScenes() {
    var list = document.querySelector("[data-scenes]");
    if (!list) {
      return;
    }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < SCENES.length; i++) {
      var n = i + 1;
      var li = document.createElement("li");
      li.className = "scene";
      var no = document.createElement("span");
      no.className = "scene__no";
      no.textContent = String(n);
      var img = document.createElement("img");
      img.src = "assets/img/scenes/scene" + (n < 10 ? "0" : "") + n + ".webp";
      img.width = 240;
      img.height = 240;
      img.loading = "lazy";
      img.alt = "";
      var name = document.createElement("span");
      name.className = "scene__name";
      name.textContent = SCENES[i];
      li.appendChild(no);
      li.appendChild(img);
      li.appendChild(name);
      frag.appendChild(li);
    }
    list.appendChild(frag);
  }

  // ---------- Reveal on scroll ----------

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add("is-visible");
      }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    for (var j = 0; j < items.length; j++) {
      io.observe(items[j]);
    }
  }

  setupBuyButtons();
  setupStoreLink();
  setupMeter();
  setupScenes();
  setupReveal();
})();
