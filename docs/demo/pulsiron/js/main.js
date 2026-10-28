/*
Template Name: Pulsiron Fitness
File: main.js — vanilla JavaScript, no jQuery. Each block below is one
behaviour and can be deleted on its own.
*/
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---- nav ---- */
  var nav = document.querySelector("[data-tv-nav]");
  if (nav) {
    var openers = document.querySelectorAll("[data-tv-nav-open]");
    var closers = document.querySelectorAll("[data-tv-nav-close]");
    var backdrop = document.querySelector(".tv-nav__backdrop");
    var lastFocus = null;
    var setOpen = function (on) {
      nav.classList.toggle("is-open", on);
      if (backdrop) backdrop.classList.toggle("is-open", on);
      document.body.classList.toggle("tv-nav-open", on);
      openers.forEach(function (b) { b.setAttribute("aria-expanded", on ? "true" : "false"); });
      if (on) { lastFocus = document.activeElement; var first = nav.querySelector("a, button"); if (first) first.focus(); }
      else if (lastFocus) lastFocus.focus();
    };
    openers.forEach(function (b) { b.addEventListener("click", function () { setOpen(true); }); });
    closers.forEach(function (b) { b.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false); });
    // submenus: tap to open below lg, hover/focus above
    nav.querySelectorAll("[data-tv-sub]").forEach(function (btn) {
      var sub = btn.nextElementSibling;
      btn.addEventListener("click", function () {
        var on = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", on ? "true" : "false");
        if (sub) sub.classList.toggle("is-open", on);
      });
    });
    // close the panel after an in-page link (one-page templates)
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    // reset when resized past the breakpoint
    var mq = window.matchMedia("(min-width: 992px)");
    (mq.addEventListener || mq.addListener).call(mq, "change", function () { if (mq.matches) setOpen(false); });
    // mark the current page
    var here = location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll(".tv-nav__link, .tv-nav__sub a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0];
      if (href && href === here) a.setAttribute("aria-current", "page");
    });
  }
  // copyright year
  document.querySelectorAll("[data-tv-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  
  /* ---- header ---- */
  var header = document.querySelector("[data-tv-header]");
  if (header) {
    var stuck = false;
    var onScroll = function () {
      var s = window.scrollY > 24;
      if (s !== stuck) { stuck = s; header.classList.toggle("is-stuck", s); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // scroll-spy for one-page navs: highlight the section in view
    var spyLinks = [].slice.call(header.querySelectorAll('.tv-nav__link[href^="#"]'));
    if (spyLinks.length && "IntersectionObserver" in window) {
      var map = {};
      spyLinks.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) map[t.id] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { spyLinks.forEach(function (a) { a.removeAttribute("aria-current"); }); var a = map[en.target.id]; if (a) a.setAttribute("aria-current", "true"); }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
    }
  }
  
  /* ---- counters ---- */
  var countEls = document.querySelectorAll("[data-tv-counter]");
  countEls.forEach(function (el) { el.textContent = "0"; });   // markup carries the real value for no-JS readers; JS starts the count from 0
  if (countEls.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-tv-counter")) || 0, dec = (String(target).split(".")[1] || "").length;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = target.toLocaleString(undefined, { minimumFractionDigits: dec }); return; }
      var start = null, dur = 1600;
      var step = function (ts) { if (!start) start = ts; var p = Math.min(1, (ts - start) / dur); var e = 1 - Math.pow(1 - p, 3); el.textContent = (target * e).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } }); }, { threshold: .4 });
      countEls.forEach(function (el) { cio.observe(el); });
    } else countEls.forEach(run);
  }
  // progress bars animate in the same way
  var bars = document.querySelectorAll(".tv-skills__bar span, .tv-profile__bar span, .tv-donate__bar span, .tv-cover__progress span");
  if (bars.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bars.forEach(function (b) { b.setAttribute("data-w", b.style.width); b.style.width = "0"; b.style.transition = "width 1.2s ease"; });
    var bio = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.style.width = en.target.getAttribute("data-w"); bio.unobserve(en.target); } }); }, { threshold: .3 });
    bars.forEach(function (b) { bio.observe(b); });
  }
  
  /* ---- lightbox ---- */
  var lbRoots = document.querySelectorAll("[data-tv-lightbox]");
  if (lbRoots.length) {
    var lb = document.createElement("div");
    lb.className = "tv-lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = '<button class="tv-lightbox__btn tv-lightbox__close" type="button" aria-label="Close">&times;</button><button class="tv-lightbox__btn tv-lightbox__prev" type="button" aria-label="Previous">&#8249;</button><img alt=""><button class="tv-lightbox__btn tv-lightbox__next" type="button" aria-label="Next">&#8250;</button><div class="tv-lightbox__cap"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".tv-lightbox__cap"), items = [], cur = 0, lastEl = null;
    var show = function (i) { cur = (i + items.length) % items.length; lbImg.src = items[cur].href; lbImg.alt = items[cur].cap; lbCap.textContent = items[cur].cap; };
    var open = function (list, i, from) { items = list; lastEl = from; show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; lb.querySelector(".tv-lightbox__close").focus(); };
    var close = function () { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lastEl) lastEl.focus(); };
    lbRoots.forEach(function (root) {
      var links = [].slice.call(root.querySelectorAll("a[href]")).filter(function (a) { return /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(a.getAttribute("href")); });
      var list = links.map(function (a) { return { href: a.href, cap: a.getAttribute("data-caption") || (a.querySelector("img") || {}).alt || "" }; });
      links.forEach(function (a, i) { a.addEventListener("click", function (e) { e.preventDefault(); open(list, i, a); }); });
    });
    lb.querySelector(".tv-lightbox__close").addEventListener("click", close);
    lb.querySelector(".tv-lightbox__prev").addEventListener("click", function () { show(cur - 1); });
    lb.querySelector(".tv-lightbox__next").addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (!lb.classList.contains("is-open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
    var tx = 0; lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true }); lb.addEventListener("touchend", function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) show(d < 0 ? cur + 1 : cur - 1); });
  }
  
  /* ---- tabs ---- */
  document.querySelectorAll("[data-tv-tabs]").forEach(function (root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
    var select = function (i) { tabs.forEach(function (t, j) { var on = i === j; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; if (panels[j]) panels[j].hidden = !on; }); };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) { var n = i; if (e.key === "ArrowRight") n = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length; else if (e.key === "Home") n = 0; else if (e.key === "End") n = tabs.length - 1; else return; e.preventDefault(); select(n); tabs[n].focus(); });
    });
    select(Math.max(0, tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; })));
  });
  
  /* ---- filter ---- */
  /* Button filters: [data-tv-filter="#grid"] > button[data-filter="tag|*"]
     Form filters: [data-tv-filter-form="#grid"] with select[data-filter-select] and input[data-filter-search] */
  var applyFilter = function (grid, tag, q) {
    [].slice.call(grid.querySelectorAll("[data-tag]")).forEach(function (el) {
      var okTag = !tag || tag === "*" || (el.getAttribute("data-tag") || "").split(/\s+/).indexOf(tag) > -1;
      var okQ = !q || el.textContent.toLowerCase().indexOf(q) > -1;
      el.classList.toggle("is-hidden", !(okTag && okQ));
    });
  };
  document.querySelectorAll("[data-tv-filter]").forEach(function (bar) {
    var grid = document.querySelector(bar.getAttribute("data-tv-filter")); if (!grid) return;
    bar.querySelectorAll("button[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () { bar.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-active"); }); b.classList.add("is-active"); applyFilter(grid, b.getAttribute("data-filter"), ""); });
    });
  });
  document.querySelectorAll("[data-tv-filter-form]").forEach(function (form) {
    var grid = document.querySelector(form.getAttribute("data-tv-filter-form")); if (!grid) return;
    var sel = form.querySelector("[data-filter-select]"), inp = form.querySelector("[data-filter-search]");
    var run = function () { applyFilter(grid, sel ? sel.value : "*", inp ? inp.value.trim().toLowerCase() : ""); };
    form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
    if (sel) sel.addEventListener("change", run);
    if (inp) inp.addEventListener("input", run);
  });
  
  /* ---- forms ---- */
  /* Every [data-tv-form]: native constraint validation with inline messages, then a
     simulated send + success state. Wire the fetch() below to your form endpoint
     (Formspree, Basin, Netlify, your own API) to make it real. */
  document.querySelectorAll("[data-tv-form]").forEach(function (form) {
    var note = form.querySelector("[data-tv-form-note]");
    var say = function (msg, ok) { if (!note) return; note.textContent = msg; note.className = "tv-form-note " + (ok ? "is-ok" : "is-err"); };
    form.querySelectorAll("input, select, textarea").forEach(function (f) { f.addEventListener("input", function () { f.classList.remove("is-invalid"); }); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = [].slice.call(form.querySelectorAll("input, select, textarea")).filter(function (f) { return !f.checkValidity(); });
      bad.forEach(function (f) { f.classList.add("is-invalid"); });
      if (bad.length) { say(bad[0].validationMessage || "Please check the highlighted fields.", false); bad[0].focus(); return; }
      var btn = form.querySelector('[type="submit"]'); if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
      say("Sending…", true);
      var done = function () { if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); } if (note) note.className = "tv-form-note"; if (form.querySelector(".tv-form-success")) form.classList.add("is-sent"); else say("Thank you — your message has been sent.", true); form.reset(); };
      var endpoint = form.getAttribute("action");
      if (endpoint && !/\.html?$/.test(endpoint)) { fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }).then(function (r) { if (!r.ok) throw new Error(); done(); }).catch(function () { if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); } say("Something went wrong — please try again.", false); }); }
      else setTimeout(done, 700);
    });
  });
  
  /* ---- fader ---- */
  document.querySelectorAll("[data-tv-fader]").forEach(function (root) {
    var slides = [].slice.call(root.querySelectorAll("[data-tv-fader-slide]"));
    var tabs = [].slice.call(root.querySelectorAll("[data-tv-fader-tab]"));
    if (slides.length < 2) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var every = reduce ? 0 : parseInt(root.getAttribute("data-autoplay") || "0", 10);
    var i = 0, timer = null, start = 0, raf = null;
    var show = function (n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle("is-active", i === j); });
      tabs.forEach(function (t, j) { var on = i === j; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; t.style.removeProperty("--tv-fader-left"); });
      if (every) { start = performance.now(); }
    };
    var tick = function (now) {
      if (!every) return;
      var left = Math.max(0, 100 - ((now - start) / every) * 100);
      if (tabs[i]) tabs[i].style.setProperty("--tv-fader-left", left.toFixed(1));
      if (left <= 0) show(i + 1);
      raf = requestAnimationFrame(tick);
    };
    var play = function () { if (every && !raf) { start = performance.now(); raf = requestAnimationFrame(tick); } };
    var pause = function () { if (raf) { cancelAnimationFrame(raf); raf = null; } };
    tabs.forEach(function (t, j) {
      t.addEventListener("click", function () { show(j); });
      t.addEventListener("keydown", function (e) { var n = j; if (e.key === "ArrowRight") n = j + 1; else if (e.key === "ArrowLeft") n = j - 1; else return; e.preventDefault(); show(n); tabs[(n + tabs.length) % tabs.length].focus(); });
    });
    root.addEventListener("mouseenter", pause); root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", pause); root.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () { document.hidden ? pause() : play(); });
    show(0); play();
  });
  
  /* ---- pricing ---- */
  document.querySelectorAll("[data-tv-pricing]").forEach(function (tog) {
    var btns = [].slice.call(tog.querySelectorAll("button[data-period]"));
    var section = tog.closest("section") || document;
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var period = b.getAttribute("data-period");
        btns.forEach(function (x) { x.classList.toggle("is-active", x === b); });
        section.querySelectorAll("[data-monthly]").forEach(function (p) { p.textContent = p.getAttribute("data-" + period); });
        section.querySelectorAll("[data-per]").forEach(function (p) { if (!p.getAttribute("data-per")) p.setAttribute("data-per", p.textContent); var base = p.getAttribute("data-per"); p.textContent = period === "yearly" ? base + ", billed yearly" : base; });
      });
    });
  });
  
  /* ---- carousel ---- */
  /* Carousel: [data-tv-carousel] with [data-tv-track] > [data-tv-slide].
     data-mode="slide|fade"  data-autoplay="ms|0"  data-per-view="n" (slide mode, via CSS flex-basis)
     data-loop="true"  data-thumbs="#selector" (buttons/images that jump to a slide)
     Swipe (native scroll-snap), arrows, dots, keyboard, pause on hover/focus, respects reduced motion. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-tv-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-tv-track]");
    var slides = [].slice.call(root.querySelectorAll("[data-tv-slide]"));
    if (!track || slides.length < 2) return;
    var mode = root.getAttribute("data-mode") || "slide";
    var auto = reduce ? 0 : Number(root.getAttribute("data-autoplay") || 0);
    var loop = root.getAttribute("data-loop") !== "false";
    var dots = root.querySelector("[data-tv-dots]");
    var thumbs = root.getAttribute("data-thumbs") ? [].slice.call(document.querySelectorAll(root.getAttribute("data-thumbs") + " [data-slide]")) : [];
    var index = 0, timer = null;
    var perView = function () { var w = slides[0].getBoundingClientRect().width || 1; return Math.max(1, Math.round(track.clientWidth / w)); };
    var pages = function () { return mode === "fade" ? slides.length : Math.max(1, slides.length - perView() + 1); };
    var dotBtns = [];
    if (dots) {
      dots.innerHTML = "";
      var n = pages();
      for (var i = 0; i < n; i++) { var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Go to slide " + (i + 1)); (function (i) { b.addEventListener("click", function () { go(i, true); }); })(i); dots.appendChild(b); dotBtns.push(b); }
    }
    var paint = function () {
      dotBtns.forEach(function (b, i) { if (i === index) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      thumbs.forEach(function (t, i) { t.classList.toggle("is-active", i === index); });
      if (mode === "fade") slides.forEach(function (s, i) { s.classList.toggle("is-active", i === index); s.setAttribute("aria-hidden", i === index ? "false" : "true"); });
    };
    var go = function (i, user) {
      var n = pages();
      if (i < 0) i = loop ? n - 1 : 0;
      if (i > n - 1) i = loop ? 0 : n - 1;
      index = i;
      if (mode === "slide") track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce || !user ? "auto" : "smooth" });
      paint();
      if (user) restart();
    };
    var next = function () { go(index + 1); };
    var restart = function () { if (timer) clearInterval(timer); if (auto > 0) timer = setInterval(next, auto); };
    root.querySelectorAll("[data-tv-next]").forEach(function (b) { b.addEventListener("click", function () { go(index + 1, true); }); });
    root.querySelectorAll("[data-tv-prev]").forEach(function (b) { b.addEventListener("click", function () { go(index - 1, true); }); });
    thumbs.forEach(function (t, i) { t.addEventListener("click", function () { go(i, true); }); });
    root.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") go(index + 1, true); if (e.key === "ArrowLeft") go(index - 1, true); });
    root.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    root.addEventListener("mouseleave", restart);
    root.addEventListener("focusin", function () { if (timer) clearInterval(timer); });
    root.addEventListener("focusout", restart);
    if (mode === "slide") {
      // keep index in step with native swipe scrolling
      var st = null;
      track.addEventListener("scroll", function () { clearTimeout(st); st = setTimeout(function () { var w = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0); var i = Math.round(track.scrollLeft / (w || 1)); if (i !== index && i < pages()) { index = i; paint(); } }, 80); }, { passive: true });
      window.addEventListener("resize", function () { go(Math.min(index, pages() - 1)); });
    } else {
      slides.forEach(function (s) { s.classList.add("tv-fade-slide"); });
    }
    if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "0");
    paint(); restart();
  });
  
  /* ---- reveal ---- */
  /* Scroll reveal: .tv-reveal (fade-up by default) or data-tv-reveal="fade|fade-up|fade-down|fade-left|fade-right|zoom|flip"
     data-tv-delay="ms"  data-tv-stagger="ms" on a parent staggers its .tv-reveal children. Respects reduced motion. */
  var revealEls = document.querySelectorAll(".tv-reveal, [data-tv-reveal]");
  if (revealEls.length) {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) revealEls.forEach(function (el) { el.classList.add("is-in"); });
    else {
      document.querySelectorAll("[data-tv-stagger]").forEach(function (p) { var ms = Number(p.getAttribute("data-tv-stagger")) || 100; [].slice.call(p.querySelectorAll(".tv-reveal, [data-tv-reveal]")).forEach(function (el, i) { if (!el.hasAttribute("data-tv-delay")) el.style.transitionDelay = (i * ms) + "ms"; }); });
      revealEls.forEach(function (el) { el.classList.add("tv-reveal"); var v = el.getAttribute("data-tv-reveal"); if (v) el.classList.add("tv-reveal--" + v); var d = el.getAttribute("data-tv-delay"); if (d) el.style.transitionDelay = d + "ms"; });
      var list = [].slice.call(revealEls);
      // an element that enters the viewport also reveals everything above it: a fast scroll or an
      // anchor jump must never leave a section invisible
      var rio = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (!en.isIntersecting) return; var top = en.boundingClientRect.top; list.forEach(function (el) { if (el.classList.contains("is-in")) return; if (el === en.target || el.getBoundingClientRect().top <= top) { el.classList.add("is-in"); rio.unobserve(el); } }); }); }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { rio.observe(el); });
    }
  }
  
  /* ---- backtop ---- */
  var backtop = document.querySelector("[data-tv-backtop]");
  if (backtop) {
    var onBt = function () { backtop.classList.toggle("is-visible", window.scrollY > 500); };
    onBt(); window.addEventListener("scroll", onBt, { passive: true });
    backtop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); });
  }
  
  /* ---- lazy ---- */
  /* Lazy backgrounds + iframes: [data-tv-bg="images/x.jpg"] gets its background when near the viewport;
     iframe[data-src] loads on approach. <img loading="lazy"> is native and needs nothing. */
  var lazyEls = document.querySelectorAll("[data-tv-bg], iframe[data-src], video[data-src]");
  if (lazyEls.length) {
    var load = function (el) { if (el.hasAttribute("data-tv-bg")) { el.style.backgroundImage = 'url("' + el.getAttribute("data-tv-bg") + '")'; el.classList.add("is-loaded"); } else { el.src = el.getAttribute("data-src"); } };
    if ("IntersectionObserver" in window) { var lio = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { load(en.target); lio.unobserve(en.target); } }); }, { rootMargin: "300px 0px" }); lazyEls.forEach(function (el) { lio.observe(el); }); }
    else lazyEls.forEach(load);
  }
  // fade images in as they finish loading
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) { if (img.complete) return; img.classList.add("tv-lazy"); img.addEventListener("load", function () { img.classList.add("is-loaded"); }, { once: true }); });
  /* ---- cookie ---- */
  var cookie = document.querySelector("[data-tv-cookie]");
  if (cookie) { var ok = false; try { ok = localStorage.getItem("tv-cookie") === "1"; } catch (e) {} if (!ok) cookie.classList.add("is-open"); var acc = cookie.querySelector("[data-tv-cookie-accept]"); if (acc) acc.addEventListener("click", function () { cookie.classList.remove("is-open"); try { localStorage.setItem("tv-cookie", "1"); } catch (e) {} }); }
  
  /* ---- modal ---- */
  /* [data-tv-modal="#id"] opens a native <dialog id>; [data-tv-modal-close] inside closes it */
  document.querySelectorAll("[data-tv-modal]").forEach(function (btn) {
    var d = document.querySelector(btn.getAttribute("data-tv-modal")); if (!d || !d.showModal) return;
    btn.addEventListener("click", function () { d.showModal(); });
    d.querySelectorAll("[data-tv-modal-close]").forEach(function (c) { c.addEventListener("click", function () { d.close(); }); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });
  })();
