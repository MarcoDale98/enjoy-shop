/* ═══════════════════════════════════════
   ENJOY SHOP — main.js v4 FULL INTERACTIVE
   ═══════════════════════════════════════ */

// ─── SPLASH ───
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => splash.classList.add('hide'), 1800);
  setTimeout(() => splash.remove(), 2400);
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
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
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
    btn.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => btn.style.transition = '', 400);
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
    });
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-a').style.maxHeight = item.querySelector('.faq-a').scrollHeight + 'px';
    }
  });
});

// ─── FLIP CARDS (touch support) ───
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ─── GLITCH HERO TEXT ───
const glitchEl = document.querySelector('.glitch');
if (glitchEl) glitchEl.setAttribute('data-text', glitchEl.textContent);
