# Moduli M.40 — guida completa

**Versione documentata:** 1.17.1-stabilita · 21 ottobre 2026
**Indirizzo dell'app:** https://andreaac9120-dot.github.io/moduli-m40/

L'app aiuta a compilare, rileggere, produrre in PDF e archiviare otto moduli di prescrizione ai treni. Funziona sul telefono e, dopo il primo caricamento completo, anche senza connessione. È un supporto alla compilazione: l'operatore deve verificare il contenuto e seguire le procedure in vigore.

### Come leggere questa guida

Le sezioni **2–5** spiegano l'avvio e i campi comuni; **6–7** distinguono moduli con prescrizioni e moduli a testo libero; **8–11** descrivono conferma, archivio, backup e cestino. Le ultime sezioni riguardano aggiornamenti, problemi frequenti e struttura tecnica. Se devi iniziare subito una prova, leggi prima le sezioni **4, 5, 7, 8 e 10**.

## 1. Modelli disponibili

| Rete | Modulo | Tipo | PDF compilato | Retro consultabile |
| --- | --- | --- | --- | --- |
| RFI | M.40 D.L. (B.A.) | Prescrizioni numerate | Sì | Sì |
| RFI | M.40 D.L. (B.m./B.ca.) | Prescrizioni numerate | Sì | Sì |
| RFI | M.40 TELEC (BA) | Prescrizioni numerate | Sì | Sì |
| RFI | M.40 TELEC (Bca) | Prescrizioni numerate | Sì | Sì |
| RFI | M.40 (normale) | Testo libero | Sì | No |
| RFI | M.40 a | Testo libero | Sì | No |
| FERROVIENORD | Mod. 0229/2 | Prescrizioni numerate | Sì | Sì, guida per la notifica |
| FERROVIENORD | Mod. 0229 | Ordine o avviso a testo libero | Sì | No |

I PDF vengono costruiti a partire dalle copie dei modelli originali fornite per l'app. L'anteprima e il PDF definitivo comprendono il **fronte compilato**. Se il modello ha un retro, il pulsante **Consulta il retro** lo apre separatamente. Il retro non compare nel PDF da consegnare. Se un dato è troppo lungo per lo spazio disponibile, il PDF usa un riferimento e aggiunge un foglio di seguito con il testo completo.

## 2. Aprire e installare l'app

1. Apri l'indirizzo dell'app in Chrome sul telefono Android.
2. Attendi il caricamento con la connessione attiva, almeno la prima volta: l'app deve memorizzare anche i modelli PDF.
3. Se vuoi un'icona sul telefono, apri il menu **⋮** di Chrome e scegli **Installa app** oppure **Aggiungi a schermata Home**.

La scritta **online/offline** nella pagina iniziale indica lo stato della connessione. I file dell'app vengono conservati per l'uso offline. Se un PDF non si genera offline, riapri l'app una volta con la connessione attiva per completare il caricamento dei modelli.

## 3. Pagina iniziale

- **RFI / FERROVIENORD:** scegli la rete; appaiono solo i relativi moduli. L'app ricorda la scelta.
- **Compila:** apre un nuovo modulo. La scheda indica tipo, versione del modello e prossimo progressivo.
- **Imposta N.:** definisce il prossimo numero progressivo del singolo modello. La prima volta viene richiesto prima della compilazione.
- **Archivio:** apre i moduli già confermati e gli strumenti di ricerca, esportazione e recupero.
- **☾ Notte / ☀ Giorno:** cambia il tema; la scelta rimane memorizzata.
- **⋮ → Impostazioni:** apre il profilo personale.

Ogni modello ha un **contatore indipendente**. Per esempio, confermare un M.40 D.L. B.A. aumenta il prossimo numero di quel modello, senza cambiare i numeri degli altri.

## 4. Impostazioni personali

Nel menu **⋮ → Impostazioni** inserisci **nome**, **cognome** e **numero di matricola**, quindi premi **Salva profilo**. Servono tutti e tre per salvare il profilo.

