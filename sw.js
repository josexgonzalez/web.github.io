const CACHE="app-full-hybrid-v1";
self.addEventListener("install",e=>e.waitUntil(self.skipWaiting()));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith((async()=>{
  const c=await caches.open(CACHE), hit=await c.match(e.request);
  if(hit)return hit;
  try{return await fetch(e.request)}
  catch(err){
   if(e.request.mode==="navigate"){
    const f=await c.match(new URL("index.html",self.registration.scope));
    if(f)return f;
   }
   throw err;
  }
 })());
});
