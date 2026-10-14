'use strict';
/* App Moduli M.40 — funziona offline; tutti i dati restano sul telefono (localStorage). */
var APP_VERSIONE = '1.6.5';
var K_CNT = 'm40.contatori', K_ARC = 'm40.archivio', K_DRAFT = 'm40.bozza', K_EXP = 'm40.ultimaEsportazione', K_TRASH = 'm40.cestino', K_DELID = 'm40.eliminati', K_ADC = 'm40.cognomeAdc', K_TEMA = 'm40.tema', K_RETE = 'm40.rete';

var LS = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { avviso('Impossibile salvare sul telefono: memoria piena o bloccata.'); return false; } },
  del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
};
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
function mod(id) { for (var i = 0; i < MODULI.length; i++) if (MODULI[i].id === id) return MODULI[i]; return null; }
function ora() { return new Date().toLocaleString('it-IT'); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
var app = document.getElementById('app');
/* ---------- tema chiaro / scuro ---------- */
function applicaTema(t) { document.documentElement.setAttribute('data-theme', t); var mc = document.querySelector('meta[name=theme-color]'); if (mc) mc.setAttribute('content', t === 'dark' ? '#0E1013' : '#EEF0F3'); }
applicaTema(LS.get(K_TEMA, 'light'));
function temaBtn() { var d = document.documentElement.getAttribute('data-theme') === 'dark'; return '<button class="tema mini" data-tema aria-label="Cambia tema">' + (d ? '☀ Giorno' : '☾ Notte') + '</button>'; }
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('[data-tema]'); if (!b) return;
  var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  LS.set(K_TEMA, t); applicaTema(t); $$('[data-tema]').forEach(function (x) { x.outerHTML = temaBtn(); });
});

/* ---------- finestre di conferma dentro l'app ---------- */
function finestra(o) {
  return new Promise(function (res) {
    var d = document.createElement('div'); d.className = 'modal';
    d.innerHTML = '<div class="dlg" role="dialog" aria-modal="true"><p>' + esc(o.testo).replace(/\n/g, '<br>') + '</p>' +
      (o.input ? '<input id="dlgIn" autocomplete="off"' + (o.input.mode ? ' inputmode="' + o.input.mode + '"' : '') + ' placeholder="' + esc(o.input.ph || '') + '">' : '') +
      '<div class="riga dlgb">' + (o.annulla === false ? '' : '<button id="dlgNo">' + esc(o.annulla || 'Annulla') + '</button>') +
      '<button id="dlgOk" class="' + (o.pericolo ? 'danger' : 'pri') + '">' + esc(o.ok || 'OK') + '</button></div></div>';
    document.body.appendChild(d);
    var i = d.querySelector('#dlgIn'); if (i) { i.value = o.input.val || ''; i.focus(); i.select(); } else d.querySelector('#dlgOk').focus();
    function chiudi(v) { d.remove(); res(v); }
    d.querySelector('#dlgOk').onclick = function () { chiudi(i ? i.value : true); };
    var no = d.querySelector('#dlgNo'); if (no) no.onclick = function () { chiudi(i ? null : false); };
    if (i) i.onkeydown = function (e) { if (e.key === 'Enter') chiudi(i.value); };
  });
}
function conferma(testo, ok, pericolo) { return finestra({testo: testo, ok: ok || 'Conferma', pericolo: pericolo}); }
function avviso(testo) { return finestra({testo: testo, ok: 'OK', annulla: false}); }
function chiediTesto(testo, val, mode, ph) { return finestra({testo: testo, ok: 'Conferma', input: {val: val, mode: mode, ph: ph}}); }


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
  else if (st.v === 'cestino') vistaCestino();
  else if (st.v === 'consulta') vistaConsulta();
  else if (st.v === 'crec') vistaConsultaRecord(st.a);
  else vistaHome();
}

/* ---------- contatori ---------- */
function contatori() { return LS.get(K_CNT, {}); }
function prossimo(id) { var c = contatori(); return c[id] || null; }
function impostaProssimo(id, n) { var c = contatori(); c[id] = n; LS.set(K_CNT, c); }
function chiediProgressivo(m, attuale) {
  return chiediTesto('Numero progressivo per ' + m.nome + (attuale ? '\n(attuale: N. ' + attuale + ')' : '') + '\nInserisci il numero da usare per il prossimo modulo:', attuale || '1', 'numeric').then(function (r) {
    if (r === null) return null;
    var n = parseInt(String(r).trim(), 10);
    if (!(n >= 1)) { avviso('Numero non valido.'); return null; }
    if (!attuale) { impostaProssimo(m.id, n); return n; }
    return conferma('Confermi? Il prossimo ' + m.nome + ' sarà il N. ' + n + '.').then(function (ok) { if (!ok) return null; impostaProssimo(m.id, n); return n; });
  });
}

