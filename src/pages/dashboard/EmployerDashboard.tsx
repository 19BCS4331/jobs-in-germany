import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Building2, Users } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import JobsManagement from './JobsManagement';
import ApplicationsManagement from './ApplicationsManagement';
import CompaniesManagement from './CompaniesManagement';

type TabType = 'jobs' | 'applications' | 'companies';

interface TabProps {
  type: TabType;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: (type: TabType) => void;
}

const Tab: React.FC<TabProps> = ({ type, label, count, isActive, onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'jobs':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'applications':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'companies':
        return <Building2 className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <button
      onClick={() => onClick(type)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        isActive
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {getIcon()}
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {count}
        </span>
      )}
    </button>
  );
};

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('jobs');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'jobs':
        return <JobsManagement />;
      case 'applications':
        return <ApplicationsManagement />;
      case 'companies':
        return <CompaniesManagement />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
        <Link
          to="/dashboard/jobs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Post New Job
        </Link>
      </div>

      <div className="flex space-x-4 mb-6">
        <Tab
          type="jobs"
          label="Jobs"
          isActive={activeTab === 'jobs'}
          onClick={setActiveTab}
        />
        <Tab
          type="applications"
          label="Applications"
          isActive={activeTab === 'applications'}
          onClick={setActiveTab}
        />
        <Tab
          type="companies"
          label="Companies"
          isActive={activeTab === 'companies'}
          onClick={setActiveTab}
        />
      </div>

      {renderContent()}
    </div>
  );
};

export default EmployerDashboard;
