import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Briefcase, LogOut, User, ChevronDown, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AuthModal from './AuthModal';
import { signOut } from '../lib/auth';
import { useAuth } from '../lib/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      setShowProfileMenu(false);
      toast.success('Signed out successfully', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#4F46E5',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
        },
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
        },
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setShowProfileMenu(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Find Jobs' },
    { path: '/companies', label: 'Companies' },
    { path: '/resources', label: 'Resources' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">JobHub</span>
              </NavLink>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600'
                    } before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-indigo-600 before:transition-transform before:duration-200 hover:before:origin-left hover:before:scale-x-100`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span>{user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSigningOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
      
      {/* Toast Container */}
      <Toaster />
    </nav>
  );
};

export default Navbar;