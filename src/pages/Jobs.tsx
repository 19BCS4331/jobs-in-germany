import React, { useEffect, useState } from 'react';
import { Icons } from '../components/Icons';
import { getJobs, type Job, saveJob, unsaveJob, getSavedJobId, checkIfJobIsSaved as checkSavedStatus } from '../lib/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useSavedJobs } from '../contexts/SavedJobsContext';
import { toast } from 'react-hot-toast';

// Job types
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'] as const;

// Experience levels
const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: '0-2' },
  { label: 'Mid Level', value: '3-5' },
  { label: 'Senior Level', value: '6-8' },
  { label: 'Lead/Manager', value: '8+' }
] as const;

// Work modes
const WORK_MODES = ['on-site', 'remote', 'hybrid'] as const;

// Posted date options
const POSTED_DATE_OPTIONS = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last week', value: '1w' },
  { label: 'Last month', value: '1m' },
  { label: 'Any time', value: 'any' }
] as const;

interface JobFilters {
  search?: string;
  location?: string;
  type?: typeof JOB_TYPES[number];
  experience?: string;
  workMode?: typeof WORK_MODES[number];
  salaryMin?: number;
  salaryMax?: number;
  postedDate?: string;
  industry?: string;
}

function JobCard({ job }: { job: Job }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkIfJobIsSaved, addSavedJob, removeSavedJob } = useSavedJobs();
  const [isSaving, setIsSaving] = useState(false);
  const isCurrentlySaved = checkIfJobIsSaved(job.id);

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent job card click event

    if (!user) {
      toast.error('Please sign in to save jobs');
      return;
    }

    try {
      setIsSaving(true);

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

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {job.company && job.company.logo_url !== null && job.company.logo_url !== undefined && job.company.logo_url !== "" ? (
              <img
                src={job.company.logo_url}
                alt={`${job.company.name} logo`}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icons.Building2 className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company?.name}</p>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Icons.MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Icons.Euro className="w-4 h-4 mr-1" />
                    {job.salary_min && job.salary_max
                      ? `${job.salary_min.toLocaleString()}€ - ${job.salary_max.toLocaleString()}€`
                      : job.salary_min
                      ? `From ${job.salary_min.toLocaleString()}€`
                      : `Up to ${job.salary_max?.toLocaleString()}€`}
                    <span className="ml-1">/ year</span>
                  </div>
                )}
                <div className="flex items-center text-gray-500 text-sm">
                  <Icons.Briefcase className="w-4 h-4 mr-1" />
                  {job.type}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={handleSaveJob}
              disabled={isSaving}
              className={`p-2 rounded-lg transition ${
                isCurrentlySaved
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={isCurrentlySaved ? 'Remove from saved jobs' : 'Save job'}
            >
              <Icons.Bookmark className={`w-5 h-5 ${isCurrentlySaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
        </div>
      </div>
    </div>
  );
}

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: (searchParams.get('type') as typeof JOB_TYPES[number]) || undefined,
    experience: searchParams.get('experience') || undefined,
    workMode: (searchParams.get('workMode') as typeof WORK_MODES[number]) || undefined,
    salaryMin: searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined,
    salaryMax: searchParams.get('salaryMax') ? Number(searchParams.get('salaryMax')) : undefined,
    postedDate: searchParams.get('postedDate') || undefined,
    industry: searchParams.get('industry') || undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs({
          search: filters.search,
          location: filters.location,
          type: filters.type,
          salary_min: filters.salaryMin,
          salary_max: filters.salaryMax
        });
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key: keyof JobFilters, value: string | number | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Update URL params
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v) params.set(k, String(v));
      });
      setSearchParams(params);
      return newFilters;
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 ">
      <div className="container mx-auto px-6 mb-5">
        {/* Search Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Icons.MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <Icons.Filter className="w-5 h-5" />
              Filters
              <Icons.ChevronDown className={`w-4 h-4 transform transition ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={filters.experience || ''}
                  onChange={(e) => handleFilterChange('experience', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Levels</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Mode
                </label>
                <select
                  value={filters.workMode || ''}
                  onChange={(e) => handleFilterChange('workMode', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Modes</option>
                  {WORK_MODES.map(mode => (
                    <option key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Posted Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posted Date
                </label>
                <select
                  value={filters.postedDate || ''}
                  onChange={(e) => handleFilterChange('postedDate', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Time</option>
                  {POSTED_DATE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range (€)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.salaryMin || ''}
                    onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.salaryMax || ''}
                    onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center text-gray-500">
              No jobs found matching your criteria.
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;