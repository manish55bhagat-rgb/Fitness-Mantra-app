import { motion } from "motion/react";
import { RefreshCw, HelpCircle, Mail, AlertTriangle, CheckCircle, Flame } from "lucide-react";

export default function RefundPolicy() {
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
            <RefreshCw className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Financial Protocol</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8 sm:mb-10 italic">
            Refund<br/><span className="premium-gradient-text uppercase italic">Policy</span>
          </h1>
          
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-tight leading-relaxed max-w-xl mx-auto">
            Transparent and clear policy outlining terms for digital service transactions.
          </p>
        </header>

        <div className="space-y-8">
          {/* Covered Plans */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-6 italic">
              1. Covered Subscription Modules
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              This policy applies to transactions involving the following physical evolution modules:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Starter Plan", price: "₹299" },
                { name: "Transformation Plan", price: "₹999" },
                { name: "Premium Lifestyle Plan", price: "₹1999" }
              ].map((plan, index) => (
                <div key={index} className="glass-panel p-6 border-white/5 bg-white/[0.01] flex flex-col justify-between items-center text-center">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/50 mb-2">{plan.name}</span>
                  <span className="text-2xl sm:text-3xl font-display font-black text-neon-green italic">{plan.price}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Refund Criteria */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              2. Eligibility & Criteria
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed mb-6">
              Because Fitness Mantra delivers personalized digital content (coaching materials, meal sheets, dynamic calculations), refunds are only eligible under these strictly defined parameters:
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-neon-green/[0.02] border border-neon-green/10">
                <CheckCircle className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">Refund is accepted only if:</h3>
                  <ul className="list-disc list-inside mt-2 text-[10px] sm:text-xs text-white/40 uppercase tracking-tight leading-relaxed space-y-1">
                    <li>There is a <span className="text-white">Duplicate payment</span> due to connection timeouts or banking errors.</li>
                    <li>There is a verified <span className="text-white">Technical payment failure</span> where money was debited but the subscription could not be activated.</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">Refund is STRICTLY DECREED NOT POSSIBLE after:</h3>
                  <ul className="list-disc list-inside mt-2 text-[10px] sm:text-xs text-white/40 uppercase tracking-tight leading-relaxed space-y-1">
                    <li>Your personalized <span className="text-white">Diet Plan</span> has been delivered or compiled.</li>
                    <li>Your personalized <span className="text-white">Workout Plan</span> has been delivered or compiled.</li>
                    <li>The <span className="text-white">Subscription / account</span> has been successfully activated on our servers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Refund Review Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sm:p-10 border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter text-neon-green mb-4 italic">
              3. Processing Protocols
            </h2>
            <div className="space-y-4 text-white/40 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              <p>
                Every transaction query undergoes strict billing analysis. Verification requires original transactional telemetry from our gateway.
              </p>
              <p className="text-white">
                ⏱️ REFUND REVIEW & VERIFICATION TIMELINE: 5 TO 7 WORKING DAYS.
              </p>
              <p>
                Once validated and approved, the refunded capital will be automatically channeled back into the user's source transaction bank account or UPI handle.
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
            <Flame className="w-8 h-8 text-neon-green mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight mb-2 italic">Initiate refund claim</h3>
            <p className="text-white/30 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">Send transactional logs and screenshots directly to Manish Bhagat.</p>
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
