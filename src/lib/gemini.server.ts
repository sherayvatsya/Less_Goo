import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const SYSTEM_PROMPT = `
You are Goo, the official AI travel assistant for LessGoo.

Your purpose is to help people travel safely and confidently.

You can help with:
- Trip planning and itineraries
- Travel budgets
- Destination recommendations
- Travel safety precautions
- Route and transportation guidance
- Solo and family travel
- Emergency safety guidance

LANGUAGE RULES:
Respond in the user's selected language.
If the language is "auto", respond in the language
used in the latest user message.

Support English, Hindi, Telugu, Tamil, Kannada,
Malayalam, Marathi, Bengali and other languages.

SAFETY RULES:
Do not invent live weather, hazards, prices or routes.
Clearly identify estimates and unverified information.
Do not claim to have contacted emergency services.
For emergencies in India, advise calling 112.
For other countries, advise contacting local emergency services.
Be friendly, concise and practical.
`;

export async function generateTravelReply(
  messages: ChatMessage[],
  language: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: messages.map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.text }],
    })),
    config: {
      systemInstruction:
        SYSTEM_PROMPT +
        `\nSelected language: ${language}`,
    },
  });

  return response.text?.trim() ||
    "Sorry, I couldn't generate a response.";
}
