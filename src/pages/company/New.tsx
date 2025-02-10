import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompany } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';
import { FiTrello, FiUsers, FiAward, FiHeart, FiGlobe, FiSave, FiArrowLeft } from 'react-icons/fi';
import ConfirmDialog from '../../components/ConfirmDialog';

// Constants
const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Hospitality', 'Construction', 'Entertainment', 'Automotive',
  'Energy', 'Agriculture', 'Transportation', 'Real Estate', 'Consulting'
].sort();

const COMPANY_SIZES = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
];

const BENEFITS = [
  { id: 'health', label: 'Health Insurance', icon: '🏥' },
  { id: 'dental', label: 'Dental Insurance', icon: '🦷' },
  { id: 'vision', label: 'Vision Insurance', icon: '👓' },
  { id: 'life', label: 'Life Insurance', icon: '🛡️' },
  { id: '401k', label: '401(k)', icon: '💰' },
  { id: 'remote', label: 'Remote Work', icon: '🏠' },
  { id: 'flexible', label: 'Flexible Hours', icon: '⏰' },
  { id: 'pto', label: 'Paid Time Off', icon: '✈️' },
  { id: 'parental', label: 'Parental Leave', icon: '👶' },
  { id: 'development', label: 'Professional Development', icon: '📚' },
  { id: 'gym', label: 'Gym Membership', icon: '💪' },
  { id: 'events', label: 'Company Events', icon: '🎉' },
  { id: 'stock', label: 'Stock Options', icon: '📈' },
  { id: 'bonus', label: 'Performance Bonus', icon: '🎯' },
  { id: 'relocation', label: 'Relocation Assistance', icon: '🚚' }
];

interface ValidationErrors {
  [key: string]: string;
}

