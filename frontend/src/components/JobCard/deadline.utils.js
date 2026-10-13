import { parseCalendarDate } from '../../utils/timeFormatter';
import {
  DEADLINE_LEVELS,
  DEADLINE_LOCALE,
  FULL_DATE_FORMAT,
  MAX_SUMMARY_LINES,
  ROLLING_LABEL,
  ROLLING_TITLE,
  SHORT_DATE_FORMAT,
  SOON_MAX_DAYS,
  SUMMARY_SKIP_PREFIXES,
  URGENT_MAX_DAYS,
} from './jobCard.config';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfLocalDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Turn a deadline value into the exact moment applications close: 11:59pm on
 * the deadline day, in the reader's own timezone.
 *
 * @param {string|Date|null|undefined} value
 * @returns {Date|null} null when there is no usable deadline
 */
export const parseDeadline = (value) => {
  const day = parseCalendarDate(value);
  if (!day) return null;

  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
};

/**
 * Whole days between today and the deadline day: 0 means it closes tonight,
 * negative means it has already closed.
 */
export const daysUntilDeadline = (deadline, now = new Date()) =>
  Math.round((startOfLocalDay(deadline) - startOfLocalDay(now)) / MS_PER_DAY);

const formatDeadlineDate = (deadline, format) =>
  deadline.toLocaleDateString(DEADLINE_LOCALE, format);

const levelFor = (daysLeft) => {
  if (daysLeft < 0) return DEADLINE_LEVELS.CLOSED;
  if (daysLeft <= URGENT_MAX_DAYS) return DEADLINE_LEVELS.URGENT;
  if (daysLeft <= SOON_MAX_DAYS) return DEADLINE_LEVELS.SOON;
  return DEADLINE_LEVELS.CALM;
};

const labelFor = (level, daysLeft, deadline) => {
  switch (level) {
    case DEADLINE_LEVELS.CLOSED:
      return 'Closed';
    case DEADLINE_LEVELS.URGENT:
      return daysLeft === 0 ? 'Closes today' : 'Closes tomorrow';
    case DEADLINE_LEVELS.SOON:
      return `${daysLeft} days left`;
    default:
      return `Closes ${formatDeadlineDate(deadline, SHORT_DATE_FORMAT)}`;
  }
};

// A job with no deadline set takes applications for as long as it is listed
const rollingStatus = () => ({
  level: DEADLINE_LEVELS.ROLLING,
  daysLeft: null,
  label: ROLLING_LABEL,
  fullDate: null,
  title: ROLLING_TITLE,
  srLabel: `Application deadline: ${ROLLING_LABEL.toLowerCase()}`,
  isClosed: false,
});

/**
 * Describe a job's deadline for the ribbon.
 *
 * The state is derived from the current date every time this runs, so a job
 * moves calm -> soon -> urgent -> closed on its own as the days pass. A job
 * with no deadline is rolling and stays that way.
 *
 * @param {string|Date|null|undefined} value raw deadline from the API
 * @param {Date} [now] injectable clock, for tests
 * @returns {{
 *   level: string,
 *   daysLeft: number|null,
 *   label: string,
 *   fullDate: string|null,
 *   title: string,
 *   srLabel: string,
 *   isClosed: boolean
 * }|null} null only when a deadline was given but could not be read
 */
export const getDeadlineStatus = (value, now = new Date()) => {
  // No deadline at all is a rolling deadline, the wording used across the app
  const isBlank = value === null || value === undefined ||
    (typeof value === 'string' && value.trim() === '');
  if (isBlank) return rollingStatus();

  const deadline = parseDeadline(value);
  if (!deadline) return null;

  const daysLeft = daysUntilDeadline(deadline, now);
  const level = levelFor(daysLeft);
  const label = labelFor(level, daysLeft, deadline);
  const fullDate = formatDeadlineDate(deadline, FULL_DATE_FORMAT);
  const isClosed = level === DEADLINE_LEVELS.CLOSED;

  return {
    level,
    daysLeft,
    label,
    fullDate,
    title: isClosed
      ? `Applications closed ${fullDate}`
      : `Applications close ${fullDate}`,
    srLabel: `Application deadline: ${label}`,
    isClosed,
  };
};

/**
 * Condense a job description into the couple of prose lines the card shows,
 * dropping section headings such as "About the role" or "Requirements:".
 *
 * @param {string} description
 * @returns {string}
 */
export const buildJobSummary = (description) => {
  if (!description) return '';

  const summary = description
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();
      if (!trimmed || trimmed.endsWith(':')) return false;
      return !SUMMARY_SKIP_PREFIXES.some((prefix) => lower.startsWith(prefix));
    })
    .slice(0, MAX_SUMMARY_LINES)
    .join(' ');

  return summary || description;
};
