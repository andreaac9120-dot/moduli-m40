"""Crea una copia HTML autonoma per le prove locali, con il PDF incorporato."""
import base64
import json
import re
import sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
out = Path(sys.argv[1]) if len(sys.argv) > 1 else root.parent / 'anteprima-moduli-m40-v7.html'
def script(name):
    return re.sub(r'</script', r'<\\/script', (root / name).read_text(), flags=re.I)
sample = {'moduloId':'dl_bm_bca','prog':1,'v':{'loc':'LOCALITÀ DI PROVA','trn':'12345','sal':'01','agt':'DM ROSSI','agn':'2','ags':'02','prn':'6, 8, 14'},'pv':{},'checks':[14,6,8],'scelta':{},'compilatoreAG':False,'libera':False,'liberaTesto':'','creato':'2026-10-20T00:00:00.000Z'}
pdf = base64.b64encode((root / 'assets/moduli-originali.pdf').read_bytes()).decode()
icon = base64.b64encode((root / 'icon-192.png').read_bytes()).decode()
boot = r"""(function(){try{if(!localStorage.getItem('m40.bozza')&&!localStorage.getItem('m40.anteprima.dataora.seeded')){localStorage.setItem('m40.bozza',JSON.stringify(SAMPLE));localStorage.setItem('m40.anteprima.dataora.seeded','1');}}catch(e){}var baseFetch=window.fetch;var pdf64=PDF64;window.fetch=function(input,init){var url=typeof input==='string'?input:(input&&input.url)||'';if(/(?:^|\/)assets\/moduli-originali\.pdf(?:[?#].*)?$/.test(url)){var binary=atob(pdf64),bytes=new Uint8Array(binary.length);for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return Promise.resolve(new Response(bytes,{status:200,headers:{'Content-Type':'application/pdf'}}));}return baseFetch.call(this,input,init);};})();"""
boot = boot.replace('SAMPLE',json.dumps(sample,ensure_ascii=False)).replace('PDF64',json.dumps(pdf))
html = '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#F4F6F9"><title>Anteprima Moduli M.40 · data e ora</title><link rel="icon" href="data:image/png;base64,'+icon+'"><style>'+(root/'style.css').read_text()+'</style><style>.preview-banner{background:#fff3cd;color:#533c00;text-align:center;padding:8px 12px;font:600 13px system-ui}</style></head><body><div class="preview-banner">ANTEPRIMA · data e ora correnti con frecce di regolazione · dati di prova</div><main id="app"><p style="padding:16px">Caricamento…</p></main><script>'+boot+'</script>'
for name in ['moduli.js','vendor/pdf-lib.min.js','pdf-export.js','app.js']:
    html += '<script>'+script(name)+'</script>'
html += '</body></html>'
out.write_text(html)
print(out)
