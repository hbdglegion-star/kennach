// Kennach : app disponible hors connexion (les notes sont gérées par Firestore)
const C="kennach-v22";const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 const static_=u.origin===location.origin||u.hostname==="www.gstatic.com"||u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com";if(!static_)return;
 if(r.mode==="navigate"||u.pathname.endsWith("/index.html")){e.respondWith(fetch(r,{cache:"no-store"}).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put("./index.html",cp));return x}).catch(()=>caches.match("./index.html")));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==="opaque"){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x})))});
// rappel touché : on ouvre la note dans l'appli
self.addEventListener("notificationclick",e=>{e.notification.close();const id=e.notification.data&&e.notification.data.id;e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(L=>{const c=L[0];if(c){c.postMessage({kOpen:id});return c.focus()}return self.clients.openWindow("./"+(id?"?open="+encodeURIComponent(id):""))}))});
