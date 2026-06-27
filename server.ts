import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Prefer a stable production model. You can override this from Vercel Environment Variables.
const PRIMARY_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const FALLBACK_GEMINI_MODELS = [
  PRIMARY_GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
].filter((model, index, models) => model && models.indexOf(model) === index);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAI = () => {
  let apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["'](.+)["']$/, "$1");
  }

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
    throw new Error("MISSING_API_KEY");
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "fitness-mantra-production",
      },
    },
  });
};

const getErrorInfo = (error: any) => {
  const raw = String(error?.message || error?.status || error?.code || error || "").toLowerCase();
  const status = Number(error?.status || error?.code || 0);
  return {
    raw,
    status,
    isApiKey: raw.includes("api_key") || raw.includes("api key") || raw.includes("permission") || status === 401 || status === 403,
    isQuota: raw.includes("quota") || raw.includes("resource_exhausted") || raw.includes("rate") || raw.includes("limit") || status === 429,
    isModel: raw.includes("not_found") || raw.includes("not found") || raw.includes("model") || status === 404,
    isTransient: raw.includes("503") || raw.includes("500") || raw.includes("502") || raw.includes("504") || raw.includes("service unavailable") || raw.includes("unavailable") || raw.includes("overloaded") || raw.includes("high demand") || raw.includes("timeout") || status === 500 || status === 502 || status === 503 || status === 504,
  };
};

async function generateAiCoachReply(ai: GoogleGenAI, parts: any[], systemPrompt: string) {
  let lastError: any = null;

  for (const model of FALLBACK_GEMINI_MODELS) {
    let delay = 800;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[AI Coach] Trying model=${model}, attempt=${attempt}`);

        const response = await ai.models.generateContent({
          model,
          contents: parts,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.75,
            topP: 0.9,
            maxOutputTokens: 900,
          },
        });

        if (response?.text?.trim()) {
          console.log(`[AI Coach] Success using model=${model}`);
          return response.text.trim();
        }

        throw new Error("Empty response returned from Gemini");
      } catch (error: any) {
        lastError = error;
        const info = getErrorInfo(error);
        console.warn(`[AI Coach] model=${model} attempt=${attempt} failed:`, error?.message || error);

        if (info.isApiKey) {
          throw error;
        }

        // Bad/unavailable model: switch model immediately.
        if (info.isModel) {
          break;
        }

        // Quota or overload: retry once/twice, then switch to next fallback model.
        if ((info.isQuota || info.isTransient) && attempt < 3) {
          await sleep(delay);
          delay *= 2;
          continue;
        }

        break;
      }
    }
  }

  throw lastError || new Error("AI_COACH_UNAVAILABLE");
}

const cleanPlainText = (text: string) => text
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

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    owner: "Manish Bhagat",
    brand: "Fitness Mantra",
    aiModels: FALLBACK_GEMINI_MODELS,
  });
});

app.post("/api/ai/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const ai = getAI();
    let response: any;
    let delay = 800;

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Act as an elite AI fitness trainer. Give this short form correction or tip: ${text}` }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Zephyr" },
              },
            },
          },
        });
        break;
      } catch (err: any) {
        const info = getErrorInfo(err);
        if ((info.isTransient || info.isQuota) && attempt < 4) {
          console.warn(`TTS temporary error, retrying in ${delay}ms...`);
          await sleep(delay);
          delay *= 2;
          continue;
        }
        throw err;
      }
    }

    const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio returned from Gemini");
    }
    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("TTS Endpoint Error:", error);
    res.status(500).json({ error: error.message || "TTS generation failed" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { query, image } = req.body;

  if (!query && !image) {
    return res.status(400).json({ error: "Query or image is required" });
  }

  try {
    const ai = getAI();
    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.`;

    const parts: any[] = [{ text: `User Transmission: ${query || "Analyze this visual data."}` }];

    if (image) {
      const [mimeInfo, base64Data] = image.split(",");
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({
        inlineData: {
          data: base64Data || image,
          mimeType,
        },
      });
    }

    const responseText = await generateAiCoachReply(ai, parts, systemPrompt);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.end(cleanPlainText(responseText));
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    const info = getErrorInfo(error);

    if (error?.message === "MISSING_API_KEY" || info.isApiKey) {
      return res.status(401).json({ error: "Invalid or missing Gemini API Key" });
    }

    if (info.isQuota) {
      return res.status(429).json({ error: "AI Coach is reconnecting. Please try again after a few seconds." });
    }

    res.status(503).json({ error: "AI Coach is reconnecting. Please try again after a few seconds." });
  }
});

app.post("/api/ai-coach", async (req, res) => {
  const { message, query, image } = req.body;
  const userMessage = message || query;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  try {
    let ai: GoogleGenAI;
    try {
      ai = getAI();
    } catch (apiKeyErr: any) {
      console.error("[AI Coach API Config Error] Missing or invalid GEMINI_API_KEY:", apiKeyErr.message || apiKeyErr);
      return res.status(403).json({ error: "Invalid API Key" });
    }

    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. If user writes Marathi mde, Marathi madhe, or मराठीत, reply in Marathi. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.`;

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
          mimeType,
        },
      });
    }

    const responseText = await generateAiCoachReply(ai, parts, systemPrompt);
    const cleanedReply = cleanPlainText(responseText);

    console.log("[AI Coach API] Successfully generated stable response");
    res.json({ reply: cleanedReply });
  } catch (error: any) {
    console.error("[AI Coach Backend Terminal Error]:", error);
    const info = getErrorInfo(error);

    if (error?.message === "MISSING_API_KEY" || info.isApiKey) {
      return res.status(403).json({ error: "Invalid API Key" });
    }

    if (info.isQuota) {
      return res.status(429).json({ error: "AI Coach is reconnecting. Please try again after a few seconds." });
    }

    if (info.isModel) {
      return res.status(503).json({ error: "AI Coach model is switching. Please try again after a few seconds." });
    }

    res.status(503).json({ error: "AI Coach is reconnecting. Please try again after a few seconds." });
  }
});

// Vite and Startup
const initServer = async () => {
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(">>> [SERVER START] Fitness Mantra Protocol Initialized");
      console.log(`>>> [INFO] Port: ${PORT}`);
      console.log(">>> [INFO] Host: 0.0.0.0");
      console.log(`>>> [INFO] Mode: ${process.env.NODE_ENV || "development"}`);
      console.log(`>>> [INFO] AI Models: ${FALLBACK_GEMINI_MODELS.join(", ")}`);
      console.log(`>>> [INFO] Date: ${new Date().toISOString()}`);
      console.log(">>> [INFO] Owner: Manish Bhagat");
    });
  }
};

initServer();

export default app;
