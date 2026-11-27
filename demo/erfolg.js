// Success page: reads the parameters Dodo Payments appends to redirect_url (status, payment_id, email,
// license_key) and shows the license key with a copy button. All values are inserted as text, never as HTML.
// This page proves nothing: anyone can type such an address. The key is checked later on the watch.
// Texts in two languages come from i18n.js (I18N.t); a language switch ("cb:lang") relabels without reloading,
// so the keys stay on the page.
(function () {
  "use strict";

  function t(key, vars) {
    return window.I18N ? window.I18N.t(key, vars) : key;
  }

  var params = new URLSearchParams(location.search);

  // Do not keep the e-mail address in the address bar or the browser history.
  if (params.has("email") && window.history && history.replaceState) {
    params.delete("email");
    var query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : "") + location.hash);
  }

  var status = (params.get("status") || "").trim().toLowerCase();
  var keys = [];
  params.getAll("license_key").forEach(function (value) {
    value.split(",").forEach(function (part) {
      var key = part.trim();
      if (key && keys.indexOf(key) === -1) {
        keys.push(key);
      }
    });
  });
  var paymentId = (params.get("payment_id") || "").trim();

  var OK = ["succeeded", "active"];
  var FAILED = ["failed", "expired", "cancelled", "canceled"];

  var state;
  if (FAILED.indexOf(status) !== -1) {
    state = "failed";
  } else if (status && OK.indexOf(status) === -1) {
    state = "pending";
  } else if (keys.length > 0) {
    state = "success";
  } else if (status) {
    state = "paid-nokey";
  } else {
    state = "none";
  }

  var section = document.querySelector('[data-state="' + state + '"]');
  if (section) {
    section.hidden = false;
  }
  if (state === "success" || state === "paid-nokey") {
    document.querySelector("[data-next]").hidden = false;
  }
  if (state === "failed") {
    document.querySelector("[data-retry]").hidden = false;
  }

  // Elements whose text depends on the language: relabel() fills them now and after each switch.
  var boxes = [];
  var copyState = [];   // per key: "" | "copied" | "selected"

  if (state === "success") {
    renderKeys();
  }
  relabel();
  document.addEventListener("cb:lang", relabel);

  function relabel() {
    if (state !== "success") {
      return;
    }
    // the <title> element carries data-i18n for the default title; the success title replaces it
    document.title = t("ok.titleSuccess");
    document.querySelector("[data-key-intro]").textContent = t(keys.length > 1 ? "ok.introMany" : "ok.introOne");
    boxes.forEach(function (b, i) {
      b.label.textContent = keys.length > 1 ? t("ok.keyN", { n: i + 1 }) : t("ok.keyOne");
      b.button.textContent = keys.length > 1 ? t("ok.copyN", { n: i + 1 }) : t("ok.copy");
      b.feedback.textContent = copyState[i] === "copied" ? t("ok.copied") : copyState[i] === "selected" ? t("ok.selected") : "";
    });
    if (paymentId) {
      var meta = document.querySelector("[data-payment]");
      meta.textContent = t("ok.paymentId", { id: paymentId });
      meta.hidden = false;
    }
  }

  function renderKeys() {
    var list = document.querySelector("[data-keys]");
    keys.forEach(function (key, i) {
      var li = document.createElement("li");
      li.className = "keybox ice";

      var label = document.createElement("span");
      label.className = "keybox__label";
      label.id = "key-label-" + i;

      var code = document.createElement("code");
      code.className = "keybox__key";
      code.setAttribute("aria-labelledby", label.id);
      code.textContent = key;

      var actions = document.createElement("div");
      actions.className = "keybox__actions";

      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn";

      var feedback = document.createElement("span");
      feedback.className = "copy-status";
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");

      copyState[i] = "";
      button.addEventListener("click", function () {
        copy(key, code, function (result) {
          copyState[i] = result;
          feedback.textContent = result === "copied" ? t("ok.copied") : t("ok.selected");
        });
      });

      actions.appendChild(button);
      actions.appendChild(feedback);
      li.appendChild(label);
      li.appendChild(code);
      li.appendChild(actions);
      list.appendChild(li);
      boxes.push({ label: label, button: button, feedback: feedback });
    });
  }

  function copy(text, element, report) {
    function fallback() {
      selectText(element);
      var copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (e) {
        copied = false;
      }
      report(copied ? "copied" : "selected");
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { report("copied"); }, fallback);
    } else {
      fallback();
    }
  }

  function selectText(element) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
})();
