import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Layout,
  Building2,
  FileText,
  Settings,
  BookOpen,
  BarChart3,
  Users,
  User,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import type { Profile } from "../types/profile";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile");
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const employerSidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: "Overview", path: "/dashboard" },
    {
      icon: Building2,
      label: "My Companies",
      path: "/dashboard/companies/manage",
    },
    { icon: FileText, label: "Job Postings", path: "/dashboard/jobs/manage" },
    {
      icon: Users,
      label: "Applications",
      path: "/dashboard/applications/manage",
    },
    { icon: User, label: "Profile", path: "/dashboard/profile-settings" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const jobSeekerSidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: "Overview", path: "/dashboard" },
    {
      icon: FileText,
      label: "My Applications",
      path: "/dashboard/applications",
    },
    { icon: BookOpen, label: "Saved Jobs", path: "/dashboard/saved-jobs" },
    { icon: User, label: "My Profile", path: "/dashboard/my-profile" },
    { icon: CreditCard, label: "Payments", path: "/dashboard/payments" },
  ];

  const sidebarItems =
    profile?.user_type === "employer"
      ? employerSidebarItems
      : jobSeekerSidebarItems;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:block lg:w-64 bg-white shadow-lg"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 bg-white overflow-y-auto max-h-[calc(100vh-64px)]">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
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
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0">
        <motion.div
          className="mt-14 lg:mt-16 p-4 lg:p-8"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden"
      >
        <nav className="flex justify-around items-center h-20">
          {sidebarItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-500"
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1 text-center">{item.label}</span>
            </NavLink>
          ))}

          {/* More menu for additional items if needed */}
          {sidebarItems.length > 5 && (
            <div className="relative">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex flex-col items-center justify-center py-1 px-3 text-gray-600 hover:text-indigo-500"
              >
                <Menu className="h-6 w-6" />
                <span className="text-xs mt-1">More</span>
              </button>

              {/* Dropdown for additional items */}
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  {sidebarItems.slice(5).map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      end={item.path === "/dashboard"}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-500"
                        }`
                      }
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </motion.div>
              )}

              {/* Overlay to close dropdown */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSidebarOpen(false)}
                ></div>
              )}
            </div>
          )}
        </nav>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
