import React, { useState } from "react";
import { Check, Shield, Zap, Star, Crown, CreditCard, Lock, RefreshCw, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "30 Days Starter Plan",
    icon: Star,
    price: "299",
    period: "30 Days",
    desc: "Best for beginners and trial users.",
    features: [
      "Basic Indian diet plan",
      "Beginner home/gym workout plan",
      "Fat loss & belly fat guidance",
      "Veg & non-veg options",
      "Basic WhatsApp support",
      "1 weekly progress check",
      "Basic full diet plan access",
      "Basic workout videos access"
    ],
    buttonText: "Get 30 Days Plan",
    highlight: false,
    whatsappMsg: "Hi Manish, I want to buy Fitness Mantra 30 Days Plan ₹299."
  },
  {
    name: "90 Days Transformation Plan",
    icon: Zap,
    price: "999",
    period: "90 Days",
    desc: "Best for serious fat loss, muscle gain, and body transformation.",
    features: [
      "Personalized diet plan",
      "Personalized workout plan",
      "Goal-based plan (fat loss, muscle gain, weight gain)",
      "BMI & calorie guidance",
      "WhatsApp support",
      "Weekly progress tracking",
      "Monthly plan update",
      "Advanced exercise videos access"
    ],
    buttonText: "Get 90 Days Plan",
    highlight: true,
    whatsappMsg: "Hi Manish, I want to buy Fitness Mantra 90 Days Plan ₹999."
  },
  {
    name: "6 Months Premium Coaching Plan",
    icon: Crown,
    price: "2499",
    period: "6 Months",
    desc: "Best for complete personal body transformation.",
    features: [
      "Fully personalized diet/workout plan",
      "Complete body transformation roadmap",
      "WhatsApp support",
      "Weekly progress tracking",
      "Monthly plan updates",
      "Priority support",
      "Progress monitoring",
      "Full coaching access",
      "All workout videos access",
      "All diet plans access"
    ],
    buttonText: "Get 6 Months Plan",
    highlight: false,
    whatsappMsg: "Hi Manish, I want to buy Fitness Mantra 6 Months Plan ₹2499."
  }
];

