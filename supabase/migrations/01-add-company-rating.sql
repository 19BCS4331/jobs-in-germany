-- Add star_rating column to companies table
alter table public.companies 
add column star_rating numeric(2,1) default 0.0 check (star_rating >= 0 and star_rating <= 5.0);
