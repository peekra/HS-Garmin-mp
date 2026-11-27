// Color mode and language, loaded in <head> of every page so the page is drawn in the right mode at once.
// First visit: color mode as the system wants it (dark by default), language from the browser ("de..." = German,
// anything else = English). After a click on a switch the choice is stored in this browser (localStorage, keys
// "cb-theme" and "cb-lang") and applies on every page. Nothing is sent anywhere. Storage may be blocked: every
// access is wrapped, the page then simply follows the system again.
(function () {
  "use strict";

  var KEY_THEME = "cb-theme";
  var KEY_LANG = "cb-lang";
  var root = document.documentElement;
  var lightQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function read(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function write(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // storage blocked: the choice lasts until the page is left
    }
  }

  var storedTheme = read(KEY_THEME);
  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }

  var lang = read(KEY_LANG);
  if (lang !== "de" && lang !== "en") {
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "de";
    lang = /^de\b/i.test(nav) ? "de" : "en";
  }
  root.lang = lang;
  root.classList.add("js");

  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") {
      return t;
    }
    return lightQuery && lightQuery.matches ? "light" : "dark";
  }

  var LABELS = {
    de: { toLight: "Zum hellen Modus wechseln", toDark: "Zum dunklen Modus wechseln", lang: "Switch to English" },
    en: { toLight: "Switch to light mode", toDark: "Switch to dark mode", lang: "Auf Deutsch wechseln" }
  };

  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", currentTheme() === "dark" ? "#0e0f11" : "#f2f1ec");
    }
  }

  function syncButtons() {
    var l = root.lang === "en" ? "en" : "de";
    var themeLabel = currentTheme() === "dark" ? LABELS[l].toLight : LABELS[l].toDark;
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", themeLabel);
      buttons[i].setAttribute("title", themeLabel);
    }
    var langButtons = document.querySelectorAll("[data-lang-toggle]");
    for (var j = 0; j < langButtons.length; j++) {
      var b = langButtons[j];
      b.textContent = l === "de" ? "EN" : "DE";
      b.setAttribute("aria-label", LABELS[l].lang);
      b.setAttribute("title", LABELS[l].lang);
      // the label is in the other language
      b.setAttribute("lang", l === "de" ? "en" : "de");
    }
  }

  function setLang(next) {
    root.lang = next;
    if (window.I18N) {
      window.I18N.apply(next);
    }
    syncButtons();
    var ev;
    try {
      ev = new CustomEvent("cb:lang", { detail: next });
    } catch (e) {
      ev = document.createEvent("CustomEvent");
      ev.initCustomEvent("cb:lang", false, false, next);
    }
    document.dispatchEvent(ev);
  }

  function setup() {
    syncThemeColor();
    syncButtons();
    var themeButtons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < themeButtons.length; i++) {
      themeButtons[i].addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        write(KEY_THEME, next);
        syncThemeColor();
        syncButtons();
      });
    }
    var langButtons = document.querySelectorAll("[data-lang-toggle]");
    for (var j = 0; j < langButtons.length; j++) {
      langButtons[j].addEventListener("click", function () {
        var next = root.lang === "en" ? "de" : "en";
        write(KEY_LANG, next);
        setLang(next);
      });
    }
    if (lightQuery) {
      var onSystemChange = function () {
        syncThemeColor();
        syncButtons();
      };
      if (lightQuery.addEventListener) {
        lightQuery.addEventListener("change", onSystemChange);
      } else if (lightQuery.addListener) {
        lightQuery.addListener(onSystemChange);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
