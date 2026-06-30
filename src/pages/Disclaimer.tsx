const sections = [
  { title: "General Fitness Disclaimer", body: "Fitness Mantra provides general fitness, workout, diet, nutrition, BMI, calorie, and wellness guidance for educational and informational purposes only." },
  { title: "Not Medical Advice", body: "The information in this app is not intended to diagnose, treat, cure, or prevent any disease. It is not a substitute for advice from a qualified doctor, dietitian, physiotherapist, or healthcare professional." },
  { title: "Consult A Professional", body: "Before starting any diet, workout, weight loss, weight gain, or lifestyle program, consult a qualified healthcare professional, especially if you have BP, diabetes, PCOD/PCOS, thyroid, heart issues, injury, pregnancy, or any medical condition." },
  { title: "Results May Vary", body: "Fitness results depend on consistency, health condition, sleep, stress, diet, activity level, and many other factors. Fitness Mantra does not guarantee specific weight loss, inch loss, or body transformation results." },
  { title: "AI Coach Disclaimer", body: "AI Coach responses may sometimes be incomplete or inaccurate. Use AI guidance carefully and verify important health decisions with a qualified professional." },
];

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-deep-black text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <span className="text-neon-green text-[10px] font-black uppercase tracking-[0.45em]">Important Notice</span>
        <h1 className="mt-4 text-4xl sm:text-6xl font-display font-black uppercase italic tracking-tighter">Disclaimer</h1>
        <p className="mt-5 text-white/45 text-sm leading-relaxed font-semibold">Please read this disclaimer carefully before using Fitness Mantra services.</p>
        <div className="mt-10 space-y-5">
          {sections.map((item) => (
            <section key={item.title} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.015]">
              <h2 className="text-white font-black uppercase tracking-wider text-sm mb-3">{item.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed font-semibold">{item.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
