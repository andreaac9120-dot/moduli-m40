/* Funzionamento offline. A ogni aggiornamento dell'app aumentare VERSIONE.
   I file vengono sempre scaricati freschi dal server (cache: 'reload'), non dalla memoria temporanea del browser. */
var VERSIONE = 'm40-v1.17.3-agenti';
var FILE = ['./', 'index.html', 'style.css', 'moduli.js', 'cvr-data.js', 'app.js', 'pdf-export.js', 'vendor/pdf-lib.min.js', 'assets/moduli-originali.pdf', 'assets/moduli-ferrovienord.pdf', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSIONE).then(function (c) { return Promise.all(FILE.map(function (f) { return fetch(new Request(f, {cache: 'reload'})).then(function (r) { if (!r.ok) throw new Error(f); return c.put(f, r); }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n.indexOf('m40-v') === 0 && n !== VERSIONE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
/* I file della versione installata restano insieme fino all'attivazione della nuova cache. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSIONE).then(function (c) {
    return c.match(e.request, {ignoreSearch: true}).then(function (cached) {
      return cached || fetch(e.request);
    });
  }));
});

