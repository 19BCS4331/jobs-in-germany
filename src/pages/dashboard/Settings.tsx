import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../lib/AuthContext';

type UserSettings = Profile['settings'];

const getDefaultSettings = (userType: 'employer' | 'job_seeker'): UserSettings => ({
  notifications: {
    emailNotifications: true,
    marketingEmails: false,
    ...(userType === 'employer' ? {
      newApplications: true,
      applicationStatusChanges: true,
      jobRecommendations: undefined,
      savedJobsUpdates: undefined,
    } : {
      newApplications: undefined,
      applicationStatusChanges: undefined,
      jobRecommendations: true,
      savedJobsUpdates: true,
    })
  },
  privacy: {
    profileVisibility: 'public',
    showContactInfo: true,
    ...(userType === 'employer' ? {
      showCompanyDetails: true,
      allowJobSeekerApplications: true,
      showResumeToEmployers: undefined,
      allowMessaging: undefined,
    } : {
      showCompanyDetails: undefined,
      allowJobSeekerApplications: undefined,
      showResumeToEmployers: true,
      allowMessaging: true,
    })
  },
  preferences: {
    language: 'en'
  }
});

const visibilityOptions = [
  { value: 'public', label: 'Public - Visible to all users' },
  { value: 'private', label: 'Private - Only visible to approved users' }
];

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => 
    getDefaultSettings(profile?.user_type || 'job_seeker')
  );

  useEffect(() => {
    if (profile?.settings && profile.user_type) {
      // Merge profile settings with default settings to ensure all fields exist
      setSettings({
        ...getDefaultSettings(profile.user_type),
        ...profile.settings,
      });
    }
  }, [profile]);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('update_profile_settings', {
        profile_id: user.id,
        new_settings: settings
      });

      if (error) throw error;

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmployerNotifications = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="newApplications" className="font-medium text-gray-700">
            New Applications
          </label>
          <p className="text-sm text-gray-500">Get notified when you receive new job applications</p>
        </div>
        <input
          type="checkbox"
          id="newApplications"
          name="newApplications"
          checked={settings.notifications.newApplications}
          onChange={handleNotificationChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="applicationStatusChanges" className="font-medium text-gray-700">
            Application Status Changes
          </label>
          <p className="text-sm text-gray-500">Get notified when applicants update their application status</p>
        </div>
        <input
          type="checkbox"
          id="applicationStatusChanges"
          name="applicationStatusChanges"
          checked={settings.notifications.applicationStatusChanges}
          onChange={handleNotificationChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
    </>
  );

  const renderJobSeekerNotifications = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="jobRecommendations" className="font-medium text-gray-700">
            Job Recommendations
          </label>
          <p className="text-sm text-gray-500">Receive personalized job recommendations</p>
        </div>
        <input
          type="checkbox"
          id="jobRecommendations"
          name="jobRecommendations"
          checked={settings.notifications.jobRecommendations}
          onChange={handleNotificationChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="savedJobsUpdates" className="font-medium text-gray-700">
            Saved Jobs Updates
          </label>
          <p className="text-sm text-gray-500">Get updates about your saved jobs</p>
        </div>
        <input
          type="checkbox"
          id="savedJobsUpdates"
          name="savedJobsUpdates"
          checked={settings.notifications.savedJobsUpdates}
          onChange={handleNotificationChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
    </>
  );

  const renderEmployerPrivacySettings = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="showCompanyDetails" className="font-medium text-gray-700">
            Show Company Details
          </label>
          <p className="text-sm text-gray-500">Make your company details visible to job seekers</p>
        </div>
        <input
          type="checkbox"
          id="showCompanyDetails"
          name="showCompanyDetails"
          checked={settings.privacy.showCompanyDetails}
          onChange={handlePrivacyChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="allowJobSeekerApplications" className="font-medium text-gray-700">
            Allow Job Applications
          </label>
          <p className="text-sm text-gray-500">Allow job seekers to apply to your job postings</p>
        </div>
        <input
          type="checkbox"
          id="allowJobSeekerApplications"
          name="allowJobSeekerApplications"
          checked={settings.privacy.allowJobSeekerApplications}
          onChange={handlePrivacyChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
    </>
  );

  const renderJobSeekerPrivacySettings = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="showResumeToEmployers" className="font-medium text-gray-700">
            Show Resume to Employers
          </label>
          <p className="text-sm text-gray-500">Allow employers to view your resume</p>
        </div>
        <input
          type="checkbox"
          id="showResumeToEmployers"
          name="showResumeToEmployers"
          checked={settings.privacy.showResumeToEmployers}
          onChange={handlePrivacyChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="allowMessaging" className="font-medium text-gray-700">
            Allow Messaging
          </label>
          <p className="text-sm text-gray-500">Allow employers to send you direct messages</p>
        </div>
        <input
          type="checkbox"
          id="allowMessaging"
          name="allowMessaging"
          checked={settings.privacy.allowMessaging}
          onChange={handlePrivacyChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Account Settings Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <Select
              label="Language"
              name="language"
              value={settings.preferences.language}
              onChange={handlePreferenceChange}
              options={[
                { value: 'en', label: 'English' },
                { value: 'de', label: 'German' }
              ]}
            />
          </div>
        </div>

        {/* Notification Settings Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.notifications.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            {/* User type specific notification settings */}
            {profile?.user_type === 'employer' 
              ? renderEmployerNotifications() 
              : renderJobSeekerNotifications()
            }

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                  Marketing Emails
                </label>
                <p className="text-sm text-gray-500">Receive updates about new features and opportunities</p>
              </div>
              <input
                type="checkbox"
                id="marketingEmails"
                name="marketingEmails"
                checked={settings.notifications.marketingEmails}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
          <div className="space-y-6">
            <Select
              label="Profile Visibility"
              name="profileVisibility"
              value={settings.privacy.profileVisibility}
              onChange={handlePrivacyChange}
              options={visibilityOptions}
            />

            {/* User type specific privacy settings */}
            {profile?.user_type === 'employer' 
              ? renderEmployerPrivacySettings() 
              : renderJobSeekerPrivacySettings()
            }

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="showContactInfo" className="font-medium text-gray-700">
                  Show Contact Information
                </label>
                <p className="text-sm text-gray-500">Allow others to see your contact details</p>
              </div>
              <input
                type="checkbox"
                id="showContactInfo"
                name="showContactInfo"
                checked={settings.privacy.showContactInfo}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
