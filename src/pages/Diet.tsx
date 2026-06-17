import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Sun, Moon, Droplets, PieChart, Info, ChevronRight, Zap, Target, Search, ChefHat, Heart, ShieldCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const foodDatabase = [
  { id: 1, name: "Paneer (Indian Cottage Cheese)", cal: 265, protein: "18g", carbs: "1.2g", fat: "20g", vit: ["Calcium", "Vitamin D"], weight: "100g", category: "Protein" },
  { id: 2, name: "Yellow Moong Dal (Cooked)", cal: 105, protein: "7g", carbs: "19g", fat: "0.2g", vit: ["Iron", "Fiber", "Folate"], weight: "100g", category: "Protein" },
  { id: 3, name: "Whey Protein Isolate", cal: 120, protein: "25g", carbs: "1g", fat: "0.5g", vit: ["Amino Acids", "BCAA"], weight: "30g", category: "Supplements" },
  { id: 4, name: "Bajra Roti (Pearl Millet)", cal: 110, protein: "3g", carbs: "22g", fat: "1g", vit: ["Magnesium", "Fiber"], weight: "40g", category: "Carbs" },
  { id: 5, name: "Desi Eggs (Boiled)", cal: 155, protein: "13g", carbs: "1.1g", fat: "11g", vit: ["B12", "D3", "Choline"], weight: "100g", category: "Protein" },
  { id: 6, name: "Almond & Cashew Mix", cal: 610, protein: "19g", carbs: "21g", fat: "52g", vit: ["E", "Healthy Fats"], weight: "100g", category: "Snacks" },
  { id: 7, name: "Quinoa Pulao", cal: 130, protein: "5g", carbs: "24g", fat: "2g", vit: ["B1", "Antioxidants"], weight: "100g", category: "Carbs" },
  { id: 8, name: "Curd (Homemade Dahi)", cal: 61, protein: "3.5g", carbs: "4.7g", fat: "3.3g", vit: ["Probiotics", "Calcium"], weight: "100g", category: "Dairy" },
];

const plans = [
  { 
    name: "Vedic Shred", 
    type: "Fat Loss", 
    macros: { p: "40%", c: "30%", f: "30%" }, 
    cal: "1800-2200", 
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    desc: "Luxury weight loss module utilizing high-protein plant and dairy substrates common in Indian cuisine."
  },
  { 
    name: "Apex Bulk", 
    type: "Muscle Gain", 
    macros: { p: "35%", c: "45%", f: "20%" }, 
    cal: "3200-3800", 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop",
    desc: "Precision hypertrophy module for explosive mass accumulation and metabolic efficiency."
  },
  { 
    name: "Keto Protocol", 
    type: "Metabolic Shift", 
    macros: { p: "25%", c: "5%", f: "70%" }, 
    cal: "2400-2600", 
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1964&auto=format&fit=crop",
    desc: "Advanced fat-burning protocol shifting cellular energy to high-quality lipid oxidation."
  },
];

