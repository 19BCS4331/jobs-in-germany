import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Building2, User, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { getJobApplications, updateApplicationStatus, getCompanyByOwner, getJobsByCompany, getApplicationsByJob, getApplicationsByCompany, Application, Job, queryKeys } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Select from '../../components/forms/Select';

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ApplicationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const jobId = searchParams.get('jobId') || '';

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
  const { data: applications = [], isLoading } = useQuery({
    queryKey: jobId ? queryKeys.applications.byJob(jobId) : queryKeys.applications.byCompany(company?.id || ''),
    queryFn: () => jobId ? getApplicationsByJob(jobId) : getApplicationsByCompany(company?.id || ''),
    enabled: !!company,
  });

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(applicationId, newStatus as any);
      // Invalidate applications query to refetch
      queryClient.invalidateQueries({ 
        queryKey: jobId ? queryKeys.applications.byJob(jobId) : queryKeys.applications.byCompany(company?.id || '')
      });
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleJobChange = (newJobId: string) => {
    if (newJobId) {
      navigate(`/dashboard/applications/manage?jobId=${newJobId}`);
    } else {
      navigate('/dashboard/applications/manage');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
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
        <Select
          label="Filter by Job"
          id="job-filter"
          value={jobId}
          onChange={(e) => handleJobChange(e.target.value)}
          options={[
            { value: '', label: 'All Jobs' },
            ...jobs.map((job) => ({
              value: job.id,
              label: job.title
            }))
          ]}
        />
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {applications.length === 0 ? (
          <div className="p-6 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {jobId ? 'There are no applications for this job posting yet.' : 'Please select a job to view applications.'}
            </p>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {application.job?.company?.logo_url ? (
                      <img
                        src={application.job.company.logo_url}
                        alt={`${application.job.company.name} logo`}
                        className="h-10 w-10 rounded-full object-contain bg-white"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {application.job?.title || 'Unknown Job'}
                    </h3>
                    <p className="text-sm text-gray-500">{application.job?.company?.name || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Status Dropdown */}
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
                    className={`rounded-full text-xs font-medium px-3 py-1 ${statusColors[application.status]}`}
                  >
                    {Object.keys(statusColors).map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Application Details */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {application.user?.full_name || 'Unknown User'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  Applied {application.created_at ? formatDate(application.created_at) : 'Unknown date'}
                </div>
                {application.user?.resume_url && (
                  <div className="flex items-center text-sm">
                    <a
                      href={application.user.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                    >
                      <FileText className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      View Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {application.cover_letter && (
                <div className="mt-4">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Cover Letter
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Cover Letter Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedApplication(null)} />
            
            {/* Modal panel */}
            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-middle shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Cover Letter
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 whitespace-pre-wrap">
                      {selectedApplication.cover_letter}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;
