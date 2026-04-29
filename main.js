/* ═══════════════════════════════════════
   ENJOY SHOP — main.js v5
   ═══════════════════════════════════════ */

// ─── SPLASH ───
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => splash.classList.add('hide'), 1800);
  setTimeout(() => splash.remove(), 2500);
});

// ─── PROGRESS BAR ───
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  if (!bar) return;
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');
function toggleMenu(open) {
  if (!hamburger || !mobMenu) return;
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
if (hamburger) hamburger.addEventListener('click', () => toggleMenu(!hamburger.classList.contains('open')));
if (mobMenu) mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// ─── SCROLL REVEAL ───
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => ro.observe(el));

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = (navbar ? navbar.offsetHeight : 0) + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ─── ANIMATED COUNTERS ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target).toLocaleString('it-IT');
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('it-IT');
  }
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter-num').forEach(el => counterObs.observe(el));

// ─── MAGNETIC BUTTONS ───
document.querySelectorAll('.btn-mag').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ─── DRAG TO SCROLL ───
const dragEl = document.querySelector('.drag-scroll');
if (dragEl) {
  let isDown = false, startX, scrollLeft;
  dragEl.addEventListener('mousedown', e => {
    isDown = true; dragEl.classList.add('grabbing');
    startX = e.pageX - dragEl.offsetLeft;
    scrollLeft = dragEl.scrollLeft;
  });
  dragEl.addEventListener('mouseleave', () => { isDown = false; dragEl.classList.remove('grabbing'); });
  dragEl.addEventListener('mouseup', () => { isDown = false; dragEl.classList.remove('grabbing'); });
  dragEl.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    dragEl.scrollLeft = scrollLeft - (e.pageX - dragEl.offsetLeft - startX) * 1.5;
  });
}

// ─── FAQ ACCORDION ───
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = null;
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-a').style.maxHeight = item.querySelector('.faq-a').scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ─── FLIP CARDS (touch) ───
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ─── GLITCH HERO TEXT ───
const glitchEl = document.querySelector('.glitch');
if (glitchEl) glitchEl.setAttribute('data-text', glitchEl.textContent);

// ─── DARK MODE ───
(function initDarkMode() {
  const saved = localStorage.getItem('enjoy-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  const toggle = document.getElementById('dark-toggle');
  if (!toggle) return;

  function updateIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', isDark ? 'Attiva modalità chiara' : 'Attiva modalità scura');
  }
  updateIcon();

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('enjoy-theme', next);
    updateIcon();
  });
})();

// ─── STORE OPEN/CLOSED STATUS ───
(function initStoreStatus() {
  const badge = document.getElementById('store-status');
  if (!badge) return;

  function isOpenNow() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const h = now.getHours();
    const m = now.getMinutes();
    const mins = h * 60 + m;
    const open  = 9 * 60;       // 09:00
    const close = 19 * 60 + 30; // 19:30
    // Pogliano: tutti i giorni 09:00-19:30
    return mins >= open && mins < close;
  }

  function render() {
    const open = isOpenNow();
    badge.className = 'store-status ' + (open ? 'open' : 'closed');
    badge.innerHTML = `<span class="store-status-dot"></span>${open ? 'Aperto ora' : 'Chiuso ora'}`;
  }
  render();
  // aggiorna ogni minuto
  setInterval(render, 60000);
})();

// ─── COOKIE BANNER ───
(function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('enjoy-cookies')) return;

  // Mostra dopo 1.5s (dopo la splash)
  setTimeout(() => banner.classList.add('visible'), 2500);

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('enjoy-cookies', 'accepted');
    banner.classList.remove('visible');
  });
  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('enjoy-cookies', 'declined');
    banner.classList.remove('visible');
  });
})();

// ─── CUSTOM CURSOR ───
(function initCursor() {
  // Solo su dispositivi con puntatore preciso (desktop)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.classList.add('active');
    ring.classList.add('active');
  });

  // Ring segue con lerp
  (function animRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover su elementi interattivi
  const interactives = 'a, button, .btn, .flip-card, .cat-card, .faq-q, .prod-card';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    ring.classList.remove('active');
    dot.classList.remove('active');
  });
})();
