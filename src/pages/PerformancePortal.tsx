import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, Activity, BarChart3, Calendar, 
  Dumbbell, Timer, Flame, Zap, Target, 
  ChevronUp, ChevronDown, Award, History
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, PieChart, Pie
} from 'recharts';

const workoutData = [
  { day: 'Mon', kcal: 450, mins: 60, intensity: 8 },
  { day: 'Tue', kcal: 620, mins: 75, intensity: 9 },
  { day: 'Wed', kcal: 310, mins: 45, intensity: 6 },
  { day: 'Thu', kcal: 840, mins: 90, intensity: 10 },
  { day: 'Fri', kcal: 500, mins: 65, intensity: 7 },
  { day: 'Sat', kcal: 920, mins: 110, intensity: 9 },
  { day: 'Sun', kcal: 200, mins: 30, intensity: 4 },
];

const muscleActivation = [
  { name: 'Chest', value: 85 },
  { name: 'Back', value: 72 },
  { name: 'Legs', value: 94 },
  { name: 'Shoulders', value: 68 },
  { name: 'Arms', value: 60 },
];

const recentWorkouts = [
  { id: 1, title: "Bench Press Apex", date: "Today, 06:45 PM", status: "Completed", volume: "4250 kg", duration: "52m" },
  { id: 2, title: "V-Taper Protocol", date: "Yesterday, 07:12 AM", status: "Completed", volume: "3800 kg", duration: "45m" },
  { id: 3, title: "Delta Delta Delta", date: "15 May, 05:30 PM", status: "Completed", volume: "2100 kg", duration: "30m" },
];

export default function PerformancePortal() {
  return (
    <div className="py-32 bg-deep-black min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-24">
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
                    <div className="text-xl font-black text-neon-green italic">14 DAYS</div>
                  </div>
                  <Target className="text-neon-green w-6 h-6" />
               </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Activity Chart */}
          <div className="lg:col-span-2 glass-panel p-10 border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Caloric Thermal Output</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">7-Day Meta-Analysis</p>
              </div>
              <Activity className="text-neon-green w-6 h-6" />
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workoutData}>
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
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/5">
               <div>
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Total Volume</div>
                  <div className="text-2xl font-black italic">28,450 KG</div>
               </div>
               <div>
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Avg Intensity</div>
                  <div className="text-2xl font-black italic text-neon-green">8.4 / 10</div>
               </div>
               <div>
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Active Time</div>
                  <div className="text-2xl font-black italic">475 MINS</div>
               </div>
            </div>
          </div>

          {/* Muscle Distribution */}
          <div className="glass-panel p-10 border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Neural Load</h3>
                <Zap className="text-neon-green w-6 h-6" />
              </div>
              
              <div className="space-y-8">
                {muscleActivation.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/40">{m.name}</span>
                      <span className="text-neon-green">{m.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.value}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className="h-full bg-neon-green shadow-glow" 
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-12 border-t border-white/5">
               <button className="w-full btn-premium py-5 !rounded-2xl !bg-white/5 !text-white hover:!bg-neon-green hover:!text-black transition-all">
                  VIEW KINETIC MAP
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent History Feed */}
          <div className="lg:col-span-2 glass-panel p-10 border-white/5">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Mission History</h3>
                <History className="text-white/20 w-6 h-6" />
             </div>

             <div className="space-y-6">
                {recentWorkouts.map((w) => (
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
                ))}
             </div>
          </div>

          {/* Achievement Radar */}
          <div className="glass-panel p-10 border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full os-grid opacity-5 pointer-events-none" />
            
            <Award className="w-20 h-20 text-neon-green/20 mb-8" />
            <h3 className="text-4xl font-black uppercase tracking-tighter italic text-center mb-4">Elite<br/>Archived</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center mb-10">You've reached top 2% energy output this cycle</p>
            
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full bg-white/10 border-2 border-deep-black flex items-center justify-center shadow-2xl overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover grayscale" />
                 </div>
               ))}
               <div className="w-12 h-12 rounded-full bg-neon-green border-2 border-deep-black flex items-center justify-center text-[10px] font-black text-black z-10 shadow-glow">
                  +1.2k
               </div>
            </div>
            
            <div className="mt-12 text-[8px] font-black uppercase tracking-[0.2em] text-white/10 italic">Social Matrix Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}
