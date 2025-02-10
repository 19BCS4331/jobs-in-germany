import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Building2, Calendar } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { getMyApplications, Application } from '../../lib/api';
import { toast } from 'react-hot-toast';

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

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const applications = await getMyApplications(user!.id);
      setApplications(applications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track the status of your job applications
        </p>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {applications.length === 0 ? (
          <div className="p-6 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start applying to jobs to track your applications here.
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
                        alt={application.job.company.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {application.job?.title || 'Unknown Job'}
                    </h3>
                    <p className="text-sm text-gray-500">{application.job?.company?.name || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                  {React.createElement(statusIcons[application.status], { className: 'mr-1 h-4 w-4' })}
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </div>
              </div>

              {/* Application Details */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {application.job?.location || 'Location not specified'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  Applied {application.created_at ? formatDate(application.created_at) : 'Unknown date'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {application.job?.type || 'Job type not specified'}
                </div>
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
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedApplication(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
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
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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

export default MyApplications;
