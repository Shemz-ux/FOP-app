-- Link jobseekers to societies by a real foreign key.
--
-- Until now jobseekers.society has been free text. Signup picks from a dropdown
-- of real society names, but the profile edit field is free text and societies
-- can rename themselves, so the text drifts and cannot be relied on.
--
-- This migration is ADDITIVE and reversible:
--   - no existing column is modified; jobseekers.society is never rewritten
--   - society_id starts null on every row and is only filled where the text
--     matches a society exactly (ignoring case and surrounding whitespace)
--   - rows that match nothing keep their text and stay null
--
-- Run api/src/db/assess-society-link.js against the target database FIRST.
-- If it reports duplicate society names, stop: societies.name has no unique
-- constraint, and the backfill below would attach students to an arbitrary one
-- of them, exposing their email and course to the wrong society.
--
-- To undo:
--   UPDATE jobseekers SET society_id = NULL;
--   DROP INDEX IF EXISTS idx_jobseekers_society_id;
--   ALTER TABLE jobseekers DROP COLUMN society_id;

BEGIN;

-- Nullable with no default, so this is metadata-only: no table rewrite.
-- ON DELETE SET NULL is required - removeSociety() is a plain DELETE, and the
-- default NO ACTION would start raising foreign key violations once a society
-- has members.
ALTER TABLE jobseekers
    ADD COLUMN IF NOT EXISTS society_id INT
    REFERENCES societies(society_id) ON DELETE SET NULL;

-- Backfill. Mirrors LINK_JOBSEEKERS_TO_SOCIETIES in api/src/db/society-link.js
-- Exact match only, deliberately not fuzzy.
UPDATE jobseekers j
SET society_id = s.society_id
FROM societies s
WHERE j.society_id IS NULL
  AND j.society IS NOT NULL
  AND BTRIM(j.society) <> ''
  AND LOWER(BTRIM(j.society)) = LOWER(BTRIM(s.name));

-- Every members query filters on this
CREATE INDEX IF NOT EXISTS idx_jobseekers_society_id ON jobseekers (society_id);

COMMIT;

-- After committing, record what did not link:
--
--   SELECT j.society AS unmatched_value, COUNT(*) AS jobseekers,
--          ARRAY_AGG(j.jobseeker_id ORDER BY j.jobseeker_id) AS jobseeker_ids
--   FROM jobseekers j
--   WHERE j.society IS NOT NULL AND BTRIM(j.society) <> '' AND j.society_id IS NULL
--   GROUP BY j.society ORDER BY 2 DESC;
