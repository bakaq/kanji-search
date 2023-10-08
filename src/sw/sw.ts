const _self = (self as unknown) as ServiceWorkerGlobalScope;

const cacheName = "kanji-search-v9";

const filesToCache = [
  "./",
  "manifest.json",
  "images/icons/144.png",
  "images/icons/128.png",
  "index.html",
  "index.css",
  "radk.json",
  "kanjiInfo.json",
  "main/index.js",
  "main/components.js",
  "main/kanji.js",
  "main/kanjiInfo.js",
  "main/ComponentSearchPanel.js"
];


// Cache all of the content
_self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Delete old caches when updating
_self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key == cacheName) {
        return;
      }
      return caches.delete(key);
    }))
  }));
});

// Serve cached content when offline
_self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

