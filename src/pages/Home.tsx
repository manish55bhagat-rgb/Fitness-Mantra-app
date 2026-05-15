import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, Variants } from "motion/react";
import { Activity, Zap, TrendingUp, Users, Target, ChevronRight, Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Model3D from "../components/ui/Model3D";

const stats = [
  { label: "Active Members", value: "10k+", icon: Users },
  { label: "Workout Programs", value: "150+", icon: Target },
  { label: "Expert Trainers", value: "25+", icon: Activity },
  { label: "Success Rate", value: "98%", icon: TrendingUp },
];

const programs = [
  { title: "Muscle Forge", desc: "Advanced hypertrophy training", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
  { title: "Lean Burn", desc: "Intense metabollic conditioning", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" },
  { title: "Zen Flow", desc: "Mind-body recovery & yoga", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" },
];

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax smooth values
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const rotateX = useTransform(smoothY, [-300, 300], [10, -10]);
  const rotateY = useTransform(smoothX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="overflow-hidden bg-deep-black" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      
      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Cinematic Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-110 animate-pulse-soft opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="cinematic-overlay z-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-transparent to-deep-black/40 z-10" />
        </div>

        {/* Ambient Lights */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-neon-green/10 blur-[150px] rounded-full mix-blend-screen animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full mix-blend-screen animate-float" style={{ animationDelay: '-3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 w-full mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/30 mb-10 shadow-[0_0_20px_rgba(57,255,20,0.1)]"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-glow" />
                <span className="text-[10px] font-black tracking-[0.4em] text-neon-green uppercase font-mono">Neural Interface v4.2</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-7xl md:text-[8rem] lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-10 italic"
              >
                <span className="block transform -skew-x-12">Transform</span>
                <span className="premium-gradient-text block mt-4">Your Body</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-white/50 text-base md:text-xl max-w-xl mb-14 leading-relaxed font-semibold uppercase tracking-tight"
              >
                AI-Powered Workouts, Precision Nutrition & Smart Kinetic Guidance. The future of elite human performance is here.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-8"
              >
                <Link to="/exercises" className="btn-premium px-14 py-7 text-sm group">
                  START TRAINING <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/diet" className="btn-outline px-14 py-7 text-sm">
                  GET DIET PLAN
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ rotateX, rotateY, perspective: 1500 }}
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 hidden lg:block relative h-[800px]"
            >
              <div className="absolute inset-0 bg-neon-green/5 blur-[120px] rounded-full animate-pulse-soft" />
              
              {/* 3D Trainer Model Container */}
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.01] rounded-full border border-white/5 animate-[rotate-360_20s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/[0.01] rounded-full border border-white/5 animate-[rotate-360_15s_linear_infinite_reverse]" />
                
                <Model3D />
                
                {/* Floating Bio-Data Tags */}
                <motion.div 
                  animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-20 -left-12 glass-panel p-6 neon-border backdrop-blur-3xl shadow-xl z-20 group-hover:border-neon-green/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-4 h-4 text-neon-green" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Metabolic Force</span>
                  </div>
                  <div className="text-3xl font-black text-white">2,840 <span className="text-xs text-white/30 font-mono italic">KCAL</span></div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-40 -right-8 glass-panel p-6 neon-border backdrop-blur-3xl shadow-xl z-20 group-hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Neural Sync</span>
                  </div>
                  <div className="text-3xl font-black text-white">98.2% <span className="text-xs text-white/30 font-mono italic">ACCURACY</span></div>
                </motion.div>

                {/* Trainer Highlight Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-20 w-32 h-8 bg-neon-green/20 blur-2xl rounded-full animate-pulse-soft" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Advanced Stats Section */}
      <section className="py-24 border-y border-white/5 relative z-10 bg-deep-black group">
        <div className="absolute inset-0 os-grid opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="relative group/stat"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden transition-all duration-700 group-hover/stat:border-neon-green/50 group-hover/stat:rotate-[10deg] shadow-lg">
                    <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <stat.icon className="w-8 h-8 text-white/40 group-hover/stat:text-neon-green group-hover/stat:-rotate-[10deg] transition-all duration-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-black tracking-tighter mb-2 group-hover/stat:text-neon-green transition-colors duration-500">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover/stat:text-white/40 transition-colors font-mono">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Evolution / Programs Section */}
      <section className="py-48 relative overflow-hidden bg-deep-black">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24"
          >
            <div className="max-w-3xl">
              <span className="text-neon-green font-black text-[12px] uppercase tracking-[0.5em] mb-8 block bg-neon-green/10 w-fit px-4 py-1.5 rounded-lg border border-neon-green/20">The Evolution Core</span>
              <h2 className="text-7xl md:text-9xl font-display font-black leading-[0.85] uppercase tracking-tighter">
                Accelerate Your<br />
                <span className="stroke-text font-black">Meta-Growth</span>
              </h2>
            </div>
            <Link to="/programs" className="group flex items-center gap-6 text-xs font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">
              Initialize Access Protocol
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-green transition-colors">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-neon-green transition-all" />
              </div>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 1 }}
                whileHover={{ y: -25 }}
                className="group relative h-[650px] rounded-[48px] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-all duration-700"
              >
                <div className="absolute inset-0">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-115 group-hover:rotate-2 opacity-30 group-hover:opacity-60 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent transition-all duration-700 group-hover:via-deep-black/30" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <div className="flex items-center gap-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-glow" />
                    <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.4em]">Optimized Module</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-display font-black mb-6 uppercase tracking-tighter italic">{program.title}</h3>
                  <p className="text-white/40 text-sm mb-12 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-6 group-hover:translate-y-0 leading-relaxed font-semibold uppercase tracking-tight">
                    {program.desc}
                  </p>
                  <button className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] backdrop-blur-xl group-hover:bg-neon-green group-hover:text-black group-hover:border-transparent group-hover:shadow-[0_20px_40px_rgba(57,255,20,0.3)] transition-all duration-500">
                    ACCESS INTERFACE
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-40 relative">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="glass-panel p-16 md:p-24 border-neon-green/20 relative overflow-hidden text-center group">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-green/10 blur-[100px] rounded-full animate-pulse-soft" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full animate-pulse-soft" style={{ animationDelay: '-2s' }} />
            
            <div className="relative z-10 flex flex-col items-center">
              <p className="text-neon-green font-black text-[12px] uppercase tracking-[0.6em] mb-12 font-mono drop-shadow-glow">Elite Tier Access</p>
              <h2 className="text-5xl md:text-8xl font-display font-black leading-[0.9] uppercase tracking-tighter mb-12">
                Join the <br /> <span className="premium-gradient-text italic">Performance Elite</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-8 w-full max-w-sm">
                <Link to="/subscription" className="btn-premium w-full py-7 group">
                  UPGRADE PROTOCOL <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/register" className="btn-outline w-full py-7">
                  FREE REGISTRATION
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architect Badge Footer */}
      <footer className="py-32 border-t border-white/5 relative bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto mb-16" />
            <p className="text-[10px] tracking-[0.8em] font-black text-white/20 uppercase mb-8 font-mono">Principal Systems Architect</p>
            <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white/90 group cursor-default">
              MANISH <span className="text-neon-green italic drop-shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-700 group-hover:drop-shadow-[0_0_30px_rgba(57,255,20,0.6)]">BHAGAT</span>
            </h3>
            <p className="mt-12 text-[9px] font-mono text-white/10 uppercase tracking-[0.3em]">Built for high-performance evolution // © 2024</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}


