export default function Contact() {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-display font-bold mb-8 uppercase tracking-tighter">Contact <span className="text-neon-yellow">HQ</span></h1>
          <p className="text-gray-500 mb-12">Connect with our support drones or request a personal briefing with lead trainers.</p>
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                <span className="text-neon-yellow">📧</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold break-all">manish456bhagat@gmail.com</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-neon-yellow">📞</span>
              </div>
              <p className="text-xl font-display font-bold">+91 97656 90437</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-neon-yellow">📍</span>
              </div>
              <p className="text-xl font-display font-bold">Sangamner, AHMEDNAGAR</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-10 border-white/10">
          <form className="space-y-6">
            <input type="text" placeholder="FULL NAME" className="w-full bg-white/5 border-b border-white/10 py-4 focus:outline-none focus:border-neon-yellow transition-colors" />
            <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border-b border-white/10 py-4 focus:outline-none focus:border-neon-yellow transition-colors" />
            <textarea placeholder="MESSAGE BRIEFING" className="w-full bg-white/5 border-b border-white/10 py-4 focus:outline-none focus:border-neon-yellow transition-colors h-32" />
            <button className="w-full neon-button py-4">SEND TRANSMISSION</button>
          </form>
        </div>
      </div>
    </div>
  );
}
