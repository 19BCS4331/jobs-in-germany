import { supabase } from './supabase';

// Types
export interface Company {
  id: string;
  name: string;
  description: string;
  website?: string | null;
  location: string;
  size: string;
  industry: string;
  logo_url?: string | null;
  owner_id: string;
  created_at?: string;
  star_rating?: number | null;
  founded_year?: number | null;
  headquarters?: string | null;
  funding_stage?: string | null;
  mission?: string | null;
  values?: string | null;
  culture?: string | null;
  benefits?: string[] | null;
  tech_stack?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  facebook_url?: string | null;
}

// Minimal company info returned in lists
export type CompanyBasic = Pick<Company, 'id' | 'name' | 'logo_url'>;

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary_min?: number | null;
  salary_max?: number | null;
  requirements: string[];
  company_id: string;
  created_at?: string;
  company?: CompanyBasic | null;
}

export interface JobWithFullCompany extends Omit<Job, 'company'> {
  company?: Company | null;
}

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  user_type: 'job_seeker' | 'employer';
  full_name?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  skills?: string[] | null;
  experience_years?: number | null;
  education_level?: string | null;
  resume_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  preferred_role?: string | null;
  preferred_location?: string | null;
  salary_expectation?: number | null;
}

export type ProfileBasic = Pick<Profile, 'id' | 'full_name' | 'email' | 'headline' | 'resume_url'>;

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter?: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at?: string;
  job?: Job | null;
  user?: ProfileBasic | null;
}

export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string | null;
  published_at: string;
  author_id: string;
  author?: ProfileBasic | null;
  tags?: string[] | null;
  category?: string | null;
  read_time?: number | null;
}

export interface Resource {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon?: string | null;
  type?: 'article' | 'video' | 'tool' | 'guide' | null;
  tags?: string[] | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  author_id?: string | null;
  author?: ProfileBasic | null;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  notify_before_deadline?: boolean;
  notification_days?: number;
  job?: Job | null;
}

// Helper type for Supabase nested relations
type SupabaseJob = Omit<Job, 'company'> & {
  company: CompanyBasic[] | null;
};

type SupabaseJobWithFullCompany = Omit<Job, 'company'> & {
  company: Company[] | null;
};

type SupabaseApplication = Omit<Application, 'job' | 'user'> & {
  job?: null;
  user: ProfileBasic[] | null;
};

type SupabaseApplicationWithJob = Omit<Application, 'job' | 'user'> & {
  job: (Omit<Job, 'company'> & { company: CompanyBasic[] | null })[] | null;
  user?: null;
};

// Helper functions to transform Supabase response types to our types
function transformJob(job: SupabaseJob): Job {
  return {
    ...job,
    company: job.company?.[0] || null
  };
}

function transformJobWithFullCompany(job: SupabaseJobWithFullCompany): JobWithFullCompany {
  return {
    ...job,
    company: job.company?.[0] || null
  };
}

function transformApplication(app: SupabaseApplication): Application {
  return {
    ...app,
    user: app.user?.[0] || null
  };
}

function transformApplicationWithJob(app: SupabaseApplicationWithJob): Application {
  return {
    ...app,
    job: app.job?.[0] ? {
      ...app.job[0],
      company: app.job[0].company?.[0] || null
    } : null
  };
}

// API Functions

// Companies
export async function getCompanies(filters?: { search?: string; industry?: string; }): Promise<Company[]> {
  let query = supabase.from('companies').select('*');

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  if (filters?.industry) {
    query = query.eq('industry', filters.industry);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }

  return data;
}

export async function getCompany(id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      description,
      website,
      location,
      size,
      industry,
      logo_url,
      owner_id,
      created_at,
      star_rating,
      founded_year,
      headquarters,
      funding_stage,
      mission,
      values,
      culture,
      benefits,
      tech_stack,
      linkedin_url,
      twitter_url,
      facebook_url
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data as Company;
}

