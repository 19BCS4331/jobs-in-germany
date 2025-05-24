import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icons } from "../../components/Icons";
import {
  getJob,
  type Job,
} from "../../lib/api";
import { toast } from "react-hot-toast";


function JobsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await getJob(id!);
      setJob(jobData);
    } catch (error) {
      console.error("Error loading job:", error);
      toast.error("Failed to load job details");
      navigate("/dashboard/jobs/manage");
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 mb-5">
        <button
          onClick={() => navigate("/dashboard/jobs/manage")}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Management
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {job.company ? (
                  job.company.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={`${job.company.name} logo`}
                      className="h-16 w-16 rounded-lg object-cover"
                      onError={(e) => {
                        // If the image fails to load, show the icon instead
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icons.Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icons.Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-500">
                      <Icons.Building2 className="w-5 h-5 mr-1.5" />
                      {job.company?.name}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Icons.MapPin className="w-5 h-5 mr-1.5" />
                      {job.location}
                    </div>
                    {(job.salary_min || job.salary_max) ? (
                      <div className="flex items-center text-gray-500">
                        <Icons.Euro className="w-5 h-5 mr-1.5" />
                        {job.salary_min && job.salary_max
                          ? `${job.salary_min.toLocaleString()}€ - ${job.salary_max.toLocaleString()}€`
                          : job.salary_min
                          ? `From ${job.salary_min.toLocaleString()}€`
                          : `Up to ${job.salary_max?.toLocaleString()}€`}
                        <span className="ml-1">/ year</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <Icons.Euro className="w-5 h-5 mr-1.5" />
                        Salary not specified
                      </div>
                    )}
                    <div className="flex items-center text-gray-500">
                      <Icons.Briefcase className="w-5 h-5 mr-1.5" />
                      <span className="capitalize">{job.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>

            <div className="space-y-4">
              {job.company?.contact_person_name && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Contact Person
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.company.contact_person_name}
                    </p>
                  </div>
                </div>
              )}

              {job.company?.contact_person_number && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Phone Number
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.company.contact_person_number}
                    </p>
                  </div>
                </div>
              )}

              {!job.company?.contact_person_name &&
                !job.company?.contact_person_number && (
                  <p className="text-sm text-gray-500 italic">
                    No contact information available
                  </p>
                )}
            </div>
          </div>
          {/* Job Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              {job.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements
              </h2>
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

          {/* Job Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Benefits
              </h2>
              <ul className="space-y-3">
                {job.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Benefits */}
        {job.company?.benefits && job.company?.benefits.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Company Benefits
              </h2>
              <ul className="space-y-3">
                {job.company?.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsView;