/* ---------- HOME ---------- */
function vistaHome() {
  var bozza = LS.get(K_DRAFT, null), arc = LS.get(K_ARC, []), exp = LS.get(K_EXP, null);
  var h = '<header class="top"><div><h1>Moduli M.40</h1><div class="sub">Prescrizioni ai treni · Captrain</div></div><div class="dx">' + statoRete() + temaBtn() + '</div></header>';
  if (bozza && mod(bozza.moduloId)) {
    var bm = mod(bozza.moduloId);
    h += '<div class="avviso"><b>Modulo in compilazione:</b> ' + esc(bm.nome) + ' N. ' + bozza.prog +
      '<div class="riga"><button class="pri" id="riprendi">Riprendi</button><button id="scarta">Elimina bozza</button></div></div>';
  }
  var reti = [];
  MODULI.forEach(function (m) { var r = m.rete || 'RFI'; if (reti.indexOf(r) < 0) reti.push(r); });
  var sel = LS.get(K_RETE, reti[0]);
  if (reti.indexOf(sel) < 0) sel = reti[0];
  h += '<div class="seg" role="tablist">' + reti.map(function (r) {
    var n = MODULI.filter(function (m) { return (m.rete || 'RFI') === r; }).length;
    return '<button role="tab" aria-selected="' + (r === sel) + '" class="' + (r === sel ? 'on' : '') + '" data-rete="' + esc(r) + '">' + esc(r) + ' <span class="n">' + n + '</span></button>';
  }).join('') + '</div>';
  [sel].forEach(function (rete) {
  h += '<h2>Compila · ' + esc(rete) + '</h2><div class="lista">';
  MODULI.filter(function (m) { return (m.rete || 'RFI') === rete; }).forEach(function (m) {
    var p = prossimo(m.id);
    h += '<div class="card"><div class="cardtop"><div class="cnome">' + esc(m.nome) + '</div><span class="tag' + (m.rete === 'FERROVIENORD' ? ' fn' : '') + '">' + (m.tipo === 'libero' ? 'TESTO LIBERO' : 'CASELLE') + '</span></div><div class="cinfo">' +
      (p ? 'Prossimo: <b>N. ' + p + '</b>' : '<span class="warn">Progressivo da impostare</span>') + ' · modello ' + esc(m.versione) + '</div>' +
      '<div class="riga"><button class="pri" data-compila="' + m.id + '">Compila</button><button data-imposta="' + m.id + '">Imposta N.</button></div></div>';
  });
  h += '</div>';
  });
  h += '<h2>Archivio</h2><div class="card"><div class="cinfo">' + arc.length + ' moduli confermati</div>';
  var nonSalvati = arc.filter(function (r) { return !esportato(r); }).length;
  h += '<div class="cinfo">Ultima esportazione: ' + (exp ? esc(new Date(exp).toLocaleString('it-IT')) : 'mai') + '</div>';
  if (nonSalvati) h += '<div class="cinfo warn">' + nonSalvati + ' moduli non ancora esportati: fai una copia di sicurezza quando hai la linea.</div>';
  h += '<div class="riga"><button class="pri" id="apriArc">Apri archivio</button></div></div>';
  h += '<footer>App ' + APP_VERSIONE + ' · i dati restano solo su questo telefono · supporto personale, non sostituisce le procedure ufficiali</footer>';
  app.innerHTML = h;
  if ($('#riprendi')) $('#riprendi').onclick = function () { vai('form'); };
  if ($('#scarta')) $('#scarta').onclick = function () { conferma('Eliminare la bozza? I dati inseriti andranno persi. Il progressivo non viene consumato.', 'Elimina bozza', true).then(function (ok) { if (ok) { LS.del(K_DRAFT); vistaHome(); } }); };
  $$('[data-imposta]').forEach(function (b) { b.onclick = function () { var m = mod(b.dataset.imposta); chiediProgressivo(m, prossimo(m.id)).then(vistaHome); }; });
  $$('[data-compila]').forEach(function (b) { b.onclick = function () { nuovaCompilazione(mod(b.dataset.compila)); }; });
  $('#apriArc').onclick = function () { vai('archivio'); };
  $$('[data-rete]').forEach(function (b) { b.onclick = function () { LS.set(K_RETE, b.dataset.rete); var y = window.scrollY; vistaHome(); window.scrollTo(0, y); }; });
}
function statoRete() { return '<span class="rete ' + (navigator.onLine ? 'on' : 'off') + '">' + (navigator.onLine ? 'online' : 'offline') + '</span>'; }
window.addEventListener('online', function () { $$('.rete').forEach(function (e) { e.outerHTML = statoRete(); }); });
window.addEventListener('offline', function () { $$('.rete').forEach(function (e) { e.outerHTML = statoRete(); }); });

function nuovaCompilazione(m) {
  var b = LS.get(K_DRAFT, null);
  function avvia() {
    var p = prossimo(m.id);
    (p ? Promise.resolve(p) : chiediProgressivo(m, null)).then(function (p) {
      if (!p) return;
      var v0 = {}; if (m.campi.some(function (c) { return c.id === 'adc'; })) v0.adc = LS.get(K_ADC, '');
      LS.set(K_DRAFT, {moduloId: m.id, prog: p, v: v0, pv: {}, checks: [], scelta: {}, libera: m.tipo === 'libero' ? false : null, liberaTesto: '', creato: new Date().toISOString()});
      vai('form');
    });
  }
  if (!b) { avvia(); return; }
  if (b.moduloId === m.id) { vai('form'); return; }
  conferma('C\'è già un modulo in compilazione (' + mod(b.moduloId).nome + ' N. ' + b.prog + '). Eliminarlo e iniziarne uno nuovo?', 'Elimina e inizia', true).then(function (ok) { if (ok) avvia(); });
}

