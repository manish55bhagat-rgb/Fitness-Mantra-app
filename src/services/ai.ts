export async function generateContent(prompt: string, image?: string) {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt, image }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Neural link failed");
    }

    return await response.text();
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function* generateContentStream(prompt: string, image?: string) {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt, image }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Neural link failed");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    }
  } catch (error: any) {
    console.error("AI Stream Error:", error);
    throw error;
  }
}
