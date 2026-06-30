import { GoogleGenAI } from "@google/genai";

const cleanApiKey = () => {
  let apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["'](.+)["']$/, "$1");
  }

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
    throw new Error("MISSING_API_KEY");
  }

  return apiKey;
};

const createAI = () => new GoogleGenAI({ apiKey: cleanApiKey() });

const cleanReplyText = (text: string) =>
  text
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

const getErrorType = (error: any) => {
  const errStr = String(error?.message || error?.status || error?.code || error).toLowerCase();

  if (
    errStr.includes("api_key") ||
    errStr.includes("api key") ||
    errStr.includes("missing_api_key") ||
    error?.status === 403 ||
    error?.code === 403 ||
    error?.status === 401 ||
    error?.code === 401
  ) {
    return "api_key";
  }

  if (
    errStr.includes("quota") ||
    errStr.includes("resource_exhausted") ||
    errStr.includes("rate limit") ||
    error?.status === 429 ||
    error?.code === 429
  ) {
    return "quota";
  }

  return "unknown";
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, query, image } = req.body || {};
  const userMessage = message || query;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  let ai: GoogleGenAI;
  try {
    ai = createAI();
  } catch (error) {
    return res.status(403).json({ error: "AI Coach setup is pending. Please contact Fitness Mantra support." });
  }

  const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. If the user writes in Marathi or Hindi, reply in that language. Avoid medical diagnosis, prescriptions, treatment claims, and guaranteed results. For medical issues, advise consulting a qualified doctor. Keep answers clear, short, and practical. Return plain text only.`;

  const parts: any[] = [];
  if (userMessage) {
    parts.push({ text: String(userMessage) });
  }

  if (image) {
    const imageParts = String(image).split(",");
    const base64Data = imageParts[1] || imageParts[0];
    const mimeInfo = imageParts[0] || "";
    const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
    parts.push({ inlineData: { data: base64Data, mimeType } });
  }

  const models = [
    process.env.GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
  ].filter(Boolean) as string[];

  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      const reply = response?.text;
      if (reply && reply.trim()) {
        return res.status(200).json({ reply: cleanReplyText(reply) });
      }

      lastError = new Error(`Empty response from ${model}`);
    } catch (error: any) {
      lastError = error;
      console.error(`[AI Coach] Model failed: ${model}`, error?.message || error);
      const errorType = getErrorType(error);
      if (errorType === "api_key" || errorType === "quota") break;
    }
  }

  const errorType = getErrorType(lastError);
  if (errorType === "api_key") {
    return res.status(403).json({ error: "AI Coach setup is pending. Please contact Fitness Mantra support." });
  }

  if (errorType === "quota") {
    return res.status(429).json({ error: "AI Coach is temporarily busy due to high usage. Please try again later." });
  }

  return res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
}
