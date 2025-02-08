import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { getCompanyByOwner, getJobsByCompany, Job } from '../../lib/api';
import toast from 'react-hot-toast';

interface CompanyDashboardData {
  name: string;
  jobs: Job[];
  totalApplications: number;
}

export default function CompanyDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<CompanyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || profile?.user_type !== 'employer') {
        navigate('/');
        return;
      }

      try {
        const company = await getCompanyByOwner(user.id);
        if (!company) {
          navigate('/company/new');
          return;
        }

        const jobs = await getJobsByCompany(company.id);
        const totalApplications = jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0);

        setDashboardData({
          name: company.name,
          jobs,
          totalApplications,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error('Dashboard loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, profile, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Dashboard - {dashboardData.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData.jobs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardData.totalApplications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={() => navigate('/jobs/new')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Post New Job
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-6 border-b">Recent Job Listings</h2>
        <div className="divide-y">
          {dashboardData.jobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-gray-600">{job.location}</p>
                </div>
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.applications_count || 0} applications
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/jobs/${job.id}/applications`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
