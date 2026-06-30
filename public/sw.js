// Basic Service Worker for PWA installability
const CACHE_NAME = 'jurnal-pwa-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle standard requests online
  // This event listener is required for PWA detection
});
