// Lets Church Mind be installed like an app and played without internet.
//
// The game's own files are kept in APP. Recorded voices are kept separately in
// AUDIO (the same name is used in src/game/offline.ts), so a new version of
// the game never throws away voices a player has already saved.
const APP = "church-mind-app-v1";
const AUDIO = "church-mind-audio";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./favicon.svg", "./icons/icon-192.png", "./audio/manifest.json"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(APP).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name.startsWith("church-mind-app-") && name !== APP) await caches.delete(name);
      }
      await self.clients.claim();
    })()
  );
});

// Audio players ask for part of a file at a time. Answer from the saved whole.
async function slice(request, response) {
  const range = /bytes=(\d+)-(\d*)/.exec(request.headers.get("range") || "");
  if (!range) return response;
  const data = await response.arrayBuffer();
  const start = Number(range[1]);
  const end = range[2] ? Math.min(Number(range[2]), data.byteLength - 1) : data.byteLength - 1;
  return new Response(data.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${data.byteLength}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

// Files whose names change whenever their contents do: safe to keep for ever.
async function keep(cacheName, request) {
  const cache = await caches.open(cacheName);
  const saved = await cache.match(request.url);
  if (saved) return slice(request, saved);
  const fresh = await fetch(request.url);
  if (fresh.ok) await cache.put(request.url, fresh.clone());
  return slice(request, fresh);
}

// Everything else: the newest copy when online, the saved copy when not.
async function freshest(request) {
  const cache = await caches.open(APP);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) await cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const saved = (await cache.match(request)) || (request.mode === "navigate" ? await cache.match("./index.html") : null);
    return saved || new Response("You are offline.", { status: 503, statusText: "Offline" });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const fonts = url.hostname === "fonts.gstatic.com" || url.hostname === "fonts.googleapis.com";
  if (url.origin !== self.location.origin && !fonts) return;

  if (url.pathname.endsWith(".mp3")) event.respondWith(keep(AUDIO, request));
  else if (url.pathname.includes("/assets/") || url.hostname === "fonts.gstatic.com") event.respondWith(keep(APP, request));
  else event.respondWith(freshest(request));
});
