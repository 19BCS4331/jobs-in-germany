import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Euro, Clock, Building2, Briefcase, Bell, BellOff, Trash2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { getSavedJobs, unsaveJob, updateSavedJobNotification, type SavedJob } from '../../lib/api';
import { toast } from 'react-hot-toast';

function SavedJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  const loadSavedJobs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const jobs = await getSavedJobs(user.id);
      setSavedJobs(jobs);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (savedJobId: string) => {
    try {
      await unsaveJob(savedJobId);
      setSavedJobs(jobs => jobs.filter(job => job.id !== savedJobId));
      toast.success('Job removed from saved jobs');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('Failed to remove job');
    }
  };

  const toggleNotification = async (savedJob: SavedJob) => {
    try {
      const updatedJob = await updateSavedJobNotification(
        savedJob.id,
        !savedJob.notify_before_deadline,
        savedJob.notification_days
      );
      setSavedJobs(jobs =>
        jobs.map(job =>
          job.id === savedJob.id ? { ...job, ...updatedJob } : job
        )
      );
      toast.success(
        updatedJob.notify_before_deadline
          ? 'Notifications enabled'
          : 'Notifications disabled'
      );
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your saved jobs. Enable notifications to get reminders before application deadlines.
        </p>
      </div>

      {/* Saved Jobs List */}
      <div className="space-y-4">
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved jobs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start saving jobs you're interested in to keep track of them here
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/jobs')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          savedJobs.map(savedJob => (
            <div
              key={savedJob.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {savedJob.job?.company?.logo_url ? (
                      <img
                        src={savedJob.job.company.logo_url}
                        alt={savedJob.job.company.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {savedJob.job?.title}
                      </h3>
                      <p className="text-sm text-gray-600">{savedJob.job?.company?.name}</p>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {savedJob.job?.location}
                        </div>
                        {(savedJob.job?.salary_min || savedJob.job?.salary_max) && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <Euro className="w-4 h-4 mr-1" />
                            {savedJob.job?.salary_min && savedJob.job?.salary_max
                              ? `${savedJob.job.salary_min.toLocaleString()}€ - ${savedJob.job.salary_max.toLocaleString()}€`
                              : savedJob.job?.salary_min
                              ? `From ${savedJob.job.salary_min.toLocaleString()}€`
                              : `Up to ${savedJob.job?.salary_max?.toLocaleString()}€`}
                            <span className="ml-1">/ year</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-500 text-sm">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {savedJob.job?.type}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Saved {new Date(savedJob.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleNotification(savedJob)}
                      className={`p-2 rounded-lg transition ${
                        savedJob.notify_before_deadline
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={
                        savedJob.notify_before_deadline
                          ? 'Disable notifications'
                          : 'Enable notifications'
                      }
                    >
                      {savedJob.notify_before_deadline ? (
                        <Bell className="w-5 h-5" />
                      ) : (
                        <BellOff className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleUnsaveJob(savedJob.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove from saved jobs"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {savedJob.job?.description}
                  </p>
                  <button
                    onClick={() => navigate(`/jobs/${savedJob.job?.id}`)}
                    className="ml-4 flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
