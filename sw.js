/// <reference lib="WebWorker" />
var _self = self;
var cacheName = "kanji-search-v8";
var filesToCache = [
    "./",
    "manifest.json",
    "images/icons/144.png",
    "images/icons/128.png",
    "index.html",
    "index.css",
    "radk.json",
    "kanjiInfo.json",
    "release/index.js",
    "release/components.js",
    "release/kanji.js",
    "release/kanjiInfo.js",
    "release/ComponentSearchPanel.js"
];
// Cache all of the content
_self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(cacheName).then(function (cache) {
        return cache.addAll(filesToCache);
    }));
});
// Delete old caches when updating
_self.addEventListener("activate", function (e) {
    e.waitUntil(caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
            if (key == cacheName) {
                return;
            }
            return caches["delete"](key);
        }));
    }));
});
// Serve cached content when offline
_self.addEventListener("fetch", function (e) {
    e.respondWith(caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
    }));
});
