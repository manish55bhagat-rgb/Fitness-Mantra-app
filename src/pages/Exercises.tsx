import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Target, Zap, Flame, 
  Timer, Activity, ChevronLeft, ChevronRight, Heart, Info, 
  AlertTriangle, Check, CheckCircle2, Settings, Sparkles, Plus, 
  Minus, Maximize2, User, Dumbbell, Search, Sparkle, RefreshCw
} from "lucide-react";
import { exercises, Exercise } from "../data/exercises";
import { voiceService } from "../services/voiceService";
import { ExerciseModel } from "../components/ui/ExerciseModel";
import MuscleHighlighter from "../components/ui/MuscleHighlighter";

export default function Exercises() {
  // --- Active Exercise Selection ---
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const activeExercise = useMemo(() => exercises[activeExerciseIndex] || exercises[0], [activeExerciseIndex]);

  // --- Search & Filtering ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Abs", "Cardio"];

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ex.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || ex.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // --- Navigation & View Controls ---
  const [viewTab, setViewTab] = useState<"3d" | "muscle">("3d");
  const [simulatorMode, setSimulatorMode] = useState<"photo" | "3d">("photo");
  const [viewAngle, setViewAngle] = useState<"front" | "side" | "back">("front");
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);

  // --- Voice Coach & Audio state ---
  const [isVoiceCoachEnabled, setIsVoiceCoachEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- Active Session Workout Timer ---
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(20); // 20s demo active
  const maxExerciseDuration = 20;
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState(765); // 00:12:45
  const [completedExercisesCount, setCompletedExercisesCount] = useState(5);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(120);

  // --- Social Favorites ---
  const [favorites, setFavorites] = useState<string[]>(["push-up", "bench-press"]);

  // --- UI feedback states ---
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // --- Audio Voice Cue Trigger ---
  const triggerVoiceInstruction = async (text: string) => {
    if (!isVoiceCoachEnabled) return;
    try {
      setIsSpeaking(true);
      await voiceService.speak(text);
    } catch (e) {
      console.warn("Speech synthesis bypassed.", e);
    } finally {
      setIsSpeaking(false);
    }
  };

  // --- Handles change of active exercise ---
  const handleSelectExercise = (index: number) => {
    setActiveExerciseIndex(index);
    setIsWorkoutActive(false);
    setExerciseTimeLeft(20);
    
    // Auto voice prompt on load
    const ex = exercises[index];
    if (ex) {
      triggerVoiceInstruction(`Now viewing ${ex.title}. Targeted muscle is ${ex.muscles[0]}. ${ex.tips[0]}`);
    }
  };

  // --- Sequence navigation ---
  const handlePreviousExercise = () => {
    const prevIndex = activeExerciseIndex === 0 ? exercises.length - 1 : activeExerciseIndex - 1;
    handleSelectExercise(prevIndex);
  };

  const handleNextExercise = () => {
    const nextIndex = activeExerciseIndex === exercises.length - 1 ? 0 : activeExerciseIndex + 1;
    handleSelectExercise(nextIndex);
  };

  // --- Heart toggle ---
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // --- Timer Tick Side Effects ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWorkoutActive && exerciseTimeLeft > 0) {
      interval = setInterval(() => {
        setExerciseTimeLeft(prev => prev - 1);
        setTotalWorkoutSeconds(prev => prev + 1);
        
        // Mid-way encouragement check
        if (exerciseTimeLeft === 10) {
          triggerVoiceInstruction("Halfway there! Keep your form solid!");
        }
      }, 1000);
    } else if (isWorkoutActive && exerciseTimeLeft === 0) {
      setIsWorkoutActive(false);
      setCompletedExercisesCount(prev => prev + 1);
      setTotalCaloriesBurned(prev => prev + Math.round(activeExercise.calories / 3));
      triggerVoiceInstruction(`Incredible job! You have completed the ${activeExercise.title}! Take a short rest.`);
      setExerciseTimeLeft(20);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive, exerciseTimeLeft, activeExercise]);

  // --- Total workout elapsed timer (ticks constantly in background) ---
  useEffect(() => {
    const totalInterval = setInterval(() => {
      setTotalWorkoutSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(totalInterval);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format seconds to HH:MM:SS
  const formatWorkoutDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartWorkout = () => {
    if (isWorkoutActive) {
      setIsWorkoutActive(false);
    } else {
      setIsWorkoutActive(true);
      triggerVoiceInstruction(`Starting ${activeExercise.title}. Sets: ${activeExercise.sets}, reps: ${activeExercise.reps}. Focus on your ${activeExercise.muscles[0]} contract!`);
    }
  };

  // Trainer high-res visuals based on angle and active exercise category
  const activeTrainerPoseUrl = useMemo(() => {
    // Elegant, highly aesthetic dark photographic links matching the tan muscular trainer
    // Front view doing push up or pose
    if (activeExercise.id === "push-up") {
      if (viewAngle === "front") return "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop";
      if (viewAngle === "side") return "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop";
      return "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800&auto=format&fit=crop";
    }

    if (viewAngle === "front") {
      return "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop"; // handsome muscular trainer front
    } else if (viewAngle === "side") {
      return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"; // sideways exercise visual
    } else {
      return "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800&auto=format&fit=crop"; // Back visual
    }
  }, [viewAngle, activeExercise]);

  const progressPercentage = Math.round((completedExercisesCount / 12) * 100);

  const nextExerciseTitle = useMemo(() => {
    const nextIdx = (activeExerciseIndex + 1) % exercises.length;
    return exercises[nextIdx]?.title || "Bench Press";
  }, [activeExerciseIndex]);

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-20 pb-28 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Cinematic Red Ambient Spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-red-500/5 blur-[200px] rounded-full pointer-events-none" />
      
      {/* 1. Header Navigation HUD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/30">
              <span className="font-display font-black text-black text-xl italic">M</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl uppercase tracking-wider italic text-white">
                FITNESS <span className="text-red-500 text-glow">MANTRA</span>
              </span>
              <p className="text-[7px] font-mono tracking-[0.4em] text-white/30 uppercase mt-0.5">High Fidelity Athletic Platform</p>
            </div>
          </div>

          {/* Center Tabs: 3D Simulator vs Muscle Anatomical View */}
          <div className="flex bg-[#111116] p-1 rounded-2xl border border-white/5 shadow-inner">
            <button 
              onClick={() => { setViewTab("3d"); setSimulatorMode("3d"); }}
              className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${viewTab === "3d" ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "text-white/40 hover:text-white"}`}
            >
              3D VIEW
            </button>
            <button 
              onClick={() => { setViewTab("muscle"); }}
              className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${viewTab === "muscle" ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "text-white/40 hover:text-white"}`}
            >
              MUSCLE VIEW
            </button>
          </div>

          {/* Right Header buttons */}
          <div className="flex items-center gap-3">
            {/* Voice Coach Toggle Button */}
            <button 
              onClick={() => {
                setIsVoiceCoachEnabled(!isVoiceCoachEnabled);
                triggerVoiceInstruction(isVoiceCoachEnabled ? "Voice coach muted." : "Voice coach activated. Form tips will be spoken.");
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                isVoiceCoachEnabled 
                  ? "bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.1)]" 
                  : "bg-white/[0.02] border-white/5 text-white/30 hover:text-white/60"
              }`}
            >
              {isVoiceCoachEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
              {isSpeaking ? "COACH TALKING" : "VOICE COACH"}
            </button>

            {/* System config button */}
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="p-3 bg-[#111116] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>
      </div>

      {/* 2. Main Studio Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER (60% Desktop) - Visualizer Canvas & Exercise Library */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Camera / Stage Viewport */}
            <div className="relative aspect-video rounded-[36px] overflow-hidden border border-white/[0.06] bg-[#0c0c10] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
              
              {/* Camera Angle Selector Overlays */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 bg-[#0d0d12]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/[0.05] flex gap-4">
                {(["front", "side", "back"] as const).map(angle => (
                  <button
                    key={angle}
                    onClick={() => {
                      setViewAngle(angle);
                      triggerVoiceInstruction(`Switching to ${angle} profile angle.`);
                    }}
                    className={`text-[8px] font-black uppercase tracking-widest transition-colors ${viewAngle === angle ? "text-red-500 text-glow" : "text-white/30 hover:text-white/60"}`}
                  >
                    {angle} VIEW
                  </button>
                ))}
              </div>

              {/* View mode toggle button (Photo vs 3D) inside the frame */}
              <div className="absolute top-5 left-5 z-30">
                <div className="bg-[#0d0d12]/80 backdrop-blur-md p-1 rounded-xl border border-white/[0.05] flex gap-1">
                  <button 
                    onClick={() => setSimulatorMode("photo")}
                    className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${simulatorMode === "photo" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                  >
                    TRAINER PHOTO
                  </button>
                  <button 
                    onClick={() => setSimulatorMode("3d")}
                    className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${simulatorMode === "3d" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                  >
                    3D ENGINE
                  </button>
                </div>
              </div>

              {/* 3D Camera Controls on Left Margin (Floating circles) */}
              {simulatorMode === "3d" && (
                <div className="absolute left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
                  <button 
                    onClick={() => setZoomFactor(prev => Math.min(2.0, prev + 0.25))}
                    className="w-8 h-8 rounded-full bg-[#0d0d12]/80 backdrop-blur-md border border-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    title="Zoom In"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setZoomFactor(prev => Math.max(0.5, prev - 0.25))}
                    className="w-8 h-8 rounded-full bg-[#0d0d12]/80 backdrop-blur-md border border-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    title="Zoom Out"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${autoRotate ? "bg-red-500/20 border-red-500/40 text-red-500" : "bg-[#0d0d12]/80 border-white/[0.05] text-white/40"}`}
                    title="Auto Rotate Orbit"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
                  </button>
                  <button 
                    onClick={() => { setZoomFactor(1.0); setViewAngle("front"); }}
                    className="w-8 h-8 rounded-full bg-[#0d0d12]/80 backdrop-blur-md border border-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    title="Reset Angle"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Stage Viewport Area */}
              <div className="w-full h-full relative z-10">
                {simulatorMode === "photo" ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={activeTrainerPoseUrl} 
                      alt="Default Fitness Trainer Pose"
                      className="w-full h-full object-cover brightness-95 contrast-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient mapping on the visualizer card to give it high luxury studio feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
                    
                    {/* Overlay Trainer Identification Label */}
                    <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/5">
                      <p className="text-[7px] font-mono tracking-widest text-white/30 uppercase">DEFAULT TRAINER ACTIVE</p>
                      <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">Aesthetic Physique Replica</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <ExerciseModel 
                      type={activeExercise.title} 
                      viewAngle={viewAngle} 
                      zoom={zoomFactor}
                      autoRotate={autoRotate}
                    />
                  </div>
                )}
              </div>

              {/* Media Player Floating Overlays */}
              {/* Previous / Next chevrons */}
              <button 
                onClick={handlePreviousExercise}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handleNextExercise}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Bottom control bar: Timeline and Play button */}
              <div className="absolute bottom-0 left-0 w-full z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  {/* Glowing central Play/Pause circle button */}
                  <button 
                    onClick={handleStartWorkout}
                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-500/20 active:scale-95 transition-transform shrink-0"
                  >
                    {isWorkoutActive ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </button>

                  {/* Active Timeline scrub line with progress bar */}
                  <div className="flex-grow flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Exercise Routine Progression</span>
                      <span className="text-[10px] font-mono text-red-500 font-bold">{formatTime(maxExerciseDuration - exerciseTimeLeft)} / {formatTime(maxExerciseDuration)}</span>
                    </div>
                    
                    {/* Custom progress bar line */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000 relative"
                        style={{ width: `${((maxExerciseDuration - exerciseTimeLeft) / maxExerciseDuration) * 100}%` }}
                      >
                        {/* Glowing red scrubber head */}
                        <div className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. EXERCISE LIBRARY: Horizontal Thumbnail Cards Slider */}
            <div className="bg-[#0c0c10]/40 border border-white/[0.04] p-5 rounded-[28px] backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/75">EXERCISE LIBRARY</span>
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">36 MODULES</span>
                </div>
                
                {/* Search Bar Input inside list header */}
                <div className="relative w-44">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#111116] text-[9px] font-semibold text-white/70 placeholder:text-white/20 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 focus:outline-none focus:border-red-500/40 uppercase tracking-widest"
                  />
                </div>
              </div>

              {/* Category fast filters */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-1.5 border-b border-white/[0.03]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${
                      selectedCategory === cat 
                        ? "bg-red-500 text-white shadow-lg" 
                        : "bg-white/[0.02] hover:bg-white/5 text-white/30 hover:text-white/60 border border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Slider Deck List */}
              <div className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar max-h-[140px]">
                {filteredExercises.map((ex, i) => {
                  const actualIndex = exercises.findIndex(orig => orig.id === ex.id);
                  const isActive = actualIndex === activeExerciseIndex;
                  return (
                    <div 
                      key={ex.id}
                      onClick={() => handleSelectExercise(actualIndex)}
                      className={`relative flex-shrink-0 w-28 aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                        isActive 
                          ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] scale-[1.03]" 
                          : "border-white/5 opacity-50 hover:opacity-90 hover:scale-102"
                      }`}
                    >
                      <img 
                        src={ex.image} 
                        alt={ex.title} 
                        className="w-full h-full object-cover brightness-90 grayscale group-hover:grayscale-0 transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[6px] font-mono uppercase tracking-widest text-red-500 font-bold">{ex.category}</p>
                        <p className="text-[8px] font-black uppercase tracking-tight line-clamp-1 leading-tight text-white">{ex.title}</p>
                      </div>
                    </div>
                  );
                })}

                {filteredExercises.length === 0 && (
                  <div className="w-full py-10 text-center text-white/25 text-[10px] font-black uppercase tracking-widest">
                    No matching exercises found.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT CONTAINER (40% Desktop) - Anatomical Specifications details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Main exercise details card */}
            <div className="bg-[#0c0c10]/40 border border-white/[0.04] p-8 rounded-[36px] backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/5 blur-3xl rounded-full" />
              
              {/* Header block */}
              <div className="flex items-start justify-between border-b border-white/[0.04] pb-5 mb-5">
                <div>
                  <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[7px] font-mono font-black uppercase tracking-widest rounded-md">
                    {activeExercise.category} SYSTEM
                  </span>
                  <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-white mt-3 flex items-center gap-2">
                    {activeExercise.title}
                  </h2>
                </div>
                
                {/* Heart wishlist toggle */}
                <button 
                  onClick={() => toggleFavorite(activeExercise.id)}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    favorites.includes(activeExercise.id) 
                      ? "bg-red-500/20 border-red-500/40 text-red-500 shadow-glow" 
                      : "bg-[#111116] border-white/5 text-white/30 hover:text-white/60"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(activeExercise.id) ? "fill-red-500" : ""}`} />
                </button>
              </div>

              {/* Anatomy Highlighter tab wrapper */}
              <div className="mb-6">
                {viewTab === "muscle" ? (
                  <div className="w-full animate-fade-in">
                    <MuscleHighlighter activeMuscles={activeExercise.muscles} />
                  </div>
                ) : (
                  <div className="glass-panel p-5 border-white/5 bg-black/30 rounded-2xl flex items-center gap-5">
                    {/* Tiny anatomical vector showing targeted muscle glowing Neon Red */}
                    <div className="w-16 h-28 flex-shrink-0 bg-black/50 border border-white/5 rounded-xl p-1.5 flex items-center justify-center">
                      <svg viewBox="0 0 100 220" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                        <path 
                          d="M50,15 C54,15 57,18 57,24 C57,28 54,32 50,32 C46,32 43,28 43,24 C43,18 46,15 50,15 Z M50,32 C48,32 46,35 44,40 C42,45 38,50 33,53 C29,55 27,58 27,62 L24,105 C24,108 26,110 29,110 C32,110 33,107 33,105 L35,70 L38,70 L35,115 C34,120 33,128 33,135 L33,205 C33,208 35,210 38,210 C41,210 43,208 43,205 L44,145 C44,142 46,140 50,140 C54,140 56,142 56,145 L57,205 C57,208 59,210 62,210 C65,210 67,208 67,205 L67,135 C67,128 66,120 65,115 L62,70 L65,70 L67,105 C67,107 68,110 71,110 C74,110 76,108 76,105 L73,62 C73,58 71,55 67,53 C62,50 58,45 56,40 C54,35 52,32 50,32 Z" 
                          fill="#15151a" 
                          stroke="#333" 
                          strokeWidth="2" 
                        />
                        {/* Target Muscle Glowing Red Overlay */}
                        <circle cx="50" cy="58" r="12" fill="#FF3B30" opacity="0.8" className="animate-ping" style={{ transformOrigin: "50px 58px" }} />
                        <circle cx="50" cy="58" r="8" fill="#FF3B30" style={{ filter: "drop-shadow(0 0 6px #FF3B30)" }} />
                      </svg>
                    </div>

                    <div className="flex-grow">
                      <p className="text-[8px] font-mono tracking-widest text-white/30 uppercase">Primary Target Muscle</p>
                      <h4 className="text-xl font-black uppercase text-red-500 tracking-tight">{activeExercise.muscles[0]}</h4>
                      <p className="text-[8px] font-mono tracking-widest text-white/30 uppercase mt-3">Secondary Muscle Groups</p>
                      <p className="text-xs font-black text-white/60 uppercase">{activeExercise.secondaryMuscles.join(", ") || "None Isolated"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Specifications Box */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 mb-6">
                {[
                  { label: "Difficulty", val: activeExercise.level, color: "text-red-500" },
                  { label: "Equipment", val: activeExercise.equipment[0] || "None", color: "text-white" },
                  { label: "Suggested Sets", val: `${activeExercise.sets} Sets`, color: "text-white" },
                  { label: "Reps Target", val: activeExercise.reps, color: "text-white" },
                  { label: "Rest Period", val: `${activeExercise.rest}s`, color: "text-white" },
                  { label: "Burn Estimate", val: `~${activeExercise.calories} kcal`, color: "text-red-400" },
                ].map((spec, idx) => (
                  <div key={idx} className="bg-[#111116] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[7px] font-mono font-black text-white/20 uppercase tracking-widest">{spec.label}</span>
                    <span className={`text-xs font-black uppercase tracking-tight mt-1.5 ${spec.color}`}>{spec.val}</span>
                  </div>
                ))}
              </div>

              {/* Form Integrity Alerts */}
              <div className="space-y-4 border-t border-white/[0.04] pt-5">
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-red-400 tracking-widest mb-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" /> COMMON MISTAKES
                  </h4>
                  <div className="space-y-1.5">
                    {activeExercise.id === "push-up" ? (
                      <>
                        <p className="text-[9px] font-semibold uppercase text-white/40 tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" /> Flared elbows perpendicular to body
                        </p>
                        <p className="text-[9px] font-semibold uppercase text-white/40 tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" /> Sagging pelvis or arched spine
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[9px] font-semibold uppercase text-white/40 tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" /> Using fast bouncing inertia / cheating momentum
                        </p>
                        <p className="text-[9px] font-semibold uppercase text-white/40 tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" /> Incomplete range of extension or contraction
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-red-400 tracking-widest mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" /> PRO COACH TIPS
                  </h4>
                  <div className="space-y-2">
                    {activeExercise.tips.map((tip, i) => (
                      <div key={i} className="flex gap-2 bg-white/[0.01] border border-white/5 rounded-lg p-2.5">
                        <Check className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider leading-normal">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* START WORKOUT COUNTDOWN CTA */}
              <div className="mt-8 pt-5 border-t border-white/[0.04]">
                <button 
                  onClick={handleStartWorkout}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_0_25px_rgba(239,68,68,0.2)] border flex items-center justify-center gap-3 active:scale-[0.98] transition-all ${
                    isWorkoutActive 
                      ? "bg-transparent border-red-500/40 text-red-500" 
                      : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-red-500/30 text-white shadow-[0_4px_20px_rgba(239,68,68,0.35)]"
                  }`}
                >
                  {isWorkoutActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-red-500" />
                      PAUSE ROUTINE ({exerciseTimeLeft}S LEFT)
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      START EXERCISE ({activeExercise.duration})
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 4. Default Trainer physical specs / photos bottom dock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trainer poses standing front, side, back (Left 60%) */}
          <div className="lg:col-span-7 bg-[#0c0c10]/40 border border-white/[0.04] p-6 rounded-[28px] backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/75 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-red-500" /> DEFAULT TRAINER PROFILE ANGLES
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "FRONT PROFILE", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop" },
                { label: "SIDE PROFILE", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop" },
                { label: "BACK PROFILE", img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=600&auto=format&fit=crop" }
              ].map((pose, idx) => (
                <div key={idx} className="flex flex-col gap-2 group cursor-pointer" onClick={() => {
                  setViewAngle(idx === 0 ? "front" : idx === 1 ? "side" : "back");
                  triggerVoiceInstruction(`Calibrating to trainer's ${pose.label.toLowerCase()}`);
                }}>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/5 relative bg-[#111]">
                    <img 
                      src={pose.img} 
                      alt={pose.label} 
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2 text-[6px] sm:text-[7px] font-mono text-white/50 tracking-widest">{pose.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trainer biographical specifications (Right 40%) */}
          <div className="lg:col-span-5 bg-[#0c0c10]/40 border border-white/[0.04] p-6 rounded-[28px] backdrop-blur-md flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/75 mb-4 flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-red-500 animate-pulse" /> PHYSICAL MODEL SPECS
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: "Height", v: "178 cm" },
                  { k: "Weight", v: "75 kg" },
                  { k: "Body Type", v: "Athletic" },
                  { k: "Experience", v: "5+ Years" },
                  { k: "Specialization", v: "Strength Training" },
                  { k: "Target Metric", v: "Natural Physique" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{item.k}</span>
                    <span className="text-[10px] font-black text-white/80 uppercase">{item.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing highlight badges */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {["Natural Physique", "Realistic Skin", "High Detail", "Optimized Core"].map((badge, idx) => (
                <div key={idx} className="px-1 py-2 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col items-center justify-center text-center">
                  <span className="text-[6px] font-black tracking-wider uppercase text-white/40 leading-tight">{badge}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. Real-Time Tracking HUD Analytics Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050508]/90 backdrop-blur-md border-t border-white/[0.05] py-4 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            {/* Workout time */}
            <div className="flex items-center gap-3">
              <Timer className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-[6px] font-mono text-white/30 uppercase tracking-widest">WORKOUT TIME</p>
                <p className="text-xs font-black text-white">{formatWorkoutDuration(totalWorkoutSeconds)}</p>
              </div>
            </div>

            {/* Exercises completed */}
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-[6px] font-mono text-white/30 uppercase tracking-widest">EXERCISES</p>
                <p className="text-xs font-black text-white">{completedExercisesCount} / 12</p>
              </div>
            </div>

            {/* Calories burned */}
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <div>
                <p className="text-[6px] font-mono text-white/30 uppercase tracking-widest">BURNED CALORIES</p>
                <p className="text-xs font-black text-red-400">{totalCaloriesBurned} KCAL</p>
              </div>
            </div>

            {/* Progress line indicator */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[6px] font-mono text-white/30 uppercase tracking-widest">SESSION PROGRESS</span>
                <div className="flex items-center gap-2.5">
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${progressPercentage}%` }} />
                  </div>
                  <span className="text-xs font-black text-white">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Up next ticket ticker */}
          <button 
            onClick={handleNextExercise}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-5 py-2.5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-98"
          >
            <div className="text-right">
              <p className="text-[6px] font-mono text-white/30 uppercase tracking-widest">UP NEXT</p>
              <p className="text-[9px] font-black uppercase tracking-widest">{nextExerciseTitle}</p>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Options Modal Overlay */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettingsModal(false)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0c0c10] border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4 text-white">System Config HUD</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Audio Coach Engine</span>
                  <input 
                    type="checkbox" 
                    checked={isVoiceCoachEnabled} 
                    onChange={e => setIsVoiceCoachEnabled(e.target.checked)}
                    className="accent-red-500"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Engine Auto-Rotation</span>
                  <input 
                    type="checkbox" 
                    checked={autoRotate} 
                    onChange={e => setAutoRotate(e.target.checked)}
                    className="accent-red-500"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Default Trainer Replica</span>
                  <span className="text-[10px] font-black text-red-500 uppercase">AESTHETIC-01</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Render Resolution</span>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20">RETINA SHADER</span>
                </div>
              </div>

              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-full mt-6 py-3 bg-red-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-red-700 transition-colors shadow-lg"
              >
                Close Configuration Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export { Exercises };