/* ---------- FORM ---------- */
function vistaForm() {
  var d = LS.get(K_DRAFT, null), m = d && mod(d.moduloId);
  if (!m) { vai('home', null, true); return; }
  var h = '<header class="formtop"><div class="riga1"><button class="link" id="indietro">‹ Moduli</button><div style="display:flex;gap:8px;align-items:center">' + temaBtn() + '<span class="num">N. ' + d.prog + '</span></div></div>' +
    '<h1>' + esc(m.nome) + '</h1><div class="sub">' + esc(m.rete || 'RFI') + ' · Captrain · modello ' + esc(m.versione) + '</div>' +
    '<div class="stato">' + (m.tipo === 'libero' ? '' : '<span class="chip acc" id="stSel"></span>') + '<span class="chip" id="stMan"></span></div></header>';
  h += '<div class="foglio">';
  function campo(c) {
    if (c.tipo === 'ps') return '<div><label>' + esc(c.label) + '</label><div class="coppia"><b>' + d.prog + '</b><span class="sl">/</span><input data-f="sal" maxlength="2" inputmode="numeric" placeholder="00"></div></div>';
    if (c.tipo === 'ag') return '<div class="s2"><label>' + esc(c.label) + '</label><div class="coppia"><input data-f="agn" inputmode="numeric" placeholder="progr." class="w110"><span class="sl">/</span><input data-f="ags" maxlength="2" inputmode="numeric" placeholder="00" class="w70"></div></div>';
    return '<div' + (c.span === 2 ? ' class="s2"' : '') + '><label>' + esc(c.label) + '</label><input data-f="' + c.id + '"' + (c.ph ? ' placeholder="' + esc(c.ph) + '"' : '') + (c.id === 'ora' || c.id === 'dat' || c.id === 'trn' ? ' inputmode="numeric"' : '') + '></div>';
  }
  var trasm = ['agt', 'adc'];
  var cDati = m.campi.filter(function (c) { return c.tipo !== 'ag' && trasm.indexOf(c.id) < 0; });
  var cTras = m.campi.filter(function (c) { return c.tipo === 'ag' || trasm.indexOf(c.id) >= 0; });
  h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">▣</span>Dati treno</span><span class="tag' + (m.rete === 'FERROVIENORD' ? ' fn' : '') + '">' + esc(m.rete || 'RFI') + '</span></div><div class="griglia">' + cDati.map(campo).join('') + '</div></section>';
  h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">⇄</span>Trasmissione</span></div><div class="griglia">' + cTras.map(campo).join('') + '</div></section>';
  if (m.tipo === 'libero') {
    h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">✎</span>Testo del dispaccio</span></div>' +
      '<div class="scelte oa">' + ['Si ordina', 'Si dà avviso'].map(function (s) { return '<label><input type="radio" name="scoa" data-sc="oa" value="' + s + '"> ' + s + '</label>'; }).join('') + '</div>' +
      '<div class="dest"><span>' + esc(m.destLabel || 'a') + '</span><input data-f="dest" placeholder="profilo di chi riceve (e n° treno se è il caso)"></div>' +
      '<textarea class="testo" data-f="testo" rows="10" placeholder="Testo esatto del dispaccio"></textarea></section>';
  } else {
    h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">§</span>Ordine</span></div><p class="ordine">' + esc(m.ordine).replace('{trn}', '<input class="inl" data-mirror="trn" disabled>').replace('{sig}', '<input class="inl" data-f="sig" placeholder="segnale">').replace('{loc}', '<input class="inl" data-f="loc" placeholder="località">').replace('{prn}', '<input class="inl" data-f="prn" readonly placeholder="automatico">') + '</p></section>';
    h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">☑</span>Prescrizioni</span><button class="mini" id="rst">Azzera caselle</button></div>';
    m.presc.forEach(function (p) {
      if (p.g) h += '<div class="gruppo">' + esc(p.g) + '</div>';
      var t;
      if (p.libera) t = '<input class="lib" data-p="' + p.n + '" data-k="0" placeholder="Riga libera (testo dettato)">';
      else { var k = 0; t = esc(p.t).replace(/\{\}/g, function () { return '<input class="inl" data-p="' + p.n + '" data-k="' + (k++) + '" placeholder="…">'; }); }
      if (p.scelta && p.sost) t = t.replace(esc(p.segnaposto), '<span class="opz" role="radiogroup">' + p.scelta.map(function (s) { return '<label><input type="radio" name="sc' + p.n + '" data-sc="' + p.n + '" value="' + esc(s) + '"><span>' + esc(s) + '</span></label>'; }).join('') + '</span>');
      else if (p.scelta) t += '<div class="scelte">' + p.scelta.map(function (s) { return '<label><input type="radio" name="sc' + p.n + '" data-sc="' + p.n + '" value="' + esc(s) + '"> ' + esc(s) + '</label>'; }).join(' ') + '</div>';
      h += '<div class="pr" data-pr="' + p.n + '"><input type="checkbox" data-c="' + p.n + '" aria-label="Prescrizione ' + p.n + '"><span class="n">' + (p.libera && !p.numerata ? '' : p.n) + '</span><div class="t">' + t + '</div></div>';
    });
    h += '</section>';
  }
  h += '<section class="sez"' + (m.tipo === 'libero' ? ' hidden' : '') + '><div class="sez-t"><span class="l"><span class="ic">+</span>Prescrizione libera</span></div><div>È necessario inserire una prescrizione libera dettata dal DM/RdC?</div>' +
    '<div class="riga"><button id="ysi">Sì</button><button id="yno">No</button><span id="yst" class="err">Risposta obbligatoria</span></div>' +
    '<textarea id="free" placeholder="Testo esatto dettato dal DM/RdC" hidden></textarea></section>' +
    '<section class="sez" id="sezRiep"><div class="sez-t"><span class="l"><span class="ic">✓</span>Riepilogo e conferma</span></div>' +
    '<div class="nota">Tocca «Genera riepilogo» in basso per controllare il modulo prima del collazionamento.</div>' +
    '<div id="err" class="err"></div><pre id="out" hidden></pre>' +
    '<div id="cf" hidden><button class="pri full" id="cfb">Conferma definitivamente il modulo</button>' +
    '<div id="cfq" class="avviso" hidden>Dopo la conferma il modulo viene salvato nell\'archivio e bloccato; lo stato diventa «collazionato/confermato». Procedi solo se ' + (m.tipo === 'libero' ? 'chi riceve ha' : 'l\'AdC ha') + ' ripetuto integralmente il dispaccio e comunicato progressivo/saltuario.<div class="riga"><button class="pri" id="cfy">Sì, conferma</button><button id="cfn">Annulla</button></div></div></div>' +
    (m.note ? '<div class="nota note-mod">' + esc(m.note) + '</div>' : '') +
    '<div class="nota" style="margin-top:10px">Bozza salvata automaticamente sul telefono a ogni modifica.</div></section>' +
    '<div class="barra"><button class="pri" id="gen">Genera riepilogo</button></div></div>';
  app.innerHTML = h;

  // ripristino valori dalla bozza
  $$('[data-f]').forEach(function (i) { if (d.v[i.dataset.f] != null) i.value = d.v[i.dataset.f]; });
  $$('[data-p]').forEach(function (i) { var key = i.dataset.p + '_' + i.dataset.k; if (d.pv[key] != null) i.value = d.pv[key]; });
  $$('[data-c]').forEach(function (c) { c.checked = d.checks.indexOf(+c.dataset.c) >= 0; });
  $$('[data-sc]').forEach(function (r) { r.checked = d.scelta[r.dataset.sc] === r.value; });
  $('#free').value = d.liberaTesto || '';
  aggiornaDerivati(); impostaLibera(d.libera, true); aggiornaStato();

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
    $$('[data-c]').forEach(function (c) { var r = c.closest('.pr'); if (r) r.classList.toggle('on', c.checked); });
    var ss = $('#stSel'); if (ss) { var n = $$('[data-c]').filter(function (c) { return c.checked; }).length; ss.textContent = n + (n === 1 ? ' prescrizione selezionata' : ' prescrizioni selezionate'); }
  }
  function aggiornaStato() {
    var e = controlla(m, d), sm = $('#stMan'); if (!sm) return;
    sm.className = 'chip ' + (e.length ? 'ko' : 'ok');
    sm.textContent = e.length ? 'Mancano ' + e.length + (e.length === 1 ? ' dato' : ' dati') : 'Dati completi';
  }
  function impostaLibera(v, init) {
    d.libera = v; $('#free').hidden = v !== true;
    $('#yst').textContent = v === null || v === undefined ? 'Risposta obbligatoria' : (v ? 'Sì: inserire il testo esatto' : 'No: nessun testo libero');
    $('#yst').className = v === null || v === undefined ? 'err' : 'mut';
    $('#ysi').className = v === true ? 'sel' : ''; $('#yno').className = v === false ? 'sel' : '';
    if (!init) { salva(); aggiornaStato(); }
  }
  var foglio = $('.foglio');
  foglio.addEventListener('input', function (e) {
    var p = e.target.dataset && e.target.dataset.p;
    if (p && e.target.value.trim()) { var c = $('[data-c="' + p + '"]'); if (c && !c.checked) c.checked = true; }
    aggiornaDerivati(); salva(); aggiornaStato();
  });
  foglio.addEventListener('change', function (e) {
    var sc = e.target.dataset && e.target.dataset.sc;
    if (sc && e.target.checked) { var c = $('[data-c="' + sc + '"]'); if (c && !c.checked) c.checked = true; }
    aggiornaDerivati(); salva(); aggiornaStato();
  });
  $('#indietro').onclick = function () { vai('home'); };
  $('#ysi').onclick = function () { impostaLibera(true); };
  $('#yno').onclick = function () { impostaLibera(false); };
  if ($('#rst')) $('#rst').onclick = function () { conferma('Deselezionare tutte le caselle?', 'Deseleziona').then(function (ok) { if (ok) { $$('[data-c]').forEach(function (c) { c.checked = false; }); aggiornaDerivati(); salva(); } }); };
  $('#gen').onclick = function () {
    salva(); var e = controlla(m, d);
    $('#err').textContent = e.join(' · ');
    var o = $('#out'); o.hidden = false; o.textContent = riepilogo(m, d, null); o.scrollTop = 0;
    $('#cf').hidden = false; $('#cfq').hidden = true;
    $('#sezRiep').scrollIntoView({behavior: 'smooth', block: 'start'});
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
  if (!(v.agn || '').trim() || !/^\d{2}$/.test(v.ags || '')) e.push(m.tipo === 'libero' ? 'N° DCO/DM (progressivo/saltuario 2 cifre) mancante' : 'N° DM/DCO trasmittente (progressivo/saltuario 2 cifre) mancante');
  if (m.tipo === 'libero') {
    if (!d.scelta.oa) e.push('Scegli «Si ordina» o «Si dà avviso»');
    if (!(v.dest || '').trim()) e.push('Destinatario mancante');
    if (!(v.testo || '').trim()) e.push('Testo del dispaccio mancante');
    if (!(v.agt || '').trim()) e.push('Cognome DCO/DM mancante');
    if (!(v.adc || '').trim()) e.push('Cognome AdC mancante');
    return e;
  }
  if (d.libera !== true && d.libera !== false) e.push('Rispondi Sì/No sulla prescrizione libera');
  if (d.libera === true && !(d.liberaTesto || '').trim()) e.push('Testo prescrizione libera mancante');
  if (!d.checks.length) e.push('Nessuna casella selezionata');
  m.presc.forEach(function (p) { if (p.scelta && d.checks.indexOf(p.n) >= 0 && !d.scelta[p.n]) e.push('Prescrizione ' + p.n + ': scegli ' + p.scelta.join(' / ')); });
  return e;
}
function testoPresc(m, p, d) {
  if (p.libera) return (d.pv[p.n + '_0'] || '').trim() || '(vuoto)';
  var k = 0, s = p.t.replace(/\{\}/g, function () { var x = (d.pv[p.n + '_' + (k++)] || '').trim(); return x || '[MANCANTE]'; });
  if (p.scelta && p.sost) s = s.replace(p.segnaposto, d.scelta[p.n] ? d.scelta[p.n] : '[' + p.scelta.join('/') + ' MANCANTE]');
  else if (p.scelta) s = s.replace(p.segnaposto, d.scelta[p.n] ? '(' + d.scelta[p.n] + ')' : '[' + p.scelta.join('/') + ' MANCANTE]');
  return s;
}
function prescSelezionate(m, d) {
  if (!m.presc) return [];
  return m.presc.filter(function (p) { return d.checks.indexOf(p.n) >= 0; }).map(function (p) {
    return {n: p.n, numerata: !p.libera || !!p.numerata, testo: testoPresc(m, p, d)};
  });
}
function riepilogo(m, d, confermato) {
  var v = d.v, M = function (x) { return (x || '').trim() || '[MANCANTE]'; }, L = [];
  L.push('RIEPILOGO PER COLLAZIONAMENTO (non è la trascrizione integrale)');
  L.push(m.nome + ' N. ' + d.prog + '/' + M(v.sal) + '  ·  modello ' + m.versione);
  m.campi.forEach(function (c) { if (!c.tipo) L.push(c.label + ': ' + M(v[c.id])); });
  if (m.tipo === 'libero') {
    L.push('N° DCO/DM: ' + M(v.agn) + '/' + M(v.ags));
    L.push('');
    L.push((d.scelta.oa ? d.scelta.oa.toUpperCase() : '[SI ORDINA / SI DÀ AVVISO MANCANTE]') + ' ' + (m.destLabel || 'a') + ' ' + M(v.dest) + ':');
    L.push(M(v.testo));
    L.push('');
    L.push('Stato: ' + (confermato ? 'collazionato/confermato' : 'bozza'));
    L.push('Spazi non utilizzati: annullare con riga continua.');
    L.push('Dispaccio NON trasmesso finché chi riceve non ripete integralmente e comunica progressivo/saltuario.');
    if (confermato) { L.push(''); L.push('MODULO CONFERMATO DEFINITIVAMENTE il ' + confermato + ' (stato: collazionato/confermato).'); }
    return L.join('\n');
  }
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
  if ((d.v.adc || '').trim()) LS.set(K_ADC, d.v.adc.trim());
  var c = contatori(); c[m.id] = Math.max(c[m.id] || 0, d.prog + 1); LS.set(K_CNT, c);
  LS.del(K_DRAFT);
  return rec;
}
/* ---------- stato esportazione, cestino ---------- */
function esportato(r) { if (r.esportato) return true; var e = LS.get(K_EXP, null); return !!(e && r.confermatoISO <= e); }
function nelCestino(uids) {
  var arc = LS.get(K_ARC, []), tr = LS.get(K_TRASH, []), adesso = new Date().toISOString(), resta = [];
  arc.forEach(function (r) { if (uids.indexOf(r.uid) >= 0) tr.push({rec: r, eliminatoISO: adesso}); else resta.push(r); });
  if (LS.set(K_TRASH, tr)) LS.set(K_ARC, resta);
}
function pulisciCestino() {
  var tr = LS.get(K_TRASH, []), limite = Date.now() - 30 * 864e5, del = LS.get(K_DELID, []);
  var resta = tr.filter(function (t) { if (Date.parse(t.eliminatoISO) < limite) { del.push(t.rec.uid); return false; } return true; });
  if (resta.length !== tr.length) { LS.set(K_DELID, del); LS.set(K_TRASH, resta); }
}
function descr(r) { return r.nome + ' N. ' + r.prog + '/' + r.sal + (r.campi && r.campi.trn ? ' · treno ' + r.campi.trn : ''); }
/* data "gg/mm/aaaa" (anche g/m/aa, con . o -) -> "aaaa-mm-gg" */
function normData(s) {
  var m = String(s || '').trim().match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
  if (!m) return '';
  var a = m[3].length === 2 ? '20' + m[3] : m[3], p = function (x) { return (x.length < 2 ? '0' : '') + x; };
  return a + '-' + p(m[2]) + '-' + p(m[1]);
}
function dataLocale(iso) { var d = new Date(iso), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }

