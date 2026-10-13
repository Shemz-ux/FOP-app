/**
 * Format a timestamp to show time elapsed since posting
 * @param {string|Date} timestamp - The timestamp when the item was posted
 * @returns {string} Formatted string like "2 days ago", "3 hours ago", etc.
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'recently';

  const now = new Date();
  const posted = new Date(timestamp);
  
  // Calculate difference in milliseconds
  const diffMs = now - posted;
  
  // Convert to different time units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Return appropriate format based on time elapsed
  if (diffYears > 0) {
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  } else if (diffMonths > 0) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  } else if (diffWeeks > 0) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else if (diffDays > 0) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else {
    return 'just now';
  }
};

/**
 * Format a timestamp to a readable date string
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string like "Jan 15, 2025"
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Format a timestamp to a readable date and time string
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date and time string like "Jan 15, 2025 at 3:45 PM"
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * A calendar date (a job deadline, an event day, a date of birth) is a day, not
 * an instant. These helpers read one without letting a timezone move it.
 */

// Matches a plain calendar date, e.g. the "2026-11-02" a DATE column sends back
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const isUtcMidnight = (date) =>
  date.getUTCHours() === 0 &&
  date.getUTCMinutes() === 0 &&
  date.getUTCSeconds() === 0 &&
  date.getUTCMilliseconds() === 0;

/**
 * Parse a calendar date into local midnight on the day it names.
 *
 * A date-only string is read as a calendar date, so it is not shifted by the
 * reader's offset. A timestamp that lands exactly on UTC midnight names a day
 * too, and is read the same way; any other timestamp is read as an instant and
 * reduced to the day it falls on locally.
 *
 * @param {string|Date|null|undefined} value
 * @returns {Date|null} null when there is no readable date
 */
export const parseCalendarDate = (value) => {
  if (!value) return null;

  if (typeof value === 'string') {
    const dateOnly = DATE_ONLY_PATTERN.exec(value.trim());
    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return isUtcMidnight(parsed)
    ? new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate())
    : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

/**
 * Format a calendar date for display, e.g. "Nov 2, 2026".
 *
 * @param {string|Date} value
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string} empty string when there is no readable date
 */
export const formatCalendarDate = (
  value,
  options = { month: 'short', day: 'numeric', year: 'numeric' }
) => {
  const date = parseCalendarDate(value);
  return date ? date.toLocaleDateString('en-US', options) : '';
};

/**
 * Turn a stored calendar date into the "YYYY-MM-DD" an <input type="date">
 * needs. Anything else leaves the field blank rather than feeding the form a
 * value it cannot show.
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export const toDateInputValue = (value) => {
  const date = parseCalendarDate(value);
  if (!date) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export default {
  formatTimeAgo,
  formatDate,
  formatDateTime,
  parseCalendarDate,
  formatCalendarDate,
  toDateInputValue
};
