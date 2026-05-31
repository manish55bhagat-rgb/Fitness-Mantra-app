import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Target, Activity, Apple, ShieldAlert, Sparkles, 
  ChevronRight, ChevronLeft, Check, Compass 
} from "lucide-react";

export default function OnboardingModal() {
  const { user, profile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Show onboarding only if user is logged in, profile exists, role is 'user', and they haven't onboarded yet.
  const shouldShow = user && profile && profile.role === "user" && !profile.isOnboarded;

  const [step, setStep] = useState(1);
  const totalSteps = 5; // 4 input steps + 1 Done screen

  // Form states
  const [goal, setGoal] = useState("Muscle Gain");
  const [age, setAge] = useState(profile?.age || 25);
  const [weight, setWeight] = useState(profile?.weight || 68);
  const [height, setHeight] = useState(profile?.height || 172);
  const [diet, setDiet] = useState("Veg");
  const [medical, setMedical] = useState("");
  const [saving, setSaving] = useState(false);

  if (!shouldShow) return null;

  const goalsList = [
    { name: "Weight Loss", icon: Target, desc: "Shed excess fat tissues & trigger high metabolic burn state." },
    { name: "Muscle Gain", icon: Activity, desc: "Aesthetic muscle hypertrophy & dynamic power gains." },
    { name: "Endurance", icon: Compass, desc: "Enhance VO2 Max, stamina & prolonged biological efficiency." },
    { name: "General Fitness", icon: Sparkles, desc: "Upgrade overall somatic vitals & holistic longevity." }
  ];

  const dietsList = [
    { name: "Veg", desc: "No meat, poultry, or fish." },
    { name: "Non-Veg", desc: "Includes all food groups & proteins." },
    { name: "Vegan", desc: "Pure plant-based culinary structure." },
    { name: "Keto", desc: "High-fat, ultra-low carb cellular environment." }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((p) => p + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((p) => p - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        goal,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        dietPreference: diet,
        medicalConditions: medical,
        isOnboarded: true
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding saving error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Step Header Component
  const renderProgressBar = () => (
    <div className="flex items-center justify-between gap-2 mb-8">
      {Array.from({ length: totalSteps - 1 }).map((_, idx) => {
        const itemStep = idx + 1;
        const isActive = step >= itemStep;
        const isCurrent = step === itemStep;
        return (
          <div key={idx} className="flex-1 h-1.5 relative rounded-full overflow-hidden bg-white/5">
            <div 
              style={{ width: isActive ? "100%" : "0%" }}
              className={`h-full absolute left-0 top-0 transition-all duration-500 rounded-full ${
                isCurrent 
                  ? "bg-neon-green shadow-[0_0_10px_#39FF14]" 
                  : "bg-neon-green/40"
              }`}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Immersive Blur Backdrop */}
      <div className="absolute inset-0 bg-deep-black/95 backdrop-blur-3xl" />

      {/* Interactive Modal Panel */}
      <div className="relative w-full max-w-xl max-h-[95vh] md:max-h-[90vh] flex flex-col glass-panel border-white/10 bg-black overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] z-10 rounded-[32px]">
        
        {/* Abstract design element background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-neon-green/5 blur-2xl rounded-full pointer-events-none" />

        {/* Header Section */}
        {step < totalSteps && (
          <div className="p-6 pb-0 md:p-10 md:pb-0 shrink-0">
            {renderProgressBar()}
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[9px] font-black tracking-[0.4em] text-neon-green uppercase font-mono">Phase 01 / 04</span>
                <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight italic mt-2">What is your primary goal?</h3>
                <p className="text-white/40 text-[11px] uppercase tracking-wide mt-1">Select the target vector of your physical evolution.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {goalsList.map((g) => {
                  const Icon = g.icon;
                  const isSelected = goal === g.name;
                  return (
                    <button
                      key={g.name}
                      onClick={() => setGoal(g.name)}
                      type="button"
                      className={`flex items-center gap-5 p-5 rounded-2xl border text-left transition-all duration-300 group cursor-pointer ${
                        isSelected 
                          ? "bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.1)]" 
                          : "bg-white/[0.01] border-white/5 hover:border-white/20 text-white"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected ? "bg-neon-green text-black border-neon-green" : "bg-black border-white/10 text-white/40 group-hover:text-white"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-black uppercase tracking-wide text-sm">{g.name}</div>
                        <div className="text-[10px] uppercase font-semibold text-white/40 mt-0.5 tracking-tight">{g.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[9px] font-black tracking-[0.4em] text-neon-green uppercase font-mono">Phase 02 / 04</span>
                <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight italic mt-2">Biological parameters</h3>
                <p className="text-white/40 text-[11px] uppercase tracking-wide mt-1">Input baseline somatic metrics for correct caloric calibration.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Age (Years)</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-sm font-semibold text-white focus:outline-none focus:border-neon-green/30"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Weight (KG)</label>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      min={10}
                      max={300}
                      className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-sm font-semibold text-white focus:outline-none focus:border-neon-green/30 text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Height (CM)</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min={50}
                      max={250}
                      className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-sm font-semibold text-white focus:outline-none focus:border-neon-green/30 text-center"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[9px] font-black tracking-[0.4em] text-neon-green uppercase font-mono">Phase 03 / 04</span>
                <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight italic mt-2">Diet Preference</h3>
                <p className="text-white/40 text-[11px] uppercase tracking-wide mt-1">Configure your daily nutritional spectrum.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {dietsList.map((d) => {
                  const isSelected = diet === d.name;
                  return (
                    <button
                      key={d.name}
                      onClick={() => setDiet(d.name)}
                      type="button"
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 group cursor-pointer ${
                        isSelected 
                          ? "bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.1)]" 
                          : "bg-white/[0.01] border-white/5 hover:border-white/20 text-white"
                      }`}
                    >
                      <Apple className={`w-6 h-6 mb-4 ${isSelected ? "text-neon-green" : "text-white/20 group-hover:text-white"}`} />
                      <div className="font-display font-black uppercase tracking-wide text-sm">{d.name}</div>
                      <div className="text-[9px] uppercase font-semibold text-white/40 mt-1 tracking-tight leading-relaxed">{d.desc}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[9px] font-black tracking-[0.4em] text-neon-green uppercase font-mono">Phase 04 / 04</span>
                <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight italic mt-2">Medical Conditions / Injuries</h3>
                <p className="text-white/40 text-[11px] uppercase tracking-wide mt-1">Specify any medical boundaries, injuries, or concerns.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Medical Disclaimers / Logs</label>
                  <textarea 
                    value={medical}
                    onChange={(e) => setMedical(e.target.value)}
                    placeholder="E.g., None, lower back stiffness occasionally, knee ligament fatigue..."
                    rows={5}
                    className="w-full bg-black border border-white/5 rounded-xl py-4 px-4 text-xs font-semibold leading-relaxed text-white focus:outline-none focus:border-neon-green/30 placeholder:text-white/20"
                  />
                </div>

                <div className="flex items-start gap-3 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl text-[9px] font-black uppercase text-white/30 tracking-wider">
                  <ShieldAlert className="w-5 h-5 text-neon-green shrink-0" />
                  <span className="leading-relaxed">This data allows the AI model and Vedic dietary generators to safely tailor optimization protocols.</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6 space-y-8"
            >
              <div className="w-20 h-20 bg-neon-green/10 border border-neon-green/20 rounded-full flex items-center justify-center mx-auto shadow-glow">
                <Check className="w-10 h-10 text-neon-green" />
              </div>

              <div>
                <h3 className="text-4xl font-display font-black uppercase tracking-tighter italic">Welcome to Fitness Mantra</h3>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mt-2 max-w-sm mx-auto">
                  Your biological vector data has been cleared. The neural optimization algorithms are ready.
                </p>
              </div>

              <div className="max-w-xs mx-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left font-mono space-y-1.5 text-[9px] uppercase tracking-tight text-white/40">
                <div className="flex justify-between">
                  <span>Somatic Goal:</span>
                  <span className="text-neon-green font-black">{goal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nutritional Vector:</span>
                  <span className="text-white/70 font-black">{diet}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age / Somatotype:</span>
                  <span className="text-white/70 font-black">{age} Yrs / Stable</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                disabled={saving}
                className="w-full py-5 bg-neon-green text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:shadow-[0_15px_40px_-5px_rgba(57,255,20,0.4)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer shadow-glow"
              >
                {saving ? "Compiling somatic data..." : "Create Plan"}
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Navigation ButtonsFooter */}
        {step < totalSteps && (
          <div className="p-6 md:p-10 border-t border-white/5 bg-black shrink-0">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={step === 1}
                type="button"
                className={`flex items-center gap-2 px-6 py-3 border font-black uppercase tracking-widest text-[9px] rounded-xl transition-all ${
                  step === 1 
                    ? "border-white/5 text-white/10 cursor-not-allowed" 
                    : "border-white/10 hover:border-white/30 text-white cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                onClick={handleNext}
                type="button"
                className="flex items-center gap-2 px-8 py-3 bg-neon-green text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-glow"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
