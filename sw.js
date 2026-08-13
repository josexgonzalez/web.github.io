/* PS5 offline cache - service worker */
const CACHE_NAME = "ps5-offline-v10-20";
const PRECACHE = ["app.js","cache-test.html","index.html","payloads/payload.elf","placeholder.txt","slopkit/README.md","slopkit/document/en/ps5/index.html","slopkit/index.html","slopkit/offsets/10.00.js","slopkit/offsets/10.01.js","slopkit/offsets/10.20.js","slopkit/offsets/10.40.js","slopkit/offsets/10.60.js","slopkit/offsets/11.00.js","slopkit/offsets/11.20.js","slopkit/offsets/11.40.js","slopkit/offsets/11.60.js","slopkit/offsets/12.00.js","slopkit/offsets/9.00.js","slopkit/offsets/9.05.js","slopkit/offsets/9.20.js","slopkit/offsets/9.40.js","slopkit/offsets/9.60.js","slopkit/payloads/elfldr-ps5-1360.elf","slopkit/payloads/kexp_2026_05_25.bin","slopkit/slopkit/cat.jpg","slopkit/slopkit/core.js","slopkit/slopkit/core.js?v=10","slopkit/slopkit/int64.js","slopkit/slopkit/main.js","slopkit/slopkit/main.js?v=19","slopkit/slopkit/mem.js","slopkit/slopkit/poops.html","slopkit/slopkit/poops.html?go=1&auto=1&production=1&trigger=netcontrol&attempts=8&only=ps0_preflight,ps1_prepare,ps3_stage0,ps4_validate,ps5_stage1,ps6_stage2,ps8_stage3,ps9_stage4,ps10_stage5&log=debug&payload=1&autoload=payload.elf&v=41","slopkit/slopkit/poops.js","slopkit/slopkit/poops.js?v=37","slopkit/slopkit/rop.js","slopkit/slopkit/rop_slave.js","slopkit/slopkit/syscalls.js","slopkit/ui/payload-ftp-default.png","slopkit/ui/payload-ftp-failed.png","slopkit/ui/payload-ftp-sending.png","slopkit/ui/payload-ftp-sent.png","slopkit/ui/payload-gdb-default.png","slopkit/ui/payload-gdb-failed.png","slopkit/ui/payload-gdb-sending.png","slopkit/ui/payload-gdb-sent.png","slopkit/ui/payload-klog-default.png","slopkit/ui/payload-klog-failed.png","slopkit/ui/payload-klog-sending.png","slopkit/ui/payload-klog-sent.png","slopkit/ui/payload-kstuff-default.png","slopkit/ui/payload-kstuff-failed.png","slopkit/ui/payload-kstuff-sending.png","slopkit/ui/payload-kstuff-sent.png","slopkit/ui/payload-menu-title.png","slopkit/ui/payload-plk-default.png","slopkit/ui/payload-plk-failed.png","slopkit/ui/payload-plk-sending.png","slopkit/ui/payload-plk-sent.png","slopkit/ui/payload-shell-default.png","slopkit/ui/payload-shell-failed.png","slopkit/ui/payload-shell-sending.png","slopkit/ui/payload-shell-sent.png","slopkit/ui/payload-web-default.png","slopkit/ui/payload-web-failed.png","slopkit/ui/payload-web-sending.png","slopkit/ui/payload-web-sent.png","style.css"];

function localPath(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/^\//, "");
  if (u.search) {
    const exact = p + u.search;
    if (PRECACHE.indexOf(exact) !== -1) return exact;
  }
  return p;
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const item of PRECACHE) {
        try {
          const r = await fetch(new Request(new URL(item, self.registration.scope), {cache:"reload"}));
          if (r.ok) await cache.put(new URL(item, self.registration.scope), r.clone());
        } catch(e) {
          // Keep installing; a later retry can fill a missing optional item.
        }
      }
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req=event.request;
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    const cache=await caches.open(CACHE_NAME);
    const hit=await cache.match(req);
    if (hit) return hit;

    // For navigation requests, if offline and the exact URL wasn't cached,
    // fall back to the packaged launcher.
    try {
      return await fetch(req);
    } catch(e) {
      const fallback=await cache.match(new URL("index.html", self.registration.scope).href);
      if (fallback) return fallback;
      throw e;
    }
  })());
});
