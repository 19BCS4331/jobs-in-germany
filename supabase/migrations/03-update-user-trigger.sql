-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Ensure public role has necessary permissions
grant usage on schema public to public;
grant all on public.profiles to public;

-- Create updated function with better error handling
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer 
set search_path = public
as $$
begin
  -- Only insert if the profile doesn't exist
  if not exists (select 1 from public.profiles where id = new.id) then
    insert into public.profiles (id, email, user_type)
    values (new.id, new.email, null);
  end if;
  return new;
exception
  when others then
    -- Log the error (this will appear in Supabase logs)
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
