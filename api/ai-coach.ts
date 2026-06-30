import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const FALLBACK_MODELS = ["gemini-2.0-flash-lite", "gemini-1.5-flash"];

function getKey() {
  const key = (process.env.GEMINI_API_KEY || "").trim().replace(/^["'](.+)["']$/, "$1");
  if (!key || key === "MY_GEMINI_API_KEY" || key.length < 10) {
    throw new Error("MISSING_API_KEY");
  }
  return key;
}

function parseBody(req: any) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function buildParts(userMessage?: string, image?: string) {
  const parts: any[] = [];

  if (userMessage) {
    parts.push({ text: String(userMessage) });
  }

  if (image) {
    const imageParts = String(image).split(",");
    const base64Data = imageParts[1] || imageParts[0];
    const mimeInfo = imageParts[0] || "";
    const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";

    parts.push({
      inlineData: {
        data: base64Data,
        mimeType,
      },
    });
  }

  return parts;
}

function clean(text: string) {
  return text
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

function localCoachReply(message?: string) {
  const text = String(message || "").toLowerCase();
  const isMarathi = /[\u0900-\u097F]/.test(String(message || "")) || text.includes("mde") || text.includes("marathi");

  if (isMarathi) {
    return `Fitness Mantra Coach

तुमच्यासाठी safe quick guide:

• रोज 30 ते 45 मिनिटे walk करा
• प्रत्येक meal मध्ये protein ठेवा
• गोड, तळलेले आणि cold drinks कमी करा
• पाणी 2 ते 3 लिटर प्या
• झोप 7 ते 8 तास घ्या
• workout हळूहळू सुरू करा

Personal plan साठी age, height, weight, goal आणि diet preference पाठवा.

हे general fitness guidance आहे, medical advice नाही.`;
  }

  if (text.includes("diet") || text.includes("fat") || text.includes("weight") || text.includes("calorie")) {
    return `Fitness Mantra Coach

Safe quick fat-loss guide:

Morning: Water + oats, poha, upma, eggs, sprouts or dal chilla.

Lunch: Roti/bhakri + dal/usal/paneer/egg/chicken + vegetables + salad.

Evening: Fruit, roasted chana, curd or tea without sugar.

Dinner: Keep it light. Avoid fried food, sweets, bakery items and cold drinks.

Daily target: 30 to 45 minutes walking, 2 to 3 liters water, and 7 to 8 hours sleep.

This is general fitness guidance only.`;
  }

  return `Fitness Mantra Coach

Safe quick guide:

• Walk 30 to 45 minutes daily
• Eat protein in every meal
• Add vegetables and salad
• Reduce sugar, fried food and cold drinks
• Drink 2 to 3 liters water
• Sleep 7 to 8 hours
• Start workouts slowly and stay consistent

For a personal plan, share age, height, weight, goal and diet preference.

This is general fitness guidance only.`;
}

function isKeyError(error: any) {
  const text = String(error?.message || error?.status || error?.code || error).toLowerCase();
  return text.includes("api_key") || text.includes("api key") || error?.status === 401 || error?.status === 403;
}

function shouldTryFallback(error: any) {
  const text = String(error?.message || error?.status || error?.code || error).toLowerCase();
  return (
    text.includes("not_found") ||
    text.includes("not found") ||
    text.includes("quota") ||
    text.includes("resource_exhausted") ||
    text.includes("limit") ||
    text.includes("503") ||
    text.includes("service unavailable") ||
    text.includes("unavailable") ||
    text.includes("high demand") ||
    error?.status === 404 ||
    error?.code === 404 ||
    error?.status === 429 ||
    error?.code === 429 ||
    error?.status === 503 ||
    error?.code === 503
  );
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Cache-Control, X-Fitness-Mantra-Client");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = parseBody(req);
  const userMessage = body.message || body.query;
  const image = body.image;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: getKey() });
    const models = [DEFAULT_MODEL, ...FALLBACK_MODELS.filter((model) => model !== DEFAULT_MODEL)];
    const parts = buildParts(userMessage, image);

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts }],
          config: {
            systemInstruction: "You are Fitness Mantra AI Coach by Manish Bhagat. Give safe, simple, practical fitness, diet, workout, BMI and calorie guidance. Avoid medical diagnosis and prescriptions. Reply in the user's language. If the user writes Marathi, reply in Marathi. Plain text only.",
            temperature: 0.7,
            topP: 0.95,
          },
        });

        if (response?.text?.trim()) {
          return res.status(200).json({ reply: clean(response.text) });
        }
      } catch (error: any) {
        console.error(`[AI Coach] ${model} failed`, error?.message || error);

        if (isKeyError(error)) {
          return res.status(401).json({ error: "Invalid Gemini API key on server." });
        }

        if (!shouldTryFallback(error)) {
          break;
        }
      }
    }

    return res.status(200).json({ reply: localCoachReply(userMessage) });
  } catch (error: any) {
    console.error("[AI Coach] Terminal error", error?.message || error);

    if (String(error?.message || error).includes("MISSING_API_KEY")) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing in Vercel Environment Variables." });
    }

    return res.status(200).json({ reply: localCoachReply(userMessage) });
  }
}
