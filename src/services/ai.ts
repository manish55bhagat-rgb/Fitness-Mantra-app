export async function generateContent(prompt: string, image?: string): Promise<string> {
  try {
    const response = await fetch("/api/ai-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt, image }),
    });

    if (!response.ok) {
      let errMsg = "AI Coach is currently busy. Please try again in a few minutes.";
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

    const data = await response.json();
    return data.reply;
  } catch (error: any) {
    console.error("AI Generation Error calling /api/ai-coach:", error);
    throw error;
  }
}

export async function* generateContentStream(prompt: string, image?: string) {
  try {
    const response = await fetch("/api/ai-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt, image }),
    });

    if (!response.ok) {
      let errMsg = "AI Coach is currently busy. Please try again in a few minutes.";
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

    const data = await response.json();
    yield data.reply || "";
  } catch (error: any) {
    console.error("AI Stream Error calling /api/ai-coach:", error);
    throw error;
  }
}
