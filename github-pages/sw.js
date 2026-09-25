const CACHE = "stamp-calc-v64";
const SHELL = ["./index.html", "./", "./manifest.webmanifest", "./favicon.svg", "./favicon-32.png", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(SHELL.map((url) => warm(cache, url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const names = await caches.keys();
      for (const name of names) {
        if (name === CACHE) continue;
        const old = await caches.open(name);
        for (const req of await old.keys()) {
          const res = await old.match(req);
          if (res) await put(cache, req, res);
        }
        await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

function sameOrigin(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch {
    return false;
  }
}

function isDocument(request) {
  if (request.mode === "navigate") return true;
  return (request.headers.get("accept") || "").includes("text/html");
}

async function put(cache, request, response) {
  if (!response || !response.ok) return;
  const body = await response.clone().blob();
  const copy = new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
  await cache.put(request, copy).catch(() => {});
}

async function warm(cache, url) {
  try {
    const response = await fetch(url, { cache: "reload" });
    if (!response.ok) return;
    await put(cache, url, response);
    if (isHtml(response)) await put(cache, "./index.html", response);
  } catch {
    /* offline install keeps whatever was migrated */
  }
}

function isHtml(response) {
  return (response.headers.get("content-type") || "").includes("text/html");
}

async function cachedDocument(cache, request) {
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  for (const url of ["./index.html", "./", "index.html", "/"]) {
    const page = await cache.match(url, { ignoreSearch: true });
    if (page) return page;
  }
  for (const req of await cache.keys()) {
    const path = new URL(req.url).pathname;
    if (path.endsWith(".html") || path.endsWith("/")) {
      const page = await cache.match(req);
      if (page) return page;
    }
  }
  return undefined;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || !sameOrigin(request)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const document = isDocument(request);
      const cached = document ? await cachedDocument(cache, request) : await cache.match(request, { ignoreSearch: true });

      if (!self.navigator.onLine) return cached || Response.error();

      try {
        const response = await fetch(request);
        if (response && response.ok) {
          await put(cache, request, response);
          if (document) await put(cache, "./index.html", response);
        }
        return response;
      } catch {
        return cached || Response.error();
      }
    })(),
  );
});
