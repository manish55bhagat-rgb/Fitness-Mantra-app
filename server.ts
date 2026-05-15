import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  const getAIModel = () => {
    let apiKey = process.env.GEMINI_API_KEY;
    // Clean potential issues with the key if it was pasted with quotes or spaces
    if (apiKey) {
      apiKey = apiKey.trim().replace(/^["'](.+)["']$/, '$1');
    }

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
      throw new Error("MISSING_API_KEY");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 2000,
      }
    });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", owner: "Manish Bhagat", brand: "Fitness Mantra" });
  });

  app.post("/api/ai/chat", async (req, res) => {
    const { query, image } = req.body;
    
    if (!query && !image) {
      return res.status(400).json({ error: "Query or image is required" });
    }

    try {
      const model = getAIModel();
      const timestamp = new Date().toISOString();
      
      const isDataRequest = query?.toLowerCase().includes("json") || query?.toLowerCase().includes("biometrics");

      const prompt = `System Protocol: MANTRANEURAL_INIT [${timestamp}]
Agent Identity: Mantra Neural (Elite Professional AI Fitness Architect)
Creator Authority: Manish Bhagat
Environment: Fitness Mantra Platform

Primary Directive: Deliver high-performance, precision fitness and nutritional engineering.

Tone/Voice Parameters:
- Futuristic, authoritative, precise.
- Use scientific lexicon.
${isDataRequest ? "- CRITICAL: Follow formatting instructions EXACTLY. Output only valid data as requested." : "- Keep output impactful and concise."}
- DO NOT repeat previous phrasing. Contextually fresh output required.

User Transmission: ${query || "Analyze this visual data."}

Response:`;

      let parts: any[] = [prompt];
      if (image) {
        // Assume image is base64 string like "data:image/jpeg;base64,..."
        const [mimeInfo, base64Data] = image.split(",");
        const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        });
      }

      const result = await model.generateContentStream(parts);

      // Set headers for streaming
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        res.write(chunkText);
      }

      res.end();
    } catch (error: any) {
      console.error("AI Error:", error);
      if (error.message === "MISSING_API_KEY") {
        res.status(500).json({ error: "CRITICAL: Gemini API Key is missing. Click 'Settings' (gear icon) -> 'Secrets' -> Add 'GEMINI_API_KEY' with your key from aistudio.google.com/app/apikey" });
      } else {
        res.status(500).json({ error: "Sorry, AI Coach is temporarily unavailable." });
      }
    }
  });

  // Vite integration
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
    console.log(`>>> Fitness Mantra running at http://localhost:${PORT}`);
    console.log(`>>> Owner: Manish Bhagat`);
  });
}

startServer();
