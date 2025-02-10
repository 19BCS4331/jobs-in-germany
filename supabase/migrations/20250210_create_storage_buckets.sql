-- Create a new storage bucket for company assets
insert into storage.buckets (id, name, public)
values ('company-assets', 'company-assets', true);

-- Create a policy to allow public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'company-assets' );

-- Create a policy to allow authenticated users to upload files
create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated'
    and bucket_id = 'company-assets'
  );

-- Create a policy to allow users to update their own files
create policy "Users can update own files"
  on storage.objects for update
  using (
    auth.uid() = owner
    and bucket_id = 'company-assets'
  );

-- Create a policy to allow users to delete their own files
create policy "Users can delete own files"
  on storage.objects for delete
  using (
    auth.uid() = owner
    and bucket_id = 'company-assets'
  );
