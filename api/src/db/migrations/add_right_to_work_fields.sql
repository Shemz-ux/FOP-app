-- Migration: Add right-to-work and sponsorship fields to jobseekers table
-- Date: 2026-09-09
-- Description: Adds optional has_right_to_work_uk (boolean) and requires_sponsorship
--              (boolean) fields to the jobseekers table. Both are nullable with no
--              default, so this is a metadata-only change - it does not rewrite or
--              lock existing rows, and does not affect any existing column or data.
--              NULL = not answered; TRUE/FALSE = explicit yes/no.

ALTER TABLE jobseekers
    ADD COLUMN IF NOT EXISTS has_right_to_work_uk BOOLEAN,
    ADD COLUMN IF NOT EXISTS requires_sponsorship BOOLEAN;

-- Verify the columns were added
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'jobseekers'
-- AND column_name IN ('has_right_to_work_uk', 'requires_sponsorship');
