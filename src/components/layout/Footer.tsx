import { Instagram, Twitter, Mail, MapPin, Shield, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import MBLogo from "../ui/MBLogo";

export default function Footer() {
  return (
    <footer className="bg-deep-black border-t border-white/5 pt-16 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-neon-green/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Logo & Tagline */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 group mb-6" id="footer-brand-logo">
              <MBLogo size={40} className="rotate-3 group-hover:rotate-12 transition-transform duration-300" />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-white group-hover:text-neon-green transition-colors leading-none uppercase italic">
                  FITNESS MANTRA
                </span>
                <span className="text-[7px] uppercase tracking-[0.4em] text-neon-green font-black mt-1 leading-none italic font-mono">
                  MANISH BHAGAT
                </span>
              </div>
            </Link>
            <p className="text-white/40 text-xs font-semibold tracking-tight leading-relaxed mb-6">
              Transform Your Body Naturally. Professional fitness design, custom meal planning, and performance metrics built for you.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 glass-panel flex items-center justify-center rounded-xl border-white/5 hover:border-neon-green/20 hover:text-neon-green transition-all group">
                  <Icon className="w-4.5 h-4.5 group-hover:animate-pulse-neon" />
                </a>
              ))}
            </div>
          </div>

          {/* Our Plans */}
          <div>
            <h4 className="font-extrabold text-[11px] uppercase tracking-[0.3em] mb-6 text-white/30">Our Plans</h4>
            <ul className="space-y-3.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
              <li><Link to="/subscription" className="hover:text-neon-green transition-colors flex items-center gap-2 italic">Starter Plan <Zap className="w-2.5 h-2.5 text-neon-green/30" /></Link></li>
              <li><Link to="/subscription" className="hover:text-neon-green transition-colors flex items-center gap-2 italic">Transformation Plan <Zap className="w-2.5 h-2.5 text-neon-green/30" /></Link></li>
              <li><Link to="/subscription" className="hover:text-neon-green transition-colors flex items-center gap-2 italic">Premium Lifestyle Plan <Zap className="w-2.5 h-2.5 text-neon-green/30" /></Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-[11px] uppercase tracking-[0.3em] mb-6 text-white/30">Quick Links</h4>
            <ul className="space-y-3.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
              <li><Link to="/about" className="hover:text-neon-green transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-neon-green transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-neon-green transition-colors">Blog</Link></li>
              <li><Link to="/exercises" className="hover:text-neon-green transition-colors">Workout Library</Link></li>
              <li><Link to="/bmi-calculator" className="hover:text-neon-green transition-colors">BMI Calculator</Link></li>
              <li><Link to="/calorie-calculator" className="hover:text-neon-green transition-colors">Calorie Calculator</Link></li>
            </ul>
          </div>

          {/* Contact Node */}
          <div>
            <h4 className="font-extrabold text-[11px] uppercase tracking-[0.3em] mb-6 text-white/30">Contact us</h4>
            <div className="glass-panel p-5 border-white/5 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Contact Email</span>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-neon-green shrink-0" />
                  <a href="mailto:manish456bhagat@gmail.com" className="text-[11px] font-bold tracking-tight text-white/70 hover:text-neon-green break-all transition-colors">
                    manish456bhagat@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Location</span>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-neon-green shrink-0" />
                  <span className="text-[11px] font-bold text-white/65 uppercase tracking-wide">
                    Sangamner, Maharashtra
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <a 
                  href="mailto:manish456bhagat@gmail.com"
                  className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-neon-green text-black font-black text-[10px] uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_4px_15px_rgba(57,255,20,0.25)]"
                >
                  <Mail className="w-3.5 h-3.5" /> Write to Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Health Disclaimer banner in Footer */}
        <div className="mb-8 p-4.5 rounded-2xl bg-white/[0.01] border border-white/5 text-center">
          <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">
            ⚠️ <strong className="text-white/60">Health Disclaimer:</strong> Fitness Mantra provides general fitness and diet guidance. For medical conditions, consult a qualified doctor or dietitian.
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold text-neon-green uppercase tracking-[0.25em] font-sans">
              Fitness Plans • Diet Guidance • Workout Support
            </span>
          </div>

          <div className="flex flex-col md:items-end gap-1.5 text-center md:text-right">
            <div className="text-[10px] font-extrabold tracking-[0.15em] text-white/40 uppercase">
              © 2026 Fitness Mantra. Built by Manish Bhagat.
            </div>
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-[8px] font-bold text-white/15 uppercase tracking-[0.4em]">
              <Shield className="w-3 h-3" /> CERTIFIED NATURAL FITNESS COACHING PLATFORM
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
