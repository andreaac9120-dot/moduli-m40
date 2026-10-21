const assert=require('node:assert/strict'), harness=require('./app-harness.cjs');
const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{
 const {c,failed,messages}=harness();const d=harness.draft(),m=c.mod(d.moduloId);
 assert.equal(c.controlla(m,d).length,0);
 for(const dat of ['31/02/2026','29/02/2025','','1/1/26'])assert.ok(c.controlla(m,{...d,v:{...d.v,dat}}).some(x=>x.includes('Data non valida')));
 assert.ok(c.dataValida('29/02/2024'));assert.ok(!c.dataValida('29/02/2100'));
 for(const ora of ['24:00','12:60','','9:00'])assert.ok(!c.oraValida(ora));
 for(const v of ['12abc','1e3','1.2','-1','0',String(Number.MAX_SAFE_INTEGER)])assert.ok(!c.progressivoValido(v));
 assert.ok(c.progressivoValido('0005'));
 assert.ok(c.controlla(m,{...d,v:{...d.v,testo:'Velocità ≤ 30'}}).some(x=>x.includes('≤')));
 assert.deepEqual(c.M40Pdf.unsupportedCharacters('Città più vicina — “è”\n€'),[]);
 assert.deepEqual(c.M40Pdf.unsupportedCharacters('Łódź ≤ 😀'),['Ł','ź','≤','😀']);
 const r=harness.record(),pack=rs=>JSON.stringify({app:'moduli-m40',formato:1,archivio:rs,contatori:{m40_normale:8}});
 assert.equal(c.leggiArchivio(pack([r,r])).archivio.length,1);
 for(const bad of [{...r,uid:'x" onmouseover="alert(1)'},{...r,campi:{testo:3}},{...r,scelta:[]},{...r,presc:[{n:1,testo:{}}]},{...r,confermatoISO:'invalid'}, {...r,prog:Infinity}])assert.throws(()=>c.leggiArchivio(pack([bad])));
 assert.throws(()=>c.leggiArchivio(pack([r,{...r,riepilogo:'conflict'}])));
 assert.throws(()=>c.leggiArchivio(JSON.stringify({app:'moduli-m40',formato:2,archivio:[]})));
 c.LS.set(c.K_ARC,[r]);const pk=c.pacchettoArchivio();
 const later={...r,uid:'later',confermatoISO:'2020-01-01T00:00:00.000Z'};
 c.LS.set(c.K_ARC,[r,later]);assert.ok(c.segnaEsportato(pk));
 let arc=c.LS.get(c.K_ARC,[]);assert.ok(c.esportato(arc[0]));assert.ok(!c.esportato(arc[1]));
 c.LS.set(c.K_ARC,[{...r,riepilogo:'new content'}]);assert.ok(c.segnaEsportato(pk));assert.ok(!c.esportato(c.LS.get(c.K_ARC,[])[0]));
 failed.add(c.K_ARC);const last=c.LS.get(c.K_EXP,null);assert.equal(c.segnaEsportato(pk),false);assert.equal(c.LS.get(c.K_EXP,null),last);failed.delete(c.K_ARC);
 // A delayed confirmation must not overwrite records created after opening the import dialog.
 c.LS.set(c.K_ARC,[]);c.vistaArchivio=()=>{};let approve;c.conferma=()=>new Promise(r=>approve=r);
 c.importa(pack([r]));await tick();c.LS.set(c.K_ARC,[later]);approve(true);await tick();
 assert.equal(c.LS.get(c.K_ARC,[]).length,2);
 // Render hostile legacy records safely even if they predate import validation.
 const h=harness(),legacy={...r,uid:'x" data-audit="injected',prog:'<img src=x onerror=alert(1)>'};
 h.c.LS.set(h.c.K_ARC,[legacy]);h.c.vistaArchivio();
 assert.ok(!h.elements.get('#elenco').innerHTML.includes('data-audit="injected'));
 assert.ok(!h.elements.get('#elenco').innerHTML.includes('<img'));
 // Browser lock ownership is held for the lifetime of the first page.
 let owner=false,pending;
 const locks={request(name,opts,fn){assert.equal(name,'m40-sessione-scrittura');if(owner)return Promise.resolve(fn(null));owner=true;return Promise.resolve().then(()=>{pending=fn({name});return pending;});}};
 const first=harness({locks});await tick();assert.equal(first.c.sessioneAttiva,true);
 const second=harness({locks});await tick();assert.equal(second.c.sessioneAttiva,false);
 assert.match(second.elements.get('app').innerHTML,/altra scheda/);
 console.log('Stability: date/time/numbers, Unicode preflight, backup schema, escaping, export snapshot, import race and session lock OK');
})().catch(e=>{console.error(e);process.exitCode=1;});
