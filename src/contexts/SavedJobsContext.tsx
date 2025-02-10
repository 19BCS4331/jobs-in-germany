import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

interface SavedJobsContextType {
  savedJobIds: Set<string>;
  checkIfJobIsSaved: (jobId: string) => boolean;
  addSavedJob: (jobId: string) => void;
  removeSavedJob: (jobId: string) => void;
  isLoading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadSavedJobs() {
      if (!user) {
        setSavedJobIds(new Set());
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const jobIds = new Set(data.map(item => item.job_id));
        setSavedJobIds(jobIds);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    loadSavedJobs();
  }, [user]);

  const checkIfJobIsSaved = (jobId: string) => {
    return savedJobIds.has(jobId);
  };

  const addSavedJob = (jobId: string) => {
    setSavedJobIds(prev => new Set([...prev, jobId]));
  };

  const removeSavedJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      return newSet;
    });
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobIds,
        checkIfJobIsSaved,
        addSavedJob,
        removeSavedJob,
        isLoading
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (context === undefined) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
}
