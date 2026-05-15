import React, { useState, useRef, useEffect } from "react";
import { 
  Calculator, Flame, Activity, TrendingUp, Camera, 
  Image as ImageIcon, X, Sparkles, Search, Plus, Trash2, 
  PieChart, Droplets, Zap, Scale, Info, CheckCircle2,
  ChevronRight, ArrowRight, Dna
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { generateContent } from "../services/ai";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: string[];
  minerals: string[];
  servingSize: number; // in grams
}

interface LoggedFood extends FoodItem {
  id: string;
  loggedWeight: number;
  scaledCalories: number;
  scaledProtein: number;
  scaledCarbs: number;
  scaledFat: number;
}

export default function CalorieCalculator() {
  // Biometric State
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [age, setAge] = useState<string>("25");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [activity, setActivity] = useState<string>("1.375");
  const [targetWeight, setTargetWeight] = useState<string>("2");
  const [weeks, setWeeks] = useState<string>("4");
  const [biometricResult, setBiometricResult] = useState<{ bmr: number; tdee: number; goalIntake: number } | null>(null);
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);

  // Food Search/Analysis State
  const [foodQuery, setFoodQuery] = useState("");
  const [isFoodSearching, setIsFoodSearching] = useState(false);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [foodWeight, setFoodWeight] = useState<number>(100); 
  
  // Logged Foods (The "Plate")
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  
  // Image Analysis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const calculateBiometrics = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const activityLevel = parseFloat(activity);
    const target = parseFloat(targetWeight);
    const timeframeWeeks = parseFloat(weeks);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    setIsBioLoading(true);
    // Mifflin-St Jeor Equation
    let bmr = gender === "Male" ? (10 * w + 6.25 * h - 5 * a + 5) : (10 * w + 6.25 * h - 5 * a - 161);
    const tdee = Math.round(bmr * activityLevel);
    
    // 7700 kcal per kg of fat loss
    const totalDeficitNeeded = target * 7700;
    const dailyDeficit = totalDeficitNeeded / (timeframeWeeks * 7);
    const goalIntake = Math.round(tdee - dailyDeficit);

    setBiometricResult({ bmr: Math.round(bmr), tdee, goalIntake });

    try {
      const prompt = `Professional Nutritionist Analysis: 
      Profile: ${age}yo ${gender}, ${weight}kg, ${height}cm.
      Objective: Sub-cutaneous fat loss of ${targetWeight}kg in a ${weeks}-week macro-cycle.
      Calculated TDEE: ${tdee} kcal. Target Daily Intake: ${goalIntake} kcal.
      
      Requirements:
      1. Precise Macronutrient Ratios (Protein/Carbs/Fats).
      2. Metabolic Optimization Strategies.
      3. Adherence and Recovery Protocol.
      
      Tone: authoritative, scientific, elite-level.`;
      const response = await generateContent(prompt);
      setDietPlan(response);
    } catch (e) {
      setDietPlan("Protocol uplink terminated by server security.");
    } finally {
      setIsBioLoading(false);
    }
  };

  const decodeFoodData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!foodQuery.trim() || isFoodSearching) return;

    setIsFoodSearching(true);
    setCurrentFood(null);

    try {
      const prompt = `Act as a clinical food database. Perform deep analysis on "${foodQuery}".
      Strictly return a clean JSON object (no markdown, no extra text):
      {
        "name": "Proper Name",
        "calories": number (per 100g serving),
        "protein": number,
        "carbs": number,
        "fat": number,
        "vitamins": ["Vitamin A", "Vitamin B12", "Vitamin D"],
        "minerals": ["Iron", "Zinc", "Magnesium"],
        "servingSize": 100
      }`;

      const response = await generateContent(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const cleaned = jsonMatch ? jsonMatch[0] : response;
      const data = JSON.parse(cleaned) as FoodItem;
      setCurrentFood(data);
      setFoodWeight(100);
    } catch (error) {
      console.error("Decoder Error:", error);
    } finally {
      setIsFoodSearching(false);
    }
  };

  const addFoodToPlate = () => {
    if (!currentFood) return;
    
    const scaled: LoggedFood = {
      ...currentFood,
      id: Math.random().toString(36).substr(2, 9),
      loggedWeight: foodWeight,
      scaledCalories: Math.round((currentFood.calories / 100) * foodWeight),
      scaledProtein: Number(((currentFood.protein / 100) * foodWeight).toFixed(1)),
      scaledCarbs: Number(((currentFood.carbs / 100) * foodWeight).toFixed(1)),
      scaledFat: Number(((currentFood.fat / 100) * foodWeight).toFixed(1)),
    };
    
    setLoggedFoods(prev => [scaled, ...prev]);
    setCurrentFood(null);
    setFoodQuery("");
  };

  const removeFood = (id: string) => {
    setLoggedFoods(prev => prev.filter(f => f.id !== id));
  };

  const totalPlateStats = loggedFoods.reduce((acc, f) => ({
    calories: acc.calories + f.scaledCalories,
    protein: acc.protein + f.scaledProtein,
    carbs: acc.carbs + f.scaledCarbs,
    fat: acc.fat + f.scaledFat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setImageAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFoodSpecimen = async () => {
    if (!selectedImage) return;
    setAnalyzingImage(true);
    try {
      const prompt = "Visual Neural Analysis: Estimate the caloric density, weight (approx g), and macro profile of the specimen in this image. Provide a clinical summary.";
      const res = await generateContent(prompt, selectedImage);
      setImageAnalysis(res);
    } catch (e) {
      setImageAnalysis("System Error: Visual uplink desynced.");
    } finally {
      setAnalyzingImage(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-deep-black overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Futuristic Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                <Calculator className="w-6 h-6" />
              </div>
              <span className="text-neon-green font-mono text-xs tracking-[0.5em] uppercase font-black">Mantra Neural v4.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85] italic">
              Metabolic <br />
              <span className="text-neon-green text-stroke-white opacity-90">Protocol</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 items-start md:items-end"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-glow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Core Engine: Gemini 1.5 PRO</span>
              </div>
            </div>
            <p className="text-white/30 font-mono text-[10px] max-w-[280px] md:text-right leading-relaxed uppercase tracking-tighter">
              Precision calculated biometric modeling. Macro-nutrient engineering based on cellular requirements.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Input & Analysis */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* PANEL: BIOMETRICS */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="interactive-card overflow-hidden border-white/5 group"
            >
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <Dna className="w-6 h-6 text-neon-green" />
                    <h2 className="text-xl font-display font-black uppercase tracking-widest">Biometric Uplink</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Signal Strength</span>
                       <div className="flex gap-1">
                         <div className="w-1 h-3 bg-neon-green rounded-full shadow-glow" />
                         <div className="w-1 h-3 bg-neon-green rounded-full shadow-glow" />
                         <div className="w-1 h-3 bg-neon-green rounded-full shadow-glow" />
                         <div className="w-1 h-3 bg-white/10 rounded-full" />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 flex items-center gap-2">
                      Weight <span className="w-1 h-1 rounded-full bg-neon-green" />
                    </label>
                    <div className="relative">
                      <input 
                        type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-os-black/60 border border-white/5 group-hover:border-white/10 rounded-2xl px-6 py-5 font-display font-black text-3xl focus:border-neon-green/50 transition-all outline-none text-white"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 tracking-widest">KG</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 flex items-center gap-2">
                      Height <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </label>
                    <div className="relative">
                      <input 
                        type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-os-black/60 border border-white/5 group-hover:border-white/10 rounded-2xl px-6 py-5 font-display font-black text-3xl focus:border-neon-green/50 transition-all outline-none text-white"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 tracking-widest">CM</span>
                    </div>
                  </div>
                  <div className="space-y-3 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 flex items-center gap-2">
                      Years <span className="w-1 h-1 rounded-full bg-neon-yellow shadow-[0_0_10px_rgba(255,255,0,0.5)]" />
                    </label>
                    <div className="relative">
                      <input 
                        type="number" value={age} onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-os-black/60 border border-white/5 group-hover:border-white/10 rounded-2xl px-6 py-5 font-display font-black text-3xl focus:border-neon-green/50 transition-all outline-none text-white"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 tracking-widest">AGE</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Biological Architecture</label>
                    <div className="flex bg-os-black/60 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
                      {(["Male", "Female"] as const).map(s => (
                        <button 
                          key={s} onClick={() => setGender(s)}
                          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all ${gender === s ? "bg-neon-green text-black shadow-[0_10px_30px_rgba(57,255,20,0.3)]" : "text-white/20 hover:text-white/40"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Kinetic Load Frequency</label>
                    <div className="relative h-[66px]">
                      <select 
                        value={activity} onChange={(e) => setActivity(e.target.value)}
                        className="w-full h-full bg-os-black/60 border border-white/10 rounded-2xl px-6 text-[10px] font-black uppercase tracking-[0.1em] appearance-none focus:border-neon-green/50 outline-none text-white cursor-pointer"
                      >
                        <option value="1.2">SEDENTARY [RESTRICTED]</option>
                        <option value="1.375">LIGHT [OPTIMIZED]</option>
                        <option value="1.55">MODERATE [PERFORMANCE]</option>
                        <option value="1.725">INTENSE [OVERCLOCK]</option>
                        <option value="1.9">ELITE [PEAK STATE]</option>
                      </select>
                      <Zap className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green shadow-glow animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Delta Target (KG)</label>
                    <div className="relative">
                      <input 
                        type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)}
                        className="w-full bg-os-black/60 border border-white/5 rounded-2xl px-6 py-5 font-display font-black text-3xl focus:border-neon-green/50 outline-none text-white"
                      />
                      <TrendingUp className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-green/20" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Mission Window (Wks)</label>
                    <div className="relative">
                      <input 
                        type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)}
                        className="w-full bg-os-black/60 border border-white/5 rounded-2xl px-6 py-5 font-display font-black text-3xl focus:border-neon-green/50 outline-none text-white"
                      />
                      <Activity className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/20" />
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateBiometrics}
                  disabled={isBioLoading}
                  className="w-full py-7 bg-neon-green text-black font-black uppercase tracking-[0.4em] rounded-[24px] shadow-[0_20px_60px_rgba(57,255,20,0.3)] flex items-center justify-center gap-4 group transition-all"
                >
                  {isBioLoading ? (
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 animate-spin" />
                      SYNTHESIZING PROTOCOL...
                    </div>
                  ) : (
                    <>
                      EXECUTE CALIBRATION
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.section>

            {/* PANEL: NEURAL DECODER (FOOD) */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="interactive-card border-white/5 overflow-hidden bg-white/[0.01]"
            >
               <div className="p-8 md:p-12 space-y-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-neon-yellow/10 rounded-2xl flex items-center justify-center border border-neon-yellow/20 shadow-[0_0_20px_rgba(255,255,0,0.1)]">
                        <Zap className="w-6 h-6 text-neon-yellow animate-pulse" />
                      </div>
                      <h2 className="text-2xl font-display font-black uppercase tracking-widest text-white italic">Molecular Decoder</h2>
                    </div>
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] font-black">Status: Online</div>
                  </div>

                  <form onSubmit={decodeFoodData} className="relative group">
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                      <Search className="w-6 h-6 text-white/20 group-focus-within:text-neon-green transition-colors" />
                    </div>
                    <input 
                      type="text" value={foodQuery} onChange={(e) => setFoodQuery(e.target.value)}
                      placeholder="IDENTIFY SPECIMEN MATRIX..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[40px] pl-20 pr-32 py-8 text-sm font-black uppercase tracking-[0.4em] focus:border-neon-green/30 focus:bg-white/[0.04] transition-all outline-none text-white placeholder:text-white/10"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" 
                      disabled={isFoodSearching}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-14 bg-neon-green text-black rounded-[24px] flex items-center justify-center hover:shadow-glow transition-all disabled:opacity-50"
                    >
                      {isFoodSearching ? <Activity className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-7 h-7" />}
                    </motion.button>
                  </form>

                  <AnimatePresence mode="wait">
                    {currentFood && (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel !rounded-[48px] border-white/5 p-10 md:p-14 relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                            <Dna className="w-40 h-40 text-neon-green blur-2xl" />
                         </div>

                         {/* Details header */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-14 relative z-10">
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-neon-green shadow-glow" />
                                <span className="text-[10px] font-black uppercase text-neon-green tracking-[0.4em] italic font-mono">Spectrum Verified</span>
                              </div>
                              <h3 className="text-5xl font-display font-black uppercase tracking-tighter text-white italic premium-gradient-text">{currentFood.name}</h3>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-5">
                               <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] font-mono italic">Log Mass [GRAMS]</span>
                               <div className="flex items-center gap-6 glass-panel !rounded-2xl px-6 py-4 border-white/5">
                                  <input 
                                    type="range" min="10" max="1000" step="10"
                                    value={foodWeight} onChange={(e) => setFoodWeight(Number(e.target.value))}
                                    className="w-32 accent-neon-green h-1.5"
                                  />
                                  <span className="text-3xl font-display font-black text-white w-20 italic">{foodWeight}G</span>
                               </div>
                            </div>
                         </div>

                         {/* Nutrition Matrix */}
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 relative z-10">
                           {[
                             { label: "NET ENERGY", val: Math.round((currentFood.calories / 100) * foodWeight), unit: "KCAL", color: "text-white" },
                             { label: "AMINO PROFILE", val: ((currentFood.protein / 100) * foodWeight).toFixed(1), unit: "G", color: "text-neon-green" },
                             { label: "LIPID YIELD", val: ((currentFood.fat / 100) * foodWeight).toFixed(1), unit: "G", color: "text-rose-500" },
                             { label: "GLYCOGEN", val: ((currentFood.carbs / 100) * foodWeight).toFixed(1), unit: "G", color: "text-blue-400" }
                           ].map((m, i) => (
                             <div key={i} className="glass-panel !rounded-3xl p-8 border-white/5 hover:border-white/10 transition-colors">
                               <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 mb-3 font-mono">{m.label}</p>
                               <div className="flex items-baseline gap-2">
                                 <span className={`text-3xl font-display font-black italic ${m.color}`}>{m.val}</span>
                                 <span className="text-[9px] font-mono text-white/20 font-black">{m.unit}</span>
                               </div>
                             </div>
                           ))}
                         </div>

                         {/* Microns */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14 relative z-10">
                           <div className="space-y-6">
                              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 italic">
                                <Sparkles className="w-4 h-4 text-neon-green" /> Vital Elements
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {currentFood.vitamins.map((v, i) => (
                                  <span key={i} className="px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-black uppercase text-neon-green tracking-widest italic shadow-xl">
                                    {v}
                                  </span>
                                ))}
                                {currentFood.vitamins.length === 0 && <span className="text-[10px] font-mono text-white/10 italic">N/A</span>}
                              </div>
                           </div>
                           <div className="space-y-6">
                              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 italic">
                                <Droplets className="w-4 h-4 text-blue-400" /> Trace Profile
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {currentFood.minerals.map((m, i) => (
                                  <span key={i} className="px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-black uppercase text-blue-400 tracking-widest italic shadow-xl">
                                    {m}
                                  </span>
                                ))}
                                {currentFood.minerals.length === 0 && <span className="text-[10px] font-mono text-white/10 italic">N/A</span>}
                              </div>
                           </div>
                         </div>

                         <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={addFoodToPlate}
                          className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] rounded-[24px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group italic text-[11px]"
                         >
                           <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> INTEGRATE INTO PLATE
                         </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* VISUAL UPLINK (CAMERA) */}
                  <div className="pt-12 border-t border-white/5">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <Camera className="w-5 h-5 text-neon-green" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Spectral Imaging</span>
                    </div>

                    {!selectedImage ? (
                      <motion.div 
                        whileHover={{ borderColor: "rgba(57, 255, 20, 0.2)" }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/5 rounded-[48px] p-20 flex flex-col items-center justify-center gap-8 cursor-pointer transition-all bg-white/[0.01] group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-neon-green/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 shadow-xl">
                          <ImageIcon className="w-10 h-10 text-white/10 group-hover:text-neon-green transition-colors" />
                        </div>
                        <div className="text-center relative z-10">
                          <p className="text-lg font-black uppercase tracking-[0.3em] text-white/40 mb-3 italic">Identify Specimen</p>
                          <p className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] font-black">AI Specimen Analysis Active</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-10">
                        <div className="relative rounded-[48px] overflow-hidden border border-white/5 aspect-video group/img shadow-2xl">
                           <img src={selectedImage} alt="Specimen Preview" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-6 backdrop-blur-xl">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={analyzeFoodSpecimen} 
                                className="px-10 py-5 bg-neon-green text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-glow transition-all"
                              >
                                INITIATE SCAN
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedImage(null)} 
                                className="p-5 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                              >
                                <Trash2 className="w-6 h-6" />
                              </motion.button>
                           </div>
                        </div>

                        {analyzingImage && (
                          <div className="flex items-center gap-8 p-10 glass-panel !rounded-[32px] border-neon-green/10">
                            <Activity className="w-10 h-10 text-neon-green animate-spin" />
                            <div className="flex-1">
                               <p className="text-xs font-black uppercase tracking-[0.4em] text-neon-green mb-3 italic">Extracting Molecular Data...</p>
                               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-full h-full bg-neon-green shadow-glow" />
                               </div>
                            </div>
                          </div>
                        )}

                        {imageAnalysis && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neon-green/[0.03] border border-neon-green/10 p-10 rounded-[40px] font-mono text-[13px] leading-relaxed italic text-white/60 relative group shadow-2xl"
                          >
                             <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                               <Zap className="w-20 h-20 text-neon-green" />
                             </div>
                             <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-2 rounded-full bg-neon-green shadow-glow animate-pulse" />
                                <span className="font-black uppercase tracking-[0.5em] text-neon-green text-[10px]">Spectrum Report Alpha</span>
                             </div>
                             <div className="relative z-10 whitespace-pre-wrap selection:bg-neon-green selection:text-black">
                               {imageAnalysis}
                             </div>
                             
                             <button onClick={() => setImageAnalysis(null)} className="mt-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-all underline decoration-neon-green/20">Purge Analysis Profile</button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
               </div>
            </motion.section>
          </div>

          {/* RIGHT COLUMN: Sidebar / Results / Log */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* PANEL: BIOMETRIC RESULTS */}
            <AnimatePresence mode="wait">
              {biometricResult ? (
                <motion.div 
                  key="stats" {...fadeInUp}
                  className="space-y-8"
                >
                  <div className="glass-card overflow-hidden border-neon-green/20">
                    <div className="p-10 bg-gradient-to-br from-neon-green/20 via-transparent to-transparent relative">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                          <Flame className="w-32 h-32 text-neon-green" />
                       </div>
                       
                       <div className="flex items-center justify-between mb-12">
                          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                             <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic">Live Results</span>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Metabolic Index</p>
                             <p className="text-sm font-mono text-white/60">BMR: {biometricResult.bmr} KCAL</p>
                          </div>
                       </div>

                       <div className="space-y-4 mb-12">
                          <p className="text-[12px] font-black uppercase tracking-[0.5em] text-neon-green">Total Daily Burn</p>
                          <div className="flex items-baseline gap-4">
                             <h2 className="text-9xl font-display font-black text-white italic -ml-2">{biometricResult.tdee}</h2>
                             <span className="text-xl font-display font-black text-white/20 italic">KCAL</span>
                          </div>
                          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-relaxed">
                             Calibration based on {activity} coefficient.
                          </p>
                       </div>

                       <div className="grid grid-cols-1 gap-6">
                          <div className="bg-neon-green p-8 rounded-[40px] flex items-center justify-between group cursor-help overflow-hidden relative">
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <div className="relative z-10">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 mb-2 italic">Protocol Target</p>
                               <div className="flex items-baseline gap-2 text-black">
                                  <span className="text-6xl font-display font-black">{biometricResult.goalIntake}</span>
                                  <span className="text-xs font-black">KCAL/DAY</span>
                                </div>
                             </div>
                             <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center relative z-10">
                                <TrendingUp className="w-10 h-10 text-black/40" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {dietPlan && (
                    <motion.div 
                      key="plan" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-10 border-white/10 relative"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Sparkles className="w-16 h-16 text-neon-green" />
                      </div>
                      <div className="flex items-center gap-4 mb-8">
                        <Activity className="w-5 h-5 text-neon-green" />
                        <h3 className="text-lg font-display font-black uppercase tracking-widest italic">Dietary <span className="text-neon-green">Intelligence</span></h3>
                      </div>
                      <div className="text-[14px] leading-relaxed text-white/70 font-mono italic whitespace-pre-wrap selection:bg-neon-green selection:text-black">
                        {dietPlan}
                      </div>
                      
                      <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-neon-green shadow-glow" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Optimal Path Found</span>
                         </div>
                         <button className="text-[10px] font-black uppercase tracking-widest text-neon-green hover:underline">Download Sync File</button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="glass-card min-h-[500px] flex flex-col items-center justify-center p-12 text-center group border-white/5">
                   <div className="w-32 h-32 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 group-hover:border-neon-green/30 transition-all duration-700 relative">
                      <div className="absolute inset-0 bg-neon-green/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Activity className="w-12 h-12 text-white/20 group-hover:text-neon-green transition-all" />
                   </div>
                   <h3 className="text-2xl font-display font-black uppercase tracking-widest mb-4">Awaiting Input</h3>
                   <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] max-w-[240px] leading-relaxed">
                     Input biometric data or scan specimen to generate neural results.
                   </p>
                </div>
              )}
            </AnimatePresence>

            {/* PANEL: NEURAL PLATE LOG */}
            <section className="glass-card overflow-hidden border-white/10">
               <div className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <PieChart className="w-6 h-6 text-neon-green" />
                      <h2 className="text-xl font-display font-black uppercase tracking-widest italic">Neural Plate</h2>
                    </div>
                    <div className="text-[10px] font-black text-neon-green bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20">
                      LIVE Aggregation
                    </div>
                  </div>

                  {loggedFoods.length > 0 ? (
                    <div className="space-y-8">
                       {/* Aggregated Stats */}
                       <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] flex items-center justify-around gap-4 text-center">
                          <div className="space-y-1">
                             <p className="text-[28px] font-display font-black text-white italic">{totalPlateStats.calories}</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Tot. KCal</p>
                          </div>
                          <div className="w-px h-10 bg-white/10" />
                          <div className="space-y-1">
                             <p className="text-[20px] font-display font-black text-blue-400 italic">{Math.round(totalPlateStats.protein)}g</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Prot.</p>
                          </div>
                          <div className="w-px h-10 bg-white/10" />
                          <div className="space-y-1">
                             <p className="text-[20px] font-display font-black text-rose-400 italic">{Math.round(totalPlateStats.fat)}g</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Lip.</p>
                          </div>
                          <div className="w-px h-10 bg-white/10" />
                          <div className="space-y-1">
                             <p className="text-[20px] font-display font-black text-amber-400 italic">{Math.round(totalPlateStats.carbs)}g</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Carb.</p>
                          </div>
                       </div>

                       {/* List of items */}
                       <div className="space-y-4">
                          <AnimatePresence initial={false}>
                            {loggedFoods.map(f => (
                              <motion.div 
                                key={f.id} {...fadeInUp}
                                className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/10 transition-colors"
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[10px] font-black text-neon-green border border-neon-green/20">
                                       {f.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black text-white italic">{f.name}</h4>
                                       <p className="text-[9px] font-mono text-white/20 uppercase">{f.loggedWeight}g // {f.scaledCalories} KCAL</p>
                                    </div>
                                 </div>
                                 <button onClick={() => removeFood(f.id)} className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                       </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 italic">
                       <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Uplink Empty // Awaiting Meal Data</p>
                       <div className="w-12 h-0.5 bg-white/10 rounded-full" />
                    </div>
                  )}

                  {loggedFoods.length > 0 && biometricResult && (
                    <div className="mt-10 p-6 bg-black rounded-3xl border border-white/5">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">Budget Utilization</span>
                          <span className="text-[10px] font-mono text-neon-green">{Math.round((totalPlateStats.calories / biometricResult.goalIntake) * 100)}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }} animate={{ width: `${Math.min(100, (totalPlateStats.calories / biometricResult.goalIntake) * 100)}%` }}
                             className={`h-full ${totalPlateStats.calories > biometricResult.goalIntake ? 'bg-rose-500' : 'bg-neon-green'} transition-all`}
                          />
                       </div>
                       <p className="text-[9px] font-mono text-white/20 mt-4 uppercase text-center italic tracking-tighter">
                          Remaining Budget: {Math.max(0, biometricResult.goalIntake - totalPlateStats.calories)} KCAL
                       </p>
                    </div>
                  )}
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
