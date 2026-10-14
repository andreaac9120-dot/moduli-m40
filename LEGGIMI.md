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
- **Compila**: scegli il modulo. La prima volta l'app chiede da che numero partire.
- Il modulo è diviso in sezioni (Dati treno, Trasmissione, Ordine, Prescrizioni, Prescrizione libera, Riepilogo). In alto vedi sempre quante prescrizioni hai selezionato e quanti dati mancano.
- Le prescrizioni selezionate diventano **gialle**. Se scrivi in un campo di una prescrizione, la casella si spunta da sola.
- Dove il modello dice di depennare una dizione (**binario di sinistra / destra**, **itinerario di arrivo / partenza**, **s.b. / d.b.**) tocchi l'opzione giusta: nel riepilogo resta solo quella. Se la prescrizione è selezionata e manca la scelta, il modulo non si può confermare.
- Il modulo in compilazione si **salva da solo** a ogni modifica: se l'app si chiude, alla riapertura riprendi da dove eri.
- **Genera riepilogo** → **Conferma definitivamente**: il modulo va nell'**archivio**, bloccato in sola lettura, e il progressivo di quel modulo avanza di 1.
- **Imposta N.**: cambia il progressivo di un singolo modulo (solo quando lo decidi tu).
- **Archivio**: cerca e riapri i moduli confermati; puoi scaricarli come testo o condividerli.
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

**Moduli con prescrizioni numerate da barrare** (M.40 D.L., M.40 TELEC, 0229/2): sono sempre trasmessi dal DCO/DM all'AdC.

**Moduli a testo libero** (M.40 normale, M.40 a, 0229): il dispaccio può andare in entrambe le direzioni, dal DCO/DM all'AdC o dall'AdC al DCO/DM. Scegli «Si ordina» o «Si dà avviso», scrivi il destinatario e il testo. Ci sono i campi progressivo/saltuario (tuo e del DCO/DM), ora, cognome DCO/DM e cognome AdC. Il cognome AdC viene ricordato e proposto automaticamente nei moduli successivi.

## 4. Copia di sicurezza (importante)

L'archivio vive nel telefono. Se cancelli i dati di Chrome, disinstalli l'app o cambi telefono, lo perdi.

- **Salva su Drive** (Archivio): si apre il menu di condivisione di Android → scegli **Drive** → scegli la cartella (es. «Moduli M.40») → **Salva**. Il file è `.txt` (Chrome non condivide i `.json`) ma il contenuto è lo stesso. Senza linea l'app Drive lo carica appena torna la connessione.
- **Esporta archivio**: salva il file `.json` nella cartella Download del telefono.
- Per recuperarlo: **Archivio → Importa** e scegli il file (`.json` o `.txt`). I moduli già presenti non vengono duplicati.
- Dalla scheda di un modulo, **Salva su Drive** salva solo quel modulo come testo.

La schermata principale ti avvisa se ci sono moduli non ancora salvati.

## 5. Aggiornare l'app (nuovi moduli o prescrizioni cambiate)

1. I file aggiornati te li prepara Claude, partendo dal nuovo modello ufficiale.
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
