import React from 'react';
import { motion } from 'motion/react';

export default function FloatingBackground() {
  const bubbles = Array.from({ length: 15 });
  const particles = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 bg-deep-black">
      {/* 3D Floating Gradient Spheres */}
      {bubbles.map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full opacity-[0.03] blur-[100px]"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: Math.random() * 2 + 1,
            backgroundColor: i % 2 === 0 ? '#39FF14' : '#ffffff',
          }}
          animate={{
            x: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: Math.random() * 400 + 200 + 'px',
            height: Math.random() * 400 + 200 + 'px',
          }}
        />
      ))}

      {/* Cinematic Glowing Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-neon-green rounded-full shadow-[0_0_10px_#39FF14]"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5,
          }}
          animate={{
            y: [null, '-100vh'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        />
      ))}

      {/* Fixed OS Grid Layer */}
      <div className="absolute inset-0 os-grid opacity-[0.03] contrast-150" />
      
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(57,255,20,0.02)_0%,transparent_70%)]" />
    </div>
  );
}
