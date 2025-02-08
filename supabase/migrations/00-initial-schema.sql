-- Create profiles table that extends auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  user_type text not null check (user_type in ('job_seeker', 'employer')),
  full_name text,
  headline text,
  bio text,
  location text,
  skills text,
  experience_years text,
  education_level text,
  resume_url text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  preferred_role text,
  preferred_location text,
  salary_expectation text
);

-- Create companies table
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text not null,
  website text,
  location text not null,
  size text not null,
  industry text not null,
  logo_url text,
  owner_id uuid references public.profiles(id) on delete cascade not null
);

-- Create jobs table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  location text not null,
  type text not null,
  salary_min integer not null,
  salary_max integer not null,
  requirements text[] not null default '{}'::text[]
);

-- Create job applications table
create table public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  applicant_id uuid references public.profiles(id) on delete cascade not null,
  cover_letter text,
  status text not null check (status in ('pending', 'reviewing', 'accepted', 'rejected')) default 'pending',
  unique(job_id, applicant_id)
);

-- Create blog posts table
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  excerpt text not null,
  image_url text not null,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references public.profiles(id) on delete cascade not null
);

-- Create resources table
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  category text not null,
  url text not null,
  icon text not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.blog_posts enable row level security;
alter table public.resources enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Companies policies
create policy "Companies are viewable by everyone"
  on public.companies for select
  using (true);

create policy "Employers can create companies"
  on public.companies for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and user_type = 'employer'
    )
  );

create policy "Company owners can update their companies"
  on public.companies for update
  using (owner_id = auth.uid());

-- Jobs policies
create policy "Jobs are viewable by everyone"
  on public.jobs for select
  using (true);

create policy "Employers can create jobs for their companies"
  on public.jobs for insert
  with check (
    exists (
      select 1 from public.companies
      where id = company_id
      and owner_id = auth.uid()
    )
  );

create policy "Employers can update jobs for their companies"
  on public.jobs for update
  using (
    exists (
      select 1 from public.companies
      where id = company_id
      and owner_id = auth.uid()
    )
  );

-- Job applications policies
create policy "Job seekers can view their own applications"
  on public.job_applications for select
  using (applicant_id = auth.uid());

create policy "Employers can view applications for their jobs"
  on public.job_applications for select
  using (
    exists (
      select 1 from public.jobs j
      inner join public.companies c on j.company_id = c.id
      where job_applications.job_id = j.id
      and c.owner_id = auth.uid()
    )
  );

create policy "Job seekers can create applications"
  on public.job_applications for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and user_type = 'job_seeker'
    )
  );

create policy "Employers can update application status"
  on public.job_applications for update
  using (
    exists (
      select 1 from public.jobs j
      inner join public.companies c on j.company_id = c.id
      where job_applications.job_id = j.id
      and c.owner_id = auth.uid()
    )
  );

-- Blog posts policies
create policy "Blog posts are viewable by everyone"
  on public.blog_posts for select
  using (true);

create policy "Admins can manage blog posts"
  on public.blog_posts for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and user_type = 'employer'
    )
  );

-- Resources policies
create policy "Resources are viewable by everyone"
  on public.resources for select
  using (true);

create policy "Admins can manage resources"
  on public.resources for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and user_type = 'employer'
    )
  );

-- Functions and triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, user_type)
  values (new.id, new.email, 'job_seeker');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
