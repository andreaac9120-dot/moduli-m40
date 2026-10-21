'use strict';
/* App Moduli M.40 — funziona offline; tutti i dati restano sul telefono (localStorage). */
var APP_VERSIONE = '1.17.0-cvr';
var K_CNT = 'm40.contatori', K_ARC = 'm40.archivio', K_DRAFT = 'm40.bozza', K_EXP = 'm40.ultimaEsportazione', K_TRASH = 'm40.cestino', K_DELID = 'm40.eliminati', K_ADC = 'm40.cognomeAdc', K_PROFILO = 'm40.profilo', K_TEMA = 'm40.tema', K_RETE = 'm40.rete';

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
function dueCifre(n) { return String(n).padStart(2, '0'); }
function dataCorrente(now) { now = now || new Date(); return dueCifre(now.getDate()) + '/' + dueCifre(now.getMonth() + 1) + '/' + now.getFullYear(); }
function oraCorrente(now) { now = now || new Date(); return dueCifre(now.getHours()) + ':' + dueCifre(now.getMinutes()); }
function cambiaData(value, step, now) {
  var match = String(value || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/), date;
  if (match) {
    date = new Date(+match[3], +match[2] - 1, +match[1]);
    if (date.getDate() !== +match[1] || date.getMonth() !== +match[2] - 1 || date.getFullYear() !== +match[3]) date = null;
  }
  if (!date) date = now || new Date();
  date.setDate(date.getDate() + step);
  return dataCorrente(date);
}
function cambiaOra(value, step, now) {
  var match = String(value || '').match(/^(\d{1,2}):(\d{2})$/), h = match && +match[1], m = match && +match[2];
  if (!match || h > 23 || m > 59) { now = now || new Date(); h = now.getHours(); m = now.getMinutes(); }
  var total = h * 60 + m + step, day = Math.floor(total / 1440), minute = ((total % 1440) + 1440) % 1440;
  return {ora: dueCifre(Math.floor(minute / 60)) + ':' + dueCifre(minute % 60), giorni: day};
}
var app = document.getElementById('app');
/* ---------- tema chiaro / scuro ---------- */
function applicaTema(t) { document.documentElement.setAttribute('data-theme', t); var mc = document.querySelector('meta[name=theme-color]'); if (mc) mc.setAttribute('content', t === 'dark' ? '#111214' : '#F4F6F9'); }
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
  else if (st.v === 'cvr') vistaCvr();
  else if (st.v === 'cvr-scheda') vistaCvrScheda(st.a);
  else if (st.v === 'archivio') vistaArchivio();
  else if (st.v === 'record') vistaRecord(st.a);
  else if (st.v === 'cestino') vistaCestino();
  else if (st.v === 'consulta') vistaConsulta();
  else if (st.v === 'crec') vistaConsultaRecord(st.a);
  else if (st.v === 'impostazioni') vistaImpostazioni();
  else vistaHome();
}

/* ---------- contatori ---------- */
function contatori() { return LS.get(K_CNT, {}); }
function prossimo(id) { var c = contatori(); return c[id] || null; }
function impostaProssimo(id, n) { var c = contatori(); c[id] = n; return LS.set(K_CNT, c); }
function chiediProgressivo(m, attuale) {
  return chiediTesto('Numero progressivo per ' + m.nome + (attuale ? '\n(attuale: N. ' + attuale + ')' : '') + '\nInserisci il numero da usare per il prossimo modulo:', attuale || '1', 'numeric').then(function (r) {
    if (r === null) return null;
    var n = Number(String(r).trim());
    if (!Number.isSafeInteger(n) || n < 1) { avviso('Numero non valido.'); return null; }
    if (!attuale) return impostaProssimo(m.id, n) ? n : null;
    return conferma('Confermi? Il prossimo ' + m.nome + ' sarà il N. ' + n + '.').then(function (ok) { if (!ok) return null; return impostaProssimo(m.id, n) ? n : null; });
  });
}

