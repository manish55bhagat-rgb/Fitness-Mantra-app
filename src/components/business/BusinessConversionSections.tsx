import { Link } from "react-router-dom";
import { Check, Shield, Smartphone, Utensils, Dumbbell, CreditCard, MessageSquare, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Create Your Profile",
    desc: "Enter your age, height, weight, food preference, goal, and basic fitness details.",
  },
  {
    title: "Choose A Plan",
    desc: "Start with ₹299 or choose a longer transformation plan based on your goal.",
  },
  {
    title: "Get Guidance",
    desc: "Use AI + human guidance for diet, workouts, BMI, calories, and habit support.",
  },
  {
    title: "Track Progress",
    desc: "Follow the plan, update progress, and improve your routine step by step.",
  },
];

const trustBadges = [
  { icon: Utensils, label: "Indian Diet Support" },
  { icon: Dumbbell, label: "Home & Gym Workouts" },
  { icon: Shield, label: "No Fake Claims" },
  { icon: Smartphone, label: "WhatsApp Support" },
  { icon: CreditCard, label: "Secure UPI Payment" },
  { icon: Check, label: "Simple Natural Guidance" },
];

const faqs = [
  {
    q: "Payment kelyavar plan kadhi active hoil?",
    a: "UPI payment screenshot WhatsApp var pathavlya nantar manual verification hote. Plan activation normally 24 hours madhye hote.",
  },
  {
    q: "₹299 plan konasathi best aahe?",
    a: "Starter users sathi. Basic AI Coach access, BMI/Calories tools, 7-day diet and workout guidance milte.",
  },
  {
    q: "Medical condition asel tar?",
    a: "Fitness Mantra general fitness guidance deto. BP, diabetes, injury, PCOD/PCOS, thyroid sarkhya conditions sathi doctor/dietitian consult kara.",
  },
  {
    q: "Refund policy kay aahe?",
    a: "Manual activation model mule refund case-by-case basis var review hoil. Payment karnyapoorvi plan details WhatsApp var confirm kara.",
  },
];

export default function BusinessConversionSections() {
  return (
    <section className="relative bg-deep-black border-t border-white/5 px-4 sm:px-6 py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.07),transparent_35%)] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto space-y-24">
        <div>
          <div className="text-center mb-12">
            <span className="inline-flex px-4 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/5 text-neon-green text-[9px] font-black uppercase tracking-[0.45em]">
              How It Works
            </span>
            <h2 className="mt-5 text-4xl md:text-6xl font-display font-black uppercase tracking-tighter italic text-white">
              Start Simple. <span className="premium-gradient-text">Stay Consistent.</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-white/45 text-xs sm:text-sm font-semibold uppercase tracking-tight leading-relaxed">
              A clear fitness journey for Indian users who want practical diet, workout, and progress guidance without confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div key={step.title} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.015] hover:border-neon-green/20 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-neon-green text-black flex items-center justify-center font-black text-sm mb-5">
                  {index + 1}
                </div>
                <h3 className="text-white text-base font-black uppercase italic tracking-tight mb-3">{step.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div className="glass-panel p-8 sm:p-10 rounded-[32px] border border-white/5 bg-black/35">
            <span className="text-neon-green text-[9px] font-black uppercase tracking-[0.45em]">Why Choose Fitness Mantra</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-display font-black uppercase tracking-tighter italic text-white leading-tight">
              Built For Real Indian Fitness Needs
            </h2>
            <p className="mt-5 text-white/45 text-sm leading-relaxed font-semibold">
              Fitness Mantra focuses on simple, honest, and practical guidance. No fake transformations, no unrealistic claims, and no complicated diet language.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/subscription" className="btn-premium px-7 py-4 text-[10px] justify-center">
                View Plans <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919765690437?text=Hi%20Manish,%20I%20want%20to%20know%20which%20Fitness%20Mantra%20plan%20is%20best%20for%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/25 text-white hover:text-neon-green text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Ask On WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="p-5 rounded-2xl border border-white/5 bg-white/[0.025] flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-neon-green" />
                </div>
                <span className="text-white/75 text-xs font-black uppercase tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-10">
            <span className="inline-flex px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/50 text-[9px] font-black uppercase tracking-[0.45em]">
              Common Questions
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-display font-black uppercase tracking-tighter italic text-white">
              Before You Start
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {faqs.map((item) => (
              <div key={item.q} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.012]">
                <h3 className="text-white text-sm font-black uppercase tracking-tight mb-3">{item.q}</h3>
                <p className="text-white/45 text-xs leading-relaxed font-semibold">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
