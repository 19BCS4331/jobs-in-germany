-- Insert sample profiles (employers)
insert into public.profiles (id, email, user_type, full_name, headline, bio, location)
values
  ('2dd5d039-9244-4d82-9295-05ef6c5c099c', 'employer1@example.com', 'employer', 'John Smith', 'CEO at TechCorp GmbH', 'Leading innovation in tech', 'Berlin'),
  ('9e3bb91e-f890-4a3f-819c-03bd82ec3e1e', 'employer2@example.com', 'employer', 'Emma Weber', 'HR Director at DataWorks', 'Building great teams', 'Munich');

-- Insert sample profiles (job seekers)
insert into public.profiles (id, email, user_type, full_name, headline, bio, location, skills, experience_years, education_level, preferred_role, preferred_location, salary_expectation)
values
  ('68382e5b-b486-4317-a789-29d27064cb44', 'seeker1@example.com', 'job_seeker', 'Michael Brown', 'Senior Software Engineer', 'Full stack developer with 5+ years experience', 'Berlin', 'JavaScript, React, Node.js, Python', '5-10', 'Master''s', 'Full Stack Developer', 'Berlin, Remote', '75000'),
  ('39b4d536-55ea-4a29-a6a0-8770dc9babf3', 'seeker2@example.com', 'job_seeker', 'Sarah Miller', 'Product Manager', 'Experienced in leading agile teams', 'Hamburg', 'Product Management, Agile, Scrum', '3-5', 'Bachelor''s', 'Product Manager', 'Hamburg, Berlin', '65000');

-- Insert sample companies
insert into public.companies (id, name, description, website, location, size, industry, logo_url, owner_id, star_rating)
values
  ('a1b2c3d4-e5f6-4321-a1b2-c3d4e5f6a7b8', 'TechCorp GmbH', 'Leading software development company', 'https://techcorp.de', 'Berlin', '51-200', 'Technology', 'https://example.com/logos/techcorp.png', '2dd5d039-9244-4d82-9295-05ef6c5c099c', 4.5),
  ('b2c3d4e5-f6a7-5432-b2c3-d4e5f6a7b8c9', 'DataWorks', 'Data analytics and AI solutions', 'https://dataworks.de', 'Munich', '11-50', 'Technology', 'https://example.com/logos/dataworks.png', '9e3bb91e-f890-4a3f-819c-03bd82ec3e1e', 4.2);

-- Insert sample jobs
insert into public.jobs (id, title, description, company_id, location, type, salary_min, salary_max, requirements)
values
  ('c3d4e5f6-a7b8-6543-c3d4-e5f6a7b8c9d0', 'Senior Software Engineer', 'Join our team as a senior software engineer working on cutting-edge projects', 'a1b2c3d4-e5f6-4321-a1b2-c3d4e5f6a7b8', 'Berlin', 'full-time', 65000, 85000, ARRAY['5+ years experience', 'JavaScript expertise', 'React/Node.js', 'System design']),
  ('d4e5f6a7-b8c9-7654-d4e5-f6a7b8c9d0e1', 'Product Manager', 'Lead product development for our data analytics platform', 'b2c3d4e5-f6a7-5432-b2c3-d4e5f6a7b8c9', 'Munich', 'full-time', 55000, 75000, ARRAY['3+ years PM experience', 'Agile methodology', 'Technical background', 'Strong communication']),
  ('e5f6a7b8-c9d0-8765-e5f6-a7b8c9d0e1f2', 'Frontend Developer', 'Create beautiful and responsive user interfaces', 'a1b2c3d4-e5f6-4321-a1b2-c3d4e5f6a7b8', 'Berlin', 'full-time', 45000, 65000, ARRAY['3+ years experience', 'React expertise', 'TypeScript', 'UI/UX knowledge']);

-- Insert sample job applications
insert into public.job_applications (id, job_id, applicant_id, status, cover_letter)
values
  ('f6a7b8c9-d0e1-9876-f6a7-b8c9d0e1f2a3', 'c3d4e5f6-a7b8-6543-c3d4-e5f6a7b8c9d0', '68382e5b-b486-4317-a789-29d27064cb44', 'pending', 'I am excited to apply for this position...'),
  ('a7b8c9d0-e1f2-0987-a7b8-c9d0e1f2a3b4', 'd4e5f6a7-b8c9-7654-d4e5-f6a7b8c9d0e1', '39b4d536-55ea-4a29-a6a0-8770dc9babf3', 'reviewing', 'With my background in product management...');

-- Insert sample blog posts
insert into public.blog_posts (id, title, content, excerpt, image_url, author_id)
values
  ('b8c9d0e1-f2a3-2109-b8c9-d0e1f2a3b4c5', 'The Complete Guide to Job Hunting in Germany', 'Full article content here...', 'Everything you need to know about finding your dream job in Germany, from preparation to acceptance.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', '2dd5d039-9244-4d82-9295-05ef6c5c099c'),
  ('c9d0e1f2-a3b4-3210-c9d0-e1f2a3b4c5d6', 'Understanding German Work Culture', 'Full article content here...', 'Learn about the unique aspects of German workplace culture and how to thrive in it.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', '9e3bb91e-f890-4a3f-819c-03bd82ec3e1e');

-- Insert sample resources
insert into public.resources (id, title, description, category, url, icon)
values
  ('d0e1f2a3-b4c5-4321-d0e1-f2a3b4c5d6e7', 'German Work Visa Guide', 'Complete guide to obtaining a work visa in Germany', 'Visa & Work Permits', 'https://example.com/visa-guide', 'FileText'),
  ('e1f2a3b4-c5d6-5432-e1f2-a3b4c5d6e7f8', 'German Language Resources', 'Free and paid resources for learning German', 'Language & Culture', 'https://example.com/language', 'Book'),
  ('f2a3b4c5-d6e7-6543-f2a3-b4c5d6e7f8a9', 'CV Writing Guide', 'How to write a German-style CV and cover letter', 'Career Development', 'https://example.com/cv-guide', 'GraduationCap');
