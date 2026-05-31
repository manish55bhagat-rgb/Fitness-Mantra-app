import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Activity, User, Globe, LogOut, Crown, Sparkles, UserCheck, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useLanguage, Language } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", key: "Nav.Home", path: "/" },
  { name: "Dashboard", key: "Nav.Dashboard", path: "/dashboard" },
  { name: "Programs", key: "Nav.Programs", path: "/programs" },
  { name: "Exercises", key: "Nav.Exercises", path: "/exercises" },
  { name: "Diet Plans", key: "Nav.Diet", path: "/diet" },
  { name: "BMI Calc", key: "Nav.BMICalc", path: "/bmi-calculator" },
  { name: "Calorie Calc", key: "Nav.CalorieCalc", path: "/calorie-calculator" },
  { name: "AI Coach", key: "Nav.AICoach", path: "/ai-assistant" },
  { name: "FAQ", key: "Nav.FAQ", path: "/faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, logOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogActive = async () => {
    try {
      await logOut();
      setDropdownOpen(false);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const getSubBadgeStyles = () => {
    if (!profile) return "bg-white/10 text-white/40 border-white/5";
    const status = profile.subscriptionStatus;
    if (status === "Architect Elite" || status === "Premium Plan") {
      return "bg-neon-green/10 text-neon-green border-neon-green/20 shadow-[0_0_10px_rgba(57,255,20,0.15)]";
    }
    if (status === "Performance Pro" || status === "Pro Plan") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
    return "bg-white/5 text-white/40 border-white/10";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="glass-panel !rounded-[24px] border-white/10 px-8 h-20 flex items-center justify-between backdrop-blur-2xl bg-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.4)]">
              <Activity className="text-black w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white group-hover:text-neon-green transition-colors leading-none uppercase italic">
                FITNESS MANTRA
              </span>
              <span className="text-[7px] uppercase tracking-[0.4em] text-white/20 font-black mt-1 leading-none italic font-mono">
                {t("Home.HeroSub")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[9px] font-black uppercase tracking-[0.25em] transition-all relative py-2 group/link",
                  location.pathname === link.path ? "text-neon-green" : "text-white/40 hover:text-white"
                )}
              >
                {t(link.key)}
                <motion.div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green rounded-full shadow-glow",
                    location.pathname === link.path ? "opacity-100" : "opacity-0 group-hover/link:opacity-50"
                  )}
                  layoutId="nav-glow"
                />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl hover:border-white/25 transition-all px-3 py-1.5 gap-1.5">
              <Globe className="w-3.5 h-3.5 text-white/40" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white/80 select-none text-[8px] font-black tracking-widest uppercase cursor-pointer outline-none border-none py-1 pr-4 appearance-none"
              >
                <option value="en" className="bg-deep-black text-white py-2">EN</option>
                <option value="hi" className="bg-deep-black text-white py-2">हिंदी</option>
                <option value="mr" className="bg-deep-black text-white py-2">मराठी</option>
              </select>
              <span className="absolute right-2 text-[6px] text-white/40 pointer-events-none">▼</span>
            </div>

            <Link to="/subscription" className="btn-premium !px-4 !py-2.5 !rounded-xl !text-[8px] !tracking-[0.1em]">
               {t("Nav.EliteAccess")}
            </Link>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                >
                  {profile?.photoUrl ? (
                    <img 
                      src={profile.photoUrl} 
                      alt="avatar" 
                      className="w-5 h-5 rounded-full object-cover border border-neon-green/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-neon-green text-black rounded-full flex items-center justify-center font-black text-[10px]">
                      {profile?.fullName?.substring(0, 1).toUpperCase() || "M"}
                    </div>
                  )}
                  <span className="text-[8px] font-black uppercase text-white/80 tracking-widest truncate max-w-[80px]">
                    {profile?.fullName?.split(" ")[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-3 w-56 glass-panel border-white/10 bg-deep-black/95 p-4 rounded-2xl shadow-[0_20px_35px_rgba(0,0,0,0.7)] flex flex-col gap-3"
                    >
                      <div className="pb-3 border-b border-white/5">
                        <div className="text-[10px] font-black truncate text-white">{profile?.fullName}</div>
                        <div className="text-[8px] font-black truncate text-white/30 lowercase mt-1 font-mono">{profile?.email}</div>
                        
                        <div className={cn(
                          "mt-2 text-[7px] font-black uppercase tracking-wider text-center py-1 px-2 border rounded-md inline-block",
                          getSubBadgeStyles()
                        )}>
                          {
                            profile?.subscriptionStatus === "Architect Elite" || profile?.subscriptionStatus === "Premium Plan" 
                              ? "Premium" 
                              : profile?.subscriptionStatus === "Performance Pro" || profile?.subscriptionStatus === "Pro Plan"
                                ? "Pro"
                                : "Free"
                          } Member
                        </div>
                      </div>

                      <Link 
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 hover:bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-neon-green" />
                        Bio Dashboard
                      </Link>

                      {profile?.role === "admin" && (
                        <Link 
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 py-2 px-3 hover:bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-all font-mono"
                        >
                          <Shield className="w-3.5 h-3.5 text-amber-500" />
                          Admin Panel
                        </Link>
                      )}

                      <button 
                        onClick={handleLogActive}
                        className="flex items-center gap-3 py-2 px-3 hover:bg-red-500/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-all text-left w-full cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Gate Logoff
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[8px] font-black uppercase tracking-widest text-white/60">
                <User className="w-3 h-3" /> {t("Nav.SignIn")}
              </Link>
            )}
          </div>

          {/* Mobile menu button & selector */}
          <div className="lg:hidden flex items-center gap-4">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 gap-1">
              <Globe className="w-3 h-3 text-white/40" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white/80 text-[8px] font-black tracking-widest uppercase cursor-pointer outline-none border-none pr-3 appearance-none"
              >
                <option value="en" className="bg-deep-black text-white">EN</option>
                <option value="hi" className="bg-deep-black text-white">HI</option>
                <option value="mr" className="bg-deep-black text-white">MR</option>
              </select>
              <span className="absolute right-1 text-[5px] text-white/40 pointer-events-none">▼</span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-neon-green p-2 transition-colors"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-deep-black/95 backdrop-blur-3xl z-[150] lg:hidden p-12 flex flex-col items-center justify-center text-center"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-12 right-12 text-white/40 hover:text-white">
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-6 md:gap-8 max-h-[80vh] overflow-y-auto w-full py-4 px-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-3xl md:text-4xl font-display font-black uppercase tracking-tighter transition-all hover:italic",
                      location.pathname === link.path ? "text-neon-green" : "text-white/40"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex flex-col gap-4 max-w-xs mx-auto w-full"
              >
                <Link to="/subscription" onClick={() => setIsOpen(false)} className="btn-premium px-12 py-4 w-full text-center">
                  {t("Nav.EliteAccess")}
                </Link>
                {user ? (
                  <button 
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center justify-center gap-2 px-12 py-4 bg-white/5 border border-white/10 rounded-xl text-red-400 font-black uppercase text-[10px] tracking-widest cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Gate Logoff
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-center gap-2 px-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white/80 font-black uppercase text-[10px] tracking-widest"
                  >
                    <User className="w-4 h-4" /> {t("Nav.SignIn")}
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
