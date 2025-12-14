# Cosmos AI - Cosmonet Assistant

> L'assistente AI ufficiale per [Cosmonet.info](https://www.cosmonet.info), potenziato da Google Gemini.

![Cosmos UI](https://via.placeholder.com/800x400?text=Cosmos+AI+Interface)

Cosmos è un agente conversazionale intelligente progettato per fornire risposte precise e aggiornate basate esclusivamente sui contenuti del blog Cosmonet.info. Utilizza la tecnologia **Google Search Grounding** per accedere alle informazioni più recenti senza bisogno di riaddestramento.

## 🚀 Caratteristiche Principali

*   **Grounding in Tempo Reale:** Risposte basate su `site:cosmonet.info` per garantire accuratezza e novità.
*   **Gemini 2.0 Flash:** Sfrutta l'ultimo modello di Google per velocità e precisione.
*   **Interfaccia Premium:** Design moderno "Glassmorphism" con animazioni e modalità scura.
*   **Zero Manutenzione:** L'AI legge automaticamente i nuovi articoli indicizzati da Google.

## 🛠️ Installazione (Locale)

1.  Clona il repository:
    ```bash
    git clone https://github.com/TUO_USERNAME/Cosmos.git
    cd Cosmos
    ```
2.  Installa le dipendenze:
    ```bash
    npm install
    ```
3.  Crea un file `.env` nella root del progetto e aggiungi la tua chiave API Google Gemini:
    ```bash
    VITE_API_KEY=la_tua_chiave_api_qui
    ```
4.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```

## 🌐 Deployment (Vercel)

Il progetto è ottimizzato per il deployment su Vercel.

1.  Importa il progetto su Vercel.
2.  Aggiungi la variabile d'ambiente `VITE_API_KEY` nelle impostazioni del progetto.
3.  Fai il Deploy!

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT.
Creazione originale per **Cosmonet.info**.
