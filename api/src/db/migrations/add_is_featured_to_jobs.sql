-- Migration: Add is_featured column to jobs table
-- Date: 2026-10-26
-- Description: Adds is_featured boolean field so admins can promote jobs to the
--              Featured Jobs section on the public jobs page. Also adds the first
--              indexes on the jobs table.

-- Add is_featured column with default FALSE.
-- ADD COLUMN with a constant default is metadata-only on PG 11+, so this backfills
-- every existing row with no table rewrite. All existing jobs become non-featured.
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Partial index serving the featured-jobs query:
--   WHERE is_active = true AND is_featured = true ORDER BY created_at DESC
-- Deliberately NOT a plain btree on the boolean (as on webinars): a btree over a
-- skewed boolean indexes every row to serve a query that wants a handful, and the
-- planner will rarely choose it. Keying on created_at DESC also means the ORDER BY
-- is satisfied by the index, so there is no sort node.
CREATE INDEX IF NOT EXISTS idx_jobs_featured_active
  ON jobs (created_at DESC)
  WHERE is_featured = true AND is_active = true;

-- Composite index covering the existing hot path, used by fetchJobsAdvanced,
-- getJobsCount, fetchActiveJobs and fetchJobs:
--   WHERE is_active = $1 ... ORDER BY created_at DESC
-- Equality prefix + ordering suffix removes the sort step. Before this migration the
-- jobs table had no index at all.
CREATE INDEX IF NOT EXISTS idx_jobs_active_created_at
  ON jobs (is_active, created_at DESC);

-- Note: the category filters in models/jobs-advanced.js are written as
-- LOWER(col) = ANY($n) and are not indexable as written. These two indexes help the
-- scan and sort, not the filters.

-- Verify the column and indexes were added
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'jobs' AND column_name = 'is_featured';
-- SELECT indexname FROM pg_indexes WHERE tablename = 'jobs';
