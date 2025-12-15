const CACHE_NAME = 'avg-price-calc-v9';

// Precache app shell; runtime caching will pick up hashed assets and externals after first online load.
const toScopeUrl = (path) => new URL(path, self.registration.scope).toString();

const PRECACHE_ASSETS = [toScopeUrl('./'), toScopeUrl('./index.html'), toScopeUrl('./manifest.json')];

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
    (await caches.match(toScopeUrl('./index.html'))) ||
    new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });

  // For navigation requests, try network first, then fallback to cached index.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const indexUrl = toScopeUrl('./index.html');

        // Cache-first for navigations (fast startup), with background revalidation.
        const cachedIndex = await caches.match(indexUrl);
        if (cachedIndex) {
          event.waitUntil(
            (async () => {
              try {
                const response = await fetch(new Request(indexUrl, { cache: 'no-store' }));
                if (response && response.ok) {
                  await cache.put(indexUrl, response.clone());
                }
              } catch (err) {
                // Ignore background update failures.
              }
            })()
          );
          return cachedIndex;
        }

        // First-load (no cache yet): fall back to network.
        try {
          const response = await fetch(request);
          if (response && response.ok) {
            await cache.put(indexUrl, response.clone());
          }
          return response;
        } catch (err) {
          return offlineFallback();
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
          // For cross-origin requests (CDNs/fonts), response can be opaque (status 0) but still cacheable.
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
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