export async function getCompanyByOwner(userId: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      description,
      website,
      location,
      size,
      industry,
      logo_url,
      owner_id,
      created_at,
      star_rating,
      founded_year,
      headquarters,
      funding_stage,
      mission,
      values,
      culture,
      benefits,
      tech_stack,
      linkedin_url,
      twitter_url,
      facebook_url
    `)
    .eq('owner_id', userId)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data as Company;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at'>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select(`
      id,
      name,
      description,
      website,
      location,
      size,
      industry,
      logo_url,
      owner_id,
      created_at,
      star_rating,
      founded_year,
      headquarters,
      funding_stage,
      mission,
      values,
      culture,
      benefits,
      tech_stack,
      linkedin_url,
      twitter_url,
      facebook_url
    `)
    .single();

  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }

  return data as Company;
}

export async function updateCompany(id: string, company: Partial<Omit<Company, 'id' | 'created_at'>>): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', id)
    .select(`
      id,
      name,
      description,
      website,
      location,
      size,
      industry,
      logo_url,
      owner_id,
      created_at,
      star_rating,
      founded_year,
      headquarters,
      funding_stage,
      mission,
      values,
      culture,
      benefits,
      tech_stack,
      linkedin_url,
      twitter_url,
      facebook_url
    `)
    .single();

  if (error) {
    console.error('Error updating company:', error);
    throw error;
  }

  return data as Company;
}

export async function deleteCompany(id: string): Promise<void> {
  // First, delete all associated jobs
  const { error: jobsError } = await supabase
    .from('jobs')
    .delete()
    .eq('company_id', id);

  if (jobsError) {
    console.error('Error deleting company jobs:', jobsError);
    throw jobsError;
  }

  // Then delete the company
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
}

// Jobs
export async function getJobs(filters?: { 
  search?: string; 
  location?: string;
  company_id?: string;
  type?: Job['type'];
  salary_min?: number;
  salary_max?: number;
}): Promise<Job[]> {
  try {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:companies!inner (
          id,
          name,
          logo_url
        )
      `);

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.salary_min) {
      query = query.gte('salary_min', filters.salary_min);
    }

    if (filters?.salary_max) {
      query = query.lte('salary_max', filters.salary_max);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    return (data as any[]).map(job => ({
      ...job,
      company: job.company ? {
        id: job.company.id,
        name: job.company.name,
        logo_url: job.company.logo_url
      } : null
    })) as Job[];
  } catch (error) {
    console.error('Error in getJobs:', error);
    throw error;
  }
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies!inner (
          id,
          name,
          logo_url,
          description,
          website,
          location
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      company: data.company ? {
        id: data.company.id,
        name: data.company.name,
        logo_url: data.company.logo_url,
        description: data.company.description,
        website: data.company.website,
        location: data.company.location
      } : null
    } as Job;
  } catch (error) {
    console.error('Error in getJob:', error);
    throw error;
  }
}

export async function getJobsByCompany(companyId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      description,
      location,
      type,
      salary_min,
      salary_max,
      requirements,
      company_id,
      created_at,
      company:companies (
        id,
        name,
        logo_url
      )
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching company jobs:', error);
    throw error;
  }

  return (data as SupabaseJob[]).map(transformJob);
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'company'>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select(`
      id,
      title,
      description,
      location,
      type,
      salary_min,
      salary_max,
      requirements,
      company_id,
      created_at,
      company:companies (
        id,
        name,
        logo_url
      )
    `)
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return transformJob(data as SupabaseJob);
}

export async function updateJob(id: string, job: Partial<Omit<Job, 'id' | 'created_at' | 'company'>>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .update(job)
    .eq('id', id)
    .select(`
      id,
      title,
      description,
      location,
      type,
      salary_min,
      salary_max,
      requirements,
      company_id,
      created_at,
      company:companies (
        id,
        name,
        logo_url
      )
    `)
    .single();

  if (error) {
    console.error('Error updating job:', error);
    throw error;
  }

  return transformJob(data as SupabaseJob);
}

export async function deleteJob(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      created_at,
      title,
      content,
      excerpt,
      image_url,
      published_at,
      author_id
    `)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  return data as BlogPost[];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      created_at,
      title,
      content,
      excerpt,
      image_url,
      published_at,
      author_id
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data as BlogPost;
}

// Resources
export async function getResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      created_at,
      title,
      description,
      category,
      url,
      icon
    `)
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }

  return data as Resource[];
}

