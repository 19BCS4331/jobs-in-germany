import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, TrendingUp, Clock, Briefcase, CheckCircle2, XCircle, Bookmark, Star } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalApplications: number;
  savedJobs: number;
  recommendedJobs: number;
  applicationsByStatus: {
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  };
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`h-4 w-4 ${trend.isPositive ? '' : 'transform rotate-180'}`} />
          <span className="text-sm font-medium">{trend.value}%</span>
        </div>
      )}
    </div>
  </div>
);

function JobSeekerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    savedJobs: 0,
    recommendedJobs: 0,
    applicationsByStatus: {
      pending: 0,
      reviewing: 0,
      accepted: 0,
      rejected: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (applicationsError) throw applicationsError;

      // Get applications by status
      const { data: applicationsByStatus, error: statusError } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', user.id);

      if (statusError) throw statusError;

      // Get saved jobs count
      const { count: savedJobsCount, error: savedJobsError } = await supabase
        .from('saved_jobs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (savedJobsError) throw savedJobsError;

      // Calculate status counts
      const statusCounts = applicationsByStatus.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        totalApplications: applicationsCount || 0,
        savedJobs: savedJobsCount || 0,
        recommendedJobs: 10, // This would ideally come from the recommendations algorithm
        applicationsByStatus: {
          pending: statusCounts.pending || 0,
          reviewing: statusCounts.reviewing || 0,
          accepted: statusCounts.accepted || 0,
          rejected: statusCounts.rejected || 0
        }
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your job search activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Total Applications"
          value={stats.totalApplications}
        />
        <StatCard
          icon={Bookmark}
          label="Saved Jobs"
          value={stats.savedJobs}
        />
        <StatCard
          icon={Star}
          label="Recommended Jobs"
          value={stats.recommendedJobs}
        />
        <StatCard
          icon={CheckCircle2}
          label="Accepted Applications"
          value={stats.applicationsByStatus.accepted}
          trend={{
            value: stats.totalApplications
              ? Math.round((stats.applicationsByStatus.accepted / stats.totalApplications) * 100)
              : 0,
            isPositive: true
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/applications"
            className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <div className="flex items-center space-x-3">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              <span className="font-medium text-gray-900">View Applications</span>
            </div>
            <span className="text-indigo-600">{stats.totalApplications}</span>
          </Link>
          <Link
            to="/dashboard/saved-jobs"
            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">Saved Jobs</span>
            </div>
            <span className="text-blue-600">{stats.savedJobs}</span>
          </Link>
          <Link
            to="/dashboard/recommended-jobs"
            className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
          >
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="font-medium text-gray-900">Recommendations</span>
            </div>
            <span className="text-yellow-600">{stats.recommendedJobs}</span>
          </Link>
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="font-medium text-gray-900">Pending</span>
            </div>
            <span className="text-yellow-600">{stats.applicationsByStatus.pending}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">Reviewing</span>
            </div>
            <span className="text-blue-600">{stats.applicationsByStatus.reviewing}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-900">Accepted</span>
            </div>
            <span className="text-green-600">{stats.applicationsByStatus.accepted}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <span className="font-medium text-gray-900">Rejected</span>
            </div>
            <span className="text-red-600">{stats.applicationsByStatus.rejected}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
