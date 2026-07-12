import React, { useState } from "react";
import { Check, Shield, Zap, Crown, Star, Sparkles, Loader2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth, UserProfile, SubscriptionLog } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const premiumPlans = [
  {
    id: "premium_1m",
    name: "Starter Elite Plan",
    icon: Star,
    price: 299,
    period: "1 Month",
    monthsCount: 1,
    desc: "Experience elite coaching and full biometric tracking features for 30 days.",
    features: [
      "Full Elite AI Coach access (24/7)",
      "High-speed, custom diet responses",
      "Dynamic workout planning tools",
      "Full BMI & Calorie progression history",
      "Weekly human performance review checklist",
      "Direct Priority support from team"
    ],
    highlight: false,
    themeColor: "text-blue-400"
  },
  {
    id: "premium_3m",
    name: "Transformation Pro Plan",
    icon: Zap,
    price: 999,
    period: "3 Months",
    monthsCount: 3,
    desc: "Our most popular duration. Designed for significant and sustainable natural transformation.",
    features: [
      "Everything in Starter Elite Plan",
      "Advanced 90-day progress forecasting",
      "Unlimited custom PDF meal plans",
      "Direct calorie estimates via food visuals",
      "Weekly biometric optimization guides",
      "Full custom updates twice per month"
    ],
    highlight: true,
    themeColor: "text-neon-green"
  },
  {
    id: "premium_6m",
    name: "Architect Elite Plan",
    icon: Crown,
    price: 1999,
    period: "6 Months",
    monthsCount: 6,
    desc: "Build a lasting, natural, premium fit lifestyle. Ultimate longevity training.",
    features: [
      "Everything in Transformation Pro Plan",
      "6-month holistic transformation roadmap",
      "Personal human meal review notes by Manish",
      "Interactive workout detail breakdowns",
      "Exclusive preview access to new training features",
      "Direct consultation booking priority"
    ],
    highlight: false,
    themeColor: "text-amber-400"
  }
];

