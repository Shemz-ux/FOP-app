/**
 * Webinar Service Layer
 * 
 * Purpose: Orchestrate business logic between controllers, database, and YouTube API.
 * This service sits between controllers and the database/YouTube service.
 * 
 * Controllers should ONLY call this service, never the DB or YouTube service directly.
 */

import db from '../db/db.js';
import {
  extractYouTubeId,
  fetchVideoMetadata,
  YouTubeAPIError
} from './youtubeService.js';
import {
  createWebinar as createWebinarModel,
  updateWebinar as updateWebinarModel,
  fetchWebinarById,
  deleteWebinar as deleteWebinarModel
} from '../models/webinars.js';

/**
 * Custom error for validation failures (user-facing errors)
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
  }
}

/**
 * Custom error for duplicate resources
 */
export class DuplicateError extends ValidationError {
  constructor(message, field = 'youtube_video_id') {
    super(message, field);
    this.name = 'DuplicateError';
    this.statusCode = 409;
  }
}

/**
 * Custom error for not found resources
 */
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Check if a video ID already exists in the database
 * 
 * IMPORTANT: This should be called BEFORE making any YouTube API calls
 * to avoid wasting API quota on duplicate submissions.
 * 
 * @param {string} videoId - YouTube video ID (11 characters)
 * @returns {Promise<boolean>} - True if video exists, false otherwise
 */
export const checkDuplicate = async (videoId) => {
  if (!videoId || typeof videoId !== 'string') {
    return false;
  }

  try {
    const result = await db.query(
      'SELECT youtube_video_id FROM webinars WHERE youtube_video_id = $1',
      [videoId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking duplicate:', error);
    throw error;
  }
};

/**
 * Create a new webinar from a YouTube URL
 * 
 * This is the main creation flow. Order of operations matters:
 * 1. Extract video ID from URL
 * 2. Check for duplicates (BEFORE YouTube API call)
 * 3. Fetch metadata from YouTube
 * 4. Insert to database
 * 
 * @param {string} youtubeUrl - Full YouTube URL
 * @param {number} adminId - ID of admin creating the webinar
 * @param {Object} webinarData - Additional webinar data
 * @param {string} webinarData.title - Webinar title (set by admin)
 * @param {string} webinarData.description - Webinar description (set by admin)
 * @param {string} webinarData.category - Webinar category
 * @param {boolean} [webinarData.is_published=false] - Publish immediately
 * @param {boolean} [webinarData.is_featured=false] - Mark as featured
 * @returns {Promise<Object>} - Created webinar object
 * @throws {ValidationError} - If URL is invalid or video not found
 * @throws {DuplicateError} - If video already exists
 * @throws {YouTubeAPIError} - If YouTube API call fails
 */
export const createFromURL = async (youtubeUrl, adminId, webinarData = {}) => {
  // Step 1: Extract video ID
  const videoId = extractYouTubeId(youtubeUrl);
  
  if (!videoId) {
    throw new ValidationError(
      'Invalid YouTube URL format. Please provide a valid YouTube video URL.',
      'youtube_url'
    );
  }

  // Step 2: Check for duplicate BEFORE making YouTube API call
  const isDuplicate = await checkDuplicate(videoId);
  
  if (isDuplicate) {
    throw new DuplicateError(
      'This video has already been added to the webinars.',
      'youtube_video_id'
    );
  }

  // Step 3: Fetch metadata from YouTube
  let metadata;
  try {
    metadata = await fetchVideoMetadata(videoId);
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      // Re-throw YouTube API errors as-is
      throw error;
    }
    // Wrap unexpected errors
    throw new Error(`Failed to fetch video metadata: ${error.message}`);
  }

  // If metadata is null, video doesn't exist or is private
  if (!metadata) {
    throw new ValidationError(
      'Video not found or is set to private. Please ensure the video exists and is set to Unlisted or Public.',
      'youtube_url'
    );
  }

  // Validate required fields from admin
  if (!webinarData.title || webinarData.title.trim().length === 0) {
    throw new ValidationError('Title is required', 'title');
  }

  if (!webinarData.category || webinarData.category.trim().length === 0) {
    throw new ValidationError('Category is required', 'category');
  }

  // Step 4: Insert to database
  const webinarToCreate = {
    youtube_video_id: videoId,
    youtube_url: youtubeUrl,
    title: webinarData.title.trim(),
    description: webinarData.description?.trim() || '',
    category: webinarData.category.trim(),
    thumbnail_url: metadata.thumbnailUrl,
    duration: metadata.durationSeconds,
    published_at: metadata.publishedAt,
    view_count: 0, // App tracks its own views
    like_count: 0,
    metadata_synced_at: new Date().toISOString(),
    uploaded_by: adminId,
    is_published: webinarData.is_published || false,
    is_featured: webinarData.is_featured || false
  };

  try {
    const createdWebinar = await createWebinarModel(webinarToCreate);
    return createdWebinar;
  } catch (error) {
    // Handle database errors
    if (error.code === '23505') {
      // Unique constraint violation (shouldn't happen due to our check, but just in case)
      throw new DuplicateError('This video has already been added.');
    }
    console.error('Database error creating webinar:', error);
    throw new Error('Failed to create webinar in database');
  }
};

/**
 * Resync metadata from YouTube for an existing webinar
 * 
 * This re-fetches thumbnail, duration, and published date from YouTube
 * and updates the cached fields in the database.
 * 
 * Note: Title and description are NOT updated (admins control these).
 * 
 * @param {number} webinarId - ID of webinar to resync
 * @returns {Promise<Object>} - Updated webinar object
 * @throws {NotFoundError} - If webinar doesn't exist
 * @throws {YouTubeAPIError} - If YouTube API call fails
 */
export const resyncMetadata = async (webinarId) => {
  // Step 1: Fetch existing webinar
  const existingWebinar = await fetchWebinarById(webinarId);
  
  if (!existingWebinar) {
    throw new NotFoundError('Webinar not found');
  }

  // Step 2: Re-fetch metadata from YouTube
  let metadata;
  try {
    metadata = await fetchVideoMetadata(existingWebinar.youtube_video_id);
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      throw error;
    }
    throw new Error(`Failed to fetch video metadata: ${error.message}`);
  }

  if (!metadata) {
    throw new ValidationError(
      'Video no longer available or is now private',
      'youtube_video_id'
    );
  }

  // Step 3: Update cached fields (NOT title/description - admins control those)
  const updates = {
    thumbnail_url: metadata.thumbnailUrl,
    duration: metadata.durationSeconds,
    published_at: metadata.publishedAt,
    metadata_synced_at: new Date().toISOString()
  };

  try {
    const updatedWebinar = await updateWebinarModel(updates, webinarId);
    return updatedWebinar;
  } catch (error) {
    if (error.status === 404) {
      throw new NotFoundError('Webinar not found');
    }
    console.error('Database error updating webinar:', error);
    throw new Error('Failed to update webinar in database');
  }
};

