// Lummi: guarda o programa, as músicas e os vídeos neste computador
const V = 'lummi-1795474263';
const FILES = ["musicas/apl.mp3", "musicas/c01.mp3", "musicas/c09.mp3", "musicas/c14.mp3", "musicas/c16.mp3", "musicas/c16b.mp3", "musicas/c24.mp3", "musicas/d01.mp3", "musicas/d02.mp3", "musicas/d03.mp3", "musicas/d04.mp3", "musicas/d05.mp3", "musicas/d06.mp3", "musicas/d07.mp3", "musicas/d08.mp3", "musicas/d09.mp3", "musicas/d10.mp3", "musicas/d11.mp3", "musicas/d12.mp3", "musicas/d13.mp3", "musicas/dcl.mp3", "videos/c01h.mp4.p0.mp4", "videos/c24.mp4.p0.mp4", "videos/c24.mp4.p1.mp4", "videos/d04h.mp4.p0.mp4", "videos/d04h.mp4.p1.mp4", "videos/d04h.mp4.p2.mp4", "videos/d04h.mp4.p3.mp4", "videos/d05h.mp4.p0.mp4", "videos/d06h.mp4.p0.mp4", "videos/d06h.mp4.p1.mp4", "videos/d07h.mp4.p0.mp4", "videos/d07h.mp4.p1.mp4", "videos/d07h.mp4.p2.mp4", "videos/d07h.mp4.p3.mp4", "videos/d08ah.mp4.p0.mp4", "videos/d08bh.mp4.p0.mp4", "videos/d08bh.mp4.p1.mp4", "videos/d08bh.mp4.p2.mp4", "videos/d13.mp4.p0.mp4", "videos/jesusk.mp4.p0.mp4", "videos/jesusk.mp4.p1.mp4"];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => Promise.all(['./', ...FILES].map(u => c.add(u).catch(() => {}))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (u.origin !== location.origin || e.request.method !== 'GET') return;
  if (e.request.headers.has('range')) return;            // áudio/vídeo com intervalo: deixa a rede/IndexedDB cuidar
  const page = e.request.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html');
  if (page){ // programa: tenta a versão nova; sem internet, usa a guardada
    e.respondWith(fetch(e.request.url, {cache: 'no-store'}).then(r => { const c = r.clone(); caches.open(V).then(x => x.put('./', c)); return r; }).catch(() => caches.match('./')));
  } else {   // músicas e vídeos: do computador primeiro
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { if (r.ok){ const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; })));
  }
});
