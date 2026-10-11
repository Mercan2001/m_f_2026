(function () {
  "use strict";

  var MAX_HEARTS = 18;
  var HEART_INTERVAL_MS = 2200;
  var activeHeartCount = 0;

  var heartsLayer = document.getElementById("hearts-layer");
  var screens = {
    "screen-welcome": document.getElementById("screen-welcome"),
    "screen-letter": document.getElementById("screen-letter"),
    "screen-music": document.getElementById("screen-music"),
  };

  function spawnHeart() {
    if (!heartsLayer || activeHeartCount >= MAX_HEARTS) return;

    var el = document.createElement("span");
    el.className = "float-heart";
    el.textContent = "♥";
    el.setAttribute("aria-hidden", "true");

    var left = Math.random() * 100;
    var size = 10 + Math.random() * 14;
    var dur = 10 + Math.random() * 8;
    var drift = (Math.random() - 0.5) * 80;
    var opacity = 0.2 + Math.random() * 0.35;

    el.style.left = left + "%";
    el.style.setProperty("--size", size + "px");
    el.style.fontSize = size + "px";
    el.style.setProperty("--dur", dur + "s");
    el.style.setProperty("--drift", drift + "px");
    el.style.setProperty("--opacity", String(opacity));

    activeHeartCount += 1;
    heartsLayer.appendChild(el);

    el.addEventListener(
      "animationend",
      function () {
        el.remove();
        activeHeartCount -= 1;
      },
      { once: true }
    );
  }

  function startHearts() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    spawnHeart();
    setInterval(spawnHeart, HEART_INTERVAL_MS);
  }

  function loadMusicPlayer() {
    var frame = document.getElementById("youtube-player");
    if (!frame || frame.getAttribute("src")) return;
    var src = frame.getAttribute("data-src");
    if (src) frame.setAttribute("src", src);
  }

  function showScreen(id) {
    var next = screens[id];
    if (!next) return;

    var current = document.querySelector(".screen.screen-active, .screen.screen-leaving");
    if (current && current.id === id) return;

    function activate() {
      Object.keys(screens).forEach(function (key) {
        var s = screens[key];
        var isTarget = key === id;
        s.hidden = !isTarget;
        s.classList.remove("screen-active", "screen-leaving");
        if (isTarget) {
          s.classList.add("screen-active");
        }
      });
      if (id === "screen-music") loadMusicPlayer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (current) {
      current.classList.add("screen-leaving");
      current.classList.remove("screen-active");
      setTimeout(activate, 480);
    } else {
      activate();
    }
  }

  document.querySelectorAll("[data-go]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-go");
      if (target) showScreen(target);
    });
  });

  startHearts();
})();