- Nei due M.40 D.L. il cognome viene proposto nel campo **Agente ricevente**.
- Negli altri moduli RFI e nel 0229/2 FERROVIENORD, il cognome viene proposto nel campo **AdC**.
- Nei due moduli RFI a testo libero — M.40 normale e M.40 a — il PDF riporta in basso nome, cognome e matricola del profilo, quando presenti.
- Nel **0229 FERROVIENORD** il campo **Il mio cognome** viene proposto dal profilo ed è modificabile. Scegli se ricevi dal DM/DCO o se invii al DM/DCO: il cognome viene stampato nel ruolo corrispondente, senza aggiungere una firma.
- Se aggiorni il profilo, il cognome della bozza viene aggiornato se vuoto o uguale al precedente; nei moduli RFI viene aggiornata anche la firma. Un cognome già scritto manualmente e diverso dal precedente rimane nel campo.

Puoi correggere il cognome proposto nel singolo modulo. Ogni modulo confermato conserva i dati del profilo associati **al momento della compilazione**. Modificare le impostazioni in seguito non cambia i dati già archiviati.

## 5. Compilare un modulo: percorso comune

1. Scegli la rete e premi **Compila** sul modello necessario.
2. Se richiesto, inserisci il primo **numero progressivo** da usare. Inserisci il **saltuario** nel modulo: è un campo distinto dal progressivo e richiede due cifre.
3. Compila i **Dati treno** e i dati di **Trasmissione**. La data e l'ora iniziali corrispondono all'ora locale del telefono quando la bozza viene creata.
4. Per cambiare data o ora, scrivi nel campo oppure usa le piccole frecce: la data cambia di **un giorno**, l'ora di **un minuto** per tocco. Se l'ora supera la mezzanotte, anche la data cambia.
5. Compila l'ordine o il testo del dispaccio e, nei moduli numerati, seleziona le prescrizioni pertinenti.
6. Premi **Genera riepilogo**, leggi tutti i dati e scarica eventualmente l'**anteprima PDF**.
7. Dopo la verifica e la ripetizione del dispaccio, usa **Procedi alla conferma del modulo → Sì, conferma**.

La bozza viene salvata automaticamente sul telefono a ogni modifica. Puoi tornare alla pagina iniziale e riprenderla. L'app mantiene **una sola bozza alla volta**: se inizi un modello diverso, chiede se eliminare la bozza esistente. **Elimina bozza** cancella i dati non confermati senza consumare il progressivo.

Se il telefono non riesce a salvare, l'app mostra un avviso e non prosegue con la nuova bozza, il riepilogo o la conferma. Libera spazio o riattiva la memoria del browser e riprova. Una conferma interrotta durante il salvataggio del progressivo può essere ripetuta dalla stessa bozza senza duplicare il modulo archiviato.

La testata della schermata di compilazione mostra il numero del modulo, il conteggio delle prescrizioni selezionate e i dati che l'app considera mancanti. Alcuni campi contestuali, come numero treno, località o segnale, richiedono comunque una verifica manuale anche se l'app non li segnala come obbligatori.

### Numeri della trasmissione

Il numero **progressivo/saltuario del modulo** è il tuo numero da comunicare. L'altro gruppo di campi raccoglie progressivo e saltuario del **DM/DCO o dell'agente trasmittente**, secondo il modello. L'app richiede il saltuario di due cifre per entrambi i numeri. Scrivi il progressivo nel primo spazio e il saltuario nel secondo: la barra è già mostrata dall'app.

Per esempio, se il tuo numero è **7/01** e quello del DM/DCO è **5/02**, inserisci `01` come tuo saltuario, poi `5` e `02` nei due spazi del DM/DCO. Nel 0229 la scelta **Ricevo / Invio** decide quale numero viene scritto sul PDF come trasmittente e quale come ricevente.

## 6. Moduli con prescrizioni numerate

Questa modalità riguarda M.40 D.L., M.40 TELEC e FERROVIENORD 0229/2.

