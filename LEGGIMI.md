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

- **Compila**: scegli il modulo. La prima volta l'app chiede da che numero partire.
- Il modulo in compilazione si **salva da solo** a ogni modifica: se l'app si chiude, alla riapertura riprendi da dove eri.
- **Genera riepilogo** → **Conferma definitivamente**: il modulo va nell'**archivio**, bloccato in sola lettura, e il progressivo di quel modulo avanza di 1.
- **Imposta N.**: cambia il progressivo di un singolo modulo (solo quando lo decidi tu).
- **Archivio**: cerca e riapri i moduli confermati; puoi scaricarli come testo o condividerli.

## 4. Copia di sicurezza (importante)

L'archivio vive nel telefono. Se cancelli i dati di Chrome, disinstalli l'app o cambi telefono, lo perdi.
Quando hai la linea: **Archivio → Esporta archivio**, e salva il file `.json` per esempio su Google Drive.
Per recuperarlo: **Archivio → Importa** e scegli il file. I moduli già presenti non vengono duplicati.
La schermata principale ti avvisa se ci sono moduli non ancora esportati.

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
