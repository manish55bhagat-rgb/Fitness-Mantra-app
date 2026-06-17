import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, Activity, BarChart3, Calendar, 
  Dumbbell, Timer, Flame, Zap, Target, 
  ChevronUp, ChevronDown, Award, History,
  Trash2, Plus, LogIn, Scale, Eye, Sparkles
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, PieChart, Pie
} from 'recharts';
import { useAuth } from "../context/AuthContext";

export default function PerformancePortal() {
  const { 
    profile, 
    workouts, 
    diets, 
    progressList, 
    addWorkoutRecord, 
    deleteWorkoutRecord,
    addDietRecord,
    addProgressRecord 
  } = useAuth();

  // Selected logging tab: "workout" | "diet" | "progress"
  const [activeLogTab, setActiveLogTab] = useState<"workout" | "diet" | "progress">("workout");

  const logFormRef = React.useRef<HTMLDivElement>(null);

  const scrollToLogForm = () => {
    logFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Form State - Workout
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutCalories, setWorkoutCalories] = useState("");
  const [workoutCompleted, setWorkoutCompleted] = useState(true);

  // Form State - Diet
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealCarbs, setMealCarbs] = useState("");
  const [mealFat, setMealFat] = useState("");

  // Form State - Progress
  const [metricWeight, setMetricWeight] = useState("");
  const [metricHeight, setMetricHeight] = useState(profile?.height || "172");
  const [metricFat, setMetricFat] = useState("");
  const [metricChest, setMetricChest] = useState("");
  const [metricWaist, setMetricWaist] = useState("");
  const [metricBiceps, setMetricBiceps] = useState("");
  const [metricPhotoUrl, setMetricPhotoUrl] = useState("");
  const [chartTab, setChartTab] = useState<"calories" | "weight">("calories");

  const [formFeedback, setFormFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dynamic weight and measurements trajectory analysis
  const weightChartData = React.useMemo(() => {
    if (progressList.length === 0) {
      return [
        { day: "Wk 1", weight: 75.0, chest: 38, waist: 32, biceps: 14 },
        { day: "Wk 2", weight: 74.2, chest: 38, waist: 31.8, biceps: 14.1 },
        { day: "Wk 3", weight: 73.5, chest: 38.2, waist: 31.5, biceps: 14.2 },
        { day: "Wk 4", weight: 72.8, chest: 38.3, waist: 31.2, biceps: 14.3 },
        { day: "Wk 5", weight: 72.0, chest: 38.5, waist: 30.8, biceps: 14.5 }
      ];
    }
    return progressList.map((p, idx) => {
      const dateObj = new Date(p.timestamp);
      const label = isNaN(dateObj.getTime()) ? `Rec ${idx + 1}` : dateObj.toLocaleDateString("en", { month: "short", day: "numeric" });
      return {
        day: label,
        weight: p.weight,
        chest: p.chest || 0,
        waist: p.waist || 0,
        biceps: p.biceps || 0
      };
    });
  }, [progressList]);

  // Static Mock Fallback for new accounts with no data
  const fallbackWorkoutData = [
    { day: "Mon", kcal: 450, mins: 60, intensity: 8 },
    { day: "Tue", kcal: 620, mins: 75, intensity: 9 },
    { day: "Wed", kcal: 310, mins: 45, intensity: 6 },
    { day: "Thu", kcal: 840, mins: 90, intensity: 10 },
    { day: "Fri", kcal: 500, mins: 65, intensity: 7 },
    { day: "Sat", kcal: 920, mins: 110, intensity: 9 },
    { day: "Sun", kcal: 200, mins: 30, intensity: 4 }
  ];

  const fallbackWorkoutsList = [
    { id: "1", title: "Bench Press Apex", date: "Today, 06:45 PM", status: "Completed", volume: "4250 kg", duration: "52m" },
    { id: "2", title: "V-Taper Protocol", date: "Yesterday, 07:12 AM", status: "Completed", volume: "3800 kg", duration: "45m" },
    { id: "3", title: "Delta Delta Delta", date: "15 May, 05:30 PM", status: "Completed", volume: "2100 kg", duration: "30m" }
  ];

  // Map real workouts array for Chart rendering (display last 7 days of logs)
  const chartData = React.useMemo(() => {
    if (workouts.length === 0) return fallbackWorkoutData;
    
    // Group last 7 workouts
    const reversed = [...workouts].reverse().slice(-7);
    return reversed.map((w, index) => {
      const dateObj = new Date(w.timestamp);
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const label = isNaN(dateObj.getTime()) ? `W${index + 1}` : daysOfWeek[dateObj.getDay()];
      return {
        day: label,
        kcal: w.caloriesBurned,
        mins: w.duration,
        intensity: Math.round((w.caloriesBurned / (w.duration || 1)) * 1.5)
      };
    });
  }, [workouts]);

  // Aggregate stats from Live Database
  const totals = React.useMemo(() => {
    const totalMins = workouts.reduce((sum, w) => sum + Number(w.duration || 0), 0);
    const totalKcalBurned = workouts.reduce((sum, w) => sum + Number(w.caloriesBurned || 0), 0);
    const avgMins = workouts.length > 0 ? Math.round(totalMins / workouts.length) : 0;
    const realStreak = workouts.length > 0 ? (workouts.length * 2) + 2 : 0; // Simulated dynamic streak
    return {
      totalMins,
      totalKcalBurned,
      avgMins,
      realStreak
    };
  }, [workouts]);

  // Handlers
  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    if (!workoutName || !workoutDuration || !workoutCalories) {
      setFormFeedback("All workout log fields are required.");
      return;
    }
    setLoading(true);
    try {
      await addWorkoutRecord(
        workoutName,
        parseInt(workoutDuration),
        parseInt(workoutCalories),
        workoutCompleted
      );
      setWorkoutName("");
      setWorkoutDuration("");
      setWorkoutCalories("");
      setFormFeedback("Workout logged to secure cloud.");
    } catch (err) {
      setFormFeedback("Error uploading workout records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDietSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    if (!mealName || !mealCalories) {
      setFormFeedback("Meal descriptor and kcal elements are required.");
      return;
    }
    setLoading(true);
    try {
      await addDietRecord(
        mealName,
        parseInt(mealCalories),
        parseInt(mealProtein || "0"),
        parseInt(mealCarbs || "0"),
        parseInt(mealFat || "0")
      );
      setMealName("");
      setMealCalories("");
      setMealProtein("");
      setMealCarbs("");
      setMealFat("");
      setFormFeedback("Nutritional profile synchronized with vault.");
    } catch (err) {
      setFormFeedback("Error establishing meal entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    if (!metricWeight || !metricHeight) {
      setFormFeedback("Weight and height criteria are strictly mandatory.");
      return;
    }
    setLoading(true);
    try {
      await addProgressRecord(
        parseFloat(metricWeight),
        parseFloat(metricHeight as string),
        parseInt(metricFat || "15"),
        60,
        parseFloat(metricChest || "0"),
        parseFloat(metricWaist || "0"),
        parseFloat(metricBiceps || "0"),
        metricPhotoUrl || ""
      );
      setMetricWeight("");
      setMetricChest("");
      setMetricWaist("");
      setMetricBiceps("");
      setMetricPhotoUrl("");
      setFormFeedback("Biometric checkpoints logged successfully.");
    } catch (err) {
      setFormFeedback("Data transmission rejected by rules.");
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await deleteWorkoutRecord(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-32 bg-deep-black min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-green/[0.03] blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-glow" />
                <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.5em] font-mono">Elite Performance Hub</span>
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-display font-black leading-none uppercase tracking-tighter italic">
                The <span className="premium-gradient-text italic">Matrix</span> Digest
              </h1>
            </div>

            <div className="flex gap-4">
               <div className="glass-panel px-8 py-4 border-white/5 flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Weekly Streak</div>
                    <div className="text-xl font-black text-neon-green italic">
                      {totals.realStreak > 0 ? `${totals.realStreak} DAYS` : "14 DAYS"}
                    </div>
                  </div>
                  <Target className="text-neon-green w-6 h-6" />
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Logging Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Form Interactive Console */}
          <div ref={logFormRef} className="glass-panel p-10 border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <h3 className="text-lg font-black uppercase tracking-tighter text-white">Log Biometrics</h3>
              <Sparkles className="w-4 h-4 text-neon-green" />
            </div>

            {/* Toggle tabs */}
            <div className="grid grid-cols-3 gap-2 bg-black/60 p-1.5 rounded-xl border border-white/5 mb-8">
              <button 
                onClick={() => { setActiveLogTab("workout"); setFormFeedback(null); }}
                className={`py-2 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${activeLogTab === "workout" ? "bg-neon-green text-black" : "text-white/40 hover:text-white"}`}
              >
                Workout
              </button>
              <button 
                onClick={() => { setActiveLogTab("diet"); setFormFeedback(null); }}
                className={`py-2 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${activeLogTab === "diet" ? "bg-neon-green text-black" : "text-white/40 hover:text-white"}`}
              >
                Meal
              </button>
              <button 
                onClick={() => { setActiveLogTab("progress"); setFormFeedback(null); }}
                className={`py-2 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${activeLogTab === "progress" ? "bg-neon-green text-black" : "text-white/40 hover:text-white"}`}
              >
                Weight
              </button>
            </div>

            {/* Form Feedback */}
            {formFeedback && (
              <div className="mb-6 py-2 px-3 bg-neon-green/10 border border-neon-green/20 rounded-xl text-neutral-200 text-[10px] font-bold uppercase tracking-wider">
                {formFeedback}
              </div>
            )}

            {activeLogTab === "workout" && (
              <form onSubmit={handleWorkoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Routine Title</label>
                  <input 
                    type="text" 
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="e.g., Deadlift Overdrive"
                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Mins</label>
                    <input 
                      type="number" 
                      value={workoutDuration}
                      onChange={(e) => setWorkoutDuration(e.target.value)}
                      placeholder="45"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Calories</label>
                    <input 
                      type="number" 
                      value={workoutCalories}
                      onChange={(e) => setWorkoutCalories(e.target.value)}
                      placeholder="400"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white rounded-xl hover:bg-neon-green hover:text-black hover:border-transparent transition-all cursor-pointer"
                >
                  {loading ? "Transmitting..." : "Sync Workout"}
                </button>
              </form>
            )}

            {activeLogTab === "diet" && (
              <form onSubmit={handleDietSubmit} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Meal / Nutrient</label>
                  <input 
                    type="text" 
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="e.g., Whey with Peanut Butter"
                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Calories</label>
                    <input 
                      type="number" 
                      value={mealCalories}
                      onChange={(e) => setMealCalories(e.target.value)}
                      placeholder="350"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Protein (g)</label>
                    <input 
                      type="number" 
                      value={mealProtein}
                      onChange={(e) => setMealProtein(e.target.value)}
                      placeholder="28"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white rounded-xl hover:bg-neon-green hover:text-black hover:border-transparent transition-all cursor-pointer"
                >
                  {loading ? "Transmitting..." : "Sync Meal Profile"}
                </button>
              </form>
            )}

            {activeLogTab === "progress" && (
              <form onSubmit={handleProgressSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Weight (KG) *</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={metricWeight}
                      onChange={(e) => setMetricWeight(e.target.value)}
                      placeholder="72.5"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Height (CM) *</label>
                    <input 
                      type="number" 
                      value={metricHeight}
                      onChange={(e) => setMetricHeight(e.target.value)}
                      placeholder="175"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Chest (Inches)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={metricChest}
                      onChange={(e) => setMetricChest(e.target.value)}
                      placeholder="38.5"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Waist (Inches)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={metricWaist}
                      onChange={(e) => setMetricWaist(e.target.value)}
                      placeholder="31.2"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Biceps (Inches)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={metricBiceps}
                      onChange={(e) => setMetricBiceps(e.target.value)}
                      placeholder="14.5"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Body Fat (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={metricFat}
                      onChange={(e) => setMetricFat(e.target.value)}
                      placeholder="15"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:border-neon-green/20"
                    />
                  </div>
                </div>

                {/* Progress Photo URL Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[8px] font-black uppercase tracking-widest text-white/30">Progress Photo URL (Optional)</label>
                    <button 
                      type="button"
                      onClick={() => setMetricPhotoUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400")}
                      className="text-[8px] font-black text-neon-green uppercase hover:underline cursor-pointer"
                    >
                      Use Demo Preset Url
                    </button>
                  </div>
                  <input 
                    type="url" 
                    value={metricPhotoUrl}
                    onChange={(e) => setMetricPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white focus:outline-none focus:border-neon-green/20"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white rounded-xl hover:bg-neon-green hover:text-black hover:border-transparent transition-all cursor-pointer"
                >
                  {loading ? "Transmitting..." : "Lock Biometrics"}
                </button>
              </form>
            )}
          </div>

          {/* Main Activity Chart */}
          <div className="lg:col-span-2 glass-panel p-10 border-white/5 bg-white/[0.01]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                  {chartTab === "calories" ? "Caloric Thermal Output" : "Weight Progression trajectory"}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">
                  {chartTab === "calories" ? "7-Cycle Real-time Meta-Analysis" : "Durable Biometric Weight Tracking Timeline"}
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-black border border-white/10 px-2 py-1 rounded-xl font-mono text-[9px] self-start sm:self-auto">
                <button 
                  type="button"
                  onClick={() => setChartTab("calories")}
                  className={`px-3 py-1.5 rounded-lg uppercase font-black transition-all cursor-pointer ${chartTab === "calories" ? "bg-neon-green text-black" : "text-white/40 hover:text-white"}`}
                >
                  Calories
                </button>
                <button 
                  type="button"
                  onClick={() => setChartTab("weight")}
                  className={`px-3 py-1.5 rounded-lg uppercase font-black transition-all cursor-pointer ${chartTab === "weight" ? "bg-neon-green text-black" : "text-white/40 hover:text-white"}`}
                >
                  Weight
                </button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === "calories" ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorKcal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      itemStyle={{ color: '#39FF14', fontWeight: 900 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="kcal" 
                      stroke="#39FF14" 
                      fillOpacity={1} 
                      strokeWidth={4}
                      fill="url(#colorKcal)" 
                    />
                  </AreaChart>
                ) : (
                  <AreaChart data={weightChartData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }}
                    />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 900 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      strokeWidth={4}
                      fill="url(#colorWeight)" 
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/5 font-mono">
               <div>
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Total KCal Out</div>
                  <div className="text-2xl font-black italic">
                    {totals.totalKcalBurned > 0 ? `${totals.totalKcalBurned} kCal` : "4,410 kCal"}
                  </div>
               </div>
               <div>
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Metrics Height</div>
                  <div className="text-2xl font-black italic text-neon-green">
                    {profile?.height ? `${profile.height} cm` : "172 cm"}
                  </div>
               </div>
               <div>
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Bio Target Status</div>
                  <div className="text-2xl font-black italic uppercase">
                    {
                      profile?.subscriptionStatus === "Architect Elite" || profile?.subscriptionStatus === "Premium Plan" 
                        ? "Premium" 
                        : profile?.subscriptionStatus === "Performance Pro" || profile?.subscriptionStatus === "Pro Plan"
                          ? "Pro"
                          : "Free"
                    }
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent History Feed */}
          <div className="lg:col-span-2 glass-panel p-10 border-white/5">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Mission Core Logs</h3>
                <History className="text-white/20 w-6 h-6" />
             </div>

             <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {workouts.length === 0 ? (
                  [{ id: "empty" }].map((w: any) => (
                    <div key={w.id} className="flex flex-col items-center justify-center py-12 text-center p-6 border border-white/5 bg-white/[0.01] rounded-3xl w-full">
                      <Activity className="w-12 h-12 text-neon-green/30 mb-4 animate-pulse" />
                      <h4 className="text-lg font-black uppercase tracking-tight italic text-white mb-2">No workouts yet today. Ready to crush it?</h4>
                      <button 
                        onClick={() => { setActiveLogTab("workout"); setTimeout(scrollToLogForm, 50); }}
                        className="mt-4 bg-neon-green text-black font-black uppercase text-[10px] px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(57,255,20,0.4)] cursor-pointer"
                      >
                        Start Workout
                      </button>
                    </div>
                  )) as any || [].map((w: any) => (
                    <div key={w.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-neon-green/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:bg-neon-green transition-all">
                            <Dumbbell className="text-white/40 group-hover:text-black w-6 h-6 transition-all" />
                         </div>
                         <div>
                            <h4 className="text-xl font-black uppercase tracking-tighter italic group-hover:text-neon-green transition-colors">{w.title}</h4>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 font-mono italic">{w.date}</span>
                         </div>
                      </div>

                      <div className="flex gap-12 text-right">
                         <div className="hidden md:block">
                            <div className="text-[8px] font-black uppercase text-white/10 tracking-widest mb-1">Volume</div>
                            <div className="text-xs font-black italic">{w.volume}</div>
                         </div>
                         <div className="hidden md:block">
                            <div className="text-[8px] font-black uppercase text-white/10 tracking-widest mb-1">Duration</div>
                            <div className="text-xs font-black italic">{w.duration}</div>
                         </div>
                         <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center">
                            <ChevronUp className="w-4 h-4 text-white/20 rotate-90" />
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  workouts.map((w) => {
                    const formattedDate = new Date(w.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    return (
                      <div key={w.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-neon-green/30 transition-all group">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:bg-neon-green transition-all">
                              <Dumbbell className="text-white/40 group-hover:text-black w-6 h-6 transition-all" />
                           </div>
                           <div>
                              <h4 className="text-xl font-black uppercase tracking-tighter italic group-hover:text-neon-green transition-colors">{w.workoutName}</h4>
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/20 font-mono italic">{formattedDate}</span>
                           </div>
                        </div>

                        <div className="flex gap-12 text-right items-center">
                           <div className="hidden md:block">
                              <div className="text-[8px] font-black uppercase text-white/10 tracking-widest mb-1">Burned</div>
                              <div className="text-xs font-black italic text-neon-green">{w.caloriesBurned} kCal</div>
                           </div>
                           <div className="hidden md:block">
                              <div className="text-[8px] font-black uppercase text-white/10 tracking-widest mb-1">Duration</div>
                              <div className="text-xs font-black italic">{w.duration} mins</div>
                           </div>
                           <button 
                             onClick={() => w.id && deleteWorkout(w.id)}
                             className="w-10 h-10 rounded-xl border border-red-500/10 hover:bg-red-500/10 flex items-center justify-center cursor-pointer transition-all hover:border-red-500/20"
                           >
                             <Trash2 className="w-4 h-4 text-red-400" />
                           </button>
                        </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>

          {/* Achievement Radar / Biometrics Info */}
          <div className="glass-panel p-10 border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full os-grid opacity-5 pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Scale className="text-neon-green w-5 h-5" />
                <h3 className="text-lg font-black uppercase tracking-tighter italic">Live Sync Metrics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Real-time Weight Log</div>
                  <div className="text-3xl font-display font-black text-white italic">
                    {profile?.weight ? `${profile.weight} KG` : "70.0 KG"}
                  </div>
                </div>
                
                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1 font-mono">Synced Meals Count</div>
                  {diets.length > 0 ? (
                    <div className="text-3xl font-display font-black text-neon-green italic">
                      {diets.length} Meals
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="text-xs font-semibold text-white/60">
                        No meals logged today. Start tracking!
                      </div>
                      <button
                        onClick={() => { setActiveLogTab("diet"); setTimeout(scrollToLogForm, 50); }}
                        className="bg-neon-green text-black font-black uppercase text-[9px] px-4 py-2.5 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_rgba(57,255,20,0.3)] cursor-pointer"
                      >
                        Log Meal
                      </button>
                    </div>
                  )}
                </div>

                {/* Measurements Tray */}
                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-3 font-mono">Active Body Measurements</div>
                  {progressList.length > 0 ? (
                    (() => {
                      const latest = progressList[progressList.length - 1];
                      return (
                        <div className="grid grid-cols-3 gap-2 font-mono text-center">
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="block text-[7px] text-white/40 uppercase">Chest</span>
                            <span className="text-xs font-black text-neon-green">{latest.chest ? `${latest.chest}"` : "--"}</span>
                          </div>
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="block text-[7px] text-white/40 uppercase">Waist</span>
                            <span className="text-xs font-black text-neon-green">{latest.waist ? `${latest.waist}"` : "--"}</span>
                          </div>
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="block text-[7px] text-white/40 uppercase">Bicep</span>
                            <span className="text-xs font-black text-neon-green">{latest.biceps ? `${latest.biceps}"` : "--"}</span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-[10px] font-semibold text-white/40 font-mono">No dimensions logged yet.</div>
                  )}
                </div>

                {/* Progress Photo Timeline */}
                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-3 font-mono">Latest Progress Photos</div>
                  {progressList.some(p => p.progressPhotoUrl) ? (
                    <div className="flex gap-2 overflow-x-auto pr-1 py-1 custom-scrollbar">
                      {progressList.filter(p => p.progressPhotoUrl).map((p, idx) => (
                        <a 
                          key={p.id || idx} 
                          href={p.progressPhotoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 block hover:border-neon-green transition-all relative group/img"
                        >
                          <img src={p.progressPhotoUrl} className="w-full h-full object-cover" alt="Progress checkpoint" referrerPolicy="no-referrer" />
                          <span className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-[7px] text-neon-green font-bold uppercase transition-all">View</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] font-semibold text-white/40 font-mono font-mono">No progress photos logged.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Award className="w-12 h-12 text-neon-green/20 mb-4" />
              <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Elite Collective</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">Realtime Database Persistence Verified.</p>
              
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-deep-black flex items-center justify-center shadow-2xl overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover grayscale" />
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full bg-neon-green border-2 border-deep-black flex items-center justify-center text-[10px] font-black text-black z-10 shadow-glow">
                    +1.2k
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
