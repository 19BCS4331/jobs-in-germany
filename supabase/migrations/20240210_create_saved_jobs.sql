-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notify_before_deadline BOOLEAN DEFAULT true,
    notification_days INTEGER DEFAULT 7,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Add RLS policies
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own saved jobs
CREATE POLICY "Users can view their own saved jobs"
    ON public.saved_jobs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to create their own saved jobs
CREATE POLICY "Users can create their own saved jobs"
    ON public.saved_jobs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own saved jobs
CREATE POLICY "Users can update their own saved jobs"
    ON public.saved_jobs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own saved jobs
CREATE POLICY "Users can delete their own saved jobs"
    ON public.saved_jobs
    FOR DELETE
    USING (auth.uid() = user_id);
