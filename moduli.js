/*
  SCHEDE DEI MODULI
  -----------------
  Per aggiornare un modulo: cambiare il suo testo qui sotto e aumentare "versione".
  Per aggiungere un modulo: copiare una scheda, darle un "id" nuovo e compilarla.
  I moduli già confermati nell'archivio NON cambiano: conservano il testo
  e la versione che avevano al momento della conferma.

  Campi della scheda:
    rete      infrastruttura (RFI, FERROVIENORD…): raggruppa i moduli nella schermata iniziale
    id        identificativo unico (mai cambiarlo dopo l'uso: ci sono legati progressivo e archivio)
    nome      nome mostrato
    versione  versione del modello (da aggiornare a ogni modifica dei testi)
    campi     campi di testata: {id, label, span (1 o 2), ph (suggerimento)}
              tipo "ps" = progressivo/saltuario del modulo; tipo "ag" = N° DM/DCO progressivo/saltuario
    tipo      "libero" = modulo a testo libero (Si ordina / Si dà avviso + testo), senza caselle
    destLabel nei moduli liberi: parola prima del destinatario ("a" / "al")
    ordine    frase d'ordine; {trn} = treno, {sig} {loc} = campi da compilare, {prn} = prescrizioni n° automatico
    presc     prescrizioni: {g: gruppo (facoltativo), n: numero, t: testo con {} per i campi}
              {n, libera:true, numerata:true/false} = riga libera
              scelta/segnaposto = opzione a scelta da indicare (es. s.b./d.b.)
              sost:true = la scelta prende il posto del segnaposto nel testo (es. binario di sinistra / destra)
*/
var MODULI = [
{
  id: "dl_ba",
  rete: "RFI",
  nome: "Mod. M.40 D.L. (B.A.)",
  versione: "v2 · 20/10/2026",
  campi: [
    {id: "loc", label: "Località di servizio", span: 2},
    {id: "trn", label: "Treno N°"},
    {id: "dat", label: "Data", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario"},
    {id: "ora", label: "Ora trasmissione", ph: "hh:mm"},
    {id: "agt", label: "Ag. trasmittente (profilo e cognome)", span: 2},
    {tipo: "ag", label: "N° agente trasmittente DM/DCO (progressivo / saltuario comunicato dal regolatore)"}
  ],
  ordine: "Si ordina all'AdC del treno N° {trn} di rispettare le sottoindicate prescrizioni n° {prn} la cui casella è barrata (o da barrare in caso di trasmissione) e di ritenere nulle le rimanenti prescrizioni.",
  presc: [
    {g: "ITINERARIO", n: 1, t: "Partite da {} con segnale {} (2) disposto a via impedita.(*)"},
    {n: 2, t: "Superate il segnale di {} (3) di {} disposto a via impedita. (*)"},
    {n: 3, t: "Marcia a vista non superando la velocità di 30 km/h sull'itinerario di arrivo/partenza (4) interessato. (5)", scelta: ["arrivo", "partenza"], segnaposto: "arrivo/partenza", sost: true},
    {n: 4, t: "Viaggiate da {} a {} sul binario di sinistra/destra.(4)", scelta: ["sinistra", "destra"], segnaposto: "sinistra/destra", sost: true},
    {n: 5, t: "Siete autorizzati a superare il segnale imperativo di blocco in uscita dalla stazione di {} {} disposto a via impedita. (*)"},
    {g: "DISTANZIAMENTO", n: 6, t: "Esiste via libera di blocco elettrico."},
    {n: 7, t: "Esiste via libera telefonica di {} (dispaccio N° {} / {})."},
    {n: 8, t: "Non esiste via libera. Procedete con marcia a vista non superando la velocità di 30 km/h salvo ricezione codice in linea fino al segnale di blocco N° {} / di protezione della stazione di {} (4) rispettando le relative indicazioni. [s.b. / d.b.: indicare]", scelta: ["s.b.", "d.b."], segnaposto: "[s.b. / d.b.: indicare]"},
    {n: 9, t: "Blocco elettrico non funziona da {} a {} Su tale tratta escludete la funzione di ripetizione dei segnali in macchina."},
    {n: 10, t: "Da {} a {} non tenete conto dei segnali di blocco intermedi permissivi comunque disposti, salvo quanto eventualmente notificato dalle prescrizioni 11 e 12."},
    {n: 11, t: "Marcia a vista in corrispondenza dei P.L. protetti dai segnali di blocco intermedi permissivi N° {} superati a via impedita o spenti."},
    {n: 12, t: "Osservate le cautele di cui all'art. 48/5 R.S. superando i segnali di blocco intermedi permissivi a via impedita con l'indicazione di \"P\" lampeggiante."},
    {n: 13, t: "Osservate le cautele di cui all'art. 48/7 R.S. superando i segnali di protezione e/o partenza di {} {} a via impedita con lettera luminosa \"P\" accesa a luce fissa o lampeggiante (*)."},
    {n: 14, t: "Attenetevi alle altre prescrizioni del Mod. M40 D.L. (B.A.) in vostro possesso."},
    {g: "BINARIO ILLEGALE", n: 15, t: "Per interruzione binario {} (pari o dispari) viaggiate da {} a {} sul binario illegale."},
    {n: 16, t: "Marcia a vista non superando la velocità di 30 Km/h in arrivo e fermata a {}"},
    {n: 17, t: "Fermate in precedenza del primo deviatoio di {}"},
    {n: 18, t: "Esponete in testa al treno segnale rosso a destra o fanale destro a luce rossa."},
    {g: "VARIE", n: 19, t: "Marcia a vista in corrispondenza del (dei) P.L. km {}"},
    {n: 20, t: "Escludete SCMT/SSC da {} a {}"},
    {n: 21, t: "Non superate velocità di {} Km/h da {} a {} per sistema di controllo velocità di rallentamento non attivo."},
    {n: 22, libera: true, numerata: true},
    {n: 23, libera: true, numerata: false},
    {n: 24, libera: true, numerata: false}
  ]
},
{
  id: "dl_bm_bca",
  rete: "RFI",
  nome: "Mod. M.40 D.L. (B.m./B.ca.)",
  versione: "v2 · 20/10/2026",
  campi: [
    {id: "loc", label: "Località di servizio", span: 2},
    {id: "trn", label: "Treno N°"},
    {id: "dat", label: "Data", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario (se trasmesso)"},
    {id: "ora", label: "Ora trasmissione (se trasmesso)", ph: "hh:mm"},
    {id: "agt", label: "Ag. trasmittente (profilo e cognome)", span: 2},
    {tipo: "ag", label: "N° agente trasmittente DM/DCO (progressivo / saltuario comunicato dal regolatore)"}
  ],
  ordine: "Si ordina all'AdC del treno N° {trn} di rispettare le sottoindicate prescrizioni n° {prn} la cui casella è barrata (o da barrare in caso di trasmissione) e di ritenere nulle le rimanenti prescrizioni.",
  presc: [
    {g: "ITINERARIO", n: 1, t: "Partite da {} con segnale {} (2) disposto a via impedita.(*)"},
    {n: 2, t: "Superate il segnale di {} (3) di {} disposto a via impedita. (*)"},
    {n: 3, t: "Marcia a vista non superando la velocità di 30 km/h sull'itinerario di arrivo/partenza (4) interessato. (5)", scelta: ["arrivo", "partenza"], segnaposto: "arrivo/partenza", sost: true},
    {n: 4, t: "Viaggiate da {} a {} sul binario di sinistra/destra.(4)", scelta: ["sinistra", "destra"], segnaposto: "sinistra/destra", sost: true},
    {n: 5, t: "Siete autorizzati a superare il segnale imperativo di blocco in uscita dalla stazione di {} {} disposto a via impedita. (*)"},
    {g: "DISTANZIAMENTO", n: 6, t: "Esiste via libera di blocco elettrico."},
    {n: 7, t: "Esiste via libera telefonica di {} (dispaccio N° {} / {})."},
    {n: 8, t: "Esiste via libera come da Mod. M.40 D.L. (B.m./B.ca.) in vostro possesso."},
    {n: 9, t: "Blocco elettrico non funziona da {} a {} Su tale tratta rispettate ugualmente tutti i segnali."},
    {n: 10, t: "Siete autorizzati a riprendere la corsa dai segnali di PBI N° {} disposti a via impedita e con lettera “A” spenta. (*)"},
    {g: "BINARIO ILLEGALE", n: 11, t: "Per interruzione binario {} (pari o dispari) viaggiate da {} a {} sul binario illegale."},
    {n: 12, t: "Marcia a vista non superando la velocità di 30 Km/h in arrivo e fermata a {}"},
    {n: 13, t: "Fermate in precedenza del primo deviatoio di {}"},
    {n: 14, t: "Esponete in testa al treno segnale rosso a destra o fanale destro a luce rossa."},
    {g: "VARIE", n: 15, t: "Marcia a vista in corrispondenza del (dei) P.L. km {}"},
    {n: 16, libera: true, numerata: true},
    {n: 17, libera: true, numerata: false},
    {n: 18, libera: true, numerata: false},
    {n: 19, libera: true, numerata: false},
    {n: 20, libera: true, numerata: false}
  ]
},
{
  id: "telec_ba",
  rete: "RFI",
  nome: "Mod. M.40 TELEC (BA)",
  versione: "v1 · 10/10/2026",
  campi: [
    {id: "trn", label: "Treno N°"},
    {id: "dat", label: "Data", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario"},
    {id: "ora", label: "Ora trasmissione", ph: "hh:mm"},
    {id: "agt", label: "Ag. trasmittente (profilo e cognome)", span: 2},
    {tipo: "ag", label: "N° del DCO/DPC/DM (progressivo / saltuario comunicato dal regolatore)"}
  ],
  ordine: "Si ordina all'Agente di condotta del treno N° {trn} fermo al segnale {sig} (2) di {loc} di rispettare le sottoindicate prescrizioni n° {prn} la cui casella è da barrare e di ritenere nulle le rimanenti prescrizioni.",
  presc: [
    {n: 1, t: "Dovete istradarvi sul binario n° {} / verso {} (successiva LdS o segnale) (1)."},
    {n: 2, t: "Dovete istradarvi sul binario di sinistra / destra (1).", scelta: ["sinistra", "destra"], segnaposto: "sinistra / destra", sost: true},
    {n: 3, t: "Dovete percorrere linea {}"},
    {n: 4, t: "Superate il segnale {} disposto a via impedita (*)."},
    {n: 5, t: "Marcia a vista non superando la velocità di 30 km/h sull'itinerario interessato (3)."},
    {n: 6, t: "Avanzate in manovra sull'itinerario interessato (3), fermando oltre ciascun picchetto speciale senza impegnare i deviatoi e superate gli scambi a valle di ogni picchetto solo dopo averne accertato l'integrità e la regolare disposizione secondo quanto previsto dall'All.1bis, IPCL-IF/RFI. Accertate anche l'integrità e la regolare disposizione dei deviatoi non centralizzati esistenti sull'itinerario."},
    {n: 7, t: "Esiste via libera di blocco elettrico."},
    {n: 8, t: "Blocco elettrico non funziona da {} a {} Tratta libera da treni. Su tale tratta escludete la funzione di Ripetizione dei Segnali in macchina."},
    {n: 9, t: "Da {} a {} non tenete conto dei segnali di blocco intermedi permissivi comunque disposti, salvo quanto eventualmente notificato dalle prescrizioni 11 e 12."},
    {n: 10, t: "Non esiste via libera. Procedete con marcia a vista non superando la velocità di 30 km/h, salvo ricezione codice in linea, fino al segnale di blocco n° {} / di protezione di {} (1) rispettando le relative indicazioni."},
    {n: 11, t: "Marcia a vista in corrispondenza dei PL protetti dai segnali di blocco intermedi permissivi superati a via impedita o spenti."},
    {n: 12, t: "Osservate le cautele di cui all'art. 48/5 R.S. superando i segnali di blocco intermedi permissivi a via impedita con l'indicazione di \"P\" lampeggiante."},
    {n: 13, t: "Osservate le cautele di cui all'art. 48/7 R.S. superando i segnali di protezione e/o partenza di {} {} a via impedita con lettera luminosa \"P\" accesa a luce fissa o lampeggiante (*)."},
    {n: 14, t: "Proseguite dal segnale di PBA n° {} disposto a via impedita con lettera \"P\" spenta da considerare accesa a luce lampeggiante (*)."},
    {n: 15, t: "Marcia a vista in corrispondenza del/dei (1) PL km {}"},
    {n: 16, t: "Escludete SCMT/SSC da {} a {}"},
    {n: 17, t: "Non superate velocità di {} km/h da {} a {} per sistema di controllo velocità di rallentamento non attivo."},
    {n: 18, libera: true, numerata: false},
    {n: 19, libera: true, numerata: false},
    {n: 20, libera: true, numerata: false},
    {n: 21, libera: true, numerata: false},
    {n: 22, libera: true, numerata: false}
  ]
},
{
  id: "telec_bca",
  rete: "RFI",
  nome: "Mod. M.40 TELEC (Bca)",
  versione: "v1 · 10/10/2026",
  campi: [
    {id: "trn", label: "Treno N°"},
    {id: "dat", label: "Data", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario"},
    {id: "ora", label: "Ora trasmissione", ph: "hh:mm"},
    {id: "agt", label: "Ag. trasmittente (profilo e cognome)", span: 2},
    {tipo: "ag", label: "N° del DCO/DPC/DM (progressivo / saltuario comunicato dal regolatore)"}
  ],
  ordine: "Si ordina all'Agente di condotta del treno N° {trn} fermo al segnale {sig} (2) di {loc} di rispettare le sottoindicate prescrizioni n° {prn} la cui casella è da barrare e di ritenere nulle le rimanenti prescrizioni.",
  presc: [
    {n: 1, t: "Dovete istradarvi sul binario n° {} / verso {} (successiva LdS o segnale) (1)."},
    {n: 2, t: "Dovete istradarvi sul binario di sinistra / destra (1).", scelta: ["sinistra", "destra"], segnaposto: "sinistra / destra", sost: true},
    {n: 3, t: "Dovete percorrere linea {}"},
    {n: 4, t: "Superate il segnale {} disposto a via impedita (*)."},
    {n: 5, t: "Marcia a vista non superando la velocità di 30 km/h sull'itinerario interessato (3)."},
    {n: 6, t: "Avanzate in manovra sull'itinerario interessato (3), fermando oltre ciascun picchetto speciale senza impegnare i deviatoi e superate gli scambi a valle di ogni picchetto solo dopo averne accertato l'integrità e la regolare disposizione secondo quanto previsto dall'All. 1bis, IPCL-IF/RFI. Accertate anche l'integrità e la regolare disposizione dei deviatoi non centralizzati esistenti sull'itinerario."},
    {n: 7, t: "Esiste via libera di blocco elettrico."},
    {n: 8, t: "Blocco elettrico non funziona da {} a {} Su tale tratta che è libera da treni rispettate ugualmente tutti i segnali"},
    {n: 9, t: "Siete autorizzati a riprendere la corsa dai segnali di blocco dei posti N° {} disposti a via impedita con lettera “A” spenta. (*)"},
    {n: 10, t: "Partite da PBI n° {} disposto a via impedita (*). Tratto da {} a {} libero da treni / Tratto da {} a {} libero da treni come da M. 40 TELEC in vostro possesso (1)."},
    {n: 11, t: "Marcia a vista in corrispondenza del/dei (1) PL km {}"},
    {n: 12, libera: true, numerata: false},
    {n: 13, libera: true, numerata: false},
    {n: 14, libera: true, numerata: false},
    {n: 15, libera: true, numerata: false},
    {n: 16, libera: true, numerata: false},
    {n: 17, libera: true, numerata: false},
    {n: 18, libera: true, numerata: false},
    {n: 19, libera: true, numerata: false}
  ]
},
{
  id: "fn_0229_2",
  rete: "FERROVIENORD",
  nome: "Mod. 0229/2 FERROVIENORD",
  versione: "v2 · 20/10/2026",
  campi: [
    {id: "trn", label: "Treno N°"},
    {id: "dat", label: "Data", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario (da trasmettere all'agente trasmittente)"},
    {id: "ora", label: "Ora di trasmissione (1)", ph: "hh:mm"},
    {id: "agt", label: "Ag. trasmittente (profilo e cognome)", span: 2},
    {tipo: "ag", label: "N° del DCO / DPC / DM (progressivo / saltuario comunicato dal regolatore)"}
  ],
  ordine: "Si ordina all'agente di condotta del treno {trn} fermo al segnale {sig} (3) di {loc} di rispettare le sotto indicate prescrizioni n° {prn} la cui casella è da barrare (o barrata in caso di consegna diretta) e di ritenere nulle le rimanenti prescrizioni.",
  presc: [
    {g: "ITINERARIO", n: 1, t: "Superate il segnale {} disposto a via impedita (*)."},
    {n: 2, t: "Dovete istradarvi sul binario n° {} / verso {} (successivo posto o segnale) (2).", scelta: ["binario", "verso"], segnaposto: "(2)"},
    {n: 3, t: "Dovete istradarvi sul binario di sinistra / destra (2).", scelta: ["sinistra", "destra"], segnaposto: "sinistra / destra", sost: true},
    {n: 4, t: "Dovete percorrere la linea diretta / locale (2).", scelta: ["diretta", "locale"], segnaposto: "diretta / locale", sost: true},
    {n: 5, t: "Marcia a vista non superando la velocità di 30 km/h sull'itinerario interessato."},
    {n: 6, t: "Avanzate in manovra sull'itinerario interessato, fermando oltre ciascun picchetto speciale senza impegnare i deviatoi e superate gli stessi a valle di ogni picchetto solo dopo averne accertato l'integrità e la regolare disposizione secondo quanto previsto dall'articolo 6. comma 4. delle DET. Accertate anche l'integrità e la regolare disposizione dei deviatoi non centralizzati esistenti sull'itinerario."},
    {g: "DISTANZIAMENTO", n: 7, t: "Esiste via libera di blocco elettrico."},
    {n: 8, t: "Blocco elettrico automatico non funziona da {} a {} Su tale tratta, che è libera da treni, escludete la funzione di ripetizione dei segnali in macchina."},
    {n: 9, t: "Blocco elettrico conta assi non funziona da {} a {} Su tale tratta, che è libera da treni, rispettate ugualmente tutti i segnali."},
    {n: 10, t: "Da {} a {} non tenete conto dei segnali di blocco intermedi permissivi comunque disposti, salvo quanto eventualmente notificato dalle prescrizioni n° 11 e n° 12."},
    {n: 11, t: "Marcia a vista specifica in corrispondenza dei PL protetti dai segnali di blocco intermedi permissivi superati a via impedita o spenti."},
    {n: 12, t: "Osservate le cautele di cui all'articolo 35.2.3. del RS superando i segnali di blocco intermedi permissivi disposti a via impedita con lettera «P» accesa a luce lampeggiante."},
    {n: 13, t: "Osservate le cautele di cui all'articolo 35.3.2. del RS superando i segnali di protezione e/o di partenza di {} disposti a via impedita con lettera «P» accesa a luce fissa o lampeggiante (*)."},
    {n: 14, t: "Non esiste via libera. Procedete con marcia a vista non superando la velocità di 30 km/h, salvo ricezione codice in linea, fino al successivo segnale di 1ª categoria rispettando le relative indicazioni."},
    {g: "VARIE", n: 15, t: "Marcia a vista specifica in corrispondenza PL progressiva km {}"},
    {n: 16, t: "Proseguite la corsa dal segnale di PBA n° {} (4) con le modalità previste dall'articolo 35.2.2. del RS."},
    {n: 17, t: "Proseguite la corsa dal segnale di PBA n° {} (4) con le modalità previste dagli articoli 35.2.2. e 35.2.3. del RS."},
    {n: 18, t: "Proseguite dal segnale di PBA n° {} (4) disposto a via impedita con lettera «P» spenta da considerare accesa a luce fissa / lampeggiante (2) (*).", scelta: ["fissa", "lampeggiante"], segnaposto: "fissa / lampeggiante", sost: true},
    {n: 19, libera: true, numerata: false},
    {n: 20, libera: true, numerata: false},
    {n: 21, libera: true, numerata: false},
    {n: 22, libera: true, numerata: false}
  ],
  note: "(*) Consultare il Fascicolo linee per eventuale esistenza di avviso accoppiato al segnale da superare a via impedita. (1) Da compilare quando il modulo viene trasmesso. (2) Depennare la dizione non occorrente. (3) Indicare la funzione del segnale (con la dizione \"di protezione\", \"di protezione esterno\", \"di protezione interno n° …\", \"di protezione interno\", \"di partenza\", \"di partenza interno n° …\", \"di partenza interno\", \"di partenza esterno\", \"ripetitore di partenza\", \"di PBA n° …\" o \"n° …\"). (4) Indicare il numero identificativo del segnale."
},
{
  id: "m40_normale",
  rete: "RFI",
  tipo: "libero",
  nome: "Mod. M.40 (normale)",
  versione: "v1 · 11/10/2026",
  campi: [
    {id: "sta", label: "Stazione (timbro)"},
    {id: "dat", label: "Data (il … 20…)", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario (mio)"},
    {id: "ora", label: "Ora", ph: "hh:mm"},
    {id: "agt", label: "Cognome DCO / DM", span: 2},
    {tipo: "ag", label: "N° DCO / DM (progressivo / saltuario)"},
    {id: "adc", label: "Cognome AdC", span: 2}
  ],
  destLabel: "al"
},
{
  id: "m40a",
  rete: "RFI",
  tipo: "libero",
  nome: "Mod. M.40 a",
  versione: "v1 · 11/10/2026",
  campi: [
    {id: "trn", label: "Treno"},
    {id: "dat", label: "Data (del … /20…)", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario (mio)"},
    {id: "ora", label: "Ora", ph: "hh:mm"},
    {id: "agt", label: "Cognome DCO / DM", span: 2},
    {tipo: "ag", label: "N° DCO / DM (progressivo / saltuario)"},
    {id: "adc", label: "Cognome AdC", span: 2}
  ],
  destLabel: "a",
  note: "(*) Cancellare le parole che non servono, secondo che trattasi di ordini o di avvisi. (**) Profilo di chi riceve la prescrizione aggiungendo, quando è il caso, il numero del treno. Firma: il capotreno o il macchinista."
},
{
  id: "fn_0229",
  rete: "FERROVIENORD",
  tipo: "libero",
  nome: "Modulo 0229 FERROVIENORD",
  versione: "v3 · 20/10/2026",
  campi: [
    {id: "sta", label: "Località di servizio"},
    {id: "trn", label: "Treno"},
    {id: "dat", label: "Data (del … /20…)", ph: "gg/mm/aaaa"},
    {tipo: "ps", label: "Progressivo / saltuario (mio)"},
    {id: "ora", label: "Ora", ph: "hh:mm"},
    {id: "agt", label: "Agente trasmittente (profilo e cognome)", span: 2},
    {tipo: "ag", label: "N° agente trasmittente (progressivo / saltuario)"},
    {id: "ord", label: "Agente che dà l'ordine o l'avviso (profilo e firma)", span: 2},
    {id: "adc", label: "Agente ricevente (profilo e cognome / firma)", span: 2},
    {id: "ricevProg", label: "N° comunicato dal ricevente: progressivo"},
    {id: "ricevSal", label: "N° comunicato dal ricevente: saltuario"}
  ],
  destLabel: "a",
  note: "Nel 0229 i ruoli possono cambiare: compila a mano solo i riquadri degli agenti pertinenti. Il profilo personale non firma automaticamente questo modulo. Il numero comunicato dal ricevente va inserito solo quando è noto."
}
];
