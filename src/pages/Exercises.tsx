import { motion } from "motion/react";
import { Search, Filter, Play, Clock, Flame, Dumbbell, Box, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ExerciseModel from "../components/ui/ExerciseModel";

const bodyParts = ["All", "Chest", "Shoulders", "Back", "Legs", "Abs", "Arms", "HIIT", "Yoga"];

const exercises = [
  { id: 1, title: "Bench Press Elite", category: "Chest", level: "Intermediate", cal: 220, time: "20m", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop", muscle: "Chest, Triceps, Shoulders", desc: "Scientific approach to the horizontal push protocol focusing on pectoralis major activation." },
  { id: 2, title: "Deadlift Kinetic", category: "Back", level: "Advanced", cal: 480, time: "30m", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", muscle: "Lower Back, Hamstrings, Core", desc: "High-impact compound movement for total posterior chain architectural stability." },
  { id: 3, title: "Shoulder Press Pro", category: "Shoulders", level: "Advanced", cal: 180, time: "15m", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", muscle: "Deltoids, Triceps", desc: "Vertical pressing module for capped deltoid development and overhead strength." },
  { id: 4, title: "Squat Depth", category: "Legs", level: "Advanced", cal: 550, time: "40m", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070&auto=format&fit=crop", muscle: "Quadriceps, Glutes", desc: "The king of lower body modules. Optimized for explosive force production." },
  { id: 5, title: "Neural Abs Flow", category: "Abs", level: "Beginner", cal: 120, time: "10m", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop", muscle: "Core, Rectus Abdominis", desc: "Stabilization protocol for structural core integrity and aesthetic definition." },
  { id: 6, title: "Bicep Peak Protocol", category: "Arms", level: "Intermediate", cal: 150, time: "20m", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop", muscle: "Biceps Brachii", desc: "Isolated tension module focused on long-head activation and metabolic stress." },
];

export default function Exercises() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"3d" | "image">("3d");

  const filteredExercises = exercises.filter(ex => 
    (activeCategory === "All" || ex.category === activeCategory) &&
    ex.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-32 bg-deep-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-16 relative">
          <div className="absolute top-0 -left-20 w-40 h-40 bg-neon-green/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              <span className="text-neon-green font-black text-[10px] uppercase tracking-[0.6em] font-mono">Form Intelligence Module</span>
            </motion.div>
            <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.8] italic">
              Kinetic<br/><span className="stroke-text font-black">Intelligence</span>
            </h1>
            <p className="text-white/40 max-w-xl font-semibold font-mono uppercase tracking-tight text-sm mt-10 leading-relaxed">
              Neural mapping and high-fidelity 3D architectural views of elite motion sequences. 
              Calibrate your physical form against professional kinetic simulations.
            </p>
          </div>
          
          <div className="flex bg-white/[0.03] p-1.5 rounded-3xl border border-white/10 shrink-0 backdrop-blur-2xl">
            <button 
              onClick={() => setViewMode("3d")}
              className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === "3d" ? "bg-neon-green text-black shadow-[0_10px_30px_rgba(57,255,20,0.3)]" : "text-white/40 hover:text-white"}`}
            >
              3D Hologram
            </button>
            <button 
              onClick={() => setViewMode("image")}
              className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === "image" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              Visual Capture
            </button>
          </div>
        </header>

        {/* Console Filters */}
        <div className="flex flex-col md:flex-row gap-8 mb-24 items-center justify-between">
          <div className="relative w-full md:w-[500px] border-b border-white/10 focus-within:border-neon-green transition-all pb-2">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
            <input 
              type="text" 
              placeholder="INITIALIZE SEARCH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none py-4 pl-12 pr-6 focus:outline-none font-black text-[10px] uppercase tracking-[0.3em] text-white/80 placeholder:text-white/10"
            />
          </div>

          <div className="flex gap-4 p-2 overflow-x-auto no-scrollbar max-w-full lg:max-w-3xl glass-panel !rounded-2xl border-white/5">
            {bodyParts.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-10 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${
                  activeCategory === cat ? "bg-neon-green text-black" : "text-white/20 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          {filteredExercises.map((ex, idx) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              className="premium-exercise-card group flex flex-col md:flex-row h-auto md:h-[450px] relative"
            >
              {/* Image/Model Container */}
              <div className="w-full md:w-[45%] relative overflow-hidden bg-black/60 rounded-l-[40px] border border-white/5 group-hover:border-neon-green/30 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                
                {viewMode === "image" ? (
                  <img 
                    src={ex.image} 
                    alt={ex.title} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-[2000ms]" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full scale-110 group-hover:scale-125 transition-transform duration-1000">
                    <ExerciseModel type={ex.title} />
                  </div>
                )}
                
                <div className="absolute top-8 left-8 z-20">
                  <div className="px-5 py-2 bg-neon-green/10 border border-neon-green/30 text-neon-green text-[8px] font-black uppercase tracking-[0.4em] rounded-lg backdrop-blur-xl group-hover:bg-neon-green group-hover:text-black transition-all">
                    {ex.level}
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 z-20">
                  <button className="w-16 h-16 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:border-neon-green transition-all duration-700 group/btn shadow-2xl">
                    <Play className="text-white w-7 h-7 fill-white/10 group-hover/btn:fill-neon-green group-hover/btn:text-neon-green transition-all" />
                  </button>
                </div>
              </div>

              {/* Information Panel */}
              <div className="w-full md:w-[55%] p-14 bg-white/[0.02] border-y border-r border-white/5 rounded-r-[40px] flex flex-col justify-between group-hover:border-neon-green/10 transition-all">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-[1px] bg-neon-green/30" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-mono">{ex.category} SYSTEM</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-display font-black group-hover:text-neon-green transition-colors leading-tight uppercase mb-8 tracking-tighter italic">
                    {ex.title}
                  </h3>
                  
                  <p className="text-white/30 text-sm leading-relaxed font-semibold uppercase tracking-tight line-clamp-2 md:line-clamp-none">
                    {ex.desc}
                  </p>
                </div>

                <div className="space-y-12">
                  <div className="flex items-center gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/5 w-fit">
                    <span className="text-neon-green font-black uppercase text-[8px] tracking-[0.3em] font-mono">Kinetic Focus:</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase">{ex.muscle}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-10">
                    <div className="flex gap-12">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-white/20 font-black uppercase font-mono tracking-widest">Tempo</span>
                        <span className="text-sm font-black text-white/80">{ex.time}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-white/20 font-black uppercase font-mono tracking-widest">Force Output</span>
                        <span className="text-sm font-black text-neon-green">{ex.cal} KCAL</span>
                      </div>
                    </div>
                    <Link to={`/exercises/${ex.id}`} className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                      <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-neon-green" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
