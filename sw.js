const CACHE_NAME = "samdech-ouv-cache-v17";
const ASSETS = [
    "./",
    "./index.html",
    "./app.js",
    "./styles.css",
    "./icon-512.png",
    "./icon-512.jpg",
    "./icon-192.png",
    "./icon-192.jpg",
    "./school_gate.jpg",
    "./manifest.json"
];

// Install event
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Caching assets...");
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event (Cache-first falling back to network)
self.addEventListener("fetch", event => {
    // Only handle local HTTP/HTTPS requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Return cached asset, fetch in background to update cache (stale-while-revalidate)
                fetch(event.request).then(networkResponse => {
                    if (networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
                    }
                }).catch(() => {/* Ignore network error offline */});
                
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
