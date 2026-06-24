import { GoogleGenAI } from '@google/genai';

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
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      contents: [{ text: message }],
      config: {
        systemInstruction: 'You are Fitness Mantra AI Coach by Manish Bhagat. Give simple safe fitness and diet guidance. Reply in the user language. Avoid medical diagnosis. Return plain text only.',
        temperature: 0.7,
        maxOutputTokens: 700
      }
    });

    return res.status(200).json({ reply: response.text || 'Please ask again.' });
  } catch (error) {
    const msg = String(error?.message || error || '');
    if (msg.includes('429') || msg.toLowerCase().includes('quota')) {
      return res.status(429).json({ error: 'AI limit reached. Please try again later.' });
    }
    if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
      return res.status(404).json({ error: 'AI model issue. Set GEMINI_MODEL=gemini-1.5-flash in Vercel.' });
    }
    return res.status(500).json({ error: 'AI Coach is busy right now. Please try again once.' });
  }
}
