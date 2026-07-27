const CACHE_NAME = 'jurnal-pwa-cache-v2';

const PRECACHE_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/images/Logo.png',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/schedule/data.json' // pre-cache offline schedule data if present
];

// Install Event - Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Try to add all assets, ignoring failures of non-essential files if any
        return Promise.allSettled(
          PRECACHE_ASSETS.map((asset) => cache.add(asset).catch(err => {
            console.warn(`Failed to precache: ${asset}`, err);
          }))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('jurnal-pwa-cache-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Bypass Service Worker caching in development (localhost) to avoid HMR and chunk caching conflicts
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Bypass API routes and external Supabase endpoints (always network-only)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    return;
  }

  // Bypass Next.js HMR/webpack hot-update assets in development
  if (url.pathname.includes('hot-update') || url.pathname.includes('webpack') || url.pathname.startsWith('/_next/webpack-hmr')) {
    return;
  }

  // Strategy: Network-First for HTML/document pages
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, try serving from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback if not found in cache
            return caches.match('/login') || caches.match('/');
          });
        })
    );
    return;
  }

  // Strategy: Cache-First for static assets (Next.js static assets with hashes are immutable)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.includes('/images/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Strategy: Stale-While-Revalidate for other assets (CSS, JS, fonts, manifest)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});

