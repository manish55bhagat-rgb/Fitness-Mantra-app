import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = "gemini-1.5-flash";

function getApiKey() {
  const rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
  const apiKey = rawKey.trim().replace(/^["'](.+)["']$/, "$1");
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
    throw new Error("MISSING_API_KEY");
  }
  return apiKey;
}

function cleanReply(text: string) {
  return (text || "")
    .replace(/^#+\s*(.*?)$/gm, "$1")
    .replace(/\*\*([\s\S]*?)\*\*/g, "$1")
    .replace(/__([\s\S]*?)__/g, "$1")
    .replace(/\*([\s\S]*?)\*/g, "$1")
    .replace(/_([\s\S]*?)_/g, "$1")
    .replace(/^\s*[\*\-]\s+/gm, "• ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[\-\*_]{3,}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, query, image } = req.body || {};
    const userMessage = message || query;

    if (!userMessage && !image) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const systemPrompt = "You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. If user writes Marathi mde, Marathi madhe, or मराठीत, reply in Marathi. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.";

    const parts: any[] = [];
    if (userMessage) parts.push({ text: userMessage });

    if (image) {
      const partsOfImage = String(image).split(",");
      const base64Data = partsOfImage[1] || image;
      const mimeInfo = partsOfImage[0] || "";
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { data: base64Data, mimeType } });
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const response = await ai.models.generateContent({
      model,
      contents: parts,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95
      }
    });

    const reply = cleanReply(response.text || "");
    return res.status(200).json({ reply: reply || "I am ready. Please ask your fitness or diet question again." });
  } catch (error: any) {
    const message = String(error?.message || error || "");
    console.error("[AI Coach API Error]", message);

    if (message === "MISSING_API_KEY" || message.toLowerCase().includes("api key")) {
      return res.status(403).json({ error: "Invalid or missing GEMINI_API_KEY in Vercel Environment Variables." });
    }

    if (message.includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("resource_exhausted")) {
      return res.status(429).json({ error: "Quota Exceeded. Please try again later or use a Gemini key with higher quota." });
    }

    if (message.includes("404") || message.toLowerCase().includes("not found")) {
      return res.status(404).json({ error: "Model Not Found. Set GEMINI_MODEL=gemini-1.5-flash in Vercel." });
    }

    return res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
  }
}
