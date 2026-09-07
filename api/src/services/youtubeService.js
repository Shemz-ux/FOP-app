/**
 * YouTube Integration Service
 * 
 * Purpose: Isolate all YouTube-specific logic (URL parsing and YouTube Data API calls)
 * from the database layer. This service can be imported and tested with zero Postgres connection.
 * 
 * Note: Title and description are set by admins in the app, not fetched from YouTube.
 * We only fetch: thumbnail URL, duration, and validate the video exists and is embeddable.
 */

import https from 'https';

/**
 * Custom error class for YouTube API failures
 */
export class YouTubeAPIError extends Error {
  constructor(message, statusCode = 500, originalError = null) {
    super(message);
    this.name = 'YouTubeAPIError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * Extract YouTube video ID from various URL formats
 * 
 * Supported formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/v/dQw4w9WgXcQ
 * 
 * @param {string} url - YouTube URL
 * @returns {string|null} - 11-character video ID or null if invalid
 */
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Trim whitespace
  url = url.trim();

  // Patterns to match various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      // Validate the extracted ID is exactly 11 characters and matches expected format
      if (videoId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
  }

  return null;
};

/**
 * Convert ISO 8601 duration format to seconds
 * 
 * YouTube returns duration as ISO 8601 format (e.g., PT1H2M10S)
 * This converts it to total seconds for easier storage and display
 * 
 * Examples:
 * - PT1H2M10S -> 3730 seconds (1 hour, 2 minutes, 10 seconds)
 * - PT30M -> 1800 seconds (30 minutes)
 * - PT45S -> 45 seconds
 * 
 * @param {string} iso - ISO 8601 duration string
 * @returns {number} - Total seconds
 */
export const parseISO8601DurationToSeconds = (iso) => {
  if (!iso || typeof iso !== 'string') {
    return 0;
  }

  // Match ISO 8601 duration format: PT[hours]H[minutes]M[seconds]S
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) {
    return 0;
  }

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return (hours * 3600) + (minutes * 60) + seconds;
};

/**
 * Fetch video metadata from YouTube Data API
 * 
 * Makes a single API call to fetch essential video metadata.
 * Note: Title and description are NOT fetched - admins set these in the app.
 * 
 * @param {string} videoId - YouTube video ID (11 characters)
 * @returns {Promise<Object|null>} - Video metadata or null if video not found
 * @throws {YouTubeAPIError} - If API call fails (network error, missing key, etc.)
 * 
 * Returns object with:
 * - thumbnailUrl: string - Best available thumbnail URL
 * - durationSeconds: number - Video duration in seconds
 * - publishedAt: string - ISO 8601 date string
 */
export const fetchVideoMetadata = (videoId) => {
  return new Promise((resolve, reject) => {
    // Validate API key is configured
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return reject(new YouTubeAPIError(
        'YouTube API key not configured',
        500
      ));
    }

    // Validate video ID format
    if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
      return reject(new YouTubeAPIError(
        'Invalid video ID format',
        400
      ));
    }

    // Build API URL
    const baseUrl = process.env.YOUTUBE_API_BASE_URL || 'https://www.googleapis.com/youtube/v3';
    const endpoint = '/videos';
    const params = new URLSearchParams({
      part: 'contentDetails,snippet',
      id: videoId,
      key: apiKey
    });

    const url = `${baseUrl}${endpoint}?${params.toString()}`;

    // Make HTTPS request
    https.get(url, (res) => {
      let data = '';

      // Handle non-2xx responses
      if (res.statusCode === 403) {
        return reject(new YouTubeAPIError(
          'YouTube API access forbidden - check API key restrictions',
          403
        ));
      }

      if (res.statusCode === 429) {
        return reject(new YouTubeAPIError(
          'YouTube API rate limit exceeded',
          429
        ));
      }

      if (res.statusCode !== 200) {
        return reject(new YouTubeAPIError(
          `YouTube API returned status ${res.statusCode}`,
          res.statusCode
        ));
      }

      // Collect response data
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Parse response when complete
      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          // Check if video exists
          if (!response.items || response.items.length === 0) {
            // Video not found - this is NOT an error, return null
            return resolve(null);
          }

          const video = response.items[0];
          const snippet = video.snippet;
          const contentDetails = video.contentDetails;

          // Extract thumbnail URL (prefer highest resolution available)
          let thumbnailUrl = snippet.thumbnails.default?.url;
          if (snippet.thumbnails.high) {
            thumbnailUrl = snippet.thumbnails.high.url;
          }
          if (snippet.thumbnails.maxres) {
            thumbnailUrl = snippet.thumbnails.maxres.url;
          }

          // Convert duration to seconds
          const durationSeconds = parseISO8601DurationToSeconds(contentDetails.duration);

          // Return minimal metadata
          resolve({
            thumbnailUrl,
            durationSeconds,
            publishedAt: snippet.publishedAt
          });

        } catch (parseError) {
          reject(new YouTubeAPIError(
            'Failed to parse YouTube API response',
            502,
            parseError
          ));
        }
      });

    }).on('error', (error) => {
      reject(new YouTubeAPIError(
        'Network error calling YouTube API',
        503,
        error
      ));
    });
  });
};

export default {
  extractYouTubeId,
  parseISO8601DurationToSeconds,
  fetchVideoMetadata,
  YouTubeAPIError
};
