/* Theme: "auto" follows the phone/OS setting; "light" or "dark" overrides it.
   Loaded in <head> so the saved choice applies before the page paints. */
(function () {
  var KEY = "theospot-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function saved() {
    try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; }
  }
  function isDark(mode) {
    return mode === "dark" || (mode === "auto" && (!media || media.matches));
  }
  function apply(mode) {
    if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);
    else root.removeAttribute("data-theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark(mode) ? "#140d08" : "#fbf3e6");
    var btns = document.querySelectorAll("[data-theme-set]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-theme-set") === mode));
    }
  }

  apply(saved());

  if (media) {
    var onChange = function () { if (saved() === "auto") apply("auto"); };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(saved());
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-theme-set]");
      if (!btn) return;
      var mode = btn.getAttribute("data-theme-set");
      try {
        if (mode === "auto") localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, mode);
      } catch (err) {}
      apply(mode);
    });
  });
})();
