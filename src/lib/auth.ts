import { supabase } from './supabase';

export interface AuthError {
  message: string;
  status?: number;
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

    // Create the profile directly
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        user_type: userType,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw {
        message: 'Failed to create user profile: ' + profileError.message,
        status: profileError.code,
      };
    }

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