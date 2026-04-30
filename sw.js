/* ═══════════════════════════════════════
   ENJOY SHOP — Service Worker v2
   Cache-first per assets statici
   ═══════════════════════════════════════ */

const CACHE = 'enjoy-shop-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  '/404.html',
  '/assets/images/logo.png',
  '/assets/images/hero-bg.png',
  '/assets/images/og-preview.png',
  /* Prodotti */
  '/assets/images/product-1.png',
  '/assets/images/product-2.png',
  '/assets/images/product-3.png',
  '/assets/images/product-4.png',
  '/assets/images/product-5.png',
  '/assets/images/product-padelle.png',
  '/assets/images/product-organizer.png',
  '/assets/images/product-bagno.png',
  '/assets/images/product-pulizia.png',
  /* Categorie */
  '/assets/images/universo-cucina.png',
  '/assets/images/universo-cura.png',
  '/assets/images/universo-smartworking.png',
  '/assets/images/universo-sonno.png',
  '/assets/images/universo-giardino.png',
  '/assets/images/universo-arredamento.png',
  /* Avatar recensioni */
  '/assets/images/avatar-anna.jpg',
  '/assets/images/avatar-francesco.jpg',
  '/assets/images/avatar-giorgio.jpg',
  '/assets/images/avatar-luca.jpg',
  '/assets/images/avatar-maria.jpg',
  '/assets/images/avatar-sara.jpg'
];

// Install: pre-cache tutti gli asset
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: pulisci vecchie cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, poi network
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
