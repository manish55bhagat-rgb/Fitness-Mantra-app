import React, { useState } from "react";
import { Check, Shield, Zap, Star, Crown, Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "30 Days Plan",
    icon: Star,
    price: "750",
    period: "30 Days",
    desc: "Clean-start bio-hacking setup to establish solid natural fitness habits.",
    features: [
      "Custom Workout Design",
      "Personalized Meal & Diet Routine",
      "Regular Progress Tracking",
      "Priority Messaging Support",
      "AI Fitness Coach Interaction"
    ],
    buttonText: "Contact for Plan",
    highlight: false,
  },
  {
    name: "90 Days Plan",
    icon: Zap,
    price: "2000",
    period: "90 Days",
    desc: "Our high-recommended body transformation and conditioning protocol.",
    features: [
      "Custom Workout Design",
      "Personalized Meal & Diet Routine",
      "Regular Progress Tracking",
      "Priority Messaging Support",
      "AI Fitness Coach Interaction"
    ],
    buttonText: "Contact for Plan",
    highlight: true,
  },
  {
    name: "6 Months Plan",
    icon: Crown,
    price: "3500",
    period: "6 Months",
    desc: "Long-term metabolic lifestyle adaptation. Full aesthetic support.",
    features: [
      "Custom Workout Design",
      "Personalized Meal & Diet Routine",
      "Regular Progress Tracking",
      "Priority Messaging Support",
      "AI Fitness Coach Interaction"
    ],
    buttonText: "Contact for Plan",
    highlight: false,
  }
];