export default function PremiumMembership() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [activeSubDetails, setActiveSubDetails] = useState<any>(null);

  const handleSubscribe = async (plan: typeof premiumPlans[0]) => {
    if (!user) {
      navigate("/login?redirect=/premium-membership");
      return;
    }

    setLoadingPlanId(plan.id);
    setPaymentError(null);

    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Check your internet connection.");
      }

      // 2. Create Order in Backend
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName: `${plan.name} - ${plan.period}` }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create checkout session");
      }

      const orderData = await response.json();
      if (!orderData.success) {
        throw new Error("Backend order initialization unsuccessful");
      }

      // 3. Launch Razorpay Standard Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fitness Mantra",
        description: `${plan.name} (${plan.period}) Subscription`,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150",
        order_id: orderData.orderId,
        prefill: {
          name: profile?.fullName || "",
          email: profile?.email || "",
        },
        theme: {
          color: "#39FF14",
        },
        modal: {
          ondismiss: () => {
            setLoadingPlanId(null);
          },
        },
        handler: async (paymentResponse: any) => {
          setLoadingPlanId(plan.id);
          try {
            // 4. Verify Signature on Backend
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json();
              throw new Error(verifyErr.error || "Payment verification failed");
            }

            const verification = await verifyRes.json();
            if (verification.success) {
              // 5. Calculate start and end date
              const startDate = new Date();
              const expiryDate = new Date();
              expiryDate.setMonth(expiryDate.getMonth() + plan.monthsCount);

              // 6. Save subscription receipt to Firestore
              const transactionId = paymentResponse.razorpay_payment_id;
              const newSub: Omit<SubscriptionLog, "id"> = {
                userId: user.uid,
                planName: `${plan.name} (${plan.period})`,
                transactionId: transactionId,
                paymentStatus: "Success",
                purchaseDate: startDate.toISOString(),
                expiryDate: expiryDate.toISOString(),
              };

              await addDoc(collection(db, "users", user.uid, "subscriptions"), newSub);

              // 7. Update User Profile to "Architect Elite" (Premium) in Firestore
              await setDoc(
                doc(db, "users", user.uid),
                {
                  subscriptionStatus: "Architect Elite",
                  subscriptionExpiry: expiryDate.toISOString(),
                  accessStatus: "active",
                  accessStartDate: startDate.toISOString(),
                  accessEndDate: expiryDate.toISOString(),
                },
                { merge: true }
              );

              // Show success screen details
              setActiveSubDetails({
                planName: plan.name,
                price: plan.price,
                period: plan.period,
                transactionId: transactionId,
                expiryDate: expiryDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              });
              setPaymentSuccess(true);
            } else {
              throw new Error("Invalid checkout signature mismatch");
            }
          } catch (verifyErr: any) {
            console.error("Verification processing error:", verifyErr);
            setPaymentError(verifyErr.message || "An error occurred during payment verification.");
          } finally {
            setLoadingPlanId(null);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", (failedRes: any) => {
        console.error("Razorpay Payment Failed Object:", failedRes.error);
        setPaymentError(`Payment Failed: ${failedRes.error.description || "Transaction cancelled"}`);
        setLoadingPlanId(null);
      });
      rzpInstance.open();

    } catch (err: any) {
      console.error("Subscription initiation error:", err);
      setPaymentError(err.message || "Could not launch Razorpay checkout");
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="pt-8 sm:pt-16 pb-24 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      {/* Glow gradient backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-neon-green/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <AnimatePresence mode="wait">
          {!paymentSuccess ? (
            <motion.div
              key="plans_view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {/* Header */}
              <header className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 mb-6">
                  <Crown className="w-3.5 h-3.5 text-neon-green" />
                  <span className="text-[9px] font-extrabold tracking-[0.4em] text-neon-green uppercase font-mono">
                    Instant Automated Activation
                  </span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-6 italic">
                  ELITE MEMBERSHIP<br />
                  <span className="text-neon-green">PORTAL</span>
                </h1>
                <p className="text-white/40 max-w-xl mx-auto text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
                  Join Manish Bhagat's fitness collective. Unlock 24/7 AI Coach features, 
                  instant visual analysis, and complete custom biometrics.
                </p>

                {paymentError && (
                  <div className="mt-8 max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                      ⚠️ {paymentError}
                    </p>
                  </div>
                )}
              </header>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto mb-16">
                {premiumPlans.map((plan) => {
                  const isActive = profile?.subscriptionStatus === "Architect Elite" && 
                    profile?.subscriptionExpiry && 
                    new Date(profile.subscriptionExpiry) > new Date();

                  const isLoading = loadingPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative glass-panel p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                        plan.highlight
                          ? "border-neon-green/30 bg-neon-green/[3%] md:scale-[1.03] shadow-[0_20px_40px_rgba(57,255,20,0.06)] z-10"
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      {plan.highlight && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-neon-green text-black font-black text-[9px] uppercase tracking-[0.3em] rounded-full">
                          BEST TRANSFORMATION VALUE
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className={`p-3 rounded-2xl bg-white/5 ${plan.themeColor}`}>
                            <plan.icon className="w-5 h-5" />
                          </div>
                          {isActive && (
                            <span className="text-[8px] bg-neon-green/20 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                              Active Member
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight italic text-white mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-white/40 text-xs font-semibold leading-relaxed mb-6">
                          {plan.desc}
                        </p>

                        <div className="mb-6">
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">
                              ₹{plan.price}
                            </span>
                            <span className="text-xs font-black text-neon-green font-mono">INR</span>
                          </div>
                          <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest font-mono">
                            Auto Activated / {plan.period}
                          </span>
                        </div>

                        <div className="h-[1px] bg-white/5 w-full mb-6" />

                        {/* Features List */}
                        <div className="space-y-3 mb-8">
                          {plan.features.map((feature, fidx) => (
                            <div key={fidx} className="flex items-start gap-2.5">
                              <Check className="w-3.5 h-3.5 text-neon-green shrink-0 mt-0.5" />
                              <span className="text-xs text-white/60 font-semibold tracking-tight leading-tight">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={loadingPlanId !== null || isActive}
                        className={`w-full py-3.5 px-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isActive
                            ? "bg-white/5 text-white/20 border border-dashed border-white/5 cursor-not-allowed"
                            : plan.highlight
                              ? "bg-neon-green text-black hover:shadow-[0_12px_25px_rgba(57,255,20,0.25)] hover:scale-[1.02]"
                              : "bg-white/10 hover:bg-white/15 border border-white/10 text-white hover:scale-[1.02]"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Starting Secure Gate...
                          </>
                        ) : isActive ? (
                          "Your Active Elite Membership"
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> Unlock Plan Now
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Secure Trust Badges */}
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white/[0.01] border border-white/5 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-white/40 font-mono text-[9px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-neon-green" /> Razorpay Production Standard Checkout
                </div>
                <p className="text-[10px] text-white/30 font-semibold leading-relaxed uppercase tracking-tight">
                  All transactions are 100% encrypted and processed securely by Razorpay. 
                  We support Credit/Debit cards, UPI, QR Code, Net Banking, and major mobile wallets.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success_view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-black/40 border border-neon-green/20 p-8 sm:p-10 rounded-3xl text-center shadow-[0_20px_50px_rgba(57,255,20,0.08)]"
            >
              <div className="w-16 h-16 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <span className="text-[9px] font-black text-neon-green tracking-[0.45em] uppercase font-mono block mb-2">
                Transaction Verified
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight italic mb-6">
                PAYMENT SUCCESSFUL!
              </h2>

              <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-8 font-semibold uppercase">
                Welcome to the inner circle! Your Elite membership is now active.
                You have been granted unrestricted access to the Premium Dashboard and all interactive features.
              </p>

              {activeSubDetails && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-left space-y-3 mb-8 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase">Plan Title:</span>
                    <span className="text-white font-black uppercase">{activeSubDetails.planName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase">Amount Paid:</span>
                    <span className="text-neon-green font-black">₹{activeSubDetails.price}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase">Gate Receipt ID:</span>
                    <span className="text-white font-black select-all">{activeSubDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-white/40 uppercase">Valid Expiry Date:</span>
                    <span className="text-white font-black">{activeSubDetails.expiryDate}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/premium-dashboard")}
                  className="flex-1 py-4 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(57,255,20,0.4)] cursor-pointer"
                >
                  Enter Premium Hub
                </button>
                <button
                  onClick={() => navigate("/my-subscription")}
                  className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all cursor-pointer"
                >
                  My Subscription
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
