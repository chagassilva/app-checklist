const CACHE_NAME = "tld-app-v10"; // Incremente aqui para forçar atualização
const urlsToCache = ["./", "./index.html", "./manifest.json"];

// 1. Instalação: Salva os arquivos básicos
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// 2. Ativação: Limpa o lixo (caches antigos)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("Limpando cache antigo:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// 3. Estratégia Network First: Tenta sempre o que há de novo na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a rede responder, atualiza o cache e entrega o arquivo
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Se estiver sem internet, usa o que guardou no cache
        return caches.match(event.request);
      }),
  );
});
