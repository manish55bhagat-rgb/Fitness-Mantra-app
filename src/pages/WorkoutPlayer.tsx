import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Flame, Clock, ChevronLeft, Check, CheckCircle2, RotateCcw, 
  Video, Info, X, HelpCircle, Activity, Award, ShieldAlert,
  Compass, AlertTriangle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { generateWorkoutForDay, ProgramExercise } from "../data/homeWorkoutProgram";
import BodyMuscleHighlighter from "../components/ui/MuscleHighlighter";
import { voiceService } from "../services/voiceService";

interface EnhancedExercise extends ProgramExercise {
  sets: number;
  reps: string;
  holdDuration: number;
  rest: number;
  estimatedKcal: number;
}

export default function WorkoutPlayer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, addWorkoutRecord } = useAuth();

  // Parsing search queries
  const day = parseInt(searchParams.get("day") || "1");
  const levelParam = (searchParams.get("level") || "Beginner") as "Beginner" | "Intermediate" | "Advanced";

  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(levelParam);
  const [exercises, setExercises] = useState<EnhancedExercise[]>([]);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  
  // State machine: "get-ready" | "active" | "rest" | "completed"
  const [playerState, setPlayerState] = useState<"get-ready" | "active" | "rest" | "completed">("get-ready");
  
  // Active timing systems
  const [timeLeft, setTimeLeft] = useState(10); // Ready countdown starting value
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "mistakes" | "breathing">("form");
  
  // Workout analysis metrics
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load workout sequence
  useEffect(() => {
    const list = generateWorkoutForDay(day, level);
    setExercises(list);
    setCurrentExerciseIdx(0);
    setCurrentSet(1);
    setPlayerState("get-ready");
    setTimeLeft(10);
    setIsPaused(false);
    setCaloriesBurned(0);
    setTotalElapsedTime(0);
  }, [day, level]);

  const currentExercise: EnhancedExercise | undefined = exercises[currentExerciseIdx];

  // Global Elapsed Timer
  useEffect(() => {
    if (playerState !== "completed" && !isPaused) {
      elapsedTimerRef.current = setInterval(() => {
        setTotalElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [playerState, isPaused]);

  // Voice speech triggers
  const speakVoice = (text: string) => {
    if (!isMuted) {
      voiceService.speak(text).catch(err => console.warn("voice TTS service error:", err));
    }
  };

  // Announce the active exercise on load/transitions
  useEffect(() => {
    if (!currentExercise) return;
    
    if (playerState === "get-ready") {
      speakVoice(`Get ready, first exercise is ${currentExercise.title}. Ten seconds.`);
    } else if (playerState === "active") {
      speakVoice(`Set ${currentSet} of ${currentExercise.sets}. ${currentExercise.holdDuration > 0 ? `${currentExercise.holdDuration} seconds hold` : `${currentExercise.reps}`}. Go!`);
    } else if (playerState === "rest") {
      const nextExercise = currentExerciseIdx < exercises.length - 1 ? exercises[currentExerciseIdx + 1] : null;
      if (nextExercise) {
        speakVoice(`Set complete. Take a breath. Next exercise is ${nextExercise.title}.`);
      } else {
        speakVoice(`Set complete. Prepare for the final stretch.`);
      }
    }
  }, [playerState, currentExerciseIdx, currentSet, exercises]);

  // Main game-loop Countdown Timer
  useEffect(() => {
    if (isPaused || playerState === "completed" || exercises.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimerEnd();
          return 0;
        }
        
        // Sound prompt at low marks: 3, 2, 1
        if (prev <= 4 && prev > 1 && !isMuted) {
          playTickSound();
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isPaused, playerState, exercises, currentExerciseIdx, currentSet]);

  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high pitched tick
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // AudioContext blocks sometimes, ignore silently
    }
  };

  const playCompleteSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);
    } catch (e) {
      // Ignore audio failure
    }
  };

  // State Transitions
  const handleTimerEnd = () => {
    if (playerState === "get-ready") {
      // Transition from Get Ready into Main Exercise Exertion
      setPlayerState("active");
      // If it is a hold duration exercise (e.g. plank), use hold duration timer. Else, standard set timer (45 seconds)
      const isHold = currentExercise?.holdDuration && currentExercise.holdDuration > 0;
      setTimeLeft(isHold ? currentExercise.holdDuration : 45); 
    } 
    else if (playerState === "active") {
      // Set Completed, go to Rest Interval
      playCompleteSound();
      setCompletedSteps(prev => prev + 1);
      
      // Calculate burning calories based on exercise intensity
      if (currentExercise) {
        setCaloriesBurned(prev => prev + currentExercise.estimatedKcal);
      }

      // Check if all sets for this exercise are done
      if (currentExercise && currentSet < currentExercise.sets) {
        setPlayerState("rest");
        setTimeLeft(currentExercise.rest);
      } else {
        // Move to NEXT exercise or finalize workout
        if (currentExerciseIdx < exercises.length - 1) {
          setPlayerState("rest");
          setTimeLeft(exercises[currentExerciseIdx + 1].rest);
        } else {
          // Final Completion!
          handleWorkoutFinished();
        }
      }
    } 
    else if (playerState === "rest") {
      // Transition from Rest into Active exercise (either next set or next exercise)
      if (currentExercise && currentSet < currentExercise.sets) {
        // Next set
        setCurrentSet(prev => prev + 1);
        setPlayerState("active");
        const isHold = currentExercise.holdDuration > 0;
        setTimeLeft(isHold ? currentExercise.holdDuration : 45);
      } else {
        // Next exercise
        setCurrentExerciseIdx(prev => prev + 1);
        setCurrentSet(1);
        setPlayerState("active");
        const nextExercise = exercises[currentExerciseIdx + 1];
        const isHold = nextExercise?.holdDuration > 0;
        setTimeLeft(isHold ? nextExercise.holdDuration : 45);
      }
    }
  };

  // Move forward manually
  const triggerSkipNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (playerState === "get-ready") {
      setPlayerState("active");
      const isHold = currentExercise?.holdDuration > 0;
      setTimeLeft(isHold ? currentExercise.holdDuration : 45);
    } 
    else if (playerState === "active") {
      // Treat active as completed
      handleTimerEnd();
    } 
    else if (playerState === "rest") {
      // Skip rest straight into action
      setTimeLeft(0);
      handleTimerEnd();
    }
  };

  // Move back manually
  const triggerSkipPrevious = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (currentSet > 1) {
      // Go back one set
      setCurrentSet(prev => prev - 1);
      setPlayerState("active");
      const isHold = currentExercise?.holdDuration > 0;
      setTimeLeft(isHold ? currentExercise?.holdDuration : 45);
    } 
    else if (currentExerciseIdx > 0) {
      // Go back to previous exercise last set
      const prevIdx = currentExerciseIdx - 1;
      const prevExercise = exercises[prevIdx];
      setCurrentExerciseIdx(prevIdx);
      setCurrentSet(prevExercise.sets);
      setPlayerState("active");
      const isHold = prevExercise.holdDuration > 0;
      setTimeLeft(isHold ? prevExercise.holdDuration : 45);
    } else {
      // Back to ready state
      setPlayerState("get-ready");
      setTimeLeft(10);
    }
  };

  const handleWorkoutFinished = () => {
    setPlayerState("completed");
    playCompleteSound();
    speakVoice("Incredible work. Workout completed successfully. You are transforming each day.");
  };

  // Save progress dynamically to Firebase
  const saveCompletedWorkout = async () => {
    try {
      const minutesCompleted = Math.max(1, Math.round(totalElapsedTime / 60));
      const workoutTitle = `30-Day Home Program: Day ${day} (${level})`;
      
      // Let's use AuthContext.tsx helper to add a record under /users/{userId}/workouts
      // This helper uses handleFirestoreError inside and runs safely
      if (user) {
        await addWorkoutRecord(workoutTitle, minutesCompleted, caloriesBurned, true);
        console.log("[WorkoutPlayer] Successfully logged completed workout session in Firestore subcollection");
      } else {
        // Fallback for guests in localStorage
        const guestHistory = JSON.parse(localStorage.getItem("guest_workout_history") || "[]");
        guestHistory.push({
          workoutName: workoutTitle,
          duration: minutesCompleted,
          caloriesBurned: caloriesBurned,
          completed: true,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem("guest_workout_history", JSON.stringify(guestHistory));
      }
      
      // Navigate back to program grid
      navigate("/programs?tab=30-day&success=true&completedDay=" + day);
    } catch (err) {
      console.error("[WorkoutPlayer] Firebase Logging Error:", err);
      // Navigate anyway to not block user
      navigate("/programs?tab=30-day");
    }
  };

  if (exercises.length === 0 || !currentExercise) {
    return (
      <div className="h-screen flex items-center justify-center bg-deep-black text-white">
        <div className="text-center animate-pulse">
          <Activity className="w-16 h-16 text-neon-green mx-auto mb-6 spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">CALIBRATING NEURAL PERFORMANCE...</p>
        </div>
      </div>
    );
  }

  // Circular math for countdown indicator
  const getTimerProgress = () => {
    let max = 10;
    if (playerState === "active") {
      max = currentExercise.holdDuration > 0 ? currentExercise.holdDuration : 45;
    } else if (playerState === "rest") {
      max = currentExercise.rest;
    }
    return Math.min(100, Math.max(0, (timeLeft / max) * 100));
  };

  const formatTimerValue = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-deep-black text-white relative flex flex-col pt-16 pb-20 justify-between">
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER BAR */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 relative z-20 flex justify-between items-center bg-black/35 backdrop-blur-xl py-4 rounded-3xl border border-white/5">
        <Link to="/programs" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-white/40 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4 text-white/50" /> Exit Player
        </Link>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-display font-black uppercase tracking-tight italic">
            Day {day} <span className="text-neon-green">• {level} Level</span>
          </h2>
          <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest mt-0.5">
            30-Day No Equipment Program
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5 text-white/60 hover:text-white"
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-neon-green" />}
          </button>
        </div>
      </div>

      {/* CORE WORK AREA */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center items-center my-6 md:my-10 relative z-10">
        
        <AnimatePresence mode="wait">
          
          {/* STATE 1: GET READY SCREEN */}
          {playerState === "get-ready" && (
            <motion.div 
              key="ready-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-2xl text-center flex flex-col items-center my-auto bg-white/[0.01] border border-white/5 rounded-3xl p-10 sm:p-14 backdrop-blur-2xl"
            >
              <div className="w-12 h-[1px] bg-neon-green mb-6" />
              <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono italic mb-4">ENGINE GENERATOR STARTED</span>
              
              <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter leading-none mb-2 italic">
                Get Ready
              </h1>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-10 max-w-sm">
                Next up: <span className="text-neon-green font-bold">{currentExercise.title}</span>
              </p>

              {/* Large Timer Visual representation */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" className="stroke-white/5 fill-transparent stroke-[4]" />
                  <motion.circle 
                    cx="50%" 
                    cy="50%" 
                    r="42%" 
                    className="stroke-neon-green fill-transparent stroke-[6]"
                    strokeDasharray="264"
                    animate={{ strokeDashoffset: Math.round(264 - (timeLeft / 10) * 264) }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <div className="absolute text-5xl sm:text-6xl font-black font-mono tracking-tighter text-white">
                  {timeLeft}
                </div>
              </div>

              {/* Preview image or muscle indicator */}
              <div className="flex gap-4 items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 max-w-md w-full">
                <img 
                  src={currentExercise.image} 
                  className="w-16 h-16 object-cover rounded-xl grayscale opacity-50 border border-white/10 shrink-0" 
                  alt="Ready Preview"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <span className="text-[8px] font-mono text-neon-green font-bold uppercase tracking-widest">{currentExercise.category} SYSTEM</span>
                  <p className="text-sm font-black uppercase tracking-tight text-white/80">{currentExercise.title}</p>
                  <p className="text-[9px] text-white/30 uppercase mt-0.5">{currentExercise.sets} Sets x {currentExercise.reps}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={triggerSkipNext} 
                  className="px-8 py-3.5 bg-white text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-neon-green hover:text-black hover:shadow-glow transition-all"
                >
                  Skip Waiting
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 2: ACTIVE EXERCISE SCREEN */}
          {playerState === "active" && (
            <motion.div 
              key="active-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
            >
              {/* Left Column: Visual Action Card & Anatomical Highlighter */}
              <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                <div className="relative aspect-video sm:aspect-[4/3] lg:aspect-video rounded-[36px] overflow-hidden glass-panel p-2 border-white/5 w-full bg-black/60 shadow-2xl">
                  
                  {/* Human perform demonstration background */}
                  <img 
                    src={currentExercise.image} 
                    alt={currentExercise.title} 
                    className="w-full h-full object-cover grayscale opacity-25 rounded-[28px] transition-all duration-300 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Absolute controls & overlay info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  {/* Upper tags */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                    <span className="px-3 py-1 bg-black/55 backdrop-blur-md rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                      EXERCISE {currentExerciseIdx + 1}/{exercises.length}
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 backdrop-blur-md rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
                      SET {currentSet}/{currentExercise.sets}
                    </span>
                  </div>

                  {/* Exercise Title display inside frame */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                    <div className="max-w-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-[1.5px] bg-red-500" />
                        <span className="text-[8px] font-mono text-red-500 font-bold uppercase tracking-widest">ACTIVE ENGINE PROFILE</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-none uppercase tracking-tighter italic text-white">
                        {currentExercise.title}
                      </h1>
                    </div>
                    
                    {/* Real Video Modal Launcher button */}
                    {currentExercise.video && (
                      <button 
                        onClick={() => setShowVideoModal(true)}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-neon-green hover:border-neon-green hover:text-black group active:scale-95 transition-all text-white/80 shrink-0 shadow-lg backdrop-blur-md"
                        title="Watch Real Video Tutorial"
                      >
                        <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cybernetic Highlighting Anatomy diagram below video */}
                <BodyMuscleHighlighter activeMuscles={currentExercise.muscles} className="w-full" />
              </div>

              {/* Right Column: Performance Stats and Dynamic Timer Progress Wheel */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6 w-full">
                
                {/* Visual Timer Progress Wheel */}
                <div className="glass-panel p-8 border-white/5 bg-black/30 backdrop-blur-md rounded-[32px] flex flex-col items-center justify-center relative w-full overflow-hidden">
                  
                  {/* Technical visual elements */}
                  <div className="absolute top-4 left-6 right-6 flex justify-between items-center select-none opacity-20">
                    <span className="text-[6px] font-mono font-bold tracking-widest text-white uppercase">REPAIR_T_DELTA</span>
                    <span className="text-[6px] font-mono font-bold tracking-widest text-neon-green uppercase animate-pulse">SYSTEM RUNNING</span>
                  </div>

                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center z-10 mt-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="50%" cy="50%" r="41%" className="stroke-white/5 fill-transparent stroke-[4]" />
                      <motion.circle 
                        cx="50%" 
                        cy="50%" 
                        r="41%" 
                        className="stroke-neon-green fill-transparent stroke-[8] filter drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]"
                        strokeDasharray="264"
                        animate={{ strokeDashoffset: Math.round(264 - getTimerProgress() / 100 * 264) }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tighter text-white leading-none">
                        {formatTimerValue(timeLeft)}
                      </div>
                      <span className="text-[8px] font-mono text-white/30 font-bold uppercase tracking-widest mt-2">
                        {currentExercise.holdDuration > 0 ? "HOLD REMAINING" : "SET ACTIVE TIME"}
                      </span>
                    </div>
                  </div>

                  {/* Sets Progress indicators (Dotted timeline) */}
                  <div className="w-full mt-6 flex justify-between items-center bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl relative z-10">
                    <div className="text-left">
                      <span className="text-[7px] font-mono font-bold text-white/20 uppercase tracking-widest">Sets History</span>
                      <div className="flex gap-2 items-center mt-1">
                        {Array.from({ length: currentExercise.sets }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                              idx + 1 < currentSet 
                                ? "bg-neon-green text-black" 
                                : idx + 1 === currentSet 
                                  ? "bg-red-500 text-white animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]" 
                                  : "bg-white/5 border border-white/10"
                            }`}
                          >
                            {idx + 1 < currentSet && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[7px] font-mono font-bold text-white/20 uppercase tracking-widest">Prescribed Work</span>
                      <p className="text-sm font-black uppercase text-neon-green mt-0.5 italic">
                        {currentExercise.holdDuration > 0 ? "ISO HOLD" : `${currentExercise.reps} Reps`}
                      </p>
                    </div>
                  </div>

                  {/* Control triggers */}
                  <div className="flex gap-4 items-center justify-center mt-8 relative z-10 w-full px-2">
                    <button 
                      onClick={triggerSkipPrevious}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                      title="Previous Set / Exercise"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-2xl ${
                        isPaused 
                          ? 'bg-neon-green text-black hover:shadow-glow' 
                          : 'bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                      }`}
                    >
                      {isPaused ? <Play className="w-6 h-6 fill-black" /> : <Pause className="w-6 h-6 fill-black" />}
                    </button>

                    <button 
                      onClick={triggerSkipNext}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90"
                      title="Next / Set Met Successfully"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Coach Tips Expandable Technical specification tabs (Form, Mistakes, Breathing) */}
                <div className="glass-panel border-white/5 bg-black/20 backdrop-blur-md rounded-[32px] p-6 text-left flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-white/5 pb-3 italic flex items-center gap-2">
                      <Compass className="w-4 h-4 text-neon-green" /> Human Coach Form Directives
                    </h3>
                    
                    {/* Tabs row */}
                    <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5 mb-4">
                      {[
                        { id: "form", label: "Correct Form", icon: CheckCircle2 },
                        { id: "mistakes", label: "Mistakes", icon: ShieldAlert },
                        { id: "breathing", label: "Breathing", icon: Activity }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id as any)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-wider transition-all duration-300 ${
                            activeTab === t.id 
                              ? "bg-white text-black font-extrabold shadow-lg" 
                              : "text-white/40 hover:text-white"
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden sm:inline">{t.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Tab panels rendering with responsive layouts */}
                    <div className="space-y-3 min-h-[90px]">
                      {activeTab === "form" && currentExercise.tips.correctForm.map((tip, i) => (
                        <div key={i} className="flex gap-3 text-[10px] leading-relaxed uppercase text-white/70 italic font-medium">
                          <span className="text-neon-green font-bold text-xs">✓</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                      {activeTab === "mistakes" && currentExercise.tips.commonMistakes.map((tip, i) => (
                        <div key={i} className="flex gap-3 text-[10px] leading-relaxed uppercase text-red-400 italic font-medium">
                          <span className="text-red-500 font-bold text-xs">✗</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                      {activeTab === "breathing" && (
                        <div className="flex gap-3 text-[10px] leading-relaxed uppercase text-blue-300 italic font-medium">
                          <span className="text-blue-400 font-bold text-xs">●</span>
                          <span>{currentExercise.tips.breathingTips}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 items-center text-[8px] tracking-wider text-white/30 uppercase font-mono">
                    <Info className="w-4 h-4 text-white/20 shrink-0" />
                    <span>Safety: {currentExercise.tips.safetyNote}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* STATE 3: REST/COOLDOWN SCREEN BETWEEN SETS */}
          {playerState === "rest" && (
            <motion.div 
              key="rest-state"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl text-center flex flex-col items-center my-auto bg-black/45 border border-white/5 rounded-[40px] p-10 sm:p-14 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
            >
              {/* background atmospheric glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-neon-green/5 blur-3xl rounded-full pointer-events-none" />

              <span className="text-[9px] font-black tracking-[0.5em] text-neon-green uppercase font-mono italic mb-4">REST INTERVAL STATE</span>
              <h1 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tighter italic text-white mb-2 leading-none">
                Get Some Air
              </h1>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-10">
                Deep slow inhalations. Next set starting shortly.
              </p>

              {/* Countdown circle */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" className="stroke-white/5 fill-transparent stroke-[4]" />
                  <motion.circle 
                    cx="50%" 
                    cy="50%" 
                    r="42%" 
                    className="stroke-neon-green fill-transparent stroke-[6]"
                    strokeDasharray="264"
                    animate={{ strokeDashoffset: Math.round(264 - (timeLeft / currentExercise.rest) * 264) }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <div className="absolute text-5xl sm:text-6xl font-black font-mono tracking-tighter text-neon-green animate-pulse">
                  {formatTimerValue(timeLeft)}
                </div>
              </div>

              {/* Preview block of the very next sequence */}
              <div className="w-full max-w-xl glass-panel p-6 border-white/5 bg-white/[0.01] flex flex-col items-center">
                <span className="text-[7px] font-mono text-white/20 font-bold uppercase tracking-widest mb-4">UPCOMING SEGMENT</span>
                
                {/* Check if current exercise has more sets remaining, else show next exercise */}
                {currentSet < currentExercise.sets ? (
                  <div className="flex gap-4 items-center w-full max-w-md">
                    <img 
                      src={currentExercise.image} 
                      className="w-14 h-14 object-cover rounded-xl grayscale opacity-30 border border-white/10 shrink-0" 
                      alt="Next Set"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left flex-grow">
                      <span className="text-[7px] font-mono text-red-500 font-bold uppercase tracking-widest">NEXT SET TRANSITION</span>
                      <p className="text-sm font-black uppercase tracking-tight text-white/90">{currentExercise.title}</p>
                      <p className="text-[8px] text-[red]/60 font-bold uppercase tracking-wide mt-0.5">SET {currentSet + 1} OF {currentExercise.sets}</p>
                    </div>
                  </div>
                ) : (
                  currentExerciseIdx < exercises.length - 1 ? (
                    <div className="flex gap-4 items-center w-full max-w-md">
                      <img 
                        src={exercises[currentExerciseIdx + 1].image} 
                        className="w-14 h-14 object-cover rounded-xl grayscale opacity-30 border border-white/10 shrink-0" 
                        alt="Next Exercise"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left flex-grow">
                        <span className="text-[7px] font-mono text-neon-green font-bold uppercase tracking-widest">NEXT EXERCISE PROTOCOL</span>
                        <p className="text-sm font-black uppercase tracking-tight text-white/90">{exercises[currentExerciseIdx + 1].title}</p>
                        <p className="text-[8px] text-white/30 uppercase mt-0.5">{exercises[currentExerciseIdx + 1].sets} Sets x {exercises[currentExerciseIdx + 1].reps}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center font-black text-xs text-neon-green py-2 uppercase tracking-widest">
                      🏁 This is the final exercise. Push to complete the day!
                    </div>
                  )
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={triggerSkipNext} 
                  className="px-10 py-4 border border-white/20 hover:border-white font-black text-white hover:bg-white/[0.05] uppercase text-[9px] tracking-widest rounded-xl transition-all"
                >
                  Skip Cooldown
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 4: COMPLETED SUMMARY SCREEN */}
          {playerState === "completed" && (
            <motion.div 
              key="completed-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl text-center flex flex-col items-center my-auto bg-white/[0.01] border border-neon-green/20 rounded-[48px] p-12 sm:p-20 backdrop-blur-2xl shadow-[0_0_50px_rgba(57,255,20,0.02)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-neon-green/5 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

              {/* Big Award Trophy */}
              <div className="w-24 h-24 bg-neon-green text-black rounded-full flex items-center justify-center shadow-glow mb-10 scale-105">
                <Award className="w-12 h-12 stroke-[2.5]" />
              </div>

              <span className="text-[10px] font-black tracking-[0.55em] text-neon-green uppercase font-mono italic mb-4">COMPLIANCE COMPLETED</span>
              <h1 className="text-4xl sm:text-7xl font-display font-black leading-none uppercase tracking-tighter italic text-white mb-4">
                Day {day} Conquered!
              </h1>
              
              <p className="text-white/40 text-xs sm:text-sm uppercase tracking-wider mb-12 max-w-md leading-relaxed mx-auto">
                Biomechanics complied with absolute accuracy. Your body composition metrics are updating. No shortcuts taken.
              </p>

              {/* Athletic Stats panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mb-14">
                {[
                  { label: "Completed Sets", val: `${completedSteps} sets`, icon: CheckCircle2, color: "text-neon-green" },
                  { label: "Duration Completed", val: `${Math.round(totalElapsedTime / 60)} mins`, icon: Clock, color: "text-blue-500" },
                  { label: "Metabolic Calories", val: `${caloriesBurned} kcal`, icon: Flame, color: "text-red-500" }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center shadow-lg backdrop-blur-md">
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                    <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-lg font-black text-white uppercase mt-1 italic tracking-tight">{stat.val}</div>
                  </div>
                ))}
              </div>

              <button 
                onClick={saveCompletedWorkout}
                className="w-full max-w-md py-6 sm:py-7 bg-white hover:bg-neon-green hover:shadow-glow text-black rounded-[24px] font-black text-[11px] sm:text-[12px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                💾 Complete Day & Log Progress
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* FOOTER MINI STAT BAR (Fixed on Mobile-first layout) */}
      {playerState !== "completed" && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto z-20 relative select-none">
          <div className="bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-2xl py-3 px-6 flex justify-between items-center text-[8px] sm:text-[9px] font-mono tracking-widest text-white/35">
            <div className="flex gap-4">
              <span>ELAPSED: <span className="text-white font-bold">{Math.floor(totalElapsedTime / 60)}m {totalElapsedTime % 60}s</span></span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">ENERGY EST: <span className="text-white font-bold">{caloriesBurned} KCAL</span></span>
            </div>
            <div>
              <span>LEVEL: <span className="text-neon-green font-black">{level}</span></span>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIDEO POPUP MODAL (REAL VIDEO COMPLIANCE DRAWER) */}
      <AnimatePresence>
        {showVideoModal && currentExercise.video && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-deep-black border border-white/10 rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setIsPaused(false);
                  setShowVideoModal(false);
                }}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-colors border border-white/10 z-50 hover:border-red-500"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 pb-4">
                <span className="text-[8px] font-mono text-neon-green font-bold uppercase tracking-widest mb-1.5 block">KINETIC VIDEO COMPLIANCE</span>
                <h3 className="text-2xl font-display font-black uppercase tracking-tight italic">{currentExercise.title} Demo</h3>
              </div>

              {/* Video iFrame Container */}
              <div className="relative aspect-video bg-black border-y border-white/5 w-full">
                <iframe 
                  className="w-full h-full"
                  src={currentExercise.video} 
                  title={`${currentExercise.title} Live Tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                />
              </div>

              <div className="p-8 text-left bg-black/[0.05]">
                <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest mb-2">Description</p>
                <p className="text-xs uppercase italic text-white/50 leading-relaxed max-w-2xl font-sans tracking-tight">
                  {currentExercise.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
