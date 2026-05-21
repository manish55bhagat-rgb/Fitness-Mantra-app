import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Play, Clock, Flame, Dumbbell, 
  ChevronRight, CheckCircle2, Info, AlertTriangle, 
  PlayCircle, Timer, Zap, Target, BarChart3
} from "lucide-react";
import { exercises, Exercise } from "../data/exercises";

export default function WorkoutDetail() {
  const { id } = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const found = exercises.find(ex => ex.id === id);
    if (found) setExercise(found);
  }, [id]);

  if (!exercise) return (
    <div className="h-screen flex items-center justify-center bg-deep-black">
      <div className="text-center animate-pulse">
        <Dumbbell className="w-16 h-16 text-neon-green mx-auto mb-6" />
        <p className="text-white/20 font-black uppercase tracking-[0.4em]">Calibrating Protocol...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-deep-black pt-20 pb-40 relative">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/exercises" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all mb-12">
          <ArrowLeft className="w-4 h-4" /> Return to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Visuals & Core Info */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-[48px] overflow-hidden glass-panel p-2 border-white/5 mb-12 group"
            >
              <img 
                src={exercise.image} 
                alt={exercise.title} 
                className={`w-full h-full object-cover transition-all duration-1000 rounded-[40px] ${isPlaying ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
                referrerPolicy="no-referrer"
              />
              
              {/* Simulated Video Player Placeholder */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black flex items-center justify-center rounded-[40px]"
                  >
                    <div className="text-center">
                       <PlayCircle className="w-20 h-20 text-neon-green mx-auto mb-6 animate-pulse" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-green">Streaming Human Performance</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="absolute bottom-12 left-12 right-12 z-30 flex items-end justify-between">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="w-10 h-[1px] bg-neon-green" />
                    <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.5em] font-mono italic">Kinetic Module Alpha</span>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-display font-black leading-none uppercase tracking-tighter italic">
                    {exercise.title}
                  </h1>
                </div>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-24 h-24 bg-neon-green text-black rounded-full flex items-center justify-center shadow-glow transition-transform hover:scale-110 active:scale-95 group/play"
                >
                  <Play className={`w-8 h-8 fill-black transition-transform ${isPlaying ? 'scale-0' : 'scale-100'}`} />
                  <Zap className={`w-8 h-8 absolute transition-transform ${isPlaying ? 'scale-100' : 'scale-0'}`} />
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: "Target", val: exercise.muscles[0], icon: Target, color: "text-neon-green" },
                { label: "Energy", val: `${exercise.calories} kcal`, icon: Flame, color: "text-orange-500" },
                { label: "Interval", val: exercise.duration, icon: Timer, color: "text-blue-500" },
                { label: "Level", val: exercise.level, icon: Zap, color: "text-yellow-500" },
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-6 border-white/5 flex flex-col gap-4">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-sm font-black uppercase text-white/80">{stat.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-12">
               <div>
                 <h4 className="flex items-center gap-4 text-xl font-black uppercase tracking-widest mb-8 italic">
                   <Info className="text-neon-green w-5 h-5" /> Architectural Overview
                 </h4>
                 <p className="text-white/40 text-lg leading-relaxed font-semibold italic uppercase tracking-tight">
                   {exercise.description}
                 </p>
               </div>

               <div className="h-[1px] w-full bg-white/5" />

               <div>
                 <h4 className="flex items-center gap-4 text-xl font-black uppercase tracking-widest mb-10 italic">
                   <AlertTriangle className="text-orange-500 w-5 h-5" /> Form Integrity & Safety
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exercise.tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-white/60 leading-relaxed font-mono">{tip}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Steps & Technical Specs */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-12">
              <div className="glass-panel p-10 border-white/5">
                <h4 className="text-xl font-black uppercase tracking-widest mb-10 italic flex items-center justify-between">
                  Step-by-Step Execution
                  <span className="text-[8px] text-white/20 font-mono tracking-[0.4em]">P-Sequence 24</span>
                </h4>
                
                <div className="space-y-8">
                  {exercise.instructions.map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-6 p-6 rounded-3xl transition-all duration-500 cursor-pointer ${activeStep === idx ? 'bg-neon-green/5 border border-neon-green/30' : 'bg-transparent border border-transparent opacity-40 hover:opacity-100'}`}
                      onClick={() => setActiveStep(idx)}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic shadow-2xl transition-all ${activeStep === idx ? 'bg-neon-green text-black scale-110' : 'bg-white/5 text-white/20'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-black uppercase tracking-widest leading-relaxed italic transition-colors ${activeStep === idx ? 'text-white' : 'text-white/40'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-10 border-white/10 bg-white/[0.01]">
                 <div className="flex items-center justify-between mb-8">
                   <h4 className="text-xl font-black uppercase tracking-widest italic">Neural Specs</h4>
                   <BarChart3 className="text-neon-green w-6 h-6" />
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">Prescribed Load</span>
                       <span className="text-sm font-black text-neon-green">{exercise.reps} REPS</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">Volume Target</span>
                       <span className="text-sm font-black text-white">{exercise.sets} SETS</span>
                    </div>
                    <div className="flex items-center justify-between py-4">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">Equipment Link</span>
                       <div className="flex gap-2">
                         {exercise.equipment.map(e => (
                           <span key={e} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase tracking-widest text-white/60">{e}</span>
                         ))}
                       </div>
                    </div>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full btn-premium py-7 mt-10 !rounded-[24px] shadow-glow flex items-center justify-center gap-4 group"
                 >
                   <Play className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
                   INITIATE WORKOUT PROTOCOL
                 </motion.button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
