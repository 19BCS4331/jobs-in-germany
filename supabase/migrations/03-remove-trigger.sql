-- Remove the trigger and function as we're handling profile creation in the application
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
