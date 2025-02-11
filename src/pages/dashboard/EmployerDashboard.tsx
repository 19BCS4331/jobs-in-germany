import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { getCompanyByOwner, getJobsByCompany, getApplicationsByCompany, queryKeys } from '../../lib/api';
import { useQuery } from '@tanstack/react-query';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, color }) => (
  <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
        {icon}
      </div>
    </div>
  </div>
);

const ApplicationsChart: React.FC<{ applications: any[] }> = ({ applications }) => {
  const stats = {
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Applications by Status</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="mt-1 text-2xl font-semibold text-yellow-700">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Reviewing</p>
              <p className="mt-1 text-2xl font-semibold text-blue-700">{stats.reviewing}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Accepted</p>
              <p className="mt-1 text-2xl font-semibold text-green-700">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="mt-1 text-2xl font-semibold text-red-700">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Get company data
  const { data: company } = useQuery({
    queryKey: queryKeys.company.byOwner(user?.id || ''),
    queryFn: () => getCompanyByOwner(user?.id || ''),
    enabled: !!user,
  });

  // Get jobs data
  const { data: jobs = [] } = useQuery({
    queryKey: queryKeys.jobs.byCompany(company?.id || ''),
    queryFn: () => getJobsByCompany(company?.id || ''),
    enabled: !!company,
  });

  // Get applications data
  const { data: applications = [] } = useQuery({
    queryKey: queryKeys.applications.byCompany(company?.id || ''),
    queryFn: () => getApplicationsByCompany(company?.id || ''),
    enabled: !!company,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access the dashboard.</p>
      </div>
    );
  }

  const activeJobs = jobs.length;
  const totalApplications = applications.length;
  const recentApplications = applications.filter(
    app => app.created_at && new Date(app.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {company?.name}
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/dashboard/jobs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post New Job
          </Link>
          <Link
            to="/dashboard/applications/manage"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Applications
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Jobs"
          value={activeJobs}
          icon={<Briefcase className="h-6 w-6 text-blue-600" />}
          description="Currently active job postings"
          color="border-blue-600"
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={<Users className="h-6 w-6 text-green-600" />}
          description="Applications across all jobs"
          color="border-green-600"
        />
        <StatCard
          title="Recent Applications"
          value={recentApplications}
          icon={<Clock className="h-6 w-6 text-purple-600" />}
          description="Applications in the last 7 days"
          color="border-purple-600"
        />
      </div>

      <ApplicationsChart applications={applications} />
    </div>
  );
};

export default EmployerDashboard;
