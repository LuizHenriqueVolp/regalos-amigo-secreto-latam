/* Lazo y Mano — tracking (Meta Pixel + Neon) y UI */
(function () {
  "use strict";
  var CFG = window.LYM_CONFIG || {};
  var ENDPOINT = CFG.EVENT_ENDPOINT || "/api/event";
  var PAGE = document.body.getAttribute("data-page") || "venta";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Parámetros de campaña ---------- */
  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid", "gclid", "ttclid"];
  function readParams() {
    var out = {}, qs = new URLSearchParams(location.search), stored = {};
    try { stored = JSON.parse(sessionStorage.getItem("lym_params") || "{}"); } catch (e) {}
    KEYS.forEach(function (k) { var v = qs.get(k) || stored[k]; if (v) out[k] = v.slice(0, 200); });
    try { sessionStorage.setItem("lym_params", JSON.stringify(out)); } catch (e) {}
    return out;
  }
  var params = readParams();

  function isConfigured(url) { return url && /^https?:\/\//i.test(url); }
  function withParams(url) {
    var u = new URL(url);
    Object.keys(params).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, params[k]); });
    return u.toString();
  }
  function device() {
    var ua = navigator.userAgent || "";
    if (/iPad|Tablet/i.test(ua)) return "tablet";
    if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
    return "desktop";
  }

  /* ---------- Neon (/api/event) ---------- */
  function send(payload, beacon) {
    var body = JSON.stringify(payload);
    try {
      if (beacon && navigator.sendBeacon) {
        return navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }));
      }
      return fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    } catch (e) { return null; }
  }
  function visitId() { try { return sessionStorage.getItem("lym_visit_id"); } catch (e) { return null; } }

  function logVisit() {
    var key = "lym_visit_" + PAGE;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) {}
    var p = send({
      type: "visit", page: PAGE,
      utm_source: params.utm_source, utm_medium: params.utm_medium, utm_campaign: params.utm_campaign,
      utm_content: params.utm_content, src: params.src, device: device(), referrer: document.referrer || null
    });
    if (p && p.then) p.then(function (d) { if (d && d.id) { try { sessionStorage.setItem("lym_visit_id", String(d.id)); } catch (e) {} } });
  }
  window.LYM_logClick = function (cta) {
    send({ type: "click", visit_id: visitId(), cta: cta, utm_campaign: params.utm_campaign, src: params.src }, true);
  };
  window.LYM_logLead = function (email) {
    return send({ type: "lead", email: email, utm_campaign: params.utm_campaign });
  };

  /* ---------- Meta Pixel ---------- */
  function fbq() { if (window.fbq) window.fbq.apply(null, arguments); }

  /* ---------- CTAs → checkout ---------- */
  function bindCtas(selector, urlKey, pixelData) {
    document.querySelectorAll(selector).forEach(function (a) {
      var url = CFG[urlKey];
      if (isConfigured(url)) a.href = withParams(url);
      a.addEventListener("click", function (ev) {
        var cta = a.getAttribute("data-cta") || "cta";
        fbq("track", "InitiateCheckout", Object.assign({ content_name: cta }, pixelData));
        window.LYM_logClick(cta);
        if (!isConfigured(CFG[urlKey])) {
          // Link aún no configurado: lleva al bloque de precio
          console.warn("[Lazo y Mano] " + urlKey + " sin configurar en assets/config.js");
          if (a.getAttribute("href") === "#precio") return;
          ev.preventDefault();
          return;
        }
        // Asegura que el Pixel registre el clic antes de salir al checkout
        ev.preventDefault();
        var href = withParams(CFG[urlKey]);
        var go = function () { location.href = href; };
        if (window.LYM_loadPixel) window.LYM_loadPixel();
        if (window.fbq && window.fbq.callMethod) { setTimeout(go, 180); return; }
        var t0 = Date.now();
        (function wait() {
          if ((window.fbq && window.fbq.callMethod) || Date.now() - t0 > 900) setTimeout(go, 150);
          else setTimeout(wait, 50);
        })();
      });
    });
  }

  /* ---------- Reveal + contadores ---------- */
  function animateCount(el) {
    var to = parseInt(el.getAttribute("data-to"), 10) || 0;
    if (reduce) { el.textContent = to; return; }
    var start = null, dur = 1200;
    function step(t) {
      if (!start) start = t;
      var k = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }
  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach(function (e) { e.classList.add("in"); });
      document.querySelectorAll(".count").forEach(animateCount);
      return;
    }
    // Revela todo lo que ya está en pantalla o quedó arriba (scroll rápido / ancla)
    var pending = Array.prototype.slice.call(els), ticking = false;
    function check() {
      ticking = false;
      var limit = window.innerHeight * 0.94;
      pending = pending.filter(function (e) {
        if (e.getBoundingClientRect().top < limit) {
          e.classList.add("in");
          e.querySelectorAll(".count").forEach(animateCount);
          return false;
        }
        return true;
      });
      if (!pending.length) { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
    setTimeout(check, 400);
  }

  /* ---------- ViewContent al ver el precio + sticky ---------- */
  function setupPriceAndSticky() {
    var price = document.getElementById("price-card");
    var sticky = document.getElementById("sticky");
    var hero = document.querySelector(".hero .cta");
    if (!("IntersectionObserver" in window)) return;
    if (price) {
      var seen = false, priceVisible = false, heroVisible = true;
      var update = function () {
        if (!sticky) return;
        var show = !heroVisible && !priceVisible;
        sticky.classList.toggle("show", show);
        sticky.setAttribute("aria-hidden", show ? "false" : "true");
        var link = sticky.querySelector("a"); if (link) link.tabIndex = show ? 0 : -1;
      };
      // ViewContent: cuando el valor (US$ 7) aparece en pantalla
      var amount = price.querySelector(".amount") || price;
      var checkPrice = function () {
        if (seen) return;
        var r = amount.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight - r.height * 0.4) {
          seen = true;
          window.removeEventListener("scroll", checkPrice);
          fbq("track", "ViewContent", { content_name: "+60 Regalos Caseros", value: 7, currency: "USD" });
          send({ type: "click", visit_id: visitId(), cta: "view_price", utm_campaign: params.utm_campaign, src: params.src }, true);
        }
      };
      window.addEventListener("scroll", checkPrice, { passive: true });
      checkPrice();
      new IntersectionObserver(function (en) { priceVisible = en[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(price);
      if (hero) new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; update(); }).observe(hero);
    }
  }

  /* ---------- Carrusel ---------- */
  function setupCarousel() {
    var track = document.getElementById("track"), dots = document.getElementById("dots");
    if (!track || !dots) return;
    var slides = Array.prototype.slice.call(track.children);
    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", "Página " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dots.appendChild(b);
    });
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      var s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    }
    var current = 0;
    function mark() {
      var center = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      slides.forEach(function (s, i) { var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - center); if (d < bd) { bd = d; best = i; } });
      current = best;
      Array.prototype.forEach.call(dots.children, function (d, i) { d.setAttribute("aria-current", i === best ? "true" : "false"); });
      slides.forEach(function (s, i) { s.style.opacity = i === best ? "1" : ".75"; s.style.transform = i === best ? "none" : "scale(.96)"; });
    }
    var raf;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
    var prev = document.getElementById("prev"), next = document.getElementById("next");
    if (prev) prev.addEventListener("click", function () { go(current - 1); });
    if (next) next.addEventListener("click", function () { go(current + 1); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
    });
    mark();
  }

  /* ---------- Video (carga solo al tocar play) ---------- */
  function setupVideo() {
    var frame = document.getElementById("video-frame");
    if (!frame) return;
    var btn = frame.querySelector(".play");
    btn.addEventListener("click", function () {
      var v = document.createElement("video");
      v.src = btn.getAttribute("data-src");
      v.poster = frame.querySelector("img").src;
      v.controls = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.preload = "auto";
      frame.innerHTML = ""; frame.appendChild(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      fbq("trackCustom", "VideoPlay");
      window.LYM_logClick("video_play");
    }, { once: true });
  }

  /* ---------- Gracias ---------- */
  function setupThanks() {
    if (PAGE !== "gracias") return;
    fbq("trackCustom", "UpsellView", { content_name: "Kit de Canastas para Vender", value: 14, currency: "USD" });
    if (CFG.FIRE_PURCHASE_ON_THANKS) {
      var k = "lym_purchase_fired";
      try {
        if (!localStorage.getItem(k)) {
          fbq("track", "Purchase", { value: CFG.PURCHASE_VALUE || 7, currency: CFG.CURRENCY || "USD" });
          localStorage.setItem(k, "1");
        }
      } catch (e) {}
    }
    var no = document.getElementById("no-thanks");
    if (no) no.addEventListener("click", function (e) {
      e.preventDefault();
      window.LYM_logClick("upsell_no");
      fbq("trackCustom", "UpsellDecline");
      var offer = document.getElementById("offer"); if (offer) offer.hidden = true;
      var done = document.getElementById("done"); if (done) done.hidden = false;
    });
  }

  /* ---------- Marquee: duplica los ítems para un loop continuo ---------- */
  function setupMarquee() {
    document.querySelectorAll(".marquee-track").forEach(function (t) {
      Array.prototype.slice.call(t.children).forEach(function (el) {
        var c = el.cloneNode(true);
        c.classList.add("clone"); c.setAttribute("aria-hidden", "true");
        c.querySelectorAll("img").forEach(function (i) { i.alt = ""; });
        t.appendChild(c);
      });
    });
    // Pausa las franjas cuando no están en pantalla (ahorra batería y CPU)
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { e.target.classList.toggle("off", !e.isIntersecting); });
      }, { rootMargin: "100px 0px" });
      document.querySelectorAll(".marquee").forEach(function (m) { io.observe(m); });
    }
  }

  /* ---------- Init ---------- */
  setupMarquee();
  logVisit();
  if (PAGE === "gracias") {
    bindCtas(".js-upsell", "UPSELL_URL", { value: 14, currency: "USD", content_name: "upsell_kit_canastas" });
  } else {
    // Solo el botón dentro de la Oferta de Navidad va al checkout
    bindCtas("#price-card .js-cta", "CHECKOUT_URL", { value: 7, currency: "USD" });
    // Los demás botones llevan (con scroll suave) hasta la Oferta de Navidad
    document.querySelectorAll(".js-cta").forEach(function (a) {
      if (a.closest("#price-card")) return;
      a.setAttribute("href", "#precio");
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        window.LYM_logClick(a.getAttribute("data-cta") || "cta");
        var card = document.getElementById("price-card");
        if (!card) { location.hash = "precio"; return; }
        var y = card.getBoundingClientRect().top + window.pageYOffset - 24;
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      });
    });
  }
  setupReveal();
  setupPriceAndSticky();
  setupCarousel();
  setupVideo();
  setupThanks();
  // Pixel: clicks en upsell también disparan evento propio
  document.querySelectorAll(".js-upsell").forEach(function (a) {
    a.addEventListener("click", function () { fbq("trackCustom", "UpsellClick", { value: 14, currency: "USD" }); });
  });
})();
