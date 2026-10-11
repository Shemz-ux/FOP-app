-- Migration: Add audience column to resources table
-- Date: 2026-10-02
-- Description: Adds audience field so resources can be public or restricted to society accounts.
--              Existing rows are backfilled to 'public' by the column default.

-- Add audience column, NOT NULL with default so existing resources stay public
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS audience VARCHAR(20) NOT NULL DEFAULT 'public'
CHECK (audience IN ('public', 'society'));

-- Create index for faster audience filtering
CREATE INDEX IF NOT EXISTS idx_resources_audience ON resources(audience);

-- Verify the column was added
-- SELECT column_name, data_type, column_default, is_nullable
-- FROM information_schema.columns 
-- WHERE table_name = 'resources' AND column_name = 'audience';
