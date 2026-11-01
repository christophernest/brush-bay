// Keeps the app working offline. Change VERSION whenever any file changes, so devices pick up the new files.
const VERSION = "brush-bay-24";
const FILES = [
  "./", "index.html", "style.css", "app.js", "words.js", "characters.js", "pictures.js", "music.js",
  "vendor/hanzi-writer.min.js", "manifest.webmanifest",
  "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
];

// The voice clips are stored too, from the first visit and after every update, so the recorded voice works offline.
// "reload" skips the browser's own cache, so an update never stores an older copy of a file.
self.addEventListener("install", (e) => {
  const fresh = (url) => new Request(url, { cache: "reload" });
  e.waitUntil(caches.open(VERSION).then(async (c) => {
    await c.addAll(FILES.map(fresh));
    const list = await fetch(fresh("audio/clips.json")).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    if (list) await c.addAll(["audio/clips.json", ...list.clips.map((name) => "audio/" + name)].map(fresh)).catch(() => {});
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from the offline copy; anything not stored yet (like the voice clips) is fetched once and kept.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
    return res;
  })));
});
