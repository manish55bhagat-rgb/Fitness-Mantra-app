const sections = [
  { title: "Information We Collect", body: "Fitness Mantra may collect your name, email, age, height, weight, gender, fitness goal, food preference, medical notes shared by you, payment status, and app usage information." },
  { title: "How We Use Your Data", body: "We use this information to create fitness guidance, manage your account, process plan activation, provide support, improve the app, and personalize your diet and workout experience." },
  { title: "Third-Party Services", body: "Fitness Mantra may use Firebase for authentication and database storage, Vercel for hosting, Google Gemini or similar AI services for AI Coach features, and UPI/WhatsApp for manual payment confirmation and support." },
  { title: "Data Safety", body: "We aim to protect your data using reasonable technical and organizational safeguards. However, no online platform can guarantee 100% security." },
  { title: "Data Deletion", body: "You may request account or data deletion by contacting us at manish55bhagat@gmail.com. We will review and process eligible requests within a reasonable time." },
  { title: "Updates", body: "This Privacy Policy may be updated when our app, features, payment flow, or legal requirements change." },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-deep-black text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <span className="text-neon-green text-[10px] font-black uppercase tracking-[0.45em]">Legal</span>
        <h1 className="mt-4 text-4xl sm:text-6xl font-display font-black uppercase italic tracking-tighter">Privacy Policy</h1>
        <p className="mt-5 text-white/45 text-sm leading-relaxed font-semibold">Last updated: 30 June 2026. This policy explains how Fitness Mantra collects, uses, and protects user information.</p>
        <div className="mt-10 space-y-5">
          {sections.map((item) => (
            <section key={item.title} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.015]">
              <h2 className="text-white font-black uppercase tracking-wider text-sm mb-3">{item.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed font-semibold">{item.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-[11px] text-white/35 leading-relaxed uppercase tracking-wider">For privacy questions, contact: manish55bhagat@gmail.com</p>
      </div>
    </main>
  );
}
