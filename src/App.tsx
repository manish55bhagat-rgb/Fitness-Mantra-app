/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { motion } from "motion/react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingBackground from "./components/layout/FloatingBackground";
import Programs from "./pages/Programs";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import OnboardingModal from "./components/auth/OnboardingModal";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const Exercises = lazy(() => import("./pages/Exercises"));
const Diet = lazy(() => import("./pages/Diet"));
const BMICalculator = lazy(() => import("./pages/BMICalculator"));
const CalorieCalculator = lazy(() => import("./pages/CalorieCalculator"));
const AISearch = lazy(() => import("./pages/AISearch"));
const Subscription = lazy(() => import("./pages/Subscription"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const WorkoutDetail = lazy(() => import("./pages/WorkoutDetail"));
const PerformancePortal = lazy(() => import("./pages/PerformancePortal"));
const AuthPage = lazy(() => import("./pages/Auth"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const WorkoutPlayer = lazy(() => import("./pages/WorkoutPlayer"));

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === "/ai-assistant";

  return (
    <div className="min-h-screen bg-deep-black text-white selection:bg-neon-green selection:text-black flex flex-col relative overflow-x-hidden">
      <FloatingBackground />
      <Navbar />
      <OnboardingModal />
      <main className="flex-grow pt-20">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(57,255,20,0.3)]"></div>
        </div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={
              <ProtectedRoute>
                <WorkoutDetail />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PerformancePortal />
              </ProtectedRoute>
            } />
            <Route path="/diet" element={
              <ProtectedRoute>
                <Diet />
              </ProtectedRoute>
            } />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/ai-assistant" element={
              <ProtectedRoute>
                <AISearch />
              </ProtectedRoute>
            } />
            <Route path="/programs" element={<Programs />} />
            <Route path="/workout-player" element={
              <ProtectedRoute>
                <WorkoutPlayer />
              </ProtectedRoute>
            } />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
      
      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 100 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[120] group"
      >
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/95 text-neon-green font-black uppercase text-[8px] tracking-[0.25em] px-3 py-2 rounded-xl border border-neon-green/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-2xl backdrop-blur-md hidden sm:block">
          Chat on WhatsApp
        </div>
        <motion.a
          href="https://wa.me/919765690437?text=Hi%20Manish,%20I%20am%20interested%20in%20Fitness%20Mantra%20plans.%20Please%20share%20details."
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="bg-[#25d366] hover:bg-[#20ba5a] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_35px_rgba(37,211,102,0.65)] border border-white/15 transition-all relative overflow-hidden"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-6.5 h-6.5 sm:w-8 sm:h-8 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.37 5.03L2 22l5.135-1.347a9.927 9.927 0 0 0 4.872 1.28c5.506 0 9.984-4.48 9.985-9.986C21.994 6.478 17.513 2 12.012 2zm5.727 14.153c-.25.703-1.442 1.28-1.996 1.344-.555.064-1.127.108-3.567-.847-2.92-1.144-4.787-4.103-4.933-4.296-.146-.192-1.168-1.55-1.168-2.955s.73-2.094.992-2.36c.264-.264.577-.33.77-.33l.551.012c.168.005.39-.063.606.452.222.533.76 1.848.826 1.982.065.132.11.287.021.464-.09.18-.135.29-.27.447L10.3 11.23c-.156.168-.323.352-.138.67.185.318.823 1.353 1.765 2.193.945.842 1.745 1.106 2.053 1.233.308.128.492.11.678-.1.185-.213.77-.898.981-1.22.209-.321.42-.267.71-.158.29.11 1.847.87 2.164 1.026.318.156.528.234.606.368.077.135.077.78-.173 1.483z"/>
          </svg>
        </motion.a>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}