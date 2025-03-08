import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown, Loader2, FileText, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { signOut } from '../lib/auth';
import { useAuth } from '../lib/AuthContext';
import logo from '../assets/images/TGJ_NEWEST_NO_BG.png';
import { motion } from 'framer-motion';

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
      const scrollThreshold = window.innerHeight - 64;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
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
    { path: '/contact', label: 'Contact Us' },
  ];

  const profileMenuItems = [
    { icon: FileText, label: 'Resume Upload', path: '/dashboard/resume' },
    { icon: CreditCard, label: 'Premium Access', path: '/dashboard/payment' },
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
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isLandingPage && !isScrolled ? 'bg-white/20' : 'bg-indigo-100'
                  }`}>
                    <User className={`h-5 w-5 ${
                      isLandingPage && !isScrolled ? 'text-white' : 'text-indigo-600'
                    }`} />
                  </div>
                  <span>{profile?.full_name || user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </motion.button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/5 divide-y divide-gray-100"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <div className="py-1">
                      {profileMenuItems.map((item) => (
                        <motion.button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center space-x-2 transition-colors duration-200"
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                    <div className="py-1">
                      <motion.button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isSigningOut ? { x: 2 } : {}}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      >
                        {isSigningOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => navigate('/signin')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isLandingPage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  Sign in
                </motion.button>
                <motion.button
                  onClick={() => navigate('/signup')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    isLandingPage && !isScrolled
                      ? 'border-white text-white hover:bg-white hover:text-indigo-600'
                      : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  Sign up
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isLandingPage && !isScrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <>
                {profileMenuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                ))}
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSigningOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <button
                  onClick={() => {
                    navigate('/signin');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;