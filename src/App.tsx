import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/dashboard/Profile";
import NewCompany from "./pages/company/New";
import EditCompany from "./pages/company/Edit";
import DashboardLayout from "./components/DashboardLayout";
import EmployerDashboard from "./pages/dashboard/EmployerDashboard";
import JobSeekerDashboard from "./pages/dashboard/JobSeekerDashboard";
import CompaniesManagement from "./pages/dashboard/CompaniesManagement";
import CompanyForm from "./pages/dashboard/CompanyForm";
import JobsManagement from "./pages/dashboard/JobsManagement";
import JobPostingForm from "./pages/dashboard/JobPostingForm";
import ApplicationsManagement from "./pages/dashboard/ApplicationsManagement";
import MyApplications from "./pages/dashboard/MyApplications";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/dashboard/SavedJobs";
import Settings from "./pages/dashboard/Settings";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import AuthLayout from "./pages/auth/AuthLayout";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

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

// Dashboard index route component
const DashboardIndex = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return profile.user_type === "employer" ? (
    <EmployerDashboard />
  ) : (
    <JobSeekerDashboard />
  );
};

function App() {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname);

  return (
    <AuthProvider>
      <SavedJobsProvider>
        <>
          {!isAuthPage && <Navbar />}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardIndex />} />
              <Route path="profile-settings" element={<ProfileSettings />} />
              <Route path="settings" element={<Settings />} />

              {/* Job seeker routes */}
              <Route
                path="saved-jobs"
                element={
                  <ProtectedRoute allowedUserType="job_seeker">
                    <SavedJobs />
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
        </>
      </SavedJobsProvider>
    </AuthProvider>
  );
}

export default App;
