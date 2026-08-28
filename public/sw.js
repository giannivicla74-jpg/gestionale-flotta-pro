
const CACHE_NAME = 'fleet-rentals-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.jpg',
  '/admin-logo.jpg'
];

self.addEventListener('install', event => {
  // Skip waiting allows the new service worker to take over immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Claim clients so the new SW applies immediately
  event.waitUntil(self.clients.claim());
  
  // Delete old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Network-first strategy for index.html to ensure we always get updates
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || event.request.url.includes('index.html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Cache-first for images/assets
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});
