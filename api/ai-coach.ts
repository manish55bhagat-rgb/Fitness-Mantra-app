import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  let apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["'](.+)["']$/, '$1');
  }

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
    throw new Error("MISSING_API_KEY");
  }

  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, query, image } = req.body || {};
  const userMessage = message || query;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  let ai;
  try {
    ai = getAI();
  } catch (apiKeyErr: any) {
    console.error("[AI Coach API Config Error] Missing or invalid GEMINI_API_KEY:", apiKeyErr.message || apiKeyErr);
    return res.status(403).json({ error: "AI Coach setup is pending. Please contact Fitness Mantra support." });
  }

  const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Keep answers extremely short, concise, and direct (max 2-3 sentences or a quick bulleted list of 3 items) so they generate and load instantly. Reply in the user's language. If user writes Marathi mde, Marathi madhe, or मराठीत, reply in Marathi. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Return plain text only.`;

  const parts: any[] = [];
  if (userMessage) {
    parts.push({ text: userMessage });
  }
  if (image) {
    const partsOfImage = image.split(",");
    const base64Data = partsOfImage[1] || image;
    const mimeInfo = partsOfImage[0];
    const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  const handleGenAIError = (err: any) => {
    const errStr = String(err.message || err.status || err.code || err).toLowerCase();
    if (errStr.includes("quota") || errStr.includes("resource_exhausted") || errStr.includes("limit") || err.status === 429 || err.code === 429) {
      return res.status(429).json({ error: "AI Coach is temporarily busy due to high usage. Please try again later." });
    }
    if (errStr.includes("api_key") || errStr.includes("api key") || errStr.includes("missing_api_key") || err.status === 403 || err.code === 403 || err.status === 401 || err.code === 401) {
      return res.status(403).json({ error: "AI Coach setup is pending. Please contact Fitness Mantra support." });
    }
    return res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
  };

  let responseText = "";
  let currentModel = "gemini-3.1-flash-lite";

  try {
    console.log(`[AI Coach Vercel API] Requesting response using model: ${currentModel}`);
    const response = await ai.models.generateContent({
      model: currentModel,
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    if (response && response.text) {
      responseText = response.text;
    } else {
      throw new Error("Empty response returned from model");
    }
  } catch (error: any) {
    console.warn(`[AI Coach Vercel API] Model ${currentModel} failed, trying fallback model gemini-3.5-flash...`, error);
    currentModel = "gemini-3.5-flash";
    
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          topP: 0.95,
        },
      });

      if (response && response.text) {
        responseText = response.text;
      } else {
        throw new Error("Empty response returned from fallback model");
      }
    } catch (fallbackError: any) {
      console.error(`[AI Coach Vercel API Error] Both models failed:`, fallbackError);
      return handleGenAIError(fallbackError);
    }
  }

  // Clean up any residual markdown symbols to ensure 100% plain text as requested by user
  const cleanedReply = responseText
    .replace(/^#+\s*(.*?)$/gm, "$1") // Remove headers (such as #, ##, ###)
    .replace(/\*\*([\s\S]*?)\*\*/g, "$1") // Remove bold text notation
    .replace(/__([\s\S]*?)__/g, "$1")
    .replace(/\*([\s\S]*?)\*/g, "$1") // Remove italic text notation
    .replace(/_([\s\S]*?)_/g, "$1")
    .replace(/^\s*[\*\-]\s+/gm, "• ") // Replace leading asterisks or dashes in lists with a simple bullet
    .replace(/`([^`]+)`/g, "$1") // Remove backticks
    .replace(/^\s*[\-\*_]{3,}\s*$/gm, "") // Remove horizontal separation lines
    .replace(/\n{3,}/g, "\n\n") // Normalize excessive empty lines
    .trim();

  return res.status(200).json({ reply: cleanedReply });
}
