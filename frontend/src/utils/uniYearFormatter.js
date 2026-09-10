/**
 * Display labels for the uni_year_enum column. Mirrors formatUniYear() in
 * api/src/controllers/jobseekers.js so admin-facing pages read consistently
 * with the CSV export instead of showing the raw lowercase DB enum value.
 */
const UNI_YEAR_LABELS = {
  foundation: 'Foundation',
  '1st': '1st Year',
  '2nd': '2nd Year',
  '3rd': '3rd Year',
  '4th': '4th Year',
  '5th': '5th Year',
  masters: 'Masters',
  phd_year_1: 'PhD Year 1',
  phd_year_2: 'PhD Year 2',
  phd_year_3: 'PhD Year 3',
  phd_year_4: 'PhD Year 4',
  graduated: 'Graduated',
};

/**
 * @param {string} year - a uni_year_enum value
 * @returns {string} display label, or the raw value if unrecognised
 */
export const formatUniYear = (year) => UNI_YEAR_LABELS[year] || year;
