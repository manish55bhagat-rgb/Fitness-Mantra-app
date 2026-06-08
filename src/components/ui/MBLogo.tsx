import React from "react";
const logoImg = new URL("../../assets/images/app_logo_1780745261875.png", import.meta.url).href;

interface MBLogoProps {
  className?: string;
  size?: number;
}

export default function MBLogo({ className = "", size = 40 }: MBLogoProps) {
  return (
    <div 
      className={`relative rounded-xl overflow-hidden flex items-center justify-center bg-black border border-white/5 shadow-[0_0_20px_rgba(57,255,20,0.2)] ${className}`}
      style={{ width: size, height: size }}
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
