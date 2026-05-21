import { Check, Shield, Zap, Star, Crown } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    name: "Standard",
    icon: Star,
    price: "0",
    period: "Forever",
    desc: "Baseline physiological maintenance for recreational users.",
    features: [
      "Standard Workout Library",
      "Basic Diet Templates",
      "BMI Analytics",
      "Community Access",
    ],
    buttonText: "INITIALIZE ACCESS",
    highlight: false
  },
  {
    name: "Architect Elite",
    icon: Crown,
    price: "2,999",
    period: "Yearly",
    desc: "The ultimate biopsychosocial optimization protocol by Fitness Mantra.",
    features: [
      "AI Neural Form Guidance",
      "Personalized Vedic Diet Plans",
      "Real-time Biometric Sync",
      "1-on-1 Performance Audit",
      "Priority Neural Assistant",
      "Exclusive High-Fidelity Modules"
    ],
    buttonText: "UNLEASH THE ELITE",
    highlight: true
  },
  {
    name: "Performance Pro",
    icon: Zap,
    price: "499",
    period: "Monthly",
    desc: "Accelerated growth module for consistent performance evolution.",
    features: [
      "Full 3D Cinematic Exercises",
      "Smart Nutrition Architecture",
      "Weekly Progress Audits",
      "Ad-Free Bio-Interface",
    ],
    buttonText: "ACCELERATE GROWTH",
    highlight: false
  }
];

export default function Subscription() {
  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10">
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Subscription Protocol v4.0</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-10 italic">
            Elite<br/><span className="premium-gradient-text uppercase italic">Access</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-semibold uppercase tracking-tight leading-relaxed">
            Choose your level of evolution. Precision-engineered plans for high-performance humans.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative glass-panel p-12 transition-all duration-700 group ${
                plan.highlight 
                  ? "border-neon-green/40 bg-neon-green/[0.03] scale-105 shadow-[0_30px_60px_-15px_rgba(57,255,20,0.15)] z-20 h-[850px]" 
                  : "border-white/5 hover:border-white/20 h-[750px]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2 bg-neon-green text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-full shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                  Architect's Choice
                </div>
              )}

              <div className="mb-12">
                <plan.icon className={`w-12 h-12 mb-8 ${plan.highlight ? "text-neon-green" : "text-white/40"}`} />
                <h2 className="text-4xl font-display font-black uppercase tracking-tighter italic mb-4">{plan.name}</h2>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-tight leading-relaxed">{plan.desc}</p>
              </div>

              <div className="mb-16">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[12px] font-black text-white/20">INR</span>
                  <span className={`text-6xl font-black tracking-tighter ${plan.highlight ? "text-neon-green" : "text-white"}`}>{plan.price}</span>
                </div>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono whitespace-nowrap">PRE-TAX PRICE / {plan.period}</div>
              </div>

              <div className="space-y-6 mb-16">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-center gap-4">
                    <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-neon-green" : "text-white/20"}`} />
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all duration-500 absolute bottom-12 left-1/2 -translate-x-1/2 px-12 ${
                plan.highlight 
                  ? "bg-neon-green text-black hover:shadow-[0_20px_40px_rgba(57,255,20,0.3)] hover:scale-[1.02]" 
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
