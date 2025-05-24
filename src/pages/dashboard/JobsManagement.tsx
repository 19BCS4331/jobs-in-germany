import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  PencilIcon,
  TrashIcon,
  Eye,
  Users,
  Clock,
  Loader2,
  Trash,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Job,
  deleteJob,
  getCompanyByOwner,
  getDeletedJobsByCompany,
  getJobsByCompany,
  queryKeys,
  restoreJob,
} from "../../lib/api";
import { toast } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const JobsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Get company data
  const { data: company } = useQuery({
    queryKey: queryKeys.company.byOwner(user?.id || ""),
    queryFn: () => getCompanyByOwner(user?.id || ""),
    enabled: !!user,
  });

  // Get jobs data
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: queryKeys.jobs.byCompany(company?.id || ""),
    queryFn: () => getJobsByCompany(company?.id || ""),
    enabled: !!company,
  });

  // Update your query to only fetch deleted jobs when showDeleted is true
  const { data: deletedJobs = [], isLoading: isDeletedLoading } = useQuery({
    queryKey: queryKeys.deletedJobs.byCompany(company?.id || ""),
    queryFn: () => getDeletedJobsByCompany(company?.id || ""),
    enabled: !!company && showDeleted, // Only fetch when company exists AND showDeleted is true
  });

  // Then update your button click handler to trigger a refetch
  const handleShowDeletedJobs = () => {
    setShowDeleted(true);
    // If you want to ensure fresh data when switching to deleted jobs view
    queryClient.invalidateQueries({
      queryKey: queryKeys.deletedJobs.byCompany(company?.id || ""),
    });
  };

  // Then update your button click handler to trigger a refetch
  const handleShowActiveJobs = () => {
    setShowDeleted(false);
    // If you want to ensure fresh data when switching to deleted jobs view
    queryClient.invalidateQueries({
      queryKey: queryKeys.jobs.byCompany(company?.id || ""),
    });
  };

  const handleDeleteJob = async (jobId: string) => {
    const job = jobs.find((job) => job.id === jobId);
    setSelectedJob(job || null);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedJob) return;

    try {
      setIsDeleting(true);
      await deleteJob(selectedJob.id);
      // Invalidate jobs query to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.byCompany(company?.id || ""),
      });
      toast.success("Job deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreJob = async (jobId: string) => {
    const job = deletedJobs.find((job) => job.id === jobId);
    setSelectedJob(job || null);
    setShowRestoreConfirm(true);
  };

  const confirmRestore = async () => {
    if (!selectedJob) return;

    try {
      setIsRestoring(true);
      await restoreJob(selectedJob.id);
      // Invalidate jobs query to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.deletedJobs.byCompany(company?.id || ""),
      });
      toast.success("Job restored successfully");
      setShowRestoreConfirm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error restoring job:", error);
      toast.error("Failed to restore job");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleEditJob = (job: Job) => {
    navigate(`/dashboard/jobs/${job.id}/edit`);
  };

  const handleViewJob = (job: Job) => {
    navigate(`/dashboard/jobs/view/${job.id}`);
  };

  if (isLoading || isDeletedLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Show message if user is not an employer
  if (profile?.user_type !== "employer") {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Access Denied
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Only employers can access the jobs management page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-5 md:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your job postings
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {showDeleted ? (
            <button
              onClick={handleShowActiveJobs}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Eye className="h-4 w-4 mr-2" />
              Active Jobs
            </button>
          ) : (
            <button
              onClick={handleShowDeletedJobs}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash className="h-4 w-4 mr-2" />
              Deleted Jobs
            </button>
          )}

          <button
            onClick={() => navigate("/dashboard/jobs/new")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </button>
        </div>
      </div>

      <div className="text-left pl-2">
        {showDeleted ? (
          <h1 className="text-xl font-bold text-gray-400">Deleted Jobs</h1>
        ) : (
          <h1 className="text-xl font-bold text-gray-400">Active Jobs</h1>
        )}
      </div>

      {/* Jobs List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Desktop Table Header - Hidden on mobile */}
        <div className="hidden md:grid bg-gray-50 px-6 py-3 grid-cols-12 gap-4">
          <div className="col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title And Company
          </div>
          <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
          </div>
          <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </div>
          <div className="col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Salary Range
          </div>
          <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Applications
          </div>
          <div className="col-span-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {showDeleted ? (
            <div>
              {deletedJobs.map((job) => (
                <div key={job.id} className="px-4 py-4 hover:bg-gray-50">
                  {/* Mobile Card Layout */}
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.company?.name || "Company Name Not Available"}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {isRestoring ? (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                          <button
                            onClick={() => handleRestoreJob(job.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="font-medium text-gray-500">
                          Location:
                        </span>
                        <span className="ml-1 text-gray-900">
                          {job.location}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Type:</span>
                        <span className="ml-1 text-gray-900">{job.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Salary:
                        </span>
                        <span className="ml-1 text-gray-900">
                          {job.salary_min && job.salary_max
                            ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                            : "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Applications:
                        </span>
                        <span className="ml-1 text-gray-900">
                          {job.applications_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                    <div className="col-span-4">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.company?.name || "Company Name Not Available"}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {job.location}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">{job.type}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-sm text-gray-900">
                        {job.salary_min && job.salary_max
                          ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                          : "Not specified"}
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center items-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/applications/manage?jobId=${job.id}`
                          )
                        }
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        <span>{job.applications_count || 0} Applications</span>
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-center space-x-2 items-center">
                      {isRestoring ? (
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      ) : (
                        <button
                          onClick={() => handleRestoreJob(job.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <RefreshCw className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {jobs.map((job) => (
                <div key={job.id} className="px-4 py-4 hover:bg-gray-50">
                  {/* Mobile Card Layout */}
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.company?.name || "Company Name Not Available"}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewJob(job)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {isDeleting ? (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="font-medium text-gray-500">
                          Location:
                        </span>
                        <span className="ml-1 text-gray-900">
                          {job.location}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Type:</span>
                        <span className="ml-1 text-gray-900">{job.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Salary:
                        </span>
                        <span className="ml-1 text-gray-900">
                          {job.salary_min && job.salary_max
                            ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                            : "Not specified"}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/applications/manage?jobId=${job.id}`
                            )
                          }
                          className="inline-flex items-center text-xs text-indigo-600"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          <span>
                            {job.applications_count || 0} Applications
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                    <div className="col-span-4">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.company?.name || "Company Name Not Available"}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {job.location}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">{job.type}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-sm text-gray-900">
                        {job.salary_min && job.salary_max
                          ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                          : "Not specified"}
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center items-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/applications/manage?jobId=${job.id}`
                          )
                        }
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        <span>{job.applications_count || 0} Applications</span>
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-end space-x-2 items-center">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {isDeleting ? (
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      ) : (
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!showDeleted && jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No job postings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new job posting.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/dashboard/jobs/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        )}

        {showDeleted && deletedJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No deleted job postings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Deleted job postings will show here
            </p>
            <div className="mt-6">
              <button
                onClick={handleShowActiveJobs}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Show Active Jobs
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
        message={`Are you sure you want to delete "${selectedJob?.title}"?`}
        confirmText="Delete"
        type="danger"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRestoreConfirm}
        onClose={() => {
          setShowRestoreConfirm(false);
          setSelectedJob(null);
        }}
        onConfirm={confirmRestore}
        title="Restore Job Posting"
        message={`Are you sure you want to restore "${selectedJob?.title}"?`}
        confirmText="Restore"
        type="warning"
      />
    </div>
  );
};

export default JobsManagement;
