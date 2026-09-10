/**
 * Helpers for Yes/No questions backed by a nullable boolean column
 * (e.g. has_right_to_work_uk, requires_sponsorship, school_meal_eligible,
 * first_gen_to_go_uni) where null/undefined means "not answered".
 */

/**
 * Convert a nullable boolean into the string a CustomSelect needs locally
 * ('' represents the unanswered/placeholder state).
 * @param {boolean|null|undefined} value
 * @returns {'yes'|'no'|''}
 */
export const booleanToYesNo = (value) => {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  return '';
};

/**
 * Convert a CustomSelect's 'yes' | 'no' | '' string back into the value
 * the API expects. '' means "not answered" and must become null, not false.
 * @param {'yes'|'no'|''} value
 * @returns {boolean|null}
 */
export const yesNoToBooleanOrNull = (value) => {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return null;
};

/**
 * Format a nullable boolean as a display label, distinguishing an explicit
 * "No" from "not answered" - important for admin-facing views where the two
 * must not be conflated.
 * @param {boolean|null|undefined} value
 * @returns {'Yes'|'No'|'Not provided'}
 */
export const formatYesNo = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'Not provided';
};
