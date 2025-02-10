import React, { useCallback, useMemo } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getProfile, updateProfile } from '../../lib/api';
import { toast } from 'react-hot-toast';
import type { Profile as ProfileType } from '../../lib/api';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Book,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Code2,
  Pencil,
  Check,
  X,
} from 'lucide-react';

// Memoized input component to prevent re-renders
const Input = React.memo(({ 
  type = 'text',
  value,
  onChange,
  name,
  placeholder,
  className
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  className?: string;
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    className={className}
    placeholder={placeholder}
  />
));

// Memoized textarea component
const TextArea = React.memo(({ 
  value,
  onChange,
  name,
  placeholder,
  className,
  rows = 4
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    className={className}
    placeholder={placeholder}
    rows={rows}
  />
));

const ProfileSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState<ProfileType | null>(null);
  const [formState, setFormState] = React.useState<{
    full_name: string;
    email: string;
    location: string;
    headline: string;
    preferred_role: string;
    experience_years: string;
    bio: string;
    skills: string;
    resume_url: string;
    portfolio_url: string;
    github_url: string;
    linkedin_url: string;
  }>({
    full_name: '',
    email: '',
    location: '',
    headline: '',
    preferred_role: '',
    experience_years: '',
    bio: '',
    skills: '',
    resume_url: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: ''
  });

  // Load profile data
  React.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  // Initialize form state when profile loads or edit mode changes
  React.useEffect(() => {
    if (profile && isEditing) {
      setFormState({
        full_name: profile.full_name || '',
        email: profile.email || '',
        location: profile.location || '',
        headline: profile.headline || '',
        preferred_role: profile.preferred_role || '',
        experience_years: profile.experience_years?.toString() || '',
        bio: profile.bio || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        resume_url: profile.resume_url || '',
        portfolio_url: profile.portfolio_url || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || ''
      });
    }
  }, [profile, isEditing]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile(user!.id);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async () => {
    if (!user || !profile) return;

    try {
      // Convert form state back to ProfileType
      const updatedProfile: Partial<ProfileType> = {
        ...profile,
        full_name: formState.full_name,
        email: formState.email,
        location: formState.location,
        headline: formState.headline,
        preferred_role: formState.preferred_role,
        experience_years: formState.experience_years ? parseInt(formState.experience_years) : null,
        bio: formState.bio,
        skills: formState.skills.split(',').map(s => s.trim()).filter(Boolean),
        resume_url: formState.resume_url,
        portfolio_url: formState.portfolio_url,
        github_url: formState.github_url,
        linkedin_url: formState.linkedin_url
      };

      await updateProfile(user.id, updatedProfile);
      setProfile(updatedProfile as ProfileType);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Memoize the input class to prevent recreation
  const inputClass = useMemo(() => 
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
    []
  );

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <User className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'Edit your profile information below' : 'View and manage your profile information'}
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="full_name"
                      value={formState.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.full_name || '-'}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.email || '-'}</div>
                  )}
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <Input
                      name="location"
                      value={formState.location}
                      onChange={handleInputChange}
                      placeholder="Berlin, Germany"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.location || '-'}</div>
                  )}
                </div>

                {/* Headline */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Headline
                  </label>
                  {isEditing ? (
                    <Input
                      name="headline"
                      value={formState.headline}
                      onChange={handleInputChange}
                      placeholder="Senior Software Engineer"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.headline || '-'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Professional Information</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preferred Role */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Preferred Role
                  </label>
                  {isEditing ? (
                    <Input
                      name="preferred_role"
                      value={formState.preferred_role}
                      onChange={handleInputChange}
                      placeholder="Software Engineer"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.preferred_role || '-'}</div>
                  )}
                </div>

                {/* Years of Experience */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      name="experience_years"
                      value={formState.experience_years}
                      onChange={handleInputChange}
                      placeholder="5"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.experience_years || '-'}</div>
                  )}
                </div>

                {/* Skills */}
                <div className="col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Code2 className="h-4 w-4 mr-2" />
                    Skills
                  </label>
                  {isEditing ? (
                    <>
                      <Input
                        name="skills"
                        value={formState.skills}
                        onChange={handleInputChange}
                        placeholder="React, TypeScript, Node.js"
                        className={inputClass}
                      />
                      <p className="mt-1 text-xs text-gray-500">Separate skills with commas</p>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No skills listed</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Book className="h-4 w-4 mr-2" />
                    Bio
                  </label>
                  {isEditing ? (
                    <TextArea
                      name="bio"
                      value={formState.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">
                      {profile.bio || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Links & Social Media */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Links & Social Media</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume URL */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Book className="h-4 w-4 mr-2" />
                    Resume URL
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      name="resume_url"
                      value={formState.resume_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/resume.pdf"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.resume_url || '-'}</div>
                  )}
                </div>

                {/* Portfolio Website */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Globe className="h-4 w-4 mr-2" />
                    Portfolio Website
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      name="portfolio_url"
                      value={formState.portfolio_url}
                      onChange={handleInputChange}
                      placeholder="https://portfolio.example.com"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.portfolio_url || '-'}</div>
                  )}
                </div>

                {/* GitHub Profile */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Profile
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      name="github_url"
                      value={formState.github_url}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.github_url || '-'}</div>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      name="linkedin_url"
                      value={formState.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{profile.linkedin_url || '-'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
