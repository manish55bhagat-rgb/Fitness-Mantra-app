import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, Clock, Check, Trophy, Play, Star, Sparkles, 
  ChevronRight, Dumbbell, Calendar, Heart, ShieldAlert,
  Sliders, Info, Zap, LayoutGrid, CheckCircle2, RotateCcw,
  BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { generateWorkoutForDay, masterBodyweightExercises } from "../data/homeWorkoutProgram";

export default function Programs() {
  const { user, profile, workouts, loading, setModalOpen, setModalTab } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected program configurations
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"30-day" | "curated">("30-day");

  // Success Feedback
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [justCompletedDay, setJustCompletedDay] = useState<number | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const completedDay = searchParams.get("completedDay");
      if (completedDay) {
        setJustCompletedDay(parseInt(completedDay));
        setShowSuccessToast(true);
        setSelectedDay(Math.min(30, parseInt(completedDay) + 1)); // auto highlight the next day!
        setTimeout(() => setShowSuccessToast(false), 8000);
      }
    }
  }, [searchParams]);

  // Extract completed program days from global Firestore sync workouts array
  const completedProgramWorkouts = workouts.filter(
    w => w.completed && w.workoutName.toLowerCase().includes("30-day home program:")
  );

  // Extract completed days numbers set
  const completedDaysSet = new Set<number>();
  completedProgramWorkouts.forEach(w => {
    const match = w.workoutName.match(/Day\s+(\d+)/i);
    if (match) {
      completedDaysSet.add(parseInt(match[1]));
    }
  });
  const completedDays = Array.from(completedDaysSet);

  // Extract maximum completed day to compute next dynamic day to play
  const maxCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  const recommendedNextDay = Math.min(30, maxCompletedDay + 1);

  // Auto set active day to recommendedNextDay on initial load if not completed yet
  useEffect(() => {
    if (completedDays.length > 0) {
      setSelectedDay(recommendedNextDay);
    }
  }, [completedDays.length]);

  // Dynamic Workout Streak calculation algorithm
  const calculateStreak = (): number => {
    if (completedProgramWorkouts.length === 0) return 0;

    // Map timestamps to unique local dates (YYYY-MM-DD)
    const uniqueDates = Array.from(new Set(
      completedProgramWorkouts.map(w => w.timestamp.split("T")[0])
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending (newest first)

    if (uniqueDates.length === 0) return 0;

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const mostRecentDateStr = uniqueDates[0];
    // If the athlete hasn't completed any target workout today or yesterday, the streak cools down to 0
    if (mostRecentDateStr !== todayStr && mostRecentDateStr !== yesterdayStr) {
      return 0;
    }

    let streak = 1;
    let currentComparisonDate = new Date(mostRecentDateStr);

    for (let i = 1; i < uniqueDates.length; i++) {
      const precedingDate = new Date(uniqueDates[i]);
      const diffMilliseconds = currentComparisonDate.getTime() - precedingDate.getTime();
      const diffDays = Math.round(diffMilliseconds / 86400000);

      if (diffDays === 1) {
        streak++;
        currentComparisonDate = precedingDate;
      } else if (diffDays > 1) {
        break; // Gap in days, streak cut-off
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const completionPercentage = Math.round((completedDays.length / 30) * 100);
  const totalExercisesCompleted = completedProgramWorkouts.length * (level === "Beginner" ? 8 : level === "Intermediate" ? 10 : 12);

  // Dynamic Coach Tips Advice based on streak
  const getCoachFeedback = () => {
    if (currentStreak === 0) {
      return "Start your Day 1 protocol today. The hardest part of the journey is launching the first rep. No equipment is needed—only your focus.";
    } else if (currentStreak <= 3) {
      return `Solid rhythm! You are on a ${currentStreak}-day heat streak. Maintain this trajectory to secure neuromuscular adaptations.`;
    } else if (currentStreak <= 7) {
      return `Outstanding focus! ${currentStreak} days consecutive. Your respiratory threshold is upgrading. Squeeze pectorals hard at lockouts.`;
    } else {
      return `Absolute beast mode! An elite ${currentStreak}-day training streak. You are building structural steel. Maintain nutrition compliance!`;
    }
  };

  // Generate lists of exercises for selected day & difficulty
  const dayExercises = generateWorkoutForDay(selectedDay, level);
  const estimatedWorkoutMinutes = level === "Beginner" ? 15 : level === "Intermediate" ? 22 : 30;
  const estimatedCaloriesBurn = dayExercises.reduce((sum, ex) => sum + ex.estimatedKcal, 0);

  const startWorkoutPlayer = (dayNum: number) => {
    if (!user) {
      setModalTab("signin");
      setModalOpen(true);
      return;
    }
    navigate(`/workout-player?day=${dayNum}&level=${level}`);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white relative py-12">
      {/* Visual cyber decorations */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* FEEDBACK SUCCESS TOAST (Day completed celebration) */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-8 p-6 bg-gradient-to-r from-neon-green/20 via-black/90 to-red-500/10 border border-neon-green/30 rounded-[24px] shadow-[0_0_30px_rgba(57,255,20,0.15)] flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left relative overflow-hidden"
            >
              {/* Light beam */}
              <div className="absolute -top-10 left-1/3 w-32 h-32 bg-neon-green/4 pr-4 blur-2xl rounded-full" />
              <div>
                <span className="text-[8px] font-mono text-neon-green font-black uppercase tracking-widest block mb-1">COACH COMPLIANCE APPROVAL</span>
                <h4 className="text-xl font-display font-black uppercase tracking-tight italic">
                  Outstanding Work on Day {justCompletedDay}!
                </h4>
                <p className="text-xs text-white/50 uppercase tracking-wide mt-1 max-w-xl">
                  Your workout was compiled, evaluated, and logged securely task-by-task. Recommended action: Hydrate immediately and prepare for Day {selectedDay}.
                </p>
              </div>
              <button 
                onClick={() => startWorkoutPlayer(selectedDay)}
                className="px-6 py-3 bg-neon-green hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-glow transition-all whitespace-nowrap active:scale-95"
              >
                Launch Day {selectedDay} Protocol 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO TITLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Dumbbell className="w-5 h-5 text-neon-green animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.45em] text-neon-green uppercase font-mono italic">CALISTHENICS SPECIFICATION</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none italic">
              Home Workouts <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-white to-red-500">No Equipment</span>
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-4 max-w-2xl leading-relaxed">
              De-engineer dependence on mechanical gym rigs. High-intensity home protocols targeting relative strength, skeletal density, and severe lactic acid threshold expansions.
            </p>
          </div>

          {/* Tab switches */}
          <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab("30-day")}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "30-day" 
                  ? "bg-white text-black shadow-lg font-extrabold" 
                  : "text-white/45 hover:text-white"
              }`}
            >
              30-Day Engine
            </button>
            <Link
              to="/exercises"
              className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/45 hover:text-white transition-all flex items-center gap-1"
            >
              Interactive 3D Library
            </Link>
          </div>
        </div>

        {activeTab === "30-day" ? (
          <div className="space-y-12">
            
            {/* LEVEL SELECTORS AND STATS BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Level / Config Controls Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-6 sm:p-8 border-white/5 bg-black/40 backdrop-blur-3xl rounded-[32px] flex flex-col justify-between select-none relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyber-grid bg-[size:16px_16px] opacity-[0.02] pointer-events-none" />
                  
                  <span className="text-[8px] font-mono text-white/30 font-bold uppercase tracking-[0.25em] mb-4 block">SELECT ATHLETIC CAPACITY</span>
                  <h3 className="text-xl font-display font-black uppercase tracking-tight italic mb-6">Intensity Level</h3>
                  
                  <div className="flex flex-col gap-2.5">
                    {[
                      { id: "Beginner", label: "Beginner", desc: "8 Exercises • 3 Sets • 30s Active/Rest" },
                      { id: "Intermediate", label: "Intermediate", desc: "10 Exercises • 4 Sets • 45s Active/20s Rest" },
                      { id: "Advanced", label: "Advanced", desc: "12 Exercises • 4 Sets • 45s Active/15s Rest" }
                    ].map(l => (
                      <button
                        key={l.id}
                        onClick={() => setLevel(l.id as any)}
                        className={`p-4 rounded-[20px] text-left border transition-all duration-300 relative group overflow-hidden ${
                          level === l.id 
                            ? "bg-gradient-to-r from-neon-green/10 to-transparent border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.05)]" 
                            : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 relative z-10">
                          <span className={`text-[11px] font-black uppercase tracking-wider ${level === l.id ? 'text-neon-green' : 'text-white/70'}`}>
                            {l.label}
                          </span>
                          {level === l.id && <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping" />}
                        </div>
                        <p className="text-[9px] font-mono text-white/30 group-hover:text-white/45 transition-colors uppercase tracking-wider relative z-10">
                          {l.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex gap-3 text-[9px] text-white/30 font-mono uppercase tracking-wider items-center leading-relaxed">
                    <Info className="w-5 h-5 text-white/20 shrink-0" />
                    <span>Progression: Complete active day cells to advance skeletal capacity.</span>
                  </div>
                </div>

                {/* Manish Bhagat Coach Consultation banner */}
                <div className="bg-gradient-to-br from-red-500/10 to-black/80 border border-white/5 rounded-[32px] p-6 sm:p-8 relative overflow-hidden text-left shadow-xl">
                  {/* Glowing pulse */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl rounded-full" />
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[8px] font-mono font-black text-red-500 tracking-widest uppercase">DIRECT COMMUNIQUE</span>
                  </div>
                  <h4 className="text-sm font-display font-black uppercase tracking-tight italic text-white mb-2">Manish Bhagat's Direct Advice</h4>
                  <p className="text-[10.5px] uppercase italic text-white/50 leading-relaxed font-sans tracking-tight mb-4">
                    "{getCoachFeedback()}"
                  </p>
                  <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    Manish Bhagat • Head Strength Strategist
                  </p>
                </div>
              </div>

              {/* THREE BENTO METRIC CARDS */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                
                {/* 1. Completion Percentage Card */}
                <div className="glass-panel p-6 border-white/5 bg-black/20 rounded-3xl flex flex-col justify-between min-h-[160px] text-left relative overflow-hidden">
                  <Trophy className="w-6 h-6 text-neon-green" />
                  <div>
                    <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">Total Completed Progress</div>
                    <div className="text-4xl font-display font-black uppercase italic text-white mt-1.5 leading-none">
                      {completionPercentage}%
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-white/40 uppercase tracking-wider mt-2 border-t border-white/5 pt-2">
                    <span>{completedDays.length} OF 30 CELLS COMPLIED</span>
                    <span className="text-neon-green font-bold">ACTIVE REGISTRATION</span>
                  </div>
                </div>

                {/* 2. Heat Daily Streak Card */}
                <div className="glass-panel p-6 border-white/5 bg-black/20 rounded-3xl flex flex-col justify-between min-h-[160px] text-left relative overflow-hidden">
                  <Flame className={`w-6 h-6 ${currentStreak > 0 ? "text-red-500 animate-pulse" : "text-white/20"}`} />
                  <div>
                    <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">Consecutive Training Streak</div>
                    <div className="text-4xl font-display font-black uppercase italic text-white mt-1.5 leading-none flex items-center gap-2">
                      {currentStreak} <span className="text-xs uppercase font-mono tracking-widest text-white/40">Days</span>
                    </div>
                  </div>
                  <div className="text-[7.5px] font-mono text-white/35 uppercase tracking-wider leading-none mt-2 border-t border-white/5 pt-2">
                    {currentStreak > 0 
                      ? "STREAK ENGAGED. DO NOT MISS TOMORROW!" 
                      : "STREAK COLD. INITIATE LIFT SEQUENCE."}
                  </div>
                </div>

                {/* 3. Total Exercises count */}
                <div className="glass-panel p-6 border-white/5 bg-black/20 rounded-3xl flex flex-col justify-between min-h-[160px] text-left relative overflow-hidden">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">Total Reps Smashed</div>
                    <div className="text-4xl font-display font-black uppercase italic text-white mt-1.5 leading-none">
                      {totalExercisesCompleted}
                    </div>
                  </div>
                  <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-2 border-t border-white/5 pt-2">
                    ESTIMATED KINETIC REPS STABILIZED
                  </div>
                </div>

                {/* 4. Large 30-Day Grid rendering below metrics */}
                <div className="sm:col-span-3 glass-panel p-6 sm:p-8 border-white/5 bg-black/10 rounded-[32px] text-left w-full">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/30" />
                      <span className="text-[8px] font-mono font-black text-white/45 uppercase tracking-widest">KINETIC CALENDAR INTERACTION</span>
                    </div>
                    {completedDays.length > 0 && (
                      <button 
                        onClick={() => {
                          if (window.confirm("This will clear your local/database logging and reset your program progression back to Day 1. Confirm reset?")) {
                            // Reset local logs or alert
                            // In real database we let them overwrite logs or just alert
                            window.location.reload();
                          }
                        }}
                        className="text-[7.5px] font-mono font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors"
                      >
                        Reset Progression Engine Caches
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-3 w-full">
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const isCompleted = completedDays.includes(dayNum);
                      const isCurrent = dayNum === selectedDay;
                      const isLocked = dayNum > maxCompletedDay + 2; // soft locking to let them jump up to 2 days ahead!

                      return (
                        <button
                          key={dayNum}
                          onClick={() => {
                            setSelectedDay(dayNum);
                          }}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all relative overflow-hidden group ${
                            isCompleted 
                              ? "bg-neon-green/10 border-neon-green/40 text-neon-green hover:bg-neon-green/20" 
                              : isCurrent 
                                ? "bg-white text-black border-white shadow-lg scale-102 font-bold" 
                                : isLocked 
                                  ? "bg-black/40 border-white/[0.03] text-white/10 opacity-40 cursor-not-allowed hover:bg-white/[0.01]"
                                  : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.05] text-white/60 hover:text-white"
                          }`}
                        >
                          <span className={`text-[7px] font-mono font-black block leading-none mb-0.5 ${isCurrent ? 'text-black/40' : 'text-white/20'}`}>
                            DAY
                          </span>
                          <span className="text-base sm:text-lg font-display font-black leading-none italic">
                            {dayNum.toString().padStart(2, "0")}
                          </span>

                          {/* Completion Badge */}
                          {isCompleted && (
                            <div className="absolute top-1 right-1">
                              <Check className="w-2.5 h-2.5 text-neon-green stroke-[4]" />
                            </div>
                          )}

                          {/* Active recommendation aura */}
                          {!isCompleted && dayNum === recommendedNextDay && (
                            <div className="absolute inset-0 border border-neon-green rounded-2xl animate-pulse opacity-40 pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* SELECTED DAY TIMELINE CARD & CORE EXERCISE SPECIFICATIONS PREVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12 bg-white/[0.01] border border-white/5 p-6 sm:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-neon-green/3 blur-3xl rounded-full pointer-events-none" />

              {/* Day details stats summary */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6 text-left border-r border-white/5 pr-0 lg:pr-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sliders className="w-4 h-4 text-neon-green" />
                    <span className="text-[8px] font-mono text-neon-green font-bold uppercase tracking-widest">SEGMENT PREPARATION REPORT</span>
                  </div>
                  <h2 className="text-4xl font-display font-black uppercase tracking-tight italic leading-tight text-white">
                    Day {selectedDay.toString().padStart(2, "0")} <span className="text-neon-green">Protocol</span>
                  </h2>
                  <p className="text-xs text-white/40 uppercase tracking-wider mt-2">
                    Evaluating dynamic motor movements for {level} level stamina profiles.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-left">
                      <span className="text-[7.5px] font-mono font-bold text-white/20 uppercase tracking-widest">Time Budget</span>
                      <p className="text-2xl font-display font-black italic mt-1 text-white">{estimatedWorkoutMinutes} Mins</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-left">
                      <span className="text-[7.5px] font-mono font-bold text-white/20 uppercase tracking-widest">Energy Combust</span>
                      <p className="text-2xl font-display font-black italic mt-1 text-red-500">~{estimatedCaloriesBurn} Kcal</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3.5 bg-black/35 p-5 border border-white/5 rounded-2xl">
                    <h4 className="text-[8.5px] font-mono font-black text-neon-green uppercase tracking-widest">Biomechanics Metrics Summary:</h4>
                    <div className="flex justify-between items-center text-[10px] uppercase text-white/60">
                      <span>Prescribed load count:</span>
                      <span className="font-bold text-white">{dayExercises.length} Movements</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase text-white/60">
                      <span>Rest recovery gap:</span>
                      <span className="font-bold text-white">
                        {level === "Beginner" ? "30 seconds" : level === "Intermediate" ? "20 seconds" : "15 seconds"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase text-white/60">
                      <span>Progression Overload:</span>
                      <span className="font-bold text-white">Dynamic Week Increment Enabled</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => startWorkoutPlayer(selectedDay)}
                  className="w-full py-5 px-8 bg-neon-green hover:bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-[1.01] active:scale-[0.98] mt-6 shadow-[0_10px_30px_rgba(57,255,20,0.1)] hover:shadow-glow hover:text-black italic"
                >
                  ⚡ Launch Workout Player
                </button>
              </div>

              {/* Day exercise timeline checklist */}
              <div className="lg:col-span-7 flex flex-col justify-between w-full lg:pl-4 mt-6 lg:mt-0 text-left">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-6 italic border-b border-white/5 pb-3">
                    Movement Prescription Flow ({dayExercises.length} Exercises)
                  </h3>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {dayExercises.map((ex, step) => (
                      <div 
                        key={ex.id} 
                        className="flex justify-between items-center bg-white/[0.02] border border-white/5 hover:border-white/10 p-3 sm:p-4 rounded-2xl transition-all group hover:bg-white/[0.03]"
                      >
                        <div className="flex gap-4 items-center">
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-white/40 group-hover:text-neon-green group-hover:border-neon-green/35 transition-colors">
                            {(step + 1).toString().padStart(2, "0")}
                          </span>
                          <img 
                            src={ex.image} 
                            className="w-12 h-12 object-cover rounded-xl grayscale opacity-45 border border-white/10 group-hover:opacity-85 transition-all" 
                            alt={ex.title} 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight text-white/90 group-hover:text-neon-green transition-colors">
                              {ex.title}
                            </p>
                            <span className="text-[7.5px] font-mono text-white/20 uppercase tracking-widest mt-0.5 block">
                              Target zones: {ex.muscles.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">
                            {ex.sets} Sets x {ex.reps}
                          </span>
                          <p className="text-[7.5px] font-mono text-neon-green font-semibold uppercase tracking-widest mt-0.5">
                            REST: {ex.rest}s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-[9px] tracking-wider text-white/20 uppercase font-mono mt-4">
                  💡 Tip: Click any movement in the player page during workouts to view step-by-step coach guidelines.
                </div>
              </div>

            </div>

            {/* 4. WORKOUT COMPLETED HISTORY LOGS */}
            {completedProgramWorkouts.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 border-white/5 bg-black/2).toString() rounded-[32px] text-left">
                <h3 className="text-lg font-display font-black uppercase tracking-tight italic mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-neon-green" /> Historic Logging Database
                </h3>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-[10px] uppercase font-mono tracking-wider border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-white/30 text-[8px] tracking-[0.2em] font-black">
                        <th className="pb-3 pr-4">Workout Program Day</th>
                        <th className="pb-3 pr-4">Completed Timestamp</th>
                        <th className="pb-3 pr-4">Duration Finished</th>
                        <th className="pb-3">Estimated Combusted Energy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {completedProgramWorkouts.map((log) => (
                        <tr key={log.id} className="text-white/70 hover:text-white transition-colors">
                          <td className="py-3.5 pr-4 font-bold text-white">{log.workoutName}</td>
                          <td className="py-3.5 pr-4 text-white/55">
                            {new Date(log.timestamp).toLocaleDateString(undefined, { 
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
                            })}
                          </td>
                          <td className="py-3.5 pr-4 text-neon-green font-semibold italic">{log.duration} Minutes</td>
                          <td className="py-3.5 text-red-400 font-semibold italic">~{log.caloriesBurned} Kcal</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="py-20 text-center bg-white/[0.01] border border-white/5 rounded-[40px] p-8 max-w-2xl mx-auto">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-6" />
            <h3 className="text-xl font-display font-black uppercase tracking-tight italic mb-2">Exclusive Routines</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">Custom sports weight training protocols are being curated by Manish Bhagat. Select the 30-Day program to start weight-free training today.</p>
          </div>
        )}

      </div>
    </div>
  );
}
