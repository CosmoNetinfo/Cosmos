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

async function listModels() {
    console.log("🔍 Cerco modelli disponibili...");
    try {
        const response = await ai.models.list();
        if (response) {
            // The response is usually a list or has a models property.
            // The logs showed a huge JSON. Let's try to interpret common structures.
            // Based on SDK: check if it is iterable or has .models
            let models = [];
            if (Array.isArray(response)) models = response;
            else if (response.models) models = response.models;

            console.log("\n✅ Modelli disponibili:");
            // Simply log the IDs/names if found, otherwise keys
            models.forEach(m => {
                console.log(`- ${m.name} (DisplayName: ${m.displayName})`);
            });

            // Fallback dump if empty but response exists
            if (models.length === 0) {
                console.log("Struttura risposta inattesa. Prime key:", Object.keys(response));
                // Try to find anything looking like a model name in the FULL output
                const text = JSON.stringify(response);
                const matches = text.match(/models\/[\w-.]+/g);
                if (matches) {
                    console.log("Forse questi:", [...new Set(matches)]);
                }
            }
        }
    } catch (err) {
        console.error("Errore:", err.message);
    }
}

listModels();
