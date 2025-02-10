import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Building2, FileText, Settings, BookOpen, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const DashboardLayout: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const employerSidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: 'Overview', path: '/dashboard' },
    { icon: Building2, label: 'My Companies', path: '/dashboard/companies/manage' },
    { icon: FileText, label: 'Job Postings', path: '/dashboard/jobs/manage' },
    { icon: Users, label: 'Applications', path: '/dashboard/applications/manage' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const jobSeekerSidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: 'Overview', path: '/dashboard' },
    { icon: FileText, label: 'My Applications', path: '/dashboard/applications' },
    { icon: BookOpen, label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const sidebarItems = profile?.user_type === 'employer' 
    ? employerSidebarItems 
    : jobSeekerSidebarItems;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)] fixed">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.user_type === 'employer' ? 'Employer Portal' : 'Job Seeker Portal'}
            </p>
          </div>
          <nav className="mt-2">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
