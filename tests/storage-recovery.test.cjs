const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const data = {}, failed = new Set();
const ctx = {
  Date, APP_VERSIONE: 'test', K_ARC: 'arc', K_CNT: 'cnt', K_DRAFT: 'draft', K_ADC: 'adc',
  LS: {
    get(k, fallback) { return k in data ? JSON.parse(JSON.stringify(data[k])) : fallback; },
    set(k, value) { if (failed.has(k)) return false; data[k] = JSON.parse(JSON.stringify(value)); return true; },
    del(k) { delete data[k]; }
  },
  uid: () => 'record-1',
  prescSelezionate: () => [],
  riepilogo: () => 'Riepilogo'
};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('function contatori()'), source.indexOf('/* ---------- HOME ---------- */')), ctx);
vm.runInContext(source.slice(source.indexOf('function registra('), source.indexOf('/* ---------- stato esportazione')), ctx);
const m = {id: 'dl_ba', nome: 'D.L.', versione: 'v1'};
const d = {prog: 7, v: {sal: '01'}, checks: [], scelta: {}, pv: {}, libera: false};
data.draft = d;
failed.add('arc');
assert.strictEqual(ctx.registra(m, d), null);
assert.strictEqual(data.arc, undefined);
assert(data.draft);
failed.delete('arc');
failed.add('cnt');
assert.strictEqual(ctx.registra(m, d), null);
assert.strictEqual(data.arc.length, 1);
assert(data.draft);
failed.delete('cnt');
assert.strictEqual(ctx.registra(m, d).uid, 'record-1');
assert.strictEqual(data.arc.length, 1);
assert.strictEqual(data.cnt.dl_ba, 8);
assert.strictEqual(data.draft, undefined);
assert.strictEqual(ctx.impostaProssimo('dl_ba', 9), true);
assert.strictEqual(data.cnt.dl_ba, 9);
console.log('Recupero salvataggio: bozza conservata, nessun duplicato, progressivo aggiornato OK');
