import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env manually since we are running this with node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiKey = process.env.VITE_API_KEY;

if (!apiKey) {
    console.error("❌ VITE_API_KEY non trovata nel file .env");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

import util from 'util';

async function listModels() {
    console.log("🔍 Cerco modelli disponibili...");
    try {
        const response = await ai.models.list();
        const str = JSON.stringify(response);
        // Regex looking for "name": "models/gemini-..."
        const regex = /"name":"models\/(gemini-[^"]+)"/g;
        let match;
        const found = new Set();

        while ((match = regex.exec(str)) !== null) {
            found.add(match[1]);
        }

        if (found.size > 0) {
            console.log("✅ Modelli Trovati (Regex):");
            found.forEach(name => console.log(`- ${name}`));
        } else {
            console.log("⚠️ Nessun modello trovato con regex.");
        }

    } catch (err) {
        console.error("Errore:", err.message);
    }
}

listModels();
