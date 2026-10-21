const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const data = fs.readFileSync('cvr-data.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const start = app.indexOf('function cvrProcedura(');
const end = app.indexOf('function vistaCvr()', start);
const completeStart = app.indexOf('function cvrCompleta(');
const completeEnd = app.indexOf('function vistaCvrScheda(', completeStart);
assert.ok(start >= 0 && end > start && completeStart >= 0 && completeEnd > completeStart);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(data + '\n' + app.slice(start, end) + '\n' + app.slice(completeStart, completeEnd), ctx);

assert.equal(ctx.CVR_PROCEDURE.length, 24);
assert.equal(new Set(ctx.CVR_PROCEDURE.map(p => p.codice)).size, 24);
assert.deepEqual(Array.from(new Set(ctx.CVR_PROCEDURE.map(p => p.codice.split(' ')[0]))), ['SR', 'SSB', 'PBA', 'CTC', 'BA', 'SCC', 'SCMT']);
assert.equal(ctx.cvrProcedura('SCMT 03').riferimento, 'IPCL Captrain, Allegato 3, p. 177');
assert.equal(ctx.cvrProcedura('XX 99'), null);

const sr = ctx.cvrProcedura('SR 03');
const header = {sede: 'Milano', cognome: 'Rossi', treno: '123', data: '21/10/2026', fermata: 'Saronno'};
const empty = {...header, variabili: {}};
assert.equal(ctx.cvrCompleta(sr, empty), false);
const filled = {...header, variabili: {'[FUNZIONE]': 'protezione', '[LOCALITÀ]': 'Saronno', '[FISSA/LAMPEGGIANTE]': 'FISSA'}};
assert.equal(ctx.cvrCompleta(sr, filled), true);
assert.match(ctx.cvrFormula(sr, filled.variabili), /protezione di Saronno/);
assert.doesNotMatch(ctx.cvrFormula(sr, filled.variabili), /\[[^\]]+\]/);

const optional = ctx.cvrProcedura('SR 08');
const withFunction = {...header, variabili: {'[FUNZIONE]': 'partenza'}};
assert.equal(ctx.cvrCompleta(optional, withFunction), true);
assert.match(ctx.cvrFormula(optional, withFunction.variabili), /segnale partenza disposto/);
assert.doesNotMatch(ctx.cvrFormula(optional, withFunction.variabili), /SE PREVISTA/);

console.log('CVR: 24 procedure, gruppi, campi obbligatori e formula opzionale OK');
