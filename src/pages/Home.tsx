import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "motion/react";
import { Activity, Zap, TrendingUp, Users, Target, ChevronRight, Play, ArrowRight, ShieldCheck, Dumbbell, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const stats = [
  { label: "Elite Members", value: "12k+", icon: Users },
  { label: "Neural Protocols", value: "500+", icon: Target },
  { label: "Pro Trainers", value: "30+", icon: Activity },
  { label: "V-Max Success", value: "99.2%", icon: TrendingUp },
];

const programs = [
  { 
    title: "Force Architecture", 
    desc: "Elite hypertrophy and structural strength engineering.", 
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070&auto=format&fit=crop",
    category: "STRENGTH"
  },
  { 
    title: "Metabolic Shred", 
    desc: "High-intensity oxidative conditioning sequences.", 
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop",
    category: "CARDIO"
  },
  { 
    title: "Neural Recovery", 
    desc: "Bio-mechanical restoration and cognitive flow.", 
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop",
    category: "MOBILITY"
  },
];

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export default function Home() {
  const { t } = useLanguage();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="overflow-hidden bg-deep-black text-white font-sans selection:bg-neon-green selection:text-black">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-deep-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-transparent to-deep-black z-10" />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            alt="Elite Fitness Heritage" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Neural Particles Overlay */}
        <div className="absolute inset-0 os-grid opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 relative z-20 w-full text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-12"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-glow" />
              <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Neural Performance v4.0.2</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.82] tracking-tighter uppercase mb-12 italic"
            >
              <span className="block text-white/90">Evolve Your</span>
              <span className="premium-gradient-text block">Physicality</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-semibold italic tracking-tight"
            >
              The definitive high-performance ecosystem for the modern athlete. <br className="hidden md:block" /> 
              Pro human form meets neural biometric intelligence.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <Link to="/exercises" className="btn-premium px-16 py-7 text-xs group shadow-glow hover:shadow-[0_0_40px_rgba(57,255,20,0.4)] transition-all">
                START YOUR PROTOCOL <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/dashboard" className="btn-outline px-16 py-7 text-xs border-white/10 hover:bg-white/5 transition-all">
                VIEW ANALYTICS
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.4em] font-mono">Downlink</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent animate-bounce-slow" />
        </motion.div>
      </section>

      {/* Biometric Stats Bar */}
      <section className="relative z-10 border-y border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center lg:items-start"
              >
                <div className="text-4xl md:text-6xl font-black italic mb-2 tracking-tighter">
                  {stat.value}
                </div>
                <div className="flex items-center gap-3 text-neon-green/40">
                  <stat.icon className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] font-mono">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase: AI Integration */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/5 blur-[180px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-[1.5px] bg-neon-green" />
                <span className="text-neon-green font-black text-[10px] uppercase tracking-[0.6em] font-mono">NEURAL INTERFACE</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-display font-black leading-[0.85] uppercase tracking-tighter mb-10 italic">
                Visionary<br /><span className="premium-gradient-text">Intelligence</span>
              </h2>
              <p className="text-white/40 text-xl font-semibold uppercase italic tracking-tight leading-relaxed mb-12">
                Our proprietary AI engine analyzes your biometric data and form markers to architect a protocol that evolves as fast as you do.
              </p>
              
              <div className="space-y-6 mb-16">
                {[
                  "Real-time kinetic form analysis",
                  "Biological metabolic tracking",
                  "Predictive performance modeling"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="w-6 h-6 rounded-full border border-neon-green/20 flex items-center justify-center group-hover:bg-neon-green transition-all">
                       <CheckCircle2 className="w-3 h-3 text-neon-green group-hover:text-black" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/ai-assistant" className="btn-premium px-12 py-6 text-xs group inline-flex">
                SYNC NEURAL LINK <Sparkles className="w-5 h-5 ml-4 group-hover:rotate-12 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="lg:w-1/2 relative"
            >
              <div className="glass-panel p-4 border-white/5 bg-white/[0.01] rounded-[48px] shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=2070&auto=format&fit=crop" 
                  alt="High Performance" 
                  className="w-full h-full object-cover rounded-[40px] grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* UI Overlays for Depth */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 glass-panel p-8 border-neon-green/20 z-20 backdrop-blur-3xl"
              >
                <div className="text-neon-green font-black text-4xl italic mb-1">98.4%</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Force Accuracy</div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 glass-panel p-8 border-blue-500/20 z-20 backdrop-blur-3xl"
              >
                <Activity className="text-blue-500 w-8 h-8 mb-4 animate-pulse" />
                <div className="text-white font-black text-lg italic uppercase">Vitalized Sync</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Protocol Online</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biometric Optimization Engines */}
      <section className="py-48 relative border-t border-white/5 bg-gradient-to-b from-deep-black via-black/30 to-deep-black overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <header className="flex flex-col md:flex-row justify-between items-end gap-16 mb-24">
            <div className="max-w-3xl">
              <span className="text-neon-green font-black text-[10px] uppercase tracking-[0.5em] mb-8 block bg-neon-green/5 w-fit px-5 py-2 rounded-full border border-neon-green/20">INTELLIGENT DIAGNOSTICS</span>
              <h2 className="text-6xl md:text-8xl font-display font-black leading-[0.85] uppercase tracking-tighter italic">
                {t("Bmi.Title").split(" ")[0]}<br /><span className="premium-gradient-text">{t("Bmi.Title").split(" ").slice(1).join(" ") || "Calculators"}</span>
              </h2>
            </div>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em] max-w-sm mb-4 leading-relaxed font-mono">
              {t("Home.Subtitle")}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* BMI Calculator Portal Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="group glass-panel p-16 border-white/5 hover:border-neon-green/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(57,255,20,0.05)] rounded-[48px] relative overflow-hidden flex flex-col justify-between h-[450px]"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-green/5 blur-3xl rounded-full group-hover:bg-neon-green/10 transition-colors pointer-events-none" />
              <div>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8 group-hover:border-neon-green/20 transition-colors">
                  <Activity className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-3xl font-display font-black uppercase tracking-tight italic mb-4">{t("Home.BmiEngine")}</h3>
                <p className="text-white/45 text-sm font-semibold tracking-tight uppercase leading-relaxed italic">
                  {t("Home.BmiDesc")}
                </p>
              </div>
              <div className="mt-8">
                <Link to="/bmi-calculator" className="btn-premium px-10 py-5 w-full text-center text-[10px] tracking-[0.25em] font-black uppercase rounded-2xl flex items-center justify-center gap-4 group/btn">
                  {t("Home.LaunchBmi")} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Calorie Calculator Portal Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group glass-panel p-16 border-white/5 hover:border-blue-500/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.05)] rounded-[48px] relative overflow-hidden flex flex-col justify-between h-[450px]"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
              <div>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8 group-hover:border-blue-500/20 transition-colors">
                  <span className="text-3xl font-black text-blue-400">🔥</span>
                </div>
                <h3 className="text-3xl font-display font-black uppercase tracking-tight italic mb-4">{t("Home.CalEngine")}</h3>
                <p className="text-white/45 text-sm font-semibold tracking-tight uppercase leading-relaxed italic">
                  {t("Home.CalDesc")}
                </p>
              </div>
              <div className="mt-8">
                <Link to="/calorie-calculator" className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/20 text-white w-full py-5 text-center text-[10px] tracking-[0.25em] font-black uppercase rounded-2xl flex items-center justify-center gap-4 group/btn transition-all">
                  {t("Home.LaunchCal")} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Matrix */}
      <section className="py-48 bg-deep-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <header className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
            <div className="max-w-3xl">
              <span className="text-neon-green font-black text-[10px] uppercase tracking-[0.5em] mb-8 block bg-neon-green/5 w-fit px-5 py-2 rounded-full border border-neon-green/20">THE PROTOCOLS</span>
              <h2 className="text-7xl md:text-9xl font-display font-black leading-[0.85] uppercase tracking-tighter italic">
                Kinetic<br /><span className="stroke-text">Architecture</span>
              </h2>
            </div>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em] max-w-sm mb-4 leading-relaxed font-mono">
              Engineered sequences for anatomical optimization and force generation.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-20">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 1 }}
                className="group relative h-[700px] rounded-[56px] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-neon-green/20 transition-all duration-700"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/20 to-transparent" />
                </div>

                <div className="absolute top-12 left-12 z-20">
                   <div className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase font-mono">{program.category}</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
                  <h3 className="text-5xl font-display font-black mb-6 uppercase tracking-tighter italic group-hover:text-neon-green transition-colors">{program.title}</h3>
                  <p className="text-white/40 text-sm mb-12 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0 leading-relaxed font-semibold uppercase tracking-tight italic">
                    {program.desc}
                  </p>
                  <Link to="/exercises" className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-xl group-hover:bg-neon-green group-hover:text-black group-hover:shadow-glow transition-all duration-500">
                    ACCESS MODULE
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Community / Social Proof */}
      <section className="py-48 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block mb-16">
             <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-deep-black overflow-hidden bg-white/5 transition-transform hover:scale-110 hover:z-20 cursor-pointer">
                     <img src={`https://i.pravatar.cc/150?u=fitness${i}`} className="w-full h-full object-cover grayscale block" />
                  </div>
                ))}
             </div>
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-black leading-none uppercase tracking-tighter mb-12 italic">
            Joined by <span className="premium-gradient-text">100,000+</span> Athletes
          </h2>
          <p className="text-white/20 text-xs font-black uppercase tracking-[0.6em] mb-20 italic">Global High-Performance Network</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
             {[
               { quote: "The neural form alignment changed my squat architecture entirely.", author: "Marcus R." },
               { quote: "Cleanest fitness UI I've ever experienced. Pure performance.", author: "Sarah J." },
               { quote: "Finally, a platform that respects natural bodybuilding limits.", author: "David K." }
             ].map((t, idx) => (
               <div key={idx} className="glass-panel p-10 border-white/5 bg-white/[0.01] text-left">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/40 leading-relaxed italic mb-8">"{t.quote}"</p>
                  <div className="text-[9px] font-black text-neon-green uppercase tracking-[0.4em] font-mono">— {t.author}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium CTA: The Final Ascent */}
      <section className="py-60 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-neon-green/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="glass-panel p-20 md:p-32 border-neon-green/20 relative overflow-hidden group rounded-[64px]">
             <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-blue-500/10 opacity-30 group-hover:opacity-50 transition-opacity" />
             
             <div className="relative z-10 flex flex-col items-center text-center">
                <ShieldCheck className="w-20 h-20 text-neon-green mb-12 animate-glow" />
                <h2 className="text-6xl md:text-9xl font-display font-black leading-[0.85] uppercase tracking-tighter mb-16 italic">
                  Ascend to <br /><span className="premium-gradient-text">Elite Tier</span>
                </h2>
                <p className="text-white/40 text-xl font-semibold uppercase italic tracking-tight mb-20 max-w-2xl">
                  Unlock the full neural stack. Custom biological routing, 1-on-1 performance coaching, and zero-gravity training sequences.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 w-full max-w-lg">
                   <Link to="/subscription" className="btn-premium w-full py-8 group !rounded-3xl shadow-glow">
                      INITIALIZE ACCESS <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="py-40 bg-black/80 backdrop-blur-3xl relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-neon-green rounded-2xl flex items-center justify-center rotate-6 shadow-glow">
                  <Activity className="text-black w-8 h-8" />
                </div>
                <h3 className="text-4xl font-display font-black tracking-tighter italic">FITNESS MANTRA</h3>
              </div>
              <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-md italic mb-16">
                Evolving human capability through neural biometric intelligence and high-fidelity kinetic architecture.
              </p>
              
              <div className="flex gap-12">
                 {["Instagram", "X Protocol", "Neural Link"].map(social => (
                   <a key={social} href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-neon-green transition-all">{social}</a>
                 ))}
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="inline-block">
                <span className="text-[10px] tracking-[0.8em] font-black text-white/20 uppercase mb-8 block font-mono">Principal Systems Architect</span>
                <h3 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white/90 group cursor-default leading-none">
                  MANISH <span className="text-neon-green italic drop-shadow-glow transition-all duration-700 uppercase">BHAGAT</span>
                </h3>
                <p className="mt-12 text-[9px] font-mono text-white/10 uppercase tracking-[0.4em]">Proprietary Performance OS // v4.0.2 // © 2024</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