export default function Subscription() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [contactName, setContactName] = useState(profile?.fullName || "");
  const [contactNotes, setContactNotes] = useState("");
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);

  const handleOpenContact = (plan: typeof plans[0]) => {
    if (!user) {
      navigate("/login?redirect=/subscription");
      return;
    }
    setSelectedPlan(plan);
    setShowStatusSuccess(false);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const email = "manish456bhagat@gmail.com";
    const subject = encodeURIComponent(`Fitness Mantra Plan Request: ${selectedPlan.name}`);
    const body = encodeURIComponent(
      `Hi Manish,\n\n` +
      `I would like to initiate my Fitness Mantra coaching program.\n\n` +
      `Plan Details:\n` +
      `- Subscription Selected: ${selectedPlan.name} (${selectedPlan.price} INR)\n` +
      `- Duration: ${selectedPlan.period}\n\n` +
      `Client Bio & Notes:\n` +
      `- Full Name: ${contactName}\n` +
      `- Target Goals: ${contactNotes || "Fat loss and physical reconditioning"}\n\n` +
      `Please guide me on the next steps for my personalized profile initialization.\n\n` +
      `Best regards,\n` +
      `${contactName}`
    );

    // Open native browser mail client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    setShowStatusSuccess(true);
    setTimeout(() => {
      setSelectedPlan(null);
      setContactNotes("");
    }, 3000);
  };

  return (
    <div className="pt-8 sm:pt-16 pb-20 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Compact, responsive Header */}
        <header className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 mb-6">
            <Shield className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-[9px] font-extrabold tracking-[0.4em] text-neon-green uppercase font-mono">Premium Access Blueprint</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-6 italic">
            EVOLVE YOUR <br className="hidden sm:block" />
            <span className="text-neon-green">FITNESS PROTOCOL</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-sm sm:text-base font-semibold uppercase tracking-tight leading-relaxed px-2">
            Elevate your lifestyle with custom coaching, metabolic recovery guides, and dedicated support.
          </p>
        </header>

        {/* Pricing Layout - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((onPlan, idx) => {
            const isEliteStatus = (profile?.subscriptionStatus === onPlan.name) || 
              (onPlan.name === "30 Days Plan" && (profile?.subscriptionStatus as string) === "30 Days Starter Plan") ||
              (onPlan.name === "90 Days Plan" && (profile?.subscriptionStatus as string) === "90 Days Transformation Plan") ||
              (onPlan.name === "6 Months Plan" && (profile?.subscriptionStatus as string) === "6 Months Premium Coaching Plan");

            return (
              <div
                key={idx}
                className={`relative glass-panel p-8 sm:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                  onPlan.highlight 
                    ? "border-neon-green/30 bg-neon-green/[5%] md:scale-[1.03] shadow-[0_20px_40px_rgba(57,255,20,0.1)] z-10" 
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {onPlan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-neon-green text-black font-black text-[9px] uppercase tracking-[0.3em] rounded-full shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                    RECOMMENDED PROTOCOL
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${onPlan.highlight ? "bg-neon-green/15 text-neon-green" : "bg-white/5 text-white/40"}`}>
                      <onPlan.icon className="w-6 h-6" />
                    </div>
                    {isEliteStatus && (
                      <span className="text-[8px] bg-neon-green/20 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-display font-black uppercase tracking-tight italic text-white mb-2">{onPlan.name}</h3>
                  <p className="text-white/40 text-xs font-medium leading-relaxed mb-6">{onPlan.desc}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">{onPlan.price}</span>
                      <span className="text-xs font-black text-neon-green font-mono">INR</span>
                    </div>
                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest font-mono">FIXED RATE / {onPlan.period}</span>
                  </div>

                  <div className="h-[1px] bg-white/5 w-full mb-6" />

                  {/* Pricing Key Features list */}
                  <div className="space-y-3 mb-8">
                    {onPlan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
                        <span className="text-xs text-white/60 font-semibold tracking-tight leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleOpenContact(onPlan)}
                    disabled={isEliteStatus}
                    className={`w-full py-3 px-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isEliteStatus
                        ? "bg-white/5 text-white/20 border border-dashed border-white/5 cursor-not-allowed"
                        : onPlan.highlight
                          ? "bg-neon-green text-black hover:shadow-[0_12px_25px_rgba(57,255,20,0.25)] hover:scale-[1.02]"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {isEliteStatus ? (
                      "Your Active Protocol"
                    ) : (
                      <>
                        Contact for Plan <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence Banner */}
        <div className="max-w-3xl mx-auto mt-16 p-6 sm:p-8 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row items-center gap-6 justify-between text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Natural Conditioning Guarantee</h4>
            <p className="text-xs text-white/40 leading-relaxed max-w-md">
              Mantra fitness architectures rely entirely on verified physiological methods, custom calorie profiles, and drug-free metabolic conditioning.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end font-mono">
            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">DIRECT DISPATCH</span>
            <a href="mailto:manish456bhagat@gmail.com" className="text-neon-green text-xs font-bold hover:underline">
              manish456bhagat@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Styled Contact Dialog Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-black/90 backdrop-blur-3xl"
              onClick={() => setSelectedPlan(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel border-white/10 p-6 sm:p-8 bg-black overflow-hidden shadow-2xl z-10 rounded-2xl"
            >
              <h3 className="text-2xl font-display font-black text-white uppercase italic tracking-tight mb-2">
                REACH COACHING MATRIX
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Complete your details below to instantly pre-fill an initialization proposal for the <span className="text-neon-green font-bold">{selectedPlan.name}</span> ({selectedPlan.price} INR).
              </p>

              {showStatusSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-neon-green animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">Mail Draft Dispatched</h4>
                  <p className="text-[10px] text-white/40 max-w-xs leading-relaxed uppercase tracking-widest">
                    Redirecting to your native mailer to send to manish456bhagat@gmail.com.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase text-white/40 tracking-wider mb-1.5">Athlete Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase font-black"
                      placeholder="Your Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black uppercase text-white/40 tracking-wider mb-1.5">Target Goals / Notes</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium"
                      placeholder="E.g., extreme fat loss, natural physical recomposition, better recovery..."
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] text-white/30 leading-relaxed uppercase tracking-wider font-mono">
                    You will send an active registration request directly to <strong>manish456bhagat@gmail.com</strong>. No service fees or external checkouts are applied.
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white/60 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-3 bg-neon-green hover:bg-neon-green/90 text-black font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(57,255,20,0.3)] animate-glow"
                    >
                      <Mail className="w-3.5 h-3.5" /> Launch Mailer
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
