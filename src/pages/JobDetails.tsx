import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Euro, Clock, Building2, Briefcase, Calendar, Globe, Users, ChevronLeft, Bookmark, X, Check } from 'lucide-react';
import { getJob, type Job, applyToJob, saveJob, unsaveJob, checkIfJobApplied } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

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
            <X className="w-5 h-5" />
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
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  useEffect(() => {
    // Check if job is already saved and if user has applied
    if (user && job) {
      checkIfJobIsSaved();
      checkIfUserHasApplied();
    }
  }, [user, job]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await getJob(id!);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfJobIsSaved = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user?.id)
        .eq('job_id', job?.id)
        .single();

      if (!error && data) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const checkIfUserHasApplied = async () => {
    if (!job || !user) return;
    const applied = await checkIfJobApplied(job.id);
    setHasApplied(applied);
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast.error('Please sign in to save jobs');
      return;
    }

    if (!job) return;

    try {
      setIsSaving(true);
      if (isSaved) {
        // Get saved job id first
        const { data } = await supabase
          .from('saved_jobs')
          .select('id')
          .eq('user_id', user.id)
          .eq('job_id', job.id)
          .single();

        if (data) {
          await unsaveJob(data.id);
          setIsSaved(false);
          toast.success('Job removed from saved jobs');
        }
      } else {
        await saveJob(user.id, job.id);
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(isSaved ? 'Failed to remove job' : 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please sign in to apply for jobs');
      navigate('/auth/signin');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (coverLetter: string) => {
    if (!user || !job) return;
    await applyToJob(job.id, user.id, coverLetter);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Job not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
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
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <div className="mt-1 flex items-center space-x-2 text-gray-500">
                    <span>{job.company?.name}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="capitalize">{job.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveJob}
                  disabled={isSaving}
                  className={`p-2.5 rounded-lg transition ${
                    isSaved
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={isSaved ? 'Remove from saved jobs' : 'Save job'}
                >
                  <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                {hasApplied ? (
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
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
        {showApplyModal && (
          <ApplicationModal
            job={job}
            isOpen={true}
            onClose={() => setShowApplyModal(false)}
            onSubmit={handleApplicationSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default JobDetails;
