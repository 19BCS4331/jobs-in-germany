import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import NewCompany from './pages/company/New';
import CompanyDashboard from './pages/company/Dashboard';
import { AuthProvider } from './lib/AuthContext';
import { useAuth } from './lib/AuthContext';

// Protected route component
const ProtectedRoute = ({ children, allowedUserType }: { children: React.ReactNode, allowedUserType?: 'employer' | 'job_seeker' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please sign in to access this page.</div>;
  }

  if (allowedUserType && profile?.user_type !== allowedUserType) {
    return <div className="min-h-screen flex items-center justify-center">You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};

function App() {
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
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedUserType="job_seeker">
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/new" 
            element={
              <ProtectedRoute allowedUserType="employer">
                <NewCompany />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedUserType="employer">
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;