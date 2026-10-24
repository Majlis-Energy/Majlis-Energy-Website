/* Majlis Energy — header state, mobile menu, scroll reveals, hero line field
   and Insights filters. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Header: solid background once the page scrolls. */
  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Mobile menu: full-screen overlay below 960px. */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-navigation');
  if (toggle && nav && header) {
    var label = toggle.querySelector('.menu-toggle-label');
    toggle.hidden = false;

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
      header.classList.toggle('menu-open', open);
      root.classList.toggle('menu-locked', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 960px)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* Reveal-on-scroll. Content is visible by default without JS or IntersectionObserver. */
  var revealables = document.querySelectorAll('[data-reveal], .figure');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Hero: slow-moving bundle of flow lines converging toward the right. */
  document.querySelectorAll('.hero-canvas').forEach(function (canvas) {
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    var density = Number(canvas.getAttribute('data-lines')) || 28;
    var width = 0;
    var height = 0;
    var time = Math.random() * 100;
    var frame = null;
    var last = 0;
    var inView = true;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }

    function lineY(p, nx) {
      var spread = 0.16 + 0.95 * Math.pow(nx - 0.74, 2);
      var wave = Math.sin(nx * 3.1 + time * 0.55 + p * 2.6) * 0.045 * (0.35 + p)
               + Math.sin(nx * 7.3 - time * 0.35 + p * 5.1) * 0.012;
      return height * (0.56 + (p - 0.5) * spread + wave);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      var step = Math.max(6, Math.round(width / 220));
      var accentIndex = Math.round(density * 0.62);

      for (var i = 0; i < density; i++) {
        var p = i / (density - 1);
        ctx.beginPath();
        for (var x = 0; x <= width + step; x += step) {
          var y = lineY(p, x / width);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        if (i === accentIndex) {
          var gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, 'rgba(31,111,209,0)');
          gradient.addColorStop(0.45, 'rgba(31,111,209,0.85)');
          gradient.addColorStop(1, 'rgba(229,65,45,0.9)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.05 + 0.13 * Math.sin(Math.PI * p)).toFixed(3) + ')';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
    }

    function tick(now) {
      frame = null;
      if (!inView || document.hidden) return;
      if (now - last > 33) {
        time += 0.012;
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (!reduceMotion.matches && frame === null) frame = requestAnimationFrame(tick);
    }

    resize();
    start();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start();
      }).observe(canvas);
    }

    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    reduceMotion.addEventListener('change', start);
  });

  /* Insights: filter the library by category. */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-category]');
    var status = document.querySelector('[data-filter-status]');
    filterBar.hidden = false;

    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-filter]');
      if (!button) return;
      var value = button.getAttribute('data-filter');
      var shown = 0;

      filterBar.querySelectorAll('button[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });

      cards.forEach(function (card) {
        var match = value === 'all' || card.getAttribute('data-category') === value;
        card.hidden = !match;
        if (match) shown++;
      });

      if (status) status.textContent = shown + (shown === 1 ? ' article' : ' articles') + ' shown';
    });
  }
})();
