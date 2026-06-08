import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MapPin, Send, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipient = "manish456bhagat@gmail.com";
    const subject = encodeURIComponent(`Fitness Mantra Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Manish,\n\n` +
      `You have received a new message through the Fitness Mantra Contact Form.\n\n` +
      `Sender Details:\n` +
      `- Name: ${name}\n` +
      `- Email: ${email}\n\n` +
      `Message Details:\n` +
      `${message}\n\n` +
      `Please follow up directly at: ${email}`
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    setIsSent(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="py-12 sm:py-20 bg-deep-black min-h-[calc(100vh-80px)] relative overflow-hidden px-4 md:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Dynamic Compact Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 mb-6">
            <MessageSquare className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-[9px] font-extrabold tracking-[0.4em] text-neon-green uppercase font-mono">Contact Matrix</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9] italic mb-4">
            LET'S DISCUSS YOUR <br />
            <span className="text-neon-green uppercase italic">TRANSFORMATION</span>
          </h1>
          <p className="text-white/40 max-w-xl text-xs sm:text-sm font-semibold tracking-tight leading-relaxed">
            Connect with certified coach Manish Bhagat. Reach out regarding personalized diets, custom workouts, or enterprise guidance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Contact Email", val: "manish456bhagat@gmail.com", href: "mailto:manish456bhagat@gmail.com" },
                { icon: MapPin, label: "HQ Location", val: "Sangamner, Maharashtra" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/[0.02] border border-white/5 flex items-center justify-center rounded-xl group-hover:border-neon-green/30 transition-all">
                    <item.icon className="w-5 h-5 text-neon-green" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-base sm:text-xl font-bold tracking-tight text-white hover:text-neon-green transition-colors select-all">
                        {item.val}
                      </a>
                    ) : (
                      <span className="text-base sm:text-xl font-bold tracking-tight text-white/80">
                        {item.val}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-panel p-6 sm:p-8 border-white/5 relative overflow-hidden rounded-2xl">
              <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="text-neon-green w-4.5 h-4.5 shrink-0" />
                Verified Professional Coaching
              </h4>
              <p className="text-white/40 text-xs font-semibold leading-relaxed">
                All communications and physical statistics submitted to Fitness Mantra are kept strictly confidential. Your coach, Manish Bhagat, reviews proposals within 24 business hours.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-6 sm:p-10 border-white/5 relative overflow-hidden rounded-3xl"
          >
            <AnimatePresence>
              {isSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/35 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-neon-green animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-wider">Mail Draft Dispatched</h4>
                  <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                    Now launching your default mail program to send to manish456bhagat@gmail.com.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-white/30 tracking-widest block font-mono">Athlete Full Name</label>
                    <input 
                      type="text" 
                      placeholder="ENTER YOUR NAME"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/20 transition-all text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-white/30 tracking-widest block font-mono">Return Vector (EMAIL)</label>
                    <input 
                      type="email" 
                      placeholder="EMAIL@DOMAIN.COM"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs uppercase font-extrabold focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/20 transition-all text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-white/30 tracking-widest block font-mono">Inquiry Narrative</label>
                    <textarea 
                      placeholder="HOW CAN WE BUILD YOUR PHYSIQUE..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/20 transition-all h-24 text-white"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 text-[10px] bg-neon-green text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex justify-center items-center gap-2.5 shadow-[0_4px_15px_rgba(57,255,20,0.3)] cursor-pointer"
                  >
                    SEND TRANSMISSION <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