// Profiles
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      created_at,
      email,
      user_type,
      full_name,
      headline,
      bio,
      location,
      skills,
      experience_years,
      education_level,
      resume_url,
      linkedin_url,
      github_url,
      portfolio_url,
      preferred_role,
      preferred_location,
      salary_expectation
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as Profile;
}

export async function updateProfile(userId: string, profile: Partial<Omit<Profile, 'id' | 'created_at' | 'email' | 'user_type'>>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data as Profile;
}

// Job Applications
export async function applyToJob(jobId: string, userId: string, coverLetter?: string): Promise<Application> {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([{
      job_id: jobId,
      user_id: userId,
      cover_letter: coverLetter || null,
      status: 'pending' as const
    }])
    .select(`
      id,
      job_id,
      user_id,
      cover_letter,
      status,
      created_at,
      job:jobs!inner (
        id,
        title,
        description,
        location,
        type,
        salary_min,
        salary_max,
        requirements,
        company_id,
        created_at,
        company:companies!inner (
          id,
          name,
          logo_url
        )
      )
    `)
    .single();

  if (error) {
    console.error('Error applying to job:', error);
    throw error;
  }

  return transformApplicationWithJob(data as SupabaseApplicationWithJob);
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      user:profiles (
        id,
        full_name,
        email,
        headline,
        resume_url
      ),
      job:jobs (
        *,
        company:companies (
          id,
          name,
          logo_url
        )
      )
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  return data.map((app: any) => ({
    ...app,
    user: app.user || null,
    job: app.job ? {
      ...app.job,
      company: app.job.company || null
    } : null
  }));
}

export async function getMyApplications(userId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      job:jobs (
        *,
        company:companies (
          id,
          name,
          logo_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }

  return data.map((app: any) => ({
    ...app,
    job: app.job ? {
      ...app.job,
      company: app.job.company || null
    } : null
  }));
}

export async function updateApplicationStatus(applicationId: string, status: Application['status']): Promise<Application> {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ status })
    .eq('id', applicationId)
    .select(`
      id,
      job_id,
      user_id,
      cover_letter,
      status,
      created_at,
      user:profiles!inner (
        id,
        full_name,
        email,
        headline,
        resume_url
      )
    `)
    .single();

  if (error) {
    console.error('Error updating application status:', error);
    throw error;
  }

  return transformApplication(data as SupabaseApplication);
}

// Job Bookmarks
export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select(`
      id,
      user_id,
      job_id,
      created_at,
      notify_before_deadline,
      notification_days
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }

  // Load job details for each saved job
  const jobsWithDetails = await Promise.all(
    data.map(async (savedJob) => {
      try {
        const jobDetails = await getJob(savedJob.job_id);
        return { ...savedJob, job: jobDetails };
      } catch (error) {
        console.error(`Error loading job ${savedJob.job_id}:`, error);
        return { ...savedJob, job: null };
      }
    })
  );

  return jobsWithDetails;
}

export async function saveJob(userId: string, jobId: string): Promise<SavedJob> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .insert({
      user_id: userId,
      job_id: jobId,
      notify_before_deadline: true,
      notification_days: 7,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving job:', error);
    throw error;
  }

  return data;
}

export async function unsaveJob(savedJobId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('id', savedJobId);

  if (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
}

export async function updateSavedJobNotification(
  savedJobId: string,
  notify: boolean,
  days?: number
): Promise<SavedJob> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .update({
      notify_before_deadline: notify,
      notification_days: notify ? days || 7 : null,
    })
    .eq('id', savedJobId)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved job notification:', error);
    throw error;
  }

  return data;
}

export async function checkIfJobIsSaved(jobId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_id', jobId)
      .maybeSingle();

    return !error && data !== null;
  } catch (error) {
    console.error('Error checking saved status:', error);
    return false;
  }
}

export async function getSavedJobId(jobId: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_id', jobId)
      .maybeSingle();

    return data?.id || null;
  } catch (error) {
    console.error('Error getting saved job id:', error);
    return null;
  }
}

export async function checkIfJobApplied(jobId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('job_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_id', jobId)
      .maybeSingle();

    if (error) {
      console.error('Error checking job application status:', error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error('Error in checkIfJobApplied:', error);
    return false;
  }
}
