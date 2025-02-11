-- Add settings columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT jsonb_build_object(
  'notifications', jsonb_build_object(
    'emailNotifications', true,
    'marketingEmails', false,
    -- Employer specific
    'newApplications', true,
    'applicationStatusChanges', true,
    -- Job seeker specific
    'jobRecommendations', true,
    'savedJobsUpdates', true
  ),
  'privacy', jsonb_build_object(
    'profileVisibility', 'public',
    'showContactInfo', true,
    -- Job seeker specific
    'showResumeToEmployers', true,
    'allowMessaging', true,
    -- Employer specific
    'showCompanyDetails', true,
    'allowJobSeekerApplications', true
  ),
  'preferences', jsonb_build_object(
    'language', 'en'
  )
);

-- Create a function to update settings
CREATE OR REPLACE FUNCTION update_profile_settings(
  profile_id UUID,
  new_settings JSONB
) RETURNS public.profiles AS $$
DECLARE
  updated_profile public.profiles;
BEGIN
  UPDATE public.profiles
  SET settings = new_settings
  WHERE id = profile_id
  RETURNING * INTO updated_profile;
  
  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
