/**
 * The single rule for linking a jobseeker's free-text society to a real society.
 *
 * Used by the migration (add_society_id_to_jobseekers.sql, which repeats this
 * statement so it can be applied standalone with psql), by both seed scripts,
 * and by the assessment script's reporting. Keep all four in step.
 *
 * Matching is exact once case and surrounding whitespace are ignored. It is
 * deliberately not fuzzy: a near-miss links a student to a society that can
 * then see their email and course, so anything uncertain stays unlinked and
 * goes to a human instead.
 *
 * Never modifies jobseekers.society. Only fills society_id where it is null.
 */
export const LINK_JOBSEEKERS_TO_SOCIETIES = `
    UPDATE jobseekers j
    SET society_id = s.society_id
    FROM societies s
    WHERE j.society_id IS NULL
      AND j.society IS NOT NULL
      AND BTRIM(j.society) <> ''
      AND LOWER(BTRIM(j.society)) = LOWER(BTRIM(s.name))
`;

/**
 * Jobseekers whose society text matched nothing. These keep their text and are
 * invisible to every society's member list until a human maps them.
 */
export const UNLINKED_JOBSEEKERS = `
    SELECT j.society AS unmatched_value,
           COUNT(*)::int AS jobseekers,
           ARRAY_AGG(j.jobseeker_id ORDER BY j.jobseeker_id) AS jobseeker_ids
    FROM jobseekers j
    WHERE j.society IS NOT NULL
      AND BTRIM(j.society) <> ''
      AND j.society_id IS NULL
    GROUP BY j.society
    ORDER BY 2 DESC, 1 ASC
`;
