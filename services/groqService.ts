import Groq from "groq-sdk";
import { COSMOS_SYSTEM_INSTRUCTION } from "../constants";
import { searchWeb } from "./searchService";

let groq: Groq | null = null;

const getAIInstance = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key mancante. Inserisci la chiave Groq in .env come VITE_API_KEY");
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

export const initializeChat = async () => {
  groq = getAIInstance();
};

export interface ChatResponse {
  text: string;
  sources: { title: string; uri: string }[];
}

let conversationHistory: { role: "user" | "system" | "assistant", content: string }[] = [
  { role: "system", content: COSMOS_SYSTEM_INSTRUCTION }
];

export const sendMessageToCosmos = async (message: string): Promise<ChatResponse> => {
  if (!groq) {
    await initializeChat();
  }

  if (!groq) throw new Error("Impossible inizializzare Groq AI");

  // Logic to detect if we need to search the web
  // Keywords that suggest a need for real-time info
  const searchKeywords = ["news", "novità", "notizie", "cerca", "trova", "ultime", "uscita", "prezzo", "quando", "chi", "attuali"];
  const shouldSearch = searchKeywords.some(keyword => message.toLowerCase().includes(keyword));

  let finalUserMessage = message;
  let sources: { title: string; uri: string }[] = [];

  if (shouldSearch) {
    try {
      // Use the user's message as the search query
      const searchResults = await searchWeb(message);

      if (searchResults.length > 0) {
        const contextString = searchResults.map(r => `- [${r.title}](${r.link}) (${r.pubDate})`).join("\n");

        finalUserMessage = `${message}\n\n[SISTEMA: Ho trovato queste notizie RECENTI dal web per aiutarti a rispondere. Usa queste informazioni se pertinenti:]\n${contextString}`;

        // Map for the UI
        sources = searchResults.map(r => ({ title: r.title, uri: r.link }));
        console.log("Web search injected:", searchResults.length, "results");
      }
    } catch (err) {
      console.warn("Search failed efficiently, proceeding without context:", err);
    }
  }

  // Add user message to history
  conversationHistory.push({ role: "user", content: finalUserMessage });

  try {
    const completion = await groq.chat.completions.create({
      messages: conversationHistory,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "Mi dispiace, non ho ricevuto risposta.";

    // Add assistant response to history (clean, without the injected context if possible, but Groq needs history consistency so we keep it simple)
    // Actually, for history preservation, we might want to store the clean message, but for LLM context, provided message is better.
    // simpler: just push the answer.
    conversationHistory.push({ role: "assistant", content: responseText });

    return { text: responseText, sources: sources };

  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};