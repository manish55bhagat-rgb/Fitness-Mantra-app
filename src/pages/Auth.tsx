import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Activity, Mail, Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Dumbbell } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AuthPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Tab: "signin" | "signup" | "forgot"
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");

  // Inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // If already logged in, redirect directly
  React.useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Success will trigger redirect via the useEffect
    } catch (err: any) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are strictly required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please specify a valid email address (e.g., name@domain.com).");
      return;
    }
    if (password.length < 6) {
      setError("Password must consist of at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(fullName, email, password);
      setMessage("Account generated successfully!");
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // Success triggers user change -> navigates
    } catch (err: any) {
      setError("Google connection was bypassed or blocked. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email) {
      setError("Please specify email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("A password reset transmission has been sent to your inbox.");
    } catch (err: any) {
      setError(err?.message || "Error processing password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-green/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-10 border-white/5 relative overflow-hidden"
        >
          {/* Top Logo and Tag */}
          <div className="text-center mb-10">
            <div className="inline-flex w-12 h-12 bg-neon-green rounded-xl items-center justify-center rotate-3 mb-6 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
              <Activity className="text-black w-7 h-7" />
            </div>
            
            <h1 className="text-4xl font-display font-black uppercase tracking-tighter italic mb-2">
              {tab === "signin" && "System Ingress"}
              {tab === "signup" && "Initiate Profile"}
              {tab === "forgot" && "Reset Protocol"}
            </h1>
            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase font-mono">
              {tab === "signin" && "Authenticate your core parameters"}
              {tab === "signup" && "Join the biological optimization collective"}
              {tab === "forgot" && "Recover system credentials"}
            </p>
          </div>

          {/* Feedback messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6 text-xs uppercase font-bold tracking-wide"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-neon-green/10 border border-neon-green/20 text-neon-green p-4 rounded-xl flex items-start gap-3 mb-6 text-xs uppercase font-bold tracking-wide"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL MODULE"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SECURITY PASS"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setTab("forgot")}
                  className="text-[9px] font-black uppercase text-white/20 hover:text-white transition-colors tracking-widest font-mono"
                >
                  Forgot your pass?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-neon-green text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Establish Interface"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="FULL BIOLOGICAL NAME"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL DESIGNATION"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="CHOOSE SECURITY PASS (6+ CHR)"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-[#confirm]:focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="CONFIRM DATA PASS"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-neon-green text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Generating Module..." : "Synthesize Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="REGISTERED EMAIL ADDRESS"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-neon-green text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Sending Protocol..." : "Transmit Reset Signal"}
                <KeyRound className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setTab("signin")}
                  className="text-[9px] font-black uppercase text-neon-green hover:underline tracking-widest font-mono"
                >
                  Return to ingress port
                </button>
              </div>
            </form>
          )}

          {/* Social login line */}
          {tab !== "forgot" && (
            <>
              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-white/5 flex-grow" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">or integrate</span>
                <div className="h-px bg-white/5 flex-grow" />
              </div>

              <button 
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-0.275 1.562-1.882 4.582-6.887 4.582-4.321 0-7.85-3.578-7.85-8s3.529-8 7.85-8c2.46 0 4.103 1.025 5.044 1.926l3.227-3.103c-2.073-1.933-4.757-3.103-8.271-3.103-6.633 0-12 5.367-12 12s5.367 12 12 12c6.933 0 11.52-4.875 11.52-11.727 0-0.783-0.082-1.391-0.18-1.996h-11.343z" />
                </svg>
                Google Protocol-In
              </button>
            </>
          )}

          {/* Toggle Footers */}
          <div className="text-center mt-10 p-5 bg-white/[0.01] rounded-2xl border border-white/[0.03]">
            {tab === "signin" ? (
              <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">
                Unregistered bio-entity?{" "}
                <button 
                  onClick={() => setTab("signup")} 
                  className="text-neon-green hover:underline cursor-pointer"
                >
                  Create Identity
                </button>
              </span>
            ) : tab === "signup" ? (
              <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">
                Existing biometric profile?{" "}
                <button 
                  onClick={() => setTab("signin")} 
                  className="text-neon-green hover:underline cursor-pointer"
                >
                  Gate Ingress
                </button>
              </span>
            ) : null}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
