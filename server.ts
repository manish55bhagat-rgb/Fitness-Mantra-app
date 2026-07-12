import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import Razorpay from "razorpay";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const GEMINI_MODEL = "gemini-3.5-flash";

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

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

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", owner: "Manish Bhagat", brand: "Fitness Mantra" });
});

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_live_T7l3GCLlwsgoYY";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "PvRh02KlKSay4OEn9PAAmSCi";
  
  const RazorpayClass = (Razorpay as any).default || Razorpay;
  return new RazorpayClass({
    key_id: keyId.trim(),
    key_secret: keySecret.trim(),
  });
};

// Create Order Endpoint
app.post("/api/razorpay/create-order", async (req, res) => {
  const { planName } = req.body;
  if (!planName) {
    return res.status(400).json({ error: "planName is required" });
  }

  let amount = 0;
  const nameLower = planName.toLowerCase();
  if (nameLower.includes("1 month") || nameLower.includes("starter")) {
    amount = 299;
  } else if (nameLower.includes("3 month") || nameLower.includes("transformation")) {
    amount = 999;
  } else if (nameLower.includes("6 month") || nameLower.includes("premium")) {
    amount = 1999;
  } else {
    return res.status(400).json({ error: "Invalid plan selection" });
  }

  try {
    const razorpay = getRazorpayInstance();
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_live_T7l3GCLlwsgoYY"
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ error: error.message || "Failed to create payment order" });
  }
});

// Verify Payment Signature Endpoint
app.post("/api/razorpay/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing verification parameters" });
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "PvRh02KlKSay4OEn9PAAmSCi";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret.trim())
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        message: "Payment signature verified successfully"
      });
    } else {
      console.warn("[Razorpay Verification Failed] Expected:", expectedSignature, "Got:", razorpay_signature);
      res.status(400).json({ error: "Signature mismatch. Verification failed." });
    }
  } catch (error: any) {
    console.error("Razorpay Signature Verification Error:", error);
    res.status(500).json({ error: error.message || "Signature verification failed" });
  }
});

