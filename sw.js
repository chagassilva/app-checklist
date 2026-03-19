const CACHE_NAME = "tld-app-v4";
const urlsToCache = ["./", "./index.html", "./manifest.json"];

// Instala o motor no celular
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Faz o app carregar rápido buscando do cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
