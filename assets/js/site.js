/* masonkurek.com small progressive enhancements. No dependencies. */
(function () {
  "use strict";

  var STORE_KEY = "mk-theme";

  function readStored() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeStored(v) {
    try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* ignore */ }
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  function initial() {
    var stored = readStored();
    if (stored === "light" || stored === "dark") return stored;
    var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    return mq && mq.matches ? "dark" : "light";
  }

  apply(initial());

  document.addEventListener("DOMContentLoaded", function () {
    apply(document.documentElement.getAttribute("data-theme") || initial());

    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.addEventListener("click", function () {
        var next =
          document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        apply(next);
        writeStored(next);
      });
    }

    /* Image loading, in order of preference:
       1. the local file in assets/img/
       2. data-fallback, the original on the Wix CDN
       3. nothing: remove the <img> so the striped placeholder shows through */
    Array.prototype.forEach.call(document.querySelectorAll(".media img"), function (img) {
      function fail() {
        var fb = img.getAttribute("data-fallback");
        if (fb) {
          img.removeAttribute("data-fallback"); /* only try it once */
          img.src = fb;
          return;
        }
        if (img.parentNode) img.parentNode.removeChild(img);
      }
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  });
})();
