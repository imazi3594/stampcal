
import { GoogleGenAI, Type } from "@google/genai";
import { PostageSuggestion } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getPostageSuggestion(query: string): Promise<PostageSuggestion | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is asking about postage rates in Hong Kong: "${query}". Provide a structured suggestion for the required postage.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Type of mail (e.g. Local Letter, Air Mail)" },
              weight: { type: Type.STRING, description: "Estimated weight tier" },
              price: { type: Type.NUMBER, description: "Postage cost in HKD" },
              description: { type: Type.STRING, description: "Short explanation of the rate" },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Pro tips for mailing"
              }
            },
            required: ["category", "weight", "price", "description", "tips"]
          }
        }
      });

      const text = response.text;
      if (!text) return null;
      return JSON.parse(text) as PostageSuggestion;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
