const assert = require('node:assert/strict'), harness = require('./app-harness.cjs');
const {c, failed, messages} = harness(), d=harness.draft(), m=c.mod(d.moduloId);
c.LS.set(c.K_DRAFT,d);c.LS.set(c.K_CNT,{m40_normale:7});
failed.add(c.K_CNT);
assert.equal(c.registra(m,d),null);
assert.equal(c.LS.get(c.K_ARC,[]).length,0); // no partially confirmed record
assert.ok(c.LS.get(c.K_DRAFT,null));
failed.delete(c.K_CNT);failed.add(c.K_ARC);
assert.equal(c.registra(m,d),null);
assert.equal(c.LS.get(c.K_ARC,[]).length,0);
assert.equal(c.prossimo(m.id),8); // a reservation gap is safer than reusing a committed number
assert.ok(c.LS.get(c.K_DRAFT,null));
failed.delete(c.K_ARC);
const saved=c.registra(m,d);
assert.equal(saved.uid,d.uid);assert.equal(c.LS.get(c.K_ARC,[]).length,1);
assert.equal(c.LS.get(c.K_DRAFT,null),null);
const changed={...d,prog:99,v:{...d.v,testo:'changed'}};
assert.equal(c.registra(m,changed).campi.testo,'Prova');
assert.equal(c.prossimo(m.id),8); // retries use the immutable record, not stale draft values
const duplicate={...d,uid:'other-draft'};
assert.equal(c.registra(m,duplicate),null);assert.match(messages.at(-1),/stesso progressivo/);
assert.equal(c.LS.get(c.K_ARC,[]).length,1);
c.LS.set(c.K_TRASH,[{rec:saved,eliminatoISO:new Date().toISOString()}]);c.LS.set(c.K_ARC,[]);
assert.equal(c.registra(m,duplicate),null); // trash still protects against duplicate confirmations
const next={...d,uid:'next',prog:8};c.LS.set(c.K_DRAFT,next);
failed.add('remove:'+c.K_DRAFT);
assert.ok(c.registra(m,next));assert.ok(c.LS.get(c.K_DRAFT,null));
let destination;c.vai=(...args)=>destination=args;c.vistaForm();
assert.equal(destination[0],'record');assert.equal(destination[1],'next');
assert.equal(c.impostaProssimo(m.id,10),true);
console.log('Storage: failed counter/archive writes, retry immutability, duplicate/trash guard and failed draft cleanup OK');
