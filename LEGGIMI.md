# App Moduli M.40 — guida

App per compilare i moduli M.40 (D.L. B.A., D.L. B.m./B.ca., TELEC BA, TELEC Bca) anche **senza internet**, con archivio dei moduli confermati e un progressivo separato per ogni modulo.

**I dati restano solo sul telefono.** Su GitHub c'è solo il programma, nessun modulo compilato.
È un supporto personale e non sostituisce le procedure né le registrazioni ufficiali.

## 1. Pubblicare l'app (una sola volta)

1. Accedi a **github.com** con il tuo account.
2. In alto a destra tocca **+** → **New repository**.
   - Repository name: `moduli-m40`
   - Visibilità: **Public** (con l'account gratuito GitHub Pages funziona solo con repository pubblici; dentro c'è solo il codice dell'app, non i tuoi moduli).
   - Spunta **Add a README file** → **Create repository**.
3. Estrai lo zip sul telefono (app File → tieni premuto lo zip → Estrai).
4. Nel repository tocca **Add file** → **Upload files**, seleziona **tutti i file** estratti (non la cartella) e tocca **Commit changes**.
5. Vai in **Settings** → **Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main**, cartella **/ (root)** → **Save**.
6. Dopo 1–2 minuti l'app è online su: `https://TUO-NOME-UTENTE.github.io/moduli-m40/`

## 2. Installare l'app sul telefono Android

1. Apri l'indirizzo con **Chrome**, con la linea attiva.
2. Menu **⋮** → **Installa app** (oppure **Aggiungi a schermata Home**).
3. Apri l'app una volta dall'icona con la linea attiva: da quel momento funziona anche **offline**.

## 3. Uso

- **RFI / FERROVIENORD**: in alto nella schermata principale scegli la rete; vedi solo i suoi moduli. L'app ricorda l'ultima scelta.
- **☾ Notte / ☀ Giorno**: cambia il tema (chiaro ad alto contrasto di giorno, scuro di notte). La scelta resta memorizzata.
- **⋮ → Impostazioni**: salva nome, cognome e matricola. Nei nuovi moduli D.L. il cognome viene proposto come Agente ricevente; negli altri moduli come AdC. Nel 0229 FERROVIENORD viene proposto nel campo modificabile **Il mio cognome** e stampato come trasmittente o ricevente secondo la direzione scelta. Nei moduli liberi RFI il PDF riporta nome, cognome e matricola in basso. Nel 0229 FERROVIENORD scegli chi trasmette; il profilo non firma automaticamente. Ogni modulo confermato conserva i dati personali usati al momento della compilazione.
- **Compila**: scegli il modulo. La prima volta l'app chiede da che numero partire.
- Quando inizi un nuovo modulo, data e ora sono compilate con i valori locali correnti. Le frecce accanto alla data cambiano un giorno per tocco; quelle accanto all'ora cambiano un minuto per tocco, aggiornando anche la data quando si supera la mezzanotte. Puoi sempre scrivere i valori direttamente.
- Il modulo è diviso in sezioni (Dati treno, Trasmissione, Ordine, Prescrizioni, Prescrizione libera, Riepilogo). In alto vedi sempre quante prescrizioni hai selezionato e quanti dati mancano.
- Le prescrizioni selezionate diventano **gialle**. Se scrivi in un campo di una prescrizione, la casella si spunta da sola.
- Il numero del treno e l'elenco crescente dei numeri delle prescrizioni selezionate vengono inseriti automaticamente nelle rispettive righe prestampate dei moduli numerati, compreso il 0229/2 FERROVIENORD. L'elenco viene aggiornato anche nel riepilogo.
- Nei due moduli **M.40 D.L.**, il cognome del profilo viene inserito nel campo **Agente ricevente** in basso. Le prescrizioni selezionate vengono barrate nel PDF solo nella colonna **DM a sinistra**. Se il modulo è compilato da un Agente di Guardia, attiva **Compilato da A.G.** accanto alla domanda sulla prescrizione libera: verrà barrata solo la colonna **A.G. a destra**. La scelta appare nel riepilogo e resta salvata nel modulo.
- Dove il modello dice di depennare una dizione (**binario di sinistra / destra**, **itinerario di arrivo / partenza**, **s.b. / d.b.**) tocchi l'opzione giusta: nel riepilogo resta solo quella. Se la prescrizione è selezionata e manca la scelta, il modulo non si può confermare.
- Il modulo in compilazione si **salva da solo** a ogni modifica: se l'app si chiude, alla riapertura riprendi da dove eri.
- **Genera riepilogo** → **Conferma definitivamente**: il modulo va nell'**archivio**, bloccato in sola lettura, e il progressivo di quel modulo avanza di 1.
- Il riepilogo è suddiviso in identificazione, trasmissione, ordine e singole prescrizioni. I dati inseriti sono evidenziati. **Lettura guidata** mostra una sezione alla volta con **Precedente / Successivo**; **Testo più grande** aumenta la dimensione delle frasi. **Torna ai dati** riporta alla compilazione.
- Se modifichi un dato dopo la generazione, il riepilogo viene nascosto e va rigenerato prima della conferma, così leggi sempre i valori aggiornati.
- La colonna DM a sinistra è la scelta normale e non occupa una voce nel riepilogo finale. Solo se selezioni il flag A.G. il riepilogo indica la colonna destra.
- Dopo aver completato i dati puoi scaricare un'**anteprima PDF** del modulo originale compilato. Dalla scheda del modulo confermato puoi scaricare o condividere il PDF, anche con Drive. La copia PDF usa i modelli originali forniti e contiene solo il fronte del modello scelto; se un testo non entra nello spazio stampato, viene aggiunta una pagina di seguito con il testo integrale.
- Nei moduli con retro, il PDF compilato contiene solo il fronte. **Consulta il retro**, accanto al pulsante dell'anteprima e nella scheda del modulo confermato, apre il retro originale separatamente.
- Nei nuovi moduli i valori delle prescrizioni sono conservati separatamente e inseriti negli spazi prestampati. Per i moduli salvati con le versioni precedenti, che conservano solo la frase completa, il PDF riporta la frase salvata nella relativa riga. I dati troppo lunghi per uno spazio sono richiamati con un riferimento al seguito, senza tagliarli.
- I PDF sono disponibili per tutti gli otto modelli: sei RFI e due FERROVIENORD. Il retro guida del 0229/2 si consulta separatamente.
- **Imposta N.**: cambia il progressivo di un singolo modulo (solo quando lo decidi tu).
- **Archivio**: cerca e riapri i moduli confermati; puoi scaricarli come testo o come PDF compilato.
  - Ricerca per **N° treno**, per **data** (del modulo o della conferma) e nel testo; filtro esportati / non esportati.
  - **✕** accanto ai moduli non ancora esportati: li elimina (con conferma).
  - **Elimina tutti i non esportati**, in fondo alla lista.
  - **Seleziona** → spunta i moduli → **Elimina selezionati**; **Elimina questo modulo** dalla scheda del modulo.
  - **Svuota archivio**: per confermare va scritto `ELIMINA`.
  - **Cestino**: i moduli eliminati restano 30 giorni, poi spariscono. Da lì puoi ripristinarli o eliminarli definitivamente.
  - Eliminare un modulo **non cambia i progressivi**.
  - Importando un file che contiene moduli che avevi eliminato, l'app li elenca e ti chiede se **reimportarli** (Sì / No). Se rispondi Sì tornano nell'archivio e spariscono dal cestino.
  - **Consulta file esportato**: apri un file `.json` esportato e cerchi per N° treno, data o testo, anche moduli non più presenti sul telefono. È in **sola lettura**: non importa nulla e non tocca archivio, cestino o progressivi.

### Moduli disponibili

- **RFI**: M.40 D.L. (B.A.), M.40 D.L. (B.m./B.ca.), M.40 TELEC (BA), M.40 TELEC (Bca), M.40 (normale), M.40 a
- **FERROVIENORD**: Mod. 0229/2 (prescrizioni con caselle), Modulo 0229 (testo libero)

Ogni modulo ha il **suo progressivo**, indipendente dagli altri.

**Moduli con prescrizioni numerate da barrare** (M.40 D.L., M.40 TELEC, 0229/2): nei due M.40 D.L. puoi indicare con il flag se la compilazione è effettuata dal DM oppure dall'A.G.; il PDF barra la rispettiva colonna.

**Moduli a testo libero** (M.40 normale, M.40 a, 0229): il dispaccio può andare in entrambe le direzioni. Scegli «Si ordina» o «Si dà avviso», scrivi il destinatario e il testo. Nei due M.40 RFI il cognome AdC viene ricordato e proposto automaticamente. Nel 0229 FERROVIENORD verifica i cognomi dei due agenti e inserisci il tuo progressivo/saltuario e quello del DM/DCO, poi scegli se ricevi o invii: il PDF colloca i due numeri nei campi corretti senza chiedere un terzo numero.

## 4. Copia di sicurezza (importante)

L'archivio vive nel telefono. Se cancelli i dati di Chrome, disinstalli l'app o cambi telefono, lo perdi.

- **Salva su Drive** (Archivio): si apre il menu di condivisione di Android → scegli **Drive** → scegli la cartella (es. «Moduli M.40») → **Salva**. Il file è `.txt` (Chrome non condivide i `.json`) ma il contenuto è lo stesso. Senza linea l'app Drive lo carica appena torna la connessione.
- **Esporta archivio**: salva il file `.json` nella cartella Download del telefono.
- Per recuperarlo: **Archivio → Importa** e scegli il file (`.json` o `.txt`). I moduli già presenti non vengono duplicati.
- Dalla scheda di ciascun modulo, **Condividi PDF / Drive** condivide il modulo compilato.

La schermata principale ti avvisa se ci sono moduli non ancora salvati.

## 5. Aggiornare l'app (nuovi moduli o prescrizioni cambiate)

1. Prepara i file aggiornati partendo dal nuovo modello ufficiale.
2. Nel repository: **Add file** → **Upload files**, carica i file nuovi (sostituiscono i vecchi) → **Commit changes**.
3. Alla prima apertura con la linea l'app scarica la nuova versione e mostra **«Nuova versione disponibile → Aggiorna»**.

Archivio e progressivi **non vengono toccati** dagli aggiornamenti. I moduli già confermati conservano il testo e la versione del modello che avevano al momento della conferma.

## File

| File | Contenuto |
|---|---|
| `moduli.js` | schede dei moduli: campi, prescrizioni, versione del modello (**si modifica qui**) |
| `app.js` | funzionamento dell'app |
| `index.html`, `style.css` | pagina e aspetto |
| `sw.js` | funzionamento offline (a ogni aggiornamento si aumenta `VERSIONE`) |
| `manifest.webmanifest`, `icon*` | installazione e icona |

## Procedure CVR (prima implementazione)

La scheda **CVR** nella pagina iniziale apre un catalogo di 24 procedure in 7 gruppi, ricavato dal manuale *Manuale Moduli CVR Captrain 2026* fornito per questo progetto. Si può cercare per codice, gruppo o situazione. Una scheda mostra il riferimento all'Allegato 3 IPCL, le condizioni riassunte dal manuale, il comportamento dell'AdC e le attenzioni. Inserendo sede e cognome del RdC, numero e data del treno, punto di fermata e gli eventuali dati variabili si ottiene un testo di preparazione con i segnaposto ancora visibili finché i campi sono vuoti.

La sezione non registra audio, non trasmette CVR, non certifica il funzionamento dell'SCR e non produce un'autorizzazione o un inteso. I dati immessi nelle schede CVR restano nella sessione aperta e non entrano nell'archivio dei moduli. Per l'impiego valgono l'IPCL e le disposizioni vigenti: una procedura per scambio, ripetizione completa da parte del ricevente, esclusione per treni ETCS e uso delle forme tradizionali quando l'SCR è guasto. Il manuale allegato segnala una discordanza tra revisione indicata in copertina e cronologia modifiche alla data 15/10/2026: verificare la versione normativa prima di usare le schede in esercizio.



## Aggiornamento 1.17.1 — stabilità

Chiudi le vecchie schede dopo l’aggiornamento: l’app consente una sola sessione alla volta per proteggere i salvataggi. Ora controlla date, orari, progressivi e caratteri non supportati nei PDF prima della conferma; verifica anche la struttura dei backup e marca come esportati soltanto i moduli presenti nella copia. In caso di errore di salvataggio conserva la bozza e riprova. Dettagli e limiti nella sezione 15 di [DOCUMENTAZIONE.md](DOCUMENTAZIONE.md).