- Tocca la **casella** di una prescrizione per selezionarla. La riga evidenziata mostra che è attiva.
- Se scrivi in un campo vuoto della prescrizione, la casella si seleziona automaticamente.
- Compila i campi inseriti nella frase e, quando l'app presenta alternative, scegli quella corretta. Per le prescrizioni selezionate l'app richiede i campi e le scelte che ha previsto.
- **Azzera caselle** deseleziona tutte le prescrizioni dopo una conferma.
- Il numero del treno inserito nei dati iniziali compare nella frase d'ordine. I **numeri delle prescrizioni selezionate**, in ordine crescente, sono inseriti automaticamente nell'ordine e nel PDF.
- Le prescrizioni selezionate vengono barrate nel modello originale. Le righe libere presenti nel modello possono essere compilate come prescrizioni aggiuntive.

Nel **0229/2 FERROVIENORD**, la prescrizione 2 chiede di scegliere **binario** oppure **verso**: compila il campo relativo all'alternativa scelta. Per le prescrizioni 3, 4 e 18 scegli rispettivamente sinistra/destra, diretta/locale e fissa/lampeggiante; il PDF depenna la dizione non occorrente.

**Esempio di controllo prima dell'anteprima:** se selezioni le prescrizioni 10, 2 e 7, l'ordine deve riportare **2, 7, 10**. Controlla sul PDF che siano barrate soltanto le prescrizioni scelte e che gli eventuali numeri di treno, segnali e località siano negli spazi attesi. Le caselle non selezionate restano prive della barra aggiunta dall'app.

Nella sezione **Prescrizione libera** devi rispondere **Sì** oppure **No**. Se scegli Sì, scrivi il testo esatto. La prescrizione viene collocata in una riga libera del PDF; se le righe non bastano, prosegue nell'allegato.

### Colonne DM e A.G. nei M.40 D.L.

Nei soli due moduli **M.40 D.L.** il modello ha due colonne di numeri: **DM a sinistra** e **A.G. a destra**. L'app barra normalmente **solo DM**. Se il modulo è compilato da un Agente di Guardia, seleziona **Compilato da A.G.** vicino alla domanda sulla prescrizione libera: il PDF barrerà **solo A.G.**. Il riepilogo menziona la colonna A.G. quando è selezionata; la scelta ordinaria DM non occupa una voce nel riepilogo.

Il cognome personale dei due D.L. viene collocato in basso nel campo **Agente ricevente**. Nel **0229/2 FERROVIENORD** c'è una sola colonna di numeri da barrare: il flag A.G. non compare.

La conferma e il PDF della bozza richiedono i cognomi di entrambi gli agenti in tutti gli otto modelli.

### Retro del 0229/2

Il fronte del **Mod. 0229/2** contiene le prescrizioni. Il retro fornito è una **guida per la notifica**: si apre con **Consulta il retro** e resta separato dal PDF compilato.

## 7. Moduli a testo libero

Questa modalità riguarda **M.40 normale**, **M.40 a** e **FERROVIENORD 0229**.

1. Scegli **Si ordina** oppure **Si dà avviso**.
2. Scrivi il destinatario nel campo successivo e poi il **testo esatto del dispaccio**.
3. Nei moduli RFI compila i dati di trasmissione, il numero del DCO/DM e il cognome AdC.
4. Nel **0229 FERROVIENORD** inserisci il tuo progressivo/saltuario e quello del DM/DCO, come nel M.40 normale. Scegli **Ricevo dal DM/DCO** oppure **Invio al DM/DCO**: l'app mette il numero di chi invia nel campo dell'agente trasmittente e quello dell'altro nel campo del ricevente. Inserisci il cognome del DM/DCO e verifica **Il mio cognome**, proposto dal profilo. L'app aggiunge il numero del treno accanto al destinatario solo se non è già presente.

| Scelta nel 0229 | Numero dell'agente trasmittente sul PDF | Numero comunicato dal ricevente sul PDF |
| --- | --- | --- |
| Ricevo dal DM/DCO | Numero del DM/DCO | Il tuo numero |
| Invio al DM/DCO | Il tuo numero | Numero del DM/DCO |

**Esempio:** con tuo numero **7/01** e numero DM/DCO **5/02**, scegliendo **Ricevo** il modello mostra **5/02** come numero del trasmittente e **7/01** come numero del ricevente. Scegliendo **Invio**, la posizione dei due numeri si inverte. Il numero del modulo mostrato in alto resta **7/01** in entrambi i casi. Il cognome del DM/DCO è collocato nel riquadro corrispondente al suo ruolo; il tuo cognome viene riportato nel riquadro dell’altro agente.

