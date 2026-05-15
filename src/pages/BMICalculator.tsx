import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Calculator, TrendingUp, User, Weight, Ruler } from "lucide-react";

import { generateContent } from "../services/ai";

export default function BMICalculator() {
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [goal, setGoal] = useState<string>("General Fitness");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<string>("");

  const calculateBMI = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const val = w / (h * h);
      setBmi(parseFloat(val.toFixed(1)));
      
      if (val < 18.5) setCategory("Underweight");
      else if (val < 25) setCategory("Normal");
      else if (val < 30) setCategory("Overweight");
      else setCategory("Obese");

      // AI Recommendation
      setLoading(true);
      try {
        const prompt = `Act as an elite fitness coach for Fitness Mantra (Owner: Manish Bhagat). 
        Suggest a short, motivational workout and diet tip for someone with:
        Gender: ${gender}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}.
        Keep it professional, futuristic, and concise (max 3 sentences).`;
        
        const result = await generateContent(prompt);
        setRecommendation(result);
      } catch (e) {
        console.error(e);
        setRecommendation("Optimization advice unavailable. Check network link.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "Normal": return "text-neon-green";
      case "Underweight": return "text-blue-400";
      case "Overweight": return "text-orange-400";
      case "Obese": return "text-red-500";
      default: return "text-white";
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-black mb-4 tracking-tighter uppercase">
            Body <span className="text-neon-green">Metrics</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Analyze your physical architecture. Input your current data for instant 
            scientific classification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Calculator Card */}
          <div className="glass-card p-10 relative overflow-hidden neon-border">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Calculator className="w-40 h-40" />
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 flex items-center gap-2">
                  <Weight className="w-3 h-3" /> Body Weight (kg)
                </label>
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-white/5 border-b border-white/10 py-4 text-4xl font-display font-black focus:outline-none focus:border-neon-green/50 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 flex items-center gap-2">
                  <Ruler className="w-3 h-3" /> Body Height (cm)
                </label>
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-white/5 border-b border-white/10 py-4 text-4xl font-display font-black focus:outline-none focus:border-neon-green/50 transition-colors text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <div className="w-1/2">
                  <label className="block text-[8px] font-black uppercase tracking-widest text-white/20 mb-2 ml-1">Gender</label>
                  <div className="flex bg-os-black/80 rounded-xl p-1 border border-white/5">
                    <button
                      onClick={() => setGender("Male")}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${gender === "Male" ? "bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "text-gray-500 hover:text-white"}`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setGender("Female")}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${gender === "Female" ? "bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "text-gray-500 hover:text-white"}`}
                    >
                      Female
                    </button>
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-[8px] font-black uppercase tracking-widest text-white/20 mb-2 ml-1">Protocol Goal</label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-os-black/80 border border-white/5 rounded-xl py-2 px-3 text-[10px] font-black uppercase focus:outline-none focus:border-neon-green/30 transition-colors appearance-none cursor-pointer text-white/70"
                  >
                    <option value="General Fitness">General Fitness</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Fat Loss & Toning">Fat Loss & Toning</option>
                    <option value="Build Muscle">Build Muscle</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Strength & Power">Strength & Power</option>
                    <option value="Body Recomposition">Body Recomposition</option>
                    <option value="Athletic Performance">Athletic Performance</option>
                    <option value="Endurance & Stamina">Endurance & Stamina</option>
                    <option value="Functional Training">Functional Training</option>
                    <option value="Flexibility & Yoga">Flexibility & Yoga</option>
                    <option value="Marathon Training">Marathon Training</option>
                    <option value="High Intensity (HIIT)">High Intensity (HIIT)</option>
                    <option value="Post-Pregnancy Fitness">Post-Pregnancy Fitness</option>
                    <option value="Active Aging (Senior)">Active Aging (Senior)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={calculateBMI}
                className="w-full neon-button py-6 text-base tracking-[0.2em] font-black"
              >
                GENERATE ANALYSIS
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {bmi ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-10 bg-neon-green/5 border-neon-green/20 text-center neon-border"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Neural Data Output</p>
                    <h2 className="text-8xl font-display font-black text-white mb-2 tracking-tighter">{bmi}</h2>
                    <div className={`text-xl font-black uppercase tracking-[0.3em] mb-6 ${getCategoryColor()}`}>{category}</div>
                  
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_10px_#39FF14]" />
                      </div>
                    ) : recommendation && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 text-[13px] italic leading-relaxed mb-6 border-l-2 border-neon-green/40 pl-6 py-3 text-left bg-white/[0.02] rounded-r-xl"
                      >
                        <span className="text-neon-green font-black not-italic text-[10px] uppercase tracking-widest block mb-1">Neural Advice</span> "{recommendation}"
                      </motion.div>
                    )}

                    <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6 text-left">
                      <div className="p-5 bg-os-black/60 rounded-2xl border border-white/5 group hover:bg-os-black transition-colors">
                        <p className="text-[9px] uppercase text-white/20 font-black mb-1.5 tracking-widest">Ideal Range</p>
                        <p className="text-sm font-black group-hover:text-neon-green transition-colors">65 - 78 kg</p>
                      </div>
                      <div className="p-5 bg-os-black/60 rounded-2xl border border-white/5 group hover:bg-os-black transition-colors">
                        <p className="text-[9px] uppercase text-white/20 font-black mb-1.5 tracking-widest">Efficiency</p>
                        <p className="text-sm font-black text-neon-green group-hover:drop-shadow-[0_0_5px_#39FF14]">OPTIMAL</p>
                      </div>
                    </div>
                </motion.div>
              ) : (
                <div className="glass-card p-10 h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 text-gray-600" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Result will appear here</p>
                </div>
              )}
            </AnimatePresence>

            <div className="glass-card p-8 border-white/5">
              <h3 className="font-display font-bold text-sm uppercase tracking-[0.2em] mb-6">BMI Classification</h3>
              <div className="space-y-4">
                {[
                  { label: "Underweight", range: "< 18.5", color: "bg-blue-400" },
                  { label: "Normal", range: "18.5 - 24.9", color: "bg-neon-green" },
                  { label: "Overweight", range: "25 - 29.9", color: "bg-orange-400" },
                  { label: "Obese", range: "> 30", color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color} ${item.label === category ? "animate-ping" : ""}`} />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-600">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
