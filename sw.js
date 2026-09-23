/* =========================================================================
   Gujarati Match & Learn — OFFLINE SUPPORT (service worker)
   -------------------------------------------------------------------------
   The game files are saved on the phone the first time the app opens,
   so it keeps working without internet.

   Updates: every time the app opens with internet, it quietly downloads
   the newest files. The child sees the new version the NEXT time the app
   is opened. You don't need to change anything in this file.
   (If you add a new file, add it to APP_FILES below.)
   ========================================================================= */
const CACHE = "gujarati-match-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Show the saved copy right away (fast + works offline),
   and fetch a fresh copy in the background for next time. */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isOwnFile = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!isOwnFile && !isFont) return;

  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(req, { ignoreSearch: isOwnFile }).then(cached => {
        const fresh = fetch(req)
          .then(res => {
            if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    )
  );
});
