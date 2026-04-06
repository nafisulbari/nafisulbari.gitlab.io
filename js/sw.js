const CACHE_NAME = 'bhc-assets-v3';
const ASSET_URLS = [
'/image/bh-cover-image2.jpg',
'/image/logo.png',
'/image/season1webp/02.webp',
'/image/season1webp/03.webp',
'/image/season1webp/04.webp',
'/image/season1webp/05.webp',
'/image/season1webp/06.webp',
'/image/season1webp/07.webp',
'/image/season1webp/08.webp',
'/image/season1webp/09.webp',
'/image/season1webp/10.webp',
'/image/season1webp/11.webp',
'/image/season1webp/12.webp',
'/image/season1webp/13.webp',
'/image/season1webp/14.webp',
'/image/season1webp/15.webp',
'/image/season1webp/16.webp',
'/image/season1webp/17.webp',
'/image/season1webp/18.webp',
'/image/season1webp/19.webp',
'/image/season1webp/20.webp',
'/image/season1webp/21.webp',
'/image/season2webp/01.webp',
'/image/season2webp/02.webp',
'/image/season2webp/03.webp',
'/image/season2webp/04.webp',
'/image/season2webp/05.webp',
'/image/season2webp/06.webp',
'/image/season2webp/07.webp',
'/image/season2webp/08.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSET_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const dest = req.destination;

  // handle images (and optionally videos) but do not cache partial responses (206)
  if (dest === 'image' || dest === 'video') {
    event.respondWith(
      caches.match(req).then((cached) => {
        const networkFetch = fetch(req).then((res) => {
          // if response is partial (206) or not ok, do not cache it
          if (!res || !res.ok || res.status === 206) {
            return res;
          }
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});