export async function generateContent(prompt: string, image?: string) {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt, image }),
    });

    if (!response.ok) {
      let errMsg = "Neural link failed";
      try {
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          errMsg = parsed.error || errMsg;
        } catch {
          if (text.trim().startsWith("<")) {
            errMsg = `Server encountered an internal error (${response.status}). Please verify that GEMINI_API_KEY is configured in Settings -> Secrets.`;
          } else {
            errMsg = text.slice(0, 300) || `HTTP Error ${response.status}: ${response.statusText}`;
          }
        }
      } catch (e) {
        errMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errMsg);
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
      let errMsg = "Neural link failed";
      try {
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          errMsg = parsed.error || errMsg;
        } catch {
          if (text.trim().startsWith("<")) {
            errMsg = `Server encountered an internal error (${response.status}). Please verify that GEMINI_API_KEY is configured in Settings -> Secrets.`;
          } else {
            errMsg = text.slice(0, 300) || `HTTP Error ${response.status}: ${response.statusText}`;
          }
        }
      } catch (e) {
        errMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errMsg);
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
