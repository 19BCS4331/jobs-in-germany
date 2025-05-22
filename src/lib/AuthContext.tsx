import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import toast from 'react-hot-toast';
import type { Profile } from '../types/profile';
import { getProfile } from './api';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  profile:null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session ? 'exists' : 'none');
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await getProfile(session.user.id);
          // Use type assertion to handle the type mismatch
          setProfile(profileData as any);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Replace the current auth state change listener with this version:
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  
  // First update the user state immediately
  setUser(session?.user ?? null);
  
  // Handle sign out separately
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('preventRedirect');
    setProfile(null);
    setLoading(false);
    return;
  }
  
  // For sign in events, fetch the profile
  if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
    // Fetch profile in a separate non-blocking way
    getProfile(session.user.id)
      .then(profileData => {
        setProfile(profileData as any);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setProfile(null);
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
});

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
