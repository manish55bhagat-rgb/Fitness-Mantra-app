import { GoogleGenAI } from "@google/genai";

const getKey = () => {
  const key = (process.env.GEMINI_API_KEY || "").trim().replace(/^["'](.+)["']$/, "$1");
  if (!key || key.length < 10) throw new Error("MISSING_API_KEY");
  return key;
};

const clean = (text: string) => text
  .replace(/^#+\s*(.*?)$/gm, "$1")
  .replace(/\*\*([\s\S]*?)\*\*/g, "$1")
  .replace(/__([\s\S]*?)__/g, "$1")
  .replace(/\*([\s\S]*?)\*/g, "$1")
  .replace(/_([\s\S]*?)_/g, "$1")
  .replace(/^\s*[\*\-]\s+/gm, "• ")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const backupReply = () => `Fitness Mantra Coach

AI service is under high usage right now, but your request is received.

Basic safe guide:
• Walk 30 to 45 minutes daily
• Eat protein in every meal
• Add vegetables and salad
• Reduce sugar, fried food and cold drinks
• Drink enough water
• Sleep 7 to 8 hours
• Start workouts slowly and stay consistent

For a personal plan, share age, height, weight, goal and diet preference.

This is general fitness guidance only.`;

const isKeyError = (error: any) => {
  const text = String(error?.message || error?.status || error?.code || error).toLowerCase();
  return text.includes("api_key") || text.includes("api key") || error?.status === 401 || error?.status === 403;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const body = req.body || {};
  const userMessage = body.message || body.query || "fitness guidance";

  try {
    const ai = new GoogleGenAI({ apiKey: getKey() });
    const models = [process.env.GEMINI_MODEL, "gemini-2.0-flash-lite", "gemini-2.0-flash"].filter(Boolean) as string[];

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: String(userMessage) }] }],
          config: {
            systemInstruction: "You are Fitness Mantra AI Coach by Manish Bhagat. Give safe, simple, practical fitness and nutrition guidance. Avoid medical diagnosis and prescriptions. Reply in the user's language. Plain text only.",
            temperature: 0.7,
          },
        });

        if (response?.text?.trim()) return res.status(200).json({ reply: clean(response.text) });
      } catch (error: any) {
        console.error(`[AI Coach] ${model} failed`, error?.message || error);
        if (isKeyError(error)) break;
      }
    }

    return res.status(200).json({ reply: backupReply() });
  } catch (error) {
    return res.status(200).json({ reply: backupReply() });
  }
}
