/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
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
const WorkoutDetail = lazy(() => import("./pages/WorkoutDetail"));
const PerformancePortal = lazy(() => import("./pages/PerformancePortal"));
const AuthPage = lazy(() => import("./pages/Auth"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}

      {/* Floating WhatsApp Support Button */}
      <a 
        href="https://wa.me/919765690437?text=Hi%20Manish%2C%20I%20want%20a%20Fitness%20Mantra%20plan.%20My%20goal%20is%20fat%20loss%2Fmuscle%20gain." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 group flex items-center justify-center border border-emerald-400"
        aria-label="Chat on WhatsApp"
        id="whatsapp-floating-button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.707 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-300 font-extrabold text-[10px] uppercase tracking-wider whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>
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
