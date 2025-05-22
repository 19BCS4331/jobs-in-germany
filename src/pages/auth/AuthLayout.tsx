import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();
  const preventRedirect = localStorage.getItem('preventRedirect') === 'true';

  // If user is already logged in and we're not preventing redirect, redirect to home
  if (user && !preventRedirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
