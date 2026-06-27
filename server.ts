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

const AI_CACHE_TTL_MS = Number(process.env.AI_CACHE_TTL_MS || 10 * 60 * 1000);
const AI_CACHE_MAX_ITEMS = Number(process.env.AI_CACHE_MAX_ITEMS || 120);
const AI_MAX_CONCURRENT = Number(process.env.AI_MAX_CONCURRENT || 2);
const AI_QUEUE_TIMEOUT_MS = Number(process.env.AI_QUEUE_TIMEOUT_MS || 45 * 1000);
const AI_RATE_WINDOW_MS = Number(process.env.AI_RATE_WINDOW_MS || 60 * 1000);
const AI_RATE_MAX_REQUESTS = Number(process.env.AI_RATE_MAX_REQUESTS || 12);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type CacheEntry = {
  reply: string;
  expiresAt: number;
};

const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<string>>();
const rateBuckets = new Map<string, number[]>();

let activeAiRequests = 0;
const aiQueue: Array<() => void> = [];

const normalizeQuestion = (value: string) => value
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, 500);

const createCacheKey = (message?: string, hasImage?: boolean) => {
  if (hasImage) return null;
  const normalized = normalizeQuestion(message || "");
  if (!normalized || normalized.length < 3) return null;
  return normalized;
};

const getCachedReply = (key: string | null) => {
  if (!key) return null;
  const cached = responseCache.get(key);
  if (!cached) return null;

  if (cached.expiresAt < Date.now()) {
    responseCache.delete(key);
    return null;
  }

  return cached.reply;
};

const setCachedReply = (key: string | null, reply: string) => {
  if (!key || !reply) return;

  responseCache.set(key, {
    reply,
    expiresAt: Date.now() + AI_CACHE_TTL_MS,
  });

  while (responseCache.size > AI_CACHE_MAX_ITEMS) {
    const firstKey = responseCache.keys().next().value;
    if (!firstKey) break;
    responseCache.delete(firstKey);
  }
};

const getClientKey = (req: express.Request) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (ip || req.socket.remoteAddress || "anonymous").trim();
};

const isRateLimited = (clientKey: string) => {
  const now = Date.now();
  const recent = (rateBuckets.get(clientKey) || []).filter(ts => now - ts < AI_RATE_WINDOW_MS);

  if (recent.length >= AI_RATE_MAX_REQUESTS) {
    rateBuckets.set(clientKey, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(clientKey, recent);
  return false;
};

const runWithAiQueue = async <T,>(task: () => Promise<T>): Promise<T> => {
  if (activeAiRequests >= AI_MAX_CONCURRENT) {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = aiQueue.indexOf(resolve);
        if (index >= 0) aiQueue.splice(index, 1);
        reject(new Error("AI_QUEUE_TIMEOUT"));
      }, AI_QUEUE_TIMEOUT_MS);

      aiQueue.push(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  activeAiRequests++;
  try {
    return await task();
  } finally {
    activeAiRequests--;
    const next = aiQueue.shift();
    if (next) next();
  }
};

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
    isQueue: raw.includes("ai_queue_timeout"),
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

const getFriendlyAiError = (error: any) => {
  const info = getErrorInfo(error);

  if (error?.message === "MISSING_API_KEY" || info.isApiKey) {
    return { status: 403, error: "Invalid API Key" };
  }

  if (info.isQueue) {
    return { status: 503, error: "AI Coach is handling many users. Please try again in a few seconds." };
  }

  if (info.isQuota) {
    return { status: 429, error: "AI Coach is reconnecting. Please try again after a few seconds." };
  }

  if (info.isModel) {
    return { status: 503, error: "AI Coach model is switching. Please try again after a few seconds." };
  }

  return { status: 503, error: "AI Coach is reconnecting. Please try again after a few seconds." };
};

async function getStableAiReply(ai: GoogleGenAI, parts: any[], systemPrompt: string, cacheKey: string | null) {
  const cachedReply = getCachedReply(cacheKey);
  if (cachedReply) {
    console.log("[AI Coach] Cache hit");
    return cachedReply;
  }

  if (cacheKey && inFlightRequests.has(cacheKey)) {
    console.log("[AI Coach] Joining in-flight request");
    return inFlightRequests.get(cacheKey)!;
  }

  const promise = runWithAiQueue(async () => {
    const freshReply = await generateAiCoachReply(ai, parts, systemPrompt);
    setCachedReply(cacheKey, freshReply);
    return freshReply;
  }).finally(() => {
    if (cacheKey) inFlightRequests.delete(cacheKey);
  });

  if (cacheKey) inFlightRequests.set(cacheKey, promise);
  return promise;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    owner: "Manish Bhagat",
    brand: "Fitness Mantra",
    aiModels: FALLBACK_GEMINI_MODELS,
    aiQueue: {
      active: activeAiRequests,
      waiting: aiQueue.length,
      maxConcurrent: AI_MAX_CONCURRENT,
    },
    aiCache: {
      size: responseCache.size,
      maxItems: AI_CACHE_MAX_ITEMS,
      ttlMs: AI_CACHE_TTL_MS,
    },
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
        response = await runWithAiQueue(() => ai.models.generateContent({
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
        }));
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
    const friendly = getFriendlyAiError(error);
    res.status(friendly.status).json({ error: friendly.error });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { query, image } = req.body;

  if (!query && !image) {
    return res.status(400).json({ error: "Query or image is required" });
  }

  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return res.status(429).json({ error: "Please wait a few seconds before sending another AI request." });
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

    const cacheKey = createCacheKey(query, Boolean(image));
    const responseText = await getStableAiReply(ai, parts, systemPrompt, cacheKey);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.end(cleanPlainText(responseText));
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    const friendly = getFriendlyAiError(error);
    res.status(friendly.status).json({ error: friendly.error });
  }
});

app.post("/api/ai-coach", async (req, res) => {
  const { message, query, image } = req.body;
  const userMessage = message || query;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return res.status(429).json({ error: "Please wait a few seconds before sending another AI request." });
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

    const cacheKey = createCacheKey(userMessage, Boolean(image));
    const responseText = await getStableAiReply(ai, parts, systemPrompt, cacheKey);
    const cleanedReply = cleanPlainText(responseText);

    console.log("[AI Coach API] Successfully generated stable response");
    res.json({ reply: cleanedReply });
  } catch (error: any) {
    console.error("[AI Coach Backend Terminal Error]:", error);
    const friendly = getFriendlyAiError(error);
    res.status(friendly.status).json({ error: friendly.error });
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
      console.log(`>>> [INFO] Queue: maxConcurrent=${AI_MAX_CONCURRENT}, timeout=${AI_QUEUE_TIMEOUT_MS}ms`);
      console.log(`>>> [INFO] Cache: maxItems=${AI_CACHE_MAX_ITEMS}, ttl=${AI_CACHE_TTL_MS}ms`);
      console.log(`>>> [INFO] Date: ${new Date().toISOString()}`);
      console.log(">>> [INFO] Owner: Manish Bhagat");
    });
  }
};

initServer();

export default app;
