/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingBackground from "./components/layout/FloatingBackground";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const Exercises = lazy(() => import("./pages/Exercises"));
const Diet = lazy(() => import("./pages/Diet"));
const BMICalculator = lazy(() => import("./pages/BMICalculator"));
const CalorieCalculator = lazy(() => import("./pages/CalorieCalculator"));
const AISearch = lazy(() => import("./pages/AISearch"));
const Programs = lazy(() => import("./pages/Programs"));
const Subscription = lazy(() => import("./pages/Subscription"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-deep-black text-white selection:bg-neon-green selection:text-black flex flex-col relative overflow-x-hidden">
        <FloatingBackground />
        <Navbar />
        <main className="flex-grow pt-20">
          <Suspense fallback={<div className="h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-neon-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/diet" element={<Diet />} />
              <Route path="/bmi-calculator" element={<BMICalculator />} />
              <Route path="/calorie-calculator" element={<CalorieCalculator />} />
              <Route path="/ai-assistant" element={<AISearch />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
