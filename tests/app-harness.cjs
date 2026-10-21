// Load the whole application with a small DOM/storage boundary; no source slicing.
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
module.exports = function harness(options = {}) {
  const values = options.values || new Map(), failed = new Set(), messages = [], elements = new Map();
  const element = () => ({innerHTML:'', value:'', hidden:false, setAttribute(){}, getAttribute(){return 'light';}, addEventListener(){}, querySelectorAll(){return [];}, focus(){}, scrollIntoView(){}});
  const query = s => { if (!elements.has(s)) elements.set(s, element()); return elements.get(s); };
  const context = {
    console, Date, setTimeout, clearTimeout, Blob, URL,
    document: {getElementById: query, querySelector: query, querySelectorAll: () => [], documentElement:element(), addEventListener(){}},
    window:{addEventListener(){}, scrollTo(){}}, history:{replaceState(){},pushState(){}}, location:{reload(){}},
    navigator: {locks: options.locks || {request:()=>new Promise(()=>{})}},
    localStorage: {
      getItem(k){return values.get(k) ?? null;},
      setItem(k,v){if(failed.has(k)) throw Error('quota'); values.set(k,v);},
      removeItem(k){if(failed.has('remove:'+k)) throw Error('blocked'); values.delete(k);}
    },
    FileReader:class {readAsText(file){this.result=file;this.onload();}},
    M40Pdf:require('../pdf-export.js')
  };
  vm.createContext(context);
  for (const f of ['moduli.js','cvr-data.js','app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),context,{filename:f});
  context.avviso = text => {messages.push(text);return Promise.resolve(true);};
  context.conferma = () => Promise.resolve(true);context.finestra = () => Promise.resolve(true);
  return {c:context,values,failed,messages,elements};
};
module.exports.draft = () => ({uid:'draft-1',moduloId:'m40_normale',prog:7,v:{sal:'01',agn:'5',ags:'02',dest:'AdC',testo:'Prova',agt:'Rossi',adc:'Bianchi',dat:'21/10/2026',ora:'12:30'},scelta:{oa:'Si ordina'},checks:[],pv:{},libera:false,liberaTesto:''});
module.exports.record = () => ({uid:'r1',moduloId:'m40_normale',nome:'M40',versioneModello:'v1',prog:7,sal:'01',campi:{dat:'21/10/2026'},presc:[],riepilogo:'Prova',confermato:'21/10/2026',confermatoISO:'2026-10-21T10:00:00.000Z'});
