import React from "react";
import { motion } from "motion/react";
import { Target, Shield, HeartPulse } from "lucide-react";

interface MuscleHighlighterProps {
  activeMuscles: string[]; // e.g. ["Chest", "Arms", "Legs", "Shoulders", "Abs", "Back", "Cardio"]
  className?: string;
}

export default function MuscleHighlighter({ activeMuscles, className = "" }: MuscleHighlighterProps) {
  // Convert list of active muscles to lowercase for matching
  const muscles = activeMuscles.map(m => m.toLowerCase());
  
  const isHighlighted = (name: string) => {
    return muscles.some(m => m.includes(name.toLowerCase()) || name.toLowerCase().includes(m));
  };

  const hasChest = isHighlighted("chest") || isHighlighted("pectoral");
  const hasAbs = isHighlighted("abs") || isHighlighted("abdom") || isHighlighted("core") || isHighlighted("oblique");
  const hasLegs = isHighlighted("legs") || isHighlighted("quad") || isHighlighted("glute") || isHighlighted("hamstring") || isHighlighted("calf") || isHighlighted("calves");
  const hasShoulders = isHighlighted("shoulder") || isHighlighted("delt");
  const hasArms = isHighlighted("arms") || isHighlighted("tricep") || isHighlighted("bicep") || isHighlighted("forearm");
  const hasBack = isHighlighted("back") || isHighlighted("lat") || isHighlighted("spine") || isHighlighted("trapezius");
  const hasCardio = isHighlighted("cardio") || isHighlighted("full body");

  return (
    <div className={`glass-panel p-6 sm:p-8 border-white/5 bg-black/40 backdrop-blur-3xl rounded-[32px] flex flex-col justify-between items-center relative overflow-hidden ${className}`}>
      {/* Visual cybertech grid decoration */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:16px_16px] opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-neon-green/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Title Header */}
      <div className="w-full flex justify-between items-center mb-6 border-b border-white/5 pb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <Target className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-[9px] font-black tracking-[0.3em] uppercase font-mono text-white/55">Kinetic Activation</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${hasCardio ? 'bg-red-500 animate-ping' : 'bg-neon-green'}`} />
          <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">
            {hasCardio ? 'METABOLIC OVERDRIVE' : 'TARGET ENGINE'}
          </span>
        </div>
      </div>

      {/* Side-by-Side Anatomical Scan Vector */}
      <div className="flex gap-4 sm:gap-10 justify-center items-center w-full relative z-10 py-2 sm:py-4">
        
        {/* FRONT ANATOMY VIEW */}
        <div className="flex flex-col items-center">
          <span className="text-[7px] font-mono font-bold tracking-widest text-white/20 uppercase mb-2">FRONT PROFILE</span>
          <svg viewBox="0 0 100 220" className="w-24 h-52 sm:w-28 sm:h-60 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.02)]">
            {/* Outline Figure Body base */}
            <path 
              d="M50,15 C54,15 57,18 57,24 C57,28 54,32 50,32 C46,32 43,28 43,24 C43,18 46,15 50,15 Z M50,32 C48,32 46,35 44,40 C42,45 38,50 33,53 C29,55 27,58 27,62 L24,105 C24,108 26,110 29,110 C32,110 33,107 33,105 L35,70 L38,70 L35,115 C34,120 33,128 33,135 L33,205 C33,208 35,210 38,210 C41,210 43,208 43,205 L44,145 C44,142 46,140 50,140 C54,140 56,142 56,145 L57,205 C57,208 59,210 62,210 C65,210 67,208 67,205 L67,135 C67,128 66,120 65,115 L62,70 L65,70 L67,105 C67,107 68,110 71,110 C74,110 76,108 76,105 L73,62 C73,58 71,55 67,53 C62,50 58,45 56,40 C54,35 52,32 50,32 Z" 
              fill="#121214" 
              stroke="#2e2e34" 
              strokeWidth="1.5" 
            />

            {/* SHOULDERS (DELTOIDS) FRONT */}
            <path 
              d="M33,52 C35,51 38,47 43,44 L41,40 C37,44 34,48 31,51 Z M67,52 C65,51 62,47 57,44 L59,40 C63,44 66,48 69,51 Z" 
              fill={hasShoulders ? "#ef4444" : "transparent"} 
              className={hasShoulders ? "animate-pulse" : ""}
              opacity={hasShoulders ? "0.9" : "0"}
              style={{ filter: hasShoulders ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 'none' }}
              stroke={hasShoulders ? "#ff3131" : "transparent"}
              strokeWidth="1.5"
            />

            {/* CHEST (PECTORALS) */}
            <path 
              d="M37,56 C41,53 45,52 50,52 C55,52 59,53 63,56 C61,64 56,66 50,66 C44,66 39,64 37,56 Z" 
              fill={hasChest ? "#ef4444" : "#1a1a1e"} 
              className={hasChest ? "animate-pulse" : ""}
              opacity={hasChest ? "0.9" : "0.3"}
              style={{ filter: hasChest ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))' : 'none' }}
              stroke={hasChest ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* CORE / ABS */}
            <rect 
              x="42" 
              y="69" 
              width="16" 
              height="35" 
              rx="4" 
              fill={hasAbs ? "#ef4444" : "#1a1a1e"} 
              className={hasAbs ? "animate-pulse" : ""}
              opacity={hasAbs ? "0.9" : "0.3"}
              style={{ filter: hasAbs ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))' : 'none' }}
              stroke={hasAbs ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* ABS INTERIOR DETAIL */}
            {hasAbs && (
              <g stroke="#ff6b6b" strokeWidth="0.8" opacity="0.8">
                <line x1="45" y1="76" x2="55" y2="76" />
                <line x1="45" y1="83" x2="55" y2="83" />
                <line x1="45" y1="90" x2="55" y2="90" />
                <line x1="45" y1="97" x2="55" y2="97" />
              </g>
            )}

            {/* FRONT ARMS (BICEPS / FOREARMS) */}
            <path 
              d="M26,60 L24,98 C24,101 25,102 26,102 C27,102 28,101 29,98 L31,68 Z M74,60 L76,98 C76,101 75,102 74,102 C73,102 72,101 71,98 L69,68 Z" 
              fill={hasArms ? "#ef4444" : "#1a1a1e"} 
              className={hasArms ? "animate-pulse" : ""}
              opacity={hasArms ? "0.9" : "0.2"}
              style={{ filter: hasArms ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 'none' }}
              stroke={hasArms ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* FRONT LEGS (QUADRICEPS / SHINS) */}
            <path 
              d="M35,116 L35,170 C35,173 37,175 39,175 C41,175 42,173 42,170 L43,124 Z M65,116 L65,170 C65,173 63,175 61,175 C59,175 58,173 58,170 L57,124 Z" 
              fill={hasLegs ? "#ef4444" : "#1a1a1e"} 
              className={hasLegs ? "animate-pulse" : ""}
              opacity={hasLegs ? "0.9" : "0.3"}
              style={{ filter: hasLegs ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))' : 'none' }}
              stroke={hasLegs ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* PROFILE DIVIDER */}
        <div className="h-40 w-[1px] bg-white/5 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-deep-black py-2 px-1 text-[7px] font-mono text-white/20 select-none">
            KPI
          </div>
        </div>

        {/* BACK ANATOMY VIEW */}
        <div className="flex flex-col items-center">
          <span className="text-[7px] font-mono font-bold tracking-widest text-white/20 uppercase mb-2">BACK PROFILE</span>
          <svg viewBox="0 0 100 220" className="w-24 h-52 sm:w-28 sm:h-60 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.02)]">
            {/* Outline Figure Body base (Identical outline shape) */}
            <path 
              d="M50,15 C54,15 57,18 57,24 C57,28 54,32 50,32 C46,32 43,28 43,24 C43,18 46,15 50,15 Z M50,32 C48,32 46,35 44,40 C42,45 38,50 33,53 C29,55 27,58 27,62 L24,105 C24,108 26,110 29,110 C32,110 33,107 33,105 L35,70 L38,70 L35,115 C34,120 33,128 33,135 L33,205 C33,208 35,210 38,210 C41,210 43,208 43,205 L44,145 C44,142 46,140 50,140 C54,140 56,142 56,145 L57,205 C57,208 59,210 62,210 C65,210 67,208 67,205 L67,135 C67,128 66,120 65,115 L62,70 L65,70 L67,105 C67,107 68,110 71,110 C74,110 76,108 76,105 L73,62 C73,58 71,55 67,53 C62,50 58,45 56,40 C54,35 52,32 50,32 Z" 
              fill="#121214" 
              stroke="#2e2e34" 
              strokeWidth="1.5" 
            />

            {/* UPPER TRAP / LOWER NECK BACK */}
            <path 
              d="M45,34 C47,38 53,38 55,34 C55,38 53,42 50,42 C47,42 45,38 45,34 Z" 
              fill={hasBack ? "#ef4444" : "transparent"}
              opacity={hasBack ? "0.9" : "0"}
              stroke={hasBack ? "#ff3131" : "transparent"}
              strokeWidth="1"
            />

            {/* SHOULDERS (DELTOIDS) BACK */}
            <path 
              d="M33,52 C35,51 38,47 43,44 L41,40 C37,44 34,48 31,51 Z M67,52 C65,51 62,47 57,44 L59,40 C63,44 66,48 69,51 Z" 
              fill={hasShoulders ? "#ef4444" : "transparent"} 
              opacity={hasShoulders ? "0.9" : "0"}
              stroke={hasShoulders ? "#ff3131" : "transparent"}
              strokeWidth="1.5"
            />

            {/* BACK / LATS */}
            <path 
              d="M34,54 C39,53 45,51 50,51 C55,51 61,53 66,54 C64,68 58,74 50,74 C42,74 36,68 34,54 Z"
              fill={hasBack ? "#ef4444" : "#1a1a1e"} 
              className={hasBack ? "animate-pulse" : ""}
              opacity={hasBack ? "0.9" : "0.3"}
              style={{ filter: hasBack ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))' : 'none' }}
              stroke={hasBack ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* LOWER BACK (ERECTION SPINE DETAIL) */}
            <path 
              d="M47,75 L47,105 C47,106 48,107 50,107 C52,107 53,106 53,105 L53,75 Z"
              fill={hasBack ? "#ef4444" : "#1a1a1e"} 
              className={hasBack ? "animate-pulse" : ""}
              opacity={hasBack ? "0.9" : "0.2"}
              style={{ filter: hasBack ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 'none' }}
              stroke={hasBack ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* BACK ARMS (TRICEPS) */}
            <path 
              d="M30,58 L28,88 L32,62 Z M70,58 L72,88 L68,62 Z" 
              fill={hasArms ? "#ef4444" : "#1a1a1e"}
              opacity={hasArms ? "0.9" : "0.2"}
              stroke={hasArms ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* GLUTES (BACK HIPS) */}
            <path 
              d="M34,106 C36,104 43,101 50,101 C57,101 64,104 66,106 C66,118 60,121 50,121 C40,121 34,118 34,106 Z" 
              fill={hasLegs ? "#ef4444" : "#1a1a1e"} 
              className={hasLegs ? "animate-pulse" : ""}
              opacity={hasLegs ? "0.9" : "0.3"}
              style={{ filter: hasLegs ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))' : 'none' }}
              stroke={hasLegs ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />

            {/* BACK LEGS (HAMSTRINGS / CALVES) */}
            <path 
              d="M35,123 L35,178 C35,180 37,181 39,181 C41,181 42,180 42,178 L43,131 Z M65,123 L65,178 C65,180 63,181 61,181 C59,181 58,180 58,178 L57,131 Z" 
              fill={hasLegs ? "#ef4444" : "#1a1a1e"} 
              className={hasLegs ? "animate-pulse" : ""}
              opacity={hasLegs ? "0.9" : "0.3"}
              style={{ filter: hasLegs ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))' : 'none' }}
              stroke={hasLegs ? "#ff3131" : "#2d2d34"}
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Footer list of activated systems */}
      <div className="w-full mt-4 flex flex-wrap justify-center gap-2 relative z-10">
        {[
          { label: "Chest", active: hasChest },
          { label: "Abs & Core", active: hasAbs },
          { label: "Legs & Glutes", active: hasLegs },
          { label: "Shoulders", active: hasShoulders },
          { label: "Arms & Triceps", active: hasArms },
          { label: "Posterior Back", active: hasBack },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`px-3 py-1 rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-widest font-mono border transition-all duration-300 ${
              item.active 
                ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]" 
                : "bg-white/[0.02] border-white/5 text-white/20"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