/* ---------- ARCHIVIO ---------- */
var filtroArc = {testo: '', treno: '', data: '', stato: 'tutti'};
function vistaArchivio() {
  pulisciCestino();
  var tr = LS.get(K_TRASH, []), sel = {}, selezione = false;
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Moduli</button><h1>Archivio</h1><div class="sub" id="conteggio"></div></div>' + statoRete() + '</header>';
  h += '<div class="riga"><button class="pri" id="drv">Salva su Drive</button><button id="exp">Esporta archivio</button><button id="imp">Importa</button><button id="cest">Cestino (' + tr.length + ')</button><input type="file" id="impf" accept=".json,.txt,application/json,text/plain" hidden></div>' +
    '<div class="riga"><button class="full" id="cons">Consulta file esportato</button><input type="file" id="consf" accept=".json,.txt,application/json,text/plain" hidden></div>';
  h += '<div class="card filtri"><div class="griglia">' +
    '<div><label>N° treno</label><input id="fTreno" inputmode="numeric" placeholder="es. 45120"></div>' +
    '<div><label>Data (modulo o conferma)</label><input id="fData" type="date"></div>' +
    '<div class="s2"><label>Cerca nel testo</label><input id="fTesto" placeholder="località, segnale, prescrizione…"></div>' +
    '<div class="s2"><label>Mostra</label><select id="fStato"><option value="tutti">Tutti</option><option value="non">Solo non esportati</option><option value="si">Solo esportati</option></select></div>' +
    '</div><div class="riga"><button id="azzera">Azzera filtri</button><button id="selBtn">Seleziona</button></div></div>';
  h += '<div id="selBar" class="avviso" hidden><span id="selN">0 selezionati</span><div class="riga"><button class="danger" id="selDel">Elimina selezionati</button><button id="selAnn">Annulla</button></div></div>';
  h += '<div id="elenco" class="lista"></div>';
  h += '<div class="fondo"><button class="danger full" id="delNonEsp" hidden></button><button class="danger-lite full" id="svuota">Svuota archivio</button></div>';
  app.innerHTML = h;
  $('#fTreno').value = filtroArc.treno; $('#fData').value = filtroArc.data; $('#fTesto').value = filtroArc.testo; $('#fStato').value = filtroArc.stato;

  function filtrati() {
    var arc = LS.get(K_ARC, []).slice().sort(function (a, b) { return a.confermatoISO < b.confermatoISO ? 1 : -1; });
    var t = filtroArc.testo.toLowerCase(), tn = filtroArc.treno.trim().toLowerCase(), d = filtroArc.data;
    return {tutti: arc, lista: arc.filter(function (r) {
      if (tn && String(r.campi.trn || '').toLowerCase().indexOf(tn) < 0) return false;
      if (d && normData(r.campi.dat) !== d && dataLocale(r.confermatoISO) !== d) return false;
      if (t && (r.riepilogo + ' ' + r.confermato).toLowerCase().indexOf(t) < 0) return false;
      if (filtroArc.stato === 'non' && esportato(r)) return false;
      if (filtroArc.stato === 'si' && !esportato(r)) return false;
      return true;
    })};
  }
  function disegna() {
    var f = filtrati(), arc = f.tutti, lista = f.lista;
    var nonEsp = arc.filter(function (r) { return !esportato(r); });
    $('#conteggio').textContent = arc.length + ' moduli confermati · ' + nonEsp.length + ' non esportati';
    $('#elenco').innerHTML = lista.length ? lista.map(function (r) {
      var ne = !esportato(r);
      return '<div class="voceriga">' + (selezione ? '<input type="checkbox" class="selchk" data-s="' + r.uid + '"' + (sel[r.uid] ? ' checked' : '') + ' aria-label="Seleziona">' : '') +
        '<button class="voce" data-r="' + r.uid + '"><b>' + esc(r.nome) + ' N. ' + r.prog + '/' + esc(r.sal) + '</b><span>Treno ' + esc(r.campi.trn || '—') + ' · ' + esc(r.campi.dat || 'data —') + '</span><span>Confermato ' + esc(r.confermato) + '</span>' +
        '<span class="badge ' + (ne ? 'ne' : 'es') + '">' + (ne ? 'non esportato' : 'esportato') + '</span></button>' +
        (ne && !selezione ? '<button class="x" data-x="' + r.uid + '" aria-label="Elimina modulo">✕</button>' : '') + '</div>';
    }).join('') : '<div class="cinfo">' + (arc.length ? 'Nessun modulo corrisponde ai filtri.' : 'Nessun modulo confermato.') + '</div>';
    var b = $('#delNonEsp'); b.hidden = !nonEsp.length || selezione; b.textContent = 'Elimina tutti i non esportati (' + nonEsp.length + ')';
    $('#svuota').hidden = !arc.length || selezione;
    $('#selN').textContent = Object.keys(sel).length + ' selezionati';
    $$('[data-r]').forEach(function (x) { x.onclick = function () { if (selezione) { var c = $('[data-s="' + x.dataset.r + '"]'); c.checked = !c.checked; c.onchange(); } else vai('record', x.dataset.r); }; });
    $$('[data-x]').forEach(function (x) { x.onclick = function () {
      var r = arc.filter(function (q) { return q.uid === x.dataset.x; })[0];
      conferma('Eliminare ' + descr(r) + '?\nNon è ancora stato esportato. Andrà nel cestino, da cui potrai ripristinarlo per 30 giorni.', 'Elimina', true).then(function (ok) { if (ok) { nelCestino([r.uid]); vistaArchivio(); } });
    }; });
    $$('.selchk').forEach(function (c) { c.onchange = function () { if (c.checked) sel[c.dataset.s] = 1; else delete sel[c.dataset.s]; $('#selN').textContent = Object.keys(sel).length + ' selezionati'; }; });
  }
  disegna();
  function aggF() { filtroArc = {treno: $('#fTreno').value, data: $('#fData').value, testo: $('#fTesto').value, stato: $('#fStato').value}; disegna(); }
  ['#fTreno', '#fData', '#fTesto'].forEach(function (s) { $(s).oninput = aggF; });
  $('#fData').onchange = aggF; $('#fStato').onchange = aggF;
  $('#azzera').onclick = function () { filtroArc = {testo: '', treno: '', data: '', stato: 'tutti'}; vistaArchivio(); };
  $('#selBtn').onclick = function () { selezione = true; sel = {}; $('#selBar').hidden = false; disegna(); };
  $('#selAnn').onclick = function () { selezione = false; sel = {}; $('#selBar').hidden = true; disegna(); };
  $('#selDel').onclick = function () {
    var ids = Object.keys(sel); if (!ids.length) { avviso('Nessun modulo selezionato.'); return; }
    var arc = LS.get(K_ARC, []), nEsp = arc.filter(function (r) { return sel[r.uid] && esportato(r); }).length;
    conferma('Eliminare ' + ids.length + ' moduli selezionati?' + (nEsp ? '\n' + nEsp + ' di questi sono già stati esportati.' : '') + '\nAndranno nel cestino, da cui potrai ripristinarli per 30 giorni.', 'Elimina', true).then(function (ok) { if (ok) { nelCestino(ids); vistaArchivio(); } });
  };
  $('#delNonEsp').onclick = function () {
    var ids = LS.get(K_ARC, []).filter(function (r) { return !esportato(r); }).map(function (r) { return r.uid; });
    if (ids.length) conferma('Eliminare tutti i ' + ids.length + ' moduli non ancora esportati?\nAndranno nel cestino, da cui potrai ripristinarli per 30 giorni.', 'Elimina tutti', true).then(function (ok) { if (ok) { nelCestino(ids); vistaArchivio(); } });
  };
  $('#svuota').onclick = function () {
    var arc = LS.get(K_ARC, []);
    finestra({testo: 'Stai per eliminare TUTTI i ' + arc.length + ' moduli dell\'archivio, esportati e non (andranno nel cestino per 30 giorni).\nPer confermare scrivi ELIMINA:', ok: 'Svuota archivio', pericolo: true, input: {ph: 'ELIMINA'}}).then(function (r) {
      if (r === null) return;
      if (r.trim().toUpperCase() !== 'ELIMINA') { avviso('Testo non corretto: nessun modulo eliminato.'); return; }
      nelCestino(arc.map(function (x) { return x.uid; })); vistaArchivio();
    });
  };
  $('#indietro').onclick = function () { vai('home'); };
  $('#cest').onclick = function () { vai('cestino'); };
  $('#cons').onclick = function () { $('#consf').click(); };
  $('#consf').onchange = function () { var f = this.files[0]; this.value = ''; if (f) apriConsulta(f); };
  $('#exp').onclick = function () { esporta(); vistaArchivio(); };
  $('#drv').onclick = salvaSuDrive;
  $('#imp').onclick = function () { $('#impf').click(); };
  $('#impf').onchange = function () { var f = this.files[0]; this.value = ''; if (f) importa(f); };
}