export default function Diet() {
  const { user, setModalOpen, setModalTab } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [userWeight, setUserWeight] = useState(75);
  const [activeCategory, setActiveCategory] = useState("All");

  // Form State - Custom Diet Request
  const [requestGoal, setRequestGoal] = useState("Fat Loss");
  const [requestType, setRequestType] = useState("Vegetarian");
  const [requestAllergies, setRequestAllergies] = useState("");
  const [requestTargetWeight, setRequestTargetWeight] = useState("");
  const [requestNotes, setRequestNotes] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const handleSubmitDietRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setModalTab("signin");
      setModalOpen(true);
      return;
    }
    setRequestLoading(true);
    setRequestSuccess(false);
    setRequestError(null);

    try {
      await addDoc(collection(db, "dietRequests"), {
        userId: user.uid,
        userEmail: user.email || "",
        goal: requestGoal,
        dietType: requestType,
        allergies: requestAllergies,
        targetWeight: parseFloat(requestTargetWeight) || 0,
        notes: requestNotes,
        status: "Pending",
        timestamp: new Date().toISOString()
      });
      setRequestSuccess(true);
      setRequestAllergies("");
      setRequestTargetWeight("");
      setRequestNotes("");
    } catch (err: any) {
      console.error(err);
      setRequestError("Could not submit request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const filteredFood = useMemo(() => {
    return foodDatabase.filter(food => 
      (activeCategory === "All" || food.category === activeCategory) &&
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategory]);

  return (
    <div className="py-32 bg-deep-black min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <header className="mb-24 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-panel border-neon-green/20 mb-10"
          >
            <ShieldCheck className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Nutritional Integrity v2.0</span>
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.8] mb-10 italic">
            Smart<br/><span className="premium-gradient-text uppercase">Nutrition</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-semibold uppercase tracking-tight leading-relaxed">
            Fuel your evolution with precision-engineered substrate profiles. Optimized for human performance and longevity. Directed by <span className="text-white">Manish Bhagat</span>.
          </p>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
          
          {/* Main Controls & Plans */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Top Interactive Banner */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="interactive-card p-12 relative overflow-hidden border-neon-green/10"
            >
              <div className="absolute inset-0 os-grid opacity-10" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-display font-black mb-8 uppercase tracking-tighter">Your Physiological Constant</h2>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between mb-4">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Weight Metric</span>
                        <span className="text-neon-green font-black">{userWeight} KG</span>
                      </div>
                      <input 
                        type="range" 
                        min="40" 
                        max="150" 
                        value={userWeight} 
                        onChange={(e) => setUserWeight(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-green"
                      />
                    </div>
                    <div className="flex gap-10">
                      <div>
                        <div className="text-[8px] text-white/20 font-black uppercase mb-2">Protein Target</div>
                        <div className="text-2xl font-black">{Math.round(userWeight * 2.2)}g</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/20 font-black uppercase mb-2">Maintenance</div>
                        <div className="text-2xl font-black text-neon-green">{Math.round(userWeight * 33)} kCal</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-10 h-10 text-neon-green mx-auto mb-2 animate-pulse-neon" />
                        <div className="text-xs font-black text-white/40 tracking-widest">SYNC READY</div>
                      </div>
                    </div>
                    {/* Animated SVG Circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-neon-green" strokeDasharray="552" strokeDashoffset="120" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Premium Plans Grid */}
            <section className="space-y-16">
              <h3 className="text-5xl font-display font-black uppercase tracking-tighter">Plan <span className="stroke-text font-black">Architecture</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {plans.map((plan, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -15 }}
                    className="glass-panel overflow-hidden border-white/5 hover:border-neon-green/30 transition-all duration-700"
                  >
                    <div className="h-56 relative group">
                      <img src={plan.image} alt={plan.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-1000 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-neon-green" />
                        <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.2em]">{plan.type}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-3xl font-display font-black mb-6 uppercase tracking-tighter">{plan.name}</h4>
                      <p className="text-white/30 text-xs mb-8 font-semibold uppercase tracking-tight">{plan.desc}</p>
                      <div className="flex justify-between items-center bg-white/[0.02] p-5 rounded-2xl border border-white/5 mb-10">
                        <div>
                          <div className="text-[8px] text-white/20 font-black mb-1">ENERGY</div>
                          <div className="text-lg font-black">{plan.cal} <span className="text-[10px] opacity-20">KCAL</span></div>
                        </div>
                        <div className="flex gap-2">
                          {Object.entries(plan.macros).map(([k, v]) => (
                            <div key={k} className="text-center min-w-10">
                              <div className="text-[7px] text-white/20 font-mono font-black">{k.toUpperCase()}</div>
                              <div className="text-[10px] font-black text-neon-green">{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="btn-premium w-full py-5 text-[9px]">LAUNCH PROTOCOL</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Food Database Console */}
            <section className="space-y-12">
              <div className="flex justify-between items-end">
                <h3 className="text-5xl font-display font-black uppercase tracking-tighter italic">Nutrient <span className="premium-gradient-text">Database</span></h3>
                <div className="flex gap-4 p-1.5 glass-panel !rounded-2xl border-white/10 overflow-x-auto no-scrollbar">
                  {["All", "Protein", "Carbs", "Fats", "Veggies", "Snacks"].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-neon-green text-black" : "text-white/20 hover:text-white"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors" />
                <input 
                  type="text" 
                  placeholder="SEARCH FOOD BIOMETRICS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-7 pl-16 pr-8 focus:outline-none focus:border-neon-green/30 font-black text-[10px] uppercase tracking-[0.4em] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredFood.map((food) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={food.id}
                      className="glass-panel p-8 border-white/5 hover:border-white/10 group/item transition-all"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-[8px] text-neon-green font-black uppercase tracking-[0.4em] mb-2">{food.category} MODULE</div>
                          <h5 className="text-2xl font-black uppercase tracking-tighter italic group-hover/item:text-neon-green transition-colors">{food.name}</h5>
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{food.weight}</div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/[0.02] p-4 rounded-xl text-center">
                          <div className="text-[7px] text-white/20 mb-1">CAL</div>
                          <div className="text-lg font-black">{food.cal}</div>
                        </div>
                        <div className="bg-white/[0.02] p-4 rounded-xl text-center">
                          <div className="text-[7px] text-white/20 mb-1 font-mono">PRO</div>
                          <div className="text-lg font-black text-neon-green">{food.protein}</div>
                        </div>
                        <div className="bg-white/[0.02] p-4 rounded-xl text-center">
                          <div className="text-[7px] text-white/20 mb-1 font-mono">CHO</div>
                          <div className="text-lg font-black">{food.carbs}</div>
                        </div>
                        <div className="bg-white/[0.02] p-4 rounded-xl text-center">
                          <div className="text-[7px] text-white/20 mb-1 font-mono">FAT</div>
                          <div className="text-lg font-black">{food.fat}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {food.vit.map(v => (
                          <span key={v} className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/30">{v}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Right Sidebar Protocol */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Hydration Interface */}
            <div className="glass-panel p-10 border-blue-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Droplets className="w-24 h-24 text-blue-500 blur-xl animate-pulse" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-4">
                <Droplets className="text-blue-400 w-5 h-5" />
                Hydration Core
              </h4>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((cup) => (
                  <button key={cup} className={`aspect-square rounded-2xl border transition-all duration-500 flex items-center justify-center hover:scale-110 ${cup <= 4 ? "bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "bg-white/5 border-white/10 text-white/10"}`}>
                    <Droplets className="w-5 h-5" />
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[8px] text-white/20 font-black mb-1">CURRENT STATUS</div>
                  <div className="text-3xl font-black">1.8 / 3.5 <span className="text-xs text-white/20">LITERS</span></div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-400">51%</div>
                  <div className="text-[8px] text-white/20 font-black">DAILY GOAL</div>
                </div>
              </div>
            </div>

            {/* Meal Sequencing */}
            <div className="glass-panel p-10 border-white/5">
              <div className="flex justify-between items-center mb-12">
                <h4 className="text-xl font-black uppercase tracking-widest">Sequencing</h4>
                <div className="px-3 py-1 bg-neon-green/10 rounded-full text-[8px] text-neon-green font-black animate-pulse-neon">REALTIME SYNC</div>
              </div>
              <div className="space-y-16">
                {[
                  { time: "07:30", name: "Initial Load", icon: Coffee, desc: "Oats / Protein / Blueberries", status: "Completed" },
                  { time: "13:00", name: "Peak Induction", icon: Sun, desc: "Salmon / Quinoa / Greens", status: "Active" },
                  { time: "17:00", name: "Buffer Intake", icon: Zap, desc: "Whey / Banana / Almonds", status: "Pending" },
                  { time: "20:30", name: "Recovery Base", icon: Moon, desc: "Steak / Sweet Potato / Asparagus", status: "Pending" },
                ].map((meal, idx) => (
                  <div key={idx} className="relative pl-10 border-l border-white/5">
                    <div className={`absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full bg-deep-black border-2 transition-all duration-700 ${meal.status === 'Completed' ? 'border-neon-green shadow-glow' : meal.status === 'Active' ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-white/10'}`} />
                    <div className="text-[8px] font-black text-white/20 mb-3 tracking-[0.3em] font-mono">{meal.time} MST</div>
                    <div className="flex items-center gap-4 mb-3">
                      <meal.icon className={`w-5 h-5 ${meal.status === 'Active' ? 'text-blue-400' : 'text-white/40'}`} />
                      <h5 className="text-lg font-black uppercase tracking-tighter italic">{meal.name}</h5>
                    </div>
                    <p className="text-[11px] text-white/30 font-semibold uppercase tracking-tight mb-4">{meal.desc}</p>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${meal.status === 'Completed' ? 'text-neon-green/40' : meal.status === 'Active' ? 'text-blue-400' : 'text-white/10'}`}>{meal.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Tips Carousel (Mock) */}
            <div className="glass-panel p-8 border-neon-green/10 flex items-center gap-6 group cursor-pointer hover:bg-white/[0.04] transition-all">
              <div className="w-14 h-14 bg-neon-green/5 rounded-2xl flex items-center justify-center border border-neon-green/10 group-hover:scale-110 transition-all">
                <Zap className="text-neon-green w-6 h-6 animate-pulse-neon" />
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-black text-white/20 uppercase mb-1">PRO TIP #142</div>
                <div className="text-xs font-black uppercase tracking-tight leading-tight">Post-workout carb loading induction strategies</div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/10 group-hover:translate-x-1 transition-all" />
            </div>

          </div>
        </div>

        {/* Personal Diet Request Section */}
        <section className="glass-panel p-12 border-neon-green/10 bg-white/[0.01] relative rounded-3xl overflow-hidden mt-24">
          <div className="absolute inset-0 os-grid opacity-5 pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] text-neon-green font-black uppercase tracking-[0.4em] mb-4 font-mono">Tailored Nutrition</span>
              <h3 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter italic mb-6">
                Request a Custom<br/><span className="premium-gradient-text uppercase">Diet Protocol</span>
              </h3>
              <p className="text-white/40 text-sm font-semibold uppercase tracking-tight leading-relaxed mb-8">
                Cannot find a pre-compiled profile suitable for your biometrics? Trigger a custom calculation from Manish Bhagat and our team based on your exact caloric target, allergies, and cellular objectives.
              </p>
              
              {!user && (
                <button
                  type="button"
                  onClick={() => { setModalTab("signin"); setModalOpen(true); }}
                  className="bg-neon-green text-black font-black uppercase text-[10px] px-8 py-4.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(57,255,20,0.4)] cursor-pointer self-start"
                >
                  Sign In to Request
                </button>
              )}
            </div>

            <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-3xl p-8 sm:p-10">
              {requestSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ChefHat className="w-16 h-16 text-neon-green mb-6 animate-bounce animate-pulse-neon" />
                  <h4 className="text-2xl font-black uppercase tracking-tight italic mb-2 text-white font-display">Request Synchronized!</h4>
                  <p className="text-white/40 text-[10px] tracking-wider mb-6 font-mono font-bold uppercase">Our nutritional technicians are compiling your matrix. Check back soon.</p>
                  <button 
                    type="button"
                    onClick={() => setRequestSuccess(false)}
                    className="text-[10px] text-neon-green font-black uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitDietRequest} className="space-y-6">
                  {requestError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-black uppercase tracking-wider font-mono">
                      {requestError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/30">Target Goal *</label>
                      <select 
                        value={requestGoal}
                        onChange={(e) => setRequestGoal(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-neon-green/40 cursor-pointer font-bold"
                      >
                        <option value="Fat Loss" className="bg-deep-black text-white">Fat Loss</option>
                        <option value="Muscle Gain" className="bg-deep-black text-white">Muscle Gain</option>
                        <option value="Metabolic Shift" className="bg-deep-black text-white">Metabolic Shift</option>
                        <option value="Endurance Protocol" className="bg-deep-black text-white">Endurance Protocol</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/30">Dietary Profile *</label>
                      <select 
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-neon-green/40 cursor-pointer font-bold"
                      >
                        <option value="Vegetarian" className="bg-deep-black text-white">Vegetarian (Vedic Veg)</option>
                        <option value="Non-Vegetarian" className="bg-deep-black text-white">Non-Vegetarian</option>
                        <option value="Eggitarian" className="bg-deep-black text-white">Eggitarian</option>
                        <option value="Vegan" className="bg-deep-black text-white">Vegan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/30">Target weight (KG) *</label>
                      <input 
                        type="number" 
                        value={requestTargetWeight}
                        onChange={(e) => setRequestTargetWeight(e.target.value)}
                        placeholder="e.g. 68"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-green/40 font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/30">Allergies / Restrictions</label>
                      <input 
                        type="text" 
                        value={requestAllergies}
                        onChange={(e) => setRequestAllergies(e.target.value)}
                        placeholder="e.g. Glutens, Peanuts, Lactose"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-green/40 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/30">Notes / Metabolic Conditions</label>
                    <textarea 
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      placeholder="Share a brief overview of your daily workout routine and health history..."
                      rows={3}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-green/40 font-bold resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={requestLoading || !user}
                    className="w-full py-4 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white rounded-xl hover:bg-neon-green hover:text-black hover:border-transparent transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {!user ? "Access Protocol (Sign In Required)" : requestLoading ? "Submitting..." : "Initialize Custom Calculus"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
