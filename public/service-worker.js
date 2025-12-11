const CACHE_NAME = 'avg-price-calc-v6';

// Precache app shell; runtime caching will pick up hashed assets and externals after first online load.
const PRECACHE_ASSETS = ['/', '/index.html', '/manifest.json', '/index.tsx'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        // Avoid install failure if any single precache item blows up.
        console.warn('[SW] Precache skipped item:', err);
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle safe, cacheable requests; let everything else fall through.
  if (request.method !== 'GET') {
    return;
  }

  const offlineFallback = async () =>
    (await caches.match('/index.html')) ||
    new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });

  // For navigation requests, try network first, then fallback to cached index.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        } catch (err) {
          const cached = (await caches.match(request)) || (await caches.match('/index.html'));
          return cached || offlineFallback();
        }
      })()
    );
    return;
  }

  // Cache-first for same-origin GET; network fallback with background refresh.
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);

      const fetchPromise = (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || offlineFallback();
        }
      })();

      // Return cache immediately if present; else wait for network.
      return cachedResponse || fetchPromise;
    })()
  );
});
