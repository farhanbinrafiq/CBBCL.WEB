const CACHE_NAME = "cbbcl-cache-v1";
const OFFLINE_URL = "/offline.html";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/android-chrome-192x192.png",
  "/site.webmanifest"
];

// Install service worker and cache shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching shell assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate and remove old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch caching / dynamic handler with offline fallback
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API calls & dev socket connections
  if (url.pathname.startsWith("/api") || ioRelated(url)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached page immediately, but fetch behind the scenes to refresh cache (Stale-While-Revalidate)
        if (event.request.mode === "navigate") {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => { /* ignore offline fetch fail here */ });
        }
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Check if response is valid to cache
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }

          // Cache newly fetched assets dynamically
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Failure / offline handler
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

function ioRelated(url) {
  return url.pathname.includes("socket.io") || url.pathname.includes("@vite") || url.pathname.includes("hot-update");
}

// Handle update skip waiting postmessages
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
