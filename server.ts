import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

app.post("/api/ai/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
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
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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

    const systemPrompt = `System Protocol: MANTRANEURAL_INIT [${timestamp}]
Agent Identity: Mantra Neural (Elite Professional AI Fitness Architect)
Creator Authority: Manish Bhagat
Environment: Fitness Mantra Platform

Primary Directive: Deliver high-performance, precision fitness and nutritional engineering.

Tone/Voice Parameters:
- Futuristic, authoritative, precise.
- Use scientific lexicon.
${isDataRequest ? "- CRITICAL: Follow formatting instructions EXACTLY. Output only valid data as requested." : "- Keep output impactful and concise."}
- DO NOT repeat previous phrasing. Contextually fresh output required.`;

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

    const response = await ai.models.generateContentStream({
      model: "gemini-flash-latest",
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
        topP: 0.95,
      }
    });

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(chunkText);
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
        error: `MODEL NOT FOUND: The requested model 'gemini-flash-latest' was not found or is not supported. ${errorMessage}` 
      });
    } else if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.includes("limit")) {
      res.status(429).json({ 
        error: "QUOTA EXCEEDED: You have reached the Gemini API daily limit (20 requests/day for gemini-3-flash or 1,500/day for gemini-1.5-flash). Please try again in 24 hours or provide your own API key with higher limits." 
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