app.post("/api/ai/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  try {
    const ai = getAI();
    let response;
    let retries = 4;
    let delay = 500;
    
    while (retries > 0) {
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
        retries--;
        const errStr = String(err.message || err.status || err.code || err);
        const isTransient = errStr.includes("503") || errStr.includes("Service Unavailable") || errStr.includes("UNAVAILABLE") || errStr.includes("high demand") || err.status === 503 || err.code === 503;
        
        if (isTransient && retries > 0) {
          console.warn(`TTS 503 error, retrying in ${delay}ms... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw err;
        }
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
    const timestamp = new Date().toISOString();
    
    const isDataRequest = query?.toLowerCase().includes("json") || query?.toLowerCase().includes("biometrics");

    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow.

CRITICAL formatting instructions:
- Return PLAIN TEXT only.
- Do NOT use any Markdown formatting, headers (such as #, ##, ###), bold formatting (such as **text**), bullet-point lists with symbols (*, -), or horizontal lines (---).
- Simply structure your response with plain text paragraphs and clean, double line breaks (blank lines) between sections to make it extremely readable and mobile-friendly.`;

    const parts: any[] = [{ text: `User Transmission: ${query || "Analyze this visual data."}` }];
    
    if (image) {
      const [mimeInfo, base64Data] = image.split(",");
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
    }

    let response;
    let retries = 3;
    let delay = 500;
    let currentModel = GEMINI_MODEL;
    
    while (retries > 0) {
      try {
        console.log(`[CHAT] Requesting stream from ${currentModel}... (Attempts remaining: ${retries})`);
        response = await ai.models.generateContentStream({
          model: currentModel,
          contents: { parts },
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.9,
            topP: 0.95,
          }
        });
        break;
      } catch (err: any) {
        retries--;
        const errStr = String(err.message || err.status || err.code || err).toLowerCase();
        const isTransient = errStr.includes("503") || errStr.includes("service unavailable") || errStr.includes("unavailable") || errStr.includes("high demand") || err.status === 503 || err.code === 503;
        const isQuota = errStr.includes("quota") || errStr.includes("resource_exhausted") || errStr.includes("limit") || err.status === 429 || err.code === 429;
        
        if (isQuota && currentModel === GEMINI_MODEL) {
          console.warn(`[CHAT] Quota limit reached on ${currentModel}. Switching immediately to high-availability fallback model: gemini-3.1-flash-lite`);
          currentModel = "gemini-3.1-flash-lite";
          retries = 2; // Try twice with the fallback model
          delay = 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (isTransient && retries > 0) {
          console.warn(`[CHAT] Transient error on ${currentModel}, retrying in ${delay}ms... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else if (currentModel === GEMINI_MODEL) {
          console.warn(`[CHAT] ${GEMINI_MODEL} failed. Trying fallback model gemini-3.1-flash-lite...`);
          currentModel = "gemini-3.1-flash-lite";
          retries = 2; // Try twice with the fallback model
          delay = 500;
        } else {
          throw err;
        }
      }
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (response) {
      for await (const chunk of response) {
        const chunkText = chunk.text;
        if (chunkText) {
          res.write(chunkText);
        }
      }
    }

    res.end();
  } catch (error: any) {
    console.error("AI Error:", error);
    const errorMessage = error.message || String(error);
    
    if (errorMessage === "MISSING_API_KEY") {
      res.status(500).json({ 
        error: "CRITICAL: Gemini API Key is missing. Click 'Settings' (gear icon) -> 'Secrets' -> Add 'GEMINI_API_KEY' with your key from aistudio.google.com/app/apikey" 
      });
    } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      res.status(404).json({ 
        error: `MODEL NOT FOUND: The requested model 'gemini-3.5-flash' was not found or is not supported. ${errorMessage}` 
      });
    } else if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.includes("limit")) {
      res.status(429).json({ 
        error: "QUOTA EXCEEDED: You have reached the Gemini API limit. Please try again in 24 hours or provide your own API key with higher limits." 
      });
    } else if (errorMessage.includes("API key not valid") || errorMessage.includes("403")) {
      res.status(401).json({ 
        error: "CRITICAL: The GEMINI_API_KEY provided is invalid or has expired. Please verify it in Settings -> Secrets." 
      });
    } else {
      res.status(500).json({ 
        error: `AI Error: ${errorMessage}. Please check your configuration.` 
      });
    }
  }
});

app.post("/api/ai-coach", async (req, res) => {
  const { message, query, image } = req.body;
  const userMessage = message || query;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  try {
    let ai;
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
          mimeType: mimeType,
        },
      });
    }

    let responseText = "";
    let retries = 3;
    let delay = 500;
    let currentModel = process.env.GEMINI_MODEL || GEMINI_MODEL;
    
    while (retries > 0) {
      try {
        console.log(`[AI Coach API] Requesting response using model: ${currentModel} (Attempts remaining: ${retries})`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: parts,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.8,
            topP: 0.95,
          },
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
        throw new Error("Empty response returned from model");
      } catch (apiErr: any) {
        retries--;
        const errStr = String(apiErr.message || apiErr.status || apiErr.code || apiErr).toLowerCase();
        const isTransient = errStr.includes("503") || errStr.includes("service unavailable") || errStr.includes("unavailable") || errStr.includes("high demand") || apiErr.status === 503 || apiErr.code === 503;
        const isQuota = errStr.includes("quota") || errStr.includes("resource_exhausted") || errStr.includes("limit") || apiErr.status === 429 || apiErr.code === 429;
        
        if (isQuota && currentModel === (process.env.GEMINI_MODEL || GEMINI_MODEL)) {
          console.warn(`[AI Coach API] Quota limit reached on ${currentModel}. Switching immediately to high-availability fallback model: gemini-3.1-flash-lite`);
          currentModel = "gemini-3.1-flash-lite";
          retries = 2; // Reset retries for the fallback model
          delay = 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (isTransient && retries > 0) {
          console.warn(`[AI Coach API] Transient error on ${currentModel}, retrying in ${delay}ms... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else if (currentModel === (process.env.GEMINI_MODEL || GEMINI_MODEL)) {
          console.warn(`[AI Coach API] ${currentModel} failed. Trying fallback model gemini-3.1-flash-lite...`);
          currentModel = "gemini-3.1-flash-lite";
          retries = 2; // Try twice with the lite model
          delay = 500;
        } else {
          console.error(`[AI Coach API Error] Gemini API call failed:`, apiErr);
          
          if (errStr.includes("api_key") || errStr.includes("api key") || apiErr.status === 403 || apiErr.code === 403) {
            return res.status(403).json({ error: "Invalid API Key" });
          } else if (errStr.includes("quota") || errStr.includes("resource_exhausted") || errStr.includes("limit") || apiErr.status === 429 || apiErr.code === 429) {
            return res.status(429).json({ error: "Quota Exceeded" });
          } else if (errStr.includes("not_found") || errStr.includes("not found") || apiErr.status === 404 || apiErr.code === 404) {
            return res.status(404).json({ error: "Model Not Found" });
          }
          return res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
        }
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

    console.log(`[AI Coach API] Successfully generated plain text response`);
    res.json({ reply: cleanedReply });
  } catch (error: any) {
    console.error("[AI Coach Backend Terminal Error]:", error);
    res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
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
      console.log(`>>> [SERVER START] Fitness Mantra Protocol Initialized`);
      console.log(`>>> [INFO] Port: ${PORT}`);
      console.log(`>>> [INFO] Host: 0.0.0.0`);
      console.log(`>>> [INFO] Mode: ${process.env.NODE_ENV || "development"}`);
      console.log(`>>> [INFO] Date: ${new Date().toISOString()}`);
      console.log(`>>> [INFO] Owner: Manish Bhagat`);
    });
  }
};

initServer();

export default app;