Nel PDF la dizione non scelta viene depennata. Il testo viene collocato nel riquadro del modello. Se non entra, una parte viene riportata su una pagina aggiuntiva. **Solo nei due moduli RFI liberi** il profilo personale completo riporta automaticamente nome, cognome e matricola in basso. Nel **0229 FERROVIENORD** il numero del ricevente deriva dai due numeri già inseriti e dalla direzione scelta; la firma non viene inserita automaticamente. I moduli 0229 archiviati con versioni precedenti conservano la disposizione dei dati usata quando furono confermati.

## 8. Riepilogo, anteprima e conferma

**Genera riepilogo** apre una lettura divisa in sezioni: identificazione, trasmissione, ordine o dispaccio, prescrizioni e controllo finale. I valori inseriti sono evidenziati in grassetto. Puoi usare **Testo più grande**, oppure **Lettura guidata** per vedere una sezione alla volta con **Precedente** e **Successivo**. **Torna ai dati** riporta alla compilazione.

Se mancano dati che l'app controlla, il riepilogo segnala cosa completare e non consente la conferma. Se modifichi un dato dopo aver generato il riepilogo, devi **generarlo di nuovo** prima di confermare: in questo modo rileggi i valori aggiornati.

**Scarica anteprima del modulo PDF** crea un file con `_BOZZA` nel nome. È disponibile dopo un riepilogo completo e non conferma il modulo. **Consulta il retro** è accanto all'anteprima dove il modello lo prevede. La conferma è separata, richiede un'ulteriore scelta e salva il modulo nell'archivio con stato **collazionato/confermato**. Da quel momento il modulo è in sola lettura e il prossimo progressivo di quel modello aumenta di uno.

La conferma nell'app registra il modulo e blocca la modifica dei dati salvati. **Non trasmette il dispaccio a nessuno e non verifica da sola che il destinatario abbia ripetuto il testo**: questa verifica resta a carico di chi usa il modulo. Prima della conferma controlla nell'anteprima almeno numero e saltuario, data e ora, destinatario, testo o prescrizioni, colonna DM/A.G. quando presente e posizione dei dati nel PDF.

## 9. Archivio e moduli confermati

Da **Apri archivio** puoi cercare per **N° treno**, per **data del modulo o della conferma**, oppure per parole contenute nel riepilogo. Il filtro **Mostra** distingue moduli esportati e non esportati.

Aprendo un modulo confermato trovi il riepilogo testuale e queste operazioni:

- **Scarica modulo PDF compilato:** crea il PDF del fronte dal modello originale.
- **Consulta il retro:** apre separatamente il retro, se presente.
- **Scarica come testo:** salva il riepilogo `.txt`.
- **Condividi PDF / Drive:** apre la condivisione del telefono per inviare il PDF a Drive o a un'altra app compatibile. Se il telefono non può condividere file direttamente, l'app scarica il PDF e puoi condividerlo dalla cartella Download.
- **Elimina questo modulo:** lo sposta nel cestino dopo conferma.

Il modulo archiviato conserva dati, prescrizioni selezionate, scelta DM/A.G., versione del modello, data di conferma e profilo usato. Il PDF viene **rigenerato quando lo richiedi** usando il modello PDF presente nella versione corrente dell'app; conserva i dati salvati, ma non è una copia binaria del PDF scaricato in passato. Per conservare esattamente un PDF già prodotto, salvalo separatamente.

## 10. Copia di sicurezza e recupero

I moduli e i progressivi sono memorizzati nel **browser del telefono**, associati all'indirizzo dell'app. GitHub ospita il programma e i modelli vuoti, non i moduli compilati. Aggiornare i file del repository mantenendo lo stesso indirizzo non azzera di per sé archivio e progressivi. Cancellare i dati del browser, usare un altro browser o cambiare telefono può invece rendere indisponibili i dati locali.

### Esporta archivio

