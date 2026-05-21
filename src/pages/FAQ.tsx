import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Shield, Zap } from "lucide-react";

const faqs = [
  {
    q: "IS FITNESS MANTRA ONLY FOR ELITE ATHLETES?",
    a: "No. Our neural protocols are scalable. The intelligence adjusts based on your current biological baseline, whether you're a baseline novice or a high-performance athlete."
  },
  {
    q: "HOW DOES THE AI FORM GUIDANCE WORK?",
    a: "Our system uses advanced computer vision to analyze your form in real-time. It compares your biomechanics against our golden-standard 3D models to ensure 100% precision and injury prevention."
  },
  {
    q: "CAN I SYNC MY BIOMETRIC WEARABLES?",
    a: "Fitness Mantra supports seamless integration with WHOOP, Apple Health, and Oura Ring to provide a unified physiological overview. (Feature available for Architect Elite subscribers)."
  },
  {
    q: "IS THE DIET PLAN COMPATIBLE WITH VEGETARIAN PROTOCOLS?",
    a: "Absolutely. Our 'Vedic Shred' and 'Apex Bulk' modules include optimized Indian vegetarian options focused on complete amino-acid profiles and bio-available nutrients."
  },
  {
    q: "HOW OFTEN ARE NEW 3D MODULES ADDED?",
    a: "Our developers and trainers release new high-fidelity exercise modules every month, ensuring your training architecture remains at the cutting edge of science."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10">
            <HelpCircle className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Knowledge Protocol</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-10 italic">
            Common<br/><span className="premium-gradient-text uppercase italic">Queries</span>
          </h1>
          <p className="text-white/40 text-lg font-semibold uppercase tracking-tight leading-relaxed max-w-xl mx-auto">
            Deciphering the elite architecture of the Fitness Mantra ecosystem.
          </p>
        </header>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`glass-panel overflow-hidden border-white/5 transition-all duration-500 ${openIdx === idx ? 'border-neon-green/30 bg-neon-green/[0.02]' : 'hover:border-white/10'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-10 flex items-center justify-between text-left group"
              >
                <span className={`text-xl font-display font-black uppercase tracking-tighter transition-colors ${openIdx === idx ? 'text-neon-green' : 'text-white/60 group-hover:text-white'}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${openIdx === idx ? 'rotate-180 text-neon-green' : 'text-white/20'}`} />
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-10 pb-10">
                      <div className="h-px w-full bg-white/5 mb-8" />
                      <p className="text-white/40 text-lg font-semibold uppercase tracking-tight leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-24 glass-panel p-12 border-neon-green/10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-neon-green/[0.01] animate-pulse-soft" />
          <Zap className="w-12 h-12 text-neon-green mx-auto mb-8 animate-pulse-neon" />
          <h3 className="text-3xl font-display font-black uppercase mb-4 italic">Still Have Questions?</h3>
          <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-10">INITIALIZE A DIRECT PORTAL TO OUR ARCHITECTS.</p>
          <button className="btn-premium px-12 py-5 text-[10px]">CONTACT SUPPORT</button>
        </div>
      </div>
    </div>
  );
}
