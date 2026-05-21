import { Instagram, Twitter, Mail, Phone, MapPin, Shield, Zap, Globe, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-deep-black border-t border-white/5 pt-32 pb-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
          
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 group mb-10">
              <div className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                <Activity className="text-black w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white group-hover:text-neon-green transition-colors leading-none uppercase italic">
                  FITNESS MANTRA
                </span>
                <span className="text-[7px] uppercase tracking-[0.4em] text-white/20 font-black mt-1 leading-none italic font-mono">
                  NATURAL EVOLUTION HQ
                </span>
              </div>
            </Link>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-tight leading-relaxed mb-10 italic">
              "Forging the elite through AI-driven metrics and bio-mechanical architecture."
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 glass-panel flex items-center justify-center rounded-2xl border-white/5 hover:border-neon-green/20 hover:text-neon-green transition-all group">
                  <Icon className="w-5 h-5 group-hover:animate-pulse-neon" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-12 text-white/20">Protocols</h4>
            <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <li><Link to="/programs" className="hover:text-neon-green transition-colors flex items-center gap-3 italic">Muscle Forge <Zap className="w-3 h-3 text-neon-green/20" /></Link></li>
              <li><Link to="/programs" className="hover:text-neon-green transition-colors flex items-center gap-3 italic">Lean Burn <Zap className="w-3 h-3 text-neon-green/20" /></Link></li>
              <li><Link to="/programs" className="hover:text-neon-green transition-colors flex items-center gap-3 italic">Apex Bulk <Zap className="w-3 h-3 text-neon-green/20" /></Link></li>
              <li><Link to="/subscription" className="hover:text-neon-green transition-colors flex items-center gap-3 italic">Elite Access <Zap className="w-3 h-3 text-neon-green/20" /></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-12 text-white/20">Architecture</h4>
            <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <li><Link to="/about" className="hover:text-neon-green transition-colors italic">Our Vision</Link></li>
              <li><Link to="/faq" className="hover:text-neon-green transition-colors italic">Knowledge Base</Link></li>
              <li><Link to="/exercises" className="hover:text-neon-green transition-colors italic">Neural Library</Link></li>
              <li><Link to="/bmi-calculator" className="hover:text-neon-green transition-colors italic">BMI Calculator</Link></li>
              <li><Link to="/calorie-calculator" className="hover:text-neon-green transition-colors italic">Calorie Calculator</Link></li>
              <li><Link to="/contact" className="hover:text-neon-green transition-colors italic">Direct Briefing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-12 text-white/20">Contact Node</h4>
            <div className="glass-panel p-8 border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-neon-green" />
                <span className="text-[10px] font-black tracking-widest text-white/40 break-all uppercase">manish456bhagat@gmail.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-neon-green" />
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">+91 97656 90437</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-4 h-4 text-neon-green" />
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Sangamner, AHMEDNAGAR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl border-2 border-deep-black bg-white/5 glass-panel overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-[0.2em]">50,000+ Athletes</div>
              <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em]">Global Biological Sync</div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <div className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase flex gap-8">
              <span>© 2026 MANTRA ARCHITECTS</span>
              <span className="text-neon-green italic">DIRECTED BY: MANISH BHAGAT</span>
            </div>
            <div className="flex items-center gap-3 text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">
              <Shield className="w-3 h-3" /> SECURE TRANSMISSION PORTAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
