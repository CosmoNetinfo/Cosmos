# Istruzioni per "Cosmos" AI Chatbot

## Setup Iniziale
1. Assicurati di avere una chiave API di Google Gemini.
2. Crea un file chiamato `.env` nella cartella principale del progetto.
3. Inserisci la tua chiave nel file:
   ```
   VITE_API_KEY=la_tua_chiave_api_qui
   ```

## Perché Gemini? (Risposta alla tua domanda)
Hai chiesto se c'è un modello migliore da "addestrare". Per il tuo scopo (aggiornamento automatico basato sulla sitemap), **l'addestramento classico (Fine-tuning)** è in realtà sconsigliato perché:
1. **È statico:** Appena pubblichi un articolo, il modello "addestrato" ieri non lo conosce.
2. **È costoso:** Devi riaddestrare il modello costantemente.

La soluzione migliore non è l'addestramento, ma il **Grounding (Ancoraggio)**.
Il codice che ho ottimizzato usa **Gemini con Google Search Grounding**. Questo significa che l'AI non "ricorda" il tuo sito a memoria, ma **lo legge in tempo reale** tramite l'indice di Google. 
- Quando l'utente chiede "ultime news", Gemini cerca su `site:cosmonet.info`.
- Se pubblichi un articolo alle 10:00 e Google lo indicizza alle 10:05, alle 10:06 il chatbot lo sa già.

**Alternative?**
Se volessi usare **OpenAI (GPT-4)**, dovresti costruire un sistema complesso che scarica la tua sitemap ogni notte, legge tutte le pagine e le salva in un database vettoriale. Gemini ti offre questa funzione "gratis" tramite la Ricerca Google.

## Avvio
Esegui il comando:
```bash
npm run dev
```
Il sito si aprirà in locale e potrai testare le risposte.

## Come andare Online (Deployment)
Quando sarai pronto a pubblicare il sito su internet, dovrai configurare la chiave API nel pannello del tuo hosting. Ecco come fare sui provider più comuni:

### Vercel (Consigliato)
1. Vai sul tuo progetto nella dashboard di Vercel.
2. Clicca su **Settings** (in alto).
3. Nel menu laterale seleziona **Environment Variables**.
4. Aggiungi una nuova variabile:
   - **Key:** `VITE_API_KEY`
   - **Value:** `la_tua_chiave_che_inizia_con_AIza...`
5. Clicca su **Save**.
6. **Importante:** Se il sito era già online, devi fare un nuovo *Redeploy* (o fare un push su GitHub) affinché la modifica abbia effetto.

### Netlify
1. Vai su **Site configuration** > **Environment variables**.
2. Clicca su **Add a variable**.
3. Key: `VITE_API_KEY`, Value: `la_tua_chiave...`
4. Salva e fai un nuovo deploy.
