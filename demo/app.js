// Product page: buy link from config.js, store button, live roller counter, scene picker, scroll reveal.
// Texts in two languages come from i18n.js (I18N.t); the page listens to "cb:lang" from prefs.js.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function t(key, vars) {
    return window.I18N ? window.I18N.t(key, vars) : key;
  }
  function onLang(fn) {
    document.addEventListener("cb:lang", fn);
  }

  // ---------- Buy link ----------

  // Returns the payment link with redirect_url set to erfolg.html next to this page, or null with a reason key.
  function buildBuyUrl() {
    var raw = typeof PAYMENT_LINK === "string" ? PAYMENT_LINK.trim() : "";
    if (!raw || raw.indexOf("DEIN_PRODUKT") !== -1) {
      return { url: null, reason: "buy.missing" };
    }
    var url;
    try {
      url = new URL(raw);
    } catch (e) {
      return { url: null, reason: "buy.invalid" };
    }
    if (url.protocol !== "https:") {
      return { url: null, reason: "buy.https" };
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
        setupConsent(btn, result.url);
      } else {
        btn.removeAttribute("href");
        btn.setAttribute("role", "link");
        btn.setAttribute("aria-disabled", "true");
        btn.addEventListener("click", function (ev) { ev.preventDefault(); });
      }
    }
    function showReason() {
      for (var j = 0; j < notes.length; j++) {
        notes[j].hidden = !result.reason;
        notes[j].textContent = result.reason ? t(result.reason) : "";
      }
    }
    showReason();
    onLang(showReason);
  }

  // The buy button leads to the checkout only while its checkbox (privacy notice read, test data only) is ticked.
  // Unticked, the link points to the price card, so middle click or "copy link" do not reach the checkout either.
  // The page neither stores nor sends the tick. Opening the payment link directly still bypasses it.
  // Button, checkbox and note share one box ([data-buy-box]); the button itself sits in a row with the store button.
  function setupConsent(btn, url) {
    var scope = btn.closest("[data-buy-box]") || btn.parentNode;
    var box = scope.querySelector("[data-consent]");
    var note = scope.querySelector("[data-consent-note]");
    if (!box) {
      btn.href = url;
      return;
    }

    function sync() {
      if (box.checked) {
        btn.href = url;
        btn.classList.remove("is-locked");
        if (note) {
          note.hidden = true;
          note.textContent = "";
        }
      } else {
        btn.href = "#kaufen";
        btn.classList.add("is-locked");
      }
    }

    btn.addEventListener("click", function (ev) {
      if (box.checked) {
        return;
      }
      ev.preventDefault();
      if (note) {
        note.textContent = t("buy.consent");
        note.hidden = false;
      }
      box.focus();
    });
    box.addEventListener("change", sync);
    // the browser may restore the tick after "back"
    window.addEventListener("pageshow", sync);
    onLang(function () {
      if (note && !note.hidden) {
        note.textContent = t("buy.consent");
      }
    });
    sync();
  }

  // Store button next to each "Buy now": shown only once STORE_URL in config.js holds an https address.
  function setupStoreLink() {
    var url = typeof STORE_URL === "string" ? STORE_URL.trim() : "";
    if (!/^https:\/\//.test(url)) {
      return;
    }
    var links = document.querySelectorAll("[data-store-link]");
    for (var i = 0; i < links.length; i++) {
      links[i].href = url;
      links[i].hidden = false;
    }
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
    var label = "";

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

    function announce() {
      meter.setAttribute("aria-label", t("meter.label", { time: label }));
    }

    function tick(animate) {
      var now = new Date();
      var parts = [now.getHours(), now.getMinutes(), now.getSeconds()];
      for (var p = 0; p < 3; p++) {
        show(p * 2, Math.floor(parts[p] / 10), animate);
        show(p * 2 + 1, parts[p] % 10, animate);
      }
      var next = pad(parts[0]) + ":" + pad(parts[1]);
      if (next !== label) {
        label = next;
        announce();
      }
    }

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    tick(false);
    onLang(announce);
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

  // ---------- Scene picker: 25 tiles (Santa is in the HTML), the picked one flies through the band above ----------

  function sceneName(n) {
    return t("scene." + n);
  }

  function sceneSrc(n) {
    return "assets/img/scenes/scene" + (n < 10 ? "0" : "") + n + ".webp";
  }

  function setupScenes() {
    var list = document.querySelector("[data-scenes]");
    if (!list) {
      return;
    }
    var frag = document.createDocumentFragment();
    for (var n = 1; n <= 24; n++) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "scene";
      btn.setAttribute("data-scene", String(n));
      btn.setAttribute("aria-pressed", "false");
      var no = document.createElement("span");
      no.className = "scene__no";
      no.textContent = String(n);
      var img = document.createElement("img");
      img.src = sceneSrc(n);
      img.width = 240;
      img.height = 240;
      img.loading = "lazy";
      img.alt = "";
      var name = document.createElement("span");
      name.className = "scene__name";
      btn.appendChild(no);
      btn.appendChild(img);
      btn.appendChild(name);
      li.appendChild(btn);
      frag.appendChild(li);
    }
    list.appendChild(frag);

    var tiles = list.querySelectorAll("[data-scene]");
    var flyer = document.querySelector("[data-scene-flyer]");
    var flyerImg = flyer ? flyer.querySelector("img") : null;
    var nameLine = document.querySelector("[data-scene-name]");
    var current = 0;

    function relabel() {
      for (var i = 0; i < tiles.length; i++) {
        var k = Number(tiles[i].getAttribute("data-scene"));
        tiles[i].querySelector(".scene__name").textContent = sceneName(k);
      }
      if (nameLine) {
        nameLine.textContent = current + " · " + sceneName(current);
      }
    }

    function pick(n) {
      current = n;
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].setAttribute("aria-pressed", tiles[i].getAttribute("data-scene") === String(n) ? "true" : "false");
      }
      if (flyer && flyerImg) {
        flyerImg.src = sceneSrc(n);
        flyerImg.width = n === 0 ? 520 : 240;
        flyerImg.height = n === 0 ? 154 : 240;
        flyer.classList.toggle("flyer--square", n !== 0);
        // start the run again from the left
        flyer.style.animation = "none";
        void flyer.offsetWidth;
        flyer.style.animation = "";
      }
      if (nameLine) {
        nameLine.textContent = n + " · " + sceneName(n);
      }
    }

    list.addEventListener("click", function (ev) {
      var tile = ev.target.closest("[data-scene]");
      if (tile && list.contains(tile)) {
        pick(Number(tile.getAttribute("data-scene")));
      }
    });
    relabel();
    onLang(relabel);
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
