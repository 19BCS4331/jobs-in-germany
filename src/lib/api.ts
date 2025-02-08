import { supabase } from './supabase';

// Types
export interface Company {
  id: string;
  created_at: string;
  name: string;
  description: string;
  website?: string;
  location: string;
  size: string;
  industry: string;
  logo_url?: string;
  owner_id: string;
  star_rating: number;
}

export interface Job {
  id: string;
  created_at: string;
  title: string;
  description: string;
  company_id: string;
  location: string;
  type: string;
  salary_min: number;
  salary_max: number;
  requirements: string[];
  company?: Company;
  applications_count?: number;
}

export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published_at: string;
  author_id: string;
}

export interface Resource {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: string;
}

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  user_type: 'job_seeker' | 'employer';
  full_name?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills?: string;
  experience_years?: string;
  education_level?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  preferred_role?: string;
  preferred_location?: string;
  salary_expectation?: string;
}

// API Functions

// Companies
export async function getCompanies(filters?: { search?: string; industry?: string; }) {
  let query = supabase.from('companies').select('*');

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  if (filters?.industry) {
    query = query.eq('industry', filters.industry);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getCompany(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCompanyByOwner(userId: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, company: Partial<Company>) {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Jobs
export async function getJobs(filters?: { 
  search?: string; 
  location?: string;
  company_id?: string;
  type?: string;
  salary_min?: number;
  salary_max?: number;
}) {
  let query = supabase
    .from('jobs')
    .select('*, company:companies(*)');

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

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getJob(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getJobsByCompany(companyId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      applications:job_applications(count)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(job => ({
    ...job,
    applications_count: job.applications?.[0]?.count || 0
  }));
}

export async function createJob(job: Omit<Job, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJob(id: string, job: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update(job)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Blog Posts
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBlogPost(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Resources
export async function getResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}

// Profiles
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Job Applications
export async function applyToJob(jobId: string, userId: string, coverLetter?: string) {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      job_id: jobId,
      applicant_id: userId,
      cover_letter: coverLetter,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyApplications(userId: string) {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, job:jobs(*), company:jobs(company(*))')
    .eq('applicant_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getJobApplications(jobId: string) {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, applicant:profiles(*)')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateApplicationStatus(applicationId: string, status: 'pending' | 'reviewing' | 'accepted' | 'rejected') {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
