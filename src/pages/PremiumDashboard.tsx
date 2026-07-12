import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  Sparkles, ShieldCheck, Dumbbell, Apple, Clock, Calendar, 
  Tv, Award, ArrowRight, Star, Heart, Lock, ShieldAlert,
  ArrowUpRight, MessageSquare, BrainCircuit
} from "lucide-react";
import { motion } from "motion/react";

export default function PremiumDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Protect page: Must be logged in, must have active elite/premium membership
  const hasActiveElite = 
    profile?.subscriptionStatus &&
    profile?.subscriptionStatus !== "Free" &&
    profile?.subscriptionStatus !== "Free Plan" &&
    profile?.subscriptionExpiry && 
    new Date(profile.subscriptionExpiry) > new Date();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-deep-black">
        <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(57,255,20,0.3)]"></div>
      </div>
    );
  }

  if (!user || !hasActiveElite) {
    return (
      <div className="py-24 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden flex items-center justify-center px-4">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-md w-full glass-panel border-white/5 bg-black/40 p-8 rounded-3xl text-center shadow-2xl relative z-10">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-[9px] font-black text-red-400 tracking-[0.4em] uppercase font-mono block mb-2">Access Restrained</span>
          <h2 className="text-3xl font-display font-black uppercase tracking-tight italic mb-4">PREMIUM ZONE</h2>
          <p className="text-white/40 text-xs font-semibold leading-relaxed mb-8 uppercase">
            This workspace contains private, subscriber-only nutrition metrics, training programs, 
            and premium tools. Unlock instant access now by choosing an elite subscription.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/premium-membership")}
              className="w-full py-3.5 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(57,255,20,0.4)] cursor-pointer"
            >
              See subscription plans
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 border border-white/10 hover:bg-white/5 text-white/60 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate membership expiry details
  const expiryDate = new Date(profile.subscriptionExpiry!);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="py-12 sm:py-20 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      {/* Background radial accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-green/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header section with Premium Welcome Card */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-neon-green" />
                <span className="text-[9px] font-black text-neon-green uppercase tracking-[0.5em] font-mono">
                  Elite Inner Circle Dashboard
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter italic">
                WELCOME BACK, <span className="text-neon-green">{profile.fullName.split(" ")[0]}</span>
              </h1>
            </div>

            <div className="bg-neon-green/10 border border-neon-green/20 rounded-2xl px-5 py-3 flex items-center gap-4 font-mono">
              <div>
                <div className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">
                  Active Subscription Expiry
                </div>
                <div className="text-xs font-black text-white">
                  {expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="text-right">
                <div className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">
                  Remaining
                </div>
                <div className="text-xs font-black text-neon-green">
                  {daysRemaining} DAYS
                </div>
              </div>
            </div>
          </div>

          {/* Core Trust Alert */}
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-neon-green shrink-0" />
              <p className="text-xs text-white/60 font-semibold uppercase tracking-tight">
                Your premium signature has been verified on the blockchain gateway ledger.
              </p>
            </div>
            <Link 
              to="/my-subscription" 
              className="text-[9px] font-black text-neon-green uppercase tracking-widest hover:underline flex items-center gap-1 font-mono"
            >
              Subscription Receipts <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Premium Core Sections (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Card 1: Premium Workout Routines */}
          <div className="md:col-span-2 glass-panel border-white/5 bg-white/[0.01] p-8 sm:p-10 rounded-3xl flex flex-col justify-between hover:border-neon-green/10 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-neon-green/10 text-neon-green">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight italic text-white">
                  Elite Natural Body Transformation Workouts
                </h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-semibold uppercase mb-8">
                Unrestricted premium routines crafted specifically for natural, athletic fat-burning and muscle design. 
                Optimized by elite sports scientists.
              </p>

              <div className="space-y-3 font-mono text-[10px] uppercase">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                  <span className="text-white/60 font-black">1. Delta Peak Compound Protocol</span>
                  <span className="text-neon-green font-bold">52 Mins / Heavy Volume</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                  <span className="text-white/60 font-black">2. V-Taper Apex Hypertrophy</span>
                  <span className="text-neon-green font-bold">45 Mins / Pure Density</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                  <span className="text-white/60 font-black">3. Aesthetic Core Rip Shredder</span>
                  <span className="text-neon-green font-bold">30 Mins / High Burn</span>
                </div>
              </div>
            </div>

            <Link
              to="/programs"
              className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neon-green group-hover:gap-3 transition-all"
            >
              Explore Workout Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Premium Meal Customization */}
          <div className="glass-panel border-white/5 bg-white/[0.01] p-8 sm:p-10 rounded-3xl flex flex-col justify-between hover:border-neon-green/10 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Apple className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight italic text-white">
                  Elite Diet customization
                </h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-semibold uppercase mb-8">
                Your premium status grants you instant access to tailor-made macro split calculations 
                and private guides for Indian natural bodybuilders.
              </p>

              <div className="space-y-4 font-mono text-[11px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-white/40">Daily Macro Profile:</span>
                  <span className="text-white font-bold">40% P / 40% C / 20% F</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-white/40">Ideal Target Calorie cap:</span>
                  <span className="text-white font-bold">1,900 - 2,200 kCal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Premium PDF updates:</span>
                  <span className="text-neon-green font-black">Enabled (2x Monthly)</span>
                </div>
              </div>
            </div>

            <Link
              to="/diet"
              className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:gap-3 transition-all"
            >
              Create custom Meal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Exclusive Feature Section (Interactive AI Sandbox) */}
        <div className="glass-panel border-white/5 bg-white/[0.01] p-8 sm:p-10 rounded-3xl mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-neon-green font-mono text-[9px] font-black uppercase tracking-widest mb-2">
                <BrainCircuit className="w-4 h-4" /> Unrestricted AI Coach Access
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tighter italic text-white">
                INSTANT VISUAL BIOMETRIC & FORM FEEDBACK
              </h3>
            </div>
            <Link
              to="/ai-assistant"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-neon-green/30 hover:text-neon-green rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Consult AI Coach Now
            </Link>
          </div>

          <p className="text-xs text-white/40 leading-relaxed font-semibold uppercase">
            Your Elite status bypasses all queue limits and uses the high-availability model context. 
            You can query meal recipes, analyze workout postures, verify daily micro-nutrition splits, 
            and calculate dynamic bio-targets in real time.
          </p>
        </div>

      </div>
    </div>
  );
}
