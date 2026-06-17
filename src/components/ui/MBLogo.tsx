import React from "react";
const logoImg = new URL("../../assets/images/app_logo_1780745261875.png", import.meta.url).href;

interface MBLogoProps {
  className?: string;
  size?: number;
}

export default function MBLogo({ className = "", size }: MBLogoProps) {
  return (
    <div 
      className={`relative rounded-xl overflow-hidden flex items-center justify-center bg-black border-2 border-neon-green/40 shadow-[0_0_15px_rgba(57,255,20,0.3)] shrink-0 select-none ${!size ? "w-10 h-10 sm:w-12 sm:h-12" : ""} ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <img
        src={logoImg}
        alt="Fitness Mantra MB Logo"
        className="w-[145%] h-[145%] max-w-none object-cover select-none pointer-events-none -translate-y-[13%]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
