import { Activity, Github, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col mb-8">
              <span className="text-2xl font-black tracking-tighter text-neon-yellow leading-none">FITNESS MANTRA</span>
              <span className="text-[8px] uppercase tracking-[0.4em] opacity-40 mt-1">Proprietor: Manish Bhagat</span>
            </Link>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest leading-loose mb-10 opacity-60">
              Forging the elite through AI-driven metrics and performance architecture.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-neon-yellow hover:text-black transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-neon-yellow hover:text-black transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10">Programs</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              <li><Link to="/programs" className="hover:text-neon-yellow transition-colors">Muscle Forge</Link></li>
              <li><Link to="/programs" className="hover:text-neon-yellow transition-colors">Lean Burn</Link></li>
              <li><Link to="/programs" className="hover:text-neon-yellow transition-colors">Zen Flow</Link></li>
              <li><Link to="/programs" className="hover:text-neon-yellow transition-colors">Elite Cardio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10">Architecture</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              <li><Link to="/about" className="hover:text-neon-yellow transition-colors">Our Vision</Link></li>
              <li><Link to="/diet" className="hover:text-neon-yellow transition-colors">Keto Lab</Link></li>
              <li><Link to="/exercises" className="hover:text-neon-yellow transition-colors">Movement Library</Link></li>
              <li><Link to="/contact" className="hover:text-neon-yellow transition-colors">Command Center</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10">HQ Transmission</h4>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">
                <div className="w-8 h-8 rounded-full bg-neon-yellow flex items-center justify-center text-black shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-[9px] uppercase tracking-wider opacity-60 font-bold break-all">manish456bhagat@gmail.com</div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">
                <div className="w-8 h-8 rounded-full bg-neon-yellow flex items-center justify-center text-black shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-[10px] uppercase tracking-wider opacity-60 font-bold">+91 97656 90437</div>
              </div>
              <div className="text-[10px] uppercase tracking-wider leading-loose opacity-40 font-bold">
                Sangamner <br />
                Maharashtra, India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-700"></div>
               ))}
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest">500k+ Athletes</span>
               <span className="text-[8px] opacity-40 uppercase tracking-widest">Global Community</span>
             </div>
          </div>

          <div className="text-[9px] font-black tracking-[0.4em] text-gray-600 uppercase flex gap-12">
            <span>© 2026 MANTRA ARCHITECTS</span>
            <span className="text-neon-yellow">LEAD: MANISH BHAGAT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
