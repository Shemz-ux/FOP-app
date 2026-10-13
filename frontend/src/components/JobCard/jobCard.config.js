/**
 * Static configuration for the job card and its deadline ribbon.
 * Kept separate from the component so the thresholds and wording can be
 * tuned without touching markup.
 */

// How many tags are rendered before the "+n" overflow pill
export const MAX_VISIBLE_TAGS = 3;

// Lines of the description that are used for the card summary
export const MAX_SUMMARY_LINES = 2;

// A job is urgent on its deadline day and the day before it
export const URGENT_MAX_DAYS = 1;

// A job is "closing soon" from this many days out, down to URGENT_MAX_DAYS + 1
export const SOON_MAX_DAYS = 7;

// Deadline states: ROLLING sits outside the sequence, the rest are the order a
// dated job passes through
export const DEADLINE_LEVELS = {
  ROLLING: 'rolling',
  CALM: 'calm',
  SOON: 'soon',
  URGENT: 'urgent',
  CLOSED: 'closed',
};

/**
 * Pill styling per state. Every tint has a dark variant so the ribbon stays
 * readable in both themes.
 */
export const DEADLINE_TONES = {
  [DEADLINE_LEVELS.ROLLING]: 'bg-secondary text-muted-foreground',
  [DEADLINE_LEVELS.CALM]: 'bg-secondary text-muted-foreground',
  [DEADLINE_LEVELS.SOON]:
    'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  [DEADLINE_LEVELS.URGENT]:
    'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  [DEADLINE_LEVELS.CLOSED]: 'bg-secondary text-muted-foreground',
};

// Wording for a job with no deadline set, which the rest of the app calls a
// rolling deadline
export const ROLLING_LABEL = 'Rolling';

export const ROLLING_TITLE = 'Applications are accepted on a rolling basis';

// Locale and formats used for deadline wording ("2 Nov", "2 November 2026")
export const DEADLINE_LOCALE = 'en-GB';

export const SHORT_DATE_FORMAT = { day: 'numeric', month: 'short' };

export const FULL_DATE_FORMAT = { day: 'numeric', month: 'long', year: 'numeric' };

// Description lines that are headings rather than prose, so they are skipped
export const SUMMARY_SKIP_PREFIXES = ['about the role'];
