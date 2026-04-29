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
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    dot.classList.add('active'); ring.classList.add('active');
  });
  (function animRing() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,.btn,.flip-card,.cat-card,.faq-q,.prod-card,.review-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  document.addEventListener('mouseleave', () => { ring.classList.remove('active'); dot.classList.remove('active'); });
})();

// ─── PARALLAX HERO ───
(function initParallax() {
  const img = document.querySelector('.hero-img-wrap img');
  if (!img || window.matchMedia('(max-width:768px)').matches) return;
  window.addEventListener('scroll', () => {
    img.style.transform = `translateY(${window.scrollY * 0.12}px)`;
  }, { passive: true });
})();

// ─── CARD TILT 3D ───
(function initTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.review-card, .fact-card, .flip-card').forEach(card => {
    card.classList.add('tilt-card');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-4px)`;
      card.style.boxShadow = `${-x * 8}px ${-y * 8}px 24px rgba(0,0,0,.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

// ─── GEOLOCATION PROXIMITY ───
(function initGeo() {
  const banner = document.getElementById('geo-banner');
  if (!banner || !navigator.geolocation) return;
  if (sessionStorage.getItem('enjoy-geo-dismissed')) return;

  // Coordinate negozi
  const stores = [
    { name: 'Pogliano Milanese', lat: 45.5381, lng: 8.9078, maps: 'https://maps.google.com/?q=Via+Monsignor+Paleari+90,+Pogliano+Milanese' },
    { name: 'Galliate', lat: 45.4774, lng: 8.6957, maps: 'https://maps.google.com/?q=Viale+Beato+Quagliotti+80,+Galliate' }
  ];

  function dist(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    let nearest = null, minDist = Infinity;
    stores.forEach(s => {
      const d = dist(lat, lng, s.lat, s.lng);
      if (d < minDist) { minDist = d; nearest = s; }
    });
    if (minDist > 40) return; // oltre 40km, non mostrare
    const km = minDist < 1 ? Math.round(minDist * 1000) + ' m' : minDist.toFixed(1) + ' km';
    banner.querySelector('.geo-text').innerHTML = `📍 Sei a <em>${km}</em> dal negozio di <em>${nearest.name}</em>!`;
    banner.querySelector('.geo-directions').href = nearest.maps;
    setTimeout(() => banner.classList.add('visible'), 3500);

    banner.querySelector('.geo-close').addEventListener('click', () => {
      banner.classList.remove('visible');
      sessionStorage.setItem('enjoy-geo-dismissed', '1');
    });
  }, () => {}, { timeout: 5000 });
})();

// ─── SERVICE WORKER ───
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ═══ WOW EFFECTS ═══

// HERO PARTICLE CANVAS
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - .5) * 0.4;
    this.vy = -Math.random() * 0.6 - 0.2;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > .5 ? '212,43,43' : '232,150,28';
  }

  for (let i = 0; i < 50; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.002;
      if (p.y < 0 || p.alpha <= 0) particles[i] = new Particle();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// BUTTON RIPPLE
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(r.width, r.height);
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// SCROLL HINT in hero (auto-hide on scroll)
(function initScrollHint() {
  const hint = document.querySelector('.scroll-hint');
  if (!hint) return;
  hint.addEventListener('click', () => {
    const next = document.querySelector('#chi-siamo');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) hint.style.opacity = '0';
    else hint.style.opacity = '1';
  }, { passive: true });
})();

// LATERAL REVEAL OBSERVER (rv-left, rv-right, rv-scale)
const roSide = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); roSide.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rv-left, .rv-right, .rv-scale').forEach(el => roSide.observe(el));

