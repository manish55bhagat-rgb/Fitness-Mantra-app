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
            Establishing the operational parameters, legal rights, and fitness guidelines.
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
                1. Fitness Guidance & Medical Disclaimer
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                All nutritional recommendations, meal plans, workout videos, and athletic feedback hosted on the Fitness Mantra platform constitute general wellness and athletic coaching guidance.
              </p>
              <p className="text-white">
                ⚠️ THIS SERVICE DOES NOT PROVIDE MEDICAL TREATMENT, CLINICAL DIAGNOSIS, OR THERAPEUTIC MEDICAL ADVICE.
              </p>
              <p>
                The user assumes 100% individual responsibility for implementing, adhering to, or following any training advice. You MUST consult a qualified medical physician or healthcare provider before commencing any physical exercise regimen or changing dietary habits.
              </p>
            </div>
          </motion.div>

          {/* Account Usage Rules */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-6 h-6 text-neon-green" />
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green italic">
                2. Subscription Access & Misuse
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                Purchasing Starter, Transformation, or Premium Lifestyle subscriptions grants a non-transferable, single-user credential to access custom PDF plans, training logs, and AI coaching.
              </p>
              <p>
                Account sharing, sharing proprietary workout sheets, or selling proprietary diet configurations constitutes misuse of services and is strictly prohibited. Violating these terms will result in immediate termination of the subscription plan with no option for refund.
              </p>
            </div>
          </motion.div>

          {/* Copyright Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <Copyright className="w-6 h-6 text-neon-green" />
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green italic">
                3. Intellectual Property Rights
              </h2>
            </div>
            <div className="space-y-4 text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                All videos, images, branding layouts, web software assets, text assets, calculation logic, and diet schemas are copyrighted works belonging to <span className="text-white">Fitness Mantra</span>.
              </p>
              <p className="text-white">
                All digital content, training material, and coaching resources are owned solely by Manish Bhagat.
              </p>
              <p>
                Unauthorized copying, redistributing, publishing, or reselling of any proprietary guidelines or materials is strictly forbidden and subject to legal action under intellectual property laws.
              </p>
            </div>
          </motion.div>

          {/* Contact Node */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 sm:p-10 border-neon-green/20 text-center"
          >
            <Star className="w-8 h-8 text-neon-green mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight mb-2 italic">Need clarifications on our policies?</h3>
            <p className="text-white/30 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">Send questions or inquiries to Manish Bhagat.</p>
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
