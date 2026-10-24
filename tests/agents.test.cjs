const assert = require('node:assert/strict');
const harness = require('./app-harness.cjs');
(async () => {
  for (const model of harness().c.MODULI) {
    const {c} = harness();
    const profile = {nome:'Mario',cognome:'Bianchi',matricola:'123'};
    c.LS.set(c.K_PROFILO, profile);
    c.chiediProgressivo = () => Promise.resolve(7);
    c.vai = () => {};
    c.nuovaCompilazione(c.mod(model.id));
    await new Promise(resolve => setImmediate(resolve));
    const d = c.LS.get(c.K_DRAFT);
    assert.equal(d.v.adc, 'Bianchi', model.id);
    Object.assign(d.v,{sal:'01',agn:'5',ags:'02',agt:'Rossi',dest:'AdC',testo:'Prova'});
    d.scelta = {oa:'Si ordina',direzione:'invio'};
    d.v.adc = ' ';
    assert(c.controlla(c.mod(model.id), d).some(e=>/cognome|Cognome/.test(e)), model.id);
    d.v.adc = 'Bianchi'; d.v.agt = ' ';
    assert(c.controlla(c.mod(model.id), d).some(e=>/Cognome/.test(e)), model.id);
  }
  const {c,elements} = harness();
  c.LS.set(c.K_PROFILO,{nome:'Mario',cognome:'Bianchi',matricola:'123'});
  const d = {...harness.draft(),moduloId:'fn_0229'};
  d.v.adc = ''; c.LS.set(c.K_DRAFT,d);
  c.vistaForm();
  assert.equal(c.LS.get(c.K_DRAFT).v.adc,'Bianchi');
  d.v.adc = 'Verdi'; c.LS.set(c.K_DRAFT,d);
  c.vistaForm();
  assert.equal(c.LS.get(c.K_DRAFT).v.adc,'Verdi');
  c.vistaImpostazioni();
  c.$('#profiloNome').value='Anna'; c.$('#profiloCognome').value='Neri'; c.$('#profiloMatricola').value='456';
  c.vai=()=>{}; c.$('#salvaProfilo').onclick();
  assert.equal(c.LS.get(c.K_DRAFT).v.adc,'Verdi');
  assert.equal(c.LS.get(c.K_DRAFT).firmatario,null);
  console.log('Cognomi: profilo e controlli su tutti gli otto moduli; recupero bozza e modifiche manuali OK');
})().catch(e=>{console.error(e);process.exit(1)});
