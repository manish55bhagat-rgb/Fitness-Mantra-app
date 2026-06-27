import React, { useState } from "react";
import { Check, Shield, Zap, Star, Crown, MessageSquare, Smartphone, QrCode, CreditCard, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { openRazorpayCheckout } from "../lib/razorpay";

const plans = [
  { name: "Starter Plan", icon: Star, price: "299", period: "30 Days", desc: "1 Month Plan – Perfect to kickstart your fitness journey.", highlight: false, features: ["AI Coach access", "BMI & Calories Calculator", "7-Day Diet Plan", "7-Day Workout Plan", "Basic guidance", "WhatsApp enquiry support"], notIncluded: ["PDF Diet Plan", "Priority support"], whatsappEnquiryLink: "https://wa.me/919765690437?text=Hi%20Manish%2C%20I%20am%20interested%20in%20Starter%20Plan." },
  { name: "Transformation Plan", icon: Zap, price: "999", period: "90 Days", desc: "3 Months Plan – Highly recommended for natural body transformation.", highlight: true, features: ["Everything in Starter", "30-Day Diet Plan", "30-Day Workout Plan", "PDF Diet Plan", "Progress tracking", "Priority WhatsApp support"], notIncluded: [], whatsappEnquiryLink: "https://wa.me/919765690437?text=Hi%20Manish%2C%20I%20am%20interested%20in%20Transformation%20Plan." },
  { name: "Premium Lifestyle Plan", icon: Crown, price: "1999", period: "6 Months", desc: "6 Months Plan – Build a sustainable premium healthy lifestyle.", highlight: false, features: ["Everything in Transformation", "6-month roadmap", "Monthly diet update", "Monthly workout update", "Inch loss tracker", "Priority human review"], notIncluded: [], whatsappEnquiryLink: "https://wa.me/919765690437?text=Hi%20Manish%2C%20I%20am%20interested%20in%20Premium%20Lifestyle%20Plan." }
];

export default function Subscription() {
  const { user, profile, purchasePlan } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  const requireLogin = () => {
    if (!user) {
      navigate("/login?redirect=/subscription");
      return false;
    }
    return true;
  };

  const handleOpenPayment = (plan: typeof plans[0]) => {
    if (!requireLogin()) return;
    setPaymentMessage(null);
    setSelectedPlan(plan);
  };

  const handleOnlinePay = async (plan: typeof plans[0]) => {
    if (!requireLogin()) return;
    setPaymentMessage(null);
    setPayingPlan(plan.name);

    try {
      await openRazorpayCheckout({
        plan,
        user,
        profile,
        onSuccess: async () => {
          const activated = await purchasePlan(plan.name, plan.price, true);
          if (!activated) throw new Error("Payment successful, but plan activation failed. Please contact support.");
        }
      });
      setSelectedPlan(null);
      setPaymentMessage("Payment successful. Your plan is active now.");
    } catch (err: any) {
      setPaymentMessage(err?.message || "Payment failed. Please try again or use UPI QR.");
    } finally {
      setPayingPlan(null);
    }
  };

  return (
    <div className="pt-8 sm:pt-16 pb-20 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
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
            Pay online instantly with Razorpay or use UPI QR as backup.
          </p>
          {paymentMessage && <div className="mt-6 mx-auto max-w-xl rounded-2xl border border-neon-green/20 bg-neon-green/10 px-4 py-3 text-xs font-bold text-neon-green">{paymentMessage}</div>}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((onPlan, idx) => {
            const isActivePlan = Boolean((profile?.selectedPlan === onPlan.name) || (profile?.subscriptionStatus as string)?.includes(onPlan.name) || (profile?.subscriptionStatus as string)?.includes(onPlan.name.split(" ")[0]));
            return (
              <div key={idx} className={`relative glass-panel p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between ${onPlan.highlight ? "border-neon-green/30 bg-neon-green/[4%] md:scale-[1.03] shadow-[0_20px_40px_rgba(57,255,20,0.08)] z-10" : "border-white/5 hover:border-white/10"}`}>
                {onPlan.highlight && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-neon-green text-black font-black text-[9px] uppercase tracking-[0.3em] rounded-full">RECOMMENDED</div>}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${onPlan.highlight ? "bg-neon-green/15 text-neon-green" : "bg-white/5 text-white/40"}`}><onPlan.icon className="w-5 h-5" /></div>
                    {isActivePlan && <span className="text-[8px] bg-neon-green/20 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">Active Plan</span>}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight italic text-white mb-2">{onPlan.name}</h3>
                  <p className="text-white/40 text-xs font-semibold leading-relaxed mb-6">{onPlan.desc}</p>
                  <div className="mb-6"><span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">₹{onPlan.price}</span><span className="text-xs font-black text-neon-green font-mono ml-1">INR</span><div className="text-[8px] text-white/20 font-bold uppercase tracking-widest font-mono mt-2">FIXED RATE / {onPlan.period}</div></div>
                  <div className="h-[1px] bg-white/5 w-full mb-6" />
                  <div className="space-y-3 mb-8">
                    {onPlan.features.map((feature) => <div key={feature} className="flex items-start gap-2.5"><Check className="w-3.5 h-3.5 text-neon-green shrink-0 mt-0.5" /><span className="text-xs text-white/60 font-semibold leading-tight">{feature}</span></div>)}
                    {onPlan.notIncluded.map((feature) => <div key={feature} className="flex items-start gap-2.5 opacity-40"><span className="text-red-500 font-bold text-xs shrink-0 w-3.5 text-center mt-0.5">x</span><span className="text-xs text-white/40 line-through font-semibold leading-tight">{feature}</span></div>)}
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <button onClick={() => handleOnlinePay(onPlan)} disabled={isActivePlan || payingPlan === onPlan.name} className={`w-full py-3 px-5 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2 ${isActivePlan ? "bg-white/5 text-white/20 border border-dashed border-white/5 cursor-not-allowed" : onPlan.highlight ? "bg-neon-green text-black hover:scale-[1.02]" : "bg-white/10 hover:bg-white/15 border border-white/10 text-white hover:scale-[1.02]"}`}>
                    {payingPlan === onPlan.name ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening</> : isActivePlan ? "Your Active Plan" : <><CreditCard className="w-4 h-4" /> Pay Online</>}
                  </button>
                  <button onClick={() => handleOpenPayment(onPlan)} disabled={isActivePlan} className="w-full py-2.5 px-5 rounded-xl font-black uppercase tracking-[0.15em] text-[9px] flex items-center justify-center gap-2 border border-white/10 hover:border-neon-green/30 hover:text-neon-green bg-black/45 text-white/70 disabled:opacity-30"><QrCode className="w-3.5 h-3.5" /> UPI QR Backup</button>
                  <a href={onPlan.whatsappEnquiryLink} target="_blank" rel="noreferrer" className="w-full py-2.5 px-5 rounded-xl font-black uppercase tracking-[0.15em] text-[9px] flex items-center justify-center gap-2 border border-white/10 hover:border-neon-green/30 hover:text-neon-green bg-black/45 text-white/70"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp</a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-white/[0.01] border border-red-500/10 text-center"><p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">Health Disclaimer: Fitness Mantra provides general fitness and diet guidance. For medical conditions, consult a qualified doctor.</p></div>
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-deep-black/90 backdrop-blur-3xl" onClick={() => setSelectedPlan(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md max-h-[92vh] overflow-y-auto glass-panel border-white/10 p-4 sm:p-8 bg-black/95 shadow-2xl z-10 rounded-3xl flex flex-col my-4">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-black/95 z-10 pb-2"><h3 className="text-lg sm:text-xl font-display font-black text-white uppercase italic">Pay with UPI</h3><button onClick={() => setSelectedPlan(null)} className="text-white/40 hover:text-white font-bold text-xs uppercase">Close</button></div>
              <div className="text-center p-3 sm:p-4 bg-white/[0.02] border border-white/5 rounded-2xl mb-4"><div className="text-[9px] font-black uppercase text-neon-green tracking-widest mb-1">Selected plan</div><div className="text-sm sm:text-base font-black text-white uppercase">{selectedPlan.name}</div><div className="text-2xl font-black text-neon-green italic mt-1">₹{selectedPlan.price}</div></div>
              <div className="flex flex-col items-center justify-center mb-5"><div className="p-2 sm:p-3 bg-white rounded-2xl shadow-lg border-2 border-neon-green/30 w-fit"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=000000&data=${encodeURIComponent(`upi://pay?pa=919765690437@waaxis&pn=Manish Prabhakar Bhagat&am=${selectedPlan.price}&cu=INR&tn=FitnessMantra plan subscription`)}`} alt="UPI Payment QR Code" className="w-[155px] h-[155px] sm:w-[190px] sm:h-[190px] block" /></div><div className="mt-3 text-center text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-widest break-words">UPI ID: <span className="text-white font-mono break-all font-bold">919765690437@waaxis</span></div></div>
              <div className="text-left space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl mb-5 text-[11px] text-white/70"><div>1. Scan QR and complete payment.</div><div>2. Take payment screenshot.</div><div>3. Send screenshot on WhatsApp for manual activation.</div></div>
              <div className="flex flex-col sm:flex-row gap-3"><button type="button" onClick={() => setSelectedPlan(null)} className="sm:flex-1 py-3 border border-white/10 hover:bg-white/5 text-white/60 font-black text-[10px] uppercase rounded-xl">Dismiss</button><a href={`https://wa.me/919765690437?text=${encodeURIComponent(`Hi Manish, I completed UPI payment of Rs ${selectedPlan.price} for ${selectedPlan.name}. Please activate my account.`)}`} target="_blank" rel="noreferrer" className="sm:flex-[2] py-3 bg-[#25d366] hover:bg-[#20ba5a] text-black font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-1.5"><Smartphone className="w-4 h-4 text-black" /> Send Screenshot</a></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
