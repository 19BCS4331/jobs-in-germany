export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Profile {
  // Basic Information
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  location?: string;
  user_type: 'employer' | 'job_seeker';

  // Job seeker specific fields
  german_level?: GermanLevel;
  current_location?: string;
  desired_location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;

  // Settings
  settings?: {
    notifications: {
      emailNotifications: boolean;
      marketingEmails: boolean;
      // Employer specific
      newApplications?: boolean;
      applicationStatusChanges?: boolean;
      // Job seeker specific
      jobRecommendations?: boolean;
      savedJobsUpdates?: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
      showContactInfo: boolean;
      // Job seeker specific
      showResumeToEmployers?: boolean;
      allowMessaging?: boolean;
      // Employer specific
      showCompanyDetails?: boolean;
      allowJobSeekerApplications?: boolean;
    };
    preferences: {
      language: string;
    };
  };

  // Common fields
  created_at: string;
  updated_at: string;
}
