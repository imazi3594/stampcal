const CACHE = "stamp-calc-v63";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./favicon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function sameOrigin(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch {
    return false;
  }
}

function fetchOnline(request, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(request, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || !sameOrigin(request)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached =
        (await cache.match(request)) ||
        (request.mode === "navigate" ? (await cache.match("./index.html")) || (await cache.match("./")) : undefined);

      if (!self.navigator.onLine) {
        return cached || offlineResponse(request);
      }

      try {
        const response = await fetchOnline(request, cached ? 1800 : 8000);
        if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
        return response;
      } catch {
        return cached || offlineResponse(request);
      }
    })(),
  );
});

function offlineResponse(request) {
  if (request.mode === "navigate") {
    return new Response("離線，請先在有網絡時開啟一次。", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response("", { status: 504 });
}
