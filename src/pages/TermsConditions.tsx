const sections = [
  { title: "Use Of Fitness Mantra", body: "Fitness Mantra is a fitness, diet, workout, BMI, calorie, and wellness guidance platform. You agree to use the app responsibly and only for personal fitness guidance." },
  { title: "Account Responsibility", body: "You are responsible for keeping your login details safe. Sharing paid plan access, misusing features, or submitting false information may lead to account restriction." },
  { title: "Subscriptions & Activation", body: "Paid plans are manually verified after UPI payment screenshot confirmation on WhatsApp. Activation may take up to 24 hours after verification." },
  { title: "Fitness Guidance", body: "Diet, workout, and AI Coach responses are for general guidance only. Results may vary based on consistency, lifestyle, health conditions, and other factors." },
  { title: "Payments", body: "Before making payment, users should review plan details. Any refund or cancellation request will be reviewed case by case through support." },
  { title: "Changes To Terms", body: "Fitness Mantra may update these terms when features, payments, or business policies change." },
];

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-deep-black text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <span className="text-neon-green text-[10px] font-black uppercase tracking-[0.45em]">Legal</span>
        <h1 className="mt-4 text-4xl sm:text-6xl font-display font-black uppercase italic tracking-tighter">Terms & Conditions</h1>
        <p className="mt-5 text-white/45 text-sm leading-relaxed font-semibold">Last updated: 30 June 2026. By using Fitness Mantra, you agree to these terms and conditions.</p>
        <div className="mt-10 space-y-5">
          {sections.map((item) => (
            <section key={item.title} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.015]">
              <h2 className="text-white font-black uppercase tracking-wider text-sm mb-3">{item.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed font-semibold">{item.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-[11px] text-white/35 leading-relaxed uppercase tracking-wider">For support, contact: manish55bhagat@gmail.com</p>
      </div>
    </main>
  );
}
