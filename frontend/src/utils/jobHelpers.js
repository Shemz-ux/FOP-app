import { parseCalendarDate } from './timeFormatter';

/**
 * Derive a job's display status from its stored fields.
 *
 * Status is deliberately derived rather than stored: a job that passes its deadline
 * becomes "closed" on its own, with no write and no scheduled job. The same reasoning
 * applies to featured eligibility (see isFeaturedLive below).
 *
 * @returns {'active' | 'closed' | 'draft'}
 */
export function deriveJobStatus(job) {
  if (!job?.is_active) return 'draft';

  // No deadline means a rolling deadline, which never closes.
  if (!job.deadline) return 'active';

  // A job stays open until 11:59pm on its deadline day.
  const deadlineDay = parseCalendarDate(job.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return deadlineDay && deadlineDay < today ? 'closed' : 'active';
}

/**
 * Whether a featured job is actually eligible to appear in the public Featured Jobs
 * section.
 *
 * Must stay in step with fetchFeaturedJobs in api/src/models/jobs-advanced.js, which
 * requires is_active AND (deadline IS NULL OR deadline >= CURRENT_DATE). Because the
 * API leaves is_featured set to true on an expired job, admin-side counts have to apply
 * this rule themselves or they will report more featured jobs than members can see.
 */
export function isFeaturedLive(job) {
  return Boolean(job?.is_featured) && deriveJobStatus(job) === 'active';
}

/**
 * Featured and past its deadline.
 *
 * Mirrors the predicate of PATCH /api/jobs/featured/expired exactly
 * (is_featured AND deadline IS NOT NULL AND deadline < CURRENT_DATE), so the count the
 * admin is shown always equals the number the clear action will actually change.
 *
 * Note this is NOT simply "featured and not live". A featured job that is inactive but
 * whose deadline is still in the future is neither live nor expired: it is featured but
 * unpublished, and the clear action deliberately leaves it alone rather than discarding
 * the flag on a draft an admin is still preparing. Its row already reads "Draft", so the
 * state is visible without a third counter.
 */
export function isFeaturedExpired(job) {
  if (!job?.is_featured || !job.deadline) return false;

  const deadlineDay = parseCalendarDate(job.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Boolean(deadlineDay) && deadlineDay < today;
}
