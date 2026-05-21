import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck } from "lucide-react";

export default function Contact() {
  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-24 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10">
            <MessageSquare className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Communication Link v1.0</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] italic mb-6">
            Direct<br/><span className="premium-gradient-text uppercase italic">Briefing</span>
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-semibold uppercase tracking-tight leading-relaxed">
            Connect with our elite support architects or request a personal performance audit.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Contact Details */}
          <div className="space-y-16">
            <div className="space-y-12">
              {[
                { icon: Mail, label: "Neural Inbox", val: "manish456bhagat@gmail.com" },
                { icon: Phone, label: "Voice Link", val: "+91 97656 90437" },
                { icon: MapPin, label: "HQ Node", val: "Sangamner, AHMEDNAGAR" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-8 group"
                >
                  <div className="w-16 h-16 glass-panel flex items-center justify-center rounded-2xl border-white/5 group-hover:border-neon-green/30 transition-all">
                    <item.icon className="w-6 h-6 text-neon-green group-hover:animate-pulse-neon" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono mb-1">{item.label}</div>
                    <div className="text-2xl font-display font-black uppercase tracking-tighter italic">{item.val}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-panel p-10 border-blue-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-24 h-24 text-blue-500 blur-xl" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-4">
                <ShieldCheck className="text-blue-400 w-5 h-5" />
                DDoS Protected Port
              </h4>
              <p className="text-white/30 text-xs font-semibold uppercase tracking-tight leading-loose">
                All communications are encrypted using high-fidelity protocols. Our architects will respond within 24 physiological hours.
              </p>
            </div>
          </div>

          {/* Form Console */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-panel p-12 border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 os-grid opacity-10" />
            <form className="relative z-10 space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">Biological Identifier</label>
                <input 
                  type="text" 
                  placeholder="ENTER FULL NAME"
                  className="w-full bg-transparent border-b border-white/10 py-5 text-2xl font-display font-black focus:outline-none focus:border-neon-green transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">Return Vector (EMAIL)</label>
                <input 
                  type="email" 
                  placeholder="PROTOCOL@DOMAIN.COM"
                  className="w-full bg-transparent border-b border-white/10 py-5 text-2xl font-display font-black focus:outline-none focus:border-neon-green transition-all uppercase"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block font-mono">Transmission Briefing</label>
                <textarea 
                  placeholder="INITIALIZE MESSAGE..."
                  className="w-full bg-transparent border-b border-white/10 py-5 text-2xl font-display font-black focus:outline-none focus:border-neon-green transition-all h-32 uppercase"
                />
              </div>

              <button className="btn-premium w-full py-8 text-xs group flex justify-center items-center gap-4">
                SEND TRANSMISSION <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
