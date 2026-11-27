// Success page: reads the parameters Dodo Payments appends to redirect_url (status, payment_id, email,
// license_key) and shows the license key with a copy button. All values are inserted as text, never as HTML.
// This page proves nothing: anyone can type such an address. The key is checked later on the watch.
(function () {
  "use strict";

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
  if (state === "success") {
    renderKeys();
    document.title = "Zahlung erfolgreich – GasDefizit XMas · CodeBear Demo-Shop";
  }

  function renderKeys() {
    var list = document.querySelector("[data-keys]");
    if (keys.length > 1) {
      document.querySelector("[data-key-intro]").textContent =
        "Deine Lizenzschlüssel für GasDefizit XMas. Jeder gilt für 2 Aktivierungen, per E-Mail kommen sie auch.";
    }
    keys.forEach(function (key, i) {
      var li = document.createElement("li");
      li.className = "keybox ice";

      var label = document.createElement("span");
      label.className = "keybox__label";
      label.id = "key-label-" + i;
      label.textContent = keys.length > 1 ? "Lizenzschlüssel " + (i + 1) : "Dein Lizenzschlüssel";

      var code = document.createElement("code");
      code.className = "keybox__key";
      code.setAttribute("aria-labelledby", label.id);
      code.textContent = key;

      var actions = document.createElement("div");
      actions.className = "keybox__actions";

      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn--gold";
      button.textContent = keys.length > 1 ? "Schlüssel " + (i + 1) + " kopieren" : "Schlüssel kopieren";

      var feedback = document.createElement("span");
      feedback.className = "copy-status";
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");

      button.addEventListener("click", function () {
        copy(key, code, feedback);
      });

      actions.appendChild(button);
      actions.appendChild(feedback);
      li.appendChild(label);
      li.appendChild(code);
      li.appendChild(actions);
      list.appendChild(li);
    });

    if (paymentId) {
      var meta = document.querySelector("[data-payment]");
      meta.textContent = "Zahlungs-ID: " + paymentId;
      meta.hidden = false;
    }
  }

  function copy(text, element, feedback) {
    function done() {
      feedback.textContent = "Kopiert. Jetzt in der Connect-IQ-App einfügen.";
    }
    function fallback() {
      selectText(element);
      var copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (e) {
        copied = false;
      }
      if (copied) {
        done();
      } else {
        feedback.textContent = "Markiert. Mit Strg+C bzw. ⌘+C kopieren.";
      }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
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
