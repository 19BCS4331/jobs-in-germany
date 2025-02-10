import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, MoreVertical, Pencil, Trash2, Eye, Users, Clock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Job, getJobsByCompany, deleteJob, getCompanyByOwner } from '../../lib/api';
import { toast } from 'react-hot-toast';

const JobsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyAndJobs();
  }, [user]);

  const loadCompanyAndJobs = async () => {
    if (!user || !profile || profile.user_type !== 'employer') return;

    try {
      setIsLoading(true);
      // First get the company
      const company = await getCompanyByOwner(user.id);
      if (!company) {
        toast.error('No company found. Please create a company first.');
        navigate('/dashboard/companies/new');
        return;
      }
      setCompanyId(company.id);
      
      // Then get the jobs for this company
      const jobsData = await getJobsByCompany(company.id);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading company and jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = (job: Job) => {
    setSelectedJob(job);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedJob) return;
    
    try {
      await deleteJob(selectedJob.id);
      toast.success('Job deleted successfully');
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      setShowDeleteConfirm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
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

  // Show loading state
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
            <div className="col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</div>
            <div className="col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</div>
            <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</div>
            <div className="col-span-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="px-6 py-4 grid grid-cols-12 gap-4 hover:bg-gray-50">
                <div className="col-span-4">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.location}</div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                      {job.company?.logo_url ? (
                        <img src={job.company.logo_url} alt={job.company.name} className="h-6 w-6 rounded" />
                      ) : (
                        <Briefcase className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm text-gray-900">{job.company?.name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="text-sm text-gray-900">
                    {job.salary_min && job.salary_max ? (
                      `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                    ) : (
                      'Salary not specified'
                    )}
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
                    {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">0</span>
                  <span className="text-sm text-gray-500">applicants</span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === job.id ? null : job.id)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {showDropdown === job.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu">
                          <button
                            onClick={() => {
                              setShowDropdown(null);
                              handleViewJob(job);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye className="h-4 w-4 mr-3" />
                            View Job Post
                          </button>
                          <button
                            onClick={() => {
                              setShowDropdown(null);
                              handleEditJob(job);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Pencil className="h-4 w-4 mr-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setShowDropdown(null);
                              handleViewApplications(job);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Users className="h-4 w-4 mr-3" />
                            View Applications
                          </button>
                          <button
                            onClick={() => {
                              setShowDropdown(null);
                              handleDeleteJob(job);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
