const CACHE_VERSION = 'v2.0.1';
const APP_SHELL = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', (event) => {event.waitUntil(caches.open(CACHE_VERSION).then((c)=>c.addAll(APP_SHELL)));self.skipWaiting();});
self.addEventListener('activate', (event) => {event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.map((k)=>(k!==CACHE_VERSION?caches.delete(k):null)))));self.clients.claim();});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method === 'GET' && new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached)=>{
        return cached || fetch(request).then((resp)=>{
          const copy=resp.clone();
          caches.open(CACHE_VERSION).then((c)=>c.put(request, copy));
          return resp;
        }).catch(()=>caches.match('./index.html'));
      })
    );
    return;
  }
});