/* ---------- CESTINO ---------- */
function vistaCestino() {
  pulisciCestino();
  var tr = LS.get(K_TRASH, []).slice().sort(function (a, b) { return a.eliminatoISO < b.eliminatoISO ? 1 : -1; });
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Archivio</button><h1>Cestino</h1><div class="sub">' + tr.length + ' moduli · eliminati definitivamente dopo 30 giorni</div></div></header>';
  h += '<div class="lista">' + (tr.length ? tr.map(function (t) {
    var r = t.rec, giorni = Math.max(0, 30 - Math.floor((Date.now() - Date.parse(t.eliminatoISO)) / 864e5));
    return '<div class="card"><div class="cnome">' + esc(r.nome) + ' N. ' + r.prog + '/' + esc(r.sal) + '</div><div class="cinfo">Treno ' + esc(r.campi.trn || '—') + ' · confermato ' + esc(r.confermato) + '</div><div class="cinfo">Eliminato il ' + esc(new Date(t.eliminatoISO).toLocaleString('it-IT')) + ' · ancora ' + giorni + ' giorni</div>' +
      '<div class="riga"><button class="pri" data-rip="' + r.uid + '">Ripristina</button><button class="danger" data-def="' + r.uid + '">Elimina definitivamente</button></div></div>';
  }).join('') : '<div class="cinfo">Il cestino è vuoto.</div>') + '</div>';
  if (tr.length) h += '<div class="fondo"><button class="danger full" id="svuotaC">Svuota cestino</button></div>';
  app.innerHTML = h;
  function togli(uid, definitivo) {
    var t = LS.get(K_TRASH, []), item = t.filter(function (x) { return x.rec.uid === uid; })[0];
    if (!item) return;
    if (definitivo) { var del = LS.get(K_DELID, []); del.push(uid); LS.set(K_DELID, del); }
    else { var arc = LS.get(K_ARC, []); if (!arc.some(function (r) { return r.uid === uid; })) { arc.push(item.rec); if (!LS.set(K_ARC, arc)) return; } }
    LS.set(K_TRASH, t.filter(function (x) { return x.rec.uid !== uid; }));
  }
  $$('[data-rip]').forEach(function (b) { b.onclick = function () { togli(b.dataset.rip, false); vistaCestino(); }; });
  $$('[data-def]').forEach(function (b) { b.onclick = function () {
    var r = tr.filter(function (t) { return t.rec.uid === b.dataset.def; })[0].rec;
    conferma('Eliminare definitivamente ' + descr(r) + '?\nNon potrai più recuperarlo dall\'app.', 'Elimina definitivamente', true).then(function (ok) { if (ok) { togli(r.uid, true); vistaCestino(); } });
  }; });
  if ($('#svuotaC')) $('#svuotaC').onclick = function () {
    conferma('Eliminare definitivamente tutti i ' + tr.length + ' moduli nel cestino?\nNon potrai più recuperarli dall\'app.', 'Svuota cestino', true).then(function (ok) {
      if (!ok) return;
      var del = LS.get(K_DELID, []); tr.forEach(function (t) { del.push(t.rec.uid); });
      LS.set(K_DELID, del); LS.set(K_TRASH, []); vistaCestino();
    });
  };
  $('#indietro').onclick = function () { vai('archivio'); };
}

