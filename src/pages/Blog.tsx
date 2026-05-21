import { motion } from "motion/react";
import { BookOpen, Calendar, Clock, ChevronRight, TrendingUp, Sparkles } from "lucide-react";

const posts = [
  {
    title: "The Architecture of Muscle Hypertrophy",
    date: "MAY 15, 2024",
    read: "12 MIN",
    category: "PHYSIOLOGY",
    image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=2070&auto=format&fit=crop",
    desc: "Deciphering the molecular pathways of protein synthesis and mechanical tension."
  },
  {
    title: "Neural Form Guidance: The Future of Training",
    date: "MAY 12, 2024",
    read: "8 MIN",
    category: "AI & TECH",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    desc: "How computer vision is revolutionizing the billion-dollar wellness industry."
  },
  {
    title: "Vedic Nutrition vs Modern Biohacking",
    date: "MAY 08, 2024",
    read: "15 MIN",
    category: "NUTRITION",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    desc: "Converging ancient Indian wisdom with cutting-edge metabolic substrate analysis."
  }
];

export default function Blog() {
  return (
    <div className="py-40 bg-deep-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-neon-green/20 mb-10"
              >
                <BookOpen className="w-4 h-4 text-neon-green" />
                <span className="text-[10px] font-black tracking-[0.5em] text-neon-green uppercase font-mono">Editorial Feed v1.2</span>
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] italic mb-10">
                Fitness<br/><span className="premium-gradient-text uppercase italic">Feed</span>
              </h1>
              <p className="text-white/40 text-xl font-semibold uppercase tracking-tight leading-relaxed italic">
                Deciphering the science of human high-performance.
              </p>
            </div>
            <div className="glass-panel p-8 min-w-[300px] border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp className="text-neon-green w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Trending Topics</span>
              </div>
              <div className="space-y-4">
                {["#BIOHACKING", "#NEURALPLASTICITY", "#METABOLICFLUIDITY"].map(tag => (
                  <div key={tag} className="text-xs font-black text-white/20 hover:text-neon-green cursor-pointer transition-colors">{tag}</div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {posts.map((post, idx) => (
            <motion.article 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[30px] mb-10 glass-panel p-2 border-white/5">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 rounded-[22px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-8 bottom-8 flex justify-between items-center z-10 transition-transform duration-700 group-hover:-translate-y-2">
                  <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-neon-green uppercase tracking-[0.2em] border border-white/10 uppercase">{post.category}</span>
                  <div className="w-10 h-10 bg-neon-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_20px_rgba(57,255,20,0.5)]">
                    <ChevronRight className="text-black w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">
                  <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {post.read}</div>
                </div>
                <h3 className="text-4xl font-display font-black uppercase tracking-tighter italic group-hover:text-neon-green transition-colors leading-[0.95]">{post.title}</h3>
                <p className="text-white/40 text-sm font-semibold uppercase tracking-tight leading-relaxed">{post.desc}</p>
                <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-neon-green opacity-40" />
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Read full Briefing</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-40 border-t border-white/5 pt-20 flex flex-col items-center text-center">
            <h2 className="text-5xl font-display font-black uppercase tracking-tighter italic mb-10">Subscribe to <span className="premium-gradient-text uppercase">The Archive</span></h2>
            <div className="flex w-full max-w-xl group">
                <input 
                    type="email" 
                    placeholder="ENTER YOUR RETURN VECTOR (EMAIL)"
                    className="flex-1 bg-white/5 border border-white/10 border-r-0 rounded-l-2xl px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-neon-green transition-all"
                />
                <button className="bg-neon-green text-black px-12 rounded-r-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all">SIGN UP</button>
            </div>
        </div>
      </div>
    </div>
  );
}
