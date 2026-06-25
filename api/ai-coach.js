const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

function buildPrompt(message) {
  return `You are Fitness Mantra AI Coach by Manish Bhagat.
Give simple, safe, practical fitness, diet, workout, BMI, calorie, and habit guidance.
Reply in the user's language. If user writes Marathi, reply in Marathi.
Avoid medical diagnosis. For medical issues, advise consulting a doctor.
Return plain text only.

User question: ${message}`;
}

async function callGemini({ apiKey, model, message }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildPrompt(message.slice(0, 2500)) }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || response.statusText || 'Gemini request failed';
    const error = new Error(`${response.status}: ${message}`);
    error.status = response.status;
    throw error;
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = String(process.env.GEMINI_API_KEY || '')
    .trim()
    .replace(/^['\"]|['\"]$/g, '');

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key missing in Vercel environment variables.' });
  }

  const message = String(req.body?.message || req.body?.query || '').trim();
  if (!message) {
    return res.status(400).json({ error: 'Please type your question first.' });
  }

  let lastError;

  for (const model of MODEL_CANDIDATES) {
    try {
      const reply = await callGemini({ apiKey, model, message });
      return res.status(200).json({ reply, model });
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const msg = String(error?.message || error || '').toLowerCase();
      console.warn(`[AI Coach] ${model} failed: ${error?.message || error}`);

      const canTryNextModel =
        status === 404 ||
        status === 429 ||
        status === 503 ||
        msg.includes('not found') ||
        msg.includes('model') ||
        msg.includes('quota') ||
        msg.includes('overloaded') ||
        msg.includes('unavailable');

      if (!canTryNextModel) break;
    }
  }

  const msg = String(lastError?.message || lastError || '');
  const lower = msg.toLowerCase();

  console.error('[AI Coach Final Error]', msg);

  if (msg.includes('401') || msg.includes('403') || lower.includes('api key') || lower.includes('permission')) {
    return res.status(403).json({ error: 'Gemini API key issue. Please check GEMINI_API_KEY in Vercel.' });
  }

  if (msg.includes('429') || lower.includes('quota') || lower.includes('resource_exhausted')) {
    return res.status(429).json({ error: 'AI limit reached. Please wait 1-2 minutes and try again.' });
  }

  return res.status(500).json({ error: 'AI Coach is busy right now. Please try again once.' });
}
