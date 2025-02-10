-- Add new columns to companies table for enhanced company profiles
ALTER TABLE companies
  -- Basic company information
  ADD COLUMN IF NOT EXISTS founded_year INTEGER,
  ADD COLUMN IF NOT EXISTS headquarters TEXT,
  ADD COLUMN IF NOT EXISTS funding_stage TEXT CHECK (funding_stage IN ('Bootstrapped', 'Seed', 'Series A', 'Series B', 'Series C+', 'Public')),
  
  -- Company culture and values
  ADD COLUMN IF NOT EXISTS mission TEXT,
  ADD COLUMN IF NOT EXISTS values TEXT,
  ADD COLUMN IF NOT EXISTS culture TEXT,
  
  -- Benefits and perks (using array type for multiple selections)
  ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}',
  
  -- Technical details
  ADD COLUMN IF NOT EXISTS tech_stack TEXT,
  
  -- Social media links
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- Add comments to the new columns for better documentation
COMMENT ON COLUMN companies.founded_year IS 'The year the company was founded';
COMMENT ON COLUMN companies.headquarters IS 'The city and country where the company is headquartered';
COMMENT ON COLUMN companies.funding_stage IS 'Current funding stage of the company';
COMMENT ON COLUMN companies.mission IS 'Company mission statement';
COMMENT ON COLUMN companies.values IS 'Company core values';
COMMENT ON COLUMN companies.culture IS 'Description of company culture';
COMMENT ON COLUMN companies.benefits IS 'Array of benefits offered by the company';
COMMENT ON COLUMN companies.tech_stack IS 'Technologies used by the company';
COMMENT ON COLUMN companies.linkedin_url IS 'Company LinkedIn profile URL';
COMMENT ON COLUMN companies.twitter_url IS 'Company Twitter profile URL';
COMMENT ON COLUMN companies.facebook_url IS 'Company Facebook profile URL';

-- Add validation for URLs
CREATE OR REPLACE FUNCTION validate_url() 
RETURNS trigger AS $$
BEGIN
  IF NEW.website IS NOT NULL AND NEW.website !~ '^https?:\/\/.+' THEN
    RAISE EXCEPTION 'Website URL must start with http:// or https://';
  END IF;
  
  IF NEW.linkedin_url IS NOT NULL AND NEW.linkedin_url !~ '^https?:\/\/(www\.)?linkedin\.com\/.+' THEN
    RAISE EXCEPTION 'LinkedIn URL must be a valid LinkedIn profile URL';
  END IF;
  
  IF NEW.twitter_url IS NOT NULL AND NEW.twitter_url !~ '^https?:\/\/(www\.)?twitter\.com\/.+' THEN
    RAISE EXCEPTION 'Twitter URL must be a valid Twitter profile URL';
  END IF;
  
  IF NEW.facebook_url IS NOT NULL AND NEW.facebook_url !~ '^https?:\/\/(www\.)?facebook\.com\/.+' THEN
    RAISE EXCEPTION 'Facebook URL must be a valid Facebook profile URL';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for URL validation
DROP TRIGGER IF EXISTS validate_company_urls ON companies;
CREATE TRIGGER validate_company_urls
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION validate_url();

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_companies_founded_year ON companies(founded_year);
CREATE INDEX IF NOT EXISTS idx_companies_funding_stage ON companies(funding_stage);
CREATE INDEX IF NOT EXISTS idx_companies_headquarters ON companies(headquarters);
