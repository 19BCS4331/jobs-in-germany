import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  status?: number;
}

export async function createUserProfile(user: User, userType?: 'job_seeker' | 'employer') {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return { user: existingProfile };
    }

    // For Google Sign-In, extract name parts from user metadata
    const { full_name = '', email = '' } = user.user_metadata || {};
    const nameParts = full_name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Get the user type from localStorage if not provided
    const finalUserType = userType || localStorage.getItem('selectedUserType') as 'job_seeker' | 'employer' || 'job_seeker';

    // Create new profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: email || user.email,
        full_name: full_name,
        // first_name: firstName,
        // last_name: lastName,
        user_type: finalUserType,
        // avatar_url: user.user_metadata?.avatar_url,
        settings: {
          notifications: {
            emailNotifications: true,
            marketingEmails: false,
          },
          privacy: {
            profileVisibility: 'public',
            showContactInfo: false,
          },
          preferences: {
            language: 'en',
          },
        },
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw {
        message: 'Failed to create user profile: ' + profileError.message,
        status: profileError.code,
      };
    }

    // Clear the stored user type after successful profile creation
    localStorage.removeItem('selectedUserType');

    return { user: profile };
  } catch (err) {
    console.error('Profile creation error:', err);
    throw err;
  }
}

export async function signUp(email: string, password: string, userType: 'job_seeker' | 'employer') {
  try {
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw {
        message: authError.message,
        status: authError.status,
      };
    }

    if (!authData.user) {
      throw {
        message: 'Failed to create user',
        status: 500,
      };
    }

    // Create the user profile and wait for it to complete
    await createUserProfile(authData.user, userType);

    // Add a small delay to ensure the profile is available in the database
    await new Promise(resolve => setTimeout(resolve, 1000));

    return authData;
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw {
      message: error.message,
      status: error.status,
    };
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw {
      message: error.message,
      status: error.status,
    };
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });

  if (error) {
    console.error('Reset password error:', error);
    throw {
      message: error.message,
      status: error.status,
    };
  }
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error('Update password error:', error);
    throw {
      message: error.message,
      status: error.status,
    };
  }
}