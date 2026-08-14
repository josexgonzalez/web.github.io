/* Incremental offline cache */
const CACHE_NAME = "app-incremental-cache-v1";
const META_CACHE = "app-incremental-meta-v1";

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== META_CACHE)
             .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (!event.data || event.data.type !== "CACHE_REFRESH") return;

  event.waitUntil((async () => {
    const payload = event.data.resources || [];
    const cache = await caches.open(CACHE_NAME);
    const oldMeta = await caches.open(META_CACHE);
    const result = {total: payload.length, updated: 0, reused: 0, failed: []};

    for (const item of payload) {
      const url = new URL(item.url, self.registration.scope).href;
      const key = new Request(url, {method:"GET"});
      const previous = await oldMeta.match(key);
      let oldHash = null;

      if (previous) {
        try {
          const m = await previous.json();
          oldHash = m.sha256 || null;
        } catch (_) {}
      }

      if (oldHash === item.sha256 && await cache.match(key)) {
        result.reused++;
        continue;
      }

      try {
        const response = await fetch(url, {cache:"no-store"});
        if (!response.ok) throw new Error("HTTP " + response.status);
        await cache.put(key, response.clone());
        await oldMeta.put(
          key,
          new Response(JSON.stringify({
            sha256:item.sha256,
            bytes:item.bytes
          }), {headers:{"Content-Type":"application/json"}})
        );
        result.updated++;
      } catch (e) {
        result.failed.push({url:item.url,error:String(e)});
      }
    }

    // Remove resources no longer present in the manifest.
    const keep = new Set(payload.map(x => new URL(x.url, self.registration.scope).href));
    for (const req of await cache.keys()) {
      if (!keep.has(req.url)) await cache.delete(req);
    }

    for (const client of await self.clients.matchAll()) {
      client.postMessage({type:"CACHE_RESULT", result});
    }
  })());
});
