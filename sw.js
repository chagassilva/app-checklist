const CACHE_NAME = "tld-app-v5"; // Sempre suba essa versão ao mudar algo
const urlsToCache = ["./", "./index.html", "./manifest.json"];

// 1. Instalação: Força o novo SW a se tornar ativo imediatamente
self.addEventListener("install", (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Ativação: Limpa caches antigos (ex: apaga o v4 quando o v5 instalar)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle das páginas abertas
  );
});

// 3. Fetch: Busca no cache, mas se não achar, vai na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
