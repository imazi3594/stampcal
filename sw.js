const CACHE = "stamp-calc-v77";
const SHELL = ["./index.html", "./", "./manifest.webmanifest", "./about-banner.jpg", "./favicon.svg", "./favicon-32.png", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

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

function poorNetwork() {
  if (!self.navigator.onLine) return true;
  const link = self.navigator.connection;
  if (!link) return false;
  if (link.saveData) return true;
  if (link.effectiveType === "slow-2g" || link.effectiveType === "2g") return true;
  if (typeof link.rtt === "number" && link.rtt >= 900) return true;
  if (typeof link.downlink === "number" && link.downlink > 0 && link.downlink < 0.35) return true;
  return false;
}

function fetchTimed(request, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(request, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function put(cache, request, response) {
  if (!response || !response.ok) return;
  try {
    const body = await response.clone().blob();
    await cache.put(
      request,
      new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      }),
    );
  } catch {
    /* ignore */
  }
}

async function warm(cache, url) {
  try {
    const response = await fetchTimed(url, 3000);
    if (!response.ok) return;
    await put(cache, url, response);
    if ((response.headers.get("content-type") || "").includes("text/html")) await put(cache, "./index.html", response);
  } catch {
    /* activate still proceeds with the previous copy */
  }
}

async function cachedDocument(cache, request) {
  const direct = await cache.match(request, { ignoreSearch: true });
  if (direct) return direct;
  for (const url of ["./index.html", "./", "index.html"]) {
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
      const reload = request.cache === "reload" || request.cache === "no-store";
      const cached = document ? await cachedDocument(cache, request) : await cache.match(request, { ignoreSearch: true });

      if (cached && !reload) return cached;

      if (poorNetwork() && document) {
        const page = await cachedDocument(cache, request);
        if (page) return page;
      }

      try {
        const response = await fetchTimed(request, poorNetwork() ? 1500 : 8000);
        if (response && response.ok) {
          await put(cache, request, response);
          if (document) await put(cache, "./index.html", response);
        }
        return response;
      } catch {
        return (await cachedDocument(cache, request)) || Response.error();
      }
    })(),
  );
});
