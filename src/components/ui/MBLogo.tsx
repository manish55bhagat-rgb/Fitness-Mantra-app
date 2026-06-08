import React from "react";
const logoImg = new URL("../../assets/images/fm_premium_logo_1780745544979.png", import.meta.url).href;

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
        alt="MB Logo"
        className="w-full h-full object-cover select-none pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
