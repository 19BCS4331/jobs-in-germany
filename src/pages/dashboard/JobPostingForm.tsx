import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Briefcase, Save, Loader2 } from 'lucide-react';
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
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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
        navigate('/dashboard/companies/new');
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
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (isFormField(name) && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    setFormData((prev) => {
      if (name === 'salary_min' || name === 'salary_max') {
        return { ...prev, [name]: parseFloat(value) || null };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const requirements = e.target.value.split('\n').filter(req => req.trim());
    setFormData(prev => ({ ...prev, requirements: requirements.join('\n') }));
  };

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.type) newErrors.type = 'Job type is required';
    if (!formData.requirements.length) newErrors.requirements = 'At least one requirement is required';
    if (!formData.company_id) newErrors.company_id = 'Please select a company';

    // Salary validation
    const minSalary = formData.salary_min;
    const maxSalary = formData.salary_max;

    if (minSalary !== null && minSalary <= 0) {
      newErrors.salary_min = 'Minimum salary must be greater than 0';
    }

    if (maxSalary !== null && maxSalary <= 0) {
      newErrors.salary_max = 'Maximum salary must be greater than 0';
    }

    if (minSalary !== null && maxSalary !== null && maxSalary < minSalary) {
      newErrors.salary_max = 'Maximum salary must be greater than minimum salary';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsLoading(true);
      const requirements = formData.requirements.split('\n')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      const jobData = {
        ...formData,
        requirements,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
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

  if (isLoading && jobId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {jobId ? 'Edit Job Posting' : 'Create Job Posting'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="grid grid-cols-2 gap-4">
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
  );
};

export default JobPostingForm;
