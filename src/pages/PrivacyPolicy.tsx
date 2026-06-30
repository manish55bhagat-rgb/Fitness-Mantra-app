import { motion } from "motion/react";
import { Shield, Sparkles, Mail, Lock, CheckCircle, Database } from "lucide-react";

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
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Security Protocol</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8 sm:mb-10 italic">
            Privacy<br/><span className="premium-gradient-text uppercase italic">Policy</span>
          </h1>
          
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-tight leading-relaxed max-w-xl mx-auto">
            Ensuring ultimate security and integrity of your biometric and physiological intelligence.
          </p>
        </header>

        <div className="space-y-8">
          {/* Introduction Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              1. Information Collection
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              To architect your natural body transformation, Fitness Mantra gathers specialized biometric datasets.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Full Name",
                "Email Address",
                "Phone Number",
                "WhatsApp Number",
                "Height (cm)",
                "Weight (kg)",
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

          {/* Use of Information */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              2. Utilization Matrix
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              Your physiological telemetry and identifiers are strictly processed for custom athletic protocols:
            </p>
            
            <ul className="space-y-4">
              {[
                { title: "Fitness Consultation", desc: "Evaluating baseline physical conditioning and custom biomechanical guidelines." },
                { title: "Diet Plan Preparation", desc: "Formulating Vedic Shred, Apex Bulk, or custom nutritional micro-targets." },
                { title: "Workout Recommendations", desc: "Constructing targeted training routines and motion protocols." },
                { title: "Customer Support", desc: "Providing priority portal channels and answering physiological queries." }
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

          {/* Security & Firebase */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sm:p-10 border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Database className="w-24 h-24 text-neon-green" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic flex items-center gap-3">
              <Lock className="w-6 h-6 text-neon-green" /> Secure Data Storage
            </h2>
            <div className="space-y-4 text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                We do not sell, rent, or lease your personal biometric parameters or contact telemetry to third-party brokers.
              </p>
              <p>
                All user records are securely stored on <span className="text-white">Firebase (Firestore Database)</span> utilizing strict security rules, token-based verification protocols, and end-to-end transport layer encryption.
              </p>
            </div>
          </motion.div>

          {/* Contact node */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 sm:p-10 border-neon-green/20 text-center"
          >
            <Sparkles className="w-8 h-8 text-neon-green mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight mb-2 italic">Have questions regarding your data?</h3>
            <p className="text-white/30 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">Initialize contact directly with Manish Bhagat.</p>
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
