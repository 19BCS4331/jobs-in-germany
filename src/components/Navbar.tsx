import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, LogOut, User, ChevronDown, Loader2, Settings, Building2, Layout, FileText, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { signOut } from '../lib/auth';
import { useAuth } from '../lib/AuthContext';
import logo from '../assets/images/TGJ_NEWEST_NO_BG.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section (100vh - navbar height)
      const scrollThreshold = window.innerHeight - 64; // 64px is navbar height
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll position
    } else {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLandingPage]);

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
    { path: '/how-it-works', label: 'How It Works' },
    // { path: '/resources', label: 'Resources' },
    // { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const profileMenuItems = profile?.user_type === 'employer' ? [
    { icon: Layout, label: 'Dashboard', path: '/dashboard' },
  ] : [
    { icon: Layout, label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isLandingPage && !isScrolled
          ? 'bg-transparent'
          : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <img src={logo} alt="The Germany Jobs Logo" className="h-22 w-24" />
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
                        ? isLandingPage && !isScrolled ? 'text-white' : 'text-indigo-600'
                        : isLandingPage && !isScrolled
                          ? 'text-gray-100 hover:text-white'
                          : 'text-gray-700 hover:text-indigo-600'
                    } before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-current before:transition-transform before:duration-200 hover:before:origin-left hover:before:scale-x-100`
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
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isLandingPage && !isScrolled ? 'bg-white/20' : 'bg-indigo-100'
                  }`}>
                    <User className={`h-5 w-5 ${
                      isLandingPage && !isScrolled ? 'text-white' : 'text-indigo-600'
                    }`} />
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
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'border-white text-white hover:bg-white hover:text-indigo-600'
                      : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                  }`}
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
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors duration-200 ${
                isLandingPage && !isScrolled
                  ? 'text-white hover:text-gray-200 hover:bg-white/10'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
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
                      ? isLandingPage && !isScrolled ? 'text-white' : 'text-indigo-600'
                      : isLandingPage && !isScrolled
                        ? 'text-gray-100 hover:text-white'
                        : 'text-gray-700 hover:text-indigo-600'
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
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-white bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          {user && profile && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isLandingPage && !isScrolled ? 'bg-white/20' : 'bg-indigo-100'
                  }`}>
                    <User className={`h-6 w-6 ${
                      isLandingPage && !isScrolled ? 'text-white' : 'text-indigo-600'
                    }`} />
                  </div>
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${
                    isLandingPage && !isScrolled ? 'text-white' : 'text-gray-800'
                  }`}>
                    {profile && profile.full_name!=='' && profile.full_name!==null ? profile.full_name : user.email?.split('@')[0]}
                  </div>
                  <div className={`text-sm font-medium ${
                    isLandingPage && !isScrolled ? 'text-gray-100' : 'text-gray-500'
                  }`}>{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isLandingPage && !isScrolled
                        ? 'text-white hover:text-gray-200'
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-indigo-600'
                  } disabled:opacity-50`}
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