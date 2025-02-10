import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Building2, User, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { getJobApplications, updateApplicationStatus, getCompanyByOwner, getJobsByCompany, Application } from '../../lib/api';
import { toast } from 'react-hot-toast';
import type { Company, Job } from '../../lib/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
} as const;

const statusIcons = {
  pending: Clock,
  reviewing: AlertCircle,
  accepted: CheckCircle,
  rejected: XCircle,
} as const;

type ApplicationStatus = Application['status'];

const ApplicationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);

  // Load company and jobs only once when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;
      
      try {
        const company = await getCompanyByOwner(user.id);
        if (!company || !company.id) {
          toast.error('No company found. Please create a company first.');
          navigate('/dashboard/companies/new');
          return;
        }

        const jobsData = await getJobsByCompany(company.id);
        setJobs(jobsData);

        // Set the selected job ID from URL params or first job
        const jobIdFromUrl = searchParams.get('jobId');
        const initialJobId = jobIdFromUrl && jobsData.some(job => job.id === jobIdFromUrl)
          ? jobIdFromUrl
          : jobsData.length > 0 ? jobsData[0].id : '';
        
        setSelectedJobId(initialJobId);

        if (initialJobId) {
          const applications = await getJobApplications(initialJobId);
          setApplications(applications);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user, navigate, searchParams]);

  // Load applications when selected job changes
  const handleJobChange = async (jobId: string) => {
    setSelectedJobId(jobId);
    setIsLoading(true);
    try {
      const applications = await getJobApplications(jobId);
      setApplications(applications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage job applications
        </p>
      </div>

      {/* Job Filter */}
      <div className="bg-white p-4 shadow-sm rounded-lg">
        <label htmlFor="job-filter" className="block text-sm font-medium text-gray-700">
          Filter by Job
        </label>
        <select
          id="job-filter"
          value={selectedJobId}
          onChange={(e) => handleJobChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {applications.length === 0 ? (
          <div className="p-6 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedJobId ? 'There are no applications for this job posting yet.' : 'Please select a job to view applications.'}
            </p>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {application.user?.full_name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500">{application.user?.email || 'No email provided'}</p>
                    {application.user?.headline && (
                      <p className="text-sm text-gray-500">{application.user.headline}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                      {React.createElement(statusIcons[application.status], { className: 'mr-1 h-4 w-4' })}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                    <span className="mt-1 text-sm text-gray-500">
                      Applied {application.created_at ? formatDate(application.created_at) : 'Unknown date'}
                    </span>
                  </div>
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Application Details */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {application.job?.title || 'Unknown Job'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  Applied {application.created_at ? formatDate(application.created_at) : 'Unknown date'}
                </div>
                {application.cover_letter && (
                  <div className="sm:col-span-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      Cover Letter
                    </div>
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                      {application.cover_letter}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsManagement;
