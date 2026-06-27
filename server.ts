import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

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

type CacheEntry = { reply: string; expiresAt: number };
const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<string>>();
const rateBuckets = new Map<string, number[]>();
let activeAiRequests = 0;
const aiQueue: Array<() => void> = [];

const normalizeQuestion = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 500);
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
  responseCache.set(key, { reply, expiresAt: Date.now() + AI_CACHE_TTL_MS });
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
  if (apiKey) apiKey = apiKey.trim().replace(/^["'](.+)["']$/, "$1");
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) throw new Error("MISSING_API_KEY");
  return new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "fitness-mantra-production" } } });
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
        const response = await ai.models.generateContent({
          model,
          contents: parts,
          config: { systemInstruction: systemPrompt, temperature: 0.75, topP: 0.9, maxOutputTokens: 900 },
        });
        if (response?.text?.trim()) return response.text.trim();
        throw new Error("Empty response returned from Gemini");
      } catch (error: any) {
        lastError = error;
        const info = getErrorInfo(error);
        if (info.isApiKey) throw error;
        if (info.isModel) break;
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
  if (error?.message === "MISSING_API_KEY" || info.isApiKey) return { status: 403, error: "Invalid API Key" };
  if (info.isQueue) return { status: 503, error: "AI Coach is handling many users. Please try again in a few seconds." };
  if (info.isQuota) return { status: 429, error: "AI Coach is reconnecting. Please try again after a few seconds." };
  if (info.isModel) return { status: 503, error: "AI Coach model is switching. Please try again after a few seconds." };
  return { status: 503, error: "AI Coach is reconnecting. Please try again after a few seconds." };
};
async function getStableAiReply(ai: GoogleGenAI, parts: any[], systemPrompt: string, cacheKey: string | null) {
  const cachedReply = getCachedReply(cacheKey);
  if (cachedReply) return cachedReply;
  if (cacheKey && inFlightRequests.has(cacheKey)) return inFlightRequests.get(cacheKey)!;
  const promise = runWithAiQueue(async () => {
    const freshReply = await generateAiCoachReply(ai, parts, systemPrompt);
    setCachedReply(cacheKey, freshReply);
    return freshReply;
  }).finally(() => { if (cacheKey) inFlightRequests.delete(cacheKey); });
  if (cacheKey) inFlightRequests.set(cacheKey, promise);
  return promise;
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    owner: "Manish Bhagat",
    brand: "Fitness Mantra",
    aiModels: FALLBACK_GEMINI_MODELS,
    aiQueue: { active: activeAiRequests, waiting: aiQueue.length, maxConcurrent: AI_MAX_CONCURRENT },
    aiCache: { size: responseCache.size, maxItems: AI_CACHE_MAX_ITEMS, ttlMs: AI_CACHE_TTL_MS },
    payments: { razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) },
  });
});

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ error: "Razorpay keys are not configured" });

    const { amount, planName, userEmail } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || rupees < 1) return res.status(400).json({ error: "Invalid amount" });

    const orderPayload = {
      amount: Math.round(rupees * 100),
      currency: "INR",
      receipt: `FM-${Date.now()}`,
      notes: {
        planName: String(planName || "Fitness Mantra Plan"),
        userEmail: String(userEmail || ""),
      },
    };

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      return res.status(razorpayResponse.status).json({ error: data?.error?.description || "Unable to create Razorpay order" });
    }

    res.json({ keyId, order: data });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    res.status(500).json({ error: error.message || "Payment order creation failed" });
  }
});

app.post("/api/payment/verify", async (req, res) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return res.status(500).json({ error: "Razorpay secret is not configured" });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay verification fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: "Invalid payment signature" });
    }

    res.json({ verified: true });
  } catch (error: any) {
    console.error("Razorpay verify error:", error);
    res.status(500).json({ error: error.message || "Payment verification failed" });
  }
});

app.post("/api/ai/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  try {
    const ai = getAI();
    let response: any;
    let delay = 800;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        response = await runWithAiQueue(() => ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Act as an elite AI fitness trainer. Give this short form correction or tip: ${text}` }] }],
          config: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } } } },
        }));
        break;
      } catch (err: any) {
        const info = getErrorInfo(err);
        if ((info.isTransient || info.isQuota) && attempt < 4) {
          await sleep(delay);
          delay *= 2;
          continue;
        }
        throw err;
      }
    }
    const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio returned from Gemini");
    res.json({ audio: base64Audio });
  } catch (error: any) {
    const friendly = getFriendlyAiError(error);
    res.status(friendly.status).json({ error: friendly.error });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { query, image } = req.body;
  if (!query && !image) return res.status(400).json({ error: "Query or image is required" });
  if (isRateLimited(getClientKey(req))) return res.status(429).json({ error: "Please wait a few seconds before sending another AI request." });
  try {
    const ai = getAI();
    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.`;
    const parts: any[] = [{ text: `User Transmission: ${query || "Analyze this visual data."}` }];
    if (image) {
      const [mimeInfo, base64Data] = image.split(",");
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { data: base64Data || image, mimeType } });
    }
    const responseText = await getStableAiReply(ai, parts, systemPrompt, createCacheKey(query, Boolean(image)));
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.end(cleanPlainText(responseText));
  } catch (error: any) {
    const friendly = getFriendlyAiError(error);
    res.status(friendly.status).json({ error: friendly.error });
  }
});

app.post("/api/ai-coach", async (req, res) => {
  const { message, query, image } = req.body;
  const userMessage = message || query;
  if (!userMessage && !image) return res.status(400).json({ error: "Message or image is required" });
  if (isRateLimited(getClientKey(req))) return res.status(429).json({ error: "Please wait a few seconds before sending another AI request." });
  try {
    let ai: GoogleGenAI;
    try { ai = getAI(); } catch (apiKeyErr: any) { return res.status(403).json({ error: "Invalid API Key" }); }
    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. If user writes Marathi mde, Marathi madhe, or मराठीत, reply in Marathi. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.`;
    const parts: any[] = [];
    if (userMessage) parts.push({ text: userMessage });
    if (image) {
      const partsOfImage = image.split(",");
      const base64Data = partsOfImage[1] || image;
      const mimeInfo = partsOfImage[0];
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { data: base64Data, mimeType } });
    }
    const responseText = await getStableAiReply(ai, parts, systemPrompt, createCacheKey(userMessage, Boolean(image)));
    res.json({ reply: cleanPlainText(responseText) });
  } catch (error: any) {
    const friendly = getFriendlyAiError(error);
    res.status(friendly.status).json({ error: friendly.error });
  }
});

const initServer = async () => {
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
    }
    app.listen(PORT, "0.0.0.0", () => {
      console.log(">>> [SERVER START] Fitness Mantra Protocol Initialized");
      console.log(`>>> [INFO] Port: ${PORT}`);
      console.log(`>>> [INFO] AI Models: ${FALLBACK_GEMINI_MODELS.join(", ")}`);
      console.log(`>>> [INFO] Razorpay configured: ${Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)}`);
    });
  }
};

initServer();
export default app;
