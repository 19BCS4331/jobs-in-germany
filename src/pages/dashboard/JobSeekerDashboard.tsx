import React from 'react';
import { FileText, BookOpen, TrendingUp, Clock, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

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

interface ApplicationCardProps {
  company: string;
  position: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interviewing';
  appliedDate: string;
  logo?: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ company, position, status, appliedDate, logo }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    interviewing: 'bg-blue-100 text-blue-800',
  };

  const statusIcons = {
    pending: Clock,
    accepted: CheckCircle2,
    rejected: XCircle,
    interviewing: Briefcase,
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
          {logo ? (
            <img src={logo} alt={company} className="h-8 w-8 rounded" />
          ) : (
            <Briefcase className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">{position}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
              <StatusIcon className="h-3.5 w-3.5 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{company}</p>
          <p className="mt-1 text-xs text-gray-400">Applied on {appliedDate}</p>
        </div>
      </div>
    </div>
  );
};

interface JobCardProps {
  company: string;
  position: string;
  location: string;
  salary?: string;
  postedDate: string;
  logo?: string;
}

const JobCard: React.FC<JobCardProps> = ({ company, position, location, salary, postedDate, logo }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-start space-x-4">
      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
        {logo ? (
          <img src={logo} alt={company} className="h-8 w-8 rounded" />
        ) : (
          <Briefcase className="h-6 w-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900">{position}</h3>
        <p className="mt-1 text-sm text-gray-500">{company}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <div className="flex items-center">
            <span>{location}</span>
            {salary && (
              <>
                <span className="mx-2">•</span>
                <span>{salary}</span>
              </>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-400">Posted {postedDate}</p>
      </div>
    </div>
  </div>
);

const JobSeekerDashboard: React.FC = () => {
  const { profile } = useAuth();

  // Temporary mock data
  const stats = [
    { icon: FileText, label: 'Total Applications', value: 12, trend: { value: 20, isPositive: true } },
    { icon: BookOpen, label: 'Saved Jobs', value: 8 },
    { icon: CheckCircle2, label: 'Interviews Scheduled', value: 2, trend: { value: 100, isPositive: true } },
    { icon: Clock, label: 'Pending Reviews', value: 5 },
  ];

  const recentApplications = [
    {
      company: 'TechCorp GmbH',
      position: 'Senior Frontend Developer',
      status: 'interviewing' as const,
      appliedDate: '2024-02-01',
    },
    {
      company: 'Digital Solutions AG',
      position: 'Full Stack Developer',
      status: 'pending' as const,
      appliedDate: '2024-02-05',
    },
    {
      company: 'Cloud Systems',
      position: 'DevOps Engineer',
      status: 'accepted' as const,
      appliedDate: '2024-01-28',
    },
  ];

  const recommendedJobs = [
    {
      company: 'Innovation Labs',
      position: 'React Developer',
      location: 'Berlin',
      salary: '€65,000 - €85,000',
      postedDate: '2 days ago',
    },
    {
      company: 'Future Tech GmbH',
      position: 'Senior Frontend Engineer',
      location: 'Munich',
      salary: '€70,000 - €90,000',
      postedDate: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h1>
        <p className="mt-1 text-sm text-gray-500">Here's an overview of your job search progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
          <div className="space-y-4">
            {recentApplications.map((application, index) => (
              <ApplicationCard key={index} {...application} />
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Recommended Jobs</h2>
          <div className="space-y-4">
            {recommendedJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
