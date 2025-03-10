import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';
import { GraduationCap, Globe2, FileCheck, Building2 } from 'lucide-react';

interface StepCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
}

const StepCard: React.FC<StepCardProps> = ({ icon: Icon, title, description, status }) => {
  const statusColors = {
    'completed': 'bg-green-50 text-green-700 border-green-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'pending': 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const statusText = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusText[status]}
        </span>
      </div>
    </motion.div>
  );
};

const ResourceCard: React.FC<{ title: string; description: string; link: string }> = ({ title, description, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.01, y: -1 }}
    transition={{ type: "spring", stiffness: 200, damping: 25 }}
    className="block bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:border-indigo-200"
  >
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </motion.a>
);

const Overview: React.FC = () => {
  const { profile } = useAuth();

  const germanLevelToStatus = (level?: string) => {
    if (!level) return 'pending';
    return ['B1', 'B2', 'C1', 'C2'].includes(level) ? 'completed' : 'in-progress';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {profile?.first_name || 'there'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Track your progress towards your goal of working in Germany. Complete these steps to increase your chances of success.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StepCard
          icon={GraduationCap}
          title="German Language Proficiency"
          description="Achieve at least B1 level German proficiency"
          status={germanLevelToStatus(profile?.german_level)}
        />
        <StepCard
          icon={FileCheck}
          title="Document Preparation"
          description="Prepare and verify all required documents"
          status="pending"
        />
        <StepCard
          icon={Building2}
          title="Job Search"
          description="Search and apply for jobs matching your profile"
          status="in-progress"
        />
        <StepCard
          icon={Globe2}
          title="Visa Application"
          description="Apply for the appropriate work visa"
          status="pending"
        />
      </div>

      {/* Useful Resources */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Useful Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard
            title="Make it in Germany"
            description="Official portal for qualified professionals - find jobs, understand visa requirements, and more."
            link="https://www.make-it-in-germany.com/"
          />
          <ResourceCard
            title="Recognition in Germany"
            description="Information portal for foreign professional qualifications recognition."
            link="https://www.anerkennung-in-deutschland.de/en/"
          />
          <ResourceCard
            title="German Visa Requirements"
            description="Comprehensive guide to German work visa requirements and application process."
            link="https://www.germany-visa.org/"
          />
          <ResourceCard
            title="Learn German Online"
            description="Free online German courses from beginner to advanced levels."
            link="https://www.dw.com/en/learn-german/s-2469"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium">German Level</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-900">{profile?.german_level || 'Not Set'}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Profile Completion</p>
            <p className="mt-1 text-2xl font-semibold text-green-900">75%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Documents Ready</p>
            <p className="mt-1 text-2xl font-semibold text-purple-900">2/5</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Next Step</p>
            <p className="mt-1 text-lg font-semibold text-orange-900">Language Test</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
