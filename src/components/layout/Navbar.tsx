import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Activity, User } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Programs", path: "/programs" },
  { name: "Exercises", path: "/exercises" },
  { name: "Diet Plans", path: "/diet" },
  { name: "BMI", path: "/bmi-calculator" },
  { name: "Calories", path: "/calorie-calculator" },
  { name: "AI Coach", path: "/ai-assistant" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="glass-panel !rounded-[24px] border-white/10 px-8 h-20 flex items-center justify-between backdrop-blur-2xl bg-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.4)]">
              <Activity className="text-black w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white group-hover:text-neon-green transition-colors leading-none">
                FITNESS MANTRA
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black mt-1 leading-none italic font-mono">
                System Architect: Manish Bhagat
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.25em] transition-all relative py-2 group/link",
                  location.pathname === link.path ? "text-neon-green" : "text-white/40 hover:text-white"
                )}
              >
                {link.name}
                <motion.div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green rounded-full shadow-glow",
                    location.pathname === link.path ? "opacity-100" : "opacity-0 group-hover/link:opacity-50"
                  )}
                  layoutId="nav-glow"
                />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/subscription" className="btn-premium !px-6 !py-2.5 !rounded-xl !text-[9px] !tracking-[0.1em]">
              UPGRADE
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-neon-green p-2 transition-colors"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-deep-black/95 backdrop-blur-3xl z-[150] lg:hidden p-12 flex flex-col items-center justify-center text-center"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-12 right-12 text-white/40 hover:text-white">
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-4xl font-display font-black uppercase tracking-tighter transition-all hover:italic",
                      location.pathname === link.path ? "text-neon-green" : "text-white/40"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Link to="/subscription" onClick={() => setIsOpen(false)} className="btn-premium px-12 py-5 w-full">
                  UNLEASH PRO
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
