/**
 * CareFlow AI Service Worker
 * Full Offline Caching for Rural & Remote Healthcare Operations
 */

const CACHE_NAME = 'careflow-rural-offline-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.png',
  '/logo.png',
  '/manifest.webmanifest',
  '/assets/splash_center_logo_4k.png',
  '/assets/splash_center_logo.png',
  '/assets/splash_hospital_bg_4k.png',
  '/assets/splash_hospital_bg.png',
  '/assets/ai_robot_doctor_transparent.png',
  '/assets/ai_robot_doctor.png',
  '/assets/careflow_logo.png',
  '/assets/careflow_emblem_4k.png'
];

// Install event: Pre-cache core application shell and 4K assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching rural offline shell & assets...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some assets failed to pre-cache (harmless during dev):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network-first for dynamic data, Cache-first for offline static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't intercept POST requests in service worker cache (let api.ts & IndexedDB handle offline queue)
  if (request.method !== 'GET') {
    return;
  }

  // API calls: Network-first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static Assets & Navigation: Stale-while-revalidate / Cache-first
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh in background if online
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // If not cached, fetch from network and cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting page, return cached index.html
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
