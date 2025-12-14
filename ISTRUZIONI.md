# Istruzioni per "Cosmos" AI Chatbot

## Setup Iniziale (Versione Gratutia con Groq)
Abbiamo passato il sistema a **Groq AI** per garantire un servizio gratuito e stabile.

1. Ottieni una chiave API gratuita qui: [https://console.groq.com/keys](https://console.groq.com/keys)
2. Crea (o aggiorna) il file `.env` nella cartella principale:
   ```
   VITE_API_KEY=gsk_la_tua_chiave_groq...
   ```

## Perché Groq?
Hai chiesto un'alternativa gratuita e funzionante. **Groq** offre i modelli open source più potenti (come Llama 3 di Meta) a velocità incredibili e con un piano gratuito molto generoso che non dà i problemi di quota che hai riscontrato con Google.

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
