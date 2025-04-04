import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, getProfile } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';
import type { Profile as ProfileType } from '../lib/api';

// Type for form data (all fields are required strings)
interface ProfileFormData {
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  skills: string;
  experience_years: string;
  education_level: string;
  resume_url: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  preferred_role: string;
  preferred_location: string;
  salary_expectation: string;
}

// Convert profile data to form data by ensuring all fields are strings
const profileToFormData = (profile: ProfileType): ProfileFormData => ({
  full_name: profile.full_name || '',
  headline: profile.headline || '',
  bio: profile.bio || '',
  location: profile.location || '',
  skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
  experience_years: profile.experience_years?.toString() || '',
  education_level: profile.education_level || '',
  resume_url: profile.resume_url || '',
  linkedin_url: profile.linkedin_url || '',
  github_url: profile.github_url || '',
  portfolio_url: profile.portfolio_url || '',
  preferred_role: profile.preferred_role || '',
  preferred_location: profile.preferred_location || '',
  salary_expectation: profile.salary_expectation?.toString() || ''
});

// Convert form data back to API format
const formDataToProfile = (formData: ProfileFormData) => ({
  ...formData,
  skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
  experience_years: formData.experience_years ? parseInt(formData.experience_years, 10) : null,
  salary_expectation: formData.salary_expectation ? parseInt(formData.salary_expectation, 10) : null
});

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    headline: '',
    bio: '',
    location: '',
    skills: '',
    experience_years: '',
    education_level: '',
    resume_url: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    preferred_role: '',
    preferred_location: '',
    salary_expectation: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const profile = await getProfile(user.id);
          if (profile) {
            setFormData(profileToFormData(profile));
          }
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert form data back to API format before sending
      const profileData = formDataToProfile(formData);
      await updateProfile(user?.id as string, profileData);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For numeric fields, only allow numbers
    if (name === 'experience_years' || name === 'salary_expectation') {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Professional Headline *
              </label>
              <input
                type="text"
                id="headline"
                name="headline"
                required
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer | React & Node.js Developer"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                required
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Current Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, TypeScript"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your skills separated by commas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience_years"
                  name="experience_years"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="education_level" className="block text-sm font-medium text-gray-700">
                  Education Level *
                </label>
                <select
                  id="education_level"
                  name="education_level"
                  required
                  value={formData.education_level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select education</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="resume_url" className="block text-sm font-medium text-gray-700">
                Resume URL
              </label>
              <input
                type="url"
                id="resume_url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="github_url" className="block text-sm font-medium text-gray-700">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700">
                Portfolio URL
              </label>
              <input
                type="url"
                id="portfolio_url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="preferred_role" className="block text-sm font-medium text-gray-700">
                Preferred Role *
              </label>
              <input
                type="text"
                id="preferred_role"
                name="preferred_role"
                required
                value={formData.preferred_role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer, Full Stack Engineer"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="preferred_location" className="block text-sm font-medium text-gray-700">
                Preferred Location *
              </label>
              <input
                type="text"
                id="preferred_location"
                name="preferred_location"
                required
                value={formData.preferred_location}
                onChange={handleChange}
                placeholder="e.g. Berlin, Munich, Remote"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="salary_expectation" className="block text-sm font-medium text-gray-700">
                Expected Annual Salary (€)
              </label>
              <input
                type="number"
                id="salary_expectation"
                name="salary_expectation"
                min="0"
                step="1000"
                value={formData.salary_expectation}
                onChange={handleChange}
                placeholder="e.g. 50000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your expected annual salary in euros
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
