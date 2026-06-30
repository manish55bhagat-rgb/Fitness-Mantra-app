import { motion } from "motion/react";
import { Ban, Mail, AlertTriangle, CheckCircle, Flame } from "lucide-react";

export default function CancellationPolicy() {
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
            <Ban className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Service Protocol</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8 sm:mb-10 italic">
            Cancellation<br/><span className="premium-gradient-text uppercase italic">Policy</span>
          </h1>
          
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-tight leading-relaxed max-w-xl mx-auto">
            Clear directives defining service cancellation eligibility and support procedures.
          </p>
        </header>

        <div className="space-y-8">
          {/* Services Offered */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              1. Digital Service Offerings
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              Fitness Mantra provides high-quality, professional digital fitness services including online consultations, personalized diet plans, workout plans and premium memberships.
            </p>
          </motion.div>

          {/* Cancellation Criteria */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              2. Eligibility & Limitations
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              Please review our parameters regarding the cancellation of services carefully:
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-neon-green/[0.02] border border-neon-green/10">
                <CheckCircle className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">Eligible Cancellation:</h3>
                  <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-tight leading-relaxed mt-1">
                    Cancellation requests are accepted <span className="text-white font-bold">only before</span> a service has been started or activated.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">Non-Cancellable Services:</h3>
                  <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-tight leading-relaxed mt-1">
                    Once a personalized diet plan, workout plan, consultation, premium membership or any digital service has been delivered or activated, cancellation requests <span className="text-white font-bold">cannot be accepted</span>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical and Billing Support */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              3. Payment & Billing Discrepancies
            </h2>
            <div className="space-y-4 text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                If a payment is deducted due to a technical issue or duplicate transaction, please contact us immediately with transaction proof.
              </p>
              <p className="text-white">
                ⏱️ REVIEW TIMELINE: ELIGIBLE CASES WILL BE REVIEWED WITHIN 5 TO 7 WORKING DAYS.
              </p>
            </div>
          </motion.div>

          {/* Contact Node */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sm:p-10 border-neon-green/20 text-center"
          >
            <Flame className="w-8 h-8 text-neon-green mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight mb-2 italic">Cancellation Assistance</h3>
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
