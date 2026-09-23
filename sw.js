const CACHE = "forever-path-v4";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest", "./icon.svg",
  "./src/app.js", "./src/storage.js", "./src/route-engine.js", "./src/sync.js",
  "./data/game-data.js", "./data/route-packs.js", "./data/quest-database.js",
  "./DATA_SCHEMA.md", "./SOURCES.md", "./CHANGELOG.md", "./SYNC_GUIDE.md"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", event => event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request))));
