import React, { useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

function cleanText(text: string) {
  return String(text || "")
    .replace(/^#+\s*(.*?)$/gm, "$1")
    .replace(/\*\*([\s\S]*?)\*\*/g, "$1")
    .replace(/__([\s\S]*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getAiCoachEndpoint() {
  if (typeof window === "undefined") return "/api/ai-coach";
  return `${window.location.origin}/api/ai-coach?t=${Date.now()}`;
}

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello! I am your Fitness Mantra AI Coach. Ask me about diet, workout, fat loss, BMI, calories or fitness habits.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = (overrideQuery || query).trim();
    if (!activeQuery || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: activeQuery }, { role: "ai", content: "AI Coach is thinking..." }]);
    setQuery("");
    setLoading(true);

    let finalReply = "";

    try {
      const response = await fetch(getAiCoachEndpoint(), {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "X-Fitness-Mantra-Client": "mobile-safe",
        },
        body: JSON.stringify({ message: activeQuery }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && data?.reply) {
        finalReply = cleanText(data.reply);
      } else {
        finalReply = data?.error || `AI Coach server error. Status: ${response.status}`;
      }
    } catch (error: any) {
      finalReply = error?.message || "AI Coach network error. Please try again.";
    }

    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { role: "ai", content: finalReply };
      return next;
    });
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-3 py-6 md:px-6 md:py-10 text-white">
      <div className="mx-auto flex h-[calc(100dvh-140px)] max-w-5xl flex-col rounded-[32px] border border-white/10 bg-black/50 p-4 shadow-2xl backdrop-blur-3xl md:p-6">
        <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon-green/40 bg-neon-green/10 text-neon-green">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green">Fitness Mantra AI</p>
            <h1 className="text-2xl font-black uppercase md:text-4xl">AI Fitness Coach</h1>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-white/5 bg-white/[0.03] p-3 md:p-5">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] whitespace-pre-wrap rounded-3xl p-4 text-sm font-semibold leading-relaxed md:text-base ${msg.role === "user" ? "bg-white text-black" : "border border-white/10 bg-white/[0.04] text-white"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <p className="text-xs font-bold uppercase tracking-[0.2em] text-neon-green">Thinking...</p>}
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Ask about diet, workout, weight loss..."
            className="flex-1 rounded-full border border-white/10 bg-black/70 px-5 py-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-neon-green/50 disabled:opacity-50 md:px-7"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-green text-black shadow-[0_0_25px_rgba(57,255,20,0.35)] transition disabled:opacity-40"
          >
            <Send className="h-6 w-6" />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {["Fat loss plan", "Workout suggestion", "Diet support", "BMI help"].map((hint) => (
            <button key={hint} onClick={() => handleSearch(undefined, hint)} disabled={loading} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:border-neon-green/40 hover:text-neon-green disabled:opacity-40">
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