In **Archivio → Esporta archivio**, l'app scarica un file `.json` contenente i **moduli confermati** e i **prossimi progressivi**. Verifica che il file sia comparso nella cartella Download e conservalo in un posto affidabile. L'app contrassegna i moduli presenti nel file come esportati.

La scritta **esportato** significa che l'app ha avviato la creazione o condivisione di una copia. Prima di affidarti al backup, controlla personalmente che il file sia davvero in Download o in Drive e, se possibile, aprilo con **Consulta file esportato** per verificare che l'elenco dei moduli sia presente. Per un cambio di telefono conserva la copia fuori dal dispositivo che stai per sostituire.

### Salva su Drive

In **Archivio → Salva su Drive**, l'app apre la condivisione del telefono. Scegli Drive e la cartella, quindi verifica che il file sia presente. Il nome termina in `.txt` per consentire la condivisione da Chrome, ma il contenuto è lo stesso JSON dell'esportazione. Se il telefono non offre la condivisione dei file, usa **Esporta archivio** e carica manualmente il `.json` su Drive.

### Importa

In **Archivio → Importa**, scegli un archivio `.json` o `.txt` creato dall'app. I moduli già presenti, riconosciuti dal loro identificatore, non vengono duplicati. Se il file contiene moduli eliminati in passato, l'app chiede se reimportarli. I progressivi importati vengono portati al valore più alto tra telefono e file: l'importazione non li riporta indietro.

Il file esportato **non contiene la bozza attiva, il profilo personale, il tema, la rete selezionata o il cestino**. Dopo un ripristino su un altro telefono, reimposta nome, cognome e matricola da **Impostazioni**.

### Consulta file esportato

**Archivio → Consulta file esportato** permette di aprire un backup e cercare al suo interno per treno, data o testo. Questa funzione è **in sola lettura**: non importa moduli e non modifica archivio, cestino o progressivi. Puoi aprire il riepilogo di un elemento del file e generare il PDF con i modelli disponibili nell'app corrente.

## 11. Eliminazione e cestino

I moduli confermati possono essere eliminati singolarmente dalla loro scheda. Nell'elenco, il pulsante **✕** compare accanto ai moduli non ancora esportati. Puoi anche usare **Seleziona → Elimina selezionati**, **Elimina tutti i non esportati** o **Svuota archivio**. Per svuotare l'archivio l'app richiede di scrivere `ELIMINA`.

Un modulo eliminato va nel **Cestino**, dove può essere ripristinato per **30 giorni**. Da lì puoi eliminarlo definitivamente, singolarmente o svuotando il cestino. La scadenza dei 30 giorni viene applicata quando apri archivio o cestino. Eliminare o ripristinare un modulo **non diminuisce i progressivi**. Un modulo eliminato definitivamente può ancora essere presente in un backup precedente: durante l'importazione l'app chiede se reimportarlo.

## 12. Aggiornamenti e uso offline

Quando una nuova versione dell'app è disponibile, può apparire l'avviso **Nuova versione disponibile → Aggiorna**. Toccalo per ricaricare. Se continui a vedere una versione precedente, chiudi e riapri l'app con la connessione attiva. La versione in uso appare in fondo alla pagina iniziale. I dati locali rimangono legati allo stesso browser e allo stesso indirizzo del sito.

L'app usa un **service worker** per tenere una copia dei file necessari, compresi i due PDF sorgente. Funziona offline dopo che l'installazione della cache è riuscita. L'archivio locale è separato da questa cache. I PDF sono generati sul telefono: il modulo compilato non viene inviato al repository.

## 13. Problemi frequenti

| Situazione | Cosa controllare |
| --- | --- |
| Il PDF non viene creato | Apri l'app una volta online; verifica che il modello PDF sia stato caricato. Riprova dopo aver completato i dati segnalati. |
| Vedo la versione precedente | Ricarica l'app online o usa **Aggiorna** nell'avviso di aggiornamento. |
| Un campo del PDF è troppo corto | Controlla l'eventuale riferimento `[A1]` e la pagina **SEGUITO**, dove compare il dato completo. |
| L'anteprima non compare | Genera il riepilogo e completa i dati obbligatori indicati. |
| Il numero progressivo non è quello voluto | Dalla pagina iniziale usa **Imposta N.** sul modello interessato, dopo aver verificato la sequenza dei moduli già confermati. |
| Non trovo i moduli dopo un cambio di telefono o browser | Importa il file di backup dall'Archivio e reimposta il profilo personale. |
| Drive non appare nel menu di condivisione | Esporta l'archivio o scarica il PDF, poi carica il file dalla cartella Download. |

