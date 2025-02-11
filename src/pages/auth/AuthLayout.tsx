import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  const { user } = useAuth();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to home link */}
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <Outlet />
    </div>
  );
}
