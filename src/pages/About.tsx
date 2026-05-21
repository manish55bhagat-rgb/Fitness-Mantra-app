import { motion } from "motion/react";
import { Shield, Sparkles, Target, Zap, Globe, Cpu } from "lucide-react";

export default function About() {
  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-32 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10"
          >
            <Sparkles className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">The Vision Protocol</span>
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-12 italic">
            Physical<br/><span className="premium-gradient-text uppercase italic">Evolution</span>
          </h1>
          <p className="text-white/40 max-w-3xl mx-auto text-xl font-semibold uppercase tracking-tight leading-relaxed italic">
            "Fitness is no longer a destination; it's a structural evolution of the human machine."
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
          <div>
            <h2 className="text-5xl font-display font-black mb-10 uppercase tracking-tighter">Manish <span className="premium-gradient-text uppercase">Bhagat</span></h2>
            <div className="space-y-8 text-white/40 font-semibold uppercase tracking-tight text-lg leading-relaxed">
              <p>Founded by <span className="text-white">Manish Bhagat</span>, Fitness Mantra represents the convergence of high-performance physical training and futuristic digital monitoring.</p>
              <p>With a philosophy rooted in bio-mechanical precision, we've engineered a platform that transcends traditional gym boundaries. We don't just track movement; we architect transformation.</p>
              <p>Our mission is to democratize elite-level coaching through AI-driven insights and immersive 3D walkthroughs of the world's most effective exercise protocols.</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[40px] overflow-hidden glass-panel border-white/5 p-4">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
                alt="Architecture of Fitness" 
                className="w-full h-full object-cover rounded-[30px] grayscale transition-all duration-1000 hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 glass-panel p-8 border-neon-green/20">
              <div className="text-neon-green font-black text-4xl mb-2 font-display italic">100%</div>
              <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">NATURAL EVOLUTION</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Cpu, title: "Neural Logic", desc: "AI algorithms trained on world-class athletic biographies." },
            { icon: Globe, title: "Global Sync", desc: "Access your physiological data from any node on the planet." },
            { icon: Shield, title: "Integrity", desc: "A commitment to 100% natural, scientifically validated growth." },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="glass-panel p-12 border-white/5 hover:border-neon-green/20 transition-all duration-700"
            >
              <item.icon className="w-12 h-12 text-neon-green mb-8" />
              <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-6 italic">{item.title}</h3>
              <p className="text-white/30 text-sm font-semibold uppercase tracking-tight leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
