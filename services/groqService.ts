import Groq from "groq-sdk";
import { COSMOS_SYSTEM_INSTRUCTION } from "../constants";

let groq: Groq | null = null;

const getAIInstance = () => {
  const apiKey = import.meta.env.VITE_API_KEY; // We will reuse the same env var name for simplicity or instruct user to change value
  if (!apiKey) {
    throw new Error("API Key mancante. Inserisci la chiave Groq in .env come VITE_API_KEY");
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true }); // Client-side usage requires this flag
};

export const initializeChat = async () => {
  groq = getAIInstance();
  // Groq doesn't need explicit session init like Gemini, it's stateless request-based mostly, 
  // but we can prepare the instance.
};

export interface ChatResponse {
  text: string;
  sources: { title: string; uri: string }[];
}

// Simple history management for the session
let conversationHistory: { role: "user" | "system" | "assistant", content: string }[] = [
  { role: "system", content: COSMOS_SYSTEM_INSTRUCTION }
];

import { fetchLatestArticles, Article } from './sitemapService';

export const sendMessageToCosmos = async (message: string): Promise<ChatResponse> => {
  if (!groq) {
    await initializeChat();
  }

  if (!groq) throw new Error("Impossible inizializzare Groq AI");

  // Dynamic Context Injection: Fetch latest articles if not done yet
  let latestArticlesContext = "";
  if (conversationHistory.length === 1) { // Only do this at the start of conversation
    const articles = await fetchLatestArticles();
    if (articles.length > 0) {
      const list = articles.map(a => `- [${a.title}](${a.link}) (Aggiornato: ${a.pubDate})`).join("\n");
      latestArticlesContext = `\n\nAGGIORNAMENTO SITEMAP (ULITME NOVITÀ DAL SITO):\nEcco gli articoli più recenti trovati ORA sul sito. Usali per rispondere a domande su "novità" o "ultimi articoli":\n${list}\n`;

      // Inject into system prompt (update the first message)
      conversationHistory[0].content += latestArticlesContext;
      console.log("Sitemap injected into context!", list);
    }
  }

  // Add user message to history
  conversationHistory.push({ role: "user", content: message });

  try {
    const completion = await groq.chat.completions.create({
      messages: conversationHistory,
      model: "llama-3.3-70b-versatile", // Very powerful, fast, and free tier friendly
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "Mi dispiace, non ho ricevuto risposta.";

    // Add assistant response to history
    conversationHistory.push({ role: "assistant", content: responseText });

    // Groq doesn't have native grounding like Gemini, so sources are empty.
    // The system prompt handles the "check website" advice.
    return { text: responseText, sources: [] };

  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};