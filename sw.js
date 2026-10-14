/* Funzionamento offline. A ogni aggiornamento dell'app aumentare VERSIONE.
   I file vengono sempre scaricati freschi dal server (cache: 'reload'), non dalla memoria temporanea del browser. */
var VERSIONE = 'm40-v1.6.5';
var FILE = ['./', 'index.html', 'style.css', 'moduli.js', 'app.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSIONE).then(function (c) { return Promise.all(FILE.map(function (f) { return fetch(new Request(f, {cache: 'reload'})).then(function (r) { if (!r.ok) throw new Error(f); return c.put(f, r); }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== VERSIONE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
/* Risponde subito dalla copia sul telefono (anche senza linea); se c'è linea aggiorna la copia in background. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSIONE).then(function (c) {
    return c.match(e.request, {ignoreSearch: true}).then(function (cached) {
      var rete = fetch(e.request, {cache: 'no-cache'}).then(function (r) { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(function () { return cached; });
      return cached || rete;
    });
  }));
});