/* ---------- HOME ---------- */
function vistaHome() {
  var bozza = LS.get(K_DRAFT, null), arc = LS.get(K_ARC, []), exp = LS.get(K_EXP, null);
  var h = '<header class="top"><div><h1>Moduli M.40</h1><div class="sub">Prescrizioni ai treni · Captrain</div></div><div class="dx"><div class="top-actions">' + temaBtn() + '<details class="menu-azioni"><summary aria-label="Apri menu impostazioni" title="Impostazioni">⋮</summary><div class="menu-voci"><button id="apriImp">Impostazioni</button></div></details></div>' + statoRete() + '</div></header>';
  if (bozza && mod(bozza.moduloId)) {
    var bm = mod(bozza.moduloId);
    h += '<div class="avviso"><b>Modulo in compilazione:</b> ' + esc(bm.nome) + ' N. ' + bozza.prog +
      '<div class="riga"><button class="pri" id="riprendi">Riprendi</button><button id="scarta">Elimina bozza</button></div></div>';
  }
  var reti = [];
  MODULI.forEach(function (m) { var r = m.rete || 'RFI'; if (reti.indexOf(r) < 0) reti.push(r); });
  reti.push('CVR');
  var sel = LS.get(K_RETE, reti[0]);
  if (reti.indexOf(sel) < 0) sel = reti[0];
  h += '<div class="seg" role="tablist">' + reti.map(function (r) {
    var n = r === 'CVR' ? CVR_PROCEDURE.length : MODULI.filter(function (m) { return (m.rete || 'RFI') === r; }).length;
    return '<button role="tab" aria-selected="' + (r === sel) + '" class="' + (r === sel ? 'on' : '') + '" data-rete="' + esc(r) + '">' + esc(r) + ' <span class="n">' + n + '</span></button>';
  }).join('') + '</div>';
  if (sel === 'CVR') {
    h += '<h2>Comunicazioni verbali registrate</h2><div class="card"><p>Consulta le 24 procedure per codice, situazione di impiego e formula. Ogni scheda permette di preparare una sola procedura alla volta.</p><p class="nota">L’app non registra la voce, non invia comunicazioni e non sostituisce l’inteso con il RdC.</p><button class="pri full" id="apriCvr">Apri le procedure CVR</button></div>';
  }
  if (sel !== 'CVR') [sel].forEach(function (rete) {
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
  if ($('#apriCvr')) $('#apriCvr').onclick = function () { vai('cvr'); };
  $('#apriImp').onclick = function () { vai('impostazioni'); };
  $$('[data-rete]').forEach(function (b) { b.onclick = function () { LS.set(K_RETE, b.dataset.rete); var y = window.scrollY; vistaHome(); window.scrollTo(0, y); }; });
}
function profiloCompleto(p) { return !!(p && (p.nome || '').trim() && (p.cognome || '').trim() && (p.matricola || '').trim()); }
function vistaImpostazioni() {
  var p = LS.get(K_PROFILO, {}) || {};
  app.innerHTML = '<header class="top"><div><button class="link" id="indietro">‹ Moduli</button><h1>Impostazioni</h1><div class="sub">Dati personali per la compilazione</div></div>' + temaBtn() + '</header>' +
    '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">♙</span>Il mio profilo</span></div><p class="nota">Il cognome viene proposto nel campo Agente ricevente dei moduli D.L. e nel campo AdC degli altri moduli, escluso il 0229 FERROVIENORD: lì i ruoli si compilano manualmente. Nome, cognome e matricola vengono riportati in basso sui moduli liberi RFI.</p>' +
    '<div class="griglia"><div><label for="profiloNome">Nome</label><input id="profiloNome" autocomplete="given-name"></div><div><label for="profiloCognome">Cognome</label><input id="profiloCognome" autocomplete="family-name"></div><div class="s2"><label for="profiloMatricola">Numero di matricola</label><input id="profiloMatricola" autocomplete="off"></div></div>' +
    '<div id="profiloErr" class="err" role="alert"></div><button class="pri full" id="salvaProfilo">Salva profilo</button></section>';
  $('#profiloNome').value = p.nome || ''; $('#profiloCognome').value = p.cognome || ''; $('#profiloMatricola').value = p.matricola || '';
  $('#indietro').onclick = function () { vai('home'); };
  $('#salvaProfilo').onclick = function () {
    var nuovo = {nome:$('#profiloNome').value.trim(),cognome:$('#profiloCognome').value.trim(),matricola:$('#profiloMatricola').value.trim()};
    if (!profiloCompleto(nuovo)) { $('#profiloErr').textContent = 'Inserisci nome, cognome e numero di matricola.'; return; }
    if (!LS.set(K_PROFILO, nuovo)) return;
    LS.set(K_ADC, nuovo.cognome);
    var d = LS.get(K_DRAFT, null);
    if (d && d.moduloId !== 'fn_0229') { if (!d.v) d.v={}; if (!d.v.adc || d.v.adc === p.cognome) d.v.adc = nuovo.cognome; d.firmatario = nuovo; LS.set(K_DRAFT, d); }
    vai('home');
  };
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
      var profilo = LS.get(K_PROFILO, null), now = new Date(), v0 = {adc: m.id === 'fn_0229' ? '' : (profiloCompleto(profilo) ? profilo.cognome : LS.get(K_ADC, '')), dat: dataCorrente(now), ora: oraCorrente(now)};
      if (LS.set(K_DRAFT, {uid: uid(), moduloId: m.id, prog: p, v: v0, pv: {}, checks: [], scelta: {}, compilatoreAG: false, firmatario: m.id === 'fn_0229' ? null : (profiloCompleto(profilo) ? profilo : null), libera: m.tipo === 'libero' ? false : null, liberaTesto: '', creato: new Date().toISOString()})) vai('form');
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
  var now = new Date(), dateAdded = false;
  if (!d.v.dat) { d.v.dat = dataCorrente(now); dateAdded = true; }
  if (!d.v.ora) { d.v.ora = oraCorrente(now); dateAdded = true; }
  if (m.id === 'fn_0229' && !d.scelta.direzione) { d.scelta.direzione = 'ricevo'; dateAdded = true; }
  if (dateAdded) LS.set(K_DRAFT, d);
  var h = '<header class="formtop"><div class="riga1"><button class="link" id="indietro">‹ Moduli</button><div style="display:flex;gap:8px;align-items:center">' + temaBtn() + '<span class="num">N. ' + d.prog + '</span></div></div>' +
    '<h1>' + esc(m.nome) + '</h1><div class="sub">' + esc(m.rete || 'RFI') + ' · Captrain · modello ' + esc(m.versione) + '</div>' +
    '<div class="stato">' + (m.tipo === 'libero' ? '' : '<span class="chip acc" id="stSel"></span>') + '<span class="chip" id="stMan"></span></div></header>';
  h += '<div class="foglio">';
  function campo(c) {
    if (c.tipo === 'ps') return '<div><label>' + esc(c.label) + '</label><div class="coppia"><b>' + d.prog + '</b><span class="sl">/</span><input data-f="sal" maxlength="2" inputmode="numeric" placeholder="00"></div></div>';
    if (c.tipo === 'ag') return '<div class="s2"><label>' + (M40Pdf.hasGuardColumn(m.id) ? 'N° agente trasmittente (DM/DCO o A.G.)' : esc(c.label)) + '</label><div class="coppia"><input data-f="agn" inputmode="numeric" placeholder="progr." class="w110"><span class="sl">/</span><input data-f="ags" maxlength="2" inputmode="numeric" placeholder="00" class="w70"></div></div>';
    if (c.id === 'dat' || c.id === 'ora') {
      var date = c.id === 'dat', unit = date ? 'Giorno' : 'Minuto';
      return '<div class="s2"><label>' + esc(c.label) + '</label><div class="passo-dataora"><button type="button" data-passo="' + c.id + '" data-dir="-1" aria-label="' + unit + ' precedente" title="' + unit + ' precedente">‹</button><input data-f="' + c.id + '" inputmode="numeric" placeholder="' + (date ? 'gg/mm/aaaa' : 'hh:mm') + '" aria-label="' + esc(c.label) + '"><button type="button" data-passo="' + c.id + '" data-dir="1" aria-label="' + unit + ' successivo" title="' + unit + ' successivo">›</button></div></div>';
    }
    return '<div' + (c.span === 2 ? ' class="s2"' : '') + '><label>' + esc(c.label) + '</label><input data-f="' + c.id + '"' + (c.ph ? ' placeholder="' + esc(c.ph) + '"' : '') + (c.id === 'ora' || c.id === 'dat' || c.id === 'trn' ? ' inputmode="numeric"' : '') + '></div>';
  }
  var trasm = ['agt', 'adc'];
  var cDati = m.campi.filter(function (c) { return c.tipo !== 'ag' && trasm.indexOf(c.id) < 0; });
  var cTras = m.campi.filter(function (c) { return c.tipo === 'ag' || trasm.indexOf(c.id) >= 0; });
  if (m.id !== 'fn_0229' && !m.campi.some(function (c) { return c.id === 'adc'; })) cTras.push({id:'adc',label:M40Pdf.hasGuardColumn(m.id) ? 'Cognome agente ricevente (proposto dal profilo)' : 'Cognome AdC (proposto dal profilo)',span:2});
  h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">▣</span>Dati treno</span><span class="tag' + (m.rete === 'FERROVIENORD' ? ' fn' : '') + '">' + esc(m.rete || 'RFI') + '</span></div><div class="griglia">' + cDati.map(campo).join('') + '</div></section>';
  h += '<section class="sez"><div class="sez-t"><span class="l"><span class="ic">⇄</span>Trasmissione</span></div>' + (m.id === 'fn_0229' ? '<div class="scelte"><label><input type="radio" name="direzione" data-sc="direzione" value="ricevo"> Ricevo dal DM/DCO</label><label><input type="radio" name="direzione" data-sc="direzione" value="invio"> Invio al DM/DCO</label></div>' : '') + '<div class="griglia">' + cTras.map(campo).join('') + '</div>' + (m.id === 'fn_0229' ? '<p class="nota">Inserisci il tuo numero nel campo «Progressivo / saltuario (mio)» e quello del DM/DCO qui sotto. La scelta indica chi trasmette; nessuna firma viene aggiunta automaticamente.</p>' : '') + '</section>';
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
    (M40Pdf.hasGuardColumn(m.id) ? '<label class="compilatore-ag"><input type="checkbox" id="compilatoreAG"><span>Compilato da A.G. <small>Seleziona per barrare solo la colonna A.G. a destra. Altrimenti viene barrata la colonna DM a sinistra.</small></span></label>' : '') +
    '<textarea id="free" placeholder="Testo esatto dettato dal DM/RdC" hidden></textarea></section>' +
    '<section class="sez" id="sezRiep"><div class="sez-t"><span class="l"><span class="ic">✓</span>Riepilogo e conferma</span></div>' +
    '<div class="nota" id="riepNota">Genera il riepilogo per rileggere i dati nell’ordine di ripetizione. I valori che hai inserito saranno evidenziati.</div>' +
    '<div id="err" class="err" role="alert"></div><div id="out" class="riepilogo-lettura" hidden></div>' +
    (M40Pdf.supports(m.id) ? '<div class="riga"><button id="pdfBozza" hidden>Scarica anteprima del modulo PDF</button>' + (M40Pdf.hasBack(m.id) ? '<button id="vediRetro" hidden>Consulta il retro</button>' : '') + '</div>' : '') +
    '<div id="cf" hidden><p class="nota">Dopo la ripetizione integrale e la verifica dei numeri, puoi procedere alla conferma.</p><button class="pri full" id="cfb">Procedi alla conferma del modulo</button>' +
    '<div id="cfq" class="avviso" hidden>Dopo la conferma il modulo viene salvato nell\'archivio e bloccato; lo stato diventa «collazionato/confermato». Procedi solo se ' + (m.tipo === 'libero' ? 'chi riceve ha' : 'l\'AdC ha') + ' ripetuto integralmente il dispaccio e comunicato progressivo/saltuario.<div class="riga"><button class="pri" id="cfy">Sì, conferma</button><button id="cfn">Annulla</button></div></div></div>' +
    (m.note ? '<div class="nota note-mod">' + esc(m.note) + '</div>' : '') +
    '<div class="nota" style="margin-top:10px">Bozza salvata automaticamente sul telefono a ogni modifica.</div></section>' +
    '<div class="barra"><button class="pri" id="gen">Genera riepilogo</button></div></div>';
  app.innerHTML = h;
  var riepilogoPronto = false;
  function invalidaRiepilogo() {
    if (!$('#out').hidden) $('#riepNota').textContent = 'Hai modificato i dati. Genera di nuovo il riepilogo prima di ripeterli e confermare.';
    riepilogoPronto = false;
    $('#out').hidden = true; $('#cf').hidden = true; $('#cfq').hidden = true;
    if ($('#pdfBozza')) $('#pdfBozza').hidden = true;
    if ($('#vediRetro')) $('#vediRetro').hidden = true;
  }

  // ripristino valori dalla bozza
  $$('[data-f]').forEach(function (i) { if (d.v[i.dataset.f] != null) i.value = d.v[i.dataset.f]; });
  $$('[data-p]').forEach(function (i) { var key = i.dataset.p + '_' + i.dataset.k; if (d.pv[key] != null) i.value = d.pv[key]; });
  $$('[data-c]').forEach(function (c) { c.checked = d.checks.indexOf(+c.dataset.c) >= 0; });
  $$('[data-sc]').forEach(function (r) { r.checked = d.scelta[r.dataset.sc] === r.value; });
  if ($('#compilatoreAG')) $('#compilatoreAG').checked = d.compilatoreAG === true;
  $('#free').value = d.liberaTesto || '';
  aggiornaDerivati(); impostaLibera(d.libera, true); aggiornaStato();

  function salva() {
    d.v = {}; $$('[data-f]').forEach(function (i) { d.v[i.dataset.f] = i.value; });
    d.pv = {}; $$('[data-p]').forEach(function (i) { d.pv[i.dataset.p + '_' + i.dataset.k] = i.value; });
    d.checks = $$('[data-c]').filter(function (c) { return c.checked; }).map(function (c) { return +c.dataset.c; });
    d.scelta = {}; $$('[data-sc]').forEach(function (r) { if (r.checked) d.scelta[r.dataset.sc] = r.value; });
    d.compilatoreAG = !!($('#compilatoreAG') && $('#compilatoreAG').checked);
    d.liberaTesto = $('#free').value;
    return LS.set(K_DRAFT, d);
  }
  function aggiornaDerivati() {
    var trn = $('[data-f="trn"]'); $$('[data-mirror="trn"]').forEach(function (i) { i.value = trn ? trn.value : ''; });
    var prn = $('[data-f="prn"]');
    if (prn) prn.value = numeriPrescrizioni(m, $$('[data-c]').filter(function (c) { return c.checked; }).map(function (c) { return +c.dataset.c; }));
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
    if (!init) { salva(); aggiornaStato(); invalidaRiepilogo(); }
  }
  var foglio = $('.foglio');
  foglio.addEventListener('input', function (e) {
    var p = e.target.dataset && e.target.dataset.p;
    if (p && e.target.value.trim()) { var c = $('[data-c="' + p + '"]'); if (c && !c.checked) c.checked = true; }
    aggiornaDerivati(); salva(); aggiornaStato(); invalidaRiepilogo();
  });
  foglio.addEventListener('change', function (e) {
    var sc = e.target.dataset && e.target.dataset.sc;
    if (sc && e.target.checked) { var c = $('[data-c="' + sc + '"]'); if (c && !c.checked) c.checked = true; }
    aggiornaDerivati(); salva(); aggiornaStato(); invalidaRiepilogo();
  });
  $$('[data-passo]').forEach(function (button) { button.onclick = function () {
    var key = button.dataset.passo, dir = +button.dataset.dir, input = $('[data-f="' + key + '"]');
    if (key === 'dat') input.value = cambiaData(input.value, dir);
    else {
      var changed = cambiaOra(input.value, dir);
      input.value = changed.ora;
      if (changed.giorni) { var date = $('[data-f="dat"]'); if (date) date.value = cambiaData(date.value, changed.giorni); }
    }
    aggiornaDerivati(); salva(); aggiornaStato(); invalidaRiepilogo();
  }; });
  $('#indietro').onclick = function () { vai('home'); };
  $('#ysi').onclick = function () { impostaLibera(true); };
  $('#yno').onclick = function () { impostaLibera(false); };
  if ($('#rst')) $('#rst').onclick = function () { conferma('Deselezionare tutte le caselle?', 'Deseleziona').then(function (ok) { if (ok) { $$('[data-c]').forEach(function (c) { c.checked = false; }); aggiornaDerivati(); salva(); aggiornaStato(); invalidaRiepilogo(); } }); };
  $('#gen').onclick = function () {
    if (!salva()) return; var e = controlla(m, d);
    $('#err').textContent = e.join(' · ');
    var o = $('#out'); o.hidden = false; o.innerHTML = riepilogoHtml(m, d);
    attivaLettura(o);
    riepilogoPronto = !e.length;
    $('#cfb').disabled = !!e.length;
    $('#riepNota').textContent = e.length ? 'Completa i dati segnalati, poi genera nuovamente il riepilogo.' : 'Leggi nell’ordine le sezioni qui sotto. Puoi ingrandire il testo o passare alla lettura guidata.';
    if ($('#pdfBozza')) $('#pdfBozza').hidden = !!e.length;
    if ($('#vediRetro')) $('#vediRetro').hidden = !!e.length;
    $('#cf').hidden = false; $('#cfq').hidden = true;
    $('#sezRiep').scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  if ($('#pdfBozza')) $('#pdfBozza').onclick = function () {
    if (!salva()) return; var e = controlla(m, d);
    if (e.length) { $('#err').textContent = 'Prima di generare il PDF completa: ' + e.join(' · '); return; }
    scaricaPdf({moduloId:m.id,nome:m.nome,versioneModello:m.versione,prog:d.prog,sal:d.v.sal,campi:d.v,
      presc:prescSelezionate(m,d),libera:d.libera === true ? d.liberaTesto : null,
      scelta:d.scelta,pv:d.pv,compilatoreAG:d.compilatoreAG===true,firmatario:d.firmatario}, true);
  };
  if ($('#vediRetro')) $('#vediRetro').onclick = function () { consultaRetro(m.id); };
  $('#cfb').onclick = function () {
    if (!riepilogoPronto) return;
    if (!salva()) return; var e = controlla(m, d);
    if (e.length) { $('#err').textContent = 'Prima di confermare completa: ' + e.join(' · '); return; }
    $('#err').textContent = ''; $('#cfq').hidden = false;
  };
  $('#cfn').onclick = function () { $('#cfq').hidden = true; };
  $('#cfy').onclick = function () {
    if (!riepilogoPronto) return;
    if (!salva()) return; var e = controlla(m, d);
    if (e.length) { $('#err').textContent = 'Prima di confermare completa: ' + e.join(' · '); $('#cfq').hidden = true; return; }
    var rec = registra(m, d);
    if (rec) vai('record', rec.uid, true);
  };
}
function isNumerata(m, n) { for (var i = 0; i < m.presc.length; i++) if (m.presc[i].n === n) return !m.presc[i].libera || m.presc[i].numerata; return false; }
function numeriPrescrizioni(m, checks) { return checks.filter(function (n) { return isNumerata(m, n); }).sort(function (a, b) { return a - b; }).join(', '); }

/* ---------- controlli e riepilogo ---------- */
function controlla(m, d) {
  var e = [], v = d.v;
  if (!/^\d{2}$/.test(v.sal || '')) e.push('Numero saltuario (2 cifre) mancante');
  if (!(v.agn || '').trim() || !/^\d{2}$/.test(v.ags || '')) e.push(m.id === 'fn_0229' ? 'N° DM/DCO (progressivo/saltuario 2 cifre) mancante' : m.tipo === 'libero' ? 'N° DCO/DM (progressivo/saltuario 2 cifre) mancante' : 'N° DM/DCO trasmittente (progressivo/saltuario 2 cifre) mancante');
  if (m.tipo === 'libero') {
    if (!d.scelta.oa) e.push('Scegli «Si ordina» o «Si dà avviso»');
    if (!(v.dest || '').trim()) e.push('Destinatario mancante');
    if (!(v.testo || '').trim()) e.push('Testo del dispaccio mancante');
    if (!(v.agt || '').trim()) e.push(m.id === 'fn_0229' ? 'Cognome DM/DCO mancante' : 'Cognome DCO/DM mancante');
    if (m.id === 'fn_0229' && !['ricevo', 'invio'].includes(d.scelta.direzione)) e.push('Scegli chi trasmette il dispaccio');
    if (m.id !== 'fn_0229' && !(v.adc || '').trim()) e.push('Cognome AdC mancante');
    return e;
  }
  if (d.libera !== true && d.libera !== false) e.push('Rispondi Sì/No sulla prescrizione libera');
  if (d.libera === true && !(d.liberaTesto || '').trim()) e.push('Testo prescrizione libera mancante');
  if (!d.checks.length) e.push('Nessuna casella selezionata');
  m.presc.forEach(function (p) { if (p.scelta && d.checks.indexOf(p.n) >= 0 && !d.scelta[p.n]) e.push('Prescrizione ' + p.n + ': scegli ' + p.scelta.join(' / ')); });
  m.presc.forEach(function (p) {
    if (d.checks.indexOf(p.n) < 0) return;
    if (m.id === 'fn_0229_2' && p.n === 2) {
      if (d.scelta[2] && !(d.pv['2_' + (d.scelta[2] === 'verso' ? 1 : 0)] || '').trim())
        e.push('Prescrizione 2: compila il ' + (d.scelta[2] === 'verso' ? 'posto o segnale' : 'numero del binario'));
      return;
    }
    var n = p.libera ? 1 : (p.t.match(/\{\}/g) || []).length;
    for (var k = 0; k < n; k++) if (!(d.pv[p.n + '_' + k] || '').trim()) e.push('Prescrizione ' + p.n + ': campo ' + (k + 1) + ' mancante');
  });
  return e;
}
function testoPresc(m, p, d) {
  if (m.id === 'fn_0229_2' && p.n === 2) {
    return d.scelta[2] === 'verso'
      ? 'Dovete istradarvi verso ' + ((d.pv['2_1'] || '').trim() || '[MANCANTE]') + ' (successivo posto o segnale).'
      : 'Dovete istradarvi sul binario n° ' + ((d.pv['2_0'] || '').trim() || '[MANCANTE]') + '.';
  }
  if (p.libera) return (d.pv[p.n + '_0'] || '').trim() || '(vuoto)';
  var k = 0, s = p.t.replace(/\{\}/g, function () { var x = (d.pv[p.n + '_' + (k++)] || '').trim(); return x || '[MANCANTE]'; });
  if (p.scelta && p.sost) s = s.replace(p.segnaposto, d.scelta[p.n] ? d.scelta[p.n] : '[' + p.scelta.join('/') + ' MANCANTE]');
  else if (p.scelta) s = s.replace(p.segnaposto, d.scelta[p.n] ? '(' + d.scelta[p.n] + ')' : '[' + p.scelta.join('/') + ' MANCANTE]');
  return s;
}
function prescSelezionate(m, d) {
  if (!m.presc) return [];
  return m.presc.filter(function (p) { return d.checks.indexOf(p.n) >= 0; }).sort(function (a, b) { return a.n - b.n; }).map(function (p) {
    return {n: p.n, numerata: !p.libera || !!p.numerata, testo: testoPresc(m, p, d)};
  });
}
/* Vista di lettura: il testo esportabile resta separato dalla presentazione. */
function valoreRiepilogo(value) {
  return value != null && String(value).trim() ? '<strong class="valore-letto">' + esc(String(value).trim()) + '</strong>' : '<strong class="dato-mancante">Da completare</strong>';
}
function prescrizioneHtml(p, d) {
  if (d.moduloId === 'fn_0229_2' && p.n === 2) {
    return d.scelta[2] === 'verso'
      ? 'Dovete istradarvi verso ' + valoreRiepilogo(d.pv['2_1']) + ' (successivo posto o segnale).'
      : 'Dovete istradarvi sul binario n° ' + valoreRiepilogo(d.pv['2_0']) + '.';
  }
  if (p.libera) return valoreRiepilogo(d.pv[p.n + '_0']);
  var parts = p.t.split('{}');
  return parts.map(function (part, i) {
    var s = esc(part);
    if (p.scelta) {
      var scelta = valoreRiepilogo(d.scelta[p.n]);
      s = s.replace(esc(p.segnaposto), p.sost ? scelta : '(' + scelta + ')');
    }
    return s + (i < parts.length - 1 ? valoreRiepilogo(d.pv[p.n + '_' + i]) : '');
  }).join('');
}
function riepilogoHtml(m, d) {
  var v = d.v, sections = [];
  function dato(label, value) { return '<div><dt>' + esc(label) + '</dt><dd>' + valoreRiepilogo(value) + '</dd></div>'; }
  function section(title, content) { sections.push('<section class="lettura-blocco" data-read-step tabindex="-1"><h3>' + esc(title) + '</h3>' + content + '</section>'); }
  var dati = dato('Progressivo del modulo', d.prog) + dato('Saltuario del modulo', v.sal);
  m.campi.forEach(function (c) {
    if (!c.tipo && ['agt', 'adc', 'ora'].indexOf(c.id) < 0) dati += dato(c.label, v[c.id]);
  });
  if (M40Pdf.hasGuardColumn(m.id) && d.compilatoreAG === true) dati += dato('Colonna delle prescrizioni da barrare', 'A.G. (destra)');
  section('Identificazione del modulo', '<dl class="lettura-dati">' + dati + '</dl>');
  var trasmissione = dato('Ora di trasmissione', v.ora) + dato(m.id === 'fn_0229' ? 'DM / DCO' : m.tipo === 'libero' ? 'DCO / DM' : 'Agente trasmittente', v.agt) +
    dato(m.id === 'fn_0229' ? 'Progressivo DM / DCO' : M40Pdf.hasGuardColumn(m.id) && d.compilatoreAG === true ? 'Progressivo A.G.' : 'Progressivo DCO / DM', v.agn) + dato(m.id === 'fn_0229' ? 'Saltuario DM / DCO' : M40Pdf.hasGuardColumn(m.id) && d.compilatoreAG === true ? 'Saltuario A.G.' : 'Saltuario DCO / DM', v.ags) +
    (m.id === 'fn_0229' ? '' : dato(M40Pdf.hasGuardColumn(m.id) ? 'Cognome agente ricevente' : 'Cognome AdC', v.adc));
  if (m.id === 'fn_0229') {
    trasmissione = dato('Chi trasmette', d.scelta.direzione === 'invio' ? 'Io invio al DM/DCO' : 'Ricevo dal DM/DCO') + dato('Mio progressivo / saltuario', d.prog + '/' + v.sal) + trasmissione;
  }
  section('Dati di trasmissione', '<dl class="lettura-dati">' + trasmissione + '</dl>');
  if (m.tipo === 'libero' && m.id !== 'fn_0229' && d.firmatario && profiloCompleto(d.firmatario)) section('Firma nel modulo', '<dl class="lettura-dati">' + dato('Nome e cognome', d.firmatario.nome + ' ' + d.firmatario.cognome) + dato('Matricola', d.firmatario.matricola) + '</dl>');
  if (m.tipo === 'libero') {
    section('Dispaccio da ripetere', '<p class="lettura-frase">' + valoreRiepilogo(d.scelta.oa) + ' ' + esc(m.destLabel || 'a') + ' ' + valoreRiepilogo(v.dest) + '</p><div class="lettura-testo">' + valoreRiepilogo(v.testo) + '</div>');
  } else {
    var ordine = esc(m.ordine).replace(/\{(trn|sig|loc|prn)\}/g, function (_, key) { return valoreRiepilogo(key === 'prn' ? numeriPrescrizioni(m, d.checks) : v[key]); });
    section('Ordine e prescrizioni da rispettare', '<p class="lettura-frase">' + ordine + '</p><p class="lettura-aiuto">Seguono solo le prescrizioni selezionate, nell’ordine del modulo.</p>');
    m.presc.filter(function (p) { return d.checks.indexOf(p.n) >= 0; }).forEach(function (p) {
      section(p.libera && !p.numerata ? 'Riga libera aggiuntiva' : 'Prescrizione ' + p.n, '<div class="lettura-testo">' + prescrizioneHtml(p, d) + '</div>');
    });
    section('Prescrizione libera', d.libera === true ? '<div class="lettura-testo">' + valoreRiepilogo(d.liberaTesto) + '</div>' : '<p class="lettura-frase">' + (d.libera === false ? 'Nessuna prescrizione libera richiesta.' : '<strong class="dato-mancante">Risposta Sì / No da completare</strong>') + '</p>');
  }
  section('Controllo finale', '<p class="lettura-frase">Numero del modulo da comunicare: ' + valoreRiepilogo(d.prog) + ' / ' + valoreRiepilogo(v.sal) + '.</p><p class="lettura-aiuto">Controlla la corrispondenza con il dispaccio ricevuto. La navigazione tra le sezioni non conferma il modulo: la conferma rimane un’azione separata.</p>');
  return '<div class="lettura-intro"><span class="lettura-etichetta">Rilettura prima della conferma</span><h2>' + esc(m.nome) + '</h2><p>N. <b>' + esc(d.prog) + ' / ' + esc(v.sal || '…') + '</b></p></div>' +
    '<div class="lettura-strumenti"><button type="button" data-lettura="guida" aria-pressed="false">Lettura guidata</button><button type="button" data-lettura="grande" aria-pressed="false">Testo più grande</button><button type="button" data-lettura="modifica">Torna ai dati</button></div>' +
    '<p class="lettura-aiuto">I valori inseriti sono in grassetto e in evidenza. Ripeti le frasi per intero.</p>' +
    '<div class="lettura-passi" aria-live="polite">' + sections.join('') + '</div>' +
    '<nav class="lettura-nav" aria-label="Navigazione del riepilogo" hidden><button type="button" data-lettura="indietro">Precedente</button><span data-lettura="posizione" role="status"></span><button type="button" data-lettura="avanti">Successivo</button></nav>';
}
function attivaLettura(container) {
  var steps = Array.prototype.slice.call(container.querySelectorAll('[data-read-step]')), index = 0, guided = false;
  function button(action) { return container.querySelector('[data-lettura="' + action + '"]'); }
  function show(focus) {
    steps.forEach(function (step, i) { step.hidden = guided && i !== index; });
    container.querySelector('.lettura-nav').hidden = !guided;
    button('guida').setAttribute('aria-pressed', String(guided));
    button('guida').textContent = guided ? 'Mostra tutto il riepilogo' : 'Lettura guidata';
    button('posizione').textContent = (index + 1) + ' di ' + steps.length;
    button('indietro').disabled = index === 0;
    button('avanti').disabled = index === steps.length - 1;
    if (focus && guided) { steps[index].focus({preventScroll: true}); steps[index].scrollIntoView({behavior: 'smooth', block: 'nearest'}); }
  }
  button('guida').onclick = function () { guided = !guided; show(true); };
  button('indietro').onclick = function () { index = Math.max(0, index - 1); show(true); };
  button('avanti').onclick = function () { index = Math.min(steps.length - 1, index + 1); show(true); };
  button('grande').onclick = function () {
    var large = container.classList.toggle('lettura-grande');
    this.setAttribute('aria-pressed', String(large)); this.textContent = large ? 'Dimensione normale' : 'Testo più grande';
  };
  button('modifica').onclick = function () {
    var first = document.querySelector('.foglio [data-f]');
    if (first) { first.focus({preventScroll: true}); first.scrollIntoView({behavior: 'smooth', block: 'center'}); }
  };
  show(false);
}
function riepilogo(m, d, confermato) {
  var v = d.v, M = function (x) { return (x || '').trim() || '[MANCANTE]'; }, L = [];
  L.push('RIEPILOGO PER COLLAZIONAMENTO (non è la trascrizione integrale)');
  L.push(m.nome + ' N. ' + d.prog + '/' + M(v.sal) + '  ·  modello ' + m.versione);
  m.campi.forEach(function (c) { if (!c.tipo) L.push(c.label + ': ' + M(v[c.id])); });
  if (m.tipo === 'libero') {
    if (m.id === 'fn_0229') L.push('Trasmissione: ' + (d.scelta.direzione === 'invio' ? 'io invio al DM/DCO' : 'ricevo dal DM/DCO'));
    L.push((m.id === 'fn_0229' ? 'N° DM/DCO: ' : 'N° DCO/DM: ') + M(v.agn) + '/' + M(v.ags));
    L.push('');
    L.push((d.scelta.oa ? d.scelta.oa.toUpperCase() : '[SI ORDINA / SI DÀ AVVISO MANCANTE]') + ' ' + (m.destLabel || 'a') + ' ' + M(v.dest) + ':');
    L.push(M(v.testo));
    L.push('');
    if (m.id !== 'fn_0229' && d.firmatario && profiloCompleto(d.firmatario)) L.push('Firma nel modulo: ' + d.firmatario.nome + ' ' + d.firmatario.cognome + ' · Matricola ' + d.firmatario.matricola);
    L.push('Stato: ' + (confermato ? 'collazionato/confermato' : 'bozza'));
    L.push('Spazi non utilizzati: annullare con riga continua.');
    L.push('Dispaccio NON trasmesso finché chi riceve non ripete integralmente e comunica progressivo/saltuario.');
    if (confermato) { L.push(''); L.push('MODULO CONFERMATO DEFINITIVAMENTE il ' + confermato + ' (stato: collazionato/confermato).'); }
    return L.join('\n');
  }
  if (m.ordine.indexOf('{sig}') >= 0) L.push('Fermo al segnale: ' + M(v.sig) + ' di ' + M(v.loc));
  if (m.ordine.indexOf('{prn}') >= 0) L.push('Prescrizioni n° (da barrare): ' + M(numeriPrescrizioni(m, d.checks)));
  if (M40Pdf.hasGuardColumn(m.id) && d.compilatoreAG === true) L.push('Colonna delle prescrizioni da barrare: A.G. (destra)');
  L.push('N° ' + (M40Pdf.hasGuardColumn(m.id) && d.compilatoreAG === true ? 'A.G.' : 'DM/DCO') + ' trasmittente: ' + M(v.agn) + '/' + M(v.ags));
  L.push((M40Pdf.hasGuardColumn(m.id) ? 'Cognome agente ricevente: ' : 'Cognome AdC: ') + M(v.adc));
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
  // La stessa bozza mantiene l'identificatore anche se il contatore non si salva.
  if (!d.uid) { d.uid = uid(); if (!LS.set(K_DRAFT, d)) return null; }
  var rec = {
    uid: d.uid, moduloId: m.id, nome: m.nome, versioneModello: m.versione, appVersione: APP_VERSIONE,
    prog: d.prog, sal: d.v.sal, campi: d.v, presc: prescSelezionate(m, d), scelta: d.scelta, pv: d.pv, compilatoreAG: d.compilatoreAG === true, firmatario: d.firmatario || null,
    libera: d.libera === true ? d.liberaTesto : null, stato: 'collazionato/confermato',
    confermato: quando, confermatoISO: adesso.toISOString(), riepilogo: riepilogo(m, d, quando)
  };
  var arc = LS.get(K_ARC, []), existing = arc.filter(function (r) { return r.uid === d.uid; })[0];
  if (!existing) { arc.push(rec); if (!LS.set(K_ARC, arc)) return null; }
  var c = contatori(); c[m.id] = Math.max(c[m.id] || 0, d.prog + 1);
  if (!LS.set(K_CNT, c)) return null;
  if (m.id !== 'fn_0229' && (d.v.adc || '').trim()) LS.set(K_ADC, d.v.adc.trim());
  LS.del(K_DRAFT);
  return existing || rec;
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
  h += '<pre class="rec">' + esc(r.riepilogo) + '</pre><div class="riga">' + (M40Pdf.supports(r.moduloId) ? '<button class="pri" id="pdf">Scarica modulo PDF compilato</button>' + (M40Pdf.hasBack(r.moduloId) ? '<button id="vediRetro">Consulta il retro</button>' : '') : '') + '<button id="txt">Scarica come testo</button><button id="drv1">' + (M40Pdf.supports(r.moduloId) ? 'Condividi PDF / Drive' : 'Salva su Drive') + '</button>' + (navigator.share ? '<button id="sh">Condividi testo</button>' : '') + '<button id="home">Moduli</button></div>';
  h += '<div class="fondo"><button class="danger-lite full" id="del">Elimina questo modulo</button></div>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('archivio'); };
  $('#home').onclick = function () { vai('home'); };
  $('#txt').onclick = function () { scarica(new Blob([r.riepilogo], {type: 'text/plain;charset=utf-8'}), 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt'); };
  if ($('#pdf')) $('#pdf').onclick = function () { scaricaPdf(r, false); };
  if ($('#vediRetro')) $('#vediRetro').onclick = function () { consultaRetro(r.moduloId); };
  if ($('#sh')) $('#sh').onclick = function () { navigator.share({title: r.nome + ' N. ' + r.prog + '/' + r.sal, text: r.riepilogo}).catch(function () {}); };
  $('#drv1').onclick = function () { if (M40Pdf.supports(r.moduloId)) condividiPdf(r); else condividiFile(r.riepilogo, 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt', r.nome + ' N. ' + r.prog + '/' + r.sal); };
  $('#del').onclick = function () {
    conferma('Eliminare ' + descr(r) + '?' + (ne ? '\nNon è ancora stato esportato.' : '') + '\nAndrà nel cestino, da cui potrai ripristinarlo per 30 giorni.', 'Elimina', true).then(function (ok) { if (ok) { nelCestino([r.uid]); vai('archivio', null, true); } });
  };
}
function scarica(blob, nome) {
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome;
  document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function creaPdf(r) {
  return fetch(M40Pdf.source(r.moduloId)).then(function (res) {
    if (!res.ok) throw new Error('Modelli PDF non disponibili (' + res.status + ').');
    return res.arrayBuffer();
  }).then(function (bytes) { return M40Pdf.build(r, bytes); });
}
function consultaRetro(id) {
  var tab = window.open('', '_blank');
  if (tab) { tab.document.title = 'Retro del modulo'; tab.document.body.textContent = 'Caricamento del retro…'; }
  fetch(M40Pdf.source(id)).then(function (res) { if (!res.ok) throw new Error('Modello non disponibile.'); return res.arrayBuffer(); })
    .then(function (bytes) { return M40Pdf.buildBack(id, bytes); })
    .then(function (bytes) {
      var url = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
      if (tab) tab.location.href = url;
      else scarica(new Blob([bytes], {type:'application/pdf'}), 'M40_' + id + '_RETRO.pdf');
      setTimeout(function () { URL.revokeObjectURL(url); }, 300000);
    }).catch(function (e) { if (tab) tab.close(); avviso('Impossibile aprire il retro: ' + e.message); });
}
function nomePdf(r, bozza) { return 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + (bozza ? '_BOZZA' : '') + '.pdf'; }
function scaricaPdf(r, bozza) {
  var pulsante = bozza ? $('#pdfBozza') : $('#pdf');
  if (pulsante) pulsante.disabled = true;
  creaPdf(r).then(function (bytes) {
    scarica(new Blob([bytes], {type:'application/pdf'}), nomePdf(r, bozza));
  }).catch(function (e) { avviso('Impossibile creare il PDF: ' + e.message); }).then(function () {
    if (pulsante) pulsante.disabled = false;
  });
}
function condividiPdf(r) {
  var btn = $('#drv1'); if (btn) btn.disabled = true;
  creaPdf(r).then(function (bytes) {
    var f = new File([bytes], nomePdf(r, false), {type:'application/pdf'});
    if (!navigator.canShare || !navigator.canShare({files:[f]})) {
      scarica(new Blob([bytes], {type:'application/pdf'}), f.name);
      avviso('PDF scaricato. Dal file puoi condividerlo con Drive.');
      return;
    }
    return navigator.share({files:[f],title:r.nome+' N. '+r.prog+'/'+r.sal});
  }).catch(function (e) {
    if (e.name !== 'AbortError') avviso('Impossibile condividere il PDF: ' + e.message);
  }).then(function () { if (btn) btn.disabled = false; });
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
    var arc = LS.get(K_ARC, []), noti = Object.create(null), eliminati = Object.create(null);
    arc.forEach(function (r) { noti[r.uid] = 1; });
    LS.get(K_TRASH, []).forEach(function (t) { eliminati[t.rec.uid] = 1; });
    LS.get(K_DELID, []).forEach(function (u) { eliminati[u] = 1; });
    var validi = dati.archivio.filter(function (r) {
      return r && typeof r.uid === 'string' && r.uid.length > 0 && typeof r.moduloId === 'string' && mod(r.moduloId) &&
        Number.isSafeInteger(r.prog) && r.prog > 0 && r.prog < Number.MAX_SAFE_INTEGER &&
        typeof r.nome === 'string' && typeof r.sal === 'string' && r.campi && !Array.isArray(r.campi) &&
        typeof r.campi === 'object' && Array.isArray(r.presc) && typeof r.riepilogo === 'string' &&
        typeof r.confermato === 'string' && typeof r.confermatoISO === 'string';
    });
    if (validi.length !== dati.archivio.length) { avviso('Il file contiene moduli incompleti o non validi: importazione annullata.'); return; }
    var nelFile = Object.create(null);
    validi = validi.filter(function (r) { if (nelFile[r.uid]) return false; nelFile[r.uid] = true; return true; });
    var nuovi = validi.filter(function (r) { return !noti[r.uid] && !eliminati[r.uid]; });
    var elim = validi.filter(function (r) { return !noti[r.uid] && eliminati[r.uid]; });
    var nPres = validi.length - nuovi.length - elim.length;
    function salvaContatoriImport() {
      var c = contatori(), ci = dati.contatori || {};
      Object.keys(ci).forEach(function (k) { var n = Number(ci[k]); if (mod(k) && Number.isSafeInteger(n) && n > (c[k] || 0)) c[k] = n; });
      validi.forEach(function (r) { c[r.moduloId] = Math.max(c[r.moduloId] || 0, r.prog + 1); });
      return LS.set(K_CNT, c);
    }
    var elenco = elim.slice(0, 5).map(function (r) { return '• ' + descr(r); }).join('\n') + (elim.length > 5 ? '\n… e altri ' + (elim.length - 5) : '');
    (elim.length ? finestra({testo: 'Il file contiene ' + elim.length + (elim.length === 1 ? ' modulo che avevi eliminato' : ' moduli che avevi eliminato') + ':\n' + elenco + '\n\nVuoi reimportare anche ' + (elim.length === 1 ? 'questo modulo?' : 'questi moduli?'), ok: 'Sì, reimporta', annulla: 'No'}) : Promise.resolve(false)).then(function (anche) {
      var daImp = anche ? nuovi.concat(elim) : nuovi;
      if (!daImp.length) {
        if (!salvaContatoriImport()) return;
        avviso('Nessun modulo da importare: ' + nPres + ' già presenti nell\'archivio' + (elim.length ? ', ' + elim.length + ' eliminati in precedenza (non reimportati)' : '') + '.');
        return;
      }
      var testo = 'Importare ' + daImp.length + (daImp.length === 1 ? ' modulo?' : ' moduli?') + '\n' + nPres + ' già presenti';
      if (elim.length) testo += anche ? ', ' + elim.length + ' eliminati in precedenza (verranno reimportati)' : ', ' + elim.length + ' eliminati in precedenza (non verranno reimportati)';
      testo += '.\nI progressivi verranno portati al valore più alto tra telefono e file.';
      return conferma(testo, 'Importa').then(function (ok) {
        if (!ok) return;
        daImp.forEach(function (r) { if (!r.esportato) r.esportato = dati.esportato || new Date().toISOString(); });
        if (!salvaContatoriImport()) return;
        if (!LS.set(K_ARC, arc.concat(daImp))) return;
        if (anche && elim.length) {
          var via = Object.create(null); elim.forEach(function (r) { via[r.uid] = 1; });
          LS.set(K_TRASH, LS.get(K_TRASH, []).filter(function (t) { return !via[t.rec.uid]; }));
          LS.set(K_DELID, LS.get(K_DELID, []).filter(function (u) { return !via[u]; }));
        }
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
  h += '<pre class="rec">' + esc(r.riepilogo) + '</pre><div class="riga">' + (M40Pdf.supports(r.moduloId) ? '<button class="pri" id="pdf">Scarica modulo PDF compilato</button>' + (M40Pdf.hasBack(r.moduloId) ? '<button id="vediRetro">Consulta il retro</button>' : '') : '') + '<button id="txt">Scarica come testo</button>' + (navigator.share ? '<button id="sh">Condividi testo</button>' : '') + '</div>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('consulta'); };
  $('#txt').onclick = function () { scarica(new Blob([r.riepilogo], {type: 'text/plain;charset=utf-8'}), 'M40_' + r.moduloId + '_N' + r.prog + '-' + r.sal + '.txt'); };
  if ($('#pdf')) $('#pdf').onclick = function () { scaricaPdf(r, false); };
  if ($('#vediRetro')) $('#vediRetro').onclick = function () { consultaRetro(r.moduloId); };
  if ($('#sh')) $('#sh').onclick = function () { navigator.share({title: r.nome + ' N. ' + r.prog + '/' + r.sal, text: r.riepilogo}).catch(function () {}); };
}

/* ---------- catalogo CVR: consultazione e preparazione, senza registrazione vocale ---------- */
var cvrFiltro = '', cvrBozza = {codice: null, sede: '', cognome: '', treno: '', data: dataCorrente(), fermata: '', variabili: {}};
function cvrProcedura(codice) { return CVR_PROCEDURE.filter(function (p) { return p.codice === codice; })[0] || null; }
function cvrCampi(formula) {
  var trovato = formula.match(/\[[^\]]+\]/g) || [];
  return trovato.filter(function (campo, indice) { return trovato.indexOf(campo) === indice; });
}
function cvrFormula(p, valori) {
  var formula = p.formula;
  if (!String(valori['[LOCALITÀ, SE PREVISTA]'] || '').trim()) formula = formula.replace(' di [LOCALITÀ, SE PREVISTA]', '');
  return formula.replace(/\[([^\]]+)\]/g, function (tutto) {
    return String(valori[tutto] || '').trim() || tutto;
  });
}
function vistaCvr() {
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Moduli</button><h1>Procedure CVR</h1><div class="sub">24 procedure · 7 gruppi · Allegato 3 IPCL Captrain</div></div>' + temaBtn() + '</header>';
  h += '<div class="avviso"><b>Consultazione per la preparazione.</b> La registrazione avviene tramite SCR RFI, non tramite questa app. Ogni comunicazione richiede le condizioni previste, una sola procedura alla volta e la ripetizione integrale da parte del ricevente. Le CVR sono escluse per treni in ETCS; in caso di guasto SCR si usano le forme tradizionali.</div>';
  h += '<label for="cvrCerca">Cerca codice, situazione o gruppo</label><input id="cvrCerca" type="search" placeholder="Es. SCMT 02, supero rosso" value="' + esc(cvrFiltro) + '"><div id="cvrElenco"></div>';
  h += '<footer>Schede di studio basate sul manuale fornito. Verifica sempre IPCL e disposizioni vigenti prima dell’impiego.</footer>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('home'); };
  function elenco() {
    var q = cvrFiltro.toLocaleLowerCase('it-IT').trim();
    var lista = CVR_PROCEDURE.filter(function (p) { return (p.codice + ' ' + p.gruppo + ' ' + p.quando + ' ' + p.formula).toLocaleLowerCase('it-IT').indexOf(q) >= 0; });
    var gruppo = '';
    $('#cvrElenco').innerHTML = lista.map(function (p) {
      var titolo = p.gruppo !== gruppo ? '<h2>' + esc(gruppo = p.gruppo) + '</h2>' : '';
      return titolo + '<button class="voce cvr-voce" data-cvr="' + esc(p.codice) + '"><b>' + esc(p.codice) + '</b><span>' + esc(p.quando) + '</span><small>' + esc(p.riferimento) + '</small></button>';
    }).join('') || '<p class="nota">Nessuna procedura trovata.</p>';
    $$('#cvrElenco [data-cvr]').forEach(function (b) { b.onclick = function () { vai('cvr-scheda', b.dataset.cvr); }; });
  }
  $('#cvrCerca').oninput = function () { cvrFiltro = this.value; elenco(); };
  elenco();
}
function cvrCompleta(p, bozza) {
  return ['sede', 'cognome', 'treno', 'data', 'fermata'].every(function (k) { return !!String(bozza[k] || '').trim(); }) &&
    cvrCampi(p.formula).every(function (k) { return k === '[LOCALITÀ, SE PREVISTA]' || !!String(bozza.variabili[k] || '').trim(); });
}
function vistaCvrScheda(codice) {
  var p = cvrProcedura(codice);
  if (!p) { vai('cvr', null, true); return; }
  if (cvrBozza.codice !== codice) cvrBozza = {codice: codice, sede: cvrBozza.sede, cognome: cvrBozza.cognome, treno: cvrBozza.treno, data: cvrBozza.data, fermata: cvrBozza.fermata, variabili: {}};
  var h = '<header class="top"><div><button class="link" id="indietro">‹ Procedure CVR</button><h1>' + esc(p.codice) + '</h1><div class="sub">' + esc(p.gruppo) + ' · ' + esc(p.riferimento) + '</div></div>' + temaBtn() + '</header>';
  h += '<div class="avviso"><b>Non è una comunicazione registrata.</b> Questa scheda prepara la lettura; non verifica l’applicabilità, non autorizza il movimento e non conferma l’inteso.</div>';
  h += '<section class="sez"><h2>Quando si applica</h2><p>' + esc(p.quando) + '</p><h2>Comportamento AdC</h2><p>' + esc(p.comportamento) + '</p><h2>Attenzioni e limiti</h2><p>' + esc(p.limiti) + '</p></section>';
  h += '<section class="sez"><h2>Intestazione · una procedura per volta</h2><div class="griglia">';
  [['sede','Sede RdC'],['cognome','Cognome RdC'],['treno','Numero treno'],['data','Data di effettuazione treno'],['fermata','Punto di fermata']].forEach(function (a) {
    h += '<div><label for="cvr-' + a[0] + '">' + a[1] + '</label><input id="cvr-' + a[0] + '" data-cvr-header="' + a[0] + '" autocomplete="off" value="' + esc(cvrBozza[a[0]]) + '"></div>';
  });
  h += '</div><h2>Formula e dati variabili</h2><p class="cvr-formula">' + esc(p.formula) + '</p>';
  var campi = cvrCampi(p.formula);
  if (campi.length) h += '<div class="griglia">' + campi.map(function (campo, i) {
    var scelta = campo === '[SINISTRA/DESTRA]' ? ['SINISTRA','DESTRA'] : campo === '[FISSA/LAMPEGGIANTE]' ? ['FISSA','LAMPEGGIANTE'] : campo === '[CORRETTO TRACCIATO/DEVIATA]' ? ['CORRETTO TRACCIATO','DEVIATA A SINISTRA','DEVIATA A DESTRA'] : null;
    var v = cvrBozza.variabili[campo] || '';
    return '<div><label for="cvr-var-' + i + '">' + esc(campo.slice(1,-1)) + '</label>' +
      (scelta ? '<select id="cvr-var-' + i + '" data-cvr-var="' + esc(campo) + '"><option value="">Seleziona</option>' + scelta.map(function (x) { return '<option value="' + x + '"' + (x === v ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select>' : '<input id="cvr-var-' + i + '" data-cvr-var="' + esc(campo) + '" autocomplete="off" value="' + esc(v) + '">') + '</div>';
  }).join('') + '</div>';
  if (p.dati) h += '<p class="nota">Dati indicati nella scheda: ' + esc(p.dati) + '.</p>';
  h += '</section><section class="sez"><h2>Testo di preparazione</h2><p id="cvrStato" class="nota"></p><div id="cvrAnteprima" class="rec cvr-anteprima" aria-live="polite"></div><p class="nota">Il ricevente deve ripetere l’intera intestazione e la formula con tutti i dati ricevuti. Se la comunicazione si interrompe, la procedura va ripetuta integralmente dopo il ripristino.</p></section>';
  h += '<footer>Testo di supporto ricavato dal manuale CVR fornito. Le pagine normative originali e la revisione vigente prevalgono sulla scheda.</footer>';
  app.innerHTML = h;
  $('#indietro').onclick = function () { vai('cvr'); };
  function aggiorna() {
    var pronta = cvrCompleta(p, cvrBozza);
    $('#cvrStato').textContent = pronta ? 'Campi compilati: confronta il testo con la procedura vigente prima dell’uso.' : 'Completa tutti i campi per leggere il testo senza segnaposto.';
    var righe = ['RdC: ' + (cvrBozza.sede || '[SEDE]') + ' · ' + (cvrBozza.cognome || '[COGNOME]'), 'Treno n. ' + (cvrBozza.treno || '[NUMERO]') + ' del ' + (cvrBozza.data || '[DATA]'), 'Punto di fermata: ' + (cvrBozza.fermata || '[PUNTO DI FERMATA]'), 'Procedura: ' + p.codice, '', cvrFormula(p, cvrBozza.variabili)];
    $('#cvrAnteprima').textContent = righe.join('\n');
  }
  $$('[data-cvr-header]').forEach(function (x) { x.oninput = function () { cvrBozza[x.dataset.cvrHeader] = x.value; aggiorna(); }; });
  $$('[data-cvr-var]').forEach(function (x) { x.oninput = function () { cvrBozza.variabili[x.dataset.cvrVar] = x.value; aggiorna(); }; });
  aggiorna();
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
