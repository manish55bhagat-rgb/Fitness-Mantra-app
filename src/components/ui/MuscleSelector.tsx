import React, { useState } from "react";
import { motion } from "motion/react";

interface MuscleGroup {
  id: string;
  name: string;
  path: string;
}

const muscles: MuscleGroup[] = [
  { id: "chest", name: "Chest", path: "M50,30 Q60,25 70,30 Q75,40 70,50 Q60,55 50,53 Q40,55 30,50 Q25,40 30,30 Q40,25 50,30 Z" },
  { id: "abs", name: "Abs", path: "M40,55 Q50,53 60,55 L58,85 Q50,88 42,85 Z" },
  { id: "shoulders", name: "Shoulders", path: "M25,30 Q15,35 15,45 Q20,55 30,50 M75,30 Q85,35 85,45 Q80,55 70,50" },
  { id: "biceps", name: "Biceps", path: "M15,45 Q10,55 12,70 M85,45 Q90,55 88,70" },
  { id: "quads", name: "Quads", path: "M35,90 Q40,110 40,140 M65,90 Q60,110 60,140" },
];

interface Props {
  onSelect: (muscle: string | null) => void;
  selectedMuscle: string | null;
}

export default function MuscleSelector({ onSelect, selectedMuscle }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[300px] aspect-[1/2] glass-panel p-8 border-white/5 overflow-hidden group">
      <div className="absolute inset-0 os-grid opacity-10" />
      
      <div className="absolute top-4 left-4 z-20">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Neural Mapping v2.0</span>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center">
        <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          {/* Outer Body Outline */}
          <path 
            d="M50,10 Q65,10 65,25 L65,30 Q85,30 85,50 L85,80 Q85,90 70,90 L65,180 L35,180 L30,90 Q15,90 15,80 L15,50 Q15,30 35,30 L35,25 Q35,10 50,10 Z" 
            fill="rgba(255,255,255,0.03)" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="0.5"
          />

          {muscles.map((m) => (
            <motion.path
              key={m.id}
              d={m.path}
              fill={selectedMuscle === m.id ? "#39FF14" : hovered === m.id ? "rgba(57, 255, 20, 0.4)" : "rgba(255,255,255,0.05)"}
              stroke={selectedMuscle === m.id ? "#39FF14" : hovered === m.id ? "#39FF14" : "rgba(255,255,255,0.1)"}
              strokeWidth="0.5"
              className="cursor-pointer transition-colors duration-300"
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(selectedMuscle === m.id ? null : m.id)}
            />
          ))}
        </svg>

        <div className="mt-8 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green mb-2 h-4">
            {hovered ? hovered : selectedMuscle ? selectedMuscle : "SELECT TARGET"}
          </div>
          <div className="text-[8px] font-black uppercase tracking-[0.1em] text-white/30">
            Biometric Focus Analysis
          </div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-neon-green/5 to-transparent pointer-events-none" />
    </div>
  );
}
