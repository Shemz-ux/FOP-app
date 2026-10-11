// Settings and data helpers for the jobseeker profile.
import { Bookmark, Send } from 'lucide-react';

// Sections of the profile, in the order of the tab bar. The active one is kept
// in the URL (?tab=), matching the institution profile.
export const JOBSEEKER_SECTIONS = {
  saved: 'saved',
  applications: 'applications',
};

export const DEFAULT_JOBSEEKER_SECTION = JOBSEEKER_SECTIONS.saved;

export const JOBSEEKER_SECTION_ICONS = {
  saved: Bookmark,
  applications: Send,
};

// Options of the toggle inside each section
export const LIST_TYPES = {
  jobs: 'jobs',
  events: 'events',
};


// Display names for education levels that are not simply capitalised
export const EDUCATION_LEVEL_LABELS = {
  gcse: 'GCSE',
  a_level: 'A-Level',
  btec: 'BTEC',
  phd: 'PhD',
};

// Jobseeker fields edited in the education card
const EDUCATION_FIELDS = [
  'education_level',
  'institution_name',
  'uni_year',
  'degree_type',
  'area_of_study',
  'subject_one',
  'subject_two',
  'subject_three',
  'subject_four',
  'role_interest_option_one',
  'role_interest_option_two',
  'society',
];

const UNIVERSITY_FIELDS = ['uni_year', 'degree_type', 'area_of_study'];
const SUBJECT_FIELDS = ['subject_one', 'subject_two', 'subject_three', 'subject_four'];
const SCHOOL_LEVELS = ['gcse', 'a_level', 'btec'];
const UNIVERSITY_LEVELS = ['undergraduate', 'postgraduate', 'phd'];

// Jobseeker fields that describe the uploaded CV
export const CV_FIELDS = ['cv_file_name', 'cv_file_size', 'cv_storage_key', 'cv_storage_url', 'cv_uploaded_at'];

const pickFields = (source, fields, fallback) => {
  return Object.fromEntries(fields.map(field => [field, source?.[field] ?? fallback]));
};

// Education card values from a jobseeker record
export const toEducationData = (jobseeker) => pickFields(jobseeker, EDUCATION_FIELDS, '');

// CV card values from a jobseeker record, or null when no CV is uploaded
export const toCvData = (jobseeker) => {
  return jobseeker?.cv_file_name ? pickFields(jobseeker, CV_FIELDS, null) : null;
};

// Payload that removes the CV from a jobseeker record
export const EMPTY_CV_DATA = pickFields(null, CV_FIELDS, null);

// Clears the fields that do not apply to the chosen education level
// and turns empty strings into null before saving
export const cleanEducationData = (data) => {
  const cleaned = { ...data };
  const fieldsToClear = SCHOOL_LEVELS.includes(cleaned.education_level)
    ? UNIVERSITY_FIELDS
    : UNIVERSITY_LEVELS.includes(cleaned.education_level)
      ? SUBJECT_FIELDS
      : [];

  fieldsToClear.forEach(field => {
    cleaned[field] = null;
  });

  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '') cleaned[key] = null;
  });

  return cleaned;
};

// Line under the jobseeker's name, e.g. "Undergraduate • King's College London"
export const getEducationSummary = (jobseeker, studentLabel) => {
  const level = jobseeker.education_level;
  const levelLabel = EDUCATION_LEVEL_LABELS[level]
    || (level ? level.charAt(0).toUpperCase() + level.slice(1) : studentLabel);
  const institution = jobseeker.institution_name || levelLabel;

  return level === 'gcse'
    ? `${levelLabel} ${studentLabel} • ${institution}`
    : `${levelLabel} • ${institution}`;
};
