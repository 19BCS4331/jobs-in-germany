export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

export interface Job {
  id: string;
  title: string;
  company_id: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  headline?: string | null;
  resume_url?: string | null;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  created_at: string;
  cover_letter?: string | null;
  job: Job;
  user: User;
}

export interface JobWithCompany extends Job {
  location: string;
  type: string;
  company: {
    id: string;
    name: string;
    logo_url?: string | null;
  };
}

export interface ApplicationWithJobAndCompany extends Omit<Application, 'job'> {
  job: JobWithCompany;
}
