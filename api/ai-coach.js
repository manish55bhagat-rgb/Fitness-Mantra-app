import { GoogleGenAI } from '@google/genai';

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-1.5-flash'
].filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key missing in Vercel environment variables.' });
    }

    const message = String(req.body?.message || req.body?.query || '').trim();
    if (!message) {
      return res.status(400).json({ error: 'Please type your question first.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    let lastError;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ text: message.slice(0, 2500) }],
          config: {
            systemInstruction: 'You are Fitness Mantra AI Coach by Manish Bhagat. Give simple safe fitness and diet guidance. Reply in the user language. Avoid medical diagnosis. Return plain text only.',
            temperature: 0.7,
            maxOutputTokens: 700
          }
        });

        return res.status(200).json({ reply: response.text || 'Please ask again.', model });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  } catch (error) {
    const msg = String(error?.message || error || '');
    const lower = msg.toLowerCase();

    if (msg.includes('429') || lower.includes('quota')) {
      return res.status(429).json({ error: 'AI limit reached. Please try again later.' });
    }
    if (msg.includes('404') || lower.includes('not found')) {
      return res.status(404).json({ error: 'AI model issue. In Vercel set GEMINI_MODEL=gemini-2.0-flash or remove GEMINI_MODEL to use default fallback.' });
    }
    if (lower.includes('api key')) {
      return res.status(403).json({ error: 'Gemini API key issue. Check GEMINI_API_KEY in Vercel.' });
    }

    return res.status(500).json({ error: 'AI Coach is busy right now. Please try again once.' });
  }
}
