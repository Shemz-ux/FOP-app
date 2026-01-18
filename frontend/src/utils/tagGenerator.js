// Utility functions to generate tags for jobs and events

// ==================== JOB TAGS ====================

// Experience level to variant mapping
const experienceLevelVariants = {
  'Entry level': 'blue',
  'Mid level': 'purple',
  'Senior level': 'orange',
  'Expert': 'red',
  'Intermediate': 'purple',
};

// Role type to variant mapping
const roleTypeVariants = {
  'Internship': 'cyan',
  'Apprenticeship': 'teal',
  'Graduate Scheme': 'indigo',
  'Graduate': 'indigo',
  'Placement': 'pink',
  'Full-time': 'green',
  'Part-time': 'yellow',
  'Contract': 'gray',
  'Freelance': 'slate',
};

// Work type to variant mapping
const workTypeVariants = {
  'Remote': 'emerald',
  'Hybrid': 'violet',
  'On-site': 'amber',
  'In-person': 'amber',
};

/**
 * Generate tags for a job based on its properties
 * @param {Object} job - Job object with experience_level, role_type, work_type
 * @returns {Array} Array of tag objects with label and variant
 */
export const generateJobTags = (job) => {
  const tags = [];

  // Add experience level tag
  if (job.experience_level) {
    tags.push({
      label: job.experience_level,
      variant: experienceLevelVariants[job.experience_level] || 'blue'
    });
  }

  // Add role type tag
  if (job.role_type) {
    tags.push({
      label: job.role_type,
      variant: roleTypeVariants[job.role_type] || 'green'
    });
  }

  // Add work type tag
  if (job.work_type) {
    tags.push({
      label: job.work_type,
      variant: workTypeVariants[job.work_type] || 'emerald'
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

// Event type to variant mapping
const eventTypeVariants = {
  'career_fair': 'blue',
  'Career Fair': 'blue',
  'networking': 'purple',
  'Networking': 'purple',
  'workshop': 'green',
  'Workshop': 'green',
  'panel_discussion': 'orange',
  'Panel Discussion': 'orange',
  'seminar': 'pink',
  'Seminar': 'pink',
  'conference': 'red',
  'Conference': 'red',
  'webinar': 'cyan',
  'Webinar': 'cyan',
  'meetup': 'teal',
  'Meetup': 'teal',
};

// Location type to variant mapping
const locationTypeVariants = {
  'online': 'emerald',
  'Online': 'emerald',
  'Virtual': 'emerald',
  'in_person': 'amber',
  'In-person': 'amber',
  'On-site': 'amber',
  'hybrid': 'violet',
  'Hybrid': 'violet',
};

// Industry to variant mapping
const industryVariants = {
  'Technology': 'blue',
  'Finance': 'green',
  'Engineering': 'orange',
  'Marketing': 'pink',
  'Consulting': 'purple',
  'Healthcare': 'red',
  'Education': 'cyan',
  'General': 'gray',
  'Law': 'indigo',
  'Media': 'yellow',
  'Retail': 'teal',
  'Manufacturing': 'slate',
};

/**
 * Generate tags for an event based on its properties
 * @param {Object} event - Event object with event_type, location_type, industry
 * @returns {Array} Array of tag objects with label and variant
 */
export const generateEventTags = (event) => {
  const tags = [];

  // Add event type tag
  if (event.event_type) {
    const label = event.event_type.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    tags.push({
      label: label,
      variant: eventTypeVariants[event.event_type] || eventTypeVariants[label] || 'blue'
    });
  }

  // Add location type tag
  if (event.location_type) {
    const label = event.location_type === 'online' ? 'Virtual' : 
                  event.location_type === 'in_person' ? 'In-person' : 
                  event.location_type.charAt(0).toUpperCase() + event.location_type.slice(1);
    
    tags.push({
      label: label,
      variant: locationTypeVariants[event.location_type] || locationTypeVariants[label] || 'emerald'
    });
  }

  // Add industry tag
  if (event.industry) {
    tags.push({
      label: event.industry,
      variant: industryVariants[event.industry] || 'gray'
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