/* ---------- SCHEDA MODULO ---------- */
function vistaRecord(id) {
  var r = LS.get(K_ARC, []).filter(function (x) { return x.uid === id; })[0];
  if (!r) { vai('archivio', null, true); return; }
  var ne = !esportato(r);
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Archivio</button><h1>' + esc(r.nome) + ' N. ' + r.prog + '/' + esc(r.sal) + '</h1><div class="sub">Confermato il ' + esc(r.confermato) + ' · modello ' + esc(r.versioneModello) + '</div></div><span class="bloc">bloccato</span></header>';
  h += '<span class="badge ' + (ne ? 'ne' : 'es') + '">' + (ne ? 'non esportato' : 'esportato') + '</span>';
  h += '<pre class="rec">' + esc(r.riepilogo) + '</pre><div class="riga"><button class="pri" id="txt">Scarica come testo</button><button id="drv1">Salva su Drive</button>' + (navigator.share ? '<button id="sh">Condividi</button>' : '') + '<button id="home">Moduli</button></div>';
  h += '<div class="fondo"><button class="danger-lite full" id="del">Elimina questo modulo</button></div>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('archivio'); };
  $('#home').onclick = function () { vai('home'); };
  $('#txt').onclick = function () { scarica(new Blob([r.riepilogo], {type: 'text/plain;charset=utf-8'}), 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt'); };
  if ($('#sh')) $('#sh').onclick = function () { navigator.share({title: r.nome + ' N. ' + r.prog + '/' + r.sal, text: r.riepilogo}).catch(function () {}); };
  $('#drv1').onclick = function () { condividiFile(r.riepilogo, 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt', r.nome + ' N. ' + r.prog + '/' + r.sal); };
  $('#del').onclick = function () {
    conferma('Eliminare ' + descr(r) + '?' + (ne ? '\nNon è ancora stato esportato.' : '') + '\nAndrà nel cestino, da cui potrai ripristinarlo per 30 giorni.', 'Elimina', true).then(function (ok) { if (ok) { nelCestino([r.uid]); vai('archivio', null, true); } });
  };
}
function scarica(blob, nome) {
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome;
  document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function pacchettoArchivio() {
  var adesso = new Date(), iso = adesso.toISOString(), arc = LS.get(K_ARC, []);
  var p = function (n) { return (n < 10 ? '0' : '') + n; };
  return {iso: iso, n: arc.length, testo: JSON.stringify({app: 'moduli-m40', formato: 1, esportato: iso, contatori: contatori(), archivio: arc}, null, 1),
    nome: 'm40-archivio-' + adesso.getFullYear() + p(adesso.getMonth() + 1) + p(adesso.getDate()) + '-' + p(adesso.getHours()) + p(adesso.getMinutes())};
}
function segnaEsportato(iso) {
  var arc = LS.get(K_ARC, []);
  arc.forEach(function (r) { if (!r.esportato) r.esportato = iso; });
  LS.set(K_ARC, arc); LS.set(K_EXP, iso);
}
function esporta() {
  var pk = pacchettoArchivio();
  scarica(new Blob([pk.testo], {type: 'application/json'}), pk.nome + '.json');
  segnaEsportato(pk.iso);
}
/* Salva su Drive: apre il menu di condivisione di Android (scegliere Drive e la cartella).
   Chrome non condivide file .json: il file è .txt con lo stesso contenuto, e l'app lo rilegge. */
function condividiFile(testo, nome, titolo) {
  var f;
  try { f = new File([testo], nome, {type: 'text/plain'}); } catch (e) { f = null; }
  if (!f || !navigator.canShare || !navigator.canShare({files: [f]})) {
    avviso('Questo telefono non permette di condividere file dall\'app. Usa «Esporta archivio»: il file va nella cartella Download e da lì puoi caricarlo su Drive.');
    return Promise.resolve(false);
  }
  return navigator.share({files: [f], title: titolo}).then(function () { return true; }, function (e) {
    if (e && e.name !== 'AbortError') avviso('Condivisione non riuscita: ' + (e.message || e.name) + '. Riprova o usa «Esporta archivio».');
    return false;
  });
}
function salvaSuDrive() {
  var pk = pacchettoArchivio();
  if (!pk.n) { avviso('L\'archivio è vuoto: non c\'è niente da salvare.'); return; }
  condividiFile(pk.testo, pk.nome + '.txt', 'Archivio Moduli M.40').then(function (ok) {
    if (!ok) return;
    segnaEsportato(pk.iso);
    vistaArchivio();
    avviso('File «' + pk.nome + '.txt» inviato. Se hai scelto Drive, controlla che sia comparso nella cartella: senza linea Drive lo carica appena torna la connessione.');
  });
}
function importa(file) {
  var fr = new FileReader();
  fr.onload = function () {
    var dati; try { dati = JSON.parse(fr.result); } catch (e) { avviso('File non valido.'); return; }
    if (!dati || dati.app !== 'moduli-m40' || !Array.isArray(dati.archivio)) { avviso('Questo file non è un archivio dei Moduli M.40.'); return; }
    var arc = LS.get(K_ARC, []), noti = {}, eliminati = {};
    arc.forEach(function (r) { noti[r.uid] = 1; });
    LS.get(K_TRASH, []).forEach(function (t) { eliminati[t.rec.uid] = 1; });
    LS.get(K_DELID, []).forEach(function (u) { eliminati[u] = 1; });
    var validi = dati.archivio.filter(function (r) { return r && r.uid; });
    var nuovi = validi.filter(function (r) { return !noti[r.uid] && !eliminati[r.uid]; });
    var elim = validi.filter(function (r) { return !noti[r.uid] && eliminati[r.uid]; });
    var nPres = validi.length - nuovi.length - elim.length;
    var elenco = elim.slice(0, 5).map(function (r) { return '• ' + descr(r); }).join('\n') + (elim.length > 5 ? '\n… e altri ' + (elim.length - 5) : '');
    (elim.length ? finestra({testo: 'Il file contiene ' + elim.length + (elim.length === 1 ? ' modulo che avevi eliminato' : ' moduli che avevi eliminato') + ':\n' + elenco + '\n\nVuoi reimportare anche ' + (elim.length === 1 ? 'questo modulo?' : 'questi moduli?'), ok: 'Sì, reimporta', annulla: 'No'}) : Promise.resolve(false)).then(function (anche) {
      var daImp = anche ? nuovi.concat(elim) : nuovi;
      if (!daImp.length) {
        avviso('Nessun modulo da importare: ' + nPres + ' già presenti nell\'archivio' + (elim.length ? ', ' + elim.length + ' eliminati in precedenza (non reimportati)' : '') + '.');
        return;
      }
      var testo = 'Importare ' + daImp.length + (daImp.length === 1 ? ' modulo?' : ' moduli?') + '\n' + nPres + ' già presenti';
      if (elim.length) testo += anche ? ', ' + elim.length + ' eliminati in precedenza (verranno reimportati)' : ', ' + elim.length + ' eliminati in precedenza (non verranno reimportati)';
      testo += '.\nI progressivi verranno portati al valore più alto tra telefono e file.';
      return conferma(testo, 'Importa').then(function (ok) {
        if (!ok) return;
        daImp.forEach(function (r) { if (!r.esportato) r.esportato = dati.esportato || new Date().toISOString(); });
        if (anche && elim.length) {
          var via = {}; elim.forEach(function (r) { via[r.uid] = 1; });
          LS.set(K_TRASH, LS.get(K_TRASH, []).filter(function (t) { return !via[t.rec.uid]; }));
          LS.set(K_DELID, LS.get(K_DELID, []).filter(function (u) { return !via[u]; }));
        }
        LS.set(K_ARC, arc.concat(daImp));
        var c = contatori(), ci = dati.contatori || {};
        Object.keys(ci).forEach(function (k) { if (+ci[k] > (c[k] || 0)) c[k] = +ci[k]; });
        LS.set(K_CNT, c);
        avviso('Importazione completata: ' + daImp.length + (daImp.length === 1 ? ' modulo aggiunto.' : ' moduli aggiunti.')); vistaArchivio();
      });
    });
  };
  fr.readAsText(file);
}


/* ---------- CONSULTA FILE ESPORTATO (sola lettura, non importa nulla) ---------- */
var consulta = null, filtroCons = {treno: '', data: '', testo: ''};
function apriConsulta(file) {
  var fr = new FileReader();
  fr.onload = function () {
    var dati; try { dati = JSON.parse(fr.result); } catch (e) { avviso('File non valido.'); return; }
    if (!dati || dati.app !== 'moduli-m40' || !Array.isArray(dati.archivio)) { avviso('Questo file non è un archivio dei Moduli M.40.'); return; }
    consulta = {nome: file.name, esportato: dati.esportato, archivio: dati.archivio.filter(function (r) { return r && r.uid; })};
    filtroCons = {treno: '', data: '', testo: ''};
    vai('consulta');
  };
  fr.readAsText(file);
}
function filtraModuli(lista, f) {
  var t = (f.testo || '').toLowerCase(), tn = (f.treno || '').trim().toLowerCase(), d = f.data;
  return lista.filter(function (r) {
    if (tn && String((r.campi && r.campi.trn) || '').toLowerCase().indexOf(tn) < 0) return false;
    if (d && normData(r.campi && r.campi.dat) !== d && dataLocale(r.confermatoISO) !== d) return false;
    if (t && ((r.riepilogo || '') + ' ' + (r.confermato || '')).toLowerCase().indexOf(t) < 0) return false;
    return true;
  });
}
function vistaConsulta() {
  if (!consulta) { vai('archivio', null, true); return; }
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Archivio</button><h1>File esportato</h1><div class="sub">' + esc(consulta.nome) + (consulta.esportato ? ' · esportato il ' + esc(new Date(consulta.esportato).toLocaleString('it-IT')) : '') + '</div></div><span class="bloc">sola lettura</span></header>';
  h += '<div class="avviso">Stai consultando il file, non l\'archivio del telefono: qui non si importa né si elimina nulla.</div>';
  h += '<div class="card filtri"><div class="griglia">' +
    '<div><label>N° treno</label><input id="cTreno" inputmode="numeric" placeholder="es. 45120"></div>' +
    '<div><label>Data (modulo o conferma)</label><input id="cData" type="date"></div>' +
    '<div class="s2"><label>Cerca nel testo</label><input id="cTesto" placeholder="località, segnale, prescrizione…"></div>' +
    '</div><div class="riga"><button id="cAzzera">Azzera filtri</button><button id="cChiudi">Chiudi file</button></div></div>';
  h += '<div class="cinfo" id="cConta"></div><div id="cElenco" class="lista"></div>';
  app.innerHTML = h;
  $('#cTreno').value = filtroCons.treno; $('#cData').value = filtroCons.data; $('#cTesto').value = filtroCons.testo;
  function disegna() {
    var tutti = consulta.archivio.slice().sort(function (a, b) { return a.confermatoISO < b.confermatoISO ? 1 : -1; });
    var lista = filtraModuli(tutti, filtroCons);
    $('#cConta').textContent = lista.length + ' di ' + tutti.length + ' moduli nel file';
    $('#cElenco').innerHTML = lista.length ? lista.map(function (r) {
      return '<button class="voce" data-c="' + esc(r.uid) + '"><b>' + esc(r.nome) + ' N. ' + esc(r.prog) + '/' + esc(r.sal) + '</b><span>Treno ' + esc((r.campi && r.campi.trn) || '—') + ' · ' + esc((r.campi && r.campi.dat) || 'data —') + '</span><span>Confermato ' + esc(r.confermato) + '</span></button>';
    }).join('') : '<div class="cinfo">' + (tutti.length ? 'Nessun modulo corrisponde ai filtri.' : 'Il file non contiene moduli.') + '</div>';
    $$('#cElenco [data-c]').forEach(function (b) { b.onclick = function () { vai('crec', b.dataset.c); }; });
  }
  disegna();
  function agg() { filtroCons = {treno: $('#cTreno').value, data: $('#cData').value, testo: $('#cTesto').value}; disegna(); }
  ['#cTreno', '#cData', '#cTesto'].forEach(function (s) { $(s).oninput = agg; }); $('#cData').onchange = agg;
  $('#cAzzera').onclick = function () { filtroCons = {treno: '', data: '', testo: ''}; vistaConsulta(); };
  $('#cChiudi').onclick = function () { consulta = null; vai('archivio', null, true); };
  $('#indietro').onclick = function () { vai('archivio'); };
}
function vistaConsultaRecord(id) {
  var r = consulta && consulta.archivio.filter(function (x) { return x.uid === id; })[0];
  if (!r) { vai('archivio', null, true); return; }
  var h = '<header class="top"><div><button class="link" id="indietro">‹ File esportato</button><h1>' + esc(r.nome) + ' N. ' + esc(r.prog) + '/' + esc(r.sal) + '</h1><div class="sub">Confermato il ' + esc(r.confermato) + ' · modello ' + esc(r.versioneModello) + '</div></div><span class="bloc">sola lettura</span></header>';
  h += '<pre class="rec">' + esc(r.riepilogo) + '</pre><div class="riga"><button class="pri" id="txt">Scarica come testo</button>' + (navigator.share ? '<button id="sh">Condividi</button>' : '') + '</div>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('consulta'); };
  $('#txt').onclick = function () { scarica(new Blob([r.riepilogo], {type: 'text/plain;charset=utf-8'}), 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt'); };
  if ($('#sh')) $('#sh').onclick = function () { navigator.share({title: r.nome + ' N. ' + r.prog + '/' + r.sal, text: r.riepilogo}).catch(function () {}); };
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
