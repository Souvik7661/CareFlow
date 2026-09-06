/**
 * CareFlow AI Service Worker (Rural Healthcare Offline Resilience)
 * Comprehensive offline caching for remote clinics, rural workers & zero-connectivity zones.
 */

const CACHE_NAME = 'careflow-rural-offline-v2';

// Base static assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.png',
  '/favicon.svg',
  '/icon-512.png',
  '/logo.png',
  '/manifest.webmanifest',
  '/manifest.android.json',
  '/manifest.ios.json',
  '/browserconfig.xml',
  '/assets/splash_center_logo_4k.png',
  '/assets/splash_center_logo.png',
  '/assets/splash_hospital_bg_4k.png',
  '/assets/splash_hospital_bg.png',
  '/assets/ai_robot_doctor_transparent.png',
  '/assets/ai_robot_doctor.png',
  '/assets/ai_doctor_avatar.png',
  '/assets/careflow_logo.png',
  '/assets/careflow_emblem_4k.png',
  '/assets/careflow_emblem.png',
  '/assets/careflow_emblem_transparent.png',
  '/assets/careflow_logo_transparent.png',
  '/assets/careflow_logo_white_text.png',
  '/assets/careflow_official_logo.png'
];

// Injected by postbuild script during production build
// @INJECT_BUILD_ASSETS_START@
const DYNAMIC_BUILD_ASSETS = [];
// @INJECT_BUILD_ASSETS_END@

// Install event: Pre-cache core shell & production bundles
self.addEventListener('install', (event) => {
  self.skipWaiting();
  const allAssets = Array.from(new Set([...STATIC_ASSETS, ...DYNAMIC_BUILD_ASSETS]));
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log(`[CareFlow SW] Precaching ${allAssets.length} rural offline assets...`);
      // Cache assets safely one by one so single 404s don't abort the whole precache
      await Promise.allSettled(
        allAssets.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch((err) => {
              console.debug(`[CareFlow SW] Asset skipped during install (${url}):`, err.message);
            })
        )
      );
    })
  );
});

// Activate event: Clean up previous caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log(`[CareFlow SW] Purging obsolete cache: ${key}`);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: fetch with network timeout
function fetchWithTimeout(request, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('CareFlow Network Timeout (Rural Mode Activated)'));
    }, timeoutMs);

    fetch(request)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Fetch event: Network-first for navigation, Cache-first for assets, offline fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Allow non-GET requests to pass to network/offline client handlers
  if (request.method !== 'GET') {
    return;
  }

  // 1. Navigation requests (Opening the site or refreshing page while offline)
  const isNavigation = request.mode === 'navigate' || 
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      fetchWithTimeout(request, 1800)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          }
          return networkRes;
        })
        .catch(async () => {
          // Zero Network Zone / Wi-Fi disconnected on phone!
          console.log('[CareFlow SW] Serving offline index.html shell');
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;
          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;

          return new Response(
            `<!doctype html><html><head><meta charset="utf-8"/><title>CareFlow Offline</title></head><body style="background:#060c18;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>CareFlow Offline Storage</h2><p>Please reopen with internet once to cache all clinical tools.</p></body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. API requests (/api/*)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkRes;
        })
        .catch(async () => {
          // Check if cached response is available
          const cached = await caches.match(request);
          if (cached) return cached;

          // Synthetic offline response for endpoints
          return new Response(
            JSON.stringify({ 
              offline: true, 
              status: 'offline_mode',
              message: 'CareFlow client operating from local SQLite/IndexedDB storage'
            }),
            { 
              status: 200, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        })
    );
    return;
  }

  // 3. Static assets: Scripts, Styles, Fonts, Images (.js, .css, .woff2, images)
  event.respondWith(
    caches.match(request).then(async (cachedRes) => {
      if (cachedRes) {
        // Stale-While-Revalidate: serve cached version immediately, revalidate in background if online
        if (navigator.onLine) {
          fetch(request)
            .then((freshRes) => {
              if (freshRes && freshRes.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, freshRes));
              }
            })
            .catch(() => {});
        }
        return cachedRes;
      }

      // Not in cache yet, try fetching from network
      try {
        const networkRes = await fetch(request);
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkRes;
      } catch (err) {
        // If offline and request is a JS script or CSS file, try finding any cached bundle
        const pathname = url.pathname;
        if (pathname.endsWith('.js') || request.destination === 'script') {
          const keys = await caches.open(CACHE_NAME).then((c) => c.keys());
          const match = keys.find((k) => k.url.includes('/assets/index-') && k.url.endsWith('.js'));
          if (match) {
            console.log('[CareFlow SW] Serving fallback JS chunk for offline mode');
            return caches.match(match);
          }
        }

        if (pathname.endsWith('.css') || request.destination === 'style') {
          const keys = await caches.open(CACHE_NAME).then((c) => c.keys());
          const match = keys.find((k) => k.url.includes('/assets/index-') && k.url.endsWith('.css'));
          if (match) {
            console.log('[CareFlow SW] Serving fallback CSS stylesheet for offline mode');
            return caches.match(match);
          }
        }

        // Return empty or error response
        return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
      }
    })
  );
});
