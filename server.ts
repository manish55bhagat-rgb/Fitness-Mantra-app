import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const getAI = () => {
  let apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["'](.+)["']$/, "$1");
  }

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
    throw new Error("MISSING_API_KEY");
  }

  return new GoogleGenAI({ apiKey });
};

const getGeminiModel = () => {
  const modelFromEnv = process.env.GEMINI_MODEL?.trim();
  return modelFromEnv || "gemini-2.0-flash";
};

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

const buildGeminiParts = (message: string, image?: string) => {
  const parts: any[] = [{ text: message }];

  if (image && typeof image === "string" && image.includes(",")) {
    const [mimeInfo, base64Data] = image.split(",");
    const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";

    if (base64Data) {
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }
  }

  return parts;
};

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
      model: getGeminiModel(),
      contents: `Act as an elite AI fitness trainer. Give this short form correction or tip: ${text}`,
    });

    res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error("TTS Endpoint Error:", error?.message || error);
    res.status(500).json({ error: "Voice coach is currently unavailable. Please try again later." });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { query, image } = req.body;

  if (!query && !image) {
    return res.status(400).json({ error: "Query or image is required" });
  }

  try {
    const ai = getAI();
    const modelName = getGeminiModel();
    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: buildGeminiParts(query || "Analyze this fitness image.", image) }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const reply = cleanPlainText(response.text || "");
    res.json({ reply });
  } catch (error: any) {
    console.error("AI Chat Error:", error?.message || error);
    res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
  }
});

app.post("/api/ai-coach", async (req, res) => {
  const { message, query, image } = req.body;
  const userMessage = message || query;

  if (!userMessage && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  try {
    const ai = getAI();
    const modelName = getGeminiModel();

    const systemPrompt = `You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user's language. If user writes Marathi mde, Marathi madhe, or मराठीत, reply in Marathi. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Keep answers clear and easy to follow. Return plain text only.`;

    console.log(`[AI Coach API] Requesting response using model: ${modelName}`);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: buildGeminiParts(userMessage || "Analyze this fitness image.", image) }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const cleanedReply = cleanPlainText(response.text || "");

    if (!cleanedReply) {
      throw new Error(`Empty response returned from model "${modelName}"`);
    }

    res.json({ reply: cleanedReply });
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error("[AI Coach Backend Error]:", errorMessage);

    if (errorMessage === "MISSING_API_KEY") {
      return res.status(500).json({ error: "AI Coach setup is missing. Please add GEMINI_API_KEY in Vercel Environment Variables." });
    }

    if (errorMessage.includes("API key not valid") || errorMessage.includes("403")) {
      return res.status(401).json({ error: "AI Coach API key is invalid. Please verify GEMINI_API_KEY." });
    }

    if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.toLowerCase().includes("quota")) {
      return res.status(429).json({ error: "AI Coach daily limit is reached. Please try again later." });
    }

    if (errorMessage.includes("404") || errorMessage.toLowerCase().includes("not found")) {
      return res.status(404).json({ error: `AI Coach model not found. Check GEMINI_MODEL or use gemini-2.0-flash. Details: ${errorMessage}` });
    }

    res.status(500).json({ error: "AI Coach is currently busy. Please try again in a few minutes." });
  }
});

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
      console.log(`>>> [INFO] Date: ${new Date().toISOString()}`);
      console.log(">>> [INFO] Owner: Manish Bhagat");
    });
  }
};

initServer();

export default app;