// ─── COUNTDOWN TO OPENING ───
(function initCountdown() {
  const bar = document.getElementById('store-countdown');
  const timeEl = document.getElementById('countdown-time');
  if (!bar || !timeEl) return;

  // Pogliano: 7/7 09:00-19:30
  function getNextOpen() {
    const now = new Date();
    const open = new Date(now);
    open.setHours(9, 0, 0, 0);
    const close = new Date(now);
    close.setHours(19, 30, 0, 0);
    if (now >= open && now < close) return null; // is open
    // If past close, next open is tomorrow
    if (now >= close) open.setDate(open.getDate() + 1);
    return open;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const next = getNextOpen();
    if (!next) { bar.classList.remove('visible'); return; }
    bar.classList.add('visible');
    const diff = next - Date.now();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  tick();
  setInterval(tick, 1000);
})();

// ─── SLOT MACHINE ───
(function initSlot() {
  const btn = document.getElementById('slot-btn');
  const resultEl = document.getElementById('slot-result');
  if (!btn || !resultEl) return;

  const categories = [
    { emoji: '🍳', name: 'Cucina' },
    { emoji: '🛁', name: 'Bagno' },
    { emoji: '🧹', name: 'Pulizia' },
    { emoji: '💡', name: 'Gadget' },
    { emoji: '🛏️', name: 'Camera' },
    { emoji: '🌿', name: 'Giardino' },
    { emoji: '🎁', name: 'Regali' },
    { emoji: '🪑', name: 'Arredo' },
    { emoji: '🧺', name: 'Organizer' },
    { emoji: '⚡', name: 'Smart Home' },
    { emoji: '🐾', name: 'Pet' },
    { emoji: '🧴', name: 'Cura Casa' },
  ];

  const funnyResults = [
    'Perfetto. Ora non hai scuse per non venire.',
    'Il destino ha parlato. Noi abbiamo tutto questo.',
    'Qualcuno lassù vuole che tu venga da noi.',
    'Tre ottimi motivi per uscire di casa.',
    'Già che ci sei, cerca anche le altre 9.997 cose.',
    'Vedi? Non dovevi nemmeno pensarci.',
  ];

  // Build reels
  [0, 1, 2].forEach(i => {
    const inner = document.getElementById(`reel-inner-${i}`);
    if (!inner) return;
    // Fill with shuffled categories x3 for scroll effect
    const items = [...categories, ...categories, ...categories];
    items.forEach(c => {
      const div = document.createElement('div');
      div.className = 'slot-item';
      div.innerHTML = `<span class="slot-item-emoji">${c.emoji}</span><span>${c.name}</span>`;
      inner.appendChild(div);
    });
  });

  let spinning = false;

  btn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    btn.disabled = true;
    resultEl.className = 'slot-result';
    resultEl.textContent = '';

    const chosen = [0, 1, 2].map(() => Math.floor(Math.random() * categories.length));

    [0, 1, 2].forEach((i, idx) => {
      const inner = document.getElementById(`reel-inner-${i}`);
      if (!inner) return;
      const targetIdx = categories.length + chosen[idx]; // second set
      const offset = -(targetIdx * 80);
      // Random extra spins for drama
      const spins = (3 + idx) * categories.length * 80;
      inner.style.transition = `transform ${0.7 + idx * 0.25}s cubic-bezier(0.23,1,0.32,1)`;
      inner.style.transform = `translateY(${offset - spins}px)`;
      // After animation, snap to correct position without transition
      setTimeout(() => {
        inner.style.transition = 'none';
        inner.style.transform = `translateY(${offset}px)`;
        document.getElementById(`reel-${i}`).classList.add('win-reel');
      }, (0.7 + idx * 0.25) * 1000 + 50);
    });

    const totalDuration = (0.7 + 2 * 0.25) * 1000 + 200;
    setTimeout(() => {
      spinning = false;
      btn.disabled = false;
      const names = chosen.map(idx => categories[idx].name).join(', ');
      const funny = funnyResults[Math.floor(Math.random() * funnyResults.length)];
      resultEl.textContent = `${names} — ${funny}`;
      resultEl.className = 'slot-result win';
    }, totalDuration);
  });
})();



