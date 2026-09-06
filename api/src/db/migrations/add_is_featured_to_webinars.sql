-- Migration: Add is_featured column to webinars table
-- Date: 2026-09-06
-- Description: Adds is_featured boolean field to allow promoting webinars to featured list

-- Add is_featured column with default FALSE
ALTER TABLE webinars 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create index for faster featured queries
CREATE INDEX IF NOT EXISTS idx_webinars_is_featured ON webinars(is_featured);

-- Verify the column was added
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'webinars' AND column_name = 'is_featured';