function NewCompany() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    website: string;
    location: string;
    size: string;
    industry: string;
    logo_url: string;
    founded_year: number;
    headquarters: string;
    benefits: string[];
    culture: string;
    mission: string;
    values: string;
    funding_stage: string;
    tech_stack: string;
    social_media: {
      linkedin: string;
      twitter: string;
      facebook: string;
    };
  }>({
    name: '',
    description: '',
    website: '',
    location: '',
    size: '',
    industry: '',
    logo_url: '',
    founded_year: new Date().getFullYear(),
    headquarters: '',
    benefits: [],
    culture: '',
    mission: '',
    values: '',
    funding_stage: '',
    tech_stack: '',
    social_media: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }

    // URL validations
    const urlRegex = /^https?:\/\/.+/;
    if (formData.website && !urlRegex.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.logo_url && !urlRegex.test(formData.logo_url)) {
      newErrors.logo_url = 'Please enter a valid URL starting with http:// or https://';
    }

    // Social media validations
    const { linkedin, twitter } = formData.social_media;
    if (linkedin && !/^[a-zA-Z0-9-]+$/.test(linkedin)) {
      newErrors['social_media.linkedin'] = 'Please enter a valid LinkedIn company name';
    }
    if (twitter && !/^[a-zA-Z0-9_]+$/.test(twitter)) {
      newErrors['social_media.twitter'] = 'Please enter a valid Twitter handle';
    }

    // Founded year validation
    const currentYear = new Date().getFullYear();
    if (formData.founded_year < 1800 || formData.founded_year > currentYear) {
      newErrors.founded_year = `Year must be between 1800 and ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, string>),
            [child]: value
          }
        };
      }
      return { ...prev, [name]: value };
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting', {
        duration: 4000,
        position: 'bottom-right',
      });
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);

    try {
      await createCompany({
        ...formData,
        owner_id: user?.id as string
      });
      toast.success('Company profile created successfully!', {
        duration: 5000,
        position: 'bottom-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create company', {
        duration: 5000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const FormSection = useCallback(({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  ), []);

  const Input = useCallback(({ label, required, error, ...props }: { label: string; required?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ), []);

  const TextArea = useCallback(({ label, required, error, ...props }: { label: string; required?: boolean; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ), []);

  const Select = useCallback(({ label, required, error, options, ...props }: { label: string; required?: boolean; error?: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
        {...props}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Your Company Profile</h1>
            <p className="mt-2 text-lg text-gray-600">
              Tell potential candidates about your company and what makes it special.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Essential Information" icon={<FiTrello size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Company Name"
                  required
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corporation"
                  error={errors.name}
                />
              </div>

              <div className="md:col-span-2">
                <TextArea
                  label="Company Description"
                  required
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your company..."
                  error={errors.description}
                />
              </div>

              <Input
                label="Website"
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.example.com"
                error={errors.website}
              />

              <Input
                label="Logo URL"
                type="url"
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                error={errors.logo_url}
              />
            </div>
          </FormSection>

          <FormSection title="Company Details" icon={<FiUsers size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Industry"
                required
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                options={INDUSTRIES}
                error={errors.industry}
              />

              <Select
                label="Company Size"
                required
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                options={COMPANY_SIZES}
                error={errors.size}
              />

              <Input
                label="Founded Year"
                type="number"
                id="founded_year"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                error={errors.founded_year}
              />

              <Input
                label="Headquarters"
                type="text"
                id="headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                placeholder="e.g., Berlin, Germany"
              />

              <Select
                label="Funding Stage"
                id="funding_stage"
                name="funding_stage"
                value={formData.funding_stage}
                onChange={handleChange}
                options={['Bootstrapped', 'Seed', 'Series A', 'Series B', 'Series C+', 'Public']}
              />

              <Input
                label="Tech Stack"
                type="text"
                id="tech_stack"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, PostgreSQL"
              />
            </div>
          </FormSection>

          <FormSection title="Culture & Mission" icon={<FiAward size={20} />}>
            <div className="space-y-6">
              <TextArea
                label="Company Mission"
                id="mission"
                name="mission"
                rows={3}
                value={formData.mission}
                onChange={handleChange}
                placeholder="What is your company's mission?"
              />

              <TextArea
                label="Company Values"
                id="values"
                name="values"
                rows={3}
                value={formData.values}
                onChange={handleChange}
                placeholder="What are your company's core values?"
              />

              <TextArea
                label="Company Culture"
                id="culture"
                name="culture"
                rows={3}
                value={formData.culture}
                onChange={handleChange}
                placeholder="Describe your company culture..."
              />
            </div>
          </FormSection>

          <FormSection title="Benefits & Perks" icon={<FiHeart size={20} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {BENEFITS.map(benefit => (
                <div
                  key={benefit.id}
                  className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.benefits.includes(benefit.label)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => {
                    const newBenefits = [...formData.benefits];
                    if (newBenefits.includes(benefit.label)) {
                      newBenefits.splice(newBenefits.indexOf(benefit.label), 1);
                    } else {
                      newBenefits.push(benefit.label);
                    }
                    setFormData(prev => ({ ...prev, benefits: newBenefits }));
                  }}
                >
                  <div className="mr-3 text-xl">{benefit.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{benefit.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <FormSection title="Social Media" icon={<FiGlobe size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-gray-500 sm:text-sm">
                    linkedin.com/company/
                  </span>
                  <input
                    type="text"
                    name="social_media.linkedin"
                    id="social_media.linkedin"
                    value={formData.social_media.linkedin}
                    onChange={handleChange}
                    className={`block w-full flex-1 rounded-none rounded-r-lg border ${errors['social_media.linkedin'] ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="company/your-company"
                  />
                </div>
                {errors['social_media.linkedin'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['social_media.linkedin']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-gray-500 sm:text-sm">
                    twitter.com/
                  </span>
                  <input
                    type="text"
                    name="social_media.twitter"
                    id="social_media.twitter"
                    value={formData.social_media.twitter}
                    onChange={handleChange}
                    className={`block w-full flex-1 rounded-none rounded-r-lg border ${errors['social_media.twitter'] ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
                    placeholder="your_company"
                  />
                </div>
                {errors['social_media.twitter'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['social_media.twitter']}</p>
                )}
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Create Company
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Create Company Profile"
        message="Are you sure you want to create this company profile? You can edit it later from your dashboard."
        confirmText="Create Profile"
        type="info"
      />
    </div>
  );
}

export default NewCompany;
