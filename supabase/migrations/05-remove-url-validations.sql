-- Drop the trigger first
DROP TRIGGER IF EXISTS validate_company_urls ON companies;

-- Drop the validation function
DROP FUNCTION IF EXISTS validate_url();

-- Remove the funding_stage check constraint if it exists
ALTER TABLE companies ALTER COLUMN funding_stage DROP NOT NULL;
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_funding_stage_check;
