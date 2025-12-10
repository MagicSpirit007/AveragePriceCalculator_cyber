const CACHE_NAME = 'avg-price-calc-v2';

// Assets to cache immediately
// IMPORTANT: For Safari PWA, use relative paths.
// ALSO: Cache external CDNs so the app works if the internet cuts out or PWA starts offline.
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './manifest.json',
  // Tailwind
  'https://cdn.tailwindcss.com',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&family=DotGothic16&display=swap',
  // React & Lucide (As defined in importmap)
  'https://aistudiocdn.com/react@^19.2.1',
  'https://aistudiocdn.com/react-dom@^19.2.1',
  'https://aistudiocdn.com/lucide-react@^0.556.0'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Stale-While-Revalidate Strategy for best performance
  // It returns the cache immediately, then updates it in the background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
          return networkResponse;
        }

        // Clone and cache
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
           return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});