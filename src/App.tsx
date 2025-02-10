import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import NewCompany from './pages/company/New';
import DashboardLayout from './components/DashboardLayout';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard';
import CompaniesManagement from './pages/dashboard/CompaniesManagement';
import CompanyForm from './pages/dashboard/CompanyForm';
import JobsManagement from './pages/dashboard/JobsManagement';
import JobPostingForm from './pages/dashboard/JobPostingForm';
import ApplicationsManagement from './pages/dashboard/ApplicationsManagement';
import MyApplications from './pages/dashboard/MyApplications';
import { AuthProvider } from './lib/AuthContext';
import { useAuth } from './lib/AuthContext';

// Protected route component
const ProtectedRoute = ({ children, allowedUserType }: { children: React.ReactNode, allowedUserType?: 'employer' | 'job_seeker' }) => {
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
    return <div className="min-h-screen flex items-center justify-center">Please sign in to access this page.</div>;
  }

  // Only check user type if profile is loaded and we have an allowed type
  if (profile && allowedUserType && profile.user_type !== allowedUserType) {
    return <div className="min-h-screen flex items-center justify-center">You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};

function App() {
  const { profile } = useAuth();

  return (
    <AuthProvider>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/company/new" element={<ProtectedRoute allowedUserType="employer"><NewCompany /></ProtectedRoute>} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                profile?.user_type === 'employer' ? (
                  <EmployerDashboard />
                ) : (
                  <JobSeekerDashboard />
                )
              }
            />
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
              path="companies/:id/edit" 
              element={
                <ProtectedRoute allowedUserType="employer">
                  <CompanyForm />
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
              path="jobs/:jobId/edit" 
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
            <Route 
              path="applications" 
              element={
                <ProtectedRoute allowedUserType="job_seeker">
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
            <Route path="saved-jobs" element={<ProtectedRoute allowedUserType="job_seeker"><div>Saved Jobs</div></ProtectedRoute>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;