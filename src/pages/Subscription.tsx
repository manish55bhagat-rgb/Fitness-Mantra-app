import React, { useState } from "react";
import { Check, Shield, Zap, Star, Crown, ArrowRight, MessageSquare, Smartphone, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter Plan",
    icon: Star,
    price: "299",
    period: "30 Days",
    desc: "1 Month Plan – Perfect to kickstart your fitness journey.",
    features: [
      "AI Coach access",
      "BMI & Calories Calculator",
      "7-Day Diet Plan",
      "7-Day Workout Plan",
      "Basic weight-loss guidance",
      "WhatsApp enquiry support",
      "Weekly check-in form"
    ],
    notIncluded: [
      "PDF Diet Plan",
      "Food image calorie analysis",
      "Monthly custom update",
      "Priority support"
    ],
    highlight: false,
    whatsappEnquiryLink: "https://wa.me/919765690437?text=Hi%20Manish,%20I%20am%20interested%20in%20the%20Starter%20Plan%20for%20%E2%82%B9299.%20Please%20share%20details."
  },
  {
    name: "Transformation Plan",
    icon: Zap,
    price: "999",
    period: "90 Days",
    desc: "3 Months Plan – Highly recommended for natural body transformation.",
    features: [
      "Everything in Starter Plan",
      "30-Day Diet Plan",
      "30-Day Workout Plan",
      "PDF Diet Plan",
      "Food image calorie estimate",
      "Progress tracking",
      "2 plan updates per month",
      "Priority WhatsApp support"
    ],
    notIncluded: [],
    highlight: true,
    whatsappEnquiryLink: "https://wa.me/919765690437?text=Hi%20Manish,%20I%20am%20interested%20in%20the%20Transformation%20Plan%20for%20%E2%82%B9999.%20Please%20share%20details."
  },
  {
    name: "Premium Lifestyle Plan",
    icon: Crown,
    price: "1999",
    period: "6 Months",
    desc: "6 Months Plan – Build a sustainable premium healthy lifestyle.",
    features: [
      "Everything in Transformation Plan",
      "6-month transformation roadmap",
      "Monthly custom diet update",
      "Monthly custom workout update",
      "Weight & inch loss tracker",
      "Habit guidance",
      "Premium recipes",
      "Priority human review by Manish",
      "Early access to new features"
    ],
    notIncluded: [],
    highlight: false,
    whatsappEnquiryLink: "https://wa.me/919765690437?text=Hi%20Manish,%20I%20am%20interested%20in%20the%20Premium%20Lifestyle%20Plan%20for%20%E2%82%B91999.%20Please%20share%20details."
  }
];

