import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, Activity, Shield, Droplets, Target, User, ArrowRight, Zap, TrendingUp } from "lucide-react";
import { generateContent } from "../services/ai";
import { useLanguage } from "../context/LanguageContext";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const mockProgressData = [
  { month: 'JAN', val: 28.5 },
  { month: 'FEB', val: 27.8 },
  { month: 'MAR', val: 27.2 },
  { month: 'APR', val: 26.5 },
  { month: 'MAY', val: 25.8 },
  { month: 'JUN', val: 24.5 },
];

export default function BMICalculator() {
  const { t, language } = useLanguage();
  const [weight, setWeight] = useState<string>("75");
  const [height, setHeight] = useState<string>("180");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [goal, setGoal] = useState<string>("General Fitness");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<string>("");

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      const val = w / (h * h);
      setBmi(parseFloat(val.toFixed(1)));
      
      if (val < 18.5) {
        setCategory("Underweight");
      } else if (val < 25) {
        setCategory("Normal");
      } else if (val < 30) {
        setCategory("Overweight");
      } else {
        setCategory("Obese");
      }
    } else {
      setBmi(null);
      setCategory("");
    }
  }, [weight, height]);

  const calculateBMI = async () => {
    if (bmi !== null && bmi > 0) {
      setLoading(true);
      try {
        const langName = language === "hi" ? "Hindi (हिंदी)" : language === "mr" ? "Marathi (मराठी)" : "English";
        const prompt = `Act as an elite AI fitness architect for Fitness Mantra. Give highly professional, luxury-toned advice for this profile: BMI ${bmi}, Category ${category}, Gender ${gender}, Goal ${goal}. Focus on bio-optimization. Keep it max 3 sentences. RESPOND ENTIRELY IN ${langName} LANGUAGE.`;
        const result = await generateContent(prompt);
        setRecommendation(result);
      } catch (e) {
        setRecommendation(language === "hi" ? "एआई विश्लेषण प्रणाली बाधित। मैन्युअल रूप से कार्य करें।" : language === "mr" ? "एआय विश्लेषण प्रणाली व्यत्यय आणली. स्वहस्ते कार्य करा." : "AI Analysis link disrupted. Optimize manually.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10">
            <Calculator className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Physiological Audit v2.0</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-10 italic">
            {t("Bmi.Title").split(" ")[0]}<br/><span className="premium-gradient-text uppercase italic">{t("Bmi.Title").split(" ").slice(1).join(" ") || "Metrics"}</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-semibold uppercase tracking-tight leading-relaxed">
            {t("Bmi.Sub")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Data Entry Console */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-12">
            <div className="glass-panel p-12 border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 os-grid opacity-10" />
              
              <div className="relative z-10 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">{t("Bmi.WeightLabel")}</label>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-4 text-5xl font-display font-black focus:outline-none focus:border-neon-green/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">{t("Bmi.HeightLabel")}</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-4 text-5xl font-display font-black focus:outline-none focus:border-neon-green/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">{t("Bmi.GenderLabel")}</label>
                  <div className="flex gap-4">
                    {["Male", "Female"].map(g => (
                      <button 
                        key={g}
                        onClick={() => setGender(g as any)}
                        className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border ${gender === g ? "bg-neon-green text-black border-transparent shadow-[0_10px_30px_rgba(57,255,20,0.3)]" : "bg-white/5 border-white/5 text-white/40 hover:text-white"}`}
                      >
                        {g === "Male" ? t("Bmi.Male") : t("Bmi.Female")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">{t("Bmi.GoalLabel")}</label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 font-black uppercase text-[10px] tracking-[0.2em] focus:outline-none focus:border-neon-green transition-all appearance-none cursor-pointer"
                  >
                    <option value="General Fitness">{t("Bmi.Goal.Fit")}</option>
                    <option value="Weight Loss">{t("Bmi.Goal.Loss")}</option>
                    <option value="Build Muscle">{t("Bmi.Goal.Muscle")}</option>
                    <option value="Endurance">{t("Bmi.Goal.Endu")}</option>
                  </select>
                </div>

                <button 
                  onClick={calculateBMI}
                  className="btn-premium w-full py-8 text-xs group"
                >
                  {t("Bmi.Btn")} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Classification Legend */}
            <div className="glass-panel p-10 border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Underweight", translationKey: "Bmi.Underweight", color: "text-blue-400", val: "< 18.5" },
                { label: "Normal", translationKey: "Bmi.Normal", color: "text-neon-green", val: "18.5 - 24.9" },
                { label: "Overweight", translationKey: "Bmi.Overweight", color: "text-orange-400", val: "25 - 29.9" },
                { label: "Obese", translationKey: "Bmi.Obese", color: "text-red-500", val: "> 30" },
              ].map(item => (
                <div key={item.label} className="text-center group">
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${item.color}`}>{t(item.translationKey)}</div>
                  <div className="text-lg font-black text-white/40 group-hover:text-white transition-colors">{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Viewport */}
          <div className="lg:col-span-12 xl:col-span-7">
            <AnimatePresence mode="wait">
              {bmi ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                >
                  <div className="glass-panel p-16 border-neon-green/20 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-neon-green/[0.02] animate-pulse-soft" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-8 font-mono">Neural Index Summary</p>
                      <h2 className="text-[10rem] md:text-[14rem] font-display font-black leading-none tracking-tighter text-white mb-6 animate-glow">{bmi}</h2>
                      <div className="text-4xl font-display font-black uppercase tracking-[0.4em] italic premium-gradient-text">{t("Bmi." + category)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="glass-panel p-10 border-white/5">
                      <div className="flex items-center gap-4 mb-8">
                        <Zap className="text-neon-green w-5 h-5" />
                        <h4 className="text-xl font-black uppercase tracking-widest">AI ARCHITECT ADVICE</h4>
                      </div>
                      {loading ? (
                        <div className="h-24 flex items-center justify-center">
                          <div className="w-12 h-1 border-t-2 border-neon-green animate-pulse rounded-full" />
                        </div>
                      ) : (
                        <p className="text-lg text-white/40 font-semibold uppercase tracking-tight leading-relaxed italic border-l border-white/10 pl-8">
                          "{recommendation}"
                        </p>
                      )}
                    </div>

                    <div className="glass-panel p-10 border-white/5 space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <TrendingUp className="text-blue-400 w-5 h-5" />
                          <h4 className="text-xl font-black uppercase tracking-widest">PROGRESS ARCHIVE</h4>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 font-mono">Simulated Delta</span>
                      </div>
                      
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockProgressData}>
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis 
                              dataKey="month" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }}
                            />
                            <YAxis hide domain={[20, 30]} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                              itemStyle={{ color: '#39FF14', fontWeight: 900 }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="val" 
                              stroke="#39FF14" 
                              fillOpacity={1} 
                              fill="url(#colorVal)" 
                              strokeWidth={3}
                            />
                            <ReferenceLine y={24.9} stroke="#ffffff10" strokeDasharray="3 3" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between mb-3">
                            <span className="text-[9px] font-black text-white/20 tracking-widest uppercase italic">Target Accuracy Protocol</span>
                            <span className="text-xs font-black text-neon-green">94.2%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "94.2%" }} className="h-full bg-neon-green shadow-glow" />
                          </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                           <span className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase">Metrics Sync Status</span>
                           <span className="text-[8px] font-black text-neon-green tracking-widest uppercase">SYD-ALPHA ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-panel h-[700px] flex flex-col items-center justify-center border-white/5 text-center px-12 group">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-12 group-hover:border-neon-green/30 transition-all duration-1000 group-hover:rotate-45">
                    <Activity className="w-12 h-12 text-white/10 group-hover:text-neon-green/40 transition-colors" />
                  </div>
                  <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-6 text-white/20">Waiting for Data Link</h3>
                  <p className="text-white/10 text-xs font-black uppercase tracking-[0.3em] font-mono">Initialize the physiological audit on the left console to generate bio-metrics.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
