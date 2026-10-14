/* Generat de build.py. Pozele, fonturile, bibliotecile și modelul 3D stau în cache pe dispozitiv
   (GitHub Pages le dă doar 10 minute); HTML, CSS și JS vin mereu de pe server.
   Versiunea se schimbă când se schimbă orice fișier din folderele de mai jos, iar cache-ul vechi se șterge. */
const CACHE = 'arc-fa271431fe';
const HEAVY = /\/assets\/(img|fonts|vendor|3d)\//;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('arc-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !HEAVY.test(new URL(r.url).pathname) || r.headers.has('range')) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok && res.type === 'basic') c.put(r, res.clone());
    return res;
  }))));
});
