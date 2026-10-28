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

/** Featured and flagged, but not currently shown to members. */
export function isFeaturedExpired(job) {
  return Boolean(job?.is_featured) && !isFeaturedLive(job);
}
