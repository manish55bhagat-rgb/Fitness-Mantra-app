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
