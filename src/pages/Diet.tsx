import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Sun, Moon, Droplets, PieChart, Info, ChevronRight, Zap, Target, Search, ChefHat, Heart, ShieldCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const foodDatabase = [
  { id: 1, name: "Grilled Chicken Breast", cal: 165, protein: "31g", carbs: "0g", fat: "3.6g", vit: ["B6", "Niacin", "Selenium"], weight: "100g", category: "Protein" },
  { id: 2, name: "Brown Rice (Cooked)", cal: 111, protein: "2.6g", carbs: "23g", fat: "0.9g", vit: ["Magnesium", "B6", "Fiber"], weight: "100g", category: "Carbs" },
  { id: 3, name: "Avocado", cal: 160, protein: "2g", carbs: "8.5g", fat: "14.7g", vit: ["K", "C", "B5", "B6", "E"], weight: "100g", category: "Fats" },
  { id: 4, name: "Spinach", cal: 23, protein: "2.9g", carbs: "3.6g", fat: "0.4g", vit: ["A", "C", "K1", "Folic Acid", "Iron", "Calcium"], weight: "100g", category: "Veggies" },
  { id: 5, name: "Salmon", cal: 182, protein: "20g", carbs: "0g", fat: "11g", vit: ["B12", "D", "Omega-3"], weight: "100g", category: "Protein" },
  { id: 6, name: "Almonds", cal: 579, protein: "21g", carbs: "22g", fat: "49g", vit: ["E", "Manganese", "Magnesium"], weight: "100g", category: "Snacks" },
  { id: 7, name: "Quinoa", cal: 120, protein: "4.4g", carbs: "21g", fat: "1.9g", vit: ["B1", "B2", "B6", "Iron"], weight: "100g", category: "Carbs" },
  { id: 8, name: "Greek Yogurt", cal: 59, protein: "10g", carbs: "3.6g", fat: "0.4g", vit: ["B12", "Riboflavin", "Calcium"], weight: "100g", category: "Protein" },
];

const plans = [
  { 
    name: "Elite Shred", 
    type: "Fat Loss", 
    macros: { p: "45%", c: "25%", f: "30%" }, 
    cal: "1600-2000", 
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop",
    desc: "Aggressive fat oxidation while preserving peak lean tissue."
  },
  { 
    name: "Engineered Bulk", 
    type: "Muscle Gain", 
    macros: { p: "30%", c: "50%", f: "20%" }, 
    cal: "3000-3500", 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop",
    desc: "Caloric surplus substrate for maximal hypertrophic growth."
  },
  { 
    name: "Keto Protocol", 
    type: "Metabolic Shift", 
    macros: { p: "25%", c: "5%", f: "70%" }, 
    cal: "2200-2500", 
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop",
    desc: "Shift cellular energy substrate to lipid-based performance."
  },
];

export default function Diet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userWeight, setUserWeight] = useState(75);
  const [activeCategory, setActiveCategory] = useState("All");

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
      </div>
    </div>
  );
}