/**
 * Get a single webinar by ID
 * 
 * @param {number} webinarId - Webinar ID
 * @returns {Promise<Object|null>} - Webinar object or null if not found
 */
export const getById = async (webinarId) => {
  try {
    const webinar = await fetchWebinarById(webinarId);
    return webinar || null;
  } catch (error) {
    console.error('Error fetching webinar by ID:', error);
    throw error;
  }
};

/**
 * Update webinar status (publish/unpublish)
 * 
 * @param {number} webinarId - Webinar ID
 * @param {boolean} isPublished - New published status
 * @returns {Promise<Object>} - Updated webinar object
 * @throws {NotFoundError} - If webinar doesn't exist
 */
export const updateStatus = async (webinarId, isPublished) => {
  if (typeof isPublished !== 'boolean') {
    throw new ValidationError('is_published must be a boolean', 'is_published');
  }

  try {
    const updatedWebinar = await updateWebinarModel(
      { is_published: isPublished },
      webinarId
    );
    return updatedWebinar;
  } catch (error) {
    if (error.status === 404) {
      throw new NotFoundError('Webinar not found');
    }
    console.error('Error updating webinar status:', error);
    throw error;
  }
};

/**
 * Delete a webinar
 * 
 * @param {number} webinarId - Webinar ID
 * @returns {Promise<Object>} - Deleted webinar object
 * @throws {NotFoundError} - If webinar doesn't exist
 */
export const deleteWebinar = async (webinarId) => {
  try {
    const deletedWebinar = await deleteWebinarModel(webinarId);
    return deletedWebinar;
  } catch (error) {
    if (error.status === 404) {
      throw new NotFoundError('Webinar not found');
    }
    console.error('Error deleting webinar:', error);
    throw error;
  }
};

export default {
  checkDuplicate,
  createFromURL,
  resyncMetadata,
  getById,
  updateStatus,
  deleteWebinar,
  ValidationError,
  DuplicateError,
  NotFoundError
};
