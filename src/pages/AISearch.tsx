import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Bot, Sparkles, MessageSquare, Activity, ShieldCheck, Zap, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { generateContentStream } from "../services/ai";
import { compressImage } from "../lib/imageCompressor";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  image?: string;
}

function formatResponseText(text: string): string {
  if (!text) return "";
  
  if (text === "AI Coach is thinking...") {
    return text;
  }

  let cleaned = text
    .replace(/^#+\s*(.*?)$/gm, "$1")
    .replace(/\*\*([\s\S]*?)\*\*/g, "$1")
    .replace(/__([\s\S]*?)__/g, "$1")
    .replace(/\*([\s\S]*?)\*/g, "$1")
    .replace(/_([\s\S]*?)_/g, "$1")
    .replace(/^\s*[\*\-]\s+/gm, "• ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[\-\*_]{3,}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned;
}

function getAiCoachEndpoint(): string {
  if (typeof window === "undefined") return "/api/ai-coach";
  return `${window.location.origin}/api/ai-coach?t=${Date.now()}`;
}

function getFallbackCoachReply(message: string): string {
  const msg = message.toLowerCase();
  const isMarathi = /[\u0900-\u097F]/.test(message) || msg.includes("mde") || msg.includes("marathi");

  if (isMarathi) {
    return "Fitness Mantra Coach\n\nसध्या AI server response मिळायला वेळ लागत आहे, पण basic safe guide:\n\n• रोज 30 ते 45 मिनिटे चालणे\n• प्रत्येक meal मध्ये protein ठेवा\n• गोड, तळलेले आणि cold drinks कमी करा\n• पाणी 2 ते 3 लिटर\n• झोप 7 ते 8 तास\n• Workout हळूहळू सुरू करा\n\nतुमचं age, height, weight, goal आणि diet preference दिलं तर मी specific guide देऊ शकतो.\n\nहे general fitness guidance आहे, medical advice नाही.";
  }

  if (msg.includes("diet") || msg.includes("fat") || msg.includes("weight") || msg.includes("calorie")) {
    return "Fitness Mantra Coach\n\nAI server response is slow right now, but here is a safe basic fat-loss guide:\n\nMorning: Water + oats, poha, upma, eggs, sprouts or dal chilla.\n\nLunch: Roti/bhakri + dal/usal/paneer/egg/chicken + vegetables + salad.\n\nEvening: Fruit, roasted chana, curd or tea without sugar.\n\nDinner: Keep it light. Avoid fried food, sweets, bakery items and cold drinks.\n\nDaily target: 30 to 45 minutes walking, 2 to 3 liters water, and 7 to 8 hours sleep.\n\nThis is general fitness guidance only.";
  }

  return "Fitness Mantra Coach\n\nAI server response is slow right now, but here is a safe basic guide:\n\n• Walk 30 to 45 minutes daily\n• Eat protein in every meal\n• Keep vegetables and salad in lunch/dinner\n• Reduce sugar, fried food and cold drinks\n• Drink 2 to 3 liters water\n• Sleep 7 to 8 hours\n• Train 4 to 5 days per week with light progression\n\nShare your age, height, weight, goal and diet preference for a more specific plan.\n\nThis is general fitness guidance only.";
}

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I am your Fitness Mantra AI Companion, trained under Manish Bhagat. I am here to help you design personalized workout routines, natural diet plans, calculate BMI or calories, and support your natural transformation journey. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const compressed = await compressImage(base64);
          setSelectedImage(compressed);
        } catch (err) {
          console.error("Compression failed", err);
          setSelectedImage(base64);
        } finally {
          setIsCompressing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = overrideQuery || query;
    if ((!activeQuery.trim() && !selectedImage) || loading) return;

    const currentImage = selectedImage;

    const userMsg: Message = {
      role: "user",
      content: activeQuery,
      timestamp: new Date(),
      image: currentImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    setLoading(true);

    const aiMsg: Message = {
      role: "ai",
      content: "AI Coach is thinking...",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const response = await fetch(getAiCoachEndpoint(), {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "X-Fitness-Mantra-Client": "mobile-safe"
        },
        body: JSON.stringify({
          message: activeQuery,
          image: currentImage || undefined
        }),
      });

      let reply = "";

      try {
        const data = await response.json();
        reply = data?.reply || data?.error || "";
      } catch {
        reply = "";
      }

      if (!response.ok || !reply) {
        reply = getFallbackCoachReply(activeQuery);
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          content: reply
        };
        return next;
      });

      setLoading(false);
    } catch (error: any) {
      console.error("AI Coach Endpoint Error:", error);
      setLoading(false);
      
      const userFriendlyMsg = getFallbackCoachReply(activeQuery);
      
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          content: userFriendlyMsg
        };
        return next;
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-2 md:pt-8 pb-4 md:pb-8 px-2 md:px-4 relative overflow-hidden flex flex-col justify-start">
      <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100dvh-130px)] md:h-[80vh] relative">
        <div className="flex flex-row items-center justify-between mb-3 md:mb-6 px-2 md:px-6 gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative group">
              <div className="absolute inset-[-4px] bg-neon-green opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-xl md:rounded-2xl" />
              <div className="relative w-11 h-11 md:w-16 md:h-16 bg-os-black/80 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.2)] md:shadow-[0_0_30px_rgba(57,255,20,0.3)] border border-neon-green/30">
                <Bot className="w-6 h-6 md:w-9 md:h-9" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1.5">
                <span className="text-[8px] md:text-[10px] bg-neon-green/20 text-neon-green px-1.5 py-0.5 rounded-sm font-black tracking-widest uppercase border border-neon-green/20 animate-pulse">Coach Online</span>
                <span className="text-[8px] md:text-[10px] text-white/30 font-bold tracking-widest uppercase font-mono">FITNESS MANTRA AI</span>
              </div>
              <h1 className="text-xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none group cursor-default">
                AI FITNESS <span className="text-neon-green italic group-hover:drop-shadow-[0_0_20px_rgba(57,255,20,0.6)] transition-all">COACH</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
              <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 text-neon-green animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-neon-green/80 font-mono">Sync Ratio: 1.00</span>
            </div>
            <div className="w-20 md:w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeOut" }} className="h-full bg-neon-green shadow-[0_0_15px_#39FF14]" />
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto mb-3 md:mb-6 p-3 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide bg-os-black/40 backdrop-blur-[60px] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] rounded-2xl md:rounded-[40px] border border-white/5 neon-border outline-offset-8">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`relative max-w-[90%] sm:max-w-[85%] p-4 sm:p-6 rounded-3xl ${msg.role === "user" ? "bg-white text-black font-extrabold rounded-tr-sm shadow-[0_20px_50px_rgba(255,255,255,0.1)]" : "bg-white/[0.03] border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-2xl shadow-2xl"}`}>
                  {msg.role === "ai" && <div className="absolute -left-3 -top-3"><Sparkles className="w-5 h-5 text-neon-green animate-glow" /></div>}
                  {msg.image && <div className="mb-4 overflow-hidden rounded-2xl border border-black/10"><img src={msg.image} alt="Uplink Data" className="w-full max-h-60 object-cover" referrerPolicy="no-referrer" /></div>}
                  <p className="text-sm sm:text-base leading-snug sm:leading-relaxed font-semibold tracking-tight whitespace-pre-wrap">{formatResponseText(msg.content)}</p>
                  <div className={`flex items-center gap-2 mt-4 sm:mt-5 opacity-40 font-mono tracking-widest text-[9px] ${msg.role === "user" ? "text-black" : "text-neon-green"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="uppercase text-[8px] tracking-[0.2em] font-black">{msg.role === "user" ? "User Message" : "Coach Reply"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start animate-fade-in">
                <div className="bg-neon-green/[0.03] border border-neon-green/25 p-6 rounded-3xl rounded-tl-sm flex flex-col gap-3 min-w-[280px] backdrop-blur-3xl relative overflow-hidden group shadow-[0_0_30px_rgba(57,255,20,0.05)]">
                  <div className="absolute inset-0 bg-neon-green/5 animate-pulse" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-neon-green rounded-full animate-bounce shadow-[0_0_15px_#39FF14]" />
                      <div className="w-2.5 h-2.5 bg-neon-green rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_15px_#39FF14]" />
                      <div className="w-2.5 h-2.5 bg-neon-green rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_15px_#39FF14]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green/90 ml-1 animate-pulse leading-none font-mono">Thinking...</span>
                  </div>
                  <div className="text-[9px] text-white/40 font-mono uppercase tracking-[0.2em] flex items-center gap-2 relative z-10"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /><span>Reviewing plan guidelines...</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative bottom-0 px-1 md:px-2 group">
          <AnimatePresence>
            {selectedImage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-4 md:left-10 mb-2 md:mb-4 p-1.5 md:p-2 bg-os-black/80 backdrop-blur-3xl border border-neon-green/30 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 animate-glow">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-white/10"><img src={selectedImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div>
                <div className="flex flex-col pr-2 md:pr-4"><span className="text-[7px] md:text-[8px] font-black uppercase text-neon-green tracking-widest font-mono">Image Loaded</span><span className="text-[9px] md:text-[10px] text-white/50 font-mono tracking-tighter">SPECIMEN.JPG</span></div>
                <button onClick={clearImage} className="w-5 h-5 md:w-6 md:h-6 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><X className="w-3.5 h-3.5 text-white" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-x-0 inset-y-0 bg-neon-green/5 blur-3xl group-focus-within:bg-neon-green/10 transition-all rounded-[30px]" />
          <form onSubmit={handleSearch} className="relative flex items-center gap-3 md:gap-4">
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            <div className="relative flex-1 group/input">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} disabled={loading} placeholder="Ask our AI Coach about exercises, diet, or weight loss..." className="w-full bg-os-black/60 border border-white/10 rounded-[30px] px-5 md:px-10 py-4 md:py-6 pr-24 md:pr-32 text-xs md:text-base font-semibold focus:outline-none focus:border-neon-green/40 focus:ring-4 focus:ring-neon-green/5 transition-all placeholder:text-white/20 backdrop-blur-3xl shadow-2xl text-white font-sans disabled:opacity-50" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className={`absolute right-14 md:right-20 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${selectedImage ? "text-neon-green bg-neon-green/10 shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "text-white/30 hover:text-white hover:bg-white/5"} disabled:opacity-30`}><ImageIcon className="w-5 h-5 md:w-6 md:h-6" /></button>
              <button type="submit" disabled={(!query.trim() && !selectedImage) || loading} className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-neon-green text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-[0_10px_30px_rgba(57,255,20,0.4)]"><Send className="w-5 h-5 md:w-6 md:h-6" /></button>
            </div>
          </form>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-3 mt-3 md:mt-6 justify-center">
          {["Custom Diet Support", "Safe Supplement Stack", "Workout Suggestion", "Rest & Recovery"].map((hint) => (
            <button key={hint} onClick={() => handleSearch(undefined, hint)} className="group relative">
              <div className="absolute inset-0 bg-neon-green/0 group-hover:bg-neon-green/10 blur-xl transition-all rounded-full" />
              <div className="relative text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 hover:text-neon-green transition-all bg-white/[0.03] px-3 md:px-6 py-2 md:py-3 rounded-full border border-white/5 backdrop-blur-md group-hover:border-neon-green/30 font-mono">{hint}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
