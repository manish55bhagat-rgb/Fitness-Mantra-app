import { GoogleGenAI } from '@google/genai';

const MODEL_CANDIDATES = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-pro'
];

function getModelCandidates() {
  const envModel = String(process.env.GEMINI_MODEL || '').trim();
  const allowed = new Set(MODEL_CANDIDATES);

  if (envModel && allowed.has(envModel)) {
    return [envModel, ...MODEL_CANDIDATES.filter((model) => model !== envModel)];
  }

  return MODEL_CANDIDATES;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = String(process.env.GEMINI_API_KEY || '').trim().replace(/^['\"]|['\"]$/g, '');

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key missing in Vercel environment variables.' });
    }

    const message = String(req.body?.message || req.body?.query || '').trim();
    if (!message) {
      return res.status(400).json({ error: 'Please type your question first.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    let lastError;

    for (const model of getModelCandidates()) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ text: message.slice(0, 2500) }],
          config: {
            systemInstruction: 'You are Fitness Mantra AI Coach by Manish Bhagat. Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance. Reply in the user language. If user writes Marathi, reply in Marathi. Avoid medical diagnosis. For medical issues, advise consulting a doctor. Return plain text only.',
            temperature: 0.7,
            maxOutputTokens: 700
          }
        });

        return res.status(200).json({
          reply: response.text || 'Please ask again.',
          model
        });
      } catch (error) {
        lastError = error;
        const msg = String(error?.message || error || '').toLowerCase();
        const isModelError = msg.includes('404') || msg.includes('not found') || msg.includes('model');

        if (!isModelError) {
          break;
        }
      }
    }

    throw lastError;
  } catch (error) {
    const msg = String(error?.message || error || '');
    const lower = msg.toLowerCase();

    console.error('[AI Coach Error]', msg);

    if (msg.includes('429') || lower.includes('quota') || lower.includes('resource_exhausted')) {
      return res.status(429).json({ error: 'AI limit reached. Please try again later.' });
    }

    if (lower.includes('api key') || lower.includes('apikey') || lower.includes('permission') || lower.includes('403')) {
      return res.status(403).json({ error: 'Gemini API key issue. Check GEMINI_API_KEY in Vercel.' });
    }

    if (msg.includes('404') || lower.includes('not found') || lower.includes('model')) {
      return res.status(404).json({ error: 'AI model issue. Remove GEMINI_MODEL from Vercel, then redeploy.' });
    }

    return res.status(500).json({ error: 'AI Coach is busy right now. Please try again once.' });
  }
}
