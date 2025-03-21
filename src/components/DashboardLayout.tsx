import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Building2, FileText, Settings, BookOpen, BarChart3, Users, User, Menu, X, CreditCard } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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
    { icon: User, label: 'My Profile', path: '/dashboard/my-profile' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  ];

  const sidebarItems = profile?.user_type === 'employer' 
    ? employerSidebarItems 
    : jobSeekerSidebarItems;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg lg:static lg:translate-x-0 lg:inset-0 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 bg-white">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.01, y: -1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="flex items-center space-x-3"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.div>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <motion.div 
          className="mt-14 lg:mt-0 p-4 lg:p-8"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
