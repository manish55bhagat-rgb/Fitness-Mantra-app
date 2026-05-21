import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Play, Clock, Flame, Dumbbell, Box, ChevronRight, Mic2, Volume2, Target, Zap, ShieldCheck } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { exercises, Exercise } from "../data/exercises";
import MuscleSelector from "../components/ui/MuscleSelector";
import ExerciseModel from "../components/ui/ExerciseModel";
import { voiceService } from "../services/voiceService";

const bodyParts = ["All", "Chest", "Shoulders", "Back", "Legs", "Abs", "Arms", "Cardio", "Yoga"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Elite"];

export default function Exercises() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"3d" | "image">("image");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const handleVoiceGuidance = async (id: string, text: string) => {
    setIsSpeaking(id);
    await voiceService.speak(text);
    setIsSpeaking(null);
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const categoryMatch = activeCategory === "All" || ex.category === activeCategory;
      const searchMatch = ex.title.toLowerCase().includes(searchTerm.toLowerCase());
      const muscleMatch = !selectedMuscle || ex.muscles.some(m => m.toLowerCase().includes(selectedMuscle.toLowerCase()));
      const difficultyMatch = activeDifficulty === "All" || ex.level === activeDifficulty;
      return categoryMatch && searchMatch && muscleMatch && difficultyMatch;
    });
  }, [activeCategory, searchTerm, selectedMuscle, activeDifficulty]);

  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-green/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-32 flex flex-col xl:flex-row justify-between items-start gap-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10"
            >
              <Zap className="w-4 h-4 text-neon-green" />
              <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Neural Library v4.8.2</span>
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] italic mb-10">
              Exercise<br/><span className="premium-gradient-text uppercase italic">Architecture</span>
            </h1>
            
            <p className="text-white/40 text-xl font-semibold uppercase tracking-tight leading-relaxed italic mb-12">
              Calibrate your physical form against elite kinetic protocols. 
              Real-world demonstrations meets neural form mapping.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="glass-panel p-6 border-white/5 flex items-center gap-6">
                <div className="w-12 h-12 bg-neon-green rounded-2xl flex items-center justify-center shadow-glow">
                  <Dumbbell className="text-black w-6 h-6" />
                </div>
                <div>
                   <div className="text-[20px] font-black italic leading-none">500+</div>
                   <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mt-1">Exercises Tracked</div>
                </div>
              </div>

              <div className="glass-panel p-6 border-blue-500/10 flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <div>
                   <div className="text-[20px] font-black italic leading-none">Verified</div>
                   <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mt-1">Pro Human Form</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 w-full md:w-auto">
             <div className="flex bg-white/[0.03] p-1.5 rounded-3xl border border-white/10 backdrop-blur-2xl self-end">
                <button 
                  onClick={() => setViewMode("image")}
                  className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === "image" ? "bg-white text-black shadow-2xl" : "text-white/40 hover:text-white"}`}
                >
                  Real Visuals
                </button>
                <button 
                  onClick={() => setViewMode("3d")}
                  className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === "3d" ? "bg-neon-green text-black shadow-glow" : "text-white/40 hover:text-white"}`}
                >
                  3D Neural
                </button>
              </div>
              <MuscleSelector selectedMuscle={selectedMuscle} onSelect={setSelectedMuscle} />
          </div>
        </header>

        {/* Advanced Filters Toolbar */}
        <div className="glass-panel p-4 mb-24 border-white/5 sticky top-24 z-50 flex flex-col lg:flex-row items-center gap-6 backdrop-blur-3xl shadow-2xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-neon-green transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOL (e.g. BENCH PRESS, SQUAT)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none py-6 pl-16 pr-8 focus:outline-none font-black text-[10px] uppercase tracking-[0.3em] text-white/80 placeholder:text-white/10"
            />
          </div>
          
          <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto p-2">
            {bodyParts.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 border ${
                  activeCategory === cat ? "bg-neon-green text-black border-neon-green shadow-glow" : "text-white/20 hover:text-white border-white/5 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

          <select 
            value={activeDifficulty}
            onChange={(e) => setActiveDifficulty(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-neon-green transition-all appearance-none cursor-pointer"
          >
            {difficulties.map(d => <option key={d} value={d} className="bg-deep-black">{d} LEVEL</option>)}
          </select>
        </div>

        {/* Premium Results Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredExercises.map((ex, idx) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="interactive-card p-6 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-8 glass-panel p-2 border-white/5">
                {viewMode === "image" ? (
                   <img 
                    src={ex.image} 
                    alt={ex.title} 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 rounded-[22px]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full">
                    <ExerciseModel type={ex.title} />
                  </div>
                )}
                
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[7px] font-black uppercase tracking-widest text-white/40">ID: {ex.id}</span>
                  <span className={`px-3 py-1 backdrop-blur-md rounded-lg text-[7px] font-black uppercase tracking-widest ${
                    ex.level === "Elite" ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
                    ex.level === "Advanced" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : 
                    "bg-neon-green/20 text-neon-green border border-neon-green/30"
                  }`}>
                    {ex.level}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-6 right-6 z-20 scale-0 group-hover:scale-100 transition-transform duration-500">
                  <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-5 h-5 fill-black" />
                  </div>
                </div>
              </div>

              <div className="flex-grow flex flex-col justify-between">
                <div>
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[9px] font-black text-neon-green uppercase tracking-[0.3em] font-mono italic">{ex.category} SYSTEM</span>
                     <div className="flex -space-x-2">
                       {ex.muscles.slice(0, 2).map((m, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-deep-black flex items-center justify-center text-[6px] font-black uppercase text-white/40">
                           {m[0]}
                         </div>
                       ))}
                       {ex.muscles.length > 2 && <div className="w-6 h-6 rounded-full bg-neon-green border border-deep-black flex items-center justify-center text-[6px] font-black text-black">+{ex.muscles.length - 2}</div>}
                     </div>
                   </div>
                   
                   <h3 className="text-3xl font-display font-black group-hover:text-neon-green transition-colors leading-[0.9] uppercase mb-4 tracking-tighter italic">
                     {ex.title}
                   </h3>
                   
                   <p className="text-white/30 text-[10px] font-semibold uppercase tracking-tight leading-relaxed line-clamp-2 italic">
                     {ex.description}
                   </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-8">
                     <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">METABOLIC</span>
                        <span className="text-[10px] font-black text-white/80">{ex.calories} CAL</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">INTERVAL</span>
                        <span className="text-[10px] font-black text-white/80">{ex.duration}</span>
                     </div>
                  </div>
                  <Link to={`/exercises/${ex.id}`} className="btn-premium !py-3 !px-4 !rounded-xl !bg-white/5 !text-white hover:!bg-neon-green hover:!text-black transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="py-40 text-center glass-panel border-white/5 bg-white/5">
             <Box className="w-16 h-16 text-white/10 mx-auto mb-10" />
             <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">No matching protocols mapped</h3>
             <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em]">Adjust filters or clear search to reset neural link</p>
          </div>
        )}
      </div>
    </div>
  );
}

