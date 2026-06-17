import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Scale, Clock, MessageSquare, Plus, Trash2, ShieldCheck, Dumbbell, Star } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Transformation {
  id: string;
  name: string;
  weightLost: string;
  duration: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  quote?: string;
  createdAt?: string;
}

const fallbackStories: Transformation[] = [
  {
    id: "f1",
    name: "Aman Sharma",
    weightLost: "18 KG Fat Loss",
    duration: "12 Weeks Protocols",
    beforePhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    afterPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    quote: "Managed to reverse my metabolic fatty liver under Manish's natural protocols and nutrition adjustments. Completely life changing!"
  },
  {
    id: "f2",
    name: "Rohit Deshmukh",
    weightLost: "12 KG Lean Muscle Gain",
    duration: "16 Weeks Bulk",
    beforePhotoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    afterPhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    quote: "Strictly natural supplementation and targeted density training. Achieved the athletic physique I always worked for!"
  },
  {
    id: "f3",
    name: "Priyanka Patel",
    weightLost: "15 KG Shred & Tone",
    duration: "10 Weeks Metabolic",
    beforePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    afterPhotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    quote: "No starvation, no dangerous weight cutting. Whole food, dense nourishment, and structured progression."
  }
];

export default function SuccessStories() {
  const { profile } = useAuth();
  const [stories, setStories] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for transformations
  useEffect(() => {
    const colRef = collection(db, "transformations");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const list: Transformation[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Transformation);
      });
      // Sort: custom database modifications first, fallback static items otherwise
      setStories(list);
      setLoading(false);
    }, (error) => {
      console.error("Firestore transformations error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalStories = stories.length > 0 ? [...stories, ...fallbackStories] : fallbackStories;

  return (
    <div className="py-24 sm:py-32 bg-deep-black min-h-screen relative overflow-hidden text-white px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-green/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header section with luxurious typography */}
        <header className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-[9px] font-black tracking-[0.45em] text-neon-green uppercase font-mono">100% Natural Hall of Glory</span>
          </motion.div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.9] italic mb-8">
            PHYSICAL <br /><span className="premium-gradient-text uppercase">REVOLUTION</span>
          </h1>
          <p className="text-white/40 text-sm sm:text-base font-semibold uppercase tracking-tight leading-relaxed">
            Real clients, raw progression paths, and scientifically backed natural fitness breakthroughs guided by Manish Bhagat. No shortcuts.
          </p>
        </header>

        {/* Dynamic Gallery */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {totalStories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-panel overflow-hidden border-white/5 hover:border-neon-green/30 transition-all duration-500 bg-white/[0.01] rounded-3xl flex flex-col justify-between group"
              >
                {/* Images side-by-side with high contrast labels */}
                <div className="relative h-64 sm:h-72 flex overflow-hidden border-b border-white/5 bg-black">
                  {/* Before Frame */}
                  <div className="relative w-1/2 h-full border-r border-white/5 overflow-hidden">
                    <img 
                      src={story.beforePhotoUrl} 
                      alt="Before Status" 
                      className="w-full h-full object-cover transition-all duration-700 select-none grayscale opacity-60 group-hover:opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/85 text-[8px] font-bold text-white tracking-widest uppercase rounded">
                      BEFORE
                    </div>
                  </div>

                  {/* After Frame */}
                  <div className="relative w-1/2 h-full overflow-hidden">
                    <img 
                      src={story.afterPhotoUrl} 
                      alt="After Status" 
                      className="w-full h-full object-cover transition-all duration-700 select-none group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-neon-green text-[8px] font-black text-black tracking-widest uppercase rounded">
                      AFTER
                    </div>
                  </div>

                  {/* Weight lost badge overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black border border-neon-green/30 text-neon-green font-black text-[9px] uppercase tracking-widest rounded-xl shadow-glow backdrop-blur-md">
                    {story.weightLost}
                  </div>
                </div>

                {/* Patient Profile / Story Details */}
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic group-hover:text-neon-green transition-colors">
                        {story.name}
                      </h3>
                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-white/30">
                        <Clock className="w-3.5 h-3.5 text-neon-green" />
                        <span>{story.duration}</span>
                      </div>
                    </div>

                    {story.quote && (
                      <p className="text-white/50 text-[11px] leading-relaxed font-semibold uppercase tracking-tight italic mb-6 border-l-2 border-white/10 pl-4">
                        "{story.quote}"
                      </p>
                    )}
                  </div>

                  {/* Small metadata badges */}
                  <div className="flex gap-2 mt-2 pt-6 border-t border-white/5">
                    <span className="px-3 py-1 rounded bg-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-neon-green" /> Weight Checked
                    </span>
                    <span className="px-3 py-1 rounded bg-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
                      <Dumbbell className="w-3 h-3 text-neon-green" /> Natural Protocol
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Visual Call To Action Block */}
        <section className="mt-32 max-w-4xl mx-auto glass-panel p-8 sm:p-12 border-neon-green/15 rounded-3xl relative overflow-hidden bg-neon-green/[1%] text-center">
          <div className="absolute inset-0 os-grid opacity-10" />
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight italic mb-4">
            WANT TO BE THE NEXT <span className="text-neon-green">SUCCESS STORY</span>?
          </h2>
          <p className="text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight max-w-xl mx-auto mb-8">
            Begin with a customized diet setup, direct coaching checkpoints, and biometric monitoring. Fully natural fat loss & muscle gain protocols tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/#consult-form" 
              className="px-8 py-4 bg-neon-green text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-[0_10px_20px_rgba(57,255,20,0.3)] transition-all cursor-pointer"
            >
              Book Consultation Form
            </Link>
            <a 
              href="https://wa.me/919765690437?text=Hi%20Manish,%20I%20am%20inspired%20by%20the%20Fitness%20Mantra%20transformations.%20I%20want%20to%20start%20my%20own%20journey."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat on WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