export default function Subscription() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const handleOpenPayment = (plan: typeof plans[0]) => {
    if (!user) {
      navigate("/login?redirect=/subscription");
      return;
    }
    setSelectedPlan(plan);
  };

  return (
    <div className="pt-8 sm:pt-16 pb-20 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      {/* Background radial accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Compact, responsive Header without futuristic text */}
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 mb-6">
            <Shield className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-[9px] font-extrabold tracking-[0.4em] text-neon-green uppercase font-mono">Transform Your Body Naturally</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-6 italic">
            CHOOSE YOUR <br className="hidden sm:block" />
            <span className="text-neon-green">FITNESS PLAN</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed px-2">
            Affordable fitness and diet guidance plans designed for natural body transformation.
          </p>
          <div className="mt-8 max-w-2xl mx-auto p-4 sm:p-5 bg-neon-green/10 border border-neon-green/20 rounded-2xl text-center">
            <p className="text-xs sm:text-sm font-bold text-neon-green tracking-wide">
              📢 UPI Payment Instruction:<br />
              “After payment, send screenshot on WhatsApp for activation. Plan activation may take up to 24 hours.”
            </p>
          </div>
        </header>

        {/* Pricing Layout - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((onPlan, idx) => {
            const isEliteStatus = (profile?.subscriptionStatus === onPlan.name) ||
              (onPlan.name.includes("Starter") && (profile?.subscriptionStatus as string)?.includes("Starter")) ||
              (onPlan.name.includes("Transformation") && (profile?.subscriptionStatus as string)?.includes("Transformation")) ||
              (onPlan.name.includes("Premium") && (profile?.subscriptionStatus as string)?.includes("Premium"));

            return (
              <div
                key={idx}
                className={`relative glass-panel p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                  onPlan.highlight 
                    ? "border-neon-green/30 bg-neon-green/[4%] md:scale-[1.03] shadow-[0_20px_40px_rgba(57,255,20,0.08)] z-10" 
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {onPlan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-neon-green text-black font-black text-[9px] uppercase tracking-[0.3em] rounded-full shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                    RECOMMENDED PLAN
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${onPlan.highlight ? "bg-neon-green/15 text-neon-green" : "bg-white/5 text-white/40"}`}>
                      <onPlan.icon className="w-5 h-5" />
                    </div>
                    {isEliteStatus && (
                      <span className="text-[8px] bg-neon-green/20 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight italic text-white mb-2">{onPlan.name}</h3>
                  <p className="text-white/40 text-xs font-semibold leading-relaxed mb-6">{onPlan.desc}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5 mb-11">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">₹{onPlan.price}</span>
                      <span className="text-xs font-black text-neon-green font-mono">INR</span>
                    </div>
                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest font-mono">FIXED RATE / {onPlan.period}</span>
                  </div>

                  <div className="h-[1px] bg-white/5 w-full mb-6" />

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {onPlan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-neon-green shrink-0 mt-0.5" />
                        <span className="text-xs text-white/60 font-semibold tracking-tight leading-tight">{feature}</span>
                      </div>
                    ))}
                    {onPlan.notIncluded && onPlan.notIncluded.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5 opacity-40">
                        <span className="text-red-500 font-bold text-xs shrink-0 w-3.5 text-center mt-0.5">✕</span>
                        <span className="text-xs text-white/40 line-through font-semibold tracking-tight leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Block with two distinct buttons */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleOpenPayment(onPlan)}
                    disabled={isEliteStatus}
                    className={`w-full py-3 px-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isEliteStatus
                        ? "bg-white/5 text-white/20 border border-dashed border-white/5 cursor-not-allowed"
                        : onPlan.highlight
                          ? "bg-neon-green text-black hover:shadow-[0_12px_25px_rgba(57,255,20,0.25)] hover:scale-[1.02]"
                          : "bg-white/10 hover:bg-white/15 border border-white/10 text-white hover:scale-[1.02]"
                    }`}
                  >
                    {isEliteStatus ? (
                      "Your Active Plan"
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" /> Pay with UPI QR
                      </>
                    )}
                  </button>

                  <a
                    href={onPlan.whatsappEnquiryLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-6 rounded-xl font-black uppercase tracking-[0.15em] text-[9px] transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-neon-green/30 hover:text-neon-green bg-black/45 hover:bg-black text-white/70"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Enquiry
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Professional Support Banner */}
        <div className="max-w-3xl mx-auto mt-16 p-6 sm:p-8 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row items-center gap-6 justify-between text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Natural Personal Coaching Guarantee</h4>
            <p className="text-xs text-white/40 leading-relaxed max-w-sm">
              Coaching plans rely on direct human design, tailored meal programs, natural diet setups, and personalized tracking built by Manish Bhagat.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end font-mono">
            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">DIRECT DISPATCH</span>
            <a href="mailto:manish55bhagat@gmail.com" className="text-neon-green text-xs font-bold hover:underline">
              manish55bhagat@gmail.com
            </a>
          </div>
        </div>

        {/* Health Disclaimer */}
        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-white/[0.01] border border-red-500/10 text-center">
          <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
            ⚠️ <strong className="text-white/60">Health Disclaimer:</strong> Fitness Mantra provides general fitness and diet guidance. For medical conditions, consult a qualified doctor or dietitian.
          </p>
        </div>
      </div>

      {/* Styled Manual UPI Payment & WhatsApp Modal */}
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
              className="relative w-full max-w-md glass-panel border-white/10 p-6 sm:p-8 bg-black/95 overflow-hidden shadow-2xl z-10 rounded-3xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tight">
                  Pay with UPI
                </h3>
                <button 
                  onClick={() => setSelectedPlan(null)} 
                  className="text-white/40 hover:text-white font-bold text-xs uppercase hover:underline"
                >
                  Close
                </button>
              </div>

              <div className="text-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl mb-6">
                <div className="text-[9px] font-black uppercase text-neon-green tracking-widest mb-1 leading-none">Selected plan</div>
                <div className="text-base font-black text-white uppercase tracking-wider">{selectedPlan.name}</div>
                <div className="text-2xl font-black text-neon-green italic mt-1">₹{selectedPlan.price}</div>
              </div>

              {/* Dynamic QR Code centered */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-lg border-2 border-neon-green/30 max-w-[200px]">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=000000&data=${encodeURIComponent(`upi://pay?pa=919765690437@waaxis&pn=Manish Prabhakar Bhagat&am=${selectedPlan.price}&cu=INR&tn=FitnessMantra plan subscription`)}`} 
                    alt="UPI Payment QR Code" 
                    className="w-[170px] h-[170px] block"
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">UPI ID: <span className="text-white font-mono break-all font-bold">919765690437@waaxis</span></div>
                  <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-0.5">Account Name: <span className="text-white font-bold">Manish Prabhakar Bhagat</span></div>
                </div>
              </div>

              {/* Instructions steps */}
              <div className="text-left space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl mb-6 text-[11px] leading-relaxed text-white/70">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-neon-green/20 text-neon-green text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <span>Scan QR and complete payment.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-neon-green/20 text-neon-green text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <span>Take payment screenshot.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-neon-green/20 text-neon-green text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <span className="font-extrabold text-neon-green">After payment, send screenshot on WhatsApp for activation. Plan activation may take up to 24 hours.</span>
                </div>
              </div>

              {/* Security banner */}
              <p className="text-[8px] font-extrabold text-white/20 uppercase tracking-[0.2em] mb-4 text-center">
                🛡️ Direct bank-to-bank UPI payment. Fully safe & private.
              </p>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white/60 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Dismiss
                </button>
                <a
                  href={`https://wa.me/919765690437?text=${encodeURIComponent(`Hi Manish, I have completed the UPI payment of ₹${selectedPlan.price} for the ${selectedPlan.name}. Attached is my screenshot/payment success proof for manual activation. Please activate my account.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-[2] py-3 bg-[#25d366] hover:bg-[#20ba5a] text-black font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(37,211,102,0.3)]"
                >
                  <Smartphone className="w-4 h-4 text-black shrink-0" /> Send Screenshot
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}