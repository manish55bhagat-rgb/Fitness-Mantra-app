import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShieldCheck, Clock, Calendar, Crown, ShieldX, CreditCard, 
  History, ArrowLeft, RefreshCw, Star, Sparkles, HelpCircle 
} from "lucide-react";
import { motion } from "motion/react";

export default function MySubscription() {
  const { user, profile, subscriptions, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-deep-black">
        <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(57,255,20,0.3)]"></div>
      </div>
    );
  }

  // Check subscription status
  const isElite = 
    (profile?.subscriptionStatus === "Architect Elite" || profile?.subscriptionStatus === "Premium Plan") && 
    profile?.subscriptionExpiry && 
    new Date(profile.subscriptionExpiry) > new Date();

  // Calculate days remaining
  let daysRemaining = 0;
  let formattedExpiry = "N/A";
  let formattedStart = "N/A";

  if (profile?.subscriptionExpiry) {
    const expiryDate = new Date(profile.subscriptionExpiry);
    const today = new Date();
    daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    formattedExpiry = expiryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (profile?.accessStartDate) {
    formattedStart = new Date(profile.accessStartDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (subscriptions && subscriptions.length > 0) {
    // Fallback to the latest transaction's purchaseDate
    formattedStart = new Date(subscriptions[0].purchaseDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="py-12 sm:py-20 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Back navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-neon-green" />
            <span className="text-[9px] font-black text-neon-green uppercase tracking-[0.5em] font-mono">
              Secure Account Portal
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tighter italic">
            MY SUBSCRIPTION
          </h1>
        </header>

        {/* Current Plan Status Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Main Status Panel */}
          <div className="md:col-span-2 glass-panel border-white/5 bg-white/[0.01] p-8 sm:p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden">
            {isElite && (
              <div className="absolute top-0 right-0 p-4 bg-neon-green/10 border-l border-b border-neon-green/20 rounded-bl-2xl">
                <Crown className="w-5 h-5 text-neon-green" />
              </div>
            )}

            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">
                Active Membership Plan
              </div>
              <h2 className="text-3xl font-display font-black uppercase tracking-tight italic text-white mb-6">
                {isElite ? "Elite Membership" : "Free Plan Access"}
              </h2>

              <div className="grid grid-cols-2 gap-6 font-mono text-[11px] uppercase">
                <div>
                  <div className="text-white/40 mb-1">Payment Status:</div>
                  <div className={`font-black flex items-center gap-1.5 ${isElite ? "text-neon-green" : "text-white/30"}`}>
                    {isElite ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-neon-green shrink-0" /> PAID
                      </>
                    ) : (
                      <>
                        <ShieldX className="w-4 h-4 text-white/30 shrink-0" /> UNPAID
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-white/40 mb-1">Time Remaining:</div>
                  <div className="text-white font-black">
                    {isElite ? `${daysRemaining} Days` : "Lifetime"}
                  </div>
                </div>
              </div>
            </div>

            {isElite ? (
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between text-[11px] font-mono text-white/60">
                <div>
                  <span className="text-white/30 uppercase">Start Date:</span>{" "}
                  <span className="text-white font-bold">{formattedStart}</span>
                </div>
                <div>
                  <span className="text-white/30 uppercase">Expiry Date:</span>{" "}
                  <span className="text-white font-bold">{formattedExpiry}</span>
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => navigate("/premium-membership")}
                  className="px-6 py-3 bg-neon-green text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] cursor-pointer"
                >
                  Upgrade to Elite Membership
                </button>
              </div>
            )}
          </div>

          {/* Days Remaining Meter widget */}
          <div className="glass-panel border-white/5 bg-white/[0.01] p-8 sm:p-10 rounded-3xl flex flex-col justify-between text-center">
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-6">
                Days Remaining
              </div>
              <div className="text-6xl sm:text-7xl font-display font-black text-neon-green italic leading-none mb-4">
                {isElite ? daysRemaining : "00"}
              </div>
              <p className="text-[10px] text-white/40 uppercase font-mono font-black tracking-wider leading-relaxed">
                {isElite ? "Full Premium Access remains unlocked" : "Basic feature limits applied"}
              </p>
            </div>

            {isElite && (
              <Link
                to="/premium-dashboard"
                className="mt-6 py-3 bg-white/5 border border-white/10 hover:border-neon-green/30 hover:text-neon-green rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Premium Dashboard
              </Link>
            )}
          </div>

        </div>

        {/* Transaction History receipts */}
        <div className="glass-panel border-white/5 bg-white/[0.01] p-8 sm:p-10 rounded-3xl">
          <div className="flex items-center gap-2 mb-8">
            <History className="w-5 h-5 text-white/30" />
            <h3 className="text-xl font-display font-black uppercase tracking-tight italic text-white">
              TRANSACTION RECEIPT HISTORY
            </h3>
          </div>

          {subscriptions && subscriptions.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {subscriptions.map((sub, idx) => {
                const pDate = new Date(sub.purchaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const eDate = new Date(sub.expiryDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={sub.id || idx}
                    className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 font-mono text-[11px]"
                  >
                    <div>
                      <div className="text-white font-black uppercase">{sub.planName}</div>
                      <div className="text-white/30 text-[9px] uppercase tracking-widest mt-1">
                        Receipt Ref: <span className="text-white/60 select-all font-bold">{sub.transactionId}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-8 sm:text-right">
                      <div>
                        <div className="text-white/30 text-[9px] uppercase">Purchased</div>
                        <div className="text-white/80 font-bold">{pDate}</div>
                      </div>
                      <div>
                        <div className="text-white/30 text-[9px] uppercase">Valid Until</div>
                        <div className="text-white/80 font-bold">{eDate}</div>
                      </div>
                      <div>
                        <div className="text-white/30 text-[9px] uppercase">Status</div>
                        <div className="text-neon-green font-black">{sub.paymentStatus.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
              <p className="text-[11px] font-mono text-white/30 uppercase font-bold">
                No active receipts found on account.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
