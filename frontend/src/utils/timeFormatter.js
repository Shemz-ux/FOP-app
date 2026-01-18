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

export default {
  formatTimeAgo,
  formatDate,
  formatDateTime
};
