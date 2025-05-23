import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Briefcase, Save, Loader2, FileText, DollarSign } from 'lucide-react';
import { getJob, createJob, updateJob, Job, getCompanyByOwner } from '../../lib/api';
import { toast } from 'react-hot-toast';
import Input from '../../components/forms/Input';
import TextArea from '../../components/forms/TextArea';
import Select from '../../components/forms/Select';

interface FormData {
  title: string;
  description: string;
  location: string;
  type: Job['type'];
  salary_min: number | null;
  salary_max: number | null;
  requirements: string;
  company_id: string;
  is_active: boolean; // New field
  benefits: string[]; // New field
}

interface FormErrors {
  title?: string;
  description?: string;
  location?: string;
  type?: string;
  salary_min?: string;
  salary_max?: string;
  requirements?: string;
  company_id?: string;
}

// Type-safe way to check if a string is a key of FormErrors
function isFormField(key: string): key is keyof FormErrors {
  return ['title', 'description', 'location', 'type', 'salary_min', 'salary_max', 'requirements', 'company_id'].includes(key);
}

const initialFormData: FormData = {
  title: '',
  description: '',
  location: '',
  type: 'full-time',
  salary_min: null,
  salary_max: null,
  requirements: '',
  company_id: '',
  is_active: true, // Default to active
  benefits: [], // Empty benefits array
};

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

const JobPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // New state for benefits input
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    if (user) {
      loadCompanyAndJob();
    }
  }, [user]);

  const loadCompanyAndJob = async () => {
    try {
      if (!user) return;

      const company = await getCompanyByOwner(user.id);
      if (!company) {
        toast.error('No company found. Please create a company first.');
        navigate('/company/new');
        return;
      }

      if (jobId) {
        const job = await getJob(jobId);
        if (!job) {
          toast.error('Job not found');
          navigate('/dashboard/jobs/manage');
          return;
        }

        // Verify that the job belongs to the user's company
        if (job.company_id !== company.id) {
          toast.error('You do not have permission to edit this job');
          navigate('/dashboard/jobs/manage');
          return;
        }

        setFormData({
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          salary_min: job.salary_min ?? null,
          salary_max: job.salary_max ?? null,
          requirements: job.requirements.join('\n'),
          company_id: job.company_id,
          is_active: job.is_active !== false, // Default to true if not specified
          benefits: job.benefits || [], // Use benefits if available
        });
      } else {
        // For new job creation, just set the company_id
        setFormData(prev => ({ ...prev, company_id: company.id }));
      }
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job details');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Clear error when user starts typing
    if (isFormField(name) && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    setFormData((prev) => {
      if (name === 'salary_min' || name === 'salary_max') {
        return { ...prev, [name]: parseFloat(value) || null };
      }
      if (type === 'checkbox') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const requirements = e.target.value;
    setFormData(prev => ({ ...prev, requirements }));
  };
  
  // Add benefit functions
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.type) {
      errors.type = 'Job type is required';
    }

    if (formData.salary_min !== null && formData.salary_max !== null) {
      if (formData.salary_min > formData.salary_max) {
        errors.salary_min = 'Minimum salary cannot be greater than maximum salary';
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Split requirements into array and filter out empty lines
      const requirementsArray = formData.requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req);

      const jobData = {
        ...formData,
        requirements: requirementsArray,
      };

      if (jobId) {
        await updateJob(jobId, jobData);
        toast.success('Job updated successfully');
      } else {
        await createJob(jobData);
        toast.success('Job created successfully');
      }
      navigate('/dashboard/jobs/manage');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(jobId ? 'Failed to update job' : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  // Form section component
  const FormSection = useCallback(({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="pt-4 space-y-4">
        {children}
      </div>
    </div>
  ), []);

  if (isLoading && jobId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {jobId ? 'Edit Job Posting' : 'Create Job Posting'}
        </h1>
        <p className="text-gray-600 mb-8">
          {jobId ? 'Update your job listing details' : 'Create a new job listing for your company'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Basic Information" icon={<Briefcase size={20} />}>
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="e.g., Senior Frontend Developer"
            />

            <TextArea
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
              placeholder="Describe the responsibilities and requirements..."
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
              placeholder="e.g., Berlin, Remote"
            />

            <Select
              label="Job Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={!!errors.type}
              required
              options={jobTypes}
            />
          </FormSection>

          <FormSection title="Compensation" icon={<DollarSign size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minimum Salary"
                type="number"
                name="salary_min"
                value={formData.salary_min || ''}
                onChange={handleChange}
                error={errors.salary_min}
                placeholder="e.g., 50000"
              />

              <Input
                label="Maximum Salary"
                type="number"
                name="salary_max"
                value={formData.salary_max || ''}
                onChange={handleChange}
                error={errors.salary_max}
                placeholder="e.g., 70000"
              />
            </div>
            
            {/* Benefits section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Add the benefits offered with this position
              </p>

              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
                  placeholder="Type a benefit and press Enter or Add"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newBenefit.trim()) {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  disabled={!newBenefit.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium group"
                  >
                    <span>{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {formData.benefits.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No benefits added yet. Add some to make your job posting more attractive!
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          <FormSection title="Requirements" icon={<FileText size={20} />}>
            <TextArea
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleRequirementsChange}
              error={errors.requirements}
              required
              placeholder="Bachelor's degree in Computer Science or related field&#10;5+ years of experience in frontend development&#10;Strong proficiency in React and TypeScript"
              helpText="Enter each requirement on a new line"
            />
            
            {/* Active status checkbox */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-900"
              >
                Make this job posting active
              </label>
            </div>
          </FormSection>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/jobs/manage')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!isLoading && <Save className="h-4 w-4 mr-2" />}
              {jobId ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;