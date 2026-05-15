export default function Subscription() {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="mb-12">
        <p className="text-neon-yellow font-bold text-xs uppercase tracking-[0.3em] mb-4">Official MB Fitness Plans</p>
        <h1 className="text-5xl font-display font-bold uppercase tracking-tighter">MB FITNESS <span className="text-white/20">ELITE</span></h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="glass-card p-10 border-white/10 hover:border-neon-yellow/30 transition-colors">
          <h2 className="text-2xl font-bold mb-4">MONTHLY</h2>
          <p className="text-5xl font-display font-bold mb-6">₹99</p>
          <ul className="text-left space-y-3 mb-8 text-gray-500 text-sm">
            <li>✓ Full Exercise Library</li>
            <li>✓ Smart Diet Planner</li>
            <li>✓ BMI Tracking</li>
          </ul>
          <button className="w-full py-4 border border-white/10 rounded-xl font-bold uppercase tracking-widest hover:bg-white/5">GET STARTED</button>
        </div>
        <div className="glass-card p-10 border-neon-yellow bg-neon-yellow/5">
          <h2 className="text-2xl font-bold mb-4">YEARLY</h2>
          <p className="text-5xl font-display font-bold mb-6">₹299</p>
          <ul className="text-left space-y-3 mb-8 text-gray-500 text-sm">
            <li>✓ Everything in Monthly</li>
            <li>✓ Live Trainer Support</li>
            <li>✓ AI Workout Generator</li>
            <li>✓ Performance Badges</li>
          </ul>
          <button className="w-full py-4 bg-neon-yellow text-black rounded-xl font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.3)]">CHANNELS OPEN</button>
        </div>
      </div>
    </div>
  );
}
