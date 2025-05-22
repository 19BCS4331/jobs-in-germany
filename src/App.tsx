import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
// import Overview from "./pages/dashboard/Overview";
import { Toaster } from "react-hot-toast";
import SavedJobs from "./pages/dashboard/SavedJobs";
import ApplicationsManagement from "./pages/dashboard/ApplicationsManagement";
import JobsManagement from "./pages/dashboard/JobsManagement";
import MyApplications from "./pages/dashboard/MyApplications";
import JobSeekerDashboard from "./pages/dashboard/JobSeekerDashboard";
import EmployerDashboard from "./pages/dashboard/EmployerDashboard";
import { Profile } from "./types/profile";
// import Companies from "./pages/Companies";
import CompaniesManagement from "./pages/dashboard/CompaniesManagement";
import ProfileSettings from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Jobs from "./pages/Jobs";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import JobDetails from "./pages/JobDetails";
import CompanyForm from "./pages/dashboard/CompanyForm";
import EditCompany from "./pages/company/Edit";
import JobPostingForm from "./pages/dashboard/JobPostingForm";
import NewCompany from "./pages/company/New";
import LearnGerman from "./pages/LearnGerman";

// Protected route component
const ProtectedRoute = ({
  children,
  allowedUserType,
}: {
  children:
    | React.ReactNode
    | ((props: { profile: Profile | null }) => React.ReactNode);
  allowedUserType?: "job_seeker" | "employer";
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/signin");
    return null;
  }

  if (allowedUserType && profile?.user_type !== allowedUserType) {
    return (
      <div>Access denied. You don't have permission to view this page.</div>
    );
  }

  return typeof children === "function" ? children({ profile }) : children;
};

function App() {
  const location = useLocation();
  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <SavedJobsProvider>
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
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/how-it-works"
                element={
                  <>
                    <HowItWorks />
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/resources"
                element={
                  <>
                    <Resources />
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/blog"
                element={
                  <>
                    <Blog />
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/contact"
                element={
                  <>
                    <Contact />
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/learn-german"
                element={
                  <>
                    <LearnGerman />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <>
                    <PrivacyPolicy />
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/terms-of-service"
                element={
                  <>
                    <TermsOfService />
                    {/* <Footer /> */}
                  </>
                }
              />

              <Route
                path="/jobs"
                element={
                  <>
                    <Jobs />
                    {/* <Footer /> */}
                  </>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <>
                    <JobDetails />
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
                {/* Root Dashboard Route - Conditionally renders based on user type */}
                <Route
                  path=""
                  element={
                    <ProtectedRoute>
                      {({ profile }) =>
                        profile?.user_type === "employer" ? (
                          <EmployerDashboard />
                        ) : (
                          <JobSeekerDashboard />
                        )
                      }
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="applications"
                  element={
                    <ProtectedRoute allowedUserType="job_seeker">
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="saved-jobs"
                  element={
                    <ProtectedRoute allowedUserType="job_seeker">
                      <SavedJobs />
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

                {/* Employer routes */}
                <Route
                  path="companies/manage"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <CompaniesManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="companies/new"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <CompanyForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="companies/edit/:id"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <EditCompany />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="jobs/manage"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <JobsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="jobs/new"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <JobPostingForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="jobs/:id/edit"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <JobPostingForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="applications/manage"
                  element={
                    <ProtectedRoute allowedUserType="employer">
                      <ApplicationsManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Common Routes */}
                <Route
                  path="profile-settings"
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Company management routes */}
              <Route
                path="/company/new"
                element={
                  <ProtectedRoute allowedUserType="employer">
                    <NewCompany />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {!isDashboardPage && !isAuthPage && <Footer />}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#333",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                },
                success: {
                  iconTheme: {
                    primary: "#4F46E5",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </>
        </SavedJobsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
