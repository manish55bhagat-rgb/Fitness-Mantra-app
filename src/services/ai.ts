export async function generateContent(prompt: string, image?: string): Promise<string> {
  const response = await fetch('/api/ai-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: prompt, image })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'AI Coach is currently busy. Please try again in a few minutes.');
  }

  return data.reply || '';
}

export async function* generateContentStream(prompt: string, image?: string) {
  const response = await fetch('/api/ai-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: prompt, image })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'AI Coach is currently busy. Please try again in a few minutes.');
  }

  yield data.reply || '';
}
