-- Drop any existing policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;

-- Create comprehensive profile policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Enable insert for authentication service"
  on public.profiles for insert
  with check (true);  -- Allow inserts during signup

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);
