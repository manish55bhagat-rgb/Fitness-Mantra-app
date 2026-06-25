import React, { useState } from "react";
import { motion, Variants } from "motion/react";
import { Activity, Zap, Target, ArrowRight, Dumbbell, Sparkles, Send, Check, Star, Calculator, Utensils, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const featureCards = [
  {
    title: "AI Fitness Coach",
    desc: "Personalized coaching, 24/7 instant fitness support, habit guidance, and practical daily answers.",
    icon: Sparkles,
    color: "text-neon-green border-neon-green/10 bg-neon-green/[1%]"
  },
  {
    title: "Indian Diet Guidance",
    desc: "Customized pure vegetarian, non-vegetarian, or eggitarian Indian meal setups matching your preferences.",
    icon: Utensils,
    color: "text-blue-400 border-blue-500/10 bg-blue-500/[1%]"
  },
  {
    title: "Home & Gym Workouts",
    desc: "Tailored exercise protocols for both home (no equipment) and fully-equipped gym environments.",
    icon: Dumbbell,
    color: "text-purple-400 border-purple-500/10 bg-purple-500/[1%]"
  },
  {
    title: "BMI & Calorie Tools",
    desc: "Fast, reliable physical metrics and daily target caloric calculations to track your progress.",
    icon: Calculator,
    color: "text-amber-400 border-amber-500/10 bg-amber-500/[1%]"
  }
];

const programs = [
  { 
    title: "Muscle Gain Workouts", 
    desc: "Build strong muscles and build power with personalized gym/home plans.", 
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070&auto=format&fit=crop",
    category: "STRENGTH"
  },
  { 
    title: "Fat Loss Cardio", 
    desc: "Burn belly fat and get lean with high-energy cardio exercises.", 
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop",
    category: "CARDIO"
  },
  { 
    title: "Body Flexibility & Yoga", 
    desc: "Stretch, recover, and keep your joints healthy and pain-free.", 
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop",
    category: "FLEXIBILITY"
  },
];

const previewPlans = [
  {
    name: "Starter Plan",
    price: "299",
    period: "30 Days",
    features: ["AI Coach access", "BMI & Calories Calculator", "7-Day Diet Plan", "7-Day Workout Plan", "Basic weight-loss guidance"],
    highlight: false
  },
  {
    name: "Transformation Plan",
    price: "999",
    period: "90 Days",
    features: ["Everything in Starter Plan", "30-Day Diet & Workout Plan", "PDF Diet Plan", "Food image calorie estimate", "Progress tracking"],
    highlight: true
  },
  {
    name: "Premium Lifestyle Plan",
    price: "1999",
    period: "6 Months",
    features: ["Everything in Transformation", "6-month roadmap", "Monthly custom updates", "Priority human review by Manish", "Habit & recipe guidance"],
    highlight: false
  }
];

export default function Home() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    fitnessGoal: "Fat Loss",
    foodPreference: "Veg",
    medicalIssue: "",
    contactPhone: "",
    whatsApp: "",
    email: "",
    selectedPlan: "1 Month Starter Plan",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [usePhoneAsWhatsApp, setUsePhoneAsWhatsApp] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim()) {
      setErrorMsg("Full Name cannot be blank.");
      return;
    }
    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum <= 0) {
      setErrorMsg("Please enter a valid age.");
      return;
    }
    const heightNum = parseFloat(formData.height);
    if (!formData.height || isNaN(heightNum) || heightNum <= 0) {
      setErrorMsg("Please enter a valid height in cm.");
      return;
    }
    const weightNum = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weightNum) || weightNum <= 0) {
      setErrorMsg("Please enter a valid weight in kg.");
      return;
    }
    
    const phoneNo = formData.contactPhone;
    if (phoneNo && !/^\d{10}$/.test(phoneNo)) {
      setErrorMsg("Phone number must be exactly 10 digits.");
      return;
    }

    const waNo = usePhoneAsWhatsApp ? phoneNo : formData.whatsApp;
    if (waNo && !/^\d{10}$/.test(waNo)) {
      setErrorMsg("WhatsApp number must be exactly 10 digits.");
      return;
    }

    if (!phoneNo && !waNo) {
      setErrorMsg("Please provide at least one contact number (Phone or WhatsApp) so we can reach you.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const leadId = "lead_" + Date.now() + "_" + Math.random().toString(36).replace(/[^a-z0-9]/gi, "").substring(0, 10);
    try {
      const leadData = {
        fullName: formData.fullName.trim(),
        age: ageNum,
        gender: formData.gender,
        height: heightNum,
        weight: weightNum,
        fitnessGoal: formData.fitnessGoal,
        foodPreference: formData.foodPreference,
        medicalIssue: formData.medicalIssue.trim() || "None",
        contactPhone: phoneNo || "",
        whatsApp: waNo || "",
        email: formData.email.trim(),
        selectedPlan: formData.selectedPlan,
        paymentStatus: "Pending",
        accessStatus: "Inactive",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "leads", leadId), leadData);
      setSuccess(true);
      setFormData({
        fullName: "",
        age: "",
        gender: "Male",
        height: "",
        weight: "",
        fitnessGoal: "Fat Loss",
        foodPreference: "Veg",
        medicalIssue: "",
        contactPhone: "",
        whatsApp: "",
        email: "",
        selectedPlan: "1 Month Starter Plan",
      });
      setUsePhoneAsWhatsApp(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Something went wrong while booking. Please try again or email us directly.");
      try {
        handleFirestoreError(err, OperationType.CREATE, `leads/${leadId}`);
      } catch (authErr) {
        throw authErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="overflow-hidden bg-deep-black text-white font-sans selection:bg-neon-green selection:text-black">
      
      {/* Clean Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-deep-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-transparent to-deep-black z-10" />
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            alt="Elite Fitness Heritage" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-20 w-full text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/[0.02] border border-white/10 mb-8"
            >
              <Shield className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-[9px] font-black tracking-[0.4em] text-neon-green uppercase font-mono">Trustworthy Fitness Partner</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter uppercase mb-8 italic"
            >
              <span className="block text-white/95">Build Your</span>
              <span className="premium-gradient-text block">Best Body</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-semibold italic tracking-tight"
            >
              Complete Fitness App by Manish Bhagat. <br />
              Choose a personalized diet or workout plan to start your fitness journey.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <a href="#consultation-section" className="btn-premium px-12 py-5 text-xs group shadow-glow hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all">
                Start Your Fitness Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <Link to="/subscription" className="btn-outline px-12 py-5 text-xs border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest font-black">
                View Plans
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust-Based Feature Cards (Replaces Fake Stats Bar) */}
      <section className="relative z-10 border-y border-white/10 bg-black/40 backdrop-blur-3xl py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-black text-neon-green uppercase tracking-[0.45em] mb-3">Our Core Principles</h2>
            <p className="text-2xl font-display uppercase tracking-tight font-black italic text-white/95">Designed For Real Physical Progress</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={`glass-panel p-8 border rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all ${card.color}`}
              >
                <div>
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                    <card.icon className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-3 italic">{card.title}</h3>
                  <p className="text-white/40 text-xs font-semibold leading-relaxed uppercase tracking-tight italic">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean AI Coach Section */}
      <section className="py-32 relative overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1.5px] bg-neon-green" />
                <span className="text-neon-green font-black text-[9px] uppercase tracking-[0.5em] font-mono">AI FITNESS COACH</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black leading-tight uppercase tracking-tighter mb-8 italic">
                Personalized Diet &<br /><span className="premium-gradient-text">Workout Plans</span>
              </h2>
              <p className="text-white/45 text-base font-semibold uppercase italic tracking-tight leading-relaxed mb-10">
                Get simple, safe, and practical fitness, diet, workout, BMI, calorie, and habit guidance tailored to your body. Our support is available 24/7.
              </p>
              
              <div className="space-y-4 mb-10 text-white/60">
                <div className="flex items-center gap-4">
                  <Check className="w-4 h-4 text-neon-green" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Fitness Coach support available 24/7</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="w-4 h-4 text-neon-green" />
                  <span className="text-xs font-bold uppercase tracking-wider">Personalized Diet & Workout Plans</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="w-4 h-4 text-neon-green" />
                  <span className="text-xs font-bold uppercase tracking-wider">BMI, Calories & Progress Tracking</span>
                </div>
              </div>

              <Link to="/ai-assistant" className="btn-premium px-10 py-5 text-xs group inline-flex">
                Chat With AI Coach <Sparkles className="w-4.5 h-4.5 ml-3" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="glass-panel p-3 border-white/5 bg-white/[0.01] rounded-[32px] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=2070&auto=format&fit=crop" 
                  alt="High Performance Workout" 
                  className="w-full h-full object-cover rounded-[24px] grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BMI & Calorie tools Section */}
      <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-deep-black via-black/10 to-deep-black overflow-hidden px-6">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <span className="text-neon-green font-black text-[9px] uppercase tracking-[0.5em] mb-4 block bg-neon-green/5 w-fit px-4 py-1.5 rounded-full border border-neon-green/20 mx-auto">HEALTH MEASUREMENTS</span>
            <h2 className="text-4xl md:text-6xl font-display font-black leading-none uppercase tracking-tighter italic">
              BMI & Calorie <span className="premium-gradient-text font-black">Tools</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-semibold max-w-xl mx-auto mt-4 leading-relaxed uppercase tracking-tight">
              Instantly calculate your metrics and choose appropriate targets for fat loss or muscle gain.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* BMI Portal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group glass-panel p-10 border-white/5 hover:border-neon-green/20 transition-all rounded-[32px] flex flex-col justify-between h-[360px]"
            >
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight italic mb-3">BMI Calculator</h3>
                <p className="text-white/40 text-xs font-semibold leading-relaxed uppercase tracking-tight italic">
                  Check your Body Mass Index (BMI) instantly to understand if your weight is in a healthy range.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/bmi-calculator" className="btn-premium px-8 py-4 w-full text-center text-[10px] tracking-widest font-black uppercase rounded-xl flex items-center justify-center gap-3">
                  Check BMI Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Calorie Portal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group glass-panel p-10 border-white/5 hover:border-blue-500/20 transition-all rounded-[32px] flex flex-col justify-between h-[360px]"
            >
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-black text-blue-400">🔥</span>
                </div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight italic mb-3">Calorie Calculator</h3>
                <p className="text-white/40 text-xs font-semibold leading-relaxed uppercase tracking-tight italic">
                  Calculate your daily calorie requirements to easily reach your target weight loss or muscle gain.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/calorie-calculator" className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/20 text-white w-full py-4 text-center text-[10px] tracking-widest font-black uppercase rounded-xl flex items-center justify-center gap-3 transition-all">
                  Check Calories Now <ArrowRight className="w-4 h-4 text-blue-400" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diet & Workout Plans Section */}
      <section className="py-32 bg-deep-black relative px-6">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <span className="text-neon-green font-black text-[9px] uppercase tracking-[0.5em] mb-4 block bg-neon-green/5 w-fit px-4 py-1.5 rounded-full border border-neon-green/20 mx-auto">WORKOUT SEQUENCES</span>
            <h2 className="text-4xl md:text-6xl font-display font-black leading-none uppercase tracking-tighter italic">
              Diet & Workout <span className="premium-gradient-text font-black">Plans</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-semibold max-w-xl mx-auto mt-4 leading-relaxed uppercase tracking-tight">
              Carefully designed fitness routines and diet recommendations for your physical optimization.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative h-[500px] rounded-[36px] overflow-hidden bg-white/[0.01] border border-white/5 hover:border-neon-green/20 transition-all duration-500"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover grayscale opacity-35 group-hover:grayscale-0 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/35 to-transparent" />
                </div>

                <div className="absolute top-8 left-8 z-20">
                   <div className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase font-mono">{program.category}</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-3xl font-display font-black mb-3 uppercase tracking-tighter italic group-hover:text-neon-green transition-colors">{program.title}</h3>
                  <p className="text-white/40 text-xs mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 leading-relaxed font-semibold uppercase tracking-tight italic">
                    {program.desc}
                  </p>
                  <Link to="/exercises" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[9px] backdrop-blur-md group-hover:bg-neon-green group-hover:text-black group-hover:shadow-glow transition-all">
                    Access Module
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Preview (NEW Section as requested!) */}
      <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-deep-black via-black/[0.01] to-deep-black px-6">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <span className="text-neon-green font-black text-[9px] uppercase tracking-[0.5em] mb-4 block bg-neon-green/5 w-fit px-4 py-1.5 rounded-full border border-neon-green/20 mx-auto">PRICING TIERS</span>
            <h2 className="text-4xl md:text-6xl font-display font-black leading-none uppercase tracking-tighter italic">
              Affordable <span className="premium-gradient-text font-black">Subscription Plans</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-semibold max-w-xl mx-auto mt-4 leading-relaxed uppercase tracking-tight">
              Select an honest pricing plan to unlock your peak natural physical conditioning.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {previewPlans.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative glass-panel p-8 rounded-2xl flex flex-col justify-between border transition-all ${
                  plan.highlight 
                    ? "border-neon-green/30 bg-neon-green/[2%] shadow-[0_15px_30px_rgba(57,255,20,0.05)]" 
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-neon-green text-black font-black text-[8px] uppercase tracking-widest rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-wider mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-extrabold text-white">₹{plan.price}</span>
                    <span className="text-xs font-black text-neon-green font-mono">/ {plan.period}</span>
                  </div>
                  <div className="h-[1px] bg-white/5 mb-6" />
                  <div className="space-y-2.5 mb-8 text-[11px] text-white/65 font-semibold">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-neon-green shrink-0" />
                        <span className="uppercase tracking-tight italic">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/subscription" className={`w-full py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest text-center transition-all ${
                  plan.highlight 
                    ? "bg-neon-green text-black hover:shadow-glow" 
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}>
                  View Full Features & Pay
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Free Consultation Form Section */}
      <section id="consultation-section" className="py-32 relative overflow-hidden bg-deep-black border-t border-white/5 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-12 h-12 bg-neon-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neon-green/20">
              <Sparkles className="w-6 h-6 text-neon-green" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter italic">
              Book A <span className="text-neon-green">Free Consultation</span>
            </h2>
            <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mt-4 italic">
              Get customized feedback from Manish Bhagat
            </p>
          </div>

          <div className="glass-panel p-8 md:p-12 border-white/10 bg-black/40 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Check className="text-black w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 text-white">
                  Consultation Booked Successfully!
                </h3>
                <p className="text-white/60 text-xs max-w-sm mx-auto leading-relaxed mb-6">
                  Manish Bhagat will review your physical profile and reach out via your email address within 24 hours to discuss details.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-neon-green hover:text-black transition-all font-bold"
                >
                  Book Another Session
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Full Name *</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Manish Prasad"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Email Address *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. user@gmail.com"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Age */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Age *</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 25"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold"
                      required
                    />
                  </div>

                  {/* Height */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Height (in cm) *</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="e.g. 175"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold"
                      required
                    />
                  </div>

                  {/* Weight */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Weight (in kg) *</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 70"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gender */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Gender *</label>
                    <div className="relative">
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white/80 focus:outline-none focus:border-neon-green/50 appearance-none transition-all cursor-pointer font-semibold"
                      >
                        <option value="Male" className="bg-deep-black text-white">Male</option>
                        <option value="Female" className="bg-deep-black text-white">Female</option>
                        <option value="Other" className="bg-deep-black text-white">Other</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">▼</span>
                    </div>
                  </div>

                  {/* Fitness Goal */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Fitness Goal *</label>
                    <div className="relative">
                      <select 
                        value={formData.fitnessGoal}
                        onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white/80 focus:outline-none focus:border-neon-green/50 appearance-none transition-all cursor-pointer font-semibold"
                      >
                        <option value="Fat Loss" className="bg-deep-black text-white">Fat Loss</option>
                        <option value="Muscle Gain" className="bg-deep-black text-white">Muscle Gain</option>
                        <option value="Weight Gain" className="bg-deep-black text-white">Weight Gain</option>
                        <option value="General Fitness" className="bg-deep-black text-white">General Fitness</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">▼</span>
                    </div>
                  </div>

                  {/* Food Preference */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Food Preference *</label>
                    <div className="relative">
                      <select 
                        value={formData.foodPreference}
                        onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white/80 focus:outline-none focus:border-neon-green/50 appearance-none transition-all cursor-pointer font-semibold"
                      >
                        <option value="Veg" className="bg-deep-black text-white">Veg (Pure Vegetarian)</option>
                        <option value="Non-Veg" className="bg-deep-black text-white">Non-Veg (Egg/Meat)</option>
                        <option value="Eggitarian" className="bg-deep-black text-white">Eggitarian</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">▼</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Phone Number (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs pointer-events-none">+91</span>
                      <input 
                        type="tel" 
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value.replace(/\D/g, "") })}
                        placeholder="10-digit Mobile Number"
                        maxLength={10}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold font-mono"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40">WhatsApp Number *</label>
                      <label className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-neon-green/80 tracking-wider cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={usePhoneAsWhatsApp} 
                          onChange={(e) => setUsePhoneAsWhatsApp(e.target.checked)}
                          className="accent-neon-green w-3.5 h-3.5 rounded bg-black border border-white/10 cursor-pointer"
                        />
                        Same as Phone
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs pointer-events-none">+91</span>
                      <input 
                        type="tel" 
                        value={usePhoneAsWhatsApp ? formData.contactPhone : formData.whatsApp}
                        onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value.replace(/\D/g, "") })}
                        disabled={usePhoneAsWhatsApp}
                        placeholder={usePhoneAsWhatsApp ? "Same as Phone" : "10-digit WhatsApp Number"}
                        maxLength={10}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Plan */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Selected Plan *</label>
                  <div className="relative">
                    <select 
                      value={formData.selectedPlan}
                      onChange={(e) => setFormData({ ...formData, selectedPlan: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white/80 focus:outline-none focus:border-neon-green/50 appearance-none transition-all cursor-pointer font-semibold"
                    >
                      <option value="1 Month Starter Plan" className="bg-deep-black text-white font-semibold">Starter Plan (₹299)</option>
                      <option value="3 Months Transformation Plan" className="bg-deep-black text-white font-semibold">Transformation Plan (₹999)</option>
                      <option value="6 Months Premium Plan" className="bg-deep-black text-white font-semibold">Premium Lifestyle Plan (₹1999)</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">▼</span>
                  </div>
                </div>

                {/* Medical Issue */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 font-mono font-bold">Any Medical Condition / Injury / Past Illness</label>
                  <textarea 
                    value={formData.medicalIssue}
                    onChange={(e) => setFormData({ ...formData, medicalIssue: e.target.value })}
                    placeholder="Describe any medical issues or injuries so we can design a safe workout recommendation (e.g. thyroid, back pain, none)."
                    rows={3}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-neon-green/50 placeholder:text-white/20 transition-all font-semibold"
                  />
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-neon-green text-black font-black uppercase tracking-widest text-xs py-4.5 rounded-xl cursor-pointer hover:bg-white hover:text-black hover:shadow-glow transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>Booking Your Consultation...</>
                  ) : (
                    <>
                      Book Free Consultation <Send className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Health Disclaimer below form */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/45 leading-relaxed tracking-wide uppercase">
                ⚠️ <strong className="text-white/60">Health Disclaimer:</strong> Fitness Mantra provides general fitness and diet guidance. For medical conditions, consult a qualified doctor or dietitian.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
