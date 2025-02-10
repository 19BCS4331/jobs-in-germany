-- Update job_applications table to rename applicant_id to user_id
ALTER TABLE job_applications RENAME COLUMN applicant_id TO user_id;
