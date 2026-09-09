import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from '../api';
import {
  isValidYouTubeUrl,
  extractVideoIdForDisplay,
  formatDuration,
  formatViewCount
} from '../../utils/webinarUtils';

/**
 * Webinars Service
 * 
 * This service layer handles all webinar-related API calls.
 * It NEVER calls YouTube APIs directly - all data comes from our backend's cached data.
 * No YouTube API key is used or stored in the frontend.
 */

// ============================================================================
// PUBLIC ROUTES (Student-facing, published webinars only)
// ============================================================================

/**
 * Get all published webinars with comprehensive server-side filtering
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Search in title and description
 * @param {string} filters.category - Filter by category (exact match)
 * @param {boolean} filters.is_featured - Filter by featured status
 * @param {string} filters.sort - Sort by: 'newest', 'oldest', 'popular', 'title' (default: 'newest')
 * @param {number} filters.page - Page number for pagination (default: 1)
 * @param {number} filters.limit - Results per page (default: 12, max: 50)
 * @returns {Promise<Object>} { webinars: Array, pagination: Object }
 */
export const listWebinars = async (filters = {}) => {
  // Ensure only published webinars are returned for public access
  const publicFilters = {
    ...filters,
    is_published: true
  };
  
  const queryString = buildQueryString(publicFilters);
  const data = await apiGet(`/webinars${queryString}`);
  return data;
};

/**
 * Get featured webinars only (published and featured)
 * @param {number} limit - Number of featured webinars to fetch (default: 6)
 * @returns {Promise<Object>} { webinars: Array, pagination: Object }
 */
export const getFeaturedWebinars = async (limit = 6) => {
  const data = await apiGet(`/webinars?is_published=true&is_featured=true&limit=${limit}&sort=newest`);
  return data;
};

/**
 * Get webinars by category (published only)
 * @param {string} category - Category name
 * @param {Object} options - Additional options (page, limit, sort)
 * @returns {Promise<Object>} { webinars: Array, pagination: Object }
 */
export const getWebinarsByCategory = async (category, options = {}) => {
  const filters = {
    category,
    is_published: true,
    ...options
  };
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/webinars${queryString}`);
  return data;
};

/**
 * Get available webinar categories (for filter dropdown)
 * @returns {Promise<Array>} Array of { category: string, count: number }
 */
export const getWebinarCategories = async () => {
  const data = await apiGet('/webinars/categories');
  return data.categories || [];
};

/**
 * Get single webinar by ID (published only for public access)
 * Returns full webinar details including youtubeVideoId for player
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Webinar object with all cached metadata
 */
export const getWebinar = async (webinarId) => {
  const data = await apiGet(`/webinars/${webinarId}`);
  return data.webinar;
};

/**
 * Track webinar view (increments view count)
 * Call this when a user actually starts watching the video
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Updated webinar object
 */
export const trackWebinarView = async (webinarId) => {
  const data = await apiPost(`/webinars/${webinarId}/view`);
  return data.webinar;
};

// ============================================================================
// ADMIN ROUTES (Protected, require admin authentication)
// ============================================================================

/**
 * Get all webinars including unpublished (admin only)
 * @param {Object} filters - Filter parameters (same as listWebinars but without is_published forced)
 * @returns {Promise<Object>} { webinars: Array, pagination: Object }
 */
export const getAllWebinarsAdmin = async (filters = {}) => {
  // Don't force is_published=true for admin view
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/webinars${queryString}`);
  return data;
};

/**
 * Get single webinar by ID (admin - can view unpublished)
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Webinar object
 */
export const getWebinarAdmin = async (webinarId) => {
  const data = await apiGet(`/webinars/${webinarId}`);
  return data.webinar;
};

/**
 * Create new webinar from YouTube URL (admin only)
 * Backend will extract video ID and fetch metadata from YouTube
 * @param {Object} webinarData - Webinar creation data
 * @param {string} webinarData.youtube_url - Full YouTube URL (required)
 * @param {string} webinarData.category - Category (optional, can be set later)
 * @param {boolean} webinarData.is_published - Publish immediately (default: false)
 * @param {boolean} webinarData.is_featured - Feature this webinar (default: false)
 * @returns {Promise<Object>} Created webinar object
 */
export const createWebinar = async (webinarData) => {
  const data = await apiPost('/webinars', webinarData);
  return data.webinar;
};

/**
 * Update webinar fields (admin only)
 * Can update: title, description, category, is_published, is_featured
 * @param {number|string} webinarId - Webinar ID
 * @param {Object} updates - Fields to update
 * @param {string} updates.title - Override title
 * @param {string} updates.description - Override description
 * @param {string} updates.category - Change category
 * @param {boolean} updates.is_published - Publish/unpublish
 * @param {boolean} updates.is_featured - Feature/unfeature
 * @returns {Promise<Object>} Updated webinar object
 */
export const updateWebinar = async (webinarId, updates) => {
  const data = await apiPatch(`/webinars/${webinarId}`, updates);
  return data.webinar;
};

/**
 * Publish a webinar (convenience method)
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Updated webinar object
 */
export const publishWebinar = async (webinarId) => {
  return updateWebinar(webinarId, { is_published: true });
};

/**
 * Unpublish a webinar (convenience method)
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Updated webinar object
 */
export const unpublishWebinar = async (webinarId) => {
  return updateWebinar(webinarId, { is_published: false });
};

/**
 * Toggle featured status (convenience method)
 * @param {number|string} webinarId - Webinar ID
 * @param {boolean} isFeatured - Featured status
 * @returns {Promise<Object>} Updated webinar object
 */
export const toggleFeatured = async (webinarId, isFeatured) => {
  return updateWebinar(webinarId, { is_featured: isFeatured });
};

/**
 * Update webinar category (convenience method)
 * @param {number|string} webinarId - Webinar ID
 * @param {string} category - New category
 * @returns {Promise<Object>} Updated webinar object
 */
export const updateWebinarCategory = async (webinarId, category) => {
  return updateWebinar(webinarId, { category });
};

/**
 * Delete webinar (admin only)
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteWebinar = async (webinarId) => {
  const data = await apiDelete(`/webinars/${webinarId}`);
  return data;
};

/**
 * Resync webinar metadata from YouTube (admin only)
 * Re-fetches title, description, thumbnail, duration, etc. from YouTube
 * Useful if video details changed on YouTube
 * @param {number|string} webinarId - Webinar ID
 * @returns {Promise<Object>} Updated webinar object with fresh metadata
 */
export const resyncWebinar = async (webinarId) => {
  // Note: If backend implements a dedicated resync endpoint, use that
  // For now, we can trigger a PATCH with a flag or use the existing update
  // Check with backend team on the exact endpoint
  const data = await apiPost(`/webinars/${webinarId}/resync`);
  return data.webinar;
};

// ============================================================================
// RE-EXPORT UTILITY FUNCTIONS
// ============================================================================

// Re-export utility functions from webinarUtils for convenience
// These are now maintained in /utils/webinarUtils.js for better separation of concerns
export {
  isValidYouTubeUrl,
  extractVideoIdForDisplay,
  formatDuration,
  formatViewCount
};
