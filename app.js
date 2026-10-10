'use strict';
/* App Moduli M.40 — funziona offline; tutti i dati restano sul telefono (localStorage). */
var APP_VERSIONE = '1.0.0';
var K_CNT = 'm40.contatori', K_ARC = 'm40.archivio', K_DRAFT = 'm40.bozza', K_EXP = 'm40.ultimaEsportazione';

var LS = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { alert('Impossibile salvare sul telefono: memoria piena o bloccata.'); return false; } },
  del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
};
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
function mod(id) { for (var i = 0; i < MODULI.length; i++) if (MODULI[i].id === id) return MODULI[i]; return null; }
function ora() { return new Date().toLocaleString('it-IT'); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
var app = document.getElementById('app');

/* ---------- navigazione (tasto indietro di Android) ---------- */
var vistaCorrente = null;
function vai(vista, arg, sostituisci) {
  var st = {v: vista, a: arg || null};
  try { if (sostituisci) history.replaceState(st, ''); else history.pushState(st, ''); } catch (e) {}
  mostra(st);
}
window.addEventListener('popstate', function (e) { mostra(e.state || {v: 'home'}); });
function mostra(st) {
  vistaCorrente = st.v;
  window.scrollTo(0, 0);
  if (st.v === 'form') vistaForm();
  else if (st.v === 'archivio') vistaArchivio();
  else if (st.v === 'record') vistaRecord(st.a);
  else vistaHome();
}

/* ---------- contatori ---------- */
function contatori() { return LS.get(K_CNT, {}); }
function prossimo(id) { var c = contatori(); return c[id] || null; }
function impostaProssimo(id, n) { var c = contatori(); c[id] = n; LS.set(K_CNT, c); }
function chiediProgressivo(m, attuale) {
  var r = prompt('Numero progressivo per ' + m.nome + (attuale ? '\n(attuale: N. ' + attuale + ')' : '') + '\nInserisci il numero da usare per il prossimo modulo:', attuale || '1');
  if (r === null) return null;
  var n = parseInt(String(r).trim(), 10);
  if (!(n >= 1)) { alert('Numero non valido.'); return null; }
  if (attuale && !confirm('Confermi? Il prossimo ' + m.nome + ' sarà il N. ' + n + '.')) return null;
  impostaProssimo(m.id, n);
  return n;
}

/* ---------- HOME ---------- */
function vistaHome() {
  var bozza = LS.get(K_DRAFT, null), arc = LS.get(K_ARC, []), exp = LS.get(K_EXP, null);
  var h = '<header class="top"><div><h1>Moduli M.40</h1><div class="sub">RFI · Captrain</div></div>' + statoRete() + '</header>';
  if (bozza && mod(bozza.moduloId)) {
    var bm = mod(bozza.moduloId);
    h += '<div class="avviso"><b>Modulo in compilazione:</b> ' + esc(bm.nome) + ' N. ' + bozza.prog +
      '<div class="riga"><button class="pri" id="riprendi">Riprendi</button><button id="scarta">Elimina bozza</button></div></div>';
  }
  h += '<h2>Compila</h2><div class="lista">';
  MODULI.forEach(function (m) {
    var p = prossimo(m.id);
    h += '<div class="card"><div class="cnome">' + esc(m.nome) + '</div><div class="cinfo">' +
      (p ? 'Prossimo: <b>N. ' + p + '</b>' : '<span class="warn">Progressivo da impostare</span>') + ' · modello ' + esc(m.versione) + '</div>' +
      '<div class="riga"><button class="pri" data-compila="' + m.id + '">Compila</button><button data-imposta="' + m.id + '">Imposta N.</button></div></div>';
  });
  h += '</div><h2>Archivio</h2><div class="card"><div class="cinfo">' + arc.length + ' moduli confermati</div>';
  var nonSalvati = arc.filter(function (r) { return !exp || r.confermatoISO > exp; }).length;
  h += '<div class="cinfo">Ultima esportazione: ' + (exp ? esc(new Date(exp).toLocaleString('it-IT')) : 'mai') + '</div>';
  if (nonSalvati) h += '<div class="cinfo warn">' + nonSalvati + ' moduli non ancora esportati: fai una copia di sicurezza quando hai la linea.</div>';
  h += '<div class="riga"><button class="pri" id="apriArc">Apri archivio</button></div></div>';
  h += '<footer>App ' + APP_VERSIONE + ' · i dati restano solo su questo telefono · supporto personale, non sostituisce le procedure ufficiali</footer>';
  app.innerHTML = h;
  if ($('#riprendi')) $('#riprendi').onclick = function () { vai('form'); };
  if ($('#scarta')) $('#scarta').onclick = function () { if (confirm('Eliminare la bozza? I dati inseriti andranno persi. Il progressivo non viene consumato.')) { LS.del(K_DRAFT); vistaHome(); } };
  $$('[data-imposta]').forEach(function (b) { b.onclick = function () { var m = mod(b.dataset.imposta); chiediProgressivo(m, prossimo(m.id)); vistaHome(); }; });
  $$('[data-compila]').forEach(function (b) { b.onclick = function () { nuovaCompilazione(mod(b.dataset.compila)); }; });
  $('#apriArc').onclick = function () { vai('archivio'); };
}
function statoRete() { return '<span class="rete ' + (navigator.onLine ? 'on' : 'off') + '">' + (navigator.onLine ? 'online' : 'offline') + '</span>'; }
window.addEventListener('online', function () { $$('.rete').forEach(function (e) { e.outerHTML = statoRete(); }); });
window.addEventListener('offline', function () { $$('.rete').forEach(function (e) { e.outerHTML = statoRete(); }); });

function nuovaCompilazione(m) {
  var b = LS.get(K_DRAFT, null);
  if (b) {
    if (b.moduloId === m.id) { vai('form'); return; }
    if (!confirm('C\'è già un modulo in compilazione (' + mod(b.moduloId).nome + ' N. ' + b.prog + '). Eliminarlo e iniziarne uno nuovo?')) return;
  }
  var p = prossimo(m.id) || chiediProgressivo(m, null);
  if (!p) return;
  LS.set(K_DRAFT, {moduloId: m.id, prog: p, v: {}, pv: {}, checks: [], scelta: {}, libera: null, liberaTesto: '', creato: new Date().toISOString()});
  vai('form');
}

/* ---------- FORM ---------- */
function vistaForm() {
  var d = LS.get(K_DRAFT, null), m = d && mod(d.moduloId);
  if (!m) { vai('home', null, true); return; }
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Moduli</button><h1>' + esc(m.nome) + '</h1><div class="sub">RFI · Captrain · modello ' + esc(m.versione) + '</div></div><div class="num">N. ' + d.prog + '</div></header>';
  h += '<div class="foglio"><div class="griglia">';
  m.campi.forEach(function (c) {
    if (c.tipo === 'ps') h += '<div><label>' + esc(c.label) + '</label><div class="coppia"><b>' + d.prog + '</b>/<input data-f="sal" maxlength="2" inputmode="numeric" placeholder="2 cifre"></div></div>';
    else if (c.tipo === 'ag') h += '<div class="s2"><label>' + esc(c.label) + '</label><div class="coppia"><input data-f="agn" inputmode="numeric" placeholder="progressivo" class="w110">/<input data-f="ags" maxlength="2" inputmode="numeric" placeholder="2 cifre" class="w70"></div></div>';
    else h += '<div' + (c.span === 2 ? ' class="s2"' : '') + '><label>' + esc(c.label) + '</label><input data-f="' + c.id + '"' + (c.ph ? ' placeholder="' + esc(c.ph) + '"' : '') + (c.id === 'ora' || c.id === 'dat' ? ' inputmode="numeric"' : '') + '></div>';
  });
  h += '</div><p class="ordine">' + esc(m.ordine).replace('{trn}', '<input class="inl" data-mirror="trn" disabled>').replace('{sig}', '<input class="inl" data-f="sig">').replace('{loc}', '<input class="inl" data-f="loc">').replace('{prn}', '<input class="inl" data-f="prn" readonly placeholder="automatico">') + '</p>';
  m.presc.forEach(function (p) {
    if (p.g) h += '<div class="gruppo">' + esc(p.g) + '</div>';
    var t;
    if (p.libera) t = '<input class="lib" data-p="' + p.n + '" data-k="0" placeholder="Riga libera (testo dettato)">';
    else { var k = 0; t = esc(p.t).replace(/\{\}/g, function () { return '<input class="inl" data-p="' + p.n + '" data-k="' + (k++) + '">'; }); }
    if (p.scelta) t += '<div class="scelte">' + p.scelta.map(function (s) { return '<label><input type="radio" name="sc' + p.n + '" data-sc="' + p.n + '" value="' + esc(s) + '"> ' + esc(s) + '</label>'; }).join(' ') + '</div>';
    h += '<div class="pr"><input type="checkbox" data-c="' + p.n + '" aria-label="Prescrizione ' + p.n + '"><span class="n">' + (p.libera && !p.numerata ? '' : p.n) + '</span><div class="t">' + t + '</div></div>';
  });
  h += '<div class="gruppo">Prescrizione libera dettata dal DM/RdC</div><div>È necessario inserire una prescrizione libera?</div>' +
    '<div class="riga"><button id="ysi">Sì</button><button id="yno">No</button><span id="yst" class="err">Risposta obbligatoria</span></div>' +
    '<textarea id="free" placeholder="Testo esatto dettato dal DM/RdC" hidden></textarea>' +
    '<div class="riga"><button class="pri" id="gen">Genera riepilogo</button><button id="rst">Azzera caselle</button></div>' +
    '<div id="err" class="err"></div><pre id="out" hidden></pre>' +
    '<div id="cf" hidden><button class="pri full" id="cfb">Conferma definitivamente il modulo</button>' +
    '<div id="cfq" class="avviso" hidden>Dopo la conferma il modulo viene salvato nell\'archivio e bloccato; lo stato diventa «collazionato/confermato». Procedi solo se l\'AdC ha ripetuto integralmente il dispaccio e comunicato progressivo/saltuario.<div class="riga"><button class="pri" id="cfy">Sì, conferma</button><button id="cfn">Annulla</button></div></div></div>' +
    '<div class="nota">Bozza salvata automaticamente sul telefono a ogni modifica.</div></div>';
  app.innerHTML = h;

  // ripristino valori dalla bozza
  $$('[data-f]').forEach(function (i) { if (d.v[i.dataset.f] != null) i.value = d.v[i.dataset.f]; });
  $$('[data-p]').forEach(function (i) { var key = i.dataset.p + '_' + i.dataset.k; if (d.pv[key] != null) i.value = d.pv[key]; });
  $$('[data-c]').forEach(function (c) { c.checked = d.checks.indexOf(+c.dataset.c) >= 0; });
  $$('[data-sc]').forEach(function (r) { r.checked = d.scelta[r.dataset.sc] === r.value; });
  $('#free').value = d.liberaTesto || '';
  aggiornaDerivati(); impostaLibera(d.libera, true);

  function salva() {
    d.v = {}; $$('[data-f]').forEach(function (i) { d.v[i.dataset.f] = i.value; });
    d.pv = {}; $$('[data-p]').forEach(function (i) { d.pv[i.dataset.p + '_' + i.dataset.k] = i.value; });
    d.checks = $$('[data-c]').filter(function (c) { return c.checked; }).map(function (c) { return +c.dataset.c; });
    d.scelta = {}; $$('[data-sc]').forEach(function (r) { if (r.checked) d.scelta[r.dataset.sc] = r.value; });
    d.liberaTesto = $('#free').value;
    LS.set(K_DRAFT, d);
  }
  function aggiornaDerivati() {
    var trn = $('[data-f="trn"]'); $$('[data-mirror="trn"]').forEach(function (i) { i.value = trn ? trn.value : ''; });
    var prn = $('[data-f="prn"]');
    if (prn) prn.value = $$('[data-c]').filter(function (c) { return c.checked && isNumerata(m, +c.dataset.c); }).map(function (c) { return c.dataset.c; }).join(', ');
  }
  function impostaLibera(v, init) {
    d.libera = v; $('#free').hidden = v !== true;
    $('#yst').textContent = v === null || v === undefined ? 'Risposta obbligatoria' : (v ? 'Sì: inserire il testo esatto' : 'No: nessun testo libero');
    $('#yst').className = v === null || v === undefined ? 'err' : 'mut';
    $('#ysi').className = v === true ? 'sel' : ''; $('#yno').className = v === false ? 'sel' : '';
    if (!init) salva();
  }
  var foglio = $('.foglio');
  foglio.addEventListener('input', function () { aggiornaDerivati(); salva(); });
  foglio.addEventListener('change', function () { aggiornaDerivati(); salva(); });
  $('#indietro').onclick = function () { vai('home'); };
  $('#ysi').onclick = function () { impostaLibera(true); };
  $('#yno').onclick = function () { impostaLibera(false); };
  $('#rst').onclick = function () { if (confirm('Deselezionare tutte le caselle?')) { $$('[data-c]').forEach(function (c) { c.checked = false; }); aggiornaDerivati(); salva(); } };
  $('#gen').onclick = function () {
    salva(); var e = controlla(m, d);
    $('#err').textContent = e.join(' · ');
    var o = $('#out'); o.hidden = false; o.textContent = riepilogo(m, d, null); o.scrollTop = 0;
    $('#cf').hidden = false; $('#cfq').hidden = true;
  };
  $('#cfb').onclick = function () {
    salva(); var e = controlla(m, d);
    if (e.length) { $('#err').textContent = 'Prima di confermare completa: ' + e.join(' · '); return; }
    $('#err').textContent = ''; $('#cfq').hidden = false;
  };
  $('#cfn').onclick = function () { $('#cfq').hidden = true; };
  $('#cfy').onclick = function () {
    salva(); var e = controlla(m, d);
    if (e.length) { $('#err').textContent = 'Prima di confermare completa: ' + e.join(' · '); $('#cfq').hidden = true; return; }
    var rec = registra(m, d);
    if (rec) vai('record', rec.uid, true);
  };
}
function isNumerata(m, n) { for (var i = 0; i < m.presc.length; i++) if (m.presc[i].n === n) return !m.presc[i].libera || m.presc[i].numerata; return false; }

/* ---------- controlli e riepilogo ---------- */
function controlla(m, d) {
  var e = [], v = d.v;
  if (!/^\d{2}$/.test(v.sal || '')) e.push('Numero saltuario (2 cifre) mancante');
  if (!(v.agn || '').trim() || !/^\d{2}$/.test(v.ags || '')) e.push('N° DM/DCO trasmittente (progressivo/saltuario 2 cifre) mancante');
  if (d.libera !== true && d.libera !== false) e.push('Rispondi Sì/No sulla prescrizione libera');
  if (d.libera === true && !(d.liberaTesto || '').trim()) e.push('Testo prescrizione libera mancante');
  if (!d.checks.length) e.push('Nessuna casella selezionata');
  return e;
}
function testoPresc(m, p, d) {
  if (p.libera) return (d.pv[p.n + '_0'] || '').trim() || '(vuoto)';
  var k = 0, s = p.t.replace(/\{\}/g, function () { var x = (d.pv[p.n + '_' + (k++)] || '').trim(); return x || '[MANCANTE]'; });
  if (p.scelta) s = s.replace(p.segnaposto, d.scelta[p.n] ? '(' + d.scelta[p.n] + ')' : '[' + p.scelta.join('/') + ' MANCANTE]');
  return s;
}
function prescSelezionate(m, d) {
  return m.presc.filter(function (p) { return d.checks.indexOf(p.n) >= 0; }).map(function (p) {
    return {n: p.n, numerata: !p.libera || !!p.numerata, testo: testoPresc(m, p, d)};
  });
}
function riepilogo(m, d, confermato) {
  var v = d.v, M = function (x) { return (x || '').trim() || '[MANCANTE]'; }, L = [];
  L.push('RIEPILOGO PER COLLAZIONAMENTO (non è la trascrizione integrale)');
  L.push(m.nome + ' N. ' + d.prog + '/' + M(v.sal) + '  ·  modello ' + m.versione);
  m.campi.forEach(function (c) { if (!c.tipo) L.push(c.label + ': ' + M(v[c.id])); });
  if (m.ordine.indexOf('{sig}') >= 0) L.push('Fermo al segnale: ' + M(v.sig) + ' di ' + M(v.loc));
  if (m.ordine.indexOf('{prn}') >= 0) L.push('Prescrizioni n° (da barrare): ' + M(v.prn));
  L.push('N° DM/DCO trasmittente: ' + M(v.agn) + '/' + M(v.ags));
  L.push(''); L.push('PRESCRIZIONI SELEZIONATE:');
  prescSelezionate(m, d).forEach(function (p) { L.push((p.numerata ? p.n : 'riga libera aggiuntiva') + ') ' + p.testo); });
  L.push('');
  L.push('PRESCRIZIONE LIBERA: ' + (d.libera === true ? M(d.liberaTesto) : d.libera === false ? 'non richiesta' : '[risposta Sì/No mancante]'));
  L.push('Stato: ' + (confermato ? 'collazionato/confermato' : 'bozza'));
  L.push('Spazi non utilizzati: annullare con riga continua.');
  L.push('Dispaccio NON trasmesso finché l\'AdC non ripete integralmente e comunica progressivo/saltuario.');
  if (confermato) { L.push(''); L.push('MODULO CONFERMATO DEFINITIVAMENTE il ' + confermato + ' (stato: collazionato/confermato).'); }
  return L.join('\n');
}

/* ---------- conferma e archivio ---------- */
function registra(m, d) {
  var adesso = new Date(), quando = adesso.toLocaleString('it-IT');
  var rec = {
    uid: uid(), moduloId: m.id, nome: m.nome, versioneModello: m.versione, appVersione: APP_VERSIONE,
    prog: d.prog, sal: d.v.sal, campi: d.v, presc: prescSelezionate(m, d),
    libera: d.libera === true ? d.liberaTesto : null, stato: 'collazionato/confermato',
    confermato: quando, confermatoISO: adesso.toISOString(), riepilogo: riepilogo(m, d, quando)
  };
  var arc = LS.get(K_ARC, []); arc.push(rec);
  if (!LS.set(K_ARC, arc)) return null;
  var c = contatori(); c[m.id] = Math.max(c[m.id] || 0, d.prog + 1); LS.set(K_CNT, c);
  LS.del(K_DRAFT);
  return rec;
}
function vistaArchivio() {
  var arc = LS.get(K_ARC, []).slice().sort(function (a, b) { return a.confermatoISO < b.confermatoISO ? 1 : -1; });
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Moduli</button><h1>Archivio</h1><div class="sub">' + arc.length + ' moduli confermati · sola lettura</div></div>' + statoRete() + '</header>';
  h += '<div class="riga"><button class="pri" id="exp">Esporta archivio</button><button id="imp">Importa</button><input type="file" id="impf" accept=".json,application/json" hidden></div>';
  h += '<input id="cerca" class="cerca" placeholder="Cerca: numero, treno, data, località…">';
  h += '<div id="elenco" class="lista"></div>';
  app.innerHTML = h;
  function disegna(q) {
    q = (q || '').toLowerCase();
    var f = arc.filter(function (r) { return !q || (r.riepilogo + ' ' + r.confermato).toLowerCase().indexOf(q) >= 0; });
    $('#elenco').innerHTML = f.length ? f.map(function (r) {
      return '<button class="voce" data-r="' + r.uid + '"><b>' + esc(r.nome) + ' N. ' + r.prog + '/' + esc(r.sal) + '</b><span>Treno ' + esc(r.campi.trn || '—') + ' · ' + esc(r.campi.dat || '') + ' · confermato ' + esc(r.confermato) + '</span></button>';
    }).join('') : '<div class="cinfo">' + (arc.length ? 'Nessun modulo trovato.' : 'Nessun modulo confermato.') + '</div>';
    $$('[data-r]').forEach(function (b) { b.onclick = function () { vai('record', b.dataset.r); }; });
  }
  disegna('');
  $('#cerca').oninput = function () { disegna(this.value); };
  $('#indietro').onclick = function () { vai('home'); };
  $('#exp').onclick = esporta;
  $('#imp').onclick = function () { $('#impf').click(); };
  $('#impf').onchange = function () { if (this.files[0]) importa(this.files[0]); };
}
function vistaRecord(id) {
  var r = LS.get(K_ARC, []).filter(function (x) { return x.uid === id; })[0];
  if (!r) { vai('archivio', null, true); return; }
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Archivio</button><h1>' + esc(r.nome) + ' N. ' + r.prog + '/' + esc(r.sal) + '</h1><div class="sub">Confermato il ' + esc(r.confermato) + ' · modello ' + esc(r.versioneModello) + '</div></div><span class="bloc">bloccato</span></header>';
  h += '<pre class="rec">' + esc(r.riepilogo) + '</pre><div class="riga"><button class="pri" id="txt">Scarica come testo</button>' + (navigator.share ? '<button id="sh">Condividi</button>' : '') + '<button id="home">Moduli</button></div>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('archivio'); };
  $('#home').onclick = function () { vai('home'); };
  $('#txt').onclick = function () { scarica(new Blob([r.riepilogo], {type: 'text/plain;charset=utf-8'}), 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt'); };
  if ($('#sh')) $('#sh').onclick = function () { navigator.share({title: r.nome + ' N. ' + r.prog + '/' + r.sal, text: r.riepilogo}).catch(function () {}); };
}
function scarica(blob, nome) {
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome;
  document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function esporta() {
  var adesso = new Date(), dati = {app: 'moduli-m40', formato: 1, esportato: adesso.toISOString(), contatori: contatori(), archivio: LS.get(K_ARC, [])};
  var p = function (n) { return (n < 10 ? '0' : '') + n; };
  scarica(new Blob([JSON.stringify(dati, null, 1)], {type: 'application/json'}), 'm40-archivio-' + adesso.getFullYear() + p(adesso.getMonth() + 1) + p(adesso.getDate()) + '-' + p(adesso.getHours()) + p(adesso.getMinutes()) + '.json');
  LS.set(K_EXP, adesso.toISOString());
}
function importa(file) {
  var fr = new FileReader();
  fr.onload = function () {
    var dati; try { dati = JSON.parse(fr.result); } catch (e) { alert('File non valido.'); return; }
    if (!dati || dati.app !== 'moduli-m40' || !Array.isArray(dati.archivio)) { alert('Questo file non è un archivio dei Moduli M.40.'); return; }
    var arc = LS.get(K_ARC, []), presenti = {}; arc.forEach(function (r) { presenti[r.uid] = 1; });
    var nuovi = dati.archivio.filter(function (r) { return r && r.uid && !presenti[r.uid]; });
    if (!confirm('Importare ' + nuovi.length + ' moduli nuovi (' + (dati.archivio.length - nuovi.length) + ' già presenti)? I progressivi verranno portati al valore più alto tra telefono e file.')) return;
    LS.set(K_ARC, arc.concat(nuovi));
    var c = contatori(), ci = dati.contatori || {};
    Object.keys(ci).forEach(function (k) { if (+ci[k] > (c[k] || 0)) c[k] = +ci[k]; });
    LS.set(K_CNT, c);
    alert('Importazione completata.'); vistaArchivio();
  };
  fr.readAsText(file);
}

/* ---------- avvio ---------- */
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        nw && nw.addEventListener('statechange', function () {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            var b = document.createElement('div'); b.className = 'agg';
            b.innerHTML = 'Nuova versione disponibile. <button id="aggOk">Aggiorna</button>';
            document.body.appendChild(b);
            $('#aggOk').onclick = function () { location.reload(); };
          }
        });
      });
    }).catch(function () {});
  });
}
vai(LS.get(K_DRAFT, null) ? 'form' : 'home', null, true);
