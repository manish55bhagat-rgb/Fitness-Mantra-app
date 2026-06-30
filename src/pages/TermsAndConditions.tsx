import { motion } from "motion/react";
import { ShieldAlert, BookOpen, UserCheck, Copyright, Mail, Star } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="py-24 sm:py-32 md:py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/2 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-16 sm:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-8 sm:mb-10"
          >
            <BookOpen className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Usage Protocol</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8 sm:mb-10 italic">
            Terms &<br/><span className="premium-gradient-text uppercase italic">Conditions</span>
          </h1>
          
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-tight leading-relaxed max-w-xl mx-auto">
            Establishing the terms, user responsibilities, and wellness boundaries of Fitness Mantra.
          </p>
        </header>

        <div className="space-y-8">
          {/* Medical Disclaimer Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 border-red-500/10 bg-red-500/[0.01]"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-neon-green" />
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-white italic">
                1. General Guidance Disclaimer
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p className="text-white">
                Fitness Mantra provides general fitness guidance, workout recommendations, lifestyle guidance, general nutrition guidance, and healthy habit recommendations only.
              </p>
              <p>
                Our services, meal layouts, physical exercise recommendations, and coaching are provided solely for educational and informational support. They do not constitute professional healthcare advice or clinical evaluation.
              </p>
              <p className="text-white">
                ⚠️ CONSULT A QUALIFIED HEALTHCARE PROFESSIONAL BEFORE STARTING ANY DIET OR EXERCISE PROGRAM.
              </p>
            </div>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-neon-green" />
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green italic">
                2. Limitation of Liability
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                Fitness Mantra and Manish Bhagat are not responsible or liable for any physical injuries, allergies, food sensitivities, medical complications, or health issues resulting from improper use of workouts, general nutrition guidelines, healthy habit templates, or general fitness recommendations.
              </p>
              <p>
                By using this website and utilizing our guidance plans, you voluntarily assume all associated risks and agree to hold Fitness Mantra and its owner harmless from any claims.
              </p>
            </div>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-6 h-6 text-neon-green" />
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green italic">
                3. User Account, Accuracy & Suspension
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                Users are solely responsible for providing accurate, current, and truthful physiological information (such as weight, height, age, and existing physical limitations) to enable safe general wellness recommendations.
              </p>
              <p>
                Subscription accounts and coaching access details are exclusively for single-user personal consumption. Accounts may be suspended or permanently terminated for misuse, including sharing private guidance templates, redistributing materials, or attempting unauthorized access to site infrastructure.
              </p>
            </div>
          </motion.div>

          {/* Copyright Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <Copyright className="w-6 h-6 text-neon-green" />
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green italic">
                4. Intellectual Property Rights
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                All videos, images, layout designs, digital materials, and general guides on this platform are copyrighted works belonging to <span className="text-white">Fitness Mantra</span>.
              </p>
              <p className="text-white">
                All digital content, training material, and coaching resources are owned solely by Manish Bhagat.
              </p>
              <p>
                No copying, reproduction, or redistribution of any proprietary templates or wellness guidelines is permitted without explicit prior written permission from Manish Bhagat.
              </p>
            </div>
          </motion.div>

          {/* Governing Law at the END - ONLY two lines as requested */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl text-center"
          >
            <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wide leading-relaxed">
              These Terms & Conditions are governed by the laws of India.<br />
              Any disputes shall be subject to the jurisdiction of the competent courts in Ahilyanagar, Maharashtra.
            </p>
          </motion.div>

          {/* Contact Node */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel p-6 sm:p-10 border-neon-green/20 text-center"
          >
            <Star className="w-8 h-8 text-neon-green mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight mb-2 italic">Support & Contact</h3>
            <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Manish Bhagat</p>
            <p className="text-white/30 text-[9px] sm:text-[11px] uppercase tracking-widest mb-6 leading-relaxed">
              Sangamner, Ahilyanagar, Maharashtra, India
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neon-green text-black font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <Mail className="w-4 h-4" />
              <a href="mailto:manish55bhagat@gmail.com">manish55bhagat@gmail.com</a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