## 14. Struttura tecnica per manutenzione

L'app è una pagina web statica senza server applicativo. `index.html` carica gli script; `moduli.js` descrive gli otto modelli, i campi e le prescrizioni; `app.js` gestisce schermate, bozza, riepilogo e archivio; `pdf-export.js` colloca i dati nelle coordinate dei modelli originali mediante `vendor/pdf-lib.min.js`; `style.css` definisce l'interfaccia. I sorgenti dei modelli sono `assets/moduli-originali.pdf` per RFI e `assets/moduli-ferrovienord.pdf` per FERROVIENORD. `sw.js` gestisce la copia offline e il caricamento degli aggiornamenti; `manifest.webmanifest` e le icone permettono l'installazione.

La versione del modello e quella dell'app sono salvate nei singoli record. Le informazioni operative sono conservate nel `localStorage` del browser; il backup dell'archivio è un file JSON con `contatori` e `archivio`. Per aggiornare i modelli PDF, occorre ricontrollare le coordinate in `pdf-export.js` e aumentare la versione della cache in `sw.js`.



## 15. Stabilità e recupero — versione 1.17.1

- Usa una sola scheda/finestra dell’app alla volta. Una seconda apertura mostra un avviso e non può modificare i dati; chiudi la prima e premi **Riprova**. Occorre un browser aggiornato con Web Locks su HTTPS (anche dopo il caricamento offline). Al primo passaggio da una versione precedente, chiudi tutte le vecchie schede e riapri l’app.
- La conferma richiede una data reale nel formato `gg/mm/aaaa`, un’ora `hh:mm` tra 00:00 e 23:59 e progressivi interi positivi. I caratteri non rappresentabili nei PDF attuali sono segnalati prima della conferma: il testo non viene sostituito automaticamente.
- È bloccata una seconda conferma dello stesso modello, progressivo e data, anche se il primo modulo è nel cestino. La verifica considera i dati presenti sul dispositivo; l’eliminazione definitiva rimuove anche tale riferimento. La modifica manuale di un contatore richiede comunque la verifica della sequenza da parte dell’operatore.
- Il prossimo numero è salvato prima del record. Se la memoria si esaurisce tra le due operazioni, la bozza rimane e può essere riconfermata con il suo numero. Se la bozza viene invece eliminata, può restare un numero saltato: non è un modulo confermato. Una conferma già presente non viene riscritta da un tentativo successivo.
- **Esportato** si applica soltanto ai record e ai contenuti effettivamente presenti nella copia avviata. I moduli aggiunti durante una condivisione restano non esportati. Le vecchie copie riconosciute soltanto tramite la data globale possono apparire nuovamente non esportate: esegui un nuovo backup. Il download o caricamento su Drive va sempre verificato personalmente.
- Importazione e consultazione controllano struttura, versione, tipi dei campi e identificatori. Un file non valido viene rifiutato senza importazione parziale. Due record con lo stesso identificatore ma contenuti diversi richiedono verifica manuale; non vengono sovrascritti. I vecchi dati confermati non vengono automaticamente corretti o riscritti per adeguarli alle nuove regole di compilazione.

### Verifiche tecniche

Con Node.js e Python con PyMuPDF installati, eseguire `python scripts/test.py`. Il comando comprende test logici, guasti simulati dello storage, validazione backup, blocco tra sessioni, caratteri PDF e controlli delle coordinate dei modelli.

Il salvataggio resta basato su localStorage: questa release riduce i rischi senza introdurre una migrazione a IndexedDB. Il ciclo completo di installazione/aggiornamento PWA, la condivisione Drive e il comportamento su smartphone reale richiedono ancora un collaudo dedicato. La protezione tra schede vale per le sessioni di questa versione; le vecchie schede vanno chiuse durante l’aggiornamento.
