const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
global.PDFLib = require('../vendor/pdf-lib.min.js');
const pdf = require('../pdf-export.js');
(async () => {
  const bytes = fs.readFileSync(path.join(__dirname, '../assets/moduli-originali.pdf'));
  const r = {moduloId:'m40_normale', prog:1, sal:'01', campi:{testo:'Città più vicina — “è”\nSeconda riga'}, scelta:{}};
  assert.ok((await pdf.build(r, bytes)).length > 10000);
  for (const text of ['Velocità ≤ 30 km/h','Łódź','😀']) {
    await assert.rejects(pdf.build({...r,campi:{testo:text}},bytes), /Caratteri non supportati dal PDF/);
  }
  console.log('PDF: supported accents/punctuation render, unsupported characters produce actionable errors');
})().catch(e => {console.error(e);process.exitCode = 1;});
