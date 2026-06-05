import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Activity, Mail, Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Dumbbell, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "../lib/utils";

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
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");

  // Eye toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Helper validators
  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const translateFirebaseAuthError = (err: any): string => {
    const code = err?.code || "";
    const msg = err?.message || "";
    
    if (
      code.includes("wrong-password") || 
      code.includes("user-not-found") || 
      code.includes("invalid-credential") ||
      msg.includes("wrong-password") ||
      msg.includes("user-not-found") ||
      msg.includes("invalid-credential") ||
      msg.toLowerCase().includes("invalid email or password")
    ) {
      return "Invalid email or password. Please try again.";
    }
    
    if (code.includes("email-already-in-use") || msg.includes("email-already-in-use")) {
      return "This email is already registered. Please sign in instead.";
    }
    
    if (code.includes("weak-password") || msg.includes("weak-password")) {
      return "The password is too weak. Please use at least 8 characters.";
    }

    if (code.includes("too-many-requests") || msg.includes("too-many-requests")) {
      return "Too many failed attempts. Access has been temporarily restricted. Please try again later.";
    }

    return "Invalid email or password. Please try again.";
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return "";
    if (pass.length < 8) return "Weak";
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    if (hasLetters && hasNumbers && hasSpecial) return "Strong";
    if (hasLetters && hasNumbers) return "Medium";
    return "Weak";
  };

  const emailInvalid = email.length > 0 && !isValidEmail(email);
  const passwordInvalid = password.length > 0 && password.length < 8;
  const confirmPasswordInvalid = tab === "signup" && confirmPassword.length > 0 && confirmPassword !== password;

  // If already logged in, redirect directly
  React.useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  // Show "Please login to access this page." message
  React.useEffect(() => {
    const hasRedirect = searchParams.get("redirect");
    if (hasRedirect && !user) {
      setError("Please login to access this page.");
    }
  }, [searchParams, user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Password cannot be empty");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. name@gmail.com)");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Success will trigger redirect via the useEffect
    } catch (err: any) {
      setError(translateFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!fullName.trim()) {
      setError("Please enter your Full Name.");
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. name@gmail.com)");
      return;
    }
    if (!password) {
      setError("Password cannot be blank.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!gender) {
      setError("Please select a Gender.");
      return;
    }
    const ageVal = parseInt(age);
    if (isNaN(ageVal) || ageVal <= 0 || ageVal > 120) {
      setError("Please enter a valid age.");
      return;
    }
    const heightVal = parseFloat(height);
    if (isNaN(heightVal) || heightVal <= 30 || heightVal > 300) {
      setError("Please enter a valid height (e.g. 175).");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(fullName, email, password, gender, ageVal, heightVal);
      setMessage("Account created successfully. Welcome to Fitness Mantra!");
      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    } catch (err: any) {
      setError(translateFirebaseAuthError(err));
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
      setError("Please enter a registered email address");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("Password reset link sent to your email. Check your inbox.");
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
              {tab === "signin" && "Welcome Back"}
              {tab === "signup" && "Initiate Profile"}
              {tab === "forgot" && "Reset Protocol"}
            </h1>
            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase font-mono">
              {tab === "signin" && "Sign in to your account"}
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
                <Mail className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4", emailInvalid && "text-red-500")} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={cn(
                    "w-full bg-white/[0.02] border rounded-2xl py-5 pl-14 pr-5 focus:outline-none font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white",
                    emailInvalid 
                      ? "border-red-500/80 focus:border-red-500 bg-red-500/[0.02]" 
                      : "border-white/5 focus:border-neon-green/30"
                  )}
                  required
                />
                {emailInvalid && (
                  <p className="text-[9px] font-black uppercase text-red-400 mt-2 tracking-wider">
                    Please enter a valid email address (e.g. name@gmail.com)
                  </p>
                )}
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-neon-green/30 rounded-2xl py-5 pl-14 pr-12 focus:outline-none font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                disabled={loading || !isValidEmail(email)}
                className="w-full bg-neon-green text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
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
                <Mail className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4", emailInvalid && "text-red-500")} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL DESIGNATION"
                  className={cn(
                    "w-full bg-white/[0.02] border rounded-2xl py-5 pl-14 pr-5 focus:outline-none font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white",
                    emailInvalid 
                      ? "border-red-500/80 focus:border-red-500 bg-red-500/[0.02]" 
                      : "border-white/5 focus:border-neon-green/30"
                  )}
                  required
                />
                {emailInvalid && (
                  <p className="text-[9px] font-black uppercase text-red-400 mt-2 tracking-wider">
                    Please enter a valid email address (e.g. name@gmail.com)
                  </p>
                )}
              </div>

              <div className="relative group">
                <Lock className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4", passwordInvalid && "text-red-400")} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="CHOOSE SECURITY PASS (8+ CHR)"
                  className={cn(
                    "w-full bg-white/[0.02] border rounded-2xl py-5 pl-14 pr-12 focus:outline-none font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white",
                    passwordInvalid 
                      ? "border-red-500/55 focus:border-red-400 bg-red-500/[0.01]" 
                      : "border-white/5 focus:border-neon-green/30"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {passwordInvalid && (
                  <p className="text-[9px] font-black uppercase text-red-400 mt-2 tracking-wider">
                    Password must be at least 8 characters
                  </p>
                )}
                {password.length > 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[8px] font-black uppercase text-white/40 tracking-wider font-mono">STRENGTH:</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest font-mono",
                      getPasswordStrength(password) === "Weak" && "text-red-400",
                      getPasswordStrength(password) === "Medium" && "text-amber-400",
                      getPasswordStrength(password) === "Strong" && "text-neon-green"
                    )}>
                      {getPasswordStrength(password)}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative group">
                <Lock className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4", confirmPasswordInvalid && "text-red-400")} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="CONFIRM DATA PASS"
                  className={cn(
                    "w-full bg-white/[0.02] border rounded-2xl py-5 pl-14 pr-12 focus:outline-none font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white",
                    confirmPasswordInvalid 
                      ? "border-red-500/55 focus:border-red-400 bg-red-500/[0.01]" 
                      : "border-white/5 focus:border-neon-green/30"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {confirmPasswordInvalid && (
                  <p className="text-[9px] font-black uppercase text-red-100 bg-red-950/40 p-2.5 rounded-lg border border-red-500/20 mt-2 tracking-wider">
                     Passwords do not match
                  </p>
                )}
              </div>

              {/* Added Biological Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-wider">GENDER</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl h-[50px] px-3 font-semibold text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-neon-green/30 cursor-pointer appearance-none"
                  >
                    <option value="Male" className="bg-deep-black text-white">MALE</option>
                    <option value="Female" className="bg-deep-black text-white">FEMALE</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-wider font-mono">AGE</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="AGE"
                    className="w-full bg-black/40 border border-white/5 rounded-xl h-[50px] px-3 font-semibold text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-neon-green/30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-wider font-mono">HEIGHT (CM)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="HEIGHT"
                    className="w-full bg-black/40 border border-white/5 rounded-xl h-[50px] px-3 font-semibold text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-neon-green/30"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !isValidEmail(email)}
                className="w-full bg-neon-green text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Synthesizing Account...</span>
                  </div>
                ) : "Synthesize Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative group">
                <Mail className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors w-4 h-4", emailInvalid && "text-red-500")} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  className={cn(
                    "w-full bg-white/[0.02] border rounded-2xl py-5 pl-14 pr-5 focus:outline-none font-black text-[10px] uppercase tracking-[0.25em] transition-all text-white",
                    emailInvalid 
                      ? "border-red-500/80 focus:border-red-500 bg-red-500/[0.02]" 
                      : "border-white/5 focus:border-neon-green/30"
                  )}
                  required
                />
                {emailInvalid && (
                  <p className="text-[9px] font-black uppercase text-red-500 mt-2 tracking-wider">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading || !isValidEmail(email)}
                className="w-full bg-neon-green text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all duration-500 hover:shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : "Send Reset Link"}
                {!loading && <KeyRound className="w-4 h-4" />}
              </button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setTab("signin")}
                  className="text-[9px] font-black uppercase text-neon-green hover:underline tracking-widest font-mono cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Social login line */}
          {tab !== "forgot" && (
            <>
              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-white/5 flex-grow" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Or continue with</span>
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
                Continue with Google
              </button>
            </>
          )}

          {/* Toggle Footers */}
          <div className="text-center mt-10 p-5 bg-white/[0.01] rounded-2xl border border-white/[0.03]">
            {tab === "signin" ? (
              <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">
                Don't have an account?{" "}
                <button 
                  onClick={() => setTab("signup")} 
                  className="text-neon-green hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : tab === "signup" ? (
              <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">
                Existing biometric profile?{" "}
                <button 
                  onClick={() => setTab("signin")} 
                  className="text-neon-green hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : null}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
