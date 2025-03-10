import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Building2, FileText, Settings, BookOpen, BarChart3, Users, User, Menu, X, CreditCard } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const DashboardLayout: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const employerSidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: 'Overview', path: '/dashboard' },
    { icon: Building2, label: 'My Companies', path: '/dashboard/companies/manage' },
    { icon: FileText, label: 'Job Postings', path: '/dashboard/jobs/manage' },
    { icon: Users, label: 'Applications', path: '/dashboard/applications/manage' },
    { icon: User, label: 'Profile', path: '/dashboard/profile-settings' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const jobSeekerSidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: 'Overview', path: '/dashboard' },
    // { icon: FileText, label: 'My Applications', path: '/dashboard/applications' },
    // { icon: BookOpen, label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
    { icon: User, label: 'My Profile', path: '/dashboard/my-profile' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    // { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const sidebarItems = profile?.user_type === 'employer' 
    ? employerSidebarItems 
    : jobSeekerSidebarItems;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-50 lg:hidden z-40"
              onClick={toggleSidebar}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-16 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-40">
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Sidebar */}
        <motion.aside
          className={`
            fixed lg:relative top-16 bottom-0 left-0 w-64 bg-white shadow-lg 
            lg:block lg:top-0 lg:h-[calc(100vh-4rem)]
            transform z-40
          `}
          initial={false}
          animate={{ 
            x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -256,
            opacity: 1 
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div className="h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                <p className="text-sm text-gray-500">
                  {profile?.user_type === 'employer' ? 'Employer Portal' : 'Job Seeker Portal'}
                </p>
              </div>
              <motion.button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            
            <nav className="mt-2">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <motion.div
                    whileHover={{ scale: 1.01, y: -1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="flex items-center space-x-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </NavLink>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <motion.div 
            className="mt-14 lg:mt-0 p-4 lg:p-8"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
