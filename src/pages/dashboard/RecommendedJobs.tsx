import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Euro, Clock, Building2, Briefcase, Bookmark, Star, Zap } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { getJobs, type Job, getProfile } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface RecommendationScore {
  job: Job;
  score: number;
  reasons: string[];
}

function RecommendedJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadRecommendations();
      loadSavedJobs();
    }
  }, [user]);

  const loadSavedJobs = async () => {
    if (!user) return;

    try {
      const { data: savedJobs, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedJobIds(new Set(savedJobs.map(job => job.job_id)));
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user profile
      const profile = await getProfile(user.id);
      if (!profile) {
        toast.error('Please complete your profile to get personalized recommendations');
        return;
      }

      // Get all jobs
      const jobs = await getJobs();

      if (!jobs || !profile?.skills || profile.skills.length === 0) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      // Calculate recommendation scores
      const scoredJobs = jobs.map(job => {
        const score = calculateJobScore(job, profile);
        return score;
      });

      // Sort by score and take top 10
      const topRecommendations = scoredJobs
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setRecommendations(topRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const calculateJobScore = (job: Job, profile: any): RecommendationScore => {
    let score = 0;
    const reasons: string[] = [];

    // Location match
    if (profile.preferred_location && job.location.toLowerCase().includes(profile.preferred_location.toLowerCase())) {
      score += 30;
      reasons.push('Location match');
    }

    // Salary match
    if (profile.salary_expectation && job.salary_max && job.salary_max >= profile.salary_expectation) {
      score += 20;
      reasons.push('Salary match');
    }

    // Skills match
    if (profile.skills && profile.skills.length > 0) {
      const jobSkills = new Set([
        ...job.requirements.map(req => req.toLowerCase()),
        ...(job.description.toLowerCase().split(/\W+/))
      ]);

      const matchingSkills = profile.skills.filter((skill: string) => 
        jobSkills.has(skill.toLowerCase())
      );

      if (matchingSkills.length > 0) {
        score += Math.min(matchingSkills.length * 10, 30);
        reasons.push(`${matchingSkills.length} skills match`);
      }
    }

    // Role match
    if (profile.preferred_role && 
        (job.title.toLowerCase().includes(profile.preferred_role.toLowerCase()) ||
         job.description.toLowerCase().includes(profile.preferred_role.toLowerCase()))) {
      score += 20;
      reasons.push('Role match');
    }

    return { job, score, reasons };
  };

  const saveJob = async (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to save jobs');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
          notify_before_deadline: true,
          notification_days: 7,
        });

      if (error) throw error;

      setSavedJobIds(prev => new Set([...prev, jobId]));
      toast.success('Job saved successfully');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
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
        <h1 className="text-2xl font-bold text-gray-900">Recommended Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Personalized job recommendations based on your profile and preferences
        </p>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete your profile to get personalized job recommendations
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Complete Profile
              </button>
            </div>
          </div>
        ) : (
          recommendations.map(({ job, score, reasons }) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {job.company?.logo_url ? (
                      <img
                        src={job.company.logo_url}
                        alt={job.company.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.company?.name}</p>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        {(job.salary_min || job.salary_max) && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <Euro className="w-4 h-4 mr-1" />
                            {job.salary_min && job.salary_max
                              ? `${job.salary_min.toLocaleString()}€ - ${job.salary_max.toLocaleString()}€`
                              : job.salary_min
                              ? `From ${job.salary_min.toLocaleString()}€`
                              : `Up to ${job.salary_max?.toLocaleString()}€`}
                            <span className="ml-1">/ year</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-500 text-sm">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                      </div>
                      {/* Match Score */}
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="flex items-center text-yellow-600">
                          <Zap className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{score}% Match</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="text-sm text-gray-500">
                          {reasons.join(' • ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {!savedJobIds.has(job.id) && (
                      <button
                        onClick={() => saveJob(job.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Save job"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
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

export default RecommendedJobs;
