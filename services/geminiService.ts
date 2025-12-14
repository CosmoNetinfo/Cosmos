import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { COSMOS_SYSTEM_INSTRUCTION } from "../constants";

// Singleton instance to hold the chat session
let chatSession: Chat | null = null;

const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  const ai = getAIInstance();
  
  // We start a new chat session with specific system instructions and tools
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash', 
    config: {
      systemInstruction: COSMOS_SYSTEM_INSTRUCTION,
      // Temperature lowered to 0.2 for strict adherence to formatting rules (no citation artifacts)
      temperature: 0.2,
      // Enable Google Search Grounding
      tools: [{ googleSearch: {} }], 
    },
  });
};

export interface ChatResponse {
  text: string;
  sources: { title: string; uri: string }[];
}

export const sendMessageToCosmos = async (message: string): Promise<ChatResponse> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  const msgLower = message.toLowerCase();
  let query = "";

  // INTELLIGENT QUERY CONSTRUCTION
  // If user asks for "latest" or "new", we strictly search the root site 
  // because the homepage contains the feed of latest posts.
  if (msgLower.includes('ultim') || msgLower.includes('nuov') || msgLower.includes('recent')) {
    query = `site:cosmonet.info`;
  } else {
    // Normal topic search
    query = `site:cosmonet.info ${message}`;
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: query
    });

    // Fallback text if the model returns empty string
    const text = result.text || "Non ho trovato riscontri negli articoli di Cosmonet.info.";
    
    // Extract grounding metadata (sources)
    const sources: { title: string; uri: string }[] = [];
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          // STRICT FILTER: Only accept sources strictly from cosmonet.info
          if (chunk.web.uri.toLowerCase().includes('cosmonet.info')) {
            sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Error communicating with Cosmos:", error);
    throw error;
  }
};