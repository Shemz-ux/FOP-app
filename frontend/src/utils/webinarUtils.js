/**
 * Webinar Utility Functions
 * 
 * Utility functions for webinar-related operations including:
 * - YouTube URL validation and parsing
 * - Duration formatting
 * - View count formatting
 * - Metadata helpers
 */

/**
 * Validate YouTube URL format (client-side validation before sending to backend)
 * Supports multiple YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * 
 * @param {string} url - YouTube URL to validate
 * @returns {boolean} True if valid YouTube URL format
 */
export const isValidYouTubeUrl = (url) => {
  if (!url) return false;
  
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

/**
 * Extract video ID from YouTube URL (for display purposes only)
 * Backend handles the actual extraction for data storage
 * 
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null if invalid
 */
export const extractVideoIdForDisplay = (url) => {
  if (!url) return null;
  
  const patterns = [
    /[?&]v=([^&]+)/,           // youtube.com/watch?v=VIDEO_ID
    /youtu\.be\/([^?]+)/,      // youtu.be/VIDEO_ID
    /embed\/([^?]+)/           // youtube.com/embed/VIDEO_ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

/**
 * Format duration from seconds to human-readable format
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "1:23:45" or "12:34")
 * 
 * @example
 * formatDuration(3665)  // "1:01:05"
 * formatDuration(125)   // "2:05"
 * formatDuration(45)    // "0:45"
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parse duration string (e.g., "1:23:45") back to seconds
 * Useful for calculations or comparisons
 * 
 * @param {string} durationString - Duration string (e.g., "1:23:45" or "12:34")
 * @returns {number} Total seconds
 * 
 * @example
 * parseDuration("1:01:05")  // 3665
 * parseDuration("2:05")     // 125
 */
export const parseDuration = (durationString) => {
  if (!durationString) return 0;
  
  const parts = durationString.split(':').map(Number);
  
  if (parts.length === 3) {
    // H:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // M:SS
    return parts[0] * 60 + parts[1];
  }
  
  return 0;
};

/**
 * Format view count to human-readable format
 * 
 * @param {number} count - View count
 * @returns {string} Formatted count (e.g., "1.2K", "3.4M")
 * 
 * @example
 * formatViewCount(1234)      // "1.2K"
 * formatViewCount(1234567)   // "1.2M"
 * formatViewCount(567)       // "567"
 */
export const formatViewCount = (count) => {
  if (!count || count < 0) return '0';
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
};

/**
 * Format like count to human-readable format
 * Same as formatViewCount but with different context
 * 
 * @param {number} count - Like count
 * @returns {string} Formatted count
 */
export const formatLikeCount = (count) => {
  return formatViewCount(count);
};

/**
 * Get YouTube thumbnail URL from video ID
 * Returns different quality options
 * 
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality: 'default', 'medium', 'high', 'standard', 'maxres'
 * @returns {string} Thumbnail URL
 * 
 * @example
 * getYouTubeThumbnail('dQw4w9WgXcQ', 'high')
 * // "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
 */
export const getYouTubeThumbnail = (videoId, quality = 'high') => {
  if (!videoId) return '';
  
  const qualityMap = {
    'default': 'default.jpg',      // 120x90
    'medium': 'mqdefault.jpg',     // 320x180
    'high': 'hqdefault.jpg',       // 480x360
    'standard': 'sddefault.jpg',   // 640x480
    'maxres': 'maxresdefault.jpg'  // 1280x720
  };
  
  const filename = qualityMap[quality] || qualityMap['high'];
  return `https://img.youtube.com/vi/${videoId}/${filename}`;
};

/**
 * Get YouTube watch URL from video ID
 * 
 * @param {string} videoId - YouTube video ID
 * @returns {string} YouTube watch URL
 */
export const getYouTubeWatchUrl = (videoId) => {
  if (!videoId) return '';
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Get YouTube embed URL from video ID
 * 
 * @param {string} videoId - YouTube video ID
 * @param {Object} options - Embed options
 * @param {boolean} options.autoplay - Auto-play video (default: false)
 * @param {boolean} options.controls - Show player controls (default: true)
 * @param {number} options.start - Start time in seconds
 * @returns {string} YouTube embed URL
 */
export const getYouTubeEmbedUrl = (videoId, options = {}) => {
  if (!videoId) return '';
  
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.controls === false) params.append('controls', '0');
  if (options.start) params.append('start', options.start.toString());
  
  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? '?' + queryString : ''}`;
};

/**
 * Calculate reading time for webinar description
 * Assumes average reading speed of 200 words per minute
 * 
 * @param {string} description - Webinar description text
 * @returns {number} Estimated reading time in minutes
 */
export const calculateReadingTime = (description) => {
  if (!description) return 0;
  
  const wordsPerMinute = 200;
  const wordCount = description.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readingTime;
};

/**
 * Truncate text to a specified length with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Get webinar status badge info
 * Returns color and label based on webinar status
 * 
 * @param {Object} webinar - Webinar object
 * @param {boolean} webinar.is_published - Published status
 * @param {boolean} webinar.is_featured - Featured status
 * @returns {Object} Badge info { color, label }
 */
export const getWebinarStatusBadge = (webinar) => {
  if (!webinar) return { color: 'gray', label: 'Unknown' };
  
  if (!webinar.is_published) {
    return { color: 'yellow', label: 'Draft' };
  }
  
  if (webinar.is_featured) {
    return { color: 'purple', label: 'Featured' };
  }
  
  return { color: 'green', label: 'Published' };
};

/**
 * Sort webinars by different criteria
 * 
 * @param {Array} webinars - Array of webinar objects
 * @param {string} sortBy - Sort criteria: 'newest', 'oldest', 'popular', 'title', 'duration'
 * @returns {Array} Sorted webinars array
 */
export const sortWebinars = (webinars, sortBy = 'newest') => {
  if (!webinars || !Array.isArray(webinars)) return [];
  
  const sorted = [...webinars];
  
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    case 'popular':
      return sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    
    case 'title':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    
    case 'duration':
      return sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

/**
 * Filter webinars by search query
 * Searches in title and description
 * 
 * @param {Array} webinars - Array of webinar objects
 * @param {string} query - Search query
 * @returns {Array} Filtered webinars array
 */
export const filterWebinarsBySearch = (webinars, query) => {
  if (!webinars || !Array.isArray(webinars)) return [];
  if (!query) return webinars;
  
  const lowerQuery = query.toLowerCase();
  
  return webinars.filter(webinar => {
    const title = (webinar.title || '').toLowerCase();
    const description = (webinar.description || '').toLowerCase();
    
    return title.includes(lowerQuery) || description.includes(lowerQuery);
  });
};

/**
 * Group webinars by category
 * 
 * @param {Array} webinars - Array of webinar objects
 * @returns {Object} Webinars grouped by category
 * 
 * @example
 * groupWebinarsByCategory(webinars)
 * // { Technology: [...], Business: [...], Design: [...] }
 */
export const groupWebinarsByCategory = (webinars) => {
  if (!webinars || !Array.isArray(webinars)) return {};
  
  return webinars.reduce((groups, webinar) => {
    const category = webinar.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(webinar);
    return groups;
  }, {});
};

/**
 * Check if a webinar is new (created within last 7 days)
 * 
 * @param {Object} webinar - Webinar object
 * @returns {boolean} True if webinar is new
 */
export const isNewWebinar = (webinar) => {
  if (!webinar || !webinar.created_at) return false;
  
  const createdDate = new Date(webinar.created_at);
  const now = new Date();
  const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  
  return diffDays <= 7;
};

/**
 * Get webinar engagement rate (likes per view)
 * 
 * @param {Object} webinar - Webinar object
 * @returns {number} Engagement rate as percentage (0-100)
 */
export const getEngagementRate = (webinar) => {
  if (!webinar || !webinar.view_count || webinar.view_count === 0) return 0;
  
  const likeCount = webinar.like_count || 0;
  const viewCount = webinar.view_count;
  
  return Math.round((likeCount / viewCount) * 100);
};

// Default export with all utilities
export default {
  isValidYouTubeUrl,
  extractVideoIdForDisplay,
  formatDuration,
  parseDuration,
  formatViewCount,
  formatLikeCount,
  getYouTubeThumbnail,
  getYouTubeWatchUrl,
  getYouTubeEmbedUrl,
  calculateReadingTime,
  truncateText,
  getWebinarStatusBadge,
  sortWebinars,
  filterWebinarsBySearch,
  groupWebinarsByCategory,
  isNewWebinar,
  getEngagementRate
};
