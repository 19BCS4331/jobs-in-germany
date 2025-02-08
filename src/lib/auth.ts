import { supabase } from './supabase';

export interface AuthError {
  message: string;
  status?: number;
}

export async function signUp(email: string, password: string, userType: 'job_seeker' | 'employer') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw {
      message: error.message,
      status: error.status,
    };
  }

  if (!data.user) {
    throw {
      message: 'Failed to create user',
      status: 500,
    };
  }

  // Create profile with user type
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    email: email,
    user_type: userType,
  });

  if (profileError) {
    // If profile creation fails, we should delete the auth user
    await supabase.auth.admin.deleteUser(data.user.id);
    throw {
      message: 'Failed to create user profile',
      status: 500,
    };
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
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
    throw {
      message: error.message,
      status: error.status,
    };
  }
}