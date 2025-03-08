import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import AuthLayout from "./pages/auth/AuthLayout";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import ResumeUpload from "./pages/dashboard/ResumeUpload";
import Payment from "./pages/dashboard/Payment";
import ScrollToTop from "./components/ScrollToTop";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
    }
  }, [loading]);

  if (loading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <>
          <ScrollToTop />
          {!isAuthPage && <Navbar />}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <Home />
                    <Footer />
                  </motion.div>
                }
              />
              <Route
                path="/how-it-works"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <HowItWorks />
                    <Footer />
                  </motion.div>
                }
              />
              <Route
                path="/contact"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <Contact />
                    <Footer />
                  </motion.div>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <PrivacyPolicy />
                    <Footer />
                  </motion.div>
                }
              />
              <Route
                path="/terms-of-service"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <TermsOfService />
                    <Footer />
                  </motion.div>
                }
              />

              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>

              {/* Protected routes */}
              <Route
                path="/dashboard/resume"
                element={
                  <ProtectedRoute>
                    <ResumeUpload />
                    <Footer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                    <Footer />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </>
      </AuthProvider>
    </div>
  );
}

export default App;
