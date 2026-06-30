import { motion } from "motion/react";
import { Shield, Sparkles, Mail, Lock, CheckCircle } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Privacy Protocol</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8 sm:mb-10 italic">
            Privacy<br/><span className="premium-gradient-text uppercase italic">Policy</span>
          </h1>
          
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-tight leading-relaxed max-w-xl mx-auto">
            Ensuring the safety, confidentiality, and integrity of your self-reported wellness data.
          </p>
        </header>

        <div className="space-y-8">
          {/* 1. Information We Collect */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              1. Information We Collect
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              To provide personalized guidance, we collect the following information voluntarily provided by you:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Name",
                "Email Address",
                "Phone Number",
                "WhatsApp Number",
                "Height",
                "Weight",
                "Fitness Goal",
                "Medical Information"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-neon-green shrink-0" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2. How We Use It */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              2. How We Use It
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              Your self-reported information is used solely to deliver premium guidance and support:
            </p>
            
            <ul className="space-y-4">
              {[
                { title: "Fitness Consultation", desc: "Understanding your current fitness level and wellness objectives." },
                { title: "Diet Plan Preparation", desc: "Crafting customized general nutrition templates and general meal structures." },
                { title: "Workout Recommendations", desc: "Designing personalized general workout recommendations and routine guidelines." },
                { title: "Customer Support", desc: "Answering your inquiries, helping you navigate your subscription, and providing assistance." }
              ].map((item, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded bg-neon-green/20 flex items-center justify-center shrink-0 mt-0.5 text-neon-green font-mono text-[10px] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">{item.title}</h3>
                    <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-tight mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3. Data Protection */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic flex items-center gap-3">
              <Lock className="w-6 h-6 text-neon-green" /> 3. Data Protection
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              We use appropriate security measures to help protect your personal information against unauthorized access, disclosure, alteration, or destruction.
            </p>
          </motion.div>

          {/* 4. Data Sharing */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              4. Data Sharing
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              We respect your privacy. Your personal information and wellness datasets are <span className="text-white">never sold, rented, or traded to third parties</span>. We only share information as necessary with service partners who help operate our services and support your journey, under strict confidentiality agreements.
            </p>
          </motion.div>

          {/* 5. User Rights */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              5. User Rights
            </h2>
            <div className="space-y-4 text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                You retain complete control over your self-reported data. You have the right to access, correct, or update your personal parameters at any time.
              </p>
              <div className="p-4 rounded-xl bg-neon-green/[0.02] border border-neon-green/10">
                <p className="text-white text-xs sm:text-sm font-bold">
                  🗑️ Profile & Data Deletion
                </p>
                <p className="mt-1">
                  You may request the permanent deletion of your personal information at any time by contacting us directly at <span className="text-white font-bold">manish55bhagat@gmail.com</span>. We will process your deletion request promptly.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 6. Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 sm:p-10 border-neon-green/20 text-center"
          >
            <Sparkles className="w-8 h-8 text-neon-green mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight mb-2 italic">6. Contact Information</h3>
            <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Manish Bhagat - Fitness Mantra</p>
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
