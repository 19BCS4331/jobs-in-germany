import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Briefcase, LogOut, User, ChevronDown, Loader2, Settings, Building2, Layout, FileText, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { signOut } from '../lib/auth';
import { useAuth } from '../lib/AuthContext';
import logo from '../assets/images/TGJ_NEWEST_NO_BG.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      navigate('/');
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
    { path: '/contact', label: 'Contact Us' },
  ];

  const profileMenuItems = profile?.user_type === 'employer' ? [
    { icon: Layout, label: 'Dashboard', path: '/dashboard' },
  ] : [
    { icon: Layout, label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
              <img src={logo} alt="The Germany Jobs Logo" className="h-22 w-24" />
                {/* <span className="text-xl font-bold text-gray-900">JobHub</span> */}
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span>{profile && profile.full_name!=='' && profile.full_name!==null ? profile.full_name : user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                    <div className="py-1">
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2 transition-colors duration-200"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="py-1">
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
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Get Started
                </Link>
              </div>
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
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  } transition-colors duration-200`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {!user && (
              <>
                <Link
                  to="/signin"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {profile && profile.full_name!=='' && profile.full_name!==null ? profile.full_name : user.email?.split('@')[0]}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 disabled:opacity-50"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;