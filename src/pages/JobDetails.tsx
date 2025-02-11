import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { getJob, type Job, applyToJob, saveJob, unsaveJob, getSavedJobId, checkIfJobApplied } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { useSavedJobs } from '../contexts/SavedJobsContext';
import { toast } from 'react-hot-toast';

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coverLetter: string) => Promise<void>;
}

function ApplicationModal({ job, isOpen, onClose, onSubmit }: ApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(coverLetter);
      onClose();
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply to {job.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us why you're a great fit for this role..."
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkIfJobIsSaved, addSavedJob, removeSavedJob } = useSavedJobs();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await getJob(id!);
      setJob(jobData);
      
      if (user) {
        const hasAlreadyApplied = await checkIfJobApplied(id!);
        setHasApplied(hasAlreadyApplied);
      }
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !job) {
      navigate('/signin');
      return;
    }

    try {
      setIsSaving(true);
      const isCurrentlySaved = checkIfJobIsSaved(job.id);

      if (isCurrentlySaved) {
        const savedJobId = await getSavedJobId(job.id);
        if (savedJobId) {
          await unsaveJob(savedJobId);
          removeSavedJob(job.id);
          toast.success('Job removed from saved jobs');
        }
      } else {
        await saveJob(user.id, job.id);
        addSavedJob(job.id);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(checkIfJobIsSaved(job.id) ? 'Failed to remove job' : 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (coverLetter: string) => {
    if (!user || !job) return;
    await applyToJob(job.id, user.id, coverLetter);
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {job.company ? (
                  <img
                    src={job.company.logo_url || '/company-placeholder.png'}
                    alt={`${job.company.name} logo`}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icons.Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-500">
                      <Icons.Building2 className="w-5 h-5 mr-1.5" />
                      {job.company?.name}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Icons.MapPin className="w-5 h-5 mr-1.5" />
                      {job.location}
                    </div>
                    {(job.salary_min || job.salary_max) && (
                      <div className="flex items-center text-gray-500">
                        <Icons.Euro className="w-5 h-5 mr-1.5" />
                        {job.salary_min && job.salary_max
                          ? `${job.salary_min.toLocaleString()}€ - ${job.salary_max.toLocaleString()}€`
                          : job.salary_min
                          ? `From ${job.salary_min.toLocaleString()}€`
                          : `Up to ${job.salary_max?.toLocaleString()}€`}
                        <span className="ml-1">/ year</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-500">
                      <Icons.Briefcase className="w-5 h-5 mr-1.5" />
                      <span className="capitalize">{job.type}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveJob}
                  disabled={isSaving}
                  className={`p-2.5 rounded-lg transition ${
                    checkIfJobIsSaved(job?.id || '')
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={checkIfJobIsSaved(job?.id || '') ? 'Remove from saved jobs' : 'Save job'}
                >
                  <Icons.Bookmark className={`w-6 h-6 ${checkIfJobIsSaved(job?.id || '') ? 'fill-current' : ''}`} />
                </button>
                {hasApplied ? (
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100"
                    disabled
                  >
                    <Icons.Check className="w-4 h-4 mr-2" />
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <ApplicationModal
            job={job}
            isOpen={true}
            onClose={() => setShowApplicationModal(false)}
            onSubmit={handleApplicationSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default JobDetails;
