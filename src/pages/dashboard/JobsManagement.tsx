import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, MoreVertical, PencilIcon, TrashIcon, Eye, Users, Clock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Job, deleteJob, getCompanyByOwner, getJobsByCompany, queryKeys } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const JobsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Get company data
  const { data: company } = useQuery({
    queryKey: queryKeys.company.byOwner(user?.id || ''),
    queryFn: () => getCompanyByOwner(user?.id || ''),
    enabled: !!user,
  });

  // Get jobs data
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: queryKeys.jobs.byCompany(company?.id || ''),
    queryFn: () => getJobsByCompany(company?.id || ''),
    enabled: !!company,
  });

  const handleDeleteJob = async (jobId: string) => {
    const job = jobs.find(job => job.id === jobId);
    setSelectedJob(job || null);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedJob) return;
    
    try {
      setIsDeleting(true);
      await deleteJob(selectedJob.id);
      // Invalidate jobs query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.byCompany(company?.id || '') });
      toast.success('Job deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditJob = (job: Job) => {
    navigate(`/dashboard/jobs/${job.id}/edit`);
  };

  const handleViewJob = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleViewApplications = (job: Job) => {
    navigate(`/dashboard/applications/manage?job=${job.id}`);
  };

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-purple-100 text-purple-800';
      case 'contract':
        return 'bg-orange-100 text-orange-800';
      case 'internship':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Show message if user is not an employer
  if (profile?.user_type !== 'employer') {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">Only employers can access the jobs management page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your job postings
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/jobs/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </button>
      </div>

      {/* Jobs List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4">
            <div className="col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title And Company</div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</div>
            <div className="col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</div>
            <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</div>
            <div className="col-span-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="px-6 py-4 grid grid-cols-12 gap-4 hover:bg-gray-50">
                <div className="col-span-4">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.company?.name || 'Company Name Not Available'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-900">{job.location}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-900">{job.type}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-sm text-gray-900">
                    {job.salary_min && job.salary_max
                      ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                      : 'Not specified'}
                  </div>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <button
                    onClick={() => navigate(`/dashboard/applications/manage?jobId=${job.id}`)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span>{job.applications_count || 0} Applications</span>
                  </button>
                </div>
                <div className="col-span-1 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No job postings</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/jobs/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedJob(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default JobsManagement;
