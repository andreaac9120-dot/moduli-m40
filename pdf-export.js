/* Coordinate dei modelli Captrain: x, linea di scrittura dall'alto, larghezza.
   I dati vengono scritti negli spazi originali. Le righe prestampate restano intatte. */
(function (root) {
  'use strict';
  var MODELLI = {
    m40_normale: {pages:[0],kind:'libero'}, m40a: {pages:[1],kind:'libero'},
    dl_ba: {pages:[2,3],firstFree:22,left:25,right:452,textX:52,textW:391,
      centers:[142,160,179,196,214,241,254,277,302,322,341,360,379,397,418,437,455,472,495,508,522,547,562,577],
      rows:[[133,150],[151,170],[171,187],[188,203],[204,223],[230,245],[246,260],[263,290],[292,312],[314,332],[334,348],[351,369],[371,387],[389,403],[410,429],[431,446],[449,464],[466,478],[484,499],[501,515],[517,536],[539,551],[554,567],[569,579]],
      slots:{1:[[89,141,86],[228,141,101]],2:[[146,159,143],[314,159,120]],4:[[100,195,99],[220,195,104]],5:[[350,214,85],[53,222,178]],7:[[154,253,138],[344,253,22],[375,253,22]],8:[[205,281,29],[352,281,72]],9:[[168,301,105],[284,301,104]],10:[[65,320,78],[156,320,70]],11:[[381,340,54]],13:[[380,377,55],[53,385,109]],15:[[138,417,60],[302,417,134],[61,425,136]],16:[[309,436,126]],17:[[214,454,222]],19:[[228,494,208]],20:[[146,507,82],[243,507,96]],21:[[145,521,24],[204,521,89],[305,521,78]]},
      choices:{3:{arrivo:[287,307,177],partenza:[310,340,177]},4:{sinistra:[375,401,194],destra:[404,426,194]},8:{'s.b.':[24,38,263],'d.b.':[24,38,289]}},
      header:{loc:[81,85,146],dat:[351,77,131],agent:[345,85,29,382,35],ora:[401,93,74],trn:[174,101,150],prn:[25,110,263],number:[442,58,39],agt:[146,619,98],adc:[259,619,100],receiver:[30,636,68,111,66]}},
    dl_bm_bca: {pages:[4,5],firstFree:16,left:60,right:375,textX:79,textW:285,
      centers:[137,151,166,181,196,216,230,243,258,274,294,311,326,340,357,370,382,394,407,419],
      rows:[[131,144],[145,160],[161,174],[175,186],[187,203],[210,223],[224,237],[238,249],[250,266],[268,280],[286,302],[304,318],[320,333],[334,345],[350,363],[364,376],[378,388],[390,400],[402,412],[414,424]],
      slots:{1:[[106,137,67],[208,137,77]],2:[[139,150,116],[271,150,91]],4:[[113,180,81],[204,180,77]],5:[[299,195,63],[80,202,133]],7:[[157,230,99],[293,230,17],[316,230,17]],9:[[165,257,93],[267,257,94]],10:[[231,273,55]],11:[[142,293,44],[261,293,101],[85,300,102]],12:[[269,310,91]],13:[[202,326,161]],15:[[208,357,152]]},
      choices:{3:{arrivo:[254,268,165],partenza:[270,292,165]},4:{sinistra:[320,340,179],destra:[342,355,179]}},
      header:{loc:[103,90,106],dat:[300,83,97],agent:[300,90,16,322,26],ora:[339,97,57],trn:[169,103,108],prn:[59,110,195],number:[379,62,36],agt:[152,450,76],adc:[239,450,65],receiver:[76,466,39,125,44]}},
    telec_ba: {pages:[6,7],firstFree:18,left:31,textX:50,textW:380,
      centers:[151,166,181,194,209,223,261,275,294,316,345,364,383,404,421,437,452,472,486,500,514,529],
      rows:[[146,159],[160,173],[175,187],[189,201],[203,216],[217,253],[255,268],[270,286],[288,307],[309,333],[335,354],[356,374],[376,396],[398,415],[417,430],[432,444],[446,461],[464,477],[478,491],[492,505],[506,519],[520,533]],
      slots:{1:[[157,154,17],[201,154,123]],3:[[131,182,299]],4:[[116,196,221]],8:[[160,276,125],[294,276,135]],9:[[61,295,98],[171,295,96]],10:[[176,324,25],[264,324,116]],13:[[384,384,44],[50,393,105]],14:[[161,402,49]],15:[[226,422,204]],16:[[139,437,94],[242,437,100]],17:[[130,451,31],[189,451,101],[299,451,83]]},
      choices:{2:{sinistra:[156,181,166],destra:[188,210,166]}},
      header:{dat:[288,92,142],agent:[282,102,34,323,27],ora:[344,112,86],trn:[173,123,45],sig:[278,123,142],loc:[39,132,92],prn:[284,132,147],number:[400,71,40],agt:[148,575,80],adc:[349,575,113],receiver:[282,589,15,303,14]}},
    telec_bca: {pages:[8,9],firstFree:12,left:37,textX:55,textW:381,
      centers:[179,194,208,223,238,252,291,307,326,345,368,382,397,412,427,443,458,473,488],
      rows:[[172,185],[187,200],[202,215],[217,230],[232,244],[246,283],[285,298],[300,318],[320,337],[338,357],[359,374],[376,389],[391,404],[406,419],[421,434],[436,449],[451,464],[466,479],[481,494]],
      slots:{1:[[164,180,15],[207,180,123]],3:[[137,209,299]],4:[[121,224,220]],8:[[165,305,121],[297,305,138]],9:[[310,325,75]],10:[[115,344,32],[277,344,68],[353,344,62],[123,354,43],[176,354,45]],11:[[233,367,203]]},
      choices:{2:{sinistra:[162,187,193],destra:[193,215,193]}},
      header:{dat:[294,118,142],agent:[287,128,35,328,28],ora:[349,138,87],trn:[179,148,45],sig:[284,148,140],loc:[44,158,91],prn:[288,158,148],number:[407,97,38],agt:[151,538,78],adc:[352,538,113],receiver:[288,553,15,310,13]}}
  };
  function clean(value) {
    return String(value == null ? '' : value).replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"')
      .replace(/[\u2013\u2014]/g,'-').replace(/\u2026/g,'...').replace(/\u00a0/g,' ').replace(/[\t\r]/g,' ');
  }
  function wrap(value,font,size,width) {
    var lines=[];
    clean(value).split('\n').forEach(function(paragraph){
      var line='';
      paragraph.trim().split(/\s+/).forEach(function(word){
        if(!word)return;
        if(line && font.widthOfTextAtSize(line+' '+word,size)>width){lines.push(line);line='';}
        while(font.widthOfTextAtSize(word,size)>width){
          var cut=1;while(cut<word.length && font.widthOfTextAtSize(word.slice(0,cut+1),size)<=width)cut++;
          lines.push(word.slice(0,cut));word=word.slice(cut);
        }
        line+=(line?' ':'')+word;
      });
      lines.push(line);
    });
    return lines;
  }
  async function build(r,originalBytes) {
    var cfg=MODELLI[r.moduloId];if(!cfg)throw new Error('Il modello PDF originale non è disponibile per questo modulo.');
    var lib=root.PDFLib,src=await lib.PDFDocument.load(originalBytes),out=await lib.PDFDocument.create();
    var pages=await out.copyPages(src,[cfg.pages[0]]);pages.forEach(function(p){out.addPage(p);});
    var page=pages[0],font=await out.embedFont(lib.StandardFonts.Helvetica),bold=await out.embedFont(lib.StandardFonts.HelveticaBold);
    var ink=lib.rgb(0.04,0.16,0.31),white=lib.rgb(1,1,1),overflow=[],v=r.campi||{};
    function text(s,x,baseline,size,face,target){
      target=target||page;target.drawText(clean(s),{x:x,y:target.getHeight()-baseline,size:size,font:face||bold,color:ink});
    }
    function erase(x,top,w,h){page.drawRectangle({x:x,y:page.getHeight()-top-h,width:w,height:h,color:white});}
    function line(x1,x2,y){page.drawLine({start:{x:x1,y:page.getHeight()-y},end:{x:x2,y:page.getHeight()-y},thickness:0.9,color:ink});}
    function add(label,value){var tag='A'+(overflow.length+1);overflow.push({tag:tag,label:label,value:clean(value)});return '['+tag+']';}
    function put(value,box,label,size){
      var s=clean(value).replace(/\s+/g,' ').trim();if(!s)return;
      var x=box[0],baseline=box[1]-1,w=box[2],max=size||7.5,sz=max;
      while(sz>=6 && bold.widthOfTextAtSize(s,sz)>w-2)sz-=0.25;
      if(sz<6){s=add(label||'Dato',value);sz=6.5;}
      // Le righe della scansione sono molto ravvicinate: nessuna copertura bianca
      // nei campi, per non cancellare lettere della riga prestampata precedente.
      text(s,x+1,baseline,sz);
    }
    function block(value,x,top,w,h,label,size){
      var sz=size||8,lines;
      while(sz>=6){lines=wrap(value,font,sz,w-3);if(lines.length*sz*1.22<=h-2)break;sz-=0.25;}
      erase(x,top,w,h);
      if(sz<6){text('Vedi seguito '+add(label,value),x+1,top+h/2+2,6.5);return;}
      var first=top+(h-lines.length*sz*1.22)/2+sz;
      lines.forEach(function(s,i){text(s,x+1,first+i*sz*1.22,sz,font);});
    }
    function check(n){
      var y=cfg.centers[n-1];if(!y)return;
      var x=cfg.right!=null&&r.compilatoreAG===true?cfg.right:cfg.left;
      page.drawLine({start:{x:x-1,y:page.getHeight()-y-4},end:{x:x+11,y:page.getHeight()-y+5},thickness:1.2,color:ink});
    }
    function dates(id){
      var match=clean(v.dat).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
      if(id==='m40_normale'){
        if(match){put(match[1]+'/'+match[2],[371,99,44],'Data',7.5);put(match[3].slice(-2),[431,99,13],'Anno',7.5);}
        else put(v.dat,[371,99,73],'Data',7.5);
      }else{
        if(match){put(match[1]+'/'+match[2],[380,90,42],'Data',8);put(match[3].slice(-2),[444,90,23],'Anno',8);}
        else put(v.dat,[380,90,87],'Data',8);
      }
    }
    if(cfg.kind==='libero'){
      var normal=r.moduloId==='m40_normale',oa=r.scelta&&r.scelta.oa||(/SI D[AÀ] AVVISO/i.test(r.riepilogo||'')?'Si dà avviso':'Si ordina');
      // Copertura dei numeri già impressi sulle scansioni, entro il solo riquadro numerico.
      if(normal){erase(382,58,63,16);put(r.prog+'/'+(r.sal||v.sal||''),[383,71,60],'Progressivo / saltuario',10);put(v.sta,[276,99,79],'Stazione',8);}
      else{erase(374,45,61,18);put(r.prog+'/'+(r.sal||v.sal||''),[375,61,59],'Progressivo / saltuario',10);put(v.trn,[269,90,83],'Treno',9);}
      dates(r.moduloId);
      if(normal){if(oa==='Si ordina')line(55,101,121);else line(61,95,113);put(v.dest,[120,118,322],'Destinatario',9);}
      else{if(oa==='Si ordina')line(78,157,108);else line(13,73,108);put(v.dest,[175,110,292],'Destinatario',9);}
      var baselines=normal?[145,158.5,172,185.5,199,212.5,226,239.5,253]:[127.5,145.5,163.5,181,199,217,235,252.5];
      var x=normal?51:15,w=normal?391:452,size=9.2,lines=wrap(v.testo||'',bold,size,w-3);
      if(lines.length>baselines.length){
        var remaining=lines.splice(baselines.length-1);
        lines.push('Segue nel foglio allegato '+add('Testo del dispaccio - continuazione',remaining.join('\n')));
      }
      lines.forEach(function(s,i){put(s,[x,baselines[i],w],'Testo del dispaccio',size);});
      var footer='Ora: '+clean(v.ora)+'  |  DCO/DM: '+clean(v.agt)+'  N. '+clean(v.agn)+'/'+clean(v.ags)+'  |  AdC: '+clean(v.adc);
      block(footer,normal?50:15,normal?263:321,normal?393:452,normal?12:14,'Dati di trasmissione',6.7);
      var signer=r.firmatario||{},signature=[signer.nome,signer.cognome].filter(Boolean).join(' ');
      if(signature&&signer.matricola)signature+=' · Matr. '+signer.matricola;
      if(signature){
        if(normal){erase(50,277,393,16);put(signature,[51,288,390],'Firma AdC e matricola',7.5);}
        else {erase(289,291,178,13);put(signature,[290,301,174],'Firma AdC e matricola',7);}
      }
      if(r.libera) add('Prescrizione libera',r.libera);
    } else {
      var h=cfg.header;
      Object.keys(h).forEach(function(key){
        if(key==='agent'||key==='receiver'){
          var pos=h[key],first=key==='agent'?v.agn:r.prog,last=key==='agent'?v.ags:(r.sal||v.sal||'');
          put(first,pos,key==='agent'?'Progressivo trasmittente':'Progressivo ricevente',6.75);
          put(last,[pos[3],pos[1],pos[4]],key==='agent'?'Saltuario trasmittente':'Saltuario ricevente',6.75);return;
        }
        var value=key==='number'||key==='receiver'?r.prog+'/'+(r.sal||v.sal||''):
          key==='agent'?clean(v.agn)+'/'+clean(v.ags):key==='prn'?((r.presc||[]).length?(r.presc||[]).filter(function(p){return p.numerata;}).map(function(p){return +p.n;}).sort(function(a,b){return a-b;}).join(', '):(v.prn||'')):v[key];
        if(key==='number'&&r.moduloId==='dl_bm_bca')erase(379,54,32,11);
        put(value,h[key],{agent:'Numero agente trasmittente',receiver:'Progressivo / saltuario ricevente',agt:'Agente trasmittente',prn:'Prescrizioni selezionate'}[key]||key,key==='number'?9:7.5);
      });
      (r.presc||[]).forEach(function(p){
        var box=cfg.rows[p.n-1];if(!box){add('Prescrizione '+p.n,p.testo);return;}check(p.n);
        var slots=cfg.slots[p.n]||[],hasRaw=r.pv&&slots.every(function(_,i){return r.pv[p.n+'_'+i]!=null;});
        if(p.n>=cfg.firstFree){block(p.testo,cfg.textX,box[0],cfg.textW,box[1]-box[0],'Riga libera '+p.n,8);return;}
        if(hasRaw){
          slots.forEach(function(pos,i){put(r.pv[p.n+'_'+i],pos,'Prescrizione '+p.n+' - campo '+(i+1),r.moduloId==='dl_bm_bca'?6.75:7.5);});
          var choices=cfg.choices[p.n],choice=r.scelta&&r.scelta[p.n];
          if(choices&&choice&&choices[choice])Object.keys(choices).forEach(function(value){if(value!==choice){var c=choices[value];line(c[0],c[1],c[2]);}});
          else if(choices){block(p.testo,cfg.textX,box[0],cfg.textW,box[1]-box[0],'Prescrizione '+p.n,7.5);}
        }else{
          // Archivio precedente: conserva la frase salvata senza ricostruire i dati mancanti.
          block(p.testo,cfg.textX,box[0],cfg.textW,box[1]-box[0],'Prescrizione '+p.n,7.5);
        }
      });
      if(r.libera){
        var used=(r.presc||[]).map(function(p){return p.n;}),n=cfg.firstFree;
        while(n<=cfg.rows.length&&used.indexOf(n)>=0)n++;
        if(n<=cfg.rows.length){var box=cfg.rows[n-1];check(n);block(r.libera,cfg.textX,box[0],cfg.textW,box[1]-box[0],'Prescrizione libera',8);}
        else add('Prescrizione libera',r.libera);
      }
    }
    if(overflow.length){
      text('Segue allegato: riferimenti A1'+(overflow.length>1?' - A'+overflow.length:''),20,page.getHeight()-3,6,font);
      var extra,y;
      function next(){extra=out.addPage([595,842]);text('SEGUITO - '+(r.nome||r.moduloId),40,35,11,bold,extra);text('Modulo N. '+r.prog+'/'+r.sal,40,51,10,font,extra);y=78;}
      next();overflow.forEach(function(item){
        var lines=wrap('['+item.tag+'] '+item.label+'\n'+item.value,font,10,515);
        lines.forEach(function(s){if(y>790)next();text(s,40,y,10,font,extra);y+=14;});y+=14;
      });
    }
    out.setTitle((r.nome||'Modulo M.40')+' N. '+r.prog+'/'+r.sal);out.setCreator('Moduli M.40');return out.save();
  }
  async function buildBack(id,originalBytes){
    var cfg=MODELLI[id];if(!cfg||cfg.pages.length<2)throw new Error('Questo modello non ha un retro da consultare.');
    var src=await root.PDFLib.PDFDocument.load(originalBytes),out=await root.PDFLib.PDFDocument.create();
    var pages=await out.copyPages(src,cfg.pages.slice(1));pages.forEach(function(p){out.addPage(p);});
    return out.save();
  }
  var api={build:build,buildBack:buildBack,supports:function(id){return !!MODELLI[id];},hasBack:function(id){return !!(MODELLI[id]&&MODELLI[id].pages.length>1);},hasGuardColumn:function(id){return !!(MODELLI[id]&&MODELLI[id].right!=null);}};root.M40Pdf=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
