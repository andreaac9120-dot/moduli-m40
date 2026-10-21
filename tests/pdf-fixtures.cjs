const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
global.PDFLib = require('../vendor/pdf-lib.min.js');
const pdf = require('../pdf-export.js');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../moduli.js'),'utf8'),ctx);
const folder=process.argv[2] || '/tmp/m40-v2';fs.mkdirSync(folder,{recursive:true});
(async()=>{
 const bytes=fs.readFileSync(path.join(__dirname,'../assets/moduli-originali.pdf'));
 const fnBytes=fs.readFileSync(path.join(__dirname,'../assets/moduli-ferrovienord.pdf')); const expected={};
 for(const m of ctx.MODULI.filter(m=>pdf.supports(m.id))){
  const r={moduloId:m.id,nome:m.nome,prog:123,sal:'45',campi:{sal:'45',sta:'TORINO',loc:'TORINO',trn:'45678',dat:'20/10/2026',ora:'12:34',agt:'DCO ROSSI',agn:'987',ags:'65',adc:'BIANCHI',sig:'PARTENZA',dest:'AdC treno 45678',testo:'DOCUMENTO DI PROVA.\nSeconda riga del dispaccio da verificare.'},scelta:{oa:'Si ordina'},pv:{},presc:[],libera:null};
  const tokens=[];
  for(const p of m.presc||[]){
   if(p.libera){r.pv[p.n+'_0']='LIBERA'+p.n;r.presc.push({n:p.n,numerata:!!p.numerata,testo:'LIBERA'+p.n});tokens.push('LIBERA'+p.n);continue;}
   let k=0,t=p.t.replace(/\{\}/g,()=>{let s='P'+p.n+'F'+k;r.pv[p.n+'_'+k++]=s;tokens.push(s);return s;});
   if(p.scelta){r.scelta[p.n]=p.scelta[0];t=t.replace(p.segnaposto,p.sost?p.scelta[0]:'('+p.scelta[0]+')');}
   r.presc.push({n:p.n,numerata:true,testo:t});
  }
  r.campi.prn=r.presc.filter(p=>p.numerata).map(p=>p.n).join(', ');
  const data=await pdf.build(r,pdf.source(m.id).includes('ferrovienord')?fnBytes:bytes);assert(data.length>10000);fs.writeFileSync(path.join(folder,m.id+'.pdf'),data);
  expected[m.id]=tokens;console.log(m.id,data.length);
 }
 for(const [id,left,right] of [['dl_ba',25,452],['dl_bm_bca',60,375]]){
  for(const agent of [false,true]){
   const r={moduloId:id,nome:id,prog:1,sal:'01',campi:{},presc:[{n:1,numerata:true,testo:'PROVA'}],pv:{'1_0':'PROVA','1_1':'PROVA'},scelta:{},compilatoreAG:agent};
   const data=await pdf.build(r,bytes);
   fs.writeFileSync(path.join(folder,id+'-'+(agent?'ag':'dm')+'.pdf'),data);
  }
  assert(pdf.hasGuardColumn(id));
 }
 assert(!pdf.hasGuardColumn('telec_ba'));
 for(const id of ['dl_ba','dl_bm_bca','telec_ba','telec_bca']){
  const r={moduloId:id,nome:id,prog:5,sal:'01',campi:{trn:'54321',prn:'10, 2, 7'},presc:[10,2,7].map(n=>({n:n,numerata:true,testo:'Prescrizione '+n})),scelta:{},pv:{}};
  fs.writeFileSync(path.join(folder,id+'-intestazione.pdf'),await pdf.build(r,bytes));
 }
 for(const id of ['dl_ba','dl_bm_bca','telec_ba','telec_bca','fn_0229_2']){
  assert(pdf.hasBack(id));
  fs.writeFileSync(path.join(folder,id+'-retro.pdf'),await pdf.buildBack(id,id==='fn_0229_2'?fnBytes:bytes));
 }
 assert(!pdf.hasBack('m40_normale'));
 for(const id of ['m40_normale','m40a']){
  const r={moduloId:id,nome:id,prog:7,sal:'01',campi:{sal:'01',sta:'TORINO',trn:'12345',dat:'20/10/2026',ora:'12:30',agt:'ROSSI',agn:'5',ags:'01',adc:'BIANCHI',dest:'AdC',testo:'Testo di prova'},scelta:{oa:'Si ordina'},firmatario:{nome:'Mario',cognome:'Bianchi',matricola:'98765'}};
  fs.writeFileSync(path.join(folder,id+'-firma.pdf'),await pdf.build(r,bytes));
 }
 const fnRecord={moduloId:'fn_0229',nome:'Modulo 0229 FERROVIENORD',versioneModello:'v4 · 20/10/2026',prog:7,sal:'01',campi:{sal:'01',sta:'TORINO',trn:'12345',dat:'20/10/2026',ora:'12:30',agt:'DCO ROSSI',agn:'5',ags:'02',dest:'AdC',testo:'Testo di prova'},scelta:{oa:'Si ordina',direzione:'ricevo'},firmatario:{nome:'Mario',cognome:'Bianchi',matricola:'98765'}};
 fs.writeFileSync(path.join(folder,'fn_0229-ricevo.pdf'),await pdf.build(fnRecord,fnBytes));
 fs.writeFileSync(path.join(folder,'fn_0229-invio.pdf'),await pdf.build({...fnRecord,scelta:{...fnRecord.scelta,direzione:'invio'}},fnBytes));
 const fnOld={...fnRecord,versioneModello:'v3 · 20/10/2026',campi:{...fnRecord.campi,ord:'DCO VERDI',adc:'AGENTE NERI',ricevProg:'8',ricevSal:'03'}};
 fs.writeFileSync(path.join(folder,'fn_0229-v3.pdf'),await pdf.build(fnOld,fnBytes));
 const fnLegacy={...fnOld,versioneModello:'v1 · 11/10/2026',campi:{...fnOld.campi,adc:'BIANCHI'}};
 fs.writeFileSync(path.join(folder,'fn_0229-vecchio.pdf'),await pdf.build(fnLegacy,fnBytes));
 const long='TermineMoltoLungo'.repeat(140);
 const data=await pdf.build({moduloId:'m40_normale',nome:'Prova estesa',prog:1,sal:'01',campi:{sta:long,testo:long,dest:'Destinatario'},scelta:{oa:'Si dà avviso'}},bytes);
 fs.writeFileSync(path.join(folder,'overflow.pdf'),data);expected.overflow=[long];
 fs.writeFileSync(path.join(folder,'expected.json'),JSON.stringify(expected));
})().catch(e=>{console.error(e);process.exit(1)});
