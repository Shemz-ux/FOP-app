// Utility functions to generate tags for jobs and events
import { 
  JOB_INDUSTRIES,
  JOB_ROLE_TYPES, 
  JOB_WORK_TYPES,
  EVENT_TYPES,
  EVENT_LOCATION_TYPES,
  EVENT_INDUSTRIES,
  getVariantFromOptions 
} from './dropdownOptions';

// ==================== JOB TAGS ====================

// Helper function to get variant from dropdown options
const getJobIndustryVariant = (value) => getVariantFromOptions(JOB_INDUSTRIES, value);
const getJobRoleVariant = (value) => getVariantFromOptions(JOB_ROLE_TYPES, value);
const getJobWorkTypeVariant = (value) => getVariantFromOptions(JOB_WORK_TYPES, value);

/**
 * Generate tags for a job based on its properties
 * @param {Object} job - Job object with industry, role_type, work_type
 * @returns {Array} Array of tag objects with label and variant
 */
export const generateJobTags = (job) => {
  const tags = [];

  // Add role type tag
  if (job.role_type) {
    tags.push({
      label: job.role_type,
      variant: getJobRoleVariant(job.role_type)
    });
  }

  // Add work type tag
  if (job.work_type) {
    // Find the matching option to get the display label
    const workTypeOption = JOB_WORK_TYPES.find(opt => opt.value === job.work_type);
    tags.push({
      label: workTypeOption?.label || job.work_type,
      variant: getJobWorkTypeVariant(job.work_type)
    });
  }

  // Add industry tag
  if (job.industry) {
    tags.push({
      label: job.industry,
      variant: getJobIndustryVariant(job.industry)
    });
  }


  return tags;
};

/**
 * Add tags to a single job object
 * @param {Object} job - Job object
 * @returns {Object} Job object with tags property
 */
export const addJobTags = (job) => {
  return {
    ...job,
    tags: generateJobTags(job)
  };
};

/**
 * Add tags to an array of jobs
 * @param {Array} jobs - Array of job objects
 * @returns {Array} Array of job objects with tags property
 */
export const addJobTagsToList = (jobs) => {
  if (!Array.isArray(jobs)) return jobs;
  return jobs.map(job => addJobTags(job));
};

// ==================== EVENT TAGS ====================

// Helper functions to get variant from dropdown options
const getEventTypeVariant = (value) => getVariantFromOptions(EVENT_TYPES, value);
const getEventLocationVariant = (value) => getVariantFromOptions(EVENT_LOCATION_TYPES, value);
const getEventIndustryVariant = (value) => getVariantFromOptions(EVENT_INDUSTRIES, value);

/**
 * Generate tags for an event based on its properties
 * @param {Object} event - Event object with event_type, location_type, industry
 * @returns {Array} Array of tag objects with label and variant
 */
export const generateEventTags = (event) => {
  const tags = [];

  // Add event type tag
  if (event.event_type) {
    // Find matching option by label (seed data uses formatted labels)
    const matchingOption = EVENT_TYPES.find(opt => opt.label === event.event_type);
    
    tags.push({
      label: event.event_type,
      variant: matchingOption?.variant || 'gray'
    });
  }

  // Add location type tag
  if (event.location_type) {
    // Find matching option by label
    const matchingOption = EVENT_LOCATION_TYPES.find(opt => opt.label === event.location_type);
    
    tags.push({
      label: event.location_type,
      variant: matchingOption?.variant || 'gray'
    });
  }

  // Add industry tag
  if (event.industry) {
    tags.push({
      label: event.industry,
      variant: getEventIndustryVariant(event.industry)
    });
  }

  return tags;
};

/**
 * Add tags to a single event object
 * @param {Object} event - Event object
 * @returns {Object} Event object with tags property
 */
export const addEventTags = (event) => {
  return {
    ...event,
    tags: generateEventTags(event)
  };
};

/**
 * Add tags to an array of events
 * @param {Array} events - Array of event objects
 * @returns {Array} Array of event objects with tags property
 */
export const addEventTagsToList = (events) => {
  if (!Array.isArray(events)) return events;
  return events.map(event => addEventTags(event));
};

// ==================== EXPORTS ====================

export default {
  // Job functions
  generateJobTags,
  addJobTags,
  addJobTagsToList,
  
  // Event functions
  generateEventTags,
  addEventTags,
  addEventTagsToList,
};
