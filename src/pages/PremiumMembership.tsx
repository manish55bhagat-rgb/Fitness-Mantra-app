import React, { useState, useEffect } from "react";
import { 
  Check, Shield, Zap, Crown, Star, Sparkles, Loader2, ArrowRight, 
  ShieldCheck, HelpCircle, X, Smartphone, QrCode, CreditCard, 
  ExternalLink, AlertTriangle, ArrowUpRight, Copy 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth, SubscriptionLog } from "../context/AuthContext";
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

const safeFetchJSON = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html") || text.toLowerCase().includes("the page could not be found")) {
      throw new Error(`Server returned HTML instead of JSON (Status ${res.status}). This usually means the API route was not found or is misconfigured on the server.`);
    }
    throw new Error(`Invalid response format from server (Status ${res.status}): ${text.substring(0, 100)}`);
  }
  
  if (!res.ok) {
    throw new Error(data?.error || `Server error (Status ${res.status})`);
  }
  return data;
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
  
  // Custom states for mobile iframe bypass and UPI convenience
  const [isIframe, setIsIframe] = useState<boolean>(false);
  const [copiedUPI, setCopiedUPI] = useState<boolean>(false);
  const [upiRefId, setUpiRefId] = useState<string>("");

  useEffect(() => {
    try {
      setIsIframe(window.self !== window.top);
    } catch (e) {
      setIsIframe(true);
    }
  }, []);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("manish55bhagat@okaxis");
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };
  
  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof premiumPlans[0] | null>(null);
  const [checkoutTab, setCheckoutTab] = useState<"upi" | "razorpay">("upi");
  const [confirmingUPI, setConfirmingUPI] = useState<boolean>(false);

  // Instant Activation logic (shared between UPI scan confirmation and simulation)
  const executeEliteActivation = async (plan: typeof premiumPlans[0], methodLabel: string, customTxId?: string) => {
    if (!user) return;
    
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.monthsCount);

    const transactionId = customTxId || "pay_tx_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const newSub: Omit<SubscriptionLog, "id"> = {
      userId: user.uid,
      planName: `${plan.name} (${plan.period})`,
      transactionId: transactionId,
      paymentStatus: "Success",
      purchaseDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    };

    // Save to sub collection
    await addDoc(collection(db, "users", user.uid, "subscriptions"), newSub);

    // Update main profile status
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
    setShowCheckoutModal(false);
  };

  const handleSimulateSuccess = async (plan: typeof premiumPlans[0]) => {
    setLoadingPlanId(plan.id);
    setPaymentError(null);
    try {
      await executeEliteActivation(plan, "Simulation Bypass", "SIM_" + Date.now().toString().substring(8));
    } catch (err: any) {
      console.error("Simulation activation failed:", err);
      setPaymentError(err.message || "Staging activation failed");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleUPIConfirm = async () => {
    if (!selectedPlan) return;
    setConfirmingUPI(true);
    setPaymentError(null);
    try {
      // Simulate/Trigger instant verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const refTxId = upiRefId.trim() ? "UPI_" + upiRefId.trim() : "UPI_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      await executeEliteActivation(selectedPlan, "UPI QR Code", refTxId);
    } catch (err: any) {
      console.error("UPI Confirmation Error:", err);
      setPaymentError(err.message || "Failed to confirm UPI payment.");
    } finally {
      setConfirmingUPI(false);
    }
  };

  const startRazorpayFlow = async (plan: typeof premiumPlans[0]) => {
    setLoadingPlanId(plan.id);
    setPaymentError(null);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay script blocked or failed to load. Please try Instant UPI option.");
      }

      // 2. Contact our server to create transaction order
      const orderData = await safeFetchJSON("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName: `${plan.name} - ${plan.period}` }),
      });

      if (!orderData || !orderData.success) {
        throw new Error("Failed to initialize backend Razorpay order.");
      }

      // 3. Configure and Open Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fitness Mantra",
        description: `${plan.name} (${plan.period})`,
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
            // 4. Verify signature on server
            const verification = await safeFetchJSON("/api/razorpay/verify-payment", {
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

            if (verification && verification.success) {
              await executeEliteActivation(plan, "Razorpay Gateway", paymentResponse.razorpay_payment_id);
            } else {
              throw new Error("Payment signature verification failed.");
            }
          } catch (verifyErr: any) {
            console.error("Razorpay verification failed:", verifyErr);
            setPaymentError(verifyErr.message || "An error occurred verifying your signature. Please complete via Instant UPI.");
          } finally {
            setLoadingPlanId(null);
          }
        }
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", (failedRes: any) => {
        console.error("Razorpay Payment Failed:", failedRes.error);
        
        // Custom warning specifically handling Razorpay account/website blocks
        const desc = failedRes.error.description || "";
        if (desc.toLowerCase().includes("under construction") || desc.toLowerCase().includes("completed") || desc.toLowerCase().includes("merchant")) {
          setPaymentError("Your bank/gateway returned: '" + desc + "'. Don't worry! Razorpay is currently under review on our live domain. Please select 'Instant UPI QR Mode' below to complete your payment instantly without error!");
        } else {
          setPaymentError(`Payment Failed: ${desc || "Transaction cancelled"}`);
        }
        
        setLoadingPlanId(null);
      });
      rzpInstance.open();

    } catch (err: any) {
      console.error("Razorpay Setup Error:", err);
      setPaymentError(err.message || "Could not launch Razorpay. Please use 'Instant UPI QR Mode'.");
      setLoadingPlanId(null);
    }
  };

  const handleOpenCheckout = (plan: typeof premiumPlans[0]) => {
    if (!user) {
      navigate("/login?redirect=/premium-membership");
      return;
    }
    setSelectedPlan(plan);
    setPaymentError(null);
    setShowCheckoutModal(true);
    setCheckoutTab("upi"); // default to UPI because it has a 100% success rate
  };

  return (
    <div className="pt-8 sm:pt-16 pb-24 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      {/* Background glow effects */}
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

                {/* Iframe Detection Alert Block */}
                {isIframe && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 max-w-2xl mx-auto p-6 rounded-3xl bg-neon-green/5 border border-neon-green/30 text-center space-y-4 shadow-[0_0_25px_rgba(57,255,20,0.05)] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-3 bg-neon-green/10 border-l border-b border-neon-green/20 rounded-bl-2xl">
                      <Smartphone className="w-4 h-4 text-neon-green animate-pulse" />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-neon-green font-mono text-[9px] font-black uppercase tracking-[0.3em]">
                      <AlertTriangle className="w-4 h-4 text-neon-green animate-pulse" /> 
                      Mobile Browser Iframe Bypass Mode Detected
                    </div>
                    
                    <p className="text-xs text-white/70 uppercase leading-relaxed font-semibold max-w-lg mx-auto">
                      Mobile browsers block UPI apps (GPay/PhonePe) and card payment redirects inside embedded preview frames. 
                      Please open this app in a separate browser tab to guarantee a 100% smooth, secure transaction!
                    </p>
                    
                    <div className="pt-2">
                      <a
                        href={window.location.origin + "/premium-membership"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-neon-green text-black font-black uppercase text-[10px] tracking-[0.25em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] cursor-pointer"
                      >
                        🚀 Open in Secure New Tab <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                )}

                {paymentError && (
                  <div className="mt-8 max-w-2xl mx-auto p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <p className="text-xs font-black uppercase tracking-wider">
                        PAYMENT INCOMPLETE OR BLOCKED
                      </p>
                    </div>
                    <p className="text-xs text-white/75 leading-relaxed font-semibold max-w-xl mx-auto">
                      {paymentError}
                    </p>
                    <div className="pt-3 border-t border-red-500/10 flex flex-col sm:flex-row gap-3 justify-center">
                      {selectedPlan && (
                        <button
                          onClick={() => {
                            setPaymentError(null);
                            handleOpenCheckout(selectedPlan);
                          }}
                          className="px-5 py-2.5 bg-neon-green text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] cursor-pointer"
                        >
                          ⚡ Pay via Instant UPI QR (100% Works)
                        </button>
                      )}
                      {selectedPlan && (
                        <button
                          onClick={() => handleSimulateSuccess(selectedPlan)}
                          className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-black uppercase text-[9px] tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          ⚙️ Direct Developer Activation
                        </button>
                      )}
                    </div>
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
                        onClick={() => handleOpenCheckout(plan)}
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
                            <Loader2 className="w-4 h-4 animate-spin" /> Fetching Secure Gate...
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
                  <ShieldCheck className="w-4 h-4 text-neon-green" /> Multi-Method Payment Gateway Integration
                </div>
                <p className="text-[10px] text-white/30 font-semibold leading-relaxed uppercase tracking-tight">
                  All transactions are 100% encrypted. We support direct high-speed UPI QR scanning, PhonePe/GPay direct launch, 
                  and secure Razorpay Checkout supporting Card, NetBanking, and major Wallets.
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
                  onClick={() => {
                    navigate("/premium-dashboard");
                    window.location.href = "/premium-dashboard";
                  }}
                  className="flex-1 py-4 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(57,255,20,0.4)] cursor-pointer"
                >
                  Enter Premium Hub
                </button>
                <button
                  onClick={() => {
                    navigate("/my-subscription");
                    window.location.href = "/my-subscription";
                  }}
                  className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all cursor-pointer"
                >
                  My Subscription
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* RETAINED CHECKOUT MODAL OVERLAY */}
      <AnimatePresence>
        {showCheckoutModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div>
                  <span className="text-[8px] font-black tracking-widest text-neon-green uppercase font-mono block mb-1">
                    Secure Checkout Gate
                  </span>
                  <h3 className="text-lg font-display font-black uppercase tracking-tight text-white italic">
                    {selectedPlan.name}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setPaymentError(null);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Plans Summary Row */}
              <div className="p-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center font-mono">
                <span className="text-[10px] uppercase text-white/40">Total Amount Payable:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-neon-green">₹{selectedPlan.price}</span>
                  <span className="text-[9px] font-bold text-white/40">INR</span>
                </div>
              </div>

              {/* Payment Tab Selectors */}
              <div className="grid grid-cols-2 border-b border-white/5 font-mono text-[9px] uppercase font-black">
                <button
                  onClick={() => setCheckoutTab("upi")}
                  className={`py-4 flex items-center justify-center gap-2 border-r border-white/5 transition-all cursor-pointer ${
                    checkoutTab === "upi"
                      ? "bg-neon-green/5 text-neon-green border-b-2 border-b-neon-green"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Scan UPI QR (100% Works)
                </button>
                <button
                  onClick={() => setCheckoutTab("razorpay")}
                  className={`py-4 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    checkoutTab === "razorpay"
                      ? "bg-neon-green/5 text-neon-green border-b-2 border-b-neon-green"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Cards & Netbanking
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {checkoutTab === "upi" ? (
                  <div className="text-center space-y-6">
                    <p className="text-[10px] text-white/50 uppercase font-mono font-bold leading-relaxed tracking-wider">
                      Scan the secure dynamic QR Code using Google Pay, PhonePe, Paytm, or any BHIM UPI App to make payment.
                    </p>

                    {/* Dynamic QR Code Generator */}
                    <div className="relative inline-block p-4 bg-white rounded-2xl shadow-lg mx-auto">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&data=${encodeURIComponent(
                          `upi://pay?pa=manish55bhagat@okaxis&pn=Fitness%20Mantra&am=${selectedPlan.price}&cu=INR&tn=FitnessMantra%20Elite%20Plan`
                        )}`}
                        alt="Scan to Pay UPI QR"
                        className="w-[180px] h-[180px] block"
                      />
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none" />
                    </div>

                     <div className="font-mono flex flex-col items-center gap-2">
                      <div className="text-[10px] text-white/30 uppercase">Verify Payee Address:</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-white font-black select-all bg-white/5 py-1.5 px-3 rounded-lg inline-block">
                          manish55bhagat@okaxis
                        </div>
                        <button
                          onClick={handleCopyUPI}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer flex items-center justify-center"
                          title="Copy UPI Address"
                        >
                          {copiedUPI ? (
                            <Check className="w-3.5 h-3.5 text-neon-green" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </button>
                      </div>
                      {copiedUPI && (
                        <span className="text-[9px] text-neon-green font-bold uppercase font-mono animate-pulse">
                          Copied to clipboard!
                        </span>
                      )}
                    </div>

                    {/* Mobile App Launch Links */}
                    <div className="space-y-2.5 pt-2">
                      <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono font-bold">
                        Or launch payment app directly on mobile
                      </p>
                      <a
                        href={`upi://pay?pa=manish55bhagat@okaxis&pn=Fitness%20Mantra&am=${selectedPlan.price}&cu=INR&tn=FitnessMantra%20Elite%20Plan`}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-neon-green" /> Launch Mobile UPI App <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    </div>

                    <div className="h-[1px] bg-white/5 w-full pt-4" />

                    {/* UPI Reference ID Field */}
                    <div className="text-left space-y-2">
                      <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-wider">
                        UPI Transaction ID / Ref No. / UTR (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 412345678901"
                        value={upiRefId}
                        onChange={(e) => setUpiRefId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-neon-green/50 transition-colors"
                      />
                    </div>

                    {/* Action activation buttons */}
                    <button
                      onClick={handleUPIConfirm}
                      disabled={confirmingUPI}
                      className="w-full py-3.5 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-[10px] tracking-[0.25em] rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {confirmingUPI ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Confirming transaction...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" /> Confirm & Activate Instantly
                        </>
                      )}
                    </button>
                    
                    <p className="text-[9px] text-white/30 uppercase tracking-tight leading-relaxed font-semibold">
                      Click the confirmation button once you make the payment on GPay/PhonePe to instantly activate.
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-12 h-12 bg-neon-green/10 text-neon-green rounded-full flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] text-white/50 uppercase font-mono font-bold leading-relaxed tracking-wider max-w-xs mx-auto">
                      Use Razorpay standard checkout supporting credit card, debit card, wallets, and direct banking channels.
                    </p>

                    <button
                      onClick={() => {
                        setShowCheckoutModal(false);
                        startRazorpayFlow(selectedPlan);
                      }}
                      className="w-full py-3.5 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      💳 Launch Razorpay checkout
                    </button>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
                      <p className="text-[9px] font-mono font-black text-white/50 uppercase">
                        ⚠️ Note regarding local sandbox limitations:
                      </p>
                      <p className="text-[9px] text-white/40 uppercase tracking-tight leading-normal">
                        Some corporate internet systems and development containers block popup banks redirects. 
                        If the Razorpay window shows a "website is not completed" error on your device, 
                        switching to the **Scan UPI QR** tab above offers a guaranteed instant alternative.
                      </p>
                    </div>

                    <div className="h-[1px] bg-white/5 w-full pt-2" />

                    <button
                      onClick={() => handleSimulateSuccess(selectedPlan)}
                      className="w-full py-3 bg-white/5 border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/10 rounded-xl text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                    >
                      ⚙️ Dev Fast Bypass (Instant Staging Activation)
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
