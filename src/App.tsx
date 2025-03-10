import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import AuthLayout from "./pages/auth/AuthLayout";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import ScrollToTop from "./components/ScrollToTop";
import DashboardLayout from "./components/DashboardLayout";
import JobSeekerProfile from "./pages/dashboard/JobSeekerProfile";
import PaymentPage from "./pages/dashboard/PaymentPage";
import Overview from "./pages/dashboard/Overview";
import { Toaster } from 'react-hot-toast';

// Protected route component
const ProtectedRoute = ({
  children,
  allowedUserType,
}: {
  children: React.ReactNode;
  allowedUserType?: "employer" | "job_seeker";
}) => {
  const { user, profile, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Wait a bit for the profile to be loaded after signup
    if (user && !profile) {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000); // Give it a second to load the profile
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
    }
  }, [user, profile]);

  if (loading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Only check user type if profile is loaded and we have an allowed type
  if (profile && allowedUserType && profile.user_type !== allowedUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        You don't have permission to access this page.
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname);
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <>
          <ScrollToTop />
          {!isAuthPage && <Navbar />}
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <>
                  <HowItWorks />
                  <Footer />
                </>
              }
            />
            <Route
              path="/resources"
              element={
                <>
                  <Resources />
                  <Footer />
                </>
              }
            />
            <Route
              path="/blog"
              element={
                <>
                  <Blog />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Contact />
                  <Footer />
                </>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <>
                  <PrivacyPolicy />
                  <Footer />
                </>
              }
            />
            <Route
              path="/terms-of-service"
              element={
                <>
                  <TermsOfService />
                  <Footer />
                </>
              }
            />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Job Seeker Routes */}
              <Route
                path=""
                element={
                  <ProtectedRoute allowedUserType="job_seeker">
                    <Overview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="applications"
                element={
                  <ProtectedRoute allowedUserType="job_seeker">
                    <div>My Applications</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="saved-jobs"
                element={
                  <ProtectedRoute allowedUserType="job_seeker">
                    <div>Saved Jobs</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-profile"
                element={
                  <ProtectedRoute allowedUserType="job_seeker">
                    <JobSeekerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payments"
                element={
                  <ProtectedRoute allowedUserType="job_seeker">
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />

              {/* Employer Routes */}
              <Route
                path="companies/manage"
                element={
                  <ProtectedRoute allowedUserType="employer">
                    <div>Manage Companies</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="jobs/manage"
                element={
                  <ProtectedRoute allowedUserType="employer">
                    <div>Manage Job Postings</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="applications/manage"
                element={
                  <ProtectedRoute allowedUserType="employer">
                    <div>Manage Applications</div>
                  </ProtectedRoute>
                }
              />

              {/* Common Routes */}
              <Route
                path="profile-settings"
                element={
                  <ProtectedRoute>
                    <div>Profile Settings</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <div>Account Settings</div>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!isDashboardPage && !isAuthPage && <Footer />}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
              success: {
                iconTheme: {
                  primary: '#4F46E5',
                  secondary: '#fff',
                },
              },
            }}
          />
        </>
      </AuthProvider>
    </div>
  );
}

export default App;