export default function Subscription() {
  const { user, profile, purchasePlan, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Checkout overlay state
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  const [checkoutStep, setCheckoutStep] = useState<"form" | "loading" | "success" | "error">("form");
  const [transactionId, setTransactionId] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [customPaymentError, setCustomPaymentError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleOpenCheckout = async (plan: typeof plans[0]) => {
    if (!user) {
      navigate("/login?redirect=/subscription");
      return;
    }
    
    // Save state in DB to allow tracking leads & selectedPlan instantly
    try {
      await updateUserProfile({
        selectedPlan: plan.name,
        paymentStatus: "Pending",
        accessStatus: "Inactive"
      });
    } catch (e) {
      console.error("Error setting plan status:", e);
    }

    setSelectedPlan(plan);
    setCheckoutStep("form");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setPaymentError(null);
    setCustomPaymentError(null);
  };

  const handleWhatsAppPayment = (plan: typeof plans[0]) => {
    const encoded = encodeURIComponent(plan.whatsappMsg);
    window.open(`https://wa.me/919765690437?text=${encoded}`, "_blank");
    setSelectedPlan(null);
    setToast("Redirected to WhatsApp for Plan Purchase! Manish will message you quickly.");
    setTimeout(() => setToast(null), 4000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setPaymentError(null);
    setCustomPaymentError(null);

    const cleanCard = cardNumber.replace(/\s/g, "");
    if (!cardNumber || !cardExpiry || !cardCvv) {
      setPaymentError("Please fill all payment details");
      return;
    }
    if (!/^\d{16}$/.test(cleanCard)) {
      setPaymentError("Please enter a valid 16-digit card number");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setPaymentError("Please enter a valid expiry date");
      return;
    }
    const [mm, yy] = cardExpiry.split("/");
    const monthNum = parseInt(mm, 10);
    if (monthNum < 1 || monthNum > 12) {
      setPaymentError("Please enter a valid expiry date");
      return;
    }
    if (!/^\d{3}$/.test(cardCvv)) {
      setPaymentError("Please enter a valid CVV");
      return;
    }

    setCheckoutStep("loading");
    
    // Simulate failed payment logic based on trigger suffix keys
    if (cleanCard.endsWith("0000")) {
      setTimeout(() => {
        setCustomPaymentError("Insufficient funds. Please try another card.");
        setCheckoutStep("error");
      }, 1500);
      return;
    }
    if (cleanCard.endsWith("1111")) {
      setTimeout(() => {
        setCustomPaymentError("Card declined. Please contact your bank.");
        setCheckoutStep("error");
      }, 1500);
      return;
    }
    if (cleanCard.endsWith("2222")) {
      setTimeout(() => {
        setCustomPaymentError("Network error. Please check your connection and try again.");
        setCheckoutStep("error");
      }, 1500);
      return;
    }

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCustomPaymentError("Network error. Please check your connection and try again.");
        setCheckoutStep("error");
        return;
      }

      const cleanPrice = selectedPlan.price.replace(/[^\d]/g, "");
      const amountPaise = Number(cleanPrice) * 100;

      const options = {
        key: "rzp_test_mockkey",
        amount: amountPaise,
        currency: "INR",
        name: "Fitness Mantra",
        description: `${selectedPlan.name} Activation`,
        image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
        prefill: {
          name: profile?.fullName || "Aesthetic Athlete",
          email: user?.email || "athlete@fitnessmantra.com",
          contact: "9999999999"
        },
        theme: {
          color: "#39ff14"
        },
        handler: async function (response: any) {
          try {
            setCheckoutStep("loading");
            const success = await purchasePlan(selectedPlan.name, selectedPlan.price, true);
            if (success) {
              const txnId = response.razorpay_payment_id || "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
              setTransactionId(txnId);
              setCheckoutStep("success");
              setToast(`Payment Successful! Welcome to ${selectedPlan.name} 🎉`);
              setTimeout(() => setToast(null), 4500);
            } else {
              setCustomPaymentError("Card declined. Please contact your bank.");
              setCheckoutStep("error");
            }
          } catch (upgradeErr) {
            console.error("Upgrade error:", upgradeErr);
            setCustomPaymentError("Card declined. Please contact your bank.");
            setCheckoutStep("error");
          }
        },
        modal: {
          ondismiss: function() {
            setCheckoutStep("form");
          }
        }
      };

      const rzpObj = new (window as any).Razorpay(options);
      rzpObj.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      setCustomPaymentError("Network error. Please check your connection and try again.");
      setCheckoutStep("error");
    }
  };

  const isCurrent = (onPlan: typeof plans[0]) => {
    if (!profile?.subscriptionStatus) return onPlan.name === "Free Plan";
    const status = profile.subscriptionStatus;
    if (status === "Architect Elite" && onPlan.name === "Premium Plan") return true;
    if (status === "Performance Pro" && onPlan.name === "Pro Plan") return true;
    if (status === "Standard" && onPlan.name === "Free Plan") return true;
    if (status === "Free" && onPlan.name === "Free Plan") return true;
    return status === onPlan.name;
  };

  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Instant Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-8 z-[300] bg-neon-green text-black px-6 py-4 rounded-xl font-black uppercase tracking-wider text-xs shadow-[0_15px_40px_rgba(57,255,20,0.45)] border border-neon-green/30"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10">
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Subscription Protocol v4.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter uppercase leading-none mb-10 italic">
            CHOOSE YOUR<br/><span className="premium-gradient-text uppercase italic">PLAN</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-semibold uppercase tracking-tight leading-relaxed">
            Choose your level of evolution. Precision-engineered plans for high-performance humans.
          </p>

          {profile?.subscriptionStatus && (
            <div className="mt-8 inline-block px-10 py-4 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-2xl text-xs uppercase font-black tracking-widest animate-pulse">
              Active Status: {
                profile.subscriptionStatus === "Architect Elite" || profile.subscriptionStatus === "Premium Plan" 
                  ? "Premium" 
                  : profile.subscriptionStatus === "Performance Pro" || profile.subscriptionStatus === "Pro Plan"
                    ? "Pro"
                    : "Free"
              } Member
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
          {plans.map((onPlan, idx) => {
            const hasThisPlan = isCurrent(onPlan);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative glass-panel p-12 transition-all duration-700 group ${
                  onPlan.highlight 
                    ? "border-neon-green/40 bg-neon-green/[0.03] scale-105 shadow-[0_30px_60px_-15px_rgba(57,255,20,0.15)] z-20 h-[850px]" 
                    : "border-white/5 hover:border-white/20 h-[750px]"
                }`}
              >
                {onPlan.highlight && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2 bg-neon-green text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-full shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                    Architect's Choice
                  </div>
                )}

                <div className="mb-12">
                  <onPlan.icon className={`w-12 h-12 mb-8 ${onPlan.highlight ? "text-neon-green" : "text-white/40"}`} />
                  <h2 className="text-4xl font-display font-black uppercase tracking-tighter italic mb-4">{onPlan.name}</h2>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-tight leading-relaxed">{onPlan.desc}</p>
                </div>

                <div className="mb-16">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[12px] font-black text-white/20">INR</span>
                    <span className={`text-6xl font-black tracking-tighter ${onPlan.highlight ? "text-neon-green" : "text-white"}`}>{onPlan.price}</span>
                  </div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono whitespace-nowrap">PRE-TAX PRICE / {onPlan.period}</div>
                </div>

                <div className="space-y-6 mb-16">
                  {onPlan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-4">
                      <Check className={`w-4 h-4 shrink-0 ${onPlan.highlight ? "text-neon-green" : "text-white/20"}`} />
                      <span className="text-[11px] font-bold text-white/60 uppercase tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleOpenCheckout(onPlan)}
                  disabled={hasThisPlan}
                  className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all duration-500 absolute bottom-12 left-1/2 -translate-x-1/2 px-12 cursor-pointer ${
                    hasThisPlan 
                      ? "bg-white/10 text-white/30 border-dashed border-white/5 cursor-not-allowed"
                      : onPlan.highlight 
                        ? "bg-neon-green text-black hover:shadow-[0_20px_40px_rgba(57,255,20,0.3)] hover:scale-[1.02]" 
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {hasThisPlan ? "Current Plan" : onPlan.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Simulated Premium Checkout Overlay Modal */}
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
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg glass-panel border-white/10 p-10 bg-black overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-10"
            >
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {checkoutStep === "form" && (
                <form onSubmit={processMockPayment} className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="text-neon-green w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tighter text-white">Fitness Mantra Checkout</h4>
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/30 font-mono mt-1 font-semibold">Selected: {selectedPlan.name}</p>
                    </div>
                  </div>

                  {paymentError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs uppercase font-bold tracking-wide"
                    >
                      {paymentError}
                    </motion.div>
                  )}

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center text-xs font-black uppercase">
                    <span className="text-white/40">Amount Due:</span>
                    <span className="text-neon-green tracking-wider font-bold">INR {selectedPlan.price} / {selectedPlan.period}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Card details (Online Sandbox Sandbox)</label>
                      <input 
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                        className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-xs font-mono font-bold tracking-widest text-white focus:outline-none focus:border-neon-green/20"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Expiry Date</label>
                        <input 
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-xs font-mono font-bold tracking-widest text-white focus:outline-none focus:border-neon-green/20 text-center"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">CVV Sec</label>
                        <input 
                          type="password"
                          maxLength={3}
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-xs font-mono font-bold tracking-widest text-white focus:outline-none focus:border-neon-green/20 text-center"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-[9px] font-black uppercase text-white/30 tracking-wider">
                    <Lock className="w-4 h-4 text-neon-green shrink-0" />
                    <span>Transactions are secured for Fitness Mantra coaching users.</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-neon-green text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] transition-all cursor-pointer font-bold"
                    >
                      Pay Instantly (Simulated Card Sandbox)
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-white/5"></div>
                      <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-widest text-white/30">OR</span>
                      <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleWhatsAppPayment(selectedPlan)}
                      className="w-full py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-[0_4px_15px_rgba(37,211,102,0.2)] transition-all cursor-pointer flex items-center justify-center gap-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 shrink-0"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.707 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Buy via WhatsApp (₹{selectedPlan.price})
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === "loading" && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-12 h-12 text-neon-green animate-spin mb-6 shadow-[0_0_20px_rgba(57,255,20,0.2)]" />
                  <h4 className="text-xl font-black uppercase tracking-tighter text-white animate-pulse">Running Clearance Network</h4>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 font-mono mt-2">Bypassing local merchant nodes...</p>
                </div>
              )}

              {checkoutStep === "success" && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-neon-green/10 border border-neon-green/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-neon-green" />
                  </div>
                  <h4 className="text-3xl font-display font-black uppercase tracking-tighter text-white italic">CLEARANCE APPROVED</h4>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neon-green mt-3 font-semibold">Vault Upgraded. Welcome to {selectedPlan.name}!</p>
                  
                  <div className="mt-8 p-4 bg-white/[0.01] border border-white/5 rounded-2xl w-full text-left font-mono space-y-2">
                    <div className="flex justify-between text-[8px] uppercase text-white/20">
                      <span>Receipt Token:</span>
                      <span className="text-white/60">{transactionId}</span>
                    </div>
                    <div className="flex justify-between text-[8px] uppercase text-white/20">
                      <span>Gate Protocol:</span>
                      <span className="text-white/60">Success</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSelectedPlan(null); navigate("/dashboard"); }}
                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-neon-green hover:text-black hover:border-transparent text-white font-black uppercase tracking-widest text-[9px] rounded-xl mt-8 cursor-pointer transition-all font-semibold"
                  >
                    Enter Live Member Grid
                  </button>
                </div>
              )}

              {checkoutStep === "error" && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <ShieldAlert className="w-12 h-12 text-red-400 mb-6" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-white">SIGN-OFF REJECTED</h4>
                  <p className="text-xs text-red-400 uppercase font-black tracking-wide mt-2 px-6">
                    {customPaymentError || "Transaction declined by core clearance rules."}
                  </p>
                  
                  <button 
                    onClick={() => setCheckoutStep("form")}
                    className="w-full py-4 bg-white/[0.07] border border-white/10 hover:bg-neon-green hover:text-black hover:border-transparent text-white font-black uppercase tracking-widest text-[9px] rounded-xl mt-8 cursor-pointer transition-all"
                  >
                    Retry Clearance
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
