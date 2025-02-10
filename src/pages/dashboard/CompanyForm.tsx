import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Upload } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { Company, createCompany, updateCompany, getCompany } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

// Form data interface with all fields as strings (except benefits array)
interface CompanyFormData {
  name: string;
  description: string;
  website: string;
  location: string;
  size: string;
  industry: string;
  founded_year: string;
  headquarters: string;
  funding_stage: string;
  mission: string;
  values: string;
  culture: string;
  benefits: string[];
  tech_stack: string;
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  logo_url?: string;
}

// Convert company data to form data
const companyToFormData = (company: Partial<Company>): CompanyFormData => ({
  name: company.name || '',
  description: company.description || '',
  website: company.website || '',
  location: company.location || '',
  size: company.size || '',
  industry: company.industry || '',
  founded_year: company.founded_year?.toString() || '',
  headquarters: company.headquarters || '',
  funding_stage: company.funding_stage || '',
  mission: company.mission || '',
  values: company.values || '',
  culture: company.culture || '',
  benefits: company.benefits || [],
  tech_stack: company.tech_stack || '',
  linkedin_url: company.linkedin_url || '',
  twitter_url: company.twitter_url || '',
  facebook_url: company.facebook_url || '',
  logo_url: company.logo_url || ''
});

// Convert form data back to company data for API
const formDataToCompany = (formData: CompanyFormData): Omit<Company, 'id' | 'created_at'> => ({
  name: formData.name,
  description: formData.description,
  website: formData.website || null,
  location: formData.location,
  size: formData.size,
  industry: formData.industry,
  founded_year: formData.founded_year ? parseInt(formData.founded_year, 10) : null,
  headquarters: formData.headquarters || null,
  funding_stage: formData.funding_stage || null,
  mission: formData.mission || null,
  values: formData.values || null,
  culture: formData.culture || null,
  benefits: formData.benefits.length > 0 ? formData.benefits : null,
  tech_stack: formData.tech_stack || null,
  linkedin_url: formData.linkedin_url || null,
  twitter_url: formData.twitter_url || null,
  facebook_url: formData.facebook_url || null,
  logo_url: formData.logo_url || null,
  owner_id: '' // This will be set in handleSubmit
});

const CompanyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    website: '',
    location: '',
    size: '',
    industry: '',
    founded_year: '',
    headquarters: '',
    funding_stage: '',
    mission: '',
    values: '',
    culture: '',
    benefits: [],
    tech_stack: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: ''
  });

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  const loadCompany = async () => {
    try {
      setIsLoading(true);
      const company = await getCompany(id!);
      if (company) {
        setFormData(companyToFormData(company));
        if (company.logo_url) {
          setLogoPreview(company.logo_url);
        }
      }
    } catch (error) {
      console.error('Error loading company:', error);
      toast.error('Failed to load company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const benefits = e.target.value.split('\n').filter(benefit => benefit.trim() !== '');
    setFormData(prev => ({
      ...prev,
      benefits
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLogoFile(file);
  };

  const uploadLogo = async (): Promise<string | undefined> => {
    if (!logoFile || !user) return undefined;

    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload company logo');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      let logo_url = formData.logo_url;
      if (logoFile) {
        logo_url = await uploadLogo() || '';
      }

      const companyData = formDataToCompany({
        ...formData,
        logo_url
      });

      if (id) {
        // For updates, we can send partial data
        await updateCompany(id, companyData);
        toast.success('Company updated successfully!');
      } else {
        // For creation, we need to include owner_id
        await createCompany({
          ...companyData,
          owner_id: user.id
        });
        toast.success('Company created successfully!');
      }
      navigate('/dashboard/companies/manage');
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Failed to save company');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Company' : 'Create Company'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {id ? 'Update your company information' : 'Add your company to start posting jobs'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Logo</label>
          <div className="mt-2 flex items-center space-x-4">
            <div className="h-24 w-24 rounded bg-gray-100 flex items-center justify-center">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-20 w-20 rounded object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry *</label>
            <select
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">Company Size *</label>
            <select
              id="size"
              name="size"
              required
              value={formData.size}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1001+">1001+ employees</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700">Headquarters</label>
            <input
              type="text"
              id="headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="founded_year" className="block text-sm font-medium text-gray-700">Founded Year</label>
            <input
              type="number"
              id="founded_year"
              name="founded_year"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.founded_year}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="funding_stage" className="block text-sm font-medium text-gray-700">Funding Stage</label>
            <select
              id="funding_stage"
              name="funding_stage"
              value={formData.funding_stage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Funding Stage</option>
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C+">Series C+</option>
              <option value="Public">Public</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Mission, Values, Culture */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="mission" className="block text-sm font-medium text-gray-700">Mission</label>
            <textarea
              id="mission"
              name="mission"
              rows={3}
              value={formData.mission}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="values" className="block text-sm font-medium text-gray-700">Values</label>
            <textarea
              id="values"
              name="values"
              rows={3}
              value={formData.values}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="culture" className="block text-sm font-medium text-gray-700">Culture</label>
            <textarea
              id="culture"
              name="culture"
              rows={3}
              value={formData.culture}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Benefits and Tech Stack */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Benefits (one per line)</label>
            <textarea
              id="benefits"
              name="benefits"
              rows={4}
              value={formData.benefits.join('\n')}
              onChange={handleBenefitsChange}
              placeholder="Health insurance&#10;401(k) matching&#10;Remote work&#10;Flexible hours"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="tech_stack" className="block text-sm font-medium text-gray-700">Tech Stack</label>
            <textarea
              id="tech_stack"
              name="tech_stack"
              rows={4}
              value={formData.tech_stack}
              onChange={handleInputChange}
              placeholder="List the technologies and tools used at your company"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700">Twitter URL</label>
            <input
              type="url"
              id="twitter_url"
              name="twitter_url"
              value={formData.twitter_url}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700">Facebook URL</label>
            <input
              type="url"
              id="facebook_url"
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/companies/manage')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : id ? 'Update Company' : 'Create Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
